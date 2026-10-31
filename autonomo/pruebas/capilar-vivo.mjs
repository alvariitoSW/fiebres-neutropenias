// Prueba de navegador del capilar y oxígeno (juez de autonomo/jueces.mjs --modelo capilar-vivo).
// Uso: node autonomo/pruebas/capilar-vivo.mjs <url-base> [--capturas <carpeta>] [--estricto]
// Copia la del río y mar (agua-viva.mjs). Recorre, a 390 px (con movimiento y su medida de rendimiento) y a 360 px
// (con «reducir movimiento»), cada uno en un contexto limpio: accesos (menú de Libros, buscador y las 4 fichas del
// grupo oxígeno con su estado), los estados del cap. 12 (anemia que compensa, techo, umbral, transfusión, sin volumen,
// dilución, TRALI y TACO; sus cifras ±1 en la última frente a la cobertura del bloque 2), los mandos en sus extremos y
// su punto medio (cifras de un paciente posible; también el corazón que compensa, la volemia baja y «Transfundir 1 CH»),
// la explicación guiada recorrida entera en 3 estados (cada paso señala en el dibujo y lleva su «Ver en la ficha»), la
// Mayéutica entera fallando 4 con su repaso, los 4 casos hasta «Lo que te llevas», lo guardado tras recargar,
// Conceptos y el «← VOLVER» a la ficha. Mide el desborde lateral (0 px) tras cada respuesta, el repaso, cada paso de
// los casos y cada paso de las explicaciones; los rótulos de las lupas y gráficas nuevas (≥7,5 px, sin pisarse);
// comprueba que las cifras que se predicen salen tapadas y los errores de consola.
// Cada «Ver en la ficha» de las explicaciones lleva a un id que existe. Los párrafos de Merino HEMATO (ids mh-…) los
// pone la rama de las fichas del bloque 2: sin ellos la cita lleva a la ficha entera y aquí sale un aviso; con
// --estricto, un fallo.
// Sale con código 1 si algo falla.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const { PREGUNTAS, CASOS, CONCEPTOS, ESTADOS, GUIAS, estadoFinal, derivar, estadoDe } = await import(new URL('../../js/data/capilar-vivo-data.js', import.meta.url));
const { barajar } = await import(new URL('../../js/core/mayeutica-motor.js', import.meta.url));
const args = process.argv.slice(2);
const BASE = (args.find(a => /^https?:/.test(a)) || 'http://localhost:8000/').replace(/\/?$/, '/');
const CAPTURAS = args.includes('--capturas') ? args[args.indexOf('--capturas') + 1].replace(/\/?$/, '/') : null;
const ESTRICTO = args.includes('--estricto');
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
ok(await p.evaluate(() => [...document.querySelectorAll('#cpv-raiz img')].filter(i => i.offsetParent && !i.closest('details:not([open])')).every(i => i.complete && i.naturalWidth > 0)), 'las láminas del libro visibles cargan');
// Las láminas de los plegables (Figs. 12.2-12.6, 9.1-9.3): al abrirlos, cargan
ok(await p.evaluate(async () => {
  const ds = [...document.querySelectorAll('#cpv-vista-explorar details')], cerrados = ds.filter(d => !d.open); cerrados.forEach(d => { d.open = true; });
  const imgs = ds.flatMap(d => [...d.querySelectorAll('img')]); imgs.forEach(i => { i.loading = 'eager'; });
  await Promise.all(imgs.map(i => i.complete ? null : new Promise(r => { i.onload = i.onerror = r; })));
  const bien = imgs.every(i => i.naturalWidth > 0); cerrados.forEach(d => { d.open = false; }); return bien && imgs.length >= 7;
}), 'las láminas de los plegables (Figs. 12.2-12.6 y 9.1-9.3) cargan');

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

// 4b. Los estados del cap. 12, desde el enlace cruzado de siempre (como desde las fichas de Merino HEMATO): sus
// cifras, ±1 en la última (cobertura del bloque 2 §4.2), su lupa y sin desborde
const abrirModelo = k => p.evaluate(k => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'capilarVivo', capilarVivo: k }); document.body.append(t); t.click(); t.remove(); }, k);
const cerca = (v, e, tol) => v != null && Math.abs(v - e) <= tol + 1e-9;
for (const [k, compr, nota] of [
  ['dilucion', t => t.lupa === 'tubo' && cerca(t.estado.hb, 13.9, 0) && t.estado.dil === 'pie', 'Hto 41,8 %, Hb 13,9 (Hto/3)'],
  ['anemia-compensada', t => cerca(t.R.gc, 7.6, 0.15) && cerca(t.R.ext, 34, 1) && cerca(t.R.vo2, 250, 1) && cerca(t.R.visc, 2.3, 0.1), 'gasto ≈7,6, extracción ≈34 %, VO₂ 250, viscosidad ×2,3'],
  ['techo-anemia', t => cerca(t.R.gc, 12.7, 0.1) && t.R.ext === 50 && cerca(t.R.vo2, 250, 1), 'Hb 3: gasto 12,7, extracción 50 %'],
  ['umbral-7', t => cerca(t.R.ext, 34, 1) && t.R.ext < 40, 'Hb 7: extracción ≈34 %'],
  ['transfusion', t => cerca(t.estado.hb, 8, 0) && t.estado.transf && t.estado.transf.de === 6.4 && cerca(t.R.vo2, 250, 1), 'Hb 6,4 → 8, VO₂ igual'],
  ['anemia-hipovolemia', t => t.R.gc === 4 && cerca(t.R.do2, 394, 1) && t.R.vo2 < 250 && t.R.lact > 2, 'gasto 4, aporte 394, VO₂ <250'],
  ['trali', t => t.lupa === 'alveolo' && t.estado.alveolo === 'trali' && t.R.sao2 < 90, 'alvéolo, PaO₂ 55'],
  ['taco', t => t.lupa === 'alveolo' && t.estado.alveolo === 'taco' && t.R.sao2 < 90, 'alvéolo, PaO₂ 55'],
]) {
  await abrirModelo(k); await p.waitForTimeout(REDUCIDO ? 300 : 2600);
  const t = await T();
  ok(await vistaVisible() && compr(t), `abre en «${k}»: ${nota} (gasto ${t.R.gc}, extracción ${t.R.ext} %, VO₂ ${t.R.vo2})`);
  if (await desborde() > 0) ok(false, `desborde en «${k}»`);
  if (['dilucion', 'anemia-compensada', 'transfusion', 'trali', 'taco'].includes(k)) { await p.evaluate(() => document.getElementById('cpv-escena-bloque').scrollIntoView({ block: 'start' })); await p.waitForTimeout(300); await foto('04b-' + k); }
}
// 4c. La lupa del neutrófilo (cap. 17): las dos claves abren la lupa y pintan la cadena; el tope del O₂ (Tabla 21.4)
for (const k of ['neutrofilo', 'reperfusion']) {
  await abrirModelo(k); await p.waitForTimeout(REDUCIDO ? 300 : 1200);
  const q = await p.evaluate(() => { const sv = document.getElementById('cpv-lupa-svg'); const ids = ['cadena', 'nadph', 'sup', 'h2o2', 'neu-flujo', 'fork', 'vaso', 'organo', 'fe'].filter(i => sv.querySelector('#cpv-lupa-' + i)); const pt = sv.querySelectorAll('#cpv-lupa-neu-flujo circle').length; return { ids, pt, titulo: sv.querySelector('#cpv-lupa-neu-titulo')?.textContent || '' }; });
  const t = await T();
  const esperado = k === 'neutrofilo' ? ['cadena', 'nadph', 'sup', 'h2o2', 'fork', 'fe'] : ['cadena', 'nadph', 'vaso', 'organo', 'fe'];
  ok(t.lupa === 'neutrofilo' && t.estado.ros === k && esperado.every(i => q.ids.includes(i)) && (k === 'reperfusion' ? !q.ids.includes('fork') : !q.ids.includes('organo')) && q.pt >= 6 && /×20/.test(q.titulo),
    `«${k}» abre la lupa del neutrófilo (${q.ids.join(', ')}; ${q.pt} puntos; ${q.titulo.slice(0, 40)})`);
  ok(await p.evaluate(() => !document.querySelector('.tope-sello') && !!document.querySelector('.tope-aviso[data-tope="hiperoxia"]')), `«${k}»: aviso «solo si SaO₂ <90 %» y sin sello con la PaO₂ normal`);
  await deslizar('#cpv-m-pao2', 100); await p.waitForTimeout(200);
  const s2 = await T();
  ok(await p.evaluate(() => !document.querySelector('.tope-sello') && /sin indicación/.test(document.querySelector('.tope-aviso[data-tope="hiperoxia"]')?.textContent || '') && !/iperoxia/.test(document.querySelector('.tope-aviso[data-tope="hiperoxia"]')?.textContent || '')) && s2.R.sao2 >= 90 && s2.estado.pao2 === 100, `«${k}» con PaO₂ 100 (SaO₂ ${s2.R.sao2} %): solo aviso «O₂ sin indicación», sin sello ni «hiperoxia»`);
  ok(await p.evaluate(() => { const b = document.querySelector('[data-cpv-lupa="neutrofilo"]'); return !!b && !b.hidden && b.getBoundingClientRect().width > 0; }), `«${k}»: el botón de lupa «Neutrófilo» está en la barra`);
  ok(await p.evaluate(() => /más/.test(document.getElementById('cpv-lupa-svg').textContent)), `«${k}»: el dibujo dice que con O₂ de más hay más daño`);
  if (await desborde() > 0) ok(false, `desborde en «${k}»`);
  await p.evaluate(() => document.getElementById('cpv-escena-bloque').scrollIntoView({ block: 'start' })); await p.waitForTimeout(300); await foto('04c-' + k);
  await deslizar('#cpv-m-pao2', 90); await p.waitForTimeout(200);
  ok(await p.evaluate(() => !document.querySelector('.tope-sello')), `«${k}»: al bajar la PaO₂ a 90 el sello se quita`);
  if (!REDUCIDO && k === 'neutrofilo') { await p.waitForTimeout(21000); ok(await p.evaluate(() => /se apaga/.test(document.getElementById('cpv-lupa-neu-sub').textContent)), 'tras 20 «minutos» la lupa dice «el estallido se apaga»'); }
}
// la anemia del bloque 1 (gasto fijo) dice que es con el gasto fijo y enlaza con el corazón que compensa
await abrirModelo('anemia'); await p.waitForTimeout(500);
ok(await p.evaluate(() => /gasto fijo/.test(document.getElementById('cpv-frase').textContent) && !!document.querySelector('#cpv-frase [data-cpv-ir-estado="anemia-compensada"]')), '«Anemia, gasto fijo»: la frase dice «con el gasto fijo» y ofrece «¿Y si el corazón compensa?»');
await pulsar('#cpv-frase [data-cpv-ir-estado="anemia-compensada"]'); await p.waitForTimeout(400);
ok((await T()).estado.compensa === true, '«¿Y si el corazón compensa?» pone el modelo en la anemia que compensa');

// 4c. Los mandos nuevos en sus extremos y su punto medio (uno a uno): paciente posible
await pulsar('[data-cpv-estado="anemia-compensada"]'); await p.waitForTimeout(300);
await pulsar('[data-cpv-tab="sangre"]');
ok(await p.evaluate(() => document.getElementById('cpv-m-hb').min === '2' && document.getElementById('cpv-m-gc').disabled), 'con el corazón que compensa, la Hb baja hasta 2 y el gasto lo pone el modelo');
for (const v of [2, 9.5, 17]) {
  await deslizar('#cpv-m-hb', v); await p.waitForTimeout(60);
  const { R } = await T();
  ok(R.gc >= 4.9 && R.gc <= 13 && R.svo2 >= 20 && R.svo2 <= 85 && R.do2 >= 190 && R.do2 <= 1900 && R.vo2 <= 250, `compensa, Hb ${v}: gasto ${R.gc}, aporte ${R.do2}, VO₂ ${R.vo2}, SvO₂ ${R.svo2} %, lactato ${R.lact}`);
}
await pulsar('[data-cpv-estado="anemia-hipovolemia"]'); await p.waitForTimeout(300); await pulsar('[data-cpv-tab="corazon"]');
ok(await p.evaluate(() => document.getElementById('cpv-m-gc').max === '5' && !document.getElementById('cpv-m-gc').disabled), 'con la volemia baja, el gasto no pasa de 5');
await deslizar('#cpv-m-hb', 11); await p.waitForTimeout(60);   // la Hb en su punto medio: el gasto, solo
for (const v of [1.5, 3.25, 5]) {
  await deslizar('#cpv-m-gc', v); await p.waitForTimeout(60);
  const { R } = await T();
  ok(R.gc <= 5 && R.svo2 >= 20 && R.do2 >= 190 && R.vo2 <= 250, `volemia baja, Hb 11, gasto ${v}: aporte ${R.do2}, VO₂ ${R.vo2}, SvO₂ ${R.svo2} %, lactato ${R.lact}`);
}
// Hb 7,5 sin volumen y el gasto al mínimo: un shock extremo que la lámina avisa
await deslizar('#cpv-m-hb', 7.5); await deslizar('#cpv-m-gc', 1.5); await p.waitForTimeout(60);
ok(await p.evaluate(() => /Aporte extremo/.test(document.getElementById('cpv-lam-aviso').textContent)), 'Hb 7,5, sin volumen y gasto 1,5: la lámina avisa «Aporte extremo»');
// «Transfundir 1 CH»: Hb +1 g/dL con el gasto quieto, el consumo igual y la extracción que cae
await pulsar('[data-cpv-estado="umbral-7"]'); await p.waitForTimeout(300); await pulsar('[data-cpv-tab="sangre"]');
const antesT = await T();
await pulsar('#cpv-m-transf'); await p.waitForTimeout(REDUCIDO ? 200 : 2600);
const trasT = await T();
ok(cerca(trasT.estado.hb, antesT.estado.hb + 1, 0.01) && trasT.R.gc === antesT.R.gc && cerca(trasT.R.vo2, antesT.R.vo2, 1) && trasT.R.ext < antesT.R.ext && trasT.R.do2 > antesT.R.do2,
  `«Transfundir 1 CH»: Hb ${antesT.estado.hb} → ${trasT.estado.hb}, gasto ${antesT.R.gc} → ${trasT.R.gc}, aporte ${antesT.R.do2} → ${trasT.R.do2}, VO₂ ${trasT.R.vo2}, extracción ${antesT.R.ext} → ${trasT.R.ext} %`);
ok(await p.evaluate(() => !document.getElementById('cpv-bolsa').hasAttribute('hidden')), 'la bolsa se ve mientras dura la transfusión');
await deslizar('#cpv-m-hb', 16.5); await p.waitForTimeout(60); await pulsar('#cpv-m-transf'); await p.waitForTimeout(REDUCIDO ? 200 : 2600);
ok((await T()).estado.hb === 17, 'transfundir con Hb 16,5 llega como mucho a 17');
// El tubo: tumbarse y el bolo (Fig. 12.1)
await pulsar('#cpv-m-tumbar'); await p.waitForTimeout(REDUCIDO ? 100 : 1500);
let tt = await T();
ok(tt.lupa === 'tubo' && tt.estado.dil === 'tumbado' && tt.estado.hb === 12.6, `Tumbarse: el tubo, Hto 37,7 %, Hb ${tt.estado.hb}`);
await pulsar('#cpv-m-bolo'); await p.waitForTimeout(REDUCIDO ? 100 : 1500);
tt = await T();
ok(tt.estado.dil === 'bolo' && tt.estado.hb === 12.9, `Bolo de 20 mL/kg: Hto 38,7 %, Hb ${tt.estado.hb}`);
if (await desborde() > 0) ok(false, 'desborde con los mandos nuevos');

// 4d. Rótulos de las lupas y gráficas nuevas: ≥7,5 px de alto y sin pisarse (como jueces-forma, C)
const rotulos = () => p.evaluate(() => {
  const r = document.getElementById('cpv-raiz'), cajas = [];
  for (const t of r.querySelectorAll('#cpv-lupa-svg text, #cpv-lamina text, #cpv-svg-123 text, #cpv-svg-124 text')) {
    if (!t.textContent.trim() || !t.getClientRects().length) continue;
    let vis = true; for (let e = t; e && e !== document.documentElement; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) { vis = false; break; } }
    if (!vis) continue;
    const b = t.getBoundingClientRect(); if (!b.width || !b.height) continue;
    const svg = t.ownerSVGElement, c = svg.getBoundingClientRect();
    if (b.right <= c.left || b.left >= c.right || b.bottom <= c.top || b.top >= c.bottom) continue;
    const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
    if (svg.id === 'cpv-lamina' && document.getElementById('cpv-lupa') && !document.getElementById('cpv-lupa').hidden) { const L = document.getElementById('cpv-lupa').getBoundingClientRect(); if (cx > L.left && cx < L.right && cy > L.top && cy < L.bottom) continue; }
    cajas.push({ s: t.textContent.trim().slice(0, 24), d: svg.id, x: b.left, y: b.top, w: b.width, h: b.height });
  }
  const pequenos = cajas.filter(c => c.h < 7.5).map(c => `${c.s} ${c.h.toFixed(1)} px`), pisados = [];
  for (let i = 0; i < cajas.length; i++) for (let j = i + 1; j < cajas.length; j++) {
    const a = cajas[i], b2 = cajas[j]; if (a.d !== b2.d) continue;
    const ay = a.y + a.h * 0.25, ah = a.h * 0.6, by = b2.y + b2.h * 0.25, bh = b2.h * 0.6;
    const iw = Math.min(a.x + a.w, b2.x + b2.w) - Math.max(a.x, b2.x), ih = Math.min(ay + ah, by + bh) - Math.max(ay, by);
    if (iw > 0 && ih > 0 && iw * ih / Math.min(a.w * ah, b2.w * bh) > 0.3) pisados.push(`«${a.s}» y «${b2.s}»`);
  }
  return { n: cajas.length, pequenos, pisados };
});
for (const k of ANCHO === 390 ? ['dilucion', 'transfusion', 'trali', 'taco', 'anemia-compensada'] : []) {   // REGLAS §2.8: a 390 px
  await abrirModelo(k); await p.waitForTimeout(REDUCIDO ? 300 : 2600);
  if (k === 'dilucion') { await pulsar('#cpv-m-tumbar'); await p.waitForTimeout(REDUCIDO ? 100 : 1400); }
  await p.evaluate(() => { for (const id of ['cpv-gr-123', 'cpv-gr-124']) document.getElementById(id).open = true; });
  await p.evaluate(() => document.getElementById('cpv-escena-bloque').scrollIntoView({ block: 'start' })); await p.waitForTimeout(200);
  const r = await rotulos();
  ok(r.n > 10 && !r.pequenos.length && !r.pisados.length, `rótulos en «${k}» (${r.n}): ${r.pequenos.slice(0, 3).join(', ')} ${r.pisados.slice(0, 3).join(', ')}`);
  await p.evaluate(() => { for (const id of ['cpv-gr-123', 'cpv-gr-124']) document.getElementById(id).open = false; });
}

// 4e. La explicación guiada, entera, en 3 estados: cada paso señala en el dibujo (un anillo o el marco de una cifra),
// lleva su «Ver en la ficha» (a un id que existe) y el PDF; sin desborde; al terminar vuelven los mandos
for (const k of ['anemia-compensada', 'dilucion', 'trali']) {
  await abrirModelo(k); await p.waitForTimeout(REDUCIDO ? 300 : 2600);
  await pulsar('#cpv-guia-abrir'); await p.waitForTimeout(REDUCIDO ? 150 : 600);
  const g = (await p.evaluate(() => window.__cpvPruebas().guia));
  ok(g && g.clave === k && g.n === GUIAS[k].length && g.n >= 3 && g.n <= 5, `«Explícame» abre la explicación de «${k}» (${g && g.n} pasos)`);
  ok(await p.evaluate(() => document.getElementById('cpv-dock-explorar').hidden && !document.getElementById('cpv-dock-guia').hidden), `${k}: la explicación ocupa el sitio de los mandos`);
  for (let i = 0; i < GUIAS[k].length; i++) {
    await p.waitForTimeout(REDUCIDO ? 120 : 650);
    const paso = GUIAS[k][i];
    const v = await p.evaluate(() => ({ n: window.__cpvPruebas().guia?.paso, anillos: document.querySelectorAll('#cpv-raiz g.guia-capa rect').length, marcos: document.querySelectorAll('#cpv-raiz .guia-marco, #cpv-raiz .cpv-celda.cpv-mira').length,
      citas: [...document.querySelectorAll('#cpv-dock-guia .guia-citas .cita-ir')].map(c => ({ tab: c.dataset.tab, res: c.dataset.resaltar || null, tabOk: !!document.getElementById(c.dataset.tab), resOk: !c.dataset.resaltar || !!document.querySelector(c.dataset.resaltar) })),
      pdf: [...document.querySelectorAll('#cpv-dock-guia .guia-citas .cita-pdf')].map(a => a.getAttribute('href')),
      escena: document.getElementById('cpv-escena-bloque').getBoundingClientRect().top, txt: document.querySelector('#cpv-dock-guia .guia-txt')?.textContent || '' }));
    const quiere = (paso.resalta ? 1 : 0) + (paso.mirar ? 1 : 0);
    ok(v.n === i && (!quiere || v.anillos + v.marcos > 0) && v.citas.length === [].concat(paso.cita).length && v.citas.every(c => c.tabOk && c.resOk) && v.pdf.length === v.citas.length && Math.abs(v.escena) <= 6,
      `${k}, paso ${i + 1}: señala (${v.anillos} anillos, ${v.marcos} cifras), ${v.citas.length} «Ver en la ficha» y su PDF (${v.pdf.join(' ')})`);
    if (/\b(mar|mr|mc|mh)-[a-z0-9-]+|maqueta|§/.test(v.txt)) ok(false, `${k}, paso ${i + 1}: nombre interno a la vista`);
    if (await desborde() > 0) ok(false, `desborde en ${k}, paso ${i + 1}`);
    if (i === 1) await foto(`10-guia-${k}`);
    if (i < GUIAS[k].length - 1) await pulsar('#cpv-dock-guia [data-guia="1"]');
  }
  ok(await p.evaluate(() => !!document.querySelector('#cpv-dock-guia .guia-fuentes .cita-ir')), `${k}: el último paso lista las fuentes del estado`);
  await pulsar('#cpv-dock-guia [data-guia="-1"]'); await p.waitForTimeout(150);
  ok((await p.evaluate(() => window.__cpvPruebas().guia.paso)) === GUIAS[k].length - 2, `${k}: «← Anterior» vuelve un paso`);
  await pulsar('#cpv-dock-guia [data-guia="1"]'); await p.waitForTimeout(150);
  await pulsar('#cpv-dock-guia [data-guia="salir"]'); await p.waitForTimeout(200);
  ok(await p.evaluate(() => !window.__cpvPruebas().guia && !document.getElementById('cpv-dock-explorar').hidden && !document.querySelectorAll('g.guia-capa').length), `${k}: «Terminar» devuelve los mandos y quita los anillos`);
}
// «Ver en la ficha» desde la explicación lleva a la ficha (Merino HEMATO), y el capilar vuelve a abrir
await abrirModelo('anemia-compensada'); await p.waitForTimeout(REDUCIDO ? 300 : 800);
await pulsar('#cpv-guia-abrir'); await p.waitForTimeout(300);
const destino = await p.evaluate(() => { const b = document.querySelector('#cpv-dock-guia .cita-ir'); b.click(); return b.dataset.tab; });
await p.waitForTimeout(900);
ok(await p.evaluate(t => { const e = document.getElementById(t); return e.classList.contains('active') && !!e.offsetParent; }, destino), `«Ver en la ficha» abre la ficha «${destino}», visible`);
// Las citas de todas las explicaciones: cada ficha existe; cada párrafo, también (los de Merino HEMATO, con --estricto)
const citas = await p.evaluate(() => window.__cpvPruebas().citas);
const sinFicha = citas.filter(c => !c.ficha_existe), sinParrafo = citas.filter(c => !c.exacta);
ok(!sinFicha.length, `las ${citas.length} citas de las explicaciones llevan a una ficha que existe ${sinFicha.slice(0, 3).map(c => c.ficha).join(' ')}`);
const pendientes = sinParrafo.filter(c => /^mh-/.test(c.id)), rotas = sinParrafo.filter(c => !/^mh-/.test(c.id));
ok(!rotas.length, `cada «Ver en la ficha» va a un párrafo que existe ${rotas.slice(0, 4).map(c => c.id).join(' ')}`);
if (pendientes.length) {
  const ids = [...new Set(pendientes.map(c => c.id))];
  if (ESTRICTO) ok(false, `párrafos de Merino HEMATO que aún no existen (${ids.length}): ${ids.join(' ')}`);
  else console.log(`⚠️  ${ids.length} párrafos de Merino HEMATO aún no existen en esta rama (los pone la de las fichas; la cita lleva a la ficha entera): ${ids.join(' ')}`);
} else ok(true, 'todos los párrafos de Merino HEMATO citados existen');
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'capilarVivo', capilarVivo: 'normal' }); document.body.append(t); t.click(); t.remove(); }); await p.waitForTimeout(400);

// 5. Rendimiento (solo con movimiento): CPU ×4
if (!REDUCIDO) {
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.evaluate(() => { window.__cpvPruebas().vaciarFotogramas(); document.querySelector('[data-cpv-estado="sepsis"]').click(); document.getElementById('cpv-escena')?.scrollIntoView({ block: 'start' }); });
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
    if (!q.sinPensar) await pulsar(pref + '[data-accion="ops"]');
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
  ok(await p.evaluate(() => !!document.querySelector('#cpv-preg .cpv-link[data-tab][data-especialidad]')), `${C.id}: «Repasar en la ficha» enlaza con su ficha`);
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
for (const l of ['tubo', 'alveolo', 'dedo', 'mito', 'boca']) {   // la del neutrófilo no tiene botón: se abre con sus estados (4c)
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
const fichaDestino = await p.evaluate(() => document.querySelector('#cpv-concepto .cpv-ir-texto')?.dataset.tab);
await pulsar('#cpv-concepto .cpv-ir-texto'); await p.waitForTimeout(800);
ok(await p.evaluate(t => { const e = document.getElementById(t); return !!e && e.classList.contains('active') && !!e.offsetParent; }, fichaDestino), `«Ver en el texto» abre la ficha (${fichaDestino})`);
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
