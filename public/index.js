async function pwaSetup() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        '/service-worker.js'
      );
      console.log('index.js: service worker is registered');
      console.log('index.js: service worker scope is', registration.scope);
    } catch (e) {
      console.error('index.js: service worker registration failed:', e);
    }
  }
}

pwaSetup();
