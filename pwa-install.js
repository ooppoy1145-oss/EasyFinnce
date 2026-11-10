/**
 * ============================================================================
 * Easy Wealth Finance - PWA Installation & Standalone App Manager (pwa-install.js)
 * Supports:
 * - 1-Click Native Install on Android Chrome / Edge / Desktop Chrome
 * - Visual Step-by-Step Guide for iOS (iPhone / iPad Safari) & LINE In-App Browser
 * - Separate App Identities for Customer Portal (index.html) & Admin Portal (admin.html)
 * ============================================================================
 */

(function () {
  'use strict';

  let deferredInstallPrompt = null;

  const isAdminPage = window.location.pathname.toLowerCase().includes('admin');
  const appTitle = isAdminPage ? 'EasyFinance Admin' : 'Easy Wealth Finance';
  const appSubTitle = isAdminPage
    ? 'แอปจัดการหลังบ้านสำหรับหัวหน้าและพนักงาน (Full-Screen App)'
    : 'แอปติดตามสัญญาและชำระค่างวดออนไลน์ (Full-Screen App)';

  // Detect environment
  function isStandaloneMode() {
    return (
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      window.navigator.standalone === true
    );
  }

  function isIOSDevice() {
    const ua = window.navigator.userAgent || '';
    const iOS = /iPad|iPhone|iPod/.test(ua);
    const iPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    return iOS || iPadOS;
  }

  function isInAppBrowser() {
    const ua = window.navigator.userAgent || '';
    return /Line\/|FBAN|FBAV|Instagram|Messenger/i.test(ua);
  }

  // 1. Register Service Worker
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker
          .register('./sw.js')
          .then(function () {
            // Service Worker registered
          })
          .catch(function (err) {
            console.warn('[PWA] Service Worker registration skipped:', err);
          });
      });
    }
  }

  // 2. Inject Scoped Styles for Install Buttons & Modal
  function injectPwaStyles() {
    if (document.getElementById('ef-pwa-styles')) return;
    const style = document.createElement('style');
    style.id = 'ef-pwa-styles';
    style.textContent = `
      /* Hide install buttons when already running inside installed standalone app */
      @media all and (display-mode: standalone) {
        [data-pwa-install], .pwa-install-banner-wrap {
          display: none !important;
        }
      }

      /* Navbar & Login Install Buttons */
      .btn-pwa-install-nav {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        height: 36px;
        padding: 0 13px;
        border-radius: 999px;
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(5, 150, 105, 0.28) 100%);
        border: 1px solid rgba(16, 185, 129, 0.45);
        color: #34d399;
        font-family: 'Prompt', sans-serif;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
        box-shadow: 0 2px 10px rgba(16, 185, 129, 0.12);
      }
      .btn-pwa-install-nav:hover {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: #ffffff;
        border-color: #10b981;
        transform: translateY(-1px);
        box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
      }
      html[data-theme="light"] .btn-pwa-install-nav {
        background: rgba(16, 185, 129, 0.1);
        color: #059669;
        border-color: rgba(16, 185, 129, 0.35);
      }
      html[data-theme="light"] .btn-pwa-install-nav:hover {
        background: #10b981;
        color: #ffffff;
      }

      /* Customer Portal Install Card / Button */
      .btn-pwa-install-card {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 11px 16px;
        margin-top: 12px;
        border-radius: 12px;
        background: rgba(16, 185, 129, 0.12);
        border: 1px dashed rgba(16, 185, 129, 0.45);
        color: #34d399;
        font-family: 'Prompt', sans-serif;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .btn-pwa-install-card:hover {
        background: rgba(16, 185, 129, 0.22);
        border-style: solid;
        color: #ecfdf5;
      }

      .btn-pwa-header-chip {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 6px 11px;
        border-radius: 999px;
        background: rgba(16, 185, 129, 0.16);
        border: 1px solid rgba(16, 185, 129, 0.4);
        color: #34d399;
        font-family: 'Prompt', sans-serif;
        font-size: 0.74rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .btn-pwa-header-chip:hover {
        background: #10b981;
        color: #fff;
      }

      /* Install Guide Modal Overlay */
      .ef-pwa-modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: rgba(2, 6, 23, 0.82);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 16px;
        font-family: 'Prompt', sans-serif;
      }
      .ef-pwa-modal-overlay.active {
        display: flex;
        animation: efPwaFadeIn 0.2s ease-out;
      }
      @keyframes efPwaFadeIn {
        from { opacity: 0; transform: scale(0.96); }
        to { opacity: 1; transform: scale(1); }
      }
      .ef-pwa-modal-card {
        width: 100%;
        max-width: 440px;
        background: linear-gradient(180deg, #0f172a 0%, #0b1120 100%);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 20px;
        padding: 22px 20px;
        color: #f8fafc;
        box-shadow: 0 24px 50px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(16, 185, 129, 0.18);
        position: relative;
        max-height: 90vh;
        overflow-y: auto;
      }
      .ef-pwa-close-btn {
        position: absolute;
        top: 14px;
        right: 14px;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #94a3b8;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.18s ease;
      }
      .ef-pwa-close-btn:hover {
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
        border-color: rgba(239, 68, 68, 0.35);
      }
      .ef-pwa-app-hero {
        display: flex;
        align-items: center;
        gap: 14px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        margin-bottom: 16px;
      }
      .ef-pwa-app-icon {
        width: 60px;
        height: 60px;
        border-radius: 15px;
        background: #0b1120;
        border: 2px solid rgba(212, 175, 55, 0.45);
        padding: 4px;
        object-fit: contain;
        flex-shrink: 0;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
      }
      .ef-pwa-app-title {
        font-size: 1.05rem;
        font-weight: 700;
        color: #f8fafc;
        margin: 0 0 3px 0;
        line-height: 1.3;
      }
      .ef-pwa-app-sub {
        font-size: 0.77rem;
        color: #94a3b8;
        margin: 0;
        line-height: 1.35;
      }
      .ef-pwa-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        margin-top: 6px;
        padding: 2px 9px;
        border-radius: 999px;
        font-size: 0.68rem;
        font-weight: 600;
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.3);
      }
      .ef-pwa-os-tabs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        background: rgba(15, 23, 42, 0.9);
        padding: 5px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.07);
        margin-bottom: 14px;
      }
      .ef-pwa-os-tab {
        padding: 8px 10px;
        border-radius: 9px;
        border: none;
        background: transparent;
        color: #94a3b8;
        font-family: 'Prompt', sans-serif;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: all 0.18s ease;
      }
      .ef-pwa-os-tab.active {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: #ffffff;
        box-shadow: 0 3px 10px rgba(16, 185, 129, 0.28);
      }
      .ef-pwa-step-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .ef-pwa-step-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        background: rgba(30, 41, 59, 0.55);
        border: 1px solid rgba(255, 255, 255, 0.07);
        border-radius: 13px;
        padding: 12px 13px;
      }
      .ef-pwa-step-num {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: rgba(16, 185, 129, 0.2);
        border: 1px solid rgba(16, 185, 129, 0.45);
        color: #34d399;
        font-size: 0.8rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-top: 1px;
      }
      .ef-pwa-step-body {
        font-size: 0.82rem;
        color: #e2e8f0;
        line-height: 1.45;
      }
      .ef-pwa-step-body strong {
        color: #34d399;
        font-weight: 600;
      }
      .ef-pwa-inline-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 2px 7px;
        border-radius: 6px;
        background: rgba(56, 189, 248, 0.16);
        border: 1px solid rgba(56, 189, 248, 0.35);
        color: #38bdf8;
        font-size: 0.78rem;
        margin: 0 2px;
      }
      .ef-pwa-inapp-alert {
        background: rgba(245, 158, 11, 0.14);
        border: 1px solid rgba(245, 158, 11, 0.4);
        border-radius: 12px;
        padding: 10px 12px;
        margin-bottom: 14px;
        font-size: 0.78rem;
        color: #fde68a;
        display: flex;
        align-items: flex-start;
        gap: 9px;
        line-height: 1.45;
      }
      .ef-pwa-direct-btn {
        width: 100%;
        padding: 12px 16px;
        border-radius: 12px;
        border: none;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: #ffffff;
        font-family: 'Prompt', sans-serif;
        font-size: 0.92rem;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-bottom: 12px;
        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);
      }
      .ef-pwa-done-btn {
        width: 100%;
        margin-top: 16px;
        padding: 10px 14px;
        border-radius: 11px;
        border: 1px solid rgba(255, 255, 255, 0.14);
        background: rgba(255, 255, 255, 0.06);
        color: #cbd5e1;
        font-family: 'Prompt', sans-serif;
        font-size: 0.84rem;
        font-weight: 600;
        cursor: pointer;
      }
      .ef-pwa-done-btn:hover {
        background: rgba(255, 255, 255, 0.12);
        color: #ffffff;
      }

      @media (max-width: 768px) {
        .btn-pwa-install-nav .pwa-nav-text {
          display: none;
        }
        .btn-pwa-install-nav {
          padding: 0 10px;
          height: 34px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // 3. Build & Show the Install Guide Modal
  function ensureInstallModal() {
    let modal = document.getElementById('pwaInstallGuideModal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'pwaInstallGuideModal';
    modal.className = 'ef-pwa-modal-overlay';

    const defaultIOS = isIOSDevice();
    const inAppWarningHtml = isInAppBrowser()
      ? `<div class="ef-pwa-inapp-alert">
           <i class="fa-solid fa-triangle-exclamation" style="color: #fbbf24; font-size: 1rem; margin-top: 2px;"></i>
           <div>ขณะนี้คุณเปิดผ่านแอป LINE / Facebook กรุณากดปุ่มมุมขวาบน/ล่าง แล้วเลือก <strong>"เปิดในเบราว์เซอร์เริ่มต้น (Safari หรือ Chrome)"</strong> ก่อนติดตั้งแอป</div>
         </div>`
      : '';

    modal.innerHTML = `
      <div class="ef-pwa-modal-card" role="dialog" aria-modal="true" aria-label="ติดตั้งแอปลงมือถือ">
        <button type="button" class="ef-pwa-close-btn" id="btnClosePwaModal" aria-label="ปิดหน้าต่าง">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="ef-pwa-app-hero">
          <img src="images/logo.png" alt="${appTitle}" class="ef-pwa-app-icon">
          <div>
            <h3 class="ef-pwa-app-title">${appTitle}</h3>
            <p class="ef-pwa-app-sub">${appSubTitle}</p>
            <span class="ef-pwa-badge">
              <i class="fa-solid fa-mobile-screen-button"></i> ติดตั้งเป็นแอปเต็มจอบนมือถือ
            </span>
          </div>
        </div>

        ${inAppWarningHtml}

        <button type="button" id="btnModalNativeInstallNow" class="ef-pwa-direct-btn" style="display: none;">
          <i class="fa-solid fa-download"></i>
          <span>กดติดตั้งแอปลงเครื่องทันที (1 คลิก)</span>
        </button>

        <div class="ef-pwa-os-tabs">
          <button type="button" class="ef-pwa-os-tab ${defaultIOS ? 'active' : ''}" data-os-tab="ios">
            <i class="fa-brands fa-apple" style="font-size: 1rem;"></i>
            <span>iPhone / iPad (iOS)</span>
          </button>
          <button type="button" class="ef-pwa-os-tab ${!defaultIOS ? 'active' : ''}" data-os-tab="android">
            <i class="fa-brands fa-android" style="font-size: 1rem;"></i>
            <span>Android / Chrome</span>
          </button>
        </div>

        <!-- iOS Steps -->
        <div id="pwaStepsIOS" class="ef-pwa-step-list" style="display: ${defaultIOS ? 'flex' : 'none'};">
          <div class="ef-pwa-step-item">
            <div class="ef-pwa-step-num">1</div>
            <div class="ef-pwa-step-body">
              เปิดหน้านี้ด้วย <strong>Safari</strong> แล้วแตะปุ่ม <strong>แชร์ (Share)</strong>
              <span class="ef-pwa-inline-icon"><i class="fa-solid fa-arrow-up-from-bracket"></i></span>
              ที่แถบเมนูด้านล่างของหน้าจอ
            </div>
          </div>
          <div class="ef-pwa-step-item">
            <div class="ef-pwa-step-num">2</div>
            <div class="ef-pwa-step-body">
              เลื่อนรายการลงมาแล้วแตะเลือกเมนู<br>
              <strong>"เพิ่มไปยังหน้าจอโฮม" (Add to Home Screen)</strong>
              <span class="ef-pwa-inline-icon"><i class="fa-regular fa-square-plus"></i></span>
            </div>
          </div>
          <div class="ef-pwa-step-item">
            <div class="ef-pwa-step-num">3</div>
            <div class="ef-pwa-step-body">
              แตะปุ่ม <strong>"เพิ่ม" (Add)</strong> ที่มุมขวาบน ไอคอนแอป <strong>${appTitle}</strong> จะไปปรากฏบนหน้าจอโฮมและเปิดใช้งานแบบเต็มจอได้ทันที
            </div>
          </div>
        </div>

        <!-- Android / Chrome Steps -->
        <div id="pwaStepsAndroid" class="ef-pwa-step-list" style="display: ${!defaultIOS ? 'flex' : 'none'};">
          <div class="ef-pwa-step-item">
            <div class="ef-pwa-step-num">1</div>
            <div class="ef-pwa-step-body">
              แตะที่ปุ่มเมนู <strong>จุด 3 จุด</strong>
              <span class="ef-pwa-inline-icon"><i class="fa-solid fa-ellipsis-vertical"></i></span>
              ที่มุมขวาบนของเบราว์เซอร์ <strong>Google Chrome</strong>
            </div>
          </div>
          <div class="ef-pwa-step-item">
            <div class="ef-pwa-step-num">2</div>
            <div class="ef-pwa-step-body">
              แตะเลือกเมนู <strong>"ติดตั้งแอป" (Install app)</strong> หรือ <strong>"เพิ่มลงในหน้าจอหลัก" (Add to Home screen)</strong>
              <span class="ef-pwa-inline-icon"><i class="fa-solid fa-mobile-screen"></i></span>
            </div>
          </div>
          <div class="ef-pwa-step-item">
            <div class="ef-pwa-step-num">3</div>
            <div class="ef-pwa-step-body">
              แตะปุ่มยืนยัน <strong>"ติดตั้ง" (Install)</strong> แอป <strong>${appTitle}</strong> จะถูกติดตั้งลงในมือถือพร้อมเปิดแบบเต็มจอเหมือนแอปทั่วไป
            </div>
          </div>
        </div>

        <button type="button" class="ef-pwa-done-btn" id="btnDonePwaModal">
          เข้าใจแล้ว / ปิดหน้าต่างนี้
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    // Close handlers
    const closeModal = function () {
      modal.classList.remove('active');
    };
    modal.querySelector('#btnClosePwaModal').addEventListener('click', closeModal);
    modal.querySelector('#btnDonePwaModal').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });

    // OS Tab switching
    const tabs = modal.querySelectorAll('[data-os-tab]');
    const iosPane = modal.querySelector('#pwaStepsIOS');
    const androidPane = modal.querySelector('#pwaStepsAndroid');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const target = tab.getAttribute('data-os-tab');
        tabs.forEach(function (t) {
          t.classList.toggle('active', t === tab);
        });
        if (iosPane && androidPane) {
          iosPane.style.display = target === 'ios' ? 'flex' : 'none';
          androidPane.style.display = target === 'android' ? 'flex' : 'none';
        }
      });
    });

    // Direct native install button inside modal
    const directBtn = modal.querySelector('#btnModalNativeInstallNow');
    if (directBtn) {
      directBtn.addEventListener('click', function () {
        if (deferredInstallPrompt) {
          deferredInstallPrompt.prompt();
          deferredInstallPrompt.userChoice.finally(function () {
            deferredInstallPrompt = null;
            directBtn.style.display = 'none';
            closeModal();
          });
        }
      });
    }

    return modal;
  }

  function openInstallGuideModal() {
    const modal = ensureInstallModal();
    const directBtn = modal.querySelector('#btnModalNativeInstallNow');
    if (directBtn) {
      directBtn.style.display = deferredInstallPrompt ? 'flex' : 'none';
    }
    modal.classList.add('active');
  }

  // 4. Main Trigger Function for Any Install Button
  async function triggerPwaInstall(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    // If native beforeinstallprompt is available (Android / Chrome / Edge), trigger 1-click install immediately
    if (deferredInstallPrompt) {
      try {
        deferredInstallPrompt.prompt();
        const choiceResult = await deferredInstallPrompt.userChoice;
        deferredInstallPrompt = null;
        if (choiceResult && choiceResult.outcome === 'accepted') {
          updateInstallButtonsVisibility();
        }
        return;
      } catch (err) {
        // Fallback to guide modal if prompt fails
      }
    }

    // Otherwise open the visual iOS / Android installation guide modal
    openInstallGuideModal();
  }

  // Expose globally
  window.triggerPwaInstall = triggerPwaInstall;
  window.openPwaInstallGuideModal = openInstallGuideModal;

  // 5. Update Button Visibility & Bind Click Handlers
  function updateInstallButtonsVisibility() {
    const standalone = isStandaloneMode();
    const buttons = document.querySelectorAll('[data-pwa-install]');
    buttons.forEach(function (btn) {
      if (standalone) {
        btn.style.display = 'none';
      } else {
        if (!btn.dataset.pwaBound) {
          btn.dataset.pwaBound = 'true';
          btn.addEventListener('click', triggerPwaInstall);
        }
      }
    });
  }

  // Capture Chrome/Android native install prompt
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredInstallPrompt = e;
    updateInstallButtonsVisibility();
  });

  window.addEventListener('appinstalled', function () {
    deferredInstallPrompt = null;
    updateInstallButtonsVisibility();
  });

  // Initialize
  injectPwaStyles();
  registerServiceWorker();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateInstallButtonsVisibility);
  } else {
    updateInstallButtonsVisibility();
  }
})();

