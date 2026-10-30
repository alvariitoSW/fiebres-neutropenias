// Tope clínico de «Transfundir 1 CH» en Carmen (educacion-app 3, B1). Uso: node capilar-vivo-carmen.mjs <url> [--capturas dir]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const args = process.argv.slice(2), BASE = (args.find(a => /^https?:/.test(a)) || 'http://localhost:8000/').replace(/\/?$/, '/');
const CAP = args.includes('--capturas') ? args[args.indexOf('--capturas') + 1].replace(/\/?$/, '/') : null;
const b = await chromium.launch(); let malos = 0;
for (const [W, red] of [[390, false], [360, true]]) {
  const ctx = await b.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 2, reducedMotion: red ? 'reduce' : 'no-preference' });
  const p = await ctx.newPage(); const err = [];
  p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) err.push(m.text()); }); p.on('pageerror', e => err.push(e.message));
  const ok = (c, t) => { console.log(`${c ? '✅' : '❌'} ${W}: ${t}`); if (!c) malos++; };
  await p.goto(BASE + 'index.html'); await p.waitForFunction(() => window.__cpvPonerCarmen);
  await p.click('#btn-libros'); await p.click('#btn-libro-marino'); await p.click('#lib-pest-vivos'); await p.click('#cpv-menu-libros'); await p.waitForTimeout(500);
  const T = () => p.evaluate(() => { const t = window.__cpvPruebas(), c = id => document.getElementById('cpv-c-' + id)?.querySelector('b')?.textContent;
    return { hb: t.estado.hb, R: t.R, celdas: t.celdas, alveolo: t.estado.alveolo, gc: t.estado.gcFijo, goteando: t.goteando, lupa: t.lupa,
      frase: document.getElementById('cpv-frase').textContent, btn: document.getElementById('cpv-m-transf').disabled,
      avisos: [...document.querySelectorAll('.tope-aviso')].map(e => e.textContent.replace(/\s+/g, ' ').trim()),
      sellos: [...document.querySelectorAll('.tope-sello')].map(e => e.textContent.replace(/\s+/g, ' ').trim()),
      nota: (document.getElementById('cpv-carmen-nota') || {}).hidden === false ? document.getElementById('cpv-carmen-nota').textContent.replace(/\s+/g, ' ') : '',
      desb: document.documentElement.scrollWidth - innerWidth }; });
  const esperar = () => p.waitForFunction(() => !window.__cpvPruebas().goteando, null, { timeout: 5000 }).then(() => p.waitForTimeout(250));
  await p.evaluate(() => window.__cpvPonerCarmen()); await p.waitForTimeout(400);
  let t = await T(); console.log(' Hb', t.hb, JSON.stringify(t.celdas), JSON.stringify(t.R));
  ok(t.hb === 7.4 && !t.btn && !t.avisos.length && !t.sellos.length, 'Carmen: Hb 7,4, mando encendido, sin aviso ni sello'); await p.screenshot({ path: CAP && CAP + `carmen-0-${W}.png` });
  await p.click('#cpv-m-transf'); await esperar(); t = await T(); console.log(' Hb', t.hb, JSON.stringify(t.celdas), JSON.stringify(t.R));
  ok(Math.abs(t.hb - 8.4) < 1e-6 && t.gc != null, `1.ª bolsa: Hb ${t.hb}, gasto quieto ${t.gc}`);
  ok(t.avisos.some(a => /Hb 8,4 · umbrales de las guías: 7 y 8 g\/dL \(p\. 8\)/.test(a)) && !t.sellos.length && !t.btn, `chip sin consejo: ${t.avisos[0]}`);
  ok(t.desb <= 0, 'sin desborde tras la 1.ª'); await p.screenshot({ path: CAP && CAP + `carmen-1-${W}.png` });
  await p.click('#cpv-m-transf'); await esperar(); t = await T(); console.log(' Hb', t.hb, JSON.stringify(t.celdas), JSON.stringify(t.R));
  ok(Math.abs(t.hb - 9.4) < 1e-6 && t.alveolo === 'taco' && t.gc === 7.6, `2.ª bolsa: Hb ${t.hb}, alveolo ${t.alveolo}, gasto ${t.gc}`);
  ok(t.sellos.length === 1 && /TACO/.test(t.sellos[0]) && !t.avisos.length && t.btn, `sello: ${t.sellos[0]} · mando apagado ${t.btn}`);
  ok(t.lupa === 'alveolo', 'lupa del alvéolo abierta');
  ok(t.frase.includes('La transfusión que no hacía falta le ha llenado el pulmón de agua.'), 'frase viva');
  ok(/FR 30/.test(t.nota) && /SpO₂ 86 %/.test(t.nota) && /FC 110/.test(t.nota) && /152\/90/.test(t.nota) && /PVC 16/.test(t.nota) && /ilustrativas/.test(t.nota) && /≈1 %, más con IC previa \(p\. 15\)/.test(t.nota) && /gasto caería/.test(t.nota), 'constantes rotuladas y nota honesta');
  await p.waitForTimeout(700); ok(await p.evaluate(() => { const r = document.getElementById('cpv-carmen-nota').getBoundingClientRect(); return r.bottom <= document.getElementById('cpv-dock').getBoundingClientRect().top + 1; }), 'constantes y nota a la vista, sobre la barra'); ok(t.desb <= 0, 'sin desborde con el sello'); await p.screenshot({ path: CAP && CAP + `carmen-2-${W}.png` });
  await p.evaluate(() => document.getElementById('cpv-m-transf').click()); await p.waitForTimeout(300); t = await T();
  ok(Math.abs(t.hb - 9.4) < 1e-6, 'con el mando apagado no entra otra bolsa');
  // fuera de Carmen, el mando no tiene tope clínico
  await p.evaluate(() => document.querySelector('[data-cpv-estado="normal"]')?.click()); await p.waitForTimeout(300); t = await T();
  ok(!t.sellos.length && !t.avisos.length && !t.btn && t.alveolo === null && !t.nota, 'otro paciente: sin sello, mando libre');
  // ---- El caso 5 (Carmen) por dos ramas: A = transfundir dos veces; B = «Dejar así» y «Parar aquí» ----
  const PREG = '#cpv-preg ';
  const txt = () => p.evaluate(() => document.getElementById('cpv-preg').innerText);
  const clic = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no hay ' + s); e.click(); }, PREG + sel);
  const op = async re => { if (await p.evaluate(() => !document.querySelector('#cpv-preg [data-op]') && !!document.querySelector('#cpv-preg [data-accion="ops"]'))) await clic('[data-accion="ops"]'); const i = await p.evaluate(r => [...document.querySelectorAll('#cpv-preg [data-op]')].findIndex(b => new RegExp(r).test(b.textContent)), re.source); if (i < 0) throw new Error('sin opción ' + re); await clic(`[data-op="${i}"]`); await p.waitForTimeout(red ? 60 : 350); };
  const sig = async () => { await clic('[data-accion="sig"]'); await p.waitForTimeout(red ? 60 : 400); };
  const medidas = [];
  const vigila = async d => { const dd = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (dd > 0) { ok(false, `desborde ${dd}px en ${d}`); } medidas.push(dd); };
  const monitor = () => p.evaluate(() => { const t = window.__cpvPruebas(); return { hb: t.estado.hb, do2: t.R.do2, vo2: t.R.vo2, ext: t.R.ext, scvo2: t.R.ven, sao2: t.R.sao2, lact: t.R.lact, gc: t.R.gc, lupa: t.lupa }; });
  // paso nuevo (N1/N2): apuestas el VO₂ ANTES de ver el monitor; todas las opciones enseñan la tabla antes → después
  const nuevoPaso = async rama => {
    const antes = await monitor(), t0 = await txt();
    ok(/qué ha hecho el consumo/.test(t0) && antes.hb === 7.4 && antes.do2 === 742, `${rama} paso nuevo: monitor aún en Hb 7,4 · DO₂ 742 y compuerta («Piénsalo antes»: ${/Piénsalo antes/.test(t0)})`);
    ok(/Piénsalo antes/.test(t0), `${rama} paso nuevo: con compuerta`);
    await vigila(rama + ' paso nuevo'); if (CAP && rama === 'A') await p.screenshot({ path: CAP + `caso-nuevo-pregunta-${W}.png` });
    await op(/^Baja, porque la extracción/);
    const m = await monitor(), tx = await p.evaluate(() => { const r = document.querySelector('#cpv-preg [data-hueco="res"]'); return { t: r.innerText, tabla: r.querySelectorAll('.cpv-consecuencia table tr').length, cons: r.innerHTML.indexOf('cpv-consecuencia'), porque: r.innerText.indexOf('hipometabolismo') }; });
    ok(m.hb === 8.4 && m.do2 === 843 && m.vo2 === 250 && m.ext === 30 && m.scvo2 === 69, `${rama} paso nuevo: tras contestar, monitor ${m.hb} · ${m.do2} · VO₂ ${m.vo2} · ext ${m.ext} · ScvO₂ ${m.scvo2}`);
    ok(tx.tabla === 6 && /Lo que ves ahora/.test(tx.t) && tx.t.indexOf('Lo que ves ahora') < tx.porque, `${rama} paso nuevo: tabla antes → después y la consecuencia antes de la explicación`);
    await vigila(rama + ' paso nuevo respuesta'); if (CAP && rama === 'A') await p.screenshot({ path: CAP + `caso-nuevo-tabla-${W}.png` });
    await sig();
  };
  for (const rama of ['A', 'B']) {
    await p.evaluate(() => document.getElementById('cpv-modo-preguntas').click()); await p.waitForTimeout(300);
    await clic('[data-ir="casos"]').catch(() => p.evaluate(() => document.querySelector('#cpv-preg [data-ir="casos"]').click()));
    await p.evaluate(() => document.querySelector('#cpv-preg [data-caso="4"]').click()); await p.waitForTimeout(400);
    let t1 = await txt(); const m0 = await monitor();
    ok(/Carmen tiene la Hb en 7,4/.test(t1) && !/Piénsalo antes/.test(t1) && !/Ya lo tengo/.test(t1), `${rama} P1: texto exacto, sin «piensa antes»`);
    ok(m0.hb === 7.4 && m0.do2 === 742 && m0.ext === 34 && m0.scvo2 === 65, `${rama} P1: monitor Hb ${m0.hb} · DO₂ ${m0.do2} · ext ${m0.ext} % · ScvO₂ ${m0.scvo2} %`);
    await vigila(rama + ' P1'); if (CAP && rama === 'A') await p.screenshot({ path: CAP + `caso-p1-${W}.png` });
    if (rama === 'A') {
      await op(/^Transfundir 1 CH/);
      const m1 = await monitor();
      const orden = await p.evaluate(() => { const r = document.querySelector('#cpv-preg [data-hueco="res"]'); const t = r.innerText; return { cons: t.indexOf('Lo que acaba de pasar'), expl: t.search(/Crítico estable sin cardiopatía|Con Hb 7,4 ≥7/), tiene: !!r.querySelector('.cpv-consecuencia') }; });
      ok(m1.hb === 7.4 && m1.do2 === 742 && m1.ext === 34 && m1.scvo2 === 65, `A P1: tras la 1.ª bolsa (sin destapar), monitor Hb ${m1.hb} · DO₂ ${m1.do2} · ext ${m1.ext} % · ScvO₂ ${m1.scvo2} %`);
      ok(orden.tiene && orden.cons >= 0, 'A P1: sale «Lo que acaba de pasar»');
      ok(!/DO₂ 742 → 843/.test(await txt()), 'A P1: la consecuencia ya no destapa las cifras de la bolsa');
      await vigila('A P1 respuesta'); await sig();
      await nuevoPaso(rama);
      ok(/Pasó la primera bolsa\. Hb de control 8,4/.test(await txt()), 'A P2: «Pasó la primera bolsa. Hb de control 8,4»');
      await vigila('A P2'); await op(/^Transfundir otro CH/);
      const m2 = await monitor();
      ok(m2.hb === 9.4 && m2.do2 === 826 && m2.sao2 === 86 && m2.scvo2 === 60, `A P2: la 2.ª bolsa lleva al TACO: Hb ${m2.hb} · DO₂ ${m2.do2} · SaO₂ ${m2.sao2} % · ScvO₂ ${m2.scvo2} %`);
      await vigila('A P2 respuesta'); await sig();
    } else {
      await op(/^Dejar así/); await vigila('B P1 respuesta'); await sig();
      ok(/la bolsa es la del R1 de la mañana/.test(await txt()), 'B paso nuevo: la cab dice que la bolsa es la del R1');
      await nuevoPaso(rama);
      ok(/R1 de la mañana la ve «todavía baja»/.test(await txt()), 'B P2: línea del R1 de la mañana');
      await vigila('B P2'); await op(/^Parar aquí/); await vigila('B P2 respuesta'); await sig();
    }
    // P3: el sello, para las dos ramas, y «Lo que acaba de pasar» antes de la enseñanza
    const m3 = await monitor(); t1 = await txt();
    ok(m3.hb === 9.4 && m3.do2 === 826 && m3.lupa === 'alveolo', `${rama} P3: el modelo está en el TACO (Hb ${m3.hb}, DO₂ ${m3.do2}, ${m3.lupa})`);
    ok(await p.evaluate(() => { const s = document.querySelector('#cpv-lamina-caja .tope-sello'); return !!s && !/TACO/.test(s.textContent) && /Edema pulmonar/.test(s.textContent) && document.getElementById('cpv-m-transf').disabled; }), `${rama} P3: sello sin nombre («Edema pulmonar») y mando apagado`);
    ok(/Edema pulmonar a las 4 h de la 2\.ª bolsa/.test(t1) && !/TACO/.test(t1.split('Pasó. Ahora')[0]) && !/El ejemplo resuelto/.test(t1) && /FR 30, SpO₂ 86 % con gafas, FC 110, PA 152\/90, PVC 16/.test(t1), `${rama} P3: «Lo que acaba de pasar» con las constantes, antes de la enseñanza`);
    if (rama === 'B') ok(/a las 10:30 cuelga la 2\.ª bolsa/.test(t1), 'B P3: línea del R1 (todos ven el sello)');
    await vigila(rama + ' P3'); if (CAP && rama === 'A') { await p.waitForTimeout(700); await p.screenshot({ path: CAP + `caso-p3-${W}.png` }); }
    await op(/^TACO: sobrecarga/); ok(await p.evaluate(() => /TACO/.test(document.querySelector('#cpv-lamina-caja .tope-sello')?.textContent || '')), `${rama} P3: tras contestar, el sello pasa a «TACO»`); await vigila(rama + ' P3 respuesta'); await sig();
    // P4: la enseñanza
    t1 = await txt();
    ok(/El ejemplo resuelto/.test(t1) && await p.evaluate(() => document.querySelectorAll('#cpv-preg [data-cm-paso]').length === 6 && !!document.querySelector('#cpv-preg details.nota-plegable')), `${rama} P4: 6 pasos con su botón y la nota de evidencia plegable`);
    ok(!await p.evaluate(() => !!document.querySelector('#cpv-lamina-caja .tope-sello')), `${rama} P4: el sello ya no está`);
    for (let i = 0; i < 6; i++) { await clic(`[data-cm-paso="${i}"]`); await p.waitForTimeout(150); const m = await monitor(); if (i === 2) ok(m.hb === 8.4 && m.do2 === 843, `${rama} P4 paso 3: DO₂ 742 → 843 (${m.do2})`); if (i === 5) ok(m.lupa === 'alveolo' && m.do2 === 826, `${rama} P4 paso 6: TACO (${m.do2})`); await vigila(`${rama} P4 paso ${i + 1}`); }
    if (CAP && rama === 'A') { await clic('[data-cm-paso="2"]'); await p.waitForTimeout(500); await p.screenshot({ path: CAP + `caso-p4-${W}.png` }); }
    await op(/^No transfundir más/); await vigila(rama + ' P4 respuesta'); await sig();
    // P5: las 3 preguntas (test, destapa, error), cada una con «Ver en la ficha»
    t1 = await txt(); ok(/Don Julián/.test(t1) && /Piénsalo antes/.test(t1), `${rama} P5-1: test con «piensa antes»`);
    await op(/^Transfundir 1 CH y controlar/); await vigila(rama + ' P5-1'); 
    ok(await p.evaluate(() => !!document.querySelector('#cpv-preg [data-hueco="res"] [data-resaltar="#mh-umbral-7"], #cpv-preg [data-hueco="res"] [data-resaltar]')), `${rama} P5-1: «Ver en la ficha»`); await sig();
    await clic('[data-accion="destapa"]'); await p.evaluate(() => document.querySelectorAll('#cpv-preg [data-p]').forEach(c => { c.checked = true; })); await clic('[data-accion="puntos"]'); await p.waitForTimeout(200); await vigila(rama + ' P5-2');
    ok(await p.evaluate(() => !!document.querySelector('#cpv-preg [data-resaltar]')), `${rama} P5-2: «Ver en la ficha»`); await sig();
    await p.evaluate(() => { const f = document.querySelectorAll('#cpv-preg [data-fr]'); f[0].click(); f[3].click(); }); await clic('[data-accion="corregir"]'); await p.waitForTimeout(250); await vigila(rama + ' P5-3');
    ok(await p.evaluate(() => !!document.querySelector('#cpv-preg [data-resaltar]')), `${rama} P5-3: «Ver en la ficha»`); await clic('[data-accion="sig"]'); await p.waitForTimeout(300);
    t1 = await txt(); ok(/Lo que te llevas/i.test(t1) && await p.evaluate(() => document.querySelectorAll('#cpv-preg [data-capilar-vivo="taco"], #cpv-preg [data-capilar-vivo="umbral-7"]').length === 2 && document.querySelectorAll('#cpv-preg [data-cpv-fuente] [data-resaltar], #cpv-preg [data-cpv-fuente] button, #cpv-preg [data-cpv-fuente] a').length >= 3), `${rama}: «Lo que te llevas» con los enlaces al modelo y a la ficha`);
    await vigila(rama + ' fin'); if (CAP && rama === 'A') await p.screenshot({ path: CAP + `caso-fin-${W}.png` });
  }
  ok(medidas.every(d => d <= 0), `desborde 0 tras cada paso del caso (${medidas.length} medidas)`);
  ok(err.length === 0, 'sin errores de consola ' + err.slice(0, 2).join('|'));
  await ctx.close();
}
await b.close(); process.exit(malos ? 1 : 0);
