// Prueba de navegador del mecanismo prioritario y la revisión por objetivos del simulador de hiperpotasemia
// (juez de autonomo/jueces.mjs --modelo potasio-prioritario).
// Uso: node autonomo/pruebas/potasio-prioritario.mjs <url-base> [--capturas <carpeta>]
// A 390 y 360 px: abre la vista Visual de Hiperpotasemia; calcio, insulina y diálisis (cada uno con su mensaje);
// una medida que no trata lo prioritario; corre el reloj ×4 hasta las 12 h y comprueba la revisión con los tres
// objetivos; y una segunda sesión solo con insulina (falta la salida). Mide el desborde tras cada paso.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const args = process.argv.slice(2);
const BASE = (args.find(a => /^https?:/.test(a)) || 'http://localhost:8000/').replace(/\/?$/, '/');
const CAPTURAS = args.includes('--capturas') ? args[args.indexOf('--capturas') + 1].replace(/\/?$/, '/') : null;
const b = await chromium.launch();
let fallos = 0;

for (const ANCHO of [390, 360]) {
  console.log(`\n── ${ANCHO} px`);
  const ctx = await b.newContext({ viewport: { width: ANCHO, height: 844 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const errores = [];
  p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errores.push(m.text()); });
  p.on('pageerror', e => errores.push('PAGE ' + e.message));
  const ok = (c, t) => { console.log(`${c ? '✅' : '❌'} ${t}`); if (!c) fallos++; };
  const desborde = () => p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  const clic = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no hay ' + s); e.click(); }, sel);
  const txt = sel => p.evaluate(s => document.querySelector(s)?.innerText || '', sel);
  const foto = async (n, sel) => { if (!CAPTURAS) return; await p.evaluate(s => document.querySelector(s)?.scrollIntoView({ block: 'center' }), sel); await p.waitForTimeout(200); await p.screenshot({ path: `${CAPTURAS}potasio-${n}-${ANCHO}.png` }); };

  await p.goto(BASE + 'index.html'); await p.waitForTimeout(1500);
  await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'nefrologia', view: 'nefrona', panel: 'panel-fisio-tabs', tab: 'fisio-hiperpotasemia' }); document.body.append(t); t.click(); t.remove(); });
  await p.waitForTimeout(900);
  await clic('#fisio-hiperpotasemia[data-visual] > .vista-toggle button[data-vista="visual"], #fisio-hiperpotasemia [data-visual] > .vista-toggle button[data-vista="visual"]'); await p.waitForTimeout(800);
  ok(await p.evaluate(() => !!document.getElementById('hk-dar-calcio')?.offsetParent), 'la vista Visual de Hiperpotasemia se abre');
  const sesion = async (causa, dar) => {
    await p.selectOption('#hk-causa', causa); await p.waitForTimeout(300);
    ok(await txt('#hk-revision') === '', 'la revisión no sale antes de acabar el reloj');
    for (const id of dar) { await clic(`#hk-dar-${id}`); await p.waitForTimeout(250); ok(await desborde() <= 0, `sin desborde tras dar ${id}`); }
  };
  const correr = async () => {
    await clic('#hk-rapido'); await clic('#hk-play');
    await p.waitForFunction(() => document.getElementById('hk-revision')?.innerText.length > 0, null, { timeout: 150000 });
    await p.waitForTimeout(300);
  };

  // Sesión A: calcio → insulina → diálisis
  await sesion('acidosis', ['calcio', 'insulina', 'dialisis']);
  const ca = await txt('#hk-efecto-calcio'), ins = await txt('#hk-efecto-insulina'), dia = await txt('#hk-efecto-dialisis');
  ok(/protege la membrana; el K⁺ no baja/.test(ca) && /lo prioritario/i.test(ca), 'calcio: «protege la membrana; el K⁺ no baja» y es lo prioritario');
  ok(/mete el K⁺ en la célula, por un tiempo/.test(ins), 'insulina: «mete el K⁺ en la célula, por un tiempo»');
  ok(/saca el K⁺ del cuerpo/.test(dia), 'diálisis: «saca el K⁺ del cuerpo»');
  ok(await p.evaluate(() => ['calcio', 'insulina', 'dialisis'].every(f => document.querySelector(`#hk-efecto-${f} [data-ver^="hk-tto-"]`) && document.getElementById(document.querySelector(`#hk-efecto-${f} [data-ver]`).dataset.ver.split(',')[0]))), 'cada mensaje lleva su «Texto ↓» a una fila que existe');
  await foto('01-mensajes', '#hk-efecto-insulina');
  await correr(); await foto('02-revision', '#hk-revision');
  const rev = await txt('#hk-revision');
  ok(['ECG protegido', 'K⁺ por debajo de 5', 'Salida iniciada'].every(o => rev.includes(o)), 'la revisión muestra los tres objetivos');
  ok(/✓ Cumplido · ECG protegido/.test(rev) && /✓ Cumplido · Salida iniciada/.test(rev), 'ECG protegido y salida iniciada: cumplidos');
  ok(/(✓ Cumplido|✗ Falta) · K⁺ por debajo de 5/.test(rev) && !/\d{2,}\.\d/.test(rev), 'K⁺ por debajo de 5 tiene veredicto y la revisión no lleva nota numérica');
  ok(await p.evaluate(() => [...document.querySelectorAll('#hk-revision [data-ver]')].every(e => document.getElementById(e.dataset.ver.split(',')[0]))), 'los «Texto ↓» de la revisión llegan a un párrafo que existe');
  ok(await desborde() <= 0, 'sin desborde tras la revisión');

  // Una medida que no trata lo prioritario: ya en zona, calcio sin cambios en el ECG
  await p.selectOption('#hk-causa', 'aporte'); await p.waitForTimeout(300);
  await clic('#hk-dar-calcio'); await p.waitForTimeout(250);
  ok(/no trata el mecanismo prioritario/.test(await txt('#hk-efecto-calcio')) && /No cambia nada/.test(await txt('#hk-efecto-calcio')), 'calcio con el ECG sin cambios: «no trata el mecanismo prioritario… no cambia nada»');
  await clic('#hk-dar-insulina'); await p.waitForTimeout(250);
  ok(/no trata el mecanismo prioritario/.test(await txt('#hk-efecto-insulina')), 'insulina con el K⁺ por debajo de 5: «no trata el mecanismo prioritario»');
  ok(await desborde() <= 0, 'sin desborde con los mensajes de «no trata»');

  // Sesión B: solo insulina → falta la salida
  await clic('#hk-reiniciar'); await p.waitForTimeout(300);
  ok(await txt('#hk-efecto-insulina') === '', 'reiniciar borra los mensajes');
  await sesion('renal-grave', ['insulina']);
  ok(/Antes, protege la membrana con calcio|Falta sacarlo del cuerpo/.test(await txt('#hk-efecto-insulina')), 'insulina sola: avisa de lo que falta');
  await correr();
  const rev2 = await txt('#hk-revision');
  ok(/✗ Falta · Salida iniciada/.test(rev2) && /✗ Falta · ECG protegido/.test(rev2), 'solo insulina: faltan ECG protegido y salida iniciada');
  ok(await desborde() <= 0, 'sin desborde tras la revisión (sesión B)');
  // Sesión C: solo calcio → el efecto se acaba y el ECG sigue alterado
  await clic('#hk-revision [data-empezar]'); await p.waitForTimeout(300);
  await sesion('renal-grave', ['calcio']);
  await correr();
  const rev3 = await txt('#hk-revision');
  ok(/✗ Falta · ECG protegido/.test(rev3) && /30-60 min \(tabla\)/.test(rev3), 'solo calcio: «✗ Falta · ECG protegido» con la duración de la tabla');
  ok(/✗ Falta · K⁺ por debajo de 5/.test(rev3) && !/vuelve al plasma/.test(rev3), 'solo calcio: el K⁺ falta y no habla de lo que «se mete y vuelve»');
  ok(await desborde() <= 0, 'sin desborde tras la revisión (sesión C)');
  await clic('#hk-revision [data-empezar]'); await p.waitForTimeout(300);
  ok(await txt('#hk-revision') === '' && await txt('#hk-reloj') !== '', '«Empezar de nuevo» reinicia el simulador');
  ok(errores.length === 0, 'sin errores de consola' + (errores.length ? ': ' + [...new Set(errores)].join(' | ') : ''));
  await ctx.close();
}
await b.close();
console.log(fallos ? `\n❌ ${fallos} fallo(s)` : '\n✅ Todo en verde');
process.exit(fallos ? 1 : 0);
