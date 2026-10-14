import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../src/game.js';
import {content} from '../src/content/index.js';
import {ownership,FIRST_WORLD,KIRBY_WORLD,defaultSave} from '../src/save/default-save.js';
const memory=()=>({map:new Map(),getItem(k){return this.map.get(k)||null;},setItem(k,v){this.map.set(k,v);}});
test('all Mushroom stages lead to one Key, Dream unlock and its own starter at the saved Threat',()=>{
 const g=new Game({storage:memory(),seed:42,now:()=>100});
 for(const id of ['classic-luigi','toad','princess-peach']){g.state.collection.units[id]=ownership(100);g.toggleParty(id);}
 for(const id of content.worlds.get(FIRST_WORLD).implementedEncounterIds){const e=content.encounters.get(id);g.state.progression.training.rank=e.recommendedTrainingRank;assert.equal(g.start(id),true);
  g.battle.advance(601);assert.equal(g.battle.win,true,id);const report=g.battle.report();assert.ok(g.completeBattle(report));const money={...g.inventory};assert.equal(g.completeBattle(report),false);assert.deepEqual(g.inventory,money);
 }
 assert.equal(g.progress.highestStageCleared,15);assert.equal(g.progress.state,'complete');assert.equal(g.state.progression.atlas.rank,3);assert.equal(g.state.progression.atlas.keys,1);assert.equal(g.state.progression.endlessUnlockedBySaga.mario,true);
 assert.equal(g.owned['adventure-kirby'],undefined);assert.equal(g.switchWorld(KIRBY_WORLD),true);assert.equal(g.state.progression.atlas.keys,0);assert.equal(g.progress.threatSnapshot,16);assert.deepEqual(g.party,['adventure-kirby']);assert.ok(g.owned['adventure-kirby']);assert.equal(g.state.progression.endlessUnlockedBySaga.kirby,false);
 assert.equal(g.switchWorld(FIRST_WORLD),true);assert.equal(g.switchWorld(KIRBY_WORLD),true);assert.equal(g.state.progression.atlas.keys,0);
});
test('locked stages, cross-Hub parties and shared Assist families cannot deploy',()=>{
 const g=new Game();assert.equal(g.start('smb1-05'),false);assert.equal(g.start('ka-01'),false);assert.equal(g.switchWorld(KIRBY_WORLD),false);
 g.state.collection.units['adventure-kirby']=ownership();assert.equal(g.toggleParty('adventure-kirby'),false);assert.deepEqual(g.party,['classic-mario']);
 g.state.collection.assists['wise-waddle-dee']={proficiencyRank:1,proficiencyXp:0};assert.equal(g.equipAssist('wise-waddle-dee'),false);
});
test('Camps pay renewable Patrol Marks without replaying first-clear rewards',()=>{
 const g=new Game({seed:3});g.start();g.battle.advance(601);g.completeBattle(g.battle.report());const before=g.inventory.starlight;g.state.progression.training.rank=20;
 for(let i=0;i<10;i++){assert.equal(g.start('smb1-01','camp'),true);g.battle.advance(601);assert.equal(g.battle.win,true);g.completeBattle(g.battle.report());}
 assert.equal(g.inventory.starlight,before+100);assert.equal(g.state.progression.orders.patrolMarks,0);assert.equal(g.progress.firstClearEncounterIds.length,1);
});
test('paused and hidden strips do not advance combat; offline income cannot clear a stage',()=>{
 let now=1000;const g=new Game({storage:memory(),now:()=>now});g.start();const time=g.battle.time;g.pause();g.tick(1);assert.equal(g.battle.time,time);g.pause();g.setting('stripHidden',true);g.tick(1);assert.equal(g.battle.time,time);
 g.setting('stripHidden',false);g.battle.advance(601);g.completeBattle(g.battle.report());const progress=structuredClone(g.state.progression.worlds),before=g.inventory.starlight;
 now+=24*3600*1000;g.welcome();assert.equal(g.away.seconds,12*3600);assert.ok(g.inventory.starlight>before);assert.deepEqual(g.state.progression.worlds,progress);const after=g.inventory.starlight;g.welcome();assert.equal(g.inventory.starlight,after);
});
test('a failed deployment write leaves the previous battle and seed counter intact',()=>{
 const storage=memory(),g=new Game({storage});assert.equal(g.start(),true);const before=g.battle,counter=g.state.session.seedCounter;storage.setItem=()=>{throw new Error('Storage full');};assert.equal(g.start(),false);assert.equal(g.battle,before);assert.equal(g.state.session.seedCounter,counter);
});
test('three earned Order stamps total 400 Starlight, 250 Coins and two tickets',()=>{
 const s=defaultSave(1000);s.progression.worlds[FIRST_WORLD].highestStageCleared=5;const g=new Game({save:s,now:()=>1000});g.makeOrders();const f=g.state.progression.orders.storedFolders[0];g.state.telemetry.totalWaves=20;g.state.telemetry.totalKills=30;g.state.telemetry.clears['smb1-01']={count:3,totalSeconds:330};g.updateOrders();assert.equal(f.stamps.length,3);
 const before={...g.inventory};for(const id of ['waves','kills','stages'])g.claimOrder(f.id,id);assert.equal(g.inventory.starlight-before.starlight,400);assert.equal(g.inventory.coins-before.coins,250);assert.equal(g.inventory.supplyTickets-before.supplyTickets,2);assert.equal(g.claimOrder(f.id,'stages'),false);
});
test('missed daily folders accumulate to three without granting completed stamps',()=>{
 let now=Date.parse('2026-10-10T12:00:00Z');const s=defaultSave(now);s.progression.worlds[FIRST_WORLD].highestStageCleared=5;const g=new Game({save:s,now:()=>now});g.makeOrders();assert.equal(g.state.progression.orders.storedFolders.length,1);
 now+=4*86400000;g.makeOrders();const folders=g.state.progression.orders.storedFolders;assert.equal(folders.length,3);assert.equal(new Set(folders.map(f=>f.id)).size,3);assert.ok(folders.every(f=>!f.claimed&&f.stamps.length===0));g.makeOrders();assert.equal(g.state.progression.orders.storedFolders.length,3);
});
test('a failed reward write is retained in exports and claimed exactly once after storage recovers',()=>{
 const storage=memory(),g=new Game({storage});g.start();g.battle.advance(601);const r=g.battle.report(),write=storage.setItem;storage.setItem=()=>{throw new Error('Storage full');};
 assert.equal(g.completeBattle(r),false);assert.equal(g.inventory.starlight,0);assert.equal(g.state.session.pendingBattleReward.runId,r.runId);assert.equal(g.start(),false);
 const recovered=new Game({save:JSON.parse(g.exportSave())});recovered.welcome();assert.equal(recovered.inventory.starlight,100);assert.equal(recovered.state.session.pendingBattleReward,null);
 storage.setItem=write;assert.equal(g.save(),true);assert.equal(g.inventory.starlight,100);assert.equal(g.state.session.pendingBattleReward,null);g.save();assert.equal(g.inventory.starlight,100);assert.equal(g.completeBattle(r),false);
});
test('Endless rotates completed-Hub courses, snapshots Atlas Threat and retains the best run',()=>{
 const s=defaultSave();s.progression.atlas.rank=3;s.progression.worlds[FIRST_WORLD].state='complete';s.progression.worlds[FIRST_WORLD].highestStageCleared=15;s.progression.endlessUnlockedBySaga.mario=true;s.progression.training.rank=50;
 const g=new Game({save:s});g.endlessPreset();assert.equal(g.start('ka-20','endless'),true);assert.equal(g.battle.encounter.id,'smb1-01');assert.equal(g.battle.threat,16);g.battle.advance(601);assert.equal(g.battle.win,true);g.completeBattle(g.battle.report());assert.equal(g.state.session.endlessRound,1);assert.equal(g.state.session.endlessBest,1);assert.equal(g.activeEncounter.id,'smb1-02');
 g.state.progression.training.rank=60;g.start(null,'endless');assert.equal(g.battle.threat,17);for(const a of g.battle.actors.filter(a=>a.hero))a.hp=0;g.battle.step();g.completeBattle(g.battle.report());assert.equal(g.state.session.endlessRound,0);assert.equal(g.state.session.endlessBest,1);
});
