import assert from 'node:assert/strict';
import fs from 'node:fs';
import {rollRarity} from '../src/gacha.js';
import {createSeededRandom} from '../src/random.js';
const count=1_000_000,results={};
for(const channel of ['fighter','supply']){
 const random=createSeededRandom('live-gacha-v1-'+channel),normal={R:0,SR:0,SSR:0},actual={R:0,SR:0,SSR:0},p={sinceSsr:0,sinceSr:0};let largestSsrGap=0,largestSrGap=0;
 for(let i=0;i<count;i++){
  normal[rollRarity(channel,{sinceSsr:0,sinceSr:0},random)]++;
  const r=rollRarity(channel,p,random);actual[r]++;const ssrGap=p.sinceSsr+1,srGap=p.sinceSr+1;
  if(r==='SSR'){largestSsrGap=Math.max(largestSsrGap,ssrGap);p.sinceSsr=0;}else p.sinceSsr++;
  if(r==='R')p.sinceSr++;else{largestSrGap=Math.max(largestSrGap,srGap);p.sinceSr=0;}
 }
 const ssr=channel==='fighter'?.03:.05;assert.ok(Math.abs(normal.SSR/count-ssr)<.001);assert.ok(largestSsrGap<=(channel==='fighter'?70:45));assert.ok(largestSrGap<=10);
 results[channel]={decisions:count,normal,withPity:actual,largestSsrGap,largestSrGap};
}
const report={at:new Date().toISOString(),method:'One million production rollRarity decisions per channel, with a fresh independent base-rate draw alongside each pity-chain draw. Welcome/ownership/receipts are tested separately.',results};
if(process.argv.includes('--write')){fs.mkdirSync(new URL('../docs/validation/',import.meta.url),{recursive:true});fs.writeFileSync(new URL('../docs/validation/live-gacha.json',import.meta.url),JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify(report,null,2));
