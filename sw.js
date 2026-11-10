/**
 * ============================================================================
 * Easy Wealth Finance - Progressive Web App Service Worker (sw.js)
 * Strategy: Network-First with Offline Cache Fallback (Never blocks live updates)
 * ============================================================================
 */

const CACHE_NAME = 'easyfinance-pwa-v20261110_v6';
const CORE_ASSETS = [
  './',
  './index.html',
  './admin.html',
  './styles.css',
  './admin.css',
  './app.js',
  './admin.js',
  './pwa-install.js',
  './manifest.json',
  './manifest-admin.json',
  './images/logo.png',
  './images/icon-192.png',
  './images/icon-512.png'
];

// 1. Install Event: Pre-cache essential app shell & activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch(() => {
        // Ignore individual asset pre-cache failures on local environments
      });
    })
  );
});

// 2. Activate Event: Clean up old caches & claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Network-First for same-origin GET requests (bypasses Firebase/APIs)
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle standard GET requests
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never intercept Firebase, Firestore, Google APIs, or external API calls
  if (
    url.origin !== self.location.origin ||
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('firebase') ||
    url.hostname.includes('googleapis.com')
  ) {
    return;
  }

  event.respondWith(
    fetch(req)
      .then((networkRes) => {
        // Update cache with fresh network response
        if (networkRes && networkRes.status === 200 && networkRes.type === 'basic') {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, resClone);
          });
        }
        return networkRes;
      })
      .catch(() => {
        // Offline fallback from cache
        return caches.match(req).then((cachedRes) => {
          if (cachedRes) return cachedRes;
          if (req.mode === 'navigate') {
            if (url.pathname.includes('admin')) {
              return caches.match('./admin.html');
            }
            return caches.match('./index.html');
          }
        });
      })
  );
});

