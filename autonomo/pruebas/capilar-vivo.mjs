// Prueba de navegador del capilar y oxígeno (juez de autonomo/jueces.mjs --modelo capilar-vivo).
// Uso: node autonomo/pruebas/capilar-vivo.mjs <url-base> [--capturas <carpeta>]
// Copia la del río y mar (agua-viva.mjs). Recorre, a 390 px (con movimiento y su medida de rendimiento) y a 360 px
// (con «reducir movimiento»), cada uno en un contexto limpio: accesos (menú de Libros, buscador y las 4 fichas del
// grupo oxígeno con su estado), los mandos en sus extremos y su punto medio (cifras de un paciente posible), la
// Mayéutica entera fallando 4 con su repaso, los 4 casos hasta «Lo que te llevas», lo guardado tras recargar,
// Conceptos y el «← VOLVER» a la ficha. Mide el desborde lateral (0 px) tras cada respuesta, el repaso y cada paso
// de los casos; comprueba que las cifras que se predicen salen tapadas y los errores de consola.
// Sale con código 1 si algo falla.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const { PREGUNTAS, CASOS, CONCEPTOS } = await import(new URL('../../js/data/capilar-vivo-data.js', import.meta.url));
const { barajar } = await import(new URL('../../js/core/mayeutica-motor.js', import.meta.url));
const args = process.argv.slice(2);
const BASE = (args.find(a => /^https?:/.test(a)) || 'http://localhost:8000/').replace(/\/?$/, '/');
const CAPTURAS = args.includes('--capturas') ? args[args.indexOf('--capturas') + 1].replace(/\/?$/, '/') : null;
const b = await chromium.launch();
const fallosTotales = [];

async function correr(ANCHO, REDUCIDO) {
const tag = `${ANCHO}${REDUCIDO ? '-red' : ''}`;
console.log(`\n── ${ANCHO} px${REDUCIDO ? ' · reducir movimiento' : ''}`);
const ctx = await b.newContext({ viewport: { width: ANCHO, height: 844 }, deviceScaleFactor: 2, reducedMotion: REDUCIDO ? 'reduce' : 'no-preference' });
const p = await ctx.newPage();
const errores = [], fallos = [];
p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errores.push(m.text()); });
p.on('pageerror', e => errores.push('PAGE ' + e.message));
const ok = (c, t) => { console.log(`${c ? '✅' : '❌'} ${t}`); if (!c) fallos.push(t); };
const pulsar = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no hay ' + s); e.click(); }, sel);
const desborde = () => p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const T = () => p.evaluate(() => { const t = window.__cpvPruebas(); return { estado: t.estado, R: t.R, modo: t.modo, fase: t.fase, todo: t.todoCoincide, bucle: t.bucle, guardado: t.guardado, celdas: t.celdas, lupa: t.lupa, ocultos: t.ocultos, extremos: t.extremos, mayeutica: t.mayeutica }; });
const foto = n => CAPTURAS ? p.screenshot({ path: CAPTURAS + 'cpv-' + n + '-' + tag + '.png' }) : null;
const vistaVisible = () => p.evaluate(() => { const v = document.getElementById('capilar-vivo-view'); return v.style.display === 'block' && v.offsetParent !== null && document.getElementById('libros-view').style.display === 'block'; });
const deslizar = (sel, v) => p.evaluate(([s, v]) => { const r = document.querySelector(s); r.value = v; r.dispatchEvent(new Event('input', { bubbles: true })); }, [sel, v]);

await p.goto(BASE + 'index.html');   // contexto nuevo: localStorage vacío
await p.waitForFunction(() => window.__cpvPruebas);

// 1. Desde el menú de Libros
await p.click('#btn-libros'); await p.click('#btn-libro-marino'); await p.click('#lib-pest-vivos'); await p.click('#cpv-menu-libros'); await p.waitForTimeout(600);
ok(await vistaVisible(), 'abre desde el menú de Libros (Modelos vivos)');
let t = await T();
ok(t.todo, `__cpvPruebas().todoCoincide (Mayéutica: ${t.mayeutica.tests} tests, la buena la más larga en ${t.mayeutica.correctaMasLarga}, posiciones ${t.mayeutica.posiciones})`);
ok(t.celdas.sao2 === '98' && t.celdas.cao2 === '20,0' && t.celdas.do2 === '985' && t.celdas.ven === '73', `tablero del sano: SaO₂ ${t.celdas.sao2}, CaO₂ ${t.celdas.cao2}, DO₂ ${t.celdas.do2}, SvO₂ ${t.celdas.ven}`);
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
await foto('01-primera');
ok(await desborde() <= 0, 'sin desborde en la primera pantalla');
ok(await p.evaluate(() => { const f = document.getElementById('cpv-frase').getBoundingClientRect(), d = document.getElementById('cpv-dock').getBoundingClientRect(); return f.top >= d.top && f.bottom <= innerHeight; }), 'la frase viva se ve, dentro del dock');

// 2. Desde el buscador
for (const q of ['capilar y oxígeno', 'extracción de oxígeno', 'pulsioxímetro', 'capnografía', 'lactato sepsis']) {
  await pulsar('#btn-buscar-global'); await p.fill('#search-input-el', q); await p.waitForTimeout(150);
  const n = await p.evaluate(() => [...document.querySelectorAll('.search-result-row')].findIndex(r => /Capilar y oxígeno/.test(r.textContent)));
  ok(n >= 0, `el buscador encuentra el capilar con «${q}»`);
  if (n >= 0) {
    await p.evaluate(i => document.querySelectorAll('.search-result-row')[i].click(), n); await p.waitForTimeout(250);
    ok(await vistaVisible(), `… y lo abre («${q}»)`);
  } else await pulsar('#search-close-btn');
}

// 3. Desde las 4 fichas del grupo oxígeno, cada botón en su estado
const desde = async (tab, estado, compr, nombre) => {
  await p.evaluate(tab => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'marinoFundamentos', panel: 'panel-marino-fund-tabs', tab }); document.body.append(t); t.click(); t.remove(); }, tab);
  await p.waitForTimeout(300);
  const sel = `#${tab} [data-capilar-vivo="${estado}"]`;
  ok(await p.evaluate(s => !!document.querySelector(s) && document.querySelector(s).offsetParent !== null, sel), `la ficha ${tab} tiene su botón visible (${estado})`);
  await p.locator(sel).scrollIntoViewIfNeeded(); await p.locator(sel).click(); await p.waitForTimeout(REDUCIDO ? 300 : 1200);
  const t = await T();
  ok(await vistaVisible() && compr(t), `desde ${tab}: abre en «${estado}»`);
  ok(await desborde() <= 0, `sin desborde (${estado})`);
  await foto('04-' + nombre);
};
await desde('mar-transporte-o2', 'anemia', t => t.estado.hb === 7.5 && t.celdas.cao2 === '10,1' && Math.abs(t.R.svo2 - 49) <= 1 && t.celdas.ven.startsWith(String(t.R.svo2)), 'anemia');
ok(await p.evaluate(() => document.querySelector('[data-cpv-tab="sangre"]').getAttribute('aria-selected') === 'true'), 'anemia: el dock abre en Sangre');
await desde('mar-extraccion-lactato', 'dependiente', t => t.estado.gc === 2 && t.R.do2 === 394 && t.R.vo2 === 201 && t.R.lact > 2, 'dependiente');
await desde('mar-extraccion-lactato', 'sepsis', t => t.estado.util === 'sepsis' && t.R.svo2 === 83 && t.lupa === 'mito', 'sepsis');
ok(await p.evaluate(() => document.querySelector('#cpv-c-ven .cpv-o').textContent === 'ilustr.'), 'sepsis: el chip de la SvO₂ dice «ilustr.»');
await desde('mar-oximetria', 'co', t => t.estado.co && t.R.spo2 === 98 && t.R.sao2 === 74 && t.lupa === 'dedo', 'co');
await desde('mar-oximetria', 'dual', t => t.estado.hb === 7.5 && t.R.dual === 50, 'dual');
await desde('mar-capnografia', 'capno-normal', t => t.lupa === 'boca' && t.R.petco2 === 38, 'capno-normal');
await desde('mar-capnografia', 'capno-rcp', t => t.estado.rcp && t.lupa === 'boca' && /^8\b/.test(t.celdas.petco2), 'capno-rcp');
const crudosExp = await p.evaluate(() => [...document.querySelectorAll('#cpv-raiz .cpv-org')].filter(e => e.offsetParent).map(e => e.textContent).filter(t => /\b(mar|mr|mc)-[a-z0-9-]+/.test(t)));
ok(!crudosExp.length, `chips de origen sin ids a la vista en Explorar ${crudosExp.slice(0, 3).join(' | ')}`);
ok(await p.evaluate(() => document.querySelectorAll('#cpv-raiz .cpv-org-ir').length > 5), 'los chips de origen llevan enlaces a su ficha');
ok(await p.evaluate(() => [...document.querySelectorAll('#cpv-raiz img')].filter(i => i.offsetParent).every(i => i.complete && i.naturalWidth > 0)), 'las láminas del libro visibles cargan');

// 4. Los mandos en sus extremos y su punto medio: cifras de un paciente posible
await p.evaluate(() => document.querySelector('[data-cpv-estado="anemia"]').click());
for (const [id, tab, vals] of [['hb', 'sangre', [5, 11, 17]], ['pao2', 'pulmon', [40, 70, 100]], ['gc', 'corazon', [1.5, 4.8, 8]]]) {
  await pulsar(`[data-cpv-tab="${tab}"]`);
  // los demás mandos, normales
  await p.evaluate(() => { const set = (s, v) => { const r = document.querySelector(s); r.value = v; r.dispatchEvent(new Event('input', { bubbles: true })); }; set('#cpv-m-hb', 15); set('#cpv-m-pao2', 90); set('#cpv-m-gc', 5); });
  for (const v of vals) {
    await deslizar(`#cpv-m-${id}`, v); await p.waitForTimeout(60);
    const { R, estado } = await T();
    const posible = R.svo2 >= 20 && R.svo2 <= 90 && R.do2 >= 190 && R.do2 <= 1900 && R.vo2 <= 250 && R.sao2 < 100 && R.sao2 >= 70 && R.cao2 > 5 && R.cao2 < 25 && R.lact < 15;
    ok(posible && estado[id] === v, `${id} ${v}: SaO₂ ${R.sao2} %, CaO₂ ${R.cao2.toFixed(1)}, DO₂ ${R.do2}, VO₂ ${R.vo2}, SvO₂ ${R.svo2} %, lactato ${R.lact}`);
    if (await desborde() > 0) ok(false, `desborde con ${id} ${v}`);
  }
}
await deslizar('#cpv-m-pao2', 40);
ok((await T()).R.sao2 === 73, 'PaO₂ 40: SaO₂ 73 % (Tabla 9.1), sin saturaciones del 100 %');
await foto('05-mandos');

// 5. Rendimiento (solo con movimiento): CPU ×4
if (!REDUCIDO) {
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.evaluate(() => { window.__cpvPruebas().vaciarFotogramas(); document.querySelector('[data-cpv-estado="sepsis"]').click(); });
  await p.waitForTimeout(3000);
  const f = (await T()).bucle.fotogramas;
  ok(f.n > 20 && f.medio < 20, `fotograma medio con CPU ×4: ${f.medio} ms (n=${f.n}, máx ${f.max})`);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await p.evaluate(() => document.querySelector('.btn-volver-libros-menu').click()); await p.waitForTimeout(400);
  ok(!(await T()).bucle.enMarcha, 'el bucle se para con la vista oculta');
  await pulsar('#cpv-menu-libros'); await p.waitForTimeout(300);
} else ok(!(await T()).bucle.enMarcha, 'con «reducir movimiento» no hay bucle: estado final');

// 6. Mayéutica entera fallando 4 (co-g1, co-g4 y co-e3; y el «tocar» de co-g2), con el repaso
await pulsar('#cpv-modo-preguntas'); await p.waitForTimeout(300);
ok(await p.evaluate(() => getComputedStyle(document.querySelector('.cpv-lead')).display === 'none'), 'la entradilla se oculta en la Mayéutica');
await pulsar('#cpv-preg [data-ir="recorrido"]');
const FALLAR = new Set(['co-g1', 'co-g4', 'co-e3']);
const FALLAR_TOCAR = 'co-g2';
let nDesbordeOk = 0;
const contestar = async (q, fallar, foto1, fallarTocar, donde = q.id) => {
  const pref = '#cpv-preg ';
  // antes de contestar: las cifras que se predicen salen tapadas
  const tap = (q.ocultar || q.tocar?.ocultar || []).filter(k => !['pista', 'svo2ap'].includes(k));
  if (tap.length) {
    const c = (await T()).celdas;
    const sinTapar = tap.filter(k => c[k] !== undefined && c[k] !== '?');
    if (sinTapar.length) ok(false, `${donde}: se ven antes de contestar ${sinTapar.join(', ')}`);
  }
  if (q.tipo === 'test') {
    await pulsar(pref + '[data-accion="ops"]');
    // data-op es la posición en pantalla: las opciones salen barajadas por el motor común (core/mayeutica-motor.js)
    const orden = barajar(q.opciones, q.id), buena = orden.findIndex(o => o.ok), mala = orden.findIndex(o => !o.ok);
    if (foto1) { await p.evaluate(() => document.getElementById('cpv-preg').scrollIntoView({ block: 'start' })); await foto(foto1 + '-antes'); }
    await pulsar(pref + `[data-op="${fallar ? mala : buena}"]`);
  } else if (q.tipo === 'destapa') {
    await pulsar(pref + '[data-accion="destapa"]');
    if (!fallar) await p.evaluate(() => document.querySelectorAll('#cpv-pts input').forEach(c => { c.checked = true; }));
    await pulsar(pref + '[data-accion="puntos"]');
  } else {
    if (!fallar) for (const [i, f] of q.frases.entries()) if (f.mal) await pulsar(pref + `[data-fr="${i}"]`);
    await pulsar(pref + '[data-accion="corregir"]');
  }
  if (q.tocar) {
    const tc = q.tocar;
    if (fallarTocar) {
      await pulsar(pref + '[data-accion="comprobar"]'); await pulsar(pref + '[data-accion="comprobar"]');
      ok(await p.evaluate(() => /cuenta como fallo/.test(document.getElementById('cpv-q-fin')?.textContent || '')), `${q.id}: el «tocar» fallado cuenta como fallo`);
      const sinc = await p.evaluate(() => { const r = document.querySelector('#cpv-mando input[data-mando]'); return r ? +r.value === window.__cpvPruebas().estado[r.dataset.mando] : true; });
      ok(sinc, `${q.id}: «Te lo pongo en el modelo» deja el mando de la pregunta igual que el modelo`);
    } else for (const m of tc.mandos) {
      if (['hb', 'pao2', 'gc'].includes(m)) { if (tc.bueno[m] !== undefined) await deslizar(pref + `[data-mando="${m}"]`, tc.bueno[m]); }
      else if (m === 'toma') await pulsar(pref + `[data-mando="toma"][data-v="${tc.bueno.toma}"]`);
      else if (m.startsWith('estado|')) await pulsar(pref + `[data-mando="estado"][data-v="${m.split('|')[1]}"]`);
    }
    if (!fallarTocar) {
      await pulsar(pref + '[data-accion="comprobar"]');
      ok(await p.evaluate(() => /Comprobado/.test(document.getElementById('cpv-q-fin')?.textContent || '')), `${q.id}: se comprueba en el modelo`);
    }
  }
  // tras contestar: sin desborde, nada tapado, sin «maqueta» y sin chips de origen con ids sueltos
  await p.waitForTimeout(REDUCIDO ? 30 : 250);
  const dsb = await desborde(); if (dsb > 0) ok(false, `desborde de ${dsb} px tras contestar ${donde}`); else nDesbordeOk++;
  const tr = await T();
  if (tr.ocultos.length) ok(false, `${donde}: siguen tapadas ${tr.ocultos.join(', ')} tras contestar`);
  const txt = await p.evaluate(() => document.getElementById('cpv-preg').textContent);
  if (/maqueta/i.test(txt)) ok(false, `${donde}: aparece «maqueta»`);
  const crudos = await p.evaluate(() => [...document.querySelectorAll('#cpv-preg .cpv-org')].map(e => e.textContent).filter(t => /\b(mar|mr|mc)-[a-z0-9-]+/.test(t)));
  if (crudos.length) ok(false, `${donde}: chips con ids: ${crudos.join(' | ')}`);
  if (!await p.evaluate(() => document.querySelectorAll('#cpv-preg .cpv-ir-texto').length > 0)) ok(false, `${donde}: sin «Ver en el texto» enlazado`);
  if (foto1) { await p.waitForTimeout(REDUCIDO ? 100 : 800); await p.evaluate(() => document.querySelector('#cpv-preg [data-accion="sig"]').scrollIntoView({ block: 'end' })); await foto(foto1 + '-despues'); }
  await pulsar(pref + '[data-accion="sig"]');
};
for (const [i, q] of PREGUNTAS.entries()) {
  const html = await p.evaluate(() => document.getElementById('cpv-preg').innerHTML);
  if (/data-correcta|data-mal|data-ok/.test(html)) ok(false, `${q.id}: la respuesta está escrita en el HTML`);
  await contestar(q, FALLAR.has(q.id), i === 1 ? '06-pregunta' : null, q.id === FALLAR_TOCAR);
  if (await desborde() > 0) ok(false, `desborde en la pregunta ${q.id}`);
}
t = await T();
ok(t.fase === 'repaso', `tras las ${PREGUNTAS.length}, pasa al repaso`);
ok(await p.evaluate(() => document.querySelectorAll('#cpv-preg [data-rep]').length) === 4, 'el repaso trae las 4 falladas (3 + el «tocar» fallado)');
await foto('07-repaso');
for (const id of ['co-g1', 'co-g2', 'co-g4', 'co-e3']) {
  await pulsar(`#cpv-preg [data-rep="${id}"]`);
  await contestar(PREGUNTAS.find(q => q.id === id), false, null, false, 'repaso ' + id);
}
ok(await p.evaluate(() => /No queda nada por repasar/.test(document.getElementById('cpv-preg').textContent)), 'el repaso se vacía al acertarlas');
t = await T();
ok(Object.keys(t.guardado).length === PREGUNTAS.length && Object.values(t.guardado).filter(g => g.resultado === 'mal').length === 4, `localStorage: ${PREGUNTAS.length} guardadas, 4 falladas`);

// 7. Los 4 casos hasta «Lo que te llevas» (fallando el primer paso de cada uno)
await pulsar('#cpv-preg [data-ir="casos"]');
for (const [k, C] of CASOS.entries()) {
  await pulsar(`#cpv-preg [data-caso="${k}"]`);
  for (const [j, paso] of C.pasos.entries()) {
    if (C.camas || paso.camas) {   // las dos camas a la vez: el modelo cambia de cama y el mini-tablero las compara
      const n = await p.evaluate(() => document.querySelectorAll('#cpv-preg [data-cama]').length);
      if (n !== 2 || !await p.evaluate(() => document.querySelectorAll('#cpv-camas-tabla td').length >= 8)) ok(false, `${C.id} paso ${j + 1}: faltan las dos camas`);
    }
    if (paso.calculadora && !await p.evaluate(() => !!document.querySelector('#cpv-preg [data-resaltar$="-calc"]'))) ok(false, `${C.id} paso ${j + 1}: sin el enlace a la calculadora`);
    await contestar({ ...paso.pregunta, ocultar: paso.ocultar }, j === 0, k === 0 && j === 4 ? '07-caso-giro' : null, false, `${C.id} paso ${j + 1}`);
  }
  ok(await p.evaluate(() => /Lo que te llevas/.test(document.getElementById('cpv-preg').textContent)), `el caso ${C.id} llega a «Lo que te llevas»`);
  ok(await p.evaluate(() => !!document.querySelector('#cpv-preg [data-tab][data-especialidad="libros"]')), `${C.id}: «Repasar en la ficha» enlaza con su ficha`);
  if (await desborde() > 0) ok(false, `desborde en «Lo que te llevas» del caso ${C.id}`);
  if (k === 0) {
    await p.evaluate(() => { const r = document.getElementById('cpv-preg').getBoundingClientRect(); const esc = document.getElementById('cpv-escena-bloque').getBoundingClientRect(); window.scrollBy(0, r.top - esc.height - 10); }); await p.waitForTimeout(200);
    await foto('08-fin-caso');
    await pulsar('#cpv-preg [data-fin="modelo"]'); await p.waitForTimeout(300);
    const v = await T();
    ok(v.modo === 'explorar' && v.estado.hb === 7.5, `volver del caso B2 al modelo: Explorar con Hb ${v.estado.hb}`);
    await pulsar('#cpv-modo-preguntas'); await pulsar('#cpv-preg [data-ir="casos"]');
  } else if (k < CASOS.length - 1) await pulsar('#cpv-preg [data-fin="otro"]');
}
const nRespuestas = PREGUNTAS.length + 4 + CASOS.reduce((a, c) => a + c.pasos.length, 0);
ok(nDesbordeOk >= nRespuestas, `sin desborde tras contestar en ${nDesbordeOk} de ${nRespuestas} respuestas y pasos`);

// 8. Lo guardado sigue al recargar
await p.reload(); await p.waitForFunction(() => window.__cpvPruebas);
await p.click('#btn-libros'); await p.click('#btn-libro-marino'); await p.click('#lib-pest-vivos'); await p.click('#cpv-menu-libros'); await p.waitForTimeout(300);
await pulsar('#cpv-modo-preguntas'); await p.waitForTimeout(200);
ok(await p.evaluate(n => new RegExp(`Seguir \\(${n} de ${n}\\)`).test(document.getElementById('cpv-preg').textContent), PREGUNTAS.length), `tras recargar, la Mayéutica recuerda las ${PREGUNTAS.length}`);
// Conceptos: todos, tocando cada acción
await pulsar('#cpv-modo-conceptos');
for (let i = 0; i < CONCEPTOS.length; i++) {
  await p.evaluate(() => document.querySelectorAll('#cpv-concepto [data-acc]').forEach(b => b.click())); await p.waitForTimeout(REDUCIDO ? 50 : 200);
  if (await desborde() > 0) ok(false, `desborde en el concepto ${i + 1}`);
  if (i === 5) { await p.evaluate(() => window.scrollTo(0, 0)); await foto('09-concepto-lactato'); }
  if (i < CONCEPTOS.length - 1) await pulsar('#cpv-concepto [data-nav="1"]');
}
ok(await desborde() <= 0, `sin desborde en los ${CONCEPTOS.length} conceptos`);
await pulsar('#cpv-modo-explorar');
// Las tres lupas abren y cierran sin desbordar
for (const l of ['dedo', 'mito', 'boca']) {
  await pulsar(`[data-cpv-lupa="${l}"]`); await p.waitForTimeout(REDUCIDO ? 50 : 400);
  ok((await T()).lupa === l && await desborde() <= 0, `la lupa «${l}» abre sin desbordar`);
}
await pulsar('#cpv-lupa-cerrar');
ok(errores.length === 0, `0 errores de consola (${errores.length}) ${errores.slice(0, 3).join(' | ')}`);
const ids = await p.evaluate(() => { const v = {}; document.querySelectorAll('[id]').forEach(e => { v[e.id] = (v[e.id] || 0) + 1; }); return Object.keys(v).filter(k => v[k] > 1); });
ok(ids.length === 0, 'sin ids repetidos ' + ids.join(','));

// 9. «← VOLVER» desde una ficha: vuelve a la ficha, abierta
const abrirFicha = tab => p.evaluate(tab => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'marinoFundamentos', panel: 'panel-marino-fund-tabs', tab }); document.body.append(t); t.click(); t.remove(); }, tab);
const fichaAbierta = tab => p.evaluate(t => { const e = document.getElementById(t); return e.classList.contains('active') && !!e.offsetParent; }, tab);
for (const tab of ['mar-transporte-o2', 'mar-capnografia']) {
  await abrirFicha(tab); await p.waitForTimeout(800);
  await pulsar(`#${tab} [data-capilar-vivo]`); await p.waitForTimeout(REDUCIDO ? 400 : 1200);
  const txtVolver = await p.evaluate(() => document.getElementById('cpv-volver').textContent);
  await pulsar('#cpv-volver'); await p.waitForTimeout(1000);
  ok(await fichaAbierta(tab) && /FICHA/.test(txtVolver), `«${txtVolver}» desde ${tab} vuelve a la ficha, abierta y visible`);
}
// Desde el menú, el «← VOLVER» vuelve a ser el de siempre
await p.evaluate(() => document.querySelector('.btn-volver-libros-menu').click()); await p.waitForTimeout(200);
await p.evaluate(() => { document.getElementById('cpv-menu-libros').click(); }); await p.waitForTimeout(300);
ok(await p.evaluate(() => document.getElementById('cpv-volver').textContent === '← VOLVER'), 'desde el menú, «← VOLVER» lleva al menú');
// «Ver en el texto» desde el modelo lleva a la ficha
await pulsar('#cpv-modo-conceptos'); await p.waitForTimeout(200);
await pulsar('#cpv-concepto .cpv-ir-texto'); await p.waitForTimeout(800);
ok(await p.evaluate(() => [...document.querySelectorAll('#marino-fund-view .tab-content.active')].some(e => e.offsetParent)), '«Ver en el texto» abre la ficha');
ok(errores.length === 0, `0 errores de consola al final (${errores.length}) ${errores.slice(0, 3).join(' | ')}`);
await ctx.close();
fallosTotales.push(...fallos.map(f => `${tag}: ${f}`));
}

try {
  await correr(390, false);
  await correr(360, true);
} catch (e) { fallosTotales.push('la prueba se cortó: ' + e.message); console.log('❌ ' + e.message); }
await b.close();
console.log(fallosTotales.length ? `\n❌ ${fallosTotales.length} fallo(s)` : '\n✅ capilar y oxígeno: todo bien');
process.exit(fallosTotales.length ? 1 : 0);
