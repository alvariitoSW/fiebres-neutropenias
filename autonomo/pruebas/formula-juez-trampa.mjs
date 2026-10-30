// Prueba trampa del juez de la fórmula (autonomo/jueces-formula.mjs): altera a mano el resultado pintado de cada
// renglón (le suma 1 a su última cifra) y comprueba que el juez da ❌; sin alterar, que da ✅. Además, la cuenta sola
// con renglones de ejemplo de los 5 modelos (sin navegador).
//   node autonomo/pruebas/formula-juez-trampa.mjs [modelo…]    sale con 0 si todo se caza (por defecto, río y mar y filtro)
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { resolve, dirname } from 'node:path';
import { juzgarFormula, comprobarRenglon } from '../jueces-formula.mjs';

let fallos = 0;
const di = (bien, t) => { console.log(`${bien ? '✅' : '❌'} ${t}`); if (!bien) fallos++; };
// [números, resultado, ¿cuadra?]
const EJEMPLOS = [
    ['1,34 × 7,0 × 0,971 + 0,003 × 90', '9,4', true], ['1,34 × 7,0 × 0,971 + 0,003 × 90', '9,5', false],
    ['5,03 × 1,34 × 14,0 × 0,97 × 10', '915', true], ['5,0 × 1,34 × 14,0 × 0,97 × 10', '1.910', false],
    ['2 × 140 + 90/18 + 14/2,8', '290', true], ['2 × 140 + 90/18', '286', false],
    ['55 − 15 − 30', '10,0', true], ['40 − 15 − 30 = −5,0 (negativa: no filtra)', '0,0', true], ['40 − 15 − 30 = −4,0 (negativa: no filtra)', '0,0', false],
    ['25 × 70', '1.750', true], ['25 × 70', '1.751', false],
    ['20,1 cm × 3,14 cm² (Ø 2,0 cm) × 70,0 lpm ÷ 1000', '4,4', true], ['20,1 cm × 3,14 cm² (Ø 2,0 cm) × 70,0 lpm ÷ 1000', '4,5', false],
];
for (const [numeros, resultado, cuadra] of EJEMPLOS) {
    const m = comprobarRenglon({ numeros, resultado });
    di(!m === cuadra, `cuenta «${numeros} → ${resultado}»: ${m || 'cuadra'}`);
}

const modelos = process.argv.slice(2).length ? process.argv.slice(2) : ['agua-viva', 'filtro'];
const RAIZ = resolve(dirname(new URL(import.meta.url).pathname), '..', '..');
const PUERTO = await new Promise(r => { const s = createServer().listen(0, () => { const p = s.address().port; s.close(() => r(p)); }); });
const servidor = spawn('python3', ['-m', 'http.server', String(PUERTO)], { cwd: RAIZ, stdio: 'ignore' });
await new Promise(r => setTimeout(r, 1000));
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
const nav = await chromium.launch();
const correr = async (antes) => {
    const out = [];
    await juzgarFormula({ nav, base: `http://localhost:${PUERTO}/`, ok: t => out.push('✅ ' + t), mal: t => out.push('❌ ' + t), modelos, antes });
    return out;
};
// Cada vez que se pinta un resultado, se le suma 1 a su última cifra (9,4 → 9,5; 1.750 → 1.751)
const alterar = pag => pag.evaluate(() => {
    const tocar = b => { if (b.dataset.trampa === b.textContent) return; b.textContent = b.textContent.replace(/(\d)(?!.*\d)/, d => String((+d + 1) % 10)); b.dataset.trampa = b.textContent; };
    new MutationObserver(() => document.querySelectorAll('.fml-s b').forEach(tocar)).observe(document.body, { childList: true, subtree: true, characterData: true });
});
const limpio = await correr(null), trampa = await correr(alterar);
modelos.forEach((k, i) => {
    di(/^✅/.test(limpio[i] || ''), `${k} sin alterar: ${(limpio[i] || 'sin informe').split('\n')[0]}`);
    di(/^❌/.test(trampa[i] || '') && /no cuadran/.test(trampa[i]), `${k} con el resultado alterado a mano: ${(trampa[i] || 'sin informe').split('\n').slice(0, 2).join(' · ')}`);
});
await nav.close(); servidor.kill();
console.log(fallos ? `❌ ${fallos} comprobación(es) fallidas` : '✅ el juez de la fórmula caza los resultados alterados');
process.exit(fallos ? 1 : 0);
