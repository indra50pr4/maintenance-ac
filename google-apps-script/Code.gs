/**
 * Google Apps Script Backend for AC Maintenance System (Full Multi-Device Two-Way Sync)
 * 
 * Panduan Setup:
 * 1. Buka Google Sheets (https://sheets.new)
 * 2. Masuk ke Extensions > Apps Script
 * 3. Hapus kode lama, paste seluruh kode ini ke dalam Code.gs
 * 4. Klik "Deploy" > "New Deployment"
 * 5. Pilih Type: "Web App"
 * 6. Execute as: "Me"
 * 7. Who has access: "Anyone" (Penting agar web app di HP bisa mengakses tanpa login Google)
 * 8. Klik "Deploy", beri izin (Authorize), lalu salin Web App URL (akhiran /exec).
 * 9. Tempelkan URL tersebut ke menu Settings di Web App AC Maintenance.
 */

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'ping';
  
  if (action === 'ping') {
    return createJsonResponse({
      status: 'success',
      message: 'AC Maintenance Cloud Backend is online.',
      timestamp: new Date().toISOString()
    });
  }

  if (action === 'getAll') {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = initSheets(ss);
    
    const unitsData = sheets.unitsSheet.getDataRange().getValues();
    const logsData = sheets.logsSheet.getDataRange().getValues();

    return createJsonResponse({
      status: 'success',
      units: formatRows(unitsData),
      logs: formatRows(logsData),
      timestamp: new Date().toISOString()
    });
  }

  return createJsonResponse({ status: 'unknown_action' });
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const action = postData.action;
    const sheets = initSheets(ss);

    // 1. Tambah Log Service Maintenance
    if (action === 'addService') {
      const srv = postData.data;
      const m = srv.measurements || {};

      sheets.logsSheet.appendRow([
        srv.id || ('SRV-' + new Date().getTime()),
        srv.acId,
        srv.date,
        srv.technician,
        srv.vendor,
        srv.serviceType,
        (srv.tasksCompleted || []).join('; '),
        m.suctionPsi || '',
        m.currentAmpere || '',
        m.inletTempC || '',
        m.outletTempC || '',
        m.deltaTempC || '',
        m.drainStatus || '',
        m.noiseStatus || '',
        srv.freonAddedPsi || 0,
        srv.partsReplaced || '',
        srv.cost || 0,
        srv.unitStatusAfter || 'Normal',
        srv.notes || '',
        new Date()
      ]);

      // Update unit last & next service in Units sheet
      updateUnitServiceDates(sheets.unitsSheet, srv.acId, srv.date, srv.unitStatusAfter);

      return createJsonResponse({
        status: 'success',
        message: 'Service record logged in Google Sheet successfully'
      });
    }

    // 2. Simpan / Perbarui Data Unit AC
    if (action === 'saveUnit') {
      const unit = postData.data;
      saveOrUpdateUnitRow(sheets.unitsSheet, unit);
      return createJsonResponse({ status: 'success', message: 'Unit saved successfully' });
    }

    // 3. Hapus Unit AC
    if (action === 'deleteUnit') {
      const unitId = postData.data.id;
      deleteUnitRow(sheets.unitsSheet, unitId);
      return createJsonResponse({ status: 'success', message: 'Unit deleted successfully' });
    }

    // 4. Sinkronisasi Keseluruhan (Full Sync)
    if (action === 'syncAll') {
      const payload = postData.data;
      if (payload.units && Array.isArray(payload.units)) {
        payload.units.forEach(u => saveOrUpdateUnitRow(sheets.unitsSheet, u));
      }
      return createJsonResponse({ status: 'success', message: 'All data synchronized successfully' });
    }

    return createJsonResponse({ status: 'ignored' });
  } catch (err) {
    return createJsonResponse({
      status: 'error',
      message: err.toString()
    });
  }
}

function saveOrUpdateUnitRow(sheet, unit) {
  const data = sheet.getDataRange().getValues();
  let foundRow = -1;

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === unit.id) {
      foundRow = i + 1;
      break;
    }
  }

  const rowValues = [
    unit.id,
    unit.name || '',
    unit.location || '',
    unit.floor || '',
    unit.brand || '',
    unit.model || '',
    unit.type || '',
    unit.capacity || '',
    unit.refrigerant || 'R32',
    unit.installDate || '',
    unit.frequencyMonths || 3,
    unit.lastServiceDate || '-',
    unit.nextServiceDate || '',
    unit.status || 'Normal',
    unit.serialNumber || '',
    unit.technicianNotes || ''
  ];

  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }
}

function deleteUnitRow(sheet, unitId) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === unitId) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
}

function updateUnitServiceDates(sheet, acId, serviceDate, statusAfter) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === acId) {
      sheet.getRange(i + 1, 12).setValue(serviceDate.split('T')[0]);
      sheet.getRange(i + 1, 14).setValue(statusAfter);
      break;
    }
  }
}

function initSheets(ss) {
  let unitsSheet = ss.getSheetByName('Units');
  if (!unitsSheet) {
    unitsSheet = ss.insertSheet('Units');
    unitsSheet.appendRow([
      'ID', 'Name', 'Location', 'Floor', 'Brand', 'Model', 'Type', 'Capacity', 
      'Refrigerant', 'InstallDate', 'FrequencyMonths', 'LastService', 'NextService', 
      'Status', 'SerialNumber', 'Notes'
    ]);
    unitsSheet.setFrozenRows(1);
  }

  let logsSheet = ss.getSheetByName('Maintenance_Logs');
  if (!logsSheet) {
    logsSheet = ss.insertSheet('Maintenance_Logs');
    logsSheet.appendRow([
      'Service ID', 'AC ID', 'Date', 'Technician', 'Vendor', 'Service Type', 
      'Tasks Completed', 'Suction PSI', 'Ampere', 'Inlet °C', 'Outlet °C', 'Delta T °C', 
      'Drain Status', 'Noise Status', 'Freon Added PSI', 'Parts Replaced', 'Cost', 
      'Status After', 'Notes', 'Logged At'
    ]);
    logsSheet.setFrozenRows(1);
  }

  return { unitsSheet: unitsSheet, logsSheet: logsSheet };
}

function formatRows(values) {
  if (values.length <= 1) return [];
  const headers = values[0];
  const list = [];
  for (let i = 1; i < values.length; i++) {
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[i][j];
    }
    list.push(obj);
  }
  return list;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
