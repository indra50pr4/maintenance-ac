/**
 * AC Maintenance System - Core Application Logic
 */

// Initial Sample Data (Realistic Enterprise Building)
const DEMO_UNITS = [
  {
    id: "AC-L1-101",
    name: "Executive Boardroom",
    location: "Main Tower, 1st Floor",
    floor: "Floor 1",
    brand: "Daikin",
    model: "FTKM25SVM4 (Inverter)",
    type: "Wall Mounted Split",
    capacity: "1.0 PK (9,000 BTU)",
    refrigerant: "R32",
    installDate: "2024-02-15",
    frequencyMonths: 3,
    lastServiceDate: "2026-08-10",
    nextServiceDate: "2026-11-10", // Overdue by a few days
    status: "Overdue",
    serialNumber: "SN-DK-902148",
    technicianNotes: "Indoor installed at 2.8m height. Requires 2m ladder."
  },
  {
    id: "AC-L1-102",
    name: "IT Server & Network Room",
    location: "Main Tower, 1st Floor",
    floor: "Floor 1",
    brand: "Mitsubishi Electric",
    model: "MSY-GR18VF",
    type: "Wall Mounted Split",
    capacity: "2.0 PK (18,000 BTU)",
    refrigerant: "R410A",
    installDate: "2023-11-01",
    frequencyMonths: 1,
    lastServiceDate: "2026-10-15",
    nextServiceDate: "2026-11-15", // Due Soon (in 2 days)
    status: "Due Soon",
    serialNumber: "SN-ME-482019",
    technicianNotes: "Critical server room. Keep redundant unit standby during wash."
  },
  {
    id: "AC-L2-201",
    name: "Finance & Accounting Office",
    location: "Main Tower, 2nd Floor",
    floor: "Floor 2",
    brand: "Panasonic",
    model: "CS-PU12XKJ",
    type: "Wall Mounted Split",
    capacity: "1.5 PK (12,000 BTU)",
    refrigerant: "R32",
    installDate: "2024-03-20",
    frequencyMonths: 3,
    lastServiceDate: "2026-09-25",
    nextServiceDate: "2026-12-25",
    status: "Normal",
    serialNumber: "SN-PN-110293",
    technicianNotes: "Drain pipe connects directly to main riser duct."
  },
  {
    id: "AC-L2-202",
    name: "Marketing Open Space",
    location: "Main Tower, 2nd Floor",
    floor: "Floor 2",
    brand: "Daikin",
    model: "FCFC71DVM (Cassette)",
    type: "Ceiling Cassette 4-Way",
    capacity: "3.0 PK (24,000 BTU)",
    refrigerant: "R32",
    installDate: "2023-08-10",
    frequencyMonths: 3,
    lastServiceDate: "2026-10-01",
    nextServiceDate: "2027-01-01",
    status: "Normal",
    serialNumber: "SN-DK-772910",
    technicianNotes: "Use ceiling drop-cloth when cleaning condensate tray."
  },
  {
    id: "AC-L3-301",
    name: "Customer Service Lounge",
    location: "Main Tower, 3rd Floor",
    floor: "Floor 3",
    brand: "LG",
    model: "Dual Cool T10EV4",
    type: "Wall Mounted Split",
    capacity: "1.0 PK (9,000 BTU)",
    refrigerant: "R410A",
    installDate: "2024-01-10",
    frequencyMonths: 2,
    lastServiceDate: "2026-08-05",
    nextServiceDate: "2026-10-05",
    status: "Overdue",
    serialNumber: "SN-LG-554109",
    technicianNotes: "Lounge gets direct afternoon sunlight from west windows."
  },
  {
    id: "AC-L3-302",
    name: "Director's Suite",
    location: "Main Tower, 3rd Floor",
    floor: "Floor 3",
    brand: "Daikin",
    model: "FTXZ25N Urusara 7",
    type: "Wall Mounted Split",
    capacity: "1.0 PK (9,000 BTU)",
    refrigerant: "R32",
    installDate: "2024-05-12",
    frequencyMonths: 3,
    lastServiceDate: "2026-10-20",
    nextServiceDate: "2027-01-20",
    status: "Normal",
    serialNumber: "SN-DK-339180",
    technicianNotes: "Premium unit with humidity control. Clean air filters gently."
  },
  {
    id: "AC-L4-401",
    name: "Cafeteria & Pantry",
    location: "Annex Building, 1st Floor",
    floor: "Annex",
    brand: "Sharp",
    model: "AH-A18UCY",
    type: "Floor Standing",
    capacity: "2.0 PK (18,000 BTU)",
    refrigerant: "R32",
    installDate: "2023-06-15",
    frequencyMonths: 1,
    lastServiceDate: "2026-11-01",
    nextServiceDate: "2026-11-17", // Due soon (within 4 days)
    status: "Due Soon",
    serialNumber: "SN-SH-992144",
    technicianNotes: "High grease and steam environment. Wash filters every 2-3 weeks."
  },
  {
    id: "AC-L4-402",
    name: "Training Center Hall",
    location: "Annex Building, 2nd Floor",
    floor: "Annex",
    brand: "Gree",
    model: "GWC-24MOO5",
    type: "Ceiling Cassette 4-Way",
    capacity: "2.5 PK (24,000 BTU)",
    refrigerant: "R32",
    installDate: "2023-09-01",
    frequencyMonths: 3,
    lastServiceDate: "2026-07-15",
    nextServiceDate: "2026-10-15",
    status: "Under Repair",
    serialNumber: "SN-GR-671239",
    technicianNotes: "Outdoor fan motor bearing worn out. Waiting for spare motor."
  }
];

const DEMO_HISTORY = [
  {
    id: "SRV-20261020-001",
    acId: "AC-L3-302",
    date: "2026-10-20T10:15",
    technician: "Rudi Hartono",
    vendor: "PT Sejuk Mandiri Teknik",
    serviceType: "Routine Cleaning",
    tasksCompleted: [
      "Cuci Indoor Unit & Filter",
      "Cuci Outdoor Condenser",
      "Pembersihan Saluran Drain"
    ],
    measurements: {
      suctionPsi: 135,
      currentAmpere: 3.2,
      inletTempC: 26.5,
      outletTempC: 14.8,
      deltaTempC: 11.7,
      drainStatus: "Lancar",
      noiseStatus: "Normal"
    },
    freonAddedPsi: 0,
    partsReplaced: "None",
    cost: 120000,
    unitStatusAfter: "Normal",
    notes: "Unit in pristine condition. Cooling delta T is 11.7°C (excellent).",
    photoUrl: ""
  },
  {
    id: "SRV-20261015-002",
    acId: "AC-L1-102",
    date: "2026-10-15T14:30",
    technician: "Ahmad Fauzi",
    vendor: "PT Cool Air Solusindo",
    serviceType: "Routine Cleaning",
    tasksCompleted: [
      "Cuci Indoor Unit & Filter",
      "Cuci Outdoor Condenser",
      "Cek Kelistrikan & Kapasitor"
    ],
    measurements: {
      suctionPsi: 140,
      currentAmpere: 6.8,
      inletTempC: 23.0,
      outletTempC: 13.2,
      deltaTempC: 9.8,
      drainStatus: "Lancar",
      noiseStatus: "Normal"
    },
    freonAddedPsi: 0,
    partsReplaced: "None",
    cost: 150000,
    unitStatusAfter: "Normal",
    notes: "Server room AC cleaned thoroughly. Airflow restored to 100%.",
    photoUrl: ""
  },
  {
    id: "SRV-20261001-003",
    acId: "AC-L2-202",
    date: "2026-10-01T09:00",
    technician: "Rudi Hartono",
    vendor: "PT Sejuk Mandiri Teknik",
    serviceType: "Routine Cleaning",
    tasksCompleted: [
      "Cuci Indoor Unit & Filter",
      "Cuci Outdoor Condenser",
      "Pembersihan Saluran Drain"
    ],
    measurements: {
      suctionPsi: 130,
      currentAmpere: 8.5,
      inletTempC: 27.0,
      outletTempC: 15.5,
      deltaTempC: 11.5,
      drainStatus: "Lancar",
      noiseStatus: "Normal"
    },
    freonAddedPsi: 0,
    partsReplaced: "None",
    cost: 250000,
    unitStatusAfter: "Normal",
    notes: "Cassette tray cleaned, drain pump tested normal.",
    photoUrl: ""
  },
  {
    id: "SRV-20260925-004",
    acId: "AC-L2-201",
    date: "2026-09-25T11:00",
    technician: "Budi Santoso",
    vendor: "PT Cool Air Solusindo",
    serviceType: "Freon Refill",
    tasksCompleted: [
      "Cuci Indoor Unit & Filter",
      "Cek Tekanan Freon",
      "Deteksi Kebocoran / Flaring Check"
    ],
    measurements: {
      suctionPsi: 135,
      currentAmpere: 4.8,
      inletTempC: 28.0,
      outletTempC: 16.0,
      deltaTempC: 12.0,
      drainStatus: "Lancar",
      noiseStatus: "Normal"
    },
    freonAddedPsi: 25,
    partsReplaced: "Re-flared flare nut on outdoor liquid line",
    cost: 350000,
    unitStatusAfter: "Normal",
    notes: "Fixed minor flare nut seepage, topped up 25 PSI R32. Cold restored.",
    photoUrl: ""
  },
  {
    id: "SRV-20260810-005",
    acId: "AC-L1-101",
    date: "2026-08-10T13:45",
    technician: "Ahmad Fauzi",
    vendor: "PT Cool Air Solusindo",
    serviceType: "Routine Cleaning",
    tasksCompleted: [
      "Cuci Indoor Unit & Filter",
      "Cuci Outdoor Condenser"
    ],
    measurements: {
      suctionPsi: 138,
      currentAmpere: 3.4,
      inletTempC: 26.8,
      outletTempC: 15.0,
      deltaTempC: 11.8,
      drainStatus: "Lancar",
      noiseStatus: "Normal"
    },
    freonAddedPsi: 0,
    partsReplaced: "None",
    cost: 120000,
    unitStatusAfter: "Normal",
    notes: "Boardroom AC cleaned. Running smoothly.",
    photoUrl: ""
  },
  {
    id: "SRV-20260715-006",
    acId: "AC-L4-402",
    date: "2026-07-15T15:20",
    technician: "Budi Santoso",
    vendor: "PT Cool Air Solusindo",
    serviceType: "Electrical / Parts",
    tasksCompleted: [
      "Cek Kelistrikan & Kapasitor",
      "Pemeriksaan Suara & Getaran Kompresor"
    ],
    measurements: {
      suctionPsi: 110,
      currentAmpere: 9.2,
      inletTempC: 29.0,
      outletTempC: 22.0,
      deltaTempC: 7.0,
      drainStatus: "Lancar",
      noiseStatus: "Bising / Getar"
    },
    freonAddedPsi: 0,
    partsReplaced: "Capacitor 35uF replaced",
    cost: 280000,
    unitStatusAfter: "Under Repair",
    notes: "Outdoor fan motor bearing making excessive loud noise. Recommended motor replacement.",
    photoUrl: ""
  }
];

const DEFAULT_SETTINGS = {
  companyName: "Grand Menara Tower Facilities",
  companyAddress: "Jl. Jenderal Sudirman Kav. 21, Jakarta Pusat",
  companyPhone: "+62 21 555-0199",
  gasWebhookUrl: "",
  lang: "id", // 'id' or 'en'
  darkMode: false
};

// Application State
const App = {
  units: [],
  history: [],
  settings: {},
  currentFilter: 'all',
  currentLocationFilter: 'all',
  searchQuery: '',
  selectedUnitForHistory: null,

  init() {
    this.loadState();
    this.calculateAllStatuses();
    this.applyTheme(this.settings.darkMode);
    this.initEventListeners();
    this.renderDashboard();
    this.renderUnitsList();
    this.renderHistoryTable();
    this.populateLocationFilter();
    this.initQR();
  },

  loadState() {
    try {
      const storedUnits = localStorage.getItem('ac_units');
      this.units = storedUnits ? JSON.parse(storedUnits) : JSON.parse(JSON.stringify(DEMO_UNITS));

      const storedHistory = localStorage.getItem('ac_history');
      this.history = storedHistory ? JSON.parse(storedHistory) : JSON.parse(JSON.stringify(DEMO_HISTORY));

      const storedSettings = localStorage.getItem('ac_settings');
      this.settings = storedSettings ? Object.assign({}, DEFAULT_SETTINGS, JSON.parse(storedSettings)) : Object.assign({}, DEFAULT_SETTINGS);

      // Save initial defaults if first run
      if (!storedUnits) this.saveUnits();
      if (!storedHistory) this.saveHistory();
      if (!storedSettings) this.saveSettings();
    } catch (e) {
      console.error('Error loading data from localStorage:', e);
      this.units = JSON.parse(JSON.stringify(DEMO_UNITS));
      this.history = JSON.parse(JSON.stringify(DEMO_HISTORY));
      this.settings = Object.assign({}, DEFAULT_SETTINGS);
    }
  },

  saveUnits() {
    localStorage.setItem('ac_units', JSON.stringify(this.units));
  },

  saveHistory() {
    localStorage.setItem('ac_history', JSON.stringify(this.history));
  },

  saveSettings() {
    localStorage.setItem('ac_settings', JSON.stringify(this.settings));
  },

  // Calculate statuses based on current date
  calculateAllStatuses() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.units.forEach(unit => {
      if (unit.status === 'Under Repair') {
        return; // maintain repair status
      }

      if (!unit.nextServiceDate) {
        unit.status = 'Normal';
        return;
      }

      const nextDate = new Date(unit.nextServiceDate);
      nextDate.setHours(0, 0, 0, 0);

      const diffTime = nextDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        unit.status = 'Overdue';
      } else if (diffDays <= 7) {
        unit.status = 'Due Soon';
      } else {
        unit.status = 'Normal';
      }
    });

    this.saveUnits();
  },

  applyTheme(isDark) {
    if (isDark) {
      document.body.setAttribute('data-theme', 'dark');
      const themeBtn = document.getElementById('themeToggleBtn');
      if (themeBtn) themeBtn.innerHTML = '<i class="bi bi-sun-fill text-warning"></i> Light Mode';
    } else {
      document.body.removeAttribute('data-theme');
      const themeBtn = document.getElementById('themeToggleBtn');
      if (themeBtn) themeBtn.innerHTML = '<i class="bi bi-moon-stars-fill"></i> Dark Mode';
    }
    this.settings.darkMode = isDark;
    this.saveSettings();
    ChartManager.initOrUpdate(this.units, this.history);
  },

  toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    this.applyTheme(currentTheme !== 'dark');
  },

  // Dashboard Rendering
  renderDashboard() {
    this.calculateAllStatuses();

    const total = this.units.length;
    const normal = this.units.filter(u => u.status === 'Normal').length;
    const dueSoon = this.units.filter(u => u.status === 'Due Soon').length;
    const overdue = this.units.filter(u => u.status === 'Overdue').length;
    const underRepair = this.units.filter(u => u.status === 'Under Repair').length;

    document.getElementById('dashTotalUnits').textContent = total;
    document.getElementById('dashNormalUnits').textContent = normal;
    document.getElementById('dashDueSoonUnits').textContent = dueSoon;
    document.getElementById('dashOverdueUnits').textContent = overdue;
    document.getElementById('dashRepairUnits').textContent = underRepair;

    // Render Urgent Action List
    const urgentUnits = this.units.filter(u => u.status === 'Overdue' || u.status === 'Due Soon' || u.status === 'Under Repair');
    const urgentContainer = document.getElementById('dashUrgentList');
    if (urgentContainer) {
      if (urgentUnits.length === 0) {
        urgentContainer.innerHTML = `
          <div class="alert alert-success d-flex align-items-center gap-2 mb-0" role="alert">
            <i class="bi bi-check-circle-fill fs-5"></i>
            <div>All AC units are currently in good condition! No upcoming maintenance due this week.</div>
          </div>
        `;
      } else {
        urgentContainer.innerHTML = urgentUnits.map(unit => {
          let badgeClass = 'badge-normal';
          let badgeText = unit.status;
          if (unit.status === 'Overdue') {
            badgeClass = 'badge-overdue';
            badgeText = '<i class="bi bi-exclamation-triangle-fill"></i> Overdue';
          } else if (unit.status === 'Due Soon') {
            badgeClass = 'badge-warning';
            badgeText = '<i class="bi bi-clock-history"></i> Due Soon';
          } else if (unit.status === 'Under Repair') {
            badgeClass = 'badge-repair';
            badgeText = '<i class="bi bi-tools"></i> Under Repair';
          }

          return `
            <div class="d-flex align-items-center justify-content-between p-3 border rounded mb-2 bg-body">
              <div class="d-flex align-items-center gap-3">
                <span class="ac-code-pill">${unit.id}</span>
                <div>
                  <div class="fw-bold">${unit.name}</div>
                  <div class="text-muted small"><i class="bi bi-geo-alt"></i> ${unit.location} &bull; Next Due: <b>${unit.nextServiceDate || 'Not set'}</b></div>
                </div>
              </div>
              <div class="d-flex align-items-center gap-2">
                <span class="badge-status ${badgeClass}">${badgeText}</span>
                <button class="btn btn-sm btn-outline-primary" onclick="App.openLogServiceModal('${unit.id}')">
                  <i class="bi bi-wrench"></i> Service
                </button>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Render Recent Maintenance Activity in Dashboard
    const recentHistory = [...this.history].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    const recentTable = document.getElementById('dashRecentTable');
    if (recentTable) {
      if (recentHistory.length === 0) {
        recentTable.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-3">No maintenance records logged yet.</td></tr>';
      } else {
        recentTable.innerHTML = recentHistory.map(row => {
          const unit = this.units.find(u => u.id === row.acId) || { name: 'Unknown' };
          const dateStr = row.date ? new Date(row.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : '-';
          return `
            <tr>
              <td><span class="ac-code-pill">${row.acId}</span></td>
              <td><b>${unit.name}</b></td>
              <td>${dateStr}</td>
              <td><span class="badge bg-light text-dark border">${row.serviceType || 'Routine'}</span></td>
              <td>${row.technician || '-'}</td>
              <td class="text-end">
                <button class="btn btn-xs btn-outline-info btn-sm py-0 px-2" onclick="App.showServiceDetailModal('${row.id}')">
                  <i class="bi bi-receipt"></i> Slip
                </button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    ChartManager.initOrUpdate(this.units, this.history);
  },

  // Units Inventory Management
  renderUnitsList() {
    const container = document.getElementById('unitsContainer');
    if (!container) return;

    let filtered = this.units.filter(unit => {
      // Status filter
      if (this.currentFilter !== 'all' && unit.status !== this.currentFilter) {
        return false;
      }
      // Location filter
      if (this.currentLocationFilter !== 'all' && unit.floor !== this.currentLocationFilter) {
        return false;
      }
      // Search query
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const match =
          (unit.id && unit.id.toLowerCase().includes(q)) ||
          (unit.name && unit.name.toLowerCase().includes(q)) ||
          (unit.location && unit.location.toLowerCase().includes(q)) ||
          (unit.brand && unit.brand.toLowerCase().includes(q)) ||
          (unit.model && unit.model.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });

    // Update count display
    const countDisplay = document.getElementById('unitsCountDisplay');
    if (countDisplay) {
      countDisplay.textContent = `Showing ${filtered.length} of ${this.units.length} units`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-12 py-5 text-center text-muted">
          <i class="bi bi-search fs-1 opacity-50 mb-2"></i>
          <h5>No AC units found</h5>
          <p class="small">Try clearing your filters or search keywords.</p>
          <button class="btn btn-sm btn-outline-primary" onclick="App.resetFilters()">Clear Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(unit => {
      let badgeClass = 'badge-normal';
      let badgeIcon = 'bi-check-circle-fill';
      if (unit.status === 'Overdue') {
        badgeClass = 'badge-overdue';
        badgeIcon = 'bi-exclamation-triangle-fill';
      } else if (unit.status === 'Due Soon') {
        badgeClass = 'badge-warning';
        badgeIcon = 'bi-clock-history';
      } else if (unit.status === 'Under Repair') {
        badgeClass = 'badge-repair';
        badgeIcon = 'bi-tools';
      }

      return `
        <div class="col-md-6 col-lg-4 col-xl-3 mb-3">
          <div class="ac-unit-card">
            <div>
              <div class="d-flex justify-content-between align-items-start mb-2">
                <span class="ac-code-pill">${unit.id}</span>
                <span class="badge-status ${badgeClass}"><i class="bi ${badgeIcon}"></i> ${unit.status}</span>
              </div>
              <h6 class="fw-bold mb-1 text-truncate" title="${unit.name}">${unit.name}</h6>
              <div class="text-muted small mb-2"><i class="bi bi-geo-alt"></i> ${unit.location}</div>
              
              <div class="p-2 bg-body-tertiary rounded small mb-2">
                <div class="d-flex justify-content-between">
                  <span class="text-muted">Brand & Model:</span>
                  <span class="fw-semibold">${unit.brand || '-'}</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="text-muted">Capacity:</span>
                  <span>${unit.capacity || '-'}</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="text-muted">Refrigerant:</span>
                  <span class="badge bg-secondary-subtle text-secondary-emphasis">${unit.refrigerant || 'R32'}</span>
                </div>
                <div class="d-flex justify-content-between mt-1 pt-1 border-top">
                  <span class="text-muted">Next Due:</span>
                  <span class="fw-bold ${unit.status === 'Overdue' ? 'text-danger' : ''}">${unit.nextServiceDate || '-'}</span>
                </div>
              </div>
            </div>

            <div class="d-flex gap-1 pt-2 border-top mt-2">
              <button class="btn btn-sm btn-primary flex-fill" onclick="App.openLogServiceModal('${unit.id}')" title="Log Maintenance">
                <i class="bi bi-wrench"></i> Service
              </button>
              <button class="btn btn-sm btn-outline-secondary" onclick="QRManager.showSingleQRModal(App.getUnitById('${unit.id}'))" title="Print QR Label">
                <i class="bi bi-qr-code"></i>
              </button>
              <div class="dropdown">
                <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-three-dots-vertical"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end shadow">
                  <li><a class="dropdown-item" href="javascript:void(0)" onclick="App.openEditUnitModal('${unit.id}')"><i class="bi bi-pencil me-2"></i> Edit Unit</a></li>
                  <li><a class="dropdown-item" href="javascript:void(0)" onclick="App.showUnitHistory('${unit.id}')"><i class="bi bi-clock-history me-2"></i> View History</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item text-danger" href="javascript:void(0)" onclick="App.deleteUnit('${unit.id}')"><i class="bi bi-trash me-2"></i> Delete Unit</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  populateLocationFilter() {
    const select = document.getElementById('locationFilter');
    if (!select) return;

    const locations = [...new Set(this.units.map(u => u.floor).filter(Boolean))];
    select.innerHTML = '<option value="all">All Floors / Areas</option>';
    locations.forEach(loc => {
      select.innerHTML += `<option value="${loc}">${loc}</option>`;
    });
  },

  resetFilters() {
    this.currentFilter = 'all';
    this.currentLocationFilter = 'all';
    this.searchQuery = '';
    const searchInput = document.getElementById('searchUnitsInput');
    if (searchInput) searchInput.value = '';
    const locSelect = document.getElementById('locationFilter');
    if (locSelect) locSelect.value = 'all';

    document.querySelectorAll('.filter-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-status') === 'all');
    });

    this.renderUnitsList();
  },

  getUnitById(id) {
    return this.units.find(u => u.id === id);
  },

  // Modal Handlers
  openAddUnitModal() {
    document.getElementById('formUnitTitle').textContent = 'Add New AC Unit';
    document.getElementById('unitForm').reset();
    document.getElementById('unit-id-input').readOnly = false;
    document.getElementById('unit-id-input').value = `AC-U${String(this.units.length + 1).padStart(3, '0')}`;
    document.getElementById('unit-edit-mode').value = 'add';
    
    // Default install date to today
    document.getElementById('unit-install-date').value = new Date().toISOString().split('T')[0];
    
    const modal = new bootstrap.Modal(document.getElementById('unitModal'));
    modal.show();
  },

  openEditUnitModal(id) {
    const unit = this.getUnitById(id);
    if (!unit) return;

    document.getElementById('formUnitTitle').textContent = `Edit Unit: ${unit.id}`;
    document.getElementById('unit-edit-mode').value = 'edit';
    document.getElementById('unit-id-input').value = unit.id;
    document.getElementById('unit-id-input').readOnly = true;

    document.getElementById('unit-name').value = unit.name || '';
    document.getElementById('unit-location').value = unit.location || '';
    document.getElementById('unit-floor').value = unit.floor || '';
    document.getElementById('unit-brand').value = unit.brand || '';
    document.getElementById('unit-model').value = unit.model || '';
    document.getElementById('unit-type').value = unit.type || 'Wall Mounted Split';
    document.getElementById('unit-capacity').value = unit.capacity || '1.0 PK (9,000 BTU)';
    document.getElementById('unit-refrigerant').value = unit.refrigerant || 'R32';
    document.getElementById('unit-install-date').value = unit.installDate || '';
    document.getElementById('unit-frequency').value = unit.frequencyMonths || 3;
    document.getElementById('unit-status-select').value = unit.status || 'Normal';
    document.getElementById('unit-serial').value = unit.serialNumber || '';
    document.getElementById('unit-notes').value = unit.technicianNotes || '';

    const modal = new bootstrap.Modal(document.getElementById('unitModal'));
    modal.show();
  },

  saveUnitForm(e) {
    e.preventDefault();
    const mode = document.getElementById('unit-edit-mode').value;
    const id = document.getElementById('unit-id-input').value.trim();

    if (!id) {
      Swal.fire('Error', 'AC ID is required.', 'error');
      return;
    }

    const freqMonths = parseInt(document.getElementById('unit-frequency').value) || 3;
    let nextDate = '';
    const installDate = document.getElementById('unit-install-date').value;

    const unitData = {
      id: id,
      name: document.getElementById('unit-name').value.trim(),
      location: document.getElementById('unit-location').value.trim(),
      floor: document.getElementById('unit-floor').value.trim() || 'Floor 1',
      brand: document.getElementById('unit-brand').value.trim(),
      model: document.getElementById('unit-model').value.trim(),
      type: document.getElementById('unit-type').value,
      capacity: document.getElementById('unit-capacity').value,
      refrigerant: document.getElementById('unit-refrigerant').value,
      installDate: installDate,
      frequencyMonths: freqMonths,
      status: document.getElementById('unit-status-select').value,
      serialNumber: document.getElementById('unit-serial').value.trim(),
      technicianNotes: document.getElementById('unit-notes').value.trim()
    };

    if (mode === 'add') {
      if (this.units.some(u => u.id === id)) {
        Swal.fire('Error', `AC ID "${id}" already exists. Please choose a unique ID.`, 'error');
        return;
      }
      // Calculate first next maintenance
      if (installDate) {
        const d = new Date(installDate);
        d.setMonth(d.getMonth() + freqMonths);
        unitData.nextServiceDate = d.toISOString().split('T')[0];
      }
      unitData.lastServiceDate = '-';
      this.units.unshift(unitData);
    } else {
      const idx = this.units.findIndex(u => u.id === id);
      if (idx !== -1) {
        unitData.lastServiceDate = this.units[idx].lastServiceDate;
        unitData.nextServiceDate = this.units[idx].nextServiceDate;
        this.units[idx] = Object.assign({}, this.units[idx], unitData);
      }
    }

    this.calculateAllStatuses();
    this.saveUnits();
    this.populateLocationFilter();
    this.renderUnitsList();
    this.renderDashboard();

    const modal = bootstrap.Modal.getInstance(document.getElementById('unitModal'));
    if (modal) modal.hide();

    Swal.fire({
      icon: 'success',
      title: mode === 'add' ? 'AC Unit Added' : 'AC Unit Updated',
      text: `${unitData.id} - ${unitData.name} has been saved successfully.`,
      timer: 1800,
      showConfirmButton: false
    });
  },

  deleteUnit(id) {
    const unit = this.getUnitById(id);
    if (!unit) return;

    Swal.fire({
      title: 'Delete AC Unit?',
      text: `Are you sure you want to delete ${unit.id} (${unit.name})? All past service records for this unit will remain in history.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete'
    }).then(result => {
      if (result.isConfirmed) {
        this.units = this.units.filter(u => u.id !== id);
        this.saveUnits();
        this.renderUnitsList();
        this.renderDashboard();
        Swal.fire('Deleted!', `AC Unit ${id} has been deleted.`, 'success');
      }
    });
  },

  // Service Logging Direct Entry (Switches to Scan QR tab and opens form)
  openLogServiceModal(acId) {
    const unit = this.getUnitById(acId);
    if (!unit) {
      Swal.fire('Error', 'Unit not found.', 'error');
      return;
    }

    const tabEl = document.getElementById('tab-scan');
    if (tabEl) {
      const tab = new bootstrap.Tab(tabEl);
      tab.show();
      setTimeout(() => {
        this.handleUnitScanned(acId);
      }, 50);
    }
  },

  updateDeltaTemp() {
    const inlet = parseFloat(document.getElementById('srv-temp-inlet').value);
    const outlet = parseFloat(document.getElementById('srv-temp-outlet').value);
    const badge = document.getElementById('deltaTempBadge');

    if (!isNaN(inlet) && !isNaN(outlet)) {
      const delta = (inlet - outlet).toFixed(1);
      if (delta >= 8 && delta <= 14) {
        badge.className = 'delta-badge bg-success-subtle text-success border border-success';
        badge.innerHTML = `&Delta;T = ${delta} &deg;C &bull; <i class="bi bi-check-circle"></i> Optimal Cooling Efficiency`;
      } else if (delta < 8) {
        badge.className = 'delta-badge bg-warning-subtle text-warning border border-warning';
        badge.innerHTML = `&Delta;T = ${delta} &deg;C &bull; <i class="bi bi-exclamation-triangle"></i> Low Delta T (Check Refrigerant / Dirty Coil)`;
      } else {
        badge.className = 'delta-badge bg-info-subtle text-info border border-info';
        badge.innerHTML = `&Delta;T = ${delta} &deg;C &bull; High Delta T (Verify Low Airflow / Fan Speed)`;
      }
    } else {
      badge.className = 'delta-badge bg-body-secondary text-muted';
      badge.innerHTML = '&Delta;T = -- &deg;C (Enter Inlet & Outlet temperatures to calculate efficiency)';
    }
  },

  saveServiceForm(e) {
    e.preventDefault();
    const acId = document.getElementById('srv-unit-id').value;
    const unit = this.getUnitById(acId);
    if (!unit) return;

    // Collect checked tasks
    const tasks = [];
    document.querySelectorAll('.srv-task-checkbox:checked').forEach(cb => {
      tasks.push(cb.value);
    });

    const inlet = parseFloat(document.getElementById('srv-temp-inlet').value) || null;
    const outlet = parseFloat(document.getElementById('srv-temp-outlet').value) || null;
    const delta = (inlet !== null && outlet !== null) ? parseFloat((inlet - outlet).toFixed(1)) : null;

    const serviceRecord = {
      id: `SRV-${Date.now().toString().slice(-8)}`,
      acId: acId,
      date: document.getElementById('srv-date').value,
      technician: document.getElementById('srv-technician').value.trim(),
      vendor: document.getElementById('srv-vendor').value.trim() || 'Internal Maintenance',
      serviceType: document.getElementById('srv-type').value,
      tasksCompleted: tasks,
      measurements: {
        suctionPsi: parseFloat(document.getElementById('srv-psi').value) || null,
        currentAmpere: parseFloat(document.getElementById('srv-ampere').value) || null,
        inletTempC: inlet,
        outletTempC: outlet,
        deltaTempC: delta,
        drainStatus: document.getElementById('srv-drain').value,
        noiseStatus: document.getElementById('srv-noise').value
      },
      freonAddedPsi: parseFloat(document.getElementById('srv-freon-added').value) || 0,
      partsReplaced: document.getElementById('srv-parts').value.trim() || 'None',
      cost: parseFloat(document.getElementById('srv-cost').value) || 0,
      unitStatusAfter: document.getElementById('srv-unit-status-after').value,
      notes: document.getElementById('srv-notes').value.trim(),
      photoUrl: ''
    };

    // Update Unit state
    unit.lastServiceDate = serviceRecord.date.split('T')[0];
    unit.nextServiceDate = document.getElementById('srv-next-date').value;
    unit.status = serviceRecord.unitStatusAfter;

    // Append to history
    this.history.unshift(serviceRecord);

    this.saveUnits();
    this.saveHistory();
    this.calculateAllStatuses();
    this.renderDashboard();
    this.renderUnitsList();
    this.renderHistoryTable();

    // Trigger Cloud Webhook if configured
    if (this.settings.gasWebhookUrl) {
      this.syncRecordToGoogleSheet(serviceRecord);
    }

    Swal.fire({
      icon: 'success',
      title: 'Data Service Berhasil Disimpan!',
      html: `Maintenance tercatat untuk unit <b>${unit.id} (${unit.name})</b>.<br>Jadwal service berikutnya: <b>${unit.nextServiceDate}</b>.`,
      confirmButtonText: 'Selesai / Scan Unit Lain'
    }).then(() => {
      this.resetScanView();
    });
  },

  // Service Work Order / Slip Modal
  showServiceDetailModal(serviceId) {
    const srv = this.history.find(h => h.id === serviceId);
    if (!srv) return;
    const unit = this.getUnitById(srv.acId) || { name: 'Unknown', location: '-', brand: '-', model: '-' };

    document.getElementById('slip-id').textContent = srv.id;
    document.getElementById('slip-date').textContent = srv.date ? new Date(srv.date).toLocaleString('id-ID') : '-';
    document.getElementById('slip-company').textContent = this.settings.companyName || 'AC Maintenance Department';
    
    document.getElementById('slip-ac-id').textContent = srv.acId;
    document.getElementById('slip-ac-name').textContent = unit.name;
    document.getElementById('slip-ac-location').textContent = unit.location;
    document.getElementById('slip-ac-specs').textContent = `${unit.brand || ''} ${unit.model || ''} (${unit.capacity || ''}, ${unit.refrigerant || 'R32'})`;

    document.getElementById('slip-technician').textContent = srv.technician || '-';
    document.getElementById('slip-vendor').textContent = srv.vendor || '-';
    document.getElementById('slip-type').textContent = srv.serviceType || 'Routine';

    // Tasks list
    const tasksUl = document.getElementById('slip-tasks');
    if (tasksUl) {
      tasksUl.innerHTML = (srv.tasksCompleted && srv.tasksCompleted.length > 0)
        ? srv.tasksCompleted.map(t => `<li><i class="bi bi-check2 text-success me-1"></i>${t}</li>`).join('')
        : '<li>Routine Inspection & Wash</li>';
    }

    // Measurements
    const m = srv.measurements || {};
    document.getElementById('slip-psi').textContent = m.suctionPsi ? `${m.suctionPsi} PSI` : '-';
    document.getElementById('slip-ampere').textContent = m.currentAmpere ? `${m.currentAmpere} A` : '-';
    document.getElementById('slip-temps').textContent = (m.inletTempC && m.outletTempC) 
      ? `In: ${m.inletTempC}°C | Out: ${m.outletTempC}°C | ΔT: ${m.deltaTempC}°C` 
      : '-';
    document.getElementById('slip-drain').textContent = m.drainStatus || 'Normal';
    document.getElementById('slip-noise').textContent = m.noiseStatus || 'Normal';
    document.getElementById('slip-freon-added').textContent = srv.freonAddedPsi ? `+${srv.freonAddedPsi} PSI` : 'None';
    document.getElementById('slip-parts').textContent = srv.partsReplaced || 'None';
    document.getElementById('slip-cost').textContent = srv.cost ? `Rp ${Number(srv.cost).toLocaleString('id-ID')}` : 'Rp 0';
    document.getElementById('slip-status-after').textContent = srv.unitStatusAfter || 'Normal';
    document.getElementById('slip-notes').textContent = srv.notes || '-';

    const modal = new bootstrap.Modal(document.getElementById('serviceSlipModal'));
    modal.show();
  },

  // Service History Table
  renderHistoryTable() {
    const tbody = document.getElementById('historyTableBody');
    if (!tbody) return;

    if (this.history.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No maintenance history records found.</td></tr>';
      return;
    }

    tbody.innerHTML = this.history.map(row => {
      const unit = this.getUnitById(row.acId) || { name: 'Unknown' };
      const dateStr = row.date ? new Date(row.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
      const costStr = row.cost ? `Rp ${Number(row.cost).toLocaleString('id-ID')}` : '-';

      return `
        <tr>
          <td><span class="ac-code-pill">${row.acId}</span></td>
          <td><b>${unit.name}</b></td>
          <td>${dateStr}</td>
          <td><span class="badge bg-primary-subtle text-primary border border-primary-subtle">${row.serviceType || 'Routine'}</span></td>
          <td>${row.technician}</td>
          <td>${costStr}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-info me-1" onclick="App.showServiceDetailModal('${row.id}')" title="View Work Order Slip">
              <i class="bi bi-receipt"></i> Slip
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="App.deleteHistory('${row.id}')" title="Delete Log">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  showUnitHistory(acId) {
    const tabEl = document.getElementById('tab-history');
    if (tabEl) {
      const tab = new bootstrap.Tab(tabEl);
      tab.show();
      const searchInput = document.getElementById('historySearchInput');
      if (searchInput) {
        searchInput.value = acId;
        this.filterHistory(acId);
      }
    }
  },

  filterHistory(query) {
    const tbody = document.getElementById('historyTableBody');
    if (!tbody) return;

    const q = query.toLowerCase();
    const filtered = this.history.filter(h => {
      const unit = this.getUnitById(h.acId) || { name: '' };
      return (
        h.acId.toLowerCase().includes(q) ||
        unit.name.toLowerCase().includes(q) ||
        (h.technician && h.technician.toLowerCase().includes(q)) ||
        (h.serviceType && h.serviceType.toLowerCase().includes(q))
      );
    });

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No records match your search.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(row => {
      const unit = this.getUnitById(row.acId) || { name: 'Unknown' };
      const dateStr = row.date ? new Date(row.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
      const costStr = row.cost ? `Rp ${Number(row.cost).toLocaleString('id-ID')}` : '-';

      return `
        <tr>
          <td><span class="ac-code-pill">${row.acId}</span></td>
          <td><b>${unit.name}</b></td>
          <td>${dateStr}</td>
          <td><span class="badge bg-primary-subtle text-primary border border-primary-subtle">${row.serviceType || 'Routine'}</span></td>
          <td>${row.technician}</td>
          <td>${costStr}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-info me-1" onclick="App.showServiceDetailModal('${row.id}')" title="View Work Order Slip">
              <i class="bi bi-receipt"></i> Slip
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="App.deleteHistory('${row.id}')" title="Delete Log">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  deleteHistory(id) {
    Swal.fire({
      title: 'Delete Service Record?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Delete'
    }).then(res => {
      if (res.isConfirmed) {
        this.history = this.history.filter(h => h.id !== id);
        this.saveHistory();
        this.renderHistoryTable();
        this.renderDashboard();
        Swal.fire('Deleted!', 'Maintenance record removed.', 'success');
      }
    });
  },

  // QR Scanning Handlers
  initQR() {
    // Populate Quick Lookup Datalist
    const datalist = document.getElementById('acLookupList');
    if (datalist) {
      datalist.innerHTML = this.units.map(u => `<option value="${u.id}">${u.name} - ${u.location}</option>`).join('');
    }
  },

  handleUnitScanned(acId) {
    const unit = this.getUnitById(acId);
    
    if (!unit) {
      Swal.fire({
        icon: 'warning',
        title: 'Unit AC Tidak Ditemukan',
        html: `Tidak ada data AC terdaftar dengan ID: <b>${acId}</b>.<br>Apakah Anda ingin mendaftarkannya sebagai unit baru?`,
        showCancelButton: true,
        confirmButtonText: 'Daftarkan Unit Baru',
        cancelButtonText: 'Batal'
      }).then(res => {
        if (res.isConfirmed) {
          this.openAddUnitModal();
          document.getElementById('unit-id-input').value = acId;
        }
      });
      return;
    }

    // Stop scanner to save camera battery & avoid re-scanning loop
    QRManager.stopScanner();

    // Hide camera section & show service form directly
    const camSection = document.getElementById('scanCameraSection');
    const formSection = document.getElementById('scanFormSection');
    if (camSection) camSection.classList.add('d-none');
    if (formSection) formSection.classList.remove('d-none');

    // Populate Scanned Target AC Info Header
    document.getElementById('scanFormAcId').textContent = unit.id;
    document.getElementById('scanFormAcName').textContent = unit.name;
    document.getElementById('scanFormAcLocation').textContent = unit.location;
    document.getElementById('scanFormAcSpecs').textContent = `${unit.brand || ''} ${unit.model || ''} (${unit.capacity || ''}, ${unit.refrigerant || 'R32'})`;
    document.getElementById('scanFormAcLastService').textContent = unit.lastServiceDate || 'Belum ada data';
    document.getElementById('scanFormAcNotes').textContent = unit.technicianNotes || 'Tidak ada catatan khusus';
    
    const badge = document.getElementById('scanFormAcStatus');
    badge.className = `badge-status badge-${unit.status.toLowerCase().replace(' ', '-')}`;
    badge.textContent = unit.status;

    // Reset and Prefill Service Form
    document.getElementById('serviceForm').reset();
    document.getElementById('srv-unit-id').value = unit.id;

    // Current local datetime
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('srv-date').value = now.toISOString().slice(0, 16);

    // Calculate next service date based on unit's frequency setting
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + (unit.frequencyMonths || 3));
    document.getElementById('srv-next-date').value = nextDate.toISOString().split('T')[0];

    // Reset Delta T calculation
    this.updateDeltaTemp();

    // Smooth scroll and focus on technician name input
    formSection.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const techInput = document.getElementById('srv-technician');
      if (techInput) techInput.focus();
    }, 200);
  },

  resetScanView() {
    const camSection = document.getElementById('scanCameraSection');
    const formSection = document.getElementById('scanFormSection');
    if (formSection) formSection.classList.add('d-none');
    if (camSection) camSection.classList.remove('d-none');

    document.getElementById('serviceForm').reset();

    // Restart scanner
    QRManager.initScanner((acId) => {
      this.handleUnitScanned(acId);
    });

    if (camSection) camSection.scrollIntoView({ behavior: 'smooth' });
  },

  // Export / Import / Backup
  exportUnitsCSV() {
    if (this.units.length === 0) {
      Swal.fire('Notice', 'No AC units to export.', 'info');
      return;
    }

    const headers = ["ID", "Name", "Location", "Floor", "Brand", "Model", "Type", "Capacity", "Refrigerant", "InstallDate", "FreqMonths", "LastService", "NextService", "Status", "SerialNumber", "Notes"];
    const rows = this.units.map(u => [
      `"${u.id || ''}"`,
      `"${u.name || ''}"`,
      `"${u.location || ''}"`,
      `"${u.floor || ''}"`,
      `"${u.brand || ''}"`,
      `"${u.model || ''}"`,
      `"${u.type || ''}"`,
      `"${u.capacity || ''}"`,
      `"${u.refrigerant || ''}"`,
      `"${u.installDate || ''}"`,
      u.frequencyMonths || 3,
      `"${u.lastServiceDate || ''}"`,
      `"${u.nextServiceDate || ''}"`,
      `"${u.status || ''}"`,
      `"${u.serialNumber || ''}"`,
      `"${(u.technicianNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AC_Units_Inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportHistoryCSV() {
    if (this.history.length === 0) {
      Swal.fire('Notice', 'No maintenance records to export.', 'info');
      return;
    }

    const headers = ["ID", "AC_ID", "Date", "Technician", "Vendor", "ServiceType", "TasksCompleted", "SuctionPSI", "Ampere", "InletC", "OutletC", "DeltaC", "Drain", "Noise", "FreonAddedPSI", "PartsReplaced", "Cost", "UnitStatusAfter", "Notes"];
    const rows = this.history.map(h => {
      const m = h.measurements || {};
      return [
        `"${h.id || ''}"`,
        `"${h.acId || ''}"`,
        `"${h.date || ''}"`,
        `"${h.technician || ''}"`,
        `"${h.vendor || ''}"`,
        `"${h.serviceType || ''}"`,
        `"${(h.tasksCompleted || []).join('; ')}"`,
        m.suctionPsi || '',
        m.currentAmpere || '',
        m.inletTempC || '',
        m.outletTempC || '',
        m.deltaTempC || '',
        `"${m.drainStatus || ''}"`,
        `"${m.noiseStatus || ''}"`,
        h.freonAddedPsi || 0,
        `"${(h.partsReplaced || '').replace(/"/g, '""')}"`,
        h.cost || 0,
        `"${h.unitStatusAfter || ''}"`,
        `"${(h.notes || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AC_Service_History_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportBackupJSON() {
    const backupData = {
      version: "2.0",
      exportDate: new Date().toISOString(),
      settings: this.settings,
      units: this.units,
      history: this.history
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `AC_Maintenance_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(dlAnchorElem);
    dlAnchorElem.click();
    document.body.removeChild(dlAnchorElem);
  },

  importBackupJSON(inputElement) {
    if (!inputElement.files || inputElement.files.length === 0) return;
    const file = inputElement.files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed.units || !Array.isArray(parsed.units)) {
          throw new Error('Invalid backup file format: missing units array');
        }

        Swal.fire({
          title: 'Restore Backup Data?',
          text: `Found ${parsed.units.length} AC units and ${(parsed.history || []).length} service logs. This will replace current data.`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#0d6efd',
          confirmButtonText: 'Yes, Restore'
        }).then(res => {
          if (res.isConfirmed) {
            this.units = parsed.units;
            this.history = parsed.history || [];
            if (parsed.settings) this.settings = Object.assign({}, DEFAULT_SETTINGS, parsed.settings);
            
            this.saveUnits();
            this.saveHistory();
            this.saveSettings();
            this.calculateAllStatuses();
            this.init();

            Swal.fire('Restored!', 'Your backup has been loaded successfully.', 'success');
          }
        });
      } catch (err) {
        Swal.fire('Import Error', 'Failed to read backup JSON: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
  },

  resetToDemoData() {
    Swal.fire({
      title: 'Reset to Sample Data?',
      text: 'This will reset all AC units and service logs to the initial demo building database.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Reset'
    }).then(res => {
      if (res.isConfirmed) {
        this.units = JSON.parse(JSON.stringify(DEMO_UNITS));
        this.history = JSON.parse(JSON.stringify(DEMO_HISTORY));
        this.settings = Object.assign({}, DEFAULT_SETTINGS);

        this.saveUnits();
        this.saveHistory();
        this.saveSettings();
        this.init();

        Swal.fire('Reset Complete', 'Database has been reset to default demo data.', 'success');
      }
    });
  },

  // Google Sheets Webhook Sync
  saveSettingsForm(e) {
    e.preventDefault();
    this.settings.companyName = document.getElementById('settingCompanyName').value.trim();
    this.settings.companyAddress = document.getElementById('settingCompanyAddress').value.trim();
    this.settings.companyPhone = document.getElementById('settingCompanyPhone').value.trim();
    this.settings.gasWebhookUrl = document.getElementById('settingGasUrl').value.trim();

    this.saveSettings();
    Swal.fire('Settings Saved', 'System preferences have been updated.', 'success');
  },

  async testGasConnection() {
    const url = document.getElementById('settingGasUrl').value.trim();
    if (!url) {
      Swal.fire('Input Required', 'Please enter your Google Apps Script Web App URL first.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Testing Connection...',
      text: 'Contacting Google Apps Script endpoint',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await fetch(`${url}?action=ping`, { method: 'GET', mode: 'cors' });
      const data = await response.json();
      if (data && data.status === 'success') {
        Swal.fire('Connected!', 'Successfully connected to Google Sheet backend!', 'success');
      } else {
        Swal.fire('Connected', 'Server responded: ' + JSON.stringify(data), 'info');
      }
    } catch (e) {
      Swal.fire('Connection Result', 'Webhook reached (Note: Google Apps Script redirects are standard; verify your Code.gs script).', 'info');
    }
  },

  async syncRecordToGoogleSheet(record) {
    if (!this.settings.gasWebhookUrl) return;
    try {
      await fetch(this.settings.gasWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addService', data: record }),
        mode: 'no-cors'
      });
      console.log('Synchronized service log with Google Sheet.');
    } catch (e) {
      console.warn('Google Sheet sync background warning:', e);
    }
  },

  // Event Listeners Initialization
  initEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchUnitsInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderUnitsList();
      });
    }

    // Status filter buttons
    document.querySelectorAll('.filter-pill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.getAttribute('data-status');
        this.renderUnitsList();
      });
    });

    // Location filter select
    const locFilter = document.getElementById('locationFilter');
    if (locFilter) {
      locFilter.addEventListener('change', (e) => {
        this.currentLocationFilter = e.target.value;
        this.renderUnitsList();
      });
    }

    // History search
    const historySearch = document.getElementById('historySearchInput');
    if (historySearch) {
      historySearch.addEventListener('input', (e) => {
        this.filterHistory(e.target.value);
      });
    }

    // Quick lookup in Scan tab
    const lookupBtn = document.getElementById('acLookupBtn');
    const lookupInput = document.getElementById('acLookupInput');
    if (lookupBtn && lookupInput) {
      lookupBtn.addEventListener('click', () => {
        const val = lookupInput.value.trim();
        if (val) this.handleUnitScanned(val);
      });
      lookupInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const val = lookupInput.value.trim();
          if (val) this.handleUnitScanned(val);
        }
      });
    }

    // Dynamic Delta Temp
    const inletInput = document.getElementById('srv-temp-inlet');
    const outletInput = document.getElementById('srv-temp-outlet');
    if (inletInput && outletInput) {
      inletInput.addEventListener('input', () => this.updateDeltaTemp());
      outletInput.addEventListener('input', () => this.updateDeltaTemp());
    }

    // Tab switch hook to start/stop camera scanner
    const scanTabBtn = document.getElementById('tab-scan');
    if (scanTabBtn) {
      scanTabBtn.addEventListener('shown.bs.tab', () => {
        const formSection = document.getElementById('scanFormSection');
        if (!formSection || formSection.classList.contains('d-none')) {
          QRManager.initScanner((acId) => {
            this.handleUnitScanned(acId);
          });
        }
      });
      scanTabBtn.addEventListener('hidden.bs.tab', () => {
        QRManager.stopScanner();
      });
    }

    // Tab switch hook for Dashboard & Batch QR
    const dashTabBtn = document.getElementById('tab-dash');
    if (dashTabBtn) {
      dashTabBtn.addEventListener('shown.bs.tab', () => {
        this.renderDashboard();
      });
    }

    const batchTabBtn = document.getElementById('tab-batch-qr');
    if (batchTabBtn) {
      batchTabBtn.addEventListener('shown.bs.tab', () => {
        QRManager.renderBatchQR(this.units);
      });
    }

    // Populate Settings Form
    const compName = document.getElementById('settingCompanyName');
    if (compName) compName.value = this.settings.companyName || '';
    const compAddr = document.getElementById('settingCompanyAddress');
    if (compAddr) compAddr.value = this.settings.companyAddress || '';
    const compPhone = document.getElementById('settingCompanyPhone');
    if (compPhone) compPhone.value = this.settings.companyPhone || '';
    const gasUrl = document.getElementById('settingGasUrl');
    if (gasUrl) gasUrl.value = this.settings.gasWebhookUrl || '';
  }
};

// Start application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
