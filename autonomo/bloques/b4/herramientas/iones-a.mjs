// Prueba de la maqueta «iones vivos · A» (autonomo/maquetas/b4-iones-a.html). Playwright a 390 y 360 px.
// Uso: node autonomo/bloques/b4/herramientas/iones-a.mjs   (levanta su servidor en el puerto 8101 y lo cierra por su pid)
// Sale con 1 si algo falla. Escribe en texto: desborde, rótulos <8 px en pantalla, cifras de cada mando (mín/medio/máx),
// topes, apuesta/error/caso, estabilidad de botones, frase a la vista y errores de consola. Capturas en /tmp/plan-socialista/b4/capturas-a/.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
const RAIZ = new URL('../../../../', import.meta.url).pathname, OUT = '/tmp/plan-socialista/b4/capturas-a/'; mkdirSync(OUT, { recursive: true });
const srv = spawn('python3', ['-m', 'http.server', '8101', '--bind', '127.0.0.1'], { cwd: RAIZ, stdio: 'ignore' }); const pid = srv.pid;
await new Promise(r => setTimeout(r, 1200));
const URL_ = 'http://127.0.0.1:8101/autonomo/maquetas/b4-iones-a.html'; let fallos = 0;
const ok = (c, m) => { console.log(`${c ? '✅' : '❌'} ${m}`); if (!c) fallos++; };
const b = await chromium.launch();
try {
  for (const W of [390, 360]) {
    console.log(`\n=== ${W} px ===`);
    const ctx = await b.newContext({ viewport: { width: W, height: 844 }, reducedMotion: 'reduce' }), p = await ctx.newPage(); const err = [];
    p.on('pageerror', e => err.push(e.message)); p.on('console', m => m.type() === 'error' && err.push(m.text()));
    await p.goto(URL_); await p.waitForTimeout(900);
    const click = sel => p.evaluate(s => document.querySelector(s).click(), sel);
    const pest = n => click(`[data-pest="${n}"]`);
    const lect = () => p.evaluate(() => Object.fromEntries(['k', 'mg', 'ca', 'p', 'fc', 'pa'].map(c => [c, document.querySelector('#lc-' + c + ' b').textContent])));
    const L = o => `K ${o.k} · Mg ${o.mg} · Ca ${o.ca} · P ${o.p} · FC ${o.fc} · PA ${o.pa}`;
    const desborde = async (n) => { const o = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]); ok(o[0] <= o[1], `sin desborde (${n}): ${o[0]}/${o[1]}`); };
    const sellos = () => p.evaluate(() => [...document.querySelectorAll('.tope-sello')].map(x => x.dataset.tope));
    const paciente = async k => { await pest('tiempo'); await click(`[data-pac="${k}"]`); await p.waitForTimeout(80); };
    const pasarH = async n => { await pest('tiempo'); for (let i = 0; i < n; i++) await click('[data-act="t60"]'); };
    await desborde('inicio');
    // rótulos
    const rot = await p.evaluate(() => {
      const sv = document.querySelector('#esc'), esc = sv.getBoundingClientRect().width / 360, bajos = []; let min = 99;
      sv.querySelectorAll('text').forEach(t => { if (!t.textContent.trim()) return; const px = parseFloat(t.getAttribute('font-size')) * esc; min = Math.min(min, px); if (px < 8) bajos.push(t.textContent.slice(0, 20) + ':' + px.toFixed(1)); });
      document.querySelectorAll('body *:not(svg *):not(script):not(style)').forEach(e => { if (!e.offsetParent && getComputedStyle(e).position !== 'fixed') return; if ([...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) { const f = parseFloat(getComputedStyle(e).fontSize); if (f < 8) bajos.push((e.id || e.className || e.tagName) + ':' + f.toFixed(1)); } });
      // rótulos que se pisan (solo texto del dibujo, sin cifras vivas del mismo grupo)
      const cajas = [...sv.querySelectorAll('text')].filter(t => t.textContent.trim()).map(t => [t.textContent.trim(), t.getBoundingClientRect()]); let pis = [];
      for (let i = 0; i < cajas.length; i++) for (let j = i + 1; j < cajas.length; j++) { const a = cajas[i][1], c = cajas[j][1]; if (a.left < c.right - 1 && c.left < a.right - 1 && a.top < c.bottom - 2 && c.top < a.bottom - 2) pis.push(cajas[i][0].slice(0, 14) + '|' + cajas[j][0].slice(0, 14)); }
      return { min: min.toFixed(1), bajos, pis };
    });
    ok(rot.bajos.length === 0, `rótulos ≥8 px en pantalla (mínimo del dibujo ${rot.min} px)${rot.bajos.length ? ' · ' + rot.bajos.join(', ') : ''}`);
    ok(rot.pis.length === 0, `rótulos del dibujo sin pisarse${rot.pis.length ? ': ' + rot.pis.join(', ') : ''}`);
    await p.screenshot({ path: `${OUT}a-${W}-inicio.png`, fullPage: true });
    // estabilidad de botones
    await p.evaluate(() => { document.querySelectorAll('#dock-panel button').forEach((b, i) => b.__id = i); });
    // ---- cifras de cada mando (mín/medio/máx) ----
    console.log('-- cifras de los mandos --');
    await paciente('damian'); console.log('Damián base:', L(await lect()));
    await pest('mover'); for (let i = 1; i <= 2; i++) { await click('[data-act="realimentar"]'); console.log(`Realimentar ×${i}:`, L(await lect())); }
    ok((await sellos()).includes('p'), 'Realimentar ×2 llega al tope: fosfato <1 mg/dL → sello'); ok(await p.evaluate(() => document.querySelector('[data-act="realimentar"]').disabled), 'y el mando Realimentar queda apagado');
    await p.screenshot({ path: `${OUT}a-${W}-tope-fosfato.png` });
    await paciente('rufino'); await pest('mover'); await click('[data-act="furosemida"]'); for (const h of [1, 3, 6]) { await paciente('rufino'); await pest('mover'); await click('[data-act="furosemida"]'); await pasarH(h); console.log(`Furosemida + ${h} h:`, L(await lect())); }
    await paciente('damian'); await pest('reponer'); for (const r of [10, 20, 40]) { await click(`[data-clk="${r}"]`); await pasarH(1); console.log(`ClK ${r} mEq/h, 1 h:`, L(await lect())); await paciente('damian'); await pest('reponer'); }
    await paciente('rufino'); await pest('reponer'); const mgb = await p.$$('[data-mg]'); await mgb[0].evaluate(e => e.click()); console.log('MgSO₄ 2 g:', L(await lect())); await pasarH(1); console.log('  +1 h (el pico cae):', L(await lect()));
    await paciente('rufino'); await pest('reponer'); await (await p.$$('[data-mg]'))[1].evaluate(e => e.click()); console.log('MgSO₄ 6 g:', L(await lect()));
    await paciente('damian'); await pest('reponer'); await click('[data-act="fosfato"]'); console.log('Fosfato potásico 15 mmol:', L(await lect()));
    await paciente('sano'); await pest('calcio'); const ca = await p.$$('[data-ca]'); await ca[0].evaluate(e => e.click()); console.log('Gluconato 10 mL:', L(await lect()));
    for (const a of ['[data-alb]', '[data-ph]']) { const bs = await p.$$(a); for (const i of [0, 1, 1]) { await bs[i].evaluate(e => e.click()); } console.log(`${a} ↓ ↑ ↑ (alb ${a === '[data-alb]' ? 'mín→+1' : 'pH'}):`, L(await lect())); }
    await paciente('sano'); await pest('calcio'); for (const n of [1, 5, 10]) { await paciente('sano'); await pest('calcio'); for (let i = 0; i < n; i++) await click('[data-act="unidad"]'); console.log(`Transfundir ${n} unidades:`, L(await lect())); }
    // ---- topes ----
    console.log('-- topes --');
    await paciente('sano'); await pest('reponer'); await click('[data-via="cava"]'); await click('[data-clk="40"]'); let s = await sellos();
    ok(s.includes('clk'), 'ClK 40 mEq/h por la cava superior → sello «asistolia»'); ok(await p.evaluate(() => document.querySelector('[data-clk="40"]').disabled), 'y el 40 queda apagado'); const lc = await lect(); ok(lc.fc === '0', 'constantes en la asistolia: ' + L(lc));
    await p.screenshot({ path: `${OUT}a-${W}-tope-asistolia.png` }); await click('[data-via="periferica"]'); ok(!(await sellos()).includes('clk'), 'al pasar a vía periférica el sello se va');
    await paciente('rufino'); await pest('reponer'); for (let i = 0; i < 7 && !(await sellos()).includes('mg'); i++) { await (await p.$$('[data-mg]'))[1].evaluate(e => e.click()); } ok((await sellos()).includes('mg'), 'MgSO₄ repetido → Mg ≥13 mEq/L: sello parada · ' + L(await lect()));
    await paciente('sano'); await pest('calcio'); for (let i = 0; i < 20 && !(await sellos()).includes('ca'); i++) await click('[data-act="unidad"]'); ok((await sellos()).includes('ca'), 'citrato repetido → Ca iónico <0,65: sello hipotensión · ' + L(await lect()));
    await paciente('sano'); await pest('calcio'); await (await p.$$('[data-ca]'))[1].evaluate(e => e.click()); ok((await sellos()).includes('bolo') && await p.evaluate(() => [...document.querySelectorAll('[data-ca]')].every(b => b.disabled)), 'cloruro 10 mL (270 mg) → sello «bolo >200 mg» y mandos de calcio apagados');
    await paciente('rufino'); await pest('mover'); for (let i = 0; i < 12 && !(await sellos()).includes('k'); i++) { await click('[data-act="furosemida"]'); await pasarH(6); await pest('mover'); } ok((await sellos()).includes('k'), 'furosemida repetida → «combinación no fisiológica» (K⁺ <1,5) · ' + L(await lect()));
    await paciente('sano'); await pest('reponer'); await click('[data-clk="40"]'); for (let i = 0; i < 30 && !(await sellos()).includes('k'); i++) await pasarH(1); ok((await sellos()).includes('k'), 'ClK 40 mEq/h sin fin → K⁺ >9: «combinación no fisiológica» · ' + L(await lect()));
    // ---- botones estables y frase ----
    const est = await p.evaluate(() => [...document.querySelectorAll('#dock-panel button')].every((b, i) => b.__id === i)); ok(est, 'los botones del dock siguen siendo los mismos nodos tras todos los mandos');
    await paciente('damian'); await pest('mover'); await click('[data-act="realimentar"]'); await p.waitForTimeout(250);
    const fr = await p.evaluate(() => { const f = document.querySelector('#frase').getBoundingClientRect(), d = document.querySelector('#dock').getBoundingClientRect(); return [f.bottom, d.top, document.querySelector('#frase').textContent]; });
    ok(fr[0] <= fr[1] + 1, `frase viva sobre el dock (${Math.round(fr[0])} ≤ ${Math.round(fr[1])}): «${fr[2]}»`);
    await p.screenshot({ path: `${OUT}a-${W}-realimentar.png` });
    // ---- guía ----
    await click('#explicame'); let n = 1; while (await p.evaluate(() => document.querySelector('#g-sig')?.textContent.startsWith('Siguiente'))) { await click('#g-sig'); n++; } ok(n >= 3 && n <= 5, `explicación guiada de ${n} pasos (3-5)`); await click('#g-sig');
    // ---- Mayéutica ----
    console.log('-- Mayéutica --');
    await click('#modo-preguntas'); await p.waitForTimeout(150);
    const oculto = await p.evaluate(() => ['#lc-k b', '#esc-tubo-l', '#esc-f362-t'].every(s => getComputedStyle(document.querySelector(s)).visibility === 'hidden'));
    ok(oculto, 'antes de contestar la apuesta, las cifras de K⁺ están tapadas'); const ht = await p.evaluate(() => document.querySelector('#vista-preg').innerHTML); ok(!/ok="true"|data-ok|correcta/.test(ht), 'la respuesta correcta no está escrita en el HTML');
    await desborde('apuesta'); await p.screenshot({ path: `${OUT}a-${W}-apuesta.png`, fullPage: true });
    const opciones = async () => p.$$('#ops .opcion'); await (await opciones())[0].evaluate(e => e.click()); await p.waitForTimeout(100);
    ok(await p.evaluate(() => /Si eliges esta/.test(document.querySelector('#res').textContent) && /El modelo:/.test(document.querySelector('#res').textContent)), 'apuesta: la opción falsa dice qué le pasaría y el modelo comprueba con cifras'); ok(!(await p.evaluate(() => document.body.classList.contains('tapar'))), 'y las cifras se destapan'); await desborde('tras la apuesta'); await click('#m-sig');
    await (await opciones())[0].evaluate(e => e.click()); await (await opciones())[2].evaluate(e => e.click()); await click('#comprobar'); ok(await p.evaluate(() => document.querySelectorAll('#res li').length === 3 && document.querySelectorAll('.opcion.ok').length === 3), 'encuentra el error: 2 errores sobre 3 frases, acertados y explicados'); await desborde('tras el error'); await click('#m-sig');
    for (let i = 0; i < 4; i++) { await (await opciones())[i % 4].evaluate(e => e.click()); await p.waitForTimeout(80); const r = await p.evaluate(() => document.querySelector('#resultado')?.textContent || ''); console.log(`  caso ${i + 1}: ${r.slice(0, 120)}`); if (i === 1) await p.screenshot({ path: `${OUT}a-${W}-caso.png`, fullPage: true }); await desborde(`caso ${i + 1}`); await click('#m-sig'); }
    ok(await p.evaluate(() => /Lo que te llevas/.test(document.querySelector('#vista-preg').textContent)), 'el caso de 4 pasos se completa'); await p.screenshot({ path: `${OUT}a-${W}-final.png`, fullPage: true });
    ok(err.length === 0, `sin errores de consola${err.length ? ': ' + err.slice(0, 3).join(' | ') : ''}`); await ctx.close();
  }
} finally { await b.close(); try { process.kill(pid); } catch {} }
console.log(fallos ? `\n${fallos} fallo(s)` : '\nTodo en verde'); process.exit(fallos ? 1 : 0);
