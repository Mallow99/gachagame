// Optional development check. Set POCKET_PLAYWRIGHT_MODULE and
// PLAYWRIGHT_BROWSERS_PATH when Playwright lives outside the repository.
// Run with npm run web in another terminal. Fixtures use an isolated context.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.POCKET_PLAYWRIGHT_MODULE||'playwright');
const out=process.argv[2]||'docs/validation/sprite-review/browser';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:360,height:600}}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:8080',{waitUntil:'networkidle'});
await page.locator('#dock-start').click();
await page.evaluate(()=>{const g=window.__pocketGame;g.battle.advance(601);g.completeBattle(g.battle.report());g.paused=true;});
await page.locator('[data-tab="party"]').click();await page.locator('[data-action="train"]').first().click();
await page.locator('[data-tab="summon"]').click();
await page.locator('.banner-feature').evaluate(im=>im.decode());
await page.locator('.banner-poster').screenshot({path:out+'/mushroom-banner.png'});
await page.locator('[data-action="pull"]').first().click();await page.locator('.reveal-skip').click();
await page.locator('.result-card').waitFor();assert.equal(await page.locator('.result-card').count(),1);
await page.locator('.result-continue').click();
await page.locator('[data-tab="party"]').click();await page.locator('[data-inspect="classic-mario"]').first().click();
assert.ok((await page.locator('.detail-dialog').innerText()).includes('Classic Stomp'));await page.keyboard.press('Escape');
await page.locator('.detail-dialog').waitFor({state:'detached'});
assert.equal(await page.locator('.detail-dialog').count(),0);
await page.screenshot({path:out+'/party-360.png',fullPage:true});

// Test the actual 360×600 observer CSS with a minimal local desktop bridge.
// This checks layout and dialogs, not native macOS behavior or IPC transport.
await page.addInitScript(()=>{window.desktop={command:({name,args})=>window.__pocketGame[name]?.(...args),onInspect(){},onState(){},onToast(){},requestState(){},openStrip(){},quit(){}};});
await page.reload({waitUntil:'networkidle'});
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),360);
const bounds=await page.locator('.manual-book').boundingBox();assert.equal(Math.round(bounds.height),600);
await page.locator('[data-tab="summon"]').click();await page.locator('.banner-feature').evaluate(im=>im.decode());
await page.screenshot({path:out+'/manual-summon-360.png'});

// Explicit art-review fixture: no production save is shared by this context.
await page.evaluate(async()=>{
  const {showReceipt}=await import('/src/presentation/reveal.js');
  const {game:g}=await import('/src/game.js');window.__pocketGame=g;g.state.profile.reducedMotion=true;g.state.profile.muted=true;
  window.reviewPull=id=>showReceipt(g,{id:'art-review-'+id,at:Date.now(),sagaId:id==='bowser'?'mario':'kirby',results:[{kind:'unit',id,rarity:'SSR',isNew:true}]},()=>{});
});
for(const id of ['bowser','king-dedede','bandana-waddle-dee']){
  console.log('Checking source-art reveal:',id);
  await page.evaluate(id=>{window.reviewPull(id);},id);
  try{await page.locator('.hero-reveal.SSR').waitFor({timeout:8000});}
  catch(e){await page.screenshot({path:out+'/failed-reveal.png'});console.log(JSON.stringify({id,errors,text:await page.locator('.reveal-dialog').innerText().catch(()=>null)}));await browser.close();throw e;}
  await page.locator('.hero-splash.source-art').evaluate(im=>im.decode());
  await page.screenshot({path:out+'/'+id+'-reveal-360.png'});
  const art=await page.locator('.hero-splash').boundingBox(),name=await page.locator('.reveal-name').boundingBox();
  assert.ok(art.width>60&&art.height>60&&name.y+name.height<=601,id+' art/name remain visible');
  await page.locator('.reveal-skip').click();await page.locator('.result-continue').click();
}
assert.deepEqual(errors,[]);
fs.writeFileSync(out+'/results.json',JSON.stringify({at:new Date().toISOString(),method:'Actual Chromium: fresh deploy/clear/train/pull/results/inspect/Escape, then observer CSS bridge and isolated SSR art fixtures.',viewport:{width:360,height:600},errors,manualBounds:bounds,limits:['Native macOS tray, spaces, click-through, audio and performance remain unverified.']},null,2)+'\n');
console.log('Browser smoke passed: playable flow, 360×600 observer CSS, keyboard dialogs and three SSR source-art reveals.');
await browser.close();
