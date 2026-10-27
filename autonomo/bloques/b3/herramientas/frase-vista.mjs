// Prueba de js/core/frase-vista.js: tras tocar un mando, la frase viva no queda bajo el dock (390x844).
// Uso: node autonomo/bloques/b3/herramientas/frase-vista.mjs <url-base>   (sale con 1 si algo falla)
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv.find(a => /^https?:/.test(a)) || 'http://localhost:8000/').replace(/\/?$/, '/');
const b = await chromium.launch(); let fallos = 0;
const CASOS = [
  { n: 'agua-viva', menu: '#agv-menu-libros', frase: '#agv-frase', dock: '#agv-dock',
    tocar: ['#agv-m-hemorragia:30', '#agv-m-na:125', '#agv-m-glucosa:400'] },
  { n: 'telar-vivo', menu: '#tel-menu-libros', frase: '#tel-frase', dock: '#tel-dock',
    tocar: ['#tel-m-estado:1', '#tel-m-estado:2', '#tel-m-riesgo:1'] },
];
for (const c of CASOS) for (const scrollY of [0, 400]) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage(); const err = [];
  p.on('pageerror', e => err.push(e.message));
  await p.goto(BASE + 'index.html'); await p.waitForTimeout(800);
  await p.click('#btn-libros'); await p.click('#btn-libro-marino'); await p.click('#lib-pest-vivos'); await p.click(c.menu); await p.waitForTimeout(600);
  for (const t of c.tocar) {
    const [sel, v] = t.split(':');
    await p.evaluate(y => scrollTo(0, y), scrollY);
    await p.evaluate(([s, v]) => { const e = document.querySelector(s); if (e.tagName === 'SELECT') { e.selectedIndex = +v; } else e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); e.click(); }, [sel, v]);
    await p.waitForTimeout(500);
    const m = await p.evaluate(([f, d]) => { const a = document.querySelector(f), k = document.querySelector(d); return { fb: a.getBoundingClientRect().bottom, ft: a.getBoundingClientRect().top, dt: k.getBoundingClientRect().top, dentro: k.contains(a), vis: !!a.offsetParent }; }, [c.frase, c.dock]);
    const ok = !m.vis || m.dentro || m.fb <= m.dt + 1;
    console.log(`${ok ? '✅' : '❌'} ${c.n} scrollY=${scrollY} ${t}: frase ${Math.round(m.ft)}-${Math.round(m.fb)} dock ${Math.round(m.dt)}${m.dentro ? ' (frase dentro del dock)' : ''}`);
    if (!ok) fallos++;
  }
  if (err.length) { console.log('❌ errores de página', err); fallos++; }
  await ctx.close();
}
await b.close(); process.exit(fallos ? 1 : 0);
