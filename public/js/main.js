// Evmaria Services - Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initSmoothScrolling();
    initContactForm();
    initScrollEffects();
    initAnimations();
    initDropdowns();
    initFAQ();
    initPopupModal();
    initHeroSlider();
    initCampGalleries();
    initTestimonialsLightbox();
    initMobileTestimonialsSlideshow();
});

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');
    
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
    }
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Disable native browser validation bubbles; use custom validation instead
        contactForm.setAttribute('novalidate', '');
        
        // Only show field errors after user attempts to submit
        let validationActive = false;
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get submit button and show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                // Get form data
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);
                
                // Enhanced validation
                const requiredFields = ['firstName', 'lastName', 'email', 'country', 'program', 'message'];
                const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
                
                if (missingFields.length > 0) {
                    validationActive = true;
                    // Mark all missing required fields with an error
                    missingFields.forEach(fieldName => {
                        const fieldEl = contactForm.querySelector(`[name="${fieldName}"]`);
                        if (fieldEl) {
                            showFieldError(fieldEl, 'This field is required.');
                        }
                    });
                    showNotification('Please fill in all required fields.', 'error');
                    return;
                }
                
                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    validationActive = true;
                    const emailField = contactForm.querySelector('[name="email"]');
                    if (emailField) showFieldError(emailField, 'Please enter a valid email address.');
                    showNotification('Please enter a valid email address.', 'error');
                    return;
                }
                
                // Phone validation (if provided)
                if (data.phone && data.phone.trim() !== '') {
                    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                    if (!phoneRegex.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
                        validationActive = true;
                        const phoneField = contactForm.querySelector('[name="phone"]');
                        if (phoneField) showFieldError(phoneField, 'Please enter a valid phone number.');
                        showNotification('Please enter a valid phone number.', 'error');
                        return;
                    }
                }
                
                // Privacy policy validation
                if (!data.privacy) {
                    validationActive = true;
                    const privacyField = contactForm.querySelector('[name="privacy"]');
                    if (privacyField) showFieldError(privacyField, 'Please accept the Privacy Policy.');
                    showNotification('Please accept the Privacy Policy to continue.', 'error');
                    return;
                }
                
                // Send form data to server
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showNotification(result.message, 'success');
                    this.reset();
                    
                    // Scroll to top to show success message
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    showNotification(result.message, 'error');
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                showNotification('Sorry, there was an error sending your message. Please try again later or contact us directly.', 'error');
            } finally {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
        
        // Real-time validation (only after first failed submit)
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (!validationActive) return;
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (!validationActive) return;
                clearFieldError(this);
            });
        });
    }
}

// Field validation function
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Clear previous error
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required.');
        return false;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address.');
            return false;
        }
    }
    
    // Phone validation
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number.');
            return false;
        }
    }
    
    return true;
}

// Show field error
function showFieldError(field, message) {
    // Remove existing error
    clearFieldError(field);
    
    // Add error class
    field.classList.add('error');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #f44336;
        font-size: 0.875rem;
        margin-top: 5px;
        display: block;
    `;
    
    // Insert error message after field
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Scroll Effects
function initScrollEffects() {
    const header = document.querySelector('.site-header');
    const nav = document.querySelector('.main-nav');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    let lastScrollTop = 0;
    let isClosingMenu = false;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header background effect
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
            
            // Close mobile navigation menu when scrolling down (header hides)
            if (nav && mobileToggle && nav.classList.contains('active') && !isClosingMenu) {
                isClosingMenu = true;
                
                // Remove active class to trigger CSS animation
                nav.classList.remove('active');
                mobileToggle.classList.remove('active');
                
                // Reset flag after animation completes
                setTimeout(() => {
                    isClosingMenu = false;
                }, 300);
            }
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Animations on Scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.program-card, .feature-item, .testimonial-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Dropdown Functionality
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        const triggerLink = dropdown.querySelector('a.nav-link');
        
        // Desktop hover
        dropdown.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.transform = 'translateY(0)';
            }
        });
        
        dropdown.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
            }
        });
        
        // Mobile: disable dropdown behavior and allow direct navigation
        if (triggerLink) {
            triggerLink.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    // Close mobile nav after navigation intent
                    const nav = document.querySelector('.main-nav');
                    const mobileToggle = document.querySelector('.mobile-menu-toggle');
                    if (nav && mobileToggle) {
                        nav.classList.remove('active');
                        mobileToggle.classList.remove('active');
                    }
                    // Let browser follow the link normally
                }
            });
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        font-size: 0.85rem;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Removed manual close button; notification auto-dismisses
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Search Functionality
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }
            
            // Simulate search results
            const results = [
                'UK Summer Camps',
                'Ireland Summer Camps',
                'Malta Summer Camps',
                'Scotland Summer Camps',
                'Contact Information',
                'Testimonials'
            ].filter(item => item.toLowerCase().includes(query));
            
            displaySearchResults(results);
        });
    }
}

function displaySearchResults(results) {
    const searchResults = document.querySelector('.search-results');
    
    if (results.length > 0) {
        searchResults.innerHTML = results.map(result => 
            `<div class="search-result-item">${result}</div>`
        ).join('');
        searchResults.style.display = 'block';
    } else {
        searchResults.style.display = 'none';
    }
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Parallax Effect for Hero Section
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    // Make hero static on all pages
    hero.style.transform = '';
}

// Hero slider (simple, dependency-free)
function initHeroSlider() {
    const slider = document.querySelector('.hero-slider .slider');
    if (!slider) return;
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const prevBtn = document.querySelector('.hero-slider .slider-arrow.prev');
    const nextBtn = document.querySelector('.hero-slider .slider-arrow.next');
    const dotsContainer = document.querySelector('.hero-slider .slider-dots');

    let current = 0;
    let intervalId = null;
    const AUTOPLAY_MS = 5000;

    // Build dots
    slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
        dot.addEventListener('click', () => goTo(idx));
        dotsContainer.appendChild(dot);
    });

    function updateUI() {
        slides.forEach((s, i) => s.classList.toggle('active', i === current));
        const dots = dotsContainer.querySelectorAll('button');
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function goTo(index) {
        current = (index + slides.length) % slides.length;
        updateUI();
        restartAutoplay();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    // Controls
    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    // Autoplay
    function startAutoplay() {
        stopAutoplay();
        intervalId = setInterval(next, AUTOPLAY_MS);
    }
    function stopAutoplay() {
        if (intervalId) clearInterval(intervalId);
        intervalId = null;
    }
    function restartAutoplay() {
        startAutoplay();
    }

    // Pause on hover (desktop)
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    // Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const SWIPE_THRESHOLD = 50;
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const delta = touchEndX - touchStartX;
        if (Math.abs(delta) > SWIPE_THRESHOLD) {
            if (delta < 0) next(); else prev();
        }
    });

    // Init
    updateUI();
    startAutoplay();
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initSearch();
    initLazyLoading();
    initParallax();
    
    // Animate counters when they come into view
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    });
    
    const counterSection = document.querySelector('.counters-section');
    if (counterSection) {
        counterObserver.observe(counterSection);
    }
});

// Camp Galleries (slider + lightbox)
function initCampGalleries() {
    const galleries = document.querySelectorAll('.camp-gallery');
    if (!galleries.length) return;

    galleries.forEach(gallery => {
        const track = gallery.querySelector('.camp-gallery-track');
        const slides = Array.from(gallery.querySelectorAll('.camp-gallery-slide'));
        const prevBtn = gallery.querySelector('.nav-prev');
        const nextBtn = gallery.querySelector('.nav-next');
        const dotsContainer = gallery.querySelector('.camp-gallery-dots');
        if (!track || !slides.length) return;

        let current = 0;

        // Dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            slides.forEach((_, idx) => {
                const dot = document.createElement('button');
                dot.addEventListener('click', () => goTo(idx));
                dotsContainer.appendChild(dot);
            });
        }

        function updateUI() {
            track.style.transform = `translateX(-${current * 100}%)`;
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('button');
                dots.forEach((d, i) => d.classList.toggle('active', i === current));
            }
        }

        function goTo(index) {
            current = (index + slides.length) % slides.length;
            updateUI();
        }

        function next() { goTo(current + 1); }
        function prev() { goTo(current - 1); }

        if (nextBtn) nextBtn.addEventListener('click', next);
        if (prevBtn) prevBtn.addEventListener('click', prev);

        // Lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'camp-lightbox';
        lightbox.innerHTML = `
            <div class="camp-lightbox-content">
                <button class="lb-close" aria-label="Close">&times;</button>
                <button class="lb-btn lb-prev" aria-label="Previous"><i class="fa fa-chevron-left"></i></button>
                <img alt="Camp photo" />
                <button class="lb-btn lb-next" aria-label="Next"><i class="fa fa-chevron-right"></i></button>
            </div>
        `;
        document.body.appendChild(lightbox);
        ensureLightboxStyles();
        const lbImg = lightbox.querySelector('img');
        const lbPrev = lightbox.querySelector('.lb-prev');
        const lbNext = lightbox.querySelector('.lb-next');
        const lbClose = lightbox.querySelector('.lb-close');

        function openLightbox(index) {
            current = index;
            lbImg.src = slides[current].querySelector('img').src;
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
        }

        lbPrev.addEventListener('click', () => { prev(); lbImg.src = slides[current].querySelector('img').src; });
        lbNext.addEventListener('click', () => { next(); lbImg.src = slides[current].querySelector('img').src; });
        lbClose.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') { prev(); lbImg.src = slides[current].querySelector('img').src; }
            if (e.key === 'ArrowRight') { next(); lbImg.src = slides[current].querySelector('img').src; }
        });

        // Open on click
        slides.forEach((slide, idx) => {
            slide.addEventListener('click', () => openLightbox(idx));
        });

        // Init
        updateUI();
    });
}

// Testimonials Gallery Lightbox (uses the same lightbox UI as camps)
function initTestimonialsLightbox() {
    const galleryItems = document.querySelectorAll('.partner-gallery .gallery-item');
    if (!galleryItems.length) return;

    // Full list of testimonial images (52)
    const testimonialImages = [
        'images/TESTIMONIALS/E1.jpg',
        'images/TESTIMONIALS/E2.jpg',
        'images/TESTIMONIALS/E3.jpg',
        'images/TESTIMONIALS/E4.jpg',
        'images/TESTIMONIALS/ELB10.jpg',
        'images/TESTIMONIALS/ELB11.jpg',
        'images/TESTIMONIALS/ELB13.jpg',
        'images/TESTIMONIALS/ELB14.jpg',
        'images/TESTIMONIALS/ELB15.jpg',
        'images/TESTIMONIALS/ELB18.jpg',
        'images/TESTIMONIALS/ELB19.jpg',
        'images/TESTIMONIALS/ELB20.jpg',
        'images/TESTIMONIALS/ELB21.jpg',
        'images/TESTIMONIALS/ELB22.jpg',
        'images/TESTIMONIALS/ELB23.jpg',
        'images/TESTIMONIALS/ELB25.jpg',
        'images/TESTIMONIALS/ELB26.jpg',
        'images/TESTIMONIALS/ELB3.jpg',
        'images/TESTIMONIALS/ELB31.jpg',
        'images/TESTIMONIALS/ELB35.jpg',
        'images/TESTIMONIALS/ELB36.jpg',
        'images/TESTIMONIALS/ELB37.jpg',
        'images/TESTIMONIALS/ELB38.jpg',
        'images/TESTIMONIALS/ELB39.jpg',
        'images/TESTIMONIALS/ELB40.jpg',
        'images/TESTIMONIALS/ELB41.jpg',
        'images/TESTIMONIALS/ELB42.jpg',
        'images/TESTIMONIALS/ELB44.jpg',
        'images/TESTIMONIALS/ELB45.jpg',
        'images/TESTIMONIALS/ELB46.jpg',
        'images/TESTIMONIALS/ELB48.jpg',
        'images/TESTIMONIALS/ELB49.jpg',
        'images/TESTIMONIALS/ELB50.jpg',
        'images/TESTIMONIALS/ELB51.jpg',
        'images/TESTIMONIALS/ELB52.jpg',
        'images/TESTIMONIALS/ELB53.jpg',
        'images/TESTIMONIALS/ELB54.jpg',
        'images/TESTIMONIALS/ELB55.jpg',
        'images/TESTIMONIALS/ELB56.jpg',
        'images/TESTIMONIALS/ELB57.jpg',
        'images/TESTIMONIALS/ELB6.jpg',
        'images/TESTIMONIALS/ELB70.jpg',
        'images/TESTIMONIALS/ELB72.jpg',
        'images/TESTIMONIALS/ELB73.jpg',
        'images/TESTIMONIALS/ELB9.jpg',
        'images/TESTIMONIALS/K1.jpg',
        'images/TESTIMONIALS/K2.jpg',
        'images/TESTIMONIALS/K3.jpg',
        'images/TESTIMONIALS/K4.jpg',
        'images/TESTIMONIALS/K5.jpg',
        'images/TESTIMONIALS/K6.jpg',
        'images/TESTIMONIALS/K7.jpg'
    ];

    let current = 0;

    // Build or reuse lightbox UI
    let lightbox = document.querySelector('.camp-lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'camp-lightbox';
        lightbox.innerHTML = `
            <div class="camp-lightbox-content">
                <button class="lb-close" aria-label="Close">&times;</button>
                <button class="lb-btn lb-prev" aria-label="Previous"><i class="fa fa-chevron-left"></i></button>
                <img alt="Testimonial photo" />
                <button class="lb-btn lb-next" aria-label="Next"><i class="fa fa-chevron-right"></i></button>
            </div>
        `;
        document.body.appendChild(lightbox);
    }

    const lbImg = lightbox.querySelector('img');
    const lbPrev = lightbox.querySelector('.lb-prev');
    const lbNext = lightbox.querySelector('.lb-next');
    const lbClose = lightbox.querySelector('.lb-close');
    ensureLightboxStyles();

    function update() {
        lbImg.src = testimonialImages[current];
    }

    function open(index) {
        current = (index + testimonialImages.length) % testimonialImages.length;
        update();
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    function next() { current = (current + 1) % testimonialImages.length; update(); }
    function prev() { current = (current - 1 + testimonialImages.length) % testimonialImages.length; update(); }

    // Bind controls (bind once)
    if (!lightbox.dataset.bound) {
        lbPrev.addEventListener('click', prev);
        lbNext.addEventListener('click', next);
        lbClose.addEventListener('click', close);
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        });
        lightbox.dataset.bound = 'true';
    }

    // Open on any gallery item click
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            const src = img.getAttribute('src') || '';
            const idx = testimonialImages.findIndex(path => src.endsWith(path));
            open(idx >= 0 ? idx : 0);
        });
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for potential use in other scripts
window.EvmariaUtils = {
    showNotification,
    debounce,
    throttle
}; 

// Inject or ensure themed styles for lightbox controls (once)
function ensureLightboxStyles() {
    if (document.getElementById('lightbox-theme-styles')) return;
    const style = document.createElement('style');
    style.id = 'lightbox-theme-styles';
    style.textContent = `
      .camp-lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: none; align-items: center; justify-content: center; z-index: 10000; }
      .camp-lightbox.open { display: flex; }
      .camp-lightbox-content { position: relative; max-width: 90vw; max-height: 90vh; }
      .camp-lightbox-content img { max-width: 100%; max-height: 90vh; display: block; border-radius: 8px; }
      .camp-lightbox .lb-btn, .camp-lightbox .lb-close { position: absolute; background: #2f3552; color: #fff; border: none; border-radius: 999px; width: 44px; height: 44px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 8px 24px rgba(0,0,0,0.3); transition: transform 0.12s ease, background 0.2s ease; }
      .camp-lightbox .lb-prev { left: -56px; top: 50%; transform: translateY(-50%); }
      .camp-lightbox .lb-next { right: -56px; top: 50%; transform: translateY(-50%); }
      .camp-lightbox .lb-close { top: -56px; right: 0; font-size: 24px; line-height: 1; }
      .camp-lightbox .lb-btn:hover { background: #3a4060; transform: translateY(calc(-50% - 2px)); }
      .camp-lightbox .lb-close:hover { background: #3a4060; transform: translateY(-1px); }
      @media (max-width: 768px) {
        .camp-lightbox .lb-prev { left: 8px; }
        .camp-lightbox .lb-next { right: 8px; }
        .camp-lightbox .lb-close { top: -52px; right: -4px; }
      }

      /* Unify slider button colors (mobile testimonials and camp galleries) with desktop theme */
      .mobile-testimonials-slideshow .slideshow-prev,
      .mobile-testimonials-slideshow .slideshow-next,
      .camp-gallery .nav-prev,
      .camp-gallery .nav-next {
        background: #2f3552 !important;
        color: #ffffff !important;
      }
      .mobile-testimonials-slideshow .slideshow-prev:hover,
      .mobile-testimonials-slideshow .slideshow-next:hover,
      .camp-gallery .nav-prev:hover,
      .camp-gallery .nav-next:hover {
        background: #3a4060 !important;
        color: #ffffff !important;
      }
    `;
    document.head.appendChild(style);
}
// Popup Modal Functionality
function initPopupModal() {
    const popupModal = document.getElementById('popup-modal');
    const popupClose = document.querySelector('.popup-close');
    
    if (popupModal && popupClose) {
        // Check if popup has been shown in this session
        const popupShown = sessionStorage.getItem('popupShown');
        
        if (!popupShown) {
            // Show popup after 15 seconds
            setTimeout(() => {
                popupModal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
                sessionStorage.setItem('popupShown', 'true');
            }, 15000);
        }
        
        // Close popup functionality
        popupClose.addEventListener('click', () => {
            popupModal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        });
        
        // Close popup when clicking outside
        popupModal.addEventListener('click', (e) => {
            if (e.target === popupModal) {
                popupModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
        
        // Close popup with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && popupModal.style.display === 'block') {
                popupModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
}

// Mobile Testimonials Slideshow
function initMobileTestimonialsSlideshow() {
    console.log('Initializing mobile testimonials slideshow...');
    const slideshow = document.querySelector('.mobile-testimonials-slideshow');
    console.log('Slideshow element found:', slideshow);
    
    if (!slideshow) {
        console.log('Mobile slideshow not found, skipping initialization');
        return;
    }
    
    const track = slideshow.querySelector('.slideshow-track');
    const slides = Array.from(slideshow.querySelectorAll('.slideshow-slide'));
    const prevBtn = slideshow.querySelector('.slideshow-prev');
    const nextBtn = slideshow.querySelector('.slideshow-next');
    const dotsContainer = slideshow.querySelector('.slideshow-dots');
    
    if (!track || !slides.length) return;
    
    let current = 0;
    let autoplayInterval = null;
    const AUTOPLAY_DELAY = 4000; // 4 seconds
    
    // Create dots
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }
    
    function updateSlideshow() {
        // Move track to show current slide
        track.style.transform = `translateX(-${current * 100}%)`;
        
        // Update dots
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === current);
            });
        }
    }
    
    function goToSlide(index) {
        current = (index + slides.length) % slides.length;
        updateSlideshow();
        restartAutoplay();
    }
    
    function nextSlide() {
        goToSlide(current + 1);
    }
    
    function prevSlide() {
        goToSlide(current - 1);
    }
    
    // Autoplay functionality
    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
    }
    
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }
    
    function restartAutoplay() {
        startAutoplay();
    }
    
    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
        });
    }
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const SWIPE_THRESHOLD = 50;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const delta = touchEndX - touchStartX;
        
        if (Math.abs(delta) > SWIPE_THRESHOLD) {
            if (delta < 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        } else {
            restartAutoplay();
        }
    }, { passive: true });
    
    // Pause autoplay on hover (for devices that support hover)
    slideshow.addEventListener('mouseenter', stopAutoplay);
    slideshow.addEventListener('mouseleave', startAutoplay);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Only handle keyboard events if slideshow is visible
        if (slideshow.offsetParent === null) return;
        
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        }
    });
    
    // Initialize
    updateSlideshow();
    startAutoplay();
    
    console.log('Mobile slideshow initialized successfully');
    console.log('Slideshow visible:', slideshow.offsetParent !== null);
    console.log('Current slide:', current);
    
    // Handle visibility change (pause when tab is not active)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });
}

// FAQ toggle functionality (moved from inline script)
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(function(q) {
        q.addEventListener('click', function() {
            // Toggle open class
            this.classList.toggle('open');
            // Toggle answer visibility
            var answer = this.nextElementSibling;
            if (answer && answer.classList.contains('faq-answer')) {
                if (answer.style.display === 'block') {
                    answer.style.display = 'none';
                } else {
                    answer.style.display = 'block';
                }
            }
        });
        // Ensure all answers are hidden initially
        var answer = q.nextElementSibling;
        if (answer && answer.classList.contains('faq-answer')) {
            answer.style.display = 'none';
        }
    });
} 