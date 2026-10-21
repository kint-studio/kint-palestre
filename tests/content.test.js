import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {existsSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
// Testi della landing palestre: nessun residuo della landing da cui è stato portato il codice, titolo e numeri di src/lib/content.ts al commit 342e8a9.
const root=fileURLToPath(new URL('..',import.meta.url));
const SKIP=/^(?:docs\/|tools\/perf\/|\.baseline\/|tests\/content\.test\.js$)/;
// Parole del settore precedente, cercate senza distinzione tra maiuscole e minuscole.
const BANNED=['forchetta','fork-3d','Ristorazione','ristorant','ristorator','per il tuo locale'];
// numeri e titolo di src/lib/content.ts al commit 342e8a9, scritti a mano
const SERVICES=5,FAQ=6;
const TITLE={before:'kint per la ',accent:'tua palestra'};
const tracked=()=>execFileSync('git',['ls-files'],{cwd:root,encoding:'utf8'}).split('\n').filter(f=>f&&!SKIP.test(f)&&existsSync(root+f));
const page=()=>readFileSync(root+'palestre/index.html','utf8');
const text=s=>s.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
test('nessun file tracciato contiene parole della landing ristoranti',()=>{
 const bad=[];
 for(const f of tracked()){const s=readFileSync(root+f);if(s.includes(0))continue;const t=s.toString('utf8').toLowerCase();for(const w of BANNED)if(t.includes(w.toLowerCase()))bad.push(`${f}: ${w}`);}
 assert.deepEqual(bad,[]);
});
test('palestre/index.html: h1 uguale al titolo di content.ts',()=>{
 const h1=page().match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/);assert.ok(h1,'h1 mancante');
 assert.equal(text(h1[1]),`${TITLE.before}${TITLE.accent}.`);
});
test('palestre/index.html: servizi e FAQ quanti in content.ts',()=>{
 const html=page(),group=id=>{const m=html.match(new RegExp(`<section id="${id}"[\\s\\S]*?</section>`));assert.ok(m,id);return (m[0].match(/\bdata-accordion-item\b/g)||[]).length;};
 assert.equal(group('servizi'),SERVICES);assert.equal(group('faq'),FAQ);
});
