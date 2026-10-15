// Copies the splash-kit demo, the game modules it imports, and the assets it
// loads into one flat folder that can be hosted anywhere (or published as a
// claude.ai artifact). Usage: node tools/splash-kit/export-artifact.mjs <out-dir>
// Prints the published-path -> source-path map for the artifact `files` list.
import { cpSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync, rmSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));
const out = process.argv[2];
if (!out) { console.error('Usage: node tools/splash-kit/export-artifact.mjs <out-dir>'); process.exit(1); }
rmSync(out, { recursive: true, force: true });

const copy = (from, to = from, filter = () => true) => cpSync(join(root, from), join(out, to), { recursive: true, filter: src => filter(src) });
copy('demos/splash-kit', '.', src => !src.endsWith('rig-grid.jpg'));
copy('src', 'src');
for (const part of ['manifest.json', 'display', 'thumbnails']) copy(`assets/portraits/source-era/${part}`);
mkdirSync(join(out, 'assets/audio/reveal'), { recursive: true });
copy('assets/audio/reveal/kirby-adventure-fanfare.mp3');

// The artifact host supplies the document skeleton, so keep only the page body content.
let html = readFileSync(join(out, 'index.html'), 'utf8')
  .replace('<meta name="game-root" content="../../">', '<meta name="game-root" content="./">')
  .replace(/<!doctype html>\s*|<\/?html[^>]*>\s*|<\/?head>\s*|<\/?body>\s*|<meta name="viewport"[^>]*>\s*/gi, '');
html = html.replace(/(<title>[^<]*<\/title>)/, '$1\n<meta name="claude:viewport-fit-sides" content="cover">');
writeFileSync(join(out, 'index.html'), html);

const files = {};
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name !== 'index.html' || dir !== out) files[relative(out, p)] = p;
  }
})(out);
console.log(JSON.stringify(files));
