// Prueba de la maqueta M3 (R1): 390x844 y 360x780; TEP y HP a 0/50/100 y al defecto; sin errores, sin desborde, imagen pintada.
// Uso: node autonomo/maquetas/eco-reforma/prueba-m3.mjs <url-base>  (p. ej. http://localhost:8732/)
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const BASE = (process.argv[2] || 'http://localhost:8732/').replace(/\/?$/, '/'), DIR = '/tmp/plan-socialista/eco-reforma/capturas/';
fs.mkdirSync(DIR, { recursive: true });
const b = await chromium.launch(); let fallos = 0;
const mal = (m) => { fallos++; console.log('FALLO', m); };
for (const [w, h] of [[390, 844], [360, 780]]) {
  const p = await (await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 })).newPage();
  const errs = []; p.on('console', m => m.type() === 'error' && errs.push(m.text())); p.on('pageerror', e => errs.push(String(e)));
  await p.goto(BASE + 'autonomo/maquetas/eco-reforma/m3-tep.html'); await p.waitForFunction(() => window.__m3 && document.querySelector('#signo-trv'));
  for (const [k, g] of [['tep', 0], ['tep', 0.5], ['tep', 0.93], ['tep', 1], ['hpcronica', 0], ['hpcronica', 0.5], ['hpcronica', 0.55], ['hpcronica', 1]]) {
    for (const vista of ['a4c', 'psaxPm']) {
      const s = await p.evaluate(([k, g, v]) => window.__m3.poner(k, g, v), [k, g, vista]); await p.waitForTimeout(150);
      const r = await p.evaluate(() => { const c = document.querySelector('#lienzo'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 20) n++;
        return { sw: document.documentElement.scrollWidth, pix: n, sellos: document.querySelectorAll('.sello:not(.hueco)').length, signos: document.querySelectorAll('.signo').length }; });
      if (r.sw > w) mal(`${w} ${k} ${g} desborde ${r.sw}`); if (r.pix < 3000) mal(`${w} ${k} ${g} ${vista} imagen vacía ${r.pix}`); if (r.signos !== 5) mal('signos');
      if (vista === 'a4c') console.log(w, k, g, JSON.stringify(Object.fromEntries(Object.entries(s).map(([a, v]) => [a, +v.toFixed(2)]))), 'sellos', r.sellos);
      if (w === 390 && vista === 'a4c' && ((k === 'tep' && g === 0.93) || (k === 'hpcronica' && (g === 0.55 || g === 1)))) {
        await p.evaluate(() => scrollTo(0, 0)); await p.screenshot({ path: DIR + (k === 'tep' ? 'm3-tep' : g === 1 ? 'm3-hp100' : 'm3-hp') + '.png', fullPage: true }); }
    }
  }
  // botones ≥44 px y detalles abiertos sin desborde
  await p.evaluate(() => document.querySelectorAll('details').forEach(d => d.open = true));
  const peq = await p.evaluate(() => [...document.querySelectorAll('button')].filter(x => x.getBoundingClientRect().height < 43.5).length);
  if (peq) mal(`${w} botones <44 px: ${peq}`);
  if (await p.evaluate(() => document.documentElement.scrollWidth) > w) mal(`${w} desborde con tarjetas abiertas`);
  if (errs.length) mal(`${w} consola: ${errs.join(' | ')}`);
  console.log(w, 'listo');
}
await b.close(); console.log(fallos ? `${fallos} fallos` : 'TODO VERDE'); process.exit(fallos ? 1 : 0);
