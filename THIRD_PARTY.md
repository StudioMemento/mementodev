# Risorse e licenze — Via Roma 5.5

- React / React DOM, Vite e TypeScript: pacchetti npm, versioni fissate da `package-lock.json`, licenze nei pacchetti.
- Jost: font locale WOFF2, pesi 200/300/400/500. Licenza OFL inclusa in `licenses/Jost-OFL.txt`.
- Phosphor Icons: font thin, ridotto ai 14 glifi utilizzati dal CSS locale conservandone le forme. Licenza MIT inclusa in `licenses/Phosphor-MIT.txt`.
- Logo, fotografie del locale, artwork del menù e mappa: materiali già forniti/serviti dal progetto Via Roma. Le 40 fotografie della gallery sono soltanto ridimensionate e ricodificate WebP, senza ritocco del contenuto.
- Tre immagini dei cornicioni: visual generati su richiesta nelle precedenti iterazioni, riutilizzati con ritaglio CSS. Testi e prezzi sono HTML.

La base V25 rimuoveva i componenti React Bits, i relativi shader/renderer e GSAP. Il controller del carosello e i layout sono implementati nei sorgenti di questa applicazione. Non vengono caricati font, script o immagini da CDN esterne.

La hero aggiunge implementazioni originali Canvas 2D, WebGL e CSS ispirate alle reference visive fornite. Il codice React Bits Pro non è incluso. Nessuna nuova libreria di animazione è stata aggiunta.

Le card dei cornicioni, dell’asporto e delle foto su Google Maps condividono inclinazione, ingrandimento e riflesso satinato. Il puntatore o un trascinamento orizzontale controllano l’intera card.

Il background 3.5–3.8 è un'implementazione originale Canvas 2D, autorizzata dall'utente, ispirata alla reference visiva Blinking Squares. Non include il sorgente React Bits Pro e non richiede la sua licenza o il registro shadcn. Dot Grid e tutto il relativo codice derivato sono stati rimossi. Nessuna nuova dipendenza npm.

Le gallerie e il bento della 4.1 riprendono i preset visivi Panorama, Flat e Magic Bento indicati dal committente. Il codice di proiezione e interazione è implementato nel progetto. Le miniature panoramiche derivano dalle 40 foto del locale. Il wordmark Memento usa i tracciati del file fornito DEV_20_Typo.svg.

Le otto immagini in `public/assets/social` sono visual generati e ottimizzati in WebP. La serie 4.6 comprende sei marchi delle piattaforme, WhatsApp e un pittogramma di smartphone per la scheda «Chiama». La finitura riprende il campione Instagram della 4.4. Le icone hanno fondo trasparente e condividono la superficie carbone delle schede. I marchi delle piattaforme appartengono ai rispettivi titolari.

Le 40 immagini dello slider provengono dal pacchetto ViaRoma_40_Pizze_Slider. La pizza Via Roma deriva dal campione fotografico fornito, le altre 39 sono ricostruzioni generate. La fotografia illustrativa della Margherita nel cartone da asporto è stata generata per la 5.3 ed esportata in tre risoluzioni WebP.

La copertina della card «Le foto degli ospiti» è stata generata per la 5.5. Le tre risoluzioni WebP sono in `public/assets/foto-ospiti`. Le immagini degli ospiti sono consultabili su Google Maps.
