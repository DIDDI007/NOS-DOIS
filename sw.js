
const CACHE_NAME = 'nos-dois-v7';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.png',
  '/?source=pwa'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache aberto');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => { 
        if (key !== CACHE_NAME) {
          return caches.delete(key); 
        }
      })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Necessário para o critério de PWA do Chrome: responder a requisições mesmo offline
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Não faz cache de chamadas de API ou externas (Firebase/Gemini) aqui
        if (!event.request.url.startsWith('http') || event.request.method !== 'GET') {
          return networkResponse;
        }
        
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // Se falhar e for navegação, retorna o index.html
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});
