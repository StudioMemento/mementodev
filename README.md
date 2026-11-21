# Via Roma 5.4

Build di anteprima per Pizzeria Via Roma, Maniago. Base di partenza 5.3, commit `bb55d4f4c6e601bee45e52c9f67f53f25eb26074` del progetto di sviluppo.

## Avvio e build

Con Node 24, eseguire `npm ci`, `npm run check` e `npm test`. Per lo sviluppo usare `npm run dev`. Per provare l’HTML prerenderizzato usare `npm run preview` dopo la build. Su Vercel selezionare la cartella che contiene `package.json`, framework Vite, comando `npm run build`, output `dist`. La configurazione della 5.4 usa l’indicizzazione di anteprima.

## Foto del locale e degli ospiti

I cinque album del locale contengono le 40 fotografie fornite per il progetto. La sezione successiva è una card 16:9 con lo stesso componente, inclinazione, bordi e riflessi di cornicioni e asporto. La copertina originale generata per la card è disponibile a 480, 960 e 1600 px, ospitata sul sito. Testo, freccia e intera superficie attivano un unico collegamento. I testi di interfaccia sono in IT, EN, DE e FR.

Il collegamento Foto è centralizzato in `src/data/venue-links.ts`. Un browser desktop ha aperto la raccolta ufficiale «Foto di Pizzeria Via Roma Maniago» con «Tutte» selezionata. Su telefono il passaggio all’app dipende da Google Maps e dal dispositivo. Il sito raggiunge Google quando si attiva il link. Il box recensioni e la mappa hanno destinazioni proprie. [Foto di Via Roma](https://www.google.com/maps/place//data=!4m3!3m2!1s0x477983a3cc4c3b4f:0x641962f142805885!10e5) · [Documentazione Google](https://developers.google.com/maps/documentation/places/web-service/maps-links)

## Menù e approvazioni

L’HTML iniziale contiene tutte le 86 voci, il dettaglio dei 70 alimenti interattivi, la legenda dei 14 allergeni e una scheda espandibile per le 15 bevande. Lo stato di surgelazione è distinto. Un click sul nome o sui codici apre il dettaglio anche se la rete è caduta dopo il caricamento. Con JavaScript disattivato i collegamenti raggiungono il testo incorporato. Le schede identificano come «Indicazioni del menù» le indicazioni già in uso.

| Voce | Modifica digitale e riscontro per la ristampa |
|---|---|
| Marinara Classica, Marinara d’Oro | Il cartaceo riporta 1 e 7. Le descrizioni elencano pomodoro, aglio e origano. Il locale verifica separatamente impasto, salsa e finitura prima di modificare il 7. |
| Siciliana, Tonno e Cipolla | 1, 4 e 7 sono espliciti nei dati. Aggiungere il 4 del pesce alle voci con acciughe e tonno nel cartaceo. |
| Patatine Fritte | Conservati i codici esistenti. Distinguere ingredienti ed eventuale rivestimento dai contatti attraverso l’olio. L’asterisco riguarda il surgelato. |
| Varianti e cornicioni | I tre formaggi hanno 7 sul ripieno. Per la pizza completa occorrono anche impasto e condimenti. Verificare le miscele e le aggiunte. |
| Birre, vini e dolci | Un richiamo serve tutte le bevande. Cinque birre hanno un riferimento del produttore con il cereale dichiarato. Per la Flag verificare la referenza servita e il suo malto d’orzo. Completare con etichette/fusti del locale, vini e ricette dei dolci del giorno. |
| Legenda cartacea | A p. 13 correggere la soglia per i solfiti in oltre 10 mg/kg o 10 mg/L di SO₂ totale. Integrare gli otto tipi di frutta a guscio. |

Le ricette e le etichette possono cambiare. Registrare le conferme in `config/food-approvals.json`, indicizzate dall’ID del piatto (per esempio `marinara-classica`) oppure della bevanda (`drink-flag`). Ogni record contiene `source`, `date` in formato AAAA-MM-GG e `codes` con numeri tra 1 e 14. Inserire in `details` i nomi specifici di cereali e frutta a guscio nelle quattro lingue. Per un contatto accidentale documentato usare `crossContact`. La build pubblica solo codici, dettagli e contatti approvati. Conservare il registro e i documenti del gestore separatamente. La versione consegnata attende tale approvazione.

Per le indicazioni prima di un ordine telefonico, il personale può leggere dal registro le voci richieste. [Reg. UE 1169/2011](https://eur-lex.europa.eu/eli/reg/2011/1169/oj?locale=it) · [D.Lgs. 231/2017, art. 19](https://www.gazzettaufficiale.it/eli/id/2018/02/08/18G00023/sg)

## Contatti e note legali

Telefono 0427 541232 per gli ordini da asporto. WhatsApp 380 2453 757 per informazioni e prenotazioni tavoli. Le 12 informative autonome sono accessibili dal footer. Se Privacy è aperta offline, il lettore consente un nuovo tentativo e riprende al ritorno della rete.

In `config/venue.json` compilare denominazione, sede, P. IVA, ufficio del registro delle imprese e REA secondo visura. `identityConfirmed` abilita i dati nelle pagine legali e la P. IVA nel footer della home. `publicEmail` è il recapito del locale da pubblicare. `chatPolicy` riceve nelle quattro lingue il criterio effettivo di accesso e conservazione, dopo riscontro del gestore. Riesaminare anche i termini del fornitore hosting e le informazioni privacy pertinenti prima del rilascio sul dominio collegato al QR. [GDPR, artt. 6 e 13](https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=it)

## Collaudo

`npm run check` verifica tipi, build, prerender, risorse e dimensioni. `npm test` controlla i contenuti storici, le modifiche previste, i prezzi e le interazioni. Il collaudo aggiuntivo `node tests/release/browser.mjs` usa Playwright installato separatamente, con Chromium, Firefox e WebKit. Serve l’output `dist`. Le pagine sono servite dai file della build, con interruzioni controllate della connessione e dei singoli file JS/CSS.

Il collaudo verifica 4 lingue, apertura alla prima interazione senza rete, riconnessione per Privacy, fallback senza JavaScript, cronologia e focus, lista bevande, pausa su touch e larghezze da 240 a 1440 px. La prova del QR stampato su rete del locale con VoiceOver e TalkBack resta da fare in sala.

### Risultati del 21 novembre 2026

Node 24.22.3. Verifiche di build e test di interazione superate sui tre motori. In tre avvii Chromium a cache vuota con viewport 360 × 640, DPR 2, 1,6 Mbit/s, 150 ms di latenza e CPU limitata a 4×, il caricamento ha richiesto tre foto pizza (300 kB). L’evento load ha una mediana di 4,63 s e l’LCP di 1,69 s. Il test usa un server HTTP locale con compressione e le risorse della build. Su Firefox con carattere minimo di 24 px, a 240, 280 e 320 px il documento mantiene la larghezza della finestra e il soggetto pizza resta visibile.
