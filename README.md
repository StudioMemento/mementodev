# ViaRoma_1_HERO — polish 1.1

Checkpoint del 17 novembre 2026. Pacchetto React completo per il deploy di sviluppo su Vercel. Questa revisione corregge la hero già pubblicata su mementodev.vercel.app; non è stata pubblicata automaticamente.

## Modifiche

1. **Background:** hollow calcolato dal perimetro visibile del logo originale, escludendo il padding trasparente del PNG. Particelle emesse appena fuori dal cerchio; variazione organica delle traiettorie, velocità esterna invariata a `0.25`. Turbulence `0.48`; nessuna scia.
2. **Logo:** liquid argento in idle; oro su hover del cerchio visibile e durante la pressione touch. Entrata/uscita morbide e glow oro leggero. Il renderer conserva coordinate, alpha, proporzioni e asset originale.
3. **Testo:** gradiente oro desaturo → oro → highlight, 5 secondi alternati. Font, peso, dimensioni, interlinea e impaginazione originali.
4. **Gradual blur:** 8 strati trasparenti, 0.25–32px, top/bottom con safe area. Nessuna tinta. Corretta la regola che nascondeva tutti gli strati quando il browser riportava `prefers-reduced-transparency: reduce`.
5. **Navbar e lingue:** satinato grigio scuro con alpha 44–66% e backdrop blur 12px, dichiarazione standard e prefisso WebKit. Highlight dal basso sulle icone attive; lingua attiva con fondo oro tenue.
6. **Scroll:** scrollbar nativa della pagina nascosta; avanzamento oro di 2px sul bordo destro, su tutta l'altezza dinamica della viewport. La misura si aggiorna quando cambia l'altezza dei contenuti.
7. **Interazioni:** selezione, trascinamento nativo, menu contestuale e click centrale disabilitati. Rotella, touch, pinch zoom, slider, click primario e navigazione da tastiera restano operativi. Gli eventuali campi di testo restano editabili.

## Palette

| Ruolo | HEX |
| --- | --- |
| Nero carbone, hero | `#090909` |
| Grigio satinato | `#252524` |
| Oro | `#C6AB70` |
| Oro desaturo | `#A89B7B` |
| Highlight, hover e progress | **`#DAC18B`** |

## Avvio e Vercel

Node 22.13+ della serie 22 oppure Node 24+. Dalla cartella contenente `package.json`:

```sh
npm ci
npm run dev
npm run check
npm test
```

Vercel: install `npm ci`, build `npm run build`, output `dist`. Copiare il contenuto della cartella `ViaRoma_1_HERO` nella radice della repository di sviluppo. Nessuna chiave o variabile di ambiente richiesta. La build conserva `noindex,nofollow`.

## Verifiche e limiti

- TypeScript, build client/SSR, prerender e budget di trasferimento: passati.
- Menù prerenderizzato identico; **166 file originali** confrontati con SHA-256 e invariati, inclusi logo, foto, contenuti, traduzioni e sezioni successive.
- Test sul codice effettivo: geometria hollow desktop/mobile, densità vicino al bordo, hover oro, pausa degli effetti, contesto WebGL perso/ripristinato, reduced motion e pulizia risorse; progress scroll, resize/overscroll e blocchi selettivi degli input.
- Nessuna nuova dipendenza runtime. JS iniziale: **97.332 byte gzip**, CSS: **7.359 byte gzip**. Limite del clock: 40 fps desktop / 30 fps mobile, DPR massimo 1.5; questi sono parametri, non misure su dispositivi reali.
- Il deploy precedente è stato ispezionato nel browser: blur effettivamente nascosto dalla preferenza di trasparenza ridotta, navbar opaca e hollow troppo largo confermati.
- **La nuova build non è stata verificata visivamente nel browser.** Il browser collegato non raggiunge il server locale; il browser del runner non si avvia per una restrizione sui socket. Safari/iOS e Chrome/Android reali restano da verificare sul deploy di sviluppo. Il test browser aggiornato è incluso in `tests/hero/browser.mjs`.

WebGL non disponibile: PNG originale e hover oro tramite maschera CSS. Movimento ridotto: nessun liquid animato, particelle statiche e gradiente fermo. Browser senza backdrop-filter: superfici di fallback leggibili. Contrasto forzato: logo e testo leggibili senza effetti. Il sito resta consultabile senza JavaScript grazie al prerender; i blocchi di click e il progress richiedono JavaScript.

Dettagli e checklist visiva: `docs/HERO_CHECKPOINT.md`. I documenti e le anteprime V25 sono riferimenti storici, non screenshot di questo polish.
