import{createDededeScene}from'./scene.js';
const $=s=>document.querySelector(s),stage=$('#stage'),quote=$('#quote'),status=$('#status');
const reduced=$('#reduced'),preference=matchMedia('(prefers-reduced-motion: reduce)');
reduced.checked=preference.matches;
let scene=null,sound=false,audioContext=null,quoteAnimation=0,quoteStart=0,soundNodes=[];
const fanfare=new Audio('./assets/adventure-fanfare.mp3');fanfare.preload='none';fanfare.volume=.42;
function stopAudio(){fanfare.pause();fanfare.currentTime=0;for(const n of soundNodes){try{n.stop();}catch{}}soundNodes=[];}
function tone(frequency,duration,volume=.07,{end=frequency,type='sine',delay=0}={}){if(!sound||!audioContext)return;const o=audioContext.createOscillator(),gain=audioContext.createGain(),t=audioContext.currentTime+delay;o.type=type;o.frequency.setValueAtTime(frequency,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,end),t+duration);gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(volume,t+.012);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(gain);gain.connect(audioContext.destination);o.start(t);o.stop(t+duration+.02);soundNodes.push(o);o.onended=()=>{soundNodes=soundNodes.filter(n=>n!==o);o.disconnect();gain.disconnect();};}
function impactAudio(){tone(110,.38,.18,{end:28,type:'triangle'});tone(380,.17,.07,{end:65,type:'triangle'});if(sound)void fanfare.play().catch(()=>{status.textContent='Audio unavailable; the reveal continues.';});}
const fullQuote='“This here kingdom’s\ngot one king!”';
function stopQuote(){cancelAnimationFrame(quoteAnimation);quoteAnimation=0;}
function updateQuote(){const elapsed=scene.state.time-quoteStart;quote.textContent=reduced.checked?fullQuote:fullQuote.slice(0,Math.floor(elapsed/.045));if(scene.state.mode==='quote')quoteAnimation=requestAnimationFrame(updateQuote);}
function cue(event){
 if(['flight','hold','arrival','quote'].includes(event)){
  stage.classList.remove('is-hold','is-intro','is-arrival');stage.classList.add(event==='hold'?'is-hold':event==='arrival'?'is-arrival':'is-intro');
  $('#ceremony').hidden=event!=='flight'&&event!=='quote';$('.flight-caption').hidden=event!=='flight';$('#skip').hidden=event==='hold'||event==='arrival';
  $('#gesture').disabled=event!=='hold'&&event!=='arrival';
 }
 if(event==='flight'){stopAudio();stopQuote();quote.textContent='';$('#pause').setAttribute('aria-pressed','false');$('#pause').textContent='Pause';stage.classList.remove('is-paused');tone(440,2.4,.045,{end:990});tone(659,1.8,.025,{end:1320,delay:.5});status.textContent='Warp Star → quote → landing → SSR identity.';}
 if(event==='quote'){stopQuote();quoteStart=scene.state.time;quote.textContent='';updateQuote();}
 if(event==='arrival'){stopQuote();quote.textContent='';if(!reduced.checked)$('#flash').animate([{opacity:.72},{opacity:0}],{duration:340,easing:'ease-out'});}
 if(event==='impact')impactAudio();
 if(event==='hold'){stopQuote();status.textContent='Held artwork · ambient animation loops until paused.';}
 if(event==='hidden'||event==='paused')stopAudio();
}
$('#replay').onclick=()=>{scene.play();};
$('#gesture').onclick=()=>{scene.gesture();$('#pause').textContent='Pause';$('#pause').setAttribute('aria-pressed','false');stage.classList.remove('is-paused');tone(240,.3,.04,{end:480,delay:1.05});status.textContent='Separate hammer and arm; face and body remain stable.';};
$('#skip').onclick=()=>{stopQuote();stopAudio();scene.skip();};
$('#pause').onclick=()=>{const value=!scene.state.paused;scene.setPaused(value);$('#pause').textContent=value?'Resume':'Pause';$('#pause').setAttribute('aria-pressed',String(value));stage.classList.toggle('is-paused',value);};
$('#sound').onclick=async()=>{sound=!sound;$('#sound').textContent=sound?'Sound on':'Sound off';$('#sound').setAttribute('aria-pressed',String(sound));if(sound){try{audioContext??=new(window.AudioContext||window.webkitAudioContext)();await audioContext.resume();tone(659,.15,.035);}catch{sound=false;$('#sound').textContent='Sound unavailable';}}else stopAudio();};
reduced.onchange=()=>{scene?.setReduced(reduced.checked);stage.classList.toggle('reduced',reduced.checked);};
const onPreference=event=>{reduced.checked=event.matches;reduced.onchange();};preference.addEventListener('change',onPreference);
$('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{status.textContent='Fullscreen is unavailable in this browser.';}};
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!document.fullscreenElement&&scene){stopQuote();stopAudio();scene.skip();}if(event.code==='Space'&&event.target===document.body){event.preventDefault();$('#pause').click();}});
try{
 scene=await createDededeScene($('#scene'));scene.onCue(cue);reduced.onchange();$('#loading').hidden=true;for(const id of['replay','gesture','pause'])$('#'+id).disabled=false;
 window.dededeReview={get state(){return scene.state;},get audio(){return{enabled:sound,fanfarePaused:fanfare.paused,activeTones:soundNodes.length};},seek:(time,options)=>scene.seek(time,options),play:()=>scene.play(),skip:()=>scene.skip(),dispose:()=>scene.dispose()};
 status.textContent='Ready · try the full reveal, then the hammer flourish.';
}catch(error){$('#loading').textContent='The artwork could not load. Please reload to retry.';status.textContent=error.message;window.dededeReview={error:error.message};}
window.addEventListener('pagehide',()=>{stopQuote();stopAudio();scene?.dispose();void audioContext?.close();preference.removeEventListener('change',onPreference);},{once:true});
