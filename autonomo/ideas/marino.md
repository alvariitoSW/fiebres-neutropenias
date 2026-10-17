# Ideas visuales: Marino (The ICU Book)

Aquí se juntan las ideas para la parte de estudio del libro. Las dejan los revisores en cada revisión (fase R) y las
ordena el profesor en el «Mapa visual» (modo mapa). Nada de aquí se construye sin el visto bueno del usuario.

## Mapa visual

*(Profesor, modo mapa, 15/10/2026. Tarea `marino-mapa`, Objetivo M2. Hecho con las ideas de R1-R13 y las dos del usuario,
el índice de `js/data/libros-indice.js`, las fichas y figuras reales de la app, y capturas a 390×844 de los modelos
que ya existen. Nada de aquí se construye sin que el usuario elija sobre una maqueta.)*

### 0. El mapa en una pantalla

The ICU Book son ~154 fichas. Con **6 modelos grandes** (3 que ya existen y 3 nuevos) se explican unas 110. Lo demás
es consulta: texto para estudiar, preguntas y casos.

| # | Modelo | ¿Existe? | Fichas que explica | Qué falta para empezar |
|---|---|---|---|---|
| 1 | **Circulación viva** (corazón + ecógrafo + motor del latido) | Sí | ~25 (caps. 7-9, 11, 14-22, 47) | Que los escenarios lleguen a shock; curva de retorno venoso; presión intratorácica |
| 2 | **Riñón vivo** (nefrona + glomérulo + filtro) | Sí | ~15 (caps. 34-35, 38-39, 52-53) | Glomérulo con presión venosa y PIA; estados nuevos de la nefrona |
| 3 | **Escena del potasio** (y magnesio, fósforo, calcio) | Sí | ~9 (caps. 36-38, 50) | Partículas de Mg²⁺ y fosfato; realimentación |
| 4 | ★ **Ácido-base vivo** (proyecto del usuario) | Nuevo, sobre el 2 | ~16 (caps. 31-33 y cruces con 10, 23-24, 35-36, 52-53, más PIF) | Maqueta M1 (3 direcciones) |
| 5 | ★ **El agua del cuerpo: río y mar** (idea del usuario) | Nuevo | ~10 (caps. 10-11, 15, 35, 47) | Maqueta M2 (2 direcciones) |
| 6 | **Pulmón con respirador** | Nuevo | ~19 (caps. 7, 11, 23-30) | Maqueta M3 |

Detrás, por orden de rentabilidad: capilar y oxígeno (~13), vaso que sangra (~11), hepatocito vivo (~9), cráneo vivo
(~9), termostato (~7), ecógrafo de acceso vascular (~6), unión neuromuscular (~4) y piezas pequeñas con Motion.

Dos ideas de diseño que atan el conjunto:
- **Un pulmón, dos usos.** El pulmón que sopla CO₂ en ácido-base es el primer trozo del pulmón con respirador. Se
  construye una vez.
- **Un estado por fotograma, también fuera del corazón.** Como el ecógrafo lee el motor, la nefrona del ácido-base lee
  el plasma de la escena de ácido-base, el capilar de oxígeno lee el gasto del motor y el pulmón le pasa al motor la
  presión intratorácica. Nunca dos relojes.

---

### 1. Los modelos que ya existen y cómo ampliarlos

#### 1.1 Circulación viva (corazón 3D, ecógrafo con Doppler y modo M, motor del latido, atlas)

**Qué se ve hoy (capturas a 390 px):** el ecógrafo en 10 vistas con modo B, modo M, Doppler y color; la barra del ciclo
A-G; escenarios (normal, hemorragia de 1 L, fallo del VI, derrame, vasoplejía) y formas de enfermedad (HVI,
miocardiopatía dilatada, TEP); el corazón 3D con el plano de corte; el atlas (cap. 14 del VD con sobrecarga de
presión/volumen, gravedad y apical + eje corto lado a lado).

**Qué explicaría de Marino (fichas):**
- Monitorización: `mar-capnografia` (ETCO₂ y gasto, Fig. 7.8), `mar-cateter-ap`, `mar-termodilucion`.
- Fluidos y retorno: `mar-retorno-venoso`, `mar-respuesta-fluidos`.
- Shock: `mc-definiciones`, `mc-vasopresores`, `mc-hemorragico-clasificacion`, `mc-cardiogenico-fisio`,
  `mc-cardiogenico-farmaco`, `mc-soporte-mecanico`, `mc-shock-septico`, `mc-anafilaxia`.
- Corazón: `mc-ic-tipos`, `mc-ic-manejo`, `mc-taqui-reconocimiento`, `mc-fa-frecuencia`, `mc-sca-diagnostico`,
  `mc-diseccion-aortica`, `mc-paro-monitorizacion`, `mc-posresucitacion`.
- Otros: `neumo-ep-diagnostico`, `neumo-ep-manejo` (forma «TEP»), `merino-riesgos` (TACO frente a TRALI: VCI, líneas B,
  corazón), `mn-ictus-soporte` (burbujas del FOP, Fig. 47.1).

**Lo que le falta al motor (que se construya, no se esquive):**
1. **Escenarios que lleguen a shock.** En la captura, «Derrame pericárdico» da PA 106/78, GC 3,9 L/min y PVC 7: no es
   un shock, aunque se rotula «obstructivo (taponamiento)». R4 vio lo mismo en el fallo (`ees=0.9`) y la vasoplejía.
   Hace falta un **mando de gravedad** por escenario (0-100 %) que a fondo dé un paciente en shock posible: PAM por
   debajo del objetivo de 65 mmHg (`mc-vasopresores`), y las direcciones de la Tabla 14.1 (`mc-definiciones`). En el
   taponamiento, la VCI tiene que salir dilatada (hoy el derrame se queda en PVC ~7,5: README de eco, «Pendiente»).
2. **Curva de retorno venoso de Guyton** cruzada con la de función cardíaca. El motor ya calcula la presión media de
   llenado (`pmls`), la presión venosa y `rRetorno` (`motor.mjs`, líneas 168 y 334): falta dibujarlas. Mandos:
   «Bolo de 250-500 mL» (sube la Pms, `mar-retorno-venoso`) y «Elevar las piernas» (moviliza unos 300 mL,
   `mar-respuesta-fluidos`), con el VTI subaórtico en el ecógrafo y el corte de VS ≥10 % (sensibilidad 85 %,
   especificidad 92 %, misma ficha). La figura de retorno de hoy (dos deslizadores y una recta) desaparece.
3. **Presión intratorácica** como entrada del motor (la dará el pulmón, §4.1): VVS y elevación del pulso (Fig. 11.5),
   precarga y poscarga con la VNI (`neumo-epoc-vpp`, `neumo-vni-uso`), PEEP oculta que baja el gasto
   (`neumo-peep-oculta`) y la VCI en ventilación mecánica (README de eco, «Pendiente»).
4. **Chorro regurgitante en color** (README: «falta el chorro en la eco»; el motor ya tiene `eroaMitral`): la onda v del
   enclavamiento (`mar-cateter-ap`) y la IM del SCA.
5. **Una pared que no se mueve** (forma de enfermedad nueva, con su criterio en `CRITERIOS_FORMA`): `mc-sca-diagnostico`.
6. **FA**: latidos irregulares y sin contracción auricular (Fig. 19.4 real, `mc-fig19-4-onda-pulso-fa.jpg`); la FC que
   baja con diltiazem, amiodarona o digoxina (Fig. 19.5, `mc-fa-frecuencia`).
7. **Catéter de AP que avanza** (Motion sobre las presiones que el motor ya tiene en AD, VD, AP y AI): onda en vivo,
   globo que se infla, enclavamiento (Figs. 8.2-8.4 reales como lámina de referencia).
8. **ETCO₂ atado al gasto** (Fig. 7.8 real; Fig. 21.4 del paro: la ETCO₂ que sube con el RCE).
9. **Balón de contrapulsación** (Fig. 16.3 real) sobre la presión aórtica del motor.

**Frases vivas de ejemplo (las cifras, de la ficha que se cita):**
- Gravedad del taponamiento: «El líquido aprieta las cavidades derechas: la PVC sube y el gasto cae (Tabla 14.1)».
- Bolo: «La Pms subió, pero la PVC subió igual: el gradiente no cambió y el gasto tampoco. No responde» (`mar-retorno-venoso`).
- Elevar piernas: «300 mL vuelven al corazón sin infundir nada: el VTI sube un 12 %, responde (VS ≥10 %)».

**Paciente posible:** a fondo de cada mando, PA, FC, PVC y GC de un humano en shock, no un cero ni un 300. Con el
mando a la mitad, un estado intermedio creíble. Las pruebas de `escenarios.mjs` ya exigen la dirección: hay que añadir
la magnitud.

#### 1.2 Riñón vivo (nefrona viva, glomérulo vivo, filtro vivo)

**Qué se ve hoy:** la nefrona en 3 niveles (corte real → nefrona con partículas y osmolalidad → célula del tramo,
con sus transportadores); situaciones (normal, deshidratación, agua, SIADH, DI, hiperglucemia, prerrenal, NTA,
obstrucción, diarrea, ATR I/II/IV, hiperparatiroidismo, HHF, FGF23) y fármacos (furosemida, tiazida, espironolactona,
amilorida, acetazolamida, iSGLT2). La célula del colector muestra la **célula principal y la intercalar tipo A**. El
glomérulo tiene PAM, IECA/ARA-II, iSGLT2, depleción, AINE, estenosis, obstrucción y albuminuria. El filtro tiene
difusión, convección, híbrida, dosis, reposición, flujo y anticoagulación.

**Qué explicaría de Marino:** `mr-fra-criterios`, `mr-fra-causas`, `mr-fra-nefrotoxicos`, `mr-fra-indices`, `mr-trr`,
`mr-osmolalidad`, `mr-hipernatremia`, `mr-hiponatremia-dx`, `mr-hiponatremia-tto`, `mr-hipercalcemia`,
`ma-pbe-shr` (hepatorrenal), `ma-fallo-hepatico-agudo` (TRR para el amonio), `mt-salicilatos` y `mt-alcoholes`
(hemodiálisis). Más las 6 de ácido-base (§2).

**Lo que le falta:**
1. **Glomérulo**: presión venosa renal y presión del túbulo (Fig. 34.2 real: «GFR ≈ (Pā − Pv) − P_PT») y la **PIA**
   con la regla de la ficha `mr-fra-causas`: «gradiente = Pā − (PIA × 2)», PIA normal en supino 5-7 mmHg, hipertensión
   intraabdominal ≥12. Mandos «PVC alta (congestión)» y «PIA». Y la vasoconstricción renal del hepatorrenal
   (`ma-pbe-shr`).
2. **Nefrona**: estados de ácido-base nuevos (§2.2) y la **célula intercalar tipo B con la pendrina**.
3. **Filtro**: un mando «qué tóxico» solo con lo que digan las fichas (salicilatos, metanol/etilenglicol, metformina,
   amonio con CVVH en el fallo hepático agudo). Si la ficha no dice por qué cruza, no se dice.

**Frases vivas:** «PVC 20: el filtrado cae aunque la PAM sea normal; la congestión cuenta (Fig. 34.2)»;
«PIA 20: el gradiente de filtración es la PAM menos dos veces la PIA».

**Paciente posible:** TFG y diuresis nunca negativas; con PIA alta y PAM baja, oliguria, no «filtrado 0» con PAM 90.

#### 1.3 Escena del potasio (`potasio-escena.js`, hipo e hiperpotasemia)

**Qué se ve hoy:** el K⁺ como nube de puntos entre plasma (2 %) y célula (98 %), con la bomba Na⁺/K⁺, salidas por
orina, heces y diálisis, ECG en vivo (que puede ser normal con K⁺ alto: «el ECG no predice el K⁺») y los fármacos con
su reloj de inicio y duración.

**Qué explicaría:** `mr-hipopotasemia`, `mr-hiperk-causas`, `mr-hiperk-tratamiento`, `mr-magnesio-deficit`,
`mr-magnesio-reposicion`, `mr-calcio-hipoca` (citrato de la transfusión), `mr-fosforo`, `mu-npt-complicaciones`
(realimentación), `mr-cetoacidosis` (el K⁺ y la insulina, Tabla 32.4).

**Lo que le falta:** Mg²⁺ y fosfato como partículas; la Fig. 36.2 viva (déficit frente a K⁺ sérico, con el tramo
plano); la Fig. 36.4 (ECG en escalera) en el ECG que ya existe; la prueba de retención de Mg (R9); el botón
«Realimentar» (glucosa + insulina meten K⁺, fosfato y Mg²⁺ en la célula; la tiamina se agota, `mu-npt-complicaciones`,
`mu-tiamina`); la regla de la CAD «insulina solo si K⁺ >3,3» (Tabla 32.4).

**Frases vivas:** «Sin magnesio, el K⁺ que repones se escapa por la orina: mide el Mg antes» (`mr-alcalosis-tratamiento`);
«La insulina mete el K⁺ en la célula: el K⁺ total no cambia, el de la analítica sí».

#### 1.4 Receptores animados (Motion) y kit Visual

No son modelos grandes, sino **patrones**: el de los receptores (paso a paso con «Reproducir», ◀ ▶ y barras de
intensidad) sirve de plantilla para el termostato, la unión neuromuscular, el eje hormonal y la hemostasia por pasos.
El kit Visual queda para las fichas de consulta.

---

### 2. ★ Ácido-base vivo: el proyecto del usuario

> El usuario pide que le «sorprenda infinitamente a nivel artístico» y que sea de las mejores herramientas visuales de
> la app. Es un proyecto propio, no una ficha más, y **se construye sobre el riñón de PIF → Nefrología**.

#### 2.1 Qué hay que entender (y qué tiene que verse)

1. El pH depende de un **cociente**, no de un valor: [H⁺] = 24 × PaCO₂ / HCO₃⁻ (Ec. 31.2, `mr-acidobase-analisis`).
   El pulmón maneja el numerador; el riñón, el denominador.
2. La compensación **limita pero no corrige** (Tabla 31.1), y llega a su hora: el pulmón en 30-120 min; el riñón en
   2-3 días (por eso hay respiratorias agudas y crónicas). Ecuaciones de la Fig. 31.2.
3. La sangre es **eléctricamente neutra**: lo que falta de HCO₃⁻ lo llena el cloro (hiperclorémica) o un anión no
   medido (lactato, cetoácidos): el **hiato aniónico** y el **delta** lo cuentan (Ec. 31.14-31.16, Tabla 31.2).
4. Hay solutos que no salen en la fórmula de la osmolalidad: el **hiato osmolal** (Ec. 31.17, <10) destapa metanol y
   etilenglicol (`mt-alcoholes`).
5. La alcalosis metabólica se **mantiene** por falta de cloro: sin Cl⁻ en la luz del colector, la **pendrina** no
   puede secretar HCO₃⁻ (Fig. 33.1, `mr-alcalosis-mecanismos`). El salino la arregla porque devuelve el cloro.
6. El lactato no es el ácido, y el bicarbonato es un mal tampón a pH fisiológico (pK 6,1; Figs. 32.1 y 32.2).

#### 2.2 Cómo se integra el riñón de PIF → Nefrología

**Lo que ya tiene y sirve tal cual:**
- Estados de acidosis hiperclorémica: diarrea, ATR I, ATR II, ATR IV, con HCO₃⁻ plasmático, K⁺, hiato aniónico
  urinario, NH₄⁺ y pH urinario (tabla «Diarrea frente a las ATR» de `fisio-acidobase-acidosis`).
- Partículas propias: HCO₃⁻ (triángulo), H⁺ secretado (cruz), NH₄⁺ (pentágono). Se reutilizan las mismas formas en
  toda la escena de ácido-base, para que el residente reconozca el mismo ion en todas partes.
- La célula del colector con la intercalar tipo A («H⁺ a la luz, HCO₃⁻ a la sangre») y la reacción
  «H⁺ + HCO₃⁻ → CO₂ + H₂O».
- Fármacos: furosemida y tiazida (alcalosis por diuréticos), acetazolamida (la ficha de Marino la usa en la alcalosis
  con edemas, 250-375 mg).
- Glomérulo con «Depleción de volumen»: baja el filtrado (menos HCO₃⁻ filtrado, la «alcalosis por contracción»).

**Lo que falta, con su fuente:**

| Pieza | Qué hace | Fuente |
|---|---|---|
| **Célula intercalar tipo B con pendrina** | Cl⁻ entra, HCO₃⁻ sale a la luz; casi apagada en reposo; se enciende en la alcalosis; **se apaga sin Cl⁻ en la luz** | Fig. 33.1 (real: `mar-fig33-1-celulas-colector.jpg`), `mr-alcalosis-mecanismos` |
| Estado «Vómitos / sonda nasogástrica» | Pierde H⁺ (50-100 mEq/L), Cl⁻ (120-160) y algo de K⁺ (10-15); cada H⁺ perdido deja un HCO₃⁻; Cl⁻ urinario <20 | `mr-alcalosis-mecanismos`, Tabla 33.1 |
| Estado «Hiperaldosteronismo primario» | Volumen alto, Cl⁻ urinario >20; la aldosterona reabsorbe Na⁺, secreta K⁺ y enciende la bomba de H⁺ | Tabla 33.1, misma ficha |
| Tratamiento «Salino + ClK» | Llega Cl⁻ al colector → la pendrina secreta HCO₃⁻ → bicarbonaturia; déficit de Cl⁻ = 0,2 × peso × (100 − Cl⁻), volumen = déficit/154, a 100 mL/h sobre las pérdidas | Ec. 33.2-33.3, `mr-alcalosis-tratamiento` |
| Estado «Respiratoria crónica» | El proximal reabsorbe más HCO₃⁻ cuando sube la PaCO₂ (y menos cuando baja), en 2-3 días | `mr-acidobase-analisis` |
| Estado «Cetoacidosis» | Cetoácidos en plasma; glucosuria (ya existe «Hiperglucemia»); el riñón reabsorbe más Cl⁻ al excretar cetonas (CAD con hiato normal, excepción 2) | `mr-cetoacidosis` |
| Entrada externa del plasma | La nefrona lee HCO₃⁻, PaCO₂ y Cl⁻ de la escena de ácido-base (un estado por fotograma) en vez de su propio número | Diseño |
| Cl⁻ urinario en «Orina final» | <20 o >20 mEq/L según el estado | Tabla 33.1 |

**El pulmón que sopla CO₂ (pieza nueva, primer trozo del pulmón con respirador):** un racimo de alvéolos que respira;
el CO₂ sale como partículas por la vía aérea. Su ritmo lo marca la compensación de la ficha: PaCO₂ esperada =
40 − 1,2 × (24 − HCO₃⁻) en la acidosis; 40 + 0,7 × (HCO₃⁻ − 24) en la alcalosis (Fig. 31.2, Ec. 33.1), con el
quimiorreceptor del cuerpo carotídeo como disparador (`mr-acidobase-analisis`). Cuánto se ve respirar es **ilustrativo**
(la ficha no da la ventilación minuto): lo dice en pantalla. Con «Respirador» (paciente ventilado), la ventilación la
pone el residente: «sube la ventilación minuto si das bicarbonato» (`mr-lactato-bicarbonato`).

**La sangre: la balanza de aniones.** Dos columnas que se equilibran (electroneutralidad, Ec. 31.12):
- Cationes: Na⁺ (140) + no medidos 11 (Ca 5, K 4,5, Mg 1,5).
- Aniones: Cl⁻ + HCO₃⁻ + no medidos 23 (albúmina 15, orgánicos 5, fosfato 2, sulfato 1). Tabla 31.2.
- El **hiato aniónico** es el hueco rotulado: Na − (Cl + HCO₃) = 12 (8-12).
- Lactato o cetoácidos entran como bloques ocres y **desalojan** HCO₃⁻, que se va como CO₂ por el pulmón.
- Salino: el Cl⁻ crece y empuja al HCO₃⁻ (hiperclorémica; Fig. 10.2 real: pH 7,41 → 7,28 con salino a 30 mL/kg/h y
  sin cambio con Ringer, `mar-cristaloides`).
- Mando «Albúmina» (g/dL): baja el bloque de la albúmina y **esconde** un lactato; el hiato corregido
  HAc = HA + 2,5 × (4,5 − albúmina) lo destapa (ejemplo de la ficha: HA 10 con albúmina 2 → 16).
- **Delta** = (HA − 12)/(24 − HCO₃⁻): <1 hay además hiperclorémica; >1, alcalosis añadida (Ec. 31.16).
- Al lado, la **balanza de osmoles**: medida frente a calculada (2 × Na + glucosa/18 + BUN/2,8 = 290 con Na 140,
  glucosa 90, BUN 14); el metanol o el etilenglicol son «sal que el cálculo no ve» (Ec. 31.17).

**La gasometría que se mueve.** El mapa PaCO₂-HCO₃⁻ que ya existe (`mapaGasometria`, con sus 4 líneas de compensación
y las isolíneas de pH) gana un **reloj** (minutos → horas → días): el punto sale de la normalidad por el eje del
trastorno primario y luego **se desliza por la línea de compensación** a la velocidad de cada órgano, dejando estela. Si
el punto se separa de la línea, la escena lo dice: «hay un trastorno añadido». La curva de [H⁺] frente a pH
(`curvaPh`, Fig. 31.1) acompaña al pH: el mismo 0,1 de pH pesa 2,5 veces más en el lado ácido.

**Dos fuentes, nunca mezcladas.** Nefrología al día (PIF) usa otras fórmulas de compensación y un Δ-ratio con cortes
de 0,4 y 2; Marino, corte de 1. La escena lleva un selector «Fuente: Marino | Nefrología al día» que cambia las líneas
del mapa y los cortes del delta, con su nota de fuentes. Ninguna gana.

**Dónde vive y cómo se abre (decisión del usuario):** propongo una vista propia en Nefrología, junto a la nefrona viva
(el riñón es su casa), que se abre desde cualquier ficha con un atributo como los de la nefrona
(`data-acido-base="cad-salino"`): las 6 fichas de Marino de los caps. 31-33, las 2 de ácido-base de PIF y los cruces.

**Mandos, con su frase viva:**

| Mando | Qué cambia | Frase viva (ejemplo; cifras de la ficha) |
|---|---|---|
| Causa: láctica, CAD, diarrea, salino, vómitos, diuréticos, EPOC aguda/crónica, salicilatos, metanol | El trastorno primario | «Los cetoácidos se comen el HCO₃⁻: el hueco de la balanza crece (HA 24)» |
| Reloj: minutos · horas · días | La compensación | «A las 2 h el pulmón ya sopla: PaCO₂ esperada 26 (40 − 1,2 × 12)»; «El riñón tarda 2-3 días: hoy es aguda» |
| Albúmina | El hiato escondido | «Albúmina 2: el hiato parece normal (10), corregido es 16: hay un anión escondido» |
| Salino 0,9 % / Ringer | Cl⁻ del suero | «El HCO₃⁻ no sube aunque las cetonas bajan: el cloro del salino ocupa su sitio (delta 0,3)» |
| Salino + ClK (alcalosis) | Cl⁻ al colector, pendrina | «Llega cloro: la pendrina se enciende y el HCO₃⁻ sale por la orina» |
| Acetazolamida | HCO₃⁻ proximal | «Con edemas no hay salino: la acetazolamida tira el HCO₃⁻ en el proximal» |
| Bicarbonato IV | CO₂ y Ca iónico | «Cada ampolla trae CO₂ (PCO₂ 200 mmHg en la solución): si está ventilado, sube la ventilación» |
| Insulina (CAD) | Cetonas, K⁺ | «Las cetonas bajan y el hiato se cierra; vigila el K⁺ (Tabla 32.4)» |
| Fuente | Fórmulas y cortes | «Con Nefrología al día, el Δ-ratio usa cortes de 0,4 y 2» |

**Paciente posible:** el pH siempre sale de la Ec. 31.2, nunca escrito a mano, así que la gasometría es coherente.
Rango del mapa: PaCO₂ 10-90, HCO₃⁻ 4-50, pH 6,8-7,8 (Fig. 31.1). Na⁺ y Cl⁻ siempre en cifras humanas; un instante «sin
compensar» (p. ej. pH 7,10 en los primeros minutos de una CAD) se rotula como instante teórico.

**Hallazgo para el auditor (fidelidad):** los dos ejemplos del cap. 31 **no cumplen la Ec. 31.2 del propio libro**.
Comprobado en el PDF (`docs/marino-2024-acido-base-renal-caps31-34.pdf`, texto de los ejemplos de las reglas 3 y 4):
- pH 7,28, PaCO₂ 23, HCO₃⁻ 14 → 24 × 23/14 = 39 nEq/L → pH 7,40;
- PaCO₂ 26, pH 7,50, HCO₃⁻ 14 → 24 × 26/14 = 45 → pH 7,35.

La ficha `mr-acidobase-analisis` los copia sin nota. Una escena que calcula el pH no puede mostrarlos tal cual. Hace
falta una nota de fidelidad (REGLAS §1.3), y que los casos usen gasometrías coherentes.

#### 2.3 Tres direcciones artísticas (para la maqueta M1)

Las tres usan el mismo motor de datos, el mismo caso y los mismos órganos (el riñón entra siempre por la nefrona
viva). Cambia cómo se ve y qué metáfora manda. Paleta solo de `css/variables.css`. Cada ion tiene un color y una
**forma** (la identidad nunca va solo por color), las mismas que en la nefrona viva:

| Ion | Color (token) | Forma |
|---|---|---|
| H⁺ | `--accent-red` (terracota) | cruz |
| HCO₃⁻ | `--accent-green` (salvia) | triángulo |
| Cl⁻ | `--accent-purple` (ciruela) | rombo |
| Lactato y cetoácidos | `--accent-yellow` (ocre) | hexágono |
| CO₂ | `--accent-blue` (oro) | voluta o humo |
| Na⁺ | `--text-main` (crema) | círculo |

**A · «Lámina de anatomía dorada» (grabado del siglo XIX que cobra vida)**
- *Estilo:* línea fina de oro sobre `--bg-main`, sombreado de grabado (rayado en `--text-muted`), Georgia como el resto
  de la app. Es la que más se parece a la identidad actual (oscuro y dorado, «cuaderno de campo»).
- *Composición vertical:* arriba el tórax a plumilla con los pulmones que se hinchan y el CO₂ que sale en volutas
  doradas; en medio, un vaso en corte donde fluyen los iones; abajo, la **foto real del corte del riñón** con viñeta
  dorada que hace zoom a las tres células de la Fig. 33.1, redibujadas a plumilla (la pendrina en salvia).
- *Balanza:* una **balanza de latón de dos platillos**; los iones son pesas apiladas; el hiato aniónico es la pesa que
  falta, rotulada. El lactato cae como monedas ocres; el HCO₃⁻ desalojado sube como humo.
- *Gasometría:* una carta náutica grabada (isolíneas de pH como isobaras), con un reloj de arena para el tiempo.
- *Animación:* los trazos se dibujan al entrar; la balanza oscila con muelle (Motion); las monedas caen con rebote.
- *Sensación:* clásico y bello, muy de la app; menos «dentro del cuerpo».

**B · «Campo oscuro» (bioluminiscencia: estar dentro del cuerpo)**
- *Estilo:* microscopía de campo oscuro. Todo es luz sobre negro, con los resplandores de los tokens (`--glow-red`,
  `--glow-green`, `--glow-purple`, `--glow-blue`). Las membranas son halos, no contornos.
- *Composición:* un lienzo vertical que respira, con tres «objetivos de microscopio» circulares unidos por hilos de
  luz (la sangre): **alvéolo** (chispas doradas de CO₂ que escapan), **plasma** (iones flotando como plancton
  luminoso) y **célula del colector** (H⁺ bombeado a la luz como chispas rojas; la pendrina, un poro salvia que late).
- *Balanza:* dos **columnas de luz** que suben como burbujas (cationes y aniones); el hiato es una franja oscura que se
  llena de lactato brillante.
- *Gasometría:* el punto es un **cometa** con estela que recorre la línea de compensación; las isolíneas de pH, hilos
  de luz tenue.
- *Ambiente:* la bruma del fondo vira muy poco hacia terracota en la acidemia y hacia salvia en la alcalemia, siempre
  con la palabra escrita.
- *Animación:* partículas continuas en canvas (como la nefrona viva), un pulso de luz en cada respiración y un
  destello cuando H⁺ y HCO₃⁻ se unen y nace un CO₂.
- *Sensación:* la más «viva» y sorprendente; la más cara de construir y de mantener fluida en el móvil.

**C · «Móvil cinético» (la ecuación hecha objeto, al estilo de Calder)**
- *Estilo:* geometría plana, formas macizas de color token, varillas finas de oro, mucho espacio vacío; el pH en
  número grande.
- *Metáfora central:* la Ec. 31.2 como un **móvil colgante**. A la izquierda, el platillo del CO₂ (lo carga un pulmón
  estilizado que sopla); a la derecha, el del HCO₃⁻ (lo carga un riñón estilizado que añade o quita fichas). La aguja
  marca el pH en un **arco no lineal** de 6,8 a 7,8 (marcas a pasos iguales de [H⁺], Fig. 31.1).
- *Cómo enseña:* el trastorno primario carga un platillo y la aguja se va. La compensación es el otro órgano cargando
  su platillo **despacio** (pulmón en minutos, riñón en días), y la aguja vuelve hacia 7,40 sin llegar: «limita, pero
  no corrige». En un trastorno mixto los dos platillos empujan hacia el mismo lado y la aguja se dispara.
- *Abajo, un segundo móvil:* la electroneutralidad. El hiato es la pieza que cuelga sin nombre; el lactato se cuelga y
  el HCO₃⁻ se descuelga. Tocar el riñón estilizado abre la nefrona viva en su estado.
- *Animación:* muelles con oscilación amortiguada (Motion spring) y tiempo acelerable.
- *Sensación:* la que mejor enseña la compensación de un vistazo; la menos anatómica.

*Opinión del profesor (el usuario elige):* C es la que más enseña; B, la que más sorprende; A, la que más encaja en la
app. Una mezcla posible es el móvil de C como cabecera fija (el pH siempre a la vista) con los órganos vivos de B
debajo.

---

### 3. ★ El agua del cuerpo: río y mar (idea del usuario)

#### 3.1 Qué hay que entender

1. El plasma es solo el 6-7 % del agua: 3 L de 45 en un varón de 75 kg (Tabla 10.1: intracelular 29, extracelular 16,
   intersticial 13, plasma 3).
2. El agua va hacia donde hay más partículas (tonicidad). El sodio manda en el extracelular y la albúmina retiene el
   agua en el vaso (80 % de la oncótica) (`mar-cristaloides`, `mar-coloides`).
3. Cada fluido acaba en un sitio distinto (Fig. 10.1, real):
   - glucosado 5 % (1 L): +100 plasma, +250 intersticio, el resto (~650) a las células;
   - salino 0,9 % (1 L): +275 y +825, y saca algo de agua de las células (total 1.100);
   - albúmina 5 % (1 L): +700 y +300;
   - salino 7,5 % (250 mL): +535 y +700 = 1.235, unas 5 veces lo infundido, sacando agua de las células.
4. Un déficit clínico del 15 % del plasma son solo 450 mL en el varón; reponerlo con cristaloide pide 2,25 L, de los
   que 1,8 L van al intersticio: edema (Tabla 11.1, `mar-retorno-venoso`).
5. La albúmina baja y la permeabilidad alta (inflamación) desbordan el intersticio. La albúmina al 25 % saca agua del
   intersticio (3-4 veces su volumen): mueve, no repone (Tabla 10.3).

#### 3.2 El símil y sus mandos (común a las dos direcciones)

- **Río = plasma** (corre, estrecho), **marisma o estuario = intersticio**, **mar o lagunas interiores = células**
  (detrás de una orilla con compuertas, las acuaporinas). Es **ilustrativo** y lo dice en pantalla; las cifras que se
  muestran son las de la Fig. 10.1 y las Tablas 10.1 y 11.1.
- **Salinidad = osmolalidad**: el agua salada tira del agua; el glucosado es «agua dulce»; la albúmina es «limo grueso»
  que no cruza la orilla.
- **Mandos:**
  - fluido (glucosado 5 %, salino 0,9 %, Ringer lactato, albúmina 5 %, albúmina 25 %, salino 7,5 %);
  - cuánto (de 250 mL a 2 L; se escala la Fig. 10.1 y se rotula «proporcional a la Fig. 10.1»);
  - «Hemorragia del 15 %» (−450 mL de río) y «Reponer» (los 2,25 L de Ringer del ejemplo de la ficha);
  - albúmina del paciente normal o baja y permeabilidad normal o «inflamación», cualitativos (la ficha no da cifras:
    ilustrativo).
- **Frases vivas:**
  - «De 1 L de salino, solo 275 mL se quedan en el río: el resto inunda la marisma».
  - «Agua dulce: la glucosa se la beben las células y el agua la sigue; dos tercios acaban en el mar».
  - «250 mL de agua muy salada sacan agua del mar: el río y la marisma ganan 1.235 mL».
  - «El limo de la albúmina no cruza la orilla: 700 de cada 1.000 mL se quedan en el río».
- **Extensiones** (otros capítulos que caben en el mismo mundo):
  - sodio (`mr-hiponatremia-*`, `mr-hipernatremia`): el mar se hincha o se encoge, y un zoom a la neurona que se
    edematiza;
  - salino hipertónico en el edema cerebral (`mn-ictus-soporte`: Na⁺ objetivo 145-155);
  - el déficit de agua de la CAD (50-100 mL/kg, `mr-cetoacidosis`);
  - fluidos del shock hemorrágico (`mc-hemorragico-fluidos`);
  - el «fregadero» de la Fig. 11.1, la metáfora de agua del propio Marino, como paso al retorno venoso (que vive en la
    circulación viva).
- **Sustituye** al simulador de barras de hoy (`mar-cristaloides`, «¿Adónde va lo que infundo?») y a la idea de R2 de
  los compartimentos vivos.

**Hueco de color (decisión del usuario):** los tokens no tienen azul. El filtro vivo ya pinta el agua con `#8fb8d8` y
la nefrona la urea con `#7fb3c8`, fuera de los tokens. La maqueta debe enseñar el agua de las dos maneras (solo tokens,
como crema translúcida con reflejos dorados; o con el «agua» del filtro vivo) y que el usuario elija.

#### 3.3 Dos direcciones artísticas (maqueta M2)

**1 · «Estuario de noche» (vista desde arriba, acuarela a la luz de la luna)**
- Un mapa cenital: el río serpentea, la marisma lo rodea con juncos (salvia), y detrás de una duna con compuertas está
  el mar de las células. Es de noche: el agua es crema translúcida con reflejos de oro; la sal son destellos dorados;
  el agua dulce no brilla.
- Al infundir, una vasija vierte en el río una mancha que se extiende como tinta en acuarela y se reparte por los tres
  cuerpos de agua. Un **mareógrafo** en cada uno marca los mL de la Fig. 10.1.
- Edema: la marisma desborda los prados. Hemorragia: el río baja y la marisma le cede agua (ficha `mar-coloides`: «en
  la hemorragia hay un déficit intersticial»).
- *Animación:* ondas de superficie en canvas, la tinta que difunde y la marea que sube con muelle.
- *Fuerte en:* belleza y en «ver adónde va». *Débil en:* leer cifras exactas.

**2 · «Corte del terreno» (la Fig. 10.1 que se llena, vista lateral)**
- Un corte geológico o de acuario: arriba el vaso sanguíneo como un tubo rojo (como en la Fig. 10.1); alrededor, la
  tierra empapada del intersticio; debajo, el acuífero de las células, un panal de células rosadas como el fondo de la
  misma figura. Cada compartimento tiene una **regla en mL**.
- El suero gotea desde una botella. El agua sube con oleaje amortiguado (Motion), las gotas cruzan las acuaporinas con
  flechas y la salinidad son cristales en suspensión.
- Un segundo cuadro, opcional, es el **fregadero de la Fig. 11.1**: el depósito venoso del que sale el retorno
  (Pms − PVC), puente a la circulación viva.
- *Fuerte en:* cifras exactas y fidelidad a la figura del libro. *Débil en:* menos «paisaje».

---

### 4. Otros modelos nuevos, de más a menos rentables para estudiar

| Orden | Modelo | Fichas | ¿Sale de uno que ya existe? | ¿Merece la pena? |
|---|---|---|---|---|
| 1 | **Pulmón con respirador** | ~19 | Nuevo; su primer trozo es el pulmón del ácido-base | Sí: es el mayor hueco de la app |
| 2 | **Capilar y oxígeno** | ~13 | Del filtro vivo (tubo con partículas que cruzan) y del gasto del motor | Sí, barato |
| 3 | **Vaso que sangra** (hemostasia y anticoagulantes) | ~11 | Patrón de los receptores animados | Sí |
| 4 | **Hepatocito vivo** | ~9 | Patrón de la célula de la nefrona | Sí |
| 5 | **Cráneo vivo** | ~9 | La cara de Glasgow (`caraGlasgow`) ya existe | Sí, pero Marino da pocas cifras |
| 6 | **Termostato** | ~7 | Patrón de los receptores | Sí, pequeño |
| 7 | **Ecógrafo de acceso vascular** | ~6 | El moteado del ecógrafo, otra anatomía | Solo si el usuario abre la «anatomía congelada» |
| 8 | **Unión neuromuscular** | ~4 | Copia directa de los receptores | Pequeño |
| 9 | Piezas Motion sueltas | 1-3 cada una | Receptores | Cuando toque su bloque |

#### 4.1 Pulmón con respirador (R6, R7) — decisión grande, maqueta M3

- **Qué se ve:** un racimo de alvéolos dentro de la caja torácica, unidos por bronquios a un tubo endotraqueal y al
  respirador. Abajo, las tres curvas vivas (presión, flujo y volumen), al estilo del Wiggers del motor. Los alvéolos se
  colorean: sobredistendidos (terracota, rayados), abiertos (salvia), colapsados que se abren y cierran (ciruela).
- **Mandos y frases vivas** (cifras de las fichas de Merino Neumología):
  - Modo VCV | PCV: «En volumen control manda el volumen y la presión sale; en presión control, al revés» (`neumo-vm-modos`).
  - Vt en mL/kg de peso predicho (con talla y sexo): «8 mL/kg al empezar; baja 1 mL/kg cada 2 h hasta 6» (Tabla 24.5).
  - PEEP: «La presión de conducción baja mientras se reclutan alvéolos y sube cuando se sobredistienden: ahí está la
    mejor PEEP (12 cmH₂O en el estudio de la Fig. 27.5)» (`neumo-vm-ajuste`).
  - Compliance (normal | SDRA rígido) y resistencia (normal | broncoespasmo).
  - FR e I:E: «No le da tiempo a vaciar: aparece PEEP oculta» (`neumo-peep-oculta`, Fig. 28.9).
  - Pausa inspiratoria: «Sin flujo, la presión cae del pico a la meseta: la meseta es la presión alveolar; ≤30 cmH₂O»
    (`neumo-vm-modos`).
  - Pausa espiratoria: mide la PEEP oculta.
  - Esfuerzo del paciente (SBT): f/Vt de 60-105 rpm/L en la lista de criterios (`neumo-weaning-extubacion`).
  - VNI y oxígeno nasal de alto flujo: este da solo 2-3 cmH₂O de PEEP y con la boca cerrada (`neumo-o2-sistemas`).
- **Con el corazón:** el pulmón pasa la presión intratorácica al motor (§1.1, punto 3): la PEEP oculta baja el gasto,
  la VNI descarga el VI y la VVS sale en cada latido.
- **Con el ácido-base:** la PaCO₂ que da la ventilación minuto entra en la escena de ácido-base (hipercapnia
  permisiva: si pH <7,15, FR a 35, Tabla 24.5; EPOC con PaCO₂ 80 → 73 de R6).
- **Fichas:** `neumo-asma-epoc-basicos`, `neumo-asma-agudo`, `neumo-epoc-vpp`, `neumo-sdra-diagnostico`,
  `neumo-sdra-ventilacion`, `neumo-sdra-no-ventilatorio` (prono), `neumo-o2-sistemas`, `neumo-vni-metodos`,
  `neumo-vni-uso`, `neumo-vm-modos`, `neumo-vm-ajuste`, `neumo-vias-artificiales`, `neumo-cuidado-barotrauma`,
  `neumo-peep-oculta`, `neumo-sbt`, `neumo-weaning-extubacion`, `mar-capnografia` (capnograma), `mar-respuesta-fluidos`
  (VVS), `neumo-o2-indicaciones`.
- **Imágenes reales:**
  - histología del SDRA (Fig. 24.1), Rx (24.2), TC (24.3) y microscopía del VILI (24.6), junto al alvéolo
    sobredistendido;
  - Rx del tubo (28.1), intubación selectiva (28.2), neumotórax (28.5, 28.7) y eco de la línea pleural (28.6) en el
    barotrauma.
  - Las curvas de las Figs. 27.1-27.5 y 28.9 se **recrean** vivas (son gráficos, CLAUDE §7.7).
- **Paciente posible:** pico ≤ ~60, meseta 10-40, PEEP oculta 0-15 cmH₂O, Vt 250-900 mL, FR 6-40.
- **Hueco a verificar:** la línea «Valores típicos 5-10 / 10-20 / 20-30 cmH₂O» de la ficha (¿de qué presión?) se
  coteja antes de usarla.

#### 4.2 Capilar y oxígeno (R2, R3)

- **Qué se ve:** un capilar por el que pasan hematíes (de `mar-transporte-o2`) que ceden O₂ a una célula con
  mitocondrias. Zoom a la mitocondria: glucólisis → piruvato → PDH → ciclo; la PDH se bloquea con la sepsis o sin
  tiamina y sale lactato aunque haya O₂ (Fig. 9.5).
- **Mandos:**
  - Hb («Con Hb a la mitad, la extracción sube hasta el techo del 50 %»);
  - SaO₂ y PaO₂ sobre la curva de disociación (Fig. 9.1);
  - el gasto, leído del motor del latido;
  - VO₂ (fiebre, sepsis);
  - «Transfundir 1 U» (sube el aporte; el consumo no cambia y cae la extracción, Fig. 12.4);
  - «Bolo de salino» (falsa caída del Hto, Fig. 12.1);
  - CO (SpO₂ normal con COHb, Fig. 53.1) y cianuro (no hay extracción: SvO₂ alta y lactato, Fig. 53.2).
- **Cifras:** extracción 0,2-0,3 que sube linealmente hasta ~0,5; SvO₂ 70-75 %; DO₂ y VO₂ indexados de
  `mar-extraccion-lactato` (con su nota de fidelidad: el texto y las tablas dan rangos distintos).
- **Fichas:** `mar-oximetria`, `mar-transporte-o2`, `mar-extraccion-lactato`, `mar-termodilucion` (parámetros
  derivados), `merino-anemia`, `merino-transfusion`, `mr-lactato-bicarbonato`, `mu-tiamina`, `mt-co`, `mt-cianuro`,
  `mc-definiciones`, `mc-shock-septico` (hipoxia citopática), `neumo-o2-indicaciones`.
- **Imágenes reales:** espectro de la Hb (7.1), pletismograma (7.2), Figs. 9.1-9.5 como lámina; las curvas se recrean.

#### 4.3 Vaso que sangra: hemostasia y anticoagulantes (R1, R3)

- **Qué se ve:** un vaso roto. Las plaquetas se adhieren (FvW) y se agregan (GPIIb/IIIa), y la fibrina teje el tapón.
  Debajo, la cascada con Xa, IIa y antitrombina.
- **Interruptor por fármaco:** HNF, HBPM, fondaparinux, apixabán/rivaroxabán, dabigatrán. Muestra qué paso bloquea
  (Fig. 5.2 real como lámina) y debajo la dosis con el riñón, de la calculadora que ya existe.
- **4 estados de un toque:** HIT (FP4-heparina + IgG), PTT (ADAMTS-13, FvW sin cortar), CID (consumo) y PFC como
  balanza (el INR baja mientras sube la antitrombina, R3). La Tabla 13.3 cambia en directo.
- **Reversión** en la HIC (Tabla 47.4).
- **Fichas:** `mar-tromboprofilaxis-farmacos`, `mar-tromboprofilaxis-escenarios`, `merino-trombocitopenia`,
  `merino-microangiopatias`, `merino-plaquetas-plasma`, `mc-hemorragico-fluidos` (TEG, Fig. 15.5 real),
  `mc-damage-control`, `mc-sca-tratamiento`, `neumo-ep-manejo`, `mn-ictus-complicaciones`, `mn-hic`.

#### 4.4 Hepatocito vivo (propuesta del profesor, que recoge el «hígado y amonio» de R10)

- **Por qué un hepatocito y no solo el amonio:** una sola célula hepática con sus vías, como la célula de la nefrona,
  explica a la vez:
  - el **ciclo de la urea**: NH₃ → urea; en el fallo, el amonio cruza al astrocito → glutamina → edema; amonio
    arterial >150 µmol/L (normal <60); lactulosa y rifaximina en el intestino; TRR (`ma-encefalopatia-hepatica`,
    `ma-fallo-hepatico-agudo`);
  - el **paracetamol**: conjugación, que se satura por encima de 4 g/día; un 10 % por el P450 a un metabolito tóxico
    que neutraliza el glutatión; lesión cuando el glutatión cae un 70 %; la NAC lo repone; el glutatión dado no entra
    en la célula (Fig. 52.2 real, `mt-paracetamol`, `mt-nac`);
  - la **cetogénesis** sin glucosa (Fig. 32.3) y el NADH del etanol que desvía a β-hidroxibutirato en la cetoacidosis
    alcohólica (`mr-cetoacidosis`);
  - la **alcohol deshidrogenasa** que convierte el metanol en fórmico y el etilenglicol en oxálico; el fomepizol la
    bloquea (Fig. 53.3, cristales de oxalato reales en la 53.4, `mt-alcoholes`);
  - el **lactato del Ringer**, que el hígado convierte en glucosa consumiendo H⁺ (`mar-cristaloides`), y el
    aclaramiento del lactato (hígado 60 %, `mr-lactato-bicarbonato`).
- **Fichas:** las 8-9 citadas, más `ma-varices` (hipertensión portal, solo el eje de entrada).

#### 4.5 Cráneo vivo (R11) — decisión grande

- **Qué se ve:** un cráneo en corte con cerebro, ventrículos, LCR y sangre; la PIC que sube con el hematoma, el edema o
  la hidrocefalia; la herniación; las pupilas (Tabla 45.4, con sus 7 imágenes reales `mar-tab45-4-pupilas-*.png`) y la
  cara de Glasgow.
- **Cifras de Marino:**
  - PPC = PAM − PIC (Ec. 47.1), con objetivo razonable de 50-70 mmHg en la HIC;
  - PIC <20 con drenajes; monitorizar la PIC con GCS ≤8, sangre ventricular o midriasis unilateral;
  - salino hipertónico con Na⁺ objetivo 145-155 en el edema del ictus;
  - la presión positiva puede subir la PIC.
- **Fichas:** `mn-coma`, `mn-muerte-encefalica`, `mn-hic`, `mn-hsa`, `mn-ictus-soporte`, `ma-fallo-hepatico-agudo`
  (edema por amonio), `mr-hiponatremia-tto`, `mr-hipernatremia`, `mar-cristaloides` (TCE: PIC <20 con osmolalidad <320).
- **Hueco:** Marino no da la curva presión-volumen intracraneal ni cifras de herniación. Lo que falte se toma del
  Manual UMI con un enlace cruzado (fuentes que no se mezclan) o se rotula «ilustrativo».

#### 4.6 Termostato (R10)

- **Qué se ve:** el hipotálamo con su **punto de ajuste** frente a la **temperatura real**; la producción y la pérdida
  de calor.
- **Cómo enseña:** la fiebre sube el punto de ajuste («regulación normal»); la hipertermia rompe la regulación (calor,
  fármacos); la hipotermia (Tabla 43.6, onda de Osborn real, Fig. 43.1). El termostato limita la variación diaria a
  ±0,6 °C (`ma-calor`).
- **Fichas:** `ma-calor`, `ma-hipertermia-farmacos`, `ma-hipotermia`, `ma-fiebre-basicos`, `ma-infecciones-nosocomiales`,
  `ma-antipireticos`, `mc-posresucitacion`.

#### 4.7 Ecógrafo de acceso vascular (R1)

- **Qué se ve:** cuello e ingle en eje corto y largo. La vena se aplasta al comprimir y la arteria no (Fig. 1.7); el
  color indica dirección (Fig. 1.8); la aguja es un punto o una línea (Fig. 1.6); perforación de la pared posterior
  40 % frente a 18 %.
- **Imágenes reales** (Figs. 1.6-1.9, 2.2, 2.3, todas ecografías) al lado de la simulación: «así se ve de verdad».
- **Fichas:** `mar-tipos-cateter`, `mar-eco-intraosea`, `mar-cvc-sitios`, `mar-cvc-complicaciones`, `mar-cateter-cuidados`,
  y el catéter vivo de Poiseuille con las cifras reales de la Fig. 1.1 (`mar-cateteres-flujo`).
- **Choca con «anatomía congelada»** del ecógrafo (`js/modules/eco/CLAUDE.md`): solo si el usuario lo abre.

#### 4.8 Unión neuromuscular (R11)

- **Qué se ve:** con el patrón de los receptores, la acetilcolina, su receptor y la acetilcolinesterasa.
- **Estados:**
  - miastenia (anticuerpos contra el receptor; el hielo mejora la transmisión, Fig. 46.1);
  - despolarizantes frente a no despolarizantes;
  - neostigmina (como máximo 70 µg/kg);
  - sugammadex (16 mg/kg tras la intubación, 4 mg/kg en el bloqueo profundo);
  - el magnesio y los demás fármacos que empeoran la miastenia.
- **Fichas:** `mn-miastenia`, `mn-gbs-pnc`, `mn-relajantes`, `mr-magnesio-reposicion`.

#### 4.9 Piezas pequeñas con Motion (cuando toque su bloque)

- Eje hipotálamo-hipófisis-tiroides y suprarrenal (`mu-suprarrenal`, `mu-tiroides`, `mu-hipotiroidismo`; Fig. 51.1).
- Intestino como defensa (`mar-microbioma`, `mu-enteral-indicaciones`).
- Biopelícula y las 4 vías de colonización del catéter (`mar-bacteriemia-cateter`, Figs. 3.2-3.3).
- Seldinger paso a paso (`mar-tipos-cateter`, Fig. 1.5).
- Cronómetro de ACLS con su ETCO₂ (`mc-paro-soporte`).
- Drenaje pleural de tres cámaras (`neumo-cuidado-barotrauma`).
- Embolia gaseosa con la inspiración (`mar-cvc-complicaciones`).

---

### 5. El orden de los bloques de estudio (unas 6 fichas cada uno)

Primero lo que más gana con un modelo que ya existe. Los bloques con ★ esperan a que el usuario elija en su maqueta.
Mientras tanto avanzan los demás.

| Bloque | Fichas | Modelo | Trabajo en el motor |
|---|---|---|---|
| B1 · FRA y riñón | `mr-fra-criterios`, `mr-fra-causas`, `mr-fra-nefrotoxicos`, `mr-fra-indices`, `mr-trr`, `ma-pbe-shr` | Nefrona, glomérulo, filtro | Pequeño: Pv, PIA × 2 y hepatorrenal en el glomérulo |
| B2 · Sodio y calcio | `mr-osmolalidad`, `mr-hipernatremia`, `mr-hiponatremia-dx`, `mr-hiponatremia-tto`, `mr-calcio-hipoca`, `mr-hipercalcemia` | Nefrona (SIADH, DI, deshidratación, hiperparatiroidismo, HHF ya existen) | Casi nada |
| B3 · Potasio, magnesio y fósforo | `mr-hipopotasemia`, `mr-hiperk-causas`, `mr-hiperk-tratamiento`, `mr-magnesio-deficit`, `mr-magnesio-reposicion`, `mr-fosforo` | Escena del potasio | Mg²⁺, fosfato, Figs. 36.2 y 36.4, realimentación |
| B4 · Shock | `mc-definiciones`, `mc-vasopresores`, `mc-hemorragico-clasificacion`, `mc-cardiogenico-fisio`, `mc-shock-septico`, `mc-anafilaxia` | Circulación viva + receptores | Gravedad que llegue a shock (con pruebas) |
| B5 · Retorno venoso y monitorización | `mar-retorno-venoso`, `mar-respuesta-fluidos`, `mar-cateter-ap`, `mar-termodilucion`, `mar-capnografia`, `mc-soporte-mecanico` | Circulación viva | Guyton, piernas arriba, catéter que avanza, ETCO₂, balón de contrapulsación |
| B6 · El corazón enfermo | `mc-ic-tipos`, `mc-ic-manejo`, `mc-cardiogenico-farmaco`, `mc-sca-diagnostico`, `mc-diseccion-aortica`, `mc-fa-frecuencia` | Circulación viva | Pared akinética, FA, chorro en color |
| B7 ★ · Ácido-base | `mr-acidobase-analisis`, `mr-acidobase-gaps`, `mr-lactato-bicarbonato`, `mr-cetoacidosis`, `mr-alcalosis-mecanismos`, `mr-alcalosis-tratamiento` (+ `fisio-acidobase-*` de PIF) | Ácido-base vivo (M1) | Pendrina, estados nuevos, pulmón, balanza |
| B8 ★ · Fluidos | `mar-cristaloides`, `mar-coloides`, `mc-hemorragico-fluidos`, `mc-damage-control` (+ repaso de `mar-retorno-venoso`) | Río y mar (M2) | Todo nuevo |
| B9 ★ · Ventilación I | `neumo-vm-modos`, `neumo-vm-ajuste`, `neumo-peep-oculta`, `neumo-sdra-ventilacion`, `neumo-asma-agudo`, `neumo-epoc-vpp` | Pulmón (M3) | Todo nuevo |
| B10 ★ · Ventilación II | `neumo-vni-metodos`, `neumo-vni-uso`, `neumo-o2-sistemas`, `neumo-sbt`, `neumo-weaning-extubacion`, `neumo-cuidado-barotrauma` | Pulmón | Esfuerzo del paciente, VNI |
| B11 · Sangre y oxígeno | `mar-oximetria`, `mar-transporte-o2`, `mar-extraccion-lactato`, `merino-anemia`, `merino-transfusion`, `mt-co` (+ `mt-cianuro`) | Capilar y oxígeno (M4) | Nuevo, sobre el filtro vivo |
| B12 · Hemostasia | `mar-tromboprofilaxis-farmacos`, `mar-tromboprofilaxis-escenarios`, `merino-trombocitopenia`, `merino-microangiopatias`, `merino-plaquetas-plasma`, `mn-ictus-complicaciones` | Vaso que sangra (M5) | Nuevo |
| B13 · Hígado | `ma-fallo-hepatico-agudo`, `ma-encefalopatia-hepatica`, `ma-varices`, `mt-paracetamol`, `mt-nac`, `mt-alcoholes` | Hepatocito (M6) | Nuevo |
| B14 · Cerebro | `mn-consciencia`, `mn-coma`, `mn-muerte-encefalica`, `mn-hic`, `mn-hsa`, `mn-ictus-soporte` | Cráneo vivo (M7) | Nuevo |
| B15 · Temperatura | `ma-calor`, `ma-hipertermia-farmacos`, `ma-hipotermia`, `ma-fiebre-basicos`, `ma-antipireticos`, `mc-posresucitacion` | Termostato | Pieza Motion |
| B16 · Acceso vascular | `mar-cateteres-flujo`, `mar-tipos-cateter`, `mar-eco-intraosea`, `mar-cvc-sitios`, `mar-cvc-complicaciones`, `mar-cateter-cuidados` | Ecógrafo vascular (si se aprueba) | Anatomía nueva |
| B17 · Músculo y nervio | `mn-miastenia`, `mn-gbs-pnc`, `mn-relajantes`, `mn-convulsiones`, `mn-estado-epileptico`, `mn-delirio` | Unión neuromuscular + consulta | Pieza Motion |
| B18-B23 · Consulta | ver §6 | Texto, preguntas y casos | — |

B1-B3 van primero porque su modelo está casi listo y R8-R9 ya pidieron exactamente eso. B4 iría antes si se arregla
primero el motor (sus pruebas tardan ~3 min y tocan el corazón de la app).

---

### 6. Lo que no merece modelo (consulta: texto para estudiar, preguntas y casos)

Son tablas de fármacos, gérmenes, pautas o criterios. Un modelo no explicaría más que una buena tabla, un asistente
Sí/No o un caso clínico:
- **Prácticas e infecciones:** `mar-microbioma` (salvo la pieza pequeña del intestino), `mar-ulcera-estres` (su
  herramienta de riesgo ya existe), `mar-bacteriemia-cateter`, `ma-colecistitis`, `ma-cdifficile`,
  `ma-infeccion-abdominal`, `ma-itu-sonda`, `ma-candiduria`, `ma-infecciones-nosocomiales` (el semáforo antibiótico
  de la Tabla 41.3 basta), `neumo-nav-prevencion`, `neumo-nav-diagnostico`, `neumo-derrame-antimicrobiano`.
- **Analgesia, sedación y neuro de protocolo:** `mar-analgesia`, `mar-sedacion` (la escalera RASS ya existe),
  `mn-delirio`, `mn-abstinencia`, `mn-convulsiones`, `mn-estado-epileptico`, `mn-ictus-complicaciones` (salvo la
  reversión del vaso que sangra).
- **Corazón de fármacos y algoritmos:** `mc-fa-cardioversion`, `mc-otras-taqui`, `mc-sca-tratamiento`,
  `mc-paro-soporte` (salvo el cronómetro), `mc-shock-toxico`, `mc-inflamacion-ros` (una pieza Motion de la cascada si
  sobra tiempo).
- **Oxígeno y vía aérea:** `neumo-o2-toxicidad`, `neumo-vias-artificiales` (salvo la Rx del tubo en el pulmón).
- **Nutrición:** `mu-gasto-energetico`, `mu-sustratos`, `mu-vitaminas-oligo`, `mu-enteral-indicaciones`, `mu-formulas`,
  `mu-pauta-enteral`, `mu-complicaciones-enteral`, `mu-npt-soluciones`, `mu-npt-pauta`.
- **Tóxicos y apéndices:** `mt-opioides`, `mt-bzd-betabloq`, `mt-unidades`, `mt-referencias`, `mt-cuerpo`.

Ojo: estas fichas sí ganan mucho con **casos clínicos** (REGLAS §8). Varios de los casos de R3-R13 son de aquí: PBE →
SHR, el alcohólico del día 1 al 4, el humo con SpO₂ normal, el salicilato que acaba en diálisis.

---

### 7. Maquetas que hay que hacer (para que el usuario elija)

**Reglas comunes de todas las maquetas:**
- Página HTML suelta en `autonomo/maquetas/` (o donde diga el director), con el aspecto de la app como el modelo de
  preguntas: copia los tokens de `css/variables.css` en `:root`, Georgia, fondo oscuro.
- Sin dependencias, salvo Motion desde `js/vendor/motion.js` (import relativo). Con «reducir movimiento», el estado
  final sin animar.
- Diseñada para 390 px y probada a 360 px: nada desborda, toques de 44 px como mínimo.
- Rótulo de origen en cada cifra (`ficha` con su id y figura, `fisiología general` o `ilustrativo`). Un aviso arriba:
  «Maqueta para elegir: no es la app».
- El mismo caso en todas las direcciones de una misma maqueta, para comparar solo lo visual.
- Al final de la página, la pregunta al usuario con botones de elección: A/B/C y «mezcla».
- Las cifras del caso las da esta especificación; ninguna se inventa fuera de ella.

#### M1 · Ácido-base vivo: 3 direcciones (petición estrella; primero)

- **Archivo:** `marino-acidobase.html`, con un selector arriba «A · Lámina dorada | B · Campo oscuro | C · Móvil».
  Solo una dirección corre a la vez.
- **El caso (gasometrías coherentes con la Ec. 31.2; medicina de las fichas; números del caso):**

| Paso | Momento | Na | Cl | HCO₃⁻ | HA | PaCO₂ | pH | Lo que se ve |
|---|---|---|---|---|---|---|---|---|
| 0 | Normal | 140 | 104 | 24 | 12 | 40 | 7,40 | Balanza equilibrada, pulmón en reposo, pendrina casi apagada |
| 1 | CAD, primeros minutos | 140 | 104 | 12 | 24 | 40 | 7,10 | Cetoácidos (ocre) desalojan HCO₃⁻; el hueco crece; «instante teórico: aún sin compensar» |
| 2 | CAD a las 2 h | 140 | 104 | 12 | 24 | 26 | 7,28 | El pulmón sopla CO₂ (PaCO₂ esperada 40 − 1,2 × 12 = 25,6); delta 1; el punto baja por la línea roja |
| 3 | Tras salino a chorro | 140 | 112 | 12 | 16 | 26 | 7,28 | Las cetonas bajan, pero el Cl⁻ ocupa el sitio: delta 0,33; «parece que la CAD no se resuelve» |
| 3b | Con Ringer en su lugar | 140 | 104 | 20 | 16 | 35 | 7,38 | Delta 1; el HCO₃⁻ vuelve |
| 4 | Otro paciente: vómitos | 140 | 88 | 40 | 12 | 51 | 7,51 | Alcalosis; PaCO₂ esperada 51 (ejemplo de la ficha); Cl⁻ urinario <20; pendrina apagada por falta de cloro |
| 5 | Salino + ClK | — | ↑ | ↓ | 12 | ↓ | ↓ | Llega Cl⁻: la pendrina se enciende y sale HCO₃⁻ por la orina; déficit de Cl⁻ para 70 kg: 0,2 × 70 × 12 = 168 mEq ≈ 1,1 L |

  - El Cl⁻ normal de 104 se deriva de HA 12 con Na 140 y HCO₃⁻ 24. Los pasos 1-3b son del caso.
  - El pH de cada paso sale de la Ec. 31.2, calculado en la página, no escrito.
  - El paso 5 se anima como tendencia: sin cifras finales, porque la ficha no da la curva de corrección.
- **Pantalla (las tres direcciones, de arriba abajo):**
  1. El pH grande con su palabra (acidemia, alcalemia).
  2. Los órganos (pulmón, sangre con la balanza, riñón con la célula del colector de 3 células).
  3. El mapa de la gasometría con estela.
  4. Fila de pasos 0-5 con «Siguiente», y el reloj «minutos · horas · días».
  5. Frase viva.
  6. Mando «Albúmina» (4,5 → 2 g/dL), que aplicado al paso 2 muestra el hiato escondido y su corrección.
  7. Plegable «Hiato osmolal»: medida 320 frente a calculada 290 → 30; «sal que el cálculo no ve: piensa en metanol o
     etilenglicol» (Ec. 31.17, `mt-alcoholes`). El 320 es del caso.
- **Animaciones mínimas que deben verse:** el HCO₃⁻ que se convierte en CO₂ y sale por el pulmón; el punto del mapa
  que se mueve primero por el eje del trastorno y luego por la línea de compensación; la pendrina que se apaga y se
  enciende; la balanza (o columnas, o móvil) que se reequilibra.
- **Qué elige el usuario:** dirección A, B, C o mezcla; y si el riñón entra con la foto real del corte (como la
  nefrona viva) o dibujado en el estilo de la dirección.

#### M2 · El agua del cuerpo: 2 direcciones

- **Archivo:** `marino-agua.html`, con el selector «1 · Estuario de noche | 2 · Corte del terreno».
- **Datos:** Tabla 10.1 (varón de 75 kg: 29/13/3 L) y Fig. 10.1 (las cuatro filas de §3.1). Déficit del 15 % = 450 mL y
  2,25 L de Ringer (Tabla 11.1 y su ejemplo). Albúmina al 25 %: expande el plasma 3-4 veces su volumen, sacando agua
  del intersticio (Tabla 10.3).
- **Interacción:** chips de fluido; botón «Infundir 1 L» (o 250 mL en el 7,5 %); «Hemorragia del 15 %»; «Reponer con
  2,25 L de Ringer»; interruptor «Albúmina baja / permeabilidad alta» (ilustrativo, edema que desborda).
  Mareógrafos o reglas con los mL de cada compartimento y frase viva.
- **Variante de color:** las dos direcciones se ven con el agua solo de tokens y con el «agua» `#8fb8d8` del filtro
  vivo. Un interruptor en la página permite comparar.
- **Qué elige el usuario:** la dirección 1 o 2; el color del agua; si el fregadero de la Fig. 11.1 entra en este mundo.

#### M3 · Pulmón con respirador: 1 maqueta, dos aspectos del alvéolo

- **Archivo:** `marino-pulmon.html`.
- **Pantalla:** el racimo de alvéolos con el tubo y el respirador; tres curvas vivas (presión, flujo, volumen); mandos
  (VCV | PCV, Vt en mL/kg, PEEP, FR, compliance normal | SDRA, resistencia normal | broncoespasmo, pausa inspiratoria);
  lectura de pico, meseta y PEEP total con frase viva.
- **Tres estados que debe enseñar:**
  - SDRA con 6 mL/kg, PEEP 10, meseta ≤30;
  - broncoespasmo con FR alta y PEEP oculta en la curva de flujo (que no llega a cero);
  - la PEEP que sobredistiende (alvéolos terracota).
- **Un recuadro** «el corazón lo nota»: con la PEEP oculta baja un indicador de gasto (ilustrativo; en la app lo dará
  el motor).
- **Interruptor de aspecto:** «alvéolos realistas» (racimos con capilares, estilo de la histología de la Fig. 24.1)
  frente a «esquema» (globos y muelles).
- **Qué elige el usuario:** construirlo o no (decisión grande), el aspecto y si el pulmón del ácido-base debe ser el
  mismo dibujo.

#### M4-M7 · Modelos de la segunda ola (una maqueta corta cada uno, cuando el usuario quiera)

- **M4 · Capilar y oxígeno.** Un capilar con hematíes y una célula. Mandos: Hb (15 → 7,5), SaO₂ (98 → 85), gasto
  (5 → 2,5, ilustrativo) y «Transfundir». Se ve la extracción del 25 % al 50 % y el lactato cuando se cruza el techo.
  Fig. 9.3 viva al lado.
- **M5 · Vaso que sangra.** El vaso roto, las plaquetas, la fibrina y 5 chips de fármaco que apagan su paso; los 4
  estados HIT, PTT, CID y PFC.
- **M6 · Hepatocito vivo.** La célula con 4 vías encendibles (urea, paracetamol, cetonas, alcoholes) y el astrocito que
  se hincha con el amonio.
- **M7 · Cráneo vivo.** Cráneo en corte con mando de volumen del hematoma; PIC, PAM y PPC (Ec. 47.1, objetivo 50-70);
  pupilas reales de la Tabla 45.4; la cara de Glasgow que ya existe.

El termostato, la unión neuromuscular y las piezas pequeñas no necesitan maqueta: siguen el patrón aprobado de los
receptores animados. Basta con que el usuario apruebe la lista.

---

### 8. Huecos y hallazgos (no se rellenan: se anotan)

1. **Ejemplos del cap. 31 incoherentes con la Ec. 31.2** (§2.2): comprobado en el PDF. La ficha necesita una nota de
   fidelidad y los simuladores, gasometrías coherentes.
2. **Escenarios del ecógrafo que no llegan a shock**: «Derrame pericárdico» da PA 106/78, GC 3,9 y PVC 7 (captura a
   390 px). Coincide con R4.
3. **No hay azul en los tokens**: el agua y la urea ya usan colores fuera de ellos (`filtro-vivo.js`,
   `nefrona-viva.js`). Lo decide el usuario (M2).
4. **Ventilación minuto en ácido-base**: Marino da la PaCO₂ esperada, no la ventilación que la produce. El ritmo del
   pulmón es ilustrativo.
5. **Cráneo**: sin curva presión-volumen ni cifras de herniación en Marino. Se enlaza al Manual UMI o se rotula.
6. **Edema por hipoalbuminemia y permeabilidad**: la ficha lo explica sin cifras. Es ilustrativo.
7. **Corrección de la alcalosis con salino**: la ficha da el déficit y el ritmo, no la curva de bajada del HCO₃⁻. Se
   anima como tendencia.
8. **La línea «Valores típicos 5-10 / 10-20 / 20-30 cmH₂O»** de Merino Neumología: hay que comprobar a qué presión se
   refiere antes de ponerla en el pulmón.
9. **El simulador de fluidos de hoy son barras** (`mar-cristaloides`), justo lo que el usuario no quiere. Lo sustituye
   M2.


## Ideas del usuario (mandan sobre las demás)

- **Fluidos como agua de río y agua de mar** (14/10/2026, sobre los caps. 10-11): un símil visual para la vista
  Visual de los fluidos. Recrear el agua (el mar, un río, lo que funcione) para que se **vea** adónde va cada
  fluido. El usuario pide expresamente **un buen trabajo artístico** del profesor: nada de barras.
  Para que el profesor lo desarrolle (propuesta del director, a confirmar con una maqueta):
  - Los tres compartimentos de la Tabla 10.1 (plasma, intersticio y células) como masas de agua conectadas: un río
    (el plasma, que corre), una marisma o estuario (el intersticio) y el mar o un lago interior (las células).
  - Cada fluido «desemboca» y se reparte como en la Fig. 10.1:
    - el **glucosado 5 %** es agua dulce que acaba repartida por todo, sobre todo en las células;
    - el **salino 0,9 %** se queda en el río y la marisma (y arrastra un poco de agua de las células, pág. 5);
    - el **salino al 7,5 %**, como agua muy salada, tira del agua de las células hacia fuera (×2,1 en el plasma,
      ×4,9 en el extracelular);
    - la **albúmina** retiene el agua en el río.
  - La osmolalidad, como la salinidad del agua; el edema de la sobrecarga, como la marisma que se desborda.
  - El símil es **ilustrativo** y lo dice en pantalla; las cifras que muestre, las de la Fig. 10.1 y la Tabla 10.1.
  - Se apoya en la idea de los revisores de R2 (cuerpo con compartimentos vivos) y la sustituye en lo visual.

- **Ácido-base: la mejor herramienta visual de la app** (14/10/2026, sobre los caps. 31-33). El usuario pide que
  en la fase 2 la parte de ácido-base le **sorprenda infinitamente a nivel artístico**: que sea de las mejores
  herramientas visuales para estudiar de toda la app.
  - **Un proyecto propio**, no una ficha más. Integra el **riñón que ya funciona en PIF → Nefrología** (nefrona viva,
    glomérulo vivo, sus estados de ATR, diarrea, diuréticos, alcalosis) y lo **mejora con el contenido de Marino**:
    las reglas de la gasometría, los hiatos y el delta, el lactato, la cetoacidosis y la alcalosis por cloro.
  - Aprovecha las herramientas de la propia app antes de inventar otras (REGLAS §7.8: un modelo grande, muchas
    fichas). Lo que le falte al riñón para Marino (pendrina del colector, compensación respiratoria, el pulmón que
    sopla CO₂) se construye sobre él.
  - Ideas de los revisores que encajan aquí (R8): el mapa de la gasometría que se mueve con la compensación, la
    balanza de aniones (HCO₃⁻ que se vacía, Cl⁻ o lactato que llena) y los casos de gasometrías encadenadas.
  - Decisión grande: el profesor propone, el usuario elige con una **maqueta visual** antes de construir.

- **Decisión del usuario sobre las maquetas** (17/10/2026): «estoy flipando con las maquetas». No elige una: quiere
  **coger lo mejor de cada maqueta de ácido-base (A, B, C) y unirla en una más potente**, como apuntaba el profesor.
  El río y el mar le parece «sublime». Agua en **crema y oro** (solo tokens). Antes de seguir, el profesor completa
  las maquetas y les añade la **parte de estudio**: preguntas, casos clínicos distintos y explicaciones de
  conceptos, aprovechando que son interactivas.

## Ideas de los revisores, por bloque

*(Se añaden aquí tras cada revisión.)*

### R1 · Caps. 1-6 (acceso vascular, prácticas habituales, tromboprofilaxis, analgesia y sedación) · 2026-10-14

Coinciden los tres revisores (fuente, código y móvil):
- **Ecógrafo de acceso vascular** (reutilizar el ecógrafo y el motor del atlas): cuello e ingle en eje corto y largo;
  la vena se aplasta al comprimir y la arteria no (Fig. 1.7); el color del Doppler indica dirección, no «arteria o
  vena» (Fig. 1.8); la aguja como punto (eje corto) o línea (eje largo); pared posterior perforada 40 % frente a 18 %;
  la rotación de la cabeza >40° monta la vena sobre la carótida. El Seldinger, paso a paso con Motion. Explicaría las
  fichas I-V de una vez (hoy son fotos fijas dentro de acordeones).
- **Un catéter vivo (Hagen-Poiseuille)**: un tubo con el radio de 16-18-20 G y la longitud de periférico, PICC o
  central, con un flujo proporcional a las cifras **reales** de la Fig. 1.1 (no al r⁴/L puro) y la bolsa que sube de
  68 a 100 cm. Serviría para flujo, tipos de catéter, CVC y shock hemorrágico. La figura de Poiseuille actual se satura
  y su frase choca con la Fig. 1.1.
- **Tablero de coagulación con Motion (Fig. 5.2)**: cascada con Xa, IIa, antitrombina y fibrina; un interruptor por
  fármaco (HNF, HBPM, fondaparinux, apixabán/rivaroxabán, dabigatrán) muestra qué paso bloquea, con la dosis y el
  riñón de la calculadora debajo. Reutilizable en la HIT y en la anticoagulación de otras especialidades.
- **Mecanismos paso a paso con Motion** (como los receptores): las cuatro vías de colonización del catéter y la
  biopelícula; el «motor intestinal» del fallo multiorgánico; la embolia gaseosa con cada inspiración (Trendelenburg
  frente a decúbito lateral izquierdo); un paciente que recorre la RASS y la escalera BPS → opioide → sedante.
- **La punta del catéter arrastrable sobre una Rx** con la carina como guía (Fig. 2.6).
- Para la fase de estudio: varios gráficos y esquemas del libro (Figs. 1.1, 3.2, 4.1-4.6, 5.1, 5.2, 6.1) están como
  lámina escaneada; deberían recrearse (CLAUDE.md §7.7). Primeras pantallas con la figura muy abajo (Forssmann antes
  de la figura en la ficha I; figuras a 1.700-3.200 px en otras) y párrafos de 7-10 líneas en sedación y escenarios.

### R2 · Caps. 7-11 (oximetría y capnografía, catéter de AP, oxigenación, fluidos) · 2026-10-14

Coinciden los tres revisores:
- **Motor del latido con la curva de retorno venoso de Guyton cruzada con la función cardíaca (Frank-Starling)**: con
  Pms, PVC y resistencia venosa, el bolo y la elevación pasiva de piernas mueven la curva; la PAD **sale del corazón**
  en vez de ser un mando suelto (así desaparece el fallo del simulador de retorno). Se ve por qué subir la PVC no es el
  objetivo, y la VVS y la EPP aparecen en el volumen sistólico de cada latido. La elevación de piernas se mediría con
  el VTI subaórtico en el ecógrafo (respuesta si VS ≥10 %).
- **El catéter de arteria pulmonar avanzando por el corazón** con Motion (AD → VD → AP → enclavamiento), con la onda
  de presión en vivo, el globo que se infla y la onda v de la insuficiencia mitral.
- **Un cuerpo con compartimentos vivos** (al estilo de la nefrona viva): plasma, intersticio y células de un adulto
  de 75 kg (Tabla 10.1). Cada fluido (salino, glucosado, albúmina 5 % y 25 %, salino 7,5 %) mueve el agua entre ellos
  con límites reales y se ve el edema de la sobrecarga. Sustituye al simulador de barras.
- **La cascada del O₂ animada**: Hb → CaO₂ → DO₂ → extracción → SvO₂ sobre la curva de disociación, con anemia frente
  a hipoxemia lado a lado; al cruzar el aporte crítico el VO₂ cae y se abre la mitocondria (Fig. 9.5): glucólisis →
  piruvato → PDH bloqueada por la sepsis o el déficit de tiamina → lactato con O₂. Cierra con un capnograma animado
  con espacio muerto.
- **Flujo de decisión de la respuesta a fluidos**: ScvO₂ + gap de PCO₂ + EPP/VVS.

### R3 · Caps. 12-13 (Merino HEMATO: anemia, transfusión, plaquetas y plasma) · 2026-10-14

- **Modelo «sangre y oxígeno»** (fichas 1 y 2), con el hematocrito y la volemia como mandos:
  - la cadena viscosidad → gasto en el motor del latido → DO₂ → extracción hasta el techo del 50 % → lactato, que es
    la Fig. 12.3 viva (hoy no está en la app);
  - «transfundir 1 unidad»: sube el DO₂, el VO₂ queda plano y cae la extracción (Fig. 12.4);
  - «bolo de salino»: la caída falsa del Hto (Fig. 12.1).
- **Hemostasia animada con Motion**: de la lesión al tapón (GPIIb/IIIa, FvW, fibrina), con 4 estados de un clic:
  - HIT (FP4-heparina + IgG);
  - PTT (ADAMTS-13 y el FvW sin cortar);
  - CID (factor tisular y consumo);
  - PFC, como balanza pro/anticoagulante: el INR baja mientras la antitrombina sube.
  
  La Tabla 13.3 cambia en directo. Encaja con el tablero de coagulación de R1 (anticoagulantes): podría ser el mismo
  modelo.
- **Ecógrafo para TRALI o TACO**: el TACO con VCI plétora, líneas B y corazón dilatado; el TRALI con líneas B, VCI y
  corazón normales.
- **Asistentes Sí/No**: «¿TRALI o TACO?» y 4Ts → ELISA → anticoagular o reiniciar la heparina.
- **Casos clínicos**:
  - HIT posoperatoria cardíaca: la 4Ts sube con una trombosis;
  - «encuentra el error»: warfarina en la HIT aguda o plaquetas en una PTT;
  - «piensa y destapa»: «INR 1,8 → 1,4 tras el PFC: ¿coagula mejor?».

### R4 · Caps. 14-17 (Merino Cardiología: shock) · 2026-10-14

- **Un solo «modelo de shock»** sobre el motor del latido y el eco, con 4 mandos (volumen, contractilidad,
  resistencias, taponamiento). Se ven PA, GC, PVC, RVS y lactato con frase viva: la Tabla 14.1 en directo. Cada ficha
  (I, III, VI, X, XII) lo abre en su estado. Antes hay que arreglar los escenarios del eco, que hoy no llegan a shock:
  fallo `ees=0.9`, derrame `liquidoPeri=260`, vasoplejía con un GC por debajo del basal.
- **Motion paso a paso**, como los receptores:
  - la Tabla 15.1 como barra de sangre que se vacía de la Clase I a la IV;
  - la cascada de neutrófilos y ROS (Fig. 17.1);
  - el IABP inflando y desinflando con su onda (sustituye a la imagen en inglés).
- **Casos**: shock hemorrágico que evoluciona a mixto; anafilaxia con betabloqueante.

### R5 · Caps. 18-21 (Merino Cardiología: IC, arritmias, SCA, paro) · 2026-10-14

- **Motor del latido + eco**: IC con FE reducida frente a conservada; taponamiento; SCA con zona akinética; disección
  con flap en la supraesternal.
- **Fig. 19.5 viva con Motion**: la FC de la FA bajando con diltiazem, amiodarona y digoxina.
- **ACLS paso a paso**: cronómetro de ciclos con choque, epinefrina y amiodarona; ETCO₂ de la Fig. 21.4 que se separa
  entre RCE y no RCE.
- **Casos**: FA con WPW y «encuentra el error» (diltiazem); paro con ETCO₂ que sube → RCE → TTM.
### R6 · Caps. 22-26 (Merino Neumología: EP, asma/EPOC, SDRA, O₂, VNI) · 2026-10-14

- **Pulmón con respirador / «presión positiva en el tórax»** (Vt/PBW, FR, PEEP, I:E, resistencia y compliance;
  curvas de presión, flujo y volumen): auto-PEEP, VILI y precarga/poscarga de la VNI. Lo piden los tres revisores y
  serviría también para los caps. 27-30. Es una decisión grande (maqueta para el usuario).
- **EP con el eco `tep`** en el estado del paciente de alto riesgo.
- **Casos**: EP intermedia-alta; EPOC en VNI con PaCO₂ 80 → 73; asma con PaCO₂ «normal»; SDRA con PBW y prono.
- **«Encuentra el error»**: Vt con peso real; O₂ al 100 % en el retenedor; 10 % frente a 10 mmHg; wedge normal que
  «descarta» edema.

### R7 · Caps. 27-30 (Merino Neumología: ventilación, NAV, weaning) · 2026-10-14

- **Pulmón con respirador**, el mismo que en R6:
  - curvas vivas de presión, flujo y volumen;
  - VCV | PCV y pausa inspiratoria (Figs. 27.1-27.2);
  - PEEP con compliance, presión de conducción y la mejor PEEP (Fig. 27.5), y la DO₂ (Fig. 27.6);
  - FR e I:E con la PEEP oculta (Figs. 27.3 y 28.9);
  - la SBT con el RSBI.

  Explicaría los caps. 23-30.
- **Piezas pequeñas**: drenaje pleural de tres cámaras con Motion; Rx con tubo ET arrastrable hasta la carina;
  neumotórax a tensión.
- **Asistentes Sí/No**: NAV de bajo o alto riesgo → régimen (Tabla 29.6); ¿listo para el SBT? → predictores →
  extubar → fuga → esteroides y VNI.
- **Casos**:
  - weaning el día 7: SBT fallido con la SvO₂ que cae; fuga <110 mL;
  - «encuentra el error»: clorhexidina + SOD;
  - «piensa y destapa»: ¿ansiedad o fracaso en el SBT?; extubar sube el trabajo respiratorio (Fig. 30.2).

### R8 · Caps. 31-35 (Marino Renal: ácido-base, CAD, alcalosis, FRA, sodio) · 2026-10-14

- **Ácido-base vivo**: el mapa de la gasometría que se mueve con la compensación respiratoria y renal, y el pH a la
  par. Caso de 3 gasometrías encadenadas. Balanza de aniones (HCO₃⁻ que se vacía y Cl⁻ o lactato que llena).
- **`mr-trr` con el filtro vivo** (`filtro-vivo.js`), que ya existe, y **`mr-fra-indices` con la nefrona viva**
  (prerrenal, NTA, obstrucción) junto a los índices urinarios.
- **Cap. 35 con la nefrona viva**: SIADH, DI, deshidratación e hiperglucemia ya existen como estados.
- **Glomérulo vivo**: faltan la presión venosa renal alta (congestión) y la PIA (Pā − 2·PIA).
- **Casos**:
  - CAD → salino → delta, con K⁺ 3,1 al ingreso;
  - hiponatremia con salino al 3 % → diuresis acuosa → sobrecorrección → desmopresina;
  - FRA por sepsis con furosemida (la EFNa engaña, la EFU decide).

### R9 · Caps. 36-38 (Marino Renal: potasio, magnesio, calcio y fósforo) · 2026-10-15

- **Potasio y ECG en escalera**: el simulador de hiperpotasemia de Nefrología con la Fig. 36.4 y el aviso «el ECG no
  predice el K⁺». La Fig. 36.2 interactiva (déficit frente a K⁺, con el tramo plano).
- **Cadena del magnesio con Motion**: el Mg bajo arrastra al K⁺ y al Ca²⁺; la prueba de retención animada (24 mmol
  infundidos, orina frente a retenido). Con la nefrona viva en la reabsorción de Mg en el asa.
- **Fig. 38.1 viva**: mando de albúmina (baja el total, no el iónico) y de pH (la alcalosis baja el iónico). Fósforo:
  la glucosa y la insulina lo meten en la célula (realimentación).
- **Casos**: hipoK por furosemida con Mg bajo; hiperK ficticia por hemólisis; transfusión masiva con citrato.
### R10 · Caps. 39-44 (Marino Abdomen: hígado, páncreas, infecciones, temperatura) · 2026-10-15

- **Hígado y amonio vivos**, con el patrón de la nefrona: intestino → hígado (ciclo de la urea) → astrocito
  (glutamina, edema). Mandos: función hepática, lactulosa, rifaximina y CVVH. Frase viva: amonio, West Haven y
  hemofiltración. Fichas I-IV; el SHR y la PBE comparten el eje esplácnico → riñón.
- **Termostato**: punto de ajuste frente a temperatura real, para fiebre frente a hipertermia, golpe de calor,
  hipertermias por fármacos, hipotermia y antipiréticos (fichas XII-XVII). Sería el equivalente de los receptores
  animados.
- **Semáforo antibiótico** (Tabla 41.3) ampliado a la PBE, la colecistitis (penetración en bilis), la ITU de sonda y
  la candiduria.
- **Casos**: cirrótico con varices → PBE → SHR; pancreatitis del día 1 al 7; fiebre en la posparada.
- **«Encuentra el error»**: ceftriaxona + metronidazol en el shock; bajar la fiebre de rutina.
### R11 · Caps. 45-47 (Marino Neuro: consciencia, movimiento, ictus) · 2026-10-15

- **Cráneo vivo** (decisión grande, con maqueta): PIC, PPC = PAM − PIC, hematoma, edema, hidrocefalia, herniación y
  pupilas. Serviría para HIC, HSA, edema del ictus, coma y muerte encefálica. La cara de Glasgow ya existe y podría
  ser su cara.
- **Unión neuromuscular con Motion**, como los receptores: miastenia, bloqueo y reversión, GBS frente a miastenia.
- **Ecógrafo**: burbujas del FOP en el apical de 4 cámaras.
- **Casos**:
  - el alcohólico del día 1 al 4;
  - la HIC con warfarina o con apixabán (andexanet);
  - la crisis miasténica.
### R12 · Caps. 48-51 (Marino Nutrición y endocrino) · 2026-10-15

- **El intestino como defensa**: la mucosa con y sin nutrientes en la luz (trofismo, IgA, translocación) frente a la
  NPT.
- **Realimentación con la escena del potasio** (`potasio-escena.js`): la glucosa y la insulina meten K⁺, fosfato y
  Mg²⁺ en la célula, y la tiamina se agota.
- **Eje hipotálamo-hipófisis-tiroides y suprarrenal** con T4 libre y TSH como mandos (Tabla 51.2, Fig. 51.1).
- **Casos**:
  - el alcohólico desnutrido con NPT y noradrenalina;
  - el coma mixedematoso;
  - la tormenta tiroidea en un asmático.
### R13 · Caps. 52-53 y apéndices (Marino Tóxicos) · 2026-10-15

- **Casos de la escalera tóxica**:
  - humo con SpO₂ normal y lactato alto → cianuro;
  - metanol frente a etilenglicol con el hiato osmolal;
  - paracetamol con dosis repetidas;
  - salicilato que acaba en hemodiálisis.
- **Hiato osmolal vivo** en la ficha de alcoholes, sobre la gasometría del cap. 31: encaja con el proyecto de
  ácido-base del usuario.
- **«Encuentra el error»**: pulsioxímetro normal descarta CO; nomograma con dosis repetidas; flumazenil con
  convulsiones; tiosulfato en la insuficiencia renal.
