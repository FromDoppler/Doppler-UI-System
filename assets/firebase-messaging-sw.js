//This file needs to be in the site root for this to work
importScripts('https://www.gstatic.com/firebasejs/7.14.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/7.14.0/firebase-messaging.js',
);
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
