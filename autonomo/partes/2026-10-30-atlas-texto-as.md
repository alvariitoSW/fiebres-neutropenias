# 2026-10-30 · atlas-texto · cap. 15 Estenosis aórtica (fase A, solo texto)

Tarea `atlas-texto` (Objetivo C, fila 13; Objetivo 1, B-006 fase A). PR en borrador: https://github.com/alvariitoSW/fiebres-neutropenias/pull/43

## Qué se hizo
- `js/modules/eco/atlas/cap-as.html`: traducción completa del cap. 15 (fuente: echodemo `index.html` #ch-as, l. 1395-1449; bandas de la tabla de `src/norms.js` 304-313), con carril «En 30 segundos», tabla de grados (`.data-table` deslizable), nota de fidelidad del solape de cortes, citas Baumgartner 2017 y Otto 2020 (ya en `referencias.js`) y aviso «En preparación · Figura y estudio».
- `atlas.js`: un capítulo sin `figura` no monta figura y oculta «Repasar este capítulo» (no hay tema de quiz sin preguntas). `css/components.css`: `.at-en-preparacion` (borde discontinuo + texto, no solo color).
- **Juez** (commit aparte, REGLAS §2.6b): `--atlas` sin figura solo pasa con el aviso visible y «Repasar» oculto; con figura, igual que antes. No baja ningún umbral: la fase A sin figura la aprobó el usuario el 30/10.
- README de la eco, `docs/historial/eco.md` (10 de 30) y versión 20261030-13.
- Revisión del encargo: la hizo el director con la lista (encargo de texto, sin piezas ni motor); sin lector-fuente (la fuente es una sección de un archivo y el auditor lee el original).

## Qué no se pudo hacer o leer
- Nada. Figura, pruebas, preguntas y profesor esperan a `mv-eco-2a5`, como dice la fila.

## Para el usuario
- Mirar el capítulo en el móvil (PR #43). Fase A: no hace falta decidir nada.

## Visto de paso (no tocado)
- El índice (`atlas-ouyang.js`) promete «la válvula bicúspide» para el cap. 15; el texto del original no la trata (solo su figura, `as.js:277`). Al hacer la fase B, decidir si la figura nueva la enseña.

## Propuestas sobre las reglas
- Ninguna. Para los capítulos siguientes: la prosa de cada capítulo está en `/tmp/echodemo/index.html` (`#ch-<clave>`), no en `src/ch/<clave>.js`; decirlo en el encargo ahorra pasos.

## Vueltas
| Vuelta | Quién | Motivo | Resultado |
|---|---|---|---|
| 1 | constructor sonnet | traducción | jueces ✅ |
| 2 | mismo constructor (4 pasos) | auditoría: 0 graves, 1 mediano (nota que elegía ganadora), 4 menores | corregidos, jueces ✅ |

## Gasto
Total **0,54 M** (`gasto.mjs --clave atlas-texto`): constructor sonnet 0,29 M (20 herram.), director ≈0,14 M, auditor sonnet 0,11 M (11 herram.).
Dónde se fue: la mitad en el constructor, que buscó la prosa en `as.js` antes de encontrarla en `index.html`. Ahorro: dar la ruta exacta en el encargo.

## Cuentas
Presupuesto 1,5 M (recortado: sin lector-fuente, sin revisor, revisión del encargo sin agente) · gastado 0,54 M · desvío **−64 %** (texto corto, 0 graves, la vuelta en el mismo agente). Fila: ≈1-1,5 M por capítulo; con lo medido, **≈0,6 M por capítulo** es un presupuesto realista para los 19 que quedan (≈11-12 M en total, frente a los 20-30 M estimados).
