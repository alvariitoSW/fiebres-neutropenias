// Unión neuromuscular · opción B «Del nervio al pulgar». Datos: fuentes, pacientes, notas. N = Marino 2024, caps. 45-47 (página = página del PDF).
export const PDF = '../../docs/marino-2024-neurologia-caps45-47.pdf';
// página del PDF → párrafo de la ficha (data-resaltar); el sufijo «:id» de una cita fuerza otro párrafo de la misma página
export const FICHA = { 24: 'mn-mg-anticuerpos', 25: 'mn-mg-intubacion', 26: 'mn-mg-crisis', 27: 'mn-tabla-46-6', 28: 'mn-pnc-pnc', 29: 'mn-relajantes', 30: 'mn-bnm-monitor', 31: 'mn-bnm-sugammadex' };
export const fichaDe = (c) => { const [p, id] = String(c).split(':'); return id || FICHA[p] || 'mn-relajantes'; };
export const pagDe = (c) => String(c).split(':')[0];
// Umbrales (una sola vez): intubar con CV ≤15 mL/kg (o <1 L) o PIM −20 cmH₂O (N p. 25); neostigmina máx 70 µg/kg (N p. 31); 5 sesiones de plasmaféresis (N p. 26)
export const U = { cvkg: 15, cvL: 1000, pim: 20, neoMax: 70, neoMg: 5, ses: 5, k: 5.5, hielo: 2 };
// Duración del bloqueo en minutos (N p. 29-30: succinilcolina 7-12; rocuronio 50-70, el texto dice 30-70; cisatracurio 35-50). Se usa el punto medio: ilustrativo.
export const DUR = { succi: 10, roc: 60, cis: 42 };
export const NOMBRE = { succi: 'succinilcolina', roc: 'rocuronio', cis: 'cisatracurio' };
export const ESTADOS = {
  sano: { n: 'Sano', f0: 100, lesion: null },
  gbs: { n: 'Guillain-Barré', f0: 26, lesion: [0, 'Lesión: mielina'] },
  miastenia: { n: 'Miastenia', f0: 27, lesion: [1, 'Lesión: receptores de la placa'] },
  pnc: { n: 'Polineuropatía', f0: 45, lesion: [0, 'Lesión: axón'] },
  mcc: { n: 'Miopatía del crítico', f0: 40, lesion: [2, 'Lesión: fibra (miosina)'] },
  bloqueo: { n: 'Relajante', f0: 100, lesion: [1, 'Placa tapada por el relajante'] },
};
export const PRESETS = {
  flor: { nombre: 'Florentina 52 · debilidad tras diarrea', est: 'gbs', peso: 60, f0: 26, k: 4.2, txt: 'Florentina, 52 años, 60 kg: dos semanas tras una diarrea por Campylobacter, debilidad simétrica ascendente, arreflexia y sin ptosis.' },
  sera: { nombre: 'Serapio 35 · ptosis al final del día', est: 'miastenia', peso: 70, f0: 27, k: 4.2, txt: 'Serapio, 35 años, 70 kg: ptosis y diplopía al final del día que mejoran al despertar.' },
  mel: { nombre: 'Melquíades 62 · intubación urgente', est: 'bloqueo', peso: 70, f0: 100, k: 6.1, txt: 'Melquíades, 62 años, peso ideal 70 kg: intubación urgente, K⁺ 6,1 mEq/L.' },
};
export const IDEA = ['Del nervio al pulgar hay cinco eslabones: el que falla se nota en cómo llega el impulso (lento en la mielina), si se fatiga (placa) y qué mide el TOF.', '27'];
// Tabla 46.6 (N p. 27): filas [rasgo, GBS, miastenia]
export const TABLA = [['Debilidad ocular', 'No', 'Sí'], ['Fatiga', 'No', 'Sí'], ['Reflejos', 'Disminuidos', 'Conservados'], ['Inestabilidad autonómica', 'Sí', 'No'], ['Conducción nerviosa', 'Lenta', 'Normal'], ['LCR', 'Proteínas ↑', 'Normal']];
export const FUENTES = [['Marino 2024, cap. 46: miastenia (anticuerpos, hielo, intubar, crisis)', 24], ['Intubar si CV ≤15 mL/kg (<1 L) o PIM −20 cmH₂O', 25], ['Crisis miasténica: IgIV, plasmaféresis, piridostigmina', 26], ['Guillain-Barré y Tabla 46.6', 27], ['Polineuropatía y miopatía del crítico', 28], ['Relajantes (Tabla 46.7)', 29], ['TOF, neostigmina y sugammadex', 30], ['Dosis de neostigmina y sugammadex', 31]];
export const NOTAS = [
  ['fuente no lo dice', 'Marino solo dice que el hielo «mejora» la transmisión y que aminoglucósidos y Mg «la dificultan» (p. 24-25): el mecanismo íntimo no está. La lupa lo dibuja sin explicarlo (fisiología general).'],
  ['fuentes discrepan', 'Duración del rocuronio: 50-70 min en la tabla y 30-70 min en el texto (p. 29-30). El modelo usa 60 min como valor ilustrativo. Neostigmina: Marino 70 µg/kg; la nota de la ficha añade el máximo de 5 mg de la FDA (p. 31).'],
  ['fuente no lo dice', 'Errata reproducida: Marino imprime la PIM normal como «>−100» (p. 25). El modelo usa PIM = −fuerza % (100 % = −100 cmH₂O) y la CV normal de 70 mL/kg como cifras ilustrativas, no de la ficha.'],
  ['fuente no lo dice', 'Cuánto tarda cada estado en empeorar o mejorar (−3 puntos de fuerza al día en el GBS, +6 al día tras la IgIV, etc.) no figura en Marino: solo la dirección (p. 26-28). Magnitudes ilustrativas.'],
];
export const CRECERA = ['Pulmón vivo «debilidad neuromuscular»: al llegar a CV ≤15 mL/kg se abre con las cifras del paciente.', 'Receptores vivos de la lupa, con sus cinco pasos.', 'Capilar vivo «sepsis» para la polineuropatía y miopatía del crítico.', 'Ritmo vivo «hiperpotasemia» para la succinilcolina con K⁺ alto.'];
export const PROFUNDIZAR = ['Miller Fisher y otras variantes del GBS: Marino solo las menciona (p. 27).', 'Metilprednisolona 2 g/día en la crisis miasténica, discutida (p. 26).', 'Gabapentina 300 mg cada 8 h para el dolor neuropático del GBS (p. 28).', 'Timoma (10 %) y anticuerpos MuSK en la miastenia seronegativa (p. 24-25).'];
