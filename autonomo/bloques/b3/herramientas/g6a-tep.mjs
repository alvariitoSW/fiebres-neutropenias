// Prueba corta del estado «tep-lisis» (solo el bloque 5d de autonomo/pruebas/vaso-vivo.mjs, sin el resto): captura a 390 y 360.
// Uso: node g6a-tep.mjs <url-base> <carpeta>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2], OUT = process.argv[3].replace(/\/?$/, '/');
const b = await chromium.launch();
for (const ancho of [390, 360]) {
  const ctx = await b.newContext({ viewport: { width: ancho, height: 844 }, deviceScaleFactor: 2 }), p = await ctx.newPage();
  const err = []; p.on('pageerror', e => err.push(e.message)); p.on('console', m => m.type() === 'error' && !/favicon/.test(m.text()) && err.push(m.text()));
  await p.goto(BASE + 'index.html'); await p.waitForFunction(() => window.__vsoPruebas);
  await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'vasoVivo', vasoVivo: 'tep-lisis' }); document.body.append(t); t.click(); });
  await p.waitForTimeout(700);
  const pul = s => p.evaluate(s => document.querySelector(s).click(), s);
  const des = () => p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  const foto = async n => { await p.evaluate(() => document.getElementById('vso-escena-bloque').scrollIntoView({ block: 'start' })); await p.waitForTimeout(500); await p.screenshot({ path: `${OUT}tep-${n}-${ancho}.png` }); };
  await foto('1-heparina');
  await pul('#vso-m-tto [data-v="lisis"]'); await foto('2-lisis-sola');
  await pul('#vso-m-tto [data-v="ambas"]'); await foto('3-ambas');
  await pul('#vso-m-contra [data-v="sang"]'); await foto('4-contra');
  console.log(ancho, 'desborde', await des(), 'errores', err.length, err.slice(0, 2));
}
await b.close();
