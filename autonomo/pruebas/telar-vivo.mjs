// Prueba de navegador del telar de la trombina (juez de autonomo/jueces.mjs --modelo telar-vivo).
// Uso: node autonomo/pruebas/telar-vivo.mjs <url-base> [--capturas <carpeta>]
// Copia la de la muralla de papel (muralla-viva.mjs). Recorre, a 390 px (con movimiento y su medida de rendimiento) y a
// 360 px (con «reducir movimiento»), cada uno en un contexto limpio: la cama 7 (zoom de entrada, compactar, ampliar y
// sus ventanas como enlaces cruzados; desde la muralla, la ventana de la pierna abre el telar), los accesos (menú de
// Libros, buscador y los botones de las fichas mar-tromboprofilaxis-farmacos y -escenarios en su estado), la lógica de
// la dosis frente a la calculadora real de la ficha (#mar-profilaxis-calc), los mandos y los toques de la lámina, los
// rótulos de la lámina (≥8 px), la Mayéutica entera fallando 4 con su repaso, los 3 casos hasta «Lo que te llevas», lo
// guardado tras recargar, Conceptos, «Ver en el texto» y el «← VOLVER» a la ficha. Mide el desborde lateral (0 px) tras
// cada respuesta, el repaso y cada paso de los casos; comprueba que las cifras que se predicen salen tapadas, que no se
// ve ningún id interno y los errores de consola. Sale con código 1 si algo falla.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const { GUIAS, PREGUNTAS, CASOS, CONCEPTOS, ESTADOS, profilaxis, estadoDe } = await import(new URL('../../js/data/telar-vivo-data.js', import.meta.url));
const { probarGuias } = await import(new URL('./guias-comun.mjs', import.meta.url));
const args = process.argv.slice(2);
const BASE = (args.find(a => /^https?:/.test(a)) || 'http://localhost:8000/').replace(/\/?$/, '/');
const CAPTURAS = args.includes('--capturas') ? args[args.indexOf('--capturas') + 1].replace(/\/?$/, '/') : null;
const b = await chromium.launch();
const fallosTotales = [];
const FICHAS = ['mar-tromboprofilaxis-farmacos', 'mar-tromboprofilaxis-escenarios'];

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
const T = () => p.evaluate(() => { const t = window.__telPruebas(); return { estado: t.estado, D: t.D, modo: t.modo, fase: t.fase, todo: t.todoCoincide, fallos: t.fallos, bucle: t.bucle, guardado: t.guardado, celdas: t.celdas, ocultos: t.ocultos, mayeutica: t.mayeutica, cama: t.cama, rotuloMin: t.rotuloMin }; });
const foto = n => CAPTURAS ? p.screenshot({ path: CAPTURAS + 'tel-' + n + '-' + tag + '.png' }) : null;
const vistaVisible = (id = 'telar-vivo-view') => p.evaluate(id => { const v = document.getElementById(id); return v.style.display === 'block' && v.offsetParent !== null && document.getElementById('libros-view').style.display === 'block'; }, id);
const sinIds = () => p.evaluate(() => { const t = document.getElementById('tel-raiz').innerText; return (t.match(/\b(mar|mr|mc)-[a-z0-9]+(-[a-z0-9]+)*/g) || []).concat(/maqueta|propuesta de forma|son propuestas/i.test(t) ? ['maqueta/propuesta'] : []); });
const estadoEs = (t, k) => JSON.stringify(t.estado) === JSON.stringify(estadoDe(ESTADOS[k].e));

await p.goto(BASE + 'index.html');   // contexto nuevo: localStorage vacío
await p.waitForFunction(() => window.__telPruebas);

// 1. Desde el menú de Libros: la cama 7 grande y, con movimiento, su zoom de entrada
await p.click('#btn-libros'); await p.click('#btn-libro-marino'); await p.click('#lib-pest-vivos'); await p.click('#tel-menu-libros'); await p.waitForTimeout(300);
ok(await vistaVisible(), 'abre desde el menú de Libros (Modelos vivos)');
let t = await T();
if (!REDUCIDO) {
  ok(t.cama === 'grande', 'la cama 7 sale grande al entrar desde el menú');
  await p.evaluate(() => window.scrollTo(0, 0)); await foto('00-cama');
  await p.waitForTimeout(2600);
  ok((await T()).cama === 'compacta', 'tras el zoom de entrada, la cama se compacta');
} else ok(t.cama === 'compacta', 'con «reducir movimiento», la cama sale compacta, sin zoom');
t = await T();
ok(t.todo, `__telPruebas().todoCoincide ${t.fallos.slice(0, 4).join(' | ')} (Mayéutica: ${t.mayeutica.tests} tests, la buena la más larga en ${t.mayeutica.correctaMasLarga} y la más corta en ${t.mayeutica.correctaMasCorta}, posiciones ${t.mayeutica.posiciones})`);
ok(t.celdas.map(c => c.v).join('|') === '100 %|quieta|6, dormidas', `tablero del sano: ${t.celdas.map(c => c.v).join(' · ')}`);
ok(t.rotuloMin >= 8, `los rótulos de la lámina miden 8 o más (mínimo ${t.rotuloMin})`);
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
await foto('01-primera');
ok(await desborde() <= 0, 'sin desborde en la primera pantalla');
ok(await p.evaluate(() => { const f = document.getElementById('tel-frase').getBoundingClientRect(), d = document.getElementById('tel-dock').getBoundingClientRect(); return f.top >= d.top && f.bottom <= innerHeight; }), 'la frase viva se ve, dentro del dock');
ok(await p.evaluate(() => { const r = document.getElementById('tel-tablero').getBoundingClientRect(); return r.bottom <= document.getElementById('tel-dock').getBoundingClientRect().top; }), 'las lecturas del tablero no quedan bajo el dock en la primera pantalla');
let crudos = await sinIds(); ok(!crudos.length, `ningún id interno ni «maqueta» a la vista en Explorar ${crudos.slice(0, 3).join(' | ')}`);

// La cama 7: ampliar, ventanas y aparatos (enlaces cruzados reales)
await pulsar('#tel-cama7 .c7-tapa');
t = await T(); ok(t.cama === 'grande', 'tocar la cama compacta la amplía');
const camaInfo = await p.evaluate(() => [...document.querySelectorAll('#tel-cama7 .c7-boton')].map(b => ({ v: b.dataset.c7V || b.dataset.c7Aparato || b.dataset.view, enlace: b.dataset.especialidad === 'libros', entrar: b.hasAttribute('data-c7-entrar'), pronto: b.disabled, ancho: b.getBoundingClientRect().width })));
ok(camaInfo.find(c => c.v === 'telar')?.entrar, 'la ventana de la pierna es la propia: hace el zoom de entrada');
for (const v of ['muralla', 'inmersion']) { const c = camaInfo.find(x => x.v === v); ok(c && (c.enlace || c.pronto), `la ventana «${v}» es un enlace cruzado (o sale apagada si su escena aún no está): ${c?.enlace ? 'enlace' : 'pronto'}`); }
ok(camaInfo.every(c => c.ancho >= 44), `todas las zonas de la cama miden ≥44 px (${camaInfo.map(c => Math.round(c.ancho)).join(', ')})`);
await pulsar('#tel-cama7 [data-c7-entrar]'); await p.waitForTimeout(REDUCIDO ? 100 : 1100);
ok((await T()).cama === 'compacta', 'tocar la pierna entra (zoom) y compacta la cama');
// Desde la muralla, la ventana de la pierna abre el telar; y desde el telar, la del vientre abre la muralla
await pulsar('#tel-cama7 .c7-tapa'); await pulsar('#tel-cama7 [data-view="murallaViva"]'); await p.waitForTimeout(REDUCIDO ? 300 : 2800);
ok(await vistaVisible('muralla-viva-view'), 'la ventana del vientre (desde el telar) abre la muralla de papel');
await pulsar('#mur-cama7 .c7-tapa'); await pulsar('#mur-cama7 [data-view="telarVivo"]'); await p.waitForTimeout(REDUCIDO ? 300 : 400);
ok(await vistaVisible(), 'desde la muralla, la ventana de la pierna abre el telar de la trombina');
if (!REDUCIDO) await p.waitForTimeout(2400);

// 2. Desde el buscador
for (const q of ['telar de la trombina', 'trombocitopenia inducida', 'compresión neumática', 'inmovilidad estasis', 'punción neuroaxial']) {
  await pulsar('#btn-buscar-global'); await p.fill('#search-input-el', q); await p.waitForTimeout(150);
  const n = await p.evaluate(() => [...document.querySelectorAll('.search-result-row')].findIndex(r => /telar de la trombina/i.test(r.textContent)));
  ok(n >= 0, `el buscador encuentra el telar con «${q}»`);
  if (n >= 0) { await p.evaluate(i => document.querySelectorAll('.search-result-row')[i].click(), n); await p.waitForTimeout(250); ok(await vistaVisible(), `… y lo abre («${q}»)`); }
  else await pulsar('#search-close-btn');
}

// 3. Desde las dos fichas, cada botón en su estado (la cama, compacta)
const abrirFicha = tab => p.evaluate(tab => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'marinoFundamentos', panel: 'panel-marino-fund-tabs', tab }); document.body.append(t); t.click(); t.remove(); }, tab);
const fichaAbierta = tab => p.evaluate(t => { const e = document.getElementById(t); return e.classList.contains('active') && !!e.offsetParent; }, tab);
for (const tab of FICHAS) {
  await abrirFicha(tab); await p.waitForTimeout(400);
  const n = await p.evaluate(tab => [...document.querySelectorAll(`#${tab} [data-telar-vivo]`)].filter(b => !b.closest('.vista-estudiar, .vista-visual')).length, tab);
  ok(n >= 5, `la ficha ${tab} tiene ${n} botones «Ver en el telar vivo»`);
  for (let i = 0; i < n; i++) {
    await abrirFicha(tab); await p.waitForTimeout(250);
    const k = await p.evaluate(([tab, i]) => [...document.querySelectorAll(`#${tab} [data-telar-vivo]`)].filter(b => !b.closest('.vista-estudiar, .vista-visual'))[i].dataset.telarVivo, [tab, i]);
    await p.evaluate(([tab, i]) => [...document.querySelectorAll(`#${tab} [data-telar-vivo]`)].filter(b => !b.closest('.vista-estudiar, .vista-visual'))[i].click(), [tab, i]); await p.waitForTimeout(REDUCIDO ? 150 : 450);
    const tt = await T();
    ok(await vistaVisible() && estadoEs(tt, k) && tt.cama === 'compacta', `desde ${tab}: abre en «${k}» con la cama compacta`);
    if (await desborde() > 0) ok(false, `desborde en «${k}»`);
    if (k === 'tih') { await p.waitForTimeout(REDUCIDO ? 50 : 4000); await foto('04-tih'); }
    if (k === 'cni-diastolica') await foto('04-cni-diastolica');
    if (k === 'neuroeje') await foto('04-reloj');
  }
}
crudos = await sinIds(); ok(!crudos.length, `sin ids internos a la vista tras abrir desde las fichas ${crudos.slice(0, 3).join(' | ')}`);
ok(await p.evaluate(() => document.querySelector('#tel-frase .tel-org-ir') !== null), 'el chip de la frase viva enlaza con su sitio en la ficha');

// 4. La lógica de la dosis frente a la calculadora real de la ficha (#mar-profilaxis-calc)
await abrirFicha('mar-tromboprofilaxis-farmacos'); await p.waitForTimeout(300);
let iguales = 0, distintas = [];
for (const f of ['hnf', 'enoxaparina', 'dalteparina', 'fondaparinux', 'dabigatran', 'apixaban', 'rivaroxaban', 'warfarina'])
  for (const clcr of [90, 50, 40, 32, 25, 18, 12]) for (const imc of [25, 42]) {
    const calc = await p.evaluate(([f, clcr, imc]) => {
      const s = document.getElementById('mar-profilaxis-farmaco'); s.value = f; s.dispatchEvent(new Event('change', { bubbles: true }));
      for (const [id, v] of [['mar-profilaxis-clcr', clcr], ['mar-profilaxis-imc', imc]]) { const e = document.getElementById(id); e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }
      const box = document.getElementById('mar-profilaxis-resultado'); return { html: box.innerHTML, clase: box.className };
    }, [f, clcr, imc]);
    const mio = profilaxis(f, clcr, imc);
    if (calc.html === mio.html && calc.clase.includes('tfg-estado-' + mio.estado)) iguales++; else distintas.push(`${f}/${clcr}/${imc}`);
  }
ok(!distintas.length, `la dosis del telar coincide con la calculadora de la ficha en ${iguales} combinaciones ${distintas.slice(0, 4).join(' | ')}`);
await p.evaluate(() => { const s = document.getElementById('mar-profilaxis-farmaco'); s.value = 'enoxaparina'; s.dispatchEvent(new Event('change', { bubbles: true })); for (const [id, v] of [['mar-profilaxis-clcr', 80], ['mar-profilaxis-imc', 27]]) { const e = document.getElementById(id); e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); } });

// 5. Los mandos y los toques de la lámina
await p.evaluate(() => { document.querySelector('.btn-volver-libros-menu').click(); document.getElementById('tel-menu-libros').click(); }); await p.waitForTimeout(REDUCIDO ? 300 : 2800);
const orden = async sel => { await pulsar(sel); await p.waitForTimeout(40); if (await desborde() > 0) ok(false, `desborde tras ${sel}`); return T(); };
await p.evaluate(() => { const s = document.getElementById('tel-m-estado'); s.value = 'sano'; s.dispatchEvent(new Event('change', { bubbles: true })); });
await pulsar('[data-tel-tab="paciente"]');
t = await orden('#tel-dock-explorar [data-m="inmovil"]');
ok(t.estado.inmovil && t.D.velocidad === 1 && t.D.teje === 0, 'inmóvil: los hematíes al mismo ritmo y el telar no teje (la adivinanza)');
t = await orden('#tel-dock-explorar [data-m="inflamacion"]');
ok(t.D.tendencia === 'crece' && t.D.velocidad === 1, 'inflamación: la red crece con el flujo intacto');
await pulsar('[data-tel-tab="farmaco"]');
t = await orden('#tel-dock-explorar [data-m="farmaco"][data-v="hnf"]');
ok(t.celdas.some(c => c.v === 'Xa + IIa') && t.D.dosis.corta === '5.000 U cada 8-12 h', 'HNF: corta el Xa y la IIa; 5.000 U cada 8-12 h');
await p.waitForTimeout(REDUCIDO ? 30 : 900); await foto('05-hnf');
t = await orden('#tel-dock-explorar [data-m="farmaco"][data-v="enoxaparina"]');
ok(await p.evaluate(() => /no llega/.test(document.getElementById('tel-lamina').textContent)), 'enoxaparina: la cadena corta «no llega» a la trombina');
await pulsar('[data-tel-tab="rinon"]');
t = await orden('#tel-dock-explorar [data-m="clcr"][data-v="25"]');
ok(t.D.dosis.corta === '30 mg al día' && await p.evaluate(() => !document.getElementById('tel-dosis').hidden), 'ClCr 25: 30 mg al día, con la caja de la calculadora');
t = await orden('#tel-dock-explorar [data-m="imc"][data-v="42"]');
ok(await p.evaluate(() => /obesidad e insuficiencia renal a la vez/.test(document.getElementById('tel-dosis').textContent)), 'ClCr 25 e IMC 42: la tabla no da pauta para las dos');
await pulsar('[data-tel-tab="farmaco"]'); t = await orden('#tel-dock-explorar [data-m="farmaco"][data-v="fondaparinux"]');
await pulsar('[data-tel-tab="rinon"]'); t = await orden('#tel-dock-explorar [data-m="clcr"][data-v="32"]');
ok(await p.evaluate(() => /discrepan/.test(document.getElementById('tel-dosis').textContent)), 'fondaparinux con ClCr 32: la nota de la discrepancia');
await pulsar('[data-tel-tab="paciente"]'); t = await orden('#tel-dock-explorar [data-m="tih"]');
ok(t.estado.vista === 'tih' && t.celdas.some(c => /argatrobán/.test(c.v)), 'TIH con fondaparinux: solo lo que dice el libro (argatrobán)');
await p.evaluate(() => { const s = document.getElementById('tel-m-estado'); s.value = 'tih'; s.dispatchEvent(new Event('change', { bubbles: true })); });
t = await T(); ok(estadoEs(t, 'tih') && t.D.plaquetasCaen && t.celdas.some(c => c.v === '2,6 %'), 'el menú de estados lleva a la TIH con HNF: 2,6 %, las plaquetas caen');
await pulsar('#tel-vista-cerrar'); t = await T(); ok(t.estado.vista === 'telar', '«× volver al telar» cierra la vista de la plaqueta');
await pulsar('[data-tel-tab="pierna"]');
t = await orden('#tel-dock-explorar [data-m="mecanica"][data-v="cni"]');
t = await orden('#tel-dock-explorar [data-m="diastolica"][data-v="34"]');
ok(t.D.aprieta && await p.evaluate(() => /pie pálido/.test(document.getElementById('tel-lamina').textContent)), 'CNI con PAD 34: aprieta la arteria y el pie palidece');
t = await orden('#tel-dock-explorar [data-m="filtro"]');
ok(t.estado.filtro, 'el filtro de cava se pone');
await pulsar('[data-tel-tab="reloj"]');
t = await orden('#tel-dock-explorar [data-m="horas"][data-v="24"]');
ok(t.estado.vista === 'reloj' && t.D.reloj.enoxaparina && !t.D.reloj.rivaroxaban, 'reloj a las 24 h: enoxaparina una vez al día sí, rivaroxabán no');
for (const k of ['pierna', 'lupa', 'rinon']) { await pulsar(`#tel-lamina [data-toca="${k}"]`); }
ok(await p.evaluate(() => document.getElementById('tel-frase').textContent.length > 40), 'tocar la pierna, la lupa y el riñón explica cada parte');
ok(await desborde() <= 0, 'sin desborde tras los toques');

// 6. Rendimiento (solo con movimiento): CPU ×4
if (!REDUCIDO) {
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.evaluate(() => { window.__telPruebas().vaciarFotogramas(); const s = document.getElementById('tel-m-estado'); s.value = 'cni'; s.dispatchEvent(new Event('change', { bubbles: true })); });
  await p.waitForTimeout(3000);
  const f = (await T()).bucle.fotogramas;
  ok(f.n > 20 && f.medio < 12, `coste de dibujo por fotograma con CPU ×4: ${f.medio} ms (n=${f.n}, máx ${f.max})`);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await p.evaluate(() => document.querySelector('.btn-volver-libros-menu').click()); await p.waitForTimeout(400);
  ok(!(await T()).bucle.enMarcha, 'el bucle se para con la vista oculta');
  await pulsar('#tel-menu-libros'); await p.waitForTimeout(300);
} else ok(!(await T()).bucle.enMarcha, 'con «reducir movimiento» no hay bucle: estado final');

// 7. Mayéutica entera fallando 4 (3 tests y el «tocar» de tl-g1), con el repaso
await pulsar('#tel-modo-preguntas'); await p.waitForTimeout(300);
ok(await p.evaluate(() => getComputedStyle(document.querySelector('.tel-lead')).display === 'none'), 'la entradilla se oculta en la Mayéutica');
ok(await p.evaluate(() => document.getElementById('tel-cama7').hidden), 'la cama 7 se oculta en la Mayéutica');
await pulsar('#tel-preg [data-ir="recorrido"]');
const tests = PREGUNTAS.filter(q => q.tipo === 'test' && !q.tocar);
const FALLAR = new Set([tests[0].id, tests[2].id, tests[4].id]);
const FALLAR_TOCAR = 'tl-g1';
let nDesbordeOk = 0;
const contestar = async (q, fallar, foto1, fallarTocar, donde = q.id, elegir = null) => {
  const pref = '#tel-preg ';
  const tap = q.ocultar || q.tocar?.ocultar || [];
  if (tap.length) { const tr = await T(); const falta = tap.filter(k => !tr.ocultos.includes(k)); if (falta.length) ok(false, `${donde}: no se tapan ${falta.join(', ')} antes de contestar`); }
  if (q.tipo === 'test') {
    await pulsar(pref + '[data-accion="ops"]');
    const txt = await p.evaluate(() => [...document.querySelectorAll('#tel-preg [data-op]')].map(b => b.textContent));
    const buena = txt.findIndex(x => x === q.opciones.find(o => o.ok).t.replace(/<[^>]+>/g, '')), mala = txt.findIndex((x, i) => i !== buena);
    if (buena < 0) ok(false, `${donde}: no encuentro la opción buena`);
    if (foto1) { await p.evaluate(() => document.getElementById('tel-preg').scrollIntoView({ block: 'start' })); await foto(foto1 + '-antes'); }
    const otra = elegir ? txt.findIndex(x => x === elegir.replace(/<[^>]+>/g, '')) : -1;
    if (elegir && otra < 0) ok(false, `${donde}: no encuentro la opción «${elegir}»`);
    await pulsar(pref + `[data-op="${elegir ? otra : fallar ? mala : buena}"]`);
  } else if (q.tipo === 'destapa') {
    await pulsar(pref + '[data-accion="destapa"]');
    if (!fallar) await p.evaluate(() => document.querySelectorAll('#tel-pts input').forEach(c => { c.checked = true; }));
    await pulsar(pref + '[data-accion="puntos"]');
  } else {
    if (!fallar) for (const [i, f] of q.frases.entries()) if (f.mal) await pulsar(pref + `[data-fr="${i}"]`);
    await pulsar(pref + '[data-accion="corregir"]');
    const mal = q.frases.findIndex(f => f.mal);
    if (mal >= 0) { await pulsar(pref + `[data-ver="${mal}"]`); if (!await p.evaluate(() => /Corrección/.test(document.getElementById('tel-preg').textContent))) ok(false, `${donde}: la frase buena no se destapa`); }
  }
  if (q.tocar) {
    if (fallarTocar) {
      await pulsar(pref + '[data-accion="comprobar"]'); await pulsar(pref + '[data-accion="comprobar"]');
      ok(await p.evaluate(() => /cuenta como fallo/.test(document.getElementById('tel-q-fin')?.textContent || '')), `${q.id}: el «tocar» fallado cuenta como fallo`);
      ok(await p.evaluate(() => [...document.querySelectorAll('#tel-mando [data-mando][aria-pressed="true"]')].length > 0), `${q.id}: «Te lo pongo en el modelo» deja el mando de la pregunta igual que el modelo`);
    } else {
      for (const [k, v] of Object.entries(q.tocar.bueno)) await pulsar(pref + `[data-mando="${k}"][data-v="${typeof v === 'boolean' ? String(+v) : String(v)}"]`);
      await pulsar(pref + '[data-accion="comprobar"]');
      ok(await p.evaluate(() => /Comprobado/.test(document.getElementById('tel-q-fin')?.textContent || '')), `${donde}: se comprueba en el modelo`);
    }
  }
  await p.waitForTimeout(REDUCIDO ? 30 : 250);
  const dsb = await desborde(); if (dsb > 0) ok(false, `desborde de ${dsb} px tras contestar ${donde}`); else nDesbordeOk++;
  const tr = await T();
  if (tr.ocultos.length) ok(false, `${donde}: siguen tapadas ${tr.ocultos.join(', ')} tras contestar`);
  const c = await sinIds(); if (c.length) ok(false, `${donde}: se ve ${c.join(' | ')}`);
  if (!await p.evaluate(() => document.querySelectorAll('#tel-preg .cita-ir[data-resaltar]').length > 0)) ok(false, `${donde}: sin «Ver en la ficha» al párrafo`);
  if (!REDUCIDO) await p.waitForTimeout(400);
  const conCaja = await p.evaluate(() => !!document.querySelector('#tel-preg .tel-consecuencia'));   // con consecuencia, la vista va a la caja ⚠ y «Siguiente» queda más abajo
  if (!conCaja && !await p.evaluate(() => { const s = document.querySelector('#tel-preg [data-accion="sig"]').getBoundingClientRect(), d = document.getElementById('tel-dock').getBoundingClientRect(); return s.bottom <= d.top + 1; })) ok(false, `${donde}: «Siguiente» queda tapado por el dock`);
  if (foto1) await foto(foto1 + '-despues');
  if (antesDeSeguir) { const f = antesDeSeguir; antesDeSeguir = null; await f(); }
  await pulsar(pref + '[data-accion="sig"]');
};
let antesDeSeguir = null;   // una comprobación extra antes de «Siguiente» (la caja de la consecuencia)
for (const [i, q] of PREGUNTAS.entries()) {
  const html = await p.evaluate(() => document.getElementById('tel-preg').innerHTML);
  if (/data-correcta|data-mal|data-ok|"ok"/.test(html)) ok(false, `${q.id}: la respuesta está escrita en el HTML`);
  await contestar(q, FALLAR.has(q.id), i === 1 ? '06-pregunta' : null, q.id === FALLAR_TOCAR);
}
t = await T();
ok(t.fase === 'repaso', `tras las ${PREGUNTAS.length}, pasa al repaso`);
ok(await p.evaluate(() => document.querySelectorAll('#tel-preg [data-rep]').length) === 4, 'el repaso trae las 4 falladas (3 + el «tocar» fallado)');
await foto('07-repaso');
for (const id of [...FALLAR, FALLAR_TOCAR]) { await pulsar(`#tel-preg [data-rep="${id}"]`); await contestar(PREGUNTAS.find(q => q.id === id), false, null, false, 'repaso ' + id); }
ok(await p.evaluate(() => /No queda nada por repasar/.test(document.getElementById('tel-preg').textContent)), 'el repaso se vacía al acertarlas');
t = await T();
ok(Object.keys(t.guardado).length === PREGUNTAS.length && Object.values(t.guardado).filter(g => g.resultado === 'mal').length === 4, `localStorage: ${PREGUNTAS.length} guardadas, 4 falladas`);

// 8. Los 3 casos hasta «Lo que te llevas» (fallando el primer paso de cada uno)
await pulsar('#tel-preg [data-ir="casos"]');
for (const [k, C] of CASOS.entries()) {
  await pulsar(`#tel-preg [data-caso="${k}"]`);
  for (const [j, paso] of C.pasos.entries()) {
    if (paso.calculadora && !await p.evaluate(() => !!document.querySelector('#tel-preg [data-resaltar="#mar-profilaxis-calc"]'))) ok(false, `${C.id} paso ${j + 1}: sin el enlace a la calculadora`);
    await contestar({ ...paso.pregunta }, j === 0, k === 0 && j === 4 ? '08-caso-giro' : null, false, `${C.id} paso ${j + 1}`);
  }
  ok(await p.evaluate(() => /Lo que te llevas/.test(document.getElementById('tel-preg').textContent)), `el caso ${C.id} llega a «Lo que te llevas»`);
  ok(await p.evaluate(() => !!document.querySelector('#tel-preg [data-tab][data-especialidad="libros"]')), `${C.id}: «Repasar en la ficha» enlaza con su ficha`);
  if (await desborde() > 0) ok(false, `desborde en «Lo que te llevas» del caso ${C.id}`);
  if (k === 0) {
    await p.evaluate(() => document.getElementById('tel-preg').scrollIntoView({ block: 'end' })); await p.waitForTimeout(200);
    await foto('09-fin-caso');
    await pulsar('#tel-preg [data-fin="modelo"]'); await p.waitForTimeout(300);
    const v = await T();
    ok(v.modo === 'explorar' && v.estado.farmaco === 'fondaparinux' && v.estado.clcr === 50, 'volver del caso al modelo: Explorar en el estado del paciente');
    await pulsar('#tel-modo-preguntas'); await pulsar('#tel-preg [data-ir="casos"]');
  } else if (k < CASOS.length - 1) await pulsar('#tel-preg [data-fin="otro"]');
}
// 8b. La revisión por objetivos al cerrar el caso (core/mayeutica-motor.js). Del recorrido de arriba (falló el paso 1 de
// cada caso): el objetivo que depende del paso 1 sale ✗ con su porqué; los demás, ✓.
const objetivosFin = () => p.evaluate(() => [...document.querySelectorAll('#tel-preg [data-objetivo]')].map(li => ({ id: li.dataset.objetivo, ok: li.dataset.cumplido === 'true', txt: li.textContent.replace(/\s+/g, ' ').trim(), cita: !!li.querySelector('.cita-ir[data-resaltar]') })));
const ROSA = CASOS[0];
await pulsar('#tel-preg [data-fin="otro"]');   // Javier -> lista
await pulsar('#tel-preg [data-caso="0"]');
const recorrerRosa = async (tag, elegir = {}) => { for (const [j, paso] of ROSA.pasos.entries()) await contestar({ ...paso.pregunta }, false, null, false, `${tag} paso ${j + 1}`, elegir[j] || null); };
await recorrerRosa('Rosa todo bien');
let ob = await objetivosFin();
ok(ob.length === ROSA.objetivos.length && ob.every(o => o.ok && /✓ Cumplido/.test(o.txt) && o.cita), `Rosa todo bien: los ${ob.length} objetivos ✓, cada uno con «Ver en la ficha» (${ob.filter(o => !o.ok).map(o => o.id).join(', ')})`);
ok(await p.evaluate(() => { const t = document.getElementById('tel-preg').textContent; return t.indexOf('Revisión por objetivos') < t.indexOf('Lo que te llevas') && !/\d+ de \d+ objetivos|%/.test(document.querySelector('#tel-preg .tel-objetivos').textContent.replace(/\d+ (h|min|mg|mL)/g, '')); }), 'Rosa: los objetivos van arriba de «Lo que te llevas», sin nota ni recuento');
// La opción con consecuencia: seguir con la HNF con la TIH en marcha (paso 4) -> la lámina de la TIH muestra la trombosis
const iCons = ROSA.pasos.findIndex(pa => pa.pregunta.opciones?.some(o => o.consecuencia));
const opCons = ROSA.pasos[iCons].pregunta.opciones.find(o => o.consecuencia);
const vigilar = async () => {
  const v = await T();
  ok(v.estado.vista === 'tih' && v.estado.tih === true && v.estado.farmaco === 'hnf' && v.D.plaquetasCaen, `consecuencia: la lámina de la TIH con la HNF y la trombosis dibujada (tih ${v.estado.tih}, plaquetas caen ${v.D.plaquetasCaen})`);
  const caja = await p.evaluate(() => { const c = document.querySelector('#tel-preg .tel-consecuencia'); return c && { txt: c.textContent, cita: !!c.querySelector('.cita-ir[data-resaltar]'), visible: c.offsetParent !== null }; });
  ok(caja && caja.visible && /⚠ Lo que acaba de pasar/.test(caja.txt) && caja.cita, 'consecuencia: sale la caja «⚠ Lo que acaba de pasar» con «Ver en la ficha»');
  ok(await p.evaluate(() => { const r = document.querySelector('#tel-preg .tel-consecuencia').getBoundingClientRect(); return r.top >= 0 && r.top < document.getElementById('tel-dock').getBoundingClientRect().top - 40; }), 'consecuencia: la caja ⚠ queda dentro de la pantalla al elegir la opción');
  await p.evaluate(() => document.querySelector('#tel-preg .tel-consecuencia').scrollIntoView({ block: 'center' })); await foto('10-consecuencia');
};
await pulsar('#tel-preg [data-fin="otro"]'); await pulsar('#tel-preg [data-caso="0"]');
for (const [j, paso] of ROSA.pasos.entries()) {
  if (j === iCons) {
    const antes = await T();
    ok(antes.estado.vista === 'tih' && antes.estado.tih === false, `antes de elegir, el paso ${j + 1} deja la lámina de la TIH sin la trombosis (tih ${antes.estado.tih})`);
    // Rosa ya tiene las plaquetas bajas (95.000): con tih:false y heparina, el tablero no pone «—»
    ok(await p.evaluate(() => /bajan · sin agregados aún/.test(document.getElementById('tel-tablero').textContent)), 'paso de la TIH sin trombosis: «Plaquetas: bajan · sin agregados aún» (no contradice los 95.000 de Rosa)');
    antesDeSeguir = vigilar;
  }
  await contestar({ ...paso.pregunta }, false, null, false, `Rosa consecuencia paso ${j + 1}`, j === iCons ? opCons.t : null);
  if (j === iCons) ok(await p.evaluate(() => /El adjunto lo cambia a fondaparinux/.test(document.getElementById('tel-preg').textContent)), 'tras la consecuencia, el paso siguiente dice «El adjunto lo cambia a fondaparinux…»');
  if (j === iCons) { const v = await T(); ok(v.estado.farmaco === ROSA.pasos[iCons + 1].estado.farmaco && v.estado.tih === false, `al pasar al paso siguiente, el telar vuelve a su estado (${v.estado.farmaco}, tih ${v.estado.tih})`); }
}
ob = await objetivosFin();
const tihOb = ob.find(o => o.id === 'tih');
ok(tihOb && !tihOb.ok && /✗ Falta/.test(tihOb.txt) && new RegExp(`paso ${iCons + 1}`).test(tihOb.txt) && /⚠ Lo que pasó/.test(tihOb.txt), 'Rosa con la HNF en la TIH: «TIH» ✗ con su porqué, el paso y la consecuencia');
ok(ob.filter(o => o.id !== 'tih').every(o => o.ok), 'Rosa con la HNF en la TIH: los demás objetivos ✓');
ok(/Elegiste: «Seguir con HNF/.test(tihOb.txt), 'Rosa con la HNF en la TIH: el ✗ dice «Elegiste: …»');
await p.evaluate(() => document.querySelector('#tel-preg .tel-objetivos').scrollIntoView({ block: 'start' })); await foto('11-objetivos');
if (await desborde() > 0) ok(false, 'desborde en la revisión por objetivos');
crudos = await sinIds(); if (crudos.length) ok(false, `revisión por objetivos: se ve ${crudos.join(' | ')}`);
const nRespuestas = PREGUNTAS.length + 4 + CASOS.reduce((a, c) => a + c.pasos.length, 0);
ok(nDesbordeOk >= nRespuestas, `sin desborde tras contestar en ${nDesbordeOk} de ${nRespuestas} respuestas y pasos`);

// 9. Lo guardado sigue al recargar; Conceptos
await p.reload(); await p.waitForFunction(() => window.__telPruebas);
await p.click('#btn-libros'); await p.click('#btn-libro-marino'); await p.click('#lib-pest-vivos'); await p.click('#tel-menu-libros'); await p.waitForTimeout(300);
await pulsar('#tel-modo-preguntas'); await p.waitForTimeout(200);
ok(await p.evaluate(n => new RegExp(`Seguir \\(${n} de ${n}\\)`).test(document.getElementById('tel-preg').textContent), PREGUNTAS.length), `tras recargar, la Mayéutica recuerda las ${PREGUNTAS.length}`);
await pulsar('#tel-modo-conceptos');
for (let i = 0; i < CONCEPTOS.length; i++) {
  const n = await p.evaluate(() => document.querySelectorAll('#tel-concepto [data-acc]').length);
  for (let j = 0; j < n; j++) { await pulsar(`#tel-concepto [data-acc="${j}"]`); await p.waitForTimeout(REDUCIDO ? 20 : 120); if (await desborde() > 0) ok(false, `desborde en el concepto ${i + 1}, acción ${j + 1}`); }
  if (i === 5) { await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(REDUCIDO ? 20 : 3500); await foto('10-concepto'); }
  if (i < CONCEPTOS.length - 1) await pulsar('#tel-concepto [data-nav="1"]');
}
ok(await desborde() <= 0, `sin desborde en los ${CONCEPTOS.length} conceptos`);
crudos = await sinIds(); ok(!crudos.length, `sin ids internos a la vista en Conceptos ${crudos.slice(0, 3).join(' | ')}`);
await pulsar('#tel-concepto .cita-ir'); await p.waitForTimeout(800);
ok(await p.evaluate(() => [...document.querySelectorAll('#marino-fund-view .tab-content.active')].some(e => e.offsetParent)), '«Ver en el texto» abre la ficha');
ok(errores.length === 0, `0 errores de consola (${errores.length}) ${errores.slice(0, 3).join(' | ')}`);
const ids = await p.evaluate(() => { const v = {}; document.querySelectorAll('[id]').forEach(e => { v[e.id] = (v[e.id] || 0) + 1; }); return Object.keys(v).filter(k => v[k] > 1); });
ok(ids.length === 0, 'sin ids repetidos ' + ids.join(','));

// 10. «← VOLVER» desde una ficha: vuelve a la ficha, abierta
for (const tab of FICHAS) {
  await abrirFicha(tab); await p.waitForTimeout(800);
  await pulsar(`#${tab} [data-telar-vivo]`); await p.waitForTimeout(REDUCIDO ? 400 : 1000);
  const txtVolver = await p.evaluate(() => document.getElementById('tel-volver').textContent);
  await pulsar('#tel-volver'); await p.waitForTimeout(1000);
  ok(await fichaAbierta(tab) && /FICHA/.test(txtVolver), `«${txtVolver}» desde ${tab} vuelve a la ficha, abierta y visible`);
}
await p.evaluate(() => document.querySelector('.btn-volver-libros-menu').click()); await p.waitForTimeout(200);
await p.evaluate(() => { document.getElementById('tel-menu-libros').click(); }); await p.waitForTimeout(300);
ok(await p.evaluate(() => document.getElementById('tel-volver').textContent === '← VOLVER'), 'desde el menú, «← VOLVER» lleva al menú');
ok(errores.length === 0, `0 errores de consola al final (${errores.length}) ${errores.slice(0, 3).join(' | ')}`);
// La explicación guiada (guias-comun.mjs): dos enteras, la forma de todas y cada «Ver en la ficha» a un párrafo que existe
await probarGuias({ p, ok, pre: 'tel', view: 'telarVivo', attr: 'telarVivo', GUIAS, recorrer: ['hnf', 'renal-25'], foto, desborde, REDUCIDO });
await ctx.close();
fallosTotales.push(...fallos.map(f => `${tag}: ${f}`));
}

try {
  await correr(390, false);
  await correr(360, true);
} catch (e) { fallosTotales.push('la prueba se cortó: ' + e.message); console.log('❌ ' + e.message); }
await b.close();
console.log(fallosTotales.length ? `\n❌ ${fallosTotales.length} fallo(s)` : '\n✅ telar de la trombina: todo bien');
process.exit(fallosTotales.length ? 1 : 0);
