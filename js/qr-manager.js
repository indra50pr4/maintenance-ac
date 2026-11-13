/**
 * AC Maintenance System - QR Code Manager
 */
const QRManager = {
  html5QrScanner: null,
  isScanning: false,

  initScanner(onSuccessCallback) {
    const readerDiv = document.getElementById('reader');
    if (!readerDiv) return;

    if (this.html5QrScanner) {
      try {
        this.html5QrScanner.clear();
      } catch (e) {
        console.warn('Clear scanner warning:', e);
      }
    }

    try {
      this.html5QrScanner = new Html5QrcodeScanner(
        'reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true
        },
        /* verbose= */ false
      );

      this.html5QrScanner.render(
        (decodedText) => {
          this.handleDecodedText(decodedText, onSuccessCallback);
        },
        (errorMessage) => {
          // Scanner frame error (silent)
        }
      );
      this.isScanning = true;
    } catch (err) {
      console.error('Failed to init QR Scanner:', err);
    }
  },

  handleDecodedText(decodedText, callback) {
    if (!decodedText) return;

    // Clean text in case it's a URL or contains hash
    let acId = decodedText.trim();
    if (acId.includes('ac=')) {
      acId = acId.split('ac=')[1].split('&')[0];
    } else if (acId.includes('#unit=')) {
      acId = acId.split('#unit=')[1];
    }

    // Play subtle audio beep if possible
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      osc.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      // AudioContext not allowed or unsupported
    }

    if (callback) {
      callback(acId);
    }
  },

  stopScanner() {
    if (this.html5QrScanner) {
      try {
        this.html5QrScanner.clear();
        this.isScanning = false;
      } catch (e) {
        console.error('Error clearing scanner:', e);
      }
    }
  },

  scanFromFile(fileInput, callback) {
    if (!fileInput.files || fileInput.files.length === 0) return;
    const file = fileInput.files[0];

    const html5QrCode = new Html5Qrcode('reader-file-temp');
    html5QrCode.scanFile(file, true)
      .then(decodedText => {
        this.handleDecodedText(decodedText, callback);
        html5QrCode.clear();
      })
      .catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'QR Code Not Found',
          text: 'Could not read a QR code from this image. Please ensure the QR code is clearly visible and well-lit.'
        });
        html5QrCode.clear();
      });
  },

  generateQRCode(containerId, text, size = 128) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    try {
      if (typeof QRCode !== 'undefined') {
        new QRCode(container, {
          text: text,
          width: size,
          height: size,
          colorDark: '#0f172a',
          colorLight: '#ffffff',
          correctLevel: (typeof QRCode.CorrectLevel !== 'undefined') ? QRCode.CorrectLevel.M : 0
        });
        return;
      }
    } catch (e) {
      console.warn('QRCode JS generation fallback:', e);
    }

    // Fallback image generator
    container.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}" alt="QR Code" width="${size}" height="${size}" class="img-fluid rounded border" />`;
  },

  showSingleQRModal(unit) {
    const modalEl = document.getElementById('qrLabelModal');
    if (!modalEl) return;

    document.getElementById('qrModalId').textContent = unit.id;
    document.getElementById('qrModalName').textContent = unit.name;
    document.getElementById('qrModalLocation').textContent = unit.location;
    document.getElementById('qrModalBrand').textContent = `${unit.brand || ''} ${unit.model || ''} (${unit.capacity || ''})`;
    document.getElementById('qrModalRefrig').textContent = `Refrigerant: ${unit.refrigerant || 'R32'} | Next: ${unit.nextServiceDate || '-'}`;

    this.generateQRCode('qrModalCodeContainer', unit.id, 140);

    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  },

  renderBatchQR(units) {
    const container = document.getElementById('batchQrContainer');
    if (!container) return;
    container.innerHTML = '';

    units.forEach((unit, idx) => {
      const codeId = `batch-qr-${idx}`;
      const div = document.createElement('div');
      div.className = 'qr-sticker-label';
      div.innerHTML = `
        <div class="qr-img-box" id="${codeId}"></div>
        <div class="qr-info">
          <div class="qr-id">${unit.id}</div>
          <div class="qr-name">${unit.name}</div>
          <div class="qr-meta"><i class="bi bi-geo-alt"></i> ${unit.location}</div>
          <div class="qr-meta"><i class="bi bi-snow"></i> ${unit.brand} ${unit.capacity} (${unit.refrigerant || 'R32'})</div>
        </div>
      `;
      container.appendChild(div);

      // Generate QR after append
      setTimeout(() => {
        this.generateQRCode(codeId, unit.id, 96);
      }, 10);
    });
  }
};
