// Juicio del profesor del grupo 6E (b6b-cuanto): recorre Juega, una guía con modelo, un caso entero (fallando a
// propósito) y «Para profundizar» a 390 px; devuelve resumen en texto y ≤6 capturas.
// Uso: node autonomo/bloques/b6b/herramientas/cuanto-profesor.mjs http://localhost:8771/ /salida/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2] || 'http://localhost:8771/', OUT = process.argv[3] || '/tmp/plan-socialista/b6b-6e/cap/';
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = [];
p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errs.push(m.text()); }); p.on('pageerror', e => errs.push(e.message));
await p.goto(BASE + 'index.html'); await p.waitForFunction(() => document.getElementById('mu-tiamina')?.querySelector(':scope > .vista-estudiar'), null, { timeout: 15000 });
const click = s => p.evaluate(x => { const e = document.querySelector(x); if (!e) throw new Error('no hay ' + x); e.click(); }, s);
const txt = s => p.evaluate(x => (document.querySelector(x)?.textContent || '').replace(/\s+/g, ' ').trim(), s);
const abrir = async f => { await p.evaluate(t => { const x = document.createElement('button'); Object.assign(x.dataset, { especialidad: 'libros', view: 'marinoNutricion', panel: 'panel-marino-nutri-tabs', tab: t }); document.body.append(x); x.click(); x.remove(); }, f); await p.waitForTimeout(400); await click(`#${f} > .vista-toggle [data-vista="estudiar"]`); await p.waitForTimeout(300); };
const foto = async (n, sel) => { const el = sel ? await p.$(sel) : null; await (el || p).screenshot({ path: `${OUT}${n}.png` }); };
// 1. Resumen de Juega y Mira por ficha
for (const f of ['mu-gasto-energetico', 'mu-sustratos', 'mu-tiamina', 'mu-vitaminas-oligo']) {
  await abrir(f);
  const res = await p.evaluate(x => [...document.querySelectorAll(`#${x} .est-ir`)].map(e => e.textContent.replace(/\s+/g, ' ').trim()).join(' | '), f);
  await click(`#${f} .est-ir[data-ir-paso="juega"]`); await p.waitForTimeout(250);
  const juega = await txt(`#${f} .est-paso[data-paso="juega"]`);
  await click(`#${f} .est-ir[data-ir-paso="mira"]`); await p.waitForTimeout(250);
  const mira = await p.evaluate(x => { const l = document.querySelector(`#${x} .est-paso[data-paso="mira"] .est-lienzo`); return l ? `${l.children.length} nodos, ${l.querySelectorAll('img').length} img, ${l.querySelectorAll('button').length} botones` : 'sin lienzo'; }, f);
  const verTexto = await p.evaluate(x => document.querySelectorAll(`#${x} .vista-estudiar [data-may-texto]`).length, f);
  console.log(`== ${f}\n  pasos: ${res}\n  juega: ${juega.slice(0, 220)}\n  mira: ${mira}`);
  if (f === 'mu-tiamina') { await click(`#${f} .est-ir[data-ir-paso="juega"]`); await p.waitForTimeout(250); await foto('p-juega-tiamina', `#${f} .vista-estudiar`); }
}
// 2. Guía de tiamina g1: contestar bien y ver «Compruébalo»
const f = 'mu-tiamina'; await abrir(f);
await click(`#${f} .est-ir[data-ir-paso="piensa"]`); await p.waitForTimeout(250);
const Z = `#${f} .est-paso[data-paso="piensa"] .may-zona`;
await click(`${Z} [data-ir="seguir"]`); await p.waitForTimeout(250);
await click(`${Z} [data-accion="ops"]`); await p.waitForTimeout(150);
const okIdx = await p.evaluate(z => [...document.querySelectorAll(z + ' [data-op]')].map(e => e.textContent.replace(/\s+/g, ' ').trim()), Z);
console.log('g1 opciones:', okIdx);
await click(`${Z} [data-op="1"]`); await p.waitForTimeout(350);
console.log('g1 respuesta:', (await txt(`${Z} .may-res`)).slice(0, 400));
console.log('g1 botones:', await p.evaluate(z => [...document.querySelectorAll(z + ' .may-res button')].map(e => e.textContent.trim()), Z));
await foto('p-g1-tiamina', `#${f} .est-paso[data-paso="piensa"]`);
// 3. Caso de Aniceto entero, fallando a propósito
await click(`#${f} .est-ir[data-ir-paso="caso"]`); await p.waitForTimeout(250);
const C = `#${f} .est-paso[data-paso="caso"] .may-zona`;
await click(`${C} [data-caso="0"]`); await p.waitForTimeout(200);
console.log('caso botones iniciales:', await p.evaluate(z => [...document.querySelectorAll(z + ' button')].map(e => e.textContent.replace(/\s+/g, ' ').trim().slice(0, 60)), C));
const responder = async (Zn, mal) => {
  await p.evaluate(([z, m]) => { const q = s => document.querySelector(z + ' ' + s);
    if (q('[data-accion="ops"]')) q('[data-accion="ops"]').click();
    const ops = [...document.querySelectorAll(z + ' [data-op]')];
    if (ops.length) { (m ? ops[0] : ops.find(o => o.dataset.ok === 'true' || o.classList.contains('ok')) || ops[1]).click(); }
    else if (q('[data-accion="destapa"]')) { q('[data-accion="destapa"]').click(); document.querySelectorAll(z + ' .may-pts input').forEach((c, i) => { c.checked = !m || i > 0; }); q('[data-accion="puntos"]').click(); }
    else if (q('[data-fr="0"]')) { q('[data-fr="0"]').click(); if (m) q('[data-fr="2"]').click(); q('[data-accion="corregir"]').click(); } }, [Zn, mal]);
  await p.waitForTimeout(350);
};
for (let i = 0; i < 6; i++) {
  const mom = await txt(`${C} .may-eyebrow, ${C} .may-momento`);
  const pre = (await txt(C)).slice(0, 160);
  await responder(C, i === 0 || i === 2);
  const res = (await txt(`${C} .may-res`)).slice(0, 260);
  console.log(`paso ${i + 1}: ${pre}\n   → ${res}`);
  if (i === 2) await foto('p-ani-3-error', `#${f} .est-paso[data-paso="caso"]`);
  const sig = await p.evaluate(z => document.querySelector(z + ' .may-res [data-accion="sig"]'), C);
  if (!sig) break;
  const fin = await p.evaluate(z => document.querySelector(z + ' .may-res [data-accion="sig"]').textContent.trim(), C);
  await click(`${C} .may-res [data-accion="sig"]`); await p.waitForTimeout(300);
  if (/llevas/i.test(fin)) { console.log('FIN:', (await txt(C)).slice(0, 700)); await foto('p-ani-fin', `#${f} .est-paso[data-paso="caso"]`); break; }
}
// 4. Para profundizar de mu-gasto-energetico
await abrir('mu-gasto-energetico');
await p.evaluate(() => { const d = document.querySelector('#mu-gasto-energetico .may-profundizar'); d.open = true; d.dispatchEvent(new Event('toggle')); });
await p.waitForTimeout(300);
console.log('profundizar:', (await txt('#mu-gasto-energetico .may-profundizar')).slice(0, 500));
await p.evaluate(() => document.querySelector('#mu-gasto-energetico .may-profundizar').scrollIntoView());
await foto('p-prof-gasto', '#mu-gasto-energetico .may-profundizar');
// 5. Crescencia paso 1: fallar y ver la calculadora
const g = 'mu-sustratos'; await abrir(g); await click(`#${g} .est-ir[data-ir-paso="caso"]`); await p.waitForTimeout(250);
const C2 = `#${g} .est-paso[data-paso="caso"] .may-zona`; await click(`${C2} [data-caso="0"]`); await p.waitForTimeout(200);
console.log('cre-1 antes:', (await txt(C2)).slice(0, 420));
await responder(C2, true); console.log('cre-1 fallo:', (await txt(`${C2} .may-res`)).slice(0, 300));
await foto('p-cre-1', `#${g} .est-paso[data-paso="caso"]`);
console.log('desborde', await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), 'errores', errs);
await b.close();
