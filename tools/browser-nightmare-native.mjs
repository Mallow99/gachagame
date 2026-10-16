import { createRequire } from 'node:module';
import { existsSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url), { chromium } = require(process.env.POCKET_PLAYWRIGHT_MODULE || 'playwright');
const out = process.argv[2] || 'out/nightmare-native-01', url = process.argv[3] || 'http://localhost:8080/demos/splash-kit/nightmare.html';
const screenshots = !process.argv.includes('--no-screenshots'); mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: ['/usr/bin/chromium', '/usr/bin/chromium-browser'].find(existsSync), args: ['--no-sandbox', '--disable-gpu'] });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1050 } }), errors = [], missing = [];
  page.on('pageerror', e => errors.push(e.message)); page.on('response', r => { if (r.status() >= 400) missing.push(r.url()); });
  await page.goto(url); await page.waitForFunction(() => window.nightmareBoard); await page.evaluate(() => document.fonts.ready);
  await page.locator('#boardNative').check();
  const state = () => page.evaluate(() => nightmareBoard.state);
  const shot = name => screenshots && page.locator('#boardStage').screenshot({ path: `${out}/${name}.png` });
  const phase = (name, p = .5) => page.evaluate(({ name, p }) => { const b = nightmareBoard.state.board.beats.find(b => b.phase === name); nightmareBoard.seek(b.start + b.duration * p); }, { name, p });
  assert.equal((await state()).native, true); await shot('banner-native');
  assert.ok(await page.evaluate(async () => {
    for (const name of ['face', 'hand-left', 'hand-right', 'torso']) {
      const image = new Image(); image.src = `assets/nightmare-native/${name}.png`; await image.decode();
      const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
      const c = canvas.getContext('2d'); c.drawImage(image, 0, 0); const data = c.getImageData(0, 0, image.width, image.height).data;
      if (data[3] !== 0) return false;
      for (let i = 0; i < data.length; i += 4) if (data[i] === 4 && data[i + 1] === 2 && data[i + 2] === 4 && data[i + 3]) return false;
    }
    return true;
  }), 'Sheet backdrop must be truly transparent, not black rectangles');
  await page.locator('#nativePieces').evaluate(e => e.open = true);
  if (screenshots) await page.locator('#nativePieces').screenshot({ path: `${out}/source-pieces.png` });
  await page.locator('#nativePieces').evaluate(e => e.open = false);
  await page.locator('#boardSound').click(); await page.waitForFunction(() => nightmareBoard.state.audio.loaded.length === 8);
  assert.equal((await state()).audio.musicTrack, 'dream-banner'); assert.ok((await state()).audio.active > 0);
  await page.locator('[data-pull="1"]').click(); await page.locator('#confirmPull').click();
  await page.waitForFunction(() => nightmareBoard.state.playing);
  assert.ok((await state()).audio.retiring > 0);
  await page.waitForFunction(() => nightmareBoard.state.audio.retiring === 0 && nightmareBoard.state.audio.musicTrack === 'dream');
  await page.locator('#boardPlay').click(); assert.equal((await state()).audio.active, 0);
  const receipt = JSON.stringify((await state()).receipt);
  await page.locator('#cameraGuides').uncheck();
  for (const [name, p] of [['hands', .8], ['dark', .5], ['emerge', .92], ['wrap', .65], ['wrap', .9999], ['face', .1], ['name', .5]]) {
    await phase(name, p); await shot(name === 'wrap' ? p < .9 ? 'wrap-return' : 'wrap-end' : name);
    if (!['name'].includes(name)) assert.equal(await page.locator('#identityName').isVisible(), false);
    if (name === 'dark') assert.deepEqual(await page.locator('#boardScene').evaluate(c => Array.from(c.getContext('2d').getImageData(c.width / 2, c.height / 3, 1, 1).data)), [4, 3, 11, 255]);
    if (name === 'emerge') assert.deepEqual(await page.locator('#boardScene').evaluate(c => Array.from(c.getContext('2d').getImageData(c.width * .65, c.height * .8, 1, 1).data)), [4, 3, 11, 255]);
  }
  await phase('wrap', .99999); await page.locator('#boardScene').evaluate(c => { window.wrapPixels = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; });
  await phase('face', 0);
  const continuity = await page.locator('#boardScene').evaluate(c => {
    const p = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let sum = 0, count = 0;
    // Edge chevrons intentionally begin with the camera shot; compare the
    // actual figure, not those separately authored screen effects.
    for (let y = Math.floor(c.height * .1); y < c.height * .9; y++) for (let x = Math.floor(c.width * .25); x < c.width * .75; x++) for (let channel = 0; channel < 4; channel++) { const i = (y * c.width + x) * 4 + channel; sum += Math.abs(p[i] - wrapPixels[i]); count++; }
    return sum / count;
  });
  assert.ok(continuity < .02, `Native figure wrap/face difference ${continuity}`);
  await phase('name');
  await page.locator('#boardExplode').check(); await shot('exploded-parts');
  const exploded = await page.locator('#boardScene').evaluate(c => c.toDataURL());
  await page.locator('#boardExplode').uncheck(); assert.notEqual(await page.locator('#boardScene').evaluate(c => c.toDataURL()), exploded);
  assert.equal(JSON.stringify((await state()).receipt), receipt);
  await phase('face', .5); await page.locator('#boardPlay').click();
  await page.waitForFunction(() => nightmareBoard.state.audio.musicTrack === 'nightmare-theme');
  await page.locator('#backBanner').click(); assert.equal((await state()).audio.musicTrack, 'dream-banner');
  await page.locator('#boardSound').click(); assert.equal((await state()).audio.active, 0); assert.equal((await state()).audio.retiring, 0);
  await page.locator('[data-pull="1"]').click(); await page.locator('#confirmPull').click(); await page.waitForFunction(() => nightmareBoard.state.playing);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const name of ['hands', 'emerge', 'wrap', 'face', 'pullback', 'hold']) {
    await phase(name, .2); const before = await page.locator('#boardScene').evaluate(c => c.toDataURL());
    await phase(name, .8); assert.equal(await page.locator('#boardScene').evaluate(c => c.toDataURL()), before, `Native reduced motion ${name}`);
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const width of [390, 420]) {
    await page.setViewportSize({ width, height: 844 });
    await phase('wrap', .8); if (width === 390) await shot('mobile-wrap');
    await phase('name'); if (width === 390) { await shot('mobile-name'); if (screenshots) await page.screenshot({ path: `${out}/mobile-page.png`, fullPage: true }); }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
  }
  assert.deepEqual(errors, []); assert.deepEqual(missing, []);
  const failure = await browser.newPage(), failureErrors = [];
  failure.on('pageerror', e => failureErrors.push(e.message)); await failure.route('**/nightmare-native/face.png', route => route.abort());
  await failure.goto(url); await failure.waitForFunction(() => window.nightmareBoard);
  assert.equal((await failure.evaluate(() => nightmareBoard.state)).native, false); assert.equal(await failure.locator('#boardNative').isDisabled(), true);
  assert.match(await failure.locator('#layerStatus').textContent(), /approved schematic remains usable/);
  assert.deepEqual(failureErrors, []); await failure.close();
  console.log(JSON.stringify({ passed: true, screenshots: screenshots ? 13 : 0, continuity, errors, missing, checks: 'native head/hands/torso, transparent sheet backdrop, distinct banner/pull themes, source-era character track, bounded crossfade retirement, immediate pause/mute cleanup, independent exploded pieces, same receipt/order, hidden identity/empty void, native reduced motion, 390/420px no overflow, native asset failure fallback' }));
} finally { await browser.close(); }
