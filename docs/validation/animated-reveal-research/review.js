const cards=[
 {slug:'aoi-todo-1-4',name:'Aoi Todo — Are You Really Okay With That?',description:'Strong foreground streaks, glowing colour shifts and moving fragments sell the impact around a readable central pose. This is the active-effects reference you especially liked.'},
 {slug:'mahito-1-2',name:'Mahito — Unbridled Soul',description:'Small breathing and hand movement give the figure life. Moving smoke and drifting debris provide depth and atmosphere without needing a large change in pose.'},
 {slug:'yuta-okkotsu-1-1',name:'Yuta Okkotsu — Lend Me Your Power',description:'The sword’s light, the surrounding swirl and Rika’s motion support Yuta’s action. A companion can strengthen the hero’s identity when the composition makes their connection clear.'},
 {slug:'yuji-itadori-1-7',name:'Yuji Itadori — An Entrusted Life',description:'Your dramatic-clash reference. A strong confrontation, contrasting light and moving impact effects make a held moment feel active.'},
 {slug:'megumi-fushiguro-1-3',name:'Megumi Fushiguro — Incomplete Domain',description:'One of your simpler examples that still gives the character and surrounding domain a sense of life.'},
 {slug:'satoru-gojo-1-3',name:'Satoru Gojo — The Strongest Blue',description:'Your simpler Gojo reference: a clear character pose with enough movement and effects to feel alive.'},
 {slug:'satoru-gojo-1-6',name:'Satoru Gojo — Domain Expansion of 0.2 Seconds',description:'Your acceptable baseline example. It helps set the minimum level of movement, below the richer Todo and Mahito treatments.'},
];
const video=document.querySelector('#reference'),error=document.querySelector('#error');
let selected=0,generation=0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function play(){const attempt=video.play();attempt?.catch(()=>{error.hidden=false;error.textContent='Use the video’s Play control to view the animation.';});}
function select(index){const card=cards[index];if(!card)return;selected=index;generation++;video.pause();error.hidden=true;video.poster=card.slug+'.webp';video.src=card.slug+'.webm';video.setAttribute('aria-label',card.name+' animated card reference');document.querySelector('#card-title').textContent=card.name;document.querySelector('#observation').textContent=card.description;document.querySelector('#card-source').href='https://phantom-parade-database.vercel.app/characters/'+card.slug+'?lang=en&region=jp';document.querySelectorAll('[data-card]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.card)===index)));video.load();if(!reduced)play();}
for(const button of document.querySelectorAll('[data-card]'))button.onclick=()=>select(Number(button.dataset.card));
video.onerror=()=>{error.hidden=false;error.textContent='The video could not load. The poster and original reference link remain available.';};
video.addEventListener('playing',()=>{error.hidden=true;});
if(reduced){video.autoplay=false;video.pause();}else play();
let resume=false;
document.addEventListener('visibilitychange',()=>{if(document.hidden){resume=!video.paused;video.pause();}else if(resume&&!reduced){play();resume=false;}});
window.animatedResearch={entries:cards.length,select,get selected(){return selected;},get generation(){return generation;}};
