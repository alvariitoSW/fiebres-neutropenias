// Mira el DOM del estado tep-lisis: dónde está «× placa», si sale la Fig. 22.2 y si se ve el chip al telar. Uso: node g6a-dom.mjs <url-base>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await p.goto(process.argv[2] + 'index.html'); await p.waitForFunction(() => window.__vsoPruebas);
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'vasoVivo', vasoVivo: 'tep-lisis' }); document.body.append(t); t.click(); });
await p.waitForTimeout(800);
console.log(JSON.stringify(await p.evaluate(() => {
  const vis = e => !!e && e.offsetParent !== null;
  const x = [...document.querySelectorAll('#vso-raiz *, .vso-raiz *')].filter(e => e.children.length === 0 && /^\s*[×x✕]\s*placa/i.test(e.textContent)).map(e => e.tagName + '#' + e.id + '.' + e.className + ' <' + e.parentElement.className + '> vis=' + vis(e));
  const lupas = [...document.querySelectorAll('[data-vso-lupa]')].map(e => e.dataset.vsoLupa + ':' + vis(e));
  const lib = document.getElementById('vso-libro');
  return { x, lupas, libro: lib && [lib.hidden, vis(lib), lib.dataset.clave], origen: vis(document.getElementById('vso-fila-tep-origen')) };
}), null, 1));
await b.close();
