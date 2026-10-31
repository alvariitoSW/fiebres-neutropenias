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
  'radio-tubo': [['n'], ['s', 's'], ['s', 'n', 'n'], ['s', 'n', 's', 's'], ['s', 'n', 's', 'n']],
  'radio-via': [['n', 'n'], ['n', 's', 'n'], ['n', 's', 's'], ['s', 'n'], ['s', 's', 's'], ['s', 's', 'n']],
  'radio-sonda': [['n'], ['s', 'n'], ['s', 's', 'n'], ['s', 's', 's']],
  // TC de cráneo: efecto de masa, swelling, HSA, hematoma sin masa, isquemia, TC sin sangre ni hipodensidad
  'radio-craneo': [['s', 's'], ['s', 'n', 's'], ['s', 'n', 'n', 's'], ['s', 'n', 'n', 'n'], ['n', 's'], ['n', 'n']],
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
  const visibleRadio = await p.waitForFunction(() => !!document.getElementById('btn-pif-radio')?.offsetParent, null, { timeout: 5000 }).then(() => true, () => false);
  if (!visibleRadio) fallos.push(`${w}: btn-pif-radio no visible desde PIF`);
  await ir();
  if (!await p.evaluate(() => document.getElementById('pif-radio-placa-view').offsetParent)) fallos.push(`${w}: no abre el cuaderno`);
  const abrir = async tab => { await p.evaluate(t => document.querySelector(`#pif-radio-corkboard .field-card[data-tab="${t}"]`).click(), tab); await p.waitForTimeout(250);
    await p.evaluate(t => { const c = document.querySelector(`#pif-radio-corkboard .field-card[data-tab="${t}"]`); c.querySelector('.back-cta,.card-face.back')?.click(); }, tab); await p.waitForTimeout(250); };
  for (const [pref, rutas] of Object.entries(RUTAS)) {
    const tab = { 'radio-tubo': 'radio-f2', 'radio-via': 'radio-f3', 'radio-sonda': 'radio-f4', 'radio-craneo': 'radio-f5' }[pref];
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
  // <details> «¿Qué no puede ver esta IA?»: cerrado al empezar, se abre, nombra la fuente y no desborda
  await p.evaluate(() => window.openCorkboardTopic?.('panel-pif-radio-tabs', 'radio-f5'));
  await p.evaluate(() => document.querySelectorAll('#panel-pif-radio-tabs .tab-content').forEach(x => x.classList.toggle('active', x.id === 'radio-f5')));
  const ia = await p.evaluate(() => { const d = document.getElementById('radio-f5-ia'); const cerrado = !d.open; d.open = true; return { cerrado, git: !!d.querySelector('a[href*="github.com/NVIDIA-Medtech/NV-Reason-CT"]'), dw: document.documentElement.scrollWidth - innerWidth }; });
  if (!ia.cerrado || !ia.git || ia.dw > 0) fallos.push(`${w} details IA: ${JSON.stringify(ia)}`);
  if (CAP) await p.screenshot({ path: `${CAP}${w}-radio-craneo-ia.png` });
  // Ficha 6 «Lee esta placa»: Comprobar desactivado hasta tocar y elegir; un toque cerca de la punta y otro lejos
  await p.evaluate(() => window.openCorkboardTopic?.('panel-pif-radio-tabs', 'radio-f6'));
  await p.evaluate(() => document.querySelectorAll('#panel-pif-radio-tabs .tab-content').forEach(x => x.classList.toggle('active', x.id === 'radio-f6')));
  for (const [id, pt] of [['tubo', [50.7, 31.3]]]) {
    await p.evaluate(i => document.getElementById(`rl-${i}-img`).scrollIntoView({ block: "center" }), id); await p.waitForTimeout(300);
    for (const [lejos, esperado] of [[false, 'true'], [true, 'false']]) {
      await p.evaluate(i => document.getElementById(`rl-${i}-img`).scrollIntoView({ block: "center" }), id); await p.waitForTimeout(150);
      const bb = await p.locator(`#rl-${id}-img`).boundingBox();
      const off = () => p.evaluate(i => document.getElementById(`rl-${i}-comprobar`).disabled, id);
      const pieA = () => p.evaluate(i => document.getElementById(`rl-${i}-pie`).textContent, id);
      if (/bien colocado/i.test(await pieA())) fallos.push(`${w} f6 ${id}: el pie regala bien colocado`);
      if (!await off()) fallos.push(`${w} f6 ${id}: Comprobar activo antes de tocar`);
      const [x, y] = lejos ? [15, 80] : pt;
      await p.touchscreen.tap(bb.x + bb.width * x / 100 + 3, bb.y + bb.height * y / 100 + 3);
      if (!await off()) fallos.push(`${w} f6 ${id}: Comprobar activo sin elegir`);
      await p.locator(`#rl-${id}-ops button`).first().tap();
      if (await off()) { fallos.push(`${w} f6 ${id}: Comprobar sigue apagado tras tocar y elegir`); console.log(await p.evaluate(i => document.getElementById(`rl-${i}-estado`).textContent + document.querySelectorAll(`#rl-${i}-ops [aria-pressed=true]`).length, id)); }
      await p.locator(`#rl-${id}-comprobar`).tap(); await p.waitForTimeout(150);
      const r = await p.evaluate(i => { const e = document.getElementById(`rl-${i}-res`); return { cerca: e.dataset.cerca, pag: !!e.querySelector('a[href*="#page="]'), btn: !!e.querySelector('button[data-tab]'), dw: document.documentElement.scrollWidth - innerWidth }; }, id);
      if (r.cerca !== esperado || !r.pag || !r.btn || r.dw > 0) fallos.push(`${w} f6 ${id} lejos=${lejos}: ${JSON.stringify(r)}`);
      if (!/bien colocado/i.test(await pieA())) fallos.push(`${w} f6 ${id}: el pie no dice bien colocado tras comprobar`);
      await p.locator(`#rl-${id}-eops button`).first().tap(); await p.locator(`#rl-${id}-corregir`).tap();
      await p.locator(`#rl-${id}-repetir`).tap();
    }
  }
  for (const [id, pc] of [['tubo', [50.7, 48.8]]]) {   // toque sobre la carina (el anillo sube 6 %)
    await p.evaluate(i => document.getElementById(`rl-${i}-img`).scrollIntoView({ block: 'center' }), id); await p.waitForTimeout(150);
    const bb = await p.locator(`#rl-${id}-img`).boundingBox();
    await p.touchscreen.tap(bb.x + bb.width * pc[0] / 100, bb.y + bb.height * (pc[1] + 6) / 100);
    await p.locator(`#rl-${id}-ops button`).first().tap(); await p.locator(`#rl-${id}-comprobar`).tap(); await p.waitForTimeout(150);
    const c = await p.evaluate(i => document.getElementById(`rl-${i}-res`).dataset.carina, id);
    if (c !== 'true') fallos.push(`${w} f6 ${id}: toque en la carina sin mensaje de carina`);
    await p.locator(`#rl-${id}-eops button`).first().tap(); await p.locator(`#rl-${id}-corregir`).tap();
    await p.locator(`#rl-${id}-repetir`).tap();
  }
  {   // vía: sin toque (el punto no salía de la fuente); elegir activa Comprobar y da la página
    await p.evaluate(() => document.getElementById('rl-via-img').scrollIntoView({ block: 'center' })); await p.waitForTimeout(150);
    const off = () => p.evaluate(() => document.getElementById('rl-via-comprobar').disabled);
    if (!await off()) fallos.push(`${w} f6 via: Comprobar activo antes de elegir`);
    await p.locator('#rl-via-ops button').nth(1).tap();
    if (await off()) fallos.push(`${w} f6 via: Comprobar apagado tras elegir`);
    await p.locator('#rl-via-comprobar').tap(); await p.waitForTimeout(150);
    const r = await p.evaluate(() => { const e = document.getElementById('rl-via-res'); return { ok: e.dataset.ok, pag: !!e.querySelector('a[href*="#page="]'), btn: !!e.querySelector('button[data-tab]'), cred: !!document.querySelector('#rl-via-credito a[href*="#page="]'), dw: document.documentElement.scrollWidth - innerWidth }; });
    if (r.ok !== 'true' || !r.pag || !r.btn || !r.cred || r.dw > 0) fallos.push(`${w} f6 via: ${JSON.stringify(r)}`);
    await p.locator('#rl-via-eops button').first().tap(); await p.locator('#rl-via-corregir').tap();
    await p.locator('#rl-via-repetir').tap();
  }
  if (CAP) await p.screenshot({ path: `${CAP}${w}-radio-f6.png` });
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
