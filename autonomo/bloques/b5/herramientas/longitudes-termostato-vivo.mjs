// Uso: node autonomo/bloques/b5/herramientas/longitudes-termostato-vivo.mjs
// Usa la misma recogida que el juez de forma: qué tests del termostato vivo tienen la buena como la más larga o la más corta.
import { pathToFileURL } from 'node:url';
const RAIZ = new URL('../../../../', import.meta.url).pathname;
const mod = await import(pathToFileURL(RAIZ + 'js/data/termostato-vivo-mayeutica.js').href);
const sin = s => String(s || '').replace(/<[^>]+>/g, '');
const vistos = new Map();
const rec = v => { if (Array.isArray(v)) v.forEach(rec); else if (v && typeof v === 'object') { if (v.tipo === 'test' && v.opciones && v.id) vistos.set(v.id, v); else if (v.opciones && v.id && !v.tipo) vistos.set(v.id, v); Object.values(v).forEach(rec); } };
rec(Object.values(mod));
for (const q of vistos.values()) { if (!q.opciones.some(o => o.ok)) continue;
  const L = q.opciones.map(o => sin(o.t).length), b = q.opciones.findIndex(o => o.ok);
  const tag = L[b] === Math.max(...L) ? 'LARGA' : L[b] === Math.min(...L) ? 'corta' : '';
  console.log(q.id, q.tipo || '-', L.join('/'), 'buena#' + (b + 1), tag); }
