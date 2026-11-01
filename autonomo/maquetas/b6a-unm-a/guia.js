// Explicación guiada por paciente: 4-5 pasos que encienden una zona del dibujo (.foco). t texto · z zonas · p cita «pág:id» · o origen · paso del ciclo · haz [acción, veces o {opciones}]
export const GUIAS = {
  mel: ['Melquíades · rocuronio', [
    { t: 'Llega el impulso: el terminal del nervio guarda la acetilcolina (ACh) en vesículas. Las copas de la placa esperan al otro lado.', z: ['nervio'], paso: 1, p: '24:mn-miastenia', o: 'fisiología general; ficha' },
    { t: 'Las vesículas liberan la ACh a la hendidura: las bolitas verdes cruzan hacia las copas.', z: ['hend'], paso: 2, p: '24:mn-miastenia', o: 'fisiología general; ficha' },
    { t: 'Pulsa «Hazlo»: el rocuronio es un tapón cuadrado que ocupa la copa sin abrirla. Compite con la ACh: copas bloqueadas, la fibra no se contrae y el TOF cae a 0.', z: ['copas', 'pulgar'], paso: 3, p: '29:mn-bnm-rocuronio', o: 'ficha (Tabla 46.7)', haz: [['roc', 2], ['t', { v: 5 }]], btn: 'Rocuronio 1 mg/kg' },
    { t: 'Las tijeras (acetilcolinesterasa) cortan la ACh. La neostigmina las frena y la ACh se acumula hasta ganar la competición, pero solo si el bloqueo es moderado y tarda 8-45 min; no más de 70 µg/kg.', z: ['hend', 'copas'], paso: 4, p: '31:mn-bnm-neostigmina', o: 'ficha', haz: [['neo', 1]], btn: 'Neostigmina 35 µg/kg' },
    { t: 'El sugammadex es un anillo que envuelve al rocuronio y lo saca de la hendidura: 16 mg/kg justo tras la intubación, 2-3 min. Pulsa «Hazlo».', z: ['copas', 'pulgar', 'cv'], paso: 5, p: '31:mn-bnm-sugammadex', o: 'ficha', haz: [['sug', { v: 16 }], ['t', { v: 3 }]], btn: 'Sugammadex 16 mg/kg' }]],
  sera: ['Serapio · miastenia', [
    { t: 'En la miastenia, anticuerpos (las Y rojas) rompen las copas: quedan menos receptores. El porcentaje de receptores es ilustrativo.', z: ['copas'], paso: 3, p: '24:mn-mg-anticuerpos', o: 'ficha; porcentaje ilustrativo' },
    { t: 'Con estímulo repetido la respuesta decae: cada sacudida gasta ACh y quedan pocas copas libres. Por eso empeora con la actividad y mejora con el reposo.', z: ['pulgar'], paso: 3, p: '24:mn-miastenia', o: 'ficha; magnitud ilustrativa', haz: [['est', { v: true }]], btn: 'Estímulo repetido' },
    { t: 'Prueba del hielo: 2 minutos sobre el párpado con ptosis; más de 2 mm de mejoría es positiva. El mecanismo no lo explica Marino: otra fuente pendiente.', z: ['copas'], paso: 3, p: '25:mn-mg-hielo', o: 'ficha', haz: [['hielo', 2]], btn: 'Hielo 2 min' },
    { t: 'La CV (1,26 L, 18 mL/kg) y la PIM (−30) son el semáforo: se intuba con CV ≤15 mL/kg (o <1 L) o PIM −20. Un aminoglucósido empeora la placa: pulsa «Hazlo».', z: ['cv'], paso: 3, p: '25:mn-mg-intubacion', o: 'ficha; CV y PIM del modelo ilustrativas', haz: [['gent', 1]], btn: 'Gentamicina' }]],
};
export function crearGuia({ caja, hacer, cita, setFoco }) {
  let g = null, i = 0;
  const cerrar = () => { caja.hidden = true; g = null; setFoco([], 0); };
  function paso(k) {
    i = Math.max(0, Math.min(g[1].length - 1, k)); const p = g[1][i]; caja.hidden = false; setFoco(p.z, p.paso);
    caja.innerHTML = `<h3>${g[0]} · paso ${i + 1} de ${g[1].length}</h3><p class="enun">${p.t} <span class="org">${p.o}</span> ${cita(p.p)}</p><div class="fila-g">${p.haz ? `<button type="button" class="b prim" data-g="haz">Hazlo: ${p.btn}</button>` : ''}<button type="button" data-g="ant" ${i ? '' : 'disabled'}>‹ Anterior</button><button type="button" data-g="sig">${i < g[1].length - 1 ? 'Siguiente ›' : 'Cerrar'}</button></div>`;
  }
  caja.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-g]'); if (!b || !g) return; const a = b.dataset.g, p = g[1][i];
    if (a === 'ant') paso(i - 1); else if (a === 'sig') { if (i < g[1].length - 1) paso(i + 1); else cerrar(); }
    else if (a === 'haz') { for (const [acc, op] of p.haz) { if (typeof op === 'number') for (let n = 0; n < op; n++) hacer(acc); else hacer(acc, op || {}); } setFoco(p.z, p.paso); }
  });
  return { abrir: (clave) => { if (!GUIAS[clave]) return cerrar(); g = GUIAS[clave]; paso(0); }, cerrar };
}
