import { content } from '../content/index.js';
import { spriteIcon } from '../render/sprite-bank.js';
import { rarityRank } from '../config/rules.js';
import { revealChime, revealTheme, stopRevealAudio, sting, voice } from '../audio.js';
import { REVEAL_ART } from './art.js';
import { supplyArt, supplyOrigin } from './supply-art.js';
const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const itemOf=r=>(r.kind==='unit'?content.units:r.kind==='powerup'?content.powerups:content.assists).get(r.id)||{id:r.id,name:'Unavailable Record',title:'Ownership preserved',rarity:r.rarity};
const label=r=>r.isNew?'NEW':r.kind==='unit'?`★ ${r.stars} · +${r.echoes} Echoes`:`+${r.echoes} Echoes`;
export function collectibleArt(item,kind='unit',cls=''){
  const art=kind==='unit'&&REVEAL_ART[item.id];
  if(art&&cls==='hero-splash')return `<img class="${cls} source-art ${art.style}" src="${art.url}" alt="${escape(item.name)}" draggable="false"><small class="art-credit">${escape(art.credit)}</small>`;
  if(kind==='unit'&&item.spriteKey)return `<img class="${cls} ${item.treatment==='game-boy'?'game-boy':''}" src="${spriteIcon(item.spriteKey)}" alt="${escape(item.name)}" draggable="false">`;
  if(kind==='unit')return `<span class="collectible-glyph ${cls}">?</span>`;
  return supplyArt(item,kind,cls);
}
export async function showReceipt(game,receipt,act,onInspect=()=>{}){
  if(document.querySelector('.reveal-dialog'))return;
  const dialog=document.createElement('dialog');dialog.className='reveal-dialog';dialog.setAttribute('aria-label','Summon results');
  dialog.innerHTML='<div class="reveal-stage"></div><button class="reveal-skip">Skip to results</button>';document.body.append(dialog);dialog.showModal();
  const stage=dialog.querySelector('.reveal-stage'),skip=dialog.querySelector('.reveal-skip');
  const controller=new AbortController();const {signal}=controller;let finished=false;
  signal.addEventListener('abort',stopRevealAudio,{once:true});
  const wait=ms=>new Promise(resolve=>{if(signal.aborted){resolve(false);return;}const abort=()=>{clearTimeout(id);resolve(false);};const id=setTimeout(()=>{signal.removeEventListener('abort',abort);resolve(true);},ms);signal.addEventListener('abort',abort,{once:true});});
  async function close(){
    const button=stage.querySelector('.result-continue');if(button?.disabled)return;controller.abort();
    if(game.state.banners.pendingReveal?.id===receipt.id){
      if(button){button.disabled=true;button.textContent='Saving…';}
      const result=act('finishReveal');
      if(window.desktop)for(let i=0;i<20&&game.state.banners.pendingReveal?.id===receipt.id;i++)await new Promise(r=>setTimeout(r,100));
      if(result===false||game.state.banners.pendingReveal?.id===receipt.id){if(button){button.disabled=false;button.textContent='Retry save & continue';}return;}
    }
    dialog.close();dialog.remove();
  }
  function results(){if(finished)return;finished=true;controller.abort();dialog.classList.add('results');skip.hidden=true;
    const message=receipt.preview?'Visual preview. Your collection and currency are unchanged.':`Saved to your collection. ${receipt.results.some(r=>r.kind==='unit')?`Every new fighter uses Training Rank ${game.rank}.`:'Equip your discoveries from the Party page.'}`;
    stage.innerHTML=`<div class="result-heading"><small>${receipt.preview?'PREVIEW':'SUMMON LEDGER'} / ${receipt.results.length} RESULT${receipt.results.length===1?'':'S'}</small><h2>${receipt.preview?'Artwork preview.':'The expedition grows.'}</h2><p>${message}</p></div><div class="result-grid">${receipt.results.map((r,i)=>{const item=itemOf(r);return `<button class="result-card ${r.rarity}" data-result="${i}">${collectibleArt(item,r.kind)}<span class="rarity">${r.rarity}</span><strong>${escape(item.name)}</strong><small>${escape(item.title||item.grantedTrait||'Assist Page')}</small><span class="result-new">${label(r)}</span>${r.joinedParty?'<small>Joined your party</small>':''}</button>`;}).join('')}</div><button class="primary result-continue">${receipt.preview?'Back to gallery':'Continue expedition'}</button>`;
    stage.querySelector('.result-continue').onclick=close;
    stage.querySelectorAll('[data-result]').forEach(button=>button.onclick=()=>{const r=receipt.results[Number(button.dataset.result)];onInspect(r.id,r.kind);});
    stage.querySelector('.result-continue').focus();
  }
  skip.onclick=results;dialog.addEventListener('cancel',event=>{event.preventDefault();if(finished)close();else results();});
  const highest=receipt.results.reduce((best,r)=>rarityRank(r.rarity)>rarityRank(best)?r.rarity:best,'R');
  const reduced=game.state.profile.reducedMotion||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const destination=receipt.sagaId==='mario'?'Mushroom Kingdom':'Dream Land';
  stage.innerHTML=`<div class="summon-route ${receipt.sagaId} ${reduced?'still':''}"><div class="ledger-stamp">${receipt.preview?'PREVIEW':'COMMITTED'}</div><p class="route-caption">An invitation to ${destination}</p><div class="flight-lines"></div><div class="wish-star">✦</div><div class="route-horizon"></div><div class="route-status">DEPARTURE</div></div>`;
  const route=stage.firstElementChild;
  if(!await wait(reduced?300:1500))return;
  route.classList.add('flight');route.querySelector('.route-status').textContent='FOLLOW THE STAR';sting(game.state.profile,receipt.sagaId);
  if(!await wait(reduced?200:1700))return;
  route.classList.add(highest);route.querySelector('.route-status').textContent=highest==='SSR'?'A GOLDEN SIGNAL':highest==='SR'?'A VIOLET SIGNAL':'A NEW ARRIVAL';revealChime(game.state.profile,receipt.sagaId,highest);
  if(!await wait(reduced?200:1600))return;
  for(const r of receipt.results){
    if(signal.aborted)return;const item=itemOf(r),rare=rarityRank(r.rarity)>=2;
    const origin=r.kind==='unit'?null:supplyOrigin(item),sourceId=item.sourceGameId||origin?.sourceGameId;
    if(rare){
      stage.innerHTML='<div class="quote-black"><p class="typed-quote"></p></div>';
      if(!await wait(reduced?100:600))return;
      const text=item.presentation?.quote||'The next chapter is yours.',quote=stage.querySelector('p');voice(game.state.profile,item.id);revealTheme(game.state.profile,receipt.sagaId);
      if(reduced)quote.textContent='“'+text+'”';else for(let i=0;i<=text.length;i++){if(!await wait(35))return;quote.textContent='“'+text.slice(0,i)+(i===text.length?'”':'');}
      if(!await wait(reduced?150:1000))return;
    }
    stage.innerHTML=`<div class="hero-reveal ${r.rarity} ${receipt.sagaId} ${reduced?'reduced':''}"><div class="reveal-rays"></div><div class="reveal-emblem">${escape(sourceId?.match(/\d{4}$/)?.[0]||'')}</div>${collectibleArt(item,r.kind,'hero-splash')}<div class="rarity-letters">${[...r.rarity].map((letter,i)=>`<b style="--i:${i}">${letter}</b>`).join('')}</div><div class="reveal-name"><small>${escape(item.title||item.grantedTrait||'ASSIST PAGE')}</small><h2>${escape(item.name)}</h2><p>${escape(origin?.sourceTitle||content.worlds.get(sourceId)?.name||sourceId||destination)}</p><span class="reveal-stars">${'★'.repeat(rarityRank(r.rarity)+3)}</span><p class="reveal-new">${label(r)}</p></div></div>`;
    if(!rare)voice(game.state.profile,item.id);revealChime(game.state.profile,receipt.sagaId,r.rarity);
    // Reduced motion keeps the artwork and identity readable; it suppresses
    // motion rather than turning a rare arrival into a brief flash.
    if(!await wait(reduced?(rare?1800:r.rarity==='SR'?1200:900):rare?3200:r.rarity==='SR'?1600:900))return;
    stopRevealAudio();
  }
  results();
}
