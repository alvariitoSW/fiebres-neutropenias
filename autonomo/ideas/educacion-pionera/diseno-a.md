# Maqueta A · Predicción-observación-explicación (POE) en el shock vivo · diseño (fase 2, 28/10/2026)

Ficha: **Shock: definiciones y monitorización** (`mc-definiciones`, Merino Cardiología; los cuatro tipos y la Tabla 14.1).
Modelo: el shock a pie de cama (`js/modules/libros/shock-vivo/`). Archivo a construir: `autonomo/maquetas/educacion/a-poe-shock.html`
(una pantalla a 390 px cada vez; sin guardar nada; sin librerías; los textos de abajo, literales).
Fuente: `docs/marino-2024-shock-caps14-17.pdf` (cada «p.» es página del PDF). «Ver en la ficha» = enlace cruzado
`data-especialidad="cardiologia" data-view="merinoCardiologia" data-panel="panel-merino-cardio-tabs" data-tab="<ficha>" data-resaltar="#<id>"`.

## Qué se ve del modelo (pieza común de las 6 pantallas)
- **Monitor** con las filas del modelo: PA (PAS/PAD, PAM), FC, PVC, PCP, IC, IRVS, ScvO₂, gap PCO₂, SpO₂; debajo el **laboratorio**
  (lactato, diuresis, Hb) con ✓/✗ frente a la Tabla 14.5 (p. 17). Sobre el monitor, el **velo «primero predices»** (como `tapar()` de
  `mayeutica-shock.js`): las filas salen borrosas hasta que se cierra la predicción. Al lado, el dibujo de la **arteriola** (abierta/cerrada)
  y las **cavidades** (pequeñas/grandes), reutilizando `autonomo/maquetas/b3-shock/corazon.js` si entra en un paso; si no, dos SVG mínimos.
- **Mandos** (solo los que use la pantalla; el resto, apagados y a la vista): gravedad (`sepsis 0-100 %`), volumen (+250/+500), noradrenalina
  (5/10/25/30 µg/min), reloj (hora 1). La maqueta no simula: **las cifras son las que da el modelo real** (leídas el 28/10 con
  `autonomo/ideas/educacion-pionera/herramientas/lee-shock.mjs`; tabla al final). La ficha de la paciente se rellena paso a paso y lo nuevo va en rojo.
- **Franja fija arriba** (3 líneas, siempre visible): «Predice → Mira → Explica. Aquí no hay cifra antes de tu apuesta.» y el aviso de evidencia
  (texto exacto): «Nota: no hay estudios de predecir-observar-explicar en médicos (evidencia §1). Esta maqueta se apoya en el efecto de
  pretest (Kornell 2009, Richland 2009) y en la recuperación con feedback (Larsen 2009): apostar antes de ver, aunque falles, se recuerda mejor.»
- Cada pregunta: **test con «piensa antes»** (enunciado solo; botón «Ya lo tengo: ver opciones»), nunca texto libre. Tras elegir: veredicto de
  una línea, sin reproche; cada opción falsa dice qué le habría pasado a la paciente. Botón único de avance: «Seguir».

## Pacientes (lista del bloque b3, lección 9)
Amparo, 58 años, 76 kg (peso ideal 58), pielonefritis obstructiva, urgencias (`PACIENTES.amparo`). Contraste: Mateo, 34 años, 78 kg, herida
abdominal por arma blanca (`PACIENTES.mateo`). FR y temperatura: las del paciente del modelo (ilustrativas).

## Pantalla 1 · Amparo llega. Predicción 1
Se ve: ficha de Amparo (Edad 58 · 76 kg (ideal 58) · Pielonefritis obstructiva · T 39,2 · FR 26) y el monitor **sin velo** con la sepsis al 0 %:
PA 106/67 (PAM 87), FC 71, PVC 4, IC 2,8, IRVS 30, ScvO₂ 90, lactato 1,0, diuresis 1,0. Mando de gravedad a la vista, bloqueado.
Texto: «Hora 0. Aún no hay shock. Vas a subir la sepsis al 100 %. Antes de tocar el mando, apuesta.»
- **Pregunta A1** (test, piensa antes). Enunciado: «Cuando la sepsis llegue al 100 %, ¿qué patrón verás en PVC, gasto (IC) y resistencia (IRVS)?»
  Opciones: (a) «PVC baja · IC bajo · IRVS alta» → porque: «Es el patrón del hipovolémico. Si lo esperas, leerás el gasto alto de Amparo como
  “ya está reanimada” y dejarás los vasos abiertos sin vasopresor.» (b) «PVC baja · IC normal o alto · IRVS baja» → **correcta**.
  (c) «PVC alta · IC bajo · IRVS alta» → porque: «Es el cardiogénico (y el obstructivo). Buscar un corazón que falla te llevaría a un inotrópico
  en un ventrículo hiperdinámico: más taquicardia y nada de presión.» Explicación: «Tabla 14.1: vasodilatador = PVC baja, GC normal o alto,
  RVS baja; es el 66 % de los shocks y el séptico explica la mayoría.» Fuente: p. 3 (Tabla 14.1) y p. 4 (`mc-shock-vasodilatador`). Ver en la ficha: `#mc-tabla-14-1`.
Al elegir no se destapa aún nada: solo «Apuesta cerrada: (b). Ahora mira.» y el botón «Subir la sepsis al 100 %».

## Pantalla 2 · Observación 1 y explicación 1
Se ve: el mando se desliza a 100 % (animación o dos fotogramas con «reducir movimiento»); la arteriola pasa de cerrada a **abierta**; el velo cae.
Tabla antes → después (cifras reales del modelo): PAM 87 → **54** · FC 71 → **123** · PVC 4 → **3** · IC 2,8 → **3,1** · IRVS 30 → **17** ·
ScvO₂ 90 → 90 · lactato 1,0 → **4,0** · diuresis 1,0 → **0,4**. Estado del modelo: «Shock séptico» y su frase viva (p. 10, 57-59).
Veredicto (una línea): «Acertaste: PVC baja, IC alto, IRVS baja.» o «Tu apuesta decía (a)/(c): la PVC bajó, pero el IC subió y la IRVS cayó.»
Chips rojos bajo la tabla: PAM 54 (<65), lactato 4,0 (>2), diuresis 0,4 (<0,5): «los tres objetivos de reanimación de la Tabla 14.5 fallan (p. 17); la definición de shock (PAS <90 o PAM <70, lactato >2, oliguria <0,5 mL/kg/h) está en p. 2».
- **Pregunta A2** (autoexplicación, test con opciones). Enunciado: «Amparo está en shock y, sin embargo, su gasto ha subido (IC 2,8 → 3,1). ¿Por qué?»
  (a) «El corazón compensa la fuga capilar bombeando con más fuerza» → porque: «La sepsis deprime el miocardio, no lo refuerza. Si crees que el
  corazón “va sobrado”, no vigilarás la disfunción miocárdica que el libro describe.» (b) «Taquicardia y poscarga baja: los vasos abiertos dejan
  vaciarse al VI» → **correcta**. (c) «El gasto alto es un artefacto de la ScvO₂ de 90 %» → porque: «La ScvO₂ alta es otro hallazgo: extracción
  de O₂ deteriorada. Mezclarlos te haría leer un gasto “falso” y retrasar el vasopresor.» Explicación: «El problema principal es la hipotensión
  por vasodilatación sistémica; pese a la disfunción miocárdica, el gasto suele subir por la taquicardia y la caída de la poscarga del VI. El
  endotelio dañado deja salir líquido: hipovolemia (PVC 3).» Fuente: p. 57-58 (`mc-sepsis-hemodinamica`, ficha `mc-shock-septico`); ScvO₂ ≥80 %
  característica del séptico: p. 9-10 (`#mc-scvo2`). Un paso más: «Mira la arteriola abierta: IRVS 17. Eso es lo que la ecuación llama RVS baja
  (PAM = GC × RVS + PVC (presión de la aurícula derecha, «RAP» en la fuente), p. 2-3, `#mc-shock-ecuacion`).»

## Pantalla 3 · Condición cambiada: Mateo. Predicción 2 y explicación 2
Se ve: ficha nueva (Mateo, 34 años, 78 kg, herida abdominal por arma blanca; ha perdido el 35 % de la volemia = clase III, 66 mL/kg × 78 kg,
p. 21-23). Monitor **con velo**. Texto: «Mismo monitor, otra herida. Apuesta antes de ver.»
- **Pregunta A3** (test, piensa antes). Enunciado: «Mateo ha perdido un 35 % de su sangre. ¿Qué patrón verás?» Mismas tres opciones que A1
  (barajadas). **Correcta: (a)** PVC baja · IC bajo · IRVS alta. Porque de (b): «Es el patrón de Amparo. Si esperas un gasto alto, el IC de 1,8
  te parecerá “un corazón que falla” y pensarás en inotrópicos cuando lo que falta es sangre.» Porque de (c): «La PVC alta es del corazón que no
  se vacía o del que no se llena; Mateo tiene las cavidades vacías (PVC 1). Buscar un taponamiento aquí retrasa la transfusión.»
  Fuente: p. 3 (Tabla 14.1), p. 22-23 (`#mc-clase-iii`, ficha `mc-hemorragico-clasificacion`).
Observación 2 (cae el velo; arteriola **cerrada**, cavidades pequeñas): PA 78/63 (PAM 71), FC 135, PVC 1, IC 1,8, IRVS 38, ScvO₂ 65 (ilustrativo; cae en el rango normal 65-75 %, p. 9: no avisa de bajo flujo), gap 5 (ilustrativo; 2-5 normal, patológico >6, p. 10),
lactato 3,0, diuresis 0,9 mL/kg/h, Hb 13,8. Estado: «Hemorragia, clase III» (p. 22-23). Frase: «La Hb aún no baja: pierde sangre entera; no baja hasta
las 8-12 h» (p. 23, `#mc-hto-trampa`).
- **Pregunta A4** (autoexplicación, test). Enunciado: «Amparo y Mateo tienen los dos la PVC baja. ¿Por qué la IRVS de Mateo es 38 y la de Amparo 17?»
  (a) «En el bajo flujo, el simpático y la renina-angiotensina cierran la arteriola para sostener la PA; en la sepsis lo que falla es la propia
  RVS» → **correcta**. (b) «Mateo tiene menos volumen que repartir y por eso la resistencia sube» → porque: «La IRVS es resistencia, no volumen:
  es la arteriola cerrada. Si lo confundes, esperarás que la IRVS baje con suero y leerás mal la respuesta.» (c) «En Amparo el gasto alto “lava”
  las resistencias» → porque: «Es el sentido al revés: la vasodilatación es la causa y el gasto alto la consecuencia (poscarga baja). Pensarlo así
  te haría bajar el gasto para “subir” la RVS.» Explicación: «3 de los 4 shocks cursan con gasto bajo y RVS alta: la vasoconstricción
  compensadora (simpático + renina-angiotensina-aldosterona) limita la caída de PA en el bajo flujo.» Fuente: p. 3 (nota de la Tabla 14.1);
  sepsis p. 57-58. Ver en la ficha: `#mc-tabla-14-1`. Cierre: «Y la clase III se repone con sangre, no con la PVC» (p. 22-23).

## Pantalla 4 · Vuelta a Amparo: el volumen. Predicción 3 y explicación 3 (piensa y destapa)
Se ve: Amparo, sepsis 100 %, hora 0 (PAM 54, PVC 3). Ficha: Plan: «1.750 mL de cristaloide (≥30 mL/kg de peso ideal, 58 kg, en 3 h)» en rojo
(p. 11, `#mc-vol-ini-septico`). Monitor con velo. Mando de volumen y reloj a la vista.
- **Pregunta A5** (test, piensa antes). Enunciado: «Pones los 1.750 mL. Predice el monitor justo al acabar (hora 0) y una hora después.»
  (a) «Hora 0: PAM ≥65 y PVC alta; hora 1: igual, el volumen se queda en el vaso» → porque: «Solo ~25 % del cristaloide queda en el plasma;
  esperar que se quede te haría dar por reanimada a una paciente que volverá a la hipotensión.» (b) «Hora 0: PAM sube y PVC sube; hora 1: la PAM
  vuelve a caer y la PVC vuelve casi a la de entrada» → **correcta**. (c) «No cambia nada: en la sepsis el problema no es el volumen» → porque:
  «El endotelio dañado produce hipovolemia real y el libro da un volumen inicial. Negárselo deja la precarga vacía y hace inútil el vasopresor.»
  Fuente: p. 11 (`#mc-volumen-inicial`: 25 % plasma, 75 % intersticio); p. 57-58 (fuga capilar).
Observación 3, dos fotogramas: **hora 0** PA 111/43 (PAM 77), FC 93, PVC 11, PCP 14, IC 4,2, IRVS 16 (aviso del modelo: «cerca del techo PVC 11»);
**hora 1** PA 86/39 (PAM 63), FC 114, PVC 5, PCP 8, IC 3,5, IRVS 17, lactato 4,2, diuresis 0,7. **Giro**: en rojo, «PAM 63 a la hora 1: el volumen no bastó».
- **Pregunta A6** (piensa y destapa, «son dos cosas»). Enunciado: «El adjunto: “¿por qué a la hora 1 la PAM ha vuelto a 63 si acabas de meter
  1,75 L?”» Puntos: 1) «De cada litro de cristaloide solo ~25 % queda en el plasma; ~75 % pasa al intersticio» (p. 11). 2) «El endotelio dañado
  deja salir líquido: la hipovolemia de la sepsis se rehace» (p. 57-58). El usuario marca uno a uno los que tenía; lo que falte, vuelve en el repaso.
  Explicación: «Si no se alcanza la PA objetivo y hay otra evidencia de compromiso (lactato 4,2, diuresis 0,7 ya ✓ pero PAM <65), se inicia un
  vasopresor» (p. 11). Botón: «Seguir: la noradrenalina».

## Pantalla 5 · La noradrenalina. Predicción 4 y «encuentra el error»
Se ve: Amparo, hora 1 (PAM 63, IRVS 17, IC 3,5). Mando de noradrenalina: 5 → 10 → 25 µg/min. Monitor con velo.
- **Pregunta A7** (test, piensa antes). Enunciado: «Subes la noradrenalina de 5 a 25 µg/min. ¿Qué sube más, y por qué?»
  (a) «La IRVS y la PAM: por encima de 10 µg/min predomina el efecto α» → **correcta**. (b) «El IC: la noradrenalina es sobre todo β» → porque:
  «La β manda a dosis bajas; por encima de 10 predomina la vasoconstricción α. Esperar gasto en vez de presión te haría subir la dosis sin
  entender qué miras.» (c) «La PVC: la noradrenalina cierra la fuga capilar y devuelve el volumen» → porque: «La ficha no da ese efecto; la
  PVC apenas se mueve. Fiarte de ella como señal de respuesta te haría parar un vasopresor que sí funciona.»
  Observación 4 (hora 0, cifras del modelo): NA 5: PAM 59, IRVS 18, IC 3,2, FC 123 · NA 10: PAM 63, IRVS 18 · NA 25: PAM **78**, IRVS **22**,
  IC 3,3, FC 94, PVC 4. Explicación: «Por encima de 10 µg/min predomina la vasoconstricción α; a 30 µg/min, más dosis apenas aprieta: se añade
  un segundo vasopresor.» Fuente: p. 12-13 (`#mc-norepinefrina`, ficha `mc-vasopresores`). Nota visible: «Las magnitudes de IRVS son del
  modelo (ilustrativas); la dirección es de la ficha.»
- **Pregunta A8** (encuentra el error; «puede haber 0, 1 o 2»). Enunciado: «El plan del R1 de guardia para Amparo. Marca lo que está mal.»
  1. «PVC 3, IC 3,1 e IRVS 17: patrón vasodilatador de la Tabla 14.1.» (verdadera, p. 3)
  2. «Su ScvO₂ de 90 % dice que el aporte de O₂ sobra: no necesita más volumen.» **error** → buena: «ScvO₂ ≥80 % es característica del shock
  séptico: extracción de O₂ deteriorada, no aporte sobrado» (p. 9-10, `#mc-scvo2`).
  3. «Volumen inicial ≥30 mL/kg de peso ideal (58 kg ≈ 1,75 L) en las primeras 3 h.» (verdadera, p. 11)
  4. «Si tras el volumen la PAM no llega a 65 y sigue oligúrica, empiezo noradrenalina.» (verdadera, p. 11; objetivo PAM ≥65, p. 17)
  5. «Mateo también tiene la PVC baja, así que se trata igual: cristaloide hasta que la PVC suba.» **error** → buena: «La clase III se repone
  con sangre; y 3/4 del cristaloide se van al intersticio» (p. 22-23 `#mc-clase-iii`; p. 11). Marcar la 1, 3 o 4 también es fallo.
  Tras corregir, cada error pide pensar la frase buena antes de verla (botón «Ver la frase buena»).

## Pantalla 6 · Lo que te llevas, el repaso y la elección
- **Lo que te llevas** (3 puntos): «Tabla 14.1: el vasodilatador es el único con la RVS baja y el gasto alto; hipovolémico, cardiogénico y
  obstructivo tienen la RVS alta por compensación» (p. 3). «Del cristaloide, ~25 % queda en el plasma; si la PA no vuelve y hay compromiso,
  vasopresor» (p. 11). «Noradrenalina: β a dosis bajas, α por encima de 10 µg/min, segundo vasopresor a 30» (p. 12-13).
- **Repaso** (texto fijo; la maqueta no guarda): «En la app, las apuestas que fallaste (A1-A8) volverían como primera pregunta al abrir esta
  ficha, mezcladas con las de otras fichas, y la fecha del último intento ordenaría cuáles antes (decisión del 28/10).»
- Camino de vuelta: «Ver en la ficha: Tabla 14.1» (`#mc-tabla-14-1`) y «Abrir el shock vivo con Amparo con la sepsis al 100 %» (`data-shock-vivo="septico"`).
- Segunda nota de evidencia (misma frase que arriba) y la pregunta al usuario: «¿Con cuál sigues? **A** (predecir antes de ver, esta) ·
  **B** (tratar sin guía y ver la consecuencia, capilar vivo) · **C** (mezclar fichas y repasar días después, río y mar) · o una mezcla: di cuál.»

## Tabla de cifras del modelo (leídas el 28/10/2026; origen: modelo; la dirección, Tabla 14.1)
| Estado | PAM | PAS/PAD | FC | PVC | PCP | IC | IRVS | ScvO₂ | gap | lactato | diuresis |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Amparo sepsis 0 % | 87 | 106/67 | 71 | 4 | 10 | 2,8 | 30 | 90 | 4 | 1,0 | 1,0 |
| Amparo sepsis 100 % | 54 | 73/34 | 123 | 3 | 6 | 3,1 | 17 | 90 | 4 | 4,0 | 0,4 |
| Amparo +1.750 mL, hora 0 | 77 | 111/43 | 93 | 11 | 14 | 4,2 | 16 | 90 | 3 | 4,0 | 0,4 |
| Amparo +1.750 mL, hora 1 | 63 | 86/39 | 114 | 5 | 8 | 3,5 | 17 | 90 | 3 | 4,2 | 0,7 |
| Amparo NA 5 / 10 / 25 µg/min (hora 0) | 59 / 63 / 78 | 79/38 · 84/41 · 105/50 | 123 / 122 / 94 | 3 / 4 / 4 | 6 / 7 / 8 | 3,2 / 3,3 / 3,3 | 18 / 18 / 22 | 90 | 3 | 4,0 | 0,4 |
| Mateo hemorragia 35 % | 71 | 78/63 | 135 | 1 | 3 | 1,8 | 38 | 65 | 6 | 3,0 | 0,9 |

## Huecos (no se rellenan)
- La ficha no da cifras de IRVS ni cortes de IC para «sin shock»: la maqueta solo juzga direcciones (baja/alta), como la Tabla 14.1.
- El modelo no baja el lactato a la hora 1 aunque suba la PAM con noradrenalina (lactato 4,0-4,2): no se promete «el lactato cae»; se dice «la meta sigue siendo el lactato» (p. 17).
- POE en médicos: sin estudios (evidencia §1). Se mide con la prueba de 3 días (rúbrica).

## Criterios clínicos (REGLAS §4.8 R3) y topes
Shock = PAS <90 o PAM <70, lactato >2, oliguria <0,5 mL/kg/h (p. 2). Metas de reanimación (Tabla 14.5): PAM ≥65, lactato <2, diuresis >0,5 mL/kg/h (p. 17). Volumen inicial séptico ≥30 mL/kg peso ideal en 3 h
(p. 11). Vasopresor si la PA objetivo no se alcanza y hay otra evidencia de compromiso (p. 11). Noradrenalina: α >10 µg/min, techo 30 (p. 12-13).
Topes de la maqueta: los mandos están **fijos a los pasos del guion** (no se pueden pasar); el +2 L y la NA 30 salen apagados con la nota «fuera del guion».
