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
  const activeTabTitle = document.getElementById("activeTabTitle");
  const sidebarItems = document.querySelectorAll(".sidebar-item[data-tab]");
  const tabBtns = document.querySelectorAll(".tab-btn");
  const cloudStatusBadge = document.getElementById("cloudStatusBadge");
  const cloudStatusText = document.getElementById("cloudStatusText");

  // DOM Elements - Stats
  const statTotalFinanced = document.getElementById("statTotalFinanced");
  const statTotalCollected = document.getElementById("statTotalCollected");
  const statTotalOutstanding = document.getElementById("statTotalOutstanding");
  const statContractsCount = document.getElementById("statContractsCount");

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
  const pillDailyBtn = document.getElementById("pillDailyBtn");
  const pillWeeklyBtn = document.getElementById("pillWeeklyBtn");
  const pillMonthlyBtn = document.getElementById("pillMonthlyBtn");
  const summaryQuickPills = document.getElementById("summaryQuickPills");
  const dataTableCard = document.getElementById("dataTableCard");

  // DOM Elements - Date Filter Bar (Requirement 2)
  const adminDateFilter = document.getElementById("adminDateFilter");
  const dateFilterBar = document.getElementById("dateFilterBar");
  const dateFilterLabelText = document.getElementById("dateFilterLabelText");
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
  const contractForm = document.getElementById("contractForm");
  const contractModalTitle = document.getElementById("contractModalTitle");
  const formContractId = document.getElementById("formContractId");
  const formEmail = document.getElementById("formEmail");
  const formPassword = document.getElementById("formPassword");
  const formName = document.getElementById("formName");
  const formPhone = document.getElementById("formPhone");
  const formAvatar = document.getElementById("formAvatar");
  const formItemFinanced = document.getElementById("formItemFinanced");
  const formTotalAmount = document.getElementById("formTotalAmount");
  const formTotalInstallments = document.getElementById("formTotalInstallments");
  const formInstallmentAmount = document.getElementById("formInstallmentAmount");
  const formCalculationPreview = document.getElementById("formCalculationPreview");
  const formPaymentFrequency = document.getElementById("formPaymentFrequency");
  const formDueSchedule = document.getElementById("formDueSchedule");
  const formDuration = document.getElementById("formDuration");
  const formClosedContractsCount = document.getElementById("formClosedContractsCount");

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

  // State
  let currentTab = "daily"; // 'overview' | 'daily' | 'weekly' | 'monthly' | 'all'
  let currentSubFilter = "all"; // 'all' | 'paid' | 'pending'
  let selectedDailyDate = new Date().toISOString().slice(0, 10); // วันที่เลือกสำหรับสรุปยอดรายวัน (YYYY-MM-DD)
  let currentViewingContractId = null;
  let tempUploadedQrBase64 = null;

  // --- 1. AUTHENTICATION (DEFAULT: admin1234) ---

  function checkAdminAuth() {
    const isAuth = sessionStorage.getItem("easyfinance_admin_auth") === "true";
    if (isAuth) {
      adminLoginOverlay.style.display = "none";
      initAdminDashboard();
    } else {
      adminLoginOverlay.style.display = "flex";
    }
  }

  adminAuthForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const pass = adminSecretPass.value.trim();
    const savedAdminPass = localStorage.getItem("easyfinance_admin_password") || "admin1234";

    if (pass === savedAdminPass || pass === "admin1234") {
      sessionStorage.setItem("easyfinance_admin_auth", "true");
      adminLoginOverlay.style.display = "none";
      showAdminToast("เข้าสู่ระบบแอดมินสำเร็จ", "success");
      initAdminDashboard();
    } else {
      showAdminToast("รหัสผ่านไม่ถูกต้อง (Default: admin1234)", "error");
    }
  });

  btnAdminLogout.addEventListener("click", () => {
    sessionStorage.removeItem("easyfinance_admin_auth");
    adminLoginOverlay.style.display = "flex";
    adminSecretPass.value = "";
    showAdminToast("ออกจากระบบหลังบ้านแล้ว", "success");
  });

  // --- 2. INITIALIZE DASHBOARD & TABS ---

  function initAdminDashboard() {
    updateCloudStatus();
    renderStatsCounters();
    renderSubTabs();
    renderActiveTabTable();
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

  // Sidebar mobile toggle
  btnSidebarToggle.addEventListener("click", () => {
    adminSidebar.classList.toggle("open");
  });

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

  // --- HELPER: GENERAL CUSTOMER STATUS (paid vs pending for weekly/monthly) ---
  function getCustomerPaymentStatus(contract, freq) {
    const installments = contract.installments || [];
    if (installments.length === 0) return "pending";

    const pendingInsts = installments.filter((i) => i.status !== "paid");
    const paidInsts = installments.filter((i) => i.status === "paid");
    const isFullyPaid = pendingInsts.length === 0;

    // หากผ่อนครบทุกงวดแล้ว ถือว่าสถานะคือจ่ายแล้ว
    if (isFullyPaid) return "paid";

    const todayStr = new Date().toISOString().slice(0, 10);
    const currentMonthStr = todayStr.slice(0, 7);

    if (freq === "daily") {
      return getDailyStatusForDate(contract, selectedDailyDate).status;
    }

    if (freq === "weekly") {
      // รายอาทิตย์: ตรวจสอบว่าจ่ายในรอบสัปดาห์นี้หรือ 7 วันล่าสุดหรือไม่
      if (paidInsts.length > 0) {
        const lastPaid = paidInsts[paidInsts.length - 1];
        if (lastPaid && lastPaid.paidAt) {
          if (lastPaid.paidAt.includes(todayStr)) return "paid";
          const lastPaidDate = new Date(lastPaid.paidAt);
          if (!isNaN(lastPaidDate.getTime())) {
            const diffDays = (new Date().getTime() - lastPaidDate.getTime()) / (1000 * 3600 * 24);
            if (diffDays >= 0 && diffDays <= 7) return "paid";
          }
        }
      }
      return "pending";
    }

    if (freq === "monthly") {
      // รายเดือน: ตรวจสอบว่างวดของเดือนนี้จ่ายแล้วหรือยัง
      const paidThisMonth = paidInsts.some((i) => {
        if (!i.paidAt) return false;
        return i.paidAt.includes(currentMonthStr);
      });
      return paidThisMonth ? "paid" : "pending";
    }

    // กรณีสัญญาทั้งหมด (all)
    return isFullyPaid ? "paid" : "pending";
  }

  // --- HELPER: CATEGORY STATS ---
  function getCategoryStats(freq) {
    const contracts = window.easyFinanceDB.getContracts();
    const list = contracts.filter((c) => c.paymentFrequency === freq);

    let totalFinanced = 0;
    let totalCollected = 0;
    let totalOutstanding = 0;

    list.forEach((c) => {
      const installments = c.installments || [];
      installments.forEach((inst) => {
        const amt = Number(inst.amount) || 0;
        totalFinanced += amt;
        if (inst.status === "paid") {
          totalCollected += amt;
        } else {
          totalOutstanding += amt;
        }
      });
    });

    const paidCustomersCount = list.filter((c) => {
      if (freq === "daily") {
        return getDailyStatusForDate(c, selectedDailyDate).status === "paid";
      }
      return getCustomerPaymentStatus(c, freq) === "paid";
    }).length;

    const pendingCustomersCount = list.filter((c) => {
      if (freq === "daily") {
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

  // Tab switching handler
  function switchTab(tabName) {
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

    const titles = {
      overview: "สรุปแดชบอร์ดภาพรวมการเงิน (Overview Dashboard)",
      daily: "สรุปการเก็บเงินรายวัน (Daily Tracker)",
      weekly: "สรุปการเก็บเงินรายอาทิตย์ (Weekly Tracker)",
      monthly: "สรุปการเก็บเงินรายเดือน (Monthly Tracker)",
      all: "จัดการสัญญาทั้งหมด (Contracts Management)"
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

    renderSubTabs();
    renderActiveTabTable();

    // Close sidebar on mobile
    if (window.innerWidth <= 900) {
      adminSidebar.classList.remove("open");
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
    });
  });

  // Action Bar Overview Button listener
  if (btnOpenDashboardOverview) {
    btnOpenDashboardOverview.addEventListener("click", () => {
      switchTab("overview");
    });
  }

  // Date Filter Bar Event Listeners (Requirement 2: กรองเลือกวันที่สำหรับสรุปยอดรายวัน)
  if (adminDateFilter) {
    adminDateFilter.value = selectedDailyDate;
    adminDateFilter.addEventListener("change", (e) => {
      selectedDailyDate = e.target.value || new Date().toISOString().slice(0, 10);
      updateDailyDateButtons();
      renderStatsCounters();
      renderSubTabs();
      renderActiveTabTable();
    });
  }

  if (btnDateToday) {
    btnDateToday.addEventListener("click", () => {
      selectedDailyDate = new Date().toISOString().slice(0, 10);
      if (adminDateFilter) adminDateFilter.value = selectedDailyDate;
      updateDailyDateButtons();
      renderStatsCounters();
      renderSubTabs();
      renderActiveTabTable();
    });
  }

  if (btnDatePrev) {
    btnDatePrev.addEventListener("click", () => {
      const d = new Date(selectedDailyDate);
      d.setDate(d.getDate() - 1);
      selectedDailyDate = d.toISOString().slice(0, 10);
      if (adminDateFilter) adminDateFilter.value = selectedDailyDate;
      updateDailyDateButtons();
      renderStatsCounters();
      renderSubTabs();
      renderActiveTabTable();
    });
  }

  if (btnDateNext) {
    btnDateNext.addEventListener("click", () => {
      const d = new Date(selectedDailyDate);
      d.setDate(d.getDate() + 1);
      selectedDailyDate = d.toISOString().slice(0, 10);
      if (adminDateFilter) adminDateFilter.value = selectedDailyDate;
      updateDailyDateButtons();
      renderStatsCounters();
      renderSubTabs();
      renderActiveTabTable();
    });
  }

  function updateDailyDateButtons() {
    const todayStr = new Date().toISOString().slice(0, 10);
    if (btnDateToday) {
      btnDateToday.classList.toggle("active", selectedDailyDate === todayStr);
    }
  }

  adminSearchInput.addEventListener("input", () => {
    renderActiveTabTable();
  });

  // --- 3. STATS COUNTERS & QUICK PILLS ---

  function renderStatsCounters() {
    const contracts = window.easyFinanceDB.getContracts();
    let totalFinanced = 0;
    let totalCollected = 0;
    let totalOutstanding = 0;

    contracts.forEach((c) => {
      const installments = c.installments || [];
      installments.forEach((inst) => {
        const amt = Number(inst.amount) || 0;
        totalFinanced += amt;
        if (inst.status === "paid") {
          totalCollected += amt;
        } else {
          totalOutstanding += amt;
        }
      });
    });

    statTotalFinanced.textContent = `฿${totalFinanced.toLocaleString()}`;
    statTotalCollected.textContent = `฿${totalCollected.toLocaleString()}`;
    statTotalOutstanding.textContent = `฿${totalOutstanding.toLocaleString()}`;
    statContractsCount.textContent = contracts.length;

    // Update 3.1 Quick Summary Category Pills (ยอดรวมรายวัน / รายอาทิตย์ / รายเดือน)
    const dailyStats = getCategoryStats("daily");
    const weeklyStats = getCategoryStats("weekly");
    const monthlyStats = getCategoryStats("monthly");

    if (quickPillDaily) quickPillDaily.textContent = `฿${dailyStats.totalFinanced.toLocaleString()}`;
    if (quickPillWeekly) quickPillWeekly.textContent = `฿${weeklyStats.totalFinanced.toLocaleString()}`;
    if (quickPillMonthly) quickPillMonthly.textContent = `฿${monthlyStats.totalFinanced.toLocaleString()}`;
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

    if (currentTab === "daily") {
      const dateDisplay = formatDateThai(selectedDailyDate);
      adminSubTabNav.innerHTML = `
        <button class="tab-btn ${currentSubFilter === "all" ? "active" : ""}" onclick="setSubFilter('all')">
          <i class="fa-solid fa-users"></i>
          <span>ลูกค้าทั้งหมดของรายวัน</span>
          <span class="tab-count-badge">${dailyStats.contractsCount}</span>
        </button>
        <button class="tab-btn ${currentSubFilter === "paid" ? "active" : ""}" onclick="setSubFilter('paid')">
          <i class="fa-solid fa-circle-check" style="color: #34d399;"></i>
          <span>จ่ายแล้ว (${dateDisplay})</span>
          <span class="tab-count-badge">${dailyStats.paidCustomersCount}</span>
        </button>
        <button class="tab-btn ${currentSubFilter === "pending" ? "active" : ""}" onclick="setSubFilter('pending')">
          <i class="fa-solid fa-clock" style="color: #fbbf24;"></i>
          <span>ค้างจ่าย (${dateDisplay})</span>
          <span class="tab-count-badge">${dailyStats.pendingCustomersCount}</span>
        </button>
      `;
    } else if (currentTab === "weekly") {
      adminSubTabNav.innerHTML = `
        <button class="tab-btn ${currentSubFilter === "all" ? "active" : ""}" onclick="setSubFilter('all')">
          <i class="fa-solid fa-users"></i>
          <span>ลูกค้าทั้งหมดของรายอาทิตย์</span>
          <span class="tab-count-badge">${weeklyStats.contractsCount}</span>
        </button>
        <button class="tab-btn ${currentSubFilter === "paid" ? "active" : ""}" onclick="setSubFilter('paid')">
          <i class="fa-solid fa-circle-check" style="color: #60a5fa;"></i>
          <span>จ่ายแล้ว</span>
          <span class="tab-count-badge">${weeklyStats.paidCustomersCount}</span>
        </button>
        <button class="tab-btn ${currentSubFilter === "pending" ? "active" : ""}" onclick="setSubFilter('pending')">
          <i class="fa-solid fa-clock" style="color: #fbbf24;"></i>
          <span>ค้างจ่าย</span>
          <span class="tab-count-badge">${weeklyStats.pendingCustomersCount}</span>
        </button>
      `;
    } else if (currentTab === "monthly") {
      adminSubTabNav.innerHTML = `
        <button class="tab-btn ${currentSubFilter === "all" ? "active" : ""}" onclick="setSubFilter('all')">
          <i class="fa-solid fa-users"></i>
          <span>ลูกค้าทั้งหมดของรายเดือน</span>
          <span class="tab-count-badge">${monthlyStats.contractsCount}</span>
        </button>
        <button class="tab-btn ${currentSubFilter === "paid" ? "active" : ""}" onclick="setSubFilter('paid')">
          <i class="fa-solid fa-circle-check" style="color: #c084fc;"></i>
          <span>จ่ายแล้ว</span>
          <span class="tab-count-badge">${monthlyStats.paidCustomersCount}</span>
        </button>
        <button class="tab-btn ${currentSubFilter === "pending" ? "active" : ""}" onclick="setSubFilter('pending')">
          <i class="fa-solid fa-clock" style="color: #fbbf24;"></i>
          <span>ค้างจ่าย</span>
          <span class="tab-count-badge">${monthlyStats.pendingCustomersCount}</span>
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
    const contracts = window.easyFinanceDB.getContracts();
    const query = adminSearchInput.value.trim().toLowerCase();
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

    // 2. Filter by Tab Frequency
    if (currentTab === "daily") {
      filtered = filtered.filter((c) => c.paymentFrequency === "daily");
    } else if (currentTab === "weekly") {
      filtered = filtered.filter((c) => c.paymentFrequency === "weekly");
    } else if (currentTab === "monthly") {
      filtered = filtered.filter((c) => c.paymentFrequency === "monthly");
    }

    // 3. Filter by Sub-filter (Requirement 2 & 3: กรองตรงตาม Badge)
    if (currentSubFilter !== "all") {
      filtered = filtered.filter((c) => {
        if (currentTab === "all") {
          // Requirement 3: หน้าสัญญาทั้งหมด กำลังผ่อนชำระ vs ปิดสัญญาแล้ว
          const installments = c.installments || [];
          const isCompleted = installments.length > 0 && installments.every((i) => i.status === "paid");
          if (currentSubFilter === "pending") {
            return !isCompleted; // กำลังผ่อนชำระ
          } else if (currentSubFilter === "paid") {
            return isCompleted; // ปิดสัญญาแล้ว
          }
          return true;
        } else if (currentTab === "daily") {
          // Requirement 2: กรองตามวันที่เลือกใน Daily Date Filter
          return getDailyStatusForDate(c, selectedDailyDate).status === currentSubFilter;
        } else {
          const freq = c.paymentFrequency || "monthly";
          return getCustomerPaymentStatus(c, freq) === currentSubFilter;
        }
      });
    }

    // 4. Render Table by Active Tab
    if (currentTab === "daily") {
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
      updateDailyDateButtons();
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

    // อัปเดตกล่องยอดรวมรายวันของวันนั้น (เด้งสรุปขึ้นมาในวงสีแดงที่ระบุ)
    if (dailyTotalAmountVal) {
      dailyTotalAmountVal.textContent = "฿" + dailyTotalAmount.toLocaleString();
    }
    if (dailyPaidAmountVal) {
      dailyPaidAmountVal.innerHTML = `<i class="fa-solid fa-circle-check"></i> รับแล้ว ฿${dailyPaidAmount.toLocaleString()}`;
    }
    if (dailyPendingAmountVal) {
      dailyPendingAmountVal.innerHTML = `<i class="fa-solid fa-clock"></i> รอเก็บ ฿${dailyPendingAmount.toLocaleString()}`;
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
      const remainingBalance = installments
        .filter((i) => i.status !== "paid")
        .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

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
          ${
            isPaid
              ? `<span class="status-badge badge-paid"><i class="fa-solid fa-circle-check"></i> ${dailyStatus.label}</span>`
              : `<span class="status-badge badge-pending"><i class="fa-solid fa-clock"></i> ${dailyStatus.label}</span>`
          }
        </td>
        <td>฿${remainingBalance.toLocaleString()}</td>
        <td>
          <div class="table-actions">
            ${
              !isPaid && dailyStatus.installment
                ? `<button class="btn-table-action btn-mark-paid" onclick="quickMarkPaid('${c.id}', ${dailyStatus.installment.installmentNo}, '${selectedDailyDate}')">
                    <i class="fa-solid fa-check"></i> บันทึกรับชำระ
                   </button>`
                : '<span style="font-size: 0.75rem; color: var(--primary-light); font-weight: 600;"><i class="fa-solid fa-check"></i> ชำระแล้ว</span>'
            }
            <button class="btn-table-action" onclick="openContractDetails('${c.id}')">
              <i class="fa-solid fa-table-list"></i> ดูงวด
            </button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // --- 4.2 WEEKLY TABLE ---
  function renderWeeklyTable(contractsList) {
    if (dateFilterBar) dateFilterBar.style.display = "none";

    tableHeaderRow.innerHTML = `
      <th>ลูกค้า</th>
      <th>สิ่งที่ผ่อน</th>
      <th>กำหนดชำระ</th>
      <th>ค่างวด/สัปดาห์</th>
      <th>สถานะสัปดาห์นี้</th>
      <th>จัดการ</th>
    `;

    if (contractsList.length === 0) {
      const filterLabel = currentSubFilter === "paid" ? "ที่จ่ายแล้ว" : currentSubFilter === "pending" ? "ที่ค้างจ่าย" : "ทั้งหมด";
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-dim); padding: 30px;">ไม่พบข้อมูลลูกค้ารายอาทิตย์ (${filterLabel})</td></tr>`;
      return;
    }

    tableBody.innerHTML = "";
    contractsList.forEach((c) => {
      const installments = c.installments || [];
      const pendingInst = installments.find((i) => i.status !== "paid");
      const isPaidWeekly = getCustomerPaymentStatus(c, "weekly") === "paid";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div class="customer-cell">
            <img class="customer-thumb" src="${c.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"}" alt="">
            <div class="customer-info">
              <div class="name">${c.name}</div>
              <div class="sub">${c.id} | ${c.phone}</div>
            </div>
          </div>
        </td>
        <td><span style="color: #fff; font-weight: 500;">${c.itemFinanced || "-"}</span></td>
        <td><span style="color: #38bdf8; font-weight: 500;">${c.dueSchedule || "ทุกวันศุกร์"}</span></td>
        <td><strong style="color: var(--primary-light);">฿${Number(pendingInst ? pendingInst.amount : (installments[0]?.amount || 0)).toLocaleString()}</strong></td>
        <td>
          ${
            isPaidWeekly
              ? '<span class="status-badge badge-paid"><i class="fa-solid fa-circle-check"></i> จ่ายแล้ว</span>'
              : (pendingInst 
                  ? `<span class="status-badge badge-pending"><i class="fa-solid fa-clock"></i> งวดที่ ${pendingInst.installmentNo} (รอชำระ)</span>` 
                  : '<span class="status-badge badge-paid">ปิดสัญญาแล้ว</span>')
          }
        </td>
        <td>
          <div class="table-actions">
            ${
              pendingInst
                ? `<button class="btn-table-action btn-mark-paid" onclick="quickMarkPaid('${c.id}', ${pendingInst.installmentNo})">
                    <i class="fa-solid fa-check"></i> บันทึกรับชำระ
                   </button>`
                : ""
            }
            <button class="btn-table-action" onclick="openContractDetails('${c.id}')">
              <i class="fa-solid fa-table-list"></i> ดูงวด
            </button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // --- 4.3 MONTHLY TABLE ---
  function renderMonthlyTable(contractsList) {
    if (dateFilterBar) dateFilterBar.style.display = "none";

    tableHeaderRow.innerHTML = `
      <th>ลูกค้า</th>
      <th>สิ่งที่ผ่อน</th>
      <th>กำหนดชำระ</th>
      <th>ค่างวด/เดือน</th>
      <th>สถานะเดือนนี้</th>
      <th>จัดการ</th>
    `;

    if (contractsList.length === 0) {
      const filterLabel = currentSubFilter === "paid" ? "ที่จ่ายแล้วในเดือนนี้" : currentSubFilter === "pending" ? "ที่ค้างจ่ายในเดือนนี้" : "ทั้งหมด";
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-dim); padding: 30px;">ไม่พบข้อมูลลูกค้ารายเดือน (${filterLabel})</td></tr>`;
      return;
    }

    tableBody.innerHTML = "";
    contractsList.forEach((c) => {
      const installments = c.installments || [];
      const pendingInst = installments.find((i) => i.status !== "paid");
      const isPaidMonthly = getCustomerPaymentStatus(c, "monthly") === "paid";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div class="customer-cell">
            <img class="customer-thumb" src="${c.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100"}" alt="">
            <div class="customer-info">
              <div class="name">${c.name}</div>
              <div class="sub">${c.id} | ${c.phone}</div>
            </div>
          </div>
        </td>
        <td><span style="color: #fff; font-weight: 500;">${c.itemFinanced || "-"}</span></td>
        <td><span style="color: #a78bfa; font-weight: 500;">${c.dueSchedule || "ทุกวันที่ 1"}</span></td>
        <td><strong style="color: var(--primary-light);">฿${Number(pendingInst ? pendingInst.amount : (installments[0]?.amount || 0)).toLocaleString()}</strong></td>
        <td>
          ${
            isPaidMonthly
              ? '<span class="status-badge badge-paid"><i class="fa-solid fa-circle-check"></i> จ่ายแล้วเดือนนี้</span>'
              : (pendingInst 
                  ? `<span class="status-badge badge-pending"><i class="fa-solid fa-clock"></i> งวดที่ ${pendingInst.installmentNo} (${pendingInst.dueDate})</span>` 
                  : '<span class="status-badge badge-paid">ปิดสัญญาแล้ว</span>')
          }
        </td>
        <td>
          <div class="table-actions">
            ${
              pendingInst
                ? `<button class="btn-table-action btn-mark-paid" onclick="quickMarkPaid('${c.id}', ${pendingInst.installmentNo})">
                    <i class="fa-solid fa-check"></i> บันทึกรับชำระ
                   </button>`
                : ""
            }
            <button class="btn-table-action" onclick="openContractDetails('${c.id}')">
              <i class="fa-solid fa-table-list"></i> ดูงวด
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
        <td><strong style="color: #fff;">฿${Number(c.totalAmount || 0).toLocaleString()}</strong></td>
        <td>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 3px;">
            ${paidCount} / ${totalCount} งวด (${percent}%)
          </div>
          <div class="progress-track" style="height: 6px;">
            <div class="progress-bar-fill" style="width: ${percent}%;"></div>
          </div>
        </td>
        <td>
          ${
            isCompleted
              ? '<span class="status-badge badge-paid">ปิดสัญญาแล้ว</span>'
              : '<span class="status-badge badge-pending">กำลังผ่อนชำระ</span>'
          }
        </td>
        <td>
          <div class="table-actions">
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

  // --- 5. ADD / EDIT CONTRACT LOGIC ---

  // ฟังก์ชันคำนวณค่างวดต่องวดอิงจากยอดรวมและจำนวนงวด (Requirement 1: คำนวณงวดอิงจากยอดที่ตั้งให้ลูกค้า)
  function updateContractFormCalculation(source = "total") {
    const total = parseFloat(formTotalAmount.value) || 0;
    const installments = parseInt(formTotalInstallments.value, 10) || 0;
    let instAmount = parseFloat(formInstallmentAmount.value) || 0;

    if (source === "total" || source === "installments") {
      if (total > 0 && installments > 0) {
        instAmount = Math.round(total / installments);
        formInstallmentAmount.value = instAmount;
      }
    } else if (source === "installment") {
      if (instAmount > 0 && installments > 0) {
        const computedTotal = Math.round(instAmount * installments);
        formTotalAmount.value = computedTotal;
      }
    }

    const freq = formPaymentFrequency ? formPaymentFrequency.value : "monthly";
    const freqUnit = freq === "daily" ? "วัน" : freq === "weekly" ? "สัปดาห์" : "เดือน";

    if (formCalculationPreview) {
      const curTotal = parseFloat(formTotalAmount.value) || 0;
      const curInst = parseInt(formTotalInstallments.value, 10) || 0;
      const curInstAmt = parseFloat(formInstallmentAmount.value) || 0;

      if (curTotal > 0 && curInst > 0) {
        const totalCalculated = curInstAmt * curInst;
        const diff = totalCalculated - curTotal;
        let diffNote = "";
        if (diff !== 0) {
          diffNote = ` <span style="font-size:0.75rem; color:#facc15;">(รวมทุกงวด: ฿${totalCalculated.toLocaleString()})</span>`;
        }
        formCalculationPreview.innerHTML = `
          <i class="fa-solid fa-calculator" style="color: var(--primary);"></i>
          <span>ยอดรวมตั้งให้ลูกค้า <strong>฿${curTotal.toLocaleString()}</strong> ÷ <strong>${curInst} ${freqUnit} (งวด)</strong> = ค่างวด <strong>฿${curInstAmt.toLocaleString()}</strong> / ${freqUnit}${diffNote}</span>
        `;
      } else {
        formCalculationPreview.innerHTML = `
          <i class="fa-solid fa-calculator" style="color: var(--primary);"></i>
          <span>กรุณาระบุยอดรวมและจำนวนงวดเพื่อคำนวณค่างวดต่องวดอัตโนมัติ</span>
        `;
      }
    }
  }

  // Event Listeners สำหรับการคำนวณงวดแบบ Real-time
  if (formTotalAmount) {
    formTotalAmount.addEventListener("input", () => updateContractFormCalculation("total"));
  }
  if (formTotalInstallments) {
    formTotalInstallments.addEventListener("input", () => updateContractFormCalculation("installments"));
  }
  if (formInstallmentAmount) {
    formInstallmentAmount.addEventListener("input", () => updateContractFormCalculation("installment"));
  }
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
      updateContractFormCalculation("total");
    });
  }

  btnOpenAddContract.addEventListener("click", () => {
    contractForm.reset();
    formContractId.value = "";
    contractModalTitle.textContent = "เพิ่มสัญญาสินเชื่อ / ผ่อนชำระใหม่";
    formClosedContractsCount.value = "0";
    if (formInstallmentAmount) formInstallmentAmount.value = "";

    // สุ่มรหัสสัญญาใหม่
    const randNo = Math.floor(100 + Math.random() * 900);
    const newId = `EF-${new Date().getFullYear()}-${randNo}`;
    formEmail.placeholder = `customer${randNo}@easyfinance.com`;
    formPassword.value = "123456"; // Default password for new customer

    updateContractFormCalculation("display");
    contractModal.classList.add("active");
  });

  btnCloseContractModal.addEventListener("click", () => {
    contractModal.classList.remove("active");
  });

  contractForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = formContractId.value || `EF-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const email = formEmail.value.trim();
    const password = formPassword.value.trim();
    const name = formName.value.trim();
    const phone = formPhone.value.trim();
    const avatar = formAvatar.value.trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150";
    const itemFinanced = formItemFinanced.value.trim();
    const totalAmount = parseFloat(formTotalAmount.value);
    const totalInstallments = parseInt(formTotalInstallments.value, 10);
    const paymentFrequency = formPaymentFrequency.value;
    const dueSchedule = formDueSchedule.value.trim() || (
      paymentFrequency === "daily" ? "ทุกวัน" : paymentFrequency === "weekly" ? "ทุกวันศุกร์" : "ทุกวันที่ 1 ของเดือน"
    );
    const duration = formDuration.value.trim() || (
      paymentFrequency === "daily" ? `${totalInstallments} วัน` : paymentFrequency === "weekly" ? `${totalInstallments} สัปดาห์` : `${totalInstallments} เดือน`
    );
    const closedContractsCount = parseInt(formClosedContractsCount.value, 10) || 0;

    // คำนวณค่างวดต่องวด (Requirement 1: อิงจากยอดรวม หรือค่างวดที่ระบุ)
    let installmentAmount = formInstallmentAmount ? parseFloat(formInstallmentAmount.value) : 0;
    if (!installmentAmount || isNaN(installmentAmount) || installmentAmount <= 0) {
      installmentAmount = Math.round(totalAmount / totalInstallments);
    }

    // ตรวจสอบว่าเป็นสัญญาเดิมหรือสัญญาใหม่
    const existing = window.easyFinanceDB.getContractById(id);
    let installments = [];

    if (existing && existing.installments && existing.installments.length === totalInstallments) {
      // ใช้ตารางงวดเดิมเพื่อรักษาสถานะงวดที่จ่ายไปแล้ว และอัปเดตยอดค่างวดของงวดที่ค้าง
      installments = existing.installments.map((inst, idx) => {
        if (inst.status !== "paid") {
          return {
            ...inst,
            amount: installmentAmount
          };
        }
        return inst;
      });
    } else {
      // สร้างตารางงวดใหม่
      const now = new Date();
      for (let i = 1; i <= totalInstallments; i++) {
        let dueDateStr = "";
        if (paymentFrequency === "daily") {
          const d = new Date(now);
          d.setDate(now.getDate() + (i - 1));
          dueDateStr = d.toISOString().slice(0, 10);
        } else if (paymentFrequency === "weekly") {
          dueDateStr = `งวดสัปดาห์ที่ ${i}`;
        } else {
          const d = new Date(now);
          d.setMonth(now.getMonth() + i);
          dueDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
        }

        // สำหรับงวดสุดท้าย หากผลรวมคลาดเคลื่อนจากเศษ ปรับให้ตรงกับ totalAmount
        let thisInstAmount = installmentAmount;
        if (i === totalInstallments) {
          const prevTotal = installmentAmount * (totalInstallments - 1);
          if (totalAmount > prevTotal) {
            thisInstAmount = totalAmount - prevTotal;
          }
        }

        const remainingAfter = totalAmount - (installmentAmount * (i - 1) + thisInstAmount);

        installments.push({
          installmentNo: i,
          dueDate: dueDateStr,
          amount: thisInstAmount,
          status: "pending",
          paidAt: null,
          slipUrl: null,
          transactionRef: null,
          remainingBalanceAfter: remainingAfter > 0 ? remainingAfter : 0
        });
      }
    }

    const contractData = {
      id,
      email,
      password,
      name,
      phone,
      avatar,
      itemFinanced,
      totalAmount,
      totalInstallments,
      paymentFrequency,
      dueSchedule,
      duration,
      closedContractsCount,
      status: "active",
      installments
    };

    await window.easyFinanceDB.saveContract(contractData);
    contractModal.classList.remove("active");
    showAdminToast(`บันทึกสัญญา ${id} เรียบร้อยแล้ว`, "success");
    renderStatsCounters();
    renderSubTabs();
    renderActiveTabTable();
  });

  // Global Edit Contract
  window.editContract = function (id) {
    const contract = window.easyFinanceDB.getContractById(id);
    if (!contract) return;

    formContractId.value = contract.id;
    formEmail.value = contract.email || "";
    formPassword.value = contract.password || "";
    formName.value = contract.name || "";
    formPhone.value = contract.phone || "";
    formAvatar.value = contract.avatar || "";
    formItemFinanced.value = contract.itemFinanced || "";
    formTotalAmount.value = contract.totalAmount || 0;
    formTotalInstallments.value = contract.totalInstallments || 1;
    formPaymentFrequency.value = contract.paymentFrequency || "monthly";
    formDueSchedule.value = contract.dueSchedule || "";
    formDuration.value = contract.duration || "";
    formClosedContractsCount.value = contract.closedContractsCount || 0;

    // เติมค่างวดต่องวด
    const firstInstAmt = (contract.installments && contract.installments[0]?.amount) || (contract.totalAmount && contract.totalInstallments ? Math.round(contract.totalAmount / contract.totalInstallments) : 0);
    if (formInstallmentAmount) {
      formInstallmentAmount.value = firstInstAmt || "";
    }
    updateContractFormCalculation("display");

    contractModalTitle.textContent = `แก้ไขสัญญา ${contract.id}`;
    contractModal.classList.add("active");
  };

  // Global Delete Contract
  window.deleteContractConfirm = async function (id) {
    if (confirm(`คุณต้องการลบสัญญา ${id} นี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`)) {
      await window.easyFinanceDB.deleteContract(id);
      showAdminToast(`ลบสัญญา ${id} สำเร็จ`, "success");
      renderStatsCounters();
      renderSubTabs();
      renderActiveTabTable();
    }
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
        <div><strong>ยอดรวม:</strong> ฿${Number(contract.totalAmount).toLocaleString()} (${contract.duration})</div>
        <div><strong>กำหนดชำระ:</strong> ${contract.dueSchedule}</div>
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
          ${
            isPaid
              ? '<span class="status-badge badge-paid"><i class="fa-solid fa-check"></i> ชำระแล้ว</span>'
              : '<span class="status-badge badge-pending">รอชำระ</span>'
          }
        </td>
        <td><span style="font-size: 0.75rem; color: var(--text-dim);">${inst.paidAt || "-"}</span></td>
        <td>
          ${
            inst.slipUrl
              ? `<button class="btn-table-action" onclick="viewSlip('${inst.slipUrl}', 'งวดที่ ${inst.installmentNo} - Ref: ${inst.transactionRef || "-"}')">
                  <i class="fa-solid fa-image"></i> ดูสลิป
                 </button>`
              : (isPaid ? `<span style="font-size: 0.72rem; color: var(--text-dim);">${inst.transactionRef || "บันทึกโดยแอดมิน"}</span>` : "-")
          }
        </td>
        <td>
          ${
            !isPaid
              ? `<button class="btn-table-action btn-mark-paid" onclick="markPaidFromDetail(${inst.installmentNo})">
                  <i class="fa-solid fa-check"></i> มาร์คชำระ
                 </button>`
              : '<span style="color: var(--primary-light); font-size: 0.8rem;"><i class="fa-solid fa-circle-check"></i> สมบูรณ์</span>'
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
    showAdminToast(`บันทึกรับชำระงวดที่ ${installmentNo} สำเร็จ`, "success");
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

  // --- 9. REAL-TIME OBSERVER & HELPERS ---

  window.easyFinanceDB.subscribe(() => {
    renderStatsCounters();
    renderSubTabs();
    if (currentTab === "overview") renderOverviewCards();
    renderActiveTabTable();
    updateCloudStatus();
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
