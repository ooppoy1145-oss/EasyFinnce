/**
 * WIRA EASY FINANCE & RENTAL FLEET SYSTEM
 * Real-Time Cloud Synchronization Engine via Firebase
 * Supports Cloud Firestore & Realtime Database with instant multi-device sync
 */

const FirebaseSync = (function() {
  'use strict';

  // Internal state
  const state = {
    status: 'unconfigured', // 'unconfigured' | 'connecting' | 'connected' | 'error' | 'syncing' | 'offline'
    lastSyncTime: null,
    dbType: 'firestore', // 'firestore' | 'rtdb'
    collectionName: 'motorcycle_fleet',
    remoteFleetCount: 0,
    errorMessage: null,
    app: null,
    db: null,       // Firestore instance
    rtdb: null,     // Realtime Database instance
    unsubscribe: null,
    onFleetUpdated: null,
    isLocalAction: false,
    statusListeners: [],
    initialLoadDone: false
  };

  /**
   * Helper: Parse config from JSON or JavaScript snippet
   */
  function parseConfigInput(input) {
    if (!input || typeof input !== 'string') return null;
    const trimmed = input.trim();
    if (!trimmed) return null;

    // 1. Try JSON.parse directly
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === 'object') return parsed;
    } catch (e) {
      // Continue to regex parsing
    }

    // 2. Extract key-value pairs using regex (handles JS objects like: apiKey: "...", or "apiKey": '...')
    try {
      const keys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId', 'databaseURL', 'measurementId'];
      const result = {};
      let matchFound = false;

      keys.forEach(key => {
        // Regex matches key with optional quotes, colon, and quoted value
        const regex = new RegExp(`['"]?${key}['"]?\\s*:\\s*['"\`]?([^'",\`\\s\\n\\r}]+)['"\`]?`, 'i');
        const match = trimmed.match(regex);
        if (match && match[1]) {
          result[key] = match[1].trim();
          matchFound = true;
        }
      });

      if (matchFound && (result.apiKey || result.projectId)) {
        return result;
      }
    } catch (err) {
      console.warn('Config regex parsing failed:', err);
    }

    // 3. Last fallback: try evaluating as object expression safely
    try {
      const jsonLike = trimmed
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // quote unquoted keys
        .replace(/'/g, '"')                                   // replace single quotes with double quotes
        .replace(/,\s*}/g, '}')                               // remove trailing comma
        .replace(/^[^{]*/, '')                                // strip leading text
        .replace(/[^}]*$/, '');                               // strip trailing text
      const parsed = JSON.parse(jsonLike);
      if (parsed && typeof parsed === 'object') return parsed;
    } catch (e) {
      // parse failed
    }

    return null;
  }

  /**
   * Retrieve active config (localStorage takes precedence, then window.FIREBASE_CONFIG)
   */
  function getActiveConfig() {
    // 1. Check localStorage
    const saved = localStorage.getItem('honda_firebase_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.apiKey && parsed.projectId) {
          return parsed;
        }
      } catch (e) {
        console.error('Error reading saved firebase config:', e);
      }
    }

    // 2. Check window.FIREBASE_CONFIG
    if (window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.apiKey && window.FIREBASE_CONFIG.projectId) {
      return window.FIREBASE_CONFIG;
    }

    return null;
  }

  /**
   * Retrieve active settings (dbType, collectionName, autoSync)
   */
  function getActiveSettings() {
    const defaultSettings = {
      dbType: (window.FIREBASE_SETTINGS && window.FIREBASE_SETTINGS.dbType) || 'firestore',
      collectionName: (window.FIREBASE_SETTINGS && window.FIREBASE_SETTINGS.collectionName) || 'motorcycle_fleet',
      autoSync: (window.FIREBASE_SETTINGS && window.FIREBASE_SETTINGS.autoSync !== undefined) ? window.FIREBASE_SETTINGS.autoSync : true
    };

    const saved = localStorage.getItem('honda_firebase_settings');
    if (saved) {
      try {
        return Object.assign({}, defaultSettings, JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }

    return defaultSettings;
  }

  /**
   * Update internal status and notify subscribers
   */
  function setStatus(newStatus, errorMsg = null) {
    state.status = newStatus;
    state.errorMessage = errorMsg;
    notifyStatusChange();
  }

  function notifyStatusChange() {
    const statusPayload = {
      status: state.status,
      errorMessage: state.errorMessage,
      lastSyncTime: state.lastSyncTime,
      dbType: state.dbType,
      collectionName: state.collectionName,
      remoteFleetCount: state.remoteFleetCount,
      hasConfig: Boolean(getActiveConfig())
    };

    state.statusListeners.forEach(fn => {
      try {
        fn(statusPayload);
      } catch (err) {
        console.error('Error in status listener:', err);
      }
    });
  }

  /**
   * Subscribe to status changes
   */
  function onStatusChange(callback) {
    if (typeof callback === 'function') {
      state.statusListeners.push(callback);
      // Immediately notify current status
      callback({
        status: state.status,
        errorMessage: state.errorMessage,
        lastSyncTime: state.lastSyncTime,
        dbType: state.dbType,
        collectionName: state.collectionName,
        remoteFleetCount: state.remoteFleetCount,
        hasConfig: Boolean(getActiveConfig())
      });
    }
  }

  /**
   * Initialize Firebase instance with config and settings
   */
  async function init(onFleetUpdatedCallback) {
    if (typeof onFleetUpdatedCallback === 'function') {
      state.onFleetUpdated = onFleetUpdatedCallback;
    }

    const config = getActiveConfig();
    const settings = getActiveSettings();
    state.dbType = settings.dbType || 'firestore';
    state.collectionName = settings.collectionName || 'motorcycle_fleet';

    if (!config || !config.apiKey || !config.projectId) {
      setStatus('unconfigured');
      return false;
    }

    // Check if firebase script is loaded
    if (typeof firebase === 'undefined') {
      setStatus('error', 'ไม่พบไลบรารี Firebase SDK (กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต)');
      return false;
    }

    setStatus('connecting');

    try {
      // 1. Initialize Firebase App
      if (firebase.apps && firebase.apps.length > 0) {
        state.app = firebase.apps[0];
      } else {
        state.app = firebase.initializeApp(config);
      }

      // 2. Initialize Database client
      if (state.dbType === 'firestore') {
        if (!firebase.firestore) {
          throw new Error('ไม่พบ Firebase Firestore SDK');
        }
        state.db = firebase.firestore();

        // Enable multi-tab persistence if possible
        try {
          await state.db.enablePersistence({ synchronizeTabs: true });
        } catch (persErr) {
          if (persErr.code === 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab at a time.
            console.warn('Firestore persistence enabled in another tab');
          } else if (persErr.code === 'unimplemented') {
            console.warn('Current browser does not support all Firestore persistence features');
          }
        }
      } else {
        if (!firebase.database) {
          throw new Error('ไม่พบ Firebase Realtime Database SDK');
        }
        if (!config.databaseURL) {
          // Auto-derive databaseURL if missing: https://<projectId>-default-rtdb.firebaseio.com
          config.databaseURL = `https://${config.projectId}-default-rtdb.firebaseio.com`;
        }
        state.rtdb = firebase.database();
      }

      // 3. Start Real-time synchronization listener
      startRealtimeListener();
      return true;

    } catch (err) {
      console.error('Firebase initialization error:', err);
      setStatus('error', err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ Firebase');
      return false;
    }
  }

  /**
   * Start Real-time listener on the motorcycle fleet collection/node
   */
  function startRealtimeListener() {
    // Stop any existing listener
    if (state.unsubscribe) {
      state.unsubscribe();
      state.unsubscribe = null;
    }

    if (state.dbType === 'firestore' && state.db) {
      const colRef = state.db.collection(state.collectionName);

      state.unsubscribe = colRef.onSnapshot(
        (snapshot) => {
          state.lastSyncTime = new Date();
          state.remoteFleetCount = snapshot.size;
          setStatus('connected');

          const remoteFleet = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            data.id = data.id || doc.id;
            remoteFleet.push(data);
          });

          // Check if changes came from other clients
          const hasRemoteChanges = snapshot.docChanges().some(change => {
            return !snapshot.metadata.hasPendingWrites;
          });

          const isFirstLoad = !state.initialLoadDone;
          state.initialLoadDone = true;

          if (typeof state.onFleetUpdated === 'function') {
            state.onFleetUpdated(remoteFleet, {
              isRemote: hasRemoteChanges && !isFirstLoad && !state.isLocalAction,
              isInitial: isFirstLoad,
              docChanges: snapshot.docChanges().map(c => ({
                type: c.type, // 'added' | 'modified' | 'removed'
                id: c.doc.id,
                data: c.doc.data()
              }))
            });
          }
        },
        (error) => {
          console.error('Firestore onSnapshot error:', error);
          let thaiMsg = error.message;
          if (error.code === 'permission-denied') {
            thaiMsg = 'สิทธิ์เข้าถึงถูกปฏิเสธ (Permission Denied) - โปรดตรวจสอบ Security Rules ใน Firebase Console ให้เปิด allow read, write: if true;';
          }
          setStatus('error', thaiMsg);
        }
      );

    } else if (state.dbType === 'rtdb' && state.rtdb) {
      const ref = state.rtdb.ref(state.collectionName);

      const rtdbCallback = (snapshot) => {
        state.lastSyncTime = new Date();
        const val = snapshot.val();
        let remoteFleet = [];

        if (Array.isArray(val)) {
          remoteFleet = val.filter(Boolean);
        } else if (val && typeof val === 'object') {
          remoteFleet = Object.keys(val).map(key => {
            const item = val[key];
            if (item && typeof item === 'object') {
              item.id = item.id || key;
              return item;
            }
            return null;
          }).filter(Boolean);
        }

        state.remoteFleetCount = remoteFleet.length;
        setStatus('connected');

        const isFirstLoad = !state.initialLoadDone;
        state.initialLoadDone = true;

        if (typeof state.onFleetUpdated === 'function') {
          state.onFleetUpdated(remoteFleet, {
            isRemote: !isFirstLoad && !state.isLocalAction,
            isInitial: isFirstLoad
          });
        }
      };

      ref.on('value', rtdbCallback, (error) => {
        console.error('RTDB onValue error:', error);
        setStatus('error', error.message || 'สิทธิ์เข้าถึง Realtime Database ถูกปฏิเสธ');
      });

      state.unsubscribe = () => ref.off('value', rtdbCallback);
    }
  }

  /**
   * Upsert a single motorcycle document to Firebase
   */
  async function upsertMoto(moto) {
    if (!moto || !moto.id) return false;
    if (state.status !== 'connected' && state.status !== 'syncing') return false;

    state.isLocalAction = true;
    try {
      const cleanData = JSON.parse(JSON.stringify(moto));
      cleanData._lastModified = new Date().toISOString();

      if (state.dbType === 'firestore' && state.db) {
        await state.db.collection(state.collectionName).doc(moto.id).set(cleanData, { merge: true });
      } else if (state.dbType === 'rtdb' && state.rtdb) {
        await state.rtdb.ref(`${state.collectionName}/${moto.id}`).set(cleanData);
      }

      state.lastSyncTime = new Date();
      notifyStatusChange();
      return true;
    } catch (err) {
      console.error('Error upserting moto to Firebase:', err);
      return false;
    } finally {
      setTimeout(() => { state.isLocalAction = false; }, 800);
    }
  }

  /**
   * Update status of a single motorcycle in Firebase
   */
  async function updateMotoStatus(motoId, newStatus) {
    if (!motoId) return false;
    if (state.status !== 'connected' && state.status !== 'syncing') return false;

    state.isLocalAction = true;
    try {
      const updatePayload = {
        status: newStatus,
        _lastStatusChange: new Date().toISOString(),
        _lastModified: new Date().toISOString()
      };

      if (state.dbType === 'firestore' && state.db) {
        await state.db.collection(state.collectionName).doc(motoId).update(updatePayload);
      } else if (state.dbType === 'rtdb' && state.rtdb) {
        await state.rtdb.ref(`${state.collectionName}/${motoId}/status`).set(newStatus);
        await state.rtdb.ref(`${state.collectionName}/${motoId}/_lastStatusChange`).set(new Date().toISOString());
      }

      state.lastSyncTime = new Date();
      notifyStatusChange();
      return true;
    } catch (err) {
      console.error('Error updating moto status in Firebase:', err);
      return false;
    } finally {
      setTimeout(() => { state.isLocalAction = false; }, 800);
    }
  }

  /**
   * Delete a motorcycle document from Firebase
   */
  async function deleteMoto(motoId) {
    if (!motoId) return false;
    if (state.status !== 'connected' && state.status !== 'syncing') return false;

    state.isLocalAction = true;
    try {
      if (state.dbType === 'firestore' && state.db) {
        await state.db.collection(state.collectionName).doc(motoId).delete();
      } else if (state.dbType === 'rtdb' && state.rtdb) {
        await state.rtdb.ref(`${state.collectionName}/${motoId}`).remove();
      }

      state.lastSyncTime = new Date();
      notifyStatusChange();
      return true;
    } catch (err) {
      console.error('Error deleting moto from Firebase:', err);
      return false;
    } finally {
      setTimeout(() => { state.isLocalAction = false; }, 800);
    }
  }

  /**
   * Upload entire fleet array to Firebase (Batch migration / sync)
   */
  async function uploadAll(fleetArray) {
    if (!Array.isArray(fleetArray)) return { success: false, count: 0, error: 'ข้อมูลไม่ถูกต้อง' };

    const config = getActiveConfig();
    if (!config) return { success: false, count: 0, error: 'ยังไม่ได้ตั้งค่า Firebase' };

    // Ensure initialized
    if (!state.app) {
      const ok = await init(state.onFleetUpdated);
      if (!ok) return { success: false, count: 0, error: state.errorMessage || 'เชื่อมต่อ Firebase ล้มเหลว' };
    }

    state.isLocalAction = true;
    setStatus('syncing');

    try {
      if (state.dbType === 'firestore' && state.db) {
        // Firestore batch max 500 operations
        const colRef = state.db.collection(state.collectionName);
        const batchSize = 400;

        for (let i = 0; i < fleetArray.length; i += batchSize) {
          const chunk = fleetArray.slice(i, i + batchSize);
          const batch = state.db.batch();

          chunk.forEach(moto => {
            if (!moto || !moto.id) return;
            const docRef = colRef.doc(moto.id);
            const clean = JSON.parse(JSON.stringify(moto));
            clean._uploadedAt = new Date().toISOString();
            batch.set(docRef, clean, { merge: true });
          });

          await batch.commit();
        }
      } else if (state.dbType === 'rtdb' && state.rtdb) {
        const dict = {};
        fleetArray.forEach(moto => {
          if (moto && moto.id) {
            dict[moto.id] = JSON.parse(JSON.stringify(moto));
            dict[moto.id]._uploadedAt = new Date().toISOString();
          }
        });
        await state.rtdb.ref(state.collectionName).set(dict);
      }

      state.lastSyncTime = new Date();
      state.remoteFleetCount = fleetArray.length;
      setStatus('connected');
      return { success: true, count: fleetArray.length };

    } catch (err) {
      console.error('Error uploading fleet to Firebase:', err);
      setStatus('error', err.message);
      return { success: false, count: 0, error: err.message };
    } finally {
      setTimeout(() => { state.isLocalAction = false; }, 1000);
    }
  }

  /**
   * Pull all fleet records from Firebase once
   */
  async function downloadAll() {
    const config = getActiveConfig();
    if (!config) return { success: false, data: null, error: 'ยังไม่ได้ตั้งค่า Firebase' };

    if (!state.app) {
      const ok = await init(state.onFleetUpdated);
      if (!ok) return { success: false, data: null, error: state.errorMessage || 'เชื่อมต่อ Firebase ล้มเหลว' };
    }

    try {
      const list = [];
      if (state.dbType === 'firestore' && state.db) {
        const snap = await state.db.collection(state.collectionName).get();
        snap.forEach(doc => {
          const item = doc.data();
          item.id = item.id || doc.id;
          list.push(item);
        });
      } else if (state.dbType === 'rtdb' && state.rtdb) {
        const snap = await state.rtdb.ref(state.collectionName).once('value');
        const val = snap.val();
        if (Array.isArray(val)) {
          val.filter(Boolean).forEach(m => list.push(m));
        } else if (val && typeof val === 'object') {
          Object.keys(val).forEach(k => {
            const item = val[k];
            if (item) {
              item.id = item.id || k;
              list.push(item);
            }
          });
        }
      }

      state.lastSyncTime = new Date();
      state.remoteFleetCount = list.length;
      notifyStatusChange();
      return { success: true, data: list };

    } catch (err) {
      console.error('Error downloading fleet from Firebase:', err);
      return { success: false, data: null, error: err.message };
    }
  }

  /**
   * Health Check: Test write and read permissions
   */
  async function testConnection(customConfig, customSettings) {
    const config = customConfig || getActiveConfig();
    const settings = customSettings || getActiveSettings();

    if (!config || !config.apiKey || !config.projectId) {
      return {
        success: false,
        message: 'กรุณากรอก apiKey และ projectId ให้ครบถ้วน'
      };
    }

    if (typeof firebase === 'undefined') {
      return {
        success: false,
        message: 'ไม่พบไลบรารี Firebase SDK'
      };
    }

    let tempApp = null;
    const testAppName = 'test_connection_' + Date.now();

    try {
      tempApp = firebase.initializeApp(config, testAppName);

      if (settings.dbType === 'firestore') {
        const testDb = tempApp.firestore();
        const testCol = testDb.collection(settings.collectionName || 'motorcycle_fleet');
        const testDocRef = testCol.doc('_health_check_' + Date.now());

        // 1. Try Write
        await testDocRef.set({
          test: true,
          timestamp: new Date().toISOString(),
          client: 'Honda Dealership Fleet Test'
        });

        // 2. Try Read
        const snap = await testDocRef.get();
        if (!snap.exists) {
          throw new Error('เขียนข้อมูลสำเร็จแต่อ่านไม่พบเอกสาร');
        }

        // 3. Clean up
        await testDocRef.delete();

        return {
          success: true,
          message: 'เชื่อมต่อ Cloud Firestore สำเร็จสมบูรณ์! สิทธิ์อ่าน-เขียนทำงานได้ 100%'
        };

      } else {
        // Realtime Database
        if (!config.databaseURL) {
          config.databaseURL = `https://${config.projectId}-default-rtdb.firebaseio.com`;
        }
        const testRtdb = tempApp.database();
        const testRef = testRtdb.ref(`${settings.collectionName || 'motorcycle_fleet'}/_health_check`);

        await testRef.set({
          test: true,
          timestamp: new Date().toISOString()
        });

        const snap = await testRef.once('value');
        if (!snap.exists()) {
          throw new Error('เขียนข้อมูลสำเร็จแต่อ่านไม่พบ');
        }

        await testRef.remove();

        return {
          success: true,
          message: 'เชื่อมต่อ Firebase Realtime Database สำเร็จสมบูรณ์!'
        };
      }

    } catch (err) {
      console.error('Test connection error:', err);
      let errorDesc = err.message;
      if (err.code === 'permission-denied') {
        errorDesc = 'สิทธิ์การเข้าถึงถูกปฏิเสธ (Permission Denied) - โปรดตรวจสอบ Security Rules ใน Firebase Console ให้เปิดสิทธิ์ (allow read, write: if true;)';
      }
      return {
        success: false,
        message: errorDesc
      };
    } finally {
      if (tempApp) {
        try {
          await tempApp.delete();
        } catch (e) {
          // ignore cleanup
        }
      }
    }
  }

  /**
   * Save configuration to localStorage and re-initialize
   */
  async function saveConfigAndRestart(configObj, settingsObj) {
    if (configObj) {
      localStorage.setItem('honda_firebase_config', JSON.stringify(configObj));
    }
    if (settingsObj) {
      localStorage.setItem('honda_firebase_settings', JSON.stringify(settingsObj));
      state.dbType = settingsObj.dbType || 'firestore';
      state.collectionName = settingsObj.collectionName || 'motorcycle_fleet';
    }

    // Reset current app instance if exists
    if (state.unsubscribe) {
      state.unsubscribe();
      state.unsubscribe = null;
    }

    state.initialLoadDone = false;
    return await init(state.onFleetUpdated);
  }

  /**
   * Clear configuration
   */
  function clearConfig() {
    if (state.unsubscribe) {
      state.unsubscribe();
      state.unsubscribe = null;
    }
    localStorage.removeItem('honda_firebase_config');
    localStorage.removeItem('honda_firebase_settings');
    setStatus('unconfigured');
  }

  // Public API
  return {
    init,
    onStatusChange,
    upsertMoto,
    updateMotoStatus,
    deleteMoto,
    uploadAll,
    downloadAll,
    testConnection,
    saveConfigAndRestart,
    clearConfig,
    getActiveConfig,
    getActiveSettings,
    parseConfigInput,
    getState: () => ({ ...state })
  };
})();

// Attach to window
window.FirebaseSync = FirebaseSync;
