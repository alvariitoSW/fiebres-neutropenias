// El émbolo y la lisis (lupa «placa» del vaso vivo, con emb: true): la misma arteria, sin placa, con un trombo venoso
// que llegó migrado. Solo dibujo y mandos: los datos y las reglas están en js/data/vaso-vivo-data-tep.js.
// Fuente: docs/marino-2024-respiratory-management-caps22-26.pdf, PDF p. 8-11. El tamaño del coágulo y su resto tras la
// lisis son ilustrativos (la ficha no da un %). Rótulos ≥ 10 de cuerpo (a 360 px, ≥ 8 px en pantalla).
import { svgParticula } from '../../core/particulas.js';
import { instalarCss } from '../../core/dibujo-iso.js';
import { arteria, tx, mezcla } from './vaso-vivo-placa.js';
import { estadoBase } from '../../data/vaso-vivo-data.js';
import { RELOJ_TEP, PESO_TEP, BASE_TEP, CONTRA, acelMg, lisisTep, heparinaTep, hayContra, pideLisis } from '../../data/vaso-vivo-data-tep.js';

const n2 = x => +(+x).toFixed(2);
const P = (k, x, y, r, o = {}) => svgParticula(k, x, y, r, o);
const LUZ = [136, 226], X0 = 122, X1 = 238;
const techoDe = e => (lisisTep(e) ? 192 : 140);
const num = x => String(x).replace('.', ',');
// La trombina (IIa), con la forma de la lupa «cascada»: una lente con dos patitas
const iia = (x, y, f = 1) => `<g transform="translate(${n2(x)} ${n2(y)}) scale(${n2(0.5 * f)})"><path d="M-13 0Q0 -8.5 13 0Q0 8.5 -13 0Z" style="fill:var(--bg-card);stroke:var(--accent-yellow)" stroke-width="1.6"/><path d="M-12 0L-17 -1M12 0L17 1" style="stroke:var(--accent-yellow)" stroke-width="1.6"/></g>`;

function embolo(e) {
    const lisis = lisisTep(e), techo = techoDe(e), sola = lisis && !heparinaTep(e);
    let h = `<path d="M${X0} ${LUZ[1]}C${X0 - 4} ${techo + 14} ${X0 + 6} ${techo} ${X0 + 26} ${techo}H${X1 - 26}C${X1 - 6} ${techo} ${X1 + 4} ${techo + 14} ${X1} ${LUZ[1]}Z" style="fill:${mezcla('accent-red', 40)};stroke:var(--accent-red)" stroke-width="1"/>`;
    let fib = '';
    for (let i = 0; i < 14; i++) {
        const x = X0 + 12 + (i * 29) % (X1 - X0 - 24), y = techo + 10 + (i * 17) % Math.max(8, LUZ[1] - techo - 18), a = ((i * 47) % 160 + 10) * Math.PI / 180, dx = Math.cos(a) * 15, dy = Math.sin(a) * 8, y2 = Math.min(LUZ[1] - 4, y + dy);
        fib += lisis
            ? `<path d="M${n2(x - dx)} ${n2(y - dy)}L${n2(x - dx * 0.35)} ${n2(y - dy * 0.35)}M${n2(x + dx * 0.35)} ${n2(y + dy * 0.35)}L${n2(x + dx)} ${n2(y2)}" style="fill:none;stroke:var(--accent-yellow)" stroke-width="1.3" stroke-linecap="round"/>`
            : `<path d="M${n2(x - dx)} ${n2(y - dy)}L${n2(x + dx)} ${n2(y2)}" style="fill:none;stroke:var(--accent-yellow)" stroke-width="1.4" stroke-linecap="round"/>`;
    }
    h += `<g id="vso-tep-fibrina">${fib}`;
    h += lisis ? tx(112, 206, 'plasmina: corta', { c: 'accent-green', a: 'end', b: true }) + tx(112, 218, 'la fibrina', { c: 'accent-green', a: 'end', b: true }) : tx(112, 170, 'fibrina', { c: 'accent-yellow', a: 'end', b: true });
    h += `<path d="M114 ${lisis ? 208 : 167}L142 ${lisis ? 200 : 178}" style="stroke:var(${lisis ? '--accent-green' : '--accent-yellow'})" stroke-width=".9"/></g>`;
    for (let i = 0; i < 8; i++) h += P('plaquetaActiva', X0 + 14 + (i * 37) % (X1 - X0 - 28), techo + 10 + (i * 23) % Math.max(6, LUZ[1] - techo - 16), 3.2);
    if (!lisis) for (let i = 0; i < 3; i++) h += P('rbc', X0 + 28 + i * 20, LUZ[1] - 16, 4.2);
    h += tx((X0 + X1) / 2, techo - 6, lisis ? 'émbolo que se reabre' : 'émbolo', { c: 'text-main', a: 'middle', b: true });
    // la trombina que suelta el coágulo: libre si no hay heparina (y vuelve a tejerse la red); frenada si la hay
    if (lisis) {
        let t = '';
        for (let i = 0; i < 6; i++) t += iia(132 + i * 18, 158 + (i % 2) * 14, 1);
        h += `<g id="vso-tep-trombina"><g opacity="${sola ? 1 : 0.45}">${t}</g>${tx(180, 150, sola ? 'trombina' : 'trombina frenada', { c: sola ? 'accent-yellow' : 'accent-green', a: 'middle', b: true })}</g>`;
        if (!sola) h += `<path d="M126 166L236 166" style="stroke:var(--accent-green)" stroke-width="2" opacity=".8"/>`;
        else {
            let r = '';
            for (let i = 0; i < 7; i++) r += `<path d="M${252 + i * 12} ${LUZ[0] + 4}L${258 + ((i * 5) % 3) * 12} ${LUZ[1] - 4}" style="fill:none;stroke:var(--accent-yellow)" stroke-width="1.3" stroke-dasharray="3 2.5"/>`;
            h += `<g id="vso-tep-red">${r}${tx(296, 152, 'red nueva', { c: 'accent-red', a: 'middle', b: true })}</g>`;
        }
    }
    return `<g id="vso-tep-embolo" data-techo="${techo}">${h}</g>`;
}

// El reloj desde los síntomas: 0-96 h, con el carril «mayor beneficio <48 h» (p. 10)
function reloj(horas) {
    const RX = h => 40 + (h / RELOJ_TEP.max) * 300, y = 52;
    let h = tx(40, 34, 'horas desde los síntomas', { c: 'text-muted' });
    h += `<rect x="${RX(0)}" y="${y - 6}" width="${n2(RX(48) - RX(0))}" height="12" rx="3" style="fill:${mezcla('accent-green', 30)}"/><rect x="${n2(RX(48))}" y="${y - 6}" width="${n2(RX(96) - RX(48))}" height="12" rx="3" style="fill:${mezcla('accent-yellow', 30)}"/>`;
    h += tx((RX(0) + RX(48)) / 2, y + 4, 'mayor beneficio', { c: 'text-main', a: 'middle', b: true }) + tx((RX(48) + RX(96)) / 2, y + 4, 'menos beneficio', { c: 'text-main', a: 'middle', b: true });
    for (const m of [0, 48, 96]) h += `<path d="M${RX(m)} ${y - 9}V${y + 9}" style="stroke:var(--text-muted)" stroke-width="1.2"/>${tx(RX(m), y + 24, `${m} h`, { c: m === 48 ? 'text-main' : 'text-muted', a: 'middle' })}`;
    h += `<path id="vso-tep-aguja" d="M${n2(RX(horas))} ${y - 12}V${y + 10}" style="stroke:var(--text-main)" stroke-width="2"/><circle cx="${n2(RX(horas))}" cy="${y - 12}" r="4" style="fill:var(--text-main)"/>`;
    return `<g id="vso-tep-reloj">${h}</g>`;
}

// La lámina entera (la llama construir() de la escena)
export function svgTep(e) {
    const lisis = lisisTep(e), contra = hayContra(e), hep = heparinaTep(e);
    let h = '<rect width="360" height="360" style="fill:var(--bg-main)"/>';
    h += `<g id="vso-tep-arteria">${arteria()}${tx(300, 274, 'rama', { c: 'text-muted' })}</g>`;
    h += '<g id="vso-pl-flujo"></g>' + embolo(e);
    h += tx(8, LUZ[0] + 14, 'flujo →', { c: 'text-muted' }) + tx(352, 112, 'arteria pulmonar', { c: 'text-dim', a: 'end', b: true });
    h += tx(8, 256, 'émbolo: viene de las venas', { c: 'accent-red', b: true }) + tx(8, 268, 'de la pierna (TVP)', { c: 'accent-red', b: true });
    h += tx(8, 18, 'embolia pulmonar · el émbolo y la lisis', { c: 'accent-yellow', b: true });
    h += reloj(e.horas);
    // lo que dice el tratamiento
    let l1, l2 = '', c1 = 'text-main';
    if (contra) { l1 = 'lisis contraindicada → trombectomía de rescate'; l2 = 'el catéter saca el coágulo (Fig. 22.2)'; c1 = 'accent-red'; }
    else if (lisis && hep) { l1 = 'heparina durante y después de la lisis'; l2 = 'se reabre y la trombina queda frenada'; c1 = 'accent-green'; }
    else if (lisis) { l1 = 'trombina liberada: reoclusión'; l2 = 'sin heparina, vuelve a tejerse la red'; c1 = 'accent-red'; }
    else { l1 = 'el émbolo sigue; el siguiente no se forma'; l2 = 'la heparina no lo disuelve: evita el siguiente'; c1 = 'accent-green'; }
    // con un sello (contraindicación o reoclusión) el sello ya lo dice: no se repite debajo
    const conSello = contra || (e.tto === 'lisis');
    h += `<g id="vso-tep-sello">${conSello ? '' : tx(180, 296, l1, { c: c1, a: 'middle', b: true }) + tx(180, 308, l2, { c: 'text-dim', a: 'middle' })}</g>`;
    h += `<g id="vso-tep-dosis">${lisis ? tx(180, 328, `alteplasa ${PESO_TEP.estandar} mg en 2 h · colapso: ${num(acelMg(e.peso))} mg en 15 min`, { c: 'accent-green', a: 'middle', b: true }) + tx(180, 340, `0,6 mg/kg, máx. 50 mg (${e.peso} kg)`, { c: 'text-dim', a: 'middle' }) : ''}</g>`;
    return h;
}

// La sangre que corre: se para contra el émbolo entero; con la lisis pasa por encima del resto
const flujo = { els: [], e: null };
export function crearFlujoTep(svg, e) {
    const g = svg.querySelector('#vso-pl-flujo'); flujo.els = []; flujo.e = e;
    if (!g) return;
    let s = '';
    for (let i = 0; i < 12; i++) s += `<g>${P('rbc', 0, 0, 4.2)}</g>`;
    g.innerHTML = s;
    flujo.els = [...g.children].map((el, i) => ({ el, x: (i * 31) % 380 - 10, lane: LUZ[0] + 10 + (i * 13) % 70 }));
    moverTep(0);
}
export function moverTep(dt) {
    const e = flujo.e; if (!e) return;
    const lisis = lisisTep(e), techo = techoDe(e);
    for (const p of flujo.els) {
        const tope = lisis ? 999 : X0 - 2;
        const v = lisis && p.x > X0 - 6 && p.x < X1 ? 26 : 60;
        p.x = Math.min(tope - (p.lane % 5) * 3, p.x + v * dt);
        if (p.x > 370) p.x -= 390;
        let y = p.lane;
        if (p.x > X0 - 6 && p.x < X1) { const lo = techo - 6; if (y > lo) y = LUZ[0] + 6 + (p.lane - LUZ[0] - 10) * Math.max(0, lo - LUZ[0] - 12) / 70; }
        p.el.setAttribute('transform', `translate(${n2(p.x)} ${n2(y)})`);
        p.el.setAttribute('opacity', !lisis && p.x > X1 ? '0' : '1');
    }
}

// Los mandos: se crean una vez en el HTML (vaso-vivo.html, #vso-tep) y solo se repintan
const CSS_TEP = `
.vso-raiz .vso-escena.vso-tep-sello { padding-bottom: 118px; }
.vso-raiz .vso-escena.vso-tep-sello .tope-sellos { bottom: 30px; max-width: 98%; }
.vso-raiz .vso-chip-origen { position: absolute; left: 6px; top: 57%; z-index: 2; min-height: 30px; padding: 4px 10px; border-radius: 999px; border: 1px solid var(--accent-yellow); background: var(--bg-card); color: var(--accent-yellow); font: 700 .78rem/1.1 var(--sans, system-ui, sans-serif); }
.vso-raiz .vso-chip-origen[hidden] { display: none; }
`;
export function pintarMandosTep($, e) {
    const emb = !!e.emb;
    instalarCss('vso-tep', CSS_TEP);
    // en el émbolo solo toca la lupa de la «placa» (el resto es de otras escenas); el chip lleva al telar de la pierna
    document.querySelectorAll('.vso-lupas-fila [data-vso-lupa]').forEach(b => { b.hidden = emb && b.dataset.vsoLupa !== 'placa'; });
    $('chip-origen').hidden = !emb;
    $('escena').classList.toggle('vso-tep-sello', emb && (hayContra(e) || e.tto === 'lisis'));
    $('tep-panel').hidden = !emb; $('tratar-sca').hidden = emb;
    if (!emb) return;
    document.querySelectorAll('#vso-m-tto [data-v]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === e.tto)));
    document.querySelectorAll('#vso-m-contra [data-v]').forEach(b => b.setAttribute('aria-pressed', String(!!e[b.dataset.v])));
    $('m-horas-tep').value = e.horas; $('m-horas-tep-out').innerHTML = `${e.horas} <small>h</small>`;
    $('m-peso-tep').value = e.peso; $('m-peso-tep-out').innerHTML = `${e.peso} <small>kg · ${num(acelMg(e.peso))} mg</small>`;
}
export function engancharTep($, cambiar, pararPlay) {
    const aEmb = e => { if (!e.emb) Object.assign(e, estadoBase(), BASE_TEP, { lesion: 'placa', emb: true, t: 4, horas: RELOJ_TEP.inicio }); };
    const act = fn => { pararPlay(); cambiar(e => { aEmb(e); fn(e); if (hayContra(e) && pideLisis(e)) e.tto = 'heparina'; }, { lupa: 'placa' }); };
    $('m-tto').addEventListener('click', ev => { const b = ev.target.closest('[data-v]'); if (b) act(e => { e.tto = b.dataset.v; }); });
    $('m-contra').addEventListener('click', ev => { const b = ev.target.closest('[data-v]'); if (b) act(e => { e[b.dataset.v] = !e[b.dataset.v]; }); });
    $('m-horas-tep').addEventListener('input', ev => act(e => { e.horas = Math.max(RELOJ_TEP.min, Math.min(RELOJ_TEP.max, Math.round(+ev.target.value))); }));
    $('m-peso-tep').addEventListener('input', ev => act(e => { e.peso = Math.max(PESO_TEP.min, Math.min(PESO_TEP.max, Math.round(+ev.target.value))); }));
}
export { CONTRA };
