import test from 'node:test';
import assert from 'node:assert/strict';
import {createRevealImageLoader} from '../src/presentation/image-readiness.js';

test('reveal preloads deduplicate URLs and wait for actual image decode',async()=>{
 const before=globalThis.Image,images=[];let finishDecode;
 globalThis.Image=class{constructor(){images.push(this);this.naturalWidth=640;}set src(value){this.url=value;}decode(){return new Promise(resolve=>{finishDecode=resolve;});}};
 try{
  const controller=new AbortController(),load=createRevealImageLoader(controller.signal);
  const ready=load('portrait.webp');assert.equal(load('portrait.webp'),ready);assert.equal(images.length,1);
  let arrived=false;ready.then(()=>{arrived=true;});images[0].onload();await Promise.resolve();assert.equal(arrived,false);
  finishDecode();assert.equal(await ready,true);assert.equal(images[0].onload,null);controller.abort();
 }finally{if(before===undefined)delete globalThis.Image;else globalThis.Image=before;}
});

test('failed, skipped and stalled reveal images settle safely without leaving handlers or timers',async()=>{
 const before=globalThis.Image,images=[];globalThis.Image=class{constructor(){images.push(this);}set src(value){this.url=value;}};
 try{
  const controller=new AbortController(),load=createRevealImageLoader(controller.signal,{timeoutMs:20});
  const failed=load('missing.webp');images[0].onerror();assert.equal(await failed,false);
  const stalled=load('stalled.webp');assert.equal(await stalled,false);
  const skipped=load('late.webp');controller.abort();assert.equal(await skipped,false);assert.equal(await load('after-skip.webp'),false);
  assert.equal(images.length,3);assert.ok(images.every(image=>image.onload===null&&image.onerror===null));
 }finally{if(before===undefined)delete globalThis.Image;else globalThis.Image=before;}
});
