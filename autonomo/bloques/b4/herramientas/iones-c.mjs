// Programa de prueba de la maqueta «iones vivos · C · A pie de cama» (390 y 360 px). Servidor: python3 -m http.server 8103 en la raíz del repo.
// Uso: node iones-c.mjs [ancho]  → texto: desborde, rótulos <8 px, cifras de cada mando (mín/medio/máx), topes, apuesta, error, caso, consola.
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const ANCHO = +(process.argv[2] || 390), ALTO = ANCHO === 390 ? 844 : 780;
const BASE = `http://127.0.0.1:${process.env.PUERTO || 8103}/autonomo/maquetas/b4-iones-c.html`, CAP = '/tmp/plan-socialista/b4/capturas-c/';
const fallos = [], errores = []; const ok = (c, m) => { if (!c) fallos.push(m); };
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 12'], viewport: { width: ANCHO, height: ALTO }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const page = await ctx.newPage(); page.setDefaultTimeout(4000);
page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); }); page.on('pageerror', e => errores.push('pageerror: ' + e.message));
const E = (f, a) => page.evaluate(f, a);
const desb = async t => { const d = await E(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `desborde ${d} px en ${t}`); };
const cap = n => page.screenshot({ path: `${CAP}${n}-${ANCHO}.png` });
const tap = async sel => { const el = page.locator(sel).first(); await el.scrollIntoViewIfNeeded(); ok(!(await el.isDisabled()), `mando apagado/no tocable: ${sel}`); await el.tap(); await page.waitForTimeout(60); };
const L = () => E(() => { const l = window.__iones.lect(); return { k: +l.k.toFixed(2), mg: +l.mg.toFixed(2), ca: +l.ca.toFixed(2), po4: +l.po4.toFixed(2), tot: +l.fr.total.toFixed(1), pas: l.pa.pas }; });
const fm = o => `K ${o.k} Mg ${o.mg} Ca ${o.ca} P ${o.po4} Catot ${o.tot} PAS ${o.pas}`;
const sello = async k => E(k => !!document.querySelector(`.tope-sello[data-tope="${k}"]`), k);
const aviso = async k => E(k => !!document.querySelector(`.tope-aviso[data-tope="${k}"]`), k);
const cargar = async (id, extra = '') => { await E(([id]) => window.__iones.cargar(id), [id]); };

await page.goto(BASE, { waitUntil: 'networkidle' }); await page.waitForTimeout(900);
await desb('inicio'); await cap('01-primera');
// --- rótulos en pantalla: SVG (tamaño × escala) y HTML
const chicos = async t => { const r = await E(() => { const out = []; for (const x of document.querySelectorAll('svg text')) { if (!x.offsetParent && !x.getClientRects().length) continue; const fs = parseFloat(getComputedStyle(x).fontSize) || parseFloat(x.getAttribute('font-size')) || 0; const m = x.getScreenCTM(); const sc = m ? Math.hypot(m.a, m.b) : 1; if (fs * sc < 7.99 && x.textContent.trim()) out.push(`${x.textContent.trim().slice(0, 28)} (${(fs * sc).toFixed(1)}px)`); } for (const el of document.querySelectorAll('body *')) { if (!el.offsetParent || el.closest('svg')) continue; const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()); if (own && parseFloat(getComputedStyle(el).fontSize) < 8) out.push(`HTML ${el.textContent.trim().slice(0, 28)}`); } return out; }); ok(!r.length, `rótulos <8 px en ${t}: ${r.slice(0, 5).join(' | ')}`); };
await chicos('inicio');
await tap('#lupa-btn'); await page.waitForTimeout(200); await desb('lupa'); await chicos('lupa'); await cap('02-lupa'); await tap('#lupa-btn');
// --- cifras de cada mando: mínimo, medio y máximo, en los cuatro pacientes
console.log('== CIFRAS POR MANDO (mín / medio / máx) ==');
for (const id of ['damian', 'rufino', 'valentin', 'adela']) {
  for (const [nom, vals, f] of [
    ['albúmina', [1, 2.75, 4.5], v => { window.__iones.s.alb = v; window.__iones.repintar(); }],
    ['pH', [7.1, 7.35, 7.6], v => { window.__iones.s.ph = v; window.__iones.repintar(); }],
    ['ClK mEq/h (periférica, 8 h)', [10, 20, 40], v => { const I = window.__iones; I.acc.clkVia('periferica'); I.acc.clkTasa(v); I.acc.clk(); I.avanzar(480); }],
    ['MgSO4 g (bolo+15 min)', [2, 6, 12], v => { const I = window.__iones; I.acc.mg(v); I.avanzar(15); }],
    ['concentrados', [0, 5, 10], v => { const I = window.__iones; I.acc.tr(v); I.repintar(); }],
    ['nutrición 12 h', [0, 1, 1], v => { const I = window.__iones; if (v) I.acc.realimentar(); I.avanzar(v ? 720 : 0); }],
    ['furosemida ×0/1/3', [0, 1, 3], v => { const I = window.__iones; for (let i = 0; i < v; i++) I.acc.furo(); I.repintar(); }],
    ['calcio bolos gluconato', [0, 1, 2], v => { const I = window.__iones; for (let i = 0; i < v; i++) I.acc.glu(); I.repintar(); }],
  ]) {
    const fila = [];
    for (const v of vals) { await cargar(id); await E(([f, v]) => new Function('v', 'return (' + f + ')(v)')(v), [f.toString(), v]); const o = await L(); fila.push(fm(o));
      ok(o.k > 1.5 && o.k < 9.5 && o.mg > 0 && o.mg < 30 && o.ca >= 0.3 && o.ca < 3 && o.po4 >= 0.3 && o.po4 < 12, `${id} ${nom}=${v}: cifra imposible ${fm(o)}`); }
    console.log(`${id} · ${nom}\n   ` + fila.join('\n   '));
  }
}
await cargar('damian');
// --- topes: cada uno dispara su sello (o aviso), apaga su mando y deja constantes de paciente
console.log('== TOPES ==');
async function caso(clave, prep, esperaSello, botonApagado, extra) {
  await cargar(clave.pac); await E(prep); await page.waitForTimeout(150);
  const s = esperaSello ? await sello(clave.k) : await aviso(clave.k);
  ok(s, `tope ${clave.k}: no sale su ${esperaSello ? 'sello' : 'aviso'}`);
  if (botonApagado) ok(await E(sel => !!document.querySelector(sel)?.disabled, botonApagado), `tope ${clave.k}: ${botonApagado} no se apagó`);
  console.log(`${clave.k}: ${s ? 'SELLO' : 'sin'} ${await E(() => window.__iones.tope.activos().map(a => a.clave + ':' + a.nivel).join(','))} | ${fm(await L())}${extra ? ' | ' + (await E(extra)) : ''}`);
}
await caso({ k: 'clk', pac: 'rufino' }, () => { const I = window.__iones; I.acc.clkVia('cava'); I.acc.clkTasa(40); I.acc.clk(); I.repintar(); }, true, '#b-clk-ini', () => `ECG plano: ${document.getElementById('ec-plano').textContent}`);
await cap('03-tope-asistolia');
await caso({ k: 'clkAviso', pac: 'rufino' }, () => { const I = window.__iones; I.acc.clkVia('cava'); I.acc.clkTasa(20); I.acc.clk(); I.repintar(); }, false);
await caso({ k: 'mg', pac: 'valentin' }, () => { const I = window.__iones; for (let i = 0; i < 12; i++) I.acc.mg(2); I.avanzar(5); }, true, '#b-mg-2', () => `ECG: ${document.getElementById('ec-plano').textContent}`);
await caso({ k: 'mgAviso', pac: 'valentin' }, () => { const I = window.__iones; for (let i = 0; i < 4; i++) I.acc.mg(2); I.avanzar(5); }, false);
await caso({ k: 'ca', pac: 'valentin' }, () => { const I = window.__iones; I.acc.tr(15); I.repintar(); }, true, '#b-tr1');
await cap('04-tope-calcio');
await caso({ k: 'caAviso', pac: 'valentin' }, () => { const I = window.__iones; I.acc.tr(10); I.repintar(); }, false);
await caso({ k: 'po4', pac: 'damian' }, () => { const I = window.__iones; I.acc.realimentar(); I.avanzar(720); }, true, '#b-real');
await caso({ k: 'caiv', pac: 'adela' }, () => { const I = window.__iones; I.acc.cl(); I.repintar(); }, true, '#b-ca-glu');
await caso({ k: 'caivInf', pac: 'valentin' }, () => { const I = window.__iones; I.acc.caTasa(4); I.acc.caIni(); I.repintar(); }, true, '#b-ca-ini');
await caso({ k: 'comb', pac: 'adela' }, () => { const I = window.__iones; I.acc.clkVia('periferica'); I.acc.clkTasa(40); I.acc.clk(); I.avanzar(600); }, true, '#b-clk-ini');
// el sello se quita al corregir el mando
await cargar('rufino'); await E(() => { const I = window.__iones; I.acc.clkVia('cava'); I.acc.clkTasa(40); I.acc.clk(); I.repintar(); });
await E(() => { const I = window.__iones; I.acc.clkTasa(20); I.repintar(); }); ok(!(await sello('clk')), 'el sello clk no se quita al bajar el ritmo'); ok(!(await E(() => document.getElementById('b-clk-ini').disabled)), 'ClK sigue apagado tras corregir');
// con toques de verdad: el monitor y el sello siguen a la vista y la frase no queda bajo el dock
await cargar('rufino'); await tap('[data-clk-via="cava"]'); await tap('[data-clk-tasa="40"]'); await tap('#b-clk-ini'); await page.waitForTimeout(250);
const vis = await E(() => { const q = s => document.querySelector(s)?.getBoundingClientRect(), m = q('#mon'), se = q('.tope-sello[data-tope="clk"]'), d = q('#dock'), f = q('#frase'); return { monTop: Math.round(m.top), monBot: Math.round(m.bottom), sello: se ? [Math.round(se.top), Math.round(se.bottom)] : null, dockTop: Math.round(d.top), fraseBot: Math.round(f.bottom), alto: innerHeight, selloTxt: document.querySelector('.tope-sello[data-tope="clk"]')?.textContent.slice(0, 90) }; });
console.log('visibilidad tras tocar ClK 40 por cava:', JSON.stringify(vis));
ok(vis.monTop >= -1 && vis.monBot < vis.dockTop, 'el monitor no queda a la vista al tocar un mando'); ok(vis.sello && vis.sello[0] >= vis.monTop - 1 && vis.sello[1] <= vis.monBot + 1, 'el sello no cabe dentro del monitor a la vista'); ok(vis.fraseBot <= vis.alto, 'frase fuera de pantalla'); await cap('03b-tope-con-toque');
// ECG: K alto cambia el trazo; K bajo rotula pendiente
await cargar('adela'); const dAdela = await E(() => document.getElementById('ec-traza').getAttribute('d').length); await cargar('rufino'); await page.waitForTimeout(200);
ok(await E(() => document.getElementById('ec-pend').textContent.includes('pendiente')), 'K bajo: falta el rótulo «pendiente»');
// calcio en la hiperK: el ECG mejora, el K⁺ sérico no cambia
await cargar('adela'); const k0 = (await L()).k, ke0 = await E(() => window.__iones.M.kEficaz(window.__iones.s)); await E(() => { window.__iones.acc.glu(); window.__iones.repintar(); }); const k1 = (await L()).k, ke1 = await E(() => window.__iones.M.kEficaz(window.__iones.s));
console.log(`calcio en hiperK (Adela): K sérico ${k0} → ${k1}; K que lee el ECG ${ke0.toFixed(2)} → ${ke1.toFixed(2)}`); ok(k1 === k0 && ke1 < ke0 - 0.3, 'calcio en hiperK: el K sérico cambió o el ECG no mejora');
await cargar('adela'); await cap('05-adela-hiperk');
// --- apuesta
console.log('== APUESTA ==');
await cargar('damian'); await tap('[data-est="apuesta"]'); const cero = await E(() => document.getElementById('g-k').textContent);
ok(cero.includes('?'), 'apuesta: el K⁺ se enseña antes de contestar'); ok(!(await E(() => document.body.innerText.includes('Acertaste'))), 'apuesta: la respuesta está escrita antes de contestar');
await tap('#ap-ops [data-op="1"]'); await tap('#b-real'); await tap('#r-t360'); await page.waitForTimeout(100);
const ap = await E(() => document.getElementById('ap-res').textContent); console.log(ap); ok(ap.includes('Acertaste'), 'apuesta: no se completa'); ok(!(await E(() => document.getElementById('g-k').textContent.includes('?'))), 'apuesta: el K⁺ sigue oculto'); await desb('apuesta'); await cap('06-apuesta');
// --- error
console.log('== ERROR ==');
await tap('[data-est="error"]'); await tap('[data-er="0"]'); await tap('[data-er="2"]'); await tap('#er-ok'); const er = await E(() => document.getElementById('er-res').textContent); ok(er.includes('3 de 3'), 'error: no da 3 de 3'); console.log(er.slice(-30));
await tap('[data-prueba="alb"]'); console.log('prueba albúmina 2:', fm(await L())); await tap('#lupa-btn'); await page.waitForTimeout(150); await desb('error'); await cap('07-error-lupa'); await tap('#lupa-btn');
// --- caso
console.log('== CASO DAMIÁN ==');
await tap('[data-est="caso"]');
const paso = async (op, acciones) => { await tap(`#cs-ops [data-op="${op}"]`); for (const a of acciones) await tap(a); await page.waitForTimeout(80); const vis = await E(() => !document.getElementById('cs-sig').hidden); return vis; };
console.log('paso1:', (await E(() => document.querySelector('#est-cuerpo p:nth-of-type(2)').textContent)).slice(0, 140));
ok(await paso(1, ['#b-real', '#r-t360', '#r-t360', '#r-t360', '#r-t360']), 'caso: paso 1 no se completa'); console.log('  →', fm(await L())); await tap('#cs-sig');
ok(await paso(1, ['#b-po4']), 'caso: paso 2'); await tap('#cs-sig');
ok(await paso(1, ['#b-mg-6', '#r-t60', '#r-t60', '#r-t60', '#r-t60']), 'caso: paso 3'); console.log('  →', fm(await L())); await tap('#cs-sig');
ok(await paso(1, ['#r-t360', '#r-t360']), 'caso: paso 4'); console.log('  →', fm(await L())); await tap('#cs-sig');
ok(await E(() => document.getElementById('cs-fin').textContent.includes('Caso terminado')), 'caso: no termina'); await desb('caso'); await cap('08-caso-final');
// --- botones estables y desborde final
await cargar('damian'); await E(() => { for (const b of document.querySelectorAll('#bombas button')) b.dataset.marca = '1'; }); await tap('#b-ins'); await tap('#b-real'); await tap('[data-clk-tasa="40"]'); await tap('#r-t15'); await tap('#r-t60');
const rehechos = await E(() => [...document.querySelectorAll('#bombas button')].filter(b => !b.dataset.marca).length); ok(rehechos === 0, `botones: ${rehechos} se rehicieron (mando no tocable)`);
await desb('final');
console.log(`== RESUMEN ${ANCHO}px == consola: ${errores.length ? errores.join(' || ') : 'sin errores'}`); ok(!errores.length, 'errores de consola');
console.log(fallos.length ? 'FALLOS:\n - ' + fallos.join('\n - ') : 'TODO EN VERDE');
await browser.close(); process.exit(fallos.length ? 1 : 0);
