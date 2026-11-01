// Profesor (b5, grupo 5D, juicio R10): recorre el Estudiar de las 4 fichas del termostato (ma-calor, ma-hipertermia-farmacos,
// ma-hipotermia, ma-antipireticos) a 390 px, contesta todo (fallando una a propósito), mide el texto de cada ficha
// (párrafos largos, resaltados, figura arriba) y devuelve un resumen en texto. Capturas (≤8) en <dir>.
// Uso: python3 -m http.server <puerto> & node autonomo/bloques/b5/herramientas/profesor-5d-r.mjs <dir-capturas> [puerto]
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
const D = process.argv[2] || '/tmp/plan-socialista/b5-5d-r/cap', PORT = process.argv[3] || 8761;
mkdirSync(D, { recursive: true });
const { MAYEUTICA_TERMOSTATO: DATA } = await import('/home/user/fiebres-neutropenias/js/data/mayeutica/b5-termostato.js');
const { barajar } = await import('/home/user/fiebres-neutropenias/js/core/mayeutica-motor.js');
const FICHAS = ['ma-calor', 'ma-hipertermia-farmacos', 'ma-hipotermia', 'ma-antipireticos'];
const FALLAR = new Set(['cal-g2', 'fm-g8', 'hpo-g4', 'ant-c1-4']);
const CAPS = { 'ma-calor': { texto: '1-calor-texto', mira: '2-calor-mira', preg: ['cal-g2', '3-calor-g2-modelo'] }, 'ma-hipertermia-farmacos': { preg: ['fm-g8', '4-fm-g8-error'], caso: [5, '5-jacinta-giro'] }, 'ma-hipotermia': { caso: [5, '6-honorato-fv'] }, 'ma-antipireticos': { fin: '7-dorotea-llevas', prof: '8-antip-profundizar' } };
const b = await chromium.launch();
const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
const p = await ctx.newPage(); const errores = [];
p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errores.push(m.text()); }); p.on('pageerror', e => errores.push('PAGE ' + e.message));
const pulsar = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no hay ' + s); e.click(); }, sel);
const desborde = () => p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const foto = async (n, sel) => { if (sel) await p.evaluate(s => document.querySelector(s)?.scrollIntoView({ block: 'start' }), sel); await p.waitForTimeout(250); await p.screenshot({ path: `${D}/${n}.png` }); };
const NAV = { especialidad: 'libros', view: 'marinoAbdomen', panel: 'panel-marino-abd-tabs' };
const abrirFicha = tab => p.evaluate(([t, nav]) => { const x = document.createElement('button'); Object.assign(x.dataset, { ...nav, tab: t }); document.body.append(x); x.click(); x.remove(); }, [tab, NAV]);
await p.goto(`http://localhost:${PORT}/index.html`); await p.waitForTimeout(2500);
const out = [];
for (const ficha of FICHAS) {
  const d = DATA[ficha], C = CAPS[ficha] || {};
  await abrirFicha(ficha); await p.waitForTimeout(600);
  // --- El texto: párrafos largos, resaltados por bloque, qué hay en la primera pantalla
  const tx = await p.evaluate(f => {
    const t = document.getElementById(f), lh = 22;
    const bloques = [...t.querySelectorAll(':scope > .vista-texto p, :scope > .vista-texto dd, :scope > .vista-texto .warning-box, :scope > .vista-texto .compare-box p, :scope > p, :scope > dl dd, :scope > .warning-box')].filter(e => e.offsetParent);
    const largos = bloques.filter(e => e.offsetHeight / lh > 6.5).map(e => ({ id: e.id || e.closest('[id]')?.id, lineas: Math.round(e.offsetHeight / lh) }));
    const hl = t.querySelectorAll('.hl, .hl-rojo, .hl-verde, .hl-azul, .hl-purpura').length, strong = t.querySelectorAll('strong').length;
    const top = t.getBoundingClientRect().top + window.scrollY;
    const primera = [...t.querySelectorAll('*')].filter(e => e.offsetParent && e.getBoundingClientRect().top + window.scrollY < top + 844).map(e => e.tagName.toLowerCase() + (e.className ? '.' + String(e.className).split(' ')[0] : '')).filter(n => /h3|p\.|dl|table|img|figure|div\.article|div\.vista|button|div\.agua|div\.tfg|details/.test(n));
    const fig = t.querySelector('.article-figure img'); const figTop = fig ? Math.round(fig.getBoundingClientRect().top + window.scrollY - top) : null;
    return { largos, hl, strong, primera: [...new Set(primera)].slice(0, 14).join(' '), figTop, alto: t.offsetHeight, toggle: [...t.querySelectorAll(':scope > .vista-toggle button')].map(b => b.textContent).join('|') };
  }, ficha);
  out.push(`\n=== ${ficha} · texto: alto ${tx.alto}px · toggle ${tx.toggle} · figura a ${tx.figTop}px · hl ${tx.hl} strong ${tx.strong} · bloques >6 líneas: ${JSON.stringify(tx.largos)}\n  primera pantalla: ${tx.primera}`);
  if (C.texto) await foto(C.texto, `#${ficha}`);
  await pulsar(`#${ficha} > .vista-toggle [data-vista="estudiar"]`); await p.waitForTimeout(400);
  const res = await p.evaluate(f => ({ pasos: [...document.querySelectorAll(`#${f} .est-ir`)].map(b => b.textContent.replace(/\s+/g, ' ').trim()).join(' | '), juega: [...document.querySelectorAll(`#${f} .est-paso[data-paso="juega"] .est-juega`)].map(b => b.textContent.trim().slice(0, 60)), entrada: document.querySelector(`#${f} .est-resumen`)?.textContent.replace(/\s+/g, ' ').slice(0, 200) }), ficha);
  out.push(`  Estudiar: ${res.pasos}\n  Juega (${res.juega.length}): ${res.juega.join(' // ')}`);
  if (C.mira) await foto(C.mira, `#${ficha} > .vista-toggle`);
  await pulsar(`#${ficha} .est-ir[data-ir-paso="juega"]`); await p.waitForTimeout(150);
  const juega = await p.evaluate(f => [...document.querySelectorAll(`#${f} .est-paso[data-paso="juega"] .est-juega`)].map(b => b.textContent.trim().replace(/\s+/g, ' ').slice(0, 70)), ficha);
  out.push(`  Juega abierto (${juega.length}): ${juega.join(' // ')}`);
  await pulsar(`#${ficha} .est-ir[data-ir-paso="piensa"]`); await p.waitForTimeout(150);
  const PASO = paso => `#${ficha} .est-paso[data-paso="${paso}"]`;
  const ZG = `${PASO('piensa')} .may-zona`, ZE = `${PASO('examen')} .may-zona`, ZC = `${PASO('caso')} .may-zona`;
  const contestar = async (q, fallar, Z, capN) => {
    const antes = await p.evaluate(z => ({ html: document.querySelector(z).innerHTML, txt: document.querySelector(z).textContent }), Z);
    const fuga = [q.explicacion, ...(q.opciones || []).map(o => o.porque || ''), ...(q.frases || []).map(f => f.c || '')].filter(Boolean).map(t => t.replace(/<[^>]+>/g, '').slice(0, 40)).find(t => antes.txt.includes(t));
    const modeloAntes = (q.modelo || q.modeloVivo) && /may-modelo/.test(antes.html);
    if (q.tipo === 'test') { await pulsar(`${Z} [data-accion="ops"]`); const orden = barajar(q.opciones, q.id); const k = orden.findIndex(o => fallar ? !o.ok : o.ok); if (capN) await foto(capN + '-opciones', Z); await pulsar(`${Z} [data-op="${k}"]`); }
    else if (q.tipo === 'destapa') { if (await p.evaluate(z => !!document.querySelector(z + ' [data-accion="destapa"]'), Z)) await pulsar(`${Z} [data-accion="destapa"]`); await p.evaluate(([z, f]) => document.querySelectorAll(z + ' .may-pts input').forEach((c, i) => { c.checked = !f || i === 0; }), [Z, fallar]); await pulsar(`${Z} [data-accion="puntos"]`); }
    else { const marcar = fallar ? [q.frases.findIndex(f => !f.mal)] : q.frases.map((f, i) => f.mal ? i : -1).filter(i => i >= 0); for (const i of marcar) await pulsar(`${Z} [data-fr="${i}"]`); await pulsar(`${Z} [data-accion="corregir"]`); for (const i of q.frases.map((f, j) => f.mal ? j : -1).filter(j => j >= 0)) await pulsar(`${Z} [data-ver="${i}"]`); }
    await p.waitForTimeout(120);
    const r = await p.evaluate(z => { const res = document.querySelector(z + ' .may-res'); const zona = document.querySelector(z); return { marca: /✓/.test(res.textContent) ? '✓' : /✗/.test(res.textContent) ? '✗' : '?', sig: !!res.querySelector('[data-accion="sig"]'), modelo: [...res.querySelectorAll('.may-modelo')].map(b => b.textContent.trim().slice(0, 50)), ver: [...res.querySelectorAll('.may-ir')].map(b => b.textContent.trim().slice(0, 40)), org: res.querySelector('.may-org')?.textContent.trim().slice(0, 60), nota: !!res.querySelector('.may-nota, details'), alto: zona.offsetHeight, diminuto: [...zona.querySelectorAll('*')].filter(e => e.offsetParent && parseFloat(getComputedStyle(e).fontSize) < 11 && e.textContent.trim()).length }; }, Z);
    const dsb = await desborde();
    out.push(`  ${q.id.padEnd(9)} ${q.tipo.padEnd(7)} ${fallar ? 'FALLO' : 'bien '} ${r.marca} sig:${r.sig ? 'sí' : 'NO'} ver:[${r.ver.join(';')}] modelo:[${r.modelo.join(';')}]${r.org ? ' org:' + r.org : ''}${r.nota ? ' nota' : ''}${fuga ? ' !!FUGA:' + fuga : ''}${modeloAntes ? ' !!MODELO-ANTES' : ''}${dsb > 0 ? ' !!DESBORDE ' + dsb : ''}${r.diminuto ? ' !!<11px:' + r.diminuto : ''} · enun ${q.enunciado.length}c · ${q.tipo === 'test' ? 'ops ' + q.opciones.map(o => o.t.length + (o.ok ? '*' : '')).join('/') : q.tipo === 'destapa' ? 'pts ' + q.puntos.length : 'frases ' + q.frases.length + ' mal ' + q.frases.filter(f => f.mal).length}`);
    if (capN) await foto(capN, Z + ' .may-res');
  };
  const sig = Z => pulsar(`${Z} [data-accion="sig"]`);
  await pulsar(`${ZG} [data-ir="seguir"]`);
  out.push('  -- Piensa');
  for (const q of d.guia) { await contestar(q, FALLAR.has(q.id), ZG, C.preg && C.preg[0] === q.id ? C.preg[1] : null); await sig(ZG); }
  out.push('  fin guía: ' + await p.evaluate(z => document.querySelector(z).textContent.replace(/\s+/g, ' ').trim().slice(0, 120), ZG));
  await pulsar(`${ZG} [data-ir-paso="examen"]`); await p.waitForTimeout(100); await pulsar(`${ZE} [data-ir="seguir"]`);
  out.push('  -- Examínate');
  for (const q of d.examen) { await contestar(q, FALLAR.has(q.id), ZE, C.preg && C.preg[0] === q.id ? C.preg[1] : null); await sig(ZE); }
  const rep = await p.evaluate(z => [...document.querySelectorAll(z + ' [data-rep]')].map(b => b.dataset.rep), ZE);
  out.push(`  repaso trae: ${rep.join(',') || '(nada)'}`);
  for (const id of rep) { await pulsar(`${ZE} [data-rep="${id}"]`); await contestar([...d.guia, ...d.examen].find(x => x.id === id), false, ZE); await sig(ZE); }
  out.push('  fin examen: ' + await p.evaluate(z => document.querySelector(z).textContent.replace(/\s+/g, ' ').trim().slice(0, 100), ZE));
  await pulsar(`${ZE} [data-ir-paso="caso"]`); await p.waitForTimeout(100);
  for (const [k, caso] of d.casos.entries()) {
    out.push(`  -- Caso ${caso.id} «${caso.titulo}» (${caso.pasos.length} pasos; tipos ${caso.pasos.map(s => s.pregunta.tipo[0]).join('')})`);
    await pulsar(`${ZC} [data-caso="${k}"]`); await p.waitForTimeout(100);
    for (const [j, paso] of caso.pasos.entries()) {
      const fp = await p.evaluate(z => ({ nuevos: document.querySelectorAll(z + ' .may-paciente dd.may-cambia .may-nuevo').length, dia: document.querySelector(z + ' .may-dia')?.textContent, calc: document.querySelector(z + ' [data-calc], ' + z + ' .may-calc')?.textContent.trim().slice(0, 50), pac: document.querySelector(z + ' .may-paciente')?.textContent.replace(/\s+/g, ' ').trim().length }), ZC);
      out.push(`   paso ${j + 1} «${paso.momento}» nuevos ${fp.nuevos}/${paso.nuevo?.length || 0}${paso.calculadora ? ' calc:' + (fp.calc || 'NO VISIBLE') : ''} ficha ${fp.pac}c`);
      if (C.caso && C.caso[0] === j) await foto(C.caso[1], ZC + ' .may-paciente');
      await contestar(paso.pregunta, FALLAR.has(paso.pregunta.id), ZC); await sig(ZC);
    }
    const fin = await p.evaluate(z => { const e = document.querySelector(z); return { txt: e.textContent.replace(/\s+/g, ' ').trim().slice(0, 700), ficha: e.querySelector('[data-may-texto]')?.textContent.trim(), modelo: [...e.querySelectorAll('.may-modelo')].map(b => b.textContent.trim().slice(0, 50)) }; }, ZC);
    out.push(`   FIN: ${fin.txt}\n   vuelta: ${fin.ficha} · modelo: ${fin.modelo.join(';')}`);
    if (C.fin) await foto(C.fin, ZC);
    if (k < d.casos.length - 1) await pulsar(`${ZC} [data-fin="otro"]`);
  }
  const prof = await p.evaluate(f => { const det = document.querySelector(`#${f} .may-profundizar`); det.open = true; det.dispatchEvent(new Event('toggle')); return [...det.querySelectorAll('.may-prof-item')].map(s => s.querySelector('summary, .may-prof-titulo, b')?.textContent.trim().slice(0, 60) + ' (' + s.querySelector('.may-prof-cuerpo').textContent.trim().length + 'c)'); }, ficha);
  out.push(`  Para profundizar: ${prof.join(' // ')}`);
  if (C.prof) await foto(C.prof, `#${ficha} .may-profundizar`);
  out.push(`  desborde final: ${await desborde()}`);
}
out.push(`\nERRORES DE CONSOLA: ${errores.length ? errores.join(' | ') : 'ninguno'}`);
console.log(out.join('\n'));
await b.close();
