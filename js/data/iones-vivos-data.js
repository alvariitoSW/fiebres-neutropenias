// Datos del modelo «Lo que ves y lo que hay». Cada cifra lleva su origen y su página del PDF (E = Marino 2024, caps. 35-38).
export const PDF = 'docs/marino-2024-electrolitos-caps35-38.pdf';
export const FICHA = { k: 'mr-hipopotasemia', mg: 'mr-magnesio-deficit', ca: 'mr-calcio-hipoca', p: 'mr-fosforo' };

// Curva de la Fig. 36.2 (E p. 20): potasio sérico (mEq/L) según el cambio del potasio total (mEq). Leída del dibujo: ilustrativo.
export const CURVA_K = [[-900, 1.9], [-600, 2.15], [-300, 2.95], [-150, 3.5], [0, 4.0], [100, 4.9], [200, 6.0], [300, 8.0]];
export const K_TOTAL = 3500;          // 50 mEq/kg × 70 kg (pie de la Fig. 36.1, E p. 19)
export const MG_REPARTO = [['Hueso', 53, 1060], ['Músculo', 27, 540], ['Tejido blando', 19, 384], ['Hematíes', 0.7, 10], ['Plasma', 0.3, 6]];  // Tabla 37.1, E p. 32

// Lo que escribimos nosotros como parámetro del dibujo (ilustrativo; la fuente da la dirección, no el tamaño)
export const P = {
  kInsulina: 0.6, mgInsulina: 0.12, poInsulina: 0.9,   // cuánto baja el suero cada dosis de «realimentar» (E p. 21, 34, 49: la dirección; K⁺ 0,6: la bajada mínima de la insulina, p. 28)
  kFurosemida: 20, mgFurosemida: 6,                     // mEq que se van por la orina en cada dosis (E p. 33-34: la dirección)
  mgPendiente: 0.0035, mgBase: 1.45,                    // mEq/L de Mg por cada mEq de déficit total; Mg normal ~1,4 (E p. 32, ejemplo 1,7 mg/dL = 1,4 mEq/L)
  phK: 3, phCa: 2.0,                                    // K sérico y Ca iónico por cada unidad de pH (E p. 20 flechas; p. 44)
  citrato: 0.17, kPorUnidad: 2.5,                       // Ca iónico (mg/dL) que quela cada concentrado; K del concentrado 2-3 mEq (E p. 24-25)
  mgUmbral: 1.4, mgPiso: 1.0, clkPerdidaMax: 0.75,     // acople Mg→K: con el Mg²⁺ bajo parte del ClK se va por la orina (E p. 35: la dirección). Umbral ≈ límite bajo normal (p. 32); con Mg²⁺ ≤1,0 mEq/L (el de Rufino) se pierde ~¾ del ClK: ilustrativo
  poMin: 0.3,                                           // fosfato sérico mínimo de un paciente posible (mg/dL): por debajo, sello «no fisiológica». Tope ilustrativo (el libro llama grave a <1, p. 49)
  poResp: 0.3,                                          // mg/dL de fosfato que baja cada 0,1 de pH de origen respiratorio (E p. 49: la dirección; la cifra, ilustrativa)
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
// Estados con nombre (abrirEstado): formato de ponerEstadoMay { preset, ion, s, acc } + txt de una frase con su página.
export const ESTADOS = {
  'mg-bajo': { preset: 'rufino', ion: 'k', s: { dK: -243, dMg: -130 }, txt: 'Rufino (K⁺ 2,8 y Mg²⁺ 1,0 mEq/L) con el Mg²⁺ bajo: la hipopotasemia que acompaña a la falta de Mg puede no corregirse con ClK hasta reponerlo (E p. 35). Prueba a dar ClK.', org: 'ficha · p. 35' },
  'reponer-mg': { preset: 'rufino', ion: 'mg', s: { dK: -243, dMg: -10 }, txt: 'Rufino (K⁺ 2,8 mEq/L) con el Mg repuesto: ahora el ClK sí sube el K⁺ del suero (E p. 35: «Mg replacement is necessary before the hypokalemia can be corrected»).', org: 'ficha · p. 35; Mg repuesto: ilustrativo' },
  hipermg: { preset: 'normal', ion: 'mg', s: { mgBolo: 100 }, txt: 'Mg²⁺ por encima de 10 mEq/L: bloqueo AV completo (E p. 39).', org: 'ficha · p. 39; bolo: ilustrativo' },
  transfusion: { preset: 'valentin', ion: 'ca', s: { units: 15 }, txt: 'Valentín con 15 concentrados (Ca iónico 0,60 mmol/L): cada uno trae 2-3 mEq de K⁺ y citrato que quela el calcio iónico (E p. 25, 44).', org: 'ficha · p. 25, 44; cifras ilustrativas' },
  realimentar: { preset: 'damian', ion: 'p', s: {}, acc: [['real']], txt: 'Damián con una dosis de insulina y glucosa: el fosfato (0,9 mg/dL), el K⁺ y el Mg²⁺ del suero se hunden hacia la célula (E p. 49).', org: 'dirección: ficha · p. 21, 34, 49; cifras ilustrativas' },
  'alcalosis-resp': { preset: 'normal', ion: 'p', s: { ph: 7.56, resp: true }, txt: 'Hiperventilación (alcalosis respiratoria): el fosfato entra en la célula y el suero baja (E p. 49).', org: 'dirección: ficha · p. 49; tamaño ilustrativo' },
};
// Fuentes y notas (lista, REGLAS §7.11)
export const FUENTES = [
  ['El 98 % del K⁺ está dentro de la célula', 18], ['K⁺ sérico frente a total (Fig. 36.2), déficit 200-400 y exceso 100-200 mEq por 1 mEq/L', 19],
  ['Fig. 36.2: la curva, en el dibujo', 20], ['ClK: ritmo 20 mEq/h, 40 grave, cava superior', 23], ['K⁺ de los concentrados de 18 días (2-3 mEq)', 25], ['Furosemida: pierde K⁺ (causa principal de hipopotasemia)', 21], ['Calcio en la hiperpotasemia: 10 mL de gluconato al 10 % (90 mg) en 3 min, repetible a los 5; el efecto cede en 30-60 min (Tabla 36.3)', 27], ['La alcalosis tiene efecto variable sobre el K⁺', 21], ['La acidosis láctica no se asocia a hiperpotasemia', 24],
  ['Mg²⁺: reparto del cuerpo (Tabla 37.1)', 32], ['Furosemida y Mg²⁺ (50 % de los crónicos)', 34], ['MgSO₄: 8 mEq por gramo, 50 % a la orina', 37], ['Mg >13 mEq/L: parada', 39],
  ['Ca: 99 % en hueso, tres fracciones (Fig. 38.1)', 42], ['Total frente a iónico; ningún factor de corrección es fiable', 43], ['Alcalosis y citrato bajan el Ca iónico; el citrato de los concentrados', 44], ['Ca iónico <0,65 mmol/L; gluconato 9 y cloruro 27 mg/mL; bolo recomendado de 200 mg (sube el total 0,5 mg/dL y vuelve a caer a los 30 min, p. 46)', 45],
  ['Hipomagnesemia: el K⁺ no se corrige hasta reponer el Mg (40 % de los casos)', 35], ['Fosfato: la alcalosis respiratoria lo mete en la célula', 49], ['Fosfato: casi todo dentro de la célula; insulina, nutrición parenteral (hipofosfatemia a los 2 días, <1 mg/dL a la semana, Fig. 38.2)', 49], ['Reposición de fosfato (Tabla 38.5; fosfato potásico 4,3 mEq/mL impreso como mEq/L)', 51],
];
export const NOTAS = [
  ['fuente no lo dice', 'La Tabla 37.1 (reparto del Mg²⁺) está en la p. 32 del PDF, no en la 31. El libro no da el reparto del fosfato en cifras: el dibujo solo dice «casi todo dentro».'],
  ['fuente no lo dice', 'Cuánto baja el suero cada dosis de insulina o cuánto quela cada concentrado: el libro da la dirección, no la cifra. Del calcio sí da una cifra (p. 46): 200 mg suben el calcio TOTAL 0,5 mg/dL y vuelve a caer a los 30 min; el dibujo pone 0,5 mg/dL de iónico por 100 mg, el doble y en otra variable: es ilustrativo. Las demás cifras del dibujo son ilustrativas.'],
  ['fuente no lo dice', 'Hipomagnesemia: «más del 50 % de los pacientes de UCI» (p. 39) y «hasta el 65 %» (p. 33) son compatibles: el libro no da una cifra única.'],
  ['fuente no lo dice', 'Fosfato potásico: 4,5 mEq/mL (p. 23); la Tabla 38.5 (p. 51) imprime «K⁺: 4.3 mEq/L» (por litro): probable errata de «mEq/mL», que es lo que usa el dibujo. Del mismo modo, la p. 18 imprime «50 mg/kg» de potasio total y la Fig. 36.1 «50 mEq/kg»: se usa mEq.'],
  ['fuente no lo dice', 'El efecto del pH sobre el K⁺ (3 mEq/L por unidad) es ilustrativo: la Fig. 36.2 (p. 20) da la dirección, pero el libro dice que la alcalosis tiene un efecto variable e impredecible (p. 21) y que la acidosis láctica no se asocia a hiperpotasemia (p. 24).'],
  ['fuente no lo dice', 'Los sellos de K⁺ (aviso ≥6, sello ≥7) son ilustrativos: el libro llama grave a más de 6,5 mEq/L (p. 27). «La mitad por la orina» del MgSO₄ es de la pauta de hipomagnesemia leve con riñón normal (p. 37) y el dibujo la aplica a cualquier dosis; 8 mEq por gramo es del MgSO₄·7H₂O (p. 37); la retención de Mg es poco fiable con mala función renal (p. 38).'],
  ['fuente no lo dice', 'Cuánto ClK se pierde por la orina con el Mg²⁺ bajo: el libro dice que la hipopotasemia con falta de Mg puede ser refractoria al ClK (p. 35), sin dar fracción; el dibujo pierde ~¾ cuando el Mg²⁺ llega a 1,0 mEq/L (de 1,4 hacia abajo, en proporción; ilustrativo). Tampoco da cuánto baja el fosfato con la alcalosis respiratoria (p. 49): 0,3 mg/dL por 0,1 de pH, ilustrativo.'],
  ['opinión del autor', 'Cloruro cálcico solo en el colapso circulatorio (p. 27, 45): el libro lo recomienda así.'],
];
export const CRECIMIENTO = [
  ['Nefrología · Potasio vivo e hiperpotasemia: el K⁺ y el ECG en la hiperpotasemia', 'nefrologia'],
  ['Libro Azul · Vías urinarias: el riñón que pierde o retiene K⁺ y Mg²⁺', 'fisio-uci'],
  ['Manual UMI · Iones: reposición de K⁺, Mg²⁺, Ca²⁺ y fosfato a pie de cama', 'sobrevivir-umi'],
  ['ECG de la hipopotasemia (onda U, T plana, QT largo): pendiente de dibujar en El corazón eléctrico', 'ritmoVivo'],
];
export const PENDIENTE = 'Pendiente: El corazón eléctrico aún no dibuja la onda U, la T plana ni el QT largo de la hipopotasemia (p. 22). Se pinta el trazo que hay.';

// PA y FC de cada paciente: ilustrativos (el libro no los da); Valentín, como dice el enunciado de su caso.
export const VITALES_ORIGEN = 'PA, FC, FR y SatO₂ ilustrativas';
// A qué párrafo de la ficha de la app lleva cada página del PDF: [ficha (pestaña), id del párrafo]
export const PAG_FICHA = {
  18: ['mr-hipopotasemia', 'mr-k-total'], 19: ['mr-hipopotasemia', 'mr-k-curva'], 20: ['mr-hipopotasemia', 'mr-k-curva'], 21: ['mr-hipopotasemia', 'mr-hipok-redistribucion'],
  22: ['mr-hipopotasemia', 'mr-hipok-arritmias'], 23: ['mr-hipopotasemia', 'mr-kcl-ritmo'], 24: ['mr-hiperk-causas', 'mr-hiperk-acidosis'], 25: ['mr-hiperk-causas', 'mr-hiperk-transfusion'],
  26: ['mr-hiperk-causas', 'mr-ecg-correlacion'], 27: ['mr-hiperk-tratamiento', 'mr-calcio-preparados'], 32: ['mr-magnesio-deficit', 'mr-tabla-37-1'], 33: ['mr-magnesio-deficit', 'mr-mg-orina'],
  34: ['mr-magnesio-deficit', 'mr-mg-farmacos'], 35: ['mr-magnesio-deficit', 'mr-mg-electrolitos'], 36: ['mr-magnesio-deficit', 'mr-mg-neuro'], 37: ['mr-magnesio-reposicion', 'mr-mg-leve'], 38: ['mr-magnesio-reposicion', 'mr-mg-retencion'], 39: ['mr-magnesio-reposicion', 'mr-hipermg-umbral'],
  42: ['mr-calcio-hipoca', 'mr-ca-fracciones'], 43: ['mr-calcio-hipoca', 'mr-ca-albumina'], 44: ['mr-calcio-hipoca', 'mr-hipoca-transfusion'], 45: ['mr-calcio-hipoca', 'mr-ca-pauta'],
  46: ['mr-calcio-hipoca', 'mr-ca-cuidado'], 49: ['mr-fosforo', 'mr-hipop-glucosa'], 51: ['mr-fosforo', 'mr-fosfato-soluciones'],
};
export const fichaDe = (p) => PAG_FICHA[p] || PAG_FICHA[Math.max(...Object.keys(PAG_FICHA).filter((k) => +k <= p).map(Number), 18)];
export const IDEA = ['Una misma bajada del K⁺ del suero esconde el doble de potasio perdido que el que sobra en una subida: lo que ves es una ventanita.', 19];
// Una idea de cabecera por ion (la del ion que se mira). La del K⁺ es IDEA; las otras tres, con su página del PDF.
export const IDEAS = {
  k: IDEA,
  mg: ['El suero guarda solo el 0,3 % del magnesio del cuerpo: puede salir normal con el depósito vacío.', 32],
  ca: ['El laboratorio mide el calcio total; el iónico, el que actúa, puede estar bajo con el total casi normal.', 43],
  p: ['El fosfato está casi todo dentro de la célula: la insulina y la alcalosis respiratoria lo meten y el suero se hunde.', 49],
};
