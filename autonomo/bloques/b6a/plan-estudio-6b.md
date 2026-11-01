# Plan de estudio · b6a · grupo 6B «Coma, muerte encefálica y crisis» (Marino caps. 45-46) — profesor, modo diseñar, 01/11/2026

Fuente **N** = `docs/marino-2024-neurologia-caps45-47.pdf` (p. = página del PDF, desplazamiento 0; cotejado con `pdftotext` página a página).
Fichas: `js/modules/libros/marino-neuro.html` (`mn-coma` l. 440, `mn-muerte-encefalica` l. 532, `mn-convulsiones` l. 598, `mn-estado-epileptico` l. 650).
Vista Visual ya montada: `visual-marino-caps45-53.js` l. 61-100 (cara de Glasgow `caraGlasgow`, lista de muerte encefálica, asistente del SE).
Archivo propuesto: `js/data/mayeutica/b6a-coma-crisis.js` (≈450 líneas; si pasa de 450, partir en `-1` coma + ME y `-2` crisis).
Prefijos (sin choque en `js/`): `mnk-` coma, `mnm-` muerte encefálica, `mnv-` convulsiones, `mns-` estado epiléptico.
**Dos velocidades**: 6 → 7 no esperan a nada (asistente y calculadoras ✅). 4 → 5 se construyen ya con la cara y las calculadoras; los `modelo:` del
cráneo vivo (`herniacion-uncal`, `muerte-encefalica`) se añaden cuando exista (**espera al cráneo**).

## Ruta del grupo
**4 `mn-coma` → 5 `mn-muerte-encefalica` → 6 `mn-convulsiones` → 7 `mn-estado-epileptico`**. Del coma se baja al tronco que ya no responde (ME);
luego, la causa de coma que se pasa por alto (crisis no convulsivas, p. 4 y 21) y su tratamiento en tres pasos (p. 21-23).

---
## 4 · `mn-coma` (p. 9-14) — paciente **Eduvigis, 84 a** (opiáceos → giro: masa)
**Carril de 30 s** · Idea: en el coma, **pupilas, postura y reflejos oculares dicen dónde está el daño** (p. 10-13).
Cifras: **una pupila dilatada y fija = masa en expansión** (Tabla 45.4, p. 11) · GCS **≤8 = coma e intubar** (p. 14) · intubado, **máximo 11** (Tabla 45.5, p. 13).
Figura: Fig. 45.3 real (`mar-img-45-3`, p. 12) + `caraGlasgow` ✅. Modelo: cráneo `herniacion-uncal` (masa → pupila fija → decorticación → descerebración → flácido) **espera al cráneo**.
**Mira/Juega**: en la cara de la vista Visual, poner O1 V1 M3 → M2 → M1 y pupila `uni`; luego `puntR` frente a `puntNR`.
**Piensa (guía)**
- g1 *test* `mn-coma-dolor`: «Retira el brazo al pinchazo: ¿encaja con coma?» → no: una respuesta con propósito no es propia del coma (p. 10). Distractor: «sí, si el GCS es ≤8».
- g2 *test* `mn-coma-posturas` (`modelo: craneo 'herniacion-uncal'`, espera): «Al dolor, extiende y prona brazos y piernas: ¿dónde está la lesión?» → mesencéfalo y protuberancia alta (descerebración, p. 10). Distractores: «tálamo» (decorticación, flexión) · «tronco bajo» (flácido).
- g3 *test* `mn-pup-unilateral` con `mn-pup-calc`: «Predice: ¿qué dice una sola pupila dilatada y fija?» → masa intracraneal en expansión (herniación uncal), trauma o cirugía ocular, o crisis focal (p. 11). Distractor: «atropina» (dilatadas **reactivas**, las dos).
- g4 *destapa* «son dos cosas» `mn-pup-pequenas`: ¿cómo separas opiáceos de lesión pontina si las dos dan puntiformes? → opiáceos: **reactivas** · lesión pontina: **no reactivas** (p. 11).
- g5 *test* `mn-coma-oculocefalico · mar-img-45-3`: «Giras la cabeza a la derecha y los ojos se quedan mirando al frente: ¿qué te dice?» → tronco bajo intacto (p. 12). Distractor: «tronco dañado» (entonces siguen el giro). Aviso: no con columna cervical inestable (p. 12).
- g6 *encuentra el error* (1) `mn-coma-oculovestibular`: «Compruebo tímpano íntegro ✓ · 50 mL de salino frío ✓ · con tronco intacto los ojos se van despacio hacia el oído irrigado ✓ · irrigo el otro lado a continuación ✗ (esperar 5 min, p. 13)».
**Examínate (MIR)**
- e1 *test* `mn-tabla-45-4`: «Pupilas medias no reactivas» → fallo hepático agudo, encefalopatía postanóxica o muerte encefálica (p. 11). Distractores: «sobredosis de sedantes» (medias **reactivas**) · «hipotermia <28 °C» (dilatadas no reactivas).
- e2 *test* `mn-tabla-45-4`: «Pupilas medias reactivas en un coma» → encefalopatía tóxico-metabólica, sedantes o bloqueo neuromuscular (p. 11).
- e3 *test* `mn-tabla-45-5 · mn-gcs-calc`: «Intubado, abre los ojos al dolor y localiza: ¿GCS?» → 2 + 1 (pseudopuntuación) + 5 = 8T; máximo 11 (p. 13-14). Distractor: «8, coma grave por TCE» (con tubo no se clasifica por los tramos, calculadora).
- e4 *test* `mn-gcs-usos`: «¿Cuándo no es fiable el GCS?» → relajantes, sedación profunda o hipotensión (p. 13). Distractor: «edad >80».
- e5 *test* `mn-gcs-usos`: «Coma no traumático: ¿qué dice el libro del GCS inicial?» → ≤6 tiene 7 veces más probabilidad de despertar que ≤5 (p. 14), con la **nota de fidelidad** de la ficha (grupos solapados). Distractor: «≤8 no despierta».
- e6 *test* `mn-coma-motilidad`: «Preferencia fija de la mirada» → lesión ocupante o actividad epiléptica (p. 12). Distractor: «encefalopatía metabólica» (movimientos espontáneos, inespecífico).
**Caso** `mnk-eduvigis` (6 pasos) · Eduvigis, 84 a, ♀, FA con anticoagulante oral, dolor lumbar con parche de fentanilo.
1. Día 0, 08:30: la encuentran inconsciente. FR 7, SpO₂ 88 %, PA 132/70. No abre ojos, no emite sonidos, ningún movimiento al dolor. *Test* con `mn-gcs-calc` → 1-1-1 = **3**: coma (≤8), vía aérea en riesgo: intubar (p. 14). Distractor: «esperar: es tóxico».
2. Pupilas puntiformes **reactivas**; parche en la espalda. *Test* con `mn-pup-calc` → sobredosis de opiáceos (p. 11). Distractor: «lesión pontina» (no reactivas).
3. *Destapa* «son dos cosas» ¿qué te asegura el tronco? → ojos de muñeca presentes: los ojos se quedan al frente al girar (p. 12) · oculovestibular con desviación hacia el oído frío (p. 13).
4. **Giro**, 14:30, intubada: pupila **izquierda dilatada y fija**, la derecha puntiforme. *Test* → ya no es el opiáceo: masa en expansión (herniación uncal, p. 11) → TC urgente. TC: hematoma subdural izquierdo. Distractores: «efecto del fentanilo» · «Horner» (una **pequeña**). `modelo: craneo 'herniacion-uncal'` (espera).
5. Al dolor, extensión y pronación de los cuatro miembros. *Test* → descerebración: mesencéfalo y protuberancia alta (p. 10). Distractor: «decorticación: tálamo».
6. *Encuentra el error* (2), nota del R1: «Coma por opiáceos ✓ al ingreso · GCS 3, intubada ✓ · Ahora GCS fiable: está con propofol a dosis altas ✗ (no fiable con sedación profunda, p. 13) · Ojos de muñeca para ver el tronco aunque cayó al suelo sin collarín ✗ (no con columna cervical inestable, p. 12) · TC urgente por midriasis unilateral ✓».
**Lo que te llevas**: puntiformes reactivas = opiáceos · una dilatada y fija = masa · GCS ≤8 intubar, y no fiable con sedación.
**Volver**: `ancla: 'mn-pup-unilateral'`, `modelo: { craneoVivo: 'herniacion-uncal' }` (espera al cráneo; hasta entonces la vista Visual, cara con `uni`).
**Hueco**: la **naloxona** no está en el cap. 45 → «fuente pendiente» (cap. 52-53, b6b); el caso no la menciona como conducta.
**Para profundizar**: `mn-coma-causas` (incluido coma aparente), `mn-coma-motor`, `mn-gcs-origen`, `mn-pup-horner`; botón «Glasgow en Escalas Generales».
**Cuenta**: 6 + 6 + 6 = 18.

---
## 5 · `mn-muerte-encefalica` (p. 14-16) — paciente **Abundio, 23 a** (TCE)
**Carril de 30 s** · Idea: muerte encefálica = **todo el encéfalo, tronco incluido, de forma irreversible**; sobre todo tras TCE o HIC, cuando la PIC sube tanto que **detiene el flujo** (p. 14).
Cifras: **≥48 h**, PAM **≥75**, T **>36 °C** (Tabla 45.6, p. 15) · dos exploraciones **≥12 h** (p. 15) · apnea: PaCO₂ **>60 y >20 sobre la basal**, ~3 mmHg/min → **6-7 min** (p. 15-16).
Figura: lista ✅ (`mn-me-calc`) + apnea ✅ (`mn-apnea-calc`). Modelo: cráneo `muerte-encefalica` (pupilas medias fijas, flujo detenido) **espera al cráneo**.
**Piensa (guía)**
- g1 *test* `mn-me-pam`: «¿Por qué se exige PAM ≥75 y no el ≥65 de siempre?» → para contrarrestar la hipertensión intracraneal que impide la perfusión (p. 14). Distractor: «para que el test de apnea no baje la PA» (el riesgo existe, p. 16, pero no es la razón).
- g2 *test* `mn-me-farmacos`: «Sin niveles del sedante, ¿cuánto esperas?» → 5 semividas: aclara la sangre, no garantiza el cerebro (p. 14). Distractor: «24 h».
- g3 *test* `mn-me-ttm`: «Tras control de temperatura con objetivo <36 °C» → >36 °C al menos 24 h antes (p. 14).
- g4 *test* `mn-me-apnea-pasos` con `mn-apnea-calc`: «PaCO₂ basal 41. Predice el objetivo y el tiempo» → ≥61 (>60 y ≥20), ~7 min a 3 mmHg/min (p. 16). Distractor: «≥60 en 3 min».
- g5 *destapa* «son dos cosas» `mn-me-confirmatorias`: ¿cuándo y cuál? → solo si los pasos 1-4 no se pueden completar o interpretar · Doppler transcraneal, gammagrafía de flujo o angiografía de 4 vasos (p. 15-16).
- g6 *test* `mn-me-lazaro`: «Al retirar el respirador mueve el brazo» → signo de Lázaro: descargas de la médula cervical (p. 16). Distractor: «el test fue falso positivo».
**Examínate (MIR)**
- e1 *test* `mn-me-confirmatorias`: «¿Cuál **no** es una prueba confirmatoria aceptada?» → EEG (también PE, angio-TC, angio-RM; p. 16). Distractores: Doppler transcraneal, gammagrafía, angiografía de 4 vasos.
- e2 *test* `mn-me-apnea-pasos`: «¿Cuál es la hora legal de la muerte?» → cuando llega el resultado de la gasometría del **segundo** test (p. 16), con la nota `mn-me-segundo-apnea`. Distractor: «al acabar la primera exploración».
- e3 *test* (intro de la ficha): «1 mmHg más de PaCO₂ sube la ventilación minuto…» → 2 L/min (p. 16). Distractor: 0,5 L/min.
- e4 *test* `mn-me-calc`: «Cuántos exploradores en el adulto» → uno basta si tiene experiencia (p. 15). Distractor: «dos siempre».
- e5 *test* `mn-me-causas`: «Cómo se suele sospechar» → pupilas sin reflejo fotomotor o ausencia de esfuerzos en el respirador (p. 14). Distractor: «EEG plano».
**Caso** `mnm-abundio` (7 pasos; cruza 4 y 5; vive aquí) · Abundio, 23 a, ♂, 75 kg, moto.
1. Día 0, 02:00: GCS 1-1-2 = **4**; pupila derecha dilatada y fija; extensión al dolor. *Test* → descerebración (mesencéfalo-protuberancia alta, p. 10) + masa en expansión (p. 11). TC: hematoma subdural agudo derecho; **neurocirugía lo evacúa** (dato del caso: no se pregunta el criterio; ver «Para profundizar» → `umi-tce-cirugia`).
2. Día 1, h 30: pupilas medias fijas, no tose, ningún esfuerzo en el respirador; T 35,4 °C; propofol y fentanilo parados hace 4 h. *Test* ¿empiezas? → aún no: <48 h, T ≤36 y depresores sin aclarar (5 semividas) (p. 14-15). Distractores: «sí: la clínica es clara» · «sí, y si dudas, EEG».
3. Día 3, h 54: T 36,6, PAS 112, PAM 78, sin sedantes desde hace >5 semividas, glucosa 118. Exploración 1: los 6 reflejos ausentes. *Test* con `mn-me-calc` → faltan la segunda exploración ≥12 h y el test de apnea (p. 15). Distractor: «declarar ya».
4. *Encuentra el error* (2), plan del R1 para la apnea: «Preoxigenar con O₂ 100 % y gasometría basal ✓ · Desconecto e insuflo O₂ por el tubo ✓ · Con 3 min basta, el CO₂ sube rápido ✗ (unos 3 mmHg/min: 6-7 min para +20, p. 16) · Si aparece hipotensión o arritmia y no puedo completarlo, confirmo con un EEG ✗ (EEG no aceptado: Doppler transcraneal, gammagrafía o angiografía, p. 15-16) · Gasometría al final y vuelta al respirador ✓».
5. Apnea, 7 min: PaCO₂ 41 → **63**, sin esfuerzos. *Test* con `mn-apnea-calc` → compatible (>60 y +22) (p. 15-16). Distractor: «no concluyente: no llega a +25».
6. Día 4, 08:00 (≥12 h): segunda exploración y segunda apnea iguales; gasometría a las 08:40. *Test* hora de la muerte → 08:40 (p. 16).
7. **Giro**, al retirar el respirador tras la despedida: flexiona un brazo y eleva el tronco. *Destapa* «son dos cosas» ¿qué le dices a la enfermera? → signo de Lázaro: descargas de la médula cervical, quizá por hipoxemia (p. 16) · no cambia el diagnóstico ya confirmado (p. 16).
**Lo que te llevas**: ≥48 h, PAM ≥75, T >36, 5 semividas · apnea >60 y +20, 6-7 min · EEG no confirma; Lázaro es médula.
**Volver**: `ancla: 'mn-me-confirmatorias'`, `modelo: { craneoVivo: 'muerte-encefalica' }` (espera al cráneo).
**Para profundizar**: `mn-me-definicion` (UDDA), `mn-me-familia`, `mn-me-segundo-apnea`, `mn-me-apnea-riesgo`; Manual UMI `umi-tce-cirugia` (criterios de cirugía del TCE, otra fuente: **no se mezclan con Marino**).
**Cuenta**: 6 + 5 + 7 = 18.

---
## 6 · `mn-convulsiones` (p. 19-21) — paciente **Saturnina, 68 a** (HIC → estado no convulsivo)
**Carril de 30 s** · Idea: **el riesgo lo pone la lesión cerebral, no el shock**; y la crisis no convulsiva se esconde detrás de la consciencia alterada (p. 19-21).
Cifras: estado epiléptico **≥5 min** o ≥2 crisis sin recuperar (p. 20) · alteración de la consciencia en **~80 %** del no convulsivo (p. 21) · EEG continuo **16 %** frente a intermitente **4-8 %** (p. 21).
Figura: Tablas 46.1 y 46.2 (ficha). Sin modelo vivo (consulta); la vista Visual tiene los racimos.
**Piensa (guía)**
- g1 *test* `mn-tabla-46-1`: «¿Qué marca el riesgo de convulsiones en la UCI?» → presencia y tipo de lesión cerebral, no la gravedad del shock (p. 19). Distractor: «el fallo multiorgánico».
- g2 *test* `mn-conv-movimientos`: «Sacudidas irregulares de una mano: ¿siempre una crisis?» → no: la mioclonía no se considera siempre crisis, no se acompaña de descargas rítmicas en el EEG (p. 20). Distractor: «sí: es clónica».
- g3 *test* `mn-conv-generalizadas`: «Crisis generalizada sin movimientos: ¿posible?» → sí: siempre pierde la consciencia, no siempre convulsiona (p. 20).
- g4 *destapa* «son dos cosas» `mn-conv-eeg`: ¿por qué pedir EEG continuo y no uno de 20 min? → continuo encuentra 16 % frente a 4-8 % (p. 21) · las crisis no convulsivas aparecen en el 37 % de los EEG pedidos por consciencia alterada (p. 21).
- g5 *encuentra el error* (0 errores) `mn-conv-parciales`: «Crisis parcial compleja: no convulsiva ✓ · despierto sin conciencia del entorno ✓ · a menudo con aura (un olor) ✓ · con automatismos, como masticar ✓». (Enunciado: «puede haber 0, 1 o 2».)
**Examínate (MIR)**
- e1 *test* `mn-tabla-46-1`: «¿En qué situación es más frecuente el estado epiléptico según la Tabla 46.1?» → lesión isquémica 30 % (p. 19). Distractores: TCE 15-25 % · encefalitis 20 %.
- e2 *test* `mn-tabla-46-1` con nota: «Convulsiones en la 1.ª semana del ictus isquémico» → la Tabla 46.1 da 2-5 % y el cap. 47 «alrededor del 20 %» (p. 19 y p. 41): **las dos**, nota de fuentes de la ficha. Correcta: «el libro da dos cifras que no concilia».
- e3 *test* `mn-tabla-46-2`: «Manifestación más frecuente del no convulsivo» → confusión 49 % (p. 21). Distractores: coma 22 %, letargia 21 %.
- e4 *test* `mn-conv-se`: «Definición clásica de estado epiléptico» → ≥5 min continuos o ≥2 crisis sin recuperar la consciencia (p. 20). Distractor: «≥30 min» (es el umbral de lesión neuronal, p. 21).
**Caso** `mnv-saturnina` (5 pasos) · Saturnina, 68 a, ♀, 65 kg, HTA; hemorragia intracerebral lobar.
1. Día 3, 11:00: confusa, fluctuante, sacudidas irregulares de la mano derecha; T 37,2, Na⁺ 139, glucosa 126. *Test* con `mn-cam-calc` → CAM-ICU positivo; pero con lesión cerebral (HIC 20-30 % de convulsiones, p. 19) hay que pensar en crisis (p. 21). Distractor: «delirio: haloperidol».
2. *Encuentra el error* (2), plan del R1: «Las mioclonías confirman la crisis ✗ (no siempre son crisis, p. 20) · Pido un EEG de rutina y si es normal descarto ✗ (intermitente 4-8 % frente a continuo 16 %, p. 21; en la HIC, EEG continuo 24-36 h, p. 45) · Glucosa y sodio normales ✓ · Sin profilaxis anticonvulsiva previa ✓ (no se recomienda en la HIC, p. 45)».
3. EEG continuo: descargas rítmicas continuas → **estado epiléptico no convulsivo**. *Test* → tratar con los pasos del estado epiléptico, con menos éxito que en el convulsivo (p. 21). Distractor: «observar: no convulsiona».
4. **Giro**: lorazepam 4 mg, a los 5 min repetido; el EEG sigue igual. *Test* con `mn-se-calc` (65 kg) → paso 2: levetiracetam 60 mg/kg = **3.900 mg** (máx 4.500, p. 22-23). Distractor: «fenitoína oral».
5. *Destapa* «son dos cosas» ¿por qué se te habría escapado? → la consciencia alterada es la manifestación del ~80 % (p. 21) · con EEG intermitente solo se ve en 4-8 % (p. 21).
**Lo que te llevas**: consciencia alterada en la UCI = piensa en crisis · EEG continuo, 16 % frente a 4-8 % · la lesión, no el shock, pone el riesgo.
**Volver**: `ancla: 'mn-conv-eeg'` (sin modelo vivo).
**Para profundizar**: `mn-conv-se` (los ~20 tipos), enlace `mn-hic` (EEG 24-36 h).
**Cuenta**: 5 + 4 + 5 = 14.

---
## 7 · `mn-estado-epileptico` (p. 21-23) — paciente **Tiburcio, 57 a**
**Carril de 30 s** · Idea: **tres pasos contra el reloj**: BZD → anticonvulsivo no sedante → anestésico con el paciente ya intubado (p. 21-23).
Cifras: >**30 min** puede dejar lesión permanente (p. 21) · ⅓ no responde a BZD; **10-15 %** refractario (p. 22-23) · propofol hasta 15 mg/kg/h, **5 si >48 h** (Tabla 46.4, p. 23).
Figura: asistente `mn-se-wizard` ✅ + `mn-se-calc` ✅ + escalera de la vista Visual. Sin modelo vivo nuevo; enlace propofol `mar-sedacion` (cap. 6).
**Piensa (guía)**
- g1 *test* `mn-se-diazepam`: «¿Por qué lorazepam y no diazepam IV?» → el diazepam sale rápido del cerebro y aumenta la recurrencia (p. 21). Distractor: «el diazepam no es eficaz» (sí lo es).
- g2 *test* `mn-se-midazolam`: «Sin vía IV en la calle» → midazolam IM 10 mg, tan eficaz como lorazepam IV (p. 21-22).
- g3 *test* `mn-se-fosfenitoina`: «¿Por qué la fosfenitoína va tres veces más rápido que la fenitoína?» → no lleva propilenglicol: menos depresión cardíaca e hipotensión (p. 22). Distractor: «se une menos a proteínas».
- g4 *test* `mn-se-refractario`: «¿Qué haces antes del paso 3?» → intubar y ventilar: todos deprimen la respiración (p. 23). Distractor: «EEG primero».
- g5 *destapa* «son dos cosas» `mn-tabla-46-4`: ¿qué cambia a las 48 h de propofol? → techo de 15 a **5 mg/kg/h** (p. 23) · coincide con el umbral del síndrome de infusión de propofol del cap. 6 (nota de la ficha, enlace `mar-sedacion`).
**Examínate (MIR)**
- e1 *test* `mn-tabla-46-3`: «Dosis máxima de levetiracetam por dosis» → 4.500 mg (p. 22-23). Distractores: 3.000 (valproico), 1.500 (fosfenitoína EF).
- e2 *test* `mn-se-valproico`: «Efecto adverso a vigilar del valproico» → hiperamonemia, 40 % (p. 23). Distractor: «hipotensión».
- e3 *test* `mn-se-paso2`: «Con levetiracetam, fosfenitoína o valproico, ¿cuántos estados se cortan?» → la mitad; son equivalentes (p. 22). Distractores: 90 %, ⅓.
- e4 *test* `mn-se-mortalidad`: «Mortalidad hospitalaria del refractario» → hasta 61 % (convulsivo 21 %, no convulsivo ~50 %; p. 23).
- e5 *test* con nota `mn-se-lorazepam`: «Lorazepam según el texto» → 0,05-0,1 mg/kg (o 4 mg) en 2 min, repetible una vez; la tabla dice 0,1 repetible a los 5 min (nota de fidelidad, p. 21-22).
**Caso** `mns-tiburcio` (7 pasos) · Tiburcio, 57 a, ♂, 80 kg, epilepsia; deja la medicación.
1. Urgencias, 09:00: crisis tónico-clónica que dura 7 min. *Test* → estado epiléptico (≥5 min, p. 20). Distractor: «esperar a los 30 min».
2. *Test* con `mn-se-calc` (80 kg) → lorazepam **4 mg** IV en 2 min (la Tabla 46.3 da «0,1 mg/kg o 4 mg»; la calculadora lo toma como tope), repetir a los 5 min (p. 22). Distractor: «diazepam 10 mg».
3. 09:12, sigue. *Encuentra el error* (2), plan del R1: «Paso 2: fenitoína a 150 mg/min ✗ (150 mg/min es la fosfenitoína, tres veces más rápida que la fenitoína; p. 22) · Levetiracetam 60 mg/kg: 4.800 mg ✗ (máx 4.500, p. 22-23) · Si cede, levetiracetam 1.000 mg/12 h con niveles ✓ (p. 22) · Glucemia capilar ✓».
4. 09:40 (>30 min), sigue tras levetiracetam 4.500. *Test* → refractario (10-15 %): **intubar antes** y anestésico de la Tabla 46.4 (p. 23). Distractor: «valproico: el paso 2 tiene tres fármacos» (son equivalentes; tras fallar uno, paso 3).
5. *Test* propofol en 80 kg → bolo 80-160 mg (1-2 mg/kg) y 80 mg/h (1 mg/kg/h), subiendo hasta 15 mg/kg/h (p. 23). EEG continuo y neurología (p. 23).
6. **Giro**, día 3 (h 52): sigue a **8 mg/kg/h**. *Test* → por encima del techo de >48 h (5 mg/kg/h, p. 23): cambiar a midazolam (0,2 mg/kg + 0,2 mg/kg/h, hasta 4) o pentobarbital. Distractor: «subir a 10: el techo es 15».
7. *Destapa* «son dos cosas» ¿qué le cuentas a la familia? → mortalidad del refractario hasta 61 % (p. 23) · >30 min puede dejar lesión permanente (p. 21).
**Lo que te llevas**: ≥5 min = estado · máximos 4.500 / 1.500 EF / 3.000 · intubar antes del paso 3; propofol ≤5 mg/kg/h tras 48 h.
**Volver**: `ancla: 'mn-tabla-46-4'` (sin modelo vivo; enlace propofol).
**Para profundizar**: `mn-tabla-46-4` (pentobarbital), `mn-se-refractario` (tiopental, fenobarbital, ketamina en la ref. 1), `mn-se-fosfenitoina` (fallo hepático).
**Cuenta**: 5 + 5 + 7 = 17.

---
## Criterios (R3) y huecos
- Copiados, ninguno nuevo: Tabla 45.4 (p. 11) · posturas (p. 10) · reflejos oculares 50 mL, 5 min (p. 12-13) · GCS ≤8, máx 11, no fiable (p. 13-14) · Tabla 45.6 (p. 15) y matices (p. 14) · apnea (p. 16) · Tabla 46.1 (p. 19) · SE ≥5 min (p. 20) · Tablas 46.3-46.4 (p. 22-23).
- **Fuente pendiente**: naloxona en el coma por opiáceos (cap. 52-53, b6b) · velocidad de la **fenitoína** en mg/min: Marino solo dice que la fosfenitoína va «tres veces más rápido (150 mg/min)»; el plan no escribe «50 mg/min».
- **Lorazepam «0,1 mg/kg (o 4 mg)»**: la calculadora lo lee como tope 4 mg; el caso usa 4 mg y lo dice. No se escribe «8 mg» (la cobertura lo traía: corregido).
- **Cirugía del hematoma de Abundio**: dato del caso, sin criterio en la pregunta (grave G1 del auditor del cráneo). Si se quisiera preguntar, solo con `umi-tce-cirugia` literal (subdural >10 mm o desviación >5 mm; contusión >50 mL, o GCS 6-8 con >20 mL y >5 mm), nunca mezclado con Marino.
- Eduvigis: la cobertura decía «retira al dolor» (M4); se cambia a M1 porque una retirada con propósito no es coma (p. 10).
- `modelo: craneoVivo` en 4 y 5: **espera al cráneo**; no bloquea la construcción de las preguntas.
