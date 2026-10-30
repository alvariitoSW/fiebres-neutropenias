# 2026-10-30 · atlas-texto · cap. 23 Amiloidosis cardíaca (fase A, solo texto)

**Resultado:** fusionado a `main` por el cierre automático del tablero (PR de `auto/atlas-texto-amyloid`) · **Vueltas:** 2 · **Jueces:** `jueces --atlas amyloid` ✓ y `--atlas ar` ✓ · auditoría ciega ✓ (0 graves, 5 menores: 1 aplicado, 4 aceptados)

## Qué se hizo
- `js/modules/eco/atlas/cap-amyloid.html`: traducción completa del capítulo (echodemo `index.html` l. 2067-2126): hallazgos estructurales (pared ≥12 mm, cavidad pequeña, aurículas, septo interauricular >5 mm, VD >5 mm, derrame, textura «moteada» desaconsejada por la BSE), Doppler (grados de disfunción diastólica, TD <150 ms, e′ 3-4 cm/s, signo 5-5-5, onda A pequeña), strain (respeto apical relativo ≥1,0 con S 93 %/E 82 %, Cotella 32 %/6 %, Bravo, FE/|GLS| >4,1, cortes de GLS), criterios ESC 2021 y medida.
- Dos tablas sacadas del diagrama del original (`src/ch/amyloid.js`, `FINDINGS` y `POINTS`): los tres hallazgos de la ESC y la puntuación de Boldrini 2020, con nota plegable de su origen; tres ecuaciones; «Los casos de la figura» (regla del original: mando de carga de amiloide con las cifras redondeadas del modelo).
- Remisiones (numeración de la app): image 02, eject 09, fill 10, segments 11, strain 13, con botón. Las 4 menciones «capítulo 23, aún en el original» (`cap-diastolica`, `cap-hcm`, `cap-peri`, `cap-strain`) pasan a botón; y la de «capítulo 17, aún en el original» de `cap-ar.html` (el 17 `ms` ya está en la app).
- `atlas.js` (entrada `amyloid` sin figura), README de la eco, `docs/historial/eco.md` (ya son 19 de 30), tablero y versión 20261030-44.

## Qué no se pudo hacer o leer
- Figura, pruebas, preguntas y profesor esperan a `mv-eco-2a5`.

## Para el usuario
- Mirar el capítulo en el móvil (Eco cardíaca → Atlas → 23 · Amiloidosis cardíaca). Fase A: no hace falta decidir nada.

## Visto de paso (no tocado)
- Quedan «capítulo 18, aún en el original» en `cap-hcm.html` (IM, esperando `mr`) y «capítulo 19» en `cap-vd.html`: correctas mientras esos capítulos no entren.

## Vueltas
| Vuelta | Quién | Motivo | Resultado |
|---|---|---|---|
| 1 | director | traducción | jueces ✅ |
| 2 | director | auditoría: 0 graves; menor aplicado (botones del diagrama: E, A, e′, s′, a′ e IT); enlace del cap. 17 en `ar`; fusión de `main` sin conflictos | jueces ✅ |

## Gasto / Cuentas
Presupuesto 0,3-0,6 M. Auditor sonnet ≈0,04 M (6 herram.); director ≈0,25 M. Total ≈0,3 M, dentro del presupuesto (sin `/ahorro`).

## Siguiente: encargo de `aorta` (para la sesión nueva)
`/plan-socialista atlas-texto` — Capítulo siguiente: `aorta` (24, Aorta), en el orden del Objetivo 1. Fase A: solo el texto, como los caps. 22 (`hcm`) y 23 (`amyloid`).
- Rama `auto/atlas-texto-aorta` desde `origin/main`, PR en borrador. Formato de `cap-amyloid.html`; entrada en `CAPITULOS` de `atlas.js` sin `figura`.
- Fuente: `git clone --depth 1 https://github.com/douyang/echodemo /tmp/echodemo`; prosa en `index.html` l. 1943-1991 (`<article id="ch-aorta">`); comentarios y tablas de `src/ch/aorta.js` (1496 líneas: solo comentarios y tablas, por trozos). Referencias (todas ya en `referencias.js`): baumgartner2020, goldstein2015, isselbacher2022, lang2015, zoghbi2017.
- Remisiones por `data-go`, numeración de la app: `ar` → botón (16); `image` → botón (02). No hay menciones «capítulo 24, aún en el original» en otros capítulos.
- Método: el director traduce, `node autonomo/jueces.mjs --atlas aorta`, auditor ciego sonnet (~12 pasos; avisarle de la numeración de la app). Presupuesto 0,3-0,6 M. Sin figuras, preguntas ni profesor; no tocar `motor.mjs`. Versión superior a la de `main`. Fusionar `main` a la vista antes de cerrar.
- Cierre automático: jueces en verde y auditoría sin graves → fusionar a `main`, «ya son 20 de 30» en el historial, tablero, fila en `SESIONES.md`, y abrir la sesión del siguiente (`windows`).
