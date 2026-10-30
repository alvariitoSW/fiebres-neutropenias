// Rangos de «paciente posible» para el juez de topes (REGLAS §1.14; autonomo/jueces-topes.mjs).
// Origen: fisiología general (límites de lo compatible con un paciente vivo o en parada). El umbral es AMPLIO a
// propósito: solo caza lo imposible (una PAS de 600, un pH de 9), no lo grave. Un «PA 0» en una parada con sello es
// correcto y está dentro del rango.
// `neg: true`: un valor con signo menos es un fallo; sin ella, un «−2» es una variación (Δ) y se ignora.
// `ignorarSi`: si ese texto aparece cerca (100 letras antes, 60 después), la cifra no es del paciente (pH del estómago, p. ej.).
// Cada entrada: nombre, etiqueta (regex que reconoce el rótulo en el texto visible; el número va justo detrás),
// mínimo y máximo. Los números pueden llevar coma decimal y el signo menos «−» (U+2212).
const NUM = '(−|-)?\\d+(?:[.,]\\d+)?';
const rot = (etq, extra = '') => new RegExp(`(?<![\\p{L}\\p{N}])(?:${etq})(?![\\p{L}])${extra}[\\s:=≈~]{0,3}(${NUM})`, 'gu');
export const RANGOS = [
    { nombre: 'PAS', neg: true, re: rot('PAS|PA sist[óo]lica'), min: 0, max: 300 },
    { nombre: 'PAD', neg: true, re: rot('PAD|PA diast[óo]lica'), min: 0, max: 200 },
    { nombre: 'PAM', neg: true, re: rot('PAM|PA media'), min: 0, max: 250 },
    { nombre: 'FC', neg: true, re: rot('FC|frecuencia card[íi]aca'), min: 0, max: 300 },
    { nombre: 'SpO₂', neg: true, re: rot('SpO₂|SpO2|SatO₂|SaO₂'), min: 0, max: 100 },
    { nombre: 'pH', re: rot('pH'), ignorarSi: /luz|est[óo]mago|g[áa]stric|[úu]lcera|intestin|colon|duoden|boca|bucal|piel|vagin|orina|jugo|[áa]cido|mucosa|moco|\blog/i, min: 6.5, max: 8.0 },
    { nombre: 'pCO₂', neg: true, re: rot('pCO₂|PCO₂|PaCO₂|pCO2|PaCO2'), min: 5, max: 200 },
    { nombre: 'HCO₃', neg: true, re: rot('HCO₃⁻?|HCO3'), min: 1, max: 60 },
    { nombre: 'Na', re: rot('Na⁺|Na'), ignorarSi: /[×*]\s*Na/, min: 90, max: 200 },
    { nombre: 'K', re: rot('K⁺|K'), min: 1, max: 12 },
    { nombre: 'PVC', re: rot('PVC'), min: -5, max: 40 },
    { nombre: 'lactato', re: rot('lactato'), min: 0, max: 30 },
    { nombre: 'glucemia', re: rot('glucemia|glucosa'), min: 0, max: 1500 },
    { nombre: 'Hb', re: rot('Hb|hemoglobina'), min: 0, max: 25 },
    // El reloj del SCA (vaso vivo, lesión «placa»; lo comparte la trombólisis): 0-24 h, tope ilustrativo
    { nombre: 'horas desde el dolor', neg: true, re: rot('[Dd]esde el dolor'), min: 0, max: 24 },
    { nombre: 'temperatura', re: rot('temperatura|T[ªa]'), min: 20, max: 45 },
];
// Rótulos que solo pueden ser ≥ 0 (diuresis, volúmenes, gasto): el signo menos delante es un fallo.
export const NO_NEGATIVOS = [
    { nombre: 'diuresis', re: rot('diuresis') },
    { nombre: 'volumen', re: rot('volumen|vol\\.') },
    { nombre: 'gasto cardíaco', re: rot('GC|gasto card[íi]aco') },
];
