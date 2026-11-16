# Verifica V23 — 16 novembre 2026

## Controlli completati

- `npm run check`: TypeScript, client build, SSR/prerender, riferimenti agli asset e budget superati con esito positivo. Misure in `BUILD_METRICS_V23.json`; transcript in `BUILD_V23.log`.
- `npm test`: 148 file della V22 invariati per SHA-256; menù HTML identico al riferimento; link interni validi, nessun ID duplicato; tre foto in due risoluzioni; rimozione del carosello categorie e dei controlli ridondanti. Integrità verificata anche con mutazioni intenzionali dei dati di prova.
- Scheduler reale del carosello eseguito in ambiente deterministico: 10 elementi, intervallo 6500 ms, autoplay discreto; pausa hover, movimento ridotto, tab nascosto, fuori schermo, rilascio/cancellazione drag e riconoscimento dello scroll verticale. Nessun loop continuo quando fermo.
- Controller reale della navigazione: aggiornamento sezione e pulizia listener. Nel browser il menù attiva `aria-current=location`; icona con base luminosa; pannello trasparente; ingrandimento misurato 80 px.
- Shader DotGrid, MetallicPaint, Aurora e HoloCard compilati e collegati con successo in contesto locale EGL/OpenGL ES 3.0 (Mesa). Verifica opzionale riproducibile con `python tests/v23/check_glsl.py` su ambiente Linux con EGL.

## Prove visive e interazioni

Anteprima della build di produzione, senza deploy remoto. Viewport responsive ricavati con un iframe di collaudo temporaneo, escluso dal pacchetto: 360×800, 390×844, 768×1024, 1024×1366, 1363×936, 1920×1080 e 844×390. `scrollWidth` coincide con `clientWidth` nei sette formati. Hero, card, testi e controlli verificati nelle viste pertinenti.

- Mobile: slogan su due righe, tre card affiancate, importi leggibili, nessun overflow orizzontale. Landscape: composizione più compatta con accesso al chevron.
- Desktop: fascia aurora separata dalle foto; controlli della pizza sopra il blur inferiore; titolo e copy dei cornicioni centrati.
- Drag nativo sopra la fotografia: indice 7 → 8, nessun dialogo. Selezione di testo impedita nello stage; click, frecce, dot e tastiera verificati. Autoplay osservato nel browser, oltre al test deterministico.
- Cambi lingua IT/EN/DE/FR effettuati; ingredienti lunghi controllati a 360 px senza collisione con i dot.
- Header e menù allineati: a 1363 px, padding header 68,15 px, bordo menù 68,15625 px. I blur sono ancorati al viewport, trasparenti, senza intercettare il pointer.
- Nessun errore dell’app rilevato nei log del browser; esclusi avvisi dell’estensione del browser.

## Limiti delle prove

Il browser remoto non espone WebGL2: la verifica visiva ha quindi coperto i fallback Canvas 2D/CSS. Gli shader originali adattati sono compilati e collegati, ma la loro resa animata su GPU non è stata valutata visivamente in questo browser. Non sono state eseguite prove su dispositivi fisici iOS/Android, misure di FPS o Core Web Vitals. Il comportamento touch usa Pointer Events e `touch-action: pan-y`; scroll verticale e rilascio sono verificati nel test del controller.

Le tre nuove immagini dei cornicioni sono visual generati, come richiesto. Foto originali e dati del menù restano gli stessi. Le sezioni successive all’intro sono protette dal confronto di integrità; non sono state oggetto di un nuovo audit estetico.
