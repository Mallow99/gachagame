import { defaultSave, ownership, FIRST_WORLD, pity, worldProgress } from './default-save.js';
import { content } from '../content/index.js';
import { parseSaveV3 } from '../save-v3.js';

const record = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const n = (x, fallback = 0) => Number.isFinite(x) && x >= 0 ? x : fallback;
const strings=x=>Array.isArray(x)?[...new Set(x.filter(v=>typeof v==='string'))]:[];
const obj=x=>record(x)?x:{};
const integer=(x,fallback=0,max=Number.MAX_SAFE_INTEGER)=>Math.min(max,Math.floor(n(x,fallback)));
function receipt(r){
  if(!record(r)||typeof r.id!=='string'||!Array.isArray(r.results))return null;
  const results=r.results.filter(x=>record(x)&&typeof x.id==='string'&&['unit','powerup','assist'].includes(x.kind)&&['R','SR','SSR','UR'].includes(x.rarity)).slice(0,10).map(x=>({...x,isNew:Boolean(x.isNew),stars:integer(x.stars,0,5),echoes:integer(x.echoes),joinedParty:Boolean(x.joinedParty)}));
  return results.length?{...r,sagaId:r.sagaId==='kirby'?'kirby':'mario',at:n(r.at),results}:null;
}
function battleReport(r){
  if(!record(r)||typeof r.runId!=='string'||!content.encounters.has(r.encounterId)||!Array.isArray(r.party)||!record(r.stats))return null;
  const numericMap=m=>Object.fromEntries(Object.entries(obj(m)).map(([id,value])=>[id,n(value)]));
  const seconds=integer(r.seconds,0,3600);
  return {...r,win:Boolean(r.win),mode:['story','camp','endless'].includes(r.mode)?r.mode:'story',seconds,
    rank:Math.max(1,integer(r.rank,1,999)),threat:Math.max(1,integer(r.threat,1,999)),waves:integer(r.waves,0,25),kills:integer(r.kills),
    party:r.party.filter(a=>record(a)&&typeof a.id==='string').slice(0,4).map(a=>({...a,hp:n(a.hp),maxHp:Math.max(1,n(a.maxHp,1)),secondsFielded:Math.min(seconds,n(a.secondsFielded,seconds))})),
    stats:{...r.stats,damage:numericMap(r.stats.damage),healing:numericMap(r.stats.healing),assists:integer(r.stats.assists),knockouts:strings(r.stats.knockouts),bossPhases:strings(r.stats.bossPhases)},
    events:(Array.isArray(r.events)?r.events:[]).filter(e=>record(e)&&typeof e.type==='string').slice(-160).map(e=>({...e,atMs:n(e.atMs),values:obj(e.values)})),
    rewards:(Array.isArray(r.rewards)?r.rewards:[]).filter(e=>record(e)&&typeof e.type==='string')};
}
export function migrateSave(input, now = Date.now()) {
  if (!record(input)) throw new Error('Save is not an object.');
  if (input.saveVersion === 4) return repairSave(structuredClone(input), now);
  if (input.saveVersion > 4) throw new Error('This save was created by a newer version.');
  const legacy = parseSaveV3(JSON.stringify(input));
  if (!legacy) throw new Error('The legacy save is malformed.');
  const s = defaultSave(now);
  s.inventory.starlight = n(legacy.gems); s.inventory.coins = n(legacy.gold, 300);
  s.banners.fighter = { ...pity(), sinceSsr: n(legacy.pitySsr), sinceSr: n(legacy.pitySr), totalPulls: n(legacy.totalPulls) };
  s.profile.muted = legacy.muted !== false; s.profile.lastSeenAt = n(legacy.lastSeen, now);
  s.profile.legacyDaily = legacy.lastDaily || '';
  s.collection.legacyUnits = structuredClone(legacy.owned);
  const levels = Object.values(legacy.owned).map(o => n(o.lvl, 1)).sort((a, b) => a - b);
  const mid = levels.length / 2;
  s.progression.training.rank = Math.max(1, Math.min(10, Math.floor(levels.length ? (levels[Math.floor(mid)] + levels[Math.ceil(mid) - 1]) / 2 : 1)));
  s.loadouts.presets['legacy-prototype'] = { name: 'Preserved prototype party', mode: 'legacy', unitIds: legacy.party, rows: [], powerupIds: [], assistId: null };
  s.progression.legacyWorld = { stage: legacy.stage || 1 };
  s.content.migrationsApplied.push('v3-to-v4');
  return repairSave(s, now);
}

export function repairSave(s, now = Date.now()) {
  if (!record(s) || s.saveVersion !== 4 || !record(s.inventory) || !record(s.collection)) throw new Error('SaveV4 is malformed.');
  const fresh = defaultSave(now);
  for (const key of ['profile', 'progression', 'loadouts', 'banners', 'content', 'session', 'telemetry']) {
    s[key] = { ...fresh[key], ...(record(s[key]) ? s[key] : {}) };
  }
  s.profile.audio = { ...fresh.profile.audio, ...obj(s.profile.audio) };
  for(const key of ['music','voice','sfx'])s.profile.audio[key]=Math.min(1,n(s.profile.audio[key],fresh.profile.audio[key]));
  s.profile.fps=s.profile.fps===60?60:30;
  for(const key of ['createdAt','lastSeenAt','activePlaySeconds'])s.profile[key]=n(s.profile[key],fresh.profile[key]);
  for(const key of ['muted','stripHidden','reducedMotion'])s.profile[key]=typeof s.profile[key]==='boolean'?s.profile[key]:fresh.profile[key];
  for(const key of ['tutorialsSeen','dismissedNotices'])s.profile[key]=strings(s.profile[key]);
  for (const key of ['units', 'powerups', 'assists', 'legacyUnits']) s.collection[key] = record(s.collection[key]) ? s.collection[key] : {};
  for (const key of ['coins', 'starlight', 'supplyTickets', 'echoes']) s.inventory[key] = n(s.inventory[key], fresh.inventory[key]);
  s.inventory.materials = { ...obj(s.inventory.materials),techniqueNotes:integer(s.inventory.materials?.techniqueNotes) };
  s.progression.training = { rank: Math.max(1, integer(s.progression.training?.rank, 1,999)) };
  s.progression.atlas = { ...fresh.progression.atlas, ...obj(s.progression.atlas) };
  for(const key of ['rank','areaXp','keys'])s.progression.atlas[key]=integer(s.progression.atlas[key]);
  s.progression.orders = { ...fresh.progression.orders, ...obj(s.progression.orders) };
  s.progression.orders.patrolMarks=integer(s.progression.orders.patrolMarks,0,9);
  const missions=['waves','kills','stages','boss','training'];
  s.progression.orders.storedFolders=(Array.isArray(s.progression.orders.storedFolders)?s.progression.orders.storedFolders:[]).filter(f=>record(f)&&typeof f.id==='string'&&record(f.baseline)).slice(-3).map(f=>({...f,claimed:Boolean(f.claimed),missionIds:strings(f.missionIds).filter(id=>missions.includes(id)).length?strings(f.missionIds).filter(id=>missions.includes(id)):missions,stamps:strings(f.stamps).filter(id=>missions.includes(id)),claimedStamps:strings(f.claimedStamps).filter(id=>missions.includes(id)).slice(0,3),startRank:Math.max(1,integer(f.startRank,1)),baseline:Object.fromEntries(['waves','kills','bosses','clears'].map(k=>[k,integer(f.baseline[k])]))}));
  s.progression.worlds = { ...fresh.progression.worlds, ...obj(s.progression.worlds) };
  for(const [id,p] of Object.entries(s.progression.worlds)){
    const w=content.worlds.get(id);if(!w)continue;
    const data=obj(p);s.progression.worlds[id]={...worldProgress(id===FIRST_WORLD?1:16),...data};
    const fixed=s.progression.worlds[id];fixed.state=['available','unlocked','complete'].includes(data.state)?data.state:'unlocked';
    fixed.threatSnapshot=Math.max(1,integer(data.threatSnapshot,id===FIRST_WORLD?1:16,999));
    fixed.highestStageCleared=integer(data.highestStageCleared,0,w.length);
    fixed.firstClearEncounterIds=strings(data.firstClearEncounterIds).filter(e=>content.encounters.get(e)?.worldId===id);
  }
  s.progression.availableWorldIds=strings(s.progression.availableWorldIds).filter(id=>content.worlds.has(id));
  if(!s.progression.availableWorldIds.includes(FIRST_WORLD))s.progression.availableWorldIds.unshift(FIRST_WORLD);
  s.progression.endlessUnlockedBySaga = { ...fresh.progression.endlessUnlockedBySaga, ...obj(s.progression.endlessUnlockedBySaga) };
  s.progression.hubWelcome = { ...fresh.progression.hubWelcome, ...obj(s.progression.hubWelcome) };
  for(const saga of ['mario','kirby']){
    s.progression.endlessUnlockedBySaga[saga]=Boolean(s.progression.endlessUnlockedBySaga[saga]);
    const w=obj(s.progression.hubWelcome[saga]);s.progression.hubWelcome[saga]={pulls:integer(w.pulls),newSr:Boolean(w.newSr)};
  }
  for (const channel of ['fighter', 'supply']) {
    const p = s.banners[channel] || {}; s.banners[channel] = { ...pity(), ...p };
    for (const key of ['sinceSsr', 'sinceSr', 'totalPulls']) s.banners[channel][key] = Math.floor(n(p[key]));
    s.banners[channel].featuredGuarantee=Boolean(p.featuredGuarantee);
  }
  s.banners.history = (Array.isArray(s.banners.history) ? s.banners.history : []).map(receipt).filter(Boolean).slice(-300);
  s.banners.pendingReveal=receipt(s.banners.pendingReveal);
  s.content.migrationsApplied=strings(s.content.migrationsApplied);
  s.content.missingIds = [...new Set(['units','powerups','assists'].flatMap(kind=>Object.keys(s.collection[kind]).filter(id=>!content[kind].has(id))))];
  if (!s.collection.units['classic-mario']) s.collection.units['classic-mario'] = ownership(now);
  for (const [id, o] of Object.entries(s.collection.units)) {
    if (!record(o)) { s.collection.units[id] = ownership(now); continue; }
    o.stars = Math.min(5, Math.floor(n(o.stars))); o.masteryRank = Math.max(1, Math.min(5, Math.floor(n(o.masteryRank, 1)))); o.masteryXp = n(o.masteryXp);
  }
  for(const [id,o] of Object.entries(s.collection.assists))s.collection.assists[id]={...obj(o),proficiencyRank:Math.max(1,integer(o?.proficiencyRank,1,5)),proficiencyXp:n(o?.proficiencyXp),discoveredAt:n(o?.discoveredAt,now)};
  s.loadouts.presets = record(s.loadouts.presets) ? s.loadouts.presets : fresh.loadouts.presets;
  for (const [presetId,preset] of Object.entries(s.loadouts.presets)) {
    if(!record(preset)){delete s.loadouts.presets[presetId];continue;}
    if (preset.mode === 'legacy') continue;
    preset.mode = preset.mode === 'endless' ? 'endless' : 'story'; preset.sagaId=preset.sagaId==='kirby'?'kirby':'mario';
    const families = new Set(), units = [], rows = [], items = [];
    for (const [i, id] of (Array.isArray(preset.unitIds) ? preset.unitIds : []).entries()) {
      const u = content.units.get(id);
      if (!u || u.usable===false || !s.collection.units[id] || families.has(u.familyId) || units.length >= 4) continue;
      if (preset.mode === 'story' && u.sagaId !== preset.sagaId) continue;
      if (preset.mode === 'endless' && !s.progression.endlessUnlockedBySaga[u.sagaId]) continue;
      families.add(u.familyId); units.push(id); rows.push(preset.rows?.[i] === 'back' ? 'back' : 'front');
      const itemId = preset.powerupIds?.[i], item = content.powerups.get(itemId);
      items.push(item && item.productionStatus!=='planned' && item.usable!==false && s.collection.powerups[itemId] && (preset.mode === 'endless' ? s.progression.endlessUnlockedBySaga[item.sagaId] : item.sagaId === preset.sagaId) ? itemId : null);
    }
    if (!units.length && preset.mode === 'story') {
      const starter = preset.sagaId === 'kirby' ? 'adventure-kirby' : 'classic-mario';
      if (s.collection.units[starter]) { units.push(starter); rows.push('front'); items.push(null); }
    }
    preset.unitIds = units; preset.rows = rows; preset.powerupIds = items;
    const assist = content.assists.get(preset.assistId);
    if (!assist || assist.usable===false || assist.productionStatus==='planned' || !s.collection.assists[assist.id] || families.has(assist.familyId) || (preset.mode === 'story' ? assist.sagaId !== preset.sagaId : !s.progression.endlessUnlockedBySaga[assist.sagaId])) preset.assistId = null;
  }
  if (!s.loadouts.presets[s.loadouts.activePresetId]?.unitIds?.length || s.loadouts.presets[s.loadouts.activePresetId].mode === 'legacy') s.loadouts.activePresetId = 'mario-story';
  s.loadouts.presets['mario-story'] ||= fresh.loadouts.presets['mario-story'];
  if (!content.worlds.has(s.session.worldId)||!['unlocked','complete'].includes(s.progression.worlds[s.session.worldId]?.state)) s.session = fresh.session;
  if(content.encounters.get(s.session.encounterId)?.worldId!==s.session.worldId)s.session.encounterId=content.worlds.get(s.session.worldId).implementedEncounterIds[0];
  if(!content.encounters.has(s.session.campId))s.session.campId=null;
  s.session.seedCounter=integer(s.session.seedCounter);s.session.endlessRound=integer(s.session.endlessRound);
  s.session.endlessBest=integer(s.session.endlessBest);s.session.endlessThreatSnapshot=Math.max(1,integer(s.session.endlessThreatSnapshot,16,999));
  s.session.mode=['story','camp','endless'].includes(s.session.mode)?s.session.mode:'story';s.session.auto=Boolean(s.session.auto);
  s.session.pendingBattleReward=battleReport(s.session.pendingBattleReward);
  s.telemetry.clears=obj(s.telemetry.clears);
  for(const [id,t] of Object.entries(s.telemetry.clears))s.telemetry.clears[id]={count:integer(t?.count),totalSeconds:n(t?.totalSeconds)};
  for(const key of ['totalWaves','totalKills','totalBosses','totalAssists'])s.telemetry[key]=integer(s.telemetry[key]);
  s.telemetry.rewardedRunIds = Array.isArray(s.telemetry.rewardedRunIds) ? s.telemetry.rewardedRunIds.slice(-100) : [];
  if(s.session.pendingBattleReward&&s.telemetry.rewardedRunIds.includes(s.session.pendingBattleReward.runId))s.session.pendingBattleReward=null;
  s.telemetry.recentReports = (Array.isArray(s.telemetry.recentReports) ? s.telemetry.recentReports : []).map(battleReport).filter(Boolean).slice(0,12);
  s.contentVersion = 3;
  return s;
}
