// Capturas de la eco de compresión del telar (g6b). Uso: node g6b-tvp-capturas.mjs <url-base> <carpeta> [ancho]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [base, dir, ancho = '390'] = process.argv.slice(2);
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: +ancho, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })).newPage();
const err = []; p.on('pageerror', e => err.push(e.message)); p.on('console', m => m.type() === 'error' && err.push(m.text()));
await p.goto(base); await p.waitForFunction(() => window.__telPruebas);
await p.click('#btn-libros'); await p.click('#btn-libro-marino'); await p.click('#lib-pest-vivos'); await p.click('#tel-menu-libros'); await p.waitForTimeout(500);
await p.evaluate(() => { const s = document.getElementById('tel-m-estado'); s.value = 'tvp'; s.dispatchEvent(new Event('change', { bubbles: true })); });
const subir = () => p.evaluate(() => document.getElementById('tel-tablero').scrollIntoView({ block: 'start' }));
const sonda = v => p.evaluate(v => { const s = document.getElementById('tel-eco-slider'); s.disabled = false; s.value = v; s.dispatchEvent(new Event('input', { bubbles: true })); }, v);
await p.waitForTimeout(400); await subir(); await p.screenshot({ path: `${dir}/a-tvp-0-${ancho}.png` });
await sonda(100); await p.waitForTimeout(200); await subir(); await p.screenshot({ path: `${dir}/b-tvp-100-${ancho}.png` });
await p.click('#tel-eco-b-tvp'); await p.click('#tel-eco-b-doppler'); await p.waitForTimeout(200); await subir(); await p.screenshot({ path: `${dir}/c-sana-doppler-${ancho}.png` });
await p.evaluate(() => document.getElementById('tel-eco-mandos').scrollIntoView({ block: 'center' })); await p.screenshot({ path: `${dir}/d-mandos-${ancho}.png` });
console.log('errores', err.length, err.slice(0, 3), 'desborde', await p.evaluate(() => document.documentElement.scrollWidth - innerWidth));
await b.close();
