import { createRequire } from 'node:module';
import { existsSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.POCKET_PLAYWRIGHT_MODULE || 'playwright');
const out = process.argv[2] || 'out/nightmare-board-02';
const url = process.argv[3] || 'http://localhost:8080/demos/splash-kit/nightmare.html';
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
  const shot = name => page.locator('#boardStage').screenshot({ path: `${out}/${name}.png` });
  const saved = await page.evaluate(() => JSON.stringify({ ...localStorage }));
  await page.screenshot({ path: `${out}/desktop-banner-page.png`, fullPage: true });
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
  for (const name of ['sweep', 'covered', 'hands', 'open', 'dark', 'emerge', 'face', 'pullback', 'lock', 'rarity', 'name']) {
    await phase(name); if (!['rarity', 'name'].includes(name)) assert.equal(await page.locator('#boardIdentity').isVisible(), false);
    if (name === 'rarity') assert.equal(await page.locator('#identityName').isVisible(), false);
    if (['covered', 'hands', 'open', 'dark', 'emerge', 'face', 'pullback', 'name'].includes(name)) await shot(name);
    if (['open', 'dark'].includes(name)) {
      assert.equal((await state()).sample.nightmareVisible, false);
      // The curtain gap is actual empty black, not a hidden/grid-backed figure.
      assert.deepEqual(await page.locator('#boardScene').evaluate(c => Array.from(c.getContext('2d').getImageData(Math.floor(c.width / 2), Math.floor(c.height / 3), 1, 1).data)), [4, 3, 11, 255]);
    }
  }
  await phase('pullback', .2); const zoom = (await state()).sample.zoom;
  await phase('pullback', .8); assert.ok((await state()).sample.zoom < zoom);
  await page.locator('#next').click(); assert.equal((await state()).sample.phase, 'lock');
  await page.locator('#previous').click(); assert.equal((await state()).sample.phase, 'pullback');
  await page.locator('#boardPlay').click(); await page.waitForFunction(() => nightmareBoard.state.playing);
  await page.locator('#boardPlay').click(); const paused = (await state()).time; await page.waitForTimeout(100); assert.equal((await state()).time, paused);
  await page.locator('#boardSkip').click(); assert.equal((await state()).sample.results.length, 1);
  assert.equal(await page.locator('#boardResult').isVisible(), true);
  await page.locator('#backBanner').click();
  // A previous successful dialog must not make an Escape cancellation replay.
  await page.locator('[data-pull="1"]').click(); await page.keyboard.press('Escape'); assert.equal((await state()).banner, true);
  await begin(10); const receipt = JSON.stringify((await state()).receipt);
  await phase('ssr', .2); assert.equal(await page.locator('#identityName').isVisible(), false);
  await phase('ssr', .9); assert.equal(await page.locator('#identityName').textContent(), 'King Dedede'); await shot('ssr-baseline');
  for (const [id, ceiling] of [['blue', 0], ['silver', 1], ['gold', 2], ['rainbow', 3]]) {
    await goBeat(id); const at = (await state()).time;
    const lights = await page.evaluate(async at => { const { sampleResultLights } = await import('./nightmare-board-model.js'); return sampleResultLights(at, nightmareBoard.state.receipt.results); }, at);
    const expected = (await state()).receipt.results.map(r => Math.min(ceiling, ['R', 'SR', 'SSR', 'UR'].indexOf(r.rarity)));
    assert.deepEqual(lights.map(l => l.rank), expected);
    assert.deepEqual(await page.locator('#lightOrder li').evaluateAll(items => items.map(li => Number(li.dataset.rank))), expected);
  }
  await goBeat('rainbow'); await page.screenshot({ path: `${out}/ten-rainbow-page.png`, fullPage: true });
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
  for (const name of ['sweep', 'hands', 'open', 'dark', 'emerge', 'face', 'pullback']) {
    await phase(name, .2); const before = await page.locator('#boardScene').evaluate(c => c.toDataURL());
    await phase(name, .8); assert.equal(await page.locator('#boardScene').evaluate(c => c.toDataURL()), before, `Reduced motion ${name}`);
    assert.equal((await state()).sample.zoom, 1); assert.equal((await state()).sample.roll, 0);
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const width of [390, 420]) {
    await page.setViewportSize({ width, height: 844 }); await page.locator('#backBanner').click();
    if (width === 390) await page.screenshot({ path: `${out}/mobile-banner-page.png`, fullPage: true });
    await begin(10); await phase('hands'); if (width === 390) await shot('mobile-hands');
    await phase('open'); if (width === 390) await shot('mobile-open-void');
    await phase('emerge'); if (width === 390) await shot('mobile-emergence');
    await phase('name'); if (width === 390) await page.screenshot({ path: `${out}/mobile-name-page.png`, fullPage: true });
    await page.locator('#boardSkip').click(); if (width === 390) await shot('mobile-lineup');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
  }
  assert.equal(await page.evaluate(() => JSON.stringify({ ...localStorage })), saved);
  assert.deepEqual(errors, []); assert.deepEqual(missing, []);
  console.log(JSON.stringify({ passed: true, errors, missing, singleDuration: one.total, tenDuration: originalTotal, screenshots: 19, checks: 'banner confirmation and cancel, single/ten, per-result cumulative cues, empty black curtain gap before emergence, looming cloak/face/pullback before identity, step/scrub/pause/replay/skip, immutable fixture, high-only filter, UR resume, reduced motion, 390/420px no overflow, no storage writes' }));
} finally { await browser.close(); }
