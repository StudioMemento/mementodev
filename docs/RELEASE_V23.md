# V23 — Intro al menù

Base: Pizzeria_Via_Roma_V22_Polish_Vercel.zip. Precedenza: istruzioni dell’utente del 16/11/2026, sopra l’audit allegato. Nessuna pubblicazione remota.

## Preset e adattamenti

| Elemento | Implementazione e valori |
|---|---|
| Background | React Bits DotGrid: dotSize 2, gap 48, colori #f97316, proximity 320, strength .5, bounce 0, tension .5, returnDuration 3, shockRadius 80, shockStrength 0, swell 2, stretch 2, fade .5, clickShock false. Sui tre blocchi dell’intro. |
| Logo | MetallicPaint ufficiale, immagine logo originale: density 2, softness 1, dispersion 0, distortion 0, edgeBend .5, scale 1, angle 90, speed .25. Stop scuro sostituito da grigio chiaro, RGB minimo .70; logo originale sottostante. |
| Slogan | GradientText ufficiale: #ffe288 / #ffffff / #ffbf92, glow .2, followPointer, borderWidth 1 senza bordo visibile; 8 s. Copy originale. |
| Blur | GradualBlur, top 96 px / bottom 116 px desktop; 84/98 mobile, più safe area. Sei layer, tint trasparente, pointer-events none. |
| Dock | Coseno e molla del Dock adattati ad anchor native: distanza 400, gap 20, picco 80; base 52/48 px. Nessun pannello, label visibili o badge. Luce #eab308 alla base dell’icona attiva. |
| Aurora | Componente ufficiale: #f97316 / #eab308 / #ef4444, height .3, glow 2, blend 0, layers 2, intro false, direzione top. Contenitore confinato sopra lo stage fotografico. |
| Holo | Componente ufficiale: glitter, scale 1.75, hoverScale 1.1, radius 8, tiltMax 15, edgeSparkle .2. Intensity .32, glare .16; ratio 4:3 per foto food; DPR max 1.5. |
| Carousel | Dieci fotografie originali, loop stabile, autoplay 6500 ms. Due frecce e dieci dot; target dot 44 px in altezza. Touch-action pan-y, axis lock e pointer capture dopo intento orizzontale. Nessun dialogo pizza. |

I componenti ufficiali sono in `src/vendor/v23-react-bits/`; sorgenti acquisiti dal repository ufficiale DavidHDev/react-bits il 16/11/2026. Link ai preset nel brief dell’utente. GradualBlur usa l’adattamento già presente.

## Padding

Un solo token `--vr-gutter`, riutilizzato dal menù originale: 20 px fino a 380 px, 24 px fino a 700 px, `clamp(20px,5vw,96px)` oltre 700 px. Header e card cornicioni usano il medesimo bordo. Le foto del carosello restano full bleed con fade laterale.

## Fotografie aggiunte

Tre composizioni generate con AI su richiesta: due parti di cornicione spezzato su pietra scura, luce calda, ripieno leggibile. Ingredienti ricavati dai dati originali: ricotta, brie, gorgonzola dolce, tutti +€3,00. Non sono fotografie documentarie del prodotto reale. File WebP 960×720 e 480×360; gli originali del locale e delle pizze non sono stati ritoccati.

## Performance e resilienza

MetallicPaint e DotGrid caricati separatamente dopo l’attivazione della hero; Aurora e Holo vicini al viewport. Animazioni sospese quando non visibili; caricamento foto progressivo; font locali. Menù prerenderizzato nell’HTML. Fallback Canvas 2D e CSS quando WebGL2 non è disponibile; layout e controlli rimangono uguali.

Misure della build: initial JS 103.856 byte gzip; tutti i chunk JS 180.597 byte gzip; CSS 30.298 byte gzip; HTML 21.496 byte gzip. Il budget totale JS V22 di 160.000 byte è stato portato a 185.000 per i nuovi shader richiesti, con nuovo limite separato di 105.000 byte sul grafo iniziale. Budget CSS invariato a 35.000. Queste sono dimensioni di build, non misure di FPS o Core Web Vitals.
