// REPL driver for "HUD Clínico UCI" (fiebres-neutropenias), a static
// HTML/CSS/JS app with no build tool and no Electron. Drives a plain
// headless Chromium against the app served by `python3 -m http.server`.
// Run under tmux: send-keys commands, capture-pane output. Same shape as
// the Electron REPL pattern, minus anything Electron-only (no `windows`
// command, no BrowserView workarounds, no stdin-stealing to guard against).
//
// Playwright is a GLOBAL node module in this container — this repo has no
// package.json/node_modules at all (true "sin build tool" static site per
// CLAUDE.md), so a bare `import 'playwright'` fails. Import by absolute
// path instead. See Gotchas in SKILL.md.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import * as readline from 'node:readline';
import * as fs from 'node:fs';
import * as path from 'node:path';

const BASE_URL = process.env.APP_URL || 'http://localhost:8000/';
const SHOT_DIR = process.env.SCREENSHOT_DIR || '/tmp/shots';
fs.mkdirSync(SHOT_DIR, { recursive: true });

let browser = null;
let page = null;
let consoleLog = [];

const COMMANDS = {
  async launch() {
    if (browser) return console.log('already launched');
    browser = await chromium.launch({ args: ['--no-sandbox'] });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    page = await context.newPage();
    consoleLog = [];
    page.on('console', msg => consoleLog.push(`[${msg.type()}] ${msg.text()}`));
    page.on('pageerror', e => consoleLog.push('[pageerror] ' + e.message));
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    console.log('launched. url:', page.url());
  },

  async nav(url) {
    if (!page) return console.log('ERROR: launch first');
    await page.goto(url.startsWith('http') ? url : BASE_URL + url, { waitUntil: 'networkidle' });
    console.log('nav ->', page.url());
  },

  async ss(name) {
    if (!page) return console.log('ERROR: launch first');
    const f = path.join(SHOT_DIR, (name || `ss-${Date.now()}`) + '.png');
    await page.screenshot({ path: f });
    console.log('screenshot:', f);
  },

  // DOM click, not Playwright's coordinate-based locator().click() — this
  // app voltea/flip .field-card with 3D CSS transforms mid-animation
  // (ver corkboard.js en CLAUDE.md), where a coordinate click can land
  // off-target while the card is rotating. DOM .click() always hits.
  async click(sel) {
    if (!page) return console.log('ERROR: launch first');
    const r = await page.evaluate(s => {
      const el = document.querySelector(s);
      if (!el) return 'NOT_FOUND';
      el.click(); return 'OK';
    }, sel);
    console.log('click', sel, '->', r);
  },

  async 'click-text'(text) {
    if (!page) return console.log('ERROR: launch first');
    const r = await page.evaluate(t => {
      const els = [...document.querySelectorAll('button, a, [role="button"]')];
      const el = els.find(e => e.textContent?.trim() === t)
              ?? els.find(e => e.textContent?.includes(t));
      if (!el) return 'NOT_FOUND';
      el.click(); return 'OK: ' + el.tagName;
    }, text);
    console.log('click-text', JSON.stringify(text), '->', r);
  },

  async type(text) { if (page) await page.keyboard.type(text, { delay: 30 }); },
  async press(key) { if (page) await page.keyboard.press(key); },

  async wait(sel) {
    if (!page) return console.log('ERROR: launch first');
    try { await page.waitForSelector(sel, { timeout: 10_000 }); console.log('found:', sel); }
    catch { console.log('TIMEOUT:', sel); }
  },

  async eval(expr) {
    if (!page) return console.log('ERROR: launch first');
    try { console.log(JSON.stringify(await page.evaluate(expr))); }
    catch (e) { console.log('ERROR:', e.message); }
  },

  async text(sel) {
    if (!page) return console.log('ERROR: launch first');
    console.log(await page.evaluate(
      s => (s ? document.querySelector(s) : document.body)?.innerText ?? '(null)',
      sel || null));
  },

  console(filter) {
    const lines = filter === '--errors'
      ? consoleLog.filter(l => l.startsWith('[error]') || l.startsWith('[pageerror]'))
      : consoleLog;
    console.log(lines.length ? lines.join('\n') : '(none)');
  },

  async quit() { if (browser) await browser.close().catch(() => {}); browser = null; page = null; },
  help() { console.log('commands:', Object.keys(COMMANDS).join(', ')); },
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: 'driver> ' });

rl.on('line', async line => {
  const [cmd, ...rest] = line.trim().split(/\s+/);
  if (!cmd) return rl.prompt();
  const fn = COMMANDS[cmd];
  if (!fn) { console.log('unknown:', cmd, ' - try: help'); return rl.prompt(); }
  try { await fn(rest.join(' ')); } catch (e) { console.log('ERROR:', e.message); }
  if (cmd === 'quit') { rl.close(); process.exit(0); }
  rl.prompt();
});
rl.on('close', async () => { await COMMANDS.quit(); process.exit(0); });

console.log('fiebres-neutropenias driver - "help" for commands, "launch" to start');
rl.prompt();
