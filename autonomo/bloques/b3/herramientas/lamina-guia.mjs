// Mide dónde queda la escena tras tocar «Guía» (diagnóstico de la lámina). Uso: node lamina-guia.mjs <url> <ancho>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [BASE, W] = [process.argv[2], +process.argv[3] || 390];
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: W, height: 844 }, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); await p.goto(BASE); await p.waitForTimeout(1500);
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'pulmonVivo', pulmonVivo: 'pcv' }); document.body.append(t); t.click(); });
await p.waitForTimeout(1500);
const m = () => p.evaluate(() => { const e = document.getElementById('pul-esc-svg'), r = e.getBoundingClientRect(); return { top: Math.round(r.top), h: Math.round(r.height), vis: !!e.offsetParent, y: Math.round(scrollY), lupa: document.getElementById('pul-lupa').open }; });
console.log('antes', await m()); await p.locator('#btn-guia, #pul-btn-guia').first().tap(); await p.waitForTimeout(250); console.log('250 ms', await m()); await p.waitForTimeout(1500); console.log('1750 ms', await m());
await b.close();
