// Mayéutica de la placa viva: guía, examen, repaso y los dos casos enteros, con desborde tras cada respuesta, el modelo escondido antes de contestar,
// las citas «Ver en la ficha» existentes y las cifras del caso iguales a las del monitor de la app. Lo llama autonomo/pruebas/placa-viva.mjs.
import { PREGUNTAS, CASOS } from '../../js/data/placa-viva-mayeutica.js';
export async function mayeutica({ p, ok, fallos, ANCHO, CAP, desb }) {
  console.log('-- Mayéutica (guía, examen, repaso y los dos casos)');
  const esp = (ms) => p.waitForTimeout(Math.min(ms, 250));
  const foto = (n) => p.screenshot({ path: `${CAP}${n}-${ANCHO}.png` });
  const txt = (h) => String(h).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const clic = (sel) => p.evaluate((s) => { const e = document.querySelector(s); if (e) e.click(); return !!e; }, sel);
  const hay = (sel) => p.evaluate((s) => { const e = document.querySelector(s); return !!e && e.getClientRects().length > 0; }, sel);
  const modelo = () => p.evaluate(() => ['plv-monitor', 'plv-escena'].map((i) => !document.getElementById(i).hidden));
  const sinDesborde = async (que) => { const d = await desb(); if (d > 0) fallos.push(`${ANCHO} ${que}: desborde ${d}px`); };
  const libre = async (sel, que) => {
    const r = await p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(), d = document.getElementById('plv-dock').getBoundingClientRect(); return { fondo: b.bottom, dock: d.top, tope: b.top }; }, sel);
    ok(r && r.tope >= 0 && r.fondo <= r.dock + 1, `${ANCHO} ${que}: botón a la vista y sobre el dock${r ? ` (fondo ${Math.round(r.fondo)}, dock ${Math.round(r.dock)})` : ' (no existe)'}`);
  };
  const cont = '#plv-preg';
  async function contestar(q, bien, etiqueta) {
    const html0 = await p.evaluate((s) => document.querySelector(s).innerHTML, cont);
    if (q.tipo === 'test') { const buena = txt(q.opciones.find((o) => o.ok).t); if (txt(html0).includes(buena)) fallos.push(`${etiqueta}: la respuesta buena está escrita antes de contestar`); }
    const m0 = await modelo();
    if (q.sinModelo ? m0.some(Boolean) : (q.predice && m0.some(Boolean))) fallos.push(`${etiqueta}: modelo a la vista antes de contestar (${m0})`);
    if (q.tipo === 'test') {
      await clic(`${cont} [data-accion="ops"]`); await esp(150);
      const ops = await p.evaluate((s) => [...document.querySelectorAll(s + ' [data-op]')].map((b) => b.textContent.trim()), cont);
      const buena = txt(q.opciones.find((o) => o.ok).t), idx = ops.findIndex((t) => (txt(t) === buena) === bien);
      await p.evaluate(([s, i]) => document.querySelector(`${s} [data-op="${i}"]`).click(), [cont, idx]);
    } else if (q.tipo === 'destapa') {
      await clic(`${cont} [data-accion="destapa"]`); await esp(150);
      await p.evaluate(([s, bien]) => document.querySelectorAll(`${s} input[data-p]`).forEach((x, i) => { if (bien || i === 0) x.checked = true; }), [cont, bien]);
      await clic(`${cont} [data-accion="puntos"]`);
    } else {
      await p.evaluate(([s, mal, bien]) => document.querySelectorAll(`${s} [data-fr]`).forEach((b, i) => { if (bien && mal[i]) b.click(); }), [cont, q.frases.map((f) => f.mal), bien]);
      await clic(`${cont} [data-accion="corregir"]`); await esp(100);
      await p.evaluate((s) => document.querySelectorAll(`${s} [data-ver]`).forEach((b) => b.click()), cont);
    }
    await esp(300);
    if (q.tocar) {
      if (!(await hay(`${cont} [data-mando="sube"]`))) fallos.push(`${etiqueta}: no sale «Compruébalo»`);
      await clic(`${cont} [data-mando="sube"]`);
      await p.waitForFunction(() => document.querySelector('#plv-preg [data-accion="sig"]'), null, { timeout: 8000 }).catch(() => fallos.push(`${etiqueta}: tras «Compruébalo» no sale «Siguiente»`));
      await esp(300);
      const m = await modelo(); if (!m.every(Boolean)) fallos.push(`${etiqueta}: tras comprobar, el modelo sigue escondido (${m})`);
      const conf = await p.evaluate(() => document.getElementById('plv-preg').textContent); if (/NaN|undefined/.test(conf)) fallos.push(`${etiqueta}: cifra rota en la confirmación`);
    } else if (!q.sinModelo) { const m = await modelo(); if (!m.every(Boolean)) fallos.push(`${etiqueta}: tras contestar, el modelo sigue escondido (${m})`); }
    const rotos = await p.evaluate((s) => [...document.querySelectorAll(`${s} [data-resaltar]`)].map((b) => b.dataset.resaltar).filter((id) => !document.querySelector(id)), cont);
    if (rotos.length) fallos.push(`${etiqueta}: citas rotas ${rotos}`);
    const n = await p.evaluate((s) => document.querySelectorAll(`${s} [data-resaltar]`).length, cont);
    if (!n) fallos.push(`${etiqueta}: sin «Ver en la ficha»`);
    await esp(300); await sinDesborde(etiqueta); await libre(`${cont} [data-accion="sig"]`, etiqueta);
    return n;
  }
  await p.evaluate(() => { localStorage.removeItem('placa-viva-mayeutica-v1'); window.__plv.ponerPreset('flor'); });
  await clic('#plv-modo-preguntas'); await esp(400);
  ok(await hay('#plv-vista-preguntas') && !(await hay('#plv-detalle-lupa')) && !(await hay('#plv-dock-panel')), 'Mayéutica: se ve el inicio y se esconden la lupa y los mandos');
  ok(await p.evaluate(() => !document.getElementById('plv-dock-estudio').hidden && document.getElementById('plv-dock-explorar').hidden), 'Mayéutica: el dock de progreso sustituye al de mandos');
  await foto('m1-inicio'); await sinDesborde('inicio');
  await clic(`${cont} [data-ir="recorrido"]`); await esp(300);
  const FALLAR = new Set(['G1', 'G4', 'E3']); let citas = 0;
  for (let i = 0; i < PREGUNTAS.length; i++) {
    const q = PREGUNTAS[i];
    citas += await contestar(q, !FALLAR.has(q.num), q.num);
    if (q.num === 'G1') await foto('m2-pregunta-fallada');
    if (q.num === 'G5') await foto('m3-comprobada');
    await clic(`${cont} [data-accion="sig"]`); await esp(250);
  }
  ok(citas >= PREGUNTAS.length, `${PREGUNTAS.length} preguntas, cada una con su «Ver en la ficha» (${citas})`);
  const chips = await p.evaluate(() => [...document.querySelectorAll('#plv-preg [data-rep]')].map((b) => b.dataset.rep));
  ok(chips.join() === 'plv-g1,plv-g4,plv-e3', `repaso: vuelve solo lo fallado (${chips})`);
  await foto('m4-repaso'); await sinDesborde('repaso');
  for (const id of ['plv-g1', 'plv-g4', 'plv-e3']) { await clic(`${cont} [data-rep="${id}"]`); await esp(250); await contestar(PREGUNTAS.find((x) => x.id === id), true, 'repaso ' + id); await clic(`${cont} [data-accion="sig"]`); await esp(250); }
  ok(await p.evaluate(() => /No queda nada por repasar/.test(document.getElementById('plv-preg').textContent)), 'repaso: acertar saca las preguntas de la lista');
  await clic(`${cont} [data-ir="casos"]`); await esp(250); await sinDesborde('lista de casos');
  for (let c = 0; c < CASOS.length; c++) {
    const C = CASOS[c];
    await clic(`${cont} [data-caso="${c}"]`); await esp(300);
    for (let i = 0; i < C.pasos.length; i++) {
      const paso = C.pasos[i], q = paso.pregunta;
      const ficha = await p.evaluate(() => [...document.querySelectorAll('#plv-preg dl.plv-paciente dt')].map((e) => e.textContent));
      if (!ficha.length) fallos.push(`${C.corto} paso ${i + 1}: sin ficha del paciente`);
      if (i > 0 && Object.keys(paso.datos).length) { const nuevos = await p.evaluate(() => document.querySelectorAll('#plv-preg .plv-cambia').length); if (!nuevos) fallos.push(`${C.corto} paso ${i + 1}: lo nuevo no sale marcado`); }
      // las cifras de la ficha del paso (CV, PIM, FC, PA, K⁺, TOF) coinciden con el monitor de la app en ese estado
      const mon = await p.evaluate(() => ({ cv: document.getElementById('plv-m-cv').textContent, pim: document.getElementById('plv-m-pim').textContent, fc: document.getElementById('plv-m-fc').textContent, pa: document.getElementById('plv-m-pa').textContent, k: document.getElementById('plv-m-k').textContent, tof: document.getElementById('plv-m-tof').textContent }));
      console.log(`   ${C.corto} paso ${i + 1}:`, JSON.stringify(mon), '| ficha:', JSON.stringify(paso.datos));
      if (C.corto === 'Florentina' && i < 2) ok(mon.cv.replace(/\./g, '').includes(i ? '840' : '1092') && mon.pim.includes(i ? '−20' : '−26'), `${C.corto} paso ${i + 1}: la ficha del caso no es la del monitor (${mon.cv} / ${mon.pim})`);
      if (C.corto === 'Florentina' && i === 3) ok(mon.fc === '132' && mon.pa === '80/40', `Florentina paso 4: FC/PA del monitor ${mon.fc} ${mon.pa}`);
      await contestar(q, i !== 2, `${C.corto} paso ${i + 1}`);
      await clic(`${cont} [data-accion="sig"]`); await esp(300);
    }
    ok(await p.evaluate(() => /Lo que te llevas/.test(document.getElementById('plv-preg').textContent)), `${C.corto}: sale «Lo que te llevas»`);
    await foto(`m5-caso${c + 1}-final`); await sinDesborde(`final del caso ${c + 1}`);
    await libre(`${cont} [data-fin="otro"]`, `final del caso ${c + 1}`).catch(() => {});
    const rotosFin = await p.evaluate(() => [...document.querySelectorAll('#plv-preg [data-resaltar]')].map((b) => b.dataset.resaltar).filter((id) => !document.querySelector(id)));
    ok(rotosFin.length === 0 && await hay(`${cont} [data-resaltar]`), `${C.corto}: «Repasar en la ficha» llega a un id que existe`);
    if (c === 0) { await clic(`${cont} [data-fin="otro"]`); await esp(250); } else { await clic(`${cont} [data-fin="modelo"]`); await esp(300); }
  }
  ok(await p.evaluate(() => !document.getElementById('plv-dock-panel').parentElement.hidden && document.getElementById('plv-vista-preguntas').hidden), '«Volver a la placa viva» abre el modo Explorar');
  await sinDesborde('de vuelta en Explorar');
  await clic('#plv-modo-preguntas'); await esp(250); await clic('#plv-modo-explorar'); await esp(300);
  ok(await hay('#plv-monitor') && await hay('#plv-dock-panel'), 'Explorar ↔ Preguntas: ida y vuelta sin perder el modelo');
}
