/* =========================================
   VARMEGUIDEN.COM — JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* --- Strømpris API --- */
  lastStrømpris();

  /* --- FAQ accordion --- */
  document.querySelectorAll('.faq-spørsmål').forEach(function (knapp) {
    knapp.addEventListener('click', function () {
      var element = this.closest('.faq-element');
      var erÅpen = element.classList.contains('åpen');
      document.querySelectorAll('.faq-element').forEach(function (el) {
        el.classList.remove('åpen');
        el.querySelector('.faq-spørsmål').setAttribute('aria-expanded', 'false');
      });
      if (!erÅpen) {
        element.classList.add('åpen');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* --- Aktiv nav lenke --- */
  var sti = window.location.pathname;
  document.querySelectorAll('.hoved-nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href && href !== '/' && sti.startsWith(href)) {
      a.classList.add('aktiv');
    }
  });

  /* --- Mobil meny --- */
  var hamburger = document.querySelector('.hamburger');
  var mobilMeny = document.querySelector('.mobil-meny');
  var overlay = document.querySelector('.mobil-meny-overlay');
  var lukk = document.querySelector('.mobil-meny-lukk');

  function åpneMeny() {
    if (mobilMeny) mobilMeny.classList.add('aktiv');
    if (overlay) overlay.classList.add('aktiv');
    document.body.style.overflow = 'hidden';
  }

  function lukkeMeny() {
    if (mobilMeny) mobilMeny.classList.remove('aktiv');
    if (overlay) overlay.classList.remove('aktiv');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', åpneMeny);
  if (lukk) lukk.addEventListener('click', lukkeMeny);
  if (overlay) overlay.addEventListener('click', lukkeMeny);

});

/* --- Strømpris API --- */
async function lastStrømpris() {
  try {
    var dato = new Date();
    var år = dato.getFullYear();
    var måned = String(dato.getMonth() + 1).padStart(2, '0');
    var dag = String(dato.getDate()).padStart(2, '0');

    var svar = await fetch(
      'https://www.hvakosterstrommen.no/api/v1/prices/' + år + '/' + måned + '-' + dag + '_NO1.json'
    );

    if (!svar.ok) throw new Error('API feil');
    var data = await svar.json();

    var time = dato.getHours();
    var nå = data.find(function (t) {
      return new Date(t.time_start).getHours() === time;
    }) || data[0];

    var pris = (nå.NOK_per_kWh * 1.25).toFixed(2);

    document.querySelectorAll('.strom-pris').forEach(function (el) {
      el.textContent = pris + ' kr/kWh';
    });

  } catch (e) {
    document.querySelectorAll('.strom-pris').forEach(function (el) {
      el.textContent = 'se priser';
    });
  }
}

/* --- Søk --- */
function søk(tekst) {
  if (tekst && tekst.trim()) {
    alert('Søkefunksjon kommer snart! Bruk navigasjonen over for å finne det du leter etter.');
  }
}
