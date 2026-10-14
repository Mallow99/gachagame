let context;
const clips=new Map();
const revealTones=new Set();
const buses=new Map();let master,profile={muted:true,audio:{music:.5,voice:.7,sfx:.7}};
export function syncAudio(next){
  profile=next;
  if(context&&master){master.gain.setValueAtTime(next.muted?0:1,context.currentTime);for(const [kind,bus]of buses)bus.gain.setValueAtTime(next.audio[kind],context.currentTime);}
  for(const {clip,channel} of clips.values()){clip.muted=next.muted;clip.volume=next.audio[channel];if(next.muted)clip.pause();}
}
export function unlockAudio(){const Constructor=window.AudioContext||window.webkitAudioContext;if(!Constructor)return;try{if(!context){context=new Constructor();if(context.createGain){master=context.createGain();master.connect(context.destination);for(const kind of ['music','voice','sfx']){const bus=context.createGain();bus.connect(master);buses.set(kind,bus);}syncAudio(profile);}}if(context.state==='suspended')context.resume().catch(()=>{});}catch{}}
export function tone(note,duration=0.12,volume=0.05,type='triangle',delay=0,channel='sfx',scope=null){
  if(!context)return;const osc=context.createOscillator(),gain=context.createGain(),t=context.currentTime+delay;
  osc.type=type;osc.frequency.value=440*2**((note-69)/12);gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(volume,t+0.008);gain.gain.exponentialRampToValueAtTime(0.001,t+duration);
  osc.connect(gain);gain.connect(buses.get(channel)||context.destination);
  if(scope==='reveal')revealTones.add(osc);
  osc.onended=()=>{revealTones.delete(osc);osc.disconnect();gain.disconnect();};
  osc.start(t);osc.stop(t+duration+0.03);
}
export function chime(profile,rarity='R',scope=null){
  if(profile.muted)return;syncAudio(profile);unlockAudio();const v=0.15;
  const notes=rarity==='SSR'?[48,60,64,67,72,76,79]:rarity==='SR'?[60,63,67,72]:[64,67,72];
  notes.forEach((n,i)=>tone(n,0.35,v,'triangle',i*0.065,'sfx',scope));
}
export function sting(profile,sagaId){
  if(profile.muted)return;syncAudio(profile);unlockAudio();const notes=sagaId==='mario'?[64,64,64,60,64,67,55]:[72,76,79,81,79,76,74,72];
  notes.forEach((n,i)=>tone(n,0.2,0.1,'square',i*0.17,'music','reveal'));
}
function playAsset(next,url,channel){
  if(next.muted||typeof Audio==='undefined')return;
  syncAudio(next);unlockAudio();
  let record=clips.get(url);if(!record){record={clip:new Audio(url),channel};clips.set(url,record);}
  record.clip.muted=false;record.clip.volume=next.audio[channel];record.clip.currentTime=0;
  record.clip.play().catch(()=>{});
}
export function revealChime(next,sagaId,rarity='R'){
  if(sagaId==='mario')playAsset(next,`demos/mario-pull/${rarity==='R'?'coin':'powerup'}.mp3`,'sfx');
  else chime(next,rarity,'reveal');
}
export function revealTheme(next,sagaId){
  if(sagaId==='mario')playAsset(next,'demos/mario-pull/mus-starman.mp3','music');
  else sting(next,sagaId);
}
export function stopRevealAudio(){
  for(const {clip}of clips.values()){clip.pause();clip.currentTime=0;}
  for(const osc of revealTones){try{osc.stop();}catch{}}
  revealTones.clear();
}
export function voice(profile,id){
  if(profile.muted||id!=='classic-mario')return;
  playAsset(profile,'demos/mario-pull/letsago.mp3','voice');
}
export function battleSound(profile,event){
  if(profile.muted||!context)return;
  if(event.type==='ultimate')chime(profile,'SR');
  else if(event.type==='damage'&&event.sequence%3===0)tone(event.values.crit?74:48,0.045,0.035,'square');
  else if(event.type==='heal')tone(76,0.12,0.035);
}
