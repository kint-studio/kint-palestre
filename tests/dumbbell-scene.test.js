import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {layout,imageUrl,maxDprFor,BOUNDS,DEPTH_STYLE} from '../assets/palestre/dumbbell-scene.js';
import {dumbbellImage} from '../assets/palestre/scene-images.js';
import {domeRelief,makeDepth} from '../assets/palestre/depth-surface.js';
// Valori calcolati a mano dalla funzione layout di KfScene.tsx (commit 342e8a9), con BOUNDS {top:.181,bottom:.819,left:.104,right:.896}:
// wf=.792, hf=.638, cx=.5. Desktop: ih=min(900*.68/.638, 1440*.36/(.792*2/3))=min(959.24765,981.81818)=959.24765, iw=ih*2/3=639.49843,
// x=720-iw*.5=400.25078, y=810-ih*.819=24.37618. Telefono: ih=min(min(812*.44,370)/.638, 375*.95/(.792*2/3))=min(560,674.71591)=560,
// iw=373.33333, x=187.5-iw*.5=.83333, y=812-266-560*.819=87.36.
const near=(actual,expected)=>{for(const k of ['x','y','w','h'])assert.ok(Math.abs(actual[k]-expected[k])<1e-4,`${k}: ${actual[k]} invece di ${expected[k]}`);};
test('layout: 1440x900 come KfScene.tsx',()=>near(layout(1440,900),{x:400.25078,y:24.37618,w:639.49843,h:959.24765}));
test('layout: 375x812 come KfScene.tsx',()=>near(layout(375,812),{x:.83333,y:87.36,w:373.33333,h:560}));
test('parametri del manubrio come KfScene.tsx',()=>{
 assert.deepEqual(BOUNDS,{top:.181,bottom:.819,left:.104,right:.896});
 assert.deepEqual(DEPTH_STYLE,{kind:'cupola'});
 assert.equal(maxDprFor(true),2);assert.equal(maxDprFor(false),1.5);});
test('imageUrl: con il tocco mai l\'immagine da 2048 px',()=>{
 for(const width of [100,300,560,800,1024,1600,3000])for(const dpr of [1,2,3])for(const kind of ['ceramic','kintsugi']){
  const url=imageUrl(kind,width,{touch:true,dpr});
  assert.match(url,new RegExp(`manubrio-${kind}-(640|1024)\\.webp$`),`${kind} ${width}px a ${dpr}x: ${url}`);}});
test('imageUrl: sul computer la più piccola che basta (DPR limitato a 1,5)',()=>{
 assert.equal(imageUrl('ceramic',300,{touch:false,dpr:1}),'/assets/palestre/manubrio-ceramic-640.webp');
 assert.equal(imageUrl('kintsugi',639.5,{touch:false,dpr:1}),'/assets/palestre/manubrio-kintsugi-1024.webp');
 assert.equal(imageUrl('ceramic',639.5,{touch:false,dpr:2}),'/assets/palestre/manubrio-ceramic-1024.webp');
 assert.equal(imageUrl('kintsugi',800,{touch:false,dpr:2}),'/assets/palestre/manubrio-kintsugi.webp');});
test('dumbbellImage: le tre misure in assets/palestre/',()=>{
 assert.equal(dumbbellImage('ceramic',''),'/assets/palestre/manubrio-ceramic.webp');
 assert.equal(dumbbellImage('kintsugi','-640'),'/assets/palestre/manubrio-kintsugi-640.webp');
 assert.equal(dumbbellImage('ceramic','-1024'),'/assets/palestre/manubrio-ceramic-1024.webp');});
test('preload: solo la sagoma da 1024 px, sui dispositivi a tocco, ed è quella che il telefono chiede',()=>{
 for(const page of ['palestre/index.html','en/palestre/index.html','fr/palestre/index.html','de/palestre/index.html']){
  const html=readFileSync(new URL(`../${page}`,import.meta.url),'utf8');
  const images=[...html.matchAll(/<link rel="preload" as="image"[^>]*>/g)].map(m=>m[0]);
  assert.deepEqual(images,['<link rel="preload" as="image" href="/assets/palestre/manubrio-ceramic-1024.webp" media="(hover: none)" fetchpriority="high">'],page);}
 for(const dpr of [2,3])assert.equal(imageUrl('ceramic',layout(375,812).w,{touch:true,dpr}),'/assets/palestre/manubrio-ceramic-1024.webp');});
// Rilievo a cupola come depth-surface.ts di 342e8a9: cresce dal bordo della sagoma verso l'interno, è zero fuori.
test('domeRelief: zero fuori dalla sagoma, più alto al centro che vicino al bordo',()=>{
 const W=40,H=20,data=new Uint8ClampedArray(W*H*4);for(let y=4;y<16;y++)for(let x=4;x<36;x++)data[(y*W+x)*4+3]=255;
 const make=()=>({width:0,height:0,getContext:()=>({drawImage(){},getImageData:()=>({data})})});
 const {w,h,data:out}=domeRelief({width:W,height:H},make);
 assert.equal(w,W);assert.equal(h,H);assert.equal(out[0],0);assert.equal(out[2*W+20],0);
 assert.ok(out[10*W+20]>out[4*W+20],`centro ${out[10*W+20]}, bordo ${out[4*W+20]}`);assert.ok(out[10*W+20]>0);});
// Il rilievo non si calcola mentre la pagina si carica: sul telefono il manubrio non gira mai, quindi mai.
test('makeDepth cupola: niente lavoro finché non serve un\'inclinazione',()=>{
 const saved=globalThis.matchMedia;globalThis.matchMedia=()=>({matches:true});let made=0;
 try{const depth=makeDepth({width:64,height:96},()=>{made++;return {getContext:()=>null};},{kind:'cupola'});
  assert.equal(made,0);assert.equal(depth.gpu,undefined);assert.equal(typeof depth.prepare,'function');}finally{globalThis.matchMedia=saved;}});
