// Capturas del shock vivo con Ramiro en las tres etapas. Uso: node g4-etapas-captura.mjs <url-base> <carpeta>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [BASE, OUT] = [process.argv[2].replace(/\/?$/, '/'), process.argv[3]];
const b = await chromium.launch();
for (const W of [390, 360]) {
  const p = await (await b.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 2 })).newPage();
  await p.goto(BASE); await p.waitForTimeout(2500);
  for (const k of ['ic-etapa-1', 'ic-etapa-2', 'ic-etapa-3']) {
    await p.evaluate(k => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'shockVivo', shockVivo: k }); document.body.append(t); t.click(); t.remove(); }, k);
    await p.waitForTimeout(2200);
    await p.screenshot({ path: `${OUT}/ic-${k.slice(-1)}-${W}.png` });
  }
}
await b.close();
