# Tablero del plan socialista

Lo edita el usuario (orden, notas, límites), la bitácora (`/bitacora`: mete las tareas que el usuario aprueba y las
marca `hecha` al fusionarse su PR) y el director del plan (estados). Una tarea por línea, en orden de prioridad.

- **Límite por sesión:** 1 tarea, o una parada de un bloque (decisión del usuario, 25/10/2026, para ahorrar: el director
  relee su conversación en cada paso). La siguiente, en una sesión nueva que abre el propio director
- **Vueltas máximas por tarea:** 3 (constructor ↔ jueces). Una 4.ª solo si tras la 2.ª quedan **más de 3 fallos**
  (sumando graves, medianos y pequeños); nunca más de 4.
- **Parar si:** 2 tareas seguidas fallan o quedan bloqueadas
- **Límite de gasto por sesión:** el que fije el usuario (sin fijar todavía: no se programa una rutina nocturna sin él)
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
  0,9 M (0,98 M)
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
| 7 | `b3` | Bloque 3 (caps. 14-30 desde el 26/10: 26 fichas de Merino Cardiología y Neumología + 21 del pulmón con respirador) | en curso, ⏸ parado en la parada 1 (2026-10-23): maquetas v2 esperando al usuario; fichas en `auto/b3`. Informe y plan con gasto (26/10): https://claude.ai/artifact/Rw8ZKfAZdYgjBogGxuCP9w; el usuario contestó (26/10): maquetas v3, pulmón fusionado (3D), Fable para pensar y medir (ver paquete §4). Siguiente: maquetas v3 + cobertura del 3D | Paquete: `autonomo/bloques/b3/encargo.md` |
| 8 | `b1-guias` | Llevar «Ver en la ficha» y la explicación guiada (REGLAS §7.9-7.10) a los modelos del bloque 1 | hecha (2026-10-21) · 5 modelos, 314 pasos, en main (el ácido-base, en la bitácora) | Lo pidió el usuario el 20/10 para todos los modelos; mejora de lo existente: a main con jueces y auditor |

## Objetivo E · Mejorar el simulador de eco con lo que hacen otros

| # | Clave | Qué | Estado | Notas |
|---|---|---|---|---|
| 1 | `tee-inversa` | Ingeniería inversa del simulador de ETE de anesthbeta: entender cómo está hecho y traer a nuestro simulador todas las mejoras que se puedan | en curso, ⏸ parado en la fase 1 (2026-10-23): informe-propuesta esperando la elección del usuario, https://claude.ai/artifact/6N5ChQF3E82Ca7DoNqEfaU | Aprobada por el usuario el 23/10; va antes de seguir con el bloque 3 |
| 2 | `rea-echosuite` | Ingeniería inversa de EchoSuite (70 calculadoras de eco, simulador, aprendizaje): informe-propuesta | en curso, ⏸ parado en la fase 1 (2026-10-23): informe conjunto «Un paciente, todas las pruebas», https://claude.ai/artifact/T4WcxXWzjPGm911ShU3aiS | Aprobada por el usuario el 23/10 (B-009); fase 1 con REA o Playwright |
| 3 | `rea-angioview` | Ingeniería inversa de AngioView (proyecciones de coronariografía): informe-propuesta | en curso, ⏸ parado en la fase 1 (2026-10-23): informe conjunto «Un paciente, todas las pruebas», https://claude.ai/artifact/T4WcxXWzjPGm911ShU3aiS | Aprobada el 23/10 (B-010) |
| 4 | `rea-navrad` | Ingeniería inversa de NavRad Anatomy (visores de TC rotulados): informe-propuesta | en curso, ⏸ parado en la fase 1 (2026-10-23): informe conjunto «Un paciente, todas las pruebas», https://claude.ai/artifact/T4WcxXWzjPGm911ShU3aiS | Aprobada el 23/10 (B-011) |
| 5 | `rea-radiologyassistant` | Ingeniería inversa de The Radiology Assistant: informe-propuesta para la app y el PIF de Radiología | en curso, ⏸ parado en la fase 1 (2026-10-23): informe «Ritmo vivo y placa guiada», https://claude.ai/artifact/1GTkuwubZ22Hb9qu4PW4P5 | Aprobada por el usuario el 23/10 al pedir el informe |
| 6 | `rea-ritmolab` | Ingeniería inversa de RitmoLab (Farmacotips), ya accesible: informe-propuesta para el PIF de Cardiología, los modelos vivos (corazón eléctrico, motor) y la puerta «Arritmias» | en curso, ⏸ parado en la fase 1 (2026-10-23): informe «Ritmo vivo y placa guiada», https://claude.ai/artifact/1GTkuwubZ22Hb9qu4PW4P5 | Aprobada el 23/10; antecedentes en `docs/historial/cardiologia.md` («RitmoLab») |
| 7 | `rea-final` | Informe final de la ingeniería inversa (6 webs) + segunda pasada de NavRad con imagen | ⏸ parado (2026-10-23): esperando la elección del usuario. Final: https://claude.ai/artifact/3hnNvcEsvsotfViShnXLee · NavRad: https://claude.ai/artifact/2v4kHFM66eac8d5bYWZgtm | Pedido por el usuario el 23/10; sustituye a los informes parciales como documento de decisión |
| 8 | `rea-2` | Segunda pasada de ingeniería inversa de las 6 webs con `/ingenieria-reversa` v2, para el megaproyecto: uso real en la guardia de UCI y estudio | ⏸ parado en la fase 1 (2026-10-25): informe «La UCI en el bolsillo», https://claude.ai/artifact/6XfQibZ3H4NwgjUFMJhTdU | Pedido por el usuario el 25/10; 3 investigadores (eco, cardio, radiología) con el modelo barato |
| 9 | `radar` | B-012 · Radar: norte, registro, ficha de triaje y skill `/radar`; volcar lo del 23-25/10 | hecha (2026-10-26) · PR #28 aprobada por el usuario, en main | Va en la etapa A del plan de integración |
| 10 | `vuelta-modelos` | B-016 · Vuelta por los 14 modelos vivos: qué mecánica nueva encaja en cada uno | hecha (2026-10-25): PR #29; el usuario aprobó las 5 mejoras («me parece todo perfecto»), que pasan al Objetivo V |  Corta, de solo lectura; antes que B-015 |
| 11 | `eco-mega` | B-015 · Megaproyecto de la eco: modelo, imagen realista y lo mejor de las webs | en curso (2026-10-27): **paradas 1 y 2 hechas y en `main`** (imagen realista; anatomía, fisiología y patología: profesor 8,1-8,4, auditor 0 graves; PR #30). Siguiente: parada 3 (F3, F4, N1, P5, P6 y retoques de coste medio; ver parte del 27/10) cuando lleguen los PDF de los huecos | Empieza por una maqueta «antes / después» de la imagen |
| 12 | `inventario` | B-014 · Inventario de estudio de las ~724 fichas | hecha (2026-10-26) · PR #31, en main · informe https://claude.ai/artifact/894zY7AfqYQC3QWP1Yjxir | Corta, de solo lectura |
| 13 | `pulmon-respirador` | B-013 · Pulmón con respirador (modelo vivo) | fusionada en `b3` (2026-10-26, decisión del usuario: sub-bloque 3D) | Antes: bloque 4 de Marino. Propuesta de atajo (26/10, en el informe del `b3`): cobertura y maqueta M3 durante la parada 2 del `b3`; la presión del tórax (M8) hecha una vez para CPAP y respirador; el pulmón entra en la app a la vez que el 3C. Espera la elección del usuario |
| 14 | `bandeja` | B-017 · Bandeja del Radar: enlaces desde el móvil (issue #27) procesados a diario | necesita humano (2026-10-25): la tarea creada desde la sesión no tenía el repositorio; pausada. El usuario la crea desde la app con el proyecto elegido | Texto para pegar en `autonomo/radar/LEEME.md`; después, borrar `trig_01SJ6yy2dka8BFevHR5aCNnF` |
| 15 | `notas-meta` | B-023 · Llegar al 8,75 sin gastar de más: modelos, tokens y vueltas | hecha (2026-10-27): el usuario aprobó las 9 propuestas (R1-R9), que entran en `REGLAS.md` §4.8, el constructor, el profesor, la skill y el formato del parte; R1 automático va en `jueces-movil`. Informe https://claude.ai/artifact/2DyGXcvYEMTXfT85YZESDs · PR #33 | Corta, de solo lectura |
| 16 | `rea-eco` | B-024 · Ingeniería inversa de las webs de eco para un corazón más real (forma, paredes, valvas, latido) y referencias de eco reales de uso libre | hecha (2026-10-26): informe «Un corazón más real» v2 (plan de 13 encargos, ~24 M, `autonomo/ideas/ingenieria-inversa/corazon-mas-real-plan.md`), https://claude.ai/artifact/LPr9m96QTCK7D53wJ4vkcg; el usuario eligió y los PDF de la ASE ya están en `docs/`. Lo elegido pasa a la parada 2 de `eco-mega` | Va antes de la parada 2 de `eco-mega` (anatomía) |
| 17 | `eco-anatomia` | B-025 · Corazón real (anatomía, fisiología y patología): informe de ingeniería inversa con Fable 5.1 sobre las webs de eco ya estudiadas + plan socialista con su gasto estimado y optimizado | hecha (2026-10-26): informe https://claude.ai/artifact/TooB2RJcrwkf9CoFiPyqBi; el usuario eligió el núcleo, que entra en la parada 2 de `eco-mega` | Pedido por el usuario el 26/10; amplía `rea-eco` (no lo repite) y alimenta la parada 2 de `eco-mega` |
| 18 | `rea-culprit` | B-026 · Ingeniería inversa de Coronary Culprit (Cliff Reid): ocluir una coronaria y ver el ECG de 12 y la eco | hecha la fase 1 (2026-10-26): el usuario eligió la opción 1 (A + B en la Fase 1 tras Marino; C cuando la eco tenga coronarias; D tras C); falta el PDF de la ESC 2023 de SCA y el de ECG. Informe «Arteria culpable», https://claude.ai/artifact/Y6ewAZfAk5cPewnsnNcsAw; detalle en `autonomo/ideas/ingenieria-inversa/culprit.md` | Pedido por el usuario el 26/10; lo que se construya va después de Marino (Objetivo M5) |
| 19 | `jueces-topes` | Jueces automáticos de topes (REGLAS §1.14): que `node autonomo/jueces.mjs --modelo <clave>` lleve cada mando de un modelo vivo a su tope y repita cada acción (copiando `autonomo/bloques/b3/herramientas/limites-prueba.mjs`), y falle si no sale el sello o sale una cifra fuera de lo fisiológico | pendiente (aprobada por el usuario el 27/10, propuesta del parte `2026-10-27-b3-limites.md`) | Tipo `arreglo` (técnico, directo a `main` con los jueces en verde). Constructor sonnet. Antes, en los modelos vivos que ya están en la app |
| 20 | `jueces-movil` | Juez automático del móvil (REGLAS §4.8 R1): que `node autonomo/jueces.mjs --ficha/--modelo` falle a 390 y 360 px si la frase viva o el enunciado quedan bajo la barra de abajo, si la imagen sale de la pantalla al tocar sus mandos, si una frase sale cortada con «…» o si un rótulo baja de 9 px | en curso (2026-10-27; aprobada por el usuario el 27/10, R1 de `notas-meta`) | Tipo `arreglo` (técnico, directo a `main` con los jueces en verde). Constructor sonnet. Puede ir junto a `jueces-topes` |

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
| 5 | `monitor-comun` | B-022 · Monitor común en los modelos (capilar, eco, receptores, cama 7) | aparcada (aprobada 2026-10-25) | Se hace con el bloque 3 (su monitor común ya está decidido); después, llevarlo a los demás |

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
| 1 | `pif-ecg` | Fase 1 · Cuaderno «ECG y arritmias» en PIF → Cardiología, enlazado al corazón eléctrico | aparcada (espera PDF) | Falta el PDF de ECG básico de la rotación (01/11). En cuanto llegue, pasa a `pendiente`. La v3 del corazón eléctrico (`b3-ritmo-v3`) y su paso a la app (`b3-3c`) **ya van dentro de `b3`** |
| 2 | `b3-ritmo-motor` | Fase 1 · El ritmo del corazón eléctrico mueve el motor del latido (FC, llenado, gasto) | pendiente | Después del 3C de `b3`. Técnica sobre lo que ya existe; a `main` con jueces `--eco` y `--modelo` |
| 3 | `b3-bradi` | Fase 1 · Bradicardias, bloqueos AV y marcapasos en el corazón eléctrico | pendiente | Fuente ya en `docs/` (`esc-2021-estimulacion-cardiaca.pdf`, 26/10; su índice de páginas, en el encargo de `b3`). Va después del 3C de `b3` |
| 4 | `culprit-a` | Fase 1 · Ficha «Del vaso a la derivación» (arteria ↔ derivaciones ↔ pared) (B-026, A) | aparcada hasta terminar Marino | Decisión del usuario del 26/10. Fuentes ya en `docs/` (ESC 2023 de SCA, Wagner 2009, Thygesen 2018, de Winter 2008, CONFIRM 2015, Tamura 2014). Detalle: `autonomo/ideas/ingenieria-inversa/culprit.md` |
| 5 | `culprit-b` | Fase 1 · Preguntas «predice el ECG» y «coloca el trombo» (B-026, B) | aparcada hasta terminar Marino | Va detrás de `culprit-a`. C (modelo 2D) espera a las coronarias del motor; D, tras C |
| 6 | `f0-cifras` | Fase 0 · Calculadoras: la cifra nunca contradice su grado + «la fórmula con tus números» | pendiente | Usa la pieza de `formula-comun` (ya en `js/core/`). Juez `--calc` (cambio previo 5 del plan) |
| 7 | `f0-origen` | Fase 0 · Origen y licencia a la vista en simuladores, calculadoras e imágenes | pendiente | CLAUDE.md §7.4. Juez `--origen` |
| 8 | `f0-eco-color` | Fase 0 · Eco: colores por estructura | pendiente | Las cuatro `f0-eco-*`: **un solo constructor en serie**. Antes, mirar qué hicieron ya las paradas 1-2 de `eco-mega` (p. ej. «Señálalo») para no repetir |
| 9 | `f0-eco-rotulos` | Fase 0 · Eco: rótulos que marcan la estructura en el corte y en el 3D | pendiente | Ver nota de `f0-eco-color` |
| 10 | `f0-eco-viaje` | Fase 0 · Eco: la sonda viaja animada entre vistas | pendiente | Idea 3 de `anesthbeta.md` §6 |
| 11 | `f0-eco-guia` | Fase 0 · Eco: ayuda en vivo al mover la sonda | pendiente | Sobre `vistaMasParecida()`; idea de EchoSuite |
| 12 | `f0-movil` | Fase 0 · Calidad automática en el móvil (peso de la página y fps de la eco) | pendiente | Técnica, directo a `main`. Cambio previo 5 del plan |
| 13 | `f0-ra-biblio` | Fase 0 · Bibliografía de The Radiology Assistant en el PIF de Radiología | pendiente | Solo enlaces verificados (CLAUDE.md §7.2); sus figuras, no (decidido 25/10) |
| 14 | `g1-shock` | G1 · Puerta «Guardia» en la raíz y su primera situación: shock e hipotensión | pendiente | Tras la fase 0. Cadena VCI → PAD → VS → GC → E/e′ → VExUS, cada paso con su fórmula (`NORTE.md`). Fuentes: Manual UMI (FATE) y VExUS en `docs/`. Maqueta antes para elegir. Sin guardar datos del paciente |
| 15 | `g2-paro` | G2 · Arritmia inestable y paro | pendiente | Fuente ya en `docs/` (27/10): `aha-2025-parte9-soporte-vital-avanzado.pdf` (paro, taquiarritmia y bradicardia con pulso, cardioversión; página impresa S = PDF + 537) y `aha-2025-novedades-rcp.pdf`. Después de G1 |
| 16 | `g3-sca` | G3 · Dolor torácico y SCA (y marcapasos) | aparcada (espera PDF) | Falta Di Mario 2005 (de pago, 60 €: el usuario no lo manda, 27/10; buscar una fuente libre de las proyecciones o dejar hueco); la ESC 2023 de SCA y la ESC 2021 de estimulación ya están en `docs/` |
| 17 | `g4-dispositivo` | G4 · Tras colocar un dispositivo (placa, punta del tubo o la vía, neumotórax) | aparcada | Antes, comprobar qué cubren Marino, Merino Neumología y Técnicas R1; faltan casos con licencia |
| 18 | `g5-neuro` | G5 · Neurocrítico (TC de cráneo en 5 preguntas) | aparcada (espera PDF) | Falta el temario de Neurorradiología |
| 19 | `g6-ete` | G6 · Quirófano cardíaco y ETE | pendiente | Fuente ya en `docs/` (`hahn-2013-ete-completa-ase-sca.pdf`). Después de G1 |
| 20 | `f2-coronarias` | Fase 2 · Coronarias por segmentos con dominancia en el motor | aparcada | Abre `culprit` C y la pared por regiones (C2 de `rea-eco`) |
| 21 | `f2-angio` | Fase 2 · Coronariografía que late (arco en C, vista óptima) y «cómo leer un informe de cateterismo» | aparcada (espera PDF) | Tras `f2-coronarias`. Falta Di Mario y Sutaria 2005 (de pago: buscar una fuente libre) |
| 22 | `f2-ete` | Fase 2 · ETE medioesofágico y transgástrico con reto de sonda y banco de la mitral A1-P3 | pendiente | Fuente ya en `docs/` (Hahn 2013). Ideas 1, 2, 4 y 7 de `anesthbeta.md` §6; decidido el 25/10 tocar la anatomía (esófago, valvas por segmentos) |
| 23 | `f3-calc-eco` | Fase 3 · Calculadoras de eco para la UCI con catálogo único y «¿cómo se mide?» | aparcada (espera PDF) | Fuentes completas en `docs/` desde el 27/10: corazón derecho (Mukherjee 2025), cámaras (Lang 2015) y la diastólica, Nagueh 2025, y el informe estandarizado, Taub 2025, ya en `docs/` desde el 27/10). Ideas en `echosuite.md` y `echosuite-2.md` |
| 24 | `f4-visor` | Fase 4 · Visor ligero de cortes de TC | aparcada | Faltan casos con licencia (zenodo, TCIA, Radiopaedia, AWS cerrados en la red) |
| 25 | `f4-punta` | Fase 4 · «¿Dónde está la punta?» puntuado | aparcada | Igual que `f4-visor` |
| 26 | `f4-recorridos` | Fase 4 · Recorridos fijos (Rx de UCI, TC de cráneo en el coma, TEP) | aparcada | Igual; y temarios de Radiología de tórax y Neurorradiología |

**Encargo común del Objetivo I** (cada tarea lo concreta su director con su informe de ingeniería inversa):
- Para qué: ayudar en la guardia y estudiar (`autonomo/radar/NORTE.md`).
- Modelo «así sí»: las piezas de la app que ya existen (eco, motor del latido, `formula-comun`, cuaderno de campo,
  Mayéutica). Lo nuevo con maqueta antes para que el usuario elija.
- Lo que NO quiero: copiar código, texto o imágenes de las webs estudiadas; cifras sin fuente; guardar datos de
  pacientes; librerías nuevas sin que el usuario las elija (three.js sigue sin decidir).
- Fuente: la que dice cada fila; sin PDF, la tarea se queda `aparcada`.

## Lo que aún no está aprobado

Vive en `autonomo/BITACORA.md` (skill `/bitacora`): lo apuntado que espera el visto bueno del usuario, lo que espera
un PDF o una decisión suya y las mejoras de lo que ya existe. **Una tarea entra en este tablero solo cuando el
usuario la aprueba** (con `/bitacora aprueba B-00N` o escribiéndola él aquí).
