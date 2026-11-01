// Cara de West Haven (idea de la maqueta C, dibujada de nuevo): icono de 24 px junto al grado, siempre con texto. Ilustrativa.
export const WH_TXT = ['sin encefalopatía', 'atención corta', 'apatía, letargo', 'estupor', 'coma'];
export function cara(g) {
  const ojo = (x) => g >= 3 ? `<path d="M${x - 2} 10q2 1.6 4 0" class="tr"/>` : g === 2 ? `<path d="M${x - 2} 10h4" class="tr"/>` : `<circle cx="${x}" cy="10" r="1.5" class="pu"/>`;
  const boca = g === 4 ? '<ellipse cx="12" cy="17" rx="1.6" ry="2.2" class="pu"/>' : g === 3 ? '<ellipse cx="12" cy="17" rx="1.6" ry="1" class="pu"/>' : g === 0 ? '<path d="M8.5 16q3.5 3 7 0" class="tr"/>' : '<path d="M9 17h6" class="tr"/>';
  return `<svg class="cara-wh" width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="Cara ilustrativa: ${WH_TXT[g]}"><circle cx="12" cy="12" r="10.5" class="pi"/>${ojo(8)}${ojo(16)}${g === 1 ? '<path d="M5.5 6l4-1.2M14.5 4.8l4 1.2" class="tr"/>' : ''}${boca}</svg>`;
}
