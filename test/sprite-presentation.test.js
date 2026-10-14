import test from 'node:test';
import assert from 'node:assert/strict';
import manifest from '../assets/sprites/v1/manifest.mjs';
import {content} from '../src/content/index.js';
import {spriteFrameIndex,SpriteBank} from '../src/render/sprite-bank.js';
import {actorAnimation} from '../src/render/actor-animation.js';
import {REVEAL_ART} from '../src/presentation/art.js';

test('every opening fighter has art tied to its own source game',()=>{
  for(const fighter of content.units.values()){
    assert.equal(manifest[fighter.spriteKey].sourceGameId,fighter.sourceGameId,fighter.id);
    const art=REVEAL_ART[fighter.id];if(art?.sourceGameId)assert.equal(art.sourceGameId,fighter.sourceGameId,fighter.id+' portrait');
  }
  assert.notEqual(content.units.get('dream-land-kirby').spriteKey,content.units.get('adventure-kirby').spriteKey);
  assert.notEqual(content.units.get('blade-knight').spriteKey,'sword-knight');
});
test('weapon poses preserve native pixels and a stable anatomical scale',()=>{
  assert.equal(manifest.kirby.worldHeight/manifest.mario.worldHeight,.5);
  for(const key of ['dedede','meta-knight','bandana','kirby-sword','kirby-hammer']){
    const d=manifest[key];assert.ok(d.frameMetadata.length>3,key);
    for(const frame of d.frameMetadata)assert.equal(frame.pixelScale,1,key);
  }
});
test('finite attack and hurt clips hold their end while movement loops',()=>{
  const d=manifest.bandana;
  assert.equal(spriteFrameIndex(d,{state:'basic_resolve',time:50}),d.clips.basic_resolve.at(-1));
  assert.equal(spriteFrameIndex(d,{state:'hurt',progress:1}),d.clips.hurt.at(-1));
  assert.equal(spriteFrameIndex(d,{state:'move_forward',frame:d.clips.move_forward.length}),d.clips.move_forward[0]);
  assert.equal(spriteFrameIndex(d,{state:'basic_resolve',time:-1}),d.clips.basic_resolve[0]);
});
test('stomp skills, ranged ultimates and their landing follow the active ability',()=>{
  const actor={hp:100,hitAt:-100,state:'rise',action:{start:1,duration:1.1,marker:.7,hits:1,ability:{kind:'skill',behavior:'stomp'}}};
  assert.equal(actorAnimation(actor,1.4,manifest.bandana).state,'skill_or_secondary');
  actor.state='rebound';assert.equal(actorAnimation(actor,2,manifest.bandana).state,'landing');
  actor.state='cast';actor.action.ability={kind:'ultimate',behavior:'shot'};
  assert.equal(actorAnimation(actor,1.5,manifest.bandana).state,'ultimate_entry');
  actor.action.ability={kind:'basic',behavior:'shot'};assert.equal(actorAnimation(actor,1.5,manifest.bandana).state,'basic_resolve');
});
test('Bowser uses the jump pose until his crash and breath pose after landing',()=>{
 const actor={hp:100,hitAt:-100,state:'rise',action:{start:1,duration:2.2,marker:.6,hits:8,ability:{kind:'ultimate',behavior:'beam',effects:[{type:'entry-stomp'}]}}};
 assert.equal(actorAnimation(actor,1.3,manifest.bowser).state,'jump');
 actor.state='cast';assert.equal(actorAnimation(actor,1.7,manifest.bowser).state,'ultimate_entry');
});
test('repeated throws show a release pose at each projectile marker and remain visible under hit flashes',()=>{
 const actor={hp:100,hitAt:1.46,state:'cast',action:{start:1,duration:2,marker:.3,hits:8,hitInterval:.16,ability:{kind:'ultimate',behavior:'shot'}}};
 for(const time of [1.31,1.47,1.63]){
   const animation=actorAnimation(actor,time,manifest.bandana);assert.equal(animation.state,'ultimate_entry');
   assert.equal(spriteFrameIndex(manifest.bandana,animation),manifest.bandana.clips.ultimate_entry.at(-1));
 }
 actor.action=null;assert.equal(actorAnimation(actor,1.47,manifest.bandana).state,'hurt');
});
test('a single ranged action reaches and holds its release pose at the spawn marker',()=>{
 const actor={hp:100,hitAt:-100,state:'windup',action:{start:1,duration:.9,marker:.3,hits:1,ability:{kind:'basic',behavior:'lob'}}};
 const before=actorAnimation(actor,1.1,manifest.lakitu),contact=actorAnimation(actor,1.3,manifest.lakitu),recovery=actorAnimation(actor,1.7,manifest.lakitu);
 assert.notEqual(spriteFrameIndex(manifest.lakitu,before),manifest.lakitu.clips.basic_resolve.at(-1));
 assert.equal(spriteFrameIndex(manifest.lakitu,contact),manifest.lakitu.clips.basic_resolve.at(-1));
 assert.equal(spriteFrameIndex(manifest.lakitu,recovery),manifest.lakitu.clips.basic_resolve.at(-1));
});
test('Dedede reaches his final jump pose at the physical landing, while spinning charges keep looping',()=>{
 const actor={hp:100,hitAt:-100,state:'rebound',action:{start:1,duration:1.4,marker:.896,hits:1,ability:{kind:'ultimate',behavior:'stomp'}}};
 const animation=actorAnimation(actor,1.9,manifest.dedede);assert.equal(spriteFrameIndex(manifest.dedede,animation),manifest.dedede.clips.ultimate_entry.at(-1));
 actor.state='charge';actor.action.ability={kind:'basic',behavior:'charge'};
 assert.equal(actorAnimation(actor,1.9,manifest.buzzy).progress,undefined);
});
test('sprite readiness waits for the initial atlas images and a failed image cannot leave it hanging',async()=>{
 const previous=globalThis.Image,images=[];globalThis.Image=class{constructor(){images.push(this);}set src(value){this.url=value;}};
 try{
  const bank=new SpriteBank();let ready=false;bank.ready.then(()=>{ready=true;});await Promise.resolve();assert.equal(ready,false);
  assert.equal(images.length,Object.keys(manifest).length);
  for(const im of images.slice(0,-1)){im.complete=true;im.naturalWidth=64;im.onload();}await Promise.resolve();assert.equal(ready,false);
  images.at(-1).onerror();await bank.ready;assert.equal(bank.load('kirby'),bank.images.get('kirby'));
 }finally{if(previous===undefined)delete globalThis.Image;else globalThis.Image=previous;}
});
