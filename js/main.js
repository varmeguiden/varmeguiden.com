/* =========================================
   VARMEGUIDEN.COM — Hoved JavaScript
   ========================================= */

/* --- Include loader --- */
async function lastInn(id, fil) {
  try {
    const svar = await fetch(fil);
    if (svar.ok) {
      document.getElementById(id).innerHTML = await svar.text();
    }
  } catch (e) {
    console.warn('Kunne ikke laste:', fil);
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  /* Last header og footer */
  await lastInn('site-header', '/includes/header.html');
  await lastInn('site-footer', '/includes/footer.html');

  /* Merk aktiv side i nav */
  const sti = window.location.pathname;
  document.querySelectorAll('.hoved-nav a').forEach(a => {
    if (sti.startsWith(a.getAttribute('href')) && a.getAttribute('href') !== '/') {
      a.classList.add('aktiv');
    }
  });

  /* Last strømpris */
  lastStrømpris();

  /* FAQ accordion */
  document.querySelectorAll('.faq-spørsmål').forEach(knapp => {
    knapp.addEventListener('click', function() {
      const element = this.closest('.faq-element');
      const erÅpen = element.classList.contains('åpen');
      document.querySelectorAll('.faq-element').forEach(el => el.classList.remove('åpen'));
      if (!erÅpen) element.classList.add('åpen');
    });
  });
});

/* --- Strømpris API --- */
async function lastStrømpris() {
  try {
    const dato = new Date();
    const år = dato.getFullYear();
    const måned = String(dato.getMonth() + 1).padStart(2, '0');
    const dag = String(dato.getDate()).padStart(2, '0');

    const svar = await fetch(
      `https://www.hvakosterstrommen.no/api/v1/prices/${år}/${måned}-${dag}_NO1.json`
    );

    if (!svar.ok) throw new Error('API feil');
    const data = await svar.json();

    /* Finn nåværende time */
    const time = dato.getHours();
    const nå = data.find(t => {
      const fra = new Date(t.time_start).getHours();
      return fra === time;
    }) || data[0];

    /* Pris i kr (inkl MVA) */
    const pris = ((nå.NOK_per_kWh) * 1.25).toFixed(2);

    /* Oppdater alle elementer med klassen strom-pris */
    document.querySelectorAll('.strom-pris').forEach(el => {
      el.textContent = pris + ' kr/kWh';
    });

    /* Topbar */
    const topbar = document.getElementById('topbar-pris');
    if (topbar) topbar.textContent = pris + ' kr/kWh';

  } catch (e) {
    /* Vis ingenting ved feil — ingen "dårlig" info */
    document.querySelectorAll('.strom-pris').forEach(el => {
      el.textContent = 'sjekk nå';
    });
  }
}

/* --- Mobil meny --- */
function toggleMeny() {
  const nav = document.querySelector('.hoved-nav');
  if (!nav) return;
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  nav.style.flexDirection = 'column';
  nav.style.position = 'absolute';
  nav.style.top = '60px';
  nav.style.left = '0';
  nav.style.right = '0';
  nav.style.background = 'white';
  nav.style.padding = '16px';
  nav.style.borderBottom = '1px solid #e0e0e0';
  nav.style.zIndex = '200';
}

/* --- Søk --- */
function søk(tekst) {
  if (tekst && tekst.trim()) {
    window.location.href = '/søk/?q=' + encodeURIComponent(tekst.trim());
  }
}

document.addEventListener('keydown', function(e) {
  const søkInput = document.querySelector('.søk-input');
  if (søkInput && e.key === 'Enter' && document.activeElement === søkInput) {
    søk(søkInput.value);
  }
});
