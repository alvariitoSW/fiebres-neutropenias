// Pinta la tabla «arteria → ECG → pared → complicación» (datos en js/data/sca-territorios.js) donde haya un contenedor.
import { scaColumnas, scaTerritorios, scaNotas, damlujiRef } from '../../data/sca-territorios.js';

const celda = it => it.hueco
    ? `<div class="sca-item"><span class="hl-rojo">${it.texto}</span></div>`
    : `<div class="sca-item">${it.texto} <a class="biblio-link" href="${it.href}" target="_blank" rel="noopener">${it.fuente}, ${it.pagina || it.apartado}</a></div>`;

export function htmlTablaSca(prefijo) {
    const cab = scaColumnas.map(c => `<th>${c.titulo}</th>`).join('');
    const filas = scaTerritorios.map(t => `<tr id="${prefijo}-${t.id}"><td class="sca-primera"><strong>${t.territorio}</strong></td>${scaColumnas.map(c => `<td>${t[c.clave].map(celda).join('')}</td>`).join('')}</tr>`).join('');
    const notas = scaNotas.map(n => `<details class="nota-plegable" id="${prefijo}-nota-${n.id}"><summary>${n.titulo}</summary><p>${n.texto}</p></details>`).join('');
    return `<style>
        .sca-wrap{overflow-x:auto;} .sca-tabla{min-width:760px;font-size:0.72rem;} .sca-tabla td,.sca-tabla th{padding:6px;}
        .sca-tabla .sca-primera{position:sticky;left:0;background:var(--bg-card, var(--bg-main));min-width:92px;max-width:110px;z-index:1;}
        .sca-item{margin-bottom:6px;} .sca-item:last-child{margin-bottom:0;} .sca-tabla .biblio-link{white-space:normal;font-size:0.68rem;display:inline;}
    </style>
    <div class="sca-wrap"><table class="data-table sca-tabla" id="${prefijo}-datos" data-nombre="Arteria, ECG, pared y complicación del infarto"><thead><tr><th class="sca-primera">Arteria</th>${cab}</tr></thead><tbody>${filas}</tbody></table></div>
    ${notas}
    <p class="fuente-ficha">Cada columna es de una fuente distinta y no se mezclan. Referencia de las complicaciones: <a class="biblio-link" href="${damlujiRef.href}" target="_blank" rel="noopener">Damluji 2021, AHA</a> <span class="biblio-nota">${damlujiRef.texto} ${damlujiRef.nota}</span></p>`;
}

export function init() {
    [['ecg9-sca-tabla', 'ecg9-sca'], ['pifobj-sca-tabla', 'pifobj-sca-t']].forEach(([id, prefijo]) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = htmlTablaSca(prefijo);
    });
}
