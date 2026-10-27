// Dos sellos a la vez en un monitor de 390 px: no se montan. Uso: node tope-dos-sellos.mjs <png> (servidor en :8873)
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 500 } });
await p.goto('http://localhost:8873/index.html'); await p.waitForTimeout(500);
const r = await p.evaluate(async () => {
  const { crearTope } = await import('/js/core/tope.js');
  const m = document.createElement('div'); m.style.cssText = 'position:fixed;left:0;top:0;width:390px;height:' + (window.__h || 460) + 'px;background:#222;z-index:99999';
  document.body.append(m); const t = crearTope({ monitor: m, dock: null });
  const largo = 'El flujo retrógrado sube la poscarga del VI y la PCP; el pulmón se inunda y la aórtica no abre.';
  t.poner('a', { nivel: 'sello', titulo: 'Edema de pulmón', texto: largo, origen: 'ficha · p. 48' });
  t.poner('b', { nivel: 'sello', titulo: 'El ECMO sube la poscarga del VI', texto: largo, origen: 'ficha · p. 48' });
  const q = [...m.querySelectorAll('.tope-sello')].map((e) => ({ oculto: e.hidden, r: e.hidden ? null : e.getBoundingClientRect().toJSON() }));
  const s = m.querySelector('.tope-sellos'); return [q, s.scrollHeight, s.clientHeight, getComputedStyle(s).maxHeight];
});
console.log(JSON.stringify(r)); await p.screenshot({ path: process.argv[2] || '/tmp/plan-socialista/b3/r64-sellos.png' }); await b.close();
