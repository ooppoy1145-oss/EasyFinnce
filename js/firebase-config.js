/**
 * WIRA EASY FINANCE & RENTAL FLEET SYSTEM
 * Firebase Configuration File
 * 
 * คุณสามารถใส่ค่า config ที่คัดลอกจาก Firebase Console ที่นี่
 * หรือจะกดใส่ผ่านหน้าเว็บที่ปุ่ม "☁️ Firebase Sync" บนแถบเมนูด้านบนก็ได้เช่นกัน
 */

window.FIREBASE_CONFIG = {
  // วางค่าที่ได้จาก Firebase Console -> Project Settings -> General -> Your apps -> Web app
  // ตัวอย่าง:
  // apiKey: "AIzaSy...",
  // authDomain: "your-project-id.firebaseapp.com",
  // projectId: "your-project-id",
  // storageBucket: "your-project-id.appspot.com",
  // messagingSenderId: "1234567890",
  // appId: "1:1234567890:web:abcdef123456",
  // databaseURL: "https://your-project-id-default-rtdb.firebaseio.com" // (จำเป็นเฉพาะกรณีใช้ Realtime Database)
};

window.FIREBASE_SETTINGS = {
  // เลือกฐานข้อมูล: 'firestore' (Cloud Firestore - แนะนำ) หรือ 'rtdb' (Realtime Database)
  dbType: 'firestore',
  // ชื่อ Collection ใน Firestore หรือชื่อ Root Node ใน Realtime Database
  collectionName: 'motorcycle_fleet',
  // ซิงค์อัตโนมัติเมื่อเปิดเว็บ
  autoSync: true
};
