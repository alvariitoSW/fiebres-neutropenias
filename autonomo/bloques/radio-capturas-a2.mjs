// Capturas de arreglos-2 de radio-real: Marshall (tira), tubo tras comprobar, disección destapada. Uso: node radio-capturas-a2.mjs <url> <carpeta>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2], OUT = process.argv[3];
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })).newPage();
await p.goto(BASE); await p.waitForSelector('#radio-f6-ejercicios', { state: 'attached' });
const ir = async (view, panel, tab) => { await p.evaluate(([v, pa, t]) => { const x = document.createElement('button'); x.dataset.especialidad = 'pifRadio'; x.dataset.view = v; x.dataset.panel = pa; x.dataset.tab = t; document.body.appendChild(x); x.click(); x.remove(); }, [view, panel, tab]); await p.waitForTimeout(500); };
const shot = async (id, f) => { await p.locator(`#rl-${id}`).scrollIntoViewIfNeeded(); await p.locator(`#rl-${id}`).screenshot({ path: `${OUT}/${f}.png` }); };
await ir('neuro', 'panel-pif-radio-neuro-tabs', 'radio-n4');
await p.locator('#rl-neuro-marshall-img').scrollIntoViewIfNeeded(); const bb = await p.locator('#rl-neuro-marshall-img').boundingBox();
await p.touchscreen.tap(bb.x + bb.width * .09, bb.y + bb.height * .5); await p.waitForTimeout(200); await shot('neuro-marshall', 'marshall');
await ir('placa', 'panel-pif-radio-tabs', 'radio-f6');
await p.locator('#rl-tubo-img').scrollIntoViewIfNeeded(); const t = await p.locator('#rl-tubo-img').boundingBox(); await p.touchscreen.tap(t.x + t.width * .5, t.y + t.height * .5);
await p.locator('#rl-tubo-ops button').first().tap(); await p.locator('#rl-tubo-comprobar').tap(); await p.waitForTimeout(200); await shot('tubo', 'tubo');
await ir('torax', 'panel-pif-radio-torax-tabs', 'radio-t3');
await p.locator('#rl-tx-diseccion-destapar').scrollIntoViewIfNeeded(); await p.locator('#rl-tx-diseccion-destapar').tap(); await p.waitForTimeout(200); await shot('tx-diseccion', 'diseccion');
await b.close();
