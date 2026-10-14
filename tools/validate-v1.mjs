import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {content,validateContent} from '../src/content/index.js';
import {Battle} from '../src/combat/engine.js';
import {defaultSave,worldProgress,KIRBY_WORLD} from '../src/save/default-save.js';
import {bannerPool,bannerStatus,publishedRates,drawPulls} from '../src/gacha.js';
import {createSeededRandom} from '../src/random.js';
import manifest from '../assets/sprites/v1/manifest.mjs';
const root=fileURLToPath(new URL('..',import.meta.url));
const seedFlag=process.argv.indexOf('--seeds');
const seeds=seedFlag>=0?Math.max(1,Number(process.argv[seedFlag+1])||5):5;
const started=Date.now();
validateContent();
const spriteChecks=[];
for(const [key,a] of Object.entries(manifest)){
 const p=path.join(root,a.url);assert.ok(fs.existsSync(p),a.url);
 assert.equal(createHash('sha256').update(fs.readFileSync(p)).digest('hex'),a.sha256,key+' asset hash');
 assert.ok(fs.existsSync(path.join(root,`assets/sprites/v1/${key}-icon.png`)));
 for(const clip of ['idle','move_forward','move_back','basic_windup','basic_resolve','skill_or_secondary','hurt','knockout','ultimate_entry'])assert.ok(a.clips[clip]?.length&&a.clips[clip].every(i=>a.frames[i]),key+' '+clip);
 spriteChecks.push({key,grade:a.spriteGrade,status:a.status});
}
for(const e of [...content.units.values(),...content.enemies.values()])assert.ok(manifest[e.spriteKey],e.id+' missing sprite');
const funded=defaultSave(1);funded.inventory.starlight=100000;funded.inventory.supplyTickets=10000;
funded.progression.worlds['super-mario-bros-1985']=worldProgress(1,'complete');funded.progression.worlds[KIRBY_WORLD]=worldProgress(16,'complete');
for(const w of content.worlds.values())if(w.productionStatus!=='planned'){
 funded.progression.worlds[w.id].highestStageCleared=w.length;
 funded.progression.worlds[w.id].firstClearEncounterIds=[...w.implementedEncounterIds];
 assert.equal(w.implementedEncounterIds.length,w.length);assert.equal(new Set(w.implementedEncounterIds).size,w.length);
}
const banners=[];
for(const b of content.banners.values()){
 const pool=bannerPool(b,funded),status=bannerStatus(b,funded),rates=publishedRates(b,funded);
 assert.ok(Math.abs(rates.reduce((n,e)=>n+e.probability,0)-1)<1e-9,b.id+' probability normalization');
 for(const e of pool)if(e.itemType==='unit')assert.ok(['A','B'].includes(manifest[content.units.get(e.itemId).spriteKey].spriteGrade),e.itemId+' spendable sprite gate');
 if(b.availability==='live'){assert.equal(status.ready,true,b.id+' release gate');const result=drawPulls(funded,b,10,createSeededRandom(b.id));assert.equal(result.receipt.results.length,10);}
 else assert.equal(status.ready,false,b.id+' preview gate');
 banners.push({id:b.id,ready:status.ready,pool:pool.length,byRarity:Object.fromEntries(['R','SR','SSR'].map(r=>[r,pool.filter(e=>e.rarity===r).length]))});
}
const teams={mario:['classic-mario','classic-luigi','toad','princess-peach'],kirby:['adventure-kirby','parasol-waddle-dee','sir-kibble','hot-head']};
const stages=[];
for(const e of content.encounters.values()){
 const w=content.worlds.get(e.worldId),saga=w.sagaId,count=e.localStage===1?1:e.localStage<4?2:4;
 const party=teams[saga].slice(0,count).filter((id,i,ids)=>!ids.slice(0,i).some(old=>content.units.get(old).familyId===content.units.get(id).familyId));
 const trials=[];
 for(let seed=0;seed<seeds;seed++){
  const b=new Battle({encounter:e,party,rank:e.recommendedTrainingRank,threat:(saga==='kirby'?16:1)+e.localStage-1,seed:`validation-${e.id}-${seed}`}).advance(601);
  assert.ok(b.actors.every(a=>Number.isFinite(a.hp)&&Number.isFinite(a.x)),e.id+' finite state');
  assert.equal(b.done,true,e.id+' bounded state');
  trials.push({win:b.win,seconds:Math.round(b.time),knockouts:b.stats.knockouts.length,remainingHp:b.living(true).reduce((n,a)=>n+a.hp,0)/b.actors.filter(a=>a.hero).reduce((n,a)=>n+a.maxHp,0)});
 }
 const record={id:e.id,rank:e.recommendedTrainingRank,party,wins:trials.filter(t=>t.win).length,trials:seeds,minSeconds:Math.min(...trials.map(t=>t.seconds)),maxSeconds:Math.max(...trials.map(t=>t.seconds)),meanHp:trials.reduce((n,t)=>n+t.remainingHp,0)/seeds};
 stages.push(record);console.log(`${e.id}: ${record.wins}/${seeds} clears · ${record.minSeconds}–${record.maxSeconds}s · ${(record.meanHp*100).toFixed(0)}% party HP`);
}
const result={build:'v1-playable',at:new Date().toISOString(),seconds:(Date.now()-started)/1000,seeds,content:{fighters:content.units.size,encounters:content.encounters.size,sprites:spriteChecks.length},banners,stages,
 limits:['Seeded simulation and native canvas verification; browser CSS and macOS integration still require a real-device run.','All sprite treatments remain provisional; source credit and distribution review pending.','Archives remain previews; source Spotlights are smaller playable pools.']};
if(process.argv.includes('--write')){fs.mkdirSync(path.join(root,'docs/validation'),{recursive:true});fs.writeFileSync(path.join(root,'docs/validation/v1-latest.json'),JSON.stringify(result,null,2)+'\n');}
console.log(`Validated ${stages.length} stages, ${banners.length} pages and ${spriteChecks.length} sprite atlases in ${result.seconds.toFixed(1)}s.`);
if(stages.some(s=>s.wins===0)){console.error('Reference parties with no winning seed:',stages.filter(s=>!s.wins).map(s=>s.id).join(', '));process.exitCode=1;}
