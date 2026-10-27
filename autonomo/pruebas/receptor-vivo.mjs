// Prueba de navegador del receptor vivo (juez de autonomo/jueces.mjs --modelo receptor-vivo). Parte 1: el modelo.
// Parte 2: la Mayéutica entera (10 preguntas acertando y fallando, repaso y caso de Begoña) con desborde y «nada tapado» tras cada respuesta.
// Uso: node autonomo/pruebas/receptor-vivo.mjs <url-base> [--capturas <carpeta>]
// A 390 px (con movimiento) y 360 px (reducir movimiento), en contexto limpio: abre cada uno de los 14 estados con el enlace
// cruzado (estado y «← VOLVER» a la ficha), lleva cada mando a su 80 %, a su tope (sello visible, mando ENCENDIDO) y
// vuelve a bajarlo (el sello se quita), prueba cada interruptor, mide las cifras de un paciente posible, la lección de
// la cocaína y la FC de la dobutamina frente a la ficha, recorre la explicación guiada de cada estado, comprueba que
// todo «Ver en la ficha» llega a un id que existe y que no hay ids repetidos. Desborde (0 px) tras cada cosa.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { PREGUNTAS, CASOS } from '../../js/data/receptor-vivo-mayeutica.js';
const args = process.argv.slice(2);
const BASE = (args.find(a => /^https?:/.test(a)) || 'http://localhost:8000/').replace(/\/?$/, '/');
const CAP = args.includes('--capturas') ? args[args.indexOf('--capturas') + 1].replace(/\/?$/, '/') : null;
const b = await chromium.launch(); const total = [];
async function correr(ANCHO, RED) {
  const tag = `${ANCHO}${RED ? '-red' : ''}`; console.log(`\n── ${ANCHO} px${RED ? ' · reducir movimiento' : ''}`);
  const ctx = await b.newContext({ viewport: { width: ANCHO, height: 844 }, deviceScaleFactor: 2, reducedMotion: RED ? 'reduce' : 'no-preference' });
  const p = await ctx.newPage(); const errores = [], fallos = [];
  p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errores.push(m.text()); });
  p.on('pageerror', e => errores.push('PAGE ' + e.message));
  const ok = (c, t) => { console.log(`${c ? '✅' : '❌'} ${t}`); if (!c) fallos.push(t); };
  const desb = () => p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  const esp = ms => p.waitForTimeout(RED ? Math.min(ms, 250) : ms);
  const foto = n => CAP ? p.screenshot({ path: `${CAP}${n}-${tag}.png` }) : null;
  const abrir = est => p.evaluate(est => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'receptorVivo', receptorVivo: est }); document.body.append(t); t.click(); t.remove(); }, est);
  const R = () => p.evaluate(() => { const r = window.__receptor.R; return { pam: +r.pam, pas: +r.pas, pad: +r.pad, fc: +r.fc, ic: +r.ic, irvs: +r.irvs, lact: r.lact == null ? null : +r.lact }; });
  const deslizar = (k, v) => p.evaluate(([k, v]) => { const i = document.querySelector(`input[data-dosis="${k}"]`); if (!i) return null; i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); return [+i.min, +i.max, +i.step, i.disabled]; }, [k, v]);
  const sellos = () => p.evaluate(() => [...document.querySelectorAll('#rcv-raiz .tope-sello')].filter(e => e.getClientRects().length).map(e => e.textContent.replace(/\s+/g, ' ').trim().slice(0, 60)));
  const posible = r => Object.values(r).every(v => v == null || Number.isFinite(v)) && r.pam > 25 && r.pam < 190 && r.pas < 260 && r.pad > 15 && r.fc >= 30 && r.fc <= 200 && r.ic > 0.5 && r.ic < 9 && r.irvs > 3 && r.irvs < 60;

  await p.goto(BASE + 'index.html'); await p.waitForFunction(() => document.getElementById('receptor-vivo-view')); await p.waitForTimeout(1500);
  // 1. Acceso desde una ficha: el botón de Merino Cardiología abre su estado y «← VOLVER» lleva a la ficha
  await p.evaluate(() => { document.querySelector('#btn-cardiologia, [data-especialidad="cardiologia"]')?.click(); });
  await p.evaluate(() => { const b = document.querySelector('#rcv-enlace-mc-vasopresores button'); b.dataset.volverY = 0; });
  const enlaces = await p.evaluate(() => [...document.querySelectorAll('.rcv-enlace-ficha button')].map(b => b.parentElement.id + '=' + b.dataset.receptorVivo));
  console.log('enlaces', enlaces.join(' '));
  ok(enlaces.length >= 8 && enlaces.every(e => !e.endsWith('=')), `${enlaces.length} botones «verlo vivo» en las fichas, todos con estado`);
  await abrir('na-alta'); await esp(1800);
  const ids = await p.evaluate(() => { const m = new Map(); document.querySelectorAll('[id]').forEach(e => m.set(e.id, (m.get(e.id) || 0) + 1)); return [...m].filter(([, n]) => n > 1).map(([i]) => i); });
  ok(ids.length === 0, `ningún id repetido en toda la página (${ids.slice(0, 4)})`);
  ok(await p.evaluate(() => { const v = document.getElementById('receptor-vivo-view'); return v.offsetParent !== null && window.__receptor.ST.id === 'na-alta'; }), 'abre en el estado pedido (na-alta)');
  await foto('01-primera'); ok((await desb()) <= 0, 'sin desborde al abrir');
  // 2. Los 14 estados: abrir, cifras posibles, citas con destino, topes
  const estados = await p.evaluate(() => window.__receptor.ESTADOS.map(e => e.id)); ok(estados.length === 14, `${estados.length} estados`);
  const faltan = new Set();
  for (const id of estados) {
    await abrir(id); await esp(1600);
    const st = await p.evaluate(() => window.__receptor.ST.id); ok(st === id, `abre «${id}»`);
    const base = await R(); ok(posible(base), `${id}: constantes de un paciente posible (PAM ${Math.round(base.pam)}, FC ${Math.round(base.fc)}, IC ${base.ic.toFixed(1)}, IRVS ${base.irvs.toFixed(1)})`);
    // citas visibles y ocultas: cada id existe
    const cit = await p.evaluate(() => [...document.querySelectorAll('#rcv-raiz [data-resaltar]')].map(b => b.dataset.resaltar.slice(1)));
    for (const c of cit) if (!(await p.evaluate(c => !!document.getElementById(c), c))) faltan.add(c);
    // mandos: 80 %, tope, otra vez abajo
    const mandos = await p.evaluate(() => [...document.querySelectorAll('input[data-dosis]')].map(i => [i.dataset.dosis, +i.min, +i.max, +i.step]));
    for (const [k, mn, mx, pas] of mandos) {
      await deslizar(k, Math.round(0.8 * mx / pas) * pas); await esp(500);
      const aviso = await p.evaluate(() => [...document.querySelectorAll('#rcv-raiz .tope-aviso')].filter(e => e.getClientRects().length).length);
      const r80 = await R(); ok(posible(r80), `${id} · ${k} al 80 % posible (PAM ${Math.round(r80.pam)} FC ${Math.round(r80.fc)})`);
      const d = await deslizar(k, mx); await esp(1500);
      const s = await sellos(), rt = await R();
      ok(s.length > 0, `${id} · ${k} al tope (${mx}): sello visible «${s[0] || ''}»`);
      ok(d[3] === false && await p.evaluate(k => !document.querySelector(`input[data-dosis="${k}"]`).disabled, k), `${id} · ${k}: el deslizador sigue encendido con el sello`);
      ok(posible(rt), `${id} · ${k} al tope: paciente posible (PAM ${Math.round(rt.pam)}, FC ${Math.round(rt.fc)}, IC ${rt.ic.toFixed(1)}, IRVS ${rt.irvs.toFixed(1)})`);
      if (id === 'dobutamina' && k === 'dobutamina') { ok(rt.fc - base.fc >= 5 && rt.fc - base.fc <= 16, `dobutamina 20: FC +${Math.round(rt.fc - base.fc)} lpm (ficha +5-15)`); await foto('02-dobutamina-tope'); }
      ok((await desb()) <= 0, `${id} · ${k} tope sin desborde`);
      await deslizar(k, mn === 0 ? Math.round(0.4 * mx / pas) * pas : mn); await esp(900);
      ok((await sellos()).length === 0, `${id} · ${k}: al bajar la dosis el sello se quita`);
    }
    // interruptores
    const togs = await p.evaluate(() => [...document.querySelectorAll('#rcv-dock-explorar button[data-tog]')].map(b => b.dataset.tog));
    for (const k of togs) { for (let i = 0; i < 3; i++) { await p.evaluate(k => document.querySelector(`#rcv-dock-explorar button[data-tog="${k}"]`)?.click(), k); await esp(300); } const r = await R(); ok(posible(r), `${id} · interruptor ${k} (×3): posible (PAM ${Math.round(r.pam)} FC ${Math.round(r.fc)})`); }
    if (id === 'cocaina') {
      await abrir('cocaina'); await esp(1600);
      const antes = await R(); await p.evaluate(() => document.querySelector('#rcv-dock-explorar button[data-tog="betabloqueante"]')?.click()); await esp(1800);
      const desp = await R(), sel = await sellos();
      console.log('cocaína', JSON.stringify(antes), '→', JSON.stringify(desp), sel);
      ok(sel.some(t => /ontraindicad/.test(t)), 'cocaína + betabloqueante: sello «Contraindicado»');
      const lec = await p.evaluate(() => document.getElementById('rcv-fig1-lect').textContent + ' | ' + document.getElementById('rcv-frase-txt').textContent.slice(0, 200));
      console.log('   lectura/frase:', lec); await foto('03-cocaina-betabloqueante');
    }
    ok((await desb()) <= 0, `${id}: sin desborde`);
  }
  ok(faltan.size === 0, `todo «Ver en la ficha» llega a un id que existe${faltan.size ? ' (faltan: ' + [...faltan] + ')' : ''}`);
  // 3. La explicación guiada de cada estado
  for (const id of estados) {
    await abrir(id); await esp(900);
    await p.evaluate(() => document.getElementById('rcv-explicame').click()); await esp(500);
    let pasos = 0, sin = 0;
    for (let i = 0; i < 8; i++) {
      await esp(600);
      const h = await p.evaluate(() => ({ ring: document.querySelectorAll('#rcv-raiz .rcv-guia-anillo, #rcv-raiz .rcv-guia-marco').length, cita: !!document.querySelector('#rcv-dock-guia [data-resaltar]'), sig: document.getElementById('rcv-guia-sig')?.textContent }));
      pasos++; if (!h.ring) sin++; if (!h.cita) fallos.push(`guía ${id} paso ${i + 1} sin cita`);
      if ((await desb()) > 0) fallos.push(`guía ${id} desborde`);
      if (!h.sig || /hecho/i.test(h.sig)) break; await p.evaluate(() => document.getElementById('rcv-guia-sig').click());
    }
    ok(pasos >= 3 && pasos <= 6 && sin <= 1, `guía «${id}»: ${pasos} pasos, ${sin} sin señal`);
    await p.evaluate(() => document.getElementById('rcv-guia-x')?.click());
    if (id === 'na-alta') await foto('04-guia');
  }
  // 4. El modo del móvil: la frase y los mandos no se salen; rótulos
  await abrir('betabloqueo'); await esp(1500); await foto('05-begona');
  const rot = await p.evaluate(() => [...document.querySelectorAll('#rcv-raiz svg text')].filter(t => t.getClientRects().length).map(t => { const m = t.getScreenCTM(); return +(parseFloat(getComputedStyle(t).fontSize) * (m ? m.a : 1)).toFixed(1); }));
  ok(rot.length === 0 || Math.min(...rot) >= 7.4, `rótulos de los dibujos ≥ 7,5 px (mínimo ${rot.length ? Math.min(...rot) : '-'})`);
  // 4b. La Mayéutica: 10 preguntas (fallando G1, G4 y E3, el resto bien), el repaso y el caso entero
  await abrir('na-baja'); await esp(1200);
  const txt = h => String(h).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const clic = sel => p.evaluate(s => { const e = document.querySelector(s); if (e) e.click(); return !!e; }, sel);
  const hay = sel => p.evaluate(s => { const e = document.querySelector(s); return !!e && e.getClientRects().length > 0; }, sel);
  const modelo = () => p.evaluate(() => ['rcv-monitor', 'rcv-fig1', 'rcv-zona-lupa'].map(i => !document.getElementById(i).hidden));
  // nada tapado: el botón «Siguiente» (o el que toque) entra entero en la pantalla y no queda bajo el dock fijo
  const libre = async (sel, que) => {
    const r = await p.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(), d = document.getElementById('rcv-dock').getBoundingClientRect(); return { fondo: b.bottom, dock: d.top, tope: b.top, alto: innerHeight }; }, sel);
    ok(r && r.tope >= 0 && r.fondo <= r.dock + 1, `${que}: a la vista y sobre el dock${r ? ` (fondo ${Math.round(r.fondo)}, dock ${Math.round(r.dock)})` : ' (no existe)'}`);
  };
  const sinDesborde = async que => { const d = await desb(); if (d > 0) fallos.push(`${que}: desborde ${d}px`); };
  const ocultar = (q, ok_) => ok_;
  async function contestar(q, bien, etiqueta) {
    const cont = '#rcv-preg';
    const html0 = await p.evaluate(s => document.querySelector(s).innerHTML, cont);
    if (q.tipo === 'test') {
      const buena = txt(q.opciones.find(o => o.ok).t);
      if (txt(html0).includes(buena)) fallos.push(`${etiqueta}: la respuesta buena está escrita antes de contestar`);
    }
    if (q.predice && !q.sinModelo) { const m = await modelo(); if (m.some(Boolean)) fallos.push(`${etiqueta}: el modelo se ve antes de contestar (${m})`); }
    else if (q.sinModelo) { const m = await modelo(); if (m.some(Boolean)) fallos.push(`${etiqueta}: pregunta sin modelo y el modelo a la vista`); }
    if (q.tipo === 'test') {
      await clic(`${cont} [data-accion="ops"]`); await esp(150);
      const ops = await p.evaluate(s => [...document.querySelectorAll(s + ' [data-op]')].map(b => b.textContent.trim()), cont);
      const buena = txt(q.opciones.find(o => o.ok).t);
      const idx = ops.findIndex(t => (txt(t) === buena) === bien);
      await p.evaluate(([s, i]) => document.querySelector(`${s} [data-op="${i}"]`).click(), [cont, idx]);
    } else if (q.tipo === 'destapa') {
      await clic(`${cont} [data-accion="destapa"]`); await esp(150);
      await p.evaluate(([s, bien]) => document.querySelectorAll(`${s} input[data-p]`).forEach((x, i) => { if (bien || i === 0) x.checked = true; }), [cont, bien]);
      await clic(`${cont} [data-accion="puntos"]`);
    } else {
      await p.evaluate(([s, mal, bien]) => document.querySelectorAll(`${s} [data-fr]`).forEach((b, i) => { if (bien && mal[i]) b.click(); }), [cont, q.frases.map(f => f.mal), bien]);
      await clic(`${cont} [data-accion="corregir"]`); await esp(100);
      await p.evaluate(s => document.querySelectorAll(`${s} [data-ver]`).forEach(b => b.click()), cont);
    }
    await esp(300);
    if (q.tocar) {
      if (!(await hay(`${cont} [data-mando="sube"]`))) fallos.push(`${etiqueta}: no sale «Compruébalo»`);
      await clic(`${cont} [data-mando="sube"]`);
      await p.waitForFunction(() => document.querySelector('#rcv-preg [data-accion="sig"]'), null, { timeout: 20000 }).catch(() => fallos.push(`${etiqueta}: tras «Compruébalo» no sale «Siguiente»`));
      await esp(600);
      const m = await modelo(); if (!m.every(Boolean)) fallos.push(`${etiqueta}: tras comprobar, el modelo sigue escondido (${m})`);
    } else if (!q.sinModelo) { const m = await modelo(); if (!m.every(Boolean)) fallos.push(`${etiqueta}: tras contestar, el modelo sigue escondido (${m})`); }
    // «Ver en la ficha» de la respuesta: cada id existe
    const rotos = await p.evaluate(s => [...document.querySelectorAll(`${s} [data-resaltar]`)].map(b => b.dataset.resaltar).filter(id => !document.querySelector(id)), cont);
    if (rotos.length) fallos.push(`${etiqueta}: citas rotas ${rotos}`);
    const nCitas = await p.evaluate(s => document.querySelectorAll(`${s} [data-resaltar]`).length, cont);
    if (!nCitas) fallos.push(`${etiqueta}: sin «Ver en la ficha»`);
    await esp(700);
    await sinDesborde(etiqueta); await libre(`${cont} [data-accion="sig"]`, etiqueta);
    return nCitas;
  }
  await p.evaluate(() => { localStorage.removeItem('receptor-vivo-mayeutica-v1'); });
  await clic('#rcv-modo-preguntas'); await esp(400);
  ok(await hay('#rcv-vista-preguntas') && !(await hay('#rcv-zona-estados')), 'Mayéutica: se ve el inicio y se esconden los estados del modo Explorar');
  await foto('06-mayeutica-inicio'); await sinDesborde('inicio');
  ok((await p.evaluate(() => document.getElementById('rcv-dock-estudio').hidden === false)), 'Mayéutica: el dock de progreso sustituye al de mandos');
  await clic('#rcv-preg [data-ir="recorrido"]'); await esp(300);
  const FALLAR = new Set(['G1', 'G4', 'E3']);
  let citasTot = 0;
  for (let i = 0; i < PREGUNTAS.length; i++) {
    const q = PREGUNTAS[i], etiqueta = `${q.num}`;
    const cab = await p.evaluate(() => document.querySelector('#rcv-preg .rcv-cab-preg')?.textContent || '');
    if (!cab.includes(q.tipo === 'test' ? 'Test' : q.tipo === 'destapa' ? 'destapa' : 'error')) fallos.push(`${etiqueta}: cabecera inesperada «${cab}»`);
    citasTot += await contestar(q, !FALLAR.has(q.num), etiqueta);
    if (i === 0) await foto('07-pregunta-fallada');
    if (q.num === 'G3') await foto('08-comprobada');
    await clic('#rcv-preg [data-accion="sig"]'); await esp(300);
  }
  ok(citasTot >= 10, `10 preguntas contestadas: cada una con su «Ver en la ficha» (${citasTot} enlaces)`);
  // Repaso: solo lo fallado (G1, G4, E3) y se acierta
  const chips = await p.evaluate(() => [...document.querySelectorAll('#rcv-preg [data-rep]')].map(b => b.dataset.rep));
  ok(chips.length === 3 && chips.join() === 'rcv-g1,rcv-g4,rcv-e3', `repaso: vuelve solo lo fallado (${chips})`);
  await foto('09-repaso'); await sinDesborde('repaso');
  for (const id of ['rcv-g1', 'rcv-g4', 'rcv-e3']) {
    await clic(`#rcv-preg [data-rep="${id}"]`); await esp(300);
    const q = PREGUNTAS.find(x => x.id === id);
    await contestar(q, true, 'repaso ' + q.num);
    await clic('#rcv-preg [data-accion="sig"]'); await esp(300);
  }
  ok(await p.evaluate(() => /No queda nada por repasar/.test(document.getElementById('rcv-preg').textContent)), 'repaso: acertar saca las preguntas de la lista');
  await clic('#rcv-preg [data-ir="casos"]'); await esp(300);
  await sinDesborde('lista de casos');
  // Caso de Begoña: 5 pasos bien (el 3.º se falla a propósito y el 4.º tiene «Compruébalo» del glucagón)
  await clic('#rcv-preg [data-caso="0"]'); await esp(400);
  const C = CASOS[0];
  for (let i = 0; i < C.pasos.length; i++) {
    const q = C.pasos[i].pregunta;
    const ficha = await p.evaluate(() => [...document.querySelectorAll('#rcv-preg dl.rcv-paciente dt')].map(e => e.textContent));
    if (!ficha.length) fallos.push(`caso paso ${i + 1}: sin ficha del paciente`);
    if (i === 3) { const nuevos = await p.evaluate(() => document.querySelectorAll('#rcv-preg .rcv-cambia').length); if (nuevos < 2) fallos.push('caso paso 4: lo nuevo no sale marcado'); await foto('10-caso-paso4'); }
    await contestar(q, i !== 2, `caso paso ${i + 1}`);
    await clic('#rcv-preg [data-accion="sig"]'); await esp(400);
  }
  ok(await p.evaluate(() => /Lo que te llevas/.test(document.getElementById('rcv-preg').textContent)), 'caso: sale «Lo que te llevas»');
  await foto('11-caso-final'); await sinDesborde('final del caso');
  await libre('#rcv-preg [data-fin="otro"]', 'final del caso');
  ok(await hay('#rcv-preg [data-fin="modelo"]') && await hay('#rcv-preg [data-resaltar]'), 'caso: «Volver al receptor» y «Repasar en la ficha» salen');
  const rotosFin = await p.evaluate(() => [...document.querySelectorAll('#rcv-preg [data-resaltar]')].map(b => b.dataset.resaltar).filter(id => !document.querySelector(id)));
  ok(rotosFin.length === 0, 'caso: «Repasar en la ficha» llega a un id que existe');
  await clic('#rcv-preg [data-fin="modelo"]'); await esp(500);
  ok(await p.evaluate(() => window.__receptor.ST.id === 'betabloqueo' && !document.getElementById('rcv-zona-estados').hidden && document.getElementById('rcv-vista-preguntas').hidden), 'caso: «Volver al receptor» abre el modelo de Begoña en Explorar');
  await sinDesborde('de vuelta en Explorar');
  // La guía y los estados siguen funcionando tras la Mayéutica
  await clic('#rcv-modo-preguntas'); await esp(300); await clic('#rcv-modo-explorar'); await esp(400);
  ok(await hay('#rcv-zona-estados') && await hay('#rcv-monitor'), 'Explorar ↔ Mayéutica: ida y vuelta sin perder el modelo');
  // 5. Salir: el bucle se para
  await p.evaluate(() => document.querySelector('#rcv-volver').click()); await esp(800);
  ok(await p.evaluate(() => document.getElementById('receptor-vivo-view').offsetParent === null), '«← VOLVER» cierra el modelo');
  ok(errores.length === 0, `sin errores de consola (${errores.slice(0, 3).join(' | ')})`);
  total.push(...fallos.map(f => tag + ': ' + f)); await ctx.close();
}
await correr(390, false); await correr(360, true); await b.close();
console.log(total.length ? `\nFALLOS (${total.length}):\n- ` + total.join('\n- ') : '\nTODO EN VERDE'); process.exit(total.length ? 1 : 0);
