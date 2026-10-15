// Summon theater: the rarity-escalating sequence before a reveal (Canvas 2D).
// Every pull starts as the same blue mote from the fountain; each higher tier
// adds one beat: SR turns it gold, SSR turns the gold mote into a Warp Star,
// UR turns the Warp Star rainbow. The tier is only readable as it escalates.

const RANK = { R: 0, SR: 1, SSR: 2, UR: 3 };
const LENGTH = { R: 2.0, SR: 2.75, SSR: 4.0, UR: 4.6 };
const BLUE = [90, 180, 255], GOLD = [255, 210, 63];
const clamp01 = x => Math.min(1, Math.max(0, x));
const ease = x => 1 - Math.pow(1 - clamp01(x), 3);
const mix = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
const rgba = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const hsl = (h, a = 1) => `hsla(${h % 360},95%,68%,${a})`;

function starPath(ctx, R, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r : R;
    ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
  }
  ctx.closePath();
}

/** Plays the summon in real time. @returns {{ done: Promise<void>, skip(): void }} */
export function playSummon(canvas, options) {
  const scene = summonRenderer(canvas, options);
  let start = performance.now(), raf = 0, finish;
  const done = new Promise(res => { finish = res; });
  const frame = now => {
    const t = (now - start) / 1000;
    scene.render(t);
    if (t >= scene.total) { finish(); return; }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return {
    done,
    skip() {
      cancelAnimationFrame(raf);
      const ctx = canvas.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#fffcf0'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      finish();
    },
  };
}

/** Draws the summon at any time t (seconds); used by playSummon and by review tools. */
export function summonRenderer(canvas, { tier, background, reducedMotion = false }) {
  const ctx = canvas.getContext('2d');
  const rank = RANK[tier], total = reducedMotion ? 0.9 : LENGTH[tier];
  // Beat times (seconds). Unused beats sit past the end.
  const upgradeAt = rank >= 1 ? 1.5 : 99, starAt = rank >= 2 ? 2.25 : 99, rainbowAt = rank >= 3 ? 2.95 : 99;
  const releaseAt = rank === 0 ? 1.5 : rank === 1 ? 2.2 : 99;
  const flightAt = rank === 2 ? 2.55 : rank === 3 ? 3.2 : 99;
  const inward = Array.from({ length: 70 }, (_, i) => ({ a: (i * 2.399) % (Math.PI * 2), r: 0.25 + ((i * 37) % 23) / 40, s: 0.8 + ((i * 13) % 7) / 6, o: (i * 0.137) % 1 }));
  const trail = [];

  function render(t) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.round(canvas.clientWidth * dpr), H = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    const S = H / 720;

    if (reducedMotion) {
      ctx.fillStyle = '#05030c'; ctx.fillRect(0, 0, W, H);
      const c = rank >= 1 ? GOLD : BLUE;
      const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, H * 0.4);
      g.addColorStop(0, rgba(c, 0.9)); g.addColorStop(1, rgba(c, 0));
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = `rgba(255,255,255,${clamp01((t - 0.5) / 0.4)})`; ctx.fillRect(0, 0, W, H);
      return;
    }

    const charge = clamp01((t - 0.6) / 0.9) + (rank >= 1 ? clamp01((t - 1.5) / 0.7) : 0);
    const shake = (t < Math.min(releaseAt, flightAt) ? Math.min(1, charge * 0.6) : 0) * 6 * S;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, (Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

    // Fountain, darkening as the charge builds.
    const iw = background.width, ih = background.height, k = Math.max(W / iw, H / ih) * (1.04 + t * 0.012);
    ctx.drawImage(background, (W - iw * k) / 2, (H - ih * k) / 2, iw * k, ih * k);
    ctx.fillStyle = `rgba(8,4,20,${Math.min(0.88, 0.5 + charge * 0.2)})`; ctx.fillRect(-20, -20, W + 40, H + 40);

    // Mote colour: blue, then gold at the SR beat; rainbow hue after the UR beat.
    const goldK = clamp01((t - upgradeAt) / 0.25);
    let col = mix(BLUE, GOLD, goldK);
    const rainbow = t >= rainbowAt;
    const hue = (t - rainbowAt) * 220;

    // Rise from the fountain basin.
    const rise = ease(t / 0.6);
    let mx = W / 2, my = H * (0.72 - 0.3 * rise);
    if (t < 0.9) {
      const beam = ctx.createLinearGradient(0, H * 0.75, 0, my);
      beam.addColorStop(0, rgba(col, 0)); beam.addColorStop(1, rgba(col, 0.35 * (1 - clamp01((t - 0.5) / 0.4))));
      ctx.fillStyle = beam; ctx.fillRect(mx - 18 * S, my, 36 * S, H * 0.75 - my);
    }

    // Inward streaks while charging.
    if (t > 0.5 && t < Math.min(releaseAt, starAt) + 0.1) {
      ctx.lineCap = 'round';
      for (const p of inward) {
        const f = (t * p.s * 0.9 + p.o) % 1, rad = (1 - f) * p.r * H;
        const x = mx + Math.cos(p.a) * rad, y = my + Math.sin(p.a) * rad * 0.8;
        const x2 = mx + Math.cos(p.a) * rad * 0.82, y2 = my + Math.sin(p.a) * rad * 0.8 * 0.82;
        ctx.strokeStyle = rgba(col, 0.7 * f * clamp01((t - 0.5) * 2)); ctx.lineWidth = 2.2 * S;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
      }
    }

    // Rings at each upgrade beat.
    for (const [at, c] of [[0.6, BLUE], [upgradeAt, GOLD], [starAt, GOLD], [rainbowAt, [255, 255, 255]]]) {
      const age = t - at;
      if (age < 0 || age > 0.7) continue;
      ctx.strokeStyle = at === rainbowAt ? hsl(hue, 1 - age / 0.7) : rgba(c, 1 - age / 0.7);
      ctx.lineWidth = (10 - age * 12) * S;
      ctx.beginPath(); ctx.arc(mx, my, (30 + ease(age / 0.7) * 380) * S, 0, Math.PI * 2); ctx.stroke();
    }

    const flight = t >= flightAt ? clamp01((t - flightAt) / (total - flightAt - 0.35)) : 0;
    const morph = clamp01((t - starAt) / 0.3);

    if (morph <= 0) {
      // Glowing mote.
      const pulse = 1 + Math.sin(t * 18) * 0.08 * charge;
      const r = (8 + charge * 10) * S * pulse;
      const g = ctx.createRadialGradient(mx, my, 0, mx, my, r * 6);
      g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.18, rgba(col, 0.95)); g.addColorStop(1, rgba(col, 0));
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mx, my, r * 6, 0, Math.PI * 2); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    } else {
      // Warp Star: swoops up and right, loops, then dives at the camera.
      const p = ease(flight);
      const ang = p * Math.PI * 1.6;
      mx = W / 2 + Math.sin(ang) * W * 0.26 * (1 - p * 0.6);
      my = H * 0.42 - Math.sin(ang * 0.5) * H * 0.2 + p * p * H * 0.1;
      const size = (26 + morph * 30 + Math.pow(flight, 3) * 520) * S;
      trail.push({ x: mx, y: my, s: size, h: hue });
      if (trail.length > 32) trail.shift();
      // Three-strand ribbon (pink / gold / cyan, or rainbow for UR), tapering toward the tail.
      ctx.lineCap = 'round';
      const strands = [-0.28, 0, 0.28];
      const strandCol = [[255, 140, 210], GOLD, [127, 240, 255]];
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1], b = trail[i], k = i / trail.length;
        const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
        strands.forEach((o, j) => {
          const off = o * b.s * k;
          ctx.strokeStyle = rainbow ? hsl(b.h + j * 120 + i * 9, 0.6 * k) : rgba(strandCol[j], 0.6 * k);
          ctx.lineWidth = b.s * 0.3 * k;
          ctx.beginPath(); ctx.moveTo(a.x + nx * off, a.y + ny * off); ctx.lineTo(b.x + nx * off, b.y + ny * off); ctx.stroke();
        });
      }
      ctx.save();
      ctx.translate(mx, my); ctx.rotate(-0.25 + Math.sin(t * 6) * 0.08 + (1 - morph) * 2.4); ctx.scale(morph, morph);
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.6);
      glow.addColorStop(0, rainbow ? hsl(hue, 0.6) : 'rgba(255,230,120,0.6)'); glow.addColorStop(1, 'rgba(255,230,120,0)');
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(0, 0, size * 1.6, 0, Math.PI * 2); ctx.fill();
      starPath(ctx, size, size * 0.48);
      const body = ctx.createLinearGradient(0, -size, 0, size);
      if (rainbow) { for (let i = 0; i <= 6; i++) body.addColorStop(i / 6, hsl(hue + i * 55)); }
      else { body.addColorStop(0, '#fff6b0'); body.addColorStop(0.55, '#ffd23f'); body.addColorStop(1, '#f6a21a'); }
      ctx.fillStyle = body; ctx.fill();
      ctx.lineJoin = 'round'; ctx.lineWidth = size * 0.09; ctx.strokeStyle = rainbow ? 'rgba(255,255,255,.9)' : '#c76a12'; ctx.stroke();
      ctx.restore();

      // Radial speed lines during the dive.
      if (flight > 0) {
        ctx.strokeStyle = `rgba(255,255,255,${0.35 * flight})`; ctx.lineWidth = 2 * S;
        for (let i = 0; i < 40; i++) {
          const a = i * 2.399 + t * 0.3, r0 = (0.35 + ((i * 7) % 5) * 0.06) * W, r1 = r0 + W * 0.25;
          ctx.beginPath(); ctx.moveTo(W / 2 + Math.cos(a) * r0, H / 2 + Math.sin(a) * r0); ctx.lineTo(W / 2 + Math.cos(a) * r1, H / 2 + Math.sin(a) * r1); ctx.stroke();
        }
      }
    }

    // Flashes: small pops at each beat, then the whiteout that hands over to the reveal.
    let flash = 0;
    for (const at of [upgradeAt, starAt, rainbowAt]) { const age = t - at; if (age >= 0 && age < 0.22) flash = Math.max(flash, 0.4 * Math.pow(1 - age / 0.22, 2)); }
    const outAt = Math.min(releaseAt, total - 0.4);
    flash = Math.max(flash, clamp01((t - outAt) / 0.35));
    if (flash > 0) { ctx.fillStyle = `rgba(255,252,240,${flash})`; ctx.fillRect(-20, -20, W + 40, H + 40); }
    ctx.restore();
  }

  return { render, total };
}
