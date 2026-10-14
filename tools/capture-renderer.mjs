// Optional development capture. Install @napi-rs/canvas separately or provide
// POCKET_CANVAS_MODULE; the game's runtime has no native-canvas dependency.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const {createCanvas,Image}=require(process.env.POCKET_CANVAS_MODULE||'@napi-rs/canvas');
globalThis.window={devicePixelRatio:1};globalThis.Image=Image;
const {Battle}=await import('../src/combat/engine.js');
const {BattleView}=await import('../src/render/battle-view.js');
const {content}=await import('../src/content/index.js');
const root=fileURLToPath(new URL('..',import.meta.url));process.chdir(root);
const out=process.argv[2]||'docs/validation/captures';fs.mkdirSync(out,{recursive:true});
const cases=[
 {name:'mario-field',id:'smb1-01',party:['classic-mario'],rank:1,threat:1,seconds:20,width:1000,height:220},
 {name:'classic-party-strip',id:'smb1-04',party:['classic-mario','classic-luigi','toad','princess-peach'],rank:5,threat:4,seconds:18,width:1280,height:170,transparent:true},
 {name:'dream-party-field',id:'ka-02',party:['adventure-kirby','parasol-waddle-dee','sir-kibble','hot-head'],rank:17,threat:17,seconds:18,width:1000,height:220},
 {name:'whispy-field',id:'ka-05',party:['adventure-kirby','parasol-waddle-dee','sir-kibble','hot-head'],rank:21,threat:20,boss:true,width:1000,height:220},
 {name:'bowser-ultimate-strip',id:'smb1-15',party:['classic-mario','koopa-troopa','hammer-bro','bowser'],rank:15,threat:15,ultimate:'bowser',width:1280,height:170,transparent:true},
 {name:'small-strip',id:'ka-03',party:['adventure-kirby','waddle-dee','poppy-bros-jr'],rank:18,threat:18,seconds:18,width:360,height:170,transparent:true},
 {name:'kabu-assist-entry',id:'ka-02',party:['adventure-kirby','poppy-bros-jr'],rank:17,threat:17,assist:'kabu',width:1000,height:220},
 {name:'bandana-spear-flight',id:'ka-03',party:['adventure-kirby','bandana-waddle-dee'],rank:20,threat:18,spear:true,width:1000,height:220},
];
const captures=[];
for(const c of cases){
 const canvas=createCanvas(c.width,c.height);canvas.getBoundingClientRect=()=>({width:c.width,height:c.height});
 const b=new Battle({encounter:content.encounters.get(c.id),party:c.party,rank:c.rank,threat:c.threat,assistId:c.assist,seed:42});
 if(c.assist){b.advance(2);b.living(true)[0].hp*=.2;b.checkAssist();b.advance(.5);}
 else if(c.spear){b.advance(2);const spear=b.living(true).find(a=>a.id==='bandana-waddle-dee'),target=b.living(false)[0];b.startAction(spear,{...spear.definition.ultimate,kind:'ultimate'},target);b.advance(.45);}
 else if(c.boss||c.ultimate){for(let i=0;i<18000&&!b.done;i++){b.step();if(c.boss&&b.living(false).some(a=>a.boss)||c.ultimate&&b.events.some(e=>e.type==='ultimate'&&e.sourceId.startsWith(c.ultimate+'#')))break;}b.advance(c.boss?1:.25);}
 else b.advance(c.seconds);
 const view=new BattleView(canvas,{transparent:c.transparent});await view.ready;view.draw(b);
 await new Promise(r=>setTimeout(r,30));view.draw(b);
 const p=path.join(out,c.name+'.png');fs.writeFileSync(p,canvas.toBuffer('image/png'));
 captures.push({name:c.name,file:p,encounter:c.id,seconds:b.time,width:c.width,height:c.height,transparent:Boolean(c.transparent)});
 console.log(p);
}
fs.writeFileSync(path.join(out,'index.json'),JSON.stringify({at:new Date().toISOString(),method:'Actual Battle and BattleView in native canvas. These are renderer captures, not browser CSS or macOS window screenshots.',captures},null,2)+'\n');
