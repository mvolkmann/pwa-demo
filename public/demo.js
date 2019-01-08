let addBtn;
let numberInput;
let totalDiv;

async function addToTotal() {
  const number = numberInput.value;
  try {
    await fetch('/total', {method: 'POST', body: number});
  } finally {
    await updateTotal();
  }
}

function numberChanged(event) {
  const disabled = event.target.value.length === 0;
  if (disabled) {
    addBtn.setAttribute('disabled', '');
  } else {
    addBtn.removeAttribute('disabled');
  }
}

async function pwaSetup() {
  if ('serviceWorker' in navigator) {
    try {
      // If the file "service-worker.js" is not found,
      // a service worker with a status of "is redundant" will be created.
      const registration = await navigator.serviceWorker.register(
        '/service-worker.js'
      );
      console.info(
        'demo.js: service worker registered with scope',
        registration.scope
      );

      navigator.storage.estimate().then(estimate => {
        const {quota, usage} = estimate;
        const percent = ((usage / quota) * 100).toFixed(1);
        console.info(`This app has ${percent}% of its storage quota.`);
      });
    } catch (e) {
      console.error('demo.js: service worker registration failed:', e);
    }
  }
}

async function resetTotal() {
  try {
    await fetch('/total', {method: 'DELETE'});
  } catch (e) {
    // do nothing for now
  }
  totalDiv.textContent = 0;
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
  pwaSetup();

  addBtn = document.querySelector('#add-btn');
  numberInput = document.querySelector('#number');
  totalDiv = document.querySelector('#total');

  updateTotal();
  window.addEventListener('offline', updateTotal);
  window.addEventListener('online', updateTotal);
};
