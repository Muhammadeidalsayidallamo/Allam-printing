const CACHE_NAME = 'allam-printing-cache-v9';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/main.css',
  '/favicon.svg',
  
  // Key Images for UI/SEO
  'https://wsrv.nl/?url=i.ibb.co/pW1Rsr8/og-image-allam-printing-v2.png&w=1200&h=630&q=85&output=webp',
  'https://wsrv.nl/?url=i.ibb.co/1tK48zND/20251011-1956-image.png&w=800&q=85&output=webp',
  'https://wsrv.nl/?url=images.pexels.com/photos/7764611/pexels-photo-7764611.jpeg%3Fauto%3Dcompress%26cs%3Dtinysrgb%26w%3D1260%26h%3D750%26dpr%3D1&w=800&q=85&output=webp',
  
  // Hero Video Poster
  'https://wsrv.nl/?url=i.ibb.co/g6ZqL3g/video-poster.jpg&w=1920&q=80&output=webp',

  // Blog post images for faster blog preview load
  'https://wsrv.nl/?url=i.pinimg.com/736x/fd/fd/c5/fdfdc580c64d41fb9d6269f302b466ec.jpg&w=800&q=85&output=webp',
  'https://wsrv.nl/?url=i.pinimg.com/1200x/ab/b4/2d/abb42df2aac38e383417fce99afc4c51.jpg&w=800&q=85&output=webp',
  'https://wsrv.nl/?url=i.pinimg.com/1200x/24/f4/6f/24f46ff9cfe7a52786031e6912c548b3.jpg&w=800&q=85&output=webp',
  
  // Fonts
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&family=Poppins:wght@400;500;700&display=swap',
];


// Install event: cache the application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching app shell');
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.error('SW cache.addAll error:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter(name => name.startsWith('allam-printing-cache-') && name !== CACHE_NAME)
          .map((cacheName) => {
            console.log('Service Worker: Clearing old cache', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: handle requests with appropriate strategies
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  // Network-first strategy for navigation requests (e.g., index.html)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If fetch is successful, cache it for offline use and return it
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request.url, response.clone());
            return response;
          });
        })
        .catch(() => {
          // If network fails (offline), fall back to the cached version
          return caches.match(event.request.url) || caches.match('/');
        })
    );
    return; // Stop execution here for navigation requests
  }

  // Cache-first strategy for all other assets (CSS, JS, images, fonts)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return from cache if found
      if (cachedResponse) {
        return cachedResponse;
      }
      // Otherwise, fetch from the network, cache it, and return the response
      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      });
    })
  );
});