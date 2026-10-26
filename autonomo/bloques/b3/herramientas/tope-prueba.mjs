// Prueba de autonomo/maquetas/comun/tope.js · servidor en la raíz del repo (puerto 8791): node tope-prueba.mjs
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const fallos = [], errores = []; const ok = (c, m) => { if (!c) fallos.push(m); };
const b = await chromium.launch();
for (const w of [390, 360]) {
  const p = await (await b.newContext({ ...devices['iPhone 12'], viewport: { width: w, height: 844 } })).newPage();
  p.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); }); p.on('pageerror', (e) => errores.push(e.message));
  await p.goto('http://127.0.0.1:8791/autonomo/bloques/b3/herramientas/tope-prueba.html'); await p.waitForTimeout(500);
  const off = () => p.evaluate(() => [...document.querySelectorAll('[data-vol]')].map((e) => e.disabled));
  const desb = () => p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  await p.evaluate(() => tope.poner('hta', { nivel: 'aviso', titulo: 'Cerca del tope', texto: 'Una PAM de 140 mmHg supera lo que describe la ficha y puede ser una combinación que no ocurre en un paciente vivo, así que revisa los mandos.', origen: 'ficha · p. 45', cita: { sitio: 'p. 45' } }));
  ok((await p.locator('.tope-aviso').count()) === 1 && (await p.locator('.tope-linea span').count()) === 1, 'aviso y línea');
  ok((await off()).every((x) => !x), 'el aviso no apaga'); ok((await desb()) <= 0, `desborde aviso ${w}`);
  await p.evaluate(() => tope.poner('vol', { nivel: 'sello', titulo: 'Sobrecarga de volumen', texto: 'PVC por encima de 12 mmHg: más líquido no sube el gasto.', origen: 'fisiología general', deshabilita: ['[data-vol]'] }));
  ok((await off()).every(Boolean), 'sello apaga'); ok((await p.locator('.tope-sello').count()) === 1, 'sello visible'); ok((await desb()) <= 0, `desborde sello ${w}`);
  ok((await p.evaluate(() => tope.activos().length)) === 2, 'activos 2');
  if (w === 390) await p.screenshot({ path: '/tmp/claude-0/tope-390.png' });
  await p.evaluate(() => { tope.quitar('vol'); tope.quitar('hta'); tope.quitar('nada'); });
  ok((await off()).every((x) => !x), 'se vuelven a encender'); ok((await p.locator('[data-tope]').count()) === 0, 'todo quitado');
}
await b.close();
console.log('errores de consola', errores.length, errores.slice(0, 2)); console.log(fallos.length ? 'FALLOS\n' + fallos.join('\n') : 'tope-prueba OK');
process.exit(fallos.length || errores.length ? 1 : 0);
