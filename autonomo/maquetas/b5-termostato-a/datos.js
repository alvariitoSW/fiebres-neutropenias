// Datos de «El termostato de pared». Fuente: Marino 2024, caps. 43-44 (docs/marino-2024-abdomen-temperatura-caps39-44.pdf, p. = página del PDF).
export const PDF = '../../docs/marino-2024-abdomen-temperatura-caps39-44.pdf';
// Página → párrafo exacto de la ficha (js/modules/libros/marino-abdomen.html)
export const FICHA = { 45: 'ma-calor-hipertermia', 46: 'ma-calor-evaporacion', 47: 'ma-calor-golpe', 53: 'ma-hipo-riesgo', 54: 'ma-tabla-43-6', 55: 'ma-hipo-lab', 56: 'ma-hipo-interno', 60: 'ma-fiebre-def', 70: 'ma-antip-defensa', 71: 'ma-antip-clinica', 72: 'ma-antip-paracetamol' };
export const FICHA_EXTRA = { '47e': 'ma-calor-externo', '47i': 'ma-calor-interno', '47r': 'ma-calor-rabdo', '56a': 'ma-hipo-arritmias', '56v': 'ma-hipo-volumen', '56i': 'ma-hipo-interno', '55o': 'ma-hipo-osborn', '71c': 'ma-antip-cerebro', '72m': 'ma-antip-mantas', '72n': 'ma-antip-aine' };
export const IDEA = ['El termostato compara la temperatura real con su punto de ajuste: si está por debajo, calienta (escalofrío); por encima, enfría (sudor). Fiebre = el ajuste sube y la regulación funciona; hipertermia = el ajuste sigue en 37 °C y la regulación se desborda.', '45'];
export const PRESETS = {
  reposo: { nombre: 'Reposo', s: {}, txt: 'Una persona sana en reposo: el dial está en 37 °C y la temperatura real oscila ±0,6 °C a lo largo del día (p. 45).' },
  dorotea: { nombre: 'Dorotea', s: { dial: 39.6, real: 39.6 }, txt: 'Dorotea, 55 años, shock séptico urinario, 39,6 °C: el dial lo sube el pirógeno y el cuerpo ya ha llegado (paciente inventado; cifras ilustrativas).' },
  ovidio: { nombre: 'Ovidio', s: { calor: 2, real: 39.6, hCalor: 0 }, txt: 'Ovidio, 34 años, corre al sol: el dial sigue en 37 °C y el esfuerzo supera al radiador (paciente inventado; cifras ilustrativas).' },
  honorato: { nombre: 'Honorato', s: { frio: 3, real: 35.5 }, txt: 'Honorato, 72 años, hallado en la calle en enero tras beber alcohol: la conducta de abrigo falla (p. 53; paciente inventado).' },
};
export const FUENTES = [['Termostato, ±0,6 °C, fiebre frente a hipertermia', 45], ['Radiador: convección y sudor', 46], ['Golpe de calor y cómo enfriar', 47], ['Hipotermia: frío y conducta (<15 °C, alcohol)', 53], ['Tabla 43.6 y recalentar', 54], ['Osborn, arritmias y recalentamiento', 56], ['Fiebre en la UCI', 60], ['Fiebre y mortalidad (Fig. 44.5)', 71], ['Antipiréticos y mantas', 72]];
export const NOTAS = [
  ['fuente no lo dice', 'Marino no da la temperatura máxima compatible con la vida (la Fig. 44.4, a 43 °C, es en conejos, p. 70): el tope de 42 °C es <b>ilustrativo</b>. Tampoco da las velocidades de enfriar por inmersión, hielo, salino o manta, el calor que aporta cada carga ni la FC o la CK de cada temperatura: son cifras de dibujo. Sí son de la ficha el calor metabólico (≈1 °C/h, p. 45), el 0,3 °C/min del enfriamiento evaporativo (p. 47) y los 2,5 °C/h de los gases calientes (p. 56).'],
  ['fuentes discrepan', 'Paracetamol: máximo 3 g al día en el cap. 44 (FDA 2011, p. 72) y 4 g en el cap. 6 del mismo libro. Se muestran las dos.'],
  ['fuente no lo dice', 'La FV a <28 °C es un <b>riesgo</b> en la fuente («riesgo de fibrilación ventricular», p. 56), no una certeza; el monitor la dibuja como peor caso. La onda de Osborn no se dibuja: se enseña la imagen real y el libro la llama «una curiosidad» sin valor diagnóstico (p. 55-56).'],
  ['opinión del autor', 'Los dos frentes (fiebre/hipertermia) se simplifican en el dial y el termómetro; la fiebre con carga de calor a la vez existe en la clínica y aquí se muestra como fiebre.'],
];
export const PROFUNDIZAR = ['Hipertermia maligna, síndrome neuroléptico maligno y síndrome serotoninérgico (dantroleno hasta 10 mg/kg, bromocriptina, ciproheptadina): p. 48-53, aún sin modelo vivo.', 'Fiebre en la UCI: hemocultivos, fiebre por fármacos y herida quirúrgica (p. 59-68): fichas del libro.', 'Rabdomiólisis y lesión renal del golpe de calor: la nefrona viva (p. 47).'];
export const CRECERA = ['El mando del dantroleno (tope 10 mg/kg) llegará con la hipertermia maligna.', 'El monitor podrá usar el ritmo vivo (bradicardia y FV del frío) en lugar de texto.'];
export const fichaDe = (c) => { const k = String(c); return FICHA_EXTRA[k] || FICHA[parseInt(k, 10)] || FICHA[45]; };
