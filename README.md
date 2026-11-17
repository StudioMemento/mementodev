# ViaRoma_1_HERO

Checkpoint **STEP 1 — HERO**, 16 novembre 2026. Base: `Pizzeria_Via_Roma_V25_Clean_Vercel.zip`. Progetto React + Vite completo per il deploy di prova. Nessuna pubblicazione effettuata.

## Interventi

1. **Background Glimmer:** polvere oro in movimento lento verso l'esterno, senza scia. Hollow agganciato al centro misurato del logo, aggiornato dopo resize, cambio lingua e caricamento font.
2. **Logo liquid:** luce da grigio a bianco sul PNG originale. Sagoma, proporzioni, alpha e file originale conservati. Nessuna dispersione cromatica; il puntatore varia leggermente la luce, senza deformare il marchio.
3. **Testo:** gradiente 5s `#FFE0CA → #FFBF92 → #FFE0CA`, secondo il file FX_Text.txt. Jost, peso, dimensioni, interlinea, tracking, copy e a capo originali conservati. Effetto limitato allo slogan hero.
4. **Gradual blur:** otto livelli trasparenti ai bordi della viewport, dietro header e navbar; 5rem in alto, 6rem in basso più safe area. Nessuna tinta o saturazione aggiunta.
5. **Navbar satinata:** cinque tasti opachi distinti; highlight morbido dal basso sull'icona attiva. Niente lenti, rifrazione, ingrandimento o lineetta di stato. Collegamenti e indicazione della sezione attiva conservati.

## Colori campionati

| Uso | HEX | Riscontro |
| --- | --- | --- |
| Highlight navbar | **`#DAC18B`** | Pixel pieno di “LE CLASSICHE”; stesso colore di `.mcat h3` nella V25 |
| Oro secondario | `#C6AB70` | “DAL NOSTRO FORNO”; token `--vr-gold` della V25 |
| Testo principale sito | `#F1ECE1` | Token `--vr-ivory` della V25 |

Preset highlight: `--vr-highlight: #dac18b`; RGB `218, 193, 139`. La luce usa opacità variabile dello stesso colore.

## Avvio e deploy

Node 24, come in `.nvmrc`.

```sh
npm ci
npm run check
npm test
npm run preview
```

Sviluppo con aggiornamento live: `npm run dev`.

Estrarre lo ZIP e caricare **il contenuto della cartella ViaRoma_1_HERO** nella radice della repository di sviluppo. Vercel: `npm ci`, `npm run build`, output `dist`. Nessuna chiave o variabile d'ambiente richiesta. Meta build: `ViaRoma_1_HERO — preview`. Conservata la protezione `noindex,nofollow`.

## Prestazioni e fallback

- Nessuna nuova dipendenza runtime: React e React DOM come nella V25.
- Un ciclo condiviso per particelle e liquid, limitato a 40 fps desktop / 30 fps mobile e DPR 1,5. Sono limiti impostati, non misure su hardware reale.
- Effetti sospesi fuori hero, con scheda nascosta o dialog aperto. Nessuna misura di layout o aggiornamento React per frame.
- Movimento ridotto: logo originale, particelle statiche, testo senza animazione.
- WebGL non disponibile o perso: PNG originale visibile. Il contenuto resta disponibile senza JavaScript tramite prerender.
- Blur non supportato o trasparenza ridotta: blur disattivato; navbar ancora opaca e leggibile.

## Verifiche

TypeScript, build, prerender, budget gzip, integrità del menù e test di movimento passati. **166 file originali** confrontati via SHA-256: menù, foto, dati, asset, sezioni successive e relativi stili invariati.
Test controllati della hero passati: centratura desktop/mobile, limite DPR, hollow libero, animazione, pause, movimento ridotto, perdita/ripristino WebGL e pulizia risorse.

**Verifica visiva browser ancora da eseguire.** Il browser del runner non si avvia per una restrizione sui socket; il browser remoto non raggiunge l'anteprima locale e blocca la navigazione ai file locali. Nessuna prova su Safari/iOS o Chrome/Android reale è stata effettuata. Il checkpoint è implementato e compilato, da validare visivamente nel deploy di sviluppo.

I documenti `docs/*V25*` riguardano la base storica. Parametri e note attuali: `docs/HERO_CHECKPOINT.md`.

Test browser fornito: `tests/hero/browser.mjs` (Playwright + Chromium e WebKit richiesti; con `npm run preview` attivo). Non è stato completato qui. Gli screenshot generati dal test sono solo locali in `test-results/hero`.
