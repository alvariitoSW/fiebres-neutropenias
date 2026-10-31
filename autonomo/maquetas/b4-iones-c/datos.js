// Datos de «iones vivos · A pie de cama». Cada cifra lleva su página de la fuente E (docs/marino-2024-electrolitos-caps35-38.pdf,
// página del PDF). Lo que no sale del libro se rotula «ilustrativo» o «fisiología general» donde se ve.
export const PDF = '../../docs/marino-2024-electrolitos-caps35-38.pdf';
export const pag = n => `${PDF}#page=${n}`;
export const cita = c => { const n = typeof c === 'number' ? c : parseInt(String(c).replace(/\D/g, ''), 10); return n ? `<span class="cita"><a href="${pag(n)}" target="_blank" rel="noopener">Marino, p. ${n}</a></span>` : ''; };

// Pacientes posibles (los inventa el plan; la medicina sale de la ficha). Cifras de ingreso en cada uno.
export const PACIENTES = {
  damian: { nombre: 'Damián, 52 años', resumen: 'Alcohólico desnutrido, vómitos; va a empezar nutrición parenteral', peso: 70, k: 3.6, mg: 1.4, po4: 2.1, caI: 1.12, alb: 2.6, ph: 7.36, paco2: 38, na: 134, cl: 96, fc: 96, pas: 118, pad: 72, renal: false },
  rufino: { nombre: 'Rufino, 74 años', resumen: 'Sonda nasogástrica 5 días y furosemida crónica', peso: 70, k: 2.8, mg: 1.0, po4: 3.0, caI: 1.12, alb: 3.2, ph: 7.52, paco2: 52, na: 136, cl: 82, fc: 88, pas: 126, pad: 74, renal: false },
  valentin: { nombre: 'Valentín, 45 años', resumen: 'Politrauma; los concentrados de hematíes van entrando', peso: 80, k: 4.1, mg: 1.7, po4: 3.2, caI: 1.12, alb: 2.8, ph: 7.22, paco2: 40, na: 140, cl: 104, fc: 118, pas: 98, pad: 58, renal: true },
  adela: { nombre: 'Adela, 72 años', resumen: 'Enalapril, espironolactona e ibuprofeno; creatinina alta', peso: 65, k: 6.9, mg: 2.0, po4: 4.5, caI: 1.1, alb: 3.4, ph: 7.3, paco2: 38, na: 138, cl: 104, fc: 62, pas: 138, pad: 80, renal: true },
};
export const ORDEN = ['damian', 'rufino', 'valentin', 'adela'];

// Fuentes y erratas que se enseñan junto a lo que usan
export const NOTAS = [
  { tipo: 'las fuentes discrepan', t: 'K⁺ total frente a sérico. El texto (p. 19) dice 200-400 mEq de déficit por cada 1 mEq/L que baja desde 4, y 100-200 de exceso por cada 1 que sube. La Tabla 36.1 (p. 22) da 175 mEq para 3,0 (350 por mEq/L desde 3,5). Se enseñan las dos; el modelo usa el punto medio del texto (300 y 150) y lo rotula ilustrativo.', pag: 19 },
  { tipo: 'las fuentes discrepan', t: 'Fosfato potásico: 4,5 mEq de K⁺ por mL (p. 23) frente a 4,3 mEq/mL (Tabla 38.5, p. 51). El modelo no usa ninguna de las dos para calcular.', pag: 51 },
  { tipo: 'las fuentes discrepan', t: 'Hipomagnesemia en la UCI: «hasta el 65 %» (p. 33) frente a «más del 50 %» (p. 39). El modelo no usa ninguna de las dos.', pag: 33 },
  { tipo: 'la fuente no lo dice', t: 'Cuánto baja el K⁺, el Mg²⁺ o el fosfato cada hora de nutrición, cuánto sube el Ca²⁺ iónico con un bolo y cuánto tardan en repartirse: la ficha da solo la dirección (y el 0,6 mEq/L de la insulina, p. 28). Las cifras del modelo son ilustrativas.', pag: 49 },
  { tipo: 'la fuente no lo dice', t: 'La alcalosis y el K⁺: el efecto es «variable e impredecible» (p. 21). Por eso el mando de pH solo mueve el calcio iónico, no el potasio.', pag: 21 },
  { tipo: 'pendiente', t: 'ECG del K⁺ bajo (onda U, T plana, QT largo) y de la hipocalcemia (QT): el ritmo vivo todavía no los tiene (solo da el K⁺ alto, 5,5-8,6). No se inventa el trazo: se pinta el que hay y se avisa.', pag: 22 },
];
export const FUENTES = [
  { t: 'Marino. El libro de la UCI, 5.ª ed. Cap. 36 · Potasio', pag: 19 }, { t: 'Cap. 37 · Magnesio', pag: 31 }, { t: 'Cap. 38 · Calcio y fosfato', pag: 42 },
  { t: 'Ritmo vivo (la app): ECG y estado «potasio alto», de De Sequera 2024 p. 21', pag: 26 },
];
export const PROFUNDIZAR = [
  'Prueba de retención de Mg (6 g en 1 h; orina de 24 h ≤12 mmol = déficit, >19 = lleno; Tabla 37.5, p. 38): no se simula.',
  'Hipercalcemia y su tratamiento (calcitonina, bisfosfonatos), caps. 38 p. 46-48: ficha 22.',
  'El tubo de muestra (puño, vacío, hemólisis: K⁺ falso alto, p. 23-24): ficha 17.',
];

// Topes: cada uno con su origen (página de E). La consecuencia se ve en el sello, el monitor y las cifras.
export const TOPES = {
  clk: { titulo: 'Asistolia', texto: 'ClK a más de 20 mEq/h por la cava superior: riesgo de asistolia. La bomba se para.', pag: 23, origen: 'ficha · p. 23' },
  clkAviso: { titulo: 'En el límite', texto: '20 mEq/h es el máximo habitual. Por la cava superior, ni un mEq más.', pag: 23, origen: 'ficha · p. 23' },
  mg: { titulo: 'Parada cardiaca', texto: 'Mg²⁺ por encima de 13 mEq/L: parada cardiaca. Se apagan los mandos del Mg.', pag: 39, origen: 'ficha · p. 39' },
  mgAviso: { titulo: 'Mg²⁺ alto', texto: 'Por encima de 4: hiporreflexia; de 5: bloqueo AV de 1.er grado; de 10: bloqueo completo.', pag: 39, origen: 'ficha · p. 39' },
  ca: { titulo: 'Ca²⁺ iónico <0,65', texto: 'Hipotensión y ectopia ventricular. Se apaga el citrato; reponer calcio.', pag: 45, origen: 'ficha · p. 45' },
  caAviso: { titulo: 'Ca²⁺ iónico bajo', texto: 'Con la transfusión masiva baja de 0,9 en más de la mitad de los pacientes.', pag: 44, origen: 'ficha · p. 44' },
  po4: { titulo: 'Fosfato <1 mg/dL', texto: 'Hipofosfatemia grave: falla el músculo (respiratorio y cardiaco). Se para la nutrición; repón fosfato.', pag: 50, origen: 'ficha · p. 50-51' },
  caiv: { titulo: 'Bolo de calcio >200 mg', texto: 'Más de 200 mg de calcio elemental en 10 minutos supera el bolo de la ficha. Sobredosis rápida: arritmia (fisiología general).', pag: 45, origen: 'ficha · p. 45' },
  caivInf: { titulo: 'Calcio >2 mg/kg/h', texto: 'Por encima de 1-2 mg/kg/h de la ficha. La bomba se para.', pag: 45, origen: 'ficha · p. 45' },
  comb: { titulo: 'Combinación no fisiológica', texto: 'Con un K⁺ así el potasio total y el sérico no caben en la curva (Fig. 36.2). Se para la reposición.', pag: 19, origen: 'ficha · p. 19' },
};
