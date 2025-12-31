const CACHE_NAME = 'nos-dois-v10';
const ASSETS_TO_CACHE = [
  'index.html',
  'manifest.json',
  'icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache v10 instalado');
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch(err => console.error("Erro no cache install:", err))
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
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Não faz cache de chamadas externas sensíveis (Firebase, Gemini)
        if (!event.request.url.startsWith(self.location.origin)) return networkResponse;
        
        return caches.open(CACHE_NAME).then((cache) => {
          // Apenas cacheia se for sucesso
          if (networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      }).catch(() => {
        // Fallback offline para navegação
        if (event.request.mode === 'navigate') {
          return caches.match('index.html');
        }
      });
    })
  );
});