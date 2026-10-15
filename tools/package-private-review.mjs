// Fallback for an existing Sites checkout when supported helpers are unavailable.
// Fresh native source credentials enter through hidden stdin only. See docs/PRIVATE_REVIEW_HOSTING.md.
import fs from 'node:fs/promises';
import {execFileSync,spawnSync} from 'node:child_process';
import {createInterface} from 'node:readline';
import path from 'node:path';
if(!process.argv[2])throw Error('Usage: node tools/package-private-review.mjs <existing-site-checkout>');
const cwd=path.resolve(process.argv[2]);
if(process.stdin.isTTY)execFileSync('stty',['-echo'],{stdio:'inherit'});
console.log('Ready for Site workflow JSON on stdin (input is hidden).');
const input=await new Promise(resolve=>{const lines=createInterface({input:process.stdin});lines.once('line',line=>{lines.close();resolve(line);});});
const {credential,project_id}=JSON.parse(input);
const manifest=JSON.parse(await fs.readFile(cwd+'/.openai/hosting.json','utf8'));
if(manifest.project_id!==project_id)throw new Error('Site identity mismatch.');
if(credential.auth_mode!=='http_extra_header')throw new Error('Unsupported credential mode.');
const remote=new URL(credential.remote_url);
if(!remote.pathname.endsWith('/'+project_id+'.git'))throw new Error('Source repository mismatch.');
const env={...process.env,GIT_CONFIG_COUNT:'1',GIT_CONFIG_KEY_0:'http.'+remote.origin+'/.extraheader',GIT_CONFIG_VALUE_0:'Authorization: Bearer '+credential.token,GIT_TERMINAL_PROMPT:'0'};
for(const key of Object.keys(env))if(key.startsWith('GIT_TRACE')||key==='GIT_CURL_VERBOSE')delete env[key];
function run(command,args,{allowFailure=false}={}) {
 const result=spawnSync(command,args,{cwd,env,encoding:'utf8'});
 if(result.status!==0&&!allowFailure)throw new Error((result.stderr||result.error?.message||'Command failed').replaceAll(credential.token,'[redacted]'));
 return result;
}
run('git',['init','--initial-branch='+credential.branch]);
run('git',['config','user.name','Codex']);run('git',['config','user.email','codex@openai.com']);
const configured=run('git',['remote','get-url','origin'],{allowFailure:true});
if(configured.status===0&&configured.stdout.trim()!==credential.remote_url)throw new Error('Existing source remote mismatch.');
if(configured.status!==0)run('git',['remote','add','origin',credential.remote_url]);
run('git',['fetch','origin']);
const existing=run('git',['rev-parse','--verify','refs/remotes/origin/'+credential.branch],{allowFailure:true});
if(existing.status===0){const local=run('git',['rev-parse','HEAD'],{allowFailure:true});if(local.status===0&&local.stdout.trim()!==existing.stdout.trim())throw new Error('Source branch moved; reconcile before committing.');}
run('git',['add','.openai/hosting.json','dist']);
const changes=run('git',['diff','--cached','--quiet'],{allowFailure:true});
if(changes.status===1)run('git',['commit','-m','Update Pocket Gacha private visual review']);
else if(changes.status!==0)throw Error('Could not inspect staged review changes.');
const commit_sha=run('git',['rev-parse','HEAD']).stdout.trim();
run('git',['push','-u','origin',credential.branch]);
const pushed=run('git',['ls-remote','origin','refs/heads/'+credential.branch]).stdout.trim().split(/\s+/)[0];
if(pushed!==commit_sha)throw new Error('Source verification failed.');
const archive=path.join(path.dirname(cwd),'pocket-review-deploy.tar');
run('tar',['-cf',archive,'.openai/hosting.json','dist']);
console.log(JSON.stringify({project_id,commit_sha,archive}));
