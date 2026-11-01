// Prueba corta de la pieza 1a del eje vivo: abre cada paciente desde un enlace cruzado a 390 y 360 px; sin errores de consola, sin desborde, escena y monitor pintados.
// Uso: node autonomo/bloques/b6b/herramientas/eje-1a.mjs <url-base> [carpeta-capturas]
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8000/').replace(/\/?$/, '/'), CAP = process.argv[3];
const CL = ['toribio', 'bibiana', 'sinforoso', 'lucrecia', 'obdulia', 'policarpo', 'fulgencio'], fallos = [], errores = [];
const b = await chromium.launch();
for (const W of [390, 360]) {
  const p = await (await b.newContext({ ...devices['iPhone 12'], viewport: { width: W, height: 800 } })).newPage();
  p.on('console', (m) => m.type() === 'error' && errores.push(m.text())); p.on('pageerror', (e) => errores.push(e.message));
  await p.goto(BASE + 'index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(1000);
  for (const c of CL) {
    await p.evaluate((c) => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'ejeVivo', ejeVivo: c + ':2' }); document.body.appendChild(t); t.click(); t.remove(); }, c);
    await p.waitForTimeout(500);
    const r = await p.evaluate(() => ({ vis: document.getElementById('eje-vivo-view').offsetParent !== null, hijos: document.getElementById('eje-svg').children.length, pa: document.getElementById('eje-m-pa').textContent, pres: document.querySelector('#eje-chips [aria-pressed=true]')?.dataset.pre, paso: document.querySelector('.eje-paso')?.textContent, d: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
    if (!r.vis || r.hijos < 10 || !r.pa || r.pres !== c || r.d > 0) fallos.push(`${W} ${c}: ${JSON.stringify(r)}`);
    if (CAP && (c === 'toribio' || c === 'lucrecia')) await p.screenshot({ path: `${CAP}/${c}-${W}.png`, fullPage: false });
  }
  const bt = await p.evaluate(() => [...document.querySelectorAll('button[data-eje-vivo]')].filter((e) => e.closest('#panel-marino-nutri-tabs')).length);
  if (bt !== 7) fallos.push(`${W}: botones en la ficha ${bt}`);
}
await b.close();
console.log(errores.length ? 'ERRORES ' + errores.join(' | ') : 'consola limpia'); console.log(fallos.length ? 'FALLOS\n' + fallos.join('\n') : 'eje 1a OK');
process.exit(errores.length || fallos.length ? 1 : 0);
