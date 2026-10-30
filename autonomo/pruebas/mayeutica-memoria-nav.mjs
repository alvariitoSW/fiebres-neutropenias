// Navegador (390 px): río y mar, inicio «Ideas firmes: 0 de T» y línea «Vuelve en…» al contestar. Uso: node … <url> [captura.png]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8000/').replace(/\/?$/, '/');
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); const p = await ctx.newPage();
const err = []; p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) err.push(m.text()); }); p.on('pageerror', e => err.push(e.message));
const pulsar = s => p.evaluate(s => document.querySelector(s).click(), s);
await p.goto(BASE + 'index.html'); await p.waitForFunction(() => window.__agvPruebas);
await p.click('#btn-libros'); await p.click('#btn-libro-marino'); await p.click('#lib-pest-vivos'); await p.click('#agv-menu-libros'); await p.waitForTimeout(600);
await pulsar('#agv-modo-preguntas'); await p.waitForTimeout(300);
const ini = await p.innerText('#agv-preg'); console.log(ini.match(/Ideas firmes[^\n]*/)?.[0]);
if (process.argv[3]) await p.screenshot({ path: process.argv[3] + '-inicio.png' });
await pulsar('#agv-preg [data-ir="recorrido"]');
const tipo = await p.evaluate(() => document.querySelector('#agv-preg [data-accion]').dataset.accion); console.log('primera:', tipo);
await pulsar('#agv-preg [data-accion="' + tipo + '"]');
if (tipo === 'ops') await pulsar('#agv-preg [data-op="0"]');
else if (tipo === 'destapa') { await pulsar('#agv-preg [data-accion="puntos"]'); }
await pulsar('#agv-preg [data-accion="comprobar"]').catch(() => {}); await pulsar('#agv-preg [data-accion="comprobar"]').catch(() => {});
await pulsar('#agv-preg [data-accion="corregir"]').catch(() => {});
await p.waitForTimeout(400);
console.log((await p.innerText('#agv-preg')).match(/Vuelve[^\n]*/)?.[0] ?? 'SIN LÍNEA');
console.log('desborde', await p.evaluate(() => document.documentElement.scrollWidth - innerWidth), 'errores', err);
if (process.argv[3]) await p.screenshot({ path: process.argv[3] + '-respuesta.png' });

// E2: la pantalla «de días atrás» sobre el río y mar, con dos registros sembrados con fechas viejas.
await p.evaluate(() => document.getElementById('agv-modo-preguntas').click());
const r2 = await p.evaluate(async () => {
  const M = await import('/js/core/mayeutica-motor.js'), D = await import('/js/data/agua-viva-data.js');
  const libres = D.PREGUNTAS.filter(q => q.tipo === 'test' && !q.tocar).slice(0, 2);
  const hoy = M.hoyLocal(), atras = n => M.sumarDias(hoy, -n);
  const reg = { [libres[0].id]: { aciertos: 0, fallos: 1, repasar: true, ultimo: atras(2), resultado: 'mal' }, [libres[1].id]: { aciertos: 1, fallos: 0, repasar: false, ultimo: atras(8), dias: 1, diaOk: atras(8), resultado: 'on' } };
  localStorage.setItem('agua-viva-mayeutica-v1', JSON.stringify(reg));
  const items = M.elegirDiasAtras(libres.map((q, i) => ({ q, ficha: 'f' + i, a: reg[q.id] })), { hoy });
  window.__guardados = [];
  M.pintarDiasAtras(document.getElementById('agv-preg'), items, { p: 'agv', pregunta: () => ({ ids: true }), guardar: (q, r) => window.__guardados.push([q.id, r.ok]), alFinal: () => { window.__fin = true; } });
  return { n: items.length, ids: items.map(i => i.q.id) };
});
console.log('items', r2);
const txt = () => p.innerText('#agv-preg');
let t = await txt(); console.log('chip:', t.match(/Fallada hace[^\n]*|Acertada hace[^\n]*/)?.[0], '| contador:', t.match(/\d de \d/)?.[0]);
for (let i = 0; i < r2.n; i++) {
  await pulsar('#agv-preg [data-accion="ops"]');
  const buena = await p.evaluate(async id => { const D = await import('/js/data/agua-viva-data.js'), M = await import('/js/core/mayeutica-motor.js'); return M.barajar(D.PREGUNTAS.find(q => q.id === id).opciones, id).findIndex(o => o.ok); }, r2.ids[i]);
  await pulsar(`#agv-preg [data-op="${buena}"]`); await p.waitForTimeout(300);
  console.log('vuelve:', (await txt()).match(/Vuelve[^\n]*/)?.[0] ?? 'SIN LÍNEA', '| desborde', await p.evaluate(() => document.documentElement.scrollWidth - innerWidth));
  if (process.argv[3] && i === 0) await p.screenshot({ path: process.argv[3] + '-dias.png' });
  await pulsar('#agv-preg [data-accion="sig"]'); await p.waitForTimeout(200);
}
console.log('final:', (await txt()).match(/Repaso hecho/)?.[0], 'guardados', await p.evaluate(() => JSON.stringify(window.__guardados)));
await pulsar('#agv-preg [data-accion="fin-dias"]'); console.log('alFinal llamado', await p.evaluate(() => window.__fin));
await p.evaluate(async () => { const M = await import('/js/core/mayeutica-motor.js'); M.pintarDiasAtras(document.getElementById('agv-preg'), [], { p: 'agv' }); });
console.log((await txt()).match(/Hoy no toca[^\n]*/)?.[0]);
console.log('desborde final', await p.evaluate(() => document.documentElement.scrollWidth - innerWidth), 'errores', err);
await b.close();
