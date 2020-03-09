$('body').on({
  mouseenter: function() {
    var submenu = $(this).find(".sub-menu");

    if(!$(this).hasClass('submenu-item')) {
      $('.header-main').removeClass('header-open');
    }

    if (submenu[0] && submenu[0].children.length) {
      $('.header-main').addClass('header-open');
    } else {
      $('.sub-menu.open').removeClass('open');
    }
  },
  mouseleave: function() {
    if ($('.header-main .submenu-item > a.active').length > 0){
      $('.header-main').addClass('header-open');
      $('.header-main .submenu-item > a.active + .sub-menu').addClass('open');
    } else {
      $('.header-main').removeClass('header-open');
    }
  }
}, '.menu-main>li');

$("body").on('click', '.user-menu--open', function() {
  $(this).parent().find('.user-menu').toggleClass('open');
});

$("body").on('click', '#open-menu', function() {
  $('.header-main').addClass('open');
});

$("body").on('click', '#close-menu', function() {
  $('.header-main').removeClass('open');
});

$("body").on('click', '.close-user--menu', function() {
  $('.user-menu').removeClass('open');
});

$(document).on('mouseup', function(e) {
  var menu = $(".user-menu");
  if (!menu.is(e.target) && menu.has(e.target).length === 0) {
    menu.removeClass('open');
  }
});

// modals
var $delayFade = 500;
//Initialize all modals hidden
$("#modal-large, #modal-medium, #modal-small").hide();

$("#btn-modal-large").click(function() {
  $("#modal-large").fadeIn($delayFade);
});
$("#btn-modal-medium").click(function() {
  $("#modal-medium").fadeIn($delayFade);
});
$("#btn-modal-small").click(function() {
  $("#modal-small").fadeIn($delayFade);
});
$(".modal .close").click(function() {
  $(".modal").fadeOut();
});

// This script is ONLY to DEMONSTRATE how to show and hide password, not use in production
$(".show-hide").click(function() {
  $(this).toggleClass("ms-icon icon-hide");
  var input = $($(this).attr("toggle"));

  if (input.attr("type") == "password") {
    input.attr("type", "text");
    $('span.content-eye').text('Ocultar');
    $(this).removeClass("ms-icon icon-view").addClass("ms-icon icon-hide");
  } else {
    input.attr("type", "password");
    $('span.content-eye').text('Mostrar');
    $(this).removeClass("ms-icon icon-hide").addClass("ms-icon icon-view");
  }
});


  $('.dp-number-campaign').each(function(){
    $(this).prop('Counter',0).animate({
      Counter: $(this).text()
    },{
      duration: 3500,
      easing: 'swing',
      step: function (now){
        $(this).text(Math.ceil(now).toFixed(1));
      }
    });
  });

/*** Web push test ****/
const applicationServerPublicKey = 'BFtBVunx6Lg_4ziA6b_Oe-9iqQetudiBzkukb1UOOWItZlbdPXCnMLjTfM6gnbmzrusaGlifwWWaFRWnef_H40Y';

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

if (navigator.serviceWorker &&  window.PushManager) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
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
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
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

navigator.serviceWorker.register('sw.js')
.then(function(swReg) {
  console.log('Service Worker is registered', swReg);

  swRegistration = swReg;
  initialiseUI();
})

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
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
  // TODO: Send subscription to application server

  const subscriptionJson = document.querySelector('.js-subscription-json');

  if (subscription) {
    console.log("json for google page subscription back end: https://web-push-codelab.glitch.me// "+JSON.stringify(subscription)); 
  }
}

function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
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
