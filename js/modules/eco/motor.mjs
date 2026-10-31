// Motor de la circulación viva — modelo de compartimentos EN EL TIEMPO (paso 1).
// Puro: sin DOM. Se usa igual en node (pruebas) y en el navegador (escena).
//
// Lo que simula (fisiología general / ilustrativo — las cifras de las fichas
// se cotejan en los medidores, no aquí):
//   · 4 cámaras (AD, VD, AI, VI) con elastancia variable en el tiempo:
//       P = e(t)·Ees·(V−V0) + (1−e(t))·A·(exp(B·(V−V0))−1) + P_pericardio (+ tabique)
//   · 4 válvulas que abren y cierran por GRADIENTE de presión (nunca por reloj)
//   · pericardio con curva exponencial propia (el taponamiento sale de aquí)
//   · tabique compartido: interdependencia ventricular (coeficiente cruzado)
//   · aorta/arterias (elásticas), venas como reservorio con volumen sin tensión,
//     arteria pulmonar y venas pulmonares
//   · perfusión coronaria = PA diastólica − PTDVI (derivada por latido)
//   · válvula aórtica con INERCIA e impedancia característica de la aorta (windkessel de 3 elementos):
//     al final de la eyección la sangre frena y da un breve reflujo que cierra la válvula; ese reflujo
//     baja la presión de la raíz (incisura) y al cerrarse vuelve a subir (onda dícrota)
//   · BARORREFLEJO: la PAM filtrada se compara con su punto de consigna; el error mueve, cada uno con su
//     retraso, la FC (vagal, rápido), las resistencias, el volumen venoso sin tensión (venoconstricción)
//     y la contractilidad (simpático, lentos). Saturación con tanh. Todo ilustrativo.
//   · LÍQUIDOS que entran y salen de la sangre (para que la gravedad de un shock no rompa el motor): venas que no se
//     vacían de golpe (codo), relleno transcapilar, edema de pulmón y derrame que entra a su ritmo. Ver BASE
//   · (segunda vuelta del shock, 21/10/2026) RVS calibrada a la Tabla 8.1, arteria pulmonar que se endurece al subir su
//     presión, ISQUEMIA DEL VD cuando su presión se acerca a la de la aorta, derrame establecido (pericardio estirado) y un
//     punto de entrada para el SOPORTE mecánico (balón, Impella, ECMO). Ver BASE
// Integración de Euler explícito a 0,1 ms (estable con estas constantes de tiempo).

// Las 7 fases del ciclo de Wiggers (A-G), como en Fisiopatología UCI · Cardiología
export const FASES = {
  A: 'Contracción auricular', B: 'Contracción isovolumétrica', C: 'Eyección rápida', D: 'Eyección lenta',
  E: 'Relajación isovolumétrica', F: 'Llenado rápido', G: 'Diástasis',
};

/** Resistencia de las arterias pulmonares (rPul) de una enfermedad que multiplica por k la resistencia pulmonar de referencia (0,095
 * mmHg·s/mL: el valor único que había antes de separar las venas): rPul normal + 0,095·(k − 1). k = 1 es el normal. El TEP y la
 * hipertensión pulmonar quedan con la misma resistencia total (arterias + venas) que antes de separar las venas. */
export const escalarRPul = (p, k) => BASE.rPul + 0.095 * (k - 1);

export const BASE = {
  fc: 70,
  // cámaras: Ees sistólica (mmHg/mL), V0, A y B de la curva diastólica
  vi: { ees: 3.1,  v0: 10, a: 1.8, b: 0.017 },
  // VD: a 2,0 → 1,9 (calibración del 20/10/2026, con la AD, vuVen y rRetorno: su presión telediastólica tiene que bajar
  // con la PVC, porque el catéter las lee iguales, #mar-termodilucion). Ilustrativo
  vd: { ees: 0.50, v0: 25, a: 1.9, b: 0.012 },
  // AI: la contracción se SUMA a la pasiva (presionAurícula): Ees 0,70 → 0,37 y A 0,20 → 0,25 (eco-calibra-a, 28/10/2026). Bomba ≈ 25 %
  // del llenado del VI (Lang 2015, p. 24: 15-30 %) y la onda A sobrevive en la AI dilatada. Ilustrativo
  ai: { ees: 0.37, v0: 5,  a: 0.25, b: 0.090 },
  // AD: reservorio más distensible (a 0,15 → 0,13; b 0,090 → 0,080; calibración del 20/10/2026, ilustrativo). Con la
  // curva de antes, la AD se llenaba en la sístole ventricular hasta la presión de las venas y el retorno se paraba: la
  // meseta de ~6,5 mmHg de toda la sístole subía la PVC media a 5,02 (Tabla 8.1 de Marino: 0-5). Ahora, 4,19. Más baja
  // no cabe sin sacar la VD sistólica de 20-25 (Ficha 5) o pasar de 40 mmHg las venas pulmonares en la hipertrofia con
  // 1,5 L y EPP (pruebas/maniobras.test.mjs, paciente posible)
  ad: { ees: 0.70, v0: 8,  a: 0.13, b: 0.080 },   // v0 5 → 8: solo desplaza el volumen (la presión depende de V−V0); la AD nunca baja de los 15 mL del dibujo
  // tiempos de activación (s). Las sístoles escalan con √(periodo).
  pr: 0.16, tsAur: 0.10, tsVen: 0.45, fSubida: 0.62, qSubida: 0.55,
  // relajación del VI: multiplica la constante de tiempo de la cola exponencial de su activación (1 = normal; >1 =
  // relajación lenta, como en la disfunción diastólica). Ver activacionVi
  relajacion: 1,
  // pericardio: P = kPeri·exp((Vcorazón − v0Peri)/phiPeri); liquido = derrame extra
  // pTorax: presión positiva de la vía aérea (CPAP o PEEP, cmH₂O; ×0,74 = mmHg, fisiología general). Por defecto 0: cifras
  // idénticas a sin él. Lo que llega al espacio pleural es fPleura de ella, y esa presión pleural (s.pTorax, en mmHg) se SUMA
  // por fuera a las cámaras y a los vasos del tórax (pulmonares); la aorta y las venas sistémicas, fuera, no la notan (pero
  // ver kAbdomen). Así la poscarga del VI es la presión de la cámara menos la pleural (Marino cap. 26, Ec. 26.1, PDF p. 87)
  pTorax: 0,
  // fPleura: fracción de la presión de la vía aérea que llega al espacio pleural. En 19 pacientes con insuficiencia
  // respiratoria aguda, el 37 % con pulmones distensibles, el 32 % y el 24 % con los más rígidos (presión esofágica; Jardin
  // 1985, Chest 88:653, PMID 3902386); junto al corazón llega algo más que al esófago (O'Quin 1985, en perros; J Appl Physiol 59:1171,
  // PMID 3902775) y, en decúbito supino, el esófago la infravalora mucho (Marini 1982, en perros; J Appl Physiol 53:384, PMID 6749776).
  // Por eso 0,65, calibrado a la medida de fuera: 15 cmH₂O bajan el VS un 23 ± 22 % (Jellinek 2000, en pacientes anestesiados en apnea; ver kAbdomen); con 0,65
  // el motor da −24 % en el paciente normal (autonomo/bloques/b3/herramientas/g4-fpleura.mjs). Antes llegaba toda (1):
  // 10 cmH₂O en un paciente seco paraban el retorno (GC 0,05)
  fPleura: 0.65,
  // kAbdomen: fracción de la presión de la vía aérea que llega a las venas de fuera del tórax. Al inflarse el pulmón baja el
  // diafragma, sube la presión del abdomen y exprime su reservorio venoso: la presión media de llenado sube casi tanto como la
  // de la AD y el gradiente del retorno venoso se mantiene. En 10 pacientes anestesiados y en apnea, 15 cmH₂O (11,1 mmHg) subieron la
  // presión media de llenado de 10,2 a 12,7 mmHg (2,5/11,1 ≈ 0,23) y la AD de 7,3 a 10,0 (Jellinek 2000, J Appl Physiol
  // 88:926, PMID 10710387). Sin esto, con la AD dentro del tórax y las venas fuera, 10 cmH₂O vaciaban el pulmón hacia las
  // venas y, en el paciente seco, paraban el retorno (GC 0,05)
  kAbdomen: 0.23,
  kPeri: 0.1, v0Peri: 300, phiPeri: 40, liquidoPeri: 0,
  tabique: 0.05,            // fracción de la presión del otro ventrículo que se transmite
  // DESPLAZAMIENTO DEL TABIQUE (M0c, 29/10/2026): cuando la presión libre del VD supera a la del VI en diástole (VD que
  // falla o sobrecargado), el tabique se curva hacia el VI y le quita sitio: el VI se llena menos a la misma presión. Se
  // modela sumando a la presión del VI una fracción del gradiente VD − VI (solo si es positivo y con el VD relajado,
  // × (1 − eVd)). La fracción crece con la tensión del saco (pperi² / (pperi² + septoP50²), hasta septoDesplaza): con el
  // pericardio flojo el VD dilatado crece hacia fuera; con el saco tenso, solo puede crecer a costa del VI. El gradiente que
  // cuenta se topa en septoTope mmHg (el tabique ya plano no se curva más; sin tope, a +3 L el VI caía a 30 mL con PCP 45).
  // Un corazón normal (VI siempre por encima del VD) no lo nota, ni el TEP ni la HP crónica (saco flojo, pperi ≈0,1).
  // Dirección: Marino, cap. 16, p. 40 (fallo del VD: sube la PVC, el VD empuja el tabique y el VI se llena menos;
  // docs/marino-2024-shock-caps14-17.pdf#page=40). Cuánto (1; 0,6 mmHg; 8 mmHg): ilustrativo
  septoDesplaza: 1, septoP50: 0.6, septoTope: 8,
  // válvulas (mmHg·s/mL)
  rMitral: 0.005, rTricus: 0.005, rAortica: 0.004, rPulmonar: 0.004,
  // inercia de la sangre que cruza la mitral (mmHg·s²/mL; 0 = sin inercia). Sin ella, el flujo seguía al gradiente al
  // instante y la onda E se cortaba en ~115 ms (TDE corto); con ella la E decelera como en el corazón real (Thomas y
  // Weyman: el TDE depende de la inercia y de la rigidez del VI). Valor ilustrativo, calibrado a E/A 1-1,5 y TDE 140-250
  lMit: 0.0005,
  // insuficiencia mitral: orificio regurgitante efectivo (cm²). 0 = válvula competente. El chorro sigue la
  // ecuación del orificio con Bernoulli simplificado: v (m/s) = √(ΔP/4) → Q (mL/s) = EROA · 50 · √ΔP
  eroaMitral: 0,
  // comunicación interventricular (rotura del septo): área del orificio VI → VD (cm²), con la misma fórmula que eroaMitral
  // (Q = A·50·ΔP/√(ΔP+0,25); fisiología general). 0 = septo íntegro. Cap. 16 de Marino, p. 38, solo da la dirección
  civ: 0,
  // estenosis aórtica: área efectiva del orificio (cm²; 0 = válvula normal, sin término de Bernoulli) y diámetro de
  // la aorta ascendente (cm), del que depende la recuperación de presión. En la vena contracta cae 4v² (v = Q ÷ área);
  // pasado el orificio, el chorro frena y recupera 4v² · 2r(1 − r), con r = área ÷ área de la aorta (Baumgartner 2017)
  areaAortica: 0, dAorta: 3.0,
  // lecho sistémico (cAo/vuAo: aorta y grandes arterias, distal a la raíz)
  // (calibración del 20/10/2026, con la AD y el VD: vuVen 2210 → 2300 y rRetorno 0,02 → 0,025, para que la Pms siga
  // en ~7, el gradiente Pms − PVC del normal pase de ~2,5 a ~2,9 mmHg y el resto de cifras del normal no cambie. Ilustrativo)
  // (calibración de la RVS, 21/10/2026: rSis 1,05 → 0,90, con la consigna del barorreflejo 100 → 87. La RVS del normal era
  // 1.488 (IRVS 34 unidades Wood); ahora ~1.285 (IRVS ~29,7): dentro de la Tabla 8.1 de Marino, 25-30 (#mar-tabla-8-1,
  // docs/marino-2024-practicas-monitorizacion-caps5-9.pdf, p. 61), y la Tabla 16.2 pide lo mismo en el cardiogénico. Los
  // 900-1.200 de la Ficha 5 no caben: con el VS que deja el ITV del TSVI en 18-22 cm (Ficha 11), el GC es ~5,1 y bajar de
  // 1.200 deja la PAM por debajo de ~81, con la sistólica <105 o la diastólica <65. PA del normal: ~106/67, PAM ~87)
  cAo: 1.5, vuAo: 700, rSis: 0.90, cVen: 160, vuVen: 2300, rRetorno: 0.025,
  // CODO DE LAS VENAS (mmHg). El volumen sin tensión no es un umbral: al vaciarse, las venas se colapsan poco a poco y su
  // retroceso elástico sigue empujando. Por encima del codo, P = (V − Vu)/C (la recta de siempre); por debajo, la presión
  // cae en exponencial, con la misma pendiente en el codo (sin salto), y nunca llega a 0: parte del volumen «sin tensión»
  // se recluta al vaciarse. Antes era max(0, …): con una hemorragia mayor que el volumen con tensión más lo que recluta el
  // barorreflejo, la presión venosa era 0 exacto y el retorno se paraba de golpe (2 L → PAM 11). La forma curva cerca de
  // 0 es fisiología general (la recta solo extrapola el volumen sin tensión); el codo, ilustrativo. No toca el normal
  // (venas a ~6,4 mmHg) y apenas la hemorragia de 1 L (~3,4 → 3,6 mmHg)
  codoVen: 5,
  // RELLENO TRANSCAPILAR: «la caída de la presión mueve líquido intersticial a la sangre; puede añadir hasta un litro al
  // plasma» (Marino, cap. 15, p. 21, docs/marino-2024-shock-caps14-17.pdf#page=21). Lo mueve la caída de la presión capilar
  // (fisiología general, Starling): pCap = pven + (P arterial − pven) · rPost / rSis efectiva, con la resistencia
  // poscapilar fija (fCap de la basal), así que la vasoconstricción precapilar y la PA baja la bajan. El volumen que entra
  // tiende a rellenoMax · tanh(cInt · caída / rellenoMax) (tope de la fuente) con la constante de tiempo tauRelleno.
  // pCap0: presión capilar funcional normal, ~17 mmHg (fisiología general); la media del latido normal queda algo por debajo
  // (en reposo entran ~2 mL en 40 s). fCap 0,12 → 0,14 con la RVS calibrada (PAM 100 → 87), para que en reposo la presión
  // capilar siga siendo la de antes. cInt y tauRelleno son ilustrativos: la fuente da el tope, no el ritmo; que el Hto tarde 8-12 h en bajar
  // (p. 23) dice que es lento, así que en los segundos que se ven en pantalla apenas cuenta
  rellenoMax: 1000, cInt: 100, tauRelleno: 1200, fCap: 0.14, pCap0: 17,
  // DERRAME: ritmo al que entra el líquido en el saco (mL/s, ilustrativo). Antes entraba entero en un instante y, con la
  // curva exponencial del pericardio, 550 mL daban ~10⁵ mmHg en el primer paso: volúmenes negativos y NaN. p.liquidoPeri
  // es el derrame pedido; s.liquidoPeri, el que ya hay (el que aprieta y el que se dibuja). Y el líquido solo entra mientras
  // la presión del saco está por debajo de la que lo empuja (pFuenteDerrame, la capilar, ~25 mmHg, ilustrativo; frena en
  // los últimos 5 mmHg): sin eso, 600 mL agudos cabían en el saco a ~180 mmHg con las cámaras a volumen negativo
  ritmoDerrame: 40, pFuenteDerrame: 25,
  // DERRAME ESTABLECIDO: el pericardio se estira si el derrame se acumula despacio; uno rápido de 150-200 mL puede taponar y
  // uno lento de más de un litro, no (fisiología general). El motor no simula los días que tarda en estirarse: un motor que
  // NACE con derrame (crearMotor({ liquidoPeri })) es un paciente que ya lo tenía, con el saco estirado (s.estiraPeri, mL que
  // se suman a v0Peri) lo que pasa de derrameTolerado: aprieta como un derrame agudo de derrameTolerado mL, un taponamiento
  // con la PA aún sostenida (ilustrativo). p.estiraPeri lo fija a mano. Al nacer, entra en el saco lo que cabe sin apretar
  // más de pPeriInicio mmHg con las cámaras de un latido normal; el resto, a su ritmo (ritmoDerrame), mientras el corazón se
  // encoge. Antes, el motor que nacía con 550 mL los metía de golpe en un saco sin estirar: ~10⁵ mmHg en el primer paso y
  // NaN; y si entraban a su ritmo sobre un corazón normal (un derrame AGUDO de 550 mL), el saco llegaba a 25 mmHg y la PAM a
  // 22, que es lo que hace un hemopericardio agudo, no un derrame grande. El derrame que se añade con el motor en marcha
  // (p.liquidoPeri: el mando de gravedad) es agudo, como antes
  estiraPeri: null, derrameTolerado: 340, pPeriInicio: 5,
  // HEMORRAGIA: p.hemorragia es la sangre perdida pedida (mL) y s.perdido la que ya se ha ido, a ritmoHemorragia mL/s
  // (ilustrativo). Perder el 42 % de la volemia en un instante no le pasa a nadie: la PAM caía a 28 en los primeros
  // segundos, antes de que el barorreflejo respondiera. Si el mando baja, la sangre vuelve (una transfusión)
  hemorragia: 0, ritmoHemorragia: 80,
  // CONTRACTILIDAD: la Ees de cada ventrículo sigue a la pedida (p.vi.ees, p.vd.ees) con esta constante de tiempo (s). Un
  // miocardio que deja de recibir sangre pierde la contracción en segundos, no en un instante (fisiología general; el
  // número, ilustrativo). Antes, bajar la Ees del VI de 3,1 a 0,3 de golpe dejaba dos latidos sin eyección (GC 0,
  // RVS infinita, SvO₂ NaN) y la PAM caía a 36 antes de que el barorreflejo respondiera
  tauContractilidad: 4,
  // EDEMA DE PULMÓN: por encima de pEdema mmHg en las venas pulmonares (≈ capilar pulmonar) sale líquido de los vasos al
  // pulmón, kEdema mL/s por cada mmHg de más, y no vuelve (en minutos-horas, fuera de lo que se simula). Sin esta salida, al
  // fallar el VI la sangre se acumulaba en el pulmón sin límite: con Ees 0,45 la PCP llegaba a 41 mmHg con la PAM en 81,
  // y no había shock cardiogénico posible con una PCP humana. Que el edema empiece cuando la presión capilar supera a la
  // oncótica del plasma es fisiología general: «la presión oncótica del plasma es normalmente de unos 28 mmHg» y, en el
  // paciente crítico, 20-25, por eso la PCP óptima es 18-20 (Marino, cap. 16, p. 42, docs/marino-2024-shock-caps14-17.pdf).
  // RITMO (segunda vuelta, 21/10/2026): kEdema 5 → 0,1. Con 5 mL/s por mmHg el pulmón se llevaba ~500 mL en 40 s y ~1,2 L
  // en 2 min: la PCP no pasaba de 31, pero a costa de vaciar la sangre, y en el fallo del VI a fondo la PVC caía a 2,8
  // (por debajo de la normal, contra la Tabla 14.1). Un edema de pulmón tarda minutos-horas en llenar el pulmón; con 0,1, a
  // 6 mmHg de más salen ~0,6 mL/s (~35 mL/min, ~2 L/h). Lo que ahora frena la PCP en el fallo del VI es el VD (ver isqDesde).
  // El ritmo, ilustrativo
  kEdema: 0.1, pEdema: 28,
  // aorta proximal: impedancia característica (mmHg·s/mL), inercia del tracto de salida (mmHg·s²/mL)
  // y volumen de reflujo que cierra la válvula (mL)
  zAo: 0.03, lAo: 0.00025, vCierreAo: 1.5,
  // efecto de la eyección (s/mL): resistencia interna del VI proporcional a su presión (Shroff), fisiología general.
  // Con 0 el flujo aórtico pica a los ~40 ms con ~850 mL/s; con 0,001, a ~90 ms con ~400 mL/s (tiempo de
  // aceleración y cociente pico/media ~1,6 de un tracto de salida normal). Valor ilustrativo, calibrado a eso
  kEyec: 0.001,
  // tracto de salida del VD: el mismo efecto de la eyección (kEyecVd) e inercia de la sangre que cruza la pulmonar
  // (lPul, mmHg·s²/mL). Sin ellos, el flujo pulmonar picaba a los ~20 ms con ~660 mL/s; con ellos, a ~140 ms con
  // ~320 mL/s, en una eyección de ~340 ms (tiempo de aceleración normal del TSVD >105 ms: Mukherjee 2025, en Atlas · 14).
  // Con ellos el VD pierde algo de presión, así que su Ees sube de 0,40 a 0,50 para seguir en 20-25 mmHg (Ficha 5).
  // Valores ilustrativos, calibrados a eso
  kEyecVd: 0.002, lPul: 0.002,
  // duración de la sístole del VD respecto a la del VI (1 = igual). En la sobrecarga de presión crónica el VD se
  // contrae más tiempo que el VI (asincronía interventricular; fisiología general): su presión sigue alta cuando el VI
  // ya se relaja y el tabique se aplana al final de la sístole. Ver Atlas · 14
  durVd: 1,
  // insuficiencia tricuspídea: orificio regurgitante efectivo (cm²), igual que eroaMitral. 0 = competente
  eroaTricus: 0,
  // ISQUEMIA DEL VD: el VD se perfunde en sístole y en diástole porque su presión es baja; cuando su presión sistólica se acerca
  // a la de la aorta, la sangre deja de entrarle en la sístole y el VD se queda sin O₂ justo cuando más trabaja. Su
  // contractilidad cae una fracción cuando la carga del VD, PVD sistólica ÷ PAM (÷ mioVd), pasa de isqDesde: en forma de S
  // hasta isqVdMax cuando llega a isqDesde + isqAncho (0,9: la presión del VD casi igual a la media de la aorta), con la
  // constante de tiempo tauIsqVd (s). En el normal, 0,23; en el TEP de siempre, ~0,6; en el fallo del VI a fondo, ~0,7. El VD que falla se dilata, sube la PVC y deja de empujar sangre al
  // pulmón. Es la consecuencia de la hipertensión pulmonar que da el libro («el fallo derecho suele ser consecuencia de la
  // hipertensión pulmonar, p. ej. por émbolos, o de un infarto inferior»: Marino, cap. 18, p. 3,
  // docs/marino-2024-cardiac-disorders-caps18-21.pdf#page=3); el mecanismo (perfusión del VD) es fisiología general y los
  // números, ilustrativos. La presión se divide por el grosor de la pared (mioVd, la hipertrofia crónica del Atlas · 14):
  // a igual presión, una pared gruesa trabaja con menos tensión (Laplace). Sin esto, en el fallo del VI a fondo el VD seguía
  // empujando contra una pulmonar de 50 mmHg, la sangre se iba al pulmón (PCP 45, o PVC por debajo de la normal si el edema la
  // sacaba) y en el TEP el VD sostenía una media pulmonar de 54 (un VD sin hipertrofia no la mantiene)
  isqDesde: 0.4, isqAncho: 0.5, isqVdMax: 0.8, tauIsqVd: 6,
  // barorreflejo: consigna de PAM, constantes de tiempo (s) y ganancias máximas (fracción; + al bajar la PAM)
  barorreflejo: true, pamConsigna: 87, tauSensor: 2.0,
  // (gravedad del shock, octubre 2026; la pendiente cerca de la consigna, 1/0,35, no cambia, así que las compensaciones
  // pequeñas son las de antes. Lo que cambia es el techo:)
  //  · resistencias: techo +60 % → +15 %. Lo que cuenta es la cifra absoluta: la RVS basal del modelo era 1.488 y +60 % la
  //    llevaba a ~2.300. Con PAM − PVC = IC · SC · RVS / 80, un shock a fondo con PAM 55-60 tenía entonces un IC ~1,0 (y el
  //    taponamiento, con la PVC ~12, menos): ningún escenario llegaba a shock con un gasto humano (IC ≥1,2). Con +15 %,
  //    techo ~1.700 dyn·s·cm⁻⁵.
  //  · Con la RVS calibrada (21/10/2026; basal ~1.285), +15 % → +35 %: el mismo techo absoluto, ~1.690 (IRVS ~39 en el
  //    shock a fondo; la Tabla 14.1 pide RVS alta en tres de los cuatro shocks).
  //  Ilustrativo, como todo el barorreflejo
  baro: { fc: { tau: 1.5, sube: 0.9, baja: 0.35 }, r: { tau: 6, sube: 0.35, baja: 0.35 },
    vu: { tau: 10, sube: 0.25, baja: 0.08 }, ees: { tau: 6, sube: 0.45, baja: 0.25 } },
  // lecho pulmonar
  // (codoPul: el mismo codo de las venas sistémicas en la arteria y las venas pulmonares, que en la hemorragia grave también
  // se vacían por debajo de su volumen sin tensión; ilustrativo)
  // (rPul 0,08 → 0,095 con la RVS calibrada: la sistólica del VD siente una fracción de la del VI (tabique) y, con la PAS de
  // 119 → 106, bajaba de 20 (Ficha 5: 20-25). Con 0,095 la RVP del normal es ~1,75 unidades Wood (IRVP ~3,2): dentro de la
  // Ficha 10, 250-340 dyn·s·m²/cm⁵ (3,1-4,3), y por encima de la Tabla 8.1, 1-2 (las fuentes discrepan; ya con 0,08 era ~2,6,
  // fuera de la Tabla 8.1). Ilustrativo)
  cAp: 4.0, vuAp: 100, rPul: 0.08, cVp: 8.0, vuVp: 200, rVp: 0.02, codoPul: 3,
  // RESISTENCIA PULMONAR TOTAL = rPul + rVp (0,100; antes 0,095 + 0,01 = 0,105; la PAP diastólica sube con la AI más rígida). rVp (venas) frena el reflujo de la contracción
  // auricular hacia las venas (Ar de ~590 → ~200 mL/s). Una enfermedad que sube la resistencia pulmonar la multiplica entera: ver escalarRPul.
  // RIGIDEZ DE LA ARTERIA PULMONAR (mmHg): por encima de rigAp la arteria se distiende cada vez menos (exponencial con la
  // misma pendiente en el punto: sin salto). La distensibilidad a la presión P es cAp · kRigAp / (P − rigAp + kRigAp): ~4 mL/mmHg
  // en el normal (la sistólica, 22, no llega a rigAp), ~1,5 a 40 mmHg. Que la arteria pulmonar se haga más rígida al subir su
  // presión (y que el producto resistencia × distensibilidad cambie poco) es fisiología general; los números, ilustrativos.
  // Sin ella, con un VS de ~20 mL la presión de pulso pulmonar era SV ÷ cAp ≈ 5 mmHg: el TEP a fondo daba 55/53 y el fallo
  // del VI 39/35, presiones que no se ven en un paciente (en el TEP y en el edema cardiogénico la pulmonar late 10-25 mmHg)
  rigAp: 24, kRigAp: 10,
  // SOPORTE MECÁNICO (punto de entrada; null = sin soporte). p.soporte = { impella, ecmo, venteo (L/min), balon (mL) }, que
  // se puede cambiar con el motor en marcha. Qué mueve cada uno (Marino, cap. 16, docs/marino-2024-shock-caps14-17.pdf):
  //   · balon: volumen de helio que desplaza en la aorta (35-40 mL, p. 45). Se hincha al cerrarse la aórtica y se vacía al
  //     empezar la sístole (la onda R; en el motor, tLatido = pr), p. 45-46: el pico diastólico y la caída de la presión al
  //     abrirse la aórtica salen solos. Entra como volumen que se suma al de la aorta (paoDist). Hincha y vacía con las
  //     constantes de tiempo tauBalon (s; la fuente dice «rápido», el número es ilustrativo)
  //   · impella: flujo continuo del VI a la aorta (2,5-5,5 L/min según el catéter, p. 47)
  //   · ecmo: de las venas a la aorta (VA, hasta 5-6 L/min, p. 48); venteo: la parte que se saca del VI en vez de las venas
  //     (p. 48-49). Que la aorta llena frene al VI y suba la PCP no se escribe: sale del motor
  // La bomba no saca lo que no hay: el flujo cae cuando el VI (succionVi, mL) o las venas (succionVen, mmHg) se vacían (las
  // paredes se pegan a la cánula: fisiología general; los umbrales, ilustrativos). El flujo de la bomba no depende de la
  // presión que vence (la curva de cada aparato no está en la fuente): es el que se pide, salvo la succión
  // P4b: hincha 0,03 → 0,025 s (ilustrativo): con la cola de la activación el fallo al 100 % (FC ≈122) tiene ~87 ms de diástole tras cerrarse la aórtica y el
  // balón llegaba a 37,6 de 40 mL (95 %); el inflado de un balón real es rápido (p. 45), no un 5 % de lo que desplaza
  soporte: null, tauBalon: { hincha: 0.025, vacia: 0.02 }, succionVi: [6, 22], succionVen: [0.15, 1.2],
  // volumen de sangre total (mL)
  vSangre: 4850,
  // transporte de O₂ (Fick, por latido)
  hb: 14, sao2: 0.97, pao2: 95, vo2: 250, sc: 1.85,
};

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
// de 0 (x ≤ a) a 1 (x ≥ b) con forma de S
const suave = (x, a, b) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
const LMIN = 1000 / 60;   // mL/s por cada L/min
// Recta con codo: x por encima del codo; por debajo, exponencial con el mismo valor y la misma pendiente en el codo
// (continua y derivable), siempre > 0. Ver codoVen
const VCOLAPSO = 3, KCOLAPSO = 2;
const CMH2O_MMHG = 0.74; // 1 cmH₂O = 0,74 mmHg (fisiología general)
// x se acerca a objetivo como mucho «paso» (y llega exacto)
const hacia = (x, objetivo, paso) => Math.abs(objetivo - x) <= paso ? objetivo : x + Math.sign(objetivo - x) * paso;
export const conCodo = (x, codo) => codo > 0 && x < codo ? codo * Math.exp(x / codo - 1) : Math.max(0, x);
// Recta que se curva hacia arriba por encima de «desde» (exponencial con el mismo valor y la misma pendiente: sin salto).
// Ver rigAp
export const conRigidez = (x, desde, k) => x <= desde ? x : desde + k * (Math.exp((x - desde) / k) - 1);

// Activación en doble coseno: sube en t1, baja en t2 (0 fuera).
function activacion(t, t1, t2, q = 1) {
  if (t < 0) return 0;
  if (t < t1) return (0.5 * (1 - Math.cos(Math.PI * t / t1))) ** q;
  if (t < t1 + t2) return 0.5 * (1 + Math.cos(Math.PI * (t - t1) / t2));
  return 0;
}
// Activación del VI: igual que la de arriba hasta el 70% de la caída; desde ahí sigue una exponencial con la misma
// pendiente logarítmica en ese punto (τ = 0,162·t2), multiplicada por r (relajación lenta)
const T_SIS_APRIETA = 0.45;   // s
const U_COLA = 0.7, E_COLA = 0.5 * (1 + Math.cos(Math.PI * U_COLA)), K_COLA = E_COLA / (0.5 * Math.PI * Math.sin(Math.PI * U_COLA));
function activacionVi(t, t1, t2, q, r) {
  if (t < t1 + U_COLA * t2) return activacion(t, t1, t2, q);
  return E_COLA * Math.exp(-(t - t1 - U_COLA * t2) / (K_COLA * t2 * r));
}

// e′ desde la dinámica del VI (eco-mega P1, 31/10/2026). El Doppler tisular del anillo mide a qué velocidad se alarga el VI
// al llenarse en la diástole precoz. Aquí se toma la misma cosa del propio VI del motor: el pico de la velocidad de llenado
// (dV/dt, en las fases E-F, derivada centrada a ±2 ms) dividido por el volumen del VI en ese instante, o sea la velocidad
// de alargamiento relativa (como una tasa de deformación), que ya recoge la relajación, la FE (la fuerza de restitución:
// con la sístole débil el VI no se comprime ni «chupa») y la carga. e′ lateral = E_PRIMA_VI_K · tasa^E_PRIMA_VI_EXP (cm/s);
// el septal, el SEPTAL del atlas (0,8) del lateral. ILUSTRATIVO: la constante E_PRIMA_VI_K se calibra una sola vez para que el
// normal dé e′ lateral ≈12 y septal ≈9,5 cm/s (valores normales de Nagueh 2025, Tabla 5, p. 551 aprox.); el exponente 1 (lineal) hace
// que el shock cardiogénico (FE ~10 %) llegue a e′ septal ~3 cm/s (Nagueh 2025, p. 561: e′ septal 3-4 cm/s en el grado 3 avanzado).
// No usa la fórmula ^0,6 de la relajación del atlas (ePrima de atlas/diastolica.mjs, que sigue exportada).
export const E_PRIMA_VI_K = 2.28, E_PRIMA_VI_EXP = 1.0, E_PRIMA_SEPTAL = 0.8;
export const E_PRIMA_VENTANA = 0.10;   // s tras abrirse la mitral: la diástole precoz (ilustrativo)
export function ePrimaDeOnda(onda, tMitAbre, periodo) {
  // Ventana desde la apertura de la mitral (dando la vuelta al latido): a FC alta el llenado precoz cae al principio de la
  // onda R siguiente, etiquetado A (fusión E-A), y buscarlo solo en las fases E-F lo perdía (el TEP al 90-95 %).
  let r = 0; const n = onda.length;
  for (let i = 0; i < n; i++) {
    const x = onda[i], a = onda[(i + 1) % n], b = onda[(i - 1 + n) % n];
    const dt = ((a.t - b.t) % periodo + periodo) % periodo;
    if (tMitAbre != null) { if ((((x.t - tMitAbre) % periodo) + periodo) % periodo > E_PRIMA_VENTANA) continue; }
    else if (x.fase !== 'E' && x.fase !== 'F') continue;
    if (dt <= 0 || dt > 0.01) continue;
    const dv = (a.vvi - b.vvi) / dt;
    if (dv > 0 && x.vvi > 0) r = Math.max(r, dv / x.vvi * Math.pow(x.vvi / 120, 0.27));   // × L/L₀ (L ∝ V^0,27, como corazon-geo.mjs): de tasa a velocidad
  }
  const lat = E_PRIMA_VI_K * Math.pow(r, E_PRIMA_VI_EXP), sep = E_PRIMA_SEPTAL * lat;
  return { lat, sep, avg: (lat + sep) / 2, tasa: r };
}

export function crearMotor(ajustes = {}) {
  const p = { ...BASE, ...ajustes };
  for (const c of ['vi', 'vd', 'ai', 'ad']) p[c] = { ...BASE[c], ...(ajustes[c] || {}) };

  // Estado: volúmenes (mL) — la suma se conserva.
  const s = {
    t: 0, tLatido: 0,            // tiempo total y tiempo dentro del latido
    // arranca cerca del régimen estable (principio de un latido normal), para no esperar al asentamiento
    vad: 43, vvd: 110, vai: 46, vvi: 105,
    vao: 837, vven: 3294, vap: 151, vvp: 265, reflujoAo: 0,
    pad: 0, pvd: 0, pai: 0, pvi: 0, pao: 0, pven: 0, pap: 0, pvp: 0, pTorax: 0, pperi: 0, ptmAd: 0, ptmVd: 0,
    qMit: 0, qMitReg: 0, qCiv: 0, qTri: 0, qTriReg: 0, qAo: 0, dpVc: 0, dpNeto: 0, qPul: 0, qSis: 0, qRet: 0, qPulm: 0, qVp: 0,
    vMit: false, vTri: false, vAo: false, vPul: false,
    nLatido: 0, fase: 'G', _aoAbrio: false, _aoCerro: false, _mitAbrio: false, _pviPrev: 0,
    // barorreflejo: PAM que "siente" el seno carotídeo y efecto de cada brazo (0 = sin cambio)
    pamSensor: null, efFc: 0, efR: 0, efVu: 0, efEes: 0, fc: p.fc, paoDist: 0, isqVd: 0, isqVdObj: 0,
    // líquido que hay ya en el saco (sigue a p.liquidoPeri a ritmoDerrame) y volumen que ha entrado del intersticio
    qImp: 0, qEcmo: 0, qVent: 0, vBalon: 0,
    liquidoPeri: 0, perdido: 0, eesVi: p.vi.ees, eesVd: p.vd.ees, vRelleno: 0, pCap: 0, qRelleno: 0, vEdema: 0, qEdema: 0,
  };
  // derrame establecido (ver estiraPeri): el saco ya estirado y, dentro, lo que cabe sin apretar más de pPeriInicio
  s.estiraPeri = p.estiraPeri ?? Math.max(0, p.liquidoPeri - p.derrameTolerado);
  const cabe = p.v0Peri + s.estiraPeri + p.phiPeri * Math.log(p.pPeriInicio / p.kPeri) - (s.vad + s.vvd + s.vai + s.vvi);
  s.liquidoPeri = clamp(cabe, 0, p.liquidoPeri);
  const volTotal = () => s.vad + s.vvd + s.vai + s.vvi + s.vao + s.vven + s.vap + s.vvp;
  // Ajusta el total al volumen de sangre pedido repartiéndolo en las venas.
  s.vven += p.vSangre - volTotal();
  s.pamSensor = p.pamConsigna;

  let periodo = 60 / p.fc;
  // valores efectivos tras el barorreflejo (los de p son los basales que fija el usuario)
  const ef = { rSis: p.rSis, vuVen: p.vuVen, eesVi: p.vi.ees, eesVd: p.vd.ees };
  const acum = nuevoAcum();
  let ultimo = null;        // métricas del último latido completo
  let onda = [];            // muestras del latido en curso (cada 2 ms)
  let ondaUltima = [];
  let tMuestra = 0;

  // Por debajo de VCOLAPSO mL las paredes se tocan: la presión cae en parábola (KCOLAPSO mmHg/mL²) y la cámara no puede
  // vaciarse más. Antes, la curva diastólica se quedaba en −a por debajo de V0 y, con el saco a tensión, una cámara
  // seguía vaciándose hasta volúmenes negativos (AD −133 mL con 550 mL de derrame). Nunca actúa en un latido normal
  // (los volúmenes mínimos son de decenas de mL). Fisiología general; los números, ilustrativos
  function presionCamara(c, v, e, pperi, ees = c.ees) {
    const dv = v - c.v0;
    const sis = ees * dv;
    const dia = c.a * (Math.exp(c.b * dv) - 1);
    const colapso = v < VCOLAPSO ? -KCOLAPSO * (VCOLAPSO - v) ** 2 : 0;
    return e * sis + (1 - e) * dia + colapso + pperi;
  }
  // Aurícula: la contracción se SUMA a la pasiva (P = pasiva + e·Ees·(V−V0)). Con la mezcla de arriba, una aurícula muy
  // distendida (hipertrofia, dilatada) tenía la recta de la sístole bajo la curva pasiva y «contraerse» la relajaba: la onda A
  // desaparecía. Fisiología general; los números, ilustrativos
  function presionAurícula(c, v, e, pperi) {
    const dv = v - c.v0;
    const colapso = v < VCOLAPSO ? -KCOLAPSO * (VCOLAPSO - v) ** 2 : 0;
    return c.a * (Math.exp(c.b * dv) - 1) + e * c.ees * dv + colapso + pperi;
  }

  function presiones() {
    const T = periodo, k = Math.sqrt(T / (60 / 70));
    const tl = s.tLatido;
    // Con FC muy alta la sístole no cabe en el ciclo: √(T) la deja más larga que la diástole y, con la cola que pasa al latido siguiente
    // (tv0), la activación no baja y el VI no se llena (FC 178: PAM 26). Por encima de ~133 lpm la sístole se acorta más deprisa
    // que √T (la relajación se acelera con la frecuencia y con el simpático: fisiología general; el 0,45 s, ilustrativo)
    const kV = k * Math.min(1, T / T_SIS_APRIETA);
    const eAur = activacion(tl, 0.5 * p.tsAur * k, 0.5 * p.tsAur * k);
    const tv0 = tl < p.pr ? tl + T - p.pr : tl - p.pr;   // misma continuidad de la cola que en eVi (abajo)
    const eVen = activacion(tv0, p.fSubida * p.tsVen * kV, (1 - p.fSubida) * p.tsVen * kV, p.qSubida);
    // el VI puede relajarse más despacio que el VD (relajacion): solo se alarga la caída de su activación
    // la cola de la relajación del latido anterior no se corta al empezar el siguiente: antes de la onda R sigue su caída (a FC alta
    // y relajación lenta la cola era aún ~0,1 y la presión daba un salto de 4-5 mmHg al volver a empezar el latido)
    s.eVi = activacionVi(tv0, p.fSubida * p.tsVen * kV, (1 - p.fSubida) * p.tsVen * kV, p.qSubida, p.relajacion);
    // activación del VD: la del VI salvo que su sístole dure más (durVd)
    const eVd = p.durVd === 1 ? eVen : activacion(tv0, p.fSubida * p.tsVen * kV * p.durVd, (1 - p.fSubida) * p.tsVen * kV * p.durVd, p.qSubida);
    s.eAur = eAur; s.eVen = eVen; s.eVd = eVd;
    const vCor = s.vad + s.vvd + s.vai + s.vvi + s.liquidoPeri;
    s.pperi = p.kPeri * Math.exp((vCor - p.v0Peri - s.estiraPeri) / p.phiPeri);
    // efecto de la eyección (resistencia interna del VI): mientras expulsa, la presión del VI cae una fracción
    // proporcional al flujo; redondea la onda de flujo y retrasa su pico, como en el ventrículo real
    const pviLibre = presionCamara(p.vi, s.vvi, s.eVi, 0, ef.eesVi) * (1 - p.kEyec * Math.max(0, s.qAo));
    const pvdLibre = presionCamara(p.vd, s.vvd, eVd, 0, ef.eesVd) * (1 - p.kEyecVd * Math.max(0, s.qPul));
    // tabique: cada ventrículo "siente" una fracción de la presión del otro
    const pAw = p.pTorax * CMH2O_MMHG, pT = p.fPleura * pAw;   // vía aérea y pleura (mmHg)
    s.pTorax = pT;
    s.pvi = pviLibre + p.tabique * pvdLibre + p.septoDesplaza * (s.pperi ** 2 / (s.pperi ** 2 + p.septoP50 ** 2)) * (1 - eVd) * clamp(pvdLibre - pviLibre, 0, p.septoTope) + s.pperi + pT;
    s.pvd = pvdLibre + p.tabique * pviLibre + s.pperi + pT;
    s.pai = presionAurícula(p.ai, s.vai, eAur, s.pperi + pT);
    s.pad = presionAurícula(p.ad, s.vad, eAur, s.pperi + pT);
    // P1 · presión TRANSMURAL de las cavidades derechas (la de dentro menos la del saco): la que mantiene la pared abierta.
    // La presión de cada cámara ya lleva pperi dentro, así que pperi − pad nunca es > 0; lo que se acerca a 0 en el
    // taponamiento es la transmural (formas.mjs, plieguePared, la convierte en el pliegue de la pared libre)
    s.ptmAd = s.pad - s.pperi - pT; s.ptmVd = s.pvd - s.pperi - pT;
    // s.paoDist: presión del depósito elástico; s.pao: la de la raíz (la que se mide y ve la válvula)
    s.paoDist = Math.max(0, (s.vao + s.vBalon - p.vuAo) / p.cAo);
    s.pao = s.paoDist + p.zAo * s.qAo;
    s.pven = conCodo((s.vven - ef.vuVen) / p.cVen, p.codoVen) + p.kAbdomen * pAw;   // + el abdomen (kAbdomen)
    s.pap = conRigidez(conCodo((s.vap - p.vuAp) / p.cAp, p.codoPul), p.rigAp, p.kRigAp) + pT;
    s.pvp = conCodo((s.vvp - p.vuVp) / p.cVp, p.codoPul) + pT;
  }

  function flujos(dt) {
    // válvulas: diodo por gradiente
    s.qTri = s.pad > s.pvd ? (s.pad - s.pvd) / p.rTricus : 0;
    if (p.lPul > 0) {
      // pulmonar con inercia, como la mitral: abre por gradiente y cierra cuando el flujo llega a 0
      if (!s.vPul && s.pvd > s.pap) s.vPul = true;
      if (s.vPul) { s.qPul += (s.pvd - s.pap - p.rPulmonar * s.qPul) / p.lPul * dt; if (s.qPul <= 0) { s.qPul = 0; s.vPul = false; } }
    } else s.qPul = s.pvd > s.pap ? (s.pvd - s.pap) / p.rPulmonar : 0;
    if (p.lMit > 0) {
      // con inercia, la sangre que entra sigue entrando un momento aunque el gradiente ya se haya invertido (por eso la
      // onda E decelera en vez de cortarse), y la válvula cierra cuando el flujo llega a 0
      if (!s.vMit && s.pai > s.pvi) s.vMit = true;
      if (s.vMit) { s.qMit += (s.pai - s.pvi - p.rMitral * s.qMit) / p.lMit * dt; if (s.qMit <= 0) { s.qMit = 0; s.vMit = false; } }
    } else s.qMit = s.pai > s.pvi ? (s.pai - s.pvi) / p.rMitral : 0;
    // reflujo VI → AI por el orificio regurgitante (raíz suavizada cerca de 0 para no romper Euler)
    const dpReg = s.pvi - s.pai;
    s.qMitReg = p.eroaMitral > 0 && dpReg > 0 ? p.eroaMitral * 50 * dpReg / Math.sqrt(dpReg + 0.25) : 0;
    // cortocircuito VI → VD por el tabique roto: mientras la presión del VI supera a la del VD (sobre todo en la sístole)
    const dpCiv = s.pvi - s.pvd;
    s.qCiv = p.civ > 0 && dpCiv > 0 ? p.civ * 50 * dpCiv / Math.sqrt(dpCiv + 0.25) : 0;
    const dpTri = s.pvd - s.pad;
    s.qTriReg = p.eroaTricus > 0 && dpTri > 0 ? p.eroaTricus * 50 * dpTri / Math.sqrt(dpTri + 0.25) : 0;
    // aórtica: abre por gradiente; abierta, el flujo tiene inercia y puede invertirse un instante;
    // cierra cuando el reflujo acumulado llega al volumen de cierre
    if (!s.vAo) { if (s.pvi > s.paoDist) { s.vAo = true; s.reflujoAo = 0; } }
    s.dpVc = 0; s.dpNeto = 0;
    if (s.vAo && p.areaAortica > 0 && s.qAo > 0) {
      const v = s.qAo / (100 * p.areaAortica), r = Math.min(1, p.areaAortica / (Math.PI * (p.dAorta / 2) ** 2));
      s.dpVc = 4 * v * v; s.dpNeto = s.dpVc * (1 - 2 * r * (1 - r));
    }
    if (s.vAo) {
      s.qAo += (s.pvi - s.paoDist - (p.rAortica + p.zAo) * s.qAo - s.dpNeto) / p.lAo * dt;
      if (s.qAo < 0) { s.reflujoAo -= s.qAo * dt; if (s.reflujoAo > p.vCierreAo) { s.vAo = false; s.qAo = 0; } }
    }
    s.pao = s.paoDist + p.zAo * s.qAo;
    s.vTri = s.qTri > 0; s.vPul = s.qPul > 0; s.vMit = s.qMit > 0;
    // lechos (pueden invertirse si la aurícula supera a la vena: onda v)
    s.qSis = (s.paoDist - s.pven) / ef.rSis;
    s.qRet = (s.pven - s.pad) / p.rRetorno;
    s.qPulm = (s.pap - s.pvp) / p.rPul;
    s.qVp = (s.pvp - s.pai) / p.rVp;
  }

  // Barorreflejo: filtro del sensor y de cada brazo efector (primer orden) con saturación tanh
  function barorreflejo(dt) {
    s.pamSensor += (s.pao - s.pamSensor) * dt / p.tauSensor;
    const err = p.barorreflejo ? (p.pamConsigna - s.pamSensor) / p.pamConsigna : 0;   // + si la PA baja
    const brazo = (g, actual) => { const obj = err >= 0 ? g.sube * Math.tanh(err / (0.35 * g.sube) ) : g.baja * Math.tanh(err / (0.35 * g.baja));
      return actual + (obj - actual) * dt / g.tau; };
    const b = p.baro;
    s.efFc = brazo(b.fc, s.efFc); s.efR = brazo(b.r, s.efR); s.efVu = brazo(b.vu, s.efVu); s.efEes = brazo(b.ees, s.efEes);
    ef.rSis = p.rSis * (1 + s.efR); ef.vuVen = p.vuVen * (1 - s.efVu);
    s.eesVi += (p.vi.ees - s.eesVi) * dt / p.tauContractilidad; s.eesVd += (p.vd.ees - s.eesVd) * dt / p.tauContractilidad;
    s.isqVd += (s.isqVdObj - s.isqVd) * dt / p.tauIsqVd;
    ef.eesVi = s.eesVi * (1 + s.efEes); ef.eesVd = s.eesVd * (1 + s.efEes) * (1 - s.isqVd);
    s.fc = clamp(p.fc * (1 + s.efFc), 35, 190);
  }

  // El derrame entra a su ritmo; el relleno transcapilar sigue a la caída de la presión capilar y el edema sale del pulmón
  // por encima de pEdema (ver BASE)
  function liquidos(dt) {
    const entra = p.liquidoPeri > s.liquidoPeri ? clamp((p.pFuenteDerrame - s.pperi) / 5, 0, 1) : 1;
    s.liquidoPeri = hacia(s.liquidoPeri, p.liquidoPeri, p.ritmoDerrame * entra * dt);
    const antes = s.perdido;
    s.perdido = hacia(s.perdido, p.hemorragia, p.ritmoHemorragia * dt);
    s.vven -= s.perdido - antes;
    s.pCap = s.pven + (s.paoDist - s.pven) * p.fCap * BASE.rSis / ef.rSis;
    const caida = Math.max(0, p.pCap0 - s.pCap);
    const objetivo = p.rellenoMax > 0 ? p.rellenoMax * Math.tanh(p.cInt * caida / p.rellenoMax) : 0;
    s.qRelleno = (objetivo - s.vRelleno) / p.tauRelleno;
    s.vRelleno += s.qRelleno * dt; s.vven += s.qRelleno * dt;
    s.qEdema = p.kEdema * Math.max(0, s.pvp - s.pTorax - p.pEdema);
    s.vEdema += s.qEdema * dt; s.vvp -= s.qEdema * dt;
  }

  // Soporte mecánico (ver BASE.soporte): flujos de las bombas y volumen del balón en este paso
  function soporte(dt) {
    const so = p.soporte || {};
    // balón: vacío desde la onda R hasta que se cierra la aórtica (si no llega a abrirse, hasta que acaba la sístole)
    const sistole = s.tLatido >= p.pr && !s._aoCerro && (s.eVen > 0 || s.vAo);
    let objB = so.balon > 0 && !sistole ? so.balon : 0;
    // Errores de temporización (opcional; so.tim = { inf, des } en s: + tarde, − pronto; sin él, todo igual que arriba).
    // Inflado: se mide desde el cierre de la aórtica (tarde) o desde el cierre del latido anterior (pronto, aún en eyección).
    // Vaciado: se mide desde la onda R (pr).
    const tim = so.tim;
    if (tim && (tim.inf || tim.des)) {
      const di = tim.inf || 0, dd = tim.des || 0;
      if (s._aoCerro && !s._bCierre) { s._bCierre = true; s._tCierreB = s.tLatido; } else if (!s._aoCerro) s._bCierre = false;
      const tc = s._tCierreB ?? 0;
      const deflar = s.tLatido >= p.pr + dd && !s._aoCerro && (s.eVen > 0 || s.vAo || s.tLatido < p.pr);
      const pronto = di < 0 && s.vAo && !s._aoCerro && s.tLatido >= tc + di;
      if (pronto) s._bCmd = true;
      else if (deflar) s._bCmd = false;
      else if (s._aoCerro && s.tLatido >= tc + Math.max(di, 0)) s._bCmd = true;
      else if (s._bCmd == null) s._bCmd = !sistole;
      objB = so.balon > 0 && s._bCmd ? so.balon : 0;
    } else s._bCmd = null;
    s.vBalon += (objB - s.vBalon) * (1 - Math.exp(-dt / (objB > s.vBalon ? p.tauBalon.hincha : p.tauBalon.vacia)));
    const fVi = suave(s.vvi, p.succionVi[0], p.succionVi[1]);
    s.qImp = (so.impella || 0) * LMIN * fVi;
    s.qEcmo = (so.ecmo || 0) * LMIN * suave(s.pven, p.succionVen[0], p.succionVen[1]);
    s.qVent = Math.min(s.qEcmo, (so.venteo || 0) * LMIN * fVi);
  }

  function paso(dt = 0.0001) {
    barorreflejo(dt);
    presiones();
    flujos(dt);       // el flujo aórtico (con inercia) se actualiza antes que los volúmenes: Euler semiimplícito
    liquidos(dt);
    soporte(dt);
    // las bombas: Impella y venteo sacan del VI; el ECMO, el resto de las venas; todo vuelve a la aorta
    s.vvi -= (s.qImp + s.qVent) * dt; s.vven -= (s.qEcmo - s.qVent) * dt; s.vao += (s.qImp + s.qEcmo) * dt;
    s.vad += (s.qRet - s.qTri + s.qTriReg) * dt;
    s.vvd += (s.qTri - s.qPul - s.qTriReg + s.qCiv) * dt;
    s.vap += (s.qPul - s.qPulm) * dt;
    s.vvp += (s.qPulm - s.qVp) * dt;
    s.vai += (s.qVp - s.qMit + s.qMitReg) * dt;
    s.vvi += (s.qMit - s.qAo - s.qMitReg - s.qCiv) * dt;
    s.vao += (s.qAo - s.qSis) * dt;
    s.vven += (s.qSis - s.qRet) * dt;
    s.t += dt; s.tLatido += dt;
    fase();
    acumular(dt);
    if (s.t >= tMuestra) { onda.push(muestra()); tMuestra += 0.002; }
    if (s.tLatido >= periodo) {
      s.tLatido -= periodo;
      s._aoAbrio = s._aoCerro = s._mitAbrio = s._picoLlenado = false;
      s._fusion = !s.vMit;   // la mitral aún cerrada al empezar el latido: la A y el llenado van juntos (fase())
      ultimo = cerrarLatido();
      ondaUltima = onda; onda = [];
      s.nLatido++;
      periodo = 60 / s.fc;   // la FC cambia entre latidos (barorreflejo, o la que fije el usuario)
    }
  }

  // A hasta que empieza la activación ventricular; B hasta que abre la aórtica; C mientras sube la
  // presión del VI y D cuando ya baja; E hasta que abre la mitral; F mientras el llenado es rápido; G después.
  function fase() {
    if (s.vAo) s._aoAbrio = true;
    if (s._aoAbrio && !s.vAo) s._aoCerro = true;
    if (s._aoCerro && s.vMit) s._mitAbrio = true;
    let f;
    if (!s._aoAbrio) {
      f = s.tLatido < p.pr ? 'A' : 'B';
      // FUSIÓN E-A: si la mitral abre ya dentro de la contracción auricular (taquicardia: la relajación del VI no termina
      // antes de la P), lo que pasa por ella cuando la aurícula ya se relaja (pasada la duración de su activación) es llenado
      // ventricular, no onda A: F/G. Así la E se mide como el pico precoz de la onda fundida (Nagueh 2025, p. 547 (11) y
      // p. 557 T7) y la D de las venas pulmonares no queda en cero. Con la mitral ya abierta al empezar el latido (llenado
      // normal), la A sigue siendo A hasta el QRS. Fisiología general
      if (f === 'A' && s._fusion && s.vMit && s.tLatido >= p.tsAur * Math.sqrt(periodo / (60 / 70))) {
        if (s.qMit > 120) s._picoLlenado = true; f = (!s._picoLlenado || s.qMit > 120) ? 'F' : 'G'; }
    }
    else if (!s._aoCerro) f = s.pvi >= s._pviPrev ? 'C' : 'D';
    else if (!s._mitAbrio) f = 'E';
    else { if (s.qMit > 120) s._picoLlenado = true; f = (!s._picoLlenado || s.qMit > 120) ? 'F' : 'G'; }
    // C → D solo una vez por latido (el pico de presión del VI)
    if (s.fase === 'D' && f === 'C') f = 'D';
    s.fase = f; s._pviPrev = s.pvi;
  }

  function muestra() {
    return {
      t: +s.tLatido.toFixed(4), pvi: s.pvi, pai: s.pai, pao: s.pao, vvi: s.vvi,
      pvd: s.pvd, pad: s.pad, pap: s.pap, vvd: s.vvd, vai: s.vai, vad: s.vad,
      qAo: s.qAo, dpVc: s.dpVc, qMit: s.qMit, qMitReg: s.qMitReg, qCiv: s.qCiv, qPul: s.qPul, qTri: s.qTri, qTriReg: s.qTriReg, pven: s.pven, pvp: s.pvp,
      pTorax: s.pTorax, pperi: s.pperi, ptmAd: s.ptmAd, ptmVd: s.ptmVd, liquidoPeri: s.liquidoPeri, eVen: s.eVen, eVd: s.eVd, eVi: s.eVi, eAur: s.eAur, fase: s.fase, qVp: s.qVp,
      vMit: s.vMit, vAo: s.vAo, vTri: s.vTri, vPul: s.vPul, vBalon: s.vBalon, qImp: s.qImp, qEcmo: s.qEcmo,
    };
  }

  function nuevoAcum() {
    return { dt: 0, pao: 0, pad: 0, pai: 0, pap: 0, pven: 0, pvp: 0, qAo: 0, qAoAnt: 0, qSis: 0, qPul: 0, qReg: 0, qRegT: 0, qCiv: 0,
      qImp: 0, qEcmo: 0, qVent: 0, balonMax: 0,
      paoMax: -1, paoMin: 1e9, papMax: -1, papMin: 1e9, pviMax: -1, pvdMax: -1,
      vviMax: -1, vviMin: 1e9, vvdMax: -1, vvdMin: 1e9, padMax: -1, paiMax: -1,
      pviEnMitralCierre: null, ultimoMit: false, ultimoAo: false, ultimoPul: false, ultimoTri: false,
      tS1: null, tS2: null, tS2p: null, tAoAbre: null, tMitAbre: null, tTriCierra: null, tPulAbre: null,
      paoDiaEnCierreMit: null, pperi: 0 };
  }
  function acumular(dt) {
    const a = acum;
    a.dt += dt; a.pao += s.pao * dt; a.pad += s.pad * dt; a.pai += s.pai * dt; a.pap += s.pap * dt;
    a.pven += s.pven * dt; a.pvp += s.pvp * dt; a.qAo += s.qAo * dt; a.qAoAnt += Math.max(0, s.qAo) * dt;
    a.qImp += s.qImp * dt; a.qEcmo += s.qEcmo * dt; a.qVent += s.qVent * dt; a.balonMax = Math.max(a.balonMax, s.vBalon); a.qSis += s.qSis * dt; a.qReg += s.qMitReg * dt; a.qRegT += s.qTriReg * dt; a.qCiv += s.qCiv * dt; a.qPul += s.qPul * dt; a.pperi += s.pperi * dt;
    a.paoMax = Math.max(a.paoMax, s.pao); a.paoMin = Math.min(a.paoMin, s.pao);
    a.papMax = Math.max(a.papMax, s.pap); a.papMin = Math.min(a.papMin, s.pap);
    a.pviMax = Math.max(a.pviMax, s.pvi); a.pvdMax = Math.max(a.pvdMax, s.pvd);
    a.vviMax = Math.max(a.vviMax, s.vvi); a.vviMin = Math.min(a.vviMin, s.vvi);
    a.vvdMax = Math.max(a.vvdMax, s.vvd); a.vvdMin = Math.min(a.vvdMin, s.vvd);
    a.padMax = Math.max(a.padMax, s.pad); a.paiMax = Math.max(a.paiMax, s.pai);
    // tonos y aperturas: transiciones de las válvulas
    const sis = s.eVen > 0;
    if (sis && a.tS1 == null && s.pvi - s.pai > 0.5) { a.tS1 = s.tLatido; a.pviEnMitralCierre = s.pvi; }
    if (!a.ultimoMit && s.vMit && a.tS2 != null && a.tMitAbre == null) a.tMitAbre = s.tLatido;
    if (!a.ultimoAo && s.vAo && a.tAoAbre == null) a.tAoAbre = s.tLatido;
    if (a.ultimoAo && !s.vAo && a.tAoAbre != null) a.tS2 = s.tLatido;
    if (a.ultimoPul && !s.vPul && a.tPulAbre != null) a.tS2p = s.tLatido;
    if (!a.ultimoPul && s.vPul && a.tPulAbre == null) a.tPulAbre = s.tLatido;
    if (sis && a.tTriCierra == null && s.pvd - s.pad > 0.5) a.tTriCierra = s.tLatido;
    a.ultimoMit = s.vMit; a.ultimoAo = s.vAo; a.ultimoPul = s.vPul; a.ultimoTri = s.vTri;
  }
  function cerrarLatido() {
    const a = acum, T = a.dt;
    // vs: lo que sale por la válvula aórtica en el latido, neto (lo que pasa menos el reflujo que la cierra). Si la válvula
    // apenas se abre (con un Impella o un ECMO que vacían el VI), el reflujo de cierre (vCierreAo) puede ser mayor que lo
    // que pasó: el neto sería negativo y el gasto también. Ese volumen no sale del corazón, así que el gasto por la válvula es
    // 0 (vsBruto guarda lo que pasa hacia delante, sin restar el reflujo)
    const vs = Math.max(0, a.qAo), vsD = a.qPul;
    const fcLatido = 60 / T, gcValvula = vs * fcLatido / 1000;
    // soporte (L/min): lo que llega a la aorta por cada bomba en este latido
    const gcImpella = a.qImp / T * 60 / 1000, gcEcmo = a.qEcmo / T * 60 / 1000, gcVenteo = a.qVent / T * 60 / 1000;
    // gc: lo que llega al cuerpo (válvula + bombas). Sin soporte, el de siempre
    const gc = gcValvula + gcImpella + gcEcmo;
    const m = {
      fc: fcLatido, periodo: T,
      pas: a.paoMax, pad_: a.paoMin, pam: a.pao / T,
      pvc: a.pad / T, pcp: a.pai / T,
      paps: a.papMax, papd: a.papMin, papm: a.pap / T,
      pvi_max: a.pviMax, pvd_max: a.pvdMax,
      edv: a.vviMax, esv: a.vviMin, vs, vsBruto: a.qAoAnt, fe: vs / a.vviMax,
      // insuficiencia mitral: volumen y fracción regurgitantes; vs es el volumen anterógrado (aorta) y la FE
      // total cuenta lo que sale por las dos vías (sin insuficiencia, ≈ fe)
      vReg: a.qReg, fr: a.qReg / Math.max(1e-6, a.qReg + vs), feTotal: (a.vviMax - a.vviMin) / a.vviMax,
      edvD: a.vvdMax, esvD: a.vvdMin, vsD, feD: vsD / a.vvdMax,
      // insuficiencia tricuspídea: volumen y fracción regurgitantes (vsD es el anterógrado, por la pulmonar)
      vRegT: a.qRegT, frT: a.qRegT / Math.max(1e-6, a.qRegT + vsD),
      ptdvi: a.pviEnMitralCierre,       // presión al cerrar la mitral ≈ PTDVI
      gc, ic: gc / p.sc, gcValvula, gcImpella, gcEcmo, gcVenteo, balon: a.balonMax,
      // RVS con el flujo que cruza el lecho sistémico (en un latido estable es el GC; en uno sin eyección, sigue habiendo
      // flujo y la RVS no se vuelve infinita)
      rvs: (a.pao / T - a.pad / T) / (a.qSis * fcLatido / 1000) * 80,     // dyn·s·cm⁻⁵
      // RVP con el flujo que cruza el pulmón (lo que expulsa el VD): con un ECMO, el gasto que llega al cuerpo no pasa por él
      rvp: (a.pap / T - a.pai / T) / (vsD * fcLatido / 1000) * 80,
      pven: a.pven / T, pvp: a.pvp / T, pTorax: s.pTorax, pperi: a.pperi / T,
      ppc: a.paoMin - (a.pviEnMitralCierre ?? 0),  // presión de perfusión coronaria
      tS1: a.tS1, tS2: a.tS2, tS2p: a.tS2p, tAoAbre: a.tAoAbre, tMitAbre: a.tMitAbre,
      tPulAbre: a.tPulAbre, tTriCierra: a.tTriCierra,
      ePrima: ePrimaDeOnda(onda, a.tMitAbre, T),   // e′ lateral/septal/media (cm/s) desde la dinámica del VI
      // volumen comprometido total y presión media de llenado sistémico (referencia Guyton)
      vEstresado: (s.vao + s.vBalon - p.vuAo) + (s.vven - ef.vuVen) + (s.vap - p.vuAp) + (s.vvp - p.vuVp),
      pmls: ((s.vven - ef.vuVen) + (s.vao + s.vBalon - p.vuAo)) / (p.cVen + p.cAo),
      // perdido: la hemorragia que ya se ha ido; vRelleno: lo que ha entrado del intersticio; vEdema: lo que ha salido al
      // pulmón (vTotal = vSangre − perdido + vRelleno − vEdema ± lo que muevan a mano las maniobras)
      vTotal: volTotal(), perdido: s.perdido, vRelleno: s.vRelleno, vEdema: s.vEdema, liquidoPeri: s.liquidoPeri, pCap: s.pCap,
      // estado del barorreflejo al cerrar el latido (fracción de cambio sobre lo basal)
      baro: { fc: s.efFc, r: s.efR, vu: s.efVu, ees: s.efEes, sensor: s.pamSensor },
    };
    // Fick
    const cao2 = 1.34 * p.hb * p.sao2 + 0.003 * p.pao2;
    m.do2 = gc * cao2 * 10; m.do2i = m.do2 / p.sc;
    // (sin aporte, la extracción tiende a su techo de 0,7: el límite, no 0/0)
    m.vo2 = Math.min(p.vo2, m.do2 * 0.7); m.er = m.do2 > 0 ? m.vo2 / m.do2 : 0.7;
    m.svo2 = p.sao2 * (1 - m.er);
    // cortocircuito: Qs = lo que llega al cuerpo (gc), Qsh = lo que pasa del VI al VD, Qp = Qs + Qsh (el VD lo expulsa todo).
    // SatAD = mezcla venosa (svo2); SatAP = (Qs·SvO₂ + Qsh·SaO₂)/Qp. Sin orificio, Qsh = 0, Qp/Qs = 1 y SatAP = SvO₂
    m.qs = gc; m.qsh = a.qCiv / T * 60 / 1000; m.qp = m.qs + m.qsh; m.vCiv = a.qCiv;
    m.qpqs = m.qs > 0.05 ? m.qp / m.qs : 1;
    m.satAd = m.svo2; m.satAp = m.qp > 0.05 ? (m.qs * m.svo2 + m.qsh * p.sao2) / m.qp : m.svo2;
    // isquemia del VD: el margen de este latido fija hacia dónde va (ver isqDesde)
    const carga = m.pvd_max / (p.mioVd ?? 1) / Math.max(1, m.pam), u = clamp((carga - p.isqDesde) / p.isqAncho, 0, 1);
    s.isqVdObj = p.isqVdMax * u * u * (3 - 2 * u);
    m.isqVd = s.isqVd;
    Object.assign(acum, nuevoAcum());
    return m;
  }

  function correr(segundos, dt = 0.0001) {
    const n = Math.round(segundos / dt);
    for (let i = 0; i < n; i++) paso(dt);
    return ultimo;
  }

  // onda: el último latido completo; ondaActual: el latido en curso (crece hasta cerrarse);
  // periodo: la duración del latido en curso
  return { p, s, ef, paso, correr, get ultimo() { return ultimo; }, get onda() { return ondaUltima; },
    get ondaActual() { return onda; }, get periodo() { return periodo; } };
}
