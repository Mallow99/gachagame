// Record the exact logic/content behind long-running progression evidence.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../src/',import.meta.url));
export function combatSourceHash(){
 const files=['game.js','gacha.js','random.js',...['combat','config','content','save'].flatMap(dir=>fs.readdirSync(path.join(root,dir),{recursive:true}).filter(f=>f.endsWith('.js')).map(f=>dir+'/'+f))].sort();
 const hash=createHash('sha256');for(const file of files)hash.update(file+'\0').update(fs.readFileSync(path.join(root,file)));return hash.digest('hex');
}
