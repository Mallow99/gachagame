// Development timing evidence. CPU timings here are not an M2 performance claim.
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require(process.env.POCKET_PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-precise-memory-info']});
const records=[];
for(const spec of [{width:1440,height:170,dpr:1,transparent:true},{width:1440,height:170,dpr:2,transparent:true},{width:1000,height:220,dpr:1,transparent:false},{width:360,height:170,dpr:2,transparent:true}]){
 const context=await browser.newContext({viewport:{width:spec.width,height:500},deviceScaleFactor:spec.dpr}),page=await context.newPage();
 await page.goto('http://127.0.0.1:8080/docs/validation/sprite-review/combat.html',{waitUntil:'networkidle'});
 const record=await page.evaluate(async spec=>{
  window.reviewCombat.setPlaying(false);
  const[{Battle},{BattleView},{content}]=await Promise.all([import('/src/combat/engine.js'),import('/src/render/battle-view.js'),import('/src/content/index.js')]);
  const canvas=document.createElement('canvas');canvas.style.cssText=`width:${spec.width}px;height:${spec.height}px`;document.body.append(canvas);
  const encounter={id:'renderer-profile',worldId:'kirbys-adventure-1993',environment:{sceneId:spec.transparent?'smb1-overworld-day':'ka-valley'},waves:[{spawns:[{enemyId:'waddle-dee',count:1}]}],clearRules:{timeLimitSeconds:600}};
  const battle=new Battle({encounter,mode:'endless',party:['bowser','adventure-kirby','adventure-meta-knight','bandana-waddle-dee'],rank:20,threat:20,seed:'renderer-profile'});
  battle.wait=0;battle.nextWave();battle.pending=[];
  const enemies=[...content.enemies.values()].filter(e=>e.size!=='boss'&&e.movement?.mode!=='fixed').slice(0,8);
  for(let i=0;i<12;i++){battle.spawn({enemyId:enemies[i%enemies.length].id,index:0});battle.actors.at(-1).x=360+i*48;}
  for(const a of battle.actors){a.hp=a.maxHp=1e6;if(a.hero)a.energy=100;}
  battle.living(true).find(a=>a.id==='adventure-kirby').copy='fire';
  const view=new BattleView(canvas,{transparent:spec.transparent});const loadStart=performance.now();await view.ready;const atlasReadyMs=performance.now()-loadStart;
  view.draw(battle);await Promise.all([...view.sceneImages.values()].map(im=>im.decode().catch(()=>{})));
  const draw=[],step=[];
  for(let i=0;i<350;i++){
   const before=performance.now();battle.step();const after=performance.now();view.draw(battle);const end=performance.now();
   if(i>=50){step.push(after-before);draw.push(end-after);}
  }
  for(const a of battle.actors)a.hitAt=battle.time;
  const hitFlash=[];for(let i=0;i<100;i++){const before=performance.now();view.draw(battle);hitFlash.push(performance.now()-before);}
  const stats=values=>{const sorted=[...values].sort((a,b)=>a-b);return{meanMs:values.reduce((a,b)=>a+b,0)/values.length,p95Ms:sorted[Math.floor(sorted.length*.95)],maxMs:sorted.at(-1)};};
  return{...spec,actors:battle.actors.length,atlasReadyMs,simulation:stats(step),drawing:stats(draw),allActorsHitFlash:stats(hitFlash),jsHeapMiB:performance.memory?performance.memory.usedJSHeapSize/1024**2:null};
 },spec);records.push(record);console.log(JSON.stringify(record));await context.close();
}
fs.writeFileSync('docs/validation/render-performance.json',JSON.stringify({at:new Date().toISOString(),method:'Actual Chromium canvas. Four mixed-Hub fighters, twelve varied enemies, real fixed-step actions/projectiles, 300 timed frames after warm-up plus 100 simultaneous hit-flash frames.',records,limits:['Software/cloud rendering timings are not CPU percentage, GPU power or M2 hardware evidence.','JS heap excludes decoded image/GPU memory. Atlas decoded RGBA size is separately estimated at 9.69 MiB.','Timings are local development evidence and can vary with concurrent environment work.']},null,2)+'\n');
await browser.close();
