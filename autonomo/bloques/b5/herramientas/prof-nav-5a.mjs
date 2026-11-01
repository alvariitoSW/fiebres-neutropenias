// Profesor (b5, grupo 5A, vuelta b5-5a-r): recorre el Estudiar de las 4 fichas del hígado a 390 px, contesta la guía, el examen
// y los casos (fallando algunas a propósito), y vuelca en texto lo que ve el residente: cabecera, orden y largo de las opciones,
// los botones «Compruébalo» (solo después de contestar), las etiquetas de «Ver en el texto» (y si el id existe), lo nuevo en rojo
// de cada paso del caso, «Lo que te llevas» y la vuelta; mide el desborde lateral tras cada respuesta. Hace ≤8 capturas.
// Uso: node autonomo/bloques/b5/herramientas/prof-nav-5a.mjs <carpeta-capturas> [puerto] [ancho]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [DIR, PORT = '8742', ANCHO = '390'] = process.argv.slice(2);
const { MAYEUTICA_B5_5A_1 } = await import(new URL('../../../../js/data/mayeutica/b5-5a-1.js', import.meta.url));
const { MAYEUTICA_B5_5A_2 } = await import(new URL('../../../../js/data/mayeutica/b5-5a-2.js', import.meta.url));
const DATOS = { ...MAYEUTICA_B5_5A_1, ...MAYEUTICA_B5_5A_2 };
const FICHAS = Object.keys(DATOS);
const FALLAR = new Set(['fha-g6', 'fha-e3', 'eh-g5', 'eh-e4', 'var-g3', 'var-e5', 'pbe-g2', 'pbe-e4', 'fha-c3b', 'eh-c3', 'var-c1-2', 'pbe-c2-6']);
const CAPS = { 'eh-g3': 'eh-g3-compruebalo', 'fha-c3b': 'fha-c3b-error', 'eh-c5': 'eh-c5-giro', 'pbe-e4': 'pbe-e4-fallada', 'pbe-c2-7': 'pbe-c2-7-giro' };
const txt = h => String(h).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const errores = []; const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: +ANCHO, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
const p = await ctx.newPage();
p.on('console', m => m.type() === 'error' && !m.text().startsWith('Failed to load') && errores.push(m.text())); p.on('pageerror', e => errores.push(String(e)));
await p.addInitScript(() => { localStorage.removeItem('mayeutica-fichas-v1'); });
await p.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
const out = []; const log = s => { out.push(s); console.log(s); };
const esp = ms => p.waitForTimeout(ms);
let nCap = 0; const cap = async n => { if (nCap >= 8) return; nCap++; await p.screenshot({ path: `${DIR}/${n}.png` }); };
const desborde = () => p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
let raiz = '';
const Z = paso => `${raiz} .est-paso[data-paso="${paso}"] .may-zona`;
const ver = (sel, n = 1400) => p.evaluate(([s, n]) => (document.querySelector(s)?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, n), [sel, n]);
const clic = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e || e.disabled) return false; e.scrollIntoView({ block: 'center' }); e.click(); return true; }, sel);
const hay = sel => p.evaluate(s => !!document.querySelector(s), sel);

async function abrirFicha(tab) {
  await p.evaluate(tab => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'marinoAbdomen', panel: 'panel-marino-abd-tabs', tab }); document.body.append(t); t.click(); t.remove(); }, tab);
  await esp(900);
  raiz = `#${tab} > .vista-estudiar`;
  const ok = await clic(`#${tab} > .vista-toggle button[data-vista="estudiar"]`); await esp(700);
  log(`\n==================== FICHA ${tab} · Estudiar abierto: ${ok} · desborde ${await desborde()} px`);
  log(`CABECERA: ${await ver(`${raiz} .est-cabeza`, 500)}`);
  log(`RESUMEN: ${await ver(`${raiz} .est-resumen`, 600)}`);
}
async function contestar(zona, q, bien, et) {
  const cab = await ver(zona, 320);
  const antes = await p.evaluate(s => document.querySelectorAll(`${s} .may-modelo`).length, zona);
  log(`\n--- ${et} [${q.tipo}]${antes ? ' !! BOTÓN DEL MODELO ANTES DE CONTESTAR' : ''}\n${cab}`);
  if (q.tipo === 'test') {
    await clic(`${zona} [data-accion="ops"]`); await esp(200);
    const ops = await p.evaluate(s => [...document.querySelectorAll(s + ' [data-op]')].map(b => b.textContent.trim()), zona);
    const buena = txt(q.opciones.find(o => o.ok).t); const iOk = ops.findIndex(t => txt(t) === buena);
    log(`opciones ${ops.length} (buena en pos ${iOk + 1}; largos ${ops.map(o => o.length).join('/')})`);
    const i = bien ? iOk : ops.findIndex((t, k) => k !== iOk);
    await p.evaluate(([s, i]) => document.querySelector(`${s} [data-op="${i}"]`).click(), [zona, i]);
  } else if (q.tipo === 'destapa') {
    await clic(`${zona} [data-accion="destapa"]`); await esp(200);
    await p.evaluate(([s, bien]) => document.querySelectorAll(`${s} input[data-p]`).forEach((x, i) => { if (bien || i === 0) x.checked = true; }), [zona, bien]);
    await clic(`${zona} [data-accion="puntos"]`);
  } else {
    await p.evaluate(([s, mal, bien]) => document.querySelectorAll(`${s} [data-fr]`).forEach((b, i) => { if (bien ? mal[i] : (!mal[i] && i === 0)) b.click(); }), [zona, q.frases.map(f => !!f.mal), bien]);
    await clic(`${zona} [data-accion="corregir"]`); await esp(150);
    log(`error, tras corregir: ${(await ver(zona, 1800)).slice(-600)}`);
    await p.evaluate(s => document.querySelectorAll(`${s} [data-ver]`).forEach(b => b.click()), zona);
  }
  await esp(350);
  const r1 = await ver(zona, 2600); const k = Math.max(0, r1.indexOf(bien ? '✓' : '✗') - 10);
  log(`respuesta (${bien ? 'bien' : 'MAL a propósito'}): …${r1.slice(k, k + 600)}`);
  const modelos = await p.evaluate(s => [...document.querySelectorAll(`${s} .may-modelo`)].map(b => `${b.textContent.trim()} [${Object.entries(b.dataset).filter(([k]) => !['especialidad', 'view'].includes(k)).map(([k, v]) => `${k}=${v}`).join(' ')}]`), zona);
  if (modelos.length) log(`modelos: ${modelos.join(' | ')}`);
  const calc = await p.evaluate(s => [...document.querySelectorAll(`${s} .may-calc, ${s} [data-calc], ${s} button`)].filter(b => /calculadora|Calcula|🧮|🔎|🧭|✅/.test(b.textContent)).map(b => b.textContent.trim().slice(0, 80)), zona);
  if (calc.length) log(`calculadora: ${calc.join(' | ')}`);
  const fuente = await p.evaluate(s => [...document.querySelectorAll(`${s} .may-fuente`)].map(f => f.innerText.replace(/\s+/g, ' ').trim()).join(' || '), zona);
  log(`ver en el texto: ${fuente || 'NINGUNO'}`);
  const rotas = await p.evaluate(s => [...document.querySelectorAll(`${s} [data-may-texto], ${s} [data-resaltar]`)].map(b => b.dataset.mayTexto || b.dataset.resaltar.slice(1)).filter(id => !document.getElementById(id)), zona);
  if (rotas.length) log(`!! CITAS ROTAS: ${rotas.join(', ')}`);
  const pdf = await p.evaluate(s => document.querySelectorAll(`${s} a.biblio-link`).length, zona);
  log(`enlaces PDF: ${pdf} · desborde ${await desborde()} px`);
  if (CAPS[q.id]) { await p.evaluate(s => document.querySelector(`${s} [data-accion="sig"]`)?.scrollIntoView({ block: 'end' }), zona); await esp(200); await cap(CAPS[q.id]); }
}
for (const tab of FICHAS) {
  const D = DATOS[tab];
  await abrirFicha(tab);
  if (tab === FICHAS[0]) await cap('0-estudiar-primera');
  // Juega
  await clic(`${raiz} .est-ir[data-ir-paso="juega"]`); await esp(500);
  log(`JUEGA: ${await ver(`${raiz} .est-paso[data-paso="juega"]`, 900)}`);
  // Piensa
  await clic(`${raiz} .est-ir[data-ir-paso="piensa"]`); await esp(500);
  log(`PIENSA inicio: ${await ver(Z('piensa'), 300)}`);
  await clic(`${Z('piensa')} [data-ir="seguir"]`); await esp(400);
  for (let i = 0; i < D.guia.length; i++) { const q = D.guia[i]; await contestar(Z('piensa'), q, !FALLAR.has(q.id), `guía ${i + 1}/${D.guia.length} ${q.id} «${q.corto}»`); await clic(`${Z('piensa')} [data-accion="sig"]`); await esp(350); }
  log(`PIENSA fin: ${await ver(Z('piensa'), 300)}`);
  // Examen
  await clic(`${raiz} .est-ir[data-ir-paso="examen"]`); await esp(500);
  await clic(`${Z('examen')} [data-ir="seguir"]`); await esp(400);
  for (let i = 0; i < D.examen.length; i++) { const q = D.examen[i]; await contestar(Z('examen'), q, !FALLAR.has(q.id), `examen ${i + 1}/${D.examen.length} ${q.id} «${q.corto}»`); await clic(`${Z('examen')} [data-accion="sig"]`); await esp(350); }
  log(`EXAMEN fin: ${await ver(Z('examen'), 500)}`);
  const chips = await p.evaluate(s => [...document.querySelectorAll(s + ' [data-rep]')].map(b => b.dataset.rep), Z('examen'));
  log(`REPASO chips: ${chips.join(', ') || 'ninguno'}`);
  // Casos
  await clic(`${raiz} .est-ir[data-ir-paso="caso"]`); await esp(500);
  log(`CASOS lista: ${await ver(Z('caso'), 500)}`);
  for (let k = 0; k < D.casos.length; k++) {
    const C = D.casos[k]; if (k) { await clic(`${Z('caso')} [data-fin="otro"]`); await esp(300); }
    await clic(`${Z('caso')} [data-caso="${k}"]`); await esp(500);
    for (let i = 0; i < C.pasos.length; i++) {
      const st = C.pasos[i];
      const nuevos = await p.evaluate(s => [...document.querySelectorAll(`${s} .may-cambia`)].map(x => x.textContent.trim()), Z('caso'));
      const fichaP = await ver(`${Z('caso')} .may-paciente`, 500);
      log(`\n### ${C.corto} paso ${i + 1}/${C.pasos.length} «${st.momento}» · en rojo: ${JSON.stringify(nuevos)}\n    ficha: ${fichaP}`);
      await contestar(Z('caso'), st.pregunta, !FALLAR.has(st.pregunta.id), `${C.corto} ${i + 1} ${st.pregunta.id}`);
      await clic(`${Z('caso')} [data-accion="sig"]`); await esp(450);
    }
    log(`\n== LO QUE TE LLEVAS (${C.corto}) ==\n${await ver(Z('caso'), 1200)}`);
    const fin = await p.evaluate(s => [...document.querySelectorAll(`${s} [data-fin], ${s} .may-modelo, ${s} .may-ir`)].map(b => `${b.textContent.trim().slice(0, 60)} [${Object.entries(b.dataset).map(([k, v]) => `${k}=${v}`).join(' ')}]`), Z('caso'));
    log(`botones finales: ${fin.join(' | ')}`);
    if (C.id === 'pbe-c2') await cap('pbe-c2-llevas');
    // la vuelta: el ancla existe?
    const ancla = await p.evaluate(id => !!document.getElementById(id), C.volver?.ancla || '');
    log(`vuelta ancla ${C.volver?.ancla}: ${ancla ? 'existe' : '!! NO EXISTE'}`);
  }
  // Para profundizar
  await p.evaluate(s => { const d = document.querySelector(`${s} .may-profundizar`); if (d) d.open = true; }, raiz); await esp(300);
  log(`PROFUNDIZAR: ${await ver(`${raiz} .may-profundizar`, 700)}`);
}
log(`\nERRORES DE CONSOLA: ${errores.length ? errores.join('\n') : 'ninguno'}`);
await b.close();
