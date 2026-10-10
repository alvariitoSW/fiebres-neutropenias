// Kit de imágenes para la vista Visual (core/vista-visual.js).
//
// Cada imagen es una RECETA: un tipo de dibujo y una lista de nodos. Cada
// nodo apunta a un elemento REAL del texto de la ficha (fuente primaria):
// un acordeón .micro-prof-item, un párrafo, un <li>, una fila de tabla, un
// <dl class="kv-row">… La etiqueta y el detalle se leen de ese elemento en
// tiempo de ejecución, así que la imagen nunca tiene una segunda copia del
// contenido, y "Ver en el texto" lleva exactamente a esa línea.
//
// Fuente de un nodo (`fuente`):
//   - '#id' / '.clase' / '[attr]'  → selector CSS (dentro de la ficha, o del
//     documento si empieza por '#'). 'css:<selector>' fuerza un selector
//     cualquiera dentro de la ficha (p. ej. 'css:tbody tr:nth-child(5)').
//   - cualquier otro texto         → el primer elemento candidato de la
//     ficha cuyo texto EMPIEZA por ese texto (sin distinguir mayúsculas).
// `etiqueta` es opcional: por defecto se toma del propio elemento. `tras`
// (opcional, mismo formato) busca solo después de ese otro elemento.
//
// Tipos de panel: 'flujo', 'escalera', 'comparar', 'racimos', 'mapa',
// 'linea', 'puntos' (barras de puntuación conectadas a una calculadora),
// 'requisitos' (casillas reales como candados o barreras),
// 'selector' (opciones de un <select> real), 'calculadora' (los campos de
// una calculadora o simulador ya existente, conectados; `resultado` puede
// incluir bloques enteros como las barras de un simulador) y tres que
// DIBUJAN UNA TABLA
// de la ficha leyendo sus celdas en tiempo de ejecución: 'barras' (cifras
// de una o varias columnas), 'matriz' (celdas normal/alterado coloreadas) y
// 'frecuencias' (cada "Nombre: 1:N" en una escala logarítmica; con
// `flechas: true` la matriz colorea ↑/↓/N en vez de normal/alterado), más
// 'grados' (cada COLUMNA de una tabla de gradación se vuelve un peldaño; al
// tocarlo se ven todas sus filas, y "Ver en el texto" resalta esa columna
// con el mismo gesto que la tabla ya tiene). 'puntos' y 'selector' no calculan:
// escriben en los controles reales, disparan su evento y copian el
// resultado que pinta la calculadora de siempre.
//
// Cualquier panel de nodos (flujo, escalera, racimos…) o cualquier grupo/
// columna puede tomar sus nodos de una tabla con `tabla: n` (una fila por
// nodo) en vez de `nodos`.
//
// La imagen se construye la primera vez que se abre la vista Visual.

import { initVistaVisual, irAlTexto } from './vista-visual.js';
import { SILUETA_SVG, ORGANOS, posicion } from './silueta.js';

const COLOR = {
    verde: 'var(--accent-green)', amarillo: 'var(--accent-yellow)', rojo: 'var(--accent-red)',
    purpura: 'var(--accent-purple)', dorado: 'var(--accent-blue)', gris: 'var(--text-muted)'
};
const RAMPA = ['verde', 'amarillo', 'rojo', 'purpura'];
const color = c => COLOR[c] || c || COLOR.dorado;
// Color de la posición k de n en la rampa verde → amarillo → rojo → púrpura.
const rampa = (k, n) => RAMPA[Math.min(RAMPA.length - 1, Math.round(k * (RAMPA.length - 1) / Math.max(1, n - 1)))];

const CANDIDATOS = '.micro-prof-item, dl.kv-row, li, tr, p, .compare-box, .warning-box, .phenotype-row, .flow-node, .checkbox-label, h4';

const norm = s => s.replace(/\s+/g, ' ').trim().toLowerCase();
const cabeceraMpi = el => el.querySelector(':scope > .micro-prof-head');
const textoPropio = el => (el.classList.contains('micro-prof-item') ? cabeceraMpi(el) : el).textContent;
// Quita emoji y signos decorativos iniciales, pero no los que son contenido
// (≥, ≤, <, >, ↑, ↓: "≥72h acumuladas" no puede quedarse en "72h", ni
// "↓Ingesta" en "Ingesta").
const limpiar = s => s.replace(/\s+/g, ' ').replace(/\s*\+\s*$/, '').replace(/^[^\p{L}\p{N}(¿¡≥≤<>↑↓]+/u, '').trim();

// `tras`: elemento a partir del cual buscar (para etiquetas repetidas, como
// "Clínica" o "Tratamiento" en cada enfermedad de una misma ficha).
function resolver(raiz, fuente, tras = null) {
    if (!fuente) return null;
    if (fuente.startsWith('css:')) return raiz.querySelector(fuente.slice(4));
    if (fuente.startsWith('#')) return document.querySelector(fuente);
    if (/^[.[]/.test(fuente)) return raiz.querySelector(fuente);
    const buscado = norm(limpiar(fuente));
    const coincide = el => (!tras || (tras.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING))
        && norm(limpiar(textoPropio(el))).startsWith(buscado);
    // Prioridad: acordeones y kv-row (bloques con título propio) antes que
    // párrafos, filas o elementos de lista que empiecen igual.
    return [...raiz.querySelectorAll('.micro-prof-item')].find(coincide)
        || [...raiz.querySelectorAll('dl.kv-row')].find(coincide)
        || [...raiz.querySelectorAll(CANDIDATOS)].find(coincide) || null;
}

function etiquetaDe(el) {
    if (el.classList.contains('micro-prof-item')) return limpiar(cabeceraMpi(el).textContent);
    if (el.matches('dl.kv-row')) return limpiar(el.querySelector('dt').textContent);
    if (el.tagName === 'TR') return limpiar(el.cells[0].textContent);
    const fuerte = el.querySelector(':scope > strong:first-child, :scope > b:first-child, :scope > strong');
    if (fuerte && el.textContent.trim().startsWith(fuerte.textContent.trim())) return limpiar(fuerte.textContent).replace(/[.:]$/, '');
    const t = limpiar(el.textContent);
    return t.length > 46 ? t.slice(0, 44) + '…' : t;
}

// Copia del HTML de la fuente sin `id` ni controles, para no duplicar ids ni
// enganchar listeners de la vista Texto.
function copiaLimpia(nodo) {
    const c = nodo.cloneNode(true);
    c.querySelectorAll('[id]').forEach(x => x.removeAttribute('id'));
    c.querySelectorAll('input, select, button, textarea').forEach(x => x.remove());
    return c.innerHTML;
}

function detalleDe(el) {
    if (el.classList.contains('micro-prof-item')) { const b = el.querySelector('.micro-prof-body'); return b ? copiaLimpia(b) : ''; }
    if (el.tagName === 'TR') {
        const ths = [...(el.closest('table')?.querySelectorAll('thead th, tr:first-child th') || [])].map(th => th.textContent.trim());
        return [...el.cells].map((c, i) => `<div>${ths[i] ? `<b>${ths[i]}</b> ` : ''}${copiaLimpia(c)}</div>`).join('');
    }
    return copiaLimpia(el);
}

// ---------- Tipos de panel: cada uno devuelve HTML con botones data-nodo ----------

const boton = (n, extra = '', estilo = '') =>
    `<button type="button" class="vk-nodo ${extra}" data-nodo="${n.i}" style="${estilo}">${n.texto}</button>`;

const RENDER = {
    flujo(p, nodos) {
        return `<div class="vk-flujo">${p.nodos.map(paso => {
            const grupo = (Array.isArray(paso) ? paso : [paso]).map(x => nodos[x.i]);
            return `<div class="vk-flujo-paso ${grupo.length > 1 ? 'rama' : ''}">${grupo.map(n => boton(n, '', `--vk:${color(n.color || p.color)}`)).join('')}</div>`;
        }).join('<div class="vk-flecha" aria-hidden="true">↓</div>')}</div>`;
    },
    escalera(p, nodos) {
        const lista = p.nodos.map(x => nodos[x.i]);
        return `<div class="vk-escalera">${lista.map((n, k) => {
            const c = color(n.color || rampa(k, lista.length));
            return `<div class="vk-escalon" style="--vk:${c};--nivel:${((k + 1) / lista.length * 100).toFixed(0)}%">
                <span class="vk-escalon-barra" aria-hidden="true"></span>${boton(n)}</div>`;
        }).join('')}</div>`;
    },
    comparar(p, nodos) {
        return `<div class="vk-comparar" style="grid-template-columns:repeat(${p.columnas.length}, minmax(0, 1fr))">${p.columnas.map(col => `
            <div class="vk-columna" style="--vk:${color(col.color)}">
                <div class="vk-columna-titulo">${col.titulo}</div>
                ${col.nodos.map(x => boton(nodos[x.i])).join('')}
            </div>`).join('')}</div>`;
    },
    racimos(p, nodos) {
        return p.grupos.map(g => `
            <div class="vk-racimo" style="--vk:${color(g.color)}">
                <div class="vk-racimo-titulo">${g.titulo}</div>
                <div class="vk-chips">${g.nodos.map(x => boton(nodos[x.i], 'vk-chip')).join('')}</div>
            </div>`).join('');
    },
    mapa(p, nodos) {
        const lista = p.nodos.map(x => nodos[x.i]);
        return `<div class="cuerpo vk-mapa">
            <div class="cuerpo-figura">${SILUETA_SVG}${lista.map((n, k) =>
                `<button type="button" class="cuerpo-marca vk-nodo-marca" data-nodo="${n.i}" style="${posicion(ORGANOS[n.organo])};--marca:${color(n.color || p.color || 'rojo')}" aria-label="${n.texto}">${k + 1}</button>`).join('')}</div>
            <ol class="cuerpo-leyenda">${lista.map((n, k) => `<li><b style="color:${color(n.color || p.color || 'rojo')}">${k + 1}</b>${boton(n, 'vk-leyenda')}</li>`).join('')}</ol>
        </div>`;
    },
    linea(p, nodos) {
        const pct = v => `${((v - p.min) / (p.max - p.min) * 100).toFixed(2)}%`;
        const lista = p.nodos.map(x => nodos[x.i]);
        const ticks = (p.ticks || [p.min, p.max]).map(t => `<span style="left:${pct(t)}">${t}</span>`).join('');
        return `<div class="vk-linea">
            ${p.bandas ? p.bandas.map(b => `<div class="vk-linea-banda ${b.alinear === 'fin' ? 'fin' : ''}" style="left:${pct(b.desde)};width:calc(${pct(b.hasta)} - ${pct(b.desde)});--vk:${color(b.color)}"><span>${b.texto}</span></div>`).join('') : ''}
            <div class="vk-linea-eje"></div>
            <div class="eje-ticks">${ticks}</div>
            ${lista.map((n, k) => `<button type="button" class="regla-marca ${n.fila === 'abajo' ? 'abajo' : 'arriba'} vk-nodo-marca" data-nodo="${n.i}" style="left:${pct(n.en)};--marca:${color(n.color || p.color)}" aria-label="${n.texto}">${k + 1}</button>`).join('')}
            <span class="vk-linea-unidad">${p.unidad || ''}</span>
        </div>
        <ol class="vk-linea-leyenda">${lista.map((n, k) => `<li><b style="color:${color(n.color || p.color)}">${k + 1}</b>${boton(n, 'vk-leyenda')}</li>`).join('')}</ol>`;
    }
};

// ---------- Paneles que dibujan una tabla de la ficha ----------

// Primer número de una celda ("1,8", "22.5", "12.000", "<0,01"); null si no
// hay. Un punto seguido de 1-2 cifras es decimal; de 3, separador de miles.
function numero(texto) {
    const dec = /(\d+)\.(\d{1,2})(?!\d)/.exec(texto);
    const m = /(\d+(?:\.\d{3})*(?:,\d+)?|\d+(?:,\d+)?)/.exec(texto);
    if (dec && (!m || dec.index <= m.index)) return Number(`${dec[1]}.${dec[2]}`);
    if (!m) return null;
    const crudo = m[1];
    return /\.\d{3}/.test(crudo) && !crudo.includes(',') ? Number(crudo.replace(/\./g, '')) : Number(crudo.replace(/\./g, '').replace(',', '.'));
}

// "1:1,9 millones" → 1900000; "1:12.000" → 12000
function denominador(texto) {
    const m = /1:\s*([\d.,]+)\s*(millones?)?/.exec(texto);
    if (!m) return null;
    return m[2] ? Number(m[1].replace(',', '.')) * 1e6 : Number(m[1].replace(/\./g, '').replace(',', '.'));
}

const filasDatos = tabla => [...tabla.rows].filter(r => r.cells[0]?.tagName === 'TD');
const cabeceras = tabla => [...(tabla.tHead?.rows[0] || tabla.rows[0]).cells].map(c => c.textContent.trim());

RENDER.barras = (p, nodos) => {
    const filas = p.nodos.map(x => nodos[x.i]);
    const valores = filas.map(n => p.series.map(se => numero(n.el.cells[se.col].textContent)));
    const max = Math.max(...valores.flat().filter(v => v !== null), 0) || 1;
    const leyenda = p.series.length > 1 ? `<div class="vk-barras-leyenda">${p.series.map(se => `<span style="--vk:${color(se.color)}">${se.nombre}</span>`).join('')}</div>` : '';
    return `${leyenda}<div class="vk-barras">${filas.map((n, k) => `
        <button type="button" class="vk-barra-fila" data-nodo="${n.i}">
            <span class="vk-barra-etq">${n.texto}</span>
            <span class="vk-barra-pistas">${p.series.map((se, j) => {
                const v = valores[k][j];
                return `<span class="vk-barra" style="--vk:${color(se.color)}"><i style="width:${v === null ? 0 : Math.max(1.5, v / max * 100)}%"></i><em>${v === null ? '—' : n.el.cells[se.col].textContent.trim()}</em></span>`;
            }).join('')}</span>
        </button>`).join('')}</div>`;
};

// Cabeceras de columna estrecha: corte tras "/" y guion suave en las palabras
// largas, entre vocal-consonante-vocal cerca de la mitad ("Equino-candinas").
const VOCAL = /[aeiouáéíóú]/i;
function partirCabecera(h) {
    return h.replace(/\//g, '/<wbr>').replace(/[\p{L}]{11,}/gu, w => {
        const m = Math.floor(w.length / 2);
        for (const i of [m, m - 1, m + 1, m - 2, m + 2]) {
            if (VOCAL.test(w[i - 1]) && !VOCAL.test(w[i]) && VOCAL.test(w[i + 1])) return w.slice(0, i) + '\u00AD' + w.slice(i);
        }
        return w;
    });
}

RENDER.matriz = (p, nodos) => {
    const filas = p.nodos.map(x => nodos[x.i]);
    const cab = cabeceras(filas[0].el.closest('table'));
    const normal = t => (p.normales || ['normal']).includes(norm(t));
    const clase = t => (p.flechas ? flecha(t) : normal(t) ? 'normal' : 'alterado');
    const leyenda = p.flechas
        ? '<span class="sube">↑ sube</span><span class="baja">↓ baja</span><span class="normal">N normal</span><span class="mixto">variable</span>'
        : `<span class="normal">${p.leyenda?.[0] || 'normal'}</span><span class="alterado">${p.leyenda?.[1] || 'alterado'}</span>`;
    return `<div class="vk-matriz" style="grid-template-columns:minmax(0,1.3fr) repeat(${cab.length - 1}, minmax(0,1fr))">
        <span></span>${cab.slice(1).map(h => `<span class="vk-matriz-cab">${partirCabecera(h)}</span>`).join('')}
        ${filas.map(n => `<button type="button" class="vk-matriz-fila" data-nodo="${n.i}">${n.texto}</button>${[...n.el.cells].slice(1).map(c =>
            `<span class="vk-matriz-celda ${clase(c.textContent)}">${c.textContent.trim()}</span>`).join('')}`).join('')}
    </div>
    <div class="vk-matriz-leyenda">${leyenda}</div>`;
};

// Celda de una tabla de flechas ("↑", "N o ↓", "N, ↑ o ↓"): qué dirección marca.
function flecha(t) {
    const sube = t.includes('↑'), baja = t.includes('↓');
    if (sube && baja) return 'mixto';
    if (sube) return 'sube';
    if (baja) return 'baja';
    return /^\s*N\s*$/.test(t) ? 'normal' : 'valor';
}

RENDER.grados = (p, nodos) => {
    const lista = p.nodos.map(x => nodos[x.i]);
    return `<div class="vk-escalera vk-grados">${lista.map((n, k) => {
        return `<div class="vk-escalon" style="--vk:${color(n.color)};--nivel:${((k + 1) / lista.length * 100).toFixed(0)}%">
            <span class="vk-escalon-barra" aria-hidden="true"></span>
            <button type="button" class="vk-nodo vk-grado" data-nodo="${n.i}"><b>${n.texto}</b>${n.resumen.map(r => `<span><em>${r.k}</em> ${r.v}</span>`).join('')}</button></div>`;
    }).join('')}</div>`;
};

RENDER.frecuencias = (p, nodos) => {
    const lista = p.nodos.map(x => nodos[x.i]).sort((a, b) => a.n - b.n);
    const [dmin, dmax] = [1, 7]; // de 1:10 a 1:10.000.000, escala log10
    const pos = n => `${((Math.log10(n) - dmin) / (dmax - dmin) * 100).toFixed(1)}%`;
    const ticks = [[10, '1:10'], [1e3, '1:1.000'], [1e5, '1:100.000']].map(([v, t]) => `<span style="left:${pos(v)}">${t}</span>`).join('');
    return `<div class="vk-frec-eje"><div class="eje-ticks">${ticks}</div></div>
    <div class="vk-frec">${lista.map(n => `
        <button type="button" class="vk-frec-fila" data-nodo="${n.i}" style="--vk:${color(n.color)}">
            <span class="vk-frec-etq">${n.texto}</span>
            <span class="vk-frec-pista"><i style="left:${pos(n.n)}"></i></span>
        </button>`).join('')}</div>
    <div class="vk-matriz-leyenda">${(p.series || []).map(c => `<span style="--vk:${color(c.color)}" class="serie">${c.nombre}</span>`).join('')}<span>más frecuente ← → más raro (hasta 1:10 millones)</span></div>`;
};

// ---------- Paneles conectados a controles reales ----------

function emitir(el) {
    el.dispatchEvent(new Event(el.tagName === 'SELECT' || el.type === 'checkbox' ? 'change' : 'input', { bubbles: true }));
}

// `ids`: '#id' copia el contenido del resultado (con su color de estado);
// cualquier otro selector copia el bloque entero (p. ej. las barras de un
// simulador). La copia nunca lleva ids, para no duplicarlos.
function copiarResultados(ids) {
    return ids.map(sel => {
        const el = document.querySelector(sel);
        if (!el) return '';
        const c = el.cloneNode(true);
        c.querySelectorAll('[id]').forEach(x => x.removeAttribute('id'));
        if (!sel.startsWith('#') || sel.includes(' ')) { c.removeAttribute('id'); c.style.display = ''; return c.outerHTML; }
        const estado = [...el.classList].filter(x => /^tfg-estado-/.test(x)).join(' ');
        return `<div class="vk-resultado-copia ${estado}" style="color:${el.style.color || ''}">${c.innerHTML}</div>`;
    }).join('');
}

// Barras de puntuación. Cada ítem muestra sus tramos como segmentos y
// resalta el actual; tocar un segmento escribe en el control real. El total
// y el veredicto se copian del resultado de la calculadora (`resultado`).
function itemsDePuntos(p, raiz) {
    return p.items.flatMap(it => {
        if (it.checks) {
            return [...raiz.querySelectorAll(it.checks)].map(chk => ({
                tipo: 'check', control: chk, etiqueta: limpiar(chk.closest('label, .checkbox-label').textContent),
                tramos: [{ label: 'No', pts: 0 }, { label: 'Sí', pts: it.pts ?? 1 }]
            }));
        }
        const control = document.querySelector(it.control);
        if (!control) { console.warn('[visual-kit] control no encontrado', it.control); return []; }
        if (control.tagName === 'SELECT') {
            return [{ tipo: 'select', control, etiqueta: it.etiqueta,
                tramos: [...control.options].filter(o => o.value !== '').map(o => ({ label: it.corto ? it.corto(o) : limpiar(o.textContent), valor: o.value, pts: it.pts ? it.pts(o) : Number(o.value) })) }];
        }
        return [{ tipo: 'numero', control, etiqueta: it.etiqueta, tramos: it.tramos, unidad: it.unidad || '' }];
    });
}

function tramoActual(item) {
    const c = item.control;
    if (item.tipo === 'check') return c.checked ? 1 : 0;
    if (item.tipo === 'select') return item.tramos.findIndex(t => t.valor === c.value);
    if (c.value === '') return -1;
    const v = parseFloat(c.value);
    return item.tramos.findIndex(t => v >= t.min && v <= t.max);
}

// Los paneles conectados llevan a su calculadora en el texto.
const LINK_CONTROL = '<button type="button" class="visual-link" data-accion="control">Ver en el texto ↓</button>';

function renderPuntos(p, estado) {
    const filas = estado.items.map((it, k) => {
        const actual = tramoActual(it);
        const campo = it.tipo === 'numero'
            ? `<input type="number" class="vk-numero" data-item="${k}" value="${it.control.value}" inputmode="decimal" aria-label="${it.etiqueta}">${it.unidad ? `<span class="vk-unidad">${it.unidad}</span>` : ''}`
            : '';
        const segs = it.tramos.map((t, j) =>
            `<button type="button" class="vk-tramo ${j === actual ? 'on' : ''} ${it.tipo === 'numero' ? 'solo-lectura' : ''}" data-item="${k}" data-tramo="${j}" ${it.tipo === 'numero' ? 'tabindex="-1" aria-disabled="true"' : ''}><span>${t.label}</span><b>${t.pts}</b></button>`).join('');
        const largo = it.tramos.some(t => String(t.label).length > 28);
        return `<div class="vk-puntos-fila"><div class="vk-puntos-cab"><span>${it.etiqueta}</span>${campo}</div><div class="vk-tramos ${largo ? 'apilado' : ''}">${segs}</div></div>`;
    }).join('');
    return `${filas}<div class="vk-resultado">${copiarResultados(p.resultado)}</div>${LINK_CONTROL}`;
}

// Lista de criterios conectada a casillas reales. modo 'todos': candados
// que deben abrirse todos (p. ej. criterios para suspender); modo 'ninguno':
// barreras, basta una para cerrar el paso (p. ej. exclusiones de vía oral).
// No decide nada: el veredicto se copia de `resultado`.
function renderRequisitos(p, estado) {
    const todos = p.modo !== 'ninguno';
    const marcados = estado.items.filter(it => it.control.checked).length;
    const total = estado.items.length;
    const abierto = todos ? marcados === total : marcados === 0;
    const items = estado.items.map((it, k) => {
        const on = it.control.checked;
        const icono = todos ? (on ? '🔓' : '🔒') : (on ? '⛔' : '○');
        return `<button type="button" class="vk-req ${on ? 'on' : ''}" data-item="${k}" aria-pressed="${on}"><span class="vk-req-icono" aria-hidden="true">${icono}</span><span>${it.etiqueta}</span></button>`;
    }).join('');
    const cuenta = todos ? `${marcados}/${total} abiertos` : (marcados ? `${marcados} barrera${marcados > 1 ? 's' : ''}` : 'sin barreras');
    return `<div class="vk-reqs ${todos ? 'todos' : 'ninguno'}">${items}</div>
        <div class="vk-puerta ${abierto ? 'abierta' : 'cerrada'}"><span>${p.puerta || ''}</span><b>${cuenta}</b></div>
        <div class="vk-resultado">${copiarResultados(p.resultado)}</div>${LINK_CONTROL}`;
}

function renderSelector(p) {
    const sel = document.querySelector(p.control);
    const opciones = [...sel.options].filter(o => o.value !== '');
    const ops = opciones.map((o, k) => {
        const c = color(p.colores ? p.colores[k] : rampa(k, opciones.length));
        return `<button type="button" class="vk-opcion ${o.value === sel.value ? 'on' : ''} ${p.forma === 'chips' ? 'chip' : ''}" data-valor="${o.value}" style="--vk:${p.forma === 'chips' ? color(p.color) : c}"><span>${limpiar(o.textContent)}</span></button>`;
    }).join('');
    return `<div class="vk-opciones ${p.forma === 'chips' ? 'chips' : 'escalera'}">${ops}</div><div class="vk-resultado">${copiarResultados(p.resultado)}</div>${LINK_CONTROL}`;
}

// Calculadora o simulador ya existente en la ficha: sus campos reales
// (número, deslizador o desplegable) en versión compacta. Escribe en el
// control real, dispara su evento y copia lo que pinta la calculadora.
function camposDe(p) {
    return p.campos.map(sel => {
        const control = document.querySelector(sel);
        if (!control) { console.warn('[visual-kit] campo no encontrado', sel); return null; }
        const lab = document.querySelector(`label[for="${control.id}"]`) || control.closest('.form-group, .tfg-slider-row')?.querySelector('label');
        return { control, etiqueta: p.etiquetas?.[sel] || (lab ? limpiar(lab.textContent) : control.id) };
    }).filter(Boolean);
}

function campoHTML(it, k) {
    const c = it.control;
    if (c.tagName === 'SELECT') {
        return `<select class="vk-campo" data-item="${k}" aria-label="${it.etiqueta}">${[...c.options].map(o =>
            `<option value="${o.value}" ${o.value === c.value ? 'selected' : ''}>${o.textContent}</option>`).join('')}</select>`;
    }
    const attrs = ['min', 'max', 'step', 'placeholder'].filter(a => c.hasAttribute(a)).map(a => `${a}="${c.getAttribute(a)}"`).join(' ');
    return `<input class="vk-campo" data-item="${k}" type="${c.type}" ${attrs} value="${c.value}" ${c.type === 'number' ? 'inputmode="decimal"' : ''} aria-label="${it.etiqueta}">${c.type === 'range' ? `<output>${valorRango(c)}</output>` : ''}`;
}

// Valor de un deslizador con su unidad, tal como lo muestra la propia ficha.
const valorRango = c => c.closest('.tfg-slider-row')?.querySelector('span')?.textContent || c.value;

function pintarCalculadora(p, estado, cuerpo) {
    if (!cuerpo.querySelector('.vk-campos')) {
        cuerpo.innerHTML = `<div class="vk-campos">${estado.items.map((it, k) =>
            `<label class="vk-campo-fila ${it.control.type === 'range' ? 'rango' : ''}"><span>${it.etiqueta}</span>${campoHTML(it, k)}</label>`).join('')}</div>
            <div class="vk-resultado"></div>${LINK_CONTROL}`;
    } else {
        // En su sitio, sin rehacer los campos: no se pierde el foco ni el arrastre.
        cuerpo.querySelectorAll('.vk-campo').forEach(f => {
            const c = estado.items[Number(f.dataset.item)].control;
            if (f !== document.activeElement && f.value !== c.value) f.value = c.value;
            const out = f.parentElement.querySelector('output');
            if (out) out.textContent = valorRango(c);
        });
    }
    cuerpo.querySelector('.vk-resultado').innerHTML = copiarResultados(p.resultado);
}

// ---------- Montaje ----------

function envolver(tab) {
    const texto = document.createElement('div');
    texto.className = 'vista-texto';
    const visual = document.createElement('div');
    visual.className = 'vista-visual vk';
    // En una tarjeta suelta (no una ficha del cuaderno) el <h3> se queda
    // fuera, visible en las dos vistas, y el interruptor va debajo.
    const titulo = !tab.classList.contains('tab-content') && tab.firstElementChild?.tagName === 'H3' ? tab.firstElementChild : null;
    [...tab.childNodes].filter(n => n !== titulo && !(n.classList && n.classList.contains('siguiente-ficha-btn'))).forEach(n => texto.appendChild(n));
    tab.prepend(visual);
    tab.prepend(texto);
    if (titulo) tab.prepend(titulo);
    tab.setAttribute('data-visual', '');
    initVistaVisual(tab.parentElement);
    return { texto, visual };
}

// `receta` es una receta del kit o, para una vista a medida (p. ej. la
// simulación de hiperpotasemia de Nefrología), una función
// (tab, texto, visual) que construye la imagen ella misma. En ambos casos
// se construye la primera vez que se abre la vista Visual.
export function montarVisual(tabId, receta) {
    const tab = document.getElementById(tabId);
    if (!tab || tab.hasAttribute('data-visual')) return;
    const { texto, visual } = envolver(tab);
    let construido = false;
    tab.addEventListener('vistachange', e => {
        if (e.detail.vista === 'visual' && !construido) { construido = true; construir(tab, texto, visual, receta); }
    });
    // Si el modo Visual global ya estaba activo, la ficha nace en Visual
    // antes de que exista este listener: construir ahora.
    if (tab.classList.contains('modo-visual')) { construido = true; construir(tab, texto, visual, receta); }
}

function construir(tab, texto, visual, receta) {
    if (typeof receta === 'function') return receta(tab, texto, visual);
    const nodos = []; // registro plano: { i, el, texto, color, organo, en, fila }
    const registrar = def => {
        const d = typeof def === 'string' ? { fuente: def } : def;
        const ancla = d.tras ? resolver(texto, d.tras) : null;
        const el = (!d.tras || ancla) && resolver(texto, d.fuente, ancla);
        if (!el) { console.warn(`[visual-kit] ${tab.id}: fuente no encontrada →`, d.fuente, d.tras || ''); return null; }
        const n = { ...d, i: nodos.length, el, texto: d.etiqueta || etiquetaDe(el) };
        nodos.push(n);
        return n;
    };
    // Sustituye cada definición por su nodo registrado (descartando las no encontradas).
    const reg = lista => lista.map(x => Array.isArray(x) ? x.map(registrar).filter(Boolean) : registrar(x)).filter(x => x && (!Array.isArray(x) || x.length));
    // Nodos a partir de una tabla: una fila por nodo (barras, matriz) o una
    // entrada "Nombre: 1:N" por nodo (frecuencias, apuntando a su celda).
    const buscarTabla = ref => {
        const tabla = typeof ref === 'number' ? texto.querySelectorAll('table')[ref] : resolver(texto, ref);
        if (!tabla) console.warn(`[visual-kit] ${tab.id}: tabla no encontrada →`, ref);
        return tabla;
    };
    // Una fila de datos por nodo (sirve para cualquier panel con `tabla`, o
    // para un grupo/columna con `tabla`).
    const filasNodo = (tabla, excluir) => filasDatos(tabla).filter(r => !excluir || !excluir.some(x => norm(r.cells[0].textContent).startsWith(norm(x))))
        .map(r => { const n = { i: nodos.length, el: r, texto: limpiar(r.cells[0].textContent) }; nodos.push(n); return n; });
    const nodosDe = g => {
        if (g.tabla === undefined) return reg(g.nodos);
        const tabla = buscarTabla(g.tabla);
        return tabla ? filasNodo(tabla, g.excluir) : [];
    };
    const nodoTabla = (p) => {
        const tabla = buscarTabla(p.tabla);
        if (!tabla) return [];
        if (p.tipo === 'grados') {
            const filas = [...tabla.rows].slice(1);
            const cols = [...tabla.rows[0].cells].slice(1);
            return cols.map((th, j) => {
                const celda = r => r.cells[j + 1]?.textContent.trim() || '';
                const n = { i: nodos.length, el: th, texto: limpiar(th.textContent), color: rampa(j, cols.length),
                    resumen: (p.filasResumen || []).map(f => ({ k: limpiar(filas[f].cells[0].textContent), v: celda(filas[f]) })),
                    detalle: filas.map(r => `<div><b>${limpiar(r.cells[0].textContent)}</b> ${celda(r)}</div>`).join(''),
                    alIr: () => { if (th.dataset.grado) th.click(); } };
                nodos.push(n); return n;
            });
        }
        if (p.tipo !== 'frecuencias') return filasNodo(tabla, p.excluir);
        const cab = cabeceras(tabla);
        const ENTRADA = /([A-ZÁÉÍÓÚÑ][^:·]*?):\s*1:\s*([\d.,]+(?:\s*millones?)?)/g;
        return filasDatos(tabla).flatMap(r => [...r.cells].flatMap((celda, j) =>
            [...celda.textContent.replace(/\s+/g, ' ').matchAll(ENTRADA)].map(m => {
                const n = { i: nodos.length, el: celda, texto: `${m[1].trim()} · 1:${m[2].trim()}`, n: denominador(`1:${m[2]}`), color: p.series?.[j]?.color, columna: cab[j] };
                nodos.push(n); return n;
            })));
    };
    const paneles = receta.paneles.map(p => {
        const q = { ...p };
        if (p.tabla !== undefined) {
            if (p.tipo === 'racimos') q.grupos = [{ titulo: p.grupo || '', color: p.color, nodos: nodoTabla(p) }];
            else q.nodos = nodoTabla(p);
        }
        if (p.nodos) q.nodos = reg(p.nodos);
        if (p.columnas) q.columnas = p.columnas.map(c => ({ ...c, nodos: nodosDe(c) }));
        if (p.grupos) q.grupos = p.grupos.map(g => ({ ...g, nodos: nodosDe(g) }));
        return q;
    });

    visual.innerHTML = `${receta.guia ? `<p class="visual-guia">${receta.guia}</p>` : ''}${paneles.map((p, k) => `
        <section class="vk-panel" data-panel="${k}">
            ${p.titulo ? `<div class="vk-panel-titulo">${p.titulo}</div>` : ''}
            ${p.nota ? `<p class="vk-panel-nota">${p.nota}</p>` : ''}
            <div class="vk-panel-cuerpo"></div>
            <div class="visual-detalle vk-detalle" hidden></div>
        </section>`).join('')}`;

    const estados = paneles.map(p => (p.tipo === 'puntos' || p.tipo === 'requisitos' ? { items: itemsDePuntos(p, texto) }
        : p.tipo === 'calculadora' ? { items: camposDe(p) } : {}));
    const pintar = k => {
        const p = paneles[k];
        const cuerpo = visual.querySelector(`.vk-panel[data-panel="${k}"] .vk-panel-cuerpo`);
        if (p.tipo === 'puntos') {
            const foco = document.activeElement?.classList.contains('vk-numero') ? document.activeElement.dataset.item : null;
            cuerpo.innerHTML = renderPuntos(p, estados[k]);
            if (foco !== null) { const f = cuerpo.querySelector(`.vk-numero[data-item="${foco}"]`); f?.focus(); f?.setSelectionRange?.(f.value.length, f.value.length); }
        } else if (p.tipo === 'requisitos') cuerpo.innerHTML = renderRequisitos(p, estados[k]);
        else if (p.tipo === 'selector') cuerpo.innerHTML = renderSelector(p);
        else if (p.tipo === 'calculadora') pintarCalculadora(p, estados[k], cuerpo);
        else cuerpo.innerHTML = RENDER[p.tipo](p, nodos);
    };
    paneles.forEach((_, k) => pintar(k));

    // Repintar los paneles conectados cuando cambien sus controles (venga de donde venga).
    const conectados = paneles.map((p, k) => ({ k, p })).filter(({ p }) => ['puntos', 'requisitos', 'selector', 'calculadora'].includes(p.tipo));
    if (conectados.length) {
        const controlesDe = ({ p, k }) => p.tipo === 'selector' ? [document.querySelector(p.control)] : estados[k].items.map(it => it.control);
        ['input', 'change'].forEach(tipo => document.addEventListener(tipo, e => {
            if (visual.contains(e.target)) return;
            conectados.forEach(c => { if (controlesDe(c).includes(e.target)) pintar(c.k); });
        }));
    }

    const alCampo = e => {
        const f = e.target.closest('.vk-campo');
        if (!f) return false;
        const k = Number(f.closest('.vk-panel').dataset.panel);
        const c = estados[k].items[Number(f.dataset.item)].control;
        c.value = f.value;
        emitir(c);
        pintar(k);
        return true;
    };
    visual.addEventListener('change', e => { if (e.target.matches('select.vk-campo')) alCampo(e); });
    visual.addEventListener('input', e => {
        if (e.target.matches('input.vk-campo')) { alCampo(e); return; }
        const campo = e.target.closest('.vk-numero');
        if (!campo) return;
        const k = Number(campo.closest('.vk-panel').dataset.panel);
        const it = estados[k].items[Number(campo.dataset.item)];
        it.control.value = campo.value;
        emitir(it.control);
        pintar(k);
    });

    visual.addEventListener('click', e => {
        const panelEl = e.target.closest('.vk-panel');
        if (!panelEl) return;
        const k = Number(panelEl.dataset.panel);
        const p = paneles[k];

        const tramo = e.target.closest('.vk-tramo:not(.solo-lectura)');
        if (tramo) {
            const it = estados[k].items[Number(tramo.dataset.item)];
            const t = it.tramos[Number(tramo.dataset.tramo)];
            if (it.tipo === 'check') it.control.checked = t.pts > 0;
            else it.control.value = t.valor;
            emitir(it.control);
            pintar(k);
            return;
        }
        const req = e.target.closest('.vk-req');
        if (req) {
            const it = estados[k].items[Number(req.dataset.item)];
            it.control.checked = !it.control.checked;
            emitir(it.control);
            pintar(k);
            return;
        }
        const opcion = e.target.closest('.vk-opcion');
        if (opcion) {
            const sel = document.querySelector(p.control);
            sel.value = opcion.dataset.valor;
            emitir(sel);
            pintar(k);
            return;
        }
        if (e.target.closest('[data-accion="control"]')) {
            const control = p.tipo === 'selector' ? document.querySelector(p.control) : estados[k].items[0]?.control;
            if (control) { irAlTexto(tab, control.closest('.form-group, .checkbox-label') || control); }
            return;
        }
        if (e.target.closest('[data-accion="fuente"]')) {
            const n = nodos[Number(panelEl.dataset.sel)];
            if (n) { irAlTexto(tab, n.el); n.alIr?.(); }
            return;
        }
        const b = e.target.closest('[data-nodo]');
        if (!b) return;
        const n = nodos[Number(b.dataset.nodo)];
        panelEl.dataset.sel = n.i;
        panelEl.querySelectorAll('[data-nodo]').forEach(x => x.classList.toggle('sel', x.dataset.nodo === String(n.i)));
        const det = panelEl.querySelector('.vk-detalle');
        det.hidden = false;
        det.style.borderColor = color(n.color || p.color) ;
        det.innerHTML = `<div class="visual-detalle-titulo">${n.texto}</div>
            <div class="vk-detalle-cuerpo">${n.columna ? `<p><b>${n.columna}</b></p>` : ''}${n.detalle ?? detalleDe(n.el)}</div>
            <button type="button" class="visual-link" data-accion="fuente">Ver en el texto ↓</button>`;
    });
}
