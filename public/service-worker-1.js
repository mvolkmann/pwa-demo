const cacheName = 'pwa-demo';

// No fetch events are generated in the initial load of the web app.
// A second visit is required to cache all the resources.
self.addEventListener('fetch', event => {
  const {request} = event;

  const getResource = async () => {
    const {url} = request;
    let resource;

    try {
      // Get from network.
      // Note that resources coming from a local HTTP server
      // can be fetched even when offline.
      // To use cached versions of those, stop the local HTTP server.
      resource = await fetch(request);
      console.log('service worker got', url, 'from network');

      // Save in cache for when we are offline later.
      const cache = await caches.open(cacheName);
      await cache.add(url);
      console.log('service worker cached', url);
    } catch (e) {
      // Get from cache.
      resource = await caches.match(request);
      console.log('service worker got', url, 'from cache');
    }

    return resource;
  };

  event.respondWith(getResource());
});
