// Presentation-only QA: no paid pulls, save writes or final-audio claims.
import { createRequire } from 'node:module';
import { existsSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.POCKET_PLAYWRIGHT_MODULE || 'playwright');
const out = process.argv[2] || 'out/pull-blueprint-02';
mkdirSync(out, { recursive: true });
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || ['/usr/bin/chromium', '/usr/bin/chromium-browser'].find(existsSync);
const browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  const seek = t => page.locator('#scrubber').evaluate((e, t) => { e.value = t; e.dispatchEvent(new Event('input', { bubbles: true })); }, t);
  const style = sel => page.locator(sel).evaluate(e => ({ opacity: getComputedStyle(e).opacity, color: getComputedStyle(e).backgroundColor, background: getComputedStyle(e).backgroundImage, display: getComputedStyle(e).display, transform: e.style.transform }));
  const visibleFigure = () => page.waitForFunction(() => getComputedStyle(document.querySelector('.figure')).opacity === '1');
  const shot = name => page.locator('#stage').screenshot({ path: `${out}/${name}.png` });
  await page.goto('http://localhost:8080/demos/splash-kit/blueprint.html');
  await page.locator('[data-scenario="ur"]').waitFor();
  const saved = await page.evaluate(() => JSON.stringify({ ...localStorage }));
  for (const tier of ['r', 'sr', 'ssr', 'ur']) {
    await page.locator(`[data-scenario="${tier}"]`).click();
    await seek(2400); await shot(`${tier}-omen`);
    const mote = await style('.mote');
    if (tier === 'sr') assert.equal(mote.color, 'rgb(219, 229, 240)');
    if (tier === 'ur') assert.ok(mote.background.includes('linear-gradient'));
    if (['ssr', 'ur'].includes(tier)) {
      await seek(tier === 'ur' ? 4600 : 4300);
      assert.equal((await style('.figure')).opacity, '0');
      assert.equal((await style('.nameplate')).opacity, '0');
      await shot(`${tier}-voice`);
    }
    await page.locator('#skipBtn').click(); await visibleFigure(); await shot(`${tier}-hold`);
  }
  await page.locator('[data-scenario="ssr"]').click();
  const positions = [];
  for (const time of [760, 1000, 1350, 1760, 2170, 2580, 3000, 3200]) {
    await seek(time);
    positions.push(await page.locator('.mote').evaluate(e => [parseFloat(e.style.left), parseFloat(e.style.top)]));
  }
  assert.ok(positions[0][0] === 50 && positions[0][1] === 81);
  assert.ok(positions[1][0] > 43 && positions[1][1] < 73, 'Launch rises through the pipe opening before bending left.');
  assert.ok(positions[2][0] === 17 && positions[3][1] < 36 && positions[4][0] > 82 && positions[5][1] > 80 && positions[6][0] === 17, 'The carrier completes all four sides of the orbit.');
  assert.ok(positions[7][0] > 17 && positions[7][1] < 58, 'Approach curves from the orbit toward the screen.');
  await page.locator('#areaSelect').selectOption('mushroom'); await seek(2400);
  assert.equal((await style('.pipe')).display, 'block');
  assert.equal((await style('.fountain')).display, 'none');
  assert.ok((await page.locator('#stageVisual').textContent()).includes('Question Block'));
  await shot('mushroom-omen');
  await page.locator('[data-scenario="ten"]').click();
  for (const [time, count] of [[4300, 1], [5000, 2], [5700, 3], [6700, 4], [7400, 5], [9400, 6], [10400, 7], [11100, 8], [12100, 9], [12800, 10]]) {
    await seek(time); await visibleFigure();
    assert.equal(await page.locator('.seals .revealed').count(), count);
  }
  await shot('ten-arrival'); await page.locator('#skipBtn').click();
  assert.equal(await page.locator('.seals .revealed').count(), 10); await shot('ten-results');
  await page.locator('#playBtn').click();
  await page.waitForFunction(() => document.querySelector('#stage').dataset.phase === 'gather');
  await page.locator('#playBtn').click();
  const paused = await page.locator('#clock').textContent();
  await page.waitForTimeout(150); assert.equal(await page.locator('#clock').textContent(), paused);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await seek(1350); const still = (await style('.mote')).transform;
  await seek(3200); assert.equal((await style('.mote')).transform, still);
  await page.locator('#skipBtn').click(); assert.equal(await page.locator('.seals .revealed').count(), 10);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 1280);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#areaSelect').selectOption('dream'); await page.locator('[data-scenario="ur"]').click();
  await seek(2400); await page.screenshot({ path: `${out}/mobile-page.png`, fullPage: true }); await shot('mobile-ur-omen');
  await page.locator('#skipBtn').click(); await visibleFigure(); await shot('mobile-ur-hold');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
  assert.equal(await page.evaluate(() => JSON.stringify({ ...localStorage })), saved);
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ passed: true, errors, positions, mobileOverflow: false, storageUnchanged: true, checks: 'four rarities, two areas, complete orbit and approach, ten individual fighter arrivals, voice-before-art, skip, replay, pause, reduced motion' }));
} finally { await browser.close(); }
