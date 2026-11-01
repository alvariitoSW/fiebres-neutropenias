// Cuenta, en las pruebas de test de MAYEUTICA_OXIGENO, cuáles tienen la correcta como la más larga / la más corta.
const { MAYEUTICA_OXIGENO } = await import(new URL('../../../../js/data/mayeutica/b6b-oxigeno.js', import.meta.url));
const tests = [];
for (const [f, d] of Object.entries(MAYEUTICA_OXIGENO)) {
  for (const q of [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(p => p.pregunta))]) if (q.tipo === 'test') tests.push([q.id, q.opciones]);
}
let larga = 0, corta = 0; const pos = [0, 0, 0];
for (const [id, o] of tests) {
  const l = o.map(x => x.t.length), i = o.findIndex(x => x.ok); pos[i]++;
  const L = l[i] === Math.max(...l), C = l[i] === Math.min(...l); if (L) larga++; if (C) corta++;
  console.log(id, l.join('/'), 'ok#' + i, L ? 'LARGA' : '', C ? 'corta' : '');
}
console.log({ n: tests.length, larga, corta, pos });
