// Profesor G5 (b3-pulmon-estudio): recorre Estudiar en las fichas 14, 15, 20, 21, 17, 18 y 19 (tubo, destete y NAV) a 390 px y
// devuelve un resumen en texto. Copia de profesor-g4.mjs: los «Compruébalo» abren el pulmón vivo (fuga-cuff, volutrauma,
// neumotorax-tension, sbt-ok, sbt-ansiedad, sbt-fracaso) o el capilar vivo (bajo-gasto), leen el monitor, ejecutan acciones
// (mando del cuff a 15 / 0, edema, extubar y esperar; dejar pasar respiraciones, sitio y descomprimir; opiáceo) y vuelven;
// y la lista de Rafael (12, 14, 15), Benito (20, 21) y Casimiro (17, 18, 19). Mira (paneles y láminas), Juega, Piensa y
// Examínate (contesta todo, falla una), los casos hasta «Lo que te llevas», forma de los tests con el `barajar` real y desborde.
// Uso: node profesor-g5.mjs http://localhost:PUERTO/ /carpeta/
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2].replace(/\/?$/, '/'), OUT = process.argv[3].replace(/\/?$/, '/');
const { MAYEUTICA_B3 } = await import(new URL('../../../../js/data/mayeutica/b3.js', import.meta.url));
const { barajar } = await import(new URL('../../../../js/core/mayeutica-motor.js', import.meta.url));
const { ESTADOS } = await import(new URL('../../../../js/data/pulmon-vivo-data.js', import.meta.url));
const FICHAS = ['neumo-vias-artificiales', 'neumo-cuidado-barotrauma', 'neumo-sbt', 'neumo-weaning-extubacion', 'neumo-nav-prevencion', 'neumo-nav-diagnostico', 'neumo-derrame-antimicrobiano'];
// id de pregunta → acciones tras leer el estado · foto: sí/no
const COMPRUEBA = {
  'tubo-g11': { foto: true, acciones: [['mando', 'cuff', 15], ['mando', 'cuff', 28]] },
  'tubo-e4': { acciones: [['mando', 'cuff', 15], ['tog', 'apagar']] },
  'tubo-c4': { acciones: [['mando', 'cuff', 15]] },
  'baro-g5': { foto: true },
  'baro-g9': { acciones: [['nx', 'pasar'], ['nx', 'pasar'], ['nx', 'sitio', 'clasico'], ['nx', 'desc'], ['nx', 'sitio', 'correcto'], ['nx', 'desc']] },
  'baro-c4': { foto: true, acciones: [['nx', 'pasar'], ['nx', 'pasar'], ['nx', 'pasar']] },
  'sbt-g6': {},
  'sbt-g10': { acciones: [['mando', 'frEsp', 40], ['mando', 'frEsp', 45]] },
  'sbt-g12': { acciones: [['tog', 'opiaceo']] },
  'sbt-c2': { foto: true },
  'sbt-c4': { acciones: [['tog', 'opiaceo']] },
  'sbt-c5': {},
  'ext-g3': {},
  'ext-g11': { acciones: [['tog', 'apagar'], ['tog', 'edema'], ['tog', 'apagar']] },
  'ext-c1': { foto: true },
  'ext-c5': { acciones: [['tog', 'edema'], ['tog', 'apagar']] },
  'ext-c6': { foto: true, acciones: [['tog', 'edema'], ['tog', 'apagar'], ['tog', 'extubar'], ['tog', 'esperar']] },
};
const FOTOS_CASO = { 'nvd-c4': 'caso-nvd-error', 'ext-c5': 'caso-ext-calc', 'dea-c3': 'caso-dea-calc' };
const MIRA_FOTO = new Set(['neumo-vias-artificiales', 'neumo-nav-diagnostico', 'neumo-derrame-antimicrobiano', 'neumo-sbt']);
const fallos = [];
const nota = (c, t) => { console.log(`${c ? '✅' : '❌'} ${t}`); if (!c) fallos.push(t); };

/* ---------- 0. Estados y los pacientes compartidos ---------- */
for (const k of ['fuga-cuff', 'volutrauma', 'neumotorax-tension', 'sbt-ok', 'sbt-ansiedad', 'sbt-fracaso']) { const e = ESTADOS[k]; console.log(`estado ${k}: paciente ${e?.pac} · guía ${e?.guia?.length ?? 0} pasos (con resalte ${e?.guia?.filter(g => g.s?.length).length ?? 0}, con ficha ${e?.guia?.filter(g => g.c).length ?? 0})`); }
for (const nom of ['Rafael', 'Benito', 'Casimiro']) for (const [f, d] of Object.entries(MAYEUTICA_B3)) for (const c of (d.casos || []).filter(c => c.titulo.includes(nom))) console.log(`${nom} en ${f}: ${JSON.stringify(c.paciente)}\n   ${c.pasos.map(p => p.momento + ' {' + Object.entries(p.datos).map(([k, v]) => k + ': ' + v).join('; ') + '}').join('\n   ')}`);
/* ---------- 1. Forma de los tests, sin navegador ---------- */
console.log('== FORMA (por ficha: tests, buena más larga, más corta, posición más repetida) ==');
for (const f of FICHAS) {
  const d = MAYEUTICA_B3[f];
  const tests = [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(p => p.pregunta))].filter(q => q.tipo === 'test');
  let larga = 0, corta = 0; const pos = [0, 0, 0]; const lar = [], cor = [];
  for (const q of tests) {
    const ls = q.opciones.map(o => o.t.length), ok = q.opciones.find(o => o.ok).t.length;
    const otros = q.opciones.filter(o => !o.ok).map(o => o.t.length);
    if (ok === Math.max(...ls)) { larga++; lar.push(`${q.id} +${ok - Math.max(...otros)}`); }
    if (ok === Math.min(...ls)) { corta++; cor.push(`${q.id} −${Math.min(...otros) - ok}`); }
    pos[barajar(q.opciones, q.id).findIndex(o => o.ok)]++;
  }
  const n = tests.length;
  console.log(`${f}: ${n} tests · buena la más larga ${larga} (${Math.round(100 * larga / n)} %) [${lar.join(', ')}] · la más corta ${corta} (${Math.round(100 * corta / n)} %) [${cor.join(', ')}] · posiciones ${pos.join('/')}`);
  const pacientes = d.casos.map(c => c.titulo.split(',')[0] + ' ' + (c.paciente?.Edad || c.paciente?.Paciente || ''));
  const tipos = s => s.map(q => q.tipo[0]).join('');
  console.log(`  pacientes: ${pacientes.join(' · ')} · guía ${d.guia.length} (${tipos(d.guia)}) · examen ${d.examen.length} (${tipos(d.examen)}) · casos ${d.casos.map(c => c.pasos.length + ' pasos (' + tipos(c.pasos.map(p => p.pregunta)) + ', calc ' + c.pasos.filter(p => p.calculadora).length + ')').join(', ')} · profundizar ${d.profundizar?.length ?? 0}`);
  const sinOrigen = [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(p => p.pregunta))].filter(q => /monitor|cmH₂O.*\d|mL\/kg|del modelo/.test(JSON.stringify(q)) && !q.origen).map(q => q.id);
  console.log(`  preguntas con cifras y sin «origen»: ${sinOrigen.join(', ') || 'ninguna'}`);
  const errores = [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(p => p.pregunta))].filter(q => q.tipo === 'error').map(q => `${q.id}:${q.frases.filter(f => f.mal).length}/${q.frases.length}${/Hay dos errores|Hay un error|no hay|ninguno/.test(q.enunciado) ? '' : ' SIN AVISO'}`);
  console.log(`  encuentra el error (errores/frases): ${errores.join(' · ')}`);
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
  const r = await p.evaluate(z => { const res = document.querySelector(z + ' .may-res'); return { txt: res?.textContent || '', sig: !!res?.querySelector('[data-accion="sig"]'), modelo: [...(res?.querySelectorAll('.may-modelo') || [])].map(m => (m.dataset.pulmonVivo || m.dataset.capilarVivo || m.dataset.receptorVivo || m.dataset.enVisual || '?') + '|' + m.textContent.trim().slice(0, 40)), ver: res?.querySelectorAll('.may-ir').length || 0, org: res?.querySelector('.may-org')?.textContent.trim().slice(0, 70) || '' }; }, Z);
  if (!r.sig) nota(false, `${q.id}: sin «Siguiente» tras contestar`);
  if ((q.modelo || q.modeloVivo) && !r.modelo.length) nota(false, `${q.id}: falta «Compruébalo»`);
  if (!r.ver) nota(false, `${q.id}: falta «Ver en la ficha»`);
  const d = await desborde(); maxDesb = Math.max(maxDesb, d); nResp++;
  return r;
};
const siguiente = Z => pulsar(`${Z} [data-accion="sig"]`);
const FILAS = ['vt', 'vtkg', 'frespon', 'fvt', 'vmespon', 'fuga', 'pico', 'meseta', 'peep', 'spo2', 'neumo-p', 'neumo-spo2', 'cor-pam', 'cor-gc', 'cor-vs'];
const leerPulmon = () => p.evaluate(F => { window.__pulPruebas?.().llenar?.(); const ley = document.querySelector('#pul-leyenda [aria-pressed="true"]')?.textContent.trim(); const f = {}; for (const e of document.querySelectorAll('.pul-raiz [data-fila], #pul-neumo [data-fila]')) f[e.dataset.fila] = (e.querySelector('.v, .g')?.textContent.trim() || e.textContent.trim().slice(0, 16)); const filas = F.filter(k => f[k] != null).map(k => k + '=' + f[k]); const mandos = [...document.querySelectorAll('#pul-dock-panel input[data-m]')].map(i => i.dataset.m + '=' + i.value); const togs = [...document.querySelectorAll('#pul-dock-panel button.tog[data-m]')].map(b => b.dataset.m + (b.getAttribute('aria-pressed') === 'true' ? '*' : '') + (b.disabled ? '(off)' : '')); const sellos = [...document.querySelectorAll('.pul-raiz .tope-sello:not([hidden]), .pul-sello, [class*="sello"]:not([hidden])')].filter(e => e.offsetParent).map(e => e.textContent.trim().slice(0, 70)); const nx = document.querySelector('#pul-neumo [data-nx="msg"]')?.textContent.trim().slice(0, 160); return { visible: !!document.getElementById('pul-monitor')?.offsetParent, estado: ley, frase: document.getElementById('pul-frase-txt')?.textContent.trim().slice(0, 200), filas, mandos: mandos.slice(0, 10), togs, sellos: [...new Set(sellos)].slice(0, 3), nx, guia: document.querySelectorAll('.pul-guia-paso, [data-guia-paso], .pul-guia li').length, rotulo: /ilustrativ|fisiolog/i.test(document.getElementById('pul-monitor')?.parentElement?.textContent || '') }; }, FILAS);
const abrirDock = () => p.evaluate(() => { if (!document.querySelector('#pul-dock-panel input[data-m], #pul-dock-panel button[data-m]')) [...document.querySelectorAll('button, summary, [role=button]')].find(b => /MANDOS/.test(b.textContent) && b.offsetParent)?.click(); });
const accion = async ([tipo, k, v]) => {
  if (tipo === 'mando') { await abrirDock(); await p.waitForTimeout(300); const ok = await p.evaluate(([k, v]) => { const i = document.querySelector(`#pul-dock-panel input[data-m="${k}"]`); if (!i) return false; i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true })); return true; }, [k, v]); await p.waitForTimeout(3500); return ok; }
  if (tipo === 'tog') { await abrirDock(); await p.waitForTimeout(300); const ok = await p.evaluate(k => { const b = document.querySelector(`#pul-dock-panel button[data-m="${k}"]`); if (!b || b.disabled) return false; b.click(); return true; }, k); await p.waitForTimeout(k === 'esperar' ? 5000 : 3500); return ok; }
  if (tipo === 'nx') { const ok = await p.evaluate(([k, v]) => { const b = v ? document.querySelector(`#pul-neumo [data-nx="${k}"][data-sitio="${v}"]`) : document.querySelector(`#pul-neumo [data-nx="${k}"]`); if (!b || b.disabled) return false; b.click(); return true; }, [k, v]); await p.waitForTimeout(k === 'pasar' ? 4500 : 3500); return ok; }
};
const comprobar = async (q, Z, f, r) => {
  const cfg = COMPRUEBA[q.id];
  const btn = `${Z} .may-res .may-modelo:nth-of-type(1)`;
  const tipo = await p.evaluate(s => { const m = document.querySelector(s); return m?.dataset.pulmonVivo ? 'pulmon' : m?.dataset.capilarVivo ? 'capilar' : 'otro'; }, btn);
  await pulsar(btn); await p.waitForTimeout(2800);
  if (tipo === 'pulmon') {
    const m = await leerPulmon();
    console.log(`  COMPRUÉBALO ${q.id} → ${r.modelo.join(' / ')} · visible ${m.visible} · estado «${m.estado}» · rótulo ilustrativo ${m.rotulo} · guía ${m.guia}`);
    console.log(`    frase: ${m.frase}`); console.log(`    monitor: ${m.filas.join(' · ')}`); console.log(`    mandos: ${m.mandos.join(' · ')} · botones: ${m.togs.join(' ')} · sellos: ${m.sellos.join(' | ') || '—'}`);
    if (cfg.foto) { try { await p.evaluate(() => document.getElementById('esc-svg')?.scrollIntoView({ block: 'start' })); } catch {} await p.waitForTimeout(300); await foto(`comprueba-${q.id}`); }
    for (const a of cfg.acciones || []) { const ok = await accion(a); const m2 = await leerPulmon(); console.log(`    tras ${a.join(' ')} (${ok ? 'ok' : 'NO ENCONTRADO / deshabilitado'}): monitor: ${m2.filas.join(' · ')}`); console.log(`      frase: ${m2.frase} · sellos: ${m2.sellos.join(' | ') || '—'}${m2.nx ? ' · nx: ' + m2.nx : ''}`); }
    if (cfg.foto && cfg.acciones?.length) { try { await p.evaluate(() => document.getElementById('esc-svg')?.scrollIntoView({ block: 'start' })); } catch {} await p.waitForTimeout(300); await foto(`comprueba-${q.id}-tras`); }
  } else {
    const c = await p.evaluate(() => { const v = document.getElementById('cpv-raiz') || document.getElementById('capilar-vivo-view'); const est = document.querySelector('[data-cpv-estado][aria-pressed="true"]')?.textContent.trim(); const t = (v?.textContent || '').replace(/\s+/g, ' '); const g = k => t.match(new RegExp(k + '[^0-9]{0,30}([0-9][0-9,.]*)'))?.[1]; const vol = [...document.querySelectorAll('button')].find(b => /VOLVER/.test(b.textContent) && b.offsetParent)?.textContent.trim(); return { visible: !!v?.offsetParent, estado: est, gc: g('GC'), svo2: g('SvO₂'), o2er: g('O₂ER'), do2: g('DO₂'), frase: (document.querySelector('.cpv-frase, #cpv-frase, #cpv-frase-txt')?.textContent || '').trim().slice(0, 220), txt: t.slice(0, 260), vol }; });
    console.log(`  COMPRUÉBALO ${q.id} → ${r.modelo[0]} · capilar visible ${c.visible} · estado «${c.estado}» · GC ${c.gc} · SvO₂ ${c.svo2} · O₂ER ${c.o2er} · DO₂ ${c.do2} · volver «${c.vol}»`); console.log(`    frase: ${c.frase}`); console.log(`    texto: ${c.txt}`);
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
  const mira = await p.evaluate(f => { const s = document.querySelector(`#${f} .est-paso[data-paso="mira"]`); const v = s.querySelector('.vista-visual'); const imgs = [...v.querySelectorAll('img')]; return { abierto: !s.hidden, paneles: [...v.querySelectorAll('.vk-panel-titulo')].map(e => e.textContent.trim().slice(0, 45) + ' [' + (e.nextElementSibling?.firstElementChild?.className.split(' ')[0] || '') + ']'), figuras: v.querySelectorAll('.vk-figura').length, imgs: imgs.length, cargadas: imgs.filter(i => i.naturalWidth > 0).length, alto: v.offsetHeight, ver: v.querySelectorAll('.vk-ver, [data-resaltar]').length, texto: v.textContent.replace(/\s+/g, ' ').slice(0, 260) }; }, f);
  console.log(`Mira: abierto ${mira.abierto} · alto ${mira.alto} px · figuras ${mira.figuras} · imágenes ${mira.cargadas}/${mira.imgs} cargadas · «Ver en el texto» ${mira.ver}`);
  console.log('  paneles: ' + mira.paneles.join(' · '));
  console.log('  texto: ' + mira.texto);
  if (MIRA_FOTO.has(f)) await foto(`mira-${f}`, `#${f} .est-paso[data-paso="mira"]`);
  const juega = await p.evaluate(f => { const s = document.querySelector(`#${f} .est-paso[data-paso="juega"]`); return { hay: !!s, oculto: s?.hidden, btn: !!document.querySelector(`#${f} .est-ir[data-ir-paso="juega"]`), lista: [...(s?.querySelectorAll('.est-juega') || [])].map(b => (b.dataset.pulmonVivo || b.dataset.capilarVivo || '?') + ' «' + b.textContent.trim().slice(0, 45) + '»') }; }, f);
  console.log(`Juega (paso ${juega.hay ? 'existe' : 'no existe'}, botón ${juega.btn}, ${juega.lista.length}): ` + juega.lista.join(' · '));
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
  console.log('Piensa · Compruébalo: ' + (modelos.join(' · ') || 'ninguno'));
  await pulsar(`${ZG} [data-ir-paso="examen"]`); await p.waitForTimeout(200);
  const ZE = `#${f} .est-paso[data-paso="examen"] .may-zona`;
  await seguir(ZE);
  for (const q of d.examen) { const r = await contestar(q, false, ZE); if (COMPRUEBA[q.id] && r.modelo.length) await comprobar(q, ZE, f, r); await siguiente(ZE); }
  const rep = await p.evaluate(z => document.querySelector(z).textContent.replace(/\s+/g, ' ').slice(0, 160), ZE);
  console.log('Examen hecho · ' + rep);
  if (await p.evaluate(z => !!document.querySelector(z + ' [data-ir="repaso"]'), ZE)) { try { await pulsar(`${ZE} [data-ir="repaso"]`); await p.waitForTimeout(200); const rr = await p.evaluate(z => document.querySelector(z).textContent.replace(/\s+/g, ' ').slice(0, 120), ZE); console.log('Repaso: ' + rr); await contestar(d.guia[0], false, ZE); } catch (e) { console.log('  repaso: ' + e.message.slice(0, 80)); } }
  const ZC = `#${f} .est-paso[data-paso="caso"] .may-zona`;
  await pulsar(`#${f} .est-ir[data-ir-paso="caso"]`); await p.waitForTimeout(200);
  for (const [k, caso] of d.casos.entries()) {
    await pulsar(`${ZC} [data-caso="${k}"]`); await p.waitForTimeout(200);
    console.log(`Caso ${caso.id}:`);
    for (const [j, paso] of caso.pasos.entries()) {
      const fp = await p.evaluate(z => ({ nuevos: document.querySelectorAll(z + ' .may-paciente dd.may-cambia .may-nuevo').length, dia: document.querySelector(z + ' .may-dia')?.textContent, calc: document.querySelector(z + ' [data-calculadora], ' + z + ' .may-calc')?.textContent.trim().slice(0, 40) || '' }), ZC);
      const q = paso.pregunta;
      if (FOTOS_CASO[q.id]) await foto(FOTOS_CASO[q.id], ZC);
      const r = await contestar(q, j === 0, ZC);
      console.log(`  ${j + 1}. ${fp.dia} · nuevos ${fp.nuevos}/${paso.nuevo?.length ?? 0} · ${q.tipo} ${q.id} · calc «${fp.calc}» · modelo ${r.modelo.join(' / ') || '—'} · origen «${r.org}»`);
      if (COMPRUEBA[q.id] && r.modelo.length) await comprobar(q, ZC, f, r);
      await siguiente(ZC); await p.waitForTimeout(150);
    }
    const fin = await p.evaluate(z => ({ txt: document.querySelector(z).textContent.replace(/\s+/g, ' ').slice(0, 400), ficha: !!document.querySelector(z + ' [data-may-texto]'), modelo: document.querySelector(z + ' .may-modelo')?.dataset.pulmonVivo || document.querySelector(z + ' .may-modelo')?.dataset.capilarVivo, npts: document.querySelectorAll(z + ' .may-lleva li, ' + z + ' .may-fin li').length }), ZC);
    nota(/Lo que te llevas/.test(fin.txt) && fin.ficha, `${caso.id}: llega a «Lo que te llevas» (vuelta a la ficha ${fin.ficha}, modelo «${fin.modelo || '—'}», puntos ${fin.npts})`);
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
