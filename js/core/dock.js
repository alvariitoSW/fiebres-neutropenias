// El dock fijo de abajo: UNA pieza para las maquetas. Lo que ya tiene cada
// maqueta (la frase, las pestañas, el panel de mandos) se queda; esta pieza solo añade el plegado:
//   · un asa de 44 px («Mandos ▾ / ▴») que pliega el dock a la frase sola, para que el dibujo y el monitor quepan en la
//     pantalla del móvil (v3: la frase y los mandos se comían 260 de 844 px);
//   · se pliega solo al tocar la escena (cualquier elemento con data-dock-pliega) y se despliega al tocar el dock fuera
//     de un botón (un botón visible plegado, como «Guía», funciona al primer toque);
//   · mide su altura y la deja en --dock-h (el cuerpo de la página reserva ese hueco abajo).
//   crearDock(dock, { plegables, alMedir }) → { plegar(on), get plegado, medir() }
//     dock: el elemento fijo; plegables: lo que desaparece al plegar (por defecto, todo lo que no sea .frase ni el asa);
//     alMedir: se llama tras medir (opcional).
import { instalarCss } from './dibujo-iso.js';

export const DOCK_CSS = `
.dock-asa { display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; min-height: 28px; margin: -2px 0 0; border: 0; background: transparent; color: var(--text-muted); font: 600 .62rem/1 var(--sans, system-ui, sans-serif); letter-spacing: .06em; text-transform: uppercase; cursor: pointer; padding: 0; }
.dock-asa::before { content: ''; width: 36px; height: 4px; border-radius: 2px; background: var(--border-color); }
.dock.dock-plegado .dock-pliega { display: none !important; }
`;

export function crearDock(dock, { plegables = null, alMedir = null } = {}) {
  instalarCss('dock', DOCK_CSS);
  let plegado = false;
  const asa = document.createElement('button');
  asa.type = 'button'; asa.className = 'dock-asa'; asa.setAttribute('aria-expanded', 'true'); asa.textContent = 'Mandos';
  dock.prepend(asa);
  const marcar = () => {
    const lista = plegables || [...dock.querySelectorAll('.dock-in > *')].filter((e) => !e.classList.contains('frase') && !e.classList.contains('dock-asa'));
    for (const e of lista) e.classList.add('dock-pliega');
  };
  marcar();
  function medir() { requestAnimationFrame(() => { document.documentElement.style.setProperty('--dock-h', dock.offsetHeight + 'px'); alMedir?.(); }); }
  function plegar(on = !plegado) {
    plegado = !!on; dock.classList.toggle('dock-plegado', plegado);
    asa.setAttribute('aria-expanded', String(!plegado)); asa.setAttribute('aria-label', plegado ? 'Desplegar los mandos' : 'Plegar los mandos');
    medir();
  }
  asa.addEventListener('click', () => plegar());
  // tocar la escena pliega; tocar una pestaña del dock despliega
  document.addEventListener('pointerdown', (ev) => {
    if (ev.target.closest('[data-dock-pliega]') && !plegado && !dock.contains(ev.target)) plegar(true);
    // un botón visible con el dock plegado (la «Guía» de la frase) hace lo suyo al primer toque: si desplegara aquí, el dock
    // cambiaría de altura bajo el dedo y el click se perdería (hacían falta dos toques). Solo despliega tocar fuera de un botón.
    else if (dock.contains(ev.target) && plegado && !ev.target.closest('.dock-asa') && !ev.target.closest('button')) plegar(false);
  }, { passive: true });
  // cualquier cambio de altura del dock (la guía que crece, un aviso nuevo) vuelve a medir el hueco de abajo
  if (typeof ResizeObserver !== 'undefined') { let h0 = 0; new ResizeObserver(() => { if (dock.offsetHeight !== h0) { h0 = dock.offsetHeight; medir(); } }).observe(dock); }
  medir();
  return { plegar, get plegado() { return plegado; }, medir, marcar, asa };
}
