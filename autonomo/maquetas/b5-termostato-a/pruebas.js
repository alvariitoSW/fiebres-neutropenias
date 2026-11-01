// Apuesta, «encuentra el error» y caso de Ovidio. Las respuestas viven aquí, no en el HTML. Cada opción falsa dice qué le pasaría al paciente.
export const APUESTA = {
  preset: 'dorotea',
  antes: 'Dorotea, 55 años, shock séptico de origen urinario, tiene 39,6 °C.',
  pregunta: '¿Le baja la mortalidad el paracetamol?',
  ops: [
    { t: 'No: en la sepsis la mortalidad baja cuanto más sube la temperatura, así que no se suprime la fiebre de rutina.', ok: true, por: 'Fig. 44.5 (p. 70-71): relación inversa entre temperatura inicial y mortalidad hospitalaria en 2.225 pacientes; un estudio halló más mortalidad con antipiréticos (p. 70).' },
    { t: 'Sí: bajar el dial a 37 °C alivia el esfuerzo del corazón y Dorotea llega mejor a la noche; hay que darlo a todos los febriles.', ok: false, por: 'Le quitarías la defensa que la fiebre le da contra la infección y el dial bajaría sin que mejore su supervivencia (p. 70-71).' },
    { t: 'Sí, pero con manta de enfriamiento, que baja la real más rápido que el paracetamol.', ok: false, por: 'La manta en la fiebre es contraproducente: Dorotea tiritaría y tendría vasoconstricción para volver a subir la temperatura (p. 72).' }],
  orden: [1, 0, 2],
};
export const ERROR = {
  preset: 'ovidio', antes: 'Ovidio, 34 años, corredor: 41,6 °C y delirio. Plan escrito por un compañero. Juzga cada frase (hay 0, 1 o 2 errores).',
  frases: [
    { t: 'Paracetamol 1 g IV para bajar la temperatura.', error: true, por: 'Es hipertermia, no fiebre: el dial está en 37 °C y el antipirético no sirve (p. 45). Retrasa el enfriamiento que sí funciona.' },
    { t: 'Enfriamiento evaporativo (agua templada y abanico) hasta 36 °C.', error: true, por: 'El objetivo es 38 °C (p. 47): por debajo, Ovidio tirita y la temperatura vuelve a subir.' },
    { t: 'Suero salino a 4 °C si hace falta enfriar por dentro.', error: false, por: 'Enfriamiento interno con salino frío (p. 47).' },
    { t: 'Reposición de volumen: tiene depleción grave e hipotensión.', error: false, por: 'El golpe de calor cursa con depleción grave de volumen e hipotensión (p. 47).' },
    { t: 'Pedir CK y creatinina: la rabdomiólisis es frecuente.', error: false, por: 'Complicación habitual; se sospecha con una CK de al menos 5 veces lo normal (p. 47).' },
    { t: 'Vigilar el escalofrío mientras se enfría.', error: false, por: 'Es el gran inconveniente del enfriamiento externo: eleva la temperatura (p. 47).' }],
};
export const CASO = {
  titulo: 'Caso · Ovidio, 34 años', preset: 'ovidio',
  pasos: [
    { enun: 'En el corredor del maratón: temperatura rectal 41,6 °C, delirio, PA 86/48 y piel seca. ¿Qué haces primero?', antes: { calor: 2, real: 41.6, ck: 700, hCalor: 1 },
      ops: [
        { t: 'Enfriar ya (agua fría o evaporativo) y reponer volumen: es un golpe de calor de esfuerzo.', ok: true, por: 'Golpe de calor: ≥41 °C, disfunción neurológica e hipotensión (Tabla 43.1, p. 46-47); se enfría hasta 38 °C con volumen (p. 47).', haz: { real: 38.2, ck: 2400, hCalor: 1 } },
        { t: 'Paracetamol 1 g IV y vigilar la curva de temperatura.', ok: false, por: 'No es fiebre: sigue en 41,6 °C con delirio y se le acumula la rabdomiólisis (p. 45).', haz: { flags: { sinEfecto: true }, paraG: 1 } },
        { t: 'Sentarlo en una sala fresca y reposar: es un agotamiento por calor.', ok: false, por: 'El agotamiento llega a 38-39 °C con la mente intacta; Ovidio delira a 41,6 °C: el golpe mata si no se enfría (p. 46-47).', haz: { real: 42 } }] },
    { enun: 'Una hora después: 38,2 °C. ¿Qué haces con el enfriamiento?', antes: { calor: 2, real: 38.2, ck: 2400, hCalor: 1 },
      ops: [
        { t: 'Pararlo: el objetivo es 38 °C y el escalofrío haría subir la temperatura.', ok: true, por: 'Se enfría hasta 38 °C; el escalofrío es contraproducente (p. 47).', haz: {} },
        { t: 'Seguir hasta 36 °C para que no vuelva a subir.', ok: false, por: 'Ovidio tirita, se le cierra la piel y la temperatura sube de nuevo (p. 47).', haz: { real: 36.4, flags: { parar: true } } },
        { t: 'Dar paracetamol para que el dial no suba.', ok: false, por: 'El dial nunca se movió de 37 °C: no hay nada que bajar (p. 45).', haz: { flags: { sinEfecto: true }, paraG: 1 } }] },
    { enun: 'Hora 6: CK 18.000 U/L, creatinina 2,1 mg/dL, plaquetas 60.000/µL, ALT 2.900 U/L. ¿Cómo lo interpretas?', antes: { calor: 2, real: 37.6, ck: 18000, hCalor: 1 }, enlace: true,
      ops: [
        { t: 'Fallo multiorgánico del golpe de calor: rabdomiólisis, lesión renal, CID e hígado isquémico; hay que vigilarlos y reponer volumen.', ok: true, por: 'El golpe de calor cursa con rabdomiólisis, lesión renal aguda, CID y transaminasas muy altas; CK ≥5× lo normal sugiere rabdomiólisis (p. 47).', haz: {} },
        { t: 'Es una sepsis: cultivos y antibiótico y nada más.', ok: false, por: 'Te quedas sin tratar la rabdomiólisis y la CID: el riñón y el hígado siguen cayendo (p. 47).', haz: {} },
        { t: 'Se corregirá solo al normalizar la temperatura; no hace falta seguirlo.', ok: false, por: 'La lesión muscular ya está hecha y la CK sigue liberándose: se vigila CK, creatinina y coagulación (p. 47).', haz: {} }] },
    { enun: 'Día 2: temperatura 38,6 °C otra vez, pero ahora el dial también está en 38,6 °C (inflamación). ¿Pones la manta de enfriamiento?', antes: { dial: 38.6, real: 38.6, ck: 9000, hCalor: 1 },
      ops: [
        { t: 'No: ahora es fiebre y la manta aumenta el escalofrío y la vasoconstricción.', ok: true, por: 'La manta es contraproducente en la fiebre; su sitio es el golpe de calor (p. 72).', haz: {} },
        { t: 'Sí: la manta bajó la temperatura el primer día y ahora hará lo mismo.', ok: false, por: 'El primer día el dial estaba en 37 °C; ahora el dial la sostiene en 38,6 °C y Ovidio tiritaría (p. 72).', haz: { flags: { manta: true }, real: 39 } },
        { t: 'Inmersión en agua fría, como el primer día.', ok: false, por: 'Enfriamiento de golpe de calor en un paciente con el dial alto: escalofrío, vasoconstricción y más temperatura (p. 47, 72).', haz: { real: 38.6 } }] },
  ],
};
export const LLEVAS = {
  apuesta: [['En la sepsis, la mortalidad baja al subir la temperatura: la fiebre no se suprime de rutina.', '71'], ['El antipirético mueve el dial, no el termómetro.', '45']],
  error: [['En la hipertermia el paracetamol no sirve: el dial está en 37 °C.', '45'], ['Se enfría hasta 38 °C y se para.', '47e']],
  caso: [['Dial frente a termómetro: fiebre y golpe de calor no se tratan igual.', '45'], ['Se enfría hasta 38 °C y se para.', '47e'], ['La manta solo en el golpe de calor.', '72m']],
};
export function opciones(cont, ops, alElegir, orden) {
  const idx = orden || ops.map((_, i) => i); let hecho = false;
  idx.forEach((i) => { const op = ops[i]; const b = document.createElement('button'); b.type = 'button'; b.className = 'op'; b.textContent = op.t; cont.append(b);
    b.addEventListener('click', () => { if (hecho) return; hecho = true; [...cont.children].forEach((x, j) => { const o = ops[idx[j]]; x.classList.add(o.ok ? 'bien' : 'neutra'); if (x === b && !o.ok) x.classList.replace('neutra', 'mal'); x.disabled = true; });
      const p = document.createElement('p'); p.className = 'por ' + (op.ok ? 'ok' : 'no'); p.textContent = (op.ok ? 'Correcto. ' : 'No: ') + op.por; cont.append(p); alElegir(op); }); });
}
