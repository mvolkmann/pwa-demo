const cacheName = 'pwa-demo-v1';
console.log('service-worker.js: cacheName =', cacheName);

const filesToCache = [
  '/', // need in order to hit web app with domain only
  '/demo.css',
  '/demo.js',
  '/images/avatar.jpg',
  '/images/birthday-192.jpg'
];

self.addEventListener('activate', event => {
  const deleteOldCaches = async () => {
    const keyList = await caches.keys();
    return Promise.all(
      keyList.map(key => (key !== cacheName ? caches.delete(key) : null))
    );
  };
  event.waitUntil(deleteOldCaches());
});

self.addEventListener('install', event => {
  const cacheAll = async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(filesToCache);
  };
  event.waitUntil(cacheAll());
});

// No fetch events are generated in the initial load of the web app.
// A second visit is required to cache all the resources.
self.addEventListener('fetch', event => {
  const {request} = event;

  const getResource = async () => {
    const {url} = request;
    const isAvatar = url.includes('githubusercontent.com');
    let resource;

    // Get from cache.
    resource = await caches.match(request);
    if (resource) {
      console.log('service worker got', url, 'from cache');
    } else {
      try {
        // Get from network.
        resource = await fetch(request);
        console.log('service worker got', url, 'from network');

        if (!isAvatar) {
          // Save in cache for when we are offline later.
          const cache = await caches.open(cacheName);
          await cache.add(url);
          console.log('service worker cached', url);
        }
      } catch (e) {
        if (isAvatar) {
          console.log('service worker using generic avatar');
          resource = Response.redirect('/images/avatar.jpg');
        } else {
          console.error('service worker failed to get', url);
          resource = new Response('', {status: 404});
        }
      }
    }

    return resource;
  };

  event.respondWith(getResource());
});
