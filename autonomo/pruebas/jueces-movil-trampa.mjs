// Prueba trampa del juez del móvil (autonomo/jueces-movil.mjs): estropea a propósito el modelo muralla viva con CSS
// y comprueba que cada una de las 4 comprobaciones da ❌ (y que sin estropear no da esas señales concretas).
//   node autonomo/pruebas/jueces-movil-trampa.mjs      sale con 0 si las 4 trampas se cazan
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { resolve, dirname } from 'node:path';
import { juzgarMovil } from '../jueces-movil.mjs';

const RAIZ = resolve(dirname(new URL(import.meta.url).pathname), '..', '..');
const PUERTO = await new Promise(r => { const s = createServer().listen(0, () => { const p = s.address().port; s.close(() => r(p)); }); });
const servidor = spawn('python3', ['-m', 'http.server', String(PUERTO)], { cwd: RAIZ, stdio: 'ignore' });
await new Promise(r => setTimeout(r, 1000));
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
const nav = await chromium.launch();
const base = `http://localhost:${PUERTO}/`;
const correr = async (antes) => {
    const out = [];
    await juzgarMovil({ nav, base, ok: t => out.push(t), mal: t => out.push(t), modelos: ['muralla-viva'], anchos: [390], maxLineas: 1000, antes });
    return out.join('\n');
};
// La estropicia: una barra fija alta y sin hueco debajo (1), la figura empujada fuera de la pantalla (2), la frase con
// puntos suspensivos cortada (3) y los rótulos del dibujo a 2 px (4).
const estropear = async (pag) => pag.addStyleTag({ content: `
    body::after { content: 'barra'; position: fixed; left: 0; right: 0; bottom: 0; height: 150px; background: #000; color: #fff; z-index: 99999; pointer-events: none; }
    #mur-raiz, #mur-raiz * { padding-bottom: 0 !important; }
    #mur-raiz svg { position: relative !important; top: 2500px !important; }
    #mur-frase { display: block !important; width: 70px !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; -webkit-line-clamp: none !important; }
    #mur-raiz svg text { font-size: 2px !important; }` });
let fallo = 0;
try {
    const limpio = await correr(null);
    const trampa = await correr(estropear);
    const señales = [
        ['1 tapado por la barra (1a o 1b)', /\n\s+1[ab] .*(tapad)/],
        ['2 la imagen sale de la pantalla al tocar un mando', /\n\s+2 al tocar .*figura/],
        ['3 frase cortada con «…»', /\n\s+3 cortada: .*corta por la derecha/],
        ['4 rótulo de menos de 9 px', /rótulo pequeño: «[^»]*» [0-4]\.\d px/],
    ];
    for (const [nombre, re] of señales) {
        const enTrampa = re.test(trampa), enLimpio = re.test(limpio);
        if (enTrampa && !enLimpio) console.log(`✅ ${nombre}: cazada con la trampa y ausente sin ella`);
        else { fallo++; console.log(`❌ ${nombre}: ${enTrampa ? 'sale también sin trampa (no prueba nada)' : 'NO cazada con la trampa'}`); }
    }
    if (fallo) console.log('\n--- salida con trampa ---\n' + trampa.slice(0, 3000));
} finally { await nav.close(); servidor.kill(); }
console.log(fallo ? `\n❌ ${fallo} trampa(s) sin cazar` : '\n✅ Las 4 trampas se cazan');
process.exit(fallo ? 1 : 0);
