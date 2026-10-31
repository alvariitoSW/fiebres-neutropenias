// Captura de ejercicios del cuaderno Neuro con las zonas destapadas. Uso: node radio-neuro-captura.mjs <url-base> <carpeta> id1 id2…
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [base, out, ...ids] = process.argv.slice(2);
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })).newPage();
await p.goto(base); await p.waitForSelector('#radio-caja-neuro-marshall', { state: 'attached' });
await p.evaluate(async () => { const m = await import('./js/core/corkboard.js'); const v = document.getElementById('pif-radio-neuro-view'); document.querySelectorAll('#app-content > *, body > *').forEach(() => {}); window.__m = m; });
for (const id of ids) {
  const ok = await p.evaluate(async (id) => {
    const t = document.getElementById('rl-' + id).closest('.tab-content');
    for (let n = t; n && n !== document.body; n = n.parentElement) { n.hidden = false; if (getComputedStyle(n).display === 'none') n.style.display = 'block'; }
    document.getElementById('rl-' + id + '-destapar')?.click();
    return !!t;
  }, id);
  const el = p.locator('#rl-' + id); await el.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
  await el.screenshot({ path: `${out}/${id}.png`, timeout: 8000 }).catch(e => console.log('fallo', id, e.message.slice(0, 80)));
}
await b.close();
