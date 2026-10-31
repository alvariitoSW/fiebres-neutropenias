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
  mgPlasmaL: 4.3, caIVpor100: 0.5,                      // litros donde cae el bolo de Mg (6 mEq / 1,4 mEq/L); mg/dL de Ca iónico por cada 100 mg (ilustrativo: el libro, p. 46, da +0,5 mg/dL de Ca TOTAL por 200 mg)
};
export const CA = { ion: 4.6, quelatos: 0.94, albumina: 3.76 };   // Tabla 38.1 (iónico 4,6-5,0) y Fig. 38.1: la mitad iónica, el resto 80 % albúmina y 20 % complejos (E p. 42-43)
export const TOPES = {
  clk: { max: 20, origen: 'ficha · p. 23' }, mg: { parada: 13, bloqueo: 10, origen: 'ficha · p. 39' },
  ca: { grave: 0.65, severa: 0.9, origen: 'ficha · p. 44-45' }, po4: { grave: 1, origen: 'ficha · p. 49' },
  caIV: { bolo: 200, origen: 'bolo recomendado: ficha · p. 45-46; tope del sello: ilustrativo' },
  hiperK: { ml: 10, mg: 90, origen: 'ficha · p. 27 (Tabla 36.3)' },
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
  ['Fig. 36.2: la curva, en el dibujo', 20], ['ClK: ritmo 20 mEq/h, 40 grave, cava superior', 23], ['K⁺ de los concentrados de 18 días (2-3 mEq)', 25], ['Furosemida: pierde K⁺ (causa principal de hipopotasemia)', 21], ['Calcio en la hiperpotasemia: 10 mL de gluconato al 10 % (90 mg) en 3 min, repetible a los 5; el efecto cede en 30-60 min (Tabla 36.3)', 27], ['La alcalosis tiene efecto variable sobre el K⁺; la acidosis láctica no se asocia a hiperpotasemia', 21],
  ['Mg²⁺: reparto del cuerpo (Tabla 37.1)', 32], ['Furosemida y Mg²⁺ (50 % de los crónicos)', 34], ['MgSO₄: 8 mEq por gramo, 50 % a la orina', 37], ['Mg >13 mEq/L: parada', 39],
  ['Ca: 99 % en hueso, tres fracciones (Fig. 38.1)', 42], ['Total frente a iónico; ningún factor de corrección es fiable', 43], ['Alcalosis y citrato bajan el Ca iónico; el citrato de los concentrados', 44], ['Ca iónico <0,65 mmol/L; gluconato 9 y cloruro 27 mg/mL; bolo recomendado de 200 mg (sube el total 0,5 mg/dL y vuelve a caer a los 30 min, p. 46)', 45],
  ['Fosfato: casi todo dentro de la célula; insulina, nutrición parenteral (hipofosfatemia a los 2 días, <1 mg/dL a la semana, Fig. 38.2)', 49], ['Reposición de fosfato (Tabla 38.5; fosfato potásico 4,3 mEq/mL impreso como mEq/L)', 51],
];
export const NOTAS = [
  ['fuente no lo dice', 'La Tabla 37.1 (reparto del Mg²⁺) está en la p. 32 del PDF, no en la 31. El libro no da el reparto del fosfato en cifras: el dibujo solo dice «casi todo dentro».'],
  ['fuente no lo dice', 'Cuánto baja el suero cada dosis de insulina o cuánto quela cada concentrado: el libro da la dirección, no la cifra. Del calcio sí da una cifra (p. 46): 200 mg suben el calcio TOTAL 0,5 mg/dL y vuelve a caer a los 30 min; el dibujo pone 0,5 mg/dL de iónico por 100 mg, el doble y en otra variable: es ilustrativo. Las demás cifras del dibujo son ilustrativas.'],
  ['fuente no lo dice', 'Hipomagnesemia: «más del 50 % de los pacientes de UCI» (p. 39) y «hasta el 65 %» (p. 33) son compatibles: el libro no da una cifra única.'],
  ['fuente no lo dice', 'Fosfato potásico: 4,5 mEq/mL (p. 23); la Tabla 38.5 (p. 51) imprime «K⁺: 4.3 mEq/L» (por litro): probable errata de «mEq/mL», que es lo que usa el dibujo. Del mismo modo, la p. 18 imprime «50 mg/kg» de potasio total y la Fig. 36.1 «50 mEq/kg»: se usa mEq.'],
  ['fuente no lo dice', 'El efecto del pH sobre el K⁺ (3 mEq/L por unidad) es ilustrativo: la Fig. 36.2 (p. 20) da la dirección, pero el libro dice que la alcalosis tiene un efecto variable e impredecible (p. 21) y que la acidosis láctica no se asocia a hiperpotasemia (p. 24).'],
  ['fuente no lo dice', 'Los sellos de K⁺ (aviso ≥6, sello ≥7) son ilustrativos: el libro llama grave a más de 6,5 mEq/L (p. 27). «La mitad por la orina» del MgSO₄ es de la pauta de hipomagnesemia leve con riñón normal (p. 37) y el dibujo la aplica a cualquier dosis; 8 mEq por gramo es del MgSO₄·7H₂O (p. 37); la retención de Mg es poco fiable con mala función renal (p. 38).'],
  ['opinión del autor', 'Cloruro cálcico solo en el colapso circulatorio (p. 27, 45): el libro lo recomienda así.'],
];
export const CRECIMIENTO = [
  ['Nefrología · Potasio vivo e hiperpotasemia: el K⁺ y el ECG en la hiperpotasemia', 'nefrologia'],
  ['Libro Azul · Vías urinarias: el riñón que pierde o retiene K⁺ y Mg²⁺', 'fisio-uci'],
  ['Manual UMI · Iones: reposición de K⁺, Mg²⁺, Ca²⁺ y fosfato a pie de cama', 'sobrevivir-umi'],
  ['ECG de la hipopotasemia (onda U, T plana, QT largo): pendiente de dibujar', 'eco'],
];
export const PENDIENTE = 'Pendiente: el ritmo vivo aún no dibuja la onda U, la T plana ni el QT largo de la hipopotasemia (p. 22). Se pinta el trazo que hay.';

// PA y FC de cada paciente: ilustrativos (el libro no los da); Valentín, como dice el enunciado de su caso.
export const VITALES_ORIGEN = 'PA y FC ilustrativas';
// A qué ficha de la app lleva cada página del PDF (la que cubre ese párrafo)
export const FICHA_PAG = [[19, 23, 'mr-hipopotasemia'], [24, 25, 'mr-hiperk-causas'], [26, 28, 'mr-hiperk-tratamiento'], [29, 35, 'mr-magnesio-deficit'], [36, 41, 'mr-magnesio-reposicion'], [42, 47, 'mr-calcio-hipoca'], [48, 52, 'mr-fosforo']];
export const fichaDe = (p) => (FICHA_PAG.find(([a, b]) => p >= a && p <= b) || FICHA_PAG[0])[2];
export const IDEA = ['Una misma bajada del K⁺ del suero esconde el doble de potasio perdido que el que sobra en una subida: lo que ves es una ventanita.', 19];
