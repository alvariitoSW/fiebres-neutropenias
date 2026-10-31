// Capturas del neumotórax a 390 px: shock (10,5) y parada (20). Uso: node b3d-captura-neumo.mjs http://localhost:PUERTO/ /carpeta/
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8000/').replace(/\/?$/, '/'), OUT = (process.argv[3] || '/tmp').replace(/\/?$/, '/');
const b = await chromium.launch(); const p = await (await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 } })).newPage();
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'pulmonVivo', pulmonVivo: 'neumotorax-tension' }); document.body.append(t); t.click(); t.remove(); });
await p.waitForTimeout(1500);
const ptx = () => p.evaluate(() => parseFloat(document.querySelector('[data-fila="neumo-p"] .v').textContent.replace(',', '.')));
const paso = async () => { await p.evaluate(() => document.querySelector('[data-nx="pasar"]').click()); await p.waitForTimeout(2200); await p.evaluate(() => window.__pulPruebas?.().llenar?.()); await p.waitForTimeout(600); };
const foto = async (n) => { await p.evaluate(() => document.querySelector('[data-fila="cor-pam"]').scrollIntoView({ block: 'center' })); await p.waitForTimeout(400); await p.screenshot({ path: OUT + n }); };
while ((await ptx()) < 10.5) await paso();
await foto('shock-390.png'); console.log('shock', await ptx());
while ((await ptx()) < 20) await paso();
await p.waitForTimeout(3500); await foto('parada-390.png'); console.log('parada', await ptx(), await p.evaluate(() => document.querySelector('#pul-frase-txt')?.textContent.slice(0, 200)));
await b.close();
