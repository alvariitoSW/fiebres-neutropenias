// Prueba de navegador del shock a pie de cama (juez de autonomo/jueces.mjs --modelo shock-vivo). Parte 1: el modelo
// (sin Mayéutica). Uso: node autonomo/pruebas/shock-vivo.mjs <url-base> [--capturas <carpeta>]
// Recorre, a 390 px (con movimiento) y a 360 px (con «reducir movimiento»): los accesos (enlace cruzado de cada estado
// de la tabla F y desde la ficha, con su «← VOLVER»), los 5 pacientes a gravedad 0 / 50 / 100 con cifras de paciente
// posible, TODOS los mandos a su tope (volumen, sangre, edema, TEP, hemorragia, noradrenalina, vasopresina, dobutamina,
// reloj, Impella, ECMO, venteo, balón y razón: con aviso, sello, botón apagado y constantes posibles), los sellos de
// indicación, la consola del balón, los tres despieces, la explicación guiada de cada estado (señala en el dibujo y cada
// «Ver en la ficha» llega a un párrafo que existe), «¿Qué shock es?», que el bucle se para al salir, los rótulos
// (≥7,5 px) y el desborde lateral (0 px) tras cada paso. Reutiliza lo de autonomo/bloques/b3/herramientas/
// (shock-prueba, balon-prueba, limites-prueba). Sale con código 1 si algo falla.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
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
const espera = ms => p.waitForTimeout(REDUCIDO ? Math.min(ms, 250) : ms);
const clic = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no hay ' + s); e.click(); }, sel);
const desborde = () => p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const foto = n => CAPTURAS ? p.screenshot({ path: `${CAPTURAS}shv-${n}-${tag}.png` }) : null;
const S = () => p.evaluate(() => { const c = window.__shvPruebas(), r = c.R, L = c.cab.lectura;
    return { ...r, estado: document.querySelector('#shv-frase-txt .estado')?.textContent || '', frase: document.querySelector('#shv-frase-txt')?.textContent || '', aparato: c.est.aparato, horas: c.est.horas, pac: c.est.pac.k, modo: c.est.modo,
        edemaMl: Math.round(L.edema || 0), cris: c.cab.infundido.cris, sangre: c.cab.infundido.sangre || 0, na: c.cab.ajuste.na,
        sellos: [...document.querySelectorAll('#shv-raiz [class*="tope-sello"]')].filter(e => e.getClientRects().length).map(e => e.textContent.replace(/\s+/g, ' ').trim().slice(0, 60)),
        avisos: [...document.querySelectorAll('#shv-raiz .tope-aviso')].filter(e => e.getClientRects().length).map(e => e.textContent.replace(/\s+/g, ' ').trim().slice(0, 60)), corre: c.corriendo }; });
const limpio = async t => { const x = await p.evaluate(() => document.getElementById('shv-raiz').innerText); ok(!/NaN|undefined|Infinity/.test(x), `${t}: sin NaN/undefined/Infinity en el texto`); const d = await desborde(); ok(d <= 0, `${t}: desborde lateral ${d} px`); };
const posible = (r, t) => ok(r.pam >= 35 && r.pam <= 135 && r.fc >= 40 && r.fc <= 190 && r.pvc >= 0 && r.pvc <= 30 && r.pcp >= 0 && r.pcp <= 40 && r.ic >= 0.8 && r.ic <= 7.5 && r.spo2 >= 60 && r.spo2 <= 100, `${t}: constantes de paciente posible (PAM ${r.pam} FC ${r.fc} PVC ${r.pvc} PCP ${r.pcp} IC ${r.ic} SpO₂ ${r.spo2})`);
const abrir = k => p.evaluate(k => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'shockVivo', shockVivo: k }); document.body.append(t); t.click(); t.remove(); }, k);
const vista = () => p.evaluate(() => { const v = document.getElementById('shock-vivo-view'); return v.style.display === 'block' && v.offsetParent !== null; });
const grav = async v => { await p.evaluate(v => { const d = document.getElementById('shv-d-grav'); d.value = v; d.dispatchEvent(new Event('input')); d.dispatchEvent(new Event('change')); }, v); await espera(500); };
const pac = async k => { await clic(`#shv-pacientes [data-pac="${k}"]`); await espera(300); };
const pest = async k => { await clic(`#shv-dock-tabs [data-pest="${k}"]`); await espera(80); };
const desplegar = () => p.evaluate(() => { const d = document.getElementById('shv-dock'); if (d.classList.contains('dock-plegado')) d.querySelector('.dock-asa').click(); });
const rango = async (id, v) => { await p.evaluate(([id, v]) => { const d = document.getElementById(id); d.value = v; d.dispatchEvent(new Event('input', { bubbles: true })); d.dispatchEvent(new Event('change', { bubbles: true })); }, [id, v]); await espera(600); };
const apagados = sel => p.evaluate(s => [...document.querySelectorAll(s)].filter(e => e.disabled).length + '/' + document.querySelectorAll(s).length, sel);

await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
ok(await p.evaluate(() => !window.__shvPruebas), 'al arrancar la app el modelo NO está montado (lo pesado se monta al primer abrir)');

// ───────── A. Accesos: cada estado de la tabla F
const F = { hemo: ['mateo', 'vol'], septico: ['amparo', 'far'], cardio: ['aurelio', 'vol'], tapon: ['joaquin', 'grav'], tep: ['consuelo', 'vol'], balon: ['aurelio', 'sop'], impella: ['aurelio', 'sop'], ecmo: ['aurelio', 'sop'] };
for (const [k, [pc, pt]] of Object.entries(F)) {
    await abrir(k); await espera(1800);
    const r = await S();
    ok(await vista() && r.pac === pc && r.modo === 'explorar', `acceso «${k}»: abre con ${pc} en Explorar`);
    ok(await p.evaluate(pt => document.querySelector(`#shv-dock-tabs [data-pest="${pt}"]`).getAttribute('aria-selected') === 'true', pt), `acceso «${k}»: el dock abre en «${pt}»`);
    if (['balon', 'impella', 'ecmo'].includes(k)) ok(r.aparato === k, `acceso «${k}»: con el aparato puesto`);
    if (k === 'cardio') ok(await p.evaluate(() => document.getElementById('shv-enclavar').getAttribute('aria-pressed') === 'true'), 'acceso «cardio»: la cuña puesta');
    if (k === 'tapon') ok(await p.evaluate(() => !document.getElementById('shv-esc-eco').hidden), 'acceso «tapon»: la escena en la eco');
    await limpio(`acceso ${k}`);
    if (k === 'hemo') await foto('hemo');
}
await abrir('qs'); await espera(900);
ok(await p.evaluate(() => !document.getElementById('shv-zona-qs').hidden), 'acceso «qs»: «¿Qué shock es?» a la vista'); await limpio('acceso qs'); await foto('qs');
await abrir('explorar-no-existe'); await espera(500); ok(await vista(), 'un estado desconocido abre el modelo igualmente');

// ───────── B. Pacientes × gravedad
await abrir('hemo'); await espera(600);
for (const k of ['mateo', 'amparo', 'aurelio', 'joaquin', 'consuelo']) {
    await pac(k); await pest('grav');
    for (const g of [0, 50, 100]) { await grav(g); const r = await S(); posible(r, `${k} gravedad ${g} %`); ok(!/undefined|NaN/.test(r.frase), `${k} g${g}: la frase viva sin undefined/NaN`); }
    await limpio(`paciente ${k}`);
}

// ───────── C. Topes: cada mando a su tope (REGLAS §1.14)
// Volumen: +2 L hasta que el botón se apaga (o 12 veces), con sello, y constantes posibles
for (const k of ['mateo', 'amparo', 'aurelio', 'joaquin', 'consuelo']) {
    await abrir('hemo'); await pac(k); await pest('grav'); await grav(100); await pest('vol');
    let n = 0; for (; n < 12; n++) { const hay = await p.evaluate(() => { const b = document.querySelector('#shv-dock-panel [data-vol="2000"]'); if (!b || b.disabled) return false; b.click(); return true; }); if (!hay) break; await espera(250); }
    const r = await S(); posible(r, `${k} +2 L ×${n}`);
    ok(n < 12, `${k}: el bolo de +2 L que pasaría el tope sale apagado (${n} pulsaciones)`);
    ok(n < 12 && (await apagados('#shv-dock-panel [data-vol]')).split('/')[0] > 0, `${k}: queda al menos un botón de volumen apagado (${await apagados('#shv-dock-panel [data-vol]')})`);
    await limpio(`volumen ${k}`);
}
// Bolos de 500 hasta el sello: Amparo, Aurelio y Joaquín llegan al edema con SpO₂ <95
for (const k of ['amparo', 'aurelio', 'joaquin']) {
    await abrir('hemo'); await pac(k); await pest('grav'); await grav(100); await pest('vol');
    for (let n = 0; n < 40; n++) { const hay = await p.evaluate(() => { const b = document.querySelector('#shv-dock-panel [data-vol="500"]'); if (!b || b.disabled) return false; b.click(); return true; }); if (!hay) break; await espera(200); }
    const r = await S(); ok(r.edemaMl > 0 && r.spo2 < 95 && r.sellos.some(s => /sobrecarga|edema/i.test(s)), `${k}: +500 hasta el sello: edema ${r.edemaMl} mL, SpO₂ ${r.spo2}, sellos «${r.sellos.join('|')}»`);
    if (k === 'amparo') await foto('sobrecarga');
}
// TEP: tope de 500 mL con la PVC normal
await abrir('tep'); await espera(700); await pest('vol'); await clic('#shv-dock-panel [data-vol="500"]'); await espera(500);
{ const r = await S(); ok(r.sellos.some(s => /500/.test(s)), `TEP: sello «Tope de 500 mL» tras +500 (sellos: ${r.sellos.join('|')})`); ok((await apagados('#shv-dock-panel [data-vol]')).startsWith('3'), 'TEP: los tres botones de volumen apagados'); await foto('tep'); }
// Hemorragia: sangre y cristaloide hasta el tope de la reposición (1,5 × lo perdido): aviso o sello, botones apagados
await abrir('hemo'); await espera(600); await pest('vol');
for (const sel of ['[data-sangre]', '[data-vol="500"]', '[data-vol="250"]']) for (let n = 0; n < 12; n++) { const hay = await p.evaluate(sel => { const b = document.querySelector('#shv-dock-panel ' + sel); if (!b || b.disabled) return false; b.click(); return true; }, sel); if (!hay) break; await espera(250); }
{ const r = await S(); const t = [...r.sellos, ...r.avisos].join('|'); ok(/reposici|más de lo perdido/i.test(t), `Mateo: tope de la reposición con su aviso o sello (${t})`); ok((await apagados('#shv-dock-panel [data-vol], #shv-dock-panel [data-sangre]')) === '4/4', 'Mateo: los cuatro botones de volumen apagados'); posible(r, 'Mateo repuesto al tope'); await foto('hemorragia'); }
// Fármacos: NA 30 + vasopresina + dobutamina con g0 → hipertensión por vasopresor; NA 0/5/10/25/30
await abrir('septico'); await espera(700); await pest('far');
for (const d of [0, 5, 10, 25, 30]) { await clic(`#shv-dock-panel [data-na="${d}"]`); await espera(350); posible(await S(), `Amparo NA ${d}`); }
await clic('#shv-dock-panel [data-far="vaso"]'); await clic('#shv-dock-panel [data-far="dobuta"]'); await pest('grav'); await grav(0); await pest('far'); await espera(600);
{ const r = await S(); ok(r.sellos.some(s => /hipertensi/i.test(s)) || r.pam <= 110, `Amparo g0 + NA 30 + vasopresina + dobutamina: PAM ${r.pam}, sellos «${r.sellos.join('|')}»`); posible({ ...r, pam: Math.min(r.pam, 135) }, 'Amparo g0 con todos los fármacos'); await foto('hipertension'); }
// Reloj hasta las 48 h
await abrir('septico'); await pac('amparo'); await pest('reloj');
for (const h of [18, 18, 5, 5, 1, 1]) { await clic(`#shv-dock-panel [data-h="${h}"]`); await espera(250); }
{ const r = await S(); ok(r.horas >= 47 && r.sellos.some(s => /reloj/i.test(s)), `Reloj: a las ${r.horas} h, sello «Reloj agotado» (${r.sellos.join('|')})`); ok((await apagados('#shv-dock-panel [data-h]')) === '3/3', 'Reloj: los tres botones apagados'); await limpio('reloj 48 h'); await foto('reloj'); }
// Aparatos: Impella 2,5-5,5, ECMO 1-6 y venteo, balón 35/40 y razones
await abrir('impella'); await espera(900); await desplegar();
await rango('shv-d-imp', 25); posible(await S(), 'Impella 2,5'); await rango('shv-d-imp', 55); { const r = await S(); posible(r, 'Impella 5,5'); await foto('impella-55'); }
await clic('#shv-mandos [data-total="1"]'); await espera(900); posible(await S(), 'Impella con gasto total pedido'); await clic('#shv-mandos [data-total="1"]');
await limpio('Impella');
await abrir('ecmo'); await espera(900); await desplegar();
ok(await p.evaluate(() => document.getElementById('shv-d-ecmo').min === '10' && document.getElementById('shv-d-ecmo').max === '60'), 'ECMO: mando de 1,0 a 6,0 L/min');
for (const f of [10, 30, 60]) { await rango('shv-d-ecmo', f); posible(await S(), `ECMO ${f / 10} L/min`); }
for (const v of ['balon', 'impella', 'drenaje', 'no']) { await clic(`#shv-mandos [data-vent="${v}"]`); await espera(600); const r = await S(); posible(r, `ECMO 6 + venteo ${v}`); ok(r.gcTotal <= 8.5, `ECMO + venteo ${v}: gasto total ${r.gcTotal} posible`); }
await foto('ecmo'); await limpio('ECMO');
await abrir('balon'); await espera(900);
for (const v of [35, 40]) { await clic(`#shv-mandos [data-bal="${v}"]`); await espera(600); posible(await S(), `Balón ${v} mL`); }
for (const z of [1, 2, 3]) { await clic(`#shv-iabp [data-razon="${z}"]`); await espera(1200); const l = await p.evaluate(() => { const c = window.__shvPruebas().cab.lectura; return { razon: c.razon, pico: c.picoDia, sis: c.sisPropia, picoNo: c.picoNo, tele: c.teleDia, teleNo: c.teleNo }; });
    ok(l.razon === z && l.pico > l.sis && (z === 1 ? l.picoNo == null : l.picoNo != null && l.tele < l.teleNo), `Balón 1:${z}: pico asistido ${l.pico} > sistólica propia ${l.sis}; latido no asistido ${l.picoNo ?? '—'}`); }
await clic('#iabp-espera'); await espera(1500); ok((await p.evaluate(() => window.__shvPruebas().cab.ajuste.balon)) === 0, 'Consola del balón: Espera apaga el balón'); await clic('#iabp-inicio'); await espera(1500);
ok(await p.evaluate(() => { const t = document.getElementById('shv-iabp').innerText; return !/NaN|undefined|null/.test(t) && !document.getElementById('shv-iabp').hidden; }), 'Consola del balón visible y sin NaN'); await foto('consola-balon'); await limpio('Balón');
// Indicación: sellos «No indicado» y «Contraindicado»
for (const [pc, ap, re] of [['joaquin', 'balon', /contraindicado/i], ['joaquin', 'impella', /contraindicado/i], ['amparo', 'balon', /no indicado/i]]) {
    await abrir('hemo'); await pac(pc); await pest('sop'); await clic(`#shv-dock-panel [data-sop="${ap}"]`); await espera(600);
    ok(await p.evaluate(re => { const s = document.getElementById('shv-sello'); return !s.hidden && re.test(s.textContent); }, re), `${pc} + ${ap}: sello ${re} y el aparato no se pone`); if (pc === 'joaquin' && ap === 'balon') await foto('contraindicado');
}
// ───────── D. Despieces (S28-S30)
for (const [k, n] of [['impella', 8], ['balon', 5], ['ecmo', 5]]) {
    await abrir(k); await espera(800); await clic('#shv-esc-pest [data-plano="despiece"]'); await espera(500);
    const piezas = await p.evaluate(() => document.querySelectorAll('#shv-leyenda [data-ley]').length);
    ok(piezas === n, `Despiece ${k}: ${piezas} piezas (${n})`);
    await clic('#shv-leyenda [data-ley="0"]'); await espera(250);
    ok(await p.evaluate(() => !!document.querySelector('#shv-esc-svg .lit-sel') && document.querySelectorAll('#shv-esc-svg [data-foco="fuera"]').length > 0), `Despiece ${k}: al tocar una pieza se ilumina y el resto se apaga`); await foto('despiece-' + k);
    await clic('#shv-esc-pest [data-plano="recorrido"]'); await espera(500); await limpio('recorrido ' + k);
}
// ───────── E. Explicación guiada: señala y cada cita llega a un párrafo que existe
for (const k of ['hemo', 'septico', 'cardio', 'tapon', 'tep', 'balon', 'impella', 'ecmo']) {
    await abrir(k); await espera(900); await clic('#shv-btn-guia'); await espera(500);
    let pasos = 0, sinSenal = 0, citasRotas = [];
    for (; pasos < 8; pasos++) {
        const e = await p.evaluate(() => { const g = document.getElementById('shv-dock-guia'); return { anillo: document.querySelectorAll('#shv-raiz .guia-anillo, #shv-raiz .guia-marco').length, citas: [...g.querySelectorAll('[data-resaltar]')].map(c => [c.dataset.resaltar, !!document.querySelector(c.dataset.resaltar)]), sig: g.querySelector('#shv-guia-sig')?.textContent || '', n: g.querySelector('.guia-n')?.textContent || '' }; });
        if (!e.anillo) sinSenal++; citasRotas.push(...e.citas.filter(c => !c[1]).map(c => c[0]));
        if (pasos === 0) { const d = await desborde(); ok(d <= 0, `guía ${k}: desborde ${d}`); if (k === 'hemo') await foto('guia'); }
        if (/^Hecho/.test(e.sig)) { await clic('#shv-guia-sig'); break; }
        await clic('#shv-guia-sig'); await espera(300);
    }
    ok(pasos >= 2 && pasos <= 6, `guía ${k}: ${pasos + 1} pasos (3-5 esperados)`); ok(sinSenal === 0, `guía ${k}: todos los pasos señalan en el dibujo o el monitor (${sinSenal} sin señal)`);
    ok(citasRotas.length === 0, `guía ${k}: cada «Ver en la ficha» apunta a un párrafo que existe ${citasRotas.length ? '(rotas: ' + citasRotas.join(', ') + ')' : ''}`);
}
// las citas de las notas, las fuentes y «Para profundizar»
await abrir('hemo'); await espera(600);
{ const r = await p.evaluate(() => { const bad = [...document.querySelectorAll('#shv-raiz [data-resaltar]')].filter(c => !document.querySelector(c.dataset.resaltar)).map(c => c.dataset.resaltar); const pdf = [...document.querySelectorAll('#shv-raiz a.cita-pdf')].map(a => a.getAttribute('href')); return { bad, pdf: pdf.length, rutas: [...new Set(pdf.map(h => h.split('#')[0]))] }; });
  ok(r.bad.length === 0, `todas las citas del modelo llevan a un párrafo que existe ${r.bad.join(', ')}`); ok(r.pdf > 5 && r.rutas.every(u => /^docs\/.+\.pdf$/.test(u)), `los PDF son rutas desde la raíz de la app: ${r.rutas.join(', ')}`);
  for (const u of r.rutas) { const st = await p.evaluate(u => fetch(u, { method: 'HEAD' }).then(r => r.status), u); ok(st === 200, `el PDF ${u} existe`); } }
// ───────── F. ¿Qué shock es?
await abrir('qs'); await espera(700);
for (let i = 0; i < 3; i++) {
    await clic('#shv-zona-qs [data-qs="septico"]'); await clic('#shv-qs-mas'); await espera(500); await clic('#shv-zona-qs [data-qs="septico"]'); await clic('#shv-qs-mas'); await espera(350); await clic('#shv-qs-resp'); await espera(300);
    await limpio(`qs ${i + 1}`); if (i === 0) await foto('qs-resp');
    await clic('#shv-qs-sig'); await espera(300);
}
// ───────── G. Rótulos de los dibujos y letras
await abrir('ecmo'); await espera(900);
{ const m = await p.evaluate(() => { let min = 99, who = ''; for (const t of document.querySelectorAll('#shv-raiz svg text')) { const r = t.getBoundingClientRect(); if (!r.width || !r.height) continue; const sv = t.ownerSVGElement, vb = sv.viewBox.baseVal; const esc = vb && vb.width ? sv.getBoundingClientRect().width / vb.width : 1; const px = parseFloat(getComputedStyle(t).fontSize) * esc; if (px < min) { min = px; who = t.textContent.slice(0, 20); } } return [Math.round(min * 10) / 10, who]; }); ok(m[0] >= 7.5, `rótulos de los dibujos ≥ 7,5 px (el menor: ${m[0]} px «${m[1]}»)`); }
// ───────── H. Desde la ficha y de vuelta; el bucle se para al salir
await abrir('hemo'); await espera(500);
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'cardiologia', view: 'merinoCardiologia', panel: 'panel-merino-cardio-tabs', tab: 'mc-soporte-mecanico' }); document.body.append(t); t.click(); t.remove(); }); await espera(600);
await clic('#shv-enlace-mc-soporte-mecanico button'); await espera(1500);
{ const r = await S(); ok(await vista() && r.aparato === 'balon', 'desde la ficha de soporte mecánico abre con el balón'); }
await clic('#shv-volver'); await espera(900);
ok(await p.evaluate(() => { const t = document.getElementById('mc-soporte-mecanico'); return t && t.offsetParent !== null; }), '«← VOLVER» lleva a la ficha de soporte mecánico');
ok(await p.evaluate(() => window.__shvPruebas().corriendo === false), 'al salir de la vista el bucle de animación se para');
ok(errores.length === 0, `sin errores de consola (${errores.slice(0, 2).join(' | ')})`);
await ctx.close();
fallosTotales.push(...fallos.map(f => `${ANCHO}: ${f}`));
}
await correr(390, false);
await correr(360, true);
await b.close();
console.log(fallosTotales.length ? `\n${fallosTotales.length} fallo(s)` : '\nTodo bien');
process.exit(fallosTotales.length ? 1 : 0);
