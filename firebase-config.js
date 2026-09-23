/**
 * EasyFinance - Firebase & Cloud Database Manager
 * รองรับการเชื่อมต่อ Firebase Firestore แบบ Real-time ข้ามอุปกรณ์
 * พร้อมระบบ LocalStorage Fallback อัตโนมัติ (พร้อมทำงานได้ทันทีแม้ยังไม่ใส่ Firebase Key หรือบน GitHub Pages)
 */

// ====================================================================
// ⚡ FIREBASE CLOUD DATABASE CONFIG (ผูกในโค้ดโดยตรงตรงนี้)
// เมื่อใส่ค่าคอนฟิกที่นี่ พนักงานทุกคนที่เปิดลิงก์ผ่านมือถือหรือคอม จะซิงค์ข้อมูลเรียลไทม์ตรงกัน 100%
// ไม่ต้องกดตั้งค่าใดๆ ในหน้าเว็บอีกต่อไป
// ====================================================================
const defaultFirebaseConfig = {
  apiKey: "AIzaSyDzcnvH-fJm9PH3Q6thDSpUaeTz3-0jMEI",
  authDomain: "easyfinance-847ed.firebaseapp.com",
  projectId: "easyfinance-847ed",
  storageBucket: "easyfinance-847ed.firebasestorage.app",
  messagingSenderId: "1074903630791",
  appId: "1:1074903630791:web:9c06ad5bc531b60097cfe2"
};

// ข้อมูลเริ่มต้นสำหรับระบบ (Initial Realistic Seed Data)
const INITIAL_PAYMENT_SETTINGS = {
  bankName: "ธนาคารกสิกรไทย (KBANK)",
  accountNumber: "089-2-88899-0",
  accountName: "บจก. อีซี่ไฟแนนซ์ โซลูชั่นส์",
  promptPayNumber: "0891234567",
  promptPayName: "บจก. อีซี่ไฟแนนซ์ โซลูชั่นส์",
  officerPhone: "089-123-4567",
  officerLine: "@easyfinance",
  // SVG QR Code PromptPay มาตรฐาน (แสดงเป็นรูป QR สวยงามจนกว่าแอดมินจะอัปโหลดรูปของตนเอง)
  qrImageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300' width='300' height='300'><rect width='300' height='300' fill='%23ffffff'/><rect x='20' y='20' width='80' height='80' fill='%23000000'/><rect x='30' y='30' width='60' height='60' fill='%23ffffff'/><rect x='40' y='40' width='40' height='40' fill='%23000000'/><rect x='200' y='20' width='80' height='80' fill='%23000000'/><rect x='210' y='30' width='60' height='60' fill='%23ffffff'/><rect x='220' y='40' width='40' height='40' fill='%23000000'/><rect x='20' y='200' width='80' height='80' fill='%23000000'/><rect x='30' y='210' width='60' height='60' fill='%23ffffff'/><rect x='40' y='220' width='40' height='40' fill='%23000000'/><rect x='120' y='30' width='20' height='60' fill='%23000000'/><rect x='150' y='20' width='30' height='20' fill='%23000000'/><rect x='110' y='110' width='80' height='80' fill='%2300796B'/><text x='150' y='155' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23ffffff' text-anchor='middle'>PROMPT</text><text x='150' y='175' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23ffffff' text-anchor='middle'>PAY</text><rect x='40' y='120' width='50' height='20' fill='%23000000'/><rect x='30' y='160' width='30' height='20' fill='%23000000'/><rect x='220' y='120' width='40' height='30' fill='%23000000'/><rect x='200' y='170' width='60' height='20' fill='%23000000'/><rect x='120' y='210' width='40' height='20' fill='%23000000'/><rect x='170' y='240' width='50' height='30' fill='%23000000'/><rect x='120' y='250' width='30' height='30' fill='%23000000'/><text x='150' y='292' font-family='sans-serif' font-size='11' font-weight='bold' fill='%23333333' text-anchor='middle'>สแกนเพื่อชำระค่างวด EasyFinance</text></svg>",
  updatedAt: new Date().toISOString()
};

const INITIAL_CONTRACTS = [
  {
    id: "EF-2026-001",
    email: "somchai@easyfinance.com",
    password: "password123",
    name: "นายสมชาย มั่นคงดี",
    phone: "081-998-7766",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    itemFinanced: "ผ่อนทองคำแท่ง 1 บาท (96.5%)",
    totalAmount: 42000,
    interestRate: 1.5,
    totalInstallments: 6,
    duration: "6 เดือน",
    paymentFrequency: "monthly", // daily | weekly | monthly
    dueSchedule: "ทุกวันที่ 1 ของเดือน",
    closedContractsCount: 2,
    status: "active",
    createdAt: "2026-01-01T00:00:00Z",
    installments: [
      {
        installmentNo: 1,
        dueDate: "2026-02-01",
        amount: 7000,
        status: "paid",
        paidAt: "2026-02-01 10:15 น.",
        slipUrl: "",
        transactionRef: "TR260201091523",
        remainingBalanceAfter: 35000
      },
      {
        installmentNo: 2,
        dueDate: "2026-03-01",
        amount: 7000,
        status: "paid",
        paidAt: "2026-03-01 14:30 น.",
        slipUrl: "",
        transactionRef: "TR260301143099",
        remainingBalanceAfter: 28000
      },
      {
        installmentNo: 3,
        dueDate: "2026-04-01",
        amount: 7000,
        status: "pending",
        paidAt: null,
        slipUrl: null,
        transactionRef: null,
        remainingBalanceAfter: 21000
      },
      {
        installmentNo: 4,
        dueDate: "2026-05-01",
        amount: 7000,
        status: "pending",
        paidAt: null,
        slipUrl: null,
        transactionRef: null,
        remainingBalanceAfter: 14000
      },
      {
        installmentNo: 5,
        dueDate: "2026-06-01",
        amount: 7000,
        status: "pending",
        paidAt: null,
        slipUrl: null,
        transactionRef: null,
        remainingBalanceAfter: 7000
      },
      {
        installmentNo: 6,
        dueDate: "2026-07-01",
        amount: 7000,
        status: "pending",
        paidAt: null,
        slipUrl: null,
        transactionRef: null,
        remainingBalanceAfter: 0
      }
    ]
  },
  {
    id: "EF-2026-002",
    email: "kanda@easyfinance.com",
    password: "password123",
    name: "นางสาวกานดา รุ่งเรือง",
    phone: "089-555-4321",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    itemFinanced: "สินเชื่อเงินสดหมุนเวียนธุรกิจ",
    totalAmount: 15000,
    interestRate: 2.0,
    totalInstallments: 30,
    duration: "30 วัน",
    paymentFrequency: "daily",
    dueSchedule: "ทุกวัน (รายวัน)",
    closedContractsCount: 1,
    status: "active",
    createdAt: "2026-09-01T00:00:00Z",
    installments: Array.from({ length: 30 }, (_, i) => {
      const day = i + 1;
      const isPaid = day <= 18;
      const isToday = day === 19;
      return {
        installmentNo: day,
        dueDate: `2026-09-${String(day).padStart(2, "0")}`,
        amount: 500,
        status: isPaid ? "paid" : "pending",
        paidAt: isPaid ? `2026-09-${String(day).padStart(2, "0")} 09:00 น.` : null,
        slipUrl: null,
        transactionRef: isPaid ? `TR2609${String(day).padStart(2, "0")}090000` : null,
        remainingBalanceAfter: 15000 - day * 500
      };
    })
  },
  {
    id: "EF-2026-003",
    email: "veerawat@easyfinance.com",
    password: "password123",
    name: "นายวีระวัฒน์ คงเกษม",
    phone: "086-112-9988",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    itemFinanced: "ผ่อนโทรศัพท์มือถือ iPhone 16 Pro Max 256GB",
    totalAmount: 48000,
    interestRate: 0,
    totalInstallments: 12,
    duration: "12 สัปดาห์",
    paymentFrequency: "weekly",
    dueSchedule: "ทุกวันศุกร์ (รายสัปดาห์)",
    closedContractsCount: 0,
    status: "active",
    createdAt: "2026-08-01T00:00:00Z",
    installments: Array.from({ length: 12 }, (_, i) => {
      const isPaid = i < 4;
      return {
        installmentNo: i + 1,
        dueDate: `งวดสัปดาห์ที่ ${i + 1}`,
        amount: 4000,
        status: isPaid ? "paid" : "pending",
        paidAt: isPaid ? `สัปดาห์ที่ ${i + 1}` : null,
        slipUrl: null,
        transactionRef: isPaid ? `TRWEEKLY0${i + 1}` : null,
        remainingBalanceAfter: 48000 - (i + 1) * 4000
      };
    })
  },
  {
    id: "EF-2026-004",
    email: "prasit@easyfinance.com",
    password: "password123",
    name: "นายประสิทธิ์ มีทรัพย์",
    phone: "082-345-6789",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    itemFinanced: "สินเชื่อด่วนรายวันเพื่อการค้า",
    totalAmount: 12000,
    interestRate: 2.0,
    totalInstallments: 24,
    duration: "24 วัน",
    paymentFrequency: "daily",
    dueSchedule: "ทุกวัน (รายวัน)",
    closedContractsCount: 3,
    status: "active",
    createdAt: "2026-09-01T00:00:00Z",
    installments: Array.from({ length: 24 }, (_, i) => {
      const day = i + 1;
      const isPaid = day <= 12;
      const todayStr = new Date().toISOString().slice(0, 10);
      return {
        installmentNo: day,
        dueDate: `2026-09-${String(day).padStart(2, "0")}`,
        amount: 500,
        status: isPaid ? "paid" : "pending",
        paidAt: isPaid ? (day === 12 ? `${todayStr} 08:30 น.` : `2026-09-${String(day).padStart(2, "0")} 08:30 น.`) : null,
        slipUrl: null,
        transactionRef: isPaid ? `TR2609${String(day).padStart(2, "0")}083000` : null,
        remainingBalanceAfter: 12000 - day * 500
      };
    })
  },
  {
    id: "EF-2026-005",
    email: "wanna@easyfinance.com",
    password: "password123",
    name: "นางวรรณา สดใส",
    phone: "083-999-1234",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    itemFinanced: "ผ่อน iPad Air M2 เพื่อการศึกษา",
    totalAmount: 24000,
    interestRate: 0,
    totalInstallments: 6,
    duration: "6 เดือน",
    paymentFrequency: "monthly",
    dueSchedule: "ทุกวันที่ 5 ของเดือน",
    closedContractsCount: 1,
    status: "active",
    createdAt: "2026-07-01T00:00:00Z",
    installments: [
      {
        installmentNo: 1,
        dueDate: "2026-08-05",
        amount: 4000,
        status: "paid",
        paidAt: "2026-08-05 11:20 น.",
        slipUrl: null,
        transactionRef: "TR260805112001",
        remainingBalanceAfter: 20000
      },
      {
        installmentNo: 2,
        dueDate: "2026-09-05",
        amount: 4000,
        status: "paid",
        paidAt: `${new Date().toISOString().slice(0, 7)}-05 10:15 น.`,
        slipUrl: null,
        transactionRef: "TR260905101502",
        remainingBalanceAfter: 16000
      },
      {
        installmentNo: 3,
        dueDate: "2026-10-05",
        amount: 4000,
        status: "pending",
        paidAt: null,
        slipUrl: null,
        transactionRef: null,
        remainingBalanceAfter: 12000
      },
      {
        installmentNo: 4,
        dueDate: "2026-11-05",
        amount: 4000,
        status: "pending",
        paidAt: null,
        slipUrl: null,
        transactionRef: null,
        remainingBalanceAfter: 8000
      },
      {
        installmentNo: 5,
        dueDate: "2026-12-05",
        amount: 4000,
        status: "pending",
        paidAt: null,
        slipUrl: null,
        transactionRef: null,
        remainingBalanceAfter: 4000
      },
      {
        installmentNo: 6,
        dueDate: "2027-01-05",
        amount: 4000,
        status: "pending",
        paidAt: null,
        slipUrl: null,
        transactionRef: null,
        remainingBalanceAfter: 0
      }
    ]
  },
  {
    id: "EF-2026-006",
    email: "nattapon@easyfinance.com",
    password: "password123",
    name: "นายณัฐพล บุญช่วย",
    phone: "085-777-8899",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    itemFinanced: "สินเชื่อหมุนเวียนพ่อค้าตลาดสด",
    totalAmount: 16000,
    interestRate: 1.5,
    totalInstallments: 8,
    duration: "8 สัปดาห์",
    paymentFrequency: "weekly",
    dueSchedule: "ทุกวันพุธ (รายสัปดาห์)",
    closedContractsCount: 2,
    status: "active",
    createdAt: "2026-08-15T00:00:00Z",
    installments: Array.from({ length: 8 }, (_, i) => {
      const isPaid = i < 5;
      const todayStr = new Date().toISOString().slice(0, 10);
      return {
        installmentNo: i + 1,
        dueDate: `งวดสัปดาห์ที่ ${i + 1}`,
        amount: 2000,
        status: isPaid ? "paid" : "pending",
        paidAt: isPaid ? (i === 4 ? `${todayStr} 09:15 น.` : `สัปดาห์ที่ ${i + 1}`) : null,
        slipUrl: null,
        transactionRef: isPaid ? `TRWK260${i + 1}` : null,
        remainingBalanceAfter: 16000 - (i + 1) * 2000
      };
    })
  }
];

// Bank Slip Verification Default API Settings
const INITIAL_BANK_API_SETTINGS = {
  provider: "mock", // "mock" | "slipok" | "easyslip" | "openslipverify"
  apiKey: "",
  branchId: "",
  webhookSecret: "",
  autoApproveOnMatch: true
};

// ⚠️ INITIAL BAD DEBTS (ข้อมูลตัวอย่างประวัติหนี้เสีย, แบล็คลิส, ผ่อนล่าช้า)
const INITIAL_BAD_DEBTS = [
  {
    id: "BD-2026-001",
    name: "นายวิเชียร ทองหล่อ",
    idCard: "1-1020-00345-67-8",
    phone: "089-445-5667",
    address: "99/12 หมู่ 4 ต.บางกรวย อ.บางกรวย จ.นนทบุรี 11130",
    category: "bad_debt", // "bad_debt" (หนี้เสีย) | "blacklist" (แบล็คลิส) | "delayed" (ผ่อนล่าช้า)
    amount: 35000,
    itemDescription: "ผ่อนรถจักรยานยนต์ Honda Wave 110i",
    note: "ขาดการติดต่อเกิน 90 วัน ย้ายที่อยู่หนี ไม่สามารถติดต่อผู้ค้ำประกันได้",
    recordedAt: "2026-06-15"
  },
  {
    id: "BD-2026-002",
    name: "นางสาวพิมลวรรณ สุขเกษม",
    idCard: "3-4015-00892-11-4",
    phone: "092-334-1122",
    address: "142/5 ถนนสุขุมวิท 71 แขวงพระโขนงเหนือ เขตวัฒนา กทม. 10110",
    category: "blacklist", // "blacklist" (แบล็คลิส)
    amount: 52000,
    itemDescription: "สินเชื่อเงินสดหมุนเวียนธุรกิจ",
    note: "ปลอมแปลงเอกสารสลิปเงินเดือนและถูกฟ้องดำเนินคดี ติดสถานะแบล็กลิสต์ถาวร",
    recordedAt: "2026-07-20"
  },
  {
    id: "BD-2026-003",
    name: "นายอนุชา มั่นประสิทธิ์",
    idCard: "1-5099-00213-44-9",
    phone: "081-778-9900",
    address: "55/8 หมู่ 2 ต.หนองปรือ อ.บางละมุง จ.ชลบุรี 20150",
    category: "delayed", // "delayed" (ผ่อนล่าช้า)
    amount: 14000,
    itemDescription: "ผ่อนทองคำแท่ง 1 สลึง",
    note: "ผลัดผ่อนชำระเกินกำหนดทุกงวด ต้องโทรติดตามมากกว่า 5 ครั้ง/งวด อยู่ในกลุ่มเฝ้าระวังพิเศษ",
    recordedAt: "2026-08-10"
  },
  {
    id: "BD-2026-004",
    name: "นายศักดิ์ดา เลิศวิริยะ",
    idCard: "3-1006-00782-33-1",
    phone: "095-882-1234",
    address: "210/14 ถนนมิตรภาพ ต.ในเมือง อ.เมือง จ.ขอนแก่น 40000",
    category: "bad_debt", // "bad_debt" (หนี้เสีย)
    amount: 28000,
    itemDescription: "ผ่อน iPhone 15 Pro Max",
    note: "ส่งงวดแรกงวดเดียวแล้วตัดสัญญาณเบอร์ติดต่อ บล็อคทุกช่องทาง",
    recordedAt: "2026-09-01"
  }
];

class EasyFinanceDatabase {
  constructor() {
    this.storageKeyPrefix = "easyfinance_";
    this.firebaseApp = null;
    this.firestore = null;
    this.isFirebaseConnected = false;
    this.listeners = [];

    this.initDatabase();
  }

  initDatabase() {
    // 1. ตรวจสอบการตั้งค่าใน LocalStorage
    const hasFirebase = defaultFirebaseConfig && defaultFirebaseConfig.projectId;

    if (hasFirebase) {
      // ⚡ โหมด Cloud เชื่อมต่อจริง:
      // ป้องกันไม่ให้เครื่องใหม่แอบใส่ INITIAL_CONTRACTS / INITIAL_BAD_DEBTS จำลองลงเครื่อง
      // เพื่อให้ทุกเครื่องที่เปิดลิงก์แสดงเฉพาะข้อมูลจริงล่าสุดจาก Cloud เท่านั้น
      if (!localStorage.getItem(this.storageKeyPrefix + "contracts")) {
        localStorage.setItem(this.storageKeyPrefix + "contracts", JSON.stringify([]));
      }
      if (!localStorage.getItem(this.storageKeyPrefix + "bad_debts")) {
        localStorage.setItem(this.storageKeyPrefix + "bad_debts", JSON.stringify([]));
      }
      if (!localStorage.getItem(this.storageKeyPrefix + "settings")) {
        localStorage.setItem(this.storageKeyPrefix + "settings", JSON.stringify(INITIAL_PAYMENT_SETTINGS));
      }
      if (!localStorage.getItem(this.storageKeyPrefix + "bank_api_settings")) {
        localStorage.setItem(this.storageKeyPrefix + "bank_api_settings", JSON.stringify(INITIAL_BANK_API_SETTINGS));
      }
    } else {
      // โหมด Local Offline (เฉพาะเมื่อไม่มี Firebase Key เท่านั้น)
      const isInitialized = localStorage.getItem(this.storageKeyPrefix + "initialized");
      if (!isInitialized) {
        if (!localStorage.getItem(this.storageKeyPrefix + "contracts")) {
          localStorage.setItem(
            this.storageKeyPrefix + "contracts",
            JSON.stringify(INITIAL_CONTRACTS)
          );
        }
        if (!localStorage.getItem(this.storageKeyPrefix + "bad_debts")) {
          localStorage.setItem(
            this.storageKeyPrefix + "bad_debts",
            JSON.stringify(INITIAL_BAD_DEBTS)
          );
        }
        localStorage.setItem(this.storageKeyPrefix + "initialized", "true");
      }

      if (!localStorage.getItem(this.storageKeyPrefix + "settings")) {
        localStorage.setItem(
          this.storageKeyPrefix + "settings",
          JSON.stringify(INITIAL_PAYMENT_SETTINGS)
        );
      }

      if (!localStorage.getItem(this.storageKeyPrefix + "bank_api_settings")) {
        localStorage.setItem(
          this.storageKeyPrefix + "bank_api_settings",
          JSON.stringify(INITIAL_BANK_API_SETTINGS)
        );
      }
    }

    // 2. ลองเชื่อมต่อ Firebase หากมี config ที่ผู้ใช้บันทึกไว้
    this.tryConnectFirebase();

    // 3. ฟังการเปลี่ยนแปลงข้าม Tab (BroadcastChannel / storage event)
    window.addEventListener("storage", (e) => {
      if (e.key && e.key.startsWith(this.storageKeyPrefix)) {
        this.notifyListeners();
      }
    });
  }

  getFirebaseConfig() {
    // 1. ให้ความสำคัญสูงสุดกับค่า config ที่ผูกไว้ในโค้ด (defaultFirebaseConfig)
    if (defaultFirebaseConfig && defaultFirebaseConfig.projectId) {
      return defaultFirebaseConfig;
    }
    const saved = localStorage.getItem(this.storageKeyPrefix + "firebase_config");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultFirebaseConfig;
      }
    }
    return defaultFirebaseConfig;
  }

  saveFirebaseConfig(config) {
    localStorage.setItem(
      this.storageKeyPrefix + "firebase_config",
      JSON.stringify(config)
    );
    this.tryConnectFirebase();
  }

  async tryConnectFirebase() {
    const config = this.getFirebaseConfig();
    if (config && config.projectId && window.firebase && window.firebase.firestore) {
      try {
        if (!firebase.apps.length) {
          this.firebaseApp = firebase.initializeApp(config);
        } else {
          this.firebaseApp = firebase.app();
        }
        this.firestore = firebase.firestore();
        this.isFirebaseConnected = true;
        console.log("⚡ Firebase Firestore Connected Successfully!");

        // ซิงค์ Firestore Realtime Listener
        this.setupFirestoreListeners();
      } catch (err) {
        console.warn("Firebase Init Failed, falling back to LocalStorage:", err);
        this.isFirebaseConnected = false;
      }
    } else {
      this.isFirebaseConnected = false;
    }
  }

  setupFirestoreListeners() {
    if (!this.firestore) return;

    // Listen to Contracts (ซิงค์สัญญาทั้งหมดแบบ Real-time ตรงจาก Cloud 100%)
    this.firestore.collection("contracts").onSnapshot((snapshot) => {
      const contracts = [];
      snapshot.forEach((doc) => {
        if (doc.id.startsWith("_")) return; // ข้ามเอกสาร config ภายใน
        contracts.push({ id: doc.id, ...doc.data() });
      });

      // ซิงค์ตรงจาก Cloud ลงเครื่องเสมอ (Cloud คือข้อมูลจริงชุดเดียว ไม่มีการดัน Mock data กลับขึ้นไปเด็ดขาด)
      localStorage.setItem(
        this.storageKeyPrefix + "contracts",
        JSON.stringify(contracts)
      );
      this.notifyListeners();
    }, (error) => {
      console.error("❌ Firestore contracts snapshot error:", error);
      if (error && (error.code === "permission-denied" || (error.message && error.message.includes("permission")))) {
        console.warn("⚠️ Firebase Security Rules ไม่อนุญาตให้อ่าน/เขียน! กรุณาเปิด Rules ใน Firebase Console ให้เป็น 'allow read, write: if true;'");
      }
    });

    // Listen to Payment Settings (ซิงค์ QR และบัญชีธนาคารแบบ Real-time)
    this.firestore.collection("settings").doc("payment").onSnapshot((doc) => {
      if (doc.exists) {
        localStorage.setItem(
          this.storageKeyPrefix + "settings",
          JSON.stringify(doc.data())
        );
        this.notifyListeners();
      }
    }, (error) => {
      console.error("❌ Firestore settings snapshot error:", error);
    });

    // Listen to Bad Debts (ซิงค์ประวัติหนี้เสีย / แบล็คลิส / ผ่อนล่าช้า แบบ Real-time ตรงจาก Cloud 100%)
    this.firestore.collection("bad_debts").onSnapshot((snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        if (doc.id.startsWith("_")) return;
        list.push({ id: doc.id, ...doc.data() });
      });

      // ซิงค์ตรงจาก Cloud ลงเครื่องเสมอ
      localStorage.setItem(this.storageKeyPrefix + "bad_debts", JSON.stringify(list));
      this.notifyListeners();
    }, (error) => {
      console.error("❌ Firestore bad_debts snapshot error:", error);
    });
  }

  // --- CONTRACTS METHODS ---

  getContracts() {
    try {
      const data = localStorage.getItem(this.storageKeyPrefix + "contracts");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading contracts:", e);
      return [];
    }
  }

  getContractById(id) {
    const contracts = this.getContracts();
    return contracts.find((c) => c.id === id) || null;
  }

  getContractByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    const contracts = this.getContracts();
    return contracts.find(
      (c) =>
        c.email.toLowerCase() === cleanEmail ||
        c.id.toLowerCase() === cleanEmail ||
        (c.phone && c.phone.replace(/\D/g, "") === cleanEmail.replace(/\D/g, ""))
    ) || null;
  }

  async saveContract(contract) {
    let contracts = this.getContracts();
    const index = contracts.findIndex((c) => c.id === contract.id);

    if (index >= 0) {
      contracts[index] = { ...contracts[index], ...contract, updatedAt: new Date().toISOString() };
    } else {
      contract.createdAt = new Date().toISOString();
      contracts.unshift(contract);
    }

    localStorage.setItem(
      this.storageKeyPrefix + "contracts",
      JSON.stringify(contracts)
    );

    // ซิงค์ไปยัง Firestore หากเชื่อมต่ออยู่
    if (this.isFirebaseConnected && this.firestore) {
      try {
        await this.firestore.collection("contracts").doc(contract.id).set(contract, { merge: true });
        console.log(`☁️ Synced contract ${contract.id} to Firestore`);
      } catch (err) {
        console.error("Firestore sync error:", err);
        if (err && (err.code === "permission-denied" || (err.message && err.message.includes("permission")))) {
          console.warn("⚠️ Firebase Security Rules ไม่อนุญาตให้เขียนข้อมูล! กรุณาตั้งค่า Rules ใน Firebase Console ให้เป็น 'allow read, write: if true;'");
        }
      }
    }

    this.notifyListeners();
    return contract;
  }

  async deleteContract(id) {
    let contracts = this.getContracts();
    contracts = contracts.filter((c) => c.id !== id);
    localStorage.setItem(
      this.storageKeyPrefix + "contracts",
      JSON.stringify(contracts)
    );

    if (this.isFirebaseConnected && this.firestore) {
      try {
        await this.firestore.collection("contracts").doc(id).delete();
        console.log(`🗑️ Deleted contract ${id} from Firestore`);
      } catch (err) {
        console.error("Firestore delete error:", err);
      }
    }

    this.notifyListeners();
    return true;
  }

  async markInstallmentPaid(contractId, installmentNo, slipData = null) {
    const contract = this.getContractById(contractId);
    if (!contract) return null;

    const installment = contract.installments.find(
      (inst) => Number(inst.installmentNo) === Number(installmentNo)
    );

    if (!installment) return null;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} น.`;

    installment.status = "paid";
    installment.paidAt = (slipData && slipData.paidAt) ? slipData.paidAt : formattedDate;
    if (slipData) {
      if (slipData.slipUrl) installment.slipUrl = slipData.slipUrl;
      if (slipData.transRef) installment.transactionRef = slipData.transRef;
      if (slipData.transactionRef) installment.transactionRef = slipData.transactionRef;
      if (slipData.verifiedBy) installment.verifiedBy = slipData.verifiedBy;
    } else {
      installment.verifiedBy = "admin";
      installment.transactionRef = "MANUAL-" + Date.now();
    }

    // ตรวจสอบว่าจ่ายครบทุกงวดหรือยัง
    const allPaid = contract.installments.every((inst) => inst.status === "paid");
    if (allPaid) {
      contract.status = "completed";
      contract.closedContractsCount = (Number(contract.closedContractsCount) || 0) + 1;
    }

    await this.saveContract(contract);
    return contract;
  }

  // --- PAYMENT SETTINGS METHODS ---

  getPaymentSettings() {
    try {
      const data = localStorage.getItem(this.storageKeyPrefix + "settings");
      return data ? JSON.parse(data) : INITIAL_PAYMENT_SETTINGS;
    } catch (e) {
      return INITIAL_PAYMENT_SETTINGS;
    }
  }

  async savePaymentSettings(settings) {
    const current = this.getPaymentSettings();
    const updated = {
      ...current,
      ...settings,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(
      this.storageKeyPrefix + "settings",
      JSON.stringify(updated)
    );

    if (this.isFirebaseConnected && this.firestore) {
      try {
        await this.firestore.collection("settings").doc("payment").set(updated, { merge: true });
      } catch (err) {
        console.error("Firestore save settings error:", err);
      }
    }

    this.notifyListeners();
    return updated;
  }

  // --- BANK API SETTINGS ---

  getBankApiSettings() {
    try {
      const data = localStorage.getItem(this.storageKeyPrefix + "bank_api_settings");
      return data ? JSON.parse(data) : INITIAL_BANK_API_SETTINGS;
    } catch (e) {
      return INITIAL_BANK_API_SETTINGS;
    }
  }

  saveBankApiSettings(settings) {
    const current = this.getBankApiSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(
      this.storageKeyPrefix + "bank_api_settings",
      JSON.stringify(updated)
    );
    return updated;
  }

  // --- BAD DEBTS METHODS (ประวัติหนี้เสีย / แบล็คลิส / ผ่อนล่าช้า) ---

  getBadDebts() {
    try {
      const data = localStorage.getItem(this.storageKeyPrefix + "bad_debts");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading bad debts:", e);
      return [];
    }
  }

  getBadDebtById(id) {
    const list = this.getBadDebts();
    return list.find((b) => b.id === id) || null;
  }

  async saveBadDebt(record) {
    let list = this.getBadDebts();
    const index = list.findIndex((b) => b.id === record.id);

    if (index >= 0) {
      list[index] = { ...list[index], ...record, updatedAt: new Date().toISOString() };
    } else {
      record.createdAt = new Date().toISOString();
      list.unshift(record);
    }

    localStorage.setItem(
      this.storageKeyPrefix + "bad_debts",
      JSON.stringify(list)
    );

    // ซิงค์ Firestore
    if (this.isFirebaseConnected && this.firestore) {
      try {
        await this.firestore.collection("bad_debts").doc(record.id).set(record, { merge: true });
        console.log(`☁️ Synced bad debt ${record.id} to Firestore`);
      } catch (err) {
        console.error("Firestore sync bad debt error:", err);
      }
    }

    this.notifyListeners();
    return record;
  }

  async deleteBadDebt(id) {
    let list = this.getBadDebts();
    list = list.filter((b) => b.id !== id);
    localStorage.setItem(
      this.storageKeyPrefix + "bad_debts",
      JSON.stringify(list)
    );

    if (this.isFirebaseConnected && this.firestore) {
      try {
        await this.firestore.collection("bad_debts").doc(id).delete();
        console.log(`🗑️ Deleted bad debt ${id} from Firestore`);
      } catch (err) {
        console.error("Firestore delete bad debt error:", err);
      }
    }

    this.notifyListeners();
    return true;
  }

  // --- REALTIME OBSERVER SUBSCRIBERS ---

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach((callback) => {
      try {
        callback();
      } catch (e) {
        console.error("Subscriber notification error:", e);
      }
    });
  }

  // รีเซ็ตข้อมูลกลับสู่ค่าเริ่มต้น
  resetToDefault() {
    localStorage.removeItem(this.storageKeyPrefix + "contracts");
    localStorage.removeItem(this.storageKeyPrefix + "settings");
    this.initDatabase();
    this.notifyListeners();
  }
}

// Global instance
window.easyFinanceDB = new EasyFinanceDatabase();
