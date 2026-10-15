// Rebuild the complete private review from files retained in the game repo.
// Does not contact Sites, push Git, deploy, or read any account credentials.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('..',import.meta.url));
if(!process.argv[2])throw Error('Usage: node tools/export-review-site.mjs <output-directory>');
const target=path.resolve(process.argv[2]),dist=path.join(target,'dist');
if(target===root||root.startsWith(target+path.sep))throw Error('Choose a separate review output directory.');
const projectId='appgprj_6acff4c4416081918499004cc7f2fcb4';
let manifest={project_id:projectId,static:{directory:'dist'}};
try{manifest=JSON.parse(await fs.readFile(path.join(target,'.openai/hosting.json'),'utf8'));if(manifest.project_id!==projectId)throw Error('Review Site identity mismatch.');if(manifest.static?.directory!=='dist')throw Error('The existing review requires a different export layout.');}catch(e){if(e.code!=='ENOENT')throw e;}
await fs.mkdir(path.join(target,'.openai'),{recursive:true});
await fs.writeFile(path.join(target,'.openai/hosting.json'),JSON.stringify(manifest,null,2)+'\n');
await fs.mkdir(dist,{recursive:true});
await fs.cp(path.join(root,'demos/dedede-reveal'),dist,{recursive:true});
const research=path.join(root,'docs/validation/animated-reveal-research'),motion=path.join(dist,'motion-references');
await fs.mkdir(motion,{recursive:true});
for(const name of await fs.readdir(research))if(/\.(webm|webp)$/.test(name)||['index.html','review.js','cards.json','SOURCES.md'].includes(name))await fs.copyFile(path.join(research,name),path.join(motion,name));
let html=await fs.readFile(path.join(motion,'index.html'),'utf8');
html=html.replaceAll('./cubism/index.html','../cubism/index.html').replaceAll('href="../reveal-redesign/index.html"','href="../references/index.html"');
await fs.writeFile(path.join(motion,'index.html'),html);
await fs.cp(path.join(research,'cubism'),path.join(dist,'cubism'),{recursive:true});
const saved=path.join(root,'docs/validation/private-site');
await fs.mkdir(path.join(dist,'references'),{recursive:true});
await fs.copyFile(path.join(saved,'references.html'),path.join(dist,'references/index.html'));
const mapping=JSON.parse(await fs.readFile(path.join(saved,'asset-map.json'),'utf8'));
for(const[destination,source]of Object.entries(mapping)){
 const input=path.resolve(root,source),output=path.resolve(dist,destination);
 if(!input.startsWith(root)||!output.startsWith(dist+path.sep))throw Error('Asset mapping leaves the review.');
 await fs.mkdir(path.dirname(output),{recursive:true});await fs.copyFile(input,output);
}
console.log(`Exported Dedede, seven motion references, Cubism sample and static comparisons to ${dist}`);
console.log('No publication or audience changes were made.');
