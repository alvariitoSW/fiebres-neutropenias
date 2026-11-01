// Prueba de navegador del ácido-base vivo (juez de autonomo/jueces.mjs --modelo acidobase-vivo).
// Uso: node autonomo/pruebas/acidobase-vivo.mjs <url-base> [--capturas <carpeta>]
// Recorre, a 390 px (con movimiento) y a 360 px (con «reducir movimiento»), cada uno en un contexto limpio:
// accesos (menús de Nefrología y Marino, buscador, 7 fichas con su estado, su vista y su anillo), el riñón,
// la Mayéutica entera fallando 3 con su repaso, el caso de Lucía hasta «Lo que te llevas» y su vuelta al modelo,
// lo guardado tras recargar y el «← VOLVER» a la ficha. Mide el desborde lateral (0 px) tras cada respuesta, el
// repaso y cada paso del caso, y los errores de consola. Sale con código 1 si algo falla.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const { PREGUNTAS, CASOS } = await import(new URL('../../js/data/acidobase-vivo-data.js', import.meta.url));
const args = process.argv.slice(2);
const BASE = (args.find(a => /^https?:/.test(a)) || 'http://localhost:8000/').replace(/\/?$/, '/');
const CAPTURAS = args.includes('--capturas') ? args[args.indexOf('--capturas') + 1].replace(/\/?$/, '/') : null;
const nav = await chromium.launch();
const fallosTotales = [];

async function correr(ancho, rm) {
const suf = `${ancho}${rm ? '-rm' : ''}`;
console.log(`\n── ${ancho} px${rm ? ' · reducir movimiento' : ''}`);
const ctx = await nav.newContext({ viewport: { width: ancho, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: rm ? 'reduce' : 'no-preference' });
const pag = await ctx.newPage();
const err = [], fallos = [];
const ok = (c, t) => { console.log(`${c ? '✅' : '❌'} ${t}`); if (!c) fallos.push(t); };
pag.on('pageerror', e => err.push('page: ' + e.message));
pag.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) err.push('console: ' + m.text()); });
const espera = ms => pag.waitForTimeout(rm ? Math.min(ms, 300) : ms);
const P = () => pag.evaluate(() => window.__abvPruebas());
const desborda = () => pag.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const visible = () => pag.evaluate(() => !!document.getElementById('abv-raiz')?.offsetParent);
const pulsar = d => pag.evaluate(d => { const b = document.createElement('button'); for (const [k, v] of Object.entries(d)) b.dataset[k] = v; document.body.appendChild(b); b.click(); b.remove(); }, d);
const clic = sel => pag.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no está: ' + s); e.click(); }, sel);
const foto = n => CAPTURAS ? pag.screenshot({ path: `${CAPTURAS}abv-${n}-${suf}.png` }) : null;

await pag.goto(BASE); await pag.waitForTimeout(1500);   // contexto nuevo: localStorage vacío

// ── 1. Desde el menú de Nefrología
await clic('#btn-pif'); await clic('#btn-nefrologia'); await espera(400);
await pag.evaluate(() => document.getElementById('abv-menu-nefro').scrollIntoView({ block: 'center' }));
await foto('menu-nefro');
await clic('#abv-menu-nefro'); await espera(2500);
ok(await visible(), 'abre desde el menú de Nefrología');
await pag.evaluate(() => window.scrollTo(0, 0)); await espera(300);
await foto('primera');
ok(await desborda() <= 0, `sin desborde en la primera pantalla (${await desborda()})`);
// ── 2. Desde el menú de Marino (Libros)
await clic('.btn-volver-especialidades'); await clic('#btn-libros'); await clic('#btn-libro-marino'); await clic('#lib-pest-vivos'); await espera(400);
await pag.evaluate(() => document.getElementById('abv-menu-libros').scrollIntoView({ block: 'center' }));
await foto('menu-marino');
await clic('#abv-menu-libros'); await espera(1500);
ok(await visible(), 'abre desde el menú de Marino');
// ── 3. Desde el buscador
for (const q of ['gasometría', 'pH', 'hiato aniónico', 'compensación', 'alcalosis', 'ácido-base vivo']) {
  await clic('#btn-buscar-global'); await espera(200);
  if (q !== 'gasometría' && !(await pag.evaluate(() => document.querySelector('.search-overlay.active')))) continue;
  await pag.fill('#search-input-el', q); await espera(250);
  const pos = await pag.evaluate(() => [...document.querySelectorAll('.search-result-row')].findIndex(r => r.querySelector('.search-result-title').textContent.startsWith('Ácido-base vivo')));
  ok(pos >= 0, `buscador «${q}»: encuentra el ácido-base vivo (puesto ${pos + 1})`);
  if (q === 'gasometría') {
    await pag.evaluate(i => document.querySelectorAll('.search-result-row')[i].click(), pos); await espera(1500);
    ok(await visible(), 'el resultado del buscador abre la herramienta');
  }
  else await clic('#search-close-btn');
}
// ── 4. Desde las fichas, cada una en su estado
const fichas = [
  ['libros', 'marinoRenal', 'panel-marino-renal-tabs', 'mr-alcalosis-mecanismos', p => p.causa === 'vomitos', 'abv-vista-rinon'],
  ['libros', 'marinoToxicos', 'panel-marino-tox-tabs', 'mt-salicilatos', p => p.causa === 'salic', 'abv-vista-carta'],
  ['libros', 'marinoToxicos', 'panel-marino-tox-tabs', 'mt-alcoholes', p => p.causa === 'metanol', 'abv-vista-osmoles'],
  ['libros', 'marinoRenal', 'panel-marino-renal-tabs', 'mr-lactato-bicarbonato', p => p.causa === 'bicarb', 'abv-vista-alveolo'],
  ['nefrologia', 'nefrona', 'panel-fisio-tabs', 'fisio-acidobase-acidosis', p => p.causa === 'diarrea', 'abv-vista-plasma'],
  ['libros', 'marinoRenal', 'panel-marino-renal-tabs', 'mr-acidobase-gaps', p => p.paso === '3', 'abv-vista-plasma'],
  ['libros', 'marinoRenal', 'panel-marino-renal-tabs', 'mr-cetoacidosis', p => p.paso === '1', 'abv-vista-plasma'],
];
for (const [especialidad, view, panel, tab, cond, vista] of fichas) {
  await pulsar({ especialidad, view, panel, tab }); await espera(700);
  await clic(`#${tab} [data-acidobase-vivo]`); await espera(4000);
  const p = await P();
  ok(await visible() && cond(p), `ficha ${tab} abre el estado de su tema (paso ${p.paso}, causa ${p.causa}, ${p.estado.etiqueta})`);
  const v = await pag.evaluate(id => { const r = document.getElementById(id).getBoundingClientRect(), a = document.querySelector('#abv-raiz .abv-anillo'), ra = a?.getBoundingClientRect();
    return { top: Math.round(r.top), anillo: !!a && !!a.closest('#' + id), anilloVisible: !!ra && ra.top >= 0 && ra.bottom <= innerHeight - 100 }; }, vista);
  ok(v.top >= 0 && v.top < 200 && v.anillo && v.anilloVisible, `  ${tab}: baja a ${vista} (arriba a ${v.top} px) con el anillo a la vista (${v.anillo}, ${v.anilloVisible})`);
  if (tab === 'mr-alcalosis-mecanismos' || tab === 'mt-alcoholes') await foto('entrada-' + tab);
  ok(await desborda() <= 0, `sin desborde tras ${tab}`);
}
// caa: cetoacidosis alcohólica desde su ficha + barrido de extremos de los mandos
await pulsar({ especialidad: 'libros', view: 'marinoRenal', panel: 'panel-marino-renal-tabs', tab: 'mr-cetoacidosis' }); await espera(700);
await clic('#mr-caa-ver'); await espera(4000);
{ const p = await P(); ok(await visible() && p.causa === 'caa' && p.estado.hco3 === 18, `ficha caa abre la cetoacidosis alcohólica (causa ${p.causa})`);
  const fv = await pag.evaluate(() => document.querySelector('#abv-raiz .abv-frase, #abv-raiz [id*="frase"]')?.innerText || document.getElementById('abv-raiz').innerText);
  ok(/nitroprusiato/.test(fv) && /casi normal/.test(fv), 'caa: la frase viva dice nitroprusiato negativo y pH casi normal');
  const rangos = await pag.$$('#abv-raiz input[type=range]'); let mal = 0;
  for (const r of rangos) for (const ext of ['min', 'max']) {
    await r.evaluate((el, e) => { el.value = el[e]; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }, ext);
    await espera(150); const q = await P(); if (!isFinite(q.estado.hco3) || !isFinite(q.estado.paco2) || await desborda() > 0) mal++; }
  ok(mal === 0 && rangos.length > 0, `caa: barrido de ${rangos.length} mandos a sus extremos sin desborde ni cifras rotas`); }
// paso del riñón (paso 4, vómitos → célula del colector)
await pulsar({ especialidad: 'nefrologia', view: 'acidobase', acidobaseVivo: 'paso-4' }); await espera(5000);
ok((await P()).estado.obj === 'rinon', 'el paso 4 abre el riñón');
await pag.evaluate(() => document.getElementById('abv-rinon').scrollIntoView({ block: 'start' })); await espera(1500);
await foto('rinon-vomitos');
await clic('#abv-raiz [data-nivel="1"]'); await espera(900); await foto('rinon-nefrona');
await clic('#abv-raiz [data-nivel="2"]'); await clic('#abv-raiz [data-tramo="proximal"]'); await espera(900); await foto('rinon-celula-proximal');
await clic('#abv-raiz [data-tramo="colector"]');
const part = (await P()).particulas;
ok(part.total <= 250, `partículas ≤ 250 (${part.total})`);

// ── 5. Mayéutica: el recorrido entero, fallando 3
await pag.evaluate(() => window.scrollTo(0, 0));
await clic('.abv-interruptor [data-modo="preguntas"]'); await espera(900);
const FALLAR = { 'ab-02': 'test', 'ab-03': 'destapa', 'ab-08': 'error' };
const mid = v => Array.isArray(v) ? (v[0] + v[1]) / 2 : v;
async function hacerTocar(q) {
  for (const et of [].concat(q.tocar)) {
    await espera(rm ? 200 : 3000);
    const orden = Object.keys(et.comprobar).filter(k => k !== 'ph');
    if (et.comprobar.ph) orden.push(et.mandos[0]);
    for (const k of orden) {
      let v = et.comprobar[k];
      if (k === et.mandos[0] && et.comprobar.ph) v = et.comprobar.ph[0] === 6.98 ? 9.6 : 16;
      if (k === 'aniones' || (et.mandos[0] === 'aniones')) { await pag.evaluate(() => { const i = document.querySelector('#abv-q-tocar input[data-mando="aniones"]'); i.value = 12; i.dispatchEvent(new Event('input', { bubbles: true })); }); break; }
      if (typeof v === 'string') { await clic(`#abv-q-tocar button[data-mando="${k}"][data-v="${v}"]`); }
      else await pag.evaluate(([k, v]) => { const i = document.querySelector(`#abv-q-tocar input[data-mando="${k}"]`); i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); }, [k, mid(v)]);
      await espera(300);
    }
    await clic('#abv-q-tocar [data-q="comprobar"]:not([disabled])');
  }
  await espera(rm ? 300 : 1600);
}
let contestadas = 0;
async function responder(q, bien, fotoN) {
    await espera(rm ? 200 : 900);
  if (fotoN) await foto(fotoN + '-antes');
  if (q.tipo === 'test') {
    await clic('[data-q="ops"]'); await espera(200);
    const i = q.opciones.findIndex(o => bien ? o.ok : !o.ok);
    await clic(`#abv-q-ops [data-op="${i}"]`);
    if (q.tocar) await hacerTocar(q);
  } else if (q.tipo === 'destapa') {
    await clic('[data-q="destapa"]');
    await pag.evaluate(b => document.querySelectorAll('#abv-q-pts input').forEach((c, i) => { c.checked = b || i > 0; }), bien);
    await clic('[data-q="hecho"]');
  } else {
    for (const [i, f] of q.frases.entries()) if (bien ? f.mal : !f.mal && i === 0) await clic(`.abv-frase-err[data-fr="${i}"]`);
    await clic('[data-q="corregir"]');
    const cor = await pag.$('[data-cor]'); if (cor) await cor.click();
  }
  await espera(400);
  const dsb = await desborda(); if (dsb > 0) ok(false, `desborde ${dsb}px tras contestar ${q.id || q.enunciado.slice(0, 30)}`); else contestadas++;
  if (fotoN) { await pag.evaluate(() => document.getElementById('abv-q-res').scrollIntoView({ block: 'center' })); await foto(fotoN + '-despues'); }
  if (!(await pag.$('[data-sig]'))) console.log('  sin data-sig:', await pag.evaluate(() => document.getElementById('abv-q-tocar')?.innerText + ' / ' + JSON.stringify(window.__abvPruebas().estado)));
  await clic('[data-sig]');
}
for (const [i, q] of PREGUNTAS.entries()) await responder(q, !FALLAR[q.id], i === 4 ? 'pregunta' : null);
await espera(600);
const repaso = await pag.evaluate(() => [...document.querySelectorAll('[data-repaso]')].map(b => b.dataset.repaso));
ok(repaso.join() === 'ab-02,ab-03,ab-08', `el repaso trae las 3 falladas (${repaso.join()})`);
await foto('repaso');
await clic('[data-repaso="ab-02"]'); await responder(PREGUNTAS.find(q => q.id === 'ab-02'), true); await espera(500);
const repaso2 = await pag.evaluate(() => [...document.querySelectorAll('[data-repaso]')].map(b => b.dataset.repaso));
ok(repaso2.join() === 'ab-03,ab-08', `acertada en el repaso, sale de él (${repaso2.join()})`);
ok(await pag.evaluate(() => !document.querySelector('[data-correcta], [data-mal]')), 'sin data-correcta ni data-mal en el HTML');

// ── 6. Un caso entero (Lucía) hasta «Lo que te llevas»
await clic('[data-ir="casos"]'); await espera(400);
await clic('[data-caso="0"]');
for (const p of CASOS[0].pasos) await responder(p.pregunta, true);
await espera(600);
const lleva = await pag.evaluate(() => document.querySelector('#abv-preg .abv-lleva')?.children.length);
ok(lleva === 3, `el caso llega a «Lo que te llevas» (${lleva} puntos)`);
await pag.evaluate(() => document.querySelector('#abv-preg .abv-lleva').scrollIntoView({ block: 'center' }));
await foto('caso-final');
ok(await desborda() <= 0, `sin desborde en la Mayéutica (${await desborda()})`);
// abrir el modelo en el estado del paciente
await clic('[data-abrir-modelo]'); await espera(2500);
const rot = await pag.evaluate(() => document.getElementById('abv-paso-nombre').textContent);
ok((await P()).modo === 'explorar' && /Lucía/.test(rot), `el final del caso abre el modelo en el estado del paciente («${rot}»)`);
ok(contestadas > 20, `sin desborde tras cada una de las ${contestadas} respuestas (recorrido, repaso y pasos del caso)`);

// ── 7. Recarga: lo guardado sigue
await pag.reload(); await pag.waitForTimeout(1500);
await pulsar({ especialidad: 'nefrologia', view: 'acidobase', acidobaseVivo: 'mayeutica' }); await espera(1500);
const marcas = await pag.evaluate(() => ({ on: document.querySelectorAll('#abv-est-prog .abv-on').length, mal: document.querySelectorAll('#abv-est-prog .abv-mal').length }));
ok(marcas.on === 12 && marcas.mal === 2, `al recargar, siguen 12 aciertos y 2 fallos (${JSON.stringify(marcas)})`);
await clic('#abv-est-ant'); // nada
await pag.evaluate(() => [...document.querySelectorAll('[data-sig], [data-ir]')]);

// ── 8. «← VOLVER» desde una ficha: vuelve a la ficha, abierta
await pulsar({ especialidad: 'libros', view: 'marinoRenal', panel: 'panel-marino-renal-tabs', tab: 'mr-alcalosis-mecanismos' }); await espera(900);
await clic('#mr-alcalosis-mecanismos [data-acidobase-vivo]'); await espera(3000);
const txtVolver = await pag.evaluate(() => document.getElementById('abv-volver').textContent);
await clic('#abv-volver'); await espera(1200);
const vuelta = await pag.evaluate(() => { const e = document.getElementById('mr-alcalosis-mecanismos'); return e.classList.contains('active') && !!e.offsetParent; });
ok(vuelta && /FICHA/.test(txtVolver), `«${txtVolver}» desde mr-alcalosis-mecanismos vuelve a la ficha, abierta y visible`);
// y desde el menú, VOLVER sigue llevando al mapa del riñón
await clic('.btn-volver-especialidades'); await clic('#btn-pif'); await clic('#btn-nefrologia'); await clic('#abv-menu-nefro'); await espera(1500);
await clic('#abv-volver'); await espera(500);
ok(await pag.evaluate(() => !!document.getElementById('nefro-kidney-view').offsetParent), 'desde el menú, «← VOLVER» lleva al mapa del riñón');

ok(!err.length, `sin errores de consola${err.length ? ':\n   ' + [...new Set(err)].join('\n   ') : ''}`);
await ctx.close();
fallosTotales.push(...fallos.map(f => `${suf}: ${f}`));
}

try {
  await correr(390, false);
  await correr(360, true);
} catch (e) { fallosTotales.push('la prueba se cortó: ' + e.message); console.log('❌ ' + e.message); }
await nav.close();
console.log(fallosTotales.length ? `\n❌ ${fallosTotales.length} fallo(s)` : '\n✅ ácido-base vivo: todo bien');
process.exit(fallosTotales.length ? 1 : 0);
