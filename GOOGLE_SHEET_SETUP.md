# คู่มือการเชื่อมต่อระบบลงทะเบียนกับ Google Sheets

## ขั้นตอนที่ 1: เตรียม Google Sheet
1. สร้าง Google Sheet ใหม่
2. ตั้งชื่อ Sheet แรกว่า `Registration`
3. ในแถวแรก (Header) ให้พิมพ์หัวข้อคอลัมน์ดังนี้ (รวม 15 คอลัมน์):
   - Timestamp (เวลาที่ลงทะเบียน)
   - Parent Name (ชื่อผู้ปกครอง)
   - Phone (เบอร์โทรศัพท์)
   - Line ID
   - Email
   - Student Name (ชื่อนักเรียน)
   - Grade (ระดับชั้น)
   - Program (โปรแกรมการเรียน)
   - Support Types (ประเภทการสนับสนุน)
   - Item Name (ชื่อรายการ)
   - Quantity (จำนวน)
   - Cook On Site (ประกอบอาหารหน้างาน)
   - Setup Time (เวลาเข้าจัดบูท)
   - Need Table (ต้องการโต๊ะ)
   - Notes (หมายเหตุ)

## ขั้นตอนที่ 2: ตั้งค่า Google Apps Script
1. ที่หน้า Google Sheet ไปที่เมนู **Extensions (ส่วนขยาย)** > **Apps Script**
2. คัดลอกโค้ดจากไฟล์ `code.gs` ในโปรเจกต์นี้ไปวางแทนที่โค้ดเดิม
3. กดปุ่ม **Save (บันทึก)**
4. กดปุ่ม **Deploy (ทำให้ใช้งานได้)** > **New Deployment (การทำให้ใช้งานได้ใหม่)**
5. เลือกประเภทเป็น **Web App (แอปเว็บ)**
6. ตั้งค่าดังนี้:
   - Description: `Children Day Registration API`
   - Execute as: **Me (ตัวฉัน)**
   - Who has access: **Anyone (ทุกคน)** (เพื่อให้เว็บไซต์ส่งข้อมูลเข้ามาได้)
7. กด **Deploy** และคัดลอก **Web App URL** ไว้

## ขั้นตอนที่ 3: เชื่อมต่อกับเว็บไซต์
1. นำ Web App URL ที่ได้จากขั้นตอนก่อนหน้า มาวางในไฟล์ `App.tsx` ที่ตัวแปร `SCRIPT_URL`
2. ทดสอบการส่งข้อมูล
