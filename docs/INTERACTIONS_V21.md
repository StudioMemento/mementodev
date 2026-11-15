# Via Roma V21 — Interazioni

## Pizza e categorie

I caroselli mantengono un nodo immagine stabile per ogni elemento. Il trascinamento modifica una posizione continua, con cattura del puntatore solo dopo aver riconosciuto un gesto orizzontale. La pagina continua quindi a scorrere normalmente sui gesti verticali. Il rilascio termina su una posizione leggibile, con inerzia contenuta; frecce e tastiera restano disponibili.

Gli elementi si riciclano matematicamente oltre il bordo del viewport, senza smontare le immagini quando cambia la selezione. Lo stesso motore serve il fallback continuo della community, mantenendo una posizione libera senza scatto. È stato rimosso il conflitto con le vecchie regole V17/V18 che imponevano `transform: none`, larghezze obsolete e sfondi neri ai nuovi elementi. Le fotografie originali delle pizze hanno un fondo RGB nero: la composizione `screen` dell’intero stage lo fonde stabilmente con il fondo, anche durante le sovrapposizioni.

- Pizze: avanzamento ogni 7,2 secondi, categorie ogni 8,2 secondi, con assestamento progressivo.
- Pausa esplicita; sospensione con hover, focus in tutta la sezione, trascinamento, popup aperto, scheda nascosta, sezione fuori schermo e preferenza di movimento ridotto.
- Dopo un comando manuale, l’autoplay attende almeno l’intervallo più 4 secondi. Se resta il focus nella sezione, riparte dopo che l’utente lo sposta altrove.
- Nessun loop di rendering continuo quando il carosello è fermo: il timer riattiva il rendering al prossimo avanzamento.
- Tutte le categorie mantengono i collegamenti alle sezioni originali del menù.

## Cornicione

Tre card dedicate, con illustrazioni vettoriali separate fornite dalla lane Design: Ricotta, Brie e Gorgonzola dolce. I supplementi vengono letti direttamente dalle prime tre righe di `menu.json > CORNICE`: `3,00` ciascuno, senza duplicare un listino alternativo. Testi e indicazioni di interazione sono disponibili in IT, EN, DE e FR.

## Fotografie del locale

Cinque album conservati: Esterno, Bancone, Sala sinistra, Sala destra, Via Roma. Implementazione originale React Bits **Accordion Gallery**, con:

`radius=0`, `tilt=20`, `ease="power4.out"`, `parallax=1`, `expandRatio=0.6`, `gap=12`, `showLabels=false`.

Adattamenti Via Roma: selezione controllata, pulsanti nativi, spostamento del focus insieme alle frecce della tastiera, doppio comportamento touch (prima espansione, poi apertura), frecce e comando di ingrandimento espliciti. Le immagini attive si aprono nel lightbox condiviso. Su schermi stretti l’altezza è ridotta, il gap visivo è 6 px e viene preservato lo scorrimento verticale della pagina. I titoli sono centrati tra i margini globali.

## Fotografie della community

Implementazione originale React Bits **Circular Gallery** WebGL2:

`bend=0`, `gap=0`, `fadeEdges=0.2`, `scrollEase=0.3`, `borderRadius=0`, `shadow=1`, `itemAspect=1`, `wave=0`, `snap=false`, `autoScroll=0.5`.

Si conservano le 12 fotografie selezionate nella V20. Le texture usano le versioni piccole registrate in `images.json`, quando esistono; negli altri casi usano il file originale. Font Jost locale; nessun download di font esterno. L’apertura della foto usa il lightbox comune, sia da puntatore sia da tastiera. Lo scroll verticale della rotella attraversa la pagina; il carosello risponde al gesto orizzontale o a Shift + rotella. Autoplay disattivabile e sospeso con popup aperto o movimento ridotto. In assenza di WebGL2 subentra una galleria DOM con parità funzionale per il preset piatto: movimento continuo 0,5, trascinamento diretto con inerzia senza scatto, fotografie quadrate senza gap, sfumatura ai bordi, lieve enfasi centrale e gli stessi comandi di apertura. Il fallback rispetta pause, focus, popup, visibilità e movimento ridotto.

## Provenienza

Sorgenti ufficiali recuperati il 15 novembre 2026 e conservati in `src/vendor/galleries/`, con gli adattamenti sopra descritti:

- [Accordion Gallery — documentazione](https://reactbits.dev/components/accordion-gallery)
- [AccordionGallery.tsx — sorgente](https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/Components/AccordionGallery/AccordionGallery.tsx)
- [Circular Gallery — documentazione](https://reactbits.dev/components/circular-gallery)
- [CircularGallery.tsx — sorgente](https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/Components/CircularGallery/CircularGallery.tsx)

Autore upstream: David Haz / React Bits. Licenza MIT + Commons Clause, già inclusa in `licenses/react-bits-LICENSE.md`. Accordion utilizza GSAP; Circular Gallery utilizza WebGL2 direttamente. I caroselli pizza/categorie e gli adattamenti di integrazione sono codice Via Roma V21.

## Verifica

TypeScript senza errori. La verifica indipendente in produzione ha confermato sei trascinamenti lunghi delle pizze con ricircolo, autoplay, pausa persistente e ripresa; autoplay e link delle categorie a 390 px; navigazione da tastiera e lightbox di tutti i cinque album; autoplay continuo, trascinamento, pausa hover e apertura foto della community. Nessun errore applicativo rilevato nei log controllati. Il browser di verifica non ha inizializzato WebGL2: è stato verificato il fallback DOM funzionale, non il rendering GPU. Le larghezze mobili sono state verificate nel browser, senza simulare una prova su hardware touch fisico. I dettagli sono in `docs/QA_V21.md`.
