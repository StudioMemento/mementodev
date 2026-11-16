# Pizzeria Via Roma — V24 · Correzione intro

Questa build recepisce le correzioni dopo il deploy V23: reticolo oro limitato alla hero, griglia percentuale condivisa, slider nero con testo fermo, card verticali e cinque icone fisse. Sorgenti completi per il deploy di prova su Vercel. Nessuna pubblicazione remota eseguita.

## Avvio e verifica

Node.js 24 (vedi `.nvmrc`), oppure Node.js ≥22.13.

```bash
npm ci
npm run dev
```

```bash
npm run check
npm test
npm run preview
```

`check`: TypeScript, build, prerender HTML, asset locali e budget. `test`: integrità dei 148 file originali congelati, identità del menù HTML, link, foto responsive, struttura V24 e scheduler reale dello slider con controlli negativi.

## Deploy di prova su Vercel

Estrai lo ZIP nella radice della repository di prova: `package.json` deve essere al livello principale.

- Framework: Vite.
- Install: `npm ci`.
- Build: `npm run build`.
- Output: `dist`.
- Node.js: 24.
- Nessuna variabile d’ambiente, API key o CDN necessaria.

`vercel.json` è incluso. `noindex,nofollow` resta attivo per il sito di sviluppo.

## Griglia definitiva

| Viewport | Sinistra | Contenuto | Destra |
|---|---:|---:|---:|
| Mobile, sotto 768 px | 10% | 80% | 10% |
| Tablet, 768–1199 px | 15% | 70% | 15% |
| Desktop, 1200–2399 px | 20% | 60% | 20% |
| Ultrawide, da 2400 px | 30% | 40% | 30% |

La fonte unica è `src/styles/intro-v24.css`; le regole per le prossime fasi sono in `docs/LAYOUT_V24.md`.

## Modifiche V24

- Hero: punti oro Via Roma, logo argento chiaro, slogan originale con gradiente oro/avorio, località rimossa e chevron più distante.
- Blur fisso superiore/inferiore: singolo layer con maschera continua, nessuna tinta, nessun pannello sovrapposto.
- Pizze: nero, titolo oro, easing cubico di circa 900 ms, didascalia ferma con fade. Foto originali, autoplay 6,5 s, drag/swipe, frecce e dieci dot; nessun popup.
- Cornicioni: titolo su due righe, sottotitolo rimosso. Tre nuove fotografie generate verticali del trancio di margherita con ripieno visibile; etichetta, ingrediente e € 3,00 dentro la foto, su gradiente nero sfocato.
- Navbar: Home, Menù, Via Roma, Info, Chiama; dimensioni fisse, nessun ingrandimento. Su telefono i bordi esterni delle prime/ultime icone coincidono con il padding 10%.

Autoplay sospeso durante hover, focus, trascinamento, dialoghi, scheda nascosta e fuori schermo; disattivato con movimento ridotto. Senza WebGL2 restano griglia Canvas 2D, argento CSS e riflessi CSS delle card. Contenuti, prezzi, allergeni, foto originali e sezioni successive sono conservati; la griglia e la navigazione condivise si applicano a tutta la pagina.

Dettagli e limiti: `docs/RELEASE_V24.md`, `docs/QA_V24.md`. Le istruzioni V24 prevalgono sui documenti storici V22/V23; `npm test` esegue esclusivamente il contratto V24.
