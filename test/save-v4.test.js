import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {defaultSave,ownership,KIRBY_WORLD,worldProgress} from '../src/save/default-save.js';
import {migrateSave} from '../src/save/migrate.js';
import {loadSave,writeSave} from '../src/save/storage.js';
const memory=()=>{const map=new Map();return{getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),map};};

test('new SaveV4 grants only Mario and account-wide Rank 1',()=>{
  const s=defaultSave(10);assert.deepEqual(Object.keys(s.collection.units),['classic-mario']);assert.equal(s.inventory.starlight,0);assert.equal(s.inventory.coins,300);assert.equal(s.progression.training.rank,1);
});
test('v3 migration preserves currency, pity, prototype levels and all duplicate value',()=>{
  const v3=JSON.parse(readFileSync(new URL('./fixtures/save-v3.json',import.meta.url)));const before=structuredClone(v3),s=migrateSave(v3,100);
  assert.deepEqual(v3,before);assert.equal(s.inventory.starlight,v3.gems);assert.equal(s.inventory.coins,v3.gold);
  assert.equal(s.banners.fighter.sinceSsr,v3.pitySsr);assert.equal(s.banners.fighter.totalPulls,v3.totalPulls);
  assert.deepEqual(s.collection.legacyUnits,v3.owned);assert.equal(s.progression.worlds['super-mario-bros-1985'].highestStageCleared,0);
  assert.deepEqual(migrateSave(s,100),s);
});
test('party repair retains ownership and removes invalid families and cross-Hub equipment',()=>{
  const s=defaultSave(10);s.collection.units['adventure-kirby']=ownership(10);s.collection.units['dream-land-kirby']=ownership(10);s.collection.units['retired-record']={stars:5,masteryRank:2,masteryXp:10};
  s.collection.powerups['fire-flower']={discoveredAt:10};s.progression.worlds[KIRBY_WORLD]=worldProgress(16);
  s.loadouts.presets.dream={name:'Dream',mode:'story',sagaId:'kirby',unitIds:['adventure-kirby','dream-land-kirby','retired-record'],rows:['back','front','front'],powerupIds:['fire-flower',null,null],assistId:null};
  s.loadouts.activePresetId='dream';const repaired=migrateSave(s,10);
  assert.deepEqual(repaired.loadouts.presets.dream.unitIds,['adventure-kirby']);assert.deepEqual(repaired.loadouts.presets.dream.powerupIds,[null]);
  assert.equal(repaired.collection.units['retired-record'].stars,5);assert.ok(repaired.content.missingIds.includes('retired-record'));
});
test('storage keeps timestamped migration and corrupt-save backups',()=>{
  const storage=memory(),v3=readFileSync(new URL('./fixtures/save-v3.json',import.meta.url),'utf8');storage.setItem('pocketgacha.save.v1',v3);
  const result=loadSave(storage,123);assert.equal(storage.getItem('pocketgacha.save.v3.backup.123'),v3);assert.match(result.notice,/upgraded/);
  storage.setItem('pocketgacha.save.v4','broken json');const recovery=loadSave(storage,456);assert.equal(storage.getItem('pocketgacha.save.recovery.456'),'broken json');assert.match(recovery.notice,/recovery/);
});
test('save round trips fighter and Supply pity independently',()=>{
  const storage=memory(),s=defaultSave(10);s.banners.fighter.sinceSsr=51;s.banners.supply.sinceSsr=17;writeSave(storage,s,10);
  assert.deepEqual(loadSave(storage,10).save,s);
});
test('malformed nested records repair without losing valid currency or unknown ownership',()=>{
 const s=defaultSave(10);s.inventory.starlight=450;s.profile.audio={music:'bad',voice:3};s.progression.hubWelcome={mario:null};s.progression.worlds['super-mario-bros-1985']=null;s.progression.orders.storedFolders={};s.loadouts.presets.broken=null;s.collection.assists.retired={proficiencyXp:99};s.collection.units.retired=ownership(10);s.banners.history=[null,{id:'bad',results:null}];
 const fixed=migrateSave(s,10);assert.equal(fixed.inventory.starlight,450);assert.equal(fixed.collection.assists.retired.proficiencyXp,99);assert.ok(fixed.content.missingIds.includes('retired'));assert.equal(fixed.profile.audio.voice,1);assert.deepEqual(fixed.banners.history,[]);assert.deepEqual(migrateSave(fixed,10),fixed);
});
test('a saved reveal survives repair with the same committed results',()=>{
 const s=defaultSave(10),r={id:'receipt',at:10,sagaId:'mario',results:[{id:'retired',kind:'unit',rarity:'R',isNew:true,stars:0,echoes:0,joinedParty:false}]};s.banners.pendingReveal=r;s.banners.history=[r];const fixed=migrateSave(s,10);assert.deepEqual(fixed.banners.pendingReveal,r);assert.deepEqual(fixed.banners.history,[r]);
});
test('denied browser storage is an explicit exportable memory session',()=>{
 const loaded=loadSave({getItem(){throw new Error('Access denied');}},10);assert.equal(loaded.volatile,true);assert.match(loaded.notice,/memory/);assert.equal(loaded.save.inventory.coins,300);
});
test('partial reports and Orders repair while preserving retired fighter names',()=>{
 const s=defaultSave(10);s.telemetry.recentReports=[{runId:'old-run',encounterId:'smb1-01',seconds:100,party:[null,{id:'retired-fighter'}],stats:{damage:{'retired-fighter':42}},events:[null,{type:'damage',values:null}]}];s.progression.orders.storedFolders=[{id:'2026-10-14',baseline:{},stamps:['invalid','kills']}];
 const fixed=migrateSave(s,10),r=fixed.telemetry.recentReports[0];assert.equal(r.party[0].id,'retired-fighter');assert.equal(r.stats.damage['retired-fighter'],42);assert.deepEqual(r.stats.knockouts,[]);assert.deepEqual(r.events[0].values,{});assert.ok(fixed.progression.orders.storedFolders[0].missionIds.includes('training'));assert.deepEqual(fixed.progression.orders.storedFolders[0].stamps,['kills']);assert.deepEqual(migrateSave(fixed,10),fixed);
});
