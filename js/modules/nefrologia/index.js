// Módulo "Nefrología": la nefrona interactiva es el menú principal (ver
// nefrona.js). Este archivo solo orquesta el switcher de nivel medio
// (menú nefrona ↔ vistas de categoría clínica) y resuelve qué categoría
// abrir cuando se toca un segmento con contenido ya disponible.
import { createViewSwitcher } from '../../core/navigation.js';
import { initNefrona } from './nefrona.js';
import { initQuiz } from '../quiz/quiz.js';
import { preguntasNefrologia } from '../../data/nefrologia-preguntas.js';

function mostrarEnPreparacion() {
    const cont = document.getElementById('nefro-segmento-categorias');
    if (cont) cont.innerHTML = '<p style="font-size: 0.8rem; color: var(--text-muted);">🚧 Contenido clínico de esta zona en preparación.</p>';
}

export function init() {
    const nefroLevel = createViewSwitcher({
        menu: document.getElementById('nefro-menu-view'),
        diureticosAsa: document.getElementById('nefro-diureticos-asa-view'),
    });

    document.querySelectorAll('.btn-volver-nefro-menu').forEach(b =>
        b.addEventListener('click', () => { nefroLevel.show('menu'); nefrona.reset(); }));

    const categoriaDisponible = {
        'diureticos-asa': () => nefroLevel.show('diureticosAsa'),
    };

    const nefrona = initNefrona({
        onCategoria: (key) => categoriaDisponible[key]?.() ?? mostrarEnPreparacion(),
    });

    initQuiz({ triggerId: 'btn-nefro-repasar', banco: preguntasNefrologia });

    nefroLevel.show('menu');
}
