# V24 — correzioni dopo il deploy di prova

Base: sorgenti V23. Ambito: hero, slider pizze, cornicioni, navigazione, padding globale e blur viewport. I contenuti del menù e delle sezioni successive rimangono invariati. Nessun deploy remoto eseguito.

## Parametri correnti

| Componente | Comportamento V24 |
|---|---|
| Dot Grid | Solo hero; dotSize 2, gap 48, base #9e8149, active #d9c18b, opacity .5; proximity 320, strength .5, bounce 0, tension .5, returnDuration 3, swell 2, stretch 2, fade .5, clickShock false. |
| Logo | Logo originale con MetallicPaint brushed, softness 1, dispersion 0, distortion 0, edgeBend .5, scale 1, angle 90, speed .25. Stop scuri limitati a grigio chiaro. |
| Slogan | Copy originale; colori #c6ab70 / #f1ece1 / #ddc895, glow .12, followPointer. Due righe su telefono. |
| Blur viewport | Un backdrop-filter 9 px per bordo, maschera alpha continua. Background trasparente, senza tinta, bordi, ombre o layer sovrapposti a fasce. 88/92 px mobile, 100/100 px da tablet, più safe area dove applicabile. |
| Pizza | Dieci originali. Autoplay 6500 ms; easeInOutCubic, transizione base 900 ms. Foto in movimento; caption esterna allo stage, fade out .16 s e fade in .42 s. Le caption sovrapposte riservano l’altezza massima. |
| Cornicioni | Ricotta, Brie, Gorgonzola dolce, € 3,00. Nuove immagini margherita/ripieno, sorgente 1024×1536; WebP 768×1152 e 384×576. Titolo due righe, nessun sottotitolo o CTA. Testo HTML sulla foto e gradiente nero con blur 8 px alla base. |
| Holo | glitter, scale 1.75, hoverScale 1.04, tiltMax 6, radius 8, edgeSparkle .2, intensity .2, glare .12; effetto discreto, ratio 2:3, nessun autoplay idle. |
| Navbar | Cinque anchor native incluse Home. Target 44 px mobile / 48 px oltre 767 px; nessuna magnification. Luce oro alla base della sezione attiva. |

La griglia definitiva e i breakpoint sono in `LAYOUT_V24.md`.

## Fotografie generate

Le tre nuove immagini sono visual illustrativi generati su richiesta, non fotografie documentarie del prodotto reale. Mostrano un trancio di margherita e la sezione aperta del rispettivo ripieno; i testi vengono aggiunti dall’interfaccia. Prompt completi in `IMAGE_PROMPTS_V24.json`. Gli originali del locale, del menù e delle pizze sono invariati.

## Resilienza

Caricamento progressivo dei visual; shader sospesi fuori schermo e con scheda nascosta. Il reticolo dispone di fallback Canvas 2D, il logo e le card di fallback CSS. Menù prerenderizzato nell’HTML. Font e asset locali. Movimento ridotto disattiva autoplay e animazioni decorative.

Le sorgenti Aurora e dock V23 restano come archivio ma non sono importate né incluse nel bundle corrente. Il GradualBlur già presente nel menù resta parte della sezione menù originale; i due bordi globali del viewport usano il nuovo ViewportBlur trasparente.
