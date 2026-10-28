// Prueba de navegador del shock a pie de cama (juez de autonomo/jueces.mjs --modelo shock-vivo). El modelo y su
// Mayéutica (guía, examen acertando y fallando, repaso y el caso de Aurelio, midiendo desborde y que el «Siguiente» no quede bajo el dock). Uso: node autonomo/pruebas/shock-vivo.mjs <url-base> [--capturas <carpeta>]
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
const { barajar } = await import(new URL('../../js/core/mayeutica-motor.js', import.meta.url));
const { PREGUNTAS: PREG, CASOS: CASOS_D } = await import(new URL('../../js/data/shock-vivo-mayeutica.js', import.meta.url));
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
const F = { posparo: ['virginia', 'grav'], hemo: ['mateo', 'vol'], septico: ['amparo', 'far'], cardio: ['aurelio', 'vol'], tapon: ['joaquin', 'grav'], tep: ['consuelo', 'vol'], balon: ['aurelio', 'sop'], impella: ['aurelio', 'sop'], ecmo: ['aurelio', 'sop'] };
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

// ───────── A2. Posparo: el mando es «horas tras la RCE» (0 → 72 h); la Ees se recupera con él (Marino cap. 21, p. 64)
{
    await abrir('posparo'); await espera(1500); await pest('grav');
    const rango = await p.evaluate(() => { const d = document.getElementById('shv-d-grav'); return [d.min, d.max]; });
    ok(rango[0] === '0' && rango[1] === '72', `posparo: el mando de gravedad va de 0 a 72 h (${rango.join('-')})`);
    const entre = (v, a, b) => v >= a && v <= b;
    // 0 h, sin noradrenalina: shock cardiogénico (IC <2,2, Tabla 14.1), PAM <65, PCP por debajo de la diastólica pulmonar
    await grav(0); let r = await S();
    ok(entre(r.pam, 50, 66) && entre(r.ic, 1.6, 2.1) && entre(r.pcp, 16, 20) && r.papd >= r.pcp && entre(r.fc, 100, 130) && r.lact >= 3, `posparo 0 h: PA ${r.pas}/${r.pad} PAM ${r.pam} FC ${r.fc} IC ${r.ic} PCP ${r.pcp} (PAPd ${r.papd}) lactato ${r.lact}`);
    ok(r.estado === 'Posparo: miocardio aturdido', `posparo 0 h: el estado se llama «${r.estado}»`);
    posible(r, 'posparo 0 h');
    // 24 h con noradrenalina 5 µg/min
    await grav(24); await pest('far'); await clic('#shv-dock-panel [data-na="5"]'); await espera(1500); r = await S();
    ok(entre(r.pam, 72, 84) && entre(r.ic, 2.1, 2.7) && entre(r.pcp, 13, 19) && r.papd >= r.pcp && r.na === 5, `posparo 24 h + NA 5: PA ${r.pas}/${r.pad} PAM ${r.pam} FC ${r.fc} IC ${r.ic} PCP ${r.pcp} (PAPd ${r.papd})`);
    // 72 h sin noradrenalina
    await clic('#shv-dock-panel [data-na="0"]'); await pest('grav'); await grav(72); await espera(500); r = await S();
    ok(entre(r.pam, 80, 95) && entre(r.pas, 100, 125) && entre(r.ic, 2.6, 3.1) && entre(r.pcp, 8, 12) && entre(r.fc, 65, 90) && r.na === 0, `posparo 72 h: PA ${r.pas}/${r.pad} PAM ${r.pam} FC ${r.fc} IC ${r.ic} PCP ${r.pcp}`);
    ok(r.estado === 'Posparo: a las 72 h', `posparo 72 h: el estado se llama «${r.estado}»`);
    const sello = await p.evaluate(() => /Pasadas las 72 h/.test(document.getElementById('shv-raiz').innerText)); ok(sello, 'posparo 72 h: sello «Pasadas las 72 h» con su consecuencia');
    // 80 h: el mando no pasa de 72 y las cifras no cambian
    await grav(80); const r80 = await S();
    ok(r80.pam === r.pam && r80.ic === r.ic && r80.pcp === r.pcp, `posparo 80 h: igual que a las 72 h (IC ${r80.ic}, PAM ${r80.pam}, PCP ${r80.pcp})`);
    // el reloj de la RCE: desde 0 h, +18 h x4 llega a 72 y el botón se apaga
    await grav(0); await pest('reloj'); let veces = 0;
    for (; veces < 6; veces++) { const hay = await p.evaluate(() => { const b = document.querySelector('#shv-dock-panel [data-h="18"]'); if (!b || b.disabled) return false; b.click(); return true; }); if (!hay) break; await espera(400); }
    r = await S(); ok(veces === 4 && r.ic >= 2.6 && r.pcp <= 12, `posparo: +18 h ×${veces} lleva el reloj a las 72 h y apaga el botón (IC ${r.ic}, PCP ${r.pcp})`);
    ok(r.pam >= 35, 'posparo: PAM posible tras el reloj'); await limpio('posparo');
    // el monitor marca la PAM con ≥75 (Tabla 21.4)
    await pest('grav'); await grav(0); const marca = await p.evaluate(() => document.querySelector('#shv-raiz [data-fila="pa"]')?.innerText || ''); ok(/75/.test(marca), `posparo: la PAM se compara con ≥75 (${marca.replace(/\s+/g, ' ').trim().slice(0, 50)})`);
}

// ───────── B. Pacientes × gravedad
await abrir('hemo'); await espera(600);
for (const k of ['mateo', 'amparo', 'aurelio', 'joaquin', 'consuelo', 'virginia']) {
    await pac(k); await pest('grav');
    for (const g of [0, 50, 100]) { await grav(g); const r = await S(); posible(r, `${k} gravedad ${g} %`); ok(!/undefined|NaN/.test(r.frase), `${k} g${g}: la frase viva sin undefined/NaN`); }
    await limpio(`paciente ${k}`);
}

// ───────── C. Topes: cada mando a su tope (REGLAS §1.14)
// Volumen: +2 L hasta que el botón se apaga (o 12 veces), con sello, y constantes posibles
for (const k of ['mateo', 'amparo', 'aurelio', 'joaquin', 'consuelo', 'virginia']) {
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
for (const k of ['hemo', 'septico', 'cardio', 'tapon', 'tep', 'balon', 'impella', 'ecmo', 'posparo']) {
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
// ───────── I. Mayéutica: guía, examen (acertando y fallando), repaso y el caso
{
const Z = '#shv-zona-may';
const visibleSig = () => p.evaluate(() => { const b = document.querySelector('#shv-zona-may [data-accion="sig"]'); if (!b) return 'no hay Siguiente'; b.scrollIntoView({ block: 'nearest' });
    const r = b.getBoundingClientRect(), d = document.getElementById('shv-dock').getBoundingClientRect(); return r.top >= 0 && r.bottom <= d.top + 1 ? '' : `Siguiente fuera de vista o bajo el dock (arriba ${Math.round(r.top)}, abajo ${Math.round(r.bottom)}, dock ${Math.round(d.top)})`; });
const velo = () => p.evaluate(() => !document.getElementById('shv-velo-mon').hidden && !document.getElementById('shv-velo-esc').hidden);
const citasOk = () => p.evaluate(() => { const bad = [...document.querySelectorAll('#shv-zona-may [data-resaltar]')].filter(c => !document.querySelector(c.dataset.resaltar)).map(c => c.dataset.resaltar); return { bad, n: document.querySelectorAll('#shv-zona-may [data-resaltar]').length }; });
const NaNs = () => p.evaluate(() => /NaN|undefined|Infinity/.test(document.getElementById('shv-zona-may').innerText));
async function medir(t, esperaSig = true) {
    const d = await desborde(); ok(d <= 0, `${t}: desborde ${d}`);
    ok(!(await NaNs()), `${t}: sin NaN/undefined`);
    if (esperaSig) { const v = await visibleSig(); ok(v === '', `${t}: ${v || 'Siguiente a la vista, sobre el dock'}`); }
}
async function responder(q, { bien = true, repaso = false, foto: f = null } = {}) {
    const tag = `${q.id}${bien ? '' : ' (fallando)'}${repaso ? ' en el repaso' : ''}`;
    if (q.predice && !repaso) ok(await velo(), `${tag}: el monitor y el dibujo están tapados antes de contestar («primero predices»)`);
    if (repaso && q.predice) ok(!(await velo()), `${tag}: en el repaso no hay velo`);
    if (q.tipo === 'test') {
        ok(await p.evaluate(Z => !document.querySelector(Z + ' [data-op]'), Z), `${tag}: las opciones no están en el HTML antes de «Ya lo tengo»`);
        await clic(`${Z} [data-accion="ops"]`); await espera(150);
        const orden = barajar(q.opciones, q.id); const k = bien ? orden.findIndex(o => o.ok) : orden.findIndex(o => !o.ok);
        if (f) await foto(f + '-opciones');
        await clic(`${Z} [data-op="${k}"]`); await espera(250);
        const t = await p.evaluate(Z => document.querySelector(Z + ' .shv-respuesta')?.innerText || '', Z);
        ok(bien ? /✓ Bien/.test(t) : /Qué le habría pasado al paciente/.test(t), `${tag}: respuesta ${bien ? 'buena' : 'mala con su «qué le habría pasado»'}`);
    } else if (q.tipo === 'destapa') {
        await clic(`${Z} [data-accion="destapa"]`); await espera(150);
        await p.evaluate(([Z, bien]) => document.querySelectorAll(Z + ' input[data-p]').forEach((x, i) => { if (bien || i > 0) x.checked = true; }), [Z, bien]);
        await clic(`${Z} [data-accion="puntos"]`); await espera(250);
    } else {
        const malas = q.frases.map((x, i) => x.mal ? i : -1).filter(i => i >= 0);
        for (const i of (bien ? malas : [0, 1, 2, 3].filter(i => !malas.includes(i)).slice(0, 1))) await clic(`${Z} [data-fr="${i}"]`);
        await clic(`${Z} [data-accion="corregir"]`); await espera(200);
        for (const i of malas) await clic(`${Z} [data-ver="${i}"]`);
        await espera(150);
        ok(await p.evaluate(Z => !!document.querySelector(Z + ' .shv-correccion .cita-ir'), Z) || malas.length === 0, `${tag}: la frase buena lleva su «Ver en la ficha»`);
    }
    const c = await citasOk(); ok(c.n > 0 && c.bad.length === 0, `${tag}: ${c.n} «Ver en la ficha» y todas llegan a un párrafo que existe ${c.bad.join(', ')}`);
    if (q.comprobar && !repaso) {
        if (q.predice) ok(await velo(), `${tag}: tras contestar y antes de «Compruébalo», el monitor sigue tapado`);
        await clic(`${Z} [data-comprueba]`); await espera(700);
        ok(!(await velo()), `${tag}: «Compruébalo» destapa el modelo`);
        ok(await p.evaluate(Z => !!document.querySelector(Z + ' .shv-para .shv-ok'), Z), `${tag}: dice qué mirar en el modelo`);
        if (q.comprobar.cifras) ok(await p.evaluate(Z => /→/.test(document.querySelector(Z + ' dl.antes-despues')?.innerText || ''), Z), `${tag}: cifras antes → después`);
    } else ok(!(await velo()), `${tag}: nada tapado tras contestar`);
    await medir(tag); if (f) await foto(f);
    await clic(`${Z} [data-accion="sig"]`); await espera(350);
}
await abrir('hemo'); await espera(700);
await clic('#shv-modo-may'); await espera(600);
ok(await p.evaluate(() => !document.getElementById('shv-zona-may').hidden && !document.getElementById('shv-dock-est').hidden && document.getElementById('shv-modo-may').getAttribute('aria-selected') === 'true'), 'Mayéutica: su zona y su dock están a la vista');
await medir('Mayéutica · inicio', false); await foto('may-inicio');
await clic(`${Z} [data-ir="recorrido"]`); await espera(500);
for (let i = 0; i < PREG.length; i++) {
    const q = PREG[i];
    const num = await p.evaluate(Z => document.querySelector(Z + ' .shv-num')?.textContent, Z);
    ok(+num === i + 1, `pregunta ${q.id}: es la número ${i + 1} del recorrido (${num})`);
    const fallar = ['E2', 'E4', 'E5'].includes(q.id);
    await responder(q, { bien: !fallar, foto: q.id === 'G1' ? 'may-g1' : q.id === 'E2' ? 'may-e2-mal' : q.id === 'G6' ? 'may-g6' : null });
}
// el repaso: las 3 falladas, otra vez, y cada acierto la saca
ok(await p.evaluate(Z => document.querySelectorAll(Z + ' [data-rep]').length, Z) === 3, 'repaso: vuelven las 3 falladas (E2, E4, E5)');
await medir('repaso · lista', false); await foto('may-repaso');
for (const id of ['E2', 'E4', 'E5']) {
    await clic(`${Z} [data-rep="${id}"]`); await espera(300);
    await responder(PREG.find(x => x.id === id), { bien: true, repaso: true });
}
ok(await p.evaluate(Z => document.querySelectorAll(Z + ' [data-rep]').length, Z) === 0 && await p.evaluate(Z => /No queda nada por repasar/.test(document.querySelector(Z).innerText), Z), 'repaso: acertadas las tres, no queda nada');
await clic(`${Z} [data-ir="casos"]`); await espera(400);
await clic(`${Z} [data-caso="0"]`); await espera(700);
const pasosC = CASOS_D[0].pasos;
for (let k = 0; k < pasosC.length; k++) {
    const q = pasosC[k].pregunta;
    const ficha = await p.evaluate(Z => ({ filas: document.querySelectorAll(Z + ' dl.shv-paciente dd').length, nuevas: document.querySelectorAll(Z + ' dl.shv-paciente dd.shv-cambia').length }), Z);
    ok(ficha.filas >= 3 && ficha.nuevas >= 1, `caso paso ${k + 1}: la ficha del paciente tiene ${ficha.filas} filas, ${ficha.nuevas} nuevas`);
    await medir(`caso paso ${k + 1} · ficha`, false);
    await responder(q, { bien: k !== 2, foto: k === 0 ? 'may-caso-1' : k === 3 ? 'may-caso-4' : k === 6 ? 'may-caso-7' : null });
}
ok(await p.evaluate(Z => /lo que te llevas/i.test(document.querySelector(Z).innerText) && document.querySelectorAll(Z + ' ol.shv-lleva li').length === 3, Z), 'caso: «Lo que te llevas» con sus 3 ideas');
{ const c = await citasOk(); ok(c.n >= 4 && c.bad.length === 0, `caso: el final lleva ${c.n} citas y todas llegan ${c.bad.join(', ')}`); }
await medir('caso · final', false); await foto('may-caso-final');
await clic(`${Z} [data-fin="modelo"]`); await espera(900);
{ const r = await S(); ok(r.aparato === 'ecmo' && await p.evaluate(() => document.getElementById('shv-modo-explorar').getAttribute('aria-selected') === 'true'), 'caso: «Abrir el modelo con Aurelio en ECMO» abre Explorar con el ECMO'); }
await medir('Explorar tras el caso', false);
// la lámina «Así se ve de verdad»
await clic('#shv-real summary'); await espera(600);
ok(await p.evaluate(() => { const i = document.querySelector('#shv-real-fig img'); return i && i.naturalWidth > 0 && /Licencia/.test(document.getElementById('shv-real-fig').innerText) && /Autor/.test(document.getElementById('shv-real-fig').innerText); }), 'R4: la eco real carga (naturalWidth > 0) con autor, licencia y original en su pie'); await foto('real');
await medir('lámina real', false);
}
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
