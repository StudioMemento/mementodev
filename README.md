# ViaRoma_3.6_MENU

Checkpoint del 17 novembre 2026. Sorgenti e asset completi per Vercel; nessun deploy automatico.

## Modifiche

- Grana oro più fine: quadrati da 0,6 a 1,2 pixel CSS, indipendenti dalla larghezza del monitor.
- Dissolvenze lente, con cicli individuali da 10 a 22 secondi e fasi differenti.
- Posizioni, dimensioni e luminosità distribuite casualmente con un seme stabile. Nessuna griglia regolare o rigenerazione durante l'animazione.
- Densità decrescente dal bordo esterno al menù; dissolvenza morbida prima del padding.
- Fondo #090909 e fasce 10–80–10 / 15–70–15 / 20–60–20 / 30–40–30 conservati.
- Due Canvas 2D, un solo clock, massimo 30 ridisegni/s; pausa fuori vista, con scheda nascosta o popup aperto. Movimento ridotto: stato statico.
- Nessuna dipendenza aggiunta. Contenuti, prezzi, allergeni e altre sezioni preservati.

L'effetto è originale, ispirato alla reference visiva richiesta. Non è il componente React Bits Pro e non richiede il registro shadcn.

## Avvio e deploy

Copiare il contenuto di `ViaRoma_3.6_MENU` nella radice della repository di sviluppo.

```sh
npm ci
npm run dev
npm run check
npm test
```

Node 22.13+ nella serie 22 o Node 24+. Vercel: install `npm ci`, build `npm run build`, output `dist`. Nessuna variabile d'ambiente. `noindex,nofollow` conservato.

## Effetto e verifica

Configurazione unica: `src/components/menu/side-squares/preset.ts`. Dimensioni in pixel CSS e tempi in secondi: modificabili senza aggiungere livelli CSS o effetti sovrapposti. Motore caricato soltanto vicino al menù, con budget verificato sotto 4KB gzip. Limiti conservati: 2400 quadrati totali, 1 milione di pixel totali e DPR massimo 1.25. Nessun input mouse/touch/scroll, nessuna lettura del layout nel ciclo di disegno.

Verificati automaticamente: contenuti, regressioni, geometria, dimensioni, durate, falloff, frequenza di disegno, pause, movimento ridotto e cleanup. Il painter reale è stato rasterizzato a 0, 3 e 6 secondi su quattro formati, controllando anche ogni pixel della colonna centrale. Misure native: 0,51–1,85ms medi per frame. Non includono compositing del browser, blur della pagina o dispositivi reali.

**Resta il controllo nel browser e sui dispositivi reali.** Chromium non si avvia in questo ambiente. Le misure locali escludono il compositing del browser e non costituiscono una promessa di FPS su iOS/Android.

Dettagli e misure: `docs/MENU_3_6_POLISH.md`. I documenti precedenti descrivono checkpoint storici.
