// Prueba de la lupa de toxicidad del O₂ (capilar vivo, estado «toxicidad»): barrido de extremos del mando y capturas.
// Uso: node autonomo/pruebas/lupa-toxicidad.mjs <url-base> <carpeta-capturas>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8137/').replace(/\/?$/, '/'), OUT = process.argv[3] || '/tmp/';
const b = await chromium.launch(); let mal = 0;
for (const W of [390, 360]) {
  const p = await (await b.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 2 })).newPage();
  const err = []; p.on('pageerror', e => err.push(e.message)); p.on('console', m => { if (m.type() === 'error') err.push(m.text()); });
  await p.goto(BASE); await p.waitForTimeout(2500);
  await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'capilarVivo', capilarVivo: 'toxicidad' }); document.body.append(t); t.click(); t.remove(); });
  await p.waitForTimeout(1500);
  const arrastrar = async (y, u) => { const r = await p.evaluate(() => { const s = document.getElementById('cpv-lupa-svg').getBoundingClientRect(); return { x: s.x, y: s.y, w: s.width, h: s.height }; });
    const X = v => r.x + r.w * v / 220, Y = r.y + r.h * y / 220; await p.mouse.move(X(88 + 88 * u), Y); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(150); };
  const lee = () => p.evaluate(() => { const g = id => document.getElementById(id); const sv = g('cpv-lupa-svg'); const ts = [...sv.querySelectorAll('text')].map(t => t.textContent).filter(Boolean);
    return { fio: g('cpv-tox-fio-t')?.textContent, hor: g('cpv-tox-hor-t')?.textContent, ros: +g('cpv-tox-ros')?.getAttribute('width'), def: +g('cpv-tox-def')?.getAttribute('width'), v1: g('cpv-tox-v1')?.textContent, v2: g('cpv-tox-v2')?.textContent,
      minfs: Math.min(...[...sv.querySelectorAll('text')].filter(t => t.textContent).map(t => { const m = t.getScreenCTM(); return parseFloat(getComputedStyle(t).fontSize) * m.a; })), des: document.documentElement.scrollWidth - innerWidth }; });
  const casos = [[21, 0], [50, 0], [80, 24], [100, 4], [100, 8], [100, 80], [100, 108]];
  for (const [f, h] of casos) { await arrastrar(137, (f - 21) / 79); await arrastrar(149, h / 108); const s = await lee();
    console.log(W, f, h, JSON.stringify(s)); if (s.des > 0 || s.minfs < (W === 390 ? 9.95 : 8.9)) mal++; if (f === 100 && h === 108 && !/TOPE/.test(s.v1)) mal++;
    if (W === 390 && [[80, 24], [100, 108]].some(c => c[0] === f && c[1] === h)) await p.screenshot({ path: `${OUT}toxicidad-${f}-${h}-${W}.png` }); }
  // con el tope puesto, el mando de horas está apagado: tocarlo no lo mueve
  await arrastrar(149, 0.2); const s2 = await lee(); if (s2.hor !== '108 h') { mal++; console.log('mando de horas no apagado', s2.hor); }
  await arrastrar(137, 0.5); await arrastrar(149, 0.2); const s3 = await lee(); if (s3.hor === '108 h') { mal++; console.log('no se libera al bajar la FiO2'); }
  console.log(W, 'errores', err.length, err.slice(0, 2));
  if (err.length) mal++;
}
await b.close(); console.log(mal ? '❌ ' + mal : '✅ lupa de toxicidad'); process.exit(mal ? 1 : 0);
