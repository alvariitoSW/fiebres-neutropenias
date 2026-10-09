// Manifiesto de rotación de PIF ("dossier clínico"): renderiza, a partir
// de `rotacionesPif` (datos puros, sin DOM), la tile PIF del menú raíz y
// el contenido de `#pif-menu-view` — pestañas R1-R5, barra de progreso,
// aviso de rotación actual (calculado con la fecha real del dispositivo,
// nunca a mano) y una entrada por rotación con sus objetivos reales.
//
// Genérico por diseño: si `rotacionesPif[anio]` está vacío (R2-R5, hoy),
// se muestra "Sin expediente" sin ningún caso especial — el día que
// llegue el documento de un año nuevo, basta con rellenar su array en
// `pif-rotaciones.js`, sin tocar este archivo.
//
// Se llama una sola vez, al principio de `home/index.js`'s `init()`, ANTES
// de que esa función enganche sus propios listeners sobre
// #btn-hematologia/#btn-nefrologia — el manifiesto renderiza esos mismos
// botones (mismo `id`, ver `pif-rotaciones.js`), así que heredan el
// listener real sin duplicar nada.
import { rotacionesPif } from '../../data/pif-rotaciones.js';

const ANIOS = ['R1', 'R2', 'R3', 'R4', 'R5'];

function hoyEnRango(inicio, fin) {
    const hoy = new Date();
    const desde = new Date(inicio + 'T00:00:00');
    const hasta = new Date(fin + 'T23:59:59');
    return hoy >= desde && hoy <= hasta;
}

function rotacionActual(anio) {
    return (rotacionesPif[anio] || []).find(r => hoyEnRango(r.inicio, r.fin)) || null;
}

function renderTicks(rotaciones, actual) {
    return rotaciones.map(r => {
        let clase = 'pif-tick';
        if (r.construido) clase += ' pif-tick-ok';
        else if (actual && r.id === actual.id) clase += ' pif-tick-actual';
        return `<span class="${clase}"></span>`;
    }).join('');
}

function renderEntrada(r, idx, actual) {
    const esActual = !!(actual && r.id === actual.id);
    const indice = String(idx + 1).padStart(2, '0') + '.';

    let estadoTexto = 'Pendiente';
    let estadoClase = 'pif-estado-pendiente';
    if (r.construido) { estadoTexto = 'Construida'; estadoClase = 'pif-estado-ok'; }
    else if (esActual) { estadoTexto = 'En curso (hoy)'; estadoClase = 'pif-estado-actual'; }

    let cuerpo;
    if (r.construido) {
        const objetivos = r.objetivos.map(o => `<p class="pif-obj">— ${o}</p>`).join('');
        cuerpo = `
            <div class="pif-entry-body">
                ${objetivos}
                <button class="pif-abrir" id="${r.destino.botonId}">Abrir ${r.nombre} →</button>
            </div>`;
    } else {
        const visibles = r.objetivos.slice(0, 2).map(o => `<p class="pif-obj">— ${o}</p>`).join('');
        const restantesArr = r.objetivos.slice(2);
        const extra = restantesArr.map(o => `<p class="pif-obj pif-obj-extra" style="display:none;">— ${o}</p>`).join('');
        const restantes = restantesArr.length;
        const toggle = restantes > 0
            ? `<button class="pif-toggle">Ver ${restantes} objetivo${restantes === 1 ? '' : 's'} más</button>`
            : '';
        const nota = r.nota ? `<p class="pif-nota">Nota — ${r.nota}</p>` : '';
        cuerpo = `
            <div class="pif-entry-body">
                ${visibles}${extra}
                ${toggle}
                ${nota}
                <p class="pif-sinfuente">Sin expediente fuente. Súbela cuando la tengas.</p>
            </div>`;
    }

    return `
        <div class="pif-entry">
            <div class="pif-entry-head">
                <div class="pif-entry-titulo">
                    <span class="pif-entry-idx">${indice}</span>
                    <span class="pif-entry-nombre">${r.nombre}</span>
                </div>
                <span class="pif-entry-periodo">${r.periodo}</span>
            </div>
            <p class="pif-entry-estado"><span class="pif-cap pif-estado-label">Estado: </span><span class="pif-cap ${estadoClase}">${estadoTexto}</span></p>
            ${cuerpo}
        </div>`;
}

function renderManifiesto(anio) {
    const cont = document.getElementById('pif-manifiesto-contenido');
    if (!cont) return;

    const rotaciones = rotacionesPif[anio] || [];
    if (rotaciones.length === 0) {
        cont.innerHTML = `
            <div class="pif-nodata">
                <p class="pif-cap">${anio}</p>
                <p class="pif-nodata-title">Sin expediente</p>
                <div class="pif-nodata-rule"></div>
                <p class="pif-nodata-desc">Aún no se ha subido el documento PIF de este año. En cuanto llegue, esta misma página se completa sola con sus rotaciones.</p>
            </div>`;
        return;
    }

    const actual = rotacionActual(anio);
    const construidas = rotaciones.filter(r => r.construido).length;
    const total = rotaciones.length;
    const rangoLabel = anio === 'R1' ? ' · Julio 2026 – Junio 2027' : '';

    let html = `
        <div class="pif-progreso">
            <div class="pif-progreso-head">
                <p class="pif-cap">${anio}${rangoLabel}</p>
                <p class="pif-progreso-cifra"><strong>${construidas}</strong><span> de ${total} rotaciones construidas</span></p>
            </div>
            <div class="pif-ticks">${renderTicks(rotaciones, actual)}</div>
        </div>`;

    if (actual) {
        html += `
            <div class="pif-hoy">
                <p class="pif-cap pif-hoy-label">Rotación actual</p>
                <p class="pif-hoy-nombre">${actual.nombre} · ${actual.periodo}</p>
            </div>`;
    }

    html += rotaciones.map((r, idx) => renderEntrada(r, idx, actual)).join('');
    cont.innerHTML = html;
}

function renderTabs(seleccionado) {
    const cont = document.getElementById('pif-year-tabs');
    if (!cont) return;
    cont.innerHTML = ANIOS.map(anio => {
        const activo = anio === seleccionado ? ' pif-ytab-activo' : '';
        return `<button class="pif-ytab${activo}" data-anio="${anio}">${anio}</button>`;
    }).join('');
}

function actualizarTileRaiz() {
    const badge = document.getElementById('pif-tile-badge');
    if (!badge) return;
    const rotaciones = rotacionesPif.R1;
    const construidas = rotaciones.filter(r => r.construido).length;
    const actual = rotacionActual('R1');
    let texto = `${construidas}/${rotaciones.length} rotaciones construidas`;
    if (actual) texto += ` · ahora: ${actual.nombre}`;
    badge.textContent = texto;
}

export function initPifManifiesto() {
    const tabsWrap = document.getElementById('pif-year-tabs');
    const contWrap = document.getElementById('pif-manifiesto-contenido');
    if (!tabsWrap || !contWrap) return;

    function seleccionarAnio(anio) {
        renderTabs(anio);
        renderManifiesto(anio);
    }

    tabsWrap.addEventListener('click', (e) => {
        const btn = e.target.closest('.pif-ytab');
        if (btn) seleccionarAnio(btn.dataset.anio);
    });

    contWrap.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('.pif-toggle');
        if (toggleBtn) {
            const entry = toggleBtn.closest('.pif-entry');
            const extras = entry.querySelectorAll('.pif-obj-extra');
            const abierto = extras.length > 0 && extras[0].style.display !== 'none';
            extras.forEach(el => { el.style.display = abierto ? 'none' : ''; });
            toggleBtn.textContent = abierto
                ? `Ver ${extras.length} objetivo${extras.length === 1 ? '' : 's'} más`
                : 'Ocultar objetivos';
        }
    });

    seleccionarAnio('R1');
    actualizarTileRaiz();
}
