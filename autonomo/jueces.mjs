// Jueces automáticos del proyecto: la lista «Antes de dar un trabajo por terminado» de CLAUDE.md (§12), hecha
// máquina. Sirve para el plan socialista y para cualquier conversación normal.
//
// Uso (desde la raíz del repo):
//   node autonomo/jueces.mjs                         comprobaciones generales (siempre)
//   node autonomo/jueces.mjs --eco                   + pruebas del simulador de eco
//   node autonomo/jueces.mjs --atlas mr              + abre ese capítulo del atlas a 390 y 360 px
//   node autonomo/jueces.mjs --ficha cardiologia:merinoCardiologia:panel-merino-cardio-tabs:mc-vasopresores
//                                                    + abre esa ficha (especialidad:vista:panel:pestaña; la
//                                                      vista puede ir vacía; Hematología usa «home»)
//   node autonomo/jueces.mjs --modelo acidobase-vivo  + la prueba de navegador de ese modelo vivo
//                                                      (autonomo/pruebas/<clave>.mjs: acidobase-vivo | agua-viva |
//                                                      mayeutica-fichas),
//                                                      con el servidor de los jueces; tarda unos minutos
//   node autonomo/jueces.mjs --sin-navegador         solo lo estático (rápido)
// Se pueden repetir --atlas, --ficha y --modelo. Sale con código 1 si algún juez falla.
//
// Comprueba:
//   1. Imágenes: todo <img src> de los .html apunta a un archivo que existe.
//   2. Quiz: ningún tema sin preguntas; ninguna entidad &lt; / &gt; en los bancos; «correcta» dentro de rango.
//   3. Caché: si cambió un .css o js/main.js respecto a origin/main, la fecha ?v= de index.html también cambió.
//   4. Navegador (390 y 360 px): sin errores de consola ni de página, sin ids repetidos, sin desbordamiento; y
//      cada ficha/capítulo pedido abre de verdad, sin desbordar, con sus imágenes cargadas; y en cada ficha se
//      abre también la vista Visual de cada bloque (sin desbordar y sin errores).
//   5. --eco: node --test 'js/modules/eco/pruebas/*.test.mjs' en verde.
//   6. --modelo: la prueba del modelo vivo en verde, a 390 y 360 px: el desborde lateral (0 px) tras cada respuesta,
//      el repaso y cada paso de los casos; sin errores; la entrada desde las fichas y el «← VOLVER» a la ficha.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { execSync, spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { createServer } from 'node:net';

const RAIZ = resolve(dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2);
const pide = (f) => args.includes(f);
const valores = (f) => args.flatMap((a, i) => (a === f && args[i + 1] ? [args[i + 1]] : []));
const fallos = [], avisos = [];
const ok = (t) => console.log(`✅ ${t}`);
const mal = (t) => { fallos.push(t); console.log(`❌ ${t}`); };
const ojo = (t) => { avisos.push(t); console.log(`⚠️  ${t}`); };

function archivos(dir, ext, fuera = []) {
    const out = [];
    for (const n of readdirSync(dir)) {
        const p = join(dir, n);
        if (fuera.some(f => p.includes(f))) continue;
        if (statSync(p).isDirectory()) out.push(...archivos(p, ext, fuera));
        else if (p.endsWith(ext)) out.push(p);
    }
    return out;
}

// ---- 1. Imágenes
{
    const htmls = [join(RAIZ, 'index.html'), ...archivos(join(RAIZ, 'js'), '.html', ['vendor'])];
    let n = 0;
    const rotas = [];
    for (const f of htmls) {
        const s = readFileSync(f, 'utf8');
        for (const m of s.matchAll(/<img[^>]*\ssrc="([^"$]+)"/g)) {
            const src = m[1].split(/[?#]/)[0];
            if (/^(https?:|data:)/.test(src)) continue;
            n++;
            // Los partials se insertan en index.html: las rutas son relativas a la raíz. Los del atlas, a su carpeta.
            if (!existsSync(join(RAIZ, src)) && !existsSync(join(dirname(f), src))) rotas.push(`${f.replace(RAIZ + '/', '')} → ${src}`);
        }
    }
    rotas.length ? mal(`Imágenes sin archivo (${rotas.length}):\n   ${rotas.join('\n   ')}`) : ok(`Imágenes: las ${n} apuntan a un archivo que existe`);
}

// ---- 2. Quiz
{
    const temas = [], preguntas = [];
    for (const f of archivos(join(RAIZ, 'js', 'data'), '-preguntas.js')) {
        const mod = await import(pathToFileURL(f).href);
        const texto = readFileSync(f, 'utf8');
        if (/&lt;|&gt;/.test(texto)) mal(`Quiz: ${f.replace(RAIZ + '/', '')} usa &lt; o &gt; (escribe < y > literales)`);
        for (const v of Object.values(mod)) {
            if (!Array.isArray(v) || !v.length || typeof v[0] !== 'object') continue;
            if ('key' in v[0]) temas.push(...v.map(t => ({ ...t, archivo: f })));
            if ('enunciado' in v[0]) preguntas.push(...v.map(p => ({ ...p, archivo: f })));
        }
    }
    const porTema = new Map();
    for (const p of preguntas) porTema.set(p.tema, (porTema.get(p.tema) || 0) + 1);
    const vacios = temas.filter(t => !porTema.get(t.key)).map(t => `${t.key} (${t.archivo.replace(RAIZ + '/', '')})`);
    vacios.length ? mal(`Quiz: temas sin preguntas: ${vacios.join(', ')}`) : ok(`Quiz: ${temas.length} temas, todos con preguntas (${preguntas.length} preguntas)`);
    const ids = new Map();
    for (const p of preguntas) if (p.id) ids.set(p.id, (ids.get(p.id) || 0) + 1);
    const dupl = [...ids].filter(([, c]) => c > 1).map(([k]) => k);
    dupl.length ? mal(`Quiz: ids de pregunta repetidos: ${dupl.join(', ')}`) : ok('Quiz: ids de pregunta únicos');
    const rango = preguntas.filter(p => p.tipo !== 'redactar' && (!Array.isArray(p.opciones) || p.correcta < 0 || p.correcta >= p.opciones.length));
    rango.length ? mal(`Quiz: «correcta» fuera de rango en ${rango.map(p => p.id).join(', ')}`) : ok('Quiz: respuestas correctas dentro de rango');
}

// ---- 3. Caché
try {
    const cambiados = execSync('git diff --name-only origin/main', { cwd: RAIZ, encoding: 'utf8' }).split('\n')
        .concat(execSync('git ls-files --others --exclude-standard', { cwd: RAIZ, encoding: 'utf8' }).split('\n'));
    const tocaCache = cambiados.some(f => /^css\/.*\.css$/.test(f) || f === 'js/main.js');
    const vDe = (s) => (s.match(/\?v=([\w-]+)/) || [])[1];
    const ahora = vDe(readFileSync(join(RAIZ, 'index.html'), 'utf8'));
    const antes = vDe(execSync('git show origin/main:index.html', { cwd: RAIZ, encoding: 'utf8' }));
    if (!tocaCache) ok('Caché: no cambió ningún .css ni js/main.js');
    else if (ahora !== antes) ok(`Caché: ?v= subido (${antes} → ${ahora})`);
    else mal(`Caché: cambió un .css o js/main.js pero ?v= sigue en ${ahora} (súbelo en index.html)`);
} catch (e) { ojo(`Caché: no se pudo comparar con origin/main (${e.message.split('\n')[0]})`); }

// ---- 4. Navegador
if (!pide('--sin-navegador')) {
    // Puerto libre (antes fijo en 8765: dos tareas a la vez chocaban). Se pide uno al sistema y se libera al momento.
    const PUERTO = await new Promise((ok, ko) => {
        const s = createServer().listen(0, () => { const p = s.address().port; s.close(() => ok(p)); }).on('error', ko);
    });
    const servidor = spawn('python3', ['-m', 'http.server', String(PUERTO)], { cwd: RAIZ, stdio: 'ignore' });
    const base = `http://localhost:${PUERTO}/`;
    try {
        for (let i = 0; i < 50; i++) { try { await fetch(base); break; } catch { await new Promise(r => setTimeout(r, 200)); } }
        const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
        const nav = await chromium.launch();
        const fichas = valores('--ficha').map(f => { const [especialidad, view, panel, tab] = f.split(':'); return { especialidad, view, panel, tab, nombre: f }; });
        const atlas = valores('--atlas');
        for (const ancho of [390, 360]) {
            const pag = await nav.newPage({ viewport: { width: ancho, height: 844 }, hasTouch: true, isMobile: true });
            const errores = [];
            pag.on('pageerror', e => errores.push(`página: ${e.message}`));
            pag.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errores.push(`consola: ${m.text()}`); });
            pag.on('response', r => { if (r.status() >= 400 && !/favicon/.test(r.url())) errores.push(`HTTP ${r.status()} ${r.url().replace(base, '')}`); });
            await pag.goto(base);
            await pag.waitForTimeout(1500);
            const repetidos = await pag.evaluate(() => { const c = {}; document.querySelectorAll('[id]').forEach(e => { c[e.id] = (c[e.id] || 0) + 1; }); return Object.keys(c).filter(k => c[k] > 1); });
            repetidos.length ? mal(`${ancho}px: ids repetidos: ${repetidos.join(', ')}`) : ok(`${ancho}px: ningún id repetido`);
            const desborda = () => pag.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
            const pulsar = (datos) => pag.evaluate((d) => {
                const b = document.createElement('button');
                for (const [k, v] of Object.entries(d)) if (v) b.dataset[k] = v;
                document.body.appendChild(b); b.click(); b.remove();
            }, datos);
            const imagenes = async (sel) => {
                // Las imágenes lazy dentro de un desplegable cerrado no se descargan nunca: se piden ya (eager).
                await pag.evaluate((s) => document.querySelectorAll(`${s} img[loading="lazy"]`).forEach(i => { i.loading = 'eager'; }), sel);
                const n = await pag.evaluate((s) => document.querySelectorAll(`${s} img`).length, sel);
                for (let i = 0; i < n; i++) await pag.evaluate(([s, j]) => document.querySelectorAll(`${s} img`)[j].scrollIntoView(), [sel, i]);
                await pag.waitForTimeout(n ? 1200 : 0);
                return pag.evaluate((s) => [...document.querySelectorAll(`${s} img`)].filter(i => !(i.complete && i.naturalWidth > 0)).map(i => i.getAttribute('src')), sel);
            };
            for (const f of fichas) {
                await pulsar({ especialidad: f.especialidad, view: f.view, panel: f.panel, tab: f.tab });
                await pag.waitForTimeout(900);
                const abierta = await pag.evaluate((t) => { const e = document.getElementById(t); return !!e && e.classList.contains('active') && e.offsetParent !== null; }, f.tab);
                if (!abierta) { mal(`${ancho}px: la ficha ${f.nombre} no se abre`); continue; }
                const sin = await imagenes(`#${f.tab}`);
                const d = await desborda();
                sin.length ? mal(`${ancho}px: ${f.tab}: imágenes sin cargar: ${sin.join(', ')}`)
                    : d > 0 ? mal(`${ancho}px: ${f.tab}: desborda ${d}px`) : ok(`${ancho}px: ficha ${f.tab} abre, sin desbordar, imágenes cargadas`);
                // La vista Visual de cada bloque (interruptor Texto | Visual): se monta al pulsarla y puede desbordar
                // aunque el texto no lo haga (2 px de «Nefronas que quedan», octubre 2026).
                const nVisual = await pag.evaluate((t) => document.querySelectorAll(`#${t}[data-visual] > .vista-toggle button[data-vista="visual"], #${t} [data-visual] > .vista-toggle button[data-vista="visual"]`).length, f.tab);
                for (let i = 0; i < nVisual; i++) {
                    await pag.evaluate(([t, j]) => document.querySelectorAll(`#${t}[data-visual] > .vista-toggle button[data-vista="visual"], #${t} [data-visual] > .vista-toggle button[data-vista="visual"]`)[j].click(), [f.tab, i]);
                    await pag.waitForTimeout(700);
                    const dv = await desborda();
                    if (dv > 0) mal(`${ancho}px: ${f.tab}: la vista Visual del bloque ${i + 1} desborda ${dv}px`);
                    await pag.evaluate(([t, j]) => document.querySelectorAll(`#${t}[data-visual] > .vista-toggle button[data-vista="texto"], #${t} [data-visual] > .vista-toggle button[data-vista="texto"]`)[j].click(), [f.tab, i]);
                }
                if (nVisual) ok(`${ancho}px: ficha ${f.tab}: ${nVisual} vista(s) Visual abiertas`);
            }
            for (const k of atlas) {
                await pulsar({ especialidad: 'eco', ecoAtlas: k });
                await pag.waitForTimeout(2500);
                const estado = await pag.evaluate(() => {
                    const c = document.getElementById('at-capitulo'), cuerpo = document.getElementById('at-cuerpo');
                    return { visible: !!c && !c.hidden && c.offsetParent !== null, texto: cuerpo?.innerText.length || 0, figura: !!cuerpo?.querySelector('canvas, svg') };
                });
                if (!estado.visible || estado.texto < 500) { mal(`${ancho}px: el capítulo ${k} del atlas no se abre (o está casi vacío)`); continue; }
                estado.figura ? ok(`${ancho}px: atlas ${k} abre con figura`) : mal(`${ancho}px: atlas ${k}: no se montó ninguna figura (canvas o svg)`);
                const sin = await imagenes('#at-cuerpo');
                const d = await desborda();
                if (sin.length) mal(`${ancho}px: atlas ${k}: imágenes sin cargar: ${sin.join(', ')}`);
                if (d > 0) mal(`${ancho}px: atlas ${k}: desborda ${d}px`);
            }
            const d = await desborda();
            if (d > 0 && !fichas.length && !atlas.length) mal(`${ancho}px: la página desborda ${d}px`);
            errores.length ? mal(`${ancho}px: errores:\n   ${[...new Set(errores)].join('\n   ')}`) : ok(`${ancho}px: sin errores de consola ni de red`);
            await pag.close();
        }
        await nav.close();
        // ---- 6. Modelos vivos: su prueba de navegador, con este mismo servidor
        for (const clave of valores('--modelo')) {
            const prueba = join(RAIZ, 'autonomo', 'pruebas', `${clave}.mjs`);
            if (!existsSync(prueba)) { mal(`Modelo vivo «${clave}»: no existe autonomo/pruebas/${clave}.mjs`); continue; }
            const r = await new Promise(fin => {
                const hijo = spawn('node', [prueba, base], { cwd: RAIZ });
                let salida = '';
                hijo.stdout.on('data', d => { salida += d; });
                hijo.stderr.on('data', d => { salida += d; });
                hijo.on('close', codigo => fin({ codigo, salida }));
            });
            const lineas = r.salida.split('\n');
            const malas = lineas.filter(l => l.startsWith('❌'));
            const buenas = lineas.filter(l => l.startsWith('✅')).length;
            r.codigo === 0 ? ok(`Modelo vivo «${clave}»: ${buenas} comprobaciones a favor (390 y 360 px)`)
                : mal(`Modelo vivo «${clave}»: ${malas.length || 'la prueba falló'}\n   ${(malas.length ? malas : lineas.slice(-8)).slice(0, 15).join('\n   ')}`);
        }
    } catch (e) { mal(`Navegador: ${e.message}`); }
    finally { servidor.kill(); }
}

// ---- 5. Eco
if (pide('--eco')) {
    try {
        const salida = execSync("node --test 'js/modules/eco/pruebas/*.test.mjs' 2>&1", { cwd: RAIZ, encoding: 'utf8', maxBuffer: 1 << 26 });
        const linea = (k) => (salida.match(new RegExp(`^# ${k} (\\d+)`, 'm')) || [])[1];
        ok(`Eco: ${linea('pass')} pruebas en verde${linea('todo') !== '0' ? ` (${linea('todo')} pendientes marcadas)` : ''}`);
    } catch (e) {
        const s = String(e.stdout || '');
        mal(`Eco: fallan pruebas (${(s.match(/^# fail (\d+)/m) || [])[1] || '?'}):\n   ${s.split('\n').filter(l => /^not ok/.test(l.trim())).slice(0, 10).join('\n   ')}`);
    }
}

console.log(`\n${fallos.length ? `❌ ${fallos.length} juez(es) en contra` : '✅ Todos los jueces a favor'}${avisos.length ? ` · ${avisos.length} aviso(s)` : ''}`);
process.exit(fallos.length ? 1 : 0);
