import { createRequire } from 'node:module';
import { existsSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.POCKET_PLAYWRIGHT_MODULE || 'playwright');
const out = process.argv[2] || 'out/nightmare-board-04';
const url = process.argv[3] || 'http://localhost:8080/demos/splash-kit/nightmare.html';
const screenshots = !process.argv.includes('--no-screenshots');
mkdirSync(out, { recursive: true });
const executablePath = ['/usr/bin/chromium', '/usr/bin/chromium-browser'].find(existsSync);
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox', '--disable-gpu'] });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1100 } });
  const errors = [], missing = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400) missing.push(r.url()); });
  await page.goto(url); await page.waitForFunction(() => window.nightmareBoard); await page.evaluate(() => document.fonts.ready);
  const state = () => page.evaluate(() => nightmareBoard.state);
  const seek = t => page.evaluate(t => nightmareBoard.seek(t), t);
  const shot = name => screenshots && page.locator('#boardStage').screenshot({ path: `${out}/${name}.png` });
  const fullShot = name => screenshots && page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
  const saved = await page.evaluate(() => JSON.stringify({ ...localStorage }));
  await page.locator('#boardNative').uncheck();
  await page.locator('#boardSound').click(); await page.waitForFunction(() => nightmareBoard.state.audio.loaded.length === 8);
  assert.equal((await state()).audio.musicTrack, 'dream-banner');
  await fullShot('desktop-banner-page');
  assert.equal(await page.locator('#boardTransport').isVisible(), false);
  await page.locator('[data-pull="1"]').click(); assert.equal(await page.locator('#pullConfirm').isVisible(), true);
  await page.locator('#pullConfirm button[value="cancel"]').click(); assert.equal((await state()).banner, true);
  async function begin(count) {
    await page.locator(`[data-pull="${count}"]`).click(); await page.locator('#confirmPull').click();
    await page.waitForFunction(() => nightmareBoard.state.playing); await page.locator('#boardPlay').click();
  }
  await begin(1);
  const one = (await state()).board;
  const phase = async (name, p = .5) => { const beat = (await state()).board.beats.find(b => b.phase === name); await seek(beat.start + beat.duration * p); };
  const goBeat = async id => { const beat = (await state()).board.beats.find(b => b.id === id); await seek(beat.start + beat.duration * .5); };
  await phase('call'); assert.equal(await page.locator('#boardIdentity').isVisible(), false); await shot('concealed-call');
  for (const name of ['sweep', 'covered', 'hands', 'open', 'dark', 'emerge', 'wrap', 'face', 'pullback', 'adjust', 'lock', 'rarity', 'name']) {
    await phase(name, name === 'emerge' ? .7 : name === 'wrap' ? .9 : .5); if (!['rarity', 'name'].includes(name)) assert.equal(await page.locator('#boardIdentity').isVisible(), false);
    if (name === 'rarity') assert.equal(await page.locator('#identityName').isVisible(), false);
    if (['covered', 'hands', 'open', 'dark', 'emerge', 'wrap', 'face', 'pullback', 'adjust', 'name'].includes(name)) await shot(name);
    if (['open', 'dark'].includes(name)) {
      assert.equal((await state()).sample.nightmareVisible, false);
      // The curtain gap is actual empty black, not a hidden/grid-backed figure.
      assert.deepEqual(await page.locator('#boardScene').evaluate(c => Array.from(c.getContext('2d').getImageData(Math.floor(c.width / 2), Math.floor(c.height / 3), 1, 1).data)), [4, 3, 11, 255]);
    }
  }
  // Measure the visor itself moving upwards, not merely a fade or camera zoom.
  const visor = () => page.locator('#boardScene').evaluate(c => {
    const pixels = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let count = 0, sum = 0;
    for (let i = 0; i < pixels.length; i += 4) if (pixels[i] < 150 && pixels[i + 1] > 110 && pixels[i + 2] > 160) { count++; sum += Math.floor(i / 4 / c.width); }
    return { count, y: sum / count };
  });
  await phase('emerge', .62); const low = await visor(); await shot('face-rise-low');
  await phase('emerge', .92); const high = await visor(); await shot('face-rise-high');
  assert.ok(low.count > 0 && high.count > 0 && high.y < low.y - 30);
  assert.equal((await state()).sample.faceOnly, true); assert.equal((await state()).sample.zoom, 1);
  assert.deepEqual(await page.locator('#boardScene').evaluate(c => Array.from(c.getContext('2d').getImageData(Math.floor(c.width * .65), Math.floor(c.height * .8), 1, 1).data)), [4, 3, 11, 255]);
  await phase('pullback', .2); const zoom = (await state()).sample.zoom;
  await phase('pullback', .8); assert.ok((await state()).sample.zoom < zoom);
  await page.locator('#next').click(); assert.equal((await state()).sample.phase, 'adjust');
  await page.locator('#previous').click(); assert.equal((await state()).sample.phase, 'pullback');
  await page.locator('#boardPlay').click(); await page.waitForFunction(() => nightmareBoard.state.playing);
  await page.locator('#boardPlay').click(); const paused = (await state()).time; await page.waitForTimeout(100); assert.equal((await state()).time, paused);
  await page.locator('#boardSkip').click(); assert.equal((await state()).sample.results.length, 1);
  assert.equal(await page.locator('#boardResult').isVisible(), true);
  await page.locator('#backBanner').click();
  // A previous successful dialog must not make an Escape cancellation replay.
  await page.locator('[data-pull="1"]').click(); await page.keyboard.press('Escape'); assert.equal((await state()).banner, true);
  await begin(10); const receipt = JSON.stringify((await state()).receipt);
  for (const name of ['ssr-face', 'ssr-shower', 'ssr-pullback', 'ssr-lock', 'ssr-rarity', 'ssr-name']) {
    await phase(name, name === 'ssr-shower' ? .65 : .5);
    assert.equal(await page.locator('#identityName').isVisible(), name === 'ssr-name');
    if (['ssr-face', 'ssr-shower', 'ssr-name'].includes(name)) await shot(name);
  }
  assert.equal(await page.locator('#identityName').textContent(), 'King Dedede');
  // Symmetric incoming cloth, and identical panel endpoints at the covered cut.
  const pixel = (x, y) => page.locator('#boardScene').evaluate((c, [x, y]) => Array.from(c.getContext('2d').getImageData(Math.floor(c.width * x), Math.floor(c.height * y), 1, 1).data), [x, y]);
  await phase('sweep', .5); await shot('two-sided-close');
  assert.notDeepEqual(await pixel(.05, .5), [4, 3, 11, 255]); assert.notDeepEqual(await pixel(.95, .5), [4, 3, 11, 255]);
  await page.locator('#cameraGuides').uncheck();
  const rememberPixels = () => page.locator('#boardScene').evaluate(c => { window.comparisonPixels = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; });
  const difference = (region = false) => page.locator('#boardScene').evaluate((c, region) => {
    const actual = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let sum = 0, count = 0;
    for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
      if (region && (x < c.width * .35 || x > c.width * .65 || y < c.height * .2 || y > c.height * .75)) continue;
      for (let channel = 0; channel < 4; channel++) { const i = (y * c.width + x) * 4 + channel; sum += Math.abs(actual[i] - comparisonPixels[i]); count++; }
    }
    return sum / count;
  }, region);
  await phase('sweep', .9999); await rememberPixels();
  await phase('covered', 0); assert.ok(await difference() < .01, 'Continuous closure endpoint');
  await phase('wrap', .45); await shot('hands-return-mid');
  await phase('wrap', .9999); await shot('hands-return-end');
  await rememberPixels();
  await phase('face', 0);
  assert.ok(await difference(true) < .02, 'No figure/head replacement at wrap to face');
  await page.locator('#cameraGuides').check();
  // Each music lane and every future scheduled sound stop with the transport.
  for (const [name, expected] of [['ssr-shower', 'dedede-adventure-theme'], ['wrap', 'nightmare-theme'], ['lineup', 'dream']]) {
    await phase(name, .5); await page.locator('#boardPlay').click();
    await page.waitForFunction(expected => nightmareBoard.state.audio.musicTrack === expected, expected);
    assert.ok((await state()).audio.active > 0);
    await page.locator('#boardPlay').click(); assert.equal((await state()).audio.active, 0);
  }
  await phase('open'); await page.locator('#boardPlay').click(); await page.locator('#boardSound').click();
  assert.equal((await state()).audio.active, 0); await page.locator('#boardPlay').click();
  await page.locator('#boardSound').click(); await page.waitForFunction(() => nightmareBoard.state.sound);
  const audition = await page.evaluate(async () => {
    const buffer = await nightmareBoard.audition(), data = buffer.getChannelData(0);
    let peak = 0, square = 0, silence = 0;
    for (const v of data) { peak = Math.max(peak, Math.abs(v)); square += v * v; }
    const call = nightmareBoard.state.board.beats.find(b => b.phase === 'call' && b.result.rarity === 'SSR');
    for (let i = Math.floor((call.start + 2) * buffer.sampleRate); i < Math.floor((call.end - .1) * buffer.sampleRate); i++) silence = Math.max(silence, Math.abs(data[i]));
    return { peak, rms: Math.sqrt(square / data.length), silence, duration: buffer.duration };
  });
  assert.ok(audition.peak > .05 && audition.peak < .95); assert.ok(audition.rms > .003); assert.ok(audition.silence < .00001);
  for (const [id, ceiling] of [['blue', 0], ['silver', 1], ['gold', 2], ['rainbow', 3]]) {
    await goBeat(id); const at = (await state()).time;
    const lights = await page.evaluate(async at => { const { sampleResultLights } = await import('./nightmare-board-model.js'); return sampleResultLights(at, nightmareBoard.state.receipt.results); }, at);
    const expected = (await state()).receipt.results.map(r => Math.min(ceiling, ['R', 'SR', 'SSR', 'UR'].indexOf(r.rarity)));
    assert.deepEqual(lights.map(l => l.rank), expected);
    assert.deepEqual(await page.locator('#lightOrder li').evaluateAll(items => items.map(li => Number(li.dataset.rank))), expected);
  }
  await goBeat('rainbow'); await fullShot('ten-rainbow-page');
  const originalTotal = (await state()).board.total;
  await phase('arrival');
  await page.locator('#boardHighOnly').check(); assert.ok((await state()).board.total < originalTotal);
  assert.equal((await state()).sample.beat.result.slot, 6);
  assert.equal(JSON.stringify((await state()).receipt), receipt);
  assert.equal((await state()).board.beats.filter(b => b.phase === 'arrival').length, 0);
  await phase('resume'); assert.equal((await state()).sample.beat.result.slot, 8);
  await page.locator('#boardHighOnly').uncheck(); await phase('resume'); await page.locator('#next').click();
  assert.equal((await state()).sample.beat.result.slot, 9);
  await page.locator('#boardSkip').click(); assert.equal((await state()).sample.results.length, 10); assert.equal(await page.locator('#resultList li').count(), 10); await shot('ten-lineup');
  await page.locator('#boardPlay').click(); await page.waitForFunction(() => nightmareBoard.state.playing && nightmareBoard.state.time < 2);
  await page.locator('#boardPlay').click(); assert.equal(JSON.stringify((await state()).receipt), receipt);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const name of ['sweep', 'hands', 'open', 'dark', 'emerge', 'wrap', 'face', 'pullback', 'adjust', 'ssr-shower', 'ssr-pullback']) {
    await phase(name, .2); const before = await page.locator('#boardScene').evaluate(c => c.toDataURL());
    await phase(name, .8); assert.equal(await page.locator('#boardScene').evaluate(c => c.toDataURL()), before, `Reduced motion ${name}`);
    assert.equal((await state()).sample.zoom, 1); assert.equal((await state()).sample.roll, 0);
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const width of [390, 420]) {
    await page.setViewportSize({ width, height: 844 }); await page.locator('#backBanner').click();
    if (width === 390) await fullShot('mobile-banner-page');
    await begin(10); await phase('hands'); if (width === 390) await shot('mobile-hands');
    await phase('ssr-shower', .65); if (width === 390) await shot('mobile-ssr-shower');
    await phase('open'); if (width === 390) await shot('mobile-open-void');
    await phase('emerge', .8); if (width === 390) await shot('mobile-emergence');
    await phase('wrap', .9); if (width === 390) await shot('mobile-wrap');
    await phase('name'); if (width === 390) await fullShot('mobile-name-page');
    await page.locator('#boardSkip').click(); if (width === 390) await shot('mobile-lineup');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
  }
  assert.equal(await page.evaluate(() => JSON.stringify({ ...localStorage })), saved);
  assert.deepEqual(errors, []); assert.deepEqual(missing, []);
  const failure = await browser.newPage(), failureErrors = [];
  failure.on('pageerror', e => failureErrors.push(e.message));
  await failure.route('**/assets/board/waddle-dee.png', route => route.abort());
  await failure.route('**/assets/audio/**/SOURCES.json', route => route.abort());
  await failure.goto(url); await failure.waitForFunction(() => window.nightmareBoard);
  await failure.locator('[data-pull="10"]').click(); await failure.locator('#confirmPull').click();
  await failure.waitForFunction(() => nightmareBoard.state.playing);
  await failure.evaluate(() => { const b = nightmareBoard.state.board.beats.find(b => b.phase === 'ssr-shower'); nightmareBoard.seek(b.start + .8); });
  assert.match(await failure.locator('#sceneLabel').textContent(), /sprite fallback/);
  await failure.locator('#boardSound').click(); assert.match(await failure.locator('#audioStatus').textContent(), /silent storyboard still works/);
  assert.deepEqual(failureErrors, []); await failure.close();
  console.log(JSON.stringify({ passed: true, errors, missing, singleDuration: one.total, tenDuration: originalTotal, screenshots: screenshots ? 30 : 0, audition, visorRise: { low, high }, checks: 'banner confirmation/cancel, single/ten, unchanged per-result cues, symmetric closure with matching endpoint, hands/figure continuity, physical face-only rise, Dedede shower and shorter pullback, identity after lock, eight audio buffers decoded, distinct themes, pause/mute/seek stop all sources, offline peak and silence checks, replay/skip/filter/resume, reduced motion, 390/420px no overflow, no storage writes' }));
} finally { await browser.close(); }
