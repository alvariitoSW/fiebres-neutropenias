// Rejuicio final b3-pulmon-estudio (profesor): forma de los tests de las 21 fichas b3d con el `barajar` real
// (larga / corta como jueces-forma: el empate cuenta como extremo; posición de la buena en el orden que se ve),
// cuántos errores tiene cada «encuentra el error» (REGLAS §8: 0, 1 o 2 y al menos uno por ficha que no sea de 2),
// absolutos en opciones («siempre», «nunca», «cualquier», «ninguna/o») y cadenas que se repiten entre preguntas.
// Uso: node forma-b3d-final.mjs
import { readdirSync } from 'node:fs';
const { barajar } = await import(new URL('../../../../js/core/mayeutica-motor.js', import.meta.url));
const dir = new URL('../../../../js/data/mayeutica/', import.meta.url);
const strip = s => String(s || '').replace(/<[^>]+>/g, '');
const files = readdirSync(dir).filter(f => /^b3d-.*\.js$/.test(f)).sort();
for (const f of files) {
  const mod = await import(new URL(f, dir));
  const bancos = Object.values(mod)[0];
  for (const [k, ficha] of Object.entries(bancos)) {
    const todas = [...(ficha.guia || []), ...(ficha.examen || []), ...(ficha.casos || []).flatMap(c => c.pasos.map(p => p.pregunta).filter(Boolean))];
    const tests = todas.filter(q => q.tipo === 'test');
    const co = [], la = [], pos = [0, 0, 0, 0, 0];
    for (const q of tests) {
      const L = q.opciones.map(o => strip(o.t).length), i = q.opciones.findIndex(o => o.ok);
      if (L[i] === Math.min(...L)) co.push(`${q.id}(${L[i] - Math.min(...L.filter((_, j) => j !== i))})`);
      if (L[i] === Math.max(...L)) la.push(`${q.id}(+${L[i] - Math.max(...L.filter((_, j) => j !== i))})`);
      const vis = barajar(q.opciones, q.id); pos[vis.findIndex(o => o.ok)]++;
    }
    const errores = todas.filter(q => q.tipo === 'error').map(q => `${q.id}:${(q.frases || []).filter(x => x.e || x.err || x.mal).length}/${(q.frases || []).length}`);
    const abs = [];
    for (const q of tests) for (const o of q.opciones) if (/\b(siempre|nunca|cualquier|ningun[oa]?|todos los|jamás)\b/i.test(strip(o.t))) abs.push(`${q.id}${o.ok ? '✓' : '✗'}`);
    const max = Math.floor(tests.length / 3);
    const flag = (la.length > max ? ' LARGA>⅓' : '') + (co.length > max ? ' CORTA>⅓' : '') + (Math.max(...pos) > tests.length / 2 ? ' POSICIÓN>½' : '');
    console.log(`\n## ${k} (${f}) · tests ${tests.length} · máx ⅓ = ${max}${flag}`);
    console.log(`  larga ${la.length}: ${la.join(' ')}`);
    console.log(`  corta ${co.length}: ${co.join(' ')}`);
    console.log(`  posición: ${pos.slice(0, Math.max(...tests.map(q => q.opciones.length))).join('/')}`);
    console.log(`  errores: ${errores.join(' ')}`);
    if (abs.length) console.log(`  absolutos: ${abs.join(' ')}`);
    // repeticiones: opciones buenas o puntos de destapa de >40 letras iguales entre preguntas distintas
    const vistos = new Map();
    for (const q of todas) {
      const trozos = q.tipo === 'test' ? q.opciones.filter(o => o.ok).map(o => strip(o.t)) : q.tipo === 'destapa' ? (q.puntos || []).map(p => strip(p.t || p)) : [];
      for (const t of trozos) { const key = t.toLowerCase().replace(/\W+/g, ' ').trim().slice(0, 60); if (key.length < 40) continue; if (vistos.has(key) && vistos.get(key) !== q.id) console.log(`  repite: ${vistos.get(key)} = ${q.id} «${t.slice(0, 50)}…»`); else vistos.set(key, q.id); }
    }
  }
}
