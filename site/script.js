// HEADER SHOW / HIDE
let lastScroll = 0;
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  const current = window.scrollY;
  header.style.transform = current > lastScroll ? 'translateY(-100%)' : 'translateY(0)';
  lastScroll = current;
});

// BURGER MENU
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.onclick = () => {
  mobileMenu.style.display =
    mobileMenu.style.display === 'flex' ? 'none' : 'flex';
};

// MODALS
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');

document.getElementById('loginBtn').onclick = () => loginModal.style.display = 'flex';
document.getElementById('registerBtn').onclick = () => registerModal.style.display = 'flex';

document.querySelectorAll('.modal__close').forEach(btn => {
  btn.onclick = () => btn.closest('.modal').style.display = 'none';
});

// SLIDER
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove('active'));
  slides[index].classList.add('active');
}

document.querySelector('.next').onclick = () => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
};

document.querySelector('.prev').onclick = () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
};

setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 6000);
