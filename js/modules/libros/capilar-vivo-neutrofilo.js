// Capilar y oxígeno: la lupa del neutrófilo (Fig. 17.1 de Marino, cap. 17, p. 53-55), recreada.
// El estallido respiratorio: la NADPH oxidasa añade electrones al O₂ de uno en uno (O₂ → superóxido → H₂O₂), y el H₂O₂
// se bifurca: radical hidroxilo (con Fe²⁺) o hipoclorito (con Cl⁻ y mieloperoxidasa). En el estado «reperfusion», el
// H₂O₂ cruza membranas, viaja por la sangre y en otro órgano, con Fe²⁺, da hidroxilo (p. 55). Dibujo: sin cifras
// propias; las del libro son «×20» y «15-20 min» (p. 53). Lo pinta capilar-vivo-escena.js (pintarLupa y pasoLupa).
import { svgParticula } from '../../core/particulas.js';

const NS = 'http://www.w3.org/2000/svg';
const CAJA = 'fill:var(--bg-main);stroke:var(--text-dim);stroke-width:1.1';
let min = 0;      // el reloj del estallido, en «minutos» del dibujo (1 s = 1 min)
const FLUJO = [];
// Modo «toxicidad» (ficha O₂ tóxico de Merino Neumología, Fig. 25.6): los dos mandos de la lupa.
let fio = 21, hor = 0;   // FiO₂ en % (21-100) y horas de exposición (0-108)
export const reiniciarNeutrofilo = () => { min = 0; FLUJO.length = 0; fio = 21; hor = 0; };

// Rutas de los puntos: de la membrana al H₂O₂ y de ahí a su destino (hidroxilo, hipoclorito u otro órgano).
const COMUN = [[92, 100], [123, 53], [123, 77], [123, 101]];
const RAMAS = {
    oh: [[121, 124], [121, 136]], cl: [[183, 124], [183, 136]],
    organo: [[123, 111], [123, 127], [110, 127], [110, 154]],
};

export function lupaNeutrofilo(e, T, { exceso = false } = {}) {
    if (e.ros === 'toxicidad') return lupaToxicidad(T);
    const rep = e.ros === 'reperfusion';
    let h = `<g id="cpv-lupa-neu-titulo">${T(110, 22, 'estallido respiratorio', { a: 'middle', s: 10, b: 1, c: '--text-main', sans: 1 })}${T(110, 34, 'O₂ ×20 · 15-20 min · sin ATP', { a: 'middle', s: 8, b: 1, c: '--accent-yellow', sans: 1 }).replace('<text ', '<text id="cpv-lupa-neu-sub" ')}</g>`;
    // la célula: el neutrófilo (núcleo en lóbulos) y la NADPH oxidasa en su membrana
    h += '<circle cx="52" cy="100" r="34" style="fill:var(--bg-main);stroke:var(--text-muted);stroke-width:1.4"/>';
    h += svgParticula('neutrofilo', 48, 100, 14);
    h += '<rect id="cpv-lupa-nadph" x="83" y="88" width="9" height="24" rx="3" style="fill:var(--accent-yellow);stroke:var(--bg-main);stroke-width:1"/>';
    h += T(52, 57, 'neutrófilo', { a: 'middle', s: 8.5, b: 1, sans: 1 }) + T(52, 145, 'NADPH oxidasa ▸ e⁻', { a: 'middle', s: 7.6, b: 1, c: '--accent-yellow', sans: 1 });
    // la cadena (cada caja es una especie; las flechas son los electrones de uno en uno)
    const caja = (id, y, t, extra = '') => `<g id="${id}"><rect x="118" y="${y}" width="86" height="18" rx="4" style="${CAJA}"/>${extra}${T(161, y + 12.5, t, { a: 'middle', s: 8.5, b: 1, sans: 1 })}</g>`;
    const flecha = y => `<path d="M161 ${y}v4m-3-2l3 3 3-3" style="fill:none;stroke:var(--text-dim);stroke-width:1.2"/>`;
    h += '<g id="cpv-lupa-cadena">' + caja('cpv-lupa-o2', 44, 'O₂ + e⁻') + flecha(62) + caja('cpv-lupa-sup', 68, 'O₂· superóxido') + flecha(86) + caja('cpv-lupa-h2o2', 92, 'H₂O₂ + 2 H⁺') + '</g>';
    if (!rep) {
        h += '<g id="cpv-lupa-fork"><path d="M150 110L121 123M172 110L183 123" style="fill:none;stroke:var(--text-dim);stroke-width:1.2"/>';
        h += `<g id="cpv-lupa-fe"><rect x="92" y="124" width="58" height="26" rx="4" style="${CAJA}"/>${T(121, 134, 'con Fe²⁺', { a: 'middle', s: 7.6, i: 1, c: '--text-muted' })}${T(121, 145, 'HO· hidroxilo', { a: 'middle', s: 7.6, b: 1, c: '--accent-red', sans: 1 })}</g>`;
        h += `<g id="cpv-lupa-mpo"><rect x="154" y="124" width="58" height="26" rx="4" style="${CAJA}"/>${T(183, 134, 'MPO + Cl⁻', { a: 'middle', s: 7.6, i: 1, c: '--text-muted' })}${T(183, 145, 'OCl⁻ lejía', { a: 'middle', s: 7.6, b: 1, c: '--accent-purple', sans: 1 })}</g></g>`;
        h += T(110, 168, 'el O₂ no hace ATP: hace armas', { a: 'middle', s: 8, b: 1, sans: 1 });
        h += T(110, 180, exceso ? 'con O₂ de más hay más radicales' : 'ROS &gt; antioxidantes: daña al huésped', { a: 'middle', s: 7.6, b: 1, c: exceso ? '--accent-red' : '--text-dim', sans: 1 });
        h += T(110, 192, 'endotelio y glucocálix', { a: 'middle', s: 7.6, i: 1, c: '--text-muted' });
    } else {
        // el H₂O₂ cruza la membrana, viaja por la sangre y llega a otro órgano, donde el Fe²⁺ lo vuelve hidroxilo
        h += `<g id="cpv-lupa-vaso"><path d="M96 127H206" style="fill:none;stroke:var(--accent-red);stroke-width:9;stroke-linecap:round;opacity:.45"/><path d="M96 127H206" style="fill:none;stroke:var(--bg-main);stroke-width:5;stroke-linecap:round"/>${T(176, 143, 'sangre', { a: 'middle', s: 7.6, i: 1, c: '--text-muted' })}</g>`;
        h += T(98, 119, 'cruza membranas', { s: 7.6, i: 1, c: '--text-muted' });
        const n = exceso ? 6 : 3;
        let marcas = '';
        for (let i = 0; i < n; i++) marcas += `<circle cx="${(n > 3 ? 52 : 66) + 14 * i}" cy="183" r="${exceso ? 3.6 : 2.6}" style="fill:var(--accent-red)"/>`;
        h += `<g id="cpv-lupa-organo"><rect x="38" y="154" width="148" height="38" rx="8" style="${CAJA};stroke-width:1.5"/>${T(112, 165, 'otro órgano', { a: 'middle', s: 8.5, b: 1, sans: 1 })}`;
        h += `<g id="cpv-lupa-fe">${T(112, 175, 'Fe²⁺ + H₂O₂ → HO· (daño)', { a: 'middle', s: 7.6, b: 1, c: '--accent-red', sans: 1 })}</g>${marcas}${exceso ? T(190, 186, 'más', { s: 7.6, b: 1, c: '--accent-red', sans: 1 }) : ''}</g>`;
        h += T(112, 204, exceso ? 'con O₂ de más: más daño' : 'reperfusión diseminada', { a: 'middle', s: 7.6, b: 1, c: exceso ? '--accent-red' : '--text-dim', sans: 1 });
    }
    h += '<g id="cpv-lupa-neu-flujo"></g>';
    return h;
}

const largo = r => r.reduce((a, p, i) => a + (i ? Math.hypot(p[0] - r[i - 1][0], p[1] - r[i - 1][1]) : 0), 0);
function en(r, u) {
    let d = u * largo(r);
    for (let i = 1; i < r.length; i++) {
        const l = Math.hypot(r[i][0] - r[i - 1][0], r[i][1] - r[i - 1][1]);
        if (d <= l) return [r[i - 1][0] + (r[i][0] - r[i - 1][0]) * d / (l || 1), r[i - 1][1] + (r[i][1] - r[i - 1][1]) * d / (l || 1)];
        d -= l;
    }
    return r[r.length - 1];
}

// Un fotograma: los puntos recorren la cadena; a los 20 «minutos» el estallido se apaga (y vuelve a empezar).
export function pasoNeutrofilo(dt, e, svg, quieto) {
    if (e.ros === 'toxicidad') return pasoToxicidad(svg);
    const g = svg.querySelector('#cpv-lupa-neu-flujo'); if (!g) return;
    const rep = e.ros === 'reperfusion';
    if (!quieto) min = (min + dt) % 25;
    const apagado = min >= 20;
    const sub = svg.querySelector('#cpv-lupa-neu-sub');
    if (sub && !quieto) { sub.textContent = apagado ? 'el estallido se apaga' : `minuto ${Math.floor(min) + 1} · O₂ ×20 · sin ATP`; sub.style.fill = apagado ? 'var(--text-muted)' : 'var(--accent-yellow)'; }
    if (!FLUJO.length) for (let i = 0; i < 8; i++) FLUJO.push({ t: i / 8, rama: rep ? 'organo' : i % 2 ? 'oh' : 'cl', el: null });
    for (const f of FLUJO) {
        if (!f.el || !f.el.isConnected) { f.el = document.createElementNS(NS, 'circle'); f.el.setAttribute('r', '2.2'); g.appendChild(f.el); }
        if (!quieto) { f.t += dt * 0.22; if (f.t >= 1) { f.t -= 1; f.rama = rep ? 'organo' : f.rama === 'oh' ? 'cl' : 'oh'; } }
        const ruta = COMUN.concat(RAMAS[f.rama].map(p => p.slice()));
        const [x, y] = en(ruta, f.t);
        f.el.setAttribute('cx', x.toFixed(1)); f.el.setAttribute('cy', y.toFixed(1)); f.el.setAttribute('opacity', apagado ? '0' : '1');
        const dentro = f.t * largo(ruta) > largo(COMUN);
        f.el.style.fill = dentro ? (f.rama === 'cl' ? 'var(--accent-purple)' : 'var(--accent-red)') : 'var(--accent-yellow)';
    }
}

// ---- Toxicidad del O₂ (Marino cap. 25, Fig. 25.6, p. 66-67; umbrales p. 71-72) ----
// La cascada y los umbrales son de la ficha; las barras «radicales» y «defensas» son ilustrativas (sin cifra).
export const TOPE_HORAS = 108;   // 4,5 días: la exposición más larga que cita la ficha (1 voluntario, p. 72)
// Qué dice la ficha a cada exposición: [nivel, línea 1, línea 2]. Nivel: 0 sin aviso, 1 aviso, 2 sello.
export function veredictoToxicidad(f, h) {
    if (f >= 100 && h >= TOPE_HORAS) return [2, 'LESIÓN INFLAMATORIA · TOPE', 'O₂ puro 4,5 días · p. 72'];
    if (f >= 100 && h >= 72) return [2, 'Lesión inflamatoria 3-4 d', 'O₂ al 100 % prolongado · p. 72'];
    if (f >= 100 && h >= 6) return [1, 'Traqueobronquitis 6-12 h', 'capacidad vital ↓ · O₂ 100 % · p. 72'];
    if (f > 60) return [1, 'Sobre el 60 % clásico', 'en el crítico tolera menos · p. 72'];
    return [0, 'Bajo el 60 % clásico', 'FiO₂ más baja tolerable · p. 72'];
}
// Radicales y defensas de 0 a 1 (ilustrativo): más FiO₂ y más horas suben las ROS y gastan las defensas.
export function balanceToxicidad(f, h) {
    const x = Math.max(0, Math.min(1, (f - 21) / 79)), t = Math.min(1, h / TOPE_HORAS);
    return { ros: 0.1 + 0.9 * x * (0.4 + 0.6 * t), def: 0.8 - 0.55 * x * t };
}
const PISTA = { fio: [88, 176, 137], hor: [88, 176, 149] };   // x desde, x hasta, y (a 360 px la barra de abajo tapa la lupa desde y ≈ 156)
function lupaToxicidad(T) {
    // arriba, el veredicto de la ficha (el rótulo que cambia con los mandos); la cadena, las defensas, las barras y los mandos
    let h = `<g id="cpv-lupa-neu-titulo">${T(110, 21, '', { a: 'middle', s: 7.6, b: 1, sans: 1 }).replace('<text ', '<text id="cpv-tox-v1" ')}${T(110, 32, '', { a: 'middle', s: 7.6, i: 1, c: '--text-muted' }).replace('<text ', '<text id="cpv-tox-v2" ')}</g>`;
    const caja = (id, y, t, c) => `<g id="${id}"><rect x="30" y="${y}" width="84" height="12" rx="4" style="${CAJA}"/>${T(72, y + 9, t, { a: 'middle', s: 7.6, b: 1, c, sans: 1 })}</g>`;
    const fl = y => `<path d="M72 ${y}v4m-3-2l3 3 3-3" style="fill:none;stroke:var(--text-dim);stroke-width:1.1"/>`;
    h += '<g id="cpv-lupa-cadena">' + caja('cpv-lupa-o2', 40, 'O₂ + 1 e⁻', '--text-main') + fl(52) + caja('cpv-lupa-sup', 55, 'superóxido ·', '--accent-yellow') + fl(67) + caja('cpv-lupa-h2o2', 70, 'H₂O₂ (no radical)', '--accent-yellow') + fl(82) + caja('cpv-lupa-oh', 85, 'HO· hidroxilo', '--accent-red') + fl(97) + T(72, 108, '→ 2 H₂O (≥95 %)', { a: 'middle', s: 7.6, b: 1, c: '--accent-green', sans: 1 }) + '</g>';
    const def = (y, t) => T(120, y, t, { s: 7.6, b: 1, c: '--accent-green', sans: 1 });
    h += '<g id="cpv-lupa-defensas">' + def(64, '◂ SOD') + def(79, '◂ glutatión (Se)') + def(94, '◂ vit. E y C') + '</g>';
    h += T(66, 119, 'radicales', { a: 'end', s: 7.6, b: 1, c: '--accent-red', sans: 1 }) + '<rect id="cpv-tox-ros" x="70" y="112.5" width="100" height="8" rx="3" style="fill:var(--accent-red)"/>';
    h += T(66, 129, 'defensas', { a: 'end', s: 7.6, b: 1, c: '--accent-green', sans: 1 }) + '<rect id="cpv-tox-def" x="70" y="122.5" width="100" height="8" rx="3" style="fill:var(--accent-green)"/>';
    for (const [k, [x0, x1, y]] of Object.entries(PISTA)) {
        h += `<g id="cpv-tox-${k}"><rect x="${x0 - 4}" y="${y - 6}" width="${x1 - x0 + 8}" height="12" rx="6" style="fill:none;stroke:var(--text-dim);stroke-width:1"/><rect x="${x0}" y="${y - 1.5}" width="${x1 - x0}" height="3" rx="1.5" style="fill:var(--text-dim)"/><circle id="cpv-tox-${k}-p" cx="${x0}" cy="${y}" r="5.5" style="fill:var(--accent-yellow);stroke:var(--bg-main);stroke-width:1.2"/>${T(x0 - 8, y + 3, '', { a: 'end', s: 7.6, b: 1, sans: 1 }).replace('<text ', `<text id="cpv-tox-${k}-t" `)}</g>`;
    }
    return h;
}
function pasoToxicidad(svg) {
    if (!svg.querySelector('#cpv-tox-ros')) return;
    if (!svg.dataset.toxMando) {
        svg.dataset.toxMando = '1';
        let activo = null;
        const poner = ev => {
            const r = svg.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width * 220;
            const [x0, x1] = PISTA[activo], u = Math.max(0, Math.min(1, (x - x0) / (x1 - x0)));
            if (activo === 'fio') fio = Math.max(21, Math.min(100, Math.round((21 + 79 * u) / 5) * 5));
            else hor = Math.round(u * TOPE_HORAS);
            pasoToxicidad(svg);
        };
        svg.addEventListener('pointerdown', ev => {
            const r = svg.getBoundingClientRect(), y = (ev.clientY - r.top) / r.height * 220, x = (ev.clientX - r.left) / r.width * 220;
            if (x < 40 || y < 130 || y > 156) return;
            activo = y < 143 ? 'fio' : 'hor';
            if (activo === 'hor' && fio >= 100 && hor >= TOPE_HORAS) { activo = null; return; }
            try { svg.setPointerCapture(ev.pointerId); } catch (_) { /* sin captura, el arrastre sigue dentro */ }
            poner(ev); ev.preventDefault();
        });
        svg.addEventListener('pointermove', ev => { if (activo) poner(ev); });
        const suelta = () => { activo = null; };
        svg.addEventListener('pointerup', suelta); svg.addEventListener('pointercancel', suelta);
    }
    const { ros, def } = balanceToxicidad(fio, hor), [niv, l1, l2] = veredictoToxicidad(fio, hor);
    const set = (id, a, v) => { const n = svg.querySelector('#' + id); if (n) n.setAttribute(a, v); return n; };
    set('cpv-tox-ros', 'width', (100 * ros).toFixed(1)); set('cpv-tox-def', 'width', (100 * def).toFixed(1));
    const col = niv === 2 ? '--accent-red' : niv === 1 ? '--accent-yellow' : '--accent-green';
    const v1 = svg.querySelector('#cpv-tox-v1'), v2 = svg.querySelector('#cpv-tox-v2');
    if (v1) { v1.textContent = l1; v1.style.fill = `var(${col})`; } if (v2) v2.textContent = l2;
    const oh = svg.querySelector('#cpv-lupa-oh rect'); if (oh) oh.style.stroke = ros > def ? 'var(--accent-red)' : 'var(--text-dim)';
    const tope = fio >= 100 && hor >= TOPE_HORAS;
    for (const [k, [x0, x1]] of Object.entries(PISTA)) {
        const v = k === 'fio' ? (fio - 21) / 79 : hor / TOPE_HORAS;
        set(`cpv-tox-${k}-p`, 'cx', (x0 + (x1 - x0) * v).toFixed(1));
        const t = svg.querySelector(`#cpv-tox-${k}-t`); if (t) t.textContent = k === 'fio' ? `FiO₂ ${fio} %` : `${hor} h`;
        const g = svg.querySelector(`#cpv-tox-${k}`); if (g) g.style.opacity = k === 'hor' && tope ? '.4' : '1';
    }
    const p = svg.querySelector('#cpv-tox-fio-p'); if (p) p.style.fill = fio > 60 ? 'var(--accent-red)' : 'var(--accent-yellow)';
    if (v2 && tope) v2.textContent = 'tope 4,5 días: baja la FiO₂ · p. 72';
}
