// Prueba de las tarjetas Sí/No de «Neuro urgente» (N1 y N2) a 390 y 360 px.
// Uso: node neuro-tarjetas.mjs <BASE url> <prefijo capturas>
// Cada final: visible, con enlace a la fuente (página o sección) y botón «Ver en el texto» que abre su destino; sin desborde ni errores.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2], CAP = process.argv[3] || '/tmp/neuro-';
const FICHAS = {
  'radio-n1': { rutas: [['s','s'],['s','n'],['n','s'],['n','n']], destino: { 'ss': 'mn-hic', 'sn': 'mn-hic', 'ns': 'radio-n1', 'nn': 'radio-n1' } },
  'radio-n2': { rutas: [['s','s'],['s','n'],['n','s'],['n','n']], destino: { 'ss': 'umi-marshall', 'sn': 'umi-marshall', 'ns': 'mn-coma', 'nn': 'umi-marshall' } },
};
const b = await chromium.launch(); const fallos = [];
for (const w of [390, 360]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 844 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  const abrir = async (ficha) => {
    await p.goto(BASE); await p.waitForSelector('#btn-pif-radio', { state: 'attached' });
    await p.evaluate(() => document.getElementById('btn-pif')?.click()); await p.waitForTimeout(300);
    await p.evaluate(() => document.getElementById('btn-pif-radio').click()); await p.waitForTimeout(300);
    await p.click('#btn-pif-radio-neuro'); await p.waitForTimeout(300);
    await p.evaluate(f => document.querySelector(`#pif-radio-neuro-corkboard .field-card[data-tab="${f}"]`).click(), ficha); await p.waitForTimeout(250);
    await p.evaluate(f => document.querySelector(`#pif-radio-neuro-corkboard .field-card[data-tab="${f}"] .back-cta`).click(), ficha); await p.waitForTimeout(400);
  };
  for (const [f, { rutas, destino }] of Object.entries(FICHAS)) {
    await abrir(f);
    await p.screenshot({ path: `${CAP}${w}-${f}-ficha.png` });
    if (f === 'radio-n2') { await p.evaluate(() => document.getElementById('radio-n2-esquema').scrollIntoView({ block: 'center' })); await p.waitForTimeout(200); await p.screenshot({ path: `${CAP}${w}-${f}-esquema.png` });
      const min = await p.evaluate(() => { const svg = document.getElementById('radio-n2-esquema'); const k = svg.getBoundingClientRect().width / 300; return Math.min(...[...svg.querySelectorAll('text')].map(t => parseFloat(t.getAttribute('font-size') || t.parentNode.getAttribute('font-size')) * k)); });
      if (min < 12) fallos.push(`${w} ${f}: rótulo SVG ${min.toFixed(1)} px`); console.log(w, 'SVG texto mínimo', min.toFixed(1), 'px'); }
    for (const ruta of rutas) {
      await abrir(f);
      for (const r of ruta) await p.evaluate(([f, i]) => document.querySelectorAll(`#${f}-botones button`)[i].click(), [f, r === 's' ? 0 : 1]);
      const res = await p.evaluate(f => { const e = document.getElementById(`${f}-resultado`); return { vis: e.style.display !== 'none', cita: !!e.querySelector('a.biblio-link'), btn: !!e.querySelector('button[data-tab]'), dw: document.documentElement.scrollWidth - innerWidth }; }, f);
      if (!res.vis || !res.cita || !res.btn || res.dw > 0) fallos.push(`${w} ${f} ${ruta}: ${JSON.stringify(res)}`);
      if (ruta.join('') === 'ss') { await p.evaluate(f => document.getElementById(`${f}-wizard`).scrollIntoView(), f); await p.screenshot({ path: `${CAP}${w}-${f}-tarjeta.png` }); }
      await p.evaluate(f => document.querySelector(`#${f}-resultado button[data-tab]`).click(), f); await p.waitForTimeout(600);
      const ok = await p.evaluate(d => document.getElementById(d)?.classList.contains('active'), destino[ruta.join('')]);
      if (!ok) fallos.push(`${w} ${f} ${ruta}: «Ver en el texto» no abre ${destino[ruta.join('')]}`);
    }
  }
  if (errs.length) fallos.push(`${w} consola: ${errs.slice(0,3)}`);
  await ctx.close();
}
await b.close(); console.log(fallos.length ? '❌\n' + fallos.join('\n') : '✅ neuro-tarjetas (N1 y N2)');
