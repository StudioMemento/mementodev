# ViaRoma_3.7_MENU

Checkpoint del 17 novembre 2026. Sorgenti e asset completi per Vercel; nessun deploy automatico.

## Modifiche

- Grana oro più visibile: quadrati da 1 a 1,5 pixel CSS, allineati ai pixel del canvas per conservare nitidezza.
- Dissolvenze individuali da 10 a 22 secondi, con fasi diverse e picchi di luminosità più leggibili. Posizioni e dimensioni restano ferme.
- Distribuzione irregolare con seme stabile, densità decrescente verso il menù e dissolvenza morbida nella parte interna delle fasce.
- L'estensione della grana si ferma a 520px per lato: i monitor ampi non diluiscono il disegno. Anche il canvas termina lì, senza allocare la parte vuota del margine.
- Fondo #090909 e proporzioni della colonna centrale 10–80–10 / 15–70–15 / 20–60–20 / 30–40–30 conservati.
- Due Canvas 2D, un solo clock, massimo 20 ridisegni/s; pausa fuori vista, con scheda nascosta o popup aperto. Movimento ridotto: stato statico.
- Nessuna dipendenza aggiunta. Contenuti, prezzi, allergeni, immagini e altri effetti preservati.

L'effetto è originale, ispirato alla reference visiva richiesta. Non è il componente React Bits Pro e non richiede il registro shadcn.

## Avvio e deploy

Copiare il contenuto di `ViaRoma_3.7_MENU` nella radice della repository di sviluppo.

    npm ci
    npm run dev
    npm run check
    npm test

Node 22.13+ nella serie 22 o Node 24+. Vercel: install `npm ci`, build `npm run build`, output `dist`. Nessuna variabile d'ambiente. `noindex,nofollow` conservato.

## Effetto e verifica

Configurazione unica: `src/components/menu/side-squares/preset.ts`. Dimensioni in pixel CSS e tempi in secondi, senza sovrapporre nuove regole o livelli di effetti. Motore caricato soltanto vicino al menù, con budget verificato sotto 4KB gzip. Massimo 6000 quadrati, 1,6 milioni di pixel di canvas complessivi, DPR massimo 2 e 62 riempimenti per fotogramma. Nessun input mouse/touch/scroll, nessuna lettura del layout nel ciclo di disegno. Geometria e strutture di lavoro preparate una sola volta al ridimensionamento.

Il deploy 3.6 è stato osservato in Chrome nelle quattro classi di breakpoint. La nuova 3.7 è verificata tramite build, regressioni e rasterizzazione del painter reale a 390×844, 768×1024, 1440×900 e 3440×1440, a 0, 3 e 6 secondi. Un confronto con lo screenshot fornito misura anche la presenza dei pixel oro visibili: non ci si limita alla correttezza dei parametri.

Il controllo live usa lo zoom di Chrome per cambiare il viewport CSS. Non è un test su dispositivi fisici. La 3.7 non è stata pubblicata né osservata nel browser: i tempi di disegno locali escludono il compositing, il blur della pagina e l'hardware iOS/Android.

QA native facoltativa: eseguire `node tests/menu/render-squares.mjs` impostando `SQUARES_CANVAS_MODULE` al percorso di un modulo `@napi-rs/canvas` già disponibile. Impostare anche `SQUARES_REFERENCE_IMAGE` per ripetere il confronto con lo screenshot originale 544×780 del 17 novembre, non una miniatura. Il modulo Canvas è soltanto uno strumento di verifica: non serve per build o deploy.

Dettagli, limiti e misure: `docs/MENU_3_7_AUDIT.md`. I documenti precedenti descrivono checkpoint storici.
