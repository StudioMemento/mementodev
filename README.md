# ViaRoma_3.3_MENU

Polish 3.3 del 17 novembre 2026, basato su ViaRoma_3.2_MENU. Sorgenti e asset completi per Vercel.

## Modifiche

- Hover delle immagini: highlight leggero soltanto sui tratti superiore e inferiore, con glow rivolto verso l’esterno. Nessun filtro, trasformazione o effetto hover sulla fotografia. La maschera sfumata rimane invariata.
- Puntinato: micro-segmenti da **1px**, passo **8px**, grigio scuro **#252524**.
- Birre alla spina e vini della casa: eliminati i frammenti di puntinato. Desktop con nomi a sinistra e tre colonne di prezzi allineate ai rispettivi formati. Mobile con nome a tutta larghezza, seguito da tre formati e prezzi affiancati; eventuali descrizioni sotto il nome. Dimensione dei nomi e prezzi coerente con le altre voci del menù.

Conservati dati, prezzi, asset, birre in bottiglia, nota dolci e checkpoint precedenti di hero, intro, navbar e allergeni.

## Avvio e deploy

Copiare il contenuto della cartella `ViaRoma_3.3_MENU` nella radice della repository di sviluppo.

```sh
npm ci
npm run dev
npm run check
npm test
```

Node 22.13+ nella serie 22 o Node 24+. Vercel: install `npm ci`, build `npm run build`, output `dist`. Nessuna variabile d’ambiente; `noindex,nofollow` conservato. Nessuna pubblicazione eseguita.

## Verifiche e revisione visiva

Controlli inclusi: TypeScript, build client/SSR, prerender, budget di peso, confronto delle 86 voci del menù, associazione dei 18 prezzi ai formati di birre alla spina e vini, integrità di 185 file protetti e test delle interazioni.

**La revisione visiva 3.3 resta da completare sul deploy di sviluppo:** il browser headless richiesto non è disponibile in questo ambiente. `tests/menu/browser.mjs` copre viewport da 320 a 3440px e quattro lingue; eseguirlo con Playwright/Chromium installati e `TEST_URL` impostato all’anteprima. Non sono dichiarati test reali su Safari iOS/Chrome Android.

Dettagli in `docs/MENU_3_3_POLISH.md`. I documenti precedenti descrivono checkpoint storici.
