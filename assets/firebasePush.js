function startFirebase() {
  var firebaseConfig = {
    apiKey: 'AIzaSyBxvMf0-wPjPegLm-r7EcB3eU2weDnMRLc',
    authDomain: 'webpush-9cb34.firebaseapp.com',
    databaseURL: 'https://webpush-9cb34.firebaseio.com',
    projectId: 'webpush-9cb34',
    storageBucket: 'webpush-9cb34.appspot.com',
    messagingSenderId: '854930863851',
    appId: '1:854930863851:web:34453ce98c9161dfe0f0ae',
  };
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();
  messaging.usePublicVapidKey(
    'BPXWHCYAXj9sseoRK2_39MvJe5LTpjZx2nR0lL0dycH5TZjw6fmTW5u9eKril2IxYuKLm-4Y2cLUlSggUjdlCE0',
  );
  messaging
    .requestPermission()
    .then(function () {
      console.log('FCM: permission granted');
      return messaging.getToken();
    })
    .then(function (token) {
      console.log(token);
    })
    .catch(function (error) {
      console.log('FCM blocked or not allowed: ' + JSON.stringify(error));
    });
  messaging.onMessage(function (payload) {
    console.log('FCM On Message: ' + JSON.stringify(payload));
  });
}
// inject scripts into body
var firebaseSdk = document.createElement('script');
firebaseSdk.type = 'text/javascript';
firebaseSdk.src = 'https://www.gstatic.com/firebasejs/7.14.0/firebase-app.js';
document.body.appendChild(firebaseSdk);

var firebaseMessaging = document.createElement('script');
firebaseMessaging.type = 'text/javascript';
firebaseMessaging.onload = startFirebase;
firebaseMessaging.src =
  'https://www.gstatic.com/firebasejs/7.14.0/firebase-messaging.js';
document.body.appendChild(firebaseMessaging);
