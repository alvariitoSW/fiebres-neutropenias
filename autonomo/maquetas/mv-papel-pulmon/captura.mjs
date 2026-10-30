// Recorre la maqueta a 390x844 y 360x780: pestañas, mandos a extremos y punto medio, desborde, consola, foto. Capturas en /tmp/plan-socialista/mv-papel-pulmon/capturas/
// Uso: PUERTO=8765 node autonomo/maquetas/mv-papel-pulmon/captura.mjs
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
import fs from 'fs';
const PUERTO = process.env.PUERTO || 8765, DIR = '/tmp/plan-socialista/mv-papel-pulmon/capturas/'; fs.mkdirSync(DIR, { recursive: true });
const url = `http://localhost:${PUERTO}/autonomo/maquetas/mv-papel-pulmon.html`;
const br = await chromium.launch(); let fallos = 0; const mal = (m) => { fallos++; console.log('  ✗ ' + m); };
for (const [w, h] of [[390, 844], [360, 780]]) {
  const ctx = await br.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 }), p = await ctx.newPage(), errs = [];
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); }); p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto(url); await p.waitForTimeout(500);
  const desborde = async (et) => { const o = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]); if (o[0] > o[1]) mal(`${w}: desborde ${o} en ${et}`); };
  const set = async (id, v) => { await p.evaluate(([id, v]) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, [id, v]); await p.waitForTimeout(60); };
  // lámina 1
  for (const n of [1, 2, 3, 4]) { await p.click(`#dock-1 .seg button[data-k="${n}"]`); await p.waitForTimeout(80); await desborde('nivel ' + n);
    if (n === 3) { const nw = await p.evaluate(() => new Promise((r) => { const i = document.getElementById('img-1'); i.scrollIntoView(); const t = () => (i.complete ? r(i.naturalWidth) : setTimeout(t, 50)); t(); })); if (!(nw > 0)) mal('foto sin cargar'); }
    if (w === 390) { await p.evaluate(() => scrollTo(0, 0)); await p.screenshot({ path: DIR + `l1-nivel${n}.png` }); } }
  await p.click('#dock-1 .seg button[data-k="2"]'); const b = await p.$('#b-inspira'), bb = await b.boundingBox(); await p.mouse.move(bb.x + 5, bb.y + 5); await p.mouse.down(); await p.waitForTimeout(1200);
  const ins = await p.evaluate(() => window.__mv.S.ins); if (ins < 0.9) mal('Inspira no llega a 1: ' + ins); if (w === 390) await p.screenshot({ path: DIR + 'l1-inspira.png' }); await p.mouse.up();
  for (const i of [0, 1]) { await p.click(`#tj-b${i}`); await desborde('tarjeta'); }
  // lámina 2
  await p.click('#tab-2'); await p.waitForTimeout(100);
  for (const perfil of ['normal', 'sdra']) { await p.click(`#dock-2 .seg button[data-k="${perfil}"]`);
    for (const peep of [0, 10, 16, 20]) { await set('s-peep', peep); await desborde(`peep ${peep}`);
      for (const vt of [4, 7, 8, 9, 10]) { await set('s-vt', vt); const c = await p.evaluate(() => window.__mv.c2); if (!(c.pMeseta <= 50 && c.vt <= 1000)) mal(`${perfil} ${peep}/${vt} fuera de rango`); await desborde(`${perfil} ${peep}/${vt}`);
        const lock = await p.evaluate(() => document.getElementById('s-vt').disabled); if (vt > 8 && !lock) mal('Vt>8 sin mando apagado');
        if (lock) { await p.evaluate(() => document.querySelector('#dock-2 .volver').click()); } } await p.evaluate(() => { const v = document.querySelector('#dock-2 .volver'); if (!v.hidden) v.click(); }); } }
  await p.click('#dock-2 .seg button[data-k="sdra"]'); await set('s-peep', 0); await set('s-vt', 6); if (w === 390) await p.screenshot({ path: DIR + 'l2-sdra-peep0.png' });
  await set('s-peep', 10); if (w === 390) await p.screenshot({ path: DIR + 'l2-sdra-peep10.png' });
  await set('s-peep', 20); await desborde('peep20'); if (w === 390) await p.screenshot({ path: DIR + 'l2-sello.png' }); await p.evaluate(() => document.querySelector('#dock-2 .volver').click());
  // lámina 3
  await p.click('#tab-3'); await p.waitForTimeout(150);
  for (const k of ['sincronico', 'ineficaz', 'doble', 'inverso']) { await p.click(`#dock-3 .seg button[data-k="${k}"]`);
    for (const e of [0, 7.5, 12, 15]) { await set('s-esf', e); await desborde(`${k} esf ${e}`); const lock = await p.evaluate(() => document.getElementById('s-esf').disabled); if (e === 15 && !lock) mal('esfuerzo 15 sin mando apagado'); if (lock) await p.evaluate(() => document.querySelector('#dock-3 .volver').click()); }
    if (w === 390) { await set('s-esf', ({ sincronico: 8, ineficaz: 3, doble: 11, inverso: 11 })[k]); await p.screenshot({ path: DIR + `l3-${k}.png` }); } }
  await p.click('#b-adivina'); await p.waitForTimeout(100); if (w === 390) await p.screenshot({ path: DIR + 'l3-adivina.png' }); await p.click('#adivina .op-as'); await desborde('adivina'); if (w === 390) await p.screenshot({ path: DIR + 'l3-adivina-resp.png' });
  // guías
  for (const t of [1, 2, 3]) { await p.click('#tab-' + t); await p.click(`#dock-${t} .btn-guia`); for (let i = 0; i < 4; i++) { await p.waitForTimeout(80); await desborde(`guía ${t}.${i}`); const s = await p.$('#g-s'); if (s) await s.click(); } }
  const o = await p.evaluate(() => [...document.querySelectorAll('[id]')].map((e) => e.id).filter((x, i, a) => a.indexOf(x) !== i)); if (o.length) mal('ids duplicados ' + o);
  const peq = await p.evaluate(() => [...document.querySelectorAll('svg text')].filter((t) => t.getBoundingClientRect().width && t.getBoundingClientRect().height && parseFloat(getComputedStyle(t).fontSize) * (t.ownerSVGElement.getBoundingClientRect().width / (t.ownerSVGElement.viewBox.baseVal.width || 1)) < 7.5).map((t) => t.textContent));
  if (peq.length) mal('rótulos < 7,5 px: ' + peq.slice(0, 5));
  if (errs.length) mal('consola: ' + errs.slice(0, 3).join(' | '));
  console.log(`${w}x${h}: ${fallos ? 'con fallos' : 'ok'}`); await ctx.close();
}
await br.close(); process.exit(fallos ? 1 : 0);
