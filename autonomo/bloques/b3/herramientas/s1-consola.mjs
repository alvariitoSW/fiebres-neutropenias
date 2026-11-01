import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 390, height: 844 } });
p.on('console', m => m.type() === 'error' && console.log('ERR', m.text())); p.on('pageerror', e => console.log('PAGE', e.message));
await p.goto(process.argv[2] || 'http://localhost:8731/'); await p.waitForTimeout(2500);
await p.evaluate((K) => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'pulmonVivo', pulmonVivo: K }); document.body.append(t); t.click(); t.remove(); }, process.argv[3] || 'hfno');
await p.waitForTimeout(2000); console.log(await p.evaluate(() => typeof window.__pulPruebas), await p.evaluate(() => document.querySelector('#pul-frase-txt')?.textContent), await p.evaluate(() => document.querySelector('[data-resp=int]')?.textContent)); await b.close();
