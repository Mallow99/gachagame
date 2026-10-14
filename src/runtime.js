import { RULES } from './config/rules.js';
import { content } from './content/index.js';
import { BattleView } from './render/battle-view.js';
import { battleSound, syncAudio } from './audio.js';

export function createRuntime(game,canvas,{transparent=false,onProgress=()=>{},onDraw=()=>{},autoStart=false}={}) {
  const motionQuery=window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const view=new BattleView(canvas,{transparent,reducedMotion:()=>game.state.profile.reducedMotion||motionQuery?.matches,onEvent:e=>battleSound(game.state.profile,e)});
  let last=performance.now(),accumulator=0,lastDraw=0,lastPublish=0,restartAt=null,finishedRun=null,frameId=null,disposed=false;
  function preview(){return game.party.map((id,i)=>({uid:id,id,name:content.units.get(id).name,definition:content.units.get(id),spriteKey:content.units.get(id).spriteKey,
    ...game.stats(id),maxHp:game.stats(id).hp,x:280+i*105,y:0,direction:1,state:'idle',readyIn:0,maxReady:1,energy:0,hero:true,hitAt:-99}));}
  function publish(){syncAudio(game.state.profile);onProgress();if(window.desktop?.publishState)window.desktop.publishState({state:game.state,paused:game.paused,
    battle:game.battle?{runId:game.battle.runId,encounter:game.battle.encounter,time:game.battle.time,waveIndex:game.battle.waveIndex,done:game.battle.done,win:game.battle.win,
      actors:game.battle.actors,projectiles:game.battle.projectiles,shells:game.battle.shells,events:game.battle.events.slice(-100),rank:game.battle.rank}:null});}
  game.addEventListener('changed',publish);
  function frame(now){
    if(disposed)return;
    const delta=Math.min(0.25,(now-last)/1000);last=now;accumulator+=delta;
    while(accumulator>=RULES.step){game.tick(RULES.step);accumulator-=RULES.step;}
    if(game.battle?.done&&finishedRun!==game.battle.runId){finishedRun=game.battle.runId;if(game.state.session.auto&&game.battle.win&&!game.state.session.pendingBattleReward)restartAt=now+2500;}
    if(restartAt&&now>=restartAt){restartAt=null;
      if(game.state.session.auto){const mode=game.state.session.mode,next=game.activeEncounter;
        const expected=next.localStage===1?1:next.localStage<4?2:3;
        if(mode==='story'&&game.party.length<expected){game.auto(false);game.toast('A new companion will help. Open Summon or build your party.');}
        else if(game.progress.state==='complete'&&mode==='story')game.auto(false);
        else game.start(game.state.session.encounterId,mode);
      }
    }
    const fps=game.paused?3:game.state.profile.fps||30;
    if(!game.state.profile.stripHidden&&now-lastDraw>=1000/fps){view.draw(game.battle,game.battle?[]:preview());onDraw(view.hitRects);lastDraw=now;}
    if(now-lastPublish>=1000){publish();lastPublish=now;}
    frameId=requestAnimationFrame(frame);
  }
  view.ready.then(()=>{if(autoStart&&!game.battle)game.start();publish();}).catch(error=>game.toast(error.message));
  game.welcome();window.__pocketGame=game;frameId=requestAnimationFrame(frame);
  const beforeUnload=()=>game.save();window.addEventListener('beforeunload',beforeUnload);
  const saveTimer=setInterval(()=>game.save(),15000);
  return{view,publish,dispose:()=>{disposed=true;clearInterval(saveTimer);cancelAnimationFrame(frameId);game.removeEventListener('changed',publish);window.removeEventListener('beforeunload',beforeUnload);}};
}
