// Prueba de navegador de la inmersión (juez de autonomo/jueces.mjs --modelo inmersion-viva).
// Uso: node autonomo/pruebas/inmersion-viva.mjs <url-base> [--capturas <carpeta>]
// Copia la de la muralla (muralla-viva.mjs). Recorre, a 390 px (con movimiento y su medida de rendimiento) y a 360 px
// (con «reducir movimiento»), cada uno en un contexto limpio: la cama 7 (zoom de entrada, compactar, ampliar, sus
// ventanas como enlaces cruzados, y la ventana de la cabeza desde la muralla), los accesos (menú de Libros, buscador y
// los botones de las fichas mar-analgesia y mar-sedacion en su estado), los mandos y los toques de la lámina, la subida
// de la Tabla 6.7 con sus relojes, la voz y el estímulo físico, la Mayéutica entera fallando 4 con su repaso, los 2
// casos hasta «Lo que te llevas», lo guardado tras recargar, Conceptos, «Ver en el texto» y el «← VOLVER» a la ficha.
// Mide el desborde lateral (0 px) tras cada respuesta, el repaso y cada paso de los casos; comprueba que las cifras que
// se predicen salen tapadas, que no se ve ningún id interno y los errores de consola. Sale con código 1 si algo falla.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const { GUIAS, PREGUNTAS, CASOS, CONCEPTOS, ESTADOS, estadoDe } = await import(new URL('../../js/data/inmersion-viva-data.js', import.meta.url));
const { probarGuias } = await import(new URL('./guias-comun.mjs', import.meta.url));
const args = process.argv.slice(2);
const BASE = (args.find(a => /^https?:/.test(a)) || 'http://localhost:8000/').replace(/\/?$/, '/');
const CAPTURAS = args.includes('--capturas') ? args[args.indexOf('--capturas') + 1].replace(/\/?$/, '/') : null;
const b = await chromium.launch();
const fallosTotales = [];
const SEG = ['estimulo', 'prof', 'horas'];
const sinLlamar = e => { const c = { ...e }; delete c.subido; delete c.llamado; return JSON.stringify(c); };

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
const T = () => p.evaluate(() => { const t = window.__inmPruebas(); return { estado: t.estado, D: t.D, modo: t.modo, fase: t.fase, todo: t.todoCoincide, fallos: t.fallos, bucle: t.bucle, guardado: t.guardado, celdas: t.celdas, relojes: t.relojes, ocultos: t.ocultos, mayeutica: t.mayeutica, cama: t.cama }; });
const foto = n => CAPTURAS ? p.screenshot({ path: CAPTURAS + 'inm-' + n + '-' + tag + '.png' }) : null;
const vistaVisible = () => p.evaluate(() => { const v = document.getElementById('inmersion-viva-view'); return v.style.display === 'block' && v.offsetParent !== null && document.getElementById('libros-view').style.display === 'block'; });
const sinIds = () => p.evaluate(() => { const t = document.getElementById('inm-raiz').innerText; return (t.match(/\b(mar|mr|mc|mn)-[a-z0-9]+(-[a-z0-9]+)*/g) || []).concat(/maqueta|propuesta|formas-iones|dolor-oculto|§|caso B3|pregunta 16/i.test(t) ? ['nombre interno'] : []); });
const estadoEs = (t, k) => sinLlamar(t.estado) === sinLlamar(estadoDe(ESTADOS[k].e));
const arriba = () => p.evaluate(() => document.getElementById('inm-raiz').scrollIntoView({ block: 'start' }));

await p.goto(BASE + 'index.html');   // contexto nuevo: localStorage vacío
await p.waitForFunction(() => window.__inmPruebas);

// 1. Desde el menú de Libros: la cama 7 grande y, con movimiento, su zoom de entrada
await p.click('#btn-libros'); await p.click('#btn-libro-marino'); await p.click('#lib-pest-vivos'); await p.click('#inm-menu-libros'); await p.waitForTimeout(300);
ok(await vistaVisible(), 'abre desde el menú de Libros (Modelos vivos)');
let t = await T();
if (!REDUCIDO) {
  ok(t.cama === 'grande', 'la cama 7 sale grande al entrar desde el menú');
  await arriba(); await foto('00-cama');
  await p.waitForTimeout(2600);
  ok((await T()).cama === 'compacta', 'tras el zoom de entrada, la cama se compacta');
} else ok(t.cama === 'compacta', 'con «reducir movimiento», la cama sale compacta, sin zoom');
t = await T();
ok(t.todo, `__inmPruebas().todoCoincide ${t.fallos.slice(0, 4).join(' | ')} (Mayéutica: ${t.mayeutica.tests} tests, la buena la más larga en ${t.mayeutica.correctaMasLarga} y la más corta en ${t.mayeutica.correctaMasCorta}, posiciones ${t.mayeutica.posiciones})`);
ok(t.celdas.map(c => c.v).join('|') === '5|0|81|125/70|—', `tablero en reposo: ${t.celdas.map(c => c.v).join(' · ')}`);
await arriba(); await p.waitForTimeout(300);
await foto('01-primera');
ok(await desborde() <= 0, 'sin desborde en la primera pantalla');
ok(await p.evaluate(() => { const f = document.getElementById('inm-frase').getBoundingClientRect(), d = document.getElementById('inm-dock').getBoundingClientRect(); return f.top >= d.top && f.bottom <= innerHeight; }), 'la frase viva se ve, dentro del dock');
ok(await p.evaluate(() => { const r = document.getElementById('inm-tablero').getBoundingClientRect(); return r.bottom <= document.getElementById('inm-dock').getBoundingClientRect().top; }), 'las lecturas del tablero no quedan bajo el dock en la primera pantalla');
let crudos = await sinIds(); ok(!crudos.length, `ningún id interno ni «maqueta» a la vista en Explorar ${crudos.slice(0, 3).join(' | ')}`);
ok(await p.evaluate(() => { const i = document.querySelector('#inm-libro img'); return !!i && i.complete && i.naturalWidth > 0; }), 'la lámina del libro (Fig. 6.1) se carga');

// La cama 7: ampliar, ventanas y aparatos (enlaces cruzados reales; las escenas que aún no están, apagadas)
await pulsar('#inm-cama7 .c7-tapa');
t = await T(); ok(t.cama === 'grande', 'tocar la cama compacta la amplía');
const camaInfo = await p.evaluate(() => [...document.querySelectorAll('#inm-cama7 .c7-boton')].map(b => ({ v: b.dataset.c7V || b.dataset.c7Aparato || b.dataset.view, enlace: b.dataset.especialidad === 'libros', entrar: b.hasAttribute('data-c7-entrar'), pronto: b.disabled, ancho: b.getBoundingClientRect().width })));
ok(camaInfo.find(c => c.v === 'inmersion')?.entrar, 'la ventana de la cabeza es la propia: hace el zoom de entrada');
ok(camaInfo.find(c => c.v === 'muralla')?.enlace, 'la ventana del vientre lleva a la muralla');
{ const c = camaInfo.find(x => x.v === 'telar'); ok(c && (c.enlace || c.pronto), `la ventana de la pierna es un enlace cruzado (o sale apagada si el telar aún no está): ${c?.enlace ? 'enlace' : 'pronto'}`); }
ok(camaInfo.filter(c => c.v === 'capilarVivo' || c.v === 'aguaViva').every(c => c.enlace) && camaInfo.filter(c => c.v === 'capilarVivo' || c.v === 'aguaViva').length === 2, 'el monitor y la bolsa llevan al capilar y al río y mar');
ok(camaInfo.every(c => c.ancho >= 44), `todas las zonas de la cama miden ≥44 px (${camaInfo.map(c => Math.round(c.ancho)).join(', ')})`);
ok(await desborde() <= 0, 'sin desborde con la cama grande');
await pulsar('#inm-cama7 [data-c7-aparato="respirador"]');
ok(await p.evaluate(() => /adaptación al ventilador/.test(document.getElementById('inm-frase').textContent)), 'el respirador explica la tercera categoría de la BPS');
await pulsar('#inm-cama7 [data-c7-entrar]'); await p.waitForTimeout(REDUCIDO ? 100 : 1100);
ok((await T()).cama === 'compacta', 'tocar la cabeza entra (zoom) y compacta la cama');
// La ventana del vientre abre la muralla y, desde la muralla, la de la cabeza vuelve aquí
await pulsar('#inm-cama7 .c7-tapa');
await pulsar('#inm-cama7 [data-c7-v="muralla"]'); await p.waitForTimeout(500);
ok(await p.evaluate(() => document.getElementById('muralla-viva-view').style.display === 'block'), 'la ventana del vientre abre la muralla de papel');
await pulsar('#mur-cama7 .c7-tapa');
ok(await p.evaluate(() => { const b = document.querySelector('#mur-cama7 [data-c7-v="inmersion"]'); return !!b && !b.disabled && b.dataset.view === 'inmersionViva'; }), 'en la muralla, la ventana de la cabeza ya es un enlace a la inmersión');
await pulsar('#mur-cama7 [data-c7-v="inmersion"]'); await p.waitForTimeout(REDUCIDO ? 300 : 2800);
ok(await vistaVisible(), 'desde la muralla, la ventana de la cabeza abre la inmersión');
await pulsar('#inm-volver'); await p.waitForTimeout(200); await pulsar('#inm-menu-libros'); await p.waitForTimeout(REDUCIDO ? 200 : 2600);

// 2. Desde el buscador
for (const q of ['inmersión', 'escala conductual del dolor', 'propilenglicol', 'síndrome de infusión', 'dexmedetomidina']) {
  await pulsar('#btn-buscar-global'); await p.fill('#search-input-el', q); await p.waitForTimeout(150);
  const n = await p.evaluate(() => [...document.querySelectorAll('.search-result-row')].findIndex(r => /La inmersión/i.test(r.textContent)));
  ok(n >= 0, `el buscador encuentra la inmersión con «${q}»`);
  if (n >= 0) {
    await p.evaluate(i => document.querySelectorAll('.search-result-row')[i].click(), n); await p.waitForTimeout(250);
    ok(await vistaVisible(), `… y la abre («${q}»)`);
  } else await pulsar('#search-close-btn');
}

// 3. Desde las dos fichas, cada botón en su estado (la cama, compacta)
const abrirFicha = tab => p.evaluate(tab => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'marinoFundamentos', panel: 'panel-marino-fund-tabs', tab }); document.body.append(t); t.click(); t.remove(); }, tab);
const fichaAbierta = tab => p.evaluate(t => { const e = document.getElementById(t); return e.classList.contains('active') && !!e.offsetParent; }, tab);
for (const tab of ['mar-analgesia', 'mar-sedacion']) {
  await abrirFicha(tab); await p.waitForTimeout(400);
  const n = await p.evaluate(tab => document.querySelectorAll(`#${tab} [data-inmersion-viva]`).length, tab);
  ok(n >= 5, `la ficha ${tab} tiene ${n} botones «Ver en la inmersión»`);
  for (let i = 0; i < n; i++) {
    await abrirFicha(tab); await p.waitForTimeout(250);
    const k = await p.evaluate(([tab, i]) => document.querySelectorAll(`#${tab} [data-inmersion-viva]`)[i].dataset.inmersionViva, [tab, i]);
    await p.evaluate(([tab, i]) => document.querySelectorAll(`#${tab} [data-inmersion-viva]`)[i].click(), [tab, i]); await p.waitForTimeout(REDUCIDO ? 150 : 400);
    const t = await T();
    ok(await vistaVisible() && estadoEs(t, k) && t.cama === 'compacta', `desde ${tab}: abre en «${k}» con la cama compacta`);
    if (await desborde() > 0) ok(false, `desborde en «${k}»`);
    if (k === 'diazepam') { await p.evaluate(() => document.getElementById('inm-escena-bloque').scrollIntoView({ block: 'start' })); await foto('02-diazepam'); }
    if (k === 'lorazepam-pg') { await p.waitForTimeout(REDUCIDO ? 50 : 1500); await p.evaluate(() => document.getElementById('inm-escena-bloque').scrollIntoView({ block: 'start' })); await foto('03-lorazepam'); }
  }
}
crudos = await sinIds(); ok(!crudos.length, `sin ids internos a la vista tras abrir desde las fichas ${crudos.slice(0, 3).join(' | ')}`);
ok(await p.evaluate(() => document.querySelector('#inm-frase .inm-org-ir') !== null), 'el chip de la frase viva enlaza con su sitio en la ficha');

// 4. Los mandos y los toques de la lámina
await p.evaluate(() => { document.querySelector('.btn-volver-libros-menu').click(); document.getElementById('inm-menu-libros').click(); }); await p.waitForTimeout(300);
const orden = async (sel) => { await pulsar(sel); await p.waitForTimeout(40); if (await desborde() > 0) ok(false, `desborde tras ${sel}`); return T(); };
const tab = k => pulsar(`[data-inm-tab="${k}"]`);
await pulsar('#inm-m-reinicio');
t = await orden('#inm-m-estimulo [data-v="mover"]');
ok(t.D.bps === 9 && t.D.rass === 2 && t.D.fc.v === 82, `moverle: BPS 9, RASS +2 y la FC casi igual (${t.D.bps}, ${t.D.rass}, ${t.D.fc.v})`);
t = await orden('#inm-m-inflamacion');
ok(t.D.bps === 11, 'con inflamación: BPS 11 (hipernocicepción)');
await tab('sedante'); t = await orden('#inm-m-sedante [data-sed="diazepam"]');
ok(t.D.rass === -3 && t.D.bps === 11, 'diazepam: le hunde (RASS −3) y la tormenta sigue (BPS 11)');
ok(await p.evaluate(() => /tormenta sigue/.test(document.getElementById('inm-frase').textContent)), '… y la frase lo dice');
await tab('analgesia'); t = await orden('#inm-m-opioide [data-op="fentanilo"]');
ok(t.D.bps < 6, 'fentanilo: la tormenta se calma (BPS <6)');
await tab('paciente'); t = await orden('#inm-m-renal [data-v="ir"]');
await tab('analgesia'); t = await orden('#inm-m-opioide [data-op="morfina"]');
ok(t.D.av.morfIR && await p.evaluate(() => /−50 %|↓50 %/.test(document.getElementById('inm-frase').textContent + document.getElementById('inm-mar').textContent)), 'morfina con IR: −50 %');
await tab('sedante'); t = await orden('#inm-m-sedante [data-sed="propofol"]'); t = await orden('#inm-m-prof [data-v="profunda"]');
ok(t.D.rass === -4, 'propofol en profunda: RASS −4');
await tab('subida'); t = await orden('#inm-m-sacudir');
ok(await p.evaluate(() => /estímulo físico/.test(document.getElementById('inm-frase').textContent)), 'sacudirle a −4: se mueve con el estímulo físico');
t = await orden('#inm-m-horas [data-v="72"]'); t = await orden('#inm-m-despertar');
ok(t.estado.par && t.estado.subido && t.D.par.map(c => c.t).join() === '34 min,59 h', 'Despertar a las 72 h: dos buzos, 34 min y 59 h');
await p.waitForTimeout(REDUCIDO ? 100 : 8200);
t = await T();
ok(t.relojes.map(r => r.v).join() === '34 min,59 h', `los relojes, al llegar arriba: ${t.relojes.map(r => r.v).join(' · ')}`);
await p.evaluate(() => document.getElementById('inm-escena-bloque').scrollIntoView({ block: 'start' })); await foto('04-despertar');
t = await orden('#inm-m-despertar');
ok(!t.estado.par, '«Volver a sedar» deja un solo buzo');
await tab('sedante'); t = await orden('#inm-m-sedante [data-sed="dexmedetomidina"]');
await tab('subida'); await pulsar('#inm-m-llamar'); await p.waitForTimeout(REDUCIDO ? 50 : 600);
ok(await p.evaluate(() => /sin bajar la perfusión/.test(document.getElementById('inm-frase').textContent)), 'llamarle con dexmedetomidina: se despierta sin bajar la perfusión');
await tab('sedante'); t = await orden('#inm-m-sedante [data-sed="propofol"]'); t = await orden('#inm-m-dosis');
ok(t.D.av.pris && t.D.pa.txt === '↓↓', 'propofol a dosis alta más de 48 h: SIP, con la PA que cae (sin cifra)');
await p.waitForTimeout(REDUCIDO ? 50 : 1200); await p.evaluate(() => document.getElementById('inm-escena-bloque').scrollIntoView({ block: 'start' })); await foto('05-sip');
await tab('delirio'); t = await orden('#inm-m-delirio'); t = await orden('#inm-m-bradi'); t = await orden('#inm-m-halo');
ok(t.D.rass === -1, 'delirio que no tolera la dexmedetomidina + haloperidol: RASS −1');
t = await orden('#inm-m-qtc');
ok(t.D.av.haloBloq && t.D.rass === 3, 'con QTc >500 ms el haloperidol no se usa y sigue agitado');
for (const k of ['regla', 'monitor', 'medallon']) { if (await p.evaluate(k => !!document.querySelector(`#inm-mar [data-toca="${k}"]`), k)) await pulsar(`#inm-mar [data-toca="${k}"]`); }
ok(await p.evaluate(() => /BPS \d+ \(cara/.test(document.getElementById('inm-frase').textContent)), 'tocar el medallón lee la BPS');
await pulsar('#inm-chips-estado [data-estado="lorazepam-pg"]');
t = await T(); ok(estadoEs(t, 'lorazepam-pg') && t.D.av.pg, 'el chip «Lorazepam» lleva al barril que gotea');
ok(await desborde() <= 0, 'sin desborde tras los mandos y los toques');

// 5. Rendimiento (solo con movimiento): CPU ×4
if (!REDUCIDO) {
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.evaluate(() => { window.__inmPruebas().vaciarFotogramas(); document.querySelector('#inm-chips-estado [data-estado="pris"]').click(); });
  await p.waitForTimeout(3000);
  const f = (await T()).bucle.fotogramas;
  ok(f.n > 20 && f.medio < 12, `coste de dibujo por fotograma con CPU ×4: ${f.medio} ms (n=${f.n}, máx ${f.max})`);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await p.evaluate(() => document.querySelector('.btn-volver-libros-menu').click()); await p.waitForTimeout(400);
  ok(!(await T()).bucle.enMarcha, 'el bucle se para con la vista oculta');
  await pulsar('#inm-menu-libros'); await p.waitForTimeout(300);
} else ok(!(await T()).bucle.enMarcha, 'con «reducir movimiento» no hay bucle: estado final');

// 6. Mayéutica entera fallando 4 (3 tests y el «tocar» de in-g4), con el repaso
await pulsar('#inm-modo-preguntas'); await p.waitForTimeout(300);
ok(await p.evaluate(() => getComputedStyle(document.querySelector('.inm-lead')).display === 'none'), 'la entradilla se oculta en la Mayéutica');
ok(await p.evaluate(() => document.getElementById('inm-cama7').hidden), 'la cama 7 se oculta en la Mayéutica');
await pulsar('#inm-preg [data-ir="recorrido"]');
const tests = PREGUNTAS.filter(q => q.tipo === 'test' && !q.tocar);
const FALLAR = new Set([tests[0].id, tests[2].id, tests[5].id]);
const FALLAR_TOCAR = 'in-g4';
let nDesbordeOk = 0;
const contestar = async (q, fallar, foto1, fallarTocar, donde = q.id, elegir = null) => {
  const pref = '#inm-preg ';
  // antes de contestar: las cifras que se predicen salen tapadas (también en el tablero)
  const tap = q.ocultar || q.tocar?.ocultar || [];
  if (tap.length) {
    const tr = await T(); const falta = tap.filter(k => !tr.ocultos.includes(k)); if (falta.length) ok(false, `${donde}: no se tapan ${falta.join(', ')} antes de contestar`);
    const enTablero = tap.filter(k => ['bps', 'rass', 'fc', 'pa', 'reloj'].includes(k));
    const nombre = { bps: 'BPS', rass: 'RASS', fc: 'FC', pa: 'PA', reloj: 'Despertar' };
    for (const k of enTablero) if (tr.celdas.find(c => c.k === nombre[k])?.v !== '?') ok(false, `${donde}: la celda ${nombre[k]} enseña la cifra antes de contestar`);
  }
  if (q.tipo === 'test') {
    await pulsar(pref + '[data-accion="ops"]');
    const txt = await p.evaluate(() => [...document.querySelectorAll('#inm-preg [data-op]')].map(b => b.textContent));
    const buena = txt.findIndex(x => x === q.opciones.find(o => o.ok).t.replace(/<[^>]+>/g, '')), mala = txt.findIndex((x, i) => i !== buena);
    if (buena < 0) ok(false, `${donde}: no encuentro la opción buena`);
    if (foto1) { await p.evaluate(() => document.getElementById('inm-preg').scrollIntoView({ block: 'start' })); await foto(foto1 + '-antes'); }
    const otra = elegir ? txt.findIndex(x => x === elegir.replace(/<[^>]+>/g, '')) : -1;
    if (elegir && otra < 0) ok(false, `${donde}: no encuentro la opción «${elegir}»`);
    await pulsar(pref + `[data-op="${elegir ? otra : fallar ? mala : buena}"]`);
  } else if (q.tipo === 'destapa') {
    await pulsar(pref + '[data-accion="destapa"]');
    if (!fallar) await p.evaluate(() => document.querySelectorAll('#inm-pts input').forEach(c => { c.checked = true; }));
    await pulsar(pref + '[data-accion="puntos"]');
  } else {
    if (!fallar) for (const [i, f] of q.frases.entries()) if (f.mal) await pulsar(pref + `[data-fr="${i}"]`);
    await pulsar(pref + '[data-accion="corregir"]');
    const mal = q.frases.findIndex(f => f.mal);
    if (mal >= 0) { await pulsar(pref + `[data-ver="${mal}"]`); if (!await p.evaluate(() => /Corrección/.test(document.getElementById('inm-preg').textContent))) ok(false, `${donde}: la frase buena no se destapa`); }
  }
  if (q.tocar) {
    const tc = q.tocar;
    if (fallarTocar) {
      await pulsar(pref + '[data-accion="comprobar"]'); await pulsar(pref + '[data-accion="comprobar"]');
      ok(await p.evaluate(() => /cuenta como fallo/.test(document.getElementById('inm-q-fin')?.textContent || '')), `${q.id}: el «tocar» fallado cuenta como fallo`);
      ok(await p.evaluate(() => [...document.querySelectorAll('#inm-mando [data-mando][aria-pressed="true"]')].length > 0), `${q.id}: «Te lo pongo en el modelo» deja el mando de la pregunta igual que el modelo`);
    } else {
      for (const [k, v] of Object.entries(tc.bueno)) if (SEG.includes(k)) await pulsar(pref + `[data-mando="seg"][data-k="${k}"][data-v="${v}"]`);
      for (const [i] of (tc.botones || []).entries()) { await pulsar(pref + `[data-mando="boton"][data-i="${i}"]`); await p.waitForTimeout(REDUCIDO ? 20 : 120); }
      await pulsar(pref + '[data-accion="comprobar"]');
      ok(await p.evaluate(() => /Comprobado/.test(document.getElementById('inm-q-fin')?.textContent || '')), `${q.id}: se comprueba en el modelo`);
    }
  }
  // tras contestar: sin desborde, nada tapado, sin ids y con «Ver en el texto» enlazado
  await p.waitForTimeout(REDUCIDO ? 30 : 250);
  const dsb = await desborde(); if (dsb > 0) ok(false, `desborde de ${dsb} px tras contestar ${donde}`); else nDesbordeOk++;
  const tr = await T();
  if (tr.ocultos.length) ok(false, `${donde}: siguen tapadas ${tr.ocultos.join(', ')} tras contestar`);
  const c = await sinIds(); if (c.length) ok(false, `${donde}: se ve ${c.join(' | ')}`);
  if (!await p.evaluate(() => document.querySelectorAll('#inm-preg .cita-ir[data-resaltar]').length > 0)) ok(false, `${donde}: sin «Ver en la ficha» al párrafo`);
  // «Siguiente» se ve entero, por encima del dock
  if (!REDUCIDO) await p.waitForTimeout(400);
  if (!await p.evaluate(() => { const s = document.querySelector('#inm-preg [data-accion="sig"]').getBoundingClientRect(), d = document.getElementById('inm-dock').getBoundingClientRect(); return s.bottom <= d.top + 1; })) ok(false, `${donde}: «Siguiente» queda tapado por el dock`);
  if (foto1) await foto(foto1 + '-despues');
  if (antesDeSeguir) { const f = antesDeSeguir; antesDeSeguir = null; await f(); }
  await pulsar(pref + '[data-accion="sig"]');
};
let antesDeSeguir = null;   // una comprobación extra antes de «Siguiente» (la caja de la consecuencia)
for (const [i, q] of PREGUNTAS.entries()) {
  const html = await p.evaluate(() => document.getElementById('inm-preg').innerHTML);
  if (/data-correcta|data-mal|data-ok|"ok"/.test(html)) ok(false, `${q.id}: la respuesta está escrita en el HTML`);
  await contestar(q, FALLAR.has(q.id), i === 0 ? '06-pregunta' : null, q.id === FALLAR_TOCAR);
}
t = await T();
ok(t.fase === 'repaso', `tras las ${PREGUNTAS.length}, pasa al repaso`);
ok(await p.evaluate(() => document.querySelectorAll('#inm-preg [data-rep]').length) === 4, 'el repaso trae las 4 falladas (3 + el «tocar» fallado)');
await foto('07-repaso');
for (const id of [...FALLAR, FALLAR_TOCAR]) {
  await pulsar(`#inm-preg [data-rep="${id}"]`);
  await contestar(PREGUNTAS.find(q => q.id === id), false, null, false, 'repaso ' + id);
}
ok(await p.evaluate(() => /No queda nada por repasar/.test(document.getElementById('inm-preg').textContent)), 'el repaso se vacía al acertarlas');
t = await T();
ok(Object.keys(t.guardado).length === PREGUNTAS.length && Object.values(t.guardado).filter(g => g.resultado === 'mal').length === 4, `localStorage: ${PREGUNTAS.length} guardadas, 4 falladas`);

// 7. Los 2 casos hasta «Lo que te llevas» (fallando el primer paso de cada uno)
await pulsar('#inm-preg [data-ir="casos"]');
ok(await p.evaluate(() => !!document.querySelector('#inm-preg [data-capilar-vivo="sepsis"]')), 'la entrada del caso del capilar enlaza con el capilar vivo');
for (const [k, C] of CASOS.entries()) {
  await pulsar(`#inm-preg [data-caso="${k}"]`);
  for (const [j, paso] of C.pasos.entries()) {
    if (paso.calculadora && !await p.evaluate(id => !!document.querySelector(`#inm-preg [data-resaltar="#${id}"]`), paso.calculadora.ir)) ok(false, `${C.id} paso ${j + 1}: sin el enlace a la calculadora`);
    await contestar({ ...paso.pregunta, estado: paso.estado }, j === 0, k === 0 && j === 5 ? '08-caso-giro' : null, false, `${C.id} paso ${j + 1}`);
  }
  ok(await p.evaluate(() => /Lo que te llevas/.test(document.getElementById('inm-preg').textContent)), `el caso ${C.id} llega a «Lo que te llevas»`);
  ok(await p.evaluate(() => !!document.querySelector('#inm-preg [data-tab][data-especialidad="libros"]')), `${C.id}: «Repasar en la ficha» enlaza con su ficha`);
  if (await desborde() > 0) ok(false, `desborde en «Lo que te llevas» del caso ${C.id}`);
  if (k === 0) {
    await p.evaluate(() => document.getElementById('inm-preg').scrollIntoView({ block: 'end' })); await p.waitForTimeout(200);
    await foto('09-fin-caso');
    await pulsar('#inm-preg [data-fin="modelo"]'); await p.waitForTimeout(300);
    const v = await T();
    ok(v.modo === 'explorar' && v.estado.sedante === 'propofol' && v.estado.renal === 'ir', 'volver del caso al modelo: Explorar en el estado del paciente');
    await pulsar('#inm-modo-preguntas'); await pulsar('#inm-preg [data-ir="casos"]');
  } else if (k < CASOS.length - 1) await pulsar('#inm-preg [data-fin="otro"]');
}
// 7b. La revisión por objetivos al cerrar el caso (core/mayeutica-motor.js). Del recorrido de arriba (falló el paso 1
// de cada caso): el objetivo que depende del paso 1 sale ✗ con su porqué; los demás, ✓.
const objetivosFin = () => p.evaluate(() => [...document.querySelectorAll('#inm-preg [data-objetivo]')].map(li => ({ id: li.dataset.objetivo, ok: li.dataset.cumplido === 'true', txt: li.textContent.replace(/\s+/g, ' ').trim(), cita: !!li.querySelector('.cita-ir[data-resaltar]') })));
let ob = await objetivosFin();
const E8 = CASOS.find(c => c.id === 'E8');
ok(ob.length === E8.objetivos.length && ob.every(o => o.cita), `E8: revisión por objetivos con ${ob.length} objetivos, cada uno con «Ver en la ficha»`);
ok(ob.find(o => o.id === 'despertar')?.ok === false && /✗ Falta/.test(ob.find(o => o.id === 'despertar').txt) && /paso 1/.test(ob.find(o => o.id === 'despertar').txt), 'E8 (paso 1 fallado): «despertar» ✗ con su porqué y el paso');
ok(ob.filter(o => o.id !== 'despertar').every(o => o.ok && /✓ Cumplido/.test(o.txt)), 'E8: los demás objetivos ✓');
ok(await p.evaluate(() => { const t = document.getElementById('inm-preg').textContent; return t.indexOf('Revisión por objetivos') < t.indexOf('Lo que te llevas') && !/\d+ de \d+|%/.test(document.querySelector('#inm-preg .inm-objetivos').textContent.replace(/\d+ (h|min|mg|mL)/g, '')); }), 'E8: los objetivos van arriba de «Lo que te llevas», sin nota ni recuento');
const E4 = CASOS[0];
const recorrerE4 = async (tag, elegir = {}) => {
  await pulsar('#inm-preg [data-fin="otro"]'); await pulsar('#inm-preg [data-caso="0"]');
  for (const [j, paso] of E4.pasos.entries()) await contestar({ ...paso.pregunta, estado: paso.estado }, false, null, false, `${tag} paso ${j + 1}`, elegir[j] || null);
};
// Todo bien: todos ✓
await recorrerE4('E4 todo bien');
ob = await objetivosFin();
ok(ob.length === E4.objetivos.length && ob.every(o => o.ok && /✓ Cumplido/.test(o.txt)), `E4 todo bien: los ${ob.length} objetivos ✓ (${ob.filter(o => !o.ok).map(o => o.id).join(', ')})`);
// La opción con consecuencia: midazolam en el delirio (paso 5) → el modelo pasa a la esponja >48 h y sale la caja
const iCons = E4.pasos.findIndex(pa => pa.pregunta.opciones?.some(o => o.consecuencia));
const opCons = E4.pasos[iCons].pregunta.opciones.find(o => o.consecuencia);
const vigilar = async () => {
  const v = await T();
  ok(v.estado.sedante === 'midazolam' && v.estado.horas === 72 && v.D.rass === -3 && v.D.av.midaz, `consecuencia: el modelo pasa al midazolam >48 h (RASS ${v.D.rass}, sedante ${v.estado.sedante})`);
  const caja = await p.evaluate(() => { const c = document.querySelector('#inm-preg .inm-consecuencia'); return c && { txt: c.textContent, cita: !!c.querySelector('.cita-ir[data-resaltar]'), visible: c.offsetParent !== null }; });
  ok(caja && caja.visible && /⚠ Lo que acaba de pasar/.test(caja.txt) && caja.cita, 'consecuencia: sale la caja «⚠ Lo que acaba de pasar» con «Ver en la ficha»');
  await p.evaluate(() => document.querySelector('#inm-preg .inm-consecuencia').scrollIntoView({ block: 'center' })); await foto('09b-consecuencia');
};
// contestar() llama a antesDeSeguir justo antes de «Siguiente» del paso con la consecuencia
await pulsar('#inm-preg [data-fin="otro"]'); await pulsar('#inm-preg [data-caso="0"]');
for (const [j, paso] of E4.pasos.entries()) {
  if (j === iCons) antesDeSeguir = vigilar;
  await contestar({ ...paso.pregunta, estado: paso.estado }, false, null, false, `E4 consecuencia paso ${j + 1}`, j === iCons ? opCons.t : null);
  if (j === iCons) {
    const v = await T();
    ok(v.estado.sedante === E4.pasos[iCons + 1].estado.sedante && v.estado.bradi === true, `al pasar al paso siguiente, el modelo vuelve a su estado (${v.estado.sedante})`);
  }
}
ob = await objetivosFin();
const del = ob.find(o => o.id === 'delirio'), rass = ob.find(o => o.id === 'rass');
ok(del && !del.ok && /✗ Falta/.test(del.txt) && new RegExp(`paso ${iCons + 1}`).test(del.txt) && /⚠ Lo que pasó/.test(del.txt), 'E4 con midazolam: «delirio» ✗ con su porqué, el paso y la consecuencia');
ok(rass && !rass.ok, 'E4 con midazolam: «RASS objetivo» ✗ (comparte el paso)');
ok(ob.filter(o => !['delirio', 'rass'].includes(o.id)).every(o => o.ok), 'E4 con midazolam: los demás objetivos ✓');
await p.evaluate(() => document.querySelector('#inm-preg .inm-objetivos').scrollIntoView({ block: 'start' })); await foto('09c-objetivos');
if (await desborde() > 0) ok(false, 'desborde en la revisión por objetivos');
crudos = await sinIds(); if (crudos.length) ok(false, `revisión por objetivos: se ve ${crudos.join(' | ')}`);

const nRespuestas = PREGUNTAS.length + 4 + CASOS.reduce((a, c) => a + c.pasos.length, 0);
ok(nDesbordeOk >= nRespuestas, `sin desborde tras contestar en ${nDesbordeOk} de ${nRespuestas} respuestas y pasos`);

// 8. Lo guardado sigue al recargar; Conceptos
await p.reload(); await p.waitForFunction(() => window.__inmPruebas);
await p.click('#btn-libros'); await p.click('#btn-libro-marino'); await p.click('#lib-pest-vivos'); await p.click('#inm-menu-libros'); await p.waitForTimeout(300);
await pulsar('#inm-modo-preguntas'); await p.waitForTimeout(200);
ok(await p.evaluate(n => new RegExp(`Seguir \\(${n} de ${n}\\)`).test(document.getElementById('inm-preg').textContent), PREGUNTAS.length), `tras recargar, la Mayéutica recuerda las ${PREGUNTAS.length}`);
await pulsar('#inm-modo-conceptos');
for (let i = 0; i < CONCEPTOS.length; i++) {
  const n = await p.evaluate(() => document.querySelectorAll('#inm-concepto [data-acc]').length);
  for (let j = 0; j < n; j++) { await pulsar(`#inm-concepto [data-acc="${j}"]`); await p.waitForTimeout(REDUCIDO ? 20 : 120); if (await desborde() > 0) ok(false, `desborde en el concepto ${i + 1}, acción ${j + 1}`); }
  if (i === 7) { await p.waitForTimeout(REDUCIDO ? 50 : 2500); await p.evaluate(() => window.scrollTo(0, 0)); await arriba(); await foto('10-concepto'); }
  if (i < CONCEPTOS.length - 1) await pulsar('#inm-concepto [data-nav="1"]');
}
ok(await desborde() <= 0, `sin desborde en los ${CONCEPTOS.length} conceptos`);
crudos = await sinIds(); ok(!crudos.length, `sin ids internos a la vista en Conceptos ${crudos.slice(0, 3).join(' | ')}`);
// «Ver en el texto» desde el modelo lleva a la ficha
await pulsar('#inm-concepto .cita-ir'); await p.waitForTimeout(800);
ok(await p.evaluate(() => [...document.querySelectorAll('#marino-fund-view .tab-content.active')].some(e => e.offsetParent)), '«Ver en el texto» abre la ficha');
ok(errores.length === 0, `0 errores de consola (${errores.length}) ${errores.slice(0, 3).join(' | ')}`);
const ids = await p.evaluate(() => { const v = {}; document.querySelectorAll('[id]').forEach(e => { v[e.id] = (v[e.id] || 0) + 1; }); return Object.keys(v).filter(k => v[k] > 1); });
ok(ids.length === 0, 'sin ids repetidos ' + ids.join(','));

// 9. «← VOLVER» desde una ficha: vuelve a la ficha, abierta
for (const tab of ['mar-analgesia', 'mar-sedacion']) {
  await abrirFicha(tab); await p.waitForTimeout(800);
  await pulsar(`#${tab} [data-inmersion-viva]`); await p.waitForTimeout(REDUCIDO ? 400 : 1000);
  const txtVolver = await p.evaluate(() => document.getElementById('inm-volver').textContent);
  await pulsar('#inm-volver'); await p.waitForTimeout(1000);
  ok(await fichaAbierta(tab) && /FICHA/.test(txtVolver), `«${txtVolver}» desde ${tab} vuelve a la ficha, abierta y visible`);
}
// Desde el menú, el «← VOLVER» vuelve a ser el de siempre
await p.evaluate(() => document.querySelector('.btn-volver-libros-menu').click()); await p.waitForTimeout(200);
await p.evaluate(() => { document.getElementById('inm-menu-libros').click(); }); await p.waitForTimeout(300);
ok(await p.evaluate(() => document.getElementById('inm-volver').textContent === '← VOLVER'), 'desde el menú, «← VOLVER» lleva al menú');
ok(errores.length === 0, `0 errores de consola al final (${errores.length}) ${errores.slice(0, 3).join(' | ')}`);
// La explicación guiada (guias-comun.mjs): dos enteras, la forma de todas y cada «Ver en la ficha» a un párrafo que existe
await probarGuias({ p, ok, pre: 'inm', view: 'inmersionViva', attr: 'inmersionViva', GUIAS, recorrer: ['dolor-oculto', 'despertar'], foto, desborde, REDUCIDO });
await ctx.close();
fallosTotales.push(...fallos.map(f => `${tag}: ${f}`));
}

try {
  await correr(390, false);
  await correr(360, true);
} catch (e) { fallosTotales.push('la prueba se cortó: ' + e.message); console.log('❌ ' + e.message); }
await b.close();
console.log(fallosTotales.length ? `\n❌ ${fallosTotales.length} fallo(s)` : '\n✅ la inmersión: todo bien');
process.exit(fallosTotales.length ? 1 : 0);
