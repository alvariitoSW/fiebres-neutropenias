// Prueba de navegador de los cuadernos «Tórax de UCI» y «Neuro urgente» (PIF Radiología).
// Uso: node autonomo/pruebas/pif-radio-fichas.mjs <url-base> [prefijo de capturas]
// Raíz → PIF → Radiología → cuaderno → ficha; recorre cada tarjeta Sí/No hasta todos sus finales (390 y 360 px),
// comprueba que cada final lleva «Ver en el texto» y una página o sección, que ese enlace lleva a su ficha y que VOLVER
// vuelve; mide el desborde.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8141/').replace(/\/?$/, '/');
const CAP = process.argv[3];
// cuaderno → { boton, vista, panel, fichas: [{ tab, prefijo, rutas (s = Sí, n = No), destino (ficha a la que debe llevar el último final) }] }
const RUTAS = {
  torax: { boton: 'btn-pif-radio-torax', vista: 'pif-radio-torax-view', panel: 'panel-pif-radio-torax-tabs', cork: 'pif-radio-torax-corkboard',
    fichas: [
      { tab: 'radio-t1', prefijo: 'radio-t1', rutas: [['n'], ['s', 's'], ['s', 'n', 's'], ['s', 'n', 'n']], destino: 'neumo-cuidado-barotrauma' },
      { tab: 'radio-t2', prefijo: 'radio-t2', rutas: [], destino: '' }, // sin tarjeta Sí/No: solo abre y mide
      { tab: 'radio-t3', prefijo: 'radio-t3', rutas: [], destino: '' },
      // [HUECO T2/T3: sus tarjetas, si algún día llevan]
    ] },
  neuro: { boton: 'btn-pif-radio-neuro', vista: 'pif-radio-neuro-view', panel: 'panel-pif-radio-neuro-tabs', cork: 'pif-radio-neuro-corkboard',
    fichas: [
      // [HUECO neuro: {tab:'radio-n2', prefijo:'radio-n2', rutas:[...], destino:'…'}]
    ] },
};
const b = await chromium.launch(); const fallos = [];
for (const w of [390, 360]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 844 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); p.setDefaultTimeout(6000); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(BASE); await p.waitForSelector('#btn-pif', { state: 'attached' });
  const dw = () => p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  for (const [cuad, c] of Object.entries(RUTAS)) {
    await p.evaluate(() => document.getElementById('btn-pif')?.click()); await p.waitForTimeout(300);
    await p.evaluate(() => document.getElementById('btn-pif-radio')?.click()); await p.waitForTimeout(300);
    const hay = await p.evaluate(id => !!document.getElementById(id), c.boton);
    if (!hay) { fallos.push(`${w} ${cuad}: no existe #${c.boton}`); continue; }
    await p.evaluate(id => document.getElementById(id).click(), c.boton); await p.waitForTimeout(400);
    if (!await p.evaluate(id => !!document.getElementById(id)?.offsetParent, c.vista)) { fallos.push(`${w} ${cuad}: la vista no se abre`); continue; }
    if (await dw() > 0) fallos.push(`${w} ${cuad}: desborde en el menú del cuaderno`);
    for (const f of c.fichas) {
      await p.evaluate(([cork, t]) => document.querySelector(`#${cork} .field-card[data-tab="${t}"]`)?.click(), [c.cork, f.tab]); await p.waitForTimeout(250);
      await p.evaluate(([cork, t]) => document.querySelector(`#${cork} .field-card[data-tab="${t}"] .back-cta`)?.click(), [c.cork, f.tab]); await p.waitForTimeout(350);
      await p.evaluate(([pn, t]) => window.openCorkboardTopic?.(pn, t), [c.panel, f.tab]); await p.waitForTimeout(300);
      const ab = await p.evaluate(t => { const e = document.getElementById(t); return !!e && e.classList.contains('active') && !!e.offsetParent; }, f.tab);
      if (!ab) { fallos.push(`${w} ${f.tab}: la ficha no abre`); continue; }
      const im = await p.evaluate(t => [...document.querySelectorAll(`#${t} img`)].map(i => i.complete && i.naturalWidth > 0), f.tab);
      if (im.includes(false)) fallos.push(`${w} ${f.tab}: imagen sin cargar`);
      await p.evaluate(t => document.querySelectorAll(`#${t} img`).forEach(i => i.scrollIntoView()), f.tab); await p.waitForTimeout(500);
      if (await dw() > 0) fallos.push(`${w} ${f.tab}: desborde al abrir`);
      if (CAP) await p.screenshot({ path: `${CAP}${w}-${f.tab}.png`, fullPage: false });
      for (const ruta of f.rutas) {
        await p.evaluate(pf => document.getElementById(`${pf}-reset`)?.click(), f.prefijo);
        for (const r of ruta) await p.evaluate(([pf, i]) => document.querySelectorAll(`#${pf}-botones button`)[i].click(), [f.prefijo, r === 's' ? 0 : 1]);
        const res = await p.evaluate(pf => { const e = document.getElementById(`${pf}-resultado`); return { vis: e.style.display !== 'none', pag: !!e.querySelector('a[href*="#page="], a[href^="http"]'), btn: !!e.querySelector('button[data-tab]'), dw: document.documentElement.scrollWidth - innerWidth }; }, f.prefijo);
        if (!res.vis || !res.pag || !res.btn || res.dw > 0) fallos.push(`${w} ${f.prefijo} ${ruta}: ${JSON.stringify(res)}`);
        if (CAP && ruta.length === 2) await p.screenshot({ path: `${CAP}${w}-${f.prefijo}-${ruta.join('')}.png` });
      }
      if (!f.rutas.length) continue; // ficha sin tarjeta Sí/No
      // «Ver en el texto» del último final → ficha de origen → VOLVER
      await p.evaluate(pf => document.querySelector(`#${pf}-resultado button[data-tab]`).click(), f.prefijo); await p.waitForTimeout(600);
      if (!await p.evaluate(d => document.getElementById(d)?.classList.contains('active'), f.destino)) fallos.push(`${w} ${f.prefijo}: «Ver en el texto» no abre ${f.destino}`);
      else {
        const vol = await p.evaluate(() => { const b = [...document.querySelectorAll('.btn-volver-ficha, [data-volver-ficha], .volver-ficha')].find(x => x.offsetParent); if (b) { b.click(); return true; } return false; });
        await p.waitForTimeout(500);
        if (vol && !await p.evaluate(t => document.getElementById(t)?.classList.contains('active') && !!document.getElementById(t).offsetParent, f.tab)) fallos.push(`${w} ${f.prefijo}: VOLVER no vuelve a ${f.tab}`);
      }
      await p.evaluate(() => document.getElementById('btn-pif')?.click()).catch(() => {});
      await p.reload(); await p.waitForSelector('#btn-pif', { state: 'attached' });
      await p.evaluate(() => document.getElementById('btn-pif')?.click()); await p.waitForTimeout(300);
      await p.evaluate(() => document.getElementById('btn-pif-radio')?.click()); await p.waitForTimeout(300);
      await p.evaluate(id => document.getElementById(id).click(), c.boton); await p.waitForTimeout(400);
    }
    await p.reload(); await p.waitForSelector('#btn-pif', { state: 'attached' });
  }
  if (errs.length) fallos.push(`${w} consola: ${errs.slice(0, 3).join(' | ')}`);
  await ctx.close();
}
await b.close();
console.log(fallos.length ? '❌\n' + fallos.join('\n') : '✅ pif-radio-fichas: cuadernos, tarjetas y enlaces');
process.exit(fallos.length ? 1 : 0);
