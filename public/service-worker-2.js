const cacheName = 'pwa-demo-2';

self.addEventListener('activate', event => {
  const deleteOldCaches = async () => {
    const keyList = await caches.keys();
    return Promise.all(
      keyList.map(key => (key !== cacheName ? caches.delete(key) : null))
    );
  };
  event.waitUntil(deleteOldCaches());
});

// No fetch events are generated in the initial load of the web app.
// A second visit is required to cache all the resources.
self.addEventListener('fetch', event => {
  const {request} = event;

  const getResource = async () => {
    const {url} = request;
    let resource;

    // Get from cache.
    resource = await caches.match(request);
    if (resource) {
      console.log('service worker got', url, 'from cache');
    } else {
      // Get from network.
      resource = await fetch(request);
      console.log('service worker got', url, 'from network');

      // Save in cache for when we are offline later.
      const cache = await caches.open(cacheName);
      await cache.add(url);
      console.log('service worker cached', url);
    }

    return resource;
  };

  event.respondWith(getResource());
});
