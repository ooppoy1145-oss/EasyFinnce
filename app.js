/**
 * EasyFinance - Client Application Logic (app.js)
 * จัดการตรรกะหน้าบ้านลูกค้า, การคำนวณยอด, การชำระเงิน, และการตรวจสลิป
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements - Login
  const loginSection = document.getElementById("loginSection");
  const dashboardSection = document.getElementById("dashboardSection");
  const clientLoginForm = document.getElementById("clientLoginForm");
  const loginIdentifier = document.getElementById("loginIdentifier");
  const loginPassword = document.getElementById("loginPassword");
  const rememberMeCheckbox = document.getElementById("rememberMeCheckbox");
  const btnLogout = document.getElementById("btnLogout");

  // DOM Elements - Dashboard Meta
  const userAvatar = document.getElementById("userAvatar");
  const clientName = document.getElementById("clientName");
  const contractIdBadge = document.getElementById("contractIdBadge");
  const contractIdText = document.getElementById("contractIdText");
  const financedItemBadge = document.getElementById("financedItemBadge");
  const financedItemName = document.getElementById("financedItemName");
  const remainingBalanceText = document.getElementById("remainingBalanceText");
  const durationText = document.getElementById("durationText");
  const closedContractsText = document.getElementById("closedContractsText");
  const totalInstallmentsText = document.getElementById("totalInstallmentsText");
  const nextDueDateText = document.getElementById("nextDueDateText");
  const nextDueAmountText = document.getElementById("nextDueAmountText");
  const nextInstallmentNo = document.getElementById("nextInstallmentNo");
  const paymentFrequencyText = document.getElementById("paymentFrequencyText");
  const totalPaidText = document.getElementById("totalPaidText");
  const downPaymentStatItem = document.getElementById("downPaymentStatItem");
  const downPaymentText = document.getElementById("downPaymentText");

  // DOM Elements - Penalty Fee Frame (กรอบค่าปรับชำระล่าช้า)
  const penaltyFeeBox = document.getElementById("penaltyFeeBox");
  const penaltyFeeReason = document.getElementById("penaltyFeeReason");
  const penaltyFeeAmountText = document.getElementById("penaltyFeeAmountText");
  const baseDueAmountText = document.getElementById("baseDueAmountText");
  const fineDueAmountText = document.getElementById("fineDueAmountText");
  const totalDueWithFineText = document.getElementById("totalDueWithFineText");

  // DOM Elements - Progress
  const progressFractionText = document.getElementById("progressFractionText");
  const progressBarFill = document.getElementById("progressBarFill");
  const progressPaidCount = document.getElementById("progressPaidCount");
  const progressRemainingCount = document.getElementById("progressRemainingCount");

  // DOM Elements - Schedule
  const scheduleCountBadge = document.getElementById("scheduleCountBadge");
  const installmentsList = document.getElementById("installmentsList");
  const btnScrollSchedule = document.getElementById("btnScrollSchedule");

  // DOM Elements - Payment Modal
  const btnOpenPayment = document.getElementById("btnOpenPayment");
  const paymentModal = document.getElementById("paymentModal");
  const btnClosePayModal = document.getElementById("btnClosePayModal");
  const modalPayInstallmentNo = document.getElementById("modalPayInstallmentNo");
  const modalPayAmount = document.getElementById("modalPayAmount");
  const modalPayPenaltyNote = document.getElementById("modalPayPenaltyNote");
  const modalPayPenaltyVal = document.getElementById("modalPayPenaltyVal");
  const modalPayDueDate = document.getElementById("modalPayDueDate");
  const adminPaymentQrImg = document.getElementById("adminPaymentQrImg");
  const displayBankName = document.getElementById("displayBankName");
  const displayAccountNumber = document.getElementById("displayAccountNumber");
  const displayAccountName = document.getElementById("displayAccountName");
  const displayPromptPay = document.getElementById("displayPromptPay");
  const slipDropArea = document.getElementById("slipDropArea");
  const slipFileInput = document.getElementById("slipFileInput");
  const slipPreviewBox = document.getElementById("slipPreviewBox");
  const slipThumbnail = document.getElementById("slipThumbnail");
  const slipFileName = document.getElementById("slipFileName");
  const btnSubmitSlipVerify = document.getElementById("btnSubmitSlipVerify");
  const verifyStatusBanner = document.getElementById("verifyStatusBanner");
  const verifyStatusIcon = document.getElementById("verifyStatusIcon");
  const verifyStatusMsg = document.getElementById("verifyStatusMsg");

  // DOM Elements - Officer Modal
  const btnOpenOfficerModal = document.getElementById("btnOpenOfficerModal");
  const officerModal = document.getElementById("officerModal");
  const btnCloseOfficerModal = document.getElementById("btnCloseOfficerModal");
  const linkCallOfficer = document.getElementById("linkCallOfficer");
  const linkLineOfficer = document.getElementById("linkLineOfficer");
  const officerPhoneDisplay = document.getElementById("officerPhoneDisplay");
  const officerLineDisplay = document.getElementById("officerLineDisplay");

  // State
  let currentContractId = null;
  let activePayingInstallment = null;
  let selectedSlipFile = null;
  let selectedSlipBase64 = null;

  // --- 1. INITIALIZATION & SESSION ---

  function checkSession() {
    const sessionContractId = localStorage.getItem("easyfinance_current_session") ||
      sessionStorage.getItem("easyfinance_current_session");

    if (sessionContractId) {
      const contract = window.easyFinanceDB.getContractById(sessionContractId);
      if (contract) {
        currentContractId = contract.id;
        renderDashboard(contract);
        showDashboard();
        return;
      }
    }
    showLogin();
  }

  function showLogin() {
    loginSection.classList.remove("hidden");
    dashboardSection.classList.add("hidden");
  }

  function showDashboard() {
    loginSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // --- 2. AUTHENTICATION (NO DEMO / REAL ADMIN PASSWORDS ONLY) ---

  clientLoginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const identifier = loginIdentifier.value.trim();
    const password = loginPassword.value.trim();

    if (!identifier || !password) {
      showToast("กรุณากรอกข้อมูลให้ครบถ้วน", "error");
      return;
    }

    const contract = window.easyFinanceDB.getContractByEmail(identifier);

    if (!contract) {
      showToast("ไม่พบข้อมูลสัญญานี้ในระบบ กรุณาตรวจสอบอีเมลหรือรหัสสัญญา", "error");
      return;
    }

    if (contract.password !== password) {
      showToast("รหัสผ่านไม่ถูกต้อง กรุณาติดต่อพนักงานดูแลสัญญา", "error");
      return;
    }

    // Login Success
    currentContractId = contract.id;
    if (rememberMeCheckbox.checked) {
      localStorage.setItem("easyfinance_current_session", contract.id);
    } else {
      sessionStorage.setItem("easyfinance_current_session", contract.id);
    }

    showToast(`ยินดีต้อนรับคุณ ${contract.name}`, "success");
    renderDashboard(contract);
    showDashboard();
  });

  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("easyfinance_current_session");
    sessionStorage.removeItem("easyfinance_current_session");
    currentContractId = null;
    loginIdentifier.value = "";
    loginPassword.value = "";
    showToast("ออกจากระบบเรียบร้อยแล้ว", "success");
    showLogin();
  });

  // --- 3. DASHBOARD RENDERING ---

  function renderDashboard(contract) {
    if (!contract) return;

    // Header & Meta
    clientName.textContent = contract.name;
    contractIdText.textContent = contract.id;
    if (contract.avatar) {
      userAvatar.src = contract.avatar;
    }
    financedItemName.textContent = contract.itemFinanced || "สินเชื่อทั่วไป";

    // Installment Calculations
    const installments = contract.installments || [];
    const totalInstallments = installments.length;
    const paidInstallments = installments.filter((i) => i.status === "paid");
    const pendingInstallments = installments.filter((i) => i.status !== "paid");

    const totalPaid = paidInstallments.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
    const totalRemaining = pendingInstallments.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

    remainingBalanceText.textContent = totalRemaining.toLocaleString();
    totalPaidText.textContent = `฿${totalPaid.toLocaleString()}`;
    durationText.textContent = contract.duration || `${totalInstallments} งวด`;
    closedContractsText.textContent = `${contract.closedContractsCount || 0} ครั้ง`;
    totalInstallmentsText.textContent = `${totalInstallments} งวด`;

    // 5. แสดงเงินดาวน์ หากสัญญาเป็นหมวดผ่อนมอเตอร์ไซค์ / ผ่อนทอง และมีเงินดาวน์
    if (downPaymentStatItem && downPaymentText) {
      const downPayVal = Number(contract.downPayment) || 0;
      if (downPayVal > 0) {
        downPaymentStatItem.style.display = "block";
        downPaymentText.textContent = `฿${downPayVal.toLocaleString()}`;
      } else {
        downPaymentStatItem.style.display = "none";
      }
    }

    // Frequency Label
    const freqMap = {
      daily: "รายวัน",
      weekly: "รายสัปดาห์",
      monthly: "รายเดือน"
    };
    paymentFrequencyText.textContent = freqMap[contract.paymentFrequency] || contract.dueSchedule || "ตามกำหนด";

    // 3. จัดการค่าปรับชำระล่าช้า (Late Fee)
    const lateFine = Math.max(0, Number(contract.lateFine) || 0);
    const lateFineReason = contract.lateFineReason || "เกินกำหนดชำระค่างวด";

    // Next Due Installment
    if (pendingInstallments.length > 0) {
      const nextInst = pendingInstallments[0];
      activePayingInstallment = nextInst;
      nextInstallmentNo.textContent = nextInst.installmentNo;
      nextDueDateText.textContent = formatThaiDate(nextInst.dueDate);

      const baseAmount = Number(nextInst.amount) || 0;
      const totalAmountWithFine = baseAmount + lateFine;

      // แสดงยอดรวมค่าปรับอัตโนมัติหากมีค่าปรับ
      nextDueAmountText.textContent = `฿${totalAmountWithFine.toLocaleString()}`;
      btnOpenPayment.disabled = false;

      if (lateFine > 0) {
        btnOpenPayment.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color: #fb923c;"></i><span>ชำระงวดที่ ${nextInst.installmentNo} (฿${totalAmountWithFine.toLocaleString()} รวมค่าปรับ)</span>`;
      } else {
        btnOpenPayment.innerHTML = `<i class="fa-solid fa-qrcode"></i><span>ชำระเงินงวดที่ ${nextInst.installmentNo} (฿${baseAmount.toLocaleString()})</span>`;
      }

      // แสดง/ซ่อน กรอบเล็กๆ ค่าปรับชำระล่าช้า (Penalty Fee Frame)
      if (penaltyFeeBox) {
        if (lateFine > 0) {
          penaltyFeeBox.style.display = "block";
          if (penaltyFeeReason) penaltyFeeReason.textContent = lateFineReason;
          if (penaltyFeeAmountText) penaltyFeeAmountText.textContent = `+฿${lateFine.toLocaleString()}`;
          if (baseDueAmountText) baseDueAmountText.textContent = `฿${baseAmount.toLocaleString()}`;
          if (fineDueAmountText) fineDueAmountText.textContent = `฿${lateFine.toLocaleString()}`;
          if (totalDueWithFineText) totalDueWithFineText.textContent = `฿${totalAmountWithFine.toLocaleString()}`;
        } else {
          penaltyFeeBox.style.display = "none";
        }
      }
    } else {
      activePayingInstallment = null;
      nextInstallmentNo.textContent = "-";
      nextDueDateText.textContent = "ครบกำหนดทุกงวดแล้ว";
      nextDueAmountText.textContent = "฿0";
      btnOpenPayment.disabled = true;
      btnOpenPayment.innerHTML = `<i class="fa-solid fa-circle-check"></i><span>ปิดสัญญาสมบูรณ์แล้ว (ชำระครบถ้วน)</span>`;
      if (penaltyFeeBox) {
        penaltyFeeBox.style.display = "none";
      }
    }

    // Progress Bar
    const progressPercent = totalInstallments > 0
      ? Math.round((paidInstallments.length / totalInstallments) * 100)
      : 0;
    progressBarFill.style.width = `${progressPercent}%`;
    progressFractionText.textContent = `${paidInstallments.length} / ${totalInstallments} งวด (${progressPercent}%)`;
    progressPaidCount.textContent = paidInstallments.length;
    progressRemainingCount.textContent = pendingInstallments.length;

    // Render Installment Schedule List
    renderInstallmentsList(installments, contract);
  }

  function renderInstallmentsList(installments, contract) {
    scheduleCountBadge.textContent = `ทั้งหมด ${installments.length} งวด`;
    installmentsList.innerHTML = "";

    installments.forEach((inst) => {
      const isPaid = inst.status === "paid";
      const itemEl = document.createElement("div");
      itemEl.className = `installment-item ${isPaid ? "is-paid" : ""}`;

      itemEl.innerHTML = `
        <div class="inst-left">
          <div class="inst-no-badge">
            ${isPaid ? '<i class="fa-solid fa-check"></i>' : inst.installmentNo}
          </div>
          <div>
            <div class="inst-info-title">งวดที่ ${inst.installmentNo}</div>
            <div class="inst-info-date">กำหนด: ${formatThaiDate(inst.dueDate)}</div>
            ${
              isPaid
                ? `<div class="inst-info-paid-date"><i class="fa-solid fa-circle-check"></i> ชำระเมื่อ: ${inst.paidAt || "สมบูรณ์"}</div>`
                : ""
            }
          </div>
        </div>
        <div class="inst-right">
          <div class="inst-amount">฿${Number(inst.amount).toLocaleString()}</div>
          <div class="inst-remaining">คงเหลือ: ฿${Number(inst.remainingBalanceAfter || 0).toLocaleString()}</div>
          <div class="inst-status-tag ${isPaid ? "status-paid-tag" : "status-pending-tag"}" style="${!isPaid ? "background: rgba(16, 185, 129, 0.18); color: var(--primary-light); border: 1px solid var(--border-emerald); cursor: pointer;" : ""}">
            ${
              isPaid
                ? '<i class="fa-solid fa-shield-check"></i> ชำระแล้ว (สมบูรณ์)'
                : '<i class="fa-solid fa-qrcode"></i> ชำระงวดนี้'
            }
          </div>
        </div>
      `;

      // หากเป็นงวดที่ยังไม่จ่าย คลิกเพื่อเปิดชำระเงินได้
      if (!isPaid) {
        itemEl.style.cursor = "pointer";
        itemEl.title = `คลิกเพื่อชำระงวดที่ ${inst.installmentNo}`;
        itemEl.addEventListener("click", () => {
          openPaymentModalForInstallment(inst);
        });
      }

      installmentsList.appendChild(itemEl);
    });
  }

  // --- 4. PAYMENT MODAL & DYNAMIC QR FROM ADMIN ---

  function getActiveOrNextInstallment() {
    if (activePayingInstallment) return activePayingInstallment;
    if (currentContractId) {
      const contract = window.easyFinanceDB.getContractById(currentContractId);
      if (contract && contract.installments && contract.installments.length > 0) {
        const pending = contract.installments.find((i) => i.status !== "paid");
        return pending || contract.installments[0];
      }
    }
    // Fallback if not set
    const contracts = window.easyFinanceDB.getContracts();
    if (contracts.length > 0) {
      const first = contracts[0];
      return first.installments?.find((i) => i.status !== "paid") || first.installments?.[0];
    }
    return null;
  }

  function openPaymentModalForInstallment(installment) {
    if (!installment) {
      installment = getActiveOrNextInstallment();
    }
    if (!installment) {
      showToast("กรุณาเลือกงวดที่ต้องการชำระเงิน", "error");
      return;
    }
    activePayingInstallment = installment;

    // โหลดการตั้งค่า QR และบัญชีจากระบบ (Firebase / Admin Settings)
    const settings = window.easyFinanceDB.getPaymentSettings();

    // ตรวจสอบค่าปรับของสัญญาปัจจุบันเพื่อรวมเข้ากับยอดชำระ
    const currentContract = currentContractId ? window.easyFinanceDB.getContractById(currentContractId) : null;
    const contractFine = currentContract ? Math.max(0, Number(currentContract.lateFine) || 0) : 0;
    const baseAmt = Number(installment.amount) || 0;
    const finalAmountToPay = baseAmt + contractFine;

    if (modalPayInstallmentNo) modalPayInstallmentNo.textContent = installment.installmentNo;
    if (modalPayAmount) modalPayAmount.textContent = `฿${finalAmountToPay.toLocaleString()}`;
    if (modalPayDueDate) modalPayDueDate.textContent = formatThaiDate(installment.dueDate);

    // แสดงรายละเอียดค่าปรับใน Modal
    if (modalPayPenaltyNote && modalPayPenaltyVal) {
      if (contractFine > 0) {
        modalPayPenaltyNote.style.display = "block";
        modalPayPenaltyVal.textContent = contractFine.toLocaleString();
      } else {
        modalPayPenaltyNote.style.display = "none";
      }
    }

    // รูป QR Code ที่แอดมินอัปโหลดไว้
    if (adminPaymentQrImg) {
      if (settings && settings.qrImageUrl) {
        adminPaymentQrImg.src = settings.qrImageUrl;
      }
    }

    if (displayBankName) displayBankName.textContent = settings.bankName || "ธนาคารกสิกรไทย (KBANK)";
    if (displayAccountNumber) displayAccountNumber.textContent = settings.accountNumber || "089-2-88899-0";
    if (displayAccountName) displayAccountName.textContent = settings.accountName || "บจก. อีซี่ไฟแนนซ์ โซลูชั่นส์";
    if (displayPromptPay) displayPromptPay.textContent = settings.promptPayNumber || "0891234567";

    // รีเซ็ตฟอร์มสลิป
    resetSlipForm();

    if (paymentModal) {
      paymentModal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  // Expose to window for inline onclick handlers
  window.openPaymentModalForInstallment = openPaymentModalForInstallment;

  window.openPaymentNow = function () {
    const inst = getActiveOrNextInstallment();
    if (inst) {
      openPaymentModalForInstallment(inst);
    } else {
      showToast("สัญญานี้ไม่มีงวดที่ต้องชำระ หรือปิดสัญญาสมบูรณ์แล้ว", "info");
    }
  };

  window.closePaymentModal = function () {
    if (paymentModal) {
      paymentModal.classList.remove("active");
    }
    document.body.style.overflow = ""; // คืนค่าการเลื่อนหน้าจอเสมอ ป้องกันหน้าจอค้าง
    resetSlipForm();
  };

  btnOpenPayment.addEventListener("click", (e) => {
    e.preventDefault();
    window.openPaymentNow();
  });

  btnClosePayModal.addEventListener("click", () => {
    window.closePaymentModal();
  });

  paymentModal.addEventListener("click", (e) => {
    if (e.target === paymentModal) {
      window.closePaymentModal();
    }
  });

  // --- 5. SLIP UPLOAD & DRAG/DROP ---

  function resetSlipForm() {
    selectedSlipFile = null;
    selectedSlipBase64 = null;
    slipFileInput.value = "";
    slipPreviewBox.classList.remove("active");
    slipThumbnail.src = "";
    slipFileName.textContent = "";
    btnSubmitSlipVerify.disabled = true;
    verifyStatusBanner.className = "verify-status-banner";
  }

  slipDropArea.addEventListener("click", () => {
    slipFileInput.click();
  });

  slipFileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      handleSlipSelected(e.target.files[0]);
    }
  });

  slipDropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    slipDropArea.classList.add("dragover");
  });

  slipDropArea.addEventListener("dragleave", () => {
    slipDropArea.classList.remove("dragover");
  });

  slipDropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    slipDropArea.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSlipSelected(e.dataTransfer.files[0]);
    }
  });

  // Helper: ย่อขนาดรูปภาพสลิปอัตโนมัติก่อนบันทึก ป้องกัน LocalStorage เกินโควตา (5MB) และ Firestore Limit (1MB)
  function compressImage(file, maxDimension = 500, quality = 0.6) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      const timeout = setTimeout(() => resolve(null), 3000); // ป้องกันค้าง
      reader.onerror = () => {
        clearTimeout(timeout);
        resolve(null);
      };
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = () => {
          clearTimeout(timeout);
          resolve(e.target.result);
        };
        img.onload = () => {
          clearTimeout(timeout);
          let width = img.width;
          let height = img.height;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", quality);
          resolve(compressed);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function handleSlipSelected(file) {
    if (!file.type.startsWith("image/")) {
      showToast("กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG)", "error");
      return;
    }

    selectedSlipFile = file;
    slipFileName.textContent = `${file.name} (กำลังประมวลผลรูป...)`;
    btnSubmitSlipVerify.disabled = true;

    try {
      const compressed = await compressImage(file);
      selectedSlipBase64 = compressed || "";
      slipThumbnail.src = selectedSlipBase64;
      slipPreviewBox.classList.add("active");
      slipFileName.textContent = file.name;
      btnSubmitSlipVerify.disabled = false;
    } catch (err) {
      console.error("Image processing error:", err);
      showToast("ไม่สามารถประมวลผลรูปภาพนี้ได้ กรุณาลองใหม่อีกครั้ง", "error");
    }
  }

  // --- 6. SUBMIT SLIP VERIFY (CONNECT BANK API) ---

  btnSubmitSlipVerify.addEventListener("click", async () => {
    if (!activePayingInstallment || !selectedSlipBase64) {
      showToast("กรุณาแนบรูปภาพสลิปการโอนเงิน", "error");
      return;
    }

    btnSubmitSlipVerify.disabled = true;
    btnSubmitSlipVerify.innerHTML = `<div class="spinner"></div> <span>กำลังส่งตรวจสลิปกับระบบธนาคาร...</span>`;

    verifyStatusBanner.className = "verify-status-banner loading show";
    verifyStatusIcon.className = "fa-solid fa-spinner fa-spin";
    verifyStatusMsg.textContent = "กำลังเชื่อมต่อ Bank Verification API และตรวจสอบยอดเงิน...";

    // ป้องกันหน้าเว็บค้างสูงสุด 8 วินาที
    const safetyTimer = setTimeout(() => {
      btnSubmitSlipVerify.disabled = false;
      btnSubmitSlipVerify.innerHTML = `<i class="fa-solid fa-shield-check"></i><span>ส่งตรวจสลิปและยืนยันการชำระเงิน</span>`;
      document.body.style.overflow = "";
    }, 8000);

    try {
      const result = await window.bankVerificationService.verifySlip({
        slipImage: selectedSlipBase64,
        expectedAmount: Number(activePayingInstallment.amount),
        contractId: currentContractId,
        installmentNo: activePayingInstallment.installmentNo
      });

      if (result.success) {
        verifyStatusBanner.className = "verify-status-banner success show";
        verifyStatusIcon.className = "fa-solid fa-circle-check";
        verifyStatusMsg.textContent = `${result.message} (Ref: ${result.transRef || "สมบูรณ์"})`;

        // บันทึกตัดงวดใน Cloud Database / Firestore
        await window.easyFinanceDB.markInstallmentPaid(
          currentContractId,
          activePayingInstallment.installmentNo,
          {
            slipUrl: selectedSlipBase64,
            transRef: result.transRef,
            verifiedBy: "bank_api"
          }
        );

        showToast(`บันทึกชำระงวดที่ ${activePayingInstallment.installmentNo} เรียบร้อยแล้ว!`, "success");

        // อัปเดตข้อมูลบนหน้าจอลูกค้าทันที
        const updatedContract = window.easyFinanceDB.getContractById(currentContractId);
        if (updatedContract) {
          renderDashboard(updatedContract);
        }

        setTimeout(() => {
          clearTimeout(safetyTimer);
          window.closePaymentModal();
          btnSubmitSlipVerify.disabled = false;
          btnSubmitSlipVerify.innerHTML = `<i class="fa-solid fa-shield-check"></i><span>ส่งตรวจสลิปและยืนยันการชำระเงิน</span>`;

          const finalContract = window.easyFinanceDB.getContractById(currentContractId);
          if (finalContract) {
            renderDashboard(finalContract);
          }
        }, 1200);
      } else {
        clearTimeout(safetyTimer);
        verifyStatusBanner.className = "verify-status-banner error show";
        verifyStatusIcon.className = "fa-solid fa-triangle-exclamation";
        verifyStatusMsg.textContent = result.error || "ไม่สามารถยืนยันสลิปนี้ได้";
        btnSubmitSlipVerify.disabled = false;
        btnSubmitSlipVerify.innerHTML = `<i class="fa-solid fa-shield-check"></i><span>ลองใหม่อีกครั้ง</span>`;
      }
    } catch (err) {
      clearTimeout(safetyTimer);
      console.error("Payment submission error:", err);
      verifyStatusBanner.className = "verify-status-banner error show";
      verifyStatusIcon.className = "fa-solid fa-triangle-exclamation";
      verifyStatusMsg.textContent = "เกิดข้อผิดพลาดในการตรวจสอบ: " + (err.message || err);
      btnSubmitSlipVerify.disabled = false;
      btnSubmitSlipVerify.innerHTML = `<i class="fa-solid fa-shield-check"></i><span>ลองใหม่อีกครั้ง</span>`;
      document.body.style.overflow = "";
    }
  });

  // --- 7. OFFICER CONTACT MODAL ---

  window.openOfficerModal = function () {
    const settings = window.easyFinanceDB.getPaymentSettings();
    const phone = settings.officerPhone || "089-123-4567";
    const lineId = settings.officerLine || "@easyfinance";

    if (officerPhoneDisplay) officerPhoneDisplay.textContent = phone;
    if (officerLineDisplay) officerLineDisplay.textContent = lineId;
    if (linkCallOfficer) linkCallOfficer.href = `tel:${phone.replace(/\D/g, "")}`;
    if (linkLineOfficer) {
      linkLineOfficer.href = lineId.startsWith("http")
        ? lineId
        : `https://line.me/ti/p/~${lineId.replace("@", "")}`;
    }

    if (officerModal) {
      officerModal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  };

  window.closeOfficerModal = function () {
    if (officerModal) {
      officerModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  btnOpenOfficerModal.addEventListener("click", () => {
    window.openOfficerModal();
  });

  btnCloseOfficerModal.addEventListener("click", () => {
    window.closeOfficerModal();
  });

  officerModal.addEventListener("click", (e) => {
    if (e.target === officerModal) {
      window.closeOfficerModal();
    }
  });

  btnScrollSchedule.addEventListener("click", () => {
    document.getElementById("scheduleSection").scrollIntoView({ behavior: "smooth" });
  });

  // --- 8. REALTIME CLOUD LISTENER ---

  window.easyFinanceDB.subscribe(() => {
    if (currentContractId) {
      const updated = window.easyFinanceDB.getContractById(currentContractId);
      if (updated) {
        renderDashboard(updated);
      }
    }
  });

  // --- 9. HELPERS ---

  function formatThaiDate(dateInput) {
    if (!dateInput) return "-";
    const dateString = String(dateInput);
    if (dateString.includes("งวดสัปดาห์")) return dateString;

    try {
      const parts = dateString.split("-");
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        const thaiMonths = [
          "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
          "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
        ];
        return `${day} ${thaiMonths[month - 1]} ${year + 543}`;
      }
    } catch (e) {
      return dateString;
    }
    return dateString;
  }

  function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
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

  // One-Click Copy Function
  window.copyText = function (elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const text = el.innerText.trim();
    navigator.clipboard.writeText(text).then(() => {
      showToast(`คัดลอก "${text}" เรียบร้อยแล้ว`, "success");
    }).catch(() => {
      showToast("ไม่สามารถคัดลอกได้", "error");
    });
  };

  // Real-time Database Subscription: ซิงค์หน้าจอทันทีเมื่อแอดมินแก้ไขข้อมูล / อนุมัติ / บันทึกค่าปรับ / คีย์ค่าปรับออก
  if (window.easyFinanceDB && typeof window.easyFinanceDB.subscribe === "function") {
    window.easyFinanceDB.subscribe(() => {
      if (currentContractId) {
        const updatedContract = window.easyFinanceDB.getContractById(currentContractId);
        if (updatedContract) {
          renderDashboard(updatedContract);
        }
      }
    });
  }

  // Run on start
  checkSession();
});
