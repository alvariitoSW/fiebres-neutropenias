// El corazón en corte de cinco cámaras (pieza común de la app).
// Grabado como el corte del corazón eléctrico (crema y trama sobre fondo oscuro), pero PARAMÉTRICO: lo mueve el estado
// de un motor (volúmenes de las cuatro cámaras, válvulas abiertas o cerradas, tabique, derrame del saco, PVC). Lo usan la
// cabecera del shock (el paciente, el circuito del ECMO y el recorrido de los aparatos).
//
// Piezas: miocardio con su grosor (el VI grueso, el VD fino, las aurículas finas, el tabique), con trama y fibras; las
// cavidades con su endocardio; el anillo de cada válvula; la mitral (dos velos, cuerdas y dos músculos papilares), la
// tricúspide (dos velos, cuerdas, papilar y banda moderadora) y la aórtica (dos velos de la raíz); la raíz aórtica con sus
// senos y los ostia coronarios; las coronarias en el surco AV con su grasa; las cavas (la inferior, con su diámetro según
// la PVC) y dos venas pulmonares cortadas; el pericardio (hoja fibrosa y serosa) y el líquido del saco.
// Las formas son ilustrativas; lo que cambia de tamaño lo dice el motor (volúmenes, válvulas, derrame, PVC).
//
// Uso: const c = crearCorazonCorte(grupoSvg, { pre: 'cor', rotulos: true, vci: 120, aorta: 'corta' | 'larga' });
//      c.pintar({ vvi, vvd, vai, vad, vMit, vTri, vAo, septo, liquidoPeri, pvc, flail, mioVi, mioVd }, dt, quieto);
//      c.puertos() → puntos en coordenadas del grupo: aorta (arriba de la ascendente), vi (centro de la cavidad),
//      apice, ad, vciEntrada, vciAbajo, vcs, valvAo (centro de la válvula aórtica).
import { suave2, envolvente, instalarCss } from './dibujo-iso.js';

const f1 = (n) => Math.round(n * 10) / 10;
const cl = (x, a, b) => Math.max(a, Math.min(b, x));
const P = (pts) => pts.length ? 'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L') : '';
const Pc = (pts) => P(pts) + 'Z';
const mezcla = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const largo = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
// curva cerrada suave (Catmull-Rom por la pieza común, cerrando el lazo)
function cerrada(pts, porTramo = 6) { const n = pts.length; const c = suave2([pts[n - 1], ...pts, pts[0], pts[1]], porTramo); return c.slice(porTramo, c.length - porTramo); }
// desplazar una curva abierta por su normal (d > 0: hacia la izquierda del sentido de avance en pantalla, y abajo)
function desplazar(pts, d) {
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const nx = (b[1] - a[1]), ny = -(b[0] - a[0]), l = Math.hypot(nx, ny) || 1;
    const dd = typeof d === 'function' ? d(i / (pts.length - 1), i) : d;
    return [p[0] + nx / l * dd, p[1] + ny / l * dd];
  });
}
// la normal de un punto de una curva (misma convención que desplazar)
function normal(pts, i) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]; const nx = b[1] - a[1], ny = -(b[0] - a[0]), l = Math.hypot(nx, ny) || 1; return [nx / l, ny / l]; }
// punto a una fracción del largo de una polilínea
function enFraccion(pts, t) {
  let L = 0; const d = [0]; for (let i = 1; i < pts.length; i++) { L += largo(pts[i - 1], pts[i]); d.push(L); }
  const s = cl(t, 0, 1) * L; for (let i = 1; i < pts.length; i++) if (d[i] >= s) { const u = (s - d[i - 1]) / ((d[i] - d[i - 1]) || 1); return { p: mezcla(pts[i - 1], pts[i], u), i }; }
  return { p: pts[pts.length - 1], i: pts.length - 1 };
}
// un velo: de su bisagra a su punta, con el vientre hacia un lado
function velo(a, b, vientre) { const m = mezcla(a, b, 0.5), dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return suave2([a, [m[0] - dy / l * vientre, m[1] + dx / l * vientre], b], 6); }

// desplazar una curva abierta alejándose de un punto de dentro (el sentido de la normal, punto a punto)
function haciaFuera(pts, d, c) {
  return pts.map((p, i) => {
    let [nx, ny] = normal(pts, i); if (nx * (p[0] - c[0]) + ny * (p[1] - c[1]) < 0) { nx = -nx; ny = -ny; }
    const dd = typeof d === 'function' ? d(i / (pts.length - 1), i) : d;
    return [p[0] + nx * dd, p[1] + ny * dd];
  });
}
// desplazar un contorno cerrado hacia fuera (por la normal, con el sentido que lo aleja de su centro)
function sepPts(pts, d) {
  const c = pts.reduce((a, p) => [a[0] + p[0] / pts.length, a[1] + p[1] / pts.length], [0, 0]), n = pts.length;
  return pts.map((p, i) => {
    const a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n]; let nx = b[1] - a[1], ny = -(b[0] - a[0]); const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
    if (nx * (p[0] - c[0]) + ny * (p[1] - c[1]) < 0) { nx = -nx; ny = -ny; }
    return [p[0] + nx * d, p[1] + ny * d];
  });
}
// ---------------------------------------------------------------- CSS y tramas (solo tokens; las mezclas, de dos tokens)
const CSS = `
.cc .cc-tejido { fill: color-mix(in srgb, var(--accent-red) 50%, var(--bg-main)); }
.cc .cc-trama { fill: url(#cc-trama); }
.cc .cc-silueta { fill: none; stroke: var(--text-main); stroke-width: 2.2; stroke-linejoin: round; }
.cc .cc-fibras { fill: none; stroke: color-mix(in srgb, var(--accent-red) 62%, var(--text-main)); stroke-width: .45; stroke-linecap: round; opacity: .55; }
.cc .cc-sangre-a { fill: color-mix(in srgb, var(--accent-red) 12%, var(--bg-main)); }
.cc .cc-sangre-v { fill: color-mix(in srgb, var(--accent-purple) 18%, var(--bg-main)); }
.cc .cc-punteado { fill: url(#cc-punteado); }
.cc .cc-endo { fill: none; stroke: var(--text-main); stroke-width: .8; stroke-linejoin: round; opacity: .8; }
.cc .cc-trab { fill: none; stroke: color-mix(in srgb, var(--accent-red) 50%, var(--text-dim)); stroke-width: 1.1; stroke-linecap: round; }
.cc .cc-papilar { fill: color-mix(in srgb, var(--accent-red) 40%, var(--bg-main)); stroke: var(--text-dim); stroke-width: .6; }
.cc .cc-velo { fill: none; stroke: var(--text-main); stroke-width: 1.6; stroke-linecap: round; }
.cc .cc-velo-fino { fill: none; stroke: var(--text-main); stroke-width: 1.1; stroke-linecap: round; }
.cc .cc-cuerda { fill: none; stroke: var(--text-dim); stroke-width: .45; }
.cc .cc-anillo { fill: color-mix(in srgb, var(--text-main) 70%, var(--bg-main)); stroke: var(--text-main); stroke-width: .5; }
.cc .cc-grasa { fill: color-mix(in srgb, var(--accent-yellow) 22%, var(--bg-main)); stroke: color-mix(in srgb, var(--accent-yellow) 45%, var(--bg-main)); stroke-width: .4; }
.cc .cc-coronaria { fill: color-mix(in srgb, var(--accent-red) 55%, var(--bg-main)); stroke: var(--text-main); stroke-width: .6; }
.cc .cc-coronaria-luz { fill: color-mix(in srgb, var(--accent-red) 80%, var(--text-main)); }
.cc .cc-pared-vaso { fill: color-mix(in srgb, var(--text-dim) 32%, var(--bg-main)); stroke: var(--text-main); stroke-width: .7; stroke-linejoin: round; }
.cc .cc-pared-vena { fill: color-mix(in srgb, var(--accent-purple) 28%, var(--bg-main)); stroke: var(--text-dim); stroke-width: .6; stroke-linejoin: round; }
.cc .cc-corte { fill: var(--bg-main); stroke: var(--text-main); stroke-width: .7; }
.cc .cc-corte-luz { fill: none; stroke: var(--text-dim); stroke-width: .5; }
.cc .cc-saco { fill: none; stroke: var(--text-dim); stroke-width: 2.6; stroke-linejoin: round; }
.cc .cc-saco-serosa { fill: none; stroke: var(--text-muted); stroke-width: 1; }
.cc .cc-derrame { fill: color-mix(in srgb, var(--accent-yellow) calc(4% + 30% * var(--derrame, 0)), var(--bg-main)); }
.cc .cc-boca { fill: none; stroke: var(--text-dim); stroke-width: .7; }
.cc .cc-chorro { fill: none; stroke: color-mix(in srgb, var(--accent-red) 70%, var(--text-main)); stroke-width: .8; stroke-linecap: round; }
.cc .cc-rot { font: 600 9px system-ui, sans-serif; fill: var(--text-dim); letter-spacing: .04em; }
.cc .cc-rot.dim { fill: var(--text-muted); font-weight: 400; }
`;
const DEFS = `<pattern id="cc-trama" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><line x1="0" y1="0" x2="0" y2="3" style="stroke:var(--text-main)" stroke-opacity=".14" stroke-width=".45"/></pattern>
<pattern id="cc-punteado" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r=".35" style="fill:var(--text-main)" fill-opacity=".1"/><circle cx="3.7" cy="3.6" r=".3" style="fill:var(--text-main)" fill-opacity=".07"/></pattern>`;
export const instalarCorazonCorte = () => instalarCss('corazon-corte', CSS, DEFS);

// ---------------------------------------------------------------- la geometría fija (unidades del dibujo; ilustrativa)
const S0 = [106, 118];                 // cresta del tabique, cara del VI
const MP = [214, 118];                 // anillo mitral, bisagra lateral (posterior)
const MA = [142, 112];                 // anillo mitral, bisagra anterior (continuidad mitroaórtica)
const AL = [104, 103], AR = [138, 101];  // anillo aórtico
const AO_X = 121;                      // eje de la raíz aórtica
const U = [1, 0];                      // a lo largo de la base del VI
const V = (() => { const v = [0.22, 1], l = Math.hypot(...v); return [v[0] / l, v[1] / l]; })();   // eje largo, hacia la punta
const MB = mezcla(S0, MP, 0.5), A_BASE = largo(S0, MP) / 2, L_VI = 112;

// La cavidad del VI: de la bisagra lateral (φ = 0) por la punta (φ = π/2) a la cresta del tabique (φ = π)
function cavidadVi(fvi, septo, n = 36) {
  const fa = Math.pow(fvi, 0.9), fl = Math.pow(fvi, 0.6), out = [];
  for (let i = 0; i <= n; i++) {
    const ph = Math.PI * i / n, base = Math.min(1, Math.sin(ph) * 3);
    const w = A_BASE * Math.cos(ph) * (1 + (fa - 1) * base), l = L_VI * Math.pow(Math.sin(ph), 0.8) * (1 + (fl - 1) * base);
    out.push([MB[0] + U[0] * w + V[0] * l, MB[1] + U[1] * w + V[1] * l]);
  }
  // el tabique se aplana (y, con el VD a más presión, se va hacia el VI): la mitad septal, hacia la cuerda cresta-punta
  const apex = out[n / 2], s = septo;
  for (let i = n / 2 + 1; i < n; i++) {
    const p = out[i], d = [S0[0] - apex[0], S0[1] - apex[1]], l2 = d[0] * d[0] + d[1] * d[1];
    const t = ((p[0] - apex[0]) * d[0] + (p[1] - apex[1]) * d[1]) / l2, q = [apex[0] + d[0] * t, apex[1] + d[1] * t];
    out[i] = mezcla(p, q, s * Math.sin(Math.PI * (i - n / 2) / (n / 2)) ** 0.6);
  }
  return out;
}

export function crearCorazonCorte(grupo, { pre = 'cor', rotulos = true, vci = 110, aorta = 'corta', saco = true } = {}) {
  // aorta 'corta': la ascendente cortada arriba (se ve su sección); 'larga': sigue en el dibujo de quien la usa (el cayado)
  grupo.classList.add('cc');
  grupo.innerHTML = `<g id="${pre}-saco-g"></g>
    <g id="${pre}-detras"></g><g id="${pre}-cav"></g><g id="${pre}-delante"></g>`;
  const $ = (k) => grupo.querySelector(`#${pre}-${k}`);
  if (!saco) $('saco-g').setAttribute('hidden', '');
  const st = { fvi: 1, fvd: 1, fad: 1, fai: 1, septo: 0, liq: 0, mit: 1, tri: 1, ao: 0, flail: 0, civ: 0, dvci: 18 };
  let ult = null;

  function pintar(e, dt = 1 / 60, quieto = false) {
    const k = quieto ? 1 : 1 - Math.exp(-dt / 0.05), kv = quieto ? 1 : 1 - Math.exp(-dt / 0.035);
    const ir = (c, v, kk = k) => { st[c] = st[c] + (v - st[c]) * kk; };
    ir('fvi', cl(Math.cbrt((e.vvi ?? 120) / 120), 0.62, 1.42)); ir('fvd', cl(Math.cbrt((e.vvd ?? 130) / 130), 0.62, 1.5));
    ir('fad', cl(Math.cbrt((e.vad ?? 55) / 55), 0.7, 1.45)); ir('fai', cl(Math.cbrt((e.vai ?? 55) / 55), 0.7, 1.5));
    ir('septo', cl(e.septo ?? 0, 0, 1.35)); ir('liq', e.liquidoPeri ?? 0, quieto ? 1 : 1 - Math.exp(-dt / 0.3));
    ir('mit', e.vMit ? 1 : 0, kv); ir('tri', e.vTri ? 1 : 0, kv); ir('ao', e.vAo ? 1 : 0, kv); ir('flail', e.flail ? 1 : 0); ir('civ', e.civ ? 1 : 0);
    ir('dvci', cl(e.dVci ?? 18, 7, 28), quieto ? 1 : 1 - Math.exp(-dt / 0.4));
    const g = geometria(st, e);
    ult = g;
    dibujar(g);
  }

  function geometria(s, e) {
    // ---- VI
    const cav = cavidadVi(s.fvi, s.septo);
    const gVi = 13.5 * (e.mioVi ?? 1) / Math.pow(Math.max(0.86, s.fvi), 1.15);   // la pared engrosa al vaciarse, con tope
    // la pared: más fina en la punta; hacia fuera (la curva va de lateral a septal pasando por la punta: fuera es +normal)
    const espVi = (t) => gVi * (0.62 + 0.38 * Math.min(1, Math.abs(Math.cos(Math.PI * t)) * 1.6 + 0.25));
    const cVi = [MB[0] + V[0] * L_VI * 0.45, MB[1] + V[1] * L_VI * 0.45];
    const viExt = haciaFuera(cav, (t) => espVi(t), cVi);
    const nC = cav.length - 1, iApex = nC / 2;
    // ---- VD: su cara septal es la cara derecha del tabique (la pared del VI por fuera, de la cresta hacia la punta)
    const fin = cl(iApex + Math.round((nC - iApex) * (0.34 - 0.3 * cl(s.fvd - 1, -0.3, 1))), iApex + 1, iApex + 9);
    const sept = viExt.slice(fin, nC + 1).reverse();   // de la cresta (arriba) hacia la punta
    const nS = sept.length - 1, W0 = 64 * (1 + 0.55 * (s.fvd - 1)), panza = cl(0.1 + 0.9 * (s.fvd - 1), -0.1, 0.75);
    const libre = sept.map((p, i) => {
      const t = i / nS, nn = normal(sept, i), w = W0 * Math.pow(Math.max(0, 1 - Math.pow(t, 1.5)), 0.8) * (1 + panza * Math.sin(Math.PI * t));
      // en la base, la pared libre sale hacia fuera por el plano AV (la tricúspide, horizontal); más abajo, por la normal
      const b = Math.min(1, t / 0.35), dx = -nn[0] * b + (-1) * (1 - b), dy = -nn[1] * b + 0.08 * (1 - b), l = Math.hypot(dx, dy) || 1;
      return [p[0] + dx / l * w, p[1] + dy / l * w];
    });
    const TS = sept[0], TL = libre[0];
    const gVd = 4.2 * (e.mioVd ?? 1) / Math.pow(s.fvd, 0.9);
    const cVd = mezcla(sept[Math.round(nS * 0.4)], libre[Math.round(nS * 0.4)], 0.5);
    const vdExt = haciaFuera(libre, gVd, cVd);
    // ---- aurículas: la cúpula sobre su orificio, con el tamaño del motor
    const cupula = (base, o, f, xMin, xMax) => base.map(([x, y]) => { const q = [o[0] + (x - o[0]) * f, o[1] + (y - o[1]) * f]; return [cl(q[0], xMin, xMax), Math.min(q[1], o[1] + 4)]; });
    const oAd = mezcla(TL, TS, 0.5), oAi = mezcla(MA, MP, 0.5);
    const ad = [TS, ...cupula([[100, 106], [99, 86], [90, 66], [70, 56], [48, 58], [30, 68], [22, 88], [24, 108]], oAd, s.fad, -10, AL[0] - 3), TL];
    const ai = [MA, ...cupula([[141, 98], [142, 80], [156, 64], [182, 58], [206, 62], [222, 74], [226, 94], [222, 112]], oAi, s.fai, AR[0] + 3, 270), MP];
    const adC = suave2(ad, 6), aiC = suave2(ai, 6);
    const adExt = haciaFuera(adC, 2.6, [60, 100]), aiExt = haciaFuera(aiC, 2.6, [182, 98]);
    // ---- raíz aórtica (luz y paredes), de la cresta y el anillo hacia arriba
    const yTop = aorta === 'larga' ? -4 : 6;
    const r = (y) => y > 103 ? 15 : 15 + 4.2 * Math.exp(-((y - 90) ** 2) / 50) - (y < 78 ? 0.4 : 0);
    const ys = []; for (let y = 103; y >= yTop; y -= 4) ys.push(y);
    const izq = ys.map((y) => [AO_X - r(y), y]), der = ys.map((y) => [AO_X + r(y), y]);
    izq[0] = AL; der[0] = AR;
    const aoLuz = [S0, ...izq, ...der.slice().reverse(), MA];
    const paredIzq = [...izq, ...desplazar(izq, 3.2).reverse()], paredDer = [...der.slice().reverse(), ...desplazar(der.slice().reverse(), 3.2).reverse()];
    // ---- válvulas
    const coapM = [MP[0] - 34, MP[1] + 15], coapT = mezcla(TL, TS, 0.58).map((v, i) => v + (i ? 15 : 0));
    // abiertas: los velos cuelgan hacia el ventrículo
    const pm = enFraccion(cav, 0.2).p, ps = enFraccion(cav, 0.66).p;           // papilares: anterolateral y posteromedial
    const papAL = mezcla(pm, MB, 0.2), papPM = mezcla(ps, MB, 0.18);
    const velAntAbierto = mezcla(MA, papPM, 0.42), velPostAbierto = mezcla(MP, papAL, 0.34);
    let tipA = mezcla(coapM, velAntAbierto, s.mit), tipP = mezcla([coapM[0] + 2, coapM[1] + 1], velPostAbierto, s.mit);
    // velo posterior suelto (rotura del papilar): en la sístole se va a la aurícula
    const enAi = [MP[0] - 12, MP[1] - 30];
    if (s.flail > 0.01) tipP = mezcla(tipP, mezcla(enAi, velPostAbierto, s.mit), s.flail);
    const pv = enFraccion(libre, 0.5).p, pvC = mezcla(pv, enFraccion(sept, 0.5).p, 0.24);   // papilar del VD
    const tipTs = mezcla(coapT, mezcla(TS, pvC, 0.45), s.tri), tipTa = mezcla([coapT[0] - 1, coapT[1] + 1], mezcla(TL, pvC, 0.4), s.tri);
    const cuspI = mezcla([AO_X - 1, 109], [AL[0] + 3, 86], s.ao), cuspD = mezcla([AO_X + 1, 109], [AR[0] - 3, 85], s.ao);
    // ---- el saco: envolvente de las cuatro cámaras, separado por el líquido
    const solCamaras = [[...viExt, TS], [...vdExt, ...sept.slice().reverse()], [TL, ...adExt, TS], [MA, ...aiExt, MP]];
    const contorno = [...viExt, ...vdExt, ...adExt, ...aiExt];
    const env = envolvente(contorno), cEnv = env.reduce((a, p) => [a[0] + p[0] / env.length, a[1] + p[1] / env.length], [0, 0]);
    const sep = 2.6 + s.liq / 18;
    const saco = cerrada(env.map((p) => { const dx = p[0] - cEnv[0], dy = p[1] - cEnv[1], l = Math.hypot(dx, dy) || 1; return [p[0] + dx / l * sep, p[1] + dy / l * sep]; }), 4);
    const serosa = cerrada(env.map((p) => { const dx = p[0] - cEnv[0], dy = p[1] - cEnv[1], l = Math.hypot(dx, dy) || 1; return [p[0] + dx / l * (sep - 1.6), p[1] + dy / l * (sep - 1.6)]; }), 4);
    // ---- venas: VCS arriba, VCI abajo (su diámetro, de la PVC), dos pulmonares a la derecha
    const vcsA = enFraccion(adC, 0.42).p, vcsB = enFraccion(adC, 0.6).p;
    const vciA = enFraccion(adC, 0.84).p, vciB = enFraccion(adC, 0.96).p;
    const pvs = [0.83, 0.95].map((t) => { const { p, i } = enFraccion(aiC, t); let n = normal(aiC, i); if (n[0] * (p[0] - 182) + n[1] * (p[1] - 98) < 0) n = [-n[0], -n[1]]; const l = Math.hypot(n[0] + 1.2, n[1]); return { p, n: [(n[0] + 1.2) / l, n[1] / l] }; });
    return { solCamaras, sep, cav, viExt, sept, libre, vdExt, TS, TL, ad, ai, adC, aiC, adExt, aiExt, izq, der, aoLuz, paredIzq, paredDer, coapM, tipA, tipP, papAL, papPM, pv, pvC, tipTs, tipTa, cuspI, cuspD, saco, serosa, vcsA, vcsB, vciA, vciB, pvs, s, e, yTop, gVi };
  }

  function dibujar(g) {
    const { s } = g;
    // el saco (y el líquido entre sus hojas)
    // hoja fibrosa (trazo grueso de la unión), el líquido entre las hojas y la serosa (trazo fino), cada una por la unión
    const capa = (sep) => g.solCamaras.map((pts) => Pc(cerrada(sepPts(pts, sep), 2)));
    const hojaF = capa(g.sep), ser = capa(Math.max(0.8, g.sep - 1.6));
    $('saco-g').innerHTML = `<g id="${pre}-saco">${hojaF.map((d) => `<path class="cc-saco" d="${d}"/>`).join('')}</g><g style="--derrame:${f1(cl(s.liq / 260, 0, 1))}">${hojaF.map((d) => `<path class="cc-derrame" d="${d}"/>`).join('')}</g>`
      + `<g>${ser.map((d) => `<path class="cc-saco-serosa" d="${d}"/>`).join('')}</g><g style="--derrame:${f1(cl(s.liq / 260, 0, 1))}">${ser.map((d) => `<path class="cc-derrame" d="${d}"/>`).join('')}</g>`;
    // ---- detrás: las venas (la VCI, por detrás del VD), las pulmonares
    const dv = s.dvci, v0 = mezcla(g.vciA, g.vciB, 0.5), vFin = [-8, 118 + vci];
    const vciPts = suave2([v0, [v0[0] - 12, v0[1] + 16], ...(vci > 70 ? [[-4, 150]] : []), vFin], 8);
    const vciPared = [...desplazar(vciPts, dv / 2 + 1.6), ...desplazar(vciPts, -dv / 2 - 1.6).reverse()];
    const vciLuz = [...desplazar(vciPts, dv / 2), ...desplazar(vciPts, -dv / 2).reverse()];
    let det = `<path class="cc-pared-vena" d="${Pc(vciPared)}"/><path class="cc-sangre-v" d="${Pc(vciLuz)}"/><path class="cc-punteado" d="${Pc(vciLuz)}"/>`;
    for (const { p, n } of g.pvs) {
      const q = [p[0] + n[0] * 28, p[1] + n[1] * 28], eje = suave2([mezcla(p, q, -0.1), q], 4), r = 6;
      const pared = [...desplazar(eje, r + 1.4), ...desplazar(eje, -r - 1.4).reverse()];
      det += `<path class="cc-pared-vaso" d="${Pc(pared)}"/><ellipse class="cc-corte" cx="${f1(q[0])}" cy="${f1(q[1])}" rx="2.6" ry="${f1(r + 1.4)}" transform="rotate(${f1(Math.atan2(n[1], n[0]) * 180 / Math.PI)} ${f1(q[0])} ${f1(q[1])})"/>`
        + `<ellipse class="cc-corte-luz" cx="${f1(q[0])}" cy="${f1(q[1])}" rx="1.4" ry="${f1(r - 1)}" transform="rotate(${f1(Math.atan2(n[1], n[0]) * 180 / Math.PI)} ${f1(q[0])} ${f1(q[1])})"/>`;
    }
    // VCS: sube de la cúpula de la AD, cortada arriba
    const cs = mezcla(g.vcsA, g.vcsB, 0.5), csTop = [cs[0] - 4, -6], vcs = suave2([cs, [cs[0] - 2, cs[1] - 20], csTop], 6);
    det += `<path class="cc-pared-vena" d="${Pc([...desplazar(vcs, 11.5), ...desplazar(vcs, -11.5).reverse()])}"/><path class="cc-sangre-v" d="${Pc([...desplazar(vcs, 10), ...desplazar(vcs, -10).reverse()])}"/>`
      + `<ellipse class="cc-corte" cx="${f1(csTop[0])}" cy="${f1(csTop[1])}" rx="11.5" ry="2.8"/><ellipse class="cc-corte-luz" cx="${f1(csTop[0])}" cy="${f1(csTop[1])}" rx="9" ry="1.8"/>`;
    $('detras').innerHTML = det;

    // ---- el miocardio: silueta de la unión (trazo grueso debajo, relleno encima), trama y fibras
    const solidos = [
      Pc([...g.viExt, g.TS]),                                   // VI con el tabique (cerrado por la base)
      Pc([...g.vdExt, ...g.sept.slice().reverse()]),            // pared libre del VD
      Pc([g.TL, ...g.adExt, g.TS]), Pc([MA, ...g.aiExt, [MP[0] + 8, MP[1] + 2]]),
      Pc([[S0[0] - 1, S0[1]], ...g.paredIzq.slice(0, g.izq.length), ...g.paredDer.slice(g.der.length).reverse(), [MA[0] + 4, MA[1] + 4]]),
    ];
    let cav = `<g>${solidos.map((d) => `<path class="cc-silueta" d="${d}"/>`).join('')}</g><g>${solidos.map((d) => `<path class="cc-tejido" d="${d}"/><path class="cc-trama" d="${d}"/>`).join('')}</g>`;
    // fibras (grabado): rayas cortas de dentro afuera, en el VI y el VD
    let fib = '';
    for (let i = 2; i < g.cav.length - 2; i += 1) { const a = g.cav[i], b = g.viExt[i]; for (const t of [0.2, 0.55]) { const q = mezcla(a, b, t), q2 = mezcla(a, b, t + 0.22); fib += `M${f1(q[0] + (i % 2 ? 0.8 : -0.8))} ${f1(q[1])}L${f1(q2[0])} ${f1(q2[1])}`; } }
    for (let i = 1; i < g.libre.length - 1; i += 1) { const a = g.libre[i], b = g.vdExt[i], q = mezcla(a, b, 0.2), q2 = mezcla(a, b, 0.8); fib += `M${f1(q[0])} ${f1(q[1])}L${f1(q2[0])} ${f1(q2[1])}`; }
    cav += `<path class="cc-fibras" d="${fib}"/>`;
    // las cavidades: sangre (arterial a la izquierda del corazón, venosa a la derecha) y el endocardio
    const viLuz = Pc([...g.cav, S0]), vdLuz = Pc([...g.sept, ...g.libre.slice().reverse()]);
    cav += `<path id="${pre}-ad" class="cc-sangre-v" d="${Pc([...g.adC])}"/><path id="${pre}-ai" class="cc-sangre-a" d="${Pc([...g.aiC])}"/>`
      + `<path id="${pre}-vd" class="cc-sangre-v" d="${vdLuz}"/><path id="${pre}-vi" class="cc-sangre-a" d="${viLuz}"/><path class="cc-sangre-a" d="${Pc(g.aoLuz)}"/>`
      + `<path class="cc-punteado" d="${Pc([...g.adC])}"/><path class="cc-punteado" d="${Pc([...g.aiC])}"/><path class="cc-punteado" d="${vdLuz}"/><path class="cc-punteado" d="${viLuz}"/>`;
    // los orificios (mitral, tricúspide y tracto de salida): la sangre pasa sin línea entre cavidades
    cav += `<path class="cc-sangre-a" d="${Pc([[S0[0] + 1, S0[1] + 4], [S0[0] + 1, 104], [AL[0] + 2, AL[1] + 1], [AR[0] - 2, AR[1] + 1], [MA[0] + 2, MA[1] - 5], [MP[0] - 3, MP[1] - 6], [MP[0] - 3, MP[1] + 6], [MA[0] + 2, MA[1] + 8]])}"/>`
      + `<path class="cc-sangre-v" d="${Pc([[g.TS[0] - 1, g.TS[1] - 6], [g.TL[0] + 3, g.TL[1] - 6], [g.TL[0] + 3, g.TL[1] + 6], [g.TS[0] - 1, g.TS[1] + 6]])}"/>`;
    // trabéculas: en la punta del VI y en la pared libre del VD
    let trab = '';
    for (let i = Math.round(g.cav.length * 0.3); i < g.cav.length * 0.66; i += 2) { const a = g.cav[i], c = [MB[0] + V[0] * 50, MB[1] + V[1] * 50], q = mezcla(a, c, 0.07 + 0.03 * (i % 3)); trab += `M${f1(a[0])} ${f1(a[1])}L${f1(q[0])} ${f1(q[1])}`; }
    for (let i = 3; i < g.libre.length - 2; i += 2) { const a = g.libre[i], b = g.sept[i], q = mezcla(a, b, 0.1 + 0.04 * (i % 2)); trab += `M${f1(a[0])} ${f1(a[1])}L${f1(q[0])} ${f1(q[1])}`; }
    cav += `<path class="cc-trab" d="${trab}"/>`;
    // endocardio (abierto en los orificios) y el tabique interauricular escondido tras la raíz
    cav += `<path class="cc-endo" d="${P(g.cav)}"/><path id="${pre}-tabique" class="cc-endo" d="${P(g.sept)}"/><path class="cc-endo" d="${P(g.libre)}"/>`
      + `<path class="cc-endo" d="${P(g.adC)}"/><path class="cc-endo" d="${P(g.aiC)}"/>`;
    // las bocas de las venas: la luz de cada vena entra en su aurícula (sin pared ni pericardio cruzando la boca)
    const boca = (c, d, r, dentro, fuera, cls) => {
      const l = Math.hypot(d[0], d[1]) || 1, u = [d[0] / l, d[1] / l], w = [-u[1], u[0]];
      const P0 = (k, t) => [c[0] + w[0] * r * k + u[0] * t, c[1] + w[1] * r * k + u[1] * t];
      return `<path class="${cls}" d="${Pc([P0(-1, -dentro), P0(1, -dentro), P0(1, fuera), P0(-1, fuera)])}"/><path class="cc-boca" d="${P([P0(-1, 0), P0(-1, fuera)])}${P([P0(1, 0), P0(1, fuera)])}"/>`;
    };
    const cs0 = mezcla(g.vcsA, g.vcsB, 0.5), vb0 = mezcla(g.vciA, g.vciB, 0.5);
    cav += boca(cs0, [0, -1], 10, 6, 8, 'cc-sangre-v') + boca(vb0, [-12, 16], s.dvci / 2, 6, 4, 'cc-sangre-v')
      + g.pvs.map(({ p, n }) => boca(p, n, 6, 5, 7, 'cc-sangre-a')).join('');
    // la raíz aórtica: paredes con su corte y los senos
    cav += `<path class="cc-pared-vaso" d="${Pc(g.paredIzq)}"/><path class="cc-pared-vaso" d="${Pc(g.paredDer)}"/>`
      + (aorta === 'corta' ? `<ellipse class="cc-corte" cx="${f1(AO_X)}" cy="${f1(g.yTop)}" rx="${f1(18.6)}" ry="3.6"/><ellipse class="cc-corte-luz" cx="${f1(AO_X)}" cy="${f1(g.yTop)}" rx="15" ry="2.6"/>` : '')
;
    $('cav').innerHTML = cav;

    // ---- delante: anillos, válvulas, cuerdas, papilares, banda moderadora, coronarias con su grasa, rótulos
    let d = '';
    // músculo papilar: un dedo de músculo que nace de la pared y acaba en una cabeza redonda (de ahí salen las cuerdas)
    const pap = (raiz, cabeza, w) => {
      const dx = cabeza[0] - raiz[0], dy = cabeza[1] - raiz[1], l = Math.hypot(dx, dy) || 1, u = [dx / l, dy / l], n = [-u[1], u[0]];
      const at = (s2, k) => [raiz[0] + u[0] * s2 + n[0] * k, raiz[1] + u[1] * s2 + n[1] * k], rc = w * 0.62;
      const pts = [at(-2, w * 1.3), at(l * 0.45, w * 0.8), at(l - rc, rc)];
      for (let a = 1; a < 8; a++) { const th = Math.PI / 2 - Math.PI * a / 8; pts.push([cabeza[0] - u[0] * rc + u[0] * rc * Math.cos(th) + n[0] * rc * Math.sin(th), cabeza[1] - u[1] * rc + u[1] * rc * Math.cos(th) + n[1] * rc * Math.sin(th)]); }
      pts.push(at(l - rc, -rc), at(l * 0.45, -w * 0.8), at(-2, -w * 1.3));
      return Pc(suave2(pts, 3));
    };
    const pmRaiz = enFraccion(g.cav, 0.2).p, psRaiz = enFraccion(g.cav, 0.66).p;
    d += `<path class="cc-papilar" d="${pap(pmRaiz, g.papAL, 5)}"/><path class="cc-papilar" d="${pap(psRaiz, g.papPM, 5)}"/>`;
    const vdRaiz = g.pv;
    d += `<path class="cc-papilar" d="${pap(vdRaiz, g.pvC, 3.4)}"/>`;
    // banda moderadora: del tabique a la base del papilar anterior del VD
    const bm0 = enFraccion(g.sept, 0.62).p, bm1 = mezcla(vdRaiz, g.pvC, 0.25);
    d += `<path class="cc-papilar" d="${Pc([...suave2([bm0, mezcla(bm0, bm1, 0.5).map((v, i) => v + (i ? 2 : 0)), bm1], 4), ...suave2([bm1, mezcla(bm0, bm1, 0.5).map((v, i) => v + (i ? 5 : 0)), [bm0[0], bm0[1] + 3]], 4)])}"/>`;
    // cuerdas tendinosas (la rota, suelta y corta)
    const roto = s.flail > 0.5;
    d += `<path class="cc-cuerda" d="${P([g.tipA, g.papPM])}${P([mezcla(MA, g.tipA, 0.7), g.papPM])}${P([g.tipA, g.papAL])}${roto ? P([g.tipP, mezcla(g.tipP, g.papAL, 0.32)]) + P([g.papAL, mezcla(g.papAL, g.tipP, 0.2)]) : P([g.tipP, g.papAL]) + P([mezcla(MP, g.tipP, 0.7), g.papAL])}"/>`;
    d += `<path class="cc-cuerda" d="${P([g.tipTs, g.pvC])}${P([g.tipTa, g.pvC])}${P([mezcla(g.TL, g.tipTa, 0.7), g.pvC])}"/>`;
    // los velos (mitral, tricúspide y aórtica)
    d += `<path id="${pre}-mitral" class="cc-velo" d="${P(velo(MA, g.tipA, 3 * (1 - s.mit) + 2))}${P(velo(MP, g.tipP, -2 - 2 * (1 - s.mit)))}"/>`;
    d += `<path class="cc-velo-fino" d="${P(velo(g.TS, g.tipTs, -2))}${P(velo(g.TL, g.tipTa, 2))}"/>`;
    d += `<path id="${pre}-aortica" class="cc-velo-fino" d="${P(velo(AL, g.cuspI, -3 * (1 - s.ao)))}${P(velo(AR, g.cuspD, 3 * (1 - s.ao)))}"/>`;
    // chorro de la insuficiencia mitral: en la sístole, del orificio a la aurícula
    if (s.flail > 0.3 && s.mit < 0.5) {
      const o = [g.coapM[0] + 6, g.coapM[1] - 4]; let ch = '';
      for (const [dx, dy] of [[-10, -40], [2, -46], [14, -38], [-2, -30]]) ch += P(suave2([o, [o[0] + dx * 0.4, o[1] + dy * 0.45], [o[0] + dx, o[1] + dy]], 5));
      d += `<path class="cc-chorro" d="${ch}" opacity="${f1((1 - s.mit) * s.flail)}"/>`;
    }
    // chorro de la comunicación interventricular (CIV): en la sístole, del VI al VD a través del tabique (con su rótulo, no solo color)
    if (s.civ > 0.3 && s.ao > 0.3) {
      const cVi = mezcla(MB, enFraccion(g.cav, 0.5).p, 0.55), cVd = mezcla(enFraccion(g.sept, 0.38).p, enFraccion(g.libre, 0.38).p, 0.5);
      const o = enFraccion(g.sept, 0.5).p, l = Math.hypot(cVd[0] - cVi[0], cVd[1] - cVi[1]) || 1, u = [(cVd[0] - cVi[0]) / l, (cVd[1] - cVi[1]) / l], w = [-u[1], u[0]];
      const dd = Math.min(32, Math.hypot(cVd[0] - o[0], cVd[1] - o[1]) * 1.1); let ch = '';
      for (const [t, k] of [[1, -9], [1.1, -2], [1, 5], [0.8, 11]]) { const fin = [o[0] + u[0] * dd * t + w[0] * k, o[1] + u[1] * dd * t + w[1] * k]; ch += P(suave2([[o[0] - u[0] * 5, o[1] - u[1] * 5], [o[0] + u[0] * dd * 0.5 + w[0] * k * 0.4, o[1] + u[1] * dd * 0.5 + w[1] * k * 0.4], fin], 5)); }
      d += `<path class="cc-chorro" d="${ch}" opacity="${f1(s.civ * s.ao)}"/><text class="cc-rot" x="${f1(o[0] + u[0] * dd * 0.4 - w[0] * 16 - 6)}" y="${f1(o[1] + u[1] * dd * 0.4 - w[1] * 16 + 3)}" opacity="${f1(s.civ * s.ao)}">CIV</text>`;
    }
    // anillos fibrosos de las válvulas AV (nudos en las bisagras)
    for (const p of [g.TL, g.TS, MA, MP]) d += `<ellipse class="cc-anillo" cx="${f1(p[0])}" cy="${f1(p[1])}" rx="3" ry="2"/>`;
    // surco AV: grasa y coronarias cortadas de través (la derecha junto a la tricúspide, la circunfleja junto a la mitral)
    const cd = [g.TL[0] - 7, g.TL[1] - 1], cx = [MP[0] + 10, MP[1] - 1];
    for (const c of [cd, cx]) d += `<ellipse class="cc-grasa" cx="${f1(c[0])}" cy="${f1(c[1])}" rx="7" ry="5"/><circle class="cc-coronaria" cx="${f1(c[0])}" cy="${f1(c[1])}" r="3.4"/><circle class="cc-coronaria-luz" cx="${f1(c[0])}" cy="${f1(c[1])}" r="1.6"/>`;
    if (rotulos) {
      const cAd = g.adC.reduce((a, p) => [a[0] + p[0] / g.adC.length, a[1] + p[1] / g.adC.length], [0, 0]);
      const cAi = g.aiC.reduce((a, p) => [a[0] + p[0] / g.aiC.length, a[1] + p[1] / g.aiC.length], [0, 0]);
      const cVi = mezcla(MB, enFraccion(g.cav, 0.5).p, 0.55), cVd = mezcla(enFraccion(g.sept, 0.38).p, enFraccion(g.libre, 0.38).p, 0.5);
      d += `<text class="cc-rot" x="${f1(cAd[0] - 8)}" y="${f1(cAd[1] - 2)}">AD</text><text class="cc-rot" x="${f1(cAi[0] - 4)}" y="${f1(cAi[1] - 6)}">AI</text>`
        + `<text class="cc-rot" x="${f1(cVd[0] - 6)}" y="${f1(cVd[1] + 4)}">VD</text><text class="cc-rot" x="${f1(cVi[0] + 4)}" y="${f1(cVi[1] + 12)}">VI</text>`
        + `<text class="cc-rot dim" x="${f1(AO_X - 7)}" y="${f1(g.yTop + 26)}">Ao</text>`;
    }
    $('delante').innerHTML = d;
  }

  return {
    pintar,
    // puntos en coordenadas del grupo (para enganchar cánulas, catéteres y vasos)
    puertos() {
      const g = ult; if (!g) return null;
      const cVi = mezcla(MB, enFraccion(g.cav, 0.5).p, 0.45);
      return { aorta: [AO_X, g.yTop], aortaR: 15, valvAo: [AO_X, 103], vi: cVi, apice: enFraccion(g.cav, 0.5).p, ad: mezcla(g.vciA, g.vciB, 0.5),
        vciEntrada: [mezcla(g.vciA, g.vciB, 0.5)[0] - 6, mezcla(g.vciA, g.vciB, 0.5)[1] + 8], vciAbajo: [-8, 118 + vci], dVci: st.dvci, vcs: [mezcla(g.vcsA, g.vcsB, 0.5)[0] - 4, -6] };
    },
  };
}
