/**
 * Google Apps Script สำหรับระบบลงทะเบียนวันเด็ก
 * โรงเรียนสาธิตอุดมศึกษา
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Registration");
    const data = JSON.parse(e.postData.contents);
    
    // จัดเตรียมข้อมูลให้ตรงกับหัวข้อคอลัมน์
    const timestamp = new Date();
    const rowData = [
      timestamp,
      data.parentName,
      "'" + data.phone, // ใส่ ' นำหน้าเพื่อให้ Google Sheet แสดงเลข 0 นำหน้าเบอร์โทร
      data.lineId || "-",
      data.email || "-",
      data.studentName,
      data.grade,
      data.program,
      data.supportType.join(", "), // แปลง Array เป็นข้อความคั่นด้วยจุลภาค
      data.itemName,
      data.quantity,
      data.cookOnSite ? "Yes" : "No",
      data.setupTime,
      data.needTable ? "Yes" : "No",
      data.notes || "-"
    ];
    
    // บันทึกข้อมูลลงแถวใหม่
    sheet.appendRow(rowData);
    
    // ส่งผลลัพธ์กลับไปยังเว็บไซต์
    return ContentService.createTextOutput(JSON.stringify({ 
      result: "success", 
      message: "Data recorded successfully" 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      result: "error", 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ตั้งค่า CORS เพื่อให้เบราว์เซอร์อนุญาตการส่งข้อมูล
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
