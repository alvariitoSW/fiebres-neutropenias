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
