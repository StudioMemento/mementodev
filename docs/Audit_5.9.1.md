# Pizzeria Via Roma · Audit 5.9.1

**22 novembre 2026.** Il controllo riguarda il sito pubblico 5.9 e l’anteprima 5.9.1 derivata dallo ZIP consegnato. Il checkpoint di ripristino è la 5.3.

La visita ordinaria al sito pubblico risulta coerente con l’informativa Cookie. Per completare Privacy e Note legali servono i dati ufficiali del gestore e il riscontro sulle modalità con cui il locale tratta le richieste. Per gli allergeni servono anche le ricette e le etichette delle forniture effettive.

## Cosa compilare alla consegna dei dati

| Campo | Valore dimostrativo | Dove compare |
| --- | --- | --- |
| Denominazione del gestore e titolare del trattamento | AAAAAA AAAAAA | Privacy e Note legali |
| Sede legale | AAA AAAAAA 00, 00000 AAAAAA (AA) | Privacy e Note legali |
| Partita IVA | 00000000000 | Homepage e Note legali |
| Ufficio del Registro delle imprese | AAAAAA | Note legali |
| Numero di iscrizione | 00000000000 | Note legali |
| REA con sigla della provincia | AA-000000 | Note legali |
| E-mail del gestore | AAAAAA@AAAAAA.AA | Privacy e Note legali |

Nel pacchetto, il file `src/data/operator.json` alimenta il footer e le pagine nelle quattro lingue. Dopo aver compilato i campi, impostare `preview` a `false` ed eseguire `npm run build`. Scompaiono le diciture di anteprima e l’e-mail diventa cliccabile. Via Roma 47 a Maniago rimane il recapito del locale. Per la sede legale fa fede il dato aziendale. La partita IVA va in homepage. Ulteriori indicazioni societarie o autorizzative dipendono dalla forma giuridica e dall’attività effettiva. [DPR 633/1972, art. 35](https://def.finanze.it/DocTribFrontend/getAttoNormativoDetail.do?ACTION=getArticolo&articolo=Articolo+35&codiceOrdinamento=200003500000000&id=%7B75A4827C-3766-4ECC-9C45-00C8D6CDC552%7D) · [D.Lgs. 70/2003, art. 7](https://www.normattiva.it/atto/caricaDettaglioAtto?atto.articolo.numero=7&atto.codiceRedazionale=003G0090&atto.dataPubblicazioneGazzetta=2003-04-14)

## Cookie e Privacy

**Cookie.** In una sessione anonima su pizzeriaviaroma.vercel.app sono stati aperti menù, schede allergeni e tutti i documenti in italiano, inglese, tedesco e francese. Le 80 risorse distinte provenivano dallo stesso dominio. Nessuna risposta ha impostato cookie. A inizio visita e dopo ogni cambio lingua erano vuoti i cookie, gli archivi locale e di sessione, IndexedDB e Cache Storage. Nessun service worker registrato. Font, immagini e mappa sono locali. I link verso Google Maps, i social e WhatsApp richiedono un’azione del visitatore. Per il comportamento osservato il banner di consenso non serve. L’attivazione futura di tracciatori o contenuti incorporati richiederebbe una nuova verifica. [Linee guida cookie del Garante, sintesi ufficiale](https://www.garanteprivacy.it/documents/10160/0/Linee%2BGuida%2BCookie%2Be%2Baltri%2Bstrumenti%2Bdi%2Btracciamento%2B-%2BINFOGRAFICA.pdf/8a66cc58-ca35-39d8-76a2-11d176313acd?download=true&version=3.0)

**Privacy.** Il testo copre finalità e basi giuridiche per navigazione e richieste, dati tecnici di Vercel, contatti via WhatsApp, criteri di conservazione, diritti e reclamo al Garante. La 5.9.1 chiarisce che il menù si consulta senza fornire recapiti e quali informazioni servono per gestire un ordine. Il gestore deve confermare chi accede a prenotazioni e chat, quando vengono eliminate e per quanto tempo sono accessibili i log. Se il periodo è determinabile, indicarlo. Negli altri casi specificare il criterio effettivo. Il progetto Vercel è nell’account dello studio. Se Memento tratta dati per conto del locale, verificare l’accordo tra le parti, il ruolo di Vercel e le garanzie per eventuali trasferimenti extra SEE. Controllare anche come riceve l’informativa chi prenota direttamente per telefono o WhatsApp. [GDPR, artt. 13, 28 e 44–46](https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=it) · [Accordo sul trattamento dei dati di Vercel](https://vercel.com/legal/dpa)

## Immagini e Note legali

Le foto della community si aprono sul profilo Google Maps. Il sito usa le foto degli ambienti fornite dal locale. Le tre Polaroid contengono ritagli originali del bancone e delle due sale, con cornici e sfondo generati. Nel carosello, 39 pizze sono illustrate con IA e la Via Roma deriva da una foto del locale. Nella 5.9.1 questa distinzione è visibile durante la consultazione. Cornicioni e asporto riportano la dicitura vicino all’immagine.

Per i contenuti che rientrano nella definizione di «deep fake», l’art. 50 del regolamento IA richiede che l’origine artificiale sia distinguibile già alla prima esposizione. La rappresentazione del piatto deve corrispondere a ciò che viene servito. Per la veduta aerea di Maniago, il registro del progetto indica «materiale fornito». Resta da documentare l’origine della base e il diritto di pubblicazione. Le licenze di Jost e Phosphor sono incluse nel pacchetto. Per le icone che riproducono marchi di piattaforma restano pertinenti le condizioni d’uso dei rispettivi marchi. [Regolamento IA, artt. 3 e 50](https://eur-lex.europa.eu/eli/reg/2024/1689/2026-07-27/ita) · [Orientamenti della Commissione sull’art. 50](https://publications.europa.eu/resource/cellar/caabe0cd-de39-11f1-ba80-01aa75ed71a1.0006.01/DOC_1) · [Regolamento 1169/2011, art. 7](https://eur-lex.europa.eu/eli/reg/2011/1169/oj?locale=it)

Le Note legali già indicano prezzi in euro e conferma delle prenotazioni da parte del personale. Da confermare con il gestore che i prezzi comunicati sono finali e quali supplementi o coperto si applicano. Se il cliente conclude l’ordine via telefono o WhatsApp, le informazioni pertinenti sugli allergeni devono essere disponibili prima dell’acquisto. [D.Lgs. 70/2003, art. 7](https://www.normattiva.it/atto/caricaDettaglioAtto?atto.articolo.numero=7&atto.codiceRedazionale=003G0090&atto.dataPubblicazioneGazzetta=2003-04-14) · [Regolamento 1169/2011, artt. 14 e 44](https://eur-lex.europa.eu/eli/reg/2011/1169/oj?locale=it)

## Allergeni

| Voce | Testo italiano nella 5.9.1 |
| --- | --- |
| Cereali contenenti glutine | Grano, segale, orzo, avena, loro ibridi e derivati. |
| Anidride solforosa e solfiti | Oltre 10 mg/kg o 10 mg/l di SO₂ totale al consumo. |

Farro e grano khorasan rientrano nel grano. La legenda generale può omettere la parentesi. Per il singolo alimento il consumatore deve poter identificare il cereale effettivamente usato, ad esempio grano nell’impasto oppure orzo nella birra. Lo stesso vale per il tipo di frutta a guscio. La soglia dei solfiti si applica al prodotto come servito o ricostituito secondo le istruzioni. Il testo compatto si usa in tutte le sezioni. [Allegato II del regolamento 1169/2011](https://eur-lex.europa.eu/legal-content/IT/TXT/PDF/?uri=CELEX%3A02011R1169-20250401) · [Comunicazione della Commissione 2017/C 428/01](https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX%3A52017XC1213%2801%29)

Le schede conservano i 14 gruppi e l’asterisco separato per i surgelati. Entrambe le Marinare riportano il latte confermato dal locale. Per Cabernet Franc, Friulano e Prosecco DOC Treviso il menù web attualmente non evidenzia i solfiti. L’assenza del codice deriva dalla mancanza di riscontro sulle etichette. Verificare anche la frutta a guscio del pesto e il dolce effettivamente servito quel giorno. Il gestore deve tenere a disposizione del cliente e dell’autorità documentazione scritta e aggiornata per ciascuna preparazione, anche quando il menù è digitale. Il riscontro completo è in `docs/Allergeni_5.9.1.md`. [D.Lgs. 231/2017, art. 19, comma 8](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2017-12-15;231~art19)

## Verifica tecnica

| Prova | Risultato |
| --- | --- |
| Browser | Chromium 153, Firefox 153 e WebKit 26.5 su Linux. In ogni motore, 6 formati da 320 a 3440 px per 4 lingue, per un totale di 72 combinazioni. Titolo asporto, numeri nel footer, popup, focus e larghezza pagina verificati. |
| Schede allergeni | 85 voci × 4 lingue × 39 configurazioni Chromium, incluse rotazione e aree sicure simulate. 13.260 aperture. Nessun taglio rilevato dalla prova. |
| Interazione | Verificati trascinamento sull’intera sezione pizze, swipe verticale, tastiera, 40 pizze, gallerie, movimento ridotto e chiusura delle finestre legali. |
| Leggibilità | Il punto interrogativo usa un glifo di sistema al 76% del titolo. Le righe inattive del popup sono più leggibili. Sul fondo di confronto #0D0D0D il grigio passa da 2,61 a 5,48 di contrasto. I codici presenti si riconoscono anche dalla sottolineatura. |
| Caricamento | Menù presente nell’HTML iniziale, immagini WebP responsive, gallerie ed effetti caricati progressivamente. Build gzip con 97,5 KiB di JavaScript iniziale, 10,3 KiB di CSS iniziale e 12,4 KiB di HTML. |
| Sito pubblico | Homepage di sviluppo e pubblica con lo stesso HTML 5.9. Le 12 pagine legali pubbliche corrispondono alla 5.9. La homepage invia `noindex, nofollow`. Il file `robots.txt` vieta la scansione dell’intero sito. |

Per un sito cliente che deve comparire su Google, differenziare la configurazione di produzione da quella di sviluppo. Le direttive attuali sono coerenti con l’uso in anteprima. I test coprono motori reali con viewport e input emulati. Safari su iPhone fisico, Android reale e prestazioni misurate sui dispositivi dei clienti restano fuori da queste misure. [Google Search Central, controllo dell’indicizzazione](https://developers.google.com/search/docs/crawling-indexing/block-indexing?hl=it)
