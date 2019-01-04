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
https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app
