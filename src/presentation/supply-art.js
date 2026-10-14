import {spriteIcon} from '../render/sprite-bank.js';
import illustrations from '../../assets/portraits/supply/manifest.mjs';
const icons=new Set(['super-mushroom','life-mushroom','mini-mushroom','fire-flower','ice-flower']);
const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Original printed symbols for supply records without approved character art.
// They identify the item/intervention rather than impersonating a fighter.
export function supplyArt(item,kind,cls=''){
 const art=illustrations[item.id];
 if(art){const hero=cls==='hero-splash';return `<img class="${cls} ${hero?'source-art '+art.style:'supply-source'}" src="${hero?art.url:art.thumbnailUrl||art.url}" alt="${escape(item.name)}" draggable="false">${hero?`<small class="art-credit">${escape(art.credit)}</small>`:''}`;}
 if(kind==='assist'&&item.spriteKey)return `<img class="${cls}" src="${spriteIcon(item.spriteKey)}" alt="${escape(item.name)}" draggable="false">`;
 if(icons.has(item.id))return `<img class="${cls}" src="${spriteIcon(item.id)}" alt="${escape(item.name)}" draggable="false">`;
 const symbols={
  'super-leaf':'<path d="M15 43C12 25 25 14 49 10c4 25-7 41-26 38l-7 6 2-11Z"/><path class="cut" d="m21 43 19-22M30 33l-7-9M36 27l9 1"/>',
  'metal-cap':'<path d="m12 36 8-19h24l7 20-6 7H16Z"/><path class="cut" d="M20 25h25M16 37h35M26 21v13M37 21v13"/>',
  'penguin-suit':'<path d="M22 18q10-13 20 0l4 18 8 9-10 1q-12 12-25 0l-9-1 8-9Z"/><ellipse class="paper" cx="32" cy="37" rx="9" ry="12"/><path class="accent" d="m29 26 7 0-3 5Zm-8 26h10v5H18Zm13 0h10l3 5H34Z"/>',
  'maxim-tomato':'<circle cx="32" cy="34" r="20"/><path class="paper" d="m20 26 5-4 7 8 7-8 5 4v21h-5V31l-7 9-7-9v16h-5Z"/><path class="accent" d="m23 15 8-9 3 8 10-4-5 9Z"/>',
  'energy-drink':'<path d="M24 11h16v7l7 7v27H17V25l7-7Z"/><path class="cut" d="M24 18h16M19 31h26M19 45h26"/><path class="paper" d="m32 26-6 11h6l-3 10 12-16h-7l3-5Z"/>',
  'dream-one-up':'<circle cx="32" cy="32" r="22"/><path class="paper" d="m28 18-9 9 4 4 5-5v17h-8v5h24v-5h-8V18Z"/>',
  'friend-heart':'<path d="M32 52C-2 34 10 7 26 15l6 6 6-6c16-8 28 19-6 37Z"/>',
  'energy-sphere':'<circle cx="32" cy="32" r="21"/><circle class="paper" cx="32" cy="32" r="12"/><path class="accent" d="m32 20 4 8 9 2-7 7 1 9-7-4-7 4 1-9-7-7 9-2Z"/>',
  'sun-stone':'<path d="m32 5 6 10 11-1 1 11 9 7-9 7-1 11-11-1-6 10-6-10-11 1-1-11-9-7 9-7 1-11 11 1Z"/><circle class="paper" cx="32" cy="32" r="11"/>',
  'invincibility-candy':'<path d="m5 21 12 4 2 15-14 4 4-12Zm54 0-12 4-2 15 14 4-4-12Z"/><rect x="17" y="20" width="30" height="24" rx="7"/><path class="paper" d="m32 24 3 5 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1Z"/>',
  'rare-stone':'<path d="m20 10 26 5 10 18-17 22-29-13 2-22Z"/><path class="cut" d="m20 10 8 21 18-16M10 42l18-11 11 24M28 31l28 2"/>',
 };
 let body=symbols[item.id];
 if(kind==='assist'){
  const telescope=/wise|gadd|brigade/.test(item.id),healer=/tea|kabu|elline|ripple/.test(item.id);
  body='<path d="M8 14h22l2 4 2-4h22v38H34l-2 4-2-4H8Z"/><path class="cut" d="M32 20v28"/>'+(telescope?'<path class="paper" d="m16 32 23-12 6 10-23 12Z"/><path class="accent" d="M32 35v15l-5 5m5-20 7 20"/>':healer?'<path class="paper" d="M23 30h7v-7h7v7h7v7h-7v7h-7v-7h-7Z"/>':'<path class="paper" d="m32 22 4 8 9 2-7 6 1 9-7-4-7 4 1-9-7-6 9-2Z"/>');
 }
 body||=symbols['energy-sphere'];
 return `<svg class="supply-illustration ${cls} ${kind}" viewBox="0 0 64 64" role="img" aria-label="${escape(item.name)}"><g>${body}</g></svg>`;
}
export function supplyOrigin(item){return illustrations[item.id];}
