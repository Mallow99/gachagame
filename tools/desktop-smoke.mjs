// Real Electron IPC/file-URL smoke in an isolated profile. On Linux without a
// display, start Xvfb and set DISPLAY. This cannot verify macOS spaces, native
// tray interactions, click-through or performance.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url),{_electron}=require(process.env.POCKET_PLAYWRIGHT_MODULE||'playwright');
const root=fileURLToPath(new URL('..',import.meta.url)),profile=fs.mkdtempSync(path.join(os.tmpdir(),'pocket-desktop-review-'));
const out=path.join(root,'docs/validation/desktop-review');fs.mkdirSync(out,{recursive:true});
if(process.platform==='linux'&&!process.env.DISPLAY)throw new Error('The Electron check needs DISPLAY on Linux; start Xvfb first.');
const args=[...(process.platform==='linux'?['--no-sandbox','--disable-gpu']:[]),root];
const errors=[];
async function launch(){
 const app=await _electron.launch({executablePath:require('electron'),args,cwd:root,env:{...process.env,POCKET_GACHA_PROFILE_DIR:profile}});
 await app.firstWindow();if(app.windows().length<2)await app.waitForEvent('window');const windows=app.windows();
 for(const window of windows)window.on('pageerror',e=>errors.push(e.message));
 await Promise.all(windows.map(window=>window.waitForLoadState('domcontentloaded')));
 await app.evaluate(({BrowserWindow})=>{for(const window of BrowserWindow.getAllWindows())if(window.webContents.getURL().endsWith('index.html')){window.show();window.focus();}});
 const strip=windows.find(w=>w.url().endsWith('strip.html')),manual=windows.find(w=>w.url().endsWith('index.html'));
 assert.ok(strip&&manual,'both file-URL windows load');
 try{await strip.waitForFunction(()=>Boolean(window.desktop));await manual.waitForFunction(()=>Boolean(window.desktop));
   await manual.evaluate(async()=>{const{game}=await import('./src/game.js');window.__pocketGame=game;});}
 catch(error){console.log(JSON.stringify({urls:windows.map(w=>w.url()),errors}));await app.close();throw error;}
 return{app,strip,manual};
}
let {app,strip,manual}=await launch();
const runtime=await app.evaluate(({app})=>({versions:process.versions,profile:app.getPath('userData')}));assert.equal(runtime.profile,profile);
await strip.evaluate(async()=>{const {game:g}=await import('./src/game.js');window.nativeReviewGame=g;if(!g.battle)g.start();g.battle.advance(601);g.completeBattle(g.battle.report());if(!g.paused)g.pause();});
await manual.waitForFunction(()=>window.__pocketGame.inventory.starlight===100);
await manual.locator('[data-tab="party"]').click();await manual.locator('[data-action="train"]').first().click();
await strip.waitForFunction(()=>window.nativeReviewGame.rank===2);await manual.waitForFunction(()=>window.__pocketGame.rank===2);
await manual.locator('[data-tab="summon"]').click();await manual.locator('[data-action="pull"]').first().click();
await manual.locator('.reveal-skip').click();assert.equal(await manual.locator('.result-card').count(),1);await manual.locator('.result-continue').click();
await strip.waitForFunction(()=>window.nativeReviewGame.state.banners.pendingReveal===null);
await manual.screenshot({path:out+'/manual-after-pull.png'});await strip.screenshot({path:out+'/strip-after-clear.png'});
const saved=await strip.evaluate(()=>({rank:window.nativeReviewGame.rank,party:window.nativeReviewGame.party,owned:Object.keys(window.nativeReviewGame.owned),starlight:window.nativeReviewGame.inventory.starlight}));
const closing=app.waitForEvent('close');await app.evaluate(({app})=>app.quit());await closing;
({app,strip,manual}=await launch());
const restored=await strip.evaluate(async()=>{const{game:g}=await import('./src/game.js');return{rank:g.rank,party:g.party,owned:Object.keys(g.owned),starlight:g.inventory.starlight};});
assert.deepEqual(restored,saved);assert.deepEqual(errors,[]);
fs.writeFileSync(out+'/results.json',JSON.stringify({at:new Date().toISOString(),method:'Real Electron in an isolated profile: primary clear, observer Training/pull/receipt completion over actual IPC, matching quit/save acknowledgment and persisted relaunch.',runtime:{electron:runtime.versions.electron,chrome:runtime.versions.chrome,platform:process.platform,headless:args.includes('--ozone-platform=headless')},saved,restored,errors,limits:['Linux Ozone evidence does not verify native macOS tray, spaces, click-through, speaker quality or M2 performance.']},null,2)+'\n');
const closeAgain=app.waitForEvent('close');await app.evaluate(({app})=>app.quit());await closeAgain;
console.log('Real Electron smoke passed: IPC Training/pull/save and isolated profile relaunch.');
