// Módulo «Radiología · PIF»: contenido de la rotación PIF de Radiología.
// Tres cuadernos: «Placa portátil de UCI», «Tórax de UCI» y «Neuro urgente»; los demás objetivos salen en su menú
// como pendientes, con enlace a lo que ya hay en la app.
import { createViewSwitcher } from '../../core/navigation.js';
import { temasPifRadio, preguntasPifRadio } from '../../data/pif-radio-preguntas.js';
import { temasPifRadioTorax, preguntasPifRadioTorax } from '../../data/pif-radio-torax-preguntas.js';
import { temasPifRadioNeuro, preguntasPifRadioNeuro } from '../../data/pif-radio-neuro-preguntas.js';
import { init as initPlaca } from './radio-placa.js';
import { init as initTorax } from './radio-torax.js';
import { init as initNeuro } from './radio-neuro.js';

export const quizTriggerId = ['btn-pif-radio-repasar', 'btn-pif-radio-torax-repasar', 'btn-pif-radio-neuro-repasar'];
export const quizBanco = [...preguntasPifRadio, ...preguntasPifRadioTorax, ...preguntasPifRadioNeuro];
const ASIGNATURA = 'Radiología · PIF';
const conBloque = (temas, bloque) => temas.map(t => ({ ...t, asignatura: ASIGNATURA, bloque }));
export const quizTemas = [
    ...conBloque(temasPifRadio, 'Placa portátil de UCI'),
    ...conBloque(temasPifRadioTorax, 'Tórax de UCI'),
    ...conBloque(temasPifRadioNeuro, 'Neuro urgente'),
];

export function init() {
    const nivel = createViewSwitcher({
        menu: document.getElementById('pif-radio-menu-view'),
        placa: document.getElementById('pif-radio-placa-view'),
        torax: document.getElementById('pif-radio-torax-view'),
        neuro: document.getElementById('pif-radio-neuro-view'),
    });
    document.getElementById('btn-pif-radio-placa').addEventListener('click', () => nivel.show('placa'));
    document.getElementById('btn-pif-radio-torax').addEventListener('click', () => nivel.show('torax'));
    document.getElementById('btn-pif-radio-neuro').addEventListener('click', () => nivel.show('neuro'));
    document.querySelectorAll('.btn-volver-pif-radio-menu').forEach(b => b.addEventListener('click', () => nivel.show('menu')));
    initPlaca();
    initTorax();
    initNeuro();
    nivel.show('menu');
    return {
        volverAlMenu: () => nivel.show('menu'),
        irAFicha: nivel.irAFicha,
    };
}
