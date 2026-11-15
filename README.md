# Pizzeria Via Roma — V21

Nuova revisione React del polish: hero a tutto schermo, slider continui, cornicioni illustrati, gallery React Bits, navigazione e menù più leggibili. Il pacchetto contiene sorgenti, fotografie, menù originale e configurazione Vercel. I deploy esistenti non vengono modificati da questi file.

## Avvio e build

Richiede Node.js 22.12 o superiore.

```bash
npm ci
npm run dev
```

Per la versione di produzione:

```bash
npm run check
npm test
npm run preview
```

`check` esegue TypeScript, build Vite, prerender dell’HTML e controllo delle risorse. `test` esegue le verifiche V21 sui dati e sulla composizione. Le prove visive e interattive, con i limiti del dispositivo utilizzato, sono documentate in `docs/QA_V21.md`. I vecchi script `test:legacy` sono conservati come riferimento storico: includono aspettative V20 superate, come le recensioni e la precedente gallery.

## Vercel

1. Estrai lo ZIP e copia il contenuto della cartella nella root della repository di prova: `package.json`, `vercel.json`, `src/` e `public/` devono essere allo stesso livello.
2. Importa la repository in un progetto Vercel di prova.
3. Framework: **Vite**. Installazione: `npm ci`. Build: `npm run build`. Output: `dist`.
4. Non servono variabili d’ambiente, chiavi API, backend o database.

`vercel.json` contiene già questi comandi. Escludi `node_modules`, `.ssr` e `.env` dalla repository. La cartella `dist/` si rigenera con la build.

La configurazione conserva `noindex, nofollow` e `Disallow: /` per il deploy di prova. Prima della pubblicazione definitiva occorre aggiornare consapevolmente l’indicizzazione e completare i campi originali ancora presenti nelle pagine legali. I collegamenti esterni di telefono, WhatsApp, social e Google Maps puntano ai riferimenti già presenti nella V20.

## Cosa cambia

- Hero alta quanto la viewport, slogan e logo originali con effetti coordinati al nero e oro Via Roma.
- Slider delle pizze e categorie con trascinamento continuo, autoplay lento, comandi manuali e rispetto del movimento ridotto.
- Tre proposte illustrate per il cornicione: ricotta, brie, gorgonzola dolce, ciascuna con aggiunta di **3,00 €**, come nel menù originale.
- Header, selettore lingua e contenuti sulla stessa griglia di padding; navigazione con icone indipendenti e sfocatura progressiva ai bordi.
- Menù più compatto e bevande con intestazioni condivise per i formati, per confrontare facilmente i prezzi.
- Allergeni in tre colonne: codice, nome e descrizione. Popup con sfondo sfocato, chiusura esterna/Escape e ritorno del focus.
- Cinque ambienti con Accordion Gallery; foto della community con Circular Gallery piatta, immagini quadrate e bordi sfumati.
- Social a tutto schermo con Instagram e Facebook. Rimossi recensioni e collegamenti alle piattaforme di recensioni.
- Info a tutto schermo con mappa, orari, telefono e WhatsApp; l’indicatore aperto/chiuso usa il fuso `Europe/Rome`.

## Dati preservati

Prezzi, ingredienti, menù, allergeni, immagini del cartaceo, foto del locale/community, numero di telefono, WhatsApp e orari provengono dai sorgenti V20. Il menù resta presente nell’HTML prodotto dalla build. Non sono state inventate ricette o indicazioni alimentari. Le quattro lingue IT/EN/DE/FR sono mantenute.

Font, icone e immagini sono locali. Le nuove illustrazioni dei cornicioni sono vettoriali e illustrative. Le integrazioni React Bits e le modifiche specifiche sono documentate in `docs/VFX_V21.md` e `docs/INTERACTIONS_V21.md`; le licenze originali sono in `licenses/`.

## Dove intervenire

| Contenuto | Percorso |
|---|---|
| Piatti, prezzi, aggiunte e bevande | `src/data/menu.json` |
| Traduzioni originali | `src/data/translations.json` |
| Testi brevi del sito | `src/i18n.tsx` |
| Foto locale e community | `src/data/photos.json` |
| Layout e responsive | `src/styles/design-v21.css` |
| Slider e gallery | `src/components/IntroSliders.tsx`, `Gallery.tsx`, `Community.tsx` |
| Interazioni | `src/styles/interactions-v21.css`, `src/hooks/useCarousel.ts` |
| Atmosfere e hero | `src/components/effects/`, `src/styles/effects-v21.css` |
| Popup legali | `src/data/privacy.html`, `cookie.html`, `note-legali.html` |
| Pagine legali autonome | I corrispondenti file in `public/` |

Le regole CSS originali sono la base; i fogli V21 si caricano dopo, nell’ordine effetti → interazioni → design. Modificando i testi legali, aggiorna sia il frammento React sia la pagina HTML autonoma. Le recensioni rimangono archiviate nei dati storici ma non sono caricate nel sito.
