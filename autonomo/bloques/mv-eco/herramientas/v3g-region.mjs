// v3g: caja de regionZoom en a4cVd (normal y TEP g=1). uso: ECO_DIBUJO=2 node v3g-region.mjs
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { planoVista, regionZoom } from '../../../../js/modules/eco/ecografia.mjs';
import { usarDibujo } from '../../../../js/modules/eco/corazon-geo.mjs';
import { estadoGeo } from '../../../../js/modules/eco/formas.mjs';
usarDibujo(2);
const m = crearMotor(); m.correr(12);
const td = m.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a));
const est = estadoGeo(td, { vviTd: m.ultimo.edv, vvdTd: m.ultimo.edvD, liquidoPeri: 0 });
const P = planoVista('a4cVd', est); const r = regionZoom(P, est);
console.log('region', JSON.stringify(r, (k, v) => typeof v === 'number' ? +v.toFixed(0) : v), 'prof', P.prof);
