# Via Roma V21 — verifica indipendente

Esito: verifiche automatiche e prove funzionali completate. I difetti bloccanti trovati durante il collaudo sono stati corretti dai rispettivi proprietari e ricontrollati. Nessun dato commerciale o immagine originale è stato modificato.

## Ambito

La baseline è `Pizzeria_Via_Roma_V20_Polish.zip`; sono stati esaminati tutti i 17 screenshot e i due video allegati. In `glitch.mkv` (1920×1080, 60 fps, 5,45 s) le pizze entranti si sovrappongono/tagliano intorno a 2,45–3,2 s; una sequenza a 12 fps ha reso riproducibile il difetto. `slider pizze.mkv` (1920×1080, 60 fps, 12,50 s) mostra il confronto del movimento dei caroselli categorie.

Browser: Chromium cloud, desktop 1363 × 936. Layout responsive verificato in un iframe HTML ordinario di 390 × 844 e 320 × 844, con gli stessi asset compilati dell’app. Sono prove di viewport CSS con mouse e tastiera, non emulazione di hardware mobile. La sessione conclusiva ha usato la build statica di produzione.

## Verifiche automatiche

`npm run check` e `npm test` completati dal responsabile integrazione e dal producer. `node scripts/verify-v21.mjs` rieseguito indipendentemente dopo la build finale: exit 0, `VIAROMA_V21_VERIFIED`.

Il verificatore confronta SHA-256 di cinque file dati/logica originali, 74 fotografie e otto banner del menu cartaceo. Controlla tutte le categorie e i cinque album (40 foto locale + 12 community), quattro lingue, HTML prerenderizzato, ID univoci, destinazioni interne, asset compilati, font, pagine legali e link contatti. Conferma rimozione delle recensioni dalla sezione social. Dimensioni finali compresse: JavaScript 155 KiB, CSS 28 KiB. I controlli negativi di ID duplicati e recensioni includono controlli positivi deliberati.

## Risultati desktop e interazioni

| Area | Evidenza osservata |
| --- | --- |
| Hero | Altezza 936 px su viewport 936 px; nessun overflow orizzontale. Logo intestazione e lingua a 68,14 px dai rispettivi bordi. Logo e testo leggibili, riflesso contenuto nel logo. |
| Pizze | Dieci immagini complete. Nove drag lunghi, inclusa la sequenza 05 → 07 → 10 → 02 → 04 → 06, attraversano la giunzione del loop. Nessun rettangolo nero nelle schermate campionate; dopo l’assestamento la card attiva torna a `--slide-x: 0px`. |
| Autoplay pizze | In produzione, con hover e focus esterni al carosello, 01 → 04 in 29,2 s. Pausa esplicita mantiene 04 per oltre 20 s e durante quattro cambi lingua. Ripresa: 04 → 06 in 28,6 s. |
| Cornicione | Tre illustrazioni e prezzi + € 3,00 visibili senza tagli, inclusa Gorgonzola dolce. |
| Categorie | Autoplay osservato 01 → 02. Drag a 390 px porta a I Calzoni (04); una nuova pressione del CTA dopo il drag naviga correttamente a `#cat-calzoni`. |
| Navigazione e menu | Dock Menù e pulsante Bevande raggiungono le rispettive destinazioni. Pillole nitide dopo correzione dei contesti di stacking. Producer ha verificato anche il ritocco finale dello z-index dell’intestazione e l’assenza della linea superiore nel blur locale. |
| Allergeni | Dialogo nativo; focus iniziale su Chiudi; Escape chiude e restituisce il focus al pulsante invocante. Tre colonne desktop 28 / 190 / 738 px. Backdrop effettivo `blur(16px) saturate(.65)`. |
| Bevande | Intestazioni e prezzi hanno coordinate x identiche: 804,17 / 973,06 / 1141,95 px, larghezze 152,89 px. |
| Gallery locale | Tutti i cinque album aprono la foto corretta nel dialogo, immagini complete a 1308 px naturali; totali album 7 / 7 / 9 / 8 / 9. Esterno: ArrowRight ripetuto sposta selezione e focus da 1 a 4; Enter apre foto 4/7, Escape chiude. |
| Community | In questo browser è attivo il fallback HTML: 12 card quadrate persistenti. Autoplay osservato di circa 29 px/s; drag 03 → 05, rilascio regolare; hover mantiene la stessa posizione per 19 s. Una nuova pressione su Giovanni dopo il drag apre la foto 5/12 corretta e completa; Escape chiude. |
| Lingue | IT, EN, DE, FR aggiornano correttamente `html.lang` e il testo della hero. La pausa del carosello rimane attiva durante il cambio. |
| Console | Nessun errore dell’app nelle registrazioni di produzione catturate; i messaggi dell’estensione browser sono esclusi dal risultato applicativo. |

## Layout responsive

| Area | 390 px | 320 px |
| --- | --- | --- |
| Overflow pagina | 0 px | 0 px |
| Gutter globale | 24 px | 20 px |
| Hero | 844 px, uguale al viewport; logo e lingua a 24 px | 844 px, uguale al viewport; logo e lingua a 20 px |
| Bevande | Tre colonne allineate e prezzi visibili | Intestazioni/prezzi identici a x 145 / 199,33 / 253,66 px; larghezze 46,33 px |
| Allergeni | Tre colonne leggibili, descrizioni nella propria colonna | Dialogo 320 px, nessun overflow orizzontale; colonne 21 / 76 / 143 px, scorrimento verticale disponibile |
| Social | 844 px, solo Instagram e Facebook | 844 px, nessun overflow |
| Info | 1180 px per contenere i contenuti; card nei gutter di 24 px | 1220 px per contenere i contenuti, nessun overflow |

Le sezioni social e info hanno altezza minima pari al viewport; la sezione info cresce sui piccoli schermi per mantenere leggibili tutti i dati.

## Correzioni verificate

Risolte regole CSS pregresse che annullavano larghezze/trasformazioni delle pizze, sfocavano la navigazione, posizionavano erroneamente gli sfondi e imponevano gutter mobile diversi. Il fallback community ora mantiene drag e autoplay anche quando il renderer WebGL non si inizializza.

## Limiti e prove conservate

Nessun telefono fisico, Safari/iOS, input touch reale o cambio live di `prefers-reduced-motion` era disponibile. Il renderer WebGL community non è certificato da questa prova: il browser ha mostrato `data-gallery-ready=false`; il fallback è stato verificato. I controlli reduced motion sono stati ispezionati nel codice: autoplay escluso, animazioni decorative disattivate, effetti sospesi fuori vista/a pagina nascosta. Pointercancel e riconoscimento dello scroll verticale sono presenti nel codice, ma non certificati su hardware touch. Le immagini dopo il drag non escludono un singolo fotogramma non campionato; non vengono dichiarati 60 fps o punteggi di prestazioni.

Evidenze temporanee in `/workspace/shared/viaroma-qa/`: `desktop-pizza-wrap.jpg`, `desktop-cornicione.jpg`, `desktop-allergens.jpg`, `desktop-gallery.jpg`, `desktop-lightbox.jpg`, `mobile320-drinks.jpg`, `mobile320-allergens.jpg`, `mobile390-allergens.jpg`, `production320-hero.jpg`, `production390-social.jpg`, `production390-info.jpg`, `production390-categories.jpg`, `production390-community.jpg`, `production390-community-drag.jpg`. Le catture sono documentazione interna, non asset del sito né parte del pacchetto consegnato.
