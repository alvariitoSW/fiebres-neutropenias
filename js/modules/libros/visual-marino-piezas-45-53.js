// Piezas a medida para la vista Visual de Marino, caps. 45-53 (paneles
// `propio` del kit). Mismo criterio que visual-marino-piezas.js: no calculan
// nada que no diga la ficha (o, si es fisiología general, lo dicen), leen
// sus tablas y controles reales, escriben en las calculadoras de siempre y
// copian su resultado. Cada pieza lleva "Texto ↓" hacia su línea.
import { $, num, fmt, C, coma, SVG, aTexto, engancharTexto, alCambiar, escribir, copiar, filas } from './visual-marino-piezas.js';
import { irAlTexto } from '../../core/vista-visual.js';
import { openCorkboardTopic } from '../../core/corkboard.js';
import { lineaNomograma } from './marino-toxicos.js';
import { bolsaNpt } from './marino-nutricion.js';

// Caja donde se copia el resultado de una calculadora.
const caja = id => `<div id="${id}" hidden></div>`;

// ---------- Cap. 45: Glasgow y pupilas sobre una cara ----------
const PUP = {
    dilR: [9, 9, true], dilNR: [9, 9, false], uni: [9, 3.5, false], medR: [5, 5, true], medNR: [5, 5, false],
    horner: [5, 3, true], pequeR: [3, 3, true], puntR: [1.6, 1.6, true], puntNR: [1.6, 1.6, false]
};
export const caraGlasgow = {
    tipo: 'propio', titulo: 'Glasgow y pupilas, en una cara',
    nota: 'Toca los botones: escriben en la calculadora del Glasgow (su resultado, en el panel de abajo) y en el selector de pupilas de la ficha. El dibujo solo enseña lo elegido.',
    render(cuerpo, { tab }) {
        const opciones = id => [...$(id).options].filter(o => o.value).map(o => `<button type="button" class="mrp-ley" style="--c:${C('purple')}" data-sel="${id}" data-val="${o.value}">${o.textContent}</button>`).join('');
        cuerpo.innerHTML = `<div id="mrp-cara"></div>
            <p class="mrp-pie">Ojos (O)</p><div class="mrp-leyenda">${opciones('mn-gcs-o')}</div>
            <p class="mrp-pie">Voz (V)</p><div class="mrp-leyenda">${opciones('mn-gcs-v')}</div>
            <p class="mrp-pie">Movimiento (M)</p><div class="mrp-leyenda">${opciones('mn-gcs-m')}</div>
            <p class="mrp-pie">Pupilas (Tabla 45.4)</p><div class="mrp-leyenda">${opciones('mn-pup-select')}</div>
            ${caja('mrp-cara-pup')}
            ${aTexto('mn-gcs-calc', 'Glasgow ↓')} ${aTexto('mn-tabla-45-4', 'Tabla 45.4 ↓')}`;
        cuerpo.addEventListener('click', e => {
            const b = e.target.closest('[data-sel]');
            if (b) escribir(b.dataset.sel, b.dataset.val);
        });
        const pintar = () => {
            const o = Number($('mn-gcs-o').value), v = $('mn-gcs-v').value, m = Number($('mn-gcs-m').value), p = PUP[$('mn-pup-select').value];
            const abiertos = o >= 3 ? 1 : o === 2 ? 0.45 : 0;
            const ojo = (cx, r) => abiertos
                ? `<ellipse cx="${cx}" cy="70" rx="17" ry="${(10 * abiertos).toFixed(1)}" fill="var(--bg-card)" stroke="var(--text-main)"/><circle cx="${cx}" cy="70" r="${Math.min(p ? r : 5, 10 * abiertos)}" fill="var(--text-main)"/>`
                : `<path d="M${cx - 17},70 Q${cx},78 ${cx + 17},70" fill="none" stroke="var(--text-main)" stroke-width="2"/>`;
            const voz = { 5: 'Orientado', 4: 'Confuso', 3: 'Palabras sueltas', 2: 'Sonidos', 1: '…', T: 'Intubado' }[v] || '';
            const boca = v === 'T' ? `<rect x="93" y="112" width="34" height="9" rx="3" fill="${C('blue')}"/>` : `<path d="M88,116 Q110,${v >= 4 ? 128 : 120} 132,116" fill="none" stroke="var(--text-main)" stroke-width="2"/>`;
            const mano = { 6: 'Obedece', 5: 'Localiza', 4: 'Retira', 3: 'Decorticación', 2: 'Descerebración', 1: 'Sin respuesta' }[m] || '';
            const luz = !p ? '<text x="110" y="226" text-anchor="middle" class="mrp-pq">Elige un patrón de pupilas</text>' : p[2] ? '<text x="110" y="226" text-anchor="middle" class="mrp-pq">Reactivas a la luz</text>' : `<text x="110" y="226" text-anchor="middle" class="mrp-pq" fill="${C('red')}">No reactivas</text>`;
            const pupila = (cx, r) => `<ellipse cx="${cx}" cy="200" rx="17" ry="10" fill="var(--bg-card)" stroke="var(--text-muted)"/>${p ? `<circle cx="${cx}" cy="200" r="${r}" fill="var(--text-main)"/>` : ''}`;
            cuerpo.querySelector('#mrp-cara').innerHTML = SVG('0 0 220 232', `
                <ellipse cx="110" cy="85" rx="62" ry="72" fill="none" stroke="var(--border-color)" stroke-width="2"/>
                ${ojo(85, p?.[0] ?? 5)}${ojo(135, p?.[1] ?? 5)}${luz}${boca}
                <rect x="150" y="6" width="66" height="22" rx="8" fill="none" stroke="${C('yellow')}"/><text x="183" y="21" text-anchor="middle" class="mrp-pq">V: ${voz}</text>
                <text x="8" y="172" class="mrp-pq">O ${o} · ${abiertos ? 'ojos abiertos' : 'ojos cerrados'}</text>
                <text x="212" y="172" text-anchor="end" class="mrp-pq">M: ${mano}</text>
                <text x="110" y="186" text-anchor="middle" class="mrp-pq">Pupilas, al abrirle los ojos</text>${pupila(85, p?.[0] ?? 5)}${pupila(135, p?.[1] ?? 5)}`, 'Cara con los ojos, la voz y las pupilas elegidas');
            copiar(cuerpo.querySelector('#mrp-cara-pup'), 'mn-pup-resultado');
            cuerpo.querySelectorAll('[data-sel]').forEach(b => b.classList.toggle('on', $(b.dataset.sel).value === b.dataset.val));
        };
        alCambiar(['mn-gcs-o', 'mn-gcs-v', 'mn-gcs-m', 'mn-gcs-contexto', 'mn-pup-select'], pintar);
        pintar();
        engancharTexto(cuerpo, tab);
    }
};

// ---------- Cap. 50: la bolsa de NPT ----------
export const bolsaVisual = {
    tipo: 'propio', titulo: 'La bolsa de NPT, por dentro',
    nota: 'Mismas cuentas que la calculadora "Construir la NPT" (pasos 1-4): las calorías no proteicas (GER) se reparten entre propofol, lípidos y glucosa; las proteínas van aparte, como en el método del capítulo.',
    render(cuerpo, { tab }) {
        cuerpo.innerHTML = `<div id="mrp-npt"></div>${aTexto('mu-npt-calc', 'La calculadora ↓')} ${aTexto('mu-npt-paso4', 'Paso 4 ↓')}`;
        const pintar = () => {
            const p = num($('mu-npt-peso')), gkg = num($('mu-npt-prot'));
            const lip = num($('mu-npt-lip')) ?? 0, prop = num($('mu-npt-propofol')) ?? 0;
            const destino = cuerpo.querySelector('#mrp-npt');
            if (!p || p <= 0 || gkg === null) { destino.innerHTML = ''; return; }
            const b = bolsaNpt(p, gkg, lip, prop);
            const barra = (partes, total, alto, y) => {
                let x = 10, out = '';
                partes.forEach(([v, col, etq]) => {
                    const w = total > 0 ? Math.max(0, v) / total * 300 : 0;
                    if (w > 0) out += `<rect x="${x}" y="${y}" width="${w}" height="${alto}" fill="${C(col)}" opacity="0.75"/>${w > 34 ? `<text x="${x + w / 2}" y="${y + alto / 2 + 3}" text-anchor="middle" class="mrp-pq">${etq}</text>` : ''}`;
                    x += w;
                });
                return out;
            };
            const kcal = [[b.propKcal, 'yellow', `Propofol ${fmt(b.propKcal, 0)}`], [b.lipKcal, 'purple', `Lípidos ${fmt(b.lipKcal, 0)}`], [Math.max(0, b.d50Kcal), 'blue', `Glucosa ${fmt(Math.max(0, b.d50Kcal), 0)}`]];
            const ml = [[b.aaMl, 'green', `AA ${fmt(b.aaMl, 0)}`], [lip, 'purple', `Lípidos ${fmt(lip, 0)}`], [b.d50Ml, 'blue', `D50 ${fmt(b.d50Ml, 0)}`], [30, 'yellow', '30']];
            const totK = Math.max(b.ger, b.propKcal + b.lipKcal);
            destino.innerHTML = SVG('0 0 320 120', `
                <text x="10" y="14" class="mrp-eje">Calorías no proteicas: ${fmt(b.ger, 0)} kcal/día (25 × peso)</text>
                ${barra(kcal, totK, 26, 20)}
                <text x="10" y="66" class="mrp-eje">Volumen: ${fmt(b.total, 0)} mL → ${fmt(b.ritmo, 0)} mL/h</text>
                ${barra(ml, b.total, 26, 72)}
                <text x="10" y="114" class="mrp-pq">Proteínas ${fmt(b.prot, 0)} g/día · glucosa ${fmt(b.mgkgmin, 1)} mg/kg/min (máx. 5)</text>`, 'Reparto de calorías y volumen de la bolsa de NPT');
        };
        alCambiar(['mu-npt-peso', 'mu-npt-prot', 'mu-npt-lip', 'mu-npt-propofol', 'mu-npt-riesgo'], pintar);
        pintar();
        engancharTexto(cuerpo, tab);
    }
};

// ---------- Cap. 48: la escalera de la tiamina (Tabla 48.4) ----------
export const escaleraTiamina = {
    tipo: 'propio', titulo: 'La tiamina, en escalera (Tabla 48.4)',
    nota: 'Cada peldaño es la dosis diaria del paso de la tabla; la línea discontinua, los 100 mg/día que se suelen dar a los pacientes de riesgo, que no bastan.',
    render(cuerpo, { tab }) {
        const celda = filas('mu-tabla-48-4').map(r => r.textContent).find(t => /Tratamiento/.test(t)) || '';
        const pasos = [...celda.matchAll(/(\d+)\)\s*(\d+)\s*mg[^,;]*?(IV|orales)[^,;]*?(cada (\d+) h|al día|una vez al día)[^;]*?(?:,\s*([^;.]+))?[;.]/g)]
            .map(m => ({ paso: m[1], mg: Number(m[2]) * (m[5] ? 24 / Number(m[5]) : 1), via: m[3], cada: m[4], dur: (m[6] || 'mantenimiento').trim() }));
        const max = Math.max(...pasos.map(p => p.mg), 1);
        cuerpo.innerHTML = `<div class="mrp-escalera">${pasos.map(p => `<div class="mrp-esc-fila" style="grid-template-columns:40px 1fr 112px;"><span>${p.paso}) ${p.via}</span><i style="width:${p.mg / max * 100}%; background:${p.via === 'IV' ? C('red') : C('green')}"></i><em>${fmt(p.mg, 0)} mg/día · ${p.dur}</em></div>`).join('')}
            <div class="mrp-esc-fila" style="grid-template-columns:40px 1fr 112px;"><span>Riesgo</span><i style="width:${100 / max * 100}%; background:none; border:1px dashed ${C('yellow')}"></i><em>100 mg/día: no basta</em></div></div>
            ${aTexto('mu-tabla-48-4', 'Tabla 48.4 ↓')} ${aTexto('mu-tia-tto', 'La dosis importa ↓')}`;
        engancharTexto(cuerpo, tab);
    }
};

// ---------- Cap. 52: el nomograma del paracetamol con el paciente ----------
export const nomogramaVivo = {
    tipo: 'propio', titulo: 'El nomograma, con tu paciente',
    nota: 'Las dos líneas, como en la calculadora: puntos leídos en la Figura 52.3 (tratamiento: 150, 75, 37,5, 18,8, 9,4 y 5 µg/mL a las 4, 8, 12, 16, 20 y 24 h; alto riesgo: de 300 a 10), con interpolación aproximada entre ellos. Toca el gráfico para colocar al paciente.',
    render(cuerpo, { tab }) {
        cuerpo.innerHTML = `<div id="mrp-nomo"></div>${aTexto('mt-para-nomograma', 'Nomograma ↓')} ${aTexto('mt-nomo-calc', 'La calculadora ↓')}`;
        const X = t => 40 + (t - 4) / 20 * 265, Y = v => 175 - Math.log10(v) / 3 * 165;
        const linea = alto => { let d = ''; for (let t = 4; t <= 24.01; t += 0.5) d += `${d ? 'L' : 'M'}${X(t).toFixed(1)},${Y(lineaNomograma(t, alto)).toFixed(1)}`; return d; };
        const pintar = () => {
            const t = num($('mt-nomo-horas')), n = num($('mt-nomo-nivel')), umol = $('mt-nomo-unidad').value === 'umol';
            const ug = n === null ? null : umol ? n / 6.62 : n;
            const ejesX = [4, 8, 12, 16, 20, 24].map(h => `<text x="${X(h)}" y="190" text-anchor="middle">${h} h</text><line x1="${X(h)}" x2="${X(h)}" y1="10" y2="175" class="mrp-rejilla"/>`).join('');
            const ejesY = [1, 10, 100, 1000].map(v => `<text x="34" y="${Y(v) + 3}" text-anchor="end">${v}</text><line x1="40" x2="305" y1="${Y(v)}" y2="${Y(v)}" class="mrp-rejilla"/>`).join('');
            const dentro = t !== null && ug !== null && t >= 4 && t <= 24 && ug > 0;
            const punto = dentro ? `<circle cx="${X(t)}" cy="${Math.max(10, Y(Math.min(ug, 1000)))}" r="6" fill="var(--text-main)" stroke="var(--bg-main)" stroke-width="2"/>` : '';
            cuerpo.querySelector('#mrp-nomo').innerHTML = SVG('0 0 320 196', `${ejesY}${ejesX}
                <path d="${linea(true)}" fill="none" stroke="${C('red')}" stroke-width="2.4"/>
                <path d="${linea(false)}" fill="none" stroke="${C('yellow')}" stroke-width="2.4"/>
                <text x="${X(14)}" y="${Y(lineaNomograma(14, true)) - 6}" fill="${C('red')}">alto riesgo</text>
                <text x="${X(14)}" y="${Y(lineaNomograma(14)) + 14}" text-anchor="end" fill="${C('yellow')}">tratamiento</text>
                <text x="44" y="18" class="mrp-eje">µg/mL (escala log)</text>${punto}`, 'Nomograma del paracetamol con el nivel del paciente');
        };
        cuerpo.querySelector('#mrp-nomo').addEventListener('click', e => {
            const svg = e.currentTarget.querySelector('svg');
            if (!svg) return;
            const r = svg.getBoundingClientRect(), sx = (e.clientX - r.left) / r.width * 320, sy = (e.clientY - r.top) / r.height * 196;
            if (sx < 40 || sx > 305 || sy < 10 || sy > 175) return;
            const t = Math.round((4 + (sx - 40) / 265 * 20) * 2) / 2, v = Math.round(10 ** ((175 - sy) / 165 * 3));
            escribir('mt-nomo-unidad', 'ug');
            if ($('mt-nomo-tipo').value === 'repetida') escribir('mt-nomo-tipo', 'aguda');
            escribir('mt-nomo-horas', t);
            escribir('mt-nomo-nivel', v);
        });
        alCambiar(['mt-nomo-horas', 'mt-nomo-nivel', 'mt-nomo-unidad', 'mt-nomo-tipo'], pintar);
        pintar();
        engancharTexto(cuerpo, tab);
    }
};

// ---------- Cap. 52: alcalinizar la orina (fisiología general) ----------
export const alcalinizacion = {
    tipo: 'propio', titulo: 'Por qué alcalinizar la orina',
    nota: 'Fisiología general, no del capítulo: el salicílico es un ácido débil (pKa ≈3); solo la forma no ionizada atraviesa la membrana y se reabsorbe. Al subir el pH urinario queda atrapado como salicilato y sale por la orina. El objetivo, pH ≥7,5, es el de la Tabla 52.3.',
    render(cuerpo, { tab }) {
        cuerpo.innerHTML = `<div class="form-group"><label for="mrp-alc-ph">pH de la orina: <strong id="mrp-alc-ph-v"></strong></label><input type="range" id="mrp-alc-ph" min="5" max="8" step="0.1" value="6" style="width:100%;box-sizing:border-box;margin-left:0;margin-right:0;"></div>
            <div id="mrp-alc"></div><div class="tfg-estado" id="mrp-alc-res"></div>
            ${aTexto('mt-sal-alcalinizar', 'Alcalinizar ↓')} ${aTexto('mt-sal-potasio', '¿Por qué el potasio? ↓')}`;
        const PKA = 3, noIon = ph => 1 / (1 + 10 ** (ph - PKA));
        const pintar = () => {
            const ph = Number(cuerpo.querySelector('#mrp-alc-ph').value);
            cuerpo.querySelector('#mrp-alc-ph-v').textContent = fmt(ph);
            const f = noIon(ph), ref = noIon(5), puntos = 40;
            const reabs = Math.max(0, Math.round(f / ref * puntos));
            let pts = '';
            for (let i = 0; i < puntos; i++) pts += `<circle cx="${20 + (i % 20) * 14}" cy="${30 + Math.floor(i / 20) * 16}" r="5" fill="${i < reabs ? C('red') : C('green')}"/>`;
            cuerpo.querySelector('#mrp-alc').innerHTML = SVG('0 0 300 92', `${pts}<text x="10" y="68" class="mrp-pq" style="font-size:11.5px">Rojo: no ionizado, se reabsorbe (pH 5 = 40).</text><text x="10" y="84" class="mrp-pq" style="font-size:11.5px">Verde: atrapado en la orina.</text>`, 'Salicilato ionizado y no ionizado en la orina');
            const r = cuerpo.querySelector('#mrp-alc-res');
            r.className = `tfg-estado tfg-estado-${ph >= 7.5 ? 'ok' : ph >= 6.5 ? 'warn' : 'danger'}`;
            r.innerHTML = `pH ${fmt(ph)}: la forma reabsorbible es <strong>${fmt(ref / f, 0)} ${Math.round(ref / f) === 1 ? 'vez' : 'veces'} menor</strong> que a pH 5 (${ph >= 7.5 ? 'en el objetivo de la Tabla 52.3' : 'por debajo del objetivo ≥7,5'}).`;
        };
        cuerpo.querySelector('#mrp-alc-ph').addEventListener('input', pintar);
        pintar();
        engancharTexto(cuerpo, tab);
    }
};

// ---------- Cap. 53: la COHb, con aire y con O₂ al 100% ----------
export const caidaCohb = {
    tipo: 'propio', titulo: 'Cómo baja la COHb',
    nota: 'Semivida de 320 min con aire y 74 min con O₂ al 100% (ficha). Parte de la COHb de la calculadora; la línea discontinua es su umbral (3-4% o 10% en fumadores).',
    render(cuerpo, { tab }) {
        cuerpo.innerHTML = `<div id="mrp-cohb"></div>${aTexto('mt-co-o2', 'Oxígeno al 100% ↓')} ${aTexto('mt-co-calc', 'La calculadora ↓')}`;
        const pintar = () => {
            const c = num($('mt-co-cohb')), umbral = $('mt-co-fumador').value === 'si' ? 10 : 4, destino = cuerpo.querySelector('#mrp-cohb');
            if (c === null || c <= 0 || c > 100) { destino.innerHTML = ''; return; }
            const ymax = Math.max(c, umbral) * 1.1, X = t => 34 + t / 480 * 276, Y = v => 160 - v / ymax * 145;
            const curva = T => { let d = ''; for (let t = 0; t <= 480; t += 8) d += `${d ? 'L' : 'M'}${X(t).toFixed(1)},${Y(c * 0.5 ** (t / T)).toFixed(1)}`; return d; };
            const ticks = [0, 60, 120, 180, 240, 300, 360, 420, 480].map(t => `<text x="${X(t)}" y="174" text-anchor="middle">${t / 60} h</text>`).join('');
            destino.innerHTML = SVG('0 0 320 180', `${ticks}
                <line x1="34" x2="310" y1="${Y(umbral)}" y2="${Y(umbral)}" class="mrp-guia"/><text x="306" y="${Y(umbral) - 4}" text-anchor="end">umbral ${umbral}%</text>
                <path d="${curva(320)}" fill="none" stroke="${C('yellow')}" stroke-width="2.2"/>
                <path d="${curva(74)}" fill="none" stroke="${C('green')}" stroke-width="2.2"/>
                <text x="40" y="16" fill="${C('green')}">O₂ al 100% (74 min)</text><text x="180" y="16" fill="${C('yellow')}">Aire (320 min)</text>
                <text x="30" y="${Y(c) + 3}" text-anchor="end">${fmt(c, 0)}%</text>`, 'Caída de la carboxihemoglobina con aire y con oxígeno al 100%');
        };
        alCambiar(['mt-co-cohb', 'mt-co-fumador', 'mt-co-grave'], pintar);
        pintar();
        engancharTexto(cuerpo, tab);
    }
};

// ---------- Cap. 53: la pauta del fomepizol en el tiempo (Tabla 53.2) ----------
export const lineaFomepizol = {
    tipo: 'propio', titulo: 'El fomepizol, en el tiempo (Tabla 53.2)',
    nota: 'Dosis con el peso de la calculadora. Mejor empezar en las 4 primeras horas de la ingesta; seguir hasta alcohol tóxico <20 mg/dL, pH normal y asintomático.',
    render(cuerpo, { tab }) {
        cuerpo.innerHTML = `<div id="mrp-fome"></div>${aTexto('mt-tabla-53-2', 'Tabla 53.2 ↓')} ${aTexto('mt-alc-hd', 'Hemodiálisis ↓')}`;
        const pintar = () => {
            const p = num($('mt-fome-peso')), destino = cuerpo.querySelector('#mrp-fome');
            if (!p || p < 20 || p > 300) { destino.innerHTML = ''; return; }
            const X = h => 24 + h / 84 * 280, g = n => n.toLocaleString('es-ES', { maximumFractionDigits: 0, useGrouping: 'always' }), T = 'style="font-size:11.5px"';
            const dosis = [[0, 15, 'red', 'Carga'], [12, 10, 'yellow'], [24, 10, 'yellow'], [36, 10, 'yellow'], [48, 10, 'yellow'], [60, 15, 'purple'], [72, 15, 'purple']];
            const marcas = dosis.map(([h, mgkg, col, etq], i) => `<circle cx="${X(h)}" cy="70" r="${mgkg === 15 ? 8 : 6}" fill="${C(col)}" opacity="${h >= 60 ? 0.5 : 0.9}"/><text x="${etq ? X(h) - 8 : X(h)}" y="${etq ? 50 : 92 + (i % 2) * 14}" text-anchor="${etq ? 'start' : 'middle'}" class="mrp-pq" ${T}>${etq ? `${etq} ` : ''}${g(mgkg * p)} mg</text>`).join('');
            const ticks = [0, 12, 24, 36, 48, 60, 72, 84].map(h => `<text x="${X(h)}" y="128" text-anchor="${h === 84 ? 'end' : 'middle'}" ${T}>${h} h</text>`).join('');
            destino.innerHTML = SVG('0 0 320 170', `
                <line x1="${X(0)}" x2="${X(84)}" y1="70" y2="70" class="mrp-rejilla"/>
                ${marcas}${ticks}
                <text x="${X(0)}" y="14" class="mrp-pq" ${T}>Con más de una sesión de diálisis:</text><text x="${X(0)}" y="29" class="mrp-pq" ${T}>15 mg/kg cada 4 h</text>
                <text x="${X(0)}" y="148" class="mrp-pq" fill="${C('yellow')}" ${T}>10 mg/kg/12 h, 4 dosis</text>
                <text x="${X(0)}" y="164" class="mrp-pq" fill="${C('purple')}" ${T}>15 mg/kg/12 h si sigue &gt;20</text>`, 'Pauta del fomepizol a lo largo del tiempo');
        };
        alCambiar(['mt-fome-toxico', 'mt-fome-peso', 'mt-fome-ph', 'mt-fome-organo', 'mt-fome-vision'], pintar);
        pintar();
        engancharTexto(cuerpo, tab);
    }
};

// ---------- Caps. 52-53: todos los antídotos en una vista ----------
const ANTIDOTOS = [
    ['Paracetamol', 'mt-nac', [['N-acetilcisteína', 'mt-nac-indicacion']], [['La NAC también se dializa', 'mt-nac-hd-txt']]],
    ['Benzodiacepinas', 'mt-bzd-betabloq', [['Flumazenil (con cuidado)', 'mt-flumazenil']], []],
    ['Betabloqueantes', 'mt-bzd-betabloq', [['Glucagón', 'mt-glucagon-uso']], []],
    ['Opioides', 'mt-opioides', [['Naloxona', 'mt-naloxona']], []],
    ['Salicilatos', 'mt-salicilatos', [['Carbón activado', 'mt-sal-carbon'], ['Alcalinizar la orina', 'mt-sal-alcalinizar']], [['Hemodiálisis', 'mt-sal-hd']]],
    ['Monóxido de carbono', 'mt-co', [['Oxígeno al 100%', 'mt-co-o2']], []],
    ['Cianuro', 'mt-cianuro', [['Hidroxocobalamina', 'mt-cn-hidroxo'], ['Tiosulfato', 'mt-cn-tiosulfato']], []],
    ['Etilenglicol y metanol', 'mt-alcoholes', [['Fomepizol', 'mt-alc-fomepizol'], ['Coadyuvantes', 'mt-alc-coadyuvantes']], [['Hemodiálisis', 'mt-alc-hd']]]
];
export const matrizAntidotos = {
    tipo: 'propio', titulo: 'Los antídotos del bloque (caps. 52-53)',
    nota: 'Una fila por tóxico. Cada botón lleva a su línea en la ficha correspondiente.',
    render(cuerpo) {
        const btn = ([etq, id], tabId, col) => `<button type="button" class="mrp-ley" style="--c:${C(col)}" data-tab="${tabId}" data-linea="${id}">${etq}</button>`;
        cuerpo.innerHTML = `<div style="overflow-x:auto;"><table class="data-table"><thead><tr><th>Tóxico</th><th>Antídoto o medida</th><th>Diálisis</th></tr></thead><tbody>${ANTIDOTOS.map(([tox, tabId, ant, hd]) =>
            `<tr><td>${tox}</td><td><div class="mrp-leyenda">${ant.map(a => btn(a, tabId, 'green')).join('')}</div></td><td><div class="mrp-leyenda">${hd.length ? hd.map(a => btn(a, tabId, 'purple')).join('') : '—'}</div></td></tr>`).join('')}</tbody></table></div>`;
        cuerpo.addEventListener('click', e => {
            const b = e.target.closest('[data-linea]');
            if (!b) return;
            openCorkboardTopic('panel-marino-tox-tabs', b.dataset.tab);
            irAlTexto($(b.dataset.tab), $(b.dataset.linea));
        });
    }
};
