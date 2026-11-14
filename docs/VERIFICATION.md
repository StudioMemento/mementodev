# Via Roma V20 — verifica del polish

14 novembre 2026. Sorgente: pacchetto React V19, confrontato con il sito originale `pizzeriaviaroma.vercel.app` e la prova `mementodev.vercel.app`. Consegna sorgente per Vercel; nessun push e nessuna pubblicazione eseguiti.

## I sette criteri

| Criterio | Risultato e prova |
| --- | --- |
| Hero | Logo e slogan originali, nero/oro e Jost. Effetti discreti, CTA solo testo e chevron: fondo trasparente, bordo 0, raggio 0. Controllo visivo a 1440, 900, 390 e 320 px. |
| Menù | Conservati prezzi, ricette, descrizioni, aggiunte, bevande, quattro lingue e dati degli allergeni. Le otto immagini del cartaceo coincidono con gli SHA-256 originali. Il testo è già nell'HTML iniziale. |
| Navbar | Quattro elementi indipendenti, con spazi misurati tra le icone e nessun fondo comune. Etichette più leggibili; area delle icone almeno 48 × 48 px. |
| Cinque slideshow | Esterno, Bancone, Sala sinistra, Sala destra, Via Roma: 40 fotografie originali. Centro dominante e laterali sfumate, composizione ripetuta in tutti gli album. Verificati frecce, drag sulle immagini, swipe touch, tastiera e foto corretta nel lightbox. |
| Community | Dodici originali selezionati visivamente senza volti. Rimossi gli inviti a condividere immagini in tutte e quattro le lingue, inclusi i testi inutilizzati che potevano ricomparire. Quattro recensioni originali con attribuzione, lettura manuale e nessuno scorrimento automatico. |
| Contatti | Mappa e informazioni nella disposizione esistente; informazioni prima della mappa su mobile. Card Magic Bento ad angoli retti, luce oro locale di 200 px. Nessun testo troncato in 7 larghezze × 4 lingue. |
| Indicatore scroll | Bordo destro largo esattamente 2 CSS px. A 1440 × 900: tratto visibile di 24 px in cima, 450 px a metà, 900 px in fondo. Non intercetta input. |

Le schermate reali sono in [previews](previews/), comprese le viste dei cinque ambienti su desktop e mobile. I risultati numerici della prova finale sono in `polish-evidence.json`.

## Difetti corretti rispetto alla V19

- Il tratto di avanzamento era invisibile in cima alla pagina.
- Gli slider pizza/categorie cambiavano posizione senza una transizione continua e seguivano poco il gesto.
- La perdita della cattura implicita touch dell'immagine poteva cancellare il trascinamento dello slider: ora viene distinta dalla perdita della cattura del contenitore.
- Alcune regole CSS precedenti imponevano ancora padding alla nuova gallery; ora il centro e le sfumature hanno lo spazio previsto.
- Restavano inviti alla condivisione nei testi social. Sono stati rimossi anche dalle varianti di lingua.
- Le recensioni scorrevano automaticamente e venivano duplicate. Ora le quattro recensioni si leggono con frecce, drag/swipe o tastiera; due visibili sui desktop ampi, una sugli schermi più piccoli.
- Font troppo piccoli nei comandi e nei contatti. Corrette dimensioni e leggibilità mantenendo la grafica del progetto.

## Copertura dei controlli

- Flussi completi: **1440 × 900**, **900 × 1200**, **390 × 844**, **320 × 700**.
- Overflow e contatti: larghezze **320, 390, 768, 900, 1100, 1440, 1920 px**; contatti verificati in IT/EN/DE/FR.
- Touch emulato: cinque album, slider pizza, slider categorie e recensioni; resta disponibile lo scroll verticale nativo.
- Menu e allergeni: confronto con fixture originali, voci e prezzi visualizzati nelle quattro lingue, popup con 15 righe incluso `*`.
- Popup: privacy, cookie e note legali, chiusura con Escape/X/sfondo, selezione testo e ripristino del focus su desktop/mobile.
- Movimento ridotto: sfondo statico, transizioni eliminate, contenuti ancora utilizzabili. Effetti fuori schermo sospesi.
- Rilevamento di errori JavaScript, hydration, console e risposte HTTP di errore durante i flussi.
- Quattro link social e geometria delle card preservati; il copy e il lettore recensioni seguono la nuova richiesta.

## Peso e struttura

- Tutti i moduli JavaScript: **circa 113 KiB gzip**; CSS dopo rimozione dei selettori inutilizzati: **circa 22 KiB gzip**.
- 74 immagini originali indicizzate, con derivati responsive dove disponibili; nessun ritocco delle immagini originali conservate.
- Font, icone e immagini locali; popup e campo di punti caricati in moduli separati.
- Nessun video del vecchio walkthrough, widget social esterno, API key o database.
- Nessuna pubblicazione remota. Il sito temporaneo mantiene `noindex, nofollow` e `Disallow: /`.

Queste sono misure e prove della build locale, non un punteggio Lighthouse né una garanzia di 60 fps. Browser utilizzato: Chromium headless 153.0.8010.0, Node 24.22.1. Viewport e input touch sono emulati; Safari, Firefox e dispositivi fisici non sono stati verificati in questa sessione.

## Riproduzione

```bash
npm ci
npm run check
npx playwright install chromium
npm test
node scripts/capture-polish.mjs
```

Per un Chromium già installato usare `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. I test non inviano messaggi e non attivano chiamate, WhatsApp o collegamenti social esterni. Il confronto dello ZIP con ogni sorgente si esegue con `node scripts/verify-package.mjs`, quando lo ZIP è accanto alla cartella del progetto.

## Distribuzione verificata

Lo ZIP è stato estratto in una cartella pulita, seguito da `npm ci` e `npm run check`: i **139 file di produzione** risultano identici byte per byte alla build verificata. Il controllo del pacchetto confronta ogni file dello ZIP con il sorgente ed esclude dipendenze installate, directory generate, video e configurazioni private.

È stato verificato anche il controllo di regressione dei contenuti: una modifica intenzionale al riferimento di un asset del cartaceo, in una copia separata, viene correttamente rifiutata. La copia è stata poi ripristinata.

## Dati da completare prima della produzione

Privacy, cookie e note legali restano le bozze fornite, con i campi del gestore ancora da completare. Non sono stati inventati dati societari. Prezzi, ricette, orari e allergeni sono quelli ricevuti: le verifiche certificano la loro conservazione nella build, non una nuova validazione del ristorante.
