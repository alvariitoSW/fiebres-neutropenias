// Longitud de la opción buena en los tests de b3d-vni.js (la buena, la más larga/corta en ≤⅓ cada una). Uso: node …/e5-largas.mjs
import { MAYEUTICA_VNI as V } from '../../../../js/data/mayeutica/b3d-vni.js';
const sin = s => String(s ?? '').replace(/<[^>]+>/g, '');
let n = 0, la = 0, co = 0; const pos = [0, 0, 0];
const rec = o => { if (!o || typeof o !== 'object') return; if (Array.isArray(o)) return o.forEach(rec);
  if (o.tipo === 'test' && o.opciones) { n++; const L = o.opciones.map(x => sin(x.t).length), b = o.opciones.findIndex(x => x.ok);
    const l = L[b] === Math.max(...L), c = L[b] === Math.min(...L); if (l) la++; if (c) co++; pos[b]++;
    console.log(o.id, L.join('/'), 'buena#' + b, l ? 'LARGA' : '', c ? 'CORTA' : ''); }
  Object.values(o).forEach(rec); };
rec(V); console.log({ n, larga: la, corta: co, pos });
