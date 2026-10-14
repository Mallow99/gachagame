import assert from 'node:assert/strict';
import test from 'node:test';
import {Battle} from '../src/combat/engine.js';
import {content} from '../src/content/index.js';
import {fighterStats,hitDamage} from '../src/config/rules.js';
const mario=['classic-mario','classic-luigi','toad','princess-peach'];
function fixture(enemyId='goomba',extra={}){return{id:'interaction-fixture',worldId:'super-mario-bros-1985',environment:{sceneId:'test'},waves:[{spawns:[{enemyId,count:1}]}],clearRules:{timeLimitSeconds:600},enemyDamageScale:.01,...extra};}
function run(id,party,rank=1,threat=1,seed=42){return new Battle({encounter:content.encounters.get(id),party,rank,threat,seed}).advance(600);}
test('solo Mario clears the authored opener in 90–150 seconds below half health',()=>{
  const b=run('smb1-01',['classic-mario']);assert.equal(b.win,true);assert.ok(b.time>=90&&b.time<=150);assert.equal(b.wavesCleared,4);assert.equal(b.stats.knockouts.length,0);
  const hero=b.actors.find(a=>a.hero);assert.ok(hero.hp>0&&hero.hp/hero.maxHp<.5);
});
test('a seed reproduces the full event order and outcome',()=>{
  const a=run('smb1-01',['classic-mario'],1,1,124),b=run('smb1-01',['classic-mario'],1,1,124);assert.deepEqual(a.report(),b.report());
});
test('damage follows the landing marker and every defeated Goomba has a flatten event',()=>{
  const b=run('smb1-01',['classic-mario']);
  for(const event of b.events.filter(e=>e.type==='damage'&&e.abilityId==='classic-stomp')){
    assert.ok(b.events.some(e=>e.type==='animation-marker'&&e.atMs===event.atMs&&e.sourceId===event.sourceId&&e.values.marker==='land'));
  }
  assert.ok(b.events.filter(e=>e.type==='knockout').every(e=>e.values.flatten));
});
test('readiness is concurrent and actors stay inside the strip',()=>{
  const b=new Battle({encounter:content.encounters.get('smb1-04'),party:mario,rank:5,threat:4,seed:42});let parallel=false;
  for(let i=0;i<4000&&!b.done;i++){b.step();parallel||=b.actors.filter(a=>a.hero&&a.action).length>1;assert.ok(b.actors.every(a=>Number.isFinite(a.hp)&&Number.isFinite(a.x)&&a.x>=30&&a.x<=970));}
  assert.equal(parallel,true);
});
test('paired boss phases never create NaN health or bypass the enrage',()=>{
  const b=run('smb1-05',mario,6,5);assert.equal(b.win,true);assert.ok(b.actors.every(a=>Number.isFinite(a.hp)));assert.ok(b.stats.bossPhases.some(p=>p.includes('survivor-enrage')));assert.ok(b.time>180);
});
test('the first boss has a recovery path for three common fighters without a healer',()=>{
 const b=run('smb1-05',['classic-mario','classic-luigi','koopa-troopa'],6,5,42);assert.equal(b.win,true);assert.ok(b.time<400);assert.ok(b.living(true).length>0);
});
test('Kirby swallows fodder, reflects projectiles and uses non-swallow elite/boss fallbacks',()=>{
  for(const [id,expected] of [['hot-head','swallow'],['bonkers','inhale-fallback'],['whispy-woods','inhale-fallback']]){
    const b=new Battle({encounter:fixture(id),party:['adventure-kirby'],mode:'endless'});b.advance(1);const k=b.actors.find(a=>a.hero),target=b.actors.find(a=>!a.hero);target.hp=target.maxHp*.2;
    b.inhale(k,target,{threshold:.35,pull:65},{behavior:'shot'});assert.ok(b.events.some(e=>e.type===expected));if(expected==='swallow'){assert.equal(target.hp,0);assert.equal(k.copy,'fire');}else assert.ok(target.hp>0);
  }
  const b=new Battle({encounter:fixture('hot-head'),party:['adventure-kirby'],mode:'endless'});b.advance(1);const k=b.actors.find(a=>a.hero),e=b.actors.find(a=>!a.hero);
  b.projectile(e,k,{behavior:'shot',effects:[]},1);b.projectiles[0].x=k.x+20;b.inhale(k,e,{threshold:0},{behavior:'shot'});
  assert.ok(b.events.some(e=>e.type==='projectile-consume'));assert.ok(b.projectiles.some(p=>p.hero));
});
test('out-of-library Copy has a refund and Game Boy Kirby cannot Copy',()=>{
  const b=new Battle({encounter:fixture('rocky'),party:['adventure-kirby'],mode:'endless'});b.advance(1);const k=b.actors.find(a=>a.hero),e=b.actors.find(a=>!a.hero);e.hp=e.maxHp*.2;
  const cooldown=k.skillIn;b.copy(k,e);assert.equal(k.copy,null);assert.equal(k.copyFallbackShots,3);assert.ok(k.skillIn<cooldown);
  const g=new Battle({encounter:fixture('hot-head'),party:['dream-land-kirby'],mode:'endless'});g.advance(1);const gb=g.actors.find(a=>a.hero);g.copy(gb,g.actors.find(a=>!a.hero));assert.equal(gb.copy,null);
});
test('an elite Ability Star can supply Hammer and a Stone state always exits',()=>{
  const b=new Battle({encounter:fixture('bonkers'),party:['adventure-kirby'],mode:'endless'});b.advance(1);const k=b.actors.find(a=>a.hero),e=b.actors.find(a=>!a.hero);e.hp=0;b.knockout(e,k,{behavior:'shot'});assert.equal(k.copy,'hammer');
  const s=new Battle({encounter:fixture('goomba'),party:['rocky'],mode:'endless'});const rocky=s.actors[0];s.applyEffect(rocky,rocky,{type:'stone',durationSeconds:2.5});s.advance(3);assert.ok(rocky.stoneUntil<s.time);
});
test('returning Cutter crosses back toward its owner and catches are interruptible',()=>{
  const b=new Battle({encounter:fixture(),party:['sir-kibble'],mode:'endless'});b.advance(1);const k=b.actors.find(a=>a.hero),target=b.actors.find(a=>!a.hero);
  target.hp=target.maxHp=100000;b.projectile(k,target,k.definition.basic,.9);b.advance(2);
  assert.ok(b.events.some(e=>e.type==='projectile-return'));assert.ok(b.events.some(e=>e.type==='projectile-catch'));
});
test('Training scales every newly acquired fighter and mitigation stays finite',()=>{
  const u=content.units.get('king-dedede'),a=fighterStats(u,12,{stars:0});assert.ok(a.hp>u.baseStats.hp);assert.equal(a.guard,u.baseStats.guard);
  assert.equal(hitDamage({attack:1,critChance:0},{guard:180},1,()=>.5).final,1);
});
