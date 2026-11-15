# Via Roma V21 — Integrazione

## Integrità dei dati di partenza

```json
{
  "src/data/menu.json": "b3b2ab1c435338a518df75ed1999747388a04c30595146b4043c93bccf279592",
  "src/data/photos.json": "ee1f16d5342107546d51d406405287e6dfb173e274996379be6eb29bd4ea5c57",
  "src/data/allergens.json": "b6cb1f081cd03b67420856805433dec88776549f9d2b4a6a5ffdd458993dc190",
  "src/data/allergen-info.ts": "5a3ed46caa370862b3eafec2bef5f95b8592b12e99ce506a6197863f46a541eb"
}
```

## Integrazione

- Import CSS in ordine: base V18/V20, effetti V21, interazioni V21, design V21. La classe `v21-ready` è presente nell’HTML statico, senza attesa dell’hydration.
- `SectionAtmosphere` è inserita in menù, social e info; i componenti delle altre sezioni sono integrati dai rispettivi owner.
- Gradual Blur di pagina: alto 144 px e basso 190 px, 8 livelli ciascuno. La navigazione categorie usa un campo da 150 px esteso verso l’alto fino al margine della pagina (228 px complessivi desktop, 218 px mobile, oltre safe-area), senza pannello colorato circoscritto. Il suo contesto di sovrapposizione rimane sopra il blur della pagina, per non sfocare le etichette.
- Menù invariato; bevande con tre colonne prezzo e intestazioni dei formati condivise per birre alla spina e vini.
- Dialogo allergeni con codice, nome e spiegazione in colonne separate, compresa la voce surgelati. Gli allergeni evidenziati hanno una descrizione aggiuntiva per gli screen reader in tutte e quattro le lingue.
- Dialoghi nativi: contenimento del focus, Escape, click sullo sfondo e ripristino del focus al comando di apertura. La logica `DialogContext` originale è mantenuta.
- Sezione social ridotta ai profili Instagram/Facebook: recensioni e piattaforme di recensioni rimosse dal rendering. Contatti, mappa e orari originali conservati.
- Dipendenza GSAP 3.15.1 installata per Accordion Gallery; versione applicazione 21.0.0.

## Verifiche tecniche

Eseguite il 15 novembre 2026 con Node.js 24.22.1:

```text
npm run check && npm test
Exit code: 0
PRODUCTION_CHECK_OK
VIAROMA_V21_VERIFIED
```

TypeScript, build client, build SSR, HTML prerender, pruning CSS e controllo risorse superati. Il verificatore V21 misura 5 file sorgenti invariati, 74 fotografie, 8 immagini del cartaceo, 40 foto del locale e 12 della community. Verifica inoltre unicità degli ID, destinazioni interne, risorse locali, contatti, quattro lingue e rimozione delle recensioni dai social.

Misura di questo checkpoint dopo il pruning: JavaScript complessivo **155 KiB gzip**, CSS **28 KiB gzip**. La build resta nei budget originali di 160.000 e 35.000 byte. Le misure finali e il resoconto della verifica visiva/interattiva sono in `docs/QA_V21.md`.

Confronto aggiuntivo diretto con lo ZIP V20: `menu.json`, `photos.json`, `allergens.json`, `allergen-info.ts` e `translations.json` identici byte per byte. Le modifiche a `i18n.tsx` aggiungono soltanto l’etichetta di accessibilità degli allergeni presenti nel piatto.

## Difetto risolto durante l’integrazione

Il primo controllo delle risorse ha rilevato una foto della community senza derivata `-768.webp`. L’owner Interazioni ha sostituito la costruzione automatica del nome con l’indice immagini: variante ridotta se disponibile, altrimenti originale. La verifica successiva di tutte le risorse ha superato il controllo.

## Revisione browser del popup

Playtesting ha osservato su desktop: dialogo nativo aperto, focus iniziale sul pulsante Chiudi, tre colonne effettive, sfondo con blur 16 px e saturazione ridotta. Escape chiude e restituisce il focus al controllo allergeni di apertura. Il producer ha inoltre identificato e fatto correggere dal responsabile VFX il contesto di sovrapposizione della barra categorie, precedentemente sfocata dal blur fisso superiore. Alla chiusura della lane, il producer riporta superati i controlli core anche a larghezze 390 px e 320 px; il riepilogo finale indipendente resta in `docs/QA_V21.md`.

## Consegna

Sorgenti e asset pronti per il pacchetto Vercel. Nessun deploy o push eseguito da questa lane. I dettagli di uso e configurazione sono nel README. La verifica browser è affidata alla lane Playtesting e alla revisione indipendente del producer.

