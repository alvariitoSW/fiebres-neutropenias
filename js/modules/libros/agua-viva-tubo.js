// Río y mar · lupa del «tubo» de analítica (pseudohiponatremia, Marino cap. 35).
// Dos tubos de plasma, el normal y el del paciente: el sodio vive solo en la fase acuosa (misma densidad en los dos);
// la fase no acuosa (proteínas o lípidos) crece en el paciente, y por eso el Na⁺ medido por litro de PLASMA baja
// mientras el Na⁺ por litro de AGUA es el mismo. Lo dibuja el módulo de la escena con Lupa.abrir('tubo').
// Tamaños exagerados: ilustrativo. Cifras: el Na⁺ medido es el dato del caso (estado.fijo.na); la ficha no da cuánto baja.
import { C, estado, D, REDUCIR, rgba, pinta, texto, brillo } from './agua-viva-escena.js';

const TAU = Math.PI * 2;
// fracción no acuosa: 5 % normal (el plasma es un 95 % agua, E p. 8); la del paciente, exagerada para verse
const FR_NORMAL = 0.05, FR_PSEUDO = 0.3;

function geom(S) {
    const w = 0.13 * S, y0 = 0.21 * S, h = 0.36 * S;
    return { w, y0, h, xs: [0.44 * S, 0.74 * S] };
}
const fracPaciente = () => (estado.pseudo ? FR_PSEUDO : FR_NORMAL);

// El contorno de un tubo de ensayo: rectángulo con el fondo redondeado
function trazaTubo(g, cx, g0) {
    const r = g0.w / 2, x0 = cx - r, yb = g0.y0 + g0.h;
    g.beginPath(); g.moveTo(x0, g0.y0); g.lineTo(x0, yb - r); g.arc(cx, yb - r, r, Math.PI, 0, true); g.lineTo(x0 + g0.w, g0.y0);
}

// Todo cabe dentro del círculo de la lupa (y el «×» ocupa arriba a la izquierda)
function pintaFijo(L, f) {
    const S = L.S, s = S / 200, g0 = geom(S), tam = Math.max(8.4 * s, 8.5);
    f.fillStyle = C.bg; f.fillRect(0, 0, S, S);
    const fr = [FR_NORMAL, fracPaciente()];
    g0.xs.forEach((cx, i) => {
        const r = g0.w / 2, yb = g0.y0 + g0.h, yFase = yb - g0.h * fr[i];
        // plasma: fase acuosa (arriba) y no acuosa (abajo, rayada y morada)
        f.save(); trazaTubo(f, cx, g0); f.clip();
        f.fillStyle = rgba(C.oro, 0.12); f.fillRect(cx - r, g0.y0, g0.w, yFase - g0.y0);
        f.fillStyle = rgba(C.purpura, 0.38); f.fillRect(cx - r, yFase, g0.w, yb - yFase);
        f.strokeStyle = rgba(C.texto, 0.35); f.lineWidth = 0.8; f.beginPath();
        for (let d = -g0.h; d < g0.w + g0.h; d += 4 * s) { f.moveTo(cx - r + d, yb + 2); f.lineTo(cx - r + d + (yb - yFase), yFase); }
        f.stroke(); f.restore();
        f.strokeStyle = rgba(C.texto, 0.9); f.lineWidth = 1.6; trazaTubo(f, cx, g0); f.stroke();
        f.strokeStyle = rgba(C.purpura, 0.95); f.lineWidth = 1; f.setLineDash([3, 2]); f.beginPath(); f.moveTo(cx - r, yFase); f.lineTo(cx + r, yFase); f.stroke(); f.setLineDash([]);
        const pseudo = i === 1 && estado.pseudo;
        const naMed = i ? Math.round(D.naMed) : 140, naAgua = pseudo ? Math.round(estado.na0) : naMed;
        texto(f, i ? 'paciente' : 'normal', cx, yb + 11 * s, { size: tam, color: C.texto, align: 'center', italic: false, peso: '600' });
        texto(f, `medido ${naMed}`, cx, yb + 20 * s, { size: tam, color: pseudo ? C.rojo : C.dim, align: 'center', italic: false, peso: '600' });
        texto(f, `agua ${naAgua}`, cx, yb + 29 * s, { size: tam, color: C.verde, align: 'center', italic: false, peso: '600' });
    });
    // leyenda: la fase acuosa (con el sodio) y la no acuosa (rayada), con su muestra
    const yl = S * 0.81, x1 = S * 0.2, x2 = S * 0.5;
    f.fillStyle = rgba(C.oro, 0.3); f.fillRect(x1, yl - 7 * s, 8 * s, 8 * s); f.strokeStyle = rgba(C.oro, 0.9); f.lineWidth = 1; f.strokeRect(x1, yl - 7 * s, 8 * s, 8 * s);
    texto(f, 'acuosa (Na⁺)', x1 + 11 * s, yl, { size: tam, color: C.dim, italic: false });
    f.fillStyle = rgba(C.purpura, 0.5); f.fillRect(x2 + 14 * s, yl - 7 * s, 8 * s, 8 * s); f.strokeStyle = rgba(C.texto, 0.7); f.beginPath(); f.moveTo(x2 + 14 * s, yl + 1); f.lineTo(x2 + 22 * s, yl - 7 * s); f.stroke();
    texto(f, 'no acuosa', x2 + 25 * s, yl, { size: tam, color: C.purpura, italic: false });
    texto(f, `Posm medida ${Math.round(D.posm)}: normal`, S / 2, S * 0.875, { size: tam, color: C.texto, align: 'center', italic: false, peso: '600' });
    texto(f, 'ilustrativo, exagerado', S / 2, S * 0.935, { size: tam, color: C.muted, align: 'center' });
}

// Los iones Na⁺ (destellos) se agitan solo en la fase acuosa, a la misma densidad en los dos tubos
function sembrar(L) {
    const g0 = geom(L.S), fr = [FR_NORMAL, fracPaciente()], dens = 0.006;
    L.tubo = g0.xs.map((cx, i) => {
        const yb = g0.y0 + g0.h, h = g0.h * (1 - fr[i]) - 8, w = g0.w - 8;
        const n = Math.round(w * h * dens), x0 = cx - w / 2, y0 = g0.y0 + 4;
        return { x0, y0, w, h, p: Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, a: Math.random() * TAU, v: 4 + Math.random() * 5 })),
            ne: Math.round(g0.w * (g0.h * fr[i] - 6) * 0.002), yb, cx };
    });
    L.tubo.firma = L.S + '|' + fracPaciente();
}

export const Tubo = {
    dibujar(L, dt) {
        const g = L.cv.getContext('2d'), S = L.S, s = S / 200, d = L.dpr;
        const firma = [S, estado.pseudo, Math.round(D.naMed), Math.round(D.posm)].join('|');
        if (!L.tuboCv || L.tuboCv.width !== Math.round(S * d) || L.tuboF !== firma) {
            L.tuboF = firma;
            if (!L.tuboCv) L.tuboCv = document.createElement('canvas');
            L.tuboCv.width = Math.round(S * d); L.tuboCv.height = Math.round(S * d);
            const f = L.tuboCv.getContext('2d'); f.setTransform(d, 0, 0, d, 0, 0); pintaFijo(L, f);
            sembrar(L);
        }
        g.setTransform(d, 0, 0, d, 0, 0);
        g.drawImage(L.tuboCv, 0, 0, S, S);
        const g0 = geom(S);
        L.tubo.forEach((t, i) => {
            for (const p of t.p) {
                if (!REDUCIR) {
                    p.a += (Math.random() - 0.5) * 1.2; p.x += Math.cos(p.a) * p.v * dt * s; p.y += Math.sin(p.a) * p.v * dt * s;
                    if (p.x < 0 || p.x > t.w) { p.x = Math.min(t.w, Math.max(0, p.x)); p.a = Math.PI - p.a; }
                    if (p.y < 0 || p.y > t.h) { p.y = Math.min(t.h, Math.max(0, p.y)); p.a = -p.a; }
                }
                brillo(g, t.x0 + p.x, t.y0 + p.y, 1.9 * s, C.oro, 0.9);
            }
            // proteínas o lípidos fijos en la fase no acuosa
            const fr = i ? fracPaciente() : FR_NORMAL, top = g0.y0 + g0.h * (1 - fr);
            const n = Math.round(fr * 60);
            for (let k = 0; k < n; k++) pinta(g, 'alb', t.cx - g0.w / 2 + 5 + ((k * 37) % 100) / 100 * (g0.w - 10), top + 4 + ((k * 53) % 100) / 100 * (g0.h * fr - 10), 2 * s, 0.9);
        });
        g.setLineDash([]); g.globalAlpha = 1;
    },
};
