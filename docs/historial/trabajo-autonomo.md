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
