// Export one presentation; preserve the Site identity and earlier references.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('..',import.meta.url));
const site=process.argv[2]||'/workspace/sites/gacha-reveal-review',dist=path.join(site,'dist');
const manifest=JSON.parse(await fs.readFile(path.join(site,'.openai/hosting.json'),'utf8'));
if(manifest.project_id!=='appgprj_6acff4c4416081918499004cc7f2fcb4')throw Error('Review Site identity mismatch.');
const old=await fs.readFile(path.join(dist,'index.html'),'utf8');
if(old.includes('Characters that feel alive.')){
 const reference=path.join(dist,'motion-references');await fs.mkdir(reference,{recursive:true});
 await fs.writeFile(path.join(reference,'index.html'),old.replaceAll('./cubism/index.html','../cubism/index.html').replaceAll('href="./references/','href="../references/').replaceAll('href="../reveal-redesign/index.html"','href="../references/index.html"'));
 await fs.copyFile(path.join(dist,'review.js'),path.join(reference,'review.js'));
 for(const name of await fs.readdir(dist))if(/\.(webm|webp)$/.test(name))await fs.rename(path.join(dist,name),path.join(reference,name));
}
const demo=path.join(root,'demos/dedede-reveal');
for(const name of await fs.readdir(demo))await fs.cp(path.join(demo,name),path.join(dist,name),{recursive:true});
console.log('Dedede proof exported; earlier reference boards preserved.');
