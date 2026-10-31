// Tiempo por fotograma de formar() en el a4c con el dibujo nuevo (mediana de 15, sin contar el primero que arma la rejilla).
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { construirCorazon } from '../../../../js/modules/eco/corazon-geo.mjs';
import { estadoGeo } from '../../../../js/modules/eco/formas.mjs';
import { planoVista, crearEcografo } from '../../../../js/modules/eco/ecografia.mjs';
import { usarDibujo } from '../../../../js/modules/eco/corazon-geo.mjs';
usarDibujo(2);
const m = crearMotor(); m.correr(12); const o = m.onda, td = o.reduce((a, b) => (b.vvi > a.vvi ? b : a));
const g = construirCorazon(estadoGeo(td, { vviTd: m.ultimo.edv, vvdTd: m.ultimo.edvD, liquidoPeri: 0 }), { pericardio: true, detalle: true });
const ec = crearEcografo({}), P = planoVista('a4c', td); const t = [];
for (let i = 0; i < 16; i++) { const a = performance.now(); ec.formar(g.partes, P); t.push(performance.now() - a); }
t.shift(); t.sort((a, b) => a - b); console.log('formar mediana ms:', t[7].toFixed(1));
