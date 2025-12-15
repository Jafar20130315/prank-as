const CACHE_NAME = 'prank-as-v4'; // ← har yangilanishda raqamni oshir
const STATIC_CACHE = [
  '/',
  '/index',
  '/soxta-ulanish-sistemasi',
  '/soxta-uyin-bank-kartasi',
  '/soxta-wifi-parol-aniqlovchi',
  '/soxta-joylashuv-aniqlovchi',
  '/soxta-random-yashash-joyi',
  '/soxta-shaxs-aniqlovchi',
  '/avtoraqam-rasm-generatori',
  '/soxta-parol-aniqlovchi',
  '/soxta-balans-aniqlovchi',
  '/oyin-barabani',
  '/tekst-ovoz',
  '/ovoz-olchovchi',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// 📦 INSTALL
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_CACHE))
  );
});

// ♻️ ACTIVATE — eski keshlarni O‘CHIRISH
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 🌐 FETCH
self.addEventListener('fetch', event => {
  const req = event.request;

  // ❗ CSS / JS doim NETWORK
  if (req.url.includes('.css') || req.url.includes('.js')) {
    event.respondWith(fetch(req));
    return;
  }

  // 📄 HTML — avval network, bo‘lmasa cache
  if (req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then(res => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, resClone));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // 🗂 Boshqa fayllar
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req))
  );
});
