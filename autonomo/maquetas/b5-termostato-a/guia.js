// Explicación guiada: 4 pasos que señalan el dibujo (foco) y, algunos, hacen algo en el modelo («Hazlo»).
export const GUIA = ['Dial frente a termómetro', [
  { t: 'El hipotálamo es un termostato: el dial fija el punto de ajuste y el termómetro enseña la temperatura real. Si la real queda por debajo, la caldera calienta; si queda por encima, el radiador enfría.', z: 'dial', p: '45', o: 'ficha' },
  { t: 'Pulsa «Pirógeno 38,3 y 1 h»: el dial sube a 38,3 °C. El cuerpo persigue el dial: tirita (≈1 °C por hora) hasta llegar. Eso es fiebre: regulación normal con un punto más alto.', z: 'termo', p: '45', o: 'ficha; ritmo de subida ≈1 °C/h', haz: 'fiebre', btn: 'Pirógeno 38,3 y 1 h' },
  { t: 'El antipirético mueve el dial, no el termómetro: pulsa «Paracetamol 1 g» y el ajuste baja; la real lo seguirá con el sudor.', z: 'dial', p: '72', o: 'ficha (efecto sobre el dial); cifra ilustrativa', haz: 'anti', btn: 'Paracetamol 1 g' },
  { t: 'Hipertermia es otra cosa: el dial sigue en 37 °C y la carga de calor desborda al radiador. Pulsa «Esfuerzo 2 h y paracetamol»: la temperatura sube y el antipirético no hace nada.', z: 'radiador', p: '45', o: 'ficha; cargas ilustrativas', haz: 'hiper', btn: 'Esfuerzo 2 h y paracetamol' }]];
export function crearGuia({ caja, accion, cita, foco }) {
  let i = 0, activa = false;
  const cerrar = () => { caja.hidden = true; activa = false; foco(null); };
  function paso(k) { i = Math.max(0, Math.min(GUIA[1].length - 1, k)); const p = GUIA[1][i]; activa = true; caja.hidden = false; foco(p.z);
    caja.innerHTML = `<h3>${GUIA[0]} · paso ${i + 1} de ${GUIA[1].length}</h3><p class="enun">${p.t} <span class="org">${p.o}</span> ${cita(p.p)}</p><div class="fila-g">${p.haz ? `<button type="button" class="b prim" data-g="haz">Hazlo: ${p.btn}</button>` : ''}<button type="button" data-g="ant" ${i ? '' : 'disabled'}>‹ Anterior</button><button type="button" data-g="sig">${i < GUIA[1].length - 1 ? 'Siguiente ›' : 'Terminar'}</button></div>`; }
  caja.addEventListener('click', (ev) => { const b = ev.target.closest('[data-g]'); if (!b || !activa) return; const a = b.dataset.g;
    if (a === 'ant') paso(i - 1); else if (a === 'sig') { if (i < GUIA[1].length - 1) paso(i + 1); else cerrar(); } else if (a === 'haz') accion(GUIA[1][i].haz); });
  return { abrir: () => paso(0), cerrar };
}
