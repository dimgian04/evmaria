// EVMaria Services - Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initSmoothScrolling();
    initContactForm();
    initScrollEffects();
    initAnimations();
    initDropdowns();
    initPopupModal();
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
                    showNotification('Please fill in all required fields.', 'error');
                    return;
                }
                
                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    showNotification('Please enter a valid email address.', 'error');
                    return;
                }
                
                // Phone validation (if provided)
                if (data.phone && data.phone.trim() !== '') {
                    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                    if (!phoneRegex.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
                        showNotification('Please enter a valid phone number.', 'error');
                        return;
                    }
                }
                
                // Privacy policy validation
                if (!data.privacy) {
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
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
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
    let lastScrollTop = 0;
    
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
        
        // Mobile touch
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                menu.classList.toggle('active');
            }
        });
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
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
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
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
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
    
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
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
window.EVMariaUtils = {
    showNotification,
    debounce,
    throttle
}; 

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