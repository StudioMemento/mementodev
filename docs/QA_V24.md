# Verifiche V24 — 16 novembre 2026

Build di produzione eseguita localmente. Nessun deploy sul dominio del cliente o sull’ambiente di sviluppo remoto.

## Risultati automatici

- `npm run check`: PASS. TypeScript, build client/SSR, prerender, asset e budget.
- `npm test`: PASS. 148 file congelati identici; menù HTML identico alla fixture originale; anchor, dieci dot, due frecce, cinque icone e un solo reticolo nella hero.
- Sei nuove immagini WebP responsive presenti e sotto il budget di 200 KB ciascuna.
- Scheduler reale del carousel: autoplay discreto con easing, pause/ripresa, fuori schermo, scheda nascosta, hover, movimento ridotto, asse verticale e pulizia dei listener verificati dal test esistente.
- Shader DotGrid, MetallicPaint e HoloCard: compile/link GLSL ES 3.0 PASS in EGL/Mesa. Aurora è stato compilato come sorgente storico, ma non viene usato dalla pagina.
- Regression check aggiunto sul CSS compilato: proprietà standard `backdrop-filter` presente sui bordi viewport e sul gradiente delle card. Risolta la perdita della proprietà standard dovuta all’ordine dei prefissi durante la minificazione.

Log completi: `BUILD_V24.log`, `TEST_V24.log`. Misure esatte gzip: `BUILD_METRICS_V24.json`.

## Responsive osservato in Chromium

Verifica della build di produzione attraverso iframe con viewport CSS reali, senza zoom della pagina interna. Le anteprime grandi vengono ridotte solo esternamente per stare sul monitor di verifica.

| Larghezza CSS | Gutter header misurato | Bordo menù / card | Overflow pagina |
|---:|---:|---:|---|
| 320 px | 32 px | 32 px | assente |
| 390 px | 39 px | 39 px | assente |
| 768 px | 115,2 px | 115,2 px circa | assente |
| 844 px, landscape | 126,6 px | griglia tablet | assente |
| 1024 px | 153,6 px | 153,6 px circa | assente |
| 1363 px | 272,6 px | 272,6 px circa | assente |
| 1920 px | 384 px | 384 px | assente |
| 2560 px | 768 px | 768 px | assente |

La precisione subpixel è arrotondata dal browser a 1/64 di pixel. A 390 px, navbar: Home x=39, Chiama bordo destro=351; cinque target 44×44. A 320 px, estremi 32/288. Nessuna trasformazione di scala. In landscape 844×390 la hero misura esattamente 390 px in altezza, con logo, slogan e chevron visibili.

## Interazioni e visual osservati

- Hero senza località, reticolo oro discreto confinato alla sezione; slogan originale, chevron separato.
- Fondo pizze rgb(7,7,8), titolo rgb(198,171,112), senza aurora né reticolo.
- Trascinamento reale con mouse sulla foto: Alpina → Deliziosa, nessun dialogo aperto. Comando freccia: avanzamento corretto e dot aggiornato.
- Caption mobile a y=412,390625 px relativo alla sezione prima/durante il cambio; transform `none`; opacity passa da 1 a 0 e ritorna a 1. Immagini e testi non condividono lo stage in movimento.
- Autoplay osservato dopo uscita del mouse e focus: indice 5 → 7 durante il lavoro sui documenti. Pausa durante interazione e ripresa previste dal controller.
- Click Menù nella navbar: destinazione corretta e aria-current spostato da Home a Menù. Ritorno Home funzionante.
- Tre foto verticali caricate, ripieni distinguibili, testi sulla foto; titolo italiano su due righe. Variante tedesca controllata anche a 320 px senza overflow.
- Dopo l’ultima build: entrambi i blur viewport hanno background rgba(0,0,0,0), backdrop-filter blur(9px); le card hanno blur(8px). Maschera continua, nessuna tinta o serie di strip sovrapposte. Header e navbar non aggiungono pannelli comuni colorati.

## Limiti

Questa sessione Chromium non espone WebGL2: il test visivo ha verificato i fallback Canvas 2D/CSS. I tre shader sono compilati separatamente, ma non è stato misurato il loro rendering GPU nel browser. Il drag è stato provato con mouse; l’intento verticale/touch è coperto dai test del controller, non da un dispositivo fisico. Safari/iOS e dispositivi reali non sono stati testati. Nessuna misura FPS, Lighthouse, Core Web Vitals o prova del deploy remoto è dichiarata.
