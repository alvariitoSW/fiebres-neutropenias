// Explicación guiada de Hilario: 4 pasos que señalan el dibujo (foco) y abren su lupa.
export const GUIA = ['Hilario · de la sangre a la cara', [
  { t: 'El hígado convierte el amonio en urea. Con la mitad de los hepatocitos sanos, parte del NH₃ pasa de largo.', lupa: 'higado', z: 'higado', p: '6', o: 'ficha' },
  { t: 'El amonio que escapa entra en el astrocito, fabrica glutamina y arrastra agua: edema citotóxico. El grado se lee en la cara (West Haven).', lupa: 'cabeza', z: 'cabeza', p: '6t', o: 'ficha' },
  { t: 'Pulsa «Poner TIPS»: el puente salta el hígado, el amonio sube y la cara pasa de grado.', lupa: 'higado', z: 'higado', p: '10', o: 'ficha (dirección); cifra ilustrativa', haz: ['tips'], btn: 'Poner TIPS' },
  { t: 'Pulsa «Lactulosa 2-3»: acidifica el colon, desaparecen las bacterias que fabrican NH₃ y el amonio baja.', lupa: 'abdomen', z: 'abdomen', p: '7', o: 'ficha (dirección); cifra ilustrativa', haz: ['lac', 3], btn: 'Lactulosa 2-3' }]];
export function crearGuia({ caja, accion, cita, lupa, foco }) {
  let i = 0, activa = false;
  const cerrar = () => { caja.hidden = true; activa = false; foco(null); };
  function paso(k) { i = Math.max(0, Math.min(GUIA[1].length - 1, k)); const p = GUIA[1][i]; activa = true; caja.hidden = false; lupa(p.lupa); foco(p.z);
    caja.innerHTML = `<h3>${GUIA[0]} · paso ${i + 1} de ${GUIA[1].length}</h3><p class="enun">${p.t} <span class="org">${p.o}</span> ${cita(p.p)}</p><div class="fila-g">${p.haz ? `<button type="button" class="b prim" data-g="haz">Hazlo: ${p.btn}</button>` : ''}<button type="button" data-g="ant" ${i ? '' : 'disabled'}>‹ Anterior</button><button type="button" data-g="sig">${i < GUIA[1].length - 1 ? 'Siguiente ›' : 'Terminar'}</button></div>`; }
  caja.addEventListener('click', (ev) => { const b = ev.target.closest('[data-g]'); if (!b || !activa) return; const a = b.dataset.g;
    if (a === 'ant') paso(i - 1); else if (a === 'sig') { if (i < GUIA[1].length - 1) paso(i + 1); else cerrar(); } else if (a === 'haz') { accion(...GUIA[1][i].haz); lupa(GUIA[1][i].lupa); } });
  return { abrir: () => paso(0), cerrar };
}
