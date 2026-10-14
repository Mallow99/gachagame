// Record the actual normal-motion SSR theater through the isolated gallery.
// Playwright video is silent; native theme playback is verified separately.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require(process.env.POCKET_PLAYWRIGHT_MODULE||'playwright');
const out=process.argv[2]||'docs/validation/summon-review';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:360,height:600},recordVideo:{dir:out+'/recordings',size:{width:360,height:600}}});
const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
try{
 await page.goto('http://127.0.0.1:8080/docs/validation/summon-review/index.html',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>window.reviewGallery);await page.locator('#motion').uncheck();
 const start=Date.now();await page.evaluate(()=>{void window.reviewGallery.preview('king-dedede','unit');});
 await page.locator('.summon-route').waitFor();await page.screenshot({path:out+'/ssr-departure-360.png'});
 await page.locator('.summon-route.SSR').waitFor();await page.screenshot({path:out+'/ssr-signal-360.png'});
 await page.waitForFunction(()=>document.querySelector('.typed-quote')?.textContent.length>12);
 await page.screenshot({path:out+'/ssr-quote-360.png'});
 await page.locator('.hero-reveal.SSR').waitFor();await page.locator('.hero-splash').evaluate(image=>image.decode());
 await page.waitForTimeout(800);await page.screenshot({path:out+'/ssr-arrival-normal-360.png'});
 await page.locator('.result-card').waitFor();const seconds=(Date.now()-start)/1000;await page.screenshot({path:out+'/ssr-result-360.png'});
 assert.deepEqual(errors,[]);const video=page.video();await page.close();await context.close();
 const recording=await video.path();fs.renameSync(recording,out+'/ssr-pull-preview.webm');fs.rmdirSync(out+'/recordings');
 fs.writeFileSync(out+'/recording-results.json',JSON.stringify({at:new Date().toISOString(),method:'Actual Chromium video of the normal-motion Dedede SSR theater through an isolated visual-preview receipt. No account or paid draw.',seconds,silent:true,errors},null,2)+'\n');
 console.log('Recorded actual SSR theater:',seconds.toFixed(2),'seconds (silent visual capture).');
}finally{await browser.close();}
