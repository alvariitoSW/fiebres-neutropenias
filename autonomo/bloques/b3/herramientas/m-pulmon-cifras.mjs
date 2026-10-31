// Lee en la app (390 px) las casillas [data-fila] del pulmón vivo tras poner un estado y, si se pide, mandos.
// Uso: node m-pulmon-cifras.mjs http://localhost:PUERTO/ estado[:mando=valor,mando=valor] ...   (ej. sdra-rigido:peep=18)
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2].replace(/\/?$/, '/'), pedidos = process.argv.slice(3);
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
for (const ped of pedidos) {
  const [k, resto] = ped.split(':');
  await p.evaluate(k => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'pulmonVivo', pulmonVivo: k }); document.body.append(t); t.click(); t.remove(); }, k);
  await p.waitForTimeout(1500); await p.evaluate(() => window.__pulPruebas().llenar());
  for (const kv of (resto || '').split(',').filter(Boolean)) {
    const [m, v] = kv.split('=');
    await p.evaluate(([m, v]) => { const pest = (c) => document.querySelector(`#pul-dock-tabs [data-pest="${c}"]`).click();
      let d = document.querySelector(`#pul-dock-panel input[data-m="${m}"]`); if (!d) { for (const c of ['resp', 'pulmon', 'man']) { pest(c); d = document.querySelector(`#pul-dock-panel input[data-m="${m}"]`); if (d) break; } }
      if (!d) throw new Error('no hay mando ' + m); d.value = v; d.dispatchEvent(new Event('input', { bubbles: true })); d.dispatchEvent(new Event('change', { bubbles: true })); }, [m, v]);
    await p.waitForTimeout(150); await p.evaluate(() => window.__pulPruebas().llenar());
  }
  await p.waitForTimeout(200);
  const f = await p.evaluate(() => [...document.querySelectorAll('#pul-raiz [data-fila]')].map(e => e.dataset.fila + '=' + (e.querySelector('.v, .g')?.textContent ?? '').trim() + (e.querySelector('.sub,.t')?.textContent ? ' [' + e.querySelector('.sub,.t').textContent.trim() + ']' : '')).join(' | '));
  const nota = await p.evaluate(() => document.querySelector('#pul-dock .dock-nota')?.textContent?.slice(0, 120) || ''); console.log(ped, '\n  ', f, '\n   NOTA', nota);
}
await b.close();
