/* VarmeGuiden — analyse og samtykke (GDPR, Google Consent Mode v2)
   gtag.js lastes umiddelbart, men med samtykke satt til "denied" som standard.
   Før samtykke: ingen informasjonskapsler, kun anonyme signaler (cookieless pings).
   Etter "Godta": consent oppdateres til "granted" og full måling starter.
   Measurement ID: G-Q5L7YT7HVF */
(function () {
  var GA_ID = 'G-Q5L7YT7HVF';
  var LAGRING = 'vg_samtykke';
  var gyldigDager = 180;

  /* ---- dataLayer + gtag tilgjengelig umiddelbart ---- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  /* ---- Lagring av valg med utløp ---- */
  function lagreValg(verdi) {
    try { localStorage.setItem(LAGRING, JSON.stringify({ v: verdi, t: Date.now() })); } catch (e) {}
  }
  function hentValg() {
    try {
      var rå = localStorage.getItem(LAGRING);
      if (!rå) return null;
      var data = JSON.parse(rå);
      var alder = (Date.now() - data.t) / (1000 * 60 * 60 * 24);
      if (alder > gyldigDager) { localStorage.removeItem(LAGRING); return null; }
      return data.v;
    } catch (e) { return null; }
  }

  /* ---- Consent Mode: standard = denied (settes FØR gtag.js lastes) ---- */
  var tidligereSamtykke = hentValg();
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });

  /* ---- Last gtag.js umiddelbart (kjører i denied-modus til samtykke) ---- */
  (function lastGtag() {
    if (!GA_ID || GA_ID.indexOf('XXXX') !== -1) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  })();

  /* ---- Hvis bruker tidligere har godtatt: oppgrader til granted ---- */
  if (tidligereSamtykke === 'godta') {
    gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted'
    });
  }

  /* ---- Sporing av nøkkelhendelser ---- */
  function sporHendelser() {
    var kalkInputs = document.querySelectorAll('.besparelse-kalk input[type=range], .gulvvarme-kalk input[type=range]');
    if (kalkInputs.length) {
      var kalkBrukt = false;
      kalkInputs.forEach(function (inp) {
        inp.addEventListener('change', function () {
          if (kalkBrukt) return;
          kalkBrukt = true;
          gtag('event', 'kalkulator_brukt', { side: location.pathname });
        });
      });
    }
    document.querySelectorAll('.faq-spørsmål').forEach(function (btn) {
      btn.addEventListener('click', function () {
        gtag('event', 'faq_apnet', { side: location.pathname });
      });
    });
  }

  /* ---- Banner-stil ---- */
  function leggInnStil() {
    var css = ''
      + '.vg-samtykke{position:fixed;left:16px;right:16px;bottom:16px;z-index:10000;'
      + 'max-width:520px;margin:0 auto;background:#fff;border:1px solid #d9e2dc;'
      + 'border-radius:14px;box-shadow:0 8px 30px rgba(10,61,31,.18);padding:18px 20px;'
      + 'font-family:system-ui,-apple-system,sans-serif}'
      + '.vg-samtykke p{margin:0 0 14px;font-size:13.5px;line-height:1.6;color:#2c2c2c}'
      + '.vg-samtykke a{color:#1f7a4d;text-decoration:underline}'
      + '.vg-samtykke-knapper{display:flex;gap:10px;flex-wrap:wrap}'
      + '.vg-samtykke button{flex:1;min-width:120px;border:none;border-radius:8px;'
      + 'padding:11px 16px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit}'
      + '.vg-godta{background:#0a3d1f;color:#fff}'
      + '.vg-godta:hover{background:#0d4f28}'
      + '.vg-avsla{background:#f0f2f1;color:#2c2c2c}'
      + '.vg-avsla:hover{background:#e4e8e6}'
      + '@media(max-width:520px){.vg-samtykke{left:8px;right:8px;bottom:8px;padding:16px}}';
    var stil = document.createElement('style');
    stil.textContent = css;
    document.head.appendChild(stil);
  }

  /* ---- Vis banner ---- */
  function visBanner() {
    leggInnStil();
    var boks = document.createElement('div');
    boks.className = 'vg-samtykke';
    boks.setAttribute('role', 'dialog');
    boks.setAttribute('aria-label', 'Samtykke til informasjonskapsler');
    boks.innerHTML =
      '<p>Vi bruker informasjonskapsler til anonym statistikk for å forbedre nettstedet. '
      + 'Ingen informasjonskapsler settes før du godtar. Les mer i vår <a href="/personvern/">personvernerklæring</a>.</p>'
      + '<div class="vg-samtykke-knapper">'
      + '<button class="vg-avsla" type="button">Avslå</button>'
      + '<button class="vg-godta" type="button">Godta</button>'
      + '</div>';
    document.body.appendChild(boks);

    boks.querySelector('.vg-godta').addEventListener('click', function () {
      lagreValg('godta');
      gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted'
      });
      boks.remove();
    });
    boks.querySelector('.vg-avsla').addEventListener('click', function () {
      lagreValg('avsla');
      boks.remove();
    });
  }

  /* ---- Start ---- */
  function start() {
    sporHendelser();
    var valg = hentValg();
    if (valg !== 'godta' && valg !== 'avsla') { visBanner(); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
