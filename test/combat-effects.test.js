import test from 'node:test';
import assert from 'node:assert/strict';
import {Battle} from '../src/combat/engine.js';
const fixture={id:'effects-fixture',worldId:'super-mario-bros-1985',environment:{sceneId:'test'},waves:[{spawns:[{enemyId:'goomba',count:2,spacing:36}]}],clearRules:{timeLimitSeconds:600},enemyDamageScale:.001};
function setup(party,powerupIds=[],assistId=null){const b=new Battle({encounter:fixture,party,mode:'endless',powerupIds,assistId,seed:10});b.advance(1);for(const e of b.living(false))e.hp=e.maxHp=100000;for(const h of b.living(true)){h.action=null;h.readyIn=100;}return b;}
test('Luigi ultimate has four timed contacts, splash and a finite recovery',()=>{
 const b=setup(['classic-luigi']),h=b.living(true)[0],targets=b.living(false);h.energy=100;b.startAction(h,{...h.definition.ultimate,kind:'ultimate'},targets[0]);b.advance(2.5);
 const hits=b.events.filter(e=>e.type==='damage'&&e.sourceId===h.uid&&e.targetId===targets[0].uid);assert.equal(hits.length,4);assert.ok(b.stats.damage[h.id]>400);assert.equal(h.action,null);assert.ok(targets[1].hp<targets[1].maxHp);
});
test('Mario skill splashes a nearby second enemy on landing',()=>{
 const b=setup(['classic-mario']),h=b.living(true)[0],[a,z]=b.living(false);a.x=600;z.x=635;a.moveSpeed=z.moveSpeed=0;b.startAction(h,{...h.definition.skill,kind:'skill'},a);b.advance(1.5);assert.ok(z.hp<z.maxHp);assert.ok(z.squashUntil>0);
});
test('Toad delivery travels before it heals its ally',()=>{
 const b=setup(['toad','classic-mario']),h=b.living(true)[0],ally=b.living(true)[1];ally.hp-=300;const before=ally.hp;b.startAction(h,{...h.definition.skill,kind:'skill'},ally);
 b.advance(.35);assert.equal(ally.hp,before);assert.ok(b.projectiles.some(p=>p.kind==='parcel'));b.advance(1);assert.ok(ally.hp>before);
});
test('a fourth-basic Fire Flower proc waits for physical contact',()=>{
 const b=setup(['classic-mario'],['fire-flower']),h=b.living(true)[0],target=b.living(false)[0];h.basicActions=3;b.startAction(h,{...h.definition.basic,kind:'basic'},target);b.advance(.3);assert.equal(target.statuses.burn,undefined);b.advance(.5);assert.ok(target.statuses.burn);assert.ok(b.events.some(e=>e.type==='powerup-proc'&&e.values.id==='fire-flower'));
});
test('loose Shell exits, kicks, travels and collides',()=>{
 const b=setup(['koopa-troopa']),h=b.living(true)[0];h.hp=h.maxHp*.4;h.x=500;b.advance(1.6);assert.ok(b.shells.some(s=>s.kicked));b.advance(1);assert.ok(b.events.some(e=>e.type==='shell-collision'));assert.ok(h.stoneUntil<b.time);
});
test('stagger recovers without immediately retriggering a full gauge',()=>{
 const enc={...fixture,waves:[{spawns:[{enemyId:'bonkers',count:1}]}]};const b=new Battle({encounter:enc,party:['classic-mario'],mode:'endless'});b.advance(1);const boss=b.living(false)[0];boss.hp=boss.maxHp=100000;b.addStagger(boss,100,b.living(true)[0]);b.advance(5.1);assert.ok(boss.stagger<100);assert.equal(boss.statuses.stun,undefined);
});
test('Friend Heart shields after an Assist and Candy blocks an actual incoming hit',()=>{
 const b=setup(['adventure-kirby'],['friend-heart'],'mr-star');const h=b.living(true)[0];assert.ok(h.shield>0);
 const c=setup(['waddle-dee'],['invincibility-candy']),a=c.living(true)[0],enemy=c.living(false)[0];a.hp=a.maxHp*.2;c.itemProc(a,enemy,{kind:'damage'});const before=a.hp;c.damage(enemy,a,2,{behavior:'shot'});assert.equal(a.hp,before);c.advance(4.1);assert.equal(a.statuses.invulnerable,undefined);
});
test('Dream 1-Up adds a shield to a real heal after an ally KO and never revives itself',()=>{
 const b=setup(['adventure-kirby','waddle-dee'],['dream-one-up']),[wearer,ally]=b.living(true),enemy=b.living(false)[0];wearer.hp-=200;ally.hp=0;b.knockout(ally,enemy);assert.equal(ally.hp,0);assert.equal(wearer.shield,0);b.heal(wearer,wearer,1);assert.ok(wearer.shield>0);const shield=wearer.shield;b.heal(wearer,wearer,1);assert.equal(wearer.shield,shield);
});
test('zero-cooldown Assist interventions fire on consecutive short waves',()=>{
 const b=new Battle({encounter:fixture,party:['adventure-kirby'],mode:'endless',assistId:'mr-star'});b.advance(1);assert.equal(b.assistUses,1);b.checkAssist('wave-start');assert.equal(b.assistUses,1);b.assistWaveUses=0;b.checkAssist('wave-start');assert.equal(b.assistUses,2);
});
test('higher Assist proficiency improves the same complete intervention',()=>{
 const low=new Battle({encounter:fixture,party:['adventure-kirby'],mode:'endless',assistId:'mr-star',assistProficiencyRank:1}),high=new Battle({encounter:fixture,party:['adventure-kirby'],mode:'endless',assistId:'mr-star',assistProficiencyRank:5});low.advance(1);high.advance(1);assert.equal(low.assistUses,1);assert.equal(high.assistUses,1);assert.ok(high.actors[0].energy>low.actors[0].energy);
});
test('mastery improves delivered heals and ultimate support exactly once',()=>{
 const delivery=rank=>{const b=setup(['toad','classic-mario']),[toad,ally]=b.living(true);toad.mastery=rank;ally.hp-=500;const before=ally.hp;b.startAction(toad,{...toad.definition.skill,kind:'skill'},ally);const cooldown=toad.skillIn;b.advance(1.5);return{healed:ally.hp-before,cooldown};};
 const base=delivery(1),master=delivery(3);assert.ok(master.healed>base.healed*1.1&&master.healed<base.healed*1.15);assert.ok(Math.abs(master.cooldown/base.cooldown-.95)<.001);
 const wish=rank=>{const b=setup(['princess-peach','classic-mario']),[peach,ally]=b.living(true);peach.mastery=rank;ally.hp-=500;const before=ally.hp;b.startAction(peach,{...peach.definition.ultimate,kind:'ultimate'},peach);b.advance(.5);return{healed:ally.hp-before,shield:ally.shield};};
 const low=wish(1),high=wish(5);assert.ok(high.healed>low.healed*1.2&&high.healed<low.healed*1.3);assert.equal(high.shield/low.shield,1.25);
});
test('Blooper swims faster only in water and Hot Head widens the next action without a bonus hit',()=>{
 const land=setup(['blooper']),hero=land.living(true)[0];const water=new Battle({encounter:{...fixture,environment:{sceneId:'smb1-water'}},party:['blooper']});assert.ok(water.haste(water.actors[0])>land.haste(hero));
 const b=setup(['hot-head']),h=b.living(true)[0],target=b.living(false)[0];b.status(target,'burn',5,1,h);const hits=b.events.filter(e=>e.type==='damage').length;b.damage(h,target,.25,{behavior:'beam',kind:'basic'});assert.equal(b.events.filter(e=>e.type==='damage').length,hits+1);assert.equal(h.nextAreaScale,1.2);b.startAction(h,{...h.definition.basic,kind:'basic'},target);assert.equal(h.action.ability.areaScale,1.2);assert.equal(h.nextAreaScale,0);
});
test('Wheelie accelerates with RPM and loses a stack to a heavy collision or stun',()=>{
 const b=setup(['wheelie']),h=b.living(true)[0],target=b.living(false)[0];h.x=100;b.approach(h,900,.1);const ordinary=h.x-100;b.passive(h,'after-action');b.passive(h,'after-action');h.x=100;b.approach(h,900,.1);assert.ok(h.x-100>ordinary);assert.equal(h.momentum,2);target.definition={...target.definition,traits:['heavy']};b.damage(h,target,1,{behavior:'charge'});assert.equal(h.momentum,1);b.status(h,'stun',1,1);assert.equal(h.momentum,0);
});
test('Toadsworth enters before the tea parcel heals and cleanses the actual patient',()=>{
 const b=setup(['classic-mario'],[],'toadsworth-tea-service'),hero=b.living(true)[0],enemy=b.living(false)[0];hero.hp=hero.maxHp*.2;b.status(hero,'slow',8,.25,enemy);const before=hero.hp;b.checkAssist();assert.equal(b.assistUses,1);assert.equal(hero.hp,before);b.advance(.45);assert.ok(b.projectiles.some(p=>p.kind==='parcel'));assert.ok(hero.statuses.slow);b.advance(1);assert.ok(hero.hp>before);assert.equal(hero.statuses.slow,undefined);assert.ok(b.events.some(e=>e.type==='assist-resolve'));
});
test('Tiara catches only a projectile aimed at a back-row ally and then shields that row',()=>{
 const b=setup(['classic-mario','princess-peach'],[],'tiara-projectile-catch'),[front,back]=b.living(true),enemy=b.living(false)[0];front.row='front';back.row='back';b.projectile(enemy,front,{behavior:'shot',effects:[]},1);const frontShot=b.projectiles.at(-1);b.checkAssist();assert.equal(b.assistUses,0);
 b.projectile(enemy,back,{behavior:'shot',effects:[]},1);const backShot=b.projectiles.at(-1);b.checkAssist();assert.equal(b.assistUses,1);assert.equal(backShot.done,true);assert.equal(frontShot.done,false);b.advance(.5);assert.ok(back.shield>0);assert.equal(front.shield,0);
});
test('Sprixie grants the full energy and shield intervention at wave clear',()=>{
 const b=setup(['classic-mario'],[],'sprixie-wave-blessing'),hero=b.living(true)[0];const energy=hero.energy;b.checkAssist('wave-clear');b.resolveAssists(true);assert.equal(hero.energy,energy+5);assert.ok(hero.shield>0);
});
test('breath hits only its forward lane while Spark surrounds its owner at close range',()=>{
 const flame=setup(['bowser']),h=flame.living(true)[0],[front,back]=flame.living(false);h.x=400;front.x=520;back.x=350;
 for(const e of [front,back]){e.action=null;e.readyIn=100;e.moveSpeed=0;}
 const backHp=back.hp;flame.startAction(h,{...h.definition.skill,kind:'skill'},front);flame.advance(.7);
 assert.ok(front.hp<front.maxHp);assert.equal(back.hp,backHp);
 const spark=setup(['sparky']),s=spark.living(true)[0],[a,z]=spark.living(false);s.x=400;a.x=450;z.x=350;
 for(const e of [a,z]){e.action=null;e.readyIn=100;e.moveSpeed=0;}
 spark.startAction(s,{...s.definition.basic,kind:'basic'},a);spark.advance(.7);assert.ok(z.hp<z.maxHp);
 z.x=200;const outside=z.hp;spark.startAction(s,{...s.definition.basic,kind:'basic'},a);spark.advance(.7);assert.equal(z.hp,outside);
});
