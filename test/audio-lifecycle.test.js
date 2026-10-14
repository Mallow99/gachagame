import test from 'node:test';
import assert from 'node:assert/strict';
import {revealChime,revealTheme,voice,syncAudio,stopRevealAudio,chime} from '../src/audio.js';
test('native summon assets use separate volume channels and stop on skip or mute',()=>{
 const oldWindow=globalThis.window,oldAudio=globalThis.Audio,created=[];
 globalThis.window={};globalThis.Audio=class{
  constructor(url){this.url=url;this.currentTime=0;this.paused=true;created.push(this);}
  play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}
 };
 try{
  const p={muted:false,audio:{music:.2,voice:.6,sfx:.4}};
  revealTheme(p,'mario');voice(p,'classic-mario');revealChime(p,'mario','SR');
  const theme=created.find(c=>c.url.includes('mus-starman')),spoken=created.find(c=>c.url.includes('letsago')),effect=created.find(c=>c.url.includes('powerup'));
  assert.equal(theme.volume,.2);assert.equal(spoken.volume,.6);assert.equal(effect.volume,.4);assert.ok(created.every(c=>!c.paused));
  syncAudio({...p,audio:{music:.1,voice:.8,sfx:.3}});assert.equal(theme.volume,.1);assert.equal(spoken.volume,.8);assert.equal(effect.volume,.3);
  stopRevealAudio();assert.ok(created.every(c=>c.paused&&c.currentTime===0));
  revealTheme(p,'mario');assert.equal(created.filter(c=>c.url.includes('mus-starman')).length,1);
  syncAudio({...p,muted:true});assert.ok(created.every(c=>c.paused&&c.muted));
  revealTheme(p,'kirby');const dream=created.find(c=>c.url.includes('kirby-adventure-fanfare'));assert.ok(dream&&!dream.paused);assert.equal(dream.volume,.2);
  stopRevealAudio();assert.equal(dream.paused,true);
 }finally{stopRevealAudio();if(oldWindow===undefined)delete globalThis.window;else globalThis.window=oldWindow;if(oldAudio===undefined)delete globalThis.Audio;else globalThis.Audio=oldAudio;}
});
test('skipping a summon cancels scheduled reveal tones while retaining battle tones',()=>{
 const oldWindow=globalThis.window,oscillators=[];
 const gain=()=>({gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}});
 globalThis.window={AudioContext:class{
  constructor(){this.currentTime=0;this.destination={};this.state='running';}
  createGain(){return gain();}
  createOscillator(){const osc={frequency:{value:0},connect(){},disconnect(){},start(){},stop(time){if(time===undefined)this.cancelled=true;}};oscillators.push(osc);return osc;}
 }};
 try{
  const p={muted:false,audio:{music:.2,voice:.6,sfx:.4}};
  chime(p,'R');const battleCount=oscillators.length;chime(p,'SSR','reveal');
  stopRevealAudio();assert.ok(oscillators.slice(0,battleCount).every(o=>!o.cancelled));assert.ok(oscillators.slice(battleCount).every(o=>o.cancelled));
 }finally{if(oldWindow===undefined)delete globalThis.window;else globalThis.window=oldWindow;}
});
