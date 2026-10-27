// El plano grande (pieza común de las maquetas): lleva una o varias piezas de una figura a un plano a pantalla completa,
// entre el borde de arriba y la frase y el dock de abajo (que siguen a la vista y se pueden usar). Las piezas se MUEVEN
// (no se copian): las sigue moviendo el mismo motor. Al cerrar, vuelven a su sitio.
// piezas: [{ nodo, viewBox }] — con viewBox, el nodo es un grupo SVG y va dentro de un <svg> propio a todo el ancho.
import { instalarCss } from './dibujo-iso.js';

const CSS = `
.plano-grande { position: fixed; left: 0; right: 0; top: 0; bottom: calc(var(--dock-h, 0px) + var(--frase-h, 0px)); z-index: 25; background: var(--bg-main);
  overflow-y: auto; overscroll-behavior: contain; padding: 8px max(10px, env(safe-area-inset-left, 0px)) 12px; display: grid; gap: 8px; align-content: start; }
.plano-grande[hidden] { display: none !important; }
.plano-grande .pg-cab { display: flex; align-items: center; gap: 8px; max-width: 560px; width: 100%; margin: 0 auto; }
.plano-grande .pg-tit { flex: 1; min-width: 0; font: 700 .72rem/1.2 system-ui, sans-serif; letter-spacing: .06em; text-transform: uppercase; color: var(--accent-yellow); }
.plano-grande .pg-x { flex: none; width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--border-color); background: transparent; color: var(--text-main); font-size: 1.2rem; cursor: pointer; }
.plano-grande .pg-pieza { max-width: 560px; width: 100%; margin: 0 auto; border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; background: var(--bg-main); }
.plano-grande .pg-pieza > svg { display: block; width: 100%; height: auto; }
.plano-grande .pg-pieza svg text { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }
.plano-grande .pg-nota { max-width: 560px; width: 100%; margin: 0 auto; font: .74rem/1.35 system-ui, sans-serif; color: var(--text-muted); }
.btn-plano { min-height: 40px; padding: 0 12px; border-radius: 999px; border: 1px solid var(--accent-yellow); background: transparent; color: var(--accent-yellow); font: 600 .74rem/1.2 system-ui, sans-serif; cursor: pointer; }
`;
export function crearPlanoGrande({ titulo, piezas, nota = '' }) {
  instalarCss('plano-grande', CSS);
  const caja = document.createElement('div'); caja.className = 'plano-grande'; caja.hidden = true;
  caja.setAttribute('role', 'dialog'); caja.setAttribute('aria-label', titulo);
  caja.innerHTML = `<div class="pg-cab"><span class="pg-tit">${titulo}</span><button type="button" class="pg-x" aria-label="Cerrar el plano grande">×</button></div>`;
  document.body.appendChild(caja);
  const sitios = [];
  function abrir() {
    if (!caja.hidden) return;
    for (const p of piezas) {
      const nodo = typeof p.nodo === 'function' ? p.nodo() : p.nodo; if (!nodo) continue;
      sitios.push({ nodo, padre: nodo.parentNode, sig: nodo.nextSibling });
      const marco = document.createElement('div'); marco.className = 'pg-pieza';
      if (p.viewBox) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', p.viewBox); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', p.etiqueta || titulo);
        if (p.clase) svg.setAttribute('class', p.clase);
        svg.appendChild(nodo); marco.appendChild(svg);
      } else marco.appendChild(nodo);
      caja.appendChild(marco);
    }
    if (nota) caja.insertAdjacentHTML('beforeend', `<p class="pg-nota">${nota}</p>`);
    caja.hidden = false;
  }
  function cerrar() {
    if (caja.hidden) return;
    for (const s of sitios.splice(0).reverse()) s.padre.insertBefore(s.nodo, s.sig);   // al revés: el siguiente ya ha vuelto
    caja.querySelectorAll('.pg-pieza, .pg-nota').forEach((e) => e.remove());
    caja.hidden = true;
  }
  caja.querySelector('.pg-x').addEventListener('click', cerrar);
  return { abrir, cerrar, get abierto() { return !caja.hidden; } };
}
