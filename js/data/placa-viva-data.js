// Placa motora viva · del nervio al pulgar (Marino 2024, cap. 46). Datos: fuentes, pacientes, notas, dosis y pasos de la hendidura.
// N = Marino 2024, caps. 45-47 (página = página del PDF). Lo que no es de Marino va rotulado «ilustrativo» en pantalla.
export const PDF = 'docs/marino-2024-neurologia-caps45-47.pdf';
// página del PDF → párrafo de la ficha (data-resaltar); el sufijo «:id» de una cita fuerza otro párrafo de la misma página
export const FICHA = { 24: 'mn-mg-anticuerpos', 25: 'mn-mg-intubacion', 26: 'mn-mg-crisis', 27: 'mn-tabla-46-6', 28: 'mn-pnc-pnc', 29: 'mn-relajantes', 30: 'mn-bnm-monitor', 31: 'mn-bnm-sugammadex' };
export const fichaDe = (c) => { const [p, id] = String(c).split(':'); return id || FICHA[p] || 'mn-relajantes'; };
// Pestaña de la ficha de Marino a la que pertenece cada párrafo (para el enlace «Ver en la ficha»)
export const tabDe = (id) => (/^mn-(bnm|relajantes|tabla-46-7)/.test(id) ? 'mn-relajantes' : /^mn-(gbs|gm|pnc|tabla-46-6)/.test(id) ? 'mn-gbs-pnc' : 'mn-miastenia');
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
  bloqueo: { n: 'Relajante', f0: 100, lesion: [1, 'Placa tapada por el relajante'], perfusion: 'rocuronio 5-12 µg/kg/min o cisatracurio 1-3 µg/kg/min (N p. 29)' },
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
  ['fuentes discrepan', 'Duración del rocuronio: 50-70 min en la tabla y 30-70 min en el texto (p. 29-30). El modelo usa 60 min como valor ilustrativo. '],
  ['opinión del autor', 'Neostigmina: Marino dice «nunca más de 70 µg/kg» (p. 31); el máximo de 5 mg de la FDA es una nota de la ficha, no de Marino. Las inferencias de los avisos (rocuronio sin vía aérea, TOF 0, IgIV en el Guillain-Barré) se rotulan en cada aviso.'],
  ['fuente no lo dice', 'Errata reproducida: Marino imprime la PIM normal como «>−100» (p. 25). El modelo usa PIM = −fuerza % (100 % = −100 cmH₂O) y la CV normal de 70 mL/kg como cifras ilustrativas (ilustrativo, igual en las dos opciones), no de la ficha.'],
  ['fuente no lo dice', 'Cuánto tarda cada estado en empeorar o mejorar (−3 puntos de fuerza al día en el GBS, +6 al día tras la IgIV, etc.) no figura en Marino: solo la dirección (p. 26-28). Magnitudes ilustrativas.'],
];
// Enlaces a otros modelos vivos (enlace cruzado de siempre): [texto, vista, atributo, estado]
export const ENLACES = [
  ['El ritmo vivo «potasio alto»: la succinilcolina suma 0,5 mEq/L de K⁺', 'ritmoVivo', 'ritmoVivo', 'hiperk'],
  ['El receptor vivo: los receptores y los fármacos que los ocupan', 'receptorVivo', 'receptorVivo', ''],
  ['El pulmón vivo: el destete que fracasa (PIM y capacidad vital)', 'pulmonVivo', 'pulmonVivo', 'sbt-fracaso'],
];
export const CRECERA = ['Capilar vivo «sepsis» para la polineuropatía y la miopatía del crítico: aún no se enlaza.', 'Cifras ilustrativas con fuente por buscar: CV normal de 70 mL/kg, decremento de la miastenia, velocidad de la conducción en el Guillain-Barré (ver las notas).'];
export const PROFUNDIZAR = ['Miller Fisher y otras variantes del GBS: Marino solo las menciona (p. 27).', 'Metilprednisolona 2 g/día en la crisis miasténica, discutida (p. 26).', 'Gabapentina 300 mg cada 8 h para el dolor neuropático del GBS (p. 28).', 'Timoma (10 %) y anticuerpos MuSK en la miastenia seronegativa (p. 24-25).', 'Por qué empeora la miastenia con aminoglucósidos y magnesio: Marino los lista en la Tabla 46.5 (p. 24) pero no explica el mecanismo, y no se encontró otra fuente fiable que lo explique; hueco anotado.', 'Cómo mejora el hielo la transmisión: Marino solo dice «mejora» (p. 24); se ha propuesto que enfriar inhibe la acetilcolinesterasa, sin certeza (PubMed 3614664).'];
// ---- Motor del bloqueo y hendidura: Tabla 46.7 (p. 29), neostigmina y sugammadex (p. 30-31); lo ilustrativo, rotulado ----
// Tabla 46.7 (p. 29) y texto p. 30-31. Lo que no es de Marino va como ILUS y se rotula «ilustrativo» en pantalla.
export const DOSIS = { suc: { paso: 0.5, lleno: 1.0, max: 1.5, on: 1.25, pl: 7, fin: 12 }, roc: { paso: 0.5, lleno: 1.0, max: 1.0, on: 2.25, pl: 50, fin: 70 }, cis: { paso: 0.05, lleno: 0.15, max: 0.2, on: 6, pl: 35, fin: 50 } };
export const NEO = { paso: 35, max: 70, espera: 8, fin: 45, fda: 5 };
export const ILUS = { cv0: 70, pim0: 100, margen: 2, hielo: 6, piri: 1.25, emp: 8, fatiga: 0.12, perf: [0, 0.5, 0.75, 1], fc0: 80, neoFc: 0.45, tofCortes: [0.95, 0.75, 0.5, 0.25] };
export const UMBRAL = { cvMl: 15, cvL: 1.0, pim: 20, k: 5.5, kCerca: 5.0, hielo: 2, horas48: 2880 };
// Pacientes base del motor del bloqueo (datos internos; los pacientes de la app son los de arriba)
export const PRESETS_BASE = {
  sera: { nombre: 'Serapio · miastenia', s: { peso: 70, rec: 15, k0: 4.1 }, txt: 'Serapio, 35 años, 70 kg: ptosis y diplopía al final del día; anti-AChR positivo. Hoy, con neumonía, CV 1.470 mL y PIM −30 cmH₂O.' },
  mel: { nombre: 'Melquíades · urgente', s: { peso: 70, rec: 100, k0: 6.1 }, txt: 'Melquíades, 62 años, peso ideal 70 kg: intubación urgente, K⁺ 6,1 mEq/L. Sin vía aérea asegurada.' },
  sano: { nombre: 'Paciente sano', s: { peso: 70, rec: 100, k0: 4.2 }, txt: 'Paciente de 70 kg sin enfermedad neuromuscular (inventado), K⁺ 4,2 mEq/L.' },
};
export const PASOS = [
  ['Llega el impulso', 'El impulso baja por el nervio hasta el terminal, que guarda la acetilcolina (ACh) en vesículas.', '', 'fisiología general'],
  ['Salen las vesículas', 'Las vesículas liberan la ACh a la hendidura entre el nervio y el músculo.', '', 'fisiología general'],
  ['La ACh ocupa las copas', 'La ACh se une a sus receptores en la placa y el músculo se contrae. Si hay anticuerpos o un fármaco ocupa la copa, esa copa no abre.', '24:mn-mg-anticuerpos', 'unión: fisiología general; anticuerpos y fármacos: ficha'],
  ['La acetilcolinesterasa la corta', 'La enzima destruye la ACh de la hendidura; si se frena (neostigmina), la ACh se acumula.', '31:mn-bnm-neostigmina', 'hidrólisis por la AChE: fisiología general; neostigmina: ficha'],
  ['El músculo se relaja', 'Sin ACh en las copas, la placa vuelve al reposo y la fibra se relaja.', '', 'fisiología general'],
];
