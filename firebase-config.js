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

// ข้อมูลเริ่มต้นสำหรับระบบ
const INITIAL_PAYMENT_SETTINGS = {
  bankName: "",
  accountNumber: "",
  accountName: "",
  promptPayNumber: "",
  promptPayName: "",
  officerPhone: "",
  officerLine: "",
  qrImageUrl: "",
  managerPassword: "Easy123",
  staffPassword: "Staff123",
  updatedAt: new Date().toISOString()
};

const INITIAL_CONTRACTS = [
  {
    id: "EF-2026-001",
    email: "somchai@easyfinance.com",
    password: "password123",
    name: "นายสมชาย มั่นคงดี",
    phone: "081-998-7766",
    idCard: "1-1020-00123-45-6",
    address: "123/45 ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900",
    facebookLink: "https://facebook.com/somchai.mankongdee",
    additionalNotes: "ลูกค้าประวัติดี ชำระค่างวดตรงเวลาสม่ำเสมอ ผ่อนทองคำแท่ง",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    itemCategory: "gold",
    itemFinanced: "ผ่อนทองคำแท่ง 1 บาท (96.5%)",
    downPayment: 5000,
    lateFine: 200,
    lateFineReason: "ค้างชำระเกินกำหนด 3 วัน",
    totalAmount: 42000,
    interestRate: 1.5,
    totalInstallments: 6,
    duration: "6 เดือน",
    firstPaymentDate: "2026-02-01",
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
    idCard: "3-1005-00789-12-3",
    address: "88/9 หมู่ 2 ต.บางกร่าง อ.เมือง จ.นนทบุรี 11000",
    facebookLink: "https://facebook.com/kanda.rungruang",
    additionalNotes: "ร้านอาหารตามสั่ง ผ่อนตรงงวดรายวัน ยอดเงินเข้าบัญชีเรียบร้อย",
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
    idCard: "1-5099-00456-78-9",
    address: "45/6 หมู่ 5 ต.สุเทพ อ.เมือง จ.เชียงใหม่ 50200",
    facebookLink: "https://facebook.com/veerawat.iphone",
    additionalNotes: "พนักงานบริษัทเอกชน ผ่อนรายสัปดาห์ ทุกวันศุกร์",
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
    idCard: "2-1011-00234-56-7",
    address: "14/2 ถนนหน้าเมือง ต.ตลาด อ.เมือง จ.สุราษฎร์ธานี 84000",
    facebookLink: "https://facebook.com/prasit.market",
    additionalNotes: "พ่อค้าตลาดสดเทศบาล สินเชื่อด่วนรายวัน คืนเงินตรงงวด",
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
    idCard: "3-1201-00678-90-1",
    address: "77/3 ถนนมะลิวัลย์ ต.ในเมือง อ.เมือง จ.ขอนแก่น 40000",
    facebookLink: "https://facebook.com/wanna.sodsai",
    additionalNotes: "คุณครูโรงเรียนมัธยม ผ่อน iPad เพื่อการศึกษา ตัดงวดตรงเวลา",
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
    idCard: "1-1033-00987-65-4",
    address: "56/1 หมู่ 3 ต.คลองหลวง อ.คลองหลวง จ.ปทุมธานี 12120",
    facebookLink: "https://facebook.com/nattapon.boonchway",
    additionalNotes: "พ่อค้าขายผลไม้ สินเชื่อหมุนเวียน ผ่อนรายสัปดาห์",
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

    // BroadcastChannel สำหรับการซิงค์แบบ Real-time ทันทีข้ามทุกแท็บในเครื่องเดียวกัน (0ms latency)
    if (typeof BroadcastChannel !== "undefined") {
      try {
        this.channel = new BroadcastChannel("easyfinance_sync_channel");
        this.channel.onmessage = (event) => {
          if (event && event.data && event.data.type === "SYNC") {
            this.notifyListeners(false); // แจ้งเตือน UI ในแท็บนี้โดยไม่ส่งข้อความซ้ำ
          }
        };
      } catch (e) {
        this.channel = null;
      }
    }

    this.initDatabase();
  }

  initDatabase() {
    // 1. ตรวจสอบการตั้งค่าใน LocalStorage
    const hasFirebase = defaultFirebaseConfig && defaultFirebaseConfig.projectId;

    if (hasFirebase) {
      if (!localStorage.getItem(this.storageKeyPrefix + "contracts")) {
        localStorage.setItem(this.storageKeyPrefix + "contracts", JSON.stringify(INITIAL_CONTRACTS));
      }
      if (!localStorage.getItem(this.storageKeyPrefix + "bad_debts")) {
        localStorage.setItem(this.storageKeyPrefix + "bad_debts", JSON.stringify(INITIAL_BAD_DEBTS));
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

    // 3. ฟังการเปลี่ยนแปลงข้าม Tab (storage event fallback)
    window.addEventListener("storage", (e) => {
      if (e.key && e.key.startsWith(this.storageKeyPrefix)) {
        this.notifyListeners(false);
      }
    });
  }

  getFirebaseConfig() {
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

  // ทำความสะอาด Object ก่อนส่งขึ้น Firestore เพื่อป้องกัน Unsupported field value: undefined
  sanitizeForFirestore(obj) {
    if (!obj) return null;
    return JSON.parse(JSON.stringify(obj, (k, v) => (v === undefined ? null : v)));
  }

  setupFirestoreListeners() {
    if (!this.firestore) return;

    // Listen to Contracts (ซิงค์สัญญาทั้งหมดแบบ Real-time ตรงจาก Cloud 100%)
    this.firestore.collection("contracts").onSnapshot(async (snapshot) => {
      const remoteContracts = [];
      snapshot.forEach((doc) => {
        if (doc.id.startsWith("_")) return; // ข้ามเอกสาร config ภายใน
        remoteContracts.push({ id: doc.id, ...doc.data() });
      });

      if (remoteContracts.length > 0) {
        // เมื่อมีข้อมูลบน Cloud ให้ยึด Cloud เป็นความจริงหลัก (Single Source of Truth 100%)
        // เพื่อให้ทุกเครื่อง (PC, มือถือ, เครื่องอื่น) เห็นข้อมูลตรงกันทันที ไม่เด้งข้อมูลเก่ากลับมา
        const currentLocal = this.getContracts();
        const finalContracts = remoteContracts.map((rem) => {
          const loc = currentLocal.find((l) => l.id === rem.id);
          if (loc && loc.installments) {
            const mergedInst = (rem.installments || []).map((rInst) => {
              const lInst = loc.installments.find((li) => li.installmentNo === rInst.installmentNo);
              // ถ้างวดใน local เพิ่งจ่ายสำเร็จแต่ remote ยังไม่อัปเดต ให้คงสถานะ paid ไว้ชั่วคราว
              if (lInst && lInst.status === "paid" && rInst.status !== "paid") {
                return lInst;
              }
              return rInst;
            });
            return { ...rem, installments: mergedInst };
          }
          return rem;
        });

        localStorage.setItem(
          this.storageKeyPrefix + "contracts",
          JSON.stringify(finalContracts)
        );
        this.notifyListeners(false);
      } else {
        // กรณีที่ Cloud ยังไม่มีเอกสารใน contracts
        try {
          const sysDoc = await this.firestore.collection("settings").doc("system").get();
          if (sysDoc.exists && sysDoc.data().contractsInitialized) {
            // ระบบเคยตั้งค่าเริ่มต้นแล้ว แปลว่าผู้ใช้ตั้งใจลบข้อมูลสัญญาจนหมด
            localStorage.setItem(this.storageKeyPrefix + "contracts", JSON.stringify([]));
            this.notifyListeners(false);
          } else {
            // ใช้งานระบบ Cloud ครั้งแรก: อัปโหลดสัญญาเริ่มต้น (Seed) ขึ้น Firestore ทันที
            console.log("☁️ Seeding initial contracts to Cloud Firestore...");
            const currentLocal = this.getContracts();
            const toSeed = (currentLocal && currentLocal.length > 0) ? currentLocal : INITIAL_CONTRACTS;
            for (const c of toSeed) {
              const clean = this.sanitizeForFirestore(c);
              await this.firestore.collection("contracts").doc(c.id).set(clean, { merge: true });
            }
            await this.firestore.collection("settings").doc("system").set(
              { contractsInitialized: true, seededAt: new Date().toISOString() },
              { merge: true }
            );
            localStorage.setItem(this.storageKeyPrefix + "contracts", JSON.stringify(toSeed));
            this.notifyListeners(false);
          }
        } catch (e) {
          console.warn("Firestore contracts auto-seed warning:", e);
        }
      }
    }, (error) => {
      console.error("❌ Firestore contracts snapshot error:", error);
    });

    // Listen to Payment Settings (ซิงค์ QR, บัญชีธนาคาร และรหัสผ่านหัวหน้า/พนักงานแบบ Real-time ข้ามอุปกรณ์)
    this.firestore.collection("settings").doc("payment").onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data() || {};
        if (data.managerPassword) {
          localStorage.setItem("easyfinance_manager_password", data.managerPassword);
          localStorage.setItem("easyfinance_admin_password", data.managerPassword);
        }
        if (data.staffPassword) {
          localStorage.setItem("easyfinance_staff_password", data.staffPassword);
        }
        localStorage.setItem(
          this.storageKeyPrefix + "settings",
          JSON.stringify(data)
        );
        this.notifyListeners(false);
      }
    }, (error) => {
      console.error("❌ Firestore settings snapshot error:", error);
    });

    // 3. Listen to Bad Debts (ซิงค์ประวัติหนี้เสีย / แบล็คลิส / ผ่อนล่าช้า แบบ Real-time ตรงจาก Cloud 100%)
    this.firestore.collection("bad_debts").onSnapshot(async (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        if (doc.id.startsWith("_")) return;
        list.push({ id: doc.id, ...doc.data() });
      });

      if (list.length > 0) {
        localStorage.setItem(this.storageKeyPrefix + "bad_debts", JSON.stringify(list));
        this.notifyListeners(false);
      } else {
        try {
          const sysDoc = await this.firestore.collection("settings").doc("system_bad_debts").get();
          if (sysDoc.exists && sysDoc.data().initialized) {
            localStorage.setItem(this.storageKeyPrefix + "bad_debts", JSON.stringify([]));
            this.notifyListeners(false);
          } else {
            console.log("☁️ Seeding initial bad debts to Firestore...");
            const currentBadDebts = this.getBadDebts();
            const toSeed = (currentBadDebts && currentBadDebts.length > 0) ? currentBadDebts : INITIAL_BAD_DEBTS;
            for (const item of toSeed) {
              const clean = this.sanitizeForFirestore(item);
              await this.firestore.collection("bad_debts").doc(item.id).set(clean, { merge: true });
            }
            await this.firestore.collection("settings").doc("system_bad_debts").set(
              { initialized: true, seededAt: new Date().toISOString() },
              { merge: true }
            );
            localStorage.setItem(this.storageKeyPrefix + "bad_debts", JSON.stringify(toSeed));
            this.notifyListeners(false);
          }
        } catch (e) {
          console.warn("Firestore bad debts auto-seed warning:", e);
        }
      }
    }, (error) => {
      console.error("❌ Firestore bad_debts snapshot error:", error);
    });
  }

  // --- CONTRACTS METHODS ---

  getContracts() {
    try {
      const data = localStorage.getItem(this.storageKeyPrefix + "contracts");
      const list = data ? JSON.parse(data) : [];
      return list.map((c) => {
        const fine = c.lateFine !== undefined ? Number(c.lateFine) : (c.id === "EF-2026-001" ? 200 : 0);
        const reason = c.lateFineReason !== undefined ? c.lateFineReason : (c.id === "EF-2026-001" ? "ค้างชำระเกินกำหนด 3 วัน" : "");
        return {
          ...c,
          downPayment: c.downPayment !== undefined ? Number(c.downPayment) : 0,
          firstPaymentDate: c.firstPaymentDate || (c.installments && c.installments[0]?.dueDate) || "",
          lateFine: fine,
          lateFineReason: reason,
          hasLateFine: fine > 0
        };
      });
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
    const prefix = cleanEmail.includes("@") ? cleanEmail.split("@")[0] : cleanEmail;
    const contracts = this.getContracts();
    return contracts.find((c) => {
      if (!c) return false;
      const cEmail = (c.email || "").toLowerCase();
      const cPrefix = cEmail.includes("@") ? cEmail.split("@")[0] : cEmail;
      const cId = (c.id || "").toLowerCase();
      const cPhone = c.phone ? c.phone.replace(/\D/g, "") : "";
      const qPhone = cleanEmail.replace(/\D/g, "");

      return (
        cEmail === cleanEmail ||
        cPrefix === cleanEmail ||
        cPrefix === prefix ||
        cId === cleanEmail ||
        (qPhone.length >= 8 && cPhone === qPhone)
      );
    }) || null;
  }

  async saveContract(contract) {
    let contracts = this.getContracts();
    const index = contracts.findIndex((c) => c.id === contract.id);

    // ป้องกัน Base64 สลิปขนาดใหญ่เกิน ทำให้ LocalStorage เต็ม (5MB) หรือ Firestore ปฏิเสธ (>1MB)
    const cleanInstallments = (contract.installments || []).map((inst) => {
      let slipUrl = inst.slipUrl;
      if (slipUrl && typeof slipUrl === "string" && slipUrl.length > 90000) {
        // หากรูปสลิปมีขนาดยาวเกิน 90KB ให้เก็บเฉพาะส่วนที่พอดีเพื่อไม่ให้บล็อกฐานข้อมูล
        slipUrl = slipUrl.slice(0, 90000);
      }
      return {
        ...inst,
        slipUrl
      };
    });

    const cleanContract = {
      ...contract,
      installments: cleanInstallments,
      updatedAt: new Date().toISOString()
    };

    if (index >= 0) {
      contracts[index] = { ...contracts[index], ...cleanContract };
    } else {
      cleanContract.createdAt = cleanContract.createdAt || new Date().toISOString();
      contracts.unshift(cleanContract);
    }

    // 1. บันทึกลง LocalStorage ทันที เพื่อให้การทำงานลื่นไหล 0ms ไม่มีการค้าง
    try {
      localStorage.setItem(
        this.storageKeyPrefix + "contracts",
        JSON.stringify(contracts)
      );
    } catch (quotaErr) {
      console.warn("⚠️ LocalStorage quota exceeded, stripping large slip images to prevent crash:", quotaErr);
      const safeContracts = contracts.map((c) => ({
        ...c,
        installments: (c.installments || []).map((inst) => ({
          ...inst,
          slipUrl: null
        }))
      }));
      try {
        localStorage.setItem(this.storageKeyPrefix + "contracts", JSON.stringify(safeContracts));
      } catch (e2) {
        console.error("Critical: Could not save contracts to localStorage:", e2);
      }
    }

    // 2. แจ้งเตือนทุกแท็บและทุกหน้าจอในเครื่องทันที ไม่ต้องรอคลาวด์
    this.notifyListeners(true);

    // 3. ซิงค์ขึ้น Firestore ในเบื้องหลัง พร้อมกำหนด Timeout 2.5 วินาที ป้องกัน UI ค้างหากสัญญาณเน็ตช้า
    if (this.isFirebaseConnected && this.firestore) {
      try {
        const sanitized = this.sanitizeForFirestore(cleanContract);
        const firestoreWrite = this.firestore.collection("contracts").doc(cleanContract.id).set(sanitized, { merge: true });
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve("timeout"), 2500));
        await Promise.race([firestoreWrite, timeoutPromise]);
        console.log(`☁️ Synced contract ${cleanContract.id} to Firestore`);
      } catch (err) {
        console.warn("Firestore sync non-blocking warning:", err);
      }
    }

    return cleanContract;
  }

  async deleteContract(id) {
    let contracts = this.getContracts();
    contracts = contracts.filter((c) => c.id !== id);
    localStorage.setItem(
      this.storageKeyPrefix + "contracts",
      JSON.stringify(contracts)
    );

    this.notifyListeners(true);

    if (this.isFirebaseConnected && this.firestore) {
      try {
        const firestoreDelete = this.firestore.collection("contracts").doc(id).delete();
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve("timeout"), 2500));
        await Promise.race([firestoreDelete, timeoutPromise]);
        console.log(`🗑️ Deleted contract ${id} from Firestore`);
      } catch (err) {
        console.error("Firestore delete error:", err);
      }
    }

    return true;
  }

  async markInstallmentPaid(contractId, installmentNo, slipData = null) {
    const contract = this.getContractById(contractId);
    if (!contract) return null;

    const installment = (contract.installments || []).find(
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

    // Requirement 4: หากสัญญามีค่าปรับค้างอยู่ เมื่อชำระงวด บันทึกยอดค่าปรับเข้าสะสมและล้างค่าปรับค้าง
    const activeFine = Math.max(0, Number(contract.lateFine) || 0);
    if (activeFine > 0) {
      installment.paidLateFine = activeFine;
      contract.totalLateFinesCollected = (Number(contract.totalLateFinesCollected) || 0) + activeFine;
      contract.lateFine = 0;
      contract.lateFineReason = "";
      contract.hasLateFine = false;
    }

    // คำนวณยอดคงเหลือของแต่ละงวดใหม่ให้ถูกต้องเสมอ
    let runningBalance = Number(contract.totalAmount) || 0;
    (contract.installments || []).forEach((inst) => {
      if (inst.status === "paid") {
        runningBalance -= (Number(inst.amount) || 0);
      }
      inst.remainingBalanceAfter = Math.max(0, runningBalance);
    });

    // ตรวจสอบว่าจ่ายครบทุกงวดหรือยัง
    const allPaid = (contract.installments || []).length > 0 && contract.installments.every((inst) => inst.status === "paid");
    if (allPaid) {
      contract.status = "completed";
      contract.closedContractsCount = (Number(contract.closedContractsCount) || 0) + 1;
    } else {
      contract.status = "active";
    }

    await this.saveContract(contract);
    return contract;
  }

  // ยกเลิกการชำระเงินของงวด และเปลี่ยนสถานะกลับเป็น "รอชำระ" (pending) เผื่อแอดมินกดมาร์คผิด
  async unmarkInstallmentPaid(contractId, installmentNo) {
    const contract = this.getContractById(contractId);
    if (!contract) return null;

    const installment = (contract.installments || []).find(
      (inst) => Number(inst.installmentNo) === Number(installmentNo)
    );

    if (!installment) return null;

    // เปลี่ยนสถานะกลับเป็นรอชำระ (pending) และล้างข้อมูลบันทึกการชำระ
    installment.status = "pending";
    installment.paidAt = null;
    installment.slipUrl = null;
    installment.transactionRef = null;
    installment.verifiedBy = null;

    // หากเคยมีค่าปรับที่คิดพร้อมงวดนี้ ให้คืนค่าปรับกลับมา
    if (installment.paidLateFine) {
      const fine = Number(installment.paidLateFine) || 0;
      contract.totalLateFinesCollected = Math.max(0, (Number(contract.totalLateFinesCollected) || 0) - fine);
      contract.lateFine = (Number(contract.lateFine) || 0) + fine;
      contract.hasLateFine = true;
      delete installment.paidLateFine;
    }

    // คำนวณยอดคงเหลือของแต่ละงวดใหม่
    let runningBalance = Number(contract.totalAmount) || 0;
    (contract.installments || []).forEach((inst) => {
      if (inst.status === "paid") {
        runningBalance -= (Number(inst.amount) || 0);
      }
      inst.remainingBalanceAfter = Math.max(0, runningBalance);
    });

    // ปรับสถานะสัญญา: หากเคยเป็น completed จะกลับมาเป็น active
    const allPaid = (contract.installments || []).length > 0 && contract.installments.every((inst) => inst.status === "paid");
    if (allPaid) {
      contract.status = "completed";
    } else {
      if (contract.status === "completed") {
        contract.closedContractsCount = Math.max(0, (Number(contract.closedContractsCount) || 1) - 1);
      }
      contract.status = "active";
    }

    await this.saveContract(contract);
    return contract;
  }

  // อัปเดตข้อมูลเพิ่มเติมของลูกค้า (บันทึกเพิ่มเติม, ลิงก์เฟสบุ๊ก, ที่อยู่, เลขบัตร)
  async updateCustomerProfile(phoneOrId, profileData) {
    let contracts = this.getContracts();
    let updatedCount = 0;
    contracts.forEach((c) => {
      const matchPhone = c.phone && profileData.phone && (c.phone.replace(/\D/g, "") === profileData.phone.replace(/\D/g, ""));
      const matchName = c.name && profileData.name && (c.name.trim() === profileData.name.trim());
      const matchId = c.id === phoneOrId || (c.idCard && profileData.idCard && c.idCard === profileData.idCard);
      if (matchPhone || matchName || matchId) {
        if (profileData.facebookLink !== undefined) c.facebookLink = profileData.facebookLink;
        if (profileData.additionalNotes !== undefined) c.additionalNotes = profileData.additionalNotes;
        if (profileData.idCard !== undefined) c.idCard = profileData.idCard;
        if (profileData.address !== undefined) c.address = profileData.address;
        c.updatedAt = new Date().toISOString();
        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      try {
        localStorage.setItem(this.storageKeyPrefix + "contracts", JSON.stringify(contracts));
      } catch (e) {}
      this.notifyListeners(true);
      if (this.isFirebaseConnected && this.firestore) {
        contracts.forEach((c) => {
          if (c.id === phoneOrId || (profileData.phone && c.phone && c.phone.includes(profileData.phone))) {
            const clean = this.sanitizeForFirestore(c);
            this.firestore.collection("contracts").doc(c.id).set(clean, { merge: true }).catch(() => {});
          }
        });
      }
    }
    return true;
  }

  // อัปเดตค่าปรับชำระล่าช้า (Late Fine / Penalty Fee) ของสัญญา
  async updateContractLateFine(contractId, lateFineAmount, reason = "") {
    let contracts = this.getContracts();
    const c = contracts.find((x) => x.id === contractId);
    if (c) {
      const fineVal = Math.max(0, parseFloat(lateFineAmount) || 0);
      c.lateFine = fineVal;
      c.lateFineReason = reason || (fineVal > 0 ? "เกินกำหนดชำระค่างวด" : "");
      c.hasLateFine = fineVal > 0;
      c.updatedAt = new Date().toISOString();
      await this.saveContract(c);
      return c;
    }
    return null;
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
        const clean = this.sanitizeForFirestore(record);
        await this.firestore.collection("bad_debts").doc(record.id).set(clean, { merge: true });
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

  addListener(callback) {
    return this.subscribe(callback);
  }

  notifyListeners(broadcast = true) {
    if (broadcast && this.channel) {
      try {
        this.channel.postMessage({ type: "SYNC", timestamp: Date.now() });
      } catch (e) {}
    }
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
