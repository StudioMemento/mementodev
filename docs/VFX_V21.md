# Via Roma V21 — effetti visivi

La luce riprende il colore oro Via Roma (#c6ab70), su carbone e sfumature calde. La hero usa una sorgente alta, morbida e lenta; il logo originale riceve un riflesso che segue esclusivamente la sua sagoma. Il payoff rimane quello originale e si mette a fuoco con un breve reveal, poi riceve un passaggio di luce molto distanziato.

## Composizioni

| Sezione | Fondo e movimento |
|---|---|
| Hero | Light Rays oro, alone centrale, poche particelle lente; logo e payoff Shiny Text |
| Pizze | Calore basso e orizzontale, piccole particelle in risalita |
| Cornicione | Due bagliori ampi laterali, fondo più caldo |
| Categorie | Luce diagonale soffusa, centro lievemente più luminoso |
| Menù | Gradiente verticale molto leggero e statico per non interferire con la lettura |
| Cinque ambienti | Luce laterale e orizzonte morbido; posizione del bagliore diversa per ogni album |
| Community | Illuminazione laterale che accompagna lo scorrimento orizzontale |
| Social | Bagliore a destra e un largo ventaglio luminoso |
| Informazioni | Light Rays dalla parte alta destra, fondo con luce calda laterale |

`SectionAtmosphere` accetta `variant` e `seed`. Non intercetta click o drag. Rimane nel contesto isolato di ogni sezione con z-index -1, senza cambiare il posizionamento di navbar, slider o contenuti. I colori dei gradienti sono volutamente più visibili rispetto al vecchio reticolo di punti V20.

## Fonti React Bits

Codice TypeScript/CSS scaricato dal repository ufficiale il 15 novembre 2026:

- [Light Rays](https://reactbits.dev/backgrounds/light-rays), sorgente [LightRays.tsx](https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/Backgrounds/LightRays/LightRays.tsx) e CSS corrispondente. File sorgente copiato senza modifiche; hash SHA-256 upstream TSX `c74095ca4010560f08ff60767188734574f5581904bc97da622cb6153b3d2f4d`.
- [Shiny Text](https://reactbits.dev/text-animations/shiny-text), sorgente [ShinyText.tsx](https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/TextAnimations/ShinyText/ShinyText.tsx) e CSS corrispondente. File sorgente copiato senza modifiche; hash SHA-256 upstream TSX `4748b686d55e8fc2b09cb69843c1417e2bf78d0eaac0db368442ea1c258b00b3`. Il logo riutilizza lo stesso motore di gradiente mediante maschera alpha dell'asset originale.
- [Gradual Blur](https://reactbits.dev/animations/gradual-blur), componente già presente in V20, ora con rampe sovrapposte a sette punti e interpolazione smoothstep per ridurre la percezione dei singoli strati. La tinta è applicata solo dentro la maschera progressiva, mai come rettangolo sul wrapper.
- Il reveal iniziale di logo e testo, le particelle e i fondi delle altre sezioni sono adattamenti CSS Via Roma; non sono presentati come componenti originali React Bits.

Licenza dei componenti: `licenses/react-bits-LICENSE.md` (MIT + Commons Clause, David Haz). Gli effetti sono inclusi come parte di questo sito, non come raccolta di componenti indipendente.

## Prestazioni e accessibilità

- Nessuna nuova dipendenza. Light Rays usa WebGL2 nativo; Shiny Text usa React e gradienti CSS.
- Shader caricati in un chunk separato e montati solo quando la hero o la sezione info sono visibili. I due effetti si trovano agli estremi della pagina, senza contesti WebGL nelle sezioni intermedie.
- Limite di pixel ratio 1.1; il componente upstream applica anche un proprio budget massimo di pixel.
- Gli effetti CSS vengono sospesi quando la sezione è fuori schermo o la scheda è nascosta. Il menù mantiene un fondo statico.
- Con `prefers-reduced-motion: reduce` nessuno shader viene montato, i riflessi e i reveal si fermano, il logo e il testo rimangono pienamente visibili.
- Il fallback CSS è presente anche senza WebGL; non ci sono dipendenze di rete runtime per mostrare gli effetti.
- La griglia di punti della hero V20 è rimossa dall'albero renderizzato.

## Verifica della lane

- `npm run typecheck`: superato dopo l'inserimento dei nuovi file.
- Fonti, teardown degli observer, gestione visibilitychange e fallback SSR riletti.
- Tutte le classi sono statiche salvo `vr-atmosphere--<variant>`, coperto dalla safelist `^vr-atmosphere` della build.
- La verifica visiva desktop/mobile e della composizione completa è demandata alla lane Playtesting e al producer prima della consegna.

## Correzioni emerse dal playtesting

- Una regola V18 su tutti i figli di Community/Social/Info sovrascriveva il campo atmosfera con `position:relative; z-index:1`, arrivando a misurare il fondo info 0 × 0. Il selettore V21 ora impone posizione assoluta, inset 0, larghezza/altezza complete e z-index 0; i contenuti di quelle sezioni mantengono z-index 1.
- L'isolamento del contenitore menù tratteneva la navbar sticky sotto il blur fisso di pagina. Il solo menù ora ha `isolation:auto`: atmosfera z-index 0, intestazione e categorie z-index 1, navbar z-index 52. La navbar conserva il proprio contesto per tenere il suo blur dietro ai controlli.
- Il secondo controllo ha individuato un bordo orizzontale a 78px: il blur locale iniziava esattamente sotto l'header. Ora parte 78px più in alto (68px su mobile, più safe area), e la sua altezza comprende anche quella fascia. Una maschera sfuma inoltre il bordo superiore nei primi 60px, evitando uno stacco anche prima che la navbar diventi sticky.
