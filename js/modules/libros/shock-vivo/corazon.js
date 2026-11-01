// El paciente (maqueta b3-shock v2): el corazón en corte de cinco cámaras (la pieza común js/core/corazon-corte.js) movido
// por el MISMO motor que el monitor (volúmenes de las cuatro cámaras, válvulas, tabique, derrame del saco, PVC), con los
// pulmones y su edema, la VCI y una arteriola en su lupa (la resistencia del motor). El «Recorrido» de cada aparato, en
// un torso de frente con su caja torácica, la aorta entera y las venas. Y la eco de «¿Qué shock es?»: el ecógrafo de la
// app (js/modules/eco/ecografia.mjs) sobre el corazón de la app, en apical de cuatro cámaras, del mismo motor.
import { crearCorazonCorte, instalarCorazonCorte } from '../../../core/corazon-corte.js';
import { suave2 } from '../../../core/dibujo-iso.js';
import { aplanamientoSeptal, estadoGeo, extraDeMotor } from '../../eco/formas.mjs';
import { modeloVci } from '../../eco/abdomen.mjs';
import { planoVista, crearEcografo } from '../../eco/ecografia.mjs';
import { construirCorazon } from '../../eco/corazon-geo.mjs';

const f1 = (n) => Math.round(n * 10) / 10;
const cl = (x, a, b) => Math.max(a, Math.min(b, x));
const P = (pts) => 'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L');
const mezcla = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
instalarCorazonCorte();
export const W = 360, H = 270;

// El tabique: aplanado por la presión (formas.mjs) y, si el VD tiene el doble de volumen que el VI (Marino cap. 16, p. 40:
// el VD dilatado empuja el tabique hacia el VI), abombado hacia el VI (más allá de plano, hasta 1,35 del corte)
const septoCorte = (s) => { const t = cl(((s.vvd ?? 0) / Math.max(1, s.vvi ?? 1) - 1.5) / 1.5, 0, 1); return aplanamientoSeptal(s) * (1 + 0.35 * t * t * (3 - 2 * t)); };
// Lo que el corte lee del motor en este instante (una sola lectura por fotograma)
export function estadoCorte(cab) {
  const m = cab.m, s = m.s, u = cab.lectura?.u;
  return { vvi: s.vvi, vvd: s.vvd, vai: s.vai, vad: s.vad, vMit: s.vMit, vTri: s.vTri, vAo: s.vAo, septo: septoCorte(s),
    liquidoPeri: s.liquidoPeri ?? m.p.liquidoPeri ?? 0, dVci: modeloVci(u?.pvc ?? 4).dmax, flail: (m.p.eroaMitral || 0) >= 0.5, civ: (m.p.civ || 0) >= 0.2, mioVi: m.p.mioVi ?? 1, mioVd: m.p.mioVd ?? 1 };
}

// ---------------------------------------------------------------- los pulmones (grabado): lóbulos, cisuras, bronquios
function pulmones() {
  const der = 'M74 52 C52 58 30 92 20 140 C12 182 10 226 18 258 C40 266 70 262 84 252 C90 214 92 160 90 112 C88 82 84 62 74 52Z';
  const izq = 'M290 92 C312 102 336 132 344 170 C350 206 350 236 344 260 C322 268 292 264 280 252 C276 222 278 184 280 150 C281 124 284 104 290 92Z';
  const cis = 'M22 168 C44 158 70 146 88 132 M30 214 C50 202 70 192 88 186 M282 156 C302 176 324 196 344 214';
  // bronquios: del hilio hacia fuera (acaban dentro del pulmón)
  const br = 'M86 120 L70 128 L56 140 M70 128 L64 112 M86 150 L66 166 L48 186 M66 166 L62 198 M282 140 L300 150 L316 166 M300 150 L306 134 M282 176 L304 196 L320 222 M304 196 L298 230';
  return `<path class="pulmon" d="${der}"/><path class="pulmon" d="${izq}"/><path class="cisura" d="${cis}"/><path class="bronquio" d="${br}"/>`;
}
// gotas del edema: en las bases, más cuanto más edema calcula el motor
function gotas(vEdema) {
  const v = vEdema || 0, n = Math.min(60, Math.round(v / 12)), r = (2.6 + Math.min(2.4, v / 400)).toFixed(1); let h = '';
  // desde ~1.000 mL, un velo en las bases (el pulmón anegado); las gotas, más y mayores cuanto más edema
  if (v >= 1000) h += '<ellipse cx="50" cy="250" rx="42" ry="22" class="gota" opacity=".28"/><ellipse cx="312" cy="250" rx="42" ry="22" class="gota" opacity=".28"/>';
  for (let j = 0; j < n; j++) { const izq = j % 2 === 0, k = Math.floor(j / 2), x = izq ? 22 + (k * 17) % 58 : 284 + (k * 13) % 56, y = 262 - ((k * 23) % 70) - (k > 10 ? 30 : 0); h += `<circle cx="${x}" cy="${y}" r="${r}" class="gota"/>`; }
  return h;
}
// la arteriola de cerca: adventicia, media con sus células musculares, endotelio y la luz con dos hematíes
function arteriola(rLuz) {
  const cx = 318, cy = 40, R = 25, rm = cl(rLuz + 2, 5, 19), n = 14;
  let cel = '';
  const rMed = (R - 3 + rm) / 2, esp = Math.max(1.6, (R - 3 - rm) / 2);
  for (let i = 0; i < n; i++) { const a = 2 * Math.PI * i / n, x = cx + rMed * Math.cos(a), y = cy + rMed * Math.sin(a); cel += `<ellipse class="art-celula" cx="${f1(x)}" cy="${f1(y)}" rx="${f1(Math.PI * rMed / n * 0.95)}" ry="${f1(esp * 0.9)}" transform="rotate(${f1(a * 180 / Math.PI + 90)} ${f1(x)} ${f1(y)})"/>`; }
  return `<circle cx="${cx}" cy="${cy}" r="${R + 3}" class="lupa-aro"/><circle cx="${cx}" cy="${cy}" r="${R}" class="art-adv"/><circle cx="${cx}" cy="${cy}" r="${R - 3}" class="art-pared"/>${cel}`
    + `<circle id="cor-art-luz" cx="${cx}" cy="${cy}" r="${f1(rLuz)}" class="art-luz"/><circle cx="${cx}" cy="${cy}" r="${f1(rLuz)}" class="art-endo"/>`
    + `<ellipse cx="${f1(cx - rLuz * 0.3)}" cy="${f1(cy + rLuz * 0.15)}" rx="${f1(Math.min(3.4, rLuz * 0.42))}" ry="${f1(Math.min(1.6, rLuz * 0.2))}" class="hematie-g"/><ellipse cx="${f1(cx + rLuz * 0.35)}" cy="${f1(cy - rLuz * 0.25)}" rx="${f1(Math.min(3.4, rLuz * 0.42))}" ry="${f1(Math.min(1.6, rLuz * 0.2))}" class="hematie-g" transform="rotate(30 ${f1(cx + rLuz * 0.35)} ${f1(cy - rLuz * 0.25)})"/>`;
}

// ---------------------------------------------------------------- el paciente
export function montarCorazon(svg) {
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = `<g class="grabado"><g id="cor-pulmon">${pulmones()}</g><g id="cor-gotas"></g>
    <g id="cor-corazon" transform="translate(70 30) scale(.86)"></g>
    <g id="cor-arteriola"></g>
    <text x="318" y="80" class="rot-g" text-anchor="middle">arteriola</text><text x="318" y="90" class="rot-g dim" text-anchor="middle">(la resistencia)</text>
    <text x="80" y="262" class="rot-g">VCI</text></g>`;
  const c = crearCorazonCorte(svg.querySelector('#cor-corazon'), { pre: 'cor', vci: 160, aorta: 'corta' });
  const gg = svg.querySelector('#cor-gotas'), ga = svg.querySelector('#cor-arteriola');
  let edPrev = -1, rPrev = -1;
  // capa propia del shock vivo sobre el corte: el cortocircuito VI → VD (grosor ∝ Qp/Qs) y el flujo pulmonar como cifra
  const capaCiv = document.createElementNS('http://www.w3.org/2000/svg', 'g'); capaCiv.id = 'cor-civ'; svg.querySelector('#cor-corazon').append(capaCiv);
  let civPrev = '';
  const pintarCiv = (cab) => {
    const orif = cab.m.p.civ || 0, qpqs = cab.lectura?.u?.qpqs ?? 1, sept = svg.querySelector('#cor-tabique'), vd = svg.querySelector('#cor-vd');
    if (orif < 0.2 || qpqs < 1.05 || !sept || !vd) { if (civPrev) { civPrev = ''; capaCiv.innerHTML = ''; } return; }
    const a = sept.getBBox(), b = vd.getBBox(), q = f1(cl(qpqs, 1, 3));
    const k = q + '|' + f1(a.x) + f1(a.y) + f1(b.x) + f1(b.y); if (k === civPrev) return; civPrev = k;
    const ax = a.x + a.width / 2, ay = a.y + a.height * 0.5, bx = b.x + b.width * 0.55, w = f1(2 + 5 * (q - 1));   // grosor: ilustrativo
    const rojo = 'fill:none;stroke:color-mix(in srgb, var(--accent-red) 70%, var(--text-main));stroke-linecap:round', txt = 'font:600 11px system-ui,sans-serif;fill:var(--text-main);paint-order:stroke;stroke:var(--bg-main);stroke-width:2px';
    // el corte no dibuja el tronco pulmonar: el flujo pulmonar va como cifra (Qp/Qs), no como un arco inventado
    capaCiv.innerHTML = `<path d="M${f1(ax + 4)} ${f1(ay)}L${f1(bx)} ${f1(ay - 2)}" style="${rojo};stroke-width:${w}" opacity=".6"/><path d="M${f1(bx + 4)} ${f1(ay - 5)}L${f1(bx)} ${f1(ay - 2)}L${f1(bx + 4)} ${f1(ay + 1)}" style="${rojo};stroke-width:1.6"/>`
      + `<text x="${f1(b.x + 2)}" y="${f1(ay - w / 2 - 6)}" style="${txt}">VI → VD</text>`
      + `<text x="${f1(b.x + 2)}" y="${f1(ay - w / 2 - 20)}" style="${txt}">al pulmón ×${String(q).replace('.', ',')} (Qp/Qs)</text>`;
  };
  return {
    pintar(cab, dt = 1 / 60, quieto = false) {
      if (!cab?.m) return;
      c.pintar(estadoCorte(cab), dt, quieto);
      pintarCiv(cab);
      const L = cab.lectura, ed = Math.round((L?.u?.vEdema || 0) / 12) + (L?.u?.vEdema >= 1000 ? 1000 : 0);
      if (ed !== edPrev) { edPrev = ed; gg.innerHTML = gotas(L?.u?.vEdema); }
      // la luz de la arteriola con la resistencia (Poiseuille: r ∝ R^-1/4; fisiología general)
      const r = f1(cl(12 * Math.pow(1488 / Math.max(300, L?.u?.rvs ?? 1488), 0.25), 4, 17));
      if (r !== rPrev) { rPrev = r; ga.innerHTML = arteriola(r); }
    },
  };
}

// ---------------------------------------------------------------- el paciente de frente: torso, vasos y corazón
// Un grupo en coordenadas propias (360 × 270, línea media en x = 180). Lo usan el «Recorrido» (tal cual) y el circuito
// del ECMO (escalado, a la izquierda de la máquina). La aorta sale del puerto del corte (su raíz) y la VCI llega al suyo:
// así el catéter, la cánula y la sangre recorren los vasos dibujados y acaban donde dice la fuente.
const COR_T = { x: 137, y: 46, k: 0.36 };
export const aFrente = ([x, y]) => [COR_T.x + x * COR_T.k, COR_T.y + y * COR_T.k];
const IL_D = suave2([[188, 204], [178, 218], [166, 236], [158, 254], [154, 270]], 6), IL_I = suave2([[188, 204], [198, 218], [210, 236], [218, 254], [222, 270]], 6);
const VENA_D = suave2([[144, 270], [148, 254], [158, 236], [168, 220], [176, 206]], 6), VENA_I = suave2([[232, 270], [228, 254], [220, 236], [208, 220], [182, 206]], 6);
const TRONCOS = [[[0, 0], [-4, -16], [-8, -30]], [[7, -2], [7, -18], [7, -30]], [[14, 0], [22, -14], [32, -24]]];
export const RUTAS = {
  balon: { txt: 'Arteria femoral → ilíaca → aorta descendente; la punta, justo por debajo de la subclavia izquierda (p. 45).', art: true },
  impella: { txt: 'Arteria femoral → aorta → cayado → aorta ascendente → a través de la válvula aórtica, hasta el VI (p. 47).', art: true },
  ecmo: { txt: 'Cánula venosa: vena femoral → cava inferior, hasta cerca de la AD. Cánula arterial: arteria femoral; la sangre sube por la aorta al revés (p. 48).', art: false },
};
function torso() {
  // el contorno: cuello, hombros, brazos cortados, costados, cintura, caderas y muslos
  const piel = 'M160 0 C160 8 156 12 146 16 C120 22 92 24 74 34 C60 42 56 60 56 84 L54 128 M200 0 C200 8 204 12 214 16 C240 22 268 24 286 34 C300 42 304 60 304 84 L306 128'
    + ' M84 70 C88 110 90 150 100 182 C104 198 100 212 96 230 C92 248 96 262 100 270 M276 70 C272 110 270 150 260 182 C256 198 260 212 264 230 C268 248 264 262 260 270'
    + ' M54 128 C60 130 68 128 74 124 M306 128 C300 130 292 128 286 124 M100 270 L260 270 M180 186 m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0';
  const claviculas = 'M180 22 C164 22 140 26 108 30 C100 31 96 34 94 37 M180 22 C196 22 220 26 252 30 C260 31 264 34 266 37';
  let cost = '';
  for (let k = 0; k < 9; k++) {
    const y = 34 + k * 12.5, dx = 30 + k * 6.5 + (k < 4 ? k * 4 : 16), caida = 14 + k * 1.2;
    cost += `M174 ${y} C${174 - dx * 0.4} ${y - 4} ${174 - dx * 0.9} ${y + 2} ${174 - dx} ${y + caida} M186 ${y} C${186 + dx * 0.4} ${y - 4} ${186 + dx * 0.9} ${y + 2} ${186 + dx} ${y + caida}`;
  }
  const esternon = 'M174 24 L186 24 L187 40 L185 44 L186 116 L180 128 L174 116 L175 44 L173 40 Z';
  const reborde = 'M180 128 C170 140 150 154 124 164 M180 128 C190 140 210 154 236 164';
  const diafragma = 'M96 148 C110 126 140 120 170 134 C176 136 184 136 190 134 C220 120 250 126 264 148';
  const pulmonD = 'M150 34 C120 40 98 80 96 140 C112 132 136 126 160 132 C164 100 164 60 150 34Z';
  const pulmonI = 'M210 34 C240 40 262 80 264 140 C248 132 226 128 214 132 C216 100 214 60 210 34Z';
  let vert = ''; for (let k = 0; k < 18; k++) { const y = 26 + k * 12; vert += `<rect x="173" y="${y}" width="14" height="10" rx="2" class="vertebra"/>`; }
  const pelvis = 'M118 206 C112 222 116 238 130 246 C146 254 160 252 170 258 L190 258 C200 252 214 254 230 246 C244 238 248 222 242 206 C232 214 214 220 196 222 L180 230 L164 222 C146 220 128 214 118 206Z';
  const agujeros = 'M146 238 C152 234 162 236 166 244 C160 248 150 246 146 238Z M214 238 C208 234 198 236 194 244 C200 248 210 246 214 238Z';
  return `<path class="piel" d="${piel}"/><path class="pulmon" d="${pulmonD}"/><path class="pulmon" d="${pulmonI}"/><g class="fr-gotas"></g>${vert}`
    + `<path class="hueso" d="${pelvis}"/><path class="hueso-l" d="${agujeros}"/><circle cx="132" cy="250" r="8" class="hueso"/><circle cx="228" cy="250" r="8" class="hueso"/>`
    + `<path class="costilla" d="${cost}"/><path class="hueso" d="${esternon}"/><path class="clavicula" d="${claviculas}"/><path class="cartilago" d="${reborde}"/><path class="diafragma" d="${diafragma}"/>`;
}
// el nudo de una bifurcación: la pared antes de los tubos y la luz después (tapa las bocas de los tubos)
const nudoPared = (p, w, cls) => `<path class="${cls}-pared" d="M${f1(p[0])} ${f1(p[1])}h.01" stroke-width="${f1(w + 1.6)}" stroke-linecap="round"/>`;
const nudoLuz = (p, w, cls) => `<path class="${cls}" d="M${f1(p[0])} ${f1(p[1])}h.01" stroke-width="${f1(w)}" stroke-linecap="round"/>`;
const tuboV = (pts, w, cls, cap = 'round') => `<path class="${cls}-pared" d="${P(pts)}" stroke-width="${f1(w + 1.6)}" stroke-linecap="${cap}"/><path class="${cls}" d="${P(pts)}" stroke-width="${f1(w)}" stroke-linecap="${cap}"/>`;
function gotasFrente(vEdema) {
  const n = Math.min(30, Math.round((vEdema || 0) / 30)); let h = '';
  for (let j = 0; j < n; j++) { const izq = j % 2 === 0, k = Math.floor(j / 2), x = izq ? 108 + (k * 11) % 44 : 222 + (k * 13) % 36, y = 128 - ((k * 17) % 46); h += `<circle cx="${x}" cy="${y}" r="1.5" class="gota"/>`; }
  return h;
}
export function montarFrente(grupo, { pre = 'fr' } = {}) {
  grupo.innerHTML = `<g class="fr-torso">${torso()}</g><g class="fr-venas"></g><g class="fr-arterias"></g>
    <g class="fr-rios"></g><g class="fr-cor" transform="translate(${COR_T.x} ${COR_T.y}) scale(${COR_T.k})"></g>`;
  const c = crearCorazonCorte(grupo.querySelector('.fr-cor'), { pre, rotulos: false, vci: 10, aorta: 'larga', saco: true });
  c.pintar({}, 1, true);
  const pu = c.puertos(), raiz = aFrente(pu.aorta), r = pu.aortaR * 2 * COR_T.k;   // la luz de la raíz, en el dibujo
  const aorta = suave2([raiz, [raiz[0], raiz[1] - 6], [raiz[0] + 6, raiz[1] - 14], [raiz[0] + 18, raiz[1] - 18], [raiz[0] + 28, raiz[1] - 12], [raiz[0] + 31, raiz[1] + 2], [raiz[0] + 28, 80], [raiz[0] + 22, 120], [raiz[0] + 16, 160], [188, 204]], 8);
  const cayado = aorta.reduce((a, p) => (p[1] < a[1] ? p : a));
  const troncos = TRONCOS.map((t) => suave2(t.map(([x, y]) => [cayado[0] - 9 + x, cayado[1] + 2 + y]), 5));
  const vciE = aFrente(pu.vciAbajo), vci = suave2([[176, 206], [172, 176], [168, 140], [vciE[0] + 4, vciE[1] + 12], vciE], 6);
  grupo.querySelector('.fr-venas').innerHTML = nudoPared([176, 206], 5.4, 'vaso-v') + nudoPared([181, 206], 4.4, 'vaso-v') + tuboV(VENA_D, 4.4, 'vaso-v', 'butt') + tuboV(VENA_I, 4.4, 'vaso-v', 'butt') + tuboV(vci, pu.dVci * COR_T.k * 1.4, 'vaso-v', 'butt') + nudoLuz([176, 206], 5.4, 'vaso-v') + nudoLuz([181, 206], 4.4, 'vaso-v');
  // renales (dos ramas cortas a cada lado) y la aorta, de la raíz a la bifurcación
  const ren = [[aorta[Math.round(aorta.length * 0.72)], -1], [aorta[Math.round(aorta.length * 0.74)], 1]].map(([p, l]) => suave2([p, [p[0] + l * 14, p[1] + 2]], 2));
  grupo.querySelector('.fr-arterias').innerHTML = nudoPared([188, 204], 5.6, 'vaso-a') + troncos.map((t) => tuboV(t, 3.2, 'vaso-a')).join('') + ren.map((t) => tuboV(t, 2, 'vaso-a')).join('')
    + tuboV(aorta, r, 'vaso-a', 'butt') + tuboV(IL_D, 4.6, 'vaso-a', 'butt') + tuboV(IL_I, 4.6, 'vaso-a', 'butt') + nudoLuz([188, 204], 5.6, 'vaso-a');
  const subcl = troncos[2][0];
  return {
    c, puertos: pu, rios: grupo.querySelector('.fr-rios'), aorta, IL_D, IL_I, VENA_D, VENA_I, vci, cayado, subcl,
    vi: aFrente(pu.vi), valvAo: aFrente(pu.valvAo), vciEntrada: aFrente(pu.vciEntrada),
    pintar(cab, dt, quieto) {
      if (!cab?.m) return;
      c.pintar(estadoCorte(cab), dt, quieto);
      grupo.querySelector('.fr-gotas').innerHTML = gotasFrente(cab.lectura?.u?.vEdema);
    },
  };
}
export function montarRecorrido(svg) {
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = `<g class="grabado"><g id="rec-frente"></g>
    <path id="rec-ruta" class="ruta"/><path id="rec-ruta2" class="ruta"/><g id="rec-punta"></g>
    <text x="140" y="266" class="rot-g" text-anchor="end">femoral</text></g>`;
  const F = montarFrente(svg.querySelector('#rec-frente'), { pre: 'rec' });
  // las rutas, por la luz de los vasos dibujados: el balón se queda bajo la subclavia; el Impella cruza la válvula
  const iSub = F.aorta.findIndex((p) => p[0] > F.subcl[0] + 2 && p[1] > F.subcl[1] + 6);
  const rutas = {
    balon: [...F.IL_D.slice().reverse(), ...F.aorta.slice(Math.max(0, iSub)).reverse()],
    impella: [...F.IL_D.slice().reverse(), ...F.aorta.slice().reverse(), F.valvAo, F.vi],
    ecmo: [...F.VENA_D, ...F.vci.slice(0, -1), F.vciEntrada],
  };
  const ruta2Ecmo = F.IL_I.slice().reverse().slice(0, 8);
  // el tramo que va por DENTRO del corazón (la raíz, la válvula y el VI) se pinta encima; el resto, por detrás del corazón
  const dentro = { impella: [aFrente(F.puertos.aorta), F.valvAo, F.vi] };
  let tipo = 'balon', t = 0;
  const ruta = svg.querySelector('#rec-ruta'), ruta2 = svg.querySelector('#rec-ruta2'), punta = svg.querySelector('#rec-punta');
  const rutaDentro = ruta.cloneNode(); rutaDentro.id = 'rec-ruta-dentro'; ruta.after(rutaDentro);
  F.rios.appendChild(ruta);   // por detrás del corazón (la aorta descendente pasa por detrás)
  function poner(k) {
    tipo = k;
    rutaDentro.setAttribute('d', dentro[k] ? P(dentro[k]) : ''); rutaDentro.setAttribute('class', 'ruta ruta-art');
    ruta.setAttribute('d', P(rutas[k])); ruta.setAttribute('class', 'ruta ' + (RUTAS[k].art ? 'ruta-art' : 'ruta-ven'));
    ruta2.setAttribute('d', k === 'ecmo' ? P(ruta2Ecmo) : ''); ruta2.setAttribute('class', 'ruta ruta-art');
    t = 0;
  }
  poner('balon');
  return {
    poner,
    tick(dt, quieto, cab) {
      F.pintar(cab, dt, quieto);
      // la punta recorre la ruta (la inserción) y se queda en su sitio un momento
      t = quieto ? 1 : (t + dt / 3.4) % 1.4;
      const L = ruta.getTotalLength(), x = Math.min(1, t) * L, p = ruta.getPointAtLength(x);
      punta.innerHTML = `<circle cx="${f1(p.x)}" cy="${f1(p.y)}" r="2.4" class="punta"/>`;
      ruta.style.strokeDasharray = `${f1(x)} ${f1(L + 1)}`;
      if (dentro[tipo]) { const Ld = rutaDentro.getTotalLength(), xd = Math.max(0, x - (L - Ld)); rutaDentro.style.strokeDasharray = `${f1(xd)} ${f1(Ld + 1)}`; }
      if (tipo === 'ecmo') { const L2 = ruta2.getTotalLength(); ruta2.style.strokeDasharray = `${f1(Math.min(1, t) * L2)} ${f1(L2 + 1)}`; }
    },
    get texto() { return RUTAS[tipo].txt; },
  };
}

// ---------------------------------------------------------------- la eco de «¿Qué shock es?»
// El ecógrafo de la app sobre el corazón de la app (el mismo motor que el monitor): apical de cuatro cámaras, un latido en
// 14 fotogramas, que se repite. Las imágenes se forman de una en una (cada una ~40 ms) para no parar la página.
export function crearEco(canvas) {
  const AN = 360, AL = 270, N = 14;
  canvas.width = AN; canvas.height = AL;
  const ctx = canvas.getContext('2d');
  const tok = (n) => getComputedStyle(canvas).getPropertyValue(n).trim();   // colores: los tokens de la app
  const eco = crearEcografo({ ancho: AN, alto: AL });
  let fotos = [], T = 1, t = 0, pend = null, gen = 0, info = null;
  function preparar(cab) {
    const m = cab.m, o = m.onda; gen++; const mia = gen;
    fotos = []; t = 0;
    const td = o.reduce((a, x) => (x.vvi > a.vvi ? x : a)), extra = extraDeMotor(m), estTd = estadoGeo(td, extra);
    const plano = planoVista('a4c', estTd), ref = construirCorazon(estTd, { pericardio: true }).partes;
    T = Math.max(0.3, o[o.length - 1].t - o[0].t);
    const muestras = Array.from({ length: N }, (_, i) => o[Math.min(o.length - 1, Math.round(i * (o.length - 1) / N))]);
    ctx.fillStyle = tok('--bg-main'); ctx.fillRect(0, 0, AN, AL);
    let i = 0;
    const una = () => {
      if (mia !== gen) return;
      const s = muestras[i], g = construirCorazon(estadoGeo(s, extra), { pericardio: true });
      const im = eco.formar(g.partes, plano, { ref, t: s.t ?? 0 });
      fotos.push(new ImageData(new Uint8ClampedArray(im.pix), AN, AL)); info = { k: im.escala, top: im.arriba, cx: im.cx, prof: plano.prof };
      if (i === 0) dibujar(0);
      if (++i < N) pend = requestAnimationFrame(una);
    };
    cancelAnimationFrame(pend); pend = requestAnimationFrame(una);
  }
  function dibujar(k) {
    if (!fotos[k]) return;
    ctx.putImageData(fotos[k], 0, 0);
    // rótulo de la vista y la regla de profundidad (marcas cada cm, la de 5 más larga), como en la pantalla del ecógrafo
    ctx.fillStyle = tok('--text-main'); ctx.font = '600 12px system-ui, sans-serif'; ctx.fillText('A4C', 10, 18);
    ctx.font = '11px system-ui, sans-serif'; if (fotos.length < N) ctx.fillText('formando la imagen…', 10, 33);
    if (info) {
      ctx.strokeStyle = tok('--text-main'); ctx.lineWidth = 1;
      for (let cm = 0; cm * 10 <= info.prof; cm++) { const y = info.top + cm * 10 * info.k; ctx.beginPath(); ctx.moveTo(AN - 6, y); ctx.lineTo(AN - (cm % 5 ? 10 : 16), y); ctx.stroke(); if (cm && cm % 5 === 0) ctx.fillText(String(cm), AN - 32, y + 4); }
    }
  }
  return {
    preparar,
    tick(dt, quieto) {
      if (!fotos.length) return;
      t = quieto ? 0 : (t + dt) % T;
      const k = Math.min(fotos.length - 1, Math.floor(t / T * N));
      dibujar(k);
    },
    parar() { gen++; cancelAnimationFrame(pend); },
  };
}
