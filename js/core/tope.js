// El tope de un mando: UNA pieza para las cuatro maquetas del bloque 3 (pieza común de la app).
// Cada mando tiene un tope escrito y con origen. Al acercarse avisa; al llegar, se apaga y sale un sello con la consecuencia.
//
//   crearTope({ monitor, dock, cita }) → { poner(clave, opciones), quitar(clave), activos() }
//     monitor: el elemento que envuelve el monitor (se le pone position:relative si no la tiene); ahí salen el sello y
//              la línea del aviso.
//     dock:    el dock fijo (o cualquier caja bajo los mandos); ahí sale el aviso ámbar.
//     cita:    (c) => html del «Ver en la ficha» de la página (su misma función cita()). Opcional: sin ella, el
//              tope solo enseña su origen.
//   poner(clave, { nivel, tono ('ok': sello verde de objetivo cumplido), titulo, texto, cita, origen, deshabilita, bajo })
//     nivel: 'aviso' (texto ámbar bajo el mando + una línea en el monitor) | 'sello' (sello en el monitor + apaga lo listado)
//     titulo: la palabra del sello o del aviso («Contraindicado», «Combinación no fisiológica»); texto: la consecuencia clínica
//     cita: lo que entiende la función cita() de la página; origen: 'ficha · p. 45' | 'fisiología general' | 'ilustrativo'
//     deshabilita: selectores CSS de los botones que se apagan mientras dure el tope (se vuelven a encender al quitarlo)
//     bajo: selector del mando bajo el que va el aviso (por defecto, al final del dock)
//     (con 'sello' o con 'aviso'). refrescar(): vuelve a aplicar deshabilita tras repintar el dock (los selectores se guardan, no los nodos).
//   Poner una clave que ya existe la reemplaza. quitar() de una clave que no está no hace nada.
import { instalarCss } from './dibujo-iso.js';

export const TOPE_CSS = `
.tope-mon { position: absolute; inset: 0; pointer-events: none; z-index: 5; }
.tope-sellos { position: absolute; left: 50%; bottom: 24px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 4px 0; box-sizing: content-box; width: max-content; max-width: 92%; max-height: 62%; overflow: hidden; pointer-events: none; }
.tope-sello[hidden] { display: none; }
.tope-sello.tope-compacto small { display: none; }
.tope-sello { flex: none; transform: rotate(-2deg); border: 2px solid var(--accent-red); color: var(--accent-red); background: color-mix(in srgb, var(--bg-main) 88%, transparent); font: 800 .8rem/1.15 var(--sans, system-ui, sans-serif); letter-spacing: .03em; text-transform: uppercase; padding: 4px 8px; border-radius: 8px; text-align: center; width: max-content; max-width: 100%; overflow: hidden; box-sizing: border-box; overflow-wrap: normal; word-break: normal; hyphens: none; pointer-events: auto; }
.tope-sello.tope-ok { border-color: var(--accent-green); color: var(--accent-green); }
.tope-sello small, .tope-aviso small { display: block; font: 600 .62rem/1.2 var(--sans, system-ui, sans-serif); letter-spacing: 0; text-transform: none; color: var(--text-main); }
.tope-sello .cita { display: flex; flex-wrap: wrap; gap: 0 8px; justify-content: center; align-items: baseline; margin: 1px 0 0; }
.tope-sello .cita a { display: none; }
.tope-sello .cita button { font: 600 .6rem/1.2 var(--sans, system-ui, sans-serif); letter-spacing: 0; text-transform: none; border: 0; padding: 0; margin: 0; background: none; min-height: 0; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tope-sello .tope-org, .tope-aviso .tope-org { color: var(--text-dim); font-weight: 400; }
.tope-linea { position: absolute; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; gap: 1px; }
.tope-linea span { display: block; font: 600 .62rem/1.25 var(--sans, system-ui, sans-serif); color: var(--bg-main); background: var(--accent-yellow); padding: 1px 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tope-avisos { display: flex; flex-direction: column; gap: 4px; margin: 4px 0 0; }
.tope-avisos:empty { display: none; }
.tope-aviso { font: 600 .72rem/1.35 var(--sans, system-ui, sans-serif); color: var(--text-main); border-left: 3px solid var(--accent-yellow); background: var(--bg-card); border-radius: 0 8px 8px 0; padding: 4px 8px; overflow-wrap: anywhere; min-width: 0; }
.tope-aviso b { color: var(--accent-yellow); }
.tope-apagado { opacity: .4; cursor: not-allowed; }
`;

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function crearTope({ monitor, dock, cita = null } = {}) {
  instalarCss('tope', TOPE_CSS);
  if (monitor && getComputedStyle(monitor).position === 'static') monitor.style.position = 'relative';
  const mon = document.createElement('div'); mon.className = 'tope-mon';
  const linea = document.createElement('div'); linea.className = 'tope-linea'; linea.setAttribute('role', 'status');
  const sellos = document.createElement('div'); sellos.className = 'tope-sellos';
  mon.append(sellos, linea); monitor?.append(mon);
  // Con varios sellos a la vez se apilan; el que no cabe se queda solo como chip en la línea.
  const ajustar = () => { const l = [...sellos.children]; l.forEach((n) => { n.hidden = false; n.classList.remove('tope-compacto'); }); const tope = mon.clientHeight * 0.62; const suma = () => l.filter((n) => !n.hidden).reduce((a, n, i) => a + n.offsetHeight + (i ? 6 : 0), 8); for (let i = l.length - 1; i > 0 && suma() > tope; i--) l[i].classList.add('tope-compacto'); for (let i = l.length - 1; i > 0 && suma() > tope; i--) l[i].hidden = true; };
  const avisos = document.createElement('div'); avisos.className = 'tope-avisos'; avisos.setAttribute('role', 'status');
  avisos.classList.add('dock-pliega');
  (dock?.querySelector('.dock-in') || dock)?.append(avisos);
  const activos = new Map();       // clave → { nivel, nodos, off, sels }
  const apagados = new Map();      // botón → cuántos topes lo apagan

  const apagar = (el) => { const n = apagados.get(el) || 0; apagados.set(el, n + 1); if (!n) { el.dataset.topeAntes = el.disabled ? '1' : ''; el.disabled = true; el.classList.add('tope-apagado'); } };
  const encender = (el) => {
    const n = (apagados.get(el) || 1) - 1;
    if (n > 0) { apagados.set(el, n); return; }
    apagados.delete(el); if (!el.dataset.topeAntes) el.disabled = false;
    delete el.dataset.topeAntes; el.classList.remove('tope-apagado');
  };
  function quitar(clave) {
    const t = activos.get(clave); if (!t) return;
    t.nodos.forEach((n) => n.remove()); t.off.forEach(encender); activos.delete(clave); ajustar();
  }
  // Guarda los SELECTORES, no los nodos: si la página repinta el dock, refrescar() vuelve a apagar los botones nuevos.
  function aplicarOff(t) {
    t.off = t.off.filter((el) => { if (el.isConnected) return true; encender(el); return false; });
    for (const sel of t.sels) for (const el of document.querySelectorAll(sel)) if (!t.off.includes(el)) { apagar(el); t.off.push(el); }
  }
  function refrescar() { for (const t of activos.values()) if (t.sels.length) aplicarOff(t); }
  function poner(clave, { nivel = 'aviso', tono = '', titulo = '', texto = '', cita: c = null, origen = '', deshabilita = [], bajo = null } = {}) {
    quitar(clave);
    const nodos = [], off = [];
    const pie = `${origen ? `<span class="tope-org">${esc(origen)}</span> ` : ''}${c && cita ? cita(c) : ''}`;
    const cuerpo = `${titulo ? `<b>${esc(titulo)}</b> ` : ''}${esc(texto)}`;
    const lin = document.createElement('span'); lin.dataset.tope = clave; lin.textContent = (nivel === 'sello' ? (tono === 'ok' ? '✔ ' : '⛔ ') : '⚠ ') + (titulo || texto);
    if (nivel === 'sello') {
      const s = document.createElement('div'); s.className = 'tope-sello' + (tono === 'ok' ? ' tope-ok' : ''); s.dataset.tope = clave; s.setAttribute('role', 'alert');
      s.innerHTML = `${tono === 'ok' ? '✔' : '⛔'} ${esc(titulo)}<small>${esc(texto)}</small>${pie ? `<small>${pie}</small>` : ''}`;
      sellos.append(s); nodos.push(s);
    } else {
      const a = document.createElement('div'); a.className = 'tope-aviso'; a.dataset.tope = clave;
      a.innerHTML = `⚠ ${cuerpo}${pie ? `<small>${pie}</small>` : ''}`;
      const ref = bajo && document.querySelector(bajo);
      if (ref) { ref.after(a); } else avisos.append(a);
      nodos.push(a);
    }
    linea.append(lin); nodos.push(lin);
    const t = { nivel, nodos, off, sels: [].concat(deshabilita || []) };
    activos.set(clave, t); aplicarOff(t); ajustar();
  }
  return { poner, quitar, refrescar, activos: () => [...activos].map(([clave, t]) => ({ clave, nivel: t.nivel })) };
}
