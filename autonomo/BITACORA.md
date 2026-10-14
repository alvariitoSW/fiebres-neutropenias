# Bitácora

La lleva la skill `/bitacora` (`.claude/skills/bitacora/SKILL.md`). Aquí está **lo que se quiere hacer y aún no está
aprobado**, lo que espera algo del usuario y lo hecho en la última semana. Lo aprobado vive en `TABLERO.md`, que es
lo único que trabaja el plan socialista. Lo hecho hace más de 7 días y lo descartado pasan a
`docs/historial/bitacora.md`.

Última sincronización: 2026-10-14.

---

## 1. Apuntado: espera tu visto bueno

Orden que propongo (de arriba abajo). Cada tarea pasa por las fases que dice; ver «Cómo se trabaja» al final de
esta sección.

### B-001 · Preguntas para estudiar en la app · apuntado 2026-10-14
- **Lo que dijiste**: «lo primero […] la tarea de preguntas está por hacer, sería la primera cosa».
- **Cómo lo entiendo**: tipo `visual`. Llevar la maqueta aprobada (`autonomo/modelos/preguntas-para-estudiar.html`) a
  la app: interruptor **Texto | Visual | Preguntas**, recorrido en orden, repaso de lo fallado, caso clínico, y los
  tres formatos (test con «piensa antes», piensa y destapa, encuentra el error). Primera ficha: trombocitopenia y
  HIT de Merino HEMATO, con las preguntas y el caso de la maqueta. Ampliando el quiz que ya hay, sin un segundo quiz
  ni mucho código. El encargo completo está en el tablero (Objetivo 0).
- **Depende de**: nada. **Todo lo demás depende de esta** (sin ella no hay dónde poner las preguntas nuevas).
- **Tamaño**: mediana (1-2 sesiones).

### B-002 · Atlas cap. 18 (insuficiencia mitral): la parte de estudio · apuntado 2026-10-14
- **Lo que dijiste**: «está bien como base de texto, no hace falta que lo rehagas, pero le falta la parte del
  profesor […] y la parte de las preguntas rehacerla».
- **Cómo lo entiendo**: tipo `estudio` **sobre la rama del piloto** (`auto/mr`, PR #2). El texto se queda (fase A ya
  hecha y auditada). Solo fase B:
  - el profesor diseña lo visual en el **ecógrafo** de la app: chorro en color hacia la AI, convergencia PISA,
    Doppler continuo y de venas pulmonares, VI y AI que se dilatan con la gravedad, PISA paso a paso; y quita la
    figura de tarjetas de números;
  - el texto se reorganiza para estudiar (idea arriba, tablas, resaltado);
  - las preguntas del capítulo se rehacen con el formato nuevo, con un caso de IM aguda frente a crónica (supongo).
  
  Encargo de `mr` en el tablero.
- **Depende de**: B-001 (para las preguntas).
- **Tamaño**: mediana. El ecógrafo aún no pinta el chorro regurgitante: hay que añadirlo al simulador, con pruebas.
- **Dudas**: la PR #2 se queda abierta y esta tarea la completa; no se abre otra.

### B-003 · Marino (The ICU Book): comprobar y pasar a estudio · apuntado 2026-10-14
- **Lo que dijiste**: «revisar la parte de los libros del Merino, que estaría completo […] simplemente hacer otra
  comprobación […] de las fuentes […] y faltaría la parte del profesor».
- **Cómo lo entiendo**: tipo `estudio`, por bloques. En cada bloque:
  1. **Comprobación de fuentes** (rápida, modelo barato): el auditor coteja las fichas con el PDF y con su página
     (cifras, bibliografía, enlaces `#page=`); lo grave se corrige. No se reescribe nada que esté bien.
  2. **Fase B** (profesor y constructor potentes): lo visual con los modelos grandes y las preguntas nuevas con
     sus casos.
  
  Lo visual, según el tema:
  - **ecógrafo y motor del latido** para shock, corazón y fluidos (Cardiología, caps. 14-21);
  - **nefrona viva y glomérulo** para ácido-base, riñón y electrolitos (caps. 31-38);
  - Motion paso a paso para mecanismos (como los receptores);
  - nunca gráficos de números.
- **Tamaño**: grande. Trozos de ~6 fichas, cada uno una tarea:
  - **Merino HEMATO** (6 fichas): el piloto de `estudio`, porque es la ficha de la maqueta;
  - Merino Cardiología (~24 fichas, 4 trozos);
  - Merino Neumología (~23, 4 trozos);
  - Libros Marino: fundamentos 1-11 (~23, 4), renal 31-38 (~23, 4), abdomen y temperatura 39-44 (~17, 3),
    neurología 45-47 (~14, 2), nutrición y endocrino 48-51 (~14, 2), tóxicos 52-53 (~11, 2).
  
  En total, unas 26 tareas.
- **Depende de**: B-001.

### B-004 · El Libro Azul (Fisiopatología UCI): comprobar, estudio y completar · apuntado 2026-10-14
- **Lo que dijiste**: «y del libro azul de fisiopatología a la UCI, que me faltaría además subir el temario».
- **Cómo lo entiendo**: dos partes.
  - **Lo que ya está** (secciones I Cardiovascular, II Hematología, III Inmunitario y VII Vías Urinarias; ~33
    fichas): igual que B-003, con comprobación de fuentes y fase B. En la sección I, el motor del latido y el
    ecógrafo (supongo). Unas 6 tareas.
  - **Lo que falta**: cuando mandes los PDF del resto del temario, cada sección hace las dos fases completas (leer
    la fuente, construir, auditar; después, estudio).
- **Depende de**: B-001. La segunda parte, de tus PDF.

### B-005 · PIF: comprobar, estudio y completar · apuntado 2026-10-14
- **Lo que dijiste**: «completar el PIF».
- **Cómo lo entiendo**: igual que B-004.
  - **Lo que ya está** (Hematología: citopenias, neutropenia febril, reconocimiento, síndromes urgentes, trasplante;
    Nefrología: fisiología, HTA, ERC, FRA, TRR, trasplante renal): comprobación de fuentes y fase B (supongo).
    Nefrología ya tiene la nefrona viva: el profesor la aprovecha.
  - **Las 7 rotaciones sin contenido** (Radiología de tórax, Neurorradiología, Cardiología, Medicina Interna,
    Infecciosas, Neurología, Neumología): las dos fases completas cuando mandes sus PDF.
- **Depende de**: B-001. Las rotaciones nuevas, de tus PDF.
- **Dudas**: ¿«completar el PIF» incluía repasar lo que ya está (Hematología y Nefrología), o solo las 7 rotaciones?

### B-006 · Atlas de eco: los 20 capítulos que faltan · apuntado 2026-10-14
- **Lo que dijiste**: (aprobado antes como Objetivo 1; con el método nuevo, lo vuelvo a poner a tu visto bueno).
- **Cómo lo entiendo**: tipo `visual`, las dos fases por capítulo: traducción completa y auditada; después, estudio
  con el ecógrafo y el motor, y preguntas nuevas. Lista y «hecho» en el tablero (Objetivo 1).
- **Depende de**: B-001 y de cómo salga B-002 (es el mismo tipo de capítulo).
- **Tamaño**: grande, 20 tareas.

### Cómo se trabaja (lo que haría el plan socialista con cada una)

| Fase | Quién | Para qué | Modelo |
|---|---|---|---|
| A completa (contenido nuevo) | lector de fuente → constructor → auditor ciego | el texto entero, fiel y con sus páginas | barato |
| A ligera (lo que ya está) | auditor ciego → (si hay algo grave) constructor | comprobar fuentes, cifras y bibliografía | barato |
| B (estudio) | **profesor diseña** → constructor → verificador + auditor + **profesor juzga** | visual con los modelos grandes, texto para estudiar, recorrido de preguntas y casos | potente |
| Cierre | revisor → rama propia y propuesta (PR) en borrador con «Ver en el móvil» | que lo pruebes y apruebes | — |

- Si algo suspende (un juez en rojo, algo grave en las fuentes, una nota del profesor por debajo de 4), vuelve al
  constructor. Como mucho 3 vueltas; si no, «necesita humano».
- **Una tarea por sesión.** Con `/plan-socialista` hace la siguiente del tablero; con `/loop /plan-socialista`
  encadena varias, hasta el límite del tablero. Nada se publica sin que apruebes su PR, y la próxima vez que abras
  `/bitacora` lo marca como hecho.

## 2. En marcha (ya en el tablero)

*(Nada: todo lo anterior espera tu visto bueno. Las tareas del tablero están `aparcada` hasta que apruebes la
entrada de la bitácora que les toca.)*

## 3. Esperando algo tuyo

- **Aprobar las entradas B-001 a B-006** (o cambiar el orden).

- **Simulador de arritmias (idea de RitmoLab)**: los PDF de los algoritmos **AHA 2025** (bradicardia, taquicardia,
  parada y la guía completa); heart.org está bloqueado desde el entorno. Decidido: puerta propia en la raíz
  («Arritmias»), enlazada desde Cardiología del PIF. Fases: 1) monitor, 17 ritmos y modo Estudio; 2) casos; 3) 12
  derivaciones. Antes de construir, maqueta para elegir. Detalle en `docs/historial/cardiologia.md`.
- **El Libro Azul**: los PDF de las secciones que faltan (hay I, II, III y VII). Orden que pediste: Marino (hecho),
  después El Libro Azul y después el PIF de R1.
- **PIF de R1**: los PDF de las 7 rotaciones sin contenido (Radiología de tórax, Neurorradiología, Cardiología,
  Medicina Interna, Infecciosas, Neurología, Neumología).
- **TRR**: el PDF de Valdenebro 2021, para cotejar las 7 dudas anotadas en `docs/historial/nefrologia.md`.
- **Panel de subida**: la clave de la API y desplegar el Worker (`backend/README.md`).
- **Velocidad del plan socialista**: hay propuestas (dos constructores a la vez, pruebas largas al final, los jueces a
  la vez desde la 1.ª vuelta; de ~2 h 45 a ~1-1 h 15 por capítulo). Tu decisión del 14/10: **todavía no**.
- **Rutina nocturna** (que el plan trabaje solo de madrugada, ~3:00 de Canarias, con aviso al móvil): **no montarla
  aún**; cuando se monte, hace falta que fijes un límite de gasto.

## 4. Mejoras de lo que ya existe

- **Reconvertir las preguntas viejas** al formato de estudio (`REGLAS.md` §8): hay **361 de redactar** entre ~2.600
  preguntas. **Cuando lo pidas** (lo dijiste el 14/10), por bloques, con tareas `estudio`.
- **Prueba intermitente del simulador de eco**: `navegador.test.mjs`, «la barra del ciclo tiene las 7 fases», falla
  a veces con el ordenador cargado. Endurecerla.
- **Eco cardíaca fuera del atlas**: calibrar la RVS, medir los fps en el móvil, más formas de enfermedad
  (`js/modules/eco/README.md`, «Pendiente»).

## 5. 💡 Lo que yo propondría (no lo has pedido tú)

- **Inventario de estudio**: una tabla de qué fichas tienen vista Visual, cuáles tienen un modelo grande que las
  explique y cuáles tienen solo preguntas viejas. Por qué: sirve para ordenar las tareas `estudio` por lo que más
  ayuda. Es una tarea pequeña de solo lectura.

## 6. Hecho (últimos 7 días)

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
