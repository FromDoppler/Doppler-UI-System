$(document).ready(function() {
  var $userMenu = $('.user-menu'),
    $userMenuOpen = $('span.user-avatar'),
    $menuMainItem = $('.menu-main .submenu-item'),
    $submenuItem = $('.submenu-item .sub-menu li a'),
    $subMenu = $('.submenu-item .sub-menu'),
    $headerMain = $('.header-main');

  $('body').mouseup(function(e) {
    if (!$userMenu.is(e.target) && !$userMenuOpen.is(e.target) && $userMenu.has(e.target).length === 0) {
      $userMenu.removeClass('open');
    }
    if (!$subMenu.is(e.target) && $subMenu.has(e.target).length === 0) {
      $subMenu.removeClass('open');
      $('.header-main').removeClass('header-open');
    }
  });

  $menuMainItem.hover(function() {
    if ($('.menu-main .sub-menu').is(':visible')) {
      $headerMain.addClass('header-open');
    } else {
      $headerMain.removeClass('header-open');
    }
  });

  $menuMainItem.click(function() {
    $('.menu-main .submenu-item > a').removeClass('active');
    $('.sub-menu').removeClass('open');
    $(this).find('> a').addClass('active');
    $headerMain.addClass('header-open');
    $(this).find('.sub-menu').addClass('open');
  });

  $('.menu-main li a').click(function() {
    $('.menu-main li a').removeClass('active');
    $(this).addClass('active');
  });

  $('#user-menu--open').click(function() {
    $userMenu.toggleClass('open');
  });

  $submenuItem.click(function() {
    $('.submenu-item .sub-menu li a').removeClass('active');
    $(this).addClass('active');
  });

  $('#open-menu').click(function() {
    $headerMain.addClass('open');

  });
  $('#close-menu').click(function() {
    $headerMain.removeClass('open');

  });

});
