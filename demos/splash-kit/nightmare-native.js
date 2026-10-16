import { sampleSpriteScene, HANDS } from './nightmare-sprite-model.js';

// Paint the entire shot on ONE native-pixel stage, then enlarge it uniformly.
// This replaces the schematic drawing; it never pastes sprites over its hands.
export async function loadNightmareNative() {
  const names = ['pose-0', 'pose-1', 'pose-2', 'head', 'body', 'left', 'right', 'curtain', 'wrap', 'battlefield', 'shadow',
    ...['left', 'right'].flatMap(s => [`hand-${s}-open`, `hand-${s}-back`, `hand-${s}-front`])];
  const images = Object.fromEntries(await Promise.all(names.map(async name => {
    const image = new Image(); image.src = new URL(`assets/nightmare-sprites/${name}.png`, import.meta.url); await image.decode(); return [name, image];
  })));
  const stage = document.createElement('canvas'), c = stage.getContext('2d'); stage.width = 160;
  function background(height) {
    // Crop, don't distort the game's 256x176 battlefield into a new aspect ratio.
    c.drawImage(images.battlefield, 48, 153 - height, 160, height, 0, 0, 160, height);
    // Keep source stars around Nightmare; clear a readable text lane on the left.
    c.fillStyle = '#040204'; c.fillRect(0, 0, 61, height);
    for (let x = 61; x < 78; x++) for (let y = 0; y < height; y++) if ((x + y) % 4 < (78 - x) / 6) c.fillRect(x, y, 1, 1);
  }
  function transform(camera) {
    c.translate(camera.x, camera.y); c.rotate(camera.roll); c.scale(camera.scale, camera.scale); c.translate(-39, -18);
  }
  function pose(camera, frame = 0, bodyReveal = 1, separateHands = false) {
    c.save(); transform(camera);
    if (!separateHands && bodyReveal === 1) c.drawImage(images[`pose-${frame}`], 0, 0);
    else {
      c.save(); c.beginPath(); c.rect(0, 0, 82, 76 * bodyReveal); c.clip(); c.drawImage(images.body, 0, 0); c.restore();
      c.drawImage(images.head, 0, 0);
      if (!separateHands) { c.drawImage(images.left, 0, 0); c.drawImage(images.right, 0, 0); }
    }
    c.restore();
  }
  function hand(grip, layer, release = 0, height = 90) {
    const { side, anchor, scale, lift } = grip, contact = HANDS[side].grip;
    const y = anchor.y + (1 - lift) * (height + 22 - anchor.y);
    c.save(); c.translate(anchor.x, y); c.scale(scale, scale);
    c.drawImage(images[`hand-${side}-${release >= .35 || !grip.held ? 'open' : layer}`], -contact[0], -contact[1]); c.restore();
  }
  function cloth(grip, frame, kind = 'curtain') {
    c.save(); c.translate(Math.round(grip.anchor.x), Math.round(grip.anchor.y));
    if (grip.side === 'right') c.scale(-1, 1);
    c.drawImage(images[kind], frame * 84, 0, 84, 160, -82, -64, 84, 160); c.restore();
  }
  function edgeMagic(height, time, reduced) {
    const tick = reduced ? 0 : Math.floor(time * 9);
    for (let i = 0; i < 16; i++) {
      const side = i % 2, x = side ? 158 - i % 7 : 2 + i % 7, y = (i * 17 + tick) % height;
      c.fillStyle = ['#1c5ed4', '#742afc', '#fcfefc'][i % 3]; c.fillRect(x, y, 1, i % 4 ? 1 : 3);
    }
  }
  return { render(state, board, { banner = false, reduced = false, guides = false } = {}, canvas, target) {
    const phase = banner ? 'banner' : state.phase;
    const phases = ['banner', 'sweep', 'covered', 'hands', 'open', 'dark', 'emerge', 'wrap', 'face', 'pullback', 'adjust', 'lock', 'rarity', 'name', 'hold', 'resume'];
    if (!phases.includes(phase) && !(phase === 'lineup' && board.receipt.results.length === 1)) return false;
    const height = Math.round(160 * canvas.height / canvas.width);
    if (stage.height !== height) stage.height = height;
    c.setTransform(1, 0, 0, 1, 0, 0); c.imageSmoothingEnabled = false; c.fillStyle = '#040204'; c.fillRect(0, 0, 160, height);
    const s = sampleSpriteScene(banner ? { phase } : state, height, reduced);
    const curtains = ['sweep', 'covered', 'hands', 'open', 'dark'].includes(phase);
    if (curtains) {
      if (['hands', 'open', 'dark'].includes(phase)) for (const grip of s.grips) if (grip.held) hand(grip, 'back', 0, height);
      for (const grip of s.grips) cloth(grip, s.clothFrame);
      if (['hands', 'open', 'dark'].includes(phase)) for (const grip of s.grips) hand(grip, 'front', 0, height);
    } else if (phase === 'emerge') {
      c.save(); c.beginPath(); c.rect(0, 0, 160, height * .81); c.clip();
      c.translate(80, s.headY); c.scale(2.5, 2.5); c.drawImage(images.head, -39, -18); c.restore();
      // A stepped opaque darkness mask, not a translucent character image.
      for (let y = Math.floor(height * .68); y < height * .81; y++) for (let x = 0; x < 160; x++) {
        if ((x * 3 + y) % 8 < (y - height * .68) / (height * .13) * 8) { c.fillStyle = '#040204'; c.fillRect(x, y, 1, 1); }
      }
    } else {
      const wrap = phase === 'wrap';
      if (!wrap || s.wrap > .65) {
        background(height);
        if (wrap) { c.fillStyle = '#040204'; c.fillRect(0, 0, 160, height * (1 - (s.wrap - .65) / .35)); }
      }
      // Native silhouette, enlarged with its original aspect ratio intact.
      if (!wrap || s.wrap > .65) { c.save(); c.beginPath(); c.rect(0, 0, 160, height - 21); c.clip(); c.drawImage(images.shadow, 69, -50, 78, 152); c.restore(); }
      const frame = !reduced && ['hold', 'lineup'].includes(phase) ? Math.floor(state.time * 6) % 3 : 0;
      pose(s.camera, frame, wrap ? s.bodyReveal : 1, wrap);
      if (wrap) {
        for (const grip of s.grips) hand(grip, 'back', s.release, height);
        for (const grip of s.grips) cloth(grip, s.clothFrame, 'wrap');
        for (const grip of s.grips) hand(grip, 'front', s.release, height);
      }
      if (!banner && !wrap) edgeMagic(height, state.time, reduced);
    }
    if (board?.receipt.results.length === 10 && ['pullback', 'adjust', 'lock', 'rarity', 'name', 'hold', 'resume'].includes(phase)) {
      c.fillStyle = '#040204'; c.fillRect(0, height - 9, 160, 9);
      board.receipt.results.forEach((r, i) => {
        const revealed = i <= state.beat.index, x = Math.round(8 + i * 16);
        c.fillStyle = revealed ? { R: '#65ccff', SR: '#d8dfeb', SSR: '#ffcf49', UR: '#d3c3ff' }[r.rarity] : '#353044';
        if (revealed) { c.fillRect(x - 1, height - 8, 2, 2); c.fillRect(x - 2, height - 5, 4, 4); }
        else c.fillRect(x, height - 3, 1, 1);
      });
    }
    if (guides && (curtains || phase === 'wrap')) for (const g of s.grips) { c.strokeStyle = '#ffcf49'; c.strokeRect(Math.round(g.anchor.x) - 2, Math.round(g.anchor.y) - 2, 4, 4); }
    target.setTransform(1, 0, 0, 1, 0, 0); target.imageSmoothingEnabled = false;
    target.drawImage(stage, 0, 0, canvas.width, canvas.height);
    return true;
  } };
}
