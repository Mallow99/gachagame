import assert from 'node:assert/strict';
import test from 'node:test';
import {defaultSave,worldProgress,KIRBY_WORLD,ownership} from '../src/save/default-save.js';
import {content} from '../src/content/index.js';
import {drawPulls,bannerStatus,ssrChance,publishedRates} from '../src/gacha.js';
import {createSeededRandom} from '../src/random.js';
import {Game} from '../src/game.js';
function funded(){const s=defaultSave(10);s.inventory.starlight=10000000;s.inventory.supplyTickets=100000;
  s.progression.worlds['super-mario-bros-1985'].firstClearEncounterIds=['smb1-01','smb1-03','smb1-05'];s.progression.worlds['super-mario-bros-1985'].highestStageCleared=5;return s;}
const fighter=content.banners.get('smb1-overworld-fighter'),powerup=content.banners.get('smb1-overworld-powerup-cache'),assist=content.banners.get('smb1-overworld-assist-call');
test('spendable Spotlights unlock through play; regional Archives retain their content gates',()=>{
  assert.equal(bannerStatus(fighter,defaultSave()).ready,false);assert.equal(bannerStatus(fighter,funded()).ready,true);
  assert.equal(bannerStatus(content.banners.get('mario-saga-fighter-archive'),funded()).ready,false);
});
test('the first result is new and can join the starter party',()=>{
  for(let i=0;i<100;i++){const s=funded(),r=drawPulls(s,fighter,1,createSeededRandom(i),10);assert.equal(r.receipt.results[0].isNew,true);assert.notEqual(r.receipt.results[0].id,'classic-mario');assert.equal(r.save.inventory.starlight,s.inventory.starlight-100);}
});
test('Dream welcome excludes alternate versions of the starter family',()=>{
  const s=funded();s.progression.worlds[KIRBY_WORLD]=worldProgress(16);s.progression.worlds[KIRBY_WORLD].firstClearEncounterIds=['ka-01'];s.collection.units['adventure-kirby']=ownership();
  const b=content.banners.get('ka-fighter');for(let i=0;i<100;i++){const r=drawPulls(s,b,1,createSeededRandom(i));assert.notEqual(content.units.get(r.receipt.results[0].id).familyId,'kirby');}
});
test('ten results contain a new SR or better even when spent singly',()=>{
  let s=funded();for(let i=0;i<10;i++)s=drawPulls(s,fighter,1,()=>0.999,10+i).save;
  assert.equal(s.progression.hubWelcome.mario.newSr,true);assert.ok(s.collection.units['hammer-bro']);assert.equal(s.banners.fighter.totalPulls,10);
});
test('natural SSRs survive the welcome safeguard and reset hard pity',()=>{
  const s=funded();s.progression.hubWelcome.mario.pulls=9;s.banners.fighter.sinceSsr=69;
  const result=drawPulls(s,fighter,1,()=>0.999);assert.equal(result.receipt.results[0].rarity,'SSR');assert.equal(result.receipt.results[0].id,'bowser');assert.equal(result.save.banners.fighter.sinceSsr,0);assert.equal(result.save.banners.fighter.featuredGuarantee,false);
});
test('Supply pages share pity while keeping result kinds separate',()=>{
  let s=funded();s.banners.supply.sinceSsr=44;s=drawPulls(s,powerup,1,()=>0.99).save;assert.equal(s.banners.supply.sinceSsr,0);
  const r=drawPulls(s,assist,10,createSeededRandom(77));assert.ok(r.receipt.results.every(e=>e.kind==='assist'));assert.equal(r.save.banners.supply.totalPulls,11);assert.equal(r.save.banners.fighter.totalPulls,0);
});
test('capped fighter duplicates and item duplicates convert to the documented Echoes',()=>{
  const s=funded();s.progression.hubWelcome.mario={pulls:10,newSr:true};s.collection.units['classic-mario'].stars=5;
  const r=drawPulls(s,fighter,1,sequence(.99,0));assert.equal(r.receipt.results[0].id,'classic-mario');assert.equal(r.save.collection.units['classic-mario'].stars,5);assert.equal(r.save.inventory.echoes,10);
});
test('pulls are committed before reveal; clearing the pending receipt cannot reroll results',()=>{
  const storage={map:new Map(),getItem(k){return this.map.get(k)||null;},setItem(k,v){this.map.set(k,v);}};
  const g=new Game({storage,save:funded(),seed:5,now:()=>10});const r=g.pull(fighter.id,10);const saved=JSON.parse(storage.getItem('pocketgacha.save.v4'));
  assert.equal(saved.banners.pendingReveal.id,r.id);assert.equal(saved.banners.fighter.totalPulls,10);const units=structuredClone(g.owned),cash=g.inventory.starlight;
  g.finishReveal();assert.deepEqual(g.owned,units);assert.equal(g.inventory.starlight,cash);assert.equal(g.state.banners.pendingReveal,null);
});
test('a failed save write rolls back a paid draw',()=>{
  const storage={getItem(){return null;},setItem(){throw new Error('Quota exceeded');}};const g=new Game({storage,save:funded(),seed:5});const before=structuredClone(g.state);
  assert.equal(g.pull(fighter.id,10),false);assert.deepEqual(g.state,before);
});
test('normal and soft-pity probabilities use the live shared rules',()=>{
  assert.equal(ssrChance('fighter',{sinceSsr:0}),.03);assert.equal(ssrChance('fighter',{sinceSsr:50}),.06);assert.equal(ssrChance('supply',{sinceSsr:44}),1);
});
function sequence(...values){let i=0;return()=>values[i++]??0;}
test('Dream SSR selection separates the advertised focus share and remembers a nonfeatured result',()=>{
 const s=funded();s.progression.worlds[KIRBY_WORLD]=worldProgress(16);s.progression.worlds[KIRBY_WORLD].firstClearEncounterIds=['ka-01'];s.progression.hubWelcome.kirby={pulls:10,newSr:true};
 const b=content.banners.get('ka-fighter'),r=drawPulls(s,b,1,sequence(0,.9,0));assert.equal(r.receipt.results[0].id,'bandana-waddle-dee');assert.equal(r.save.banners.fighter.featuredGuarantee,true);
 const next=drawPulls(r.save,b,1,sequence(0,0));assert.equal(next.receipt.results[0].id,'king-dedede');assert.equal(next.save.banners.fighter.featuredGuarantee,false);
 const rates=publishedRates(b,s);assert.equal(rates.find(e=>e.itemId==='king-dedede').probability,.015);assert.equal(rates.find(e=>e.itemId==='bandana-waddle-dee').probability,.015);assert.ok(Math.abs(rates.reduce((n,e)=>n+e.probability,0)-1)<1e-9);
});
test('a duplicate Power-Up converts directly to its tier Echoes',()=>{
 const s=funded();s.collection.powerups['super-mushroom']={discoveredAt:10};const r=drawPulls(s,powerup,1,sequence(.9,0));assert.equal(r.receipt.results[0].id,'super-mushroom');assert.equal(r.receipt.results[0].isNew,false);assert.equal(r.save.inventory.echoes,10);
});
test('a fully owned Supply page cannot fund an increasing ticket loop in expectation',()=>{
 const s=funded(),rates=publishedRates(powerup,s);const expected=rates.reduce((n,e)=>n+e.probability*({R:10,SR:40,SSR:150}[e.rarity]),0);assert.ok(expected<40);const g=new Game({save:s});g.state.inventory.echoes=39;assert.equal(g.exchange('ticket'),false);g.state.inventory.echoes=40;const before=g.inventory.supplyTickets;g.exchange('ticket');assert.equal(g.inventory.supplyTickets,before+1);assert.equal(g.inventory.echoes,0);
});
test('an unfinished committed reveal cannot be charged a second time',()=>{
 const g=new Game({save:funded()});g.pull(fighter.id,1);const before=g.inventory.starlight;assert.equal(g.pull(fighter.id,1),false);assert.equal(g.inventory.starlight,before);g.finishReveal();assert.ok(g.pull(fighter.id,1));
});
