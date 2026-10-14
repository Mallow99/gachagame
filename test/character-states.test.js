import test from 'node:test';
import assert from 'node:assert/strict';
import {Battle} from '../src/combat/engine.js';
import {content} from '../src/content/index.js';
const fixture={id:'state-fixture',worldId:'kirbys-adventure-1993',environment:{sceneId:'ka-valley'},waves:[{spawns:[{enemyId:'bonkers',count:1}]}],clearRules:{timeLimitSeconds:600},enemyDamageScale:.001};
function setup(id){const b=new Battle({encounter:fixture,party:[id],seed:1});b.advance(1);const hero=b.living(true)[0],enemy=b.living(false)[0];hero.action=null;hero.readyIn=100;enemy.hp=enemy.maxHp=100000;return{b,hero,enemy};}
test('Bio Spark has told entry and exit, cannot dodge damage over time, and returns to targeting',()=>{
 const{b,hero,enemy}=setup('bio-spark');b.startAction(hero,{...hero.definition.skill,kind:'skill'},enemy);const before=hero.hp;b.damage(enemy,hero,1,{behavior:'shot'});assert.equal(hero.hp,before);b.damage(enemy,hero,.1,{behavior:'burn'});assert.ok(hero.hp<before);assert.equal(b.living(true).length,0);b.advance(1);assert.ok(b.living(true).includes(hero));assert.ok(b.events.some(e=>e.type==='vanish-start'));assert.ok(b.events.some(e=>e.type==='vanish-end'));
});
test('Chilly shield bursts when consumed and a planted Knuckle Joe string grants energy',()=>{
 const c=setup('chilly');c.b.applyEffect(c.hero,c.hero,c.hero.definition.skill.effects[0]);assert.ok(c.hero.shield>0);c.hero.shield=0;const before=c.enemy.hp;c.enemy.x=c.hero.x+80;c.b.advance(.04);assert.ok(c.enemy.hp<before);assert.equal(c.hero.shieldBurst,undefined);
 const k=setup('knuckle-joe');k.b.startAction(k.hero,{...k.hero.definition.basic,kind:'basic'},k.enemy);k.b.advance(1.3);assert.ok(k.hero.energy>=12);assert.equal(k.hero.action,null);
});
test('the Star Rod loan starts at Nightmare, changes attacks and ends without ownership',()=>{
 const b=new Battle({encounter:content.encounters.get('ka-20'),party:['adventure-kirby'],rank:35,threat:35});b.wait=0;b.nextWave();const k=b.living(true)[0];assert.equal(k.encounterLoan,undefined);b.pending=[];b.nextWave();b.pending=[];b.nextWave();assert.equal(k.encounterLoan,'star-rod');k.skillIn=0;assert.equal(b.chooseAbility(k).id,'loan-fountain-arc');b.end(true);assert.equal(k.encounterLoan,null);assert.ok(b.events.some(e=>e.type==='encounter-loan-end'));
});
test('Bowser crashes once with his feet down, then delivers all eight flame ticks',()=>{
 const b=new Battle({encounter:fixture,party:['bowser'],mode:'endless',seed:1});b.advance(1);
 const hero=b.living(true)[0],enemy=b.living(false)[0];hero.action=null;hero.readyIn=100;enemy.hp=enemy.maxHp=100000;enemy.readyIn=100;enemy.action=null;
 b.startAction(hero,{...hero.definition.ultimate,kind:'ultimate'},enemy);const action=hero.action;
 b.advance(.25);assert.ok(hero.y>40);assert.equal(b.events.filter(e=>e.type==='entry-impact').length,0);
 while(b.time-action.start<action.marker)b.step();
 const impact=b.events.find(e=>e.type==='entry-impact');assert.equal(impact.values.y,0);assert.equal(hero.y,0);
 b.advance(action.duration);
 assert.equal(b.events.filter(e=>e.type==='entry-impact').length,1);
 assert.equal(b.events.filter(e=>e.type==='animation-marker'&&e.abilityId===hero.definition.ultimate.id).length,8);
 const hits=b.events.filter(e=>e.type==='damage'&&e.abilityId===hero.definition.ultimate.id);
 assert.equal(hits.length,9);assert.ok(hits.every(e=>e.atMs>=impact.atMs));assert.equal(hero.action,null);
});
test('Dedede lands and deals the primary hit and quake at the same contact, with no extra recovery hit',()=>{
 const{b,hero,enemy}=setup('king-dedede');enemy.action=null;enemy.readyIn=100;enemy.moveSpeed=0;
 b.startAction(hero,{...hero.definition.ultimate,kind:'ultimate'},enemy);const action=hero.action;
 b.advance(action.marker-.08);assert.ok(hero.y>0);const before=enemy.hp;
 while(b.time-action.start<action.marker)b.step();
 const marker=b.events.find(e=>e.type==='animation-marker'&&e.abilityId===action.ability.id);
 assert.equal(marker.values.y,0);assert.equal(hero.x,action.to);assert.ok(enemy.hp<before);
 const hits=b.events.filter(e=>e.type==='damage'&&e.abilityId===action.ability.id);
 assert.equal(hits.length,2);assert.ok(hits.every(e=>e.atMs===marker.atMs));
 b.advance(action.duration);assert.equal(b.events.filter(e=>e.type==='damage'&&e.abilityId===action.ability.id).length,2);
});
test('multi-pass charge contacts follow their physical routes and retarget after a defeat',()=>{
 const b=new Battle({encounter:{...fixture,waves:[{spawns:[{enemyId:'waddle-dee',count:2,spacing:90}]}]},party:['adventure-meta-knight'],seed:3});b.advance(1);
 const hero=b.living(true)[0],[first,second]=b.living(false);hero.action=null;hero.readyIn=100;
 for(const e of [first,second]){e.action=null;e.readyIn=100;e.moveSpeed=0;e.hp=e.maxHp=100000;}
 b.startAction(hero,{...hero.definition.ultimate,kind:'ultimate'},first);const action=hero.action,before=first.hp;
 b.advance(.15);assert.equal(first.hp,before);assert.ok(hero.x>action.from);
 let checked=0;
 while(hero.action&&b.time-action.start<action.duration){
   b.step();for(const event of b.events.filter(e=>e.type==='animation-marker'&&e.abilityId===action.ability.id&&e.values.index>=checked)){
     const victim=b.actors.find(a=>a.uid===event.targetId);assert.ok(Math.abs(event.values.x-victim.x)<=20,'contact reaches its visible target');checked++;
   }
   if(checked===2&&first.hp>0){first.hp=0;b.knockout(first,hero,action.ability);}
 }
 const markers=b.events.filter(e=>e.type==='animation-marker'&&e.abilityId===action.ability.id);
 assert.equal(markers.length,8);assert.equal(markers[0].targetId,first.uid);assert.equal(markers[1].targetId,second.uid);
 assert.ok(markers.slice(2).every(e=>e.targetId===second.uid));assert.equal(hero.action,null);
 const hits=b.events.filter(e=>e.type==='damage'&&e.abilityId===action.ability.id);assert.equal(hits.length,9);
});
test('Cape Counter tells its exit and return, answers once, and replaces the fallback strike',()=>{
 const{b,hero,enemy}=setup('adventure-meta-knight');enemy.action=null;enemy.readyIn=100;enemy.moveSpeed=0;
 b.startAction(hero,{...hero.definition.skill,kind:'skill'},enemy);const oldX=hero.x,oldHp=enemy.hp;
 b.advance(.2);b.damage(enemy,hero,.1,{behavior:'strike'});
 assert.equal(enemy.hp,oldHp);assert.equal(hero.x,oldX);assert.ok(hero.counterAnswer);assert.ok(b.events.some(e=>e.type==='counter-exit'));
 b.advance(.1);assert.equal(enemy.hp,oldHp);assert.ok(hero.vanishUntil>b.time);b.advance(.12);assert.ok(enemy.hp<oldHp);assert.ok(hero.x>enemy.x);assert.equal(hero.counterAnswer,undefined);
 b.advance(1);const hits=b.events.filter(e=>e.type==='damage'&&e.abilityId===hero.definition.skill.id);
 assert.equal(hits.length,1);assert.equal(hits[0].values.raw,hero.attack*1.45);assert.equal(b.events.filter(e=>e.type==='counter').length,1);
});
test('an untriggered Cape Counter uses its fallback and burn cannot trigger a teleport',()=>{
 const{b,hero,enemy}=setup('adventure-meta-knight');enemy.action=null;enemy.readyIn=100;
 b.startAction(hero,{...hero.definition.skill,kind:'skill'},enemy);b.damage(enemy,hero,.05,{behavior:'burn'});assert.equal(hero.counterAnswer,undefined);
 b.advance(1.2);const hits=b.events.filter(e=>e.type==='damage'&&e.abilityId===hero.definition.skill.id);
 assert.equal(hits.length,1);assert.equal(hits[0].values.raw,hero.attack*.8);assert.equal(b.events.filter(e=>e.type==='counter-exit').length,0);
});
test('Bandana barrage and its final spear deal damage only when their projectiles arrive',()=>{
 const{b,hero,enemy}=setup('bandana-waddle-dee');hero.x=200;enemy.x=600;enemy.action=null;enemy.readyIn=100;enemy.moveSpeed=0;
 b.startAction(hero,{...hero.definition.ultimate,kind:'ultimate'},enemy);const action=hero.action;
 while(hero.action)b.step();
 const finisher=b.projectiles.find(p=>p.ability.finisher);assert.ok(finisher);assert.equal(finisher.coefficient,2.4);
 const earlierHits=b.events.filter(e=>e.type==='damage'&&e.abilityId===action.ability.id);assert.ok(earlierHits.length<9);
 b.advance(1.2);const hits=b.events.filter(e=>e.type==='damage'&&e.abilityId===action.ability.id);assert.equal(hits.length,9);
 for(const hit of hits)assert.ok(b.events.some(e=>e.type==='animation-marker'&&e.values.marker==='projectileHit'&&e.atMs===hit.atMs&&e.targetId===hit.targetId));
});
test('a single charge reaches its locked destination at contact before moving into recovery',()=>{
 const{b,hero,enemy}=setup('wheelie');hero.x=300;enemy.x=560;enemy.action=null;enemy.readyIn=100;enemy.moveSpeed=0;
 b.startAction(hero,{...hero.definition.basic,kind:'basic'},enemy);const action=hero.action,before=enemy.hp;
 b.advance(action.marker-.08);assert.equal(enemy.hp,before);assert.ok(hero.x<enemy.x);
 while(action.nextHit===0)b.step();const marker=b.events.find(e=>e.type==='animation-marker'&&e.abilityId===action.ability.id);
 assert.ok(Math.abs(marker.values.x-enemy.x)<6);assert.ok(enemy.hp<before);
 b.advance(1);assert.equal(hero.action,null);assert.equal(hero.x,action.to);
});
