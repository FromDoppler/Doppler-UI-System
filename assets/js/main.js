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

// modals

$("#btn-modal-large").click(function() {
  $("#modal-large").fadeIn(500);
});
$("#btn-modal-medium").click(function() {
  $("#modal-medium").fadeIn(500);
});
$("#btn-modal-small").click(function() {
  $("#modal-small").fadeIn(500);
});
$(".modal .close").click(function() {
  $(".modal").fadeOut();
});
