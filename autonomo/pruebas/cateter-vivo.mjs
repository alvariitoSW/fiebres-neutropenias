// Prueba de navegador del catéter vivo (juez de autonomo/jueces.mjs --modelo cateter-vivo).
// Uso: node autonomo/pruebas/cateter-vivo.mjs <url-base> [--capturas <carpeta>]
// Copia la del capilar (capilar-vivo.mjs). Recorre, a 390 px (con movimiento y su medida de rendimiento) y a 360 px
// (con «reducir movimiento»), cada uno en un contexto limpio: accesos (menú de Libros, buscador y las 8 fichas de
// los accesos vasculares con su estado), los mandos (cada catéter del catálogo a 100, 68 y 0 cm, las bombas, la
// intraósea y el aire: cifras de la ficha y de un paciente posible), las lupas y el visor de las láminas, la
// Mayéutica entera fallando 4 con su repaso, los 3 casos hasta «Lo que te llevas», lo guardado tras recargar,
// Conceptos y el «← VOLVER» a la ficha. Mide el desborde lateral (0 px) tras cada respuesta, el repaso y cada paso
// de los casos; comprueba que las cifras que se predicen salen tapadas y los errores de consola.
// Sale con código 1 si algo falla.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const { PREGUNTAS, CASOS, CONCEPTOS, CAT, ORDEN_CAT } = await import(new URL('../../js/data/cateter-vivo-data.js', import.meta.url));
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
const T = () => p.evaluate(() => { const t = window.__ctvPruebas(); return { estado: t.estado, D: t.D, modo: t.modo, fase: t.fase, todo: t.todoCoincide, fallos: t.fallos, bucle: t.bucle, guardado: t.guardado, lectura: t.lectura, ocultos: t.ocultos, aireMl: t.aireMl, mayeutica: t.mayeutica }; });
const foto = n => CAPTURAS ? p.screenshot({ path: CAPTURAS + 'ctv-' + n + '-' + tag + '.png' }) : null;
const vistaVisible = () => p.evaluate(() => { const v = document.getElementById('cateter-vivo-view'); return v.style.display === 'block' && v.offsetParent !== null && document.getElementById('libros-view').style.display === 'block'; });
const pestana = () => p.evaluate(() => document.querySelector('#ctv-raiz .ctv-dock-tabs [aria-selected="true"]')?.dataset.ctvTab);

await p.goto(BASE + 'index.html');   // contexto nuevo: localStorage vacío
await p.waitForFunction(() => window.__ctvPruebas);

// 1. Desde el menú de Libros
await p.click('#btn-libros'); await p.click('#ctv-menu-libros'); await p.waitForTimeout(600);
ok(await vistaVisible(), 'abre desde el menú de Libros (Modelos vivos)');
let t = await T();
ok(t.todo, `__ctvPruebas().todoCoincide ${t.fallos.join(' | ')} (Mayéutica: ${t.mayeutica.tests} tests, la buena la más larga en ${t.mayeutica.correctaMasLarga}, posiciones ${t.mayeutica.posiciones})`);
ok(t.D.valor === 220 && t.D.unidad === 'mL/min' && /220/.test(t.lectura), `lámina inicial: 16 G, ${t.D.valor} ${t.D.unidad} (Fig. 1.1)`);
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
await foto('01-primera');
ok(await desborde() <= 0, 'sin desborde en la primera pantalla');
ok(await p.evaluate(() => { const f = document.getElementById('ctv-frase').getBoundingClientRect(), d = document.getElementById('ctv-dock').getBoundingClientRect(); return f.top >= d.top && f.bottom <= innerHeight; }), 'la frase viva se ve, dentro del dock');
ok(await p.evaluate(() => { const e = document.getElementById('ctv-escena').getBoundingClientRect(); return e.top < innerHeight && e.bottom > 0; }), 'la lámina se ve en la primera pantalla');

// 2. Desde el buscador
for (const q of ['catéter vivo', 'biopelícula', 'embolia gaseosa', 'picc', 'doppler color']) {
  await pulsar('#btn-buscar-global'); await p.fill('#search-input-el', q); await p.waitForTimeout(150);
  const n = await p.evaluate(() => [...document.querySelectorAll('.search-result-row')].findIndex(r => /Catéter vivo/.test(r.textContent)));
  ok(n >= 0, `el buscador encuentra el catéter vivo con «${q}»`);
  if (n >= 0) {
    await p.evaluate(i => document.querySelectorAll('.search-result-row')[i].click(), n); await p.waitForTimeout(250);
    ok(await vistaVisible(), `… y lo abre («${q}»)`);
  } else await pulsar('#search-close-btn');
}

// 3. Desde las 8 fichas de los accesos vasculares, cada botón en su estado
const abrirFicha = tab => p.evaluate(tab => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'marinoFundamentos', panel: 'panel-marino-fund-tabs', tab }); document.body.append(t); t.click(); t.remove(); }, tab);
const desde = async (tab, estado, compr, nombre, tabDock) => {
  await abrirFicha(tab); await p.waitForTimeout(300);
  const sel = `#${tab} [data-cateter-vivo="${estado}"]`;
  ok(await p.evaluate(s => !!document.querySelector(s) && document.querySelector(s).offsetParent !== null, sel), `la ficha ${tab} tiene su botón visible (${estado})`);
  await p.locator(sel).first().scrollIntoViewIfNeeded(); await p.locator(sel).first().click(); await p.waitForTimeout(REDUCIDO ? 300 : 1000);
  const t = await T();
  ok(await vistaVisible() && compr(t), `desde ${tab}: abre en «${estado}» (${t.D.texto} ${t.D.unidad}, lupa ${t.estado.lupa})`);
  if (tabDock) ok(await pestana() === tabDock, `${estado}: el dock abre en «${tabDock}»`);
  ok(await desborde() <= 0, `sin desborde (${estado})`);
  if (nombre) await foto('03-' + nombre);
};
await desde('mar-cateteres-flujo', 'altura', t => t.D.valor === 4 && t.D.presion === 50 && /calculado/.test(t.lectura), null, 'empujar');
await desde('mar-cateteres-flujo', 'infusor', t => t.D.valor === 1.5 && t.D.unidad === 'L/min', null, 'empujar');
await desde('mar-tipos-cateter', 'catalogo', t => t.D.valor === 0.26 && t.D.unidad === 'L/h', 'catalogo', 'cateter');
await desde('mar-tipos-cateter', 'cvc-luces', t => t.D.valor === 2.28, null, 'cateter');
await desde('mar-eco-intraosea', 'intraosea', t => t.D.rel === 0.25 && t.D.presionMedula === 30 && /25 %/.test(t.lectura), null, 'empujar');
await desde('mar-eco-intraosea', 'eco-doppler', t => t.estado.lupa === 'D' && t.D.eco.colorArteria === 'rojo' && t.D.eco.colorVena === 'azul', 'eco', 'lupa');
await desde('mar-cvc-sitios', 'colonizacion', t => t.estado.lupa === 'B' && t.estado.tiempo === 48 && t.D.bio.clinicaPosible, 'colonizacion', 'tiempo');
await desde('mar-cvc-complicaciones', 'aire', t => t.estado.lupa === 'C' && t.D.aire.tasa === 100 && t.estado.aire.abierto, 'aire', 'problema');
await desde('mar-cvc-complicaciones', 'trendelenburg', t => t.D.aire.reducido && t.D.aire.tasa === null && /menos/.test(t.lectura), null, 'problema');
await desde('mar-cateter-cuidados', 'oclusion-precipitado', t => t.D.ocluido && t.estado.oclusion === 'mineral' && /ALARMA|ocluido/.test(t.lectura + 'ocluido'), null, 'problema');
await desde('mar-cateter-cuidados', 'punta-izquierda', t => t.estado.lupa === 'C' && t.D.punta.ok === false, null);
await desde('mar-bacteriemia-cateter', 'biopelicula', t => t.estado.lupa === 'B' && t.D.bio.visible && !t.D.bio.clinicaPosible, 'biopelicula', 'problema');
await desde('mar-bacteriemia-cateter', 'hemocultivos', t => t.estado.zoomB === 'frascos' && t.estado.hcIncubado, null, 'problema');
await desde('mar-bacteriemia-cateter', 'recambio-guia', t => t.estado.manejo === 'guia' && /—/.test(t.lectura), null, 'tiempo');
await desde('mar-microbioma', 'colonizacion', t => t.estado.lupa === 'B' && t.estado.zoomB === 'vias', null, 'tiempo');
const nChips = await p.evaluate(() => ['mar-cateteres-flujo', 'mar-tipos-cateter', 'mar-eco-intraosea', 'mar-cvc-sitios', 'mar-cvc-complicaciones', 'mar-cateter-cuidados', 'mar-bacteriemia-cateter', 'mar-microbioma'].map(id => document.querySelectorAll(`#${id} [data-cateter-vivo]`).length));
ok(nChips.every(n => n > 0), `las 8 fichas llevan «Ver en el catéter vivo» (${nChips.join(', ')})`);
const crudosExp = await p.evaluate(() => [...document.querySelectorAll('#ctv-raiz .ctv-org')].filter(e => e.offsetParent).map(e => e.textContent).filter(t => /\b(mar|mr|mc)-[a-z0-9-]+/.test(t)));
ok(!crudosExp.length, `chips de origen sin ids a la vista en Explorar ${crudosExp.slice(0, 3).join(' | ')}`);
ok(await p.evaluate(() => document.querySelectorAll('#ctv-raiz .ctv-org-ir').length > 10), 'los chips de origen llevan enlaces a su ficha');
ok(await p.evaluate(() => [...document.querySelectorAll('#ctv-raiz img')].filter(i => i.offsetParent).every(i => i.complete && i.naturalWidth > 0)), 'las láminas del libro visibles cargan');

// 4. Los mandos: cada catéter del catálogo a 100, 68 y 0 cm (cifras de la tabla, calculadas o cero), las bombas,
//    la intraósea y el aire. Cifras de un paciente posible y lectura sin «NaN».
await p.evaluate(() => document.querySelector('[data-ctv-estado="catalogo"]').click());
await pulsar('[data-ctv-tab="cateter"]');
for (const k of ORDEN_CAT.filter(k => CAT[k].lh != null)) {
  await pulsar(`#ctv-m-catalogo [data-ctv-cat="${k}"]`);
  for (const h of [100, 68, 0]) {
    await pulsar(`#ctv-m-altura [data-v="${h}"]`); await p.waitForTimeout(30);
    const { D, lectura } = await T();
    const esperado = h === 100 ? CAT[k].lh : h === 68 ? +(CAT[k].lh * 50 / 75).toFixed(2) : 0;
    const posible = D.valor >= 0 && D.valor <= 6 && !/NaN|undefined/.test(lectura);
    if (!(posible && Math.abs(D.valor - esperado) < 1e-9)) ok(false, `${k} a ${h} cm: ${D.valor} L/h (esperado ${esperado})`);
  }
}
ok(true, `catálogo: ${ORDEN_CAT.length - 1} catéteres a 100, 68 y 0 cm con la cifra de la tabla (o × 50/75, o 0)`);
await pulsar('#ctv-m-altura [data-v="100"]');
for (const [bomba, val, uni] of [['volumetrica', 1000, 'mL/h'], ['jeringa', 100, 'mL/h'], ['gravedad', 6, 'L/h']]) {
  await pulsar('[data-ctv-cat="pc"]'); await pulsar(`#ctv-m-bomba [data-v="${bomba}"]`);
  const { D } = await T();
  ok(D.valor === val && D.unidad === uni, `${bomba}: ${D.valor} ${D.unidad}`);
}
await pulsar('#ctv-m-bomba [data-v="infusor"]');
ok(/catéter de infusión rápida/.test(await p.evaluate(() => document.getElementById('ctv-frase').textContent)), 'el infusor con otro catéter avisa: pide su catéter de 7-8 Fr');
await pulsar('#ctv-m-bomba [data-v="gravedad"]');
await pulsar('#ctv-m-banco [data-v="fig"]');
for (const [g, v] of [[16, 220], [18, 105], [20, 60]]) { await pulsar(`#ctv-m-calibre [data-v="${g}"]`); ok((await T()).D.valor === v, `calibre ${g} G: ${v} mL/min`); }
for (const [l, v] of [[2, 151], [6, 91], [12, 54]]) { await pulsar(`#ctv-m-longitud [data-v="${l}"]`); ok((await T()).D.valor === v, `longitud ${l}″: ${v} mL/min`); }
await pulsar('#ctv-m-vena [data-v="grande"]'); ok((await T()).D.valor === 54, 'la vena grande no cambia el flujo');
await foto('04-mandos');
// El aire: el contador no pasa de 350 mL y se para al cerrar
await pulsar('[data-ctv-tab="problema"]'); await pulsar('#ctv-m-problema [data-v="aire"]'); await pulsar('#ctv-m-postura [data-v="espontanea"]'); await pulsar('#ctv-m-conector');
await p.waitForTimeout(REDUCIDO ? 200 : 4000);
t = await T();
ok(t.aireMl >= 200 && t.aireMl <= 350 && /Mortal/.test(t.lectura), `conector abierto: ${t.aireMl} mL de aire (tope 350; mortal 200-300)`);
await pulsar('#ctv-m-postura [data-v="femoral"]'); await pulsar('#ctv-m-conector'); await p.waitForTimeout(400);
t = await T(); ok(t.D.aire.tasa === 0 && t.aireMl === 0, 'femoral: no entra aire');
await foto('05-aire');

// 5. Lupas y visor de las láminas del libro
for (const l of ['B', 'C', 'D', 'A']) {
  await pulsar(`[data-ctv-lupa="${l}"]`); await p.waitForTimeout(REDUCIDO ? 50 : 500);
  ok((await T()).estado.lupa === l && await desborde() <= 0, `la lupa ${l} abre sin desbordar`);
  if (l === 'B') { for (const z of ['vias', 'punta', 'micro', 'frascos']) { await pulsar(`#ctv-mandos-lupa [data-grupo="zoomB"] [data-v="${z}"]`); if (await desborde() > 0) ok(false, `desborde en la lupa B · ${z}`); } }
  if (l === 'D') { for (const k of ['comprimir', 'doppler', 'girada', 'aguja']) await pulsar(`#ctv-mandos-lupa [data-tog="${k}"]`); t = await T(); ok(t.D.eco.colorArteria === 'azul' && t.D.eco.venaColapsa, 'lupa D: girar la sonda intercambia los colores; la vena se colapsa'); }
}
await pulsar('#ctv-tira [data-ctv-fig]'); await p.waitForTimeout(500);
ok(await p.evaluate(() => { const d = document.getElementById('ctv-visor'), i = document.getElementById('ctv-visor-img'); return d.open && i.complete && i.naturalWidth > 0 && /page=\d+/.test(document.getElementById('ctv-visor-pdf').href); }), 'el visor abre la lámina del libro con su página del PDF');
await pulsar('#ctv-visor-cerrar');

// 6. Rendimiento (solo con movimiento): CPU ×4
if (!REDUCIDO) {
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.evaluate(() => { window.__ctvPruebas().vaciarFotogramas(); document.querySelector('[data-ctv-estado="calibre"]').click(); });
  await p.waitForTimeout(3000);
  const f = (await T()).bucle.fotogramas;
  ok(f.n > 20 && f.medio < 20, `fotograma medio con CPU ×4: ${f.medio} ms (n=${f.n}, máx ${f.max})`);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await p.evaluate(() => document.querySelector('#ctv-volver').click()); await p.waitForTimeout(400);
  ok(!(await T()).bucle.enMarcha, 'el bucle se para con la vista oculta');
  await pulsar('#ctv-menu-libros'); await p.waitForTimeout(300);
} else ok(!(await T()).bucle.enMarcha, 'con «reducir movimiento» no hay bucle: estado final');

// 7. Mayéutica entera fallando 4 (cv-g2, cv-e2 y cv-e3; y el «tocar» de cv-g1), con el repaso
await pulsar('#ctv-modo-preguntas'); await p.waitForTimeout(300);
ok(await p.evaluate(() => getComputedStyle(document.querySelector('.ctv-lead')).display === 'none'), 'la entradilla se oculta en la Mayéutica');
await pulsar('#ctv-preg [data-ir="recorrido"]');
const FALLAR = new Set(['cv-g2', 'cv-e2', 'cv-e3']);
const FALLAR_TOCAR = 'cv-g1';
let nDesbordeOk = 0;
const VALOR_BUENO = { calibre: b => b.figCal, longitud: b => b.figLong, vena: b => b.vena, altura: b => b.altura, 'cvc-luces': b => b.cat, punta: b => b.punta };
const MANDO = { 'cvc-luces': 'cat' };
const contestar = async (q, fallar, foto1, fallarTocar, donde = q.id) => {
  const pref = '#ctv-preg ';
  // antes de contestar: las cifras que se predicen salen tapadas
  const tap = q.ocultar || q.tocar?.ocultar || [];
  if (tap.length) {
    const tapado = await p.evaluate(tap => {
      const lec = document.getElementById('ctv-lectura');
      const grande = lec.querySelector('.ctv-grande')?.textContent || '';
      const bs = [...lec.querySelectorAll('b')].map(b => b.textContent);
      return tap.every(k => ['flujo', 'aire', 'hc'].includes(k) ? grande.startsWith('?') : k === 'presion' ? bs.some(x => /\?/.test(x)) || grande.startsWith('?') || !/mmHg/.test(lec.textContent) : bs.some(x => x === '?') || grande.startsWith('?'));
    }, tap);
    if (!tapado) ok(false, `${donde}: se ven antes de contestar ${tap.join(', ')}`);
  }
  if (q.tipo === 'test') {
    await pulsar(pref + '[data-accion="ops"]');
    const buena = q.opciones.findIndex(o => o.ok), mala = q.opciones.findIndex(o => !o.ok);
    if (foto1) { await p.evaluate(() => document.getElementById('ctv-preg').scrollIntoView({ block: 'start' })); await foto(foto1 + '-antes'); }
    await pulsar(pref + `[data-op="${fallar ? mala : buena}"]`);
  } else if (q.tipo === 'destapa') {
    if (await p.evaluate(() => document.querySelectorAll('#ctv-pts input').length)) ok(false, `${donde}: los puntos de «destapa» están en el HTML antes de destapar`);
    await pulsar(pref + '[data-accion="destapa"]');
    if (!fallar) await p.evaluate(() => document.querySelectorAll('#ctv-pts input').forEach(c => { c.checked = true; }));
    await pulsar(pref + '[data-accion="puntos"]');
  } else {
    if (!fallar) for (const [i, f] of q.frases.entries()) if (f.mal) await pulsar(pref + `[data-fr="${i}"]`);
    await pulsar(pref + '[data-accion="corregir"]');
  }
  if (q.tocar) {
    const tc = q.tocar;
    if (fallarTocar) {
      await pulsar(pref + '[data-accion="comprobar"]'); await pulsar(pref + '[data-accion="comprobar"]');
      ok(await p.evaluate(() => /cuenta como fallo/.test(document.getElementById('ctv-q-fin')?.textContent || '')), `${q.id}: el «tocar» fallado cuenta como fallo`);
      const sinc = await p.evaluate(() => { const b = document.querySelector('#ctv-mando [data-mando][aria-pressed="true"]'); return !!b; });
      ok(sinc, `${q.id}: «Te lo pongo en el modelo» deja el mando de la pregunta igual que el modelo`);
    } else for (const m of tc.mandos) {
      if (VALOR_BUENO[m]) await pulsar(pref + `[data-mando="${MANDO[m] || m}"][data-v="${VALOR_BUENO[m](Object.assign({}, q.estado, tc.bueno))}"]`);
      else await pulsar(pref + `[data-mando="${m}"]`);
    }
    if (!fallarTocar) {
      await pulsar(pref + '[data-accion="comprobar"]');
      ok(await p.evaluate(() => /Comprobado/.test(document.getElementById('ctv-q-fin')?.textContent || '')), `${donde}: se comprueba en el modelo`);
    }
  }
  // tras contestar: sin desborde, nada tapado, sin «maqueta» y sin chips de origen con ids sueltos
  await p.waitForTimeout(REDUCIDO ? 30 : 250);
  const dsb = await desborde(); if (dsb > 0) ok(false, `desborde de ${dsb} px tras contestar ${donde}`); else nDesbordeOk++;
  const tr = await T();
  if (tr.ocultos.length || /\?/.test(tr.lectura.replace('¿?', ''))) ok(false, `${donde}: siguen tapadas ${tr.ocultos.join(', ')} tras contestar (${tr.lectura})`);
  const txt = await p.evaluate(() => document.getElementById('ctv-preg').textContent);
  if (/maqueta/i.test(txt)) ok(false, `${donde}: aparece «maqueta»`);
  const crudos = await p.evaluate(() => [...document.querySelectorAll('#ctv-preg .ctv-org')].map(e => e.textContent).filter(t => /\b(mar|mr|mc)-[a-z0-9-]+/.test(t)));
  if (crudos.length) ok(false, `${donde}: chips con ids: ${crudos.join(' | ')}`);
  if (!await p.evaluate(() => document.querySelectorAll('#ctv-preg .ctv-ir-texto').length > 0)) ok(false, `${donde}: sin «Ver en el texto» enlazado`);
  if (foto1) { await p.waitForTimeout(REDUCIDO ? 100 : 800); await p.evaluate(() => document.querySelector('#ctv-preg [data-accion="sig"]').scrollIntoView({ block: 'end' })); await foto(foto1 + '-despues'); }
  await pulsar(pref + '[data-accion="sig"]');
};
for (const [i, q] of PREGUNTAS.entries()) {
  const html = await p.evaluate(() => document.getElementById('ctv-preg').innerHTML);
  if (/data-correcta|data-mal|data-ok|"ok":/.test(html)) ok(false, `${q.id}: la respuesta está escrita en el HTML`);
  await contestar(q, FALLAR.has(q.id), i === 1 ? '06-pregunta' : null, q.id === FALLAR_TOCAR);
  if (await desborde() > 0) ok(false, `desborde en la pregunta ${q.id}`);
}
t = await T();
ok(t.fase === 'repaso', `tras las ${PREGUNTAS.length}, pasa al repaso`);
ok(await p.evaluate(() => document.querySelectorAll('#ctv-preg [data-rep]').length) === 4, 'el repaso trae las 4 falladas (3 + el «tocar» fallado)');
await foto('07-repaso');
for (const id of ['cv-g1', 'cv-g2', 'cv-e2', 'cv-e3']) {
  await pulsar(`#ctv-preg [data-rep="${id}"]`);
  await contestar(PREGUNTAS.find(q => q.id === id), false, null, false, 'repaso ' + id);
}
ok(await p.evaluate(() => /No queda nada por repasar/.test(document.getElementById('ctv-preg').textContent)), 'el repaso se vacía al acertarlas');
t = await T();
ok(Object.keys(t.guardado).length === PREGUNTAS.length && Object.values(t.guardado).filter(g => g.resultado === 'mal').length === 4, `localStorage: ${PREGUNTAS.length} guardadas, 4 falladas`);

// 8. Los 3 casos hasta «Lo que te llevas» (fallando el primer paso de cada uno)
await pulsar('#ctv-preg [data-ir="casos"]');
for (const [k, C] of CASOS.entries()) {
  await pulsar(`#ctv-preg [data-caso="${k}"]`);
  for (const [j, paso] of C.pasos.entries()) {
    if (paso.calculadora && !await p.evaluate(() => !!document.querySelector('#ctv-preg [data-resaltar$="-calc"]'))) ok(false, `${C.id} paso ${j + 1}: sin el enlace a la calculadora`);
    if (!await p.evaluate(() => document.querySelectorAll('#ctv-preg .ctv-paciente dd').length >= 3)) ok(false, `${C.id} paso ${j + 1}: sin la ficha del paciente`);
    await contestar({ ...paso.pregunta, estado: paso.estado, ocultar: paso.pregunta.ocultar }, j === 0, k === 2 && j === 3 ? '08-caso-giro' : null, false, `${C.id} paso ${j + 1}`);
  }
  ok(await p.evaluate(() => /Lo que te llevas/.test(document.getElementById('ctv-preg').textContent)), `el caso ${C.id} llega a «Lo que te llevas»`);
  ok(await p.evaluate(() => !!document.querySelector('#ctv-preg [data-tab][data-especialidad="libros"]')), `${C.id}: «Repasar en la ficha» enlaza con su ficha`);
  if (await desborde() > 0) ok(false, `desborde en «Lo que te llevas» del caso ${C.id}`);
  if (k === 0) {
    await p.evaluate(() => { const r = document.getElementById('ctv-preg').getBoundingClientRect(); const esc = document.getElementById('ctv-escena-bloque').getBoundingClientRect(); window.scrollBy(0, r.top - esc.height - 10); }); await p.waitForTimeout(200);
    await foto('09-fin-caso');
    await pulsar('#ctv-preg [data-fin="modelo"]'); await p.waitForTimeout(300);
    const v = await T();
    ok(v.modo === 'explorar' && v.estado.cat === 'rapido' && v.estado.bomba === 'infusor', `volver del caso A1 al modelo: Explorar con el infusor rápido (${v.D.texto} ${v.D.unidad})`);
    await pulsar('#ctv-modo-preguntas'); await pulsar('#ctv-preg [data-ir="casos"]');
  } else if (k < CASOS.length - 1) await pulsar('#ctv-preg [data-fin="otro"]');
}
const nRespuestas = PREGUNTAS.length + 4 + CASOS.reduce((a, c) => a + c.pasos.length, 0);
ok(nDesbordeOk >= nRespuestas, `sin desborde tras contestar en ${nDesbordeOk} de ${nRespuestas} respuestas y pasos`);

// 9. Lo guardado sigue al recargar
await p.reload(); await p.waitForFunction(() => window.__ctvPruebas);
await p.click('#btn-libros'); await p.click('#ctv-menu-libros'); await p.waitForTimeout(300);
await pulsar('#ctv-modo-preguntas'); await p.waitForTimeout(200);
ok(await p.evaluate(n => new RegExp(`Seguir \\(${n} de ${n}\\)`).test(document.getElementById('ctv-preg').textContent), PREGUNTAS.length), `tras recargar, la Mayéutica recuerda las ${PREGUNTAS.length}`);
// Conceptos: todos, tocando cada acción
await pulsar('#ctv-modo-conceptos');
for (let i = 0; i < CONCEPTOS.length; i++) {
  await p.evaluate(() => document.querySelectorAll('#ctv-concepto [data-acc]').forEach(b => b.click())); await p.waitForTimeout(REDUCIDO ? 50 : 200);
  if (await desborde() > 0) ok(false, `desborde en el concepto ${i + 1}`);
  if (i === 7) { await p.evaluate(() => window.scrollTo(0, 0)); await foto('10-concepto-vias'); }
  if (i < CONCEPTOS.length - 1) await pulsar('#ctv-concepto [data-nav="1"]');
}
ok(await desborde() <= 0, `sin desborde en los ${CONCEPTOS.length} conceptos`);
await pulsar('#ctv-modo-explorar');
ok(errores.length === 0, `0 errores de consola (${errores.length}) ${errores.slice(0, 3).join(' | ')}`);
const ids = await p.evaluate(() => { const v = {}; document.querySelectorAll('[id]').forEach(e => { v[e.id] = (v[e.id] || 0) + 1; }); return Object.keys(v).filter(k => v[k] > 1); });
ok(ids.length === 0, 'sin ids repetidos ' + ids.join(','));

// 10. «← VOLVER» desde una ficha: vuelve a la ficha, abierta
const fichaAbierta = tab => p.evaluate(t => { const e = document.getElementById(t); return e.classList.contains('active') && !!e.offsetParent; }, tab);
for (const tab of ['mar-cateteres-flujo', 'mar-cvc-sitios', 'mar-bacteriemia-cateter']) {
  await abrirFicha(tab); await p.waitForTimeout(800);
  await pulsar(`#${tab} [data-cateter-vivo]`); await p.waitForTimeout(REDUCIDO ? 400 : 1000);
  const txtVolver = await p.evaluate(() => document.getElementById('ctv-volver').textContent);
  await pulsar('#ctv-volver'); await p.waitForTimeout(1000);
  ok(await fichaAbierta(tab) && /FICHA/.test(txtVolver), `«${txtVolver}» desde ${tab} vuelve a la ficha, abierta y visible`);
}
// Desde el menú, el «← VOLVER» vuelve a ser el de siempre
await p.evaluate(() => document.querySelector('.btn-volver-libros-menu').click()); await p.waitForTimeout(200);
await p.evaluate(() => { document.getElementById('ctv-menu-libros').click(); }); await p.waitForTimeout(300);
ok(await p.evaluate(() => document.getElementById('ctv-volver').textContent === '← VOLVER'), 'desde el menú, «← VOLVER» lleva al menú');
// «Ver en el texto» desde el modelo lleva a la ficha
await pulsar('#ctv-modo-conceptos'); await p.waitForTimeout(200);
await pulsar('#ctv-concepto .ctv-ir-texto'); await p.waitForTimeout(800);
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
console.log(fallosTotales.length ? `\n❌ ${fallosTotales.length} fallo(s)` : '\n✅ catéter vivo: todo bien');
process.exit(fallosTotales.length ? 1 : 0);
