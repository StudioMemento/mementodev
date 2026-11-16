# Pizzeria Via Roma — V25 Clean Baseline

Build di sviluppo del 16 novembre 2026. Base nera/oro, senza effetti decorativi React Bits, WebGL, canvas, particelle, blur, parallax o animazioni di ingresso. Le modifiche non sono state pubblicate sul sito del cliente.

## Avvio e verifica

Node 24 (vedi `.nvmrc`).

```sh
npm ci
npm run check
npm test
npm run preview
```

Per lavorare sui sorgenti: `npm run dev`. La build genera HTML prerenderizzato: contenuti e menù sono presenti prima dell'avvio di React.

## Deploy di prova su Vercel

Estrarre lo ZIP. La cartella `Pizzeria_Via_Roma_V25_Clean` contiene la radice del progetto: caricarne il contenuto nella repository di sviluppo. Non annidare il progetto in una seconda sottocartella se Vercel usa la root della repository.

Configurazione inclusa in `vercel.json`: Vite, `npm ci`, `npm run build`, output `dist`. Non servono variabili d'ambiente. Lo ZIP contiene sorgenti e asset; Vercel genera `dist`. Dopo il deploy verificare il meta `build`: `Pizzeria Via Roma V25 Clean Baseline — preview`.

Le foto gallery usano URL `?v=25` per evitare che le precedenti copie 4K in cache rimangano in uso. Il progetto conserva `noindex,nofollow` per l'ambiente di sviluppo.

## Comportamento corrente

- Hero statica alta `100svh`, logo originale, slogan, chevron maggiore centrato nello spazio tra slogan e fondo sezione.
- Slider pizze continuo, trascinamento libero con inerzia senza snap al rilascio. Frecce e dot raggiungono la pizza scelta con easing. Testi immobili con opacità derivata dalla posizione, senza sovrapposizione.
- Autoplay sospeso fuori viewport, con scheda nascosta, dialog aperto, hover, focus da tastiera o preferenza di movimento ridotto. Nessun loop RAF a riposo.
- Cornicioni: tre immagini in verticale su mobile, tre colonne da tablet; testi HTML sopra le foto. Circa una schermata mobile, minimo 680 px per la leggibilità su schermi bassi.
- Navbar a cinque icone di dimensione fissa, tasti satinati opachi, indicatore oro alla base. Nessun blur globale o ingrandimento.
- Gallery e community semplificate a una foto per album, con frecce, swipe e lightbox. Tutte le foto rimangono consultabili; nessun autoplay o renderer grafico.
- Le 40 foto del locale sono WebP entro 1920×1080, senza deformazione; con il rapporto originale risultano 1700×1080 o 1699×1080. Varianti da 768 px conservate.
- Dati, prezzi, allergeni, asset e intero markup `#carta` del menù invariati.

Padding e misure: `docs/LAYOUT_V25.md`. Test e limiti: `docs/QA_V25.md`. Confronto prima/dopo: `docs/RELEASE_V25.md`.
