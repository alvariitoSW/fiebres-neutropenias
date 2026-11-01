// v3g: la aorta descendente en el corte de a4c y a4cVd (elementos que salen de elementosDelCorte). uso: ECO_DIBUJO=2 node v3g-aorta.mjs
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { planoVista, elementosDelCorte, enPlano } from '../../../../js/modules/eco/ecografia.mjs';
import { construirCorazon, usarDibujo } from '../../../../js/modules/eco/corazon-geo.mjs';
import { estadoGeo } from '../../../../js/modules/eco/formas.mjs';
usarDibujo(2);
const m = crearMotor(); m.correr(12);
const td = m.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a));
const c = construirCorazon(estadoGeo(td, { vviTd: m.ultimo.edv, vvdTd: m.ultimo.edvD, liquidoPeri: 0 }), { pericardio: true, detalle: true });
for (const v of ['a4c', 'a4cVd']) { const P = planoVista(v, td);
  const el = elementosDelCorte(c.partes, P).filter(e => e.grupo === 'Aorta descendente');
  console.log(v, el.map(e => `${e.tipo} db${e.db} an${e.ancho} seg${e.seg.length}`));
  for (const e of el.filter(e => e.tipo === 'linea')) { const xs = e.seg.filter((_, i) => i % 2 === 0), ys = e.seg.filter((_, i) => i % 2); console.log('  caja u', Math.min(...xs).toFixed(0), Math.max(...xs).toFixed(0), 'prof', Math.min(...ys).toFixed(0), Math.max(...ys).toFixed(0)); } }
{ const P = planoVista('a4cVd', td);
  for (const e of elementosDelCorte(c.partes, P)) { const xs = e.seg.filter((_, i) => i % 2 === 0), ys = e.seg.filter((_, i) => i % 2); if (!xs.length) continue; const u0 = Math.min(...xs), u1 = Math.max(...xs); if (Math.max(...ys) > 150) console.log(e.grupo, e.tipo, 'db', e.db, 'u', u0.toFixed(0), u1.toFixed(0), 'prof', Math.min(...ys).toFixed(0), Math.max(...ys).toFixed(0)); } }
