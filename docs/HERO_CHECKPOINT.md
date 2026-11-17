# STEP 1 — HERO

Output: **ViaRoma_1_HERO**. Data: 16 novembre 2026.

Modificati Hero, aspetto della navigazione e blur del chrome. Menù, slider, cornicioni, gallery, community, social, contatti, traduzioni, foto e prezzi sono quelli della V25.

## Preset

| Elemento | Parametri |
| --- | --- |
| Particelle | `#FFE3A3` / `#FFB27A`; 1500 desktop, 750 sotto 768px; size 0.4; spread 0.75; hollow 0.5; speed 0.25; turbulence 0.25; twinkle 1; focus 0.5; aperture 1; size variance 1; glint size 2.5; boost 14 |
| Hollow | Centro misurato dal logo. Raggio derivato dall'ingombro visibile del PNG, con margine; nessun centro fisso a 50vh |
| Liquid | Density 2.6; softness 1; distorsione del campo luminoso 0.22; angle 70°; speed 1; luminanza 0.62–1; influenza mouse 0.08 |
| Testo | Colori del TXT `#FFE0CA`, `#FFBF92`, `#FFE0CA`; 5s alternato; 90°; scala 250%; glow leggero; nessun bordo |
| Blur | 8 livelli; intensità `0.125 × 2^i` px, ultimo livello 16px; maschere alfa sovrapposte; tinta assente; altezza top 5rem / bottom 6rem + safe area |
| Navbar | Satinato opaco; luce `#DAC18B` dal basso; transizioni 550–650ms; resa dei tasti indipendente da backdrop-filter |

Parametri Canvas/WebGL: `src/components/hero/preset.ts`. Tinta navbar e gradiente testo: `src/styles/hero.css`. Componenti isolati in `src/components/hero/`.

## Interpretazione delle reference

Implementazioni leggere dedicate, con Canvas 2D, WebGL e CSS, a partire dalle immagini, dai video e dalle configurazioni fornite. Il componente proprietario React Bits Pro Glimmer Wrap non è incluso.
Il nero V25 è conservato al posto del #090909 della demo, per non introdurre stacchi tra sezioni.
Dispersione cromatica e deformazione dei contorni Metallic Paint sono disattivate per conservare il logo: la distorsione riguarda solo la luce, non le coordinate dell'immagine.
Lo slogan usa i colori di FX_Text.txt. Lo screenshot della demo mostra una variante più bianca, ottenibile dalle due variabili CSS senza modificare la tipografia.

## Verifiche e limiti

- `npm run check`: TypeScript, build client/SSR, prerender, asset, noindex, budget gzip.
- `npm test`: menù #carta identico; 166 file originali invariati; inerzia e scheduler slider; ciclo di vita e geometria del renderer hero.
- `node scripts/verify-package.mjs`: ogni file ZIP confrontato col sorgente; radice, sorgenti, asset e assenza di dependency/build folder.
- Verifica browser non completata: Chromium locale termina con socket Operation not permitted. Il browser remoto non raggiunge localhost e blocca file locali. Non si dichiara un pass visivo o una prova iOS/Android.

## Controllo sul deploy di sviluppo

Verificare a 1440×900, 390×844, 360×800, 844×390 e 768×1024: leggibilità logo durante il liquid; hollow centrato; tipografia invariata; blur sopra immagini ad alto contrasto; luce del tasto attivo durante lo scroll. Verificare anche Safari iOS e Chrome Android reali, rotazione, movimento ridotto e ripresa dopo cambio scheda.

Nessun deploy effettuato. Le prossime sezioni restano fuori da questo checkpoint.
