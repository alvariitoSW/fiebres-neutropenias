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
