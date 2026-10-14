// Optional semantic UI test, deliberately separate from browser CSS checks.
// Supply POCKET_DOM_MODULE pointing to LinkeDOM's worker module.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath,pathToFileURL} from 'node:url';
const require=createRequire(import.meta.url);
const {parseHTML}=await import(process.env.POCKET_DOM_MODULE?pathToFileURL(process.env.POCKET_DOM_MODULE).href:'linkedom/worker');
const {createCanvas,Image}=require(process.env.POCKET_CANVAS_MODULE||'@napi-rs/canvas');
const root=fileURLToPath(new URL('..',import.meta.url));process.chdir(root);
const{document,window}=parseHTML(fs.readFileSync('index.html','utf8'));
const store=new Map(),storage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
window.localStorage=storage;window.devicePixelRatio=1;
window.AudioContext=class{constructor(){this.state='running';this.currentTime=0;}resume(){return Promise.resolve();}};
window.HTMLElement.prototype.showModal=function(){this.setAttribute('open','');};
window.HTMLElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new window.Event('close'));};
window.HTMLElement.prototype.scrollIntoView=function(){};window.HTMLElement.prototype.focus=function(){};
const native=createCanvas(600,220),canvas=document.querySelector('#battle-canvas');canvas.getContext=()=>native.getContext('2d');canvas.getBoundingClientRect=()=>({width:600,height:220});
Object.assign(globalThis,{window,document,Image,requestAnimationFrame:()=>1,cancelAnimationFrame:()=>{}});
const click=selector=>{const el=document.querySelector(selector);assert.ok(el,selector);el.click();};
async function until(predicate){for(let i=0;i<400;i++){if(predicate())return;await new Promise(r=>setTimeout(r,10));}throw new Error('UI state did not arrive.');}
await import('../src/main.js');await new Promise(r=>setTimeout(r,10));const game=window.__pocketGame;
click('[data-action="start"]');game.battle.advance(601);assert.equal(game.battle.win,true);game.completeBattle(game.battle.report());assert.equal(game.inventory.starlight,100);
click('[data-tab="party"]');click('[data-action="train"]');assert.equal(game.rank,2);click('[data-tab="summon"]');click('[data-action="pull"]');assert.ok(document.querySelector('.reveal-dialog'));
click('.reveal-skip');assert.equal(document.querySelectorAll('.result-card').length,1);assert.ok(document.querySelector('.result-card').textContent.includes('NEW'));click('.result-continue');await new Promise(r=>setTimeout(r,0));assert.equal(game.state.banners.pendingReveal,null);assert.equal(game.party.length,2);
click('[data-tab="party"]');click('[data-inspect="classic-mario"]');assert.ok(document.querySelector('.detail-dialog').textContent.includes('Classic Stomp'));click('.dialog-close');
click('[data-tab="manual"]');assert.ok(document.querySelector('#page').textContent.includes('Growth(Rank)'));assert.equal(document.querySelectorAll('[data-tab]').length,4);
game.state.profile.reducedMotion=true;game.state.inventory.starlight=100;game.state.banners.fighter.sinceSsr=69;click('[data-tab="summon"]');game.emit();click('[data-action="pull"]');
await until(()=>document.querySelector('.typed-quote')?.textContent.includes('Showtime'));assert.equal(document.querySelector('.hero-reveal'),null);
await until(()=>document.querySelector('.hero-reveal.SSR'));click('.reveal-skip');assert.ok(document.querySelector('.result-card.SSR'));const owned=JSON.stringify(game.owned),currency=game.inventory.starlight;click('.result-continue');await new Promise(r=>setTimeout(r,0));
click('[data-replay]');click('.reveal-skip');click('.result-continue');assert.equal(JSON.stringify(game.owned),owned);assert.equal(game.inventory.starlight,currency);
fs.writeFileSync('/tmp/pocket-smoke-dom.html',document.toString());console.log('DOM smoke passed: deploy/clear/train/pull/skip/party/kit/Manual/SSR quote/results/replay. CSS geometry and native desktop behavior require a real browser/device.');process.exit(0);
