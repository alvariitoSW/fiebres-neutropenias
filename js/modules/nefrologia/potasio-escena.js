// Escenario compartido por las simulaciones del potasio de la vista Visual
// (hiperpotasemia-sim.js, hipopotasemia-sim.js): la geometría, el dibujo del
// plasma, la célula, las bombas Na⁺/K⁺, las salidas, el tubo de analítica, el
// corazón y el ECG, el movimiento de las partículas y el bucle que solo anima
// mientras la vista está en pantalla. Cada simulación pone su modelo, sus
// causas, sus fármacos, sus avisos y qué partículas pinta de cada color.

import { irAlTexto, marcar } from '../../core/vista-visual.js';

// ---------- Geometría (coordenadas lógicas 360×320, ECG 360×74) ----------
export const W = 360, H = 320, EW = 360, EH = 74;
export const VASO = { x: 10, y: 22, w: 282, h: 50 };
export const CEL = { x: 10, y: 108, w: 228, h: 110 };
export const BOMBAS = [62, 124, 186];
export const ROTURAS = [93, 155];
export const CORAZON = { x: 302, y: 160 };
export const TUBO = { x: 326, y: 20 };
export const SALIDAS = { orina: { x: 62, rot: 'Orina' }, heces: { x: 180, rot: 'Heces' }, dial: { x: 298, rot: 'Diálisis' } };
const CANAL_X = 252, Y_REPARTO = 236, Y_ICONO = 262;
// Tonos claros del dibujo, sin token propio en variables.css.
export const CLARO = { rojo: '#e08a6c', oro: '#f0cf5a', verde: '#a8b97c', na: '#c882aa' };

// ---------- Utilidades ----------
export const azar = (a, b) => a + Math.random() * (b - a);
export const coma = (n, d = 1) => n.toFixed(d).replace('.', ',');
export const fmtT = m => { m = Math.round(m); return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')} min`; };
export const enlace = id => ` <button type="button" class="visual-link" data-ver="${id}">Texto ↓</button>`;
// Color de un token (#rrggbb) con transparencia.
export const alfa = (hex, a) => `rgba(${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)},${a})`;

// Actividad 0-1 de una dosis `u` minutos después de darla, a partir de sus
// rangos de inicio (`ini`) y fin (`fin`, null = sin duración cerrada).
export function actividadDosis(f, u) {
    const [a, b] = f.ini;
    const subida = b > a ? b - a : Math.max(2, a * 0.3);
    const ini0 = b > a ? a : a - subida;
    if (u < ini0) return 0;
    if (u < ini0 + subida) return (u - ini0) / subida;
    if (!f.fin) return 1;
    const [c, d] = f.fin;
    if (u <= c) return 1;
    if (u < d) return 1 - (u - c) / (d - c);
    return 0;
}
// Actividad de cada fármaco en el minuto `t`. Varias dosis no suman: cuenta
// la que más actúa en ese momento.
export function actividades(farmacos, dados, t) {
    const act = {};
    for (const f of farmacos) act[f.id] = (dados[f.id] || []).reduce((m, td) => Math.max(m, t >= td ? actividadDosis(f, t - td) : 0), 0);
    return act;
}
// Línea de estado de un fármaco ya dado ("Empieza a los…", "Actuando…").
export function estadoDosis(dosis, t, f, a) {
    if (!dosis.length) return '';
    const td = dosis[dosis.length - 1], u = t - td;
    const veces = dosis.length > 1 ? ` (${dosis.length}ª dosis)` : '';
    const empieza = f.ini[0] >= 60 ? fmtT(f.ini[0]) : `${f.ini[0]}${f.ini[1] > f.ini[0] ? '-' + f.ini[1] : ''} min`;
    if (u < f.ini[0] && a === 0) return `Dado a los ${fmtT(td)}${veces}. Empieza a los ${empieza}.`;
    if (a === 0) return `Dado a los ${fmtT(td)}${veces}. Efecto terminado.`;
    if (f.fin && u > f.fin[0]) return `Actuando, pero se está acabando (${Math.round(a * 100)}%).`;
    return `Actuando (${Math.round(a * 100)}%)${veces}.`;
}

// "Texto ↓": `data-ver` admite varios ids separados por coma; el primero se
// lleva a la vista y el resto se resalta sin mover la pantalla.
export function enlazarTexto(visual, tab, texto) {
    visual.addEventListener('click', e => {
        const ver = e.target.closest('[data-ver]');
        if (!ver) return;
        const [primero, ...otros] = ver.dataset.ver.split(',').map(id => texto.querySelector('#' + id)).filter(Boolean);
        irAlTexto(tab, primero);
        otros.forEach(marcar);
    });
}

// Escribe en el DOM solo si el valor ha cambiado (la vista se lee en cada fotograma).
export function crearPoner() {
    const previo = new Map();
    const poner = (clave, el, prop, v) => { if (previo.get(clave) !== v) { previo.set(clave, v); el[prop] = v; } };
    poner.cambio = (clave, v) => { if (previo.get(clave) === v) return false; previo.set(clave, v); return true; };
    return poner;
}

// Llama a `paso(ahora)` en cada fotograma, pero solo mientras alguna parte de
// la vista Visual está en pantalla (la ficha vive en el DOM aunque esté
// oculta). Se observa el bloque entero, no solo el dibujo: así el reloj sigue
// al bajar a pulsar los fármacos. `paso` recibe `ahora = 0` al reanudar.
export function animarMientrasVisible(visual, paso) {
    let visible = false, raf = 0, reanudar = false;
    const bucle = t => { paso(t, reanudar); reanudar = false; raf = visible ? requestAnimationFrame(bucle) : 0; };
    new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible && !raf) { reanudar = true; raf = requestAnimationFrame(bucle); }
    }).observe(visual);
}

// ---------- El escenario dibujado ----------
export function crearEscena(visual, { escena, ecg }) {
    const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const css = getComputedStyle(document.documentElement);
    const C = Object.fromEntries(Object.entries({ ink: '--text-main', muted: '--text-muted', rojo: '--accent-red', oro: '--accent-blue', verde: '--accent-green', purpura: '--accent-purple' })
        .map(([k, v]) => [k, css.getPropertyValue(v).trim()]));

    const cv = visual.querySelector('#' + escena), ctx = cv.getContext('2d');
    const ecv = visual.querySelector('#' + ecg), ectx = ecv.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ecv.width = EW * dpr; ecv.height = EH * dpr; ectx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const rr = (x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };
    let fuenteActual = '';
    function rotulo(txt, x, y, color = C.muted, size = 9.5, align = 'left', peso = '') {
        const f = `${peso} ${size}px Georgia, serif`;
        if (f !== fuenteActual) { ctx.font = f; fuenteActual = f; }
        ctx.fillStyle = color; ctx.textAlign = align; ctx.fillText(txt, x, y);
    }
    // Varios círculos del mismo color en un solo trazado.
    function puntos(lista, color, radio, ox = 0, oy = 0) {
        if (!lista.length) return;
        ctx.fillStyle = color; ctx.beginPath();
        for (const p of lista) { const x = p.x + (ox ? ox(p) : 0), y = p.y + (oy ? oy(p) : 0); ctx.moveTo(x + radio, y); ctx.arc(x, y, radio, 0, 6.29); }
        ctx.fill();
    }
    function anillos(lista, color, radio) {
        if (!lista.length) return;
        ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.beginPath();
        for (const p of lista) { ctx.moveTo(p.x + radio, p.y); ctx.arc(p.x, p.y, radio, 0, 6.29); }
        ctx.stroke();
    }

    let reloj = 0, giroBomba = 0, NA = [];

    // ---------- Partículas: puntos y rutas ----------
    const puntoPlasma = () => ({ x: azar(VASO.x + 18, VASO.x + VASO.w - 16), y: azar(VASO.y + 20, VASO.y + VASO.h - 7) });
    const puntoCelula = () => ({ x: azar(CEL.x + 16, CEL.x + CEL.w - 16), y: azar(CEL.y + 44, CEL.y + CEL.h - 24) });
    const cerca = (lista, x) => lista.reduce((m, b) => Math.abs(b - x) < Math.abs(m - x) ? b : m);
    // Ruta de una partícula hasta `cat`: a la célula por la bomba más cercana,
    // al plasma por una rotura de la membrana, fuera del cuerpo por el canal.
    // `fin` = punto de llegada concreto (p. ej. un hueco de la célula).
    function rutaHacia(p, cat, fin) {
        if (cat === 'celula') {
            const bx = cerca(BOMBAS, p.x);
            return [{ x: bx, y: VASO.y + VASO.h + 4 }, { x: bx, y: CEL.y }, fin || puntoCelula()];
        }
        if (cat === 'plasma') {
            const gx = ROTURAS[Math.floor(Math.random() * ROTURAS.length)];
            return [{ x: gx, y: CEL.y + 4 }, { x: gx, y: VASO.y + VASO.h - 4 }, fin || puntoPlasma()];
        }
        const x = SALIDAS[cat].x;
        return [{ x: CANAL_X, y: VASO.y + VASO.h }, { x: CANAL_X, y: Y_REPARTO }, { x, y: Y_REPARTO }, fin || { x: x + azar(-22, 22), y: Y_ICONO + azar(18, 32) }];
    }
    // Entrada al plasma desde fuera: `arriba` (aporte, perfusión i.v.) o
    // `intestino` (vía oral: sube por el canal desde el intestino).
    function rutaEntrada(desde, xArriba = VASO.x + 30) {
        if (desde === 'intestino') {
            const x = SALIDAS.heces.x;
            return { inicio: { x, y: Y_ICONO }, ruta: [{ x, y: Y_REPARTO }, { x: CANAL_X, y: Y_REPARTO }, { x: CANAL_X, y: VASO.y + VASO.h - 4 }, puntoPlasma()] };
        }
        const x = xArriba + azar(-8, 8);
        return { inicio: { x, y: 2 }, ruta: [{ x, y: VASO.y + 10 }, puntoPlasma()] };
    }
    // Avanza cada partícula por su ruta; las del plasma sin ruta derivan.
    function moverParticulas(P, deriva = p => p.cat === 'plasma') {
        for (const p of P) {
            if (p.ruta.length) {
                const d = p.ruta[0], dx = d.x - p.x, dy = d.y - p.y, dist = Math.hypot(dx, dy), v = reducido ? 999 : 2.2;
                if (dist <= v) { p.x = d.x; p.y = d.y; p.ruta.shift(); } else { p.x += dx / dist * v; p.y += dy / dist * v; }
            } else if (!reducido && deriva(p)) {
                p.x += p.vx; if (p.x > VASO.x + VASO.w - 14) p.x = VASO.x + 14;
            }
        }
    }

    // ---------- Piezas del dibujo ----------
    function vaso(texto) {
        rr(VASO.x, VASO.y, VASO.w, VASO.h, 24); ctx.fillStyle = alfa(C.rojo, 0.13); ctx.fill();
        ctx.strokeStyle = alfa(C.rojo, 0.55); ctx.lineWidth = 1.2; ctx.stroke();
        rotulo(texto, VASO.x + 16, VASO.y + 14, C.muted, 9);
    }
    function celula(texto) {
        rr(CEL.x, CEL.y, CEL.w, CEL.h, 16); ctx.fillStyle = alfa(C.oro, 0.06); ctx.fill();
        ctx.strokeStyle = alfa(C.oro, 0.5); ctx.lineWidth = 2; ctx.stroke();
        rotulo(texto, CEL.x + 12, CEL.y + CEL.h - 9, C.muted, 9);
    }
    function roturas() {
        ctx.strokeStyle = CLARO.rojo; ctx.lineWidth = 2; ctx.beginPath();
        for (const gx of ROTURAS) { ctx.moveTo(gx - 7, CEL.y - 3); ctx.lineTo(gx - 3, CEL.y + 3); ctx.lineTo(gx + 1, CEL.y - 3); ctx.lineTo(gx + 5, CEL.y + 3); }
        ctx.stroke();
    }
    // Bombas Na⁺/K⁺: `nivel` 0-1 acelera el giro y suelta Na⁺ hacia el plasma.
    function bombas(nivel) {
        const activa = nivel > 0.05, vel = 0.4 + 3.2 * nivel;
        if (!reducido) giroBomba += 0.03 * vel;
        BOMBAS.forEach((bx, i) => {
            ctx.save(); ctx.translate(bx, CEL.y);
            if (activa) { ctx.shadowColor = C.oro; ctx.shadowBlur = 8 * nivel; }
            rr(-9, -8, 18, 16, 5); ctx.fillStyle = alfa(C.oro, activa ? 0.35 : 0.12); ctx.fill();
            ctx.strokeStyle = C.oro; ctx.lineWidth = 1; ctx.stroke(); ctx.shadowBlur = 0;
            ctx.rotate(giroBomba + i); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.4;
            ctx.beginPath(); ctx.arc(0, 0, 4.5, 0, 4.4); ctx.stroke();
            ctx.restore();
            if (activa && !reducido && Math.random() < 0.03 * vel) NA.push({ x: bx + azar(-4, 4), y: CEL.y - 8, vy: -azar(0.4, 0.8), vida: 1 });
        });
        NA = NA.filter(n => (n.vida -= 0.02) > 0);
        for (const n of NA) n.y += n.vy;
        puntos(NA, alfa(CLARO.na, 0.7), 1.7);
        if (activa) for (const bx of BOMBAS) rotulo('Na⁺↑', bx + 12, CEL.y - 12, CLARO.na, 8.5);
        rotulo(activa ? 'Bomba Na⁺/K⁺ acelerada: salen 3 Na⁺, entran 2 K⁺' : 'Bomba Na⁺/K⁺ a ritmo basal', CEL.x + 12, CEL.y + 20, activa ? C.ink : C.muted);
    }
    // Canal y salidas: `lista` = [{ clave: 'orina'|'heces'|'dial', a: 0-1, cerrado, rot }].
    function salidas(lista) {
        const xs = lista.map(s => SALIDAS[s.clave].x);
        ctx.strokeStyle = alfa(C.verde, 0.3); ctx.lineWidth = 6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(CANAL_X, VASO.y + VASO.h - 2); ctx.lineTo(CANAL_X, Y_REPARTO);
        ctx.moveTo(Math.min(...xs, CANAL_X), Y_REPARTO); ctx.lineTo(Math.max(...xs, CANAL_X), Y_REPARTO);
        for (const x of xs) { ctx.moveTo(x, Y_REPARTO); ctx.lineTo(x, Y_ICONO - 12); }
        ctx.stroke(); ctx.lineCap = 'butt';
        for (const s of lista) {
            const x = SALIDAS[s.clave].x;
            if (s.clave === 'orina') dibujarRinon(x, Y_ICONO, s.a, s.cerrado);
            else if (s.clave === 'heces') dibujarIntestino(x, Y_ICONO, s.a);
            else dibujarDializador(x, Y_ICONO, s.a);
            rotulo(s.rot || SALIDAS[s.clave].rot, x, 314, C.muted, 9.5, 'center');
        }
    }
    const brillo = a => { if (a > 0.05) { ctx.shadowColor = C.verde; ctx.shadowBlur = 10 * a; } };
    function dibujarRinon(x, y, a, cerrado) {
        ctx.save(); brillo(a);
        ctx.beginPath(); ctx.moveTo(x + 2, y - 11);
        ctx.bezierCurveTo(x - 18, y - 14, x - 18, y + 14, x + 2, y + 11);
        ctx.bezierCurveTo(x + 8, y + 9, x + 4, y + 3, x + 7, y);
        ctx.bezierCurveTo(x + 4, y - 3, x + 8, y - 9, x + 2, y - 11);
        ctx.fillStyle = alfa(C.verde, a > 0.05 ? 0.75 : 0.3); ctx.fill();
        ctx.restore();
        if (cerrado) { ctx.strokeStyle = CLARO.rojo; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 8, y - 8); ctx.lineTo(x + 6, y + 8); ctx.moveTo(x + 6, y - 8); ctx.lineTo(x - 8, y + 8); ctx.stroke(); }
    }
    function dibujarIntestino(x, y, a) {
        ctx.save(); brillo(a); ctx.strokeStyle = alfa(C.verde, a > 0.05 ? 1 : 0.35); ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x - 16, y - 6); ctx.bezierCurveTo(x - 4, y - 14, x + 4, y + 2, x + 16, y - 6);
        ctx.moveTo(x - 16, y + 4); ctx.bezierCurveTo(x - 4, y - 4, x + 4, y + 12, x + 16, y + 4); ctx.stroke(); ctx.restore();
    }
    function dibujarDializador(x, y, a) {
        ctx.save(); brillo(a);
        rr(x - 8, y - 12, 16, 24, 5); ctx.fillStyle = alfa(C.verde, a > 0.05 ? 0.55 : 0.25); ctx.fill();
        ctx.strokeStyle = C.verde; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
        ctx.strokeStyle = alfa(C.ink, 0.4); ctx.lineWidth = 1; ctx.beginPath();
        for (let i = -4; i <= 4; i += 4) { ctx.moveTo(x + i, y - 9); ctx.lineTo(x + i, y + 9); }
        ctx.stroke();
    }
    // Tubo de analítica. `marca` (opcional) = la muestra no refleja al
    // paciente: { texto, puntos: [{x,y,fase}], color } — p. ej. hemolizada.
    function tubo(valor, marca) {
        const { x, y } = TUBO;
        ctx.strokeStyle = C.muted; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(x - 8, y); ctx.lineTo(x - 8, y + 40); ctx.arc(x, y + 40, 8, Math.PI, 0, true); ctx.lineTo(x + 8, y); ctx.stroke();
        ctx.fillStyle = alfa(C.rojo, marca ? 0.55 : 0.25);
        ctx.beginPath(); ctx.moveTo(x - 7, y + 14); ctx.lineTo(x - 7, y + 40); ctx.arc(x, y + 40, 7, Math.PI, 0, true); ctx.lineTo(x + 7, y + 14); ctx.fill();
        if (marca) {
            puntos(marca.puntos, marca.color, 1.8, k => Math.sin(reloj + k.fase));
            rotulo(marca.texto, x, y + 62, marca.color, 8.5, 'center');
        }
        rotulo('Analítica', x, y + 74, C.muted, 9, 'center');
        rotulo(coma(valor), x, y + 86, marca ? marca.color : C.ink, 10, 'center', 'bold');
    }
    const puntosTubo = n => Array.from({ length: n }, () => ({ x: TUBO.x + azar(-4, 4), y: TUBO.y + azar(18, 42), fase: Math.random() * 6.28 }));
    // Corazón: `intensidad` 0-1 (gravedad); `calcio` 0-1 = anillo de membrana protegida.
    function corazon(intensidad, calcio = 0) {
        const { x, y } = CORAZON, latido = 1 + 0.05 * Math.max(0, Math.sin(reloj * 7));
        ctx.save(); ctx.translate(x, y); ctx.scale(latido, latido);
        ctx.beginPath(); ctx.moveTo(0, 24); ctx.bezierCurveTo(-32, 4, -24, -24, 0, -11); ctx.bezierCurveTo(24, -24, 32, 4, 0, 24);
        ctx.fillStyle = alfa(C.rojo, 0.3 + 0.55 * intensidad * (1 - 0.6 * calcio)); ctx.fill();
        ctx.strokeStyle = C.rojo; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.restore();
        if (calcio > 0.02) {
            ctx.save(); ctx.globalAlpha = calcio;
            ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.setLineDash([5, 4]); ctx.lineDashOffset = -reloj * 8;
            ctx.beginPath(); ctx.arc(x, y + 2, 36, 0, 6.29); ctx.stroke();
            ctx.restore();
            rotulo('Ca²⁺', x + 34, y - 30, C.ink, 9.5, 'center', 'bold');
        }
        rotulo('Corazón', x, y + 50, C.muted, 9.5, 'center');
        if (calcio > 0.3) rotulo('membrana protegida', x, y + 62, C.ink, 9, 'center');
    }

    // ---------- ECG ----------
    // `latido(u, r, x)`: altura del trazo en la fracción `u` de un latido
    // nominal de 120 px (u > 1 = línea de base hasta el siguiente), con los
    // rasgos `r`; `x` = posición absoluta, para ondas continuas (FA, FV).
    // Con `r.irregular` cada latido dura distinto (fibrilación auricular).
    const trazo = new Float32Array(EW).fill(NaN);
    let barrido = 0, fase = 0, largo = 120, ecgEstatico = '';
    function pintarECG(r, latido, clave) {
        if (!reducido) {
            for (let i = 0; i < 3; i++) {
                const col = Math.floor(barrido) % EW;
                trazo[col] = latido(fase / 120, r, barrido);
                for (let j = 1; j < 12; j++) trazo[(col + j) % EW] = NaN;
                barrido += 1; fase += 1;
                if (fase >= largo) { fase = 0; largo = r.irregular ? azar(70, 150) : 120; }
            }
        } else {
            // Sin movimiento: el trazo solo se recalcula cuando cambian los rasgos.
            if (clave === ecgEstatico) return;
            ecgEstatico = clave;
            for (let c = 0; c < EW; c++) trazo[c] = latido((c % 120) / 120, r, c);
        }
        ectx.clearRect(0, 0, EW, EH);
        ectx.strokeStyle = alfa(C.verde, 0.12); ectx.lineWidth = 1; ectx.beginPath();
        for (let x = 0; x < EW; x += 15) { ectx.moveTo(x, 0); ectx.lineTo(x, EH); }
        ectx.stroke();
        ectx.strokeStyle = CLARO.verde; ectx.lineWidth = 1.6; ectx.beginPath();
        let abierto = false;
        for (let c = 0; c < EW; c++) {
            if (Number.isNaN(trazo[c])) { abierto = false; continue; }
            const y = 50 - trazo[c] * 32;
            if (abierto) ectx.lineTo(c, y); else { ectx.moveTo(c, y); abierto = true; }
        }
        ectx.stroke();
        ectx.fillStyle = C.muted; ectx.font = '9px Georgia, serif'; ectx.textAlign = 'left'; ectx.fillText('ECG', 6, 12);
    }
    function reiniciarECG() { trazo.fill(NaN); ecgEstatico = ''; fase = 0; largo = 120; }

    return {
        C, ctx, reducido,
        get reloj() { return reloj; },
        tick(dt) { reloj += dt; },
        limpiar() { ctx.clearRect(0, 0, W, H); },
        rr, rotulo, puntos, anillos,
        puntoPlasma, puntoCelula, rutaHacia, rutaEntrada, moverParticulas, puntosTubo,
        vaso, celula, roturas, bombas, salidas, tubo, corazon,
        pintarECG, reiniciarECG,
    };
}

// ---------- Forma de onda del ECG ----------
const gauss = (u, c, w) => Math.exp(-((u - c) ** 2) / (2 * w * w));
// Latido base con P, QRS y T, desplazables: `pr` adelanta la P (PR largo),
// `qrs` ensancha, `tAmp`/`tAnch`/`tPos` dan la T, `st` desciende el ST y
// `u` añade onda U. Sin P si `sinP`.
export function onda(u, { sinP = false, pr = 0, qrs = 1, tAmp = 0.26, tAnch = 0.055, tPos = 0.62, st = 0, uAmp = 0 } = {}) {
    const q = 0.32 + (qrs > 1 ? 0.04 : 0);
    return (sinP ? 0 : 0.13 * gauss(u, 0.16 - pr, 0.025))
        - 0.1 * gauss(u, q - 0.025 * qrs, 0.008 * qrs) + gauss(u, q, 0.011 * qrs) - 0.25 * gauss(u, q + 0.03 * qrs, 0.01 * qrs)
        - st * gauss(u, 0.46, 0.06) + tAmp * gauss(u, tPos, tAnch) + uAmp * gauss(u, tPos + 0.17, 0.045);
}
