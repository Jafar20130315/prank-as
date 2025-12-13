const CACHE_NAME = 'cache-v2';
const urlsToCache = [
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
  '/bizneschi-oka',
  '/tekst-ovoz',
  '/ovoz-olchovchi',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// SW install
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// SW activate
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
});

// SW fetch
self.addEventListener('fetch', e => {
  // CSS va JS har doim tarmoqdan yuklansin
  if (e.request.url.endsWith('.css') || e.request.url.endsWith('.js')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Boshqa fayllar keshdan yoki tarmoqdan
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
