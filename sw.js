const CACHE = 'art-record-v1';
const ASSETS = [
  './',
  './index.html',
  './collection.html',
  './app.js',
  './collection.js',
  './db.js',
  './drawer.js',
  './style.css',
  './icon.png',
  './manifest.json',
  './images/painters/pollock.jpg',
  './images/painters/rembrandt.jpg',
  './images/painters/degas.jpg',
  './images/painters/matisse.jpg',
  './images/painters/dali.jpg',
  './images/painters/renoir.jpg',
  './images/painters/monet.jpg',
  './images/painters/gauguin.jpg',
  './images/painters/chagall.jpg',
  './images/painters/cezanne.jpg',
  './images/painters/kandinsky.jpg',
  './images/painters/da-vinci.jpg',
  './images/painters/michelangelo.jpg',
  './images/painters/pissarro.jpg',
  './images/painters/kahlo.jpg',
  './images/painters/klimt.jpg',
  './images/painters/picasso.jpg',
  './images/painters/warhol.jpg',
  './images/painters/van-gogh.jpg',
  './images/painters/munch.jpg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
