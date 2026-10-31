// «Tórax de UCI» (PIF Radiología): cuaderno de campo con sus fichas y tarjetas Sí/No.
// Cada final sale de una ficha ya hecha de la app (Marino, The ICU Book, 5.ª ed.) y lleva su página.
import { initCorkboard } from '../../core/corkboard.js';
import { initSiNoWizard } from '../../core/wizard.js';
import { montarLectura } from './radio-lee.js';
import { EJERCICIOS_LEE_TORAX } from '../../data/pif-radio-lee-torax.js';

const PDF = {
    baro: 'docs/marino-2024-respiratory-management-caps27-30.pdf',
    via: 'docs/marino-2024-acceso-vascular-practicas-caps1-4.pdf',
};
const cita = (pdf, pag, txt) => `<br><small style="font-weight:400;">${txt} <a class="biblio-link" href="${PDF[pdf]}#page=${pag}" target="_blank" rel="noopener">pág. ${pag}</a></small>`;
const ver = (esp, view, panel, tab, res, rot) =>
    `<br><button type="button" class="especialidad-link" style="margin-top:8px;" data-especialidad="${esp}" data-view="${view}" data-panel="${panel}" data-tab="${tab}"${res ? ` data-resaltar="${res}"` : ''}>🔗 Ver en el texto: ${rot} →</button>`;

const T_BARO = c => c + ver('neumologia', 'merinoNeumologia', 'panel-merino-neumo-tabs', 'neumo-cuidado-barotrauma', '', 'Barotrauma y tubo torácico (Marino, cap. 28)');
const T_VIA = (c, res) => c + ver('libros', 'marinoFundamentos', 'panel-marino-fund-tabs', 'mar-cvc-complicaciones', res, 'Tras el catéter central (Marino, cap. 2)');

export const PASOS_TENSION = {
    inicio: { pregunta: '¿Es un paciente en ventilación mecánica con hipoxemia o hipotensión que no se explican por otra causa (o está justo tras pinchar una vía central)?',
        si: 't2',
        no: { estado: 'tfg-estado-neutro', final: T_VIA('Esta tarjeta es para el paciente inestable sin causa. Si no lo está, un neumotórax puede ser pequeño y silente, sobre todo el de un procedimiento, y la placa portátil no ve hasta el 50 % de los neumotórax del crítico: mira delante de las bases y, si dudas, la eco.' + cita('via', 34, 'Marino, cap. 2.'), '#mar-neumo-rx') } },
    t2: { pregunta: 'En la placa, ¿falta la trama pulmonar en un hemitórax, con el mediastino desplazado al lado contrario y el hemidiafragma deprimido?',
        si: { estado: 'tfg-estado-danger', final: T_BARO('Neumotórax a tensión: emergencia que exige descompresión inmediata. Angiocatéter de 14 G y 8 cm en el 5.º espacio intercostal, justo por delante de la línea axilar media; si falla, descompresión digital, y después un tubo torácico pequeño de 8,5-14 Fr.' + cita('baro', 29, 'Marino, cap. 28 (los signos de la placa, en las págs. 27-28).')) },
        no: 't3' },
    t3: { pregunta: 'La placa no enseña esos signos, ¿pero el paciente sigue con hipoxemia o hipotensión sin explicar?',
        si: { estado: 'tfg-estado-warn', final: T_VIA('Una placa sin hallazgos no descarta el neumotórax: en supino el aire se acumula delante y la trama pulmonar de detrás lo tapa (en la figura 2.5, la placa no mostraba nada y la TC sí). Marino propone la eco como alternativa más sensible que la placa.' + cita('via', 35, 'Marino, cap. 2 (el supino, en la pág. 34).'), '#mar-neumo-eco') },
        no: { estado: 'tfg-estado-ok', final: T_BARO('Sin signos de tensión en la placa y sin inestabilidad inexplicada: no hay un neumotórax a tensión que descomprimir ahora. Mantén la vigilancia, porque en ventilación mecánica el neumotórax por barotrauma puede ser mayor e instaurar hipoxemia o hipotensión después.' + cita('baro', 26, 'Marino, cap. 28.')) } },
};

export function init() {
    if (!document.getElementById('pif-radio-torax-corkboard')) return;
    initCorkboard('pif-radio-torax-corkboard', 'panel-pif-radio-torax-tabs');
    initSiNoWizard('radio-t1', PASOS_TENSION);
    Object.entries(EJERCICIOS_LEE_TORAX).forEach(([tab, lista]) => lista.forEach(ej => montarLectura(document.getElementById(`${tab}-lee`), ej)));
}
