# Progressive Web Applications (PWA)

## Overview

Progressive web applications (PWAs) can provide many of the features
typically associated with native applications.
These include the ability to:

- continue working while offline,
  possibly with reduced functionality
  and delayed transactions
- install a homescreen icon that can
  be used to launch the application
- launch quickly without requiring download
  of files from the internet
- communicate with users via dialog boxes, even after
  they have left the application, to reengage them
  (using the Push API and the Notifications API)
- look like native apps by running
  without browser chrome or in full-screen mode
- support multiple operating systems with a single code base,
  reducing development costs

## Installing Applications

Users are only willing to install a limited number of applications
on their mobile devices. PWAs provide an alternative that is
less intrusive than requiring yet another app download and install.

The steps to run a new PWA for the first time are:

1. open a web browser
2. search for the application or enter its URL
3. click its link
4. optionally add a desktop icon
   for launching the app again in the future
   with a single click

Often the first three steps are replaced by clicking
a link that is found in another way such as
in an email message or a social media site.
In this case a new PWA can be launched with a single click!

The steps to run a new native app for the first time are:

1. open the platform app store
2. search for the app
3. click an "install" button
4. locate the homescreen icon
5. click the homescreen icon

App stores typically allow newly installed apps to be run
from the app store immediately after they are installed
by clicking a button. This replaces steps 4 and 5.
So the minimum number of steps is four.
Some percentage of users will bail out before this is completed
simply due to the number of steps required.

Once a PWA or native app is installed,
launching it again is the same.
Clicking a homescreen icon is all that is required.

## Service Workers

Service workers are the key to many PWA features.
Each is implemented by a JavaScript file.
They execute separately from their associated web application
and can communicate with any number of pages within it.
A user can close the web application browser tab or window
and its service workers can continue executing.

Service workers do not have access to the DOM
and cannot use some browser APIs (which ones?).

Normally service workers must be served over HTTPS
for security reasons. For developer convenience,
they can be served over HTTP when using a localhost server.

A PWA can register any number of service workers.
Typically only one is used.

Service workers listen for events and act on them.

During development it is often necessary to force certain files to be reloaded.
Files cached by a service worker are not cleared by clearing the browser cache.
In Chrome, one approach to force files to be reloaded
on the next browser refresh is to open the devtools,
select the "Application" tab, select "Service Workers",
and click the "Unregister" link for the service worker.

Service workers can cache the files that are fetched from URLs.
To see these in Chrome devtools, click the "Application" tab
and open the "Cache Storage" section in the left nav.

During development it is desirable to reload the cached files
when the browser is refreshed. To enable this in Chrome,
open the devtools, click the "Application" tab,
and check the "Update on reload" checkbox.

## Service Worker Activation

A web application can register a service worker
to manage all URLs in the same scope.
This can be done in any JavaScript file
that is executed when the app starts.

```js
const registration = await navigator.serviceWorker.register(
  '/service-worker.js'
);
```

This triggers an `activate` event in the service worker.
The handler for this event should set the active service worker
identified by `self` to be controller for all clients in its scope.

```js
self.addEventListener('activate', event => {
  // Code shown next goes here.
  return self.clients.claim();
});
```

For service workers that use a single cache, it is common
to change its name whenever its contents need to change.
This can be done by appending a version number to its name.
When the name changes, clients should delete any old cache versions
to save space. The following code, placed inside the function
that handles the `activation` event, does this:

```js
const deleteOldCaches = async () => {
  const keyList = await caches.keys();
  return Promise.all(
    keyList.map(key => (key !== cacheName ? caches.delete(key) : null))
  );
};
event.waitUntil(deleteOldCaches());
```

If the PWA needs to cache any files,
this should be done in the event handler for the `install` event.
There are two motivations for doing this.
The first is that the files will be available when offline.
The second is that cached files can be used even when online
to help a PWA to launch faster.
The following code caches files:

```js
const filesToCache = [
  '/', // need in order to hit web app with domain only
  '/demo.css',
  '/index.html',
  '/demo.js',
  '/images/avatar.jpg'
];

self.addEventListener('install', event => {
  const cacheAll = async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(filesToCache);
  };
  event.waitUntil(cacheAll());
});
```

## Where To Store Data

For resources that have a URL, use the Service Worker Cache API.
For all other data, use the browser database IndexedDB API.

## Storage Limits

Storage limits for progressive web apps vary by browser.

Progressive web apps can use multiple storage APIs.

The Service Workers W3C Working Draft defines the Cache and CacheStorage APIs.
Each origin can create amd use multiple `Cache` objects
that are not shared across origin.
These are separate from the the browser's HTTP cache.
They are only updated through API calls.
They never expire and must be manually deleted when no longer needed.

To create a new `Cache` object in the current origin
inside an `async` function:

```js
const cache = await caches.open(cacheName);
```

To add or replace files to a `Cache` object,
use the `add` and `addAll` methods.
The `add` method takes a single URL path.
The `addAll` method takes an array of URL paths.
For example:

```js
await cache.addAll(filesToCache);
```

To retrieve a list of data keys in a `Cache` object, use the `keys` method.
Inside an async function this is done as follows:

```js
const keyList = await caches.keys();
```

To retrieve values for given `Cache` object keys,
use the `match` and `matchAll` methods.
The following code uses a cache-first strategy
to respond to `fetch` events.
If the request can be satisfied by the cache, it is.
Otherwise the Fetch API is used to fetch it over the network.

```js
self.addEventListener('fetch', event => {
  const {request} = event;
  const getResource = () => caches.match(request) || fetch(request);
  event.respondWith(getResource());
});
```

To retrieve the value for a given key in a `Cache` object, use the `?` method.

To delete a `Cache` object, use the `delete` method.

ADD DETAILS ON THE CacheStorage API!

The Indexed Database W3C Recommendation defines the Indexed Database API.
It is currently implemented in Chrome, Firefox, and Safari.
There is partial support in IE and Edge.

Note that there is an IndexedDB 2.0 W3C Candidate Recommendation
that will eventually replace this.
It is currently implemented in Chrome, Firefox, and Safari, but not IE or Edge.

In Chrome and Firefox the limit is based on the PWA origin rather than the API used.
Data can be added to any of them until the browser quota is reached.
Currently the Chrome storage quota for each domain is around 64GB.
The total space currently being used can be checked using the Storage API.
For example:

```js
navigator.storage.estimate().then(estimate => {
  const {quota, usage} = estimate;
  const percent = ((usage / quota) * 100).toFixed(1);
  console.log(
    `This app has used ${usage} bytes of its quota of ${quota} bytes (${percent}%).`
  );
});
```

In Safari ...

REWORD THIS!

Firefox: no limits, but will prompt after 50MB data stored. Mobile Safari: 50MB max, Desktop Safari: unlimited (prompts after 5MB), IE10+ maxes at 250MB and prompts at 10MB. PouchDB track IDB storage behavior. Future facing: For apps requiring more persistent storage, see the on-going work on Durable Storage.
Safari 10 has fixed many long-standing IDB bugs in their latest Tech Previews. That said, some folks have run into stability issues with Safari 10’s IDB and PouchDB have found it to be a little slow. Until more research has been done here, YMMV. Please do test and file browser bugs so the folks @webkit and related OSS library authors can take a look. LocalForage, PouchDB, YDN and Lovefield use WebSQL in Safari by default due to UA sniffing (there wasn’t an efficient way to feature-test for broken IDB at the time). This means these libraries will work in Safari 10 without extra effort (just not using IDB directly).

You are also responsible for periodically purging cache entries. Each browser has a hard limit on the amount of cache storage that a given origin can use. Cache quota usage estimates are available via the StorageEstimate API. The browser does its best to manage disk space, but it may delete the Cache storage for an origin. The browser will generally delete all of the data for an origin or none of the data for an origin. Make sure to version caches by name and use the caches only from the version of the script that they can safely operate on.

## Manifest File

Service workers require a `manifest.json` file.
These are typically located at the top of the `public` directory
along with `index.html`.

There are many properties that can be set in the manifest file.
SEE PAGE 176-181 FOR DETAILS!
The following properties are required:

- `name` and/or `short_name`
- `start_url`
- `icons`
- `display`

Other properties that can be set include:

- `description`
- `orientation`
- `theme_color`
- `background_color`
- `scope`
- `dir`
- `lang`
- `prefer_related_applications`
- `related_applications`

Once a service worker has been registered,
its manifest can be examined in Chrome devtools
by clicking the "Application" tab
and clicking "Manifest" in the left nav.

## Lifecycle Events

The `install` event is emitted when ...

The `activate` event is emitted when ...

The `fetch` event is emitted when ...

The `sync` event is emitted when ...

The `push` event is emitted when ...

## Service Worker Implementation

The code for a service worker can be placed in a JavaScript source file with any name.
If the name is `service-worker.js`, the web application
can register it with the following code:

```js
const registration = await navigator.serviceWorker.register(
  '/service-worker.js'
);
```

A service worker only has access to files in the
same directory and in descendant directories.
For this reason, its source file is typically
placed at the top of the `public` directory.

## Caching Files

To cause the service worker to cache all the files
that are required in order to run in offline mode,
add the following in its source file:

```js
const cacheName = 'some-name';
const filesToCache = ['/file-path-1', '/file-path-2', ...];

self.addEventListener('install', async event => {
  const cache = await caches.open(cacheName);
  event.waitUntil(cache.addAll(filesToCache));
});
```

## Service Worker Support in Chrome Devtools

Chrome developer tools (devtools) are accessed from a menu
by selecting View ... Developer ... Developer Tools
or pressing the equivalent keyboard shortcut.
The following sections assume that the web app is running
in the current browser window and the devtools are open.

To allow the service worker code to be updated
by a browser refresh:

- click "Application" tab
- click "Service Workers" in left nav
- check "Update on reload"

To see the service worker code being used:

- click "Application" tab
- click "Service Workers" in left nav
- scroll to the first service worker with a status of "active and is running"
- click the link after "Source"

To allow service worker to receive fetch events:

- click "Application" tab
- verify that the "Bypass for network" checkbox is unchecked

To see a list of all the cached files:

- click "Application" tab
- click the "Cache Storage" disclosure triangle in left nav
- click the cache name

To see the content of a cached file
displayed by the steps above, click its name.

To delete a file from the cache,
click its name and click the "X" above the list of files.

To clear all the files that the service worker has cached:

- click "Application" tab
- click "Clear storage" in left nav
- verify that the "Cache storage" checkbox is checked,
  and consider checking all the checkboxes
- click "Clear site data" button at bottom

Files cached by a service worker will be used even if the
devtools "Disable cache" checkbox on the "Network" tab
is checked.

In order to repeatedly test the process of registering a service worker,
it is useful to unregister the current service worker.

To unregister a service worker and register it again:

- click "Application" tab
- click "Service Workers" in left nav
- click "Unregister" link to right of the service worker
- refresh browser window

After a service worker has been unregistered in the devtools,
it still appears in the list of service workers,
but has a status of "activated and is stopped".
The only way to make these disappear from the list is to
close the browser tab, open a new one, and browse the site again.

It seems that fetch events are only generated for resources
that were really found at some point in the past.
If the resource never existed, no fetch event will be generated
and a 404 will be returned.
The service worker can respond with different content,
but only if there was some original content
and only on requests after the first (refresh page).

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

## Service Workers in React

After every code change, including changes to the service worker code,
rebuild the app by entering `npm run build`.

In development, start a local HTTP server that
is configured to serve up the `build` directory.
For example, this could be a simple Express server.

## Working Offline With Cached Assets

This uses the CacheStorage API.

## Persisting Data With IndexedDB

## Background Sync

## Communications Between Page and Service Worker

## REST Calls From Service Worker

## Adding Apps to Homescreen

## Push Notifications

## PWA User Experience (UX)

## create-react-app

The easiest way to create the starting point for a new React application
is to use create-react-app.

To install this, enter `npm install -g create-react-app`.

To create a new app:

```bash
create-react-app {app-name}
cd {app-name}
npm install
npm start
```

This will create the starting files for the app,
install all the dependencies,
start a local HTTP server that watches for changes,
and run the app in a new browser window
that supports live reload.

One of the files this generates is `src/service-worker.js`
which supports offline usage of the application
after an initial online usage by caching all required assets.
This capability is **not enabled by default**.
To enable it, edit `src/index.js`
and change the line `serviceWorker.unregister();`
to `serviceWorker.register();`.
This only takes effect if the environment variable
`NODE_ENV` is set to `production`.
For testing in development, the first line in the `register` function
can be modified to omit this check.

This uses the workbox-webpack-plugin to cache assets
and keep them up to date when changes are deployed.
[Workbox](https://developers.google.com/web/tools/workbox)
"is a library that bakes in a set of best practices and
removes the boilerplate every developer writes
when working with service workers."

It is recommended to leave this disabled during development
because it can make debugging more difficult.

There are many ways to be offline
for testing offline operation of a PWA.

- When using a local server, stop the server.
- When connecting via ethernet, you can disconnect the ethernet cable.
- When connecting via wi-fi, you can turn off wi-fi.
- It does not work to open the Chrome devtools,
  click the "Network" tab, and check the "Offline" checkbox
  and I don't know why!

## Future

## Conclusion

Thanks to ? for reviewing this article!

## Resources

"Building Progressive Web Apps" book\
Tal Ater, 2017, O'Reilly

Create React App - Making a Progressive Web App\
<https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app>
