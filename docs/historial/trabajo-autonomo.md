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
  (`TABLERO.md`, objetivo 1: los 21 capítulos del atlas de eco) e informes por sesión (`sesiones/`).

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
