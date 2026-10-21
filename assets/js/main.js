// Comportamenti del sito. Il sito resta usabile anche senza questo file (PROGETTO.md §6).

// Link dell'app: unico punto da aggiornare. Finché un valore è vuoto il link porta alla sezione #app.
const APP_LINKS = {
  calcetto: "",
  tennis: "",
  bar: "",
  ios: "",
  android: "",
};

const VIDEO_LARGHEZZA_GRANDE = 960;
const VIDEO_RITARDO_MS = 1500;
const riduciMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function collegaApp() {
  document.querySelectorAll("[data-app]").forEach((link) => {
    const url = APP_LINKS[link.dataset.app];
    if (url) link.href = url;
  });
}

// Intestazione solida e barra di prenotazione visibile quando la hero esce dallo schermo
function osservaHero() {
  const hero = document.querySelector('[data-js="hero"]');
  const intestazione = document.querySelector('[data-js="intestazione"]');
  const barra = document.querySelector('[data-js="barra-prenota"]');
  if (!hero || !("IntersectionObserver" in window)) {
    intestazione?.classList.add("intestazione--solida");
    barra?.classList.add("barra-prenota--visibile");
    return;
  }

  const sentinella = new IntersectionObserver(([voce]) => {
    intestazione.classList.toggle("intestazione--solida", voce.intersectionRatio < 0.92);
    barra.classList.toggle("barra-prenota--visibile", !voce.isIntersecting);
  }, { threshold: [0, 0.92] });
  sentinella.observe(hero);
}

function rivelaAlloScroll() {
  const elementi = document.querySelectorAll('[data-js~="rivela"]');
  if (riduciMovimento || !("IntersectionObserver" in window)) {
    elementi.forEach((el) => el.classList.add("e-visibile"));
    return;
  }

  const osservatore = new IntersectionObserver((voci) => {
    voci.forEach((voce) => {
      if (!voce.isIntersecting) return;
      voce.target.classList.add("e-visibile");
      osservatore.unobserve(voce.target);
    });
  }, { rootMargin: "0px 0px -10% 0px" });
  elementi.forEach((el) => osservatore.observe(el));
}

// Il video parte solo con connessione veloce, senza risparmio dati e senza "riduci movimento".
// Se il browser non espone navigator.connection (Safari, Firefox) lo carichiamo solo su schermi grandi.
function connessioneVeloce() {
  const connessione = navigator.connection;
  if (!connessione) return window.innerWidth >= VIDEO_LARGHEZZA_GRANDE;
  return !connessione.saveData && connessione.effectiveType === "4g";
}

function avviaVideoHero() {
  const video = document.querySelector('[data-js="hero-video"]');
  if (!video || riduciMovimento || !connessioneVeloce()) return;

  const formato = window.innerWidth >= VIDEO_LARGHEZZA_GRANDE ? "grande" : "piccolo";
  [["webm", "video/webm"], ["mp4", "video/mp4"]].forEach(([estensione, tipo]) => {
    const sorgente = document.createElement("source");
    sorgente.src = video.dataset[`${estensione}${formato === "grande" ? "Grande" : "Piccolo"}`];
    sorgente.type = tipo;
    video.append(sorgente);
  });

  video.addEventListener("playing", () => video.classList.add("hero__video--attivo"), { once: true });
  video.load();
  video.play().catch(() => {});

  // In pausa quando la hero non si vede, per non consumare batteria
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([voce]) => {
      if (voce.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }).observe(video);
  }
}

collegaApp();
osservaHero();
rivelaAlloScroll();

// Il video non deve competere con il primo caricamento: aspetta "load", un momento di quiete
// e un margine ulteriore, perché su telefoni lenti il primo disegno può arrivare dopo "load"
window.addEventListener("load", () => {
  const quandoLibero = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
  setTimeout(() => quandoLibero(avviaVideoHero), VIDEO_RITARDO_MS);
});
