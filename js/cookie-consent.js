/**
 * GDPR / TTDSG Cookie Consent Manager
 * Supports English and German based on URL path (/de/) OR browser language (de-*)
 * Tracking IDs: GA G-WP20X6DZPQ | Ads AW-17546137265 | Meta 680859374507051
 */

// Language detection: URL path takes priority, then browser language setting
// URL path: /de/ = German. Browser language: de, de-DE, de-AT, de-CH = German.
const isGermanPath = window.location.pathname.startsWith('/de/') || window.location.pathname.includes('/de/');
const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
const isGermanBrowser = browserLang.startsWith('de');
const isGerman = isGermanPath || isGermanBrowser;

const i18n = {
  en: {
    bannerTitle: '🍪 We Value Your Privacy',
    bannerText: 'We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies.',
    bannerPrivacyLink: 'Read our Privacy Policy',
    bannerPrivacyHref: '/privacy.html',
    acceptAll: 'Accept All',
    decline: 'Decline',
    settings: 'Cookie Settings',
    modalTitle: 'Cookie Preferences',
    modalIntro: 'We use different types of cookies to optimize your experience on our website. Choose which cookies you want to allow:',
    necessaryTitle: 'Necessary Cookies',
    necessaryDesc: 'These cookies are essential for the website to function properly. They cannot be disabled.',
    analyticsTitle: 'Analytics Cookies',
    analyticsDesc: 'These cookies help us understand how visitors interact with our website (Google Analytics).',
    marketingTitle: 'Marketing Cookies',
    marketingDesc: 'These cookies are used to display relevant advertisements (Google Ads, Facebook Pixel).',
    acceptSelected: 'Accept Selected',
    savePreferences: 'Save Preferences'
  },
  de: {
    bannerTitle: '🍪 Ihre Privatsphare ist uns wichtig',
    bannerText: 'Wir verwenden Cookies, um Ihr Surferlebnis zu verbessern, den Website-Verkehr zu analysieren und Inhalte zu personalisieren. Gemaess TTDSG Sec. 25 und DSGVO Art. 6 benoetigen wir Ihre Einwilligung fuer nicht notwendige Cookies. Mit Klick auf "Alle akzeptieren" stimmen Sie zu.',
    bannerPrivacyLink: 'Datenschutzerklaerung lesen',
    bannerPrivacyHref: '/de/datenschutz.html',
    acceptAll: 'Alle akzeptieren',
    decline: 'Ablehnen',
    settings: 'Cookie-Einstellungen',
    modalTitle: 'Cookie-Einstellungen',
    modalIntro: 'Wir verwenden verschiedene Arten von Cookies, um Ihre Erfahrung auf unserer Website zu optimieren. Waehlen Sie aus, welche Cookies Sie zulassen moechten:',
    necessaryTitle: 'Notwendige Cookies',
    necessaryDesc: 'Diese Cookies sind fuer den ordnungsgemaessen Betrieb der Website erforderlich. Sie koennen nicht deaktiviert werden (TTDSG Sec. 25 Abs. 2).',
    analyticsTitle: 'Analyse-Cookies',
    analyticsDesc: 'Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren (Google Analytics). Ihre IP-Adresse wird anonymisiert.',
    marketingTitle: 'Marketing-Cookies',
    marketingDesc: 'Diese Cookies werden verwendet, um relevante Werbeanzeigen zu schalten (Google Ads, Meta Pixel / Facebook).',
    acceptSelected: 'Auswahl bestaetigen',
    savePreferences: 'Einstellungen speichern'
  }
};

const t = isGerman ? i18n.de : i18n.en;

class CookieConsent {
    constructor() {
        this.consentGiven = false;
        this.preferences = { necessary: true, analytics: false, marketing: false };
        this.injectHTML();
        this.init();
    }

    injectHTML() {
        const bannerHTML = `
        <div id="cookie-consent-banner" class="cookie-consent">
            <div class="cookie-consent-container">
                <div class="cookie-consent-text">
                    <h4>${t.bannerTitle}</h4>
                    <p>${t.bannerText} <a href="${t.bannerPrivacyHref}" target="_blank">${t.bannerPrivacyLink}</a></p>
                </div>
                <div class="cookie-consent-actions">
                    <button id="cookie-accept" class="cookie-btn cookie-btn-accept">${t.acceptAll}</button>
                    <button id="cookie-decline" class="cookie-btn cookie-btn-decline">${t.decline}</button>
                    <button id="cookie-settings-btn" class="cookie-btn cookie-btn-settings">${t.settings}</button>
                </div>
            </div>
        </div>
        <div id="cookie-settings-modal" class="cookie-settings-modal">
            <div class="cookie-settings-content">
                <button id="cookie-settings-close" class="cookie-settings-close">&times;</button>
                <h3>${t.modalTitle}</h3>
                <p>${t.modalIntro}</p>
                <div class="cookie-category">
                    <div class="cookie-category-header">
                        <h4>${t.necessaryTitle}</h4>
                        <label class="cookie-toggle"><input type="checkbox" checked disabled><span class="cookie-toggle-slider"></span></label>
                    </div>
                    <p>${t.necessaryDesc}</p>
                </div>
                <div class="cookie-category">
                    <div class="cookie-category-header">
                        <h4>${t.analyticsTitle}</h4>
                        <label class="cookie-toggle"><input type="checkbox" id="toggle-analytics"><span class="cookie-toggle-slider"></span></label>
                    </div>
                    <p>${t.analyticsDesc}</p>
                </div>
                <div class="cookie-category">
                    <div class="cookie-category-header">
                        <h4>${t.marketingTitle}</h4>
                        <label class="cookie-toggle"><input type="checkbox" id="toggle-marketing"><span class="cookie-toggle-slider"></span></label>
                    </div>
                    <p>${t.marketingDesc}</p>
                </div>
                <div class="cookie-settings-actions">
                    <button id="cookie-accept-selected" class="cookie-btn cookie-btn-accept">${t.acceptSelected}</button>
                    <button id="cookie-save-preferences" class="cookie-btn cookie-btn-decline">${t.savePreferences}</button>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', bannerHTML);
    }

    init() {
        const savedConsent = this.getCookie('cookie_consent');
        if (savedConsent) {
            this.preferences = JSON.parse(savedConsent);
            this.consentGiven = true;
            this.loadScripts();
        } else {
            setTimeout(() => { this.showBanner(); }, 1000);
        }
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('cookie-accept')?.addEventListener('click', () => { this.acceptAll(); });
        document.getElementById('cookie-decline')?.addEventListener('click', () => { this.declineAll(); });
        document.getElementById('cookie-settings-btn')?.addEventListener('click', () => { this.showSettings(); });
        document.getElementById('cookie-settings-close')?.addEventListener('click', () => { this.hideSettings(); });
        document.getElementById('cookie-save-preferences')?.addEventListener('click', () => { this.savePreferences(); });
        document.getElementById('cookie-accept-selected')?.addEventListener('click', () => { this.savePreferences(); });
        document.getElementById('cookie-settings-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'cookie-settings-modal') { this.hideSettings(); }
        });
    }

    showBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) { banner.classList.add('show'); }
    }

    hideBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('show');
            banner.classList.add('hide');
            setTimeout(() => { banner.style.display = 'none'; }, 400);
        }
    }

    showSettings() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.add('show');
            document.getElementById('toggle-analytics').checked = this.preferences.analytics;
            document.getElementById('toggle-marketing').checked = this.preferences.marketing;
        }
    }

    hideSettings() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) { modal.classList.remove('show'); }
    }

    acceptAll() {
        this.preferences = { necessary: true, analytics: true, marketing: true };
        this.saveConsent();
        this.hideBanner();
        this.loadScripts();
    }

    declineAll() {
        this.preferences = { necessary: true, analytics: false, marketing: false };
        this.saveConsent();
        this.hideBanner();
    }

    savePreferences() {
        this.preferences.analytics = document.getElementById('toggle-analytics')?.checked || false;
        this.preferences.marketing = document.getElementById('toggle-marketing')?.checked || false;
        this.saveConsent();
        this.hideSettings();
        this.hideBanner();
        this.loadScripts();
    }

    saveConsent() {
        this.setCookie('cookie_consent', JSON.stringify(this.preferences), 365);
        this.consentGiven = true;
    }

    loadScripts() {
        if (this.preferences.analytics) { this.loadGoogleAnalytics(); }
        if (this.preferences.marketing) { this.loadGoogleAds(); this.loadFacebookPixel(); }
    }

    loadGoogleAnalytics() {
        if (document.querySelector('script[src*="G-WP20X6DZPQ"]')) return;
        const gaId = 'G-WP20X6DZPQ';
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);
        window.dataLayer = window.dataLayer || [];
        if (!window.gtag) { window.gtag = function(){dataLayer.push(arguments);} }
        gtag('js', new Date());
        gtag('config', gaId, { 'anonymize_ip': true });
    }

    loadGoogleAds() {
        if (document.querySelector('script[src*="AW-17546137265"]')) return;
        const adsId = 'AW-17546137265';
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${adsId}`;
        document.head.appendChild(script);
        window.dataLayer = window.dataLayer || [];
        if (!window.gtag) { window.gtag = function(){dataLayer.push(arguments);} }
        gtag('js', new Date());
        gtag('config', adsId);
    }

    loadFacebookPixel() {
        if (window.fbq) return;
        const pixelId = '680859374507051';
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
    }

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

document.addEventListener('DOMContentLoaded', () => { new CookieConsent(); });
