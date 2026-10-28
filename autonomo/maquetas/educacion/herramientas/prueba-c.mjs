// Prueba de la maqueta C: recorre las 6 pantallas a 390 y 360 px. Uso: PUERTO=8013 node prueba-c.mjs [carpeta de capturas]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
const PUERTO = process.env.PUERTO || '8013';
const OUT = process.argv[2] || '/tmp/plan-socialista/educacion-pionera/c';
mkdirSync(OUT, { recursive: true });
const URL = `http://localhost:${PUERTO}/autonomo/maquetas/educacion/c-entrelazado-rio.html`;
let fallos = 0;
const ok = (c, m) => { if (!c) { fallos++; console.log('  FALLA:', m); } };

async function recorre(ancho) {
  console.log('== ancho', ancho);
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: ancho, height: 844 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const errores = [];
  p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  p.on('pageerror', e => errores.push(String(e)));
  const desborde = async (donde) => {
    const d = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
    ok(d.sw <= d.iw, `desborde horizontal en ${donde}: ${d.sw} > ${d.iw}`);
  };
  const foto = async n => { if (ancho === 390) await p.screenshot({ path: `${OUT}/${n}.png` }); };
  const clic = async (sel, n = 0) => {
    const l = /^\.c-(op|frase)/.test(sel) ? p.locator('.c-preg').last().locator(sel) : p.locator(sel.replace('.c-b.c-prim:', '.c-b.c-prim:visible:').replace('.c-b.c-sec:', '.c-b.c-sec:visible:'));
    await l.nth(n).click(); await p.waitForTimeout(120);
  };
  const txt = async sel => (await p.locator(sel).first().innerText()).replace(/\s+/g, ' ');

  await p.goto(URL); await p.waitForTimeout(500);
  // Pantalla 1: repaso
  ok((await txt('#c-nummero')).includes('repaso 1/5'), 'contador 1/5');
  ok((await txt('.c-chip')).includes('Fallada hace 2 días'), 'chip 1');
  ok((await txt('#c-rep-n')) === '1', 'rótulo repaso: pregunta 1 de 5');
  await foto('p1-pregunta'); await desborde('p1 pregunta 1');
  await clic('.c-frase', 2); await clic('.c-frase', 4); await clic('.c-b.c-prim:has-text("Comprobar")');
  ok((await txt('.c-vuelve')).includes('Vuelve en 3 días'), 'repaso 1 acertado vuelve en 3 días');
  await foto('p1-tras-error'); await desborde('p1 tras error');
  ok(await p.locator('.c-preg').last().locator('.c-fch[data-resaltar]').count() >= 1, 'Ver en la ficha junto a cada fuente');
  await clic('.c-b.c-prim:has-text("Siguiente pregunta")');
  ok((await txt('.c-chip')).includes('Fallada hace 1 día'), 'chip 2');
  ok((await txt('#c-rep-n')) === '2', 'rótulo repaso: pregunta 2 de 5');
  await clic('.c-b.c-prim:has-text("Ya lo pensé")'); await clic('.c-op', 0); ok((await txt('.c-vuelve')).includes('Vuelve en 3 días'), 'repaso 2'); await desborde('p1 q2');
  await clic('.c-b.c-prim:has-text("Siguiente pregunta")');
  ok((await txt('.c-chip')).includes('Acertada hace 8 días · tocaba a los 7'), 'chip 3');
  await clic('.c-b.c-prim:has-text("Ya lo pensé")'); await clic('.c-op', 1); ok((await txt('.c-vuelve')).includes('Vuelve en 14 días'), 'repaso 3 -> 14 días');
  await clic('.c-b.c-prim:has-text("Siguiente pregunta")');
  ok((await txt('.c-chip')).includes('A medias hace 4 días · tocaba a los 3'), 'chip 4');
  ok((await txt('.c-enun')).includes('(son tres cosas)'), 'enunciado destapa');
  await clic('.c-b.c-prim:has-text("Ya lo pensé: destapar")');
  await p.locator('.c-punto input').nth(0).check(); await p.locator('.c-punto input').nth(1).check(); await p.locator('.c-punto input').nth(2).check();
  await foto('p1-destapa'); await clic('.c-b.c-prim:has-text("Listo")');
  ok((await txt('.c-vuelve')).includes('Vuelve en 3 días'), 'repaso 4 -> 3 días');
  await desborde('p1 q4');
  await clic('.c-b.c-prim:has-text("Siguiente pregunta")');
  await clic('.c-b.c-prim:has-text("Ya lo pensé")'); await clic('.c-op', 2); ok((await txt('.c-vuelve')).includes('Vuelve en 7 días'), 'repaso 5 -> 7 días');
  await clic('.c-b.c-prim:has-text("Terminar el repaso")');
  ok((await txt('.c-final')).includes('Repaso hecho. Ahora, Teresa.'), 'final repaso');
  await foto('p1-final'); await desborde('p1 final');
  await clic('.c-b.c-prim:has-text("Ir a Teresa")');
  // Pantalla 2
  await p.waitForTimeout(500);
  ok((await txt('#agv-lectura')).includes('?'), 'Hto tapado antes de contestar');
  ok((await txt('.c-paciente')).includes('FC 112'.replace('FC ', 'FC')) || (await txt('.c-paciente')).includes('112'), 'ficha de Teresa');
  ok(await p.locator('#agv-anillo').isVisible(), 'anillo herida');
  ok((await p.evaluate(() => document.getElementById('agv-lienzo').width)) > 0, 'lienzo medido');
  await foto('p2-escena'); await desborde('p2');
  await clic('.c-b.c-prim:has-text("Ya lo pensé")'); await clic('.c-op', 1);
  ok(/45\s*%/.test(await txt('#agv-lectura')), 'Hto 45 % tras contestar');
  await foto('p2-contestada'); await desborde('p2 contestada');
  await clic('.c-b.c-prim:has-text("Siguiente: cuánto")');
  // Pantalla 3
  await clic('#c-calc-b'); ok((await txt('#c-calc')).includes('× 3'), 'calculadora sin resultado'); ok(!(await txt('#c-calc')).includes('1.296'), 'calculadora no da el resultado');
  await clic('.c-b.c-prim:has-text("Ya lo pensé")'); await clic('.c-op', 2);
  await foto('p3-p2'); await desborde('p3 p2');
  await p.waitForTimeout(300);
  ok((await txt('#agv-tot-rio')).includes('?'), 'mareógrafos tapados');
  await clic('.c-b.c-prim:has-text("Ya lo pensé")'); await clic('.c-op', 0);
  await desborde('p3 p3 elegida');
  await foto('p3-antes-de-infundir');
  await clic('.c-b.c-prim:has-text("Compruébalo")'); await p.waitForTimeout(2500);
  const dl = await p.evaluate(() => ['rio', 'marisma', 'mar'].map(c => document.getElementById('agv-dl-' + c).textContent));
  console.log('  mareas tras 2 L:', dl.join(' | '));
  ok(/150/.test(dl[0]) && /1\.650/.test(dl[1]) && /200/.test(dl[2]), 'río +150 neto, marisma +1.650, mar −200');
  ok((await txt('.c-conf')).includes('+550'), 'confirmación +550');
  await foto('p3-infundido'); await desborde('p3 infundido');
  await clic('.c-b.c-prim:has-text("Siguiente: el giro")');
  // Pantalla 4
  await p.waitForTimeout(600);
  ok((await txt('#agv-lectura')).includes('?'), 'P4: Hto tapado antes de apostar');
  ok(await p.locator('.c-apuesta .c-op').count() === 3, 'P4: apuesta con 3 opciones');
  await foto('p4-apuesta'); await p.locator('.c-apuesta .c-op').nth(2).click(); await p.waitForTimeout(500);
  ok((await txt('.c-apu')).includes('Tu apuesta') && (await txt('.c-apu')).includes('Lo que pasó'), 'P4: Tu apuesta | Lo que pasó');
  const l4 = await txt('#agv-lectura'); ok(/38\s*%/.test(l4), 'Hto 38 % en la lectura: ' + l4);
  const dd = await txt('.c-paciente'); ok(dd.includes('140/116/18') && dd.includes('7,31') && dd.includes('1,6') && dd.includes('112/68'), 'datos pantalla 4 (FC y PA como al llegar)');
  await foto('p4-escena'); await desborde('p4');
  await clic('.c-b.c-prim:has-text("Ya lo pensé: destapar")');
  for (let i = 0; i < 3; i++) await p.locator('.c-punto input').nth(i).check();
  await clic('.c-b.c-prim:has-text("Listo")'); await foto('p4-destapa'); await desborde('p4 destapada');
  await clic('.c-b.c-prim:has-text("Siguiente: el plan")');
  // Pantalla 5
  await clic('.c-frase', 0); await clic('.c-frase', 2); await clic('.c-b.c-prim:has-text("Comprobar")');
  ok(await p.locator('.c-b.c-sec:has-text("Piensa la frase correcta")').count() === 2, 'dos correcciones por pensar');
  await desborde('p5 comprobada'); await foto('p5-comprobada');
  await clic('.c-b.c-sec:has-text("Piensa la frase correcta")'); await clic('.c-b.c-sec:has-text("Piensa la frase correcta")');
  await desborde('p5 correcciones'); await clic('.c-b.c-prim:has-text("Pasar al día 2")'); await p.waitForTimeout(600);
  ok((await txt('#agv-lectura')).includes('?'), 'P6: Hto tapado antes de apostar');
  ok((await txt('.c-dia')).includes('Endoscopia'), 'datos del día 2');
  await p.locator('.c-dia .c-apuesta .c-op').nth(2).click(); await p.waitForTimeout(500);
  const l6 = await txt('#agv-lectura'); ok(/31\s*%/.test(l6), 'Hto 31 % el día 2: ' + l6);
  ok((await txt('.c-dia .c-apu')).includes('Lo que pasó'), 'P6: Tu apuesta | Lo que pasó');
  await clic('.c-dia .c-b.c-prim:has-text("Ya lo pensé")'); await clic('.c-dia .c-op', 1);
  await foto('p5-dia2'); await desborde('p5 día 2');
  await clic('.c-b.c-prim:has-text("Siguiente: lo que te llevas")');
  // Pantalla 6
  ok(await p.locator('#agv-raiz').isHidden(), 'sin escena en la pantalla 6');
  ok(await p.locator('.c-lleva li').count() === 3, 'tres cosas que te llevas');
  const filas = await p.locator('.c-tabla tbody tr').count(); ok(filas === 11, 'tabla con 11 filas: ' + filas);
  const tabla = await txt('.c-tabla'); ok(tabla.includes('05/11/2026') === false || tabla.includes('Fallada') , 'tabla coherente');
  ok(tabla.includes('18/11/2026'), 'rf-g5 acertada vuelve el 18/11/2026');
  ok((await p.locator('#pie-comun a').count()) === 3 && (await p.locator('#pie-comun a.c-aqui').innerText()).includes('estás aquí'), 'pie común A·B·C');
  await foto('p6-tabla'); await desborde('p6');
  await p.locator('#pie-comun').scrollIntoViewIfNeeded(); await foto('p6-pie');
  ok(await p.evaluate(() => localStorage.length + sessionStorage.length) === 0, 'nada guardado');
  ok(errores.length === 0, 'errores de consola: ' + errores.join(' || '));
  // Camino de fallo: primero la consecuencia en el río, después «Por qué»
  await p.goto(URL); await p.waitForTimeout(400);
  await p.evaluate(() => window.__c.ir(2)); await p.waitForTimeout(500);
  const rio0 = await p.evaluate(() => document.getElementById('agv-dl-rio').textContent);
  await clic('.c-b.c-prim:has-text("Ya lo pensé")'); await clic('.c-op', 0);
  await p.waitForTimeout(900);
  ok(await p.locator('.c-cons').first().isVisible() && (await txt('.c-cons')).includes('Teresa'), 'fallo: consecuencia visible');
  ok(await p.locator('.c-expl').first().isHidden(), 'fallo: el porqué aún no');
  ok(await p.locator('.c-porque:visible').count() === 0, 'fallo: ningún porqué de opción visible aún');
  const rio1 = await p.evaluate(() => document.getElementById('agv-dl-rio').textContent);
  ok(rio1 !== rio0, `fallo: el río cambia (${rio0} -> ${rio1})`);
  await foto('fallo-consecuencia'); await desborde('fallo consecuencia');
  await clic('.c-b.c-prim:has-text("Por qué")');
  ok(await p.locator('.c-expl').first().isVisible() && await p.locator('.c-porque:visible').count() >= 1, 'fallo: tras «Por qué» salen los porqués');
  await foto('fallo-porque'); await desborde('fallo porque');
  ok(errores.length === 0, 'errores de consola (fallo): ' + errores.join(' || '));
  await b.close();
}
for (const a of [390, 360]) await recorre(a);
console.log(fallos ? `RESULTADO: ${fallos} fallos` : 'RESULTADO: todo en verde');
process.exit(fallos ? 1 : 0);
