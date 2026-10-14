import {Battle} from '/src/combat/engine.js';
import {BattleView} from '/src/render/battle-view.js';
import {content} from '/src/content/index.js';
const examples=[
 {id:'bowser',fighter:'bowser',kind:'ultimate',label:'Bowser · King of the Koopas',description:'1985 body expansion. Leap, grounded crash, then eight mouth-origin flame ticks.'},
 {id:'dedede',fighter:'king-dedede',kind:'ultimate',label:'Dedede · Super Dedede Jump',description:'1993 native jump. The main impact and quake share the landing; the small rebound is recovery.'},
 {id:'meta-tornado',fighter:'adventure-meta-knight',kind:'ultimate',label:'Meta Knight · Mach Tornado',description:'1993 native spin. Eight physical passes across the targets, then a native sword finisher.'},
 {id:'meta-counter',fighter:'adventure-meta-knight',kind:'skill',counter:true,label:'Meta Knight · Cape Counter',description:'A guarded window, cape exit, brief vanish, then an answer behind the attacker. The counter replaces the fallback lunge.'},
 {id:'meta-fallback',fighter:'adventure-meta-knight',kind:'skill',label:'Meta Knight · Untriggered Counter',description:'With no incoming hit, the guarded window ends in one fallback strike. Burn cannot trigger the teleport.'},
 {id:'bandana-spear',fighter:'bandana-waddle-dee',kind:'ultimate',label:'Bandana Dee · Spear Barrage',description:'Faithful Return to Dream Land adaptation. Eight throws and a larger final spear deal damage at projectile contact.'},
 {id:'bandana-copter',fighter:'bandana-waddle-dee',kind:'skill',label:'Bandana Dee · Waddle Copter',description:'Looping spear copter, landing contact and the source sheet’s exit poses.'},
 {id:'koopa',fighter:'koopa-troopa',kind:'ultimate',label:'Koopa · Ricochet Route',description:'1985 shell pose, physical passes and turns through the targets, then a final shell impact.'},
 {id:'wheelie',fighter:'wheelie',kind:'ultimate',label:'Wheelie · Grand Prix',description:'1993 native tire body. The hit markers follow its route through the targets.'},
 {id:'luigi',fighter:'classic-luigi',kind:'ultimate',label:'Luigi · Backline Bound',description:'1985 high jump, four timed contacts and a finite rebound.'},
 {id:'mario',fighter:'classic-mario',kind:'basic',label:'Mario · Classic Stomp',description:'1985 large-form pose. The first contact occurs with his feet down.'},
 {id:'hammer-bro',fighter:'hammer-bro',kind:'ultimate',label:'Hammer Bro · Hammer Storm',description:'Faithful expansion of the original 1985 body. Repeated native-pixel throws and visible hammer flight, including the final impact.'},
 {id:'buzzy',fighter:'buzzy-beetle',kind:'ultimate',label:'Buzzy Beetle · Unbreakable Shell',description:'Faithful expansion in the exact original brown/peach palette. Rolling shell frames follow physical passes through the targets.'},
 {id:'parasol',fighter:'parasol-waddle-dee',kind:'ultimate',label:'Parasol Dee · Circus Toss',description:'Native 1993 Dee and umbrella pixels, articulated separately for an authored spin. The two original body poses remain sparse.'},
];
const $=id=>document.getElementById(id),canvas=$('combat'),move=$('move'),play=$('play'),timeline=$('timeline');
for(const example of examples){const option=document.createElement('option');option.value=example.id;option.textContent=example.label;move.append(option);}
let battle,hero,enemy,start,elapsed=0,playing=true,serial=0,counterDone=false,last=performance.now(),accumulator=0;
let view=new BattleView(canvas,{reducedMotion:()=>$('reduced').checked});await view.ready;
function reset(id=move.value){
 move.value=id;const example=examples.find(e=>e.id===id),u=content.units.get(example.fighter);
 const fixture={id:'motion-review',worldId:'kirbys-adventure-1993',environment:{sceneId:u.sagaId==='mario'?'smb1-overworld-day':'ka-valley'},waves:[{spawns:[{enemyId:'waddle-dee',count:2,spacing:100}]}],clearRules:{timeLimitSeconds:600},enemyDamageScale:.001};
 battle=new Battle({encounter:fixture,party:[u.id],mode:'endless',seed:'motion-review',runId:'review-'+serial++});battle.advance(.9);
 hero=battle.living(true)[0];hero.action=null;hero.x=350;hero.y=0;hero.readyIn=1000;hero.skillIn=1000;hero.energy=0;
 const targets=battle.living(false);targets.forEach((a,i)=>{a.action=null;a.x=520+i*110;a.readyIn=1000;a.moveSpeed=0;a.hp=a.maxHp=100000;});enemy=targets[0];
 battle.startAction(hero,{...u[example.kind],kind:example.kind},enemy);start=battle.time;elapsed=0;counterDone=false;accumulator=0;timeline.value=0;
 $('description').textContent=example.description;draw();return snapshot();
}
function tick(){
 const example=examples.find(e=>e.id===move.value);
 if(example.counter&&!counterDone&&battle.time-start>=.25){battle.damage(enemy,hero,.1,{behavior:'strike'});counterDone=true;}
 battle.step();elapsed=battle.time-start;
 if(!hero.action){hero.readyIn=1000;hero.skillIn=1000;hero.energy=0;}
}
function seek(seconds){reset();while(elapsed+1e-8<seconds)tick();draw();return snapshot();}
function snapshot(){return{id:move.value,elapsed,hero:{x:hero.x,y:hero.y,state:hero.state,action:Boolean(hero.action)},projectiles:battle.projectiles.length,events:battle.events.filter(e=>e.atMs>=Math.round(start*1000))};}
function draw(){
 view.draw(battle);timeline.value=elapsed;$('time').textContent=elapsed.toFixed(2)+' s';
 const recent=battle.events.filter(e=>e.atMs>=Math.round(start*1000)&&['animation-marker','entry-impact','counter-exit','counter','damage','action-end'].includes(e.type)).slice(-5);
 $('events').textContent=recent.map(e=>`${(e.atMs/1000-start).toFixed(2)} s  ${e.type}${e.type==='animation-marker'?' · '+e.values.marker:e.type==='damage'?' · '+e.values.final+' damage':''}`).join('\n');
}
function setPlaying(value){playing=value;play.textContent=playing?'Pause':'Play';accumulator=0;}
play.onclick=()=>setPlaying(!playing);$('replay').onclick=()=>{reset();setPlaying(true);};move.onchange=()=>{reset();setPlaying(true);};
timeline.oninput=()=>{setPlaying(false);seek(Number(timeline.value));};
$('strip').onchange=()=>{view.transparent=$('strip').checked;$('stage').classList.toggle('strip',view.transparent);draw();};
$('reduced').onchange=draw;
window.reviewCombat={examples:examples.map(e=>e.id),reset,seek,snapshot,setPlaying};reset();
function frame(now){
 const dt=Math.min(.1,(now-last)/1000);last=now;
 if(playing){accumulator+=dt*Number($('speed').value);while(accumulator>=1/30&&elapsed<4){tick();accumulator-=1/30;}if(elapsed>=4)setPlaying(false);}
 draw();requestAnimationFrame(frame);
}requestAnimationFrame(frame);
