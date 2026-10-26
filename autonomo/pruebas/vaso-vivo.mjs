// Prueba de navegador del vaso que sangra (juez de autonomo/jueces.mjs --modelo vaso-vivo).
// Uso: node autonomo/pruebas/vaso-vivo.mjs <url-base> [--capturas <carpeta>]
// Copia la del capilar (capilar-vivo.mjs). Recorre, a 390 px (con movimiento y su medida de rendimiento) y a 360 px
// (con «reducir movimiento»), cada uno en un contexto limpio: accesos (menú de Libros, buscador y los botones de las
// fichas 4-6 de Merino HEMATO, cada uno en su estado), los 18 estados con sus cifras (±1 en la última frente a la
// cobertura del bloque 2 §5.3) y su lupa, la herida en sus 4 tiempos, el mando de las plaquetas en sus extremos y su
// punto medio (un paciente posible), la explicación guiada recorrida entera en 3 estados (cada paso señala en el
// dibujo y lleva su «Ver en la ficha» a un párrafo que existe), los rótulos (≥7,5 px, sin pisarse), la Mayéutica
// entera fallando 4 con su repaso (las cifras que se predicen salen tapadas; la respuesta no está en el HTML), los 3
// casos hasta «Lo que te llevas», lo guardado tras recargar y el «← VOLVER» a la ficha. Mide el desborde lateral
// (0 px) tras cada respuesta, el repaso, cada paso de los casos y cada paso de las explicaciones.
// Sale con código 1 si algo falla.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const { PREGUNTAS, CASOS, ESTADOS, GUIAS } = await import(new URL('../../js/data/vaso-vivo-data.js', import.meta.url));
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
const T = () => p.evaluate(() => { const t = window.__vsoPruebas(); return { estado: t.estado, modo: t.modo, fase: t.fase, todo: t.todoCoincide, bucle: t.bucle, guardado: t.guardado, celdas: t.celdas, lupa: t.lupa, ocultos: t.ocultos, estados: t.estados, extremos: t.extremos, mayeutica: t.mayeutica, guias: t.guias, clave: t.clave }; });
const foto = n => CAPTURAS ? p.screenshot({ path: CAPTURAS + 'vso-' + n + '-' + tag + '.png' }) : null;
const vistaVisible = () => p.evaluate(() => { const v = document.getElementById('vaso-vivo-view'); return v.style.display === 'block' && v.offsetParent !== null && document.getElementById('libros-view').style.display === 'block'; });
const deslizar = (sel, v) => p.evaluate(([s, v]) => { const r = document.querySelector(s); r.value = v; r.dispatchEvent(new Event('input', { bubbles: true })); }, [sel, v]);
const abrirModelo = k => p.evaluate(k => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'vasoVivo', vasoVivo: k }); document.body.append(t); t.click(); t.remove(); }, k);
const aEscena = () => p.evaluate(() => document.getElementById('vso-escena-bloque').scrollIntoView({ block: 'start' }));
const espera = ms => p.waitForTimeout(REDUCIDO ? Math.min(ms, 300) : ms);

await p.goto(BASE + 'index.html');   // contexto nuevo: localStorage vacío
await p.waitForFunction(() => window.__vsoPruebas);

// 1. Desde el menú de Libros (pestaña Modelos vivos de la portada de Marino)
await p.click('#btn-libros'); await p.click('#btn-libro-marino'); await p.click('#lib-pest-vivos'); await p.click('#vso-menu-libros'); await p.waitForTimeout(600);
ok(await vistaVisible(), 'abre desde el menú de Libros (Modelos vivos)');
let t = await T();
const malos = t.estados.filter(x => !x.ok);
ok(t.todo, `__vsoPruebas().todoCoincide (${t.estados.length} cifras; Mayéutica: ${t.mayeutica.preguntas} preguntas, ${t.mayeutica.predice} de predecir; ${malos.slice(0, 3).map(x => `${x.estado}·${x.campo}: ${x.valor}≠${x.espera}`).join(' | ')})`);
ok(t.celdas.plaq === '250.000' && t.celdas.inr === 'normal' && t.celdas.tapon === '—', `tablero del sano: plaquetas ${t.celdas.plaq}, INR ${t.celdas.inr}, tapón ${t.celdas.tapon}`);
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
await foto('01-primera');
ok(await desborde() <= 0, 'sin desborde en la primera pantalla');
ok(await p.evaluate(() => { const f = document.getElementById('vso-frase').getBoundingClientRect(), d = document.getElementById('vso-dock').getBoundingClientRect(); return f.top >= d.top && f.bottom <= innerHeight; }), 'la frase viva se ve, dentro del dock');
ok(await p.evaluate(() => !!document.querySelector('#vso-frase .vso-org-ir[data-resaltar]')), 'el origen de la frase lleva al párrafo exacto de la ficha («Ver en la ficha»)');

// 2. Desde el buscador
for (const q of ['vaso que sangra', 'hemostasia', 'microangiopatía', 'trampa del INR']) {
  await pulsar('#btn-buscar-global'); await p.fill('#search-input-el', q); await p.waitForTimeout(150);
  const n = await p.evaluate(() => [...document.querySelectorAll('.search-result-row')].findIndex(r => /vaso que sangra/i.test(r.textContent)));
  ok(n >= 0, `el buscador encuentra el vaso con «${q}»`);
  if (n >= 0) { await p.evaluate(i => document.querySelectorAll('.search-result-row')[i].click(), n); await p.waitForTimeout(250); ok(await vistaVisible(), `… y lo abre («${q}»)`); }
  else await pulsar('#search-close-btn');
}

// 3. Desde las fichas 4-6 de Merino HEMATO, cada botón en su estado
const abrirFicha = tab => p.evaluate(tab => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'home', view: 'merinoHemato', panel: 'panel-merino-tabs', tab }); document.body.append(t); t.click(); t.remove(); }, tab);
const desde = async (tab, estado, compr) => {
  await abrirFicha(tab); await p.waitForTimeout(400);
  const sel = `#${tab} [data-vaso-vivo="${estado}"]`;
  // si está dentro de un acordeón (CID, PTT, SHU), se abre como lo abriría el usuario
  await p.evaluate(s => { const b = document.querySelector(s); const item = b?.closest('.micro-prof-item'); if (b && !b.offsetParent && item) item.querySelector('.micro-prof-head').click(); }, sel);
  ok(await p.evaluate(s => !!document.querySelector(s) && document.querySelector(s).offsetParent !== null, sel), `la ficha ${tab} tiene su botón visible (${estado})`);
  await p.locator(sel).first().scrollIntoViewIfNeeded(); await p.locator(sel).first().click(); await espera(1200);
  const t = await T();
  ok(await vistaVisible() && compr(t), `desde ${tab}: abre en «${estado}»`);
  ok(await desborde() <= 0, `sin desborde (${estado})`);
};
await desde('merino-trombocitopenia', 'herida', t => t.estado.lesion === 'herida' && t.lupa === 'herida');
await desde('merino-trombocitopenia', 'hit-argatroban', t => t.estado.hep === 'argatroban' && t.lupa === 'cascada' && t.celdas.aptt === '1,5-3×');
await desde('merino-microangiopatias', 'ptt', t => t.estado.causa === 'ptt' && t.celdas.inr === 'normal' && t.celdas.esq === 'sí');
await desde('merino-plaquetas-plasma', 'pfc-inr', t => t.estado.rep === 'pfc' && t.celdas.inr === '1,8→1,4');
ok(await p.evaluate(() => /FICHA/.test(document.getElementById('vso-volver').textContent)), '«← VOLVER A LA FICHA» al entrar desde una ficha');
const nBotones = await p.evaluate(() => ['merino-trombocitopenia', 'merino-microangiopatias', 'merino-plaquetas-plasma'].map(f => document.querySelectorAll(`#${f} [data-vaso-vivo]`).length));
ok(nBotones.every(n => n >= 3), `las fichas 4-6 enlazan el vaso en sus estados (${nBotones.join(', ')} botones)`);

// 4. Los 18 estados, desde el enlace cruzado de siempre: sus cifras (cobertura §5.3), su lupa y sin desborde
const ESPERA = {
  sano: t => t.celdas.plaq === '250.000' && !t.lupa,
  herida: t => t.estado.lesion === 'herida' && t.lupa === 'herida',
  'plaquetas-100k': t => t.celdas.plaq === '100.000' && t.celdas.tapon !== 'no cierra' && t.lupa === 'herida',
  'plaquetas-5k': t => t.celdas.plaq === '5.000' && t.celdas.amenaza === 'HIC',
  pseudotrombocitopenia: t => t.celdas.plaq === 'falsa ↓' && t.lupa === 'tubo',
  sepsis: t => t.celdas.plaq === '60.000',
  hit: t => t.celdas.plaq === '−50 %' && t.celdas.amenaza === 'trombosis' && t.lupa === 'plaqueta',
  'hit-argatroban': t => t.celdas.aptt === '1,5-3×' && t.lupa === 'cascada',
  cid: t => t.celdas.inr === '↑' && t.celdas.aptt === '↑' && t.celdas.fib === '↓' && t.celdas.dd === '↑' && t.celdas.esq === 'sí' && t.lupa === 'frotis',
  'cid-lena': t => t.celdas.inr === '↑' && t.estado.rep === 'lena',
  ptt: t => t.celdas.inr === 'normal' && t.celdas.fib === 'normal' && t.celdas.dd === 'normal' && t.celdas.esq === 'sí' && t.lupa === 'plaqueta',
  'ptt-recambio': t => t.estado.rep === 'recambio' && t.celdas.inr === 'normal',
  shu: t => t.celdas.inr === 'normal' && t.celdas.esq === 'sí' && t.lupa === 'frotis',
  'transfusion-plaquetas': t => t.celdas.plaq === '55-70 mil',
  refractariedad: t => t.celdas.plaq === '−25 %',
  'pfc-inr': t => t.celdas.inr === '1,8→1,4' && t.celdas.fib === '38→50 %',
  warfarina: t => t.estado.rep === 'warf-pfc' && /baja/.test(t.celdas.inr),
  'hemorragia-masiva': t => t.celdas.fib === '120' && t.celdas.amenaza === 'sangrado' && t.celdas.tapon === 'no cierra',
};
ok(Object.keys(ESTADOS).length === 18 && Object.keys(ESPERA).length === 18, `18 estados con nombre (${Object.keys(ESTADOS).length})`);
for (const k of Object.keys(ESTADOS)) {
  await abrirModelo(k); await espera(k === 'herida' ? 600 : 500);
  const t = await T();
  ok(await vistaVisible() && ESPERA[k](t), `«${k}»: ${JSON.stringify(t.celdas).replace(/"/g, '')} · lupa ${t.lupa}`);
  if (await desborde() > 0) ok(false, `desborde en «${k}»`);
  if (['hit', 'ptt', 'cid', 'pfc-inr', 'warfarina', 'transfusion-plaquetas', 'hemorragia-masiva', 'pseudotrombocitopenia'].includes(k)) { await aEscena(); await espera(700); await foto('04-' + k); }
}

// 5. La herida en sus 4 tiempos (los mandos del dock) y la lesión estructural
await abrirModelo('sano'); await espera(300);
await pulsar('[data-vso-tab="herida"]');
for (const n of [1, 2, 3, 4]) {
  await pulsar(`#vso-m-tiempo [data-v="${n}"]`); await espera(1500);
  const t = await T();
  ok(t.estado.t === n && t.estado.lesion === 'herida' && t.lupa === 'herida' && t.celdas.tapon === ['se pega', 'anclado', 'trombo', 'contraído'][n - 1], `tiempo ${n} de la herida: tapón «${t.celdas.tapon}»`);
  await aEscena(); await espera(300); await foto('05-tiempo-' + n);
}
// Tocar la pared sana abre una herida (los 4 tiempos) y su lupa
await abrirModelo('sano'); await espera(300);
await p.evaluate(() => document.querySelector('#vso-lamina [data-vso-toca="herida"]').dispatchEvent(new MouseEvent('click', { bubbles: true })));
await espera(500);
ok((await T()).estado.lesion === 'herida' && (await T()).lupa === 'herida', 'tocar la pared abre la herida y su lupa');

// 6. El mando de las plaquetas en sus extremos y su punto medio (con una herida): un paciente posible
await abrirModelo('herida'); await espera(300); await pulsar('[data-vso-tab="plaquetas"]');
for (const [v, espera1] of [[0, 5000], [500, null], [1000, 400000]]) {
  await deslizar('#vso-m-plaq', v); await p.waitForTimeout(80);
  const t = await T();
  const plaq = t.estado.plaq, posible = plaq >= 5000 && plaq <= 400000 && (espera1 == null || plaq === espera1) && /^[\d.]+$/.test(t.celdas.plaq) && (t.celdas.tapon === 'no cierra') === (plaq < 100000);
  ok(posible, `plaquetas en ${v}/1000: ${plaq}/µL, tapón «${t.celdas.tapon}», amenaza «${t.celdas.amenaza}»`);
  if (await desborde() > 0) ok(false, `desborde con plaquetas ${plaq}`);
}
ok((await T()).extremos.ok, `extremos del mando: de ${(await T()).extremos.min} a ${(await T()).extremos.max}, sin cifras imposibles`);
await pulsar('[data-vso-tab="herida"]'); await pulsar('#vso-m-lesion [data-v="grande"]'); await deslizar('#vso-m-plaq', 0); await p.waitForTimeout(150);
t = await T();
ok(t.celdas.amenaza === 'sangrado' && t.estado.lesion === 'grande', `5.000 con una lesión estructural: sangra («${t.celdas.amenaza}»)`);

// 7. Rótulos de la lámina: ≥7,5 px de alto y sin pisarse (como jueces-forma, C), en los estados con lupas y gráficas
const rotulos = () => p.evaluate(() => {
  const svg = document.getElementById('vso-lamina'), c = svg.getBoundingClientRect(), cajas = [];
  for (const t of svg.querySelectorAll('text')) {
    if (!t.textContent.trim() || !t.getClientRects().length) continue;
    let vis = true; for (let e = t; e && e !== document.documentElement; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) { vis = false; break; } }
    if (!vis) continue;
    const bb = t.getBoundingClientRect(); if (!bb.width || !bb.height) continue;
    if (bb.right <= c.left || bb.left >= c.right || bb.bottom <= c.top || bb.top >= c.bottom) continue;
    // lo que tapa la lupa (dibujada después) no cuenta
    const lupa = document.getElementById('vso-lupa-grande') || document.getElementById('vso-lupa-peq');
    if (lupa && !lupa.contains(t)) { const L = lupa.getBoundingClientRect(), cx = bb.left + bb.width / 2, cy = bb.top + bb.height / 2; if (cx > L.left && cx < L.right && cy > L.top && cy < L.bottom) continue; }
    cajas.push({ s: t.textContent.trim().slice(0, 24), x: bb.left, y: bb.top, w: bb.width, h: bb.height });
  }
  const pequenos = cajas.filter(k => k.h < 7.5).map(k => `${k.s} ${k.h.toFixed(1)} px`), pisados = [];
  for (let i = 0; i < cajas.length; i++) for (let j = i + 1; j < cajas.length; j++) {
    const a = cajas[i], d = cajas[j], ay = a.y + a.h * 0.25, ah = a.h * 0.6, dy = d.y + d.h * 0.25, dh = d.h * 0.6;
    const iw = Math.min(a.x + a.w, d.x + d.w) - Math.max(a.x, d.x), ih = Math.min(ay + ah, dy + dh) - Math.max(ay, dy);
    if (iw > 0 && ih > 0 && iw * ih / Math.min(a.w * ah, d.w * dh) > 0.3) pisados.push(`«${a.s}» y «${d.s}»`);
  }
  return { n: cajas.length, pequenos, pisados };
});
if (ANCHO === 390) for (const [k, lupa] of [['sano'], ['herida'], ['hit'], ['hit-argatroban'], ['cid'], ['ptt'], ['shu'], ['pseudotrombocitopenia'], ['transfusion-plaquetas'], ['pfc-inr'], ['warfarina'], ['hemorragia-masiva'], ['ptt-recambio'], ['shu', 'complemento'], ['sano', 'plaqueta']]) {
  await abrirModelo(k); await espera(k === 'herida' ? 11500 : 600);
  if (lupa) { await pulsar(`[data-vso-lupa="${lupa}"]`); await espera(500); }
  await aEscena(); await p.waitForTimeout(200);
  const r = await rotulos();
  ok(r.n > 5 && !r.pequenos.length && !r.pisados.length, `rótulos en «${k}${lupa ? ' · ' + lupa : ''}» (${r.n}): ${r.pequenos.slice(0, 3).join(', ')} ${r.pisados.slice(0, 3).join(', ')}`);
}

// 8. La explicación guiada, entera, en 3 estados: cada paso señala en el dibujo, lleva su «Ver en la ficha» (a un id
// que existe) y el PDF; sin desborde; al terminar vuelven los mandos
for (const k of ['herida', 'cid', 'pfc-inr']) {
  await abrirModelo(k); await espera(600);
  await pulsar('#vso-guia-abrir'); await espera(500);
  const g = await p.evaluate(() => window.__vsoPruebas().guia);
  ok(g && g.clave === k && g.n === GUIAS[k].length && g.n >= 3 && g.n <= 5, `«Explícame» abre la explicación de «${k}» (${g && g.n} pasos)`);
  ok(await p.evaluate(() => document.getElementById('vso-dock-explorar').hidden && !document.getElementById('vso-dock-guia').hidden), `${k}: la explicación ocupa el sitio de los mandos`);
  for (let i = 0; i < GUIAS[k].length; i++) {
    await espera(650);
    const paso = GUIAS[k][i];
    const v = await p.evaluate(() => ({ n: window.__vsoPruebas().guia?.paso, anillos: document.querySelectorAll('#vso-raiz g.guia-capa rect').length, marcos: document.querySelectorAll('#vso-raiz .guia-marco').length,
      citas: [...document.querySelectorAll('#vso-dock-guia .guia-citas .cita-ir')].map(c => ({ tab: c.dataset.tab, res: c.dataset.resaltar || null, tabOk: !!document.getElementById(c.dataset.tab), resOk: !c.dataset.resaltar || !!document.querySelector(c.dataset.resaltar) })),
      pdf: [...document.querySelectorAll('#vso-dock-guia .guia-citas .cita-pdf')].map(a => a.getAttribute('href')),
      escena: document.getElementById('vso-escena-bloque').getBoundingClientRect().top, txt: document.querySelector('#vso-dock-guia .guia-txt')?.textContent || '' }));
    const quiere = paso.resalta ? 1 : 0;
    ok(v.n === i && (!quiere || v.anillos + v.marcos > 0) && v.citas.length === [].concat(paso.cita).length && v.citas.every(c => c.tabOk && c.resOk && c.res) && v.pdf.length === v.citas.length && Math.abs(v.escena) <= 6,
      `${k}, paso ${i + 1}: señala (${v.anillos} anillos, ${v.marcos} cifras), ${v.citas.length} «Ver en la ficha» al párrafo y su PDF (${v.pdf.join(' ')})`);
    if (/\b(mar|mr|mc|mh)-[a-z0-9-]+|maqueta|§/.test(v.txt)) ok(false, `${k}, paso ${i + 1}: nombre interno a la vista`);
    if (await desborde() > 0) ok(false, `desborde en ${k}, paso ${i + 1}`);
    if (i === 1) await foto(`08-guia-${k}`);
    if (i < GUIAS[k].length - 1) await pulsar('#vso-dock-guia [data-guia="1"]');
  }
  ok(await p.evaluate(() => !!document.querySelector('#vso-dock-guia .guia-fuentes .cita-ir')), `${k}: el último paso lista las fuentes del estado`);
  await pulsar('#vso-dock-guia [data-guia="salir"]'); await p.waitForTimeout(200);
  ok(await p.evaluate(() => !window.__vsoPruebas().guia && !document.getElementById('vso-dock-explorar').hidden && !document.querySelectorAll('g.guia-capa').length), `${k}: «Terminar» devuelve los mandos y quita los anillos`);
}
// Todas las explicaciones (18): cada paso señala algo que existe en ese paso y cada cita va a un párrafo que existe
const sinSenal = [];
for (const k of Object.keys(GUIAS)) {
  await abrirModelo(k); await espera(400);
  await pulsar('#vso-guia-abrir'); await p.waitForTimeout(REDUCIDO ? 120 : 450);
  for (let i = 0; i < GUIAS[k].length; i++) {
    const v = await p.evaluate(() => document.querySelectorAll('#vso-raiz g.guia-capa rect').length + document.querySelectorAll('#vso-raiz .guia-marco').length);
    if (GUIAS[k][i].resalta && !v) sinSenal.push(`${k} ${i + 1}`);
    if (i < GUIAS[k].length - 1) { await pulsar('#vso-dock-guia [data-guia="1"]'); await p.waitForTimeout(REDUCIDO ? 120 : 450); }
  }
  await pulsar('#vso-dock-guia [data-guia="salir"]');
}
ok(!sinSenal.length, `los ${Object.values(GUIAS).flat().length} pasos de las 18 explicaciones señalan en el dibujo ${sinSenal.join(', ')}`);
const citas = await p.evaluate(() => window.__vsoPruebas().citas);
const sinParrafo = citas.filter(c => !c.exacta || !c.ficha_existe || !c.pdf);
ok(!sinParrafo.length, `las ${citas.length} citas de las explicaciones van a un párrafo que existe, con su PDF ${sinParrafo.slice(0, 4).map(c => c.id).join(' ')}`);
// «Ver en la ficha» desde la explicación lleva a la ficha, y el vaso vuelve a abrir
await abrirModelo('hit'); await espera(400);
await pulsar('#vso-guia-abrir'); await p.waitForTimeout(300);
const destino = await p.evaluate(() => { const bt = document.querySelector('#vso-dock-guia .cita-ir'); bt.click(); return { tab: bt.dataset.tab, res: bt.dataset.resaltar }; });
await p.waitForTimeout(900);
ok(await p.evaluate(d => { const e = document.getElementById(d.tab); return e.classList.contains('active') && !!e.offsetParent && !!document.querySelector(d.res); }, destino), `«Ver en la ficha» abre la ficha «${destino.tab}» en ${destino.res}`);
await abrirModelo('sano'); await p.waitForTimeout(400);

// 9. Rendimiento (solo con movimiento): CPU ×4
if (!REDUCIDO) {
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await abrirModelo('herida'); await p.waitForTimeout(400);
  await p.evaluate(() => window.__vsoPruebas().vaciarFotogramas());
  await p.waitForTimeout(3000);
  const f = (await T()).bucle.fotogramas;
  ok(f.n > 20 && f.medio < 20, `fotograma medio con CPU ×4 (la herida con su lupa): ${f.medio} ms (n=${f.n}, máx ${f.max})`);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await p.evaluate(() => document.querySelector('#vso-volver').click()); await p.waitForTimeout(500);
  ok(!(await T()).bucle.enMarcha, 'el bucle se para con la vista oculta');
  await abrirModelo('sano'); await p.waitForTimeout(300);
} else ok(!(await T()).bucle.enMarcha, 'con «reducir movimiento» no hay bucle: estado final');

// 10. Mayéutica entera fallando 4 (3 de opciones y un «compruébalo» fallado), con el repaso
await pulsar('#vso-modo-preguntas'); await p.waitForTimeout(300);
ok(await p.evaluate(() => getComputedStyle(document.querySelector('.vso-lead')).display === 'none'), 'la entradilla se oculta en la Mayéutica');
await foto('10-mayeutica-inicio');
await pulsar('#vso-preg [data-ir="recorrido"]');
const FALLAR = new Set(['trb-g1', 'mat-g3', 'ppl-e2']);
const FALLAR_TOCAR = 'vso-p2';
let nDesbordeOk = 0;
const contestar = async (q, fallar, foto1, fallarTocar, donde = q.id, elegir = null) => {
  const pref = '#vso-preg ';
  const tap = q.ocultar || q.tocar?.ocultar || [];
  if (tap.length) {
    const c = (await T()).celdas;
    const sinTapar = tap.filter(k => c[k] !== undefined && c[k] !== '?');
    if (sinTapar.length) ok(false, `${donde}: se ven antes de contestar ${sinTapar.join(', ')}`);
  }
  if (q.tipo === 'test') {
    await pulsar(pref + '[data-accion="ops"]');
    const orden = barajar(q.opciones, q.id), buena = orden.findIndex(o => o.ok), mala = orden.findIndex(o => !o.ok);
    const otra = elegir ? orden.findIndex(o => o.t === elegir) : -1;
    if (elegir && otra < 0) ok(false, `${donde}: no encuentro la opción «${elegir}»`);
    if (foto1) { await p.evaluate(() => document.getElementById('vso-preg').scrollIntoView({ block: 'start' })); await foto(foto1 + '-antes'); }
    await pulsar(pref + `[data-op="${elegir ? otra : fallar ? mala : buena}"]`);
  } else if (q.tipo === 'destapa') {
    await pulsar(pref + '[data-accion="destapa"]');
    if (!fallar) await p.evaluate(() => document.querySelectorAll('#vso-pts input').forEach(c => { c.checked = true; }));
    await pulsar(pref + '[data-accion="puntos"]');
  } else {
    if (!fallar) for (const [i, f] of q.frases.entries()) if (f.mal) await pulsar(pref + `[data-fr="${i}"]`);
    await pulsar(pref + '[data-accion="corregir"]');
  }
  if (q.tocar) {
    const tc = q.tocar;
    if (fallarTocar) {
      await pulsar(pref + '[data-accion="comprobar"]'); await pulsar(pref + '[data-accion="comprobar"]');
      ok(await p.evaluate(() => /cuenta como fallo/.test(document.getElementById('vso-q-fin')?.textContent || '')), `${q.id}: el «compruébalo» fallado cuenta como fallo`);
    } else {
      for (const m of tc.mandos) {
        if (m === 'tiempo') await pulsar(pref + `[data-mando="tiempo"][data-v="${tc.bueno.t}"]`);
        else if (m.startsWith('estado|')) await pulsar(pref + `[data-mando="estado"][data-v="${m.split('|')[1]}"]`);
      }
      await pulsar(pref + '[data-accion="comprobar"]');
      ok(await p.evaluate(() => /Comprobado/.test(document.getElementById('vso-q-fin')?.textContent || '')), `${q.id}: se comprueba en el vaso`);
    }
  }
  await p.waitForTimeout(REDUCIDO ? 30 : 200);
  const dsb = await desborde(); if (dsb > 0) ok(false, `desborde de ${dsb} px tras contestar ${donde}`); else nDesbordeOk++;
  const tr = await T();
  if (tr.ocultos.length) ok(false, `${donde}: siguen tapadas ${tr.ocultos.join(', ')} tras contestar`);
  const txt = await p.evaluate(() => document.getElementById('vso-preg').textContent);
  if (/maqueta|§|\b(mh|mar)-[a-z]/.test(txt)) ok(false, `${donde}: un nombre interno a la vista`);
  if (!await p.evaluate(() => document.querySelectorAll('#vso-preg .vso-ir-texto').length > 0)) ok(false, `${donde}: sin «Ver en el texto» enlazado`);
  if (foto1) { await p.waitForTimeout(REDUCIDO ? 100 : 600); await p.evaluate(() => document.querySelector('#vso-preg [data-accion="sig"]').scrollIntoView({ block: 'end' })); await foto(foto1 + '-despues'); }
  if (antesDeSeguir) { const f = antesDeSeguir; antesDeSeguir = null; await f(); }
  await pulsar(pref + '[data-accion="sig"]');
};
let antesDeSeguir = null;   // una comprobación extra antes de «Siguiente» (la caja de la consecuencia)
for (const [i, q] of PREGUNTAS.entries()) {
  const html = await p.evaluate(() => document.getElementById('vso-preg').innerHTML);
  if (/data-correcta|data-mal|data-ok/.test(html)) ok(false, `${q.id}: la respuesta está escrita en el HTML`);
  await contestar(q, FALLAR.has(q.id), q.id === 'vso-p1' ? '11-pregunta-predice' : q.id === 'trb-g4' ? '11-pregunta' : null, q.id === FALLAR_TOCAR);
}
t = await T();
ok(t.fase === 'repaso', `tras las ${PREGUNTAS.length}, pasa al repaso`);
ok(await p.evaluate(() => document.querySelectorAll('#vso-preg [data-rep]').length) === 4, 'el repaso trae las 4 falladas (3 + el «compruébalo» fallado)');
await foto('12-repaso');
for (const id of [...FALLAR, FALLAR_TOCAR]) {
  await pulsar(`#vso-preg [data-rep="${id}"]`);
  await contestar(PREGUNTAS.find(q => q.id === id), false, null, false, 'repaso ' + id);
}
ok(await p.evaluate(() => /No queda nada por repasar/.test(document.getElementById('vso-preg').textContent)), 'el repaso se vacía al acertarlas');
t = await T();
ok(Object.keys(t.guardado).length === PREGUNTAS.length && Object.values(t.guardado).filter(g => g.resultado === 'mal').length === 4, `localStorage: ${PREGUNTAS.length} guardadas, 4 falladas`);

// 11. Los 3 casos hasta «Lo que te llevas» (fallando el primer paso de cada uno)
await pulsar('#vso-preg [data-ir="casos"]');
for (const [k, C] of CASOS.entries()) {
  await pulsar(`#vso-preg [data-caso="${k}"]`);
  for (const [j, paso] of C.pasos.entries()) {
    if (paso.calculadora && !await p.evaluate(() => !!document.querySelector('#vso-preg [data-resaltar]'))) ok(false, `${C.id} paso ${j + 1}: sin el enlace a la calculadora`);
    await contestar({ ...paso.pregunta, ocultar: paso.ocultar }, j === 0, k === 1 && j === 2 ? '13-caso-giro' : null, false, `${C.id} paso ${j + 1}`);
  }
  ok(await p.evaluate(() => /Lo que te llevas/.test(document.getElementById('vso-preg').textContent)), `el caso ${C.id} llega a «Lo que te llevas»`);
  ok(await p.evaluate(() => !!document.querySelector('#vso-preg [data-tab][data-especialidad="home"]')), `${C.id}: «Repasar en la ficha» enlaza con su ficha`);
  if (await desborde() > 0) ok(false, `desborde en «Lo que te llevas» del caso ${C.id}`);
  if (k === 1) {
    await p.evaluate(() => document.getElementById('vso-preg').scrollIntoView({ block: 'start' })); await p.waitForTimeout(200);
    await foto('14-fin-caso');
    await pulsar('#vso-preg [data-fin="modelo"]'); await p.waitForTimeout(300);
    const v = await T();
    ok(v.modo === 'explorar' && v.estado.rep === 'recambio', `volver del caso de Inés al vaso: Explorar en el recambio (${v.estado.rep})`);
    await pulsar('#vso-modo-preguntas'); await pulsar('#vso-preg [data-ir="casos"]');
  } else if (k < CASOS.length - 1) await pulsar('#vso-preg [data-fin="otro"]');
}
// 11b. La revisión por objetivos al cerrar el caso (core/mayeutica-motor.js), con Inés (H4)
const objetivosFin = () => p.evaluate(() => [...document.querySelectorAll('#vso-preg [data-objetivo]')].map(li => ({ id: li.dataset.objetivo, ok: li.dataset.cumplido === 'true', txt: li.textContent.replace(/\s+/g, ' ').trim(), cita: !!li.querySelector('.cita-ir[data-resaltar]') })));
const INES = CASOS.find(c => c.id === 'h4'), kInes = CASOS.indexOf(INES);
const iCons = INES.pasos.findIndex(pa => pa.pregunta.opciones?.some(o => o.consecuencia));
const opCons = INES.pasos[iCons].pregunta.opciones.find(o => o.consecuencia);
const abrirInes = async () => { await pulsar('#vso-preg [data-fin="otro"]'); await pulsar(`#vso-preg [data-caso="${kInes}"]`); };
await abrirInes();
for (const [j, paso] of INES.pasos.entries()) await contestar({ ...paso.pregunta, ocultar: paso.ocultar }, false, null, false, `Inés todo bien paso ${j + 1}`);
let ob = await objetivosFin();
ok(ob.length === INES.objetivos.length && ob.every(o => o.ok && /✓ Cumplido/.test(o.txt) && o.cita), `Inés todo bien: los ${ob.length} objetivos ✓ con «Ver en la ficha» (${ob.filter(o => !o.ok).map(o => o.id).join(', ')})`);
ok(await p.evaluate(() => { const t = document.getElementById('vso-preg').textContent; return t.indexOf('Revisión por objetivos') < t.indexOf('Lo que te llevas') && !/\d+ de \d+ objetivos|%/.test(document.querySelector('#vso-preg .vso-objetivos').textContent.replace(/\d+ (h|min|mg|mL)/g, '')); }), 'Inés: los objetivos van arriba de «Lo que te llevas», sin nota ni recuento');
// La opción con consecuencia: transfundir plaquetas ya, con una microangiopatía por delante -> más microtrombos
const vigilar = async () => {
  const v = await T();
  ok(v.estado.causa === 'mat' && v.estado.rep === 'lena' && v.celdas.amenaza !== undefined, `consecuencia: el vaso pasa a la microangiopatía con las plaquetas repuestas (${v.estado.causa}, ${v.estado.rep})`);
  const nud = await p.evaluate(() => { const d = window.__vsoPruebas(); return d; });
  const caja = await p.evaluate(() => { const c = document.querySelector('#vso-preg .vso-consecuencia'); return c && { txt: c.textContent, cita: !!c.querySelector('.cita-ir[data-resaltar]'), visible: c.offsetParent !== null }; });
  ok(caja && caja.visible && /⚠ Lo que acaba de pasar/.test(caja.txt) && caja.cita, 'consecuencia: sale la caja «⚠ Lo que acaba de pasar» con «Ver en la ficha»');
  await p.evaluate(() => document.querySelector('#vso-preg .vso-consecuencia').scrollIntoView({ block: 'center' })); await foto('15-consecuencia');
};
await abrirInes();
for (const [j, paso] of INES.pasos.entries()) {
  if (j === iCons) antesDeSeguir = vigilar;
  await contestar({ ...paso.pregunta, ocultar: paso.ocultar }, false, null, false, `Inés consecuencia paso ${j + 1}`, j === iCons ? opCons.t : null);
  if (j === iCons) { const v = await T(); ok(v.estado.rep !== 'lena', `al pasar al paso siguiente, el vaso vuelve a su estado (${v.estado.causa}, ${v.estado.rep || 'sin reposición'})`); }
}
ob = await objetivosFin();
const pl = ob.find(o => o.id === 'plaquetas');
ok(pl && !pl.ok && /✗ Falta/.test(pl.txt) && new RegExp(`paso ${iCons + 1}`).test(pl.txt) && /⚠ Lo que pasó/.test(pl.txt), 'Inés con las plaquetas: «plaquetas» ✗ con su porqué, el paso y la consecuencia');
ok(ob.filter(o => o.id === 'ptt').every(o => o.ok), 'Inés con las plaquetas: «PTT» ✓');
await p.evaluate(() => document.querySelector('#vso-preg .vso-objetivos').scrollIntoView({ block: 'start' })); await foto('16-objetivos');
if (await desborde() > 0) ok(false, 'desborde en la revisión por objetivos');
const nRespuestas = PREGUNTAS.length + 4 + CASOS.reduce((a, c) => a + c.pasos.length, 0);
ok(nDesbordeOk >= nRespuestas, `sin desborde tras contestar en ${nDesbordeOk} de ${nRespuestas} respuestas y pasos`);

// 12. Lo guardado sigue al recargar
await p.reload(); await p.waitForFunction(() => window.__vsoPruebas);
await p.click('#btn-libros'); await p.click('#btn-libro-marino'); await p.click('#lib-pest-vivos'); await p.click('#vso-menu-libros'); await p.waitForTimeout(300);
await pulsar('#vso-modo-preguntas'); await p.waitForTimeout(200);
ok(await p.evaluate(n => new RegExp(`Seguir \\(${n} de ${n}\\)`).test(document.getElementById('vso-preg').textContent), PREGUNTAS.length), `tras recargar, la Mayéutica recuerda las ${PREGUNTAS.length}`);
await pulsar('#vso-modo-explorar');
// Las lupas abren y cierran sin desbordar
for (const l of ['herida', 'cascada', 'plaqueta', 'frotis', 'tubo', 'complemento']) {
  await pulsar(`[data-vso-lupa="${l}"]`); await espera(400);
  ok((await T()).lupa === l && await desborde() <= 0, `la lupa «${l}» abre sin desbordar`);
}
await pulsar('[data-vso-lupa="complemento"]'); await p.waitForTimeout(100);
ok((await T()).lupa !== 'complemento', 'pulsar otra vez la lupa abierta la cierra');
ok(errores.length === 0, `0 errores de consola (${errores.length}) ${errores.slice(0, 3).join(' | ')}`);
const ids = await p.evaluate(() => { const v = {}; document.querySelectorAll('[id]').forEach(e => { v[e.id] = (v[e.id] || 0) + 1; }); return Object.keys(v).filter(k => v[k] > 1); });
ok(ids.length === 0, 'sin ids repetidos ' + ids.join(','));

// 13. «← VOLVER» desde una ficha: vuelve a la ficha, abierta
for (const [tab, est] of [['merino-trombocitopenia', 'sepsis'], ['merino-plaquetas-plasma', 'warfarina']]) {
  await abrirFicha(tab); await p.waitForTimeout(700);
  await pulsar(`#${tab} [data-vaso-vivo="${est}"]`); await espera(900);
  const txtVolver = await p.evaluate(() => document.getElementById('vso-volver').textContent);
  await pulsar('#vso-volver'); await p.waitForTimeout(900);
  ok(await p.evaluate(t => { const e = document.getElementById(t); return e.classList.contains('active') && !!e.offsetParent; }, tab) && /FICHA/.test(txtVolver), `«${txtVolver}» desde ${tab} vuelve a la ficha, abierta y visible`);
}
await p.evaluate(() => document.querySelector('#vso-menu-libros').click()); await p.waitForTimeout(300);
ok(await p.evaluate(() => document.getElementById('vso-volver').textContent === '← VOLVER'), 'desde el menú, «← VOLVER» lleva al menú');
ok(errores.length === 0, `0 errores de consola al final (${errores.length}) ${errores.slice(0, 3).join(' | ')}`);
await ctx.close();
fallosTotales.push(...fallos.map(f => `${tag}: ${f}`));
}

try {
  await correr(390, false);
  await correr(360, true);
} catch (e) { fallosTotales.push('la prueba se cortó: ' + e.message); console.log('❌ ' + e.message); }
await b.close();
console.log(fallosTotales.length ? `\n❌ ${fallosTotales.length} fallo(s)` : '\n✅ el vaso que sangra: todo bien');
process.exit(fallosTotales.length ? 1 : 0);
