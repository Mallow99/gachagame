import { content, validateContent } from './content/index.js';
import { RULES, fighterStats, trainingCost } from './config/rules.js';
import { Battle } from './combat/engine.js';
import { drawPulls, bannerStatus } from './gacha.js';
import { createRandom } from './random.js';
import { defaultSave, ownership, worldProgress, FIRST_WORLD, KIRBY_WORLD, SAVE_KEY } from './save/default-save.js';
import { loadSave, writeSave } from './save/storage.js';
import { migrateSave } from './save/migrate.js';

export class Game extends EventTarget {
  constructor({storage=null,save=null,seed=null,now=()=>Date.now()}={}) {
    super();validateContent();this.storage=storage;this.now=now;this.random=createRandom(seed);this.battle=null;this.paused=false;
    const loaded=save?{save:migrateSave(save,now()),notice:''}:loadSave(storage,now());
    if(loaded.volatile)this.storage=null;
    this.state=loaded.save;this.notice=loaded.notice||(!this.storage&&typeof window!=='undefined'?'This session stays in memory. Export a backup before closing.':'');this.recovery=loaded.recovery;this.lastReport=null;this.error='';
  }
  get inventory(){return this.state.inventory;}
  get rank(){return this.state.progression.training.rank;}
  get world(){return content.worlds.get(this.state.session.worldId);}
  get progress(){return this.state.progression.worlds[this.world.id];}
  get preset(){return this.state.loadouts.presets[this.state.loadouts.activePresetId];}
  get party(){return this.preset.unitIds;}
  get owned(){return this.state.collection.units;}
  get activeEncounter(){return content.encounters.get(this.state.session.encounterId);}
  emit(){this.dispatchEvent(new Event('changed'));}
  toast(message){this.dispatchEvent(new CustomEvent('toast',{detail:message}));}
  save(){
    if(this.state.session.pendingBattleReward&&this.state.telemetry.rewardedRunIds.includes(this.state.session.pendingBattleReward.runId))this.state.session.pendingBattleReward=null;
    if(this.state.session.pendingBattleReward){const restored=this.completeBattle(this.state.session.pendingBattleReward);if(restored){this.error='';this.toast('The completed expedition and its rewards are saved.');return true;}return false;}
    try{writeSave(this.storage,this.state,this.now());this.error='';return true;}catch(e){this.error='Could not save: '+e.message;this.toast(this.error);return false;}
  }
  transaction(action){const before=this.state,previousBattle=this.battle,previousReport=this.lastReport;this.state=structuredClone(before);try{const result=action(this.state);writeSave(this.storage,this.state,this.now());this.emit();return result;}catch(e){this.state=before;this.battle=previousBattle;this.lastReport=previousReport;this.error=e.message;this.toast(e.message);return false;}}
  stats(id){return fighterStats(content.units.get(id),this.rank,this.owned[id],content.powerups.get(this.preset.powerupIds[this.party.indexOf(id)]));}
  train(){return this.transaction(s=>{const cost=trainingCost(this.rank);if(s.inventory.coins<cost)throw new Error(`Need ${cost-s.inventory.coins} more Coins.`);s.inventory.coins-=cost;s.progression.training.rank++;this.updateOrders();return true;});}
  trainFive(){let n=0;while(n<5&&this.inventory.coins>=trainingCost(this.rank)){if(!this.train())break;n++;}return n;}
  toggleParty(id){return this.transaction(()=>{
    const u=content.units.get(id),p=this.preset;if(!u||!this.owned[id])throw new Error('This fighter is not owned.');
    const i=p.unitIds.indexOf(id);if(i>=0){if(p.unitIds.length===1)throw new Error('Keep one fighter deployed.');p.unitIds.splice(i,1);p.rows.splice(i,1);p.powerupIds.splice(i,1);return true;}
    this.checkUnit(u,p);if(p.unitIds.length>=4)throw new Error('Your party has four fighters. Remove one first.');
    const conflict=p.unitIds.find(x=>content.units.get(x).familyId===u.familyId);if(conflict)throw new Error(`Replace ${content.units.get(conflict).name} to use another ${u.familyId} version.`);
    p.unitIds.push(id);p.rows.push(u.rowPreference==='back'?'back':'front');p.powerupIds.push(null);return true;
  });}
  replaceParty(id,replaceId){return this.transaction(()=>{
    const u=content.units.get(id),p=this.preset;if(!this.owned[id]||!u)throw new Error('Fighter is not owned.');this.checkUnit(u,p);
    const i=p.unitIds.indexOf(replaceId);if(i<0)throw new Error('Choose a deployed fighter to replace.');
    if(p.unitIds.some((x,j)=>j!==i&&content.units.get(x).familyId===u.familyId))throw new Error('Another version from that family is already deployed.');
    p.unitIds[i]=id;p.rows[i]=u.rowPreference==='back'?'back':'front';p.powerupIds[i]=null;return true;
  });}
  checkUnit(u,p){if(u.usable===false)throw new Error('This fighter is still in production.');if(p.mode==='story'&&u.sagaId!==p.sagaId)throw new Error('Story fighters must come from this Hub.');if(p.mode==='endless'&&!this.state.progression.endlessUnlockedBySaga[u.sagaId])throw new Error('Clear this Hub’s first finale before bringing its fighters to Endless.');}
  setRow(id,row){return this.transaction(()=>{const i=this.party.indexOf(id);if(i>=0)this.preset.rows[i]=row==='back'?'back':'front';});}
  equip(id,powerupId){return this.transaction(s=>{
    const i=this.party.indexOf(id);if(i<0)throw new Error('Deploy this fighter first.');
    const item=content.powerups.get(powerupId);if(powerupId&&(!item||!s.collection.powerups[powerupId]))throw new Error('Power-Up is not owned.');
    if(item&&(item.usable===false||item.productionStatus==='planned'))throw new Error('This Power-Up is still in production.');
    if(item&&this.preset.mode==='story'&&item.sagaId!==this.world.sagaId)throw new Error('Story Power-Ups must match this Hub.');
    if(item&&this.preset.mode==='endless'&&!s.progression.endlessUnlockedBySaga[item.sagaId])throw new Error('This Power-Up’s Hub is not unlocked for Endless.');
    this.preset.powerupIds[i]=powerupId||null;
  });}
  equipAssist(id){return this.transaction(s=>{
    const assist=content.assists.get(id);if(id&&(!assist||!s.collection.assists[id]))throw new Error('Assist is not owned.');
    if(assist&&(assist.usable===false||assist.productionStatus==='planned'))throw new Error('This Assist is still in production.');
    if(assist&&this.preset.mode==='story'&&assist.sagaId!==this.world.sagaId)throw new Error('Story Assists must match this Hub.');
    if(assist&&this.preset.mode==='endless'&&!s.progression.endlessUnlockedBySaga[assist.sagaId])throw new Error('Clear this Assist’s Hub finale to use it in Endless.');
    if(assist&&this.party.some(x=>content.units.get(x).familyId===assist.familyId))throw new Error('This Assist shares a family with a deployed fighter.');
    this.preset.assistId=id||null;
  });}
  fighterPolicy(id,key,value){return this.transaction(s=>{if(!s.collection.units[id])throw new Error('Fighter is not owned.');if(!['copyPolicy','ultimatePolicy'].includes(key))return;const allowed=key==='ultimatePolicy'?['auto','boss']:['recommended','never-replace',...(content.units.get(id)?.copyLibrary||[])];if(!allowed.includes(value))throw new Error('Choose an available fighter policy.');s.collection.units[id][key]=value;});}
  applyNote(id){return this.transaction(s=>{const u=s.collection.units[id];if(!u||s.inventory.materials.techniqueNotes<1)throw new Error('No Technique Notes available.');if(u.masteryRank>=5)throw new Error('This fighter has mastered every Technique rank.');s.inventory.materials.techniqueNotes--;u.masteryXp+=60;this.updateMastery(u);});}
  updateMastery(u){u.masteryRank=Math.min(5,1+RULES.masteryThresholds.slice(1).filter(x=>u.masteryXp>=x).length);}
  pull(bannerId,count){
    if(this.state.banners.pendingReveal){this.toast('Finish the saved summon results before pulling again.');return false;}
    const banner=content.banners.get(bannerId);if(!banner){this.toast('This banner is unavailable.');return false;}
    const before=this.state;
    try{const result=drawPulls(before,banner,count,this.random,this.now());this.state=result.save;
      for(const r of result.receipt.results)if(r.isNew&&r.kind==='unit'){
        const u=content.units.get(r.id),p=this.preset;
        if(p.unitIds.length<4&&p.sagaId===u.sagaId&&!p.unitIds.some(id=>content.units.get(id).familyId===u.familyId)){
          p.unitIds.push(r.id);p.rows.push(u.rowPreference==='back'?'back':'front');p.powerupIds.push(null);r.joinedParty=true;
        }
      }
      writeSave(this.storage,this.state,this.now());this.emit();return result.receipt;
    }catch(e){this.state=before;this.toast(e.message);return false;}
  }
  finishReveal(){return this.transaction(s=>{s.banners.pendingReveal=null;return true;});}
  bannerStatus(id){return bannerStatus(content.banners.get(id),this.state);}
  switchWorld(id){return this.transaction(s=>{
    const w=content.worlds.get(id);if(!w||w.productionStatus==='planned')throw new Error('That World is still in production.');
    let p=s.progression.worlds[id];
    if(!p||p.state==='available'){
      if(s.progression.atlas.rank<w.atlas.rankRequired)throw new Error('Clear the Mushroom Kingdom finale to reveal Dream Land.');
      if(s.progression.atlas.keys<w.atlas.keyCost)throw new Error('A World unlock needs one Atlas Key.');
      s.progression.atlas.keys-=w.atlas.keyCost;p=s.progression.worlds[id]=worldProgress(p?.threatSnapshot||1+5*s.progression.atlas.rank);
      const starter=w.sagaId==='kirby'?'adventure-kirby':'classic-mario';if(!s.collection.units[starter])s.collection.units[starter]=ownership(this.now());
      if(!s.progression.availableWorldIds.includes(id))s.progression.availableWorldIds.push(id);
    }
    const presetId=w.sagaId+'-story';s.loadouts.presets[presetId]||={name:w.sagaId==='mario'?'Mushroom Party':'Dream Party',mode:'story',sagaId:w.sagaId,
      unitIds:[w.sagaId==='mario'?'classic-mario':'adventure-kirby'],rows:['front'],powerupIds:[null],assistId:null};
    s.loadouts.activePresetId=presetId;s.session.worldId=id;s.session.encounterId=w.implementedEncounterIds[Math.min(p.highestStageCleared,w.length-1)];s.session.mode='story';s.session.auto=false;
    this.battle=null;return true;
  });}
  choosePreset(id){return this.transaction(s=>{if(!s.loadouts.presets[id]||s.loadouts.presets[id].mode==='legacy')throw new Error('Preset is unavailable.');if(this.preset.mode!==s.loadouts.presets[id].mode)s.session.auto=false;s.loadouts.activePresetId=id;});}
  endlessPreset(){return this.transaction(s=>{
    const legal=Object.keys(s.collection.units).filter(id=>s.progression.endlessUnlockedBySaga[content.units.get(id)?.sagaId]);
    if(!legal.length)throw new Error('Clear a World finale to open Endless.');
    const families=new Set(),party=legal.filter(id=>{const family=content.units.get(id).familyId;if(families.has(family)||families.size>=4)return false;families.add(family);return true;});
    s.loadouts.presets.endless||={name:'Crossover Party',mode:'endless',unitIds:party,rows:party.map(()=>'front'),powerupIds:party.map(()=>null),assistId:null};s.loadouts.activePresetId='endless';
  });}
  endlessCourse(round=this.state.session.endlessRound){
    const worlds=[...content.worlds.values()].filter(w=>w.productionStatus!=='planned'&&this.state.progression.endlessUnlockedBySaga[w.sagaId]);
    const pool=[];for(let i=0;i<25;i++)for(const w of worlds)if(w.implementedEncounterIds[i])pool.push(w.implementedEncounterIds[i]);
    return pool.length?pool[round%pool.length]:null;
  }
  start(encounterId=this.state.session.encounterId,mode='story') {
    if(this.state.session.pendingBattleReward){this.toast('Save or export the completed expedition before deploying again.');return false;}
    if(!['story','camp','endless'].includes(mode)){this.toast('Choose Story, Camp or Endless.');return false;}
    if(mode==='endless')encounterId=this.endlessCourse();
    const encounter=content.encounters.get(encounterId),world=encounter&&content.worlds.get(encounter.worldId),p=world&&this.state.progression.worlds[world.id];
    if(!encounter||!p||!['unlocked','complete'].includes(p.state)){this.toast('Unlock this World first.');return false;}
    if(mode==='camp'&&!p.firstClearEncounterIds.includes(encounterId)){this.toast('Camp at a cleared stage.');return false;}
    if(mode==='story'&&encounter.localStage>p.highestStageCleared+1){this.toast('Clear the preceding stage first.');return false;}
    if(mode==='endless'&&this.preset.mode!=='endless'){this.toast('Select your crossover party first.');return false;}
    if(mode!=='endless'&&this.preset.sagaId!==world.sagaId){this.toast('Select this Hub’s story party.');return false;}
    try {
      const seedCounter=this.state.session.seedCounter+1,seed=`v1-${encounterId}-${seedCounter}`;
      const endlessThreat=this.state.session.endlessRound?this.state.session.endlessThreatSnapshot:1+5*this.state.progression.atlas.rank;
      const next=new Battle({encounter,party:this.party,rank:this.rank,owned:this.owned,powerupIds:this.preset.powerupIds,rows:this.preset.rows,assistId:this.preset.assistId,assistProficiencyRank:this.state.collection.assists[this.preset.assistId]?.proficiencyRank||1,
        threat:mode==='endless'?endlessThreat+this.state.session.endlessRound:p.threatSnapshot+encounter.localStage-1,mode,seed,runId:seed});
      if(!this.transaction(s=>{s.session.seedCounter=seedCounter;s.session.encounterId=encounterId;s.session.worldId=world.id;s.session.mode=mode;if(mode==='endless')s.session.endlessThreatSnapshot=endlessThreat;if(mode==='camp')s.session.campId=encounterId;return true;}))return false;
      this.battle=next;this.paused=false;this.lastReport=null;this.emit();return true;
    }catch(e){this.toast(e.message);return false;}
  }
  pause(){this.paused=!this.paused;this.emit();}
  auto(value){this.transaction(s=>{s.session.auto=Boolean(value);});}
  tick(dt) {
    if(!this.battle||this.battle.done||this.paused||this.state.profile.stripHidden)return;
    this.battle.step(dt);this.state.profile.activePlaySeconds+=dt;
    if(this.battle.done)this.completeBattle(this.battle.report());
  }
  completeBattle(report) {
    if(this.state.telemetry.rewardedRunIds.includes(report.runId))return false;
    const result=this.transaction(s=>{
      const e=content.encounters.get(report.encounterId),world=content.worlds.get(e.worldId),p=s.progression.worlds[e.worldId];
      const isStory=report.mode==='story',first=report.win&&isStory&&!p.firstClearEncounterIds.includes(e.id);
      report.firstClear=first;report.rewards=[];
      if(report.win){
        const rewards=first?e.rewards.firstClear:e.rewards.repeat;
        for(const r of rewards){const earned={...r};if(r.type==='coins'&&report.coinBonus)earned.amount=Math.round(r.amount*(1+report.coinBonus));this.reward(earned);report.rewards.push(earned);}
        if(first){
          p.firstClearEncounterIds.push(e.id);p.highestStageCleared=Math.max(p.highestStageCleared,e.localStage);s.session.campId=e.id;
          if(e.localStage%5===0)s.progression.atlas.rank++;
          if(e.localStage===world.length){p.state='complete';s.progression.atlas.keys+=world.atlas.keyReward;s.progression.endlessUnlockedBySaga[world.sagaId]=true;
            if(world.sagaId==='mario'&&!s.progression.worlds[KIRBY_WORLD]){s.progression.worlds[KIRBY_WORLD]=worldProgress(1+5*s.progression.atlas.rank,'available');s.progression.availableWorldIds.push(KIRBY_WORLD);}
          }
          if(e.localStage<world.length)s.session.encounterId=world.implementedEncounterIds[e.localStage];
        }
        if(report.mode==='endless'){s.session.endlessRound++;s.session.endlessBest=Math.max(s.session.endlessBest,s.session.endlessRound);s.session.encounterId=this.endlessCourse();s.session.worldId=content.encounters.get(s.session.encounterId).worldId;}
        s.telemetry.totalWaves+=report.waves;s.telemetry.totalKills+=report.kills;s.telemetry.totalAssists+=report.stats.assists;
        if(e.boss)s.telemetry.totalBosses++;
        const t=s.telemetry.clears[e.id]||={count:0,totalSeconds:0};t.count++;t.totalSeconds+=report.seconds;
      }else {s.session.auto=false;if(report.mode==='endless')s.session.endlessRound=0;if(s.session.campId){s.session.encounterId=s.session.campId;s.session.worldId=content.encounters.get(s.session.campId).worldId;}
        report.reason=report.rank<e.recommendedTrainingRank?`Training Rank ${report.rank}; this stage recommends ${e.recommendedTrainingRank}. Camp, train the party, or add a new fighter.`:report.stats.knockouts.length?'The front line fell. Try a Vanguard, a healer, or protective Supply.':'The fight ran out of damage. Try a ranged fighter or train the party.';
      }
      for(const a of report.party){const u=s.collection.units[a.id];if(u){u.masteryXp+=(a.secondsFielded??report.seconds)/20;this.updateMastery(u);}}
      if(report.assistId&&s.collection.assists[report.assistId]){const a=s.collection.assists[report.assistId];a.proficiencyXp+=report.seconds/15;a.proficiencyRank=Math.min(5,1+Math.floor(a.proficiencyXp/150));}
      s.telemetry.rewardedRunIds.push(report.runId);s.telemetry.rewardedRunIds=s.telemetry.rewardedRunIds.slice(-100);
      s.telemetry.recentReports.unshift(report);s.telemetry.recentReports=s.telemetry.recentReports.slice(0,12);this.lastReport=report;
      s.session.pendingBattleReward=null;this.updateOrders();return report;
    });
    if(!result){this.state.session.pendingBattleReward=structuredClone(report);this.paused=true;this.emit();}
    return result;
  }
  reward(r){const s=this.state;
    const currencies={coins:'coins',starlight:'starlight','supply-ticket':'supplyTickets',echoes:'echoes'};
    if(currencies[r.type])s.inventory[currencies[r.type]]+=r.amount;
    if(r.type==='patrol-mark'){s.progression.orders.patrolMarks+=r.amount;while(s.progression.orders.patrolMarks>=10){s.progression.orders.patrolMarks-=10;s.inventory.starlight+=100;}}
    if(r.type==='powerup')s.collection.powerups[r.itemId]||={discoveredAt:this.now()};
    if(r.type==='assist')s.collection.assists[r.itemId]||={proficiencyRank:1,proficiencyXp:0,discoveredAt:this.now()};
  }
  welcome() {
    if(this.state.session.pendingBattleReward)this.completeBattle(this.state.session.pendingBattleReward);
    const s=this.state,elapsed=s.profile.stripHidden?0:Math.max(0,Math.min(RULES.offlineCap,(this.now()-s.profile.lastSeenAt)/1000));
    const camp=s.session.campId,t=s.telemetry.clears[camp];
    if(t?.count>0&&content.encounters.has(camp)&&elapsed>=60){const avg=Math.max(90,t.totalSeconds/t.count),e=content.encounters.get(camp),clears=elapsed/avg;
      const coins=Math.floor(clears*e.rewards.repeat.find(r=>r.type==='coins').amount*0.6),starlight=Math.floor(clears*10*0.25);
      s.inventory.coins+=coins;s.inventory.starlight+=starlight;this.away={seconds:Math.round(elapsed),coins,starlight,clears:Math.floor(clears)};
    }
    this.makeOrders();this.save();this.emit();
  }
  makeOrders(){const s=this.state,orders=s.progression.orders,date=new Date(this.now()).toISOString().slice(0,10);
    orders.storedFolders=orders.storedFolders.filter(f=>!f.claimed).slice(-3);
    if(this.progress.highestStageCleared<5||orders.lastFolderDate===date)return;
    const today=Date.parse(date+'T00:00:00Z'),previous=Date.parse(orders.lastFolderDate+'T00:00:00Z');
    const missed=Number.isFinite(previous)?Math.max(1,Math.floor((today-previous)/86400000)):1;
    const count=Math.min(missed,3-orders.storedFolders.length);
    for(let i=count-1;i>=0;i--){const id=new Date(today-i*86400000).toISOString().slice(0,10);
      orders.storedFolders.push({id,claimed:false,baseline:{waves:s.telemetry.totalWaves,kills:s.telemetry.totalKills,bosses:s.telemetry.totalBosses,clears:Object.values(s.telemetry.clears).reduce((n,x)=>n+x.count,0)},stamps:[],claimedStamps:[],missionIds:['waves','kills','stages','boss','training'],startRank:this.rank});
    }
    orders.lastFolderDate=date;
  }
  updateOrders(){this.makeOrders();const s=this.state;
    for(const f of s.progression.orders.storedFolders.filter(f=>!f.claimed)){
      const values={waves:s.telemetry.totalWaves-f.baseline.waves>=20,kills:s.telemetry.totalKills-f.baseline.kills>=30,
        stages:Object.values(s.telemetry.clears).reduce((n,x)=>n+x.count,0)-f.baseline.clears>=3,boss:s.telemetry.totalBosses-f.baseline.bosses>=1,training:this.rank-f.startRank>=1};
      f.stamps=Object.keys(values).filter(k=>values[k]);
    }
  }
  claimOrder(folderId,id){return this.transaction(s=>{
    const f=s.progression.orders.storedFolders.find(f=>f.id===folderId);if(!f||f.claimed||!f.stamps.includes(id)||f.claimedStamps.includes(id))throw new Error('This order is not ready.');
    f.claimedStamps.push(id);s.inventory.starlight+=75;s.inventory.coins+=50;
    if(f.claimedStamps.length===3){f.claimed=true;s.inventory.starlight+=175;s.inventory.coins+=100;s.inventory.supplyTickets+=2;}
  });}
  exchange(kind){return this.transaction(s=>{const prices=RULES.exchange;if(!prices[kind])return;if(s.inventory.echoes<prices[kind])throw new Error('Not enough Echoes.');s.inventory.echoes-=prices[kind];if(kind==='ticket')s.inventory.supplyTickets++;else s.inventory.materials.techniqueNotes++;});}
  setting(key,value){return this.transaction(s=>{if(['muted','reducedMotion','stripHidden'].includes(key))s.profile[key]=Boolean(value);else if(key==='fps')s.profile.fps=value===60?60:30;});}
  audio(kind,value){return this.transaction(s=>{if(['music','voice','sfx'].includes(kind))s.profile.audio[kind]=Math.max(0,Math.min(1,Number(value)));});}
  exportSave(){return JSON.stringify(this.state,null,2);}
  importSave(raw){try{const next=migrateSave(JSON.parse(raw),this.now());if(this.storage)this.storage.setItem('pocketgacha.save.import.backup.'+this.now(),this.exportSave());writeSave(this.storage,next,this.now());this.state=next;this.battle=null;this.emit();return true;}catch(e){this.toast('Import failed: '+e.message);return false;}}
}

function browserStorage(){try{return window.localStorage;}catch{return null;}}
export const game=typeof window!=='undefined'?new Game({storage:browserStorage()}):null;
