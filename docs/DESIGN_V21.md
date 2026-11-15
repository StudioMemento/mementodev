# Via Roma · Direzione V21

Il linguaggio rimane quello del menù originale: nero caldo, oro, Jost, fotografie vere e composizioni ariose. Il polish rende più chiara la scelta e più morbido il percorso, senza cambiare il materiale del ristorante.

## Sistema comune

- Un solo padding orizzontale: `--vr-gutter: clamp(24px, 5vw, 96px)`, 24px sotto 700px e 20px sotto 360px. Header, contenuti, titoli delle gallery e blocchi finali si allineano allo stesso bordo.
- Oro `#c6ab70`, testo avorio `#f1ece1`, testo secondario `#b9b3a7`. I titoli leggeri hanno un’interlinea controllata; le righe di lettura mantengono un contrasto più alto.
- Hero alta esattamente `100svh`, senza il precedente minimo di 700px o tetto di 1080px. Social e info hanno minimo `100svh` e possono crescere quando il contenuto lo richiede.
- I fondi e il movimento appartengono al modulo VFX. Questo foglio non modifica i trasformi funzionali degli slider o del logo.

## Gerarchie

**Navigazione.** Quattro icone indipendenti, superfici traslucide, bordi luminosi sottili e angoli morbidi. Il blur rimane esteso sullo sfondo. Lo stato attivo usa l’oro; hover di pochi pixel, senza ingrandimenti aggressivi. Logo e lingue rispettano gli stessi margini.

**Menù.** Nome, puntinatura e prezzo formano una riga stabile. Gli ingredienti scendono a interlinea 1.45 desktop e 1.4 mobile; padding verticale 15/12px. La legenda allergeni usa codice, nome e descrizione in tre colonne anche su mobile. Le bevande condividono le intestazioni dei formati e le tre colonne dei prezzi.

**Cornicione.** “Il gusto arriva fino al bordo.” Tre scelte chiare con Ricotta, Brie e Gorgonzola dolce, ciascuna a + € 3,00. Le tre illustrazioni SVG originali mostrano il taglio del bordo ripieno: latticino chiaro, crema dorata, venature del gorgonzola. Non sono fotografie del prodotto. Desktop a tre colonne, mobile in tre righe con illustrazione a sinistra.

**Locale e community.** Titoli dei cinque ambienti centrati fra i margini; fotografia dominante e pannelli a fisarmonica. Il nastro della community conserva fotografie quadrate, con ritmo e bordi sfumati gestiti dal componente.

**Social.** Solo due destinazioni, Instagram e Facebook, sotto un titolo ampio. Recensioni e piattaforme di recensioni rimosse dalla sezione. Il blocco ha respiro da sezione intera anche senza contenuti ripetuti.

**Info.** Titolo e logo, mappa, orari e contatti nello stesso sistema di margini. Su mobile le informazioni pratiche precedono la mappa. Link legali raggruppati nel footer con spazio dedicato sopra il dock.

## Asset e integrazione

- `src/styles/design-v21.css`, importato dopo effetti e interazioni.
- `public/assets/cornicione/ricotta.svg`
- `public/assets/cornicione/brie.svg`
- `public/assets/cornicione/gorgonzola.svg`

Il body deve includere `v21-ready` già nell’HTML iniziale. Le regole più specifiche neutralizzano i vincoli delle versioni precedenti. Il foglio non altera i dati originali del menù, prezzi, allergeni, foto o contatti.

## Controlli

Parsing CSS eseguito con PostCSS; struttura XML dei tre SVG verificata. Illustrazione Ricotta renderizzata con Inkscape e controllata visivamente (gradienti e trasparenza corretti). Riviste le catture desktop di cornicione, bevande, popup allergeni, gallery e community, oltre a hero e menù su viewport CSS da 390px e 320px. Dopo la correzione di una vecchia regola del menù, header e contenuti condividono margini da 24px a 390px e 20px a 320px. Prezzi e intestazioni bevande rimangono allineati; il popup conserva le tre colonne senza overflow orizzontale. Le sezioni social/info usano il proprio padding per l’ancoraggio, senza aggiungere un offset sopra al viewport. La verifica delle interazioni e il rapporto finale sono documentati in `QA_V21.md`.
