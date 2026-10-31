// La pantalla del respirador «como la real»: UNA pieza para las maquetas (maqueta; pensada para pasar a
// js/core/respirador.js). Genérica y sin marcas: recrea la disposición de un respirador de UCI (fondo claro, curvas con
// el área rellena, casillas de valores medidos, mandos redondos, pestañas de modo y teclas de maniobra). No calcula
// nada: dibuja lo que le da la página, que es quien lleva el motor (hoy el pulmón de b3-pulmon; mañana la VNI o el
// destete, con su propio motor y su configuración).
//
//   crearRespirador(cont, cfg) → { el, mon, curvas, montar(), pintarCurvas(), casillas(valores), mandos(valores),
//                                  modo(k), alarmas(lista), tecla(k, pulsada), info(txt), velo }
//   cfg:
//     canales: los canales del monitor (crearMonitor de js/core/monitor.js); por defecto canalesPantalla()
//     modos:   [{ k, et, apagado }]            apagado: el rótulo de por qué no está viva («no en este modelo…»)
//     casillas:[{ k, et, u, org, ilu }]        k = data-fila (la guía y las pruebas la buscan así); ilu: cifra ilustrativa
//     mandos:  [{ k, et, u, min, max, paso, org, nota }]   el rango y la nota los da la página en mandos(valores)
//     teclas:  [{ k, id, et, ico, tipo }]       tipo: 'tog' (se queda pulsada), 'accion' o 'deco' (apagada: decorativa)
//     interfaz: 'Tubo' | 'VNI'; pie: html del pie (el origen de las cifras)
//     alMando(k, v), alModo(k), alTecla(k), alCasilla(k)
//   casillas({ k: { v, lim, estado, sub } })   estado: '' | 'aviso' | 'alarma' | 'vacia'
//   mandos({ k: { v, txt, min, max, paso, apagado, nota } })   apagado: texto del porqué (el mando no se toca)
//   alarmas([{ k, nivel: 'alarma' | 'aviso', texto }])   la barra de arriba (campana, sin sonido)
import { crearMonitor, instalarMonitor, instalarMonitorResp } from '../../../core/monitor.js';
import { instalarCss } from '../../../core/dibujo-iso.js';

const f1 = (n) => Math.round(n * 10) / 10;

// Los tres canales de la pantalla: Paw (−10 a 60 mbar) con la línea roja de Pmáx y la punteada de PEEP, Flujo
// (−100 a 100 L/min) y Volumen. peep y pmax: funciones que devuelven el ajuste del momento.
export function canalesPantalla({ peep = () => 5, pmax = () => 40, pawMin = -10, pawMax = 60, flujoMax = 100, volMax = 1000 } = {}) {
  return [
    { k: 'paw', rot: 'Paw mbar', alto: 110, min: pawMin, max: pawMax, base0: 0, marcas: [0, 20], col: 'var(--resp-curva)', lineas: [{ k: 'pmax', v: pmax, clase: 'resp-pmax', rot: 'Pmáx' }, { k: 'peep', v: peep, clase: 'resp-peep', rot: 'PEEP' }] },
    { k: 'flujo', rot: 'Flujo L/min', alto: 90, min: -flujoMax, max: flujoMax, base0: 0, marcas: [-50, 0, 50], col: 'var(--resp-curva)' },
    { k: 'vol', rot: 'Vol mL', alto: 60, min: 0, max: volMax, base0: 0, marcas: [500], col: 'var(--resp-curva)' },
    { k: 'pmus', rot: 'Pmus', alto: 44, min: 0, max: 15, base0: 0, marcas: [0, 12], col: 'var(--resp-curva)' },   // esfuerzo del paciente (E4a): solo en los estados que lo usan
  ];
}

export const RESPIRADOR_CSS = `
.resp { --resp-fondo: #f3f5f7; --resp-tinta: #15202b; --resp-tenue: #5b6875; --resp-raya: #d5dbe1; --resp-curva: #1f3a5f; --resp-mando: #2563a8; --resp-barra: #e3e8ed; --resp-blanco: #fff; --resp-alarma: var(--accent-red); --resp-aviso: var(--accent-yellow);
  position: relative; background: var(--resp-fondo); color: var(--resp-tinta); border-radius: 12px; border: 1px solid var(--border-color); overflow: hidden; display: grid; grid-template-columns: minmax(0, 1fr); font-family: var(--sans, system-ui, sans-serif); }
.resp > * { min-width: 0; }
.resp-barra { display: flex; align-items: center; gap: 6px; min-height: 36px; padding: 0 6px; background: var(--resp-barra); border-bottom: 1px solid var(--resp-raya); }
.resp-adulto { flex: none; width: 18px; height: 18px; color: var(--resp-tenue); }
.resp-modo { flex: none; font: 800 1rem/1 var(--sans); color: var(--resp-tinta); letter-spacing: .01em; }
.resp-int { flex: none; font: 600 .62rem/1 var(--sans); color: var(--resp-tenue); border: 1px solid var(--resp-raya); border-radius: 4px; padding: 2px 4px; }
.resp-alarma { flex: 1 1 auto; min-width: 0; overflow-x: auto; white-space: nowrap; font: 700 .7rem/1.2 var(--sans); color: var(--resp-tenue); scrollbar-width: none; }
.resp-alarma::-webkit-scrollbar { display: none; }
.resp-alarma .al { display: inline-block; border-radius: 4px; padding: 3px 6px; margin-right: 4px; }
.resp-alarma .al.al-alarma { background: var(--resp-alarma); color: var(--resp-blanco); }
.resp-alarma .al.al-mas { background: var(--resp-barra); border: 1px solid var(--resp-tenue); color: var(--resp-tinta); }
.resp-alarma .al.al-aviso { background: var(--resp-aviso); color: var(--resp-tinta); }
.resp-hora { flex: none; font: 600 .62rem/1.1 var(--sans); color: var(--resp-tenue); text-align: right; }
.resp-curvas { position: relative; padding: 2px 2px 0; }
.resp .mon-trazas { display: block; width: 100%; }
.resp .mon-trazas .mon-rot { font: 700 9px var(--sans); fill: var(--resp-tenue); }
.resp .mon-trazas .mon-rot-caja { fill: var(--resp-fondo); fill-opacity: .9; }
.resp .mon-trazas .mon-esc { font: 8px var(--sans); fill: var(--resp-tenue); }
.resp .mon-trazas .mon-rej { stroke: var(--resp-raya); stroke-width: .7; }
.resp .mon-trazas .mon-sep { stroke: var(--resp-raya); stroke-width: 1; }
.resp .mon-trazas .mon-traza { stroke: var(--resp-curva); stroke-width: 1.4; }
.resp .mon-trazas .resp-area { fill: var(--resp-curva); fill-opacity: .55; stroke: none; }
.resp .mon-trazas .resp-pmax { stroke: var(--resp-alarma); stroke-width: 1.4; }
.resp .mon-trazas .resp-pmax-rot { fill: var(--resp-alarma); font-weight: 700; }
.resp .mon-trazas .resp-peep { stroke: var(--resp-tenue); stroke-width: .9; stroke-dasharray: 3 3; }
.resp .mon-trazas .resp-peep-rot { fill: var(--resp-tenue); }
.resp .mon-trazas .mon-barrido { stroke: var(--resp-tinta); stroke-opacity: .35; }
.resp .mon-trazas .mon-tramo { fill: var(--resp-mando); fill-opacity: .16; stroke: var(--resp-mando); stroke-width: .9; stroke-dasharray: 4 3; }
.resp .mon-trazas .mon-marca { fill: var(--resp-alarma); }
.resp .mon-trazas .mon-marca-txt { font: 700 8px var(--sans); fill: var(--resp-alarma); }
.resp.congelado .resp-curvas::after { content: 'Congelado'; position: absolute; right: 6px; top: 4px; font: 700 .6rem var(--sans); color: var(--resp-fondo); background: var(--resp-tenue); border-radius: 4px; padding: 1px 5px; }
.resp-cas { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 3px; padding: 4px; border-top: 1px solid var(--resp-raya); }
.resp-c { position: relative; display: grid; grid-template-rows: auto 1fr; min-height: 50px; background: var(--resp-blanco); border: 1px solid var(--resp-raya); border-radius: 6px; padding: 2px 4px 2px; cursor: pointer; min-width: 0; text-align: left; font: inherit; color: inherit; }
.resp-c .et { display: flex; justify-content: space-between; gap: 2px; font: 600 .6rem/1.15 var(--sans); color: var(--resp-tenue); white-space: nowrap; min-width: 0; }
.resp-c .et span:first-child { overflow: hidden; text-overflow: ellipsis; color: var(--resp-tinta); }
.resp-c .lim { position: absolute; left: 4px; bottom: 2px; font: .55rem/1.1 var(--sans); color: var(--resp-tenue); display: grid; gap: 1px; }
.resp-c .v { align-self: end; justify-self: end; font: 700 1.25rem/1 var(--sans); font-variant-numeric: tabular-nums; color: var(--resp-tinta); white-space: nowrap; }
.resp-c .sub { position: absolute; right: 4px; top: 13px; font: .55rem/1.1 var(--sans); color: var(--resp-tenue); white-space: nowrap; }
.resp-c.ilu .v { color: var(--resp-tenue); font-weight: 600; }
.resp-c.vacia .v { color: var(--resp-tenue); font-weight: 600; }
.resp-c.al-aviso { background: color-mix(in srgb, var(--resp-aviso) 30%, var(--resp-blanco)); border-color: var(--resp-aviso); }
.resp-c.al-alarma { background: var(--resp-alarma); border-color: var(--resp-alarma); }
.resp-c.al-alarma .v, .resp-c.al-alarma .et span, .resp-c.al-alarma .lim, .resp-c.al-alarma .sub { color: var(--resp-blanco); }
.resp-info { min-height: 18px; padding: 0 6px 3px; font: .64rem/1.3 var(--sans); color: var(--resp-tenue); }
.resp-mandos { display: flex; gap: 4px; overflow-x: auto; scroll-snap-type: x proximity; padding: 4px 4px 2px; border-top: 1px solid var(--resp-raya); scrollbar-width: thin; }
.resp-m { flex: none; scroll-snap-align: start; width: 58px; min-height: 76px; display: grid; justify-items: center; align-content: start; gap: 2px; border: 0; background: none; padding: 0; cursor: pointer; font: inherit; color: var(--resp-tinta); }
.resp-m .rueda { width: 52px; height: 52px; border-radius: 50%; display: grid; place-items: center; background: var(--resp-mando); color: var(--resp-blanco); font: 700 .92rem/1 var(--sans); font-variant-numeric: tabular-nums; box-shadow: inset 0 -3px 0 rgba(0,0,0,.18); }
.resp-m .nom { font: 600 .6rem/1.1 var(--sans); text-align: center; white-space: nowrap; }
.resp-m .nom small { display: block; font-weight: 400; color: var(--resp-tenue); }
.resp-m[aria-pressed="true"] .rueda { outline: 3px solid var(--resp-aviso); outline-offset: 1px; }
.resp-m.apagado { cursor: not-allowed; }
.resp-m.apagado .rueda { background: var(--resp-raya); color: var(--resp-tenue); box-shadow: none; }
.resp-m.ilu .rueda { background: color-mix(in srgb, var(--resp-mando) 55%, var(--resp-blanco)); }
.resp-desl { display: grid; gap: 2px; padding: 4px 8px 6px; background: var(--resp-barra); border-top: 1px solid var(--resp-raya); }
.resp-desl label { display: flex; justify-content: space-between; gap: 6px; font: 600 .74rem/1.2 var(--sans); }
.resp-desl label b { font-size: .95rem; color: var(--resp-mando); }
.resp-desl input { width: 100%; min-height: 32px; accent-color: var(--resp-mando); }
.resp-desl .resp-nota { font: .64rem/1.25 var(--sans); color: var(--resp-tenue); }
.resp-teclas { display: flex; gap: 4px; overflow-x: auto; padding: 4px; border-top: 1px solid var(--resp-raya); scrollbar-width: thin; }
.resp-t { flex: none; min-width: 64px; min-height: 44px; display: grid; justify-items: center; align-content: center; gap: 1px; border: 1px solid var(--resp-raya); border-radius: 8px; background: var(--resp-blanco); color: var(--resp-tinta); font: 600 .6rem/1.1 var(--sans); cursor: pointer; padding: 3px 5px; white-space: nowrap; }
.resp-t .ico { font-size: .9rem; line-height: 1; }
.resp-t[aria-pressed="true"] { background: var(--resp-mando); border-color: var(--resp-mando); color: var(--resp-blanco); }
.resp-t.deco { color: var(--resp-tenue); background: transparent; border-style: dashed; cursor: not-allowed; }
.resp-t.mano { border-color: var(--resp-mando); }
.resp-modos { display: flex; gap: 3px; overflow-x: auto; padding: 4px; background: var(--resp-barra); border-top: 1px solid var(--resp-raya); scrollbar-width: thin; }
.resp-modos button { flex: none; min-height: 44px; padding: 0 9px; border-radius: 8px 8px 0 0; border: 1px solid var(--resp-raya); border-bottom-width: 3px; background: var(--resp-blanco); color: var(--resp-tinta); font: 700 .72rem/1.1 var(--sans); cursor: pointer; white-space: nowrap; }
.resp-modos button[aria-pressed="true"] { border-bottom-color: var(--resp-mando); color: var(--resp-mando); }
.resp-modos button.apagado { color: var(--resp-tenue); background: transparent; border-style: dashed; cursor: not-allowed; font-weight: 600; }
.resp-modos .detener { margin-left: auto; border-radius: 8px; border-color: var(--resp-alarma); color: var(--resp-alarma); }
.resp-modos .detener[aria-pressed="true"] { background: var(--resp-alarma); color: var(--resp-blanco); }
.resp-pie { padding: 3px 6px 5px; font: .6rem/1.3 var(--sans); color: var(--resp-tenue); border-top: 1px solid var(--resp-raya); }
.resp .tope-linea { display: none; }
/* solo lectura (la Mayéutica): sin mandos, teclas ni modos; el velo de «primero predices» tapa entero y la pantalla encoge */
.resp.solo-lectura .resp-mandos, .resp.solo-lectura .resp-desl, .resp.solo-lectura .resp-teclas, .resp.solo-lectura .resp-modos, .resp.solo-lectura .resp-info { display: none; }
.resp:has(> .velo-tapa:not([hidden])) { max-height: 150px; }
.resp > .velo-tapa { background: var(--bg-main); }   /* los avisos van en la barra de alarmas, como en el aparato */
@media (max-width: 370px) { .resp-c .v { font-size: 1.1rem; } .resp-modo { font-size: .9rem; } }
`;

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ADULTO = '<svg class="resp-adulto" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="4" r="3" fill="currentColor"/><path d="M5 19v-7l-2-4 4-2h6l4 2-2 4v7h-3v-5h-4v5z" fill="currentColor"/></svg>';

export function crearRespirador(cont, cfg) {
  instalarMonitor(); instalarMonitorResp(); instalarCss('respirador', RESPIRADOR_CSS);
  const C = cfg.canales || canalesPantalla();
  const porK = Object.fromEntries(C.map((c) => [c.k, c]));
  cont.classList.add('resp');
  cont.innerHTML = `
    <div class="resp-barra">${ADULTO}<span class="resp-modo" data-resp="modo"></span><span class="resp-int">${esc(cfg.interfaz || 'Tubo')}</span>
      <span class="resp-alarma" data-resp="alarma" id="pul-resp-alarma" role="status" aria-live="polite"></span>
      <span class="resp-hora" aria-label="Hora y batería (ilustrativo)">🔕 08:15<br>🔋 100 %</span></div>
    <div class="resp-curvas" data-resp="curvas"><svg id="pul-trazas" class="mon-trazas" role="img" aria-label="Curvas del respirador: presión en la vía aérea con la línea roja de Pmáx y la de PEEP, flujo y volumen"></svg></div>
    <div class="resp-cas" data-resp="casillas"></div>
    <p class="resp-info" data-resp="info"></p>
    <div class="resp-mandos" data-resp="mandos" role="group" aria-label="Mandos del respirador"></div>
    <div class="resp-desl" data-resp="desl" hidden></div>
    <div class="resp-teclas" data-resp="teclas" role="group" aria-label="Teclas del respirador"></div>
    <div class="resp-modos" data-resp="modos" role="group" aria-label="Modos de ventilación"></div>
    <p class="resp-pie">${cfg.pie || ''}</p>`;
  const q = (k) => cont.querySelector(`[data-resp="${k}"]`);
  const svg = cont.querySelector('#pul-trazas');
  const mon = crearMonitor(svg, { canales: C, margen: 26, hueco: 3, borrar: 6 });
  const info = (t) => { q('info').innerHTML = t || ''; };

  // casillas: el esqueleto una vez; casillas(valores) solo cambia texto y clase
  const CAS = cfg.casillas || [];
  q('casillas').innerHTML = CAS.map((c) => `<button type="button" class="resp-c${c.ilu ? ' ilu' : ''}" data-fila="${c.k}" aria-label="${esc(c.et)}"><span class="et"><span>${c.et}</span> <span>${c.u || ''}</span></span> <span class="v">—</span> <span class="sub"></span> <span class="lim"></span></button>`).join('');
  q('casillas').addEventListener('click', (ev) => { const b = ev.target.closest('[data-fila]'); if (b) cfg.alCasilla?.(b.dataset.fila); });
  function casillas(val) {
    for (const c of CAS) {
      const el = q('casillas').querySelector(`[data-fila="${c.k}"]`), d = val[c.k] || {};
      const v = d.v == null || d.v === '' ? '—' : d.v;
      el.querySelector('.v').innerHTML = v; el.querySelector('.sub').innerHTML = d.sub || ''; el.querySelector('.lim').innerHTML = d.lim || '';
      el.classList.toggle('al-aviso', d.estado === 'aviso'); el.classList.toggle('al-alarma', d.estado === 'alarma'); el.classList.toggle('vacia', v === '—');
    }
  }

  // mandos redondos: tocar uno abre su deslizador bajo la fila; tocar otra vez lo cierra
  const MAN = cfg.mandos || [];
  let abierto = null, ultimos = {};
  q('mandos').innerHTML = MAN.map((m) => `<button type="button" class="resp-m${m.ilu ? ' ilu' : ''}" data-rm="${m.k}" aria-pressed="false"><span class="rueda">—</span><span class="nom">${m.et}<small>${m.u || ''}</small></span></button>`).join('');
  function pintarDesl() {
    const d = q('desl'), m = MAN.find((x) => x.k === abierto), v = ultimos[abierto];
    if (!m || !v) { d.hidden = true; d.innerHTML = ''; return; }
    d.hidden = false;
    if (v.apagado) { d.innerHTML = `<label>${m.et}<b>${v.txt ?? v.v ?? '—'}</b></label><span class="resp-nota">${v.apagado}</span>`; return; }
    const min = v.min ?? m.min, max = v.max ?? m.max, paso = v.paso ?? m.paso;
    const k = v.mueve || m.k;
    d.innerHTML = `<label for="pul-rd-${k}">${v.et || m.et}<b>${v.txtDesl ?? v.txt ?? String(v.v).replace('.', ',')} ${v.u ?? m.u ?? ''}</b></label><input type="range" id="pul-rd-${k}" data-rd="${k}" min="${min}" max="${max}" step="${paso}" value="${v.vRango ?? v.v}" aria-label="${esc(v.et || m.et)}"><span class="resp-nota">${v.nota || m.nota || ''}</span>`;
  }
  function mandos(val) {
    ultimos = val;
    for (const m of MAN) {
      const el = q('mandos').querySelector(`[data-rm="${m.k}"]`), d = val[m.k] || {};
      el.querySelector('.rueda').textContent = d.txt ?? (d.v == null ? '—' : String(d.v).replace('.', ','));
      el.classList.toggle('apagado', !!d.apagado); el.setAttribute('aria-pressed', String(abierto === m.k));
      el.setAttribute('aria-label', `${m.et}: ${el.querySelector('.rueda').textContent} ${m.u || ''}${d.apagado ? ' (' + d.apagado + ')' : ''}`);
    }
    // no repintar el deslizador mientras el dedo lo mueve (perdería el arrastre)
    if (!q('desl').contains(document.activeElement)) pintarDesl();
    else { const b = q('desl').querySelector('label b'), d = ultimos[abierto]; if (b && d) b.textContent = `${d.txtDesl ?? d.txt ?? String(d.v).replace('.', ',')} ${d.u ?? MAN.find((x) => x.k === abierto)?.u ?? ''}`; }
  }
  q('mandos').addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-rm]'); if (!b) return;
    abierto = abierto === b.dataset.rm ? null : b.dataset.rm; mandos(ultimos); pintarDesl();
  });
  q('desl').addEventListener('input', (ev) => { const i = ev.target.closest('[data-rd]'); if (i) cfg.alMando?.(i.dataset.rd, +i.value); });

  // teclas
  q('teclas').innerHTML = (cfg.teclas || []).map((t) => `<button type="button" class="resp-t ${t.tipo === 'deco' ? 'deco' : t.tipo === 'tog' ? 'mano' : ''}" data-rt="${t.k}"${t.id ? ` id="${t.id}"` : ''}${t.tipo === 'tog' ? ' aria-pressed="false"' : ''}${t.tipo === 'deco' ? ' aria-disabled="true"' : ''}><span class="ico" aria-hidden="true">${t.ico || ''}</span>${t.et}</button>`).join('');
  q('teclas').addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-rt]'); if (!b) return;
    const t = cfg.teclas.find((x) => x.k === b.dataset.rt);
    if (t.tipo === 'deco') { info(`<b>${t.et}</b>: ${t.nota || 'decorativa: en este modelo no hace nada'} · ilustrativo`); return; }
    cfg.alTecla?.(t.k);
  });
  const tecla = (k, on) => { const b = q('teclas').querySelector(`[data-rt="${k}"]`); if (b) b.setAttribute('aria-pressed', String(!!on)); };

  // modos (pestañas de abajo) y «Detener ventilación»
  q('modos').innerHTML = (cfg.modos || []).map((m) => `<button type="button" data-rmodo="${m.k}" aria-pressed="false"${m.apagado ? ' class="apagado" aria-disabled="true"' : ''}>${m.et}</button>`).join('')
    + `<button type="button" class="detener" data-rmodo="detener" aria-pressed="false">Detener ventilación</button>`;
  q('modos').addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-rmodo]'); if (!b) return;
    const m = (cfg.modos || []).find((x) => x.k === b.dataset.rmodo);
    if (m?.apagado) { info(`<b>${m.et}</b>: ${m.apagado} · ilustrativo`); return; }
    cfg.alModo?.(b.dataset.rmodo);
  });
  function modo(k, { detenido = false } = {}) {
    const m = (cfg.modos || []).find((x) => x.k === k);
    q('modo').textContent = m ? m.et : '';
    q('modos').querySelectorAll('[data-rmodo]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.rmodo === 'detener' ? detenido : b.dataset.rmodo === k)));
  }

  function alarmas(lista) {
    const el = q('alarma');
    const orden = [...lista].sort((a, b) => (a.nivel === 'alarma' ? 0 : 1) - (b.nivel === 'alarma' ? 0 : 1));
    const h = orden.slice(0, 1).map((a) => `<span class="al al-${a.nivel}">🔔 ${a.texto}</span>`).join('') + (orden.length > 1 ? `<span class="al al-mas">+${orden.length - 1}</span>` : '');
    if (el.dataset.h !== h) { el.dataset.h = h; el.innerHTML = h || 'Sin alarmas'; }
  }

  // el área rellena de cada curva, de la curva a su cero (como la pantalla real)
  function pintarCurvas() {
    mon.pintar();
    for (const c of C) {
      if (!mon.visible(c.k)) continue;
      const g = mon.fondo(c.k); if (!g) continue;
      const b = mon.dato(c.k), y0 = f1(mon.yDe(c.k, c.base0 ?? 0)); let d = '', ini = -1;
      for (let i = 0; i <= b.length; i++) {
        const v = b[i];
        if (v == null || i === b.length) { if (ini >= 0) d += `L${mon.x(i - 1)} ${y0}Z`; ini = -1; continue; }
        const y = f1(mon.yDe(c.k, v));
        if (ini < 0) { ini = i; d += `M${mon.x(i)} ${y0}L${mon.x(i)} ${y}`; } else d += `L${mon.x(i)} ${y}`;
      }
      let p = g.querySelector('.resp-area'); if (!p) { p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('class', 'resp-area'); g.appendChild(p); }
      p.setAttribute('d', d);
    }
  }
  return {
    el: cont, mon, curvas: q('curvas'), montar: () => mon.montar(), pintarCurvas, casillas, mandos, modo, alarmas, tecla, info,
    congelado: (on) => cont.classList.toggle('congelado', !!on),
    soloLectura: (on) => cont.classList.toggle('solo-lectura', !!on),
    ver: (lista) => { mon.ver(lista); },
    cerrarMando: () => { abierto = null; mandos(ultimos); },
    porK,
  };
}
