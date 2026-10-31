// Captura del monitor (y de la lupa del nodo AV) en Mobitz II, 2:1, BAV3 y marcapasos. Servidor propio, cerrado por PID.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
const PUERTO = 43900 + Math.floor(Math.random() * 90);
const srv = spawn('python3', ['-m', 'http.server', String(PUERTO)], { cwd: new URL('../../../..', import.meta.url).pathname, stdio: 'ignore' });
await new Promise(r => setTimeout(r, 700));
try {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const R = (f, ...a) => p.evaluate(([f, a]) => { const r = window.__ritmo; const v = typeof r[f] === 'function' ? r[f](...a) : r[f]; return v ?? null; }, [f, a]);
  await p.goto(`http://localhost:${PUERTO}/index.html`); await p.waitForFunction(() => document.getElementById('rtv-raiz'));
  await p.click('#btn-libros'); await p.click('#btn-libro-marino'); await p.click('#lib-pest-vivos'); await p.click('#rtv-menu-libros'); await p.waitForTimeout(900);
  for (const [k, ex, n] of [['bav2', { mobitz: 'II' }, 'mobII'], ['bav2', { mobitz: '2:1' }, 'mob21'], ['bav3', { escape: 'nodal' }, 'bav3'], ['marcapasos', {}, 'marcap'], ['sinusal', {}, 'sinusal']]) {
    await R('ponerEstado', k, ex); await p.waitForTimeout(300); await R('avanzarHasta', (await R('simT')) + 12); await p.waitForTimeout(500);
    console.log(n, '|', await p.evaluate(() => document.getElementById('rtv-mon-tit')?.innerText || document.getElementById('mon-tit')?.innerText || document.querySelector('[id$=mon-tit]')?.innerText), '| FC', await p.evaluate(() => [...document.querySelectorAll('#rtv-mon-cifras .cifra')][0]?.innerText.replace(/\s+/g, ' ')));
    await p.locator('#rtv-tiras').scrollIntoViewIfNeeded(); await p.screenshot({ path: `/tmp/plan-socialista/b3-bradi/prof-mon-${n}.png` });
  }
  await b.close();
} finally { srv.kill(); }
