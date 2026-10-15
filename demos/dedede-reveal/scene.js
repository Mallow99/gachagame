// Small authored 2D rig: original unmodified art + runtime masks. No mesh warp,
// no external rendering library, no account data. Coordinates use the source's
// original 899 × 864 grid, so the hand/hammer grip cannot drift apart.
const W=1600,H=900;
const armPath='M550 0H899V540H760L750 555 720 575 680 575 650 560 625 535 610 500 600 430 600 360 585 300 550 200Z';
// The foreground head/hat mask restores the clean original overlap where the
// upright hammer passes behind his hat. The robe underlay closes the shoulder.
const headPath='M285 302 315 247 349 216 375 194 404 176 426 142 453 121 479 126 492 114 526 118 545 135 551 153 551 175 573 200 594 231 606 263 615 300 613 330 605 350 610 390 603 428 590 466 575 512 553 548 513 573 454 582 394 570 363 541 340 504 324 467 311 424 294 384Z';
const image=src=>new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>i.decode().then(()=>resolve(i),reject);i.onerror=()=>reject(Error('Could not load '+src.split('/').at(-1)));i.src=src;});
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=x=>1-(1-clamp(x))**3;
function surface(w=W,h=H){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function star(c,x,y,r,rotation=0){c.beginPath();for(let j=0;j<10;j++){const a=rotation-Math.PI/2+j*Math.PI/5,q=j%2?r*.43:r;c.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q);}c.closePath();}
export async function createDededeScene(canvas){
 const [source,background]=await Promise.all([image('./assets/dedede-adventure.png'),image('./assets/fountain.svg')]);
 const body=surface(899,864),arm=surface(899,864),head=surface(899,864);
 const b=body.getContext('2d'),a=arm.getContext('2d'),h=head.getContext('2d');
 // Full original body, with the weapon-arm removed only once during intake.
 b.drawImage(source,0,0);b.globalCompositeOperation='destination-out';b.fill(new Path2D(armPath));b.globalCompositeOperation='source-over';
 // This painted robe patch is hidden by the neutral arm and visible only at
 // the few-degree extreme. It adds concealed material, rather than stretching.
 b.save();b.globalCompositeOperation='destination-over';b.fillStyle='#e60012';b.strokeStyle='#040000';b.lineWidth=13;b.beginPath();b.moveTo(603,353);b.bezierCurveTo(695,342,751,436,743,531);b.bezierCurveTo(735,582,693,631,618,628);b.lineTo(552,520);b.closePath();b.fill();b.stroke();b.restore();
 a.save();a.clip(new Path2D(armPath));a.drawImage(source,0,0);a.restore();a.globalCompositeOperation='destination-out';a.fill(new Path2D(headPath));a.globalCompositeOperation='source-over';
 // Complete the hammer's concealed left side. Rotating a cutout without this
 // material would expose the head-shaped notch left by the source overlap.
 a.save();a.globalCompositeOperation='destination-over';a.fillStyle='#e60012';a.strokeStyle='#040000';a.lineWidth=12;a.beginPath();a.moveTo(584,100);a.bezierCurveTo(554,174,561,282,610,344);a.bezierCurveTo(634,376,668,390,706,390);a.lineTo(744,286);a.lineTo(674,143);a.closePath();a.fill();a.stroke();a.restore();
 h.save();h.clip(new Path2D(headPath));h.drawImage(source,0,0);h.restore();
 // Match the cool spring / warm starlight with a restrained alpha-clipped
 // lighting pass. Original outlines, facial features and dimensions survive.
 for(const layer of[body,arm,head]){const g=layer.getContext('2d');g.save();g.globalCompositeOperation='source-atop';const shade=g.createLinearGradient(120,830,780,70);shade.addColorStop(0,'#10185850');shade.addColorStop(.55,'#27234e0a');shade.addColorStop(1,'#ffe5bd0c');g.fillStyle=shade;g.fillRect(0,0,899,864);g.restore();}
 // A precomposed source layer is available for reduced motion and failure
 // recovery. Each held frame changes only rigid transforms and scene light.
 const c=canvas.getContext('2d',{alpha:false}),sky=surface();sky.getContext('2d').drawImage(background,0,0,W,H);
 let time=0,last=null,raf=0,paused=false,reduced=false,visible=!document.hidden,disposed=false;
 let mode='hold',introStart=0,arrivalStart=-10,gestureStart=-10,nextGesture=2.6,onCue=()=>{},impactSent=false;
 const particles=Array.from({length:36},(_,i)=>({x:(i*197.3+43)%W,y:(i*139.1+17)%H,r:1.2+(i%4)*.65,s:11+i%5*4,phase:i*1.7}));
 function setMode(next){mode=next;onCue(next);}
 function getGesture(){const age=time-gestureStart;if(age<0||age>3.2)return 0;if(age<1.1)return -9*ease(age/1.1);if(age<1.55)return -9+20*ease((age-1.1)/.45);return 11*(1-ease((age-1.55)/1.65));}
 function water(t){c.save();c.globalAlpha=.18;for(let k=0;k<5;k++){const q=(t*.22+k/5)%1;c.strokeStyle=k%2?'#ffe7c7':'#b6e2ff';c.lineWidth=1.6;c.globalAlpha=(1-q)*.24;c.beginPath();c.ellipse(803,587,90+q*375,10+q*65,0,0,Math.PI*2);c.stroke();}c.restore();}
 function motes(t,front=false){c.save();for(const p of particles){if((p.r>2.4)!==front)continue;const x=p.x+Math.sin(t*.25+p.phase)*22,y=(p.y-t*p.s%H+H)%H,alpha=.15+.25*(.5+.5*Math.sin(t+p.phase));c.globalAlpha=alpha;c.fillStyle=front?'#ffe5a0':'#c8ccf9';if(front){star(c,x,y,p.r*2.8,p.phase+t*.16);c.fill();}else{c.beginPath();c.arc(x,y,p.r,0,Math.PI*2);c.fill();}}c.restore();}
 function impact(age){if(age<0||age>2.7||reduced)return;const p=age/2.7;c.save();c.globalCompositeOperation='screen';for(let j=0;j<3;j++){const v=clamp((age-j*.13)/1.5);c.globalAlpha=(1-v)*.6;c.strokeStyle=j===0?'#fff5ca':'#e9b562';c.lineWidth=(1-v)*7+1;c.beginPath();c.ellipse(1094,777,60+v*680,10+v*102,0,0,Math.PI*2);c.stroke();}for(let k=0;k<20;k++){const side=k%2?-1:1,speed=100+k%6*45,dx=side*speed*p,dy=-Math.sin(p*Math.PI)*(32+k%5*20);c.globalAlpha=(1-p)*.75;c.fillStyle=k%3?'#f9c777':'#d7c7e1';star(c,1090+dx,773+dy,(1-p)*(5+k%4*3),k+p*3);c.fill();}c.restore();}
 function hero(t,age){
  const land=age>=0&&age<.5?Math.sin(age/.5*Math.PI)*5:0,drop=age>=0&&age<.24?50*(1-ease(age/.24)):0;
  const s=.78,heroX=1095,heroY=780+land-drop,originX=449,originY=850;
  const gentle=reduced?0:Math.sin(t*1.45)*.6,angle=reduced?0:(Math.sin(t*.88)*1.5+getGesture());
  // Foot shadow stays on the floor even during the arrival.
  c.save();c.fillStyle='#100e2f';c.globalAlpha=.36;c.filter='blur(10px)';c.beginPath();c.ellipse(heroX,781,290,26,0,0,Math.PI*2);c.fill();c.restore();
  c.save();c.translate(heroX,heroY);c.scale(s,s);c.translate(-originX,-originY);
  // One pixel of upper-body drift at source size, with no changing width or
  // height. The feet never scale or squash.
  c.translate(0,gentle);c.drawImage(body,0,0);
  c.save();c.translate(649,476);c.rotate(angle*Math.PI/180);c.translate(-649,-476);c.drawImage(arm,0,0);c.restore();
  // Head stays in front of the hammer at every allowed rotation.
  c.drawImage(head,0,0);
  // Soft environmental tint, clipped to the original silhouette. Only light
  // changes: the blue hands, robe pattern and face keep their source pixels.
  c.restore();
  const ga=time-gestureStart;
  if(ga>1.08&&ga<2.6&&!reduced){c.save();const k=clamp((ga-1.08)/1.52);c.globalCompositeOperation='screen';c.globalAlpha=(1-k)*.55;c.strokeStyle='#ffe3a2';c.lineWidth=4*(1-k);c.beginPath();c.ellipse(1260,227,130,181,-.35,-2.4,-.4+k*1.9);c.stroke();for(let i=0;i<8;i++){const a=-2.4+i*.25+k*.7;star(c,1260+Math.cos(a)*135,227+Math.sin(a)*185,3+(i%3),a);c.fillStyle='#ffe4a5';c.fill();}c.restore();}
 }
 function scene(t,age){
  c.drawImage(sky,0,0);water(t);motes(t);
  // A quiet moving wash ties foreground character and the painted spring to
  // the same light. Screen blending never distorts the character.
  const light=c.createRadialGradient(1240+Math.sin(t*.2)*50,220,15,1130,460,650);light.addColorStop(0,'#e8b77924');light.addColorStop(.5,'#b3b8e710');light.addColorStop(1,'#c6bbd000');c.fillStyle=light;c.fillRect(0,0,W,H);
  hero(t,age);impact(age-.22);motes(t,true);
  const vignette=c.createRadialGradient(960,400,220,830,440,960);vignette.addColorStop(.42,'#06091900');vignette.addColorStop(1,'#090d2f9c');c.fillStyle=vignette;c.fillRect(0,0,W,H);
 }
 function flight(age){
  c.fillStyle='#0c0c25';c.fillRect(0,0,W,H);const grad=c.createLinearGradient(0,0,0,H);grad.addColorStop(0,'#14153d');grad.addColorStop(1,'#33285a');c.fillStyle=grad;c.fillRect(0,0,W,H);
  c.save();for(let i=0;i<75;i++){const x=(i*217+age*(65+i%7*15))%W,y=(i*137)%H;c.fillStyle=i%5?'#cdd0f28f':'#ffe8af';c.beginPath();c.arc(x,y,1+i%3*.5,0,Math.PI*2);c.fill();}c.restore();
  const p=ease(age/3.05),x=1330-p*760,y=100+p*380,r=20+8*p;
  c.save();const tail=c.createLinearGradient(x,y,x+450,y-240);tail.addColorStop(0,age>2.1?'#ffe197':'#c5dcff');tail.addColorStop(.3,age>1.3?'#a28ee876':'#95caff55');tail.addColorStop(1,'#aaaaff00');c.fillStyle=tail;c.beginPath();c.moveTo(x-20,y+9);c.lineTo(x+490,y-250);c.lineTo(x+53,y+3);c.closePath();c.fill();c.shadowColor=age>2.1?'#ffe2a0':'#9fb5ff';c.shadowBlur=45;c.fillStyle=age>2.1?'#ffeeb3':'#eef5ff';star(c,x,y,r,age*.5);c.fill();c.restore();
 }
 function draw(){
  if(disposed)return;
  if(mode==='hold'&&!reduced&&time>=nextGesture&&time-gestureStart>3.2){gestureStart=time;nextGesture=time+10.6;}
  if(mode==='flight'){const age=time-introStart;if(age>=3.3){setMode('quote');}else{flight(reduced?0:age);return;}}
  if(mode==='quote'){c.fillStyle='#05050a';c.fillRect(0,0,W,H);if(time-introStart>=6.3){arrivalStart=time;impactSent=false;setMode('arrival');}else return;}
  const age=time-arrivalStart;
  scene(reduced?0:time,age);
  if(mode==='arrival'&&!impactSent&&age>=.22){impactSent=true;onCue('impact');}
  if(mode==='arrival'&&age>2.5)setMode('hold');
 }
 function tick(stamp){raf=0;if(disposed||paused||!visible)return;if(last===null)last=stamp;const dt=Math.min((stamp-last)/1000,.08);if(dt>=1/32){time+=dt;last=stamp;draw();}raf=requestAnimationFrame(tick);}
 function startLoop(){if(!disposed&&!paused&&visible&&!raf){last=null;raf=requestAnimationFrame(tick);}}
 function stopLoop(){cancelAnimationFrame(raf);raf=0;last=null;}
 const onVisibility=()=>{visible=!document.hidden;if(visible)startLoop();else{stopLoop();onCue('hidden');}};document.addEventListener('visibilitychange',onVisibility);
 draw();startLoop();
 return{
  get state(){return{mode,time,paused,reduced,ready:true,layerCount:3,width:W,height:H,gestureAngle:getGesture()};},
  onCue(fn){onCue=fn;},
  play(){paused=false;mode='flight';introStart=time;arrivalStart=-10;gestureStart=-10;impactSent=false;onCue('flight');draw();startLoop();},
  skip(){arrivalStart=-10;setMode('hold');draw();},
  gesture(){if(mode!=='hold'&&mode!=='arrival')return;gestureStart=time;nextGesture=time+10.6;paused=false;startLoop();},
  setPaused(value){paused=value;if(paused){stopLoop();onCue('paused');}else startLoop();},
  setReduced(value){reduced=value;if(value){gestureStart=-10;if(mode==='arrival'){mode='hold';onCue('hold');}}draw();},
  seek(value,{phase='hold',arrivalAge=10,gestureAge=-10}={}){time=value;mode=phase;arrivalStart=time-arrivalAge;gestureStart=gestureAge<0?-10:time-gestureAge;draw();},
  dispose(){disposed=true;stopLoop();document.removeEventListener('visibilitychange',onVisibility);source.src='';background.src='';body.width=arm.width=head.width=sky.width=0;}
 };
}
