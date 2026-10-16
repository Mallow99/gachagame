// Native source pieces, independently transformed. The complete opaque cloth
// interior is explicitly authored for this feasibility proof, not game artwork.
export async function loadNightmareNative() {
  const names = ['face', 'hand-left', 'hand-right', 'torso', 'battlefield'];
  const images = Object.fromEntries(await Promise.all(names.map(async name => {
    const image = new Image(); image.src = new URL(`assets/nightmare-native/${name}.png`, import.meta.url); await image.decode(); return [name, image];
  })));
  function face(c, { x = 0, y = -90, scale = 1, angle = 0 } = {}) {
    c.save(); c.translate(x, y); c.rotate(angle); c.scale(scale, scale); c.imageSmoothingEnabled = false;
    c.drawImage(images.face, -100, -110, 200, 156); c.restore();
  }
  function hand(c, x, y, scale, angle) {
    c.save(); c.translate(x, y); c.rotate(angle); c.scale(scale, scale); c.imageSmoothingEnabled = false;
    const image = images[angle < 0 ? 'hand-left' : 'hand-right'];
    c.drawImage(image, -28, -52, 56, 103); c.restore();
  }
  function cloth(c, side, open, wrap, explode) {
    c.save(); c.translate(side * (76 + (1 - wrap) * 650 + explode * 100), -30 + (1 - wrap) * 140);
    c.rotate(side * (.08 + open * .28 + (1 - wrap) * .65)); c.scale(side, 1);
    c.fillStyle = '#050a21'; c.strokeStyle = '#2362db'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(-20, -40); c.lineTo(85, -25); c.lineTo(170, 38); c.lineTo(275, 135); c.lineTo(180, 235); c.lineTo(60, 270); c.lineTo(-15, 255); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#91bcff'; for (const [x, y] of [[80, 70], [170, 140], [60, 200]]) {
      c.fillRect(x - 3, y - 11, 6, 22); c.fillRect(x - 11, y - 3, 22, 6);
      c.fillStyle = '#3154af'; c.fillRect(x - 6, y - 6, 12, 12); c.fillStyle = '#91bcff';
    }
    c.restore();
  }
  function figure(c, { x = 650, y = 285, scale = .76, open = .8, gesture = 0, head = 0, wrap = 1, explode = false, joints = false } = {}) {
    c.save(); c.translate(x, y); c.scale(scale, scale); c.imageSmoothingEnabled = false;
    for (const side of [-1, 1]) cloth(c, side, open, wrap, Number(explode));
    c.save(); c.beginPath(); c.rect(-400, 300 - wrap * 365, 800, 700); c.clip();
    c.fillStyle = '#04030b'; c.beginPath(); c.moveTo(-75, -55); c.lineTo(75, -55); c.lineTo(110, 255); c.lineTo(-110, 255); c.closePath(); c.fill();
    c.drawImage(images.torso, -90, -55, 180, 265); c.restore();
    face(c, { y: -90 - (explode ? 65 : 0), angle: head });
    for (const side of [-1, 1]) {
      const hx = side * (550 * (1 - wrap) + (180 + (explode ? 80 : 0)) * wrap);
      const hy = 130 * (1 - wrap) + (side < 0 ? 39 - gesture * 52 : -18 - gesture * 50) * wrap;
      hand(c, hx, hy, 1.15, side * .5);
      if (joints) { c.fillStyle = '#ffcf49'; c.beginPath(); c.arc(hx, hy, 4, 0, Math.PI * 2); c.fill(); }
    }
    c.restore();
  }
  function background(c) { c.save(); c.imageSmoothingEnabled = false; c.drawImage(images.battlefield, 0, 0, 1000, 600); c.fillStyle = '#04030b88'; c.fillRect(0, 0, 1000, 600); c.restore(); }
  return { face, hand, figure, background };
}
