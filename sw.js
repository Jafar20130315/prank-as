const CACHE_NAME = 'cache-v2'; // version yangilandi
const urlsToCache = [
'/asosiy', // start_url bilan mos
'/soxta-ulanish-sistemasi',
'/soxta-uyin-bank-kartasi',
'/soxta-wifi-parol-aniqlovchi',
'/soxta-joylashuv-aniqlovchi',
'/soxta-random-yashash-joyi',
'/soxta-shaxs-aniqlovchi',
'/avtoraqan-rasm-generatori',
'/soxta-parol-aniqlovchi',
'/soxta-balans-aniqlovchi',
'/oyin-barabani',
'/bizneschi-oka',
'/tekst-ovoz',
'/ovoz-olchovchi',
'/icons/icon-192.png',
'/icons/icon-512.png'
];

self.addEventListener('install', event => {
event.waitUntil(
caches.open(CACHE_NAME)
.then(cache => cache.addAll(urlsToCache))
);
});

self.addEventListener('activate', event => {
event.waitUntil(
caches.keys().then(keys =>
Promise.all(
keys.filter(key => key !== CACHE_NAME)
.map(key => caches.delete(key))
)
)
);
});

self.addEventListener('fetch', event => {
event.respondWith(
caches.match(event.request).then(response => response || fetch(event.request))
);
})
