# ViaRoma_3_MENU

Checkpoint completo del 17 novembre 2026, versione 3.0.0. Prosegue dalla hero e dall’intro approvate. ZIP sorgente dell’intero sito, pronto per la repository di sviluppo; nessun deploy automatico.

## Modifiche del menù

- **IL MENÙ:** unico elemento del titolo, largo quanto l’area tra i padding. Il font viene misurato dopo il caricamento e adattato anche al resize e al cambio lingua, senza deformare i caratteri. Riflesso oro animato con la palette del logo; sospeso fuori schermo o con movimento ridotto.
- **Categorie:** barra trasparente con singole pillole satinate, sopra il gradual blur. Etichette italiane: CLASSICHE, AUDACI, BIANCHE, CALZONI, CUCINA, SNACK, DOLCI, BEVANDE. Riempie la larghezza utile; scorre quando serve, con sfumatura ai bordi. Chevron mobili fuori dal padding e senza cerchio.
- **Heading delle sezioni:** titolo e copy centrati, copy più grande, spazio superiore. Tratti oro sopra/sotto le immagini più visibili, con riflesso e glow leggero in hover; bordi verticali dell’immagine ammorbiditi. Asset originali conservati.
- **Voci:** prezzi oro, nomi più spaziati, codici allergeni grigi. Leader puntinato anche su mobile, passo 8px. Descrizioni mobili vanno a capo prima della colonna prezzo; i testi lunghi restano integrali e possono occupare più di due righe. Spaziatura ridotta tra le voci, nessun separatore tra categorie.
- **Allergeni:** sfondo sfocato a pieno schermo, contenuto senza riquadro, righe a flusso naturale con numero semplice, nome e descrizione. Inattivi grigio scuro, presenti oro. Nessuna linea sopra/sotto; lista compatta con respiro verticale. Apertura dal nome o dai numeri, chiusura con qualsiasi tap/click, X o Escape. Focus e scroll vengono ripristinati; il comportamento degli altri popup resta distinto.

Palette: carbone `#090909`, satinato `#252524`, oro `#C6AB70`, oro desaturo `#A89B7B`, highlight **`#DAC18B`**.

## Avvio e Vercel

Estrarre lo ZIP e copiare il contenuto della cartella `ViaRoma_3_MENU` nella radice della repository di sviluppo.

```sh
npm ci
npm run dev
npm run check
npm test
```

Node 22.13+ nella serie 22 o Node 24+. Vercel: install `npm ci`, build `npm run build`, output `dist`. Nessuna variabile d’ambiente. La protezione `noindex,nofollow` è conservata.

## Verifiche e limite attuale

TypeScript, build client/SSR, prerender e budget di trasferimento verificati. Tutte le **86 voci** conservano nomi, descrizioni, prezzi, qualificatori e codici allergeni. **181 file protetti** confrontati con SHA-256, inclusi dati, asset, hero, intro e sezioni successive.

Test dei gestori reali: titolo e font load/resize/cambio lingua; navigazione, overflow e movimento ridotto; apertura dal nome/numeri; lista di 15 allergeni in quattro lingue; chiusura e ripristino dello scroll. Restano attivi i controlli precedenti su carosello, hero e tilt.

**La resa visiva non è stata verificata in questo ambiente.** La sessione del browser non riesce ad aprire la preview e il browser headless richiesto non è disponibile. Il test browser è incluso e va eseguito sul nuovo deploy di sviluppo, con conferma finale su Safari iOS e Chrome Android.

Per QA, installare Playwright/Chromium nell’ambiente di test, avviare `npm run preview -- --port 4175` e lanciare `node tests/menu/browser.mjs`. In alternativa impostare `TEST_URL` con l’URL di sviluppo. Se Playwright è esterno al progetto, `PLAYWRIGHT_MODULE` accetta il percorso del suo `index.mjs`. Il test salva riscontri e schermate in `test-results/menu`.

`docs/MENU_CHECKPOINT.md` descrive la revisione. Gli script `verify-v25`, `verify-hero` e `verify-intro`, i documenti e le anteprime dei checkpoint precedenti restano riferimenti storici; il controllo attuale è `npm test`.
