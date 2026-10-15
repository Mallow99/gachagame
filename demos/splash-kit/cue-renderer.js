import { CUE, COLOURS, TIERS, clamp, flightPoint, sampleLights } from './cue-model.js';

const fract = x => x - Math.floor(x);
const seed = i => fract(Math.sin(i * 127.1 + 13.7) * 43758.5453);
const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
const colour = (rank, blend = 1) => {
  const a = rgb(COLOURS[Math.max(0, rank - 1)]), b = rgb(COLOURS[rank]);
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * blend)).join(',')})`;
};

function star(ctx, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5, radius = i % 2 ? r * .46 : r;
    ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
  }
  ctx.closePath();
}

export function cueRenderer(canvas, background, foreground) {
  const ctx = canvas.getContext('2d');
  const fx = foreground.getContext('2d');
  let W = 1280, H = 720, S = 1;
  function glow(x, y, radius, c, alpha = 1) {
    if (radius <= 0 || alpha <= 0) return;
    ctx.save(); ctx.globalAlpha *= alpha;
    const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, c); g.addColorStop(.15, c); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2); ctx.restore();
  }

  function dededeScreen(time, reveal, reduced) {
    if (reveal.segment?.payoff !== 'dedede' || reveal.phase === 'quote') return;
    const age = time - reveal.segment.start - reveal.segment.quote;
    fx.save();
    const shade = fx.createRadialGradient(W * .5, H * .46, H * .15, W * .5, H * .46, W * .68);
    shade.addColorStop(0, 'transparent'); shade.addColorStop(.65, '#09020e10'); shade.addColorStop(1, '#05020eb3');
    fx.fillStyle = shade; fx.fillRect(0, 0, W, H);
    // Fine gold rays live around the frame, leaving the face and name clear.
    fx.translate(W * .5, H * .46);
    for (let i = 0; i < 20; i++) {
      const a = i * Math.PI / 10 + (reduced ? 0 : age * .018);
      const inner = H * (.46 + seed(i) * .2), outer = inner + H * (.1 + seed(i + 4) * .18);
      fx.strokeStyle = '#ffcf49'; fx.globalAlpha = .08 + seed(i + 8) * .1; fx.lineWidth = S;
      fx.beginPath(); fx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner); fx.lineTo(Math.cos(a) * outer, Math.sin(a) * outer); fx.stroke();
    }
    fx.restore();
    if (!reduced && reveal.phase === 'screen') {
      const open = reveal.screen, radius = Math.hypot(W, H) * 2.3 * (open * open * (3 - 2 * open));
      fx.save(); fx.fillStyle = '#05020e'; fx.fillRect(0, 0, W, H);
      fx.translate(W * .5, H * .46); fx.globalCompositeOperation = 'destination-out';
      star(fx, radius); fx.fill();
      fx.globalCompositeOperation = 'source-over'; fx.globalAlpha = (1 - open) * .9;
      fx.strokeStyle = '#ffe5a0'; fx.lineWidth = 3 * S; star(fx, radius); fx.stroke(); fx.restore();
    }
  }

  function environment(time, area, reduced, reveal) {
    const base = ctx.createLinearGradient(0, 0, W, H);
    base.addColorStop(0, '#20133e'); base.addColorStop(1, '#020710');
    ctx.fillStyle = base; ctx.fillRect(0, 0, W, H);
    if (area === 'dream') {
      const k = Math.max(W / background.width, H / background.height) * (reduced ? 1.04 : 1.04 + Math.sin(time * .11) * .015);
      ctx.globalAlpha = reveal ? .22 : .65;
      // The central bowl's lip is at source y=.47. Anchor it at the launch
      // point, rather than centering the whole image above the emitter.
      const by = H * .76 - background.height * k * .47;
      ctx.drawImage(background, (W - background.width * k) / 2, by, background.width * k, background.height * k);
      ctx.globalAlpha = 1;
      const sky = ctx.createLinearGradient(0, Math.max(0, by), 0, by + H * .22);
      sky.addColorStop(0, '#160d2b'); sky.addColorStop(1, '#160d2b00');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, by + H * .22);
      glow(W * .5, H * .76, W * .11, '#71d6ff', reveal ? .05 : .18);
      if (!reveal) {
        ctx.strokeStyle = '#a5e9ff66'; ctx.lineWidth = S;
        for (let i = 0; i < 3; i++) { const wave = reduced ? i / 3 : fract(time * .35 + i / 3); ctx.globalAlpha = (1 - wave) * .6; ctx.beginPath(); ctx.ellipse(W * .5, H * .76, W * (.03 + wave * .09), H * (.009 + wave * .025), 0, 0, Math.PI * 2); ctx.stroke(); }
        ctx.globalAlpha = 1;
      }
    } else {
      for (let i = 0; i < 8; i++) {
        const x = (i * .16 - .1) * W, y = H * (.51 + seed(i) * .15), bw = W * .12;
        ctx.fillStyle = '#1c455447'; ctx.beginPath(); ctx.roundRect(x, y, bw, H * .6, [bw / 2, bw / 2, 0, 0]); ctx.fill();
      }
      const pw = W * .115, px = W * .5 - pw / 2, py = H * .76;
      const pipe = ctx.createLinearGradient(px, 0, px + pw, 0);
      pipe.addColorStop(0, '#12492d'); pipe.addColorStop(.25, '#77bc64'); pipe.addColorStop(.4, '#377749'); pipe.addColorStop(1, '#092e26');
      ctx.fillStyle = pipe; ctx.fillRect(px, py, pw, H * .24);
      ctx.strokeStyle = '#a3ef9c88'; ctx.lineWidth = 2 * S; ctx.strokeRect(px, py, pw, H * .24);
      ctx.fillRect(px - pw * .12, py - H * .025, pw * 1.24, H * .055); ctx.strokeRect(px - pw * .12, py - H * .025, pw * 1.24, H * .055);
      glow(W * .5, py, pw * 1.1, '#65ccff', .2);
    }
    const veil = ctx.createLinearGradient(0, 0, 0, H);
    veil.addColorStop(0, '#09021a55'); veil.addColorStop(.55, '#06041310'); veil.addColorStop(1, '#060212a6');
    ctx.fillStyle = veil; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 75; i++) {
      const twinkle = reduced ? .4 : .3 + .25 * Math.sin(time * .8 + i);
      ctx.fillStyle = `rgba(200,217,255,${twinkle})`;
      const x = seed(i + 15) * W, y = seed(i + 57) * H;
      ctx.fillRect(x, y, (1 + seed(i) * 1.5) * S, S);
    }
  }

  function carrier(light, area, count, time, reduced) {
    const x = light.x * W, y = light.y * H;
    const base = count === 1 ? 18 : light.signal ? 10 : light.index === 0 ? 11 : 5;
    const r = (base + light.rank * 4) * S * light.scale;
    const c = colour(light.rank, light.blend);
    ctx.save(); ctx.globalAlpha = light.alpha; ctx.globalCompositeOperation = 'screen';
    glow(x, y, r * 5.5, c, .34);
    glow(x, y, r * 2, '#f7faff', .55);
    // Short history samples form trails on the exact same orbit, including during scrubbing.
    if (!reduced) for (let j = 28; j > 0; j--) {
      const p = flightPoint(light.local - j * .022), p2 = flightPoint(light.local - (j - 1) * .022);
      ctx.strokeStyle = light.rank === 3 ? `hsl(${j * 17 + time * 40},90%,75%)` : c;
      ctx.globalAlpha = light.alpha * (1 - j / 30) * .55;
      ctx.lineWidth = Math.max(S, r * .35 * (1 - j / 30));
      ctx.beginPath(); ctx.moveTo(p.x * W, p.y * H); ctx.lineTo(p2.x * W, p2.y * H); ctx.stroke();
    }
    ctx.globalAlpha = light.alpha; ctx.globalCompositeOperation = 'source-over'; ctx.translate(x, y);
    if (light.rank >= 2) {
      if (light.rank === 3) {
        ctx.save(); ctx.globalCompositeOperation = 'screen';
        for (const [dx, dy, tint] of [[-.25, .1, '#79f6ff'], [.2, .18, '#ff8adf'], [0, -.22, '#fff394']]) {
          ctx.save(); ctx.translate(r * dx, r * dy); ctx.globalAlpha *= .5; ctx.fillStyle = tint;
          if (area === 'dream') star(ctx, r * 1.15);
          else { ctx.beginPath(); ctx.roundRect(-r * .88, -r * .88, r * 1.76, r * 1.76, r * .15); }
          ctx.fill(); ctx.restore();
        }
        ctx.restore();
      }
      const fill = ctx.createLinearGradient(-r, -r, r, r);
      if (light.rank === 3) { fill.addColorStop(0, '#91f6ff'); fill.addColorStop(.3, '#bda7ff'); fill.addColorStop(.6, '#ffaadd'); fill.addColorStop(.8, '#ffed9b'); fill.addColorStop(1, '#8ff3cb'); }
      else { fill.addColorStop(0, '#fff7c3'); fill.addColorStop(.4, '#ffe26e'); fill.addColorStop(1, '#eea922'); }
      ctx.fillStyle = fill; ctx.strokeStyle = '#fff8d9'; ctx.lineWidth = 1.6 * S;
      if (area === 'dream') { ctx.rotate(reduced ? 0 : Math.sin(time * .65) * .12); star(ctx, r); ctx.fill(); ctx.stroke(); }
      else {
        ctx.beginPath(); ctx.roundRect(-r * .78, -r * .78, r * 1.56, r * 1.56, r * .15); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#5f3f28'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 ${r * 1.25}px Lilita`; ctx.fillText('?', 0, r * .05);
      }
    } else {
      const sphere = ctx.createRadialGradient(-r * .3, -r * .4, r * .05, 0, 0, r);
      sphere.addColorStop(0, '#fff'); sphere.addColorStop(.4, c); sphere.addColorStop(1, light.rank ? '#7687a6' : '#268bdf');
      ctx.fillStyle = sphere; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
      if (light.rank === 1) { ctx.strokeStyle = '#f6faff'; ctx.lineWidth = 2 * S; ctx.beginPath(); ctx.ellipse(0, 0, r * 1.45, r * .55, -.5, 0, Math.PI * 2); ctx.stroke(); }
    }
    if (light.signal) {
      ctx.save(); ctx.globalCompositeOperation = 'screen';
      const shine = ctx.createLinearGradient(-r * 9, 0, r * 9, 0);
      shine.addColorStop(0, 'transparent'); shine.addColorStop(.5, c); shine.addColorStop(1, 'transparent');
      ctx.globalAlpha *= light.rank >= 2 ? .6 : .25; ctx.fillStyle = shine; ctx.fillRect(-r * 9, -S, r * 18, S * 2);
      if (!reduced && light.local > CUE.launch) for (let i = 0; i < 15; i++) {
        const age = fract(time * .75 + seed(i)); const a = seed(i + 7) * Math.PI * 2;
        const d = r * (2 + age * 6); ctx.globalAlpha = light.alpha * (1 - age) * .65;
        ctx.fillStyle = light.rank === 3 ? `hsl(${i * 37},90%,75%)` : c;
        ctx.fillRect(Math.cos(a) * d, Math.sin(a) * d, (1 + seed(i) * 2) * S, (1 + seed(i) * 3) * S);
      }
      ctx.restore();
    }
    if (light.pulse > 0 && !reduced) {
      ctx.strokeStyle = c; ctx.globalAlpha *= light.pulse; ctx.lineWidth = (1 + 2 * light.pulse) * S;
      ctx.beginPath(); ctx.ellipse(0, 0, r * (2 + (1 - light.pulse) * 7), r * (1 + (1 - light.pulse) * 3), -.3, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 12; i++) {
        const a = i * Math.PI / 6, d = r * (2.2 + (1 - light.pulse) * 5);
        ctx.beginPath(); ctx.moveTo(Math.cos(a) * d, Math.sin(a) * d); ctx.lineTo(Math.cos(a) * (d + r * .7), Math.sin(a) * (d + r * .7)); ctx.stroke();
      }
    }
    ctx.restore();
  }

  return {
    render(time, { tier, count, area, reduced, timeline, reveal }) {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight; S = Math.max(.45, Math.min(W / 1280, H / 720));
      const width = Math.round(W * dpr), height = Math.round(H * dpr);
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      if (foreground.width !== width || foreground.height !== height) { foreground.width = width; foreground.height = height; }
      fx.setTransform(dpr, 0, 0, dpr, 0, 0); fx.clearRect(0, 0, W, H);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      const post = time >= timeline.reveal;
      ctx.save();
      if (post && !reduced && reveal.phase !== 'quote') {
        ctx.translate(W * .5, H * .5); ctx.rotate((reveal.roll || 0) * Math.PI / 180 * .35);
        const depth = 1 + (reveal.zoom - 1) * .18; ctx.scale(depth, depth); ctx.translate(-W * .5, -H * .5);
      }
      environment(time, area, reduced, post); ctx.restore();
      const lights = sampleLights(time, tier, count, reduced);
      const signal = lights.at(-1);
      if (time < timeline.impact) {
        ctx.globalCompositeOperation = 'screen';
        glow(W * .5, H * .76, H * .25, '#6bbfff', .22 * (1 - clamp(time / 3)));
        if (count === 10 && !reduced) {
          const visible = lights.filter(l => l.alpha > .1);
          ctx.strokeStyle = '#8bbdff22'; ctx.lineWidth = S; ctx.lineJoin = 'round'; ctx.beginPath();
          if (visible.length) for (let i = 0; i <= 48; i++) {
            const p = flightPoint(visible[0].local + (visible.at(-1).local - visible[0].local) * i / 48);
            i ? ctx.lineTo(p.x * W, p.y * H) : ctx.moveTo(p.x * W, p.y * H);
          }
          ctx.stroke();
        }
        ctx.globalCompositeOperation = 'source-over';
        [...lights].sort((a, b) => a.y - b.y).forEach(light => carrier(light, area, count, time, reduced));
        if (signal.local >= CUE.contact && !reduced) {
          ctx.fillStyle = '#020107'; ctx.fillRect(0, 0, W, H);
        }
      }
      const hit = time - timeline.impact;
      if (hit >= 0 && hit < .75 && !reduced) {
        const rank = TIERS.indexOf(tier), c = COLOURS[rank];
        ctx.fillStyle = '#030209'; ctx.fillRect(0, 0, W, H);
        ctx.save(); ctx.globalCompositeOperation = 'screen';
        const flash = (1 - clamp(hit / .2)) * (rank >= 2 ? .95 : .5);
        glow(W * .5, H * .48, H * (.18 + hit * 1.7), '#fff8e6', flash);
        ctx.strokeStyle = c; ctx.lineWidth = (1 - hit) * 5 * S; ctx.globalAlpha = 1 - clamp(hit / .75);
        ctx.beginPath(); ctx.ellipse(W * .5, H * .48, W * (.03 + hit), H * (.02 + hit * .7), 0, 0, Math.PI * 2); ctx.stroke();
        for (let i = 0; i < 65; i++) {
          const a = seed(i) * Math.PI * 2, d = (80 + seed(i + 1) * 500) * hit * S;
          ctx.strokeStyle = rank === 3 ? `hsl(${i * 29},95%,75%)` : c; ctx.lineWidth = (1 + seed(i) * 2) * S;
          ctx.beginPath(); ctx.moveTo(W * .5 + Math.cos(a) * d, H * .48 + Math.sin(a) * d); ctx.lineTo(W * .5 + Math.cos(a) * (d + 45 * S), H * .48 + Math.sin(a) * (d + 45 * S)); ctx.stroke();
        }
        ctx.restore();
      }
      if (post && reveal.phase !== 'quote') {
        ctx.save(); ctx.globalCompositeOperation = 'screen';
        const c = COLOURS[reveal.segment ? TIERS.indexOf(reveal.segment.result.rarity) : TIERS.indexOf(tier)];
        glow(W * .65, H * .45, H * .6, c, .13);
        if (!reduced) for (let i = 0; i < 30; i++) {
          const x = seed(i + 103) * W, y = (1 - fract(seed(i + 41) + time * .009)) * H;
          glow(x, y, (2 + seed(i) * 4) * S, c, .45);
        }
        ctx.restore();
      }
      dededeScreen(time, reveal, reduced);
      return { lights, rank: signal.rank };
    },
  };
}
