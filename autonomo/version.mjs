// Versión de la app en todas sus piezas (lección 7 del bloque 1, aprobada por el usuario el 20/10/2026).
//
// El móvil guardaba piezas viejas: solo el CSS y main.js llevaban ?v=, y una versión nueva podía arrancar con
// módulos de la anterior (la app no cargaba, o no salía la Mayéutica). Este script pone la misma versión en todo:
//   · el ?v= de las hojas de estilo y de los scripts de index.html;
//   · un «import map» en index.html que da a cada módulo .js/.mjs de js/ su ?v= (el navegador lo aplica también a
//     los import() y a los import relativos entre módulos);
//   · los fragmentos HTML (data-include) y los capítulos del atlas los piden con esa misma ?v= (core/include.js y
//     eco/atlas/atlas.js la leen de main.js).
//
// Uso (desde la raíz del repo):
//   node autonomo/version.mjs 20261020-2    pone esa versión en todo y regenera el mapa
//   node autonomo/version.mjs               regenera el mapa con la versión que ya tiene index.html
//   node autonomo/version.mjs --comprobar   no escribe: falla (código 1) si el mapa no está al día
// Las dos formas fallan si queda alguna marca de conflicto de git (<<<<<<< o >>>>>>>) en un archivo del repositorio
// (regla aprobada por el usuario el 30/10/2026: en movil-existente el tablero subió con marcas de una fusión).
// Los jueces (autonomo/jueces.mjs) llaman a --comprobar.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execFileSync } from 'node:child_process';

const RAIZ = new URL('..', import.meta.url).pathname;
const INDEX = join(RAIZ, 'index.html');
const INICIO = '<!-- versiones: lo escribe autonomo/version.mjs; no lo edites a mano -->';
const FIN = '<!-- /versiones -->';

function modulos(dir) {
    return readdirSync(dir).flatMap(n => {
        const p = join(dir, n);
        if (statSync(p).isDirectory()) return n === 'pruebas' || n === 'herramientas' ? [] : modulos(p);
        return /\.m?js$/.test(n) ? [relative(RAIZ, p)] : [];
    }).sort();
}

export function mapa(version) {
    // main.js lo carga su <script> con su propia ?v=; el resto, por el mapa.
    const imports = Object.fromEntries(modulos(join(RAIZ, 'js'))
        .filter(f => f !== 'js/main.js')
        .map(f => [`./${f}`, `./${f}?v=${version}`]));
    return `${INICIO}\n<script type="importmap">\n${JSON.stringify({ imports }, null, 1)}\n</script>\n${FIN}`;
}

export function versionDe(html) {
    return (html.match(/js\/main\.js\?v=([\w-]+)/) || [])[1];
}

// Archivos con marcas de conflicto, «archivo:línea»; [] si no hay. git grep mira lo seguido y lo nuevo sin ignorar.
export function marcasDeConflicto() {
    try {
        const salida = execFileSync('git', ['grep', '-n', '-I', '--untracked', '-E', '^(<{7}|>{7})( |$)'], { cwd: RAIZ, encoding: 'utf8' });
        return salida.split('\n').filter(Boolean).map(l => l.split(':').slice(0, 2).join(':'));
    } catch (e) {
        if (e.status === 1) return [];
        throw e;
    }
}

export function comprobar() {
    const html = readFileSync(INDEX, 'utf8');
    const v = versionDe(html);
    const fallos = [];
    if (!v) fallos.push('index.html no carga js/main.js con ?v=');
    const otras = [...html.matchAll(/\?v=([\w-]+)/g)].map(m => m[1]).filter(x => x !== v);
    if (otras.length) fallos.push(`hay piezas con otra versión en index.html: ${[...new Set(otras)].join(', ')}`);
    const i = html.indexOf(INICIO), f = html.indexOf(FIN);
    if (i < 0 || f < 0) fallos.push('index.html no tiene el mapa de versiones (node autonomo/version.mjs)');
    else if (html.slice(i, f + FIN.length) !== mapa(v)) fallos.push('el mapa de versiones no está al día (falta o sobra algún módulo): node autonomo/version.mjs');
    const primerModulo = html.search(/<script[^>]*type="module"/);
    if (i >= 0 && primerModulo >= 0 && i > primerModulo) fallos.push('el mapa de versiones debe ir antes del primer <script type="module">');
    const marcas = marcasDeConflicto();
    if (marcas.length) fallos.push(`marcas de conflicto de git sin resolver en: ${marcas.join(', ')}`);
    return { version: v, fallos };
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
    const arg = process.argv[2];
    if (arg === '--comprobar') {
        const { version, fallos } = comprobar();
        if (fallos.length) { console.error(fallos.map(f => '❌ ' + f).join('\n')); process.exit(1); }
        console.log(`✅ Versión ${version} en todas las piezas`);
    } else {
        const marcas = marcasDeConflicto();
        if (marcas.length) { console.error(`❌ Marcas de conflicto de git sin resolver en: ${marcas.join(', ')}. Resuélvelas antes de poner la versión.`); process.exit(1); }
        let html = readFileSync(INDEX, 'utf8');
        const v = arg || versionDe(html);
        if (!/^\d{8}(-\d+)?$/.test(v)) { console.error('Versión no válida (AAAAMMDD o AAAAMMDD-N):', v); process.exit(1); }
        html = html.replace(/\?v=[\w-]+/g, `?v=${v}`);
        const i = html.indexOf(INICIO), f = html.indexOf(FIN);
        if (i >= 0 && f >= 0) html = html.slice(0, i) + mapa(v) + html.slice(f + FIN.length);
        else html = html.replace('</head>', `${mapa(v)}\n</head>`);
        writeFileSync(INDEX, html);
        console.log(`Versión ${v} en index.html y en ${modulos(join(RAIZ, 'js')).length - 1} módulos`);
    }
}
