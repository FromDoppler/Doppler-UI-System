$('body').on({
  mouseenter: function() {
    var submenu = $(this).find(".sub-menu");

    if(!$(this).hasClass('submenu-item')) {
      $('.header-main').removeClass('header-open');
    }

    if (submenu[0] && submenu[0].children.length) {
      $('.header-main').addClass('header-open');
    }
  },
  mouseleave: function() {
    if(!$(this).hasClass('submenu-item')) {
      $('.header-main').addClass('header-open');
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
