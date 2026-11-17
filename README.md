# ViaRoma_3.1_MENU

Polish 3.1 del 17 novembre 2026, basato su ViaRoma_3_MENU. ZIP completo del sito per la repository di sviluppo. Nessuna pubblicazione automatica.

## Modifiche

- **MENÙ:** eliminato l’articolo, tracking più ampio, parola adattata tra i padding senza deformare i caratteri. La misura compensa anche lo spazio dopo l’ultima lettera.
- **Navbar categorie:** satinatura più marcata e semitrasparente; testo inattivo bianco anche in hover, solo l’attivo oro. La sfumatura agisce sulle pillole che escono dai bordi. La prima pillola torna esattamente a inizio lista, con margine interno per evitare tagli del bordo. Livello sopra il gradual blur conservato.
- **Titoli categoria:** riflesso oro e glow leggero in hover, nella palette del logo.
- **Immagini:** glow leggero sulla sagoma originale. Nessun cambiamento di scala, forma o sfumatura dei tratti durante l’hover; transizioni di opacità più morbide ai bordi dell’immagine.
- **Voci:** nomi con più tracking; ingredienti più grandi e leggermente più chiari; puntini più piccoli con passo invariato. Prezzi oro e descrizioni integrali.
- **Allergeni:** nome del piatto più grande; etichetta ALLERGENI grigio scuro sotto. Numero separato dal testo da un piccolo spazio aggiuntivo; nome e descrizione condividono un rientro, con tutte le righe successive allineate. Testi e interlinea aumentati; sugli schermi bassi il popup scorre. Chiusura con tap ovunque, X o Escape conservata.

Nota finale: **“Per ulteriori informazioni, chiedi al personale.”**

Palette: carbone `#090909`, satinato `#252524`, oro `#C6AB70`, oro desaturo `#A89B7B`, highlight **`#DAC18B`**.

## Avvio e deploy

Estrarre lo ZIP e copiare il contenuto di `ViaRoma_3.1_MENU` nella radice della repository di sviluppo.

```sh
npm ci
npm run dev
npm run check
npm test
```

Node 22.13+ nella serie 22 o Node 24+. Vercel: install `npm ci`, build `npm run build`, output `dist`. Nessuna variabile d’ambiente richiesta; `noindex,nofollow` conservato.

## Verifiche

- TypeScript, build client/SSR, prerender e budget di trasferimento.
- 86 voci: nomi, ingredienti, prezzi, qualificatori e codici allergeni conservati.
- 180 file protetti confrontati; traduzioni verificate separatamente, con la sola modifica autorizzata alla nota italiana. Hero, intro e asset originali preservati.
- Gestori reali: title fit con tracking, font load/resize/lingua, estremi del rail anche con overscroll, maschere per pillola, apertura e chiusura allergeni, struttura delle 15 righe e ordine del titolo/etichetta.
- Controlli regressione precedenti su hero, carosello e Holo Card.

**Prova visiva della 3.1 ancora da completare:** il browser headless richiesto non è disponibile nell’ambiente. Non vengono dichiarati test su Safari iOS o Chrome Android. Il test aggiornato è incluso in `tests/menu/browser.mjs`; avviarlo in un ambiente QA con Playwright e Chromium installati, impostando `TEST_URL` sul deploy di sviluppo. Il valore predefinito è `http://127.0.0.1:4175/`.

Dettagli in `docs/MENU_3_1_POLISH.md`. Documenti e anteprime dei checkpoint precedenti sono riferimenti storici; `npm test` esegue i controlli attuali.
