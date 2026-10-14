import { content } from './content/index.js';
import { RULES, rarityRank } from './config/rules.js';
import { ownership } from './save/default-save.js';

export function bannerPool(banner, save) {
  const progress = save.progression.worlds[banner.sagaId==='mario'?'super-mario-bros-1985':'kirbys-adventure-1993'];
  return banner.pool.filter(e=> {
    const map = e.itemType==='unit'?content.units:e.itemType==='powerup'?content.powerups:content.assists;
    const item=map.get(e.itemId);
    return item && item.usable!==false && item.productionStatus!=='planned' && (e.itemType!=='unit'||!item.unlockStage||progress?.highestStageCleared>=item.unlockStage);
  });
}
export function bannerStatus(banner, save) {
  const pool=bannerPool(banner,save);
  if (banner.availability!=='live') return {ready:false,reason:`Archive preview · ${pool.length} / ${banner.releaseGate?.minimumLivePool||22} fighters prepared`};
  if (banner.releaseGate) {
    const gate=banner.releaseGate;
    if (pool.length<gate.minimumLivePool||Object.entries(gate.minimumByRarity).some(([r,c])=>pool.filter(x=>x.rarity===r).length<c)) return {ready:false,reason:'The collection release gate is not complete.'};
  }
  if (banner.channel==='supply') {
    if (pool.length<6||pool.filter(x=>x.rarity==='R').length<3||pool.filter(x=>x.rarity==='SR').length<2||pool.filter(x=>x.rarity==='SSR').length<1) return {ready:false,reason:'Supply needs six complete records: 3 R, 2 SR and 1 SSR.'};
  }
  const cleared=Object.values(save.progression.worlds).some(w=>w.firstClearEncounterIds.includes(banner.unlock.encounterId));
  if(!cleared)return {ready:false,reason:`Clear ${banner.unlock.encounterId.replace('smb1-','Mushroom stage ').replace('ka-','Dream stage ')} to open this page.`};
  if(['R','SR','SSR'].some(r=>!pool.some(x=>x.rarity===r))) return {ready:false,reason:'A published rarity has no live result.'};
  return {ready:true,reason:''};
}
export function ssrChance(channel,pity) {
  const r=RULES[channel]; const next=pity.sinceSsr+1;
  return next>=r.hard?1:Math.min(1,r.ssr+Math.max(0,next-r.soft)*r.step);
}
export function rollRarity(channel,pity,random=Math.random){
  const chance=ssrChance(channel,pity),roll=random();
  return roll<chance?'SSR':pity.sinceSr+1>=RULES[channel].srHard||roll<chance+RULES[channel].sr?'SR':'R';
}
// Published per-record rates use ordinary tier chances. Welcome replacements
// are disclosed separately; they depend on the player's owned families.
export function publishedRates(banner,save,{next=false}={}) {
  const pool=bannerPool(banner,save),p=save.banners[banner.channel],r=RULES[banner.channel];
  const ssr=next?ssrChance(banner.channel,p):r.ssr;
  const sr=next&&p.sinceSr>=9?1-ssr:Math.min(r.sr,1-ssr);
  const tiers={R:Math.max(0,1-ssr-sr),SR:sr,SSR:ssr};
  const focus=pool.filter(e=>e.rarity==='SSR'&&banner.featured.some(f=>f.itemId===e.itemId));
  const other=pool.filter(e=>e.rarity==='SSR'&&!focus.includes(e));
  const focusShare=!other.length?1:next&&p.featuredGuarantee?1:.5;
  return pool.map(e=>{
    let candidates=pool.filter(x=>x.rarity===e.rarity),share=1;
    if(e.rarity==='SSR'&&focus.length){const featured=focus.includes(e);candidates=featured?focus:other;share=featured?focusShare:1-focusShare;}
    const total=candidates.reduce((n,x)=>n+(x.weight||1),0);
    return {...e,probability:tiers[e.rarity]*share*(e.weight||1)/total};
  });
}
function weighted(items,random) {
  const total=items.reduce((s,x)=>s+(x.weight||1),0);let point=random()*total;
  for(const e of items){point-=e.weight||1;if(point<=0)return e;}
  return items.at(-1);
}

/** Pure transaction on a cloned save. All RNG and acquisition precede theater. */
export function drawPulls(save,banner,count,random=Math.random,now=Date.now()) {
  if(![1,10].includes(count))throw new Error('Choose one or ten results.');
  const status=bannerStatus(banner,save);if(!status.ready)throw new Error(status.reason);
  const channel=banner.channel, currency=channel==='fighter'?'starlight':'supplyTickets', cost=RULES[channel].cost*count;
  if(save.inventory[currency]<cost)throw new Error(`Need ${cost-save.inventory[currency]} more ${currency==='starlight'?'Starlight':'Supply Tickets'}.`);
  const s=structuredClone(save), pool=bannerPool(banner,s), p=s.banners[channel], results=[];
  const welcome=s.progression.hubWelcome[banner.sagaId] ||= {pulls:0,newSr:false};
  s.inventory[currency]-=cost;
  for(let i=0;i<count;i++) {
    let rarity=rollRarity(channel,p,random);
    let candidates=pool.filter(e=>e.rarity===rarity),featured=false;
    if(channel==='fighter'&&rarity==='SSR'&&banner.featured.length){
      const focus=pool.filter(e=>banner.featured.some(f=>f.itemId===e.itemId)&&e.rarity==='SSR');
      const unfocused=candidates.filter(e=>!focus.includes(e));
      if(focus.length&&(p.featuredGuarantee||!unfocused.length||random()<0.5)){candidates=focus;featured=true;}
      else if(unfocused.length)candidates=unfocused;
      p.featuredGuarantee=!featured;
    }
    if(channel==='fighter'&&welcome.pulls===0){
      const ownedFamilies=new Set(Object.keys(s.collection.units).map(id=>content.units.get(id)?.familyId));
      const newCandidates=candidates.filter(e=>!s.collection.units[e.itemId]&&!ownedFamilies.has(content.units.get(e.itemId)?.familyId));
      // Never replace a natural SSR; fall back to the declared owned-safe tier.
      if(newCandidates.length)candidates=newCandidates;
      else if(rarity!=='SSR'){candidates=pool.filter(e=>e.rarity==='R'&&!s.collection.units[e.itemId]&&!ownedFamilies.has(content.units.get(e.itemId)?.familyId));rarity='R';}
    }
    if(channel==='fighter'&&welcome.pulls===9&&!welcome.newSr&&rarity!=='SSR'){
      const replacements=(banner.welcomePool||[]).map(id=>pool.find(e=>e.itemId===id)).filter(e=>e&&!s.collection.units[e.itemId]);
      if(replacements.length){candidates=replacements;rarity=replacements[0].rarity;}
    }
    if(!candidates.length)throw new Error(`No eligible ${rarity} result on this page.`);
    const chosen=weighted(candidates,random),kind=chosen.itemType;
    if(channel==='fighter'&&rarity==='SSR'&&banner.featured.length){featured=banner.featured.some(e=>e.itemId===chosen.itemId);p.featuredGuarantee=!featured;}
    const collection=kind==='unit'?s.collection.units:kind==='powerup'?s.collection.powerups:s.collection.assists;
    const isNew=!collection[chosen.itemId];let stars=0,echoes=0;
    if(isNew) collection[chosen.itemId]=kind==='unit'?ownership(now):kind==='assist'?{proficiencyRank:1,proficiencyXp:0,discoveredAt:now}:{discoveredAt:now};
    else {
      const owned=collection[chosen.itemId];
      if(kind==='unit'){const max=owned.stars>=5;owned.stars=Math.min(5,owned.stars+1);stars=owned.stars;echoes=RULES.echoes[rarity][max?1:0];}
      else if(kind==='assist'){owned.proficiencyXp+=25*(rarityRank(rarity)+1);owned.proficiencyRank=Math.min(5,1+Math.floor(owned.proficiencyXp/150));echoes=RULES.echoes[rarity][0];}
      else echoes=RULES.echoes[rarity][1];
      s.inventory.echoes+=echoes;
    }
    p.sinceSsr=rarity==='SSR'?0:p.sinceSsr+1;p.sinceSr=rarityRank(rarity)>=1?0:p.sinceSr+1;p.totalPulls++;
    if(channel==='fighter'){welcome.pulls++;if(isNew&&rarityRank(rarity)>=1)welcome.newSr=true;}
    results.push({id:chosen.itemId,kind,rarity,isNew,stars,echoes,featured});
  }
  const receipt={id:`pull-${channel}-${now}-${s.banners[channel].totalPulls}`,at:now,bannerId:banner.id,sagaId:banner.sagaId,results};
  s.banners.history.push(receipt);s.banners.history=s.banners.history.slice(-300);s.banners.pendingReveal=receipt;
  return {save:s,receipt};
}
