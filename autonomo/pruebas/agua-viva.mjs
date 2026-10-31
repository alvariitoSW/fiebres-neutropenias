// Prueba de navegador del río y mar (juez de autonomo/jueces.mjs --modelo agua-viva).
// Uso: node autonomo/pruebas/agua-viva.mjs <url-base> [--capturas <carpeta>]
// Recorre, a 390 px (con movimiento y su medida de rendimiento) y a 360 px (con «reducir movimiento»), cada uno en un
// contexto limpio: accesos (menús, buscador, 10 fichas con su estado), la Mayéutica entera fallando 4 con su repaso,
// los 3 casos hasta «Lo que te llevas», lo guardado tras recargar, Conceptos y el «← VOLVER» a la ficha. Mide el
// desborde lateral (0 px) tras cada respuesta, el repaso y cada paso de los casos, y los errores de consola.
// Y la explicación guiada de los estados (guias-comun.mjs): dos enteras, paso a paso, y cada cita a un párrafo que existe.
// Sale con código 1 si algo falla.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const { GUIAS, PREGUNTAS, CASOS } = await import(new URL('../../js/data/agua-viva-data.js', import.meta.url));
const { probarGuias } = await import(new URL('./guias-comun.mjs', import.meta.url));
const { barajar } = await import(new URL('../../js/core/mayeutica-motor.js', import.meta.url));
const { MAYEUTICA_B1 } = await import(new URL('../../js/data/mayeutica/b1.js', import.meta.url));
const { MAYEUTICA_B3 } = await import(new URL('../../js/data/mayeutica/b3.js', import.meta.url));
const BANCO = { ...MAYEUTICA_B1, ...MAYEUTICA_B3 };
const preguntaDe = id => Object.values(BANCO).flatMap(f => [...(f.guia || []), ...(f.examen || [])]).find(q => q.id === id);
const sinHtml = h => h.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
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
const T = () => p.evaluate(() => { const t = window.__agvPruebas(); return { estado: t.estado, modo: t.modo, fase: t.fase, todo: t.todoCoincide, bucle: t.bucle, guardado: t.guardado }; });
const foto = n => CAPTURAS ? p.screenshot({ path: CAPTURAS + 'agv-' + n + '-' + tag + '.png' }) : null;
const vistaVisible = () => p.evaluate(() => { const v = document.getElementById('agua-viva-view'); return v.style.display === 'block' && v.offsetParent !== null && document.getElementById('libros-view').style.display === 'block'; });

await p.goto(BASE + 'index.html');   // contexto nuevo: localStorage vacío
await p.waitForFunction(() => window.__agvPruebas);

// 1. Desde el menú de Marino (Libros)
await p.click('#btn-libros'); await p.click('#btn-libro-marino'); await p.click('#lib-pest-vivos'); await p.click('#agv-menu-libros'); await p.waitForTimeout(600);
ok(await vistaVisible(), 'abre desde el menú de Libros');
ok((await T()).todo, '__agvPruebas().todoCoincide');
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
await foto('01-primera');
ok(await desborde() <= 0, 'sin desborde en la primera pantalla');

// 2. Desde Nefrología
await p.evaluate(() => document.querySelector('.btn-volver-libros-menu').click());
await p.evaluate(() => { document.querySelectorAll('.btn-volver-especialidades')[0].click(); });
await pulsar('#btn-pif'); await pulsar('#btn-nefrologia'); await p.waitForTimeout(300);
await p.locator('#agv-menu-nefro').scrollIntoViewIfNeeded(); await foto('02-menu-nefro');
await p.click('#agv-menu-nefro'); await p.waitForTimeout(400);
ok(await vistaVisible(), 'abre desde el menú de Nefrología');

// 3. Desde el buscador
for (const q of ['río y mar', 'sueros', 'cristaloides', 'reparto de fluidos', 'hemorragia', 'hiponatremia', 'salino hipertónico', 'osmolalidad']) {
  await pulsar('#btn-buscar-global'); await p.fill('#search-input-el', q); await p.waitForTimeout(150);
  const n = await p.evaluate(() => [...document.querySelectorAll('.search-result-row')].findIndex(r => /Río y mar/.test(r.textContent)));
  ok(n >= 0, `el buscador encuentra el río y mar con «${q}»`);
  if (n >= 0) {
    await p.evaluate(i => document.querySelectorAll('.search-result-row')[i].click(), n); await p.waitForTimeout(250);
    ok(await vistaVisible(), `… y lo abre («${q}»)`);
  } else await pulsar('#search-close-btn');
}
await pulsar('#btn-buscar-global'); await p.fill('#search-input-el', 'río y mar'); await p.waitForTimeout(150);
await foto('03-buscador'); await pulsar('#search-close-btn');

// 4. Desde 3 fichas, cada una en su estado
const desde = async (esp, view, panel, tab, estado, compr, nombre) => {
  await p.evaluate(([esp, view, panel, tab]) => { const t = document.createElement('button'); t.dataset.especialidad = esp; t.dataset.view = view; t.dataset.panel = panel; t.dataset.tab = tab; document.body.append(t); t.click(); t.remove(); }, [esp, view, panel, tab]);
  await p.waitForTimeout(300);
  const sel = `#${tab} [data-agua-viva="${estado}"]`;
  ok(await p.evaluate(s => !!document.querySelector(s) && document.querySelector(s).offsetParent !== null, sel), `la ficha ${tab} tiene su botón visible (${estado})`);
  await p.locator(sel).scrollIntoViewIfNeeded(); await p.locator(sel).click(); await p.waitForTimeout(REDUCIDO ? 300 : 2500);
  const t = await T();
  ok(await vistaVisible() && compr(t.estado), `desde ${tab}: abre en «${estado}»`);
  ok(await desborde() <= 0, `sin desborde (${estado})`);
  await foto('04-' + nombre);
};
await desde('libros', 'marinoFundamentos', 'panel-marino-fund-tabs', 'mar-cristaloides', 'salino', e => e.infusiones.length === 1 && e.infusiones[0].f === 'salino' && e.infusiones[0].ml === 1000, 'salino');
await desde('cardiologia', 'merinoCardiologia', 'panel-merino-cardio-tabs', 'mc-hemorragico-clasificacion', 'hemorragia', e => e.hemorragia === 20 && e.reloj === '1h', 'hemorragia');
await desde('libros', 'marinoRenal', 'panel-marino-renal-tabs', 'mr-hipernatremia', 'hipernatremia', e => e.na0 === 160 && e.reloj === 'dias', 'hipernatremia');
ok(await p.evaluate(() => !document.getElementById('agv-lupa').hidden), 'la hipernatremia abre la lupa de la neurona');
await desde('libros', 'marinoRenal', 'panel-marino-renal-tabs', 'mr-hiponatremia-dx', 'hiperglucemia', e => e.glucosa === 600, 'hiperglucemia');
await desde('libros', 'marinoRenal', 'panel-marino-renal-tabs', 'mr-hiponatremia-tto', 'hiponatremia', e => e.na0 === 122 && e.adh, 'hiponatremia');
ok(await p.evaluate(() => /^↑ sin cifra$/.test(document.getElementById('agv-dl-mar').textContent)), `mareógrafo del mar: «${await p.evaluate(() => document.getElementById('agv-dl-mar').textContent)}»`);
await desde('cardiologia', 'merinoCardiologia', 'panel-merino-cardio-tabs', 'mc-hemorragico-fluidos', 'reanimacion', e => e.hemorragia === 20 && e.infusiones[0]?.ml === 1800, 'reanimacion');
await desde('nefrologia', 'nefrona', 'panel-fisio-tabs', 'fisio-agua-regulacion', 'inicio', e => !e.infusiones.length && e.na0 === 140, 'nefro-agua');
await desde('nefrologia', 'nefrona', 'panel-fisio-tabs', 'fisio-hiponatremia', 'hiponatremia', e => e.na0 === 122, 'nefro-hipona');
await desde('nefrologia', 'nefrona', 'panel-fisio-tabs', 'fisio-hipernatremia', 'hipernatremia', e => e.na0 === 160, 'nefro-hiperna');
// chips de origen: enlaces con el título de la ficha, sin ids a la vista
const crudosExp = await p.evaluate(() => [...document.querySelectorAll('#agv-raiz .agv-org, #agv-raiz .agv-o')].filter(e => e.offsetParent).map(e => e.textContent).filter(t => /\b(mar|mr|mc)-[a-z0-9-]+/.test(t)));
ok(!crudosExp.length, `chips de origen sin ids a la vista en Explorar ${crudosExp.slice(0, 3).join(' | ')}`);
ok(await p.evaluate(() => document.querySelectorAll('#agv-raiz .agv-org-ir').length > 3), 'los chips de origen llevan enlaces a su ficha');
await p.evaluate(() => document.getElementById('agv-escena').scrollIntoView({ block: 'start' })); await p.waitForTimeout(200);
await foto('05-lupa-neurona');

// 5. Rendimiento (solo con movimiento): CPU ×4, salino en marcha
if (!REDUCIDO) {
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await pulsar('#agv-lupa-cerrar');
  await p.evaluate(() => { window.__agvPruebas().vaciarFotogramas(); document.querySelector('#agv-btn-infundir').click(); });
  await p.waitForTimeout(3000);
  const f = (await T()).bucle.fotogramas;
  ok(f.n > 20 && f.medio < 20, `fotograma medio con CPU ×4: ${f.medio} ms (n=${f.n}, máx ${f.max})`);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await p.waitForTimeout(9000);
  ok(!(await T()).bucle.enMarcha, 'el bucle se para cuando nada se mueve');
  await p.evaluate(() => document.querySelector('.btn-volver-libros-menu').click()); await p.waitForTimeout(400);
  ok(!(await T()).bucle.enMarcha, 'el bucle se para con la vista oculta');
  await pulsar('#agv-menu-libros'); await p.waitForTimeout(300);
}

// 6. Mayéutica entera fallando 3 (1, 5 y 11 del recorrido), con el repaso
await pulsar('#agv-modo-preguntas'); await p.waitForTimeout(300);
await pulsar('#agv-preg [data-ir="recorrido"]');
const FALLAR = new Set(['ag-01', 'ag-04', 'ag-10']); let nDesbordeOk = 0;
const FALLAR_TOCAR = 'ag-05';
const contestar = async (q, fallar, foto1, fallarTocar, donde = q.id) => {
  const pref = '#agv-preg ';
  if (q.tipo === 'test') {
    if (!q.sinPensar) await pulsar(pref + '[data-accion="ops"]');   // con `sinPensar` las opciones ya están a la vista
    // data-op es la posición en pantalla: las opciones salen barajadas por el motor común (core/mayeutica-motor.js)
    const orden = barajar(q.opciones, q.id), buena = orden.findIndex(o => o.ok), mala = orden.findIndex(o => !o.ok);
    if (foto1) { await p.evaluate(() => document.getElementById('agv-preg').scrollIntoView({ block: 'start' })); await foto(foto1 + '-antes'); }
    await pulsar(pref + `[data-op="${fallar ? mala : buena}"]`);
  } else if (q.tipo === 'destapa') {
    await pulsar(pref + '[data-accion="destapa"]');
    if (!fallar) await p.evaluate(() => document.querySelectorAll('#agv-pts input').forEach(c => { c.checked = true; }));
    await pulsar(pref + '[data-accion="puntos"]');
  } else {
    if (!fallar) for (const [i, f] of q.frases.entries()) if (f.mal) await pulsar(pref + `[data-fr="${i}"]`);
    await pulsar(pref + '[data-accion="corregir"]');
  }
  if (q.tocar) {
    const tc = q.tocar;
    // compruébalo en el modelo: el mando que pide la pregunta
    if (fallarTocar) {
      await pulsar(pref + '[data-accion="comprobar"]'); await pulsar(pref + '[data-accion="comprobar"]');
      ok(await p.evaluate(() => /cuenta como fallo/.test(document.getElementById('agv-q-fin')?.textContent || '')), `${q.id}: el «tocar» fallado cuenta como fallo`);
    } else for (const m of tc.mandos) {
      if (m === 'compartimento') await pulsar(pref + `[data-mando="tocado"][data-v="${tc.bueno.tocado}"]`);
      else if (m.startsWith('infundir:')) await pulsar(pref + '[data-mando="infundir"]');
      else if (m === 'hemorragia') await p.evaluate(v => { const r = document.querySelector('#agv-preg [data-mando="hemorragia"]'); r.value = v; r.dispatchEvent(new Event('input', { bubbles: true })); }, tc.bueno.hemorragia);
      else if (m === 'reloj') await pulsar(pref + `[data-mando="reloj"][data-v="${tc.bueno.reloj}"]`);
      else if (m === 'glucosa') await p.evaluate(v => { const r = document.querySelector('#agv-preg [data-mando="glucosa"]'); r.value = v; r.dispatchEvent(new Event('input', { bubbles: true })); }, tc.bueno.glucosa);
    }
    if (!fallarTocar) {
      await pulsar(pref + '[data-accion="comprobar"]');
      ok(await p.evaluate(() => /Comprobado/.test(document.getElementById('agv-q-fin')?.textContent || '')), `${q.id}: se comprueba en el modelo`);
    }
  }
  // tras contestar: sin desborde, sin «maqueta» y sin chips de origen con ids sueltos
  await p.waitForTimeout(REDUCIDO ? 30 : 250);
  const dsb = await desborde(); if (dsb > 0) ok(false, `desborde de ${dsb} px tras contestar ${donde}`); else nDesbordeOk++;
  const txt = await p.evaluate(() => document.getElementById('agv-preg').textContent);
  if (/maqueta/i.test(txt)) ok(false, `${donde}: aparece «maqueta»`);
  const crudos = await p.evaluate(() => [...document.querySelectorAll('#agv-preg .agv-org')].map(e => e.textContent).filter(t => /\b(mar|mr|mc)-[a-z0-9-]+/.test(t)));
  if (crudos.length) ok(false, `${donde}: chips con ids: ${crudos.join(' | ')}`);
  if (foto1) { await p.waitForTimeout(REDUCIDO ? 100 : 1200); await p.evaluate(() => document.querySelector('#agv-preg [data-accion="sig"]').scrollIntoView({ block: 'end' })); await foto(foto1 + '-despues'); }
  await pulsar(pref + '[data-accion="sig"]');
};
for (const [i, q] of PREGUNTAS.entries()) {
  const html = await p.evaluate(() => document.getElementById('agv-preg').innerHTML);
  if (/data-correcta|data-mal/.test(html)) ok(false, `${q.id}: hay data-correcta/data-mal en el HTML`);
  if (i === 0) ok(await p.evaluate(() => getComputedStyle(document.querySelector('.agv-lead')).display === 'none'), 'la entradilla se oculta en la Mayéutica');
  await contestar(q, FALLAR.has(q.id), i === 1 ? '06-pregunta' : null, q.id === FALLAR_TOCAR);
  if (await desborde() > 0) ok(false, `desborde en la pregunta ${q.id}`);
}
let t = await T();
ok(t.fase === 'repaso', 'tras las 14, pasa al repaso');
ok(await p.evaluate(() => document.querySelectorAll('#agv-preg [data-rep]').length) === 4, 'el repaso trae las 4 falladas (3 + el «tocar» fallado)');
await foto('07-repaso');
for (const id of ['ag-01', 'ag-04', 'ag-05', 'ag-10']) {
  await pulsar(`#agv-preg [data-rep="${id}"]`);
  await contestar(PREGUNTAS.find(q => q.id === id), false);
}
ok(await p.evaluate(() => /No queda nada por repasar/.test(document.getElementById('agv-preg').textContent)), 'el repaso se vacía al acertarlas');
t = await T();
ok(Object.keys(t.guardado).length === 14 && Object.values(t.guardado).filter(g => g.resultado === 'mal').length === 4, 'localStorage: 14 guardadas, 4 falladas');

// 7. Un caso hasta «Lo que te llevas» (el 3, Elena)
await pulsar('#agv-preg [data-ir="casos"]');
for (const k of [0, 1, 2]) {
  await pulsar(`#agv-preg [data-caso="${k}"]`);
  for (const [j, paso] of CASOS[k].pasos.entries()) await contestar(paso.pregunta, j === 0, null, false, `caso ${k + 1} paso ${j + 1}`);
  ok(await p.evaluate(() => /Lo que te llevas/.test(document.getElementById('agv-preg').textContent)), `el caso ${k + 1} llega a «Lo que te llevas»`);
  if (await desborde() > 0) ok(false, `desborde en «Lo que te llevas» del caso ${k + 1}`);
  if (k === 0) {   // volver al modelo: el dock en el estado del paciente
    await pulsar('#agv-preg [data-fin="modelo"]'); await p.waitForTimeout(300);
    const dock = await p.evaluate(() => ({ tab: document.querySelector('.agv-dock-tabs [aria-selected="true"]').dataset.agvTab, hem: document.getElementById('agv-m-hemorragia').value, panel: !document.querySelector('[data-agv-panel="sangrado"]').hidden }));
    ok(dock.tab === 'sangrado' && dock.hem === '35' && dock.panel, `volver del caso 1 al modelo: dock en Sangrado 35 % (${JSON.stringify(dock)})`);
    await foto('11-vuelta-caso1');
    await pulsar('#agv-modo-preguntas'); await pulsar('#agv-preg [data-ir="casos"]');
  } else if (k < 2) await pulsar('#agv-preg [data-fin="otro"]');
}

// 7b. Teresa (caso 4): equivocarse sin guía. Primero eligiendo bien; luego el salino (la consecuencia sale ANTES de la explicación)
await pulsar('#agv-preg [data-fin="otro"]');
const TER = CASOS[3];
ok(TER.id === 'w-4' && TER.pasos.length === 6, 'el caso 4 (Teresa) está en la lista, con 6 pasos');
const ver = async (txt) => ok(await desborde() <= 0, `sin desborde: ${txt}`);
// (a) todo bien
await pulsar('#agv-preg [data-caso="3"]');
for (const [j, paso] of TER.pasos.entries()) {
  await contestar(paso.pregunta, false, null, false, `Teresa buena, paso ${j + 1}`);
  if (j === 2) {
    const e = (await T()).estado;
    ok(!(await p.evaluate(() => /Se le pusieron los 1,3 L/.test(document.getElementById('agv-preg').textContent))), 'Teresa buena: el paso 4 no lleva la línea del salino');
    ok(e.infusiones.length === 1 && e.infusiones[0].f === 'ringer' && e.infusiones[0].ml === 1300, `Teresa buena: el estuario sigue sobre 1,3 L de Ringer (${JSON.stringify(e.infusiones)})`);
  }
}
ok(await p.evaluate(() => document.querySelectorAll('#agv-preg [data-objetivo][data-cumplido="true"]').length) === 3, 'Teresa buena: los 3 objetivos cumplidos');
await ver('Lo que te llevas de Teresa (bien)');
// (b) el salino
await pulsar('#agv-preg [data-fin="otro"]'); await pulsar('#agv-preg [data-caso="3"]');
for (const j of [0, 1]) await contestar(TER.pasos[j].pregunta, false, null, false, `Teresa salino, paso ${j + 1}`);
{
  const q = TER.pasos[2].pregunta;
  const antes = await p.evaluate(() => document.getElementById('agv-preg').textContent);
  ok(/Decide tú, sin pistas/.test(antes) && !/Tabla 15\.4/.test(antes.split('Decide tú')[1] || ''), 'P3: el enunciado no da pistas');
  // `sinPensar`: sin la compuerta «Piénsalo antes»; las opciones ya están ahí (las demás preguntas, con compuerta, siguen igual: ver el resto de la prueba)
  ok(q.sinPensar === true && await p.evaluate(() => !document.querySelector('#agv-preg [data-accion="ops"]') && document.querySelectorAll('#agv-preg [data-op]').length >= 3 && !/Piénsalo antes/.test(document.getElementById('agv-preg').textContent)), 'P3 con sinPensar: opciones a la vista, sin «Piénsalo antes»');
  const orden = barajar(q.opciones, q.id);
  await pulsar(`#agv-preg [data-op="${orden.findIndex(o => o.consecuencia)}"]`); await p.waitForTimeout(REDUCIDO ? 30 : 300);
  const o = await p.evaluate(() => {
    const r = document.querySelector('#agv-preg .agv-respuesta'), c = r.querySelector('.agv-consecuencia'), ps = [...r.querySelectorAll(':scope > p')];
    const expl = ps.find(x => /Tabla 15\.4: 432/.test(x.textContent));
    return { hayCaja: !!c, texto: c?.textContent || '', antes: !!c && !!expl && !!(c.compareDocumentPosition(expl) & Node.DOCUMENT_POSITION_FOLLOWING), enlace: !!c?.querySelector('[data-resaltar], [data-tab]'), est: window.__agvPruebas().estado.infusiones };
  });
  ok(o.hayCaja && o.antes, 'P3: la caja «Lo que acaba de pasar» sale antes de la explicación');
  ok(/360/.test(o.texto) && /1\.070/.test(o.texto) && /hiperclorémica/.test(o.texto), 'P3: la consecuencia dice 360, 1.070 e hiperclorémica');
  ok(o.enlace, 'P3: la consecuencia lleva su «Ver en el texto»');
  ok(o.est.length === 1 && o.est[0].f === 'salino' && o.est[0].ml === 1300, 'P3: el estuario pasa a 1,3 L de salino');
  await ver('P3 con la consecuencia'); await p.waitForTimeout(REDUCIDO ? 100 : 2500); await p.evaluate(() => document.getElementById('agv-preg').scrollIntoView({ block: 'start' })); await foto('12-teresa-p3');
  await pulsar('#agv-preg [data-accion="sig"]');
}
ok(await p.evaluate(() => /Se le pusieron los 1,3 L de salino/.test(document.getElementById('agv-preg').textContent)), 'P4: la historia sigue sobre el salino (tras)');
{
  const e = (await T()).estado;
  ok(e.infusiones[0]?.f === 'salino' && e.hemorragia === 20, 'P4: el estuario sigue en el salino');
  await ver('P4 (el giro)'); await foto('13-teresa-p4');
}
for (const j of [3, 4, 5]) await contestar(TER.pasos[j].pregunta, false, null, false, `Teresa salino, paso ${j + 1}`);
ok(await p.evaluate(() => { const o = document.querySelector('#agv-preg [data-objetivo="fluido"]'); return o && o.dataset.cumplido === 'false' && /Lo que pasó/.test(o.textContent); }), 'el objetivo del fluido falla y recuerda lo que pasó');
await ver('Lo que te llevas de Teresa (salino)'); await foto('14-teresa-lleva');

ok(nDesbordeOk >= 34, `sin desborde tras contestar en ${nDesbordeOk} respuestas y pasos`);
await p.evaluate(() => { const r = document.getElementById('agv-preg').getBoundingClientRect(); const esc = document.getElementById('agv-escena-bloque').getBoundingClientRect(); window.scrollBy(0, r.top - esc.height - 10); }); await p.waitForTimeout(200);
await foto('08-fin-caso');
ok(await desborde() <= 0, 'sin desborde al final del caso');

// 8. Lo guardado sigue al recargar
await p.reload(); await p.waitForFunction(() => window.__agvPruebas);
await p.click('#btn-libros'); await p.click('#btn-libro-marino'); await p.click('#lib-pest-vivos'); await p.click('#agv-menu-libros'); await p.waitForTimeout(300);
await pulsar('#agv-modo-preguntas'); await p.waitForTimeout(200);
ok(await p.evaluate(() => /Seguir el recorrido \(14 de 14\)/.test(document.getElementById('agv-preg').textContent)), 'tras recargar, el recorrido recuerda las 14');
await p.evaluate(() => window.scrollTo(0, 0));
await foto('09-mayeutica-recargada');

// 8b. Al abrir la Mayéutica: el repaso «de días atrás» (fichas de conceptos parecidos, 'mayeutica-fichas-v1')
{
  const sembrar = reg => p.evaluate(r => {
    const f = n => { const d = new Date(); d.setDate(d.getDate() - n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    const g = {};
    for (const [id, n, a, fa] of r) g[id] = { aciertos: a, fallos: fa, ultimo: f(n), resultado: fa ? 'mal' : 'on', repasar: !!fa, faltan: [], dias: a ? 1 : 0, diaOk: a ? f(n) : undefined };
    localStorage.setItem('mayeutica-fichas-v1', JSON.stringify(g));
  }, reg);
  const hoyPag = () => p.evaluate(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; });
  const abrirMayeutica = async () => {
    await p.reload(); await p.waitForFunction(() => window.__agvPruebas);
    await p.click('#btn-libros'); await p.click('#btn-libro-marino'); await p.click('#lib-pest-vivos'); await p.click('#agv-menu-libros'); await p.waitForTimeout(300);
    await pulsar('#agv-modo-preguntas'); await p.waitForTimeout(250);
  };
  // (c) registro vacío: directo al inicio, sin pantalla vacía
  await p.evaluate(() => localStorage.removeItem('mayeutica-fichas-v1'));
  await abrirMayeutica();
  ok(await p.evaluate(() => !!document.querySelector('#agv-preg [data-ir="recorrido"]') && !/días atrás/.test(document.getElementById('agv-preg').textContent)), 'días atrás: registro vacío, entra directo al inicio');
  // (b) rv-g5 (hace 3 días, fallada) y rv-g7 (hace 2): misma ficha; hcl-e6 (hace 1, fallada); rf-g5 (acertada hace 8, tocaba a los 7);
  //     col-g4 (acertada hace 1, intervalo 3: no toca)
  await sembrar([['rv-g5', 3, 0, 1], ['rv-g7', 2, 0, 1], ['hcl-e6', 1, 0, 1], ['rf-g5', 8, 2, 0], ['col-g4', 1, 1, 0]]);
  await abrirMayeutica();
  await p.evaluate(() => document.getElementById('agv-preg').scrollIntoView({ block: 'start' })); await p.waitForTimeout(300); await foto('15-dias-atras');
  const ESPERADAS = ['rv-g5', 'hcl-e6', 'rv-g7', 'rf-g5'];   // fallada más antigua primero, sin dos seguidas de la misma ficha, luego la acertada
  const CHIPS = ['Fallada hace 3 días', 'Fallada hace 1 día', 'Fallada hace 2 días', 'Acertada hace 8 días'];
  for (const [i, id] of ESPERADAS.entries()) {
    const v = await p.evaluate(() => ({ t: document.getElementById('agv-preg').textContent, chip: document.querySelector('#agv-preg .agv-chip')?.textContent || '' }));
    const q = preguntaDe(id);
    ok(v.t.includes(`${i + 1} de ${ESPERADAS.length}`), `días atrás ${i + 1}: contador «${i + 1} de ${ESPERADAS.length}»`);
    ok(v.t.includes(sinHtml(q.enunciado).slice(0, 40)), `días atrás ${i + 1}: sale ${id}`);
    ok(v.chip.startsWith(CHIPS[i]), `días atrás ${i + 1}: chip «${v.chip}»`);
    ok(!/Larsen/.test(v.t) || i === 0, 'días atrás: la nota del estudio solo sale en la primera');
    ok(await desborde() <= 0, `sin desborde: días atrás ${i + 1}`);
    await contestar(q, false, null, false, `días atrás ${id}`);
    if (i === 0) {   // «Ver en el texto» de una pregunta de ficha lleva a SU ficha
      const g = await p.evaluate(() => JSON.parse(localStorage.getItem('mayeutica-fichas-v1')));
      ok(g['rv-g5'].ultimo === (g['rv-g5'].diaOk), 'días atrás: al contestar se reescribe «ultimo» (= hoy)');
    }
  }
  ok(await p.evaluate(() => /Repaso hecho/.test(document.getElementById('agv-preg').textContent)), 'días atrás: «Repaso hecho»');
  await pulsar('#agv-preg [data-accion="fin-dias"]'); await p.waitForTimeout(200);
  ok(await p.evaluate(() => !!document.querySelector('#agv-preg [data-ir="recorrido"]')), 'días atrás: «Seguir» lleva al inicio de la Mayéutica');
  const hoy = await hoyPag();
  const g = await p.evaluate(() => JSON.parse(localStorage.getItem('mayeutica-fichas-v1')));
  ok(ESPERADAS.every(id => g[id].ultimo === hoy && g[id].repasar === false), 'días atrás: lo acertado queda con «ultimo» = hoy y fuera del repaso de su ficha');
  ok(g['hcl-e6'].resultado === 'mal' && g['col-g4'].ultimo !== hoy, 'días atrás: no pisa el «resultado» de la ficha ni toca lo que no tocaba');
  // dos veces en la sesión: la segunda, directo al inicio
  await pulsar('#agv-modo-explorar'); await pulsar('#agv-modo-preguntas'); await p.waitForTimeout(200);
  ok(await p.evaluate(() => !!document.querySelector('#agv-preg [data-ir="recorrido"]')), 'días atrás: no se repite en la misma sesión');
}
// Conceptos: los 8, sin errores
await pulsar('#agv-modo-conceptos');
for (let i = 0; i < 8; i++) { await p.evaluate(() => document.querySelectorAll('#agv-concepto [data-acc]').forEach(b => b.click())); await p.waitForTimeout(REDUCIDO ? 50 : 300); if (i < 7) await pulsar('#agv-concepto [data-nav="1"]'); }
ok(await desborde() <= 0, 'sin desborde en Conceptos');
// Menú de Libros con el botón
await pulsar('#agv-modo-explorar');
await p.evaluate(() => document.querySelector('.btn-volver-libros-menu').click()); await p.waitForTimeout(200);
await p.locator('#agv-menu-libros').scrollIntoViewIfNeeded(); await foto('10-menu-libros');

ok(errores.length === 0, `0 errores de consola (${errores.length}) ${errores.slice(0, 3).join(' | ')}`);
const ids = await p.evaluate(() => { const v = {}; document.querySelectorAll('[id]').forEach(e => { v[e.id] = (v[e.id] || 0) + 1; }); return Object.keys(v).filter(k => v[k] > 1); });
ok(ids.length === 0, 'sin ids repetidos ' + ids.join(','));

// 9. «← VOLVER» desde una ficha: vuelve a la ficha, abierta (mr-hipernatremia, que enlaza con el río y mar)
const abrirFicha = (esp, view, panel, tab) => p.evaluate(([esp, view, panel, tab]) => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: esp, view, panel, tab }); document.body.append(t); t.click(); t.remove(); }, [esp, view, panel, tab]);
const fichaAbierta = tab => p.evaluate(t => { const e = document.getElementById(t); return e.classList.contains('active') && !!e.offsetParent; }, tab);
await abrirFicha('libros', 'marinoRenal', 'panel-marino-renal-tabs', 'mr-hipernatremia'); await p.waitForTimeout(800);
await pulsar('#mr-hipernatremia [data-agua-viva]'); await p.waitForTimeout(REDUCIDO ? 400 : 1500);
const txtVolver = await p.evaluate(() => document.getElementById('agv-volver').textContent);
await pulsar('#agv-volver'); await p.waitForTimeout(1000);
ok(await fichaAbierta('mr-hipernatremia') && /FICHA/.test(txtVolver), `«${txtVolver}» desde mr-hipernatremia vuelve a la ficha, abierta y visible`);
// ficha → río y mar → (enlace) ácido-base vivo: su «← VOLVER» vuelve a la ficha de la que se salió
await abrirFicha('libros', 'marinoFundamentos', 'panel-marino-fund-tabs', 'mar-cristaloides'); await p.waitForTimeout(800);
await pulsar('#mar-cristaloides [data-agua-viva]'); await p.waitForTimeout(REDUCIDO ? 400 : 1500);
await pulsar('#agv-raiz [data-acidobase-vivo]'); await p.waitForTimeout(REDUCIDO ? 600 : 2500);
await pulsar('#abv-volver'); await p.waitForTimeout(1000);
ok(await fichaAbierta('mar-cristaloides'), 'ficha → río y mar → ácido-base: «← VOLVER» vuelve a la ficha de origen');
ok(errores.length === 0, `0 errores de consola al final (${errores.length}) ${errores.slice(0, 3).join(' | ')}`);
// La explicación guiada (guias-comun.mjs): dos enteras, la forma de todas y cada «Ver en la ficha» a un párrafo que existe
await probarGuias({ p, ok, pre: 'agv', view: 'aguaViva', attr: 'aguaViva', GUIAS, recorrer: ['salino', 'hemorragia'], foto, desborde, REDUCIDO });
await ctx.close();
fallosTotales.push(...fallos.map(f => `${tag}: ${f}`));
}

try {
  await correr(390, false);
  await correr(360, true);
} catch (e) { fallosTotales.push('la prueba se cortó: ' + e.message); console.log('❌ ' + e.message); }
await b.close();
console.log(fallosTotales.length ? `\n❌ ${fallosTotales.length} fallo(s)` : '\n✅ río y mar: todo bien');
process.exit(fallosTotales.length ? 1 : 0);
