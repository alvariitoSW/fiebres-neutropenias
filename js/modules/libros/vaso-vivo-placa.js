// La arteria que se tapa (lupa «placa» del vaso vivo): la Fig. 20.1 de Marino viva, en 4 tiempos, y el reloj «horas
// desde el dolor». Solo dibujo: los datos y las reglas están en js/data/vaso-vivo-data-sca.js.
// Fuente: docs/marino-2024-cardiac-disorders-caps18-21.pdf, PDF p. 38-41 (Fig. 20.1 en la 39) y p. 43 (lisis, 12 h).
// Una arteria cualquiera con una rama (las placas que se rompen están en las bifurcaciones, p. 38): no es un árbol
// coronario, ni una angiografía (eso es de otra pieza). El tamaño del trombo de cada oclusión es ilustrativo (la ficha
// no da un %). Rótulos ≥ 10 de cuerpo (a 360 px, ≥ 8 px en pantalla).
import { svgParticula } from '../../core/particulas.js';
import { RELOJ, OCLUSIONES } from '../../data/vaso-vivo-data-sca.js';

const n2 = x => +(+x).toFixed(2);
const P = (k, x, y, r, o = {}) => svgParticula(k, x, y, r, o);
function tx(x, y, t, { s = 10, c = 'text-dim', a = 'start', b = false, id = '' } = {}) {
    s = Math.max(10, s);
    return `<text${id ? ` id="${id}"` : ''} x="${n2(x)}" y="${n2(y)}" font-size="${s}" text-anchor="${a}" style="fill:var(--${c});font-family:system-ui,sans-serif${b ? ';font-weight:700' : ''};paint-order:stroke;stroke:var(--bg-main);stroke-width:2.6;stroke-linejoin:round">${t}</text>`;
}
const mezcla = (c, p) => `color-mix(in srgb, var(--${c}) ${p}%, var(--bg-main))`;

// Geometría: arriba el reloj (y 34-110); la luz va de y 136 a 226; la placa, en la pared de abajo (x 112-236), justo antes de la rama (x 238-270)
const A = { x0: 0, x1: 360, top: [120, 136], luz: [136, 226], bot: [226, 242], rama: [238, 270], placa: [112, 236], cima: 190, rotura: [168, 188] };
// Hasta dónde sube el trombo en cada oclusión (y del borde de arriba; ilustrativo)
const TECHO = { completa: A.luz[0], parcial: 170, intermitente: 182 };
const domo = x => { const [a, b] = A.placa, u = (x - a) / (b - a); return u <= 0 || u >= 1 ? A.luz[1] : A.luz[1] - (A.luz[1] - A.cima) * Math.sin(u * Math.PI) ** 0.8; };

function arteria() {
    const [r0, r1] = A.rama;
    let h = `<rect x="0" y="${A.luz[0]}" width="360" height="${A.luz[1] - A.luz[0]}" style="fill:${mezcla('accent-red', 14)}"/>`;
    // la rama: un tubo que baja hacia la derecha desde la pared de abajo (sus paredes, por fuera de su luz)
    const dx = 34, y1 = 286;
    h += `<path d="M${r0} ${A.luz[1]}L${r0 + dx} ${y1}H${r1 + dx}L${r1} ${A.luz[1]}Z" style="fill:${mezcla('accent-red', 14)}"/>`;
    h += `<path d="M${r0 - 8} ${A.bot[0] + 2}L${r0 + dx - 9} ${y1}M${r1 + 8} ${A.bot[0] + 2}L${r1 + dx + 8} ${y1}" style="fill:none;stroke:${mezcla('accent-red', 55)}" stroke-width="16"/>`;
    h += `<path d="M${r0} ${A.bot[0]}L${r0 + dx} ${y1}M${r1} ${A.bot[0]}L${r1 + dx} ${y1}" style="fill:none;stroke:var(--accent-red)" stroke-width="1.2" opacity=".7"/>`;
    h += `<rect x="0" y="${A.top[0]}" width="360" height="${A.top[1] - A.top[0]}" style="fill:${mezcla('accent-red', 55)}"/>`;
    h += `<path d="M0 ${A.bot[0]}H${r0}V${A.bot[1]}H0Z M${r1} ${A.bot[0]}H360V${A.bot[1]}H${r1}Z" style="fill:${mezcla('accent-red', 55)}"/>`;
    h += `<path d="M0 ${A.top[1]}H360M0 ${A.bot[0]}H${r0}M${r1} ${A.bot[0]}H360" style="fill:none;stroke:var(--accent-red)" stroke-width="1.2" opacity=".7"/>`;
    return h;
}
function placa(t) {
    const [a, b] = A.placa, [g0, g1] = A.rotura, pts = [];
    for (let x = a; x <= b; x += 4) pts.push(`${x} ${n2(domo(x))}`);
    let h = `<path d="M${pts.join('L')}Z" style="fill:${mezcla('accent-yellow', 38)}"/>`;
    // el núcleo de lípidos: rizos dorados
    for (let i = 0; i < 9; i++) { const x = a + 22 + i * 10.5, y = A.luz[1] - 9 - (i % 3) * 6; h += `<path d="M${x} ${y}q3 -4 6 0t6 0" style="fill:none;stroke:var(--accent-yellow)" stroke-width="1.3"/>`; }
    // la capa que lo cubre: entera en el tiempo 1; rota (un hueco) desde el 2
    const capa = (x0, x1) => { const p = []; for (let x = x0; x <= x1; x += 3) p.push(`${n2(x)} ${n2(domo(x) - 1)}`); return `<path d="M${p.join('L')}" style="fill:none;stroke:var(--text-main)" stroke-width="2.6" stroke-linecap="round"/>`; };
    h += t === 1 ? capa(a, b) : capa(a, g0) + capa(g1, b);
    return h;
}
function lipidosFuera(conRotulo) {
    let h = '';
    const [g0, g1] = A.rotura;
    for (let i = 0; i < 7; i++) { const x = g0 - 8 + i * 5.5, y = domo(x) - 8 - (i % 3) * 7; h += `<path d="M${n2(x)} ${n2(y)}q3 -4 6 0t6 0" style="fill:none;stroke:var(--accent-yellow)" stroke-width="1.5"/>`; }
    return `<g id="vso-pl-lipidos">${h}${!conRotulo ? '' : tx((g0 + g1) / 2 - 20, A.cima - 40, 'lípidos trombogénicos', { c: 'accent-yellow', a: 'middle', b: true })}<path d="M${(g0 + g1) / 2 - 8} ${A.cima - 36}L${(g0 + g1) / 2} ${A.cima - 18}" style="stroke:var(--accent-yellow)" stroke-width=".9"/></g>`;
}
function mpo() {
    const x = 204, y = 170;
    let h = P('neutrofilo', x, y, 10);
    for (let i = 0; i < 4; i++) h += `<circle cx="${n2(x - 12 - i * 6)}" cy="${n2(y + 8 + i * 3)}" r="1.8" style="fill:var(--accent-green)"/>`;
    h += tx(x + 14, y - 6, 'leucocito', { c: 'text-main' }) + tx(x + 14, y + 8, 'MPO → hipoclorito', { c: 'accent-green', b: true }) + tx(x + 14, y + 21, '(la lejía)', { c: 'text-dim' });
    return `<g id="vso-pl-mpo">${h}</g>`;
}
// El trombo: agregado de plaquetas, hilos de fibrina y hematíes atrapados; sube hasta TECHO[ocl]
function trombo(ocl) {
    const techo = TECHO[ocl], x0 = 134, x1 = 222;
    let h = `<path d="M${x0} ${n2(domo(x0))}C${x0 - 4} ${techo + 10} ${x0 + 8} ${techo} ${x0 + 24} ${techo}H${x1 - 24}C${x1 - 8} ${techo} ${x1 + 4} ${techo + 10} ${x1} ${n2(domo(x1))}Z" style="fill:${mezcla('accent-red', 40)};stroke:var(--accent-red)" stroke-width="1"/>`;
    for (let i = 0; i < 16; i++) { const x = x0 + 10 + (i * 37) % (x1 - x0 - 20), lo = domo(x) - 6, y = techo + 6 + ((i * 23) % Math.max(6, lo - techo - 8)); h += P('plaquetaActiva', x, y, 3.2); }
    for (let i = 0; i < 5; i++) { const x = x0 + 16 + i * 15, y = techo + 10 + (i % 2) * 10; h += `<path d="M${x} ${y}q8 ${6 + i} 16 ${2 - i}" style="fill:none;stroke:var(--accent-yellow)" stroke-width="1.6" stroke-linecap="round"/>`; }
    for (let i = 0; i < 3; i++) h += P('rbc', x0 + 26 + i * 18, Math.max(techo + 12, domo(x0 + 26 + i * 18) - 14), 4.2);
    const nombre = ocl === 'completa' ? 'trombo oclusivo' : ocl === 'parcial' ? 'trombo a medias' : 'se cierra y se abre';
    h += (ocl === 'completa' ? tx(296, A.luz[0] + 22, nombre, { c: 'text-main', a: 'middle', b: true }) : tx((x0 + x1) / 2, techo - 6, nombre, { c: 'text-main', a: 'middle', b: true }));
    return `<g id="vso-pl-trombo" data-techo="${techo}">${h}</g>`;
}
// El reloj «horas desde el dolor»: una regla de 0 a 24 h con sus carriles (cada uno, un antes y un después de su
// hora). Lo comparte la trombólisis (5c): svgReloj(horas, [carril…]).
const RX = h => 40 + (h / RELOJ.max) * 300;
export function svgReloj(horas, carriles, y0 = 34) {
    let h = `<g id="vso-reloj-svg">${tx(40, y0, 'horas desde el dolor', { c: 'text-muted' })}`;
    const yR = y0 + 14;
    h += `<path d="M${RX(0)} ${yR}H${RX(RELOJ.max)}" style="stroke:var(--border-color)" stroke-width="2"/>`;
    for (const m of [0, 3, 12, 24]) h += `<path d="M${RX(m)} ${yR - 4}V${yR + 4}" style="stroke:var(--text-muted)" stroke-width="1.2"/>${tx(RX(m), yR + 15, `${m} h`, { c: m === 3 || m === 12 ? 'text-main' : 'text-muted', a: 'middle' })}`;
    carriles.forEach((c, i) => {
        const y = yR + 30 + i * 22, xc = RX(c.hora);
        h += tx(4, y + 4, c.etq, { c: 'text-muted' });
        h += `<rect x="${RX(0)}" y="${y - 6}" width="${n2(xc - RX(0))}" height="12" rx="3" style="fill:${mezcla(c.antesColor, 30)}"/><rect x="${n2(xc)}" y="${y - 6}" width="${n2(RX(RELOJ.max) - xc)}" height="12" rx="3" style="fill:${mezcla(c.despuesColor, 30)}"/>`;
        const enDespues = horas >= c.hora;
        h += tx(enDespues ? (xc + RX(RELOJ.max)) / 2 : (RX(0) + xc) / 2, y + 4, enDespues ? c.despues : c.antes, { c: 'text-main', a: 'middle', b: true });
    });
    const xa = RX(horas), yb = yR + 30 + carriles.length * 22 - 12;
    h += `<path id="vso-reloj-aguja" d="M${n2(xa)} ${yR - 8}V${yb}" style="stroke:var(--text-main)" stroke-width="2"/><circle cx="${n2(xa)}" cy="${yR}" r="4.5" style="fill:var(--text-main)"/>`;
    return h + '</g>';
}
// Los carriles del reloj en la placa: la hs-cTn (desde 3 h; en la angina inestable la ficha no lo dice) y la lisis (12 h)
function carrilesPlaca(e) {
    const c = [];
    if (e.ocl !== 'intermitente') c.push({ etq: 'hs-cTn', hora: RELOJ.tropo, antes: 'aún no', despues: '>p99', antesColor: 'text-muted', despuesColor: 'accent-red' });
    c.push(e.ocl === 'completa'
        ? { etq: 'lisis', hora: RELOJ.lisis, antes: 'sirve', despues: 'sin beneficio', antesColor: 'accent-green', despuesColor: 'accent-red' }
        : { etq: 'lisis', hora: 0, antes: '', despues: 'sin beneficio en el SCASEST', antesColor: 'text-muted', despuesColor: 'text-muted' });
    return c;
}

// La lámina entera de la placa (la llama construir() de la escena)
export function svgPlaca(e) {
    const t = e.t, O = OCLUSIONES[e.ocl];
    let h = '<rect width="360" height="360" style="fill:var(--bg-main)"/>';
    h += `<g id="vso-pl-bif">${arteria()}${tx(A.rama[1] + 48, 274, 'rama', { c: 'text-muted' })}</g>`;
    h += placa(t) + tx(A.placa[0] - 4, A.bot[1] + 16, 'placa en una bifurcación', { c: 'text-dim' });
    h += '<g id="vso-pl-flujo"></g>';
    if (t >= 3) h += lipidosFuera(t === 3);
    if (t === 2 || t === 3) h += mpo();
    if (t === 3) for (let i = 0; i < 4; i++) h += P('plaquetaActiva', 160 + i * 9, domo(160 + i * 9) - 18 - (i % 2) * 8, 3.4);
    if (t === 4) h += trombo(e.ocl);
    h += tx(8, A.luz[0] + 14, 'flujo →', { c: 'text-muted' });
    if (t === 4 && e.ocl === 'completa') h += tx(296, A.luz[0] + 44, 'sin flujo', { c: 'accent-red', a: 'middle', b: true });
    // cabecera: el tiempo y, en el 4, el síndrome y su ECG
    h += tx(8, 18, `tiempo ${t} de 4 · ${['la placa', 'se rompe', 'salen los lípidos', 'el trombo'][t - 1]}`, { c: 'accent-yellow', b: true });
    if (t === 4) h += tx(352, 18, `${O.corto} · ${O.ecg}`, { c: e.ocl === 'completa' ? 'accent-red' : 'text-main', a: 'end', b: true, id: 'vso-pl-ecg' });
    h += svgReloj(t === 4 ? e.horas : 0, t === 4 ? carrilesPlaca(e) : []);
    if (t < 4) h += tx(180, 88, 'el reloj empieza con el trombo (el dolor)', { c: 'text-muted', a: 'middle' });
    return h;
}

// La sangre que corre: hematíes por la luz; se paran contra el trombo oclusivo, se estrechan en el parcial y, a ratos,
// pasan o no. El trombo intermitente crece y mengua (atributo transform: un número de 0 a 1).
const flujo = { els: [], ph: 0 };
export function crearFlujoPlaca(svg, e) {
    const g = svg.querySelector('#vso-pl-flujo'); flujo.els = []; flujo.e = e;
    if (!g) return;
    let s = '';
    for (let i = 0; i < 12; i++) s += `<g>${P('rbc', 0, 0, 4.2)}</g>`;
    g.innerHTML = s;
    flujo.els = [...g.children].map((el, i) => ({ el, x: (i * 31) % 380 - 10, lane: A.luz[0] + 10 + (i * 13) % 70 }));
    moverPlaca(0);
}
export function moverPlaca(dt) {
    const e = flujo.e; if (!e) return;
    flujo.ph += dt;
    const t4 = e.t === 4, abierto = !t4 || e.ocl === 'parcial' || (e.ocl === 'intermitente' && Math.sin(flujo.ph * 1.4) > 0);
    const tr = document.getElementById('vso-pl-trombo');
    if (tr && e.ocl === 'intermitente') { const k = n2(0.35 + 0.65 * (0.5 - 0.5 * Math.sin(flujo.ph * 1.4))); tr.setAttribute('transform', `translate(0 ${A.luz[1]}) scale(1 ${k}) translate(0 ${-A.luz[1]})`); }
    for (const p of flujo.els) {
        const tope = t4 && !abierto ? 126 : 999;
        const v = t4 && e.ocl === 'parcial' && p.x > 120 && p.x < 230 ? 26 : 60;
        p.x = Math.min(tope - (p.lane % 5) * 3, p.x + v * dt);
        if (p.x > 370) p.x -= 390;
        let y = p.lane;
        const techo = t4 ? TECHO[e.ocl] : A.cima;
        if (p.x > 120 && p.x < 230) { const lo = Math.min(domo(p.x), t4 ? techo : 999) - 6; if (y > lo) y = A.luz[0] + 6 + (p.lane - A.luz[0] - 10) * Math.max(0, lo - A.luz[0] - 12) / 70; }
        const parado = t4 && e.ocl === 'completa' && p.x > 230;
        p.el.setAttribute('transform', `translate(${n2(p.x)} ${n2(y)})`);
        p.el.setAttribute('opacity', parado ? '0' : '1');
    }
}
