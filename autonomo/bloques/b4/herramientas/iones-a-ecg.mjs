// Captura el ECG del ritmo vivo con K⁺ alto (Valentín) y con calcio puesto. Uso: node iones-a-ecg.mjs <puerto en marcha>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(), p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await p.goto(`http://127.0.0.1:${process.argv[2] || 8101}/autonomo/maquetas/b4-iones-a.html`); await p.waitForTimeout(600);
const c = s => p.evaluate(s => document.querySelector(s).click(), s);
await c('[data-pest="tiempo"]'); await c('[data-pac="valentin"]'); await p.waitForTimeout(1500);
await c('[data-pest="calcio"]'); await p.evaluate(() => scrollTo(0, 120)); await p.screenshot({ path: '/tmp/plan-socialista/b4/capturas-a/a-390-ecg-hiperk.png' });
await c('[data-ca]'); await p.waitForTimeout(1500); await p.screenshot({ path: '/tmp/plan-socialista/b4/capturas-a/a-390-ecg-calcio.png' });
console.log(await p.evaluate(() => document.querySelector('#frase').textContent)); await b.close();
