// Prueba de navegador de «Placa portátil de UCI» (PIF Radiología). Uso: node autonomo/pruebas/pif-radio.mjs <url-base> [carpeta de capturas]
// Raíz → PIF → Radiología → cuaderno; recorre cada tarjeta Sí/No hasta todos sus finales (390 y 360 px), comprueba que cada
// final lleva «Ver en el texto» y una página, que ese enlace lleva a la ficha y que VOLVER vuelve; mide el desborde.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8123/').replace(/\/?$/, '/');
const CAP = process.argv[3];
const b = await chromium.launch(); const fallos = [];
const caminos = { 'radio-tubo': ['n', 'ys', 'ys', 'yn', 'yyy', 'yyn'].slice(0), };
// cada camino = lista de respuestas desde el inicio
const RUTAS = {
  'radio-tubo': [['n'], ['s', 'n'], ['s', 's', 's'], ['s', 's', 'n', 's'], ['s', 's', 'n', 'n']],
  'radio-via': [['n'], ['s', 's'], ['s', 'n', 's'], ['s', 'n', 'n']],
  'radio-sonda': [['n'], ['s', 'n'], ['s', 's', 'n'], ['s', 's', 's', 's'], ['s', 's', 's', 'n']],
};
for (const w of [390, 360]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 844 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); p.setDefaultTimeout(6000); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(BASE); await p.waitForSelector('#btn-pif-radio, #pif-radio-view', { state: 'attached' });
  const ir = async () => {
    await p.evaluate(() => { const bt = document.getElementById('btn-pif-radio'); bt.click(); });
    await p.waitForTimeout(300);
    await p.click('#btn-pif-radio-placa'); await p.waitForTimeout(300);
  };
  // botón PIF de la raíz: abre PIF y luego Radiología
  await p.evaluate(() => document.getElementById('btn-pif')?.click()); await p.waitForTimeout(300);
  const visibleRadio = await p.evaluate(() => !!document.getElementById('btn-pif-radio')?.offsetParent);
  if (!visibleRadio) fallos.push(`${w}: btn-pif-radio no visible desde PIF`);
  await ir();
  if (!await p.evaluate(() => document.getElementById('pif-radio-placa-view').offsetParent)) fallos.push(`${w}: no abre el cuaderno`);
  const abrir = async tab => { await p.evaluate(t => document.querySelector(`#pif-radio-corkboard .field-card[data-tab="${t}"]`).click(), tab); await p.waitForTimeout(250);
    await p.evaluate(t => { const c = document.querySelector(`#pif-radio-corkboard .field-card[data-tab="${t}"]`); c.querySelector('.back-cta,.card-face.back')?.click(); }, tab); await p.waitForTimeout(250); };
  for (const [pref, rutas] of Object.entries(RUTAS)) {
    const tab = { 'radio-tubo': 'radio-f2', 'radio-via': 'radio-f3', 'radio-sonda': 'radio-f4' }[pref];
    await p.evaluate(t => window.openCorkboardTopic?.('panel-pif-radio-tabs', t), tab);
    await p.evaluate(t => { document.querySelectorAll('#panel-pif-radio-tabs .tab-content').forEach(x => x.classList.toggle('active', x.id === t)); }, tab);
    for (const ruta of rutas) {
      await p.click(`#${pref}-reset`).catch(() => {});
      for (const r of ruta) {
        const idx = r === 's' ? 0 : 1;
        await p.evaluate(([pf, i]) => document.querySelectorAll(`#${pf}-botones button`)[i].click(), [pref, idx]);
      }
      const res = await p.evaluate(pf => { const e = document.getElementById(`${pf}-resultado`); return { vis: e.style.display !== 'none', txt: e.textContent, pag: !!e.querySelector('a[href*="#page="]'), btn: !!e.querySelector('button[data-tab]'), dw: document.documentElement.scrollWidth - innerWidth }; }, pref);
      if (!res.vis || !res.pag || !res.btn || res.dw > 0) fallos.push(`${w} ${pref} ${ruta}: ${JSON.stringify(res)}`);
      if (CAP && ruta.join('') === 'ss' + (pref === 'radio-via' ? '' : 'n')) await p.screenshot({ path: `${CAP}${w}-${pref}-${ruta.join('')}.png` });
    }
  }
  // enlace "Ver en el texto" del último resultado → ficha de origen → VOLVER
  await p.evaluate(() => document.querySelector('#radio-sonda-resultado button[data-tab]').click()); await p.waitForTimeout(500);
  const dest = await p.evaluate(() => document.getElementById('mu-pauta-enteral')?.classList.contains('active'));
  if (!dest) fallos.push(`${w}: Ver en el texto no abre mu-pauta-enteral`);
  if (errs.length) fallos.push(`${w} consola: ${errs.slice(0, 3).join(' | ')}`);
  await ctx.close();
}
await b.close();
console.log(fallos.length ? '❌\n' + fallos.join('\n') : '✅ pif-radio: tarjetas y enlaces');
process.exit(fallos.length ? 1 : 0);
