// Silueta corporal de tinta compartida por las imágenes de la vista Visual
// que colocan marcadores sobre órganos (Neutropenia Febril, kit de
// core/visual-kit.js para el resto de Hematología). viewBox
// 170×400; los marcadores se posicionan en % de esa caja con ORGANOS.
export const SILUETA_SVG = `
<svg class="silueta-svg" viewBox="0 0 170 400" aria-hidden="true">
  <circle cx="85" cy="36" r="26" fill="none" stroke="currentColor" stroke-width="2"/>
  <path d="M85 62 L85 78" stroke="currentColor" stroke-width="2"/>
  <path d="M45 80 Q85 70 125 80 L135 230 Q85 245 35 230 Z" fill="rgba(46,38,28,0.6)" stroke="currentColor" stroke-width="2"/>
  <path d="M45 84 L14 200 M125 84 L156 200 M58 232 L52 390 M112 232 L118 390" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="62" cy="122" rx="16" ry="30" fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-width="1.5"/>
  <ellipse cx="108" cy="122" rx="16" ry="30" fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-width="1.5"/>
  <path d="M60 186 q20 -8 40 2 l-4 16 q-20 6 -34 -2 Z" fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-width="1.5"/>
  <ellipse cx="114" cy="206" rx="6" ry="10" fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-width="1.5"/>
  <path d="M64 98 L56 90 L46 86" stroke="var(--accent-blue)" stroke-width="2" fill="none"/>
</svg>`;

// Centro de cada zona en coordenadas del viewBox (separadas ≥36 unidades
// para que los marcadores no se pisen a 390 px).
export const ORGANOS = {
    cabeza: [85, 24], boca: [85, 62],
    cateter: [24, 128], pulmonDcho: [62, 120], pulmonIzdo: [108, 120],
    corazon: [85, 162], higado: [58, 198], rinon: [114, 206], abdomen: [85, 238],
    vejiga: [85, 278], perine: [85, 320], piel: [150, 190],
    bocaDcha: [62, 60], bocaIzda: [108, 60], medula: [56, 320],
    ojos: [62, 30], bazo: [118, 176], intestino: [62, 240], vasos: [144, 140],
    piernaIzda: [114, 352], brazoDcho: [20, 172], ganglios: [116, 84]
};

// left/top en % de la caja de la silueta.
export function posicion([x, y]) {
    return `left:${(x / 170 * 100).toFixed(2)}%;top:${(y / 400 * 100).toFixed(2)}%`;
}
