# ViaRoma_2_INTRO

Checkpoint completo del 17 novembre 2026, versione 2.0.0. Include la hero 1.1 approvata e il secondo pass su carosello pizze e card cornicione. Nessun deploy automatico.

## Modifiche

- **Carosello ultrawide:** visibilità, precaricamento e riciclo calcolati dalla viewport e dalla larghezza delle pizze. Un elemento di margine oltre ogni bordo; la sequenza viene duplicata solo quando serve a riciclare fuori schermo. Inerzia, velocità, drag, frecce e dots conservati.
- **Titolo cornicione:** stessa classe tipografica della hero, con identici font, peso, dimensioni responsive, interlinea, tracking e gradiente oro. Animazione sospesa fuori sezione e con movimento ridotto.
- **Card:** eliminato “aggiunta di” in tutte le lingue. Nome in basso a sinistra, prezzo in basso a destra, allineati sul fondo. Sfumatura verticale inferiore su tutti i dispositivi.
- **Holo Card:** preset 15° / scala 1.1; intensity, frame, glare, radius ed edgeSparkle a zero. Implementazione dedicata al preset senza foil, con CSS perspective e Pointer Events. Segue il mouse; su touch segue pressione e trascinamento orizzontale, consentendo movimento su entrambi gli assi una volta agganciato. Il gesto verticale iniziale resta scroll nativo.
- **Mobile:** sezione su 100svh, tre card più basse, spazio per header e navbar. Foto riposizionate al 42% verticale: il ripieno scende verso il centro. Landscape compatto con tre colonne.

## Palette

Nero carbone `#090909`, satinato `#252524`, oro `#C6AB70`, oro desaturo `#A89B7B`, highlight **`#DAC18B`**. Logo e immagini originali conservati.

## Avvio e deploy Vercel

Copiare il contenuto di `ViaRoma_2_INTRO` nella radice della repository di sviluppo.

```sh
npm ci
npm run dev
npm run check
npm test
```

Node 22.13+ nella serie 22 o Node 24+. Vercel: install `npm ci`, build `npm run build`, output `dist`. Nessuna variabile d'ambiente o chiave richiesta. `noindex,nofollow` conservato.

## Verifiche

- TypeScript, build client/SSR, prerender e budget di trasferimento.
- 36.009 posizioni del carosello tra 320 e 7680px, 360 ricicli fuori viewport e verifica del precaricamento.
- Gestore reale del carosello: passaggio 10↔20 elementi, resize, nessuna lettura di layout nel ciclo di animazione, pulizia risorse.
- Gestore reale del tilt: mouse, touch, limiti 15°/1.1, rilascio, annullamento del gesto, scroll verticale, coordinate dopo scroll/resize, movimento ridotto e cleanup.
- **173 file protetti** confrontati con SHA-256. Hero HTML identica; effetti hero e stili esterni al cornicione preservati. Menù prerenderizzato identico.
- Nessuna nuova dipendenza runtime. JS iniziale: 98.232 byte gzip, +900 byte rispetto alla hero 1.1; CSS: 7.588 byte gzip.

**La nuova resa browser non è ancora validata.** Il browser collegato non è disponibile in questo turno; il renderer locale non è utilizzabile e il download del browser headless non è riuscito. I test numerici e di comportamento non sostituiscono una prova visiva su Safari iOS / Chrome Android. Checklist e limiti in `docs/INTRO_CHECKPOINT.md`.

Per il test browser, installare Playwright e Chromium nell'ambiente QA, avviare `npm run preview -- --port 4174`, poi eseguire `node tests/intro/browser.mjs`. `TEST_URL` può puntare al nuovo deploy di sviluppo.

I documenti V25/HERO e le relative anteprime descrivono checkpoint precedenti. Lo ZIP contiene l'intero sito, non solo una patch.
