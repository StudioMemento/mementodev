# ViaRoma_3.2_MENU

Polish 3.2 del 17 novembre 2026, basato su ViaRoma_3.1_MENU. Pacchetto sorgente completo per Vercel; nessuna pubblicazione eseguita.

## Modifiche

- Tratti sopra/sotto le immagini disegnati da un unico elemento con lo stesso gradiente e spessore di 1px. Hover coordinato: più luce e glow oro, con forma e sfumatura stabili. Conservato il glow leggero dell’immagine.
- Puntinato ripristinato: punti da 1px con passo di 8px, più affidabili della precedente trama subpixel su schermi a densità standard.
- Le sette birre in bottiglia hanno descrizione e formato nello stesso flusso di testo, senza interruzione forzata: per esempio **IPA 0,5 l**. Disponibile tutta la larghezza della voce; eventuali ritorni a capo naturali restano possibili con testi ingranditi o schermi molto stretti.
- **“Chiedi al personale la disponibilità del giorno!”** centrato, oro highlight `#DAC18B`, dimensione responsive 22–28px.

Tutti i dati, prezzi, asset e i precedenti checkpoint di hero, intro, navbar e allergeni sono conservati.

## Avvio e deploy

Copiare il contenuto della cartella `ViaRoma_3.2_MENU` nella radice della repository di sviluppo.

```sh
npm ci
npm run dev
npm run check
npm test
```

Node 22.13+ nella serie 22 o Node 24+. Vercel: install `npm ci`, build `npm run build`, output `dist`. Nessuna variabile d’ambiente. `noindex,nofollow` conservato.

## Verifiche

TypeScript, build client/SSR, prerender e budget di peso verificati. Confronto delle 86 voci, con la sola formattazione autorizzata delle sette descrizioni delle birre. 185 file protetti e test delle interazioni precedenti conservati.

**La prova visiva 3.2 resta da completare sul deploy di sviluppo:** il browser headless richiesto non è disponibile in questo ambiente. Il test aggiornato è `tests/menu/browser.mjs`; usa `TEST_URL` per puntarlo al deploy da un ambiente QA con Playwright e Chromium installati. Non sono dichiarati test reali su Safari iOS/Chrome Android.

Dettagli in `docs/MENU_3_2_POLISH.md`. Documenti e anteprime precedenti descrivono checkpoint storici.
