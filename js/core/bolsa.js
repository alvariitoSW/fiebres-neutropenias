// La bolsa (pieza común del bloque 2): el dibujo de un hemoderivado que gotea en un modelo vivo. Una sola pieza para
// el capilar vivo (el concentrado de hematíes) y el vaso que sangra (plaquetas, plasma, crio, CCP4F, fibrinógeno).
// Las cifras de cada producto viven una sola vez en js/data/hemoderivados-data.js: aquí solo se dibujan.
//
// svgBolsa(tipo, opciones) devuelve el SVG (texto) de la bolsa o el frasco, con su rótulo: la identidad nunca va solo
// por color (CLAUDE §5). Opciones:
//   x, y      dónde va el centro de la boca de la bolsa (arriba)        escala  tamaño (1 = 22 × 28 de bolsa)
//   id        id del grupo (la gota lleva `${id}-gota` para moverla)     tubo    largo del tubo de goteo
//   rotulo    'izq' | 'der' | false: a qué lado van el nombre y el volumen
//   unidades  el número delante del nombre («1 CH»)                     gota    0-1: dónde va la gota en el tubo (null: sin gota)
// moverGota(svg, id, u) mueve la gota (u de 0 a 1) sin repintar la bolsa.
import { HEMODERIVADOS } from '../data/hemoderivados-data.js';

const n2 = x => +x.toFixed(2);
const T = (x, y, t, { a = 'start', s = 8.5, c = '--text-main', b = false } = {}) =>
    `<text x="${n2(x)}" y="${n2(y)}" text-anchor="${a}" style="font-size:${s}px;fill:var(${c});font-family:system-ui, sans-serif;${b ? 'font-weight:700;' : ''}">${t}</text>`;

export function svgBolsa(tipo, { x = 0, y = 0, escala = 1, id = '', tubo = 44, rotulo = 'izq', unidades = 1, gota = null } = {}) {
    const p = HEMODERIVADOS[tipo];
    if (!p) throw new Error(`Hemoderivado sin datos: ${tipo}`);
    const col = `var(${p.color})`;
    let s = '';
    if (p.envase === 'frasco') {
        // frasco de polvo liofilizado: tapón, cuello y cuerpo; el polvo, abajo
        s += `<rect x="-6" y="0" width="12" height="5" rx="1.5" style="fill:var(--text-muted)"/>`;
        s += `<path d="M-4 5V9Q-10 11 -10 16V30Q-10 33 -7 33H7Q10 33 10 30V16Q10 11 4 9V5Z" style="fill:var(--bg-main);stroke:${col};stroke-width:1.3"/>`;
        s += `<rect x="-8.5" y="22" width="17" height="9.5" rx="2" style="fill:${col};opacity:.55"/>`;
        s += `<path d="M0 33V${n2(33 + tubo * 0.6)}" style="stroke:var(--text-muted);stroke-width:1.1;stroke-dasharray:2 2"/>`;
    } else {
        // bolsa: el ojal para colgarla, el cuerpo y el contenido; abajo, la cámara de goteo y el tubo
        s += `<circle cx="0" cy="2.5" r="1.8" style="fill:none;stroke:var(--text-muted);stroke-width:1"/>`;
        s += `<rect x="-11" y="5" width="22" height="28" rx="5" style="fill:var(--bg-main);stroke:${col};stroke-width:1.3"/>`;
        s += `<rect x="-11" y="13" width="22" height="20" rx="4" style="fill:${col};opacity:.55"/>`;
        s += `<path d="M-1 33h2v5h-2z" style="fill:var(--text-muted)"/>`;
        s += `<path d="M0 38V${n2(38 + tubo)}" style="stroke:var(--text-muted);stroke-width:1.1;stroke-dasharray:2 2"/>`;
    }
    const y0 = p.envase === 'frasco' ? 35 : 40, largo = p.envase === 'frasco' ? tubo * 0.6 : tubo;
    if (gota != null) s += `<circle ${id ? `id="${id}-gota" ` : ''}data-y0="${y0}" data-largo="${n2(largo)}" cx="0" cy="${n2(y0 + largo * gota)}" r="2" style="fill:${col}"/>`;
    if (rotulo) {
        const dx = rotulo === 'izq' ? -15 : 15, a = rotulo === 'izq' ? 'end' : 'start';
        s += T(dx, 15, `${unidades} ${p.corto}`, { a, b: true });
        if (p.volumen) s += T(dx, 26, `${p.volumen} mL`, { a, s: 8.3, c: '--text-muted' });
    }
    const tr = `translate(${n2(x)} ${n2(y)})${escala !== 1 ? ` scale(${n2(escala)})` : ''}`;
    return `<g${id ? ` id="${id}"` : ''} transform="${tr}" aria-label="${p.nombre}">${s}</g>`;
}

// Mueve la gota de una bolsa ya pintada (u de 0 a 1 a lo largo del tubo). visible: false la esconde.
export function moverGota(raiz, id, u, visible = true) {
    const g = raiz.querySelector(`#${id}-gota`);
    if (!g) return;
    g.setAttribute('cy', n2(+g.dataset.y0 + +g.dataset.largo * u));
    g.setAttribute('opacity', visible ? '1' : '0');
}
