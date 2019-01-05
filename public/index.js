async function pwaSetup() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        '/service-worker.js'
      );
      console.log('index.js: service worker is registered');
      console.log('index.js: service worker scope is', registration.scope);

      navigator.storage.estimate().then(estimate => {
        const {quota, usage} = estimate;
        const percent = ((usage / quota) * 100).toFixed(1);
        console.log(`This app has ${percent}% of its storage quota.`);
      });
    } catch (e) {
      console.error('index.js: service worker registration failed:', e);
    }
  }
}

pwaSetup();
