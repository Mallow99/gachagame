import fs from 'node:fs';
import {Game} from '../src/game.js';
import {content} from '../src/content/index.js';
import {trainingCost} from '../src/config/rules.js';
import {FIRST_WORLD,KIRBY_WORLD} from '../src/save/default-save.js';
const accountFlag=process.argv.indexOf('--accounts');
const accounts=Math.max(1,Math.min(100,Number(accountFlag>=0?process.argv[accountFlag+1]:process.argv[2])||5));
const records=[];
function team(g){
 const saga=g.world.sagaId,starter=saga==='mario'?'classic-mario':'adventure-kirby';
 const all=Object.keys(g.owned).map(id=>content.units.get(id)).filter(u=>u&&u.usable!==false&&u.sagaId===saga);
 const chosen=[content.units.get(starter)],families=new Set([chosen[0].familyId]);
 const add=u=>{if(u&&!families.has(u.familyId)&&chosen.length<4){chosen.push(u);families.add(u.familyId);}};
 const protection=u=>u.skill.effects.filter(e=>['heal','heal-party','shield-party','shield'].includes(e.type)).reduce((n,e)=>n+e.coefficient,0);
 add([...all].sort((a,b)=>protection(b)-protection(a)).find(u=>protection(u)>0));
 const score=u=>u.baseStats.attack*u.basic.coefficient*(u.basic.hitCount||1)/u.basic.intervalSeconds+u.baseStats.hp*.01;
 for(const u of [...all].sort((a,b)=>score(b)-score(a)))add(u);
 for(const id of [...g.party])if(id!==starter)g.toggleParty(id);
 for(const u of chosen.slice(1))g.toggleParty(u.id);
 const items=Object.keys(g.state.collection.powerups).map(id=>content.powerups.get(id)).filter(i=>i?.sagaId===saga&&i.productionStatus!=='planned');
 for(const u of chosen){g.setRow(u.id,u.rowPreference==='back'?'back':'front');const ranged=['shot','lob','beam'].includes(u.basic.behavior);
  const best=[...items].sort((a,b)=>(b.statLean.stat==='rangedDamage'&&ranged?3:b.statLean.stat==='maxHp'?2:1)-(a.statLean.stat==='rangedDamage'&&ranged?3:a.statLean.stat==='maxHp'?2:1))[0];if(best)g.equip(u.id,best.id);
 }
 const assist=Object.keys(g.state.collection.assists).map(id=>content.assists.get(id)).filter(a=>a?.sagaId===saga&&!families.has(a.familyId)).sort((a,b)=>['R','SR','SSR'].indexOf(b.rarity)-['R','SR','SSR'].indexOf(a.rarity))[0];if(assist)g.equipAssist(assist.id);
}
function collect(g){
 for(const f of g.state.progression.orders.storedFolders.filter(f=>!f.claimed))for(const id of f.stamps.filter(id=>!f.claimedStamps.includes(id)).slice(0,3-f.claimedStamps.length))g.claimOrder(f.id,id);
 const saga=g.world.sagaId,ids=saga==='mario'?['smb1-overworld-fighter','smb1-overworld-powerup-cache','smb1-overworld-assist-call']:['ka-fighter','ka-powerup-cache','ka-assist-call'];
 while(g.inventory.starlight>=100&&g.bannerStatus(ids[0]).ready){g.finishReveal();g.pull(ids[0],g.inventory.starlight>=1000?10:1);g.finishReveal();}
 while(g.inventory.supplyTickets>0){const id=g.inventory.supplyTickets%2===0&&g.bannerStatus(ids[2]).ready?ids[2]:ids[1];if(!g.bannerStatus(id).ready)break;g.finishReveal();g.pull(id,1);g.finishReveal();}
 team(g);
}
for(let seed=0;seed<accounts;seed++){
 let now=1_800_000_000_000,seconds=0,camps=0,losses=0;const g=new Game({seed:'player-path-'+seed,now:()=>now});g.welcome();
 const stages=[],warnings=[];
 function fight(id,mode='story'){
  if(!g.start(id,mode))throw new Error(g.error||'Unable to deploy '+id);g.battle.advance(601);const r=g.battle.report();g.completeBattle(r);seconds+=r.seconds;now+=r.seconds*1000;return r;
 }
 function camp(){
  const cleared=g.progress.firstClearEncounterIds.map(id=>content.encounters.get(id));
  const e=cleared.filter(e=>!e.boss).sort((a,b)=>{
   const pace=x=>(x.rewards.repeat.find(r=>r.type==='coins')?.amount||0)/(g.state.telemetry.clears[x.id].totalSeconds/g.state.telemetry.clears[x.id].count);return pace(b)-pace(a);
  })[0]||cleared[0];if(!e)throw new Error('No Camp recovery path.');const r=fight(e.id,'camp');camps++;if(!r.win)throw new Error('Recovery Camp failed.');collect(g);
 }
 for(const worldId of [FIRST_WORLD,KIRBY_WORLD]){
  if(worldId!==FIRST_WORLD&&!g.switchWorld(worldId))throw new Error('World unlock failed.');
  for(const id of content.worlds.get(worldId).implementedEncounterIds){const e=content.encounters.get(id),beforeCamps=camps,beforeSeconds=seconds;
   while(g.rank<e.recommendedTrainingRank){if(g.inventory.coins>=trainingCost(g.rank))g.train();else camp();if(camps>500)break;}
   let r=fight(id),attempts=1;
   while(!r.win&&attempts<8&&camps<500){losses++;
    do{camp();}while(g.inventory.coins<trainingCost(g.rank)&&camps<500);
    if(g.inventory.coins>=trainingCost(g.rank))g.train();r=fight(id);attempts++;
   }
   if(!r.win){warnings.push(id+' still blocked after '+attempts+' attempts.');break;}
   collect(g);stages.push({id,rank:g.rank,party:[...g.party],attempts,camps:camps-beforeCamps,minutes:Math.round((seconds-beforeSeconds)/60),fighterPulls:g.state.banners.fighter.totalPulls});
  }
  if(warnings.length)break;
 }
 const record={seed,cleared:stages.length,camps,losses,hours:Math.round(seconds/360)/10,rank:g.rank,units:Object.keys(g.owned).length,pulls:g.state.banners.fighter.totalPulls,warnings,stages};records.push(record);
 console.log(`Account ${seed}: ${record.cleared}/35 stages · ${record.hours}h · ${camps} Camps · ${losses} retreats · Rank ${g.rank} · ${record.units} fighters / ${record.pulls} pulls`);
 if(warnings.length)console.log(warnings.join('\n'));
}
const report={at:new Date().toISOString(),method:'Fresh saves use real Game rewards, actual pulls, earned Training, best measured cleared Camp, legal party/equipment selection and real Battle results. No ownership, currency, Rank or clears are injected.',accounts,records};
if(process.argv.includes('--write')){fs.mkdirSync(new URL('../docs/validation/',import.meta.url),{recursive:true});fs.writeFileSync(new URL('../docs/validation/player-path.json',import.meta.url),JSON.stringify(report,null,2)+'\n');}
if(records.some(r=>r.cleared<35))process.exitCode=1;
