// Small DOM helpers so views read like a layout instead of createElement soup.
import { heroImage } from './sprites.js';

/**
 * h('div.card.big', { onclick, style: {...} }, child, [children], 'text')
 * Props are optional. Children can be nodes, strings, numbers, arrays or falsy.
 */
export function h(sel, ...rest) {
  const [tag, ...classes] = sel.split('.');
  const el = document.createElement(tag || 'div');
  if (classes.length) el.className = classes.join(' ');
  let kids = rest;
  const first = rest[0];
  if (first && typeof first === 'object' && !(first instanceof Node) && !Array.isArray(first)) {
    kids = rest.slice(1);
    for (const [k, v] of Object.entries(first)) {
      if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'style') Object.assign(el.style, v);
      else if (k in el) el[k] = v;
      else el.setAttribute(k, v);
    }
  }
  for (const k of kids.flat(Infinity)) {
    if (k == null || k === false) continue;
    el.append(k instanceof Node ? k : String(k));
  }
  return el;
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const RARITY_NAME = { 3: 'R', 4: 'SR', 5: 'SSR' };

/** A row of rarity stars. `shown` hides the trailing ones (for pop-in). */
export function stars(n, shown = n) {
  const row = h('span.stars', { className: `stars r${n}` });
  for (let i = 0; i < n; i++) row.append(h('span', { className: i < shown ? '' : 'off' }, '★'));
  return row;
}

export function setStarsShown(row, shown) {
  [...row.children].forEach((s, i) => s.classList.toggle('off', i >= shown));
}

/** Pixel-art <img> for a hero or enemy, sized in CSS pixels. */
export function sprite(unit, size, silhouette = false) {
  return h('img.sprite', {
    src: heroImage(unit, silhouette),
    alt: '',
    draggable: false,
    style: { width: `${size}px`, height: `${size}px` },
  });
}
