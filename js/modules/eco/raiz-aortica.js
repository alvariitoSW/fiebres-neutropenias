// Ficha «Raíz aórtica» (Eco cardíaca → Medidas): figura tocable, Tabla 14 de Lang y calculadora de z.
// calcZ puras y exportadas (las prueba autonomo/pruebas/raiz-aortica-z.test.mjs); initRaizAortica() solo pinta.
import { NIVELES_RAIZ, DEVEREUX } from '../../data/raiz-aortica-data.js';

const num = (v) => (v === '' || v === null || v === undefined || !Number.isFinite(Number(v))) ? null : Number(v);
export const fmt = (x, d = 1) => x.toFixed(d).replace('.', ',');
const r1 = (x) => Math.round(x * 10) / 10;
// Rangos aceptados (clamp) y rangos plausibles en adultos
const RANGO = { abs: [0.5, 8], idx: [0.3, 4] };

// z de Lang: (medido − media) / DE de la Tabla 14. valor en cm (o cm/m² si indexado). null si falta algo.
export function zLang(nivel, sexo, valor, indexado = false) {
    const n = NIVELES_RAIZ.find(x => x.id === nivel), v = num(valor);
    if (!n || !['H', 'M'].includes(sexo) || v === null || v <= 0) return null;
    const [media, de] = (indexado ? n.idx : n.abs)[sexo];
    return (v - media) / de;
}
export function avisoLang(valor, indexado = false) {
    const v = num(valor); if (v === null) return null;
    const [a, b] = indexado ? RANGO.idx : RANGO.abs;
    return (v < a || v > b) ? `Valor fuera de lo fisiológico (${fmt(a)}-${fmt(b)} ${indexado ? 'cm/m²' : 'cm'}): revisa la medida.` : null;
}
// Esperado de los senos y z de Devereux. sexo 'H'|'M'. Solo ≥15 años; la SC en m².
export function esperadoDevereux(edad, sc, sexo) {
    const e = num(edad), s = num(sc);
    if (e === null || s === null || e < DEVEREUX.edadMin || s <= 0 || !['H', 'M'].includes(sexo)) return null;
    return DEVEREUX.base + DEVEREUX.edad * e + DEVEREUX.sc * s - DEVEREUX.sexo * (sexo === 'H' ? 1 : 2);
}
export function zDevereux(cm, edad, sc, sexo) {
    const o = num(cm), esp = esperadoDevereux(edad, sc, sexo);
    return (o === null || o <= 0 || esp === null) ? null : (o - esp) / DEVEREUX.see;
}
export function avisosDevereux(cm, edad, sc) {
    const a = [], o = num(cm), e = num(edad), s = num(sc);
    if (e !== null && e < DEVEREUX.edadMin) a.push(`Devereux se validó en ≥${DEVEREUX.edadMin} años: no se calcula.`);
    if (s !== null && (s < 0.5 || s > 3.5)) a.push('Superficie corporal fuera de lo fisiológico (0,5-3,5 m²): revisa el dato.');
    if (o !== null && (o < DEVEREUX.dMin || o > DEVEREUX.dMax)) a.push(`Fuera del rango de validación de Devereux (${DEVEREUX.dMin}-${DEVEREUX.dMax} cm): la z es una extrapolación.`);
    return a;
}
// Grado de dilatación de Devereux, con la z sin redondear (cortes de la fuente: >1,96 leve hasta 3,0; 3,01-4,0 moderada; >4,0 grave)
export function gradoDevereux(z) {
    return z <= 1.96 ? null : z <= 3.0 ? 'leve' : z <= 4.0 ? 'moderada' : 'grave';
}
const FRASES_NIVEL = {
    anillo: 'Anillo: mesosístole, de borde interno a borde interno (I-I); es la inserción basal de las valvas y el único nivel con I-I (pág. 28-29, 32).',
    senos: 'Senos: telediástole, de borde de ataque a borde de ataque (L-L), diámetro máximo perpendicular al eje largo de la aorta; aquí se define la dilatación de la raíz (pág. 30-32).',
    ust: 'Unión sinotubular: telediástole, L-L; es la transición marcada hacia la porción tubular y la cintura de la raíz (pág. 28, 32).',
    asc: 'Ascendente proximal: telediástole, L-L, perpendicular al eje largo; anota su distancia al plano del anillo (pág. 30, 32).'
};


export function initRaizAortica() {
    const $ = (id) => document.getElementById(id);
    const raiz = $('eco-med-raiz'); if (!raiz) return;
    let nivel = null;
    const modo = $('eco-med-modo'), nivelSel = $('eco-med-nivel'), sexoSel = $('eco-med-sexo'), val = $('eco-med-valor');
    const res = $('eco-med-resultado'), aviso = $('eco-med-aviso'), idx = $('eco-med-indexado');

    function seleccionar(id, desdeCalc) {
        nivel = id;
        raiz.querySelectorAll('[data-nivel]').forEach(el => {
            const on = el.dataset.nivel === id;
            if (el.tagName === 'TR') { el.style.outline = on ? '2px solid var(--accent-yellow)' : ''; el.style.fontWeight = on ? '700' : ''; }
            else if (el.tagName === 'BUTTON') { el.classList.toggle('on', on); el.setAttribute('aria-pressed', on); }
            else { el.querySelectorAll('line,circle').forEach(p => p.setAttribute('stroke', on ? 'var(--accent-yellow)' : 'var(--text-dim)')); el.querySelector('circle')?.setAttribute('fill', on ? 'var(--accent-yellow)' : 'var(--bg-main)'); el.querySelector('text')?.setAttribute('fill', on ? 'var(--bg-main)' : 'var(--text-main)'); }
        });
        const tx = $('eco-med-nivel-txt'); if (tx) tx.textContent = FRASES_NIVEL[id] || '';
        if (!desdeCalc && id && modo.value === 'lang') nivelSel.value = id;
        if (!desdeCalc) calcular();
    }
    function calcular() {
        const dev = modo.value === 'devereux';
        $('eco-med-lang-campos').hidden = dev; $('eco-med-dev-campos').hidden = !dev;
        const avisos = []; let html = '', z1 = null;
        if (!dev) {
            const indexado = idx.checked, v = val.value;
            $('eco-med-unidad').textContent = indexado ? 'cm/m²' : 'cm';
            const z = zLang(nivelSel.value, sexoSel.value, v, indexado), a = avisoLang(v, indexado); z1 = z;
            if (a) avisos.push(a);
            if (z !== null) {
                const n = NIVELES_RAIZ.find(x => x.id === nivelSel.value), [m, de] = (indexado ? n.idx : n.abs)[sexoSel.value];
                const alto = r1(z) >= 2;
                html = `<strong>z = ${fmt(z)}</strong> · ${n.nombre}, ${sexoSel.value === 'H' ? 'hombre' : 'mujer'}: media ${fmt(m)} ± ${fmt(de)} ${indexado ? 'cm/m²' : 'cm'}. ` +
                    (alto ? 'Está a 2 DE o más por encima de la media de la tabla.' : r1(z) <= -2 ? 'Está a 2 DE o más por debajo de la media de la tabla.' : 'Dentro de ±2 DE de la media de la tabla.');
            }
            res.className = 'tfg-estado ' + (z !== null && Math.abs(r1(z)) >= 2 ? 'tfg-estado-warn' : 'tfg-estado-neutro');
        } else {
            const o = $('eco-med-d-valor').value, ed = $('eco-med-d-edad').value, sc = $('eco-med-d-sc').value, sx = $('eco-med-d-sexo').value;
            avisos.push(...avisosDevereux(o, ed, sc));
            const z = zDevereux(o, ed, sc, sx);
            if (z !== null) {
                const g = gradoDevereux(z), esp = esperadoDevereux(ed, sc, sx);
                html = `<strong>z = ${fmt(z)}</strong> · senos esperados ${fmt(esp, 2)} cm (error estándar 0,261 cm). ` +
                    (g ? `Dilatación ${g} según Devereux (más de 1,96 errores estándar sobre lo esperado).` : 'No supera 1,96 errores estándar sobre lo esperado.');
            }
            res.className = 'tfg-estado ' + (z !== null && gradoDevereux(z) ? 'tfg-estado-warn' : 'tfg-estado-neutro');
        }
        const zz = !dev && z1 !== null ? z1 : null; $('eco-med-aviso-z').hidden = !(zz !== null && Math.abs(zz) >= 1.5 && Math.abs(zz) <= 2.5);
        res.innerHTML = html || 'Escribe la medida para calcular la z.';
        aviso.hidden = !avisos.length; aviso.textContent = avisos.join(' ');
    }
    raiz.addEventListener('click', (e) => { const t = e.target.closest('[data-nivel]'); if (t && t.tagName !== 'OPTION') seleccionar(t.dataset.nivel); });
    raiz.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('g[data-nivel]')) { e.preventDefault(); seleccionar(e.target.dataset.nivel); } });
    [modo, sexoSel, val, idx, $('eco-med-d-valor'), $('eco-med-d-edad'), $('eco-med-d-sc'), $('eco-med-d-sexo')].forEach(el => el?.addEventListener('input', calcular));
    nivelSel.addEventListener('change', () => { seleccionar(nivelSel.value, true); calcular(); });
    // Devereux solo vale para los senos: al elegirlo, se marca ese nivel
    modo.addEventListener('change', () => { if (modo.value === 'devereux') seleccionar('senos', true); calcular(); });
    seleccionar('senos'); 
}
