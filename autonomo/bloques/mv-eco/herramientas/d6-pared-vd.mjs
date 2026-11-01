// D6 · ¿cabe la pared libre del VD en el sector del A4C y con qué brillo? (dibujo nuevo, telediástole)
//   node autonomo/bloques/mv-eco/herramientas/d6-pared-vd.mjs
// Para normal, HP g=1 y TEP g=1: ángulo del haz (giro), apertura (mitad), rango angular y profundidad del epicardio del VD
// y de la pared lateral del VI en el plano, fracción del VD dentro del sector, y brillo (0-255) de tabique / pared libre VD / pared lateral VI.
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS } from '../../../../js/modules/eco/escenarios.mjs';
import { construirCorazon, usarDibujo } from '../../../../js/modules/eco/corazon-geo.mjs';
import { estadoGeo, extraDeMotor } from '../../../../js/modules/eco/formas.mjs';
import { planoVista, crearEcografo, MEJORAS_DEFECTO } from '../../../../js/modules/eco/ecografia.mjs';
const ec = crearEcografo({}), res = (a, b) => [a[0]-b[0], a[1]-b[1], a[2]-b[2]], dot = (a, b) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
import { PARED_VD_NUEVO } from '../../../../js/data/eco-tejidos.js';
if (process.env.VDDB) PARED_VD_NUEVO.db = +process.env.VDDB;
usarDibujo(2);
for (const [esc, g] of [['normal'], ['hp', 1], ['tep', 1]]) {
  const m = crearMotor(); m.correr(12);
  if (esc !== 'normal') { const E = ESCENARIOS[esc] || ESCENARIOS[Object.keys(ESCENARIOS).find(k => k.startsWith(esc))]; E.aplicar(m, g); m.correr(E.forma ? 200 : 40); }
  const td = m.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a));
  const geo = construirCorazon(estadoGeo(td, extraDeMotor(m)), { pericardio: true, detalle: true });
  const P = planoVista('a4c', td);
  // puntos de los epicardios en el plano (|n|<5 mm)
  const pts = (nombre) => { const a = []; for (const p of geo.partes) { if (!new RegExp(nombre).test(p.nombre)) continue;
    for (let i = 0; i < p.pos.length; i += 3) { const q = res([p.pos[i], p.pos[i+1], p.pos[i+2]], P.O); if (Math.abs(dot(q, P.n)) < 5 && dot(q, P.d) > 20) a.push([Math.atan2(dot(q, P.r), dot(q, P.d)), dot(q, P.d)]); } } return a; };
  const rep = (n, re) => { const a = pts(re); if (!a.length) return `${n}: sin puntos`;
    const an = a.map(x => x[0]), pr = a.map(x => x[1]), fuera = a.filter(x => Math.abs(x[0]) > P.mitad || x[1] > P.prof).length;
    return `${n}: ang ${Math.min(...an).toFixed(2)}..${Math.max(...an).toFixed(2)} prof máx ${Math.max(...pr).toFixed(0)} fuera ${(100*fuera/a.length).toFixed(0)}%`; };
  console.log(`${esc} g=${g ?? '-'} | mitad ${P.mitad.toFixed(2)} rad (${(P.mitad*360/Math.PI).toFixed(0)}° total) prof ${P.prof} | giro d·eje ${Math.atan2(P.d[1], P.d[0]).toFixed(2)}`);
  console.log('  ' + rep('VD', 'VD'), '|', rep('VI', 'VI'));
  const im = ec.formar(geo.partes, P, { ref: geo.partes, t: 0, m: { ...MEJORAS_DEFECTO } });
  const T = (re) => new Set([...im.etiquetas].filter(([k]) => re.test(k)).map(([, v]) => v));
  const tVI = T(/^VI$/), tVD = T(/^VD$/);
  const cel = (f) => { const a = []; for (let q = 0; q < im.tag.length; q++) if (f(im.tag[q])) a.push(q); return a; };
  const wVI = cel(t => tVI.has(t)), wVD = cel(t => tVD.has(t));
  const gris = (q) => { const px = Math.round(im.cx + im.x[q] * im.escala), py = Math.round(im.arriba + im.y[q] * im.escala); if (px < 0 || py < 0 || px >= im.ancho || py >= im.alto) return null; const k = 4 * (py * im.ancho + px); return (im.pix[k] + im.pix[k+1] + im.pix[k+2]) / 3; };
  const med = (a) => { const v = a.map(gris).filter(x => x != null); return v.length > 15 ? (v.reduce((s, x) => s + x, 0) / v.length).toFixed(0) + ' (n' + v.length + ')' : '-'; };
  const cen = (a) => [a.reduce((s, q) => s + im.x[q], 0) / a.length, a.reduce((s, q) => s + im.y[q], 0) / a.length];
  const cVI = cen(wVI), cVD = cen(wVD), ax = [cVD[0]-cVI[0], cVD[1]-cVI[1]], ln = Math.hypot(...ax) || 1;
  const pj = (q) => ((im.x[q]-cVI[0])*ax[0] + (im.y[q]-cVI[1])*ax[1]) / ln;
  const cuarto = (a, alto) => { const o = [...a].sort((p, q) => pj(p) - pj(q)), n = Math.floor(o.length/4); return alto ? o.slice(-n) : o.slice(0, n); };
  // brillo en el punto medio endo→epi de la pared libre (VD: lado izquierdo de la imagen, ángulo < −0,25; VI lateral: ángulo > 0,35) y fuera del sector
  const plano = (re, lado) => { const a = []; for (const p of geo.partes) { if (!re.test(p.nombre)) continue; for (let i = 0; i < p.pos.length; i += 3) { const q = res([p.pos[i], p.pos[i+1], p.pos[i+2]], P.O); if (Math.abs(dot(q, P.n)) < 3 && dot(q, P.d) > 20) { const x = dot(q, P.r), y = dot(q, P.d), t = Math.atan2(x, y); if (lado(t)) a.push([x, y, t]); } } } return a; };
  const gp = (x, y) => { const px = Math.round(im.cx + x * im.escala), py = Math.round(im.arriba + y * im.escala); if (px < 0 || py < 0 || px >= im.ancho || py >= im.alto) return null; const k = 4 * (py * im.ancho + px); return (im.pix[k] + im.pix[k+1] + im.pix[k+2]) / 3; };
  const pared = (n, reE, reP, lado) => { const E = plano(reE, lado), Pp = plano(reP, lado); if (!E.length || !Pp.length) return `${n}: sin puntos`; const v = [];
    for (const e of E) { let b = Pp[0], dm = Infinity; for (const p of Pp) { const d = Math.hypot(p[0]-e[0], p[1]-e[1]); if (d < dm) { dm = d; b = p; } } const g = gp((e[0]+b[0])/2, (e[1]+b[1])/2); if (g != null) v.push(g); }
    const mx = Math.max(...[...E, ...Pp].map(p => Math.abs(p[2])));
    return `${n}: brillo medio pared ${(v.reduce((s,x)=>s+x,0)/v.length).toFixed(0)} (n${v.length}), ángulo máx ${mx.toFixed(2)} (borde ${P.mitad.toFixed(2)}, margen ${(P.mitad-mx).toFixed(2)})`; };
  console.log('  ' + pared('pared libre VD', /^VD endocardio$/, /^VD epicardio$/, t => t < -0.25));
  console.log('  ' + pared('pared lateral VI', /^VI endocardio$/, /^VI epicardio$/, t => t > 0.35));
  console.log('  VDtodo', med(wVD), 'tags', [...tVD].join(','), 'VItodo', med(wVI));
  console.log(`  brillo: tabique ${med(cuarto(wVI, true))} | pared libre VD ${med(cuarto(wVD, false))} | pared lateral VI ${med(cuarto(wVI, false))}`);
}
