var applicationServerPublicKey =
  'BFtBVunx6Lg_4ziA6b_Oe-9iqQetudiBzkukb1UOOWItZlbdPXCnMLjTfM6gnbmzrusaGlifwWWaFRWnef_H40Y';

var UI = {
  pushButton: document.querySelector('.js-push-btn'),
  notificationButton: document.querySelector('.js-send-notification'),
  notificationButtonInt: document.querySelector('.js-send-notification-int'),
  publicKeyInput: document.querySelector('#public-key'),
  addSubscribeBtnOnClickEvent: function () {
    UI.pushButton.addEventListener('click', function () {
      UI.pushButton.disabled = true;
      if (isSubscribed) {
        unsubscribeUser();
      } else {
        subscribeUserFirstTime();
      }
    });
  },
  updateSubscribeToPushBtn: function () {
    if (isSubscribed) {
      UI.pushButton.textContent = 'Deshabilitar Push';
      console.log('Web push: User is subscribed');
    } else {
      UI.pushButton.textContent = 'Habilitar Push';
      console.log('Web push: User is not subscribed');
    }
    UI.pushButton.disabled = false;
  },
};
UI.notificationButton.addEventListener('click', function () {
  if (isSubscribed) {
    sendRequestNotification('http://localhost:5000');
  } else {
    console.log('Web push: No esta suscripto a notificaciones');
  }
});

UI.notificationButtonInt.addEventListener('click', function () {
  if (isSubscribed) {
    sendRequestNotification('http://appint.fromdoppler.net:5001');
  } else {
    console.log('Web push: No esta suscripto a notificaciones');
  }
});

var isSubscribed = false;
var swRegistration = null;
var userSubscription = null;

registerWorker('sw.js');

//to enable registration for push notifications a worker must be registered on the page
function registerWorker(path) {
  if (navigator.serviceWorker && window.PushManager) {
    navigator.serviceWorker
      .register('sw.js')
      .then(function (swReg) {
        console.log('Web push: Service Worker is registered', swReg);
        swRegistration = swReg;
        UI.addSubscribeBtnOnClickEvent();
        getExistentSubscriptionCode(swRegistration);
      })
      .catch(function (error) {
        console.error('Web push: Service Worker Error', error);
      });
  } else {
    console.warn('Web push: Push messaging is not supported');
    UI.pushButton.textContent = 'Web push: Push Not Supported';
  }
}

function getExistentSubscriptionCode(swRegistration) {
  swRegistration.pushManager.getSubscription().then(function (subscription) {
    isSubscribed = !(subscription === null);

    saveSubscriptionCode(subscription);

    UI.updateSubscribeToPushBtn();
  });
}

function saveSubscriptionCode(subscription) {
  if (subscription) {
    userSubscription = subscription;
    console.log(
      'Web push: ' +
        JSON.stringify({
          subscription: userSubscription,
          title: 'Titulo del push',
          message: 'Mensaje del push',
        }),
    );
  }
}

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

function subscribeUserFirstTime() {
  var providedApplicationPublicKey =
    UI.publicKeyInput.value || applicationServerPublicKey;
  var applicationServerKey = urlB64ToUint8Array(providedApplicationPublicKey);
  swRegistration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    })
    .then(function (subscription) {
      console.log('Web push: User is subscribed:', subscription);

      saveSubscriptionCode(subscription);

      isSubscribed = true;

      UI.updateSubscribeToPushBtn();
    })
    .catch(function (err) {
      console.log('Web push: Failed to subscribe the user: ', err);
      UI.updateSubscribeToPushBtn();
    });
}

function unsubscribeUser() {
  if (userSubscription) {
    console.log(userSubscription);
    userSubscription.unsubscribe();
    saveSubscriptionCode(null);

    console.log('Web push: User is unsubscribed.');
    isSubscribed = false;

    UI.updateSubscribeToPushBtn();
  }
}

function sendRequestNotification(pushServerUrl) {
  var message =
    document.querySelector('#notification-message').value || 'mensaje push';
  var title =
    document.querySelector('#notification-title').value || 'Doppler Push';
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
    console.log('Web push: User is NOT subscribed.');
  }
}
