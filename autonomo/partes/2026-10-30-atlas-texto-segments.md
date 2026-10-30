# 2026-10-30 · atlas-texto · cap. 11 Contractilidad segmentaria (fase A, solo texto)

**Resultado:** fusionado a `main` por el cierre automático del tablero ([PR #52](https://github.com/alvariitoSW/fiebres-neutropenias/pull/52)) · **Vueltas:** 2 · **Jueces:** `jueces --atlas segments` ✓ · auditoría ✓ (0 graves reales)

## Qué se hizo
- `js/modules/eco/atlas/cap-segments.html`: traducción completa del cap. 10 del original (echodemo `index.html` #ch-segments, l. 996-1040): nomenclatura de los 17 segmentos, puntuación 1-4 (+5 aneurismático, Taub 2025), índice de contractilidad segmentaria, vistas apicales y sus paredes, patrones de oclusión de DA, CD y Cx, territorios (Javadi 2010, 72 % con algún segmento de otra arteria) y strain regional (Thomas 2025). Carril «En 30 segundos», ecuación del índice y puntos clave.
- Dos tablas con datos del código, rotuladas «regla del original»: segmentos de cada vista apical (`VIEWS` de `src/ch/segments.js`, Lang 2015 fig. 4) y los 17 segmentos con su arteria (`SEG_NAMES` y `TERRITORY` de `src/aha.js`). Párrafo de reglas del código: presets por arteria, movimiento sistólico 1 / 0,45 / 0 / −0,35, índice sobre 16 y ejemplo DA acinética = 28 ÷ 16 = 1,75.
- Nota de fidelidad: el original anuncia 17 segmentos, pero puntúa en 16 (el 17 no entra en el índice) y la figura no tiene la puntuación 5.
- Remisión: strain → «capítulo 13, aún en el original» (numeración de la app). `src/norms.js` no tiene nada de segmentos.
- `atlas.js` (entrada `segments` sin figura), README de la eco, `docs/historial/eco.md` (ya son 14 de 30) y versión 20261030-25.

## Qué no se pudo hacer o leer
- Figura, pruebas, preguntas y profesor esperan a `mv-eco-2a5`.

## Para el usuario
- Mirar el capítulo en el móvil (Eco cardíaca → Atlas → 11 · Contractilidad segmentaria). Fase A: no hace falta decidir nada.

## Visto de paso (no tocado)
- El cap. 16 (`ar`, PR #49) sigue sin fusionar en `main` (rama `auto/atlas-texto-ar` 2 commits por delante). Al entrar, choca en una línea de `atlas.js`, README, historial («ya son N») y versión: se suman.
- Terminología: el original dice «wall motion» y la app lo llama «contractilidad segmentaria» (título del índice); el auditor sugiere «motilidad parietal». Se deja como en el índice.

## Propuestas sobre las reglas
- Al auditor ciego, decirle que las remisiones usan la numeración de la app (`atlas-ouyang.js`), no la del original: marcó como grave un «capítulo 13» correcto.

## Vueltas
| Vuelta | Quién | Motivo | Resultado |
|---|---|---|---|
| 1 | director | traducción | jueces ✅ |
| 2 | director | auditoría: 1 «grave» falso (numeración), 2 menores de redacción | aplicado, jueces ✅ |

## Gasto / Cuentas
Presupuesto 0,3-0,6 M. Auditor sonnet 0,085 M (9 herram.); director ≈0,2 M. Total ≈0,3 M, dentro del presupuesto (sin desvío: no hace falta `/ahorro`).
