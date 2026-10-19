// Ácido-base vivo: la fisiología que se calcula (sin DOM). Fichas de Marino (The ICU Book, 5.ª ed.).
// El pH SIEMPRE sale de la Ec. 31.2 ([H⁺] = 24 × PaCO₂ / HCO₃⁻) y la 31.1 (pH = 9 − log [H⁺] en nEq/L).
// Tolerancias de la lectura (±1 en la Regla 3, ±0,5 en la 4): las de la calculadora de la app, no de la fuente.
import { FUENTES, ALB_A } from '../../data/acidobase-vivo-data.js';

export const r2 = v => Math.round(v * 100) / 100;
export const r1 = v => Math.round(v * 10) / 10;

export const hNeq = (p, h) => 24 * p / h;                       // Ec. 31.2 · mr-acidobase-analisis#mr-ecuacion-h
export const calcPH = (p, h) => 9 - Math.log10(hNeq(p, h));     // Ec. 31.1 con [H⁺] en nEq/L

// PaCO₂ esperada en un trastorno metabólico (Fig. 31.2) · {v, lo, hi}
export function espPaco2(h, f = 'marino') {
    if (f === 'nefro') {
        if (h < 25) return { v: 40 - 1.2 * (25 - h), lo: 40 - 1.2 * (25 - h), hi: 40 - 0.85 * (25 - h) };
        return { v: 40 + 0.7 * (h - 25), lo: 40 + 0.7 * (h - 25), hi: 40 + 0.7 * (h - 25) };
    }
    const v = h <= 24 ? 40 - 1.2 * (24 - h) : 40 + 0.7 * (h - 24);
    return { v, lo: v, hi: v };
}
// HCO₃⁻ esperado en un trastorno respiratorio (Fig. 31.2): agudo y crónico · {ag, agLo, agHi, cr}
export function espHco3(p, f = 'marino') {
    if (f === 'nefro') {
        if (p >= 40) return { ag: 25 + 0.1 * (p - 40), agLo: 25 + 0.1 * (p - 40), agHi: 25 + 0.1 * (p - 40), cr: 25 + 0.3 * (p - 40) };
        return { ag: 25 - 0.2 * (40 - p), agLo: 25 - 0.25 * (40 - p), agHi: 25 - 0.2 * (40 - p), cr: 25 - 0.5 * (40 - p) };
    }
    if (p >= 40) return { ag: 24 + 0.1 * (p - 40), agLo: 24 + 0.1 * (p - 40), agHi: 24 + 0.1 * (p - 40), cr: 24 + 0.4 * (p - 40) };
    return { ag: 24 - 0.2 * (40 - p), agLo: 24 - 0.2 * (40 - p), agHi: 24 - 0.2 * (40 - p), cr: 24 - 0.4 * (40 - p) };
}
export const haBase = (alb, f = 'marino') => 12 - 2.5 * (FUENTES[f].albN - alb);   // el hiato «de siempre» con esa albúmina (Ec. 31.15 al revés)

// derivar(estado): todas las cifras que se pintan salen de aquí
export function derivar(e) {
    const f = e.fuente, F = FUENTES[f];
    const H = hNeq(e.paco2, e.hco3), ph = calcPH(e.paco2, e.hco3);
    const HA = e.na - e.cl - e.hco3;                                 // Ec. 31.14
    const HAc = HA + 2.5 * (F.albN - e.alb);                         // Ec. 31.15
    const aniones = Math.max(0, HAc - 12);                           // lo que el hiato tiene de más (cetoácidos, lactato…)
    const delta = e.hco3 < 24 && 24 - e.hco3 >= 1 && HA > 12.5 ? (HA - 12) / (24 - e.hco3) : null;  // Ec. 31.16 (con el HA, como la ficha); solo con HA elevado
    const osmCalc = 2 * e.na + e.glu / 18 + e.bun / 2.8;            // Ec. 31.17
    const osmGap = e.osm == null ? null : e.osm - osmCalc;
    const eP = espPaco2(e.hco3, f), eH = espHco3(e.paco2, f);
    const albBloque = ALB_A - 2.5 * (F.albN - e.alb);
    return { H, ph, HA, HAc, aniones, delta, osmCalc, osmGap, eP, eH, albBloque, lectura: leer(e, ph, eP, eH) };
}

// El método de Marino (Reglas 1-4, mr-acidobase-analisis).
export function leer(e, ph, eP, eH) {
    const p = e.paco2, h = e.hco3, phR = r2(ph);
    const phN = phR >= 7.36 && phR <= 7.44, pN = p >= 36 && p <= 44;
    const R = { prim: null, txt: '', regla: '', anadido: null, estado: 'neutro' };
    if (phN && pN) { R.prim = 'normal'; R.txt = 'pH y PaCO₂ en rango'; R.regla = 'rangos'; return R; }
    if (phN && !pN) {
        R.prim = 'mixto'; R.regla = 'Regla 2';
        R.txt = p > 44 ? 'trastorno mixto: acidosis respiratoria + alcalosis metabólica' : 'trastorno mixto: alcalosis respiratoria + acidosis metabólica';
        R.estado = 'warn'; return R;
    }
    const acid = phR < 7.36;
    if (pN) R.prim = acid ? 'acidMet' : 'alcMet';
    else { const mismo = (acid && p < 36) || (!acid && p > 44); R.prim = mismo ? (acid ? 'acidMet' : 'alcMet') : (acid ? 'acidResp' : 'alcResp'); }
    R.regla = pN ? 'pH anormal con PaCO₂ normal: metabólico' : 'Regla 1';
    R.estado = 'danger';
    if (R.prim === 'acidMet' || R.prim === 'alcMet') {
        const nombre = R.prim === 'acidMet' ? 'acidosis metabólica' : 'alcalosis metabólica';
        if (e.teorico || e.reloj === 'min') { R.txt = `${nombre}: el pulmón aún no ha respondido`; R.anadido = 'sin'; return R; }
        const lo = Math.min(eP.lo, eP.hi) - (e.fuente === 'nefro' ? 0 : 1), hi = Math.max(eP.lo, eP.hi) + (e.fuente === 'nefro' ? 0 : 1);
        const pr = Math.round(p * 10) / 10;
        if (pr > hi) { R.anadido = 'acidResp'; R.txt = `${nombre} con acidosis respiratoria añadida`; }
        else if (pr < lo) { R.anadido = 'alcResp'; R.txt = `${nombre} con alcalosis respiratoria añadida`; }
        else { R.anadido = 'no'; R.txt = `${nombre} compensada por el pulmón`; }
        R.regla += ' · Regla 3';
    } else {
        const nombre = R.prim === 'acidResp' ? 'acidosis respiratoria' : 'alcalosis respiratoria';
        const hr = Math.round(h * 10) / 10, ag = eH.ag, cr = eH.cr, tol = .5;
        R.regla += ' · Regla 4';
        if (R.prim === 'acidResp') {
            if (hr < Math.min(eH.agLo, ag) - tol) { R.anadido = 'acidMet'; R.txt = `${nombre} con acidosis metabólica añadida`; }
            else if (hr > cr + tol) { R.anadido = 'alcMet'; R.txt = `${nombre} con alcalosis metabólica añadida`; }
            else if (Math.abs(hr - ag) <= tol) { R.anadido = 'aguda'; R.txt = `${nombre} aguda`; }
            else if (Math.abs(hr - cr) <= tol) { R.anadido = 'cronica'; R.txt = `${nombre} crónica (compensada)`; }
            else { R.anadido = 'parcial'; R.txt = `${nombre} parcialmente compensada`; }
        } else {
            if (hr > Math.max(eH.agHi, ag) + tol) { R.anadido = 'alcMet'; R.txt = `${nombre} con alcalosis metabólica añadida`; }
            else if (hr < cr - tol) { R.anadido = 'acidMet'; R.txt = `${nombre} con acidosis metabólica añadida`; }
            else if (Math.abs(hr - ag) <= tol) { R.anadido = 'aguda'; R.txt = `${nombre} aguda`; }
            else if (Math.abs(hr - cr) <= tol) { R.anadido = 'cronica'; R.txt = `${nombre} crónica (compensada)`; }
            else { R.anadido = 'parcial'; R.txt = `${nombre} parcialmente compensada`; }
        }
    }
    return R;
}
export const palabraPH = ph => { const v = r2(ph); return v < 7.36 ? 'acidemia' : v > 7.44 ? 'alcalemia' : 'normal'; };
