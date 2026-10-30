# 2026-10-30 · atlas-texto · cap. 12 Eco de estrés (fase A, solo texto)

**Resultado:** fusionado a `main` por el cierre automático del tablero ([PR #54](https://github.com/alvariitoSW/fiebres-neutropenias/pull/54)) · **Vueltas:** 2 · **Jueces:** `jueces --atlas stress` ✓ · auditoría ✓ (0 graves, 2 menores aplicados)

## Qué se hizo
- `js/modules/eco/atlas/cap-stress.html`: traducción completa del capítulo del original (echodemo `index.html` #ch-stress, l. 2271-2324): principio y cascada isquémica (Pellikka 2020, Nesto 1987), protocolo con dobutamina 5-40 µg/kg/min y atropina, FC objetivo (220 − edad y Tanaka 2001), criterios de parada y contraindicaciones, imágenes en pantalla de cuatro (Boudoulas 1981) y contraste, puntuación 1-5 e índice, respuestas normal, isquémica, fija y viable (bifásica, 4-5 segmentos), alto riesgo y pronóstico (1500 pacientes; S 88 %, E 83 %), otros usos (Lancellotti 2017).
- Cuatro tablas (FC objetivo, puntuación, pronóstico por índice), dos ecuaciones, nota de fidelidad (1,7 cae en dos grupos en la fuente) y «Los casos de la figura» (regla del original, de `src/ch/stress.js`: 7 casos, paradas a 20 y 30 µg/kg/min, índice con 16 segmentos).
- Remisiones (numeración de la app): eject 09, fill 10, segments 11, as 15. El cap. 13 enlaza ya al 12 con su botón (solo había una mención «capítulo 12, aún en el original», no dos).
- `atlas.js` (entrada `stress` sin figura), README de la eco, `docs/historial/eco.md` (ya son 16 de 30) y versión 20261030-27.

## Qué no se pudo hacer o leer
- Figura, pruebas, preguntas y profesor esperan a `mv-eco-2a5`.

## Para el usuario
- Mirar el capítulo en el móvil (Eco cardíaca → Atlas → 12 · Eco de estrés). Fase A: no hace falta decidir nada.
- **Abrir sesión nueva para el cap. 22 `hcm`** con el encargo de abajo (el linaje de sesiones va por 8 de 8).

## Visto de paso (no tocado)
- El cap. 16 (`ar`, PR #49) sigue sin estar en `main`.
- El auditor propone «motilidad parietal» en vez de «contractilidad» para *wall motion*; el cap. 11 ya usa «índice de contractilidad segmentaria», así que se mantiene por coherencia.

## Vueltas
| Vuelta | Quién | Motivo | Resultado |
|---|---|---|---|
| 1 | director | traducción | jueces ✅ |
| 2 | director | auditoría: 0 graves; menores aplicados («hipocinético grave o acinético»; la frase de los casos marcada como lectura de los datos del original) | aplicado, jueces ✅ |

## Gasto / Cuentas
Presupuesto 0,3-0,6 M. Auditor sonnet 0,086 M (4 herram.); director ≈0,2 M. Total ≈0,3 M, dentro del presupuesto (sin desvío: no hace falta `/ahorro`).

## Siguiente: encargo de `hcm` (para la sesión nueva)
`/plan-socialista atlas-texto` — Capítulo siguiente: `hcm` (22, Miocardiopatía hipertrófica), en el orden del Objetivo 1. Fase A: solo el texto, igual que los caps. 12 (`stress`, PR #54), 13 (`strain`, PR #53) y 11 (`segments`, PR #52).
- Rama `auto/atlas-texto-hcm` desde `origin/main`, PR en borrador. Formato de `cap-stress.html` y `cap-strain.html`; entrada en `CAPITULOS` de `atlas.js` sin `figura`. La app usa VI, FEVI, TSVI, SAM, IM.
- Fuente: `git clone --depth 1 https://github.com/douyang/echodemo /tmp/echodemo`; prosa en `index.html` l. 2127-2200 (`<article id="ch-hcm">`); comentarios de `src/ch/hcm.js` (805 líneas; solo comentarios y tablas). Referencias: lang2015, nagueh2022, nagueh2025, ommen2024, arbelo2023, pollick1984, zoghbi2017 (todas ya en `referencias.js`).
- Remisiones por `data-go`, numeración de la app: `as` → botón (15); `fill` → botón (10); `stress` → botón (12); `mr` → «capítulo 18, aún en el original» (sin entrada en `CAPITULOS`); `amyloid` → «capítulo 23, aún en el original». Si ya existe alguna mención «capítulo 22, aún en el original», pásala a botón `data-at-cap="hcm"`.
- Método: el director traduce, `node autonomo/jueces.mjs --atlas hcm`, auditor ciego sonnet (general-purpose, ~12 pasos; avisarle de la numeración de la app). Presupuesto 0,3-0,6 M. Sin figuras, preguntas ni profesor; no tocar `motor.mjs` ni el `b3`; no editar la fila del tablero. Versión `20261030-28` o superior a la de `main`.
- Cierre automático: jueces en verde y auditoría sin graves → fusionar a `main`, «ya son 17 de 30» en `docs/historial/eco.md`, fila en `SESIONES.md`, y abrir la sesión del siguiente capítulo del Objetivo 1 (o dejar su encargo si `create_session` lo rechaza).
