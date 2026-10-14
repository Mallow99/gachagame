import { game } from './game.js';
import { createRuntime } from './runtime.js';
import { unlockAudio } from './audio.js';
const $=id=>document.getElementById(id);
const allowed=new Set(['save','train','trainFive','toggleParty','replaceParty','setRow','equip','equipAssist','fighterPolicy','applyNote','pull','finishReveal','switchWorld','choosePreset','endlessPreset','start','pause','auto','claimOrder','exchange','setting','audio','importSave']);
let actorRects=[],lastHotspotUpdate=0;
function hotspots(rects){
  const now=performance.now();if(now-lastHotspotUpdate<80)return;lastHotspotUpdate=now;actorRects=rects;
  const host=$('actor-hotspots'),ids=new Set(rects.map(r=>r.id));for(const button of host.children)if(!ids.has(button.dataset.id))button.remove();
  for(const r of rects){let button=host.querySelector(`[data-id="${r.id}"]`);if(!button){button=document.createElement('button');button.className='actor-hotspot';button.dataset.id=r.id;button.onclick=()=>window.desktop?.inspectFighter(r.id);host.append(button);}
    button.style.left=r.x+'px';button.style.top=r.y+'px';button.style.width=r.width+'px';button.style.height=r.height+'px';button.title=`${r.name} · ${Math.round(r.hp)} / ${r.maxHp} HP · Rank ${game.battle?.rank||game.rank} · inspect`;button.setAttribute('aria-label',button.title);
  }
  reportRects();
}
function reportRects(){const hud=$('strip-hud').getBoundingClientRect();window.desktop?.reportInteractiveRects([{x:hud.x,y:hud.y,width:hud.width,height:hud.height},...actorRects.map(({x,y,width,height})=>({x,y,width,height}))]);}
function progress(){const b=game.battle,e=b?.encounter||game.activeEncounter;
  $('strip-label').textContent=game.world.sagaId==='mario'?'Mushroom Kingdom':'Dream Land';
  $('strip-progress').textContent=b&&!b.done?`${e.localStage} · wave ${b.waveIndex+1}/${e.waves.length} · ${Math.floor(b.time/60)}:${String(Math.floor(b.time%60)).padStart(2,'0')}`:b?.done?b.win?'CLEAR · open Manual for rewards':'RETREAT · regroup in the Manual':`${e.localStage} · ${e.name}`;
  $('strip-deploy').textContent=b&&!b.done?'Manual':b?.done&&b.win?'Next course':'Deploy';$('strip-pause').textContent=game.paused?'▶':'Ⅱ';
  reportRects();
}
const runtime=createRuntime(game,$('strip-canvas'),{transparent:true,onProgress:progress,onDraw:hotspots,autoStart:true});
$('manual-button').onclick=()=>window.desktop?window.desktop.openManager():window.location.assign('index.html');
$('strip-deploy').onclick=()=>{unlockAudio();if(game.battle&&!game.battle.done)$('manual-button').click();else game.start();};
$('strip-pause').onclick=()=>game.pause();$('strip-hide').onclick=()=>{if(window.desktop)window.desktop.hideStrip();else{game.setting('stripHidden',true);document.body.style.display='none';}};
game.addEventListener('toast',event=>{window.desktop?.publishToast(event.detail);$('strip-toast').textContent=event.detail;$('strip-toast').classList.add('show');setTimeout(()=>$('strip-toast').classList.remove('show'),4000);});
window.desktop?.onCommand(command=>{if(!allowed.has(command?.name)||!Array.isArray(command.args))return;if(!game.state.profile.muted||command.name==='setting'&&command.args[0]==='muted'&&!command.args[1])unlockAudio();game[command.name](...command.args);runtime.publish();});
window.desktop?.onSave(request=>window.desktop.saved({ok:game.save(),requestId:request?.requestId}));window.addEventListener('resize',progress);progress();
