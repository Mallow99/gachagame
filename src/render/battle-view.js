import { COPY_PROFILES } from '../content/opening-roster.js';
import { SpriteBank } from './sprite-bank.js';
const colors={R:'#82b9ef',SR:'#ad82ed',SSR:'#edbf5b',UR:'#eb8ce1'};
const stateClip={idle:'idle',moving:'move_forward','moving-back':'move_back',rise:'basic_resolve',fall:'basic_resolve',rebound:'basic_resolve',windup:'basic_windup',resolve:'basic_resolve',
  cast:'skill_or_secondary',charge:'move_forward',recovery:'idle',victory:'ultimate_entry',knockout:'knockout',stone:'skill_or_secondary',staggered:'hurt',hidden:'idle'};
export class BattleView {
  constructor(canvas,{transparent=false,reducedMotion=()=>false,onEvent=()=>{}}={}){
    this.canvas=canvas;this.ctx=canvas.getContext('2d');this.transparent=transparent;this.bank=new SpriteBank();this.fx=[];this.lastSequence=0;this.reducedMotion=reducedMotion;this.onEvent=onEvent;
    this.lastRun=null;this.ready=this.bank.ready;this.sceneImages=new Map();this.hitRects=[];
  }
  sceneImage(url){if(!this.sceneImages.has(url)){const im=new Image();im.src=url;this.sceneImages.set(url,im);}return this.sceneImages.get(url);}
  resize(){const r=this.canvas.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);if(this.canvas.width!==Math.round(r.width*dpr)||this.canvas.height!==Math.round(r.height*dpr)){
    this.canvas.width=Math.round(r.width*dpr);this.canvas.height=Math.round(r.height*dpr);}return{width:r.width,height:r.height,dpr};}
  draw(battle,preview=[]){
    const {width:w,height:h,dpr}=this.resize(),ctx=this.ctx;if(!w||!h)return;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.imageSmoothingEnabled=false;
    const scene=battle?.encounter?.environment.sceneId||'smb1-overworld-day',dream=scene.startsWith('ka-'),time=battle?.time||performance.now()/1000;
    if(!this.transparent)this.background(ctx,w,h,scene,time);
    const ground=h-(this.transparent?15:30),viewWidth=w<650?600:1000,sx=w/viewWidth;
    const actors=battle?.actors||preview;this.hitRects=[];
    let center=500;if(w<650&&battle){const living=actors.filter(a=>a.hp>0&&a.hero);center=living.length?living.reduce((n,a)=>n+a.x,0)/living.length+110:500;center=Math.max(viewWidth/2,Math.min(1000-viewWidth/2,center));}
    const offset=center-viewWidth/2,xpos=x=>(x-offset)*sx;
    if(battle?.runId!==this.lastRun){this.lastRun=battle?.runId;this.lastSequence=0;this.fx=[];}
    for(const event of battle?.events||[])if(event.sequence>this.lastSequence){this.consume(event,event.atMs/1000,actors);this.lastSequence=event.sequence;this.onEvent(event);}
    for(const f of this.fx)if(f.type==='telegraph'&&f.until>time){ctx.strokeStyle='#e8673c';ctx.lineWidth=2;ctx.setLineDash([4,3]);ctx.beginPath();ctx.ellipse(xpos(f.x),ground-2,f.radius*sx,7,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#c94c31';ctx.font='bold 10px system-ui';ctx.textAlign='center';ctx.fillText('!',xpos(f.x),ground-15);}
    for(const a of [...actors].sort((a,b)=>Number(b.boss)-Number(a.boss)||a.x-b.x)){
      const x=xpos(a.x),base=ground,y=base-a.y*(this.transparent?0.82:1),age=time-(a.defeatedAt??time);
      if(a.hp<=0&&age>1.1&&!a.hero)continue;
      const bodyHeight=a.boss?(a.spriteKey==='whispy'?Math.min(140,h-40):a.spriteKey==='nightmare'?100:78):a.definition?.traits?.includes('heavy')?52:a.hero?42:31;
      const size=bodyHeight*(w>650?Math.min(1.25,sx):0.9);
      if(a.hero&&a.hp>0)this.hitRects.push({id:a.id,x:x-size*.55,y:y-size-14,width:size*1.1,height:size+17,name:a.name,hp:a.hp,maxHp:a.maxHp});
      ctx.fillStyle='rgba(31,31,36,.19)';ctx.beginPath();ctx.ellipse(x,base-2,Math.max(10,size*.32)*(1-a.y/220),3,0,0,Math.PI*2);ctx.fill();
      if(a.hidden){ctx.fillStyle='#4a895c';ctx.fillRect(x-16,base-22,32,22);ctx.fillStyle='#83ba79';ctx.fillRect(x-20,base-25,40,7);continue;}
      const key=a.encounterLoan?a.spriteKey:COPY_PROFILES[a.copy]?.spriteKey||a.spriteKey;
      const flattened=a.hp<=0&&(a.id==='goomba'||a.definition?.size==='small');
      const hit=time-a.hitAt<0.14;
      const state=a.hp<=0?'knockout':hit&&!this.reducedMotion()?'hurt':a.action?.ability.kind==='ultimate'&&['rise','fall','rebound'].includes(a.state)?'ultimate_entry':a.copy&&a.action?(a.action.ability.kind==='skill'?'skill_or_secondary':'basic_resolve'):stateClip[a.state]||'idle';
      const squashed=a.squashUntil>time&&!this.reducedMotion();
      this.bank.draw(ctx,key,x,y,size,{state,time:a.action?time-a.action.start:time, direction:a.direction,scaleY:flattened?0.22:squashed?.65:1,scaleX:flattened?1.28:squashed?1.18:1,
        alpha:a.hp<=0?Math.max(0,1-age):a.vanishUntil>time?.08:1,rotation:a.hp<=0&&!flattened?Math.min(1,age)*1.4:0,
        tint:hit&&!this.reducedMotion()?'brightness(1.8)':a.definition?.treatment==='game-boy'?'grayscale(1) sepia(.6) hue-rotate(45deg)':null});
      if(a.hero&&a.hp>0){const bar=32,top=y-size-11;ctx.fillStyle='rgba(24,26,27,.7)';ctx.fillRect(x-bar/2,top,bar,4);ctx.fillStyle='#79b780';ctx.fillRect(x-bar/2,top,bar*a.hp/a.maxHp,4);
        ctx.fillStyle='#323743';ctx.fillRect(x-bar/2,top+6,bar,3);ctx.fillStyle='#ede1aa';ctx.fillRect(x-bar/2,top+6,bar*Math.max(0,Math.min(1,a.action?1:1-a.readyIn/a.maxReady)),3);
        ctx.fillStyle='#647694';ctx.fillRect(x-bar/2,top+11,bar*(a.energy||0)/100,2);
        if(a.copy||a.encounterLoan){ctx.fillStyle='#394333';ctx.font='bold 9px system-ui';ctx.textAlign='center';ctx.fillText(a.encounterLoan?'STAR ROD':a.copy.toUpperCase(),x,top-3);}
      }
      if(!a.hero&&!a.boss&&a.hp>0){const top=y-size-8;ctx.fillStyle='#343740aa';ctx.fillRect(x-12,top,24,3);ctx.fillStyle='#d1a085';ctx.fillRect(x-12,top,24*a.hp/a.maxHp,3);ctx.fillStyle='#afbea8';ctx.fillRect(x-12,top+5,24*Math.max(0,Math.min(1,a.action?1:1-a.readyIn/a.maxReady)),2);}
      if(a.boss&&a.hp>0){const bar=Math.min(150,w*.45);ctx.fillStyle='#271f30';ctx.fillRect(x-bar/2,y-size-14,bar,5);ctx.fillStyle='#ba5647';ctx.fillRect(x-bar/2,y-size-14,bar*a.hp/a.maxHp,5);ctx.fillStyle='#e4c878';ctx.fillRect(x-bar/2,y-size-6,bar*(a.stagger||0)/100,2);ctx.fillStyle='#9fb8ad';ctx.fillRect(x-bar/2,y-size-3,bar*Math.max(0,Math.min(1,a.action?1:1-a.readyIn/a.maxReady)),2);}
      if(a.action){const elapsed=time-a.action.start,ability=a.action.ability;if(ability.behavior==='beam'&&elapsed>0.45&&elapsed<a.action.duration){ctx.strokeStyle=dream?'#f6cc79':'#f59548';ctx.lineWidth=7*(ability.areaScale||1);ctx.globalAlpha=0.6;ctx.beginPath();ctx.moveTo(x,y-size*.5);ctx.lineTo(xpos(a.action.to),y-size*.5+3);ctx.stroke();ctx.globalAlpha=1;}
        if(ability.effects?.some(e=>e.type==='inhale')&&elapsed<0.8){ctx.strokeStyle='#9ac9b8';ctx.lineWidth=1;for(let i=0;i<4;i++){const end=xpos(a.action.to),fraction=(elapsed*2+i*.25)%1;ctx.beginPath();ctx.moveTo(x+(end-x)*fraction,y-18+i*3);ctx.lineTo(x+(end-x)*(fraction+.08),y-18+i*3);ctx.stroke();}}
        if(ability.behavior==='combo'&&elapsed>0.2){ctx.strokeStyle=dream?'#ead078':'#f3b171';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x+a.direction*18,y-20,17,-1.2,1.2);ctx.stroke();}
      }
      if(a.shield>0){ctx.strokeStyle='#7d9fcc';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(x,y-size*.45,size*.48,size*.6,0,0,Math.PI*2);ctx.stroke();}
      if(a.encounterLoan==='star-rod')this.bank.draw(ctx,'star-rod',x+a.direction*16,y-12,27,{time,direction:a.direction});
      if(a.statuses?.burn){ctx.fillStyle='#e98047';ctx.fillRect(x-2,y-5,4,6);}if(a.statuses?.slow){ctx.fillStyle='#77bfe3';ctx.fillRect(x-8,y-3,16,2);}
    }
    for(const p of battle?.projectiles||[]){const x=xpos(p.x),y=ground-p.y-10;ctx.save();ctx.translate(x,y);ctx.rotate(p.kind.includes('spear')?p.to<p.from?Math.PI:0:time*(p.kind.includes('hammer')?9:3));
      ctx.fillStyle=p.hero?'#eac97b':'#e89462';if(p.kind.includes('hammer')){ctx.fillRect(-3,-4,3,12);ctx.fillRect(-7,-8,12,6);}
      else if(p.kind.includes('bomb')||p.kind==='poppy'){ctx.fillStyle='#323443';ctx.beginPath();ctx.arc(0,0,6,0,Math.PI*2);ctx.fill();ctx.fillStyle='#eecb73';ctx.fillRect(3,-8,2,4);}
      else if(p.kind.includes('spear')){if(!this.bank.draw(ctx,'bandana-spear',0,4,8,{time,direction:1})){ctx.fillStyle='#b99b65';ctx.fillRect(-10,-1,17,2);ctx.fillStyle='#d8e2de';ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(4,-4);ctx.lineTo(4,4);ctx.closePath();ctx.fill();}}
      else if(p.kind==='parcel'){ctx.fillStyle='#dcba7c';ctx.fillRect(-6,-5,12,10);ctx.fillStyle='#bb624b';ctx.fillRect(-1,-5,2,10);ctx.fillRect(-6,-1,12,2);}
      else if(p.kind==='apple'){ctx.fillStyle='#d87555';ctx.beginPath();ctx.arc(0,0,6,0,Math.PI*2);ctx.fill();ctx.fillStyle='#77aa60';ctx.fillRect(1,-8,4,3);}
      else if(p.kind.includes('cutter')){ctx.strokeStyle='#e4c971';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,7,0,3.7);ctx.stroke();}
      else if(p.kind.includes('star')||p.kind==='shot')this.star(ctx,0,0,7);
      else {ctx.beginPath();ctx.arc(0,0,5,0,Math.PI*2);ctx.fill();}ctx.restore();}
    for(const shell of battle?.shells||[])this.bank.draw(ctx,'koopa',xpos(shell.x),ground,24,{state:'skill_or_secondary',time,rotation:shell.kicked?time*10:0});
    this.fx=this.fx.filter(f=>time-f.start<(f.life||1.2));
    for(const f of this.fx){const age=time-f.start,x=xpos(f.x),y=ground-(f.y||30)-age*22;if(f.type==='number'){
      ctx.globalAlpha=Math.max(0,1-age/1.2);ctx.fillStyle=f.color;ctx.strokeStyle='rgba(20,22,24,.8)';ctx.lineWidth=2;ctx.textAlign='center';ctx.font=`${f.crit?'bold 16px':'bold 12px'} system-ui`;ctx.strokeText(f.text,x,y);ctx.fillText(f.text,x,y);ctx.globalAlpha=1;
    }else if(f.type==='ultimate'&&f.rarity==='SSR'){
      const enter=this.reducedMotion()?1:Math.min(1,age/.2),left=w*.5-130-(1-enter)*50;
      ctx.globalAlpha=Math.max(0,1-Math.max(0,age-1.5)*2);ctx.fillStyle='#2a2537';ctx.fillRect(left,30,260*enter,47);ctx.fillStyle='#e8be66';ctx.fillRect(left,30,3,47);
      this.bank.draw(ctx,f.spriteKey,left+28,77,54,{state:'ultimate_entry',time,direction:1});ctx.fillStyle='#e8be66';ctx.font='bold 10px system-ui';ctx.textAlign='left';ctx.fillText('SSR  /  ULTIMATE',left+57,47);ctx.fillStyle='#fff1d7';ctx.font='bold 12px system-ui';ctx.fillText(f.text,left+57,66);ctx.globalAlpha=1;
    }else if(f.type==='ultimate'||f.type==='assist'||f.type==='boss-phase'){
      ctx.globalAlpha=Math.max(0,1-age/2);ctx.fillStyle=f.type==='assist'?'#314a47':'#342838';const text=f.text;ctx.font='bold 13px system-ui';const len=ctx.measureText(text).width;ctx.fillRect(w/2-len/2-14,34,len+28,26);ctx.fillStyle='#f2dfb3';ctx.textAlign='center';ctx.fillText(text,w/2,52);ctx.globalAlpha=1;
    }}
  }
  consume(event,time,actors){const v=event.values,actor=actors.find(a=>a.uid===event.targetId);
    if(event.type==='damage'||event.type==='heal'){
      const previous=this.fx.findLast(f=>f.type==='number'&&f.op===event.type&&f.target===event.targetId&&time-f.latest<.25),amount=event.type==='heal'?v.amount:v.final;
      if(previous){previous.amount+=amount;previous.latest=time;previous.text=(event.type==='heal'?'+':'')+previous.amount;previous.crit||=v.crit;if(v.crit)previous.color='#f2ce71';}
      else this.fx.push({type:'number',op:event.type,start:time,latest:time,amount,x:actor?.x||v.x||500,y:46,text:event.type==='heal'?'+'+v.amount:String(v.final),color:event.type==='heal'?'#94d7a4':v.crit?'#f2ce71':'#fbf2db',crit:v.crit,target:event.targetId});
    }
    if(event.type==='telegraph')this.fx.push({type:'telegraph',start:time,life:Math.max(1,v.until-time),...v});
    if(event.type==='ultimate')this.fx.push({type:'ultimate',start:time,life:2,text:v.name.toUpperCase(),x:500,rarity:v.rarity,spriteKey:v.spriteKey});
    if(event.type==='assist')this.fx.push({type:'assist',start:time,life:2,text:v.name+' · ASSIST',x:500});
    if(event.type==='boss-phase')this.fx.push({type:'boss-phase',start:time,life:2,text:v.phase.replaceAll('-',' ').toUpperCase(),x:500});
    if(event.type==='encounter-loan-start')this.fx.push({type:'assist',start:time,life:3,text:v.name.toUpperCase()+' · ENCOUNTER LOAN',x:500});
  }
  background(ctx,w,h,scene,time){
    const night=/night|castle|lava|moon|dream|nightmare|fountain|storm/.test(scene),water=scene.includes('water'),kirby=scene.startsWith('ka-');
    if(kirby){const name=water?'ka-water':/tower|yard|storm/.test(scene)?'ka-tower':'ka-valley',im=this.sceneImage('assets/scenes/'+name+'.png');
      if(im.complete&&im.naturalWidth){ctx.drawImage(im,0,0,im.width,133,0,0,w,h-30);ctx.drawImage(im,0,133,im.width,im.height-133,0,h-30,w,30);
        if(night){ctx.fillStyle='rgba(27,27,65,.65)';ctx.fillRect(0,0,w,h);ctx.fillStyle='#e3d9b4';for(let i=0;i<15;i++)ctx.fillRect((i*97)%w,15+(i*31)%(h-50),2,2);}
        return;
      }
    }
    ctx.fillStyle=night?(kirby?'#242a46':'#282b3b'):water?'#608ea8':kirby?'#b7d2c4':'#a8c5cd';ctx.fillRect(0,0,w,h);
    ctx.fillStyle=night?'#f0dcb5':'rgba(255,255,245,.65)';
    for(let i=0;i<7;i++){const x=((i*173-time*2)%(w+100)+w+100)%(w+100)-50,y=35+(i%3)*19;if(night)ctx.fillRect(x,y,2,2);else{ctx.fillRect(x,y,50,10);ctx.fillRect(x+10,y-7,30,7);}}
    ctx.fillStyle=night?'#3c4a4f':water?'#4f7d83':kirby?'#7ca696':'#789a85';
    for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(i*230-60,h-30);ctx.lineTo(i*230+50,h-115-i%2*30);ctx.lineTo(i*230+165,h-30);ctx.fill();}
    ctx.fillStyle=kirby?'#e6d8b0':'#bda885';ctx.fillRect(0,h-30,w,30);ctx.fillStyle=kirby?'#689c76':'#586f54';ctx.fillRect(0,h-33,w,3);
    if(/castle|lava/.test(scene)){ctx.fillStyle='#5c4950';for(let i=0;i<w;i+=48){ctx.fillRect(i,0,47,8);ctx.fillRect(i,8,18,20);}ctx.fillStyle='#cc6743';ctx.fillRect(0,h-24,w,24);}
    if(kirby){ctx.fillStyle='#db9e9f';for(let i=60;i<w;i+=180){ctx.fillRect(i,h-42,3,9);ctx.fillRect(i-4,h-46,11,4);}}
    else if(!water){ctx.fillStyle='#648757';for(let i=140;i<w;i+=310){ctx.fillRect(i,h-59,26,26);ctx.fillStyle='#91af6e';ctx.fillRect(i-3,h-63,32,7);ctx.fillStyle='#648757';}}
    if(!kirby){const tiles=this.sceneImage('assets/sprites/sources/smb-tiles.png');if(tiles.complete&&tiles.naturalWidth){
      const ground=water?[12,2]:/castle|lava/.test(scene)?[14,1]:scene.includes('underground')?[0,2]:[0,0];
      for(let x=0;x<w;x+=30)ctx.drawImage(tiles,ground[0]*16,ground[1]*16,16,16,x,h-30,30,30);
      if(!water&&!night){for(let x=140;x<w;x+=310){ctx.drawImage(tiles,0,80,32,16,x-5,h-74,48,24);ctx.drawImage(tiles,0,96,32,16,x-5,h-50,48,20);}for(let x=70;x<w;x+=360){ctx.drawImage(tiles,64,0,16,16,x,h-136,26,26);ctx.drawImage(tiles,16,0,16,16,x+26,h-136,26,26);}}
    }}
  }
  star(ctx,x,y,r){ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;ctx.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}ctx.closePath();ctx.fill();}
}
