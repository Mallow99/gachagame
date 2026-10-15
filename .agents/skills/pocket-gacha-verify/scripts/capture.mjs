// Screenshot a page in headless Chromium (with WebGL) and report page errors.
// node .agents/skills/pocket-gacha-verify/scripts/capture.mjs <url> <out-dir> [--state banner] [--shots 3] [--every 1500] [--width 1280] [--height 900]
//   --state waits until #stage[data-state=<value>] (splash-kit pages) before the first shot.
// Playwright: POCKET_PLAYWRIGHT_MODULE, else a local or global `playwright` install.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const [url, out, ...rest] = process.argv.slice(2);
if (!url || !out) { console.error('Usage: capture.mjs <url> <out-dir> [--state s] [--shots n] [--every ms] [--width w] [--height h]'); process.exit(1); }
const opt = { shots: 3, every: 1500, width: 1280, height: 900 };
for (let i = 0; i < rest.length; i += 2) opt[rest[i].replace(/^--/, '')] = isNaN(rest[i + 1]) ? rest[i + 1] : Number(rest[i + 1]);

const require = createRequire(import.meta.url);
function loadPlaywright() {
  for (const id of [process.env.POCKET_PLAYWRIGHT_MODULE, 'playwright'].filter(Boolean)) { try { return require(id); } catch {} }
  try { return require(join(execSync('npm root -g').toString().trim(), 'playwright')); } catch {}
  console.error('Playwright not found. npm i -g playwright, or set POCKET_PLAYWRIGHT_MODULE.'); process.exit(1);
}
const { chromium } = loadPlaywright();
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  || ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome'].find(existsSync);
const browser = await chromium.launch({
  executablePath,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: opt.width, height: opt.height } });
const problems = [];
page.on('pageerror', e => problems.push(`pageerror: ${e.message}`));
page.on('console', m => { if (m.type() === 'error') problems.push(`console: ${m.text()}`); });
await page.goto(url);
if (opt.state) await page.waitForFunction(s => document.getElementById('stage')?.dataset.state === s, opt.state, { timeout: 30000 });
mkdirSync(out, { recursive: true });
for (let i = 0; i < opt.shots; i++) {
  await page.waitForTimeout(opt.every);
  await page.screenshot({ path: join(out, `shot-${i + 1}.png`) });
}
console.log(`scrollWidth ${await page.evaluate(() => document.documentElement.scrollWidth)} / viewport ${opt.width}`);
console.log(problems.length ? problems.join('\n') : 'no page errors');
await browser.close();
