import { CUE, TIERS } from './cue-model.js';

// One event list drives the live mix and the offline audition. No timers survive
// a stop: even future oscillator/buffer starts belong to the active source set.
export function cueAudioEvents(timeline, tier) {
  const events = [
    { at: .05, kind: 'confirm' }, { at: .25, kind: 'gather' }, { at: CUE.launch, kind: 'launch' },
    ...[['silver', CUE.silver, 1], ['gold', CUE.gold, 2], ['rainbow', CUE.rainbow, 3]].filter(([, , rank]) => TIERS.indexOf(tier) >= rank).map(([kind, at]) => ({ kind, at: at + timeline.delay })),
    { at: CUE.approach + timeline.delay, kind: 'approach' }, { at: timeline.impact, kind: 'impact' },
  ];
  for (const s of timeline.segments.filter(s => !s.skipped)) {
    if (s.high) {
      events.push({ at: s.start, kind: 'voice', segment: s });
      for (const fraction of [0, .34, .68]) events.push({ at: s.start + s.quote + (s.entrance + s.close) * fraction, kind: 'camera', pan: fraction === .34 ? .3 : -.3 });
      events.push({ at: s.start + s.quote + s.entrance + s.close + s.pull, kind: 'lock' });
    } else events.push({ at: s.start, kind: 'arrival', rarity: s.result.rarity });
    const stampAt = s.start + s.quote + s.entrance + s.close + s.pull + s.settle;
    events.push({ at: stampAt, kind: 'badge', rarity: s.result.rarity });
    events.push({ at: stampAt + .3, kind: 'name', rarity: s.result.rarity });
  }
  events.push({ at: timeline.lineup, kind: 'lineup' });
  const silences = [[CUE.contact + timeline.delay - .35, timeline.impact + .3],
    ...timeline.segments.filter(s => s.high && !s.skipped).map(s => [s.start - .18, s.start + s.quote + .08])].sort((a, b) => a[0] - b[0]);
  let cursor = .12;
  for (const [start, end] of silences) {
    if (start > cursor) events.push({ at: cursor, end: start, kind: 'music' });
    cursor = Math.max(cursor, end);
  }
  if (cursor < timeline.total) events.push({ at: cursor, end: timeline.total, kind: 'music' });
  return events.sort((a, b) => a.at - b.at);
}

function scheduleMix(ctx, buffers, timeline, { tier, area, time = 0, rate = 1, volume = .65 }, destination) {
  const active = new Set();
  const master = ctx.createGain(), limiter = ctx.createDynamicsCompressor();
  master.gain.value = volume; limiter.threshold.value = -9; limiter.knee.value = 8; limiter.ratio.value = 5; limiter.attack.value = .003; limiter.release.value = .15;
  master.connect(limiter); limiter.connect(destination);
  const origin = ctx.currentTime + .025;
  const events = cueAudioEvents(timeline, tier);
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const samples = noiseBuffer.getChannelData(0);
  let seed = 214013;
  for (let i = 0; i < samples.length; i++) { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; samples[i] = seed / 2147483648 - 1; }
  function track(source, nodes, when, duration, offset) {
    active.add(source);
    source.onended = () => { active.delete(source); source.disconnect(); nodes.forEach(n => n.disconnect()); };
    if (offset !== undefined) source.start(when, offset, duration); else { source.start(when); source.stop(when + duration + .015); }
  }
  function envelope(when, duration, amplitude) {
    const gain = ctx.createGain(); gain.gain.setValueAtTime(.0001, when);
    gain.gain.exponentialRampToValueAtTime(Math.max(.0002, amplitude), when + .008);
    gain.gain.exponentialRampToValueAtTime(.0001, when + duration); gain.connect(master); return gain;
  }
  function tone(when, frequency, duration, amplitude, type = 'sine', end = frequency) {
    const osc = ctx.createOscillator(), gain = envelope(when, duration, amplitude);
    osc.type = type; osc.frequency.setValueAtTime(frequency, when); osc.frequency.exponentialRampToValueAtTime(end, when + duration);
    osc.connect(gain); track(osc, [gain], when, duration);
  }
  function noise(when, duration, amplitude, start, end, pan = 0) {
    const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = envelope(when, duration, amplitude), panner = ctx.createStereoPanner();
    source.buffer = noiseBuffer; source.loop = true; filter.type = 'bandpass'; filter.Q.value = .7;
    filter.frequency.setValueAtTime(start, when); filter.frequency.exponentialRampToValueAtTime(end, when + duration); panner.pan.value = pan;
    source.connect(filter); filter.connect(panner); panner.connect(gain); track(source, [filter, panner, gain], when, duration);
  }
  function chord(when, frequencies, amp = .07, duration = .65) { frequencies.forEach((f, i) => { tone(when + i * .045, f, duration, amp, 'sine'); tone(when + i * .045, f * 2.01, duration * .5, amp * .2); }); }
  for (const event of events) {
    const when = origin + Math.max(0, (event.at - time) / rate);
    if (event.kind === 'voice') {
      const buffer = buffers[area === 'dream' ? 'dedede' : 'bowser'];
      const offset = Math.max(0, time - event.at);
      if (!buffer || offset >= buffer.duration || time > event.at + event.segment.quote) continue;
      const source = ctx.createBufferSource(), gain = ctx.createGain(); source.buffer = buffer; gain.gain.value = .9;
      source.connect(gain); gain.connect(master); track(source, [gain], when, buffer.duration - offset, offset); continue;
    }
    if (event.kind === 'music') {
      const buffer = buffers[area];
      if (!buffer || event.end <= time) continue;
      const at = Math.max(time, event.at), offset = at / rate;
      const duration = Math.min((event.end - at) / rate, buffer.duration - offset);
      if (duration <= 0) continue;
      const begin = origin + (at - time) / rate;
      const source = ctx.createBufferSource(), gain = ctx.createGain(); source.buffer = buffer;
      const fade = Math.min(.12, duration / 3);
      gain.gain.setValueAtTime(0, begin); gain.gain.linearRampToValueAtTime(.55, begin + fade);
      gain.gain.setValueAtTime(.55, begin + duration - fade); gain.gain.linearRampToValueAtTime(0, begin + duration);
      source.connect(gain); gain.connect(master); track(source, [gain], begin, duration, offset); continue;
    }
    if (event.at < time - .015) continue;
    switch (event.kind) {
      case 'confirm': tone(when, 340, .12, .1, 'triangle', 160); break;
      case 'gather': noise(when, .95, .08, 500, 2400); chord(when + .1, [587, 880, 1174], .018, .8); break;
      case 'launch': noise(when, .55, .13, 400, 3500); tone(when, 180, .45, .05, 'sine', 720); break;
      case 'silver': chord(when, [440, 660, 880]); noise(when, .3, .09, 4000, 1400); break;
      case 'gold': chord(when, [523.25, 783.99, 1046.5], .09, .85); tone(when, 100, .3, .13, 'sine', 55); break;
      case 'rainbow': chord(when, [659.25, 830.61, 987.77, 1318.5], .08, 1); break;
      case 'approach': noise(when, .82 / rate, .2, 700, 6500); tone(when, 85, .75 / rate, .08, 'sine', 250); break;
      case 'impact': tone(when, 95, .55, .3, 'sine', 32); noise(when, .2, .28, 7000, 700); noise(when + .06, .55, .11, 1800, 300); break;
      case 'camera': noise(when, .19, .11, 1800, 5200, event.pan); tone(when, 160, .15, .05, 'triangle', 80); break;
      case 'lock': tone(when, 82, .25, .15, 'sine', 42); noise(when, .07, .1, 1800, 600); break;
      case 'arrival': noise(when, .2, .07, 800, 2800); tone(when + .1, 130, .17, .1, 'sine', 65); break;
      case 'badge': chord(when, event.rarity === 'SSR' ? [392, 493.88, 587.33] : [440, 660], .05, .3); break;
      case 'name': chord(when, area === 'dream' ? [587.33, 739.99, 880] : [523.25, 659.25, 783.99], event.rarity === 'SSR' ? .06 : .025, event.rarity === 'SSR' ? .7 : .3); break;
      case 'lineup': chord(when, [293.66, 440, 587.33], .04, .9); break;
    }
  }
  return { active, master, stop() { for (const source of [...active]) { try { source.stop(); } catch {} } active.clear(); master.disconnect(); limiter.disconnect(); } };
}

export function cueAudio(manifest, base, music) {
  let ctx, buffers = {}, mix, generation = 0, enabled = false, musicArea;
  return {
    async enable() {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) throw Error('Audio is unavailable in this browser.');
      ctx ||= new AudioCtx(); await ctx.resume(); enabled = true;
      if (!buffers.dedede || !buffers.dream) {
        const entries = await Promise.all([...Object.entries(manifest).map(([name, asset]) => [name, asset, base]),
          ...Object.entries(music.manifest).map(([name, asset]) => [name, asset, music.base])].map(async ([name, asset, assetBase]) => {
          const response = await fetch(new URL(asset.url, assetBase)); if (!response.ok) throw Error('Audio asset could not load.');
          return [name, await ctx.decodeAudioData(await response.arrayBuffer())];
        }));
        buffers = Object.fromEntries(entries);
      }
    },
    play(time, timeline, options) { this.stop(); if (enabled && ctx?.state === 'running') { musicArea = options.area; mix = scheduleMix(ctx, buffers, timeline, { ...options, time }, ctx.destination); } },
    stop() { mix?.stop(); mix = null; generation++; },
    volume(value) { if (mix) mix.master.gain.setTargetAtTime(value, ctx.currentTime, .02); },
    get state() { return { enabled, context: ctx?.state || 'not-started', active: mix?.active.size || 0, generation, loaded: Object.keys(buffers), musicArea: mix ? musicArea : null }; },
    async audition(timeline, options) {
      const offline = new OfflineAudioContext(2, Math.ceil((timeline.total + 2) * 44100), 44100);
      scheduleMix(offline, buffers, timeline, options, offline.destination);
      return offline.startRendering();
    },
  };
}
