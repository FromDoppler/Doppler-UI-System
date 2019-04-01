$("body").on({
  mouseenter: function() {
    var submenu = $(this).find(".sub-menu");

    if (submenu && submenu[0].children.length) {
      $('.header-main').addClass('header-open');
    }
  },
  mouseleave: function() {
    $('.header-main').removeClass('header-open');
  }
}, ".menu-main .submenu-item");

$("body").on('click', '#user-menu--open', function() {
  $('.user-menu').toggleClass('open');
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

$(document).on('mouseup', function(e){
  var menu = $(".user-menu");

  if (!menu.is(e.target) && menu.has(e.target).length === 0){
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

// Input phone number

  var inputPhone = document.querySelector(".phone-number"),
      errorMsg = document.querySelector(".error-phone-number");

  var errorMap = [
    "Número inválido",
    "Código de area inválido",
    "Muy corto",
    "Muy largo",
    "Número inválido"
  ];

// initialise plugin

  var iti = window.intlTelInput(inputPhone, {
    separateDialCode: true,
    initialCountry: "auto",
    hiddenInput: "full_phone",
    geoIpLookup: function(callback) {
      $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
        var countryCode = (resp && resp.country) ? resp.country : "";
        callback(countryCode);
      });
    },
    utilsScript: "../js/main.js"
  });

  var reset = function() {
    inputPhone.classList.remove("error");
    errorMsg.innerHTML = "";
    errorMsg.classList.add("hide");
  };

  // on blur: validate
  inputPhone.addEventListener('blur', function() {
    reset();

    if (inputPhone.value.trim()) {
      if (iti.isValidNumber()) {
        $(inputPhone).closest('.field-item').removeClass('error');
      } else {

        inputPhone.classList.add("error");
        var errorCode = iti.getValidationError();
        $(inputPhone).closest('.field-item').attr('data-error', errorMap[errorCode]);
        $(inputPhone).closest('.field-item').find('.error-phone-number').text(errorMap[errorCode]);
        $(inputPhone).closest('.field-item').addClass('error');
      }
    } else {
      $(inputPhone).closest('.field-item').removeClass('error');
    }
  });

  inputPhone.addEventListener('change', reset);
  inputPhone.addEventListener('keyup', reset);
