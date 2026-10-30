// Pinta la tabla «arteria → ECG → pared → complicación» (datos en js/data/sca-territorios.js) donde haya un contenedor.
import { scaColumnas, scaTerritorios, scaNotas, damlujiRef } from '../../data/sca-territorios.js';

const verFicha = it => it.ficha
    ? `<button type="button" class="especialidad-link" data-especialidad="pifCardio" data-view="ecgArritmias" data-panel="panel-pif-ecg-tabs" data-tab="ecg-f9" data-resaltar="${it.ficha}">Ver en la ficha</button> `
    : '';
const celda = it => it.hueco
    ? `<div class="sca-item"><span class="hl-rojo">${it.texto}</span></div>`
    : `<div class="sca-item">${it.texto} ${verFicha(it)}<a class="biblio-link" href="${it.href}" target="_blank" rel="noopener">${it.fuente}, ${it.pagina || it.apartado}</a></div>`;

const CORTO = { 'da-proximal': 'DA proximal', 'da-distal': 'DA distal', diagonal: '1.ª diagonal', 'cd-inferior': 'CD inferior', 'cd-vd': 'CD + VD', 'cx-om': 'Cx / OM' };
const ETIQ = { lopez: 'ECG (López Ramírez)', wagner: 'ECG (Wagner 2009)', pared: 'Pared', complicacion: 'Complicación' };

export function htmlTablaSca(prefijo) {
    const cab = scaColumnas.map(c => `<th>${c.titulo}</th>`).join('');
    const filas = scaTerritorios.map(t => `<tr id="${prefijo}-${t.id}"><td class="sca-primera"><strong>${t.territorio}</strong></td>${scaColumnas.map(c => `<td>${t[c.clave].map(celda).join('')}</td>`).join('')}</tr>`).join('');
    const notas = scaNotas.map(n => `<details class="nota-plegable" id="${prefijo}-nota-${n.id}"><summary>${n.titulo}</summary><p>${n.texto}</p></details>`).join('');
    const chips = scaTerritorios.map((t, i) => `<button type="button" class="sca-chip" id="${prefijo}-chip-${t.id}" data-sca="${t.id}" aria-pressed="${i === 0}">${CORTO[t.id] || t.id}</button>`).join('');
    const fichas = scaTerritorios.map((t, i) => `<div class="sca-ficha" id="${prefijo}-ficha-${t.id}" ${i === 0 ? '' : 'hidden'}><p class="section-label">${t.territorio}</p>${scaColumnas.map(c => `<dl class="kv-row"><dt>${ETIQ[c.clave] || c.titulo}</dt><dd>${t[c.clave].map(celda).join('')}</dd></dl>`).join('')}</div>`).join('');
    return `<style>
        .sca-wrap{overflow-x:auto;} .sca-tabla{min-width:760px;font-size:0.72rem;} .sca-tabla td,.sca-tabla th{padding:6px;}
        .sca-tabla .sca-primera{position:sticky;left:0;background:var(--bg-card, var(--bg-main));min-width:92px;max-width:110px;z-index:1;}
        .sca-item{margin-bottom:6px;} .sca-item:last-child{margin-bottom:0;} .sca-tabla .biblio-link{white-space:normal;font-size:0.68rem;display:inline;}
        .sca-chips{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 10px;}
        .sca-chip{font:inherit;font-size:0.8rem;padding:8px 12px;min-height:40px;border-radius:999px;border:1px solid var(--border-color);background:transparent;color:var(--text-dim);cursor:pointer;}
        .sca-chip[aria-pressed="true"]{border-color:var(--accent-yellow);color:var(--text-main);background:rgba(212,175,55,0.14);font-weight:700;}
        .sca-ficha{font-size:0.88rem;line-height:1.5;margin-bottom:10px;} .sca-ficha .sca-item{margin:0 0 6px;} .sca-ficha .biblio-link{white-space:normal;font-size:0.76rem;}
    </style>
    <p class="section-label">Toca una arteria</p>
    <div class="sca-chips" role="group" aria-label="Arteria ocluida">${chips}</div>
    ${fichas}
    <details class="nota-plegable" id="${prefijo}-completa"><summary>Ver la tabla completa (consulta)</summary>
    <div class="sca-wrap"><table class="data-table sca-tabla" id="${prefijo}-datos" data-nombre="Arteria, ECG, pared y complicación del infarto"><thead><tr><th class="sca-primera">Arteria</th>${cab}</tr></thead><tbody>${filas}</tbody></table></div></details>
    ${notas}
    <p class="fuente-ficha">Cada columna es de una fuente distinta y no se mezclan. Referencia de las complicaciones: <a class="biblio-link" href="${damlujiRef.href}" target="_blank" rel="noopener">Damluji 2021, AHA</a> <span class="biblio-nota">${damlujiRef.texto} ${damlujiRef.nota}</span></p>`;
}

function cablear(el) {
    const chips = [...el.querySelectorAll('.sca-chip')];
    chips.forEach(ch => ch.addEventListener('click', () => {
        chips.forEach(o => o.setAttribute('aria-pressed', String(o === ch)));
        el.querySelectorAll('.sca-ficha').forEach(f => { f.hidden = !f.id.endsWith('-ficha-' + ch.dataset.sca); });
    }));
}

export function init() {
    [['ecg9-sca-tabla', 'ecg9-sca'], ['pifobj-sca-tabla', 'pifobj-sca-t']].forEach(([id, prefijo]) => {
        const el = document.getElementById(id);
        if (el) { el.innerHTML = htmlTablaSca(prefijo); cablear(el); }
    });
}
