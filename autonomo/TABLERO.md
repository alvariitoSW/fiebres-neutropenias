# Tablero del plan socialista

Lo edita el usuario (orden, notas, límites), la bitácora (`/bitacora`: mete las tareas que el usuario aprueba y las
marca `hecha` al fusionarse su PR) y el director del plan (estados). Una tarea por línea, en orden de prioridad.

- **Límite por sesión:** 3 tareas (decisión del usuario, 14/10/2026, para las revisiones de Marino)
- **Vueltas máximas por tarea:** 3 (constructor ↔ jueces). Una 4.ª solo si tras la 2.ª quedan **más de 3 fallos**
  (sumando graves, medianos y pequeños); nunca más de 4.
- **Parar si:** 2 tareas seguidas fallan o quedan bloqueadas
- **Límite de gasto por sesión:** el que fije el usuario (sin fijar todavía: no se programa una rutina nocturna sin él)
- **Modo git:** rama `auto/<clave>` + PR en borrador (nunca directo a `main`)
- **Una tarea solo pasa a `en revisión`** con el enlace de su PR anotado; sin enlace, no avanza

Estados: `pendiente` · `en curso` · `en revisión` (PR abierta) · `hecha` (PR aprobada) · `necesita humano` · `aparcada`

## Tipos de tarea y su «hecho»

Cada tarea tiene un tipo. El «hecho» de un tipo **se suma** al del objetivo (p. ej. un capítulo del atlas es tipo
*visual* y además cumple los puntos del Objetivo 1).

| Tipo | Qué es | «Hecho» propio | Modelo del constructor |
|---|---|---|---|
| `visual` | contenido nuevo o rehecho: fase A (fiel) + fase B (visual y preguntas) | fidelidad + **rúbrica de estudio ≥4 en todo** (REGLAS §7 y §8, juez `profesor`) + paciente posible si hay simulador | potente (opus) |
| `estudio` | contenido que **ya está** en la app: fase A ligera (comprobación de fuentes: cifras, páginas y bibliografía contra el PDF; lo grave se corrige, lo bueno no se reescribe) + fase B (el profesor diseña lo visual con los modelos grandes, el recorrido de preguntas y los casos) | comprobación sin graves + rúbrica ≥4 en §7 y §8 + auditor sin graves en preguntas, casos y figuras | barato en la fase A, potente (opus) en la B |
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
| 1 | `marino-r1` | 1-6 (acceso vascular y prácticas habituales) | pendiente | 13 fichas · Libros |
| 2 | `marino-r2` | 7-11 (monitorización y fluidoterapia) | pendiente | 10 fichas · Libros |
| 3 | `marino-r3` | 12-13 (anemia, transfusión, plaquetas y plasma) | en revisión (2026-10-14) | 6 fichas · Merino HEMATO |
| 4 | `marino-r4` | 14-17 (shock) | pendiente | 12 fichas · Merino Cardiología |
| 5 | `marino-r5` | 18-21 (trastornos cardíacos) | pendiente | 12 fichas · Merino Cardiología |
| 6 | `marino-r6` | 22-26 | pendiente | 13 fichas · Merino Neumología |
| 7 | `marino-r7` | 27-30 | pendiente | 10 fichas · Merino Neumología |
| 8 | `marino-r8` | 31-35 | pendiente | 15 fichas · Libros |
| 9 | `marino-r9` | 36-38 | pendiente | 8 fichas · Libros |
| 10 | `marino-r10` | 39-44 | pendiente | 17 fichas · Libros |
| 11 | `marino-r11` | 45-47 | pendiente | 14 fichas · Libros |
| 12 | `marino-r12` | 48-51 | pendiente | 14 fichas · Libros |
| 13 | `marino-r13` | 52-53 y apéndices | pendiente | 11 fichas · Libros |

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
10. **Sirve para estudiar** (tipo `visual`): el juez `profesor` da ≥4 en todos los puntos de REGLAS §7 comparando
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

---

## Lo que aún no está aprobado

Vive en `autonomo/BITACORA.md` (skill `/bitacora`): lo apuntado que espera el visto bueno del usuario, lo que espera
un PDF o una decisión suya y las mejoras de lo que ya existe. **Una tarea entra en este tablero solo cuando el
usuario la aprueba** (con `/bitacora aprueba B-00N` o escribiéndola él aquí).
