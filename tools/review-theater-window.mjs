// Native sizing proof using the owner's approved full-art Mario demo. This is
// a visual research window, not a new fighter, production pull or RNG change.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url),{_electron}=require(process.env.POCKET_PLAYWRIGHT_MODULE||'playwright');
const root=fileURLToPath(new URL('..',import.meta.url)),out=path.join(root,'docs/validation/reveal-redesign');fs.mkdirSync(out,{recursive:true});
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'pocket-theater-research-'));
let app;
try{
 app=await _electron.launch({executablePath:require('electron'),args:[...(process.platform==='linux'?['--no-sandbox','--enable-unsafe-swiftshader']:[]),root],cwd:root,env:{...process.env,POCKET_GACHA_PROFILE_DIR:profile}});
 await app.firstWindow();const nextWindow=app.waitForEvent('window');
 const windowBounds=await app.evaluate(async({BrowserWindow,screen},root)=>{
   const area=screen.getPrimaryDisplay().workArea,width=Math.min(1240,area.width-96),height=Math.round(width*9/16);
   const theater=new BrowserWindow({width,height,useContentSize:true,show:false,title:'Full-art theater sizing proof',webPreferences:{nodeIntegration:false,contextIsolation:true}});
   await theater.loadFile(root+'/demos/mario-pull/index.html',{query:{preview:'reveal',pull:'0'}});theater.center();theater.show();return theater.getContentBounds();
 },root);
 const theater=await nextWindow,errors=[];theater.on('pageerror',error=>errors.push(error.message));
 await theater.locator('#resultUI:not([hidden])').waitFor();await theater.locator('.art-front').evaluate(image=>image.decode());await theater.waitForTimeout(500);
 const stageBounds=await theater.locator('#screen').boundingBox();assert.ok(stageBounds.width>900&&Math.abs(stageBounds.width/stageBounds.height-16/9)<.02);assert.deepEqual(errors,[]);
 await theater.screenshot({path:path.join(out,'native-wide-theater-proof.png')});
 fs.writeFileSync(path.join(out,'native-sizing-results.json'),JSON.stringify({at:new Date().toISOString(),method:'Real Electron, isolated QA profile: create a separate wide window, load the approved full-art Mario demo through a file URL, verify decoded artwork and 16:9 stage bounds.',previewOnly:true,windowBounds,stageBounds,errors,limits:['Sizing proof only. The production receipt router and new character artwork are not implemented here. Linux virtual display is not a native Mac or M2 performance check.']},null,2)+'\n');
 console.log('Native widescreen sizing proof passed:',Math.round(stageBounds.width)+'×'+Math.round(stageBounds.height));
}finally{if(app)await app.close().catch(()=>{});}
