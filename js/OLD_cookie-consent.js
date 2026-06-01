/**
 * GDPR Cookie Consent Manager
 * Manages user consent for cookies and tracking scripts
 */

class CookieConsent {
    constructor() {
        this.consentGiven = false;
        this.preferences = {
            necessary: true, // Always true, cannot be disabled
            analytics: false,
            marketing: false
        };
        
        this.init();
    }
    
    init() {
        // Check if consent was previously given
        const savedConsent = this.getCookie('cookie_consent');
        
        if (savedConsent) {
            this.preferences = JSON.parse(savedConsent);
            this.consentGiven = true;
            this.loadScripts();
        } else {
            // Show banner after a short delay
            setTimeout(() => {
                this.showBanner();
            }, 1000);
        }
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Accept all button
        document.getElementById('cookie-accept')?.addEventListener('click', () => {
            this.acceptAll();
        });
        
        // Decline all button
        document.getElementById('cookie-decline')?.addEventListener('click', () => {
            this.declineAll();
        });
        
        // Settings button
        document.getElementById('cookie-settings-btn')?.addEventListener('click', () => {
            this.showSettings();
        });
        
        // Close settings modal
        document.getElementById('cookie-settings-close')?.addEventListener('click', () => {
            this.hideSettings();
        });
        
        // Save preferences button
        document.getElementById('cookie-save-preferences')?.addEventListener('click', () => {
            this.savePreferences();
        });
        
        // Accept selected button
        document.getElementById('cookie-accept-selected')?.addEventListener('click', () => {
            this.savePreferences();
        });
        
        // Close modal on background click
        document.getElementById('cookie-settings-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'cookie-settings-modal') {
                this.hideSettings();
            }
        });
    }
    
    showBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.add('show');
        }
    }
    
    hideBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('show');
            banner.classList.add('hide');
            setTimeout(() => {
                banner.style.display = 'none';
            }, 400);
        }
    }
    
    showSettings() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.add('show');
            
            // Set toggle states based on current preferences
            document.getElementById('toggle-analytics').checked = this.preferences.analytics;
            document.getElementById('toggle-marketing').checked = this.preferences.marketing;
        }
    }
    
    hideSettings() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }
    
    acceptAll() {
        this.preferences = {
            necessary: true,
            analytics: true,
            marketing: true
        };
        this.saveConsent();
        this.hideBanner();
        this.loadScripts();
    }
    
    declineAll() {
        this.preferences = {
            necessary: true,
            analytics: false,
            marketing: false
        };
        this.saveConsent();
        this.hideBanner();
    }
    
    savePreferences() {
        // Get toggle states
        this.preferences.analytics = document.getElementById('toggle-analytics')?.checked || false;
        this.preferences.marketing = document.getElementById('toggle-marketing')?.checked || false;
        
        this.saveConsent();
        this.hideSettings();
        this.hideBanner();
        this.loadScripts();
    }
    
    saveConsent() {
        // Save consent for 365 days
        this.setCookie('cookie_consent', JSON.stringify(this.preferences), 365);
        this.consentGiven = true;
    }
    
    loadScripts() {
        // Load analytics scripts if consent given
        if (this.preferences.analytics) {
            this.loadGoogleAnalytics();
        }
        
        // Load marketing scripts if consent given
        if (this.preferences.marketing) {
            this.loadGoogleAds();
            this.loadFacebookPixel();
        }
    }
    
    loadGoogleAnalytics() {
        // Check if Google Analytics script is already loaded
        if (window.gtag) {
            console.log('Google Analytics already loaded');
            return;
        }
        
        // TODO: Replace GA_MEASUREMENT_ID with your actual Google Analytics ID
        // Example: const gaId = 'G-XXXXXXXXXX';
        
        // Uncomment and add your GA ID when ready:
        /*
        const gaId = 'GA_MEASUREMENT_ID'; // Replace with your actual ID
        
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);
        
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', gaId);
        
        console.log('Google Analytics loaded');
        */
    }
    
    loadGoogleAds() {
        // Check if Google Ads script is already loaded
        if (window.gtag && document.querySelector('script[src*="googletagmanager.com/gtag/js?id=AW-"]')) {
            console.log('Google Ads already loaded');
            return;
        }
        
        // TODO: Replace AW-CONVERSION_ID with your actual Google Ads ID
        
        // Uncomment and add your Google Ads ID when ready:
        /*
        const adsId = 'AW-CONVERSION_ID'; // Replace with your actual ID
        
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${adsId}`;
        document.head.appendChild(script);
        
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', adsId);
        
        console.log('Google Ads loaded');
        */
    }
    
    loadFacebookPixel() {
        // Check if Facebook Pixel is already loaded
        if (window.fbq) {
            console.log('Facebook Pixel already loaded');
            return;
        }
        
        // TODO: Replace YOUR_PIXEL_ID with your actual Facebook Pixel ID
        
        // Uncomment and add your Facebook Pixel ID when ready:
        /*
        const pixelId = 'YOUR_PIXEL_ID'; // Replace with your actual ID
        
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', pixelId);
        fbq('track', 'PageView');
        
        console.log('Facebook Pixel loaded');
        */
    }
    
    // Cookie utility functions
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }
    
    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
}

// Initialize cookie consent when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CookieConsent();
});
