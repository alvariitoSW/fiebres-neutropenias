// «Neuro urgente» (PIF Radiología): cuaderno de campo con sus fichas y tarjetas Sí/No.
import { initCorkboard } from '../../core/corkboard.js';
import { initSiNoWizard } from '../../core/wizard.js';

const MARINO = 'docs/marino-2024-neurologia-caps45-47.pdf';
const STROKE = 'https://www.ncbi.nlm.nih.gov/sites/books/NBK546635/';
const citaM = (pag, txt) => `<br><small style="font-weight:400;">${txt} <a class="biblio-link" href="${MARINO}#page=${pag}" target="_blank" rel="noopener">pág. ${pag}</a></small>`;
const citaS = (sec) => `<br><small style="font-weight:400;">StatPearls, «Stroke Imaging», sección «${sec}»: <a class="biblio-link" href="${STROKE}" target="_blank" rel="noopener">abrir</a></small>`;
const ver = (esp, view, panel, tab, res, rot) =>
    `<br><button type="button" class="especialidad-link" style="margin-top:8px;" data-especialidad="${esp}" data-view="${view}" data-panel="${panel}" data-tab="${tab}"${res ? ` data-resaltar="${res}"` : ''}>🔗 Ver en el texto: ${rot} →</button>`;
const T_HIC = (c, res) => c + ver('libros', 'marinoNeuro', 'panel-marino-neuro-tabs', 'mn-hic', res, 'Hemorragia intracerebral (Marino, cap. 47)');
const T_IMG = c => c + ver('pifRadio', 'neuro', 'panel-pif-radio-neuro-tabs', 'radio-n1', '#radio-n1-pasos', 'Ictus: ¿isquémico o hemorrágico?');

export const PASOS_N1 = {
    inicio: { pregunta: '¿La TC de cráneo sin contraste muestra una zona hiperdensa (sangre) en el parénquima o en los ventrículos?',
        si: 'h2',
        no: 'i2' },
    h2: { pregunta: '¿Hay sangre dentro de los ventrículos o desviación de la línea media?',
        si: { estado: 'tfg-estado-danger', final: T_HIC('Hemorragia con repercusión: la sangre intraventricular puede causar hidrocefalia obstructiva y requerir un catéter de drenaje ventricular; la fig. 47.2 muestra una hemorragia masiva con desviación de la línea media. En la mayoría de las hemorragias intracerebrales hay que consultar con neurocirugía.' + citaM(45, 'Marino, cap. 47 (fig. 47.2 en la pág. 40).'), '#mn-hic-pic') },
        no: { estado: 'tfg-estado-warn', final: T_HIC('Hemorragia intracerebral sin signos de repercusión en esta TC: revierte los antitrombóticos que tome (tabla 47.4) y mantén la presión sistólica por debajo de 140 mmHg.' + citaM(45, 'Marino, cap. 47 (tabla 47.4 en la pág. 44).'), '#mn-hic-otras') } },
    i2: { pregunta: 'Sin sangre: ¿ves pérdida de la diferenciación sustancia gris-blanca, borramiento de la ínsula o del núcleo lenticular, o una arteria cerebral media hiperdensa?',
        si: { estado: 'tfg-estado-warn', final: T_IMG('Signos precoces de isquemia. La arteria cerebral media hiperdensa refleja un trombo y es muy específica de oclusión de gran vaso. Puntúa el territorio con ASPECTS (10 puntos, se resta por cada región hipodensa) y pide angio-TC para localizar la oclusión.' + citaS('Noncontrast Computed Tomography')) },
        no: { estado: 'tfg-estado-warn', final: T_IMG('Sin sangre ni signos visibles: no descarta un infarto, porque la TC puede ser normal en las primeras horas. Se recomienda la angio-TC en todo candidato a tratamiento para detectar oclusión de gran vaso.' + citaS('Computed Tomography Angiography')) } },
};

export function init() {
    if (!document.getElementById('pif-radio-neuro-corkboard')) return;
    initCorkboard('pif-radio-neuro-corkboard', 'panel-pif-radio-neuro-tabs');
    initSiNoWizard('radio-n1', PASOS_N1);
}
