# Bitácora: archivo

Lo que sale de `autonomo/BITACORA.md`: lo hecho hace más de 7 días y lo descartado. Una línea por cosa, la más
nueva al final. Lo añade la skill `/bitacora` al sincronizar.

Formato: `AAAA-MM-DD · hecho|descartado · qué · PR o motivo`

- 2026-10-14 · creada la bitácora (skill `/bitacora`), a petición del usuario. Los «Otros pendientes» del tablero
  pasan a ella.
- 2026-10-14 · reorganizado · El usuario fija el plan: preguntas primero. El cap. 18 conserva su texto y le falta
  la fase de estudio. Después Marino, El Libro Azul, el PIF y el atlas, cada uno con una comprobación de fuentes y la
  fase de estudio. Apuntado como B-001 a B-006. Todo el tablero, `aparcada` hasta su aprobación.

## Salido de la bitácora el 23/10/2026 (hecho hace más de 7 días)

- 2026-10-15 · **Plan Marino, revisiones R8-R13** (caps. 31-53 y apéndices, 79 fichas), aprobadas y en la app
  (PR #10-#15). **La fase 1 de Marino está terminada.**
  - R8: la gasometría de ejemplo se queda como en el libro, con su nota.
  - R9: la hipermagnesemia grave, consultada en la web (Manual Merck) y anotada.
  - R10: el Ringer lactato, consultado en la web (WikEM y StatPearls) y anotado.
  - R11: los topes de la reversión se quedan.
  - R12: las abreviaturas valen.
  - R13: las calculadoras de tóxicos, solo para adultos (20-300 kg).

- 2026-10-15 · **Reglas aprobadas tras R4-R10** (`autonomo/REGLAS.md` §1.8-1.10 y §2.5b, `CLAUDE.md` §5 y §7):
  - erratas de dosis: dosis habitual + nota visible, con consulta web si hay duda;
  - notas de interpretación siempre con fuente, y web si hay discordia;
  - umbrales de las calculadoras comparados redondeados;
  - SVG recreados con fondo propio.
- 2026-10-15 · **Plan Marino, revisiones R4-R7** (caps. 14-30, 47 fichas), aprobadas y en la app (PR #6-#9):
  - R4: vasopresina en U/min con nota, 3.er vasopresor = epinefrina, remisiones «Ficha N» → botones; después,
    el escenario de bradicardia repuesto con el texto de Marino (lo pediste);
  - R5: dabigatrán y HNF con nota de errata, CHA₂DS₂-VASc puntuable, tablas que cabían mal a 360 px;
  - R6: clasificador de riesgo de la EP fiel, esteroides del SDRA, figuras legibles;
  - R7: descontaminación oral (SOD), notas del manguito y la PImax, clasificador del derrame sin conducta inventada.
- 2026-10-14 · **Plan Marino, revisiones R1-R3** (caps. 1-13, 29 fichas), aprobadas y en la app (PR #3, #4 y #5):
  - R1: signo de la RASS, límites de las calculadoras y notas de fuentes (propofol con fuentes externas);
  - R2: los simuladores de fluidos y de retorno venoso ya dan pacientes posibles;
  - R3: 7 graves corregidos en Merino HEMATO (TRALI/TACO, PFC:hematíes, 4Ts, HIT) y lo que faltaba del libro.
- 2026-10-14 · **Mejoras del plan aprobadas**: el comprobador elige un puerto libre y ya no da falsas alarmas de
  imágenes; recetas Visual por id; primero los archivos modelo; dos tareas a la vez en carpetas aparte.

- 2026-10-14 · **Preguntas para estudiar**: maqueta aprobada, reglas (`REGLAS.md` §8) y el profesor que diseña y
  juzga.
- 2026-10-14 · **Plan socialista revisado** tras el piloto: rúbrica «sirve para estudiar», encargos y tipos de tarea.
- 2026-10-14 · **Plan socialista montado**: skill, agentes, jueces automáticos, regla «paciente posible» y enlace
  «Ver en el móvil».
- 2026-10-14 · **Receptores adrenérgicos animados** en Merino Cardiología (Motion).
- 2026-10-14 · **Atlas cap. 14** (ventrículo derecho) y huecos del Manual UMI.
- 2026-10-13 · **Atlas caps. 08, 09 y 10** sobre el motor; el atlas en español dentro de Eco cardíaca.
- 2026-10-13 · **Marino completo** en Libros (caps. 1-11, 31-53 y apéndices) con sus revisiones.
- 2026-10-13 · **Manual UMI**: bloque neurocrítico y meningitis.

## Resuelto el 25/10/2026 (salido de «Esperando algo tuyo»)

- **🔴 Los 3 modelos vivos del bloque 3 (25/10)**: el informe del megaproyecto (versión 2, mismo enlace) cruza el juicio de
  las maquetas v2 (`autonomo/bloques/b3/juicio-maquetas-v2.md`: ninguna pasa, 5 puntos <4 cada una) con lo aprendido en
  las webs, y propone una **v3** de las tres con esos arreglos y **un solo monitor de UCI común** antes de llevarlas a la
  app. Espera tu aprobación. También añade: lo que ya tenemos, mejoras pieza por pieza (eco, atlas, calculadoras,
  catéter, potasio y ácido-base, casos, pulmón con respirador) y el método para futuros modelos vivos (monitor común,
  arco en C, sonda de ETE, «la placa de la cama 7», gemelo hemodinámico).
- **✅ Aprobado por el usuario el 25/10**: todas las recomendaciones del informe del megaproyecto y B-012 a B-016 (detalle de
  las decisiones en `autonomo/TABLERO.md`, «Encargos aprobados el 25/10/2026»). Siguiente: etapa A en una sesión nueva.
- **✅ Aprobado por el usuario el 23/10** («te doy el ok a todo»; orden, carriles y paradas «en principio no» cambian):
  los 6 cambios previos, las 8 tareas de la fase 0, el «ok» a la maqueta v2 del corazón eléctrico y tocar el motor
  para que lata con el ritmo. Pidió ver el plan final integrado **antes de tocar código ni nada**: se le reenvía y se
  espera su «adelante».
- **🔴 Plan de integración (cómo lo ejecutaría el plan socialista)** (https://claude.ai/artifact/5em9RdpkzZGjV91CBMCBLh): dos carriles a la vez (corazón = bloque 3
  con la fase 1 dentro; producto = fase 0), 20 tareas con clave (8 de la fase 0, 5 de la fase 1, 7 de las fases 2-4 en
  espera) y **6 cambios previos** en el propio plan: objetivo y tipo `integracion` en el tablero; modo `integrar` en la
  skill; 3 puntos más en el constructor (no abrir la web ajena, cifras y fórmula, chip de origen); profesor que juzga
  «en la guardia»; jueces `--calc` y `--origen` y límite de peso y fps de la eco; norte y Radar en las reglas.
  Regla de oro: el constructor trabaja solo con nuestro informe, nunca con la web ajena. **Nada aplicado**: espera
  tu aprobación de los cambios 1-5, de las 8 tareas de la fase 0 y del «ok» a la maqueta v2 del corazón eléctrico.
- **🔴 Propuestas de cambio de reglas (Radar, 23/10)**: el norte en `CLAUDE.md`, el radar en `REGLAS.md`, el modo
  guardia sin guardar nada, la excepción del nivel 3 (IA aparte, datos anonimizados) y la biblioteca de casos. Detalle
  en `docs/historial/radar.md` §4. Nada cambia hasta que las apruebes.
- **🔴 INFORME FINAL «Del simulador a la cama»** (https://claude.ai/artifact/3hnNvcEsvsotfViShnXLee; NavRad con imagen: https://claude.ai/artifact/2v4kHFM66eac8d5bYWZgtm): junta las 6 webs y sustituye a
  los informes parciales para decidir. Hoja de ruta única: fase 0 (ya, sin fuentes: acabado de producto en eco,
  calculadoras y corazón eléctrico, bibliografía de RA), fase 1 (noviembre, PIF Cardiología: corazón eléctrico en la
  app, el ritmo mueve el motor, territorios e IAM), fase 2 (coronariografía que late y ETE), fase 3 (calculadoras de
  eco de UCI), fase 4 (imagen real: visor ligero, «¿dónde está la punta?», recorridos, casos). Espera: arrancar fase 0,
  el «ok» a la maqueta v2 del corazón eléctrico, los PDF (lista en el informe), abrir en la red `zenodo.org`,
  `*.cancerimagingarchive.net`, `*.radiopaedia.org`, `registry.opendata.aws` y `heart.org`, y 6 decisiones grandes.
- Los informes parciales del 23/10 («Ritmo vivo y placa guiada», «Un paciente, todas las pruebas» y tee-inversa con sus
  paquetes A, B y C) quedan **dentro del informe final**; su detalle, en `docs/historial/radar.md` y en los partes del 23/10.

## Salido de la bitácora el 2026-10-27 (hecho hace más de 7 días)

- 2026-10-19 · **Ácido-base vivo y río y mar en la app** (PR #18), aprobados.
  - Dónde están:
    - el ácido-base, en PIF → Nefrología;
    - el río y mar, en Libros → Marino;
    - los dos, en el bloque «Modelos vivos» de los dos menús, en el buscador y con botones desde las fichas.
  - Mayéutica con 14 + 14 preguntas y 4 + 3 casos.
  - «← VOLVER A LA FICHA» lleva a la ficha de origen.
  - El título «HUD Clínico UCI», más pequeño, lleva al menú principal.
  - Regla nueva: los jueces miden el desborde también tras contestar (`--modelo`).

- 2026-10-19 · **Plan Marino, fase 2: mapa visual y maquetas v2** (PR #16), aprobado.
  - Ácido-base vivo unificado (A+B+C) y río y mar en crema y oro, con su Mayéutica.
  - Están en `autonomo/maquetas/`.
- 2026-10-19 · **Jueces con la vista Visual**: `jueces.mjs --ficha` abre también la vista Visual de cada bloque
  (regla aprobada).
  - Arreglados los 2 px de «Nefronas que quedan».
  - El salicilato ionizado y el no ionizado, que se distinguían solo por el color, ahora también por la forma.

- 2026-10-19 · **Una sola leyenda de formas de iones** en los modelos vivos (PR #17), aprobada y en la app.
  - Una tabla única (`js/data/formas-iones.js`) y un dibujo común (`js/core/particulas.js`), que usan la nefrona viva,
    el glomérulo, el filtro de la TRR, las nefronas que quedan y el potasio.
  - Leyenda nueva en tres modelos.
  - Arreglada la célula de la nefrona viva que se quedaba congelada.

### Salido de la bitácora el 2026-10-28 (hecho hace más de 7 días)

- 2026-10-20 · **«La cama 7» en la app** (PR #23) y **motor calibrado** (PR #22), aprobados y en main.
  - Muralla, telar e inmersión en Libros → Marino → Modelos vivos, con la misma cama y desde sus 5 fichas.
  - 11 formas nuevas en la tabla única. Si un modelo vivo falla, el resto de Libros sigue funcionando.
  - PVC normal 4,2 mmHg; elevación de piernas en la hemorragia +20 %.

- 2026-10-20 · **Marino, bloque 1 en modelos vivos** (PR #19, #20 y #21), aprobados y en main.
  - Mayéutica en las 23 fichas de Fundamentos (botón Texto | Visual | Mayéutica).
  - Capilar y oxígeno, y catéter vivo, en Libros → Marino → Modelos vivos y desde las fichas.
  - El motor del corazón lee Guyton, la elevación de piernas, el bolo, el catéter de AP y la termodilución.
  - Auditados con el PDF: 9 graves corregidos (ninguno de dosis).

- 2026-10-30 · **Recordatorio cerrado por el usuario** («sí a las 3»):
  - `tee-inversa`: cerrada. El paquete C (segmentos de la mitral y cúspides aórticas) ya estaba en `eco-mega` parada 2;
    A (colores y rótulos al tocar, viaje entre vistas) y B (vistas de ETE con reto) pasan a `mv-eco`, la obra de la
    eco con la opción A de la reforma.
  - Panel de subida (`backend/`, `admin/`): **descartado (2026-10-30)**: pedía una clave de pago de la API (~8 $ por
    PDF) y un Worker de Cloudflare; los PDF ya llegan por las sesiones. El código se queda donde está, sin encender.
  - Velocidad del plan socialista (propuesta del 14/10: constructores a la vez, pruebas largas al final, jueces desde
    la 1.ª vuelta): **cerrada (2026-10-30)**: ya se hace con REGLAS §4.8 y §4.11.
  - Di Mario 2005: **descartado (2026-10-30)**: «no voy a subir un artículo de hace 21 años».

## 2026-10-30 · «Esperando algo tuyo» antes de la limpieza del Consejo (7.ª)

Copiado tal cual de la bitácora al cerrar los cabos sueltos (acta `autonomo/consejo/2026-10-30-7.md`). Lo que seguía vivo quedó resumido en la bitácora.

- **Consejo extraordinario del 30/10 (6.ª, con tu potestad delegada sobre este punto 3; acta
  `autonomo/consejo/2026-10-30-6.md`)**. Decidido:
  - **Comparecencias aceptadas**: grupo 5 del `b3` (+30 %) y `reglas-30-10` (+165 %). El presupuesto de `b3-paso4`
    se corrige a **≈58 M** (el parte del grupo 5 ya contaba con 58; el tablero decía 51): el grupo 6 (TEP) tiene
    **5,9 M de tope duro**. `formula-juez` (+19 %), solo anotada.
  - **PR #38 (`compara-formulas`) y PR #39 (`radio-baratas`, día 1): fusionadas** con los jueces en verde (versión
    20261030-12).
  - **Radio**: el mínimo va **ya, en el carril 2** (no tras El Libro Azul), y **«Lee esta placa» entra**: día 2
    (rótulos + TC de cráneo) desde el 31/10 y día 3 («Lee esta placa») al siguiente. Marino va primero cada día.
  - **`educacion-app`**: sigue esperando al `b3`. **Cuando el `b3` esté en `main`, escribe «sigue»** en la sesión
    «educacion-app · espera al bloque 3».
  - **Semiología (Bates o Surós)**: opcional, sin prisa; sin cambios.
- **🔔 Recordatorio, solo tú puedes hacerlo** (no está hecho): mirar en el móvil (1) el **SCA** y la **disección
  aórtica** del grupo 5 (https://raw.githack.com/alvariitoSW/fiebres-neutropenias/auto/b3/index.html → Cardiología →
  Merino Cardiología → «SCA» o «Disección aórtica» → Estudiar) y (2) **M3 de la eco con «HP crónica»**: el sello VD/VI
  0,72 es un fallo conocido del motor (la guía espera >1,0) que arreglará `mv-eco`; mirarlo solo lo confirma.
- **Espera tu sí (visto de paso de la PR #38)**: la ficha Fisiopatología UCI → Cardiología → Fisiología cardíaca
  aplicada tiene rótulos de 5-6 px en la animación de Wiggers y se sale 30 px a 360 px (ya estaba antes). ¿Arreglo
  directo a `main` (≈0,3 M)?

- **✅ Decidido por ti el 30/10** (sobre el rumbo de hoy):
  - **Eco**: opción **A** (dos motores con contrato, 20-26 M; «la C también está bien»). three.js, no (no lo elegiste).
    La obra es `mv-eco`, tras fusionar el bloque 3; absorbe `eco-calibra-b`.
  - **Bloque 3**: +5 M (`b3-paso4`, ≈51 M).
  - **Las 4 reglas nuevas** y **los 4 ahorros de Hacienda**: tarea `reglas-30-10`.
  - **Educación**: A, B y C aprobadas, con vía libre a Interior y Transportes → primero la mezcla del profesor (C con
    el error de B dentro del caso), después A cuando use el motor en vivo. Tarea `educacion-app`; `capilar-transfundir`,
    a `pendiente`. El 04/11 ya no hay que elegir: queda la prueba de 3 días, cuando quieras.
  - **Red**: comprobado el 30/10, `atlas-of-physics.vercel.app` y `phet.colorado.edu` ya abren. **B-042 desbloqueada**.
  - **Di Mario 2005**: descartado del todo. `f2-angio` y `g3-sca` buscan fuente abierta o lo dejan como hueco.
  - **Mejoras y propuestas** (puntos 4 y 5): todas aceptadas → `mejoras-30-10`, la CPAP en `b3-pulmon-app`, la Fig. 18.3
    y las preguntas viejas de Merino Cardiología y Neumología en `b3-cierre`.
  - **Recordatorio cerrado**: simulador ETE (C hecho; A y B a `mv-eco`); panel de subida, descartado; velocidad del
    plan, cerrada (ya se hace con las reglas nuevas).

- **✅ B-043 · Anatomy Atlas de Pridgen, decidido el 29/10**: «procedimiento en capítulos» para Técnicas R1, empezando por
  la vía venosa central. Tarea `tecnicas-capitulos` en el Objetivo L del tablero (tras Marino y El Libro Azul).
- **B-042 · Atlas of Physics (https://atlas-of-physics.vercel.app/), pedido el 29/10** (`/ingenieria-reversa`): «si nos
  puede servir para explicar ecuaciones y fórmulas físicas y matemáticas médicas de manera más sencilla y así aumentar
  el ministerio de educación». **Informe hecho el 30/10** (fase 1, ⏸ parado): https://claude.ai/artifact/GxMeNNH8AV8ReEvUVkTAtH
  (`autonomo/ideas/ingenieria-inversa/atlas-of-physics.md`). Espera de ti: qué propuestas apruebas (recomendado: 1
  «Compara» entre fichas con la misma fórmula y 2 juez que recalcula el renglón, ya; 3 tocar la pieza y ver su fórmula
  y 4 curva con punto vivo, como piloto en el capilar vivo; 5 hoja de fórmulas de guardia, cuando decidas dónde vive;
  6 preguntas con cifras del modelo, tras `preguntas`) y dónde va la hoja de fórmulas (raíz, Sobrevivir a la UMI o
  buscador). Opcional: `cdn.jsdelivr.net` en la red del entorno para ver sus figuras 3D.
  **Consejo del 30/10** (`autonomo/consejo/2026-10-30.md`, solo recomienda): sí al 2 (≈0,5-0,8 M), al 1 con catéter ↔
  vaso y Fick (≈0,8-1,2 M) y al 3+4 piloto en el capilar tras `capilar-transfundir` (≈2,5-3,5 M); la 5 como acordeón en
  Sobrevivir a la UMI (≈3-4 M); la 6, aplazada; sin segunda visita al 3D. Restaurar el hook que graft borró.
- **Consejo extraordinario de la reforma (29/10, PROYECTO; acta `autonomo/consejo/2026-10-29-reforma.md`, inventario
  `autonomo/consejo/mesa-recursos-2026-10-29.md`)**: 56 recursos sobre la mesa, ≈16 se habían quedado sin estudiar.
  Espera de ti: validar el proyecto; los 12 artículos de reforma constitucional uno a uno; el techo de gasto de la
  reforma (≈25-60 M); pegar el texto de 7 tuits; abrir pulmonarypocus.com en la red.
  **Enmienda del 29/10 (4.ª reunión, `autonomo/consejo/2026-10-29-carriles.md`)**: dos carriles, Marino primero y
  modelos vivos con webs y guías en paralelo (semáforo por modelo, 70/30 del gasto diario). Espera de ti: dónde queda
  El Libro Azul (recomendado: tras los modelos), el artículo 13 y el presupuesto del carril 2 (≈25-40 M).
  **✅ Decidido por ti el 29/10**: El Libro Azul tras los modelos; artículo 13 aprobado (REGLAS §4.13); presupuesto
  delegado en Hacienda; los PDF se buscan en abierto antes de pedirlos. En el tablero como Objetivo C. Di Mario 2005: descartado por ti el 30/10.
  **✅ 29/10**: el simulador de eco entra en el carril 2 (`mv-eco`, último paso, tras el bloque 3 y tu elección de motor el 01/11).

- **Consejo del 29/10 (2.ª reunión, UCI: VentLoop, raíz aórtica e Impella; acta `autonomo/consejo/2026-10-29-2.md`)**:
  entra `shock-scai` (dentro del bloque 3) y las ideas de VentLoop en `b3-pulmon-app`. **Espera de ti**: (1) subir la
  horquilla de `b3-pulmon-app` a ≈12-18 M (en la parada 2 del 3D); (2) B-041, raíz aórtica; (3) PDF opcionales: DanGer
  Shock (NEJM 2024), ESC 2024 y ACC/AHA 2022 de aorta, Devereux 2012 y Hickling 2001.

- **✅ Ley de Ciencia validada entera el 29/10** («valido todo para que el congreso empiece a implementar»; acta
  `autonomo/consejo/2026-10-29-ley-de-ciencia.md`, página https://claude.ai/artifact/YbR2Z9chFJBaye1HvtV9e3). Pasa al tablero como Objetivo L. **PDF**: recibidos el 29/10 y en `docs/` (página impresa = PDF + desplazamiento): `esc-2023-endocarditis.pdf`
  (Delgado V et al., Eur Heart J 2023;44:3948-4042; PDF + 3947) y `esc-2025-miocarditis-pericarditis.pdf`
  (Schulz-Menger J, Imazio M et al., Eur Heart J 2025;46:3952-4041; PDF + 3951). **Falta 1**: el capítulo cardiovascular
  de un libro de semiología (Bates o Surós), para la exploración y la auscultación del bloque `pif-cardio`; no corre prisa.
- **Resueltos por la Ley de Ciencia (29/10)**: las preguntas de Ventriculus, del informe final del PIF de Cardiología, de Techartist y de LFM3 (ver Objetivo L del tablero).
- **Consejo del 28/10 (3.ª reunión, acta `autonomo/consejo/2026-10-28-3.md`)**: lo delegaste («que lo apruebe todo el
  consejo»). Regla de las webs: retirada, ya la cubre REGLAS §4.11 · eco: `eco-calibra-b` aparcada hasta `eco-reforma` ·
  aviso B de Educación: `capilar-transfundir` aparcada hasta el 04/11 · ESC 2023 de SCA y repaso espaciado: cerrados ·
  three.js: va como opción en el informe `eco-reforma` · los 2 papers de pago: dejan de recordarse (aparcados en el Radar).
- **Para la fase 3 de Educación (opcional, antes del 02/11)**: abrir en la red del entorno **phet.colorado.edu**
  (recomendación del Consejo; comprobado el 28/10 que sigue cerrada). Brilliant, si quieres (casi todo de pago); las
  editoriales no hacen falta (la evidencia sale de PubMed).
- **Tareas programadas (revisadas el 28/10, 17:25)**: 28/10 (noche) `mayeutica-pestana`, adelantada por el usuario · 29/10 7:40 grupo siguiente del `b3` · 30/10 7:40 siguiente
  grupo del `b3` · 31/10 8:13 informes de El Libro Azul y Radiología (+ `b3`) · 01/11 `eco-reforma` · 02/11 fase 3 de
  Educación · 04/11 recordatorio de los puntos 18-22 y parada de Educación · cada día 13:43 y 21:43 el informe de la
  bitácora con la línea «Marino N de 155» · 6:42 la Bandeja del Radar. Las de esta sesión se pasaron a sesiones nuevas
  para poder cerrarla. Queda pausada (no salta) la vieja del 29/10.
- **Recordar más adelante (pedido el 28/10)**: los puntos 18-22 de esa tarde. Ya resueltos por el Consejo (28/10,
  3.ª): los 2 papers, abrir sitios, three.js y repaso espaciado. Quedan para el aviso del 04/11: PDF opcionales (AHA
  2020/ERC 2021, SCAI 2015, Valdenebro 2021), clave del panel de subida, velocidad del plan y rutina nocturna, y la
  elección de maqueta de Educación (A, B o C).


- **✅ Bloque 3, paso 4: decidido el 27/10**, opción A (las 17 piezas, ≈36 M). Tarea `b3-paso4`, empieza el 28/10.

- **✅ Decidido el 26/10, B-026 · Culprit** (https://claude.ai/artifact/Y6ewAZfAk5cPewnsnNcsAw): opción 1. A (ficha «Del
  vaso a la derivación») y B (preguntas «predice el ECG» y «coloca el trombo») entran en la Fase 1, después de Marino;
  C (modelo vivo 2D) cuando el motor de la eco tenga las coronarias; D después de C. El ECG llegó el 27/10 (López Ramírez 2012). Ya en `docs/`: ESC 2023 de SCA (2 partes),
  de Winter 2008, CONFIRM 2015 (dominancia) y Tamura 2014 (aVR). También Wagner 2009 (AHA, territorios) y Thygesen
  2018 (definición universal): **A y B ya tienen fuente completa**. Opcional: suplemento de la ESC (figuras S2-S3). three.js y repaso espaciado: resueltos por el Consejo del 28/10 (3.ª).


- **Decidido el 19/10**: Marino primero, por bloques (Objetivo M5). B-002, B-004, B-005 y B-006 esperan a terminar
  Marino. B-001 (preguntas) se hace como la **Mayéutica** de cada ficha, bloque a bloque. B-007 sigue sin aprobar.
- **Optimizar los agentes del plan** (pedido del usuario el 19/10: más fluido, menos gasto, mejor trabajo): propuesta
  en el chat, esperando su visto bueno.

- **✅ Decidido el 26/10, «Un corazón más real»**: entran en la parada 2 de `eco-mega` A1, A2, A3, B4, B5 y D1 (sin
  PDF); la malla de Visible Human, solo como referencia de forma. Detalle en el tablero.
- **Los PDF de la ASE ya están en `docs/`** (Lang 2015, Hahn 2013, Mor-Avi 2011 y Mitchell 2019, 26/10): no hace
  falta abrir `asecho.org` ni Wikimedia. B1, B2, B3 y C1 entran (B2 en potente). La pared por regiones y el
  infarto (C2) esperan a las coronarias en el motor (decidido el 26/10).
- **🔴 Megaproyecto «La UCI en el bolsillo»** (https://claude.ai/artifact/6XfQibZ3H4NwgjUFMJhTdU): tres pisos (Guardia en 30 s · Paciente vivo · Escuela)
  sobre los cimientos de siempre; 6 situaciones de guardia con su tarjeta; NV-Reason-CT en tres usos (lista de
  hallazgos, compañera de estudio con casos abiertos, asistente de nivel 3). Nueva **fase G** dentro del plan aprobado:
  G1 shock (puede empezar ya: Manual UMI y VExUS en `docs/`), G2 inestable y paro (AHA 2025), G3 marcapasos/SCA,
  G4 tras el dispositivo, G5 neurocrítico, G6 ETE. Espera: ¿puerta «Guardia» nueva en la raíz?, ¿G1 tras la fase 0?,
  PDF, y abrir `huggingface.co` y `arxiv.org`.
- **✅ Decidido el 25/10** («estoy de acuerdo con todo»): el plan de integración, el megaproyecto «La UCI en el bolsillo»,
  la v3 de los 3 modelos del bloque 3, la puerta «Guardia», G1 tras la fase 0, tocar el motor y la anatomía, y B-012 a
  B-016. Detalle en `autonomo/TABLERO.md` («Encargos aprobados el 25/10/2026») y `docs/historial/radar.md`.
  **Siguiente: abrir una sesión nueva y lanzar `/plan-socialista` (etapa A).**
- **🔴 Bandeja del Radar**: crear la tarea diaria **desde la app de Claude** con el proyecto elegido (texto en
  `autonomo/radar/LEEME.md`); la creada desde la sesión no tenía el repositorio y está pausada.
- **Bandeja del Radar, arreglada el 27/10 (noche), por comprobar el 28/10**: la tarea diaria se lanzaba sin el
  repositorio ni permiso de escritura en GitHub. Borrada; la nueva (6:42 de Canarias) dispara en una sesión que sí lo
  tiene y abre la sesión de trabajo con el repositorio. Esperan 4 tuits del issue #27. `x.com` abierto el 27/10 (comprobado: se lee el texto del tuit); `twitter.com`,
  `*.twimg.com` y `threadreaderapp.com` siguen cerrados (no hacen falta para leer un tuit suelto).
  **Comprobado el 28/10**: la tarea corrió y leyó los 4 tuits (el texto va dentro de la página de `x.com`). No
  se pueden abrir `t.co`, `doi.org`, PubMed, Europe PMC ni criticalcarereviews.com: los papers se buscan por título
  en la web y, si no aparecen o son de pago, se pide el PDF en el issue. 2 papers esperan PDF/enlace del usuario.
- **AngioView (cateterismo)**: el informe está hecho (23/10, https://claude.ai/artifact/T4WcxXWzjPGm911ShU3aiS),
  pero sus tareas (`f2-coronarias`, `f2-angio`) están **aparcadas**: esperan las coronarias en el motor y una fuente
  de las proyecciones (Di Mario 2005 es de pago). Por eso no lo ves en la app.
- **Prioridad nueva (27/10, noche)**: Marino → El Libro Azul → lo de las webs (ingeniería inversa: eco, AngioView,
  RitmoLab…) y los modelos vivos → pulir la eco → el PIF rehecho con lo nuestro (B-005) y Radiología (B-034).
  Cardiología del PIF (ECG, laboratorio de arritmias) deja de ser prioridad.
- **🔴 Red del entorno** (todo gratis): `x.com`, `*.twitter.com`, `*.twimg.com`, `threadreaderapp.com` (leer tuits e
  hilos); `huggingface.co`, `arxiv.org` (NV-Reason-CT); `heart.org` (AHA 2025); `zenodo.org`,
  `*.cancerimagingarchive.net`, `*.radiopaedia.org`, `registry.opendata.aws` (licencias de casos de imagen).
- **🔴 PDF que hacen falta**, por urgencia: Leung y Levine 1994 (opcional) (los temarios del PIF no
  existen: ver B-005). (La guía de amiloidosis y el MAPSE ya están en `docs/` desde el 27/10; el ECG, desde el 27/10,
  3.ª tanda.)
- **✅ PDF recibidos el 27/10 (3.ª tanda)**, en `docs/` (página impresa = página del PDF + desplazamiento):
  - `lopez-ramirez-2012-alegria-leer-ecg-parte1/2/3.pdf`: López Ramírez JH. *La alegría de leer el
    electrocardiograma*, 3.ª ed. Bogotá: Celsus; 2012 (ISBN 978-958-9327-44-9). Pp. 1-195; parte 1: PDF − 10 (pdf 20
    = p. 10); parte 2: PDF + 59 (pdf 20 = p. 79); parte 3: PDF + 127 (pdf 20 = p. 147). Lo mandaste como el ECG
    básico: `pif-ecg` pasa a `pendiente` (si no es el de la rotación, dilo y se busca el otro).
  - `esc-2019-taquicardias-supraventriculares.pdf`: Brugada J, Katritsis DG, et al. 2019 ESC Guidelines for the
    management of patients with supraventricular tachycardia. Eur Heart J 2020;41:655-720
    (doi:10.1093/eurheartj/ehz467). Página impresa = PDF + 654 (pdf 10 = 664; pdf 40 = 694). Hueco de `fuentes-b3`.
  - `esc-2023-miocardiopatias-parte1/2.pdf`: Arbelo E, Protonotarios A, et al. 2023 ESC Guidelines for the management
    of cardiomyopathies. Eur Heart J 2023;44:3503-3626 (doi:10.1093/eurheartj/ehad194). Parte 1: PDF + 3501 (pdf 1 es
    la portada del repositorio; pdf 10 = 3511, pdf 40 = 3541); parte 2: PDF + 3564 (pdf 10 = 3574, pdf 40 = 3604).
    Hueco de `fuentes-b3`; sirve también a `hcm` (obstrucción del TSVI).
  - `tamagnone-pocus-ecografia-critica-muestra-parte1/2/3.pdf`: **muestra**, no el libro entero, sin año impreso.
    Junta: *POCUS. Manual práctico de ultrasonografía crítica*, 2.ª ed. (Tamagnone, Previgliano, Merlo, Benay; Corpus):
    cap. 2 «Funciones del equipo / Knobología» y el principio del cap. 3 (parte 1, pdf 3-19; impresa = PDF + 32);
    *POCUS II. Ecocardiografía crítica* (Merlo, Tamagnone, Benay; ASARUC): cap. 1 introducción (pdf 22-24, impresa =
    PDF + 0), cap. 3 técnicas y cuantificación de cavidades (parte 1 pdf 26 → parte 2 pdf 5, p. 33-65; impresa parte 1
    = PDF + 8 (pdf 28 = 36), parte 2 = PDF + 60 (pdf 3 = 63)), cap. 11 eco en el weaning (parte 2 pdf 7-17, p. 183-194, impresa = PDF + 177: pdf 9 = 186, pdf 12 = 189) y
    cap. 13 valoración hemodinámica del shock séptico por ETT (parte 2 pdf 19-46, p. 201-229, impresa = PDF + 183: pdf 20 = 203, pdf 40 = 223);
    y ~12 artículos de Cheong, Tamagnone y cols. (2021-2022: TEP en prono con *speckle tracking*, carótida en la UCI,
    elevación pasiva de piernas con ITV del TSVD subcostal, ITV del TSVI subcostal modificado, ETT en prono COVID,
    absceso pulmonar, *heart point* y *lung point* en neumotórax, sinusitis maxilar, disección carotídea, ventana
    paraesternal transhepática derecha), cada uno con su propia paginación de revista. Entre medias, páginas de
    publicidad de cursos. **No estaba pedido** y no es el libro de física de B-028; útil para Eco cardíaca (cavidades,
    weaning, shock séptico) cuando se apruebe algo que lo use.
- **✅ PDF de la ASE 2025 (27/10)**, en `docs/`:
  - `nagueh-2025-funcion-diastolica-hfpef-ase.pdf` (J Am Soc Echocardiogr 2025;38:537-569; página impresa = página
    del PDF + 536). **Lo había pedido**: el «ASE 2025 diastólica» de la fase 3 (`f3-calc-eco`, `echosuite.md` §4.6).
    Además, el atlas cap. 10 lo cita 14 veces sin tener el PDF: ahora se puede cotejar.
  - `taub-2025-informe-eco-estandarizado-ase.pdf` (2025;38:735-774; página impresa = PDF + 734). **No estaba pedido**
    en ninguna lista, pero el atlas ya lo cita en los caps. de función sistólica y VD (`taub2025`), y sirve para la
    ficha «cómo leer un informe» y los avisos críticos de la fase 3.
- **✅ PDF recibidos el 27/10 (2.ª tanda)**, en `docs/` (página impresa = página del PDF + desplazamiento):
  - `mukherjee-2025-corazon-derecho-hp-ase.pdf` (J Am Soc Echocardiogr 2025;38:141-186; +140): la PAD con
    ventilación mecánica (`eat-q032`), las calculadoras del VD (`f3-calc-eco`) y el índice de excentricidad y el grosor
    de la pared del VD (huecos de la parada 3 de `eco-mega`).
  - `zoghbi-2017-insuficiencias-valvulares-ase.pdf` (2017;30:303-371; +302): IM de la parada 3 (P5) y `mr` del atlas.
  - `klein-2013-pericardio-multimodal-ase.pdf` (2013;26:965-1027; +964): cifras del pericardio y del taponamiento.
  - `aha-2025-parte9-soporte-vital-avanzado.pdf` (Circulation 2025;152(supl. 2):S538-S577; S = PDF + 537): paro,
    taquiarritmia y bradicardia con pulso, cardioversión. `g2-paro` pasa a `pendiente`. Con
    `aha-2025-novedades-rcp.pdf` (resumen de novedades, sin paginar como la revista).
  - **Di Mario 2005**: de pago (60 €), el usuario no lo manda. `f2-angio` y `g3-sca` buscarán otra fuente de acceso
    libre para las proyecciones, o lo marcarán como hueco.
- **✅ PDF de la guía de marcapasos**: ya en `docs/` (`esc-2021-estimulacion-cardiaca.pdf`, 26/10). `b3-bradi` pasa a
  `pendiente`.
- **Simulador de arritmias (idea de RitmoLab)**: los PDF de los algoritmos **AHA 2025** (bradicardia, taquicardia,
  parada y la guía completa); heart.org está bloqueado desde el entorno. Decidido: puerta propia en la raíz
  («Arritmias»), enlazada desde Cardiología del PIF. Fases: 1) monitor, 17 ritmos y modo Estudio; 2) casos; 3) 12
  derivaciones. Antes de construir, maqueta para elegir. Detalle en `docs/historial/cardiologia.md`.
- **El Libro Azul**: **completo** en `docs/` (secciones I a X, caps. 1-61). Las IV, V, VI, VIII, IX y X llegaron el
  27/10 (abajo). Orden que pediste: Marino (hecho), después El Libro Azul y después el PIF
  de R1.
- **✅ El Libro Azul, 27/10 (4.ª tanda)**, en `docs/`. Fuente: *El libro azul. Bases fisiopatológicas de la medicina
  crítica* (Medicucheando). Página impresa = página del PDF + desplazamiento (comprobado en dos páginas de cada uno):
  - `libro-azul-seccion-v-digestivo-parte1.pdf`: caps. 37-39 (tracto GI, ictericia, hepática), pp. 609-690; +608
    (pdf 5 = 613, pdf 41 = 649).
  - `libro-azul-seccion-v-digestivo-parte2.pdf`: caps. 40-42 (pancreatitis, sangrado digestivo, HIA), pp. 691-722;
    +690 (pdf 1 = 691, pdf 16 = 706).
  - `libro-azul-seccion-v-digestivo-parte3.pdf`: caps. 43-44 (nutrición según la fisiopatología, monitorización
    nutricional), pp. 723-808; +722 (pdf 5 = 727, pdf 43 = 765).
  - `libro-azul-seccion-vi-endocrino.pdf`: cap. 45 (respuesta endocrina al estrés), pp. 807-814; +806 (pdf 5 = 811).
  - `libro-azul-seccion-viii-neurologia-parte1.pdf`: caps. 49-52 (HTIC, hipoxia tisular cerebral, isquemia, edema),
    pp. 859-920; +858 (pdf 5 = 863, pdf 31 = 889, pdf 62 = 920).
  - `libro-azul-seccion-viii-neurologia-parte2.pdf`: caps. 53-56 (estado epiléptico, hemorragia cerebral, TCE,
    neuromonitorización multimodal), pp. 921-970; +920 (pdf 5 = 925, pdf 25 = 945).
  - `libro-azul-seccion-ix-embarazo.pdf`: cap. 57 (trastornos hemorrágicos del embarazo), pp. 969-982; +968 (pdf 5 =
    973, pdf 14 = 982).
  - `libro-azul-seccion-x-miscelaneos.pdf`: caps. 58-61 (caquexia, RCP, control de daños, gran quemado),
    pp. 983-1044; +982 (pdf 5 = 987, pdf 31 = 1013, pdf 62 = 1044).
  - `libro-azul-seccion-iv-respiratorio-parte1.pdf`: caps. 24-29 (fisiología respiratoria, hipoxemia e
    hipercapnia, IRA, EPOC, SDRA, NAV), pp. 385-464; +384 (pdf 5 = 389, pdf 60 = 444, pdf 80 = 464).
  - `libro-azul-seccion-iv-respiratorio-parte2.pdf`: caps. 30-33 (diafragma, ventilación mecánica y sus modos, modos
    nuevos, monitorización respiratoria), pp. 465-564; +464 (pdf 1 = 465, pdf 30 = 494, pdf 60 = 524).
  - `libro-azul-seccion-iv-respiratorio-parte3.pdf`: caps. 34-36 (bases de las técnicas, trabajo respiratorio,
    retirada de la ventilación mecánica), pp. 565-608; +564 (pdf 1 = 565, pdf 21 = 585, pdf 40 = 604).
  Desbloquea la segunda parte de B-004 (secciones nuevas, cuando la apruebes).
- **PIF de R1**: ya no se espera ningún PDF de temario (27/10): ver B-005.
- **TRR**: el PDF de Valdenebro 2021, para cotejar las 7 dudas anotadas en `docs/historial/nefrologia.md`.
- **Eco, paradas 1 y 2 ya en main (27/10)**: mirarlas en el móvil (Eco cardíaca → simulador: A4C, subcostal,
  «Derrame» y «Hemorragia» a fondo, TEP, «Señálalo → Festones y cúspides»). La parada 3 (F3, F4, N1, P5, P6) espera
  los PDF de los huecos. Si tienes la **ASE 2025** en PDF, también daría la PAD con ventilación mecánica.
- **Sesiones cerradas (hecho el 27/10)**: las sesiones del plan se cierran solas y cada una deja su fila en
  `autonomo/SESIONES.md` (tarea, qué salió, informe o PR, qué te toca, parte y enlace a la sesión archivada). El
  informe «Bitácora diaria» lo lee y ya no se archiva a sí mismo.
- **2 PDF para cerrar los huecos del bloque 3** (`fuentes-b3`, 27/10): AHA 2020 de soporte vital (o ERC 2021) y el
  consenso SCAI 2015. Sin ellos, esos puntos quedan marcados como hueco. (La ESC 2019 de TSV y la ESC 2023 de
  miocardiopatías ya están en `docs/`, 27/10: los huecos que cubren se pueden citar ya.)
- **Rutina nocturna** (que el plan trabaje solo de madrugada, ~3:00 de Canarias, con aviso al móvil): **no montarla
  aún**; límite fijado el 27/10: como mucho el 18 % del uso semanal en un día (tablero).
