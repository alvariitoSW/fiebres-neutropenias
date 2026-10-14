# Tablero del plan socialista

Lo edita el usuario (orden, notas, límites) y el director (estados). Una tarea por línea, en orden de prioridad.

- **Límite por sesión:** 1 tarea
- **Vueltas máximas por tarea:** 3 (constructor ↔ jueces)
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
| `visual` | contenido nuevo o rehecho con figura, simulación o vista Visual | fidelidad + **rúbrica de estudio ≥4 en todo** (REGLAS §7, juez `profesor`) + paciente posible si hay simulador | potente (opus) |
| `auditoria` | cotejar fichas existentes con su fuente | informe de graves/huecos/menores y los graves corregidos | barato (sonnet) |
| `quiz` | preguntas nuevas o completar temas | ~8 por ficha (6 + 2 de redactar), ancladas al texto, sin temas vacíos | barato |
| `arreglo` | un fallo concreto | el fallo ya no se reproduce y nada se rompe (jueces) | barato |

## Ficha de encargo (una por tarea, debajo de su fila)

Si falta algún campo, el director lo rellena con su mejor criterio a partir de los modelos «así sí» y lo deja
escrito en el parte (no se para a preguntar: el usuario eligió trabajar sin frenos).

```
**Encargo `<clave>`** · tipo: visual | auditoria | quiz | arreglo
- Qué quiero: una frase.
- Para qué: estudiar | consultar a pie de cama.
- Modelo «así sí»: qué pieza de la app debe igualar (REGLAS §7).
- Lo visual que espero: qué concepto se ve con qué pieza (p. ej. «el chorro en color en la 4C del ecógrafo»).
- Lo que NO quiero.
- Fuente.
```

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
5. **Quiz**: preguntas del capítulo en `js/data/eco-atlas-preguntas.js` (tema `atlas-<clave>`): las suyas
   traducidas y al menos 1 de redactar propia; su entrada en `temasAtlasEco`.
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

| # | Clave | Capítulo | Estado | Notas |
|---|---|---|---|---|
| 1 | `mr` | 18 Insuficiencia mitral | pendiente | **Rehacer.** El piloto (PR #2) dejó el texto fiel pero una figura pobre y un bloque de texto: el usuario lo rechazó. Usar la PR #2 como base del texto. Encargo debajo. |
| 2 | `as` | 15 Estenosis aórtica | pendiente | El motor ya tiene `areaAortica` y la recuperación de presión. |
| 3 | `tr` | 19 Insuficiencia tricuspídea | pendiente | El motor ya tiene `eroaTricus`. |
| 4 | `peri` | 21 Enfermedad pericárdica | pendiente | El simulador ya tiene derrame; el taponamiento y la constricción, no. |
| 5 | `ar` | 16 Insuficiencia aórtica | pendiente | El motor no la tiene: habrá que añadirla con pruebas. |
| 6 | `ms` | 17 Estenosis mitral | pendiente | El motor no la tiene. |
| 7 | `segments` | 11 Contractilidad segmentaria | pendiente | Necesita contractilidad por segmento en la geometría. |
| 8 | `strain` | 13 Strain | pendiente | Hay una aproximación en el cap. 09 («acortamiento del borde»). |
| 9 | `stress` | 12 Eco de estrés | pendiente | Depende de `segments`. |
| 10 | `hcm` | 22 Miocardiopatía hipertrófica | pendiente | Ya hay forma «hipertrofia del VI»; falta la obstrucción del TSVI. |
| 11 | `amyloid` | 23 Amiloidosis cardíaca | pendiente | |
| 12 | `aorta` | 20 Enfermedades de la aorta | pendiente | |
| 13 | `windows` | 04 Vistas transtorácicas | pendiente | El simulador ya tiene 10 vistas y sonda libre. |
| 14 | `shunts` | B4 Cortocircuitos | pendiente | |
| 15 | `masses` | B5 Masas y trombos | pendiente | |
| 16 | `mi` | B6 Complicaciones del infarto | pendiente | |
| 17 | `endocarditis` | B3 Endocarditis infecciosa | pendiente | |
| 18 | `prosthetic` | B2 Prótesis valvulares | pendiente | |
| 19 | `lvad` | B1 Asistencias ventriculares | pendiente | Probablemente `necesita humano`: el motor no tiene bomba. |
| 20 | `tee` | 05 Ecocardiografía transesofágica | pendiente | Probablemente `necesita humano`: no hay sonda esofágica. |
| 21 | `ai` | 24 Interpretación con IA | pendiente | Probablemente `necesita humano`: decidir antes qué se enseña sin modelo. |

### Encargos

**Encargo `mr`** · tipo: visual
- Qué quiero: el capítulo 18 rehecho para estudiar la insuficiencia mitral de un vistazo.
- Para qué: estudiar.
- Modelo «así sí»: capítulo 14 (VD) y receptores animados; la nefrona viva como nivel de «se ve lo que pasa».
- Lo visual que espero: en el **ecógrafo de la app**, la 4C (o 3C) con el **chorro en color** hacia la AI, la
  **convergencia PISA** sobre la válvula y su radio, el **Doppler continuo** del chorro y el **Doppler pulsado de la
  vena pulmonar** (S que se aplana e invierte) moviéndose con el mando de gravedad; a la vez el VI y la AI que se
  dilatan. El cálculo PISA paso a paso como animación (los 4 pasos del texto). La tabla de grados con la posición del
  paciente marcada.
  Ojo: el ecógrafo de la app aún no pinta el chorro regurgitante ni el flujo de venas pulmonares con IM; el motor ya
  tiene `eroaMitral`. Hay que añadirlo al simulador (con sus pruebas; `js/modules/eco/CLAUDE.md`), no esquivarlo.
- Lo que NO quiero: tarjetas de números como figura principal; párrafos largos; un esquema de círculos.
- Fuente: echodemo (`src/ch/mr.js`, `index.html` #ch-mr), extracto en la PR #2.

---

## Otros pendientes (fuera del bucle por ahora)

Decididos con el usuario. Casi todos dependen de que mande una fuente.

- **Después del piloto `mr` (pedido por el usuario)**: 1) analizar los tiempos reales (lector ~5 min, constructor
  67 min en la vuelta 1 y 19 en la 2, verificador ~6, auditor ~3) y proponer cómo acelerar; 2) cómo dejar varias
  tareas en cola que se hagan solas sin que el usuario entre en Claude (rutina programada en la nube, tareas en
  paralelo en ramas distintas). Necesita que el usuario fije el límite de gasto y cuántas tareas a la vez.
  **Hecho el análisis** (parte `autonomo/partes/2026-10-14.md` en la rama `auto/mr`). Propuestas: dos constructores a
  la vez (texto+quiz / figura+pruebas), pruebas largas solo al final, los tres jueces a la vez desde la 1.ª vuelta
  (estimado: de ~2 h 45 a ~1-1 h 15 por capítulo). **Decisión del usuario (14/10/2026): todavía no**; primero
  revisar la PR #2. Rutina nocturna: **no montarla aún**; cuando se monte, de madrugada (~3:00, hora de Canarias)
  con aviso al móvil.
- **Prueba intermitente del simulador de eco**: `navegador.test.mjs`, «la barra del ciclo tiene las 7 fases», falla
  a veces cuando el ordenador va cargado (1 de 3 en el piloto). Endurecerla.
- **Orden de trabajo pedido**: 1) Marino completo (hecho, octubre 2026); 2) terminar El Libro Azul (hay secciones
  I, II, III y VII); 3) el PIF de R1: las 7 rotaciones sin contenido (Radiología de tórax, Neurorradiología,
  Cardiología, Medicina Interna, Infecciosas, Neurología, Neumología). Necesitan los PDF.
- **TRR (Nefrología)**: cotejar con el PDF de Valdenebro 2021 las 7 dudas anotadas en `docs/historial/nefrologia.md`,
  si el usuario lo manda. ECIL-10, BCSH 2009 y las citopenias distintas de la neutropenia febril: descartadas.
- **Eco cardíaca (fuera del atlas)**: calibrar la RVS, medir fps en el móvil, más formas de enfermedad
  (`js/modules/eco/README.md`, «Pendiente»).
- **Panel de subida**: falta la clave de la API y desplegar el Worker (`backend/README.md`).
- **Simulador de arritmias (idea de RitmoLab, de Farmacotips)**: reconstruirlo sin copiar su código, sobre el motor
  de ECG de `nefrologia/potasio-escena.js`. Decidido con el usuario: **puerta propia en la raíz** («Arritmias»),
  enlazada también desde la rotación de Cardiología del PIF («EKG y arritmias»). 17 ritmos de RitmoLab: 11 con fuente
  en la app (Marino caps. 19 y 21); bradicardia sinusal, BAV completo, Mobitz I y II, taquicardia sinusal y
  extrasístoles, con los **algoritmos AHA 2025** (bradicardia, taquicardia, parada): **esperando que el usuario mande
  los PDF**, porque heart.org está bloqueado desde el entorno. Fases: 1) monitor + 17 ritmos + modo Estudio (ruta de
  manejo con enlaces a sus fichas); 2) modo Simulación con casos; 3) 12 derivaciones y calibres. Antes de construir,
  maqueta visual para que elija. Lo que se sabe de RitmoLab está en `docs/historial/cardiologia.md`.
