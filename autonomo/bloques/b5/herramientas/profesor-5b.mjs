// Profesor (b5-5b-r, juicio del Estudiar del grupo 5B · Marino abdomen): recorre Texto | Estudiar de las 5 fichas
// (pancreatitis dx y tto, colecistitis, infección intraabdominal, C. difficile) a 390 px, falla a propósito algunas
// preguntas y vuelca en texto lo que ve el residente: enunciado, orden visible de las opciones (y en qué posición cae la
// buena), el resultado, las citas «Ver en la ficha», el repaso, cada paso de los casos con lo que se marca en rojo y
// «Lo que te llevas». Hace ≤6 capturas en total. Adaptado de profesor-mayeutica.mjs y de autonomo/pruebas/mayeutica-fichas.mjs.
// Uso: node autonomo/bloques/b5/herramientas/profesor-5b.mjs <carpeta-capturas> [puerto]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const [DIR, PORT = '8765'] = process.argv.slice(2);
const { MAYEUTICA_ABDOMEN_1 } = await import(new URL('../../../../js/data/mayeutica/b5-abdomen-1.js', import.meta.url));
const { MAYEUTICA_ABDOMEN_2 } = await import(new URL('../../../../js/data/mayeutica/b5-abdomen-2.js', import.meta.url));
const { barajar } = await import(new URL('../../../../js/core/mayeutica-motor.js', import.meta.url));
const TODAS = { ...MAYEUTICA_ABDOMEN_1, ...MAYEUTICA_ABDOMEN_2 };
const FICHAS = ['ma-pancreatitis-dx', 'ma-pancreatitis-tto', 'ma-colecistitis', 'ma-infeccion-abdominal', 'ma-cdifficile'];
const NAV = { especialidad: 'libros', view: 'marinoAbdomen', panel: 'panel-marino-abd-tabs' };
// Capturas (≤6): { 'ficha|id-pregunta': nombre } se hace tras contestar; 'inicio' en la primera ficha; 'fin' en la última.
const CAPS = { 'ma-pancreatitis-tto|ptt-g4': '2-tto-g4-error-corregido', 'ma-colecistitis|leocadia-4': '3-cole-leocadia4-cero-errores', 'ma-cdifficile|prudencio-3': '4-cdi-prudencio3-error', 'ma-infeccion-abdominal|isidora-4': '5-iia-isidora4-giro' };
const txt = h => String(h).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const out = []; const log = s => { out.push(s); console.log(s); };
const errores = []; const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage();
p.on('console', m => m.type() === 'error' && !/favicon/.test(m.text()) && errores.push(m.text())); p.on('pageerror', e => errores.push('PAGE ' + e.message));
await p.goto(`http://localhost:${PORT}/index.html`); await p.waitForFunction(() => document.getElementById('ma-cdifficile')?.querySelector(':scope > .vista-estudiar'), null, { timeout: 20000 });
const esp = ms => p.waitForTimeout(ms);
const pulsar = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no hay ' + s); e.click(); }, sel);
const desborde = () => p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const ver = (sel, n = 1400) => p.evaluate(([s, n]) => (document.querySelector(s)?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, n), [sel, n]);
const cap = async (n, sel) => { if (sel) await p.evaluate(s => document.querySelector(s)?.scrollIntoView({ block: 'start' }), sel); await esp(350); await p.screenshot({ path: `${DIR}/${n}.png` }); log(`[captura ${n}]`); };
const abrirFicha = tab => p.evaluate(([t, nav]) => { const b = document.createElement('button'); Object.assign(b.dataset, { ...nav, tab: t }); document.body.append(b); b.click(); b.remove(); }, [tab, NAV]);
const PASO = (f, paso) => `#${f} .est-paso[data-paso="${paso}"]`;
let nCap = 0, desbordes = 0;
async function contestar(ficha, q, fallar, Z, et) {
  log(`\n--- ${et} [${q.tipo}] ${q.corto || ''}\n${await ver(Z, 420)}`);
  if (q.tipo === 'test') {
    await pulsar(`${Z} [data-accion="ops"]`);
    const ops = await p.evaluate(z => [...document.querySelectorAll(z + ' [data-op]')].map(b => b.textContent.trim()), Z);
    const buena = txt(q.opciones.find(o => o.ok).t); const iOk = ops.findIndex(t => txt(t) === buena);
    log(`opciones (buena en pos ${iOk + 1}; largos ${ops.map(o => o.length).join('/')}):\n  ${ops.map((o, i) => (i === iOk ? '* ' : '  ') + o).join('\n  ')}`);
    const orden = barajar(q.opciones, q.id); const k = orden.findIndex(o => fallar ? !o.ok : o.ok);
    await pulsar(`${Z} [data-op="${k}"]`);
  } else if (q.tipo === 'destapa') {
    if (await p.evaluate(z => !!document.querySelector(z + ' [data-accion="destapa"]'), Z)) await pulsar(`${Z} [data-accion="destapa"]`);
    log(`puntos: ${await ver(Z + ' .may-pts', 700)}`);
    await p.evaluate(([z, f]) => document.querySelectorAll(z + ' .may-pts input').forEach((c, i) => { c.checked = !f || i === 0; }), [Z, fallar]);
    await pulsar(`${Z} [data-accion="puntos"]`);
  } else {
    log(`frases: ${await ver(Z, 900)}`);
    const marcar = fallar ? [q.frases.findIndex(f => !f.mal)] : q.frases.map((f, i) => f.mal ? i : -1).filter(i => i >= 0);
    for (const i of marcar) await pulsar(`${Z} [data-fr="${i}"]`);
    await pulsar(`${Z} [data-accion="corregir"]`); await esp(150);
    log(`tras corregir (antes de «ver»): ${(await ver(Z, 1800)).slice(-600)}`);
    for (const i of q.frases.map((f, j) => f.mal ? j : -1).filter(j => j >= 0)) await pulsar(`${Z} [data-ver="${i}"]`);
  }
  await esp(280);
  const r = await p.evaluate(z => { const res = document.querySelector(z + ' .may-res'); return { txt: (res?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 900), sig: !!res?.querySelector('[data-accion="sig"]'), modelo: [...(res?.querySelectorAll('.may-modelo') || [])].map(m => m.textContent.trim()), ver: [...(res?.querySelectorAll('.may-ir') || [])].map(m => m.dataset.resaltar || m.dataset.tab || m.textContent.trim()) }; }, Z);
  log(`respuesta (${fallar ? 'MAL a propósito' : 'bien'}): ${r.txt}\n  siguiente ${r.sig} · modelos [${r.modelo.join(' | ')}] · ver-en [${r.ver.join(', ')}]`);
  const d = await desborde(); if (d > 0) { desbordes++; log(`!! DESBORDE ${d} px`); }
  const c = CAPS[`${ficha}|${q.id}`]; if (c && nCap < 6) { nCap++; await cap(c, Z + ' .may-res'); }
}
for (const [nf, ficha] of FICHAS.entries()) {
  const d = TODAS[ficha];
  await abrirFicha(ficha); await esp(500);
  const botones = await p.evaluate(f => [...document.querySelectorAll(`#${f} > .vista-toggle button`)].map(b => b.textContent).join('|'), ficha);
  log(`\n\n==================== ${ficha} · interruptor «${botones}» ====================`);
  log(`carril/primera pantalla del texto: ${await ver(`#${ficha} > .vista-texto`, 520)}`);
  await pulsar(`#${ficha} > .vista-toggle [data-vista="estudiar"]`); await esp(400);
  log(`ESTUDIAR resumen: ${await ver(`#${ficha} .est-resumen`, 600)}`);
  log(`MIRA: ${await ver(PASO(ficha, 'mira'), 500)}`);
  if (nf === 0 && nCap < 6) { nCap++; await cap('1-dx-estudiar-mira', `#${ficha} > .vista-toggle`); }
  await pulsar(`#${ficha} .est-ir[data-ir-paso="juega"]`); await esp(200);
  log(`JUEGA: ${await ver(PASO(ficha, 'juega'), 500)}`);
  await pulsar(`#${ficha} .est-ir[data-ir-paso="piensa"]`); await esp(200);
  const ZG = `${PASO(ficha, 'piensa')} .may-zona`, ZE = `${PASO(ficha, 'examen')} .may-zona`, ZC = `${PASO(ficha, 'caso')} .may-zona`;
  const FALLAR = new Set([d.guia[1].id, d.examen[0].id, d.examen.find(q => q.tipo === 'error')?.id].filter(Boolean));
  await pulsar(`${ZG} [data-ir="seguir"]`);
  const todas = [...d.guia, ...d.examen]; let Z = ZG;
  for (const [i, q] of todas.entries()) {
    if (i === d.guia.length) { log(`\nFIN GUÍA: ${await ver(ZG, 300)}`); await pulsar(`${ZG} [data-ir-paso="examen"]`); await esp(100); await pulsar(`${ZE} [data-ir="seguir"]`); Z = ZE; }
    await contestar(ficha, q, FALLAR.has(q.id), Z, `${ficha} ${i < d.guia.length ? 'guía' : 'examen'} ${q.id}`);
    await pulsar(`${Z} [data-accion="sig"]`);
  }
  log(`\nREPASO: ${await ver(ZE, 500)}`);
  const reps = await p.evaluate(z => [...document.querySelectorAll(z + ' [data-rep]')].map(b => b.dataset.rep), ZE);
  for (const id of reps) { await pulsar(`${ZE} [data-rep="${id}"]`); await contestar(ficha, todas.find(x => x.id === id), false, ZE, `${ficha} repaso ${id}`); await pulsar(`${ZE} [data-accion="sig"]`); }
  log(`TRAS REPASO: ${await ver(ZE, 200)}`);
  await pulsar(`${ZE} [data-ir-paso="caso"]`); await esp(100);
  for (const [k, caso] of d.casos.entries()) {
    if (k) await pulsar(`${ZC} [data-fin="otro"]`).catch(() => {});
    await pulsar(`${ZC} [data-caso="${k}"]`); await esp(300);
    log(`\n===== CASO ${caso.titulo} =====`);
    for (const [j, paso] of caso.pasos.entries()) {
      const rojo = await p.evaluate(z => [...document.querySelectorAll(z + ' .may-nuevo, ' + z + ' .may-cambia, ' + z + ' [class*="nuevo"]')].map(x => x.textContent.trim()).slice(0, 8), ZC);
      const ficha0 = await p.evaluate(z => (document.querySelector(z + ' .may-paciente, ' + z + ' dl, ' + z + ' table')?.innerText || '').replace(/\s+/g, ' ').slice(0, 400), ZC);
      log(`\n### paso ${j + 1} «${paso.momento}» · en rojo: ${JSON.stringify(rojo)} · ficha: ${ficha0}`);
      if (paso.calculadora) log(`  calculadora: ${await p.evaluate(z => [...document.querySelectorAll(z + ' .may-calc, ' + z + ' [data-resaltar*="resultado"], ' + z + ' button')].map(b => b.textContent.trim()).filter(t => /calc|Ringer|Atlanta|Insulina|bilis|pauta|antibiótico|Interpretar/i.test(t)).join(' | '), ZC)}`);
      await contestar(ficha, paso.pregunta, j === 2, ZC, `${caso.corto} paso ${j + 1}`);
      await pulsar(`${ZC} [data-accion="sig"]`); await esp(300);
    }
    log(`\nFIN CASO: ${await ver(ZC, 900)}`);
  }
  log(`\nPARA PROFUNDIZAR: ${await ver(`#${ficha} .may-profundizar`, 500)}`);
  if (nf === FICHAS.length - 1 && nCap < 6) { nCap++; await cap('6-cdi-fin-caso-profundizar', ZC); }
}
log(`\n\nerrores de consola: ${errores.length ? errores.join(' | ') : 'ninguno'} · desbordes: ${desbordes}`);
await b.close();
fs.writeFileSync(`${DIR}/texto-5b.txt`, out.join('\n'));
