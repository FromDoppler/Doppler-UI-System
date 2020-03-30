var applicationServerPublicKey =
  'BFtBVunx6Lg_4ziA6b_Oe-9iqQetudiBzkukb1UOOWItZlbdPXCnMLjTfM6gnbmzrusaGlifwWWaFRWnef_H40Y';

var pushButton = document.querySelector('.js-push-btn');
var notificationButton = document.querySelector('.js-send-notification');
var publicKeyInput = document.querySelector('#public-key');

var isSubscribed = false;
var swRegistration = null;
var userSubscription = null;

function urlB64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

if (navigator.serviceWorker && window.PushManager) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker
    .register('sw.js')
    .then(function(swReg) {
      console.log('Service Worker is registered', swReg);

      swRegistration = swReg;
    })
    .catch(function(error) {
      console.error('Service Worker Error', error);
    });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}

function initialiseUI() {
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  });

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription().then(function(subscription) {
    isSubscribed = !(subscription === null);

    updateSubscriptionOnServer(subscription);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}

function updateBtn() {
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'Mensajes push bloqueados';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }

  if (isSubscribed) {
    pushButton.textContent = 'Deshabilitar Push';
  } else {
    pushButton.textContent = 'Habilitar Push';
  }

  pushButton.disabled = false;
}

navigator.serviceWorker.register('sw.js').then(function(swReg) {
  console.log('Service Worker is registered', swReg);

  swRegistration = swReg;
  initialiseUI();
});

function subscribeUser() {
  var providedApplicationPublicKey =
    publicKeyInput.value || applicationServerPublicKey;
  var applicationServerKey = urlB64ToUint8Array(providedApplicationPublicKey);
  swRegistration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    })
    .then(function(subscription) {
      console.log('User is subscribed:', subscription);

      updateSubscriptionOnServer(subscription);

      isSubscribed = true;

      updateBtn();
    })
    .catch(function(err) {
      console.log('Failed to subscribe the user: ', err);
      updateBtn();
    });
}

function updateSubscriptionOnServer(subscription) {
  if (subscription) {
    userSubscription = subscription;
  }
}

function unsubscribeUser() {
  swRegistration.pushManager
    .getSubscription()
    .then(function(subscription) {
      if (subscription) {
        return subscription.unsubscribe();
      }
    })
    .catch(function(error) {
      console.log('Error unsubscribing', error);
    })
    .then(function() {
      updateSubscriptionOnServer(null);

      console.log('User is unsubscribed.');
      isSubscribed = false;

      updateBtn();
    });
}

notificationButton.addEventListener('click', function() {
  if (isSubscribed) {
    sendRequestNotification();
  } else {
    console.log('No esta suscripto a notificaciones');
  }
});

function sendRequestNotification() {
  var message =
    document.querySelector('#notification-message').value || 'mensaje push';
  var title =
    document.querySelector('#notification-title').value || 'Doppler Push';
  var pushServerUrl =
    document.querySelector('#server-url').value || 'http://localhost:5000';
  if (isSubscribed) {
    fetch(pushServerUrl + '/sendNotification', {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        subscription: userSubscription,
        message: message,
        title: title,
      }),
    });
  } else {
    console.log('User is NOT subscribed.');
  }
}
