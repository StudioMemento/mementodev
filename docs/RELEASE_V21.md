# Via Roma — V21

Pacchetto React/Vite pronto per la repository di prova e Vercel. La revisione parte dai sorgenti V20 e conserva foto, menù, prezzi, ingredienti, allergeni e contatti originali.

## Richieste applicate

| Punto | Risultato |
|---|---|
| 1 | Hero 100svh, logo e slogan originali, LightRays e ShinyText React Bits in nero e oro. |
| 2 | Pizze su elementi persistenti: drag continuo, autoplay lento, pausa e comandi manuali. |
| 3 | «Il gusto arriva fino al bordo.» con tre cornicioni illustrati e aggiunta +3,00 € ciascuno. |
| 4 | Carosello categorie continuo, autoplay discreto e collegamenti alla categoria corretta. |
| 5–6 | GradualBlur esteso in alto e in basso; eliminato il rettangolo della vecchia barra. |
| 7 | Dock con icone indipendenti, vetro, luce e stato attivo discreti. |
| 8 | Logo, lingue e contenuti sulla stessa griglia di padding. |
| 9 | Menù più compatto: interlinea, spazi fra voci e gerarchia dei prezzi rivisti. |
| 10–11 | Popup allergeni in colonne codice / nome / descrizione, sfondo sfocato e gestione del focus. |
| 12 | Bevande con intestazioni dei formati e prezzi su colonne condivise. |
| 13 | Cinque ambienti in Accordion Gallery, titoli centrati e fotografie dentro i gutter. |
| 14–15 | Circular Gallery piatta, foto quadrate, bordi sfumati, drag e autoplay; fallback DOM funzionale. |
| 16 | Social a tutta altezza con Instagram e Facebook, senza recensioni. |
| 17 | Informazioni con altezza minima pari alla viewport, atmosfera dedicata e contatti ordinati. |
| Trasversale | Atmosfere distinte ma coordinate per ogni sezione; quattro lingue e asset locali. |

Hero usa l'altezza esatta della viewport. Social e Info possono crescere sui telefoni per mantenere leggibili tutti i contenuti.

## Consegna e verifiche

- `npm run check` e `npm test`: superati sulla revisione finale.
- Tutti i chunk JavaScript: circa 155 KiB gzip; CSS: circa 28 KiB gzip.
- Verificati 5 file dati originali, 74 fotografie e 8 banner del menù tramite hash; tutti i collegamenti interni e gli asset compilati presenti.
- Verifiche browser desktop e layout CSS a 390 e 320 px, senza overflow orizzontale. Autoplay, pausa, drag, navigazione, gallery e dialoghi verificati.
- Il browser di prova ha usato il fallback della community. Il percorso WebGL, Safari/iOS, il touch su telefono fisico e il cambio live della preferenza di movimento ridotto richiedono una prova su dispositivo; le relative protezioni sono presenti nel codice.

I dettagli delle prove e dei componenti sono in `QA_V21.md`, `INTERACTIONS_V21.md`, `VFX_V21.md`, `DESIGN_V21.md` e `INTEGRATION_V21.md`. Per avvio e deploy seguire il README nella cartella principale.
