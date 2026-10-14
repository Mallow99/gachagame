import test from 'node:test';
import assert from 'node:assert/strict';
import manifest from '../assets/sprites/v1/manifest.mjs';
import {content} from '../src/content/index.js';
import {spriteFrameIndex} from '../src/render/sprite-bank.js';
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
