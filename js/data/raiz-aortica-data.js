// Tabla 14 de Lang 2015 (JASE 28:1-53, pág. 32): dimensiones de la raíz aórtica en adultos normales, media y DE.
// Absolutos en cm, indexados por superficie corporal en cm/m². Los usan la calculadora de la ficha «Raíz aórtica»
// (Eco cardíaca → Medidas) y la prueba que compara con la tabla del HTML. Una sola vez aquí.
export const NIVELES_RAIZ = [
    { id: 'anillo', n: 1, nombre: 'Anillo', abs: { H: [2.6, 0.3], M: [2.3, 0.2] }, idx: { H: [1.3, 0.1], M: [1.3, 0.1] } },
    { id: 'senos', n: 2, nombre: 'Senos de Valsalva', abs: { H: [3.4, 0.3], M: [3.0, 0.3] }, idx: { H: [1.7, 0.2], M: [1.8, 0.2] } },
    { id: 'ust', n: 3, nombre: 'Unión sinotubular', abs: { H: [2.9, 0.3], M: [2.6, 0.3] }, idx: { H: [1.5, 0.2], M: [1.5, 0.2] } },
    { id: 'asc', n: 4, nombre: 'Aorta ascendente proximal', abs: { H: [3.0, 0.4], M: [2.7, 0.4] }, idx: { H: [1.5, 0.2], M: [1.6, 0.3] } },
];

// Devereux 2012 (Am J Cardiol 110:1189-94): senos de Valsalva esperados por edad, SC y sexo (1 = H, 2 = M).
export const DEVEREUX = { base: 2.423, edad: 0.009, sc: 0.461, sexo: 0.267, see: 0.261, edadMin: 15, dMin: 2.1, dMax: 4.3 };
