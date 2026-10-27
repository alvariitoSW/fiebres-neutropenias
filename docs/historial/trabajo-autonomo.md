# Historial · Trabajo autónomo y reorganización de CLAUDE.md

## Por qué (octubre 2026)

A petición explícita del usuario («pasar de promptear a otra forma de usar la IA»), a partir de un artículo de X sobre
el «Ralph Loop» (un mismo encargo que se repite, con un listón de calidad y un verificador) y de la guía de Anthropic
*Building Effective Agent Automations* (agente programado con preferencias de solo lectura, estado propio, un
informe por ejecución, no avanzar sin confirmación, límite de gasto, ejecución de prueba antes de activar).

## Qué se hizo

- **`CLAUDE.md` partido en reglas e historia.** El antiguo (11.268 líneas) se repartió tal cual en 15 archivos de
  `docs/historial/` (un script comprobó que cada línea fue a uno y solo uno). El nuevo `CLAUDE.md` son las reglas
  vigentes. Después:
  - un repaso del historial buscando reglas enterradas («lección», «nunca», «evita», «regla dura»…), que añadió las
    que faltaban;
  - un apartado sobre cómo trabaja el usuario, una tabla de archivos modelo y la lista «antes de terminar»;
  - lo pendiente pasó a `autonomo/TABLERO.md`;
  - `CLAUDE.md` propios en eco, nefrología, libros, sobrevivir-umi y uci-papers, que se cargan al trabajar en ellos.
- **`autonomo/`**: guía para el usuario (`LEEME.md`), listón de calidad (`REGLAS.md`), tablero de tareas
  (`TABLERO.md`, objetivo 1: los 21 capítulos del atlas de eco) e informes por sesión (`sesiones/`, hoy `partes/`).

## La prueba (examen del CLAUDE.md)

Un agente nuevo (Sonnet, en un worktree aislado) hizo una tarea pequeña: enlaces cruzados entre Merino HEMATO
(Microangiopatías trombóticas) y las fichas de CID y PTT de Síndromes Urgentes, en las dos direcciones, y una
pregunta de redactar CID frente a PTT/SHU (`merino-q049`, sacada solo de la tabla de la ficha). Lo hizo bien y
verificado (se incorporó al proyecto). Lo que enseñó:

- **El agente recibió el `CLAUDE.md` viejo**: los ayudantes heredan el contexto con el que arrancó la sesión. Las
  pruebas de reglas nuevas se hacen en una sesión nueva.
- Faltaba dónde mirar las claves de vista y panel para un enlace (`PANEL_NAV` de `core/search.js`): añadido.
- Faltaba cómo llegar rápido a una ficha en el navegador: añadido a la skill `run-fiebres-neutropenias` (un botón
  temporal con `data-especialidad` que usa el propio enrutador), con el truco de `eval (async () => …)()`.
- En un worktree, el entorno rechaza comandos de shell compuestos: anotado en la skill.
- Una corrección propia previa: `nefrologia/CLAUDE.md` citaba `rutasRinon`, que no existe (es `vistaPorNodoRinon`).

## El plan socialista: la skill, los agentes y los jueces (octubre 2026)

A petición del usuario («con el formato de trabajo que hemos comentado… nombrarlo de alguna manera para tener como esa
skill»). Al revisarlo apareció que la guía de `autonomo/` hablaba de una skill `/mejora` y de 5 agentes que **nunca se
habían creado**. El usuario eligió el nombre **plan socialista** y se montó:

- `.claude/skills/plan-socialista/SKILL.md`: el director (el modelo de la sesión). Argumentos: nada (siguiente tarea),
  una clave, `auditar <clave>`, `estado`. Ciclo: lector de fuente → constructor → jueces (verificador y auditor ciego
  en paralelo) → vueltas → revisor → rama `auto/<clave>`, PR en borrador y parte.
- `.claude/agents/`: `lector-fuente`, `constructor`, `verificador`, `auditor-ciego`, `revisor` (modelo sonnet). Cada
  encargo les recuerda leer las reglas desde el disco (lección de la prueba anterior).
- `autonomo/jueces.mjs`: la lista de «antes de terminar» hecha máquina (imágenes con archivo, quiz sin temas vacíos
  ni entidades ni respuestas fuera de rango, ids de pregunta únicos, `?v=` de caché, y en el navegador a 390 y 360 px:
  ids repetidos, errores, desbordamiento y que cada ficha o capítulo pedido abra con sus imágenes; `--eco` pasa las
  pruebas del simulador). Unos 16 s. En su estreno cazó 3 bancos de preguntas con `&lt;` (20 entidades), corregidos.
- `autonomo/sesiones/` pasa a `autonomo/partes/` (partes de sesión).
- **Primera regla nacida de un fallo** (piloto del capítulo 18, `mr`): los dos jueces aprobaron una figura que con el
  EROA máximo daba PAS 73 mmHg y un chorro de 3,4 m/s. Lo vio el director en una captura. Con la aprobación del
  usuario: regla «paciente posible» (`REGLAS.md` §1.7), paso nuevo del verificador, línea en `CLAUDE.md` §12, y la
  sección «Cómo crecen estas reglas» (`REGLAS.md` §6): cada fallo que se cuele se convierte en propuesta de regla en
  el parte y el usuario decide.
- **Enlace «Ver en el móvil» en cada propuesta** (a petición del usuario: «si no lo veo, ¿cómo le voy a dar el visto
  bueno?»). La app publicada (GitHub Pages) solo sirve `main`, así que la rama `auto/<clave>` no se veía en el móvil.
  Como el repositorio es público, cada PR lleva arriba un enlace a raw.githack.com, que sirve la rama como página web,
  y dónde tocar para llegar. Si un día falla, la alternativa propia es desplegar las ramas con una acción de GitHub
  (necesita cambiar el origen de Pages en los ajustes del repositorio).

## Revisión tras el piloto rechazado: encargos, tipos y el profesor (octubre 2026)

El usuario rechazó el piloto del capítulo 18 (`mr`, PR #2): el texto era fiel y los jueces lo aprobaron, pero era
«un bloque de puro texto sin apenas resaltar lo importante» con una figura pobre (tarjetas de números y un esquema),
tras 2 h 15 de trabajo. Diagnóstico: el plan medía **fidelidad y que funcione**, nunca **si sirve para estudiar**; el
«hecho» del atlas pedía «una figura que se mueva», no qué tenía que enseñar; y el constructor era un modelo barato.
Lo decidido con el usuario (modelos «así sí»: los cuatro; «todo, sin frenos»; constructor potente en lo visual):

- `REGLAS.md` §7, **rúbrica «Sirve para estudiar»**, que manda tanto como la fidelidad: primera vista con idea y
  figura, nada de párrafos largos, resaltado 1-3 por bloque según significado, el mecanismo se ve con las piezas de
  la app (ecógrafo con Doppler color, motor, nefrona, kit Visual), mandos con frase viva, vista Visual y móvil. Con
  los modelos del usuario: receptores animados, nefrona viva y simulaciones, atlas 14 y 10, recetas Visual.
- Agente nuevo **`profesor`** (opus): capturas a 390 px de lo nuevo al lado de un modelo, nota del 1 al 5 por punto
  y qué falta en concreto. Por debajo de 4 en algo, la tarea vuelve a construirse.
- `TABLERO.md`: **tipos de tarea** (`visual`, `auditoria`, `quiz`, `arreglo`) con su «hecho» y el modelo del
  constructor (opus en las visuales); **ficha de encargo** de seis líneas por tarea (qué, para qué, modelo, lo visual
  que espero, lo que no, fuente); puntos 10-11 del «hecho» del atlas; `mr` vuelve a `pendiente` para rehacerlo con
  su encargo (el chorro en color, la PISA y las venas pulmonares en el ecógrafo, que aún no las pinta).
- La skill: el director lee el encargo (y si falta, lo rellena y lo dice en la PR, sin parar), escribe un **plan de
  diseño** antes de construir (qué concepto se ve con qué pieza, comparado con el modelo), lanza el constructor con
  opus en las visuales y al profesor junto a los otros jueces; plan B si un agente no está cargado; los jueces que no
  pueden escribir devuelven el informe en la respuesta. `LEEME.md` explica al usuario cómo escribir un encargo.
- `CLAUDE.md` §12: línea «sirve para estudiar» en la lista de antes de terminar.

## Preguntas para estudiar y el profesor que dirige (octubre 2026)

El usuario aclaró qué quiere de la capa de estudio: el texto fiel con sus fuentes es la base y se queda, pero
encima tiene que haber **otra forma de estudiarlo**. Por un lado, preguntas que te enseñan el tema si no te apetece
leerlo, y casos clínicos para aprender a actuar. Por otro, lo visual con los **modelos grandes** de la app (la
nefrona, el ecógrafo), no gráficos de números. Y un agente potente que, sobre lo que ya está en la app, diseñe
cómo optimizar su estudio.

- **Maqueta con dos versiones** (Artifact privado; copia en `autonomo/modelos/preguntas-para-estudiar.html`, con datos
  de la ficha de HIT de Merino HEMATO). Elecciones del usuario:
  - el botón como tercera opción del interruptor, **Texto | Visual | Preguntas** (frente a un botón propio);
  - de cinco sustitutos de las preguntas de redactar, **«piensa y destapa»** y **«encuentra el error»**, más
    difíciles (descartados: completar huecos, emparejar y «explícaselo a otro», «un poco caca» y «meh»);
  - el **caso clínico que evoluciona**: «top».
  
  En la versión 2:
  - destapa pregunta por razonamiento y se marca punto a punto;
  - el error va en una nota de evolución con 0-2 errores;
  - el caso tiene 7 pasos con la escala 4Ts, opciones ocultas hasta pensar, «qué habría pasado» y «Lo que te llevas».
  
  Respuesta del usuario: «Me encanta, esto sí que es lo que quiero a partir de ahora».
- `REGLAS.md` §8 «Preguntas para estudiar» y §7.8 «Un modelo grande, muchas fichas».
- El agente `profesor` pasa de solo juzgar a **diseñar y juzgar**:
  - en modo diseñar, escribe el plan de estudio (ideas de fondo, lo visual con qué modelo y en qué estado, primera
    pantalla, recorrido de preguntas con su origen, casos y huecos);
  - en modo juzgar, recorre las preguntas y el caso en el móvil y puntúa §7 y §8.
- La skill divide cada tarea en **fase A (fiel)** y **fase B (para estudiar)**. Tipo nuevo **`estudio`** (solo la
  fase B, para lo que ya está en la app; `/plan-socialista estudio <clave>`). El tipo `quiz` desaparece.
- Tablero: **Objetivo 0, tarea `preguntas`**: llevar la maqueta a la app, empezando por la ficha de HIT, ampliando
  `quiz.js` sin un segundo quiz (el usuario no quiere «mucho más código»). Es lo primero, porque sin ese botón
  ninguna tarea puede entregar las preguntas nuevas.
- Reconvertir las preguntas viejas: cuando lo pida el usuario.
- `CLAUDE.md` §8: no se escriben más preguntas de redactar.

## La bitácora: apuntar, aprobar y el rumbo (octubre 2026)

A petición del usuario: una skill solo informativa, separada del plan socialista pero que funcione con él. Durante
uno o dos días el usuario le cuenta lo que hay que hacer; ella lo interpreta como tareas, que esperan a que diga
«esta sí». Lleva el seguimiento de lo hecho y de lo que queda, y responde «¿a dónde nos dirigimos?», también con las
mejoras pendientes de lo que ya existe (como reconvertir las preguntas), para que no se quede nada en el tintero.

- Elecciones del usuario: nombre **`/bitacora`**; lo hecho sale de la lista a los **7 días** (queda en
  `docs/historial/bitacora.md`); la bitácora puede **proponer mejoras propias**, aparte y marcadas con 💡, que nunca
  se hacen sin su visto bueno.
- `.claude/skills/bitacora/SKILL.md`: apuntar (entradas `B-00N` con la ficha de encargo, lo supuesto marcado
  «(supongo)», dependencias, tamaño y dudas), aprobar (pasa al tablero con su encargo), descartar, rumbo y una
  sincronización previa:
  - PR fusionada → la tarea pasa a `hecha` con la fecha;
  - los partes del plan (también en las ramas `auto/*`) alimentan «Esperando algo tuyo» y las mejoras;
  - limpieza de los 7 días.

  No toca la app.
- `autonomo/BITACORA.md`: apuntado, en marcha, esperando algo tuyo, mejoras de lo que ya existe, propuestas 💡 y
  hecho esta semana. Los «Otros pendientes» del tablero se mudaron aquí; el tablero queda solo con lo aprobado.
- El plan socialista solo trabaja tareas del tablero, y las tareas solo entran ahí con la aprobación del usuario.
  La tarea `preguntas` entró antes de existir la bitácora: queda pendiente de que el usuario la confirme.

## Revisar sin construir, el mapa visual y las entregas sin esperar (octubre 2026)

A propósito de Marino, el usuario pidió:
- que lo ya construido no se reconstruya, sino que lo **revisen trabajadores revisores**: fuente, imágenes y una
  mirada al código, solo para lo grave;
- que el profesor haga de **director de arte**: pocos modelos biológicos grandes apoyados en el ecógrafo y su atlas,
  en vez de una gráfica por ficha;
- trabajar por partes, recibiendo cada parte para revisarla mientras el equipo sigue.

- Comprobado: Libros → Marino ya centraliza los 53 capítulos y 3 apéndices (155 fichas). Los caps. 12-30 viven en
  Merino HEMATO, Cardiología y Neumología. Si mudarlos, queda como duda en la bitácora.
- Agente nuevo `revisor-codigo` (sonnet): solo graves (consola, calculadoras mal, campo vacío como 0, ids, enlaces,
  imágenes, decisiones de `CLAUDE.md` §2 y §5) y, como mucho, 3 simplificaciones seguras.
- Tipo `revision` (fase R en la skill): auditor, revisor de código y verificador a la vez, sin constructor salvo
  para lo grave, más «Ideas para la parte de estudio» en `autonomo/ideas/<libro>.md`.
- Tipo `mapa`, nuevo modo del profesor: el mapa visual de un libro, con modelos que ya existen y cómo ampliarlos,
  modelos nuevos con maqueta para que elija el usuario, y el orden de los bloques.
- «Entregas sin esperar»: en bucle, cada tarea abre su PR, avisa con «Ver en el móvil» y sigue. Si depende de una PR
  sin fusionar, trabaja sobre su rama.
- Bitácora B-003 reescrita como «Plan Marino», en cinco fases: 13 revisiones, mapa, preguntas, modelos por partes y
  estudio por bloques. El usuario no aprueba nada todavía.

## Primera sesión del plan Marino: revisiones R1-R3 (octubre 2026)

Tres revisiones sin construir (29 fichas). Lo que enseñaron:
- **Revisar paga**: el bloque modelo de la app (Merino HEMATO) tenía 7 graves de contenido, entre ellos TRALI/TACO al
  revés en una tarjeta y la proporción PFC:hematíes. Los revisores coinciden mucho entre sí: lo grave lo ven los tres.
- **Los simuladores son lo más frágil**: dos daban pacientes imposibles (3 L de salino al 7,5 %, un «paro» llamado
  volemia normal). La regla de paciente posible funciona cuando el verificador mueve los mandos a los extremos.
- Los correctores comprueban el PDF antes de cambiar. Dos veces corrigieron al director: el salino 0,9 % sí saca
  algo de agua de las células (pág. 5) y el TRALI «sin agente identificado».
- Paralelo: R2 y R3 a la vez, R3 en un `git worktree`. Chocaba el puerto fijo del comprobador. El usuario aprobó
  las cuatro propuestas de regla: puerto libre y carga de imágenes en `jueces.mjs`, recetas Visual por id, primero
  los archivos modelo, y worktree para el paralelo.
- El usuario aprobó las tres PR. Tiempo: unas 2 h 30 para las tres, con agentes en paralelo.

### Los jueces abren la vista Visual (octubre 2026)

En la tarea `formas-iones`, el constructor vio 2 px de desborde a 360 px en la vista Visual de «Nefronas que quedan»
(`erc-acidosis-k`). `jueces.mjs` no lo veía porque abría las fichas solo en Texto. El usuario aprobó la regla el
19/10/2026.

- Ahora, con `--ficha`, los jueces pulsan «Visual» en cada bloque con interruptor (la ficha misma o un bloque dentro)
  y miden el desborde.
- Con eso se cazaron los 2 px. Se arreglaron haciendo que `.nv-medidor-nombre` parta línea; `?v=` subido.
- En la misma tanda, la animación de alcalinizar la orina (`visual-marino-piezas-45-53.js`, salicilatos) distingue el
  no ionizado (bola llena) del ionizado (anillo con «−») por la forma, no solo por el color (CLAUDE §5).

### Plan nuevo y agentes optimizados (19/10/2026)

El usuario reorienta el proyecto: «lo del modelo de ácido-base y de la mayéutica ahora mismo es la clave de esta
aplicación». Marino pasa a trabajarse **por bloques en modelos vivos + Mayéutica** (Objetivo M5 del tablero), y lo
demás espera. La Mayéutica queda definida en REGLAS §8: Guía socrática más Examen nivel MIR, y «Para profundizar» con
lo que no se cubre (objetivo ≈85 %).

En la misma conversación pidió que los agentes gasten menos y trabajen mejor. Se aplicó:
- un **paquete por bloque** (`autonomo/bloques/`);
- una **lista de comprobación del constructor** con los fallos que ya salieron;
- **informes de 40 líneas** con «No comprobado / riesgo»;
- el **profesor** solo para cobertura y juicio, y juzgando sobre la prueba guiada;
- el **auditor** solo sobre lo nuevo;
- el **verificador** sustituido casi siempre por `jueces --ficha --modelo`;
- el **revisor de código** lee también lo que toca el cambio.

De Ponytail (github.com/DietrichGebert/ponytail, MIT) se tomaron dos ideas: la escalera antes de escribir código y el
cierre «qué no he comprobado». No se instaló, porque su modo «vago» chocaría con no resumir por debajo de la fuente.

## Lecciones del bloque 1 de Marino (20/10/2026)

Al terminar el bloque 1 (Objetivo M5), el usuario pidió «aprender de los fallos y las mejoras que hemos tenido que
hacer en el plan socialista… para evitar repetir errores y siempre mejorar nuestro trabajo y ser eficientes». Se
propusieron 14 lecciones (https://claude.ai/artifact/JZfDxXWQfrAEb7Cuz5jkbg) y las aprobó todas. Quedaron escritas en
`autonomo/REGLAS.md` (§1.11-1.13, §2.7-2.9, §4.4 y §4.6, §8), en `constructor.md`, `profesor.md`, `auditor-ciego.md`,
la skill del plan («Modo bloque» y «Ahorro») y `autonomo/bloques/LEEME.md`; el resumen, en
`autonomo/bloques/b1/lecciones.md`. Tres tareas técnicas aprobadas antes del bloque 2: jueces ampliados (forma de las
preguntas, nombres internos, rótulos), versión en todas las piezas y un solo motor de Mayéutica. El aviso de
`.ignore` se arregló de raíz con un gancho de inicio de sesión (`git update-index --skip-worktree`).

### Los 12 fallos de los jueces de forma (20/10/2026)

Los jueces nuevos de las lecciones (`autonomo/jueces-forma.mjs`, `--forma`) encontraron 12 fallos que ya estaban en
main. Los arregló un constructor (el primero se cortó al reiniciarse la sesión; el segundo siguió desde sus cambios):
- **Forma de las preguntas**: 9 opciones reescritas en el río y mar y 7 en el catéter (la buena era la más corta en 11
  de 20 y 9 de 17; ahora 2 y 3), sin cifras nuevas: cada matiz sale de la explicación o del «porque» de la misma
  pregunta. En las fichas sin modelo, 11 preguntas con las opciones reordenadas (la buena en la 1ª: de 37 a 26 de 73).
- **Nombres internos**: los ids de la vista Explorar del río y mar pasan a botones con el título de la ficha; «Caso
  B1-B4» y «Caso A1-A3» pasan a «Caso 1-4» y «Caso 1-3»; la nota de la ketamina se nombra por su título.
- **Rótulos**: letra más grande en muralla, inmersión, telar, catéter, capilar y ácido-base (esfera de 196 a 240 px);
  la tira compacta de la cama 7 va sin texto dentro del dibujo.
- El juez de caché ya no da por buena una versión que va hacia atrás (compara AAAAMMDD y N por separado).

### Menos paradas: 4-5 por bloque (20/10/2026)

El usuario: «Deja de pedirme tantas veces lo de aprobada la tarea y sé más independiente, pídemelo por bloque solo 4-5
veces en total, no 25, que si no no avanzamos». En el bloque 1 hubo una PR por tarea (#19 a #25) y cada una esperaba su
«aprobada». Desde ahora (`REGLAS.md` §2.3): el contenido de un bloque va en una sola rama y PR, con 4-5 paradas (el
plan, el primer modelo nuevo, el bloque entero y los cambios pedidos); los arreglos, los fallos de los jueces y lo
técnico entran en `main` sin esperar, con los jueces en verde. La PR #25 (jueces de forma) fue la primera en subir así.

### Un solo motor de Mayéutica (20/10/2026, tercera tarea técnica de las lecciones)

Había siete copias del motor de preguntas: las fichas (`core/mayeutica.js`) y los seis modelos vivos de Libros. Ahora
hay una sola pieza, `js/core/mayeutica-motor.js` (guardado, barajado, los tres formatos, el repaso, los casos y
`crearMayeuticaModelo()` para un modelo vivo); cada modelo solo le pasa sus datos y sus enganches. −1.150 líneas netas.
Las claves de guardado y su formato no cambian (no se pierde el progreso). Diferencias que se unificaron, por mayoría:
el capilar ahora baraja las opciones; las respuestas no van en el HTML hasta que se contestan; «✗ Qué le habría pasado
al paciente» (la redacción de REGLAS §8); marcas ✓/✗ además del color; «Había un error: la N». El ácido-base vivo se
queda con su motor: guarda en otro formato y su «tocar» va por etapas; meterlo obligaba a cambiar su guardado.

## Skill `/ingenieria-reversa` (23/10/2026)

A petición del usuario («mira si con este repositorio nos puede ayudar para tener la skill de /ingeniería-reversa»,
`aicodeking/leanrea`). leanrea (MIT) es una sola guía de unos 8 KB que dice al agente el comando más rápido por tipo
de objetivo, sin servidor MCP; su autor la mide ~38 % más rápida y ~35 % más barata que REA (`morluto/rea`) con
precisión parecida (3 repeticiones, un modelo, una máquina). No se instaló tal cual: casi todo su contenido es para
binarios y apps de escritorio, y aquí lo que se estudian son webs. Se escribió `.claude/skills/ingenieria-reversa/`
en español con su método (leer trozos, juntar llamadas, «visto / deducido / no visto», parar con pruebas) y lo
aprendido con anesthbeta, EchoSuite, AngioView y NavRad: Playwright a 390 px, el código ajeno solo en memoria
(guardarlo lo bloquea el sistema de permisos y lo prohíbe CLAUDE §7.9), REA solo si aporta, un investigador por web y
el formato del informe-propuesta.

### `/ingenieria-reversa`, segunda versión (25/10/2026)

A petición del usuario («aplícalo para mejorar la skill»), tras releer la guía completa de leanrea (versión del
17/10; el 23/10 solo se había leído un resumen). Añadido: presupuesto de 2-4 llamadas por pregunta y no volver a
comprobar lo visto («cada paso cuesta más que lo que lees»); como mucho 2 capturas por web y comprimidas;
investigadores con el modelo barato (lección del gasto de la sesión del 23/10); reutilizar el informe que ya exista y,
en una web a la que se vuelve, comparar primero sus piezas; mapa de la red sin contenido; aviso de imágenes en otro
subdominio (NavRad); mapas de código fuente primero y receta para leer a trozos en memoria (probada); embellecer en
memoria; pares de prueba observados en su pantalla para probar después nuestra versión; ruta de leanrea para una app
de Android. Lo demás de leanrea (binarios de Mac, Windows, Linux) no aplica a webs.

### Contador de gasto por tarea (25/10/2026)

El usuario: «quiero añadir una mejora a la skill /plan-socialista para que también se tenga el uso de tokens por tarea
para poder optimizar mejor el uso y ahorrar». Nuevo `autonomo/gasto.mjs`: lee las transcripciones que guarda Claude
Code (la del director y la de cada agente, con su `.meta.json`) y suma por tarea y por agente la entrada, la caché
escrita, la caché leída y la salida, más un «equivalente» con el peso de cada tipo en el precio (×1, ×1,25, ×0,1, ×5).
La tarea sale de la descripción del agente, que el director empieza ahora por `[clave]`; el gasto del director se
reparte por tiempo (aproximado). Al cerrar cada tarea, el director lo copia al parte («Gasto»).

Primera medida, sobre la sesión larga del 10 al 25/10 (bloques 1-3, R1-R13, maquetas): ≈750 M equivalentes.
- **El director, la mitad (49 %)**: 5.234 turnos con un contexto mediano de 539 k tokens (p90: 712 k). Cada paso relee
  medio millón de tokens de la caché; es lo que más pesa con diferencia.
- **Constructores en el modelo potente, 31 %** (47 agentes, 5 M de media; los más caros, 7-13 M, con 150-230 pasos).
  En el barato, 1,1 M de media.
- Auditores, profesor, verificadores y revisores de código: 2-4 % cada papel.
- En los agentes, lo que más pesa es releer su propio contexto (caché leída), no lo que escriben: el gasto crece con
  el número de pasos.
- Límite conocido: la transcripción a veces guarda solo la cifra inicial de salida de un mensaje; la salida puede
  quedarse algo corta.

Con esas cifras, el usuario aprobó (25/10) las cuatro reglas de ahorro propuestas, en la skill («Ahorro medido»):
sesiones cortas (una tarea o una parada de bloque por sesión; la siguiente la abre el director con `create_session`;
el límite del tablero pasa de 3 tareas a 1), encargos de una pieza con tope de unos 100 pasos para el constructor,
modelo potente solo para el profesor, la cobertura y el primer modelo de algo nuevo, y lecturas acotadas (el encargo
nombra los apartados de `REGLAS.md`; el lector de fuente ya no relee `CLAUDE.md`, que tiene cargado).

## Notas del profesor sobre 10 (25/10/2026)

El usuario cambió la rúbrica durante la parada 1 de `eco-mega`: el profesor puntúa cada punto de REGLAS §7 y §8 del 0
al 10 y se pasa con **8,75 o más en todos**; si no, se repite la vuelta. Antes era del 1 al 5 y se pasaba con 4 (un 8 sobre
10). Cambiado en `REGLAS.md` §7, `TABLERO.md`, el agente `profesor` y la skill `plan-socialista`.

El mismo día lo ajustó: **se aprueba con 8 en todos los puntos y la meta es 8,75**; y pidió estudiar cómo usar mejor los
modelos y los tokens para llegar a esa meta sin más vueltas (bitácora B-023).

## Gasto que baja (26/10/2026)

Tras la parada 1 del bloque 3 (13,1 M equivalentes; profesor y constructor, el 83 %), el usuario pidió que cada
operación cueste un poco menos que la anterior y que se aplique a todas las sesiones. Medido: la relectura de la
conversación en cada paso (caché leída) es la mayor parte; el juicio de las v2 dio 107 pasos y 208 capturas, y el
juicio rápido (17 capturas) la mitad. Reglas nuevas en `autonomo/REGLAS.md` §4.7, en los agentes `profesor` y
`constructor` y en la skill: presupuesto por encargo (90 % del último), Fable solo para pensar, un profesor por pieza
con programa de prueba y ≤10 capturas, encargos con dirección exacta, archivos de ≤700 líneas, arneses guardados en
`autonomo/bloques/<bN>/herramientas/`. El usuario autorizó que el director editara las reglas, los agentes y la skill.
Pendiente: el buscador `graft` no está instalado en el entorno (falta `@nanonets/graft` en el script de arranque y su
índice `graft/` en el repositorio).

### Regla de topes y consecuencias (26/10/2026)

En la parada 1 del bloque 3, el usuario infundió 23 L de suero en la maqueta del shock y no pasaba casi nada. Pidió
que esté en las reglas: un mando que deja superar lo real es un fallo, y el profesor lo debe corregir en sus
revisiones. Entró como `REGLAS.md` §1.14 (tope con origen, aviso, sello con consecuencia de paciente real, prueba con
todos los mandos al tope), en el modo juzgar del profesor (fallo grave, nota <8), en la lista del constructor y en
`CLAUDE.md` §12. La pieza común es `autonomo/maquetas/comun/tope.js`.

### Carpetas aparte desde la rama del bloque (27/10/2026)

En la vuelta de límites del bloque 3, el aislamiento automático de los agentes (`git worktree`) salió de `main` y dos
constructores partieron una versión vieja de las maquetas; hubo que rehacerlo. El usuario aprobó la regla: toda carpeta
aparte sale de `origin/auto/<bN>` (`REGLAS.md` §4.6, lista del constructor y skill del plan socialista).
El mismo día aprobó las demás propuestas del parte: nada de `git stash` ni `pkill` amplios en la carpeta compartida, el
puerto de los arneses por `PUERTO=` (REGLAS §4.6 y constructor), y la tarea `jueces-topes` del tablero (que
`jueces.mjs --modelo` lleve cada mando a su tope).

## Una tarea, una sola sesión (27/10/2026)

Dos sesiones arrancaron `movil-existente` a la vez: al cerrar, `jueces-movil` y `jueces-topes` abrieron cada una la
sesión siguiente por su lado. La segunda lo vio al subir la marca «en curso» (la rama remota ya la tenía) y paró sin
tocar la app. Regla nueva, aprobada por el usuario: antes de empezar una tarea, y antes de abrir la sesión siguiente,
el director mira las sesiones activas y la rama `auto/<clave>`; si otra ya la lleva, no empieza
(`autonomo/REGLAS.md` §4.6 y paso 4 de la skill `plan-socialista`).

## Arreglos del móvil en lo ya construido (`movil-existente`, 27/10/2026)

Tras el juez del móvil (`jueces-movil`), cinco constructores sonnet arreglaron los 8 modelos vivos y Marino ·
Fundamentos: frases vivas sin recorte «…», frase y «Siguiente» fuera de la barra de abajo, figura a la vista al tocar
mandos y letra SVG ≥ 8 px (suelo de 9,3 en coordenadas del dibujo, porque a 360 px se pinta al ~88 %). Receta del
catéter copiada en telar, inmersión y vaso. Detalle y gasto en `autonomo/partes/2026-10-27-movil-existente.md`.

## Tres propuestas del móvil (`propuestas-movil`, 27/10/2026)

El usuario aprobó las tres propuestas del parte `2026-10-27-movil-existente.md` («Apruebo las 3 propuestas»):
- **Pieza común `js/core/frase-vista.js`**: lleva la frase viva a la vista tras tocar un mando, para todos los modelos
  vivos, en vez de tres soluciones distintas (margen, frase pegada, scroll).
- **Suelo de letra SVG**: en la lista del constructor y en `REGLAS.md` §4.8 R1, «8 px en pantalla = 8 / escala a
  360 px (≈ 9,3) en coordenadas del dibujo», no 8 a secas.
- **El director fusiona `main` a la vista** (skill `plan-socialista`, «Entregas sin esperar»): nunca en segundo plano;
  mira los conflictos y que no queden marcas antes de seguir.


## 27/10/2026 · Cierre solo, /ahorro y bitácora diaria (sesión fuentes-b3)

- **Graft**: su configuración de `.claude/` (versión 0.26.0) se sube a `main` una vez, a petición del usuario. Antes,
  cada sesión arrancaba con esos archivos «sin guardar» y el gancho de parada hacía dar al director unas 15 vueltas
  vacías por sesión.
- **Skill `/ahorro`** (`.claude/skills/ahorro/`, registro en `autonomo/ahorro/registro.md`): lee solo «Gasto»,
  «Vueltas» y «Propuestas sobre las reglas» de los partes nuevos, busca patrones que se repiten en 2 o más tareas y
  propone como mucho 3 cambios en la bitácora (sección 5). No aplica nada: el usuario aprueba con `/bitacora`.
- **`/plan-socialista`, cierre**: pasos 6 (pasar `/ahorro`) y 7 (la sesión se archiva sola cuando todo está hecho,
  subido, con parte, sin agentes y sin esperas; si queda algo, `send_later` a 1 hora y se vuelve a mirar).
- **Tarea programada «Bitácora diaria»** (`trig_01XfdVjv5Bd5qeWQ6ZRRwkB1`): a las 13:43 y 21:43 (hora de Madrid)
  abre una sesión que solo informa (qué se hizo, sesiones cerradas, qué espera al usuario, qué sigue, propuestas de
  ahorro), con aviso al móvil, y se archiva sola.
