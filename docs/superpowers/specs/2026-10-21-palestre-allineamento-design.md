# Landing palestre allineata al sito principale

Data: 2026-10-21 · Repository: `kint-studio/kint-palestre` (cartella locale `C:\_EDOARDO\z_kint\kint-palestre`).

## In una riga

Si fa per la landing palestre **esattamente** quello che è stato fatto per la landing ristoranti. Il modello da seguire è il repository `C:\_EDOARDO\z_kint\kint-ristoranti` (`main` a `25d83c1`), con:
- la sua spec: `docs/superpowers/specs/2026-10-20-ristoranti-allineamento-design.md`;
- il suo report: `docs/superpowers/reports/2026-10-20-ristoranti-allineamento-report.md`.

Valgono tutti gli obiettivi, i non obiettivi, gli anti-obiettivi, le regole per i casi dubbi e i vincoli di quella spec, con le sostituzioni qui sotto.

## Decisioni dell'utente

- «Uguale alla ristoranti». Si mantengono le stesse scelte già approvate:
  - Geist Mono nel pulsante Human/Machine;
  - scroll nativo;
  - bordo di focus visibile sui campi del modulo (riga da 2px in inchiostro, etichetta scurita);
  - contatto mailto;
  - noindex finché non c'è il dominio, attivabile con `INDEX=1` solo nella build;
  - `.gitattributes` con LF;
  - push su `main` alla fine.
- Esecuzione con subagenti.

## Sostituzioni rispetto alla ristoranti

| Ristoranti | Palestre |
|---|---|
| percorso `/ristoranti/` (e `/en|fr|de/ristoranti/`, `/ai/ristoranti/`…) | `/palestre/` (e `/en|fr|de/palestre/`, `/ai/palestre/`…) |
| cartella `assets/ristoranti/` | `assets/palestre/` |
| commit di riferimento Next `30508ec` | `342e8a9` (repository kint-palestre) |
| forchetta 3D con WebGL2 nel worker (`fork-3d*.js`) | **manubrio** su foto in rilievo (`drawDepth`), **senza WebGL**. Nessun `fork-3d`, nessun worker 3D. Il varco con l'oro usa il material worker come oggi. |
| `BOUNDS {top:.042,bottom:.958,left:.417,right:.625}`, `DEPTH_STYLE` lineare | `BOUNDS {top:.181,bottom:.819,left:.104,right:.896}`, rilievo di default (nessun `depthStyle`) |
| immagini `forchetta3-*` | `manubrio-ceramic{,-640,-1024}.webp`, `manubrio-kintsugi{,-640,-1024}.webp`. Si tengono solo quelle davvero usate. |
| preload: forchetta | solo `manubrio-ceramic-1024.webp` con `media="(hover: none)"` e `fetchpriority="high"`, come `ScenePreload` |
| touch: la forchetta gira da sola (`setPose`) | touch: il manubrio **resta fermo** e il dito apre solo il varco. Desktop: gira verso il mouse (`setPointer` solo se `!touch`). |
| testi, settore «Ristorazione & hospitality» | testi palestre da `src/lib/content.ts`, `src/lib/i18n.ts` e `src/lib/landing-i18n.ts` a `342e8a9`; settore «Retail, bellezza & fitness» |

Tutto il resto è identico alla ristoranti (`globals.css`, menu, fisarmonica, modulo, footer, Machine e switch sono uguali byte per byte a meno dei testi): CSS, moduli, generatore, build, server locale, test e strumenti di misura si riprendono da kint-ristoranti, adattando nomi e percorsi.

## Verifica

Le stesse soglie della ristoranti:
- parità visiva con la Next di palestre in produzione;
- 0 long task oltre 50 ms nello scroll desktop;
- TBT Lighthouse mobile e desktop non peggiore della home del principale nello stesso run.

Attenzione: il manubrio ruota sul thread principale (`drawDepth` per frame). Se il TBT non rispetta la soglia, valgono le regole della spec ristoranti: ottimizzazioni invisibili sì, cambiamenti visibili solo con l'utente.

Server locale: porta **3102**. La voce `palestre-dev` di `KINT-codice-completo/.claude/launch.json` deve avviare `python C:/_EDOARDO/z_kint/kint-palestre/tools/dev_server.py --port 3102`.
