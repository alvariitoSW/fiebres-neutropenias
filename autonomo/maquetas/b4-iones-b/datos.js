// Datos del modelo «Lo que ves y lo que hay». Cada cifra lleva su origen y su página del PDF (E = Marino 2024, caps. 35-38).
export const PDF = '../../docs/marino-2024-electrolitos-caps35-38.pdf';
export const FICHA = { k: 'mr-hipopotasemia', mg: 'mr-magnesio-deficit', ca: 'mr-calcio-hipoca', p: 'mr-fosforo' };

// Curva de la Fig. 36.2 (E p. 20): potasio sérico (mEq/L) según el cambio del potasio total (mEq). Leída del dibujo: ilustrativo.
export const CURVA_K = [[-900, 1.9], [-600, 2.15], [-300, 2.95], [-150, 3.5], [0, 4.0], [100, 4.9], [200, 6.0], [300, 8.0]];
export const K_TOTAL = 3500;          // 50 mEq/kg × 70 kg (pie de la Fig. 36.1, E p. 19)
export const MG_REPARTO = [['Hueso', 53, 1060], ['Músculo', 27, 540], ['Tejido blando', 19, 384], ['Hematíes', 0.7, 10], ['Plasma', 0.3, 6]];  // Tabla 37.1, E p. 32

// Lo que escribimos nosotros como parámetro del dibujo (ilustrativo; la fuente da la dirección, no el tamaño)
export const P = {
  kInsulina: 0.5, mgInsulina: 0.12, poInsulina: 0.9,   // cuánto baja el suero cada dosis de «realimentar» (E p. 21, 34, 49: la dirección)
  kFurosemida: 20, mgFurosemida: 6,                     // mEq que se van por la orina en cada dosis (E p. 33-34: la dirección)
  mgPendiente: 0.0035, mgBase: 1.45,                    // mEq/L de Mg por cada mEq de déficit total; Mg normal ~1,4 (E p. 32, ejemplo 1,7 mg/dL = 1,4 mEq/L)
  phK: 3, phCa: 2.0,                                    // K sérico y Ca iónico por cada unidad de pH (E p. 20 flechas; p. 44)
  citrato: 0.17, kPorUnidad: 2.5,                       // Ca iónico (mg/dL) que quela cada concentrado; K del concentrado 2-3 mEq (E p. 24-25)
  mgPlasmaL: 4.3, caIVpor100: 0.5,                      // litros donde cae el bolo de Mg (6 mEq / 1,4 mEq/L); mg/dL de Ca iónico por cada 100 mg
};
export const CA = { ion: 4.6, quelatos: 0.94, albumina: 3.76 };   // Tabla 38.1 (iónico 4,6-5,0) y Fig. 38.1: la mitad iónica, el resto 80 % albúmina y 20 % complejos (E p. 42-43)
export const TOPES = {
  clk: { max: 20, origen: 'ficha · p. 23' }, mg: { parada: 13, bloqueo: 10, origen: 'ficha · p. 39' },
  ca: { grave: 0.65, severa: 0.9, origen: 'ficha · p. 44-45' }, po4: { grave: 1, origen: 'ficha · p. 49' },
  caIV: { bolo: 200, origen: 'ficha · p. 45' },
};
export const PRESETS = {
  normal: { nombre: 'Normal', s: {}, vit: ['118/72', 75] },
  damian: { nombre: 'Damián', s: { dK: -150, dMg: -66, po4b: 1.8, alb: 3.0 }, vit: ['112/70', 88], txt: 'Damián, 52 años, alcohólico desnutrido; empieza nutrición con glucosa.' },
  rufino: { nombre: 'Rufino', s: { dK: -330, dMg: -100, ph: 7.52 }, vit: ['128/76', 82], txt: 'Rufino, 74 años, sonda nasogástrica 5 días y furosemida crónica.' },
  valentin: { nombre: 'Valentín', s: { dK: 110, units: 10, ph: 7.22, alb: 3.0 }, vit: ['98/60', 110], txt: 'Valentín, 45 años, politrauma, 10 concentrados en 3 h.' },
  adela: { nombre: 'Adela', s: { dK: 230 }, vit: ['136/82', 54], txt: 'Adela, 72 años, enalapril + espironolactona: hiperpotasemia.' },
};
// Fuentes y notas (lista, REGLAS §7.11)
export const FUENTES = [
  ['K⁺: 98 % dentro de la célula', 18], ['K⁺ sérico frente a total (Fig. 36.2), déficit 200-400 y exceso 100-200 mEq por 1 mEq/L', 19],
  ['Fig. 36.2: la curva, en el dibujo', 20], ['ClK: ritmo 20 mEq/h, 40 grave, cava superior', 23], ['Citrato y K⁺ de los concentrados (2-3 mEq)', 24],
  ['Mg²⁺: reparto del cuerpo (Tabla 37.1)', 32], ['Furosemida y Mg²⁺ (50 % de los crónicos)', 34], ['MgSO₄: 8 mEq por gramo, 50 % a la orina', 37], ['Mg >13 mEq/L: parada', 39],
  ['Ca: 99 % en hueso, tres fracciones (Fig. 38.1)', 42], ['Total frente a iónico; ningún factor de corrección es fiable', 43], ['Alcalosis, citrato, Ca iónico <0,65 mmol/L; gluconato 9 y cloruro 27 mg/mL; bolo de 200 mg', 44],
  ['Fosfato: casi todo dentro de la célula; insulina y fosfato <1 mg/dL', 48],
];
export const NOTAS = [
  ['fuente no lo dice', 'La Tabla 37.1 (reparto del Mg²⁺) está en la p. 32 del PDF, no en la 31. El libro no da el reparto del fosfato en cifras: el dibujo solo dice «casi todo dentro».'],
  ['fuente no lo dice', 'Cuánto baja el suero cada dosis de insulina, cuánto sube el Ca²⁺ iónico con 100 mg de calcio o cuánto quela cada concentrado: el libro da la dirección, no la cifra. Las cifras del dibujo son ilustrativas.'],
  ['fuentes discrepan', 'Hipomagnesemia: «más del 50 % de los pacientes de UCI» (p. 39) frente al 65 % de otra cita del libro. Fosfato potásico: 4,5 mEq/mL (p. 23) frente a 4,3 mEq/mL en otra tabla. No se elige.'],
  ['opinión del autor', 'Cloruro cálcico solo en el colapso circulatorio (p. 26): el libro lo recomienda así.'],
];
export const PENDIENTE = 'Pendiente: el ritmo vivo aún no dibuja la onda U, la T plana ni el QT largo de la hipopotasemia (p. 22). Se pinta el trazo que hay.';

// PA y FC de cada paciente: ilustrativos (el libro no los da); Valentín, como dice el enunciado de su caso.
export const VITALES_ORIGEN = 'PA y FC ilustrativas';
// A qué ficha de la app lleva cada página del PDF (la que cubre ese párrafo)
export const FICHA_PAG = [[19, 23, 'mr-hipopotasemia'], [24, 25, 'mr-hiperk-causas'], [26, 28, 'mr-hiperk-tratamiento'], [29, 35, 'mr-magnesio-deficit'], [36, 41, 'mr-magnesio-reposicion'], [42, 47, 'mr-calcio-hipoca'], [48, 52, 'mr-fosforo']];
export const fichaDe = (p) => (FICHA_PAG.find(([a, b]) => p >= a && p <= b) || FICHA_PAG[0])[2];
export const IDEA = ['Una misma bajada del K⁺ del suero esconde el doble de potasio perdido que el que sobra en una subida: lo que ves es una ventanita.', 19];
