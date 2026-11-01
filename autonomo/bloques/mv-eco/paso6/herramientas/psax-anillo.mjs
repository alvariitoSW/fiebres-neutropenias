// Eje corto mitral que sigue al anillo: festones que corta en los 5 instantes del latido (normal, dilatada, fallo), fijo (-7) y siguiendo.
// Uso: node autonomo/bloques/mv-eco/paso6/herramientas/psax-anillo.mjs
import { construirCorazon } from '../../../../../js/modules/eco/corazon-geo.mjs';
import { crearMotor } from '../../../../../js/modules/eco/motor.mjs';
import { estadoGeo, extraDeMotor } from '../../../../../js/modules/eco/formas.mjs';
import { planoVista, valvasEnPlano, planoSigueAnillo, enPlano, cortarPieza } from '../../../../../js/modules/eco/ecografia.mjs';
import { aplicarEscenario } from '../../../../../js/modules/eco/escenarios.mjs';
export const latido = (k = 'normal', cada = 40) => { const m = crearMotor(); m.correr(12); if (k !== 'normal') { aplicarEscenario(m, k); m.correr(10); }
  const pico = m.onda.reduce((a, b) => (b.qMit > a.qMit ? b : a)), ex = { ...extraDeMotor(m), vviTd: m.ultimo.edv, vvdTd: m.ultimo.edvD }, td = m.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a));
  return { td: { ...td, vviTd: m.ultimo.edv }, ins: m.onda.filter((x, i) => i % cada === 0 || x === pico).map(s => { const e = estadoGeo(s, ex); return { e, g: construirCorazon(e, { detalle: true }) }; }) }; };
if (process.argv[1].endsWith("psax-anillo.mjs")) for (const k of ["normal", "dilatada", "fallo"]) {
  const { td, ins } = latido(k); const P0 = planoVista('psaxMv', td); let seis = 0; const out = [];
  for (const { e, g } of ins) {
    const P = planoSigueAnillo(P0, g), nom = valvasEnPlano(g.partes, P).filter(x => x.valvula === 'Mitral').map(x => x.nombre);
    const ai = g.partes.filter(p => /^AI/.test(p.nombre)).map(p => p.nombre + ':' + cortarPieza(p, P).seg.length);
    const A = new Set(nom); if (A.size === 6) seis++; out.push(`m${e.mitral.toFixed(2)} d${g.descenso.toFixed(1)} [${[...A].join(',')}] AI ${ai.join(',')}`);
  }
  console.log(k, 'seis en', seis, '\n  ' + out.join('\n  '));
}
