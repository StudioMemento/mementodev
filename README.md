# ViaRoma_3.4_MENU

Checkpoint del 17 novembre 2026, basato sulla 3.3. Sorgenti e asset completi per Vercel; nessun deploy eseguito.

## Modifiche

- Rimossi hover, glow, filtri e livelli di clipping dei tratti delle immagini. Tratti statici, fotografia e sfumatura invariate.
- Dot Grid ufficiale React Bits adattato esclusivamente al menù: un canvas, caricamento differito, parametri richiesti, interazione mouse e touch passiva.
- Zero animazione a riposo; pausa fuori vista, con scheda nascosta o popup aperto. Griglia statica con movimento ridotto o WebGL indisponibile.
- Nessuna nuova dipendenza npm. Conservati i contenuti, i prezzi e gli altri checkpoint.

## Avvio e deploy

Copiare il contenuto di `ViaRoma_3.4_MENU` nella radice della repository di sviluppo.

```sh
npm ci
npm run dev
npm run check
npm test
```

Node 22.13+ nella serie 22 o Node 24+. Vercel: install `npm ci`, build `npm run build`, output `dist`. Nessuna variabile d’ambiente. `noindex,nofollow` conservato.

## Controlli e limiti

La simulazione CPU, i limiti di punti/pixel, lo stop a riposo, il touch e la pulizia delle risorse sono verificati automaticamente. Il motore è un chunk separato di circa 4.7KB gzip, con circa 0.25KB aggiunti al caricamento iniziale. Parametri e limiti sono in `src/components/menu/dot-grid/preset.ts`.

**Resta la verifica visiva e GPU sul deploy di sviluppo**: il browser headless non è disponibile qui. Il test completo è `tests/menu/browser.mjs`, con `TEST_URL` impostabile all’anteprima. Le misure CPU locali non equivalgono a FPS su dispositivi reali.

**Problema Chrome:** nella scheda interessata il CSS è bloccato con `ERR_BLOCKED_BY_CLIENT`, mentre gli stessi asset rispondono HTTP 200 dal server. Va verificata l’estensione o regola del profilo normale che filtra il dominio; la configurazione cache del sito è già corretta. Non sono stati modificati dati o impostazioni di sicurezza del browser.

Dettagli, misure e diagnosi: `docs/MENU_3_4_POLISH.md`. Licenza React Bits: `licenses/ReactBits.txt`. I documenti precedenti descrivono checkpoint storici.
