$("body").on({
  mouseenter: function() {
    if ($('.menu-main .sub-menu').is(':visible')) {
      $('.header-main').addClass('header-open');
    }  
  },
  mouseleave: function() {
    if (!$('.menu-main .sub-menu').is(':visible')) {
      $('.header-main').removeClass('header-open');
    }
  }
}, ".menu-main .submenu-item");

$("body").on('click', '#user-menu--open', function(){
  $('.user-menu').toggleClass('open');
});

$("body").on('click', '#open-menu', function(){
  $('.header-main').addClass('open');
});

$("body").on('click', '#close-menu', function(){
  $('.header-main').removeClass('open');
});