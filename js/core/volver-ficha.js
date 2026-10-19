// «← VOLVER» de los modelos vivos (ácido-base vivo, río y mar): si se entró desde una ficha, vuelve a esa ficha,
// abierta y en el mismo sitio. Sin listener propio: el origen viaja como atributos del enlace cruzado de siempre
// (data-especialidad / data-view / data-panel / data-tab + data-volver-y) puestos en el propio botón, y lo resuelve
// el listener delegado de home/index.js.
//
// - origenFicha(boton): lo llama home/index.js al pulsar un enlace a un modelo vivo. Devuelve la ficha de la que se
//   sale ({ especialidad, view, panel, tab, trasplante, y }) o null (menú, buscador). Si el botón está dentro de
//   otro modelo vivo ([data-modelo-vivo]), hereda el origen de ese modelo: el salto entre herramientas no lo pisa.
// - marcarVolver(boton, raiz, origen): lo llama cada herramienta al abrirse. Sin origen, el botón hace lo de siempre.
import { rutaDePanel } from './search.js';

const CAMPOS = ['especialidad', 'view', 'panel', 'tab', 'trasplante', 'volverY'];

export function origenFicha(boton) {
    const modelo = boton.closest('[data-modelo-vivo]');
    if (modelo) return modelo.origenFicha ?? null;
    const ficha = boton.closest('.tab-content[id]');
    const panel = ficha?.closest('[id^="panel-"]');
    const ruta = panel && rutaDePanel(panel.id);
    if (!ruta) return null;
    return { especialidad: ruta.especialidad, view: ruta.view, trasplante: ruta.trasplante, panel: panel.id, tab: ficha.id, y: Math.round(window.scrollY) };
}

export function marcarVolver(boton, raiz, origen) {
    if (!boton) return;
    if (raiz) raiz.origenFicha = origen || null;
    if (boton.dataset.textoBase === undefined) boton.dataset.textoBase = boton.textContent;
    CAMPOS.forEach(k => delete boton.dataset[k]);
    if (!origen) { boton.textContent = boton.dataset.textoBase; return; }
    for (const [k, v] of Object.entries(origen)) if (v != null && v !== '') boton.dataset[k === 'y' ? 'volverY' : k] = v;
    boton.textContent = '← VOLVER A LA FICHA';
}
