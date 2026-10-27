# 2026-10-27 · propuestas-movil

**Resultado:** hecha, directo a `main` (tipo `arreglo`; sin PR)
**Vueltas:** 1 · **Jueces:** `jueces.mjs` ✓ · `--modelo` ✓ en agua, capilar, catéter, inmersión, muralla, telar y vaso;
ácido-base ❌ solo por el tope ya conocido (pH 6,36 con PaCO₂ 90, ya en `main`; parte `movil-existente`)

## Qué se hizo
- **Pieza común `js/core/frase-vista.js`** (`verFrase`, `seguirFrase`): agua, ácido-base, telar, muralla e inmersión
  dejan su solución propia y la usan. Capilar, catéter y vaso no tienen frase bajo el dock: sin cambios.
- **Regla del suelo de letra SVG ≈ 9,3** en `REGLAS.md` §4.8 R1 y en la lista del constructor.
- **Fusionar `main` a la vista** en la skill `plan-socialista` («Entregas sin esperar»).
- Historial en `docs/historial/trabajo-autonomo.md`. Versión 20261027-42.
- Prueba guardada: `autonomo/bloques/b3/herramientas/frase-vista.mjs` (390×844, agua y telar).

## Qué no se pudo hacer o leer
Nada bloqueado. `seguirFrase` aún no lo usa ningún modelo (cada uno conserva su enganche).

## Para el usuario
Nada que decidir. Si en el móvil la frase de río y mar o de telar se mueve raro al tocar un mando, avisa.

## Visto de paso (no tocado)
- Ácido-base: el tope de PaCO₂ 90 da pH 6,36 (propuesta `topes-acidobase`, sigue pendiente).

## Gasto
Constructor sonnet: 22 herramientas, ~53 k tokens (presupuesto 45 pasos / 0,8 M: cumplido de sobra). La corrida
conjunta de 8 `--modelo` pasa de 600 s: mejor lanzarlos uno a uno.

## Vueltas
| Pieza | Vuelta | Nota profesor | Modelo | Pasos | Tokens eq. | Qué falló |
|---|---|---|---|---|---|---|
| frase-vista | 1 | — (técnica) | sonnet | 22 | 53 k | nada |
