# ViaRoma_3.8_MENU

Checkpoint del 18 novembre 2026, basato sulla 3.7. Sorgenti e asset completi per Vercel; nessuna pubblicazione automatica.

## Modifiche

- Quadrati oro su griglia regolare di 6px, con celle vuote casuali e densità decrescente verso l'interno. Dimensioni 1–1,5px CSS; posizioni ferme, twinkle indipendente di 10–22 secondi.
- Due fasce laterali entro i margini approvati, con il centro del menù libero. Proporzioni 10–80–10 / 15–70–15 / 20–60–20 / 30–40–30 conservate.
- Fondo #090909 in tutto il sito, comprese le pagine legali.
- Acqua, bibite, birre e vini non aprono più il popup allergeni.
- Il popup mostra il nome del piatto, i 14 allergeni e la voce sui surgelati. Il nome di ogni allergene precede la descrizione. La lista passa da una a due colonne quando lo spazio verticale si riduce e a tre sui telefoni ruotati più bassi.
- Copy italiano della cucina su due righe da mobile, con interruzione dopo “Anche se incredibile...”.

Nessuna nuova dipendenza applicativa. Dati del menù, prezzi, immagini, contenuti social e testi delle quattro lingue conservati. L'effetto è originale e non richiede React Bits Pro.

## Avvio e deploy

Copiare il contenuto di `ViaRoma_3.8_MENU` nella radice della repository di sviluppo.

    npm ci
    npm run dev
    npm run check
    npm test

Node 22.13+ nella serie 22 o Node 24+. Vercel: install `npm ci`, build `npm run build`, output `dist`. Nessuna variabile d'ambiente. `noindex,nofollow` conservato.

## Performance e verifiche

Configurazione dell'effetto: `src/components/menu/side-squares/preset.ts`. Due Canvas 2D, massimo 6000 quadrati e 1,6 milioni di pixel complessivi, DPR massimo 2, 20 ridisegni/s. Il motore viene caricato vicino al menù; si ferma fuori vista, con scheda nascosta o popup aperto. Movimento ridotto: stato statico. Nessun listener del puntatore o calcolo del layout durante il disegno.

Verificati TypeScript, build client/SSR, prerender, contenuti, interazioni e ciclo di vita dell'effetto. Il painter reale è stato rasterizzato a 390×844, 768×1024, 1440×900 e 3440×1440, a 0, 3 e 6 secondi. I tempi Canvas nativi non misurano gli FPS della pagina o l'hardware mobile.

Il controllo in Chromium 153 sulla build di produzione ha aperto il popup per tutti i 70 piatti in italiano, inglese, tedesco e francese. Le 15 voci, il titolo, la chiusura e la nota del personale risultano visibili senza scorrere in tutte le 39 configurazioni provate. Il campione include 320×480, 320×568, 375×736 e 568×280, oltre a cinque configurazioni con margini di sicurezza emulati. Con testo ingrandito il dialog consente di scorrere fino alla nota.

Per ripetere i test da due terminali, avviare `npm run preview -- --port 4175` dopo la build. Nell'altro terminale usare Playwright e Chromium disponibili nell'ambiente di verifica.

    node tests/menu/browser.mjs
    node tests/menu/dialog-viewport.mjs

Il primo script controlla interazioni, griglia, prezzi e copy. Il secondo apre ciascuna scheda e misura le dimensioni nel browser. `TEST_URL`, `CHROMIUM_PATH`, `PLAYWRIGHT_MODULE` e `QA_DIR` permettono di indicare un'altra anteprima, il browser, il modulo di test e la cartella dei risultati. Playwright serve esclusivamente per questi controlli.

QA Canvas facoltativa: `node tests/menu/render-squares.mjs` e `node tests/menu/estimate-dialog.mjs`, impostando `SQUARES_CANVAS_MODULE` al percorso di `@napi-rs/canvas`. Per il confronto colore, impostare `SQUARES_REFERENCE_IMAGE` allo screenshot originale 544×780. Canvas e Playwright sono strumenti di verifica, non dipendenze richieste dal deploy.

Misure e limiti: `docs/MENU_3_8_POLISH.md`. I documenti precedenti descrivono checkpoint storici.
