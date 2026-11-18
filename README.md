# ViaRoma_4.0_MENU

Checkpoint del 18 novembre 2026, basato sulla 3.9. Progetto React e Vite con gli asset originali e il menù prerenderizzato.

## Avvio

Dalla cartella che contiene `package.json`, con Node 24 oppure Node 22.13 o successivo della serie 22, eseguire i comandi seguenti.

```sh
npm ci
npm run dev
```

Per verificare il progetto e generare la versione di produzione usare `npm run check` e `npm test`. Per Vercel, copiare il contenuto della cartella `ViaRoma_4.0_MENU` nella radice del progetto di sviluppo. La configurazione inclusa usa `npm ci`, `npm run build` e la cartella di output `dist`. La preview mantiene `noindex,nofollow`.

## Modifiche della 4.0

- Una linea oro piena da 1 px segna l'inizio e la fine dello slider e l'uscita dal menù.
- La carta distingue i produttori di birra in bottiglia, le sottocategorie delle bevande e le categorie principali con tre diverse spaziature.
- I titoli italiani sono “Le stuzzicherie”, “I dolci” e “Le bevande”.
- Nella didascalia di Monte Jouf il ripieno e la base iniziano su righe distinte in tutte le lingue del sito.
- I chevron dello slider hanno pulsanti da 52 a 64 px e funzionano anche al tocco e da tastiera.

## Verifiche in browser

Con Playwright e Chromium disponibili nell’ambiente di verifica, avviare l’anteprima con `npm run preview -- --port 4175`. Da un secondo terminale eseguire questi controlli sulla build.

```sh
node tests/menu/browser.mjs
node tests/menu/dialog-viewport.mjs
```

`TEST_URL`, `CHROMIUM_PATH`, `PLAYWRIGHT_MODULE` e `QA_DIR` permettono di indicare l’anteprima, il browser, il modulo Playwright e la destinazione dei risultati. Le scelte visive e le misure del checkpoint sono in `docs/MENU_4_0_POLISH.md`.

La stima tipografica offline è disponibile con `node tests/menu/estimate-dialog.mjs` e la verifica raster dei particellari con `node tests/menu/render-squares.mjs`. Entrambe accettano `SQUARES_CANVAS_MODULE` per indicare il modulo di test `@napi-rs/canvas`.
