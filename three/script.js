// ДОБАВЛЯЕМ К СУЩЕСТВУЮЩЕМУ КОДУ:

document.addEventListener('DOMContentLoaded', function() {
    // ... существующий код ...
    
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
            
            // Инициализация
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
            const sliderContainer = document.querySelector('.hero-slider');
            if (sliderContainer) {
                sliderContainer.addEventListener('mouseenter', () => this.pauseAutoSlide());
                sliderContainer.addEventListener('mouseleave', () => this.startAutoSlide());
            }
            
            // События для тач-устройств
            sliderContainer?.addEventListener('touchstart', (e) => {
                this.touchStartX = e.touches[0].clientX;
                this.pauseAutoSlide();
            });
            
            sliderContainer?.addEventListener('touchend', (e) => {
                if (!this.touchStartX) return;
                
                const touchEndX = e.changedTouches[0].clientX;
                const diffX = this.touchStartX - touchEndX;
                
                if (Math.abs(diffX) > 50) { // Минимальное расстояние свайпа
                    if (diffX > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
                
                this.touchStartX = null;
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
            
            // Обновляем индекс текущего слайда
            this.currentSlide = index;
            
            // Обновляем ARIA атрибуты
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
    
    // Инициализируем слайдер
    slider.init();
    
    // ===== АНИМАЦИЯ СЛАЙДОВ ПРИ ЗАГРУЗКЕ =====
    function initSlideAnimations() {
        const slides = document.querySelectorAll('.slide');
        
        slides.forEach((slide, index) => {
            // Добавляем задержку для анимации появления
            slide.style.animationDelay = `${index * 0.2}s`;
            
            // Анимация для контента слайда
            const content = slide.querySelector('.slide-content');
            if (content) {
                content.style.opacity = '0';
                content.style.transform = 'translateY(30px)';
                content.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                
                // Показываем контент при активации слайда
                const showContent = () => {
                    if (slide.classList.contains('active')) {
                        content.style.opacity = '1';
                        content.style.transform = 'translateY(0)';
                    }
                };
                
                // Проверяем сразу и при изменении
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
    
    // ===== ПАРАЛЛАКС ЭФФЕКТ ДЛЯ СЛАЙДОВ =====
    function initParallax() {
        const sliderSection = document.querySelector('.hero-slider');
        if (!sliderSection) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            document.querySelectorAll('.slide-bg').forEach(bg => {
                bg.style.transform = `translate3d(0, ${rate}px, 0)`;
            });
        });
    }
    
    // Инициализируем параллакс на десктопе
    if (window.innerWidth > 768) {
        initParallax();
    }
    
    // ===== ЛЕНИВАЯ ЗАГРУЗКА ИЗОБРАЖЕНИЙ СЛАЙДОВ =====
    function lazyLoadSliderImages() {
        const slides = document.querySelectorAll('.slide');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const slide = entry.target;
                    const bg = slide.querySelector('.slide-bg');
                    
                    if (bg && bg.getAttribute('data-src')) {
                        bg.style.backgroundImage = bg.getAttribute('data-src');
                        bg.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(slide);
                }
            });
        }, { threshold: 0.1 });
        
        slides.forEach(slide => imageObserver.observe(slide));
    }
    
    // Если используете data-src для ленивой загрузки
    lazyLoadSliderImages();
    
    // ===== КЛАВИАТУРНАЯ НАВИГАЦИЯ ПО СЛАЙДЕРУ =====
    document.addEventListener('keydown', (e) => {
        const sliderContainer = document.querySelector('.hero-slider');
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
    
    // ... остальной существующий код ...
});