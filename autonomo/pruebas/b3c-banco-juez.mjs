// Mide, sin navegador, la posición y la longitud de la buena en los tests de b3c-taqui-1/2 (como el juez de mayeutica-fichas).
// Uso: node autonomo/pruebas/b3c-banco-juez.mjs
const { MAYEUTICA_TAQUI_1 } = await import(new URL('../../js/data/mayeutica/b3c-taqui-1.js', import.meta.url));
const { MAYEUTICA_TAQUI_2 } = await import(new URL('../../js/data/mayeutica/b3c-taqui-2.js', import.meta.url));
const len = o => o.t.replace(/<[^>]+>/g, '').length;
for (const [n, M] of [['taqui-1', MAYEUTICA_TAQUI_1], ['taqui-2', MAYEUTICA_TAQUI_2]]) {
  let N = 0, L = 0, C = 0; const cortas = [], largas = [];
  for (const [f, d] of Object.entries(M)) {
    const qs = [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(x => x.pregunta))].filter(q => q.tipo === 'test');
    const pos = {}; let largaF = 0;
    for (const q of qs) { const i = q.opciones.findIndex(o => o.ok), ls = q.opciones.map(len); pos[i + 1] = (pos[i + 1] || 0) + 1; N++;
      if (ls[i] === Math.max(...ls)) { L++; largaF++; largas.push(q.id); } if (ls[i] === Math.min(...ls)) { C++; cortas.push(q.id); } }
    console.log(f, 'tests', qs.length, 'pos', JSON.stringify(pos), 'más larga', largaF, 'maxPos', Math.max(...Object.values(pos)), '/ límite', (qs.length * 0.6).toFixed(1));
  }
  console.log(n, 'tests', N, 'más larga', L, 'más corta', C, '(límite', (N / 3).toFixed(1) + ')', cortas.join(" "), "| largas:", largas.join(" "));
}
