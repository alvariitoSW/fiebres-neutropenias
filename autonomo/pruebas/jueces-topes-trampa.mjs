// Prueba trampa del juez de topes (autonomo/jueces-topes.mjs): estropea a propósito el modelo agua viva en memoria
// y comprueba que cada una de las 6 trampas da ❌ con su motivo (y que sin estropear no da ninguno de esos motivos).
//   node autonomo/pruebas/jueces-topes-trampa.mjs      sale con 0 si todas las trampas se cazan
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { resolve, dirname } from 'node:path';
import { juzgarTopes } from '../jueces-topes.mjs';

const RAIZ = resolve(dirname(new URL(import.meta.url).pathname), '..', '..');
const PUERTO = await new Promise(r => { const s = createServer().listen(0, () => { const p = s.address().port; s.close(() => r(p)); }); });
const servidor = spawn('python3', ['-m', 'http.server', String(PUERTO)], { cwd: RAIZ, stdio: 'ignore' });
await new Promise(r => setTimeout(r, 1000));
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
const nav = await chromium.launch();
const base = `http://localhost:${PUERTO}/`;
const correr = async (antes) => {
    const out = [];
    await juzgarTopes({ nav, base, ok: t => out.push('✅ ' + t), mal: t => out.push('❌ ' + t), modelos: ['agua-viva'], antes });
    return out.join('\n');
};
// Cada trampa: cómo se estropea (en la página, ya cargada) y qué frase tiene que aparecer en el informe.
const TRAMPAS = [
    ['NaN en el texto visible', /«NaN» en el texto/, pag => pag.evaluate(() => setInterval(() => { const f = document.getElementById('agv-frase'); if (f && !f.textContent.includes('NaN')) f.append(' Na NaN'); }, 20))],
    ['cifra imposible (PAS 600)', /PAS imposible/, pag => pag.evaluate(() => { const p = document.createElement('p'); p.textContent = 'PAS 600 mmHg'; document.querySelector('#agv-raiz').append(p); })],
    ['pH 9,4', /pH imposible/, pag => pag.evaluate(() => { const p = document.createElement('p'); p.textContent = 'pH 9,4'; document.querySelector('#agv-raiz').append(p); })],
    ['desborde lateral', /desborde lateral/, pag => pag.addStyleTag({ content: '#agv-raiz::after { content: ""; display: block; width: 900px; height: 2px; }' })],
    ['error de consola', /error de consola/, pag => pag.evaluate(() => setInterval(() => console.error('trampa'), 50))],
    ['botón con tope que no se apaga ni avisa', /tope sin consecuencia/, pag => pag.evaluate(() => {
        // El botón nunca se apaga y la frase viva y los avisos quedan congelados como estaban
        Object.defineProperty(HTMLButtonElement.prototype, 'disabled', { get() { return false; }, set() {}, configurable: true });
        const R = document.querySelector('#agv-raiz'); const cong = new Map();
        new MutationObserver(() => { R.querySelectorAll('[id$="-frase"], [class*="sello"], [class*="aviso"], [class*="tope"], [role=alert]').forEach(e => { if (!cong.has(e)) cong.set(e, e.textContent); else if (e.textContent !== cong.get(e)) e.textContent = cong.get(e); }); })
            .observe(R, { childList: true, subtree: true, characterData: true });
    })],
];
let fallos = 0;
const limpio = await correr(null);
for (const [, re] of TRAMPAS) if (re.test(limpio)) { fallos++; console.log(`❌ sin estropear ya sale «${re}»`); }
for (const [nombre, re, estropear] of TRAMPAS) {
    const informe = await correr(estropear);
    const caza = re.test(informe) && /^❌/m.test(informe);
    console.log(`${caza ? '✅' : '❌'} trampa «${nombre}»: ${caza ? 'cazada' : 'NO cazada'}`);
    if (!caza) { fallos++; console.log(informe.split('\n').slice(0, 6).join('\n')); }
}
await nav.close(); servidor.kill();
console.log(fallos ? `❌ ${fallos} trampa(s) sin cazar` : '✅ todas las trampas cazadas');
process.exit(fallos ? 1 : 0);
