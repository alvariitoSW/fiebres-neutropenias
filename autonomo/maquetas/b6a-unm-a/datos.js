// Unión neuromuscular · opción A «La hendidura». Datos: fuentes, pacientes, notas. N = Marino 2024, cap. 46 (PDF p. 19-33).
export const PDF = '../../docs/marino-2024-neurologia-caps45-47.pdf';
// Cita «pág:id» → PDF#page=pág y párrafo de la ficha (data-resaltar). Sin id, el que corresponde a la página.
export const FICHA = { 24: 'mn-mg-farmaco', 25: 'mn-mg-intubacion', 26: 'mn-mg-piridostigmina', 28: 'mn-pnc-mcc', 29: 'mn-bnm-succi', 30: 'mn-bnm-monitor', 31: 'mn-bnm-sugammadex' };
export const fichaDe = (c) => { const [p, id] = String(c).split(':'); return id || FICHA[p] || 'mn-miastenia'; };
export const pagDe = (c) => String(c).split(':')[0];
// Tabla 46.7 (p. 29) y texto p. 30-31. Lo que no es de Marino va como ILUS y se rotula «ilustrativo» en pantalla.
export const DOSIS = { suc: { paso: 0.5, lleno: 1.0, max: 1.5, on: 1.25, pl: 7, fin: 12 }, roc: { paso: 0.5, lleno: 1.0, max: 1.0, on: 2.25, pl: 50, fin: 70 }, cis: { paso: 0.05, lleno: 0.15, max: 0.2, on: 6, pl: 35, fin: 50 } };
export const NEO = { paso: 35, max: 70, espera: 8, fin: 45, fda: 5 };
export const ILUS = { cv0: 70, pim0: 100, margen: 2, hielo: 6, piri: 1.25, emp: 8, fatiga: 0.12, perf: [0, 0.5, 0.75, 1], fc0: 80, neoFc: 0.45, tofCortes: [0.95, 0.75, 0.5, 0.25] };
export const UMBRAL = { cvMl: 15, cvL: 1.0, pim: 20, k: 5.5, kCerca: 5.0, hielo: 2, horas48: 2880 };
export const PRESETS = {
  sera: { nombre: 'Serapio · miastenia', s: { peso: 70, rec: 15, k0: 4.1 }, txt: 'Serapio, 35 años, 70 kg: ptosis y diplopía al final del día; anti-AChR positivo. Hoy, con neumonía, CV 1.470 mL y PIM −30 cmH₂O.' },
  mel: { nombre: 'Melquíades · urgente', s: { peso: 70, rec: 100, k0: 6.1 }, txt: 'Melquíades, 62 años, peso ideal 70 kg: intubación urgente, K⁺ 6,1 mEq/L. Sin vía aérea asegurada.' },
  sano: { nombre: 'Paciente sano', s: { peso: 70, rec: 100, k0: 4.2 }, txt: 'Paciente de 70 kg sin enfermedad neuromuscular (inventado), K⁺ 4,2 mEq/L.' },
};
export const IDEA = ['La acetilcolina cruza la hendidura, se une a sus receptores y el músculo se contrae; la acetilcolinesterasa la corta. Cada relajante o enfermedad estropea un punto de ese camino.', '29:mn-bnm-mecanismo'];
export const PASOS = [
  ['Llega el impulso', 'El impulso baja por el nervio hasta el terminal, que guarda la acetilcolina (ACh) en vesículas.', '', 'fisiología general'],
  ['Salen las vesículas', 'Las vesículas liberan la ACh a la hendidura entre el nervio y el músculo.', '', 'fisiología general'],
  ['La ACh ocupa las copas', 'La ACh se une a sus receptores en la placa y el músculo se contrae. Si hay anticuerpos o un fármaco ocupa la copa, esa copa no abre.', '24:mn-mg-anticuerpos', 'unión: fisiología general; anticuerpos y fármacos: ficha'],
  ['La acetilcolinesterasa la corta', 'La enzima destruye la ACh de la hendidura; si se frena (neostigmina), la ACh se acumula.', '31:mn-bnm-neostigmina', 'hidrólisis por la AChE: fisiología general; neostigmina: ficha'],
  ['El músculo se relaja', 'Sin ACh en las copas, la placa vuelve al reposo y la fibra se relaja.', '', 'fisiología general'],
];
export const FUENTES = [['Miastenia: anticuerpos contra el receptor postsináptico; la fatiga empeora con la actividad; fármacos que empeoran (Tabla 46.5)', 24], ['Prueba del hielo (2 min, +2 mm) y Fig. 46.1', 25], ['Intubar si CV ≤15 mL/kg (o <1 L) o PIM −20 cmH₂O', 25], ['Crisis miasténica: la piridostigmina no se da en el fracaso respiratorio', 26], ['Relajantes (Tabla 46.7): dosis, inicio y duración', 29], ['Succinilcolina contraindicada si hay hiperpotasemia; TOF a 2 Hz, objetivo 1-2 respuestas', 30], ['Neostigmina 70 µg/kg, nunca más; sugammadex 16 / 4 / 2 mg/kg; parálisis prolongada', 31]];
export const NOTAS = [
  ['las fuentes discrepan', 'Duración del rocuronio: la Tabla 46.7 dice 50-70 min (p. 29) y el texto, 30-70 (p. 30). El modelo usa 50-70 y lo rotula.'],
  ['las fuentes discrepan', 'El libro imprime la PIM normal como «>−100 cmH₂O» (p. 25); se reproduce tal cual: parece una errata de «<−100».'],
  ['la fuente no lo dice', 'Marino no explica cómo el hielo mejora la transmisión ni dónde actúan los aminoglucósidos y el magnesio: solo «mejora» y «dificulta». El modelo lo rotula «mecanismo: otra fuente pendiente».'],
  ['la fuente no lo dice', 'Receptores al 5-100 %, el margen de seguridad, la CV normal de 70 mL/kg, qué respuestas del TOF quedan con cada profundidad y la caída de FC con la neostigmina son ilustrativos: el libro da la dirección y los umbrales, no esas magnitudes.'],
  ['opinión del autor', 'La FDA limita la neostigmina a 5 mg: nota de la ficha; el libro solo dice «nunca más de 70 µg/kg» (p. 31).'],
];
export const PROFUNDIZAR = ['Timoma, TC y pronóstico de la miastenia: ficha «otros aspectos» y «pronóstico».', 'Síndrome de Guillain-Barré y polineuropatía/miopatía del crítico: la placa está sana, la lesión es el nervio o el músculo (ficha siguiente).', 'Hiperpotasemia: ritmo vivo; ventilación con debilidad: pulmón vivo.'];
export const CRECERA = ['Cadena completa «del nervio al pulgar» (opción B).', 'Perfusión de rocuronio (5-12 µg/kg/min) además de la de cisatracurio.'];
