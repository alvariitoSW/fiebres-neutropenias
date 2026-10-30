// node autonomo/pruebas/raiz-aortica-ui.mjs [puerto]  — toca el SVG, comprueba fila y calculadora, captura a 390 px.
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
const puerto = process.argv[2] || '8731';
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
await p.goto(`http://localhost:${puerto}/index.html`); await p.waitForTimeout(2500);
await p.evaluate(() => document.querySelector('[data-especialidad="eco"]').click());
await p.evaluate(() => { document.querySelector('[data-seccion="medidas"]').click(); });
await p.evaluate(() => document.querySelector('#eco-medidas-corkboard .field-card').click());
await p.evaluate(() => document.querySelector('#eco-medidas-corkboard .back-cta').click());
await p.waitForTimeout(500);
await p.evaluate(() => document.querySelector('g[data-nivel="ust"]').dispatchEvent(new MouseEvent('click', { bubbles: true })));
const r = await p.evaluate(() => ({ fila: document.querySelector('#eco-med-tabla-14 tr[data-nivel="ust"]').style.outline, nivel: document.getElementById('eco-med-nivel').value }));
console.log('toque UST', r);
await p.fill('#eco-med-valor', '3.5'); const z1 = await p.textContent('#eco-med-resultado'); console.log(z1);
await p.selectOption('#eco-med-nivel', 'senos'); await p.selectOption('#eco-med-sexo', 'H'); await p.fill('#eco-med-valor', '4.0'); console.log(await p.textContent('#eco-med-resultado'));
await p.fill('#eco-med-valor', ''); console.log(await p.textContent('#eco-med-resultado'));
await p.fill('#eco-med-valor', '15'); console.log(await p.textContent('#eco-med-aviso'));
await p.selectOption('#eco-med-modo', 'devereux'); await p.fill('#eco-med-d-valor', '3.6'); await p.fill('#eco-med-d-edad', '30'); await p.fill('#eco-med-d-sc', '1.6'); await p.selectOption('#eco-med-d-sexo', 'M'); console.log(await p.textContent('#eco-med-resultado'));
await p.evaluate(() => document.getElementById('eco-med-svg').scrollIntoView());
await p.screenshot({ path: '/tmp/plan-socialista/raiz-aortica/cap/svg-390.png' });
await p.evaluate(() => document.getElementById('eco-med-calc').scrollIntoView());
await p.screenshot({ path: '/tmp/plan-socialista/raiz-aortica/cap/calc-390.png' });
await p.evaluate(() => document.getElementById('eco-med-tabla-14').scrollIntoView());
await p.screenshot({ path: '/tmp/plan-socialista/raiz-aortica/cap/tabla-390.png' });
await p.selectOption('#eco-med-modo', 'lang'); await p.fill('#eco-med-valor', '3.6'); await p.selectOption('#eco-med-sexo', 'M'); await p.selectOption('#eco-med-nivel', 'senos');
console.log('aviso z 2.0 visible:', await p.evaluate(() => !document.getElementById('eco-med-aviso-z').hidden), '| frase:', await p.textContent('#eco-med-nivel-txt'));
for (const w of [360, 390]) {
  await p.setViewportSize({ width: w, height: 844 }); await p.waitForTimeout(300);
  await p.evaluate(() => document.getElementById('eco-med-svg').scrollIntoView({ block: 'center' }));
  await p.screenshot({ path: `/tmp/plan-socialista/raiz-aortica/cap/svg2-${w}.png` });
  await p.evaluate(() => document.getElementById('eco-med-tabla-14').scrollIntoView({ block: 'center' }));
  await p.screenshot({ path: `/tmp/plan-socialista/raiz-aortica/cap/tabla-${w}.png` });
  console.log(w, 'desborde', await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), 'tabla scroll', await p.evaluate(() => { const t = document.getElementById('eco-med-tabla-14'); return t.parentElement.scrollWidth > t.parentElement.clientWidth; }));
}
console.log('errores', errs); await b.close();
