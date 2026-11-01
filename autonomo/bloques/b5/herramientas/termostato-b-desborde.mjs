// Depuración: qué elemento desborda a 360 px en «¿y si?» (uso: node termostato-b-desborde.mjs hm)
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs'; import { spawn } from 'node:child_process';
const srv = spawn('python3', ['-m', 'http.server', '8164'], { cwd: new URL('../../../../', import.meta.url).pathname, stdio: 'ignore' }); await new Promise((r) => setTimeout(r, 800));
const b = await chromium.launch();
try { const p = await (await b.newContext({ ...devices['iPhone 12'], viewport: { width: 360, height: 800 } })).newPage();
  await p.goto('http://127.0.0.1:8164/autonomo/maquetas/b5-termostato-b.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  await p.selectOption('#m-ysi', process.argv[2] || 'hm'); await p.waitForTimeout(200);
  console.log(await p.evaluate(() => { const e = [...document.querySelectorAll('#crecera .org')].find((x) => x.getBoundingClientRect().right > 360) || document.querySelector('#crecera .org'); return e ? [e.parentElement.outerHTML.slice(0,300), e.closest('details').open, getComputedStyle(e.parentElement).whiteSpace, e.parentElement.getBoundingClientRect().width].join(' | ') : ''; }));
console.log(await p.evaluate(() => [...document.querySelectorAll('body *')].filter((e) => e.getBoundingClientRect().right > innerWidth + 1 && e.offsetParent && !(e.closest('details') && !e.closest('details').open && !e.matches('summary'))).slice(0, 8).map((e) => e.tagName + '#' + e.id + '.' + e.className + ' ' + Math.round(e.getBoundingClientRect().right) + ' ' + (e.textContent || '').slice(0, 50)).join('\n')));
} finally { await b.close(); srv.kill(); }
