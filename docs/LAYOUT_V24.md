# Via Roma — griglia V24 e regole per le fasi successive

Le correzioni dell’utente dopo il deploy V23 prevalgono sul markdown precedente. Rapporti sinistra/contenuto/destra riferiti alla larghezza del viewport in CSS pixel.

| Classe | Media query | Gutter per lato | Larghezza contenuto |
|---|---|---:|---:|
| Mobile | larghezza < 768 px | 10vw | 80vw |
| Tablet | 768–1199 px | 15vw | 70vw |
| Desktop | 1200–2399 px | 20vw | 60vw |
| Ultrawide | ≥ 2400 px | 30vw | 40vw |

Implementazione in `src/styles/intro-v24.css`: `--vr-gutter`, `--vr-content`, con `--page-gutter: var(--vr-gutter)` per integrare il menù esistente. La misura dipende dalla larghezza, non dall’orientamento o dal tipo di dispositivo dichiarato.

## Regole di composizione

1. Header, contenuti del menù, titoli e griglia cornicioni condividono gli stessi bordi. Non aggiungere un secondo padding orizzontale ai figli di un contenitore già allineato.
2. Per le nuove sezioni usare padding-inline `var(--vr-gutter)` con contenuto al 100%, oppure un blocco centrato largo `var(--vr-content)`. Non sommare i due sistemi.
3. Le foto dello slider pizze restano a tutta larghezza per mostrare i tagli laterali, con un fade ai bordi del 7%. Titolo e didascalia rispettano la griglia.
4. La navbar mobile è larga 80vw: il bordo sinistro dell’icona Home è al 10%, quello destro di Chiama al 90%. Cinque target da 44×44 px distribuiti equamente. Oltre 767 px, target da 48×48 px su una larghezza massima di 400 px. Nessuna scala su hover o click.
5. Safe area superiore e inferiore si applicano a header/nav. Non cambiano le percentuali orizzontali.
6. Il reticolo appartiene solo a `#home`. Pizze e cornicioni hanno fondo #070708. Nessun layer globale di punti e nessuna aurora.
7. Palette intro: oro #c6ab70, avorio #f1ece1, testo secondario #b9b3a7; reticolo #9e8149 / #d9c18b. Niente accenti arancio.
8. Le tre card restano affiancate. Immagini sorgente 2:3; cornice mobile 3:5 per maggiore verticalità. Nome/prezzo sono HTML sovrapposto, selezionabile e tradotto.

Il file CSS V24 viene importato per ultimo ed è la fonte corrente. Le regole storiche V23 non sono importate nella build.
