// Solape de <text> en la MAQUETA (el «antes» de autonomo/pruebas/hepatocito-vivo.mjs). Uso: node ... <url-base> (sirve la carpeta del repo)
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8000/').replace(/\/?$/, '/');
const b = await chromium.launch(); const p = await (await b.newContext({ ...devices['iPhone 12'], viewport: { width: 360, height: 800 } })).newPage();
await p.goto(BASE + 'autonomo/maquetas/b5-hepatocito-b.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
for (const c of ['sano', 'casimira', 'edema', 'alta']) {
  const r = await p.evaluate((c) => { window.__hep.ponerPreset(c); const sv = document.getElementById('hep-svg'), T = [...sv.querySelectorAll('text')].map((t) => { const b = t.getBBox(); return { t: t.textContent.trim(), x: b.x, y: b.y, w: b.width, h: b.height }; });
    const gap = (a, b) => Math.max(Math.max(a.x - (b.x + b.w), b.x - (a.x + a.w)), Math.max(a.y - (b.y + b.h), b.y - (a.y + a.h))); const o = [];
    for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) if (gap(T[i], T[j]) < -0.5) o.push(`«${T[i].t}» × «${T[j].t}»`);
    const ci = sv.querySelector('.astro'), cx = +ci.getAttribute('cx'), cy = +ci.getAttribute('cy'), r = +ci.getAttribute('r');
    for (const t of T) { const dx = Math.max(t.x - cx, 0, cx - (t.x + t.w)), dy = Math.max(t.y - cy, 0, cy - (t.y + t.h)); if (t.t !== '?' && Math.hypot(dx, dy) < r + 0.5) o.push(`«${t.t}» toca el astrocito`); }
    const pu = sv.querySelector('.puente'), L = pu.getTotalLength(); for (let k = 0; k <= 60; k++) { const q = pu.getPointAtLength(L * k / 60); for (const t of T) if (q.x > t.x - 1 && q.x < t.x + t.w + 1 && q.y > t.y - 1 && q.y < t.y + t.h + 1) { o.push(`línea del TIPS cruza «${t.t}»`); break; } }
    return [...new Set(o)]; }, c);
  console.log(`maqueta [${c}]: ${r.length} choques ${r.join(' | ')}`);
}
await b.close();
