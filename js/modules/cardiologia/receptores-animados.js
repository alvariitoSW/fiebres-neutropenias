// Diagrama animado de los receptores adrenérgicos (Merino Cardiología, Ficha II · Vasopresores).
//
// Cuenta el mecanismo en 5 pasos: llega el fármaco, se une a su receptor, se activa la proteína G, salen los
// segundos mensajeros y aparece el efecto. No tiene datos propios: recibe el perfil del fármaco elegido
// (RECEPTORES_FARMACO de merino-cardiologia.js, la única fuente) y lo dibuja. Cuántas moléculas se unen a cada
// receptor es el nivel 0-3 de ese perfil (la misma lectura cualitativa de la ficha). El contenido de cada columna
// (Gq/Gs, IP₃/DAG, Ca²⁺, AMPc, PKA, efecto) es el del diagrama estático que sustituye: farmacología general,
// complementaria a Marino Cap. 14.
//
// Animación con Motion (js/vendor/motion.js, carga diferida con core/motion.js). Sin Motion, o con «reducir
// movimiento» activado, se muestra directamente el estado final.
import { cargarMotion, sinMovimiento } from '../../core/motion.js';

const NS = 'http://www.w3.org/2000/svg';
const COLS = [
    { id: 'a1', x: 95, rot: 'α₁', g: 'Gq', m: ['↑IP₃/DAG', '↑Ca²⁺'], ef: ['Vasoconstricción'], c: '#b85c3e' },
    { id: 'b1', x: 215, rot: 'β₁', g: 'Gs', m: ['↑AMPc', '↑PKA'], ef: ['↑FC', '↑Contractilidad'], c: '#9c5476' },
    { id: 'b2', x: 335, rot: 'β₂', g: 'Gs', m: ['↑AMPc', 'relajación'], ef: ['Vasodilatación'], c: '#90a06a' },
];
const PASOS = [
    ['El fármaco llega', 'Las moléculas del fármaco llegan al espacio extracelular.'],
    ['Se une a su receptor', 'Cada molécula se une al receptor que activa: cuantas más, más protagonista es ese receptor en el perfil del fármaco.'],
    ['Se activa la proteína G', 'α₁ está acoplado a Gq; β₁ y β₂, a Gs.'],
    ['Segundos mensajeros', 'Gq sube el IP₃/DAG y el Ca²⁺ intracelular; Gs sube el AMPc.'],
    ['El efecto', 'El resultado en el vaso o en el corazón, con la intensidad relativa del fármaco elegido.'],
];
const OPACIDAD = [0.15, 0.45, 0.7, 1];
const ORO = '#d4af37';

const el = (tag, at, padre) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); padre?.appendChild(e); return e; };
const txt = (t, at, padre) => { const e = el('text', { 'text-anchor': 'middle', ...at }, padre); e.textContent = t; return e; };
const espera = (ms) => new Promise(r => setTimeout(r, ms));

/** Monta la escena en `raiz` y devuelve { mostrar(datos | null) }. */
export function crearEscenaReceptores(raiz) {
    raiz.innerHTML = `
        <div class="ra-escena"><svg viewBox="0 0 400 430" role="img" aria-label="Membrana celular con los receptores α₁, β₁ y β₂ y su vía de señalización"></svg></div>
        <div class="ra-pasos" hidden>
            <button type="button" class="visual-mini hk-primario" data-ra="play">▶ Reproducir</button>
            <button type="button" class="visual-mini" data-ra="prev" aria-label="Paso anterior">◀</button>
            <button type="button" class="visual-mini" data-ra="next" aria-label="Paso siguiente">▶</button>
            <div class="ra-leyenda" aria-live="polite"></div>
        </div>`;
    const svg = raiz.querySelector('svg'), pasos = raiz.querySelector('.ra-pasos'), leyenda = raiz.querySelector('.ra-leyenda');

    // ---- dibujo fijo
    txt('extracelular', { x: 10, y: 20, 'font-size': 13.5, fill: '#a5967c', 'text-anchor': 'start' }, svg);
    el('rect', { x: 0, y: 104, width: 400, height: 22, fill: '#4a3d2a' }, svg);
    txt('intracelular', { x: 10, y: 146, 'font-size': 13.5, fill: '#a5967c', 'text-anchor': 'start' }, svg);
    const R = {};
    for (const c of COLS) {
        const col = el('g', {}, svg), r = { col };
        txt(c.rot, { x: c.x, y: 62, 'font-size': 18, fill: c.c, 'font-weight': 'bold' }, col);
        el('rect', { x: c.x - 16, y: 80, width: 32, height: 66, rx: 9, fill: c.c, opacity: 0.9 }, col);
        r.brillo = el('rect', { x: c.x - 22, y: 74, width: 44, height: 78, rx: 12, fill: 'none', stroke: c.c, 'stroke-width': 2 }, col);
        r.g = el('g', {}, col);
        el('circle', { cx: c.x, cy: 182, r: 17, fill: '#241e16', stroke: c.c, 'stroke-width': 2 }, r.g);
        txt(c.g, { x: c.x, y: 187, 'font-size': 13.5, fill: '#ece3cc' }, r.g);
        r.m = c.m.map((t, i) => { const g = el('g', {}, col);
            el('rect', { x: c.x - 44, y: 222 + i * 30, width: 88, height: 24, rx: 12, fill: 'rgba(0,0,0,.35)', stroke: c.c }, g);
            txt(t, { x: c.x, y: 238 + i * 30, 'font-size': 13.5, fill: '#ece3cc' }, g); return g; });
        r.ef = el('g', {}, col);
        el('rect', { x: c.x - 56, y: 292, width: 112, height: 22 + 18 * c.ef.length, rx: 8, fill: c.c, opacity: 0.25 }, r.ef);
        c.ef.forEach((t, i) => txt(t, { x: c.x, y: 311 + i * 18, 'font-size': 13.5, fill: '#ece3cc', 'font-weight': 'bold' }, r.ef));
        r.burbujas = el('g', {}, col);
        R[c.id] = r;
    }
    const molG = el('g', {}, svg);
    const otro = el('g', {}, svg);
    el('rect', { x: 30, y: 370, width: 340, height: 50, rx: 8, fill: 'rgba(207,154,62,.12)', stroke: '#cf9a3e', 'stroke-dasharray': '4 3' }, otro);
    txt('No usa receptores α ni β', { x: 200, y: 391, 'font-size': 13.5, fill: '#ece3cc' }, otro);
    const otroT = txt('', { x: 200, y: 409, 'font-size': 13.5, fill: '#c9bda4' }, otro);

    // ---- estado
    // Motion anima la opacidad de los elementos SVG como atributo, así que todo se fija como atributo (un
    // `style.opacity` mandaría sobre él). Las escalas y desplazamientos de los grupos se hacen con el atributo
    // `transform`, alrededor de su centro (cx, cy), animando un número de 0 a 1.
    let datos = null, paso = 0, mol = [], M = null, token = 0, vivas = [];
    const quieto = sinMovimiento();
    const nivel = (id) => datos?.activacion?.[id] ?? 0;
    const ninguno = () => !datos || COLS.every(c => !nivel(c.id));
    const vis = (e, op) => e.setAttribute('opacity', op);
    const forma = (e, [cx, cy], dy = 0, s = 1) => e.setAttribute('transform', `translate(${cx} ${cy + dy}) scale(${s}) translate(${-cx} ${-cy})`);
    const centros = {};
    for (const c of COLS) centros[c.id] = { brillo: [c.x, 113], g: [c.x, 182], m: c.m.map((_, i) => [c.x, 234 + i * 30]), ef: [c.x, 303 + 9 * c.ef.length] };

    function crearMoleculas() {
        molG.innerHTML = '';
        const lista = [];
        if (ninguno()) for (let i = 0; i < 4; i++) lista.push({ col: COLS[i % 3], rebota: true });
        else for (const c of COLS) for (let k = 0; k < nivel(c.id); k++) lista.push({ col: c, k, n: nivel(c.id) });
        mol = lista.map((m, i) => ({ ...m,
            e: el('circle', { r: 6.5, fill: ORO, stroke: '#17140f', 'stroke-width': 1.5, opacity: 0 }, molG),
            x0: 150 + ((i * 53) % 100), y0: 18 + (i % 3) * 9,
            xf: m.rebota ? m.col.x : m.col.x + (m.k - (m.n - 1) / 2) * 13, yf: 74 }));
    }

    function estado(p) {     // la escena tal como queda al final del paso p, sin animar
        vis(otro, datos && ninguno() && p >= 2 ? 1 : 0);
        mol.forEach(m => { m.e.setAttribute('cx', p >= 2 ? m.xf : m.x0); m.e.setAttribute('cy', p >= 2 ? m.yf : m.y0);
            m.e.setAttribute('opacity', p >= 1 && !(m.rebota && p >= 2) ? 1 : 0); });
        for (const c of COLS) {
            const r = R[c.id], n = nivel(c.id), C = centros[c.id];
            vis(r.col, 1);
            vis(r.brillo, p >= 2 && n ? 0.9 : 0); forma(r.brillo, C.brillo);
            forma(r.g, C.g); vis(r.g, p >= 3 && n ? 1 : 0.15);
            r.m.forEach((g, j) => { forma(g, C.m[j]); vis(g, p >= 4 && n ? 1 : 0.12); });
            vis(r.ef, p >= 5 ? OPACIDAD[n] : 0.1); forma(r.ef, C.ef, 0, p >= 5 ? 0.85 + 0.05 * n : 0.85);
            r.burbujas.innerHTML = '';
        }
    }

    function neutro() {     // sin fármaco: el diagrama completo, quieto
        molG.innerHTML = ''; mol = []; vis(otro, 0);
        for (const c of COLS) { const r = R[c.id], C = centros[c.id];
            [r.col, r.g, r.ef, ...r.m].forEach(e => vis(e, 1));
            forma(r.g, C.g); r.m.forEach((g, j) => forma(g, C.m[j])); forma(r.ef, C.ef);
            vis(r.brillo, 0); r.burbujas.innerHTML = ''; }
    }

    async function animarPaso(p) {
        const T = (o) => (quieto ? { duration: 0 } : o);
        const a = (...args) => { const c = M.animate(...args); vivas.push(c); return c; };
        // anima un número de 0 a 1 y lo pasa a `alPaso` (para el atributo transform)
        const progreso = (alPaso, o) => a(0, 1, { ...T(o), onUpdate: alPaso }).finished;
        if (p === 1) await Promise.all(mol.map((m, i) => a(m.e, { opacity: [0, 1], cy: [m.y0 - 30, m.y0] }, T({ duration: 0.6, delay: i * 0.08 })).finished));
        if (p === 2) {
            await Promise.all(mol.map((m, i) => (m.rebota
                ? a(m.e, { cx: [m.x0, m.xf, m.xf + (i % 2 ? 40 : -40)], cy: [m.y0, m.yf - 4, 20], opacity: [1, 1, 0] }, T({ duration: 1.2, delay: i * 0.12, ease: 'easeOut' }))
                : a(m.e, { cx: [m.x0, m.xf], cy: [m.y0, m.yf] }, T({ type: 'spring', stiffness: 160, damping: 14, delay: i * 0.1 }))).finished));
            for (const c of COLS) if (nivel(c.id)) {
                const r = R[c.id], C = centros[c.id];
                a(r.brillo, { opacity: [0, 1, 0.9] }, T({ duration: 0.5 }));
                progreso(v => forma(r.brillo, C.brillo, 0, 1 + 0.08 * Math.sin(Math.PI * v)), { duration: 0.5 });
            }
            if (ninguno()) a(otro, { opacity: [0, 1] }, T({ duration: 0.5 }));
        }
        const activas = COLS.filter(c => nivel(c.id));
        if (p === 3) await Promise.all(activas.flatMap((c, i) => {
            const r = R[c.id], o = { type: 'spring', stiffness: 220, damping: 12, delay: i * 0.15 };
            return [a(r.g, { opacity: [0.15, 1] }, T(o)).finished, progreso(v => forma(r.g, centros[c.id].g, -14 * (1 - v)), o)];
        }));
        if (p === 4) {
            if (!quieto) activas.forEach(c => {
                const g = R[c.id].burbujas; g.innerHTML = '';
                for (let i = 0; i < 6; i++) a(el('circle', { cx: c.x, cy: 196, r: 3, fill: c.c }, g),
                    { cx: [c.x, c.x + (i - 2.5) * 12], cy: [196, 236 + (i % 3) * 8], opacity: [1, 0] }, { duration: 1, delay: i * 0.06, ease: 'easeOut' });
            });
            await Promise.all(activas.flatMap((c, i) => R[c.id].m.flatMap((g, j) => {
                const o = { type: 'spring', stiffness: 260, damping: 13, delay: i * 0.15 + j * 0.18 };
                return [a(g, { opacity: [0.12, 1] }, T(o)).finished, progreso(v => forma(g, centros[c.id].m[j], 0, 0.6 + 0.4 * v), o)];
            })));
        }
        if (p === 5) {
            for (const c of COLS) { const n = nivel(c.id), r = R[c.id], o = { type: 'spring', stiffness: 200, damping: 14 };
                a(r.ef, { opacity: [0.1, OPACIDAD[n]] }, T(o));
                progreso(v => forma(r.ef, centros[c.id].ef, 0, 0.85 + 0.05 * n * v), o); }
            await espera(quieto ? 0 : 600);
        }
    }

    function pintarLeyenda() {
        if (!paso) { leyenda.innerHTML = 'Pulsa <strong>Reproducir</strong> o avanza paso a paso.'; return; }
        let [t, d] = PASOS[paso - 1];
        if (ninguno() && paso >= 2) d = `${datos.nombre} no se une a α₁, β₁ ni β₂: su receptor es otro (abajo).`;
        leyenda.innerHTML = `<strong>Paso ${paso} de 5 · ${t}.</strong> ${d}`;
    }

    // cambiar de paso o de fármaco para las animaciones que sigan en marcha, para que no pisen el estado nuevo
    function parar() { vivas.forEach(c => c.stop?.()); vivas = []; }

    async function reproducir() {
        const yo = ++token; parar(); paso = 0; estado(0);
        if (!M) { paso = 5; estado(5); pintarLeyenda(); return; }
        for (let p = 1; p <= 5; p++) { if (yo !== token) return; paso = p; pintarLeyenda(); await animarPaso(p); }
    }
    function irA(p) {
        token++; parar(); paso = Math.max(0, Math.min(5, p)); estado(Math.max(0, paso - 1)); pintarLeyenda();
        if (!paso) return;
        if (M) animarPaso(paso); else estado(paso);
    }
    pasos.addEventListener('click', (e) => {
        const b = e.target.closest('[data-ra]'); if (!b || !datos) return;
        if (b.dataset.ra === 'play') reproducir(); else irA(paso + (b.dataset.ra === 'next' ? 1 : -1));
    });

    return {
        async mostrar(nuevos) {
            token++; parar(); datos = nuevos;
            if (!datos) { pasos.hidden = true; neutro(); return; }
            otroT.textContent = datos.receptorNoAdr || datos.receptor || '';
            pasos.hidden = false; crearMoleculas(); paso = 0; estado(0); pintarLeyenda();
            if (!M && !quieto) M = await cargarMotion().catch(() => null);
            if (datos === nuevos) reproducir();
        },
    };
}
