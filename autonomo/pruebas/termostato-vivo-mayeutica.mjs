// Recorrido de la Mayéutica del termostato vivo (todas las preguntas y los 2 casos) a 390 y 360 px: desborde 0, dock ≤253 px,
// el modelo escondido al predecir y visible al comprobar, citas que llegan, consola limpia. Uso: node ... <url-base>
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { PREGUNTAS, CASOS } from '../../js/data/termostato-vivo-mayeutica.js';
const BASE = (process.argv.find(a => /^https?:/.test(a)) || 'http://localhost:8000/').replace(/\/?$/, '/');
const total = []; const b = await chromium.launch();
const txt = h => String(h).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
for (const W of [390, 360]) {
  const fallos = [], errores = [];
  const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: W, height: 844 } }); const p = await ctx.newPage();
  p.on('console', m => m.type() === 'error' && errores.push(m.text())); p.on('pageerror', e => errores.push(String(e)));
  p.on('response', r => r.status() >= 400 && errores.push('HTTP ' + r.status() + ' ' + r.url()));
  const esp = ms => p.waitForTimeout(ms);
  const clic = s => p.evaluate(s => { const e = document.querySelector(s); if (e) e.click(); return !!e; }, '#tmv-raiz ' + s);
  const hay = s => p.evaluate(s => { const e = document.querySelector(s); return !!e && e.getClientRects().length > 0; }, s);
  const desb = async que => { const d = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); if (d > 0) fallos.push(`${que}: desborde ${d}px`);
    const k = await p.evaluate(() => document.getElementById('tmv-dock').offsetHeight); if (k > 253) fallos.push(`${que}: dock ${k}px > 253`); };
  await p.addInitScript(() => localStorage.removeItem('termostato-vivo-mayeutica-v1'));
  await p.goto(BASE + 'index.html', { waitUntil: 'networkidle' }); await esp(1200);
  await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'termostatoVivo', termostatoVivo: '' }); document.body.append(t); t.click(); t.remove(); });
  await p.waitForFunction(() => window.__tmv, null, { timeout: 8000 }); await esp(600);
  await desb('Explorar'); await clic('#tmv-modo-preguntas'); await esp(400); await desb('inicio');
  if (!(await hay('#tmv-vista-preguntas'))) fallos.push('no se ve la vista de preguntas');
  await p.screenshot({ path: `/tmp/plan-socialista/b5/capturas/tmv-may-inicio-${W}.png` });
  await clic('#tmv-preg [data-ir="recorrido"]'); await esp(300);
  const visible = () => hay('#tmv-monitor');
  async function contestar(q, bien, et) {
    const html0 = await p.evaluate(() => document.getElementById('tmv-preg').innerHTML);
    if (q.tipo === 'test' && txt(html0).includes(txt(q.opciones.find(o => o.ok).t))) fallos.push(`${et}: respuesta escrita antes`);
    const v0 = await visible();
    if ((q.predice || q.sinModelo) && v0) fallos.push(`${et}: el monitor se ve antes de contestar`);
    if (!q.predice && !q.sinModelo && !v0) fallos.push(`${et}: el monitor debería verse`);
    if (q.tipo === 'test') {
      await clic('#tmv-preg [data-accion="ops"]'); await esp(150);
      const ops = await p.evaluate(() => [...document.querySelectorAll('#tmv-preg [data-op]')].map(b => b.textContent.trim()));
      const buena = txt(q.opciones.find(o => o.ok).t); const idx = ops.findIndex(t => (txt(t) === buena) === bien);
      await p.evaluate(i => document.querySelector(`#tmv-preg [data-op="${i}"]`).click(), idx);
    } else if (q.tipo === 'destapa') {
      await clic('#tmv-preg [data-accion="destapa"]'); await esp(150);
      await p.evaluate(bien => document.querySelectorAll('#tmv-preg input[data-p]').forEach((x, i) => { if (bien || i === 0) x.checked = true; }), bien);
      await clic('#tmv-preg [data-accion="puntos"]');
    } else {
      await p.evaluate(([mal, bien]) => document.querySelectorAll('#tmv-preg [data-fr]').forEach((b, i) => { if (bien && mal[i]) b.click(); }), [q.frases.map(f => f.mal), bien]);
      await clic('#tmv-preg [data-accion="corregir"]'); await esp(100);
      await p.evaluate(() => document.querySelectorAll('#tmv-preg [data-ver]').forEach(b => b.click()));
    }
    await esp(300);
    if (q.tocar) {
      if (!(await hay('#tmv-preg [data-mando="sube"]'))) fallos.push(`${et}: no sale «Compruébalo»`);
      await clic('#tmv-preg [data-mando="sube"]');
      await p.waitForFunction(() => document.querySelector('#tmv-preg [data-accion="sig"]'), null, { timeout: 15000 }).catch(() => fallos.push(`${et}: sin «Siguiente» tras comprobar`));
      await esp(500); if (!(await visible())) fallos.push(`${et}: tras comprobar, el monitor sigue escondido`);
    } else if (!q.sinModelo && !(await visible())) fallos.push(`${et}: tras contestar el monitor sigue escondido`);
    const rotos = await p.evaluate(() => [...document.querySelectorAll('#tmv-preg [data-resaltar]')].map(b => b.dataset.resaltar).filter(id => !document.querySelector(id)));
    if (rotos.length) fallos.push(`${et}: citas rotas ${rotos}`);
    if (!(await p.evaluate(() => document.querySelectorAll('#tmv-preg [data-resaltar]').length))) fallos.push(`${et}: sin «Ver en la ficha»`);
    await desb(et);
  }
  const FALLAR = new Set(['G1', 'G4', 'E3']);
  for (let i = 0; i < PREGUNTAS.length; i++) { const q = PREGUNTAS[i]; await contestar(q, !FALLAR.has(q.num), q.num); if (q.num === 'G4') await p.screenshot({ path: `/tmp/plan-socialista/b5/capturas/tmv-may-g4-${W}.png` }); await clic('#tmv-preg [data-accion="sig"]'); await esp(250); }
  const chips = await p.evaluate(() => [...document.querySelectorAll('#tmv-preg [data-rep]')].map(b => b.dataset.rep).join());
  if (chips !== 'tmv-g1,tmv-g4,tmv-e3') fallos.push(`repaso: ${chips}`);
  for (const id of ['tmv-g1', 'tmv-g4', 'tmv-e3']) { await clic(`#tmv-preg [data-rep="${id}"]`); await esp(300); await contestar(PREGUNTAS.find(x => x.id === id), true, 'repaso ' + id); await clic('#tmv-preg [data-accion="sig"]'); await esp(250); }
  await clic('#tmv-preg [data-ir="casos"]'); await esp(300); await desb('lista de casos');
  for (let k = 0; k < CASOS.length; k++) {
    await clic(`#tmv-preg [data-caso="${k}"]`); await esp(400);
    for (let i = 0; i < CASOS[k].pasos.length; i++) {
      if (!(await p.evaluate(() => document.querySelectorAll('#tmv-preg dl.tmv-paciente dt').length))) fallos.push(`caso ${k} paso ${i + 1}: sin ficha`);
      await contestar(CASOS[k].pasos[i].pregunta, i !== 1, `caso ${k + 1} paso ${i + 1}`); if (k === 1 && i === 3) await p.screenshot({ path: `/tmp/plan-socialista/b5/capturas/tmv-may-caso-${W}.png` });
      await clic('#tmv-preg [data-accion="sig"]'); await esp(350);
    }
    if (!/Lo que te llevas/.test(await p.evaluate(() => document.getElementById('tmv-preg').textContent))) fallos.push(`caso ${k + 1}: sin «Lo que te llevas»`);
    await desb(`final caso ${k + 1}`);
    if (k === 1) { const r = await p.evaluate(() => [...document.querySelectorAll('#tmv-preg [data-resaltar]')].map(b => b.dataset.resaltar).filter(id => !document.querySelector(id))); if (r.length) fallos.push('caso final: cita rota ' + r);
      await clic('#tmv-preg [data-fin="modelo"]'); await esp(500);
      if (!(await p.evaluate(() => window.__tmv.s.est === 'hipo' && document.getElementById('tmv-vista-preguntas').hidden))) fallos.push('«Volver al termostato» no abre Explorar en hipo'); }
    else { await clic('#tmv-preg [data-fin="otro"]'); await esp(300); }
  }
  await desb('de vuelta en Explorar');
  await clic('#tmv-modo-preguntas'); await esp(300); await clic('#tmv-modo-explorar'); await esp(300);
  if (!(await visible())) fallos.push('Explorar tras Preguntas sin monitor');
  if (errores.length) fallos.push('consola: ' + errores.slice(0, 3).join(' | '));
  console.log(`== ${W} px: ${fallos.length ? fallos.join('\n  - ') : 'verde'}`); total.push(...fallos.map(f => W + ': ' + f)); await ctx.close();
}
await b.close(); console.log(total.length ? `FALLOS ${total.length}` : 'TODO EN VERDE'); process.exit(total.length ? 1 : 0);
