# Plan de estudio · b6a · grupo 6D «El cráneo que sangra y se hincha» (Marino cap. 47) — profesor, modo diseñar, 01/11/2026

Fuente **N** = `docs/marino-2024-neurologia-caps45-47.pdf` (p. = página del PDF = `#page=N`; cotejado con `pdftotext` página a página, p. 34-48).
Ficha: `js/modules/libros/marino-neuro.html` (`mn-ictus-soporte` l. 908, `mn-ictus-complicaciones` l. 977, `mn-hic` l. 1048, `mn-hsa` l. 1144).
Formato: cabecera de `js/data/mayeutica/b1-fluidos.js`; motor `js/core/mayeutica-motor.js`. Archivo propuesto: `js/data/mayeutica/b6a-craneo.js`
(≈480 líneas; si pasa de 500, partir en `-1` HIC+HSA y `-2` ictus), con `pag()` y `enFicha()` de `b3a-shock-1.js` y `PDF` = N.
Prefijos (sin choque en `js/`, grep): `mnh-` HIC, `mns-` HSA, `mni-` ictus soporte, `mnk-` complicaciones del ictus.
**Modelos**: cráneo vivo **espera al cráneo** — estados de la cobertura: `hematoma-crece`, `hsa` (con reloj 0-21 d), `ictus-penumbra`, `edema-ictus`,
`hemorragia-tpa`. Ya en la app ✅: `mn-rev-calc` (Tablas 47.4-47.5), `mn-ppc-calc` (Ec. 47.1), `mn-nimo-calc`, `mn-o2-calc`, `mn-pa-calc`, `mn-hiper-calc`
(Tabla 47.3); figuras reales `mar-img-47-1` (p. 39), `-47-2` (p. 40), `-47-3` (p. 43), `-47-4` (p. 46); shock vivo (vasopresor), ecógrafo (4 cámaras).
Mientras no exista el cráneo, «Compruébalo en el modelo» abre la calculadora o la figura (`calculadora: { ir, nombre }`).
**Otra fuente (§1.15), solo donde Marino calla**: Manual UMI `umi-tce-manejo` (escalones de la HTIC del **TCE**: DVE, hiperventilación 30-35 transitoria,
hiperosmolar; cirugía en manual-umi.html:2097: **contusión >50 mL, o GCS 6-8 con >20 mL y desplazamiento >5 mm o cisternas comprimidas** — es del TCE,
no del hematoma espontáneo: solo en «Para profundizar») · Libro Azul LA1 = `docs/libro-azul-seccion-viii-neurologia-parte1.pdf#page=11` (flujo constante
con PPC 50-150 mmHg: la meseta que el ictus pierde) · DESTINY II, PubMed 24645942 (hemicraniectomía en el infarto maligno, >60 años; **solo el resumen**:
grado de recomendación «fuente pendiente»). Monro-Kellie (LA1 p. 3-4) no es de Marino: nunca se le atribuye.

## Ruta del grupo
**13 `mn-hic` → 14 `mn-hsa` → 11 `mn-ictus-soporte` → 12 `mn-ictus-complicaciones`**. La HIC va primero porque allí escribe Marino la Ec. 47.1
(PPC = PAM − PIC) y los dos umbrales (PIC <20, PPC 50-70, p. 45) que las otras tres usan; la HSA los reutiliza (p. 48); el isquémico enseña lo
contrario (la PA que sostiene la penumbra, p. 36) y sus complicaciones cierran el círculo con la hemorragia y el edema (p. 39-41).
---
## 13 · `mn-hic` (p. 41-45) — paciente **Segismundo, 71 a, 80 kg** (warfarina por FA, INR 3,2)
**Carril de 30 s** · Idea: en las primeras horas **el hematoma crece**: lo primero es revertir el antitrombótico; luego PAS <140 y PPC = PAM − PIC (p. 42, 45).
Cifras: la mitad muere en **30 días** (p. 41) · CCP **25/35/50 U/kg** con INR 2-4/4-6/>6 + vitamina K 10 mg (Tabla 47.4, p. 44) · **PIC <20, PPC 50-70** (p. 45).
Figura: Fig. 47.3 real (`mar-img-47-3`, p. 43). Modelo: cráneo `hematoma-crece` (**espera al cráneo**; la masa en % `ilustrativo`: Marino no da volúmenes).
**Mira/Juega**: Fig. 47.3 + `mn-rev-calc` (warfarina, 80 kg, INR 3,2) + `mn-ppc-calc` (PAM 100/PIC 26; luego PIC 14). Con el cráneo: anticoagulante → crece; revertir → se frena; sangre ventricular → hidrocefalia → catéter.
**Piensa (guía)**
- g1 *test* `mn-hic` (Revertir) (`modelo: cráneo 'hematoma-crece'`): «Predice: ¿por qué empeora en las primeras horas?» → crece el hematoma: revertir ya es obligado (p. 42). Distractores: «edema citotóxico del día 3» (es del isquémico, p. 40); «vasoespasmo» (HSA, días 4-14, p. 47).
- g2 *test* `mn-hic-warfarina`: «¿Por qué CCP de 4 factores y no plasma?» → normaliza el INR mucho antes y con menos volumen: 60 % en 30 min frente a 9 % (p. 42). Distractor: «la vitamina K sola basta»: empieza a las 2 h, máxima a las 24 h (p. 42).
- g3 *test* `mn-hic-dabigatran · mn-hic-andexanet`: «¿Qué hace el andexanet?» → es un factor Xa señuelo que fija apixabán y rivaroxabán: −90 % de anti-Xa en 10 min, hemostasia a las 12 h (p. 43-44). Distractor: «inhibe la trombina» (dabigatrán; idarucizumab lo revierte en 10-30 min, p. 43).
- g4 *test* `mn-hic-antiagregantes`: «¿Cómo actúa la desmopresina con aspirina o clopidogrel?» → libera factor de von Willebrand del endotelio; la inhibición plaquetaria dura 7-10 días (p. 44). Errata: el libro imprime «3 µg/kg»; dosis habitual 0,3-0,4 µg/kg (`mn-nota-dosis-47-4`).
- g5 *destapa* «son tres cosas» `mn-hic-pic`: «¿Cuándo mides la PIC?» → GCS ≤8 · sangre en los ventrículos · herniación transtentorial (midriasis unilateral) (p. 45).
- g6 *test* `mn-hic-otras` (`modelo: cráneo 'hematoma-crece'`, sangre ventricular): «¿Por qué la sangre ventricular pide un catéter?» → hidrocefalia obstructiva; el catéter drena, permite trombólisis intraventricular y mide la PIC (p. 45).
- g7 *test* `mn-hic-ppc` (calc `mn-ppc-calc`): «PAM 100, PIC 26: PPC 74. ¿Está bien?» → no: la PIC ≥20 se trata drenando LCR aunque la PPC parezca buena (p. 45). Distractores: «bajar la PAM a 90 para dejar la PPC en 64» (la PIC sigue alta); «nada: PPC casi en rango».
**Examínate (MIR)**
- e1 *test* `mn-tabla-47-4`: «Warfarina, 80 kg, INR 5: ¿reversión?» → vitamina K 10 mg IV + CCP 35 U/kg = **2.800 U** (p. 44). Distractores: 25 U/kg (INR 2-4), 50 U/kg (>6), plasma. Nota de interpretación de la ficha (INR 4 y 6 en dos tramos).
- e2 *test* `mn-tabla-47-4 · mn-nota-dosis-47-4`: «Dabigatrán: ¿idarucizumab?» → 5 g en total (2 × 2,5 g, el 2.º en 15 min); el libro imprime «2,5 mg» (p. 44; errata con nota y ficha técnica). Distractores: «2,5 mg ×2» (la errata), «CCP 25 U/kg» (la alternativa es 50 U/kg, p. 43).
- e3 *test* `mn-tabla-47-5`: «Rivaroxabán 20 mg hace 3 h: ¿andexanet?» → pauta alta: 800 mg a 30 mg/min y 8 mg/min hasta 120 min (p. 44; cumple las dos condiciones). Distractor: pauta baja (≤10 mg o ≥8 h). Evitar ejemplos del solape (`mn-nota-andexanet`).
- e4 *test* `mn-tabla-47-4`: «Enoxaparina 80 mg hace 4 h: ¿protamina?» → 80 mg (1 mg/mg), menos eficaz que con heparina no fraccionada (p. 44). Distractor: 1 mg/100 U (es la HNF).
- e5 *test* `mn-hic` (Otras medidas): «¿PA objetivo en la HIC?» → PAS <140 (p. 45). Distractores: <180/105 (isquémico tras trombólisis, p. 35); bajar ≤15 % en 24 h (isquémico sin trombólisis, p. 36).
- e6 *test* `mn-hic-andexanet`: «¿Qué efecto adverso del andexanet destaca Marino?» → TEV en un 10 % (p. 44). Distractores: hemorragia, anafilaxia (no los da).
- e7 *encuentra el error* (1) `mn-hic` (Otras medidas): «Compresión neumática las primeras 24 h ✓ · levetiracetam profiláctico ✗ (no se recomienda; tratar el 15 % que convulsiona, p. 45) · EEG continuo 24-36 h si la consciencia está alterada ✓ · neurocirugía con hematoma grande, que crece o con sangre ventricular ✓» (p. 45).
**Caso Segismundo** (vive aquí; 6 pasos; ficha: 71 a, 80 kg, FA con warfarina)
1 · Día 0, 10:00: hemiparesia izquierda brusca, PA 196/104, GCS 13; INR 3,2; TC como la Fig. 47.3 (hematoma con extensión ventricular). *Test* ¿qué va primero? (vitamina K 10 mg + CCP 25 U/kg = **2.000 U**, p. 42, 44; distractores: plasma 15 mL/kg —9 % frente a 60 % a los 30 min—; vitamina K sola; «esperar al INR de control»). Calc `mn-rev-calc`.
2 · *Test* PA (PAS <140 con un fármaco de la Tabla 47.2: labetalol 10 mg + 2-8 mg/min o nicardipina, p. 36, 44-45; distractores: «<180/105» —isquémico—; nitroprusiato —sube la PIC, p. 36—).
3 · 16:00: GCS **7**. *Destapa* «son dos cosas»: ¿por qué un catéter ventricular? → GCS ≤8 y sangre ventricular = medir la PIC · el mismo catéter drena la hidrocefalia (p. 45).
4 · 18:00: PAM 100, PIC **26** → PPC 74. *Test* (drenar LCR hasta PIC <20, p. 45). Tras drenar: PAM 84, PIC 14 → **PPC 70** (en 50-70). Calc `mn-ppc-calc`.
5 · Noche. *Error* (2) plan del R1: «PAS objetivo <160 ✗ (<140, p. 45) · levetiracetam profiláctico ✗ (no, p. 45) · compresión neumática; heparina más adelante según la estabilidad ✓ · PPC 50-70 con PIC <20 ✓ · EEG continuo si sigue con la consciencia alterada ✓».
6 · **Giro**, día 3: crisis focal que generaliza. *Test* ¿qué cambia? (ahora sí: levetiracetam; el 15 % convulsiona la 1.ª semana, p. 45; distractores: «fenitoína profiláctica desde el ingreso habría sido lo correcto»; «es la hidrocefalia: solo drenar»).
**Lo que te llevas**: revertir es lo primero · PAS <140 · PPC = PAM − PIC, 50-70 con PIC <20. **Volver**: `ancla: 'mn-hic-ppc'`, cráneo `hematoma-crece` (espera).
**Para profundizar**: `mn-hic-datos` (10-15 %, ⅔ con secuelas, p. 41) · `mn-hic-otras` (fibrinólisis intraventricular, Manual UMI) · Manual UMI `umi-tce-manejo` (escalones y cirugía **del TCE**, con su rótulo).
---
## 14 · `mn-hsa` (p. 45-48) — paciente **Petronila, 48 a** (aneurisma de la basilar)
**Carril de 30 s** · Idea: la sangre en la base **vuelve a sangrar al principio** y **estrecha las arterias después**: PAS ≤140 y cerrar el aneurisma; vigilar los días 4-14 (p. 47-48).
Cifras: 25 % muere antes del hospital y otro 20 % en el ingreso (p. 45-46) · isquemia diferida en **⅓, días 4-14** (p. 47) · nimodipino **60 mg/4 h oral, 3 semanas** (p. 48).
Figura: Fig. 47.4 real (`mar-img-47-4`, p. 46). Modelo: cráneo `hsa` con reloj 0-21 d (**espera al cráneo**) + `mn-nimo-calc` ✅.
**Mira/Juega**: Fig. 47.4 + `mn-nimo-calc` (día 0, 6, 21). Con el cráneo: mover el reloj y ver qué amenaza toca cada día.
**Piensa (guía)**
- g1 *destapa* «son cuatro cosas» `mn-hsa-inflamacion · mn-hsa-hidrocefalia · mn-hsa-icd · mn-hsa-organos`: ¿de dónde viene el daño? → inflamación (edema vasogénico y citotóxico; hierro y ferroptosis) · hidrocefalia obstructiva · isquemia diferida · SDRA y FRA (p. 47).
- g2 *test* `mn-hsa-inmediato`: «¿Por qué labetalol?» → baja la PA sin subir el gasto, que favorecería el sangrado (p. 47). Distractor: «nicardipina: es la única que no sube la PIC».
- g3 *test* `mn-hsa-inmediato`: «¿Tranexámico para el resangrado?» → no: no lo previene (p. 47). Distractor: «sí, 1 g en 10 min» (es la hemorragia tras tPA sin crioprecipitado, p. 40).
- g4 *test* `mn-hsa-aneurisma` (`modelo: cráneo 'hsa'`, reloj día 2): «¿Cuándo cerrarlo?» → mejor en 3 días; no más de 7-10 (p. 47).
- g5 *test* `mn-hsa-vigilar` (reloj día 6): «Predice: ¿qué vigilas y con qué?» → déficit focal nuevo o caída de 2 puntos del GCS; angio-TC y Doppler transcraneal (sensibilidad ≈90 %) (p. 48).
- g6 *test* `mn-hsa-nimodipino`: «¿Qué consigue el nimodipino y por qué no IV?» → reduce los déficits, no la mortalidad; IV da hipotensión (p. 48).
**Examínate (MIR)**
- e1 *test* `mn-hsa-gravedad`: «¿Qué % está muerto o discapacitado a los 6 meses?» → 35 % (p. 46). Distractores: 25 % (antes del hospital), 20 % (en el ingreso).
- e2 *test* `mn-hsa-vigilar`: «Vasoespasmo grave confirmado: ¿qué se plantea?» → vasodilatadores intraarteriales o angioplastia (p. 48). Distractor: «nimodipino IV en bolo».
- e3 *test* `mn-hsa-generales`: «¿TEV y profilaxis?» → hasta el 25 %; enoxaparina 40 mg/día tras reparar el aneurisma (p. 48). Distractor: «contraindicada hasta el día 14».
- e4 *test* `mn-hsa-generales`: «Na⁺ 128 el día 7: ¿qué dice Marino?» → 35 %, quizá pérdida cerebral de sal; importancia por determinar (p. 48). Distractor: «SIADH siempre: restringir agua» (no lo dice). Enlace a `mr-hiponatremia-tto` (Marino renal).
- e5 *test* `mn-hsa-generales`: «Fiebre de 38,6: ¿bajarla mejora el pronóstico?» → no lo ha mejorado, aunque la fiebre lo empeora (p. 48). Distractor: «sí, como en el isquémico» (en el isquémico tampoco mejora el TTM, p. 37).
- e6 *encuentra el error* (1) `mn-hsa-pic`: «Catéter de drenaje si hay hidrocefalia ✓ · PIC <20 con drenajes periódicos ✓ · el que sobrevive se queda sin derivación ✗ (necesitará una derivación permanente al abdomen, p. 48) · el catéter sirve para medir la PIC ✓».
**Caso Petronila** (vive aquí; 6 pasos; ficha: 48 a, cefalea en trueno)
1 · Día 0, 14:00: GCS 14, PA 168/96; TC con sangre en las cisternas. *Test* (PAS ≤140 con labetalol 10 mg + 2-8 mg/min, p. 36, 47; no tranexámico, p. 47; distractores: nitroprusiato; «no bajarla: >220/120» —es el isquémico, p. 36—).
2 · *Test* nimodipino (60 mg/4 h oral desde ya, 21 días, p. 48; distractores: IV; «empezar el día 4»). Calc `mn-nimo-calc` día 0.
3 · Día 1: aneurisma de la basilar embolizado. *Error* (2): «Cerrado en el día 1, dentro de 3 días ✓ (p. 47) · enoxaparina 40 mg/día ✓ (p. 48) · pasar el nimodipino a IV para controlarlo mejor ✗ (hipotensión, p. 48) · glucosa 210: objetivo 140-180 como en el isquémico ✗ (en la HSA la guía no da objetivo, p. 48) · bajar la fiebre ✓ (sin efecto probado, p. 48)».
4 · Día 6: GCS **12** (−2) y afasia nueva. *Test* (isquemia diferida: angio-TC o Doppler transcraneal; si vasoespasmo grave, angioplastia, p. 48; distractores: «resangrado» —aneurisma cerrado—; «el nimodipino ha fallado: subirlo a 120 mg»).
5 · **Giro**, día 9: cefalea, vómitos, GCS 10, ventrículos dilatados. *Test* (hidrocefalia: drenaje ventricular, PIC <20 con drenajes; derivación permanente si sobrevive, p. 47-48; distractor: «nuevo vasoespasmo: angioplastia»).
6 · Día 21. *Destapa* «son dos cosas»: fin del nimodipino (3 semanas) · la ventana de la isquemia diferida (4-14) ya pasó (p. 47-48).
**Lo que te llevas**: ≤140 y cerrar en 3 días · días 4-14: GCS y Doppler · nimodipino salva déficits, no vidas. **Volver**: `ancla: 'mn-hsa-vigilar'`, cráneo `hsa` reloj día 6 (espera).
**Para profundizar**: `mn-hsa-inflamacion` (ferroptosis) · `mn-hsa-final` («Where's the beef») · `mn-hsa-pic` (derivación) · Manual UMI (Fisher, Hunt-Hess, botón ya en la ficha).
---
## 11 · `mn-ictus-soporte` (p. 34-37) — paciente **Hermenegildo, 58 a** (cerebral media izquierda, tPA)
**Carril de 30 s** · Idea: la autorregulación está rota: **el flujo de la penumbra sigue a la PA**; no la bajes de más ni des O₂ de más (p. 35-36).
Cifras: sin trombólisis, bajar solo si **>220/120** las primeras 72 h y **≤15 %** en 24 h (p. 36) · tras trombólisis **<180/105** 24 h (p. 35-36) · O₂ solo si SaO₂ **<90 %**; autor **90-92 %** (p. 35).
Figura: no hay figura en Marino; cráneo `ictus-penumbra` (**espera al cráneo**; la meseta de autorregulación, de LA1 p. 11, «otra fuente»). `mn-pa-calc`, `mn-o2-calc` ✅.
**Piensa (guía)**
- g1 *test* `mn-isq-hta` (`modelo: cráneo 'ictus-penumbra'`): «Predice: bajas la PAM un 25 % el primer día. ¿Qué le pasa a la penumbra?» → pierde flujo: la autorregulación está alterada y el flujo depende de la presión (p. 36). Distractor: «nada: la autorregulación mantiene el flujo» (eso es el cerebro sano, LA1 p. 11).
- g2 *test* `mn-isq-oxigeno`: «¿Por qué el O₂ de más daña?» → vasoconstricción (O₂ 100 % baja el flujo cerebral un 15-30 %) y radicales libres; SaO₂ >94 % se asoció a peor evolución (p. 35).
- g3 *test* `mn-isq-vm`: «¿Qué riesgo tiene la ventilación con presión positiva?» → sube la PIC y baja la PPC (p. 35). Distractor: «baja la PaCO₂ y la PIC».
- g4 *test* `mn-isq-evitar`: «¿Por qué no nitroprusiato?» → sube la PIC (p. 36). Distractor: «baja el gasto» (eso es de los betabloqueantes puros, p. 36).
- g5 *test* `mn-isq-hipotension` (`modelo: shockVivo` enlace): «PA 85/50 con FA a 140: ¿vasopresor?» → fenilefrina; si no hay FA rápida, noradrenalina; PAM >65 (p. 37).
- g6 *test* `mn-isq-glucemia · mn-isq-fiebre`: «Glucosa 215 y 38,4 °C a las 30 h: ¿qué haces?» → insulina a 140-180 sin glucosados; buscar infección y bajar la fiebre; el TTM no mejora (p. 37).
**Examínate (MIR)**
- e1 *test* `mn-isq-hta-recomendaciones`: «Sin trombólisis, PA 240/130 a las 10 h: ¿objetivo a 24 h?» → bajar como mucho un 15 %: PAS ≈204 (p. 36). Distractores: <180/105; <140/90.
- e2 *test* `mn-isq-hta-recomendaciones`: «Sin trombólisis, 210/115 a las 20 h, sin IC: ¿bajas?» → no (>220/120 es el umbral, p. 36). Distractor: sí, a <180/105.
- e3 *test* `mn-tabla-47-2`: «Nicardipina: ¿pauta?» → 5 mg/h, +2,5 mg/h hasta 15 (p. 36). Distractores: «1-2 mg/h doblando hasta 21» (clevidipina); «10 mg en bolo» (labetalol).
- e4 *test* `mn-isq-evitar`: «Tras trombectomía con reperfusión, ¿metoprolol?» → vale 5-10 mg IV/6 h, aunque los betabloqueantes puros se evitan en el ictus (p. 36). Trampa verdadera.
- e5 *test* `mn-isq-hipotension`: «¿Qué fluido prefiere el autor y por qué?» → algo de albúmina al 5 %, por el edema de los cristaloides (la guía: salino, p. 37). Nota: opinión del autor frente a guía, las dos.
- e6 *encuentra el error* (1) `mn-tabla-47-1`: «O₂ solo si SaO₂ <90 % ✓ · aspirina 325 mg el día 1 ✓ · tras tPA, aspirina a las 6 h ✗ (esperar 24 h, p. 35) · HBPM en todos ✓».
**Caso Hermenegildo** (vive aquí; cruza la 12; 6 pasos; ficha: 58 a, tPA en urgencias)
1 · UCI, 1 h tras el tPA: PA **188/110**, SaO₂ 93 % aire, glucosa 215, 37,1 °C. *Test* PA (<180/105: labetalol 10 mg + 2-8 mg/min, p. 35-36; distractores: «solo si >220/120», nitroprusiato). Calc `mn-pa-calc`.
2 · *Test* O₂ (no: SaO₂ ≥90; el autor, 90-92 %, p. 35; distractor: gafas hasta >94 %). Calc `mn-o2-calc`.
3 · *Error* (2) plan del R1: «Insulina para 140-180 ✓ (p. 37) · suero glucosado al 5 % de mantenimiento ✗ (evitar, p. 37) · aspirina 325 mg ya ✗ (24 h tras tPA, p. 35, 38) · compresión neumática 24 h ✓ (p. 38) · si hay fiebre, paracetamol y buscar foco ✓ (p. 37)».
4 · **Giro**, h 5: GCS de 15 a 9, PA 192/108; TC como la Fig. 47.2. *Test* (hemorragia tras tPA, 6,4-8,8 %; la PA >180/105 era un factor; crioprecipitado 10 U, repetir si fibrinógeno <200; mejor concentrado; si no hay, tranexámico 1 g en 10 min; neurocirugía, p. 39-40). Dato: fibrinógeno 160. `modelo: cráneo 'hemorragia-tpa'` (espera).
5 · h 36: 38,4 °C. *Destapa* «son dos cosas»: buscar siempre infección · bajarla sin demora; el TTM no mejora (p. 37).
6 · Día 7: crisis generalizada. *Test* (levetiracetam y mantenerlo al alta; no profilaxis precoz; p. 41). Nota de fuentes: crisis la 1.ª semana **20 %** (p. 41) frente a **2-5 %** (Tabla 46.1, p. 20); las dos.
**Lo que te llevas**: <180/105 tras tPA · SaO₂ 90-92 % del autor · la hemorragia llega en horas: crioprecipitado. **Volver**: `ancla: 'mn-isq-hta'`, cráneo `ictus-penumbra` (espera).
**Para profundizar**: `mn-isq-origen` (85 %, 20 % embólicos, FOP) · `mn-isq-hipotension` (albúmina del autor) · `mn-isq-glucemia` (mecanismos).

---
## 12 · `mn-ictus-complicaciones` (p. 38-41) — paciente **Clotilde, 66 a, 65 kg** (FA, infarto de >⅓ del hemisferio derecho)
**Carril de 30 s** · Idea: lo que más pesa en el pronóstico es **la hemorragia y el edema** (p. 40); lo demás (TEP, recurrencia, émbolo del corazón) se previene o se busca.
Cifras: hemorragia tras tPA **6,4-8,8 %** (p. 39) · hipertónico en bolos, Na⁺ **145-155** (p. 41) · aspirina **325 mg** desde el día 1 (día 2 tras tPA) (p. 38).
Figura: Figs. 47.1 (`mar-img-47-1`, p. 39) y 47.2 (`mar-img-47-2`, p. 40) reales. Modelo: cráneo `edema-ictus` / `hemorragia-tpa` (**espera al cráneo**); ecógrafo 4 cámaras ✅; `mn-hiper-calc` ✅.
**Piensa (guía)**
- g1 *test* `mn-isq-tvp`: «Si el TEP fue del 0,4 %, ¿por qué profilaxis?» → sigue indicada: HBPM; tras tPA, compresión 24 h (p. 38).
- g2 *test* `mn-isq-aspirina`: «¿Anticoagular la FA en el ictus agudo?» → no está indicada; aspirina 325 mg oral o rectal, 1 ictus menos por 100 (p. 38).
- g3 *test* `mn-isq-eco`: «¿Cuál NO es indicación de eco en el ictus?» → «ictus lacunar único con causa clara» (no está en la lista) frente a FA, infarto transmural, hemocultivos +, TEV previo, criptogénico (p. 38). ETT primero; ETE si no aclara.
- g4 *test* `mn-isq-burbujas · mar-img-47-1` (ecógrafo 4 cámaras): «¿Cómo se hace y qué ves?» → ~10 mL de salino agitado entre dos jeringas, rápido por vía central o del brazo; burbujas en la izquierda en pocos ciclos = cortocircuito (p. 38-39).
- g5 *test* `mn-isq-hemorragia` (`modelo: cráneo 'hemorragia-tpa'`): «¿Qué tres factores la predicen?» → edad avanzada, PA >180/105, >⅓ de un hemisferio (p. 39).
- g6 *test* `mn-isq-edema` (`modelo: cráneo 'edema-ictus'`): «¿Qué dos edemas y cuál crece con el área?» → citotóxico (necrosis) y vasogénico (barrera); a más área, más edema (p. 40).
- g7 *test* `mn-isq-edema-manejo`: «¿Catéter de PIC en el edema del isquémico?» → no se recomienda: basta la clínica; si empeora, hipertónico (más eficaz que manitol), en bolos, Na⁺ 145-155; no cambia el pronóstico (p. 40-41).
**Examínate (MIR)**
- e1 *test* `mn-tabla-47-3`: «NaCl 23,4 %: ¿bolo?» → 30 mL (o 0,68-2 mL/kg) (p. 41). Distractores: 100 mL (7,5 %), 250 mL (3 %). Nota de fuentes de la ficha (dos cifras por bolo).
- e2 *test* `mn-isq-hemorragia-tto`: «¿Por qué el concentrado de fibrinógeno es mejor que el crioprecipitado?» → no hay que descongelar (≥20 min) y su concentración es constante (20 g/L) (p. 40).
- e3 *test* `mn-isq-hemorragia-tto`: «¿Cuándo tranexámico 1 g?» → si no hay crioprecipitado a mano (p. 40). Distractor: «siempre, junto al crioprecipitado».
- e4 *test* `mn-isq-fop`: «¿FOP: en quién pensarlo?» → sin causa aparente (p. ej., <55 años) o con TEV previo; un FOP no prueba la causa, pero justifica cerrarlo más adelante (p. 38-39).
- e5 *test* `mn-isq-convulsiones`: «¿Cuántas crisis recurren en 4 años?» → una cuarta parte (p. 41). Nota: 20 % la 1.ª semana (p. 41) frente a 2-5 % (Tabla 46.1, p. 20).
- e6 *encuentra el error* (0, trampa) `mn-isq-aspirina`: «Aspirina por vía rectal si no traga ✓ · desde el ingreso ✓ · 325 mg ✓ · no anticoagular ✓» (p. 38).
**Caso Clotilde** (vive aquí; 5 pasos; ficha: 66 a, 65 kg, FA sin anticoagular)
1 · Día 1: *Test* ¿qué eco y burbujas? (ETT por la FA; ETE si no aclara; las burbujas no son prioridad: hay causa y 66 años, p. 38).
2 · Día 2: GCS de 15 a 12, Na⁺ 138. *Test* (sin catéter de PIC; NaCl 3 % 250 mL —o 5 mL/kg = 325 mL, nota de fuentes— en bolo; Na⁺ objetivo 145-155, p. 40-41; distractores: catéter de PIC, manitol, perfusión continua). Calc `mn-hiper-calc`.
3 · Día 3: Na⁺ 149, más despierta. *Error* (2): «Na⁺ en objetivo ✓ · aspirina 325 mg/día ✓ · heparina a dosis plena por la FA ✗ (no anticoagular en el agudo, p. 38) · levetiracetam profiláctico por el gran infarto ✗ (no, p. 41) · HBPM profiláctica ✓».
4 · Día 4: tras otro bolo, Na⁺ **157**. *Test* (por encima del objetivo 145-155: no más bolos, p. 41).
5 · **Giro**, día 5: GCS 8, midriasis derecha, Na⁺ 152. *Destapa* «son dos cosas»: el hipertónico no cambia el pronóstico y ya no basta (p. 41); consulta a neurocirugía por **hemicraniectomía** — Marino solo la nombra en la hemorragia tras tPA (p. 40); en el infarto maligno, **otra fuente**: DESTINY II (PubMed 24645942, resumen); grado de recomendación y ventana horaria: **fuente pendiente** (no se da «≤48 h»). Además GCS ≤8: proteger la vía aérea (`mn-gcs-usos`, p. 14).
**Lo que te llevas**: citotóxico + vasogénico · hipertónico en bolos, 145-155, sin catéter de PIC · la hemicraniectomía es de neurocirugía (y de otra fuente). **Volver**: `ancla: 'mn-isq-edema-manejo'`, cráneo `edema-ictus` (espera).
**Para profundizar**: `mn-isq-tvp` (Alemania 0,4 %) · `mn-isq-eco` · `mn-isq-fop` (cierre) · Manual UMI `umi-tce-manejo` (craniectomía, segundo nivel, TCE).

## Criterios clínicos (R3) — la regla exacta
PIC <20 y PPC 50-70 **solo en HIC/HSA** (p. 45, 48); en `ictus-penumbra` y `edema-ictus` el monitor muestra la PPC sin semáforo (Marino no da objetivo; no monitorizar PIC, p. 40) · PAS <140 HIC (p. 45), ≤140 HSA (p. 47), <180/105 tras tPA (p. 35), >220/120 y ≤15 % sin tPA (p. 36) · Na⁺ 145-155 (p. 41) · Tabla 47.4 con las dos erratas (idarucizumab, desmopresina) y la nota INR 4/6 · cirugía del hematoma: Marino solo «consultar a neurocirugía» (p. 45); el umbral del Manual UMI es del TCE (>50 mL, o GCS 6-8 con >20 mL y >5 mm) y nunca se aplica a Segismundo.

## Huecos y riesgos
- **Fuente pendiente**: volumen y velocidad del hematoma; cuánto baja la PIC cada drenaje o bolo (`ilustrativo`); hemicraniectomía en el infarto maligno (solo resumen DESTINY II); tratamiento de la hiponatremia de la HSA (Marino: «por determinar»).
- **No usar**: Monro-Kellie como de Marino; «nitroprusiato roba la penumbra» (p. 36 solo «sube la PIC»); «salino > manitol» fuera del ictus; «Doppler diario desde el día 4».
- Riesgo: todo Juega espera al cráneo; las calculadoras ✅ sostienen el recorrido. e3 de la HIC: no usar ejemplos del solape de la Tabla 47.5.

## Lo que tacha el constructor
4 fichas con `entrada`, guía en orden, examen, caso y profundizar · ids `mnh-`, `mns-`, `mni-`, `mnk-` · cada pregunta con `fuente` real y página · notas: idarucizumab, desmopresina, INR 4/6, andexanet, Tabla 47.3, 20 % frente a 2-5 %, albúmina del autor · hemicraniectomía del edema con «otra fuente / pendiente» · jueces `--ficha libros:marinoNeuro:panel-marino-neuro-tabs:mn-hic` (y las otras tres) a 390/360.
