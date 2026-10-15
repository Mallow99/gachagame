import { COLOURS, ease } from './cue-model.js';
import { sampleResultLights, sampleDededeRain } from './nightmare-board-model.js';

const spectrum = ['#8ce7ff', '#beb3ff', '#ffaedb', '#ffe5a0', '#a3efc2'];
function star(c, x, y, r, fill, rotation = 0) {
  c.save(); c.translate(x, y); c.rotate(rotation); c.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r * .44 : r; c.lineTo(Math.cos(a) * d, Math.sin(a) * d); }
  c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); } c.stroke(); c.restore();
}

// Deliberately schematic blocking, not final character art or a production rig.
function hand(c, x, y, scale, angle, pointed = false) {
  c.save(); c.translate(x, y); c.rotate(angle); c.scale(scale, scale);
  c.fillStyle = '#33314f'; c.strokeStyle = '#dfdaee'; c.lineWidth = 2.5;
  c.beginPath(); c.moveTo(-12, 58); c.lineTo(-15, 15); c.lineTo(-28, -5); c.lineTo(-24, -15); c.lineTo(-12, -9);
  c.lineTo(-13, -48); c.quadraticCurveTo(-7, -59, -2, -48); c.lineTo(1, -14);
  if (pointed) { c.lineTo(17, -13); c.lineTo(23, 2); c.lineTo(16, 28); }
  else { c.lineTo(8, -54); c.quadraticCurveTo(15, -61, 18, -49); c.lineTo(16, -13); c.lineTo(29, -42); c.quadraticCurveTo(37, -48, 36, -36); c.lineTo(28, -1); c.lineTo(44, -19); c.quadraticCurveTo(56, -23, 49, -10); c.lineTo(31, 22); c.lineTo(14, 34); }
  c.lineTo(12, 58); c.closePath(); c.fill(); c.stroke();
  c.strokeStyle = '#8e87af'; c.beginPath(); c.moveTo(-10, 8); c.lineTo(8, 2); c.lineTo(24, 11); c.moveTo(0, 25); c.lineTo(5, 9); c.stroke();
  c.restore();
}

function face(c, { x = 0, y = -90, scale = 1, angle = 0 } = {}) {
  c.save(); c.translate(x, y); c.scale(scale, scale); c.rotate(angle); c.strokeStyle = '#c3bfdc'; c.lineWidth = 2;
  c.fillStyle = '#aaa3ba'; c.beginPath(); c.moveTo(-48, -67); c.lineTo(54, -66); c.lineTo(67, -2); c.lineTo(19, 68); c.lineTo(-9, 76); c.lineTo(-14, 31); c.lineTo(-46, 4); c.lineTo(-63, -19); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = '#353044'; c.beginPath(); c.moveTo(-68, -66); c.lineTo(62, -78); c.lineTo(50, -115); c.lineTo(8, -128); c.lineTo(-31, -111); c.closePath(); c.fill(); c.stroke();
  for (const side of [-1, 1]) { c.beginPath(); c.moveTo(side * 44, -86); c.quadraticCurveTo(side * 93, -95, side * 84, -160); c.lineTo(side * 64, -121); c.lineTo(side * 57, -80); c.closePath(); c.fill(); c.stroke(); }
  c.fillStyle = '#65ccff'; c.beginPath(); c.moveTo(-65, -65); c.lineTo(61, -77); c.lineTo(51, -42); c.lineTo(-58, -27); c.closePath(); c.fill(); c.stroke();
  c.strokeStyle = '#302b41'; c.lineWidth = 3; c.beginPath(); c.moveTo(-12, 5); c.quadraticCurveTo(18, 27, 46, -7); c.stroke(); c.restore();
}

function figure(c, { x = 650, y = 285, scale = .76, open = .8, gesture = 0, head = 0, joints = false, wrap = 1 } = {}) {
  c.save(); c.translate(x, y); c.scale(scale, scale); c.strokeStyle = '#c3bfdc'; c.lineWidth = 2;
  // Two separate, complete cape panels pivot from the shoulder anchors.
  for (const side of [-1, 1]) {
    c.save(); c.translate(side * (76 + (1 - wrap) * 650), -30 + (1 - wrap) * 140); c.rotate(side * (.08 + open * .28 + (1 - wrap) * .65)); c.scale(side, 1);
    c.fillStyle = '#25233e'; c.beginPath(); c.moveTo(-20, -40); c.bezierCurveTo(120, -28, 175, 45, 275, 135); c.lineTo(180, 235); c.quadraticCurveTo(92, 280, -15, 255); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = '#77718f'; for (const [sx, sy] of [[100, 70], [172, 143], [62, 185]]) star(c, sx, sy, 17, null);
    c.restore();
  }
  // The body is revealed from below behind the returning opaque cloth, not
  // swapped in at the next beat. The head and hands are outside this mask.
  c.save(); c.beginPath(); c.rect(-400, 300 - wrap * 365, 800, 700); c.clip();
  c.fillStyle = '#10101f'; c.beginPath(); c.moveTo(-90, -65); c.quadraticCurveTo(-125, 95, -120, 255); c.quadraticCurveTo(0, 300, 120, 255); c.quadraticCurveTo(125, 95, 90, -65); c.closePath(); c.fill(); c.stroke();
  c.strokeStyle = '#7d779b'; c.beginPath(); c.moveTo(-62, 10); c.lineTo(-95, 235); c.moveTo(62, 10); c.lineTo(95, 235); c.stroke();
  for (const side of [-1, 1]) {
    c.fillStyle = '#4b4964'; c.beginPath(); c.moveTo(side * 25, -55); c.lineTo(side * 140, -64); c.lineTo(side * 120, -5); c.lineTo(side * 55, 12); c.closePath(); c.fill(); c.stroke();
  }
  c.strokeStyle = '#b9b1cc'; c.beginPath(); c.arc(0, -39, 65, 0, Math.PI); c.stroke();
  c.fillStyle = '#50445e'; c.beginPath(); c.arc(0, 22, 20, 0, Math.PI * 2); c.fill(); c.stroke();
  c.restore();
  face(c, { angle: head });
  hand(c, -550 * (1 - wrap) + (-126 - open * 58) * wrap, 130 * (1 - wrap) + (39 - gesture * 52) * wrap, 1.15, -.45 - gesture * .3);
  hand(c, 550 * (1 - wrap) + (130 + open * 58) * wrap, 130 * (1 - wrap) + (-18 - gesture * 50) * wrap, 1.12, .4 - gesture * .22, true);
  if (joints) {
    c.fillStyle = '#65ccff'; c.strokeStyle = '#65ccff77';
    for (const [px, py] of [[0, -90], [-76, -30], [76, -30], [-126 - open * 58, 39 - gesture * 52], [130 + open * 58, -18 - gesture * 50]]) { c.beginPath(); c.arc(px, py, 4, 0, Math.PI * 2); c.fill(); }
  }
  c.restore();
}

function cloak(c, x, side) {
  c.save(); c.translate(x, 0); c.scale(side, 1);
  c.fillStyle = '#211f38'; c.strokeStyle = '#a29bbd'; c.lineWidth = 3;
  c.beginPath(); c.moveTo(-620, -40); c.lineTo(250, -40); c.bezierCurveTo(170, 125, 280, 355, 195, 650); c.lineTo(-620, 650); c.closePath(); c.fill(); c.stroke();
  c.strokeStyle = '#706987'; for (const [sx, sy, r] of [[-90, 100, 38], [100, 275, 47], [-220, 420, 60], [-380, 160, 35], [50, 520, 30]]) star(c, sx, sy, r, null);
  c.strokeStyle = '#514b68'; c.beginPath(); c.moveTo(120, -10); c.bezierCurveTo(40, 160, 190, 380, 110, 610); c.stroke(); c.restore();
}

function cloakShadow(c, presence = 1) {
  c.save(); c.globalAlpha = presence; c.fillStyle = '#12101e'; c.strokeStyle = '#332a43'; c.lineWidth = 2;
  // One huge silhouette behind the smaller body, not a distorted character.
  c.beginPath(); c.moveTo(390, 25); c.lineTo(405, -85); c.lineTo(470, 10); c.lineTo(630, 10); c.lineTo(705, -85); c.lineTo(685, 25);
  c.bezierCurveTo(760, 30, 890, 95, 1080, 570); c.lineTo(1080, 650); c.lineTo(-80, 650);
  c.bezierCurveTo(110, 200, 215, 50, 390, 25); c.closePath(); c.fill(); c.stroke(); c.restore();
}

function faceDarkness(c, descent = 0) {
  const dark = c.createLinearGradient(0, 355 + descent, 0, 445 + descent);
  dark.addColorStop(0, '#04030b00'); dark.addColorStop(1, '#04030b');
  c.fillStyle = dark; c.fillRect(0, 355 + descent, 1000, 600);
}

function dedede(c, scale, strike) {
  c.save(); c.translate(665, 330); c.scale(scale, scale); c.lineWidth = 3; c.strokeStyle = '#ffcf49';
  c.fillStyle = '#292639'; c.beginPath(); c.ellipse(0, 25, 110, 125, 0, 0, Math.PI * 2); c.fill(); c.stroke();
  c.fillStyle = '#d8c8a3'; c.beginPath(); c.ellipse(-12, -92, 64, 52, 0, 0, Math.PI * 2); c.fill(); c.stroke();
  c.fillStyle = '#c9a553'; c.beginPath(); c.moveTo(-58, -104); c.lineTo(-93, -80); c.lineTo(-51, -69); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = '#3b3046'; c.beginPath(); c.ellipse(2, -136, 65, 25, -.1, 0, Math.PI * 2); c.fill(); c.stroke();
  c.fillStyle = '#fff5da'; c.beginPath(); c.arc(62, -150, 12, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#11101c'; c.fillRect(-39, -115, 7, 17); c.fillRect(-14, -117, 7, 17);
  c.strokeStyle = '#e8d9b4'; c.lineWidth = 9; c.beginPath(); c.moveTo(-75, -32); c.quadraticCurveTo(-105, 50, -65, 128); c.lineTo(75, 128); c.stroke();
  // A rigid hammer/arm blocking pivot, not deformation of a source illustration.
  c.save(); c.translate(83, -5); c.rotate(.3 + strike * 1.9); c.strokeStyle = '#bea37b'; c.lineWidth = 12; c.beginPath(); c.moveTo(0, 25); c.lineTo(10, -110); c.stroke();
  c.fillStyle = '#635143'; c.strokeStyle = '#ffcf49'; c.lineWidth = 3; c.fillRect(-32, -141, 90, 56); c.strokeRect(-32, -141, 90, 56); star(c, 12, -113, 16, '#ffcf49'); c.restore();
  c.restore();
}

export function storyboardScene(canvas, waddleDee) {
  const c = canvas.getContext('2d');
  return function render(state, board, { banner = false, reduced = false, guides = true } = {}) {
    const dpr = Math.min(devicePixelRatio || 1, 2), w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
    if (!w || !h) return;
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    c.setTransform(w / 1000, 0, 0, h / 600, 0, 0); c.clearRect(0, 0, 1000, 600);
    c.fillStyle = '#0c0b19'; c.fillRect(0, 0, 1000, 600);
    c.lineWidth = 1; c.strokeStyle = '#b3acc611';
    for (let x = 0; x <= 1000; x += 50) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 600); c.stroke(); }
    for (let y = 0; y <= 600; y += 50) { c.beginPath(); c.moveTo(0, y); c.lineTo(1000, y); c.stroke(); }
    if (banner) { figure(c, { x: 720, y: 280, scale: .95, open: .75 }); return; }
    const { phase, progress: p, beat } = state;
    if (phase === 'flight') {
      c.strokeStyle = '#a9a2bf44'; c.setLineDash([6, 9]); c.beginPath(); c.ellipse(500, 300, 350, 144, 0, 0, Math.PI * 2); c.stroke(); c.setLineDash([]);
      c.strokeStyle = '#b4c4dc'; c.fillStyle = '#252537'; c.lineWidth = 2;
      c.beginPath(); c.ellipse(500, 456, 85, 18, 0, 0, Math.PI * 2); c.fill(); c.stroke(); c.beginPath(); c.moveTo(415, 456); c.quadraticCurveTo(420, 513, 500, 510); c.quadraticCurveTo(580, 513, 585, 456); c.stroke(); c.strokeRect(480, 510, 40, 55);
      const lights = sampleResultLights(state.time, board.receipt.results, reduced);
      for (const l of lights) {
        if (l.alpha <= .01) continue;
        c.save(); c.globalAlpha = l.alpha; c.strokeStyle = l.rank === 3 ? spectrum[0] : COLOURS[l.rank]; c.lineWidth = 2;
        const x = l.x * 1000, y = l.y * 600, r = Math.min(240, (7 + l.rank * 3) * l.scale);
        if (l.rank >= 2) { if (l.rank === 3) for (let i = 0; i < 5; i++) { c.strokeStyle = spectrum[i]; star(c, x + Math.cos(i) * 3, y + Math.sin(i) * 3, r + 5, null); } c.strokeStyle = l.rank === 3 ? '#fff7df' : COLOURS[l.rank]; star(c, x, y, r, COLOURS[l.rank]); }
        else { c.fillStyle = COLOURS[l.rank]; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); }
        if (board.receipt.results.length > 1 && l.scale < 3) { c.font = '17px Barlow'; c.textAlign = 'center'; c.fillStyle = '#ddd7ea'; c.fillText(String(l.index + 1), x, y + r + 19); }
        c.restore();
      }
    } else if (['blackout', 'call', 'impact'].includes(phase)) {
      c.fillStyle = '#04030b'; c.fillRect(0, 0, 1000, 600);
      if (phase === 'impact') { c.strokeStyle = spectrum[0]; c.lineWidth = 2; star(c, 500, 290, reduced ? 130 : 40 + p * 250, null); }
      else if (phase === 'call') { c.strokeStyle = '#a79ab366'; c.beginPath(); c.moveTo(440, 330); c.lineTo(560, 330); c.stroke(); }
    } else if (['sweep', 'covered', 'hands', 'open', 'dark'].includes(phase)) {
      const opened = state.curtainSpread;
      // The gap is genuinely empty. No figure, backdrop or grid under the cloth.
      c.fillStyle = '#04030b'; c.fillRect(0, 0, 1000, 600);
      cloak(c, 310 - opened * 800, 1); cloak(c, 690 + opened * 800, -1);
      if (['hands', 'open', 'dark'].includes(phase)) {
        const lift = phase === 'hands' ? ease(reduced ? 1 : p) : 1;
        hand(c, 415 - opened * 340, 405 - lift * 85, 1.6, -.3 - opened * .5);
        hand(c, 590 + opened * 335, 400 - lift * 85, 1.6, .3 + opened * .5);
      }
    } else if (phase === 'emerge') {
      c.fillStyle = '#04030b'; c.fillRect(0, 0, 1000, 600);
      cloakShadow(c, .35);
      c.save(); c.beginPath(); c.rect(0, 0, 1000, 440); c.clip();
      face(c, { x: 500, y: state.faceY, scale: 1.35 }); c.restore();
      // Only a rigid head rises. Darkness hides the lower edge, not alpha on
      // individual pieces; no body is ever drawn in this shot.
      faceDarkness(c);
    } else if (state.nightmareVisible) {
      const cinematic = ['face', 'pullback'].includes(phase), zoom = state.zoom;
      c.fillStyle = '#04030b'; c.fillRect(0, 0, 1000, 600);
      cloakShadow(c, phase === 'wrap' ? .35 + state.wrap * .65 : 1);
      // Pullback changes the framing continuously; the full pose is only locked later.
      c.save();
      const close = (zoom - 1) / (1.35 / .76 - 1);
      c.translate(650 - close * 150, 211.6 + close * 113.4 + state.poseY);
      c.rotate(state.roll * Math.PI / 180); c.scale(zoom, zoom);
      figure(c, { x: 0, y: 68.4, scale: .76, open: .9, gesture: .8, head: phase === 'face' && !reduced ? Math.sin(p * Math.PI) * .045 : 0, wrap: phase === 'wrap' ? state.wrap : 1, joints: guides && cinematic }); c.restore();
      if (phase === 'wrap') faceDarkness(c, Math.min(1, state.wrap / .35) * 300);
      c.strokeStyle = '#afa5d066'; c.lineWidth = 2;
      if (phase !== 'wrap') for (let i = 0; i < 8; i++) { const side = i % 2 ? 1 : -1, y = 70 + Math.floor(i / 2) * 140; c.beginPath(); c.moveTo(side < 0 ? 0 : 1000, y); c.lineTo(side < 0 ? 40 : 960, y + 35); c.lineTo(side < 0 ? 20 : 980, y + 65); c.stroke(); }
      if (guides && cinematic) { c.strokeStyle = '#65ccff99'; c.setLineDash([7, 7]); c.strokeRect(385, 115, 300, 245); c.setLineDash([]); }
    } else if (state.dededeVisible) {
      const scale = reduced ? 1 : ['ssr-screen', 'ssr-face', 'ssr-shower'].includes(phase) ? 1.45 : phase === 'ssr-pullback' ? 1.45 - ease(p) * .45 : 1;
      const shower = board.beats.find(b => b.phase === 'ssr-shower');
      const age = state.time - shower.start, strike = reduced || age > .28 ? 1 : age < 0 ? 0 : ease(age / .28);
      c.strokeStyle = '#ffcf4933'; for (let i = 0; i < 12; i++) star(c, i % 2 ? 960 : 40, 70 + i * 44, 16, null, i * .3);
      dedede(c, scale, strike);
      if (phase === 'ssr-screen') { c.fillStyle = '#04030b'; c.globalAlpha = reduced ? 0 : 1 - ease(p); c.fillRect(0, 0, 1000, 600); c.globalAlpha = 1; c.strokeStyle = '#ffcf49'; star(c, 650, 245, 60 + (reduced ? 1 : p) * 460, null); }
      if (age >= 0) {
        c.imageSmoothingEnabled = false;
        for (const drop of sampleDededeRain(age, reduced)) if (drop.visible) {
          c.save(); c.translate(drop.x, drop.y); c.rotate(drop.angle);
          // Native 16px body within the existing padded 64px atlas cell.
          if (waddleDee.naturalWidth) c.drawImage(waddleDee, drop.frame * 64 + 24, 4, 16, 16, -drop.size / 2, -drop.size / 2, drop.size, drop.size);
          else { c.fillStyle = '#c9a553'; c.beginPath(); c.ellipse(0, 0, drop.size / 2, drop.size * .4, 0, 0, Math.PI * 2); c.fill(); c.fillStyle = '#fff5da'; c.fillRect(-drop.size * .2, -drop.size * .15, drop.size * .4, drop.size * .3); }
          c.restore();
        }
        c.imageSmoothingEnabled = true;
        if (!reduced && age >= .2 && age < .55) { c.strokeStyle = '#ffcf49'; for (let i = 0; i < 8; i++) star(c, 915 + Math.cos(i) * (age - .2) * 220, 420 + Math.sin(i) * (age - .2) * 180, 8, '#ffcf49', i); }
      }
    } else if (phase === 'arrival') {
      c.strokeStyle = COLOURS[beat.result.rarity === 'SR' ? 1 : 0]; c.lineWidth = 3; c.fillStyle = '#292639';
      c.save(); c.translate(655, 335); c.beginPath(); c.ellipse(0, 10, 100, 125, 0, 0, Math.PI * 2); c.fill(); c.stroke(); c.beginPath(); c.arc(0, -90, 65, 0, Math.PI * 2); c.fill(); c.stroke(); c.restore();
    }
    // Ten results remain small characters on a stage, not portraits in cards.
    if (board.receipt.results.length === 10 && !['flight', 'blackout', 'impact', 'call', 'sweep', 'covered', 'hands', 'open', 'dark', 'emerge', 'wrap', 'face'].includes(phase)) {
      const complete = phase === 'lineup', top = complete ? 265 : 545;
      board.receipt.results.forEach((r, i) => {
        const col = complete && canvas.clientWidth < 600 ? i % 5 : i, row = complete && canvas.clientWidth < 600 ? Math.floor(i / 5) : 0;
        const x = complete && canvas.clientWidth < 600 ? 160 + col * 170 : 65 + col * 97, y = top + row * 150;
        const revealed = complete || i < (beat.index ?? 0) || i === beat.index && !['flight', 'blackout', 'impact'].includes(phase);
        c.strokeStyle = '#847b9977'; c.lineWidth = 1; c.beginPath(); c.ellipse(x, y + 28, 28, 6, 0, 0, Math.PI * 2); c.stroke();
        c.fillStyle = revealed ? COLOURS[['R', 'SR', 'SSR', 'UR'].indexOf(r.rarity)] : '#464056';
        if (revealed) { c.beginPath(); c.arc(x, y - 14, 9, 0, Math.PI * 2); c.fill(); c.beginPath(); c.moveTo(x, y - 3); c.lineTo(x - 15, y + 22); c.lineTo(x + 15, y + 22); c.closePath(); c.fill(); }
        else { c.beginPath(); c.arc(x, y + 7, 4, 0, Math.PI * 2); c.fill(); }
        c.font = '15px Barlow'; c.textAlign = 'center'; c.fillStyle = '#bdb3cd'; c.fillText(String(i + 1), x, y + 51);
      });
    }
  };
}
