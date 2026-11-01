// Captura solo el dibujo del eje vivo (escena de arriba) a 390 px, para revisar la silueta y las lupas. Uso: node eje-silueta.mjs <url-base> <salida.png> [paciente]
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [base, out, pac = 'lucrecia'] = process.argv.slice(2);
const b = await chromium.launch(); const p = await (await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 })).newPage();
await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(900);
await p.evaluate((c) => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'ejeVivo', ejeVivo: c }); document.body.appendChild(t); t.click(); }, pac); await p.waitForTimeout(900);
await (await p.$('#eje-svg')).screenshot({ path: out }); await b.close();
