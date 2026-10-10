// Vistas Visual de tres tarjetas de Neutropenia Febril con el kit genérico
// (core/visual-kit.js): ninguna calcula nada, escriben en las casillas
// reales y copian el resultado que pinta su calculadora de siempre.
//   - 2b. Índice CISNE (vista principal): barras de puntos por ítem.
//   - 3. ¿Cuándo parar? (empírico): tres candados que deben abrirse todos.
//   - 4. Vía oral y ambulatoria (empírico): barreras; basta una para ingresar.

import { montarVisual } from '../../core/visual-kit.js';

export function initTarjetasVisual() {
    montarVisual('cisne-card', {
        guia: 'Cada ítem suma sus puntos. Toca Sí/No para cambiarlo: escribe en las casillas de la tarjeta.',
        paneles: [{
            tipo: 'puntos', titulo: 'Puntos CISNE',
            items: [
                { checks: '#cisne-ecog', pts: 2 }, { checks: '#cisne-hipergluc', pts: 2 },
                { checks: '#cisne-epoc', pts: 1 }, { checks: '#cisne-cardio', pts: 1 },
                { checks: '#cisne-mucositis', pts: 1 }, { checks: '#cisne-monocitos', pts: 1 }
            ],
            resultado: ['#cisne-score-display', '#cisne-eval-text', '#cisne-management']
        }, {
            tipo: 'flujo', titulo: 'Cuándo usarlo',
            nodos: [{ fuente: 'css:.warning-box', etiqueta: 'Validado en tumores sólidos: apoyo limitado en hematología', color: 'amarillo' }]
        }]
    });

    montarVisual('empirico-suspension-card', {
        guia: 'Tres candados: el antibiótico empírico se suspende cuando están abiertos los tres. Toca uno para abrirlo o cerrarlo.',
        paneles: [{
            tipo: 'requisitos', modo: 'todos', titulo: 'Fiebre sin foco: criterios ECIL-10',
            puerta: 'Suspender el antibiótico',
            items: [{ checks: '.tx-suspension-check' }],
            resultado: ['#susp-resultado-empirico']
        }]
    });

    montarVisual('empirico-oral-card', {
        guia: 'Cada casilla marcada es una barrera: con una sola, ingreso. Sin ninguna, candidato a vía oral y manejo ambulatorio.',
        paneles: [{
            tipo: 'requisitos', modo: 'ninguno', titulo: 'Exclusiones de la vía oral',
            puerta: 'Vía oral y ambulatorio',
            items: [{ checks: '.tx-oral-exclusion' }],
            resultado: ['#oral-resultado', '#oral-regimen']
        }, {
            tipo: 'flujo', titulo: 'Antes del alta',
            nodos: [{ fuente: 'css:.warning-box', etiqueta: 'Comprobar también estabilidad, tolerancia oral y entorno', color: 'amarillo' }]
        }]
    });
}
