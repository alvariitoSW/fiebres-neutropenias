// Profesor G3 (b3-pulmon-estudio): recorre Estudiar en las fichas 4, 6 y 5 (SDRA) a 390 px y devuelve un resumen en texto.
// Copia de profesor-g2.mjs con doce «Compruébalo» (guía y caso) que abren el estado, leen el monitor, mueven el mando que enseña
// (Vt, PEEP, cánula, horas en prono, Pmus) y vuelven; y la lista de pacientes y cifras que se repiten entre las tres fichas.
// Mira (paneles y figuras), Juega (modelos), Piensa y Examínate (contesta todo, falla una; comprueba que las opciones no
// salen antes de «Ya lo tengo» y que «Compruébalo» sale solo después), los tres casos hasta «Lo que te llevas», dos
// «Compruébalo en el modelo» (lee el estado y el monitor del pulmón vivo y vuelve), forma de los tests (longitud y
// posición de la buena) y desborde tras cada respuesta. Uso: node profesor-g3.mjs http://localhost:PUERTO/ /carpeta/
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2].replace(/\/?$/, '/'), OUT = process.argv[3].replace(/\/?$/, '/');
const { MAYEUTICA_B3 } = await import(new URL('../../../../js/data/mayeutica/b3.js', import.meta.url));
const { barajar } = await import(new URL('../../../../js/core/mayeutica-motor.js', import.meta.url));
const { ESTADOS } = await import(new URL('../../../../js/data/pulmon-vivo-data.js', import.meta.url));
const FICHAS = ['neumo-sdra-diagnostico', 'neumo-sdra-ventilacion', 'neumo-sdra-no-ventilatorio'];
// id de pregunta → qué mando mover tras leer el estado (name=valor) · foto: sí/no
const COMPRUEBA = { 'sd-g1': { foto: true }, 'sd-c3': { foto: true }, 'sv-g2': { mando: ['vt', 420] }, 'sv-g3': { mando: ['peep', 5], foto: true }, 'sv-g9': {}, 'sv-c4': { mando: ['vt', 420], foto: true },
  'snv-g2': { mando: ['pmus', 4] }, 'snv-c1': { foto: true }, 'snv-g4': { mando: ['canula', 50] }, 'snv-c2': { mando: ['canula', 50], foto: true }, 'snv-g10': { mando: ['horas', 16] }, 'snv-c5': {}, 'snv-c8': { mando: ['horas', 16], foto: true } };
const FOTOS = {};
const fallos = [];
const nota = (c, t) => { console.log(`${c ? '✅' : '❌'} ${t}`); if (!c) fallos.push(t); };

/* ---------- 0. Estados del pulmón vivo que usan las fichas ---------- */
for (const k of ['sdra-rigido', 'sdra-protector', 'volutrauma', 'atelectrauma-zeep', 'p-sili', 'hfno', 'prono']) { const e = ESTADOS[k]; console.log(`estado ${k}: paciente ${e?.pac} · guía ${e?.guia?.length ?? 0} pasos (con resalte ${e?.guia?.filter(g => g.s?.length).length ?? 0}, con ficha ${e?.guia?.filter(g => /ficha|may-ir|data-resaltar/.test(JSON.stringify(g))).length ?? 0}) · resp ${JSON.stringify(e?.resp || {}).slice(0, 110)}`); }
// Isidro en las tres fichas: pasos con sus datos, para ver repeticiones literales y choques de fechas
const isidros = FICHAS.flatMap(f => MAYEUTICA_B3[f].casos.filter(c => /Isidro/.test(c.titulo)).map(c => ({ f, c })));
for (const { f, c } of isidros) console.log(`Isidro en ${f}: ${JSON.stringify(c.paciente)} · ${c.pasos.map(p => p.momento + ' {' + Object.entries(p.datos).map(([k, v]) => k + ': ' + v).join('; ') + '}').join(' | ')}`);
for (let i = 0; i < isidros.length; i++) for (let j = i + 1; j < isidros.length; j++) { const A = isidros[i].c.pasos, B = isidros[j].c.pasos; for (const a of A) for (const b of B) { const ta = new Set((a.pregunta.enunciado.toLowerCase().match(/[a-záéíóúñ₂]{4,}/g) || [])), tb = new Set((b.pregunta.enunciado.toLowerCase().match(/[a-záéíóúñ₂]{4,}/g) || [])); let n = 0; for (const w of ta) if (tb.has(w)) n++; const r = n / Math.max(1, Math.min(ta.size, tb.size)); if (r >= 0.5) console.log(`  enunciados parecidos entre fichas: ${a.pregunta.id}≈${b.pregunta.id} (${Math.round(100 * r)} %)`); } }

/* ---------- 1. Forma de los tests, sin navegador ---------- */
console.log('== FORMA (por ficha: tests, buena más larga, más corta, posición más repetida) ==');
for (const f of FICHAS) {
  const d = MAYEUTICA_B3[f];
  const tests = [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(p => p.pregunta))].filter(q => q.tipo === 'test');
  let larga = 0, corta = 0; const pos = [0, 0, 0];
  for (const q of tests) {
    const ls = q.opciones.map(o => o.t.length), ok = q.opciones.find(o => o.ok).t.length;
    if (ok === Math.max(...ls)) larga++; if (ok === Math.min(...ls)) corta++;
    pos[barajar(q.opciones, q.id).findIndex(o => o.ok)]++;
  }
  const n = tests.length;
  console.log(`${f}: ${n} tests · buena la más larga ${larga} (${Math.round(100 * larga / n)} %) · la más corta ${corta} (${Math.round(100 * corta / n)} %) · posiciones ${pos.join('/')}`);
  const pacientes = d.casos.map(c => c.titulo.split(',')[0] + ' ' + (c.paciente?.Edad || ''));
  console.log(`  pacientes: ${pacientes.join(' · ')} · guía ${d.guia.length} · examen ${d.examen.length} · casos ${d.casos.map(c => c.pasos.length + ' pasos').join(', ')}`);
  const sinOrigen = [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(p => p.pregunta))].filter(q => /monitor|cmH₂O.*\d|mL\/kg/.test(JSON.stringify(q)) && !q.origen).map(q => q.id);
  console.log(`  preguntas con cifras y sin «origen»: ${sinOrigen.join(', ') || 'ninguna'}`);
  // Repeticiones: la idea buena (opción ok o puntos del destapa o frase mal) muy parecida en dos preguntas de secciones distintas
  const todas = [...d.guia.map(q => ({ q, s: 'guía' })), ...d.examen.map(q => ({ q, s: 'examen' })), ...d.casos.flatMap(c => c.pasos.map(p => ({ q: p.pregunta, s: 'caso' })))];
  const ideas = x => (x.q.tipo === 'test' ? [x.q.opciones.find(o => o.ok).t] : x.q.tipo === 'destapa' ? x.q.puntos.map(t => t.replace(/<[^>]+>/g, '')) : x.q.frases.filter(f => f.mal).map(f => f.c || f.t)).map(t => new Set(t.toLowerCase().replace(/\(.*?\)/g, '').match(/[a-záéíóúñ₂]{4,}/g) || []));
  const jac = (a, b) => { let n = 0; for (const w of a) if (b.has(w)) n++; return n / Math.max(1, Math.min(a.size, b.size)); };
  const rep = [];
  for (let i = 0; i < todas.length; i++) for (let j = i + 1; j < todas.length; j++) { if (todas[i].s === todas[j].s) continue; let mx = 0; for (const a of ideas(todas[i])) for (const b of ideas(todas[j])) mx = Math.max(mx, jac(a, b)); if (mx >= 0.6) rep.push(`${todas[i].q.id}≈${todas[j].q.id} (${Math.round(mx * 100)} %)`); }
  console.log(`  ideas repetidas entre secciones (≥60 % de palabras): ${rep.join(' · ') || 'ninguna'}`);
  const abs = tests.flatMap(q => q.opciones.filter(o => !o.ok && /\b(siempre|nunca|ninguno|ninguna|nada:|irrelevante|sin más|no hace falta|no cambia nada|excepcional|no sirve|cualquier)\b/i.test(o.t)).map(o => q.id));
  console.log(`  distractores con absolutos (siempre/nunca/nada/irrelevante…): ${abs.length} en ${[...new Set(abs)].join(', ') || '—'}`);
}

/* ---------- 2. Navegador ---------- */
const b = await chromium.launch();
const p = await (await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })).newPage();
const err = []; p.on('pageerror', e => err.push(e.message)); p.on('console', m => m.type() === 'error' && err.push(m.text()));
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
const NAV = { especialidad: 'neumologia', view: 'merinoNeumologia', panel: 'panel-merino-neumo-tabs' };
const abrir = tab => p.evaluate(([t, nav]) => { const x = document.createElement('button'); Object.assign(x.dataset, { ...nav, tab: t }); document.body.append(x); x.click(); x.remove(); }, [tab, NAV]);
const pulsar = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no hay ' + s); e.scrollIntoView({ block: 'center' }); e.click(); }, sel);
const desborde = () => p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const foto = async (n, sel) => { try { const el = sel ? await p.$(sel) : null; if (el) { await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(250); } await p.screenshot({ path: `${OUT}${n}.png` }); } catch (e) { console.log('  (sin foto', n, e.message.slice(0, 60) + ')'); } };
let maxDesb = 0, nResp = 0;

const contestar = async (q, fallar, Z) => {
  const antes = await p.evaluate(z => document.querySelector(z).innerHTML, Z);
  if (q.tipo === 'test' && /data-op=/.test(antes)) nota(false, `${q.id}: las opciones salen antes de «Ya lo tengo»`);
  if ((q.modelo || q.modeloVivo) && /may-modelo/.test(antes)) nota(false, `${q.id}: «Compruébalo» antes de contestar`);
  if (q.tipo === 'test') {
    await pulsar(`${Z} [data-accion="ops"]`);
    const k = barajar(q.opciones, q.id).findIndex(o => fallar ? !o.ok : o.ok);
    await pulsar(`${Z} [data-op="${k}"]`);
  } else if (q.tipo === 'destapa') {
    await pulsar(`${Z} [data-accion="destapa"]`);
    await p.evaluate(([z, f]) => document.querySelectorAll(z + ' .may-pts input').forEach((c, i) => { c.checked = !f || i === 0; }), [Z, fallar]);
    await pulsar(`${Z} [data-accion="puntos"]`);
  } else {
    const marcar = fallar ? [q.frases.findIndex(f => !f.mal)] : q.frases.map((f, i) => f.mal ? i : -1).filter(i => i >= 0);
    for (const i of marcar) await pulsar(`${Z} [data-fr="${i}"]`);
    await pulsar(`${Z} [data-accion="corregir"]`);
    for (const i of q.frases.map((f, j) => f.mal ? j : -1).filter(j => j >= 0)) { try { await pulsar(`${Z} [data-ver="${i}"]`); } catch {} }
  }
  await p.waitForTimeout(250);
  const r = await p.evaluate(z => { const res = document.querySelector(z + ' .may-res'); return { txt: res?.textContent || '', sig: !!res?.querySelector('[data-accion="sig"]'), modelo: [...(res?.querySelectorAll('.may-modelo') || [])].map(m => (m.dataset.pulmonVivo || m.dataset.receptorVivo || m.dataset.enVisual || '?') + '|' + m.textContent.trim().slice(0, 40)), ver: res?.querySelectorAll('.may-ir').length || 0, org: res?.querySelector('.may-org')?.textContent.trim().slice(0, 70) || '' }; }, Z);
  if (!r.sig) nota(false, `${q.id}: sin «Siguiente» tras contestar`);
  if ((q.modelo || q.modeloVivo) && !r.modelo.length) nota(false, `${q.id}: falta «Compruébalo»`);
  if (!r.ver) nota(false, `${q.id}: falta «Ver en la ficha»`);
  const d = await desborde(); maxDesb = Math.max(maxDesb, d); nResp++;
  return r;
};
const siguiente = Z => pulsar(`${Z} [data-accion="sig"]`);
const leerPulmon = () => p.evaluate(() => { const ley = document.querySelector('#pul-leyenda [aria-pressed="true"]')?.textContent.trim(); const filas = [...document.querySelectorAll('.pul-raiz [data-fila]')].map(e => e.dataset.fila + '=' + (e.querySelector('.v')?.textContent.trim() || e.textContent.trim().slice(0, 20))); const mandos = [...document.querySelectorAll('#pul-mandos input[type=range], .pul-mando input')].map(i => (i.name || i.id || i.dataset.mando) + '=' + i.value); const sellos = [...document.querySelectorAll('.pul-sello, [class*="sello"]')].filter(e => e.offsetParent).map(e => e.textContent.trim().slice(0, 60)); const pos = [...document.querySelectorAll('[data-m="pos"]')].map(b => b.dataset.v + (b.getAttribute('aria-pressed') === 'true' ? '*' : '')).join('/'); return { visible: !!document.getElementById('pul-monitor')?.offsetParent, estado: ley, frase: document.getElementById('pul-frase-txt')?.textContent.trim().slice(0, 200), filas: filas.slice(0, 26), mandos: mandos.slice(0, 10), sellos: sellos.slice(0, 4), pos, guia: document.querySelectorAll('.pul-guia-paso, [data-guia-paso], .pul-guia li').length, rotulo: /ilustrativ|fisiolog/i.test(document.getElementById('pul-monitor')?.parentElement?.textContent || '') }; });
const mover = async (k, v) => { const ok = await p.evaluate(([k, v]) => { const i = document.querySelector(`#pul-mandos input[name="${k}"], .pul-mando input[name="${k}"], input[data-mando="${k}"], input[name="${k}"]`); if (!i) return false; i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true })); return true; }, [k, v]); await p.waitForTimeout(2200); await p.evaluate(() => window.__pulPruebas?.().llenar?.()); return ok; };
const comprobar = async (q, Z, f, r) => {
  const cfg = COMPRUEBA[q.id]; const btn = `${Z} .may-res .may-modelo`;
  const tipo = await p.evaluate(s => { const m = document.querySelector(s); return m?.dataset.pulmonVivo ? 'pulmon' : m?.dataset.capilarVivo ? 'capilar' : 'otro'; }, btn);
  await pulsar(btn); await p.waitForTimeout(2500);
  if (tipo === 'pulmon') {
    await p.evaluate(() => window.__pulPruebas?.().llenar?.());
    const m = await leerPulmon();
    console.log(`  COMPRUÉBALO ${q.id} → ${r.modelo.join(' / ')} · visible ${m.visible} · estado «${m.estado}» · pos ${m.pos || '—'} · rótulo ilustrativo ${m.rotulo}`);
    console.log(`    frase: ${m.frase}`); console.log(`    monitor: ${m.filas.join(' · ')}`); console.log(`    mandos: ${m.mandos.join(' · ')} · sellos: ${m.sellos.join(' | ') || '—'}`);
    if (cfg.foto) { try { await p.evaluate(() => document.getElementById('esc-svg')?.scrollIntoView({ block: 'start' })); } catch {} await p.waitForTimeout(300); await foto(`comprueba-${q.id}`); }
    if (cfg.mando) { const [k, v] = cfg.mando; const ok = await mover(k, v); const m2 = await leerPulmon(); console.log(`    tras ${k}=${v} (${ok ? 'mando encontrado' : 'MANDO NO ENCONTRADO'}): estado «${m2.estado}» · frase: ${m2.frase}`); console.log(`    monitor: ${m2.filas.join(' · ')} · sellos: ${m2.sellos.join(' | ') || '—'}`); if (cfg.foto && /horas|canula/.test(k)) await foto(`comprueba-${q.id}-tras`); }
  } else {
    const c = await p.evaluate(() => { const v = document.getElementById('capilar-vivo-view'); const est = document.querySelector('[data-cpv-estado][aria-pressed="true"]')?.textContent.trim(); const lupa = document.querySelector('.cpv-lupa, [data-lupa]')?.textContent.trim().slice(0, 80); return { visible: !!v?.offsetParent, estado: est, lupa, frase: (document.querySelector('.cpv-frase, #cpv-frase')?.textContent || '').trim().slice(0, 200), txt: (v?.textContent || '').replace(/\s+/g, ' ').slice(0, 260) }; });
    console.log(`  COMPRUÉBALO ${q.id} → ${r.modelo.join(' / ')} · capilar visible ${c.visible} · estado «${c.estado}» · frase: ${c.frase}`); console.log(`    texto: ${c.txt}`);
    if (cfg.foto) { try { await p.evaluate(() => document.getElementById('cpv-escena')?.scrollIntoView({ block: 'start' })); } catch {} await p.waitForTimeout(300); await foto(`comprueba-${q.id}`); }
  }
  await p.evaluate(() => [...document.querySelectorAll('button')].find(b => /VOLVER/.test(b.textContent) && b.offsetParent)?.click()); await p.waitForTimeout(900);
  const v = await p.evaluate(([f, z]) => { const t = document.getElementById(f); return { abierta: t.classList.contains('active') && !!t.offsetParent, est: t.classList.contains('modo-estudiar'), sig: !!document.querySelector(z + ' .may-res [data-accion="sig"]') }; }, [f, Z]);
  nota(v.abierta && v.est && v.sig, `${q.id}: «← VOLVER» deja la misma pregunta (${JSON.stringify(v)})`);
};

for (const f of FICHAS) {
  const d = MAYEUTICA_B3[f];
  console.log(`\n== ${f} ==`);
  await abrir(f); await p.waitForTimeout(600);
  const tog = await p.evaluate(f => [...document.querySelectorAll(`#${f} > .vista-toggle button`)].map(b => b.textContent.trim()).join('|'), f);
  nota(/Estudiar/.test(tog), `${f}: interruptor «${tog}»`);
  await pulsar(`#${f} > .vista-toggle [data-vista="estudiar"]`); await p.waitForTimeout(700);
  // Mira
  const mira = await p.evaluate(f => { const s = document.querySelector(`#${f} .est-paso[data-paso="mira"]`); const v = s.querySelector('.vista-visual'); const imgs = [...v.querySelectorAll('img')]; return { abierto: !s.hidden, paneles: [...v.querySelectorAll('.vk-panel-titulo')].map(e => e.textContent.trim().slice(0, 45) + ' [' + (e.nextElementSibling?.firstElementChild?.className.split(' ')[0] || '') + ']'), figuras: v.querySelectorAll('.vk-figura').length, imgs: imgs.length, cargadas: imgs.filter(i => i.naturalWidth > 0).length, alto: v.offsetHeight, texto: v.textContent.replace(/\s+/g, ' ').slice(0, 300) }; }, f);
  console.log(`Mira: abierto ${mira.abierto} · alto ${mira.alto} px · figuras ${mira.figuras} · imágenes ${mira.cargadas}/${mira.imgs} cargadas`);
  console.log('  paneles: ' + mira.paneles.join(' · '));
  console.log('  texto: ' + mira.texto);
  await foto(`mira-${f}`, `#${f} .est-paso[data-paso="mira"]`);
  // Juega
  await pulsar(`#${f} .est-ir[data-ir-paso="juega"]`); await p.waitForTimeout(300);
  const juega = await p.evaluate(f => [...document.querySelectorAll(`#${f} .est-paso[data-paso="juega"] .est-juega`)].map(b => (b.dataset.pulmonVivo || '?') + ' «' + b.textContent.trim().slice(0, 45) + '»'), f);
  console.log(`Juega (${juega.length}): ` + juega.join(' · '));
  // Piensa
  await pulsar(`#${f} .est-ir[data-ir-paso="piensa"]`); await p.waitForTimeout(300);
  const seguir = async Z => { if (await p.evaluate(z => !!document.querySelector(z + ' [data-ir="seguir"]'), Z)) { await pulsar(`${Z} [data-ir="seguir"]`); await p.waitForTimeout(200); } };
  const ZG = `#${f} .est-paso[data-paso="piensa"] .may-zona`;
  await seguir(ZG);
  const modelos = [];
  for (const [i, q] of d.guia.entries()) {
    const r = await contestar(q, i === 0, ZG);
    if (r.modelo.length) modelos.push(`${q.id}→${r.modelo.join(' / ')}`);
    if (COMPRUEBA[q.id] && r.modelo.length) await comprobar(q, ZG, f, r);
    await siguiente(ZG);
  }
  console.log('Piensa · Compruébalo: ' + modelos.join(' · '));
  await pulsar(`${ZG} [data-ir-paso="examen"]`); await p.waitForTimeout(200);
  const ZE = `#${f} .est-paso[data-paso="examen"] .may-zona`;
  await seguir(ZE);
  for (const q of d.examen) { await contestar(q, false, ZE); await siguiente(ZE); }
  const rep = await p.evaluate(z => document.querySelector(z).textContent.replace(/\s+/g, ' ').slice(0, 160), ZE);
  console.log('Examen hecho · ' + rep);
  // Repaso: contestar lo que vuelva (la 1.ª de la guía)
  if (await p.evaluate(z => !!document.querySelector(z + ' [data-ir="repaso"]'), ZE)) { try { await pulsar(`${ZE} [data-ir="repaso"]`); await p.waitForTimeout(200); const rr = await p.evaluate(z => document.querySelector(z).textContent.replace(/\s+/g, ' ').slice(0, 120), ZE); console.log('Repaso: ' + rr); await contestar(d.guia[0], false, ZE); } catch (e) { console.log('  repaso: ' + e.message.slice(0, 80)); } }
  // Casos
  const ZC = `#${f} .est-paso[data-paso="caso"] .may-zona`;
  await pulsar(`#${f} .est-ir[data-ir-paso="caso"]`); await p.waitForTimeout(200);
  for (const [k, caso] of d.casos.entries()) {
    await pulsar(`${ZC} [data-caso="${k}"]`); await p.waitForTimeout(200);
    console.log(`Caso ${caso.id}:`);
    for (const [j, paso] of caso.pasos.entries()) {
      const fp = await p.evaluate(z => ({ nuevos: document.querySelectorAll(z + ' .may-paciente dd.may-cambia .may-nuevo').length, dia: document.querySelector(z + ' .may-dia')?.textContent, calc: !!document.querySelector(z + ' [data-calculadora], ' + z + ' .may-calc') }), ZC);
      const q = paso.pregunta;
      if (FOTOS[f] && j === 1) await foto(FOTOS[f] + '-paso2', ZC);
      const r = await contestar(q, j === 0, ZC);
      console.log(`  ${j + 1}. ${fp.dia} · nuevos ${fp.nuevos}/${paso.nuevo?.length ?? 0} · ${q.tipo} ${q.id} · modelo ${r.modelo.join(' / ') || '—'} · origen «${r.org}»`);
      if (FOTOS[f] && q.tipo === 'error') await foto(FOTOS[f] + '-error', ZC);
      if (COMPRUEBA[q.id] && r.modelo.length) await comprobar(q, ZC, f, r);
      await siguiente(ZC); await p.waitForTimeout(150);
    }
    const fin = await p.evaluate(z => ({ txt: document.querySelector(z).textContent.replace(/\s+/g, ' ').slice(0, 400), ficha: !!document.querySelector(z + ' [data-may-texto]'), modelo: document.querySelector(z + ' .may-modelo')?.dataset.pulmonVivo }), ZC);
    nota(/Lo que te llevas/.test(fin.txt) && fin.ficha && !!fin.modelo, `${caso.id}: llega a «Lo que te llevas» (vuelta a la ficha y al modelo «${fin.modelo}»)`);
    if (FOTOS[f]) await foto(FOTOS[f] + '-fin', ZC);
    if (k < d.casos.length - 1) await pulsar(`${ZC} [data-fin="otro"]`);
  }
  const marcas = await p.evaluate(f => [...document.querySelectorAll(`#${f} .est-ir`)].map(b => b.querySelector('b').textContent + ':' + b.querySelector('.est-marca')?.textContent).join(' '), f);
  console.log('Marcas: ' + marcas);
  const prof = await p.evaluate(f => [...document.querySelectorAll(`#${f} .may-profundizar summary, #${f} .may-prof-lista li`)].map(e => e.textContent.trim().slice(0, 50)), f);
  console.log('Profundizar: ' + prof.join(' · '));
}
console.log(`\nRespuestas ${nResp} · desborde máximo ${maxDesb} px · errores de consola: ${JSON.stringify(err.slice(0, 4))}`);
console.log(fallos.length ? `FALLOS (${fallos.length}):\n- ` + fallos.join('\n- ') : 'Sin fallos de programa.');
await b.close();
