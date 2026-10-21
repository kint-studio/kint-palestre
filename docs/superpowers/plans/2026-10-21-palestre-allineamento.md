# Landing palestre allineata al sito principale — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Riscrivere la landing palestre (Next.js) come sito statico, copiando il metodo e il codice già fatti e revisionati per kint-ristoranti, identica a vista e veloce almeno quanto il sito principale.

**Architecture:** Si porta il repository kint-ristoranti (`C:\_EDOARDO\z_kint\kint-ristoranti`, `main` a `25d83c1`) dentro kint-palestre. Si sostituiscono:
- percorsi `ristoranti` → `palestre`;
- testi e traduzioni (dai sorgenti Next di palestre al commit `342e8a9`);
- immagini;
- scena: manubrio su foto in rilievo, senza WebGL e senza fork-3d.

**Tech Stack:** come kint-ristoranti, cioè HTML, CSS, moduli ES, Canvas 2D e Web Worker per il materiale; Node `--test`; esbuild; Python per il server locale.

**Spec:** `docs/superpowers/specs/2026-10-21-palestre-allineamento-design.md`. Questa spec rimanda a quella della ristoranti, che è da leggere: `C:\_EDOARDO\z_kint\kint-ristoranti\docs\superpowers\specs\2026-10-20-ristoranti-allineamento-design.md`.

## Global Constraints

- Tutte le Global Constraints del piano ristoranti (`C:\_EDOARDO\z_kint\kint-ristoranti\docs\superpowers\plans\2026-10-20-ristoranti-allineamento.md`, sezione «Global Constraints»), con `ristoranti`→`palestre` ovunque. In particolare:
  - **Indirizzi:** `/palestre/`, `/en|fr|de/palestre/`, `/ai/palestre/` e `/en|fr|de/ai/palestre/`; `/`, `/en/`, `/fr/` e `/de/` rimandano con 301 alla landing della lingua.
  - **Costanti:** `BASE = 'https://kint-perf.pages.dev'`; noindex salvo `INDEX=1` nella sola build.
  - **File condivisi:** quelli in `assets/` fuori da `assets/palestre/` sono byte-identici a `C:\_EDOARDO\z_kint\KINT-codice-completo\assets\`.
  - **Versioni:** `?v=` ovunque, con bump a ogni modifica.
  - **Header:** CSP senza `'unsafe-inline'` negli script, `worker-src 'self'`, Permissions-Policy senza `interest-cohort`.
  - **Dipendenze:** nessuna di runtime. Nessuna parola `next.js`/`react`/`lenis`/`tailwind`/`/_next/`/`workers.dev`/`edoardo` nei file tracciati, salvo `docs/`, `tools/perf/` e lockfile.
  - **Commit** in italiano, che finiscono con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Nessun push (lo fa il controller).
- **Verità visiva:** la Next di palestre al commit `342e8a9`, in build di produzione su `http://localhost:3112/`, nel worktree esterno `C:\_EDOARDO\z_kint\kint-palestre-next`.
- **Soglie:** 0 long task oltre 50 ms nello scroll desktop di 10 s; TBT Lighthouse (mobile e desktop, mediana di 3) non peggiore della home del principale nello stesso run.
- **Server locale:** porta 3102.
- **Già decise:** Geist Mono nella pillola Human/Machine; scroll nativo; focus dei campi del modulo come nella ristoranti `25d83c1` (riga da 2px in inchiostro e etichetta scurita); `.gitattributes` con `* text=auto eol=lf` e binari marcati.

## Review Focus

1. **Touch:** il manubrio non gira (niente `setPointer` su `hover:none`), il dito apre solo il varco, il cursore automatico apre il varco senza ruotare l'oggetto. Test nel Task 3.
2. **Immagine per larghezza:** `imageUrl(kind, rectWidth)` non restituisce mai la 2048 px su touch. Test nel Task 3.
3. **Immagini non usate:** nel `dist` finiscono solo quelle referenziate. Test nel Task 4.
4. **Testi:** nessun residuo dei testi o del settore della ristoranti (forchetta, «Ristorazione», «locale», «ristorat…») nei file tracciati fuori da `docs/`. Test nel Task 2.
5. **Lingue:** cambio lingua e Human/Machine portano a `/xx/palestre/` e `/xx/ai/palestre/`. È coperto dal test dist-links portato dalla ristoranti.

---

### Task 1: Riferimento «prima» e strumenti di misura

**Files:**
- Copy da kint-ristoranti: `tools/perf/**`, `.gitattributes`.
- Modify: `.gitignore` (`.baseline/`, `dist/`, `node_modules/`) e `package.json` (devDependency `puppeteer-core` come nella ristoranti).

- [ ] **Step 1:** Crea il worktree e avvia la Next in produzione:

  ```bash
  git worktree add ../kint-palestre-next 342e8a9
  npm ci
  npx next build
  npx next start -p 3112
  ```

  Avviala in background e lasciala accesa a fine task. Atteso: 200 su `/` e `/en`.
- [ ] **Step 2:** Esegui `shots.mjs` su `/` e `/en` in `.baseline/next/`. Poi Lighthouse mobile e desktop (3 run, mediana) e `scroll-profile.mjs` su Next (3112) e sulla home del principale, con `npm run build` in `KINT-codice-completo` e `python -m http.server 8091 -d dist`, da fermare a fine task. Scrivi i numeri in `.baseline/numbers.md`.
- [ ] **Step 3:** Commit solo di `tools/perf`, `.gitattributes`, `.gitignore`, `package.json` e lockfile: «chore: strumenti di misura e riferimento della versione Next».

### Task 2: Porting dalla ristoranti: scheletro, pagina, interazioni, generatore, build

**Files:**
- Delete: tutto lo stack Next, come nel Task 2 della ristoranti (`src/`, `public/` dopo aver spostato le immagini del manubrio in `assets/palestre/`, config Next, TS, ESLint, vitest e PostCSS).
- Copy da kint-ristoranti `25d83c1`, rinominando `ristoranti`→`palestre` in percorsi, nomi di file, `?v=`, test e documentazione:
  - `tools/{dev_server.py,export.mjs,i18n.mjs,build.mjs}`;
  - `tests/*` tranne `fork-3d.test.js` (`fork-scene.test.js` e `hero.test.js` si adattano nel Task 3);
  - `assets/` condivisi (gli stessi file byte-identici al principale);
  - `assets/ristoranti/{ristoranti.css→palestre.css,landing.js,menu.js,accordion.js,contact.js}`;
  - `index.html` radice, `404.html`, `README.md`, `AGENTS.md`, `package.json` (con `name: "kint-palestre"`).
- Create:
  - `palestre/index.html`: markup uguale a `ristoranti/index.html` con i testi italiani di palestre (`git show 342e8a9:src/lib/content.ts`, `src/lib/i18n.ts`) e `data-sector="Retail, bellezza &amp; fitness"`;
  - `i18n/{en,fr,de,keep}.json` ricostruiti dai testi di palestre (`git show 342e8a9:src/lib/landing-i18n.ts`, `src/lib/i18n.ts`), senza ritradurre;
  - testi Machine da `git show 342e8a9:src/components/machine/MachineView.tsx`.
- Modify (file locale, non committato, del repository principale): voce `palestre-dev` di `C:\_EDOARDO\z_kint\KINT-codice-completo\.claude\launch.json` → `{"name":"palestre-dev","runtimeExecutable":"python","runtimeArgs":["C:/_EDOARDO/z_kint/kint-palestre/tools/dev_server.py","--port","3102"],"port":3102}`.
- In questo task la scena resta disattivata: `landing.js` non importa ancora `hero.js`. La hero mostra lo sfondo di partenza come nel Task 3 della ristoranti.

- [ ] **Step 1:** Aggiungi `tests/content.test.js`:
  - nessun file tracciato fuori da `docs/`, `tools/perf/` e `.baseline/` contiene `forchetta`, `fork-3d`, `Ristorazione`, `ristorant`, `ristorator`, `per il tuo locale` (insensibile al caso);
  - `palestre/index.html` ha `<h1>` uguale a `title.before + title.accent + "."` di palestre;
  - il numero di servizi e di FAQ è quello di `content.ts` a `342e8a9`, scritto come costante.

  Esegui → FAIL.
- [ ] **Step 2:** Fai il porting. Poi `npm install`, `npm run export`, `node tools/export.mjs --check` e `npm test` → PASS.
- [ ] **Step 3:** Esegui `npm run build`, poi `python tools/dev_server.py --port 3102 --dist`:
  - `curl` sugli 8 indirizzi → 200;
  - `/` → 301.

  Shots di `/palestre/` e `/en/palestre/` contro `.baseline/next/` a 1440 e 375, scena esclusa. Elenca le differenze e correggile.
- [ ] **Step 4:** Commit: «refactor: landing palestre statica come il sito principale (dal lavoro della ristoranti)».

### Task 3: Scena del manubrio

**Files:**
- Copy da kint-ristoranti, adattando: `assets/ristoranti/{trail-engine,formation-engine,scene-engine,depth-surface,material,material-worker}.js` → `assets/palestre/`, senza il ramo `fork3d` e senza `setPose`, se non servono più. Ogni file ha un commento in testa che dice cosa differisce dal principale. Se, tolto il ramo fork3d, un file torna identico a quello del principale, si usa la copia condivisa in `assets/` e non la variante.
- Create:
  - `assets/palestre/scene-images.js`: `dumbbellImage(kind, size)` → `/assets/palestre/manubrio-${kind}${size}.webp`.
  - `assets/palestre/dumbbell-scene.js`: `BOUNDS = {top:.181,bottom:.819,left:.104,right:.896}`, `layout(w,h)` come `KfScene.tsx` a `342e8a9`, `maxDprFor(touch)` (2 su touch, 1,5 su desktop), `imageUrl(kind, rectWidth)` come `KfScene.tsx`.
  - `assets/palestre/hero.js`: `startHero(root, deps) -> {stop()}`, come quello della ristoranti a `25d83c1` ma senza `loadFork3D`. Carica `ceramic` (sagoma delle cifre) poi `kintsugi` per il materiale nel worker (`new URL('./material-worker.js?v=…', import.meta.url)`). `setPointer` solo se `!reduced && !touch`; niente `setPose` automatico su touch. Misura l'hero solo quando serve, come nella ristoranti `a92787f`.
  - Preload in `palestre/index.html` (e nelle pagine generate): solo `manubrio-ceramic-1024.webp` con `media="(hover: none)"` e `fetchpriority="high"`.
- Test: `tests/dumbbell-scene.test.js` e `tests/hero.test.js` adattato.

- [ ] **Step 1: Write failing tests:**
  - `layout(1440,900)` e `layout(375,812)` uguali a quelli di `KfScene.tsx` a `342e8a9`, con i valori calcolati a mano nel test;
  - `imageUrl` su touch non restituisce mai la 2048 px (7 larghezze per 3 DPR);
  - hero:
    - (a) fuori schermo, 0 frame;
    - (b) con `document.hidden`, 0 frame;
    - (c) con reduced motion, formazione subito completa;
    - (d) touch: un `pointermove` non chiama `setPointer` ma aggiunge il varco (`addPointer`);
    - (e) immagine mancante: niente eccezione e scena nascosta;
    - (f) `stop()` ripulisce listener, observer e worker.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implementa e attiva la scena in `landing.js`. Confronta la scena affiancata con `http://localhost:3112/`:
  - tempi della formazione;
  - rilievo e rotazione verso il mouse;
  - varco con l'oro;
  - telefono fermo;
  - reduced motion;
  - immagini mancanti.
- [ ] **Step 4:** `npm run export`, `npm run build`, `npm test` → PASS. `scroll-profile` su `dist`: 0 long task.
- [ ] **Step 5:** Commit: «feat: scena del manubrio con i motori del sito principale».

### Task 4: Verifica finale e report

**Files:**
- Create: `docs/superpowers/reports/2026-10-21-palestre-allineamento-report.md` (come quello della ristoranti).
- Test: aggiungi a `tests/build.test.js` che nel `dist` ci siano solo le immagini `manubrio-*` referenziate.

- [ ] **Step 1:** Scrivi il test delle immagini usate (FAIL se oggi ne finisce una inutilizzata), poi correggi `assetsToPublish` o elimina le immagini inutili, e ottieni PASS.
- [ ] **Step 2:** Esegui shots `dist` contro Next a 1440 e 375, per `/` e `/en`. Esegui Lighthouse (3 run, mediana) e `scroll-profile` su landing, Next e principale nello stesso run. Controlla reduced motion e touch emulato.
- [ ] **Step 3:** Se il TBT supera quello del principale, applica le ottimizzazioni invisibili con i numeri prima e dopo. Le modifiche visibili non si fanno: si riportano.
- [ ] **Step 4:** Scrivi il report: numeri, differenze visive, file condivisi e varianti, checklist del trasloco. Poi `npm test` → PASS e commit «docs: report dell'allineamento della landing palestre».
