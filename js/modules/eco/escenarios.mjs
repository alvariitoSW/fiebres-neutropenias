import { tapseDeLatido } from './corazon-geo.mjs';
import { BASE, escalarRPul } from './motor.mjs';
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
const EES_VI_MIN = 0.31;
const FALLO_DEFECTO = Math.log(3.1 / 0.9) / Math.log(3.1 / EES_VI_MIN);   // Ees 0,9 (ver «fallo»)                        // mmHg/mL, ~10 % de la normal (3,1)
// mL; con el pericardio del modelo, el taponamiento (derrame agudo). 390 → 388 con la RVS calibrada (octubre 2026, segunda
// vuelta): con 390 el IC a fondo bajaba a 1,19; 388 → 383 con la AI que suma su contracción (eco-calibra-a, 28/10/2026): con 388, 1,15. Un derrame mayor y establecido (crearMotor({ liquidoPeri })), en motor.mjs
// 383 → 377 con la cola de la activación entre latidos (P4b): con 383 el IC a 95-100 % bajaba a 1,18, bajo el 1,2 del paciente posible
const DERRAME_ML_MAX = 377;
// el derrame va en parábola (mL = máx · (1 − (1 − g)²)): la presión del saco crece en exponencial con el volumen, así que
// cerca del final cada paso del mando añade menos líquido y la PA no cae a saltos
const derrameMl = (g) => DERRAME_ML_MAX * (1 - (1 - g) ** 2);
const DERRAME_DEFECTO = 1 - Math.sqrt(1 - 260 / DERRAME_ML_MAX);
// TEP: resistencia pulmonar a fondo ×9,0 (antes ×16, luego ×9,3); el defecto, desde P5a, es el submasivo (g 0,7, ver abajo). Con la isquemia del VD en el motor (motor.mjs, isqDesde), ×16 hundía al VD sin freno (PAM 30); y ×16 sin
// ella daba una pulmonar media de 54 mmHg, que un VD sin hipertrofia no sostiene. A fondo, ~40/33 (media ~36). Ilustrativo
// P4b: 9,3 → 9,0 con la cola de la activación entre latidos: con 9,3 la PAM caía 8,0 mmHg entre el 95 y el 100 % (el límite de la prueba, 7,5)
const TEP_RPUL_MAX = 6.6, TEP_EES_VD_PENDIENTE = 0.35 / (Math.log(8) / Math.log(9.0));   // la contractilidad del VD cae con la misma pendiente de siempre (≈0,37 por unidad de u)
// P5a (mv-eco-2a5): el defecto pasa a ser el TEP de RIESGO INTERMEDIO (submasivo): VD dilatado (VD/VI >1,0) y FEVD/TAPSE bajos con la
// PAM normal, sin hipotensión; y el tramo final (a partir de TEP_G_MASIVO) es el de ALTO RIESGO: PAM <70 (Marino cap. 22, «Management»,
// PDF p. 7: riesgo intermedio = disfunción del VD sin inestabilidad hemodinámica; alto riesgo = con inestabilidad). Umbral de hipotensión:
// PAS <90 o PAM <70 mmHg (Marino cap. 14, «Clinical Features», docs/marino-2024-shock-caps14-17.pdf#page=2). El mando se curva
// (u = g^0,6) para que la hipotensión empiece hacia el 85 % y no en el último 8 %: la resistencia pulmonar y la contractilidad siguen
// u, no g. u = g^0,6 es ilustrativo; el defecto es g = 0,7 (resistencia pulmonar ×5,9, antes ×8)
// P3 (mv-eco-2a5): el émbolo proximal baja también la distensibilidad arterial pulmonar (cAp ÷ R^0,9) y acorta la sístole del VD
// (×(1 − 0,3 u)): el flujo pulmonar pica pronto y el tiempo de aceleración pulmonar queda <105 ms, signo de sobrecarga del VD
// (ESC/ERS 2022, Fig. 4 y Tabla 10, docs/esc-ers-2022-hipertension-pulmonar-parte1.pdf, PDF p. 27-28 = p. 3644-3645). Los dos
// exponentes son ilustrativos (no hay cifra de la fuente). Con ellos la resistencia máxima baja de ×9,0 a ×6,6: la menor
// distensibilidad ya sube la PSAP, y así PAM, GC y PSAP del TEP quedan donde estaban (PAM 100 % 59, defecto 74)
const TEP_CAP_EXP = 0.9;
const TEP_DUR_VD = 0.3;
const TEP_CURVA = 0.6, TEP_DEFECTO = 0.7, TEP_G_MASIVO = 0.85;
const tepU = (g) => Math.max(0, g) ** TEP_CURVA;
const DILATADA_V0 = 60;                        // mL, volumen sin tensión del VI en la dilatada (ilustrativo)
const EROA_IM_POR_DIL = 0.25, EROA_IM_TOPE = 0.35, AI_V0_POR_DIL = 20;   // cm² y mL, ilustrativos (ver «dilatada»)
// Relajación lenta del VI (motor.relajacion: alarga la cola de su activación). Es la MISMA que baja e′ en el Doppler tisular
// (atlas/diastolica.mjs, ePrima): e′ = 12 ÷ relajación^0,6 (× la restitución si la FE es baja). Ilustrativo; las formas que no son
// del VI (hemorragia, derrame, TEP, HP crónica, vasoplejía) la dejan en 1 (e′ normal, banda c). El fallo llega a 2,3 en su defecto
// (2,8 en la sesión 1, 2,3 en la sesión 2: ver FALLO_RELAJACION); la dilatada usaba 2,8 y ahora RELAJACION_FER (abajo)
// Fallo del VI (eco-calibra-a s2, fallo): relajación 1 → 2,3 y AI 1,3 veces más rígida con la gravedad (ilustrativos). Con 2,8 la cola de
// activación de un VI grande dejaba su presión alta en el llenado rápido y la E no subía; 2,3 con la restitución de e′ (FE ≈30 %)
// da E/e′ ≥14 (Nagueh 2025 p. 554). La AI con presión alta es más rígida: llena menos en la sístole (S/D <1, p. 549, Tabla 4)
const FALLO_RELAJACION = 2.3, FALLO_AI_RIGIDEZ = 1.3;
// P6b (mv-eco-2a5): el fallo a fondo sigue siendo un fallo IZQUIERDO: VI dilatado (VTD ~182 mL, más que en el defecto), PCP ~34, PAM ~58,
// GC ~2,4 (shock cardiogénico; PCP >18: Nagueh 2025, ASE, p. 557, Tabla 7). La contractilidad llega a 0,31 mmHg/mL (FEVI ~11 %) y el
// fallo crónico retiene líquido (Ficha 3, círculo vicioso de la retención): 150 mL menos de volumen sin tensión en las venas (más sangre con tensión; el total no cambia) a fondo, que sube la PVC
// y la precarga. La primera versión de P6 subía la rigidez del VI (vi.b ×2,08): achicaba el VI (VTD 96 mL) y dilataba el VD (196 mL),
// un patrón de fallo derecho; se quitó. Con FEVI baja el motor da e′ septal ~2 cm/s y E ~55 cm/s (por debajo de 3-4 y 70 de p. 561:
// el llenado del VI en el modelo no es tan restrictivo). Ilustrativo, medido con autonomo/bloques/mv-eco/herramientas/medir-p6b.mjs
const FALLO_RETENCION_ML = 150, FALLO_RESTRICTIVO_CURVA = 0.6;
const restrictivo = (g) => Math.max(0, (g - FALLO_DEFECTO) / (1 - FALLO_DEFECTO)) ** FALLO_RESTRICTIVO_CURVA;   // 0 en el defecto, 1 a fondo
// FE reducida (dilatada; eco-calibra-a s2, 28/10/2026): su e′ baja por la relajación Y por la pérdida de las fuerzas de
// restitución (atlas/diastolica.mjs, restitucion; Nagueh 2025 p. 553), así que no hace falta la relajación de la hipertrofia.
// Con 2,8, la cola de la activación del VI dilatado (que multiplica un volumen grande) dejaba la presión del VI alta en todo el
// llenado rápido: con PAI 28 la E no subía (E/A 1,38) y el TDE era de 220 ms. Con 1,3 (τ del modelo ~33 ms frente a ~28 del
// normal) y una cámara algo más rígida (el TDE <140 ms con la FE baja es la PTDVI alta, y el TDE depende de la relajación y la
// rigidez del VI: Nagueh 2025 p. 547, Tabla 4) sale el llenado restrictivo con la PAI alta (grado 3, p. 554). Valores ilustrativos
const RELAJACION_FER = 1.3, RIGIDEZ_DIL = 1.05;
const coma = (x, d = 0) => x.toFixed(d).replace('.', ',');
// HP crónica (cor pulmonale crónico): la resistencia pulmonar sube despacio y el VD se adapta (más contractilidad y pared
// más gruesa, mioVd), hasta que se dilata y falla. Es el mismo recorrido que la sobrecarga de presión del Atlas · 14
// (atlas/vd.mjs, ajustesVd 'presion'; aquí se repite porque ese archivo es de dibujo y no se carga en el motor): g = su
// punto s de 0 a 1. Todos los parámetros, ilustrativos; lo que se exige son las cifras de CRITERIOS_FORMA.hpcronica
const HPC_DEFECTO = 0.55;
// Sesión 2 (eco-calibra-a): la resistencia sube más deprisa al principio (×8,4 en el defecto: el VI recibe menos y E/e′ <8, grupo 1
// precapilar: Nagueh 2025 p. 548; Mukherjee 2025 p. 173 T8) y llega al mismo ×12 a fondo. En la fase de claudicación (x >0,6) el VD se
// dilata menos (v0 +60, no +160, y más rígido: VTD ~230 mL, grave >170 mL: Mukherjee p. 145 T1) y se retiene líquido (+1.200 mL: PVC
// ~16 mmHg, «RAP ≥15 grave» ibíd.) y el tabique transmite más presión del VD al VI (0,05 → 0,20: interdependencia ventricular
// con el VD dilatado), que mantiene llena la AI (≥15 mL del dibujo). Parámetros ilustrativos; lo exigido son las bandas de los jueces
const hpcRecorrido = (g) => { const x = Math.min(1, Math.max(0, g)), c01 = (v) => Math.min(1, Math.max(0, v));
  return { k: x < 0.55 ? 1 + 13.5 * x : 8.425 + (12 - 8.425) * (x - 0.55) / 0.45, ees: x < 0.6 ? 1 + 2.4 * x / 0.6 : 3.4 - 1.9 * (x - 0.6) / 0.4, durVd: 1 + 0.25 * x,
    mioVd: 1 + 1.4 * Math.min(1, x / 0.7), vSangre: 1200 * c01((x - 0.6) / 0.4), b: 1 + 0.4 * x, tab: 0.05 + 0.15 * c01((x - 0.6) / 0.4), v0: 60 * c01((x - 0.5) / 0.5) ** 1.5 }; };
// Hipertrofia (HTA): del grado 1 (relajación lenta, PAI normal) al grado 2 (rigidez y volumen: PAI >15). El defecto, un grado 1 franco
const HVI_DEFECTO = 0.2;
// Sesión 2: la relajación sube a 3,4 y la rigidez de partida a ×1,6 con 300 mL menos de volumen (euvolemia tratada, ilustrativo): la E decelera
// antes (TDE ~410-430 ms en el grado 1, antes 550-580) con E/A ≤0,8, e′ baja y PCP <15; al 100 % queda rigidez ×2,2 y +300 mL (TDE ~215 ms)
const hviRecorrido = (g) => { const x = Math.min(1, Math.max(0, g));
  // P4b: con la cola de la activación entre latidos (la relajación incompleta no se corta al empezar el latido) la presión de fin de diástole
  // sube ~1 mmHg: la E/A del grado 1 pasaba de 0,8 (0,85; Nagueh 2025 p. 554) y la E máxima por la mitral quedaba en 320 mL/s (la valva abre
  // 9,8 mm, bajo los 10 de la prueba C1). Se refuerza la bomba de la AI (×1,3 en aplicar: la AI de la HTA trabaja más contra un VI rígido, A más alta) y se sube
  // la rigidez de partida a ×1,64 (antes ×1,6) con 330 mL menos de volumen (antes 300): E sube, A sube más y la PCP queda bajo 15. El grado 2 (rigidez ×2,2, +300 mL) queda igual
  return { relajacion: 3.4 - 0.4 * x, b: 1.64 + 0.56 * x * x, vSangre: -330 + 630 * x * x }; };
// Suelo de volumen en el shock (eco-calibra-a, sesión 2): un VD de 23 mL al final de la sístole o una aurícula de 6-9 mL no son de un
// paciente real, ni en un shock a fondo (el dibujo exige aurículas ≥15 mL y VD ≥20 mL: LIMITES, corazon-geo.mjs; el VD no lleva suelo: un VD hipovolémico real conserva su FE, y el dibujo admite 20 mL). Se sube el volumen sin
// tensión (v0) de cada cámara lo que pide la gravedad; la presión depende de V−V0, así que la presión no cambia. Para que tampoco cambie
// ninguna otra presión, el mismo volumen se resta al volumen sin tensión de las venas (vuVen: la sangre total no cambia) y se suma al del saco pericárdico (v0Peri). Subirlo en la base (el normal)
// ensanchaba el VD normal a ~160 mL, con una luz de 47 mm en el SC4C, por encima de los 41 mm de dilatación (Lang 2015, p. 17: «un diámetro >41 mm en la base indica dilatación del VD»; VTD normal 3D 87 mL/m² en varones)
// y hacía fallar seis pruebas del normal. Los mL, ilustrativos: lo que fija el suelo son los límites del dibujo
const suelo = (m, vd, ai, ad) => { m.p.vd.v0 += vd; m.p.ai.v0 += ai; m.p.ad.v0 += ad; const t = vd + ai + ad; m.p.v0Peri += t; m.p.vuVen -= t; };
const SUELO_HEM = [0, 9, 8], SUELO_DER = [0, 10, 8], SUELO_TEP = [0, 6, 0], SUELO_VASO = [0, 5, 3];
const sueloG = (m, dosis, g) => suelo(m, dosis[0] * g, dosis[1] * g, dosis[2] * g);

export const ESCENARIOS = {
  normal: { nombre: 'Normal', aplicar: () => {} },
  hemorragia: {
    nombre: 'Hemorragia', tipo: 'hipovolemico',
    // sangre perdida, de 0 al 42 % de la volemia. El defecto, 1 L (el 21 %: Clase II)
    gravedad: { fin: 'el shock hemorrágico a fondo', defecto: 1000 / HEM_ML_MAX, texto: (g) => `${Math.round(g * HEM_ML_MAX)} mL perdidos (${Math.round(g * HEM_FRACCION_MAX * 100)} % de la volemia)` },
    // (se va a su ritmo: motor.mjs, ritmoHemorragia)
    aplicar: (m, g = 1000 / HEM_ML_MAX) => { m.p.hemorragia = g * HEM_ML_MAX; sueloG(m, SUELO_HEM, g); },
  },
  fallo: {
    nombre: 'Fallo del VI', tipo: 'cardiogenico',
    // contractilidad del VI (Ees) de la normal a EES_VI_MIN, en escala logarítmica (cada paso la multiplica por lo mismo).
    // El defecto, Ees 0,9
    gravedad: { fin: 'el shock cardiogénico a fondo', defecto: FALLO_DEFECTO,
      texto: (g) => `contractilidad del VI al ${Math.round(100 * (EES_VI_MIN / BASE.vi.ees) ** g)} % de la normal` },
    aplicar: (m, g = FALLO_DEFECTO) => { m.p.vi.ees = BASE.vi.ees * (EES_VI_MIN / BASE.vi.ees) ** g;
      const u = Math.min(1, g / FALLO_DEFECTO);
      // Más allá del defecto (P6b, ver FALLO_RETENCION_ML): el VI se dilata más con la retención de líquido y la relajación vuelve a 1
      const w = restrictivo(g);
      m.p.relajacion = 1 + (FALLO_RELAJACION - 1) * u * (1 - w);
      m.p.vuVen -= FALLO_RETENCION_ML * w;
      // AI con presión alta: pared más rígida, S venosa pulmonar menor (S/D < 1)
      m.p.ai.b *= 1 + (FALLO_AI_RIGIDEZ - 1) * u; },
  },
  derrame: {
    nombre: 'Derrame pericárdico', tipo: 'obstructivo',
    // Qué se ve: Klein 2013 (p. 981 impresa = PDF 17) mide el derrame por el espacio libre de eco en telediástole: pequeño <10 mm,
    // moderado 10-20, grande >20. Aquí los mm son el crecimiento del saco en el corazón normal (taponamiento.test.mjs); el modelo
    // taponado da una mediana de ~15-16 mm (moderado) y >20 mm por detrás.
    // líquido en el saco, de 0 a DERRAME_ML_MAX (entra a su ritmo: motor.mjs, ritmoDerrame). El defecto, 260 mL
    gravedad: { fin: 'el taponamiento a fondo', defecto: DERRAME_DEFECTO, texto: (g) => `${Math.round(derrameMl(g))} mL de derrame` },
    aplicar: (m, g = DERRAME_DEFECTO) => { m.p.liquidoPeri = derrameMl(g); sueloG(m, SUELO_DER, g); },
  },
  vasoplejia: {
    nombre: 'Vasoplejía', tipo: 'vasodilatador',
    // Resistencias a la mitad y venodilatación (más volumen venoso "sin tensión", que deja de volver al
    // corazón): Marino, cap. 14, pág. 4 — el shock vasodilatador es una vasodilatación difusa «de arterias y venas».
    // (Antes ×0,4, calibrado con un barorreflejo que subía las resistencias hasta +60 %; con el techo de +15 % (motor.mjs,
    // gravedad del shock), ×0,5 deja la misma PA: ~52 a los 10 s y ~66 asentada. Con la RVS calibrada (rSis 1,05 → 0,90) y el
    // techo de +35 % (motor.mjs, 21/10/2026), ×0,5 la dejaba en ~49 a los 10 s (sistólica 59) y ×0,55 da otra vez ~53 y ~69,
    // con una resistencia absoluta parecida a la de antes. Ilustrativo)
    aplicar: (m) => { m.p.rSis *= 0.55; m.p.vuVen *= 1.5; suelo(m, ...SUELO_VASO); },
  },
  // --- Formas de enfermedad: cambian la anatomía además del latido (excepción a «anatomía congelada», a petición
  // del usuario: «hazlas según la bibliografía de la aplicación»). Lo que se exige son las cifras de CRITERIOS_FORMA,
  // todas de fichas de la app; los parámetros del modelo que las producen (masa, rigidez, contractilidad, resistencias,
  // volumen retenido) son ilustrativos.
  hipertrofia: {
    nombre: 'Hipertrofia del VI', forma: true,
    // sobrecarga de presión (HTA): más masa (pared gruesa), ventrículo rígido y más resistencia sistémica.
    // Fisiopatología UCI · Cardiología, Ficha 3: la sobrecarga de presión produce hipertrofia del VI y rigidez
    // gravedad (mando de grado 1 a grado 2; masa y pared fijas en todo el recorrido): con g bajo manda la relajación lenta (e′ baja,
    // E cae, la A pesa: E/A ≤0,8, PCP normal = grado 1); al subir g crecen la rigidez (vi.b) y el volumen retenido, la PAI pasa de 15 y E
    // se recupera (E/A >0,8 y <2 con e′ baja y E/e′ ≥14 = seudonormal, grado 2; Nagueh 2025 p. 554, PCP >15 p. 550). Ilustrativo
    gravedad: { fin: 'el grado 2 (seudonormal)', defecto: HVI_DEFECTO, texto: (g) => { const r = hviRecorrido(g), v = Math.round(r.vSangre / 10) * 10; return `rigidez ×${coma(r.b, 1)}, volumen ${v < 0 ? 'bajo la volemia normal ' + Math.abs(v) : v > 0 ? 'retenido ' + v : 'normal'}${v === 0 ? '' : ' mL'}`; } },
    aplicar: (m, g = HVI_DEFECTO) => { const r = hviRecorrido(g);
      m.p.mioVi = 1.6; m.p.ai.ees *= 1.3; m.p.vi.b *= r.b; m.p.rSis *= 1.25; m.p.relajacion = r.relajacion; m.s.vven += r.vSangre; },
  },
  dilatada: {
    nombre: 'Miocardiopatía dilatada', forma: true,
    // contractilidad baja, ventrículo que se dilata y retención de líquidos (Ficha 3: el círculo vicioso de la
    // retención); algo más de masa con la pared normal (hipertrofia excéntrica, Ficha 3)
    // P5a · IM funcional (secundaria): ni los velos ni las cuerdas están enfermos; el VI dilatado desplaza los papilares y
    // tira de ambos velos hacia el ápex, y el anillo dilatado deja más área que cubrir (Zoghbi 2017, pp. 320-321). El orificio
    // regurgitante crece con la dilatación del VI por encima de la normal (v0 de reposo, ilustrativo) y se topa en 0,35 cm²
    // (Zoghbi Tabla 8, p. 332: moderada 0,20-0,39); la AI recibe el reflujo y se remodela (más volumen sin tensión, más
    // distensible) hasta una AI «generalmente grave» (Tabla 6, p. 320). Parámetros ilustrativos.
    aplicar: (m) => { const dil = (DILATADA_V0 - BASE.vi.v0) / 50;   // 1 = la dilatación de siempre (+50 mL de volumen sin tensión)
      m.p.relajacion = RELAJACION_FER; m.p.vi.b *= RIGIDEZ_DIL; m.p.mioVi = 1.4; m.p.vi.ees = 1.0; m.p.vi.v0 = DILATADA_V0; m.s.vven += 700;
      m.p.eroaMitral = Math.min(EROA_IM_TOPE, EROA_IM_POR_DIL * dil); m.p.ai.v0 = BASE.ai.v0 + AI_V0_POR_DIL * dil; },
  },
  tep: {
    // Nombre como el libro: con disfunción del VD y sin inestabilidad (PAM ~67) es la EP de riesgo intermedio
    // («submasiva»); «masiva» es la de alto riesgo, con inestabilidad hemodinámica (Marino, cap. 22, p. 7,
    // docs/marino-2024-respiratory-management-caps22-26.pdf#page=7). Antes se llamaba «TEP masivo». La gravedad a fondo
    // sí la tiene (PAM <70, desde P5a): la de alto riesgo. (Con la RVS calibrada, el de siempre da una PAM de ~67)
    nombre: 'TEP de riesgo intermedio (VD)', forma: true,
    // el émbolo sube la resistencia pulmonar (poscarga del VD) y el VD falla: se dilata, se vacía mal y empuja el
    // tabique hacia el VI (Fisiopatología UCI · Cardiología, Fichas 8 y 9; Merino, IC derecha)
    // gravedad: resistencia pulmonar ×9,0^u con u = g^0,6 (escala logarítmica) y contractilidad del VD que cae a la par; el defecto
    // (g 0,7, P5a) es el submasivo: ×5,9 y ×0,70
    gravedad: { fin: 'el TEP de alto riesgo a fondo (masivo: hipotensión, PAM <70 mmHg; Marino cap. 22, PDF p. 7, y cap. 14, PDF p. 2)', defecto: TEP_DEFECTO,
      texto: (g) => `resistencia pulmonar ×${coma(TEP_RPUL_MAX ** tepU(g), 1)}. ` + (g < TEP_G_MASIVO
        ? 'Riesgo intermedio (submasivo): disfunción del VD sin inestabilidad hemodinámica (Marino cap. 22, PDF p. 7)'
        : 'Riesgo alto (masivo): disfunción del VD con inestabilidad hemodinámica, PAM <70 mmHg (Marino cap. 22, PDF p. 7; cap. 14, PDF p. 2)') },
    aplicar: (m, g = TEP_DEFECTO) => { const u = tepU(g); m.p.rPul = escalarRPul(m.p, TEP_RPUL_MAX ** u); m.p.cAp /= (TEP_RPUL_MAX ** u) ** TEP_CAP_EXP; m.p.durVd *= 1 - TEP_DUR_VD * u; m.p.vd.ees *= 1 - TEP_EES_VD_PENDIENTE * u; sueloG(m, SUELO_TEP, g); },
  },
  hpcronica: {
    // Hipertensión pulmonar crónica (cor pulmonale crónico): se distingue del TEP agudo por la pared libre del VD GRUESA
    // en telediástole (>5 mm; Mukherjee 2025 Tabla 1, p. 145; Lang 2015 Tabla 8, p. 20: normal 1-5 mm) y por unas presiones
    // pulmonares altas que ese VD hipertrófico sí sostiene (el TEP agudo, con VD de pared fina, no pasa de ~40/33)
    nombre: 'Hipertensión pulmonar crónica (VD)', forma: true,
    // gravedad: el punto de la enfermedad (0 = normal; el defecto, un VD hipertrófico y algo dilatado: pared gruesa, tabique
    // aplanado, TAPSE algo bajo; hacia 1 el VD se dilata y falla)
    gravedad: { fin: 'el VD que claudica', defecto: HPC_DEFECTO, texto: (g) => `resistencia pulmonar ×${coma(hpcRecorrido(g).k, 1)}, pared del VD ×${coma(hpcRecorrido(g).mioVd, 1)}` },
    aplicar: (m, g = HPC_DEFECTO) => { const r = hpcRecorrido(g);
      m.p.rPul = escalarRPul(m.p, r.k); m.p.cAp /= r.k ** 0.5; m.p.durVd *= r.durVd; m.p.mioVd = r.mioVd; m.s.vven += r.vSangre;
      m.p.vd.ees *= r.ees; m.p.vd.b *= r.b; m.p.vd.v0 += r.v0; m.p.tabique = r.tab; },
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
const MUKHERJEE_PDF = (p, texto) => ({ href: `docs/mukherjee-2025-corazon-derecho-hp-ase.pdf#page=${p}`, texto });
const LANG_PDF = (p, texto) => ({ href: `docs/lang-2015-cuantificacion-camaras-ase.pdf#page=${p}`, texto });
const ZOGHBI_PDF = (p, texto) => ({ href: `docs/zoghbi-2017-insuficiencias-valvulares-ase.pdf#page=${p}`, texto });
const ATLAS_PRESION = { atlas: 'pressure', ficha: 'Atlas 8 · Hemodinámica por Doppler' };
const ATLAS_DIASTOLE = { atlas: 'fill', ficha: 'Atlas 10 · Función diastólica' };
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
    { texto: 'Volumen máximo de la AI >34 mL/m² (normal ≤34)', valor: (c) => Math.round(c.md.volAI) + ' mL/m²', cumple: (c) => c.md.volAI > 34,
      fuente: ATLAS_DIASTOLE, pdf: LANG_PDF(25, 'Lang p. 25 y 28'),
      nota: 'Lang 2015: el límite superior normal del volumen de la AI indexado es 34 mL/m² (antes 28), medido en telesístole por discos (pp. 25, 28). Se divide por la superficie corporal del paciente simulado (1,85 m² si no hay otra). Normal del modelo: ~27 mL/m²' },
    { texto: 'IM funcional: orificio regurgitante (EROA) ≥0,20 cm² (al menos moderada)', valor: (c) => `${c.md.eroa.toFixed(2).replace('.', ',')} cm² · ${Math.round(c.md.volReg)} mL por latido`,
      cumple: (c) => c.md.eroa >= 0.2, fuente: ATLAS_PRESION, pdf: ZOGHBI_PDF(30, 'Zoghbi p. 332'),
      nota: 'Zoghbi 2017, Tabla 8 (p. 332): EROA leve <0,20, moderada 0,20-0,39 y grave ≥0,40 cm²; volumen regurgitante moderado 30-59 mL, grave ≥60 mL. En la secundaria un corte de 0,30 cm² puede ser ya grave por PISA 2D (p. 334). Zoghbi también cita que ≥0,2 cm² empeora el pronóstico, pero NO redefine con él la IM grave secundaria (p. 334): el criterio de arriba es solo «al menos moderada». Origen del modelo: velos sanos; el anillo dilatado y la tracción de los papilares (tenting, ilustrativo: Zoghbi no da cifras, p. 321) abren el orificio' },
  ],
  tep: [
    { texto: 'Área del VD / área del VI >0,6 (cor pulmonale agudo)', valor: (c) => c.md.areaVdVi.toFixed(2).replace('.', ',') + ` (normal ${c.md0.areaVdVi.toFixed(2).replace('.', ',')})`,
      cumple: (c) => c.md.areaVdVi > 0.6, fuente: F11_COR,
      nota: 'medida en el plano apical de 4 cámaras del modelo. Ojo: Merino da como normal un VD de ~2/3 del tamaño del VI (sin decir si es área o diámetro), que con esta cifra ya sería cor pulmonale; las dos fuentes de la app no casan' },
    { texto: 'VD en diástole >3,0 cm (normal 0,6-3,0 cm)', valor: (c) => mm(c.md.vdDiam), cumple: (c) => c.md.vdDiam > 30, fuente: FATE,
      nota: 'Medida de FATE (Manual UMI): el diámetro del VD en diástole, con su corte de 3,0 cm. No es el «VD basal» de Lang (más abajo): ese es el diámetro basal del VD en el A4C enfocado al VD, con su propio corte (>41 mm). Dos medidas y dos fuentes, por eso las cifras no coinciden' },
    { texto: 'El VI se hace más pequeño (el tabique lo empuja)', valor: (c) => `${mm(c.md.lvdd)} (normal ${mm(c.md0.lvdd)})`, cumple: (c) => c.md.lvdd < c.md0.lvdd - 5, fuente: MERINO_SEPTO },
    { texto: 'Tabique aplanado en diástole (fases F-A)', valor: (c) => c.md.septo >= 0.5 ? 'sí' : 'no', cumple: (c) => c.md.septo >= 0.5, fuente: MERINO_FIG,
      nota: 'Es el aplanamiento que calcula el modelo en telediástole (septo ≥ 0,5); en el eje corto de papilares se ve el VI en D en el llenado (fase F, hasta la A); en la contracción isovolumétrica (B) el VI ya supera al VD y el tabique vuelve a curvarse' },
    { texto: 'TAPSE <17 mm', valor: (c) => mm(c.tapse), cumple: (c) => c.tapse < 17, fuente: F11_VD },
    { texto: 'Sube el volumen telediastólico del VD', valor: (c) => `${Math.round(c.u.edvD)} mL (normal ${Math.round(c.u0.edvD)})`, cumple: (c) => c.u.edvD > c.u0.edvD, fuente: MERINO_VD },
    // Criterios de Lang 2015 (PDF en docs/), medidos en el plano apical de 4 cámaras del modelo (ecografia.mjs, medirVd).
    // c.vd = { td, ts } (medirVd en telediástole y telesístole); sin él, no se pueden medir y no se cumplen
    { texto: 'VD basal >41 mm (normal 25-41)', valor: (c) => c.vd ? `${Math.round(c.vd.td.basal)} mm` : 'sin medir', cumple: (c) => !!c.vd && c.vd.td.basal > 41,
      fuente: { atlas: 'vd', ficha: 'Atlas 14 · El VD' }, pdf: LANG_PDF(17, 'Lang p. 17'), nota: 'Lang 2015: «dilatado >41 mm» está en el texto (p. 17); el rango normal 25-41 (33 ± 4) es de la Tabla 8 (p. 20)' },
    { texto: 'Relación de diámetros basales VD/VI >1,0 (unión de dos fuentes)', valor: (c) => c.vd ? `${coma(c.vd.td.basal / c.vd.td.basalVi, 2)} ${c.vd0 ? ` (normal ${coma(c.vd0.td.basal / c.vd0.td.basalVi, 2)})` : ''}` : 'sin medir',
      cumple: (c) => !!c.vd && c.vd.td.basal / c.vd.td.basalVi > 1, fuente: F11_VD, nota: 'Dos fuentes, dos umbrales: la Ficha 11 dice que la relación VD/VI es normal por debajo de 1 en la ventana apical (sin decir qué diámetros), y el Atlas 14 (guía ESC) pide un cociente de diámetros basales de 1,0 o más. Aquí se usa el cociente de diámetros basales >1,0' },
    { texto: 'FAC del VD <35 % (normal 49 ± 7)', valor: (c) => c.vd ? `${Math.round((c.vd.td.area - c.vd.ts.area) / c.vd.td.area * 100)} %` : 'sin medir',
      cumple: (c) => !!c.vd && (c.vd.td.area - c.vd.ts.area) / c.vd.td.area * 100 < 35, fuente: F11_VD, pdf: LANG_PDF(23, 'Lang p. 23'),
      nota: 'FAC = (área telediastólica − telesistólica) ÷ telediastólica del VD en el A4C' },
    { texto: 'FE del VD (3D) <45 % aprox. (normal 58 ± 6,5)', valor: (c) => `${Math.round(c.u.feD * 100)} %`, cumple: (c) => c.u.feD * 100 < 45, fuente: MERINO_VD, pdf: LANG_PDF(23, 'Lang p. 23'), nota: 'Lang da el 45 % como valor aproximado; aquí se compara con la FE del VD del motor (no una medida 3D de la imagen)' },
  ],
  // HP crónica: lo que la distingue del TEP agudo es la pared libre del VD gruesa. Cifras de Mukherjee 2025 (Tabla 1, p. 145 impresa = PDF 5)
  // y Lang 2015 (Tabla 8, p. 20). El índice de excentricidad no entra aquí (lo mide la prueba con el plano del Atlas · 14)
  hpcronica: [
    { texto: 'Pared libre del VD en telediástole >5 mm (normal <5 mm; Lang: 1-5)', valor: (c) => mm(c.md.paredVd), cumple: (c) => c.md.paredVd > 5,
      fuente: { atlas: 'vd', ficha: 'Atlas 14 · El VD' }, pdf: MUKHERJEE_PDF(5, 'Mukherjee p. 145'),
      nota: 'Mukherjee 2025, Tabla 1: leve 5-7 mm, moderada >7-9 mm y grave >9 mm; la mide en la subcostal, en telediástole, sin trabéculas ni papilares. Lang 2015, Tabla 8 (p. 20): normal 1-5 mm. En el TEP agudo la pared sigue fina (≤5 mm; fisiología general: no da tiempo a hipertrofiarse)' },
    { texto: 'Presión sistólica pulmonar (PAPs) >34 mmHg (normal ≤34)', valor: (c) => Math.round(c.u.paps) + ' mmHg', cumple: (c) => c.u.paps > 34,
      fuente: { atlas: 'vd', ficha: 'Atlas 14 · El VD' }, pdf: MUKHERJEE_PDF(5, 'Mukherjee p. 145'),
      nota: 'Es la presión del motor en la pulmonar. El VD hipertrófico la sostiene alta; el de pared fina del TEP agudo no pasa de ~40 mmHg (fisiología general)' },
    { texto: 'Área del VD / área del VI >0,6 (VD agrandado)', valor: (c) => c.md.areaVdVi.toFixed(2).replace('.', ',') + ` (normal ${c.md0.areaVdVi.toFixed(2).replace('.', ',')})`,
      cumple: (c) => c.md.areaVdVi > 0.6, fuente: F11_COR, nota: 'plano apical de 4 cámaras del modelo; el corte de 0,6 es el de la Ficha 11 para el cor pulmonale' },
    { texto: 'TAPSE >10 mm: el VD aún no ha fallado del todo (normal >17 mm)', valor: (c) => mm(c.tapse), cumple: (c) => c.tapse > 10, fuente: F11_VD, pdf: MUKHERJEE_PDF(5, 'Mukherjee p. 145'),
      nota: 'Mukherjee 2025: TAPSE normal >1,7 cm; leve ≤1,7-1,3; moderado ≤1,3-1,0; grave ≤1,0 cm. Mukherjee (PDF p. 31): en la HP la función basal suele estar conservada y el TAPSE cae ya en las fases tempranas del remodelado; hacia el fallo cae más' },
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
// vd, vd0: { td, ts } de medirVd (ecografia.mjs) en la forma y en el normal; opcionales (sin ellos, los criterios de Lang del A4C salen «sin medir»)
export function evaluarForma(clave, u, md, u0, md0, vd, vd0) {
  const c = { u, md, u0, md0, vd, vd0, tapse: tapseDeLatido(u) };
  return (CRITERIOS_FORMA[clave] || []).map(k => ({ ...k, ok: k.cumple(c), v: k.valor(c) }));
}
