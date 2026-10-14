import { UNITS } from './units.js';
import { POWERUPS } from './powerups.js';
import { ASSISTS } from './assists.js';
const pool = (records, sagaId, itemType) => records.filter(x=>x.sagaId===sagaId && x.productionStatus!=='planned').map(x=>({itemId:x.id,itemType,rarity:x.rarity,weight:1}));
function page(id,sagaId,name,kind,unlockStage,poolRecords,extra={}) {
  const prefix=sagaId==='mario'?'smb1':'ka';
  return {id,sagaId,name,channel:kind==='unit'?'fighter':'supply',poolKind:kind,
    lifecycle:'progress',unlock:{type:'stage-clear',encounterId:prefix+'-'+String(unlockStage).padStart(2,'0')},
    pool:pool(poolRecords,sagaId,kind),featured:[],pityPolicyId:kind==='unit'?'fighter-standard-v1':'supply-standard-v1',
    duplicatePolicyId:kind==='unit'?'fighter-stars-v1':kind==='powerup'?'powerup-echoes-v1':'assist-proficiency-v1',
    archiveBannerId:null,availability:'live',productionStatus:'slice',...extra};
}
export const BANNERS = [
  page('smb1-overworld-fighter','mario','Overworld Expedition','unit',1,UNITS,{welcomePool:['hammer-bro'],featured:[{itemId:'bowser',shareOfRarity:0.5}],description:'The first course. The whole Kingdom. A new companion waits beyond every block.'}),
  page('smb1-overworld-powerup-cache','mario','Power-Up Cache','powerup',3,POWERUPS),
  page('smb1-overworld-assist-call','mario','Assist Call','assist',5,ASSISTS),
  page('ka-fighter','kirby','Dreams Take Flight','unit',1,UNITS,{welcomePool:['sir-kibble','parasol-waddle-dee'],featured:[{itemId:'king-dedede',shareOfRarity:0.5}],description:'Follow the Warp Star. Discover friends, copy their powers, and bring back the dream.'}),
  page('ka-powerup-cache','kirby','Power-Up Cache','powerup',3,POWERUPS),
  page('ka-assist-call','kirby','Assist Call','assist',5,ASSISTS),
];
for (const sagaId of ['mario','kirby']) BANNERS.push({
  id:sagaId+'-saga-fighter-archive',sagaId,name:sagaId==='mario'?'Mushroom Kingdom Archive':'Dream Land Archive',channel:'fighter',poolKind:'unit',
  lifecycle:'archive',unlock:{type:'stage-clear',encounterId:(sagaId==='mario'?'smb1':'ka')+'-01'},pool:pool(UNITS,sagaId,'unit'),featured:[],
  releaseGate:{minimumLivePool:22,minimumByRarity:sagaId==='mario'?{R:10,SR:7,SSR:5}:{R:8,SR:9,SSR:5}},
  growthGates:[{beforeRegionalPull:40,minimumLivePool:sagaId==='mario'?28:26}],availability:'preview',productionStatus:'slice',
  pityPolicyId:'fighter-standard-v1',archiveBannerId:null,description:'Regional collection in production. Source Spotlights remain playable.'
});
