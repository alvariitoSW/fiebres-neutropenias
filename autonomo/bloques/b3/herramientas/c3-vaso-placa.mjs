// Capturas del vaso vivo (placa) a 390 y 360 px: antiagregantes y trombólisis con el reloj en varias horas. Uso: node c3-vaso-placa.mjs http://localhost:PUERTO/ carpeta
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2].replace(/\/?$/, '/'), CAP = process.argv[3].replace(/\/?$/, '/');
const b = await chromium.launch();
for (const W of [390, 360]) {
  const p = await (await b.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })).newPage();
  await p.goto(BASE + 'index.html'); await p.waitForFunction(() => window.__vsoPruebas);
  const abrir = k => p.evaluate(k => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'vasoVivo', vasoVivo: k }); document.body.append(t); t.click(); t.remove(); }, k);
  for (const k of ['placa-antiagregantes', 'trombolisis']) {
    await abrir(k); await p.waitForTimeout(700);
    await p.evaluate(() => document.getElementById('vso-escena-bloque').scrollIntoView({ block: 'start' }));
    await p.waitForTimeout(300);
    const el = await p.$('#vso-escena-bloque'); await el.screenshot({ path: `${CAP}c3-${k}-${W}.png` });
  }
}
await b.close();
