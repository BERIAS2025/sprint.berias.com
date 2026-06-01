// ============================================
// BERIAS 30-Day Clarity Sprint Landing Page
// JavaScript for Interactions and Navigation
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // MOBILE NAVIGATION TOGGLE
    // ============================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu li a');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger icon
            this.classList.toggle('active');
        });
    }
    
    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            if (hamburger) {
                hamburger.classList.remove('active');
            }
        });
    });
    
    // ============================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Don't prevent default for empty hash or just '#'
            if (href === '#' || href === '') {
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ============================================
    // NAVBAR BACKGROUND ON SCROLL
    // ============================================
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 12px rgba(15, 48, 76, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 4px rgba(15, 48, 76, 0.1)';
        }
    });
    
    // ============================================
    // FADE-IN ANIMATION ON SCROLL
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.problem-card, .benefit-card, .timeline-item, .case-study, .industry-card'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // ============================================
    // TRACKING EVENT HELPERS
    // ============================================
    
    // Track CTA button clicks
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-primary-small');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            
            // Google Analytics tracking (if gtag is loaded)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    'event_category': 'engagement',
                    'event_label': buttonText,
                    'value': 1
                });
            }
            
            // Facebook Pixel tracking (if fbq is loaded)
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead', {
                    content_name: buttonText
                });
            }
            
            console.log('CTA clicked:', buttonText);
        });
    });
    
    // Track external link clicks
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            const url = this.getAttribute('href');
            
            // Google Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'outbound',
                    'event_label': url,
                    'transport_type': 'beacon'
                });
            }
            
            console.log('External link clicked:', url);
        });
    });
    
    // Track Calendly widget interactions
    function isCalendlyEvent(e) {
        return e.data.event && e.data.event.indexOf('calendly') === 0;
    }
    
    window.addEventListener('message', function(e) {
        if (isCalendlyEvent(e)) {
            // Google Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'calendly_interaction', {
                    'event_category': 'engagement',
                    'event_label': e.data.event,
                    'value': 1
                });
            }
            
            // Facebook Pixel tracking
            if (typeof fbq !== 'undefined') {
                if (e.data.event === 'calendly.event_scheduled') {
                    fbq('track', 'Schedule', {
                        content_name: '10-Minute Clarity Call'
                    });
                }
            }
            
            console.log('Calendly event:', e.data.event);
        }
    });
    
    // ============================================
    // HUBSPOT FORM TRACKING
    // ============================================
    // Listen for HubSpot form submissions
    window.addEventListener('message', function(event) {
        if (event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormSubmit') {
            // Google Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'engagement',
                    'event_label': 'Contact Form',
                    'value': 1
                });
            }
            
            // Facebook Pixel tracking
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Contact', {
                    content_name: 'Contact Form Submission'
                });
            }
            
            console.log('HubSpot form submitted');
        }
    });
    
    // ============================================
    // LAZY LOAD IMAGES (Performance Optimization)
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ============================================
    // CONSOLE WELCOME MESSAGE
    // ============================================
    console.log('%c🚀 BERIAS 30-Day Clarity Sprint', 'font-size: 20px; font-weight: bold; color: #A2C614;');
    console.log('%cTransforming business chaos into operational clarity.', 'font-size: 14px; color: #0F304C;');
    console.log('%cVisit: https://berias.com', 'font-size: 12px; color: #666;');
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance optimization
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

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
