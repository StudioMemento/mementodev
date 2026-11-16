# Pizzeria Via Roma — V23 · Intro al menù

Polish mirato della build V22. Questa revisione segue i nove punti del 16 novembre 2026: hero, presentazione delle pizze, cornicioni, navigazione e padding condiviso. Sorgenti completi per il deploy di prova su Vercel. Nessun deploy è stato pubblicato.

## Avvio

Node.js 24 (vedi `.nvmrc`), oppure Node.js ≥22.13.

```bash
npm ci
npm run dev
```

Build e controlli:

```bash
npm run check
npm test
npm run preview
```

`check`: TypeScript, build, prerender HTML, asset locali e budget. `test`: 148 file originali congelati, identità del menù HTML, link, tre nuove immagini responsive, controller di navigazione e scheduler reale dello slider, con controlli negativi.

## Deploy di prova su Vercel

Estrai lo ZIP nella radice della repository di prova. Il livello che contiene `package.json` è la root del progetto.

- Framework: Vite.
- Install: `npm ci`.
- Build: `npm run build`.
- Output: `dist`.
- Node.js: 24.
- Nessuna variabile d’ambiente, API key o CDN necessaria.

`vercel.json` è incluso. La protezione `noindex,nofollow` è mantenuta per l’ambiente di sviluppo. La pubblicazione sul dominio del cliente resta separata da questo pacchetto.

## Modifiche V23

- Dot Grid arancio sul blocco introduttivo; logo originale con metallo chiaro e slogan originale con gradiente caldo. Hero con solo chevron grande.
- Aurora nella fascia superiore, titolo nero, foto pizze e ingredienti più grandi. Autoplay ogni 6,5 secondi, drag/swipe, frecce ai lati dei dieci dot. Nessun popup al click, contatore, play/pausa o suggerimento di trascinamento.
- Tre foto generate del cornicione spezzato: ricotta, brie e gorgonzola dolce. Card Holo affiancate anche su telefono; supplementi originali di €3,00 e copy richiesto.
- Slider categorie introduttivo rimosso; categorie e contenuti del menù effettivo conservati.
- Dock con quattro icone indipendenti, ingrandimento e luce alla base della sezione attiva. Blur graduale trasparente sui bordi del viewport. Padding condiviso con il menù.

Autoplay sospeso durante hover, focus, trascinamento, dialoghi, scheda nascosta e fuori schermo; disabilitato con movimento ridotto. Frecce e dot restano disponibili. Foto, logo e testo restano visibili senza WebGL2: griglia Canvas 2D interattiva, argento CSS, bagliore statico dell’aurora e riflesso CSS delle card.

Menù, allergeni, prezzi, originali fotografici, gallery, community, social e contatti non sono stati rielaborati. Il padding e la navigazione condivisi hanno effetto anche sulle sezioni successive.

Parametri, misure e limiti delle verifiche: `docs/RELEASE_V23.md` e `docs/QA_V23.md`. I documenti V22 e i precedenti verificatori sono storici; il comando `npm test` esegue il contratto V23.
