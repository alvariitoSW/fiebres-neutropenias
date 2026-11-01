// La Mayéutica del cráneo vivo (parte de autonomo/pruebas/craneo-vivo.mjs): recorrido entero (fallando G1, G4 y E2), repaso, los dos casos,
// «nada tapado» y desborde tras cada respuesta. Sale de la del receptor vivo (autonomo/pruebas/receptor-vivo.mjs).
import { PREGUNTAS, CASOS } from '../../js/data/craneo-vivo-mayeutica.js';
export async function mayeuticaCraneo({ abre, p, ok, fallos, foto, ANCHO }) {
  await abre(); await p.waitForTimeout(800);
  const esp = (ms) => p.waitForTimeout(ms), txt = (h) => String(h).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const clic = (sel) => p.evaluate((s) => { const e = document.querySelector(s); if (e) e.click(); return !!e; }, sel);
  const hay = (sel) => p.evaluate((s) => { const e = document.querySelector(s); return !!e && e.getClientRects().length > 0; }, sel);
  const sinDesborde = async (que) => { const d = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); if (d > 0) fallos.push(`${ANCHO}: ${que}: desborde ${d}px`); };
  const libre = async (sel, que) => {
    const r = await p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(), d = document.getElementById('crv-dock').getBoundingClientRect(); return { fondo: b.bottom, dock: d.top, tope: b.top }; }, sel);
    ok(r && r.tope >= 0 && r.fondo <= r.dock + 1, `${ANCHO}: ${que}: a la vista y sobre el dock${r ? ` (fondo ${Math.round(r.fondo)}, dock ${Math.round(r.dock)})` : ' (no existe)'}`);
  };
  const cont = '#crv-preg';
  async function contestar(q, bien, etq) {
    const html0 = await p.evaluate((s) => document.querySelector(s).innerHTML, cont);
    if (q.tipo === 'test' && txt(html0).includes(txt(q.opciones.find((o) => o.ok).t))) fallos.push(`${etq}: la respuesta buena está escrita antes de contestar`);
    if (q.predice) { const o = await p.evaluate(() => window.__craneo.oculto); if (!o) fallos.push(`${etq}: el monitor se ve antes de contestar`); }
    if (q.tipo === 'test') {
      await clic(`${cont} [data-accion="ops"]`); await esp(150);
      const ops = await p.evaluate((s) => [...document.querySelectorAll(s + ' [data-op]')].map((b) => b.textContent.trim()), cont);
      const buena = txt(q.opciones.find((o) => o.ok).t), idx = ops.findIndex((t) => (txt(t) === buena) === bien);
      await p.evaluate(([s, i]) => document.querySelector(`${s} [data-op="${i}"]`).click(), [cont, idx]);
    } else if (q.tipo === 'destapa') {
      await clic(`${cont} [data-accion="destapa"]`); await esp(150);
      await p.evaluate(([s, b]) => document.querySelectorAll(`${s} input[data-p]`).forEach((x, i) => { if (b || i === 0) x.checked = true; }), [cont, bien]);
      await clic(`${cont} [data-accion="puntos"]`);
    } else {
      await p.evaluate(([s, mal, b]) => document.querySelectorAll(`${s} [data-fr]`).forEach((x, i) => { if (b && mal[i]) x.click(); }), [cont, q.frases.map((f) => f.mal), bien]);
      await clic(`${cont} [data-accion="corregir"]`); await esp(100);
      await p.evaluate((s) => document.querySelectorAll(`${s} [data-ver]`).forEach((x) => x.click()), cont);
    }
    await esp(300);
    if (q.tocar) {
      if (!(await hay(`${cont} [data-mando="sube"]`))) fallos.push(`${etq}: no sale «Compruébalo»`);
      await clic(`${cont} [data-mando="sube"]`);
      await p.waitForFunction(() => document.querySelector('#crv-preg [data-accion="sig"]'), null, { timeout: 20000 }).catch(() => fallos.push(`${etq}: tras «Compruébalo» no sale «Siguiente»`));
    }
    if (await p.evaluate(() => window.__craneo.oculto)) fallos.push(`${etq}: tras contestar el monitor sigue tapado`);
    const rotos = await p.evaluate((s) => [...document.querySelectorAll(`${s} [data-resaltar]`)].map((b) => b.dataset.resaltar).filter((id) => !document.querySelector(id)), cont);
    if (rotos.length) fallos.push(`${etq}: citas rotas ${rotos}`);
    const n = await p.evaluate((s) => document.querySelectorAll(`${s} [data-resaltar]`).length, cont);
    if (!n) fallos.push(`${etq}: sin «Ver en la ficha»`);
    await esp(500); await sinDesborde(etq); await libre(`${cont} [data-accion="sig"]`, etq);
    return n;
  }
  await p.evaluate(() => { localStorage.removeItem('craneo-vivo-mayeutica-v1'); });
  await clic('#crv-modo-preguntas'); await esp(400);
  ok(await hay('#crv-vista-preguntas') && !(await hay('#crv-presets')), `${ANCHO}: Preguntas: se ve el inicio y se esconden los pacientes del modo Explorar`);
  ok(await p.evaluate(() => document.getElementById('crv-dock-estudio').hidden === false && document.getElementById('crv-dock-panel').hidden), `${ANCHO}: el dock de progreso sustituye al de mandos`);
  await foto('mayeutica-inicio'); await sinDesborde('inicio');
  await clic(`${cont} [data-ir="recorrido"]`); await esp(300);
  const FALLAR = new Set(['G1', 'G4', 'E2']); let tot = 0;
  for (let i = 0; i < PREGUNTAS.length; i++) {
    const q = PREGUNTAS[i];
    tot += await contestar(q, !FALLAR.has(q.num), q.num);
    if (q.num === 'G1' || q.num === 'E4') await foto('mayeutica-' + q.num);
    await clic(`${cont} [data-accion="sig"]`); await esp(300);
  }
  ok(tot >= PREGUNTAS.length, `${ANCHO}: ${PREGUNTAS.length} preguntas, cada una con su «Ver en la ficha» (${tot})`);
  const chips = await p.evaluate(() => [...document.querySelectorAll('#crv-preg [data-rep]')].map((b) => b.dataset.rep));
  ok(chips.join() === 'crv-g1,crv-g4,crv-e2', `${ANCHO}: repaso: vuelve solo lo fallado (${chips})`);
  await sinDesborde('repaso');
  for (const id of ['crv-g1', 'crv-g4', 'crv-e2']) { await clic(`${cont} [data-rep="${id}"]`); await esp(300); await contestar(PREGUNTAS.find((x) => x.id === id), true, 'repaso ' + id); await clic(`${cont} [data-accion="sig"]`); await esp(300); }
  ok(await p.evaluate(() => /No queda nada por repasar/.test(document.getElementById('crv-preg').textContent)), `${ANCHO}: repaso: acertar saca las preguntas de la lista`);
  await clic(`${cont} [data-ir="casos"]`); await esp(300); await sinDesborde('lista de casos');
  for (let k = 0; k < CASOS.length; k++) {
    await clic(`${cont} [data-caso="${k}"]`); await esp(400);
    for (let i = 0; i < CASOS[k].pasos.length; i++) {
      const ficha = await p.evaluate(() => document.querySelectorAll('#crv-preg dl.crv-paciente dt').length);
      if (!ficha) fallos.push(`caso ${k + 1} paso ${i + 1}: sin ficha del paciente`);
      if (i === 1) await foto(`mayeutica-caso${k + 1}-paso2`);
      await contestar(CASOS[k].pasos[i].pregunta, i !== 1, `caso ${k + 1} paso ${i + 1}`);
      await clic(`${cont} [data-accion="sig"]`); await esp(400);
    }
    ok(await p.evaluate(() => /Lo que te llevas/.test(document.getElementById('crv-preg').textContent)), `${ANCHO}: caso ${k + 1}: sale «Lo que te llevas»`);
    await sinDesborde(`final del caso ${k + 1}`); await foto(`mayeutica-caso${k + 1}-final`);
    if (k === 0) { await clic(`${cont} [data-fin="otro"]`); await esp(300); }
  }
  ok(await hay(`${cont} [data-fin="modelo"]`), `${ANCHO}: caso: sale «Volver al cráneo»`);
  await clic(`${cont} [data-fin="modelo"]`); await esp(500);
  ok(await p.evaluate(() => document.getElementById('crv-vista-preguntas').hidden && !document.getElementById('crv-presets').hidden), `${ANCHO}: «Volver al cráneo» abre el modelo`);
  ok(await p.evaluate(() => window.__craneo.s.tipo === 'ventricular'), `${ANCHO}: «Volver al cráneo» del caso de Segismundo abre a Segismundo`);
  console.log('✅ volver al paciente del caso (Segismundo)');
  await sinDesborde('de vuelta en Explorar');
}
