import { tapseDeLatido } from './corazon-geo.mjs';
import { BASE } from './motor.mjs';
// Escenarios de prueba del motor. Los usan la página (botones «Pruebas del barorreflejo») y las pruebas
// automáticas, que comprueban que cada uno reproduce el patrón de su tipo de shock en la fuente.
// Cada escenario parte del estado normal estable y cambia lo mínimo para provocar su tipo de shock.
// Las magnitudes del cambio son ilustrativas; lo que se exige es la DIRECCIÓN del patrón.
//
// GRAVEDAD (hemorragia, fallo del VI, derrame y TEP): aplicar(m, g) con g de 0 a 1, un mando sin saltos. 0 = sin lesión
// (el corazón normal); 1 = shock a fondo, y aun así un paciente posible (PAM 45-60, sin ceros ni NaN; lo comprueba
// pruebas/escenarios.test.mjs). Sin g, gravedad.defecto: el escenario de siempre, con las mismas cifras. El estado de una
// gravedad se lee asentado, 40 s después de aplicarla (maniobras.mjs, faltaParaAsentar), como las maniobras: el motor
// la aplica de golpe y el barorreflejo tarda ~10 s en responder. Los topes de cada mando, ilustrativos salvo lo que se cita.
const HEM_FRACCION_MAX = 0.42;                 // de la volemia: Clase IV, >40 % (Marino, Tabla 15.1, cap. 15, p. 22)
const HEM_ML_MAX = HEM_FRACCION_MAX * BASE.vSangre;    // ~2.040 mL
const EES_VI_MIN = 0.3;                        // mmHg/mL, ~10 % de la normal (3,1)
// mL; con el pericardio del modelo, el taponamiento (derrame agudo). 390 → 388 con la RVS calibrada (octubre 2026, segunda
// vuelta): con 390 el IC a fondo bajaba a 1,19. Un derrame mayor y establecido (crearMotor({ liquidoPeri })), en motor.mjs
const DERRAME_ML_MAX = 388;
// el derrame va en parábola (mL = máx · (1 − (1 − g)²)): la presión del saco crece en exponencial con el volumen, así que
// cerca del final cada paso del mando añade menos líquido y la PA no cae a saltos
const derrameMl = (g) => DERRAME_ML_MAX * (1 - (1 - g) ** 2);
const DERRAME_DEFECTO = 1 - Math.sqrt(1 - 260 / DERRAME_ML_MAX);
// TEP: resistencia pulmonar ×9,3 a fondo (antes ×16) y el defecto, el de siempre (×8 y contractilidad del VD ×0,65), que ahora
// cae en g ≈ 0,93. Con la isquemia del VD en el motor (motor.mjs, isqDesde), ×16 hundía al VD sin freno (PAM 30); y ×16 sin
// ella daba una pulmonar media de 54 mmHg, que un VD sin hipertrofia no sostiene. A fondo, ~40/33 (media ~36). Ilustrativo
const TEP_RPUL_MAX = 9.3, TEP_EES_VD_DEFECTO = 0.35, TEP_DEFECTO = Math.log(8) / Math.log(TEP_RPUL_MAX);
const coma = (x, d = 0) => x.toFixed(d).replace('.', ',');
export const ESCENARIOS = {
  normal: { nombre: 'Normal', aplicar: () => {} },
  hemorragia: {
    nombre: 'Hemorragia de 1 L', tipo: 'hipovolemico',
    // sangre perdida, de 0 al 42 % de la volemia. El defecto, 1 L (el 21 %: Clase II)
    gravedad: { defecto: 1000 / HEM_ML_MAX, texto: (g) => `${Math.round(g * HEM_ML_MAX)} mL perdidos (${Math.round(g * HEM_FRACCION_MAX * 100)} % de la volemia)` },
    // (se va a su ritmo: motor.mjs, ritmoHemorragia)
    aplicar: (m, g = 1000 / HEM_ML_MAX) => { m.p.hemorragia = g * HEM_ML_MAX; },
  },
  fallo: {
    nombre: 'Fallo del VI', tipo: 'cardiogenico',
    // contractilidad del VI (Ees) de la normal a EES_VI_MIN, en escala logarítmica (cada paso la multiplica por lo mismo).
    // El defecto, Ees 0,9
    gravedad: { defecto: Math.log(BASE.vi.ees / 0.9) / Math.log(BASE.vi.ees / EES_VI_MIN),
      texto: (g) => `contractilidad del VI al ${Math.round(100 * (EES_VI_MIN / BASE.vi.ees) ** g)} % de la normal` },
    aplicar: (m, g = Math.log(BASE.vi.ees / 0.9) / Math.log(BASE.vi.ees / EES_VI_MIN)) => { m.p.vi.ees = BASE.vi.ees * (EES_VI_MIN / BASE.vi.ees) ** g; },
  },
  derrame: {
    nombre: 'Derrame pericárdico', tipo: 'obstructivo',
    // líquido en el saco, de 0 a DERRAME_ML_MAX (entra a su ritmo: motor.mjs, ritmoDerrame). El defecto, 260 mL
    gravedad: { defecto: DERRAME_DEFECTO, texto: (g) => `${Math.round(derrameMl(g))} mL de derrame` },
    aplicar: (m, g = DERRAME_DEFECTO) => { m.p.liquidoPeri = derrameMl(g); },
  },
  vasoplejia: {
    nombre: 'Vasoplejía', tipo: 'vasodilatador',
    // Resistencias a la mitad y venodilatación (más volumen venoso "sin tensión", que deja de volver al
    // corazón): Marino, cap. 14, pág. 4 — el shock vasodilatador es una vasodilatación difusa «de arterias y venas».
    // (Antes ×0,4, calibrado con un barorreflejo que subía las resistencias hasta +60 %; con el techo de +15 % (motor.mjs,
    // gravedad del shock), ×0,5 deja la misma PA: ~52 a los 10 s y ~66 asentada. Con la RVS calibrada (rSis 1,05 → 0,90) y el
    // techo de +35 % (motor.mjs, 21/10/2026), ×0,5 la dejaba en ~49 a los 10 s (sistólica 59) y ×0,55 da otra vez ~53 y ~69,
    // con una resistencia absoluta parecida a la de antes. Ilustrativo)
    aplicar: (m) => { m.p.rSis *= 0.55; m.p.vuVen *= 1.5; },
  },
  // --- Formas de enfermedad: cambian la anatomía además del latido (excepción a «anatomía congelada», a petición
  // del usuario: «hazlas según la bibliografía de la aplicación»). Lo que se exige son las cifras de CRITERIOS_FORMA,
  // todas de fichas de la app; los parámetros del modelo que las producen (masa, rigidez, contractilidad, resistencias,
  // volumen retenido) son ilustrativos.
  hipertrofia: {
    nombre: 'Hipertrofia del VI', forma: true,
    // sobrecarga de presión (HTA): más masa (pared gruesa), ventrículo rígido y más resistencia sistémica.
    // Fisiopatología UCI · Cardiología, Ficha 3: la sobrecarga de presión produce hipertrofia del VI y rigidez
    aplicar: (m) => { m.p.mioVi = 1.6; m.p.vi.b *= 2.2; m.p.rSis *= 1.25; },
  },
  dilatada: {
    nombre: 'Miocardiopatía dilatada', forma: true,
    // contractilidad baja, ventrículo que se dilata y retención de líquidos (Ficha 3: el círculo vicioso de la
    // retención); algo más de masa con la pared normal (hipertrofia excéntrica, Ficha 3)
    aplicar: (m) => { m.p.mioVi = 1.4; m.p.vi.ees = 1.0; m.p.vi.v0 = 60; m.s.vven += 700; },
  },
  tep: {
    // Nombre como el libro: con disfunción del VD y sin inestabilidad (PAM ~67) es la EP de riesgo intermedio
    // («submasiva»); «masiva» es la de alto riesgo, con inestabilidad hemodinámica (Marino, cap. 22, p. 7,
    // docs/marino-2024-respiratory-management-caps22-26.pdf#page=7). Antes se llamaba «TEP masivo». La gravedad a fondo
    // sí la tiene (PAM <65): la de alto riesgo. (Con la RVS calibrada, el de siempre da una PAM de ~67)
    nombre: 'TEP de riesgo intermedio (VD)', forma: true,
    // el émbolo sube la resistencia pulmonar (poscarga del VD) y el VD falla: se dilata, se vacía mal y empuja el
    // tabique hacia el VI (Fisiopatología UCI · Cardiología, Fichas 8 y 9; Merino, IC derecha)
    // gravedad: resistencia pulmonar ×9,3^g (escala logarítmica) y contractilidad del VD que cae a la par; el defecto
    // (~0,93) es el de siempre: ×8 y ×0,65
    gravedad: { defecto: TEP_DEFECTO, texto: (g) => `resistencia pulmonar ×${coma(TEP_RPUL_MAX ** g, 1)}` },
    aplicar: (m, g = TEP_DEFECTO) => { m.p.rPul *= TEP_RPUL_MAX ** g; m.p.vd.ees *= 1 - TEP_EES_VD_DEFECTO / TEP_DEFECTO * g; },
  },
};

// Las formas de enfermedad son estados ya establecidos: tras aplicarlas se deja correr el motor este tiempo (s) para
// que se asienten (la página y las pruebas usan el mismo). Los escenarios de shock se ven a los 10 s.
export const ASENTAR_FORMA = 40;

// El escenario tal como lo ve la app (simulador.mjs) y lo comprueban las pruebas: se aplica sobre el normal y se deja
// correr 10 s un shock (para ver al barorreflejo respondiendo) o ASENTAR_FORMA una forma de enfermedad. Apunta cuándo se
// aplicó (p.tEscenario): las maniobras de volumen esperan a que el paciente esté asentado (maniobras.mjs, faltaParaAsentar)
// g: la gravedad (0-1) en los escenarios que la tienen; sin ella, la de siempre
export function aplicarEscenario(m, k, g) {
  ESCENARIOS[k].aplicar(m, g);
  if (k !== 'normal') { m.p.tEscenario = m.s.t; m.correr(ESCENARIOS[k].forma ? ASENTAR_FORMA : 10); }
  return m;
}

// --- Criterios de cada forma de enfermedad: cifras y direcciones de las fichas de la app ---
// c = { u, md, u0, md0 }: el último latido y las medidas del corazón (ecografia.mjs, medidasCorazon) de la forma y del
// corazón normal. Cada criterio dice qué ficha lo da (fuente: la línea exacta, para el botón «ir a la ficha»).
const FATE = { sel: '#umi-fate-dimensiones', especialidad: 'sobrevivirUmi', view: 'manualUmi', panel: 'panel-manual-umi-tabs', tab: 'umi-fate', ficha: 'Manual UMI · FATE' };
const ESC_HVI = { sel: '#ic-hfpef-hvi', especialidad: 'cardiologia', view: 'insuficienciaCardiaca', panel: 'panel-cardio-ic-tabs', tab: 'ic-diagnostico', ficha: 'Guía ESC de IC · Diagnóstico' };
const MERINO_FE = { sel: '#mc-tabla-18-1', especialidad: 'cardiologia', view: 'merinoCardiologia', panel: 'panel-merino-cardio-tabs', tab: 'mc-ic-tipos', ficha: 'Merino · IC aguda (Tabla 18.1)' };
const MERINO_HFPEF = { ...MERINO_FE, sel: '#mc-hfpef', ficha: 'Merino · IC con FE preservada' };
const MERINO_VD = { ...MERINO_FE, sel: '#mc-ic-derecha', ficha: 'Merino · IC derecha' };
const MERINO_FIG = { ...MERINO_FE, sel: '#mc-fig-18-2', ficha: 'Merino · Figura 18.2' };
const MERINO_SEPTO = { ...MERINO_FE, sel: '#mc-vd-septo', ficha: 'Merino · IC derecha (ETT)' };
const F11_VD = { sel: '#cardio-eco-vd', especialidad: 'fisioUci', view: 'cardiologia', panel: 'panel-cardio-tabs', tab: 'cardio-interaccion-corazon-pulmon', ficha: 'Fisiopatología UCI · Cardiología · Ficha 11' };
const F11_COR = { ...F11_VD, sel: '#cardio-cor-pulmonale' };
const mm = (x) => x.toFixed(1).replace('.', ',') + ' mm';
export const CRITERIOS_FORMA = {
  hipertrofia: [
    { texto: 'Pared posterior >10 mm (normal 6-10 mm)', valor: (c) => mm(c.md.paredPost), cumple: (c) => c.md.paredPost > 10, fuente: FATE },
    { texto: 'Grosor relativo de pared >0,42', valor: (c) => c.md.rwt.toFixed(2).replace('.', ','), cumple: (c) => c.md.rwt > 0.42, fuente: ESC_HVI },
    { texto: 'Masa del VI ≥115 g/m² (varón)', valor: (c) => Math.round(c.md.masaIndice) + ' g/m²', cumple: (c) => c.md.masaIndice >= 115, fuente: ESC_HVI,
      nota: 'masa = volumen de miocardio × 1,05 g/mL (densidad: fisiología general)' },
    { texto: 'FEVI ≥50 % (FE preservada)', valor: (c) => Math.round(c.u.fe * 100) + ' %', cumple: (c) => c.u.fe >= 0.5, fuente: MERINO_FE },
    { texto: 'Cae el volumen telediastólico y, con él, el sistólico', valor: (c) => `${Math.round(c.u.edv)} mL / ${Math.round(c.u.vs)} mL (normal ${Math.round(c.u0.edv)} / ${Math.round(c.u0.vs)})`,
      cumple: (c) => c.u.edv < c.u0.edv && c.u.vs < c.u0.vs, fuente: MERINO_HFPEF },
  ],
  dilatada: [
    { texto: 'VI en diástole >5,5 cm (normal 3,5-5,5 cm)', valor: (c) => mm(c.md.lvdd), cumple: (c) => c.md.lvdd > 55, fuente: FATE },
    { texto: 'FEVI ≤40 % (FE reducida)', valor: (c) => Math.round(c.u.fe * 100) + ' %', cumple: (c) => c.u.fe <= 0.4, fuente: MERINO_FE },
    { texto: 'Pared posterior en rango normal (6-10 mm)', valor: (c) => mm(c.md.paredPost), cumple: (c) => c.md.paredPost >= 6 && c.md.paredPost <= 10, fuente: FATE },
  ],
  tep: [
    { texto: 'Área del VD / área del VI >0,6 (cor pulmonale agudo)', valor: (c) => c.md.areaVdVi.toFixed(2).replace('.', ',') + ` (normal ${c.md0.areaVdVi.toFixed(2).replace('.', ',')})`,
      cumple: (c) => c.md.areaVdVi > 0.6, fuente: F11_COR,
      nota: 'medida en el plano apical de 4 cámaras del modelo. Ojo: Merino da como normal un VD de ~2/3 del tamaño del VI (sin decir si es área o diámetro), que con esta cifra ya sería cor pulmonale; las dos fuentes de la app no casan' },
    { texto: 'VD en diástole >3,0 cm (normal 0,6-3,0 cm)', valor: (c) => mm(c.md.vdDiam), cumple: (c) => c.md.vdDiam > 30, fuente: FATE },
    { texto: 'El VI se hace más pequeño (el tabique lo empuja)', valor: (c) => `${mm(c.md.lvdd)} (normal ${mm(c.md0.lvdd)})`, cumple: (c) => c.md.lvdd < c.md0.lvdd - 5, fuente: MERINO_SEPTO },
    { texto: 'Tabique aplanado en diástole', valor: (c) => c.md.septo >= 0.5 ? 'sí' : 'no', cumple: (c) => c.md.septo >= 0.5, fuente: MERINO_FIG },
    { texto: 'TAPSE <17 mm', valor: (c) => mm(c.tapse), cumple: (c) => c.tapse < 17, fuente: F11_VD },
    { texto: 'Sube el volumen telediastólico del VD', valor: (c) => `${Math.round(c.u.edvD)} mL (normal ${Math.round(c.u0.edvD)})`, cumple: (c) => c.u.edvD > c.u0.edvD, fuente: MERINO_VD },
  ],
};

// Patrón de cada tipo de shock frente al estado normal.
// PVC, GC y RVS: Merino Cardiología, Tabla 14.1 (Marino, The ICU Book, 5.ª ed., cap. 14),
// docs/marino-2024-shock-caps14-17.pdf, pág. 3 (en el libro, «Low/High»: aquí ↓/↑). PCP: Fisiopatología UCI · Cardiología, Ficha 10 (El Libro Azul,
// cap. 10, Figura 2), docs/libro-azul-seccion-i-cardiovascular-parte2.pdf, pág. 33; no se exige en el
// vasodilatador porque esa figura da «N/↑» y la Tabla 14.1 no la recoge.
// '↑' sube, '↓' baja, 'N/↑' no baja.
export const PATRONES = {
  hipovolemico: { pvc: '↓', gc: '↓', rvs: '↑', pcp: '↓' },
  cardiogenico: { pvc: '↑', gc: '↓', rvs: '↑', pcp: '↑' },
  obstructivo: { pvc: '↑', gc: '↓', rvs: '↑', pcp: '↑' },
  vasodilatador: { pvc: '↓', gc: 'N/↑', rvs: '↓' },
};
export const FUENTE_PATRONES = 'Merino Cardiología, Tabla 14.1 (PVC, GC, RVS) y Fisiopatología UCI · Cardiología, Ficha 10, Figura 2 (PCP)';

// Umbral para dar un cambio por real: presiones, 0,5 mmHg; flujos y resistencias, 5 %
export function direccion(var_, normal, actual) {
  const umbral = (var_ === 'pvc' || var_ === 'pcp') ? 0.5 : 0.05 * Math.abs(normal);
  if (actual > normal + umbral) return '↑';
  if (actual < normal - umbral) return '↓';
  return 'N';
}
export const cumple = (esperado, obtenido) => esperado === 'N/↑' ? obtenido !== '↓' : esperado === obtenido;

// Evalúa los criterios de una forma: u/u0 = motor.ultimo de la forma y del normal; md/md0 = medidasCorazon.
// El TAPSE es la excursión del anillo tricuspídeo lateral del modelo (corazon-geo, F5: acortamiento longitudinal de la pared libre del VD, según su eyección).
export function evaluarForma(clave, u, md, u0, md0) {
  const c = { u, md, u0, md0, tapse: tapseDeLatido(u) };
  return (CRITERIOS_FORMA[clave] || []).map(k => ({ ...k, ok: k.cumple(c), v: k.valor(c) }));
}
