export function initializeHeroCarousel() {
    const carousel = document.querySelector('.hero-carousel');
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!carousel || slides.length === 0) return;

    let currentSlide = 0;
    let autoplayInterval;
    let isPlaying = true;
    
    // Performance: Use RAF for smooth animations
    let animationId;
    
    // Accessibility: Pause on focus/hover
    const pauseAutoplay = () => {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
            isPlaying = false;
        }
    };
    
    const resumeAutoplay = () => {
        if (!isPlaying) {
            startAutoplay();
        }
    };

    // Create dots with accessibility
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Ir para slide ${index + 1}`);
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
            dot.setAttribute('aria-selected', index === currentSlide ? 'true' : 'false');
        });
    }

    function goToSlide(slideIndex) {
        // Performance: Cancel previous animation
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        
        slides[currentSlide].classList.remove('active');
        currentSlide = slideIndex;
        
        animationId = requestAnimationFrame(() => {
            slides[currentSlide].classList.add('active');
            updateDots();
        });
        
        resetInterval();
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prev);
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
        isPlaying = true;
    }

    function resetInterval() {
        pauseAutoplay();
        startAutoplay();
    }

    // Event listeners with accessibility
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
        prevBtn.addEventListener('focus', pauseAutoplay);
        prevBtn.addEventListener('blur', resumeAutoplay);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
        nextBtn.addEventListener('focus', pauseAutoplay);
        nextBtn.addEventListener('blur', resumeAutoplay);
    }

    // Pause on hover/focus
    carousel.addEventListener('mouseenter', pauseAutoplay);
    carousel.addEventListener('mouseleave', resumeAutoplay);
    carousel.addEventListener('focusin', pauseAutoplay);
    carousel.addEventListener('focusout', resumeAutoplay);

    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        }
    });

    // Touch/swipe support
    let startX = 0;
    let endX = 0;

    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        pauseAutoplay();
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
        const diff = startX - endX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        resumeAutoplay();
    });

    // Performance: Pause autoplay when page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            pauseAutoplay();
        } else {
            resumeAutoplay();
        }
    });

    // Initialize
    updateDots();
    startAutoplay();
    carousel.classList.add('loaded');
} 