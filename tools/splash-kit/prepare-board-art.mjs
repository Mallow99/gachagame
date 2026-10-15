// Reuse the verified source-era runtime atlas; no new artwork or hand-cut asset.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const root = new URL('../../', import.meta.url);
const sprite = JSON.parse(readFileSync(new URL('assets/sprites/v1/manifest.json', root)))['waddle-dee'];
const atlas = new URL(sprite.url, root);
if (createHash('sha256').update(readFileSync(atlas)).digest('hex') !== sprite.sha256) throw Error('Waddle Dee atlas changed');
const out = new URL('demos/splash-kit/assets/board/', root); mkdirSync(out, { recursive: true });
copyFileSync(atlas, new URL('waddle-dee.png', out));
writeFileSync(new URL('SOURCES.json', out), JSON.stringify({ 'waddle-dee': { ...sprite, url: 'waddle-dee.png', processing: 'Unchanged verified runtime atlas. Rebuild original with tools/art/import-faithful-sprites.py; this script copies it for the standalone storyboard.' } }, null, 2) + '\n');
