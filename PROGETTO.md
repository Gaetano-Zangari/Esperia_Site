# PROGETTO — Sito Esperia Verona

Documento di riferimento del progetto. Ogni file, nome, colore e font usato nel sito
deve rispettare quanto scritto qui. Se una regola va cambiata, si aggiorna prima questo file.

---

## 1. Obiettivo

Portare chi visita il sito a **prenotare tramite l'app mobile**:

1. un **campo da calcetto**
2. un **campo da tennis**
3. un **tavolo al bar / cucina**

Ogni sezione deve avere al massimo un passo di distanza da un pulsante "Prenota".

**Pubblico:** uomini adulti (25–55) che giocano a calcetto o tennis, quasi sempre da telefono,
spesso la sera o in pausa pranzo, con l'obiettivo di organizzare la partita in fretta.

**Tono visivo:** energico, notturno, da campo illuminato. Foto reali, tipografia condensata
e grande, contrasti forti. Niente stock photo, niente 3D.

### Dati dell'attività (da insegna e logo)

| Campo | Valore |
|---|---|
| Nome | **Esperia a.s.d.** — campi da calcetto e da tennis |
| Indirizzo | Via Marin Faliero, 98 — Verona |
| Telefono | 351 82 95 167 |
| Sport | Calcio a 5, tennis, futnet (campi polivalenti in erba sintetica) |
| Servizi | Bar con bancone, terrazza esterna con tavoli e panche, illuminazione serale |

Da confermare con il cliente: orari, numero esatto dei campi, cucina/menu, P.IVA.

---

## 2. Vincoli tecnici

| Vincolo | Regola concreta |
|---|---|
| < 3 s su 4G | LCP ≤ 2,5 s con profilo Lighthouse "Slow 4G / Moto G Power" |
| Telefoni di fascia media | JS totale ≤ 30 KB gzip, nessun framework, nessuna libreria nel percorso critico |
| Testo nell'HTML | Tutto il testo è HTML semantico, leggibile senza JS, indicizzabile |
| Immagini reali | Solo foto dell'attività (fornite dal cliente / dal suo Instagram, con autorizzazione) |

### Budget di peso (trasferito, gzip/brotli)

| Risorsa | Limite |
|---|---|
| HTML | ≤ 20 KB |
| CSS critico (inline in `<head>`) | ≤ 14 KB |
| CSS completo | ≤ 35 KB |
| JS | ≤ 30 KB, caricato con `defer` |
| Font | ≤ 3 file woff2, ≤ 90 KB in totale |
| Immagine hero (mobile) | ≤ 90 KB WebP |
| Prima schermata complessiva | ≤ 250 KB |
| Pagina completa | ≤ 1,2 MB (tutto il resto in `loading="lazy"`) |

### Three.js

Lo stack prevede Three.js, ma **il sito non usa 3D** (vedi tabella sezioni, §3).
Regola: **Three.js non viene incluso** nella pagina. Se in futuro si decidesse un effetto
WebGL, dovrà essere:
- caricato dinamicamente (`import()`) solo dopo l'evento `load`,
- solo su dispositivi con `navigator.hardwareConcurrency >= 6` e senza `prefers-reduced-motion`,
- puramente decorativo, con fallback identico in CSS,
- mai contenitore di testo.

---

## 3. Struttura delle sezioni

Nome sezione = `id` HTML = prefisso classi CSS = cartella immagini.

| # | Nome (`id`) | Contenuto | 3D? | Motivazione |
|---|---|---|---|---|
| 1 | `intestazione` | Logo, menu ancore, pulsante fisso "Prenota" | No | Elemento di navigazione: deve essere istantaneo e accessibile. |
| 2 | `hero` | Foto reale dei campi illuminati di sera, titolo forte, 2 CTA (Prenota campo / Prenota tavolo) | No | È l'LCP: un canvas 3D ritarderebbe il primo rendering di 1–2 s su fascia media e sostituirebbe la foto reale, che è il vero elemento persuasivo. |
| 3 | `scegli` | 3 card grandi: Calcetto · Tennis · Bar. Ognuna con foto e link diretto alla sezione app corrispondente | No | Serve a decidere in 2 secondi: foto + testo grande battono qualsiasi oggetto 3D. |
| 4 | `campi` | Dettagli calcetto e tennis: numero campi, superficie, illuminazione, spogliatoi, orari, foto | No | Un modello 3D del campo sarebbe meno credibile di una foto vera e peserebbe 1–3 MB. Il giocatore vuole vedere *quel* campo. |
| 5 | `bar` | Cucina e bar: piatti forti, terzo tempo dopo la partita, foto del locale e dei piatti, CTA prenota tavolo | No | Il cibo si vende con la fotografia, non con il 3D. |
| 6 | `come-funziona` | 3 passi: Scarica l'app → Scegli campo/orario → Gioca. Screenshot reali dell'app in cornice telefono CSS | No | Un telefono 3D rotante è un cliché pesante; uno screenshot reale in cornice CSS comunica meglio e pesa ~40 KB. |
| 7 | `galleria` | Foto reali: partite, tornei, serate, clienti (con liberatoria) | No | Galleria a scorrimento orizzontale con `scroll-snap`, lazy load. Il 3D non aggiunge informazione. |
| 8 | `voci` *(opzionale)* | Recensioni reali (Google) con nome e stelle | No | Solo testo: deve restare HTML indicizzabile. Si pubblica solo con recensioni vere. |
| 9 | `app` | Download app: badge App Store / Google Play, QR code su desktop, benefici dell'app | No | Conversione pura: chiarezza e velocità. |
| 10 | `dove-siamo` | Indirizzo, orari, telefono, mappa statica (immagine) che apre Google Maps | No | Niente iframe di Google Maps nel caricamento iniziale (≈ 500 KB di JS). Immagine statica + link. |
| 11 | `pie-di-pagina` | Contatti, social, P.IVA, privacy/cookie | No | Contenuto legale e di servizio. |

**Conclusione:** nessuna sezione giustifica il 3D. L'energia si ottiene con fotografia reale
a tutto schermo, tipografia condensata enorme, tagli diagonali (come le linee del campo)
e micro-animazioni CSS (comparsa al scroll, hover sulle card) rispettose di
`prefers-reduced-motion`.

---

## 4. Struttura delle cartelle

```
/
├── index.html
├── privacy.html
├── PROGETTO.md
├── README.md
├── assets/
│   ├── css/
│   │   ├── tokens.css          # SOLO variabili (palette, font, spaziature)
│   │   └── main.css            # stili, ordinati per sezione come in §3
│   ├── js/
│   │   └── main.js             # unico script, vanilla, defer
│   ├── fonts/                  # woff2 self-hosted, subset latin
│   ├── video/                  # loop video muti (WebM VP9 + MP4 H.264)
│   ├── icons/
│   │   └── sprite.svg          # tutte le icone in un unico sprite SVG
│   └── img/
│       ├── hero/
│       ├── scegli/
│       ├── campi/
│       ├── bar/
│       ├── come-funziona/
│       ├── galleria/
│       ├── app/
│       ├── dove-siamo/
│       └── brand/              # logo, favicon, immagine social (og)
├── strumenti/                  # script per le immagini (ottimizza.sh, ricomponi.py), non pubblicati
└── sorgenti/                   # originali non ottimizzati (NON pubblicati)
    ├── foto/                   # foto reali, rinominate secondo §5
    ├── riferimenti-ai/         # foto reali di bassa qualità usate come base per le immagini AI
    └── brand/                  # logo originale ricevuto dal cliente
```

Regole:
- Ogni immagine sta nella cartella della sezione principale in cui appare. Se la stessa
  foto serve in più sezioni (es. `scegli` e `campi`), resta in una sola cartella e non si duplica.
- Gli originali ad alta risoluzione stanno in `sorgenti/` e non vengono mai referenziati dall'HTML.
  `sorgenti/` è esclusa da git (`.gitignore`, ~50 MB): conservarne una copia di backup fuori dal repository.
- CSS in due file (`tokens.css`, `main.css`), **non** inline: misurato con Lighthouse il 21/10/2026,
  l'inline non migliora l'LCP (2,6 s contro 2,5 s) e complica la manutenzione. Da rivalutare solo se cambiano i pesi.

---

## 5. Denominazione dei file

### Regole generali
- Solo **minuscole**, **kebab-case**, caratteri ASCII: niente spazi, accenti, maiuscole, underscore.
- Nomi in **italiano**, coerenti con i nomi delle sezioni.

### Immagini
```
<sezione>-<soggetto>[-<variante>][-ai|-ritocco]-<larghezza>.<estensione>
```
Esempi:
- `campi-tennis-giorno-480.webp`, `campi-tennis-giorno-800.webp`, `campi-tennis-giorno-1080.webp`
- `bar-bancone-trofei-01-800.webp`
- `campi-calcetto-sera-ai-1200.webp` ← immagine generata con AI
- Originali in `sorgenti/`: stesso nome senza larghezza (`bar-terrazza-sera.png`);
  riferimenti per l'AI con suffisso `-rif` (`campi-calcetto-sera-rif.png`).

Formati e larghezze:
- **WebP** (q 72, method 6, metadati rimossi) con `srcset` + `sizes`. JPEG solo per l'immagine `og`.
  AVIF non è usato: l'ImageMagick locale non ha l'encoder; si può aggiungere in seguito con `<picture>`.
- Larghezze standard: `480`, `800`, `1200` (solo la `hero` ha anche `1920`), mai oltre la larghezza dell'originale
  (in quel caso l'ultima variante ha la larghezza reale, es. `-1080`).
  Sempre con `width`/`height` nell'HTML.
- L'immagine hero ha `fetchpriority="high"` e **non** è lazy; tutte le altre sì.

### Linea guida: realismo prima di tutto
**Si cambia solo ciò che va sistemato.** Tutto il resto della foto resta l'originale.

| Caso | Intervento | Suffisso |
|---|---|---|
| Foto buona | Nessuno: solo ottimizzazione WebP | — |
| Foto buona con oggetti fuori posto (trapano, spray, cavi…) | **Ritocco locale**: l'AI rimuove gli oggetti, poi si ricompone sull'originale **solo** la zona corretta (maschera sfumata); il resto dei pixel resta quello vero | `-ritocco` |
| Foto inutilizzabile (bassa risoluzione) | **Ricostruzione fedele** dalla foto di riferimento | `-ai` |

Vietato in ogni caso: cambiare luce, colori, stagione, arredi, persone o aggiungere elementi
che il centro non ha. Niente filtri "da pubblicità".

### Immagini generate con AI
- Ammesse **solo** per i campi da calcetto, di cui esistono soltanto foto reali di bassa qualità
  (`sorgenti/riferimenti-ai/`).
- Devono riprodurre fedelmente il luogo reale: recinzioni, torri faro, linee gialle e bianche,
  porte, palazzi sullo sfondo. Niente elementi che il centro non ha (tribune, loghi, folla).
- Il suffisso `-ai` nel nome del file è obbligatorio, così si sa sempre cosa sostituire
  quando arrivano foto vere.
- Da sostituire con foto reali appena possibile (servizio fotografico serale consigliato).

### Altri file
- Font: `<famiglia>-<peso>.woff2` → `barlow-condensed-800.woff2`
- Icone (id nello sprite): `icona-<nome>` → `icona-pallone`, `icona-racchetta`, `icona-forchetta`
- Brand: `logo-esperia.svg`, `logo-esperia-bianco.svg`, `og-esperia.jpg`, `favicon.svg`

---

## 6. Convenzioni di codice

### HTML
- Ogni sezione: `<section id="<nome>" class="sezione sezione--<nome>" aria-labelledby="<nome>-titolo">`.
- Un solo `<h1>` (in `hero`), ogni sezione ha il suo `<h2 id="<nome>-titolo">`.
- Link all'app: attributo `data-app="calcetto|tennis|bar|ios|android"`; gli URL reali sono
  centralizzati in `main.js` (oggetto `APP_LINKS`), così si cambiano in un solo punto.

### CSS
- Mobile-first. Classi **BEM** con il nome della sezione come blocco:
  `.campi__card`, `.campi__card--tennis`, `.hero__titolo`.
- Componenti condivisi senza prefisso di sezione: `.bottone`, `.bottone--primario`, `.contenitore`.
- Nessun colore, font o spaziatura scritto a mano: si usano **solo** le variabili di `tokens.css`.
- Breakpoint (min-width): `600px`, `960px`, `1280px`.

### JavaScript
- Vanilla ES2020, un solo file `main.js` con `defer`.
- Selettori tramite `data-js="..."`, mai tramite classi CSS.
- Nomi variabili e funzioni in `camelCase`, costanti in `UPPER_SNAKE_CASE`.
- Animazioni con `IntersectionObserver` + classi CSS; nulla se `prefers-reduced-motion: reduce`.
- Il sito deve essere completamente usabile con JS disattivato.

---

## 7. Palette

Ricavata dal logo ufficiale (`sorgenti/brand/logo-esperia-originale.png`): blu navy e
azzurro del cerchio, arancio della figura e dei tagli. Il giallo viene dalle linee dei campi reali.

| Variabile | HEX | Origine | Uso |
|---|---|---|---|
| `--colore-notte` | `#06142B` | navy del logo, scurito | Sfondo principale |
| `--colore-blu-profondo` | `#0C3871` | logo | Sfondo sezioni alternate, card |
| `--colore-blu` | `#09458B` | logo (colore principale) | Bordi, fasce, superfici di brand |
| `--colore-azzurro` | `#3B91D2` | logo (figura del giocatore) | Link, icone, dettagli su `--colore-notte` |
| `--colore-arancio` | `#EF6723` | logo (tagli e scritte) | **Pulsanti "Prenota"**, evidenziazioni |
| `--colore-arancio-chiaro` | `#FF7A3D` | arancio schiarito | Hover dei pulsanti, testo arancio su `--colore-blu-profondo` |
| `--colore-linea` | `#F5C400` | linee gialle dei campi | Solo dettagli grafici "linea di campo" (sottolineature, separatori) |
| `--colore-gesso` | `#F4F6FA` | — | Testo principale su fondo scuro |
| `--colore-nebbia` | `#9FB0C8` | — | Testo secondario, didascalie |
| `--colore-ombra` | `rgba(6, 20, 43, 0.72)` | `--colore-notte` | Velatura sopra le foto |

Rapporti di contrasto misurati (WCAG AA = 4.5 per testo normale, 3 per testo grande):

| Testo \ Sfondo | `notte` | `blu-profondo` |
|---|---|---|
| `gesso` | 17.0 | 10.7 |
| `nebbia` | 8.3 | 5.2 |
| `azzurro` | 5.4 | 3.4 (solo testo grande) |
| `arancio` | 5.8 | 3.7 (solo testo grande) |
| `arancio-chiaro` | 7.1 | 4.5 |

Regole:
- Testo dentro i pulsanti arancio → sempre `--colore-notte` (5.8:1). **Mai bianco** (3.2:1, non passa).
- `--colore-azzurro` e `--colore-arancio` come testo su `--colore-blu-profondo` solo ≥ 24px.
- Testo sopra foto → sempre con `--colore-ombra` o gradiente sotto.
- L'arancio è riservato alle azioni (prenota, scarica): non usarlo per decorazioni.

---

## 8. Tipografia

Famiglia unica **Barlow** (Google Fonts, licenza OFL), **self-hosted** in woff2,
subset `latin` + `latin-ext`, `font-display: swap`. Coerente, sportiva, leggera da caricare.

| Ruolo | Font | Peso | File |
|---|---|---|---|
| Titoli / display | Barlow Condensed | 800 | `barlow-condensed-800.woff2` |
| Testo corrente | Barlow | 400 | `barlow-400.woff2` |
| Pulsanti, etichette, enfasi | Barlow | 600 | `barlow-600.woff2` |

Stack di fallback: `"Barlow", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
(display: `"Barlow Condensed", "Arial Narrow", sans-serif-condensed, sans-serif`).
Precaricare con `<link rel="preload">` solo `barlow-condensed-800` e `barlow-400`.

### Scala (fluida, mobile → desktop)

| Variabile | Valore | Uso |
|---|---|---|
| `--testo-display` | `clamp(3.5rem, 15vw, 7.5rem)` | `h1` hero, MAIUSCOLO, interlinea 0.9 |
| `--testo-h2` | `clamp(2.25rem, 7vw, 4.5rem)` | Titoli sezione, MAIUSCOLO, interlinea 0.95 |
| `--testo-h3` | `clamp(1.5rem, 4vw, 2.25rem)` | Titoli card |
| `--testo-corpo` | `1.0625rem` (17px) | Paragrafi, interlinea 1.55 |
| `--testo-piccolo` | `0.875rem` (14px) | Didascalie, note |
| `--testo-etichetta` | `0.8125rem` (13px) | Etichette, MAIUSCOLO, `letter-spacing: 0.08em`, peso 600 |

---

## 9. Spaziature, forme, movimento

| Variabile | Valore |
|---|---|
| `--spazio-1` … `--spazio-8` | `4px, 8px, 12px, 16px, 24px, 32px, 48px, 80px` |
| `--spazio-sezione` | `clamp(64px, 12vw, 140px)` (padding verticale delle sezioni) |
| `--larghezza-max` | `1280px` |
| `--margine-laterale` | `clamp(16px, 5vw, 48px)` |
| `--raggio` | `4px` (spigoli netti, tono sportivo) |
| `--raggio-bottone` | `999px` |
| `--taglio-diagonale` | `polygon(0 0, 100% 0, 100% calc(100% - 4vw), 0 100%)` (bordo inferiore delle sezioni) |
| `--durata-breve` | `160ms` |
| `--durata-media` | `320ms` |
| `--curva` | `cubic-bezier(0.2, 0.8, 0.2, 1)` |

- Il testo della `hero` entra solo con movimento (`transform`), **mai** da `opacity: 0`: è l'elemento LCP
  e Chrome non lo conta finché è trasparente (misurato: +2 s di LCP).
- Aree toccabili ≥ 48 × 48 px.
- Pulsante "Prenota" sempre visibile su mobile (barra fissa in basso dopo la `hero`).

---

## 10. Inventario immagini

| File (`sorgenti/`) | Originale ricevuto | Sezione | Note |
|---|---|---|---|
| `foto/hero-calcetto-sera-ai.mp4` | generato dall'immagine sotto | `hero` (video) | **AI** (Seedance 2.0 Mini), camera ferma, si muovono solo reti e alberi. Loop chiuso con dissolvenza di 0,5 s |
| `foto/hero-calcetto-sera-ai.png` | da `campo-calcio-2-ispirarsi.png` | `hero` | **AI** (Nano Banana Pro), fedele al riferimento. Unica variante extra a 1920 px |
| `foto/campi-calcetto-giorno-ai.png` | da `campo-calcio-1-ispirarsi.png` | `campi` | **AI**, vista attraverso la recinzione, palazzi sullo sfondo |
| `foto/campi-calcetto-partita-ai.png` | da `campo-calcio-2.1-ispirarsi.png` | `campi`, `scegli` (calcetto) | **AI**, giocatori lontani e non riconoscibili |
| `foto/campi-tennis-giorno.jpg` | `campo-3.jpg` | `campi`, `scegli` (tennis) | Reale, la foto migliore (1080 px) |
| `foto/campi-bordo-campo.png` | `esterno-parcheggio-1.png` | `galleria` | Reale. Striscione sponsor molto evidente: uso secondario |
| `foto/bar-bancone-trofei-01-ritocco.png` | `interno-bar-1.png` | `bar`, `scegli` (bar) | **Ritocco**: tolti trapano, buste, bottiglie, spray, campana nel lavello, panno, cassa |
| `foto/bar-bancone-trofei-02-ritocco.png` | `interno-bar-3.png` | `bar` | **Ritocco**: stessi oggetti |
| `foto/bar-macchina-caffe-ritocco.png` | `interno-bar-2.png` | `bar` (dettaglio) | **Ritocco**: tolti campana, panno, cassa, caricabatterie, cavi |
| `foto/bar-terrazza-sera.png` | `esterno-bar-4.png` | `bar` | Reale. Lampioni accesi: la più "da terzo tempo" |
| `foto/bar-terrazza-panche.png` | `esterno-bar-5.png` | `bar` / `galleria` | Reale. Luce calda del tramonto |
| `foto/bar-terrazza-tavoli-ritocco.png` | `esterno-bar-3.png` | `galleria` | **Ritocco**: tolti rotolo di plastica e ciotola. Sedie con loghi: uso secondario |
| `foto/dove-siamo-ingresso.png` | `esterno-bar-2.png` | `dove-siamo` | Reale. Ingresso con civico 98 |
| `foto/dove-siamo-insegna.png` | `esterno-bar-1.png` | `dove-siamo` | Reale. Insegna con indirizzo e telefono |
| `riferimenti-ai/*-rif.png` | `campo-calcio-*-ispirarsi.png` | — | Solo riferimento, mai pubblicati |
| `brand/logo-esperia-originale.png` | `logo-esperia.png` | `intestazione`, `pie-di-pagina` | 211 px, raster. Ritagliato a cerchio trasparente in `assets/img/brand/` |

Gli originali non ritoccati restano in `sorgenti/foto/` accanto alle versioni `-ritocco`.

### Procedura di ritocco locale (riproducibile)
1. Nano Banana Pro rimuove **solo** gli oggetti elencati nel prompt.
2. `strumenti/ricomponi.py <originale> <ritocco-ai> <uscita> x1,y1,x2,y2 ...` riallinea il
   ritocco all'originale (SIFT + omografia: l'AI tende a zoomare dell'1–2%) e copia sull'originale
   solo i rettangoli indicati, con bordi sfumati. Tutto il resto resta pixel originale
   (es. il cartello "VIETATO FUMARE", che l'AI aveva alterato).
3. `strumenti/ottimizza.sh <sorgente> assets/img/<sezione> <nome-base>` genera i WebP.

Osservazioni generali:
- Le foto del bar sono 1353 × 757 (probabilmente fotogrammi di un video): vanno bene fino a
  1200 px, non per sfondi a tutto schermo su desktop grande.
- Molti loghi di sponsor (Corona, Coca-Cola, Bud, Motta): evitare che siano il soggetto
  principale di un'immagine grande.

---

## 11. Strumenti AI (Higgsfield)

Criterio: il modello più realistico e fedele al riferimento, al minor costo in crediti.
Costi stimati con `higgsfield generate cost` il 21/10/2026.

| Uso | Modello (`job_type`) | Parametri | Crediti | Perché |
|---|---|---|---|---|
| **Immagini** (ricostruzione e ritocco) | Nano Banana Pro (`nano_banana_pro`) | `--resolution 2k`, `--aspect_ratio 16:9` | 2 | Ottima fedeltà alle foto di riferimento e resa fotografica, allo stesso prezzo di Nano Banana 2/2.1. GPT Image 2 costa 6,5 senza vantaggi per foto reali |
| Alternativa immagini | Seedream 5.0 Pro (`seedream_v5_pro`) | — | 2,5 | Solo se Nano Banana Pro non è fedele su un caso |
| **Video** (loop brevi) | Seedance 2.0 Mini (`seedance_2_0_mini`) | `--start-image`, `--duration 5`, `--resolution 720p`, `--generate_audio false` | 5 | Stessa famiglia del modello video più realistico (Seedance 2.0, 22,5 crediti) a meno di un quarto del costo |

File pubblicati (4,5 s, muti):

| File | Peso | Quando |
|---|---|---|
| `assets/video/hero-calcetto-sera-ai-854.webm` | 105 KB | viewport < 960 px |
| `assets/video/hero-calcetto-sera-ai-854.mp4` | 475 KB | fallback (Safari vecchi) |
| `assets/video/hero-calcetto-sera-ai-1280.webm` | 380 KB | viewport ≥ 960 px |
| `assets/video/hero-calcetto-sera-ai-1280.mp4` | 925 KB | fallback |

Nome: `<sezione>-<soggetto>[-ai]-<larghezza>.<webm|mp4>`. WebM sempre per primo nel `<source>`.
Il video parte con opacità 0 e sfuma in 600 ms sull'immagine `hero` solo all'evento `playing`,
così non c'è salto visivo. Attributi: `muted playsinline loop preload="none"`, nessun `autoplay`
nell'HTML (lo avvia `main.js` quando le condizioni sotto sono vere).

Regole video sul sito: solo come loop decorativo muto (≤ 6 s, ≤ 1,5 MB, H.264 + WebM),
caricato **1,5 s dopo l'evento `load`** (sotto quella soglia Lighthouse lo conta nell'LCP) e solo con connessione veloce
(`navigator.connection.effectiveType === '4g'` e senza `saveData`; dove l'API non esiste, cioè Safari
e Firefox, solo con viewport ≥ 960 px). L'immagine resta sotto il video e il titolo resta l'elemento LCP.

---

## 12. Materiale da chiedere al cliente

- [ ] Logo vettoriale (SVG/AI/PDF): quello ricevuto è un PNG di 211 px
- [ ] Foto originali in alta risoluzione, soprattutto **campi da calcetto di sera con giocatori**
- [ ] Autorizzazione a usare le foto Instagram e liberatorie per le persone riconoscibili
- [ ] Numero e tipo di campi (calcetto a 5/7, tennis: superficie, coperti/scoperti)
- [ ] Orari, indirizzo, telefono, P.IVA
- [ ] Link App Store / Google Play e deep link per calcetto, tennis, bar
- [ ] Menu del bar / piatti forti
