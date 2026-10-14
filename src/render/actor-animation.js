// Presentation follows the authoritative action. Finite poses hold their end
// frame; movement and explicitly continuous abilities may loop.
const ordinary={idle:'idle',moving:'move_forward','moving-back':'move_back',recovery:'idle',victory:'ultimate_entry',stone:'skill_or_secondary',staggered:'hurt',hidden:'idle'};
export function actorAnimation(actor,time,definition,{reducedMotion=false}={}){
  if(actor.hp<=0)return{state:'knockout',time:Math.max(0,time-(actor.defeatedAt??time))};
  if(!reducedMotion&&time-actor.hitAt<.14)return{state:'hurt',time:Math.max(0,time-actor.hitAt)};
  const action=actor.action;
  if(!action)return{state:ordinary[actor.state]||'idle',time};
  const elapsed=Math.max(0,time-action.start),progress=Math.min(1,elapsed/action.duration),kind=action.ability.kind||'basic';
  if(kind==='skill'&&actor.state==='rebound'&&definition?.clips.landing)return{state:'landing',progress:Math.max(0,(progress-.72)/.28)};
  if(kind==='ultimate')return{state:'ultimate_entry',time:elapsed,progress:definition?.loopClips?.includes('ultimate_entry')?undefined:progress};
  if(kind==='skill')return{state:'skill_or_secondary',time:elapsed,progress:definition?.loopClips?.includes('skill_or_secondary')?undefined:progress};
  if(['rise','fall','rebound'].includes(actor.state))return{state:definition?.clips.jump?'jump':'basic_resolve',progress};
  if(actor.state==='windup')return{state:'basic_windup',progress:Math.min(1,elapsed/Math.max(.01,action.marker))};
  const span=Math.max(.16,action.hits*.16);
  return{state:'basic_resolve',progress:Math.max(0,(elapsed-action.marker+.04)/span)};
}
