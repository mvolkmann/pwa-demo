let addBtn, numberInput, registration, totalDiv;

// eslint-disable-next-line no-unused-vars
async function addToTotal() {
  const number = numberInput.value;
  try {
    // The message can be any kind of JavaScript value.
    navigator.serviceWorker.controller.postMessage('page is adding ' + number);
    await fetch('/total', {method: 'POST', body: number});
  } finally {
    await updateTotal();
  }
}

async function notify(message) {
  const permission = await Notification.requestPermission();

  // Only works on desktop.
  // eslint-disable-next-line no-new
  //if (permission === 'granted') new Notification(message);

  // Also works on mobile.
  if (permission === 'granted') registration.showNotification(message);
}

// eslint-disable-next-line no-unused-vars
function numberChanged(event) {
  const disabled = event.target.value.length === 0;
  if (disabled) {
    addBtn.setAttribute('disabled', '');
  } else {
    addBtn.removeAttribute('disabled');
  }
}

// eslint-disable-next-line no-unused-vars
async function resetTotal() {
  try {
    await fetch('/total', {method: 'DELETE'});
  } catch (e) {
    // do nothing for now
  }
  totalDiv.textContent = 0;
}

async function serviceWorkerSetup() {
  if ('serviceWorker' in navigator) {
    try {
      // If the file "service-worker.js" is not found,
      // a service worker with a status of "is redundant" will be created.
      registration = await navigator.serviceWorker.register(
        '/service-worker.js'
      );
      console.info('service worker registered with scope', registration.scope);

      const estimate = await navigator.storage.estimate();
      const {quota, usage} = estimate;
      const percent = ((usage / quota) * 100).toFixed(1);
      console.info(`This app has ${percent}% of its storage quota.`);
    } catch (e) {
      console.error('service worker registration failed:', e);
    }

    navigator.serviceWorker.addEventListener('message', event => {
      console.log('page got message:', event.data);
    });

    notify('service worker is ready');
  }
}

async function updateTotal() {
  let total = 'offline';

  if (navigator.onLine) {
    try {
      const res = await fetch('/total');
      total = await res.text();
    } catch (e) {
      // do nothing
    }
  }

  totalDiv.textContent = total;
}

window.onload = () => {
  serviceWorkerSetup();

  addBtn = document.querySelector('#add-btn');
  numberInput = document.querySelector('#number');
  totalDiv = document.querySelector('#total');

  updateTotal();
  window.addEventListener('offline', updateTotal);
  window.addEventListener('online', updateTotal);
};
