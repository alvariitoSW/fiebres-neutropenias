// Lee del hepatocito vivo (la app, a 390 px) lo que enseña su monitor en cada estado de los casos del grupo 6I.
// Uso: node autonomo/bloques/b6b/herramientas/cifras-6i.mjs <url-base>
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8761/').replace(/\/?$/, '/');
const b = await chromium.launch(); const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 800 } }); const p = await ctx.newPage();
await p.goto(BASE + 'index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
await p.evaluate(() => { const x = document.createElement('button'); Object.assign(x.dataset, { especialidad: 'libros', view: 'hepatocitoVivo', hepatocitoVivo: 'sano' }); x.className = 'especialidad-link'; document.body.appendChild(x); x.click(); });
await p.waitForTimeout(800);
for (const e of ['casimira', 'sobredosis', 'nac', 'hemodialisis', 'riesgo-alcohol', 'terapeutico', 'gumersindo', 'fomepizol', 'hemodialisis-alcohol', 'coadyuvantes', 'ruperto', 'metanol']) {
  const r = await p.evaluate(e => { window.__hpv.abrirEstado(e); const l = window.__hpv.leer(); return { s: { ...window.__hpv.s, lab: undefined, vit: undefined }, lab: window.__hpv.s.lab, vit: window.__hpv.s.vit, l: JSON.stringify(l).slice(0, 400), v: JSON.stringify(window.__hpv.vitales()).slice(0, 400), frase: document.getElementById('hpv-frase')?.textContent.slice(0, 260), topes: window.__hpv.topes().map(t => t.clave + ':' + t.nivel).join(' ') }; }, e);
  console.log('==', e, JSON.stringify(r, null, 0));
}
await b.close();
