// ¿Sigue a la vista el dibujo del eje vivo al tocar un paciente? Mide cuánto del svg se ve sobre el dock tras tocar. Uso: node eje-figura.mjs <url-base> [ancho]
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [base, w = '390'] = process.argv.slice(2);
const b = await chromium.launch(); const p = await (await b.newContext({ ...devices['iPhone 12'], viewport: { width: +w, height: 844 }, hasTouch: true })).newPage();
await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(900);
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'ejeVivo', ejeVivo: 'toribio' }); document.body.appendChild(t); t.click(); }); await p.waitForTimeout(800);
for (const c of ['toribio', 'lucrecia', 'toribio']) {
  await p.locator(`#eje-chips [data-pre="${c}"]`).tap(); await p.waitForTimeout(300);
  console.log(c, await p.evaluate(() => { const r = document.getElementById('eje-svg').getBoundingClientRect(), d = document.getElementById('eje-dock').getBoundingClientRect(); const v = Math.max(0, Math.min(r.bottom, d.top) - Math.max(r.top, 0)); return { top: Math.round(r.top), bottom: Math.round(r.bottom), dockTop: Math.round(d.top), ve: +(v / r.height).toFixed(2), y: scrollY }; }));
}
await b.close();
