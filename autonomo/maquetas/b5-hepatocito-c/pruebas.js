// Apuesta, «encuentra el error» y caso de Hilario. Las respuestas viven aquí, no en el HTML. Cada opción falsa dice qué le pasaría al paciente.
export const APUESTA = {
  preset: 'hilario', estado: { tips: true }, pag: '10',
  antes: 'Hilario, 58 años, cirrótico con un TIPS colocado ayer, está desorientado en el tiempo.',
  pregunta: '¿Qué grado de West Haven tiene y qué mando lo explica?',
  ops: [
    { t: 'Grado 2 (apático, desorientado en el tiempo); lo explica el TIPS, que salta el hígado.', ok: true, por: 'Desorientado en el tiempo es grado 2 (Tabla 39.2, p. 6-7) y el TIPS cambia un problema por otro: sube el riesgo de encefalopatía (p. 10).' },
    { t: 'Grado 1: es solo una distracción por la noche; basta vigilarlo y no tocar nada, porque el amonio no tiene que ver con un TIPS.', ok: false, por: 'Lo infravaloras: ya es grado 2 y, sin lactulosa, el amonio sigue subiendo hasta el estupor (grado 3).' },
    { t: 'Grado 3, por la CVVH.', ok: false, por: 'Grado 3 exige estupor y desorientación en el lugar. Y encender la CVVH sin oliguria, sin amonio >150 ni edema pone un catéter sin indicación (p. 8).' }],
  orden: [2, 0, 1], tras: () => {}, pie: 'Mira ahora la cara y el monitor: el amonio sube con el TIPS.',
};
export const ERROR = {
  preset: 'hilario', estado: {}, pag: '9',
  antes: 'Hilario: hematemesis. Plan escrito por un compañero. Juzga cada frase (hay 0, 1 o 2 errores).',
  frases: [
    { t: 'Ringer lactato 1.000 mL para sostener la PA mientras llega la sangre.', error: true, por: 'El Ringer lactato es hipotónico y no se recomienda: añade riesgo de edema cerebral. Con albúmina <3 g/dL, albúmina 5 % (Tabla 39.3, p. 9).' },
    { t: 'Plasma hasta INR <1,5 antes de la endoscopia.', error: true, por: 'En la cirrosis el INR no mide el riesgo de sangrado; se guía con tromboelastografía (p. 9). Transfundir por el INR solo añade volumen.' },
    { t: 'Octreótido 50 µg en bolo y 50 µg/h durante 2-5 días.', error: false, por: 'Es la pauta de la Tabla 39.3 (p. 9).' },
    { t: 'Ceftriaxona antes de la endoscopia.', error: false, por: 'La primera dosis va antes de la endoscopia (Tabla 39.3: 1 g/día; el texto dice 2 g, p. 9).' },
    { t: 'Endoscopia en las primeras 12 horas.', error: false, por: 'Tabla 39.3 (p. 9).' },
    { t: 'Transfundir hasta una hemoglobina de 7 g/dL.', error: false, por: 'Objetivo de Hb 7 g/dL, hematíes, plasma y plaquetas 1:1:1 (p. 9).' }],
};
const hil = (o) => ({ ...o });
export const CASO = {
  titulo: 'Caso · Hilario, 58 años', preset: 'hilario',
  pasos: [
    { enun: 'Día 0. Hematemesis, PA 85/50, FC 118, Hb 6,8 g/dL, albúmina 2,4 g/dL. ¿Cómo repones?', antes: {},
      ops: [
        { t: 'Albúmina 5 % hasta PAM 65, sangre 1:1:1 hasta Hb 7 y endoscopia en ≤12 h.', ok: true, por: 'Tabla 39.3 (p. 9): albúmina con albúmina <3 g/dL, PAM 65, Hb 7, 1:1:1.', haz: { ml: { alb: 1000, sal: 0, rl: 0 }, ult: 'alb' } },
        { t: 'Ringer lactato 2 L de golpe hasta normalizar la PA, y la sangre ya se verá más tarde.', ok: false, por: 'Hipotónico: la hiponatremia empeora el edema cerebral y Hilario pasa de grado (p. 5, 9).', haz: { ml: { alb: 0, sal: 0, rl: 2000 }, ult: 'rl' } },
        { t: 'Plasma hasta INR <1,5 y endoscopia mañana.', ok: false, por: 'El INR no mide el riesgo y la endoscopia pasa de las 12 horas: sigue sangrando (p. 9).', haz: { ml: { alb: 0, sal: 0, rl: 0 } } }] },
    { enun: 'Día 1. Endoscopia con ligadura. Está algo confuso: West Haven 1. ¿Qué pauta?', antes: { ml: { alb: 1000, sal: 0, rl: 0 }, ult: 'alb' },
      ops: [
        { t: 'Lactulosa hasta 2-3 deposiciones blandas al día.', ok: true, por: 'Pauta de la p. 7: 20-30 g cada hora hasta deposición, luego 20 g/8 h, 2-3 blandas.', haz: { dep: 3 } },
        { t: 'Lactulosa hasta 6-7 deposiciones diarias para asegurarse.', ok: false, por: 'Diarrea osmótica: la PA baja y la FC sube; la ficha manda reducir o parar (p. 7).', haz: { dep: 7 } },
        { t: 'Nada: la confusión es de la anemia.', ok: false, por: 'El amonio sigue alto y se acerca al grado 2 (p. 6-7).', haz: {} }] },
    { enun: 'Día 2. Sigue sangrando pese a endoscopia y octreótido. ¿Qué haces?', antes: { ml: { alb: 1000, sal: 0, rl: 0 }, ult: 'alb', dep: 3 },
      ops: [
        { t: 'TIPS: hemorragia refractaria (~20 %); vigilar la encefalopatía.', ok: true, por: 'Refractaria en ~20 %: TIPS, que salta el hígado y aumenta el riesgo de encefalopatía (p. 10). Verás su cara pasar a grado 2.', haz: { tips: true } },
        { t: 'Retirar el octreótido y esperar a que ceda sola.', ok: false, por: 'Sin control del sangrado, sigue perdiendo sangre con la PA en caída (p. 9-10).', haz: {} },
        { t: 'TIPS y asegurar a la familia de que la encefalopatía no va a cambiar con él.', ok: false, por: 'Falso: «cambia un problema por otro» (p. 10); el amonio sube.', haz: { tips: true } }] },
    { enun: 'Día 3. Amonio arterial 120 µmol/L, 3 deposiciones al día, rifaximina 10 días, sin oliguria ni edema. ¿CVVH?', antes: { ml: { alb: 1000, sal: 0, rl: 0 }, ult: 'alb', dep: 3, tips: true, rif: 10 },
      ops: [
        { t: 'No: ninguna de las tres puertas; sigue lactulosa y rifaximina.', ok: true, por: 'CVVH si oliguria persistente, amonio >150 o edema cerebral, sea cual sea la creatinina (p. 8). Aquí 120.', haz: {} },
        { t: 'Sí, CVVH ya: es lo más eficaz para bajar el amonio y evitar más problemas.', ok: false, por: 'Catéter y circuito sin indicación: ninguna de las tres puertas (p. 8).', haz: { cvvh: true } },
        { t: 'Subir la lactulosa a 6 deposiciones.', ok: false, por: 'Diarrea y pérdida de volumen con la PA justa (p. 7).', haz: { dep: 7 } }] },
  ],
};
export const LLEVAS = {
  apuesta: [['El TIPS sube el amonio: salta el hígado.', '10'], ['El grado de West Haven se lee en la cara.', '6t']],
  error: [['Albúmina 5 %, nunca Ringer lactato, en el sangrado por varices.', '9t'], ['El INR no guía la hemostasia en la cirrosis: tromboelastografía.', '9t']],
  caso: [['El TIPS sube el amonio.', '10'], ['West Haven se lee en la cara.', '6t'], ['La CVVH tiene tres puertas: oliguria, amonio >150, edema.', '8']],
};
export function opciones(cont, ops, alElegir, orden) {
  const idx = orden || ops.map((_, i) => i); let hecho = false;
  idx.forEach((i) => { const op = ops[i]; const b = document.createElement('button'); b.type = 'button'; b.className = 'op'; b.textContent = op.t; cont.append(b);
    b.addEventListener('click', () => { if (hecho) return; hecho = true; [...cont.children].forEach((x, j) => { const o = ops[idx[j]]; x.classList.add(o.ok ? 'bien' : 'neutra'); if (x === b && !o.ok) x.classList.replace('neutra', 'mal'); x.disabled = true; });
      const p = document.createElement('p'); p.className = 'por ' + (op.ok ? 'ok' : 'no'); p.textContent = (op.ok ? 'Correcto. ' : 'No: ') + op.por; cont.append(p); alElegir(op); }); });
}
