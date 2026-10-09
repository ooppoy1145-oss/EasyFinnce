/**
 * EasyFinance - Admin Backoffice Logic (admin.js)
 * จัดการตรรกะระบบหลังบ้านแอดมิน, สรุปรายวัน/อาทิตย์/เดือน, เพิ่มสัญญา, และตั้งค่า QR Code
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements - Auth
  const adminLoginOverlay = document.getElementById("adminLoginOverlay");
  const adminAuthForm = document.getElementById("adminAuthForm");
  const adminSecretPass = document.getElementById("adminSecretPass");
  const btnAdminLogout = document.getElementById("btnAdminLogout");

  // DOM Elements - Navigation & Layout
  const adminSidebar = document.getElementById("adminSidebar");
  const btnSidebarToggle = document.getElementById("btnSidebarToggle");
  const btnCloseSidebar = document.getElementById("btnCloseSidebar");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");
  const activeTabTitle = document.getElementById("activeTabTitle");
  const sidebarItems = document.querySelectorAll(".sidebar-item[data-tab]");
  const tabBtns = document.querySelectorAll(".tab-btn");
  const cloudStatusBadge = document.getElementById("cloudStatusBadge");
  const cloudStatusText = document.getElementById("cloudStatusText");
  const adminRoleBadge = document.getElementById("adminRoleBadge");
  const roleBadgeIcon = document.getElementById("roleBadgeIcon");
  const roleBadgeText = document.getElementById("roleBadgeText");
  const btnRoleAction = document.getElementById("btnRoleAction");
  const iconOverviewLock = document.getElementById("iconOverviewLock");

  // DOM Elements - Stats
  const statTotalFinanced = document.getElementById("statTotalFinanced");
  const statTotalCollected = document.getElementById("statTotalCollected");
  const statTotalOutstanding = document.getElementById("statTotalOutstanding");
  const statContractsCount = document.getElementById("statContractsCount");
  const statTotalLateFines = document.getElementById("statTotalLateFines");
  const statLateFinesSub = document.getElementById("statLateFinesSub");
  const cardStatLateFines = document.getElementById("cardStatLateFines");
  const cardStatMotorcycle = document.getElementById("cardStatMotorcycle");
  const statLabelMotorcycle = document.getElementById("statLabelMotorcycle");
  const statTotalMotorcycle = document.getElementById("statTotalMotorcycle");
  const statMotorcycleSub = document.getElementById("statMotorcycleSub");
  const statIconMotorcycle = document.getElementById("statIconMotorcycle");
  const cardStatInterestCut = document.getElementById("cardStatInterestCut");
  const statLabelInterestCut = document.getElementById("statLabelInterestCut");
  const statTotalInterestCut = document.getElementById("statTotalInterestCut");
  const statInterestCutSub = document.getElementById("statInterestCutSub");
  const interestCutReportModal = document.getElementById("interestCutReportModal");
  const cardStatDownPayment = document.getElementById("cardStatDownPayment");
  const statLabelDownPayment = document.getElementById("statLabelDownPayment");
  const statTotalDownPayment = document.getElementById("statTotalDownPayment");
  const statDownPaymentSub = document.getElementById("statDownPaymentSub");
  const downPaymentReportModal = document.getElementById("downPaymentReportModal");
  const cardStatDailyAllCategories = document.getElementById("cardStatDailyAllCategories");
  const statLabelDailyAllCategories = document.getElementById("statLabelDailyAllCategories");
  const statTotalDailyAllCategories = document.getElementById("statTotalDailyAllCategories");
  const statDailyAllCategoriesSub = document.getElementById("statDailyAllCategoriesSub");
  const dailyAllCategoriesReportModal = document.getElementById("dailyAllCategoriesReportModal");
  const cardStatBankReconciliation = document.getElementById("cardStatBankReconciliation");
  const statLabelBankReconciliation = document.getElementById("statLabelBankReconciliation");
  const statTotalBankReconciliation = document.getElementById("statTotalBankReconciliation");
  const statBankReconciliationSub = document.getElementById("statBankReconciliationSub");
  const bankReconciliationModal = document.getElementById("bankReconciliationModal");
  const addManualInstallmentModal = document.getElementById("addManualInstallmentModal");
  const editInstallmentModal = document.getElementById("editInstallmentModal");

  // DOM Elements - Table & Search
  const adminSearchInput = document.getElementById("adminSearchInput");
  const tableHeaderRow = document.getElementById("tableHeaderRow");
  const tableBody = document.getElementById("tableBody");
  const btnOpenAddContract = document.getElementById("btnOpenAddContract");

  // DOM Elements - Dashboard Overview & Dynamic Sub-Tabs (Requirement 1, 2, 3)
  const btnOpenDashboardOverview = document.getElementById("btnOpenDashboardOverview");
  const dashboardOverviewSection = document.getElementById("dashboardOverviewSection");
  const overviewCardsGrid = document.getElementById("overviewCardsGrid");
  const adminSubTabNav = document.getElementById("adminSubTabNav");
  const quickPillDaily = document.getElementById("quickPillDaily");
  const quickPillWeekly = document.getElementById("quickPillWeekly");
  const quickPillMonthly = document.getElementById("quickPillMonthly");
  const quickPillMotorcycle = document.getElementById("quickPillMotorcycle");
  const quickPillLateFine = document.getElementById("quickPillLateFine");
  const pillDailyBtn = document.getElementById("pillDailyBtn");
  const pillWeeklyBtn = document.getElementById("pillWeeklyBtn");
  const pillMonthlyBtn = document.getElementById("pillMonthlyBtn");
  const pillMotorcycleBtn = document.getElementById("pillMotorcycleBtn");
  const pillLateFineBtn = document.getElementById("pillLateFineBtn");
  const menuMotorcycle = document.getElementById("menuMotorcycle");
  const motorcycleCountBadge = document.getElementById("motorcycleCountBadge");
  const summaryQuickPills = document.getElementById("summaryQuickPills");
  const dataTableCard = document.getElementById("dataTableCard");

  // DOM Elements - Date / Period Filter Bar (Single Date Input Matching Daily Design)
  const dateFilterBar = document.getElementById("dateFilterBar");
  const adminDateFilter = document.getElementById("adminDateFilter");
  const dateFilterLabelText = document.getElementById("dateFilterLabelText");
  const dateFilterIcon = document.getElementById("dateFilterIcon");
  const dateTotalMainLabel = document.getElementById("dateTotalMainLabel");
  const dateTotalLabelText = document.getElementById("dateTotalLabelText");
  const btnDatePrev = document.getElementById("btnDatePrev");
  const btnDateToday = document.getElementById("btnDateToday");
  const btnDateNext = document.getElementById("btnDateNext");
  const dateFilterSummary = document.getElementById("dateFilterSummary");
  const dateDailyTotalBadge = document.getElementById("dateDailyTotalBadge");
  const dailyTotalAmountVal = document.getElementById("dailyTotalAmountVal");
  const dailyPaidAmountVal = document.getElementById("dailyPaidAmountVal");
  const dailyPendingAmountVal = document.getElementById("dailyPendingAmountVal");
  const dailyFineAmountVal = document.getElementById("dailyFineAmountVal");

  // DOM Elements - Contract Modal (Requirement 1: คำนวณงวดอิงจากยอดรวม)
  const contractModal = document.getElementById("contractModal");
  const btnCloseContractModal = document.getElementById("btnCloseContractModal");
  const btnCancelContractModal = document.getElementById("btnCancelContractModal");
  const contractForm = document.getElementById("contractForm");
  const contractModalTitle = document.getElementById("contractModalTitle");
  const formContractId = document.getElementById("formContractId");
  const formEmailPrefix = document.getElementById("formEmailPrefix");
  const formEmail = document.getElementById("formEmail");
  const formPassword = document.getElementById("formPassword");
  const formName = document.getElementById("formName");
  const formPhone = document.getElementById("formPhone");
  const formAvatar = document.getElementById("formAvatar");
  const formItemCategory = document.getElementById("formItemCategory");
  const formDownPaymentGroup = document.getElementById("formDownPaymentGroup");
  const formDownPayment = document.getElementById("formDownPayment");
  const formDownPaymentDate = document.getElementById("formDownPaymentDate");
  const formItemFinanced = document.getElementById("formItemFinanced");
  const formTotalAmount = document.getElementById("formTotalAmount");
  const formTotalInstallments = document.getElementById("formTotalInstallments");
  const formInstallmentAmount = document.getElementById("formInstallmentAmount");
  const formPaymentFrequency = document.getElementById("formPaymentFrequency");
  const formFirstPaymentDate = document.getElementById("formFirstPaymentDate");
  const formDueSchedule = document.getElementById("formDueSchedule");
  const formDuration = document.getElementById("formDuration");
  const formClosedContractsCount = document.getElementById("formClosedContractsCount");
  const formIdCard = document.getElementById("formIdCard");
  const formFacebook = document.getElementById("formFacebook");
  const formAddress = document.getElementById("formAddress");
  const formAdditionalNotes = document.getElementById("formAdditionalNotes");

  // DOM Elements - Manager Auth & Password Settings (Requirement 4 & 5)
  const managerAuthModal = document.getElementById("managerAuthModal");
  const btnCloseManagerAuthModal = document.getElementById("btnCloseManagerAuthModal");
  const btnCancelManagerAuth = document.getElementById("btnCancelManagerAuth");
  const managerAuthForm = document.getElementById("managerAuthForm");
  const managerAuthPassInput = document.getElementById("managerAuthPassInput");
  const managerAuthErrorMsg = document.getElementById("managerAuthErrorMsg");
  const btnToggleManagerAuthPass = document.getElementById("btnToggleManagerAuthPass");
  const iconToggleManagerAuthPass = document.getElementById("iconToggleManagerAuthPass");

  const btnMenuPassSettings = document.getElementById("btnMenuPassSettings");
  const passwordSettingsModal = document.getElementById("passwordSettingsModal");
  const btnClosePasswordSettingsModal = document.getElementById("btnClosePasswordSettingsModal");
  const btnCancelPasswordSettings = document.getElementById("btnCancelPasswordSettings");
  const passwordSettingsForm = document.getElementById("passwordSettingsForm");
  const settingManagerPass = document.getElementById("settingManagerPass");
  const settingStaffPass = document.getElementById("settingStaffPass");
  const passSettingsLockSection = document.getElementById("passSettingsLockSection");
  const passSettingsUnlockForm = document.getElementById("passSettingsUnlockForm");
  const passSettingsCurrentInput = document.getElementById("passSettingsCurrentInput");
  const passSettingsUnlockError = document.getElementById("passSettingsUnlockError");
  const btnCancelPassSettingsUnlock = document.getElementById("btnCancelPassSettingsUnlock");
  const passSettingsModalTitleText = document.getElementById("passSettingsModalTitleText");

  // DOM Elements - QR Settings Modal
  const btnMenuQrSettings = document.getElementById("btnMenuQrSettings");
  const qrSettingsModal = document.getElementById("qrSettingsModal");
  const btnCloseQrModal = document.getElementById("btnCloseQrModal");
  const qrSettingsForm = document.getElementById("qrSettingsForm");
  const adminQrPreviewImg = document.getElementById("adminQrPreviewImg");
  const btnSelectQrFile = document.getElementById("btnSelectQrFile");
  const adminQrFileInput = document.getElementById("adminQrFileInput");
  const settingBankName = document.getElementById("settingBankName");
  const settingAccountNumber = document.getElementById("settingAccountNumber");
  const settingAccountName = document.getElementById("settingAccountName");
  const settingPromptPay = document.getElementById("settingPromptPay");
  const settingOfficerPhone = document.getElementById("settingOfficerPhone");
  const settingOfficerLine = document.getElementById("settingOfficerLine");

  // DOM Elements - Contract Details Modal
  const contractDetailModal = document.getElementById("contractDetailModal");
  const btnCloseDetailModal = document.getElementById("btnCloseDetailModal");
  const detailModalTitle = document.getElementById("detailModalTitle");
  const detailContractMeta = document.getElementById("detailContractMeta");
  const detailInstallmentsBody = document.getElementById("detailInstallmentsBody");

  // DOM Elements - Bank API Modal
  const btnMenuBankApi = document.getElementById("btnMenuBankApi");
  const bankApiModal = document.getElementById("bankApiModal");
  const btnCloseBankApiModal = document.getElementById("btnCloseBankApiModal");
  const bankApiForm = document.getElementById("bankApiForm");
  const formBankProvider = document.getElementById("formBankProvider");
  const formBankApiKey = document.getElementById("formBankApiKey");
  const formBankBranchId = document.getElementById("formBankBranchId");
  const formAutoApprove = document.getElementById("formAutoApprove");


  // DOM Elements - Slip Viewer Modal
  const slipViewerModal = document.getElementById("slipViewerModal");
  const btnCloseSlipViewer = document.getElementById("btnCloseSlipViewer");
  const viewerSlipImg = document.getElementById("viewerSlipImg");
  const viewerSlipMeta = document.getElementById("viewerSlipMeta");

  // DOM Elements - Bad Debt Feature
  const menuBadDebt = document.getElementById("menuBadDebt");
  const badDebtBadgeCount = document.getElementById("badDebtBadgeCount");
  const btnOpenAddBadDebt = document.getElementById("btnOpenAddBadDebt");
  const badDebtModal = document.getElementById("badDebtModal");
  const btnCloseBadDebtModal = document.getElementById("btnCloseBadDebtModal");
  const badDebtForm = document.getElementById("badDebtForm");
  const badDebtModalTitle = document.getElementById("badDebtModalTitle");
  const formBadDebtId = document.getElementById("formBadDebtId");
  const formBdName = document.getElementById("formBdName");
  const formBdIdCard = document.getElementById("formBdIdCard");
  const formBdPhone = document.getElementById("formBdPhone");
  const formBdAmount = document.getElementById("formBdAmount");
  const formBdAddress = document.getElementById("formBdAddress");
  const formBdItemDescription = document.getElementById("formBdItemDescription");
  const formBdRecordedAt = document.getElementById("formBdRecordedAt");
  const formBdNote = document.getElementById("formBdNote");

  // DOM Elements - Customer Database & Dossier (Requirement 3)
  const menuCustomerDb = document.getElementById("menuCustomerDb");
  const btnOpenCustomerDb = document.getElementById("btnOpenCustomerDb");
  const customerCountBadge = document.getElementById("customerCountBadge");
  const customerDatabaseModal = document.getElementById("customerDatabaseModal");
  const btnCloseCustomerDbModal = document.getElementById("btnCloseCustomerDbModal");
  const modalCustomerTotalBadge = document.getElementById("modalCustomerTotalBadge");
  const customerDbSearchInput = document.getElementById("customerDbSearchInput");
  const customerDbTableBody = document.getElementById("customerDbTableBody");

  const customerDossierModal = document.getElementById("customerDossierModal");
  const btnCloseDossierModal = document.getElementById("btnCloseDossierModal");
  const dossierCustomerTitle = document.getElementById("dossierCustomerTitle");
  const customerDossierContent = document.getElementById("customerDossierContent");
  const btnCustomerDbSearchClear = document.getElementById("btnCustomerDbSearchClear");

  // DOM Elements - Late Payment Fine / Penalty Modal (Requirement 4)
  const penaltyModalAdmin = document.getElementById("penaltyModalAdmin");
  const btnClosePenaltyModal = document.getElementById("btnClosePenaltyModal");
  const penaltyAdminForm = document.getElementById("penaltyAdminForm");
  const penaltyContractId = document.getElementById("penaltyContractId");
  const penaltyTargetCustomerName = document.getElementById("penaltyTargetCustomerName");
  const penaltyTargetContractId = document.getElementById("penaltyTargetContractId");
  const penaltyTargetItemInfo = document.getElementById("penaltyTargetItemInfo");
  const penaltyTargetDueInfo = document.getElementById("penaltyTargetDueInfo");
  const penaltyAmountInput = document.getElementById("penaltyAmountInput");
  const penaltyReasonInput = document.getElementById("penaltyReasonInput");
  const currentFineStatusBadge = document.getElementById("currentFineStatusBadge");
  const btnClearPenaltyAction = document.getElementById("btnClearPenaltyAction");

  // DOM Elements - Delete Security Modal (Requirement 1: ใส่รหัสก่อนลบข้อมูลลูกค้า)
  const deleteSecurityModal = document.getElementById("deleteSecurityModal");
  const btnCloseDeleteSecurityModal = document.getElementById("btnCloseDeleteSecurityModal");
  const btnCancelDeleteSecurity = document.getElementById("btnCancelDeleteSecurity");
  const deleteSecurityForm = document.getElementById("deleteSecurityForm");
  const deleteTargetId = document.getElementById("deleteTargetId");
  const deleteTargetType = document.getElementById("deleteTargetType");
  const deleteTargetItemLabel = document.getElementById("deleteTargetItemLabel");
  const deleteSecurityPasswordInput = document.getElementById("deleteSecurityPasswordInput");
  const deleteSecurityErrorMsg = document.getElementById("deleteSecurityErrorMsg");
  const btnToggleDeletePass = document.getElementById("btnToggleDeletePass");
  const iconToggleDeletePass = document.getElementById("iconToggleDeletePass");

  // State
  let currentTab = "daily"; // 'overview' | 'daily' | 'weekly' | 'monthly' | 'all' | 'bad_debt'
  let currentSubFilter = "all"; // 'all' | 'paid' | 'pending' | 'bad_debt' | 'blacklist' | 'delayed'
  // Helper: Local date & month strings (ป้องกัน Timezone drift)
  function getLocalDateStr(d = new Date()) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getLocalMonthStr(d = new Date()) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }

  function shiftDateStr(dateStr, days) {
    if (!dateStr) return getLocalDateStr();
    const parts = dateStr.split("-").map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2] + days);
    return getLocalDateStr(d);
  }

  function shiftMonthStr(monthStr, months) {
    if (!monthStr) return getLocalMonthStr();
    const parts = monthStr.split("-").map(Number);
    let year = parts[0];
    let month = parts[1] + months;
    while (month < 1) { month += 12; year--; }
    while (month > 12) { month -= 12; year++; }
    return `${year}-${String(month).padStart(2, "0")}`;
  }

  let selectedDailyDate = getLocalDateStr(); // วันที่เลือกสำหรับสรุปยอด (YYYY-MM-DD)

  // คำนวณวันจันทร์และวันอาทิตย์ของสัปดาห์ที่ตรงกับวันที่ระบุ (Monday - Sunday)
  function getThisWeekRange(refDate = selectedDailyDate) {
    let d;
    if (typeof refDate === "string") {
      const parts = refDate.split("-").map(Number);
      d = new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
      d = new Date(refDate);
    }
    const day = d.getDay(); // 0 = Sun, 1 = Mon ...
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return {
      start: getLocalDateStr(monday),
      end: getLocalDateStr(sunday)
    };
  }

  let weeklyStartDate = getThisWeekRange(selectedDailyDate).start;
  let weeklyEndDate = getThisWeekRange(selectedDailyDate).end;
  let selectedMonthlyMonth = selectedDailyDate.slice(0, 7);

  function syncPeriodDates() {
    const w = getThisWeekRange(selectedDailyDate);
    weeklyStartDate = w.start;
    weeklyEndDate = w.end;
    selectedMonthlyMonth = (selectedDailyDate || getLocalDateStr()).slice(0, 7);
  }

  let currentViewingContractId = null;
  let tempUploadedQrBase64 = null;

  // --- 1. AUTHENTICATION & ROLE MANAGEMENT (Requirement 4 & 5) ---

  function getManagerPass() {
    let dbPass = "";
    try {
      if (window.easyFinanceDB && typeof window.easyFinanceDB.getPaymentSettings === "function") {
        const s = window.easyFinanceDB.getPaymentSettings();
        if (s && s.managerPassword) dbPass = String(s.managerPassword).trim();
      }
    } catch (e) {}
    return (
      (localStorage.getItem("easyfinance_manager_password") || "").trim() ||
      (localStorage.getItem("easyfinance_admin_password") || "").trim() ||
      (sessionStorage.getItem("easyfinance_manager_password") || "").trim() ||
      dbPass ||
      "Easy123"
    );
  }

  function getStaffPass() {
    let dbPass = "";
    try {
      if (window.easyFinanceDB && typeof window.easyFinanceDB.getPaymentSettings === "function") {
        const s = window.easyFinanceDB.getPaymentSettings();
        if (s && s.staffPassword) dbPass = String(s.staffPassword).trim();
      }
    } catch (e) {}
    return (
      (localStorage.getItem("easyfinance_staff_password") || "").trim() ||
      (sessionStorage.getItem("easyfinance_staff_password") || "").trim() ||
      dbPass ||
      "Staff123"
    );
  }

  function isManagerLoggedIn() {
    return sessionStorage.getItem("easyfinance_admin_role") === "manager";
  }

  function updateRoleUI() {
    const isManager = isManagerLoggedIn();
    if (adminRoleBadge) {
      if (isManager) {
        adminRoleBadge.className = "admin-role-badge manager";
        if (roleBadgeIcon) roleBadgeIcon.className = "fa-solid fa-crown";
        if (roleBadgeText) roleBadgeText.textContent = "หัวหน้า (Manager)";
        if (btnRoleAction) {
          btnRoleAction.innerHTML = '<i class="fa-solid fa-arrow-right-arrow-left"></i> สลับเป็นพนักงาน';
          btnRoleAction.title = "สลับเป็นโหมดพนักงาน (ปิดยอดตัวเลข)";
        }
      } else {
        adminRoleBadge.className = "admin-role-badge staff";
        if (roleBadgeIcon) roleBadgeIcon.className = "fa-solid fa-user-tie";
        if (roleBadgeText) roleBadgeText.textContent = "พนักงาน (Staff)";
        if (btnRoleAction) {
          btnRoleAction.innerHTML = '<i class="fa-solid fa-key"></i> ปลดล็อกหัวหน้า';
          btnRoleAction.title = "ใส่รหัสผ่านหัวหน้าเพื่อปลดล็อกยอดตัวเลข";
        }
      }
    }

    if (iconOverviewLock) {
      iconOverviewLock.style.display = isManager ? "none" : "inline-block";
    }
  }

  function checkAdminAuth() {
    const isAuth = sessionStorage.getItem("easyfinance_admin_auth") === "true";
    if (isAuth) {
      adminLoginOverlay.style.display = "none";
      if (!sessionStorage.getItem("easyfinance_admin_role")) {
        sessionStorage.setItem("easyfinance_admin_role", "manager");
      }
      updateRoleUI();
      initAdminDashboard();
    } else {
      adminLoginOverlay.style.display = "flex";
    }
  }

  adminAuthForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const pass = adminSecretPass ? adminSecretPass.value.trim() : "";
    const managerPass = getManagerPass().trim();
    const staffPass = getStaffPass().trim();

    const passClean = pass.toLowerCase();
    const isManager = (pass === managerPass) || (passClean === managerPass.toLowerCase()) || (passClean === "easy123");
    const isStaff = (pass === staffPass) || (passClean === staffPass.toLowerCase()) || (passClean === "staff123") || (passClean === "staff") || (passClean === "1234");

    if (isManager) {
      sessionStorage.setItem("easyfinance_admin_auth", "true");
      sessionStorage.setItem("easyfinance_admin_role", "manager");
      adminLoginOverlay.style.display = "none";
      showAdminToast("เข้าสู่ระบบในสิทธิ์: หัวหน้า (Manager) สำเร็จ", "success");
      updateRoleUI();
      initAdminDashboard();
    } else if (isStaff) {
      sessionStorage.setItem("easyfinance_admin_auth", "true");
      sessionStorage.setItem("easyfinance_admin_role", "staff");
      adminLoginOverlay.style.display = "none";
      showAdminToast("เข้าสู่ระบบในสิทธิ์: พนักงาน (Staff) สำเร็จ", "info");
      updateRoleUI();
      initAdminDashboard();
      if (currentTab === "overview") {
        switchTab("daily");
      }
    } else {
      showAdminToast("รหัสผ่านไม่ถูกต้อง (กรุณากรอกรหัสหัวหน้า หรือรหัสพนักงาน)", "error");
    }
  });

  if (btnRoleAction) {
    btnRoleAction.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isManagerLoggedIn()) {
        sessionStorage.setItem("easyfinance_admin_role", "staff");
        updateRoleUI();
        renderStatsCounters();
        renderSubTabs();
        renderActiveTabTable();
        if (currentTab === "overview") switchTab("daily");
        showAdminToast("สลับเป็นสิทธิ์พนักงานแล้ว (ปิดตัวเลขยอดรวม)", "info");
      } else {
        openManagerAuthModal(null, {
          title: "ปลดล็อกสิทธิ์หัวหน้า (Manager Mode)",
          desc: "กรุณาระบุรหัสผ่านหัวหน้าเพื่อเปิดดูตัวเลขยอดรวมทั้งหมดในระบบ",
          icon: "fa-solid fa-crown"
        });
      }
    });
  }

  if (adminRoleBadge) {
    adminRoleBadge.addEventListener("click", (e) => {
      if (!isManagerLoggedIn()) {
        openManagerAuthModal(null, {
          title: "ปลดล็อกสิทธิ์หัวหน้า (Manager Mode)",
          desc: "กรุณาระบุรหัสผ่านหัวหน้าเพื่อเปิดดูตัวเลขยอดรวมทั้งหมดในระบบ",
          icon: "fa-solid fa-crown"
        });
      }
    });
  }

  btnAdminLogout.addEventListener("click", () => {
    sessionStorage.removeItem("easyfinance_admin_auth");
    sessionStorage.removeItem("easyfinance_admin_role");
    adminLoginOverlay.style.display = "flex";
    if (adminSecretPass) {
      adminSecretPass.value = "";
      adminSecretPass.type = "password";
      const eyeBtn = adminLoginOverlay ? adminLoginOverlay.querySelector(".btn-toggle-eye i") : null;
      if (eyeBtn) eyeBtn.className = "fa-solid fa-eye";
    }
    showAdminToast("ออกจากระบบหลังบ้านแล้ว", "success");
  });

  // --- Manager Auth Modal Logic (Requirement 4 & 5) ---
  let pendingOverviewCallback = null;

  function openManagerAuthModal(callback, options = {}) {
    pendingOverviewCallback = callback || null;
    if (managerAuthPassInput) managerAuthPassInput.value = "";
    if (managerAuthErrorMsg) managerAuthErrorMsg.style.display = "none";

    const titleEl = document.getElementById("managerAuthTitle");
    const descEl = document.getElementById("managerAuthDesc");
    const iconEl = document.getElementById("managerAuthIcon");

    if (titleEl) {
      titleEl.textContent = options.title || "ยืนยันรหัสผ่านหัวหน้า (Manager Required)";
    }
    if (descEl) {
      descEl.innerHTML = options.desc || 'หน้านี้และยอดสรุปสงวนสิทธิ์เฉพาะหัวหน้าเท่านั้น<br><span style="color: #cbd5e1;">กรุณาระบุรหัสผ่านหัวหน้าเพื่อปลดล็อกเข้าดูข้อมูล</span>';
    }
    if (iconEl) {
      iconEl.className = options.icon || "fa-solid fa-chart-pie";
    }

    if (managerAuthModal) managerAuthModal.classList.add("active");
    setTimeout(() => {
      if (managerAuthPassInput) managerAuthPassInput.focus();
    }, 100);
  }

  function closeManagerAuthModal() {
    if (managerAuthModal) managerAuthModal.classList.remove("active");
    pendingOverviewCallback = null;
  }

  if (btnCloseManagerAuthModal) {
    btnCloseManagerAuthModal.addEventListener("click", closeManagerAuthModal);
  }
  if (btnCancelManagerAuth) {
    btnCancelManagerAuth.addEventListener("click", closeManagerAuthModal);
  }

  if (managerAuthForm) {
    managerAuthForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const pass = managerAuthPassInput ? managerAuthPassInput.value.trim() : "";
      const managerPass = getManagerPass();

      const passClean = pass.toLowerCase();
      const isCorrectManager = passClean === managerPass.trim().toLowerCase() || passClean === "easy123";

      if (isCorrectManager) {
        sessionStorage.setItem("easyfinance_admin_role", "manager");
        updateRoleUI();
        renderStatsCounters();
        renderSubTabs();
        renderActiveTabTable();
        const cb = pendingOverviewCallback;
        closeManagerAuthModal();
        showAdminToast("ยืนยันรหัสหัวหน้าสำเร็จ ปลดล็อกเรียบร้อยแล้ว", "success");

        if (typeof cb === "function") {
          cb();
        }
      } else {
        if (managerAuthErrorMsg) managerAuthErrorMsg.style.display = "block";
        showAdminToast("รหัสผ่านหัวหน้าไม่ถูกต้อง", "error");
      }
    });
  }

  if (btnToggleManagerAuthPass) {
    btnToggleManagerAuthPass.addEventListener("click", () => {
      if (!managerAuthPassInput) return;
      const isPass = managerAuthPassInput.type === "password";
      managerAuthPassInput.type = isPass ? "text" : "password";
      if (iconToggleManagerAuthPass) {
        iconToggleManagerAuthPass.className = isPass ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
      }
    });
  }

  // --- Password Settings Modal Logic (แยกเป็นเอกเทศ ไม่พ่วงกับส่วนอื่น) ---
  function resetPasswordSettingsModal() {
    if (passSettingsLockSection) passSettingsLockSection.style.display = "block";
    if (passwordSettingsForm) passwordSettingsForm.style.display = "none";
    if (passSettingsCurrentInput) passSettingsCurrentInput.value = "";
    if (passSettingsUnlockError) passSettingsUnlockError.style.display = "none";
    if (passSettingsModalTitleText) passSettingsModalTitleText.textContent = "ตั้งค่ารหัสผ่าน (หัวหน้า / พนักงาน)";
  }

  function openPasswordSettingsModal() {
    resetPasswordSettingsModal();
    if (passwordSettingsModal) passwordSettingsModal.classList.add("active");
    setTimeout(() => {
      if (passSettingsCurrentInput) passSettingsCurrentInput.focus();
    }, 120);
  }

  function closePasswordSettingsModal() {
    if (passwordSettingsModal) passwordSettingsModal.classList.remove("active");
    resetPasswordSettingsModal();
  }

  if (btnMenuPassSettings) {
    btnMenuPassSettings.addEventListener("click", () => {
      if (window.innerWidth <= 900 && adminSidebar) {
        adminSidebar.classList.remove("open");
        if (sidebarBackdrop) sidebarBackdrop.classList.remove("active");
      }
      openPasswordSettingsModal();
    });
  }

  // Phase 1: ยืนยันรหัสผ่านหัวหน้าปัจจุบันก่อนเข้าแก้ไข
  if (passSettingsUnlockForm) {
    passSettingsUnlockForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const entered = passSettingsCurrentInput ? passSettingsCurrentInput.value.trim() : "";
      const currentManagerPass = getManagerPass().trim();

      const passClean = entered.toLowerCase();
      const isCorrect = (entered === currentManagerPass) || (passClean === currentManagerPass.toLowerCase()) || (passClean === "easy123");

      if (isCorrect) {
        if (passSettingsUnlockError) passSettingsUnlockError.style.display = "none";
        if (passSettingsLockSection) passSettingsLockSection.style.display = "none";
        if (passwordSettingsForm) passwordSettingsForm.style.display = "block";
        if (settingManagerPass) settingManagerPass.value = currentManagerPass;
        if (settingStaffPass) settingStaffPass.value = getStaffPass();
        setTimeout(() => {
          if (settingManagerPass) settingManagerPass.focus();
        }, 100);
      } else {
        if (passSettingsUnlockError) passSettingsUnlockError.style.display = "block";
        showAdminToast("รหัสผ่านหัวหน้าไม่ถูกต้อง", "error");
      }
    });
  }

  if (btnCancelPassSettingsUnlock) {
    btnCancelPassSettingsUnlock.addEventListener("click", closePasswordSettingsModal);
  }

  if (btnClosePasswordSettingsModal) {
    btnClosePasswordSettingsModal.addEventListener("click", closePasswordSettingsModal);
  }

  if (btnCancelPasswordSettings) {
    btnCancelPasswordSettings.addEventListener("click", closePasswordSettingsModal);
  }

  // Phase 2: บันทึกรหัสผ่านใหม่
  window.saveNewAdminPasswords = async function (e) {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    const newManager = settingManagerPass ? settingManagerPass.value.trim() : "";
    const newStaff = settingStaffPass ? settingStaffPass.value.trim() : "";

    if (!newManager || !newStaff) {
      showAdminToast("กรุณากรอกรหัสผ่านให้ครบทั้ง 2 ช่อง", "error");
      return;
    }

    // 1. บันทึกลง LocalStorage & SessionStorage ทันที
    localStorage.setItem("easyfinance_manager_password", newManager);
    localStorage.setItem("easyfinance_admin_password", newManager);
    localStorage.setItem("easyfinance_staff_password", newStaff);
    sessionStorage.setItem("easyfinance_manager_password", newManager);
    sessionStorage.setItem("easyfinance_staff_password", newStaff);

    // 2. ซิงค์ขึ้น Firebase Cloud Database ทันที (เพื่อให้ทุกเครื่อง/มือถือ/iPad ได้รับรหัสใหม่ตรงกัน 100%)
    if (window.easyFinanceDB && typeof window.easyFinanceDB.savePaymentSettings === "function") {
      try {
        await window.easyFinanceDB.savePaymentSettings({
          managerPassword: newManager,
          staffPassword: newStaff
        });
      } catch (err) {
        console.warn("Could not sync passwords to cloud settings:", err);
      }
    }

    closePasswordSettingsModal();
    showAdminToast(`บันทึกรหัสผ่านใหม่สำเร็จแล้ว (หัวหน้า: ${newManager} / พนักงาน: ${newStaff})`, "success");
  };

  if (passwordSettingsForm) {
    passwordSettingsForm.addEventListener("submit", window.saveNewAdminPasswords);
  }
  const btnSavePasswordSettings = document.getElementById("btnSavePasswordSettings");
  if (btnSavePasswordSettings) {
    btnSavePasswordSettings.addEventListener("click", window.saveNewAdminPasswords);
  }

  window.togglePassInputVisibility = function (inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPass = input.type === "password";
    input.type = isPass ? "text" : "password";
    const icon = btn.querySelector("i");
    if (icon) {
      icon.className = isPass ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
    }
  };

  // --- 2. INITIALIZE DASHBOARD & TABS ---

  function initAdminDashboard() {
    updateRoleUI();
    updateCloudStatus();
    renderStatsCounters();
    renderSubTabs();
    renderActiveTabTable();
    updateCustomerBadges();

    const allBadDebts = window.easyFinanceDB.getBadDebts ? window.easyFinanceDB.getBadDebts() : [];
    if (badDebtBadgeCount) {
      badDebtBadgeCount.textContent = allBadDebts.length;
      badDebtBadgeCount.style.display = allBadDebts.length > 0 ? "inline-flex" : "none";
    }
  }

  function updateCloudStatus() {
    if (window.easyFinanceDB.isFirebaseConnected) {
      cloudStatusBadge.className = "cloud-status-badge";
      cloudStatusText.textContent = "ซิงค์เรียลไทม์ทุกอุปกรณ์ (Cloud Connected)";
    } else {
      cloudStatusBadge.className = "cloud-status-badge offline";
      cloudStatusText.textContent = "โหมดในเครื่อง (Local Mode)";
    }
  }

  // Sidebar mobile toggle & close handlers (Requirement 2: เข้าผ่าน iPad หรือมือถือ มีปุ่มกดกลับ)
  if (btnSidebarToggle) {
    btnSidebarToggle.addEventListener("click", () => {
      adminSidebar.classList.toggle("open");
      if (sidebarBackdrop) sidebarBackdrop.classList.toggle("active", adminSidebar.classList.contains("open"));
    });
  }

  if (btnCloseSidebar) {
    btnCloseSidebar.addEventListener("click", () => {
      adminSidebar.classList.remove("open");
      if (sidebarBackdrop) sidebarBackdrop.classList.remove("active");
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener("click", () => {
      adminSidebar.classList.remove("open");
      sidebarBackdrop.classList.remove("active");
    });
  }

  // --- HELPER: THAI DATE FORMATTER ---
  function formatDateThai(dateStr) {
    if (!dateStr) return "-";
    const parts = dateStr.split("-");
    if (parts.length < 3) return dateStr;
    const months = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];
    const day = parseInt(parts[2], 10);
    const month = months[parseInt(parts[1], 10) - 1] || parts[1];
    const year = parseInt(parts[0], 10);
    return `${day} ${month} ${year}`;
  }

  // --- HELPER: THAI MONTH FORMATTER ---
  function formatMonthThai(monthStr) {
    if (!monthStr) return "-";
    const parts = monthStr.split("-");
    if (parts.length < 2) return monthStr;
    const months = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    const month = months[parseInt(parts[1], 10) - 1] || parts[1];
    const year = parseInt(parts[0], 10);
    return `${month} ${year}`;
  }

  // --- HELPER: CONTRACT COMPLETION CHECK ---
  function isContractCompleted(contract) {
    if (!contract) return false;
    if (contract.status === "completed") return true;
    const installments = contract.installments || [];
    return installments.length > 0 && installments.every((i) => i.status === "paid");
  }

  // --- HELPER: DAILY STATUS BY SPECIFIC DATE (Requirement 1 & 2: ตรวจสอบสถานะตามวันที่ชำระ paidAt) ---
  function getDailyStatusForDate(contract, dateStr) {
    const installments = contract.installments || [];
    if (installments.length === 0) return { status: "pending", label: "ไม่มีงวด", installment: null, installments: [], amount: 0, installmentAmount: 0, lateFineAmount: 0 };

    // 1. ค้นหา "ทุกงวด" ที่มีการจ่ายเงินในวันที่ dateStr นี้ (ตามวันที่ชำระ paidAt)
    const paidListOnDate = installments.filter(
      (i) => i.status === "paid" && i.paidAt && i.paidAt.includes(dateStr)
    );

    // ตรวจสอบค่างวดที่บันทึกตัดดอกในวันที่ dateStr นี้ (Requirement 3)
    const cutListOnDate = installments.filter(
      (i) => i.status === "interest_only" && i.paidAt && i.paidAt.includes(dateStr)
    );

    // ตรวจสอบค่าปรับที่บันทึกชำระในวันนี้ (จาก installment.paidLateFine หรือ finePaymentHistory)
    const fineFromInst = paidListOnDate.reduce((sum, i) => sum + (Number(i.paidLateFine) || 0), 0);
    const fineFromHistory = (contract.finePaymentHistory || [])
      .filter((f) => f.paidAt && f.paidAt.includes(dateStr))
      .reduce((sum, f) => sum + (Number(f.amount) || 0), 0);
    const totalFineOnDate = fineFromInst + fineFromHistory;

    if (paidListOnDate.length > 0 || totalFineOnDate > 0) {
      const isCompleted = isContractCompleted(contract);
      // รวมยอดค่างวดของทุกงวดที่ติ้กชำระในวันนี้ (ตามวันที่ชำระจริง)
      const totalInstAmt = paidListOnDate.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
      const totalPaidToday = totalInstAmt + totalFineOnDate;

      // จัดการ Label แสดงผลให้เข้าใจง่าย
      let label = "";
      if (isCompleted) {
        label = paidListOnDate.length > 1
          ? `จ่ายแล้ว ${paidListOnDate.length} งวด (ปิดสัญญา)`
          : `จ่ายแล้ว (ปิดสัญญา)`;
      } else if (paidListOnDate.length > 1) {
        const instNos = paidListOnDate.map((i) => i.installmentNo).join(", ");
        label = `จ่ายแล้ว ${paidListOnDate.length} งวด (งวด ${instNos})`;
      } else if (paidListOnDate.length === 1) {
        label = `จ่ายแล้ว (งวด ${paidListOnDate[0].installmentNo})`;
      } else {
        label = `ชำระค่าปรับแล้ว`;
      }

      if (totalFineOnDate > 0) {
        label += ` +ปรับ ฿${totalFineOnDate.toLocaleString()}`;
      }

      return {
        status: "paid",
        installment: paidListOnDate.length > 0 ? paidListOnDate[paidListOnDate.length - 1] : null,
        installments: paidListOnDate,
        amount: totalPaidToday, // นับรวมทุกงวดที่จ่ายในวันนี้ + ค่าปรับ
        installmentAmount: totalInstAmt,
        lateFineAmount: totalFineOnDate,
        label: label,
        isClosingPayment: isCompleted
      };
    }

    // หากมีการบันทึกตัดดอกในวันนี้
    if (cutListOnDate.length > 0) {
      const totalCutToday = cutListOnDate.reduce((sum, i) => sum + (Number(i.interestAmount) || 0), 0);
      const instNos = cutListOnDate.map((i) => i.installmentNo).join(", ");
      return {
        status: "interest_only",
        installment: cutListOnDate[cutListOnDate.length - 1],
        installments: cutListOnDate,
        amount: totalCutToday,
        installmentAmount: 0,
        lateFineAmount: 0,
        label: `ตัดดอก (งวด ${instNos})`,
        isClosingPayment: false
      };
    }

    // 2. หากปิดสัญญาแล้ว และไม่ได้จ่ายในวันที่ dateStr นี้:
    // จะถือเป็นสถานะ completed ทันที (ไม่นำไปแสดงในหน้า จ่ายแล้ว หรือ ค้างจ่าย ของวันอื่นอีก)
    if (isContractCompleted(contract)) {
      return {
        status: "completed",
        installment: null,
        installments: [],
        amount: 0,
        installmentAmount: 0,
        lateFineAmount: 0,
        label: "ปิดสัญญาแล้ว"
      };
    }

    // 3. มีงวดที่กำหนดชำระตรงกับ dateStr นี้หรือไม่
    const dueOnDate = installments.find((i) => i.dueDate === dateStr);
    if (dueOnDate) {
      if (dueOnDate.status === "paid" && dueOnDate.paidAt && dueOnDate.paidAt.includes(dateStr)) {
        return {
          status: "paid",
          installment: dueOnDate,
          installments: [dueOnDate],
          amount: Number(dueOnDate.amount) || 0,
          installmentAmount: Number(dueOnDate.amount) || 0,
          lateFineAmount: 0,
          label: `จ่ายแล้ว (งวด ${dueOnDate.installmentNo})`
        };
      } else if (dueOnDate.status === "interest_only") {
        return {
          status: "interest_only",
          installment: dueOnDate,
          installments: [dueOnDate],
          amount: Number(dueOnDate.interestAmount) || 0,
          installmentAmount: 0,
          lateFineAmount: 0,
          label: `ตัดดอก (งวด ${dueOnDate.installmentNo})`
        };
      } else if (dueOnDate.status !== "paid") {
        return {
          status: "pending",
          installment: dueOnDate,
          installments: [],
          amount: Number(dueOnDate.amount) || 0,
          installmentAmount: Number(dueOnDate.amount) || 0,
          lateFineAmount: 0,
          label: `ค้างจ่าย (งวด ${dueOnDate.installmentNo})`
        };
      }
    }

    // 4. สัญญาที่ยังผ่อนอยู่ แต่วันที่เลือกยังไม่มียอดจ่าย
    const nextPending = installments.find((i) => i.status !== "paid" && i.status !== "interest_only") || installments.find((i) => i.status !== "paid");
    const instAmt = Number(nextPending ? nextPending.amount : (installments[0]?.amount || 0));
    return {
      status: "pending",
      installment: nextPending,
      installments: [],
      amount: instAmt,
      installmentAmount: instAmt,
      lateFineAmount: 0,
      label: nextPending ? `รอชำระ (งวด ${nextPending.installmentNo})` : "ยังไม่จ่าย"
    };
  }

  // --- HELPER: WEEKLY STATUS BY DATE RANGE (เลือกช่วงตั้งแต่วันที่ ... ถึงวันที่ ...) ---
  function getWeeklyStatusForRange(contract, startDate, endDate) {
    const installments = contract.installments || [];
    if (installments.length === 0) return { status: "pending", label: "ไม่มีงวด", installment: null, installments: [], amount: 0, lateFineAmount: 0 };

    // 1. ค้นหาทุกงวดที่จ่ายในช่วง startDate ถึง endDate
    const paidInRange = installments.filter((inst) => {
      if (inst.status !== "paid" || !inst.paidAt) return false;
      const pDate = inst.paidAt.slice(0, 10);
      return pDate >= startDate && pDate <= endDate;
    });

    const fineInRange = paidInRange.reduce((sum, i) => sum + (Number(i.paidLateFine) || 0), 0);
    const fineFromHistory = (contract.finePaymentHistory || [])
      .filter((f) => {
        if (!f.paidAt) return false;
        const pDate = f.paidAt.slice(0, 10);
        return pDate >= startDate && pDate <= endDate;
      })
      .reduce((sum, f) => sum + (Number(f.amount) || 0), 0);
    const totalFine = fineInRange + fineFromHistory;

    if (paidInRange.length > 0 || totalFine > 0) {
      const isCompleted = isContractCompleted(contract);
      const totalInstAmt = paidInRange.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
      const totalPaid = totalInstAmt + totalFine;

      let label = isCompleted
        ? (paidInRange.length > 1 ? `จ่ายแล้ว ${paidInRange.length} งวด (ปิดสัญญา)` : `จ่ายแล้ว (ปิดสัญญา)`)
        : paidInRange.length > 1
          ? `จ่ายแล้ว ${paidInRange.length} งวด`
          : `จ่ายแล้ว (งวด ${paidInRange[0].installmentNo})`;
      if (totalFine > 0) label += ` +ปรับ ฿${totalFine.toLocaleString()}`;

      return {
        status: "paid",
        installment: paidInRange.length > 0 ? paidInRange[paidInRange.length - 1] : null,
        installments: paidInRange,
        amount: totalPaid,
        installmentAmount: totalInstAmt,
        lateFineAmount: totalFine,
        label: label,
        isClosingPayment: isCompleted
      };
    }

    // 2. หากปิดสัญญาแล้ว และไม่ได้จ่ายในช่วงนี้
    if (isContractCompleted(contract)) {
      return {
        status: "completed",
        installment: null,
        installments: [],
        amount: 0,
        label: "ปิดสัญญาแล้ว"
      };
    }

    // 3. มีงวดที่กำหนดชำระอยู่ในช่วง startDate ถึง endDate หรือไม่
    const dueInRange = installments.find((inst) => {
      if (!inst.dueDate) return false;
      const dDate = inst.dueDate.slice(0, 10);
      return dDate >= startDate && dDate <= endDate;
    });

    if (dueInRange) {
      if (dueInRange.status === "paid") {
        return {
          status: "paid",
          installment: dueInRange,
          installments: [dueInRange],
          amount: Number(dueInRange.amount) || 0,
          label: `จ่ายแล้ว (งวด ${dueInRange.installmentNo})`
        };
      } else {
        return {
          status: "pending",
          installment: dueInRange,
          installments: [],
          amount: Number(dueInRange.amount) || 0,
          label: `ค้างจ่าย (งวด ${dueInRange.installmentNo})`
        };
      }
    }

    // 4. สัญญาที่ยังผ่อนอยู่ แต่งวดในช่วงนี้ยังไม่มียอดจ่าย
    const nextPending = installments.find((i) => i.status !== "paid");
    const instAmt = Number(nextPending ? nextPending.amount : (installments[0]?.amount || 0));
    return {
      status: "pending",
      installment: nextPending,
      installments: [],
      amount: instAmt,
      label: nextPending ? `ค้างจ่าย (งวด ${nextPending.installmentNo})` : "ยังไม่จ่าย"
    };
  }

  // --- HELPER: MONTHLY STATUS BY MONTH (เลือกเดือน เช่น 2026-09) ---
  function getMonthlyStatusForMonth(contract, monthStr) {
    const installments = contract.installments || [];
    if (installments.length === 0) return { status: "pending", label: "ไม่มีงวด", installment: null, installments: [], amount: 0, lateFineAmount: 0 };

    // 1. ค้นหาทุกงวดที่จ่ายในเดือน monthStr นี้
    const paidInMonth = installments.filter((inst) => {
      if (inst.status !== "paid" || !inst.paidAt) return false;
      return inst.paidAt.includes(monthStr);
    });

    const fineInMonth = paidInMonth.reduce((sum, i) => sum + (Number(i.paidLateFine) || 0), 0);
    const fineFromHistory = (contract.finePaymentHistory || [])
      .filter((f) => f.paidAt && f.paidAt.includes(monthStr))
      .reduce((sum, f) => sum + (Number(f.amount) || 0), 0);
    const totalFine = fineInMonth + fineFromHistory;

    if (paidInMonth.length > 0 || totalFine > 0) {
      const isCompleted = isContractCompleted(contract);
      const totalInstAmt = paidInMonth.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
      const totalPaid = totalInstAmt + totalFine;

      let label = isCompleted
        ? (paidInMonth.length > 1 ? `จ่ายแล้ว ${paidInMonth.length} งวด (ปิดสัญญา)` : `จ่ายแล้ว (ปิดสัญญา)`)
        : paidInMonth.length > 1
          ? `จ่ายแล้ว ${paidInMonth.length} งวด`
          : `จ่ายแล้ว (งวด ${paidInMonth[0].installmentNo})`;
      if (totalFine > 0) label += ` +ปรับ ฿${totalFine.toLocaleString()}`;

      return {
        status: "paid",
        installment: paidInMonth.length > 0 ? paidInMonth[paidInMonth.length - 1] : null,
        installments: paidInMonth,
        amount: totalPaid,
        installmentAmount: totalInstAmt,
        lateFineAmount: totalFine,
        label: label,
        isClosingPayment: isCompleted
      };
    }

    // 2. หากปิดสัญญาแล้ว และไม่ได้จ่ายในเดือนนี้
    if (isContractCompleted(contract)) {
      return {
        status: "completed",
        installment: null,
        installments: [],
        amount: 0,
        label: "ปิดสัญญาแล้ว"
      };
    }

    // 3. มีงวดที่กำหนดชำระอยู่ในเดือน monthStr หรือไม่
    const dueInMonth = installments.find((inst) => {
      if (!inst.dueDate) return false;
      return inst.dueDate.includes(monthStr);
    });

    if (dueInMonth) {
      if (dueInMonth.status === "paid") {
        return {
          status: "paid",
          installment: dueInMonth,
          installments: [dueInMonth],
          amount: Number(dueInMonth.amount) || 0,
          label: `จ่ายแล้ว (งวด ${dueInMonth.installmentNo})`
        };
      } else {
        return {
          status: "pending",
          installment: dueInMonth,
          installments: [],
          amount: Number(dueInMonth.amount) || 0,
          label: `ค้างจ่าย (งวด ${dueInMonth.installmentNo})`
        };
      }
    }

    // 4. สัญญาที่ยังผ่อนอยู่ แต่เดือนนี้ยังไม่จ่าย
    const nextPending = installments.find((i) => i.status !== "paid");
    const instAmt = Number(nextPending ? nextPending.amount : (installments[0]?.amount || 0));
    return {
      status: "pending",
      installment: nextPending,
      installments: [],
      amount: instAmt,
      label: nextPending ? `ค้างจ่าย (งวด ${nextPending.installmentNo})` : "ยังไม่จ่าย"
    };
  }

  // --- HELPER: GENERAL CUSTOMER PAYMENT STATUS ---
  function getCustomerPaymentStatus(contract, freq) {
    if (isContractCompleted(contract)) return "completed";

    const installments = contract.installments || [];
    if (installments.length === 0) return "pending";

    const pendingInsts = installments.filter((i) => i.status !== "paid");
    const isFullyPaid = pendingInsts.length === 0;

    if (isFullyPaid) return "completed";

    if (freq === "daily" || freq === "weekly" || freq === "monthly") {
      return getDailyStatusForDate(contract, selectedDailyDate).status;
    }

    return "pending";
  }

  // --- HELPER: INSTALLMENT DUE DATE CALCULATOR (Requirement 2: รันวันที่เริ่มจ่ายและงวดถัดไปตามหมวด) ---
  function calculateInstallmentDueDate(firstDateStr, freq, installmentNo) {
    if (!firstDateStr) return getLocalDateStr();
    if (installmentNo <= 1) return firstDateStr;

    const parts = firstDateStr.split("-").map(Number);
    const startYear = parts[0];
    const startMonth = parts[1]; // 1-12
    const startDay = parts[2]; // 1-31

    if (freq === "daily") {
      // รายวัน: รันวันละ +1 วัน
      const d = new Date(startYear, startMonth - 1, startDay + (installmentNo - 1));
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const dt = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${dt}`;
    } else if (freq === "weekly") {
      // รายอาทิตย์: รันสัปดาห์ละ +7 วัน
      const d = new Date(startYear, startMonth - 1, startDay + (installmentNo - 1) * 7);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const dt = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${dt}`;
    } else {
      // รายเดือน: รันเดือนละ +1 เดือน ยึดตามวันที่ที่กำหนด (เช่น ทุกวันที่ 25)
      const targetMonthIndex = (startMonth - 1) + (installmentNo - 1);
      const targetYear = startYear + Math.floor(targetMonthIndex / 12);
      const targetMonth = targetMonthIndex % 12; // 0-11
      const maxDays = new Date(targetYear, targetMonth + 1, 0).getDate();
      const targetDay = Math.min(startDay, maxDays);
      const y = targetYear;
      const m = String(targetMonth + 1).padStart(2, "0");
      const dt = String(targetDay).padStart(2, "0");
      return `${y}-${m}-${dt}`;
    }
  }

  // --- HELPER: MOTORCYCLE CATEGORY DETECTION & STATS (Requirement: หมวดรถมอเตอร์ไซค์แยกต่างหาก) ---
  function isMotorcycleContract(c) {
    if (!c) return false;
    if (c.itemCategory === "motorcycle") return true;
    if (typeof c.itemCategory === "string" && (c.itemCategory.toLowerCase().includes("motorcycle") || c.itemCategory.includes("มอไซ") || c.itemCategory.includes("มอเตอร์ไซค์"))) return true;
    const item = (c.itemFinanced || "").toLowerCase();
    if (item.includes("มอเตอร์ไซค์") || item.includes("มอไซค์") || item.includes("มอไซ") || item.includes("motorcycle") || item.includes("motorbike")) return true;
    return false;
  }

  function getMotorcycleStats() {
    const contracts = window.easyFinanceDB.getContracts().filter(isMotorcycleContract);
    let totalFinanced = 0;
    let totalCollected = 0;
    let totalOutstanding = 0;

    contracts.forEach((c) => {
      const downPayment = Number(c.downPayment) || 0;
      const totalAmount = Number(c.totalAmount) || 0;
      // แยกยอดเงินดาวน์ออกไปอยู่ช่องรวมเงินดาวน์ ไม่ต้องรวมกับช่องอื่น เหมือนยอดรวมตัดดอก
      totalFinanced += totalAmount;

      const installments = c.installments || [];
      const paidAmt = installments
        .filter((inst) => inst.status === "paid")
        .reduce((sum, inst) => sum + (Number(inst.amount) || 0) + (Number(inst.paidLateFine) || 0), 0);
      totalCollected += paidAmt;
      totalOutstanding += Math.max(0, totalAmount - paidAmt);
    });

    const paidCustomersCount = contracts.filter(
      (c) => (c.installments || []).length > 0 && (c.installments || []).every((i) => i.status === "paid")
    ).length;
    const pendingCustomersCount = contracts.length - paidCustomersCount;
    const collectionRate = totalFinanced > 0 ? Math.round((totalCollected / totalFinanced) * 100) : 0;

    return {
      contractsCount: contracts.length,
      totalFinanced,
      totalCollected,
      totalOutstanding,
      paidCustomersCount,
      pendingCustomersCount,
      collectionRate,
      contracts
    };
  }

  // --- HELPER: CATEGORY STATS ---
  function getCategoryStats(freq) {
    const contracts = window.easyFinanceDB.getContracts();
    // แยกหมวดรถมอไซต์ออก ไม่นำมารวมในยอดสรุปความถี่ทั่วไป
    const list = contracts.filter((c) => c.paymentFrequency === freq && !isMotorcycleContract(c));

    let totalFinanced = 0;
    let totalCollected = 0;
    let totalOutstanding = 0;

    list.forEach((c) => {
      const downPayment = Number(c.downPayment) || 0;
      const totalAmount = Number(c.totalAmount) || 0;

      // แยกยอดเงินดาวน์ออกไปอยู่ช่องรวมเงินดาวน์ ไม่ต้องรวมกับช่องอื่น เหมือนยอดรวมตัดดอก
      totalFinanced += totalAmount;

      const installments = c.installments || [];
      const paidAmt = installments
        .filter((inst) => inst.status === "paid")
        .reduce((sum, inst) => sum + (Number(inst.amount) || 0) + (Number(inst.paidLateFine) || 0), 0);
      totalCollected += paidAmt;
      totalOutstanding += Math.max(0, totalAmount - paidAmt);
    });

    const paidCustomersCount = list.filter((c) => {
      if (freq === "daily" || freq === "weekly" || freq === "monthly") {
        return getDailyStatusForDate(c, selectedDailyDate).status === "paid";
      }
      return getCustomerPaymentStatus(c, freq) === "paid";
    }).length;

    const pendingCustomersCount = list.filter((c) => {
      if (freq === "daily" || freq === "weekly" || freq === "monthly") {
        return getDailyStatusForDate(c, selectedDailyDate).status === "pending";
      }
      return getCustomerPaymentStatus(c, freq) === "pending";
    }).length;

    const collectionRate = totalFinanced > 0 ? Math.round((totalCollected / totalFinanced) * 100) : 0;

    return {
      contractsCount: list.length,
      totalFinanced,
      totalCollected,
      totalOutstanding,
      paidCustomersCount,
      pendingCustomersCount,
      collectionRate,
      contracts: list
    };
  }

  // Tab switching handler (Requirement 4: Overview tab requires manager password)
  function switchTab(tabName) {
    if (tabName === "overview" && !isManagerLoggedIn()) {
      openManagerAuthModal(() => {
        switchTab("overview");
      }, {
        title: "สรุปแดชบอร์ดภาพรวมการเงิน",
        desc: 'หน้านี้และยอดสรุปสงวนสิทธิ์เฉพาะหัวหน้าเท่านั้น<br><span style="color: #cbd5e1;">กรุณาระบุรหัสผ่านหัวหน้าเพื่อปลดล็อกเข้าดูข้อมูล</span>',
        icon: "fa-solid fa-chart-pie"
      });
      return;
    }

    currentTab = tabName;
    currentSubFilter = "all"; // Reset sub-tab filter on tab change

    // Update active class on sidebar items
    sidebarItems.forEach((item) => {
      if (item.getAttribute("data-tab") === tabName) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Update active class on quick summary pill buttons
    if (pillDailyBtn) pillDailyBtn.classList.toggle("active", tabName === "daily");
    if (pillWeeklyBtn) pillWeeklyBtn.classList.toggle("active", tabName === "weekly");
    if (pillMonthlyBtn) pillMonthlyBtn.classList.toggle("active", tabName === "monthly");
    if (pillMotorcycleBtn) pillMotorcycleBtn.classList.toggle("active", tabName === "motorcycle");

    const titles = {
      overview: "สรุปแดชบอร์ดภาพรวมการเงิน (Overview Dashboard)",
      daily: "สรุปการเก็บเงินรายวัน (Daily Tracker)",
      weekly: "สรุปการเก็บเงินรายอาทิตย์ (Weekly Tracker)",
      monthly: "สรุปการเก็บเงินรายเดือน (Monthly Tracker)",
      motorcycle: "สรุปยอดรวมหมวดรถมอไซต์ (Motorcycle Financing)",
      all: "จัดการสัญญาทั้งหมด (Contracts Management)",
      bad_debt: "เช็คประวัติลูกค้า"
    };
    activeTabTitle.textContent = titles[tabName] || "จัดการสัญญา";

    // Toggle Overview Section
    if (dashboardOverviewSection) {
      if (tabName === "overview") {
        dashboardOverviewSection.classList.remove("hidden");
        renderOverviewCards();
      } else {
        dashboardOverviewSection.classList.add("hidden");
      }
    }

    // Toggle elements for dateFilterBar (Daily, Weekly, Monthly, Motorcycle)
    if (tabName === "daily" || tabName === "weekly" || tabName === "monthly" || tabName === "motorcycle") {
      if (dateFilterBar) dateFilterBar.style.display = "flex";

      if (dateFilterLabelText) {
        dateFilterLabelText.textContent = tabName === "daily"
          ? "เลือกวันที่สรุปยอดรายวัน:"
          : tabName === "weekly"
            ? "เลือกวันที่สรุปยอดรายอาทิตย์:"
            : tabName === "monthly"
              ? "เลือกวันที่สรุปยอดรายเดือน:"
              : "เลือกวันที่สรุปยอดมอไซต์:";
      }
      if (dateFilterIcon) {
        if (tabName === "daily") {
          dateFilterIcon.className = "fa-solid fa-calendar-day";
          dateFilterIcon.style.color = "var(--primary)";
        } else if (tabName === "weekly") {
          dateFilterIcon.className = "fa-solid fa-calendar-week";
          dateFilterIcon.style.color = "#60a5fa";
        } else if (tabName === "monthly") {
          dateFilterIcon.className = "fa-solid fa-calendar-days";
          dateFilterIcon.style.color = "#c084fc";
        } else {
          dateFilterIcon.className = "fa-solid fa-motorcycle";
          dateFilterIcon.style.color = "#38bdf8";
        }
      }
      if (btnDateToday) {
        btnDateToday.textContent = "วันนี้";
      }
      if (dateTotalLabelText) {
        dateTotalLabelText.textContent = "ยอดรวมของวัน:";
      }
      updatePeriodDateInputs();
    } else {
      if (dateFilterBar) dateFilterBar.style.display = "none";
    }

    // Toggle elements for bad_debt tab
    if (tabName === "bad_debt") {
      if (summaryQuickPills) summaryQuickPills.style.display = "none";
      if (btnOpenAddContract) btnOpenAddContract.style.display = "none";
      if (btnOpenDashboardOverview) btnOpenDashboardOverview.style.display = "none";
      if (btnOpenAddBadDebt) btnOpenAddBadDebt.style.display = "inline-flex";
      if (adminSearchInput) adminSearchInput.placeholder = "ค้นหาชื่อลูกหนี้, เลขบัตรประชาชน, หรือเบอร์โทรศัพท์...";
    } else {
      if (summaryQuickPills) summaryQuickPills.style.display = "flex";
      if (btnOpenAddContract) btnOpenAddContract.style.display = "inline-flex";
      if (btnOpenDashboardOverview) btnOpenDashboardOverview.style.display = "inline-flex";
      if (btnOpenAddBadDebt) btnOpenAddBadDebt.style.display = "none";
      if (adminSearchInput) adminSearchInput.placeholder = tabName === "motorcycle"
        ? "ค้นหาชื่อลูกค้ามอไซต์, เบอร์โทรศัพท์, หรือรุ่นรถ..."
        : "ค้นหาชื่อลูกค้า, เบอร์โทรศัพท์, หรืออีเมล...";
    }

    renderStatsCounters();
    renderSubTabs();
    renderActiveTabTable();

    // Close sidebar on mobile
    if (window.innerWidth <= 900) {
      adminSidebar.classList.remove("open");
      if (sidebarBackdrop) sidebarBackdrop.classList.remove("active");
    }
  }

  // Set Sub-filter (all, paid, pending)
  function setSubFilter(subFilter) {
    currentSubFilter = subFilter;
    renderSubTabs();
    renderActiveTabTable();
  }

  // Expose to window for inline onclick handlers
  window.switchTab = switchTab;
  window.setSubFilter = setSubFilter;

  // Sidebar click listeners
  sidebarItems.forEach((item) => {
    item.addEventListener("click", () => {
      const tab = item.getAttribute("data-tab");
      if (tab) switchTab(tab);
      if (window.innerWidth <= 900) {
        adminSidebar.classList.remove("open");
        if (sidebarBackdrop) sidebarBackdrop.classList.remove("active");
      }
    });
  });

  // Action Bar Overview Button listener
  if (btnOpenDashboardOverview) {
    btnOpenDashboardOverview.addEventListener("click", () => {
      switchTab("overview");
    });
  }

  // Helper to sync single date input value and toggle active class on quick buttons
  function updatePeriodDateInputs() {
    syncPeriodDates();
    if (adminDateFilter) adminDateFilter.value = selectedDailyDate;

    const todayStr = getLocalDateStr();
    if (btnDateToday) {
      btnDateToday.classList.toggle("active", selectedDailyDate === todayStr);
    }
  }

  // อัปเดตแถบความคืบหน้าการจัดเก็บประจำช่วงเวลา (Requirement 2)
  function updateDateFilterProgress(paidCount, pendingCount) {
    const progressBar = document.getElementById("dateFilterProgressBar");
    const progressPct = document.getElementById("dateFilterProgressPct");
    const total = paidCount + pendingCount;
    const pct = total > 0 ? Math.round((paidCount / total) * 100) : 0;
    if (progressBar) {
      progressBar.style.width = `${pct}%`;
      if (pct === 100) {
        progressBar.style.background = "linear-gradient(90deg, #10b981 0%, #34d399 100%)";
        progressBar.style.boxShadow = "0 0 12px rgba(52, 211, 153, 0.8)";
      } else {
        progressBar.style.background = "linear-gradient(90deg, #10b981 0%, #34d399 100%)";
        progressBar.style.boxShadow = "0 0 8px rgba(52, 211, 153, 0.4)";
      }
    }
    if (progressPct) {
      progressPct.textContent = `${pct}%`;
      progressPct.style.color = pct === 100 ? "#34d399" : (pct > 0 ? "#6ee7b7" : "var(--text-dim)");
    }
  }

  // Date Filter Bar Event Listeners
  if (adminDateFilter) {
    adminDateFilter.value = selectedDailyDate;
    adminDateFilter.addEventListener("change", (e) => {
      selectedDailyDate = e.target.value || getLocalDateStr();
      syncPeriodDates();
      updatePeriodDateInputs();
      renderStatsCounters();
      renderSubTabs();
      renderActiveTabTable();
    });
  }

  if (btnDateToday) {
    btnDateToday.addEventListener("click", () => {
      selectedDailyDate = getLocalDateStr();
      syncPeriodDates();
      updatePeriodDateInputs();
      renderStatsCounters();
      renderSubTabs();
      renderActiveTabTable();
    });
  }

  if (btnDatePrev) {
    btnDatePrev.addEventListener("click", () => {
      selectedDailyDate = shiftDateStr(selectedDailyDate, -1);
      syncPeriodDates();
      updatePeriodDateInputs();
      renderStatsCounters();
      renderSubTabs();
      renderActiveTabTable();
    });
  }

  if (btnDateNext) {
    btnDateNext.addEventListener("click", () => {
      selectedDailyDate = shiftDateStr(selectedDailyDate, 1);
      syncPeriodDates();
      updatePeriodDateInputs();
      renderStatsCounters();
      renderSubTabs();
      renderActiveTabTable();
    });
  }

  adminSearchInput.addEventListener("input", () => {
    renderActiveTabTable();
  });

  // --- 3. STATS COUNTERS & QUICK PILLS ---

  function renderStatsCounters() {
    const statLabelFinanced = document.getElementById("statLabelFinanced");
    const statLabelCollected = document.getElementById("statLabelCollected");
    const statLabelOutstanding = document.getElementById("statLabelOutstanding");
    const statLabelCount = document.getElementById("statLabelCount");

    if (currentTab === "bad_debt") {
      if (cardStatLateFines) cardStatLateFines.style.display = "none";
      if (cardStatInterestCut) cardStatInterestCut.style.display = "none";
      if (cardStatDownPayment) cardStatDownPayment.style.display = "none";
      if (cardStatDailyAllCategories) cardStatDailyAllCategories.style.display = "none";
      if (cardStatBankReconciliation) cardStatBankReconciliation.style.display = "none";
      const allBadDebts = window.easyFinanceDB.getBadDebts ? window.easyFinanceDB.getBadDebts() : [];
      let totalBadAmount = 0;
      let badDebtCount = 0;
      let blacklistCount = 0;
      let delayedCount = 0;

      allBadDebts.forEach((b) => {
        totalBadAmount += Number(b.amount) || 0;
        if (b.category === "bad_debt") badDebtCount++;
        else if (b.category === "blacklist") blacklistCount++;
        else if (b.category === "delayed") delayedCount++;
      });

      if (statLabelFinanced) statLabelFinanced.textContent = "ยอดหนี้เสียคงค้างรวม";
      if (statLabelCollected) statLabelCollected.textContent = "จำนวนลูกหนี้เสีย (NPL)";
      if (statLabelOutstanding) statLabelOutstanding.textContent = "ติดสถานะแบล็คลิส";
      if (statLabelCount) statLabelCount.textContent = "ประวัติผ่อนล่าช้า";

      statTotalFinanced.textContent = `฿${totalBadAmount.toLocaleString()}`;
      statTotalCollected.textContent = `${badDebtCount} ราย`;
      statTotalOutstanding.textContent = `${blacklistCount} ราย`;
      statContractsCount.textContent = `${delayedCount} ราย`;
      return;
    }

    if (cardStatLateFines) cardStatLateFines.style.display = "";
    if (cardStatMotorcycle) cardStatMotorcycle.style.display = "";
    if (cardStatInterestCut) cardStatInterestCut.style.display = "";
    if (cardStatDownPayment) cardStatDownPayment.style.display = "";
    if (cardStatDailyAllCategories) cardStatDailyAllCategories.style.display = "";
    if (cardStatBankReconciliation) cardStatBankReconciliation.style.display = "";

    const contracts = window.easyFinanceDB.getContracts();
    let totalFinanced = 0;
    let totalCollected = 0;
    let totalOutstanding = 0;
    let totalLateFinesCollected = 0;
    let totalLateFinesPending = 0;

    let totalMotorcycleFinanced = 0;
    let totalMotorcycleCollected = 0;
    let totalMotorcycleOutstanding = 0;
    let motorcycleContractsCount = 0;

    let totalInterestCutCollected = 0;
    let totalInterestCutCount = 0;

    let totalDownPaymentCollected = 0;
    let totalDownPaymentCount = 0;

    contracts.forEach((c) => {
      const downPayment = Number(c.downPayment) || 0;
      const totalAmount = Number(c.totalAmount) || 0;
      const installments = c.installments || [];
      const contractPaidAmount = installments
        .filter((inst) => inst.status === "paid" && !inst.isPrincipalInterestCut)
        .reduce((sum, inst) => sum + (Number(inst.amount) || 0), 0);
      const contractOutstanding = Math.max(0, totalAmount - contractPaidAmount);

      // Requirement: หมวดรถมอไซต์ ไม่ต้องยกยอดไปรวมกับยอดปล่อยสินเชื่อรวม ให้แยกยอดออกมาต่างหาก
      // และแยกเงินดาวน์ออก ไม่ต้องรวมกับช่องอื่น เหมือนกันกับ ยอดรวมตัดดอก
      if (isMotorcycleContract(c)) {
        totalMotorcycleFinanced += totalAmount;
        totalMotorcycleCollected += contractPaidAmount;
        totalMotorcycleOutstanding += contractOutstanding;
        motorcycleContractsCount++;
      } else {
        // ยอดปล่อยสินเชื่อทั่วไป (ไม่รวมมอไซต์)
        totalFinanced += totalAmount;
        totalCollected += contractPaidAmount;
        totalOutstanding += contractOutstanding;
      }

      // ช่องรวมเงินดาวน์: รวมเงินดาวน์แยกต่างหาก
      if (downPayment > 0) {
        totalDownPaymentCollected += downPayment;
        totalDownPaymentCount++;
      }

      // Requirement 4: คำนวณยอดค่าปรับแยกต่างหาก ไม่รวมกับยอดปล่อยสินเชื่อรวม
      const contractCollectedFine = Number(c.totalLateFinesCollected) || 0;
      let instCollectedFine = 0;
      installments.forEach((inst) => {
        if (inst.paidLateFine) instCollectedFine += Number(inst.paidLateFine) || 0;
      });
      totalLateFinesCollected += Math.max(contractCollectedFine, instCollectedFine);
      totalLateFinesPending += Number(c.lateFine) || 0;

      // Requirement 3.3: คำนวณยอดตัดดอกแยกต่างหาก ไม่รวมกับยอดปล่อยสินเชื่อรวม-ยอดเก็บเงินได้แล้ว-ยอดคงค้างรอเก็บ
      if (Array.isArray(c.interestCutHistory)) {
        c.interestCutHistory.forEach((h) => {
          totalInterestCutCollected += Number(h.amount) || 0;
          totalInterestCutCount++;
        });
      }
      installments.forEach((inst) => {
        if (inst.status === "interest_only") {
          const inHist = (c.interestCutHistory || []).some(
            (h) => Number(h.installmentNo) === Number(inst.installmentNo)
          );
          if (!inHist) {
            totalInterestCutCollected += Number(inst.interestAmount) || 0;
            totalInterestCutCount++;
          }
        }
      });
    });

    const isManager = isManagerLoggedIn();
    const dailyStats = getCategoryStats("daily");
    const weeklyStats = getCategoryStats("weekly");
    const monthlyStats = getCategoryStats("monthly");

    // หากเปิดอยู่ในหน้าสรุปหมวดรถมอไซต์ ปรับหัวการ์ด 4 ใบด้านบนให้แสดงยอดเฉพาะหมวดรถมอไซต์
    if (currentTab === "motorcycle") {
      if (statLabelFinanced) statLabelFinanced.textContent = "ยอดปล่อยมอไซต์รวม";
      if (statLabelCollected) statLabelCollected.textContent = "ยอดเก็บได้แล้ว (มอไซต์)";
      if (statLabelOutstanding) statLabelOutstanding.textContent = "ยอดคงค้างรอเก็บ (มอไซต์)";
      if (statLabelCount) statLabelCount.textContent = "สัญญามอไซต์ทั้งหมด";

      if (isManager) {
        statTotalFinanced.textContent = `฿${totalMotorcycleFinanced.toLocaleString()}`;
        statTotalFinanced.classList.remove("masked-stat-text");
        statTotalCollected.textContent = `฿${totalMotorcycleCollected.toLocaleString()}`;
        statTotalCollected.classList.remove("masked-stat-text");
        statTotalOutstanding.textContent = `฿${totalMotorcycleOutstanding.toLocaleString()}`;
        statTotalOutstanding.classList.remove("masked-stat-text");
      } else {
        statTotalFinanced.textContent = "฿******";
        statTotalFinanced.classList.add("masked-stat-text");
        statTotalCollected.textContent = "฿******";
        statTotalCollected.classList.add("masked-stat-text");
        statTotalOutstanding.textContent = "฿******";
        statTotalOutstanding.classList.add("masked-stat-text");
      }
      statContractsCount.textContent = motorcycleContractsCount;
    } else {
      if (statLabelFinanced) statLabelFinanced.textContent = "ยอดปล่อยสินเชื่อรวม";
      if (statLabelCollected) statLabelCollected.textContent = "ยอดเก็บเงินได้แล้ว";
      if (statLabelOutstanding) statLabelOutstanding.textContent = "ยอดคงค้างรอเก็บ";
      if (statLabelCount) statLabelCount.textContent = "สัญญาทั่วไป (ไม่รวมมอไซต์)";

      const generalContractsCount = contracts.length - motorcycleContractsCount;

      if (isManager) {
        statTotalFinanced.textContent = `฿${totalFinanced.toLocaleString()}`;
        statTotalFinanced.classList.remove("masked-stat-text");
        statTotalCollected.textContent = `฿${totalCollected.toLocaleString()}`;
        statTotalCollected.classList.remove("masked-stat-text");
        statTotalOutstanding.textContent = `฿${totalOutstanding.toLocaleString()}`;
        statTotalOutstanding.classList.remove("masked-stat-text");
      } else {
        statTotalFinanced.textContent = "฿******";
        statTotalFinanced.classList.add("masked-stat-text");
        statTotalCollected.textContent = "฿******";
        statTotalCollected.classList.add("masked-stat-text");
        statTotalOutstanding.textContent = "฿******";
        statTotalOutstanding.classList.add("masked-stat-text");
      }
      statContractsCount.textContent = generalContractsCount;
    }

    const totalLateFinesAll = totalLateFinesCollected + totalLateFinesPending;

    if (isManager) {
      if (statTotalLateFines) {
        statTotalLateFines.textContent = `฿${totalLateFinesAll.toLocaleString()}`;
        statTotalLateFines.classList.remove("masked-stat-text");
      }
      if (statLateFinesSub) {
        if (totalLateFinesPending > 0) {
          statLateFinesSub.textContent = `เก็บได้ ฿${totalLateFinesCollected.toLocaleString()} (ค้าง ฿${totalLateFinesPending.toLocaleString()})`;
        } else {
          statLateFinesSub.textContent = `ยอดค่าปรับที่เก็บได้ทั้งหมด`;
        }
      }
      if (quickPillLateFine) {
        quickPillLateFine.textContent = `฿${totalLateFinesAll.toLocaleString()}`;
        quickPillLateFine.classList.remove("masked-stat-text");
      }

      // ช่องยอดรวมมอไซต์ (Requirement: แยกยอดออกมาต่างหากใส่ในช่องยอดรวมมอไซต์)
      if (statTotalMotorcycle) {
        statTotalMotorcycle.textContent = `฿${totalMotorcycleFinanced.toLocaleString()}`;
        statTotalMotorcycle.classList.remove("masked-stat-text");
      }
      if (statMotorcycleSub) {
        statMotorcycleSub.textContent = `เก็บได้ ฿${totalMotorcycleCollected.toLocaleString()} (${motorcycleContractsCount} สัญญา)`;
      }

      // ช่องยอดรวมตัดดอก (Requirement 3.3: แสดงยอดตัดดอกรวมแยกต่างหาก)
      if (statTotalInterestCut) {
        statTotalInterestCut.textContent = `฿${totalInterestCutCollected.toLocaleString()}`;
        statTotalInterestCut.classList.remove("masked-stat-text");
      }
      if (statInterestCutSub) {
        statInterestCutSub.textContent = `ตัดดอก ${totalInterestCutCount} รายการ (คลิกดูสรุปต่อวัน)`;
      }

      // ช่องรวมเงินดาวน์ (แยกต่างหาก ไม่ต้องรวมกับช่องอื่น เหมือนกันกับ ยอดรวมตัดดอก)
      if (statTotalDownPayment) {
        statTotalDownPayment.textContent = `฿${totalDownPaymentCollected.toLocaleString()}`;
        statTotalDownPayment.classList.remove("masked-stat-text");
      }
      if (statDownPaymentSub) {
        statDownPaymentSub.textContent = `เงินดาวน์ ${totalDownPaymentCount} รายการ (คลิกดูสรุปต่อวัน)`;
      }

      // ช่องสรุปรวมต่อวัน (รวมยอดรับแล้วของทุกหมวดประจำวัน: รายวัน รายอาทิตย์ รายเดือน รถมอเตอร์ไซค์ และตัดดอก)
      const allDailyCollected = window.easyFinanceDB.getAllDailyAllCategoriesHistory ? window.easyFinanceDB.getAllDailyAllCategoriesHistory() : [];
      const todayStr = getLocalDateStr();
      const todayCollectedList = allDailyCollected.filter((h) => (h.dateStr && h.dateStr === todayStr) || (h.paidAt && h.paidAt.includes(todayStr)));
      const todayTotalAmount = todayCollectedList.reduce((sum, h) => sum + (Number(h.amount) || 0), 0);

      if (statTotalDailyAllCategories) {
        statTotalDailyAllCategories.textContent = `฿${todayTotalAmount.toLocaleString()}`;
        statTotalDailyAllCategories.classList.remove("masked-stat-text");
      }
      if (statDailyAllCategoriesSub) {
        statDailyAllCategoriesSub.textContent = `รับแล้ววันนี้ 5 หมวด (รวมตัดดอก): ${todayCollectedList.length} รายการ (คลิกดูสรุปต่อวัน)`;
      }

      // ช่องเปรียบเทียบยอดในบัญชี (Bank Reconciliation: เงินในธนาคาร + ยอดรวมเข้ามาวันนี้ ยกเว้นเงินดาวน์)
      const reconData = window.easyFinanceDB.getBankReconciliationData ? window.easyFinanceDB.getBankReconciliationData() : { baseBalance: 0, adjustments: [] };
      const bankBase = Number(reconData.baseBalance) || 0;
      const totalNetAdj = (reconData.adjustments || []).reduce((sum, a) => {
        if (a.cleared || a.isSystemClear || a.type === "clear" || a.type === "recon_apply") return sum;
        const amt = Number(a.amount) || 0;
        return a.type === "deduct" ? sum - amt : sum + amt;
      }, 0);
      const currentBankBalance = Math.max(0, bankBase + totalNetAdj);
      const totalReconciled = currentBankBalance + todayTotalAmount;

      if (statTotalBankReconciliation) {
        statTotalBankReconciliation.textContent = `฿${totalReconciled.toLocaleString()}`;
        statTotalBankReconciliation.classList.remove("masked-stat-text");
      }
      if (statBankReconciliationSub) {
        statBankReconciliationSub.textContent = `เงินธนาคาร ฿${currentBankBalance.toLocaleString()} + รับวันนี้ ฿${todayTotalAmount.toLocaleString()}`;
      }

      if (quickPillDaily) {
        quickPillDaily.textContent = `฿${(dailyStats.totalFinanced || 0).toLocaleString()}`;
        quickPillDaily.classList.remove("masked-stat-text");
      }
      if (quickPillWeekly) {
        quickPillWeekly.textContent = `฿${(weeklyStats.totalFinanced || 0).toLocaleString()}`;
        quickPillWeekly.classList.remove("masked-stat-text");
      }
      if (quickPillMonthly) {
        quickPillMonthly.textContent = `฿${(monthlyStats.totalFinanced || 0).toLocaleString()}`;
        quickPillMonthly.classList.remove("masked-stat-text");
      }
      if (quickPillMotorcycle) {
        quickPillMotorcycle.textContent = `฿${totalMotorcycleFinanced.toLocaleString()}`;
        quickPillMotorcycle.classList.remove("masked-stat-text");
      }
    } else {
      // Requirement 5: รหัสพนักงานที่ login จะเห็นเป็น *
      if (statTotalLateFines) {
        statTotalLateFines.textContent = "฿******";
        statTotalLateFines.classList.add("masked-stat-text");
      }
      if (statLateFinesSub) {
        statLateFinesSub.textContent = "เฉพาะสิทธิ์หัวหน้าเท่านั้น";
      }
      if (quickPillLateFine) {
        quickPillLateFine.textContent = "฿******";
        quickPillLateFine.classList.add("masked-stat-text");
      }
      if (statTotalMotorcycle) {
        statTotalMotorcycle.textContent = "฿******";
        statTotalMotorcycle.classList.add("masked-stat-text");
      }
      if (statMotorcycleSub) {
        statMotorcycleSub.textContent = "เฉพาะสิทธิ์หัวหน้าเท่านั้น";
      }
      if (statTotalInterestCut) {
        statTotalInterestCut.textContent = "฿******";
        statTotalInterestCut.classList.add("masked-stat-text");
      }
      if (statInterestCutSub) {
        statInterestCutSub.textContent = "เฉพาะสิทธิ์หัวหน้าเท่านั้น";
      }

      // ช่องรวมเงินดาวน์ปิดเป็น * สำหรับพนักงาน
      if (statTotalDownPayment) {
        statTotalDownPayment.textContent = "฿******";
        statTotalDownPayment.classList.add("masked-stat-text");
      }
      if (statDownPaymentSub) {
        statDownPaymentSub.textContent = "เฉพาะสิทธิ์หัวหน้าเท่านั้น";
      }

      // ช่องสรุปรวมต่อวันปิดเป็น * สำหรับพนักงาน
      if (statTotalDailyAllCategories) {
        statTotalDailyAllCategories.textContent = "฿******";
        statTotalDailyAllCategories.classList.add("masked-stat-text");
      }
      if (statDailyAllCategoriesSub) {
        statDailyAllCategoriesSub.textContent = "เฉพาะสิทธิ์หัวหน้าเท่านั้น";
      }

      // ช่องเปรียบเทียบยอดในบัญชีปิดเป็น * สำหรับพนักงาน
      if (statTotalBankReconciliation) {
        statTotalBankReconciliation.textContent = "฿******";
        statTotalBankReconciliation.classList.add("masked-stat-text");
      }
      if (statBankReconciliationSub) {
        statBankReconciliationSub.textContent = "เฉพาะสิทธิ์หัวหน้าเท่านั้น";
      }

      // ช่องยอดรวมมอไซต์ปิดเป็น * สำหรับพนักงาน
      if (statTotalMotorcycle) {
        statTotalMotorcycle.textContent = "฿******";
        statTotalMotorcycle.classList.add("masked-stat-text");
      }
      if (statMotorcycleSub) {
        statMotorcycleSub.textContent = "เฉพาะสิทธิ์หัวหน้าเท่านั้น";
      }

      if (quickPillDaily) {
        quickPillDaily.textContent = "฿******";
        quickPillDaily.classList.add("masked-stat-text");
      }
      if (quickPillWeekly) {
        quickPillWeekly.textContent = "฿******";
        quickPillWeekly.classList.add("masked-stat-text");
      }
      if (quickPillMonthly) {
        quickPillMonthly.textContent = "฿******";
        quickPillMonthly.classList.add("masked-stat-text");
      }
      if (quickPillMotorcycle) {
        quickPillMotorcycle.textContent = "฿******";
        quickPillMotorcycle.classList.add("masked-stat-text");
      }
    }

    if (motorcycleCountBadge) {
      motorcycleCountBadge.textContent = motorcycleContractsCount;
    }
  }

  // --- 3.1 RENDER DASHBOARD OVERVIEW CARDS (Requirement 3.1) ---

  function renderOverviewCards() {
    if (!overviewCardsGrid) return;

    const dailyStats = getCategoryStats("daily");
    const weeklyStats = getCategoryStats("weekly");
    const monthlyStats = getCategoryStats("monthly");

    overviewCardsGrid.innerHTML = `
      <!-- 1. การ์ดสรุปยอดรวมรายวัน -->
      <div class="overview-summary-card card-daily-theme">
        <div class="overview-card-header">
          <div class="overview-card-header-left">
            <div class="overview-card-icon">
              <i class="fa-solid fa-calendar-day"></i>
            </div>
            <div>
              <div class="overview-card-title">ยอดรวมรายวัน</div>
              <div class="overview-card-sub">Daily Overview</div>
            </div>
          </div>
          <span class="overview-card-badge badge-daily">รายวัน</span>
        </div>

        <div class="overview-hero-amount">
          ฿${dailyStats.totalFinanced.toLocaleString()}
          <small>ยอดสินเชื่อรวม</small>
        </div>

        <div class="overview-metrics-grid">
          <div class="overview-metric-item">
            <span class="overview-metric-label">เก็บได้แล้ว</span>
            <span class="overview-metric-val" style="color: #34d399;">฿${dailyStats.totalCollected.toLocaleString()} (${dailyStats.collectionRate}%)</span>
          </div>
          <div class="overview-metric-item">
            <span class="overview-metric-label">คงค้างรอเก็บ</span>
            <span class="overview-metric-val" style="color: #fbbf24;">฿${dailyStats.totalOutstanding.toLocaleString()}</span>
          </div>
        </div>

        <div class="overview-status-pills">
          <span><i class="fa-solid fa-users"></i> ทั้งหมด <strong>${dailyStats.contractsCount}</strong> ราย</span>
          <span style="color: #34d399;"><i class="fa-solid fa-circle-check"></i> จ่ายแล้ว <strong>${dailyStats.paidCustomersCount}</strong></span>
          <span style="color: #f87171;"><i class="fa-solid fa-clock"></i> ค้างจ่าย <strong>${dailyStats.pendingCustomersCount}</strong></span>
        </div>

        <div class="progress-track" style="height: 6px;">
          <div class="progress-bar-fill" style="width: ${dailyStats.collectionRate}%; background: #10b981;"></div>
        </div>

        <div class="overview-card-actions">
          <button class="btn-overview-action" onclick="switchTab('daily')">
            <i class="fa-solid fa-table-list"></i> ดูลูกค้ารายวัน (${dailyStats.contractsCount})
          </button>
          <button class="btn-overview-action" style="color: #f87171; border-color: rgba(248, 113, 113, 0.3);" onclick="switchTab('daily'); setSubFilter('pending');">
            <i class="fa-solid fa-triangle-exclamation"></i> ค้างจ่าย (${dailyStats.pendingCustomersCount})
          </button>
        </div>
      </div>

      <!-- 2. การ์ดสรุปยอดรวมรายอาทิตย์ -->
      <div class="overview-summary-card card-weekly-theme">
        <div class="overview-card-header">
          <div class="overview-card-header-left">
            <div class="overview-card-icon">
              <i class="fa-solid fa-calendar-week"></i>
            </div>
            <div>
              <div class="overview-card-title">ยอดรวมรายอาทิตย์</div>
              <div class="overview-card-sub">Weekly Overview</div>
            </div>
          </div>
          <span class="overview-card-badge badge-weekly">รายอาทิตย์</span>
        </div>

        <div class="overview-hero-amount">
          ฿${weeklyStats.totalFinanced.toLocaleString()}
          <small>ยอดสินเชื่อรวม</small>
        </div>

        <div class="overview-metrics-grid">
          <div class="overview-metric-item">
            <span class="overview-metric-label">เก็บได้แล้ว</span>
            <span class="overview-metric-val" style="color: #60a5fa;">฿${weeklyStats.totalCollected.toLocaleString()} (${weeklyStats.collectionRate}%)</span>
          </div>
          <div class="overview-metric-item">
            <span class="overview-metric-label">คงค้างรอเก็บ</span>
            <span class="overview-metric-val" style="color: #fbbf24;">฿${weeklyStats.totalOutstanding.toLocaleString()}</span>
          </div>
        </div>

        <div class="overview-status-pills">
          <span><i class="fa-solid fa-users"></i> ทั้งหมด <strong>${weeklyStats.contractsCount}</strong> ราย</span>
          <span style="color: #60a5fa;"><i class="fa-solid fa-circle-check"></i> จ่ายแล้ว <strong>${weeklyStats.paidCustomersCount}</strong></span>
          <span style="color: #f87171;"><i class="fa-solid fa-clock"></i> ค้างจ่าย <strong>${weeklyStats.pendingCustomersCount}</strong></span>
        </div>

        <div class="progress-track" style="height: 6px;">
          <div class="progress-bar-fill" style="width: ${weeklyStats.collectionRate}%; background: #3b82f6;"></div>
        </div>

        <div class="overview-card-actions">
          <button class="btn-overview-action" onclick="switchTab('weekly')">
            <i class="fa-solid fa-table-list"></i> ดูลูกค้ารายอาทิตย์ (${weeklyStats.contractsCount})
          </button>
          <button class="btn-overview-action" style="color: #f87171; border-color: rgba(248, 113, 113, 0.3);" onclick="switchTab('weekly'); setSubFilter('pending');">
            <i class="fa-solid fa-triangle-exclamation"></i> ค้างจ่าย (${weeklyStats.pendingCustomersCount})
          </button>
        </div>
      </div>

      <!-- 3. การ์ดสรุปยอดรวมรายเดือน -->
      <div class="overview-summary-card card-monthly-theme">
        <div class="overview-card-header">
          <div class="overview-card-header-left">
            <div class="overview-card-icon">
              <i class="fa-solid fa-calendar-days"></i>
            </div>
            <div>
              <div class="overview-card-title">ยอดรวมรายเดือน</div>
              <div class="overview-card-sub">Monthly Overview</div>
            </div>
          </div>
          <span class="overview-card-badge badge-monthly">รายเดือน</span>
        </div>

        <div class="overview-hero-amount">
          ฿${monthlyStats.totalFinanced.toLocaleString()}
          <small>ยอดสินเชื่อรวม</small>
        </div>

        <div class="overview-metrics-grid">
          <div class="overview-metric-item">
            <span class="overview-metric-label">เก็บได้แล้ว</span>
            <span class="overview-metric-val" style="color: #c084fc;">฿${monthlyStats.totalCollected.toLocaleString()} (${monthlyStats.collectionRate}%)</span>
          </div>
          <div class="overview-metric-item">
            <span class="overview-metric-label">คงค้างรอเก็บ</span>
            <span class="overview-metric-val" style="color: #fbbf24;">฿${monthlyStats.totalOutstanding.toLocaleString()}</span>
          </div>
        </div>

        <div class="overview-status-pills">
          <span><i class="fa-solid fa-users"></i> ทั้งหมด <strong>${monthlyStats.contractsCount}</strong> ราย</span>
          <span style="color: #c084fc;"><i class="fa-solid fa-circle-check"></i> จ่ายแล้ว <strong>${monthlyStats.paidCustomersCount}</strong></span>
          <span style="color: #f87171;"><i class="fa-solid fa-clock"></i> ค้างจ่าย <strong>${monthlyStats.pendingCustomersCount}</strong></span>
        </div>

        <div class="progress-track" style="height: 6px;">
          <div class="progress-bar-fill" style="width: ${monthlyStats.collectionRate}%; background: #a855f7;"></div>
        </div>

        <div class="overview-card-actions">
          <button class="btn-overview-action" onclick="switchTab('monthly')">
            <i class="fa-solid fa-table-list"></i> ดูลูกค้ารายเดือน (${monthlyStats.contractsCount})
          </button>
          <button class="btn-overview-action" style="color: #f87171; border-color: rgba(248, 113, 113, 0.3);" onclick="switchTab('monthly'); setSubFilter('pending');">
            <i class="fa-solid fa-triangle-exclamation"></i> ค้างจ่าย (${monthlyStats.pendingCustomersCount})
          </button>
        </div>
      </div>

      <!-- 4. การ์ดสรุปยอดรวมหมวดรถมอไซต์ (แยกต่างหาก) -->
      <div class="overview-summary-card card-motorcycle-theme" style="border: 1px solid rgba(56, 189, 248, 0.35);">
        <div class="overview-card-header">
          <div class="overview-card-header-left">
            <div class="overview-card-icon" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3);">
              <i class="fa-solid fa-motorcycle"></i>
            </div>
            <div>
              <div class="overview-card-title" style="color: #38bdf8;">ยอดรวมหมวดรถมอไซต์</div>
              <div class="overview-card-sub">Motorcycle Overview (ยอดแยกต่างหาก)</div>
            </div>
          </div>
          <span class="overview-card-badge" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4);">หมวดมอไซต์</span>
        </div>

        <div class="overview-hero-amount" style="color: #38bdf8;">
          ฿${getMotorcycleStats().totalFinanced.toLocaleString()}
          <small>ยอดสินเชื่อมอไซต์รวม</small>
        </div>

        <div class="overview-metrics-grid">
          <div class="overview-metric-item">
            <span class="overview-metric-label">เก็บได้แล้ว</span>
            <span class="overview-metric-val" style="color: #38bdf8;">฿${getMotorcycleStats().totalCollected.toLocaleString()} (${getMotorcycleStats().collectionRate}%)</span>
          </div>
          <div class="overview-metric-item">
            <span class="overview-metric-label">คงค้างรอเก็บ</span>
            <span class="overview-metric-val" style="color: #fbbf24;">฿${getMotorcycleStats().totalOutstanding.toLocaleString()}</span>
          </div>
        </div>

        <div class="overview-status-pills">
          <span><i class="fa-solid fa-motorcycle"></i> ทั้งหมด <strong>${getMotorcycleStats().contractsCount}</strong> คัน</span>
          <span style="color: #34d399;"><i class="fa-solid fa-circle-check"></i> ปิดสัญญา <strong>${getMotorcycleStats().paidCustomersCount}</strong></span>
          <span style="color: #fbbf24;"><i class="fa-solid fa-clock"></i> ผ่อนอยู่ <strong>${getMotorcycleStats().pendingCustomersCount}</strong></span>
        </div>

        <div class="progress-track" style="height: 6px;">
          <div class="progress-bar-fill" style="width: ${getMotorcycleStats().collectionRate}%; background: linear-gradient(90deg, #38bdf8 0%, #0ea5e9 100%);"></div>
        </div>

        <div class="overview-card-actions">
          <button class="btn-overview-action" style="color: #38bdf8; border-color: rgba(56, 189, 248, 0.35);" onclick="switchTab('motorcycle')">
            <i class="fa-solid fa-motorcycle"></i> ดูสัญญามอไซต์ (${getMotorcycleStats().contractsCount})
          </button>
          <button class="btn-overview-action" style="color: #fbbf24; border-color: rgba(251, 191, 36, 0.35);" onclick="switchTab('motorcycle'); setSubFilter('pending');">
            <i class="fa-solid fa-clock"></i> ผ่อนอยู่ (${getMotorcycleStats().pendingCustomersCount})
          </button>
        </div>
      </div>
    `;
  }

  // --- 3.2 RENDER DYNAMIC SUB-TABS (Requirement 1 & 2) ---

  function renderSubTabs() {
    if (!adminSubTabNav) return;

    const dailyStats = getCategoryStats("daily");
    const weeklyStats = getCategoryStats("weekly");
    const monthlyStats = getCategoryStats("monthly");
    const allContracts = window.easyFinanceDB.getContracts();
    const completedContractsCount = allContracts.filter(
      (c) => (c.installments || []).length > 0 && (c.installments || []).every((i) => i.status === "paid")
    ).length;
    const activeContractsCount = allContracts.length - completedContractsCount;

    const dateDisplay = formatDateThai(selectedDailyDate);

    if (currentTab === "daily") {
      const allDailyContracts = allContracts.filter((c) => c.paymentFrequency === "daily" && !isMotorcycleContract(c));
      let paidCount = 0;
      let pendingCount = 0;
      let fineCount = 0;
      let allCount = 0;
      allDailyContracts.forEach((c) => {
        const st = getDailyStatusForDate(c, selectedDailyDate).status;
        if (st === "paid") {
          paidCount++;
          allCount++;
        } else if (st === "pending") {
          pendingCount++;
          allCount++;
        }
        if (Number(c.lateFine) > 0) {
          fineCount++;
        }
      });
      adminSubTabNav.innerHTML = `
        <button class="tab-btn ${currentSubFilter === "all" ? "active" : ""}" onclick="setSubFilter('all')">
          <i class="fa-solid fa-users"></i>
          <span>ลูกค้าทั้งหมดของรายวัน</span>
          <span class="tab-count-badge">${allCount}</span>
        </button>
        <button class="tab-btn ${currentSubFilter === "paid" ? "active" : ""}" onclick="setSubFilter('paid')">
          <i class="fa-solid fa-circle-check" style="color: #34d399;"></i>
          <span>จ่ายแล้ว (${dateDisplay})</span>
          <span class="tab-count-badge">${paidCount}</span>
        </button>
        <button class="tab-btn ${currentSubFilter === "pending" ? "active" : ""}" onclick="setSubFilter('pending')">
          <i class="fa-solid fa-clock" style="color: #fbbf24;"></i>
          <span>ค้างจ่าย (${dateDisplay})</span>
          <span class="tab-count-badge">${pendingCount}</span>
        </button>
        ${fineCount > 0 ? `
        <button class="tab-btn ${currentSubFilter === "fine" ? "active" : ""}" onclick="setSubFilter('fine')">
          <i class="fa-solid fa-triangle-exclamation" style="color: #fb923c;"></i>
          <span>มีค่าปรับ</span>
          <span class="tab-count-badge" style="background: rgba(251, 146, 60, 0.25); color: #fb923c;">${fineCount}</span>
        </button>` : ""}
      `;
    } else if (currentTab === "weekly") {
      const allWeeklyContracts = allContracts.filter((c) => c.paymentFrequency === "weekly" && !isMotorcycleContract(c));
      let paidCount = 0;
      let pendingCount = 0;
      let fineCount = 0;
      let allCount = 0;
      allWeeklyContracts.forEach((c) => {
        const st = getDailyStatusForDate(c, selectedDailyDate).status;
        if (st === "paid") {
          paidCount++;
          allCount++;
        } else if (st === "pending") {
          pendingCount++;
          allCount++;
        }
        if (Number(c.lateFine) > 0) {
          fineCount++;
        }
      });
      adminSubTabNav.innerHTML = `
        <button class="tab-btn ${currentSubFilter === "all" ? "active" : ""}" onclick="setSubFilter('all')">
          <i class="fa-solid fa-users"></i>
          <span>ลูกค้าทั้งหมดของรายอาทิตย์</span>
          <span class="tab-count-badge">${allCount}</span>
        </button>
        <button class="tab-btn ${currentSubFilter === "paid" ? "active" : ""}" onclick="setSubFilter('paid')">
          <i class="fa-solid fa-circle-check" style="color: #60a5fa;"></i>
          <span>จ่ายแล้ว (${dateDisplay})</span>
          <span class="tab-count-badge">${paidCount}</span>
        </button>
        <button class="tab-btn ${currentSubFilter === "pending" ? "active" : ""}" onclick="setSubFilter('pending')">
          <i class="fa-solid fa-clock" style="color: #fbbf24;"></i>
          <span>ค้างจ่าย (${dateDisplay})</span>
          <span class="tab-count-badge">${pendingCount}</span>
        </button>
        ${fineCount > 0 ? `
        <button class="tab-btn ${currentSubFilter === "fine" ? "active" : ""}" onclick="setSubFilter('fine')">
          <i class="fa-solid fa-triangle-exclamation" style="color: #fb923c;"></i>
          <span>มีค่าปรับ</span>
          <span class="tab-count-badge" style="background: rgba(251, 146, 60, 0.25); color: #fb923c;">${fineCount}</span>
        </button>` : ""}
      `;
    } else if (currentTab === "monthly") {
      const allMonthlyContracts = allContracts.filter((c) => c.paymentFrequency === "monthly" && !isMotorcycleContract(c));
      let paidCount = 0;
      let pendingCount = 0;
      let fineCount = 0;
      let allCount = 0;
      allMonthlyContracts.forEach((c) => {
        const st = getDailyStatusForDate(c, selectedDailyDate).status;
        if (st === "paid") {
          paidCount++;
          allCount++;
        } else if (st === "pending") {
          pendingCount++;
          allCount++;
        }
        if (Number(c.lateFine) > 0) {
          fineCount++;
        }
      });
      adminSubTabNav.innerHTML = `
        <button class="tab-btn ${currentSubFilter === "all" ? "active" : ""}" onclick="setSubFilter('all')">
          <i class="fa-solid fa-users"></i>
          <span>ลูกค้าทั้งหมดของรายเดือน</span>
          <span class="tab-count-badge">${allCount}</span>
        </button>
        <button class="tab-btn ${currentSubFilter === "paid" ? "active" : ""}" onclick="setSubFilter('paid')">
          <i class="fa-solid fa-circle-check" style="color: #c084fc;"></i>
          <span>จ่ายแล้ว (${dateDisplay})</span>
          <span class="tab-count-badge">${paidCount}</span>
        </button>
        <button class="tab-btn ${currentSubFilter === "pending" ? "active" : ""}" onclick="setSubFilter('pending')">
          <i class="fa-solid fa-clock" style="color: #fbbf24;"></i>
          <span>ค้างจ่าย (${dateDisplay})</span>
          <span class="tab-count-badge">${pendingCount}</span>
        </button>
        ${fineCount > 0 ? `
        <button class="tab-btn ${currentSubFilter === "fine" ? "active" : ""}" onclick="setSubFilter('fine')">
          <i class="fa-solid fa-triangle-exclamation" style="color: #fb923c;"></i>
          <span>มีค่าปรับ</span>
          <span class="tab-count-badge" style="background: rgba(251, 146, 60, 0.25); color: #fb923c;">${fineCount}</span>
        </button>` : ""}
      `;
    } else if (currentTab === "overview") {
      adminSubTabNav.innerHTML = `
        <button class="tab-btn ${currentSubFilter === "all" ? "active" : ""}" onclick="setSubFilter('all')">
          <i class="fa-solid fa-chart-pie"></i>
          <span>สัญญาทั้งหมด</span>
          <span class="tab-count-badge">${allContracts.length}</span>
        </button>
        <button class="tab-btn" onclick="switchTab('daily')">
          <i class="fa-solid fa-calendar-day" style="color: #10b981;"></i>
          <span>รายวัน</span>
          <span class="tab-count-badge">${dailyStats.contractsCount}</span>
        </button>
        <button class="tab-btn" onclick="switchTab('weekly')">
          <i class="fa-solid fa-calendar-week" style="color: #3b82f6;"></i>
          <span>รายอาทิตย์</span>
          <span class="tab-count-badge">${weeklyStats.contractsCount}</span>
        </button>
        <button class="tab-btn" onclick="switchTab('monthly')">
          <i class="fa-solid fa-calendar-days" style="color: #a855f7;"></i>
          <span>รายเดือน</span>
          <span class="tab-count-badge">${monthlyStats.contractsCount}</span>
        </button>
        <button class="tab-btn" onclick="switchTab('motorcycle')">
          <i class="fa-solid fa-motorcycle" style="color: #38bdf8;"></i>
          <span>หมวดมอไซต์</span>
          <span class="tab-count-badge" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8;">${getMotorcycleStats().contractsCount}</span>
        </button>
      `;
    } else if (currentTab === "bad_debt") {
      const allBadDebts = window.easyFinanceDB.getBadDebts ? window.easyFinanceDB.getBadDebts() : [];
      const badDebtCount = allBadDebts.filter((b) => b.category === "bad_debt").length;
      const blacklistCount = allBadDebts.filter((b) => b.category === "blacklist").length;
      const delayedCount = allBadDebts.filter((b) => b.category === "delayed").length;

      if (badDebtBadgeCount) {
        badDebtBadgeCount.textContent = allBadDebts.length;
        badDebtBadgeCount.style.display = allBadDebts.length > 0 ? "inline-flex" : "none";
      }

      adminSubTabNav.innerHTML = `
        <button class="tab-btn ${currentSubFilter === "all" ? "active" : ""}" onclick="setSubFilter('all')">
          <i class="fa-solid fa-list-ul"></i>
          <span>ทั้งหมด</span>
          <span class="tab-count-badge">${allBadDebts.length}</span>
        </button>
        <button class="tab-btn ${currentSubFilter === "bad_debt" ? "active" : ""}" onclick="setSubFilter('bad_debt')">
          <i class="fa-solid fa-circle-exclamation" style="color: #f87171;"></i>
          <span>หนี้เสีย</span>
          <span class="tab-count-badge" style="background: rgba(239, 68, 68, 0.25); color: #fca5a5;">${badDebtCount}</span>
        </button>
        <button class="tab-btn ${currentSubFilter === "blacklist" ? "active" : ""}" onclick="setSubFilter('blacklist')">
          <i class="fa-solid fa-ban" style="color: #fb923c;"></i>
          <span>แบล็คลิส</span>
          <span class="tab-count-badge" style="background: rgba(249, 115, 22, 0.25); color: #fdba74;">${blacklistCount}</span>
        </button>
        <button class="tab-btn ${currentSubFilter === "delayed" ? "active" : ""}" onclick="setSubFilter('delayed')">
          <i class="fa-solid fa-clock-rotate-left" style="color: #fcd34d;"></i>
          <span>ผ่อนล่าช้า</span>
          <span class="tab-count-badge" style="background: rgba(245, 158, 11, 0.25); color: #fde68a;">${delayedCount}</span>
        </button>
      `;
    } else if (currentTab === "motorcycle") {
      const allMotorcycleContracts = allContracts.filter(isMotorcycleContract);
      let paidCount = 0;
      let pendingCount = 0;
      let fineCount = 0;
      let allCount = 0;
      allMotorcycleContracts.forEach((c) => {
        const st = getDailyStatusForDate(c, selectedDailyDate).status;
        if (st === "paid") {
          paidCount++;
          allCount++;
        } else if (st === "pending") {
          pendingCount++;
          allCount++;
        }
        if (Number(c.lateFine) > 0) {
          fineCount++;
        }
      });
      adminSubTabNav.innerHTML = `
        <button class="tab-btn ${currentSubFilter === "all" ? "active" : ""}" onclick="setSubFilter('all')">
          <i class="fa-solid fa-motorcycle" style="color: #38bdf8;"></i>
          <span>สัญญามอเตอร์ไซค์ทั้งหมด</span>
          <span class="tab-count-badge" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8;">${allCount}</span>
        </button>
        <button class="tab-btn ${currentSubFilter === "paid" ? "active" : ""}" onclick="setSubFilter('paid')">
          <i class="fa-solid fa-circle-check" style="color: #34d399;"></i>
          <span>จ่ายแล้ว (${dateDisplay})</span>
          <span class="tab-count-badge">${paidCount}</span>
        </button>
        <button class="tab-btn ${currentSubFilter === "pending" ? "active" : ""}" onclick="setSubFilter('pending')">
          <i class="fa-solid fa-clock" style="color: #fbbf24;"></i>
          <span>ค้างจ่าย (${dateDisplay})</span>
          <span class="tab-count-badge">${pendingCount}</span>
        </button>
        ${fineCount > 0 ? `
        <button class="tab-btn ${currentSubFilter === "fine" ? "active" : ""}" onclick="setSubFilter('fine')">
          <i class="fa-solid fa-triangle-exclamation" style="color: #fb923c;"></i>
          <span>มีค่าปรับ</span>
          <span class="tab-count-badge" style="background: rgba(251, 146, 60, 0.25); color: #fb923c;">${fineCount}</span>
        </button>` : ""}
      `;
    } else {
      // currentTab === 'all' (Requirement 3: ยอด Badge และแถวตารางต้องตรงกัน 100%)
      const fineCount = allContracts.filter((c) => Number(c.lateFine) > 0).length;
      adminSubTabNav.innerHTML = `
        <button class="tab-btn ${currentSubFilter === "all" ? "active" : ""}" onclick="setSubFilter('all')">
          <i class="fa-solid fa-file-contract"></i>
          <span>สัญญาทั้งหมด</span>
          <span class="tab-count-badge">${allContracts.length}</span>
        </button>
        <button class="tab-btn ${currentSubFilter === "pending" ? "active" : ""}" onclick="setSubFilter('pending')">
          <i class="fa-solid fa-spinner" style="color: #38bdf8;"></i>
          <span>กำลังผ่อนชำระ</span>
          <span class="tab-count-badge">${activeContractsCount}</span>
        </button>
        <button class="tab-btn ${currentSubFilter === "paid" ? "active" : ""}" onclick="setSubFilter('paid')">
          <i class="fa-solid fa-circle-check" style="color: #34d399;"></i>
          <span>ปิดสัญญาแล้ว</span>
          <span class="tab-count-badge">${completedContractsCount}</span>
        </button>
        ${fineCount > 0 ? `
        <button class="tab-btn ${currentSubFilter === "fine" ? "active" : ""}" onclick="setSubFilter('fine')">
          <i class="fa-solid fa-triangle-exclamation" style="color: #fb923c;"></i>
          <span>มีค่าปรับ</span>
          <span class="tab-count-badge" style="background: rgba(251, 146, 60, 0.25); color: #fb923c;">${fineCount}</span>
        </button>` : ""}
      `;
    }
  }

  // --- 4. RENDER DATA TABLE BY TAB & SUB-FILTER ---

  function renderActiveTabTable() {
    const query = adminSearchInput.value.trim().toLowerCase();
    const qClean = query.replace(/[^0-9]/g, "");

    // หากเปิดอยู่ในแท็บประวัติหนี้เสีย (Bad Debt)
    if (currentTab === "bad_debt") {
      const badDebts = window.easyFinanceDB.getBadDebts ? window.easyFinanceDB.getBadDebts() : [];
      let filtered = badDebts.filter((b) => {
        if (!query) return true;
        const nameMatch = b.name && b.name.toLowerCase().includes(query);
        const noteMatch = b.note && b.note.toLowerCase().includes(query);
        const itemMatch = b.itemDescription && b.itemDescription.toLowerCase().includes(query);
        const addressMatch = b.address && b.address.toLowerCase().includes(query);
        let idCardMatch = false;
        if (b.idCard) {
          if (b.idCard.toLowerCase().includes(query)) idCardMatch = true;
          else if (qClean.length > 0 && b.idCard.replace(/[^0-9]/g, "").includes(qClean)) idCardMatch = true;
        }
        let phoneMatch = false;
        if (b.phone) {
          if (b.phone.toLowerCase().includes(query)) phoneMatch = true;
          else if (qClean.length > 0 && b.phone.replace(/[^0-9]/g, "").includes(qClean)) phoneMatch = true;
        }
        return nameMatch || idCardMatch || phoneMatch || noteMatch || itemMatch || addressMatch;
      });

      // กรองตาม 3 หมวดหมู่ (หนี้เสีย, แบล็คลิส, ผ่อนล่าช้า) หรือ ทั้งหมด
      if (currentSubFilter !== "all") {
        filtered = filtered.filter((b) => b.category === currentSubFilter);
      }

      renderBadDebtTable(filtered);
      return;
    }

    const contracts = window.easyFinanceDB.getContracts();
    const qPhoneClean = query.replace(/[^0-9]/g, "");

    // 1. Filter by search query (Requirement 4: ค้นหาได้เฉพาะ "ชื่อ", "เบอร์โทรศัพท์", หรือ "อีเมล" เท่านั้น)
    let filtered = contracts.filter((c) => {
      if (!query) return true;

      const nameMatch = c.name && c.name.toLowerCase().includes(query);
      const emailMatch = c.email && c.email.toLowerCase().includes(query);
      let phoneMatch = false;
      if (c.phone) {
        if (c.phone.toLowerCase().includes(query)) {
          phoneMatch = true;
        } else if (qPhoneClean.length > 0) {
          const cPhoneClean = c.phone.replace(/[^0-9]/g, "");
          if (cPhoneClean.includes(qPhoneClean)) {
            phoneMatch = true;
          }
        }
      }

      return nameMatch || emailMatch || phoneMatch;
    });

    // 2. Filter by Tab Frequency or Category
    if (currentTab === "motorcycle") {
      filtered = filtered.filter(isMotorcycleContract);
    } else if (currentTab === "daily") {
      filtered = filtered.filter((c) => c.paymentFrequency === "daily" && !isMotorcycleContract(c));
    } else if (currentTab === "weekly") {
      filtered = filtered.filter((c) => c.paymentFrequency === "weekly" && !isMotorcycleContract(c));
    } else if (currentTab === "monthly") {
      filtered = filtered.filter((c) => c.paymentFrequency === "monthly" && !isMotorcycleContract(c));
    }

    // 3. Filter by Sub-filter (Requirement 2 & 3: กรองตรงตาม Badge)
    if (currentSubFilter === "fine") {
      filtered = filtered.filter((c) => Number(c.lateFine) > 0);
    } else if (currentTab === "daily" || currentTab === "weekly" || currentTab === "monthly" || currentTab === "motorcycle") {
      filtered = filtered.filter((c) => {
        const st = getDailyStatusForDate(c, selectedDailyDate).status;
        // หากเป็นสัญญาที่ปิดสัญญาแล้ว และไม่ได้จ่ายในวันนี้ (st === "completed") ไม่ต้องแสดงในหน้าของวันนั้น
        if (st === "completed") return false;
        if (currentSubFilter === "all") return true;
        return st === currentSubFilter;
      });
    } else if (currentSubFilter !== "all") {
      filtered = filtered.filter((c) => {
        if (currentTab === "all") {
          // สัญญาทั้งหมด: กำลังผ่อนชำระ vs ปิดสัญญาแล้ว
          const installments = c.installments || [];
          const isCompleted = installments.length > 0 && installments.every((i) => i.status === "paid");
          if (currentSubFilter === "pending") {
            return !isCompleted; // กำลังผ่อนชำระ
          } else if (currentSubFilter === "paid") {
            return isCompleted; // ปิดสัญญาแล้ว
          }
          return true;
        } else {
          const freq = c.paymentFrequency || "monthly";
          return getCustomerPaymentStatus(c, freq) === currentSubFilter;
        }
      });
    }

    // 4. Render Table by Active Tab
    if (currentTab === "motorcycle") {
      renderMotorcycleTable(filtered);
    } else if (currentTab === "daily") {
      renderDailyTable(filtered);
    } else if (currentTab === "weekly") {
      renderWeeklyTable(filtered);
    } else if (currentTab === "monthly") {
      renderMonthlyTable(filtered);
    } else {
      renderAllContractsTable(filtered);
    }
  }

  // --- 4.1 DAILY TABLE (Requirement 2: กรองตามวันที่เลือก) ---
  function renderDailyTable(contractsList) {
    if (dateFilterBar) {
      dateFilterBar.style.display = "flex";
      if (adminDateFilter) adminDateFilter.value = selectedDailyDate;
      updatePeriodDateInputs();
    }

    const dateDisplay = formatDateThai(selectedDailyDate);

    tableHeaderRow.innerHTML = `
      <th>ลูกค้า</th>
      <th>สิ่งที่ผ่อน</th>
      <th>ค่างวด/วัน</th>
      <th>สถานะ (${dateDisplay})</th>
      <th>คงเหลือรวม</th>
      <th>จัดการ</th>
    `;

    // คำนวณสรุปยอดรายวันประจำวันที่เลือก (ยอดรวมของวันนั้น ที่ผู้ใช้ต้องการในวงสีแดง)
    const allDailyContracts = window.easyFinanceDB.getContracts().filter((c) => c.paymentFrequency === "daily" && !isMotorcycleContract(c));
    let dailyTotalAmount = 0;
    let dailyPaidAmount = 0;
    let dailyPendingAmount = 0;
    let dailyFineAmount = 0;
    let dailyFineCount = 0;
    let paidCount = 0;
    let pendingCount = 0;

    allDailyContracts.forEach((c) => {
      // getDailyStatusForDate ตรวจสอบว่าจ่ายใน selectedDailyDate หรือไม่ หากจ่ายงวดปิดสัญญาวันนี้จะนับเป็น paid
      const dailyStatus = getDailyStatusForDate(c, selectedDailyDate);
      const amt = Number(dailyStatus.amount) || 0;
      if (dailyStatus.status === "paid") {
        paidCount++;
        dailyPaidAmount += amt;
        dailyTotalAmount += amt;
      } else if (dailyStatus.status === "pending") {
        pendingCount++;
        dailyPendingAmount += amt;
        dailyTotalAmount += amt;
      }
      if (dailyStatus.lateFineAmount) {
        dailyFineAmount += Number(dailyStatus.lateFineAmount) || 0;
        dailyFineCount++;
      } else if (Number(c.lateFine) > 0) {
        dailyFineAmount += Number(c.lateFine) || 0;
        dailyFineCount++;
      }
    });

    // อัปเดตกล่องยอดรวมรายวันของวันนั้น (Requirement 5: ปิดเป็น * เมื่อเป็นสิทธิ์พนักงาน)
    const isManager = isManagerLoggedIn();
    if (dailyTotalAmountVal) {
      dailyTotalAmountVal.textContent = isManager ? ("฿" + dailyTotalAmount.toLocaleString()) : "฿******";
      dailyTotalAmountVal.classList.toggle("masked-stat-text", !isManager);
    }
    if (dailyPaidAmountVal) {
      dailyPaidAmountVal.innerHTML = isManager
        ? `<i class="fa-solid fa-circle-check"></i> รับแล้ว ฿${dailyPaidAmount.toLocaleString()}`
        : `<i class="fa-solid fa-circle-check"></i> รับแล้ว ฿******`;
    }
    if (dailyPendingAmountVal) {
      dailyPendingAmountVal.style.display = "";
      dailyPendingAmountVal.innerHTML = isManager
        ? `<i class="fa-solid fa-clock"></i> รอเก็บ ฿${dailyPendingAmount.toLocaleString()}`
        : `<i class="fa-solid fa-clock"></i> รอเก็บ ฿******`;
    }
    if (dailyFineAmountVal) {
      if (dailyFineAmount > 0) {
        dailyFineAmountVal.style.display = "inline-flex";
        dailyFineAmountVal.innerHTML = isManager
          ? `<i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ ฿${dailyFineAmount.toLocaleString()}`
          : `<i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ ฿******`;
      } else {
        dailyFineAmountVal.style.display = "none";
      }
    }
    if (dateDailyTotalBadge) {
      // Trigger pop animation เพื่อให้ยอดเด้งสรุปขึ้นมาตามที่ผู้ใช้ต้องการ
      dateDailyTotalBadge.classList.remove("pop-animate");
      void dateDailyTotalBadge.offsetWidth;
      dateDailyTotalBadge.classList.add("pop-animate");
    }

    if (dateFilterSummary) {
      dateFilterSummary.innerHTML = `
        <span>สรุปประจำวันที่ <strong>${dateDisplay}</strong>:</span>
        <span class="date-stat-chip chip-paid"><i class="fa-solid fa-circle-check"></i> จ่ายแล้ว ${paidCount} ราย</span>
        <span class="date-stat-chip chip-pending"><i class="fa-solid fa-clock"></i> ค้างจ่าย ${pendingCount} ราย</span>
        ${dailyFineCount > 0 ? `<span class="date-stat-chip" style="background: rgba(251, 146, 60, 0.15); color: #fb923c; border: 1px solid rgba(251, 146, 60, 0.35);"><i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ ${dailyFineCount} ราย (฿${dailyFineAmount.toLocaleString()})</span>` : ""}
      `;
    }
    updateDateFilterProgress(paidCount, pendingCount);

    if (contractsList.length === 0) {
      const filterLabel = currentSubFilter === "fine" ? `ที่มีค่าปรับ (${dateDisplay})` : currentSubFilter === "paid" ? `ที่จ่ายแล้ว (${dateDisplay})` : currentSubFilter === "pending" ? `ที่ค้างจ่าย (${dateDisplay})` : "ทั้งหมด";
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-dim); padding: 30px;">ไม่พบข้อมูลลูกค้ารายวัน (${filterLabel})</td></tr>`;
      return;
    }

    tableBody.innerHTML = "";
    contractsList.forEach((c) => {
      const isCompleted = isContractCompleted(c);
      const installments = c.installments || [];
      const pendingInst = installments.find((i) => i.status !== "paid");
      const contractTotal = Number(c.totalAmount) || 0;
      const totalPaidAmt = installments
        .filter((i) => i.status === "paid" && !i.isPrincipalInterestCut)
        .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
      const remainingBalance = Math.max(0, contractTotal - totalPaidAmt);

      // ตรวจสอบสถานะการชำระเงินตามวันที่เลือก
      const dailyStatus = getDailyStatusForDate(c, selectedDailyDate);
      const isPaid = dailyStatus.status === "paid";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div class="customer-cell">
            <img class="customer-thumb" src="${c.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}" alt="">
            <div class="customer-info">
              <div class="name">${c.name}</div>
              <div class="sub">${c.id} | ${c.phone}</div>
              ${Number(c.lateFine) > 0 ? `<div style="margin-top: 3px;"><span class="badge-fine"><i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ ฿${Number(c.lateFine).toLocaleString()}</span></div>` : ""}
            </div>
          </div>
        </td>
        <td>
          <span style="color: #fff; font-weight: 500;">${c.itemFinanced || "-"}</span>
          <div style="font-size: 0.72rem; color: var(--text-dim);">${c.dueSchedule || "ทุกวัน"}</div>
        </td>
        <td>
          ${isPaid
            ? `<strong style="color: var(--primary-light);">฿${Number(dailyStatus.amount || (installments[0]?.amount || 0)).toLocaleString()}</strong>`
            : isCompleted
              ? `<span style="color: var(--text-dim); font-size: 0.85rem;">฿0 <span style="font-size: 0.72rem; color: #34d399;">(ปิดแล้ว)</span></span>`
              : `<strong style="color: var(--primary-light);">฿${Number(pendingInst ? pendingInst.amount : (installments[0]?.amount || 0)).toLocaleString()}</strong>`
          }
        </td>
        <td>
          ${isPaid
            ? `<span class="status-badge badge-paid"><i class="fa-solid fa-circle-check"></i> ${dailyStatus.label}</span>`
            : isCompleted
              ? `<span class="status-badge badge-paid"><i class="fa-solid fa-circle-check"></i> ปิดสัญญาแล้ว</span>`
              : `<span class="status-badge badge-pending"><i class="fa-solid fa-clock"></i> ${dailyStatus.label}</span>`
          }
        </td>
        <td>฿${remainingBalance.toLocaleString()}</td>
        <td>
          <div class="table-actions">
            ${isPaid
              ? `<div style="display: inline-flex; align-items: center; gap: 4px;">
                  <span style="font-size: 0.75rem; color: var(--primary-light); font-weight: 600;"><i class="fa-solid fa-check"></i> ชำระแล้ว${dailyStatus.isClosingPayment ? " (ปิดสัญญา)" : ""}</span>
                  ${dailyStatus.installment ? `<button class="btn-table-action btn-unmark-paid" onclick="quickUnmarkPaid('${c.id}', ${dailyStatus.installment.installmentNo})" title="กดยกเลิกเพื่อเปลี่ยนกลับเป็นรอชำระ" style="padding: 2px 7px; font-size: 0.72rem; color: #f87171; background: rgba(248, 113, 113, 0.1); border-color: rgba(248, 113, 113, 0.3); border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;"><i class="fa-solid fa-rotate-left"></i> ยกเลิก</button>` : ""}
                 </div>`
              : isCompleted
                ? '<span style="font-size: 0.75rem; color: #34d399; font-weight: 600;"><i class="fa-solid fa-circle-check"></i> ปิดสัญญาเรียบร้อย</span>'
                : dailyStatus.installment
                  ? `<button class="btn-table-action btn-mark-paid" onclick="quickMarkPaid('${c.id}', ${dailyStatus.installment.installmentNo}, '${selectedDailyDate}')" title="บันทึกรับชำระ">
                      <i class="fa-solid fa-check"></i> บันทึกรับชำระ
                     </button>`
                  : ""
            }
            <button class="btn-penalty-action ${Number(c.lateFine) > 0 ? "has-fine" : ""}" onclick="openPenaltyModal('${c.id}')" title="จัดการค่าปรับ">
              <i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ${Number(c.lateFine) > 0 ? ` (฿${Number(c.lateFine).toLocaleString()})` : ""}
            </button>
            ${Number(c.lateFine) > 0 ? `<button type="button" class="btn-table-action btn-cancel-fine" onclick="cancelCustomerLateFine('${c.id}')" title="ยกเลิกค่าปรับของลูกค้าคนนี้ (ล้างค่าปรับเป็น 0 บาท หน้าลูกค้าหายทันที)"><i class="fa-solid fa-ban"></i> ยกเลิกค่าปรับ</button>` : ""}
            <button class="btn-table-action" onclick="openContractDetails('${c.id}')" title="ดูตารางงวด">
              <i class="fa-solid fa-table-list"></i> ดูงวด
            </button>
            <button class="btn-table-action" onclick="editContract('${c.id}')" title="แก้ไขสัญญา">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-table-action" onclick="deleteContractConfirm('${c.id}')" title="ลบสัญญา" style="color: #f87171;">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // --- 4.2 WEEKLY TABLE (ค้นหาและสรุปยอดรายวัน) ---
  function renderWeeklyTable(contractsList) {
    if (dateFilterBar) {
      dateFilterBar.style.display = "flex";
      if (adminDateFilter) adminDateFilter.value = selectedDailyDate;
      updatePeriodDateInputs();
    }

    const dateDisplay = formatDateThai(selectedDailyDate);

    tableHeaderRow.innerHTML = `
      <th>ลูกค้า</th>
      <th>สิ่งที่ผ่อน</th>
      <th>กำหนดชำระ</th>
      <th>ค่างวด/สัปดาห์</th>
      <th>สถานะ (${dateDisplay})</th>
      <th>คงเหลือรวม</th>
      <th>จัดการ</th>
    `;

    // คำนวณสรุปยอดรายอาทิตย์ประจำวันที่เลือก (Requirement 1: ดึงยอดจ่ายแล้วตามวันที่ชำระ paidAt ส่วนกำหนดชำระคงเดิมไม่ต้องดึงคำนวณยอดไปแสดง)
    const allWeeklyContracts = window.easyFinanceDB.getContracts().filter((c) => c.paymentFrequency === "weekly" && !isMotorcycleContract(c));
    let weeklyPaidAmount = 0;
    let weeklyFineAmount = 0;
    let weeklyFineCount = 0;
    let paidCount = 0;
    let pendingCount = 0;

    allWeeklyContracts.forEach((c) => {
      const statusObj = getDailyStatusForDate(c, selectedDailyDate);
      if (statusObj.status === "paid") {
        paidCount++;
        weeklyPaidAmount += Number(statusObj.amount) || 0;
      } else {
        if (!isContractCompleted(c)) {
          pendingCount++;
        }
      }
      if (statusObj.lateFineAmount) {
        weeklyFineAmount += Number(statusObj.lateFineAmount) || 0;
        weeklyFineCount++;
      } else if (Number(c.lateFine) > 0) {
        weeklyFineAmount += Number(c.lateFine) || 0;
        weeklyFineCount++;
      }
    });

    const isManagerWeekly = isManagerLoggedIn();
    if (dailyTotalAmountVal) {
      dailyTotalAmountVal.textContent = isManagerWeekly ? ("฿" + weeklyPaidAmount.toLocaleString()) : "฿******";
      dailyTotalAmountVal.classList.toggle("masked-stat-text", !isManagerWeekly);
    }
    if (dailyPaidAmountVal) {
      dailyPaidAmountVal.innerHTML = isManagerWeekly
        ? `<i class="fa-solid fa-circle-check"></i> รับแล้ว ฿${weeklyPaidAmount.toLocaleString()}`
        : `<i class="fa-solid fa-circle-check"></i> รับแล้ว ฿******`;
    }
    if (dailyPendingAmountVal) {
      dailyPendingAmountVal.style.display = "none";
    }
    if (dailyFineAmountVal) {
      if (weeklyFineAmount > 0) {
        dailyFineAmountVal.style.display = "inline-flex";
        dailyFineAmountVal.innerHTML = isManagerWeekly
          ? `<i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ ฿${weeklyFineAmount.toLocaleString()}`
          : `<i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ ฿******`;
      } else {
        dailyFineAmountVal.style.display = "none";
      }
    }
    if (dateDailyTotalBadge) {
      dateDailyTotalBadge.classList.remove("pop-animate");
      void dateDailyTotalBadge.offsetWidth;
      dateDailyTotalBadge.classList.add("pop-animate");
    }

    if (dateFilterSummary) {
      dateFilterSummary.innerHTML = `
        <span>สรุปประจำวันที่ <strong>${dateDisplay}</strong>:</span>
        <span class="date-stat-chip chip-paid"><i class="fa-solid fa-circle-check"></i> จ่ายแล้ว ${paidCount} ราย (฿${weeklyPaidAmount.toLocaleString()})</span>
        <span class="date-stat-chip chip-pending"><i class="fa-solid fa-clock"></i> รอชำระ ${pendingCount} ราย</span>
        ${weeklyFineCount > 0 ? `<span class="date-stat-chip" style="background: rgba(251, 146, 60, 0.15); color: #fb923c; border: 1px solid rgba(251, 146, 60, 0.35);"><i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ ${weeklyFineCount} ราย (฿${weeklyFineAmount.toLocaleString()})</span>` : ""}
      `;
    }
    updateDateFilterProgress(paidCount, pendingCount);

    if (contractsList.length === 0) {
      const filterLabel = currentSubFilter === "fine" ? `ที่มีค่าปรับ (${dateDisplay})` : currentSubFilter === "paid" ? `ที่จ่ายแล้ว (${dateDisplay})` : currentSubFilter === "pending" ? `ที่ค้างจ่าย (${dateDisplay})` : "ทั้งหมด";
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 30px;">ไม่พบข้อมูลลูกค้ารายอาทิตย์ (${filterLabel})</td></tr>`;
      return;
    }

    tableBody.innerHTML = "";
    contractsList.forEach((c) => {
      const isCompleted = isContractCompleted(c);
      const installments = c.installments || [];
      const contractTotal = Number(c.totalAmount) || 0;
      const totalPaidAmt = installments
        .filter((i) => i.status === "paid" && !i.isPrincipalInterestCut)
        .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
      const remainingBalance = Math.max(0, contractTotal - totalPaidAmt);

      const statusObj = getDailyStatusForDate(c, selectedDailyDate);
      const isPaid = statusObj.status === "paid";
      const isInterestCut = statusObj.status === "interest_only";

      const tr = document.createElement("tr");
      if (isInterestCut) {
        tr.className = "tr-interest-cut";
      }
      tr.innerHTML = `
        <td>
          <div class="customer-cell">
            <img class="customer-thumb" src="${c.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"}" alt="">
            <div class="customer-info">
              <div class="name">${c.name}</div>
              <div class="sub">${c.id} | ${c.phone}</div>
              ${Number(c.lateFine) > 0 ? `<div style="margin-top: 3px;"><span class="badge-fine"><i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ ฿${Number(c.lateFine).toLocaleString()}</span></div>` : ""}
            </div>
          </div>
        </td>
        <td>
          <span style="color: #fff; font-weight: 500;">${c.itemFinanced || "-"}</span>
          <div style="font-size: 0.72rem; color: var(--text-dim);">${c.dueSchedule || "ทุกสัปดาห์"}</div>
        </td>
        <td><span style="color: #38bdf8; font-weight: 500;">${c.dueSchedule || "ทุกสัปดาห์"}</span></td>
        <td>
          ${isPaid
            ? `<strong style="color: var(--primary-light);">฿${Number(statusObj.amount || (installments[0]?.amount || 0)).toLocaleString()}</strong>`
            : isInterestCut
              ? `<strong style="color: #38bdf8;">฿${Number(statusObj.amount).toLocaleString()} <span style="font-size: 0.7rem;">(ตัดดอก)</span></strong>`
              : isCompleted
                ? `<span style="color: var(--text-dim); font-size: 0.85rem;">฿0 <span style="font-size: 0.72rem; color: #34d399;">(ปิดแล้ว)</span></span>`
                : `<strong style="color: var(--primary-light);">฿${Number(statusObj.installment ? statusObj.installment.amount : (installments[0]?.amount || 0)).toLocaleString()}</strong>`
          }
        </td>
        <td>
          ${isPaid
            ? `<span class="status-badge badge-paid"><i class="fa-solid fa-circle-check"></i> ${statusObj.label}</span>`
            : isInterestCut
              ? `<span class="status-badge badge-interest"><i class="fa-solid fa-percent"></i> ${statusObj.label}</span>`
              : isCompleted
                ? `<span class="status-badge badge-paid"><i class="fa-solid fa-circle-check"></i> ปิดสัญญาแล้ว</span>`
                : `<span class="status-badge badge-pending"><i class="fa-solid fa-clock"></i> ${statusObj.label}</span>`
          }
        </td>
        <td>฿${remainingBalance.toLocaleString()}</td>
        <td>
          <div class="table-actions">
            ${isPaid
              ? `<div style="display: inline-flex; align-items: center; gap: 4px;">
                  <span style="font-size: 0.75rem; color: var(--primary-light); font-weight: 600;"><i class="fa-solid fa-check"></i> ชำระแล้ว${statusObj.isClosingPayment ? " (ปิดสัญญา)" : ""}</span>
                  ${statusObj.installment ? `<button class="btn-table-action btn-unmark-paid" onclick="quickUnmarkPaid('${c.id}', ${statusObj.installment.installmentNo})" title="กดยกเลิกเพื่อเปลี่ยนกลับเป็นรอชำระ" style="padding: 2px 7px; font-size: 0.72rem; color: #f87171; background: rgba(248, 113, 113, 0.1); border-color: rgba(248, 113, 113, 0.3); border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;"><i class="fa-solid fa-rotate-left"></i> ยกเลิก</button>` : ""}
                 </div>`
              : isInterestCut
                ? `<div style="display: inline-flex; align-items: center; gap: 4px;">
                    <span style="font-size: 0.75rem; color: #38bdf8; font-weight: 600;"><i class="fa-solid fa-percent"></i> ตัดดอกแล้ว</span>
                    ${statusObj.installment ? `<button class="btn-table-action btn-unmark-paid" onclick="unmarkInterestCutFromDetail(${statusObj.installment.installmentNo})" title="ยกเลิกตัดดอก" style="padding: 2px 7px; font-size: 0.72rem; color: #f87171; background: rgba(248, 113, 113, 0.1); border-color: rgba(248, 113, 113, 0.3); border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;"><i class="fa-solid fa-rotate-left"></i> ยกเลิก</button>` : ""}
                   </div>`
                : isCompleted
                  ? '<span style="font-size: 0.75rem; color: #34d399; font-weight: 600;"><i class="fa-solid fa-circle-check"></i> ปิดสัญญาเรียบร้อย</span>'
                  : statusObj.installment
                    ? `<button class="btn-table-action btn-mark-paid" onclick="quickMarkPaid('${c.id}', ${statusObj.installment.installmentNo}, '${selectedDailyDate}')" title="บันทึกรับชำระ">
                        <i class="fa-solid fa-check"></i> บันทึกรับชำระ
                       </button>`
                    : ""
            }
            <button class="btn-penalty-action ${Number(c.lateFine) > 0 ? "has-fine" : ""}" onclick="openPenaltyModal('${c.id}')" title="จัดการค่าปรับ">
              <i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ${Number(c.lateFine) > 0 ? ` (฿${Number(c.lateFine).toLocaleString()})` : ""}
            </button>
            ${Number(c.lateFine) > 0 ? `<button type="button" class="btn-table-action btn-cancel-fine" onclick="cancelCustomerLateFine('${c.id}')" title="ยกเลิกค่าปรับของลูกค้าคนนี้ (ล้างค่าปรับเป็น 0 บาท หน้าลูกค้าหายทันที)"><i class="fa-solid fa-ban"></i> ยกเลิกค่าปรับ</button>` : ""}
            <button class="btn-table-action" onclick="openContractDetails('${c.id}')" title="ดูตารางงวด">
              <i class="fa-solid fa-table-list"></i> ดูงวด
            </button>
            <button class="btn-table-action" onclick="editContract('${c.id}')" title="แก้ไขสัญญา">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-table-action" onclick="deleteContractConfirm('${c.id}')" title="ลบสัญญา" style="color: #f87171;">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // --- 4.3 MONTHLY TABLE (ค้นหาและสรุปยอดรายวัน) ---
  function renderMonthlyTable(contractsList) {
    if (dateFilterBar) {
      dateFilterBar.style.display = "flex";
      if (adminDateFilter) adminDateFilter.value = selectedDailyDate;
      updatePeriodDateInputs();
    }

    const dateDisplay = formatDateThai(selectedDailyDate);

    tableHeaderRow.innerHTML = `
      <th>ลูกค้า</th>
      <th>สิ่งที่ผ่อน</th>
      <th>กำหนดชำระ</th>
      <th>ค่างวด/เดือน</th>
      <th>สถานะ (${dateDisplay})</th>
      <th>คงเหลือรวม</th>
      <th>จัดการ</th>
    `;

    // คำนวณสรุปยอดรายเดือนประจำวันที่เลือก (Requirement 1: ดึงยอดจ่ายแล้วตามวันที่ชำระ paidAt ส่วนกำหนดชำระคงเดิมไม่ต้องดึงคำนวณยอดไปแสดง)
    const allMonthlyContracts = window.easyFinanceDB.getContracts().filter((c) => c.paymentFrequency === "monthly" && !isMotorcycleContract(c));
    let monthlyPaidAmount = 0;
    let paidCount = 0;
    let pendingCount = 0;
    let monthlyFineAmount = 0;
    let monthlyFineCount = 0;

    allMonthlyContracts.forEach((c) => {
      const statusObj = getDailyStatusForDate(c, selectedDailyDate);
      if (statusObj.status === "paid") {
        paidCount++;
        monthlyPaidAmount += Number(statusObj.amount) || 0;
      } else {
        if (!isContractCompleted(c)) {
          pendingCount++;
        }
      }
      if (statusObj.lateFineAmount) {
        monthlyFineAmount += Number(statusObj.lateFineAmount) || 0;
        monthlyFineCount++;
      } else if (Number(c.lateFine) > 0) {
        monthlyFineAmount += Number(c.lateFine) || 0;
        monthlyFineCount++;
      }
    });

    const isManagerMonthly = isManagerLoggedIn();
    if (dailyTotalAmountVal) {
      dailyTotalAmountVal.textContent = isManagerMonthly ? ("฿" + monthlyPaidAmount.toLocaleString()) : "฿******";
      dailyTotalAmountVal.classList.toggle("masked-stat-text", !isManagerMonthly);
    }
    if (dailyPaidAmountVal) {
      dailyPaidAmountVal.innerHTML = isManagerMonthly
        ? `<i class="fa-solid fa-circle-check"></i> รับแล้ว ฿${monthlyPaidAmount.toLocaleString()}`
        : `<i class="fa-solid fa-circle-check"></i> รับแล้ว ฿******`;
    }
    if (dailyPendingAmountVal) {
      dailyPendingAmountVal.style.display = "none";
    }
    if (dailyFineAmountVal) {
      if (monthlyFineCount > 0) {
        dailyFineAmountVal.style.display = "inline-flex";
        dailyFineAmountVal.innerHTML = isManagerMonthly
          ? `<i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ ฿${monthlyFineAmount.toLocaleString()}`
          : `<i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ ฿******`;
      } else {
        dailyFineAmountVal.style.display = "none";
      }
    }
    if (dateDailyTotalBadge) {
      dateDailyTotalBadge.classList.remove("pop-animate");
      void dateDailyTotalBadge.offsetWidth;
      dateDailyTotalBadge.classList.add("pop-animate");
    }

    if (dateFilterSummary) {
      dateFilterSummary.innerHTML = `
        <span>สรุปประจำวันที่ <strong>${dateDisplay}</strong>:</span>
        <span class="date-stat-chip chip-paid"><i class="fa-solid fa-circle-check"></i> จ่ายแล้ว ${paidCount} ราย (฿${monthlyPaidAmount.toLocaleString()})</span>
        <span class="date-stat-chip chip-pending"><i class="fa-solid fa-clock"></i> รอชำระ ${pendingCount} ราย</span>
        ${monthlyFineCount > 0 ? `<span class="date-stat-chip" style="background: rgba(251, 146, 60, 0.15); color: #fb923c; border: 1px solid rgba(251, 146, 60, 0.35);"><i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ ${monthlyFineCount} ราย (฿${monthlyFineAmount.toLocaleString()})</span>` : ""}
      `;
    }
    updateDateFilterProgress(paidCount, pendingCount);

    if (contractsList.length === 0) {
      const filterLabel = currentSubFilter === "fine" ? `ที่มีค่าปรับ (${dateDisplay})` : currentSubFilter === "paid" ? `ที่จ่ายแล้ว (${dateDisplay})` : currentSubFilter === "pending" ? `ที่ค้างจ่าย (${dateDisplay})` : "ทั้งหมด";
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 30px;">ไม่พบข้อมูลลูกค้ารายเดือน (${filterLabel})</td></tr>`;
      return;
    }

    tableBody.innerHTML = "";
    contractsList.forEach((c) => {
      const isCompleted = isContractCompleted(c);
      const installments = c.installments || [];
      const contractTotal = Number(c.totalAmount) || 0;
      const totalPaidAmt = installments
        .filter((i) => i.status === "paid" && !i.isPrincipalInterestCut)
        .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
      const remainingBalance = Math.max(0, contractTotal - totalPaidAmt);

      const statusObj = getDailyStatusForDate(c, selectedDailyDate);
      const isPaid = statusObj.status === "paid";
      const isInterestCut = statusObj.status === "interest_only";

      const tr = document.createElement("tr");
      if (isInterestCut) {
        tr.className = "tr-interest-cut";
      }
      tr.innerHTML = `
        <td>
          <div class="customer-cell">
            <img class="customer-thumb" src="${c.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100"}" alt="">
            <div class="customer-info">
              <div class="name">${c.name}</div>
              <div class="sub">${c.id} | ${c.phone}</div>
              ${Number(c.lateFine) > 0 ? `<div style="margin-top: 3px;"><span class="badge-fine"><i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ ฿${Number(c.lateFine).toLocaleString()}</span></div>` : ""}
            </div>
          </div>
        </td>
        <td>
          <span style="color: #fff; font-weight: 500;">${c.itemFinanced || "-"}</span>
          <div style="font-size: 0.72rem; color: var(--text-dim);">${c.dueSchedule || "ทุกสิ้นเดือน"}</div>
        </td>
        <td><span style="color: #c084fc; font-weight: 500;">${c.dueSchedule || "ทุกวันที่ 1"}</span></td>
        <td>
          ${isPaid
            ? `<strong style="color: var(--primary-light);">฿${Number(statusObj.amount || (installments[0]?.amount || 0)).toLocaleString()}</strong>`
            : isInterestCut
              ? `<strong style="color: #38bdf8;">฿${Number(statusObj.amount).toLocaleString()} <span style="font-size: 0.7rem;">(ตัดดอก)</span></strong>`
              : isCompleted
                ? `<span style="color: var(--text-dim); font-size: 0.85rem;">฿0 <span style="font-size: 0.72rem; color: #34d399;">(ปิดแล้ว)</span></span>`
                : `<strong style="color: var(--primary-light);">฿${Number(statusObj.installment ? statusObj.installment.amount : (installments[0]?.amount || 0)).toLocaleString()}</strong>`
          }
        </td>
        <td>
          ${isPaid
            ? `<span class="status-badge badge-paid"><i class="fa-solid fa-circle-check"></i> ${statusObj.label}</span>`
            : isInterestCut
              ? `<span class="status-badge badge-interest"><i class="fa-solid fa-percent"></i> ${statusObj.label}</span>`
              : isCompleted
                ? `<span class="status-badge badge-paid"><i class="fa-solid fa-circle-check"></i> ปิดสัญญาแล้ว</span>`
                : `<span class="status-badge badge-pending"><i class="fa-solid fa-clock"></i> ${statusObj.label}</span>`
          }
        </td>
        <td>฿${remainingBalance.toLocaleString()}</td>
        <td>
          <div class="table-actions">
            ${isPaid
              ? `<div style="display: inline-flex; align-items: center; gap: 4px;">
                  <span style="font-size: 0.75rem; color: var(--primary-light); font-weight: 600;"><i class="fa-solid fa-check"></i> ชำระแล้ว${statusObj.isClosingPayment ? " (ปิดสัญญา)" : ""}</span>
                  ${statusObj.installment ? `<button class="btn-table-action btn-unmark-paid" onclick="quickUnmarkPaid('${c.id}', ${statusObj.installment.installmentNo})" title="กดยกเลิกเพื่อเปลี่ยนกลับเป็นรอชำระ" style="padding: 2px 7px; font-size: 0.72rem; color: #f87171; background: rgba(248, 113, 113, 0.1); border-color: rgba(248, 113, 113, 0.3); border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;"><i class="fa-solid fa-rotate-left"></i> ยกเลิก</button>` : ""}
                 </div>`
              : isInterestCut
                ? `<div style="display: inline-flex; align-items: center; gap: 4px;">
                    <span style="font-size: 0.75rem; color: #38bdf8; font-weight: 600;"><i class="fa-solid fa-percent"></i> ตัดดอกแล้ว</span>
                    ${statusObj.installment ? `<button class="btn-table-action btn-unmark-paid" onclick="unmarkInterestCutFromDetail(${statusObj.installment.installmentNo})" title="ยกเลิกตัดดอก" style="padding: 2px 7px; font-size: 0.72rem; color: #f87171; background: rgba(248, 113, 113, 0.1); border-color: rgba(248, 113, 113, 0.3); border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;"><i class="fa-solid fa-rotate-left"></i> ยกเลิก</button>` : ""}
                   </div>`
                : isCompleted
                  ? '<span style="font-size: 0.75rem; color: #34d399; font-weight: 600;"><i class="fa-solid fa-circle-check"></i> ปิดสัญญาเรียบร้อย</span>'
                  : statusObj.installment
                    ? `<button class="btn-table-action btn-mark-paid" onclick="quickMarkPaid('${c.id}', ${statusObj.installment.installmentNo}, '${selectedDailyDate}')" title="บันทึกรับชำระ">
                        <i class="fa-solid fa-check"></i> บันทึกรับชำระ
                       </button>`
                    : ""
            }
            <button class="btn-penalty-action ${Number(c.lateFine) > 0 ? "has-fine" : ""}" onclick="openPenaltyModal('${c.id}')" title="จัดการค่าปรับ">
              <i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ${Number(c.lateFine) > 0 ? ` (฿${Number(c.lateFine).toLocaleString()})` : ""}
            </button>
            ${Number(c.lateFine) > 0 ? `<button type="button" class="btn-table-action btn-cancel-fine" onclick="cancelCustomerLateFine('${c.id}')" title="ยกเลิกค่าปรับของลูกค้าคนนี้ (ล้างค่าปรับเป็น 0 บาท หน้าลูกค้าหายทันที)"><i class="fa-solid fa-ban"></i> ยกเลิกค่าปรับ</button>` : ""}
            <button class="btn-table-action" onclick="openContractDetails('${c.id}')" title="ดูตารางงวด">
              <i class="fa-solid fa-table-list"></i> ดูงวด
            </button>
            <button class="btn-table-action" onclick="editContract('${c.id}')" title="แก้ไขสัญญา">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-table-action" onclick="deleteContractConfirm('${c.id}')" title="ลบสัญญา" style="color: #f87171;">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // --- 4.4 ALL CONTRACTS TABLE ---
  function renderAllContractsTable(contractsList) {
    if (dateFilterBar) dateFilterBar.style.display = "none";

    tableHeaderRow.innerHTML = `
      <th>รหัสสัญญา</th>
      <th>ลูกค้า & อีเมลล็อกอิน</th>
      <th>หมวด / สิ่งที่ผ่อน</th>
      <th>ยอดรวม (บาท)</th>
      <th>ความคืบหน้า</th>
      <th>สถานะ</th>
      <th>จัดการ</th>
    `;

    if (contractsList.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 30px;">ไม่พบรายการสัญญาตามเงื่อนไข</td></tr>`;
      return;
    }

    tableBody.innerHTML = "";
    contractsList.forEach((c) => {
      const installments = c.installments || [];
      const paidCount = installments.filter((i) => i.status === "paid").length;
      const totalCount = installments.length;
      const percent = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0;
      const isCompleted = paidCount === totalCount && totalCount > 0;

      const freqLabels = {
        daily: '<span class="overview-card-badge badge-daily" style="font-size: 0.68rem; padding: 2px 6px;">รายวัน</span>',
        weekly: '<span class="overview-card-badge badge-weekly" style="font-size: 0.68rem; padding: 2px 6px;">รายอาทิตย์</span>',
        monthly: '<span class="overview-card-badge badge-monthly" style="font-size: 0.68rem; padding: 2px 6px;">รายเดือน</span>'
      };

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><span class="contract-id-pill">${c.id}</span></td>
        <td>
          <div class="customer-cell">
            <img class="customer-thumb" src="${c.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}" alt="">
            <div class="customer-info">
              <div class="name">${c.name}</div>
              <div class="sub">${c.email} | รหัสผ่าน: ${c.password}</div>
            </div>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 3px;">
            ${freqLabels[c.paymentFrequency] || ""}
            <span style="color: #fff; font-weight: 500;">${c.itemFinanced || "-"}</span>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-dim);">${c.dueSchedule || "-"}</div>
        </td>
        <td>
          <strong style="color: #fff;">฿${(Number(c.totalAmount || 0) + Number(c.downPayment || 0)).toLocaleString()}</strong>
          ${Number(c.downPayment) > 0 ? `<div style="font-size: 0.72rem; color: #38bdf8;">(ดาวน์ ฿${Number(c.downPayment).toLocaleString()} + ผ่อน ฿${Number(c.totalAmount).toLocaleString()})</div>` : ""}
        </td>
        <td>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 3px;">
            ${paidCount} / ${totalCount} งวด (${percent}%)
          </div>
          <div class="progress-track" style="height: 6px;">
            <div class="progress-bar-fill" style="width: ${percent}%;"></div>
          </div>
        </td>
        <td>
          ${isCompleted
          ? '<span class="status-badge badge-paid">ปิดสัญญาแล้ว</span>'
          : '<span class="status-badge badge-pending">กำลังผ่อนชำระ</span>'
        }
          ${Number(c.lateFine) > 0 ? `<div style="margin-top: 3px;"><span class="badge-fine"><i class="fa-solid fa-triangle-exclamation"></i> ปรับ ฿${Number(c.lateFine).toLocaleString()}</span></div>` : ""}
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-penalty-action ${Number(c.lateFine) > 0 ? "has-fine" : ""}" onclick="openPenaltyModal('${c.id}')" title="จัดการค่าปรับ">
              <i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ
            </button>
            ${Number(c.lateFine) > 0 ? `<button type="button" class="btn-table-action btn-cancel-fine" onclick="cancelCustomerLateFine('${c.id}')" title="ยกเลิกค่าปรับของลูกค้าคนนี้ (ล้างค่าปรับเป็น 0 บาท หน้าลูกค้าหายทันที)"><i class="fa-solid fa-ban"></i> ยกเลิกค่าปรับ</button>` : ""}
            <button class="btn-table-action" onclick="openContractDetails('${c.id}')" title="ดูตารางงวด">
              <i class="fa-solid fa-list-check"></i>
            </button>
            <button class="btn-table-action" onclick="editContract('${c.id}')" title="แก้ไข">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-table-action" onclick="deleteContractConfirm('${c.id}')" title="ลบสัญญา" style="color: #f87171;">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // --- 4.4.1 MOTORCYCLE CONTRACTS TABLE (สรุปยอดรวมหมวดรถมอไซต์ต่างหาก ค้นหาวันที่ได้เหมือนรายวัน) ---
  function renderMotorcycleTable(contractsList) {
    if (dateFilterBar) {
      dateFilterBar.style.display = "flex";
      if (adminDateFilter) adminDateFilter.value = selectedDailyDate;
      updatePeriodDateInputs();
    }

    const dateDisplay = formatDateThai(selectedDailyDate);

    tableHeaderRow.innerHTML = `
      <th>รหัสสัญญา</th>
      <th>ลูกค้า & ข้อมูลติดต่อ</th>
      <th>รุ่นรถมอเตอร์ไซค์</th>
      <th>ยอดปล่อย & เงินดาวน์</th>
      <th>ค่างวด</th>
      <th>สถานะ (${dateDisplay})</th>
      <th>ยอดคงเหลือรอเก็บ</th>
      <th>จัดการ</th>
    `;

    // คำนวณสรุปยอดประจำวันที่เลือกสำหรับหมวดมอเตอร์ไซค์
    const allMotorcycleContracts = window.easyFinanceDB.getContracts().filter(isMotorcycleContract);
    let mcTotalAmount = 0;
    let mcPaidAmount = 0;
    let mcPendingAmount = 0;
    let mcFineAmount = 0;
    let mcFineCount = 0;
    let paidCount = 0;
    let pendingCount = 0;

    allMotorcycleContracts.forEach((c) => {
      // getDailyStatusForDate ตรวจสอบว่าจ่ายใน selectedDailyDate หรือไม่ หากจ่ายงวดปิดสัญญาวันนี้จะนับเป็น paid
      const dailyStatus = getDailyStatusForDate(c, selectedDailyDate);
      const amt = Number(dailyStatus.amount) || 0;
      if (dailyStatus.status === "paid") {
        paidCount++;
        mcPaidAmount += amt;
        mcTotalAmount += amt;
      } else if (dailyStatus.status === "pending") {
        pendingCount++;
        mcPendingAmount += amt;
        mcTotalAmount += amt;
      }
      if (dailyStatus.lateFineAmount) {
        mcFineAmount += Number(dailyStatus.lateFineAmount) || 0;
        mcFineCount++;
      } else if (Number(c.lateFine) > 0) {
        mcFineAmount += Number(c.lateFine) || 0;
        mcFineCount++;
      }
    });

    const isManager = isManagerLoggedIn();
    if (dailyTotalAmountVal) {
      dailyTotalAmountVal.textContent = isManager ? ("฿" + mcTotalAmount.toLocaleString()) : "฿******";
      dailyTotalAmountVal.classList.toggle("masked-stat-text", !isManager);
    }
    if (dailyPaidAmountVal) {
      dailyPaidAmountVal.innerHTML = isManager
        ? `<i class="fa-solid fa-circle-check"></i> รับแล้ว ฿${mcPaidAmount.toLocaleString()}`
        : `<i class="fa-solid fa-circle-check"></i> รับแล้ว ฿******`;
    }
    if (dailyPendingAmountVal) {
      dailyPendingAmountVal.innerHTML = isManager
        ? `<i class="fa-solid fa-clock"></i> รอเก็บ ฿${mcPendingAmount.toLocaleString()}`
        : `<i class="fa-solid fa-clock"></i> รอเก็บ ฿******`;
    }
    if (dailyFineAmountVal) {
      if (mcFineCount > 0) {
        dailyFineAmountVal.style.display = "inline-flex";
        dailyFineAmountVal.innerHTML = isManager
          ? `<i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ ฿${mcFineAmount.toLocaleString()}`
          : `<i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ ฿******`;
      } else {
        dailyFineAmountVal.style.display = "none";
      }
    }
    if (dateDailyTotalBadge) {
      dateDailyTotalBadge.classList.remove("pop-animate");
      void dateDailyTotalBadge.offsetWidth;
      dateDailyTotalBadge.classList.add("pop-animate");
    }

    if (dateFilterSummary) {
      dateFilterSummary.innerHTML = `
        <span>สรุปประจำวันที่ <strong>${dateDisplay}</strong>:</span>
        <span class="date-stat-chip chip-paid"><i class="fa-solid fa-circle-check"></i> จ่ายแล้ว ${paidCount} ราย</span>
        <span class="date-stat-chip chip-pending"><i class="fa-solid fa-clock"></i> ค้างจ่าย ${pendingCount} ราย</span>
        ${mcFineCount > 0 ? `<span class="date-stat-chip" style="background: rgba(251, 146, 60, 0.15); color: #fb923c; border: 1px solid rgba(251, 146, 60, 0.35);"><i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ ${mcFineCount} ราย (฿${mcFineAmount.toLocaleString()})</span>` : ""}
      `;
    }
    updateDateFilterProgress(paidCount, pendingCount);

    if (contractsList.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; color: var(--text-dim); padding: 40px;">
            <div style="font-size: 2.2rem; color: #38bdf8; margin-bottom: 10px;">
              <i class="fa-solid fa-motorcycle"></i>
            </div>
            <div style="font-weight: 600; color: #fff; font-size: 1rem; margin-bottom: 6px;">
              ไม่พบรายการสัญญารถมอเตอร์ไซค์ (${currentSubFilter === "fine" ? `ที่มีค่าปรับ (${dateDisplay})` : currentSubFilter === "paid" ? `ที่จ่ายแล้ว (${dateDisplay})` : currentSubFilter === "pending" ? `ที่ค้างจ่าย (${dateDisplay})` : "ทั้งหมด"})
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
              สามารถกดปุ่ม "+ เพิ่มสัญญาใหม่" เพื่อบันทึกสัญญาผ่อนรถมอเตอร์ไซค์แยกหมวดได้ทันที
            </div>
            <button type="button" class="btn-primary-action" onclick="document.getElementById('btnOpenAddContract').click()" style="display: inline-flex; margin: 0 auto;">
              <i class="fa-solid fa-plus"></i> เพิ่มสัญญาผ่อนมอเตอร์ไซค์
            </button>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = "";
    contractsList.forEach((c) => {
      const isCompleted = isContractCompleted(c);
      const installments = c.installments || [];
      const pendingInst = installments.find((i) => i.status !== "paid");
      const contractTotal = Number(c.totalAmount) || 0;
      const totalPaidAmt = installments
        .filter((i) => i.status === "paid" && !i.isPrincipalInterestCut)
        .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
      const remainingBalance = Math.max(0, contractTotal - totalPaidAmt);

      // ตรวจสอบสถานะการชำระเงินตามวันที่เลือก
      const dailyStatus = getDailyStatusForDate(c, selectedDailyDate);
      const isPaid = dailyStatus.status === "paid";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div class="customer-cell">
            <img class="customer-thumb" src="${c.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}" alt="">
            <div class="customer-info">
              <div class="name">${c.name}</div>
              <div class="sub">${c.id} | ${c.phone}</div>
              ${Number(c.lateFine) > 0 ? `<div style="margin-top: 3px;"><span class="badge-fine"><i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ ฿${Number(c.lateFine).toLocaleString()}</span></div>` : ""}
            </div>
          </div>
        </td>
        <td>
          <span style="color: #fff; font-weight: 500;">${c.itemFinanced || "-"}</span>
          <div style="font-size: 0.72rem; color: var(--text-dim);">${c.dueSchedule || "ทุกวัน"}</div>
        </td>
        <td>
          ${isPaid
            ? `<strong style="color: var(--primary-light);">฿${Number(dailyStatus.amount || (installments[0]?.amount || 0)).toLocaleString()}</strong>`
            : isCompleted
              ? `<span style="color: var(--text-dim); font-size: 0.85rem;">฿0 <span style="font-size: 0.72rem; color: #34d399;">(ปิดแล้ว)</span></span>`
              : `<strong style="color: var(--primary-light);">฿${Number(pendingInst ? pendingInst.amount : (installments[0]?.amount || 0)).toLocaleString()}</strong>`
          }
        </td>
        <td>
          ${isPaid
            ? `<span class="status-badge badge-paid"><i class="fa-solid fa-circle-check"></i> ${dailyStatus.label}</span>`
            : isCompleted
              ? `<span class="status-badge badge-paid"><i class="fa-solid fa-circle-check"></i> ปิดสัญญาแล้ว</span>`
              : `<span class="status-badge badge-pending"><i class="fa-solid fa-clock"></i> ${dailyStatus.label}</span>`
          }
        </td>
        <td>฿${remainingBalance.toLocaleString()}</td>
        <td>
          <div class="table-actions">
            ${isPaid
              ? `<div style="display: inline-flex; align-items: center; gap: 4px;">
                  <span style="font-size: 0.75rem; color: var(--primary-light); font-weight: 600;"><i class="fa-solid fa-check"></i> ชำระแล้ว${dailyStatus.isClosingPayment ? " (ปิดสัญญา)" : ""}</span>
                  ${dailyStatus.installment ? `<button class="btn-table-action btn-unmark-paid" onclick="quickUnmarkPaid('${c.id}', ${dailyStatus.installment.installmentNo})" title="กดยกเลิกเพื่อเปลี่ยนกลับเป็นรอชำระ" style="padding: 2px 7px; font-size: 0.72rem; color: #f87171; background: rgba(248, 113, 113, 0.1); border-color: rgba(248, 113, 113, 0.3); border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;"><i class="fa-solid fa-rotate-left"></i> ยกเลิก</button>` : ""}
                 </div>`
              : isCompleted
                ? '<span style="font-size: 0.75rem; color: #34d399; font-weight: 600;"><i class="fa-solid fa-circle-check"></i> ปิดสัญญาเรียบร้อย</span>'
                : dailyStatus.installment
                  ? `<button class="btn-table-action btn-mark-paid" onclick="quickMarkPaid('${c.id}', ${dailyStatus.installment.installmentNo}, '${selectedDailyDate}')" title="บันทึกรับชำระ">
                      <i class="fa-solid fa-check"></i> บันทึกรับชำระ
                     </button>`
                  : ""
            }
            <button class="btn-penalty-action ${Number(c.lateFine) > 0 ? "has-fine" : ""}" onclick="openPenaltyModal('${c.id}')" title="จัดการค่าปรับ">
              <i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ${Number(c.lateFine) > 0 ? ` (฿${Number(c.lateFine).toLocaleString()})` : ""}
            </button>
            ${Number(c.lateFine) > 0 ? `<button type="button" class="btn-table-action btn-cancel-fine" onclick="cancelCustomerLateFine('${c.id}')" title="ยกเลิกค่าปรับของลูกค้าคนนี้ (ล้างค่าปรับเป็น 0 บาท หน้าลูกค้าหายทันที)"><i class="fa-solid fa-ban"></i> ยกเลิกค่าปรับ</button>` : ""}
            <button class="btn-table-action" onclick="openContractDetails('${c.id}')" title="ดูตารางงวด">
              <i class="fa-solid fa-table-list"></i> ดูงวด
            </button>
            <button class="btn-table-action" onclick="editContract('${c.id}')" title="แก้ไขสัญญา">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-table-action" onclick="deleteContractConfirm('${c.id}')" title="ลบสัญญา" style="color: #f87171;">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }
  // --- 4.5 BAD DEBTS TABLE (ประวัติหนี้เสีย / แบล็คลิส / ผ่อนล่าช้า) ---
  function renderBadDebtTable(badDebtsList) {
    if (dateFilterBar) dateFilterBar.style.display = "none";

    tableHeaderRow.innerHTML = `
      <th>วันที่บันทึก</th>
      <th>ชื่อลูกหนี้ & เลขบัตร ปชช.</th>
      <th>เบอร์โทร & ที่อยู่</th>
      <th>สิ่งที่ผ่อน / ยอดหนี้คงค้าง</th>
      <th>หมวดหมู่</th>
      <th>หมายเหตุพฤติกรรม</th>
      <th>จัดการ</th>
    `;

    if (badDebtsList.length === 0) {
      const categoryNames = {
        bad_debt: "หนี้เสีย",
        blacklist: "แบล็คลิส",
        delayed: "ผ่อนล่าช้า",
        all: "ทั้งหมด"
      };
      const catLabel = categoryNames[currentSubFilter] || "ทั้งหมด";
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 36px;">ไม่พบรายการประวัติลูกหนี้ (${catLabel})</td></tr>`;
      return;
    }

    tableBody.innerHTML = "";
    badDebtsList.forEach((b) => {
      const categoryBadges = {
        bad_debt: '<span class="status-badge badge-bad-debt"><i class="fa-solid fa-circle-exclamation"></i> หนี้เสีย</span>',
        blacklist: '<span class="status-badge badge-blacklist"><i class="fa-solid fa-ban"></i> แบล็คลิส</span>',
        delayed: '<span class="status-badge badge-delayed"><i class="fa-solid fa-clock-rotate-left"></i> ผ่อนล่าช้า</span>'
      };

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <span style="font-size: 0.82rem; color: var(--text-muted);">${formatDateThai(b.recordedAt) || "-"}</span>
          <div style="font-size: 0.7rem; color: var(--text-dim); font-family: monospace;">${b.id}</div>
        </td>
        <td>
          <div class="customer-info">
            <div class="name" style="font-weight: 600; color: #fff; font-size: 0.92rem;">${b.name}</div>
            <div style="margin-top: 4px;">
              <span class="id-card-pill"><i class="fa-regular fa-id-card"></i> ${b.idCard || "-"}</span>
            </div>
          </div>
        </td>
        <td>
          <div style="font-size: 0.85rem; color: #38bdf8;"><i class="fa-solid fa-phone"></i> ${b.phone || "-"}</div>
          <div style="font-size: 0.75rem; color: var(--text-dim); max-width: 200px; margin-top: 3px; line-height: 1.3;" title="${b.address || "-"}">
            <i class="fa-solid fa-location-dot"></i> ${b.address || "-"}
          </div>
        </td>
        <td>
          <strong style="color: #f87171; font-size: 0.95rem;">฿${Number(b.amount || 0).toLocaleString()}</strong>
          <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 2px;">${b.itemDescription || "-"}</div>
        </td>
        <td>
          ${categoryBadges[b.category] || '<span class="status-badge badge-bad-debt">หนี้เสีย</span>'}
        </td>
        <td>
          <div style="font-size: 0.8rem; color: #e2e8f0; max-width: 260px; line-height: 1.4; background: rgba(0,0,0,0.2); padding: 6px 10px; border-radius: var(--radius-sm); border-left: 3px solid #ef4444;">
            ${b.note || "-"}
          </div>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-table-action" onclick="editBadDebt('${b.id}')" title="แก้ไขข้อมูล">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-table-action" onclick="deleteBadDebtConfirm('${b.id}')" title="ลบรายการ" style="color: #f87171;">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // --- 5. ADD / EDIT CONTRACT LOGIC ---

  // ช่องกรอกเงินดาวน์: เปิดให้กรอกได้ทุกหมวด (ใส่ 0 หากไม่มี) เพื่อบันทึกเงินดาวน์แยกต่างหาก
  function updateDownPaymentVisibility() {
    const cat = formItemCategory ? formItemCategory.value : "general";
    if (formDownPaymentGroup) {
      formDownPaymentGroup.style.display = "block";
    }
    const lblTitle = document.getElementById("lblDownPaymentTitle");
    if (lblTitle) {
      if (cat === "gold") {
        lblTitle.innerHTML = '<i class="fa-solid fa-coins"></i> เงินดาวน์ผ่อนทอง (บาท)';
      } else if (cat === "motorcycle") {
        lblTitle.innerHTML = '<i class="fa-solid fa-motorcycle"></i> เงินดาวน์รถมอเตอร์ไซค์ (บาท)';
      } else {
        lblTitle.innerHTML = '<i class="fa-solid fa-coins"></i> เงินดาวน์ (บาท)';
      }
    }
  }

  if (formItemCategory) {
    formItemCategory.addEventListener("change", () => {
      updateDownPaymentVisibility();
      if (formItemFinanced) {
        formItemFinanced.placeholder = formItemCategory.value === "motorcycle"
          ? "เช่น Honda Wave 110i, Yamaha Grand Filano, Honda PCX 160"
          : "เช่น ผ่อนทองคำ 1 บาท, Honda Wave 110i, iPhone 16";
      }
    });
  }

  // รอบการชำระเปลี่ยน: ตั้งค่ากำหนดชำระและระยะเวลาแนะนำให้อัตโนมัติ (ไม่แทรกแซงหรือคำนวณค่างวดทับที่แอดมินพิมพ์)
  if (formPaymentFrequency) {
    formPaymentFrequency.addEventListener("change", () => {
      const freq = formPaymentFrequency.value;
      const curInst = parseInt(formTotalInstallments.value, 10) || 0;
      if (!formDueSchedule.value || formDueSchedule.value === "ทุกวัน" || formDueSchedule.value === "ทุกวันศุกร์" || formDueSchedule.value === "ทุกวันที่ 1 ของเดือน") {
        formDueSchedule.value = freq === "daily" ? "ทุกวัน" : freq === "weekly" ? "ทุกวันศุกร์" : "ทุกวันที่ 1 ของเดือน";
      }
      if (curInst > 0) {
        formDuration.value = freq === "daily" ? `${curInst} วัน` : freq === "weekly" ? `${curInst} สัปดาห์` : `${curInst} เดือน`;
      }
    });
  }

  btnOpenAddContract.addEventListener("click", () => {
    contractForm.reset();
    formContractId.value = "";
    contractModalTitle.textContent = currentTab === "motorcycle"
      ? "เพิ่มสัญญาผ่อนรถมอเตอร์ไซค์ใหม่"
      : "เพิ่มสัญญาสินเชื่อ / ผ่อนชำระใหม่";
    formClosedContractsCount.value = "0";
    if (formInstallmentAmount) formInstallmentAmount.value = "";
    if (formIdCard) formIdCard.value = "";
    if (formFacebook) formFacebook.value = "";
    if (formAddress) formAddress.value = "";
    if (formAdditionalNotes) formAdditionalNotes.value = "";
    if (formItemCategory) formItemCategory.value = currentTab === "motorcycle" ? "motorcycle" : "general";
    if (formItemFinanced) {
      formItemFinanced.placeholder = currentTab === "motorcycle"
        ? "เช่น Honda Wave 110i, Yamaha Grand Filano, Honda PCX 160"
        : "เช่น ผ่อนทองคำ 1 บาท, Honda Wave 110i, iPhone 16";
    }
    updateDownPaymentVisibility();
    if (formDownPayment) formDownPayment.value = "0";
    if (formDownPaymentDate) formDownPaymentDate.value = getLocalDateStr();
    if (formFirstPaymentDate) formFirstPaymentDate.value = getLocalDateStr();

    // สุ่มรหัสสัญญาใหม่
    const randNo = Math.floor(100 + Math.random() * 900);
    const newId = `EF-${new Date().getFullYear()}-${randNo}`;
    if (formEmailPrefix) {
      formEmailPrefix.value = "";
      formEmailPrefix.placeholder = `customer${randNo}`;
    }
    if (formEmail) formEmail.value = "";
    formPassword.value = "123456"; // Default password for new customer

    contractModal.classList.add("active");
  });

  if (btnCloseContractModal) {
    btnCloseContractModal.addEventListener("click", () => {
      contractModal.classList.remove("active");
    });
  }

  if (btnCancelContractModal) {
    btnCancelContractModal.addEventListener("click", () => {
      contractModal.classList.remove("active");
    });
  }

  contractForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = formContractId.value || `EF-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    let rawEmailPrefix = formEmailPrefix ? formEmailPrefix.value.trim() : "";
    rawEmailPrefix = rawEmailPrefix.replace(/@.*$/, "");
    const email = rawEmailPrefix ? `${rawEmailPrefix}@Easy.com` : (formEmail ? formEmail.value.trim() : "");
    if (formEmail) formEmail.value = email;

    const password = formPassword.value.trim();
    const name = formName.value.trim();
    const phone = formPhone.value.trim();
    const avatar = formAvatar.value.trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150";
    const itemFinanced = formItemFinanced.value.trim();
    const itemCategory = formItemCategory ? formItemCategory.value : "general";
    // ช่องเงินดาวน์: รองรับทุกหมวด ใส่ 0 หากไม่มี
    const downPayment = formDownPayment ? (parseFloat(formDownPayment.value) || 0) : 0;
    const downPaymentDate = (formDownPaymentDate && formDownPaymentDate.value) ? formDownPaymentDate.value : getLocalDateStr();
    const idCard = formIdCard ? formIdCard.value.trim() : "";
    const facebookLink = formFacebook ? formFacebook.value.trim() : "";
    const address = formAddress ? formAddress.value.trim() : "";
    const additionalNotes = formAdditionalNotes ? formAdditionalNotes.value.trim() : "";
    const totalAmount = parseFloat(formTotalAmount.value);
    const totalInstallments = parseInt(formTotalInstallments.value, 10);
    const paymentFrequency = formPaymentFrequency.value;

    // 2. กำหนดวันที่เริ่มจ่าย (งวดที่ 1) และรันวันที่ตามหมวด
    const firstPaymentDate = formFirstPaymentDate && formFirstPaymentDate.value ? formFirstPaymentDate.value : getLocalDateStr();
    const dueDay = firstPaymentDate ? parseInt(firstPaymentDate.split("-")[2], 10) : 1;
    const dueSchedule = formDueSchedule.value.trim() || (
      paymentFrequency === "daily"
        ? `ทุกวัน (เริ่ม ${formatDateThai(firstPaymentDate)})`
        : paymentFrequency === "weekly"
          ? `ทุกสัปดาห์ (เริ่ม ${formatDateThai(firstPaymentDate)})`
          : `ทุกวันที่ ${dueDay} ของเดือน (เริ่ม ${formatDateThai(firstPaymentDate)})`
    );
    const duration = formDuration.value.trim() || (
      paymentFrequency === "daily" ? `${totalInstallments} วัน` : paymentFrequency === "weekly" ? `${totalInstallments} สัปดาห์` : `${totalInstallments} เดือน`
    );
    const closedContractsCount = parseInt(formClosedContractsCount.value, 10) || 0;

    // คำนวณค่างวดต่องวด: ให้สิทธิ์แอดมินกรอกเองได้อย่างอิสระ (Manual 100% เอาสูตรคำนวณอัตโนมัติออกทั้งหมด)
    let installmentAmount = formInstallmentAmount ? parseFloat(formInstallmentAmount.value) : 0;
    if (!installmentAmount || isNaN(installmentAmount) || installmentAmount <= 0) {
      installmentAmount = totalInstallments > 0 ? Math.round(totalAmount / totalInstallments) : totalAmount;
    }

    // ตรวจสอบว่าเป็นสัญญาเดิมหรือสัญญาใหม่
    const existing = window.easyFinanceDB.getContractById(id);
    let installments = [];

    if (existing && existing.installments && existing.installments.length === totalInstallments) {
      // สัญญาเดิม: รักษาสถานะงวดที่จ่ายไปแล้ว อัปเดตกำหนดวันชำระ และยอดค่างวดต่องวดตามที่แอดมินกรอก
      installments = existing.installments.map((inst) => {
        const i = inst.installmentNo;
        const newDueDateStr = calculateInstallmentDueDate(firstPaymentDate, paymentFrequency, i);
        if (inst.status !== "paid") {
          return {
            ...inst,
            dueDate: newDueDateStr,
            amount: installmentAmount
          };
        }
        return inst;
      });
    } else {
      // สร้างตารางงวดใหม่: ทุกงวดใช้ยอดที่แอดมินกรอกตรงๆ (ไม่มีสูตรตัดเศษหรือบวกดอกเบี้ยอัตโนมัติ)
      for (let i = 1; i <= totalInstallments; i++) {
        const dueDateStr = calculateInstallmentDueDate(firstPaymentDate, paymentFrequency, i);
        installments.push({
          installmentNo: i,
          dueDate: dueDateStr,
          amount: installmentAmount,
          status: "pending",
          paidAt: null,
          slipUrl: null,
          transactionRef: null,
          remainingBalanceAfter: 0
        });
      }
    }

    // คำนวณยอดคงเหลือตามแผนของแต่ละงวดตามยอดต้นใหม่ totalAmount เสมอ
    let scheduledBalance = totalAmount;
    installments.forEach((inst) => {
      scheduledBalance -= (Number(inst.amount) || 0);
      inst.remainingBalanceAfter = Math.max(0, scheduledBalance);
    });

    const contractData = {
      id,
      email,
      password,
      name,
      phone,
      avatar,
      idCard: idCard || (existing && existing.idCard) || "",
      facebookLink: facebookLink || (existing && existing.facebookLink) || "",
      address: address || (existing && existing.address) || "",
      additionalNotes: additionalNotes || (existing && existing.additionalNotes) || "",
      itemCategory,
      itemFinanced,
      downPayment,
      downPaymentDate: downPayment > 0 ? downPaymentDate : (existing?.downPaymentDate || ""),
      lateFine: (existing && existing.lateFine) || 0,
      lateFineReason: (existing && existing.lateFineReason) || "",
      totalAmount,
      totalInstallments,
      firstPaymentDate,
      paymentFrequency,
      dueSchedule,
      duration,
      closedContractsCount,
      status: (existing && existing.status) ? existing.status : "active",
      createdAt: (existing && existing.createdAt) || new Date().toISOString(),
      installments
    };

    await window.easyFinanceDB.saveContract(contractData);
    contractModal.classList.remove("active");
    showAdminToast(`บันทึกสัญญา ${id} เรียบร้อยแล้ว`, "success");
    renderStatsCounters();
    renderSubTabs();
    renderActiveTabTable();
    updateCustomerBadges();
  });

  // Global Edit Contract
  window.editContract = function (id) {
    const contract = window.easyFinanceDB.getContractById(id);
    if (!contract) return;

    formContractId.value = contract.id;
    if (formEmailPrefix) {
      const rawEmail = contract.email || "";
      const prefix = rawEmail.includes("@") ? rawEmail.split("@")[0] : rawEmail;
      formEmailPrefix.value = prefix;
    }
    if (formEmail) {
      formEmail.value = contract.email || "";
    }
    formPassword.value = contract.password || "";
    formName.value = contract.name || "";
    formPhone.value = contract.phone || "";
    formAvatar.value = contract.avatar || "";
    formItemFinanced.value = contract.itemFinanced || "";
    if (formItemCategory) {
      formItemCategory.value = contract.itemCategory || (isMotorcycleContract(contract) ? "motorcycle" : "general");
    }
    updateDownPaymentVisibility();
    if (formDownPayment) {
      formDownPayment.value = contract.downPayment !== undefined ? contract.downPayment : 0;
    }
    if (formDownPaymentDate) {
      formDownPaymentDate.value = contract.downPaymentDate || (contract.firstPaymentDate ? contract.firstPaymentDate.slice(0, 10) : getLocalDateStr());
    }
    formTotalAmount.value = contract.totalAmount || 0;
    formTotalInstallments.value = contract.totalInstallments || 1;
    if (formFirstPaymentDate) {
      if (contract.firstPaymentDate) {
        formFirstPaymentDate.value = contract.firstPaymentDate;
      } else if (contract.installments && contract.installments[0]?.dueDate) {
        const dStr = contract.installments[0].dueDate;
        formFirstPaymentDate.value = dStr.length >= 10 ? dStr.slice(0, 10) : getLocalDateStr();
      } else {
        formFirstPaymentDate.value = getLocalDateStr();
      }
    }
    formPaymentFrequency.value = contract.paymentFrequency || "monthly";
    formDueSchedule.value = contract.dueSchedule || "";
    formDuration.value = contract.duration || "";
    formClosedContractsCount.value = contract.closedContractsCount || 0;
    if (formIdCard) formIdCard.value = contract.idCard || "";
    if (formFacebook) formFacebook.value = contract.facebookLink || "";
    if (formAddress) formAddress.value = contract.address || "";
    if (formAdditionalNotes) formAdditionalNotes.value = contract.additionalNotes || "";

    // เติมค่างวดต่องวด
    const firstInstAmt = (contract.installments && contract.installments[0]?.amount) || (contract.totalAmount && contract.totalInstallments ? Math.round(contract.totalAmount / contract.totalInstallments) : 0);
    if (formInstallmentAmount) {
      formInstallmentAmount.value = firstInstAmt || "";
    }

    contractModalTitle.textContent = `แก้ไขสัญญา ${contract.id}`;
    contractModal.classList.add("active");
  };

  // Global Delete Contract (Requirement 1: ต้องใส่รหัสผ่านความปลอดภัยก่อนลบข้อมูลลูกค้า)
  window.deleteContractConfirm = function (id) {
    openDeleteSecurityModal(id, "contract");
  };

  // Global Quick Mark as Paid (Requirement 2: รองรับระบุวันที่บันทึกชำระ)
  window.quickMarkPaid = async function (contractId, installmentNo, customPaidDate = null) {
    const dateNote = customPaidDate ? ` (วันที่ ${formatDateThai(customPaidDate)})` : "";
    if (confirm(`ยืนยันการบันทึกรับชำระเงิน งวดที่ ${installmentNo} ของสัญญา ${contractId}${dateNote}?`)) {
      const slipData = {
        verifiedBy: "admin_manual"
      };
      if (customPaidDate) {
        slipData.paidAt = `${customPaidDate} 12:00:00`;
      }
      await window.easyFinanceDB.markInstallmentPaid(contractId, installmentNo, slipData);
      showAdminToast(`บันทึกรับชำระงวดที่ ${installmentNo} สำเร็จ!`, "success");
      renderStatsCounters();
      renderSubTabs();
      renderActiveTabTable();
    }
  };

  // Global Quick Unmark as Paid (ยกเลิกการชำระ เปลี่ยนกลับเป็นรอชำระ)
  window.quickUnmarkPaid = async function (contractId, installmentNo) {
    if (confirm(`ต้องการยกเลิกการชำระเงินของ "งวดที่ ${installmentNo}" สัญญา ${contractId} (เปลี่ยนสถานะกลับเป็น "รอชำระ") ใช่หรือไม่?`)) {
      await window.easyFinanceDB.unmarkInstallmentPaid(contractId, installmentNo);
      showAdminToast(`ยกเลิกชำระงวดที่ ${installmentNo} แล้ว (สถานะกลับเป็นรอชำระ)`, "info");
      renderStatsCounters();
      renderSubTabs();
      renderActiveTabTable();
    }
  };

  // คัดลอกลิงก์หน้าบ้านลูกค้าสำหรับส่งทาง LINE
  window.copyClientLineLink = function (contractId) {
    const origin = window.location.origin;
    const pathname = window.location.pathname.replace(/admin\.html.*$/, "").replace(/\/$/, "");
    const url = `${origin}${pathname}/index.html?id=${encodeURIComponent(contractId)}`;
    copyToClipboard(url);
    showAdminToast(`คัดลอกลิงก์หน้าบ้านสัญญา ${contractId} สำหรับส่งทาง LINE สำเร็จแล้ว`, "success");
  };

  // --- 6. CONTRACT DETAILS DRAWER / MODAL ---

  window.openContractDetails = function (contractId) {
    const contract = window.easyFinanceDB.getContractById(contractId);
    if (!contract) return;

    currentViewingContractId = contractId;
    detailModalTitle.textContent = `ตารางงวดสัญญา: ${contract.id} (${contract.name})`;

    // Render metadata
    detailContractMeta.innerHTML = `
      ${Number(contract.lateFine) > 0 ? `
        <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.45); border-radius: 8px; padding: 12px 16px; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fa-solid fa-triangle-exclamation" style="color: #f87171; font-size: 1.3rem;"></i>
            <div>
              <div style="font-weight: 700; color: #fca5a5; font-size: 0.96rem;">มีค่าปรับค้างชำระ: ฿${Number(contract.lateFine).toLocaleString()}</div>
              <div style="font-size: 0.76rem; color: #fecaca; margin-top: 1px;">${contract.lateFineReason ? `หมายเหตุ: ${contract.lateFineReason}` : "ลูกค้ามีค่าปรับค้างชำระ เกินกำหนด"}</div>
            </div>
          </div>
          <div style="display: flex; gap: 6px; align-items: center;">
            <button type="button" class="btn-penalty-action has-fine" onclick="openPenaltyModal('${contract.id}')" style="padding: 5px 12px; font-size: 0.8rem;">
              <i class="fa-solid fa-pen-to-square"></i> บันทึกรับ / ปรับยอด
            </button>
            <button type="button" class="btn-table-action btn-cancel-fine" onclick="cancelCustomerLateFine('${contract.id}')" style="padding: 5px 12px; font-size: 0.8rem;">
              <i class="fa-solid fa-ban"></i> ยกเลิกค่าปรับ (ล้างเป็น 0)
            </button>
          </div>
        </div>
      ` : ""}
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; font-size: 0.85rem;">
        <div><strong>ลูกค้า:</strong> ${contract.name} (${contract.phone})</div>
        <div><strong>อีเมลเข้าใช้งาน:</strong> ${contract.email}</div>
        <div><strong>รหัสผ่านลูกค้า:</strong> <code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; color: #34d399;">${contract.password}</code></div>
        <div><strong>สิ่งที่ผ่อน:</strong> ${contract.itemFinanced}</div>
        <div><strong>ยอดรวมสัญญา (รวมดาวน์):</strong> ฿${(Number(contract.totalAmount) + Number(contract.downPayment || 0)).toLocaleString()}${Number(contract.downPayment) > 0 ? ` <span style="color: #38bdf8;">(เงินดาวน์ ฿${Number(contract.downPayment).toLocaleString()} + ผ่อน ฿${Number(contract.totalAmount).toLocaleString()})</span>` : ""}</div>
        <div><strong>กำหนดชำระ:</strong> ${contract.dueSchedule} (${contract.duration})</div>
        <div><strong>วันที่เริ่มชำระ:</strong> ${formatDateThai(contract.firstPaymentDate || (contract.installments && contract.installments[0]?.dueDate))}</div>
      </div>
      <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed var(--admin-border); display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
        <!-- ช่องยอดตัดดอกข้างปุ่ม คัดลอกลิงก์ส่ง LINE ให้ลูกค้า (Requirement 3) -->
        <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 6px; padding: 4px 8px;">
          <label for="detailInterestCutInput" style="font-size: 0.78rem; color: #38bdf8; font-weight: 600; white-space: nowrap;">
            <i class="fa-solid fa-percent"></i> ยอดตัดดอก (บาท):
          </label>
          <input type="number" id="detailInterestCutInput" value="${contract.interestCutAmount !== undefined && contract.interestCutAmount !== null ? contract.interestCutAmount : ""}" placeholder="ระบุยอดตัดดอก" min="0" step="any" style="width: 105px; background: #0f172a; color: #fff; border: 1px solid rgba(56, 189, 248, 0.5); border-radius: 4px; padding: 3px 6px; font-size: 0.82rem; font-weight: 600;" onchange="saveContractInterestCutAmount('${contract.id}', this.value)" />
          <button type="button" class="btn-table-action" onclick="saveContractInterestCutAmount('${contract.id}', document.getElementById('detailInterestCutInput').value)" style="padding: 3px 8px; font-size: 0.75rem; background: #0284c7; color: #fff; border: none; border-radius: 4px; cursor: pointer;">
            บันทึก
          </button>
        </div>

        <button type="button" class="btn-table-action" onclick="openPenaltyModal('${contract.id}')" style="padding: 6px 14px; font-size: 0.8rem; background: ${Number(contract.lateFine) > 0 ? "rgba(239, 68, 68, 0.18)" : "rgba(245, 158, 11, 0.15)"}; color: ${Number(contract.lateFine) > 0 ? "#f87171" : "#fbbf24"}; border: 1px solid ${Number(contract.lateFine) > 0 ? "rgba(239, 68, 68, 0.4)" : "rgba(245, 158, 11, 0.35)"};">
          <i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ${Number(contract.lateFine) > 0 ? ` (฿${Number(contract.lateFine).toLocaleString()})` : ""}
        </button>
        <button type="button" class="btn-table-action" onclick="copyClientLineLink('${contract.id}')" style="padding: 6px 14px; font-size: 0.8rem; background: rgba(34, 197, 94, 0.15); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3);">
          <i class="fa-solid fa-share-nodes"></i> คัดลอกลิงก์ส่ง LINE ให้ลูกค้า
        </button>
        <button type="button" class="btn-table-action" onclick="contractDetailModal.classList.remove('active'); editContract('${contract.id}');" style="padding: 6px 14px; font-size: 0.8rem; background: rgba(56, 189, 248, 0.15); color: #38bdf8;">
          <i class="fa-solid fa-pen-to-square"></i> แก้ไขสัญญานี้
        </button>
        <button type="button" class="btn-table-action" onclick="contractDetailModal.classList.remove('active'); deleteContractConfirm('${contract.id}');" style="padding: 6px 14px; font-size: 0.8rem; background: rgba(248, 113, 113, 0.15); color: #f87171;">
          <i class="fa-solid fa-trash"></i> ลบสัญญา
        </button>
      </div>
    `;

    // Render installments table
    detailInstallmentsBody.innerHTML = "";
    (contract.installments || []).forEach((inst) => {
      const isPaid = inst.status === "paid";
      const isInterestCut = inst.status === "interest_only" || inst.status === "cut_interest";
      const isPIC = Boolean(inst.isPrincipalInterestCut);
      const tr = document.createElement("tr");
      if (isInterestCut || isPIC) {
        tr.className = "tr-interest-cut";
      }

      tr.innerHTML = `
        <td>
          <strong style="color: #fff;">งวดที่ ${inst.installmentNo}</strong>
          ${isPIC ? '<span style="font-size: 0.72rem; color: #38bdf8; display: block; font-weight: 500;"><i class="fa-solid fa-scale-balanced"></i> ตัดต้น/ดอก</span>' : ""}
        </td>
        <td>${inst.dueDate}</td>
        <td>
          ${
            isPIC
              ? `<div>
                   <strong style="color: #38bdf8;">ตัดต้น: ฿${Number(inst.principalCutAmount !== undefined ? inst.principalCutAmount : inst.amount).toLocaleString()}</strong>
                   ${Number(inst.interestAmount) > 0 ? `<div style="font-size: 0.74rem; color: #c084fc; font-weight: 600; margin-top: 2px;">ตัดดอก: ฿${Number(inst.interestAmount).toLocaleString()}</div>` : ""}
                 </div>`
              : `<div style="display: inline-flex; align-items: center; gap: 6px;">
                   <strong style="color: var(--primary-light);">฿${Number(inst.amount).toLocaleString()}</strong>
                   <button type="button" class="btn-table-action" onclick="openEditInstallmentModal('${contract.id}', ${inst.installmentNo}, ${inst.amount}, '${inst.dueDate || ""}')" title="แก้ไขยอดชำระหรือกำหนดชำระของงวดนี้" style="padding: 2px 6px; font-size: 0.72rem; color: #38bdf8; border-color: rgba(56, 189, 248, 0.35); background: rgba(56, 189, 248, 0.1); border-radius: 4px; cursor: pointer;">
                     <i class="fa-solid fa-pen-to-square"></i>
                   </button>
                 </div>`
          }
        </td>
        <td>
          ${
            isPIC
              ? (isPaid
                  ? '<span class="status-badge badge-paid" style="background: rgba(56, 189, 248, 0.18); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4);"><i class="fa-solid fa-circle-check"></i> ชำระแล้ว (ตัดต้น/ดอก)</span>'
                  : '<span class="status-badge badge-pending" style="color: #38bdf8; border-color: rgba(56, 189, 248, 0.4);"><i class="fa-solid fa-clock"></i> รอชำระ (ตัดต้น/ดอก)</span>'
                )
              : (isPaid
                  ? '<span class="status-badge badge-paid"><i class="fa-solid fa-check"></i> ชำระแล้ว</span>'
                  : isInterestCut
                    ? `<span class="status-badge badge-interest" title="ตัดเฉพาะดอกเบี้ย ยอด ฿${Number(inst.interestAmount || 0).toLocaleString()}"><i class="fa-solid fa-percent"></i> ตัดดอก (฿${Number(inst.interestAmount || 0).toLocaleString()})</span>`
                    : '<span class="status-badge badge-pending">รอชำระ</span>'
                )
          }
        </td>
        <td><span style="font-size: 0.75rem; color: var(--text-dim);">${inst.paidAt || "-"}</span></td>
        <td>
          ${
            inst.slipUrl
              ? `<button class="btn-table-action" onclick="viewSlip('${inst.slipUrl}', 'งวดที่ ${inst.installmentNo} - Ref: ${inst.transactionRef || "-"}')">
                    <i class="fa-solid fa-image"></i> ดูสลิป
                   </button>`
              : (isPaid ? `<span style="font-size: 0.72rem; color: var(--text-dim);">${inst.transactionRef || (isPIC ? "ตัดต้น/ดอกเรียบร้อย" : "บันทึกโดยแอดมิน")}</span>` : (isInterestCut ? `<span style="font-size: 0.72rem; color: #38bdf8;">ตัดดอก ฿${Number(inst.interestAmount || 0).toLocaleString()}</span>` : "-"))
          }
        </td>
        <td>
          ${
            isPIC
              ? (isPaid
                  ? `<div style="display: inline-flex; align-items: center; gap: 8px;">
                       <span style="color: #38bdf8; font-size: 0.82rem; font-weight: 600; white-space: nowrap; display: inline-flex; align-items: center; gap: 4px;">
                         <i class="fa-solid fa-circle-check"></i> ตัดแล้ว
                       </span>
                       <button class="btn-table-action btn-unmark-paid" onclick="unmarkPaidFromDetail(${inst.installmentNo})" title="กดยกเลิกเพื่อเปลี่ยนสถานะกลับเป็นรอชำระ (คืนยอดรวมสัญญาและยอดตัดดอก)" style="padding: 4px 9px; font-size: 0.75rem; font-weight: 500; cursor: pointer; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">
                         <i class="fa-solid fa-rotate-left"></i> ยกเลิก
                       </button>
                     </div>`
                  : `<button type="button" class="btn-table-action btn-mark-paid" onclick="markPaidFromDetail(${inst.installmentNo})" title="คลิกเพื่อมาร์คชำระ (ลดเงินต้น ฿${Number(inst.principalCutAmount !== undefined ? inst.principalCutAmount : inst.amount).toLocaleString()} และบันทึกตัดดอก)" style="color: #38bdf8; border-color: rgba(56, 189, 248, 0.45); background: rgba(56, 189, 248, 0.12); padding: 5px 10px; font-size: 0.78rem; font-weight: 600; cursor: pointer; border-radius: 6px; display: inline-flex; align-items: center; gap: 5px;">
                       <i class="fa-solid fa-check"></i> มาร์คชำระ
                     </button>`
                )
              : (isPaid
                  ? `<div style="display: inline-flex; align-items: center; gap: 8px;">
                       <span style="color: #34d399; font-size: 0.82rem; font-weight: 600; white-space: nowrap; display: inline-flex; align-items: center; gap: 4px;">
                         <i class="fa-solid fa-circle-check"></i> สมบูรณ์
                       </span>
                       <button class="btn-table-action btn-unmark-paid" onclick="unmarkPaidFromDetail(${inst.installmentNo})" title="กดยกเลิกเพื่อเปลี่ยนสถานะกลับเป็นรอชำระ" style="padding: 4px 9px; font-size: 0.75rem; font-weight: 500; cursor: pointer; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">
                         <i class="fa-solid fa-rotate-left"></i> ยกเลิก
                       </button>
                     </div>`
                  : isInterestCut
                    ? `<div style="display: inline-flex; align-items: center; gap: 8px;">
                         <span style="color: #38bdf8; font-size: 0.82rem; font-weight: 600; white-space: nowrap; display: inline-flex; align-items: center; gap: 4px;">
                           <i class="fa-solid fa-percent"></i> ตัดดอกแล้ว
                         </span>
                         <button class="btn-table-action" onclick="unmarkInterestCutFromDetail(${inst.installmentNo})" title="กดยกเลิกตัดดอก เพื่อเปลี่ยนสถานะกลับเป็นรอชำระ" style="padding: 4px 9px; font-size: 0.75rem; font-weight: 500; cursor: pointer; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px; color: #f87171; border-color: rgba(248, 113, 113, 0.35); background: rgba(248, 113, 113, 0.1);">
                           <i class="fa-solid fa-rotate-left"></i> ยกเลิก
                         </button>
                       </div>`
                    : `<!-- Dropdown จัดการ (Requirement 3.1: ลูกศรชี้ลงในปุ่ม มี 2 ตัวเลือก มาร์คชำระ / ตัดดอก) -->
                       <div class="action-dropdown" id="actionDropdown_${inst.installmentNo}">
                         <button type="button" class="btn-table-action" onclick="toggleActionDropdown(event, ${inst.installmentNo})" title="คลิกเพื่อเลือกการจัดการ (มาร์คชำระ หรือ ตัดดอก)" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); font-weight: 600; padding: 5px 10px; font-size: 0.78rem; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer;">
                           <span>จัดการ</span> <i class="fa-solid fa-chevron-down" style="font-size: 0.72rem;"></i>
                         </button>
                         <div class="action-dropdown-menu" id="dropdownMenu_${inst.installmentNo}">
                           <button type="button" class="action-dropdown-item item-paid" onclick="markPaidFromDetail(${inst.installmentNo})">
                             <i class="fa-solid fa-circle-check" style="color: #22c55e;"></i>
                             <span>มาร์คชำระ (เต็มงวด ฿${Number(inst.amount).toLocaleString()})</span>
                           </button>
                           <button type="button" class="action-dropdown-item item-interest" onclick="markInterestCutFromDetail(${inst.installmentNo})">
                             <i class="fa-solid fa-percent" style="color: #38bdf8;"></i>
                             <span>ตัดดอก ${contract.interestCutAmount ? `(฿${Number(contract.interestCutAmount).toLocaleString()})` : "(ระบุยอด)"}</span>
                           </button>
                         </div>
                       </div>`
                )
          }
        </td>
      `;
      detailInstallmentsBody.appendChild(tr);
    });

    contractDetailModal.classList.add("active");
  };

  // Toggle Action Dropdown menu
  window.toggleActionDropdown = function (event, instNo) {
    if (event) event.stopPropagation();
    const targetDropdown = document.getElementById(`actionDropdown_${instNo}`);
    if (!targetDropdown) return;
    const wasActive = targetDropdown.classList.contains("active");
    document.querySelectorAll(".action-dropdown.active").forEach((d) => {
      d.classList.remove("active");
    });
    if (!wasActive) {
      targetDropdown.classList.add("active");
    }
  };

  // Close all action dropdowns on document click
  document.addEventListener("click", () => {
    document.querySelectorAll(".action-dropdown.active").forEach((d) => {
      d.classList.remove("active");
    });
  });

  // บันทึกรับชำระงวดจากหน้าดูตารางสัญญา
  window.markPaidFromDetail = async function (installmentNo) {
    if (!currentViewingContractId) return;
    const slipData = {
      verifiedBy: "admin_manual"
    };
    if (selectedDailyDate) {
      slipData.paidAt = `${selectedDailyDate} 12:00:00`;
    }
    await window.easyFinanceDB.markInstallmentPaid(currentViewingContractId, installmentNo, slipData);
    showAdminToast(`บันทึกรับชำระงวดที่ ${installmentNo} สำเร็จ (สถานะ: ชำระแล้ว)`, "success");
    openContractDetails(currentViewingContractId);
    renderStatsCounters();
    renderSubTabs();
    renderActiveTabTable();
  };

  // ยกเลิกการชำระงวดจากหน้าดูตารางสัญญา
  window.unmarkPaidFromDetail = async function (installmentNo) {
    if (!currentViewingContractId) return;
    await window.easyFinanceDB.unmarkInstallmentPaid(currentViewingContractId, installmentNo);
    showAdminToast(`ยกเลิกชำระงวดที่ ${installmentNo} เรียบร้อย (สถานะกลับเป็นรอชำระ)`, "info");
    openContractDetails(currentViewingContractId);
    renderStatsCounters();
    renderSubTabs();
    renderActiveTabTable();
  };

  // บันทึก "ตัดดอก" จากหน้าดูตารางสัญญา (Requirement 3.1 & 3.2)
  window.markInterestCutFromDetail = async function (installmentNo) {
    if (!currentViewingContractId) return;
    const contract = window.easyFinanceDB.getContractById(currentViewingContractId);
    if (!contract) return;

    const inputEl = document.getElementById("detailInterestCutInput");
    let cutAmount = (inputEl && inputEl.value !== "") ? parseFloat(inputEl.value) : (contract.interestCutAmount || 0);

    if (!cutAmount || cutAmount <= 0) {
      const promptVal = prompt("ระบุยอดเงินที่ลูกค้าตัดดอก (บาท):", contract.interestCutAmount || "");
      if (promptVal === null) return;
      cutAmount = parseFloat(promptVal) || 0;
      if (cutAmount <= 0) {
        alert("กรุณาระบุยอดตัดดอกที่มากกว่า 0");
        return;
      }
    }

    const customDate = selectedDailyDate || null;
    const dateNote = customDate ? ` (วันที่ ${formatDateThai(customDate)})` : "";

    if (confirm(`ยืนยันการ "ตัดดอก" งวดที่ ${installmentNo} สัญญา ${contract.name} เป็นยอด ฿${cutAmount.toLocaleString()}${dateNote}?\n(เงินต้นจะไม่ถูกหัก สัญญายังคงอยู่)`)) {
      await window.easyFinanceDB.markInstallmentInterestCut(currentViewingContractId, installmentNo, cutAmount, customDate);
      if (!contract.interestCutAmount) {
        await window.easyFinanceDB.setContractInterestCutAmount(currentViewingContractId, cutAmount);
      }
      showAdminToast(`บันทึกตัดดอกงวดที่ ${installmentNo} ยอด ฿${cutAmount.toLocaleString()} สำเร็จ!`, "success");
      openContractDetails(currentViewingContractId);
      renderStatsCounters();
      renderSubTabs();
      renderActiveTabTable();
    }
  };

  // ยกเลิก "ตัดดอก" จากหน้าดูตารางสัญญา
  window.unmarkInterestCutFromDetail = async function (installmentNo) {
    if (!currentViewingContractId) return;
    if (confirm(`ต้องการยกเลิกการตัดดอกของ "งวดที่ ${installmentNo}" (เปลี่ยนสถานะกลับเป็น "รอชำระ") ใช่หรือไม่?`)) {
      await window.easyFinanceDB.unmarkInstallmentInterestCut(currentViewingContractId, installmentNo);
      showAdminToast(`ยกเลิกตัดดอกงวดที่ ${installmentNo} เรียบร้อย (สถานะกลับเป็นรอชำระ)`, "info");
      openContractDetails(currentViewingContractId);
      renderStatsCounters();
      renderSubTabs();
      renderActiveTabTable();
    }
  };

  // บันทึกยอดตัดดอกเริ่มต้นของสัญญา
  window.saveContractInterestCutAmount = async function (contractId, amount) {
    const num = Math.max(0, Number(amount) || 0);
    await window.easyFinanceDB.setContractInterestCutAmount(contractId, num);
    showAdminToast(`บันทึกยอดตัดดอกของสัญญาเป็น ฿${num.toLocaleString()} เรียบร้อยแล้ว`, "success");
    if (currentViewingContractId === contractId) {
      openContractDetails(contractId);
    }
  };

  // --- MANUAL & EDIT INSTALLMENT HANDLERS (Requirement 2) ---

  // --- PRINCIPAL & INTEREST CUT HANDLERS (Requirement: งวดตัดต้น / ตัดดอก) ---

  window.openPrincipalInterestCutModal = function (contractId = null) {
    const targetId = contractId || currentViewingContractId;
    if (!targetId) {
      showAdminToast("กรุณาเลือกสัญญาที่ต้องการบันทึกตัดต้น/ตัดดอก", "error");
      return;
    }
    const contract = window.easyFinanceDB.getContractById(targetId);
    if (!contract) return;

    const bannerText = document.getElementById("picContractBannerText");
    if (bannerText) {
      bannerText.innerHTML = `สัญญา: <strong style="color: #fff;">${contract.id}</strong> - ${contract.name} (${contract.itemFinanced || "ทั่วไป"})`;
    }

    document.getElementById("picContractId").value = targetId;
    document.getElementById("picDueDate").value = getLocalDateStr();
    document.getElementById("picPrincipalAmount").value = "";
    document.getElementById("picInterestAmount").value = contract.interestCutAmount || "";

    const modal = document.getElementById("principalInterestCutModal");
    if (modal) modal.classList.add("active");
  };

  window.closePrincipalInterestCutModal = function () {
    const modal = document.getElementById("principalInterestCutModal");
    if (modal) modal.classList.remove("active");
  };

  window.submitPrincipalInterestCut = async function (e) {
    if (e) e.preventDefault();
    const contractId = document.getElementById("picContractId").value;
    const dueDate = document.getElementById("picDueDate").value || getLocalDateStr();
    const principalCutAmount = parseFloat(document.getElementById("picPrincipalAmount").value) || 0;
    const interestCutAmount = parseFloat(document.getElementById("picInterestAmount").value) || 0;

    if (!contractId || (principalCutAmount <= 0 && interestCutAmount <= 0)) {
      alert("กรุณากรอกยอดต้นที่ต้องการตัด หรือยอดดอกที่ต้องการตัด (ต้องมากกว่า 0)");
      return;
    }

    await window.easyFinanceDB.addPrincipalInterestCutInstallment(contractId, {
      dueDate: dueDate,
      principalCutAmount: principalCutAmount,
      interestCutAmount: interestCutAmount
    });

    closePrincipalInterestCutModal();
    showAdminToast(`เพิ่มงวดตัดต้น ฿${principalCutAmount.toLocaleString()} / ตัดดอก ฿${interestCutAmount.toLocaleString()} สำเร็จ!`, "success");

    if (currentViewingContractId === contractId) {
      openContractDetails(contractId);
    }
    renderStatsCounters();
    renderSubTabs();
    renderActiveTabTable();
  };

  // เปิด Modal เพิ่มงวดแมนนวล
  window.openAddManualInstallmentModal = function (contractId = null) {
    const targetId = contractId || currentViewingContractId;
    if (!targetId) {
      showAdminToast("กรุณาเลือกสัญญาที่ต้องการเพิ่มงวด", "error");
      return;
    }
    const contract = window.easyFinanceDB.getContractById(targetId);
    if (!contract) return;

    const bannerText = document.getElementById("manualContractBannerText");
    if (bannerText) {
      bannerText.innerHTML = `สัญญา: <strong style="color: #fff;">${contract.id}</strong> - ${contract.name} (${contract.itemFinanced || "ทั่วไป"})`;
    }

    const nextInstNo = (contract.installments && contract.installments.length > 0)
      ? Math.max(...contract.installments.map((i) => Number(i.installmentNo) || 0)) + 1
      : 1;

    document.getElementById("manualContractId").value = targetId;
    document.getElementById("manualInstallmentNo").value = nextInstNo;

    let defaultDueDate = getLocalDateStr();
    if (contract.installments && contract.installments.length > 0) {
      const lastInst = contract.installments[contract.installments.length - 1];
      if (lastInst && lastInst.dueDate) {
        try {
          const d = new Date(lastInst.dueDate);
          if (!isNaN(d.getTime())) {
            if (contract.paymentFrequency === "daily") d.setDate(d.getDate() + 1);
            else if (contract.paymentFrequency === "weekly") d.setDate(d.getDate() + 7);
            else d.setMonth(d.getMonth() + 1);
            defaultDueDate = d.toISOString().slice(0, 10);
          }
        } catch (e) {}
      }
    }
    document.getElementById("manualDueDate").value = defaultDueDate;

    const firstAmt = (contract.installments && contract.installments[0]?.amount) || 0;
    document.getElementById("manualAmount").value = firstAmt || "";

    const modal = document.getElementById("addManualInstallmentModal");
    if (modal) modal.classList.add("active");
  };

  window.closeAddManualInstallmentModal = function () {
    const modal = document.getElementById("addManualInstallmentModal");
    if (modal) modal.classList.remove("active");
  };

  window.submitAddManualInstallment = async function (e) {
    if (e) e.preventDefault();
    const contractId = document.getElementById("manualContractId").value;
    const instNo = parseInt(document.getElementById("manualInstallmentNo").value, 10);
    const dueDate = document.getElementById("manualDueDate").value;
    const amount = parseFloat(document.getElementById("manualAmount").value) || 0;

    if (!contractId || !instNo || !dueDate || amount <= 0) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง (ยอดค่างวดต้องมากกว่า 0)");
      return;
    }

    await window.easyFinanceDB.addManualInstallment(contractId, {
      installmentNo: instNo,
      dueDate: dueDate,
      amount: amount
    });

    closeAddManualInstallmentModal();
    showAdminToast(`คีย์เพิ่มงวดที่ ${instNo} ยอด ฿${amount.toLocaleString()} สำเร็จ!`, "success");

    if (currentViewingContractId === contractId) {
      openContractDetails(contractId);
    }
    renderStatsCounters();
    renderSubTabs();
    renderActiveTabTable();
  };

  // เปิด Modal แก้ไขงวดชำระ
  window.openEditInstallmentModal = function (contractId, installmentNo, amount, dueDate) {
    const contract = window.easyFinanceDB.getContractById(contractId);
    const bannerText = document.getElementById("editContractBannerText");
    if (bannerText) {
      bannerText.innerHTML = contract
        ? `สัญญา: <strong style="color: #fff;">${contract.id}</strong> - ${contract.name} (งวดที่ ${installmentNo})`
        : `สัญญา: <strong style="color: #fff;">${contractId}</strong> (งวดที่ ${installmentNo})`;
    }

    document.getElementById("editContractId").value = contractId;
    document.getElementById("editInstallmentNo").value = installmentNo;
    document.getElementById("editDueDate").value = dueDate ? dueDate.slice(0, 10) : getLocalDateStr();
    document.getElementById("editAmount").value = amount;
    const titleEl = document.getElementById("editInstallmentModalTitle");
    if (titleEl) titleEl.textContent = `แก้ไขงวดที่ ${installmentNo} (สัญญา ${contractId})`;

    const modal = document.getElementById("editInstallmentModal");
    if (modal) modal.classList.add("active");
  };

  window.closeEditInstallmentModal = function () {
    const modal = document.getElementById("editInstallmentModal");
    if (modal) modal.classList.remove("active");
  };

  window.submitEditInstallment = async function (e) {
    if (e) e.preventDefault();
    const contractId = document.getElementById("editContractId").value;
    const installmentNo = parseInt(document.getElementById("editInstallmentNo").value, 10);
    const dueDate = document.getElementById("editDueDate").value;
    const amount = parseFloat(document.getElementById("editAmount").value) || 0;

    if (!contractId || !installmentNo || !dueDate || amount < 0) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง");
      return;
    }

    await window.easyFinanceDB.updateInstallment(contractId, installmentNo, {
      amount: amount,
      dueDate: dueDate
    });

    closeEditInstallmentModal();
    showAdminToast(`แก้ไขงวดที่ ${installmentNo} ยอดใหม่ ฿${amount.toLocaleString()} สำเร็จ!`, "success");

    if (currentViewingContractId === contractId) {
      openContractDetails(contractId);
    }
    renderStatsCounters();
    renderSubTabs();
    renderActiveTabTable();
  };

  // --- DAILY INTEREST CUT REPORT HANDLERS (Requirement 3.3 & 3.3.1) ---

  window.openInterestCutReportModal = function () {
    const datePicker = document.getElementById("interestCutDatePicker");
    if (datePicker) {
      datePicker.value = selectedDailyDate || getLocalDateStr();
    }
    renderInterestCutReport(datePicker ? datePicker.value : getLocalDateStr());
    const modal = document.getElementById("interestCutReportModal");
    if (modal) modal.classList.add("active");
  };

  window.closeInterestCutReportModal = function () {
    const modal = document.getElementById("interestCutReportModal");
    if (modal) modal.classList.remove("active");
  };

  window.onInterestCutDateChange = function (dateVal) {
    renderInterestCutReport(dateVal);
  };

  window.setInterestCutDateToday = function () {
    const today = getLocalDateStr();
    const datePicker = document.getElementById("interestCutDatePicker");
    if (datePicker) datePicker.value = today;
    renderInterestCutReport(today);
  };

  window.showAllInterestCuts = function () {
    const datePicker = document.getElementById("interestCutDatePicker");
    if (datePicker) datePicker.value = "";
    renderInterestCutReport(null);
  };

  window.cancelInterestCutFromReport = async function (contractId, installmentNo) {
    if (confirm(`ยืนยันการยกเลิกตัดดอก งวดที่ ${installmentNo} สัญญา ${contractId}?`)) {
      await window.easyFinanceDB.unmarkInstallmentInterestCut(contractId, installmentNo);
      showAdminToast(`ยกเลิกตัดดอกงวดที่ ${installmentNo} แล้ว`, "info");
      const datePicker = document.getElementById("interestCutDatePicker");
      renderInterestCutReport(datePicker && datePicker.value ? datePicker.value : null);
      if (currentViewingContractId === contractId) {
        openContractDetails(contractId);
      }
      renderStatsCounters();
      renderSubTabs();
      renderActiveTabTable();
    }
  };

  window.renderInterestCutReport = function (filterDateStr = null) {
    const allHistory = window.easyFinanceDB.getAllInterestCutHistory ? window.easyFinanceDB.getAllInterestCutHistory() : [];
    const tableBody = document.getElementById("interestCutTableBody");
    const breakdownBody = document.getElementById("interestCutDailyBreakdownBody");
    const countBadge = document.getElementById("interestCutCountBadge");
    const titleEl = document.getElementById("interestCutListTitle");
    const badgesContainer = document.getElementById("interestCutSummaryBadges");

    const filteredList = filterDateStr
      ? allHistory.filter((h) => (h.dateStr && h.dateStr === filterDateStr) || (h.paidAt && h.paidAt.includes(filterDateStr)))
      : allHistory;

    const totalAmountFiltered = filteredList.reduce((sum, h) => sum + (Number(h.amount) || 0), 0);
    const totalAmountAll = allHistory.reduce((sum, h) => sum + (Number(h.amount) || 0), 0);

    if (titleEl) {
      titleEl.textContent = filterDateStr
        ? `รายการลูกค้าที่ตัดดอกประจำวันที่ ${formatDateThai(filterDateStr)}`
        : "รายการลูกค้าที่ตัดดอกทั้งหมด (ทุกวัน)";
    }
    if (countBadge) {
      countBadge.textContent = `${filteredList.length} รายการ (฿${totalAmountFiltered.toLocaleString()})`;
    }

    if (badgesContainer) {
      badgesContainer.innerHTML = `
        <div style="background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 8px; padding: 6px 12px; font-size: 0.82rem; color: #38bdf8; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-calendar-day"></i>
          <span>ยอดตัดดอกวันที่เลือก: <strong>฿${totalAmountFiltered.toLocaleString()}</strong> (${filteredList.length} ราย)</span>
        </div>
        <div style="background: rgba(147, 51, 234, 0.15); border: 1px solid rgba(147, 51, 234, 0.4); border-radius: 8px; padding: 6px 12px; font-size: 0.82rem; color: #c084fc; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-vault"></i>
          <span>ยอดตัดดอกรวมทั้งหมด: <strong>฿${totalAmountAll.toLocaleString()}</strong> (${allHistory.length} ราย)</span>
        </div>
      `;
    }

    if (tableBody) {
      tableBody.innerHTML = "";
      if (filteredList.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-dim); padding: 20px;">ไม่พบรายการตัดดอก${filterDateStr ? ` ในวันที่ ${formatDateThai(filterDateStr)}` : ""}</td></tr>`;
      } else {
        filteredList.forEach((item) => {
          const tr = document.createElement("tr");
          tr.className = "tr-interest-cut";
          tr.innerHTML = `
            <td>${item.paidAt || item.dateStr || "-"}</td>
            <td>
              <strong style="color: #fff;">${item.contractName}</strong>
              <span style="font-size: 0.72rem; color: var(--text-dim); display: block;">รหัส: ${item.contractId} (${item.phone || "-"})</span>
            </td>
            <td>${item.itemFinanced || "-"}</td>
            <td><span class="status-badge badge-interest">งวดที่ ${item.installmentNo}</span></td>
            <td><strong style="color: #38bdf8; font-size: 0.95rem;">฿${Number(item.amount || 0).toLocaleString()}</strong></td>
            <td>
              <div style="display: flex; gap: 6px;">
                <button type="button" class="btn-table-action" onclick="openContractDetails('${item.contractId}')" style="padding: 4px 8px; font-size: 0.75rem; color: #38bdf8; background: rgba(56, 189, 248, 0.15);">
                  <i class="fa-solid fa-eye"></i> ดูสัญญา
                </button>
                <button type="button" class="btn-table-action" onclick="cancelInterestCutFromReport('${item.contractId}', ${item.installmentNo})" style="padding: 4px 8px; font-size: 0.75rem; color: #f87171; background: rgba(248, 113, 113, 0.15);">
                  <i class="fa-solid fa-rotate-left"></i> ยกเลิก
                </button>
              </div>
            </td>
          `;
          tableBody.appendChild(tr);
        });
      }
    }

    if (breakdownBody) {
      breakdownBody.innerHTML = "";
      const grouped = {};
      allHistory.forEach((h) => {
        const d = h.dateStr || (h.paidAt ? h.paidAt.slice(0, 10) : "ไม่ระบุ");
        if (!grouped[d]) {
          grouped[d] = {
            dateStr: d,
            count: 0,
            totalAmount: 0,
            clients: []
          };
        }
        grouped[d].count += 1;
        grouped[d].totalAmount += Number(h.amount) || 0;
        if (!grouped[d].clients.includes(h.contractName)) {
          grouped[d].clients.push(h.contractName);
        }
      });

      const dates = Object.keys(grouped).sort().reverse();
      if (dates.length === 0) {
        breakdownBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-dim); padding: 18px;">ยังไม่มีประวัติการตัดดอกในระบบ</td></tr>`;
      } else {
        dates.forEach((d) => {
          const row = grouped[d];
          const isSelected = filterDateStr === d;
          const tr = document.createElement("tr");
          if (isSelected) {
            tr.style.background = "rgba(56, 189, 248, 0.15)";
          }
          tr.innerHTML = `
            <td><strong>${formatDateThai(d)}</strong> <span style="font-size: 0.72rem; color: var(--text-dim);">(${d})</span></td>
            <td><span class="status-badge badge-interest">${row.count} ราย</span></td>
            <td><strong style="color: #38bdf8; font-size: 0.95rem;">฿${row.totalAmount.toLocaleString()}</strong></td>
            <td style="font-size: 0.8rem; color: #cbd5e1;">${row.clients.join(", ")}</td>
            <td>
              <button type="button" class="btn-table-action" onclick="document.getElementById('interestCutDatePicker').value='${d}'; onInterestCutDateChange('${d}');" style="padding: 4px 10px; font-size: 0.75rem; background: rgba(56, 189, 248, 0.2); color: #38bdf8;">
                <i class="fa-solid fa-filter"></i> เลือกดูวันนี้
              </button>
            </td>
          `;
          breakdownBody.appendChild(tr);
        });
      }
    }
  };

  if (cardStatInterestCut) {
    cardStatInterestCut.addEventListener("click", () => {
      openInterestCutReportModal();
    });
  }

  // --- DAILY DOWN PAYMENT REPORT HANDLERS ---

  window.openDownPaymentReportModal = function () {
    const datePicker = document.getElementById("downPaymentDatePicker");
    if (datePicker) {
      datePicker.value = selectedDailyDate || getLocalDateStr();
    }
    renderDownPaymentReport(datePicker ? datePicker.value : getLocalDateStr());
    const modal = document.getElementById("downPaymentReportModal");
    if (modal) modal.classList.add("active");
  };

  window.closeDownPaymentReportModal = function () {
    const modal = document.getElementById("downPaymentReportModal");
    if (modal) modal.classList.remove("active");
  };

  window.onDownPaymentDateChange = function (dateVal) {
    renderDownPaymentReport(dateVal);
  };

  window.setDownPaymentDateToday = function () {
    const today = getLocalDateStr();
    const datePicker = document.getElementById("downPaymentDatePicker");
    if (datePicker) datePicker.value = today;
    renderDownPaymentReport(today);
  };

  window.showAllDownPayments = function () {
    const datePicker = document.getElementById("downPaymentDatePicker");
    if (datePicker) datePicker.value = "";
    renderDownPaymentReport(null);
  };

  window.renderDownPaymentReport = function (filterDateStr = null) {
    const allHistory = window.easyFinanceDB.getAllDownPaymentHistory ? window.easyFinanceDB.getAllDownPaymentHistory() : [];
    const tableBody = document.getElementById("downPaymentTableBody");
    const breakdownBody = document.getElementById("downPaymentDailyBreakdownBody");
    const countBadge = document.getElementById("downPaymentCountBadge");
    const titleEl = document.getElementById("downPaymentListTitle");
    const badgesContainer = document.getElementById("downPaymentSummaryBadges");

    const filteredList = filterDateStr
      ? allHistory.filter((h) => (h.dateStr && h.dateStr === filterDateStr) || (h.paidAt && h.paidAt.includes(filterDateStr)))
      : allHistory;

    const totalAmountFiltered = filteredList.reduce((sum, h) => sum + (Number(h.amount) || 0), 0);
    const totalAmountAll = allHistory.reduce((sum, h) => sum + (Number(h.amount) || 0), 0);

    if (titleEl) {
      titleEl.textContent = filterDateStr
        ? `รายการลูกค้าที่ชำระเงินดาวน์ประจำวันที่ ${formatDateThai(filterDateStr)}`
        : "รายการลูกค้าที่ชำระเงินดาวน์ทั้งหมด (ทุกวัน)";
    }
    if (countBadge) {
      countBadge.textContent = `${filteredList.length} รายการ (฿${totalAmountFiltered.toLocaleString()})`;
    }

    if (badgesContainer) {
      badgesContainer.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 8px; padding: 6px 12px; font-size: 0.82rem; color: #34d399; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-calendar-day"></i>
          <span>เงินดาวน์วันที่เลือก: <strong>฿${totalAmountFiltered.toLocaleString()}</strong> (${filteredList.length} ราย)</span>
        </div>
        <div style="background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 8px; padding: 6px 12px; font-size: 0.82rem; color: #38bdf8; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-coins"></i>
          <span>ยอดเงินดาวน์รวมทั้งหมด: <strong>฿${totalAmountAll.toLocaleString()}</strong> (${allHistory.length} ราย)</span>
        </div>
      `;
    }

    if (tableBody) {
      tableBody.innerHTML = "";
      if (filteredList.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-dim); padding: 25px;">ไม่พบรายการเงินดาวน์${filterDateStr ? ` ในวันที่ ${formatDateThai(filterDateStr)}` : ""}</td></tr>`;
      } else {
        filteredList.forEach((item) => {
          const tr = document.createElement("tr");
          tr.className = "tr-down-payment";
          const catBadges = {
            motorcycle: '<span class="status-badge" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3);"><i class="fa-solid fa-motorcycle"></i> รถมอไซค์</span>',
            gold: '<span class="status-badge" style="background: rgba(234, 179, 8, 0.15); color: #facc15; border: 1px solid rgba(234, 179, 8, 0.3);"><i class="fa-solid fa-coins"></i> ผ่อนทอง</span>',
            general: '<span class="status-badge" style="background: rgba(148, 163, 184, 0.15); color: #cbd5e1; border: 1px solid rgba(148, 163, 184, 0.3);">ทั่วไป</span>'
          };
          const badgeHtml = catBadges[item.itemCategory] || catBadges.general;

          tr.innerHTML = `
            <td>${item.paidAt ? formatDateThai(item.paidAt) : "-"}</td>
            <td>
              <strong style="color: #fff;">${item.contractName}</strong>
              <span style="font-size: 0.72rem; color: var(--text-dim); display: block;">รหัส: ${item.contractId} (${item.phone || "-"})</span>
            </td>
            <td>${item.itemFinanced || "-"}</td>
            <td>${badgeHtml}</td>
            <td style="text-align: right;"><strong style="color: #34d399; font-size: 0.95rem;">฿${Number(item.amount || 0).toLocaleString()}</strong></td>
            <td style="text-align: center;">
              <button type="button" class="btn-table-action" onclick="openContractDetails('${item.contractId}')" style="padding: 4px 10px; font-size: 0.75rem; color: #34d399; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3);">
                <i class="fa-solid fa-eye"></i> ดูสัญญา
              </button>
            </td>
          `;
          tableBody.appendChild(tr);
        });
      }
    }

    if (breakdownBody) {
      breakdownBody.innerHTML = "";
      const grouped = {};
      allHistory.forEach((h) => {
        const d = h.dateStr || (h.paidAt ? h.paidAt.slice(0, 10) : "ไม่ระบุ");
        if (!grouped[d]) {
          grouped[d] = {
            dateStr: d,
            count: 0,
            totalAmount: 0,
            clients: []
          };
        }
        grouped[d].count += 1;
        grouped[d].totalAmount += Number(h.amount) || 0;
        if (!grouped[d].clients.includes(h.contractName)) {
          grouped[d].clients.push(h.contractName);
        }
      });

      const dates = Object.keys(grouped).sort().reverse();
      if (dates.length === 0) {
        breakdownBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-dim); padding: 18px;">ยังไม่มีประวัติเงินดาวน์ในระบบ</td></tr>`;
      } else {
        dates.forEach((d) => {
          const row = grouped[d];
          const isSelected = filterDateStr === d;
          const tr = document.createElement("tr");
          if (isSelected) {
            tr.style.background = "rgba(16, 185, 129, 0.12)";
          }
          tr.innerHTML = `
            <td><strong>${formatDateThai(d)}</strong> <span style="font-size: 0.72rem; color: var(--text-dim);">(${d})</span></td>
            <td style="text-align: center;"><span class="status-badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);">${row.count} ราย</span></td>
            <td style="text-align: right;"><strong style="color: #34d399; font-size: 0.95rem;">฿${row.totalAmount.toLocaleString()}</strong></td>
            <td style="font-size: 0.8rem; color: #cbd5e1;">${row.clients.join(", ")}</td>
            <td style="text-align: center;">
              <button type="button" class="btn-table-action" onclick="document.getElementById('downPaymentDatePicker').value='${d}'; onDownPaymentDateChange('${d}');" style="padding: 4px 10px; font-size: 0.75rem; background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.35);">
                <i class="fa-solid fa-filter"></i> เลือกดูวันนี้
              </button>
            </td>
          `;
          breakdownBody.appendChild(tr);
        });
      }
    }
  };

  if (cardStatDownPayment) {
    cardStatDownPayment.addEventListener("click", () => {
      openDownPaymentReportModal();
    });
  }

  // --- DAILY ALL CATEGORIES REPORT HANDLERS (ช่องสรุปรวมต่อวัน: รวมรับแล้ว รายวัน รายอาทิตย์ รายเดือน รถมอเตอร์ไซค์) ---

  window.openDailyAllCategoriesReportModal = function () {
    const datePicker = document.getElementById("dailyAllCategoriesDatePicker");
    if (datePicker) {
      datePicker.value = selectedDailyDate || getLocalDateStr();
    }
    renderDailyAllCategoriesReport(datePicker ? datePicker.value : getLocalDateStr());
    const modal = document.getElementById("dailyAllCategoriesReportModal");
    if (modal) modal.classList.add("active");
  };

  window.closeDailyAllCategoriesReportModal = function () {
    const modal = document.getElementById("dailyAllCategoriesReportModal");
    if (modal) modal.classList.remove("active");
  };

  window.onDailyAllCategoriesDateChange = function (dateVal) {
    renderDailyAllCategoriesReport(dateVal);
  };

  window.setDailyAllCategoriesDateToday = function () {
    const today = getLocalDateStr();
    const datePicker = document.getElementById("dailyAllCategoriesDatePicker");
    if (datePicker) datePicker.value = today;
    renderDailyAllCategoriesReport(today);
  };

  window.showAllDailyCategoriesPayments = function () {
    const datePicker = document.getElementById("dailyAllCategoriesDatePicker");
    if (datePicker) datePicker.value = "";
    renderDailyAllCategoriesReport(null);
  };

  window.renderDailyAllCategoriesReport = function (filterDateStr = null) {
    const allHistory = window.easyFinanceDB.getAllDailyAllCategoriesHistory ? window.easyFinanceDB.getAllDailyAllCategoriesHistory() : [];
    const tableBody = document.getElementById("dailyAllCategoriesTableBody");
    const breakdownBody = document.getElementById("dailyAllCategoriesBreakdownBody");
    const countBadge = document.getElementById("dailyAllCategoriesCountBadge");
    const titleEl = document.getElementById("dailyAllCategoriesListTitle");
    const badgesContainer = document.getElementById("dailyAllCategoriesSummaryBadges");
    const cardsGrid = document.getElementById("dailyAllCategoriesCardsGrid");

    const filteredList = filterDateStr
      ? allHistory.filter((h) => (h.dateStr && h.dateStr === filterDateStr) || (h.paidAt && h.paidAt.includes(filterDateStr)))
      : allHistory;

    const totalAmountFiltered = filteredList.reduce((sum, h) => sum + (Number(h.amount) || 0), 0);
    const totalAmountAll = allHistory.reduce((sum, h) => sum + (Number(h.amount) || 0), 0);

    // คำนวณสรุป 5 หมวดหมู่ของวันที่เลือก (รายวัน / รายอาทิตย์ / รายเดือน / มอเตอร์ไซค์ / ตัดดอก - Requirement 5)
    const catTotals = {
      daily: { title: "หมวดรายวัน", amount: 0, count: 0, color: "#34d399", bg: "rgba(16, 185, 129, 0.15)", border: "rgba(16, 185, 129, 0.35)", icon: "fa-solid fa-clock" },
      weekly: { title: "หมวดรายอาทิตย์", amount: 0, count: 0, color: "#60a5fa", bg: "rgba(59, 130, 246, 0.15)", border: "rgba(59, 130, 246, 0.35)", icon: "fa-solid fa-calendar-week" },
      monthly: { title: "หมวดรายเดือน", amount: 0, count: 0, color: "#c084fc", bg: "rgba(168, 85, 247, 0.15)", border: "rgba(168, 85, 247, 0.35)", icon: "fa-solid fa-calendar-days" },
      motorcycle: { title: "หมวดรถมอเตอร์ไซค์", amount: 0, count: 0, color: "#38bdf8", bg: "rgba(56, 189, 248, 0.15)", border: "rgba(56, 189, 248, 0.35)", icon: "fa-solid fa-motorcycle" },
      interest_cut: { title: "หมวดตัดดอก", amount: 0, count: 0, color: "#22d3ee", bg: "rgba(6, 182, 212, 0.15)", border: "rgba(6, 182, 212, 0.35)", icon: "fa-solid fa-percent" }
    };

    filteredList.forEach((item) => {
      const c = item.category || "daily";
      if (catTotals[c]) {
        catTotals[c].amount += Number(item.amount) || 0;
        catTotals[c].count += 1;
      }
    });

    if (titleEl) {
      titleEl.textContent = filterDateStr
        ? `รายการรับชำระเงินทุกหมวดประจำวันที่ ${formatDateThai(filterDateStr)} (รวมตัดดอก)`
        : "รายการรับชำระเงินทุกหมวดทั้งหมด (ทุกวันสะสม รวมตัดดอก)";
    }
    if (countBadge) {
      countBadge.textContent = `${filteredList.length} รายการ (รวม ฿${totalAmountFiltered.toLocaleString()})`;
    }

    if (badgesContainer) {
      badgesContainer.innerHTML = `
        <div style="background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.4); border-radius: 8px; padding: 6px 12px; font-size: 0.82rem; color: #c084fc; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-calendar-day"></i>
          <span>ยอดรับแล้ววันที่เลือก: <strong>฿${totalAmountFiltered.toLocaleString()}</strong> (${filteredList.length} รายการ)</span>
        </div>
        <div style="background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 8px; padding: 6px 12px; font-size: 0.82rem; color: #38bdf8; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-layer-group"></i>
          <span>ยอดรับแล้วสะสมทั้งหมด: <strong>฿${totalAmountAll.toLocaleString()}</strong> (${allHistory.length} รายการ)</span>
        </div>
      `;
    }

    if (cardsGrid) {
      cardsGrid.innerHTML = `
        <div class="cat-mini-summary-card" style="border-left: 3px solid ${catTotals.daily.color};">
          <div>
            <div style="font-size: 0.78rem; color: var(--text-dim); display: flex; align-items: center; gap: 5px;">
              <i class="${catTotals.daily.icon}" style="color: ${catTotals.daily.color};"></i> ${catTotals.daily.title}
            </div>
            <div style="font-size: 1.15rem; font-weight: 700; color: ${catTotals.daily.color}; margin-top: 2px;">
              ฿${catTotals.daily.amount.toLocaleString()}
            </div>
          </div>
          <div style="text-align: right;">
            <span class="status-badge" style="background: ${catTotals.daily.bg}; color: ${catTotals.daily.color}; border: 1px solid ${catTotals.daily.border}; font-size: 0.72rem;">
              ${catTotals.daily.count} รายการ
            </span>
          </div>
        </div>

        <div class="cat-mini-summary-card" style="border-left: 3px solid ${catTotals.weekly.color};">
          <div>
            <div style="font-size: 0.78rem; color: var(--text-dim); display: flex; align-items: center; gap: 5px;">
              <i class="${catTotals.weekly.icon}" style="color: ${catTotals.weekly.color};"></i> ${catTotals.weekly.title}
            </div>
            <div style="font-size: 1.15rem; font-weight: 700; color: ${catTotals.weekly.color}; margin-top: 2px;">
              ฿${catTotals.weekly.amount.toLocaleString()}
            </div>
          </div>
          <div style="text-align: right;">
            <span class="status-badge" style="background: ${catTotals.weekly.bg}; color: ${catTotals.weekly.color}; border: 1px solid ${catTotals.weekly.border}; font-size: 0.72rem;">
              ${catTotals.weekly.count} รายการ
            </span>
          </div>
        </div>

        <div class="cat-mini-summary-card" style="border-left: 3px solid ${catTotals.monthly.color};">
          <div>
            <div style="font-size: 0.78rem; color: var(--text-dim); display: flex; align-items: center; gap: 5px;">
              <i class="${catTotals.monthly.icon}" style="color: ${catTotals.monthly.color};"></i> ${catTotals.monthly.title}
            </div>
            <div style="font-size: 1.15rem; font-weight: 700; color: ${catTotals.monthly.color}; margin-top: 2px;">
              ฿${catTotals.monthly.amount.toLocaleString()}
            </div>
          </div>
          <div style="text-align: right;">
            <span class="status-badge" style="background: ${catTotals.monthly.bg}; color: ${catTotals.monthly.color}; border: 1px solid ${catTotals.monthly.border}; font-size: 0.72rem;">
              ${catTotals.monthly.count} รายการ
            </span>
          </div>
        </div>

        <div class="cat-mini-summary-card" style="border-left: 3px solid ${catTotals.motorcycle.color};">
          <div>
            <div style="font-size: 0.78rem; color: var(--text-dim); display: flex; align-items: center; gap: 5px;">
              <i class="${catTotals.motorcycle.icon}" style="color: ${catTotals.motorcycle.color};"></i> ${catTotals.motorcycle.title}
            </div>
            <div style="font-size: 1.15rem; font-weight: 700; color: ${catTotals.motorcycle.color}; margin-top: 2px;">
              ฿${catTotals.motorcycle.amount.toLocaleString()}
            </div>
          </div>
          <div style="text-align: right;">
            <span class="status-badge" style="background: ${catTotals.motorcycle.bg}; color: ${catTotals.motorcycle.color}; border: 1px solid ${catTotals.motorcycle.border}; font-size: 0.72rem;">
              ${catTotals.motorcycle.count} รายการ
            </span>
          </div>
        </div>

        <div class="cat-mini-summary-card" style="border-left: 3px solid ${catTotals.interest_cut.color};">
          <div>
            <div style="font-size: 0.78rem; color: var(--text-dim); display: flex; align-items: center; gap: 5px;">
              <i class="${catTotals.interest_cut.icon}" style="color: ${catTotals.interest_cut.color};"></i> ${catTotals.interest_cut.title}
            </div>
            <div style="font-size: 1.15rem; font-weight: 700; color: ${catTotals.interest_cut.color}; margin-top: 2px;">
              ฿${catTotals.interest_cut.amount.toLocaleString()}
            </div>
          </div>
          <div style="text-align: right;">
            <span class="status-badge badge-cat-interest-cut" style="font-size: 0.72rem;">
              ${catTotals.interest_cut.count} รายการ
            </span>
          </div>
        </div>
      `;
    }

    if (tableBody) {
      tableBody.innerHTML = "";
      if (filteredList.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 25px;">ไม่พบรายการรับชำระ${filterDateStr ? ` ในวันที่ ${formatDateThai(filterDateStr)}` : ""}</td></tr>`;
      } else {
        const catBadges = {
          motorcycle: '<span class="status-badge badge-cat-motorcycle"><i class="fa-solid fa-motorcycle"></i> รถมอเตอร์ไซค์</span>',
          daily: '<span class="status-badge badge-cat-daily"><i class="fa-solid fa-clock"></i> รายวัน</span>',
          weekly: '<span class="status-badge badge-cat-weekly"><i class="fa-solid fa-calendar-week"></i> รายอาทิตย์</span>',
          monthly: '<span class="status-badge badge-cat-monthly"><i class="fa-solid fa-calendar-days"></i> รายเดือน</span>',
          interest_cut: '<span class="status-badge badge-cat-interest-cut"><i class="fa-solid fa-percent"></i> ตัดดอก</span>'
        };

        filteredList.forEach((item) => {
          const tr = document.createElement("tr");
          tr.className = "tr-daily-category-item";
          const badgeHtml = catBadges[item.category] || (item.isDirectFine ? '<span class="status-badge" style="background: rgba(251, 146, 60, 0.15); color: #fb923c; border: 1px solid rgba(251, 146, 60, 0.3);">ค่าปรับล่าช้า</span>' : catBadges.daily);

          let instCol = item.isDirectFine
            ? '<span class="status-badge" style="background: rgba(251, 146, 60, 0.15); color: #fb923c; border: 1px solid rgba(251, 146, 60, 0.3);">ค่าปรับล่าช้า</span>'
            : (item.installmentNo || "-");

          if (item.fineAmount > 0 && !item.isDirectFine) {
            instCol += `<span style="font-size: 0.72rem; color: #fb923c; display: block;">+ ค่าปรับ ฿${Number(item.fineAmount).toLocaleString()}</span>`;
          }

          let amountSub = "";
          if (item.baseAmount > 0 && item.fineAmount > 0) {
            amountSub = `<span style="font-size: 0.7rem; color: var(--text-dim); display: block;">(ค่างวด ฿${Number(item.baseAmount).toLocaleString()})</span>`;
          }

          let slipBtn = "";
          if (item.slipUrl) {
            slipBtn = `
              <button type="button" class="btn-table-action" onclick="viewSlip('${item.slipUrl}', 'สลิป ${item.contractName} (${item.categoryLabel})')" style="padding: 4px 8px; font-size: 0.75rem; color: #38bdf8; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.3); margin-left: 4px;">
                <i class="fa-solid fa-image"></i> สลิป
              </button>
            `;
          }

          tr.innerHTML = `
            <td>${item.paidAt ? formatDateThai(item.paidAt) : (item.dateStr ? formatDateThai(item.dateStr) : "-")}</td>
            <td>
              <strong style="color: #fff;">${item.contractName}</strong>
              <span style="font-size: 0.72rem; color: var(--text-dim); display: block;">รหัส: ${item.contractId} (${item.phone || "-"})</span>
            </td>
            <td>${item.itemFinanced || "-"}</td>
            <td style="text-align: center;">${badgeHtml}</td>
            <td>${instCol}</td>
            <td style="text-align: right;">
              <strong style="color: #34d399; font-size: 0.95rem;">฿${Number(item.amount || 0).toLocaleString()}</strong>
              ${amountSub}
            </td>
            <td style="text-align: center;">
              <button type="button" class="btn-table-action" onclick="openContractDetails('${item.contractId}')" style="padding: 4px 10px; font-size: 0.75rem; color: #c084fc; background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.3);">
                <i class="fa-solid fa-eye"></i> ดูสัญญา
              </button>
              ${slipBtn}
            </td>
          `;
          tableBody.appendChild(tr);
        });
      }
    }

    if (breakdownBody) {
      breakdownBody.innerHTML = "";
      const grouped = {};
      allHistory.forEach((h) => {
        const d = h.dateStr || (h.paidAt ? h.paidAt.slice(0, 10) : "ไม่ระบุ");
        if (!grouped[d]) {
          grouped[d] = {
            dateStr: d,
            count: 0,
            totalAmount: 0,
            dailyAmount: 0,
            dailyCount: 0,
            weeklyAmount: 0,
            weeklyCount: 0,
            monthlyAmount: 0,
            monthlyCount: 0,
            motorcycleAmount: 0,
            motorcycleCount: 0,
            interestCutAmount: 0,
            interestCutCount: 0,
            clients: []
          };
        }
        const amt = Number(h.amount) || 0;
        grouped[d].count += 1;
        grouped[d].totalAmount += amt;

        if (h.category === "daily") {
          grouped[d].dailyAmount += amt;
          grouped[d].dailyCount += 1;
        } else if (h.category === "weekly") {
          grouped[d].weeklyAmount += amt;
          grouped[d].weeklyCount += 1;
        } else if (h.category === "monthly") {
          grouped[d].monthlyAmount += amt;
          grouped[d].monthlyCount += 1;
        } else if (h.category === "motorcycle") {
          grouped[d].motorcycleAmount += amt;
          grouped[d].motorcycleCount += 1;
        } else if (h.category === "interest_cut") {
          grouped[d].interestCutAmount += amt;
          grouped[d].interestCutCount += 1;
        }

        if (h.contractName && !grouped[d].clients.includes(h.contractName)) {
          grouped[d].clients.push(h.contractName);
        }
      });

      const dates = Object.keys(grouped).sort().reverse();
      if (dates.length === 0) {
        breakdownBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-dim); padding: 18px;">ยังไม่มีประวัติการรับชำระในระบบ</td></tr>`;
      } else {
        dates.forEach((d) => {
          const row = grouped[d];
          const isSelected = filterDateStr === d;
          const tr = document.createElement("tr");
          if (isSelected) {
            tr.style.background = "rgba(168, 85, 247, 0.12)";
          }

          let catChips = "";
          if (row.dailyAmount > 0) {
            catChips += `<span class="status-badge badge-cat-daily" style="margin: 2px; font-size: 0.72rem;"><i class="fa-solid fa-clock"></i> รายวัน: ฿${row.dailyAmount.toLocaleString()} (${row.dailyCount})</span>`;
          }
          if (row.weeklyAmount > 0) {
            catChips += `<span class="status-badge badge-cat-weekly" style="margin: 2px; font-size: 0.72rem;"><i class="fa-solid fa-calendar-week"></i> รายอาทิตย์: ฿${row.weeklyAmount.toLocaleString()} (${row.weeklyCount})</span>`;
          }
          if (row.monthlyAmount > 0) {
            catChips += `<span class="status-badge badge-cat-monthly" style="margin: 2px; font-size: 0.72rem;"><i class="fa-solid fa-calendar-days"></i> รายเดือน: ฿${row.monthlyAmount.toLocaleString()} (${row.monthlyCount})</span>`;
          }
          if (row.motorcycleAmount > 0) {
            catChips += `<span class="status-badge badge-cat-motorcycle" style="margin: 2px; font-size: 0.72rem;"><i class="fa-solid fa-motorcycle"></i> มอเตอร์ไซค์: ฿${row.motorcycleAmount.toLocaleString()} (${row.motorcycleCount})</span>`;
          }
          if (row.interestCutAmount > 0) {
            catChips += `<span class="status-badge badge-cat-interest-cut" style="margin: 2px; font-size: 0.72rem;"><i class="fa-solid fa-percent"></i> ตัดดอก: ฿${row.interestCutAmount.toLocaleString()} (${row.interestCutCount})</span>`;
          }

          tr.innerHTML = `
            <td><strong>${formatDateThai(d)}</strong> <span style="font-size: 0.72rem; color: var(--text-dim);">(${d})</span></td>
            <td style="text-align: center;"><span class="status-badge" style="background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.35);">${row.count} รายการ</span></td>
            <td><div style="display: flex; flex-wrap: wrap; gap: 4px;">${catChips || "-"}</div></td>
            <td style="text-align: right;"><strong style="color: #34d399; font-size: 0.95rem;">฿${row.totalAmount.toLocaleString()}</strong></td>
            <td style="font-size: 0.8rem; color: #cbd5e1; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${row.clients.join(", ")}">${row.clients.join(", ")}</td>
            <td style="text-align: center;">
              <button type="button" class="btn-table-action" onclick="document.getElementById('dailyAllCategoriesDatePicker').value='${d}'; onDailyAllCategoriesDateChange('${d}');" style="padding: 4px 10px; font-size: 0.75rem; background: rgba(168, 85, 247, 0.2); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.4);">
                <i class="fa-solid fa-filter"></i> เลือกดูวันนี้
              </button>
            </td>
          `;
          breakdownBody.appendChild(tr);
        });
      }
    }
  };

  if (cardStatDailyAllCategories) {
    cardStatDailyAllCategories.addEventListener("click", () => {
      openDailyAllCategoriesReportModal();
    });
  }

  // --- BANK RECONCILIATION REPORT HANDLERS (ช่องเปรียบเทียบยอดในบัญชี & กระทบยอดเงินธนาคาร) ---

  let currentBankAdjFilterScope = "all"; // 'all', 'active', 'today'
  let currentBankAdjSearchQuery = "";
  let currentBankReconBottomTab = "adjustments"; // 'adjustments' or 'collections'

  function formatDateTimeThai(isoStr) {
    if (!isoStr) return "-";
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) {
        return formatDateThai(isoStr);
      }
      const months = [
        "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
        "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
      ];
      const day = d.getDate();
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, "0");
      const mins = String(d.getMinutes()).padStart(2, "0");
      return `${day} ${month} ${year} (${hours}:${mins} น.)`;
    } catch (e) {
      return formatDateThai(isoStr);
    }
  }

  if (cardStatBankReconciliation) {
    cardStatBankReconciliation.addEventListener("click", () => {
      openBankReconciliationModal();
    });
  }

  window.openBankReconciliationModal = function () {
    const datePicker = document.getElementById("bankReconDatePicker");
    if (datePicker) {
      datePicker.value = selectedDailyDate || getLocalDateStr();
    }
    setBankReconBottomTab(currentBankReconBottomTab || "adjustments");
    renderBankReconciliation(datePicker ? datePicker.value : getLocalDateStr());
    const modal = document.getElementById("bankReconciliationModal");
    if (modal) modal.classList.add("active");
  };

  window.closeBankReconciliationModal = function () {
    const modal = document.getElementById("bankReconciliationModal");
    if (modal) modal.classList.remove("active");
  };

  window.onBankReconDateChange = function (dateVal) {
    renderBankReconciliation(dateVal);
  };

  window.setBankReconDateToday = function () {
    const today = getLocalDateStr();
    const datePicker = document.getElementById("bankReconDatePicker");
    if (datePicker) datePicker.value = today;
    renderBankReconciliation(today);
  };

  window.setBankReconBottomTab = function (tabKey) {
    currentBankReconBottomTab = tabKey;
    const tabAdj = document.getElementById("tabContentBankAdjustments");
    const tabCol = document.getElementById("tabContentBankCollections");
    const btnAdj = document.getElementById("tabBtnBankReconAdjustments");
    const btnCol = document.getElementById("tabBtnBankReconCollections");

    if (tabKey === "collections") {
      if (tabAdj) tabAdj.style.display = "none";
      if (tabCol) tabCol.style.display = "block";
      if (btnAdj) {
        btnAdj.style.background = "rgba(255, 255, 255, 0.05)";
        btnAdj.style.color = "#cbd5e1";
        btnAdj.style.border = "1px solid rgba(255, 255, 255, 0.15)";
      }
      if (btnCol) {
        btnCol.style.background = "rgba(168, 85, 247, 0.2)";
        btnCol.style.color = "#c084fc";
        btnCol.style.border = "1px solid rgba(168, 85, 247, 0.45)";
      }
    } else {
      if (tabAdj) tabAdj.style.display = "block";
      if (tabCol) tabCol.style.display = "none";
      if (btnAdj) {
        btnAdj.style.background = "rgba(20, 184, 166, 0.2)";
        btnAdj.style.color = "#5eead4";
        btnAdj.style.border = "1px solid rgba(20, 184, 166, 0.45)";
      }
      if (btnCol) {
        btnCol.style.background = "rgba(255, 255, 255, 0.05)";
        btnCol.style.color = "#cbd5e1";
        btnCol.style.border = "1px solid rgba(255, 255, 255, 0.15)";
      }
    }
  };

  window.onBankAdjFilterChange = function (scope) {
    currentBankAdjFilterScope = scope;
    const datePicker = document.getElementById("bankReconDatePicker");
    renderBankReconciliation(datePicker ? datePicker.value : getLocalDateStr());
  };

  window.onBankAdjSearchChange = function (query) {
    currentBankAdjSearchQuery = (query || "").trim().toLowerCase();
    const datePicker = document.getElementById("bankReconDatePicker");
    renderBankReconciliation(datePicker ? datePicker.value : getLocalDateStr());
  };

  window.fillBankAdjNote = function (noteText) {
    const noteInput = document.getElementById("bankAdjNoteInput");
    if (!noteInput) return;
    if (!noteInput.value.trim()) {
      noteInput.value = noteText;
    } else {
      noteInput.value = noteInput.value.trim() + " " + noteText;
    }
    noteInput.focus();
  };

  window.submitBankAdjustment = async function (type) {
    const amtInput = document.getElementById("bankAdjAmountInput");
    const noteInput = document.getElementById("bankAdjNoteInput");
    const datePicker = document.getElementById("bankReconDatePicker");
    const amount = Number(amtInput ? amtInput.value : 0);

    if (!amount || amount <= 0) {
      alert("กรุณากรอกจำนวนเงินที่มากกว่า 0");
      if (amtInput) amtInput.focus();
      return;
    }

    const note = noteInput ? noteInput.value.trim() : "";
    const dateStr = datePicker && datePicker.value ? datePicker.value : getLocalDateStr();

    await window.easyFinanceDB.addBankAdjustment({
      type,
      amount,
      note,
      dateStr
    });

    if (amtInput) amtInput.value = "";
    if (noteInput) noteInput.value = "";

    showAdminToast(
      type === "deduct"
        ? `บันทึกลดยอดเงิน (โอนออก/ถอน) ฿${amount.toLocaleString()} เรียบร้อยแล้ว`
        : `บันทึกเพิ่มยอดเงิน ฿${amount.toLocaleString()} เรียบร้อยแล้ว`,
      "success"
    );

    renderBankReconciliation(dateStr);
    renderStatsCounters();
  };

  window.deleteBankAdjustment = async function (adjId) {
    if (!confirm("คุณต้องการลบรายการปรับปรุงยอดเงินนี้ใช่หรือไม่?")) return;
    await window.easyFinanceDB.deleteBankAdjustment(adjId);
    showAdminToast("ลบรายการปรับปรุงยอดเรียบร้อยแล้ว", "success");
    const datePicker = document.getElementById("bankReconDatePicker");
    renderBankReconciliation(datePicker ? datePicker.value : getLocalDateStr());
    renderStatsCounters();
  };

  window.editBankAdjustmentNotePrompt = async function (adjId) {
    const reconData = window.easyFinanceDB.getBankReconciliationData();
    const adjustments = Array.isArray(reconData.adjustments) ? reconData.adjustments : [];
    const item = adjustments.find((a) => a.id === adjId);
    if (!item) return;

    const currentNote = item.note || "";
    const newNote = prompt("แก้ไขหมายเหตุ / รายละเอียด (เช่น โอนยอดออก บัญชี..., ค่าน้ำมัน):", currentNote);
    if (newNote === null) return;

    await window.easyFinanceDB.editBankAdjustmentNote(adjId, newNote.trim());
    showAdminToast("อัปเดตหมายเหตุเรียบร้อยแล้ว", "success");
    const datePicker = document.getElementById("bankReconDatePicker");
    renderBankReconciliation(datePicker ? datePicker.value : getLocalDateStr());
  };

  // Requirement 1: เคลียร์ยอด ปรับเพิ่มสะสม ปรับลดสะสม (เริ่มรอบใหม่ โดยยกยอดปัจจุบันเป็นยอดตั้งต้น)
  window.promptClearAccumulatedAdjustments = async function () {
    const reconData = window.easyFinanceDB.getBankReconciliationData();
    const bankBase = Number(reconData.baseBalance) || 0;
    const allAdjustments = Array.isArray(reconData.adjustments) ? reconData.adjustments : [];

    let totalAdded = 0;
    let totalDeducted = 0;
    let activeCount = 0;
    allAdjustments.forEach((a) => {
      if (a.cleared || a.isSystemClear || a.type === "clear" || a.type === "recon_apply") return;
      const amt = Number(a.amount) || 0;
      if (a.type === "deduct") totalDeducted += amt;
      else totalAdded += amt;
      activeCount++;
    });

    const currentBankBalance = Math.max(0, bankBase + totalAdded - totalDeducted);

    const confirmMsg =
      `ยืนยันการเคลียร์ยอดปรับเพิ่มสะสม (+฿${totalAdded.toLocaleString()}) และ ปรับลดสะสม (-฿${totalDeducted.toLocaleString()}) ใช่หรือไม่?\n\n` +
      `• ยอดคงเหลือในธนาคารปัจจุบัน ฿${currentBankBalance.toLocaleString()} จะถูกยกเป็น "ยอดตั้งต้นรอบใหม่"\n` +
      `• ยอดปรับเพิ่ม/ลดสะสมจะเริ่มนับรอบใหม่เป็น ฿0\n` +
      `• ประวัติและหมายเหตุเดิม (${allAdjustments.length} รายการ) จะยังคงเก็บไว้ตรวจสอบย้อนหลังได้ตลอดเวลา`;

    if (!confirm(confirmMsg)) return;

    const res = await window.easyFinanceDB.clearBankAdjustmentsAccumulated();
    showAdminToast(`เคลียร์ยอดสะสมเรียบร้อยแล้ว! ยกยอดคงเหลือ ฿${res.newBaseBalance.toLocaleString()} เป็นยอดตั้งต้นรอบใหม่`, "success");

    const datePicker = document.getElementById("bankReconDatePicker");
    renderBankReconciliation(datePicker ? datePicker.value : getLocalDateStr());
    renderStatsCounters();
  };

  // ล้างประวัติทั้งหมด (หากต้องการลบประวัติเดิมทิ้งจริง)
  window.promptClearAllBankAdjustmentsHistory = async function () {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการล้างประวัติรายการปรับปรุงยอดเงินและหมายเหตุทั้งหมด?\n(ข้อมูลประวัติการโอนออก/เพิ่มเงินเดิมจะถูกลบทั้งหมด)")) return;
    await window.easyFinanceDB.clearAllBankAdjustmentsHistory();
    showAdminToast("ล้างประวัติรายการปรับปรุงยอดเงินทั้งหมดเรียบร้อยแล้ว", "success");
    const datePicker = document.getElementById("bankReconDatePicker");
    renderBankReconciliation(datePicker ? datePicker.value : getLocalDateStr());
    renderStatsCounters();
  };

  window.promptSetBankBaseBalance = async function () {
    const reconData = window.easyFinanceDB.getBankReconciliationData();
    const currentBase = Number(reconData.baseBalance) || 0;
    const input = prompt("กรุณาระบุยอดเงินในบัญชีธนาคารเริ่มต้น (บาท):", currentBase);
    if (input === null) return;
    const num = Number(input.replace(/,/g, "").trim());
    if (isNaN(num) || num < 0) {
      alert("กรุณากรอกตัวเลขจำนวนเงินที่ถูกต้อง");
      return;
    }
    await window.easyFinanceDB.setBankBaseBalance(num);
    showAdminToast(`กำหนดยอดเงินในบัญชีเริ่มต้นเป็น ฿${num.toLocaleString()} เรียบร้อยแล้ว`, "success");
    const datePicker = document.getElementById("bankReconDatePicker");
    renderBankReconciliation(datePicker ? datePicker.value : getLocalDateStr());
    renderStatsCounters();
  };

  // บันทึกยอดบวกแล้วคงเหลือสุทธิเป็นยอดเงินในธนาคารทันที (หรือเพิ่มให้อัตโนมัติ)
  window.applyReconciledToBankBalance = async function (showConfirm = true) {
    const datePicker = document.getElementById("bankReconDatePicker");
    const targetDate = datePicker && datePicker.value ? datePicker.value : getLocalDateStr();
    const reconData = window.easyFinanceDB.getBankReconciliationData ? window.easyFinanceDB.getBankReconciliationData() : { baseBalance: 0, adjustments: [] };
    const bankBase = Number(reconData.baseBalance) || 0;
    const allAdjustments = Array.isArray(reconData.adjustments) ? reconData.adjustments : [];

    let totalAdded = 0;
    let totalDeducted = 0;
    allAdjustments.forEach((a) => {
      if (a.cleared || a.isSystemClear || a.type === "clear" || a.type === "recon_apply") return;
      const amt = Number(a.amount) || 0;
      if (a.type === "deduct") totalDeducted += amt;
      else totalAdded += amt;
    });

    const currentBankBalance = Math.max(0, bankBase + totalAdded - totalDeducted);

    const allHistory = window.easyFinanceDB.getAllDailyAllCategoriesHistory ? window.easyFinanceDB.getAllDailyAllCategoriesHistory() : [];
    const dateCollections = allHistory.filter((h) => (h.dateStr && h.dateStr === targetDate) || (h.paidAt && h.paidAt.includes(targetDate)));
    const todayTotalAmount = dateCollections.reduce((sum, h) => sum + (Number(h.amount) || 0), 0);

    const totalReconciled = currentBankBalance + todayTotalAmount;

    if (showConfirm) {
      const confirmMsg =
        `ยืนยันนำ "ยอดบวกแล้วคงเหลือสุทธิ" ฿${totalReconciled.toLocaleString()} มาบันทึกเป็นยอดเงินในธนาคารใช่หรือไม่?\n\n` +
        `• ยอดเงินในธนาคารจะกลายเป็น: ฿${totalReconciled.toLocaleString()}\n` +
        `• รวมยอดรับของวันที่ ${formatDateThai(targetDate)} (฿${todayTotalAmount.toLocaleString()}) และหักยอดโอนออกเรียบร้อยแล้ว\n` +
        `• ระบบจะยกยอดนี้เป็นยอดตั้งต้นเงินในธนาคาร และบันทึกประวัติกระทบยอดทันที`;

      if (!confirm(confirmMsg)) return;
    }

    await window.easyFinanceDB.applyReconciledBankBalance({
      dateStr: targetDate,
      reconciledAmount: totalReconciled,
      baseBefore: currentBankBalance,
      todayCollections: todayTotalAmount
    });

    showAdminToast(`บันทึกยอดสุทธิ ฿${totalReconciled.toLocaleString()} เป็นเงินในธนาคารเรียบร้อยแล้ว!`, "success");
    renderBankReconciliation(targetDate);
    renderStatsCounters();
  };

  // ยกเลิกการบันทึกยอดสุทธิของวันที่เลือก (คืนค่ากลับเป็นยอดเดิม)
  window.promptUndoReconciledBankBalance = async function () {
    const datePicker = document.getElementById("bankReconDatePicker");
    const targetDate = datePicker && datePicker.value ? datePicker.value : getLocalDateStr();
    if (!confirm(`คุณต้องการยกเลิกการบันทึกยอดสุทธิของวันที่ ${formatDateThai(targetDate)} และคืนค่าเงินในธนาคารกลับเป็นยอดเดิมใช่หรือไม่?`)) return;

    await window.easyFinanceDB.undoReconciledDate(targetDate);
    showAdminToast(`ยกเลิกการบันทึกยอดสุทธิของวันที่ ${formatDateThai(targetDate)} เรียบร้อยแล้ว`, "info");
    renderBankReconciliation(targetDate);
    renderStatsCounters();
  };

  // เปิด/ปิด การซิงค์ยอดสุทธิเป็นเงินในธนาคารอัตโนมัติ
  window.onBankReconAutoSyncToggle = async function (checked) {
    await window.easyFinanceDB.setAutoSyncReconciled(checked);
    if (checked) {
      showAdminToast("เปิดโหมดซิงค์ยอดสุทธิเป็นเงินในธนาคารอัตโนมัติแล้ว", "success");
      applyReconciledToBankBalance(false);
    } else {
      showAdminToast("ปิดโหมดซิงค์อัตโนมัติแล้ว (สามารถกดปุ่มบันทึกเองได้ตลอดเวลา)", "info");
      const datePicker = document.getElementById("bankReconDatePicker");
      renderBankReconciliation(datePicker ? datePicker.value : getLocalDateStr());
    }
  };

  window.renderBankReconciliation = function (filterDateStr = null) {
    const targetDate = filterDateStr || getLocalDateStr();
    const reconData = window.easyFinanceDB.getBankReconciliationData ? window.easyFinanceDB.getBankReconciliationData() : { baseBalance: 0, adjustments: [], reconciledDates: {}, autoSyncReconciled: false };
    const bankBase = Number(reconData.baseBalance) || 0;
    const reconciledInfo = reconData.reconciledDates ? reconData.reconciledDates[targetDate] : null;
    const isReconciled = !!reconciledInfo;

    // Adjustments:
    const allAdjustments = Array.isArray(reconData.adjustments) ? reconData.adjustments : [];
    let totalAdded = 0;
    let totalDeducted = 0;
    let activeAdjustmentsCount = 0;

    allAdjustments.forEach((a) => {
      if (a.cleared || a.isSystemClear || a.type === "clear" || a.type === "recon_apply") return;
      const amt = Number(a.amount) || 0;
      if (a.type === "deduct") totalDeducted += amt;
      else totalAdded += amt;
      activeAdjustmentsCount++;
    });

    const currentBankBalance = Math.max(0, bankBase + totalAdded - totalDeducted);

    // Adjustments of the selected date:
    const dateAdjustments = allAdjustments.filter((a) => a.dateStr === targetDate || (a.createdAt && a.createdAt.slice(0, 10) === targetDate));

    // Today's collections from all categories (including interest cuts, excluding down payment)
    const allHistory = window.easyFinanceDB.getAllDailyAllCategoriesHistory ? window.easyFinanceDB.getAllDailyAllCategoriesHistory() : [];
    const dateCollections = allHistory.filter((h) => (h.dateStr && h.dateStr === targetDate) || (h.paidAt && h.paidAt.includes(targetDate)));
    const todayTotalAmount = dateCollections.reduce((sum, h) => sum + (Number(h.amount) || 0), 0);

    // Sum Reconciled (กระทบยอด: เงินในธนาคาร + ยอดรับวันนี้)
    const totalReconciled = currentBankBalance + todayTotalAmount;

    // 1. Update Card 1: เงินในธนาคาร
    const baseLabelEl = document.getElementById("bankReconBaseLabel");
    const bankBalEl = document.getElementById("bankReconCurrentBalance");
    const adjSummEl = document.getElementById("bankReconAdjustmentsSummary");
    if (baseLabelEl) baseLabelEl.textContent = `ยอดตั้งต้น: ฿${bankBase.toLocaleString()}`;
    if (bankBalEl) bankBalEl.textContent = `฿${currentBankBalance.toLocaleString()}`;
    if (adjSummEl) {
      adjSummEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 4px;">
          <span>ปรับเพิ่มสะสม: <strong style="color: #34d399;">+฿${totalAdded.toLocaleString()}</strong></span>
          <span>ปรับลดสะสม: <strong style="color: #f87171;">-฿${totalDeducted.toLocaleString()}</strong></span>
          <span>รอบนี้: <strong>${activeAdjustmentsCount} รายการ</strong></span>
        </div>
      `;
    }

    // 2. Update Card 2: ยอดรวมของวันนั้น (ยกเว้นเงินดาวน์)
    const todayCountEl = document.getElementById("bankReconTodayCountBadge");
    const todayTotalEl = document.getElementById("bankReconTodayTotalAmount");
    const catBadgesContainer = document.getElementById("bankReconCategoryBadges");
    if (todayCountEl) todayCountEl.textContent = `${dateCollections.length} รายการ`;
    if (todayTotalEl) todayTotalEl.textContent = `฿${todayTotalAmount.toLocaleString()}`;

    // Breakdown for category chips:
    const catMap = {
      daily: { title: "รายวัน", amount: 0, count: 0, color: "#34d399" },
      weekly: { title: "รายอาทิตย์", amount: 0, count: 0, color: "#60a5fa" },
      monthly: { title: "รายเดือน", amount: 0, count: 0, color: "#c084fc" },
      motorcycle: { title: "มอเตอร์ไซค์", amount: 0, count: 0, color: "#38bdf8" },
      interest_cut: { title: "ตัดดอก", amount: 0, count: 0, color: "#22d3ee" },
      fine: { title: "ค่าปรับ", amount: 0, count: 0, color: "#fb923c" }
    };
    dateCollections.forEach((item) => {
      if (item.isDirectFine || (item.fineAmount > 0 && item.baseAmount === 0)) {
        catMap.fine.amount += Number(item.amount) || 0;
        catMap.fine.count++;
      } else if (item.category === "interest_cut") {
        catMap.interest_cut.amount += Number(item.amount) || 0;
        catMap.interest_cut.count++;
      } else if (catMap[item.category]) {
        catMap[item.category].amount += Number(item.amount) || 0;
        catMap[item.category].count++;
      }
    });

    if (catBadgesContainer) {
      let chipsHtml = "";
      Object.values(catMap).forEach((c) => {
        if (c.amount > 0) {
          chipsHtml += `
            <span class="status-badge" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.15); font-size: 0.72rem; color: ${c.color};">
              ${c.title}: ฿${c.amount.toLocaleString()} (${c.count})
            </span>
          `;
        }
      });
      catBadgesContainer.innerHTML = chipsHtml || `<span style="font-size: 0.75rem; color: var(--text-dim);">ไม่มีรายการรับชำระในวันนี้</span>`;
    }

    // 3. Update Equation Cards: กระทบยอด
    const eqBankEl = document.getElementById("eqBankAmount");
    const eqTodayEl = document.getElementById("eqTodayAmount");
    const eqTotalEl = document.getElementById("eqTotalReconciledAmount");
    if (eqBankEl) eqBankEl.textContent = `฿${currentBankBalance.toLocaleString()}`;
    if (eqTodayEl) eqTodayEl.textContent = `฿${todayTotalAmount.toLocaleString()}`;
    if (eqTotalEl) eqTotalEl.textContent = `฿${totalReconciled.toLocaleString()}`;

    // Top Summary Badges
    const sumBadges = document.getElementById("bankReconSummaryBadges");
    if (sumBadges) {
      sumBadges.innerHTML = `
        <div style="background: rgba(20, 184, 166, 0.15); border: 1px solid rgba(20, 184, 166, 0.4); border-radius: 8px; padding: 6px 12px; font-size: 0.82rem; color: #5eead4; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-building-columns"></i>
          <span>เงินในธนาคาร: <strong>฿${currentBankBalance.toLocaleString()}</strong></span>
        </div>
        <div style="background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.4); border-radius: 8px; padding: 6px 12px; font-size: 0.82rem; color: #c084fc; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-calendar-day"></i>
          <span>รับเข้าวันที่เลือก: <strong>฿${todayTotalAmount.toLocaleString()}</strong> (${dateCollections.length} รายการ)</span>
        </div>
        <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 8px; padding: 6px 12px; font-size: 0.82rem; color: #34d399; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-calculator"></i>
          <span>บวกแล้วคงเหลือสุทธิ: <strong>฿${totalReconciled.toLocaleString()}</strong></span>
        </div>
      `;
    }

    // 4. Update Reconciled Action Area (Button, Status Badge, Undo)
    const btnApply = document.getElementById("btnApplyReconciledToBank");
    const btnApplyLabel = document.getElementById("btnApplyReconciledLabel");
    const btnUndo = document.getElementById("btnUndoReconciledBank");
    const statusText = document.getElementById("bankReconReconciledStatusText");
    const headerBadge = document.getElementById("bankReconHeaderBadge");
    const autoSyncToggle = document.getElementById("bankReconAutoSyncToggle");

    if (autoSyncToggle) {
      autoSyncToggle.checked = !!reconData.autoSyncReconciled;
    }

    if (isReconciled) {
      if (headerBadge) {
        headerBadge.innerHTML = `<span class="status-badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.5); font-size: 0.78rem;"><i class="fa-solid fa-circle-check"></i> บันทึกเข้าเงินในธนาคารแล้ว</span>`;
      }
      if (statusText) {
        statusText.innerHTML = `<span style="color: #34d399; font-weight: 600;"><i class="fa-solid fa-circle-check"></i> บันทึกยอดสุทธิ ฿${reconciledInfo.reconciledAmount.toLocaleString()} เป็นเงินในธนาคารเรียบร้อยแล้ว</span>`;
      }
      if (btnApplyLabel) {
        btnApplyLabel.textContent = `อัปเดตยอดสุทธิใหม่ (฿${totalReconciled.toLocaleString()})`;
      }
      if (btnUndo) {
        btnUndo.style.display = "inline-flex";
      }
    } else {
      if (headerBadge) {
        headerBadge.innerHTML = `<span class="status-badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); font-size: 0.78rem;"><i class="fa-solid fa-hourglass-half"></i> ยังไม่บันทึกเข้าธนาคาร</span>`;
      }
      if (statusText) {
        statusText.innerHTML = `<span style="color: var(--text-dim);"><i class="fa-solid fa-circle-info" style="color: #2dd4bf;"></i> คลิกปุ่มเพื่อนำยอดสุทธิ ฿${totalReconciled.toLocaleString()} ไปบันทึกเป็นเงินในธนาคาร</span>`;
      }
      if (btnApplyLabel) {
        btnApplyLabel.textContent = `บันทึกยอดสุทธิ (฿${totalReconciled.toLocaleString()}) เป็นเงินในธนาคาร`;
      }
      if (btnUndo) {
        btnUndo.style.display = "none";
      }
    }

    // 5. Update Tab Badges
    const tabAdjBadge = document.getElementById("bankReconAdjTabBadge");
    const tabColBadge = document.getElementById("bankReconColTabBadge");
    if (tabAdjBadge) tabAdjBadge.textContent = `${allAdjustments.length} รายการ`;
    if (tabColBadge) tabColBadge.textContent = `${dateCollections.length} รายการ (฿${todayTotalAmount.toLocaleString()})`;

    // 6. Update Adjustments Table with Filters and Notes
    const adjTableBody = document.getElementById("bankReconAdjustmentsTableBody");
    if (adjTableBody) {
      adjTableBody.innerHTML = "";

      // Filter Adjustments based on Scope and Search:
      let displayAdjustments = [...allAdjustments];

      if (currentBankAdjFilterScope === "active") {
        displayAdjustments = displayAdjustments.filter((a) => !a.cleared && !a.isSystemClear);
      } else if (currentBankAdjFilterScope === "today") {
        displayAdjustments = displayAdjustments.filter((a) => a.dateStr === targetDate || (a.createdAt && a.createdAt.slice(0, 10) === targetDate));
      }

      if (currentBankAdjSearchQuery) {
        displayAdjustments = displayAdjustments.filter((a) => {
          const noteText = (a.note || "").toLowerCase();
          const amtStr = String(a.amount || "");
          return noteText.includes(currentBankAdjSearchQuery) || amtStr.includes(currentBankAdjSearchQuery);
        });
      }

      if (displayAdjustments.length === 0) {
        adjTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-dim); padding: 22px;">ไม่พบรายการปรับปรุงยอดเงินตามเงื่อนไขที่เลือก</td></tr>`;
      } else {
        displayAdjustments.forEach((a) => {
          const tr = document.createElement("tr");
          const isReconApply = a.type === "recon_apply";
          const isSystemClear = a.isSystemClear || a.type === "clear" || isReconApply;
          const isDeduct = a.type === "deduct";
          const isAdd = !isSystemClear && !isDeduct;

          // Type Badge
          let typeBadgeHtml = "";
          let amountColor = "#34d399";
          let amountSign = "+";

          if (isReconApply) {
            typeBadgeHtml = `<span class="status-badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.45);"><i class="fa-solid fa-cloud-arrow-up"></i> บันทึกยอดสุทธิ</span>`;
            amountColor = "#34d399";
            amountSign = "";
          } else if (isSystemClear) {
            typeBadgeHtml = `<span class="status-badge" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.45);"><i class="fa-solid fa-arrows-rotate"></i> เคลียร์รอบ</span>`;
            amountColor = "#fbbf24";
            amountSign = "";
          } else if (isDeduct) {
            typeBadgeHtml = `<span class="status-badge" style="background: rgba(239, 68, 68, 0.18); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4);"><i class="fa-solid fa-arrow-trend-down"></i> ลดยอดเงิน (โอนออก)</span>`;
            amountColor = "#f87171";
            amountSign = "-";
          } else {
            typeBadgeHtml = `<span class="status-badge" style="background: rgba(16, 185, 129, 0.18); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4);"><i class="fa-solid fa-arrow-trend-up"></i> เพิ่มยอดเงิน</span>`;
            amountColor = "#34d399";
            amountSign = "+";
          }

          // Round Status Badge
          let roundStatusBadge = "";
          if (isSystemClear) {
            roundStatusBadge = `<span class="status-badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; font-size: 0.72rem;">จุดเริ่มรอบ</span>`;
          } else if (a.cleared) {
            roundStatusBadge = `<span class="status-badge" style="background: rgba(148, 163, 184, 0.15); color: #94a3b8; font-size: 0.72rem;"><i class="fa-solid fa-check-double"></i> เคลียร์แล้ว</span>`;
          } else {
            roundStatusBadge = `<span class="status-badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 0.72rem;"><i class="fa-solid fa-play"></i> รอบปัจจุบัน</span>`;
          }

          // Note & Details (โอนออก/หมายเหตุ) with inline Edit button
          const noteTextHtml = a.note ? `<span style="color: #e2e8f0; font-weight: 500;">${a.note}</span>` : `<span style="color: var(--text-dim); font-style: italic;">ไม่มีหมายเหตุ</span>`;
          const editNoteBtn = !isSystemClear
            ? `<button type="button" class="btn-table-action" onclick="editBankAdjustmentNotePrompt('${a.id}')" title="แก้ไขหมายเหตุ / รายละเอียด (กันลืม)"
                style="padding: 2px 7px; font-size: 0.72rem; margin-left: 6px; color: #5eead4; background: rgba(20, 184, 166, 0.15); border: 1px solid rgba(20, 184, 166, 0.35); border-radius: 4px;">
                <i class="fa-solid fa-pen"></i> แก้ไข
              </button>`
            : "";

          tr.innerHTML = `
            <td style="font-size: 0.82rem; color: #cbd5e1;">
              ${formatDateTimeThai(a.createdAt || a.dateStr)}
            </td>
            <td style="text-align: center;">${typeBadgeHtml}</td>
            <td style="font-size: 0.85rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
                <div>${noteTextHtml}</div>
                ${editNoteBtn}
              </div>
            </td>
            <td style="text-align: right; font-weight: 700; color: ${amountColor}; font-size: 0.95rem;">
              ${amountSign}฿${Number(a.amount || 0).toLocaleString()}
            </td>
            <td style="text-align: center;">${roundStatusBadge}</td>
            <td style="text-align: center;">
              <button type="button" class="btn-table-action" onclick="deleteBankAdjustment('${a.id}')"
                style="padding: 4px 8px; font-size: 0.72rem; color: #f87171; background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.3);">
                <i class="fa-solid fa-trash-can"></i> ลบ
              </button>
            </td>
          `;
          adjTableBody.appendChild(tr);
        });
      }
    }

    // 6. Update Today's Collections Table
    const colTableBody = document.getElementById("bankReconCollectionsTableBody");
    const colBadge = document.getElementById("bankReconCollectionsCountBadge");
    const colTitle = document.getElementById("bankReconCollectionListTitle");
    if (colTitle) {
      colTitle.textContent = `รายการรับชำระเงินของวันที่ ${formatDateThai(targetDate)} (ยอดรวมทุกอย่าง ยกเว้นเงินดาวน์)`;
    }
    if (colBadge) {
      colBadge.textContent = `${dateCollections.length} รายการ (รวม ฿${todayTotalAmount.toLocaleString()})`;
    }
    if (colTableBody) {
      colTableBody.innerHTML = "";
      if (dateCollections.length === 0) {
        colTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 20px;">ไม่พบรายการรับชำระในวันที่ ${formatDateThai(targetDate)}</td></tr>`;
      } else {
        const catBadges = {
          motorcycle: '<span class="status-badge badge-cat-motorcycle"><i class="fa-solid fa-motorcycle"></i> รถมอเตอร์ไซค์</span>',
          daily: '<span class="status-badge badge-cat-daily"><i class="fa-solid fa-clock"></i> รายวัน</span>',
          weekly: '<span class="status-badge badge-cat-weekly"><i class="fa-solid fa-calendar-week"></i> รายอาทิตย์</span>',
          monthly: '<span class="status-badge badge-cat-monthly"><i class="fa-solid fa-calendar-days"></i> รายเดือน</span>',
          interest_cut: '<span class="status-badge badge-cat-interest-cut"><i class="fa-solid fa-percent"></i> ตัดดอก</span>'
        };

        dateCollections.forEach((item) => {
          const tr = document.createElement("tr");
          const badgeHtml = catBadges[item.category] || (item.isDirectFine ? '<span class="status-badge" style="background: rgba(251, 146, 60, 0.15); color: #fb923c; border: 1px solid rgba(251, 146, 60, 0.3);">ค่าปรับล่าช้า</span>' : catBadges.daily);
          const instCol = item.isDirectFine
            ? '<span class="status-badge" style="background: rgba(251, 146, 60, 0.15); color: #fb923c; border: 1px solid rgba(251, 146, 60, 0.3);">ค่าปรับ</span>'
            : (item.installmentNo || "-");

          let slipBtn = "";
          if (item.slipUrl) {
            slipBtn = `
              <button type="button" class="btn-table-action" onclick="viewSlip('${item.slipUrl}', 'สลิป ${item.contractName}')"
                style="padding: 4px 8px; font-size: 0.75rem; color: #38bdf8; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.3); margin-left: 4px;">
                <i class="fa-solid fa-image"></i> สลิป
              </button>
            `;
          }

          tr.innerHTML = `
            <td>${item.paidAt ? formatDateTimeThai(item.paidAt) : (item.dateStr ? formatDateThai(item.dateStr) : "-")}</td>
            <td>
              <strong style="color: #fff;">${item.contractName}</strong>
              <span style="font-size: 0.72rem; color: var(--text-dim); display: block;">รหัส: ${item.contractId} (${item.phone || "-"})</span>
            </td>
            <td>${item.itemFinanced || "-"}</td>
            <td style="text-align: center;">${badgeHtml}</td>
            <td>${instCol}</td>
            <td style="text-align: right;"><strong style="color: #34d399; font-size: 0.95rem;">฿${Number(item.amount || 0).toLocaleString()}</strong></td>
            <td style="text-align: center;">
              <button type="button" class="btn-table-action" onclick="openContractDetails('${item.contractId}')"
                style="padding: 4px 10px; font-size: 0.75rem; color: #c084fc; background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.3);">
                <i class="fa-solid fa-eye"></i> ดูสัญญา
              </button>
              ${slipBtn}
            </td>
          `;
          colTableBody.appendChild(tr);
        });
      }
    }
  };

  // --- DAILY LATE FINE REPORT HANDLERS (Requirement 1) ---

  window.openLateFineReportModal = function () {
    const datePicker = document.getElementById("lateFineDatePicker");
    if (datePicker) {
      datePicker.value = selectedDailyDate || getLocalDateStr();
    }
    renderLateFineReport(datePicker ? datePicker.value : getLocalDateStr());
    const modal = document.getElementById("lateFineReportModal");
    if (modal) modal.classList.add("active");
  };

  window.closeLateFineReportModal = function () {
    const modal = document.getElementById("lateFineReportModal");
    if (modal) modal.classList.remove("active");
  };

  window.onLateFineDateChange = function (dateVal) {
    renderLateFineReport(dateVal);
  };

  window.setLateFineDateToday = function () {
    const today = getLocalDateStr();
    const datePicker = document.getElementById("lateFineDatePicker");
    if (datePicker) datePicker.value = today;
    renderLateFineReport(today);
  };

  window.showAllLateFines = function () {
    const datePicker = document.getElementById("lateFineDatePicker");
    if (datePicker) datePicker.value = "";
    renderLateFineReport(null);
  };

  window.renderLateFineReport = function (filterDateStr = null) {
    const allHistory = window.easyFinanceDB.getAllLateFineHistory ? window.easyFinanceDB.getAllLateFineHistory() : [];
    const tableBody = document.getElementById("lateFineTableBody");
    const breakdownBody = document.getElementById("lateFineDailyBreakdownBody");
    const countBadge = document.getElementById("lateFineCountBadge");
    const titleEl = document.getElementById("lateFineListTitle");
    const badgesContainer = document.getElementById("lateFineSummaryBadges");

    const filteredList = filterDateStr
      ? allHistory.filter((h) => (h.dateStr && h.dateStr === filterDateStr) || (h.paidAt && h.paidAt.includes(filterDateStr)))
      : allHistory;

    const totalAmountFiltered = filteredList.reduce((sum, h) => sum + (Number(h.amount) || 0), 0);
    const totalAmountAll = allHistory.reduce((sum, h) => sum + (Number(h.amount) || 0), 0);
    const pendingItems = allHistory.filter((h) => h.status === "pending");
    const pendingAmount = pendingItems.reduce((sum, h) => sum + (Number(h.amount) || 0), 0);

    if (titleEl) {
      titleEl.textContent = filterDateStr
        ? `รายการลูกค้าที่ถูกปรับ/รับชำระค่าปรับประจำวันที่ ${formatDateThai(filterDateStr)}`
        : "รายการลูกค้าที่ถูกปรับทั้งหมด (ทุกวัน)";
    }
    if (countBadge) {
      countBadge.textContent = `${filteredList.length} รายการ (฿${totalAmountFiltered.toLocaleString()})`;
    }

    if (badgesContainer) {
      badgesContainer.innerHTML = `
        <div style="background: rgba(251, 146, 60, 0.15); border: 1px solid rgba(251, 146, 60, 0.4); border-radius: 8px; padding: 6px 12px; font-size: 0.82rem; color: #fb923c; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-calendar-day"></i>
          <span>ค่าปรับวันที่เลือก: <strong>฿${totalAmountFiltered.toLocaleString()}</strong> (${filteredList.length} ราย)</span>
        </div>
        <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 8px; padding: 6px 12px; font-size: 0.82rem; color: #f87171; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-clock-rotate-left"></i>
          <span>ค่าปรับค้างเก็บปัจจุบัน: <strong>฿${pendingAmount.toLocaleString()}</strong> (${pendingItems.length} ราย)</span>
        </div>
        <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 8px; padding: 6px 12px; font-size: 0.82rem; color: #34d399; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-vault"></i>
          <span>ค่าปรับรวมทั้งหมด: <strong>฿${totalAmountAll.toLocaleString()}</strong> (${allHistory.length} ราย)</span>
        </div>
      `;
    }

    if (tableBody) {
      tableBody.innerHTML = "";
      if (filteredList.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 25px;">ไม่พบรายการค่าปรับ${filterDateStr ? ` ในวันที่ ${formatDateThai(filterDateStr)}` : ""}</td></tr>`;
      } else {
        filteredList.forEach((item) => {
          const tr = document.createElement("tr");
          const isPending = item.status === "pending";
          tr.innerHTML = `
            <td>${item.paidAt && item.paidAt !== "-" ? item.paidAt : (item.dateStr ? formatDateThai(item.dateStr) : "-")}</td>
            <td>
              <strong style="color: #fff;">${item.contractName}</strong>
              <span style="font-size: 0.72rem; color: var(--text-dim); display: block;">รหัส: ${item.contractId} (${item.phone || "-"})</span>
            </td>
            <td>${item.itemFinanced || "-"}</td>
            <td>
              <span style="font-size: 0.82rem; color: #cbd5e1;">${item.reason || (item.installmentNo !== "-" ? `งวดที่ ${item.installmentNo}` : "ค่าปรับล่าช้า")}</span>
            </td>
            <td style="text-align: right;"><strong style="color: #fb923c; font-size: 0.95rem;">฿${Number(item.amount || 0).toLocaleString()}</strong></td>
            <td style="text-align: center;">
              <span class="status-badge ${isPending ? 'badge-overdue' : 'badge-paid'}">
                <i class="fa-solid ${isPending ? 'fa-clock' : 'fa-circle-check'}"></i> ${isPending ? 'รอเก็บ' : 'ชำระแล้ว'}
              </span>
            </td>
            <td style="text-align: center;">
              <div style="display: flex; gap: 4px; justify-content: center; align-items: center; flex-wrap: wrap;">
                <button type="button" class="btn-table-action" onclick="openContractDetails('${item.contractId}')" style="padding: 4px 8px; font-size: 0.75rem; color: #fb923c; background: rgba(251, 146, 60, 0.15); border: 1px solid rgba(251, 146, 60, 0.3);">
                  <i class="fa-solid fa-eye"></i> ดูสัญญา
                </button>
                ${isPending ? `
                  <button type="button" class="btn-table-action btn-cancel-fine" onclick="cancelCustomerLateFine('${item.contractId}')" style="padding: 4px 8px; font-size: 0.75rem;">
                    <i class="fa-solid fa-ban"></i> ยกเลิกค่าปรับ
                  </button>
                ` : (item.id ? `
                  <button type="button" class="btn-table-action" onclick="undoDirectFinePayment('${item.contractId}', '${item.id}')" title="ยกเลิกรายการรับค่าปรับนี้" style="padding: 4px 8px; font-size: 0.75rem; color: #f87171; background: rgba(248, 113, 113, 0.15); border: 1px solid rgba(248, 113, 113, 0.3);">
                    <i class="fa-solid fa-rotate-left"></i> ยกเลิกรับเงิน
                  </button>
                ` : "")}
              </div>
            </td>
          `;
          tableBody.appendChild(tr);
        });
      }
    }

    if (breakdownBody) {
      breakdownBody.innerHTML = "";
      const grouped = {};
      allHistory.forEach((h) => {
        const d = h.dateStr || (h.paidAt && h.paidAt !== "-" ? h.paidAt.slice(0, 10) : "ไม่ระบุ");
        if (!grouped[d]) {
          grouped[d] = {
            dateStr: d,
            count: 0,
            totalAmount: 0,
            clients: []
          };
        }
        grouped[d].count += 1;
        grouped[d].totalAmount += Number(h.amount) || 0;
        if (!grouped[d].clients.includes(h.contractName)) {
          grouped[d].clients.push(h.contractName);
        }
      });

      const dates = Object.keys(grouped).sort().reverse();
      if (dates.length === 0) {
        breakdownBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-dim); padding: 18px;">ยังไม่มีประวัติค่าปรับในระบบ</td></tr>`;
      } else {
        dates.forEach((d) => {
          const row = grouped[d];
          const isSelected = filterDateStr === d;
          const tr = document.createElement("tr");
          if (isSelected) {
            tr.style.background = "rgba(251, 146, 60, 0.12)";
          }
          tr.innerHTML = `
            <td><strong>${formatDateThai(d)}</strong> <span style="font-size: 0.72rem; color: var(--text-dim);">(${d})</span></td>
            <td style="text-align: center;"><span class="status-badge" style="background: rgba(251, 146, 60, 0.15); color: #fb923c; border: 1px solid rgba(251, 146, 60, 0.3);">${row.count} ราย</span></td>
            <td style="text-align: right;"><strong style="color: #fb923c; font-size: 0.95rem;">฿${row.totalAmount.toLocaleString()}</strong></td>
            <td style="font-size: 0.8rem; color: #cbd5e1;">${row.clients.join(", ")}</td>
            <td style="text-align: center;">
              <button type="button" class="btn-table-action" onclick="document.getElementById('lateFineDatePicker').value='${d}'; onLateFineDateChange('${d}');" style="padding: 4px 10px; font-size: 0.75rem; background: rgba(251, 146, 60, 0.2); color: #fb923c; border: 1px solid rgba(251, 146, 60, 0.35);">
                <i class="fa-solid fa-filter"></i> เลือกดูวันนี้
              </button>
            </td>
          `;
          breakdownBody.appendChild(tr);
        });
      }
    }
  };

  if (cardStatLateFines) {
    cardStatLateFines.addEventListener("click", () => {
      openLateFineReportModal();
    });
  }

  btnCloseDetailModal.addEventListener("click", () => {
    contractDetailModal.classList.remove("active");
  });

  // View Slip Image
  window.viewSlip = function (imageUrl, metaText) {
    viewerSlipImg.src = imageUrl;
    viewerSlipMeta.textContent = metaText;
    slipViewerModal.classList.add("active");
  };

  btnCloseSlipViewer.addEventListener("click", () => {
    slipViewerModal.classList.remove("active");
  });

  // --- 7. QR CODE & BANK SETTINGS MODAL ---

  btnMenuQrSettings.addEventListener("click", () => {
    const settings = window.easyFinanceDB.getPaymentSettings();
    settingBankName.value = settings.bankName || "";
    settingAccountNumber.value = settings.accountNumber || "";
    settingAccountName.value = settings.accountName || "";
    settingPromptPay.value = settings.promptPayNumber || "";
    settingOfficerPhone.value = settings.officerPhone || "";
    settingOfficerLine.value = settings.officerLine || "";

    if (settings.qrImageUrl) {
      adminQrPreviewImg.src = settings.qrImageUrl;
    }
    tempUploadedQrBase64 = null;

    qrSettingsModal.classList.add("active");
  });

  btnCloseQrModal.addEventListener("click", () => {
    qrSettingsModal.classList.remove("active");
  });

  btnSelectQrFile.addEventListener("click", () => {
    adminQrFileInput.click();
  });

  adminQrFileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        tempUploadedQrBase64 = evt.target.result;
        adminQrPreviewImg.src = tempUploadedQrBase64;
        showAdminToast("โหลดตัวอย่างรูป QR Code สำเร็จ กรุณากดบันทึก", "success");
      };
      reader.readAsDataURL(file);
    }
  });

  qrSettingsForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const currentSettings = window.easyFinanceDB.getPaymentSettings();
    const updatedSettings = {
      bankName: settingBankName.value.trim(),
      accountNumber: settingAccountNumber.value.trim(),
      accountName: settingAccountName.value.trim(),
      promptPayNumber: settingPromptPay.value.trim(),
      officerPhone: settingOfficerPhone.value.trim(),
      officerLine: settingOfficerLine.value.trim(),
      qrImageUrl: tempUploadedQrBase64 || currentSettings.qrImageUrl
    };

    await window.easyFinanceDB.savePaymentSettings(updatedSettings);
    qrSettingsModal.classList.remove("active");
    showAdminToast("บันทึกการตั้งค่า QR รับเงิน และข้อมูลบัญชีเรียบร้อยแล้ว (ซิงค์ไปหน้าลูกค้าทันที)", "success");
  });

  // --- 8. BANK VERIFICATION API MODAL ---

  btnMenuBankApi.addEventListener("click", () => {
    const apiSettings = window.easyFinanceDB.getBankApiSettings();
    formBankProvider.value = apiSettings.provider || "mock";
    formBankApiKey.value = apiSettings.apiKey || "";
    formBankBranchId.value = apiSettings.branchId || "";
    formAutoApprove.checked = apiSettings.autoApproveOnMatch !== false;

    bankApiModal.classList.add("active");
  });

  btnCloseBankApiModal.addEventListener("click", () => {
    bankApiModal.classList.remove("active");
  });

  bankApiForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const updated = {
      provider: formBankProvider.value,
      apiKey: formBankApiKey.value.trim(),
      branchId: formBankBranchId.value.trim(),
      autoApproveOnMatch: formAutoApprove.checked
    };

    window.easyFinanceDB.saveBankApiSettings(updated);
    bankApiModal.classList.remove("active");
    showAdminToast("บันทึกการตั้งค่า Bank API ตรวจสลิปเรียบร้อยแล้ว", "success");
  });

  // --- 8.1 BAD DEBT EVENT HANDLERS (ประวัติหนี้เสีย / แบล็คลิส / ผ่อนล่าช้า) ---

  if (btnOpenAddBadDebt) {
    btnOpenAddBadDebt.addEventListener("click", () => {
      formBadDebtId.value = "";
      badDebtForm.reset();
      badDebtModalTitle.textContent = "เพิ่มประวัติหนี้เสีย / แบล็คลิส";
      if (formBdRecordedAt) formBdRecordedAt.value = new Date().toISOString().slice(0, 10);
      badDebtModal.classList.add("active");
    });
  }

  if (btnCloseBadDebtModal) {
    btnCloseBadDebtModal.addEventListener("click", () => {
      badDebtModal.classList.remove("active");
    });
  }

  // Global Edit Bad Debt
  window.editBadDebt = function (id) {
    const item = window.easyFinanceDB.getBadDebtById(id);
    if (!item) return;

    formBadDebtId.value = item.id;
    formBdName.value = item.name || "";
    formBdIdCard.value = item.idCard || "";
    formBdPhone.value = item.phone || "";
    formBdAmount.value = item.amount || 0;
    formBdAddress.value = item.address || "";
    formBdItemDescription.value = item.itemDescription || "";
    formBdNote.value = item.note || "";
    if (formBdRecordedAt) formBdRecordedAt.value = item.recordedAt || new Date().toISOString().slice(0, 10);

    const radio = badDebtForm.querySelector(`input[name="bdCategory"][value="${item.category || "bad_debt"}"]`);
    if (radio) radio.checked = true;

    badDebtModalTitle.textContent = `แก้ไขประวัติหนี้เสีย: ${item.name}`;
    badDebtModal.classList.add("active");
  };

  // Global Delete Bad Debt (Requirement 1: ต้องใส่รหัสผ่านความปลอดภัยก่อนลบข้อมูล)
  window.deleteBadDebtConfirm = function (id) {
    openDeleteSecurityModal(id, "bad_debt");
  };

  // Bad Debt Form Submit
  if (badDebtForm) {
    badDebtForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const id = formBadDebtId.value || `BD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      const name = formBdName.value.trim();
      const idCard = formBdIdCard.value.trim();
      const phone = formBdPhone.value.trim();
      const amount = parseFloat(formBdAmount.value) || 0;
      const address = formBdAddress.value.trim();
      const itemDescription = formBdItemDescription.value.trim();
      const note = formBdNote.value.trim();
      const recordedAt = formBdRecordedAt.value || new Date().toISOString().slice(0, 10);
      const selectedCategoryRadio = badDebtForm.querySelector('input[name="bdCategory"]:checked');
      const category = selectedCategoryRadio ? selectedCategoryRadio.value : "bad_debt";

      const record = {
        id,
        name,
        idCard,
        phone,
        amount,
        address,
        category,
        itemDescription,
        note,
        recordedAt
      };

      await window.easyFinanceDB.saveBadDebt(record);
      badDebtModal.classList.remove("active");
      showAdminToast(`บันทึกประวัติ ${name} เรียบร้อยแล้ว`, "success");
      renderSubTabs();
      renderActiveTabTable();
      updateCustomerBadges();
    });
  }

  // ====================================================================
  // --- 8.5 CUSTOMER DATABASE & DOSSIER (Requirement 3, 3.1, 3.2, 3.3) ---
  // ====================================================================

  let currentCdbFilter = "all"; // 'all' | 'active' | 'completed' | 'has_bad_debt'
  let currentViewingCustomerKey = null;

  // Helper: Copy text to clipboard
  window.copyToClipboard = function (text) {
    if (!text || text === "-") return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showAdminToast(`คัดลอก "${text}" เรียบร้อยแล้ว`, "success");
      }).catch(() => {
        fallbackCopyText(text);
      });
    } else {
      fallbackCopyText(text);
    }
  };

  function fallbackCopyText(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showAdminToast(`คัดลอก "${text}" เรียบร้อยแล้ว`, "success");
  }

  // 1. ดึงและจัดกลุ่มลูกค้าทั้งหมด (Aggregated Customer Profiles)
  function getAllAggregatedCustomers() {
    const contracts = window.easyFinanceDB.getContracts();
    const badDebts = window.easyFinanceDB.getBadDebts ? window.easyFinanceDB.getBadDebts() : [];

    const map = new Map();

    contracts.forEach((c) => {
      const phoneDigits = (c.phone || "").replace(/\D/g, "");
      const idDigits = (c.idCard || "").replace(/\D/g, "");
      const normName = (c.name || "").trim().toLowerCase();
      // Primary group key: Phone digits or ID digits or Name
      const key = phoneDigits || idDigits || normName || c.id;

      if (!map.has(key)) {
        map.set(key, {
          key,
          name: c.name || "ไม่ระบุชื่อ",
          phone: c.phone || "-",
          idCard: c.idCard || "-",
          address: c.address || "-",
          facebookLink: c.facebookLink || "",
          additionalNotes: c.additionalNotes || "",
          avatar: c.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
          email: c.email || "-",
          contracts: [],
          badDebts: [],
          totalFinanced: 0,
          totalCollected: 0,
          totalOutstanding: 0,
          totalContractsCount: 0,
          activeContractsCount: 0,
          completedContractsCount: 0,
          hasBadDebt: false
        });
      }

      const cust = map.get(key);
      cust.contracts.push(c);

      // Backfill missing info if this contract has it
      if ((!cust.idCard || cust.idCard === "-") && c.idCard) cust.idCard = c.idCard;
      if ((!cust.address || cust.address === "-") && c.address) cust.address = c.address;
      if (!cust.facebookLink && c.facebookLink) cust.facebookLink = c.facebookLink;
      if (!cust.additionalNotes && c.additionalNotes) cust.additionalNotes = c.additionalNotes;
      if (c.avatar && (!cust.avatar || cust.avatar.includes("unsplash"))) cust.avatar = c.avatar;

      const downPayment = Number(c.downPayment) || 0;
      const totalAmount = Number(c.totalAmount) || 0;
      // 1. หลังบ้านแสดงยอดทั้งหมดที่รวมทั้งเงินดาวน์ด้วย (ยอดปล่อยทั้งหมด = ยอดผ่อนรวม + เงินดาวน์)
      cust.totalFinanced += (totalAmount + downPayment);
      // เงินดาวน์นับเป็นยอดที่เก็บมาได้แล้วตั้งแต่เริ่มทำสัญญา
      cust.totalCollected += downPayment;
      cust.totalContractsCount++;

      const installments = c.installments || [];
      const isCompleted = installments.length > 0 && installments.every((i) => i.status === "paid");
      if (isCompleted) {
        cust.completedContractsCount++;
      } else {
        cust.activeContractsCount++;
      }

      installments.forEach((inst) => {
        const amt = Number(inst.amount) || 0;
        if (inst.status === "paid") {
          cust.totalCollected += amt;
        } else {
          cust.totalOutstanding += amt;
        }
      });
    });

    // ตรวจสอบประวัติหนี้เสียและจับคู่กับลูกค้า
    badDebts.forEach((b) => {
      const bPhoneDigits = (b.phone || "").replace(/\D/g, "");
      const bIdDigits = (b.idCard || "").replace(/\D/g, "");
      const bName = (b.name || "").trim().toLowerCase();

      let matchedCust = null;
      for (const [key, cust] of map.entries()) {
        const cPhoneDigits = (cust.phone || "").replace(/\D/g, "");
        const cIdDigits = (cust.idCard || "").replace(/\D/g, "");
        const cName = (cust.name || "").trim().toLowerCase();

        if (
          (bPhoneDigits && cPhoneDigits && bPhoneDigits === cPhoneDigits) ||
          (bIdDigits && cIdDigits && bIdDigits === cIdDigits) ||
          (bName && cName && bName === cName)
        ) {
          matchedCust = cust;
          break;
        }
      }

      if (matchedCust) {
        matchedCust.badDebts.push(b);
        matchedCust.hasBadDebt = true;
        if ((!matchedCust.idCard || matchedCust.idCard === "-") && b.idCard) matchedCust.idCard = b.idCard;
        if ((!matchedCust.address || matchedCust.address === "-") && b.address) matchedCust.address = b.address;
      } else {
        const key = bPhoneDigits || bIdDigits || bName || b.id;
        map.set(key, {
          key,
          name: b.name || "ไม่ระบุชื่อ",
          phone: b.phone || "-",
          idCard: b.idCard || "-",
          address: b.address || "-",
          facebookLink: "",
          additionalNotes: b.note || "",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
          email: "-",
          contracts: [],
          badDebts: [b],
          totalFinanced: Number(b.amount) || 0,
          totalCollected: 0,
          totalOutstanding: Number(b.amount) || 0,
          totalContractsCount: 0,
          activeContractsCount: 0,
          completedContractsCount: 0,
          hasBadDebt: true
        });
      }
    });

    return Array.from(map.values());
  }

  function getAggregatedCustomerByKey(key) {
    const list = getAllAggregatedCustomers();
    return list.find((c) => c.key === key) || null;
  }

  // 2. อัปเดตตัวเลขนับลูกค้าบน Sidebar และ Modal Badge
  function updateCustomerBadges() {
    const list = getAllAggregatedCustomers();
    if (customerCountBadge) {
      customerCountBadge.textContent = list.length;
      customerCountBadge.style.display = list.length > 0 ? "inline-flex" : "none";
    }
    if (modalCustomerTotalBadge) {
      modalCustomerTotalBadge.textContent = `${list.length} ราย`;
    }
  }

  // 3. เปิด Modal รายชื่อลูกค้าทั้งหมด (3.1)
  function openCustomerDatabaseModal() {
    if (customerDatabaseModal) {
      customerDatabaseModal.classList.add("active");
    }
    updateCustomerBadges();
    if (customerDbSearchInput) {
      const q = customerDbSearchInput.value.trim();
      if (btnCustomerDbSearchClear) {
        btnCustomerDbSearchClear.style.display = q ? "inline-flex" : "none";
      }
      setTimeout(() => {
        customerDbSearchInput.focus();
      }, 150);
    }
    renderCustomerDatabaseList();
  }

  function closeCustomerDatabaseModal() {
    if (customerDatabaseModal) {
      customerDatabaseModal.classList.remove("active");
    }
  }

  // ตัวกรองหมวดหมู่ลูกค้า
  function filterCustomerDb(filterType) {
    currentCdbFilter = filterType;
    document.querySelectorAll(".btn-cdb-filter").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-cdb-filter") === filterType);
    });
    renderCustomerDatabaseList();
  }

  // 4. แสดงรายชื่อลูกค้าทั้งหมด และปุ่ม 3 ขีด (3.1 & 3.2, Requirement 1: ค้นหาได้ครบถ้วนทุกฟิลด์)
  function renderCustomerDatabaseList() {
    if (!customerDbTableBody) return;

    const query = (customerDbSearchInput ? customerDbSearchInput.value : "").trim().toLowerCase();
    const qClean = query.replace(/\D/g, "");

    let customers = getAllAggregatedCustomers();

    // กรองตามประเภท
    if (currentCdbFilter === "active") {
      customers = customers.filter((c) => c.activeContractsCount > 0);
    } else if (currentCdbFilter === "completed") {
      customers = customers.filter((c) => c.completedContractsCount > 0 && c.activeContractsCount === 0);
    } else if (currentCdbFilter === "has_bad_debt") {
      customers = customers.filter((c) => c.hasBadDebt);
    }

    // กรองตามคำค้นหา (Requirement 1: ค้นหาได้จากทุกฟิลด์ของลูกค้า)
    if (query) {
      customers = customers.filter((c) => {
        const nameMatch = c.name && c.name.toLowerCase().includes(query);
        const emailMatch = c.email && c.email.toLowerCase().includes(query);
        const noteMatch = c.additionalNotes && c.additionalNotes.toLowerCase().includes(query);
        const addressMatch = c.address && c.address.toLowerCase().includes(query);

        let phoneMatch = false;
        if (c.phone) {
          const pClean = c.phone.replace(/\D/g, "");
          phoneMatch = (qClean && pClean.includes(qClean)) || c.phone.toLowerCase().includes(query);
        }

        let idMatch = false;
        if (c.idCard) {
          const idClean = c.idCard.replace(/\D/g, "");
          idMatch = (qClean && idClean.includes(qClean)) || c.idCard.toLowerCase().includes(query);
        }

        // ค้นหาตามรหัสสัญญา
        const contractIdMatch = (c.contracts || []).some((k) => k.id && k.id.toLowerCase().includes(query));

        // ค้นหาตามสิ่งที่ผ่อน
        const itemMatch = (c.contracts || []).some((k) => k.itemFinanced && k.itemFinanced.toLowerCase().includes(query));

        // ค้นหาตามประวัติหนี้เสีย
        const badDebtMatch = (c.badDebts || []).some((b) =>
          (b.itemDescription && b.itemDescription.toLowerCase().includes(query)) ||
          (b.note && b.note.toLowerCase().includes(query)) ||
          (b.phone && b.phone.toLowerCase().includes(query))
        );

        return nameMatch || emailMatch || phoneMatch || idMatch || noteMatch || addressMatch || contractIdMatch || itemMatch || badDebtMatch;
      });
    }

    if (customers.length === 0) {
      customerDbTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-dim); padding: 36px 16px;">
            <i class="fa-solid fa-users-slash" style="font-size: 2rem; margin-bottom: 8px; opacity: 0.5;"></i>
            <div>ไม่พบรายชื่อลูกค้าที่ตรงตามเงื่อนไข</div>
          </td>
        </tr>
      `;
      return;
    }

    customerDbTableBody.innerHTML = "";
    customers.forEach((cust) => {
      const tr = document.createElement("tr");

      // Badge สถานะสินเชื่อ
      let statusBadgeHtml = "";
      if (cust.hasBadDebt) {
        statusBadgeHtml += `<span class="status-badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4);"><i class="fa-solid fa-triangle-exclamation"></i> มีประวัติหนี้เสีย</span> `;
      }
      if (cust.activeContractsCount > 0) {
        statusBadgeHtml += `<span class="status-badge badge-pending"><i class="fa-solid fa-clock"></i> ผ่อนอยู่ ${cust.activeContractsCount} สัญญา</span> `;
      }
      if (cust.completedContractsCount > 0) {
        statusBadgeHtml += `<span class="status-badge badge-paid"><i class="fa-solid fa-circle-check"></i> ปิดแล้ว ${cust.completedContractsCount} สัญญา</span>`;
      }
      if (!statusBadgeHtml) {
        statusBadgeHtml = `<span class="status-badge" style="background: rgba(148, 163, 184, 0.15); color: #94a3b8;">ไม่มีสัญญา</span>`;
      }

      tr.innerHTML = `
        <td>
          <div class="customer-cell">
            <img class="customer-thumb" src="${cust.avatar}" alt="${cust.name}" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'">
            <div class="customer-info">
              <div class="name" style="font-weight: 600; color: #fff;">${cust.name}</div>
              <div class="sub" style="font-size: 0.75rem; color: var(--text-dim);">${cust.email !== "-" ? cust.email : cust.key}</div>
            </div>
          </div>
        </td>
        <td>
          <a href="tel:${cust.phone}" style="color: #38bdf8; text-decoration: none; font-weight: 500;" onclick="event.stopPropagation()">
            <i class="fa-solid fa-phone" style="font-size: 0.75rem; margin-right: 4px;"></i>${cust.phone}
          </a>
        </td>
        <td>
          <span style="font-family: monospace; font-size: 0.85rem; background: rgba(255,255,255,0.06); padding: 3px 8px; border-radius: 4px; color: #e2e8f0;">
            ${cust.idCard}
          </span>
        </td>
        <td>${statusBadgeHtml}</td>
        <td><strong style="color: #34d399;">฿${cust.totalFinanced.toLocaleString()}</strong></td>
        <td><strong style="color: #fbbf24;">฿${cust.totalOutstanding.toLocaleString()}</strong></td>
        <td style="text-align: center;">
          <div style="display: flex; gap: 6px; justify-content: center; align-items: center;">
            <!-- 3.2 ปุ่ม 3 ขีด สำหรับกดดูข้อมูลทั้งหมด -->
            <button type="button" class="btn-customer-menu" onclick="openCustomerDossier('${cust.key}')" title="กด 3 ขีด ดูข้อมูลทั้งหมดของลูกค้า">
              <i class="fa-solid fa-bars"></i>
            </button>
            <!-- 1. ปุ่มลบลูกค้า (ต้องใส่รหัสยืนยัน) -->
            <button type="button" class="btn-table-action" onclick="deleteCustomerConfirm('${cust.key}')" title="ลบข้อมูลลูกค้า (ต้องใส่รหัสความปลอดภัยก่อนลบ)" style="padding: 6px 9px; color: #f87171; border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.1);">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      customerDbTableBody.appendChild(tr);
    });
  }

  // 5. เปิดดูข้อมูลประวัติทั้งหมดของลูกค้า (3.3, 3.3.1 - 3.3.6)
  function openCustomerDossier(customerKey) {
    currentViewingCustomerKey = customerKey;
    const customer = getAggregatedCustomerByKey(customerKey);
    if (!customer) {
      showAdminToast("ไม่พบข้อมูลลูกค้ารายนี้", "error");
      return;
    }

    if (customerDatabaseModal) customerDatabaseModal.classList.remove("active");
    if (customerDossierModal) customerDossierModal.classList.add("active");

    if (dossierCustomerTitle) {
      dossierCustomerTitle.textContent = `ข้อมูลประวัติลูกค้า: ${customer.name}`;
    }

    renderCustomerDossierContent(customer);
  }

  function backToCustomerDbList() {
    if (customerDossierModal) customerDossierModal.classList.remove("active");
    openCustomerDatabaseModal();
  }

  // 6. เรนเดอร์ข้อมูลทั้งหมดในหน้า Dossier (3.3.1 - 3.3.6)
  function renderCustomerDossierContent(customer) {
    if (!customerDossierContent) return;

    // Bad Debt Warning Banner
    let badDebtBannerHtml = "";
    if (customer.hasBadDebt) {
      const bdTotalAmt = customer.badDebts.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
      badDebtBannerHtml = `
        <div class="bad-debt-warning-banner">
          <div style="font-size: 1.25rem;"><i class="fa-solid fa-triangle-exclamation"></i></div>
          <div style="flex: 1;">
            <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 2px;">คำเตือน: ลูกค้ารายนี้มีประวัติในระบบหนี้เสีย / แบล็กลิสต์ (Blacklist Alert)</div>
            <div style="font-size: 0.82rem; opacity: 0.9;">
              พบประวัติผิดนัดชำระ <strong>${customer.badDebts.length} รายการ</strong> ยอดรวม <strong>฿${bdTotalAmt.toLocaleString()}</strong> กรุณาตรวจสอบก่อนอนุมัติสินเชื่อใหม่
            </div>
          </div>
        </div>
      `;
    }

    // สัญญากำลังผ่อน (Active Contracts)
    const activeContracts = customer.contracts.filter(
      (c) => (c.installments || []).length > 0 && !(c.installments || []).every((i) => i.status === "paid")
    );

    // สัญญาที่เคยผ่อนชำระครบแล้ว (Completed Contracts)
    const completedContracts = customer.contracts.filter(
      (c) => (c.installments || []).length > 0 && (c.installments || []).every((i) => i.status === "paid")
    );

    // สร้าง HTML สำหรับตารางผ่อนของสัญญากำลังผ่อน
    let activeContractsHtml = "";
    if (activeContracts.length === 0) {
      activeContractsHtml = `<div style="padding: 16px; color: var(--text-dim); text-align: center; font-size: 0.88rem; background: rgba(255,255,255,0.02); border-radius: 8px;">ไม่มีสัญญากำลังผ่อนในขณะนี้</div>`;
    } else {
      activeContractsHtml = activeContracts.map((c) => {
        const installments = c.installments || [];
        const paidCount = installments.filter((i) => i.status === "paid").length;
        const totalInst = installments.length;
        const percent = totalInst > 0 ? Math.round((paidCount / totalInst) * 100) : 0;
        const remainingBal = installments
          .filter((i) => i.status !== "paid")
          .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

        const rowsHtml = installments.map((inst) => {
          const isPaid = inst.status === "paid";
          return `
            <tr>
              <td style="font-weight: 600;">งวดที่ ${inst.installmentNo}</td>
              <td>${formatDateThai(inst.dueDate)}</td>
              <td><strong style="color: #fff;">฿${(Number(inst.amount) || 0).toLocaleString()}</strong></td>
              <td>
                ${isPaid
              ? `<span class="status-badge badge-paid"><i class="fa-solid fa-circle-check"></i> ชำระแล้ว</span>`
              : `<span class="status-badge badge-pending"><i class="fa-solid fa-clock"></i> รอชำระ</span>`
            }
              </td>
              <td>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${inst.paidAt ? formatDateThai(inst.paidAt.slice(0, 10)) : "-"}</span>
              </td>
              <td>
                <div style="display: flex; gap: 6px; align-items: center;">
                  ${inst.slipUrl
              ? `<button type="button" class="btn-table-action" onclick="viewPaymentSlip('${inst.slipUrl}', 'งวดที่ ${inst.installmentNo} (${c.id})')" style="padding: 3px 8px; font-size: 0.72rem; color: #38bdf8;">
                          <i class="fa-solid fa-image"></i> สลิป
                         </button>`
              : '<span style="font-size: 0.72rem; color: var(--text-dim);">-</span>'
            }
                  ${!isPaid
              ? `<button type="button" class="btn-table-action btn-mark-paid" onclick="quickMarkPaid('${c.id}', ${inst.installmentNo}); setTimeout(() => openCustomerDossier('${customer.key}'), 800);" style="padding: 3px 8px; font-size: 0.72rem;">
                          <i class="fa-solid fa-check"></i> บันทึกรับ
                         </button>`
              : ""
            }
                </div>
              </td>
            </tr>
          `;
        }).join("");

        return `
          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--admin-border); border-radius: var(--radius-md); padding: 16px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
              <div>
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <span style="font-weight: 700; font-size: 1rem; color: #38bdf8;">${c.id}</span>
                  <span class="status-badge badge-pending">กำลังผ่อนชำระ</span>
                  <span style="font-size: 0.78rem; color: var(--text-dim);">รอบชำระ: ${c.paymentFrequency === "daily" ? "รายวัน" : c.paymentFrequency === "weekly" ? "รายอาทิตย์" : "รายเดือน"} (${c.dueSchedule || "-"})</span>
                  ${Number(c.downPayment) > 0 ? `<span class="status-badge" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3);"><i class="fa-solid fa-coins"></i> ดาวน์ ฿${Number(c.downPayment).toLocaleString()}</span>` : ""}
                  ${Number(c.lateFine) > 0 ? `<span class="badge-fine"><i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ ฿${Number(c.lateFine).toLocaleString()} (${c.lateFineReason || "เกินกำหนด"})</span>` : ""}
                  <button type="button" class="btn-penalty-action ${Number(c.lateFine) > 0 ? "has-fine" : ""}" onclick="openPenaltyModal('${c.id}')" title="จัดการค่าปรับ">
                    <i class="fa-solid fa-triangle-exclamation"></i> ${Number(c.lateFine) > 0 ? "แก้ไข/ล้างค่าปรับ" : "กรอกค่าปรับ"}
                  </button>
                  ${Number(c.lateFine) > 0 ? `
                    <button type="button" class="btn-table-action btn-cancel-fine" onclick="cancelCustomerLateFine('${c.id}')" title="ยกเลิกค่าปรับของลูกค้าคนนี้ (ล้างค่าปรับเป็น 0 บาท หน้าลูกค้าหายทันที)">
                      <i class="fa-solid fa-ban"></i> ยกเลิกค่าปรับ
                    </button>
                  ` : ""}
                  <button type="button" class="btn-table-action" onclick="toggleContractTableExpand('${c.id}')" id="btnToggleExpand_${c.id}" style="padding: 3px 8px; font-size: 0.74rem; border-color: rgba(56, 189, 248, 0.4); color: #38bdf8;" title="ขยายดูตารางงวดทั้งหมด">
                    <i class="fa-solid fa-up-right-and-down-left-from-center"></i> ขยายตาราง (${totalInst} งวด)
                  </button>
                  <button type="button" class="btn-table-action" onclick="printContractPdf('${c.id}')" style="padding: 3px 8px; font-size: 0.74rem; border-color: rgba(168, 85, 247, 0.4); color: #c084fc;" title="พิมพ์หรือบันทึกเฉพาะสัญญานี้เป็น PDF">
                    <i class="fa-solid fa-file-pdf"></i> พิมพ์ / PDF สัญญานี้
                  </button>
                </div>
                <div style="font-size: 0.88rem; color: #fff; margin-top: 4px; font-weight: 500;">
                  <i class="fa-solid fa-box" style="color: var(--primary); margin-right: 4px;"></i> สิ่งที่ผ่อน: <strong>${c.itemFinanced || "-"}</strong>
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 0.82rem; color: var(--text-muted);">ยอดเงินรวม (รวมดาวน์) / คงค้างรอเก็บ</div>
                <div style="font-size: 1rem; font-weight: 700; color: #fff;">
                  ฿${(Number(c.totalAmount || 0) + Number(c.downPayment || 0)).toLocaleString()} <span style="font-size: 0.82rem; color: #fbbf24;">(คงค้าง ฿${remainingBal.toLocaleString()})</span>
                </div>
              </div>
            </div>

            <div style="margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">
                <span>ความคืบหน้าการผ่อน: ชำระแล้ว ${paidCount}/${totalInst} งวด</span>
                <span style="color: #38bdf8; font-weight: 600;">${percent}%</span>
              </div>
              <div class="progress-track" style="height: 6px;">
                <div class="progress-bar-fill" style="width: ${percent}%; background: linear-gradient(90deg, #38bdf8, #34d399);"></div>
              </div>
            </div>

            <div id="contractTableContainer_${c.id}" class="table-container contract-installment-table-container" style="max-height: 240px; overflow-y: auto; border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; transition: max-height 0.25s ease;">
              <table class="admin-data-table" style="width: 100%; font-size: 0.82rem;">
                <thead>
                  <tr>
                    <th>งวด</th>
                    <th>กำหนดชำระ</th>
                    <th>ค่างวด</th>
                    <th>สถานะ</th>
                    <th>วันที่ชำระ</th>
                    <th>จัดการ / สลิป</th>
                  </tr>
                </thead>
                <tbody>
                  ${rowsHtml}
                </tbody>
              </table>
            </div>
          </div>
        `;
      }).join("");
    }

    // สัญญาที่เคยผ่อนชำระเสร็จสิ้นแล้ว (Completed Contracts)
    let completedContractsHtml = "";
    if (completedContracts.length === 0) {
      completedContractsHtml = `<div style="padding: 14px; color: var(--text-dim); text-align: center; font-size: 0.85rem; background: rgba(255,255,255,0.02); border-radius: 8px;">ยังไม่มีประวัติสัญญาที่ปิดยอดแล้ว</div>`;
    } else {
      completedContractsHtml = completedContracts.map((c) => {
        const installments = c.installments || [];
        const lastPaid = installments[installments.length - 1];
        return `
          <div style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-md); padding: 14px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-weight: 700; color: #34d399;">${c.id}</span>
                <span class="status-badge badge-paid"><i class="fa-solid fa-circle-check"></i> ปิดสัญญาเรียบร้อย</span>
                <span style="font-size: 0.8rem; color: var(--text-dim);">${c.paymentFrequency === "daily" ? "รายวัน" : c.paymentFrequency === "weekly" ? "รายอาทิตย์" : "รายเดือน"}</span>
              </div>
              <div style="font-size: 0.85rem; color: #fff; margin-top: 3px;">
                สิ่งที่ผ่อน: <strong>${c.itemFinanced || "-"}</strong> (ครบทั้งหมด ${installments.length} งวด)
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.95rem; font-weight: 700; color: #34d399;">฿${(Number(c.totalAmount) || 0).toLocaleString()}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${lastPaid && lastPaid.paidAt ? `ปิดยอดเมื่อ: ${formatDateThai(lastPaid.paidAt.slice(0, 10))}` : "ปิดยอดครบแล้ว"}</div>
            </div>
          </div>
        `;
      }).join("");
    }

    // ประวัติหนี้เสียถ้ามี
    let badDebtSectionHtml = "";
    if (customer.badDebts && customer.badDebts.length > 0) {
      const bdRows = customer.badDebts.map((b) => `
        <tr>
          <td><span class="status-badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171;">${b.category === "bad_debt" ? "หนี้เสีย (NPL)" : b.category === "blacklist" ? "แบล็กลิสต์" : "ผ่อนล่าช้า"}</span></td>
          <td>${formatDateThai(b.recordedAt)}</td>
          <td><strong style="color: #f87171;">฿${(Number(b.amount) || 0).toLocaleString()}</strong></td>
          <td>${b.itemDescription || "-"}</td>
          <td><span style="color: #fca5a5;">${b.note || "-"}</span></td>
        </tr>
      `).join("");

      badDebtSectionHtml = `
        <div class="dossier-section-card" style="border-color: rgba(239, 68, 68, 0.35);">
          <div class="dossier-card-title" style="color: #f87171;">
            <i class="fa-solid fa-ban"></i>
            <span>ประวัติในฐานข้อมูลหนี้เสีย / แบล็กลิสต์ (${customer.badDebts.length} รายการ)</span>
          </div>
          <div class="table-container" style="border: 1px solid rgba(239,68,68,0.2); border-radius: 6px;">
            <table class="admin-data-table" style="width: 100%; font-size: 0.82rem;">
              <thead>
                <tr>
                  <th>สถานะ</th>
                  <th>วันที่บันทึก</th>
                  <th>ยอดเงิน</th>
                  <th>รายการสินค้า</th>
                  <th>บันทึกรายละเอียด</th>
                </tr>
              </thead>
              <tbody>
                ${bdRows}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    // ประกอบโครงสร้าง HTML ของ Dossier ทั้งหมด
    customerDossierContent.innerHTML = `
      ${badDebtBannerHtml}

      <!-- 3.3.1 - 3.3.4 ข้อมูลส่วนตัวลูกค้า -->
      <div class="dossier-section-card">
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <img src="${customer.avatar}" alt="${customer.name}" style="width: 76px; height: 76px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary); box-shadow: 0 4px 12px rgba(0,0,0,0.3);" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'">
          <div style="flex: 1; min-width: 220px;">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <h2 style="font-size: 1.4rem; font-weight: 700; color: #fff; margin: 0;">${customer.name}</h2>
              ${customer.hasBadDebt ? '<span class="status-badge" style="background: rgba(239,68,68,0.25); color: #f87171;"><i class="fa-solid fa-triangle-exclamation"></i> ติดแบล็กลิสต์</span>' : '<span class="status-badge badge-paid"><i class="fa-solid fa-circle-check"></i> สถานะปกติ</span>'}
            </div>
            <div style="font-size: 0.85rem; color: var(--text-dim); margin-top: 4px;">
              ${customer.email !== "-" ? `<i class="fa-solid fa-envelope"></i> ${customer.email} &bull; ` : ""}สัญญาทั้งหมด ${customer.totalContractsCount} สัญญา
            </div>
          </div>
        </div>

        <div class="dossier-info-grid" style="margin-top: 18px;">
          <!-- 3.3.1 ชื่อ-นามสกุล -->
          <div class="dossier-info-field">
            <span class="dossier-field-label"><i class="fa-solid fa-user"></i> 3.3.1 ชื่อ - นามสกุล:</span>
            <div class="dossier-field-value" style="color: #fff; font-weight: 600;">
              ${customer.name}
              <button type="button" class="btn-copy-chip" onclick="copyToClipboard('${customer.name}')" title="คัดลอก"><i class="fa-solid fa-copy"></i> คัดลอก</button>
            </div>
          </div>

          <!-- 3.3.2 เบอร์โทรศัพท์ -->
          <div class="dossier-info-field">
            <span class="dossier-field-label"><i class="fa-solid fa-phone"></i> 3.3.2 เบอร์โทรศัพท์:</span>
            <div class="dossier-field-value">
              <a href="tel:${customer.phone}" class="dossier-phone-link"><i class="fa-solid fa-phone-volume"></i> ${customer.phone}</a>
              <button type="button" class="btn-copy-chip" onclick="copyToClipboard('${customer.phone}')" title="คัดลอก"><i class="fa-solid fa-copy"></i> คัดลอก</button>
            </div>
          </div>

          <!-- 3.3.3 หมายเลขบัตร ปชช -->
          <div class="dossier-info-field">
            <span class="dossier-field-label"><i class="fa-solid fa-id-card"></i> 3.3.3 หมายเลขบัตรประชาชน:</span>
            <div class="dossier-field-value">
              <span class="id-card-badge">${customer.idCard}</span>
              ${customer.idCard !== "-" ? `<button type="button" class="btn-copy-chip" onclick="copyToClipboard('${customer.idCard}')" title="คัดลอก"><i class="fa-solid fa-copy"></i> คัดลอก</button>` : ""}
            </div>
          </div>

          <!-- 3.3.4 ที่อยู่ -->
          <div class="dossier-info-field" style="grid-column: 1 / -1;">
            <span class="dossier-field-label"><i class="fa-solid fa-location-dot"></i> 3.3.4 ที่อยู่ปัจจุบัน:</span>
            <div class="dossier-field-value" style="color: #e2e8f0; line-height: 1.5;">
              ${customer.address}
              ${customer.address !== "-" ? `<button type="button" class="btn-copy-chip" onclick="copyToClipboard('${customer.address}')" title="คัดลอกที่อยู่"><i class="fa-solid fa-copy"></i> คัดลอก</button>` : ""}
            </div>
          </div>
        </div>
      </div>

      <!-- 3.3.5 ช่องใส่รายละเอียดเพิ่มเติม เอาไว้ใส่ลิงค์เฟส (Editable & Savable) -->
      <div class="dossier-section-card" style="border: 1px solid rgba(56, 189, 248, 0.3); background: rgba(56, 189, 248, 0.03);">
        <div class="dossier-card-title" style="color: #38bdf8;">
          <i class="fa-brands fa-facebook" style="color: #1877f2;"></i>
          <span>3.3.5 รายละเอียดเพิ่มเติมและลิงก์เฟซบุ๊ก (Facebook Profile & Additional Notes)</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div>
            <label style="font-size: 0.8rem; color: #94a3b8; display: block; margin-bottom: 6px;">
              <i class="fa-brands fa-facebook" style="color: #1877f2;"></i> ลิงก์ Facebook ลูกค้า (ระบุลิงก์โปรไฟล์เฟซบุ๊ก เช่น https://facebook.com/username):
            </label>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="dossierFacebookInput" class="input-admin" placeholder="https://facebook.com/..." value="${customer.facebookLink || ""}">
              ${customer.facebookLink
        ? `<a href="${customer.facebookLink}" target="_blank" rel="noopener noreferrer" class="btn-open-facebook" title="เปิดหน้า Facebook">
                      <i class="fa-solid fa-arrow-up-right-from-square"></i> เปิด Facebook
                     </a>`
        : ""
      }
            </div>
          </div>

          <div>
            <label style="font-size: 0.8rem; color: #94a3b8; display: block; margin-bottom: 6px;">
              <i class="fa-solid fa-note-sticky" style="color: #fbbf24;"></i> รายละเอียดเพิ่มเติม / บันทึกข้อมูลลูกค้า (ข้อมูลที่ทำงาน, ผู้ค้ำ, บัญชีสำรอง, พฤติกรรม):
            </label>
            <textarea id="dossierNotesInput" class="dossier-notes-textarea" placeholder="พิมพ์รายละเอียดเพิ่มเติมหรือบันทึกที่เกี่ยวข้องกับลูกค้ารายนี้...">${customer.additionalNotes || ""}</textarea>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px;">
            <div>
              <label style="font-size: 0.75rem; color: #94a3b8; display: block; margin-bottom: 4px;">แก้ไขเลขบัตรประชาชน (หากต้องการปรับปรุง):</label>
              <input type="text" id="dossierIdCardInput" class="input-admin" placeholder="เลขบัตร ปชช" value="${customer.idCard !== "-" ? customer.idCard : ""}">
            </div>
            <div>
              <label style="font-size: 0.75rem; color: #94a3b8; display: block; margin-bottom: 4px;">แก้ไขที่อยู่ (หากต้องการปรับปรุง):</label>
              <input type="text" id="dossierAddressInput" class="input-admin" placeholder="ที่อยู่ปัจจุบัน" value="${customer.address !== "-" ? customer.address : ""}">
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 6px;">
            <button type="button" class="btn-table-action" onclick="saveCustomerDossierNotes('${customer.key}')" style="background: linear-gradient(135deg, #10b981, #059669); color: #fff; font-weight: 600; padding: 9px 20px; border-radius: 8px; cursor: pointer;">
              <i class="fa-solid fa-floppy-disk"></i> บันทึกข้อมูลและลิงก์เฟส
            </button>
          </div>
        </div>
      </div>

      <!-- 3.3.6 สรุปตัวเลขทางการเงิน -->
      <div class="dossier-stats-grid">
        <div class="dossier-stat-box">
          <div class="dossier-stat-num" style="color: #34d399;">฿${customer.totalFinanced.toLocaleString()}</div>
          <div class="dossier-stat-label">ยอดปล่อยสินเชื่อรวมทั้งหมด</div>
        </div>
        <div class="dossier-stat-box">
          <div class="dossier-stat-num" style="color: #38bdf8;">฿${customer.totalCollected.toLocaleString()}</div>
          <div class="dossier-stat-label">ยอดชำระคืนแล้ว</div>
        </div>
        <div class="dossier-stat-box">
          <div class="dossier-stat-num" style="color: #fbbf24;">฿${customer.totalOutstanding.toLocaleString()}</div>
          <div class="dossier-stat-label">ยอดคงค้างรอเก็บ</div>
        </div>
        <div class="dossier-stat-box">
          <div class="dossier-stat-num" style="color: #c084fc;">${customer.totalContractsCount} สัญญา</div>
          <div class="dossier-stat-label">กำลังผ่อน ${customer.activeContractsCount} | ปิดแล้ว ${customer.completedContractsCount}</div>
        </div>
      </div>

      <!-- 3.3.6 รายละเอียดสัญญากำลังผ่อน (Active Contracts) -->
      <div class="dossier-section-card">
        <div class="dossier-card-title" style="color: #38bdf8;">
          <i class="fa-solid fa-hourglass-half"></i>
          <span>สัญญาสินเชื่อที่กำลังผ่อนชำระ (${activeContracts.length} สัญญา)</span>
        </div>
        ${activeContractsHtml}
      </div>

      <!-- 3.3.6 รายละเอียดสัญญาที่เคยผ่อนเสร็จสิ้นแล้ว (Past Completed Contracts) -->
      <div class="dossier-section-card">
        <div class="dossier-card-title" style="color: #34d399;">
          <i class="fa-solid fa-clock-rotate-left"></i>
          <span>ประวัติสัญญาที่เคยผ่อนชำระครบแล้ว (${completedContracts.length} สัญญา)</span>
        </div>
        ${completedContractsHtml}
      </div>

      <!-- ประวัติหนี้เสียถ้ามี -->
      ${badDebtSectionHtml}
    `;
  }

  // 7. บันทึกข้อมูลเพิ่มเติม & ลิงก์เฟซบุ๊ก (3.3.5)
  async function saveCustomerDossierNotes(customerKey) {
    const customer = getAggregatedCustomerByKey(customerKey);
    if (!customer) return;

    const fbInput = document.getElementById("dossierFacebookInput");
    const notesInput = document.getElementById("dossierNotesInput");
    const idCardInput = document.getElementById("dossierIdCardInput");
    const addrInput = document.getElementById("dossierAddressInput");

    const newFb = fbInput ? fbInput.value.trim() : customer.facebookLink;
    const newNotes = notesInput ? notesInput.value.trim() : customer.additionalNotes;
    const newIdCard = idCardInput ? idCardInput.value.trim() : customer.idCard;
    const newAddress = addrInput ? addrInput.value.trim() : customer.address;

    const profileData = {
      phone: customer.phone,
      name: customer.name,
      facebookLink: newFb,
      additionalNotes: newNotes,
      idCard: newIdCard || customer.idCard,
      address: newAddress || customer.address
    };

    await window.easyFinanceDB.updateCustomerProfile(customerKey, profileData);

    showAdminToast("บันทึกข้อมูลเพิ่มเติมและลิงก์ Facebook สำเร็จ", "success");
    openCustomerDossier(customerKey);
    renderCustomerDatabaseList();
    updateCustomerBadges();
  }

  // 8. ดาวน์โหลดไฟล์ Excel (3.3.7)
  function downloadCurrentCustomerExcel() {
    if (!currentViewingCustomerKey) {
      showAdminToast("กรุณาเลือกลูกค้าก่อนดาวน์โหลด", "error");
      return;
    }
    const customer = getAggregatedCustomerByKey(currentViewingCustomerKey);
    if (!customer) return;

    if (typeof XLSX === "undefined") {
      showAdminToast("กำลังโหลดไลบรารี Excel กรุณารอสักครู่แล้วลองใหม่", "error");
      return;
    }

    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: ข้อมูลประวัติลูกค้า
      const profileRows = [
        ["รายงานประวัติข้อมูลลูกค้า EasyFinance", ""],
        ["วันที่ออกรายงาน", new Date().toLocaleString("th-TH")],
        ["", ""],
        ["--- ข้อมูลส่วนตัวลูกค้า ---", ""],
        ["ชื่อ - นามสกุล", customer.name || "-"],
        ["เบอร์โทรศัพท์", customer.phone || "-"],
        ["เลขประจำตัวประชาชน", customer.idCard || "-"],
        ["อีเมล", customer.email || "-"],
        ["ที่อยู่ปัจจุบัน", customer.address || "-"],
        ["ลิงก์ Facebook", customer.facebookLink || "-"],
        ["รายละเอียดเพิ่มเติม / บันทึกประวัติ", customer.additionalNotes || "-"],
        ["", ""],
        ["--- สรุปยอดสินเชื่อ ---", ""],
        ["ยอดปล่อยสินเชื่อรวมทั้งหมด (บาท)", customer.totalFinanced],
        ["ยอดชำระคืนแล้ว (บาท)", customer.totalCollected],
        ["ยอดคงเหลือรอเก็บ (บาท)", customer.totalOutstanding],
        ["จำนวนสัญญาทั้งหมด", customer.totalContractsCount],
        ["สัญญากำลังผ่อนชำระ", customer.activeContractsCount],
        ["สัญญาที่ปิดยอดแล้ว", customer.completedContractsCount],
        ["ประวัติหนี้เสีย / แบล็กลิสต์", customer.hasBadDebt ? "พบประวัติผิดนัดชำระ" : "ปกติ"]
      ];
      const wsProfile = XLSX.utils.aoa_to_sheet(profileRows);
      XLSX.utils.book_append_sheet(wb, wsProfile, "ข้อมูลลูกค้า");

      // Sheet 2: ตารางงวดการผ่อนชำระทุกสัญญา
      const ledgerRows = [
        ["รหัสสัญญา", "รายการสินค้า", "รอบการชำระ", "งวดที่", "กำหนดชำระ", "ค่างวด (บาท)", "สถานะ", "วันที่ชำระเงิน", "เลขอ้างอิง"]
      ];

      customer.contracts.forEach((c) => {
        (c.installments || []).forEach((inst) => {
          ledgerRows.push([
            c.id,
            c.itemFinanced || "-",
            c.paymentFrequency === "daily" ? "รายวัน" : c.paymentFrequency === "weekly" ? "รายอาทิตย์" : "รายเดือน",
            inst.installmentNo,
            inst.dueDate || "-",
            Number(inst.amount) || 0,
            inst.status === "paid" ? "ชำระแล้ว" : "ค้างชำระ",
            inst.paidAt ? formatDateThai(inst.paidAt.slice(0, 10)) : "-",
            inst.transactionRef || "-"
          ]);
        });
      });

      const wsLedger = XLSX.utils.aoa_to_sheet(ledgerRows);
      XLSX.utils.book_append_sheet(wb, wsLedger, "ตารางผ่อนชำระทุกงวด");

      const cleanName = (customer.name || "Customer").replace(/[\/\\?%*:|"<>]/g, "");
      const fileName = `ประวัติลูกค้า_${cleanName}_${getLocalDateStr()}.xlsx`;
      XLSX.writeFile(wb, fileName);
      showAdminToast(`ดาวน์โหลดไฟล์ Excel เรียบร้อยแล้ว (${fileName})`, "success");
    } catch (err) {
      console.error("Excel download error:", err);
      showAdminToast("เกิดข้อผิดพลาดในการดาวน์โหลด Excel", "error");
    }
  }

  // 9. ดาวน์โหลดไฟล์ PDF (3.3.7)
  function downloadCurrentCustomerPDF() {
    if (!currentViewingCustomerKey) {
      showAdminToast("กรุณาเลือกลูกค้าก่อนดาวน์โหลด", "error");
      return;
    }
    const customer = getAggregatedCustomerByKey(currentViewingCustomerKey);
    if (!customer) return;

    if (typeof html2pdf === "undefined") {
      showAdminToast("กำลังโหลดไลบรารี PDF กรุณารอสักครู่แล้วลองใหม่", "error");
      return;
    }

    const element = document.getElementById("customerDossierContent");
    if (!element) return;

    showAdminToast("กำลังสร้างไฟล์ PDF กรุณารอสักครู่...", "info");

    const cleanName = (customer.name || "Customer").replace(/[\/\\?%*:|"<>]/g, "");
    const fileName = `ประวัติลูกค้า_${cleanName}_${getLocalDateStr()}.pdf`;

    const opt = {
      margin: [8, 8, 8, 8],
      filename: fileName,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        showAdminToast(`ดาวน์โหลดไฟล์ PDF เรียบร้อยแล้ว (${fileName})`, "success");
      })
      .catch((err) => {
        console.error("PDF generation error:", err);
        showAdminToast("เกิดข้อผิดพลาดในการสร้างไฟล์ PDF", "error");
      });
  }

  // 10. พิมพ์เอกสารประวัติลูกค้า
  function printCurrentCustomerDossier() {
    window.print();
  }

  // 10.1 สลับย่อ/ขยายตารางงวดสัญญาให้เห็นครบทุกงวด (Requirement 5)
  window.toggleContractTableExpand = function (contractId) {
    const container = document.getElementById(`contractTableContainer_${contractId}`);
    const btn = document.getElementById(`btnToggleExpand_${contractId}`);
    if (!container) return;

    const isExpanded = container.classList.contains("expanded");
    if (isExpanded) {
      container.classList.remove("expanded");
      container.style.maxHeight = "240px";
      if (btn) btn.innerHTML = `<i class="fa-solid fa-up-right-and-down-left-from-center"></i> ขยายตาราง`;
    } else {
      container.classList.add("expanded");
      container.style.maxHeight = "none";
      if (btn) btn.innerHTML = `<i class="fa-solid fa-down-left-and-up-right-to-center"></i> ย่อตาราง`;
    }
  };

  // 10.2 ส่งออก PDF หรือสั่งพิมพ์เฉพาะสัญญานี้โดยตรง เห็นครบทุกงวดไม่ถูกตัด (Requirement 5)
  window.printContractPdf = function (contractId) {
    const contract = window.easyFinanceDB.getContractById(contractId);
    if (!contract) {
      showAdminToast("ไม่พบข้อมูลสัญญา", "error");
      return;
    }

    const installments = contract.installments || [];
    const paidCount = installments.filter((i) => i.status === "paid").length;
    const totalInst = installments.length;
    const totalPaidAmount = installments
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
    const totalContractAmt = Number(contract.totalAmount) || 0;
    const remainingBalance = Math.max(0, totalContractAmt - totalPaidAmount);
    const downPayment = Number(contract.downPayment) || 0;
    const lateFine = Number(contract.lateFine) || 0;

    // สร้างเอกสาร Statement เฉพาะสัญญานี้
    const printContainer = document.createElement("div");
    printContainer.id = "singleContractPrintDocument";
    printContainer.style.cssText = "padding: 24px; font-family: 'Prompt', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; background: #ffffff; max-width: 800px; margin: 0 auto;";

    const rowsHtml = installments.map((inst) => `
      <tr style="border-bottom: 1px solid #e2e8f0; font-size: 13px;">
        <td style="padding: 8px 10px; text-align: center; font-weight: 600; border: 1px solid #cbd5e1;">งวดที่ ${inst.installmentNo}</td>
        <td style="padding: 8px 10px; text-align: center; border: 1px solid #cbd5e1;">${formatDateThai(inst.dueDate)}</td>
        <td style="padding: 8px 10px; text-align: right; font-weight: 700; border: 1px solid #cbd5e1;">฿${(Number(inst.amount) || 0).toLocaleString()}</td>
        <td style="padding: 8px 10px; text-align: center; border: 1px solid #cbd5e1;">
          ${inst.status === "paid"
        ? '<span style="color: #059669; font-weight: 700; background: #d1fae5; padding: 2px 8px; border-radius: 4px;">✓ ชำระแล้ว</span>'
        : '<span style="color: #d97706; font-weight: 600; background: #fef3c7; padding: 2px 8px; border-radius: 4px;">รอชำระ</span>'
      }
        </td>
        <td style="padding: 8px 10px; text-align: center; color: #64748b; font-size: 12px; border: 1px solid #cbd5e1;">${inst.paidAt ? formatDateThai(inst.paidAt.slice(0, 10)) : "-"}</td>
        <td style="padding: 8px 10px; text-align: right; color: #475569; border: 1px solid #cbd5e1;">฿${(Number(inst.remainingBalanceAfter) || 0).toLocaleString()}</td>
      </tr>
    `).join("");

    printContainer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0284c7; padding-bottom: 14px; margin-bottom: 16px;">
        <div>
          <h2 style="margin: 0; color: #0284c7; font-size: 22px; font-weight: 700;">EasyFinance Solutions</h2>
          <div style="font-size: 13px; color: #64748b; margin-top: 3px;">ใบแจ้งยอดและตารางผ่อนชำระค่างวดสินเชื่อ (Loan Statement)</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 17px; font-weight: 700; color: #0f172a;">เลขที่สัญญา: ${contract.id}</div>
          <div style="font-size: 12px; color: #64748b;">วันที่ออกเอกสาร: ${formatDateThai(getLocalDateStr())}</div>
        </div>
      </div>

      <!-- ข้อมูลผู้กู้ / ลูกค้า -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 13px;">
        <div>
          <div><strong style="color: #475569;">ชื่อ-นามสกุล:</strong> <span style="font-weight: 600; color: #0f172a;">${contract.name || "-"}</span></div>
          <div style="margin-top: 4px;"><strong style="color: #475569;">เบอร์โทรศัพท์:</strong> ${contract.phone || "-"}</div>
          <div style="margin-top: 4px;"><strong style="color: #475569;">เลขบัตรประชาชน:</strong> ${contract.idCard || "-"}</div>
          <div style="margin-top: 4px;"><strong style="color: #475569;">ที่อยู่:</strong> ${contract.address || "-"}</div>
        </div>
        <div>
          <div><strong style="color: #475569;">สิ่งที่ผ่อน/รายการสินเชื่อ:</strong> <span style="font-weight: 600; color: #0284c7;">${contract.itemFinanced || "-"}</span></div>
          <div style="margin-top: 4px;"><strong style="color: #475569;">รอบการชำระ:</strong> ${contract.paymentFrequency === "daily" ? "รายวัน" : contract.paymentFrequency === "weekly" ? "รายอาทิตย์" : "รายเดือน"} (${contract.dueSchedule || "-"})</div>
          <div style="margin-top: 4px;"><strong style="color: #475569;">สถานะสัญญา:</strong> ${contract.status === "completed" ? "ปิดสัญญาเรียบร้อย" : "กำลังผ่อนชำระ"}</div>
          ${lateFine > 0 ? `<div style="margin-top: 4px; color: #ea580c; font-weight: 600;"><strong>ค่าปรับชำระล่าช้า:</strong> ฿${lateFine.toLocaleString()} (${contract.lateFineReason || "เกินกำหนด"})</div>` : ""}
        </div>
      </div>

      <!-- สรุปตัวเลขยอดเงิน 4 ช่อง -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px; text-align: center;">
        <div style="background: #e0f2fe; padding: 10px; border-radius: 6px; border: 1px solid #bae6fd;">
          <div style="font-size: 11px; color: #0369a1;">ยอดผ่อนรวม (ต้น+ดอก)</div>
          <div style="font-size: 16px; font-weight: 700; color: #0284c7; margin-top: 2px;">฿${totalContractAmt.toLocaleString()}</div>
        </div>
        <div style="background: #f1f5f9; padding: 10px; border-radius: 6px; border: 1px solid #cbd5e1;">
          <div style="font-size: 11px; color: #475569;">เงินดาวน์</div>
          <div style="font-size: 16px; font-weight: 700; color: #334155; margin-top: 2px;">฿${downPayment.toLocaleString()}</div>
        </div>
        <div style="background: #dcfce7; padding: 10px; border-radius: 6px; border: 1px solid #bbf7d0;">
          <div style="font-size: 11px; color: #15803d;">ชำระแล้ว (${paidCount}/${totalInst} งวด)</div>
          <div style="font-size: 16px; font-weight: 700; color: #16a34a; margin-top: 2px;">฿${totalPaidAmount.toLocaleString()}</div>
        </div>
        <div style="background: #fef3c7; padding: 10px; border-radius: 6px; border: 1px solid #fde68a;">
          <div style="font-size: 11px; color: #b45309;">ยอดคงเหลือรอชำระ</div>
          <div style="font-size: 16px; font-weight: 700; color: #d97706; margin-top: 2px;">฿${remainingBalance.toLocaleString()}</div>
        </div>
      </div>

      <!-- ตารางงวดทั้งหมด (เห็นครบทุกงวด 100%) -->
      <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
        <thead>
          <tr style="background: #0f172a; color: #ffffff; font-size: 12px;">
            <th style="padding: 8px 10px; border: 1px solid #334155;">งวดที่</th>
            <th style="padding: 8px 10px; border: 1px solid #334155;">กำหนดชำระ</th>
            <th style="padding: 8px 10px; border: 1px solid #334155; text-align: right;">ค่างวด (บาท)</th>
            <th style="padding: 8px 10px; border: 1px solid #334155;">สถานะ</th>
            <th style="padding: 8px 10px; border: 1px solid #334155;">วันที่ชำระจริง</th>
            <th style="padding: 8px 10px; border: 1px solid #334155; text-align: right;">คงเหลือหลังชำระ</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div style="margin-top: 24px; display: flex; justify-content: space-between; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px;">
        <div>เอกสารออกโดยระบบ EasyFinance Solutions Management</div>
        <div>หน้า 1 / 1 (ข้อมูลสมบูรณ์)</div>
      </div>
    `;

    if (typeof html2pdf !== "undefined") {
      showAdminToast(`กำลังสร้างไฟล์ PDF สัญญา ${contract.id}...`, "info");
      const cleanCustomerName = (contract.name || "Customer").replace(/[\/\\?%*:|"<>]/g, "");
      const opt = {
        margin: [8, 8, 8, 8],
        filename: `ตารางสัญญา_${contract.id}_${cleanCustomerName}_${getLocalDateStr()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      };

      html2pdf()
        .set(opt)
        .from(printContainer)
        .save()
        .then(() => {
          showAdminToast(`ดาวน์โหลดไฟล์ PDF สัญญา ${contract.id} สำเร็จแล้ว`, "success");
        })
        .catch((err) => {
          console.error("Single contract PDF export error:", err);
          showAdminToast("เกิดข้อผิดพลาดในการสร้าง PDF ลองใช้ปุ่มพิมพ์แทน", "error");
        });
    } else {
      const printWin = window.open("", "_blank");
      if (printWin) {
        printWin.document.write(`
          <html>
            <head>
              <title>ตารางสัญญา ${contract.id} - ${contract.name}</title>
              <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap&subset=thai,latin" rel="stylesheet">
              <style>
                body { margin: 0; padding: 20px; font-family: 'Prompt', sans-serif; background: #fff; color: #000; }
                @page { size: A4 portrait; margin: 10mm; }
              </style>
            </head>
            <body>
              ${printContainer.outerHTML}
              <script>window.onload = function() { window.print(); window.close(); };<\/script>
            </body>
          </html>
        `);
        printWin.document.close();
      }
    }
  };

  // Event Listeners สำหรับ Customer Database & Dossier Modals
  if (menuCustomerDb) {
    menuCustomerDb.addEventListener("click", () => openCustomerDatabaseModal());
  }
  if (btnOpenCustomerDb) {
    btnOpenCustomerDb.addEventListener("click", () => openCustomerDatabaseModal());
  }
  if (btnCloseCustomerDbModal) {
    btnCloseCustomerDbModal.addEventListener("click", () => closeCustomerDatabaseModal());
  }
  if (customerDbSearchInput) {
    customerDbSearchInput.addEventListener("input", () => {
      if (btnCustomerDbSearchClear) {
        btnCustomerDbSearchClear.style.display = customerDbSearchInput.value.trim() ? "inline-flex" : "none";
      }
      renderCustomerDatabaseList();
    });
  }
  if (btnCustomerDbSearchClear) {
    btnCustomerDbSearchClear.addEventListener("click", () => {
      if (customerDbSearchInput) {
        customerDbSearchInput.value = "";
        btnCustomerDbSearchClear.style.display = "none";
        renderCustomerDatabaseList();
        customerDbSearchInput.focus();
      }
    });
  }
  if (btnCloseDossierModal) {
    btnCloseDossierModal.addEventListener("click", () => {
      customerDossierModal.classList.remove("active");
    });
  }

  // --- 8.5 LATE PAYMENT FINE / PENALTY MANAGEMENT (Requirement 4) ---
  function openPenaltyModal(contractId) {
    const contract = window.easyFinanceDB.getContractById(contractId);
    if (!contract) {
      showAdminToast("ไม่พบข้อมูลสัญญา", "error");
      return;
    }

    if (penaltyContractId) penaltyContractId.value = contract.id;
    if (penaltyTargetCustomerName) penaltyTargetCustomerName.textContent = contract.name;
    if (penaltyTargetContractId) penaltyTargetContractId.textContent = contract.id;
    if (penaltyTargetItemInfo) penaltyTargetItemInfo.textContent = `สิ่งที่ผ่อน: ${contract.itemFinanced || "สินเชื่อทั่วไป"}`;

    const installments = contract.installments || [];
    const pending = installments.find((i) => i.status !== "paid");
    if (penaltyTargetDueInfo) {
      if (pending) {
        penaltyTargetDueInfo.textContent = `งวดค้างชำระ: งวดที่ ${pending.installmentNo} (ครบกำหนด ${formatDateThai(pending.dueDate)}) ค่างวด ฿${Number(pending.amount).toLocaleString()}`;
      } else {
        penaltyTargetDueInfo.textContent = "สถานะ: ปิดสัญญาสมบูรณ์แล้ว";
      }
    }

    const currentFine = Number(contract.lateFine) || 0;
    if (penaltyAmountInput) {
      penaltyAmountInput.value = currentFine > 0 ? currentFine : "";
    }
    if (penaltyReasonInput) {
      penaltyReasonInput.value = contract.lateFineReason || (currentFine > 0 ? "เกินกำหนดชำระค่างวด" : "");
    }

    if (currentFineStatusBadge) {
      if (currentFine > 0) {
        currentFineStatusBadge.style.display = "inline-flex";
        currentFineStatusBadge.textContent = `มีค่าปรับค้าง ฿${currentFine.toLocaleString()}`;
      } else {
        currentFineStatusBadge.style.display = "none";
      }
    }

    if (penaltyModalAdmin) {
      penaltyModalAdmin.classList.add("active");
    }
  }

  function closePenaltyModal() {
    if (penaltyModalAdmin) {
      penaltyModalAdmin.classList.remove("active");
    }
  }

  window.setQuickFine = function (amount) {
    if (!penaltyAmountInput) return;
    const cur = parseFloat(penaltyAmountInput.value) || 0;
    penaltyAmountInput.value = cur + amount;
  };

  if (btnClosePenaltyModal) {
    btnClosePenaltyModal.addEventListener("click", () => closePenaltyModal());
  }

  if (penaltyAdminForm) {
    penaltyAdminForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const contractId = penaltyContractId ? penaltyContractId.value : "";
      if (!contractId) return;

      const fineAmount = parseFloat(penaltyAmountInput ? penaltyAmountInput.value : 0) || 0;
      const reason = penaltyReasonInput ? penaltyReasonInput.value.trim() : "";

      await window.easyFinanceDB.updateContractLateFine(contractId, fineAmount, reason);

      if (fineAmount > 0) {
        showAdminToast(`บันทึกค่าปรับสัญญา ${contractId} จำนวน ฿${fineAmount.toLocaleString()} เรียบร้อยแล้ว (ซิงค์หน้าลูกค้าทันที)`, "success");
      } else {
        showAdminToast(`ล้างค่าปรับสัญญา ${contractId} เป็น 0 เรียบร้อยแล้ว (หน้าลูกค้าค่าปรับจะหายทันที)`, "success");
      }

      if (penaltyAmountInput) penaltyAmountInput.value = fineAmount > 0 ? fineAmount : "";
      if (penaltyReasonInput) penaltyReasonInput.value = fineAmount > 0 ? reason : "";
      if (currentFineStatusBadge) {
        if (fineAmount > 0) {
          currentFineStatusBadge.style.display = "inline-flex";
          currentFineStatusBadge.textContent = `มีค่าปรับค้าง ฿${fineAmount.toLocaleString()}`;
        } else {
          currentFineStatusBadge.style.display = "none";
          currentFineStatusBadge.textContent = "";
        }
      }

      closePenaltyModal();
      renderStatsCounters();
      renderSubTabs();
      if (currentTab === "overview") renderOverviewCards();
      renderActiveTabTable();

      if (currentViewingContractId === contractId && contractDetailModal && contractDetailModal.classList.contains("active")) {
        openContractDetails(contractId);
      }
      if (customerDatabaseModal && customerDatabaseModal.classList.contains("active")) {
        renderCustomerDatabaseList();
      }
      if (customerDossierModal && customerDossierModal.classList.contains("active") && currentViewingCustomerKey) {
        openCustomerDossier(currentViewingCustomerKey);
      }
      const lateFineModal = document.getElementById("lateFineReportModal");
      if (lateFineModal && lateFineModal.classList.contains("active")) {
        const datePicker = document.getElementById("lateFineDatePicker");
        renderLateFineReport(datePicker ? datePicker.value : null);
      }
    });
  }

  window.payPenaltyAndConfirm = async function () {
    const contractId = penaltyContractId ? penaltyContractId.value : "";
    if (!contractId) return;

    const fineAmount = parseFloat(penaltyAmountInput ? penaltyAmountInput.value : 0) || 0;
    if (fineAmount <= 0) {
      showAdminToast("กรุณาระบุยอดเงินค่าปรับที่ต้องการบันทึกรับชำระ", "warning");
      return;
    }

    if (confirm(`ยืนยันการบันทึกรับเงินค่าปรับจำนวน ฿${fineAmount.toLocaleString()} ของสัญญา ${contractId} (นับเข้ายอดรับแล้วประจำวันที่ ${formatDateThai(selectedDailyDate)}) ใช่หรือไม่?`)) {
      await window.easyFinanceDB.payContractLateFine(contractId, fineAmount, selectedDailyDate);
      showAdminToast(`บันทึกรับชำระค่าปรับ ฿${fineAmount.toLocaleString()} เรียบร้อยแล้ว (นับรวมในยอดรับแล้วของวันนี้)`, "success");
      closePenaltyModal();
      renderStatsCounters();
      renderSubTabs();
      if (currentTab === "overview") renderOverviewCards();
      renderActiveTabTable();
      if (currentViewingContractId === contractId && contractDetailModal && contractDetailModal.classList.contains("active")) {
        openContractDetails(contractId);
      }
      if (customerDatabaseModal && customerDatabaseModal.classList.contains("active")) {
        renderCustomerDatabaseList();
      }
      if (customerDossierModal && customerDossierModal.classList.contains("active") && currentViewingCustomerKey) {
        openCustomerDossier(currentViewingCustomerKey);
      }
      const lateFineModal = document.getElementById("lateFineReportModal");
      if (lateFineModal && lateFineModal.classList.contains("active")) {
        const datePicker = document.getElementById("lateFineDatePicker");
        renderLateFineReport(datePicker ? datePicker.value : null);
      }
    }
  };

  // ยกเลิกค่าปรับของลูกค้ารายนั้น (ล้างค่าปรับเป็น 0 บาท หน้าลูกค้าหายทันที)
  window.cancelCustomerLateFine = async function (contractId, skipConfirm = false) {
    if (!contractId) return;
    const contract = window.easyFinanceDB.getContractById(contractId);
    if (!contract) {
      showAdminToast("ไม่พบข้อมูลสัญญา", "error");
      return;
    }
    const fineAmt = Number(contract.lateFine) || 0;
    const fineText = fineAmt > 0 ? `ยอดค่าปรับ ฿${fineAmt.toLocaleString()}` : "ค่าปรับ";

    let proceed = skipConfirm;
    if (!proceed) {
      proceed = confirm(
        `ยืนยันการ "ยกเลิกค่าปรับ" ของลูกค้า "${contract.name}" (สัญญา ${contract.id}) ${fineText} ใช่หรือไม่?\n\n` +
        `• ระบบจะรีเซ็ตค่าปรับของลูกค้ารายนี้เป็น 0 บาททันที\n` +
        `• หน้าบ้านลูกค้า: กรอบค่าปรับจะหายไปทันทีแบบเรียลไทม์\n` +
        `• ยอดรวมค่าปรับและสถิติในระบบจะปรับลดทันที\n\n` +
        `👉 กด [ ตกลง ] (OK) เพื่อยืนยันการล้างค่าปรับเป็น 0 บาททันที\n` +
        `👉 กด [ ยกเลิก ] (Cancel) หากยังไม่ต้องการยกเลิกค่าปรับ`
      );
    }

    if (proceed) {
      await window.easyFinanceDB.updateContractLateFine(contractId, 0, "");
      showAdminToast(`ยกเลิกค่าปรับของลูกค้า ${contract.name} เรียบร้อยแล้ว (หน้าลูกค้าค่าปรับหายทันที)`, "success");

      if (penaltyAmountInput) penaltyAmountInput.value = "";
      if (penaltyReasonInput) penaltyReasonInput.value = "";
      if (currentFineStatusBadge) {
        currentFineStatusBadge.style.display = "none";
        currentFineStatusBadge.textContent = "";
      }

      closePenaltyModal();
      renderStatsCounters();
      renderSubTabs();
      if (currentTab === "overview") renderOverviewCards();
      renderActiveTabTable();

      if (currentViewingContractId === contractId && contractDetailModal && contractDetailModal.classList.contains("active")) {
        openContractDetails(contractId);
      }
      if (customerDatabaseModal && customerDatabaseModal.classList.contains("active")) {
        renderCustomerDatabaseList();
      }
      if (customerDossierModal && customerDossierModal.classList.contains("active") && currentViewingCustomerKey) {
        openCustomerDossier(currentViewingCustomerKey);
      }
      const lateFineModal = document.getElementById("lateFineReportModal");
      if (lateFineModal && lateFineModal.classList.contains("active")) {
        const datePicker = document.getElementById("lateFineDatePicker");
        renderLateFineReport(datePicker ? datePicker.value : null);
      }
    }
  };

  // ยกเลิกค่าปรับจากปุ่มในหน้าต่าง Modal จัดการค่าปรับ (ล้างทันที ไม่ต้องมี confirm ซ้อน)
  window.cancelCustomerLateFineFromModal = function () {
    const contractId = penaltyContractId ? penaltyContractId.value : "";
    if (contractId) {
      cancelCustomerLateFine(contractId, true);
    }
  };

  window.clearAndConfirmPenalty = function () {
    cancelCustomerLateFineFromModal();
  };

  // ยกเลิกรายการรับเงินค่าปรับโดยตรง (Rollback direct fine payment)
  window.undoDirectFinePayment = async function (contractId, fineHistId) {
    if (!contractId || !fineHistId) return;
    if (confirm(`ต้องการยกเลิกรายการรับเงินค่าปรับนี้ และคืนสถานะใช่หรือไม่?`)) {
      if (window.easyFinanceDB.undoFinePayment) {
        const ok = await window.easyFinanceDB.undoFinePayment(contractId, fineHistId);
        if (ok) {
          showAdminToast("ยกเลิกรายการรับเงินค่าปรับเรียบร้อยแล้ว", "success");
        } else {
          showAdminToast("ไม่พบรายการรับเงินค่าปรับที่ต้องการยกเลิก", "error");
        }
        renderStatsCounters();
        renderSubTabs();
        if (currentTab === "overview") renderOverviewCards();
        renderActiveTabTable();
        const datePicker = document.getElementById("lateFineDatePicker");
        renderLateFineReport(datePicker ? datePicker.value : null);
      }
    }
  };

  // Expose to window for inline onclick handlers
  window.openCustomerDatabaseModal = openCustomerDatabaseModal;
  window.closeCustomerDatabaseModal = closeCustomerDatabaseModal;
  window.filterCustomerDb = filterCustomerDb;
  window.openCustomerDossier = openCustomerDossier;
  window.backToCustomerDbList = backToCustomerDbList;
  window.saveCustomerDossierNotes = saveCustomerDossierNotes;
  window.downloadCurrentCustomerExcel = downloadCurrentCustomerExcel;
  window.downloadCurrentCustomerPDF = downloadCurrentCustomerPDF;
  window.printCurrentCustomerDossier = printCurrentCustomerDossier;
  window.openPenaltyModal = openPenaltyModal;
  window.closePenaltyModal = closePenaltyModal;

  // --- 8.6 SECURE DELETION VERIFICATION (Requirement 1: ใส่รหัสผ่านยืนยันก่อนลบลูกค้า/สัญญา) ---
  const DELETE_SECURITY_PIN = "delete9999"; // รหัสผ่านยืนยันการลบลูกค้า (คนละชุดกับรหัสผ่านเข้าหลังบ้าน admin123)

  function openDeleteSecurityModal(id, type = "contract") {
    if (deleteTargetId) deleteTargetId.value = id;
    if (deleteTargetType) deleteTargetType.value = type;
    if (deleteSecurityPasswordInput) {
      deleteSecurityPasswordInput.value = "";
      deleteSecurityPasswordInput.type = "password";
    }
    if (iconToggleDeletePass) {
      iconToggleDeletePass.className = "fa-solid fa-eye";
    }
    if (deleteSecurityErrorMsg) {
      deleteSecurityErrorMsg.style.display = "none";
    }

    if (deleteTargetItemLabel) {
      if (type === "contract") {
        const c = window.easyFinanceDB.getContractById(id);
        deleteTargetItemLabel.textContent = c ? `สัญญา ${c.id} (${c.name} - ${c.itemFinanced || "สินเชื่อ"})` : `สัญญา ${id}`;
      } else if (type === "bad_debt") {
        const b = window.easyFinanceDB.getBadDebtById ? window.easyFinanceDB.getBadDebtById(id) : null;
        deleteTargetItemLabel.textContent = b ? `ประวัติหนี้เสีย ${b.name || id}` : `รายการ ${id}`;
      } else if (type === "customer") {
        const cust = getAggregatedCustomerByKey(id);
        const count = cust ? cust.contracts.length : 0;
        deleteTargetItemLabel.textContent = cust ? `ลูกค้า: ${cust.name} (พร้อมสัญญาทั้งหมด ${count} สัญญา)` : `ลูกค้า ${id}`;
      } else {
        deleteTargetItemLabel.textContent = id;
      }
    }

    if (deleteSecurityModal) {
      deleteSecurityModal.classList.add("active");
      setTimeout(() => {
        if (deleteSecurityPasswordInput) deleteSecurityPasswordInput.focus();
      }, 150);
    }
  }

  function closeDeleteSecurityModal() {
    if (deleteSecurityModal) {
      deleteSecurityModal.classList.remove("active");
    }
    if (deleteSecurityPasswordInput) {
      deleteSecurityPasswordInput.value = "";
    }
    if (deleteSecurityErrorMsg) {
      deleteSecurityErrorMsg.style.display = "none";
    }
  }

  if (btnCloseDeleteSecurityModal) {
    btnCloseDeleteSecurityModal.addEventListener("click", () => closeDeleteSecurityModal());
  }
  if (btnCancelDeleteSecurity) {
    btnCancelDeleteSecurity.addEventListener("click", () => closeDeleteSecurityModal());
  }
  if (btnToggleDeletePass && deleteSecurityPasswordInput && iconToggleDeletePass) {
    btnToggleDeletePass.addEventListener("click", () => {
      const isPass = deleteSecurityPasswordInput.type === "password";
      deleteSecurityPasswordInput.type = isPass ? "text" : "password";
      iconToggleDeletePass.className = isPass ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
    });
  }

  if (deleteSecurityForm) {
    deleteSecurityForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const enteredPass = deleteSecurityPasswordInput ? deleteSecurityPasswordInput.value.trim() : "";
      const configuredPin = localStorage.getItem("easyfinance_delete_pin") || DELETE_SECURITY_PIN;

      if (enteredPass !== configuredPin) {
        if (deleteSecurityErrorMsg) {
          deleteSecurityErrorMsg.style.display = "block";
          deleteSecurityErrorMsg.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> รหัสผ่านยืนยันการลบไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง';
        }
        if (deleteSecurityPasswordInput) {
          deleteSecurityPasswordInput.focus();
          deleteSecurityPasswordInput.select();
        }
        return;
      }

      // รหัสถูกต้อง ทำการลบข้อมูล
      const targetId = deleteTargetId ? deleteTargetId.value : "";
      const targetType = deleteTargetType ? deleteTargetType.value : "contract";

      if (targetType === "contract") {
        await window.easyFinanceDB.deleteContract(targetId);
        showAdminToast(`ลบสัญญา ${targetId} สำเร็จเรียบร้อยแล้ว`, "success");
      } else if (targetType === "bad_debt") {
        await window.easyFinanceDB.deleteBadDebt(targetId);
        showAdminToast(`ลบข้อมูลหนี้เสีย ${targetId} สำเร็จเรียบร้อยแล้ว`, "success");
      } else if (targetType === "customer") {
        const cust = getAggregatedCustomerByKey(targetId);
        if (cust) {
          for (const c of cust.contracts) {
            await window.easyFinanceDB.deleteContract(c.id);
          }
          for (const b of (cust.badDebts || [])) {
            if (window.easyFinanceDB.deleteBadDebt) {
              await window.easyFinanceDB.deleteBadDebt(b.id);
            }
          }
          try {
            localStorage.removeItem("customer_notes_" + cust.key);
          } catch (e) { }
          showAdminToast(`ลบข้อมูลลูกค้า ${cust.name} และสัญญาทั้งหมดสำเร็จเรียบร้อยแล้ว`, "success");
        }
      }

      closeDeleteSecurityModal();
      renderStatsCounters();
      renderSubTabs();
      renderActiveTabTable();
      updateCustomerBadges();
      if (customerDatabaseModal && customerDatabaseModal.classList.contains("active")) {
        renderCustomerDatabaseList();
      }
      if (customerDossierModal && customerDossierModal.classList.contains("active")) {
        customerDossierModal.classList.remove("active");
        renderCustomerDatabaseList();
      }
    });
  }

  // Global Delete Customer
  window.deleteCustomerConfirm = function (customerKey) {
    const key = customerKey || currentViewingCustomerKey;
    if (!key) {
      showAdminToast("ไม่พบรหัสลูกค้าที่ต้องการลบ", "error");
      return;
    }
    openDeleteSecurityModal(key, "customer");
  };

  window.openDeleteSecurityModal = openDeleteSecurityModal;
  window.closeDeleteSecurityModal = closeDeleteSecurityModal;

  // --- 8.7 STRICT MODAL DISMISSAL POLICY (Requirement 4: ต้องกด X หรือ บันทึก/ยกเลิกก่อนเท่านั้นถึงจะหาย) ---
  document.querySelectorAll(".admin-modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      // ป้องกันการปิดโมดอลโดยไม่ได้ตั้งใจเมื่อคลิกนอกกรอบ (Backdrop) ทุกโมดอล ต้องกด X หรือ บันทึก/ยกเลิกเท่านั้น
      if (e.target === overlay) {
        return;
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      // ห้ามปิดโมดอลด้วยปุ่ม Escape ทุกโมดอล เพื่อป้องกันข้อมูลที่กรอกหรือดูอยู่หาย
      return;
    }
  });

  // --- 9. REAL-TIME OBSERVER & HELPERS ---

  window.easyFinanceDB.subscribe(() => {
    renderStatsCounters();
    renderSubTabs();
    if (currentTab === "overview") renderOverviewCards();
    renderActiveTabTable();
    updateCloudStatus();
    updateCustomerBadges();

    if (customerDatabaseModal && customerDatabaseModal.classList.contains("active")) {
      renderCustomerDatabaseList();
    }
    if (customerDossierModal && customerDossierModal.classList.contains("active") && currentViewingCustomerKey) {
      const c = getAggregatedCustomerByKey(currentViewingCustomerKey);
      if (c) renderCustomerDossierContent(c);
    }

    const lateFineReportModal = document.getElementById("lateFineReportModal");
    if (lateFineReportModal && lateFineReportModal.classList.contains("active")) {
      const picker = document.getElementById("lateFineDatePicker");
      renderLateFineReport(picker && picker.value ? picker.value : null);
    }
    const interestCutReportModal = document.getElementById("interestCutReportModal");
    if (interestCutReportModal && interestCutReportModal.classList.contains("active")) {
      const picker = document.getElementById("interestCutDatePicker");
      renderInterestCutReport(picker && picker.value ? picker.value : null);
    }
    const downPaymentModal = document.getElementById("downPaymentReportModal");
    if (downPaymentModal && downPaymentModal.classList.contains("active")) {
      const picker = document.getElementById("downPaymentDatePicker");
      renderDownPaymentReport(picker && picker.value ? picker.value : null);
    }
    const dailyAllCategoriesModal = document.getElementById("dailyAllCategoriesReportModal");
    if (dailyAllCategoriesModal && dailyAllCategoriesModal.classList.contains("active")) {
      const picker = document.getElementById("dailyAllCategoriesDatePicker");
      renderDailyAllCategoriesReport(picker && picker.value ? picker.value : null);
    }
    const bankReconModal = document.getElementById("bankReconciliationModal");
    if (bankReconModal && bankReconModal.classList.contains("active")) {
      const picker = document.getElementById("bankReconDatePicker");
      renderBankReconciliation(picker && picker.value ? picker.value : null);
    }

    const allBadDebts = window.easyFinanceDB.getBadDebts ? window.easyFinanceDB.getBadDebts() : [];
    if (badDebtBadgeCount) {
      badDebtBadgeCount.textContent = allBadDebts.length;
      badDebtBadgeCount.style.display = allBadDebts.length > 0 ? "inline-flex" : "none";
    }
  });

  function showAdminToast(message, type = "success") {
    const container = document.getElementById("adminToastContainer");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i class="fa-solid fa-${type === "success" ? "circle-check" : "circle-exclamation"}"></i>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-10px)";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Check auth on load
  checkAdminAuth();
});
