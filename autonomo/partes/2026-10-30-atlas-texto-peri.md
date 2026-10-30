# 2026-10-30 · atlas-texto · cap. 21 Enfermedad pericárdica (fase A, solo texto)

**Resultado:** listo en la rama `auto/atlas-texto-peri`, sin subir (la sesión no tuvo permiso de escritura en el repositorio) · **Vueltas:** 2 · **Jueces:** `jueces --atlas peri` ✓ · auditoría ✓ (0 graves)

## Qué se hizo
- `js/modules/eco/atlas/cap-peri.html`: traducción completa del cap. 21 (fuente: echodemo `index.html` #ch-peri, l. 1993-2064; tablas de `src/ch/peri.js` 319-336; diferencias con la restrictiva de `src/constriction.js` 532-545; corte del tabique de `constriction.js` 29). Carril «En 30 segundos», tres tablas (tamaño, signos de taponamiento, constricción frente a restrictiva), trampas, puntos clave, nota de fidelidad (volumen >500 mL solo en la tabla; VCI 2,1 cm ASE frente a 20 mm ESC 2025) y lo que sale del código rotulado «regla del original». `src/norms.js` no tiene bandas del pericardio.
- `atlas.js`: entrada `peri` en `CAPITULOS`, sin figura. README de la eco, `docs/historial/eco.md` y versión 20261030-22.
- Sin lector-fuente ni revisor ni constructor aparte: el director tradujo (tarea de texto que copia `cap-tr`).

## Qué no se pudo hacer o leer
- Subir la rama y abrir la PR: el proxy de git rechazó el push (el repositorio no estaba en las fuentes de la sesión). Hace falta reconectar GitHub y volver a pedir el acceso.
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

## Gasto
Auditor sonnet 0,11 M (11 herram.); director ≈0,15 M. Total ≈0,26 M, dentro de 0,3-0,6 M.
