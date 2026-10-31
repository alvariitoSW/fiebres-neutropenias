// Lista los tests de la Mayéutica del pulmón donde la buena es la más larga (o la más corta). Uso: node …/forma-largas.mjs
import * as M from '../../../../js/data/pulmon-vivo-mayeutica.js';
const sin = (s) => String(s ?? '').replace(/<[^>]+>/g, '');
const vistos = new Set(); let larga = 0, corta = 0, n = 0;
const rec = (o) => { if (!o || typeof o !== 'object') return; if (Array.isArray(o)) return o.forEach(rec); if (o.tipo === 'test' && o.opciones && !vistos.has(o.id)) { vistos.add(o.id); n++;
  const L = o.opciones.map((x) => sin(x.t).length), b = o.opciones.findIndex((x) => x.ok), mx = Math.max(...L), mn = Math.min(...L);
  const esL = L[b] === mx, esC = L[b] === mn; if (esL) larga++; if (esC) corta++;
  console.log(`${o.id}\t${L.join('/')}\tbuena#${b}${esL ? ' LARGA' : ''}${esC ? ' CORTA' : ''}`); } Object.values(o).forEach(rec); };
rec(Object.values(M)); console.log({ n, larga, corta });
