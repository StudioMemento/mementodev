# ViaRoma_3.5_MENU

Checkpoint del 17 novembre 2026. Sorgenti e asset completi per Vercel; nessun deploy automatico.

## Modifiche

- Dot Grid completamente rimosso, insieme a fisica, input e CSS dedicati.
- Effetto originale di piccoli quadrati oro che pulsano e sfumano nelle sole fasce laterali del menù.
- Fondo menù #090909; centro di lettura senza canvas o particelle.
- Proporzioni già condivise con il layout: mobile 10–80–10, tablet 15–70–15, desktop 20–60–20, ultrawide 30–40–30.
- Due canvas piccoli e un solo clock, 30 ridisegni/s al massimo; pausa fuori vista, con scheda nascosta o popup aperto. Movimento ridotto: immagine statica.
- Nessuna nuova dipendenza npm. Preservati contenuti, prezzi, allergeni e sezioni approvate.

L'effetto è originale, ispirato alla reference visiva richiesta. Non è il componente React Bits Pro e non richiede il registro shadcn.

## Avvio e deploy

Copiare il contenuto di `ViaRoma_3.5_MENU` nella radice della repository di sviluppo.

```sh
npm ci
npm run dev
npm run check
npm test
```

Node 22.13+ nella serie 22 o Node 24+. Vercel: install `npm ci`, build `npm run build`, output `dist`. Nessuna variabile d'ambiente. `noindex,nofollow` conservato.

## Effetto e verifica

Configurazione unica: `src/components/menu/side-squares/preset.ts`. Il motore differito pesa circa 1.75KB gzip e si carica soltanto vicino al menù. I limiti sono 2400 quadrati totali, 1 milione di pixel totali e DPR massimo 1.25.

Verificati automaticamente: contenuti, regressioni, confinamento geometrico, frequenza di disegno, pause, movimento ridotto, assenza di listener per mouse/touch/scroll e cleanup. Il disegno Canvas 2D è stato anche rasterizzato e misurato localmente: nessun pixel entra nella colonna di lettura.

**Resta il controllo nel browser e sui dispositivi reali.** Chromium non si avvia in questo ambiente. Le misure locali escludono il compositing del browser e non costituiscono una promessa di FPS su iOS/Android.

Dettagli e misure: `docs/MENU_3_5_POLISH.md`. I documenti precedenti descrivono checkpoint storici.
