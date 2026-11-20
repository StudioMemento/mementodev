# Via Roma 5.1

Build di sviluppo per Pizzeria Via Roma a Maniago. Il marchio orizzontale in testata usa i tracciati originali ingranditi. Le cinque icone della navbar condividono la stessa griglia e lo stesso spessore di tratto. La lingua e la categoria attive conservano il bordo e il glow dorato. Le particelle appaiono soltanto sul controllo sotto il puntatore. Il focus da tastiera mantiene un contorno dedicato.

La sezione «Dal nostro forno» occupa 120 vh. La pizza selezionata resta al centro della fila per cinque secondi prima di passare alla successiva. Le due frecce occupano lo spazio tra il piatto centrale e quelli laterali. Titolo, nome e ingredienti partono dal bordo sinistro della navbar inferiore. Le 40 pizze si possono sfogliare anche con trascinamento, swipe e tastiera. Con movimento ridotto la selezione è manuale e immediata.

Le otto immagini di categoria hanno un filetto dorato di tre pixel, più sottile alle estremità. Ogni filetto occupa una fascia propria. Dopo le bevande, un banner panoramico accosta il testo «Facciamo anche servizio da asporto!» alla pizza in cartone sulla destra. Su telefono usa il ritaglio dedicato e adatta le righe alla lingua e allo spazio disponibile.

## Avvio e deploy

Lo ZIP contiene `package.json`, `vercel.json` e i sorgenti direttamente alla radice. Per il progetto Vercel di sviluppo, estrarre il contenuto nella radice della repository. Il preset è Vite. La configurazione usa `npm ci`, `npm run build` e la directory di output `dist`. L’anteprima mantiene `noindex,nofollow`.

Usare Node 24 o Node 22 dalla versione 22.13.

```sh
npm ci
npm run dev
```

## Sezioni finali

- **Il locale.** I cinque titoli restano vicini ai rispettivi panorami, con una pausa più ampia tra gli ambienti. Il trascinamento orizzontale sullo slider lascia libero lo scorrimento verticale della pagina. Le 40 foto arrivano ai bordi dello schermo. Trascinamento, frecce e click per centrare una foto funzionano anche con il movimento automatico in pausa.
- **La community.** Il nastro presenta le 47 voci dello ZIP con i crediti originali. Una foto di Gretabeta è stata ritagliata prima di esportare entrambe le versioni WebP. Due coppie condividono la stessa immagine. La distanza di base tra gli scatti è di 4 px in entrambe le gallerie. Il nastro si esplora trascinando, con il trackpad o con le frecce. La barra spaziatrice controlla il movimento. La velocità in pixel al centro corrisponde a quella dei panorami, che ruotano di 3,2° al secondo. Foto e attribuzioni si trovano in `src/data/photos.json`.
- **Social e recensioni.** Instagram e Facebook sono affiancati in formato 2×1 su desktop e 1×1 su telefono. Le quattro recensioni quadrate seguono su una o due righe. I collegamenti sono in `src/data/venue-links.ts`.
- **Contatti.** La veduta distingue la pizzeria con un pin oro e Piazza Italia con un rombo avorio. Due linee collegano le etichette ai punti sulla mappa. Toccandola si apre Maps. Su desktop il logo, gli orari e i due contatti occupano la colonna destra. Su mobile la mappa occupa tutta la larghezza, seguita dal riquadro che unisce logo e orari e dalle due azioni. Gli orari e il giorno di chiusura sono centrati su due righe della stessa larghezza. Le icone su fondo carbone passano dall’80% al 100% di saturazione mentre un riflesso satinato segue il puntatore lungo i bordi. Al centro resta una leggera luce diagonale. Il riquadro Chiama mostra una cornetta dorata. Le particelle emergono durante l’interazione e sfumano per tre secondi all’uscita. Con movimento ridotto il riflesso assume una posizione fissa.
- **Fondo della galleria e dei contatti.** Le particelle si concentrano lungo i bordi, seguono orbite lente e risalgono in una corrente che richiama dolcemente le particelle vicine al puntatore o al tocco. Con movimento ridotto restano ferme.
- **Privacy, Cookie e Note legali.** Il popup carica la pagina nella lingua selezionata. La stessa pagina è raggiungibile direttamente, anche con JavaScript disattivato. I testi italiani si trovano in `public` e quelli tradotti in `public/en`, `public/de` e `public/fr`. Il lettore mantiene il titolo e il pulsante di chiusura in vista durante lo scorrimento. Nel footer mobile i crediti precedono il separatore e i tre link legali lo seguono.

La scheda di raccolta per il gestore viene consegnata separatamente. Per completare le informative occorre inserire i dati societari e il contatto privacy, confermare il trattamento dei dati, i tempi di conservazione, la configurazione dell’hosting e le autorizzazioni per le foto della community.

## Verifiche

```sh
npm run check
npm test
npm run preview -- --host 127.0.0.1 --port 4175
```

Con l’anteprima avviata, Playwright e Chromium disponibili nell’ambiente di test, eseguire da un secondo terminale:

```sh
node tests/intro/catalog-browser.mjs
node tests/intro/viewport.mjs
node tests/finale/browser.mjs
node tests/finale/navigation.mjs
node tests/menu/browser.mjs
node tests/menu/dialog-viewport.mjs
```

`TEST_URL`, `PLAYWRIGHT_MODULE` e `CHROMIUM_PATH` permettono di indicare URL di anteprima, modulo Playwright e browser. Il controllo del pacchetto si avvia con `DEPLOY_ZIP=/percorso/ViaRoma_5.1_Vercel.zip node scripts/verify-package.mjs`. I documenti in `docs` descrivono i checkpoint precedenti.
