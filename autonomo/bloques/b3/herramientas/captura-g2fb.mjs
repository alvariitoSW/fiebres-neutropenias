// Capturas a 360 px de capilar (reperfusion con PaO2 100) y shock (posparo 0 h), con las cifras del posparo. Uso: node captura-g2fb.mjs <url> <carpeta>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [BASE, OUT] = process.argv.slice(2);
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 360, height: 800 }, deviceScaleFactor: 2 })).newPage();
await p.goto(BASE + 'index.html'); await p.waitForTimeout(1500);
const abre = (v, k, a) => p.evaluate(([v, k, a]) => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: v, [a]: k }); document.body.append(t); t.click(); t.remove(); }, [v, k, a]);
await abre('capilarVivo', 'reperfusion', 'capilarVivo'); await p.waitForTimeout(1500);
await p.evaluate(() => { const r = document.querySelector('#cpv-m-pao2'); r.value = 100; r.dispatchEvent(new Event('input', { bubbles: true })); });
await p.waitForTimeout(800); await p.evaluate(() => document.getElementById('cpv-lamina').scrollIntoView()); await p.waitForTimeout(400);
await p.screenshot({ path: OUT + 'capilar-360.png' });
await abre('shockVivo', 'posparo', 'shockVivo'); await p.waitForTimeout(2500);
await p.screenshot({ path: OUT + 'shock-360.png' });
console.log(await p.evaluate(() => document.querySelector('.tope-aviso')?.textContent));
await b.close();
