# 2026-10-30 · atlas-texto · cap. 04 Vistas transtorácicas (fase A, solo texto)

**Resultado:** fusionado a `main` por el cierre automático del tablero (PR de `auto/atlas-texto-windows`) · **Vueltas:** 2 · **Jueces:** `jueces --atlas windows` ✓ · auditoría ciega ✓ (0 graves, 5 menores: 3 aplicados, 2 aceptados)

## Qué se hizo
- `js/modules/eco/atlas/cap-windows.html`: traducción completa del capítulo (echodemo `index.html` l. 539-613): las cuatro ventanas y la posición del paciente; eje largo y corto paraesternal (3.º-4.º espacio, marca a las 9-10, 90° horario), apical (marca a las 4-5, 60° + 60° antihorarios, cinco cámaras inclinando hacia delante), subcostal y supraesternal; los cinco movimientos de la sonda de la ASE; el acortamiento apical (VI 2/3, AI 1/3); el conjunto mínimo de la BSE; la figura del original con su sonda libre (5° y 0,5 cm; 4°, 29°, 3,8 cm; 15,1 cm, 140°, 44°, 30°, marcadas como cifras del modelo, no de la guía).
- Tabla de 35 vistas (qué muestra y qué se adquiere), sacada de `INFO` de `src/ch/windows.js` (ASE 2019, Tablas 2.1-2.27), con nota plegable de origen y abreviaturas.
- Remisiones con botón: VCI → cap. 08 Hemodinámica por Doppler (el original remite a su «chapter 07», archivado, cuyo enlace abre ese panel; nota plegable), acortamiento → cap. 09.
- `atlas.js` (entrada `windows` sin figura), README de la eco, `docs/historial/eco.md` (ya son 21 de 30), tablero y versión 20261030-46.
- Revisión del encargo: la hice yo (misma receta que `hcm`, `amyloid` y `aorta`, sin agente).

## Qué no se pudo hacer o leer
- Figura, pruebas, preguntas y profesor esperan a `mv-eco-2a5`.

## Para el usuario
- Mirar el capítulo en el móvil (Eco cardíaca → Atlas → 04 · Vistas transtorácicas). Fase A: no hace falta decidir nada.

## Visto de paso (no tocado)
- Nada.

## Vueltas
| Vuelta | Quién | Motivo | Resultado |
|---|---|---|---|
| 1 | director | traducción | jueces ✅ |
| 2 | director | auditoría: 0 graves; menores aplicados («29° del de la sonda rotada», posición de la sonda subcostal y supraesternal de `views.js`, «motilidad parietal» por «contractilidad»); aceptados «hacia abajo» y «sniff» | jueces ✅ |

## Gasto / Cuentas
Presupuesto 0,3-0,6 M. Auditor sonnet ≈0,05 M (6 herram.); director ≈0,25 M. Total ≈0,3 M, dentro del presupuesto (sin `/ahorro`).

## Siguiente: encargo de `shunts` (para la sesión nueva)
`/plan-socialista atlas-texto` — Capítulo siguiente: `shunts` (B4 en la app, Cortocircuitos: CIA, CIV y FOP), en el orden del Objetivo 1. Fase A: solo el texto, como `aorta` y `windows`.
- Rama `auto/atlas-texto-shunts` desde `origin/main`, PR en borrador. Formato de `cap-windows.html`/`cap-aorta.html`; entrada en `CAPITULOS` de `atlas.js` sin `figura`. Número: el de `ATLAS_PARTES` en `js/modules/eco/atlas-ouyang.js`.
- Fuente: `git clone --depth 1 https://github.com/douyang/echodemo /tmp/echodemo`; prosa en `index.html` (`<article id="ch-shunts">`, grep); tablas y comentarios de `src/ch/shunts.js` (por trozos). Cada `data-ref` en `referencias.js`; si falta, añadirla con su DOI del original. Ojo: capítulos archivados del original (p. ej. `ivc`) se resuelven con `SHOWN_IN` de `src/order.js`.
- Remisiones `data-go` → botón `data-at-cap` con la numeración de la app; buscar «aún en el original» que mencione B4.
- Método: el director traduce, `node autonomo/jueces.mjs --atlas shunts`, auditor ciego sonnet (~12 pasos). Presupuesto 0,3-0,6 M. Sin figuras, preguntas ni profesor; no tocar `motor.mjs`. Versión superior a la de `main`. Fusionar `main` a la vista antes de cerrar.
- Cierre automático: jueces en verde y auditoría sin graves → fusionar a `main`, «ya son 22 de 30» en el historial, tablero, fila en `SESIONES.md`, y abrir la sesión del siguiente (`masses`).
