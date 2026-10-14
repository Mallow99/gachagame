// Controlled first-use delays/failures in actual Chromium, using the isolated
// pull gallery. This never creates an account, receipt or paid draw.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require(process.env.POCKET_PLAYWRIGHT_MODULE||'playwright');
const out=process.argv[2]||'docs/validation/summon-review';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:360,height:600}}),errors=[];
page.on('pageerror',error=>errors.push(error.message));
try{
 await page.goto('http://127.0.0.1:8080/docs/validation/summon-review/index.html',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>window.reviewGallery);
 const before=await page.evaluate(()=>JSON.stringify({...localStorage}));
 let release;const blocked=new Promise(resolve=>{release=resolve;}),dedede='**/source-era/display/king-dedede.webp';
 await page.route(dedede,async route=>{await blocked;await route.continue();});
 await page.evaluate(()=>{void window.reviewGallery.preview('king-dedede','unit');});
 await page.locator('.typed-quote').waitFor();await page.waitForTimeout(500);
 assert.equal(await page.locator('.hero-reveal').count(),0,'arrival waits while the source image is delayed');
 release();await page.locator('.hero-reveal.SSR').waitFor();
 const delayed=await page.locator('.hero-splash').evaluate(image=>({decoded:image.complete&&image.naturalWidth>0,url:image.src.split('/').at(-1)}));
 assert.ok(delayed.decoded);assert.equal(delayed.url,'king-dedede.webp');
 await page.screenshot({path:out+'/loaded-before-arrival-360.png'});
 await page.locator('.reveal-skip').click();await page.locator('.result-continue').click();await page.unroute(dedede);

 let releaseLate;const late=new Promise(resolve=>{releaseLate=resolve;}),bandana='**/source-era/display/bandana-waddle-dee.webp';
 await page.route(bandana,async route=>{await late;await route.continue();});
 await page.evaluate(()=>{void window.reviewGallery.preview('bandana-waddle-dee','unit');});
 await page.locator('.typed-quote').waitFor();await page.locator('.reveal-skip').click();
 const finished=page.waitForEvent('requestfinished',request=>request.url().endsWith('/display/bandana-waddle-dee.webp'));
 releaseLate();await finished;await page.waitForTimeout(100);
 assert.equal(await page.locator('.hero-reveal').count(),0,'late image cannot replace skipped results');
 assert.equal(await page.locator('.result-card').count(),1);await page.locator('.result-continue').click();await page.unroute(bandana);

 await page.route(bandana,route=>route.abort());
 await page.evaluate(()=>{void window.reviewGallery.preview('bandana-waddle-dee','unit');});
 await page.locator('.hero-reveal.SSR').waitFor();
 const fallback=await page.locator('.hero-splash').evaluate(image=>({decoded:image.complete&&image.naturalWidth>0,url:image.src.split('/').at(-1),sourceArt:image.classList.contains('source-art')}));
 assert.ok(fallback.decoded);assert.equal(fallback.sourceArt,false);assert.equal(fallback.url,'bandana-icon.png');
 await page.locator('.reveal-skip').click();await page.locator('.result-continue').click();await page.unroute(bandana);

 const penguin='**/supply/display/penguin-suit.webp';await page.route(penguin,route=>route.abort());
 await page.evaluate(()=>{void window.reviewGallery.preview('penguin-suit','powerup');});
 await page.locator('.hero-reveal.SSR').waitFor();assert.equal(await page.locator('svg.hero-splash.supply-illustration').count(),1,'Supply has a readable fallback');
 await page.locator('.reveal-skip').click();await page.locator('.result-continue').click();
 assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),before);assert.deepEqual(errors,[]);
 fs.writeFileSync(out+'/image-loading-results.json',JSON.stringify({at:new Date().toISOString(),method:'Actual Chromium: delayed first SSR image, Skip with an outstanding image, failed fighter artwork/native icon fallback and failed Supply artwork/printed-symbol fallback, in the isolated gallery.',delayed,fallback,storageUnchanged:true,errors,limits:['Network failures are deliberate fixtures. This checks reveal lifecycle, not speaker quality or native macOS behavior.']},null,2)+'\n');
 console.log('Reveal image loading passed: decode before arrival, cancellable wait, two readable fallbacks and unchanged storage.');
}finally{await browser.close();}
