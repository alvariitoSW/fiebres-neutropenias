// Lista los tests de un archivo de Mayéutica donde la buena es la más larga/corta (uso: node largos-6b.mjs archivo.js)
const M = Object.values(await import(new URL(process.argv[2], 'file://' + process.cwd() + '/')));
const L = s => s.replace(/<[^>]+>/g, '').length;
const qs = [];
for (const grupo of M) for (const [f, d] of Object.entries(grupo)) { qs.push(...d.guia, ...d.examen); d.casos.forEach(c => c.pasos.forEach(p => qs.push(p.pregunta))); }
let lg = 0, co = 0, n = 0; const pos = [0, 0, 0, 0];
for (const q of qs) { if (q.tipo !== 'test') continue; n++; const ls = q.opciones.map(o => L(o.t)); const i = q.opciones.findIndex(o => o.ok); pos[i]++;
  const mx = ls[i] === Math.max(...ls), mn = ls[i] === Math.min(...ls); if (mx) lg++; if (mn) co++; console.log(q.id, ls.join('/'), 'ok#' + i, mx ? 'LARGA' : '', mn ? 'corta' : ''); }
console.log({ n, larga: lg, corta: co, pos });
