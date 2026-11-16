# ❄️ CoolCare - AC Maintenance & Asset Management System

A modern, responsive, and full-featured Web Application designed for HVAC contractors, facility managers, building maintenance teams, and AC service technicians to track air conditioner inventories, schedule preventive cleanings, generate & scan QR codes, log technical maintenance diagnostics, and print work orders.

---

## 🌟 Key Features

### 1. 📊 Interactive Dashboard & KPI Metrics
- **Real-time Stat Cards**: Total AC Units, Operational Normal, Due Soon (within 7 days), Overdue Maintenance, and Units Under Repair.
- **Chart.js Visualizations**:
  - Asset Health Status Breakdown (Doughnut Chart)
  - Maintenance Activity by Category (Bar Chart)
  - 6-Month Maintenance Frequency & Trends (Line Chart)
- **Urgent Action Center**: Instantly lists units requiring urgent cleaning or repair with 1-click **Service** shortcuts.
- **Recent Maintenance Activity Feed**: Quick access to recent logs and printable work orders.

### 2. ❄️ Comprehensive AC Asset Management
- Track complete equipment specifications:
  - **Asset Tag / Code** (e.g. `AC-L1-101`)
  - **Unit Name & Location** (Room, Floor, Zone)
  - **Brand & Model** (Daikin, Panasonic, Mitsubishi, Sharp, LG, Gree, etc.)
  - **Type** (Wall-Mounted Split, Ceiling Cassette 4-Way, Ceiling Concealed Ducted, Floor Standing, VRV / VRF, Portable)
  - **Capacity** (0.5 PK to 5.0 PK / BTU rating)
  - **Refrigerant Type** (R32, R410A, R22, R134a)
  - **Installation Date & Serial Number**
  - **Maintenance Cycle** (Every 1, 2, 3, or 6 Months)
  - **Special Technician Notes** (ladder height requirements, breaker panel locations, etc.)
- Real-time search by ID, name, floor, brand, and model.
- Filter by condition: Good, Due Soon, Overdue, and Under Repair.
- 1-click CSV/Excel export for asset inventory.

### 3. 📷 QR Code Generation & Direct Service Logging Flow
- **Direct-to-Form Camera Scanner**: Saat kamera memindai stiker QR unit AC (atau upload gambar QR / cari manual ID), sistem **langsung membuka form pengisian service maintenance** secara otomatis tanpa perlu klik tombol tambahan!
- **Auto-Stop Kamera Saat Pengisian**: Kamera langsung di-pause/stop otomatis saat form terbuka untuk menghemat baterai dan mencegah scan ulang yang tidak disengaja.
- **Ringkasan Unit Terpindai**: Bagian atas form menampilkan ID AC, nama ruangan, lokasi, merk/model, kapasitas freon, dan status operasional.
- **Manual ID Lookup & Upload Foto**: Mendukung input kode AC langsung dengan fitur autocomplete serta scan dari file foto QR.
- **Tombol Scan Ulang**: Teknisi dapat kembali ke kamera dengan 1 klik tombol `Scan AC Lain`.
- **Printable Single QR Asset Tag**: Pratinjau cetak stiker QR satuan siap tempel.
- **Batch Print QR Labels**: Tab khusus untuk cetak seluruh stiker QR sekaligus dalam format multi-kolom rapi.

### 4. 🔧 Technical Maintenance & Inspection Logging
- **Inspection Checklist**:
  - [x] Cuci Indoor Unit, Filter & Cross-Flow Blower Fan
  - [x] Cuci Outdoor Condenser Coil & Casing
  - [x] Pembersihan Talang & Saluran Drain (Anti-Bocor)
  - [x] Cek Tekanan & Deteksi Kebocoran Freon
  - [x] Pemeriksaan Kapasitor, Ampere & Kelistrikan
  - [x] Uji Remote Controller & Thermistor Sensor
- **Diagnostic Measurements & Delta T ($\Delta T$)**:
  - Suction Pressure (PSI) with reference guides for R32/R410A (120–150 PSI) and R22 (65–80 PSI).
  - Operating Electrical Current (Ampere).
  - Return Air Temperature (Inlet) & Supply Air Temperature (Outlet).
  - **Auto-Calculated $\Delta T$ Diagnostic Badge**:
    - $\Delta T < 8^\circ\text{C}$: *Low Cooling Efficiency (Check Refrigerant or Dirty Coil)*
    - $8^\circ\text{C} \le \Delta T \le 14^\circ\text{C}$: *Optimal Cooling Performance*
    - $\Delta T > 14^\circ\text{C}$: *High Delta T (Verify Low Airflow / Fan Speed)*
- Drainage waterflow test (Lancar, Tersumbat, Diperbaiki).
- Noise & vibration check (Halus/Normal, Bising, Getar).
- Freon added tracking (PSI) & Spare parts replacement log.
- Cost tracking (IDR / USD).
- Auto-calculation of the next scheduled service date based on unit maintenance interval.

### 5. 📜 Official Service Work Order / Slip (Printable)
- Professional **Surat Bukti Servis / Work Order Slip** modal formatted for standard printing (`Ctrl+P`).
- Includes company header, asset specifications, technician and vendor info, complete scope of work, technical parameters table, total costs, notes, and dual-signature boxes (Lead Technician & Facility Supervisor).

### 6. ⚡ Multi-Platform Real-Time Cloud Synchronization
- **Update Otomatis di Seluruh Perangkat**: Saat salah satu perangkat (misal HP teknisi A di lapangan) menambah unit AC, mengedit data, atau menyimpan log service, semua perangkat lain (HP teknisi B, tablet supervisor, laptop admin kantor) **langsung ter-update otomatis secara serentak**.
- **Opsi 1: Firebase Realtime Database (Update Seketika < 0.5 Detik)**:
  - Menggunakan WebSocket push dari Google Firebase.
  - Perangkat lain langsung menerima pembaruan secara instan tanpa perlu refresh halaman!
  - 100% Gratis di paket Firebase Spark (tanpa kartu kredit).
- **Opsi 2: Google Sheets Two-Way Auto-Sync**:
  - Menyimpan data langsung ke spreadsheet Google Sheets (Google Drive).
  - Sinkronisasi dua arah otomatis setiap 25 detik dan saat aplikasi dibuka kembali.
- **Offline First**: Tetap dapat bekerja normal meski tidak ada sinyal Wi-Fi di basement/rooftop (data tersimpan di `localStorage`). Saat internet kembali aktif, perubahan otomatis disinkronkan ke cloud.
- **Indikator Status Cloud di Header**: Menampilkan status koneksi (`🟢 Terhubung`, `🟡 Menyinkronkan`, `⚪ Offline`) dan tombol cepat **Sync Now**.

---

## 🚀 Getting Started

### Option 1: Run Locally (Zero Setup)
Simply open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari):
1. Double-click `index.html` or drag it into your browser.
2. The application will launch with sample units and service logs already loaded.
3. Everything runs locally in your browser.

---

## ⚡ Panduan Setup Sinkronisasi Cloud Antar Perangkat

Pilih salah satu metode di bawah ini agar data otomatis sinkron di semua HP dan komputer:

### 🌟 Opsi A: Firebase Realtime Database (Update Instan Tanpa Refresh - Rekomendasi)
1. Buka [console.firebase.google.com](https://console.firebase.google.com) dan login dengan akun Google Anda.
2. Klik **Add project** (Tambah proyek), beri nama misalnya `coolcare-ac`, lalu klik **Continue** sampai selesai.
3. Di menu sidebar kiri, klik **Build** > **Realtime Database** > klik **Create Database**.
   - Pilih lokasi: `Singapore (asia-southeast1)` atau default.
   - Pilih Security Rules: **Start in test mode** (klik Enable).
4. Klik ikon gerigi (Project Settings) di pojok kiri atas > tab **General** > scroll ke bawah ke bagian **Your apps** > klik ikon Web (`</>`).
5. Daftarkan nama app, lalu salin objek `firebaseConfig` yang muncul, contohnya:
   ```json
   {
     "apiKey": "AIzaSy...",
     "authDomain": "coolcare-ac.firebaseapp.com",
     "databaseURL": "https://coolcare-ac-default-rtdb.asia-southeast1.firebasedatabase.app",
     "projectId": "coolcare-ac",
     "storageBucket": "coolcare-ac.appspot.com",
     "messagingSenderId": "...",
     "appId": "..."
   }
   ```
6. Buka aplikasi CoolCare > tab **Settings & Data** > tempelkan JSON tersebut ke kolom **Firebase Config (JSON)** > klik **Uji & Hubungkan Firebase** > klik **Simpan Pengaturan**.
7. **Selesai!** Sekarang buka link web di HP dan di laptop: saat HP menyimpan data, laptop akan langsung ter-update seketika!

---

### 📊 Opsi B: Google Sheets Two-Way Cloud Sync (Google Drive)
1. Buat spreadsheet baru di Google Drive melalui [sheets.new](https://sheets.new).
2. Di Google Sheets, buka menu **Extensions** > **Apps Script**.
3. Buka file `google-apps-script/Code.gs` di proyek ini, copy seluruh kodenya, dan paste ke editor Apps Script.
4. Klik **Deploy** > **New Deployment**:
   - **Type**: Web App
   - **Description**: AC Maintenance API
   - **Execute as**: Me
   - **Who has access**: **Anyone** *(Penting agar teknisi di HP bisa akses)*
5. Klik **Deploy**, beri izin akses (*Authorize access*), lalu salin **Web App URL** (berakhiran `/exec`).
6. Di aplikasi CoolCare, masuk ke tab **Settings & Data**, paste URL tersebut ke kolom **Google Apps Script Web App URL** > klik **Simpan Pengaturan**.
7. Data akan tersinkronisasi otomatis setiap ada input baru dan di-poll setiap 25 detik ke Google Sheet!

---

## 📁 Project Structure

```
d:\Maintenance AC\
├── index.html                   # Main Single Page Application interface & modals
├── css\
│   └── style.css                # Custom styling, dark/light themes, badges & print styles
├── js\
│   ├── app.js                   # Application state, calculations, UI renderers, backup/export
│   ├── cloud-sync.js            # Multi-device cloud sync engine (Firebase & Google Sheets)
│   ├── charts.js                # Chart.js initialization & dynamic updates
│   └── qr-manager.js            # QR Code generation, sticker layouts & camera scanner
├── google-apps-script\
│   └── Code.gs                  # Full two-way sync Google Apps Script backend
└── README.md                    # Dokumentasi & panduan lengkap
```
├── css\
│   └── style.css                # Custom styling, dark/light themes, badge styles & print styles
├── js\
│   ├── app.js                   # Application state, calculations, UI renderers, backup/export
│   ├── charts.js                # Chart.js initialization & dynamic updates
│   └── qr-manager.js            # QR Code generation, sticker layouts & camera scanner
├── google-apps-script\
│   └── Code.gs                  # Google Apps Script code for Google Sheets sync
└── README.md                    # Documentation & guides
```

---

## 💻 Tech Stack
- **HTML5 & Vanilla JavaScript (ES6+)**
- **Bootstrap 5.3.2** (Responsive grid & UI components)
- **Bootstrap Icons 1.11.3**
- **Chart.js 4.4.1** (Dynamic dashboards & analytics)
- **html5-qrcode 2.3.8** (Live camera & image QR scanning)
- **qrcodejs 1.0.0** (Client-side QR code generator)
- **SweetAlert2 11** (Interactive notifications)
