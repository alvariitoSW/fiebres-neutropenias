// Piezas a medida para la vista Visual de Marino, caps. 31-44 (paneles
// `propio` del kit). Igual que el resto de la vista Visual, no calculan nada
// que no diga la ficha: leen sus tablas y controles reales, escriben en las
// calculadoras de siempre y copian su resultado. Cada pieza lleva botones
// "Texto ↓" hacia la línea de la ficha de la que sale.
import { irAlTexto } from '../../core/vista-visual.js';
import { initSiNoWizard } from '../../core/wizard.js';
import { deficitK } from './marino-renal.js';

const $ = id => document.getElementById(id);
const num = el => (el && el.value !== '' ? Number(el.value) : null);
const fmt = (v, d = 1) => v.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d });
const C = c => `var(--accent-${c})`;
const coma = t => Number(String(t).replace(',', '.').replace(/[^\d.]/g, ''));
const SVG = (vb, cuerpo, etq) => `<svg class="mrp-svg" viewBox="${vb}" role="img" aria-label="${etq}">${cuerpo}</svg>`;

// Botón hacia una línea del texto de la ficha.
const aTexto = (id, etiqueta = 'Texto ↓') => `<button type="button" class="visual-link mrp-texto" data-ir="${id}">${etiqueta}</button>`;
function engancharTexto(cuerpo, tab) {
    cuerpo.addEventListener('click', e => {
        const b = e.target.closest('[data-ir]');
        if (b) irAlTexto(tab, $(b.dataset.ir));
    });
}
// Repinta cuando cambian esos controles (desde el texto o desde la vista Visual).
function alCambiar(ids, fn) {
    ['input', 'change'].forEach(t => document.addEventListener(t, e => { if (ids.includes(e.target.id)) fn(); }));
}
// Escribe en un control real y avisa a su calculadora.
function escribir(id, valor) {
    const el = $(id);
    if (!el) return;
    if (el.type === 'checkbox') el.checked = valor; else el.value = valor;
    el.dispatchEvent(new Event(el.tagName === 'SELECT' || el.type === 'checkbox' ? 'change' : 'input', { bubbles: true }));
}
// Copia el resultado que pinta una calculadora (con su color de estado).
function copiar(destino, id) {
    const box = $(id);
    if (!box || box.style.display === 'none' || !box.innerHTML.trim()) { destino.hidden = true; return; }
    destino.hidden = false;
    destino.className = box.className;
    destino.innerHTML = box.innerHTML;
}
// Filas de datos de una tabla de la ficha.
const filas = id => [...($(id)?.tBodies[0]?.rows || [])];

// ---------- Cap. 31: la curva pH-[H⁺] (Figura 31.1) ----------
export const curvaPh = {
    tipo: 'propio', titulo: 'pH y [H⁺]: la misma escala no es lineal',
    nota: 'pH = −log [H⁺] (definición). Mueve el pH y mira cuánto cambia la [H⁺].',
    render(cuerpo, { tab }) {
        const H = ph => 10 ** (9 - ph);
        const x = ph => 40 + (ph - 6.8) * 270, y = h => 170 - h / 170 * 160;
        let d = '';
        for (let p = 6.8; p <= 7.801; p += 0.02) d += `${d ? 'L' : 'M'}${x(p).toFixed(1)},${y(H(p)).toFixed(1)}`;
        const ticksX = [6.8, 7.0, 7.2, 7.4, 7.6, 7.8].map(p => `<text x="${x(p)}" y="184" text-anchor="middle">${fmt(p)}</text>`).join('');
        const ticksY = [0, 40, 80, 120, 160].map(h => `<text x="34" y="${y(h) + 3}" text-anchor="end">${h}</text><line x1="40" x2="310" y1="${y(h)}" y2="${y(h)}" class="mrp-rejilla"/>`).join('');
        const llave = (h1, h2, xx, col, txt) => `<line x1="${xx}" x2="${xx}" y1="${y(h1)}" y2="${y(h2)}" stroke="${C(col)}" stroke-width="3"/><text x="${xx + 5}" y="${(y(h1) + y(h2)) / 2 + 3}" fill="${C(col)}">${txt}</text>`;
        cuerpo.innerHTML = `
            ${SVG('0 0 320 192', `${ticksY}${ticksX}
                <path d="${d}" fill="none" stroke="${C('blue')}" stroke-width="2"/>
                ${llave(H(7.0), H(7.4), 250, 'red', '7,0→7,4: 60')}${llave(H(7.4), H(7.8), 250, 'green', '7,4→7,8: 24')}
                <line class="mrp-guia" id="mrp-ph-guia" x1="0" x2="0" y1="170" y2="10"/><circle id="mrp-ph-punto" r="5" fill="${C('yellow')}"/>
                <text x="175" y="8" text-anchor="middle" class="mrp-eje">[H⁺] nEq/L frente a pH</text>`, 'Curva de la concentración de hidrogeniones frente al pH')}
            <div class="tfg-slider-row"><label for="mrp-ph">pH</label><input type="range" id="mrp-ph" min="6.8" max="7.8" step="0.01" value="7.40"><span class="tfg-slider-valor" id="mrp-ph-v"></span></div>
            <div class="tfg-estado tfg-estado-ok" id="mrp-ph-res"></div>
            ${aTexto('mr-ph-no-lineal', 'Por qué no es lineal ↓')}`;
        const sl = cuerpo.querySelector('#mrp-ph');
        const ini = num($('mr-ab-ph'));
        if (ini && ini >= 6.8 && ini <= 7.8) sl.value = ini;
        const pintar = () => {
            const ph = Number(sl.value), h = H(ph), d40 = h - H(7.4);
            cuerpo.querySelector('#mrp-ph-v').textContent = fmt(ph, 2);
            const g = cuerpo.querySelector('#mrp-ph-guia'); g.setAttribute('x1', x(ph)); g.setAttribute('x2', x(ph));
            const p = cuerpo.querySelector('#mrp-ph-punto'); p.setAttribute('cx', x(ph)); p.setAttribute('cy', y(h));
            const r = cuerpo.querySelector('#mrp-ph-res');
            r.className = `tfg-estado tfg-estado-${Math.abs(ph - 7.4) < 0.05 ? 'ok' : Math.abs(ph - 7.4) < 0.2 ? 'warn' : 'danger'}`;
            r.innerHTML = `[H⁺] = <strong>${fmt(h, 0)} nEq/L</strong> (${d40 >= 0 ? '+' : ''}${fmt(d40, 0)} respecto a pH 7,40, ${fmt(h / H(7.4), 1)} veces la normal).`;
        };
        sl.addEventListener('input', pintar);
        pintar();
        engancharTexto(cuerpo, tab);
    }
};

// ---------- Cap. 31: mapa de la gasometría ----------
// Las líneas de compensación salen de las ecuaciones de la ficha; las de pH
// constante, de [H⁺] = 24 × PaCO₂/HCO₃⁻ (la que usa la calculadora).
export const mapaGasometria = {
    tipo: 'propio', titulo: 'Mapa de la gasometría',
    nota: 'El punto es la gasometría de la calculadora. Si cae sobre la línea de su trastorno primario, la compensación es la esperada; si se aleja, hay un trastorno añadido.',
    render(cuerpo, { tab }) {
        const X = p => 40 + (p - 10) / 80 * 270, Y = h => 230 - h / 50 * 220;
        const linea = (f, a, b, col, punteada) => {
            let d = '';
            for (let t = a; (a < b ? t <= b : t >= b); t += (a < b ? 1 : -1)) { const [p, h] = f(t); d += `${d ? 'L' : 'M'}${X(p).toFixed(1)},${Y(h).toFixed(1)}`; }
            return `<path d="${d}" fill="none" stroke="${C(col)}" stroke-width="2.4"${punteada ? ' stroke-dasharray="5 4"' : ''}/>`;
        };
        const isoPh = ph => { const H = 10 ** (9 - ph); return `<path d="M${X(10)},${Y(24 * 10 / H)}L${X(90)},${Y(Math.min(50, 24 * 90 / H))}" class="mrp-iso"/><text x="${X(Math.min(90, 50 * H / 24)) - 2}" y="${Y(Math.min(50, 24 * 90 / H)) + 10}" text-anchor="end" class="mrp-iso-t">pH ${fmt(ph)}</text>`; };
        const LINEAS = [
            ['mr-comp-acidosis-met', 'Acidosis metabólica', 'red', false, linea(h => [40 - 1.2 * (24 - h), h], 24, 4, 'red')],
            ['mr-comp-alcalosis-met', 'Alcalosis metabólica', 'yellow', false, linea(h => [40 + 0.7 * (h - 24), h], 24, 48, 'yellow')],
            ['mr-comp-agudo', 'Respiratoria aguda (- - -)', 'purple', true, linea(p => [p, 24 + 0.1 * (p - 40)], 40, 90, 'purple', true) + linea(p => [p, 24 - 0.2 * (40 - p)], 40, 12, 'green', true)],
            ['mr-comp-cronico', 'Respiratoria crónica (—)', 'green', false, linea(p => [p, 24 + 0.4 * (p - 40)], 40, 90, 'purple') + linea(p => [p, 24 - 0.4 * (40 - p)], 40, 12, 'green')],
        ];
        const ejes = [10, 30, 50, 70, 90].map(p => `<text x="${X(p)}" y="244" text-anchor="middle">${p}</text>`).join('')
            + [0, 10, 20, 30, 40, 50].map(h => `<text x="34" y="${Y(h) + 3}" text-anchor="end">${h}</text>`).join('');
        cuerpo.innerHTML = `
            ${SVG('0 0 320 256', `<rect x="40" y="10" width="270" height="220" class="mrp-marco"/>${[7.2, 7.4, 7.6].map(isoPh).join('')}
                <rect x="${X(36)}" y="${Y(26)}" width="${X(44) - X(36)}" height="${Y(22) - Y(26)}" class="mrp-normal"/>
                ${LINEAS.map(l => l[4]).join('')}${ejes}
                <text x="175" y="254" text-anchor="middle" class="mrp-eje">PaCO₂ (mmHg)</text>
                <text x="8" y="120" transform="rotate(-90 8 120)" text-anchor="middle" class="mrp-eje">HCO₃⁻ (mEq/L)</text>
                <circle id="mrp-gas-punto" r="6" fill="var(--text-main)" stroke="var(--bg-main)" stroke-width="2"/>`, 'Mapa de PaCO₂ frente a HCO₃⁻ con las líneas de compensación esperada')}
            <p class="mrp-pie" id="mrp-gas-pie"></p>
            <div class="mrp-leyenda">${LINEAS.map(l => `<button type="button" class="mrp-ley" data-ir="${l[0]}" style="--c:${C(l[2])}">${l[1]} ↓</button>`).join('')}<span class="mrp-ley-normal">Recuadro: rango de referencia</span></div>`;
        const pintar = () => {
            const p = num($('mr-ab-pco2')), h = num($('mr-ab-hco3')), ph = num($('mr-ab-ph'));
            const pt = cuerpo.querySelector('#mrp-gas-punto'), pie = cuerpo.querySelector('#mrp-gas-pie');
            if (p === null || h === null) { pt.style.display = 'none'; pie.textContent = 'Rellena la calculadora para ver el punto.'; return; }
            pt.style.display = '';
            pt.setAttribute('cx', X(Math.min(90, Math.max(10, p)))); pt.setAttribute('cy', Y(Math.min(50, Math.max(0, h))));
            pie.textContent = `Paciente: pH ${ph === null ? '—' : fmt(ph, 2)}, PaCO₂ ${fmt(p, 0)} mmHg, HCO₃⁻ ${fmt(h, 0)} mEq/L.`;
        };
        alCambiar(['mr-ab-ph', 'mr-ab-pco2', 'mr-ab-hco3'], pintar);
        pintar();
        engancharTexto(cuerpo, tab);
    }
};

// ---------- Cap. 36: el iceberg del potasio (Figura 36.1) y la Tabla 36.1 ----------
export const icebergK = {
    tipo: 'propio', titulo: 'El iceberg del potasio',
    nota: 'Cada bloque son 100 mEq (como en la Figura 36.1). Usa el K⁺ y el peso de la calculadora del déficit: los bloques huecos son lo que falta.',
    render(cuerpo, { tab }) {
        cuerpo.innerHTML = `<div id="mrp-ice"></div><div class="tfg-estado tfg-estado-warn" id="mrp-ice-res"></div>
            <p class="vk-panel-nota">Tabla 36.1 (70 kg), las dos mitades: déficit según el K⁺.</p><div class="mrp-escalera" id="mrp-ice-tabla"></div>
            ${aTexto('mr-tabla-36-1', 'Tabla 36.1 ↓')} ${aTexto('mar-img-36-1', 'Figura 36.1 ↓')}`;
        const tabla = filas('mr-tabla-36-1').flatMap(r => [[coma(r.cells[0].textContent), coma(r.cells[1].textContent)], [coma(r.cells[2].textContent), coma(r.cells[3].textContent)]]).sort((a, b) => b[0] - a[0]);
        const maxDef = Math.max(...tabla.map(t => t[1]), 1);
        const pintar = () => {
            const k = num($('mr-kdef-k')), peso = num($('mr-kdef-peso'));
            if (k === null || !peso || peso <= 0) return;
            const { total, def } = deficitK(k, peso);
            const bloques = Math.round(total / 100), faltan = Math.min(bloques, Math.round(def / 100)), fuera = total * 0.02;
            const col = 7, lado = 26, ancho = col * (lado + 4) + 8, filasN = Math.ceil(bloques / col);
            const top = 46, alto = top + filasN * (lado + 4) + 10;
            let b = '';
            for (let i = 0; i < bloques; i++) {
                const xx = 4 + (i % col) * (lado + 4), yy = top + Math.floor(i / col) * (lado + 4);
                b += `<rect x="${xx}" y="${yy}" width="${lado}" height="${lado}" rx="3" class="${i < faltan ? 'mrp-hueco' : 'mrp-bloque'}"/>`;
            }
            const anchoFuera = Math.max(4, lado * fuera / 100);
            cuerpo.querySelector('#mrp-ice').innerHTML = SVG(`0 0 ${ancho + 110} ${alto}`, `
                <line x1="0" x2="${ancho + 110}" y1="${top - 6}" y2="${top - 6}" class="mrp-agua"/>
                <rect x="${4 + (lado - anchoFuera) / 2}" y="${top - 6 - lado * 0.6}" width="${anchoFuera}" height="${lado * 0.6}" rx="2" fill="${C('yellow')}"/>
                <text x="${lado + 14}" y="${top - 16}">Extracelular ~2% (${fmt(fuera, 0)} mEq)</text>
                <text x="${ancho + 4}" y="${top + 14}">Intracelular</text><text x="${ancho + 4}" y="${top + 28}">~98%</text>${b}`, 'Bloques de potasio corporal: intracelular frente a extracelular');
            const r = cuerpo.querySelector('#mrp-ice-res');
            r.className = `tfg-estado tfg-estado-${def <= 0 ? 'ok' : k < 2.5 ? 'danger' : 'warn'}`;
            r.innerHTML = def <= 0 ? `Con K⁺ ${fmt(k)} no hay déficit: ${fmt(total, 0)} mEq en total (${bloques} bloques).`
                : `K⁺ ${fmt(k)} mEq/L, ${fmt(peso, 0)} kg: total ≈ ${fmt(total, 0)} mEq; faltan ≈ <strong>${fmt(def, 0)} mEq</strong> (${faltan} bloque${faltan === 1 ? '' : 's'} hueco${faltan === 1 ? '' : 's'}). El plasma lleva menos del 1%: la punta del iceberg.`;
            const kr = Math.round(k * 10) / 10;
            cuerpo.querySelector('#mrp-ice-tabla').innerHTML = tabla.map(([kk, dd]) => `<div class="mrp-esc-fila${Math.abs(kk - kr) < 0.01 ? ' sel' : ''}"><span>${fmt(kk)}</span><i style="width:${dd / maxDef * 100}%"></i><em>${dd} mEq</em></div>`).join('');
        };
        alCambiar(['mr-kdef-k', 'mr-kdef-peso'], pintar);
        pintar();
        engancharTexto(cuerpo, tab);
    }
};

// ---------- Cap. 37: la escalera de la hipermagnesemia con el valor de la calculadora ----------
export const escalaHiperMg = {
    tipo: 'propio', titulo: 'Hipermagnesemia: qué esperar en cada nivel',
    nota: 'Los umbrales son los de la tabla de la ficha; la marca es el Mg de la calculadora "¿Qué espero con este magnesio?".',
    render(cuerpo, { tab }) {
        const umbrales = filas('mr-hipermg-umbral').map(r => [coma(r.cells[0].textContent), r.cells[1].innerHTML]);
        // Rango de referencia del Mg sérico total en mEq/L (tabla de unidades de la ficha).
        const ref = filas('mr-tabla-37-2').find(r => r.cells[0].textContent.trim() === 'Mg sérico total')?.cells[2]?.textContent || '';
        const [r0, r1] = ref.split('-').map(coma);
        const MAX = 15, X = v => 10 + v / MAX * 300, cols = ['yellow', 'red', 'red', 'purple'];
        const bandas = umbrales.map(([u], i) => `<rect x="${X(u)}" y="30" width="${X(umbrales[i + 1]?.[0] ?? MAX) - X(u)}" height="22" fill="${C(cols[i] || 'red')}" opacity="${0.25 + i * 0.15}"/>`).join('');
        const marcas = umbrales.map(([u]) => `<line x1="${X(u)}" x2="${X(u)}" y1="26" y2="56" stroke="var(--text-main)"/><text x="${X(u)}" y="68" text-anchor="middle" class="mrp-pq">${u}</text>`).join('')
            + [0, 15].map(v => `<text x="${X(v)}" y="68" text-anchor="middle">${v}</text>`).join('');
        const leyenda = umbrales.map(([u, t], i) => `<span style="--c:${C(cols[i] || 'red')}">&gt;${u} mEq/L: ${t}</span>`).join('');
        cuerpo.innerHTML = `${SVG('0 0 320 80', `${r0 ? `<rect x="${X(r0)}" y="30" width="${X(r1) - X(r0)}" height="22" fill="${C('green')}" opacity="0.6"/>` : ''}${bandas}
            <line x1="10" x2="310" y1="52" y2="52" stroke="var(--border-color)"/>${marcas}
            <text x="310" y="78" text-anchor="end">mEq/L</text>
            <polygon id="mrp-mg-marca" points="0,0 -6,-10 6,-10" fill="var(--text-main)"/>`, 'Escala del magnesio sérico con los umbrales de toxicidad')}
            <div class="mrp-umbrales">${r0 ? `<span style="--c:${C('green')}">Normal ${ref} mEq/L</span>` : ''}${leyenda}</div>
            <div class="tfg-estado" id="mrp-mg-res" hidden></div>${aTexto('mr-hipermg-umbral', 'Tabla ↓')}`;
        const pintar = () => {
            const v = num($('mr-hipermg-valor')), m = cuerpo.querySelector('#mrp-mg-marca');
            m.style.display = v === null ? 'none' : '';
            if (v !== null) m.setAttribute('transform', `translate(${X(Math.min(MAX, Math.max(0, v)))},30)`);
            copiar(cuerpo.querySelector('#mrp-mg-res'), 'mr-hipermg-resultado');
        };
        alCambiar(['mr-hipermg-valor'], pintar);
        pintar();
        engancharTexto(cuerpo, tab);
    }
};

// ---------- Cap. 40: cuándo sube y cuánto dura cada enzima ----------
export const cineticaEnzimas = {
    tipo: 'propio', titulo: 'Lipasa frente a amilasa en el tiempo',
    nota: 'Barra sombreada: los rangos de la fuente (empieza a subir · sigue alta). Escala en días.',
    render(cuerpo, { tab }) {
        const rango = t => t.match(/[\d,]+/g).map(coma);
        const MAX = 15, X = d => 70 + d / MAX * 240;
        const datos = filas('ma-enzimas-cinetica').map(r => ({ n: r.cells[0].textContent.trim(), ini: rango(r.cells[1].textContent).map(h => h / 24), fin: rango(r.cells[2].textContent) }));
        const cols = ['green', 'yellow'];
        const barras = datos.map((e, i) => {
            const y = 14 + i * 34;
            return `<text x="64" y="${y + 13}" text-anchor="end">${e.n}</text>
                <rect x="${X(e.ini[0])}" y="${y}" width="${X(e.fin[1]) - X(e.ini[0])}" height="18" rx="3" fill="${C(cols[i])}" opacity="0.3"/>
                <rect x="${X(e.ini[1])}" y="${y}" width="${X(e.fin[0]) - X(e.ini[1])}" height="18" rx="3" fill="${C(cols[i])}"/>`;
        }).join('');
        const ejes = [0, 3, 5, 8, 14].map(d => `<line x1="${X(d)}" x2="${X(d)}" y1="8" y2="${14 + datos.length * 34}" class="mrp-rejilla"/><text x="${X(d)}" y="${26 + datos.length * 34}" text-anchor="middle">${d} d</text>`).join('');
        cuerpo.innerHTML = `${SVG(`0 0 320 ${34 + datos.length * 34}`, ejes + barras, 'Cronología de la lipasa y la amilasa')}${aTexto('ma-panc-lipasa', 'Lipasa mejor que amilasa ↓')}`;
        engancharTexto(cuerpo, tab);
    }
};

// ---------- Cap. 41: semáforo de antibióticos (Tabla 41.3) ----------
export const semaforoAntibioticos = {
    tipo: 'propio', titulo: 'Semáforo: ¿qué antibiótico cubre lo que me preocupa?',
    nota: 'Marca los gérmenes (son las casillas de la calculadora de la ficha). Verde: cubre todos; ámbar: alguno solo "+/−"; rojo: deja alguno sin cubrir.',
    render(cuerpo, { tab }) {
        const tabla = $('ma-tabla-41-3');
        const germenes = [...tabla.tHead.rows[0].cells].slice(1).map(c => c.textContent.trim());
        const checks = [...document.querySelectorAll('.ma-cob-germen')];
        const pintar = () => {
            const marcados = checks.filter(c => c.checked).map(c => Number(c.value));
            const chips = germenes.map((g, j) => `<button type="button" class="mrp-germen${checks[j]?.checked ? ' sel' : ''}" data-g="${j}" aria-pressed="${!!checks[j]?.checked}">${g}</button>`).join('');
            const farmacos = filas('ma-tabla-41-3').map(r => {
                const celdas = marcados.map(j => r.cells[j + 1].textContent.trim());
                const nivel = !marcados.length ? 'gris' : celdas.some(c => c === '−') ? 'red' : celdas.some(c => c !== '+') ? 'yellow' : 'green';
                const falla = marcados.filter(j => r.cells[j + 1].textContent.trim() !== '+').map(j => `${germenes[j]} (${r.cells[j + 1].textContent.trim()})`);
                return `<div class="mrp-semaforo-fila" style="--c:${nivel === 'gris' ? 'var(--border-color)' : C(nivel)}"><i></i><b>${r.cells[0].textContent.trim()}</b><span>${!marcados.length ? '' : falla.length ? falla.join(' · ') : 'cubre todo lo marcado'}</span></div>`;
            }).join('');
            cuerpo.querySelector('#mrp-sem-chips').innerHTML = chips;
            cuerpo.querySelector('#mrp-sem-lista').innerHTML = farmacos;
            copiar(cuerpo.querySelector('#mrp-sem-res'), 'ma-cob-resultado');
        };
        cuerpo.innerHTML = `<div class="vk-chips" id="mrp-sem-chips"></div><div class="mrp-semaforo" id="mrp-sem-lista"></div>
            <div class="tfg-estado" id="mrp-sem-res" hidden></div>${aTexto('ma-tabla-41-3', 'Tabla 41.3 ↓')}`;
        cuerpo.addEventListener('click', e => {
            const g = e.target.closest('[data-g]');
            const c = g && checks[Number(g.dataset.g)];
            if (c) { c.checked = !c.checked; c.dispatchEvent(new Event('change', { bubbles: true })); pintar(); }
        });
        // Repinta si se marcan los gérmenes o el shock desde la vista Texto.
        document.addEventListener('change', e => { if (!cuerpo.contains(e.target) && (e.target.classList?.contains('ma-cob-germen') || e.target.id === 'ma-cob-shock')) pintar(); });
        pintar();
        engancharTexto(cuerpo, tab);
    }
};

// ---------- Cap. 35: simulador de los bolos de salino al 3% ----------
// Límites, dosis del bolo y "hasta 2 mEq/L por bolo" son de la ficha; lo que
// sube cada bolo y la diuresis acuosa espontánea son ilustrativos.
export const simuladorSalino = {
    tipo: 'propio', titulo: 'Simulador: bolos de salino al 3% frente a los límites',
    nota: 'Ilustrativo: cada bolo sube el Na⁺ lo que elijas (la ficha dice "hasta 2 mEq/L"); la diuresis acuosa espontánea, que causa la sobrecorrección, sube 1 mEq/L por hora mientras no se frene.',
    render(cuerpo, { tab }) {
        let t = 0, na0 = num($('mr-sal3-na0')) ?? 118, na = na0, puntos = [[0, na0]], diuresis = false, ddavp = false, bolos = 0;
        cuerpo.innerHTML = `<div id="mrp-sal-graf"></div>
            <div class="tfg-slider-row"><label for="mrp-sal-sube">Sube por bolo</label><input type="range" id="mrp-sal-sube" min="0.5" max="2" step="0.5" value="2"><span class="tfg-slider-valor" id="mrp-sal-sube-v"></span></div>
            <div class="nv-chips mrp-botones">
                <button type="button" class="visual-mini" data-acc="bolo">💉 Bolo de 2 mL/kg</button>
                <button type="button" class="visual-mini" data-acc="hora">⏱ +1 hora</button>
                <button type="button" class="visual-mini" data-acc="diuresis">🚽 Diuresis acuosa</button>
                <button type="button" class="visual-mini" data-acc="ddavp">💊 Desmopresina 2 μg SC</button>
                <button type="button" class="visual-mini" data-acc="reset">↺ Empezar</button>
            </div>
            <div class="tfg-estado" id="mrp-sal-res"></div>
            ${aTexto('mr-tabla-35-3', 'Límites (Tabla 35.3) ↓')} ${aTexto('mr-sobrecorreccion', 'Sobrecorrección y desmopresina ↓')}`;
        const sube = cuerpo.querySelector('#mrp-sal-sube');
        const avanzar = horas => { for (let i = 0; i < horas; i++) { t += 1; if (diuresis && !ddavp) na += 1; puntos.push([t, na]); } };
        const pintar = () => {
            cuerpo.querySelector('#mrp-sal-sube-v').textContent = `${fmt(Number(sube.value))} mEq/L`;
            const H = Math.max(8, t + 1), X = h => 36 + h / H * 274, Y = v => 150 - (v - (na0 - 2)) / 16 * 140;
            const lim = [[2, na0 + 5, '+5 en 2 h'], [5, na0 + 10, '+10 en 5 h']];
            const d = puntos.map(([h, v], i) => `${i ? 'L' : 'M'}${X(h).toFixed(1)},${Y(v).toFixed(1)}`).join('');
            const g = [0, 4, 8, 12, 16].map(k => `<text x="30" y="${Y(na0 - 2 + k) + 3}" text-anchor="end">${na0 - 2 + k}</text>`).join('')
                + [0, Math.round(H / 2), H].map(h => `<text x="${X(h)}" y="164" text-anchor="middle">${h} h</text>`).join('');
            const limites = lim.map(([h, v, txt]) => `<line x1="${X(0)}" x2="${X(h)}" y1="${Y(v)}" y2="${Y(v)}" stroke="${C('red')}" stroke-dasharray="4 3"/><circle cx="${X(h)}" cy="${Y(v)}" r="3" fill="${C('red')}"/><text x="${X(h) + 4}" y="${Y(v) - 3}" class="mrp-pq" fill="${C('red')}">${txt}</text>`).join('');
            const tope = na0 + 16 >= 130 ? `<line x1="36" x2="310" y1="${Y(130)}" y2="${Y(130)}" stroke="${C('purple')}" stroke-dasharray="2 3"/><text x="308" y="${Y(130) - 3}" text-anchor="end" class="mrp-pq">130: Na⁺ final máximo</text>` : '';
            cuerpo.querySelector('#mrp-sal-graf').innerHTML = SVG('0 0 320 170', `${g}${limites}${tope}<path d="${d}" fill="none" stroke="${C('blue')}" stroke-width="2.2"/><circle cx="${X(t)}" cy="${Y(na)}" r="4" fill="${C('yellow')}"/>`, 'Sodio frente a horas de tratamiento');
            const subida = na - na0, en2 = (puntos.find(p => p[0] === 2) || [0, na])[1] - na0, en5 = (puntos.find(p => p[0] === 5) || [0, na])[1] - na0;
            const avisos = [];
            if ((t <= 2 && subida > 5) || en2 > 5) avisos.push('Más de <strong>5 mEq/L en 2 h</strong>');
            if ((t <= 5 && subida > 10) || en5 > 10) avisos.push('Más de <strong>10 mEq/L en 5 h</strong>');
            if (t <= 24 && subida > 10) avisos.push('Más de <strong>10 mEq/L el primer día</strong>');
            if (na > 130) avisos.push('Na⁺ por encima de <strong>130 mEq/L</strong>');
            const r = cuerpo.querySelector('#mrp-sal-res');
            r.className = `tfg-estado tfg-estado-${avisos.length ? 'danger' : subida >= 5 ? 'ok' : 'warn'}`;
            r.innerHTML = `${t} h · ${bolos} bolo${bolos === 1 ? '' : 's'} · Na⁺ ${fmt(na)} mEq/L (${subida >= 0 ? '+' : ''}${fmt(subida)}).`
                + (avisos.length ? `<br>⚠️ ${avisos.join(' · ')}: riesgo de desmielinización osmótica. ${ddavp ? 'Desmopresina puesta.' : 'Indicación de <strong>desmopresina</strong> (Tabla 35.4).'}`
                    : subida >= 5 ? '<br>Ha subido 5 mEq/L: valora los síntomas; si no mejoran, busca otra causa.' : '<br>Repite bolos hasta que cedan los síntomas.')
                + (diuresis && !ddavp ? '<br>Diuresis acuosa en marcha: el Na⁺ sigue subiendo solo.' : '');
        };
        cuerpo.addEventListener('click', e => {
            const b = e.target.closest('[data-acc]');
            if (!b) return;
            const a = b.dataset.acc;
            if (a === 'bolo') { na += Number(sube.value); bolos += 1; puntos.push([t, na]); }
            if (a === 'hora') avanzar(1);
            if (a === 'diuresis') diuresis = true;
            if (a === 'ddavp') ddavp = true;
            if (a === 'reset') { t = 0; na0 = num($('mr-sal3-na0')) ?? 118; na = na0; puntos = [[0, na0]]; diuresis = ddavp = false; bolos = 0; }
            pintar();
        });
        sube.addEventListener('input', pintar);
        pintar();
        engancharTexto(cuerpo, tab);
    }
};

// ---------- Cap. 34: el reto de volumen con la calculadora de respuesta a fluidos (Cap. 11) ----------
export const retoVolumen = {
    tipo: 'propio', titulo: 'Reto de volumen: 500 mL en 10-15 min',
    nota: 'Escribe en la calculadora de respuesta a fluidos de Marino · Fundamentos (sobrecarga de volumen) y añade la regla del Cap. 34: parar si no responden ni el volumen sistólico ni la diuresis.',
    render(cuerpo, { tab }) {
        cuerpo.innerHTML = `<div class="vk-calc">
                <div class="form-group"><label for="mrp-rv-vs0">VS antes (mL)</label><input type="number" id="mrp-rv-vs0" min="5" max="250" value="55" inputmode="decimal"></div>
                <div class="form-group"><label for="mrp-rv-vs1">VS después (mL)</label><input type="number" id="mrp-rv-vs1" min="5" max="250" value="58" inputmode="decimal"></div>
                <div class="form-group"><label for="mrp-rv-diur">¿Ha subido la diuresis?</label><select id="mrp-rv-diur"><option value="no">No</option><option value="si">Sí</option></select></div>
            </div>
            <div class="tfg-estado" id="mrp-rv-vs" hidden></div><div class="tfg-estado" id="mrp-rv-res"></div>
            ${aTexto('mr-reto-volumen', 'Reto de volumen ↓')}
            <button type="button" class="visual-link" data-especialidad="libros" data-view="marinoFundamentos" data-panel="panel-marino-fund-tabs" data-tab="mar-respuesta-fluidos">Calculadora de Fundamentos →</button>`;
        // Al construirse no escribe en Fundamentos: solo cuando se toca un campo.
        const pintar = (escribe = true) => {
            const vs0 = num(cuerpo.querySelector('#mrp-rv-vs0')), vs1 = num(cuerpo.querySelector('#mrp-rv-vs1'));
            if (vs0 === null || vs1 === null) return;
            if (escribe) {
                escribir('mar-resp-prueba', 'bolo'); escribir('mar-resp-vs0', vs0); escribir('mar-resp-vs1', vs1);
                copiar(cuerpo.querySelector('#mrp-rv-vs'), 'mar-resp-resultado');
            }
            const responde = vs0 > 0 && (vs1 - vs0) / vs0 * 100 > 10, diur = cuerpo.querySelector('#mrp-rv-diur').value === 'si';
            const r = cuerpo.querySelector('#mrp-rv-res');
            r.className = `tfg-estado tfg-estado-${responde || diur ? 'ok' : 'danger'}`;
            r.innerHTML = responde || diur ? `Responde${responde ? ' el volumen sistólico' : ''}${responde && diur ? ' y' : ''}${diur ? ' la diuresis' : ''}: la hipoperfusión contribuía; puedes repetir el reto.`
                : '<strong>Ni el volumen sistólico ni la diuresis responden: parar</strong> los fluidos. Más volumen solo acumula líquido.';
        };
        cuerpo.addEventListener('input', () => pintar());
        cuerpo.addEventListener('change', () => pintar());
        pintar(false);
        engancharTexto(cuerpo, tab);
    }
};

// ---------- Los asistentes Sí/No dentro de la vista Visual ----------
// Una segunda instancia del mismo árbol de decisión (core/wizard.js), con
// sus propios ids: la de la vista Texto no se toca.
export const asistenteVisual = (titulo, prefijo, pasos, idTexto) => ({
    tipo: 'propio', titulo,
    render(cuerpo, { tab }) {
        const p = `${prefijo}-v`;
        cuerpo.innerHTML = `<div id="${p}-pregunta" class="mrp-wiz-pregunta"></div>
            <div id="${p}-botones" style="display:flex; gap:10px;"></div>
            <div class="result-box" id="${p}-resultado" style="display:none; text-align:left; margin-top:10px;"></div>
            <button class="siguiente-ficha-btn" id="${p}-reset" style="display:none; margin-top:8px;">↺ Reiniciar</button>
            ${aTexto(idTexto, 'El asistente en el texto ↓')}`;
        initSiNoWizard(p, pasos);
        engancharTexto(cuerpo, tab);
    }
});
