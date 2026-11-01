// Prueba de navegador de los iones vivos (juez de autonomo/jueces.mjs --modelo iones-vivos). Sale de la de la maqueta (iones-b.mjs):
// las cifras de mín/medio/máx son las mismas. A 390 y 360 px: desborde tras cada mando y paso de guía, rótulos, topes con su sello,
// apuesta/error/caso, los 4 pendientes del rejuicio, el ECG plano con parada, los 8 botones de las fichas y la consola limpia.
// Uso: node autonomo/pruebas/iones-vivos.mjs <url-base> [--capturas <carpeta>]
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const args = process.argv.slice(2);
const BASE = (args.find(a => /^https?:/.test(a)) || 'http://localhost:8000/').replace(/\/?$/, '/');
const CAP = args.includes('--capturas') ? args[args.indexOf('--capturas') + 1].replace(/\/?$/, '/') : null;
const fallos = [], errores = []; const pid = 0;
const ok = (c, m) => { if (!c) fallos.push(m); };
const b = await chromium.launch(); let sale = 0;
try {
for (const ANCHO of (args.find(a => /^\d+$/.test(a)) ? [+args.find(a => /^\d+$/.test(a))] : [390, 360])) {
  console.log(`\n===== ${ANCHO} px =====`);
  const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: ANCHO, height: 800 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  p.on('console', (m) => m.type() === 'error' && errores.push(m.text())); p.on('pageerror', (e) => errores.push('pageerror ' + e.message));
  await p.goto(BASE + 'index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200); await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'ionesVivos', ionesVivos: '' }); document.body.append(t); t.click(); t.remove(); }); await p.waitForFunction(() => window.__iones, null, { timeout: 8000 }); await p.waitForTimeout(600);
  const I = (f, ...a) => p.evaluate(([f, a]) => { const r = new Function('I', 'a', 'return (' + f + ')(I,a)')(window.__iones, a); return r; }, [f.toString(), a]);
  const desb = async (t) => { const d = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `${ANCHO}: desborde ${d}px en ${t}`); };
  const L = () => p.evaluate(() => { const l = window.__iones.leer(); return Object.fromEntries(Object.entries(l).map(([k, v]) => [k, typeof v === 'number' ? +v.toFixed(2) : v])); });
  const tp = () => p.evaluate(() => window.__iones.topes().map((t) => t.clave + ':' + t.nivel).sort().join(' '));
  const clic = (id, n = 1) => p.evaluate(([id, n]) => { for (let i = 0; i < n; i++) { const e = document.getElementById(id); if (e.disabled) return false; e.click(); } return true; }, [id, n]);
  const sel = (q) => p.evaluate((q) => document.querySelector(q).click(), q);
  const resetea = (c) => p.evaluate((c) => window.__iones.ponerPreset(c), c);
  const rotulos = async (t) => { const m = await p.evaluate(() => { const sv = document.getElementById('iov-ion-svg'), esc = sv.getBoundingClientRect().width / 360; let min = 99; sv.querySelectorAll('text').forEach((x) => { const f = parseFloat(getComputedStyle(x).fontSize) * esc; if (f < min) min = f; }); let mh = 99; document.querySelectorAll('body *').forEach((x) => { if (!x.offsetParent || x.closest('svg') || !x.childNodes.length || ![...x.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return; const f = parseFloat(getComputedStyle(x).fontSize); if (f < mh) mh = f; }); return { svg: +min.toFixed(1), html: +mh.toFixed(1) }; }); ok(m.svg >= 8, `${ANCHO}: rótulo SVG ${m.svg}px en ${t}`); ok(m.html >= 8, `${ANCHO}: texto HTML ${m.html}px en ${t}`); return m; };
  await desb('inicio'); console.log('rótulos', JSON.stringify(await rotulos('inicio')));
  CAP && await p.screenshot({ path: `${CAP}01-inicio-${ANCHO}.png` });
  // ECG: es el del ritmo vivo y late
  const ec = await p.evaluate(() => { const t = window.__iones.ecg.traza(); return { vmax: +t.vmax.toFixed(2), n: t.d.length }; }); ok(ec.vmax > 0.3, 'ECG sin QRS'); console.log('ECG vmax', ec.vmax);
  // ---- mandos: mínimo / medio / máximo ----
  console.log('-- Realimentar (0..4 dosis): K, Mg, fosfato');
  await resetea('damian'); for (let i = 0; i <= 4; i++) { const l = await L(); console.log(` ins ${i}: K ${l.k} Mg ${l.mg} PO4 ${l.po4} topes[${await tp()}]`); if (i < 4) await clic('iov-b-real'); }
  ok((await tp()).includes('po4:sello') && await p.evaluate(() => document.getElementById('iov-b-real').disabled), 'con el sello de fosfato <1, Realimentar debe quedar apagado');
  await resetea('damian'); await clic('iov-b-real'); const l1 = await L(); ok(Math.abs(l1.po4 - 0.9) < 0.05 && (await tp()).includes('po4:sello') && !(await tp()).includes('nofis'), `1 dosis: fosfato ${l1.po4} (debe ser 0,9, sello grave, sin no fisiológica)`);
  await p.evaluate(() => window.__iones.set({ ins: 2 })); const l2 = await L(); console.log(` 2 dosis (por la guía o a mano): fosfato ${l2.po4} topes[${await tp()}]`); ok((await tp()).includes('nofis:sello') && l2.po4 >= 0.3, 'fosfato <0,3: sin sello «no fisiológica» o se enseña 0');
  console.log('-- Furosemida hasta el fondo'); await resetea('normal'); let n = 0; while (await clic('iov-b-furo')) { n++; if (n > 60) break; } const lf = await L(); console.log(` ${n} dosis: K ${lf.k} Mg ${lf.mg} total ${lf.kTotal} topes[${await tp()}]`); ok((await tp()).includes('nofis:sello'), 'sin «combinación no fisiológica» en el déficit');
  console.log('-- ClK (10/20/40 × vía)'); await resetea('normal');
  for (const [r, v] of [[10, 'periferica'], [20, 'central'], [40, 'central'], [40, 'cava'], [20, 'cava']]) { await sel(`[data-rate="${r}"]`); await sel(`[data-via="${v}"]`); const t = await tp(); console.log(` ${r} mEq/h ${v}: topes[${t}]  botón ${(await p.evaluate(() => document.getElementById('iov-b-clk').disabled)) ? 'apagado' : 'activo'}`); if (r === 40 && v === 'cava') { ok(t.includes('clk:sello'), 'cava+40 sin sello asistolia'); CAP && await p.screenshot({ path: `${CAP}03-tope-clk-${ANCHO}.png` }); } if (r === 20 && v === 'cava') ok(!t.includes('clk:sello'), '20 por cava no debería sellar'); }
  await sel('[data-rate="40"]'); await sel('[data-via="central"]'); n = 0; while (await clic('iov-b-clk')) { if (++n > 20) break; } console.log(` 40 mEq/h × ${n} h: total ${(await L()).kTotal} K ${(await L()).k} topes[${await tp()}]`);
  console.log('-- MgSO4 (2/4/6 g, dos bolos sin esperar)'); await resetea('normal');
  for (const g of [2, 4, 6]) { await resetea('normal'); await sel(`[data-gmg="${g}"]`); await clic('iov-b-mg'); console.log(` ${g} g: Mg suero ${(await L()).mg} total ${(await L()).mgTotal}`); }
  await clic('iov-b-mg'); console.log(` 6 g ×2 sin esperar: Mg ${(await L()).mg} topes[${await tp()}]`); await clic('iov-b-mg'); console.log(` 6 g ×3 sin esperar: Mg ${(await L()).mg} topes[${await tp()}]`); ok((await tp()).includes('mg:sello'), 'Mg>13 sin sello'); CAP && await p.screenshot({ path: `${CAP}04-tope-mg-${ANCHO}.png` });
  await clic('iov-b-esp'); await clic('iov-b-esp'); await clic('iov-b-esp'); console.log(` tras 3×15 min: Mg ${(await L()).mg} topes[${await tp()}]`);
  console.log('-- Calcio IV (gluconato/cloruro × ampollas)'); await resetea('valentin');
  for (const [a, nn] of [['glu', 1], ['glu', 2], ['glu', 3], ['cl', 1]]) { await sel(`[data-amp="${a}"]`); await sel(`[data-n="${nn}"]`); console.log(` ${a} ×${nn}: ${await p.evaluate(() => window.__iones.e.caMg)} mg  topes[${await tp()}]`); }
  ok((await tp()).includes('caiv:sello'), 'cloruro 270 mg sin sello de bolo'); await sel('[data-amp="glu"]'); await sel('[data-n="2"]'); const ca0 = (await L()).caIon; await clic('iov-b-ca'); console.log(` Valentín antes ${ca0} → después de 180 mg ${(await L()).caIon} mg/dL`);
  console.log('-- Hiperpotasemia (Adela): el calcio arregla el ECG, el K no cambia'); await resetea('adela'); const k1 = await I((I) => [I.leer().k, I.ecgK()]); await sel('[data-amp="glu"]'); await sel('[data-n="3"]'); await clic('iov-b-esp'); await I((I) => I.set({ caIV: 0 })); await p.evaluate(() => { window.__iones.s.caIV = 90; window.__iones.pintar(); }); const k2 = await I((I) => [I.leer().k, I.ecgK()]); console.log(` sin calcio: K ${k1[0].toFixed(2)} ECG ${k1[1].toFixed(2)} · con calcio: K ${k2[0].toFixed(2)} ECG ${k2[1].toFixed(2)}`); ok(Math.abs(k1[0] - k2[0]) < 1e-6 && k2[1] < k1[1], 'el calcio debe bajar el K del ECG y no el del suero');
  console.log('-- Albúmina, pH, concentrados (mín/medio/máx)'); await resetea('normal');
  for (const [id, vals] of [['iov-r-alb', [1, 2.5, 4.5]], ['iov-r-ph', [7.2, 7.4, 7.6]], ['iov-r-uni', [0, 8, 16]]]) for (const v of vals) { await resetea('normal'); await p.evaluate(([id, v]) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event('input')); }, [id, v]); const l = await L(); console.log(` ${id}=${v}: Ca total ${l.caTotal} iónico ${l.caIon} (${l.caIonMmol} mmol/L) K ${l.k} topes[${await tp()}]`); }
  ok((await tp()).includes('ca:sello'), 'Ca iónico <0,65 sin sello'); CAP && await p.screenshot({ path: `${CAP}05-tope-ca-${ANCHO}.png` });
  // ---- los cuatro iones: sin desborde y rótulos ----
  for (const i of ['k', 'mg', 'ca', 'p']) { await resetea('normal'); await p.evaluate((i) => window.__iones.ponerIon(i), i); await desb('ion ' + i); const r = await rotulos('ion ' + i); console.log(` ion ${i}: rótulos`, JSON.stringify(r)); if (i === 'k') CAP && await p.screenshot({ path: `${CAP}02-k-${ANCHO}.png`, fullPage: true }); }
  // ---- vuelta 2: K con concentrados, guía, citas, vitales, partículas ----
  console.log('-- Vuelta 2');
  await resetea('normal'); const kc = []; for (const u of [0, 8, 16]) { await p.evaluate((u) => window.__iones.set({ units: u }), u); kc.push((await L()).k); } console.log(` K con 0/8/16 concentrados: ${kc.join(' · ')}`); ok(kc[0] < kc[1] && kc[1] < kc[2], 'K no sube con los concentrados');
  await resetea('valentin'); const vv = await p.evaluate(() => [document.getElementById('iov-mon-pa').textContent, document.getElementById('iov-mon-fc').textContent]); console.log(` Valentín monitor PA ${vv[0]} FC ${vv[1]}`); ok(vv[0] === '98/60' && vv[1] === '110', 'Valentín sin 98/60 · 110');
  for (const c of ['damian', 'rufino', 'valentin', 'adela']) {
    await resetea(c); let pasos = 0, focos = [];
    for (let i = 0; i < 6; i++) {
      const g = await p.evaluate(() => ({ vis: !document.getElementById('iov-guia').hidden, foco: document.querySelectorAll('#iov-ion-svg .foco').length, citas: document.querySelectorAll('#iov-guia .ver-ficha[data-resaltar^="#mr-"]').length, pdf: document.querySelectorAll('#iov-guia .cita-pdf').length, haz: !!document.querySelector('#iov-guia [data-paso="haz"]'), t: document.querySelector('#iov-guia h3')?.textContent }));
      if (!g.vis) break; pasos++; focos.push(g.foco); ok(g.foco > 0, `${c}: paso ${pasos} sin .foco`); ok(g.citas === 1 && g.pdf === 1, `${c}: paso ${pasos} sin su cita doble`);
      if (g.haz) { const k0 = (await L()); await sel('#iov-guia [data-paso="haz"]'); const k1 = await L(); ok(JSON.stringify(k0) !== JSON.stringify(k1), `${c}: «Hazlo» del paso ${pasos} no cambió nada`); }
      await sel('#iov-guia [data-paso="sig"]');
    }
    console.log(` guía ${c}: ${pasos} pasos, focos ${focos.join('/')}`); ok(pasos >= 3 && pasos <= 5, `${c}: guía de ${pasos} pasos`);
  }
  await resetea('damian'); CAP && await p.screenshot({ path: `${CAP}08-guia-damian-${ANCHO}.png`, fullPage: true });
  await resetea('adela'); await sel('#iov-guia [data-paso="sig"]'); CAP && await p.screenshot({ path: `${CAP}09-guia-adela-${ANCHO}.png`, fullPage: true });
  // Vuelta 3: calcio de la hiperK = 90 mg en la guía de Adela; el fosfato ENTRA en la célula; #iov-guia bajo el dibujo
  await resetea('adela'); for (let i = 0; i < 3; i++) await sel('#iov-guia [data-paso="sig"]');
  const gt = await p.evaluate(() => document.getElementById('iov-guia').textContent); ok(/90 mg/.test(gt) && !/180/.test(gt), 'guía de Adela: debe decir 90 mg y no 180'); console.log(' guía Adela paso 4: ' + (/90 mg/.test(gt) ? '90 mg ✔' : 'SIN 90 mg'));
  const bajo = await p.evaluate(() => { const s = document.getElementById('iov-ion-svg').getBoundingClientRect(), g = document.getElementById('iov-guia').getBoundingClientRect(); return { dy: Math.round(g.top - s.bottom) }; }); ok(bajo.dy >= 0 && bajo.dy < 40, `#iov-guia no queda justo bajo el dibujo (${bajo.dy}px)`); console.log(' #iov-guia bajo el dibujo: ' + bajo.dy + ' px');
  await resetea('damian'); await p.evaluate(() => { window.__iones.ponerIon('p'); }); const pf0 = await p.evaluate(() => document.querySelectorAll('#iov-ion-svg circle, #iov-ion-svg .p').length);
  await clic('iov-b-real'); await p.waitForTimeout(400);
  const pf = await p.evaluate(() => ({ entra: document.querySelectorAll('#iov-ion-svg .entra').length, n: document.querySelectorAll('#iov-ion-svg circle, #iov-ion-svg .p').length, t: document.getElementById('iov-ion-svg').innerHTML.includes('Plasma (suero)') })); ok(pf.entra > 0 && pf.t, 'fosfato: no hay partículas que entren en la célula'); console.log(` fosfato: ${pf.entra} partículas entran (antes ${pf0} formas, ahora ${pf.n})`);
  await resetea('normal'); await p.evaluate(() => window.__iones.ponerIon('k')); const e0 = await p.evaluate(() => document.querySelectorAll('#iov-ion-svg .entra').length); await clic('iov-b-real'); await clic('iov-b-real'); await p.waitForTimeout(500);
  const e1 = await p.evaluate(() => document.querySelectorAll('#iov-ion-svg .entra').length); console.log(` partículas que entran (K): sin insulina ${e0}, con 2 dosis ${e1}`); ok(e0 === 0 && e1 >= 4 && e1 <= 6, 'partículas que entran (K) fuera de 4-6');
  CAP && await p.screenshot({ path: `${CAP}10-entran-k-${ANCHO}.png`, fullPage: true });
  await p.evaluate(() => window.__iones.ponerIon('p')); const e2 = await p.evaluate(() => document.querySelectorAll('#iov-ion-svg .entra').length); console.log(` partículas que entran (fosfato): ${e2}`); ok(e2 >= 8 && e2 <= 12, 'partículas que entran (fosfato) fuera de 8-12 (depósito + figura)'); CAP && await p.screenshot({ path: `${CAP}11-entran-p-${ANCHO}.png`, fullPage: true });
  console.log('-- K alto: aviso ≥6 y sello ≥7; hipoK <1,5'); await resetea('adela'); console.log(` Adela K ${(await L()).k} topes[${await tp()}]`); await sel('[data-rate="40"]'); await clic('iov-b-clk', 1);
  let kk = 0; while ((await L()).k < 7 && kk++ < 20) await clic('iov-b-clk'); console.log(` tras ClK: K ${(await L()).k} topes[${await tp()}] PA ${await p.evaluate(() => document.getElementById('iov-mon-pa').textContent)}`); ok((await tp()).includes('hiperk:sello'), 'K≥7 sin sello');
  await resetea('rufino'); await p.evaluate(() => window.__iones.set({ ph: 7.6, ins: 3, dK: -500 })); console.log(` Rufino extremo: K ${(await L()).k} PO4 ${(await L()).po4} topes[${await tp()}]`); ok((await tp()).includes('nofis:sello') && (await L()).k >= 0, 'K<1,5 sin sello no fisiológica');
  await resetea('normal'); await p.evaluate(() => window.__iones.set({ ins: 4, po4b: 1 })); ok((await L()).po4 >= 0, 'fosfato negativo');
  // citas: todas las del documento llevan su botón doble
  const cc = await p.evaluate(() => ({ cita: document.querySelectorAll('#iov-raiz .cita').length, sinBoton: [...document.querySelectorAll('#iov-raiz .cita')].filter((c) => !c.querySelector('.ver-ficha[data-resaltar]') || !c.querySelector('.cita-pdf')).length })); console.log(` citas a la vista: ${cc.cita}, sin doble botón: ${cc.sinBoton}`); ok(cc.sinBoton === 0, 'cita sin doble botón');
  // ---- La Mayéutica: las 13 preguntas (acertando y fallando), el repaso y los 2 casos; sin desborde tras cada respuesta ----
  console.log('-- Mayéutica');
  {
    await resetea('normal'); await p.waitForTimeout(200);
    const DATOS = await p.evaluate(async () => { const m = await import('/js/data/iones-vivos-preguntas.js'); return JSON.parse(JSON.stringify({ P: m.PREGUNTAS, C: m.CASOS })); });
    const { P: PREG, C: CASOS } = DATOS;
    const clicM = (s) => p.evaluate((s) => { const e = document.querySelector(s); if (!e) return false; e.click(); return true; }, s);
    const cuenta = (s) => p.evaluate((s) => document.querySelectorAll(s).length, s);
    const textoDe = (h) => p.evaluate((h) => { const d = document.createElement('div'); d.innerHTML = h; return d.textContent.trim(); }, h);
    const libre = async (t) => { await p.waitForTimeout(500); const r = await p.evaluate(() => { const s = document.querySelector('#iov-preg [data-accion="sig"]'); const d = document.getElementById('iov-dock').getBoundingClientRect(); if (!s) return { sin: true }; const b = s.getBoundingClientRect(); return { bottom: b.bottom, dock: d.top }; });
      await desb(t); ok(r.sin || r.bottom <= r.dock + 1, `${ANCHO}: ${t}: «Siguiente» a la vista sobre el dock`); };
    const contestar = async (q, bien, et) => {
      if (q.tipo === 'test') {
        ok((await cuenta('#iov-preg [data-op]')) === 0, `${et}: las opciones no están en el HTML antes de «Ya lo tengo»`);
        await clicM('#iov-preg [data-accion="ops"]');
        const quiero = q.opciones.find((o) => !!o.ok === bien) || q.opciones[0], txt = await textoDe(quiero.t);
        ok(await p.evaluate((txt) => { const b = [...document.querySelectorAll('#iov-preg [data-op]')].find((x) => x.textContent.trim() === txt); if (!b) return false; b.click(); return true; }, txt), `${et}: elige una opción`);
        ok(await p.evaluate((b) => !!document.querySelector('#iov-preg .iov-' + (b ? 'ok' : 'mal')), bien), `${et}: dice ${bien ? 'Bien' : 'qué le habría pasado'}`);
      } else if (q.tipo === 'destapa') {
        await clicM('#iov-preg [data-accion="destapa"]'); await p.evaluate((b) => document.querySelectorAll('#iov-preg input[type=checkbox]').forEach((c) => { if (b) c.checked = true; }), bien); await clicM('#iov-preg [data-accion="puntos"]');
      } else if (q.tipo === 'error') {
        await p.evaluate(([b, mal]) => document.querySelectorAll('#iov-preg [data-fr]').forEach((x, i) => { if (b === mal[i]) x.click(); }), [true, q.frases.map((f) => !!f.mal)]);
        if (!bien) await p.evaluate(() => document.querySelector('#iov-preg [data-fr]').click());
        await clicM('#iov-preg [data-accion="corregir"]'); await clicM('#iov-preg [data-ver]');
      }
      await libre(et);
    };
    await clicM('#iov-modo-preguntas'); await p.waitForTimeout(400);
    ok(await p.evaluate(() => !document.getElementById('iov-vista-preguntas').hidden && document.getElementById('iov-dock-in').hidden && !document.getElementById('iov-dock-estudio').hidden), 'Mayéutica: abre la vista de preguntas y el dock de progreso');
    await desb('Mayéutica: inicio'); CAP && await p.screenshot({ path: `${CAP}08-may-inicio-${ANCHO}.png` });
    await clicM('[data-ir="recorrido"]'); await p.waitForTimeout(300);
    ok(PREG.length === 13, `13 preguntas (hay ${PREG.length})`);
    for (let i = 0; i < PREG.length; i++) {
      const q = PREG[i], bien = i % 2 === 0;
      const antes = await p.evaluate(() => ({ svg: document.getElementById('iov-ion-svg').textContent, mon: document.getElementById('iov-mon-k').textContent }));
      ok(/\?/.test(antes.svg + antes.mon), `${q.num}: las cifras del suero están tapadas antes de contestar`);
      if (i === 0) CAP && await p.screenshot({ path: `${CAP}09-may-pregunta-${ANCHO}.png` });
      await contestar(q, bien, `${q.num} ${bien ? 'acertada' : 'fallada'}`);
      const des = await p.evaluate(() => document.getElementById('iov-mon-k').textContent); ok(!/\?/.test(des), `${q.num}: tras contestar el modelo enseña la cifra (${des})`);
      if (i === 1) CAP && await p.screenshot({ path: `${CAP}10-may-respuesta-${ANCHO}.png` });
      await clicM('#iov-preg [data-accion="sig"]'); await p.waitForTimeout(250);
    }
    const nBien = PREG.filter((_, i) => i % 2 === 0).length, nRep = await cuenta('#iov-preg [data-rep]');
    ok(nRep === PREG.length - nBien, `repaso: vuelven las falladas (${PREG.length - nBien}; salen ${nRep})`);
    for (let k = 0; k < PREG.length; k++) { const id = await p.evaluate(() => document.querySelector('#iov-preg [data-rep]')?.dataset.rep); if (!id) break; await clicM(`#iov-preg [data-rep="${id}"]`); await p.waitForTimeout(250); await contestar(PREG.find((q) => q.id === id), true, `repaso ${id}`); await clicM('#iov-preg [data-accion="sig"]'); await p.waitForTimeout(250); }
    ok((await cuenta('#iov-preg [data-rep]')) === 0, 'repaso: tras acertarlas, no queda nada');
    await clicM('#iov-preg [data-ir="casos"]'); await p.waitForTimeout(250); await desb('casos: lista');
    for (let c = 0; c < CASOS.length; c++) {
      await clicM(`#iov-preg [data-caso="${c}"]`); await p.waitForTimeout(300);
      const C = CASOS[c];
      for (let i = 0; i < C.pasos.length; i++) {
        const q = C.pasos[i].pregunta, bien = i !== 1;
        ok(await p.evaluate(() => !!document.querySelector('#iov-preg dl.iov-paciente') && !!document.querySelector('#iov-preg .iov-dia')), `${C.corto} paso ${i + 1}: ficha del paciente y momento`);
        const estado = await p.evaluate(() => ({ k: document.getElementById('iov-mon-k').textContent, ion: document.querySelector('.selector-ion [aria-pressed="true"]')?.dataset.ion }));
        if (c === 0 && i === 3) CAP && await p.screenshot({ path: `${CAP}11-may-caso-${ANCHO}.png` });
        await contestar(q, bien, `${C.corto} paso ${i + 1} (${estado.k})`);
        const cif = await p.evaluate(() => ({ k: document.getElementById('iov-mon-k').textContent, ca: window.__iones.leer().caIonMmol, kv: window.__iones.leer().k })); console.log(`  ${C.corto} paso ${i + 1}: monitor «${cif.k}» · Ca iónico ${cif.ca.toFixed(2)} mmol/L`);
        await clicM('#iov-preg [data-accion="sig"]'); await p.waitForTimeout(300);
      }
      ok(/lo que te llevas/i.test(await p.evaluate(() => document.getElementById('iov-preg').innerText)), `${C.corto}: final con «Lo que te llevas»`);
      ok(await p.evaluate(() => { const b = document.querySelector('#iov-preg [data-especialidad][data-resaltar]'); return !!b && !!document.querySelector(b.dataset.resaltar); }), `${C.corto}: «Repasar en la ficha» apunta a un párrafo que existe`);
      await desb(`${C.corto}: final`);
      if (c === 0) { await clicM('#iov-preg [data-fin="modelo"]'); await p.waitForTimeout(300); ok(await p.evaluate(() => !document.getElementById('iov-dock-in').hidden), 'caso: «Abrir el modelo» vuelve a Explorar'); await clicM('#iov-modo-preguntas'); await p.waitForTimeout(300); await clicM('[data-ir="casos"]'); await p.waitForTimeout(250); }
    }
    const faltan = await p.evaluate(async (ids) => { const m = await import('/js/data/iones-vivos-data.js'); return ids.filter((pg) => !m.PAG_FICHA[pg] && !m.fichaDe(pg)); }, [19, 20, 21, 23, 24, 25, 27, 28, 29, 37, 38, 43, 44, 45, 46, 49]);
    ok(faltan.length === 0, 'cada página citada tiene su párrafo de la ficha');
    await p.evaluate(() => window.__iones.setModo('explorar')); await p.waitForTimeout(200); await desb('Mayéutica → Explorar');
  }
  // ---- Los 4 pendientes del rejuicio y el ECG plano con la parada ----
  console.log('-- Pendientes');
  await resetea('rufino'); await p.waitForTimeout(150);
  const dk = await p.evaluate(() => ({ h: document.getElementById('iov-dock').offsetHeight, mas: document.getElementById('iov-mas').open, guia: !document.getElementById('iov-guia').hidden, foco: document.querySelectorAll('#iov-ion-svg .foco').length }));
  ok(dk.h <= 260 && !dk.mas && dk.guia && dk.foco > 0, `1. dock ${dk.h}px (≤260, con la frase viva dentro), «Más mandos» cerrado, guía y foco a la vez`); console.log(` dock con guía abierta: ${dk.h} px`);
  await p.evaluate(() => scrollTo(0, 0)); CAP && await p.screenshot({ path: `${CAP}iov-guia-dock-${ANCHO}.png` });
  const pen = await p.evaluate(() => { const n = document.getElementById('iov-nota-ecg'); return { fuera: !document.getElementById('iov-monitor').contains(n), vis: !n.hidden }; }); ok(pen.fuera && pen.vis, '2. la nota del ECG de hipoK es un plegable fuera del monitor (K<3,5)');
  await resetea('normal'); ok(await p.evaluate(() => document.getElementById('iov-nota-ecg').hidden), '2. con K normal la nota no sale');
  ok(await p.evaluate(() => !!document.querySelector('#iov-crecera [data-view="ritmoVivo"]') && ![...document.querySelectorAll('#iov-crecera [data-view]')].some(b => b.dataset.view === 'eco' || b.dataset.especialidad === 'eco')), '3. «Lo que crecerá» lleva el ECG de hipoK a El corazón eléctrico (no a eco)');
  await resetea('rufino'); await p.evaluate(() => window.__iones.set({ ph: 7.6, ins: 3, dK: -500 }));
  const k4 = await p.evaluate(() => ({ mon: document.getElementById('iov-mon-k').textContent, svg: document.getElementById('iov-ion-svg').textContent }));
  ok(k4.mon.includes('<1,5') && !/0,3/.test(k4.mon) && k4.svg.includes('<1,5'), `4. con sello «no fisiológica» el monitor pinta «${k4.mon}» y el dibujo «<1,5», no 0,32`);
  console.log('-- ECG plano con la parada'); await resetea('normal'); const d0 = await p.evaluate(() => document.getElementById('iov-ecg-path').getAttribute('d'));
  await sel('[data-rate="40"]'); await sel('[data-via="cava"]'); await p.waitForTimeout(250);
  const d1 = await p.evaluate(() => ({ d: document.getElementById('iov-ecg-path').getAttribute('d'), pa: document.getElementById('iov-mon-pa').textContent, fc: document.getElementById('iov-mon-fc').textContent }));
  ok(/^M0 43\.4L340 43\.4$/.test(d1.d) && d1.pa === '0/0' && d1.fc === '0', `parada (ClK por la cava): ECG plano, PA ${d1.pa}, FC ${d1.fc}`); ok(d0.length > 500, 'ECG con trazo con el corazón en marcha');
  await sel('[data-via="central"]'); await p.waitForTimeout(250); ok(await p.evaluate(() => document.getElementById('iov-ecg-path').getAttribute('d').length > 500), 'sin sello, el ECG vuelve a latir');
  await resetea('normal'); await sel('[data-gmg="6"]'); await clic('iov-b-mg', 3); await p.waitForTimeout(250);
  ok(await p.evaluate(() => document.getElementById('iov-ecg-path').getAttribute('d') === 'M0 43.4L340 43.4'), 'parada por Mg²⁺ >13: ECG plano');
  // ---- la frase y el dock no tapan la escena al tocar un mando ----
  await resetea('normal'); await p.evaluate(() => scrollTo(0, 0)); await clic('iov-b-furo'); await p.waitForTimeout(300);
  const vis = await p.evaluate(() => { const f = document.getElementById('iov-frase').getBoundingClientRect(), d = document.getElementById('iov-dock').getBoundingClientRect(); return { fraseBajoDock: f.bottom > d.top + 1, dock: Math.round(d.height), vh: innerHeight }; }); console.log(' dock', vis.dock, 'de', vis.vh, 'px'); ok(vis.dock < vis.vh * 0.5, 'dock tapa media pantalla');
  // ---- los 8 botones de las fichas: abren su estado y vuelven ----
  console.log('-- Fichas de origen');
  const FICHAS = ['mr-hipopotasemia', 'mr-hiperk-causas', 'mr-hiperk-tratamiento', 'mr-magnesio-deficit', 'mr-magnesio-reposicion', 'mr-calcio-hipoca', 'mr-hipercalcemia', 'mr-fosforo'];
  for (const f of FICHAS) {
    await p.evaluate((f) => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'marinoRenal', panel: 'panel-marino-renal-tabs', tab: f }); document.body.append(t); t.click(); t.remove(); }, f); await p.waitForTimeout(500);
    const b = await p.evaluate((f) => { const x = document.querySelector(`#${f} [data-iones-vivos]`); if (!x) return null; x.click(); return x.dataset.ionesVivos; }, f); await p.waitForTimeout(700);
    const abre = await p.evaluate(() => !!document.getElementById('iov-raiz')?.offsetParent); ok(b !== null && abre, `ficha ${f}: su botón (${b}) abre los iones vivos`);
    await desb('ficha ' + f); await p.evaluate(() => document.getElementById('iov-volver').click()); await p.waitForTimeout(600);
    ok(await p.evaluate((f) => !!document.getElementById(f)?.offsetParent, f), `ficha ${f}: «← VOLVER» vuelve a la ficha`);
  }
  // ---- Estados con nombre (abrirEstado) y acople Mg→K ----
  console.log('-- Estados con nombre');
  const est = async (c) => { await p.evaluate((c) => window.__iones.abrirEstado(c), c); await p.waitForTimeout(150); };
  const clk1h = async () => { const k0 = (await L()).k; await p.evaluate(() => { window.__iones.e.rate = 20; window.__iones.e.via = 'central'; window.__iones.hacer('clk'); }); return +((await L()).k - k0).toFixed(2); };
  const frs = () => p.evaluate(() => document.getElementById('iov-frase-txt').textContent);
  const R6 = {};
  for (const c of ['mg-bajo', 'reponer-mg', 'hipermg', 'transfusion', 'realimentar', 'alcalosis-resp']) { await est(c); await desb('estado ' + c); R6[c] = await L(); ok((await frs()).length > 20, 'estado sin frase: ' + c); console.log(` ${c}: K ${R6[c].k} Mg ${R6[c].mg} PO4 ${R6[c].po4} Ca ${R6[c].caIon} topes[${await tp()}]`); }
  await est('mg-bajo'); const dBajo = await clk1h(); const fBajo = await frs(); await est('reponer-mg'); const dOk = await clk1h();
  console.log(` ClK 20 mEq × 1 h: ΔK con Mg bajo ${dBajo}, con Mg repuesto ${dOk}`); ok(dBajo < dOk * 0.85 && dOk > 0, 'mg-bajo: el ClK sube el K tanto como con Mg normal'); ok(/Mg²⁺ bajo/.test(fBajo), 'mg-bajo: la frase viva no lo dice');
  // Cifras del monitor de cada estado (K, Mg, Ca iónico mmol/L, fosfato) y ΔK con ClK 20 mEq/h × 8 h
  for (const c of ['mg-bajo', 'reponer-mg', 'transfusion', 'realimentar']) { const l = R6[c]; console.log(` monitor ${c}: K ${l.k} · Mg ${l.mg} · Ca iónico ${l.caIonMmol} mmol/L · fosfato ${l.po4}`); }
  ok(Math.abs(R6['mg-bajo'].k - 2.8) < 0.06 && Math.abs(R6['mg-bajo'].mg - 1.0) < 0.06, 'mg-bajo: K 2,8 y Mg 1,0 en el monitor'); ok(Math.abs(R6.transfusion.caIonMmol - 0.6) < 0.02, 'transfusion: Ca iónico ≠ 0,60'); ok(Math.abs(R6.realimentar.po4 - 0.9) < 0.05, 'realimentar: fosfato ≠ 0,9');
  const k8 = async (c) => { await est(c); const k0 = (await L()).k; await p.evaluate(() => { window.__iones.e.rate = 20; window.__iones.e.via = 'central'; for (let i = 0; i < 8; i++) window.__iones.hacer('clk'); }); return +((await L()).k - k0).toFixed(2); };
  const d8b = await k8('mg-bajo'), d8o = await k8('reponer-mg'); console.log(` ClK 20 mEq/h × 8 h: ΔK con Mg 1,0 ${d8b}, con Mg repuesto ${d8o}`); ok(d8b < d8o * 0.4, 'mg-bajo: el contraste a 8 h no se ve');
  for (const c of ['mg-bajo', 'reponer-mg', 'hipermg', 'transfusion', 'realimentar', 'alcalosis-resp']) { await est(c); const g = await p.evaluate(() => { const h = document.querySelector('#iov-guia h3')?.textContent || ''; return { vis: !document.getElementById('iov-guia').hidden, n: +(h.match(/de (\d)$/) || [])[1], mg: document.getElementById('iov-mon-k').textContent, mas: document.getElementById('iov-mas').open }; }); ok(g.vis && g.n >= 3 && g.n <= 5, `estado ${c}: guía de ${g.n} pasos`); if (c === 'mg-bajo' || c === 'reponer-mg') { if (c === 'mg-bajo') await sel('#iov-guia [data-paso="sig"]'); const m = await p.evaluate(() => document.getElementById('iov-mon-k').textContent); ok(/Mg²⁺ \d/.test(m), c + ': el Mg²⁺ no se ve en el monitor (' + m + ')'); for (let i = 0; i < 4; i++) await sel('#iov-guia [data-paso="sig"]'); } await desb('guía ' + c); }
  await est('mg-bajo'); for (let i = 0; i < 3; i++) await sel('#iov-guia [data-paso="sig"]'); ok(await p.evaluate(() => document.getElementById('iov-mas').open), 'mg-bajo: «Más mandos» cerrado en el paso del ClK');
  await est('mg-bajo'); await p.evaluate(() => { window.__iones.e.g = 6; for (let i = 0; i < 3; i++) { window.__iones.hacer('mg'); window.__iones.hacer('esp'); } }); const dMgDado = await clk1h(); console.log(` tras 3×6 g de MgSO4: ΔK ${dMgDado}`); ok(dMgDado > dBajo, 'tras dar MgSO4 el ClK no mejora');
  ok(R6.hipermg.mg >= 10, 'hipermg: Mg < 10'); await est('hipermg'); ok((await tp()).includes('mg:aviso'), 'hipermg: sin aviso de bloqueo AV');
  await est('normal'); const po7 = (await L()).po4; ok(R6['alcalosis-resp'].po4 < po7, `alcalosis-resp: fosfato ${R6['alcalosis-resp'].po4} no menor que ${po7}`);
  ok(R6.transfusion.k > 4.5 && R6.realimentar.po4 < 1.8, 'transfusión o realimentar sin efecto');
  console.log('-- Barrido de extremos del acople (Mg 0,5 / 1,1 / 1,45 / 3 × ClK 10/20/40 × 1-6 h)');
  for (const mgv of [0.5, 1.1, 1.45, 3]) for (const r of [10, 20, 40]) {
    await resetea('rufino'); const dMg = (mgv - 1.45) / 0.0035; await p.evaluate(([d, r]) => { window.__iones.set({ dMg: d }); window.__iones.e.rate = r; window.__iones.e.via = 'central'; }, [dMg, r]);
    for (let h = 0; h < 6; h++) { await p.evaluate(() => window.__iones.hacer('clk')); const l = await L(); ok(Number.isFinite(l.k) && l.k >= 1.5 && l.k <= 8, `barrido Mg ${mgv} ClK ${r} h${h + 1}: K ${l.k}`); }
    console.log(` Mg ${mgv} ClK ${r}: K final ${(await L()).k}`);
  }
  ok(await p.evaluate(() => { const ids = [...document.querySelectorAll('[id^="iov-"]')].map(e => e.id); return ids.length === new Set(ids).size; }), 'ids iov- sin duplicar');
  await ctx.close();
}
} catch (e) { fallos.push('excepción: ' + e.message); } finally { await b.close();  }
console.log(errores.length ? '❌ Errores de consola: ' + errores.slice(0, 5).join(' | ') : '✅ Consola limpia');
fallos.forEach(f => console.log('❌ ' + f));
if (!fallos.length) console.log('✅ Iones vivos: todas las comprobaciones en verde (390 y 360 px)');
process.exit(fallos.length || errores.length ? 1 : 0);
