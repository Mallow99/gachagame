import { createRequire } from 'node:module';
import { existsSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url), { chromium } = require(process.env.POCKET_PLAYWRIGHT_MODULE || 'playwright');
const out = process.argv[2] || 'out/nightmare-sprites-02', url = process.argv[3] || 'http://localhost:8080/demos/splash-kit/nightmare.html';
const screenshots = !process.argv.includes('--no-screenshots'); mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: ['/usr/bin/chromium', '/usr/bin/chromium-browser'].find(existsSync), args: ['--no-sandbox', '--disable-gpu'] });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1050 } }), errors = [], missing = [];
  page.on('pageerror', e => errors.push(e.message)); page.on('response', r => { if (r.status() >= 400) missing.push(r.url()); });
  await page.goto(url); await page.waitForFunction(() => window.nightmareBoard); await page.evaluate(() => document.fonts.ready);
  const state = () => page.evaluate(() => nightmareBoard.state);
  const shot = name => screenshots && page.locator('#boardStage').screenshot({ path: `${out}/${name}.png` });
  const phase = (name, p = .5) => page.evaluate(({ name, p }) => { const b = nightmareBoard.state.board.beats.find(b => b.phase === name); nightmareBoard.seek(b.start + b.duration * p); }, { name, p });
  assert.equal((await state()).native, true, 'New sprite renderer is the default, not a hidden opt-in'); await shot('banner');
  const assembly = await page.evaluate(async () => {
    const load = async name => { const i = new Image(); i.src = `assets/nightmare-sprites/${name}.png`; await i.decode(); return i; };
    const canvas = document.createElement('canvas'); canvas.width = 82; canvas.height = 76;
    const c = canvas.getContext('2d'); c.drawImage(await load('pose-0'), 0, 0); const source = c.getImageData(0, 0, 82, 76).data;
    c.clearRect(0, 0, 82, 76); for (const name of ['body', 'head', 'left', 'right']) c.drawImage(await load(name), 0, 0);
    const joined = c.getImageData(0, 0, 82, 76).data; return source.every((v, i) => v === joined[i]);
  });
  assert.equal(assembly, true, 'Assembled layers must retain every source-pose pixel');
  await page.locator('#boardSound').click(); await page.waitForFunction(() => nightmareBoard.state.audio.loaded.length === 8);
  assert.equal((await state()).audio.musicTrack, 'dream-banner');
  await page.locator('[data-pull="1"]').click(); await page.locator('#confirmPull').click();
  await page.waitForFunction(() => nightmareBoard.state.playing);
  await page.waitForFunction(() => nightmareBoard.state.audio.retiring === 0 && nightmareBoard.state.audio.musicTrack === 'dream');
  await page.locator('#boardPlay').click(); assert.equal((await state()).audio.active, 0);
  const receipt = JSON.stringify((await state()).receipt);
  for (const [name, p, file] of [['hands', .8, 'hands'], ['open', .5, 'open'], ['dark', .5, 'dark'], ['emerge', .98, 'emerge'], ['wrap', .5, 'wrap'], ['wrap', .9, 'wrap-end'], ['face', .8, 'face'], ['name', .5, 'name']]) {
    await phase(name, p); await shot(file);
    if (name !== 'name') assert.equal(await page.locator('#identityName').isVisible(), false);
    if (name === 'dark') assert.deepEqual(await page.locator('#boardScene').evaluate(c => Array.from(c.getContext('2d').getImageData(c.width / 2, c.height / 3, 1, 1).data)), [4, 2, 4, 255]);
    if (name === 'emerge') assert.deepEqual(await page.locator('#boardScene').evaluate(c => Array.from(c.getContext('2d').getImageData(c.width * .65, c.height * .8, 1, 1).data)), [4, 2, 4, 255], 'No body during face rise');
  }
  await phase('wrap', .99999); await page.locator('#boardScene').evaluate(c => { window.wrapPixels = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; });
  await phase('face', 0);
  const continuity = await page.locator('#boardScene').evaluate(c => {
    const p = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let sum = 0, count = 0;
    for (let y = 0; y < c.height; y++) for (let x = Math.floor(c.width * .1); x < c.width * .9; x++) for (let channel = 0; channel < 4; channel++) { const i = (y * c.width + x) * 4 + channel; sum += Math.abs(p[i] - wrapPixels[i]); count++; }
    return sum / count;
  });
  assert.ok(continuity < .02, `Wrap/close-up difference ${continuity}`);
  await phase('open'); const clean = await page.locator('#boardScene').evaluate(c => c.toDataURL());
  await page.locator('#boardExplode').check(); assert.notEqual(await page.locator('#boardScene').evaluate(c => c.toDataURL()), clean); await page.locator('#boardExplode').uncheck();
  assert.equal(JSON.stringify((await state()).receipt), receipt);
  await phase('face'); await page.locator('#boardPlay').click(); await page.waitForFunction(() => nightmareBoard.state.audio.musicTrack === 'nightmare-theme');
  await page.locator('#backBanner').click(); assert.equal((await state()).audio.musicTrack, 'dream-banner');
  await page.locator('#boardSound').click(); assert.equal((await state()).audio.active, 0); assert.equal((await state()).audio.retiring, 0);
  await page.locator('[data-pull="1"]').click(); await page.locator('#confirmPull').click(); await page.waitForFunction(() => nightmareBoard.state.playing);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const name of ['hands', 'emerge', 'wrap', 'face', 'pullback', 'hold']) {
    await phase(name, .2); const before = await page.locator('#boardScene').evaluate(c => c.toDataURL());
    await phase(name, .8); assert.equal(await page.locator('#boardScene').evaluate(c => c.toDataURL()), before, `Reduced motion ${name}`);
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const width of [390, 420]) {
    await page.setViewportSize({ width, height: 844 });
    await phase('wrap', .5); if (width === 390) await shot('mobile-wrap');
    await phase('name'); if (width === 390) await shot('mobile-name');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
  }
  assert.deepEqual(errors, []); assert.deepEqual(missing, []);
  const failure = await browser.newPage(), failureErrors = [];
  failure.on('pageerror', e => failureErrors.push(e.message)); await failure.route('**/nightmare-sprites/head.png', route => route.abort());
  await failure.goto(url); await failure.waitForFunction(() => window.nightmareBoard);
  assert.equal((await failure.evaluate(() => nightmareBoard.state)).native, false); assert.equal(await failure.locator('#boardNative').isDisabled(), true);
  assert.match(await failure.locator('#layerStatus').textContent(), /approved schematic remains usable/); assert.deepEqual(failureErrors, []);
  console.log(JSON.stringify({ passed: true, screenshots: screenshots ? 11 : 0, assembly, continuity, errors, missing, checks: 'default sprite art, exact native assembly, empty void, face-only rise, continuous wrap, grip guides, character music, mute/pause cleanup, reduced motion, 390/420px, asset fallback' }));
} finally { await browser.close(); }
