import test from 'node:test';
import assert from 'node:assert/strict';
import {createRuntime} from '../src/runtime.js';
test('an automatic next fight waits for both Pause and Hide to be released',async()=>{
 const oldWindow=globalThis.window,oldRAF=globalThis.requestAnimationFrame,oldCancel=globalThis.cancelAnimationFrame;
 let callback,starts=0;
 globalThis.window={devicePixelRatio:1,matchMedia:()=>({matches:false}),addEventListener(){},removeEventListener(){}};
 globalThis.requestAnimationFrame=fn=>{callback=fn;return 1;};globalThis.cancelAnimationFrame=()=>{};
 const ctx=new Proxy({measureText:t=>({width:t.length*8})},{get:(o,k)=>o[k]||(()=>{})});
 const canvas={width:360,height:170,getContext:()=>ctx,getBoundingClientRect:()=>({width:360,height:170})};
 const game=new EventTarget();Object.assign(game,{paused:false,party:['classic-mario','classic-luigi'],
  state:{profile:{muted:true,audio:{music:.5,voice:.7,sfx:.7},fps:30,stripHidden:false},session:{auto:true,mode:'story',encounterId:'smb1-02'}},
  battle:{runId:'cleared',done:true,win:true,time:10,actors:[],events:[],encounter:{environment:{sceneId:'smb1-overworld-day'}}},
  activeEncounter:{localStage:2},progress:{state:'unlocked'},tick(){},welcome(){},save(){return true;},stats(){return{hp:100};},toast(){},
  start(){starts++;this.paused=false;},auto(value){this.state.session.auto=value;}});
 const runtime=createRuntime(game,canvas,{transparent:true});
 try{
  await runtime.view.ready;callback(1000);game.paused=true;callback(4000);assert.equal(starts,0);
  game.paused=false;game.state.profile.stripHidden=true;callback(4500);assert.equal(starts,0);
  game.state.profile.stripHidden=false;callback(5000);assert.equal(starts,1);
 }finally{runtime.dispose();if(oldWindow===undefined)delete globalThis.window;else globalThis.window=oldWindow;if(oldRAF===undefined)delete globalThis.requestAnimationFrame;else globalThis.requestAnimationFrame=oldRAF;if(oldCancel===undefined)delete globalThis.cancelAnimationFrame;else globalThis.cancelAnimationFrame=oldCancel;}
});
