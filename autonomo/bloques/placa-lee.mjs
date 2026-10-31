// Prueba del grupo «Placa portátil»: monta los 12 ejercicios, abre las fichas 6 y 7, toca zonas, responde el error y mide desborde. Uso: node placa-lee.mjs <url-base> <carpeta-capturas>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8143/').replace(/\/?$/, '/'), OUT = process.argv[3] || '/tmp';
const IDS = ['tubo','via','intub-sel','via-perf','sonda-ok','sonda-pulmon','megacolon','neumoperitoneo','pancr-edema','pancr-necrosis','pancr-infectada','absceso'];
const b = await chromium.launch(); const fallos = [];
for (const w of [390, 360]) {
  const p = await (await b.newContext({ viewport: { width: w, height: 844 }, hasTouch: true, isMobile: true })).newPage();
  const errs = []; p.on('console', m => m.type() === 'error' && errs.push(m.text())); p.on('pageerror', e => errs.push(String(e)));
  await p.goto(BASE); await p.waitForSelector('#radio-f6-ejercicios', { state: 'attached' });
  for (const id of IDS) if (!await p.locator(`#rl-${id}`).count()) fallos.push(`${w} falta rl-${id}`);
  for (const [tab, ids] of [['radio-f6', IDS.slice(0, 6)], ['radio-f7', IDS.slice(6)]]) {
    await p.evaluate(t => { const b = document.createElement('button'); b.dataset.especialidad = 'pifRadio'; b.dataset.view = 'placa'; b.dataset.panel = 'panel-pif-radio-tabs'; b.dataset.tab = t; b.className = 'especialidad-link'; document.body.appendChild(b); b.click(); b.remove(); }, tab); await p.waitForTimeout(600);
    for (const id of ids) {
      const img = p.locator(`#rl-${id}-img`); await img.scrollIntoViewIfNeeded(); await p.waitForTimeout(150);
      const nw = await img.evaluate(i => i.naturalWidth); if (!nw) fallos.push(`${w} ${id} imagen sin cargar`);
      const zonas = await p.locator(`#rl-${id} [id^="rl-${id}-zt-"]`).count();
      const bb = await img.boundingBox();
      if (zonas && await p.locator(`#rl-${id}-destapar`).count()) { await p.locator(`#rl-${id}-destapar`).tap(); await p.waitForTimeout(100); }
      const ops = p.locator(`#rl-${id}-eops button, #rl-${id}-ops button`); const n = await ops.count();
      if (id !== 'tubo' && id !== 'via' && n < 3) fallos.push(`${w} ${id}: ${n} opciones`);
      if (n) { await ops.nth(0).tap(); const cg = p.locator(`#rl-${id}-corregir`); if (await cg.count()) await cg.tap(); await p.waitForTimeout(150); }
      const des = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      if (des) fallos.push(`${w} ${id} desborde`);
      if (w === 390 && ['intub-sel','sonda-ok','pancr-necrosis','absceso'].includes(id)) await p.locator(`#rl-${id}`).screenshot({ path: `${OUT}/${id}-${w}.png` });
    }
  }
  if (errs.length) fallos.push(`${w} consola: ${errs.slice(0, 3)}`);
}
await b.close(); console.log(fallos.length ? '❌ ' + fallos.join('\n❌ ') : '✅ placa-lee: 12 ejercicios montados, imágenes, desborde 390/360, sin errores de consola');
process.exit(fallos.length ? 1 : 0);
