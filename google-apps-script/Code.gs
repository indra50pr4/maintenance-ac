/**
 * Google Apps Script Backend for AC Maintenance System
 * 
 * Instructions:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Create 2 tabs named: "Units" and "Maintenance_Logs"
 * 3. Go to Extensions > Apps Script
 * 4. Paste this code into Code.gs
 * 5. Click "Deploy" > "New Deployment"
 * 6. Select Type: "Web App"
 * 7. Execute as: "Me", Who has access: "Anyone"
 * 8. Copy the Web App URL and paste it into the Web App Settings > Google Apps Script Webhook URL.
 */

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'ping';
  
  if (action === 'ping') {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'AC Maintenance Apps Script endpoint is online.'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'getAll') {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const unitsSheet = ss.getSheetByName('Units') || initSheets(ss).unitsSheet;
    const logsSheet = ss.getSheetByName('Maintenance_Logs') || initSheets(ss).logsSheet;

    const unitsData = unitsSheet.getDataRange().getValues();
    const logsData = logsSheet.getDataRange().getValues();

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      units: formatRows(unitsData),
      logs: formatRows(logsData)
    })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ status: 'unknown_action' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const action = postData.action;

    if (action === 'addService') {
      const srv = postData.data;
      const logsSheet = ss.getSheetByName('Maintenance_Logs') || initSheets(ss).logsSheet;
      const m = srv.measurements || {};

      logsSheet.appendRow([
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
      updateUnitServiceDates(ss, srv.acId, srv.date, srv.unitStatusAfter);

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Service record logged in Google Sheet successfully'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'ignored' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function updateUnitServiceDates(ss, acId, serviceDate, statusAfter) {
  const unitsSheet = ss.getSheetByName('Units') || initSheets(ss).unitsSheet;
  const data = unitsSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === acId) {
      // Column index for Last Service is 11 (L), Status is 13 (N)
      unitsSheet.getRange(i + 1, 12).setValue(serviceDate.split('T')[0]);
      unitsSheet.getRange(i + 1, 14).setValue(statusAfter);
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
