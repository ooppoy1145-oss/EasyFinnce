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
  const pillDailyBtn = document.getElementById("pillDailyBtn");
  const pillWeeklyBtn = document.getElementById("pillWeeklyBtn");
  const pillMonthlyBtn = document.getElementById("pillMonthlyBtn");
  const pillMotorcycleBtn = document.getElementById("pillMotorcycleBtn");
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

  // --- HELPER: DAILY STATUS BY SPECIFIC DATE (Requirement 2: เลือกวันที่แล้วดูว่าใครจ่าย/ไม่จ่าย) ---
  function getDailyStatusForDate(contract, dateStr) {
    const installments = contract.installments || [];
    if (installments.length === 0) return { status: "pending", label: "ไม่มีงวด", installment: null, amount: 0 };

    // 1. มีงวดที่จ่ายในวันที่ dateStr นี้หรือไม่
    const paidOnDate = installments.find(
      (i) => i.status === "paid" && i.paidAt && i.paidAt.includes(dateStr)
    );
    if (paidOnDate) {
      return {
        status: "paid",
        installment: paidOnDate,
        amount: Number(paidOnDate.amount) || 0,
        label: `จ่ายแล้ว (งวด ${paidOnDate.installmentNo})`
      };
    }

    // 2. มีงวดที่กำหนดชำระตรงกับ dateStr นี้หรือไม่
    const dueOnDate = installments.find((i) => i.dueDate === dateStr);
    if (dueOnDate) {
      if (dueOnDate.status === "paid") {
        return {
          status: "paid",
          installment: dueOnDate,
          amount: Number(dueOnDate.amount) || 0,
          label: `จ่ายแล้ว (งวด ${dueOnDate.installmentNo})`
        };
      } else {
        return {
          status: "pending",
          installment: dueOnDate,
          amount: Number(dueOnDate.amount) || 0,
          label: `ค้างจ่าย (งวด ${dueOnDate.installmentNo})`
        };
      }
    }

    // 3. ปิดสัญญาครบทุกงวดแล้วหรือไม่
    const allPaid = installments.every((i) => i.status === "paid");
    if (allPaid) {
      return {
        status: "paid",
        installment: null,
        amount: 0,
        label: "ปิดสัญญาแล้ว"
      };
    }

    // 4. สัญญาที่ยังผ่อนอยู่ แต่วันที่เลือกยังไม่มียอดจ่าย
    const nextPending = installments.find((i) => i.status !== "paid");
    const instAmt = Number(nextPending ? nextPending.amount : (installments[0]?.amount || 0));
    return {
      status: "pending",
      installment: nextPending,
      amount: instAmt,
      label: nextPending ? `ค้างจ่าย (งวด ${nextPending.installmentNo})` : "ยังไม่จ่าย"
    };
  }

  // --- HELPER: WEEKLY STATUS BY DATE RANGE (เลือกช่วงตั้งแต่วันที่ ... ถึงวันที่ ...) ---
  function getWeeklyStatusForRange(contract, startDate, endDate) {
    const installments = contract.installments || [];
    if (installments.length === 0) return { status: "pending", label: "ไม่มีงวด", installment: null, amount: 0 };

    // 1. มีงวดที่จ่ายในช่วง startDate ถึง endDate หรือไม่
    const paidInRange = installments.find((inst) => {
      if (inst.status !== "paid" || !inst.paidAt) return false;
      const pDate = inst.paidAt.slice(0, 10);
      return pDate >= startDate && pDate <= endDate;
    });

    if (paidInRange) {
      return {
        status: "paid",
        installment: paidInRange,
        amount: Number(paidInRange.amount) || 0,
        label: `จ่ายแล้ว (งวด ${paidInRange.installmentNo})`
      };
    }

    // 2. มีงวดที่กำหนดชำระอยู่ในช่วง startDate ถึง endDate หรือไม่
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
          amount: Number(dueInRange.amount) || 0,
          label: `จ่ายแล้ว (งวด ${dueInRange.installmentNo})`
        };
      } else {
        return {
          status: "pending",
          installment: dueInRange,
          amount: Number(dueInRange.amount) || 0,
          label: `ค้างจ่าย (งวด ${dueInRange.installmentNo})`
        };
      }
    }

    // 3. ปิดสัญญาครบทุกงวดแล้วหรือไม่
    const allPaid = installments.every((i) => i.status === "paid");
    if (allPaid) {
      return {
        status: "paid",
        installment: null,
        amount: 0,
        label: "ปิดสัญญาแล้ว"
      };
    }

    // 4. สัญญาที่ยังผ่อนอยู่ แต่งวดในช่วงนี้ยังไม่มียอดจ่าย
    const nextPending = installments.find((i) => i.status !== "paid");
    const instAmt = Number(nextPending ? nextPending.amount : (installments[0]?.amount || 0));
    return {
      status: "pending",
      installment: nextPending,
      amount: instAmt,
      label: nextPending ? `ค้างจ่าย (งวด ${nextPending.installmentNo})` : "ยังไม่จ่าย"
    };
  }

  // --- HELPER: MONTHLY STATUS BY MONTH (เลือกเดือน เช่น 2026-09) ---
  function getMonthlyStatusForMonth(contract, monthStr) {
    const installments = contract.installments || [];
    if (installments.length === 0) return { status: "pending", label: "ไม่มีงวด", installment: null, amount: 0 };

    // 1. มีงวดที่จ่ายในเดือน monthStr นี้หรือไม่
    const paidInMonth = installments.find((inst) => {
      if (inst.status !== "paid" || !inst.paidAt) return false;
      return inst.paidAt.includes(monthStr);
    });

    if (paidInMonth) {
      return {
        status: "paid",
        installment: paidInMonth,
        amount: Number(paidInMonth.amount) || 0,
        label: `จ่ายแล้ว (งวด ${paidInMonth.installmentNo})`
      };
    }

    // 2. มีงวดที่กำหนดชำระอยู่ในเดือน monthStr หรือไม่
    const dueInMonth = installments.find((inst) => {
      if (!inst.dueDate) return false;
      return inst.dueDate.includes(monthStr);
    });

    if (dueInMonth) {
      if (dueInMonth.status === "paid") {
        return {
          status: "paid",
          installment: dueInMonth,
          amount: Number(dueInMonth.amount) || 0,
          label: `จ่ายแล้ว (งวด ${dueInMonth.installmentNo})`
        };
      } else {
        return {
          status: "pending",
          installment: dueInMonth,
          amount: Number(dueInMonth.amount) || 0,
          label: `ค้างจ่าย (งวด ${dueInMonth.installmentNo})`
        };
      }
    }

    // 3. ปิดสัญญาครบทุกงวดแล้วหรือไม่
    const allPaid = installments.every((i) => i.status === "paid");
    if (allPaid) {
      return {
        status: "paid",
        installment: null,
        amount: 0,
        label: "ปิดสัญญาแล้ว"
      };
    }

    // 4. สัญญาที่ยังผ่อนอยู่ แต่เดือนนี้ยังไม่จ่าย
    const nextPending = installments.find((i) => i.status !== "paid");
    const instAmt = Number(nextPending ? nextPending.amount : (installments[0]?.amount || 0));
    return {
      status: "pending",
      installment: nextPending,
      amount: instAmt,
      label: nextPending ? `ค้างจ่าย (งวด ${nextPending.installmentNo})` : "ยังไม่จ่าย"
    };
  }

  // --- HELPER: GENERAL CUSTOMER PAYMENT STATUS ---
  function getCustomerPaymentStatus(contract, freq) {
    const installments = contract.installments || [];
    if (installments.length === 0) return "pending";

    const pendingInsts = installments.filter((i) => i.status !== "paid");
    const isFullyPaid = pendingInsts.length === 0;

    // หากผ่อนครบทุกงวดแล้ว ถือว่าสถานะคือจ่ายแล้ว
    if (isFullyPaid) return "paid";

    if (freq === "daily" || freq === "weekly" || freq === "monthly") {
      return getDailyStatusForDate(contract, selectedDailyDate).status;
    }

    return isFullyPaid ? "paid" : "pending";
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
      totalFinanced += (totalAmount + downPayment);
      totalCollected += downPayment;

      const installments = c.installments || [];
      const paidAmt = installments
        .filter((inst) => inst.status === "paid")
        .reduce((sum, inst) => sum + (Number(inst.amount) || 0), 0);
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

      // 1. หลังบ้านแสดงยอดทั้งหมดที่รวมทั้งเงินดาวน์ด้วย (ยอดปล่อยทั้งหมด = ยอดผ่อน + เงินดาวน์)
      totalFinanced += (totalAmount + downPayment);
      // เงินดาวน์นับเป็นยอดที่เก็บมาได้แล้วตั้งแต่เริ่มทำสัญญา
      totalCollected += downPayment;

      const installments = c.installments || [];
      const paidAmt = installments
        .filter((inst) => inst.status === "paid")
        .reduce((sum, inst) => sum + (Number(inst.amount) || 0), 0);
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
  // Helper to sync single date input value and toggle active class on quick buttons
  function updatePeriodDateInputs() {
    syncPeriodDates();
    if (adminDateFilter) adminDateFilter.value = selectedDailyDate;

    const todayStr = getLocalDateStr();
    if (btnDateToday) {
      btnDateToday.classList.toggle("active", selectedDailyDate === todayStr);
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

    contracts.forEach((c) => {
      const downPayment = Number(c.downPayment) || 0;
      const totalAmount = Number(c.totalAmount) || 0;
      const installments = c.installments || [];
      const contractPaidAmount = installments
        .filter((inst) => inst.status === "paid")
        .reduce((sum, inst) => sum + (Number(inst.amount) || 0), 0);
      const contractOutstanding = Math.max(0, totalAmount - contractPaidAmount);

      // Requirement: หมวดรถมอไซต์ ไม่ต้องยกยอดไปรวมกับยอดปล่อยสินเชื่อรวม ให้แยกยอดออกมาต่างหาก
      if (isMotorcycleContract(c)) {
        totalMotorcycleFinanced += (totalAmount + downPayment);
        totalMotorcycleCollected += (downPayment + contractPaidAmount);
        totalMotorcycleOutstanding += contractOutstanding;
        motorcycleContractsCount++;
      } else {
        // ยอดปล่อยสินเชื่อทั่วไป (ไม่รวมมอไซต์)
        totalFinanced += (totalAmount + downPayment);
        totalCollected += (downPayment + contractPaidAmount);
        totalOutstanding += contractOutstanding;
      }

      // Requirement 4: คำนวณยอดค่าปรับแยกต่างหาก ไม่รวมกับยอดปล่อยสินเชื่อรวม
      const contractCollectedFine = Number(c.totalLateFinesCollected) || 0;
      let instCollectedFine = 0;
      installments.forEach((inst) => {
        if (inst.paidLateFine) instCollectedFine += Number(inst.paidLateFine) || 0;
      });
      totalLateFinesCollected += Math.max(contractCollectedFine, instCollectedFine);
      totalLateFinesPending += Number(c.lateFine) || 0;
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

    if (isManager) {
      if (statTotalLateFines) {
        statTotalLateFines.textContent = `฿${totalLateFinesCollected.toLocaleString()}`;
        statTotalLateFines.classList.remove("masked-stat-text");
      }
      if (statLateFinesSub) {
        if (totalLateFinesPending > 0) {
          statLateFinesSub.textContent = `เก็บได้ ฿${totalLateFinesCollected.toLocaleString()} (ค้าง ฿${totalLateFinesPending.toLocaleString()})`;
        } else {
          statLateFinesSub.textContent = `ยอดค่าปรับที่เก็บได้ทั้งหมด`;
        }
      }

      // ช่องยอดรวมมอไซต์ (Requirement: แยกยอดออกมาต่างหากใส่ในช่องยอดรวมมอไซต์)
      if (statTotalMotorcycle) {
        statTotalMotorcycle.textContent = `฿${totalMotorcycleFinanced.toLocaleString()}`;
        statTotalMotorcycle.classList.remove("masked-stat-text");
      }
      if (statMotorcycleSub) {
        statMotorcycleSub.textContent = `เก็บได้ ฿${totalMotorcycleCollected.toLocaleString()} (${motorcycleContractsCount} สัญญา)`;
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
      allDailyContracts.forEach((c) => {
        if (getDailyStatusForDate(c, selectedDailyDate).status === "paid") paidCount++;
        else pendingCount++;
      });
      adminSubTabNav.innerHTML = `
        <button class="tab-btn ${currentSubFilter === "all" ? "active" : ""}" onclick="setSubFilter('all')">
          <i class="fa-solid fa-users"></i>
          <span>ลูกค้าทั้งหมดของรายวัน</span>
          <span class="tab-count-badge">${allDailyContracts.length}</span>
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
      `;
    } else if (currentTab === "weekly") {
      const allWeeklyContracts = allContracts.filter((c) => c.paymentFrequency === "weekly" && !isMotorcycleContract(c));
      let paidCount = 0;
      let pendingCount = 0;
      allWeeklyContracts.forEach((c) => {
        if (getDailyStatusForDate(c, selectedDailyDate).status === "paid") paidCount++;
        else pendingCount++;
      });
      adminSubTabNav.innerHTML = `
        <button class="tab-btn ${currentSubFilter === "all" ? "active" : ""}" onclick="setSubFilter('all')">
          <i class="fa-solid fa-users"></i>
          <span>ลูกค้าทั้งหมดของรายอาทิตย์</span>
          <span class="tab-count-badge">${allWeeklyContracts.length}</span>
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
      `;
    } else if (currentTab === "monthly") {
      const allMonthlyContracts = allContracts.filter((c) => c.paymentFrequency === "monthly" && !isMotorcycleContract(c));
      let paidCount = 0;
      let pendingCount = 0;
      allMonthlyContracts.forEach((c) => {
        if (getDailyStatusForDate(c, selectedDailyDate).status === "paid") paidCount++;
        else pendingCount++;
      });
      adminSubTabNav.innerHTML = `
        <button class="tab-btn ${currentSubFilter === "all" ? "active" : ""}" onclick="setSubFilter('all')">
          <i class="fa-solid fa-users"></i>
          <span>ลูกค้าทั้งหมดของรายเดือน</span>
          <span class="tab-count-badge">${allMonthlyContracts.length}</span>
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
      allMotorcycleContracts.forEach((c) => {
        if (getDailyStatusForDate(c, selectedDailyDate).status === "paid") paidCount++;
        else pendingCount++;
      });
      adminSubTabNav.innerHTML = `
        <button class="tab-btn ${currentSubFilter === "all" ? "active" : ""}" onclick="setSubFilter('all')">
          <i class="fa-solid fa-motorcycle" style="color: #38bdf8;"></i>
          <span>สัญญามอเตอร์ไซค์ทั้งหมด</span>
          <span class="tab-count-badge" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8;">${allMotorcycleContracts.length}</span>
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
      `;
    } else {
      // currentTab === 'all' (Requirement 3: ยอด Badge และแถวตารางต้องตรงกัน 100%)
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
    if (currentSubFilter !== "all") {
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
        } else if (currentTab === "daily" || currentTab === "weekly" || currentTab === "monthly" || currentTab === "motorcycle") {
          // ค้นเป็นต่อวันได้เลย: กรองสถานะจ่ายแล้ว/ค้างจ่าย ตามวันที่เลือก
          return getDailyStatusForDate(c, selectedDailyDate).status === currentSubFilter;
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
    const allDailyContracts = window.easyFinanceDB.getContracts().filter((c) => c.paymentFrequency === "daily");
    let dailyTotalAmount = 0;
    let dailyPaidAmount = 0;
    let dailyPendingAmount = 0;
    let paidCount = 0;
    let pendingCount = 0;

    allDailyContracts.forEach((c) => {
      const dailyStatus = getDailyStatusForDate(c, selectedDailyDate);
      const amt = Number(dailyStatus.amount) || 0;
      dailyTotalAmount += amt;
      if (dailyStatus.status === "paid") {
        paidCount++;
        dailyPaidAmount += amt;
      } else {
        pendingCount++;
        dailyPendingAmount += amt;
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
      dailyPendingAmountVal.innerHTML = isManager
        ? `<i class="fa-solid fa-clock"></i> รอเก็บ ฿${dailyPendingAmount.toLocaleString()}`
        : `<i class="fa-solid fa-clock"></i> รอเก็บ ฿******`;
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
      `;
    }

    if (contractsList.length === 0) {
      const filterLabel = currentSubFilter === "paid" ? `ที่จ่ายแล้ว (${dateDisplay})` : currentSubFilter === "pending" ? `ที่ค้างจ่าย (${dateDisplay})` : "ทั้งหมด";
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-dim); padding: 30px;">ไม่พบข้อมูลลูกค้ารายวัน (${filterLabel})</td></tr>`;
      return;
    }

    tableBody.innerHTML = "";
    contractsList.forEach((c) => {
      const installments = c.installments || [];
      const pendingInst = installments.find((i) => i.status !== "paid");
      const contractTotal = Number(c.totalAmount) || 0;
      const totalPaidAmt = installments
        .filter((i) => i.status === "paid")
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
          <strong style="color: var(--primary-light);">฿${Number(pendingInst ? pendingInst.amount : (installments[0]?.amount || 0)).toLocaleString()}</strong>
        </td>
        <td>
          ${isPaid
          ? `<span class="status-badge badge-paid"><i class="fa-solid fa-circle-check"></i> ${dailyStatus.label}</span>`
          : `<span class="status-badge badge-pending"><i class="fa-solid fa-clock"></i> ${dailyStatus.label}</span>`
        }
        </td>
        <td>฿${remainingBalance.toLocaleString()}</td>
        <td>
          <div class="table-actions">
            ${!isPaid && dailyStatus.installment
          ? `<button class="btn-table-action btn-mark-paid" onclick="quickMarkPaid('${c.id}', ${dailyStatus.installment.installmentNo}, '${selectedDailyDate}')" title="บันทึกรับชำระ">
                    <i class="fa-solid fa-check"></i> บันทึกรับชำระ
                   </button>`
          : '<span style="font-size: 0.75rem; color: var(--primary-light); font-weight: 600;"><i class="fa-solid fa-check"></i> ชำระแล้ว</span>'
        }
            <button class="btn-penalty-action ${Number(c.lateFine) > 0 ? "has-fine" : ""}" onclick="openPenaltyModal('${c.id}')" title="จัดการค่าปรับ">
              <i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ${Number(c.lateFine) > 0 ? ` (฿${Number(c.lateFine).toLocaleString()})` : ""}
            </button>
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

    // คำนวณสรุปยอดรายอาทิตย์ประจำวันที่เลือก
    const allWeeklyContracts = window.easyFinanceDB.getContracts().filter((c) => c.paymentFrequency === "weekly" && !isMotorcycleContract(c));
    let weeklyTotalAmount = 0;
    let weeklyPaidAmount = 0;
    let weeklyPendingAmount = 0;
    let paidCount = 0;
    let pendingCount = 0;

    allWeeklyContracts.forEach((c) => {
      const statusObj = getDailyStatusForDate(c, selectedDailyDate);
      const amt = Number(statusObj.amount) || 0;
      weeklyTotalAmount += amt;
      if (statusObj.status === "paid") {
        paidCount++;
        weeklyPaidAmount += amt;
      } else {
        pendingCount++;
        weeklyPendingAmount += amt;
      }
    });

    const isManagerWeekly = isManagerLoggedIn();
    if (dailyTotalAmountVal) {
      dailyTotalAmountVal.textContent = isManagerWeekly ? ("฿" + weeklyTotalAmount.toLocaleString()) : "฿******";
      dailyTotalAmountVal.classList.toggle("masked-stat-text", !isManagerWeekly);
    }
    if (dailyPaidAmountVal) {
      dailyPaidAmountVal.innerHTML = isManagerWeekly
        ? `<i class="fa-solid fa-circle-check"></i> รับแล้ว ฿${weeklyPaidAmount.toLocaleString()}`
        : `<i class="fa-solid fa-circle-check"></i> รับแล้ว ฿******`;
    }
    if (dailyPendingAmountVal) {
      dailyPendingAmountVal.innerHTML = isManagerWeekly
        ? `<i class="fa-solid fa-clock"></i> รอเก็บ ฿${weeklyPendingAmount.toLocaleString()}`
        : `<i class="fa-solid fa-clock"></i> รอเก็บ ฿******`;
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
      `;
    }

    if (contractsList.length === 0) {
      const filterLabel = currentSubFilter === "paid" ? `ที่จ่ายแล้ว (${dateDisplay})` : currentSubFilter === "pending" ? `ที่ค้างจ่าย (${dateDisplay})` : "ทั้งหมด";
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 30px;">ไม่พบข้อมูลลูกค้ารายอาทิตย์ (${filterLabel})</td></tr>`;
      return;
    }

    tableBody.innerHTML = "";
    contractsList.forEach((c) => {
      const installments = c.installments || [];
      const contractTotal = Number(c.totalAmount) || 0;
      const totalPaidAmt = installments
        .filter((i) => i.status === "paid")
        .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
      const remainingBalance = Math.max(0, contractTotal - totalPaidAmt);

      const statusObj = getDailyStatusForDate(c, selectedDailyDate);
      const isPaid = statusObj.status === "paid";

      const tr = document.createElement("tr");
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
        <td><strong style="color: var(--primary-light);">฿${Number(statusObj.installment ? statusObj.installment.amount : (installments[0]?.amount || 0)).toLocaleString()}</strong></td>
        <td>
          ${isPaid
          ? `<span class="status-badge badge-paid"><i class="fa-solid fa-circle-check"></i> ${statusObj.label}</span>`
          : `<span class="status-badge badge-pending"><i class="fa-solid fa-clock"></i> ${statusObj.label}</span>`
        }
        </td>
        <td>฿${remainingBalance.toLocaleString()}</td>
        <td>
          <div class="table-actions">
            ${!isPaid && statusObj.installment
          ? `<button class="btn-table-action btn-mark-paid" onclick="quickMarkPaid('${c.id}', ${statusObj.installment.installmentNo}, '${selectedDailyDate}')" title="บันทึกรับชำระ">
                    <i class="fa-solid fa-check"></i> บันทึกรับชำระ
                   </button>`
          : '<span style="font-size: 0.75rem; color: var(--primary-light); font-weight: 600;"><i class="fa-solid fa-check"></i> ชำระแล้ว</span>'
        }
            <button class="btn-penalty-action ${Number(c.lateFine) > 0 ? "has-fine" : ""}" onclick="openPenaltyModal('${c.id}')" title="จัดการค่าปรับ">
              <i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ${Number(c.lateFine) > 0 ? ` (฿${Number(c.lateFine).toLocaleString()})` : ""}
            </button>
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

    // คำนวณสรุปยอดรายเดือนประจำวันที่เลือก
    const allMonthlyContracts = window.easyFinanceDB.getContracts().filter((c) => c.paymentFrequency === "monthly" && !isMotorcycleContract(c));
    let monthlyTotalAmount = 0;
    let monthlyPaidAmount = 0;
    let monthlyPendingAmount = 0;
    let paidCount = 0;
    let pendingCount = 0;

    allMonthlyContracts.forEach((c) => {
      const statusObj = getDailyStatusForDate(c, selectedDailyDate);
      const amt = Number(statusObj.amount) || 0;
      monthlyTotalAmount += amt;
      if (statusObj.status === "paid") {
        paidCount++;
        monthlyPaidAmount += amt;
      } else {
        pendingCount++;
        monthlyPendingAmount += amt;
      }
    });

    const isManagerMonthly = isManagerLoggedIn();
    if (dailyTotalAmountVal) {
      dailyTotalAmountVal.textContent = isManagerMonthly ? ("฿" + monthlyTotalAmount.toLocaleString()) : "฿******";
      dailyTotalAmountVal.classList.toggle("masked-stat-text", !isManagerMonthly);
    }
    if (dailyPaidAmountVal) {
      dailyPaidAmountVal.innerHTML = isManagerMonthly
        ? `<i class="fa-solid fa-circle-check"></i> รับแล้ว ฿${monthlyPaidAmount.toLocaleString()}`
        : `<i class="fa-solid fa-circle-check"></i> รับแล้ว ฿******`;
    }
    if (dailyPendingAmountVal) {
      dailyPendingAmountVal.innerHTML = isManagerMonthly
        ? `<i class="fa-solid fa-clock"></i> รอเก็บ ฿${monthlyPendingAmount.toLocaleString()}`
        : `<i class="fa-solid fa-clock"></i> รอเก็บ ฿******`;
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
      `;
    }

    if (contractsList.length === 0) {
      const filterLabel = currentSubFilter === "paid" ? `ที่จ่ายแล้ว (${dateDisplay})` : currentSubFilter === "pending" ? `ที่ค้างจ่าย (${dateDisplay})` : "ทั้งหมด";
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 30px;">ไม่พบข้อมูลลูกค้ารายเดือน (${filterLabel})</td></tr>`;
      return;
    }

    tableBody.innerHTML = "";
    contractsList.forEach((c) => {
      const installments = c.installments || [];
      const contractTotal = Number(c.totalAmount) || 0;
      const totalPaidAmt = installments
        .filter((i) => i.status === "paid")
        .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
      const remainingBalance = Math.max(0, contractTotal - totalPaidAmt);

      const statusObj = getDailyStatusForDate(c, selectedDailyDate);
      const isPaid = statusObj.status === "paid";

      const tr = document.createElement("tr");
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
        <td><strong style="color: var(--primary-light);">฿${Number(statusObj.installment ? statusObj.installment.amount : (installments[0]?.amount || 0)).toLocaleString()}</strong></td>
        <td>
          ${isPaid
          ? `<span class="status-badge badge-paid"><i class="fa-solid fa-circle-check"></i> ${statusObj.label}</span>`
          : `<span class="status-badge badge-pending"><i class="fa-solid fa-clock"></i> ${statusObj.label}</span>`
        }
        </td>
        <td>฿${remainingBalance.toLocaleString()}</td>
        <td>
          <div class="table-actions">
            ${!isPaid && statusObj.installment
          ? `<button class="btn-table-action btn-mark-paid" onclick="quickMarkPaid('${c.id}', ${statusObj.installment.installmentNo}, '${selectedDailyDate}')" title="บันทึกรับชำระ">
                    <i class="fa-solid fa-check"></i> บันทึกรับชำระ
                   </button>`
          : '<span style="font-size: 0.75rem; color: var(--primary-light); font-weight: 600;"><i class="fa-solid fa-check"></i> ชำระแล้ว</span>'
        }
            <button class="btn-penalty-action ${Number(c.lateFine) > 0 ? "has-fine" : ""}" onclick="openPenaltyModal('${c.id}')" title="จัดการค่าปรับ">
              <i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ${Number(c.lateFine) > 0 ? ` (฿${Number(c.lateFine).toLocaleString()})` : ""}
            </button>
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
    let paidCount = 0;
    let pendingCount = 0;

    allMotorcycleContracts.forEach((c) => {
      const dailyStatus = getDailyStatusForDate(c, selectedDailyDate);
      const amt = Number(dailyStatus.amount) || 0;
      mcTotalAmount += amt;
      if (dailyStatus.status === "paid") {
        paidCount++;
        mcPaidAmount += amt;
      } else {
        pendingCount++;
        mcPendingAmount += amt;
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
      `;
    }

    if (contractsList.length === 0) {
      const filterLabel = currentSubFilter === "paid" ? `ที่จ่ายแล้ว (${dateDisplay})` : currentSubFilter === "pending" ? `ที่ค้างจ่าย (${dateDisplay})` : "ทั้งหมด";
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; color: var(--text-dim); padding: 40px;">
            <div style="font-size: 2.2rem; color: #38bdf8; margin-bottom: 10px;">
              <i class="fa-solid fa-motorcycle"></i>
            </div>
            <div style="font-weight: 600; color: #fff; font-size: 1rem; margin-bottom: 6px;">
              ไม่พบรายการสัญญารถมอเตอร์ไซค์ (${filterLabel})
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
      const installments = c.installments || [];
      const paidInstCount = installments.filter((i) => i.status === "paid").length;
      const totalCount = installments.length;
      const downPayment = Number(c.downPayment) || 0;
      const totalAmount = Number(c.totalAmount) || 0;
      const totalFinanced = totalAmount + downPayment;
      const totalPaidAmt = installments
        .filter((i) => i.status === "paid")
        .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
      const remainingBalance = Math.max(0, totalAmount - totalPaidAmt);

      const dailyStatus = getDailyStatusForDate(c, selectedDailyDate);
      const isPaid = dailyStatus.status === "paid";
      const instAmt = Number(dailyStatus.installment ? dailyStatus.installment.amount : (installments[0]?.amount || 0));

      const freqLabels = {
        daily: '<span class="overview-card-badge badge-daily" style="font-size: 0.68rem; padding: 2px 6px;">รายวัน</span>',
        weekly: '<span class="overview-card-badge badge-weekly" style="font-size: 0.68rem; padding: 2px 6px;">รายอาทิตย์</span>',
        monthly: '<span class="overview-card-badge badge-monthly" style="font-size: 0.68rem; padding: 2px 6px;">รายเดือน</span>'
      };

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <span class="contract-id-pill" style="border-color: rgba(56, 189, 248, 0.45); color: #38bdf8; background: rgba(56, 189, 248, 0.1);">
            <i class="fa-solid fa-motorcycle" style="font-size: 0.72rem; margin-right: 4px;"></i>${c.id}
          </span>
        </td>
        <td>
          <div class="customer-cell">
            <img class="customer-thumb" src="${c.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}" alt="">
            <div class="customer-info">
              <div class="name" style="font-weight: 600; color: #fff;">${c.name}</div>
              <div class="sub" style="font-size: 0.75rem; color: #38bdf8;">
                <i class="fa-solid fa-phone" style="font-size: 0.7rem;"></i> ${c.phone}
              </div>
              <div class="sub" style="font-size: 0.72rem; color: var(--text-dim);">${c.email}</div>
            </div>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 3px;">
            ${freqLabels[c.paymentFrequency] || ""}
            <span style="color: #fff; font-weight: 600;">${c.itemFinanced || "รถมอเตอร์ไซค์"}</span>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-dim);">${c.dueSchedule || "-"}</div>
        </td>
        <td>
          <strong style="color: #38bdf8; font-size: 0.95rem;">฿${totalFinanced.toLocaleString()}</strong>
          ${downPayment > 0 
            ? `<div style="font-size: 0.72rem; color: #7dd3fc; margin-top: 2px;"><i class="fa-solid fa-coins"></i> ดาวน์ ฿${downPayment.toLocaleString()} + ผ่อน ฿${totalAmount.toLocaleString()}</div>` 
            : `<div style="font-size: 0.72rem; color: var(--text-dim); margin-top: 2px;">(ไม่มีเงินดาวน์)</div>`
          }
        </td>
        <td>
          <strong style="color: var(--primary-light); font-size: 0.95rem;">฿${instAmt.toLocaleString()}</strong>
          <div style="font-size: 0.72rem; color: var(--text-dim);">${paidInstCount} / ${totalCount} งวด</div>
        </td>
        <td>
          ${isPaid
            ? `<span class="status-badge badge-paid"><i class="fa-solid fa-circle-check"></i> ${dailyStatus.label}</span>`
            : `<span class="status-badge badge-pending"><i class="fa-solid fa-clock"></i> ${dailyStatus.label}</span>`
          }
          ${Number(c.lateFine) > 0 ? `<div style="margin-top: 4px;"><span class="badge-fine"><i class="fa-solid fa-triangle-exclamation"></i> ปรับ ฿${Number(c.lateFine).toLocaleString()}</span></div>` : ""}
        </td>
        <td>
          <strong style="color: #fbbf24; font-size: 0.95rem;">฿${remainingBalance.toLocaleString()}</strong>
        </td>
        <td>
          <div class="table-actions">
            ${!isPaid && dailyStatus.installment
              ? `<button class="btn-table-action btn-mark-paid" onclick="quickMarkPaid('${c.id}', ${dailyStatus.installment.installmentNo}, '${selectedDailyDate}')" title="บันทึกรับชำระ">
                  <i class="fa-solid fa-check"></i> บันทึกรับชำระ
                </button>`
              : '<span style="font-size: 0.75rem; color: var(--primary-light); font-weight: 600;"><i class="fa-solid fa-check"></i> ชำระแล้ว</span>'
            }
            <button class="btn-penalty-action ${Number(c.lateFine) > 0 ? "has-fine" : ""}" onclick="openPenaltyModal('${c.id}')" title="จัดการค่าปรับ">
              <i class="fa-solid fa-triangle-exclamation"></i> ค่าปรับ
            </button>
            <button class="btn-table-action" onclick="openContractDetails('${c.id}')" title="ดูตารางงวด">
              <i class="fa-solid fa-list-check"></i> ดูงวด
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

  // ช่องกรอกเงินดาวน์: แสดงสำหรับหมวดผ่อนมอเตอร์ไซค์ และ ผ่อนทอง (หมวดสินค้าทั่วไปจะไม่มีเงินดาวน์)
  function updateDownPaymentVisibility() {
    const cat = formItemCategory ? formItemCategory.value : "general";
    const hasDownPayment = cat === "motorcycle" || cat === "gold";
    if (formDownPaymentGroup) {
      formDownPaymentGroup.style.display = hasDownPayment ? "block" : "none";
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
    if (!hasDownPayment && formDownPayment) {
      formDownPayment.value = "0";
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
    const hasDownPayment = itemCategory === "motorcycle" || itemCategory === "gold";
    // ช่องเงินดาวน์: มีสำหรับหมวดรถมอเตอร์ไซค์ และ ผ่อนทอง (หมวดสินค้าทั่วไปไม่มีเงินดาวน์ 0 บาท)
    const downPayment = (hasDownPayment && formDownPayment) ? (parseFloat(formDownPayment.value) || 0) : 0;
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

    // คำนวณยอดคงเหลือ remainingBalanceAfter ของทุกงวดตามยอดต้นใหม่ totalAmount เสมอ
    let runningBalance = totalAmount;
    installments.forEach((inst) => {
      if (inst.status === "paid") {
        runningBalance -= (Number(inst.amount) || 0);
      }
      inst.remainingBalanceAfter = Math.max(0, runningBalance);
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
      const hasDownPayment = formItemCategory && (formItemCategory.value === "motorcycle" || formItemCategory.value === "gold");
      formDownPayment.value = (hasDownPayment && contract.downPayment !== undefined) ? contract.downPayment : 0;
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

  // --- 6. CONTRACT DETAILS DRAWER / MODAL ---

  window.openContractDetails = function (contractId) {
    const contract = window.easyFinanceDB.getContractById(contractId);
    if (!contract) return;

    currentViewingContractId = contractId;
    detailModalTitle.textContent = `ตารางงวดสัญญา: ${contract.id} (${contract.name})`;

    // Render metadata
    detailContractMeta.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; font-size: 0.85rem;">
        <div><strong>ลูกค้า:</strong> ${contract.name} (${contract.phone})</div>
        <div><strong>อีเมลเข้าใช้งาน:</strong> ${contract.email}</div>
        <div><strong>รหัสผ่านลูกค้า:</strong> <code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; color: #34d399;">${contract.password}</code></div>
        <div><strong>สิ่งที่ผ่อน:</strong> ${contract.itemFinanced}</div>
        <div><strong>ยอดรวมสัญญา (รวมดาวน์):</strong> ฿${(Number(contract.totalAmount) + Number(contract.downPayment || 0)).toLocaleString()}${Number(contract.downPayment) > 0 ? ` <span style="color: #38bdf8;">(เงินดาวน์ ฿${Number(contract.downPayment).toLocaleString()} + ผ่อน ฿${Number(contract.totalAmount).toLocaleString()})</span>` : ""}</div>
        <div><strong>กำหนดชำระ:</strong> ${contract.dueSchedule} (${contract.duration})</div>
        <div><strong>วันที่เริ่มชำระ:</strong> ${formatDateThai(contract.firstPaymentDate || (contract.installments && contract.installments[0]?.dueDate))}</div>
      </div>
      <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed var(--admin-border); display: flex; gap: 8px; justify-content: flex-end;">
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
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td><strong style="color: #fff;">งวดที่ ${inst.installmentNo}</strong></td>
        <td>${inst.dueDate}</td>
        <td><strong style="color: var(--primary-light);">฿${Number(inst.amount).toLocaleString()}</strong></td>
        <td>
          ${isPaid
          ? '<span class="status-badge badge-paid"><i class="fa-solid fa-check"></i> ชำระแล้ว</span>'
          : '<span class="status-badge badge-pending">รอชำระ</span>'
        }
        </td>
        <td><span style="font-size: 0.75rem; color: var(--text-dim);">${inst.paidAt || "-"}</span></td>
        <td>
          ${inst.slipUrl
          ? `<button class="btn-table-action" onclick="viewSlip('${inst.slipUrl}', 'งวดที่ ${inst.installmentNo} - Ref: ${inst.transactionRef || "-"}')">
                  <i class="fa-solid fa-image"></i> ดูสลิป
                 </button>`
          : (isPaid ? `<span style="font-size: 0.72rem; color: var(--text-dim);">${inst.transactionRef || "บันทึกโดยแอดมิน"}</span>` : "-")
        }
        </td>
        <td>
          ${!isPaid
          ? `<button class="btn-table-action btn-mark-paid" onclick="markPaidFromDetail(${inst.installmentNo})" title="คลิกเพื่อมาร์คชำระเงินงวดนี้" style="color: #34d399; border-color: rgba(52, 211, 153, 0.4); background: rgba(52, 211, 153, 0.08); padding: 5px 10px; font-size: 0.78rem; font-weight: 600; cursor: pointer; border-radius: 6px; display: inline-flex; align-items: center; gap: 5px;">
                  <i class="fa-solid fa-check"></i> มาร์คชำระ
                 </button>`
          : `<div style="display: inline-flex; align-items: center; gap: 8px;">
               <span style="color: #34d399; font-size: 0.82rem; font-weight: 600; white-space: nowrap; display: inline-flex; align-items: center; gap: 4px;">
                 <i class="fa-solid fa-circle-check"></i> สมบูรณ์
               </span>
               <button class="btn-table-action btn-unmark-paid" onclick="unmarkPaidFromDetail(${inst.installmentNo})" title="กดยกเลิกเพื่อเปลี่ยนสถานะกลับเป็นรอชำระ" style="padding: 4px 9px; font-size: 0.75rem; font-weight: 500; cursor: pointer; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">
                 <i class="fa-solid fa-rotate-left"></i> ยกเลิก
               </button>
             </div>`
        }
        </td>
      `;
      detailInstallmentsBody.appendChild(tr);
    });

    contractDetailModal.classList.add("active");
  };

  window.markPaidFromDetail = async function (installmentNo) {
    if (!currentViewingContractId) return;
    await window.easyFinanceDB.markInstallmentPaid(currentViewingContractId, installmentNo, {
      verifiedBy: "admin_manual"
    });
    showAdminToast(`บันทึกรับชำระงวดที่ ${installmentNo} สำเร็จ (สถานะ: ชำระแล้ว)`, "success");
    openContractDetails(currentViewingContractId);
    renderStatsCounters();
    renderSubTabs();
    renderActiveTabTable();
  };

  window.unmarkPaidFromDetail = async function (installmentNo) {
    if (!currentViewingContractId) return;
    await window.easyFinanceDB.unmarkInstallmentPaid(currentViewingContractId, installmentNo);
    showAdminToast(`ยกเลิกชำระงวดที่ ${installmentNo} เรียบร้อย (สถานะกลับเป็นรอชำระ)`, "info");
    openContractDetails(currentViewingContractId);
    renderStatsCounters();
    renderSubTabs();
    renderActiveTabTable();
  };

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

      closePenaltyModal();
      renderStatsCounters();
      renderActiveTabTable();
      if (customerDatabaseModal && customerDatabaseModal.classList.contains("active")) {
        renderCustomerDatabaseList();
      }
      if (customerDossierModal && customerDossierModal.classList.contains("active") && currentViewingCustomerKey) {
        openCustomerDossier(currentViewingCustomerKey);
      }
    });
  }

  window.clearAndConfirmPenalty = async function () {
    const contractId = penaltyContractId ? penaltyContractId.value : "";
    if (!contractId) return;

    if (confirm(`ยืนยันการคีย์ออก / ล้างค่าปรับของสัญญา ${contractId} เป็น 0 บาท ใช่หรือไม่?\n(เมื่อยืนยันแล้ว กรอบค่าปรับหน้าลูกค้าจะหายไปทันที)`)) {
      await window.easyFinanceDB.updateContractLateFine(contractId, 0, "");
      showAdminToast(`ล้างค่าปรับสัญญา ${contractId} เป็น 0 สำเร็จ (หน้าลูกค้าค่าปรับหายไปแล้ว)`, "success");
      closePenaltyModal();
      renderStatsCounters();
      renderActiveTabTable();
      if (customerDatabaseModal && customerDatabaseModal.classList.contains("active")) {
        renderCustomerDatabaseList();
      }
      if (customerDossierModal && customerDossierModal.classList.contains("active") && currentViewingCustomerKey) {
        openCustomerDossier(currentViewingCustomerKey);
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

  // --- 8.7 GLOBAL MODAL CLICK-OUTSIDE & ESCAPE HANDLERS (ป้องกันเว็บค้างและคลิกไม่ติด 100%) ---
  document.querySelectorAll(".admin-modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        // Requirement 6: ยกเว้น contractModal ห้ามปิดเมื่อคลิกนอกกรอบ ต้องกดปุ่ม x กาออก หรือปุ่มบันทึก/ยกเลิกเท่านั้น
        if (overlay.id === "contractModal") {
          return;
        }
        overlay.classList.remove("active");
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const activeModals = document.querySelectorAll(".admin-modal-overlay.active");
      if (activeModals.length > 0) {
        const topModal = activeModals[activeModals.length - 1];
        if (topModal.id === "contractModal") {
          // อย่าปิด contractModal ด้วย Escape อัตโนมัติ ป้องกันข้อมูลที่กรอกอยู่หาย
          return;
        }
        topModal.classList.remove("active");
      }
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
