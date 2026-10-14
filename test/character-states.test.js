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
