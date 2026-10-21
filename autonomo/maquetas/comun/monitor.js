// El monitor de cabecera: UNA pieza para todas las maquetas (maqueta; pensada para pasar a js/core/monitor-uci.js).
// La usan la cabecera del shock (lee el motor del latido), el corazón eléctrico (lee su grafo de conducción, con el papel
// milimetrado del ECG) y el receptor vivo (lee efecto()). La pieza no calcula nada: dibuja lo que le dan.
//
//   crearMonitor(svg, { canales, margen, hueco, borrar, prefijo })
//     canales: [{ k, rot, alto, col, ...escala }] apilados en un solo SVG; cada canal es un <g id="<prefijo><k>"> con su
//     origen arriba a la izquierda (coordenadas locales 0..alto), así que lo que se pinte encima usa sus propias y.
//     escala: y(v) propia | base y gan (formas sin unidad: y = alto·base − v·alto·gan) | min y max (presiones).
//     Extras del canal: marcas (rejilla con su cifra en el margen), lineas ([{ k, v, clase, rot }]: el 65, la PAM;
//     v puede ser una función), papel ({ mm, base }: el papel milimetrado del ECG, 1 mm y 5 mm) y ref (una 2.ª curva
//     punteada, la de «sin balón»).
//   → montar(), ver(lista), rotulo(k, txt), empujar(valores), llenar(fn), pintar(), capa(k), fondo(k), dato(nombre),
//     yDe(k, v), x(i), altoDe(k), NP, cursor
//     empujar: { <k>: valor, <k>Ref: valor, …otros } — lo que no es un canal se guarda tal cual (dato('t'), dato('r')).
//   pintarCifras(el, celdas, { tapado })  la columna de cifras: { k, canal, cls, et, u, v, obj, marca, estado, alto }
//   ecgLatido(t, T, pr)  un latido de ECG ilustrativo (P, QRS, T) para los monitores que no generan el suyo
//   MONITOR_CSS, instalarMonitor()
import { instalarCss } from './dibujo-iso.js';

const f1 = (n) => Math.round(n * 10) / 10;
const g = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s));

// Un latido de ECG ilustrativo: P antes del QRS, QRS a los «pr» s del inicio del ciclo y T en la repolarización.
// T: el periodo (s). Las ondas se estrechan con la frecuencia (raíz del periodo, como el QT).
export function ecgLatido(t, T, pr = 0.16) {
  const k = Math.sqrt(T / (60 / 70));
  return 0.12 * g(t, pr - 0.11 * k, 0.022) - 0.1 * g(t, pr - 0.012, 0.006) + 1.0 * g(t, pr + 0.008, 0.009) - 0.23 * g(t, pr + 0.028, 0.008) + 0.27 * g(t, pr + 0.27 * k, 0.05 * k);
}

export function crearMonitor(svg, { canales, margen = 26, hueco = 4, borrar = 6, prefijo = 'tr-', anchoMin = 160 } = {}) {
  const C = canales.map((c) => ({ ...c }));
  const porK = Object.fromEntries(C.map((c) => [c.k, c]));
  const visibles = new Set(C.filter((c) => !c.oculto).map((c) => c.k));
  let W = 250, NP = 220, cursor = 0, alto = 0, buf = {}, otros = {};
  const yLocal = (c, v) => {
    if (c.y) return c.y(v);
    if (c.base != null) return c.alto * c.base - v * c.alto * (c.gan ?? 0.6);
    const t = Math.max(0, Math.min(1, (v - c.min) / ((c.max - c.min) || 1)));
    return c.alto - t * c.alto;
  };
  function montar() {
    W = Math.max(anchoMin, Math.round(svg.getBoundingClientRect().width || svg.parentNode?.clientWidth || 250));
    let y = 2, h = '';
    for (const c of C) {
      c.vis = visibles.has(c.k);
      if (!c.vis) continue;
      c.y0 = y;
      h += `<g id="${prefijo}${c.k}" class="mon-canal" transform="translate(0 ${y})">`;
      if (c.papel) {   // 1 mm y 5 mm (0,04 s y 0,1 mV a 25 mm/s y 10 mm/mV)
        const { mm, base } = c.papel;
        for (let x = margen, i = 0; x < W; x += mm, i++) h += `<line x1="${f1(x)}" y1="0" x2="${f1(x)}" y2="${c.alto}" class="mon-papel${i % 5 ? '' : ' fuerte'}"/>`;
        for (let yy = base, i = 0; yy < c.alto; yy += mm, i++) h += `<line x1="${margen}" y1="${f1(yy)}" x2="${W}" y2="${f1(yy)}" class="mon-papel${i % 5 ? '' : ' fuerte'}"/>`;
        for (let yy = base - mm, i = 1; yy > 0; yy -= mm, i++) h += `<line x1="${margen}" y1="${f1(yy)}" x2="${W}" y2="${f1(yy)}" class="mon-papel${i % 5 ? '' : ' fuerte'}"/>`;
      }
      if (c.marcas) for (const m of c.marcas) { const yy = f1(yLocal(c, m)); h += `<line x1="${margen}" x2="${W}" y1="${yy}" y2="${yy}" class="mon-rej"/>` + (margen >= 18 && yy > 13 ? `<text x="${margen - 2}" y="${f1(yy + 3)}" class="mon-esc" text-anchor="end">${m}</text>` : ''); }
      for (const l of c.lineas || []) h += `<line data-linea="${l.k}" x1="${margen}" x2="${W}" class="${l.clase || 'mon-65'}"/>` + (l.rot && margen >= 18 ? `<text data-linea-rot="${l.k}" x="${margen - 3}" class="mon-esc ${l.clase || 'mon-65'}-rot" text-anchor="end">${l.rot}</text>` : '');
      h += `<g data-capa="fondo"></g>`;
      if (c.ref) h += `<path data-ref class="mon-ref"/>`;
      h += `<path data-traza class="mon-traza" stroke="${c.col}"/><g data-capa="encima"></g>`;
      const rot = c.rotTxt ?? c.rot;
      if (margen >= 18) h += `<text x="2" y="9" class="mon-rot" fill="${c.col}">${rot}</text>`;
      else h += `<rect x="0" y="0" width="${String(rot).length * 6 + 8}" height="12" class="mon-rot-caja"/><text x="3" y="9.5" class="mon-rot" fill="${c.col}">${rot}</text>`;
      h += `<line x1="0" x2="${W}" y1="${c.alto + 1}" y2="${c.alto + 1}" class="mon-sep"/></g>`;
      y += c.alto + hueco;
    }
    alto = Math.max(4, y - hueco + 2);
    svg.setAttribute('viewBox', `0 0 ${W} ${alto}`);
    svg.style.height = alto + 'px';
    svg.innerHTML = h + `<line class="mon-barrido" x1="0" x2="0" y1="0" y2="${alto}"/>`;
    NP = W - margen; cursor = 0; buf = {}; otros = {};
    for (const c of C) { buf[c.k] = new Array(NP).fill(null); buf[c.k + 'Ref'] = new Array(NP).fill(null); }
  }
  function empujar(v) {
    for (const [k, val] of Object.entries(v)) {
      if (buf[k]) buf[k][cursor] = val ?? null;
      else (otros[k] ||= new Array(NP).fill(null))[cursor] = val;
    }
    cursor = (cursor + 1) % NP;
    for (let j = 0; j < borrar; j++) { const i = (cursor + j) % NP; for (const a of Object.values(buf)) a[i] = null; for (const a of Object.values(otros)) a[i] = null; }
  }
  // Llena la pantalla de golpe (al cambiar de paciente, en pausa o con «reducir movimiento»): fn(i) → valores
  function llenar(fn) { cursor = 0; for (let i = 0; i < NP; i++) { const v = fn(i); for (const [k, val] of Object.entries(v)) { if (buf[k]) buf[k][i] = val ?? null; else (otros[k] ||= new Array(NP).fill(null))[i] = val; } } cursor = 0; }
  const camino = (b, c) => { let d = '', pluma = false; for (let x = 0; x < NP; x++) { const v = b[x]; if (v == null) { pluma = false; continue; } d += (pluma ? 'L' : 'M') + (x + margen) + ' ' + f1(yLocal(c, v)); pluma = true; } return d; };
  function pintar() {
    for (const c of C) {
      if (!c.vis) continue;
      const gc = svg.querySelector(`#${prefijo}${c.k}`); if (!gc) continue;
      gc.querySelector('[data-traza]').setAttribute('d', camino(buf[c.k], c));
      const r = gc.querySelector('[data-ref]'); if (r) r.setAttribute('d', camino(buf[c.k + 'Ref'], c));
      // las líneas de referencia (y sus rótulos, que no se pisan)
      const ls = (c.lineas || []).map((l) => ({ l, y: yLocal(c, typeof l.v === 'function' ? l.v() : l.v) }));
      for (const { l, y } of ls) { const el = gc.querySelector(`[data-linea="${l.k}"]`); if (el) { el.setAttribute('y1', f1(y)); el.setAttribute('y2', f1(y)); el.toggleAttribute('hidden', !isFinite(y)); } }
      const rots = ls.filter(({ l }) => l.rot).sort((a, b) => a.y - b.y);
      let previo = -99;
      for (const it of rots) { const el = gc.querySelector(`[data-linea-rot="${it.l.k}"]`); if (!el) continue; const yy = Math.max(it.y + 3, previo + 10); el.setAttribute('y', f1(yy)); previo = yy; }
    }
    const br = svg.querySelector('.mon-barrido'); if (br) { const x = margen + ((cursor - 1 + NP) % NP); br.setAttribute('x1', x); br.setAttribute('x2', x); }
  }
  return {
    montar, empujar, llenar, pintar,
    ver(lista) { visibles.clear(); for (const k of lista) visibles.add(k); montar(); },
    rotulo(k, txt) { if (porK[k]) porK[k].rotTxt = txt; montar(); },
    capa: (k) => svg.querySelector(`#${prefijo}${k} [data-capa="encima"]`),
    fondo: (k) => svg.querySelector(`#${prefijo}${k} [data-capa="fondo"]`),
    dato: (nombre) => buf[nombre] || otros[nombre] || [],
    yDe: (k, v) => yLocal(porK[k], v),
    x: (i) => margen + i,
    altoDe: (k) => (porK[k] ? porK[k].alto + hueco : 0),
    visible: (k) => visibles.has(k),
    get NP() { return NP; }, get cursor() { return cursor; }, get W() { return W; }, get alto() { return alto; },
  };
}

// La columna de cifras. celda: { k (data-fila), cls (color del canal), et, u, v (html), obj (html), marca (html, en
// lugar de la unidad), estado ('si' | 'no' | 'ojo': el color del valor), alto (px, para alinear con su curva) }
export function pintarCifras(el, celdas, { tapado = false } = {}) {
  el.innerHTML = celdas.map((c) => `<div class="cifra ${c.cls || ''} ${tapado ? 'oculto' : c.estado || ''}" data-fila="${c.k}"${c.alto ? ` style="height:${c.alto}px"` : ''}>`
    + `<span class="et"><span>${c.et}</span><span>${tapado ? '' : c.marca || c.u || ''}</span></span>`
    + `<span class="v">${tapado ? '?' : c.v}</span>${c.obj != null ? `<span class="obj">${tapado ? '' : c.obj}</span>` : ''}</div>`).join('');
}

export const MONITOR_CSS = `
.monitor { --mon-cifras: 92px; --mon-v: 1rem; border: 1px solid var(--border-color); border-radius: 12px; background: var(--bg-main); padding: 4px 5px 5px; display: grid; gap: 3px; position: relative; }
.monitor > * { min-width: 0; }
.mon-cab { display: flex; align-items: center; justify-content: space-between; gap: 6px; min-height: 30px; font: 600 .64rem/1.2 var(--sans); color: var(--text-muted); letter-spacing: .04em; text-transform: uppercase; padding: 0 2px; }
.mon-cuerpo { display: grid; grid-template-columns: minmax(0, 1fr) var(--mon-cifras); }
.mon-trazas { display: block; width: 100%; }
.mon-trazas .mon-rot { font: 600 9px var(--sans); }
.mon-trazas .mon-rot-caja { fill: var(--bg-main); fill-opacity: .85; }
.mon-trazas .mon-esc { font: 8px var(--sans); fill: var(--text-muted); }
.mon-trazas .mon-rej { stroke: color-mix(in srgb, var(--text-muted) 22%, transparent); stroke-width: .5; }
.mon-trazas .mon-papel { stroke: var(--accent-red); stroke-opacity: .1; stroke-width: 1; }
.mon-trazas .mon-papel.fuerte { stroke-opacity: .26; }
.mon-trazas .mon-sep { stroke: color-mix(in srgb, var(--accent-yellow) 16%, transparent); stroke-width: .6; }
.mon-trazas .mon-65 { stroke: var(--accent-red); stroke-dasharray: 3 4; stroke-width: .8; opacity: .8; }
.mon-trazas .mon-65-rot { fill: var(--accent-red); }
.mon-trazas .mon-pam { stroke: var(--accent-yellow); stroke-width: .8; opacity: .6; }
.mon-trazas .mon-pam-rot { fill: var(--accent-yellow); }
.mon-trazas .mon-traza { fill: none; stroke-width: 1.5; stroke-linejoin: round; }
.mon-trazas .mon-ref { fill: none; stroke: var(--text-dim); stroke-width: 1; stroke-dasharray: 2 2.5; }
.mon-trazas .mon-barrido { stroke: color-mix(in srgb, var(--text-main) 45%, transparent); stroke-width: 1.4; }
.cifras { display: flex; flex-direction: column; border-left: 1px solid color-mix(in srgb, var(--accent-yellow) 18%, transparent); min-width: 0; }
.cifra { flex: 1 1 auto; overflow: hidden; display: grid; align-content: center; padding: 1px 0 1px 6px; min-width: 0; border-bottom: 1px solid color-mix(in srgb, var(--accent-yellow) 12%, transparent); cursor: pointer; }
.cifra:last-child { border-bottom: 0; }
.cifra .et { font: 600 .58rem/1.1 var(--sans); letter-spacing: .02em; display: flex; justify-content: space-between; gap: 2px; white-space: nowrap; }
.cifra .v { font: 700 var(--mon-v)/1.05 var(--sans); font-variant-numeric: tabular-nums; white-space: nowrap; color: var(--text-main); }
.cifra .v small { font-size: .62rem; font-weight: 600; margin-left: 2px; }
.cifra .obj { font: .56rem/1.15 var(--sans); color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.c-ecg { color: var(--accent-green); } .c-art { color: var(--accent-red); } .c-pap { color: var(--accent-yellow); } .c-pvc { color: var(--accent-purple); }
.c-sat { color: var(--accent-yellow); } .c-co2 { color: var(--accent-blue); } .c-resp { color: var(--text-dim); }
.cifra.c-ecg .v { color: var(--accent-green); } .cifra.c-art .v { color: var(--accent-red); } .cifra.c-pap .v, .cifra.c-sat .v { color: var(--accent-yellow); }
.cifra.no .v { color: var(--accent-red); } .cifra.si .v { color: var(--accent-green); } .cifra.ojo .v { color: var(--accent-yellow); }
.cifra.oculto .v { color: var(--text-muted); }
.marca { font: 700 .62rem var(--sans); border-radius: 4px; padding: 0 3px; }
.marca.si { color: var(--bg-main); background: var(--accent-green); } .marca.no { color: var(--text-main); background: var(--accent-red); } .marca.sin { color: var(--bg-main); background: var(--text-muted); }
`;
export const instalarMonitor = () => instalarCss('monitor', MONITOR_CSS);
