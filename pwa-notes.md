# Progressive Web App Notes

A service worker only has access to files in the
same directory and in descendant directories.
For this reason, the JavaScript file that defines it is
typically placed at the top of the "public" directory.

To allow the service worker code to be updated on a refresh:

- open devtools
- click "Application" tab
- click "Service Workers" in left nav
- check "Update on reload"

To see the service worker code being used:

- open devtools
- click "Application" tab
- click "Service Workers" in left nav
- scroll to the first service worker with a status of "active and is running"
- click the link after "Source"

To allow service worker to get fetch events:

- open devtools
- click "Application" tab
- uncheck "Bypass for network"!

To clear what service worker has cached:

- open devtools
- click "Application" tab
- click "Clear storage" in left nav
- click "Clear site date" button at bottom

To reload service-worker.js:

- open devtools
- click "Application" tab
- click "Service Workers" in left nav
- click "Unregister" link to right of the service worker
- refresh browser window

To clear out list of unregistered service workers,
close the browser tab, open a new one, and browse the site again.

It seems that fetch events are only generated for resources
that were really found at some point in the past.
If the resource never existed, no fetch event will be generated
and a 404 will be returned.
The service worker can respond with different content,
but only if there was some original content
and only on requests after the first (refresh page).

To cache files:

```js
const cacheName = 'some-name';
const filesToCache = [...];

self.addEventListener('install', async event => {
  const cache = await caches.open(cacheName);
  event.waitUntil(cache.addAll(filesToCache));
});
```

Do you need to uncheck "Disable cache" in the devtools
"Network" tab for these cached files to be used?

To see the cached files:

- open devtools
- click "Application" tab
- click the "Cache Storage" disclosure triangle in left nav
- click the cache name

To see the content of a cached file:

- click its name

To simulate being offline, open the devtools and
check the "Offline" checkbox on either the
"Application" tab in "Service Workers"
or the "Network" tab.

To determine if online, check the boolean value of `navigator.onLine`.

## Devtools Tips

To toggle display of the console without switching to that tab,
press esc.

The browser caches files too.
To see these, open the devtools,
click the "Application" tab, and
look under "Frames" in the left nav.
To clear these files, right-click the refresh icon
in the upper-left corner of the browser
and select "Empty Cache and Hard Reload".
