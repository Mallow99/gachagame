// Isolated layout/audio fixtures. Injected funds/pity are only for review;
// player-path.mjs separately validates earned progression and currency.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require(process.env.POCKET_PLAYWRIGHT_MODULE||'playwright');
const out=process.argv[2]||'docs/validation/summon-review';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:360,height:600}}),page=await context.newPage(),errors=[],missing=[];
await page.addInitScript(()=>{
 const OriginalAudio=window.Audio;window.reviewClips=[];
 window.Audio=new Proxy(OriginalAudio,{construct(Type,args){const clip=Reflect.construct(Type,args);window.reviewClips.push(clip);return clip;}});
});
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
await page.goto('http://127.0.0.1:8080',{waitUntil:'networkidle'});await page.locator('#dock-start').click();
await page.evaluate(()=>{const g=window.__pocketGame;g.battle.advance(601);g.completeBattle(g.battle.report());g.paused=true;g.state.inventory.starlight=1000;g.state.banners.fighter.sinceSsr=69;g.setting('muted',false);g.setting('reducedMotion',true);});
await page.locator('[data-tab="summon"]').click();await page.locator('[data-action="pull"]').nth(1).click();
await page.locator('.hero-reveal.SSR').waitFor();
await page.waitForFunction(()=>window.reviewClips.some(c=>c.src.includes('mus-starman')&&c.readyState>=2&&!c.paused));
const nativeAudio=await page.evaluate(()=>window.reviewClips.map(c=>({url:c.src.split('/').at(-1),volume:c.volume,readyState:c.readyState,paused:c.paused})));
await page.locator('.reveal-skip').click();assert.equal(await page.locator('.result-card').count(),10);
assert.equal(await page.evaluate(()=>document.querySelector('.reveal-dialog').scrollWidth),360);
assert.ok(await page.evaluate(()=>window.reviewClips.every(c=>c.paused)),'skip stops native sound');
await page.screenshot({path:out+'/ten-results-360-top.png'});
await page.locator('.result-card').first().click();assert.ok((await page.locator('.detail-dialog').innerText()).includes('Royal Flame'));
await page.keyboard.press('Escape');await page.locator('.result-continue').scrollIntoViewIfNeeded();
await page.screenshot({path:out+'/ten-results-360-bottom.png'});await page.locator('.result-continue').click();
const original=await page.evaluate(()=>JSON.stringify({owned:window.__pocketGame.owned,inventory:window.__pocketGame.inventory}));
await page.locator('[data-replay]').first().evaluate(b=>{b.closest('details').open=true;});await page.locator('[data-replay]').first().click();
await page.locator('.reveal-skip').click();assert.equal(await page.locator('.result-card').count(),10);await page.locator('.result-continue').click();
assert.equal(await page.evaluate(()=>JSON.stringify({owned:window.__pocketGame.owned,inventory:window.__pocketGame.inventory})),original,'replay keeps results/currency');

// Review both Supply kinds with isolated saved receipts and normal item lookup.
await page.evaluate(async()=>{const{showReceipt}=await import('/src/presentation/reveal.js');window.reviewSupply=results=>showReceipt(window.__pocketGame,{id:'supply-review',at:Date.now(),sagaId:'mario',results},()=>{});});
for(const [kind,id,rarity]of [['powerup','fire-flower','SR'],['assist','e-gadd-field-notes','SR']]){
 await page.evaluate(result=>{void window.reviewSupply([result]);},{kind,id,rarity,isNew:true});await page.locator('.hero-reveal.SR').waitFor();
 await page.screenshot({path:out+'/'+kind+'-reveal-360.png'});await page.locator('.reveal-skip').click();await page.locator('.result-continue').click();
}
assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
fs.writeFileSync(out+'/results.json',JSON.stringify({at:new Date().toISOString(),method:'Actual Chromium: isolated funded ten-pull with forced pity, native MP3 playback, skip, scroll, nested fighter inspection, replay invariance and both Supply reveal kinds.',viewport:{width:360,height:600},nativeAudio,errors,missing,limits:['Injected review funds/pity are not balance evidence. Headless playback state does not verify speaker quality or native macOS audio.']},null,2)+'\n');
// The standalone gallery does not import Game or touch local storage.
await page.goto('http://127.0.0.1:8080/docs/validation/summon-review/index.html',{waitUntil:'networkidle'});
await page.waitForFunction(()=>window.reviewGallery);assert.equal(await page.locator('[data-preview]').count(),60);
// The previous game's pagehide handler performs its final save on navigation.
// Take the gallery baseline after that flush, then check only preview activity.
const before=await page.evaluate(()=>JSON.stringify({...localStorage}));
const rare=await page.evaluate(()=>window.reviewGallery.entries.filter(e=>e.rarity==='SSR'||e.rarity==='SR'));
const artChecks=[];
for(const entry of rare){
 await page.evaluate(entry=>{void window.reviewGallery.preview(entry.id,entry.kind);},entry);
 await page.locator('.hero-reveal.'+entry.rarity).waitFor();
 await page.locator('.hero-splash').evaluate(im=>im.decode());
 const name=await page.locator('.reveal-name').boundingBox(),art=await page.locator('.hero-splash').boundingBox();
 assert.ok(name.y+name.height<=601,entry.id+' identity fits');assert.ok(art.width>40&&art.height>40,entry.id+' art is visible');
 if(entry.kind!=='unit'&&entry.rarity==='SSR')await page.screenshot({path:out+'/'+entry.id+'-reveal-360.png'});
 artChecks.push({...entry,nameBounds:name,artBounds:art});
 await page.locator('.reveal-skip').click();assert.ok((await page.locator('.result-heading').innerText()).includes('Visual preview'));
 await page.locator('.result-continue').click();
}
assert.ok(await page.evaluate(expected=>JSON.stringify({...localStorage})===expected,before),'gallery leaves save storage unchanged');
assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
fs.writeFileSync(out+'/gallery-results.json',JSON.stringify({at:new Date().toISOString(),method:'Actual Chromium: all 32 SR/SSR opening collectibles in the standalone 360×600 gallery; image decode and identity bounds, eight SSR Supply captures and unchanged local storage.',artChecks,errors,missing},null,2)+'\n');
console.log('Summon browser review passed: native audio, ten-result flow, Supply and all rare gallery previews.');await browser.close();
