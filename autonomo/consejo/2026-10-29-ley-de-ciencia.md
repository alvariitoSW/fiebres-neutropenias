# Consejo de Ministros extraordinario · 29/10/2026 · Ley de Ciencia

Convocado por el gobierno central el 29/10: «que todos estos informes pasen por el congreso, quiero que redacten una
ley, para ver qué hacemos con estos proyectos, si los unimos, si usamos uno para el pulmón, o qué hacemos en este
punto, y que decidan todo ellos pero que lo dejen en el informe, quiero verlo antes de validarlo».

Preside Transportes (`/bitacora`). Asunto: los **27 informes de ingeniería inversa** de
`autonomo/ideas/ingenieria-inversa/`, agrupados por tema para no pasar de 2 M (REGLAS §4.12). Dictámenes: Interior +
Justicia (sonnet), Educación (sonnet) y Ciencia + Exteriores (sonnet). Hacienda y Transportes, quien preside. Base común:
el dosier de la presidencia (estado de cada informe en el tablero y la bitácora).

**Estado de todo lo acordado: proyecto de ley, pendiente de validación del gobierno central.** Nada entra en el tablero
hasta que el usuario lo valide. Lo reservado al usuario (arquitectura de `CLAUDE.md` §2, presupuesto total, quitar
contenido, prioridad entre libros) va como «recomendación al gobierno central».

Hechos que no se volvieron a decidir (ya resueltos antes): las paradas 1-3 de `eco-mega` (en `main`), la opción 1 de
Culprit (26/10), `pif-ecg` (PR #36, en `main`), la fase 1 de `educacion-pionera` (anki, oppia y ncase), el repaso
espaciado (CLAUDE.md §2), `eco-reforma` el 01/11 con three.js como opción (Consejo 28/10, 3.ª), la puerta «Guardia» en
la raíz (usuario, 25/10) y la prioridad del 27/10: **Marino → El Libro Azul → webs y modelos vivos → eco → PIF y
Radiología**.

Página para el móvil: https://claude.ai/artifact/YbR2Z9chFJBaye1HvtV9e3

## La ley en una frase
Los 27 informes se cierran en **7 proyectos**, uno por parte de la app; nada se construye antes de terminar Marino salvo
un mínimo opcional para la rotación de Cardiología, y todo lo que dependa del motor de la eco espera a que el usuario
elija con `eco-reforma`.

## Orden del día
1. Eco (8 informes).
2. Coronarias y SCA (3).
3. ECG y PIF de Cardiología (5).
4. Radiología (6).
5. Estudio y aprendizaje (3 + la receta de Techartist).
6. Respiración (1).
7. IA y voz (2).
8. Calendario y presupuesto de la ley.

## Artículo 1 · Eco: un solo expediente que espera a la reforma
Informes: `corazon-mas-real-plan`, `eco-fisiopatologia`, `echodemo-anatomia`, `echosuite-anesthbeta-anatomia`,
`ecos-reales-libres`, `echosuite`, `echosuite-2`, `anesthbeta`.
- Interior: con cambios. Bien el expediente único: casi todo ya está en `main`. Orden: `eco-reforma` → decisión del
  usuario → `f0-eco-*` (un constructor en serie, ≈8-10 M est.) → `f2-ete` (≈6-8 M est.) → `eco-calibra-b` (3,5 M). Las
  tareas se reescriben sobre el motor elegido cuando se lancen, no ahora.
- Justicia: a favor. Elegir motor es arquitectura (§2): el Consejo recomienda, no decide. three.js, solo como opción.
- Educación: a favor con cambios. Lo que más enseña de la eco es «Guardia: shock» (art. 1 bis), no la imagen.
- Ciencia: a favor con cambios. Faltaban las ideas sueltas de anesthbeta (1 ficha «¿Qué ETE pido y qué veo?», 5 cartilla
  válvula/fase, 6 postura guardada en la URL) y una repetida en dos informes: el «estado de revisión visible» (anesthbeta
  8 y echosuite-2 8). La idea 4 de echosuite-2 («mi paciente en la eco») es nivel 2 del norte: fuera hasta la reforma.
  Coaching de sonda (anesthbeta 7): descartado, depende de la sonda ETE.
- Exteriores: encaja con G1 y G6. No hace falta abrir ninguna web; los huecos de ecos reales siguen sin candidata libre.
- Hacienda: el estado de revisión se suma a `f0-origen` (ya pendiente): una pieza en vez de dos.
- **Acuerdo**: los 8 informes quedan **cerrados** en un expediente; alimentan `eco-reforma` (01/11). Nada de eco se
  construye hasta que el usuario elija motor. Proyecto nuevo **`eco-sueltas`** (ficha ETE, cartilla válvula/fase,
  postura en la URL; ≈2 M est., sonnet) después de la reforma. El estado de revisión entra en `f0-origen`.
- **Recomendación al gobierno central**: elegir motor con el informe `eco-reforma`; three.js solo si lo decide él.

## Artículo 1 bis · «Guardia: shock» (une `f3-calc-eco`, `g1-shock` y 4 ideas de EchoSuite)
- Interior: con cambios. La fusión comparte catálogo de cifras, `formula-comun` y Mayéutica: ahorra ≈3-4 M. Orden:
  `f0-cifras` → maqueta → app. Fusionado ≈14-18 M (est.). Maqueta en potente, calculadoras en sonnet.
- Justicia: con cambios. Cada fórmula con su página; si Lang y Nagueh discrepan, las dos con nota (§7.5). Nada que
  guarde datos del paciente.
- Educación: a favor con cambios. Es lo más útil de guardia del tema eco. Partirlo en **dos paradas** (cadena de
  calculadoras; después el veredicto) y una pregunta «piensa antes» por eslabón.
- Ciencia: a favor. Ojo: el veredicto de shock no sale de EchoSuite (no integra shock): necesita guías de shock con
  página, que es lo de `g1-shock`.
- Hacienda: `f3-calc-eco` figura «aparcada, espera PDF», pero Lang 2015, Mukherjee 2025, Nagueh 2025 y Taub 2025 ya
  están en `docs/` desde el 27/10: se desaparca al validar la ley.
- **Acuerdo**: proyecto **`guardia-shock`**: VCI → PAD → VS → GC → E/e′ → VExUS (ideas 1, 3 y 7 de echosuite-2) en la
  parada 1; veredicto de shock con «combinación incoherente» (idea 5) en la parada 2. Antes, `f0-cifras`. ≈14-18 M.
  La puerta «Guardia» ya la aprobó el usuario el 25/10.

## Artículo 2 · Coronarias: «Arteria culpable»
Informes: `culprit`, `angioview`, `angioview-2`.
- Interior: con cambios. Unir solo lo barato: `culprit-a` + la tabla vaso → ECG → pared → complicación, una sola vez en
  `js/data/` (ahorra ≈1 M). Culprit A ≈3-4 M, B ≈3 M, tabla ≈1-1,5 M (est.). `f2-coronarias` ≈8-12 M, culprit C ≈6-8 M.
- Justicia: a favor en lo barato. `f2-angio` y `g3-sca` siguen aparcadas: Di Mario 2005 es de pago y no se elige otra
  fuente por criterio propio. Figuras, solo recreadas.
- Educación: a favor. Orden por lo que enseña: tabla vaso → ECG, después preguntas «predice el ECG».
- Ciencia: con cambios. **El borrador se equivocaba**: la idea 1 de angioview-2 («leer un informe de coronariografía»)
  necesita Di Mario; solo la idea 2 (la tabla) se absorbe hoy. Faltaba la idea 8 (caso «shock cardiogénico en un IAM»),
  que va con `f2-coronarias`. La coronariografía animada (7), descartada por ahora.
- Exteriores: sin webs. BodyParts3D solo si el árbol deja de ser dibujado a mano.
- **Acuerdo**: proyecto **`arteria-culpable`** = `culprit-a` + tabla (angioview-2, idea 2) + `culprit-b`, después de
  Marino (≈7-8,5 M). Segunda fase, tras `eco-reforma`: `f2-coronarias` con angioview-2 ideas 4-6 y 8, culprit C/D y eco
  C2/P3. Ideas 1 y 3 de angioview, con `f2-angio` (espera Di Mario o una fuente libre que encuentre el usuario).

## Artículo 3 · ECG y PIF de Cardiología: un bloque `pif-cardio`
Informes: `ritmolab`, `ritmolab-2`, `ritmolab-3`, `ventriculus`, `pif-cardio-final`.
- Interior: con cambios. El bloque (las 6 tareas B-033, ≈18,7 M ya aprobados, + Ventriculus) es construible con 3
  paradas. Ventriculus añade «ECG vivo arriba de cada ficha» y «preguntas que pintan su ECG» (≈2-3 M est.); el monitor
  común se reutiliza. Adelantar solo el esqueleto (≈1-2 M).
- Justicia: con cambios. Dar profundidad al grafo del corazón eléctrico toca un motor: recomendación, no acuerdo. El
  bloque une tareas, no fuentes: cada ficha sigue citando la suya.
- Educación: con cambios. Para la rotación (nov-dic) el mínimo que más enseña por menos: esqueleto + «léelo en orden» +
  tabla vaso → ECG + 5-8 preguntas «predice el ECG». Si hay que recortar, primero el laboratorio.
- Ciencia: a favor con cambios. Uniones correctas; los 5 informes quedan cerrados. Falta poner explícitas «las preguntas
  que pintan su ECG». Ventriculus exagera «fisiología, no dibujos» (un dipolo con gaussianas, todo en «Draft»): sus
  cifras solo como pares de prueba. Profundidad en el grafo antes que un segundo motor. Propone adelantar esqueleto,
  `ecg-guardia` y `b3-bradi`.
- Exteriores: de las 4 webs que pide `pif-cardio-final`, solo **PhysioNet** (ECG reales con licencia abierta) merece
  abrirse; LITFL solo como enlace; ECGSIM y Wave-Maven aportan lo que ya da Ventriculus. Choca con la prioridad del
  usuario adelantar nada.
- **Discrepancia**: cuánto adelantar por la rotación. Interior: solo el esqueleto. Educación: esqueleto + tabla + 5-8
  preguntas. Ciencia: esqueleto + `ecg-guardia` + `b3-bradi`. Exteriores: nada sin que lo diga el usuario. **Decide quien
  preside**: un paquete **`pif-cardio-minimo`** (esqueleto con los 6 objetivos, «léelo en orden», la tabla vaso → ECG y
  6-8 preguntas «predice el ECG»; ≈3-3,5 M, sonnet), como **opción** para noviembre, porque cambia la prioridad del
  usuario. `b3-bradi` ya va dentro de Marino; `ecg-guardia` queda en el bloque.
- **Acuerdo**: bloque **`pif-cardio`** con 3 paradas: (1) esqueleto y «léelo en orden» (+ `ecg-guardia`); (2) 12
  derivaciones con profundidad (`ecg-vector-*`), ECG vivo arriba de cada ficha y preguntas que pintan su ECG; (3)
  laboratorio (`arritmias-*`) con la puerta «Construye un ECG». Después, los objetivos con PDF. ≈21-22 M en total
  (18,7 aprobados + 2-3 nuevos − 1 de ahorro). Va al final (tras Marino y El Libro Azul), salvo el paquete mínimo.
- **Recomendaciones al gobierno central**: (a) validar o no `pif-cardio-minimo` para noviembre; (b) profundidad en el
  grafo (una sola verdad) en vez de un segundo motor; (c) mandar 3 PDF: semiología cardíaca, ESC 2023 de endocarditis y
  ESC 2025 de miocarditis-pericarditis; (d) abrir solo `physionet.org` en la red, si quiere.

## Artículo 4 · Radiología: todo a `radio-informe`
Informes: `navrad`, `navrad-2`, `navrad-3`, `radiologyassistant`, `radiologyassistant-2`, `nv-reason-ct`.
- Interior: a favor. `radio-informe` (31/10) ya es el informe. Piezas baratas: `f0-ra-biblio` (≈0,5-1 M), rótulos SVG
  sobre las 14 figuras de Rx y TC de Merino Neumología (≈2-3 M), TC de cráneo en 5 preguntas (≈1,5-2 M).
- Justicia: a favor en lo pequeño. El visor de cortes es pieza nueva (el informe dice «decisión del usuario»); casos de
  imagen sin licencia verificada, no; NV-Reason en GPU o en servidor rompe §2.
- Educación: a favor con cambios. Las rotaciones pasaron, pero la Rx de UCI y la TC de cráneo siguen siendo de guardia.
  Primero lo barato sin licencias; `g4-dispositivo` antes que `g5-neuro` cuando haya casos.
- Ciencia: con cambios. **El borrador se equivocaba** con la lista de 64 hallazgos de NV-Reason: es de TC de tórax y
  abdomen, y `radio-informe` trata Rx de tórax y TC de cráneo. Fuera. Sí entra su pregunta de estudio «¿qué no puede ver
  esta IA?». Cerrados: navrad, navrad-3 y los dos de Radiology Assistant. Vivos: navrad-2 (casos) y nv-reason-ct.
- Exteriores: zenodo y TCIA solo si un día se aprueba el visor; Radiopaedia, CQ500 y RSNA son no comerciales o
  «comparte igual»: enlazar, no copiar.
- **Acuerdo**: los 6 informes alimentan **`radio-informe`** (31/10, ya fijado); su encargo recibe esta lista de ideas.
  Primeras piezas cuando el usuario elija: `f0-ra-biblio`, rótulos sobre las figuras de Merino, TC de cráneo en 5
  preguntas (≈4-6 M). `f4-*`, `g4`, `g5`, aparcadas.
- **Recomendación al gobierno central**: visor de cortes (`core/visor-cortes.js`), aparcado hasta tener casos con
  licencia; NV-Reason-CT nivel 1 (correrlo fuera de la app en una GPU), aparcado; nivel 3 (asistente en el hospital),
  **descartado** mientras siga «sin backend».

## Artículo 5 · Estudio: ideas para la parada del 04/11
Informes: `anki-fsrs`, `oppia`, `ncase-trust` (+ la receta de `iamtechartist-respiracion`).
- Interior: a favor. Cerrarlos dentro de `educacion-pionera` no cuesta nada. Receta y anillo, si se eligen, ≈3-4 M.
- Justicia: a favor. Ninguna escalera de repaso nueva que guarde más que la fecha del último intento.
- Educación: a favor con cambios. La receta de sala (5 frases → un gesto → 2 tarjetas) **no** es norma para todos: se
  solapa con Explorar. Va como opción alternativa a la maqueta A, probada en un solo modelo, y con la apuesta **antes**
  del gesto. El anillo de escala, solo donde cambia la escala (pulmón, capilar, nefrona, glomérulo).
- Ciencia: a favor. Añadir «recap con 2-3 preguntas previas» y «no repetir la misma ficha seguida» (baratos, sin
  guardar nada nuevo).
- **Acuerdo**: los 3 informes, **cerrados** (son la fase 1 de `educacion-pionera`). Para la parada del 04/11 entran
  como candidatas: la receta de sala (alternativa a A, en un modelo), el anillo de escala (mando opcional por modelo), el
  recap inicial, no repetir ficha y la tabla error → remediación.

## Artículo 6 · Respiración: Techartist para el pulmón, como método
Informe: `iamtechartist-respiracion`.
- Interior: con cambios. El pulmón ya es tarea aprobada (`b3-pulmon-app`, 10-15 M). Añadir una lámina de entrada
  ≈2,5-3,5 M; mejor con la misma pieza del anillo de escala del art. 5 (ahorra ≈1 M).
- Justicia: con cambios. Techartist no es fuente (colegio, sin citas): todo con Marino caps. 22-30 y El Libro Azul IV.
- Educación: sí, como lámina de entrada, sin rehacer la maqueta aprobada; cada nivel con una pregunta de guardia («¿en
  qué nivel se rompe el intercambio en el SDRA?»).
- Ciencia: con cambios. Techartist es una receta pedagógica, no «el informe del pulmón». Sus cifras (70 m², 480
  millones de alvéolos) y su modelo de O₂ son de divulgación. Cerrado: no hace falta otra pasada.
- **Acuerdo**: **sí, Techartist se usa para el pulmón**, como método: un viaje de escala tórax → vía aérea → alvéolo →
  membrana → capilar como lámina de entrada de `b3-pulmon-app`, con el anillo del art. 5, sin tocar la maqueta aprobada y
  decidido en la parada 2 del 3D. ≈2,5-3,5 M dentro de Marino.
- **Recomendación al gobierno central**: 3D de verdad (three.js + malla CC0), descartado por ahora; el 2D enseña lo mismo.

## Artículo 7 · IA y voz: nada dentro de la app
Informes: `lfm3-audio-2b`, `nv-reason-ct`.
- Interior: no traer LFM3 (0 M). «Escuchar» con la voz del móvil, ≈1-1,5 M, pero lee mal siglas y dosis.
- Justicia: «Escuchar» es pieza nueva (recomendación); LFM3 en el navegador (onnxruntime-web, ≈2,4 GB) rompe §2.
- Educación: en contra de «Escuchar»: oír no es practicar ni recordar.
- Ciencia + Exteriores: LFM3 cerrado (opción 1); si el usuario lo quiere probar en su ordenador, con las 5 frases
  médicas del informe (0 M para la app). huggingface y arxiv, solo si decide probar NV-Reason.
- **Acuerdo**: LFM3 **no se trae** (dictar con el micrófono del teclado, ya hoy). NV-Reason-CT, ver art. 4.
- **Recomendación al gobierno central**: «Escuchar», no por ahora (Educación en contra; riesgo de dosis mal leídas);
  probar LFM3 en su ordenador, si tiene curiosidad.

## Artículo 8 · Calendario y presupuesto
- Interior: casi nada arranca antes de diciembre (Marino, techo 400 M, fin 22/11-05/12; ~15 M al día). Hacienda revisa
  cada tarea de ≥2 M antes de gastar: esta ley no la sustituye.
- Justicia: el presupuesto total es del usuario: la ley lo propone, no lo fija.
- Educación: reservar primero la tanda de Educación (02/11 y 04/11) y, si se valida, el mínimo de Cardiología.
- Ciencia: la `HOJA-DE-RUTA.md` del Radar está sin revisar desde el 25/10; refrescarla al validar la ley.
- Hacienda (preside): el Consejo gastó ≈1 M (ver abajo). La ley no gasta hasta que se valide.
- Transportes (preside): orden por turnos.
  - **Ya fijado (30/10-04/11)**: grupos del `b3` · 31/10 `radio-informe` (con el art. 4) y `azul-cobertura` · 01/11
    `eco-reforma` (con el expediente del art. 1) · 02/11 maquetas de Educación · 04/11 parada (con el art. 5).
  - **Noviembre, solo si se valida**: `pif-cardio-minimo` (≈3-3,5 M) en un hueco del gasto diario.
  - **Dentro de Marino**: lámina de entrada del pulmón (art. 6), en la parada 2 del 3D.
  - **Tras Marino y El Libro Azul** (la fecha la dará `azul-cobertura`): `f0-cifras` + `f0-origen` → `arteria-culpable` →
    `guardia-shock` → piezas baratas de Radiología → bloque `pif-cardio`.
  - **Tras la decisión de motor**: `f0-eco-*`, `f2-ete`, `eco-calibra-b`, `eco-sueltas`, `f2-coronarias`.
- **Acuerdo**: el calendario de arriba y este presupuesto (millones de tokens, estimados ±30 %):

| Proyecto | Une | Cuándo | Coste | Ya aprobado |
|---|---|---|---|---|
| `pif-cardio-minimo` | esqueleto, léelo en orden, tabla vaso → ECG, 6-8 preguntas | noviembre (opción) | 3-3,5 | no |
| Lámina del pulmón | Techartist + `b3-pulmon-app` | parada 2 del 3D | 2,5-3,5 | el pulmón sí; la lámina no |
| Candidatas del 04/11 | receta, anillo, recap | si se eligen | 3-4 | B-040 sí |
| `f0-cifras` + `f0-origen` | + estado de revisión | tras Marino y Azul | 3-4 | sí (sin cifra) |
| `arteria-culpable` | culprit A+B + tabla de angioview | tras Marino y Azul | 7-8,5 | culprit sí; tabla no |
| `guardia-shock` | `f3-calc-eco` + `g1-shock` + EchoSuite | tras Marino y Azul | 14-18 | sí (sin cifra) |
| Radiología baratas | biblio, rótulos, TC en 5 preguntas | tras `radio-informe` | 4-6 | biblio sí |
| `pif-cardio` | B-033 ×6 + Ventriculus | al final | 21-22 | 18,7 sí |
| `eco-sueltas` | ETE, cartilla, postura en URL | tras la reforma | ≈2 | no |
| Fase de motor | `f0-eco-*`, `f2-ete`, `eco-calibra-b`, `f2-coronarias` + culprit C | tras la reforma | 32-42 | sí (casi sin cifra) |

  Total de la ley ≈ 92-114 M; de eso, **lo nuevo** (no aprobado antes) ≈ 17-23 M; el resto ya estaba aprobado y la ley
  solo lo ordena y le pone cifra. Todo fuera del techo de Marino (400 M).
- **Recomendación al gobierno central**: validar el presupuesto total; refrescar la hoja de ruta del Radar.

## Los 27 informes, uno a uno
- **Cerrados (23)**: corazon-mas-real-plan, eco-fisiopatologia, echodemo-anatomia, echosuite-anesthbeta-anatomia,
  ecos-reales-libres, echosuite, anesthbeta, culprit, angioview, ritmolab, ritmolab-2, ritmolab-3, ventriculus,
  pif-cardio-final, navrad, navrad-3, radiologyassistant, radiologyassistant-2, anki-fsrs, oppia, ncase-trust,
  iamtechartist-respiracion, lfm3-audio-2b.
- **Vivos (4)**: echosuite-2 (umbrales con página), angioview-2 (Di Mario o motor), navrad-2 (casos con licencia),
  nv-reason-ct (decisión del nivel 1).
- **Descartados enteros**: ninguno. **En parte**: NV-Reason nivel 3, three.js de Techartist, LFM3 en el navegador, el
  código y textos de Ventriculus y RitmoLab, la coronariografía animada antes del árbol SYNTAX y el coaching de sonda.

## Lo que entra en el tablero
**Nada todavía.** Al validar, entrarían: `pif-cardio-minimo` (si se elige), `eco-sueltas`, `arteria-culpable`,
`guardia-shock` (desaparca `f3-calc-eco` y absorbe `g1-shock`), el bloque `pif-cardio` (absorbe las filas 28-33 del
Objetivo I) y los cambios de encargo de `radio-informe`, `eco-reforma`, `f0-origen` y `b3-pulmon-app`, cada uno con
«(Consejo, 29/10, Ley de Ciencia)».

## Lo que espera al gobierno central
1. Validar la ley entera, por artículos o cambiarla.
2. `pif-cardio-minimo` para la rotación de noviembre: sí o no (cambia su prioridad).
3. Profundidad en el grafo del corazón eléctrico (recomendada) frente a un segundo motor.
4. Tres PDF opcionales: semiología cardíaca, ESC 2023 de endocarditis, ESC 2025 de miocarditis-pericarditis.
5. Red (opcional): abrir solo `physionet.org`.
6. Recomendaciones de no hacer: three.js para el pulmón, LFM3 en la app, «Escuchar», NV-Reason en el hospital, visor de
   cortes sin casos.

## Gasto de la reunión
Interior + Justicia (sonnet, 87 k), Educación (sonnet, 82 k), Ciencia + Exteriores (sonnet, 111 k) según cada agente; con
quien preside (lectura de los informes, el tablero y la bitácora, dosier, acta y página), `gasto.mjs` da ≈1,6 M
equivalentes en la sesión (1,1 M de la presidencia y 0,5 M de los agentes). Dentro del tope de 2 M.
