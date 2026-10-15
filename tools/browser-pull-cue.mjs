import { createRequire } from 'node:module';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.POCKET_PLAYWRIGHT_MODULE || 'playwright');
const out = process.argv[2] || 'out/pull-cue-04';
const url = process.argv[3] || 'http://localhost:8080/demos/splash-kit/cue.html';
const screenshots = !process.argv.includes('--no-screenshots');
mkdirSync(out, { recursive: true });
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || ['/usr/bin/chromium', '/usr/bin/chromium-browser'].find(existsSync);
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox', '--disable-gpu'] });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1300 } });
  const errors = [], missing = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400) missing.push(new URL(r.url()).pathname); });
  await page.goto(url);
  const ready = () => page.waitForFunction(() => window.cueReview?.state.ready);
  await ready();
  const state = () => page.evaluate(() => cueReview.state);
  const seek = time => page.evaluate(time => cueReview.seek(time), time);
  const shot = name => screenshots && page.locator('#cueStage').screenshot({ path: `${out}/${name}.png` });
  const before = await page.evaluate(() => JSON.stringify({ ...localStorage }));
  const receipt = JSON.stringify((await state()).results);
  assert.equal((await state()).tier, 'SSR');
  assert.match(await page.locator('#musicTrack').textContent(), /Fountain of Dreams.*Adventure/);
  await seek(.9); await shot('fountain-launch');
  await seek(2.2); await shot('smooth-launch-join'); await seek(6.4); await shot('smooth-approach-join');
  await seek(6.6); assert.equal((await state()).lights[9].rank, 2); assert.equal(await page.locator('#urNotice').isVisible(), false); await shot('ssr-gold');
  await page.locator('[data-tier="UR"]').click(); await ready();
  assert.equal(await page.locator('#urNotice').isVisible(), true);
  for (const [time, rank, name] of [[2.3, 0, 'blue'], [3.9, 1, 'silver'], [5.3, 2, 'gold'], [6.6, 3, 'rainbow']]) {
    await seek(time); const s = await state();
    assert.ok(s.lights.slice(0, 9).every(l => l.rank === 0 && !l.signal)); assert.equal(s.lights[9].rank, rank); await shot(`ten-${name}`);
  }
  const timeline = await page.evaluate(() => cueReview.timeline), high = timeline.segments.find(s => s.high);
  assert.equal(high.quote, 4.8);
  await seek(high.start + high.quote - .1); assert.equal(await page.locator('#hero').isVisible(), false); await shot('quote-concealed');
  await seek(high.start + high.quote + .2); assert.equal((await state()).phase, 'screen'); await shot('dedede-star-cut');
  const artAt = high.start + high.quote + high.screen, camera = high.entrance + high.close;
  for (const [fraction, name] of [[.15, 'low'], [.38, 'high'], [.83, 'center']]) {
    await seek(artAt + camera * fraction); assert.equal(await page.locator('#heroPlate').isVisible(), false); await shot(`angle-${name}`);
  }
  await seek(artAt + camera + high.pull * .5); assert.equal((await state()).phase, 'pullback'); assert.equal(await page.locator('#heroPlate').isVisible(), false); await shot('pullback');
  const stampAt = artAt + camera + high.pull + high.settle;
  await seek(stampAt + .1); assert.equal(await page.locator('#heroIdentity').isVisible(), false); await shot('letters-first');
  await seek(stampAt + high.nameDelay + high.nameDuration / 2); assert.equal(await page.locator('#heroIdentity').isVisible(), true); await shot('name-building');
  await page.locator('#cueStage').click(); await page.waitForFunction(() => cueReview.state.playing && cueReview.state.name === 1);
  assert.notEqual((await state()).phase, 'lineup'); await page.locator('#play').click();
  await seek(stampAt + high.nameDelay + high.nameDuration + .1); assert.equal((await state()).name, 1); await shot('name-after-lock');
  console.log('Camera / identity snapshots checked.');
  await page.locator('#skip').click(); assert.equal((await state()).revealed, 10); assert.equal((await state()).audio.active, 0); await shot('ten-lineup');
  await page.locator('#highOnly').check();
  const filtered = await page.evaluate(() => cueReview.timeline);
  assert.ok(filtered.total < timeline.total); assert.equal(filtered.segments.filter(s => !s.skipped).length, 1);
  assert.equal(JSON.stringify((await state()).results), receipt);
  await page.locator('#cueStage').click();
  await page.waitForFunction(() => cueReview.state.playing && cueReview.state.phase === 'quote');
  assert.ok((await state()).audio.active > 0);
  assert.deepEqual((await state()).audio.loaded.sort(), ['bowser', 'dedede', 'dedede-theme', 'dream', 'mushroom', 'nightmare-theme']);
  assert.equal((await state()).audio.musicArea, 'dream');
  await page.locator('#cueStage').press('Enter'); await page.waitForFunction(() => cueReview.state.phase.startsWith('angle'));
  assert.equal(await page.locator('#heroPlate').isVisible(), false);
  const filteredHigh = filtered.segments.find(s => s.high);
  await seek(filteredHigh.start + filteredHigh.quote + filteredHigh.screen + .1);
  await page.locator('#advance').click(); await page.waitForFunction(() => cueReview.state.playing);
  const advanced = await state();
  // Seek pauses the shot before the click, avoiding a race with the short
  // automatic camera sequence on a software-rendered test browser.
  assert.ok(advanced.elapsed >= filteredHigh.start + filteredHigh.quote + filteredHigh.screen + filteredHigh.entrance + filteredHigh.close, JSON.stringify(advanced));
  assert.ok(advanced.elapsed < filteredHigh.end);
  assert.equal(advanced.audio.musicTrack, 'dedede-theme');
  await page.locator('#play').click(); assert.equal((await state()).audio.active, 0);
  const paused = (await state()).elapsed; await page.waitForTimeout(150); assert.equal((await state()).elapsed, paused);
  await page.locator('#skip').click(); assert.equal((await state()).revealed, 10); assert.equal((await state()).audio.active, 0);
  console.log('SSR-only, click / keyboard advance and pause checked.');
  await page.locator('#highOnly').uncheck(); await page.locator('[data-count="1"]').click(); await ready();
  for (const tier of ['R', 'SR', 'SSR', 'UR']) {
    await page.locator(`[data-tier="${tier}"]`).click(); await ready(); await seek(6);
    assert.equal((await state()).lights[0].rank, ['R', 'SR', 'SSR', 'UR'].indexOf(tier)); await shot(`single-${tier.toLowerCase()}`);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await seek(3.2); const still = await page.locator('#cueCanvas').evaluate(c => c.toDataURL()); await seek(3.3); assert.equal(await page.locator('#cueCanvas').evaluate(c => c.toDataURL()), still);
  const one = await page.evaluate(() => cueReview.timeline.segments[0]); await seek(one.start + one.quote + .5); assert.equal((await state()).zoom, 1); assert.equal((await state()).roll, 0);
  const foregroundStill = await page.locator('#payoffCanvas').evaluate(c => c.toDataURL()); await seek(one.start + one.quote + .55);
  assert.equal(await page.locator('#payoffCanvas').evaluate(c => c.toDataURL()), foregroundStill);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.locator('[data-tier="SSR"]').click(); await ready();
  // Render the same mixer offline for an inspectable WAV and objective peak check.
  const audition = await page.evaluate(async () => {
    const buffer = await cueReview.audition(), channels = buffer.numberOfChannels, frames = buffer.length;
    const data = Array.from({ length: channels }, (_, i) => buffer.getChannelData(i));
    const bytes = new ArrayBuffer(44 + frames * channels * 2), view = new DataView(bytes);
    const str = (at, s) => [...s].forEach((c, i) => view.setUint8(at + i, c.charCodeAt(0)));
    str(0, 'RIFF'); view.setUint32(4, bytes.byteLength - 8, true); str(8, 'WAVE'); str(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, channels, true); view.setUint32(24, buffer.sampleRate, true); view.setUint32(28, buffer.sampleRate * channels * 2, true); view.setUint16(32, channels * 2, true); view.setUint16(34, 16, true); str(36, 'data'); view.setUint32(40, bytes.byteLength - 44, true);
    let peak = 0, square = 0;
    for (let i = 0; i < frames; i++) for (let c = 0; c < channels; c++) { const sample = data[c][i]; peak = Math.max(peak, Math.abs(sample)); square += sample * sample; view.setInt16(44 + (i * channels + c) * 2, Math.max(-1, Math.min(1, sample)) * 32767, true); }
    const array = new Uint8Array(bytes); let binary = ''; for (let i = 0; i < array.length; i += 16384) binary += String.fromCharCode(...array.subarray(i, i + 16384));
    return { peak, rms: Math.sqrt(square / frames / channels), duration: buffer.duration, base64: btoa(binary) };
  });
  assert.ok(audition.peak > .05 && audition.peak < .95); assert.ok(audition.rms > .003);
  writeFileSync(`${out}/mix-audition.wav`, Buffer.from(audition.base64, 'base64')); delete audition.base64;
  await seek(1); await page.locator('#play').click(); await page.waitForFunction(() => cueReview.state.playing); await page.locator('#sound').uncheck();
  assert.equal((await state()).audio.active, 0); await page.locator('#skip').click();
  await page.locator('#area').selectOption('mushroom'); await ready(); await seek(6); await shot('mushroom-carrier');
  assert.match(await page.locator('#musicTrack').textContent(), /Running About.*Super Mario Bros/);
  const mushroomMix = await page.evaluate(async () => {
    const b = await cueReview.audition(); let peak = 0, square = 0;
    for (const sample of b.getChannelData(0)) { peak = Math.max(peak, Math.abs(sample)); square += sample * sample; }
    return { peak, rms: Math.sqrt(square / b.length) };
  });
  assert.ok(mushroomMix.peak > .05 && mushroomMix.peak < .95);
  assert.notEqual(mushroomMix.rms.toFixed(5), audition.rms.toFixed(5));
  await page.locator('#sound').check(); await seek(1); await page.locator('#play').click();
  await page.waitForFunction(() => cueReview.state.playing && cueReview.state.audio.musicArea === 'mushroom');
  await page.locator('[data-count="10"]').click(); await ready();
  assert.equal((await state()).audio.active, 0); assert.equal((await state()).audio.musicArea, null);
  await page.setViewportSize({ width: 390, height: 844 }); await page.locator('#area').selectOption('dream'); await ready();
  await seek(.9); await shot('mobile-fountain-launch'); await seek(6); await shot('mobile-gold'); if (screenshots) await page.screenshot({ path: `${out}/mobile-page.png`, fullPage: true });
  const mobile = await page.evaluate(() => cueReview.timeline.segments.find(s => s.high)), mobileArt = mobile.start + mobile.quote + mobile.screen;
  await seek(mobileArt - mobile.screen * .6); await shot('mobile-star-cut');
  await seek(mobileArt + .2); await shot('mobile-low-slant'); await seek(mobileArt + (mobile.entrance + mobile.close) * .8); await shot('mobile-face-closeup');
  const mobileStamp = mobileArt + mobile.entrance + mobile.close + mobile.pull + mobile.settle;
  await seek(mobileStamp + mobile.nameDelay + mobile.nameDuration + .1); await shot('mobile-dedede-name');
  await page.locator('#skip').click(); await shot('mobile-lineup');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390); assert.equal(await page.evaluate(() => JSON.stringify({ ...localStorage })), before);
  assert.deepEqual(errors, []); assert.deepEqual(missing, []);
  const failure = await browser.newPage(); await failure.route('**/display/*.webp', route => route.abort()); await failure.goto(url);
  await failure.waitForFunction(() => document.querySelector('#loading').textContent.includes('Reload to retry')); assert.equal(await failure.locator('#play').isDisabled(), true); await failure.close();
  console.log(JSON.stringify({ passed: true, errors, missing, storageUnchanged: true, quoteSeconds: high.quote, audition, mushroomMix, checks: 'Smooth joins, separate sourced area music, SSR default and UR-only rainbow, tenth cue, angled shots, hidden badge/name until lock, SSR-only filter preserves receipt, click/keyboard advance, audio decode/play/stop/mute, both offline mixes, reduced motion, both areas, 390px layout, asset failure' }));
} finally { await browser.close(); }
