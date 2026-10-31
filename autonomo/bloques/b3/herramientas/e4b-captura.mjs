// E4b: capturas a 390 px del panel del neumotórax en el tope y tras la descompresión. Uso: node e4b-captura.mjs <url> <carpeta>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [url, dir] = [process.argv[2] || 'http://localhost:8741/', process.argv[3] || '/tmp/plan-socialista/b3d/capturas-e4b/'];
const b = await chromium.launch(), p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
await p.goto(url); await p.waitForTimeout(1500);
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'pulmonVivo', pulmonVivo: 'neumotorax-tension' }); document.body.append(t); t.click(); t.remove(); });
await p.waitForTimeout(1200);
for (let i = 0; i < 3; i++) await p.evaluate(() => document.querySelector('#pul-neumo [data-nx="pasar"]').click());
await p.waitForTimeout(2500);
await p.evaluate(() => document.getElementById('pul-neumo').scrollIntoView({ block: 'center' })); await p.waitForTimeout(500);
await p.screenshot({ path: dir + 'neumo-panel-tope.png' });
await p.evaluate(() => { document.querySelector('#pul-neumo [data-sitio="correcto"]').click(); document.querySelector('#pul-neumo [data-nx="desc"]').click(); });
await p.waitForTimeout(2500); await p.screenshot({ path: dir + 'neumo-panel-descomprimido.png' });
await b.close();
