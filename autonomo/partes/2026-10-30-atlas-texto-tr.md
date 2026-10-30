# 2026-10-30 · atlas-texto · cap. 19 Insuficiencia tricuspídea (fase A, solo texto)

**Resultado:** en revisión (PR: ver abajo) · **Vueltas:** 2 · **Jueces:** pruebas ✓ · móvil ✓ (390/360) · auditoría ✓ (0 graves)

## Qué se hizo
- `js/modules/eco/atlas/cap-tr.html`: traducción completa del cap. 19 (fuente: echodemo `index.html` #ch-tr, l. 1612-1662; tabla de `src/norms.js` 193-206; criterios de la Fig. 31 de `norms.js` 535-552), con carril «En 30 segundos», tabla de grados leve → torrencial, tabla nueva de los 7 + 7 criterios específicos (lo que sale de comentarios del código, rotulado «regla del original»), trampas, puntos clave, nota de fidelidad con 3 discrepancias (VCI <2 frente a ≤2,0; VC >0,7 frente a ≥0,7; PISA a 30-40 frente a 28 cm/s) y aviso «En preparación · Figura y estudio».
- `atlas.js`: entrada `tr` en `CAPITULOS`, sin figura. README de la eco, `docs/historial/eco.md` y versión 20261030-21.
- Revisión del encargo: la hizo el director con la lista (tarea de texto que copia `cap-as`); sin lector-fuente ni revisor, como el cap. 15.

## Qué no se pudo hacer o leer
- Nada. Figura, pruebas, preguntas y profesor esperan a `mv-eco-2a5`.
- El tablero no se toca en esta rama: la fila `atlas-texto` es común a los 20 capítulos y ya la cambia la rama del cap. 15 (evita conflictos).

## Para el usuario
- Mirar el capítulo en el móvil (Eco cardíaca → Atlas → 19 · Insuficiencia tricuspídea). Fase A: no hace falta decidir nada.

## Visto de paso (no tocado)
- `main` aún no tiene el cap. 15 (PR #43): al fusionar las dos PR, `atlas.js` (`CAPITULOS`), README, historial y versión chocarán en una línea cada uno; se resuelven sumando las dos.

## Propuestas sobre las reglas
- Ninguna.

## Vueltas
| Vuelta | Quién | Motivo | Resultado |
|---|---|---|---|
| 1 | constructor sonnet (8 pasos) | traducción | jueces ✅ |
| 2 | mismo constructor (2 pasos) | auditoría: 0 graves, 2 medianos («4 de 7» sin atribuir; faltaban los 7 + 7 criterios), 4 menores (discrepancias sin nota) | corregidos, jueces ✅ (suite completa ✅) |

## Gasto
Total **0,30 M** (`gasto.mjs --clave atlas-texto`): constructor sonnet 0,14 M (10 herram.), auditor sonnet 0,08 M (6 herram.), director ≈0,08 M.
Dónde se fue: casi la mitad en el constructor; la ruta exacta con líneas en el encargo lo dejó en 10 pasos (el cap. 15 necesitó 20).

## Cuentas
Presupuesto 0,62 M (sin lector-fuente, sin revisor, revisión del encargo sin agente) · gastado 0,30 M · desvío **−52 %** (encargo con rutas y líneas exactas; vuelta en el mismo agente). Para los 18 que quedan, ≈0,3-0,6 M por capítulo.
