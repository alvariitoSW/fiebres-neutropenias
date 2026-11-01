// Apuesta, «encuentra el error» (2 errores) y caso. Cada opción falsa dice qué le pasaría al paciente. Las respuestas no están en el HTML: salen al contestar.
export function opciones(caja, ops, alResponder, orden0) {
  caja.textContent = ''; const orden = orden0 || ops.map((o, i) => i); delete caja.dataset.hecho;
  for (const i of orden) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'op'; b.textContent = ops[i].t;
    b.addEventListener('click', () => {
      if (caja.dataset.hecho) return; caja.dataset.hecho = '1';
      [...caja.querySelectorAll('.op')].forEach((x, j) => { x.disabled = true; x.classList.add(ops[orden[j]].ok ? 'bien' : (x === b ? 'mal' : 'neutra')); });
      const p = document.createElement('p'); p.className = 'por ' + (ops[i].ok ? 'ok' : 'no'); p.textContent = (ops[i].ok ? 'Bien. ' : 'No. ') + ops[i].por; caja.append(p);
      alResponder(ops[i], i);
    });
    caja.append(b);
  }
}
export const APUESTA = { preset: 'bibi', titulo: 'Apuesta · Bibiana', antes: 'Bibiana lleva un año con prednisona 10 mg y hoy la operan. Su cortisol aleatorio sale 22 µg/dL.', pregunta: '¿Está bien su suprarrenal y qué pides? Elige antes de ver el esquema.', orden: [1, 0, 2],
  ops: [{ t: 'Normal: con 22 la suprarrenal responde y la operas sin cubrirla ni pedir nada más.', ok: false, por: 'Entre 10 y 35 el cortisol no decide; si la glándula está suprimida, la cirugía acaba en hipotensión que no responde al volumen (p. 50-51).' },
    { t: 'Indeterminado: pasas la prueba de ACTH, 250 µg y cortisol a los 60 minutos; un aumento menor de 9 diría supresión.', ok: true, por: 'Un cortisol entre 10 y 35 pide la prueba de ACTH; una subida <9 µg/dL indica supresión (p. 50-51). Tras un año de prednisona, el cable frena el eje.' },
    { t: 'Suprimida: hidrocortisona y listo.', ok: false, por: 'Con 22 no se puede afirmar supresión, que se define por cortisol <10 o aumento <9 (p. 50); se trataría sin saber y se perdería el diagnóstico.' }],
  tras: (a) => a.hacer('acth') };
export const ERROR = { preset: 'lucr', titulo: 'Encuentra el error · Lucrecia', antes: 'Nota de evolución de Lucrecia, tormenta tiroidea. Puede tener 0, 1 o 2 errores: marca cada frase.', frases: [
  { t: 'Propranolol 60-80 mg por vía oral cada 4 horas.', error: false, por: 'Es la pauta de la Tabla 51.3 para la tormenta; en dosis altas bloquea también la conversión T4 → T3 (p. 54).' },
  { t: 'Metimazol 60-80 mg al día como antitiroideo de elección en la tormenta.', error: true, por: 'En la tormenta se prefiere PTU (500-1.000 mg de carga y 250 mg cada 4 horas); también frena T4 → T3 (p. 55).' },
  { t: 'Yoduro potásico solo, 5 gotas cada 6 horas, mientras llega el antitiroideo.', error: true, por: 'El yodo se añade al tratamiento antitiroideo, no lo sustituye: solo no frena la síntesis de T4 (p. 55).' },
  { t: 'Hidrocortisona 300 mg y luego 100 mg cada 8 horas, y tratar la neumonía.', error: false, por: 'La tormenta acelera el metabolismo de los glucocorticoides: profilaxis con 300 mg y 100 mg/8 h, y se trata el desencadenante (p. 55).' }] };
export const CASO = { preset: 'tori', titulo: 'Caso · Toribio', pasos: [
  { enun: 'Toribio, 61: shock séptico, PA 78/40 con noradrenalina 0,4 tras 3 L. Sospechas supresión suprarrenal. ¿Qué haces?', orden: [0, 2, 1],
    ops: [{ t: 'Pides un cortisol aleatorio y esperas el resultado antes de decidir.', ok: false, por: 'En el shock séptico no hace falta el cortisol; esperar deja la hipotensión sin tratar (p. 51).' },
      { t: 'Hidrocortisona 100 mg IV cada 8 horas ya, sin esperar el cortisol.', ok: true, por: 'Con hipotensión refractaria al volumen y al vasopresor, se prueba hidrocortisona sin medir el cortisol (p. 51).', haz: (a) => a.hacer('hc') },
      { t: 'Pasas la prueba de ACTH y tratas solo si la subida es menor de 9.', ok: false, por: 'El shock séptico es la excepción a la prueba (p. 51): mientras esperas, Toribio sigue hipotenso.' }] },
  { enun: 'Día 3: noradrenalina retirada y lactato 1,6. ¿Y la hidrocortisona?', antes: (a) => a.hacer('dia', { v: 3 }),
    ops: [{ t: 'La retiras hoy de golpe: ya no hay shock.', ok: false, por: 'La retirada brusca produce un rebote de mediadores proinflamatorios (p. 51); Toribio volvería a tener fiebre y PA lábil.' },
      { t: 'La bajas poco a poco durante varios días, ya sin vasopresor y con lactato normal.', ok: true, por: 'Se retira cuando no hace falta el vasopresor y el lactato se normalizó, con una bajada gradual de al menos unos días (p. 51).', haz: (a) => a.hacer('ret') },
      { t: 'La mantienes a 100 mg cada 8 horas hasta el alta, por si acaso.', ok: false, por: 'Se retira al resolverse la causa (p. 51); mantenerla sin motivo expone a Toribio a más corticoide.' }] },
  { enun: 'Día 5: otro residente la había parado de golpe el día 4 y hoy Toribio rebota con fiebre y PA lábil. ¿Por qué?', orden: [1, 2, 0],
    ops: [{ t: 'Rebote de mediadores proinflamatorios por la retirada brusca.', ok: true, por: 'Por eso la retirada es gradual, durante al menos unos días (p. 51).' },
      { t: 'La hidrocortisona produce fiebre medicamentosa al quitarla.', ok: false, por: 'La ficha no lo dice: atribuirlo al fármaco dejaría sin explicar la hipotensión y se seguiría retirando de golpe.' },
      { t: 'La suprarrenal ya se había atrofiado en cuatro días.', ok: false, por: 'La atrofia exige semanas de corticoide; con menos de 10-14 días el eje se recupera pronto (Younes 2017).' }] }] };
export const LLEVAS = { apuesta: [['Un cortisol entre 10 y 35 µg/dL no decide: se pasa la prueba de ACTH.', '51:mu-sr-practica'], ['Una subida menor de 9 indica supresión.', '50:mu-sr-acth']], error: [['En la tormenta, PTU y no metimazol.', '55:mu-tabla-51-4'], ['El yodo se añade al antitiroideo.', '55:mu-ti-yodo']], caso: [['En el shock séptico no se espera al cortisol: hidrocortisona 100 mg/8 h.', '51:mu-sr-practica'], ['La hidrocortisona se retira poco a poco.', '51:mu-sr-retirada']] };
