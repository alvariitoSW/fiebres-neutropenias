// Recorrido de la Mayéutica del eje vivo (todas las preguntas y los 2 casos) a 390 y 360 px: desborde 0, dock ≤253 px,
// el modelo escondido al predecir y visible al comprobar, citas que llegan, consola limpia. Uso: node ... <url-base>
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { PREGUNTAS, CASOS } from '../../js/data/eje-vivo-mayeutica.js';
const BASE = (process.argv.find(a => /^https?:/.test(a)) || 'http://localhost:8000/').replace(/\/?$/, '/');
const total = []; const b = await chromium.launch();
const txt = h => String(h).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
for (const W of [390, 360]) {
  const fallos = [], errores = [];
  const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: W, height: 844 } }); const p = await ctx.newPage();
  p.on('console', m => m.type() === 'error' && errores.push(m.text())); p.on('pageerror', e => errores.push(String(e)));
  p.on('response', r => r.status() >= 400 && errores.push('HTTP ' + r.status() + ' ' + r.url()));
  const esp = ms => p.waitForTimeout(ms);
  const clic = s => p.evaluate(s => { const e = document.querySelector(s); if (e) e.click(); return !!e; }, '#eje-raiz ' + s);
  const hay = s => p.evaluate(s => { const e = document.querySelector(s); return !!e && e.getClientRects().length > 0; }, s);
  const desb = async que => { const d = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); if (d > 0) fallos.push(`${que}: desborde ${d}px`);
    const k = await p.evaluate(() => document.getElementById('eje-dock').offsetHeight); if (k > 253) fallos.push(`${que}: dock ${k}px > 253`); };
  await p.addInitScript(() => localStorage.removeItem('eje-vivo-mayeutica-v1'));
  await p.goto(BASE + 'index.html', { waitUntil: 'networkidle' }); await esp(1200);
  await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'ejeVivo', ejeVivo: '' }); document.body.append(t); t.click(); t.remove(); });
  await p.waitForFunction(() => window.__eje, null, { timeout: 8000 }); await esp(600);
  // ---- modos Apuesta, Error y Caso ----
  const txtc = s => p.evaluate(s => document.querySelector(s)?.textContent || '', s);
  await clic('#eje-modo-apuesta'); await esp(300);
  if ((await txtc('#eje-m-pa')) !== '?') fallos.push('apuesta: la PA se ve antes de contestar');
  const nOp = await p.evaluate(() => { const l = [...document.querySelectorAll('#eje-prueba .op')].map(b => b.textContent.length); return Math.max(...l) / Math.min(...l); });
  if (nOp > 1.6) fallos.push('apuesta: opciones de longitud muy distinta ' + nOp.toFixed(2));
  await desb('apuesta'); await clic('#eje-prueba .op[data-i="1"]'); await esp(300);
  if ((await txtc('#eje-m-pa')) === '?') fallos.push('apuesta: la PA sigue en «?» tras contestar');
  if (!(await hay('#eje-prueba [data-resaltar]'))) fallos.push('apuesta: sin «Ver en la ficha»'); await desb('apuesta contestada');
  await clic('#eje-prueba [data-otro="apuesta"]'); await esp(300); if (!/Bibiana/.test(await txtc('#eje-prueba'))) fallos.push('«Otra apuesta» no cambia a Bibiana');
  await clic('#eje-modo-error'); await esp(300); await clic('#eje-prueba [data-nada]'); await esp(150);
  if (!/Hay 1 error/.test(await txtc('#eje-prueba'))) fallos.push('error Obdulia: «No hay ningún error» no avisa de 1 error');
  await p.evaluate(() => document.querySelectorAll('#eje-prueba .op:not([data-nada])').forEach(b => b.click())); await esp(200);
  if (!(await hay('#eje-prueba [data-otro="error"]'))) fallos.push('error: sin «Otra nota»'); await desb('error');
  await clic('#eje-prueba [data-otro="error"]'); await esp(300); if ((await p.evaluate(() => document.querySelectorAll('#eje-prueba .op:not([data-nada])').length)) !== 5) fallos.push('error Lucrecia: no hay 5 frases');
  await clic('#eje-modo-caso'); await esp(300);
  for (let k = 0; k < 2; k++) {
    const n = k ? 3 : 4;
    for (let i = 0; i < n; i++) { await clic('#eje-prueba .op[data-i="0"]'); await esp(150); await desb(`caso modo ${k + 1} paso ${i + 1}`); if (i < n - 1) await clic('#eje-prueba [data-sig]'); await esp(200); }
    if (!/Lo que te llevas/.test(await txtc('#eje-prueba'))) fallos.push(`caso modo ${k + 1}: sin «Lo que te llevas»`);
    if (await p.evaluate(() => document.querySelectorAll('#eje-prueba .llevas [data-resaltar]').length) !== 3) fallos.push(`caso modo ${k + 1}: «Lo que te llevas» sin 3 enlaces`);
    if (k === 0) { await clic('#eje-prueba [data-otro="caso"]'); await esp(300); }
  }
  await clic('#eje-modo-explorar'); await esp(200);
  await desb('Explorar'); await clic('#eje-modo-preguntas'); await esp(400); await desb('inicio');
  if (!(await hay('#eje-vista-preguntas'))) fallos.push('no se ve la vista de preguntas');
  await p.screenshot({ path: `/tmp/plan-socialista/b6b/capturas/eje-may-inicio-${W}.png` });
  await clic('#eje-preg [data-ir="recorrido"]'); await esp(300);
  const visible = () => p.evaluate(() => document.getElementById('eje-m-pa').textContent !== '?');
  async function contestar(q, bien, et) {
    const html0 = await p.evaluate(() => document.getElementById('eje-preg').innerHTML);
    if (q.tipo === 'test' && txt(html0).includes(txt(q.opciones.find(o => o.ok).t))) fallos.push(`${et}: respuesta escrita antes`);
    const v0 = await visible();   // «visible» = la PA del monitor no es «?»
    if ((q.predice || q.sinModelo) && v0) fallos.push(`${et}: el monitor se ve antes de contestar`);
    if (!q.predice && !q.sinModelo && !v0) fallos.push(`${et}: el monitor debería verse`);
    if (q.tipo === 'test') {
      await clic('#eje-preg [data-accion="ops"]'); await esp(150);
      const ops = await p.evaluate(() => [...document.querySelectorAll('#eje-preg [data-op]')].map(b => b.textContent.trim()));
      const buena = txt(q.opciones.find(o => o.ok).t); const idx = ops.findIndex(t => (txt(t) === buena) === bien);
      await p.evaluate(i => document.querySelector(`#eje-preg [data-op="${i}"]`).click(), idx);
    } else if (q.tipo === 'destapa') {
      await clic('#eje-preg [data-accion="destapa"]'); await esp(150);
      await p.evaluate(bien => document.querySelectorAll('#eje-preg input[data-p]').forEach((x, i) => { if (bien || i === 0) x.checked = true; }), bien);
      await clic('#eje-preg [data-accion="puntos"]');
    } else {
      await p.evaluate(([mal, bien]) => document.querySelectorAll('#eje-preg [data-fr]').forEach((b, i) => { if (bien && mal[i]) b.click(); }), [q.frases.map(f => f.mal), bien]);
      await clic('#eje-preg [data-accion="corregir"]'); await esp(100);
      await p.evaluate(() => document.querySelectorAll('#eje-preg [data-ver]').forEach(b => b.click()));
    }
    await esp(300);
    if (q.tocar) {
      if (!(await hay('#eje-preg [data-mando="sube"]'))) fallos.push(`${et}: no sale «Compruébalo»`);
      await clic('#eje-preg [data-mando="sube"]');
      await p.waitForFunction(() => document.querySelector('#eje-preg [data-accion="sig"]'), null, { timeout: 15000 }).catch(() => fallos.push(`${et}: sin «Siguiente» tras comprobar`));
      await esp(500); if (!(await visible())) fallos.push(`${et}: tras comprobar, el monitor sigue escondido`);
    } else if (!q.sinModelo && !(await visible())) fallos.push(`${et}: tras contestar el monitor sigue escondido`);
    const rotos = await p.evaluate(() => [...document.querySelectorAll('#eje-preg [data-resaltar]')].map(b => b.dataset.resaltar).filter(id => !document.querySelector(id)));
    if (rotos.length) fallos.push(`${et}: citas rotas ${rotos}`);
    if (!(await p.evaluate(() => document.querySelectorAll('#eje-preg [data-resaltar]').length))) fallos.push(`${et}: sin «Ver en la ficha»`);
    await desb(et);
  }
  const FALLAR = new Set(['G1', 'E2']);
  for (let i = 0; i < PREGUNTAS.length; i++) { const q = PREGUNTAS[i]; await contestar(q, !FALLAR.has(q.num), q.num); if (q.num === 'G2') await p.screenshot({ path: `/tmp/plan-socialista/b6b/capturas/eje-may-g2-${W}.png` }); await clic('#eje-preg [data-accion="sig"]'); await esp(250); }
  const chips = await p.evaluate(() => [...document.querySelectorAll('#eje-preg [data-rep]')].map(b => b.dataset.rep).join());
  if (chips !== 'ejm-g1a,ejm-e2') fallos.push(`repaso: ${chips}`);
  for (const id of ['ejm-g1a', 'ejm-e2']) { await clic(`#eje-preg [data-rep="${id}"]`); await esp(300); await contestar(PREGUNTAS.find(x => x.id === id), true, 'repaso ' + id); await clic('#eje-preg [data-accion="sig"]'); await esp(250); }
  await clic('#eje-preg [data-ir="casos"]'); await esp(300); await desb('lista de casos');
  for (let k = 0; k < CASOS.length; k++) {
    await clic(`#eje-preg [data-caso="${k}"]`); await esp(400);
    for (let i = 0; i < CASOS[k].pasos.length; i++) {
      if (!(await p.evaluate(() => document.querySelectorAll('#eje-preg dl.ejm-paciente dt').length))) fallos.push(`caso ${k} paso ${i + 1}: sin ficha`);
      await contestar(CASOS[k].pasos[i].pregunta, i !== 1, `caso ${k + 1} paso ${i + 1}`); if (k === 1 && i === 3) await p.screenshot({ path: `/tmp/plan-socialista/b6b/capturas/eje-may-caso-${W}.png` });
      await clic('#eje-preg [data-accion="sig"]'); await esp(350);
    }
    if (!/Lo que te llevas/.test(await p.evaluate(() => document.getElementById('eje-preg').textContent))) fallos.push(`caso ${k + 1}: sin «Lo que te llevas»`);
    await desb(`final caso ${k + 1}`);
    if (k === 1) { const r = await p.evaluate(() => [...document.querySelectorAll('#eje-preg [data-resaltar]')].map(b => b.dataset.resaltar).filter(id => !document.querySelector(id))); if (r.length) fallos.push('caso final: cita rota ' + r);
      await clic('#eje-preg [data-fin="modelo"]'); await esp(500);
      if (!(await p.evaluate(() => window.__eje.s.pac === 'toribio' && document.getElementById('eje-vista-preguntas').hidden))) fallos.push('«Volver al eje» no abre Explorar en Toribio'); }
    else { await clic('#eje-preg [data-fin="otro"]'); await esp(300); }
  }
  await desb('de vuelta en Explorar');
  await clic('#eje-modo-preguntas'); await esp(300); await clic('#eje-modo-explorar'); await esp(300);
  if (!(await visible())) fallos.push('Explorar tras Preguntas con la PA en «?»');
  if (errores.length) fallos.push('consola: ' + errores.slice(0, 3).join(' | '));
  console.log(`== ${W} px: ${fallos.length ? fallos.join('\n  - ') : 'verde'}`); total.push(...fallos.map(f => W + ': ' + f)); await ctx.close();
}
await b.close(); console.log(total.length ? `FALLOS ${total.length}` : 'TODO EN VERDE'); process.exit(total.length ? 1 : 0);
