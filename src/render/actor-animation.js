// Presentation follows the authoritative action. Finite poses hold their end
// frame; movement and explicitly continuous abilities may loop.
const ordinary={idle:'idle',moving:'move_forward','moving-back':'move_back',recovery:'idle',victory:'ultimate_entry',stone:'skill_or_secondary',staggered:'hurt',hidden:'idle'};
export function actorAnimation(actor,time,definition,{reducedMotion=false}={}){
  if(actor.hp<=0)return{state:'knockout',time:Math.max(0,time-(actor.defeatedAt??time))};
  if(actor.counterAnswer&&definition?.clips.counter_exit)return{state:'counter_exit',progress:(time-actor.counterAnswer.start)/.18};
  if(time-actor.counterEnteredAt<.18&&definition?.clips.counter_entry)return{state:'counter_entry',progress:(time-actor.counterEnteredAt)/.18};
  if(!reducedMotion&&!actor.action&&time-actor.hitAt<.14)return{state:'hurt',time:Math.max(0,time-actor.hitAt)};
  const action=actor.action;
  if(!action)return{state:ordinary[actor.state]||'idle',time};
  const elapsed=Math.max(0,time-action.start),progress=Math.min(1,elapsed/action.duration),kind=action.ability.kind||'basic';
  if(action.ability.effects?.some(e=>e.type==='entry-stomp')&&elapsed<action.marker&&definition?.clips.jump)
    return{state:'jump',progress:elapsed/action.marker};
  if(action.finisherAt!==undefined&&definition?.clips.finisher)
    return{state:'finisher',progress:Math.min(1,(elapsed-action.finisherAt)/Math.max(.01,action.duration-action.finisherAt))};
  if(['shot','lob'].includes(action.ability.behavior)&&action.hits>1){
    const state=kind==='ultimate'?'ultimate_entry':kind==='skill'?'skill_or_secondary':'basic_resolve';
    const interval=action.hitInterval||.16,since=elapsed-action.marker,last=action.marker+(action.hits-1)*interval;
    // Repeat the source throw for each real release, holding the release pose
    // for a full simulation step. Hit flashes cannot replace the active pose.
    const progress=since<0?Math.min(.8,elapsed/action.marker):elapsed>=last?1:since%interval<1/30?1:(since%interval-1/30)/(interval-1/30);
    return{state,progress};
  }
  if(actor.state==='rebound'&&definition?.clips.landing)return{state:'landing',progress:Math.max(0,(elapsed-action.marker)/Math.max(.01,action.duration-action.marker))};
  if(action.ability.behavior==='stomp'){
    const state=kind==='ultimate'?'ultimate_entry':kind==='skill'?'skill_or_secondary':definition?.clips.jump?'jump':'basic_resolve';
    return{state,time:elapsed,progress:definition?.loopClips?.includes(state)?undefined:Math.min(1,elapsed/action.marker)};
  }
  if(kind==='ultimate')return{state:'ultimate_entry',time:elapsed,progress:definition?.loopClips?.includes('ultimate_entry')?undefined:progress};
  if(kind==='skill')return{state:'skill_or_secondary',time:elapsed,progress:definition?.loopClips?.includes('skill_or_secondary')?undefined:progress};
  if(['rise','fall','rebound'].includes(actor.state))return{state:definition?.clips.jump?'jump':'basic_resolve',progress:Math.min(1,elapsed/action.marker)};
  if(actor.state==='windup')return{state:'basic_windup',progress:Math.min(1,elapsed/Math.max(.01,action.marker))};
  const span=Math.max(.16,action.hits*(action.hitInterval||.16));
  return{state:'basic_resolve',time:elapsed,progress:definition?.loopClips?.includes('basic_resolve')?undefined:Math.max(0,(elapsed-action.marker+.04)/span)};
}
