import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2], CAP = process.argv[3];
const b = await chromium.launch(); const fallos = [];
for (const w of [390, 360]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 844 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(BASE); await p.waitForSelector('#btn-pif-radio', { state: 'attached' });
  await p.evaluate(() => document.getElementById('btn-pif')?.click()); await p.waitForTimeout(300);
  await p.evaluate(() => document.getElementById('btn-pif-radio').click()); await p.waitForTimeout(300);
  await p.click('#btn-pif-radio-neuro'); await p.waitForTimeout(300);
  await p.evaluate(() => document.querySelector('#pif-radio-neuro-corkboard .field-card[data-tab="radio-n1"]').click()); await p.waitForTimeout(250);
  await p.evaluate(() => document.querySelector('#pif-radio-neuro-corkboard .field-card[data-tab="radio-n1"] .back-cta').click()); await p.waitForTimeout(400);
  await p.screenshot({ path: `${CAP}${w}-ficha.png` });
  for (const ruta of [['s','s'],['s','n'],['n','s'],['n','n']]) {
    await p.click('#radio-n1-reset').catch(() => {});
    for (const r of ruta) await p.evaluate(i => document.querySelectorAll('#radio-n1-botones button')[i].click(), r === 's' ? 0 : 1);
    const res = await p.evaluate(() => { const e = document.getElementById('radio-n1-resultado'); return { vis: e.style.display !== 'none', cita: !!e.querySelector('a.biblio-link'), btn: !!e.querySelector('button[data-tab]'), dw: document.documentElement.scrollWidth - innerWidth }; });
    if (!res.vis || !res.cita || !res.btn || res.dw > 0) fallos.push(`${w} ${ruta}: ${JSON.stringify(res)}`);
    if (ruta.join('') === 'nn') { await p.evaluate(() => document.getElementById('radio-n1-wizard').scrollIntoView()); await p.screenshot({ path: `${CAP}${w}-tarjeta.png` }); }
  }
  await p.evaluate(() => { document.getElementById('radio-n1-pregunta'); }); 
  await p.evaluate(() => document.querySelector('#radio-n1-botones button') && 0);
  // enlace ver en el texto de la ruta s,n
  await p.click('#radio-n1-reset').catch(() => {});
  for (const r of [0,1]) await p.evaluate(i => document.querySelectorAll('#radio-n1-botones button')[i].click(), r);
  await p.evaluate(() => document.querySelector('#radio-n1-resultado button[data-tab]').click()); await p.waitForTimeout(600);
  const dest = await p.evaluate(() => document.getElementById('mn-hic')?.classList.contains('active'));
  if (!dest) fallos.push(`${w}: Ver en el texto no abre mn-hic`);
  if (errs.length) fallos.push(`${w} consola: ${errs.slice(0,3)}`);
  await ctx.close();
}
await b.close(); console.log(fallos.length ? '❌\n' + fallos.join('\n') : '✅ n1');
