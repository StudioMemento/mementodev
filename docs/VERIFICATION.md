# Verifiche V19

Data: 14 novembre 2026. Base di confronto: contenuti e risorse della V18 acquisiti direttamente dal sito pubblico. Nessuna pubblicazione e nessuna modifica a repository remote.

Verifica di ripresa: corretto un ripristino intermittente del focus alla chiusura dei popup. Il focus torna al comando di apertura nello stesso aggiornamento che chiude il pannello, senza attendere un frame di animazione. Il controllo copre Escape, X e click sullo sfondo, sia desktop sia mobile.

## Ambito verificato

| Verifica | Copertura |
| --- | --- |
| Build | TypeScript strict, Vite client e prerender HTML statico, risorse locali e budget dei moduli |
| Menù | Dati V18, 61 piatti principali, prezzi, descrizioni, aggiunte, bevande e quattro lingue; SHA-256 delle otto immagini del cartaceo |
| Allergeni | Legenda originale in quattro lingue, mapping effettivamente mostrato confrontato con la funzione V18, 15 righe nel popup incluso `*` |
| Slideshow | Frecce e drag sopra immagini di pizza/categorie, swipe touch, cinque album, indicatori, foto corretta nel lightbox e cambio foto |
| Popup legali | Tutti e tre i testi; apertura, click interno, selezione, Escape, X, backdrop, ripristino scroll e focus; desktop e mobile |
| Social | Quattro link, testi e recensioni preservati; confronto di undici blocchi con la V18 a 1440, 900 e 390 px: dimensioni, font, pesi, colori, tracking e colonne coincidono |
| Responsive | Flussi completi a 1440×900, 900×1200, 390×844 e 320×700; overflow e numeri nei contatti anche a 768, 1100 e 1920 px |
| Scroll | Indicatore destro 2 px, 0% in cima e 100% in fondo; scrollbar nativa della pagina nascosta; scorrimento verticale touch disponibile |
| Movimento | Preferenza reduced-motion, ticker fermo fuori schermo, loop degli effetti sospesi fuori viewport; nessun aggiornamento continuo dello stato React durante lo scroll |
| Risorse | 90 immagini originali conservate e relativi derivati responsive; 40 foto dei cinque ambienti, 28 scatti community selezionati visivamente senza volti |
| Distribuzione | Archivio completo e confronto SHA-256 di ogni file contenuto con il sorgente; esclusi video del walkthrough, dipendenze installate, configurazioni private e cartelle generate |

Il confronto social normalizza soltanto la scrollbar della V18, per isolare la modifica globale richiesta: nasconderla libera i 15 px del suo gutter, senza modificare le regole del social.

## Misure della build

- JavaScript di tutti i moduli: circa **115 KiB gzip**, inclusi i moduli separati di popup e sfondo.
- CSS distribuito dopo pulizia: circa **22 KiB gzip**.
- Il menù è incluso nell'HTML iniziale. Font, icone e immagini sono locali.
- Nessun errore JavaScript, errore di hydration o risposta HTTP di errore rilevato durante i flussi verificati.

Le misure sono della build locale. Non costituiscono una misura Lighthouse o una garanzia di frame rate su qualsiasi dispositivo.

## Riproduzione

```bash
npm ci
npm run check
npx playwright install chromium
npm test
```

I controlli sono in `scripts/verify-*.mjs` e usano fixture V18 in `tests/fixtures/`. Il confronto dell'archivio, quando lo ZIP si trova accanto alla cartella del progetto, si esegue con `node scripts/verify-package.mjs`.

I test di questa consegna sono stati eseguiti con Node 24 e Chromium headless 153, con viewport e input touch emulati. Safari, Firefox e dispositivi fisici non sono stati testati in questa sessione. Il pacchetto è preparato per una prova su una nuova repository; nessun deploy remoto è stato eseguito.

## Contenuti da finalizzare prima della produzione

Privacy, cookie e note legali restano le bozze V18, con i campi del gestore da completare. Il sito di prova è predisposto con `noindex`. I dati del menù e degli allergeni rimangono quelli forniti nella V18.
