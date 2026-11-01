// Barrido de la nefrona viva con `rabdo` (sin y con salino) frente a nta y prerrenal. Imprime lo que se ve.
// Uso: node 4b-rabdo.mjs <url-base>   (servidor en esa url)
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8000/').replace(/\/?$/, '/');
const errores = [], fallos = [];
const b = await chromium.launch();
for (const ancho of [390, 360]) {
  const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: ancho, height: 800 } });
  const p = await ctx.newPage();
  p.on('console', m => m.type() === 'error' && errores.push(m.text())); p.on('pageerror', e => errores.push('pageerror ' + e.message));
  await p.goto(BASE + 'index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(1000);
  console.log(`\n===== ${ancho} px =====`);
  const ver = async (t) => {
    const r = await p.evaluate(() => {
      const q = s => document.querySelector(s);
      const med = [...document.querySelectorAll('#nv-medidores .nv-medidor')].map(m => m.querySelector('.nv-medidor-nombre span').textContent + ': ' + m.querySelector('.nv-medidor-valor').textContent.trim());
      const bt = q('#nv-rabdo-volumen');
      return { med, boton: bt && !bt.hidden ? bt.textContent : null, avisos: [...document.querySelectorAll('#nv-avisos .tfg-estado')].map(x => x.textContent.slice(0, 70)),
        desb: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    });
    console.log(`-- ${t}\n   ${r.med.join(' | ')}\n   botón: ${r.boton}\n   avisos: ${r.avisos.length}`);
    if (r.desb > 0) fallos.push(`${ancho} desborde ${r.desb} en ${t}`);
  };
  for (const id of ['prerrenal', 'nta', 'rabdo']) {
    await p.evaluate(id => document.querySelector(`[data-nefrona-viva="${id}"]`).click(), id);
    await p.waitForTimeout(500); await ver(id);
  }
  await p.evaluate(() => document.getElementById('nv-rabdo-volumen').click()); await p.waitForTimeout(400); await ver('rabdo + salino');
  await p.evaluate(() => document.getElementById('nv-rabdo-volumen').click()); await p.waitForTimeout(300); await ver('rabdo, salino quitado');
  const enl = await p.evaluate(() => !!document.querySelector('#mr-fra-nefrotoxicos [data-nefrona-viva="rabdo"]'));
  console.log('enlace en la ficha:', enl); if (!enl) fallos.push('sin enlace');
  await ctx.close();
}
await b.close();
console.log('\nerrores de consola:', errores.length, errores.slice(0, 3)); console.log('fallos:', fallos.length, fallos);
process.exit(errores.length || fallos.length ? 1 : 0);
