// Prueba de la maqueta «iones vivos · B» (390 y 360): desborde, rótulos, cifras de cada mando, topes, apuesta/error/caso, consola.
// Uso: node iones-b.mjs [ancho]   (lanza su propio servidor en el puerto 8102 y lo cierra por su número de proceso)
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
const RAIZ = new URL('../../../../', import.meta.url).pathname, CAP = '/tmp/plan-socialista/b4/capturas-b3/';
const srv = spawn('python3', ['-m', 'http.server', '8102'], { cwd: RAIZ, stdio: 'ignore' }); const pid = srv.pid;
await new Promise((r) => setTimeout(r, 900));
const fallos = [], errores = []; const ok = (c, m) => { if (!c) fallos.push(m); };
const b = await chromium.launch(); let sale = 0;
try {
for (const ANCHO of (process.argv[2] ? [+process.argv[2]] : [390, 360])) {
  console.log(`\n===== ${ANCHO} px =====`);
  const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: ANCHO, height: 800 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  p.on('console', (m) => m.type() === 'error' && errores.push(m.text())); p.on('pageerror', (e) => errores.push('pageerror ' + e.message));
  await p.goto('http://127.0.0.1:8102/autonomo/maquetas/b4-iones-b.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(900);
  const I = (f, ...a) => p.evaluate(([f, a]) => { const r = new Function('I', 'a', 'return (' + f + ')(I,a)')(window.__iones, a); return r; }, [f.toString(), a]);
  const desb = async (t) => { const d = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `${ANCHO}: desborde ${d}px en ${t}`); };
  const L = () => p.evaluate(() => { const l = window.__iones.leer(); return Object.fromEntries(Object.entries(l).map(([k, v]) => [k, +v.toFixed(2)])); });
  const tp = () => p.evaluate(() => window.__iones.topes().map((t) => t.clave + ':' + t.nivel).sort().join(' '));
  const clic = (id, n = 1) => p.evaluate(([id, n]) => { for (let i = 0; i < n; i++) { const e = document.getElementById(id); if (e.disabled) return false; e.click(); } return true; }, [id, n]);
  const sel = (q) => p.evaluate((q) => document.querySelector(q).click(), q);
  const resetea = (c) => p.evaluate((c) => window.__iones.ponerPreset(c), c);
  const rotulos = async (t) => { const m = await p.evaluate(() => { const sv = document.getElementById('ion-svg'), esc = sv.getBoundingClientRect().width / 360; let min = 99; sv.querySelectorAll('text').forEach((x) => { const f = parseFloat(getComputedStyle(x).fontSize) * esc; if (f < min) min = f; }); let mh = 99; document.querySelectorAll('body *').forEach((x) => { if (!x.offsetParent || x.closest('svg') || !x.childNodes.length || ![...x.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return; const f = parseFloat(getComputedStyle(x).fontSize); if (f < mh) mh = f; }); return { svg: +min.toFixed(1), html: +mh.toFixed(1) }; }); ok(m.svg >= 8, `${ANCHO}: rótulo SVG ${m.svg}px en ${t}`); ok(m.html >= 8, `${ANCHO}: texto HTML ${m.html}px en ${t}`); return m; };
  await desb('inicio'); console.log('rótulos', JSON.stringify(await rotulos('inicio')));
  await p.screenshot({ path: `${CAP}01-inicio-${ANCHO}.png` });
  // ECG: es el del ritmo vivo y late
  const ec = await p.evaluate(() => { const t = window.__iones.ecg.traza(); return { vmax: +t.vmax.toFixed(2), n: t.d.length }; }); ok(ec.vmax > 0.3, 'ECG sin QRS'); console.log('ECG vmax', ec.vmax);
  // ---- mandos: mínimo / medio / máximo ----
  console.log('-- Realimentar (0..4 dosis): K, Mg, fosfato');
  await resetea('damian'); for (let i = 0; i <= 4; i++) { const l = await L(); console.log(` ins ${i}: K ${l.k} Mg ${l.mg} PO4 ${l.po4} topes[${await tp()}]`); if (i < 4) await clic('b-real'); }
  ok((await tp()).includes('po4:sello'), 'po4 <1 sin sello'); ok(!(await clic('b-real')), 'Realimentar sigue tocable con el sello de fosfato');
  console.log('-- Furosemida hasta el fondo'); await resetea('normal'); let n = 0; while (await clic('b-furo')) { n++; if (n > 60) break; } const lf = await L(); console.log(` ${n} dosis: K ${lf.k} Mg ${lf.mg} total ${lf.kTotal} topes[${await tp()}]`); ok((await tp()).includes('nofis:sello'), 'sin «combinación no fisiológica» en el déficit');
  console.log('-- ClK (10/20/40 × vía)'); await resetea('normal');
  for (const [r, v] of [[10, 'periferica'], [20, 'central'], [40, 'central'], [40, 'cava'], [20, 'cava']]) { await sel(`[data-rate="${r}"]`); await sel(`[data-via="${v}"]`); const t = await tp(); console.log(` ${r} mEq/h ${v}: topes[${t}]  botón ${(await p.evaluate(() => document.getElementById('b-clk').disabled)) ? 'apagado' : 'activo'}`); if (r === 40 && v === 'cava') { ok(t.includes('clk:sello'), 'cava+40 sin sello asistolia'); await p.screenshot({ path: `${CAP}03-tope-clk-${ANCHO}.png` }); } if (r === 20 && v === 'cava') ok(!t.includes('clk:sello'), '20 por cava no debería sellar'); }
  await sel('[data-rate="40"]'); await sel('[data-via="central"]'); n = 0; while (await clic('b-clk')) { if (++n > 20) break; } console.log(` 40 mEq/h × ${n} h: total ${(await L()).kTotal} K ${(await L()).k} topes[${await tp()}]`);
  console.log('-- MgSO4 (2/4/6 g, dos bolos sin esperar)'); await resetea('normal');
  for (const g of [2, 4, 6]) { await resetea('normal'); await sel(`[data-g="${g}"]`); await clic('b-mg'); console.log(` ${g} g: Mg suero ${(await L()).mg} total ${(await L()).mgTotal}`); }
  await clic('b-mg'); console.log(` 6 g ×2 sin esperar: Mg ${(await L()).mg} topes[${await tp()}]`); await clic('b-mg'); console.log(` 6 g ×3 sin esperar: Mg ${(await L()).mg} topes[${await tp()}]`); ok((await tp()).includes('mg:sello'), 'Mg>13 sin sello'); await p.screenshot({ path: `${CAP}04-tope-mg-${ANCHO}.png` });
  await clic('b-esp'); await clic('b-esp'); await clic('b-esp'); console.log(` tras 3×15 min: Mg ${(await L()).mg} topes[${await tp()}]`);
  console.log('-- Calcio IV (gluconato/cloruro × ampollas)'); await resetea('valentin');
  for (const [a, nn] of [['glu', 1], ['glu', 2], ['glu', 3], ['cl', 1]]) { await sel(`[data-amp="${a}"]`); await sel(`[data-n="${nn}"]`); console.log(` ${a} ×${nn}: ${await p.evaluate(() => window.__iones.e.caMg)} mg  topes[${await tp()}]`); }
  ok((await tp()).includes('caiv:sello'), 'cloruro 270 mg sin sello de bolo'); await sel('[data-amp="glu"]'); await sel('[data-n="2"]'); const ca0 = (await L()).caIon; await clic('b-ca'); console.log(` Valentín antes ${ca0} → después de 180 mg ${(await L()).caIon} mg/dL`);
  console.log('-- Hiperpotasemia (Adela): el calcio arregla el ECG, el K no cambia'); await resetea('adela'); const k1 = await I((I) => [I.leer().k, I.ecgK()]); await sel('[data-amp="glu"]'); await sel('[data-n="3"]'); await clic('b-esp'); await I((I) => I.set({ caIV: 0 })); await p.evaluate(() => { window.__iones.s.caIV = 90; window.__iones.pintar(); }); const k2 = await I((I) => [I.leer().k, I.ecgK()]); console.log(` sin calcio: K ${k1[0].toFixed(2)} ECG ${k1[1].toFixed(2)} · con calcio: K ${k2[0].toFixed(2)} ECG ${k2[1].toFixed(2)}`); ok(Math.abs(k1[0] - k2[0]) < 1e-6 && k2[1] < k1[1], 'el calcio debe bajar el K del ECG y no el del suero');
  console.log('-- Albúmina, pH, concentrados (mín/medio/máx)'); await resetea('normal');
  for (const [id, vals] of [['r-alb', [1, 2.5, 4.5]], ['r-ph', [7.2, 7.4, 7.6]], ['r-uni', [0, 8, 16]]]) for (const v of vals) { await resetea('normal'); await p.evaluate(([id, v]) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event('input')); }, [id, v]); const l = await L(); console.log(` ${id}=${v}: Ca total ${l.caTotal} iónico ${l.caIon} (${l.caIonMmol} mmol/L) K ${l.k} topes[${await tp()}]`); }
  ok((await tp()).includes('ca:sello'), 'Ca iónico <0,65 sin sello'); await p.screenshot({ path: `${CAP}05-tope-ca-${ANCHO}.png` });
  // ---- los cuatro iones: sin desborde y rótulos ----
  for (const i of ['k', 'mg', 'ca', 'p']) { await resetea('normal'); await p.evaluate((i) => window.__iones.ponerIon(i), i); await desb('ion ' + i); const r = await rotulos('ion ' + i); console.log(` ion ${i}: rótulos`, JSON.stringify(r)); if (i === 'k') await p.screenshot({ path: `${CAP}02-k-${ANCHO}.png`, fullPage: true }); }
  // ---- vuelta 2: K con concentrados, guía, citas, vitales, partículas ----
  console.log('-- Vuelta 2');
  await resetea('normal'); const kc = []; for (const u of [0, 8, 16]) { await p.evaluate((u) => window.__iones.set({ units: u }), u); kc.push((await L()).k); } console.log(` K con 0/8/16 concentrados: ${kc.join(' · ')}`); ok(kc[0] < kc[1] && kc[1] < kc[2], 'K no sube con los concentrados');
  await resetea('valentin'); const vv = await p.evaluate(() => [document.getElementById('mon-pa').textContent, document.getElementById('mon-fc').textContent]); console.log(` Valentín monitor PA ${vv[0]} FC ${vv[1]}`); ok(vv[0] === '98/60' && vv[1] === '110', 'Valentín sin 98/60 · 110');
  for (const c of ['damian', 'rufino', 'valentin', 'adela']) {
    await resetea(c); let pasos = 0, focos = [];
    for (let i = 0; i < 6; i++) {
      const g = await p.evaluate(() => ({ vis: !document.getElementById('guia').hidden, foco: document.querySelectorAll('#ion-svg .foco').length, citas: document.querySelectorAll('#guia .ver-ficha[data-resaltar^="#mr-"]').length, pdf: document.querySelectorAll('#guia .cita-pdf').length, haz: !!document.querySelector('#guia [data-g="haz"]'), t: document.querySelector('#guia h3')?.textContent }));
      if (!g.vis) break; pasos++; focos.push(g.foco); ok(g.foco > 0, `${c}: paso ${pasos} sin .foco`); ok(g.citas === 1 && g.pdf === 1, `${c}: paso ${pasos} sin su cita doble`);
      if (g.haz) { const k0 = (await L()); await sel('#guia [data-g="haz"]'); const k1 = await L(); ok(JSON.stringify(k0) !== JSON.stringify(k1), `${c}: «Hazlo» del paso ${pasos} no cambió nada`); }
      await sel('#guia [data-g="sig"]');
    }
    console.log(` guía ${c}: ${pasos} pasos, focos ${focos.join('/')}`); ok(pasos >= 3 && pasos <= 5, `${c}: guía de ${pasos} pasos`);
  }
  await resetea('damian'); await p.screenshot({ path: `${CAP}08-guia-damian-${ANCHO}.png`, fullPage: true });
  await resetea('adela'); await sel('#guia [data-g="sig"]'); await p.screenshot({ path: `${CAP}09-guia-adela-${ANCHO}.png`, fullPage: true });
  // Vuelta 3: calcio de la hiperK = 90 mg en la guía de Adela; el fosfato ENTRA en la célula; #guia bajo el dibujo
  await resetea('adela'); for (let i = 0; i < 3; i++) await sel('#guia [data-g="sig"]');
  const gt = await p.evaluate(() => document.getElementById('guia').textContent); ok(/90 mg/.test(gt) && !/180/.test(gt), 'guía de Adela: debe decir 90 mg y no 180'); console.log(' guía Adela paso 4: ' + (/90 mg/.test(gt) ? '90 mg ✔' : 'SIN 90 mg'));
  const bajo = await p.evaluate(() => { const s = document.getElementById('ion-svg').getBoundingClientRect(), g = document.getElementById('guia').getBoundingClientRect(); return { dy: Math.round(g.top - s.bottom) }; }); ok(bajo.dy >= 0 && bajo.dy < 40, `#guia no queda justo bajo el dibujo (${bajo.dy}px)`); console.log(' #guia bajo el dibujo: ' + bajo.dy + ' px');
  await resetea('damian'); await p.evaluate(() => { window.__iones.ponerIon('p'); }); const pf0 = await p.evaluate(() => document.querySelectorAll('#ion-svg circle, #ion-svg .p').length);
  await clic('b-real'); await p.waitForTimeout(400);
  const pf = await p.evaluate(() => ({ entra: document.querySelectorAll('#ion-svg .entra').length, n: document.querySelectorAll('#ion-svg circle, #ion-svg .p').length, t: document.getElementById('ion-svg').innerHTML.includes('Plasma (suero)') })); ok(pf.entra > 0 && pf.t, 'fosfato: no hay partículas que entren en la célula'); console.log(` fosfato: ${pf.entra} partículas entran (antes ${pf0} formas, ahora ${pf.n})`);
  await resetea('normal'); await p.evaluate(() => window.__iones.ponerIon('k')); const e0 = await p.evaluate(() => document.querySelectorAll('#ion-svg .entra').length); await clic('b-real'); await clic('b-real'); await p.waitForTimeout(500);
  const e1 = await p.evaluate(() => document.querySelectorAll('#ion-svg .entra').length); console.log(` partículas que entran (K): sin insulina ${e0}, con 2 dosis ${e1}`); ok(e0 === 0 && e1 >= 4 && e1 <= 6, 'partículas que entran (K) fuera de 4-6');
  await p.screenshot({ path: `${CAP}10-entran-k-${ANCHO}.png`, fullPage: true });
  await p.evaluate(() => window.__iones.ponerIon('p')); const e2 = await p.evaluate(() => document.querySelectorAll('#ion-svg .entra').length); console.log(` partículas que entran (fosfato): ${e2}`); ok(e2 >= 8 && e2 <= 12, 'partículas que entran (fosfato) fuera de 8-12 (depósito + figura)'); await p.screenshot({ path: `${CAP}11-entran-p-${ANCHO}.png`, fullPage: true });
  console.log('-- K alto: aviso ≥6 y sello ≥7; hipoK <1,5'); await resetea('adela'); console.log(` Adela K ${(await L()).k} topes[${await tp()}]`); await sel('[data-rate="40"]'); await clic('b-clk', 1);
  let kk = 0; while ((await L()).k < 7 && kk++ < 20) await clic('b-clk'); console.log(` tras ClK: K ${(await L()).k} topes[${await tp()}] PA ${await p.evaluate(() => document.getElementById('mon-pa').textContent)}`); ok((await tp()).includes('hiperk:sello'), 'K≥7 sin sello');
  await resetea('rufino'); await p.evaluate(() => window.__iones.set({ ph: 7.6, ins: 3, dK: -500 })); console.log(` Rufino extremo: K ${(await L()).k} PO4 ${(await L()).po4} topes[${await tp()}]`); ok((await tp()).includes('nofis:sello') && (await L()).k >= 0, 'K<1,5 sin sello no fisiológica');
  await resetea('normal'); await p.evaluate(() => window.__iones.set({ ins: 4, po4b: 1 })); ok((await L()).po4 >= 0, 'fosfato negativo');
  // citas: todas las del documento llevan su botón doble
  const cc = await p.evaluate(() => ({ cita: document.querySelectorAll('.cita').length, sinBoton: [...document.querySelectorAll('.cita')].filter((c) => !c.querySelector('.ver-ficha[data-resaltar]') || !c.querySelector('.cita-pdf')).length })); console.log(` citas a la vista: ${cc.cita}, sin doble botón: ${cc.sinBoton}`); ok(cc.sinBoton === 0, 'cita sin doble botón');
  // ---- apuesta, error, caso ----
  console.log('-- Apuesta'); await p.evaluate(() => window.__iones.modoPrueba('apuesta')); const kA = (await L()).k; const monK0 = await p.evaluate(() => document.getElementById('mon-k').textContent); const vent0 = await p.evaluate(() => document.getElementById('ion-svg').textContent.includes('?')); console.log(` antes de contestar: monitor «${monK0}», ventana con «?»=${vent0}`); ok(monK0.includes('?') && vent0, 'apuesta: K no oculto');
  const ops = await p.$$('#prueba .op'); ok(ops.length === 3, 'apuesta: 3 opciones'); ok(!(await p.evaluate(() => document.getElementById('prueba').innerHTML.includes('data-ok'))), 'respuesta en el HTML');
  const txt = await Promise.all(ops.map((o) => o.textContent())); const iok = txt.findIndex((t) => t.startsWith('Baja')); await ops[iok].click(); await p.waitForTimeout(200);
  console.log(` K antes ${kA} → después ${(await L()).k}; fosfato ${(await L()).po4}; fin=${await p.evaluate(() => document.getElementById('prueba').dataset.fin)}`); ok((await L()).k < kA, 'apuesta: el K no bajó'); console.log(' monitor tras contestar:', await p.evaluate(() => document.getElementById('mon-k').textContent), '· lleva-te:', await p.evaluate(() => document.querySelectorAll('#prueba .llevas li .ver-ficha').length)); ok(await p.evaluate(() => document.querySelectorAll('#prueba .llevas li').length >= 2), 'sin «Lo que te llevas»'); await desb('apuesta respondida'); await rotulos('apuesta');
  console.log('-- Error'); await p.evaluate(() => window.__iones.modoPrueba('error')); const ocu = await p.evaluate(() => document.getElementById('ion-svg').textContent.includes('iónico 4,6')); ok(!ocu, 'error: el iónico se ve antes de contestar');
  const grupos = await p.$$('#prueba .ops'); ok(grupos.length === 3, 'error: 3 frases'); for (let i = 0; i < 3; i++) { const bs = await grupos[i].$$('.op'); await bs[i < 2 ? 0 : 1].click(); }
  await p.waitForTimeout(150); console.log(` error resuelto: fin=${await p.evaluate(() => document.getElementById('prueba').dataset.fin)} iónico visible=${await p.evaluate(() => document.getElementById('ion-svg').textContent.includes('iónico'))}`); ok(await p.evaluate(() => !!document.getElementById('prueba').dataset.fin), 'error sin completar'); await desb('error'); await p.screenshot({ path: `${CAP}06-error-${ANCHO}.png`, fullPage: true });
  console.log('-- Caso (Valentín, 3 pasos)'); await p.evaluate(() => window.__iones.modoPrueba('caso'));
  const bien = [/^Pido/, /^22 mL/, /^Sigo/];
  for (let i = 0; i < 3; i++) { const o = await p.$$(`#prueba .paso:nth-of-type(${i + 1}) .op`); ok(o.length === 3, `caso paso ${i + 1}: opciones`); const tt = await Promise.all(o.map((x) => x.textContent())); await o[tt.findIndex((t) => bien[i].test(t))].click(); await p.waitForTimeout(120); const l = await L(); console.log(` paso ${i + 1}: Ca iónico ${l.caIon} (${l.caIonMmol} mmol/L) K ${l.k} Ca total ${l.caTotal} topes[${await tp()}]`); await desb('caso ' + (i + 1)); if (i < 2) await p.evaluate(() => [...document.querySelectorAll('#prueba .b.prim')].at(-1).click()); }
  ok(await p.evaluate(() => !!document.getElementById('prueba').dataset.fin), 'caso sin completar'); await p.screenshot({ path: `${CAP}07-caso-${ANCHO}.png`, fullPage: true });
  // ---- la frase y el dock no tapan la escena al tocar un mando ----
  await resetea('normal'); await p.evaluate(() => scrollTo(0, 0)); await clic('b-furo'); await p.waitForTimeout(300);
  const vis = await p.evaluate(() => { const f = document.getElementById('frase').getBoundingClientRect(), d = document.getElementById('dock').getBoundingClientRect(); return { fraseBajoDock: f.bottom > d.top + 1, dock: Math.round(d.height), vh: innerHeight }; }); console.log(' dock', vis.dock, 'de', vis.vh, 'px'); ok(vis.dock < vis.vh * 0.5, 'dock tapa media pantalla'); ok(!vis.fraseBajoDock, 'frase bajo el dock');
  await ctx.close();
}
} catch (e) { fallos.push('excepción: ' + e.message); } finally { await b.close(); try { process.kill(pid); } catch {} }
console.log('\nErrores de consola:', errores.length ? errores.slice(0, 5) : 'ninguno');
console.log(fallos.length ? 'FALLOS:\n- ' + fallos.join('\n- ') : 'TODO EN VERDE');
