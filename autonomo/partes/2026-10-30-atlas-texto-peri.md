# 2026-10-30 · atlas-texto · cap. 21 Enfermedad pericárdica (fase A, solo texto)

**Resultado:** en revisión (PR: https://github.com/alvariitoSW/fiebres-neutropenias/pull/48) · **Vueltas:** 2 · **Jueces:** `jueces --atlas peri` ✓ · auditoría ✓ (0 graves)

## Qué se hizo
- `js/modules/eco/atlas/cap-peri.html`: traducción completa del cap. 21 (fuente: echodemo `index.html` #ch-peri, l. 1993-2064; tablas de `src/ch/peri.js` 319-336; diferencias con la restrictiva de `src/constriction.js` 532-545; corte del tabique de `constriction.js` 29). Carril «En 30 segundos», tres tablas (tamaño, signos de taponamiento, constricción frente a restrictiva), trampas, puntos clave, nota de fidelidad (volumen >500 mL solo en la tabla; VCI 2,1 cm ASE frente a 20 mm ESC 2025) y lo que sale del código rotulado «regla del original». `src/norms.js` no tiene bandas del pericardio.
- `atlas.js`: entrada `peri` en `CAPITULOS`, sin figura. README de la eco, `docs/historial/eco.md` y versión 20261030-22.
- Sin lector-fuente ni revisor ni constructor aparte: el director tradujo (tarea de texto que copia `cap-tr`).

## Qué no se pudo hacer o leer
- Figura, pruebas, preguntas y profesor esperan a `mv-eco-2a5`.

## Para el usuario
- Mirar el capítulo en el móvil (Eco cardíaca → Atlas → 21 · Enfermedad pericárdica). Fase A: no hace falta decidir nada.

## Visto de paso (no tocado)
- `main` aún no tiene los caps. 15 y 19 (PR #43 y #45): `atlas.js`, README, historial y versión chocarán en una línea cada uno; se resuelven sumando.
- En el original, `sizeRows` usa `eff<20` y el grado `<=20`: en 20 mm exactos discrepan (no afecta al texto).

## Propuestas sobre las reglas
- Ninguna.

## Vueltas
| Vuelta | Quién | Motivo | Resultado |
|---|---|---|---|
| 1 | director | traducción | jueces ✅ |
| 2 | director | auditoría: 0 graves, 3 medianos (remisiones a capítulos), 6 menores | aplicados los baratos (enlace al cap. 08 en las dos frases, lista ordenada, «oscilar», «modelo», reglas del VD y la VCI), jueces ✅ |

## Después de la PR (pedido por el usuario)
- PR #48 fusionada; después, las PR #43 (cap. 15) y #45 (cap. 19) fusionadas a mano en `main`, sumando las líneas que chocaban (`atlas.js`, README, historial), versión 20261030-23, cuenta «12 de 30» y `jueces --atlas as/tr/peri` en verde.
- Tablero, fila `atlas-texto`: **cierre automático** (fusión a `main` con jueces en verde y auditoría sin graves; si no, PR en borrador para el usuario). Avisada la sesión del cap. 16, que ya cerró así junto con el 17.

## Gasto
Medido con `gasto.mjs`: director (opus) **1,4 M** + auditor sonnet ≈0,11 M = **≈1,5 M**. El cálculo previo (≈0,26 M) se quedó corto: la sesión hizo además las tres fusiones, la regla nueva y la conversación de permisos de GitHub, que repasaron muchas veces el contexto entero.
Cómo se ahorraría: arrancar con el repositorio ya en las fuentes de la sesión (sin la ida y vuelta de permisos) y dejar las fusiones a la sesión de cada capítulo (ya es la regla).
