import test from 'node:test';
import assert from 'node:assert/strict';
import {BattleView} from '../src/render/battle-view.js';

test('a finished battle lets notices expire without advancing authoritative combat time',()=>{
 const before=globalThis.window;globalThis.window={devicePixelRatio:1};
 try{
  let now=100;const ctx=new Proxy({measureText:t=>({width:t.length*8})},{get:(o,k)=>o[k]||(()=>{})});
  const canvas={width:360,height:170,getContext:()=>ctx,getBoundingClientRect:()=>({width:360,height:170})};
  const view=new BattleView(canvas,{transparent:true,clock:()=>now});
  const battle={runId:'finished',done:true,time:10,actors:[],events:[{sequence:1,atMs:10000,type:'battle-end',values:{win:true}}]};
  view.draw(battle);assert.ok(view.fx.some(f=>f.type==='result'));now+=3;view.draw(battle);assert.equal(view.fx.length,0);assert.equal(battle.time,10);
 }finally{if(before===undefined)delete globalThis.window;else globalThis.window=before;}
});
test('a rounded landing timestamp cannot produce a negative effect radius',()=>{
 const before=globalThis.window;globalThis.window={devicePixelRatio:1};
 try{
  const ctx=new Proxy({measureText:t=>({width:t.length*8}),ellipse:(x,y,rx,ry)=>{assert.ok(rx>=0&&ry>=0);}},{get:(o,k)=>o[k]||(()=>{})});
  const canvas={width:1000,height:170,getContext:()=>ctx,getBoundingClientRect:()=>({width:1000,height:170})};
  const view=new BattleView(canvas,{transparent:true});
  view.draw({runId:'rounded-marker',done:false,time:10.00049,actors:[],events:[{sequence:1,atMs:10001,type:'entry-impact',values:{x:500,y:0}}]});
  assert.equal(view.fx.length,1);
 }finally{if(before===undefined)delete globalThis.window;else globalThis.window=before;}
});
