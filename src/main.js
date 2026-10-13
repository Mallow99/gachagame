// The widget shell: top bar with currencies, three tabs, toasts, and the pull
// reveal on top. Runs the same in Electron and in a plain browser.
import { game } from './game.js';
import { sfx } from './sfx.js';
import { h, sleep } from './ui.js';
import { SummonView } from './views/summon.js';
import { HeroesView } from './views/heroes.js';
import { AdventureView } from './views/adventure.js';
import { MechanicsView } from './views/mechanics.js';
import { Reveal } from './views/reveal.js';

const desktop = window.desktop; // set by electron/preload.js
document.documentElement.classList.toggle('desktop', !!desktop);

const app = document.getElementById('app');
const gems = h('span.gems');
const gold = h('span.gold');
const soundBtn = h('button.chip', { onclick: () => {
  game.muted = !game.muted;
  game.save();
  refresh();
  sfx.click();
} });
let collapsed = false;
const collapseBtn = h('button.chip.square', { title: desktop ? 'Return to battle strip' : 'Collapse', onclick: toggleCollapse }, '–');
const closeBtn = desktop && h('button.chip.square.close', { title: 'Save & quit', onclick: () => {
  game.save();
  desktop.quit();
} }, '×');

const body = h('main.body');
const tabs = h('nav.tabs');
const toast = h('div.toast');
app.append(h('header.bar', h('div.drag', gems, gold), soundBtn, collapseBtn, closeBtn), body, tabs, toast);

const reveal = new Reveal(app);
const views = [
  ['Pull', SummonView((results) => reveal.play(results))],
  ['Team', HeroesView()],
  ['Field', AdventureView()],
  ['Rules', MechanicsView()],
];
views.forEach(([name, view], i) => {
  body.append(view);
  tabs.append(h('button', { onclick: () => showTab(i) }, name));
});

function showTab(i) {
  views.forEach(([, view], k) => {
    view.hidden = k !== i;
    tabs.children[k].classList.toggle('active', k === i);
  });
  sfx.click();
}

function refresh() {
  gems.textContent = `${game.gems} gems`;
  gold.textContent = `${game.gold} gold`;
  soundBtn.textContent = game.muted ? 'SFX off' : 'SFX on';
}

function toggleCollapse() {
  if (desktop?.openStrip) {
    game.save();
    desktop.openStrip();
    return;
  }
  collapsed = !collapsed;
  app.classList.toggle('collapsed', collapsed);
  collapseBtn.textContent = collapsed ? '+' : '–';
  desktop?.collapse(collapsed);
}

// Toasts play one after another.
const toastQueue = [];
let toastBusy = false;
game.addEventListener('toast', async (e) => {
  toastQueue.push(e.detail);
  if (toastBusy) return;
  toastBusy = true;
  while (toastQueue.length) {
    toast.textContent = toastQueue.shift();
    toast.classList.add('show');
    await sleep(2600);
    toast.classList.remove('show');
    await sleep(350);
  }
  toastBusy = false;
});

game.addEventListener('changed', refresh);
showTab(0);
refresh();
game.welcome();
