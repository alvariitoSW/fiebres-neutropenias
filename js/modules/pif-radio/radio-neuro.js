// «Neuro urgente» (PIF Radiología): cuaderno de campo con sus fichas y tarjetas Sí/No.
import { initCorkboard } from '../../core/corkboard.js';
import { initSiNoWizard } from '../../core/wizard.js';
import { montarLectura } from './radio-lee.js';
import { EJERCICIOS_LEE_NEURO } from '../../data/pif-radio-lee-neuro.js';

const MARINO = 'docs/marino-2024-neurologia-caps45-47.pdf';
const STROKE = 'https://www.ncbi.nlm.nih.gov/sites/books/NBK546635/';
const citaM = (pag, txt) => `<br><small style="font-weight:400;">${txt} <a class="biblio-link" href="${MARINO}#page=${pag}" target="_blank" rel="noopener">pág. ${pag}</a></small>`;
const citaS = (sec) => `<br><small style="font-weight:400;">StatPearls, «Stroke Imaging», sección «${sec}»: <a class="biblio-link" href="${STROKE}" target="_blank" rel="noopener">abrir</a></small>`;
const ver = (esp, view, panel, tab, res, rot) =>
    `<br><button type="button" class="especialidad-link" style="margin-top:8px;" data-especialidad="${esp}" data-view="${view}" data-panel="${panel}" data-tab="${tab}"${res ? ` data-resaltar="${res}"` : ''}>🔗 Ver en el texto: ${rot} →</button>`;
const T_HIC = (c, res) => c + ver('libros', 'marinoNeuro', 'panel-marino-neuro-tabs', 'mn-hic', res, 'Hemorragia intracerebral (Marino, cap. 47)');
const T_IMG = c => c + ver('libros', 'marinoNeuro', 'panel-marino-neuro-tabs', 'mn-ictus-soporte', '', 'Ictus isquémico: medidas generales (Marino)');

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

// ---- N2 · HTIC y hernias ----
const UMI = 'docs/hugcdn-umi-manual-guardia-parte2.pdf';
const HERN = 'https://www.ncbi.nlm.nih.gov/books/NBK542246/';
const citaU = (imp, txt) => `<br><small style="font-weight:400;">${txt} <a class="biblio-link" href="${UMI}#page=${imp - 52}" target="_blank" rel="noopener">Manual UMI, pág. ${imp}</a></small>`;
const propio = '<br><small style="font-weight:400;"><em>Razonamiento propio de la app, no de una fuente:</em> ';
const citaH = (sec, txt) => `<br><small style="font-weight:400;">${txt} <a class="biblio-link" href="${HERN}" target="_blank" rel="noopener">StatPearls, «Brain Herniation», sección «${sec}»</a></small>`;
const verU = (tab, res, rot) => ver('sobrevivirUmi', 'manualUmi', 'panel-manual-umi-tabs', tab, res, rot);
const T_MAR = (c, res) => c + verU('umi-marshall', res, 'Clasificación de Marshall (Manual UMI)');
const T_COMA = c => c + ver('libros', 'marinoNeuro', 'panel-marino-neuro-tabs', 'mn-coma', '#mn-coma-ojos', 'Coma: ojos y pupilas (Marino)');

export const PASOS_N2 = {
    inicio: { pregunta: '¿Ves las cisternas de la base (perimesencefálicas, supraselar) comprimidas o borradas?',
        si: 'c2',
        no: 'l2' },
    c2: { pregunta: '¿Hay además una pupila dilatada y poco reactiva, un descenso del nivel de consciencia o una línea media desviada?',
        si: { estado: 'tfg-estado-danger', final: T_MAR('Cisternas borradas más clínica o desviación: signos de una posible hernia. Trátalo como una crisis de PIC: pide ayuda, escala a neurocirugía y prepara la imagen y la intervención urgentes; en el TCE grave, la compresión de las cisternas basales en la TAC es indicación de monitorizar la PIC.' + citaH('Treatment / Management', 'Conducta ante la hernia ("Call for help and treat this as an ICP crisis"):') + citaU(83, 'Monitorización de la PIC (nivel II).') + citaH('Evaluation', 'Qué cisterna se borra según el tipo de hernia:'), '#umi-marshall-tabla') },
        no: { estado: 'tfg-estado-warn', final: T_MAR('Cisternas borradas sin clínica ni desviación. En un TCE, la categoría Marshall III (swelling bilateral, sin cisternas de la base) tiene HTIC en el 63,2 %. Valora monitorizar la PIC, que el Manual indica con cisternas basales comprimidas.' + citaU(94, 'Marshall III, incidencia de HTIC.') + citaU(83, 'Cisternas basales comprimidas: monitorizar la PIC.') + propio + 'sin hernia aún, repetir a menudo la exploración de las pupilas.</small>', '#umi-marshall-tabla') } },
    l2: { pregunta: 'Cisternas visibles: ¿hay una línea media desviada, o una pupila dilatada y poco reactiva, o un descenso del nivel de consciencia?',
        si: { estado: 'tfg-estado-warn', final: T_COMA('Riesgo de hernia: una desviación de la línea media (la subfalcina borra el ventrículo lateral y desplaza el septum pellucidum) o una pupila unilateral dilatada pueden ser el inicio. Escala a neurocirugía y prepara la imagen urgente.' + citaH('Treatment / Management', 'Conducta ante la hernia ("Escalate to a senior clinician, neurosurgery, and prepare for urgent imaging"):') + citaH('Evaluation', 'TC de la hernia subfalcina:') + '<br><small style="font-weight:400;">Una pupila unilateral dilatada y fija puede ser disfunción del III par por una masa en expansión. Marino, cap. 45, <a class="biblio-link" href="docs/marino-2024-neurologia-caps45-47.pdf#page=11" target="_blank" rel="noopener">pág. 11</a>.</small>' + citaU(83, 'En el TCE, un hematoma subdural o una contusión con efecto de masa y línea media &gt;5 mm es indicación quirúrgica.')) },
        no: { estado: 'tfg-estado-ok', final: T_MAR('Sin signos de hernia en esta TC: cisternas visibles y línea media centrada es un Marshall II, y aun así el 28,6 % tiene HTIC. Una TC sin hernia no descarta la presión alta: sigue la exploración y valora la PIC.' + citaU(94, 'Marshall II, incidencia de HTIC.'), '#umi-marshall-tabla') } },
};

export function init() {
    if (!document.getElementById('pif-radio-neuro-corkboard')) return;
    initCorkboard('pif-radio-neuro-corkboard', 'panel-pif-radio-neuro-tabs');
    initSiNoWizard('radio-n1', PASOS_N1);
    initSiNoWizard('radio-n2', PASOS_N2);
    for (const ej of EJERCICIOS_LEE_NEURO) {
        const caja = document.getElementById('radio-caja-' + ej.id);
        if (caja) montarLectura(caja, ej);
    }
}
