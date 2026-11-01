# Plan de estudio · b6a · grupo 6A «El despierto que se apaga» (Marino cap. 45) — profesor, modo diseñar, 01/11/2026

Fuente **N** = `docs/marino-2024-neurologia-caps45-47.pdf` (p. = página del PDF = `#page=N`, desplazamiento 0; cotejado con `pdftotext` página a página).
Ficha: `js/modules/libros/marino-neuro.html` (`mn-consciencia` l. 218, `mn-delirio` l. 289, `mn-abstinencia` l. 372). Vista Visual ya montada:
`visual-marino-caps45-53.js` l. 19-60. Formato de datos: cabecera de `js/data/mayeutica/b1-fluidos.js`; motor `js/core/mayeutica-motor.js`.
Archivo propuesto: `js/data/mayeutica/b6a-despierto.js` (≈380 líneas), con `pag()` y `enFicha()` copiados de `b3a-shock-1.js` y `PDF` = N.
Prefijos de id (comprobados sin choque con grep en `js/`): `mnc-` consciencia, `mnd-` delirio, `mna-` abstinencia.
**No espera a ninguna maqueta**: figuras reales y calculadoras ✅. Solo la ficha 1 tiene un estado del cráneo vivo, marcado «espera al cráneo»;
hasta entonces su «Compruébalo en el modelo» abre la vista Visual de la ficha (panel «Los dos componentes»).

## Ruta del grupo
**1 `mn-consciencia` → 2 `mn-delirio` → 3 `mn-abstinencia`**. Los dos ejes (despertar × conciencia, Tabla 45.1, p. 2) son el mapa; el
delirio es «despierto sin conciencia que fluctúa» (p. 3); la abstinencia es el delirio que **no** es el de la UCI (p. 4) y que sí tiene reloj (Tabla 45.3).
Cada ficha: Mira (carril + figura) → Juega (calculadora o modelo) → Piensa (guía) → Examínate (MIR) → Caso → Para profundizar.

---
## 1 · `mn-consciencia` (p. 2-4) — paciente **Leovigildo, 38 a** (ictus pontino)
**Carril de 30 s** · Idea: la consciencia tiene **dos ejes, despertar y conciencia del entorno**; cada estado es lo que pierde (Tabla 45.1, p. 2).
Cifras: vegetativo **persistente al mes** (p. 3) · locked-in = solo **mirada vertical y parpadeo** (p. 3) · 4 causas más frecuentes en UCI (p. 4).
Figura: Fig. 45.1 real (`mar-img-45-1`, p. 4). Modelo: cráneo `sano` → `coma` / `vegetativo` / `locked-in` (**espera al cráneo**; patrón `locked-in` de la cara, pieza común 3).
**Mira/Juega**: vista Visual «Los dos componentes» (3 columnas); con el cráneo: cambiar de estado y ver qué hace la cara (ojos cerrados / abiertos sin seguir / abiertos que miran arriba a la orden).
**Piensa (guía)**
- g1 *test* `mn-cons-despertar · mn-cons-conciencia · mn-tabla-45-1`: «Un paciente abre los ojos al entrar tú pero no te sigue con la mirada: ¿qué eje conserva?» → despertar sin conciencia (p. 2-3). Distractores: «ninguno: coma» (abrir los ojos es despertar, p. 10); «los dos: letargia» (letargia = atención cambiada con conciencia intacta, p. 3).
- g2 *test* `mn-cons-lockedin` (`modelo: craneo 'locked-in'`, espera al cráneo): «¿Qué le queda a quien tiene rota la vía motora de los dos lados de la protuberancia ventral?» → movimientos oculares verticales y parpadeo, con despertar y conciencia intactos (p. 3). Distractores: «la mirada lateral» (no: solo arriba-abajo, p. 3); «nada: es un coma» (despertar y conciencia intactos).
- g3 *test* `mn-cons-vegetativo · mn-cons-coma`: «Vegetativo y coma pueden retirar el brazo al dolor profundo: ¿qué los separa?» → el despertar (ojos que se abren); los movimientos son sin propósito en los dos (p. 3). Distractor: «el vegetativo tiene movimientos con propósito» (no, p. 3).
- g4 *destapa* «son dos cosas» `mn-cons-muerte`: ¿en qué se diferencia la muerte encefálica del coma? → (1) pérdida de **toda la función del tronco** (pares craneales y respiración); (2) **siempre irreversible** (p. 3).
- g5 *encuentra el error* (1 error) `mn-cons-causas · mn-cons-crisis`, nota de guardia: «Causas más frecuentes de alteración de la consciencia en esta UCI: sedación en VM ✓ · shock ✓ · encefalopatías isquémica, séptica y metabólica ✓ · sobredosis o abstinencia ✓ · las crisis no convulsivas son rarísimas y no hace falta pensar en ellas ✗» → buena: «se pasan por alto a menudo» (p. 4).
**Examínate (MIR)**
- e1 *test* `mn-tabla-45-1`: «¿En qué cuadrante de la Tabla 45.1 está el estupor?» → despierta pero no consciente (p. 2; despertarlo cuesta, p. 3). Distractores: «ni despierta ni consciente» (es el coma); «despierta y consciente» (ansiedad, letargia, locked-in).
- e2 *test* `mn-cons-vegetativo`: «¿Cuándo pasa a llamarse persistente el estado vegetativo?» → al mes (p. 3). Distractores verosímiles: 3 meses, 6 meses (cifras de otras fuentes que la ficha no da: la explicación dice que el libro solo da «un mes»).
- e3 *test* `mn-cons-delirio`: «Delirio y demencia comparten despertar intacto con conciencia alterada; ¿qué los separa en la Tabla 45.1?» → fluctuante frente a permanente (p. 3).
- e4 *test* `mn-cons-psicosis`: «¿Dónde coloca la Tabla 45.1 la psicosis?» → despierta sin conciencia del entorno (p. 2); el capítulo no la describe aparte (nota de la ficha). Distractor: «despierta y consciente».
**Caso** `mnc-leovigildo` (vive aquí; 5 pasos) · Leovigildo, 38 a, ♂, HTA mal controlada.
1. Día 0, 23:10: cefalea brusca y caída; PA 170/95, FC 88, SpO₂ 96 %. Ojos abiertos, no habla, no mueve brazos ni piernas. El R1 escribe «coma». *Test* ¿coma? → no: abrir los ojos espontáneamente indica despertar y no es compatible con el coma (p. 10). Distractores: «sí, no responde» · «sí, si el GCS es ≤8».
2. *Test* ¿vegetativo o locked-in? Le pides «mira arriba» y «parpadea dos veces»: lo hace. → locked-in: despertar y conciencia intactos, solo mirada vertical y parpadeo (p. 3). Distractor: «vegetativo: abre los ojos sin conciencia» (obedece: hay conciencia).
3. **Giro**, día 1: TC/RM con infarto de la **protuberancia ventral, bilateral**. *Destapa* «son dos cosas» ¿por qué cuadra? → lesión bilateral de las vías motoras en la protuberancia ventral (p. 3) · respeta la mirada vertical y el parpadeo (p. 3).
4. Día 2: *Encuentra el error* (1 error), nota del R1: «Leovigildo, 38 a. Estado vegetativo tras ictus de tronco ✗ (obedece con los ojos: locked-in, consciente; p. 3) · Ojos abiertos espontáneamente ✓ · Comunica sí/no con parpadeos ✓ · Explicar a la familia lo que ocurre y lo que probablemente ocurrirá ✓ (`mn-me-familia`, p. 16)».
5. Día 30: *Test* la familia pregunta si «ya es persistente». → El término «persistente» es del **estado vegetativo** al mes (p. 3); Leovigildo no está vegetativo. Distractor: «sí, al mes todo trastorno de la consciencia es persistente».
**Lo que te llevas**: ojos abiertos ≠ coma (p. 10) · locked-in = protuberancia ventral bilateral, mira arriba y parpadea (p. 3) · vegetativo persistente = al mes (p. 3).
**Volver**: `ancla: 'mn-cons-lockedin'`, `modelo: { craneoVivo: 'locked-in' }` (espera al cráneo; hasta entonces sin `modelo`).
**Para profundizar**: `mn-cons-ansiedad` (ansiedad y letargia), `mn-cons-psicosis`, `mn-cons-estupor`. Enlace a `mn-convulsiones` (botón ya en la ficha).
**Cuenta**: 5 guía + 4 examen + caso 5 pasos = 14.

---
## 2 · `mn-delirio` (p. 4-7 y Apéndice 2) — paciente **Genoveva, 79 a** (neumonía, VM)
**Carril de 30 s** · Idea: el delirio es **fallo cerebral del crítico**; el más frecuente es el **hipoactivo**, el que no se ve (p. 4-5).
Cifras: **25-50 %** de los pacientes de UCI (p. 4) · CAM-ICU = **I + II + (III o IV)** (Apéndice 2, `mn-cam-calc`) · haloperidol **no si QTc >500 ms** (Tabla 45.2, p. 6-7).
Figura: Fig. 45.2 real (`mar-img-45-2`, p. 5-6). Sin modelo vivo nuevo: asistente CAM-ICU y calculadora de dexmedetomidina ✅ (vista Visual l. 31-44).
**Mira/Juega**: la Fig. 45.2; el asistente CAM-ICU paso a paso con Genoveva; `mn-dex-calc` con 60 kg (carga 60 µg; 12-90 µg/h).
**Piensa (guía)**
- g1 *test* `mn-del-tipos`: «¿Qué tipo de delirio es el más frecuente, y por qué se escapa?» → el hipoactivo; se pasa por alto por la idea de que el delirio es siempre agitación (p. 5). Distractores: «hiperactivo» · «mixto».
- g2 *test* `mn-del-sedacion`: «Si quieres prevenir el delirio en tu paciente ventilado, ¿qué sedante evitas primero?» → benzodiacepinas, principales promotoras (p. 5). Distractores: «propofol» · «dexmedetomidina» (la preferida en la Tabla 45.2).
- g3 *test* con calculadora `mn-cam-calc`: «Fluctuante sí, inatención sí, pensamiento desorganizado no, nivel alterado (letárgico) sí: ¿CAM-ICU?» → positivo (I + II + IV; Apéndice 2). Distractor: «negativo: falla el III» (basta III **o** IV).
- g4 *destapa* «son dos cosas» `mn-del-demencia`: ¿qué tiene el delirio que no tiene la demencia, si ambos comparten inatención y pensamiento desorganizado? → comienzo agudo · curso fluctuante (p. 5).
- g5 *test* `mn-del-tratamiento`: «¿Para qué das haloperidol o dexmedetomidina a un paciente con delirio?» → solo para calmar al muy agitado; ningún fármaco previene ni corrige el delirio (p. 5). Distractor: «para acortar el delirio» · «para prevenirlo en el anciano».
**Examínate (MIR)**
- e1 *test* `mn-del-psicosis`: «¿Qué porcentaje de hospitalizados con delirio tiene síntomas psicóticos?» → >40 % (p. 5). Distractores: 10 %, 25 % (la cifra de incidencia de p. 4 como trampa).
- e2 *test* `mn-tabla-45-2`: «Haloperidol 5 mg IV sin efecto a los 15 min: ¿qué dice la Tabla 45.2?» → doblar a 10 mg o cambiar de fármaco; mantener con el 25 % de la dosis eficaz cada 6 h (p. 6-7). Distractores: «repetir 5 mg cada 15 min hasta 20 mg» · «mantener con el 50 % cada 4 h» (con nota: el cap. 6 da «20 min y cada 4-6 h», `mn-comparativa-delirio`).
- e3 *test* `mn-tabla-45-2`: «Paciente muy agitado sin vía venosa: ¿qué fármaco tiene una vía que le sirve?» → ziprasidona IM 10 mg/2 h o 20 mg/4 h, máx 40 mg/día (p. 6-7). Lleva la nota de interpretación de la ficha (la ziprasidona también existe por vía oral). Distractor: «dexmedetomidina IM».
- e4 *test* `mn-tabla-45-2`: «Efecto adverso de la dexmedetomidina descrito en la Tabla 45.2, además de bradicardia e hipotensión» → abstinencia con hiperexcitabilidad (p. 7). Distractor: «QT largo» (es del haloperidol).
- e5 *test* `mn-del-prevencion`: «¿Qué pasó con las medidas de prevención (dolor, sueño, familia, movilización, sin BZD) en el crítico?» → no han funcionado (p. 7). Distractor: «reducen el delirio a la mitad».
**Caso** `mnd-genoveva` (6 pasos) · Genoveva, 79 a, ♀, 60 kg, neumonía, VM, midazolam.
1. Día 2 de VM, 10:00: RASS no dado; abre los ojos a la voz, no sigue órdenes, se vuelve a dormir. Ayer estaba despierta. *Test* con `mn-cam-calc`: I sí, II sí, IV (letárgica) sí → **delirio hipoactivo** (p. 5). Distractor: «sedación adecuada, no delirio».
2. *Test* ¿qué cambias primero? → retirar la benzodiacepina (promotora, p. 5). Distractores: «haloperidol 5 mg» (no está agitada; no trata el delirio, p. 5) · «aumentar el midazolam».
3. Día 3, 03:00: se arranca la sonda, FC 112, PA 158/84. ECG: **QTc 520 ms**. *Test* ¿haloperidol? → no: QTc >500 (p. 6-7); dexmedetomidina, preferida (Tabla 45.2). Distractor: «haloperidol 5 mg y repetir ECG».
4. *Test* con `mn-dex-calc` (60 kg) → carga opcional 60 µg en 10 min; 12-90 µg/h (p. 6-7). Distractor: «carga 600 µg» (µg/kg confundido).
5. **Giro**, día 4: FC 46, PA 86/50 con 80 µg/h. *Test* → efecto de la dexmedetomidina (bradicardia e hipotensión, Tabla 45.2): bajar el ritmo. Distractor: «añadir haloperidol».
6. *Encuentra el error* (2 errores), plan del R1: «Delirio hiperactivo de madrugada ✓ · Lorazepam 2 mg/4 h si se agita ✗ (BZD, principal promotora; p. 5) · Haloperidol 5 mg; si a los 15 min no hay efecto, 10 mg ✗ en Genoveva (QTc 520 >500; p. 6-7) · Dexmedetomidina en vez de haloperidol ✓ (preferida, Tabla 45.2) · CAM-ICU cada turno ✓ (herramienta validada, p. 5)».
**Lo que te llevas**: el hipoactivo es el frecuente y se escapa · CAM-ICU = I + II + (III o IV) · ningún fármaco previene ni corrige; QTc >500 = sin haloperidol.
**Volver**: `ancla: 'mn-tabla-45-2'` (sin modelo vivo).
**Para profundizar**: `mn-comparativa-delirio` (Marino cap. 6 y Libro Azul), `mn-nota-cam` (dos versiones del CAM), `mn-del-causas`; enlaces `mar-sedacion` y `inmuno-encefalopatia-diagnostico` (ya en la ficha).
**Cuenta**: 5 + 5 + 6 = 16.

---
## 3 · `mn-abstinencia` (p. 7-9) — paciente **Baldomero, 44 a** (alcohol)
**Carril de 30 s** · Idea: la Tabla 45.3 es **un reloj desde la última copa**; las benzodiacepinas imitan al alcohol en el GABA (p. 7-8).
Cifras: convulsiones **6-48 h** (riesgo máximo a las 24 h) · delirium tremens **48-96 h, 5 %** · resistencia = **30-40 mg** de lorazepam en 3-4 h (p. 7-9).
Figura: la línea de la vista Visual (l. 45-59) y `mn-oh-calc` ✅ (origen ilustrativo, ya rotulado). Sin modelo vivo.
**Mira/Juega**: mover las horas de `mn-oh-calc` (10 → 20 → 60 → 170 h) y ver qué rasgo entra; `mn-lzp-calc` con 70 kg, 8 mg/h, 50 h.
**Piensa (guía)**
- g1 *destapa* «son dos cosas» `mn-abstinencia` (intro): ¿por qué la abstinencia excita? → el alcohol estimula la liberación de GABA, inhibidor (p. 7) · el consumo crónico aumenta la densidad de receptores GABA (p. 7).
- g2 *test* `mn-tabla-45-3 · mn-oh-orden` con `mn-oh-calc`: «Predice: a las 10 h de la última copa, ¿qué puede haber y qué aún no?» → precoz (6-8 h) y posibles convulsiones (6-48 h); el DT aún no (48-96 h) (p. 8). Distractor: «DT: es lo más grave».
- g3 *test* `mn-oh-convulsiones`: «Convulsión a las 20 h: ¿qué das?» → lorazepam 2 mg IV, previene recurrencias; fenitoína no indicada (p. 7-8). Distractores: «fenitoína 20 mg/kg» · «levetiracetam como en el estado epiléptico».
- g4 *test* `mn-oh-uci` con `mn-lzp-calc`: «¿Por qué parar a las 48 h una infusión de lorazepam ≥0,1 mg/kg/h?» → toxicidad del propilenglicol (p. 8; también diazepam). Distractor: «tolerancia» · «depresión respiratoria».
- g5 *test* `mn-oh-wernicke`: «¿Por qué empeora la mente a los pocos días del ingreso con sueros glucosados?» → la glucosa gasta la poca tiamina que quedaba (p. 9). Distractor: «hipoglucemia de rebote».
**Examínate (MIR)**
- e1 *test* `mn-oh-dt`: «¿Qué forma del delirio no existe en la abstinencia alcohólica?» → la hipoactiva (p. 8). Distractor: «la hiperactiva».
- e2 *test* `mn-oh-dt`: «DT que dura más de 5 días» → buscar otra causa (p. 8). Distractor: «añadir fenobarbital».
- e3 *test* `mn-oh-resistencia`: «¿Qué define la resistencia a las BZD?» → no control pese a 30-40 mg de lorazepam o 150-200 mg de diazepam IV en 3-4 h (p. 8-9). Distractores: «10 mg de lorazepam en 1 h» · «30-40 mg en 24 h».
- e4 *test* `mn-oh-propofol · mn-oh-fenobarbital · mn-oh-dex`: «Complemento preferido si está intubado» → propofol (p. 9). Distractores: «dexmedetomidina» (experiencia poco alentadora, p. 9) · «fenobarbital 130-260 mg cada 15-20 min» (eficaz, con cautela por hipotensión y depresión respiratoria, p. 9).
- e5 *test* `mn-oh-escalas`: «¿Qué escala usas en el delirio de abstinencia?» → CAM-ICU; la CIWA-Ar no se recomienda en el delirio (p. 7).
- e6 *test* `mn-oh-gabapentina`: «Delirio hiperactivo 3 días tras suspender gabapentina 3.600 mg/día; las BZD no hacen nada» → abstinencia de gabapentina (≥3.000 mg/día, 12 h-7 d; las BZD no sirven, p. 9). Distractor: «DT resistente».
**Caso** `mna-baldomero` (7 pasos) · Baldomero, 44 a, ♂, 70 kg; ingresa por pancreatitis; bebe a diario.
1. Día 0, h 10 desde la última copa: temblor, ansiedad, náuseas; FC 104, PA 150/90. *Test* con `mn-oh-calc` (10 h) → abstinencia precoz; ventana de convulsiones abierta (p. 8). Distractor: «DT inminente».
2. h 20: convulsión generalizada de 1 min, recupera. *Encuentra el error* (2), plan del R1: «Lorazepam 2 mg IV ✓ · Añado fenitoína para evitar recurrencias ✗ (no indicada, p. 8) · Escala CIWA-Ar si aparece delirio ✗ (en el delirio, CAM-ICU; p. 7) · Siempre por vía IV en la UCI ✓ (p. 8)».
3. Día 2, h 60: T 38,6 °C, FC 128, PA 165/100, alucinaciones, agitado. *Test* → delirium tremens (48-96 h, p. 8). Distractor: «sepsis abdominal, sin abstinencia» (hay que buscarla, pero el reloj y la clínica encajan).
4. 3 h de lorazepam 4 mg cada 5-10 min: **36 mg** y sigue agitado. *Test* → resistencia (30-40 mg en 3-4 h, p. 8-9): intubar y propofol (p. 9). Distractores: «otros 40 mg» · «dexmedetomidina sola» (poco alentadora).
5. *Test* con `mn-lzp-calc` (70 kg, 8 mg/h, 50 h) → 0,114 mg/kg/h, >48 h: retirar o cambiar por el propilenglicol (p. 8). Distractor: «dosis baja, seguir».
6. **Giro**, día 7: extubado; glucosado al 5 % desde el ingreso con tiamina 100 mg/día; confuso de nuevo, nistagmo, no abduce el ojo derecho. *Destapa* «son tres cosas» → delirio >5 días: buscar otra causa (p. 8) · Wernicke: la glucosa gasta la tiamina (p. 9) · los 100 mg/día no bastan para tratarlo (p. 9; dosis en cap. 48, `mu-tiamina`).
7. *Test* ¿qué le pides al cap. 48? → la dosis de tratamiento de la tiamina: **el cap. 45 no la da** (se enlaza, no se inventa). Distractor: «100 mg IV una vez».
**Lo que te llevas**: la Tabla 45.3 es un reloj · 30-40 mg en 3-4 h = resistencia → propofol intubado · la glucosa gasta la tiamina.
**Volver**: `ancla: 'mn-tabla-45-3'` (sin modelo vivo; la vista Visual abre la línea).
**Para profundizar**: `mn-oh-dex` (poco alentadora), `mn-oh-propofol` (dosis del cap. 6, enlace `mar-sedacion`), `mn-oh-gabapentina` (si no entra en e6). Enlace `mu-tiamina` (cap. 48).
**Cuenta**: 5 + 6 + 7 = 18.

---
## Criterios (R3) que usa el grupo, sin decidir nada nuevo
Todos copiados de la ficha y su página: Tabla 45.1 (p. 2) · vegetativo persistente al mes (p. 3) · coma y apertura ocular (p. 10) · CAM-ICU I + II + (III o IV) (Apéndice 2,
`mn-cam-calc`) · Tabla 45.2 (p. 6-7) · Tabla 45.3 (p. 8) · resistencia 30-40 mg / 150-200 mg en 3-4 h (p. 8-9) · infusión ≥0,1 mg/kg/h ≤48 h (p. 8) · DT >5 días (p. 8).
Ninguna regla de UMI ni de volúmenes de hematoma entra en 6A.

## Huecos («fuente pendiente») y avisos al constructor
- Dosis de **tiamina para tratar el Wernicke**: no está en el cap. 45 → enlace `mu-tiamina` (cap. 48), no se escribe en el caso.
- **Ziprasidona «solo IM»**: se pregunta como lo dice Marino (vía IM útil sin vía IV) y con la nota de interpretación de la ficha; nunca como «error» del R1.
- Los distractores «3 meses / 6 meses» del vegetativo no se atribuyen a ninguna fuente: la explicación dice solo que el libro da un mes.
- Caso Genoveva paso 6: el error del haloperidol es **de Genoveva** (QTc 520), no de la pauta: la frase buena dice «en Genoveva no: QTc >500».
- Cráneo `locked-in`: **espera al cráneo** (y a la pieza común 3, `dibujarCara` con patrón `locked-in`).
