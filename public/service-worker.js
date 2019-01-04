console.log('service-worker.js: entered at', Date.now());

const cacheName = 'pwa-demo';

const filesToCache = [
  '/',
  '/demo.css',
  '/index.html',
  '/index.js',
  '/images/avatar.jpg',
  '/images/birthday-192.jpg',
  '/images/birthday-512.jpg',
  '/images/birthday-icon.jpg'
];

self.addEventListener('activate', event => {
  const deleteCaches = async () => {
    const keyList = await caches.keys();
    return Promise.all(
      keyList.map(key => {
        if (key !== cacheName) {
          console.log('service-worker.js activate: removing cache for', key);
          return caches.delete(key);
        }
        return null;
      })
    );
  };
  event.waitUntil(deleteCaches());
  return self.clients.claim();
});

self.addEventListener('install', event => {
  const cacheAll = async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(filesToCache);
  };
  event.waitUntil(cacheAll());
});

function supplyDemoCss(event) {
  // This demonstrates supplying alternate content from
  // the service worker instead of using a cached file.
  const content = `
    body { color: red; font-family: sans-serif; }
    img { width: 60px; }
  `;
  const options = {
    headers: {
      'Content-Type': 'text/css; charset=utf-8' //TODO: need charset?
    },
    status: 200,
    statusText: 'OK'
  };
  event.respondWith(new Response(content, options));
}

function supplyGenericAvatar(event) {
  event.respondWith(Response.redirect('/images/avatar.jpg'));
}

self.addEventListener('fetch', event => {
  console.log('service-worker.js fetch: navigator.onLine =', navigator.onLine);

  const {request} = event;
  const {url} = request;
  console.log('service-worker.js fetch: url =', url);

  if (url.endsWith('demo.css')) {
    supplyDemoCss(event);
  } else if (url.includes('githubusercontent.com')) {
    if (navigator.onLine) {
      event.respondWith(fetch(request));
    } else {
      supplyGenericAvatar(event);
    }
  } else {
    // Use a cache-first strategy for files listed in filesToCache,
    // but sending an HTTP request for all others.
    const getResource = () => {
      const response = caches.match(request);
      return response || fetch(request);
    };
    // This uses cached files.
    event.respondWith(getResource());
  }
});
