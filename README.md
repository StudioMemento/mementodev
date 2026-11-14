# Pizzeria Via Roma — V19 React Polish

Pacchetto sorgente completo per la nuova repository di prova e un successivo deploy Vercel. Basato sulla versione V18 online, acquisita il 14 novembre 2026. Nessun push o deploy è stato eseguito durante la preparazione.

## Avvio

Usa Node.js **22.12 o superiore** (verifica eseguita con Node 24).

```bash
npm ci
npm run dev
```

Build e anteprima della versione di produzione:

```bash
npm run check
npm run preview
```

Il comando `check` verifica TypeScript, genera la build statica e controlla risorse e dimensioni. `dist/` viene ricreata dalla build; non serve inserirla nella repository.

## Nuova repository e Vercel

1. Estrai lo ZIP. Copia **il contenuto** della cartella nella root della nuova repository: `package.json`, `vercel.json`, `src/` e `public/` devono essere allo stesso livello.
2. Carica questi file nella repository di prova. Non occorrono i vecchi file HTML/JS della V18.
3. Quando vuoi provarlo online, importa la nuova repository in un progetto Vercel separato.
4. Impostazioni: **Framework Vite**, installazione `npm ci`, build `npm run build`, output `dist`, root directory della repository.
5. Non occorrono variabili d'ambiente, chiavi API, backend o database.

`vercel.json` contiene già i comandi corretti. Non caricare `node_modules`, `.ssr`, `.vercel` o file `.env`.

La versione è predisposta per prove temporanee con `noindex, nofollow` in `index.html` e negli header Vercel, e `Disallow: /` in `public/robots.txt`. Queste impostazioni evitano l'indicizzazione ordinaria, **non rendono privato il sito**. Prima del passaggio al dominio definitivo vanno aggiornate esplicitamente, insieme ai testi legali definitivi.

## Interventi applicati

- Conversione a React + TypeScript + Vite, con componenti e dati separati.
- Hero con logo originale, slogan invariato, campo di punti React Bits, entrata tipografica discreta, lieve risposta del logo al puntatore e CTA testuale con chevron.
- Dock con quattro icone in riquadri indipendenti; nessuna pillola comune.
- Scrollbar della pagina nascosta e avanzamento verticale di **2 px** sul margine destro. Lo scorrimento nativo rimane disponibile.
- Vecchio walkthrough a scroll rimosso, inclusi video e spazio riservato.
- Cinque slideshow indipendenti: **Esterno, Bancone, Sala sinistra, Sala destra, Via Roma**. Immagine centrale, laterali sfumate, trascinamento sulle immagini, swipe, frecce, indicatori e lightbox per ambiente.
- Community con 28 scatti selezionati senza volti. Rimosso l'invito a inviare una foto da questa sezione.
- Magic Bento reale di React Bits per community e contatti: spigoli netti, alone oro contenuto, niente tilt, magnetismo, stelle o onde al click.
- Gradual Blur reale di React Bits per i bordi della pagina, della navigazione menù e della gallery.
- Privacy, cookie e note legali in popup: chiusura esterna, X ed Escape; testo selezionabile, focus restituito al comando di apertura. Restano disponibili le pagine HTML autonome.

## Elementi preservati

- **Sezione social invariata:** testi, quattro collegamenti, composizione, recensioni, attribuzioni e date. Anche la frase «Se ti va condividi il tuo ricordo» resta in questa sezione, come richiesto nell'ultima indicazione.
- **Menù e introduzione del cartaceo:** sequenza iniziale, titoli, immagini originali, prezzi, ingredienti, aggiunte, bevande e traduzioni della V18.
- Slogan «La pizza di sempre, con un tocco in più!», logo, Jost, nero e oro Via Roma.
- Numero di telefono, WhatsApp, indirizzo e orari della V18. L'indicatore aperto/chiuso usa il fuso `Europe/Rome`.
- Dati e logica allergeni della V18, inclusa la voce `*` per i prodotti surgelati. Nessuna ricetta o indicazione alimentare è stata reinventata.

## Prestazioni e accessibilità

- Il menù è già nell'HTML generato durante la build; React aggiunge le interazioni.
- Font WOFF2, icone e immagini locali. Nessun caricamento di Google Fonts o widget social esterni.
- Immagini con dimensioni esplicite, `loading="lazy"` fuori dalla hero e varianti responsive per le fotografie grandi. Le immagini del cartaceo rimangono identiche ai file originali.
- Dialoghi e sfondo interattivo caricati in moduli separati.
- CSS della V18 filtrato durante la build per eliminare selettori inutilizzati senza ricreare la grafica del menù/social.
- Nessuno stato React aggiornato a ogni frame di scroll. Le animazioni imperniate su `requestAnimationFrame` si sospendono fuori schermo o con scheda nascosta.
- `prefers-reduced-motion`: sfondo statico, ticker fermo, animazioni e transizioni ridotte. Slider utilizzabili con tastiera; pulsanti nominati; dialoghi nativi con focus contenuto.
- La lingua vive in memoria per la sessione della pagina: nessun cookie o `localStorage` aggiunto.

## Dove modificare i contenuti

| Contenuto                          | File                                                       |
| ---------------------------------- | ---------------------------------------------------------- |
| Piatti, prezzi, aggiunte e bevande | `src/data/menu.json`                                       |
| Testi e quattro lingue della V18   | `src/data/translations.json`                               |
| Nuovi testi brevi della V19        | `src/i18n.tsx`                                             |
| Cinque album e scatti community    | `src/data/photos.json`                                     |
| Recensioni originali               | `src/data/reviews.json`                                    |
| Popup legali                       | `src/data/privacy.html`, `cookie.html`, `note-legali.html` |
| Pagine legali autonome             | Gli stessi tre file in `public/`                           |
| Polish grafico                     | `src/styles/polish.css`                                    |
| Componenti React Bits adattati     | `src/vendor/react-bits/`                                   |

Se cambi un testo legale, aggiorna sia il frammento in `src/data/` sia la pagina in `public/`. Le regole originali in `v18-*.css` sono mantenute come base visiva; aggiungi modifiche mirate nel foglio del polish.

## Verifiche ripetibili

```bash
npm ci
npm run check
npx playwright install chromium
npm test
```

I test avviano un server HTTP locale temporaneo e lo chiudono al termine. Coprono contenuti, immagini, slider, lingue, allergeni, lightbox, popup, scroll e movimento ridotto. Non inviano messaggi e non aprono i collegamenti esterni di telefono, WhatsApp o social.

Per usare un Chromium già installato si può impostare `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. In ambienti CI limitati è disponibile `QA_BROWSER_ADAPTER`, percorso di un modulo Chromium compatibile; non è usato dalla build o dall'applicazione.

## Prima della versione definitiva

Le pagine legali della V18 contengono già campi da completare per il gestore. Sono stati preservati: il nuovo popup non trasforma queste bozze in informative definitive. Nessun dato societario è stato inventato. L'elenco delle foto selezionate è in `docs/PHOTO_SELECTION.md`; i riferimenti delle dipendenze e le relative licenze sono in `THIRD_PARTY.md` e `licenses/`.
