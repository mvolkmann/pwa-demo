async function loadList() {
  console.log('demo.js loadList: entered');
  const res = await fetch('/list');
  const data = await res.json();
  console.log('demo.js makeRestCall: data =', data);

  const ul = document.querySelector('.demo-list');

  // Remove all current child nodes of the list.
  while (ul.hasChildNodes()) {
    ul.removeChild(ul.firstChild);
  }

  Object.keys(data)
    .sort()
    .forEach(key => {
      const value = data[key];
      const li = document.createElement('li');
      const text = document.createTextNode(key + ' = ' + value);
      li.appendChild(text);
      ul.appendChild(li);
    });
}

async function pwaSetup() {
  if ('serviceWorker' in navigator) {
    try {
      // If the file "service-worker.js" is not found,
      // a service worker with a status of "is redundant" will be created.
      const registration = await navigator.serviceWorker.register(
        '/service-worker.js'
      );
      console.log('demo.js: service worker is registered');
      console.log('demo.js: service worker scope is', registration.scope);

      navigator.storage.estimate().then(estimate => {
        const {quota, usage} = estimate;
        const percent = ((usage / quota) * 100).toFixed(1);
        console.log(`This app has ${percent}% of its storage quota.`);
      });
    } catch (e) {
      console.error('demo.js: service worker registration failed:', e);
    }
  }
}

pwaSetup();
