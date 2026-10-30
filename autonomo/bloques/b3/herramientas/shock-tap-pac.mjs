// Diagnóstico: ¿qué recibe el toque del botón de paciente del shock vivo? (uso: node shock-tap-pac.mjs PUERTO estado)
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [,, puerto = '8000', estado = 'tapon'] = process.argv;
const nav = await chromium.launch(); const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
const pag = await ctx.newPage(); await pag.goto(`http://localhost:${puerto}/`); await pag.waitForTimeout(1500);
await pag.evaluate(e => { const b = document.createElement('button'); b.dataset.especialidad = 'libros'; b.dataset.view = 'shockVivo'; b.dataset.shockVivo = e; document.body.appendChild(b); b.click(); b.remove(); }, estado);
await pag.waitForTimeout(1300);
const med = () => pag.evaluate(() => { const b = document.querySelector('#shv-raiz [data-pac]'); const r = b.getBoundingClientRect(); const cx = r.x + r.width / 2, cy = r.y + r.height / 2; const el = document.elementFromPoint(cx, cy); return { r: [r.x, r.y, r.width, r.height].map(Math.round), top: el && (el.tagName + '#' + el.id + '.' + el.className), esBoton: el === b || b.contains(el), sc: scrollY, pacScroll: document.querySelector('[data-pac]').parentElement.scrollLeft, innerH: innerHeight }; });
for (let i = 0; i < 4; i++) { console.log(JSON.stringify(await med())); await pag.waitForTimeout(300); }
try { await pag.locator('#shv-raiz [data-pac]').first().tap({ timeout: 2500 }); console.log('tap ok'); } catch (e) { console.log('TAP FALLA', String(e.message).slice(-300)); }
console.log(JSON.stringify(await med()));
await nav.close();
