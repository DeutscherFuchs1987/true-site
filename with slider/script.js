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

    // ===== СЛАЙДЕР =====
    const slider = {
        slides: document.querySelectorAll('.slide'),
        dots: document.querySelectorAll('.slider-dot'),
        prevBtn: document.querySelector('.slider-prev'),
        nextBtn: document.querySelector('.slider-next'),
        currentSlide: 0,
        totalSlides: document.querySelectorAll('.slide').length,
        autoSlideInterval: null,
        autoSlideDelay: 5000, // 5 секунд
        
        init() {
            if (this.slides.length === 0) return;
            
            this.showSlide(this.currentSlide);
            this.startAutoSlide();
            
            // События для кнопок
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => this.prevSlide());
            }
            
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => this.nextSlide());
            }
            
            // События для точек
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            });
            
            // Пауза при наведении
            const sliderContainer = document.querySelector('.slider');
            if (sliderContainer) {
                sliderContainer.addEventListener('mouseenter', () => this.pauseAutoSlide());
                sliderContainer.addEventListener('mouseleave', () => this.startAutoSlide());
            }
            
            // Свайп для мобильных
            let touchStartX = 0;
            let touchEndX = 0;
            
            sliderContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                this.pauseAutoSlide();
            });
            
            sliderContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].clientX;
                const diffX = touchStartX - touchEndX;
                
                if (Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
                
                setTimeout(() => this.startAutoSlide(), 3000);
            });
        },
        
        showSlide(index) {
            // Скрываем все слайды
            this.slides.forEach(slide => {
                slide.classList.remove('active');
                slide.style.animationPlayState = 'paused';
            });
            
            // Убираем активный класс у всех точек
            this.dots.forEach(dot => dot.classList.remove('active'));
            
            // Показываем текущий слайд
            this.slides[index].classList.add('active');
            this.slides[index].style.animationPlayState = 'running';
            
            // Активируем соответствующую точку
            if (this.dots[index]) {
                this.dots[index].classList.add('active');
            }
            
            this.currentSlide = index;
            this.updateARIA();
        },
        
        nextSlide() {
            let newIndex = this.currentSlide + 1;
            if (newIndex >= this.totalSlides) {
                newIndex = 0;
            }
            this.showSlide(newIndex);
            this.resetAutoSlide();
        },
        
        prevSlide() {
            let newIndex = this.currentSlide - 1;
            if (newIndex < 0) {
                newIndex = this.totalSlides - 1;
            }
            this.showSlide(newIndex);
            this.resetAutoSlide();
        },
        
        goToSlide(index) {
            if (index >= 0 && index < this.totalSlides) {
                this.showSlide(index);
                this.resetAutoSlide();
            }
        },
        
        startAutoSlide() {
            if (this.autoSlideInterval) return;
            
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, this.autoSlideDelay);
        },
        
        pauseAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        },
        
        resetAutoSlide() {
            this.pauseAutoSlide();
            this.startAutoSlide();
        },
        
        updateARIA() {
            this.slides.forEach((slide, index) => {
                slide.setAttribute('aria-hidden', index !== this.currentSlide);
                slide.setAttribute('aria-label', `Слайд ${index + 1}`);
            });
            
            this.dots.forEach((dot, index) => {
                dot.setAttribute('aria-current', index === this.currentSlide ? 'true' : 'false');
            });
        }
    };
    
    // Инициализация слайдера
    slider.init();

    // ===== СКРЫТИЕ/ПОКАЗ ХЕДЕРА ПРИ СКРОЛЛЕ =====
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 70) {
            header.classList.add('hidden');
        } else {
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
        document.body.style.overflow = 'hidden';
        modal.classList.add('active');
    }
    
    function closeModal(modal) {
        document.body.style.overflow = '';
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

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

    // ===== ПЕРЕКЛЮЧЕНИЕ МЕЖДУ ОКНАМИ ВХОДА И РЕГИСТРАЦИИ =====
    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        setTimeout(() => openModal(registerModal), 300);
    });
    
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(registerModal);
        setTimeout(() => openModal(loginModal), 300);
    });

    // ===== ВАЛИДАЦИЯ ФОРМЫ РЕГИСТРАЦИИ =====
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
            
            // Симуляция отправки
            const submitBtn = this.querySelector('.btn--primary');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Регистрация прошла успешно!');
                closeModal(registerModal);
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // ===== ВАЛИДАЦИЯ ФОРМЫ ВХОДА =====
    const loginForm = loginModal.querySelector('.auth-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Симуляция входа
            const submitBtn = this.querySelector('.btn--primary');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Вход выполнен успешно!');
                closeModal(loginModal);
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // ===== КЛАВИАТУРНАЯ НАВИГАЦИЯ ПО СЛАЙДЕРУ =====
    document.addEventListener('keydown', (e) => {
        const sliderContainer = document.querySelector('.slider');
        if (!sliderContainer) return;
        
        const rect = sliderContainer.getBoundingClientRect();
        const isSliderInView = (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
        
        if (isSliderInView) {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    slider.prevSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    slider.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    slider.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    slider.goToSlide(slider.totalSlides - 1);
                    break;
            }
        }
    });

    // ===== ПЛАВНЫЙ СКРОЛЛ ДЛЯ ССЫЛОК =====
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

    // ===== АНИМАЦИЯ СЛАЙДОВ ПРИ ЗАГРУЗКЕ =====
    function initSlideAnimations() {
        const slides = document.querySelectorAll('.slide');
        
        slides.forEach((slide, index) => {
            slide.style.animationDelay = `${index * 0.2}s`;
            
            const content = slide.querySelector('.slide-content');
            if (content) {
                content.style.opacity = '0';
                content.style.transform = 'translateY(30px)';
                content.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                
                const showContent = () => {
                    if (slide.classList.contains('active')) {
                        content.style.opacity = '1';
                        content.style.transform = 'translateY(0)';
                    }
                };
                
                showContent();
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.attributeName === 'class') {
                            showContent();
                        }
                    });
                });
                
                observer.observe(slide, { attributes: true });
            }
        });
    }
    
    initSlideAnimations();

});