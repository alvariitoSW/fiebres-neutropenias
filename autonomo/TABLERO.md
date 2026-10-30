# Tablero del plan socialista

Lo edita el usuario (orden, notas, límites), la bitácora (`/bitacora`: mete las tareas que el usuario aprueba y las
marca `hecha` al fusionarse su PR) y el director del plan (estados). Una tarea por línea, en orden de prioridad.

- **Límite por sesión:** 1 tarea, o una parada de un bloque (decisión del usuario, 25/10/2026, para ahorrar: el director
  relee su conversación en cada paso). La siguiente, en una sesión nueva que abre el propio director
- **Vueltas máximas por tarea:** 3 (constructor ↔ jueces). Una 4.ª solo si tras la 2.ª quedan **más de 3 fallos**
  (sumando graves, medianos y pequeños); nunca más de 4.
- **Parar si:** 2 tareas seguidas fallan o quedan bloqueadas
- **Límite de gasto por día** (decisión del usuario, 27/10/2026): **como mucho el 18 % del uso semanal** del plan de
  pago Max (×5) en un día, sumando todas las sesiones. Equivalencia en millones de `gasto.mjs`: **por calibrar** (al
  cerrar una sesión, el usuario mira el % en Ajustes → Uso y se anota junto a lo que dio `gasto.mjs`). Hasta tenerla,
  el director avisa antes de lanzar algo que vaya a pasar de ~15 M en el día y no encadena tareas sin preguntar
- **Modo git y paradas** (`REGLAS.md` §2.3, desde el 20/10/2026): el contenido de un bloque, en una rama `auto/<bN>`
  con una sola PR en borrador y 4-5 paradas del usuario por bloque; los arreglos y lo técnico, directo a `main` con
  los jueces en verde
- **Gasto que baja** (decisión del usuario, 26/10/2026: «cada operación que hacemos que cueste X tokens, hay que hacer
  que la siguiente nos intente costar un poco menos»): cada encargo lleva su **presupuesto** (pasos y tokens
  equivalentes) = el 90 % del último agente del mismo papel y modelo en una pieza parecida (tabla de abajo); al llegar
  al presupuesto, el agente para y entrega lo hecho con lo que falta. El parte compara gasto con presupuesto, dice por
  qué se pasó o cómo ahorró, y actualiza la tabla. Las pruebas y arneses que escribe un agente se guardan en el
  repositorio (`autonomo/bloques/<bN>/herramientas/`) para que el siguiente los reutilice. Fable solo para pensar
  (profesor, cobertura); constructores, arreglos y auditor, en sonnet; opus solo para el primer modelo vivo de algo
  nuevo (decisión del usuario, 26/10/2026). Reglas completas en `autonomo/REGLAS.md` §4.7
- **Presupuestos vigentes** (medidos el 26/10 en `b3`; equivalentes de `gasto.mjs`): profesor juzgar a fondo · fable
  60 pasos / 1,3 M (medido 107 / 2,3 M) · profesor juicio rápido · fable 60 / 1,0 M (75 / 1,1 M) · profesor cobertura ·
  fable 40 / 0,85 M (41 / 0,93 M) · constructor maqueta · sonnet 60 / 1,1 M (72 / 1,3-1,6 M) · constructor arreglos
  cortos · sonnet 15 / 90 k (9-12 / 0,1 M) · auditor · sonnet 35 / 0,55 M (32-44 / 0,46-0,77 M) · director, una parada:
  0,9 M (0,98 M) · **27/10 (`b3` límites):** profesor límites o juicio rápido de una maqueta · fable 20 / 0,4 M (15-36 / 0,3-0,57 M) · rejuicio · fable 13 / 0,25 M (13-15 / 0,22-0,31 M) · constructor límites de una maqueta · sonnet 32 / 0,6 M (30-40 / 0,6-1,2 M) · constructor arreglos cortos · sonnet 18 / 0,25 M (18-52 / 0,26-0,7 M) · partir en módulos · sonnet 40 / 0,6 M · auditor de frases · sonnet 30 / 0,5 M (49 / 1,1 M en tres tandas) · director 3,5 M (sesión larga, sin cumplir) · **27/10 (`b3` pantallas):** profesor plan corto · fable 10 / 0,2 M · juicio rápido · fable 15 / 0,25 M · rejuicio · fable 13 / 0,16 M · primera pieza común de interfaz · opus 55 / 1,2 M · pantalla que copia un patrón · sonnet 50 / 0,9 M · arreglos con pieza de estudio · sonnet 50 / 0,75 M · auditor de frases · sonnet 15 / 0,12 M · director, una parada 0,8 M (cumplido: 0,78 M) · **27/10 (`b3` parada 2):** llevar una maqueta a la app (modelo) · sonnet 90 / 2,0 M · Mayéutica de un modelo desde su maqueta · sonnet 50 / 1,2 M · profesor lista R2 · fable 13 / 0,2 M · juicio de un modelo en la app · fable 15 / 0,7 M · rejuicio · fable 10 / 0,15 M · arreglos de juicio · sonnet 35 / 0,4 M · auditor de paso a la app · sonnet 25 / 0,3 M · director, parada de tres modelos 4,5 M (5,1 M medido: partirla) · **30/10 (`reglas-30-10`, REGLAS §4.14):** estado nuevo con barrido (uno por encargo) · sonnet 30 / 0,7 M · comprobar la dirección de una pieza de motor · sonnet 10 / 0,1 M · pieza de estado (su lupa o su tipo ya existen) 0,5 M · pieza sin lupa ni tipo (cuenta como modelo) 1,2 M
- **Gobierno** (B-036, aprobado por el usuario el 28/10/2026; `REGLAS.md` §4.10): el usuario aprueba el **presupuesto de
  cada bloque** (se apunta en su objetivo); dentro de él, `/plan-socialista` (Interior) presupuesta cada tarea antes
  de gastar y rinde cuentas en el parte («Cuentas»); `/ahorro` (Hacienda) recorta sola lo que no baja la calidad y lo
  deja escrito; si una tarea va a pasarse más de un **25 %**, el director para y comparece antes de seguir
  · **Presupuestos de bloque aprobados**: `b3-paso4` 36 M (opción A, 27/10), ampliado a ≈46 M por el usuario al comparecer (29-30/10) y **a ≈51 M el 30/10** («acepto los 5 M más»); **corregido a ≈58 M por el Consejo del 30/10 (6.ª, potestad delegada)**: el tabique y el grupo 5 gastaron 11,7 M (+30 %, aceptado); gastado 52,1 M; **grupo 6, tope duro 5,9 M** (medir con `gasto.mjs` tras cada constructor, sin suite larga al iterar, encargos ≤60 pasos; si no cabe, se parte y comparece antes) · **reglas pasadas a REGLAS y skills**: ≈0,1 M por regla sin código, ≈0,2 M con prueba en código (Consejo 30/10, 6.ª, tras el +165 % de `reglas-30-10`)
  · **Marino 100 %** (B-035, aprobado por el usuario el 28/10): objetivo ≈212-328 M, **techo 400 M**. «Hacienda debería estar muy presente vigilando el ahorro […] que lo baje lo máximo que pueda […] un equilibrio, sobre todo para futuras sesiones ahorrar mejor»: Hacienda pasa en **cada** tarea (antes y después) y al cerrar cada bloque deja su balance y el presupuesto del bloque siguiente ajustado con lo medido
  · **El margen hasta el techo (de ≈328 a 400 M) es sobre todo para Educación** (el usuario, 28/10: «quiero que se lo curren bien y sean capaces de darle una vuelta a la educación con IA para poder estudiar con modelos vivos, con preguntas socráticas […] ser pionero mundial en evolucionar la manera de estudiar»): Hacienda no recorta la calidad de la Mayéutica; recorta en todo lo demás. Lo valora el Consejo (B-040)
- **Una tarea solo pasa a `en revisión`** con el enlace de su PR anotado; sin enlace, no avanza

Estados: `pendiente` · `en curso` · `en revisión` (PR abierta) · `hecha` (PR aprobada) · `necesita humano` · `aparcada`

## Tipos de tarea y su «hecho»

Cada tarea tiene un tipo. El «hecho» de un tipo **se suma** al del objetivo (p. ej. un capítulo del atlas es tipo
*visual* y además cumple los puntos del Objetivo 1).

| Tipo | Qué es | «Hecho» propio | Modelo del constructor |
|---|---|---|---|
| `visual` | contenido nuevo o rehecho: fase A (fiel) + fase B (visual y preguntas) | fidelidad + **rúbrica de estudio ≥8 sobre 10 (meta 8,75) en todo** (REGLAS §7 y §8, juez `profesor`) + paciente posible si hay simulador | potente (opus) |
| `estudio` | contenido que **ya está** en la app: fase A ligera (comprobación de fuentes: cifras, páginas y bibliografía contra el PDF; lo grave se corrige, lo bueno no se reescribe) + fase B (el profesor diseña lo visual con los modelos grandes, el recorrido de preguntas y los casos) | comprobación sin graves + rúbrica ≥8 sobre 10 (meta 8,75) en §7 y §8 + auditor sin graves en preguntas, casos y figuras | barato en la fase A, potente (opus) en la B |
| `revision` | **revisar** algo ya construido, sin construir: fidelidad a la fuente (temas completos, cifras, figuras e imágenes, bibliografía y páginas), código (solo graves) y móvil; los revisores dejan ideas para la parte de estudio | graves corregidos; informe de menores; ideas anotadas en `autonomo/ideas/<libro>.md` | barato (sonnet) |
| `mapa` | el profesor, como director de arte, mira un libro entero y propone los pocos modelos grandes que lo explicarían, el orden de los bloques y las maquetas que el usuario debe elegir | «Mapa visual» en `autonomo/ideas/<libro>.md` + maqueta de cada modelo nuevo para que el usuario elija | potente (opus) |
| `auditoria` | cotejar fichas existentes con su fuente | informe de graves/huecos/menores y los graves corregidos | barato (sonnet) |
| `arreglo` | un fallo concreto | el fallo ya no se reproduce y nada se rompe (jueces) | barato |

Las preguntas ya no son un tipo aparte: van dentro de la fase B, con el formato de REGLAS §8 (modelo:
`autonomo/modelos/preguntas-para-estudiar.html`).

## Ficha de encargo (una por tarea, debajo de su fila)

Si falta algún campo, el director lo rellena con su mejor criterio a partir de los modelos «así sí» y lo deja
escrito en el parte (no se para a preguntar: el usuario eligió trabajar sin frenos).

```
**Encargo `<clave>`** · tipo: visual | estudio | auditoria | arreglo
- Qué quiero: una frase.
- Para qué: estudiar | consultar a pie de cama.
- Modelo «así sí»: qué pieza de la app debe igualar (REGLAS §7).
- Lo visual que espero: qué concepto se ve con qué pieza (p. ej. «el chorro en color en la 4C del ecógrafo»).
- Modelo grande que usar: nefrona, glomérulo, ecógrafo, motor… y en qué estado (REGLAS §7.8).
- Preguntas que espero: el recorrido y qué casos (p. ej. «un caso de shock séptico que evoluciona a FRA»).
- Lo que NO quiero.
- Fuente.
```

---

## Objetivo M · Plan Marino, fase 1: revisar lo ya construido

Aprobado por el usuario el 14/10/2026 (bitácora B-003, solo la fase 1). Tipo `revision`: no se construye nada. Libros →
Marino ya centraliza todos los temas y **las fichas se quedan donde están** (decisión del usuario). Las fichas de
cada trozo salen de `js/data/libros-indice.js` (capítulos y su `tab`); el PDF y la página, también.

«Hecho» de cada trozo:
1. Auditor ciego, revisor de código y verificador pasados; lo grave corregido y verificado.
2. Lo menor, anotado en el parte; si hay 3 o menos y son baratos, se corrigen en la misma vuelta.
3. «Ideas para la parte de estudio» de los tres revisores añadidas a `autonomo/ideas/marino.md`.
4. PR en borrador (aunque solo lleve el parte y las ideas), con «Ver en el móvil» si hubo cambios en la app.

| # | Clave | Capítulos | Estado | Notas |
|---|---|---|---|---|
| 1 | `marino-r1` | 1-6 (acceso vascular y prácticas habituales) | hecha (2026-10-14) · PR #3 | 13 fichas · Libros |
| 2 | `marino-r2` | 7-11 (monitorización y fluidoterapia) | hecha (2026-10-14) · PR #4 | 10 fichas · Libros |
| 3 | `marino-r3` | 12-13 (anemia, transfusión, plaquetas y plasma) | hecha (2026-10-14) · PR #5 | 6 fichas · Merino HEMATO |
| 4 | `marino-r4` | 14-17 (shock) | hecha (2026-10-14) · PR #6 | 12 fichas · Merino Cardiología |
| 5 | `marino-r5` | 18-21 (trastornos cardíacos) | hecha (2026-10-14) · PR #7 | 12 fichas · Merino Cardiología |
| 6 | `marino-r6` | 22-26 | hecha (2026-10-14) · PR #8 | 13 fichas · Merino Neumología |
| 7 | `marino-r7` | 27-30 | hecha (2026-10-14) · PR #9 | 10 fichas · Merino Neumología |
| 8 | `marino-r8` | 31-35 | hecha (2026-10-15) · PR #10 | 15 fichas · Libros |
| 9 | `marino-r9` | 36-38 | hecha (2026-10-15) · PR #12 | 8 fichas · Libros |
| 10 | `marino-r10` | 39-44 | hecha (2026-10-15) · PR #11 | 17 fichas · Libros |
| 11 | `marino-r11` | 45-47 | hecha (2026-10-15) · PR #14 | 14 fichas · Libros |
| 12 | `marino-r12` | 48-51 | hecha (2026-10-15) · PR #15 | 14 fichas · Libros |
| 13 | `marino-r13` | 52-53 y apéndices | hecha (2026-10-15) · PR #13 | 11 fichas · Libros |

---

## Objetivo 0 · Preguntas para estudiar en la app

Va primero: sin el botón «Preguntas» y sus formatos, ninguna tarea puede entregar preguntas como las de §8.

| # | Clave | Qué | Estado | Notas |
|---|---|---|---|---|
| 1 | `preguntas` | Botón «Preguntas» en el interruptor de las fichas, los tres formatos y el caso clínico, con la ficha de HIT como primera | aparcada | Espera su aprobación en la bitácora (B-001). Encargo debajo. Maqueta aprobada por el usuario el 14/10/2026. |

**Encargo `preguntas`** · tipo: visual
- Qué quiero: que la maqueta aprobada funcione dentro de la app, empezando por la ficha de trombocitopenia y HIT de
  Merino HEMATO.
- Para qué: estudiar.
- Modelo «así sí»: `autonomo/modelos/preguntas-para-estudiar.html`, tal cual (aspecto, textos de los botones, orden).
- Lo visual que espero: el interruptor **Texto | Visual | Preguntas** en cada ficha que tenga preguntas; dentro, el
  recorrido en el orden del texto, el repaso de lo fallado y el caso clínico; los tres formatos de REGLAS §8 (test
  con «piensa antes», piensa y destapa con puntos, encuentra el error con 0-2 errores); el caso con la ficha del
  paciente que se rellena, el botón que abre la calculadora de la ficha (la 4Ts) y «Lo que te llevas».
- Lo que NO quiero: un segundo quiz ni mucho código nuevo (el usuario lo pidió así): se amplía
  `js/modules/quiz/quiz.js` y los bancos de `js/data/`, sin tocar la única llamada a `initQuiz()`. Nada de redactar,
  huecos ni emparejar. Las preguntas viejas no se tocan.
- También: `autonomo/jueces.mjs` comprueba los formatos nuevos (destapa con 2-4 puntos; error con 0-2 falsas y su
  corrección; caso con pasos, giro y «Lo que te llevas»), y `CLAUDE.md` §8 y §6 se actualizan (las cambia el
  usuario o una conversación normal, no el plan: el director lo propone en el parte).
- Fuente: la ficha de HIT de la app (Marino, The ICU Book), ya cotejada; las preguntas y el caso de la maqueta
  salen de ella.

---

## Objetivo 1 · Terminar el atlas de Eco cardíaca

**28/10**: además de esperar a Marino, los capítulos esperan la decisión de la reforma de la eco (B-039, informe `eco-reforma`): se escribirían sobre un motor que puede cambiar.

*The Heart by Ultrasound* (David Ouyang) en español, dentro de Eco cardíaca → Atlas. Hoy hay **9 de 30** capítulos.
Marcador: capítulos con estado `hecha`.

### Fuente

- Texto, preguntas y bibliografía: <https://github.com/douyang/echodemo> (clonar en `/tmp/echodemo`). Uso del texto
  con permiso del autor; el código no se copia.
- Patrón a seguir: los 9 capítulos ya hechos (`js/modules/eco/atlas/`) y la sección «Atlas de ecocardiografía» de
  `js/modules/eco/README.md`.

### Qué es «hecho» para un capítulo (todos los puntos)

1. **Texto**: `js/modules/eco/atlas/cap-<nombre>.html`, traducción completa del capítulo (sin resumir), con sus
   citas `<sup class="at-cita" data-ref="…">`. Toda referencia citada existe en `atlas/referencias.js`.
2. **Figura**: `js/modules/eco/atlas/<nombre>.mjs`, con `montar(el) → { parar() }`, reconstruida sobre los motores
   de la app (motor del latido, geometría, ecógrafo). Las cifras que muestra salen del motor o llevan su origen
   (`ficha` / `fisiología general` / `ilustrativo`).
3. **Registro**: entrada en `CAPITULOS` de `atlas/atlas.js` (el índice lo abre dentro de la app).
4. **Pruebas**: al menos una prueba nueva en `js/modules/eco/pruebas/atlas.test.mjs` que compruebe que la figura va
   en el sentido del texto (como las de los capítulos 07, 08, 10 y 14). Todas las pruebas en verde:
   `node --test 'js/modules/eco/pruebas/*.test.mjs'`.
5. **Preguntas**: en `js/data/eco-atlas-preguntas.js` (tema `atlas-<clave>`, con su entrada en `temasAtlasEco`):
   las del original traducidas y el recorrido y el caso del profesor, con el formato de REGLAS §8 (sin redactar).
6. **Móvil**: el capítulo abre desde el índice, la figura se monta y responde a sus mandos, sin errores de consola y
   sin desbordar a 390 ni a 360 px.
7. **Enlaces**: si el capítulo tiene una ficha hermana en la app (p. ej. Merino Cardiología, Fisiopatología UCI),
   un botón `[data-especialidad]` en cada dirección.
8. **Documentación**: párrafo nuevo en la sección del atlas de `js/modules/eco/README.md` y, en `docs/historial/eco.md`, la
   cuenta de capítulos actualizada en la sección del atlas (una línea, no un relato).
9. **Auditoría ciega** sin hallazgos graves pendientes.
10. **Sirve para estudiar** (tipo `visual`): el juez `profesor` da ≥8 sobre 10 (meta 8,75) en todos los puntos de REGLAS §7 comparando
    con el capítulo 14 o el 10. La figura enseña **lo que el capítulo enseña, en la imagen que lo muestra en la
    clínica**: si es eco, en el ecógrafo de la app (vistas, Doppler color, espectros, modo M); si es hemodinámica,
    con el motor (asa, presiones) a la vez. Al menos igual de didáctica que la figura del original de echodemo.
11. **Texto para estudiar**: arriba la idea central y la figura; el resto en bloques cortos, tablas y resaltado
    (REGLAS §7.1-3). Nunca la traducción como un muro de párrafos.

### Tareas

Aparcadas hasta que el usuario apruebe la entrada B-006 de la bitácora (método nuevo: fase A + fase B).

| # | Clave | Capítulo | Estado | Notas |
|---|---|---|---|---|
| 1 | `mr` | 18 Insuficiencia mitral | aparcada | Espera su aprobación en la bitácora (B-002). **Solo falta la fase B**: el usuario da por bueno el texto del piloto (PR #2, fase A hecha y auditada). Se trabaja **sobre la rama `auto/mr`** y completa la misma PR. Encargo debajo. |
| 2 | `as` | 15 Estenosis aórtica | aparcada | El motor ya tiene `areaAortica` y la recuperación de presión. |
| 3 | `tr` | 19 Insuficiencia tricuspídea | aparcada | El motor ya tiene `eroaTricus`. |
| 4 | `peri` | 21 Enfermedad pericárdica | aparcada | El simulador ya tiene derrame; el taponamiento y la constricción, no. |
| 5 | `ar` | 16 Insuficiencia aórtica | aparcada | El motor no la tiene: habrá que añadirla con pruebas. |
| 6 | `ms` | 17 Estenosis mitral | aparcada | El motor no la tiene. |
| 7 | `segments` | 11 Contractilidad segmentaria | aparcada | Necesita contractilidad por segmento en la geometría. |
| 8 | `strain` | 13 Strain | aparcada | Hay una aproximación en el cap. 09 («acortamiento del borde»). |
| 9 | `stress` | 12 Eco de estrés | aparcada | Depende de `segments`. |
| 10 | `hcm` | 22 Miocardiopatía hipertrófica | aparcada | Ya hay forma «hipertrofia del VI»; falta la obstrucción del TSVI. |
| 11 | `amyloid` | 23 Amiloidosis cardíaca | aparcada | |
| 12 | `aorta` | 20 Enfermedades de la aorta | aparcada | |
| 13 | `windows` | 04 Vistas transtorácicas | aparcada | El simulador ya tiene 10 vistas y sonda libre. |
| 14 | `shunts` | B4 Cortocircuitos | aparcada | |
| 15 | `masses` | B5 Masas y trombos | aparcada | |
| 16 | `mi` | B6 Complicaciones del infarto | aparcada | |
| 17 | `endocarditis` | B3 Endocarditis infecciosa | aparcada | |
| 18 | `prosthetic` | B2 Prótesis valvulares | aparcada | |
| 19 | `lvad` | B1 Asistencias ventriculares | aparcada | Probablemente `necesita humano`: el motor no tiene bomba. |
| 20 | `tee` | 05 Ecocardiografía transesofágica | aparcada | Probablemente `necesita humano`: no hay sonda esofágica. |
| 21 | `ai` | 24 Interpretación con IA | aparcada | Probablemente `necesita humano`: decidir antes qué se enseña sin modelo. |

### Encargos

**Encargo `mr`** · tipo: estudio (solo fase B, sobre la rama `auto/mr`; el texto del piloto se queda)
- Qué quiero: el capítulo 18 convertido en algo para estudiar la insuficiencia mitral de un vistazo, sin rehacer su
  texto (ya fiel): figura nueva en el ecógrafo, texto reorganizado para estudiar y preguntas rehechas.
- Para qué: estudiar.
- Modelo «así sí»: capítulo 14 (VD) y receptores animados; la nefrona viva como nivel de «se ve lo que pasa».
- Lo visual que espero: en el **ecógrafo de la app**, la 4C (o 3C) con el **chorro en color** hacia la AI, la
  **convergencia PISA** sobre la válvula y su radio, el **Doppler continuo** del chorro y el **Doppler pulsado de la
  vena pulmonar** (S que se aplana e invierte) moviéndose con el mando de gravedad; a la vez el VI y la AI que se
  dilatan. El cálculo PISA paso a paso como animación (los 4 pasos del texto). La tabla de grados con la posición del
  paciente marcada.
  Ojo: el ecógrafo de la app aún no pinta el chorro regurgitante ni el flujo de venas pulmonares con IM; el motor ya
  tiene `eroaMitral`. Hay que añadirlo al simulador (con sus pruebas; `js/modules/eco/CLAUDE.md`), no esquivarlo.
- Modelo grande que usar: el ecógrafo y el motor del latido (`eroaMitral`).
- Preguntas que espero: el recorrido del capítulo (PISA, Doppler de venas pulmonares, grados) y un caso de IM aguda
  frente a crónica que evoluciona.
- Lo que NO quiero: tarjetas de números como figura principal; párrafos largos; un esquema de círculos.
- Fuente: echodemo (`src/ch/mr.js`, `index.html` #ch-mr), extracto en la PR #2.

## Objetivo M2 · Plan Marino, fase 2: mapa visual

Aprobado por el usuario el 15/10/2026 (bitácora B-003, fase 2). **Empieza cuando toda la fase 1 esté hecha o en
revisión** (decisión del usuario del 14/10: primero la fase 1 entera). Las fases 3-5 de B-003 siguen esperando.

| # | Clave | Qué | Estado | Notas |
|---|---|---|---|---|
| 1 | `marino-mapa` | Mapa visual de todo Marino (profesor, modo mapa) y maquetas v2 con Mayéutica | hecha (2026-10-19) · PR #16 | Maquetas: https://claude.ai/artifact/XkbXSjmeJF7BeHhQ2wSC4L |
| 2 | `formas-iones` | Una sola leyenda de formas de iones y moléculas en toda la app | hecha (2026-10-19) · PR #17 | |

**Encargo de `marino-mapa`** (tipo `mapa`, profesor con el modelo potente):
- **Qué quiero**: el «Mapa visual» de The ICU Book en `autonomo/ideas/marino.md`. Son los pocos modelos grandes,
  vivos y biológicos que explicarían casi todo el libro, el orden de los bloques de estudio y lo que no merece
  modelo.
- **Para qué**: que las fases 4-5 construyan pocos modelos buenos en vez de un gráfico por ficha (REGLAS §7.8).
- **Mandan las ideas del usuario** (sección de `autonomo/ideas/marino.md`):
  - los fluidos como **agua de río y de mar**, con un buen trabajo artístico;
  - **ácido-base como proyecto propio** sobre el riñón de PIF Nefrología (nefrona viva, glomérulo), mejorado con
    Marino. Tiene que **sorprender a nivel artístico** y ser de las mejores herramientas visuales de la app.
- **Ideas de los revisores R1-R13** en el mismo archivo. Hay que pesar sobre todo:
  - el **pulmón con respirador** (lo piden los tres revisores de R6 y de R7);
  - el **modelo de shock** sobre el motor del latido y el eco;
  - el **hígado y el amonio**;
  - el **termostato**.
- **Modelos que ya existen** y hay que mirar funcionando: corazón, ecógrafo y atlas; motor del latido; nefrona viva
  y glomérulo; potasio; filtro de la TRR; receptores animados con Motion.
- **Lo visual que espero**: cada modelo nuevo, con una **maqueta** (página o Artifact) para que el usuario elija
  antes de construir.
- **Lo que NO quiero**: gráficos de tarjetas de números ni barras sueltas; modelos que repiten lo que un modelo
  grande ya puede hacer.
- **Fuente**: los PDF de Marino en `docs/` (imágenes reales ya en la app) e `js/data/libros-indice.js`.
- **Hecho**: el mapa escrito, con las maquetas de los modelos nuevos publicadas y la PR en borrador con su enlace.

**Encargo de `formas-iones`** (tipo `arreglo`, constructor potente; aprobado el 19/10/2026):
- **Lo que dijo el usuario**: «Sí, vamos a unificar todas esas formas en la app, pero antes arregla los fallos que me
  has comentado». Del color del HCO₃⁻ dijo que le da igual, siempre que se distinga del resto.
- **Qué quiero**: que cada ion o molécula tenga **la misma forma en todos los modelos vivos**: nefrona viva,
  glomérulo, filtro de la TRR, escena del potasio, ácido-base vivo y río y mar. Hoy chocan:
  - en la nefrona viva, el rombo es la glucosa y el hexágono la urea;
  - en el agua, el rombo es el salino;
  - en el ácido-base, el rombo es el Cl⁻ y el hexágono los cetoácidos.
- **Propuesta de partida (profesor, 19/10)**:
  - hexágono = urea en todos;
  - rombo = Cl⁻ y la sal;
  - glucosa = «cristal»;
  - aniones no medidos (cetoácidos, lactato, fórmico) = una forma propia;
  - HCO₃⁻ = triángulo, con un color que se distinga.
- **Cómo**: una sola tabla de formas en `js/data/`, que lean todos los modelos (CLAUDE §5: los datos compartidos van
  una sola vez). Las maquetas de `autonomo/maquetas/` se ajustan a la misma tabla.
- **Lo visual que espero**: una leyenda de formas igual en todos los modelos. Antes de tocar la app, una lámina con la
  tabla de formas y una captura de cada modelo, para que el usuario la vea.
- **Lo que NO quiero**: la identidad solo por color (CLAUDE §5), ni cambiar la fisiología de los modelos.
- **Hecho**: jueces en verde (`--ficha` de las fichas con nefrona viva y glomérulo), pruebas de eco en verde si se
  toca, capturas a 390 y 360 px de cada modelo con su leyenda.

---

## Objetivo M4 · Plan Marino, fase 4: los modelos grandes en la app

Aprobado por el usuario el 19/10/2026: aprobó las maquetas v2 (PR #16) y dónde vive cada una. «Me parece bien, pero
a parte añadiría también que se pueda ir a ambos desde Marino y desde Nefrología y así poder buscarlas fácilmente».

| # | Clave | Qué | Estado | Notas |
|---|---|---|---|---|
| 1 | `acidobase-vivo` | Ácido-base vivo en la app (PIF → Nefrología, junto a la nefrona viva) | hecha (2026-10-19) · PR #18 | Maqueta `autonomo/maquetas/marino-acidobase-v2.html` |
| 2 | `agua-viva` | Río y mar en la app (Libros → Marino → Fundamentos, junto a la fluidoterapia) | hecha (2026-10-19) · PR #18 | Maqueta `autonomo/maquetas/marino-agua-v2.html` |

**Encargo común** (tipo `visual`, constructor potente; la medicina ya está auditada en las maquetas, así que la fase A
es ligera):
- **Qué quiero**: pasar la maqueta aprobada a la app **sin perder nada**:
  - Explorar, Conceptos y Mayéutica, con los casos;
  - el «primero predices, luego compruebas»;
  - las formas de `js/core/particulas.js`;
  - los chips de origen.
- **Dónde vive**:
  - el ácido-base, en Nefrología, junto a la nefrona viva;
  - el río y mar, en Libros → Marino → Fundamentos, junto a la fluidoterapia (caps. 10-11).
- **Accesos (pedido del usuario)**:
  - a **las dos** se llega desde el menú de Marino (Libros) y desde el de Nefrología;
  - el buscador global las encuentra por su nombre y por sus temas (pH, gasometría, hiato, sueros, hemorragia,
    sodio…);
  - botones en las fichas que tocan, que abren el modelo **en el estado de ese tema** (p. ej. la alcalosis abre los
    vómitos), con el enlace cruzado de siempre (CLAUDE §5).
- **Mayéutica**: aciertos y fallos en el almacenamiento del quiz que ya existe (CLAUDE §2: es una de las tres
  excepciones). Sin `data-correcta` ni `data-mal` en el HTML. Ids con prefijo propio, sin duplicados.
- **Lo que NO quiero**: colores fuera de los tokens, otra librería, un listener nuevo por módulo, copiar la nefrona
  viva.
- **Hecho**:
  - jueces en verde con `--ficha` de las fichas que enlazan;
  - las dos herramientas abren a 390 y 360 px sin errores ni desborde;
  - `__pruebas()` o su equivalente en verde;
  - los casos llegan a «Lo que te llevas»;
  - verificador, auditor ciego (solo lo que cambie de la maqueta) y profesor (≥8 sobre 10 (meta 8,75));
  - PR en borrador con «Ver en el móvil».

## Objetivo M5 · Marino en modelos vivos, por bloques (prioridad única)

Aprobado por el usuario el 19/10/2026. **Es la prioridad**: lo demás (atlas de eco, El Libro Azul, PIF) espera hasta
terminar Marino. La app pasa de texto teórico a **modelos vivos + Mayéutica** que explican casi todo el libro
(REGLAS §8, «Mayéutica»). **Un bloque no empieza hasta que el anterior está terminado y aprobado.**

**Cada bloque, en 5 pasos**:
1. **Mapa de cobertura** (profesor): para cada ficha, qué modelo vivo la explica y en qué estado, qué cubre la
   Mayéutica y qué queda para «Para profundizar». Da un porcentaje por ficha y por bloque (objetivo ≈85 %).
2. **Maquetas** de los modelos nuevos que hagan falta, para que el usuario elija.
3. **Construir** los modelos en la app.
4. **Estudio en cada ficha**:
   - interruptor Texto | Visual | Mayéutica (Visual = el modelo vivo en el estado de la ficha);
   - Guía socrática + Examen (nivel MIR) + casos;
   - «Para profundizar» con lo que no se cubre;
   - la **ruta del bloque**, con el orden de estudio.
5. Jueces (`--ficha` y `--modelo`), auditor, profesor (≥8 sobre 10 (meta 8,75)) y PR en borrador con «Ver en el móvil».

**Orden de los bloques**: 1-11 → 12-13 → 14-22 → 23-30 (pulmón con respirador) → 31-38 (ya tiene ácido-base vivo y
río y mar) → 39-44 → 45-53.

| # | Clave | Qué | Estado | Notas |
|---|---|---|---|---|
| 1 | `b1-cobertura` | Bloque 1 (caps. 1-11, 23 fichas): mapa de cobertura | hecha (2026-10-19) · ≈90 % | Grupos: fluidos (río y mar), hemodinámica (circulación viva), oxígeno (capilar y oxígeno, nuevo), accesos vasculares (catéter vivo, nuevo), sin modelo claro (úlcera de estrés, tromboprofilaxis, analgesia, sedación) |
| 2 | `b1-maquetas` | Bloque 1: maquetas (capilar, catéter y «La cama 7»: muralla, telar, inmersión) | hecha (2026-10-20) · capilar y catéter, construidos; «La cama 7» aprobada y construida en la app (PR en borrador); https://claude.ai/artifact/Q4Fii5DVMgqGhQf7429ouv | Aprobadas por el usuario el 19/10, tras el mapa de cobertura |
| 3 | `b1-modelos` | Bloque 1: construir en la app los modelos elegidos | hecha (2026-10-20) · capilar y catéter (PR #20) y motor del corazón (PR #21), en main | La cama 7 (muralla, telar e inmersión), en PR en borrador (20/10) |
| 4 | `b1-estudio` | Bloque 1: Texto \| Visual \| Mayéutica en las 23 fichas, ruta y «Para profundizar» | hecha (2026-10-20) · 23 fichas, auditadas (PR #19), en main | Sustituye a B-001 (preguntas) para este bloque |
| 5 | `b2` | Bloque 2 (caps. 12-13, 6 fichas de Merino HEMATO): cobertura, maquetas, modelos y estudio | hecha (2026-10-21) · PR #26 aprobada por el usuario, en main | Paquete: `autonomo/bloques/b2/encargo.md`. Una sola rama `auto/b2` y 4-5 paradas (REGLAS §2.3) |
| 6 | `motor-mayeutica` | Un solo motor de Mayéutica para fichas y modelos vivos (lección del bloque 1) | hecha (2026-10-20) · `core/mayeutica-motor.js`, en main | Tarea técnica: va directo a main con los jueces en verde |
| 7 | `b3` | Bloque 3 (caps. 14-30 desde el 26/10: 26 fichas de Merino Cardiología y Neumología + 21 del pulmón con respirador) | pendiente (paso 4: estudio en las 26 fichas; el 3A ya lo tiene. **Plan del paso 4 escrito el 27/10, sin construir**: `autonomo/bloques/b3/plan-paso4.md`, 17 fichas en 6 grupos y 17 piezas de modelo, ≈35-40 M; el usuario decide si se hacen todas las piezas; parte `2026-10-27-b3-plan-paso4.md`). **Parada 2 hecha: PR #35 fusionada en `main` por el usuario (2026-10-27)**; antes, PR https://github.com/alvariitoSW/fiebres-neutropenias/pull/35 (parte `autonomo/partes/2026-10-27-b3-parada2.md`; notas mínimas ≥8,75 tras rejuicio) (antes: parada 1, 2026-10-26): el usuario pide una **vuelta de límites** en las cuatro maquetas antes de la app (sueros sin tope, etc.; paquete §4 «Decisiones del usuario (26/10/2026, sobre las maquetas v3)»); neumotórax a tensión aprobado como escena aparte; esquema del pulmón por revisar. PR en borrador https://github.com/alvariitoSW/fiebres-neutropenias/pull/32 · página https://claude.ai/artifact/BLVPCGzFXLYnXKqoLjBGK6. **Vuelta de límites hecha (27/10)**: shock 8,3 · ritmo 8,5 · receptor 8,8 · pulmón 8,6; pieza común `comun/tope.js`; regla §1.14 (parte `autonomo/partes/2026-10-27-b3-limites.md`). **27/10, el usuario: sí a todo** (shock, ritmo y receptor a la app = parada 2, siguiente; deslizador del receptor como está; esquema del pulmón vale; buscar fuente de los errores de temporización del balón). **Pantallas como las reales (respirador y consola del balón): aprobadas por el usuario (27/10), en `main` como maquetas**, respirador 8,7 · balón 8,7; pieza común `comun/respirador.js`; hueco: errores de temporización del balón sin fuente (parte `autonomo/partes/2026-10-27-b3-pantallas.md`) | Paquete: `autonomo/bloques/b3/encargo.md` |
| 8 | `b1-guias` | Llevar «Ver en la ficha» y la explicación guiada (REGLAS §7.9-7.10) a los modelos del bloque 1 | hecha (2026-10-21) · 5 modelos, 314 pasos, en main (el ácido-base, en la bitácora) | Lo pidió el usuario el 20/10 para todos los modelos; mejora de lo existente: a main con jueces y auditor |
| 9 | `mayeutica-pestana` | Guía socrática a un toque en toda la app: interruptor **Texto \| Mayéutica \| Estudiar** (Consejo, 28/10) | hecha (28/10, noche; en `main`, parte `autonomo/partes/2026-10-28-mayeutica-pestana.md`) | ≈0,8 M, cargado al presupuesto de `b3-paso4`. Técnica: a `main` con jueces. Acta `autonomo/consejo/2026-10-28.md` |
| 10 | `b3-pulmon-app` | Bloque 3D: el pulmón con respirador a la app en 4 encargos (ciclo y canales `paw`, `flujo`, `vol` del monitor común; racimo de alvéolos; enganche a la presión intratorácica M8; paciente que respira, maniobras y neumotórax a tensión) y su Mayéutica | pendiente · tras `b3-bradi` · **parada 2 del 3D** | 10-15 M. **30/10, aprobado**: pieza «CPAP que sube el gasto del corazón que falla» (con fuente), del grupo 4. Maqueta aprobada `autonomo/maquetas/b3-pulmon/`; cobertura `autonomo/bloques/b3/cobertura-3d.md`. Absorbe `monitor-comun` (sus canales) · **Ley de Ciencia (29/10, art. 6)**: lámina de entrada con el viaje de escala tórax → alvéolo → capilar (método Techartist, cifras de Marino caps. 22-30 y El Libro Azul IV), sin rehacer la maqueta; se decide en la parada 2 del 3D; ≈2,5-3,5 M · **VentLoop (Consejo, 29/10, 2.ª)**: encargo 1, cambios en la respiración siguiente, semilla fija y Rohrer (R₂·Q²) con PSV; encargo 2, histéresis de apertura y cierre (cierra la nota `peep-lineal`); encargo 4, asincronías (esfuerzo ineficaz, doble disparo, disparo inverso). Segunda fuente: El Libro Azul IV-2 (pdf 26, 47-68, 86-87, 93-94). Cifras de VentLoop, nunca fuente. Horquilla ≈12-18 M **recomendada**, la decide el usuario en la parada 2. Acta `autonomo/consejo/2026-10-29-2.md` |
| 11 | `b3-pulmon-estudio` | Bloque 3D: Estudiar (y Mayéutica) en las 21 fichas del pulmón, 5 grupos en el orden de la ruta de `cobertura-3d.md`, y las 21 recetas de la vista Visual de Neumología | pendiente · tras la parada 2 del 3D | 30-40 M |
| 12 | `b3-cierre` | Bloque 3 entero: ruta del bloque, jueces, auditor y profesor; **paradas 3 y 4** (lo pruebas en el móvil y tus cambios); PR de `auto/b3` | pendiente · tras `b3-pulmon-estudio` · **30/10, aprobado por el usuario**: reconvertir a la vez las preguntas viejas «de redactar» de Merino Cardiología (48) y Neumología (46) (`js/data/merino-*-preguntas.js`), para no tocar esas fichas dos veces; y la nota de fidelidad de la Fig. 18.3 de Marino (VS × FC ≠ IC) | 8-14 M |
| 13 | `b4` | Bloque 4 (caps. 31-38, 23 fichas): cobertura (puede prepararse durante la parada 3 del `b3`, «provisional»), piezas de Mg, Ca y P, Estudiar en 4 grupos, paradas 1, 3 y 4 | pendiente · tras aprobar el `b3` | 45-72 M |
| 14 | `b5` | Bloque 5 (caps. 39-44, 17 fichas): cobertura, maquetas del **hepatocito** y del **termostato** (Educación, 2-3 por modelo), modelos, Estudiar, paradas 1-4 | pendiente · tras aprobar el `b4` | 45-63 M |
| 15 | `b6a` | Bloque 6a (caps. 45-47, 14 fichas): **cráneo vivo** y unión neuromuscular, Estudiar, paradas 1-4 | pendiente · tras aprobar el `b5` | 30-45 M |
| 16 | `b6b` | Bloque 6b (caps. 48-53 y apéndices, 25 fichas): eje hormonal (Motion), hepatocito para tóxicos; las fichas de consulta con Estudiar corto y un caso por grupo | pendiente · tras aprobar el `b6a` | 30-45 M |
| 17 | `educacion-pionera` | **B-040 · Educación pionera**: propuesta de cómo se estudia con modelos vivos y preguntas socráticas (POE, error productivo, autoexplicación, entrelazado, repaso espaciado) con 3 maquetas y la prueba de 3 días con el usuario (Consejo, 28/10) | fase 1 hecha (28/10, `autonomo/ideas/educacion-pionera/`, parte `2026-10-28-educacion-pionera-f1`) · fase 2 hecha (28/10, `diseno-a/b/c.md` y `rubrica.md`, parte `2026-10-28-educacion-pionera-f2`) · fase 3 hecha (29/10, PR #37) · **30/10, el usuario: «de acuerdo en absolutamente todo», aprueba A, B y C y da vía libre a Interior y Transportes para elegir** → elegido: **la mezcla del profesor (C con el error de B como un paso del caso) primero**, y **A después**, cuando use el motor en vivo y su PAM case (≈1 M, tras fusionar el `b3`). Las fichas gemelas de la prueba de 3 días las elige el profesor; la prueba la hace el usuario cuando quiera (el 04/11 ya no es parada de elección). Llevarlo a la app: `educacion-app` | ≈6 M, tope 8 M, del margen de Educación. Acta `autonomo/consejo/2026-10-28-2.md` |
| 18 | `educacion-app` | **B-040, a la app**: el formato elegido (C con el error de B dentro del caso; repaso de días atrás por la fecha del último intento) en las fichas con Mayéutica, empezando por las gemelas de la prueba de 3 días; después A (apuesta-mira-explica) en el shock vivo con el motor en vivo | en curso (30/10: parte 1, el motor, **hecha** en `main`, parte `2026-10-30-educacion-app-motor`; parte 2, río y mar, **hecha** en `main` (caso de Teresa con el error de B, repaso de días atrás, pareja gemela cristaloides/coloides lista para la prueba de 3 días), parte `2026-10-30-educacion-app-rio`; capilar, gemelas y shock tras el `b3`; Consejo 30/10, 5.ª) | Aprobado por el usuario el 30/10. Presupuesto: Hacienda, del margen de Educación (no recorta la calidad de la Mayéutica). Maquetas `autonomo/maquetas/educacion/`, PR #37. Incluye las 2 propuestas de regla del parte f3 (el relato no da la respuesta; capturas en ruta absoluta). **Consejo, 30/10** (idea de DeepTutor, acta `autonomo/consejo/2026-10-30-2.md`): indicador de «ideas firmes» (2 aciertos en días distintos; nunca bloquea), en la misma sesión «motor» que el repaso espaciado, ≈0,8-1,2 M; el usuario dio el sí el 30/10 a guardar los días con acierto (`CLAUDE.md` §2). **Consejo, 30/10 (4.ª)**: espera a que `auto/b3` esté en `main`; orden: motor (sesión sola) → C/B en río y mar, capilar y gemelas → A en el shock → prueba de 3 días; se reabre «motor + río y mar antes» si el `b3` no se fusiona antes del 06/11 y Hacienda ve margen (acta `autonomo/consejo/2026-10-30-4.md`). **Consejo, 30/10 (5.ª)**, a petición del usuario («que el trabajo no esté paralizado»): motor y río y mar hoy desde `main`; lo que toca archivos del `b3` (capilar, `mayeutica.js`, shock) espera (acta `autonomo/consejo/2026-10-30-5.md`) |

## Objetivo E · Mejorar el simulador de eco con lo que hacen otros

| # | Clave | Qué | Estado | Notas |
|---|---|---|---|---|
| 1 | `tee-inversa` | Ingeniería inversa del simulador de ETE de anesthbeta: entender cómo está hecho y traer a nuestro simulador todas las mejoras que se puedan | hecha (cerrada el 30/10 por el usuario, «sí»): paquete C ya hecho en `eco-mega` (parada 2, «Festones y cúspides»); A (colores y rótulos al tocar, viaje entre vistas) y B (ETE con reto, Hahn 2013 ya en `docs/`) entran en `mv-eco` (opción A de la reforma). Informe https://claude.ai/artifact/6N5ChQF3E82Ca7DoNqEfaU | Aprobada por el usuario el 23/10; va antes de seguir con el bloque 3 |
| 2 | `rea-echosuite` | Ingeniería inversa de EchoSuite (70 calculadoras de eco, simulador, aprendizaje): informe-propuesta | en curso, ⏸ parado en la fase 1 (2026-10-23): informe conjunto «Un paciente, todas las pruebas», https://claude.ai/artifact/T4WcxXWzjPGm911ShU3aiS | Aprobada por el usuario el 23/10 (B-009); fase 1 con REA o Playwright |
| 3 | `rea-angioview` | Ingeniería inversa de AngioView (proyecciones de coronariografía): informe-propuesta | en curso, ⏸ parado en la fase 1 (2026-10-23): informe conjunto «Un paciente, todas las pruebas», https://claude.ai/artifact/T4WcxXWzjPGm911ShU3aiS | Aprobada el 23/10 (B-010) |
| 4 | `rea-navrad` | Ingeniería inversa de NavRad Anatomy (visores de TC rotulados): informe-propuesta | en curso, ⏸ parado en la fase 1 (2026-10-23): informe conjunto «Un paciente, todas las pruebas», https://claude.ai/artifact/T4WcxXWzjPGm911ShU3aiS | Aprobada el 23/10 (B-011) |
| 5 | `rea-radiologyassistant` | Ingeniería inversa de The Radiology Assistant: informe-propuesta para la app y el PIF de Radiología | en curso, ⏸ parado en la fase 1 (2026-10-23): informe «Ritmo vivo y placa guiada», https://claude.ai/artifact/1GTkuwubZ22Hb9qu4PW4P5 | Aprobada por el usuario el 23/10 al pedir el informe |
| 6 | `rea-ritmolab` | Ingeniería inversa de RitmoLab (Farmacotips), ya accesible: informe-propuesta para el PIF de Cardiología, los modelos vivos (corazón eléctrico, motor) y la puerta «Arritmias» | en curso, ⏸ parado en la fase 1 (2026-10-23): informe «Ritmo vivo y placa guiada», https://claude.ai/artifact/1GTkuwubZ22Hb9qu4PW4P5 | Aprobada el 23/10; antecedentes en `docs/historial/cardiologia.md` («RitmoLab») |
| 7 | `rea-final` | Informe final de la ingeniería inversa (6 webs) + segunda pasada de NavRad con imagen | ⏸ parado (2026-10-23): esperando la elección del usuario. Final: https://claude.ai/artifact/3hnNvcEsvsotfViShnXLee · NavRad: https://claude.ai/artifact/2v4kHFM66eac8d5bYWZgtm | Pedido por el usuario el 23/10; sustituye a los informes parciales como documento de decisión |
| 8 | `rea-2` | Segunda pasada de ingeniería inversa de las 6 webs con `/ingenieria-reversa` v2, para el megaproyecto: uso real en la guardia de UCI y estudio | ⏸ parado en la fase 1 (2026-10-25): informe «La UCI en el bolsillo», https://claude.ai/artifact/6XfQibZ3H4NwgjUFMJhTdU | Pedido por el usuario el 25/10; 3 investigadores (eco, cardio, radiología) con el modelo barato |
| 9 | `radar` | B-012 · Radar: norte, registro, ficha de triaje y skill `/radar`; volcar lo del 23-25/10 | hecha (2026-10-26) · PR #28 aprobada por el usuario, en main | Va en la etapa A del plan de integración |
| 10 | `vuelta-modelos` | B-016 · Vuelta por los 14 modelos vivos: qué mecánica nueva encaja en cada uno | hecha (2026-10-25): PR #29; el usuario aprobó las 5 mejoras («me parece todo perfecto»), que pasan al Objetivo V |  Corta, de solo lectura; antes que B-015 |
| 11 | `eco-mega` | B-015 · Megaproyecto de la eco: modelo, imagen realista y lo mejor de las webs | hecha (2026-10-27): **parada 3 en `main`** con permiso del usuario, PR #34 (https://github.com/alvariitoSW/fiebres-neutropenias/pull/34; profesor 8,5-8,7, auditor 0 graves). Siguiente (en la bitácora, sin aprobar): B-027 (motor diastólico), B-029 (HP crónica a fondo deforma el corazón) y parada 4 con los PDF de HP, amiloidosis y MAPSE. **Paradas 1 y 2 hechas y en `main`** (imagen realista; anatomía, fisiología y patología: profesor 8,1-8,4, auditor 0 graves; PR #30). Siguiente: parada 3 (F3, F4, N1, P5, P6 y retoques de coste medio; ver parte del 27/10) cuando lleguen los PDF de los huecos | Empieza por una maqueta «antes / después» de la imagen |
| 12 | `inventario` | B-014 · Inventario de estudio de las ~724 fichas | hecha (2026-10-26) · PR #31, en main · informe https://claude.ai/artifact/894zY7AfqYQC3QWP1Yjxir | Corta, de solo lectura |
| 13 | `pulmon-respirador` | B-013 · Pulmón con respirador (modelo vivo) | fusionada en `b3` (2026-10-26, decisión del usuario: sub-bloque 3D) | Antes: bloque 4 de Marino. Propuesta de atajo (26/10, en el informe del `b3`): cobertura y maqueta M3 durante la parada 2 del `b3`; la presión del tórax (M8) hecha una vez para CPAP y respirador; el pulmón entra en la app a la vez que el 3C. Espera la elección del usuario |
| 14 | `bandeja` | B-017 · Bandeja del Radar: enlaces desde el móvil (issue #27) procesados a diario | necesita humano (2026-10-25): la tarea creada desde la sesión no tenía el repositorio; pausada. El usuario la crea desde la app con el proyecto elegido | Texto para pegar en `autonomo/radar/LEEME.md`; después, borrar `trig_01SJ6yy2dka8BFevHR5aCNnF` |
| 15 | `notas-meta` | B-023 · Llegar al 8,75 sin gastar de más: modelos, tokens y vueltas | hecha (2026-10-27): el usuario aprobó las 9 propuestas (R1-R9), que entran en `REGLAS.md` §4.8, el constructor, el profesor, la skill y el formato del parte; R1 automático va en `jueces-movil`. Informe https://claude.ai/artifact/2DyGXcvYEMTXfT85YZESDs · PR #33 | Corta, de solo lectura |
| 16 | `rea-eco` | B-024 · Ingeniería inversa de las webs de eco para un corazón más real (forma, paredes, valvas, latido) y referencias de eco reales de uso libre | hecha (2026-10-26): informe «Un corazón más real» v2 (plan de 13 encargos, ~24 M, `autonomo/ideas/ingenieria-inversa/corazon-mas-real-plan.md`), https://claude.ai/artifact/LPr9m96QTCK7D53wJ4vkcg; el usuario eligió y los PDF de la ASE ya están en `docs/`. Lo elegido pasa a la parada 2 de `eco-mega` | Va antes de la parada 2 de `eco-mega` (anatomía) |
| 17 | `eco-anatomia` | B-025 · Corazón real (anatomía, fisiología y patología): informe de ingeniería inversa con Fable 5.1 sobre las webs de eco ya estudiadas + plan socialista con su gasto estimado y optimizado | hecha (2026-10-26): informe https://claude.ai/artifact/TooB2RJcrwkf9CoFiPyqBi; el usuario eligió el núcleo, que entra en la parada 2 de `eco-mega` | Pedido por el usuario el 26/10; amplía `rea-eco` (no lo repite) y alimenta la parada 2 de `eco-mega` |
| 18 | `rea-culprit` | B-026 · Ingeniería inversa de Coronary Culprit (Cliff Reid): ocluir una coronaria y ver el ECG de 12 y la eco | hecha la fase 1 (2026-10-26): el usuario eligió la opción 1 (A + B en la Fase 1 tras Marino; C cuando la eco tenga coronarias; D tras C); falta el PDF de la ESC 2023 de SCA y el de ECG. Informe «Arteria culpable», https://claude.ai/artifact/Y6ewAZfAk5cPewnsnNcsAw; detalle en `autonomo/ideas/ingenieria-inversa/culprit.md` | Pedido por el usuario el 26/10; lo que se construya va después de Marino (Objetivo M5) |
| 19 | `jueces-topes` | Jueces automáticos de topes (REGLAS §1.14): que `node autonomo/jueces.mjs --modelo <clave>` lleve cada mando de un modelo vivo a su tope y repita cada acción (copiando `autonomo/bloques/b3/herramientas/limites-prueba.mjs`), y falle si no sale el sello o sale una cifra fuera de lo fisiológico | hecha (2026-10-27): juez `autonomo/jueces-topes.mjs` directo a `main`; el ❌ que da en lo ya construido (ácido-base, pH 6,36), en el parte `2026-10-27-jueces-topes.md` (propuesta `topes-acidobase`) | Tipo `arreglo` (técnico, directo a `main` con los jueces en verde). Constructor sonnet. Antes, en los modelos vivos que ya están en la app |
| 20 | `jueces-movil` | Juez automático del móvil (REGLAS §4.8 R1): que `node autonomo/jueces.mjs --ficha/--modelo` falle a 390 y 360 px si la frase viva o el enunciado quedan bajo la barra de abajo, si la imagen sale de la pantalla al tocar sus mandos, si una frase sale cortada con «…» o si un rótulo baja de 9 px | hecha (2026-10-27): juez `autonomo/jueces-movil.mjs` directo a `main`; los ❌ que da en lo ya construido, en el parte `2026-10-27-jueces-movil.md` (propuesta `movil-existente`) | Tipo `arreglo` (técnico, directo a `main` con los jueces en verde). Constructor sonnet. Puede ir junto a `jueces-topes` |
| 21 | `movil-existente` | Arreglar en lo ya construido lo que caza el juez del móvil (`jueces-movil`): «Siguiente» tapado en el capilar, frase viva bajo el dock o fuera de pantalla al tocar mandos (río y mar, ácido-base, capilar), frases cortadas con «…» (catéter, muralla, telar, inmersión, vaso, capilar, río y mar) y pies de figura cortados en Estudiar (fichas de Marino · Fundamentos), y rótulos de menos de 8 px | hecha (2026-10-27): directo a `main`, juez del móvil en verde a 390 y 360 px en los 8 modelos vivos y Marino · Fundamentos; parte `2026-10-27-movil-existente.md` | Tipo `arreglo` (directo a `main` con los jueces en verde). Constructor sonnet, un encargo por modelo (o por grupo de fichas); antes, `jueces.mjs --modelo <clave>` para la lista exacta. Lista de hallazgos en `autonomo/partes/2026-10-27-jueces-movil.md`. Sube versión (`autonomo/version.mjs`) |
| 22 | `fuentes-b3` | Buscar y citar lo que la ficha no dice en las maquetas del `b3` (REGLAS §1.15, pedido por el usuario el 27/10): errores de temporización del balón (inflado/desinflado precoz y tardío, con figura), mecanismos y distractores rotulados «fisiología general» o «el libro no lo dice» (G5, G6, «Detener ventilación»), topes sin fuente (VMe 2-20, PEEP total ≤20, FR alta, Pmáx, Ti mínimo) | **hecha en `auto/b3` (27/10, parte `2026-10-27-fuentes-b3.md`)**; ficha propia de Gillespie: el usuario da permiso (27/10) para crearla sin preguntar si el director la ve necesaria; entra en `main` con la PR del bloque b3 (aún sin abrir). Queda pendiente del usuario: PDF de ESC 2019 TSV, AHA 2020/ERC 2021 SVA, ESC 2023 miocardiopatías y SCAI 2015 para R2, R4b, C3 y S12. Antes: pendiente (pedida por el usuario el 27/10); **27/10: bibliografía del balón buscada y elegida por el usuario** (4 artículos verificados con Crossref, `autonomo/bloques/b3/fuentes-iabp/`); PDF de la principal en `docs/gillespie-2024-balon-contrapulsacion-jscai.pdf` (Fig. 7 p. 6, «Timing errors» p. 8). Siguiente: construir los 4 errores en la consola y la lista del auditor de lo que queda sin cita | Tipo `auditoria` + arreglo. Primero un auditor (sonnet) hace la lista de todo lo rotulado sin cita en las cuatro maquetas; después se busca (PDF a `docs/` o URL literal; `/claim-check` y `/citation-verification` cuando PubMed esté permitido en la red del entorno: hoy `eutils.ncbi.nlm.nih.gov` está bloqueado) y un constructor sonnet cita. Con fuente para el balón, se construyen los errores de temporización en la consola |
| 23 | `propuestas-movil` | Las 3 propuestas del parte `2026-10-27-movil-existente.md`: (1) pieza común `verFrase()` en `js/core/` que lleva la frase viva a la vista tras tocar un mando, usada por todos los modelos vivos (hoy hay tres soluciones: margen, frase pegada, scroll); (2) en la lista del constructor (`.claude/agents/constructor.md`) y REGLAS §4.8 R1: «suelo de letra SVG ≈ 9,3 en coordenadas del dibujo (8 px / escala a 360 px)»; (3) en la skill `plan-socialista`: el director no fusiona `main` en un comando en segundo plano, lo hace a la vista y mira conflictos antes de seguir | hecha (27/10, directo a `main`; parte `2026-10-27-propuestas-movil.md`) | Tipo `arreglo` (directo a `main` con los jueces en verde). (2) y (3) son reglas aprobadas: las escribe la sesión, citando la aprobación en `docs/historial/trabajo-autonomo.md`. (1): constructor sonnet; `jueces.mjs --modelo` de los 8 modelos vivos en verde (móvil incluido); sube versión |
| 24 | `reglas-27-10` | Escribir las 8 reglas aprobadas el 27/10 (ver su encargo) en `REGLAS.md`, `.claude/agents/constructor.md` y la skill `plan-socialista`, citando la aprobación en `docs/historial/trabajo-autonomo.md` | hecha (2026-10-27): directo a `main`; reglas en `REGLAS.md` §1.11, §1.14, §4.6, §4.7 y §5.6, lista del constructor y skill (límite diario en §0); parte `2026-10-27-reglas-27-10.md` | Tipo `arreglo` (solo reglas, directo a `main`). Lo hace la propia sesión, sin agentes. Antes que la parada 2 del `b3`, para que ya la use |
| 25 | `topes-acidobase` | Ácido-base vivo: con la albúmina y la osmolalidad a sus extremos, la PaCO₂ a 90 da pH 6,36 (desde el inicio, 7,05). Buscar qué combinación lo produce y arreglarlo en su origen, no recortándolo | hecha (2026-10-27): no era la albúmina sino «Bicarbonato IV» + PaCO₂ 90; el modelo ya lo rechazaba, pero el aviso escribía el pH imposible. Aviso reescrito, directo a `main`; parte `2026-10-27-topes-acidobase.md` | Tipo `arreglo` (directo a `main` con `jueces-topes` y `--modelo acidobase-vivo` en verde). Constructor sonnet, ~25 pasos / 0,5 M. Hallazgo en `autonomo/partes/2026-10-27-jueces-topes.md` |
| 26 | `reglas-b3p2` | Escribir las 4 reglas aprobadas el 27/10 tras la parada 2 del `b3` (ver su encargo) en `REGLAS.md`, `.claude/agents/constructor.md` y la skill `plan-socialista`, citando la aprobación en `docs/historial/trabajo-autonomo.md` | hecha (2026-10-27): REGLAS §4.7 y §5.1, constructor y skill `plan-socialista`, directo a `main` (parte `autonomo/partes/2026-10-27-reglas-b3p2.md`) | Tipo `arreglo` (reglas, no toca la app). Directo a `main` |
| 27 | `encargo-revisado` | B-031 · Dos ideas de Spec Kit: (1) revisar el encargo antes de construir (solo lectura, barato) en `/plan-socialista`; (2) lista de calidad del encargo y tope de 5 preguntas al usuario en `/bitacora` | hecha (2026-10-27): `REGLAS.md` §4.9, skills `plan-socialista` (§0 paso 8) y `bitacora` (Apuntar y Aprobar), directo a `main`; parte `autonomo/partes/2026-10-27-encargo-revisado.md` | Tipo `arreglo` (reglas y skills, no toca la app). Directo a `main`. Editar `.claude/` necesita el permiso del usuario en la sesión (REGLAS §5.1) |

**Encargo `encargo-revisado`** · tipo: arreglo (reglas y skills, no toca la app) · aprobado por el usuario el 27/10/2026 (B-031)
- Qué quiero: traer dos ideas de Spec Kit (https://github.com/github/spec-kit, MIT), reescritas a nuestra manera, **sin
  instalarlo** (ni `uv`, ni `.specify/`, ni sus comandos) y sin copiar su texto.
- (1) **Revisar el encargo antes de construir** (idea de su paso «analyze»): al empezar cada tarea de
  `/plan-socialista`, un paso de solo lectura con el modelo barato (~10 pasos) que cruza el encargo, el plan del
  director y la lista de piezas, y busca huecos, contradicciones y **lo que ningún juez va a medir** (lección del E/A
  de la eco, B-027: ningún encargo pedía un E/A de paciente posible por forma). Lo grave para la tarea y se pregunta
  al usuario; lo menor se anota en el plan.
- (2) **Lista de calidad del encargo** (idea de su «checklist», que prueba el texto del encargo, no el resultado) en
  `/bitacora`, al apuntar y al aprobar: ¿cada mando tiene tope con fuente?, ¿se dice qué cifra debe salir en cada forma
  o caso?, ¿está «lo que NO quiero»?, ¿la fuente tiene página?, ¿qué juez comprobará cada cosa? Y, de su «clarify»,
  **como mucho 5 preguntas** al usuario por encargo, las más importantes primero.
- Dónde: `autonomo/REGLAS.md`, `.claude/skills/bitacora/SKILL.md`, `.claude/skills/plan-socialista/SKILL.md`; la
  aprobación, en `docs/historial/trabajo-autonomo.md`.
- Lo que NO quiero: instalar Spec Kit; un paso caro (la revisión, barata y corta).
- Tamaño: pequeña, una sesión barata.

**Encargo `reglas-27-10`** · tipo: arreglo (reglas, no toca la app) · aprobado por el usuario el 27/10/2026
- Ahorro (de `/ahorro`, en la bitácora): (1) el constructor pasa sus pruebas y las de lo que tocó; la suite entera la
  pasa el director una vez al fusionar, y nunca más de 2 agentes con pruebas largas a la vez; (2) cada constructor
  trabaja en su propio `git worktree` que sale de la rama del bloque; (3) un encargo que nombra más de una estructura
  anatómica o más de un fenómeno del motor se parte en encargos de ≤60 pasos antes de lanzarlo.
- Reglas de los partes: (4) toda frase de mecanismo en un «Piensa» lleva su origen, también explicaciones y
  distractores (lista del constructor); (5) los arneses cierran su servidor por número de proceso, nunca
  `pgrep -f … | xargs kill` (REGLAS §4.6); (6) un constructor no tapa una cifra mala del motor con un ajuste del dibujo:
  para e informa; (7) un modelo vivo nuevo con sello propio añade su ajuste a `jueces-topes.mjs`, no un arnés suelto;
  (8) citas que cruzan archivos de otra sesión: una rama `wt/…` por modelo que fusiona la sesión dueña (REGLAS §4.6).
- Y el límite de gasto por día de arriba (18 % del uso semanal) en la skill `plan-socialista`.

**Encargo `reglas-b3p2`** · tipo: arreglo (reglas, no toca la app) · aprobado por el usuario el 27/10/2026 (parte `autonomo/partes/2026-10-27-b3-parada2.md`)
- (1) **`.claude/`**: la prohibición de tocarla queda para `CLAUDE.md`, `autonomo/REGLAS.md`, `.claude/agents/` y las
  skills del proyecto. Lo que reescribe una herramienta instalada (graft en `.claude/settings.json` y su skill) lo sube
  el director en un commit aparte, tras comprobar con `git diff` que no se pierde ninguna orden del proyecto (y volver a
  ponerla si se perdió); el entorno bloquea al agente su propia configuración, así que hace falta el permiso del
  usuario en la sesión. En la skill `plan-socialista` §3 y en REGLAS §5.1.
- (2) **Una parada con varios modelos vivos va en una sesión por modelo** (el director de la parada 2 del `b3` gastó
  5,1 M frente a 0,8 M por fusionar 12 ramas en una conversación). En la skill (Ahorro medido, punto 1) y REGLAS §4.7.
- (3) **Botones estables**: un modelo vivo repinta sus botones en el sitio (cambia el texto o la marca), no los rehace
  en cada cuadro; si no, los jueces dan «mando no tocable». A la lista del constructor.
- (4) **Llevar una maqueta aprobada a la app son dos encargos**: el modelo (con su prueba) y su Mayéutica. En la skill
  (Modo bloque, paso 3) con los presupuestos del tablero del 27/10 (`b3` parada 2).

**Encargo `notas-meta`** · tipo: auditoria (solo lectura, no toca la app)
- Qué quiero: medir en las tareas ya hechas qué nota sacó cada vuelta, con qué modelo y cuántos tokens costó
  (`autonomo/gasto.mjs`, partes, informes del profesor), y proponer reglas para llegar a 8,75 a la primera.
- Para qué: menos vueltas y menos gasto con el listón alto (se aprueba con 8 sobre 10; la meta es 8,75).
- Ideas de partida (supongo): la rúbrica escrita en el encargo antes de construir; el constructor se autopuntúa con
  capturas antes de entregar; vueltas con el mismo constructor (SendMessage, sin empezar de cero); potente solo en la
  primera vuelta de algo nuevo y en el juicio; qué tipos de tarea necesitan la meta y cuáles basta con el 8.
- Salida: una página para el móvil con la tabla vuelta → nota → modelo → tokens y las propuestas de regla, para que
  el usuario elija.
- Lo que NO quiero: cambiar reglas sin su visto bueno.
- Fuente: `autonomo/partes/`, `autonomo/gasto.mjs`, los informes `profesor.md` de cada tarea.

**Encargo `eco-anatomia`** · tipo: mapa + ingeniería inversa (`/ingenieria-reversa`), sin tocar la app
- Lo que dijo el usuario (26/10): «la anatomía del corazón no es real… informe con Fable 5.1… /ingenieria-reversa de
  las páginas que tenemos ya para mejorar nuestra ecocardio sobre todo en la anatomía… mejorar mucho más la parte de
  realismo anato-fisiológico-patológico… un /plan-socialista para llevarlo a cabo y ver el gasto… optimizarlo».
- Qué quiero: un informe-propuesta (página para el móvil) de cómo hacer que el corazón del simulador sea anatómica,
  fisiológica y patológicamente real: forma 3D de cada cavidad, paredes y grosores, valvas por segmentos, cuerdas y
  papilares, trabéculas, anillos, grandes vasos y lo que rodea (pericardio, pulmón, aorta descendente, esófago);
  cómo late cada parte (torsión, descenso del anillo, engrosamiento) desde el motor; y cómo cambia con cada
  enfermedad que ya tiene el simulador (dilatada, hipertrófica, derrame, hipovolemia, VD en TEP…).
- Cómo: con el modelo Fable 5.1; partiendo de lo ya estudiado (`autonomo/ideas/ingenieria-inversa/echodemo-anatomia.md`,
  `echosuite-anesthbeta-anatomia.md`, `ecos-reales-libres.md`, `tee`, informe «Un corazón más real»), sin repetirlo:
  profundizar y comparar con nuestro `js/modules/eco/` (`corazon-geo.mjs`, `motor.mjs`, `formas.mjs`, `escenarios.mjs`).
- Salida: el informe con mejoras ordenadas (qué aporta para estudiar, esfuerzo, riesgo) **y un plan socialista**
  troceado en tareas de una pieza con el **gasto estimado** de cada una (con las cifras medidas de `autonomo/gasto.mjs`
  en tareas parecidas) y una versión optimizada (qué va en modelo barato, qué en potente, qué se puede saltar).
- Lo que NO quiero: copiar código, textos o mallas con licencia restrictiva; imágenes de CAMUS ni EchoNet; tocar la app.
- Después: el usuario elige; lo elegido se trabaja como paradas de `eco-mega`.

**Parada 2 de `eco-mega`** · decidida por el usuario el 26/10/2026 sobre la versión 2 del informe «Un corazón más
real» (https://claude.ai/artifact/LPr9m96QTCK7D53wJ4vkcg) · en la misma rama `auto/eco-mega` (PR #30)
- **Entra ya (sin PDF)**:
  - A1: cuerdas que brillan y sin manchas sueltas;
  - A2: tabla de brillo por tejido;
  - A3: sombra del calcio, solo la sombra y sin escenario si no hay ficha de estenosis aórtica;
  - B4: papilares que se acortan y VD que engruesa;
  - B5: cortina aorto-mitral (anatomía nueva, aprobada);
  - D1: eco real de uso libre al lado del nuestro, con autor y licencia; las de Yale y Lynch, una a una (si son
    dibujos, no entran).
  
  Todo en modelo barato, salvo lo que el informe marca como potente.
- **Con los PDF, ya en `docs/`** (Lang 2015, Hahn 2013, Mor-Avi 2011 y Mitchell 2019, subidos el 26/10): B1, B2
  (**en potente desde la primera vuelta**, decisión del usuario el 26/10), B3 y C1 entran en la misma parada. **C2
  (pared por regiones e infarto) espera a que las coronarias entren en el motor** (decisión del usuario el 26/10).
- **Malla de Visible Human**: nunca como corazón de la app; sí como **referencia de forma** al corregir el VI (B2).
- Ya no hace falta abrir Wikimedia: la versión 2 comprobó las licencias en Commons.
- **Ampliación del 26/10 (B-025, informe https://claude.ai/artifact/TooB2RJcrwkf9CoFiPyqBi,
  `autonomo/ideas/ingenieria-inversa/eco-fisiopatologia.md`)**, decidida por el usuario:
  1. El **núcleo nuevo entra en la parada 2**: F1 (paciente posible del latido), F5 (VD que late como VD), N2 (VD en
     U con banda moderadora), N3 (aorta descendente, pleura-pulmón y columna), P1 (taponamiento), P2 (beso de
     papilares), P4 (TEP con criterios de Lang). El resto (F3, F4, N1, P5, P6) va a la parada 3; P3 espera a C2a.
  2. **Orden**: el del informe (0 lector → A1 → B1 + F1 → A2 → B2 + N2 → A3 → N3 → B3 → B4 → F5 → B5 → P2 → C1 → P1
     → D1 → P4), con F1 primero como red de pruebas y después P2 y P1.
  3. **P1 en potente**, y además **revisar bien el pericardio, sobre todo alrededor de las aurículas, y hacerlo más
     realista** (palabras del usuario).
  4. **P7**: la hipertrofia y la dilatada por defecto **se dejan como «forma grave» con una nota visible** (no se
     recalibran las gravedades).
  5. PDF para los huecos: el usuario los busca (lista en el parte); hasta que lleguen, esas cifras quedan «hueco».

**Encargo `rea-eco`** · tipo: mapa + ingeniería inversa (`/ingenieria-reversa`), sin tocar la app
- Qué quiero: estudiar cómo hacen el corazón y la imagen *The Heart by Ultrasound* (echodemo, la primera), EchoSuite
  y el simulador de ETE de anesthbeta, y proponer qué traer a nuestro modelo para que el corazón que se ve sea más
  real y salga de la fisiología del motor.
- Foco: forma y grosor de paredes, valvas y su movimiento, trabéculas, cómo late cada parte; cómo se ve en cada vista.
- Imágenes de eco reales: solo de uso libre y citadas, como referencia «real / nuestra» en cada vista (nunca CAMUS ni
  EchoNet).
- Salida: informe-propuesta para el móvil (qué traer, en qué orden, qué imágenes reales se pueden usar); el usuario
  elige y eso alimenta la parada 2 de `eco-mega`.
- Lo que NO quiero: copiar código, textos ni imágenes con licencia restrictiva.
- Fuente: las tres webs y `autonomo/ideas/ingenieria-inversa/` (lo ya estudiado, para no repetir).

### Encargo · `tee-inversa`

- **Lo que dijo el usuario (23/10)**: «quiero hacer otra cosa con /reverse-engineer-anything de la siguiente página web
  https://tee-simulator.anesthbeta.com/atlas?lang=ja para poder entender cómo se ha hecho y poder añadir todas las
  mejoras que poder aplicar a nuestro simulador y mejorarlo».
- **Tipo**: `auditoria` (fase 1, informe) + `visual` (fase 2, construir lo que elija).
- **Fase 1 · entender** (skill `reverse-engineer-anything`, con su servidor REA si está conectado; si no, Playwright):
  qué enseña (vistas de ETE, el atlas por vistas, la sonda y sus movimientos —avance, rotación, flexión, ángulo
  multiplano 0-180°—, cortes, estructuras rotuladas, Doppler, casos), cómo lo hace (tecnología, modelo 3D del corazón y
  de dónde sale, cómo genera la imagen de eco a partir del modelo, cómo mapea la sonda al plano de corte, rendimiento en
  el móvil, idiomas) y qué datos usa. Comparar, punto por punto, con nuestro simulador (`js/modules/eco/`, README y
  atlas) y con el informe de ATRIA-EchoTrace (tarea #94, ver `docs/historial/eco.md`).
- **Salida de la fase 1**: un informe-propuesta (página para el móvil) con la lista de mejoras, cada una con lo que
  aporta para estudiar, su esfuerzo y su orden recomendado (p. ej. vistas transesofágicas sobre nuestro corazón, sonda
  con sus mandos, rótulos de estructuras al tocar, atlas por vistas…). **Parada del usuario**: elige qué se hace.
- **Fase 2 · construir** lo elegido, sobre nuestros motores (corazón, ecógrafo, Doppler), con sus pruebas
  (`node --test 'js/modules/eco/pruebas/*.test.mjs'`, `jueces.mjs --eco`).
- **Lo que NO quiero** (CLAUDE §7.9): copiar su código ni sus imágenes o modelos si su licencia no lo permite. Ideas y
  método sí; el código se reconstruye sobre los motores de la app. Nada de mezclar sus textos con nuestras fuentes.
- **Depende de**: acceso de red al dominio (hoy 403). El servidor REA no conectó en esta sesión (reintentar al abrir).
- **Fase 1 hecha (23/10)**: la web ya se lee desde el entorno. Informe con 7 mejoras y 3 paquetes (A: colores de
  estructura, rótulos con enlace al 3D y viaje entre vistas, en la ETT; B: ETE medioesofágico y transgástrico; C:
  segmentos de válvula). Parte: `autonomo/partes/2026-10-23-tee-inversa.md`.


### Encargo · `rea-echosuite`, `rea-angioview`, `rea-navrad`

- **Lo que dijo el usuario (23/10)**: «quiero otro informe de ingeniería reversa como has hecho antes y a ver cómo con
  las siguientes páginas podemos potenciar, optimizar y llevar a un nivel muy muy muy superior, casi una producción de
  una multinacional médica, en nuestro repositorio, quiero que me sorprendas».
- **Tipo**: `auditoria` (fase 1, un solo informe-propuesta de las tres webs) + lo que elija (fase 2). Herramienta: REA
  (`morluto/rea`, MIT) o Playwright. Comparar cada web con lo nuestro: EchoSuite con nuestras calculadoras de eco
  (FATE, TAPSE, ITV, E/A, VExUS) y el simulador; AngioView con las coronarias del corazón 3D y las fichas de SCA;
  NavRad con cómo enseñamos imagen (y la Rx de tórax y la neurorradiología del PIF, pendientes). Ideas y método sí;
  código, textos e imágenes no (CLAUDE §7.9); mallas o imágenes con licencia abierta, solo con cita y decisión del
  usuario; cifras clínicas solo con su fuente en PDF. Salida: informe para el móvil y parada del usuario.
- **Fase 1 hecha (23/10)**: un informe conjunto de las cuatro webs (con `tee-inversa`) que propone «el paciente
  vivo» en 4 fases (0 acabado de producto, 1 coronarias y IAM en el motor, 2 coronariografía y ETE, 3 calculadoras de
  eco de UCI, 4 visor de TC). Informes de cada web en `autonomo/ideas/ingenieria-inversa/`. Parte:
  `autonomo/partes/2026-10-23-rea.md`.


### B-017 (aprobada e instalada el 25/10, opción A: GitHub, 0 €) · Mandar enlaces desde Telegram a la app (tuits y papers) · apuntado 2026-10-25
- **Lo que dijiste**: «poder mandar por Telegram o algún lado los links de tuiter que veo… o links que llevan a papers de
  medicina… y que la app lo suba ya con el proceso de integración de información médica que hacemos en el apartado de
  UCI papers tuiter».
- **Cómo lo entiendo**: tipo `arreglo` técnico sobre lo que **ya existe**: el panel de subida (`backend/worker`, un
  Cloudflare Worker) y la integración automática (`.github/workflows/integrate-content.yml`, un agente de Claude que
  construye el contenido con nuestras reglas y abre una **PR en borrador**; nunca fusiona solo).
  1. **Bot de Telegram** propio: le reenvías el enlace del tuit, del paper o una captura. Solo responde a tu cuenta
     (lista con tu identificador de Telegram y un secreto en el enlace del bot).
  2. Una ruta nueva del mismo Worker recibe el mensaje y lanza la integración con destino **UCI / Papers Tuiter** y
     el enlace como fuente; te contesta «recibido» y, al acabar, el enlace de la PR para revisarla en el móvil.
  3. **Tuits**: x.com no deja leerlos sin cuenta desde aquí. El agente saca el texto del tuit por su vía pública de
     incrustar (oEmbed, **por comprobar**) o de la captura que mandes, encuentra el **paper original** (DOI/PubMed,
     con las skills `paper-lookup` y `claim-check`) e integra **el paper**, no el tuit: un tuit no es fuente.
  4. Lo que no sea un paper (una web, una herramienta, una idea) entra en el **Radar** (B-012) en vez de en UCI Papers.
- **Lo que NO quiero** **(supongo)**: que nada entre en la app sin tu visto bueno (siempre PR en borrador); datos de
  pacientes por el bot; que cualquiera pueda usar el bot.
- **Depende de**: encender el panel de subida, que sigue pendiente (clave de la API de Anthropic y desplegar el Worker,
  ver «Esperando algo tuyo»). Coste: cada integración gasta de tu clave de la API (tope de 8 USD por integración,
  ajustable); Telegram, Cloudflare y GitHub Actions, gratis para este uso.
- **Tamaño**: pequeña-mediana (el bot y la ruta del Worker; la integración ya existe).
- **Dudas**: ¿Telegram te vale (o prefieres WhatsApp, que es más difícil y de pago, o el correo)? ¿Quieres que te avise
  al acabar cada integración con el enlace de la PR?


### Encargos aprobados el 25/10/2026 («estoy de acuerdo con todo»), copiados de la bitácora

### B-012 · Radar: integrar webs, repositorios, Twitter e ideas con un plan sólido · apuntado 2026-10-23
- **Lo que dijiste**: «integrar estas y futuras páginas/repositorios/lo que vea en tuiter/lo que se me ocurra y de ahí
  desarrollar el proyecto bien con un plan sólido y sobre todo teniendo en cuenta lo que realmente se quiere conseguir».
- **Cómo lo entiendo**: un **proyecto permanente** (no una tarea que se acaba) con dos partes: un **norte** que no
  cambia y un **radar** por el que entra todo lo nuevo. Nada se construye porque «está chulo»: solo si acerca al norte.
  1. **El norte** (borrador, **(supongo)**; lo decides tú): «Que un R1 de UCI entienda y maneje al paciente crítico:
     en la cama, la respuesta en 30 segundos desde el móvil; para estudiar, el mecanismo que se ve y preguntas que
     obligan a pensar; todo fiel a su fuente con página, en español, sin cuenta ni servidor». De él salen las
     **situaciones de guardia** del informe final (shock, dolor torácico, arritmia inestable, comprobar un
     dispositivo, neurocrítico, quirófano cardíaco), que son la vara de medir.
  2. **Una sola puerta de entrada**: me pasas una web, un repositorio, un tuit o una idea, y queda apuntado en un
     registro (`autonomo/radar/`) con la fecha, lo que dijiste y el tipo. **(supongo)** una skill `/radar` que lo
     haga, o que `/bitacora apunta` lo mande allí.
  3. **Triaje con una ficha fija** para cada entrada: qué es; a qué situación de guardia, ficha o modelo vivo sirve;
     qué fuente lo respalda; licencia; coste; si encaja en una fase ya existente. Veredicto: **integrar en la fase N**,
     **idea suelta** (se guarda) o **descartar** (con motivo).
  4. **Cómo se estudia cada tipo**:
     - una web o una app → `/ingenieria-reversa` (como hoy);
     - un repositorio → leerlo, comprobar la licencia y, si es una herramienta, revisarla antes de instalarla (como
       las skills de hoy);
     - un tuit → no es fuente: se extrae la idea y se busca la fuente primaria con `claim-check` o `paper-lookup`;
     - una idea tuya → se convierte en ficha de encargo, con las preguntas mínimas.
  5. **Una hoja de ruta viva**: la del informe final «Del simulador a la cama» (fases 0-4) pasa a ser el documento
     único. Cada entrada nueva se encaja en una fase (o abre una), sin duplicar. Una página para el móvil que se
     republica en el mismo enlace.
  6. **Pocas paradas**: las decisiones se te llevan **por tandas** (p. ej. cada semana o cada 5 entradas), no una a
     una, como pediste para los bloques (REGLAS §2.3).
  7. **Medir si sirve**: cada fase se cierra con su situación de guardia «resuelta» (lo que se consulta en la cama y
     lo que se estudia, comprobado en el móvil) y con tu uso real en la rotación que toque.
- **Afinado el 23/10** (el usuario: «mejorarlo y abrir la puerta a seguir mejorándolo conforme avanza la IA y la
  tecnología»; «la IA de Nvidia para leer TC body… unirlas para crear… un agente de IA que ayude al médico radiólogo»;
  «poder pasar la información de ecocardio en tiempo real y realizar el máximo de cálculos posibles… y hacer
  literalmente magia»). El norte pasa a tener **tres niveles**, cada uno con su puerta:
  1. **Estudiar** (lo de hoy): modelos vivos, fichas, Mayéutica. Lo ya estudiado de las webs (eco, arritmias, ETE,
     coronarias, TC) ahorra diseño: se rehace sobre nuestros motores.
  2. **Ayudar en la guardia, en el móvil y sin datos del paciente**: metes las medidas de la eco que haces y la app
     calcula todo lo que se puede (VS, GC, E/e′, PAPS, TAPSE/PAPS, VExUS…), con su grado, su fórmula y la coherencia
     entre medidas, y **el motor se ajusta a esas medidas** para mostrar «tu paciente» latiendo (un gemelo
     hemodinámico). Cabe en la arquitectura actual (todo en el teléfono). **(supongo)** «tiempo real» = tú tecleas o
     dictas las medidas mientras exploras; conectar el ecógrafo directamente no es posible desde una web en el móvil.
  3. **Asistente con IA** (lo que llegue con la tecnología): leer imagen con modelos abiertos (p. ej. los de NVIDIA
     para TC, familia MONAI / VISTA-3D, **por comprobar** modelo y licencia) unidos al método de NavRad y Radiology
     Assistant; IA de eco. **Choca con reglas actuales** (sin backend; una sola librería) y abre temas legales: datos
     de salud de pacientes reales (anonimizar, mejor en el propio dispositivo o en un ordenador del hospital) y
     producto sanitario (una herramienta que ayuda a diagnosticar es regulada; en estudio no). Decisión del usuario.
  - **Datos de pacientes** (el usuario, 23/10): no guardar datos personales; sí usarlo para calcular y para ayudar a
    diagnosticar sin que se guarde; y usar las imágenes para «alimentar a Claude». Explicado y anotado en
    `docs/historial/radar.md` §3: cálculos sin identificar y sin guardar, sí; imágenes reales, solo anonimizadas y
    procesadas en el dispositivo o en el hospital; a un servicio de IA externo, no; «mejorarse» = biblioteca de casos
    anonimizados o abiertos dentro de la app.
    **Decidido (23/10): la idea de «alimentar a Claude» con imágenes de pacientes queda descartada** («lo de alimentar
    a Claude lo olvidamos»).
  - **Vigía tecnológico** dentro del radar: cada avance (IA de imagen, de eco, modelos nuevos) entra como una
    entrada más y se tría contra el norte.
- **Lo que NO quiero** **(supongo)**: acumular proyectos sueltos; construir sin pasar por el norte; meter código,
  textos o imágenes ajenos; dar por fuente un tuit o una web; abrir 10 frentes a la vez.
- **Primeras entradas**: las 6 webs de hoy (anesthbeta, EchoSuite, AngioView, NavRad, Radiology Assistant, RitmoLab),
  las 3 herramientas (REA, leanrea → skill `/ingenieria-reversa`, y las skills de clinical-ai-skills y
  research-agent-skills), ya estudiadas: entran triadas en la fase que les toca.
- **Depende de**: que confirmes o corrijas el norte. La ejecución (fases 0-4) depende de lo que está en «Esperando algo
  tuyo» (informe final).
- **Tamaño**: grande y permanente. Trozos que propongo:
  1. **Norte** (pequeña): escribirlo contigo en una página corta y dejarlo fijo.
  2. **Montar el radar** (pequeña-mediana): registro, ficha de triaje, la skill `/radar` y la hoja de ruta viva.
  3. **Volcar lo de hoy** (pequeña): las 6 webs y las 3 herramientas como primeras entradas triadas.
  4. **Revisión periódica** (cada tanda): triar lo nuevo y re-priorizar contigo.
  Las fases 0-4 del informe final se aprueban aparte, como tareas del plan socialista.
- **Dudas**:
  1. ¿El norte de arriba es lo que quieres conseguir, o le falta algo (p. ej. el MIR, la docencia a otros, la consulta
     en la guardia frente al estudio)?
  2. ¿Cómo me pasarás lo de Twitter: enlace, captura o texto copiado? (x.com suele estar bloqueado desde aquí; una
     captura o el texto funcionan siempre.)
  3. ¿Cada cuánto quieres la tanda de decisiones: semanal o cada N entradas?
  4. ¿Te vale el nombre «Radar»?
  5. (23/10) Para el nivel 3: ¿aceptas cambiar «sin backend» para esa parte (un servidor o un ordenador con GPU), o
     prefieres solo lo que corra en el propio teléfono? ¿Uso solo docente con casos abiertos, o también con
     pacientes reales (requiere el visto bueno del hospital)?

### B-013 · Pulmón con respirador (modelo vivo) · apuntado 2026-10-23
- **Lo que dijiste**: «El punto 5 sobre lo que me propones me gusta, añádelo» (la propuesta del pulmón con respirador).
- **Cómo lo entiendo**: tipo `visual` (modelo vivo grande, megaproyecto según REGLAS §7.12). **Ya estaba previsto** como
  el modelo del **bloque 4 de Marino** (caps. 23-30) y diseñado como maqueta M3 en `autonomo/ideas/marino.md` §4.1:
  - Qué se ve: alvéolos en la caja torácica unidos al tubo y al respirador, con las curvas vivas de presión, flujo y
    volumen; alvéolos sobredistendidos, abiertos y colapsados que se abren y cierran.
  - Mandos: VCV | PCV, Vt por peso predicho, PEEP (presión de conducción y mejor PEEP), compliance y resistencia, FR e
    I:E (PEEP oculta), pausas inspiratoria y espiratoria, esfuerzo del paciente (SBT), VNI y alto flujo.
  - Se une al **motor del corazón** (la presión intratorácica baja el gasto; VVS en cada latido) y al **ácido-base**
    (la ventilación minuto fija la PaCO₂).
  - ~19 fichas (Merino Neumología, Marino caps. 7, 11 y 23-30), con imágenes reales de SDRA y VILI.
  - Encaja con el norte del Radar: nivel 1 (estudiar) y, después, nivel 2 (la guardia: ajustar el respirador con tus
    datos).
- **Depende de**: terminar el bloque 3 (o adelantarlo si lo decides); la maqueta M3 para que elijas antes de construir.
- **Tamaño**: grande (maqueta → modelo → fichas con Estudiar). Trozos: 1) maqueta; 2) modelo en la app; 3) enlace con
  el corazón y el ácido-base; 4) Mayéutica y casos en las fichas.
- **Dudas**: ¿lo dejas en su sitio (bloque 4, tras el 3) o lo adelantas?

### B-014 · Inventario de estudio · apuntado 2026-10-23
- **Lo que dijiste**: (el mismo mensaje) la propuesta del inventario.
- **Cómo lo entiendo**: tipo `auditoria`, **solo lectura**, sin tocar la app. Una tabla de las ~724 fichas: si tienen
  vista Visual, modelo vivo que las explique, Estudiar (Mayéutica) o solo preguntas viejas (y cuántas «de
  redactar»), con su especialidad y su fuente. Salida: una página para el móvil con el recuento por especialidad y
  la lista ordenada por lo que más ayudaría a estudiar.
- **Para qué**: decidir con datos qué mejorar primero (y alimentar el Radar: dónde encaja cada idea nueva).
- **Depende de**: nada.
- **Tamaño**: pequeña (una sesión).
- **Dudas**: ninguna.

### B-015 · Megaproyecto de la eco: modelo, imagen más realista y lo mejor de las webs · apuntado 2026-10-25
- **Lo que dijiste**: «nuestra eco la podemos mejorar por un millón… mejorar el modelo, el renderizado, el hacerlo más
  realista, el añadir las mejoras de todas las páginas de eco en nuestro modelo».
- **Cómo lo entiendo**: tipo `visual`, megaproyecto (REGLAS §7.12) sobre `js/modules/eco/`, con sus pruebas en verde.
  Tres frentes: 1) **modelo**: anatomía más fiel del corazón y de lo que lo rodea (esófago para la ETE, segmentos de
  valvas, coronarias), sin perder que lo mueve el motor; 2) **imagen**: eco más realista (sombra acústica, artefactos,
  ganancia y profundidad, ventana pobre, calidad automática en el móvil); 3) **lo de las webs**: colores de estructura,
  rótulos con enlace al 3D, viaje entre vistas, guía de sonda, ETE, banco de la mitral, calculadora ↔ simulador,
  gemelo hemodinámico. **(supongo)** primero una maqueta comparativa «antes / después» de la imagen para que elijas.
- **Depende de**: decidir tocar la anatomía congelada; ASE/SCA 2013 de ETE; fuentes de cada medida.
- **Tamaño**: grande. Trozos: maqueta de imagen → anatomía → vistas y mandos → calculadoras y gemelo.
- **Dudas**: ¿se puede añadir anatomía a partir de mallas abiertas (BodyParts3D, CC BY, con cita) o todo procedural?

### B-016 · Vuelta por los modelos vivos: mecánicas nuevas · apuntado 2026-10-25
- **Lo que dijiste**: «de los modelos vivos que ya tenemos, se podría dar una pequeña vuelta a ver si hubiera que
  mejorarlos con alguna nueva mecánica que podamos añadir».
- **Cómo lo entiendo**: tipo `auditoria` de solo lectura (profesor, modo juzgar) sobre los 14 modelos vivos, con las
  mecánicas aprendidas en la ingeniería inversa: error con consecuencia y «mecanismo prioritario», revisión final por
  objetivos, velocidad 1×/5×/20×, monitor común, fórmula con tus números, pares de prueba, «retenido» con motivo.
  Salida: una tabla modelo → mecánica que le encaja → esfuerzo, para que elijas.
- **Depende de**: nada. **Tamaño**: pequeña (una sesión).

**Decisiones del usuario del 25/10** (aprobó todas las recomendaciones): etapa A «adelante»; v3 de los 3 modelos del
bloque 3 con los arreglos del juicio y un monitor común antes de la app; puerta «Guardia» nueva en la raíz; G1 (shock)
tras la fase 0; tocar el motor (ritmo e IAM) y la anatomía congelada (esófago, valvas por segmentos, coronarias);
mallas abiertas con cita: se decide viendo la maqueta; visor de cortes en la fase 4; casos de imagen «no comerciales»,
sí; figuras de Radiology Assistant, no (se enlaza). Respuestas por defecto del Radar: Twitter por captura, texto o el
bot de Telegram (B-017); decisiones semanales; nombre «Radar»; la IA de TC, solo en el teléfono hasta nueva decisión.

## Objetivo V · Mecánicas nuevas en los modelos vivos

Aprobado por el usuario el 25/10/2026 («me parece todo perfecto, estoy de acuerdo en lo que dice el profesor»), sobre el
informe de `vuelta-modelos` (`autonomo/ideas/vuelta-modelos.md`, https://claude.ai/artifact/5hpTv7763RnZUPt9hwMycW).
Son mejoras de lo que ya existe (tipo `visual` sobre modelos hechos): a `main` con los jueces en verde y `--modelo`
de cada modelo tocado. Antes de construir, comprobar en la ficha cada cifra marcada como hueco en el informe.

| # | Clave | Qué | Estado | Notas |
|---|---|---|---|---|
| 1 | `formula-comun` | B-018 · «La fórmula con tus números»: pieza común en `js/core/` y su uso en capilar, río y mar, glomérulo, filtro y eco | hecha (2026-10-25) · en main, sin PR (Objetivo V) | Pequeña; los cálculos ya existen |
| 2 | `potasio-prioritario` | B-019 · Potasio: «mecanismo prioritario» y revisión por objetivos al acabar el reloj | hecha (2026-10-25) · en main, sin PR (Objetivo V) | Pequeña-mediana |
| 3 | `objetivos-casos` | B-020 · Revisión final por objetivos en los casos del motor común (`core/mayeutica-motor.js`) | hecha (2026-10-26) · en main, sin PR (Objetivo V) | Mediana; llega a inmersión, muralla, telar y vaso |
| 4 | `eco-vci-retenido` | B-021 · Eco: «retenido» de la VCI con ventilación mecánica | hecha (2026-10-27) · en main, sin PR (Objetivo V) | Pequeña; umbrales del Manual UMI |
| 5 | `monitor-comun` | B-022 · Monitor común en los modelos (capilar, eco, receptores, cama 7) | aparcada (aprobada 2026-10-25; 28/10: sus canales de respirador van en `b3-pulmon-app`; llevarlo a capilar, receptores y cama 7, después de Marino; a la eco, tras B-039) | Se hace con el bloque 3 (su monitor común ya está decidido); después, llevarlo a los demás |

**Encargo `formula-comun`** · tipo: visual (mejora de lo existente)
- Qué quiero: al mover un mando, un renglón «fórmula → tus números → resultado» (p. ej. CaO₂ = 1,34 × 7 × 0,97 + 0,003 × 90).
- Para qué: estudiar (ver de dónde sale la cifra).
- Modelo «así sí»: los modelos vivos de Libros (`capilar-vivo`, `agua-viva`).
- Lo visual: una pieza común en `js/core/` (junto a `ui.js`), usada en capilar (CaO₂/DO₂), río y mar (Posm efectiva), glomérulo (presión de filtración, rótulo «ilustrativo»), filtro de la TRR (dosis de efluente) y eco (GC por ITV).
- Lo que NO quiero: fórmulas nuevas sin fuente; recalcular en la pieza (copia el cálculo que ya existe).
- Fuente: la de cada ficha; la del glomérulo es fisiología general.

**Encargo `potasio-prioritario`** · tipo: visual (mejora de lo existente)
- Qué quiero: que el simulador enseñe qué hace cada medida. El calcio protege la membrana pero no baja el K⁺; la insulina y el salbutamol lo meten en la célula un rato; solo el riñón, las resinas o la diálisis lo sacan. Lo que no trata el mecanismo prioritario «no cambia nada». Al acabar el reloj, revisión por objetivos (ECG protegido, K⁺ en zona, salida iniciada), sin nota.
- Modelo «así sí»: `js/modules/nefrologia/hiperpotasemia-sim.js` (+ `potasio-escena.js`), patrón de RitmoLab (`autonomo/ideas/ingenieria-inversa/ritmolab-2.md`).
- Lo que NO quiero: cifras de cuántos mEq mueve cada medida si la ficha no las da (hueco ya avisado).
- Fuente: la tabla de tiempos que ya usa el simulador.

**Encargo `objetivos-casos`** · tipo: visual (mejora de lo existente)
- Qué quiero: al cerrar un caso de un modelo vivo, «cumplido / falta y por qué» por objetivos (p. ej. inmersión: BPS, RASS objetivo, CAM-ICU), y como opción del motor «si eliges mal, el modelo pasa a…» (error con consecuencia: TIH en el telar, PTT en el vaso, midazolam en la inmersión).
- Modelo «así sí»: `js/core/mayeutica-motor.js` (`crearMayeuticaModelo`) y `js/modules/libros/capilar-vivo.js`.
- Lo que NO quiero: nota numérica; romper los casos que ya existen. El ácido-base tiene motor propio: fuera, salvo que se pida migrarlo.
- Fuente: la de cada ficha (Merino o Marino, con página).

**Encargo `eco-vci-retenido`** · tipo: visual (mejora de lo existente)
- Qué quiero: con ventilación mecánica, el ecógrafo no da la estimación por colapso de la VCI sola: «retenido: no uses el colapso solo», con su motivo.
- Modelo «así sí»: el aviso de «combinación no fisiológica» y el patrón «retenido» de EchoSuite (`autonomo/ideas/ingenieria-inversa/echosuite-2.md`).
- Lo que NO quiero: umbrales de la ASE 2025 (no está en `docs/`).
- Fuente: Manual UMI (umbrales 12/18/40 %), con página. Pruebas: `node --test 'js/modules/eco/pruebas/*.test.mjs'`, `jueces.mjs --eco`.

**Encargo `monitor-comun`** · tipo: visual · aparcada hasta el bloque 3
- Qué quiero: el monitor común de `autonomo/maquetas/comun/` pasado a `js/core/` con el bloque 3; después, en capilar (sustituye su tablero), eco (lee el motor), receptores (PA y FC por fármaco, cualitativo 0-3) y cama 7.
- Lo que NO quiero: monitor en la nefrona, el filtro, el catéter ni la muralla (no tienen constantes).

## Objetivo I · Integración: lo que llega de la ingeniería inversa (rumbo del Radar)

Aprobado por el usuario el 25/10/2026 como rumbo («estoy de acuerdo con todo») y **pasado a tareas el 27/10/2026**
(«sí, pásalo al tablero»). Sale de la hoja de ruta (`autonomo/radar/HOJA-DE-RUTA.md`), del informe «Del simulador a la
cama» (https://claude.ai/artifact/3hnNvcEsvsotfViShnXLee) y del plan de integración (`docs/historial/radar.md` §6).
**Regla de oro**: el constructor trabaja solo con nuestro informe de ingeniería inversa y nuestras fuentes; nunca abre
la web ajena. Orden propuesto por la bitácora el 27/10 y aceptado: **Fase 1** (la rotación de Cardiología empieza el
01/11) → **Fase 0** → **G1** → el resto, según lleguen los PDF. Marino (Objetivo M5) sigue siendo el carril del
corazón: lo que ya es parte de `b3` no se repite aquí.

| # | Clave | Qué | Estado | Notas |
|---|---|---|---|---|
| 1 | `pif-ecg` | Fase 1 · Cuaderno «ECG y arritmias» en PIF → Cardiología, enlazado al corazón eléctrico | hecha (2026-10-28): PR [#36](https://github.com/alvariitoSW/fiebres-neutropenias/pull/36) aprobada por el usuario y en `main` | PDF recibido el 27/10: López Ramírez, *La alegría de leer el electrocardiograma*, 3.ª ed., 2012 (`docs/lopez-ramirez-2012-alegria-leer-ecg-parte1/2/3.pdf`; desplazamientos en la bitácora §3). La v3 del corazón eléctrico (`b3-ritmo-v3`) y su paso a la app (`b3-3c`) **ya van dentro de `b3`** |
| 2 | `b3-ritmo-motor` | Fase 1 · El ritmo del corazón eléctrico mueve el motor del latido (FC, llenado, gasto) | aparcada (Consejo, 28/10: hasta que el usuario decida la reforma de la eco, B-039) | Después del 3C de `b3`. Técnica sobre lo que ya existe; a `main` con jueces `--eco` y `--modelo` |
| 3 | `b3-bradi` | Fase 1 · Bradicardias, bloqueos AV y marcapasos en el corazón eléctrico | pendiente · **versión corta** (Consejo, 28/10): los 5 estados `pend-` con ECG, frase viva y página de la ESC 2021; 3-4 M; el marcapasos a fondo, con `arritmias-*` | Fuente ya en `docs/` (`esc-2021-estimulacion-cardiaca.pdf`, 26/10; su índice de páginas, en el encargo de `b3`). Va después del 3C de `b3` |
| 4 | `culprit-a` | Fase 1 · Ficha «Del vaso a la derivación» (arteria ↔ derivaciones ↔ pared) (B-026, A) | absorbida en `arteria-culpable` (Ley de Ciencia, validada por el usuario el 29/10) | Decisión del usuario del 26/10. Fuentes ya en `docs/` (ESC 2023 de SCA, Wagner 2009, Thygesen 2018, de Winter 2008, CONFIRM 2015, Tamura 2014). Detalle: `autonomo/ideas/ingenieria-inversa/culprit.md` |
| 5 | `culprit-b` | Fase 1 · Preguntas «predice el ECG» y «coloca el trombo» (B-026, B) | absorbida en `arteria-culpable` (Ley de Ciencia, validada por el usuario el 29/10) | Va detrás de `culprit-a`. C (modelo 2D) espera a las coronarias del motor; D, tras C |
| 6 | `f0-cifras` | Fase 0 · Calculadoras: la cifra nunca contradice su grado + «la fórmula con tus números» | pendiente | Usa la pieza de `formula-comun` (ya en `js/core/`). Juez `--calc` (cambio previo 5 del plan) |
| 7 | `f0-origen` | Fase 0 · Origen y licencia a la vista en simuladores, calculadoras e imágenes | pendiente | CLAUDE.md §7.4. Juez `--origen` · **Ley de Ciencia (29/10)**: suma el «estado de revisión visible» por imagen y calculadora (anesthbeta 8, echosuite-2 8) |
| 8 | `f0-eco-color` | Fase 0 · Eco: colores por estructura | aparcada (28/10: espera la reforma de la eco, B-039; el informe `tee-inversa` es su fuente) | Las cuatro `f0-eco-*`: **un solo constructor en serie**. Antes, mirar qué hicieron ya las paradas 1-2 de `eco-mega` (p. ej. «Señálalo») para no repetir |
| 9 | `f0-eco-rotulos` | Fase 0 · Eco: rótulos que marcan la estructura en el corte y en el 3D | aparcada (28/10: espera la reforma de la eco, B-039; el informe `tee-inversa` es su fuente) | Ver nota de `f0-eco-color` |
| 10 | `f0-eco-viaje` | Fase 0 · Eco: la sonda viaja animada entre vistas | aparcada (28/10: espera la reforma de la eco, B-039; el informe `tee-inversa` es su fuente) | Idea 3 de `anesthbeta.md` §6 |
| 11 | `f0-eco-guia` | Fase 0 · Eco: ayuda en vivo al mover la sonda | aparcada (28/10: espera la reforma de la eco, B-039; el informe `tee-inversa` es su fuente) | Sobre `vistaMasParecida()`; idea de EchoSuite |
| 12 | `f0-movil` | Fase 0 · Calidad automática en el móvil (peso de la página y fps de la eco) | pendiente | Técnica, directo a `main`. Cambio previo 5 del plan |
| 13 | `f0-ra-biblio` | Fase 0 · Bibliografía de The Radiology Assistant en el PIF de Radiología | pendiente | Solo enlaces verificados (CLAUDE.md §7.2); sus figuras, no (decidido 25/10) |
| 14 | `g1-shock` | G1 · Puerta «Guardia» en la raíz y su primera situación: shock e hipotensión | absorbida en `guardia-shock` (Ley de Ciencia, validada por el usuario el 29/10) | Tras la fase 0. Cadena VCI → PAD → VS → GC → E/e′ → VExUS, cada paso con su fórmula (`NORTE.md`). Fuentes: Manual UMI (FATE) y VExUS en `docs/`. Maqueta antes para elegir. Sin guardar datos del paciente |
| 15 | `g2-paro` | G2 · Arritmia inestable y paro | pendiente | Fuente ya en `docs/` (27/10): `aha-2025-parte9-soporte-vital-avanzado.pdf` (paro, taquiarritmia y bradicardia con pulso, cardioversión; página impresa S = PDF + 537) y `aha-2025-novedades-rcp.pdf`. Después de G1 |
| 16 | `g3-sca` | G3 · Dolor torácico y SCA (y marcapasos) | aparcada (30/10: el usuario descarta Di Mario 2005 del todo, «no voy a subir un artículo de hace 21 años»; las proyecciones salen de una fuente abierta o quedan como hueco) | Falta Di Mario 2005 (de pago, 60 €: el usuario no lo manda, 27/10; buscar una fuente libre de las proyecciones o dejar hueco); la ESC 2023 de SCA y la ESC 2021 de estimulación ya están en `docs/` |
| 17 | `g4-dispositivo` | G4 · Tras colocar un dispositivo (placa, punta del tubo o la vía, neumotórax) | aparcada | Antes, comprobar qué cubren Marino, Merino Neumología y Técnicas R1; faltan casos con licencia |
| 18 | `g5-neuro` | G5 · Neurocrítico (TC de cráneo en 5 preguntas) | aparcada | Ya no espera PDF: no hay temario de Neurorradiología (27/10); pasa al enfoque de B-005 (cada objetivo de `js/data/pif-rotaciones.js` es una pregunta de búsqueda) cuando lo apruebes. El Libro Azul, sección VIII (neurología), ya en `docs/` (27/10) |
| 19 | `g6-ete` | G6 · Quirófano cardíaco y ETE | pendiente | Fuente ya en `docs/` (`hahn-2013-ete-completa-ase-sca.pdf`). Después de G1 |
| 20 | `f2-coronarias` | Fase 2 · Coronarias por segmentos con dominancia en el motor | aparcada | Abre `culprit` C y la pared por regiones (C2 de `rea-eco`) |
| 21 | `f2-angio` | Fase 2 · Coronariografía que late (arco en C, vista óptima) y «cómo leer un informe de cateterismo» | aparcada (30/10: el usuario descarta Di Mario 2005 del todo, «no voy a subir un artículo de hace 21 años»; las proyecciones salen de una fuente abierta o quedan como hueco) | Tras `f2-coronarias`. Falta Di Mario y Sutaria 2005 (de pago: buscar una fuente libre) |
| 22 | `f2-ete` | Fase 2 · ETE medioesofágico y transgástrico con reto de sonda y banco de la mitral A1-P3 | pendiente · espera la decisión de B-039 (Consejo, 28/10) | Fuente ya en `docs/` (Hahn 2013). Ideas 1, 2, 4 y 7 de `anesthbeta.md` §6; decidido el 25/10 tocar la anatomía (esófago, valvas por segmentos) |
| 23 | `f3-calc-eco` | Fase 3 · Calculadoras de eco para la UCI con catálogo único y «¿cómo se mide?» | absorbida en `guardia-shock` (los PDF ya están en `docs/`) (Ley de Ciencia, validada por el usuario el 29/10) | Fuentes completas en `docs/` desde el 27/10: corazón derecho (Mukherjee 2025), cámaras (Lang 2015) y la diastólica, Nagueh 2025, y el informe estandarizado, Taub 2025, ya en `docs/` desde el 27/10). Ideas en `echosuite.md` y `echosuite-2.md` |
| 24 | `f4-visor` | Fase 4 · Visor ligero de cortes de TC | aparcada | Faltan casos con licencia (zenodo, TCIA, Radiopaedia, AWS cerrados en la red) |
| 25 | `f4-punta` | Fase 4 · «¿Dónde está la punta?» puntuado | aparcada | Igual que `f4-visor` |
| 26 | `f4-recorridos` | Fase 4 · Recorridos fijos (Rx de UCI, TC de cráneo en el coma, TEP) | aparcada | Igual (los temarios ya no se esperan: ver B-005, 27/10) |
| 27 | `ecg-plan` | B-033 · Plan del ECG en dos caminos (aprender desde cero con Anatomy y modelo vivo; leer juntos en la guardia): solo el plan, con piezas y gasto estimado | hecha (2026-10-27) | Aprobado por el usuario el 27/10 (solo el plan). Tipo: plan (sin construir). Profesor en modo cobertura (fable) sobre la PR #36 (`auto/pif-ecg`), `ritmolab-3.md`, el corazón eléctrico y el método Anatomy; informe Artifact para el móvil con opciones y coste por pieza (`gasto.mjs` y presupuestos vigentes). Las piezas elegidas vuelven a la bitácora · **Hecho**: plan publicado (https://claude.ai/artifact/6bVRWXYtCi8rFx7NZZYB3c, copia `autonomo/planes/ecg-plan.html`); las 4 decisiones y las piezas, en B-033 |

| 28 | `ecg-guardia` | B-033 · Camino 2 · «Leer juntos en la guardia» (asistente de 9 pasos que cierra con criterios del libro y página) + enlaces estado ↔ ficha/página/trazado (piezas 2-5 del plan) | absorbida en el bloque `pif-cardio`, parada 1 (Ley de Ciencia, validada por el usuario el 29/10) | Continúa el cuaderno de la PR #36 (ya en `main` el 28/10): rama nueva desde `main`. Presupuesto ≈ 2,9 M. Programada para el 28/10 por la mañana |
| 29 | `arritmias-maqueta` | B-033 · Camino 3 · Maqueta del **laboratorio de arritmias** (puerta «Arritmias»): lector AHA 2025/ESC 2019/2021 → tabla de cifras con página; paciente + monitor + ¿pulso?/¿estable?, SYNC, marcapasos transcutáneo; bradis/BAV/atropina en el grafo (L0-L3) | absorbida en el bloque `pif-cardio`, parada 3 (Ley de Ciencia, validada por el usuario el 29/10) | Sobre `autonomo/maquetas/b3-ritmo/`. Hace la parte de maqueta de `b3-bradi`. ≈ 3,4 M + parada (el usuario la ve y elige). Programada para el 28/10 por la mañana |
| 30 | `arritmias-app` | B-033 · Camino 3 · Laboratorio en la app: monitor + acciones, estados nuevos y modos Estudio/Guardia con revisión sin nota (L4-L5) | absorbida en el bloque `pif-cardio`, parada 3 (Ley de Ciencia, validada por el usuario el 29/10) | Tras aprobar la maqueta de `arritmias-maqueta`. Absorbe la parte en la app de `b3-bradi` y prepara `g2-paro`. ≈ 2,9 M + director |
| 31 | `arritmias-casos` | B-033 · Camino 3 · Los 6 casos del laboratorio + auditor y juicio (L6-L7) | absorbida en el bloque `pif-cardio`, parada 3 (Ley de Ciencia, validada por el usuario el 29/10) | Tras `arritmias-app`. ≈ 2,75 M |
| 32 | `ecg-vector-maqueta` | B-033 · Camino 1 · Maqueta del vector y las 6 derivaciones de los miembros en el corazón eléctrico, con prueba del eje por estado (piezas 6-7) | absorbida en el bloque `pif-cardio`, parada 2 (Ley de Ciencia, validada por el usuario el 29/10) | Tras `arritmias-maqueta` (reutiliza su monitor). ≈ 2,0 M + parada |
| 33 | `ecg-vector-app` | B-033 · Camino 1 · Derivaciones en la app + Mayéutica «desde cero» y 2 casos + auditor y juicio (piezas 8-10) | absorbida en el bloque `pif-cardio`, parada 2 (Ley de Ciencia, validada por el usuario el 29/10) | Tras aprobar `ecg-vector-maqueta` y fusionar la PR #36. ≈ 4,75 M + director |
**Encargo común del Objetivo I** (cada tarea lo concreta su director con su informe de ingeniería inversa):
- Para qué: ayudar en la guardia y estudiar (`autonomo/radar/NORTE.md`).
- Modelo «así sí»: las piezas de la app que ya existen (eco, motor del latido, `formula-comun`, cuaderno de campo,
  Mayéutica). Lo nuevo con maqueta antes para que el usuario elija.
- Lo que NO quiero: copiar código, texto o imágenes de las webs estudiadas; cifras sin fuente; guardar datos de
  pacientes; librerías nuevas sin que el usuario las elija (three.js sigue sin decidir).
- Fuente: la que dice cada fila; sin PDF, la tarea se queda `aparcada`.


**Encargo de las tareas 28-33 (B-033, aprobado el 27/10/2026)**: el plan entero, con arte, piezas, presupuestos,
casos y riesgos, está en `autonomo/planes/ecg-plan.html` (Artifact https://claude.ai/artifact/6bVRWXYtCi8rFx7NZZYB3c)
y en el parte `autonomo/partes/2026-10-27-ecg-plan.md`. Decisiones (las recomendadas del plan; el usuario no eligió
otras): ampliar el corazón eléctrico (`ritmo-vivo`), no un modelo nuevo; **una sola pieza viva con tres caras**
(laboratorio, derivaciones, «Vive este caso» desde el cuaderno); el asistente cierra con la **lista de criterios
cumplidos con página**, nunca un diagnóstico ni dosis; orden guardia → laboratorio → vector; **la tabla de cifras de
AHA/ESC (L0) antes de la maqueta**. Método Anatomy: skill del proyecto `anatomy` (`.claude/skills/anatomy/`, instalada el 27/10; método sí, kit no). Lo que
NO quiero: cifras sin página (julios, mA, atropina, signos de inestabilidad solo de AHA 2025 parte 9, S = PDF + 537,
ESC 2019 TSV, PDF + 654, ESC 2021 estimulación); constantes en línea recta; guardar datos del paciente; un segundo
simulador; precordiales de tabla fija presentadas como fisiología; tocar `pagina.js` (665 líneas): lo nuevo, en
módulos aparte (`ritmo-vivo/laboratorio/`, `ritmo-vivo/derivaciones.js`). Juez: `--modelo ritmo-vivo` y un programa
de prueba estado × acción que devuelva PA, FC y pulso en texto (paciente posible en los 17 estados).

## Objetivo P · Informes con gasto antes de construir (aprobado el 27/10/2026)

El usuario, el 27/10: «Apruebo que se empiece esto, pero antes hay que hacer su /plan-socialista con sus gastos y su
informe sobre qué hacer para que lo apruebe y empecemos». Cada tarea es **solo un informe**: no toca la app. Sale una
página para el móvil (Artifact) con qué se haría, en qué orden, las opciones y el **gasto estimado de cada opción**
(con `gasto.mjs` y los presupuestos de arriba), y un parte. Directo a `main`. Cuando el usuario elija, la
construcción es otra tarea.

| # | Clave | Qué | Estado | Nota |
|---|---|---|---|---|
| 1 | `b3-paso4-opciones` | Bloque 3, paso 4: **todas las piezas nuevas o aligerarlo**, con el gasto de cada opción | hecha (2026-10-27): informe https://claude.ai/artifact/HnYNUdSSrtvzdq8QhSj4Qw. **27/10: primero dejó la elección al profesor; después, en otra sesión, eligió él la A (las 17 piezas, ≈36 M)** → tarea `b3-paso4` | Parte de `autonomo/bloques/b3/plan-paso4.md` (17 fichas, 17 piezas, ≈35-40 M) |
| 2 | `eco-calibra` | **B-027 + B-029**: motor diastólico de la eco (E/A, AI, venas pulmonares) y HP crónica que deforma el corazón | hecha (informe, 27/10). **27/10: el usuario elige la A** → tarea `eco-calibra-a` | Informe: https://claude.ai/artifact/SFfwNewLsWiwuRPxSRXCpw · parte `2026-10-27-eco-calibra.md` |
| 3 | `competencias-r` | **B-032**: mapa de lo que un residente debe manejar cada año (R1-R5), camino a la guardia de R2 | hecha a medias (27/10, en main): R1 y «antes de tu primera guardia»; R2-R5 → tarea `competencias-r2r5` (27/10: no habrá PDF; antes «necesita humano») (BOE y CoBaTrICE bloqueados por el proxy: faltan los PDF de la Orden PJC/564/2026 y del programa CoBaTrICE) | Informe: `autonomo/ideas/competencias-r.html` (https://claude.ai/artifact/PzttLXc1yuWpSdwiQE5R2N). Sin documento de R2; le preocupan shock, vía aérea, parada y neurocrítico |

**Encargo `b3-paso4-opciones`** · tipo: informe (no toca la app) · aprobado el 27/10/2026
- Qué quiero: con el plan del paso 4 ya escrito, dos o tres opciones claras: (A) las 17 piezas nuevas; (B) aligerado:
  cada ficha que pueda, con un modelo que ya existe (estado nuevo en vez de pieza nueva); (C) intermedia, si tiene
  sentido. Por cada ficha: qué modelo usa, qué se pierde para estudiar si se aligera, y gasto y sesiones.
- Para qué: que el usuario decida cuánto gastar en el paso 4 sabiendo qué gana.
- Antes de estimar, contar las piezas en el código (propuesta de ahorro de la bitácora, 27/10): sacar con `node -e`
  las claves de estado de cada modelo y cruzarlas con la cobertura.
- Lo que NO quiero: construir nada; estimar sin contar.
- Fuente: `autonomo/bloques/b3/plan-paso4.md`, `cobertura` del b3, la tabla de presupuestos de este tablero.
- Hecho: página con las opciones y su gasto + parte; el usuario elige.

**Encargo `eco-calibra`** · tipo: informe (no toca la app) · aprobado el 27/10/2026 (B-027 y B-029)
- Qué quiero: el informe que pide B-027 y el punto (1) de B-029. Qué está mal (E/A 10 en la hipertrofia y 3,9 en la
  dilatada; flujo de venas pulmonares ×2-3; onda a de la AI ~15 mmHg; D venosa del TEP 0; AD igual; `hpcronica` a
  fondo aplasta el VD y el dibujo recorta el volumen), la calibración objetivo con su fuente y página (Nagueh 2025,
  Lang 2015 p. 24, Mukherjee 2025, ESC/ERS 2022, ya en `docs/`), el orden, qué pruebas hay que recalibrar y el
  **gasto estimado**. Incluir las dos propuestas de juez: «paciente posible del Doppler» por forma (E/A, E/e′, S/D,
  TAPSE, velocidades) y cada forma al 100 % sin el aviso de recorte del dibujo.
- Para qué: que la eco enseñe la lección bien (con mala relajación, E/A <1) y no salgan corazones imposibles.
- Lo que NO quiero: tocar el motor en esta tarea; cifras sin página.
- Fuente: `autonomo/bloques/eco-mega/p3-f3b.md`, `profesor-p3.md`, `js/modules/eco/README.md` y los PDF citados.
- Hecho: página con el diagnóstico, la cifra objetivo de cada forma, las opciones y su gasto + parte.

**Encargo `competencias-r`** · tipo: mapa (informe, no toca la app) · aprobado el 27/10/2026 (B-032)
- Qué quiero: mapa de competencias por año (R1 a R5) con lo que
  tiene ya la app para cada una (✅ / 🟡 / ❌, con enlace), y arriba «lo que necesitas antes de tu primera guardia
  sin R mayor».
- Fuente: el PIF de R1 (`js/data/pif-rotaciones.js`, PFI-UMI-R1-01); para R2-R5, buscar y citar (supongo) el
  programa oficial de la especialidad de Medicina Intensiva (BOE) y el marco europeo CoBaTrICE (URL verificada o
  PDF en `docs/`); si no se encuentran, hueco. Usa el inventario de estudio (B-014) y «La UCI en el bolsillo» (G1-G6).
- Al empezar, preguntar al usuario (como mucho estas dos): ¿tiene un documento del hospital para R2? ¿qué le
  preocupa más de la guardia sola con el adjunto?
- Lo que NO quiero: competencias sin fuente; repetir contenido que ya existe (se enlaza); construir nada aún.
- Hecho: página con el mapa y la propuesta de tareas que salen de los huecos, con su gasto + parte.

## Decisiones del usuario sobre los informes del Objetivo P (27/10/2026)

El usuario, el 27/10 por la tarde: «Me quedo con la opción A de arreglo completo eco-calibra · hipertrofia, lo que
decida el profesor · paso 4 del bloque 3: que decida el profesor · competencias de R2 a R5: no voy a pasar los PDF».
Para R2-R5 eligió, tras avisarle de `CLAUDE.md` §7.1: **otras fuentes que se abran y citadas; lo que no tenga fuente,
marcado como «propuesta, sin fuente oficial»**. Empiezan el 28/10 (el 27/10 ya iba por encima del aviso de gasto),
una sesión cada una, a horas distintas (sesiones programadas).

| # | Clave | Qué | Estado | Nota |
|---|---|---|---|---|
| 1 | `eco-calibra-a` | Opción A del informe `eco-calibra`: arreglar las 5 piezas del motor de la eco y los dos jueces nuevos | hecha (2026-10-28, arreglo técnico en `main`; parte `autonomo/partes/2026-10-28-eco-calibra-a-s2.md`; 3 huecos propuestos a la bitácora) | ≈5,5 M en 2 sesiones. Informe https://claude.ai/artifact/SFfwNewLsWiwuRPxSRXCpw · copia `autonomo/bloques/eco-mega/calibra-informe.html` |
| 2 | `b3-paso4` | Paso 4 del bloque 3: **opción A** (las 17 piezas nuevas, elegida por el usuario el 27/10) construida por grupos | en curso (grupos 1-4 hechos en `auto/b3`, 28-30/10: taquiarritmias, parada, shock cardiogénico, IC; partes `2026-10-28-b3-paso4-g1/g2`, `2026-10-29-b3-paso4-g3a/g3b`, `2026-10-30-b3-paso4-g4` en la rama · tabique y grupo 5 hechos el 30/10 (parte `2026-10-30-b3-paso4-g5`, 11,7 M, +30 % aceptado) · siguiente: grupo 6 (TEP), tope 5,9 M · gastado 52,1 M de ≈58 M (Consejo 30/10, 6.ª)) | Informe https://claude.ai/artifact/HnYNUdSSrtvzdq8QhSj4Qw · plan `autonomo/bloques/b3/plan-paso4.md`. Rama `auto/b3` |
| 3 | `competencias-r2r5` | Completar el mapa de competencias de R2 a R5 | aparcada (27/10, noche: no corre prisa) | Sobre `autonomo/ideas/competencias-r.html`; informe, no toca la app |

**Encargo `eco-calibra-a`** · tipo: arreglo del motor (técnico; a `main` con los jueces en verde) · aprobado el 27/10/2026
- Qué quiero: la opción A entera del informe: (1) la AI y la AD suman su contracción a la pasiva; (2) el freno de las
  venas pulmonares, sin reflujo de ~500 mL/s; (3) e′ que cambia con la relajación de cada forma; (4) HP crónica a
  fondo sin aplastar el VD ni pasar del tope del dibujo; (5) a fondo, E nunca 0. Y los dos jueces: «paciente posible
  del Doppler» por forma (E/A, E/e′, S/D, TAPSE, velocidades) y cada forma al 100 % sin el aviso de recorte.
- **Hipertrofia**: grado I, grado II o mando de I a II lo **decide el profesor** (potente, modo diseñar) antes de
  construir, con su fuente (Nagueh 2025), y lo escribe en el plan.
- Cifras objetivo: las del informe, con su página. Lo que el informe dejó sin cifra se busca y se cita (REGLAS §1.15);
  si no aparece, hueco con nota, nunca inventado. Las discrepancias (LVEI >1 frente a >1,1; DT de Mukherjee) con nota.
- Lo que NO quiero: tapar una cifra mala con el dibujo; tocar otras formas fuera de la lista; romper las pruebas de la
  eco (`node --test 'js/modules/eco/pruebas/*.test.mjs'`, que se recalibran con su fuente, no se borran).
- Hecho: las 9 formas a 0, defecto y 100 % dentro del «paciente posible» (tabla con `calibra-tabla.mjs`), los dos
  jueces en `jueces.mjs --eco` en verde, la hipertrofia enseña E/A <1 si el profesor elige grado I, parte.

**Encargo común de las filas 10-16 (Plan Marino 100 %, B-035, aprobado por el usuario el 28/10; dudas resueltas por el
Consejo de Ministros, `autonomo/consejo/2026-10-28.md`)** · tipo: bloque (M5)
- Qué quiero: las 155 fichas de Marino con Texto | Mayéutica | Estudiar, ruta del bloque y «Para profundizar»; los
  modelos que faltan (pulmón con respirador, hepatocito, termostato, cráneo vivo, unión neuromuscular, eje hormonal).
- Cómo: cada bloque, sus 5 pasos y como mucho 4 paradas del usuario (REGLAS §4.3); un grupo de fichas o un modelo por
  sesión; encadenadas: al cerrar, si el día va por debajo de ~15 M, el director abre la siguiente fila con
  `create_session`. La cobertura del bloque siguiente puede hacerse durante una parada (solo informe, «provisional»).
- Gobierno: cada tarea, con presupuesto (Interior) revisado y recortado por Hacienda antes de gastar, y «Cuentas» en el
  parte; comparecer si se pasa >25 %. Las maquetas de los modelos nuevos, del Ministerio de Educación (2-3 por modelo).
- Lo que NO quiero: tocar la eco (el motor del latido espera a B-039), el PIF o El Libro Azul; pasar de ~15 M al día; dos
  sesiones de Marino a la vez; empezar un bloque sin el anterior aprobado por el usuario.
- Fuentes: los PDF de Marino en `docs/` con su página (`js/data/libros-indice.js`).
- Hecho: el del Objetivo M5 (jueces `--ficha`, `--modelo`, topes y móvil; auditor; profesor ≥8, meta 8,75; PR con «Ver en
  el móvil» en la última parada de cada bloque) y el contador «N de 155» en el parte de cada sesión.

**Encargo `educacion-pionera`** · tipo: informe con maquetas (no toca la app) · B-040, encargo fijado por el Consejo el
28/10 (acta `autonomo/consejo/2026-10-28-2.md`)
- Qué quiero: que la app sea pionera en estudiar con modelos vivos y preguntas socráticas (la IA diseña; la app no
  conversa). Tres fases, una sesión cada una: (1) investigación (sonnet ×2: `/literature-review` + `/claim-check`, y
  `/ingenieria-reversa` de 2-3 webs que se abran) con la evidencia y su página; (2) diseño y rúbrica (profesor, Fable,
  skill `/mayeutica`); (3) tres maquetas HTML en `autonomo/maquetas/educacion/` y su juicio.
- Maquetas: **A** predicción-observación-explicación en el shock vivo (ficha de tipos de shock) · **B** error productivo
  en el capilar vivo (el residente trata sin guía, se pasa, sello de paciente real, después la guía) · **C** entrelazado
  y repaso espaciado en el río y mar (caso de cristaloides que cruza con la hemorragia clase II + 5 preguntas de días
  atrás). Cada una: 1 ficha, 1 caso completo, ≤6 pantallas a 390 px, con A/B/C al final.
- Se mide: rúbrica §7-§8 con 3 criterios nuevos (predecir antes de ver; explicar el porqué; error con consecuencia y
  después enseñanza), meta 8,75; y la prueba de 3 días con el usuario (dos fichas gemelas, 6 preguntas de transferencia).
- Repaso espaciado: el usuario permite (28/10) guardar la **fecha del último intento** en el registro de aciertos y fallos
  que ya existe (`CLAUDE.md` §2); nada más.
- Lo que NO quiero: cifras sin página; texto libre en las respuestas (solo los tres formatos de §8); guardar nada más
  en las maquetas; tutor que conversa; otra librería; copiar webs ajenas.
- Gobierno: Hacienda revisa cada fase (pasa de 2 M), sin recortar la calidad de las maquetas. ≈6 M, tope 8 M.
- Hecho: página para el móvil (Artifact) con el diagnóstico, la evidencia, las 3 maquetas y la propuesta de rúbrica +
  parte; el usuario elige el 04/11.

**Encargo `mayeutica-pestana`** · tipo: arreglo de interfaz (técnico, a `main`) · Consejo de Ministros, 28/10/2026
- Qué quiero: en cada ficha con Mayéutica, el interruptor pasa a **Texto | Mayéutica | Estudiar**. «Mayéutica» abre
  directamente la guía socrática (los mismos datos `guia` de `js/data/mayeutica/*.js`, el mismo motor
  `core/mayeutica-motor.js`); al acabar, «Sigue en Estudiar → Examínate». Comparte resultados con el paso Piensa (si
  la haces en un sitio, sale hecha en el otro). Estudiar se queda como está. En toda la app (las 42 fichas lo heredan
  sin tocar sus datos).
- Para qué: estudiar; el usuario la buscó en la FA y estaba escondida tras «Estudiar → Piensa».
- Modelo «así sí»: el botón «Mayéutica» del ácido-base vivo (`js/modules/nefrologia/acidobase-vivo.html`).
- Lo que NO quiero: quitar la guía de «Piensa» (quitar contenido es del usuario); duplicar datos o preguntas; un
  listener nuevo por módulo; que los tres botones desborden a 360 px.
- Presupuesto: constructor sonnet 30 pasos / 0,5 M · juicio corto del profesor (solo §8 y móvil) 0,2 M · director.
- Hecho: `jueces --ficha` de una ficha de cada especialidad con Mayéutica (Fundamentos, Merino HEMATO, Merino
  Cardiología) a 390 y 360 px; prueba `mayeutica-fichas` ampliada con «abrir la pestaña y contestar una guía».

**Encargo `b3-paso4`** · tipo: bloque (M5) · aprobado el 27/10/2026
- Qué quiero: la **opción A** del informe (las 17 piezas nuevas, ≈36 M, 10-12 sesiones), **elegida por el usuario el
  27/10** (sustituye a «que elija el profesor»: ya no hace falta ese paso). Se construye por grupos de fichas, una sesión por modelo o grupo (REGLAS §4.7),
  respetando el límite de gasto diario.
- Lo que NO quiero: pasar del límite de gasto del día.
- **Encadenado (27/10, noche, «sí a todo»)**: un grupo por sesión, en el orden del plan (1 → 6), siempre en la rama
  `auto/b3`. Al cerrar un grupo, si el gasto del día (`gasto.mjs`, todas las sesiones) va por debajo de ~15 M, el
  director abre el siguiente con `create_session` (source_url https://github.com/alvariitoSW/fiebres-neutropenias,
  prompt «/plan-socialista b3-paso4»); si no, lo deja para el aviso de la mañana siguiente. Nunca dos grupos a la vez.
  Al acabar el grupo 6 **ya no se para** (Plan Marino 100 %, 28/10): sigue con `b3-bradi` y el pulmón (filas 10-12 del Objetivo M5); la parada 3 llega con `b3-cierre`. Meta: grupos 2-6 hechos el 31/10.
- Hecho: el de las paradas del bloque `b3` (parada 3: el bloque entero, con el usuario).

**Encargo `competencias-r2r5`** · tipo: informe (no toca la app) · aprobado el 27/10/2026
- Qué quiero: R2, R3, R4 y R5 en el mapa de `competencias-r`, con lo que la app ya tiene para cada competencia
  (✅ / 🟡 / ❌, con enlace).
- Fuentes: el BOE y CoBaTrICE no se abren desde el entorno y el usuario no los pasará. Buscar otras que sí se abran
  (SEMICYUC, ESICM, itinerarios formativos de Medicina Intensiva publicados por hospitales docentes) y citarlas con
  URL literal. **Lo que no tenga fuente va marcado, a la vista, como «propuesta, sin fuente oficial»** (decisión del
  usuario del 27/10, excepción acotada a este mapa).
- Lo que NO quiero: presentar una propuesta como si fuera el programa oficial; construir nada en la app.
- Hecho: página actualizada (mismo Artifact), parte y fila en `autonomo/SESIONES.md`.

## Objetivo P2 · Preparar lo siguiente mientras se termina Marino (aprobado el 27/10/2026, noche)

El usuario, el 27/10: prioridad Marino → El Libro Azul → webs e ingeniería inversa y modelos vivos → pulir la eco →
PIF rehecho con lo nuestro. «Sí a todo» al calendario hasta el 01/11. Dos informes baratos, sin tocar la app, a
`main`, con página para el móvil y parte. Programados para el 31/10.

| # | Clave | Qué | Estado | Nota |
|---|---|---|---|---|
| 1 | `azul-cobertura` | El Libro Azul: qué cubren ya Marino y los modelos vivos, capítulo a capítulo, y el plan por bloques (como el Objetivo M5) con su gasto | pendiente (31/10) | B-004. Secciones I-X en `docs/` |
| 2 | `radio-informe` | B-034: temario corto del PIF de Radiología (tórax y neuro) para estudiar y para la guardia, con lo de Radiology Assistant y NavRad | en revisión (2026-10-30) · informe: https://claude.ai/artifact/YQhCE4FPehYhuAboQcg8Ka · Consejo 30/10 (3.ª), acta `autonomo/consejo/2026-10-30-3.md`: temario 4 + 3 fichas; parte `2026-10-30-radio-informe.md` · el usuario eligió el 30/10: mínimo ya y «Lee esta placa» (→ `radio-baratas`) | Encargo en la bitácora (B-034) · **Ley de Ciencia (29/10, art. 4)**: recibe las ideas de los 6 informes de radiología (lista en el acta); sin la lista de 64 hallazgos de NV-Reason; sí la pregunta «¿qué no puede ver esta IA?» |
| 3 | `eco-reforma` | **B-039 · Reforma integral de la eco**: informe con **maquetas visuales** de cómo separar el motor del corazón y el de la imagen, y del plan de la reforma | hecha (30/10) · informe: https://claude.ai/artifact/BsV8RZpH6De3RcxhirNr7i (maquetas en `autonomo/maquetas/eco-reforma/`; parte `2026-10-30-eco-reforma.md`); **el usuario eligió la A el 30/10** (dos motores con contrato, 20-26 M; «la C también está bien»); three.js no (no lo eligió: CLAUDE §2 sigue). La obra la hace `mv-eco` | Aprobado por el usuario el 28/10 (Consejo, recomendación). 4-6 M (gastado 3,5 M). La decisión de arquitectura, después, es del usuario. **Añadido por el Consejo (28/10, 3.ª)**: presenta three.js como una opción más, con su peso y coste · **Ley de Ciencia (29/10, art. 1)**: los 8 informes de eco, como un solo expediente; la decisión de motor sigue siendo del usuario · **Leer también** `autonomo/ideas/ingenieria-inversa/anatomy-atlas-pridgen.md` (29/10): cifras medidas del 3D en el móvil (65 MB y 192 MB de memoria con el cuerpo entero; tórax + abdomen ≈19 MB) para la decisión del motor |
| 4 | `eco-calibra-b` | Los 3 huecos de `eco-calibra-a`: TEP con escalón submasivo → masivo, shock cardiogénico coherente y DT de la hipertrofia grado 1 | absorbida por `mv-eco` (30/10): la opción A arregla en el motor el TEP, el shock cardiogénico y la e′ | (Consejo, 28/10, 3.ª). ≈3,5 M, tope 4 M. Acta `autonomo/consejo/2026-10-28-3.md` |
| 5 | `capilar-transfundir` | Arreglo §1.14: tope con fuente y sello visible en el mando «Transfundir» del capilar vivo | pendiente (30/10: el usuario aprueba las maquetas de Educación, también la B; usa su sello) | (Consejo, 28/10, 3.ª). ≈0,5 M. Si gana la maqueta B, usa su sello |
| 6 | `reglas-30-10` | Las 4 reglas y los 4 ahorros aprobados el 30/10, a REGLAS y a las skills (ver encargo) | hecha (30/10) · REGLAS §4.14; parte `2026-10-30-reglas-30-10.md` | Técnica: directo a `main` con jueces. ≈0,3 M |
| 7 | `mejoras-30-10` | Lo visto de paso del 29-30/10, aprobado: shock vivo (cambiar de paciente 1-3 s, ECMO + Impella con FC 56 y presión de pulso 1, edema sin equilibrio), glomérulo con PAM 220 (FG 163), pruebas `mayeutica-fichas.mjs` con `MAY_SOLO` y `shock-mide.mjs` | pendiente (el shock vivo, tras fusionar el `b3`: motor compartido; las pruebas y el glomérulo, ya) | Técnica: directo a `main` con jueces. Hacienda fija el gasto |
| 8 | `formula-juez` | B-042 · Juez que recalcula cada renglón «fórmula → tus números → resultado» (`js/core/formula.js`) leyendo los renglones pintados, con el mismo redondeo | hecha (30/10) · `jueces.mjs --formula` (`autonomo/jueces-formula.mjs` + trampa); arregló la DO₂ del capilar y el GC del Doppler; parte `2026-10-30-formula-juez.md` | Aprobado por el usuario el 30/10 («como dice el Consejo»; acta `autonomo/consejo/2026-10-30.md`). Técnica: directo a `main` con jueces. ≈0,5-0,8 M |
| 9 | `compara-formulas` | B-042 · Notas «Compara» (la misma fórmula en otro sitio), con enlace cruzado en las dos direcciones: Poiseuille del catéter ↔ resistencia de un vaso; Fick (GC ↔ CaO₂/DO₂ del capilar) | hecha (30/10) · PR #38 fusionada por el Consejo (6.ª) con jueces en verde; parte `2026-10-30-compara-formulas.md` | Aprobado el 30/10 (Consejo). Glomérulo (🟡) solo por enlace, sin tocar su código; Laplace fuera. ≈0,8-1,2 M |
| 10 | `capilar-desglose` | B-042 · Tocar la pieza del capilar vivo → tarjeta fija bajo la escena con `pintarFormula` + curva SVG común con punto vivo (piloto) | pendiente (tras `capilar-transfundir`) | Aprobado el 30/10 (Consejo). ≈2,5-3,5 M. Capilar 🟢 |
| 11 | `hoja-formulas` | B-042 · Hoja de fórmulas de guardia: acordeón en Sobrevivir a la UMI, alimentado de los mismos datos, y en el buscador | pendiente (más adelante, tras `capilar-desglose`) | Aprobado el 30/10 (Consejo). ≈3-4 M. Preguntas con cifras del modelo: aplazadas tras `educacion-app` |

**Encargos B-042 (Atlas of Physics)** · aprobados por el usuario el 30/10/2026 («como dice el Consejo, ahora que empiecen a construirlo»). Informe https://claude.ai/artifact/GxMeNNH8AV8ReEvUVkTAtH, notas `autonomo/ideas/ingenieria-inversa/atlas-of-physics.md`, acta `autonomo/consejo/2026-10-30.md`.
- `formula-juez` · tipo: arreglo (técnico). Qué: un juez (en `jueces.mjs` o `autonomo/pruebas/`) que en cada modelo que usa `pintarFormula` (capilar, río y mar, glomérulo, filtro, Doppler del eco) lee los renglones pintados (`.fml-n`, `.fml-s`), evalúa «tus números» y comprueba que dan el resultado mostrado con el mismo redondeo (§7.10). No toca la app. Hecho: el juez en verde en los 5 modelos, y en rojo si se altera a mano un resultado.
- `compara-formulas` · tipo: visual (mejora). Qué: nota «Compara» (frase corta + botón `data-especialidad`, en las dos fichas) para Poiseuille (catéter vivo, `mar-poiseuille`) ↔ resistencia de un vaso, y Fick (gasto cardíaco) ↔ CaO₂/DO₂ del capilar; el glomérulo solo como enlace. Abrir cada ficha antes de enlazar (§7.1): sin fórmula con fuente en los dos lados, no hay nota. Lo que NO quiero: tocar el código del glomérulo (🟡) ni el del eco (🔴); Laplace. Hecho: jueces `--ficha` de las fichas tocadas en verde.
- `capilar-desglose` · tipo: visual (piloto). Qué: tocar una pieza del capilar vivo abre una tarjeta fija bajo la escena (frase de mecanismo con cita + 2-4 renglones con `pintarFormula`, sin recalcular) y una curva SVG común en `js/core/` con un punto que corre al mover el mando (CaO₂ frente a Hb). Sin tapar la escena a 390 px. Hecho: `--modelo capilar-vivo` en verde y profesor ≥8.
- `hoja-formulas` · tipo: visual. Qué: acordeón `.accordion-btn` en Sobrevivir a la UMI con cada fórmula de la app, su fuente y enlaces a cada ficha y modelo, desde los mismos datos (sin copiar cifras), y su entrada en el buscador.

**Encargo `reglas-30-10`** · tipo: arreglo (reglas) · aprobado por el usuario el 30/10/2026 («aprobadas las 4 reglas nuevas»; «los puntos 4 y 5 de propuestas las acepto todas»)
- Reglas: (1) antes de la ingeniería inversa de una web, probar también el dominio de su `<iframe>`; (2) las celdas
  «diagnóstico» de J1 de la eco fallan si la cifra queda fuera de todos los rangos de la guía; (3) `version.mjs` falla si
  hay marcas de conflicto; (4) un mando nuevo de un modelo con muchos pacientes, solo en los que usa la ficha, salvo que
  se prueben sus topes en todos.
- Ahorros de Hacienda: (5) las cifras de los casos se leen en el monitor de la app (`g4-app-cifras.mjs`), nunca con el
  programa del motor, y las herramientas de cifras importan la función de lectura de la app; (6) un estado nuevo de un
  modelo vivo por encargo, presupuesto «estado nuevo con barrido» sonnet 30 pasos / 0,7 M, prueba larga al final; (7)
  pieza de motor: antes de la interfaz, script de ≤10 pasos que compruebe la dirección de la cifra frente a la fuente;
  (8) presupuestar por lo que falta en el código (`grep` de cada estado, lupa y escenario; estado 0,5 M solo si su lupa
  o su tipo ya existen, si no 1,2 M).
- Hecho: cada regla en REGLAS (§4.11 o donde toque) y en la skill que la aplica; (2) y (3) con su prueba en los jueces.

**Encargo `azul-cobertura`** · tipo: mapa (informe) · aprobado el 27/10/2026
- Qué quiero: por cada capítulo de El Libro Azul (1-61), qué ficha de Marino, Merino o qué modelo vivo ya lo explica
  (y en qué estado), qué es nuevo y qué modelo vivo nuevo haría falta; agrupado en bloques con su orden y el gasto
  estimado de cada uno (`gasto.mjs` y presupuestos del tablero).
- Para qué: que El Libro Azul arranque en cuanto se cierre Marino, sin repetir lo que ya está (se enlaza).
- Lo que NO quiero: construir nada; fusionar contenido de los dos libros (CLAUDE.md §2: se enlazan).
- Fuente: `docs/libro-azul-*.pdf` (índices; desplazamientos en la bitácora §3), `autonomo/bloques/*/cobertura*`.
- Hecho: página para el móvil con el mapa y los bloques + parte. Juez: ninguno (lo mira el usuario).

**Encargo `radio-informe`** · tipo: plan (informe) · aprobado el 27/10/2026
- Qué quiero: B-034 hecho propuesta: los temas imprescindibles de Rx de tórax de UCI y TC de cráneo urgente para un
  R1 (de los objetivos de `js/data/pif-rotaciones.js`), qué ficha y qué tarjeta de guardia tendría cada uno, qué
  ideas de Radiology Assistant y NavRad entran (de sus informes del 23/10, sin abrir las webs) y el gasto.
- Lo que NO quiero: mil fuentes (una o dos por tema, de acceso libre); copiar textos o figuras; construir nada.
- Hecho: página para el móvil + parte; el usuario elige.

**Encargo `eco-reforma`** · tipo: informe con maquetas (no toca la app) · aprobado por el usuario el 28/10/2026 (B-039)
- Lo que dijo: «del informe de la eco espero mucho y espero maquetas visuales que quiero ver bien: cómo separar esos
  motores y cómo hacer la reforma integral».
- Qué quiero: (1) ingeniería inversa de https://www.pulmonarypocus.com/phone-cp-sim (y lo ya estudiado: EchoSuite,
  anesthbeta, `autonomo/ideas/ingenieria-inversa/`), probando antes que la web se abre; (2) un mapa de quién usa hoy
  `js/modules/eco/motor.mjs` (corazón 3D, shock vivo, atlas, imagen de eco, Wiggers) y qué sale imposible a fondo
  (TEP, HP crónica: captura del usuario del 28/10); (3) las opciones A (dos motores con contrato), B (un motor con
  topes) y C (mezcla), con qué se aprovecha, qué se rehace, el gasto y el orden; (4) **2-3 maquetas visuales** del
  Ministerio de Educación (departamento de arte e ideas, método `/anatomy`): cómo se vería cada motor por separado,
  el contrato entre ellos y la misma patología (TEP grave) en las dos piezas, con cifras de paciente real.
- Lo que debe mirar para que la eco enseñe (dictamen de Educación): los 3-5 signos de cada forma con cifra y página
  (Lang 2015, Nagueh 2025, Mukherjee 2025, en `docs/`); que sobrevivan las frases vivas y los «Compruébalo en…»; topes
  de paciente real en cada extremo (conservar las 505 pruebas y J1-J2); qué fichas de Marino y del atlas quedarían sin
  explicar durante la obra.
- Lo que NO quiero: tocar la app; copiar código o imágenes ajenas; cifras sin página; elegir la opción (la elige el
  usuario: es arquitectura, `CLAUDE.md` §2).
- Gobierno: presupuesto de Interior recortado por Hacienda; 4-6 M (informe ≈1,5 M + maquetas).
- Hecho: página para el móvil (Artifact) con las maquetas y las opciones + parte; las maquetas en `autonomo/maquetas/eco-reforma/`.

**Encargo `eco-calibra-b`** · tipo: arreglo del motor (técnico; a `main` con los jueces en verde) · aprobado por el
Consejo el 28/10/2026 (3.ª reunión; el usuario: «que lo apruebe todo el consejo»)
- Antes de lanzarla: si el usuario elige con `eco-reforma` un motor nuevo, este encargo se reescribe sobre él.
- Qué quiero, en este orden (lo que más enseña a un R1, según Educación):
  1. **TEP con escalón**: hoy el defecto ya es extremo (FEVD 13 %, TAPSE 8,4; profesor 6/10). Que el mando pase por
     riesgo intermedio (submasivo: VD dilatado, sin hipotensión) antes del alto riesgo (masivo: hipotensión). Fuente:
     Marino, `docs/marino-2024-respiratory-management-caps22-26.pdf`, pdf 7 (sacar la página impresa con pdftotext).
  2. **Shock cardiogénico coherente** (el fallo al 100 %; profesor 5,5/10): hoy PCP 33 con E 35 (sale como fusión),
     e′ septal 2,0 cm/s, S pulmonar 1 cm/s, FEVD 11 % con PVC 6,4, Ar 2 cm/s con PCP 23. Que sea un «shock
     cardiogénico restrictivo» posible: e′ septal 3-4 cm/s (Nagueh 2025, `docs/nagueh-2025-funcion-diastolica-hfpef-ase.pdf`,
     p. 561) y el resto coherente con su fuente y página.
  3. **DT de la hipertrofia grado 1**: hoy ~420 ms (lo habitual en la docencia, 220-300) y e′ que sube al empeorar.
     **Solo con una fuente citable** (§1.15; la guía ASE/EAE 2009 no se abrió desde la red); si no aparece, hueco
     declarado y no se toca la cifra.
- Rejilla (REGLAS §4.11): el encargo trae los parámetros y rangos de cada pieza y el constructor la corre de una vez
  (`herramientas/barrido.sh` + `calibra-tabla.mjs`).
- Lo que NO quiero: ninguna cifra imposible (§1.14); que un arreglo empeore otra cifra de la tabla de la forma; citas
  «de memoria» con página; romper la prueba del balón (`motor.test`, llenado >38 mL, hoy a 38,05) sin decirlo.
- Hecho: notas del profesor de TEP y fallo ≥8; jueces de la eco y `node --test 'js/modules/eco/pruebas/*.test.mjs'`
  en verde; captura de cada forma junto a la eco real. Juez: los de la eco + el profesor.
- Gobierno: constructor sonnet, revisión del encargo barata (≈0,15 M), profesor para la nota. ≈3,5 M, tope 4 M.
- Fuente del encargo: `autonomo/partes/2026-10-28-eco-calibra-a-s2.md` («Para el usuario»).

**Encargo `capilar-transfundir`** · tipo: arreglo (técnico; a `main` con jueces) · aprobado por el Consejo el 28/10/2026
(3.ª reunión)
- Qué quiero: el mando «Transfundir» del capilar vivo hoy no tiene tope ni sello (choca con REGLAS §1.14). Tope con
  fuente y consecuencia visible de paciente real. Si el usuario elige el 04/11 la maqueta B, el sello es el suyo.
- Fuente: la de la maqueta B (`autonomo/ideas/educacion-pionera/diseno-b.md`: Hb ≥7 sin indicación, p. 8; el TACO no
  depende del número de unidades, p. 15).
- Lo que NO quiero: castigar «la 3.ª bolsa» (el sello castiga transfundir sin indicación); cifras sin página.
- Hecho: `node autonomo/jueces.mjs --modelo capilar-vivo` en verde; probado a 390 y 360 px. ≈0,5 M, sonnet.

## Objetivo C · Carril 2: modelos vivos con webs y guías (aprobado por el usuario el 29/10/2026)

El usuario, 29/10: «primero terminar Marino y segundo todo el tema de los modelos vivos con [...] las páginas web [...] y
las guías», en paralelo mientras Marino se termina. Acta `autonomo/consejo/2026-10-29-carriles.md`; regla REGLAS §4.13.
**Prioridad nueva** (el usuario: «lo que diga el Consejo de Ministros»): **Marino → modelos vivos (carril 2, con el simulador
de eco) → El Libro Azul → menú, Guardia, PIF y Radiología**. El Libro Azul entra antes por los modelos: cada modelo del carril 2 cita
también su sección cuando trate lo mismo. Presupuesto: lo fija Hacienda por delegación (≈25-40 M estimados). Gasto
diario: ≈30 %, solo lo que Marino no use.

Semáforo (cambia al fusionar cada bloque a `main`): 🔴 shock, corazón eléctrico, receptor, pulmón con respirador, motor
de la eco · 🟡 agua, ácido-base, potasio, nefrona, glomérulo, filtro · 🟢 capilar, catéter, vaso, muralla, telar,
inmersión, receptores animados y los modelos nuevos (arteria culpable, taponamiento, VExUS).

| # | Clave | Qué | Estado | Notas |
|---|---|---|---|---|
| 1 | `mv-papel-pulmon` | Fase A: informe y maqueta de mejoras del pulmón con respirador (VentLoop, clases de Antaa, Techartist; Marino 22-30, El Libro Azul IV) para que `b3-pulmon-app` las lea | pendiente (fase A, ya) | 🔴: sin código. ≈1-2 M |
| 2 | `mv-papel-shock` | Fase A: shock cardiogénico en un IAM en 3 pasos y veredicto de 4 tipos de shock (Impella-Antaa, EchoSuite-2, AngioView-2 idea 8; Marino 14-17, Hernández 2026, ESC 2023 SCA) | pendiente (fase A, ya) | 🔴: sin código; se suma a `shock-scai`. ≈1-2 M |
| 3 | `mv-papel-ritmo` | Fase A: ECG que se pinta bajo cada ficha y «construye un ECG» (RitmoLab, Ventriculus; ESC 2019, ESC 2021, López Ramírez) | pendiente (fase A, ya) | 🔴: sin código; alimenta `pif-cardio`. ≈1-2 M |
| 4 | `pif-cardio-minimo` | El mínimo de Cardiología para la rotación (ya validado en el Objetivo L) | pasa al carril 2 | Ver Objetivo L, fila 1 |
| 5 | `mv-arteria-culpable` | Modelo nuevo: arteria culpable (Culprit, AngioView-2; ESC 2023 SCA, Wagner 2009, Thygesen 2018), 2-3 maquetas y después la app | pendiente (fase B: cuando `b3` marque el paso 4 hecho) | 🟢. Absorbe `arteria-culpable` del Objetivo L. ≈7-8,5 M |
| 6 | `mv-verdes` | Fase B: una mejora con caso y preguntas en capilar (respondedor a volumen), telar (CID con la puntuación ISTH) y receptores animados | pendiente (fase B) | 🟢. ≈1-2 M cada una |
| 7 | `mv-fase-c` | Fase C: shock, corazón eléctrico (ECG vivo), receptor y pulmón al fusionar el bloque 3; agua y ácido-base al fusionar el bloque 4 | aparcada (al fusionar cada bloque) | Lee los informes de la fase A |
| 8 | `mv-eco` | **El simulador de eco entra en el carril 2** (el usuario, 29/10: «yo creo necesario meter el simulador eco en el carril de modelos vivos»): la reforma de la eco según el motor que el usuario elija con el informe `eco-reforma` (01/11): pulir el motor actual (≈10-12 M) o motor y dibujo nuevos (≈18-28 M; three.js solo si él lo elige, CLAUDE.md §2). Absorbe `f0-eco-*`, `eco-sueltas`, `f2-ete` y las calculadoras de `guardia-shock` que viven en la eco | aparcada (último paso del carril 2: cuando el bloque 3 esté en `main`). **Motor elegido el 30/10: opción A** (dos motores con contrato, `autonomo/maquetas/eco-reforma/plan.md`), presupuesto 20-26 M, sin three.js; absorbe `eco-calibra-b`, los paquetes A y B de `tee-inversa` (30/10) y lo visto de paso del informe (VD/VI 0,72 en la HP crónica, la VCI fuera del motor, maquetas y herramientas de `eco-mega` que importan el motor) | 🔴 hasta fusionar el bloque 3 (motor compartido con el shock). Pasa por delante de El Libro Azul. Presupuesto: Hacienda. Pruebas de la eco y del shock en cada cambio del motor |

## Objetivo L · Ley de Ciencia (validada por el usuario el 29/10/2026)

El usuario, el 29/10: «Valido la ley entera, y valido todo para que el congreso empiece a implementar la ley de
ciencia». Acta `autonomo/consejo/2026-10-29-ley-de-ciencia.md` · página https://claude.ai/artifact/YbR2Z9chFJBaye1HvtV9e3.
«Valido todo» incluye las opciones recomendadas: el mínimo de Cardiología para noviembre y la profundidad en el grafo
del corazón eléctrico (una sola verdad, sin segundo motor). Sigue la prioridad del 27/10 (Marino → El Libro Azul →
webs → eco → PIF): solo el mínimo de Cardiología y la lámina del pulmón se adelantan. Cada tarea, con presupuesto de
Interior, Hacienda en las de ≥2 M y «Cuentas» en el parte.

| # | Clave | Qué | Estado | Notas |
|---|---|---|---|---|
| 1 | `pif-cardio-minimo` | Mínimo para la rotación de Cardiología: esqueleto del PIF con los 6 objetivos, «léelo en orden», tabla vaso → ECG → pared → complicación (una vez en `js/data/`) y 6-8 preguntas «predice el ECG» (REGLAS §8) | pendiente (**aplazada al 31/10**: la sesión de las 15:27 UTC del 30/10 no empezó porque el día ya iba en ≈34 M, por encima del aviso de ~15 M; sin gasto, sin rama) | ≈3-3,5 M, sonnet; profesor corto. Fuentes en `docs/`: López Ramírez 2012, ESC 2023 de SCA, Wagner 2009. La tabla la reutiliza `arteria-culpable`. Rama `auto/pif-cardio` (PR en borrador; parada con el usuario) |
| 2 | `eco-sueltas` | Ficha «¿Qué ETE pido y qué veo?» (Hahn 2013), cartilla válvula abierta en cada fase y postura de la sonda guardada en el enlace (hash, sin `localStorage`) | aparcada (tras la decisión de motor de `eco-reforma`) | ≈2 M, sonnet. Ideas 1, 5 y 6 de `anesthbeta.md` §6 |
| 3 | `arteria-culpable` | Fase 1: `culprit-a` + tabla de `angioview-2` idea 2 + `culprit-b` | aparcada (tras Marino y El Libro Azul) | ≈7-8,5 M. La idea 1 de AngioView (leer un informe de cateterismo) sigue con `f2-angio` (Di Mario). Fase 2, tras `eco-reforma`: `f2-coronarias` con angioview-2 ideas 4-6 y 8, culprit C/D y eco C2/P3 |
| 4 | `guardia-shock` | Parada 1: cadena VCI → PAD → VS → GC → E/e′ → VExUS (echosuite-2 ideas 1, 3 y 7) con «piensa antes» por eslabón; parada 2: veredicto de shock con «combinación incoherente» (idea 5) | aparcada (tras Marino y El Libro Azul; antes `f0-cifras`) | ≈14-18 M. Maqueta antes (potente). Puerta «Guardia» aprobada el 25/10. Fuentes: Lang 2015, Mukherjee 2025, Nagueh 2025, Taub 2025, Manual UMI, VExUS; discrepancias con nota. Sin «mi paciente en la eco» (idea 4) · Parada 2: las tres preguntas de selección del soporte (¿es el VI?, ¿hay hipoperfusión?, ¿se salva el cerebro?) (Consejo, 29/10, 2.ª) |
| 5 | `pif-cardio` | Bloque con 3 paradas: (1) esqueleto completo, «léelo en orden» y `ecg-guardia`; (2) 12 derivaciones con **profundidad en el grafo** (`ecg-vector-*`), ECG vivo arriba de cada ficha y preguntas que dibujan su ECG; (3) laboratorio (`arritmias-*`) con «Construye un ECG». Después, los objetivos con PDF | aparcada (al final: tras Marino y El Libro Azul) | ≈21-22 M (18,7 de B-033 + 2-3 de Ventriculus − 1). Plan: `autonomo/ideas/ingenieria-inversa/pif-cardio-final.md` y `autonomo/planes/ecg-plan.html`. Cifras de Ventriculus solo como pares de prueba. PDF del 29/10 ya en `docs/`: `esc-2023-endocarditis.pdf` (PDF + 3947) y `esc-2025-miocarditis-pericarditis.pdf` (PDF + 3951); falta la semiología cardíaca |
| 6 | `radio-baratas` | Mínimo del PIF de Radiología (Consejo, 30/10, 3.ª): `f0-ra-biblio`, rótulos SVG sobre las Rx y TC de Merino Neumología, **ficha «Placa portátil de UCI, de dentro afuera»** (guion propio con enlaces; tarjetas: punta del tubo, punta de la vía, sonda en el estómago) y **TC de cráneo en 5 preguntas** (`initSiNoWizard`, con «¿qué no puede ver esta IA?») | en curso: **día 1 hecho** (30/10: módulo «Radiología · PIF», biblio y cuaderno de la placa con 3 tarjetas; 1,9 M; parte `2026-10-30-radio-baratas.md`; PR #39 **fusionada** por el Consejo del 30/10, 6.ª, con jueces en verde) · **día 2** rótulos + TC de cráneo (≈2,5-3,5 M) desde el 31/10 y **día 3** «Lee esta placa» (≈2-3 M) al día siguiente, pendientes: carril 2, sesión nueva desde `main`, misma receta del día 1; nunca adelanta al grupo 6 del `b3` (Consejo 30/10, 6.ª) · el usuario, «sí a ambas»: el mínimo ya, por el carril 2, **y** «Lee esta placa» | ≈7,5-10 M en total, sonnet (mínimo ≈5-7 M + «Lee esta placa» ≈2-3 M; esta, sobre el modelo `js/modules/pif-cardio/ecg-lector.js`: tocar la punta del tubo o de la vía en la figura). Carril 2 (≤30 % del día): puede repartirse en 2-3 días. Visor de cortes, NV-Reason y `f4-*`, aparcados (casos con licencia) |
| 6b | `radio-fichas` | Resto del temario del PIF de Radiología: neumotórax y derrame, patrones y edema, intro a la TC, ictus isquémico o hemorrágico, HTIC y hernias | aparcada (tras El Libro Azul) | (Consejo, 30/10, 3.ª). ≈7 M, sonnet. Sin cifras de RA/NavRad sin fuente; hipoxia cerebral y catéteres, aparcada sin fuente |
| 7 | `estudio-04-11` | Candidatas para la parada de Educación: receta de sala (alternativa a la maqueta A, en un solo modelo, con la apuesta antes del gesto), anillo de escala opcional, recap de 2-3 preguntas al empezar, no repetir ficha seguida, tabla error → remediación | pendiente (parada del 04/11) | ≈3-4 M si se eligen. Ninguna persistencia nueva (CLAUDE.md §2) |
| 8 | `radar-hoja` | Refrescar `autonomo/radar/HOJA-DE-RUTA.md` con la Ley de Ciencia (sin revisar desde el 25/10) | hecha (29/10, en `main`) | ≈0,2 M, la bitácora, sin agentes |
| 9 | `shock-scai` | Modelo de shock (ya en `main`): estadio SCAI A-E (ESC 2026 de IC, parte 1, pdf 44), nota y pregunta de ECMO + Impella (Marino caps. 14-17, pdf 48), caso del fallo del VD (Marino cap. 16, desde pdf 39) y, solo si hay fuente abrible, la pregunta de la succión; SCAI enlazada a la de IC, sin duplicarla (Consejo, 29/10, 2.ª) | pendiente (tras `b3-paso4`, antes de `b3-cierre`) | ≈1,5-2,5 M, sonnet; contenido del bloque 3 (`auto/b3`), cargado a `b3-paso4`. Ideas de `impella-antaa.md`; nada de la charla es fuente. Si llega DanGer Shock, nota de fuentes frente a Marino p. 48 |
| 10 | `tecnicas-capitulos` | B-043 · «Procedimiento en capítulos» en Técnicas R1, empezando por la **vía venosa central**: 6-10 pasos con nombre, una frase y una trampa en negrita, barra de tiempo y saltar a un paso (2D con Motion), una pregunta por paso (REGLAS §8) y capas con deslizador («¿qué atraviesa la aguja?») | aparcada (tras Marino y El Libro Azul, como el resto del Objetivo L) | Aprobada por el usuario el 29/10 («1- sí, 2- por la primera»). Idea de Anatomy Atlas de Pridgen (https://claude.ai/artifact/5n2mC3NP4MUm4SsPoWed9C; notas `autonomo/ideas/ingenieria-inversa/anatomy-atlas-pridgen.md`); sin su código ni three.js. Fuente: Marino caps. 1-4 y Manual UMI con página. Encaja con el catéter vivo. Maqueta antes. Coste por estimar al lanzarla (Interior + Hacienda) |

**Descartado por la ley (recomendación del Consejo, validada)**: three.js para el pulmón, LFM3 dentro de la app,
botón «Escuchar», NV-Reason-CT en el hospital (servidor), coronariografía animada antes del árbol SYNTAX y coaching de
sonda ETE. Los 23 informes cerrados no piden otra pasada; vivos: echosuite-2, angioview-2, navrad-2 y nv-reason-ct.

## Lo que aún no está aprobado

Vive en `autonomo/BITACORA.md` (skill `/bitacora`): lo apuntado que espera el visto bueno del usuario, lo que espera
un PDF o una decisión suya y las mejoras de lo que ya existe. **Una tarea entra en este tablero solo cuando el
usuario la aprueba** (con `/bitacora aprueba B-00N` o escribiéndola él aquí).
