// Jueces de forma (lecciones 4, 5 y 6 del bloque 1, aprobadas por el usuario el 20/10/2026): lo que hasta entonces
// cazaban a ojo el auditor o el profesor. Los llama autonomo/jueces.mjs (la documentación de uso está arriba de él).
//
//   A. Forma de las preguntas (estático, siempre): en cada banco de Mayéutica de la app (BANCOS, abajo)
//      - la buena es la opción más larga en ≤ ⅓ de los tests y la más corta en ≤ ⅓ (un empate cuenta como extremo);
//      - ninguna posición tiene la buena en más de la mitad de los tests (en el orden en que se ve: si el motor
//        baraja, con su propia función de barajar, leída de su código);
//      - una sola buena; cada opción falsa con su «porque» (≥ 30 letras: qué le habría pasado al paciente);
//      - «encuentra el error» con 0, 1 o 2 errores, cada uno con su frase buena (`c`);
//      - y ningún nombre interno (B) en el texto que se enseña de preguntas, casos y conceptos.
//   B. Nombres internos a la vista (navegador): el texto visible (innerText con los <details> abiertos) de cada
//      modo del modelo vivo (Explorar en cada estado, Conceptos, Mayéutica tras contestar la primera) y de cada
//      vista de la ficha (Texto, Visual, Mayéutica): ni ids de ficha, ni «§», «maqueta», «diseño», «REGLAS»,
//      «cobertura», «encargo», «Caso A1», rutas de archivo ni <code> visible. Excepciones: EXCEPCIONES, abajo.
//   C. Rótulos de los dibujos (navegador, 390 px): en cada SVG visible, todo <text> mide ≥ 7,5 px de alto real
//      (getBoundingClientRect) y ningún par de rótulos se solapa más de un 30 % del menor (cuerpo
//      de la letra; no cuentan los tapados por otra pieza, como la lupa). En el estado inicial y en
//      3-4 estados de cada modelo vivo, y en cada vista de las fichas.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

/* ---------- Los bancos de Mayéutica y el motor que los pinta ---------- */
// motor: el .js que pinta las opciones; de él se lee si baraja (barajar(q.opciones…)) y con qué función. Las fichas y
// los modelos vivos de Libros usan el motor común (core/mayeutica-motor.js); el ácido-base vivo, el suyo propio.
export const BANCOS = [
    { nombre: 'río y mar', datos: 'js/data/agua-viva-data.js', motor: 'js/core/mayeutica-motor.js' },
    { nombre: 'ácido-base vivo', datos: 'js/data/acidobase-vivo-data.js', motor: 'js/modules/nefrologia/acidobase-vivo.js' },
    { nombre: 'capilar vivo', datos: 'js/data/capilar-vivo-data.js', motor: 'js/core/mayeutica-motor.js' },
    { nombre: 'catéter vivo', datos: 'js/data/cateter-vivo-data.js', motor: 'js/core/mayeutica-motor.js' },
    { nombre: 'muralla viva', datos: 'js/data/muralla-viva-data.js', motor: 'js/core/mayeutica-motor.js' },
    { nombre: 'telar vivo', datos: 'js/data/telar-vivo-data.js', motor: 'js/core/mayeutica-motor.js' },
    { nombre: 'inmersión viva', datos: 'js/data/inmersion-viva-data.js', motor: 'js/core/mayeutica-motor.js' },
    { nombre: 'fichas · fluidos', datos: 'js/data/mayeutica/b1-fluidos.js', motor: 'js/core/mayeutica-motor.js' },
    { nombre: 'fichas · hemodinámica', datos: 'js/data/mayeutica/b1-hemodinamica.js', motor: 'js/core/mayeutica-motor.js' },
    { nombre: 'fichas · oxígeno', datos: 'js/data/mayeutica/b1-oxigeno.js', motor: 'js/core/mayeutica-motor.js' },
    { nombre: 'fichas · accesos', datos: 'js/data/mayeutica/b1-accesos.js', motor: 'js/core/mayeutica-motor.js' },
    { nombre: 'fichas · sin modelo', datos: 'js/data/mayeutica/b1-sin-modelo.js', motor: 'js/core/mayeutica-motor.js' },
    { nombre: 'fichas · sangre (bloque 2)', datos: 'js/data/mayeutica/b2-sangre.js', motor: 'js/core/mayeutica-motor.js' },
    { nombre: 'fichas · hemostasia (bloque 2)', datos: 'js/data/mayeutica/b2-hemostasia.js', motor: 'js/core/mayeutica-motor.js' },
    { nombre: 'fichas · el shock (bloque 3A)', datos: 'js/data/mayeutica/b3.js', motor: 'js/core/mayeutica-motor.js' },
    { nombre: 'shock vivo', datos: 'js/data/shock-vivo-mayeutica.js', motor: 'js/core/mayeutica-motor.js' },
    // el vaso usa las preguntas de las fichas 4-6 (las mismas) más 4 propias de «predice y compruébalo»
    { nombre: 'vaso que sangra', datos: 'js/data/vaso-vivo-data.js', motor: 'js/core/mayeutica-motor.js' },
    { nombre: 'corazón eléctrico', datos: 'js/data/ritmo-vivo-preguntas.js', motor: 'js/core/mayeutica-motor.js' },
    { nombre: 'receptor vivo', datos: 'js/data/receptor-vivo-mayeutica.js', motor: 'js/core/mayeutica-motor.js' },
];

/* ---------- Los modelos vivos en el navegador ---------- */
// enlace: el enlace cruzado que lo abre (sin el estado); estados: el inicial y 3-4 más (con lupas y pestañas
// distintas); modo: el selector del botón de cada modo.
const modosLibros = p => ({ explorar: `#${p}-modo-explorar`, conceptos: `#${p}-modo-conceptos`, mayeutica: `#${p}-modo-preguntas` });
export const MODELOS = {
    'agua-viva': { raiz: '#agv-raiz', enlace: { especialidad: 'libros', view: 'aguaViva' }, clave: 'aguaViva', modo: modosLibros('agv'),
        estados: ['inicio', 'salino', 'hemorragia', 'hiponatremia', 'osmolalidad'] },
    'acidobase-vivo': { raiz: '#abv-raiz', enlace: { especialidad: 'nefrologia', view: 'acidobase' }, clave: 'acidobaseVivo',
        modo: { explorar: '#abv-raiz [data-modo="explorar"]', conceptos: '#abv-raiz [data-modo="conceptos"]', mayeutica: '#abv-raiz [data-modo="preguntas"]' },
        estados: ['paso-0', 'paso-3', 'diarrea', 'salicilatos', 'vomitos'] },
    'capilar-vivo': { raiz: '#cpv-raiz', enlace: { especialidad: 'libros', view: 'capilarVivo' }, clave: 'capilarVivo', modo: modosLibros('cpv'),
        estados: ['normal', 'bajo-gasto', 'sepsis', 'co', 'capno-normal'] },
    'cateter-vivo': { raiz: '#ctv-raiz', enlace: { especialidad: 'libros', view: 'cateterVivo' }, clave: 'cateterVivo', modo: modosLibros('ctv'),
        estados: ['calibre', 'oclusion-trombo', 'biopelicula', 'punta', 'eco-eje-corto'] },
    'muralla-viva': { raiz: '#mur-raiz', enlace: { especialidad: 'libros', view: 'murallaViva' }, clave: 'murallaViva', modo: modosLibros('mur'),
        estados: ['sano', 'boca-uci', 'ulcera', 'sdd'] },
    'telar-vivo': { raiz: '#tel-raiz', enlace: { especialidad: 'libros', view: 'telarVivo' }, clave: 'telarVivo', modo: modosLibros('tel'),
        estados: ['sano', 'tih', 'medias', 'neuroeje', 'filtro'] },
    'inmersion-viva': { raiz: '#inm-raiz', enlace: { especialidad: 'libros', view: 'inmersionViva' }, clave: 'inmersionViva', modo: modosLibros('inm'),
        estados: ['dolor-oculto', 'rass-objetivo', 'delirio', 'pris'] },
    // El vaso que sangra: Explorar | Mayéutica (sin Conceptos: cada estado lleva su explicación guiada)
    'vaso-vivo': { raiz: '#vso-raiz', enlace: { especialidad: 'libros', view: 'vasoVivo' }, clave: 'vasoVivo', modo: { explorar: '#vso-modo-explorar', mayeutica: '#vso-modo-preguntas' },
        estados: ['sano', 'herida', 'hit-argatroban', 'cid', 'transfusion-plaquetas', 'pfc-inr', 'hemorragia-masiva'] },
    // El shock a pie de cama (bloque 3): Explorar | ¿Qué shock es? | Mayéutica
    'shock-vivo': { raiz: '#shv-raiz', enlace: { especialidad: 'libros', view: 'shockVivo' }, clave: 'shockVivo', modo: { explorar: '#shv-modo-explorar', mayeutica: '#shv-modo-may' },
        estados: ['hemo', 'septico', 'cardio', 'tapon', 'tep', 'balon', 'impella', 'ecmo', 'qs'] },
    // El corazón eléctrico: el estado va en data-ritmo-vivo
    'ritmo-vivo': { raiz: '#rtv-raiz', enlace: { especialidad: 'libros', view: 'ritmoVivo' }, clave: 'ritmoVivo', modo: { explorar: '#rtv-modo-explorar', mayeutica: '#rtv-modo-preguntas' },
        estados: ['sinusal', 'fa:dilt', 'nodal', 'wpw', 'torsade', 'fv', 'stemi'] },
    // El receptor vivo (b3)
    'receptor-vivo': { raiz: '#rcv-raiz', enlace: { especialidad: 'libros', view: 'receptorVivo' }, clave: 'receptorVivo', modo: { explorar: '#rcv-modo-explorar', mayeutica: '#rcv-modo-preguntas' },
        // el monitor y la Fig. 1 también son la imagen de sus mandos (las cifras y la dosis), no solo la lupa
        figuras: ['#rcv-monitor', '#rcv-fig1'],
        estados: ['na-baja', 'na-alta', 'dobutamina', 'betabloqueo', 'cocaina', 'bronquio'] },
};
// Las fichas del bloque 1 (Libros → Marino → Fundamentos): se leen del DOM, todas las del cuaderno.
export const B1 = { especialidad: 'libros', view: 'marinoFundamentos', panel: 'panel-marino-fund-tabs' };

/* ---------- B. Nombres internos ---------- */
const L = '\\p{L}\\p{N}';
const palabra = p => new RegExp(`(?<![${L}])${p}(?![${L}])`, 'gu');
export const PROHIBIDOS = [
    ['id de ficha', /(?<![\p{L}\p{N}-])(mar|mr|mc|ma|mn)-[a-z0-9-]{3,}/gu],
    ['«§»', /§/g],
    ['«maqueta»', palabra('[Mm]aquetas?')],
    ['«diseño»', palabra('[Dd]ise[ñn]os?')],
    ['«REGLAS»', palabra('REGLAS')],
    ['«cobertura»', palabra('[Cc]obertura')],
    ['«encargo»', palabra('[Ee]ncargos?')],
    ['«Caso A1»', /(?<![\p{L}])[Cc]aso [A-E]\d/gu],
    ['ruta de archivo', /(?<![\p{L}\p{N}])(js|docs)\/|\.mjs(?![\p{L}])|\.html(?![\p{L}])/gu],
];
// Excepciones: [motivo, patrón que se tacha del texto antes de buscar]. Cada una, comentada.
export const EXCEPCIONES = [
    // «Cobertura» antibiótica (Accesos vasculares: bacteriemia por catéter) no es la cobertura del plan
    ['cobertura antibiótica', /[Cc]obertura (antibiótica|empírica|eficaz|de gramnegativos|del SARM|frente a)|sin cobertura/gu],
];
export function nombresInternos(texto) {
    let t = String(texto).replace(/<[^>]+>/g, ' ')   // las etiquetas (y sus href) no se ven
        .replace(/\{f:[^}]*\}/g, ' ');                   // {f:ficha#línea}: el ácido-base vivo lo pinta como botón con el título
    for (const [, re] of EXCEPCIONES) t = t.replace(re, ' ');
    const hallados = [];
    for (const [que, re] of PROHIBIDOS) for (const m of t.matchAll(re)) {
        const a = Math.max(0, m.index - 25), b = Math.min(t.length, m.index + m[0].length + 25);
        hallados.push(`${que}: «…${t.slice(a, b).replace(/\s+/g, ' ').trim()}…»`);
    }
    return hallados;
}

/* ---------- A. Forma de las preguntas ---------- */
const sinHtml = s => String(s ?? '').replace(/<[^>]+>/g, '').replace(/\{[a-z]+:[^}]*\}/gi, '0,00');   // {ph:23.2:10} → una cifra
const esPregunta = o => o && typeof o === 'object' && ['test', 'destapa', 'error'].includes(o.tipo) && typeof o.enunciado === 'string';
// Claves internas: no se enseñan (ids, fuentes, estados del modelo, mandos…). El resto de cadenas, sí.
const INTERNAS = new Set(['id', 'fuente', 'tipo', 'modelo', 'modeloVivo', 'estado', 'mirar', 'ocultar', 'lupa', 'mandos', 'comprobar', 'bueno',
    'solucion', 'prep', 'ir', 'ancla', 'serie', 'grupo', 'href', 'donde', 'pag', 'ficha', 'pestana', 'visitar', 'e', 'p', 'nuevo', 'obj', 'clave', 'vista', 'tab', 'panel',
    'calc', 'ids']);   // calc «Nombre (mr-gap)» y calculadora.ids: el motor los pinta como botón con el nombre

function cadenasVisibles(o, out = [], vistos = new Set()) {
    if (typeof o === 'string') { out.push(o); return out; }
    if (!o || typeof o !== 'object' || vistos.has(o)) return out;
    vistos.add(o);
    if (o.f && o.id && o.sitio) return out;   // una cita {f, id, sitio, p}: lleva ids de ficha, no texto que se enseñe
    if (Array.isArray(o)) o.forEach(x => cadenasVisibles(x, out, vistos));
    else for (const [k, v] of Object.entries(o)) if (!INTERNAS.has(k)) cadenasVisibles(v, out, vistos);
    return out;
}
function recoger(o, out = new Map(), vistos = new Set()) {
    if (!o || typeof o !== 'object' || vistos.has(o)) return out;
    vistos.add(o);
    if (esPregunta(o) && !out.has(o.id)) out.set(o.id, o);
    for (const v of Array.isArray(o) ? o : Object.values(o)) recoger(v, out, vistos);
    return out;
}
// La función de barajar del propio motor (o null si pinta las opciones en su orden).
function barajarDel(RAIZ, motor) {
    const src = readFileSync(join(RAIZ, motor), 'utf8');
    if (!/barajar\(\s*q\.opciones/.test(src)) return null;   // pinta las opciones en su orden
    let archivo = join(RAIZ, motor), codigo = src;
    if (!/function barajar\s*\(/.test(codigo)) {
        const imp = codigo.match(/import\s*\{[^}]*\bbarajar\b[^}]*\}\s*from\s*'([^']+)'/);
        if (!imp) throw new Error(`${motor}: llama a barajar() pero no se encuentra de dónde sale`);
        archivo = resolve(dirname(archivo), imp[1]); codigo = readFileSync(archivo, 'utf8');
    }
    const hash = codigo.match(/function hash\(s\)[^\n]*/)?.[0];
    const bar = codigo.match(/function barajar\s*\(ops, id\)[\s\S]*?\n\}/)?.[0];
    if (!hash || !bar) throw new Error(`${archivo}: no se pudo leer barajar()`);
    return new Function(`${hash}\n${bar}\nreturn barajar;`)();
}

export async function juzgarFormaPreguntas({ RAIZ, ok, mal }) {
    for (const b of BANCOS) {
        if (!existsSync(join(RAIZ, b.datos))) { mal(`Forma · ${b.nombre}: no existe ${b.datos}`); continue; }
        const mod = await import(pathToFileURL(join(RAIZ, b.datos)).href);
        let barajar;
        try { barajar = barajarDel(RAIZ, b.motor); } catch (e) { mal(`Forma · ${b.nombre}: ${e.message}`); continue; }
        const preguntas = [...recoger(Object.values(mod)).values()];
        const tests = preguntas.filter(q => q.tipo === 'test');
        const m = [];
        let larga = 0, corta = 0; const pos = [];
        for (const q of tests) {
            const buenas = q.opciones.filter(o => o.ok);
            if (buenas.length !== 1) { m.push(`${q.id}: ${buenas.length} opciones buenas`); continue; }
            const lar = q.opciones.map(o => sinHtml(o.t).length), lb = sinHtml(buenas[0].t).length;
            if (lb === Math.max(...lar)) larga++;
            if (lb === Math.min(...lar)) corta++;
            const orden = barajar ? barajar(q.opciones, q.id) : q.opciones;
            const k = orden.findIndex(o => o.ok); pos[k] = (pos[k] || 0) + 1;
            const sinPorque = q.opciones.filter(o => !o.ok && sinHtml(o.porque).trim().length < 30);
            if (sinPorque.length) m.push(`${q.id}: ${sinPorque.length} opción(es) falsa(s) sin su «porque» («${sinHtml(sinPorque[0].t).slice(0, 40)}»)`);
        }
        const n = tests.length, tercio = n / 3;
        if (larga > tercio) m.push(`la buena es la más larga en ${larga} de ${n} tests (máx. ${Math.floor(tercio)})`);
        if (corta > tercio) m.push(`la buena es la más corta en ${corta} de ${n} tests (máx. ${Math.floor(tercio)})`);
        const posTxt = [...pos].map((c, i) => `${i + 1}ª: ${c || 0}`).join(', ');
        const peor = Math.max(0, ...pos.map(c => c || 0));
        if (peor > n / 2) m.push(`la buena cae en la misma posición en ${peor} de ${n} tests (${posTxt}; ${barajar ? 'barajadas' : 'sin barajar'})`);
        for (const q of preguntas.filter(q => q.tipo === 'error')) {
            const malas = (q.frases || []).filter(f => f.mal);
            if (malas.length > 2) m.push(`${q.id}: «encuentra el error» con ${malas.length} errores (0, 1 o 2)`);
            if (malas.some(f => !sinHtml(f.c).trim())) m.push(`${q.id}: un error sin su frase buena (c)`);
        }
        // Lección 5, en los datos: el texto de preguntas, casos y conceptos que se enseña (el navegador solo ve la primera)
        const visibles = Object.entries(mod).flatMap(([k, v]) => /^MAYEUTICA_/.test(k)
            ? Object.values(v).flatMap(f => cadenasVisibles({ entrada: f.entrada, guia: f.guia, examen: f.examen, casos: f.casos }))
            : /^(PREGUNTAS|CASOS|CONCEPTOS)$/.test(k) ? cadenasVisibles(v) : []);
        const internos = [...new Set(visibles.flatMap(nombresInternos))];
        if (internos.length) m.push(`nombres internos en el texto (${internos.length}): ${internos.slice(0, 6).join(' · ')}${internos.length > 6 ? ' …' : ''}`);
        m.length ? mal(`Forma · ${b.nombre} (${n} tests; larga ${larga}, corta ${corta}; ${posTxt}):\n   ${m.join('\n   ')}`)
            : ok(`Forma · ${b.nombre}: ${n} tests (la buena la más larga en ${larga}, la más corta en ${corta}; ${posTxt}), errores y «porque» en regla`);
    }
}

/* ---------- B y C en el navegador ---------- */
// En la página: el texto visible de `sel` con los <details> abiertos (y se cierran después), y los <code> visibles.
function leerTexto(sel) {
    const r = document.querySelector(sel); if (!r) return null;
    const cerrados = [...r.querySelectorAll('details:not([open])')]; cerrados.forEach(d => { d.open = true; });
    const t = r.innerText;
    const visible = e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden';
    const codes = [...r.querySelectorAll('code')].filter(visible).map(c => c.textContent.trim().slice(0, 40));
    cerrados.forEach(d => { d.open = false; });
    return { t, codes };
}
// En la página: los rótulos <text> visibles de los SVG dentro de `sel`: los pequeños y los que se pisan.
function medirRotulos(sel) {
    const r = document.querySelector(sel); if (!r) return null;
    // Como en el texto, los plegables se abren (y se cierran al final): sus dibujos también se miran
    const cerrados = [...r.querySelectorAll('details:not([open])')]; cerrados.forEach(d => { d.open = true; });
    const visible = el => {
        if (!el.getClientRects().length || (el.checkVisibility && !el.checkVisibility({ contentVisibilityAuto: true }))) return false;
        for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
            const cs = getComputedStyle(e);
            if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false;
        }
        return true;
    };
    // Los rótulos, por dibujo (el <svg> de fuera). Cada dibujo se centra en pantalla para ver si algo lo tapa.
    const porDibujo = new Map();
    for (const t of r.querySelectorAll('svg text')) {
        if (!t.textContent.trim() || !visible(t)) continue;
        let svg = t.ownerSVGElement; while (svg?.ownerSVGElement) svg = svg.ownerSVGElement;
        if (!porDibujo.has(svg)) porDibujo.set(svg, []);
        porDibujo.get(svg).push(t);
    }
    const y0 = window.scrollY, cajas = [];
    const fijo = el => { for (let e = el; e; e = e.parentElement) if (/fixed|sticky/.test(getComputedStyle(e).position)) return true; return false; };
    for (const [svg, textos] of porDibujo) {
        const c0 = svg.getBoundingClientRect();   // (scrollIntoView no mueve la página en algunos modelos; scrollTo sí)
        window.scrollTo({ top: window.scrollY + c0.top + c0.height / 2 - innerHeight / 2, behavior: 'instant' });
        const c = svg.getBoundingClientRect();
        const dibujo = svg.id || svg.getAttribute('aria-label')?.slice(0, 30) || svg.closest('[id]')?.id || 'svg';
        for (const t of textos) {
            const b = t.getBoundingClientRect(); if (!b.width || !b.height) continue;
            // Fuera del recuadro de su dibujo no se ve (recortado por el SVG)
            if (b.right <= c.left || b.left >= c.right || b.bottom <= c.top || b.top >= c.bottom) continue;
            // Tapado por otro dibujo (la lupa sobre la lámina): no se ve, no cuenta. Un botón transparente encima (la
            // tapa de la cama 7) o el dock fijo de abajo no tapan: solo otro <svg>, <canvas> o <img>.
            const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
            if (cx >= 0 && cy >= 0 && cx < innerWidth && cy < innerHeight) {
                const tapa = document.elementFromPoint(cx, cy)?.closest('svg, canvas, img');
                if (tapa && !svg.contains(tapa) && !fijo(tapa)) continue;
            }
            // La letra en pantalla (cuerpo × escala del dibujo), para quien lo arregle: la caja la redondea el navegador
            const m = t.getScreenCTM(), letra = m ? parseFloat(getComputedStyle(t).fontSize) * Math.hypot(m.a, m.b) : 0;
            cajas.push({ s: t.textContent.trim().slice(0, 24), dibujo, letra, x: b.left, y: b.top + window.scrollY, w: b.width, h: b.height });
        }
    }
    window.scrollTo({ top: y0, behavior: 'instant' });
    cerrados.forEach(d => { d.open = false; });
    const pequenos = cajas.filter(c => c.h < 7.5).map(c => `«${c.s}» ${c.h.toFixed(1)} px (letra ${c.letra.toFixed(1)} px; ${c.dibujo})`);
    const pisados = [];
    for (let i = 0; i < cajas.length; i++) for (let j = i + 1; j < cajas.length; j++) {
        const a = cajas[i], b = cajas[j];
        // La caja de un <text> lleva el hueco de la fuente (por encima de las mayúsculas y por debajo de la línea): para
        // el solape vale el cuerpo de la letra, sin el cuarto de arriba ni el 15 % de abajo (el «pH» sobre el «7,40»).
        const ay = a.y + a.h * 0.25, ah = a.h * 0.6, by = b.y + b.h * 0.25, bh = b.h * 0.6;
        const iw = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), ih = Math.min(ay + ah, by + bh) - Math.max(ay, by);
        if (iw <= 0 || ih <= 0) continue;
        const inter = iw * ih, menor = Math.min(a.w * ah, b.w * bh);
        // Excepción: el «halo» (el mismo rótulo dos veces en el mismo sitio, uno de contorno debajo) no es un choque
        const union = a.w * ah + b.w * bh - inter;
        if (a.s === b.s && inter / union > 0.9) continue;
        if (inter / menor > 0.3) pisados.push(`«${a.s}» y «${b.s}» ${Math.round(100 * inter / menor)} % (${a.dibujo})`);
    }
    return { n: cajas.length, pequenos, pisados };
}

export async function juzgarFormaNavegador({ nav, base, ok, mal, fichas = [], modelos = [], todo = false }) {
    const claves = [...new Set([...modelos.filter(k => MODELOS[k]), ...(todo ? Object.keys(MODELOS) : [])])];
    const conFichas = todo || modelos.includes('mayeutica-fichas');
    if (!claves.length && !fichas.length && !conFichas) return;
    const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
    const pag = await ctx.newPage();
    const errores = [];
    pag.on('pageerror', e => errores.push(e.message));
    await pag.goto(base);
    await pag.waitForTimeout(1500);
    const pulsarEnlace = (datos) => pag.evaluate((d) => {
        const b = document.createElement('button');
        for (const [k, v] of Object.entries(d)) if (v != null) b.dataset[k] = v;
        document.body.appendChild(b); b.click(); b.remove();
    }, datos);
    const clic = (sel) => pag.evaluate((s) => { const e = document.querySelector(s); if (e) e.click(); return !!e; }, sel);
    // Contesta la primera pregunta visible (para ver también la explicación y lo que sale tras contestar)
    const contestarPrimera = (raiz) => pag.evaluate(async (r) => {
        const R = document.querySelector(r); const vis = e => e && e.getClientRects().length > 0;
        const espera = () => new Promise(f => setTimeout(f, 250));
        const empezar = [...R.querySelectorAll('button')].find(b => vis(b) && /^(Empezar|Seguir)/.test(b.textContent.trim()));
        if (empezar && ![...R.querySelectorAll('[data-accion="ops"], [data-q="ops"], [data-accion="destapa"]')].some(vis)) { empezar.click(); await espera(); }
        const ops = [...R.querySelectorAll('[data-accion="ops"], [data-q="ops"]')].find(vis);
        if (ops) { ops.click(); await espera(); const op = [...R.querySelectorAll('[data-op]')].find(vis); if (op) { op.click(); await espera(); return true; } }
        return false;
    }, raiz);
    // Junta lo que se ve en cada momento de un modelo o una ficha: cada hallazgo sale una vez, con sus momentos
    const juez = () => {
        const nombres = new Map(), rotulos = new Map(), momentos = []; let nRot = 0;
        const anotar = (mapa, h, m) => { if (!mapa.has(h)) mapa.set(h, []); if (!mapa.get(h).includes(m)) mapa.get(h).push(m); };
        const lineas = (mapa) => [...mapa].slice(0, 10).map(([h, ms]) => `${h}  [${ms.length === momentos.length && ms.length > 1 ? 'en todos' : ms.join(', ')}]`)
            .concat(mapa.size > 10 ? [`… y ${mapa.size - 10} más`] : []).join('\n   ');
        return {
            mirar(momento, texto, rot) {
                momentos.push(momento);
                if (texto) {
                    for (const h of new Set(nombresInternos(texto.t))) anotar(nombres, h, momento);
                    if (texto.codes.length) anotar(nombres, `<code> visible: ${texto.codes.slice(0, 3).map(c => `«${c}»`).join(', ')}`, momento);
                }
                if (rot) {
                    nRot += rot.n;
                    rot.pequenos.forEach(x => anotar(rotulos, `pequeño: ${x}`, momento));
                    rot.pisados.forEach(x => anotar(rotulos, `se pisan: ${x}`, momento));
                }
            },
            cerrar(quien) {
                nombres.size ? mal(`Nombres internos · ${quien} (${nombres.size}):\n   ${lineas(nombres)}`)
                    : ok(`Nombres internos · ${quien}: ninguno a la vista en ${momentos.length} momentos`);
                if (!nRot) return;
                rotulos.size ? mal(`Rótulos · ${quien} (${rotulos.size}):\n   ${lineas(rotulos)}`)
                    : ok(`Rótulos · ${quien}: todos ≥ 7,5 px y sin pisarse en ${momentos.length} momentos`);
            },
        };
    };

    for (const k of claves) {
        const M = MODELOS[k], J = juez();
        for (const estado of M.estados) {
            await pulsarEnlace({ ...M.enlace, [M.clave]: estado });
            await pag.waitForTimeout(900);
            // Si se quedó en otro modo, a Explorar (sin volver a pulsarlo si ya lo está: el ácido-base reinicia el paso)
            if (await pag.evaluate(s => { const b = document.querySelector(s); if (b && b.getAttribute('aria-selected') !== 'true') { b.click(); return true; } return false; }, M.modo.explorar)) await pag.waitForTimeout(400);
            const abierto = await pag.evaluate(r => !!document.querySelector(r)?.offsetParent, M.raiz);
            if (!abierto) { mal(`Forma · ${k}: no se abre con «${estado}»`); continue; }
            J.mirar(`Explorar·${estado}`, await pag.evaluate(leerTexto, M.raiz), await pag.evaluate(medirRotulos, M.raiz));
        }
        for (const modo of ['conceptos', 'mayeutica']) {
            if (!M.modo[modo]) continue;   // un modelo sin ese modo (el vaso no tiene Conceptos)
            if (!(await clic(M.modo[modo]))) { mal(`Forma · ${k}: no hay botón ${modo}`); continue; }
            await pag.waitForTimeout(500);
            if (modo === 'mayeutica') await contestarPrimera(M.raiz);
            J.mirar(modo === 'mayeutica' ? 'Mayéutica' : 'Conceptos', await pag.evaluate(leerTexto, M.raiz), await pag.evaluate(medirRotulos, M.raiz));
        }
        await clic(M.modo.explorar);
        J.cerrar(k);
    }

    const tabs = [...fichas.map(f => ({ ...f, nombre: f.tab }))];
    if (conFichas) {
        const ids = await pag.evaluate(p => [...document.querySelectorAll(`#${p} .tab-content`)].map(t => t.id), B1.panel);
        for (const id of ids) if (!tabs.some(t => t.tab === id)) tabs.push({ ...B1, tab: id, nombre: id });
        ok(`Forma: ${ids.length} fichas de Marino · Fundamentos en la lista`);
    }
    for (const f of tabs) {
        await pulsarEnlace({ especialidad: f.especialidad, view: f.view, panel: f.panel, tab: f.tab });
        await pag.waitForTimeout(600);
        const vistas = await pag.evaluate(t => {
            const e = document.getElementById(t); if (!e || !e.offsetParent) return null;
            return [...new Set([...e.querySelectorAll('.vista-toggle button[data-vista]')].map(b => b.dataset.vista))];
        }, f.tab);
        if (!vistas) { mal(`Forma · la ficha ${f.nombre} no se abre`); continue; }
        const J = juez();
        for (const v of vistas.length ? vistas : ['texto']) {
            await pag.evaluate(([t, v]) => document.querySelectorAll(`#${t} .vista-toggle button[data-vista="${v}"]`).forEach(b => b.click()), [f.tab, v]);
            await pag.waitForTimeout(v === 'texto' ? 200 : 700);
            if (v === 'mayeutica') await contestarPrimera(`#${f.tab}`);
            J.mirar(v === 'mayeutica' ? 'Mayéutica' : v === 'visual' ? 'Visual' : 'Texto', await pag.evaluate(leerTexto, `#${f.tab}`), await pag.evaluate(medirRotulos, `#${f.tab}`));
        }
        await pag.evaluate(t => document.querySelectorAll(`#${t} .vista-toggle button[data-vista="texto"]`).forEach(b => b.click()), f.tab);
        J.cerrar(f.nombre);
    }
    if (errores.length) mal(`Forma: errores de página mientras se recorría:\n   ${[...new Set(errores)].slice(0, 5).join('\n   ')}`);
    await ctx.close();
}
