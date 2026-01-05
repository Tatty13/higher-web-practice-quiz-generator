const header = document.querySelector('.header');
const menu = header.querySelector('.header__menu');
const burgerBtn = header.querySelector('.burger-btn');
const menuLinks = header.querySelectorAll('.header__menu-link');

function toggleMenu() {
  menu.classList.toggle('header__menu_active');
  burgerBtn.classList.toggle('burger-btn_active');
}

function closeMenu() {
  menu.classList.remove('header__menu_active');
  burgerBtn.classList.remove('burger-btn_active');
}

burgerBtn.addEventListener('click', toggleMenu);
menuLinks.forEach((link) => link.addEventListener('click', closeMenu));

export {};
