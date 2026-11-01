// Cuenta como jueces-forma.mjs (el empate cuenta como extremo; sin HTML): larga y corta por ficha de SDRA y oxígeno.
import { MAYEUTICA_SDRA } from '../../../../js/data/mayeutica/b3d-sdra.js';
import { MAYEUTICA_OXIGENO } from '../../../../js/data/mayeutica/b3d-oxigeno.js';
const strip = s => s.replace(/<[^>]+>/g, '');
for (const [k, f] of Object.entries({ ...MAYEUTICA_SDRA, ...MAYEUTICA_OXIGENO })) {
  const qs = [...(f.guia || []), ...(f.examen || []), ...(f.casos || []).flatMap(c => c.pasos.map(p => p.pregunta).filter(Boolean))].filter(q => q.tipo === 'test');
  const co = [], la = [];
  for (const q of qs) { const L = q.opciones.map(o => strip(o.t).length), i = q.opciones.findIndex(o => o.ok);
    if (L[i] === Math.min(...L)) co.push(q.id + ':' + L.join('/')); if (L[i] === Math.max(...L)) la.push(q.id); }
  console.log(k, 'n', qs.length, 'máx', Math.floor(qs.length / 3), 'larga', la.length, 'corta', co.length, co.join(' '));
}
