/* eslint-env browser, serviceworker, es6 */

'use strict';
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = JSON.parse(event.data.text()).title;
  const options = {
    body: JSON.parse(event.data.text()).message,
    icon: 'img/iso-doppler.gif',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(clients.openWindow('https://fromdoppler.com'));
});
