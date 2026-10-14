// Actual Chromium captures and contact checks for the isolated motion review.
// Use the same optional Playwright setup as browser-smoke.mjs.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require(process.env.POCKET_PLAYWRIGHT_MODULE||'playwright');
const out=process.argv[2]||'docs/validation/sprite-review/motion';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1100,height:800}}),errors=[],missing=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
await page.goto('http://127.0.0.1:8080/docs/validation/sprite-review/combat.html',{waitUntil:'networkidle'});
await page.waitForFunction(()=>window.reviewCombat);
const examples=await page.evaluate(()=>{window.reviewCombat.setPlaying(false);return window.reviewCombat.examples;});
const records=[];
for(const id of examples){
 await page.evaluate(id=>window.reviewCombat.reset(id),id);
 const final=await page.evaluate(()=>window.reviewCombat.seek(3.6));
 assert.equal(final.hero.action,false,id+' completes');assert.equal(final.projectiles,0,id+' projectiles finish');
 assert.ok(Number.isFinite(final.hero.x)&&final.hero.x>=30&&final.hero.x<=970,id+' stays inside the field');
 records.push({id,contacts:final.events.filter(e=>e.type==='animation-marker').length,damage:final.events.filter(e=>e.type==='damage').length,hero:final.hero});
 if(['bowser','dedede','meta-tornado','meta-counter','bandana-spear','bandana-copter','hammer-bro','buzzy','parasol'].includes(id)){
  for(const seconds of [.25,.65,1.1,1.65,2.4]){
   await page.evaluate(seconds=>window.reviewCombat.seek(seconds),seconds);
   await page.locator('#combat').screenshot({path:`${out}/${id}-${seconds.toFixed(2)}.png`});
  }
 }
}
await page.locator('#strip').check();await page.locator('#reduced').check();
await page.evaluate(()=>{window.reviewCombat.reset('bowser');window.reviewCombat.seek(.65);});
await page.locator('#combat').screenshot({path:out+'/bowser-transparent-reduced.png'});
await page.setViewportSize({width:360,height:700});
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),360,'review controls fit narrow windows');
await page.screenshot({path:out+'/review-360.png',fullPage:true});
assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
fs.writeFileSync(out+'/results.json',JSON.stringify({at:new Date().toISOString(),method:'Actual Chromium renders the isolated Battle/BattleView fixtures, scrubs every listed move, captures nine key moves and checks transparent/reduced/narrow modes.',records,errors,missing,limits:['Stationary training targets do not validate normal encounter balance or native macOS behavior. Human animation approval remains separate.']},null,2)+'\n');
console.log('Motion browser review passed:',records.length,'moves, no errors or missing assets.');
await browser.close();
