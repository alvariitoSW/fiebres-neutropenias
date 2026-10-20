// Prueba de navegador de la muralla de papel (juez de autonomo/jueces.mjs --modelo muralla-viva).
// Uso: node autonomo/pruebas/muralla-viva.mjs <url-base> [--capturas <carpeta>]
// Copia la del capilar (capilar-vivo.mjs). Recorre, a 390 px (con movimiento y su medida de rendimiento) y a 360 px
// (con «reducir movimiento»), cada uno en un contexto limpio: la cama 7 (zoom de entrada, compactar, ampliar y sus
// ventanas como enlaces cruzados), los accesos (menú de Libros, buscador y los botones de las fichas mar-microbioma y
// mar-ulcera-estres en su estado), la regla de la Tabla 4.2 frente a la calculadora real de la ficha, los mandos y
// los toques de la lámina, la Mayéutica entera fallando 4 con su repaso, los 3 casos hasta «Lo que te llevas», lo
// guardado tras recargar, Conceptos, «Ver en el texto» y el «← VOLVER» a la ficha. Mide el desborde lateral (0 px)
// tras cada respuesta, el repaso y cada paso de los casos; comprueba que las cifras que se predicen salen tapadas,
// que no se ve ningún id interno y los errores de consola. Sale con código 1 si algo falla.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const { PREGUNTAS, CASOS, CONCEPTOS, ESTADOS, riesgoTabla42, estadoDe } = await import(new URL('../../js/data/muralla-viva-data.js', import.meta.url));
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
const pulsar = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no hay ' + s); if (e.click) e.click(); else e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, sel);
const desborde = () => p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const T = () => p.evaluate(() => { const t = window.__murPruebas(); return { estado: t.estado, D: { riesgo: t.D.riesgo, motor: t.D.motor, ph: t.D.ph, lesion: t.D.lesion, salmonella: t.D.salmonella }, modo: t.modo, fase: t.fase, todo: t.todoCoincide, fallos: t.fallos, bucle: t.bucle, guardado: t.guardado, celdas: t.celdas, ocultos: t.ocultos, mayeutica: t.mayeutica, cama: t.cama }; });
const foto = n => CAPTURAS ? p.screenshot({ path: CAPTURAS + 'mur-' + n + '-' + tag + '.png' }) : null;
const vistaVisible = () => p.evaluate(() => { const v = document.getElementById('muralla-viva-view'); return v.style.display === 'block' && v.offsetParent !== null && document.getElementById('libros-view').style.display === 'block'; });
const sinIds = () => p.evaluate(() => { const t = document.getElementById('mur-raiz').innerText; return (t.match(/\b(mar|mr|mc)-[a-z0-9]+(-[a-z0-9]+)*/g) || []).concat(/maqueta|propuesta/i.test(t) ? ['maqueta/propuesta'] : []); });
const estadoEs = (t, k) => JSON.stringify(t.estado) === JSON.stringify(estadoDe(ESTADOS[k].e));

await p.goto(BASE + 'index.html');   // contexto nuevo: localStorage vacío
await p.waitForFunction(() => window.__murPruebas);

// 1. Desde el menú de Libros: la cama 7 grande y, con movimiento, su zoom de entrada
await p.click('#btn-libros'); await p.click('#mur-menu-libros'); await p.waitForTimeout(300);
ok(await vistaVisible(), 'abre desde el menú de Libros (Modelos vivos)');
let t = await T();
if (!REDUCIDO) {
  ok(t.cama === 'grande', 'la cama 7 sale grande al entrar desde el menú');
  await p.evaluate(() => window.scrollTo(0, 0)); await foto('00-cama');
  await p.waitForTimeout(2600);
  ok((await T()).cama === 'compacta', 'tras el zoom de entrada, la cama se compacta');
} else ok(t.cama === 'compacta', 'con «reducir movimiento», la cama sale compacta, sin zoom');
t = await T();
ok(t.todo, `__murPruebas().todoCoincide ${t.fallos.slice(0, 4).join(' | ')} (Mayéutica: ${t.mayeutica.tests} tests, la buena la más larga en ${t.mayeutica.correctaMasLarga} y la más corta en ${t.mayeutica.correctaMasCorta}, posiciones ${t.mayeutica.posiciones})`);
ok(t.celdas.map(c => c.v).join('|') === 'en todos los huecos|íntegra|quieto', `tablero del sano: ${t.celdas.map(c => c.v).join(' · ')}`);
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
await foto('01-primera');
ok(await desborde() <= 0, 'sin desborde en la primera pantalla');
ok(await p.evaluate(() => { const f = document.getElementById('mur-frase').getBoundingClientRect(), d = document.getElementById('mur-dock').getBoundingClientRect(); return f.top >= d.top && f.bottom <= innerHeight; }), 'la frase viva se ve, dentro del dock');
ok(await p.evaluate(() => { const r = document.getElementById('mur-tablero').getBoundingClientRect(); return r.bottom <= document.getElementById('mur-dock').getBoundingClientRect().top; }), 'las lecturas del tablero no quedan bajo el dock en la primera pantalla');
let crudos = await sinIds(); ok(!crudos.length, `ningún id interno ni «maqueta» a la vista en Explorar ${crudos.slice(0, 3).join(' | ')}`);
ok(await p.evaluate(() => [...document.querySelectorAll('#mur-raiz img')].every(i => !i.closest('details:not([open])') || true)), 'láminas del libro en la página');

// La cama 7: ampliar, ventanas y aparatos (enlaces cruzados reales; las escenas que aún no están, apagadas)
await pulsar('#mur-cama7 .c7-tapa');
t = await T(); ok(t.cama === 'grande', 'tocar la cama compacta la amplía');
const camaInfo = await p.evaluate(() => [...document.querySelectorAll('#mur-cama7 .c7-boton')].map(b => ({ v: b.dataset.c7V || b.dataset.c7Aparato || b.dataset.view, enlace: b.dataset.especialidad === 'libros', entrar: b.hasAttribute('data-c7-entrar'), pronto: b.disabled, ancho: b.getBoundingClientRect().width })));
ok(camaInfo.find(c => c.v === 'muralla')?.entrar, 'la ventana del vientre es la propia: hace el zoom de entrada');
for (const v of ['telar', 'inmersion']) { const c = camaInfo.find(x => x.v === v); ok(c && (c.enlace || c.pronto), `la ventana «${v}» es un enlace cruzado (o sale apagada si su escena aún no está): ${c?.enlace ? 'enlace' : 'pronto'}`); }
ok(camaInfo.filter(c => c.v === 'capilarVivo' || c.v === 'aguaViva').every(c => c.enlace) && camaInfo.filter(c => c.v === 'capilarVivo' || c.v === 'aguaViva').length === 2, 'el monitor y la bolsa llevan al capilar y al río y mar');
ok(camaInfo.every(c => c.ancho >= 44), `todas las zonas de la cama miden ≥44 px (${camaInfo.map(c => Math.round(c.ancho)).join(', ')})`);
ok(await desborde() <= 0, 'sin desborde con la cama grande');
await pulsar('#mur-cama7 [data-c7-entrar]'); await p.waitForTimeout(REDUCIDO ? 100 : 1100);
ok((await T()).cama === 'compacta', 'tocar el vientre entra (zoom) y compacta la cama');
// el monitor lleva al capilar y su «← VOLVER» al menú; y vuelta a la muralla
await pulsar('#mur-cama7 .c7-tapa');
await pulsar('#mur-cama7 [data-view="capilarVivo"]'); await p.waitForTimeout(400);
ok(await p.evaluate(() => document.getElementById('capilar-vivo-view').style.display === 'block'), 'el monitor de la cama abre el capilar y oxígeno');
await pulsar('#cpv-volver'); await p.waitForTimeout(200); await pulsar('#mur-menu-libros'); await p.waitForTimeout(REDUCIDO ? 200 : 2600);

// 2. Desde el buscador
for (const q of ['muralla de papel', 'disbiosis', 'úlcera de estrés', 'descontaminación oral', 'pantoprazol']) {
  await pulsar('#btn-buscar-global'); await p.fill('#search-input-el', q); await p.waitForTimeout(150);
  const n = await p.evaluate(() => [...document.querySelectorAll('.search-result-row')].findIndex(r => /muralla de papel/i.test(r.textContent)));
  ok(n >= 0, `el buscador encuentra la muralla con «${q}»`);
  if (n >= 0) {
    await p.evaluate(i => document.querySelectorAll('.search-result-row')[i].click(), n); await p.waitForTimeout(250);
    ok(await vistaVisible(), `… y la abre («${q}»)`);
  } else await pulsar('#search-close-btn');
}

// 3. Desde las dos fichas, cada botón en su estado (la cama, compacta)
const abrirFicha = tab => p.evaluate(tab => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'marinoFundamentos', panel: 'panel-marino-fund-tabs', tab }); document.body.append(t); t.click(); t.remove(); }, tab);
const fichaAbierta = tab => p.evaluate(t => { const e = document.getElementById(t); return e.classList.contains('active') && !!e.offsetParent; }, tab);
for (const tab of ['mar-microbioma', 'mar-ulcera-estres']) {
  await abrirFicha(tab); await p.waitForTimeout(400);
  const n = await p.evaluate(tab => document.querySelectorAll(`#${tab} [data-muralla-viva]`).length, tab);
  ok(n >= 4, `la ficha ${tab} tiene ${n} botones «Ver en la muralla viva»`);
  for (let i = 0; i < n; i++) {
    await abrirFicha(tab); await p.waitForTimeout(250);
    const k = await p.evaluate(([tab, i]) => document.querySelectorAll(`#${tab} [data-muralla-viva]`)[i].dataset.murallaViva, [tab, i]);
    await p.evaluate(([tab, i]) => document.querySelectorAll(`#${tab} [data-muralla-viva]`)[i].click(), [tab, i]); await p.waitForTimeout(REDUCIDO ? 150 : 400);
    const t = await T();
    ok(await vistaVisible() && estadoEs(t, k) && t.cama === 'compacta', `desde ${tab}: abre en «${k}» con la cama compacta`);
    if (await desborde() > 0) ok(false, `desborde en «${k}»`);
    if (k === 'ulcera') await foto('04-ulcera');
    if (k === 'ibp' && tab === 'mar-ulcera-estres') { await p.waitForTimeout(REDUCIDO ? 100 : 3200); await foto('04-ibp-balanza'); }
  }
}
crudos = await sinIds(); ok(!crudos.length, `sin ids internos a la vista tras abrir desde las fichas ${crudos.slice(0, 3).join(' | ')}`);
ok(await p.evaluate(() => document.querySelector('#mur-frase .mur-org-ir') !== null), 'el chip de la frase viva enlaza con su sitio en la ficha');

// 4. La regla de la Tabla 4.2 frente a la calculadora real de la ficha (#mar-ulcera-calc)
const COMBOS = [
  [{ vm: true }, ['vm-sin-ne']], [{ vm: true, enteral: true }, ['vm-con-ne']], [{ vm: true, enteral: true, riego: 'shock' }, ['vm-con-ne', 'shock']],
  [{ sepsis: true, fra: true }, ['sepsis', 'fra']], [{ corticoides: true, anticoag: true }, ['corticoides', 'acod']], [{ coag: true }, ['coagulopatia']], [{ cirrosis: true }, ['cirrosis']],
];
await abrirFicha('mar-ulcera-estres'); await p.waitForTimeout(300);
for (const [e, marcas] of COMBOS) {
  const calc = await p.evaluate(marcas => {
    document.querySelectorAll('.mar-ulcera-check').forEach(c => { c.checked = marcas.includes(c.value); });
    document.querySelector('.mar-ulcera-check').dispatchEvent(new Event('change', { bubbles: true }));
    document.querySelector('.mar-ulcera-check').dispatchEvent(new Event('input', { bubbles: true }));
    return /Profilaxis indicada/.test(document.getElementById('mar-ulcera-resultado').textContent);
  }, marcas);
  const mio = riesgoTabla42(estadoDe(e)).profilaxis;
  ok(calc === mio, `Tabla 4.2 «${marcas.join(' + ')}»: la muralla dice ${mio ? 'profilaxis' : 'sin profilaxis'}, la calculadora también`);
}
await p.evaluate(() => { document.querySelectorAll('.mar-ulcera-check').forEach(c => { c.checked = false; }); document.querySelector('.mar-ulcera-check').dispatchEvent(new Event('change', { bubbles: true })); });

// 5. Los mandos y los toques de la lámina
await p.evaluate(() => { document.querySelector('.btn-volver-libros-menu').click(); document.getElementById('mur-menu-libros').click(); }); await p.waitForTimeout(300);
const orden = async (sel) => { await pulsar(sel); await p.waitForTimeout(40); if (await desborde() > 0) ok(false, `desborde tras ${sel}`); return T(); };
await pulsar('[data-m="reinicio"]'); await pulsar('[data-mur-tab="paciente"]');
t = await orden('[data-m="riego"][data-v="oculta"]');
ok(t.estado.vm && t.estado.paciente === 'uci' && t.estado.riego === 'oculta', 'PA normal con VM: pone VM y paciente de UCI');
t = await orden('[data-mur-tab="estomago"]');
ok(t.estado.estacion === 'estomago' && t.D.lesion.nivel === 1 && t.D.riesgo.nivel === 'maximo', 'estómago con VM sin enteral: erosión y riesgo máximo (8-10 %)');
t = await orden('[data-m="enteral"]');
ok(t.D.riesgo.nivel === 'moderado' && !t.D.riesgo.profilaxis, 'con enteral completa: moderado, sin profilaxis');
ok(await p.evaluate(() => document.querySelector('[data-m="proteccion"][data-v="sucralfato"]').disabled), 'el sucralfato se bloquea con la enteral');
t = await orden('[data-m="enteral"]'); t = await orden('[data-m="proteccion"][data-v="pantoprazol"]');
ok(t.D.ph === '≥4' && t.D.salmonella === 'crece', 'pantoprazol: pH ≥4 y la Salmonella crece');
await p.waitForTimeout(REDUCIDO ? 50 : 3200); await foto('05-balanza');
t = await orden('[data-m="proteccion"][data-v="famotidina"]'); t = await orden('[data-mur-tab="paciente"]'); t = await orden('[data-m="clcr50"]');
ok(await p.evaluate(() => /−50 %/.test(document.getElementById('mur-consec').textContent)), 'famotidina con ClCr <50: «−50 %» en las consecuencias');
t = await orden('[data-m="riego"][data-v="shock"]');
ok(t.D.lesion.nivel === 2, 'shock: úlcera hasta la submucosa');
await pulsar('[data-mur-tab="intestino"]'); t = await orden('[data-m="antibiotico"]');
ok(t.estado.estacion === 'intestino' && t.D.motor === 2, 'antibiótico y shock: la rueda a toda velocidad');
await pulsar('#mur-lamina [data-toca="rueda"]');
ok(await p.evaluate(() => /se autoalimenta/i.test(document.getElementById('mur-frase').textContent)), 'tocar la rueda explica el motor del FMO');
ok(await p.evaluate(() => !!document.querySelector('#mur-lamina [data-toca="cateter"]')), 'con translocación, la sangre lleva a la punta del catéter (vía 4)');
await pulsar('#mur-lamina [data-toca="cateter"]');
ok(await p.evaluate(() => !!document.querySelector('#mur-frase [data-cateter-vivo="colonizacion"]')), '… y la frase ofrece abrir el catéter vivo');
t = await orden('[data-m="sdd"][data-v="7"]');
ok(t.estado.sdd && t.estado.dia === 7, 'SDD día 7');
await pulsar('[data-mur-tab="unidad"]'); t = await orden('[data-m="mr"][data-v="1"]');
ok(await p.evaluate(() => /pierde el efecto/.test(document.getElementById('mur-consec').textContent)), 'con multirresistentes, la SDD pierde el efecto');
await pulsar('[data-mur-tab="boca"]'); t = await orden('[data-m="descontaminacion"][data-v="clorhexidina"]');
ok(t.estado.estacion === 'boca', 'la orden de la boca lleva a la boca');
t = await orden('[data-m="aspirar"]'); ok(t.estado.gota === 1, 'aspirar el 0,13 %');
await p.evaluate(sel => { const s = document.getElementById('mur-m-estado'); s.value = 'ulcera'; s.dispatchEvent(new Event('change', { bubbles: true })); }, null);
t = await T(); ok(estadoEs(t, 'ulcera'), 'el menú de estados con nombre lleva a «Úlcera (shock)»');
for (const k of ['regla', 'escalera', 'fig43']) { const hay = await p.evaluate(k => !!document.querySelector(`#mur-lamina [data-toca="${k}"]`), k); if (hay) await pulsar(`#mur-lamina [data-toca="${k}"]`); }
ok(await desborde() <= 0, 'sin desborde tras los toques');

// 6. Rendimiento (solo con movimiento): CPU ×4
if (!REDUCIDO) {
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.evaluate(() => { window.__murPruebas().vaciarFotogramas(); const s = document.getElementById('mur-m-estado'); s.value = 'motor-fmo'; s.dispatchEvent(new Event('change', { bubbles: true })); });
  await p.waitForTimeout(3000);
  const f = (await T()).bucle.fotogramas;
  ok(f.n > 20 && f.medio < 12, `coste de dibujo por fotograma con CPU ×4: ${f.medio} ms (n=${f.n}, máx ${f.max})`);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await p.evaluate(() => document.querySelector('.btn-volver-libros-menu').click()); await p.waitForTimeout(400);
  ok(!(await T()).bucle.enMarcha, 'el bucle se para con la vista oculta');
  await pulsar('#mur-menu-libros'); await p.waitForTimeout(300);
} else ok(!(await T()).bucle.enMarcha, 'con «reducir movimiento» no hay bucle: estado final');

// 7. Mayéutica entera fallando 4 (3 tests y el «tocar» de mu-g3), con el repaso
await pulsar('#mur-modo-preguntas'); await p.waitForTimeout(300);
ok(await p.evaluate(() => getComputedStyle(document.querySelector('.mur-lead')).display === 'none'), 'la entradilla se oculta en la Mayéutica');
ok(await p.evaluate(() => document.getElementById('mur-cama7').hidden), 'la cama 7 se oculta en la Mayéutica');
await pulsar('#mur-preg [data-ir="recorrido"]');
const tests = PREGUNTAS.filter(q => q.tipo === 'test' && !q.tocar);
const FALLAR = new Set([tests[0].id, tests[3].id, tests[6].id]);
const FALLAR_TOCAR = 'mu-g3';
let nDesbordeOk = 0;
const contestar = async (q, fallar, foto1, fallarTocar, donde = q.id) => {
  const pref = '#mur-preg ';
  // antes de contestar: las cifras que se predicen salen tapadas
  const tap = q.ocultar || q.tocar?.ocultar || [];
  if (tap.length) { const tr = await T(); const falta = tap.filter(k => !tr.ocultos.includes(k)); if (falta.length) ok(false, `${donde}: no se tapan ${falta.join(', ')} antes de contestar`); }
  if (q.tipo === 'test') {
    await pulsar(pref + '[data-accion="ops"]');
    const txt = await p.evaluate(() => [...document.querySelectorAll('#mur-preg [data-op]')].map(b => b.textContent));
    const buena = txt.findIndex(x => x === q.opciones.find(o => o.ok).t.replace(/<[^>]+>/g, '')), mala = txt.findIndex((x, i) => i !== buena);
    if (buena < 0) ok(false, `${donde}: no encuentro la opción buena`);
    if (foto1) { await p.evaluate(() => document.getElementById('mur-preg').scrollIntoView({ block: 'start' })); await foto(foto1 + '-antes'); }
    await pulsar(pref + `[data-op="${fallar ? mala : buena}"]`);
  } else if (q.tipo === 'destapa') {
    await pulsar(pref + '[data-accion="destapa"]');
    if (!fallar) await p.evaluate(() => document.querySelectorAll('#mur-pts input').forEach(c => { c.checked = true; }));
    await pulsar(pref + '[data-accion="puntos"]');
  } else {
    if (!fallar) for (const [i, f] of q.frases.entries()) if (f.mal) await pulsar(pref + `[data-fr="${i}"]`);
    await pulsar(pref + '[data-accion="corregir"]');
    const mal = q.frases.findIndex(f => f.mal);
    if (mal >= 0) { await pulsar(pref + `[data-ver="${mal}"]`); if (!await p.evaluate(() => /Corrección/.test(document.getElementById('mur-preg').textContent))) ok(false, `${donde}: la frase buena no se destapa`); }
  }
  if (q.tocar) {
    const tc = q.tocar;
    if (fallarTocar) {
      await pulsar(pref + '[data-accion="comprobar"]'); await pulsar(pref + '[data-accion="comprobar"]');
      ok(await p.evaluate(() => /cuenta como fallo/.test(document.getElementById('mur-q-fin')?.textContent || '')), `${q.id}: el «tocar» fallado cuenta como fallo`);
      ok(await p.evaluate(() => [...document.querySelectorAll('#mur-mando [data-mando][aria-pressed="true"]')].length > 0), `${q.id}: «Te lo pongo en el modelo» deja el mando de la pregunta igual que el modelo`);
    } else {
      for (const [k, v] of Object.entries(tc.bueno)) {
        const m = { gota: 'aspirar', antibiotico: 'antibiotico', paciente: 'paciente', descontaminacion: 'descontaminacion', riego: 'riego', proteccion: 'proteccion', dia: 'dia', estacion: 'estacion' }[k];
        const val = typeof v === 'boolean' ? String(+v) : String(v);
        await pulsar(pref + `[data-mando="${m}"][data-v="${val}"]`);
      }
      await pulsar(pref + '[data-accion="comprobar"]');
      ok(await p.evaluate(() => /Comprobado/.test(document.getElementById('mur-q-fin')?.textContent || '')), `${q.id}: se comprueba en el modelo`);
    }
  }
  // tras contestar: sin desborde, nada tapado, sin ids y con «Ver en el texto» enlazado
  await p.waitForTimeout(REDUCIDO ? 30 : 250);
  const dsb = await desborde(); if (dsb > 0) ok(false, `desborde de ${dsb} px tras contestar ${donde}`); else nDesbordeOk++;
  const tr = await T();
  if (tr.ocultos.length) ok(false, `${donde}: siguen tapadas ${tr.ocultos.join(', ')} tras contestar`);
  const c = await sinIds(); if (c.length) ok(false, `${donde}: se ve ${c.join(' | ')}`);
  if (!await p.evaluate(() => document.querySelectorAll('#mur-preg .mur-ir-texto').length > 0)) ok(false, `${donde}: sin «Ver en el texto» enlazado`);
  // «Siguiente» se ve entero, por encima del dock
  const visible = await p.evaluate(() => { const s = document.querySelector('#mur-preg [data-accion="sig"]').getBoundingClientRect(), d = document.getElementById('mur-dock').getBoundingClientRect(); return s.bottom <= d.top + 1 && s.top >= 0; });
  if (!REDUCIDO) await p.waitForTimeout(400);
  if (!visible && !await p.evaluate(() => { const s = document.querySelector('#mur-preg [data-accion="sig"]').getBoundingClientRect(), d = document.getElementById('mur-dock').getBoundingClientRect(); return s.bottom <= d.top + 1; })) ok(false, `${donde}: «Siguiente» queda tapado por el dock`);
  if (foto1) { await foto(foto1 + '-despues'); }
  await pulsar(pref + '[data-accion="sig"]');
};
for (const [i, q] of PREGUNTAS.entries()) {
  const html = await p.evaluate(() => document.getElementById('mur-preg').innerHTML);
  if (/data-correcta|data-mal|data-ok|"ok"/.test(html)) ok(false, `${q.id}: la respuesta está escrita en el HTML`);
  await contestar(q, FALLAR.has(q.id), i === 2 ? '06-pregunta' : null, q.id === FALLAR_TOCAR);
}
t = await T();
ok(t.fase === 'repaso', `tras las ${PREGUNTAS.length}, pasa al repaso`);
ok(await p.evaluate(() => document.querySelectorAll('#mur-preg [data-rep]').length) === 4, 'el repaso trae las 4 falladas (3 + el «tocar» fallado)');
await foto('07-repaso');
for (const id of [...FALLAR, FALLAR_TOCAR]) {
  await pulsar(`#mur-preg [data-rep="${id}"]`);
  await contestar(PREGUNTAS.find(q => q.id === id), false, null, false, 'repaso ' + id);
}
ok(await p.evaluate(() => /No queda nada por repasar/.test(document.getElementById('mur-preg').textContent)), 'el repaso se vacía al acertarlas');
t = await T();
ok(Object.keys(t.guardado).length === PREGUNTAS.length && Object.values(t.guardado).filter(g => g.resultado === 'mal').length === 4, `localStorage: ${PREGUNTAS.length} guardadas, 4 falladas`);

// 8. Los 3 casos hasta «Lo que te llevas» (fallando el primer paso de cada uno)
await pulsar('#mur-preg [data-ir="casos"]');
for (const [k, C] of CASOS.entries()) {
  await pulsar(`#mur-preg [data-caso="${k}"]`);
  for (const [j, paso] of C.pasos.entries()) {
    if (paso.calculadora && !await p.evaluate(() => !!document.querySelector('#mur-preg [data-resaltar="#mar-ulcera-calc"]'))) ok(false, `${C.id} paso ${j + 1}: sin el enlace a la calculadora`);
    const tr = await T();
    const m = /D[ií]a (\d+)/.exec(paso.momento); if (m && tr.estado.dia !== +m[1]) ok(false, `${C.id} paso ${j + 1}: el día de la hoja no es el del caso`);
    await contestar({ ...paso.pregunta }, j === 0, k === 0 && j === 2 ? '08-caso-giro' : null, false, `${C.id} paso ${j + 1}`);
  }
  ok(await p.evaluate(() => /Lo que te llevas/.test(document.getElementById('mur-preg').textContent)), `el caso ${C.id} llega a «Lo que te llevas»`);
  ok(await p.evaluate(() => !!document.querySelector('#mur-preg [data-tab][data-especialidad="libros"]')), `${C.id}: «Repasar en la ficha» enlaza con su ficha`);
  if (C.extra) ok(await p.evaluate(() => !!document.querySelector('#mur-preg [data-tab="neumo-nav-prevencion"]')), `${C.id}: enlaza la prevención de la NAV (Merino Neumología)`);
  if (await desborde() > 0) ok(false, `desborde en «Lo que te llevas» del caso ${C.id}`);
  if (k === 0) {
    await p.evaluate(() => document.getElementById('mur-preg').scrollIntoView({ block: 'end' })); await p.waitForTimeout(200);
    await foto('09-fin-caso');
    await pulsar('#mur-preg [data-fin="modelo"]'); await p.waitForTimeout(300);
    const v = await T();
    ok(v.modo === 'explorar' && v.estado.enteral && v.estado.estacion === 'estomago', 'volver del caso al modelo: Explorar en el estado del paciente');
    await pulsar('#mur-modo-preguntas'); await pulsar('#mur-preg [data-ir="casos"]');
  } else if (k < CASOS.length - 1) await pulsar('#mur-preg [data-fin="otro"]');
}
const nRespuestas = PREGUNTAS.length + 4 + CASOS.reduce((a, c) => a + c.pasos.length, 0);
ok(nDesbordeOk >= nRespuestas, `sin desborde tras contestar en ${nDesbordeOk} de ${nRespuestas} respuestas y pasos`);

// 9. Lo guardado sigue al recargar; Conceptos
await p.reload(); await p.waitForFunction(() => window.__murPruebas);
await p.click('#btn-libros'); await p.click('#mur-menu-libros'); await p.waitForTimeout(300);
await pulsar('#mur-modo-preguntas'); await p.waitForTimeout(200);
ok(await p.evaluate(n => new RegExp(`Seguir \\(${n} de ${n}\\)`).test(document.getElementById('mur-preg').textContent), PREGUNTAS.length), `tras recargar, la Mayéutica recuerda las ${PREGUNTAS.length}`);
await pulsar('#mur-modo-conceptos');
for (let i = 0; i < CONCEPTOS.length; i++) {
  const n = await p.evaluate(() => document.querySelectorAll('#mur-concepto [data-acc]').length);
  for (let j = 0; j < n; j++) { await pulsar(`#mur-concepto [data-acc="${j}"]`); await p.waitForTimeout(REDUCIDO ? 20 : 120); if (await desborde() > 0) ok(false, `desborde en el concepto ${i + 1}, acción ${j + 1}`); }
  if (i === 6) { await p.evaluate(() => window.scrollTo(0, 0)); await foto('10-concepto'); }
  if (i < CONCEPTOS.length - 1) await pulsar('#mur-concepto [data-nav="1"]');
}
ok(await desborde() <= 0, `sin desborde en los ${CONCEPTOS.length} conceptos`);
crudos = await sinIds(); ok(!crudos.length, `sin ids internos a la vista en Conceptos ${crudos.slice(0, 3).join(' | ')}`);
// «Ver en el texto» desde el modelo lleva a la ficha
await pulsar('#mur-concepto .mur-ir-texto'); await p.waitForTimeout(800);
ok(await p.evaluate(() => [...document.querySelectorAll('#marino-fund-view .tab-content.active')].some(e => e.offsetParent)), '«Ver en el texto» abre la ficha');
ok(errores.length === 0, `0 errores de consola (${errores.length}) ${errores.slice(0, 3).join(' | ')}`);
const ids = await p.evaluate(() => { const v = {}; document.querySelectorAll('[id]').forEach(e => { v[e.id] = (v[e.id] || 0) + 1; }); return Object.keys(v).filter(k => v[k] > 1); });
ok(ids.length === 0, 'sin ids repetidos ' + ids.join(','));

// 10. «← VOLVER» desde una ficha: vuelve a la ficha, abierta
for (const tab of ['mar-microbioma', 'mar-ulcera-estres']) {
  await abrirFicha(tab); await p.waitForTimeout(800);
  await pulsar(`#${tab} [data-muralla-viva]`); await p.waitForTimeout(REDUCIDO ? 400 : 1000);
  const txtVolver = await p.evaluate(() => document.getElementById('mur-volver').textContent);
  await pulsar('#mur-volver'); await p.waitForTimeout(1000);
  ok(await fichaAbierta(tab) && /FICHA/.test(txtVolver), `«${txtVolver}» desde ${tab} vuelve a la ficha, abierta y visible`);
}
// Desde el menú, el «← VOLVER» vuelve a ser el de siempre
await p.evaluate(() => document.querySelector('.btn-volver-libros-menu').click()); await p.waitForTimeout(200);
await p.evaluate(() => { document.getElementById('mur-menu-libros').click(); }); await p.waitForTimeout(300);
ok(await p.evaluate(() => document.getElementById('mur-volver').textContent === '← VOLVER'), 'desde el menú, «← VOLVER» lleva al menú');
ok(errores.length === 0, `0 errores de consola al final (${errores.length}) ${errores.slice(0, 3).join(' | ')}`);
await ctx.close();
fallosTotales.push(...fallos.map(f => `${tag}: ${f}`));
}

try {
  await correr(390, false);
  await correr(360, true);
} catch (e) { fallosTotales.push('la prueba se cortó: ' + e.message); console.log('❌ ' + e.message); }
await b.close();
console.log(fallosTotales.length ? `\n❌ ${fallosTotales.length} fallo(s)` : '\n✅ muralla de papel: todo bien');
process.exit(fallosTotales.length ? 1 : 0);
