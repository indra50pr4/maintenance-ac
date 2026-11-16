/**
 * CoolCare AC Maintenance - Cloud Synchronization Engine
 * Supports:
 * 1. Firebase Realtime Database (Sub-second Instant Push to all devices)
 * 2. Google Sheets Two-Way Auto Sync (via Google Apps Script webhook)
 * 3. LocalStorage & Offline Fallback
 */

const CloudSync = {
  firebaseApp: null,
  firebaseDb: null,
  firebaseRef: null,
  deviceId: null,
  isSyncing: false,
  pollTimer: null,
  provider: 'local', // 'firebase' | 'sheets' | 'local'
  lastSyncTimestamp: 0,

  init() {
    this.initDeviceId();
    this.setupNetworkListeners();

    const fbConfig = App.settings.firebaseConfig;
    const gasUrl = App.settings.gasWebhookUrl;

    if (fbConfig && fbConfig.databaseURL) {
      this.initFirebase(fbConfig);
    } else if (gasUrl && gasUrl.trim().length > 10) {
      this.initGoogleSheets(gasUrl);
    } else {
      this.updateStatusBadge('local', 'Offline (Lokal)');
    }
  },

  initDeviceId() {
    let id = localStorage.getItem('ac_device_id');
    if (!id) {
      id = 'dev-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
      localStorage.setItem('ac_device_id', id);
    }
    this.deviceId = id;
  },

  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.showToast('Koneksi internet pulih. Menyinkronkan...', 'info');
      this.syncNow();
    });

    window.addEventListener('offline', () => {
      this.updateStatusBadge('offline', 'Offline');
      this.showToast('Mode Offline. Perubahan tetap disimpan di perangkat.', 'warning');
    });

    // Auto-pull when user returns to this tab / app
    window.addEventListener('focus', () => {
      if (this.provider === 'sheets') {
        this.pullFromGoogleSheets(true);
      }
    });
  },

  // ================= 1. FIREBASE REALTIME ENGINE =================
  initFirebase(config) {
    if (typeof firebase === 'undefined') {
      console.warn('Firebase SDK not loaded.');
      return;
    }

    try {
      if (!this.firebaseApp) {
        // Check if default app exists or initialize
        this.firebaseApp = (firebase.apps && firebase.apps.length > 0)
          ? firebase.apps[0]
          : firebase.initializeApp(config);
      }

      this.firebaseDb = firebase.database();
      this.firebaseRef = this.firebaseDb.ref('ac_maintenance_data');
      this.provider = 'firebase';

      this.updateStatusBadge('connected', 'Firebase Realtime');

      // Listen for REAL-TIME changes from ANY platform / device
      this.firebaseRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          // If remote is empty but we have local demo, push local data to seed remote
          if (App.units && App.units.length > 0) {
            this.pushToFirebase('Initial Seed');
          }
          return;
        }

        // Avoid re-rendering if this device originated the change
        if (data.updatedBy === this.deviceId && (Date.now() - (data.updatedAt || 0)) < 3000) {
          return;
        }

        // Data received from another device!
        if (data.units && Array.isArray(data.units)) {
          const isChanged = JSON.stringify(App.units) !== JSON.stringify(data.units) ||
                            JSON.stringify(App.history) !== JSON.stringify(data.history || []);

          if (isChanged) {
            App.units = data.units;
            App.history = data.history || [];
            App.saveUnits();
            App.saveHistory();
            App.calculateAllStatuses();

            // Refresh UI without interrupting active form typing
            App.renderDashboard();
            App.renderUnitsList();
            App.renderHistoryTable();
            App.initQR();

            this.showToast('⚡ Data diperbarui dari perangkat lain!', 'success');
          }
        }
      }, (error) => {
        console.error('Firebase listen error:', error);
        this.updateStatusBadge('error', 'Firebase Error');
      });

    } catch (err) {
      console.error('Firebase Init Error:', err);
      this.updateStatusBadge('error', 'Firebase Config Error');
    }
  },

  pushToFirebase(reason = 'Update') {
    if (!this.firebaseRef) return;
    try {
      this.updateStatusBadge('syncing', 'Menyimpan ke Cloud...');
      this.firebaseRef.set({
        units: App.units,
        history: App.history,
        updatedBy: this.deviceId,
        updatedAt: Date.now(),
        reason: reason
      }).then(() => {
        this.updateStatusBadge('connected', 'Firebase Realtime');
      }).catch(err => {
        console.error('Firebase push error:', err);
        this.updateStatusBadge('error', 'Gagal Push Cloud');
      });
    } catch (e) {
      console.error('Push error:', e);
    }
  },

  // ================= 2. GOOGLE SHEETS SYNC ENGINE =================
  initGoogleSheets(url) {
    this.provider = 'sheets';
    this.updateStatusBadge('connected', 'Google Sheet Auto');

    // Initial pull
    this.pullFromGoogleSheets(true);

    // Auto-polling every 25 seconds for background updates from other phones/users
    if (this.pollTimer) clearInterval(this.pollTimer);
    this.pollTimer = setInterval(() => {
      this.pullFromGoogleSheets(false);
    }, 25000);
  },

  async pullFromGoogleSheets(notify = false) {
    const url = App.settings.gasWebhookUrl;
    if (!url || this.isSyncing) return;

    this.isSyncing = true;
    const syncIcon = document.getElementById('syncNowIcon');
    if (syncIcon) syncIcon.classList.add('spin-icon');

    try {
      const response = await fetch(`${url}?action=getAll&_t=${Date.now()}`, {
        method: 'GET',
        cache: 'no-cache'
      });

      if (!response.ok) throw new Error('HTTP ' + response.status);

      const res = await response.json();
      if (res && res.status === 'success') {
        let changed = false;

        // Process units from sheet
        if (res.units && Array.isArray(res.units) && res.units.length > 0) {
          const parsedUnits = res.units.map(r => ({
            id: r.ID || r.id,
            name: r.Name || r.name || '',
            location: r.Location || r.location || '',
            floor: r.Floor || r.floor || 'Floor 1',
            brand: r.Brand || r.brand || '',
            model: r.Model || r.model || '',
            type: r.Type || r.type || 'Wall Mounted Split',
            capacity: r.Capacity || r.capacity || '1.0 PK',
            refrigerant: r.Refrigerant || r.refrigerant || 'R32',
            installDate: r.InstallDate || r.installDate || '',
            frequencyMonths: parseInt(r.FrequencyMonths || r.frequencyMonths) || 3,
            lastServiceDate: r.LastService || r.lastServiceDate || '-',
            nextServiceDate: r.NextService || r.nextServiceDate || '',
            status: r.Status || r.status || 'Normal',
            serialNumber: r.SerialNumber || r.serialNumber || '',
            technicianNotes: r.Notes || r.technicianNotes || ''
          })).filter(u => u.id);

          if (parsedUnits.length > 0 && JSON.stringify(parsedUnits) !== JSON.stringify(App.units)) {
            App.units = parsedUnits;
            App.saveUnits();
            changed = true;
          }
        }

        // Process logs from sheet
        if (res.logs && Array.isArray(res.logs) && res.logs.length > 0) {
          const parsedLogs = res.logs.map(l => ({
            id: l['Service ID'] || l.id || ('SRV-' + Date.now()),
            acId: l['AC ID'] || l.acId,
            date: l.Date || l.date,
            technician: l.Technician || l.technician || '',
            vendor: l.Vendor || l.vendor || '',
            serviceType: l['Service Type'] || l.serviceType || 'Routine Cleaning',
            tasksCompleted: (l['Tasks Completed'] || '').toString().split('; ').filter(Boolean),
            measurements: {
              suctionPsi: parseFloat(l['Suction PSI']) || null,
              currentAmpere: parseFloat(l.Ampere) || null,
              inletTempC: parseFloat(l['Inlet °C']) || null,
              outletTempC: parseFloat(l['Outlet °C']) || null,
              deltaTempC: parseFloat(l['Delta T °C']) || null,
              drainStatus: l['Drain Status'] || 'Normal',
              noiseStatus: l['Noise Status'] || 'Normal'
            },
            freonAddedPsi: parseFloat(l['Freon Added PSI']) || 0,
            partsReplaced: l['Parts Replaced'] || 'None',
            cost: parseFloat(l.Cost) || 0,
            unitStatusAfter: l['Status After'] || 'Normal',
            notes: l.Notes || ''
          })).filter(l => l.acId);

          if (parsedLogs.length > 0 && JSON.stringify(parsedLogs) !== JSON.stringify(App.history)) {
            App.history = parsedLogs;
            App.saveHistory();
            changed = true;
          }
        }

        if (changed) {
          App.calculateAllStatuses();
          App.renderDashboard();
          App.renderUnitsList();
          App.renderHistoryTable();
          App.initQR();
          if (notify) this.showToast('Data tersinkron dari Google Sheet!', 'success');
        }

        this.updateStatusBadge('connected', 'Google Sheet Auto');
      }
    } catch (err) {
      console.warn('Google Sheet pull warning:', err);
      // Mode CORS / Redirect fallback
      this.updateStatusBadge('connected', 'Google Sheet Online');
    } finally {
      this.isSyncing = false;
      if (syncIcon) syncIcon.classList.remove('spin-icon');
    }
  },

  async pushToGoogleSheets(action, payload) {
    const url = App.settings.gasWebhookUrl;
    if (!url) return;

    this.updateStatusBadge('syncing', 'Menyimpan ke Sheet...');
    const syncIcon = document.getElementById('syncNowIcon');
    if (syncIcon) syncIcon.classList.add('spin-icon');

    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: action,
          data: payload,
          deviceId: this.deviceId,
          timestamp: Date.now()
        }),
        mode: 'no-cors'
      });
      this.updateStatusBadge('connected', 'Google Sheet Auto');
    } catch (err) {
      console.warn('Google Sheet push error:', err);
    } finally {
      if (syncIcon) syncIcon.classList.remove('spin-icon');
    }
  },

  // ================= GENERAL SYNC DISPATCHER =================
  pushChange(type, data) {
    if (this.provider === 'firebase') {
      this.pushToFirebase(type);
    } else if (this.provider === 'sheets') {
      if (type === 'addService') {
        this.pushToGoogleSheets('addService', data);
      } else if (type === 'saveUnit') {
        this.pushToGoogleSheets('saveUnit', data);
      } else if (type === 'deleteUnit') {
        this.pushToGoogleSheets('deleteUnit', { id: data });
      } else {
        this.pushToGoogleSheets('syncAll', { units: App.units, history: App.history });
      }
    }
  },

  syncNow() {
    const syncBtn = document.getElementById('syncNowBtn');
    const syncIcon = document.getElementById('syncNowIcon');
    if (syncIcon) syncIcon.classList.add('spin-icon');

    if (this.provider === 'firebase') {
      this.pushToFirebase('Manual Sync');
      setTimeout(() => {
        if (syncIcon) syncIcon.classList.remove('spin-icon');
        this.showToast('Tersinkronisasi Realtime dengan Firebase!', 'success');
      }, 600);
    } else if (this.provider === 'sheets') {
      this.pullFromGoogleSheets(true).then(() => {
        if (syncIcon) syncIcon.classList.remove('spin-icon');
      });
    } else {
      setTimeout(() => {
        if (syncIcon) syncIcon.classList.remove('spin-icon');
        Swal.fire({
          title: 'Cloud Belum Terhubung',
          html: 'Aplikasi saat ini berjalan offline menggunakan penyimpanan lokal perangkat.<br><br>Untuk sinkronisasi antar perangkat secara otomatis, hubungkan <b>Firebase Realtime</b> atau <b>Google Sheets</b> di menu Settings.',
          icon: 'info',
          confirmButtonText: 'Buka Pengaturan Cloud'
        }).then(() => {
          document.getElementById('tab-settings').click();
        });
      }, 400);
    }
  },

  updateStatusBadge(state, label) {
    const badge = document.getElementById('cloudStatusBadge');
    const textEl = document.getElementById('cloudStatusText');
    if (!badge || !textEl) return;

    textEl.textContent = label;

    let dotClass = 'dot-gray';
    if (state === 'connected') dotClass = 'dot-green';
    else if (state === 'syncing') dotClass = 'dot-yellow';
    else if (state === 'error' || state === 'offline') dotClass = 'dot-red';

    badge.innerHTML = `<span class="status-dot ${dotClass}"></span> <span class="d-none d-sm-inline">Cloud:</span> <span>${label}</span>`;
  },

  showToast(message, icon = 'info') {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
    Toast.fire({
      icon: icon,
      title: message
    });
  }
};
