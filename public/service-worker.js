self.importScripts('idb-util.js');

const cacheName = 'pwa-demo-v1';
console.log('service-worker.js: cacheName =', cacheName);

const filesToCache = [
  '/', // need in order to hit web app with domain only
  '/demo.css',
  '/demo.js',
  '/images/avatar.jpg',
  '/images/birthday-192.jpg'
];

const totalQueue = [];

async function processTotalRequests() {
  if (!navigator.onLine) return;

  while (totalQueue.length) {
    try {
      const [options] = totalQueue;
      // eslint-disable-next-line no-await-in-loop
      await fetch('/total', options);
      totalQueue.shift();
    } catch (e) {
      console.error('service-worker.js processTotalRequests: e =', e);
      break;
    }
  }
}

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
  const getResource = async () => {
    await processTotalRequests();

    const {request} = event;
    const body = await request.clone().text();
    const {url} = request;
    const isTotal = url.endsWith('/total');

    let resource;

    function handleOffline() {
      const isAvatar = url.includes('githubusercontent.com');
      if (isAvatar) {
        console.info('service worker using generic avatar');
        resource = Response.redirect('/images/avatar.jpg');
      } else if (isTotal) {
        // Queue the request for processing when online again.
        if (request.method !== 'GET') {
          totalQueue.push({method: request.method, body});
        }
        resource = new Response('0', {status: 503}); // Service Unavailable
      } else {
        console.error('service worker failed to get', url);
        resource = new Response('offline', {status: 404}); // Not Found
      }
    }

    // Get from cache.
    if (!isTotal) resource = await caches.match(request);

    if (resource) {
      console.info('service worker got', url, 'from cache');
    } else {
      try {
        if (navigator.onLine) {
          // Get from network.
          resource = await fetch(request);
          console.info('service worker got', url, 'from network');
        } else {
          handleOffline();
        }
      } catch (e) {
        handleOffline();
      }
    }

    return resource;
  };

  event.respondWith(getResource());
});

async function idbSetup() {
  const idbUtil = getIdbUtil('my-db', 'my-store');

  await idbUtil.set('foo', 'apple');
  await idbUtil.clear();
  await idbUtil.set('bar', 'banana');
  await idbUtil.set('baz', 'grape');
  await idbUtil.set('quz', 'strawberry');
  await idbUtil.delete('baz');

  const bar = await idbUtil.get('bar');
  console.log('service-worker.js idbSetup: bar =', bar);

  const keys = await idbUtil.keys();
  console.log('service-worker.js idbSetup: keys =', keys);
}

idbSetup();
