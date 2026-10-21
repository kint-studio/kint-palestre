import {test} from 'node:test';
import assert from 'node:assert/strict';
import {composeLandingMail} from '../assets/palestre/contact.js';
const labels={subject:'Richiesta call: {x}',mailName:'Nome',mailBusiness:'Attività',mailSector:'Settore',mailEmail:'Email'};
const query=href=>{const [,q]=href.split('?');const p=Object.fromEntries(q.split('&').map(kv=>kv.split('=')));return {subject:decodeURIComponent(p.subject),body:decodeURIComponent(p.body)};};
test('mail: caratteri speciali (&, ?, #, accenti, a capo) codificati e letti identici',()=>{
 const href=composeLandingMail({name:'Andrea',business:'Palestra & Co #1?',email:'a@b.ch',message:'Ciao\nàèì',sector:'Retail, bellezza & fitness'},labels);
 assert.ok(href.startsWith('mailto:info@kint.ch?subject='));
 assert.equal(href.split('?').length,2,'un solo ? nell\'href');
 assert.doesNotMatch(href.slice(href.indexOf('?')),/[#\n ]/);
 const {subject,body}=query(href);
 assert.equal(subject,'Richiesta call: Palestra & Co #1?');
 assert.equal(body,'Nome: Andrea\nAttività: Palestra & Co #1?\nSettore: Retail, bellezza & fitness\nEmail: a@b.ch\n\nCiao\nàèì');});
test('mail: senza attività l\'oggetto usa il nome',()=>{
 const {subject}=query(composeLandingMail({name:'Andrea',business:'',email:'a@b.ch',message:'x',sector:'S'},labels));
 assert.equal(subject,'Richiesta call: Andrea');});
