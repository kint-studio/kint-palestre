import {test} from 'node:test';
import assert from 'node:assert/strict';
import {loadMaterial} from '../assets/palestre/material.js';
// Il worker del materiale si ferma con stop() della scena (signal), oltre che dopo MATERIAL_TIMEOUT_MS come nel principale.
function withWorker(fn){const saved={Worker:globalThis.Worker,OffscreenCanvas:globalThis.OffscreenCanvas,createImageBitmap:globalThis.createImageBitmap,location:globalThis.location},workers=[];
 globalThis.Worker=class{constructor(url,o){this.url=url;this.o=o;this.terminated=false;workers.push(this);}postMessage(m){this.message=m;}terminate(){this.terminated=true;}};
 globalThis.OffscreenCanvas=class{};globalThis.createImageBitmap=()=>{};globalThis.location={href:'http://localhost/palestre/'};
 return Promise.resolve(fn(workers)).finally(()=>Object.assign(globalThis,saved));}
test('loadMaterial: l\'argento satinato viene chiesto al worker',()=>withWorker(async workers=>{
 const p=loadMaterial('/assets/palestre/manubrio-kintsugi-640.webp',{workerUrl:'w.js',load:()=>Promise.reject(),make:()=>({}),satin:true});
 assert.equal(workers.length,1);assert.deepEqual(workers[0].message,{url:'http://localhost/assets/palestre/manubrio-kintsugi-640.webp',satin:true});
 workers[0].onmessage({data:{bitmap:'bitmap'}});assert.equal(await p,'bitmap');}));
test('loadMaterial: con il segnale interrotto il worker termina e la promessa rifiuta',()=>withWorker(async workers=>{
 const controller=new AbortController();
 const p=loadMaterial('/m.webp',{workerUrl:'w.js',load:()=>Promise.reject(new Error('no')),make:()=>({}),satin:true,signal:controller.signal});
 controller.abort();await assert.rejects(p);assert.equal(workers[0].terminated,true);}));
