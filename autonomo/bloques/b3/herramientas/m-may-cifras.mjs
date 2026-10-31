// Comprueba que las cifras de la Mayéutica del pulmón (`lee` de cada estado y `cifras` antes → después de «Compruébalo»)
// son las que enseña el monitor de la app (390 px). Uso: node m-may-cifras.mjs http://localhost:PUERTO/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8000/').replace(/\/?$/, '/');
const M = await import(new URL('../../../../js/data/pulmon-vivo-mayeutica.js', import.meta.url));
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
const num = (s) => { const m = String(s ?? '').replace('−', '-').replace(',', '.').match(/-?\d+(\.\d+)?/); return m ? +m[0] : null; };
async function abrir(mod) {
  await p.evaluate((k) => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'pulmonVivo', pulmonVivo: k }); document.body.append(t); t.click(); t.remove(); }, mod.estado);
  await p.waitForTimeout(1300); await p.evaluate(() => window.__pulPruebas().llenar());
  await mandos(mod.mandos);
}
async function mandos(m) {
  for (const [k, v] of Object.entries(m || {})) {
    await p.evaluate(([k, v]) => { let d = document.querySelector(`#pul-dock-panel input[data-m="${k}"]`);
      for (const t of ['resp', 'pulmon', 'man']) { if (d) break; document.querySelector(`#pul-dock-tabs [data-pest="${t}"]`).click(); d = document.querySelector(`#pul-dock-panel input[data-m="${k}"]`); }
      d.value = v; d.dispatchEvent(new Event('input', { bubbles: true })); }, [k, v]);
    await p.waitForTimeout(120); await p.evaluate(() => window.__pulPruebas().llenar());
  }
  await p.waitForTimeout(700);
}
const leer = (fila) => p.evaluate((f) => { const e = document.querySelector(`#pul-raiz [data-fila="${f}"]`); return e ? (e.querySelector('.v, .g')?.textContent ?? '') : ''; }, fila);
let mal = 0, n = 0;
const cmp = (et, fila, esp, real) => { n++; const r = num(real), ok = r != null && Math.abs(r - esp) <= 0.06 + (Math.abs(esp) >= 100 ? 0.5 : 0); if (!ok) { mal++; console.log(`❌ ${et}: ${fila} esperado ${esp}, la app da «${real}»`); } };
const todas = [...M.PREGUNTAS.map((q) => [q.id, q]), ...M.CASOS.flatMap((c) => c.pasos.map((s) => [s.pregunta.id, s.pregunta, s]))];
for (const [id, q, paso] of todas) {
  const lee = q.modelo?.lee || paso?.modelo?.lee;
  if (lee) { await abrir(paso?.modelo || q.modelo); for (const [f, v] of Object.entries(lee)) cmp(id, f, v, await leer(f)); }
  if (q.comprobar?.cifras?.length) {
    await abrir(q.modelo); for (const [, f, a] of q.comprobar.cifras) cmp(id + ' (antes)', f, a, await leer(f));
    await mandos(q.comprobar.mandos); for (const [, f, , d] of q.comprobar.cifras) cmp(id + ' (después)', f, d, await leer(f));
  }
}
console.log(`${mal ? '❌' : '✅'} ${n - mal} de ${n} cifras coinciden con el monitor de la app`);
await b.close(); process.exit(mal ? 1 : 0);
