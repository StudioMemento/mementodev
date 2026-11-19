# Via Roma 4.2

Build di sviluppo per Pizzeria Via Roma a Maniago. La 4.2 riprende la 4.1 e amplia le gallerie e le sezioni finali.

## Avvio e deploy

Lo ZIP contiene `package.json`, `vercel.json` e i sorgenti direttamente alla radice. Per il progetto Vercel di sviluppo, estrarre il contenuto nella radice della repository. Il preset è Vite. La configurazione usa `npm ci`, `npm run build` e la directory di output `dist`. L’anteprima mantiene `noindex,nofollow`.

Usare Node 24 o Node 22 dalla versione 22.13.

```sh
npm ci
npm run dev
```

## Sezioni finali

- **Il locale.** Esterno, Bancone, Sala sinistra, Sala destra e Via Roma raccolgono 40 fotografie. Ogni ambiente occupa una schermata. Il nastro panoramico porta le immagini 4:3 fino ai bordi, con una sfumatura laterale. Il trascinamento parte dalla foto, il click porta uno scatto al centro e le frecce della tastiera permettono di avanzare. Su touch lo scorrimento verticale resta disponibile.
- **La community.** Dodici foto quadrate a colori scorrono con il nome dell’autore in grigio a sinistra. Un tap o Invio ingrandisce lo scatto nel nastro. Le foto laterali, lo swipe e le frecce cambiano scatto. Un altro tap sulla foto o Esc riporta al nastro. Le miniature si trovano in `public/assets/ribbons`. L’ordine e le attribuzioni si modificano in `src/data/photos.json`.
- **Social e recensioni.** Le sei immagini oro e carbone sono in `public/assets/social`. I sei collegamenti sono in `src/data/venue-links.ts`. Google apre le recensioni del locale. La tessera con l’indirizzo apre la sua scheda Maps.
- **Info e contatti.** La mappa illustrata di Maniago affianca il logo, gli orari, lo stato di apertura nel fuso Europe/Rome, telefono e WhatsApp. Il credito del footer usa il wordmark Memento fornito.
- **Privacy, Cookie e Note legali.** Il popup carica la pagina nella lingua selezionata. La stessa pagina è raggiungibile direttamente, anche con JavaScript disattivato. I testi italiani si trovano in `public` e quelli tradotti in `public/en`, `public/de` e `public/fr`. Il lettore mantiene il titolo e il pulsante di chiusura in vista durante lo scorrimento.

Le informative sono bozze. Prima della pubblicazione il gestore deve completare i dati societari e il contatto privacy, confermare il trattamento dei dati, i tempi di conservazione, la configurazione dell’hosting e le autorizzazioni per le foto della community.

## Verifiche

```sh
npm run check
npm test
npm run preview -- --host 127.0.0.1 --port 4175
```

Con l’anteprima avviata, Playwright e Chromium disponibili nell’ambiente di test, eseguire da un secondo terminale:

```sh
node tests/finale/browser.mjs
node tests/menu/browser.mjs
node tests/menu/dialog-viewport.mjs
```

`TEST_URL`, `PLAYWRIGHT_MODULE` e `CHROMIUM_PATH` permettono di indicare URL di anteprima, modulo Playwright e browser. Il controllo del pacchetto si avvia con `DEPLOY_ZIP=/percorso/ViaRoma_4.2_Vercel.zip node scripts/verify-package.mjs`. I documenti in `docs` descrivono i checkpoint precedenti.
