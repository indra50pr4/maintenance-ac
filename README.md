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

### 6. 💾 Zero-Setup Storage, Backup & Cloud Sync
- **Local Persistence**: Works out of the box with zero server configuration using `localStorage`.
- **Pre-loaded Demo Building Data**: Pre-configured with realistic office, boardroom, cafeteria, and server room AC units so you can test immediately.
- **One-Click JSON Backup & Restore**: Download full database backup or restore onto any phone, tablet, or PC.
- **Export to CSV**: Export both AC Units and Service History to Excel-compatible CSV files.
- **Optional Google Sheets Sync**: Connect directly to Google Sheets using the included Google Apps Script backend (`google-apps-script/Code.gs`).

---

## 🚀 Getting Started

### Option 1: Run Locally (Zero Setup)
Simply open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari):
1. Double-click `index.html` or drag it into your browser.
2. The application will launch with sample units and service logs already loaded.
3. Everything runs locally in your browser.

### Option 2: Run with Local Web Server
If you wish to test camera QR scanning on mobile devices over local Wi-Fi:
```powershell
# Using Python (if installed)
python -m http.server 8080

# Or using Node / npx
npx serve .
```
Then navigate to `http://localhost:8080` (or your local IP on your mobile phone).

---

## ☁️ Google Sheets Cloud Sync Setup (Optional)

If you wish to save service records to a Google Sheet in the cloud:

1. Create a new Google Sheet at [sheets.new](https://sheets.new).
2. Go to **Extensions** > **Apps Script**.
3. Open `google-apps-script/Code.gs` in this project, copy all its code, and paste it into the Google Apps Script editor.
4. Click **Deploy** > **New Deployment**:
   - **Type**: Web App
   - **Description**: AC Maintenance API
   - **Execute as**: Me
   - **Who has access**: Anyone
5. Click **Deploy**, authorize access, and copy the **Web App URL** (e.g. `https://script.google.com/macros/s/.../exec`).
6. In the CoolCare Web App, navigate to the **Settings & Data** tab, paste your Web App URL into **Google Apps Script Web App URL**, click **Test**, and click **Save Settings**.
7. Every time a maintenance service is logged, it will automatically append to your Google Sheet!

---

## 📁 Project Structure

```
d:\Maintenance AC\
├── index.html                   # Main Single Page Application interface & modals
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
