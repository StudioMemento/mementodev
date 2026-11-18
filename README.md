# ViaRoma_3.9_MENU

Checkpoint del 18 novembre 2026, basato sulla 3.8. Progetto React e Vite con gli asset originali e il menù prerenderizzato.

## Avvio

Dalla cartella che contiene `package.json`, con Node 24 oppure Node 22.13 o successivo della serie 22, eseguire i comandi seguenti.

```sh
npm ci
npm run dev
```

Per verificare il progetto e generare la versione di produzione usare `npm run check` e `npm test`. Per Vercel, copiare il contenuto della cartella `ViaRoma_3.9_MENU` nella radice del progetto di sviluppo. La configurazione inclusa usa `npm ci`, `npm run build` e la cartella di output `dist`. La preview mantiene `noindex,nofollow`.

## Modifiche della 3.9

- La Hero disegna 1.500 particelle oro attorno al marchio. Un tocco genera un’onda di luce e la pressione prolungata accelera il movimento verso l’esterno.
- Lo slider pizze usa un fondo nero puro. Lo stesso tracciato dorato delle immagini incornicia lo slider e chiude il menù.
- Le fasce laterali iniziano nel cornicione, seguono lo scorrimento e scintillano anche a pagina ferma.
- Il popup usa il titolo reale del piatto e lo spazio disponibile per scegliere spaziatura e numero di colonne. In italiano “noci del Brasile” apre una nuova riga e la nota finale recita “Per ulteriori info, chiedi al personale.”
- Nelle birre alla spina e nei vini della casa i formati stanno sulla riga del titolo e sopra i rispettivi prezzi. Le righe desktop riprendono il tratteggio della carta.

## Verifiche in browser

Con Playwright e Chromium disponibili nell’ambiente di verifica, avviare l’anteprima con `npm run preview -- --port 4175`. Da un secondo terminale eseguire questi controlli sulla build.

```sh
node tests/menu/browser.mjs
node tests/menu/dialog-viewport.mjs
```

`TEST_URL`, `CHROMIUM_PATH`, `PLAYWRIGHT_MODULE` e `QA_DIR` permettono di indicare l’anteprima, il browser, il modulo Playwright e la destinazione dei risultati. Le scelte visive e le misure del checkpoint sono in `docs/MENU_3_9_POLISH.md`.

La stima tipografica offline è disponibile con `node tests/menu/estimate-dialog.mjs` e la verifica raster dei particellari con `node tests/menu/render-squares.mjs`. Entrambe accettano `SQUARES_CANVAS_MODULE` per indicare il modulo di test `@napi-rs/canvas`.
