// Diagnóstico de la pieza 223 (festones mitrales en el dibujo nuevo): qué festones corta cada vista en cada instante
// del latido normal y la separación A2-P2 (bordes libres) abierta y cerrada en los escenarios de la prueba #18.
// Uso: node autonomo/bloques/mv-eco/paso6/herramientas/festones-223.mjs [nivelPsaxMv]
import { construirCorazon } from '../../../../../js/modules/eco/corazon-geo.mjs';
import { crearMotor } from '../../../../../js/modules/eco/motor.mjs';
import { estadoGeo, extraDeMotor } from '../../../../../js/modules/eco/formas.mjs';
import { planoVista, valvasEnPlano } from '../../../../../js/modules/eco/ecografia.mjs';
import { aplicarEscenario } from '../../../../../js/modules/eco/escenarios.mjs';
const latido = (k = 'normal', cada = 40) => { const m = crearMotor(); m.correr(12); if (k !== 'normal') { aplicarEscenario(m, k); m.correr(10); }
  const pico = m.onda.reduce((a, b) => (b.qMit > a.qMit ? b : a)), ex = { ...extraDeMotor(m), vviTd: m.ultimo.edv, vvdTd: m.ultimo.edvD }, td = m.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a));
  return { td: { ...td, vviTd: m.ultimo.edv }, ins: m.onda.filter((x, i) => i % cada === 0 || x === pico).map(s => { const e = estadoGeo(s, ex); return { e, g: construirCorazon(e, { detalle: true }) }; }) }; };
const { td, ins } = latido();
const V = Object.fromEntries(['plax', 'a3c', 'a4c', 'a2c', 'psaxMv'].map(v => [v, planoVista(v, td)]));
for (const { e, g } of ins) {
  const f = (v) => valvasEnPlano(g.partes, V[v]).filter(x => x.valvula === 'Mitral').map(x => x.nombre + ':' + x.largo.toFixed(0)).join(',');
  console.log(`mit ${e.mitral.toFixed(2)} | plax ${f('plax')} | a3c ${f('a3c')} | a4c ${f('a4c')} | a2c ${f('a2c')} | psaxMv ${f('psaxMv')}`);
}
for (const k of ['normal', 'fallo', 'dilatada', 'hipertrofia']) {
  const { ins: I } = latido(k, 60); const out = [];
  for (const { e, g } of I) { const ant = g.partes.find(p => p.nombre === 'Mitral anterior'), pos = g.partes.find(p => p.nombre === 'Mitral posterior');
    const [ni, nj] = ant.malla, v = (p, i, j) => [0, 1, 2].map(t => p.pos[(i * (nj + 1) + j) * 3 + t]);
    const a = v(ant, ni / 2, nj), b = v(pos, ni / 2, nj); if (e.mitral === 0 || e.mitral > 0.8) out.push(`${e.mitral > 0 ? 'ab' : 'ce'} ${Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]).toFixed(1)}`); }
  console.log(k, out.join(' '));
}
