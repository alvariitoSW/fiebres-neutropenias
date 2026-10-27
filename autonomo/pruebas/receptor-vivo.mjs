// Prueba de navegador del receptor vivo (juez de autonomo/jueces.mjs --modelo receptor-vivo). Parte 1: el modelo (sin Mayéutica).
// Uso: node autonomo/pruebas/receptor-vivo.mjs <url-base> [--capturas <carpeta>]
// A 390 px (con movimiento) y 360 px (reducir movimiento), en contexto limpio: abre cada uno de los 14 estados con el enlace
// cruzado (estado y «← VOLVER» a la ficha), lleva cada mando a su 80 %, a su tope (sello visible, mando ENCENDIDO) y
// vuelve a bajarlo (el sello se quita), prueba cada interruptor, mide las cifras de un paciente posible, la lección de
// la cocaína y la FC de la dobutamina frente a la ficha, recorre la explicación guiada de cada estado, comprueba que
// todo «Ver en la ficha» llega a un id que existe y que no hay ids repetidos. Desborde (0 px) tras cada cosa.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
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
  // 5. Salir: el bucle se para
  await p.evaluate(() => document.querySelector('#rcv-volver').click()); await esp(800);
  ok(await p.evaluate(() => document.getElementById('receptor-vivo-view').offsetParent === null), '«← VOLVER» cierra el modelo');
  ok(errores.length === 0, `sin errores de consola (${errores.slice(0, 3).join(' | ')})`);
  total.push(...fallos.map(f => tag + ': ' + f)); await ctx.close();
}
await correr(390, false); await correr(360, true); await b.close();
console.log(total.length ? `\nFALLOS (${total.length}):\n- ` + total.join('\n- ') : '\nTODO EN VERDE'); process.exit(total.length ? 1 : 0);
