# Via Roma 4.3

Build di sviluppo per Pizzeria Via Roma a Maniago. La 4.3 rifinisce le gallerie, i contatti e le recensioni a partire dalla 4.2.

## Avvio e deploy

Lo ZIP contiene `package.json`, `vercel.json` e i sorgenti direttamente alla radice. Per il progetto Vercel di sviluppo, estrarre il contenuto nella radice della repository. Il preset è Vite. La configurazione usa `npm ci`, `npm run build` e la directory di output `dist`. L’anteprima mantiene `noindex,nofollow`.

Usare Node 24 o Node 22 dalla versione 22.13.

```sh
npm ci
npm run dev
```

## Sezioni finali

- **Il locale.** I cinque titoli introducono da vicino i rispettivi panorami. Le 40 foto arrivano ai bordi dello schermo. Trascinamento, frecce e click per centrare una foto funzionano anche con il movimento automatico in pausa.
- **La community.** Gli undici scatti a colori mantengono le proporzioni originali e il nome dell’autore. Il nastro si esplora trascinando, con il trackpad o con le frecce. La barra spaziatrice controlla il movimento. Foto e attribuzioni si trovano in `src/data/photos.json`.
- **Social e recensioni.** Instagram e Facebook occupano la prima riga. Google Reviews, Tripadvisor, Restaurant Guru e Sluurpy occupano la seconda. I collegamenti sono in `src/data/venue-links.ts`.
- **Contatti.** La foto con l’indirizzo apre Maps. Logo, orario, WhatsApp e telefono completano la griglia. Le due sezioni usano i margini del menù e lo stesso passaggio dal bianco e nero all’oro. Le particelle emergono durante l’interazione e sfumano per tre secondi all’uscita. L’impostazione di movimento ridotto mantiene il solo cambio cromatico.
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

`TEST_URL`, `PLAYWRIGHT_MODULE` e `CHROMIUM_PATH` permettono di indicare URL di anteprima, modulo Playwright e browser. Il controllo del pacchetto si avvia con `DEPLOY_ZIP=/percorso/ViaRoma_4.3_Vercel.zip node scripts/verify-package.mjs`. I documenti in `docs` descrivono i checkpoint precedenti.
