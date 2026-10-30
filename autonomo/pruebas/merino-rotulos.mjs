// Prueba de los rótulos sobre las figuras de Merino Neumología (core/figura-rotulos.js).
// Uso: node autonomo/pruebas/merino-rotulos.mjs [carpeta de capturas]   (levanta su propio servidor en un puerto libre)
// Por figura y a 390 y 360 px: interruptor apagado al abrir, lo enciende, cada rótulo (etiqueta y punto) cae dentro de la caja de su
// imagen, la etiqueta nace del pie o del texto con página, el lightbox sigue abriendo, sin desborde ni errores; captura con rótulos.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const CAP = process.argv[2] || '/tmp/plan-socialista/radio-baratas-d2/capturas/';
fs.mkdirSync(CAP, { recursive: true });
const RAIZ = path.resolve(new URL('../../', import.meta.url).pathname);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json' };
const srv = http.createServer((q, r) => { const f = path.join(RAIZ, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html'));
  fs.readFile(f.startsWith(RAIZ) ? f : '/x', (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(d); } }); });
await new Promise(ok => srv.listen(0, ok));
const BASE = `http://localhost:${srv.address().port}/`;
const FIGS = { 'fig-22-1': 'neumo-ep-diagnostico', 'fig-24-2': 'neumo-sdra-diagnostico', 'fig-24-3': 'neumo-sdra-diagnostico', 'fig-28-1': 'neumo-vias-artificiales', 'fig-28-5': 'neumo-cuidado-barotrauma', 'fig-29-3': 'neumo-nav-diagnostico' };
const b = await chromium.launch(); const fallos = [];
for (const w of [390, 360]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 844 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); p.setDefaultTimeout(8000); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(BASE); await p.waitForSelector('#merino-neumo-view', { state: 'attached' }); await p.waitForTimeout(1500);
  for (const [clave, tab] of Object.entries(FIGS)) {
    // se llega a la ficha con el enlace cruzado de la app (un botón con sus data-*, que resuelve el listener delegado)
    await p.evaluate(t => { const x = document.createElement('button'); x.dataset.especialidad = 'neumologia'; x.dataset.view = 'merinoNeumologia'; x.dataset.panel = 'panel-merino-neumo-tabs'; x.dataset.tab = t; document.body.appendChild(x); x.click(); x.remove(); }, tab);
    await p.waitForTimeout(500);
    const sel = `#merino-neumo-view .article-figure[data-rotulos="${clave}"]`;
    // abre los acordeones (.micro-prof-item) y los <details> que contienen la figura
    await p.evaluate(s => { let e = document.querySelector(s); while (e) { if (e.classList?.contains('micro-prof-body')) { e.classList.add('active'); e.previousElementSibling?.classList.add('open'); } if (e.tagName === 'DETAILS') e.open = true; e = e.parentElement; } }, sel);
    const f = p.locator(sel); await f.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
    const btn = f.locator('.fig-rot-btn');
    if (!await btn.count()) { fallos.push(`${w} ${clave}: sin interruptor`); continue; }
    const off = await f.evaluate(e => e.querySelector('.fig-rot-capa').hidden && e.querySelector('.fig-rot-btn').getAttribute('aria-pressed') === 'false');
    if (!off) fallos.push(`${w} ${clave}: no abre apagado`);
    await p.waitForFunction(s => { const i = document.querySelector(s + ' img'); return i && i.complete && i.naturalWidth > 0; }, sel);
    await btn.click(); await p.waitForTimeout(150);
    const r = await f.evaluate(e => {
      const caja = e.querySelector('.fig-rot-caja').getBoundingClientRect(); const dentro = x => x.left >= caja.left - 0.5 && x.right <= caja.right + 0.5 && x.top >= caja.top - 0.5 && x.bottom <= caja.bottom + 0.5;
      const txt = [...e.querySelectorAll('.fig-rot-txt')], pts = [...e.querySelectorAll('.fig-rot-punto')];
      return { on: !e.querySelector('.fig-rot-capa').hidden, n: txt.length, fuera: [...txt, ...pts].filter(x => !dentro(x.getBoundingClientRect())).map(x => x.textContent || 'punto'),
        fs: Math.min(...txt.map(x => parseFloat(getComputedStyle(x).fontSize))), enlaces: e.querySelectorAll('.fig-rot-fuente a[href*="#page="]').length,
        solapa: txt.some((a, i) => txt.some((c, j) => j > i && !(a.getBoundingClientRect().right < c.getBoundingClientRect().left || c.getBoundingClientRect().right < a.getBoundingClientRect().left || a.getBoundingClientRect().bottom < c.getBoundingClientRect().top || c.getBoundingClientRect().bottom < a.getBoundingClientRect().top))),
        dw: document.documentElement.scrollWidth - innerWidth };
    });
    if (!r.on || r.n < 1 || r.fuera.length || r.fs < 11 || r.enlaces !== r.n || r.solapa || r.dw > 0) fallos.push(`${w} ${clave}: ${JSON.stringify(r)}`);
    await f.screenshot({ path: `${CAP}${w}-${clave}.png` });
    // el lightbox sigue abriendo al tocar la imagen con la capa encendida
    await f.locator('img').click({ position: { x: 5, y: 5 } }); await p.waitForTimeout(300);
    const lb = await p.evaluate(() => [...document.querySelectorAll('[class*="lightbox"]')].some(x => x.offsetParent !== null || getComputedStyle(x).display !== 'none' && x.getBoundingClientRect().width > 0));
    if (!lb) fallos.push(`${w} ${clave}: el lightbox no abre`);
    await p.keyboard.press('Escape'); await p.evaluate(() => document.querySelectorAll('[class*="lightbox"]').forEach(x => x.click())); await p.waitForTimeout(200);
    await btn.click(); // apaga
    if (!await f.evaluate(e => e.querySelector('.fig-rot-capa').hidden)) fallos.push(`${w} ${clave}: no apaga`);
  }
  if (errs.length) fallos.push(`${w} errores: ${errs.slice(0, 3).join(' | ')}`);
  await ctx.close();
}
await b.close(); srv.close();
console.log(fallos.length ? 'FALLOS:\n' + fallos.join('\n') : 'merino-rotulos: todo en verde (6 figuras × 390/360)');
process.exit(fallos.length ? 1 : 0);
