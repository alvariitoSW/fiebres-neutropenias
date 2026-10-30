// Uso: node autonomo/pruebas/longitud-correcta.mjs js/data/<banco>.js
// Cuenta en cuántas preguntas la opción correcta es la más larga / la más corta, y su posición.
const m = await import('../../' + process.argv[2]);
const b = Object.values(m).find(v => Array.isArray(v) && v[0]?.opciones);
let largo = 0, corto = 0; const pos = {};
b.forEach(q => { const L = q.opciones.map(o => o.length), c = L[q.correcta];
  if (c === Math.max(...L)) largo++; if (c === Math.min(...L)) corto++; pos[q.correcta] = (pos[q.correcta] || 0) + 1;
  if (c === Math.max(...L)) console.log('más larga:', q.id); });
console.log({ total: b.length, largo, corto, pos });
