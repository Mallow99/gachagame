// Export a single-file visual review: no server, script, fetch or adjacent assets.
// Also refresh the checked-in gallery from its sourced candidate metadata.
// Usage: node tools/build-reveal-preview.mjs [output.html]
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, extname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const viewer = resolve(root, 'docs/validation/reveal-redesign/index.html');
const output = resolve(process.argv[2] || resolve(root, '../gacha-reveal-preview.html'));
if (output === viewer) throw new Error('Choose a separate output file; preserve the source viewer.');
const escape = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);
const candidates = JSON.parse(await readFile(resolve(dirname(viewer), 'art-search/candidates.json'), 'utf8'));
const gallery = candidates.filter(candidate => candidate.preview).map(candidate => {
  const note = candidate.assessment || (candidate.alternateUploadGroup
    ? 'Alternate upload of a painting in this gallery; version/focus pending.'
    : 'Version/focus pending.');
  return `<article><img src="art-search/${candidate.id}.jpg" alt="Composition research candidate ${candidate.id} by Suyasuyabi427"><a href="${escape(candidate.page)}" target="_blank" rel="noopener">Source ${candidate.id} ↗</a><small>${escape(candidate.dimensions.join(' × '))} original · ${escape(note)}</small></article>`;
}).join('\n');
let html = await readFile(viewer, 'utf8');
html = html.replace(/<!-- CANDIDATES START -->[\s\S]*?<!-- CANDIDATES END -->/,
  `<!-- CANDIDATES START -->\n${gallery}\n<!-- CANDIDATES END -->`);
await writeFile(viewer, html);

const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
const sources = [...new Set([...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1]))];
const images = new Map();
for (const source of sources) {
  const path = resolve(dirname(viewer), source);
  const fromRoot = relative(root, path);
  if (fromRoot.startsWith('..') || !mime[extname(path)]) throw new Error(`Unsupported review image: ${source}`);
  const bytes = await readFile(path);
  images.set(source, `data:${mime[extname(path)]};base64,${bytes.toString('base64')}`);
}
html = html.replace(/(<img\b[^>]*\bsrc=")([^"]+)(")/g,
  (_, before, source, after) => before + images.get(source) + after);
// Source/credit links remain live. Checkout-only links become readable notes.
html = html.replace(/<a href="(?!https?:|#)[^"]+"[^>]*>([\s\S]*?)<\/a>/g,
  (_, label) => `<span class="local-link">${label} (available in the game checkout)</span>`);
await mkdir(dirname(output), { recursive: true });
await writeFile(output, html);
console.log(`Exported ${images.size} embedded image assets; no JavaScript required: ${output}`);
console.log(`Standalone HTML: ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MiB`);
