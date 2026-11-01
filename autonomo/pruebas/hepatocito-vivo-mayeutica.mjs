// Recorrido de la Mayéutica del hepatocito vivo (parte de autonomo/pruebas/hepatocito-vivo.mjs): las 12 preguntas (fallando G6, E1 y E4),
// el repaso y los dos casos enteros, con desborde 0, «nada tapado» y las cifras de la ficha del paciente contra el monitor de la app.
const { PREGUNTAS, CASOS } = await import(new URL('../../js/data/hepatocito-vivo-mayeutica.js', import.meta.url));
const txt = h => String(h).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
export async function mayeutica({ p, ok, fallos, desb, ANCHO, cap }) {
  const esp = ms => p.waitForTimeout(ms), cont = '#hpv-preg';
  const clic = sel => p.evaluate(s => { const e = document.querySelector(s); if (e) e.click(); return !!e; }, sel);
  const hay = sel => p.evaluate(s => { const e = document.querySelector(s); return !!e && e.getClientRects().length > 0; }, sel);
  const nh3 = () => p.evaluate(() => document.getElementById('hpv-mon-nh3').textContent);
  const sinDesborde = async que => { const d = await desb(que); return d; };
  const libre = async (sel, que) => {
    const r = await p.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(), d = document.getElementById('hpv-dock').getBoundingClientRect(); return { fondo: b.bottom, dock: d.top, tope: b.top }; }, sel);
    ok(r && r.tope >= 0 && r.fondo <= r.dock + 1, `${ANCHO} ${que}: el botón queda a la vista y sobre el dock${r ? '' : ' (no existe)'}`);
  };
  async function contestar(q, bien, et) {
    const html0 = await p.evaluate(s => document.querySelector(s).innerHTML, cont);
    if (q.tipo === 'test') ok(!txt(html0).includes(txt(q.opciones.find(o => o.ok).t)), `${et}: la respuesta buena está escrita antes de contestar`);
    const vis = await hay('#hpv-monitor');
    if (q.sinModelo) ok(!vis, `${et}: pregunta sin modelo y el monitor a la vista`);
    else { ok(vis, `${et}: el monitor no está a la vista`); if (q.predice) ok((await nh3()).includes('?'), `${et}: el monitor enseña la cifra antes de predecir (${await nh3()})`); }
    if (q.tipo === 'test') {
      await clic(`${cont} [data-accion="ops"]`); await esp(150);
      const ops = await p.evaluate(s => [...document.querySelectorAll(s + ' [data-op]')].map(b => b.textContent.trim()), cont);
      const buena = txt(q.opciones.find(o => o.ok).t); const i = ops.findIndex(t => (txt(t) === buena) === bien);
      await p.evaluate(([s, i]) => document.querySelector(`${s} [data-op="${i}"]`).click(), [cont, i]);
    } else if (q.tipo === 'destapa') {
      await clic(`${cont} [data-accion="destapa"]`); await esp(150);
      await p.evaluate(([s, bien]) => document.querySelectorAll(`${s} input[data-p]`).forEach((x, i) => { if (bien || i === 0) x.checked = true; }), [cont, bien]);
      await clic(`${cont} [data-accion="puntos"]`);
    } else {
      await p.evaluate(([s, mal, bien]) => document.querySelectorAll(`${s} [data-fr]`).forEach((b, i) => { if (bien && mal[i]) b.click(); }), [cont, q.frases.map(f => f.mal), bien]);
      await clic(`${cont} [data-accion="corregir"]`); await esp(100);
      await p.evaluate(s => document.querySelectorAll(`${s} [data-ver]`).forEach(b => b.click()), cont);
    }
    await esp(300);
    if (q.tocar) {
      ok(await hay(`${cont} [data-mando="sube"]`), `${et}: no sale «Compruébalo»`);
      await clic(`${cont} [data-mando="sube"]`);
      await p.waitForFunction(() => document.querySelector('#hpv-preg [data-accion="sig"]'), null, { timeout: 15000 }).catch(() => fallos.push(`${et}: tras «Compruébalo» no sale «Siguiente»`));
      await esp(500);
    }
    if (!q.sinModelo) ok(!(await nh3()).includes('?') && await hay('#hpv-monitor'), `${et}: tras contestar el monitor sigue tapado (${await nh3()})`);
    const rotos = await p.evaluate(s => [...document.querySelectorAll(`${s} [data-resaltar]`)].map(b => b.dataset.resaltar).filter(id => !document.querySelector(id)), cont);
    ok(!rotos.length, `${et}: citas rotas ${rotos}`);
    ok((await p.evaluate(s => document.querySelectorAll(`${s} [data-resaltar]`).length, cont)) > 0, `${et}: sin «Ver en la ficha»`);
    await esp(500); await sinDesborde(et); await libre(`${cont} [data-accion="sig"]`, et);
  }
  await p.evaluate(() => { localStorage.removeItem('hepatocito-vivo-mayeutica-v1'); window.__hpv.modoPrueba('preguntas'); }); await esp(500);
  ok(await hay('#hpv-vista-preguntas') && !(await hay('#hpv-dock-panel')) && await hay('#hpv-dock-estudio'), `${ANCHO} Mayéutica: se ve el inicio, el dock de progreso sustituye al de mandos`);
  ok(await p.evaluate(() => document.getElementById('hpv-modo-preguntas').getAttribute('aria-pressed') === 'true'), 'botón Preguntas sin marcar');
  await sinDesborde('Mayéutica inicio'); if (cap) await cap('10-mayeutica-inicio');
  await clic(`${cont} [data-ir="recorrido"]`); await esp(300);
  const FALLAR = new Set(['hpv-g6', 'hpv-e1', 'hpv-e4']);
  for (let i = 0; i < PREGUNTAS.length; i++) {
    const q = PREGUNTAS[i], et = `${ANCHO} ${q.num}`;
    ok(await p.evaluate(([s, n]) => (document.querySelector(s + ' .hpv-cab-preg')?.textContent || '').includes(n), [cont, q.num]), `${et}: no sale en su orden`);
    await contestar(q, !FALLAR.has(q.id), et); if (cap && i === 1) await cap('11-mayeutica-g2-comprobada');
    await clic(`${cont} [data-accion="sig"]`); await esp(300);
  }
  const chips = await p.evaluate(() => [...document.querySelectorAll('#hpv-preg [data-rep]')].map(b => b.dataset.rep));
  ok(chips.length === FALLAR.size, `repaso: ${chips.length} chips y deberían ser ${FALLAR.size}`);
  for (const id of chips) { await clic(`${cont} [data-rep="${id}"]`); await esp(300); await contestar(PREGUNTAS.find(q => q.id === id), true, `${ANCHO} repaso ${id}`); await clic(`${cont} [data-accion="sig"]`); await esp(300); }
  ok(/No queda nada por repasar/.test(await p.evaluate(() => document.getElementById('hpv-preg').textContent)), 'repaso: acertar saca las preguntas de la lista');
  await clic(`${cont} [data-ir="casos"]`); await esp(300);
  for (let k = 0; k < CASOS.length; k++) {
    const C = CASOS[k];
    if (k) { await clic(`${cont} [data-fin="otro"]`); await esp(300); }
    await clic(`${cont} [data-caso="${k}"]`); await esp(400);
    for (let i = 0; i < C.pasos.length; i++) {
      const st = C.pasos[i], et = `${ANCHO} ${C.corto} paso ${i + 1}`;
      const nuevos = await p.evaluate(() => document.querySelectorAll('#hpv-preg .hpv-cambia').length);
      if (st.nuevo.length) ok(nuevos >= st.nuevo.length, `${et}: lo nuevo no sale marcado (${nuevos})`);
      await contestar({ ...st.pregunta, predice: false }, true, et);
      // la cifra de amonio de la ficha es la que da el monitor de la app en ese estado
      const dato = st.datos['Amonio arterial'];
      if (dato) { const m = await nh3(); ok(m.startsWith(dato.split(' ')[0]), `${et}: la ficha dice ${dato} y el monitor ${m}`); }
      const wh = await p.evaluate(() => document.getElementById('hpv-mon-wh').textContent);
      if (k === 0 && i === 3) ok(/3/.test(wh), `${et}: West Haven 3 en el monitor (${wh})`);
      await clic(`${cont} [data-accion="sig"]`); await esp(400);
    }
    ok(/Lo que te llevas/.test(await p.evaluate(() => document.getElementById('hpv-preg').textContent)), `${C.corto}: sale «Lo que te llevas»`);
    await sinDesborde(`${C.corto} final`); await libre(`${cont} [data-fin="otro"]`, `${C.corto} final`);
    const rotos = await p.evaluate(() => [...document.querySelectorAll('#hpv-preg [data-resaltar]')].map(b => b.dataset.resaltar).filter(id => !document.querySelector(id)));
    ok(!rotos.length && await hay(`${cont} [data-fin="modelo"]`), `${C.corto}: final con enlaces rotos ${rotos} o sin «Volver al hepatocito»`);
    if (cap && k === 0) await cap('12-mayeutica-caso-final');
  }
  await clic(`${cont} [data-fin="modelo"]`); await esp(500);
  ok(await hay('#hpv-dock-panel') && !(await hay('#hpv-vista-preguntas')), 'Mayéutica: «Volver al hepatocito» devuelve los mandos');
  await sinDesborde('tras salir');
}
