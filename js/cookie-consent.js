/**
 * Cookie Consent + Analytics Loader
 * Manages DSGVO-compliant consent for Google Analytics (GA4) and Microsoft Clarity.
 * Cloudflare Web Analytics ist cookie-frei und benötigt keine Einwilligung.
 *
 * Platzhalter vor Go-Live ersetzen:
 *   GA_ID      → Measurement ID aus Google Analytics, z.B. "G-XXXXXXXXXX"
 *   CLARITY_ID → Project ID aus Microsoft Clarity, z.B. "abcdef1234"
 */
(function () {
  'use strict';

  var CONSENT_KEY = 'ei2_cookie_consent';
  var GA_ID       = 'DEIN_GA4_ID_HIER';
  var CLARITY_ID  = 'DEIN_CLARITY_ID_HIER';

  /* ── Consent-Speicher ──────────────────────────────────────────────── */
  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }
  function saveConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
  }

  /* ── Analytics-Skripte laden ───────────────────────────────────────── */
  function loadGA() {
    if (!GA_ID || GA_ID === 'DEIN_GA4_ID_HIER') return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  function loadClarity() {
    if (!CLARITY_ID || CLARITY_ID === 'DEIN_CLARITY_ID_HIER') return;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1;
      t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  function loadAnalytics() {
    loadGA();
    loadClarity();
  }

  /* ── Cookie-Banner ─────────────────────────────────────────────────── */
  function injectStyles() {
    var style = document.createElement('style');
    style.textContent = [
      '#ei2-cookie-banner{',
        'position:fixed;bottom:0;left:0;right:0;z-index:99999;',
        'background:#0f1424;',
        'border-top:1px solid rgba(138,146,168,0.12);',
        'box-shadow:0 -8px 40px rgba(0,0,0,0.5);',
        'font-family:\'Inter\',-apple-system,BlinkMacSystemFont,\'Segoe UI\',system-ui,sans-serif;',
        'transform:translateY(100%);opacity:0;',
        'transition:transform 0.35s cubic-bezier(0.4,0,0.2,1),opacity 0.35s ease;',
      '}',
      '#ei2-cookie-banner.ei2-visible{transform:translateY(0);opacity:1;}',
      '#ei2-cookie-banner::before{',
        'content:\'\';display:block;height:2px;',
        'background:linear-gradient(90deg,#4a7cff,#8b5cf6,#d946ef);',
      '}',
      '#ei2-cookie-inner{',
        'max-width:1200px;margin:0 auto;',
        'padding:1.1rem 1.5rem;',
        'display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;',
      '}',
      '#ei2-cookie-text{flex:1;min-width:240px;}',
      '#ei2-cookie-text strong{',
        'display:block;color:#e8eaf0;font-size:0.9rem;',
        'font-weight:600;margin-bottom:0.3rem;',
      '}',
      '#ei2-cookie-text p{color:#8a92a8;font-size:0.8rem;line-height:1.55;margin:0;}',
      '#ei2-cookie-text a{color:#4a7cff;text-decoration:none;}',
      '#ei2-cookie-text a:hover{color:#8b5cf6;text-decoration:underline;}',
      '#ei2-cookie-actions{display:flex;gap:0.65rem;flex-shrink:0;align-items:center;}',
      '#ei2-cookie-reject{',
        'padding:0.5rem 1.1rem;border-radius:0.375rem;',
        'font-size:0.82rem;font-weight:500;cursor:pointer;',
        'background:transparent;color:#8a92a8;',
        'border:1px solid rgba(138,146,168,0.25);',
        'transition:color 0.2s,border-color 0.2s;',
        'white-space:nowrap;',
      '}',
      '#ei2-cookie-reject:hover{color:#e8eaf0;border-color:rgba(138,146,168,0.55);}',
      '#ei2-cookie-accept{',
        'padding:0.5rem 1.25rem;border-radius:0.375rem;',
        'font-size:0.82rem;font-weight:600;cursor:pointer;',
        'background:linear-gradient(135deg,#4a7cff,#8b5cf6);',
        'color:#fff;border:none;',
        'transition:opacity 0.2s,box-shadow 0.2s;',
        'white-space:nowrap;',
      '}',
      '#ei2-cookie-accept:hover{opacity:0.88;box-shadow:0 0 20px rgba(139,92,246,0.35);}',
      '@media(max-width:580px){',
        '#ei2-cookie-inner{flex-direction:column;align-items:stretch;gap:1rem;}',
        '#ei2-cookie-actions{justify-content:stretch;}',
        '#ei2-cookie-reject,#ei2-cookie-accept{flex:1;text-align:center;padding:0.65rem;}',
      '}'
    ].join('');
    document.head.appendChild(style);
  }

  function createBanner() {
    injectStyles();

    var banner = document.createElement('div');
    banner.id = 'ei2-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'false');
    banner.setAttribute('aria-label', 'Cookie-Einstellungen');
    banner.innerHTML =
      '<div id="ei2-cookie-inner">' +
        '<div id="ei2-cookie-text">' +
          '<strong>Cookies &amp; Analyse</strong>' +
          '<p>Wir verwenden <strong>Google Analytics</strong> und <strong>Microsoft Clarity</strong>, ' +
          'um die Nutzung unserer Website zu verstehen und zu verbessern. Diese Dienste setzen Cookies ' +
          'und können Daten in die USA übertragen. Mit Klick auf <em>Akzeptieren</em> willigen Sie ein ' +
          '(Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;a DSGVO). Ablehnen ist jederzeit möglich. ' +
          'Details: <a href="datenschutz.html">Datenschutzerklärung</a>.</p>' +
        '</div>' +
        '<div id="ei2-cookie-actions">' +
          '<button id="ei2-cookie-reject">Ablehnen</button>' +
          '<button id="ei2-cookie-accept">Akzeptieren</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(banner);

    /* Slide-in animation */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.add('ei2-visible');
      });
    });

    document.getElementById('ei2-cookie-accept').addEventListener('click', function () {
      saveConsent('accepted');
      removeBanner();
      loadAnalytics();
    });

    document.getElementById('ei2-cookie-reject').addEventListener('click', function () {
      saveConsent('rejected');
      removeBanner();
    });
  }

  function removeBanner() {
    var el = document.getElementById('ei2-cookie-banner');
    if (!el) return;
    el.classList.remove('ei2-visible');
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 380);
  }

  /* ── Öffentliche API für Datenschutz-Seite ─────────────────────────── */
  window.ei2CookieConsent = {
    reset: function () {
      try { localStorage.removeItem(CONSENT_KEY); } catch (e) {}
      location.reload();
    },
    getStatus: function () {
      return getConsent() || 'nicht gesetzt';
    }
  };

  /* ── Init ───────────────────────────────────────────────────────────── */
  var consent = getConsent();
  if (consent === 'accepted') {
    loadAnalytics();
  } else if (consent !== 'rejected') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createBanner);
    } else {
      createBanner();
    }
  }
})();
