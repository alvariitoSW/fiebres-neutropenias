// Qué piezas corta el plano de una vista y con qué centro (mm en la pantalla). node diag-cortes.mjs [vista] [escenario] [g]
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS } from '../../../../js/modules/eco/escenarios.mjs';
import { construirCorazon, usarDibujo } from '../../../../js/modules/eco/corazon-geo.mjs';
import { estadoGeo, extraDeMotor } from '../../../../js/modules/eco/formas.mjs';
import { planoVista, cortarPieza } from '../../../../js/modules/eco/ecografia.mjs';
const [vista = 'a4c', k = 'normal', g] = process.argv.slice(2);
const m = crearMotor(); m.correr(12); if (k !== 'normal') { ESCENARIOS[k].aplicar(m, +g); m.correr(200); }
const td = m.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a)); const e = estadoGeo(td, extraDeMotor(m));
usarDibujo(2); const P = planoVista(vista, e);
for (const p of construirCorazon(e).partes) { if (!p.idx) continue; const c = cortarPieza(p, P); if (!c.seg.length) continue;
  const xs = c.seg.filter((_, i) => i % 2 === 0), ys = c.seg.filter((_, i) => i % 2 === 1);
  console.log(p.nombre.padEnd(26), c.seg.length / 4, 'x', Math.min(...xs).toFixed(0), Math.max(...xs).toFixed(0), 'y', Math.min(...ys).toFixed(0), Math.max(...ys).toFixed(0)); }
