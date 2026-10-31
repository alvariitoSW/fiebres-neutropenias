// Juez del móvil (REGLAS §4.8 R1; tarea jueces-movil). Lo llama autonomo/jueces.mjs con --ficha, --modelo y --forma.
// A 390 y 360 px (isMobile, hasTouch, reducedMotion) y en los momentos de jueces-forma (Explorar en cada estado,
// Conceptos, Mayéutica tras contestar; en las fichas, cada vista Texto/Visual/Estudiar), comprueba:
//   1. Tapado por la barra de abajo: «barra» = elemento visible con position:fixed pegado al fondo y de menos de la
//      mitad de alto (el dock de los modelos, la hoja del cuaderno). Falla si (a) al bajar hasta el final algún texto o
//      botón del modelo queda bajo la barra, o (b) la frase viva, el enunciado o «Siguiente» quedan tapados > 30 %
//      en la posición en que el usuario los ve (tras tocar un mando; tras contestar).
//   2. La imagen sigue a la vista: tras tocar hasta 6 mandos (botones, range con una flecha del teclado), la figura
//      principal (el svg/canvas más grande, o una de las `figuras` que declare el modelo) tiene ≥ 50 % de su alto en
//      pantalla y sobre la barra, y la frase viva se ve.
//   3. Frase cortada con «…»: text-overflow:ellipsis con scrollWidth > clientWidth + 1, -webkit-line-clamp con
//      scrollHeight > clientHeight + 1, y <text> de SVG visible que acaba en «…» o «...».
//   4. Letra ≥ 8 px (decisión del usuario, 27/10/2026; antes 9): <text> de SVG (cuerpo × escala de getScreenCTM) y texto HTML (font-size calculado).
import { MODELOS, B1 } from './jueces-forma.mjs';
// Letra mínima en pantalla (REGLAS §4.8 R1): 8 px, decisión del usuario del 27/10/2026 (con 9 salían cientos de rótulos).
const LETRA_MIN = 8;

// Frase viva y enunciado de cada modelo (leídos de sus .html: <p id="xxx-frase"> y el <p class="xxx-pregunta"> del
// motor común core/mayeutica-motor.js; el ácido-base vivo pinta el suyo con la clase abv-pregunta). Todos tienen frase.
const FRASES = {
    'agua-viva': '#agv-frase', 'acidobase-vivo': '#abv-frase', 'capilar-vivo': '#cpv-frase', 'cateter-vivo': '#ctv-frase',
    'muralla-viva': '#mur-frase', 'telar-vivo': '#tel-frase', 'inmersion-viva': '#inm-frase', 'vaso-vivo': '#vso-frase', 'shock-vivo': '#shv-frase-txt', 'pulmon-vivo': '#pul-frase-txt',
    'ritmo-vivo': '#rtv-frase',
    'receptor-vivo': '#rcv-frase', 'iones-vivos': '#iov-frase',
};
const ENUNCIADO = 'p[class*="-pregunta"]';
const SIGUIENTE = '[data-accion="sig"]';

/* ---------- En la página ---------- */
// Lo que se mide en un momento. `o`: { raiz, frase, enunciado, siguiente, figura, final }
function medir(o) {
    const LETRA_MIN = o.letraMin;   // medir corre en la página: la constante llega por el argumento
    const R = document.querySelector(o.raiz); if (!R) return null;
    const cerrados = [...R.querySelectorAll('details:not([open])')]; cerrados.forEach(d => { d.open = true; });
    const visible = el => {
        if (!el.getClientRects().length || (el.checkVisibility && !el.checkVisibility({ contentVisibilityAuto: true }))) return false;
        for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
            const cs = getComputedStyle(e);
            if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false;
        }
        return true;
    };
    const fijoAbajo = el => { const cs = getComputedStyle(el); return (cs.position === 'fixed' || cs.position === 'sticky') && visible(el); };
    const barras = [...document.querySelectorAll('body *')].filter(e => {
        if (!fijoAbajo(e)) return false; const r = e.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.bottom >= innerHeight - 2 && r.top <= innerHeight && r.height < innerHeight / 2 && r.top > 0;
    });
    const enBarra = el => barras.some(b => b.contains(el));
    const topeBarra = barras.length ? Math.min(...barras.map(b => b.getBoundingClientRect().top)) : innerHeight;
    // Cuánto de la caja está bajo la barra (0-1) y cuánto se ve (dentro de la pantalla y sobre la barra, 0-1)
    const bajoBarra = (r, e) => e && enBarra(e) ? 0 : r.height ? Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, topeBarra)) / r.height : 0;
    const seVe = (r, e) => e && enBarra(e) ? 1 : r.height ? Math.max(0, Math.min(r.bottom, topeBarra) - Math.max(r.top, 0)) / r.height : 0;
    const res = { barras: barras.length, tapado: [], frase: null, enunciado: null, figura: null, elipsis: [], pequenos: [], letraHtml: [] };
    const txt = e => (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30);
    // (b) y 2: en la posición actual
    const frase = o.frase && [...document.querySelectorAll(o.frase)].find(visible);
    if (o.frase) { const r = frase?.getBoundingClientRect(); res.frase = frase ? { bajo: bajoBarra(r, frase), ve: seVe(r, frase), t: txt(frase) } : { ausente: true }; }
    for (const [k, sel] of [['enunciado', o.enunciado], ['siguiente', o.siguiente]]) {
        if (!sel) continue;
        const e = [...R.querySelectorAll(sel)].filter(visible).pop();
        if (e) { const r = e.getBoundingClientRect(); res[k] = { bajo: bajoBarra(r, e), t: txt(e) }; }
    }
    if (o.figura) {
        const f = [...R.querySelectorAll('svg, canvas')].filter(e => visible(e) && !e.closest('button, [aria-hidden="true"]'))
            .map(e => ({ e, r: e.getBoundingClientRect() })).sort((a, b) => b.r.width * b.r.height - a.r.width * a.r.height)[0];
        res.figura = f ? { ve: seVe(f.r), id: f.e.id || f.e.closest('[id]')?.id || f.e.tagName } : { ausente: true };
        // Un modelo puede declarar otras imágenes que también valen (`figuras` en MODELOS): el monitor del receptor
        // es la imagen de sus cifras; si alguna se ve al menos a la mitad, la imagen sigue a la vista
        for (const sel of o.figuras || []) {
            const e = R.querySelector(sel);
            if (e && visible(e)) { const v = seVe(e.getBoundingClientRect()); if (res.figura.ausente || v > res.figura.ve) res.figura = { ve: v, id: e.id || sel }; }
        }
    }
    // (a) al final de la página: nada del modelo queda bajo la barra
    if (o.final && barras.length) {
        const y0 = scrollY; scrollTo({ top: 1e6, behavior: 'instant' });
        const tope = Math.min(...barras.map(b => b.getBoundingClientRect().top));
        for (const e of R.querySelectorAll('*')) {
            if (enBarra(e) || !visible(e) || e.closest('svg') && e.tagName !== 'svg') continue;
            const propio = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) || e.matches('button, input, select, a[href]');
            if (!propio || [...barras].some(b => e.contains(b))) continue;
            const r = e.getBoundingClientRect(); if (!r.height || !r.width || r.bottom <= tope || r.top >= innerHeight) continue;
            const cx = Math.min(Math.max(r.left + r.width / 2, 1), innerWidth - 1), cy = Math.min(r.top + r.height / 2, innerHeight - 1);
            if (cy < tope) continue;
            const arriba = document.elementFromPoint(cx, cy);
            if (arriba && enBarra(arriba)) res.tapado.push(`«${txt(e)}» (${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''})`);
        }
        scrollTo({ top: y0, behavior: 'instant' });
    }
    // 3: frases cortadas
    for (const e of R.querySelectorAll('*')) {
        if (!visible(e) || e.closest('svg')) continue;
        const cs = getComputedStyle(e);
        if (cs.textOverflow === 'ellipsis' && e.scrollWidth > e.clientWidth + 1) res.elipsis.push(`«${txt(e)}» corta por la derecha (${e.scrollWidth} > ${e.clientWidth} px; ${e.tagName.toLowerCase()}${e.id ? '#' + e.id : '.' + ([...e.classList][0] || '')})`);
        const lc = cs.webkitLineClamp || cs.getPropertyValue('-webkit-line-clamp');
        if (lc && lc !== 'none' && e.scrollHeight > e.clientHeight + 1) res.elipsis.push(`«${txt(e)}» corta a ${lc} líneas (${e.scrollHeight} > ${e.clientHeight} px; ${e.tagName.toLowerCase()}${e.id ? '#' + e.id : '.' + ([...e.classList][0] || '')})`);
    }
    const nombreDibujo = svg => svg.id || svg.getAttribute('aria-label')?.slice(0, 30) || svg.closest('[id]')?.id || 'svg';
    for (const t of R.querySelectorAll('svg text')) {
        if (!t.textContent.trim() || !visible(t)) continue;
        let svg = t.ownerSVGElement; while (svg?.ownerSVGElement) svg = svg.ownerSVGElement;
        const b = t.getBoundingClientRect(); if (!b.width || !b.height) continue;
        const c = svg.getBoundingClientRect();
        if (b.right <= c.left || b.left >= c.right || b.bottom <= c.top || b.top >= c.bottom) continue;
        const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
        if (cx >= 0 && cy >= 0 && cx < innerWidth && cy < innerHeight) {
            const tapa = document.elementFromPoint(cx, cy)?.closest('svg, canvas, img');
            if (tapa && !svg.contains(tapa) && !enBarra(tapa)) continue;
        }
        const s = t.textContent.trim();
        if (/(…|\.\.\.)$/.test(s)) res.elipsis.push(`«${s.slice(0, 30)}» rótulo de SVG recortado por código (${nombreDibujo(svg)})`);
        const m = t.getScreenCTM(), letra = m ? parseFloat(getComputedStyle(t).fontSize) * Math.hypot(m.a, m.b) : 0;
        if (letra < LETRA_MIN) res.pequenos.push(`«${s.slice(0, 24)}» ${letra.toFixed(1)} px (${nombreDibujo(svg)})`);
    }
    const vistos = new Set();
    for (const e of R.querySelectorAll('*')) {
        if (e.closest('svg') || !visible(e)) continue;
        if (![...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
        const px = parseFloat(getComputedStyle(e).fontSize);
        if (px < LETRA_MIN) { const k = `«${txt(e)}» ${px.toFixed(2)} px (${e.tagName.toLowerCase()}${e.id ? '#' + e.id : '.' + ([...e.classList][0] || '')})`; if (!vistos.has(k)) { vistos.add(k); res.letraHtml.push(k); } }
    }
    cerrados.forEach(d => { d.open = false; });
    return res;
}

// Mandos tocables del modelo (botones y range), en el orden del DOM, sin los de cambiar de modo ni «volver».
function mandos(raiz) {
    const R = document.querySelector(raiz); if (!R) return [];
    const vis = e => e.getClientRects().length && !e.closest('[hidden], details:not([open])') && getComputedStyle(e).visibility !== 'hidden';
    const lista = [...R.querySelectorAll('button, input[type=range]')].filter(e => vis(e) && !e.disabled && !e.closest('[role=tablist]') && !e.matches('[role=tab], .back-btn, [data-modo], [data-especialidad], [data-resaltar], [data-view], [data-volver], [class*="-org-ir"], [data-accion]') && !/^Explícame/.test(e.textContent.trim()));
    // Primero los de la barra de abajo (los mandos del dock), luego los del panel
    const enFijo = e => { for (let x = e; x; x = x.parentElement) if (getComputedStyle(x).position === 'fixed') return true; return false; };
    lista.sort((a, b) => enFijo(b) - enFijo(a));
    lista.forEach((e, i) => e.setAttribute('data-jm', String(i)));
    return lista.map((e, i) => ({ i, t: (e.textContent.trim() || e.getAttribute('aria-label') || e.id || e.className.toString().split(' ')[0]).slice(0, 24), range: e.type === 'range' }));
}

/* ---------- En Node ---------- */
export async function juzgarMovil({ nav, base, ok, mal, fichas = [], modelos = [], todo = false, antes = null, anchos = [390, 360], maxLineas = 10 }) {
    const claves = [...new Set([...modelos.filter(k => MODELOS[k]), ...(todo ? Object.keys(MODELOS) : [])])];
    const conFichas = todo || modelos.includes('mayeutica-fichas');
    if (!claves.length && !fichas.length && !conFichas) return;
    for (const ancho of anchos) {
        const ctx = await nav.newContext({ viewport: { width: ancho, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
        const pag = await ctx.newPage();
        await pag.goto(base); await pag.waitForTimeout(1500);
        if (antes) await antes(pag);
        const pulsarEnlace = d => pag.evaluate(d => { const b = document.createElement('button'); for (const [k, v] of Object.entries(d)) if (v != null) b.dataset[k] = v; document.body.appendChild(b); b.click(); b.remove(); }, d);
        const clic = sel => pag.evaluate(s => { const e = document.querySelector(s); if (e) e.click(); return !!e; }, sel);
        const contestarPrimera = raiz => pag.evaluate(async r => {
            const R = document.querySelector(r); const vis = e => e && e.getClientRects().length > 0; const espera = () => new Promise(f => setTimeout(f, 250));
            const empezar = [...R.querySelectorAll('button')].find(b => vis(b) && /^(Empezar|Seguir)/.test(b.textContent.trim()));
            if (empezar && ![...R.querySelectorAll('[data-accion="ops"], [data-q="ops"], [data-accion="destapa"]')].some(vis)) { empezar.click(); await espera(); }
            const ops = [...R.querySelectorAll('[data-accion="ops"], [data-q="ops"]')].find(vis);
            if (ops) { ops.click(); await espera(); const op = [...R.querySelectorAll('[data-op]')].find(vis); if (op) { op.click(); await espera(); return true; } }
            return false;
        }, raiz);
        // Hallazgos agrupados por momento (como el juez de forma)
        const juez = () => {
            const mapa = new Map(), momentos = []; let toques = 0;
            const anotar = (h, m) => { if (!mapa.has(h)) mapa.set(h, []); if (!mapa.get(h).includes(m)) mapa.get(h).push(m); };
            return {
                anotar, toca: () => { toques++; },
                momento: m => { if (!momentos.includes(m)) momentos.push(m); },
                cerrar(quien) {
                    const ord = [...mapa].sort((a, b) => a[0].localeCompare(b[0])), cuenta = {};
                    for (const [h] of mapa) { const c = h.match(/^\d[ab]?/)[0]; cuenta[c] = (cuenta[c] || 0) + 1; }
                    // hasta 2 por categoría (para que 100 rótulos pequeños no escondan un «…»), y el resto hasta el máximo
                    const vistos = {}, primeros = ord.filter(([h]) => { const c = h.match(/^\d[ab]?/)[0]; vistos[c] = (vistos[c] || 0) + 1; return vistos[c] <= Math.max(2, Math.floor(maxLineas / 5)); });
                    const l = primeros.slice(0, maxLineas).map(([h, ms]) => `${h}  [${ms.length === momentos.length && ms.length > 1 ? 'en todos' : ms.slice(0, 4).join(', ') + (ms.length > 4 ? '…' : '')}]`).concat(mapa.size > maxLineas ? [`… y ${mapa.size - maxLineas} más`] : []);
                    mapa.size ? mal(`Móvil ${ancho}px · ${quien} (${Object.entries(cuenta).map(([c, n]) => c + ':' + n).join(' ')}):\n   ${l.join('\n   ')}`) : ok(`Móvil ${ancho}px · ${quien}: nada tapado, imagen a la vista, sin «…» y letra ≥ ${LETRA_MIN} px en ${momentos.length} momentos y ${toques} toques`);
                },
            };
        };
        // Pasa los resultados de una medición al juez
        const volcar = (J, m, r, ctxo) => {
            if (!r) return;
            J.momento(m);
            r.tapado.slice(0, 3).forEach(t => J.anotar(`1a tapado por la barra al final de la página: ${t}`, m));
            if (r.frase && !r.frase.ausente && r.frase.bajo > 0.3) J.anotar(`1b frase viva tapada ${Math.round(100 * r.frase.bajo)} % por la barra («${r.frase.t}»)`, m);
            if (r.enunciado && r.enunciado.bajo > 0.3) J.anotar(`1b enunciado tapado ${Math.round(100 * r.enunciado.bajo)} % por la barra («${r.enunciado.t}»)`, m);
            if (r.siguiente && r.siguiente.bajo > 0.3) J.anotar(`1b botón «${r.siguiente.t}» tapado ${Math.round(100 * r.siguiente.bajo)} % por la barra`, m);
            r.elipsis.forEach(x => J.anotar(`3 cortada: ${x}`, m));
            r.pequenos.forEach(x => J.anotar(`4 rótulo pequeño: ${x}`, m));
            r.letraHtml.forEach(x => J.anotar(`4 texto pequeño: ${x}`, m));
        };
        // Toca hasta `n` mandos (de `desde` en adelante, repartidos) y mide tras cada toque
        const tocar = async (J, momento, o, n, desde = 0) => {
            const lista = await pag.evaluate(mandos, o.raiz);
            if (!lista.length) return;
            const util = lista.slice(0, Math.max(n, Math.min(lista.length, 3 * n)));   // los de la barra primero
            const elegidos = []; for (let k = 0; k < n && k < util.length; k++) elegidos.push(util[(k * 2 + desde) % util.length]);
            const unicos = new Set(); for (let k = elegidos.length - 1; k >= 0; k--) if (unicos.has(elegidos[k].i)) elegidos.splice(k, 1); else unicos.add(elegidos[k].i);
            for (const md of elegidos) {
                const loc = pag.locator(`${o.raiz} [data-jm="${md.i}"]`).first();
                const m = `${momento}→${md.t || 'mando ' + md.i}`;
                // El toque anterior pudo rehacer la barra (otra familia, otro ritmo): el mando numerado ya no existe
                if (!(await loc.count())) continue;
                try {
                    await loc.tap({ timeout: 2500 });
                    if (md.range) await pag.keyboard.press('ArrowRight');
                } catch (e) { if (/not visible|not enabled|detached|not attached/.test(String(e.message))) continue;   // un mando de un panel cerrado: no es de este momento
                    J.anotar(`2 mando no tocable «${md.t}» (${String(e.message).split('\n').slice(-4).join(' ').replace(/\s+/g, ' ').slice(-200)})`, m); continue; }
                J.toca();
                await pag.waitForTimeout(250);
                const r = await pag.evaluate(medir, { ...o, final: false, letraMin: LETRA_MIN });
                await pag.evaluate(() => document.querySelectorAll('dialog[open]').forEach(d => d.close()));
                if (!r) continue;
                volcar(J, m, { ...r, elipsis: [], pequenos: [], letraHtml: [], tapado: [] });
                if (r.figura && !r.figura.ausente && r.figura.ve < 0.5) J.anotar(`2 al tocar «${md.t}» la figura (${r.figura.id}) se ve solo al ${Math.round(100 * r.figura.ve)} %`, m);
                if (r.frase && (r.frase.ausente || r.frase.ve < 0.7)) J.anotar(`2 al tocar «${md.t}» la frase viva ${r.frase.ausente ? 'no está visible' : 'se ve solo al ' + Math.round(100 * r.frase.ve) + ' %'}`, m);
            }
        };

        for (const k of claves) {
            const M = MODELOS[k], J = juez(), o = { raiz: M.raiz, frase: FRASES[k], figura: true, figuras: M.figuras, final: true };
            let i = 0;
            for (const estado of M.estados) {
                await pulsarEnlace({ ...M.enlace, [M.clave]: estado });
                await pag.waitForTimeout(900);
                if (await pag.evaluate(s => { const b = document.querySelector(s); if (b && b.getAttribute('aria-selected') !== 'true') { b.click(); return true; } return false; }, M.modo.explorar)) await pag.waitForTimeout(400);
                if (!(await pag.evaluate(r => !!document.querySelector(r)?.offsetParent, M.raiz))) { mal(`Móvil ${ancho}px · ${k}: no se abre con «${estado}»`); continue; }
                volcar(J, `Explorar·${estado}`, await pag.evaluate(medir, { ...o, letraMin: LETRA_MIN }));
                await tocar(J, `Explorar·${estado}`, o, i === 0 ? 6 : 3, i); i++;
            }
            for (const modo of ['conceptos', 'mayeutica']) {
                if (!M.modo[modo] || !(await clic(M.modo[modo]))) continue;
                await pag.waitForTimeout(500);
                const oo = { raiz: M.raiz, frase: null, final: true };
                if (modo === 'mayeutica') { await contestarPrimera(M.raiz); oo.enunciado = ENUNCIADO; oo.siguiente = SIGUIENTE; }
                volcar(J, modo === 'mayeutica' ? 'Mayéutica' : 'Conceptos', await pag.evaluate(medir, { ...oo, letraMin: LETRA_MIN }));
            }
            await clic(M.modo.explorar);
            J.cerrar(k);
        }

        const tabs = fichas.map(f => ({ ...f, nombre: f.tab }));
        if (conFichas) {
            const ids = await pag.evaluate(p => [...document.querySelectorAll(`#${p} .tab-content`)].map(t => t.id), B1.panel);
            for (const id of ids) if (!tabs.some(t => t.tab === id)) tabs.push({ ...B1, tab: id, nombre: id });
        }
        for (const f of tabs) {
            await pulsarEnlace({ especialidad: f.especialidad, view: f.view, panel: f.panel, tab: f.tab });
            await pag.waitForTimeout(600);
            const vistas = await pag.evaluate(t => { const e = document.getElementById(t); if (!e || !e.offsetParent) return null; return [...new Set([...e.querySelectorAll('.vista-toggle button[data-vista]')].map(b => b.dataset.vista))]; }, f.tab);
            if (!vistas) { mal(`Móvil ${ancho}px · la ficha ${f.nombre} no se abre`); continue; }
            const J = juez(), raiz = `#${f.tab}`;
            for (const v of vistas.length ? vistas : ['texto']) {
                await pag.evaluate(([t, v]) => document.querySelectorAll(`#${t} .vista-toggle button[data-vista="${v}"]`).forEach(b => b.click()), [f.tab, v]);
                await pag.waitForTimeout(v === 'texto' ? 200 : 700);
                const o = { raiz, final: true, figura: v === 'visual' };
                if (v === 'mayeutica' || v === 'estudiar') { await contestarPrimera(raiz); o.enunciado = ENUNCIADO; o.siguiente = SIGUIENTE; }
                const nom = v === 'mayeutica' ? 'Mayéutica' : v === 'estudiar' ? 'Estudiar' : v === 'visual' ? 'Visual' : 'Texto';
                volcar(J, nom, await pag.evaluate(medir, { ...o, letraMin: LETRA_MIN }));
                if (v === 'visual') await tocar(J, nom, { raiz: `${raiz} .vista-visual`, figura: true }, 6);
            }
            await pag.evaluate(t => document.querySelectorAll(`#${t} .vista-toggle button[data-vista="texto"]`).forEach(b => b.click()), f.tab);
            J.cerrar(f.nombre);
        }
        await ctx.close();
    }
}
