// script.js
document.addEventListener('DOMContentLoaded', function() {

    // ===== ПЕРЕМЕННЫЕ ДЛЯ ЭЛЕМЕНТОВ =====
    const header = document.getElementById('header');
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const mobileRegisterBtn = document.getElementById('mobileRegisterBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeRegisterModal = document.getElementById('closeRegisterModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalOverlayReg = document.getElementById('modalOverlayReg');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');

    // ===== СКРЫТИЕ/ПОКАЗ ХЕДЕРА ПРИ СКРОЛЛЕ =====
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 70) {
            // Скролл вниз > 70px -> скрываем хедер
            header.classList.add('hidden');
        } else {
            // Скролл вверх -> показываем хедер
            header.classList.remove('hidden');
        }
        lastScrollTop = scrollTop;
    });

    // ===== БУРГЕР-МЕНЮ =====
    burgerBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        this.setAttribute('aria-expanded', this.classList.contains('active'));
    });

    // Закрытие мобильного меню при клике на ссылку
    document.querySelectorAll('.mobile-nav__link').forEach(link => {
        link.addEventListener('click', () => {
            burgerBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            burgerBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // ===== ФУНКЦИИ ДЛЯ МОДАЛЬНЫХ ОКОН =====
    function openModal(modal) {
        document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
        modal.classList.add('active');
    }
    function closeModal(modal) {
        document.body.style.overflow = ''; // Возвращаем скролл
        modal.classList.remove('active');
    }
    function closeAllModals() {
        closeModal(loginModal);
        closeModal(registerModal);
    }

    // ===== ОТКРЫТИЕ МОДАЛОК ВХОДА =====
    loginBtn.addEventListener('click', () => openModal(loginModal));
    mobileLoginBtn.addEventListener('click', () => {
        openModal(loginModal);
        burgerBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
    });

    // ===== ОТКРЫТИЕ МОДАЛОК РЕГИСТРАЦИИ =====
    registerBtn.addEventListener('click', () => openModal(registerModal));
    mobileRegisterBtn.addEventListener('click', () => {
        openModal(registerModal);
        burgerBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
    });

    // ===== ЗАКРЫТИЕ МОДАЛОК =====
    closeLoginModal.addEventListener('click', () => closeModal(loginModal));
    closeRegisterModal.addEventListener('click', () => closeModal(registerModal));
    modalOverlay.addEventListener('click', () => closeModal(loginModal));
    modalOverlayReg.addEventListener('click', () => closeModal(registerModal));

    // Закрытие модалок по клавише Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

    // ===== ПЕРЕКЛЮЧЕНИЕ МЕЖДУ ОКНАМИ ВХОДА И РЕГИСТРАЦИИ =====
    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        setTimeout(() => openModal(registerModal), 300); // Небольшая задержка для плавности
    });
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(registerModal);
        setTimeout(() => openModal(loginModal), 300);
    });

    // ===== ПРОСТАЯ ВАЛИДАЦИЯ ФОРМЫ РЕГИСТРАЦИИ (ДЛЯ ПРИМЕРА) =====
    const regForm = registerModal.querySelector('.auth-form');
    if (regForm) {
        regForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regPasswordConfirm').value;
            if (password !== confirmPassword) {
                alert('Пароли не совпадают!');
                return;
            }
            // Здесь обычно AJAX запрос на сервер
            alert('Регистрация прошла успешно (заглушка)!');
            closeModal(registerModal);
            this.reset();
        });
    }

    // ===== ВАЛИДАЦИЯ ФОРМЫ ВХОДА (ЗАГЛУШКА) =====
    const loginForm = loginModal.querySelector('.auth-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Здесь обычно AJAX запрос на сервер
            alert('Вход выполнен (заглушка)!');
            closeModal(loginModal);
            this.reset();
        });
    }

    // ===== ПЛАВНЫЙ СКРОЛЛ ДЛЯ ССЫЛОК ВНУТРИ СТРАНИЦЫ =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

});