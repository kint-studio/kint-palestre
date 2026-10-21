# Report: allineamento della landing palestre al metodo del sito principale

Data: 2026-10-21. Branch `allineamento`. La landing era in Next.js (commit `342e8a9`). Ora è fatta di HTML, CSS e JavaScript statici, senza dipendenze di runtime, con la build in `dist/` e gli header del sito principale. Il lavoro riprende quello della landing ristoranti (`kint-ristoranti`, `25d83c1`).

## Esito in breve

- **Parità visiva.** Negli screenshot a 1440x900 e 375x812, in italiano e in inglese, non ci sono differenze visibili: hero, servizi, FAQ, contatto, footer e menu. Restano solo le differenze già decise, elencate sotto. La scena del manubrio coincide con Next: formazione, rilievo, rotazione verso il mouse, varco con l'oro, telefono, riduci movimento, immagini mancanti.
- **Scroll.** Lo scroll continuo di 10 s su desktop dà 0 long task: soglia rispettata.
- **TBT.** La soglia è rispettata. Il TBT Lighthouse della landing, mediana di 3 misure, è 7 ms su mobile e 0 su desktop. Nello stesso run la home del principale fa 9 e 0, Next 494 e 91. Prima della correzione la landing era a 40 ms su mobile; l'analisi è più sotto.
- **Punteggio e LCP.** Il punteggio Lighthouse mobile è 99 (Next 83, principale 92). L'LCP mobile è 1,95 s (Next 2,93 s, principale 3,08 s).

## Numeri: prima e dopo, Next e principale

Le misure usano Lighthouse 12 sul Chrome locale, con il throttling simulato dei preset. Le tre pagine sono misurate nello stesso run, e ogni riga è la mediana di 3 misure.
- «Next» è la build di produzione del commit `342e8a9`.
- «Principale» è la home di `KINT-codice-completo` (dist).
- «Nuova» è la landing statica (`/palestre/`, dist).

Tra parentesi c'è la nuova prima della correzione del TBT (dist di `47f3f65`, run della stessa sessione).

| Pagina | Perf | LCP ms | TBT ms | CLS | FCP ms |
|---|---|---|---|---|---|
| Next, desktop | 99 | 588 | 91 | 0,000 | 204 |
| **Nuova, desktop** | 100 (100) | 402 (401) | **0** (0) | 0,000 | 343 |
| Principale, desktop | 100 | 639 | 0 | 0,000 | 472 |
| Next, mobile | 83 | 2932 | 494 | 0,000 | 753 |
| **Nuova, mobile** | 99 (99) | 1952 (1952) | **7** (40) | 0,000 | 1415 (1358) |
| Principale, mobile | 92 | 3077 | 9 | 0,000 | 2102 |

Nel run precedente, con la correzione già applicata, la nuova faceva 3 ms su mobile (3/3/4) e il principale 9. Il riferimento del Task 1 (`.baseline/numbers.md`) dava per Next 87 / 2930 / 359 su mobile e per il principale 92 / 3077 / 9. Le misure di oggi sono coerenti; il TBT di Next varia molto tra un run e l'altro.

Scroll continuo di 10 s a 1440x900 (`tools/perf/scroll-profile.mjs`):

| Pagina | long task | max ms | scripting ms | frame | frame persi % |
|---|---|---|---|---|---|
| Next | 0 | 0 | 232 | 1440 | 0 |
| **Nuova** | **0** | 0 | 129 | 1439 | 0 |
| Principale | 0 | 0 | 1395 | 1310 | 0,61 |

### Analisi del TBT

Prima della correzione Lighthouse mobile vedeva due long task.
- **Il primo** (55-60 ms simulati, a 0,75 s) è il primo layout della pagina, nel task che valuta il modulo. Cade prima del First Contentful Paint, quindi non entra nel TBT. Non dipende né dalla scia dei servizi, che sui dispositivi a tocco non parte, né dalla scritta del footer.
- **Il secondo** (88-95 ms simulati, a 1,8 s) è la costruzione della scena, 21 ms in tempo reale. Misurando le singole fasi, quasi tutto il costo era il primo uso di un contesto 2D nella pagina (8-20 ms a freddo): il browser prepara il disegno su canvas solo quando la prima tela viene usata, non quando si crea il contesto. Il resto della costruzione costa circa 5 ms.

La correzione è invisibile (commit `07b7d74`). Mentre l'immagine arriva, una tela usa e getta, fuori dalla pagina, paga quel costo in un task a parte. La tela visibile non viene toccata. La costruzione della scena scende a circa 4 ms e il TBT mobile passa da 40 a 3-7 ms. Il task in più cade prima del First Contentful Paint. Il First Contentful Paint simulato sale da 1358 a circa 1410 ms; l'LCP non cambia.

Altre correzioni di questo task, tutte senza effetti visibili (commit `2909423`):
- se la scena non riesce nemmeno a partire, il suo livello si nasconde e il resto della pagina parte lo stesso;
- se il browser non ha i worker, il materiale dorato si calcola a fette nei tempi morti; ora quel calcolo si ferma quando la scena viene fermata.

Infine un test controlla che nel `dist` finiscano solo le immagini del manubrio davvero richieste (commit `643b53b`). Oggi lo sono tutte e sei, perché la 2048 px serve agli schermi grandi e la 640 alle finestre piccole.

## Verifiche

- **Screenshot affiancati** Next contro nuova (`/` contro `/palestre/`, `/en` contro `/en/palestre/`), a 1440x900 e 375x812, con sei sezioni ciascuno. I pixel diversi vanno dallo 0,00% allo 0,05% a 1440 e fino allo 0,25% a 375. Sono tutti nella pillola Human/Machine e nella freccia «↗» dei link del footer (differenze note, sotto). La grande scritta «kint.» del footer occupa la stessa larghezza.
- **Scena, confronto per fotogramma** (differenza media su 0-255):
  - formata, ferma: 0,02;
  - mouse: 0,05-0,12;
  - cursore automatico: 0,04;
  - telefono: 0,11-0,28;
  - dito sul telefono: 0,16;
  - riduci movimento: 0,01;
  - immagini mancanti: 0,01.

  Durante la formazione la differenza sale a 1-2, perché i due fotogrammi sono sfasati di qualche frame.
- **Telefono (tocco emulato).** Il manubrio resta fermo e il dito apre solo il varco con l'oro, come in Next. Le immagini richieste sono le stesse, ceramic e kintsugi da 1024 px; Next scarica la kintsugi due volte.
- **`prefers-reduced-motion: reduce`.** Il manubrio è subito formato e non ruota col mouse, identico a Next. La console è pulita.
- **Scia dei servizi.** Muovendo il mouse sulla sezione servizi le cifre binarie appaiono come in Next.
- **Test.** `npm test` passa 107 test e non ne fallisce nessuno.

## Differenze visive note (già decise)

- Il selettore Human/Machine usa Geist Mono al posto di JetBrains Mono.
- Scroll nativo al posto di Lenis.
- I link interni a una sezione sono ancore native e aggiungono voci alla cronologia del browser.
- La freccia «↗» dei link LinkedIn e Instagram viene dal subset `geist-mono-sub.woff2` condiviso col principale. È circa 1 px più stretta, quindi «Instagram» si sposta di 1 px. Il font condiviso deve restare identico a quello del principale.
- I campi del modulo hanno il bordo di focus più visibile della ristoranti (riga da 2 px in inchiostro, etichetta scurita).

## File condivisi e varianti

I file in `assets/` sono identici al principale (`tests/shared-assets.test.js`). Nel checkout di `KINT-codice-completo` alcuni hanno fine riga CRLF, mentre qui sono LF per `.gitattributes`; il contenuto è lo stesso. I file sono:
- `depth-surface.js`, `fluid-field.js`, `footer-wordmark.js`, `i18n.js`, `idle-cursor.js`, `service-trail.js`;
- `machine.css`, `mode-switch.css`, `mode-switch.js`;
- `geist-sub.woff2`, `geist-mono-sub.woff2`, `geist-LICENSE.txt`, `og-kint.jpg`.

Le varianti stanno in `assets/palestre/`, e ciascuna ha in testa un commento che dice cosa cambia rispetto al principale:

| File | Motivo |
|---|---|
| `trail-engine.js` | Motore della scia: DPR massimo, layout dell'oggetto, rilievo e «a terra» come opzioni. La rotazione verso il mouse è più ampia (circa 20° e 10°) e più rapida. |
| `formation-engine.js` | Tempi della formazione della landing in millisecondi reali (1300 / 1425 / 1150). |
| `scene-engine.js` | Senza pavimento, piano e ombra di contatto, perché l'oggetto sfuma in basso. |
| `depth-surface.js` | Rilievo a cupola, cioè per distanza dal bordo della sagoma, come in Next. Si costruisce al primo tilt, quindi mai sul telefono. Usa il programma GPU e il `drawDepth` del principale. |
| `material.js`, `material-worker.js` | Materiale sotto il varco: argento satinato (come Next) e arresto del calcolo quando la scena si ferma. |
| `dumbbell-scene.js`, `scene-images.js` | Scena del manubrio: posizione nell'immagine, layout, risoluzione massima, scelta della misura dell'immagine (mai la 2048 px su touch). |
| `hero.js`, `landing.js`, `menu.js`, `accordion.js`, `contact.js` | Comportamenti della landing, assenti nel principale. |
| `palestre.css` | Stile della landing. |

Le immagini `manubrio-ceramic{,-640,-1024}.webp` e `manubrio-kintsugi{,-640,-1024}.webp` appartengono alla landing.

## Checklist del trasloco in kint-website-official

1. Copiare `assets/palestre/` dentro `assets/` del sito principale. I file di `assets/` in radice non vanno copiati: sono identici a quelli del principale (elenco sopra) e si scartano.
2. Copiare le cartelle delle pagine:
   - le Human `palestre/`, `en/palestre/`, `fr/palestre/` e `de/palestre/`;
   - le Machine `ai/palestre/`, `en/ai/palestre/`, `fr/ai/palestre/` e `de/ai/palestre/`.

   Vanno unite alle cartelle esistenti, senza sovrascrivere altre pagine.
3. Unire il blocco generato di `_headers` (tra `# --- ai-export: inizio` e `fine`) con quello del principale. La CSP deve avere `worker-src 'self'`, per il worker del materiale, e gli hash sha256 degli script inline delle nuove pagine. Le regole di cache sono già uguali.
4. `_redirects`: le righe `/`, `/en/`, `/fr/` e `/de/` verso la landing NON vanno portate, perché nel principale sono la home. Se servono ancora, si portano solo gli indirizzi vecchi della versione Next (`/machine` e simili verso le Machine palestre), cambiandone i percorsi.
5. `sitemap.xml`: aggiungere le 4 pagine Human con gli alternate e `x-default`. Le Machine non vanno in sitemap.
6. `robots.txt` non si porta: vale quello del principale. Le pagine palestre restano `noindex` finché non si esporta con `INDEX=1`.
7. `BASE` (`https://kint-perf.pages.dev` in `tools/export.mjs`): nel principale i link a `BASE + '/'` diventano relativi o puntano al dominio definitivo.
8. Portare i test pertinenti, adattando i percorsi:
   - `dist-links`, `cache-headers`, `hero`, `dumbbell-scene`, `material`, `landing`, `contact`;
   - il test delle immagini del manubrio in `build.test.js`.

   Va portato anche il passaggio di build che crea il bundle e il worker del materiale con hash (`WORKERS` in `tools/build.mjs`). Il percorso delle immagini è a template (`manubrio-${kind}${size}.webp`): la build del principale deve pubblicarle tutte e sei.
9. Se nella stessa pagina del principale un'altra tela disegna prima della scena, il riscaldamento in `hero.js` non costa nulla e si può lasciare.
10. Dopo il trasloco, rieseguire Lighthouse (3 misure, mobile e desktop) e `scroll-profile`, e confermare TBT e long task. Il margine del TBT mobile sulla home del principale è stretto: 3-7 ms contro 9.

## Comandi

Vedi `README.md`:
- `npm test`, `npm run dev`, `npm run build`;
- `python tools/dev_server.py --port 3102 --dist`;
- gli strumenti in `tools/perf/`.
