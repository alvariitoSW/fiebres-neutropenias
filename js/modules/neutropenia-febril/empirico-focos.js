// Vista Visual de "2. Según foco clínico": mapa corporal de los 9 focos.
// Cada foco va sobre su órgano con la letra de su escalón de antibiótico.
// Tocar un foco cambia el <select> REAL y dispara su `change`; la pauta y el
// comentario se copian de lo que pinta calcFocoTx() (foco-data.js).
//
// La letra del escalón NO es un dato nuevo: se deriva del propio texto del
// régimen en foco-data.js (ver escalonDe), y la leyenda lo dice.

import { focoTxData } from '../../data/foco-data.js';
import { irAlTexto } from '../../core/vista-visual.js';
import { SILUETA_SVG, ORGANOS, posicion } from './silueta.js';

const $ = id => document.getElementById(id);

const ORGANO_DE_FOCO = {
    meningitis: 'cabeza', 'mucositis-leve': 'bocaDcha', 'mucositis-grave': 'bocaIzda',
    cateter: 'cateter', neumonia: 'pulmonDcho', enterocolitis: 'abdomen',
    itu: 'vejiga', perianal: 'perine', piel: 'piel'
};

const ESCALONES = {
    A: { nombre: 'Cefepime solo', color: 'var(--accent-green)' },
    B: { nombre: 'Pip-tazo / carbapenem', color: 'var(--accent-yellow)' },
    C: { nombre: '+ Gram positivo (vanco/dapto)', color: 'var(--accent-red)' },
    D: { nombre: 'Regla propia (añade otro grupo)', color: 'var(--accent-purple)' }
};

// Agrupa por lo que dice el régimen: añade ampicilina o quinolonas → regla
// propia; añade vancomicina/daptomicina → Gram +; cefepime a secas → A.
export function escalonDe(tratamiento) {
    if (/Ampicilina|Quinolonas/.test(tratamiento)) return 'D';
    if (/Vanco|Dapto/.test(tratamiento)) return 'C';
    if (tratamiento.trim() === 'Cefepime') return 'A';
    return 'B';
}

let filtro = null;

function nombreFoco(option) { return option.textContent.replace(/^[^A-Za-zÁÉÍÓÚÑáéíóúñ]+/, '').trim(); }

function construir(cont) {
    const opciones = [...$('foco-tx-select').options];
    const marcas = opciones.map(o => {
        const esc = escalonDe(focoTxData[o.value].tratamiento);
        return `<button type="button" class="cuerpo-marca foco" data-foco="${o.value}" style="${posicion(ORGANOS[ORGANO_DE_FOCO[o.value]])};--marca:${ESCALONES[esc].color}" aria-label="${nombreFoco(o)}, escalón ${esc}">${esc}</button>`;
    }).join('');
    const leyenda = opciones.map(o => {
        const esc = escalonDe(focoTxData[o.value].tratamiento);
        return `<li data-foco="${o.value}" data-esc="${esc}"><b style="color:${ESCALONES[esc].color}">${esc}</b><span>${nombreFoco(o)}</span></li>`;
    }).join('');
    const botones = Object.entries(ESCALONES).map(([k, e]) =>
        `<button type="button" class="esc-filtro" data-esc="${k}" style="--marca:${e.color}"><b>${k}</b><span>${e.nombre}</span></button>`).join('');
    cont.innerHTML = `
        <p class="visual-guia">Cada foco sobre su órgano. La letra agrupa los focos por lo que añade su régimen. Toca un foco para ver su pauta, o un escalón para ver qué focos lo usan.</p>
        <div class="esc-filtros">${botones}</div>
        <div class="cuerpo">
            <div class="cuerpo-figura">${SILUETA_SVG}${marcas}</div>
            <ol class="cuerpo-leyenda sin-numero">${leyenda}</ol>
        </div>
        <div class="visual-detalle" id="focos-panel"></div>`;
}

function render() {
    const cont = $('empirico-focos');
    if (!cont) return;
    const actual = $('foco-tx-select').value;
    const escActual = escalonDe(focoTxData[actual].tratamiento);
    cont.querySelectorAll('[data-foco]').forEach(el => {
        const esc = escalonDe(focoTxData[el.dataset.foco].tratamiento);
        el.classList.toggle('on', el.dataset.foco === actual);
        el.classList.toggle('atenuado', filtro !== null && esc !== filtro);
    });
    cont.querySelectorAll('.esc-filtro').forEach(b => {
        b.classList.toggle('on', b.dataset.esc === filtro);
        b.setAttribute('aria-pressed', String(b.dataset.esc === filtro));
    });
    const panel = $('focos-panel');
    panel.style.borderColor = ESCALONES[escActual].color;
    panel.innerHTML = `
        <div class="visual-detalle-titulo"><span style="color:${ESCALONES[escActual].color}">${escActual}</span> · ${nombreFoco($('foco-tx-select').selectedOptions[0])}</div>
        <div class="esc-regimen">${$('foco-tx-tratamiento').textContent}</div>
        <div class="visual-detalle-fuente">${$('foco-tx-comentario').innerHTML}</div>
        <button type="button" class="visual-link" data-accion="fuente">Ver en el texto ↓</button>`;
}

export function initEmpiricoFocos() {
    const cont = $('empirico-focos');
    if (!cont) return;
    construir(cont);
    cont.addEventListener('click', e => {
        const marca = e.target.closest('button[data-foco]');
        if (marca) {
            $('foco-tx-select').value = marca.dataset.foco;
            $('foco-tx-select').dispatchEvent(new Event('change', { bubbles: true }));
            return;
        }
        const f = e.target.closest('.esc-filtro');
        if (f) { filtro = filtro === f.dataset.esc ? null : f.dataset.esc; render(); return; }
        if (e.target.closest('[data-accion="fuente"]')) irAlTexto($('empirico-foco-card'), $('foco-tx-select').closest('.form-group'));
    });
    document.addEventListener('change', e => { if (e.target.id === 'foco-tx-select') render(); });
    render();
}
