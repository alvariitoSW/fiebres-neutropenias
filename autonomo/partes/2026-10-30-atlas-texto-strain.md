# 2026-10-30 · atlas-texto · cap. 13 Strain (fase A, solo texto)

**Resultado:** fusionado a `main` por el cierre automático del tablero (PR en borrador abajo) · **Vueltas:** 2 · **Jueces:** `jueces --atlas strain` ✓ · auditoría ✓ (0 graves, 2 menores aplicados)

## Qué se hizo
- `js/modules/eco/atlas/cap-strain.html`: traducción completa del cap. 12 del original (echodemo `index.html` #ch-strain, l. 2202-2269): strain y speckle tracking (S = (L − L0) ÷ L0), valores normales (−20 %; bandas −18/−16 % de Thomas 2025; 3,7 unidades entre fabricantes), FEVI de la mujer, patrones global, regional y de respeto apical (strain apical relativo ≥1,0, Phelan 2012; Cotella 2024), cardio-oncología (CTRCD leve, moderada y grave de la ESC 2022, biomarcadores, Plana 2014, SUCCOUR a 1 y 3 años). Carril «En 30 segundos», dos ecuaciones y puntos clave.
- Tres tablas con datos del código (`src/ch/strain.js` `tables()`): GLS (ASE/EACVI 2025), FEVI de mujeres (Lang 2015) y CTRCD (ESC 2022, Tabla 3). Párrafo «regla del original» con el cálculo de la caída relativa del GLS y la condición de caída nueva de la FEVI (`ctrcdGrade`). Nota de fidelidad: FEVI >74 % graduada como normal y el rango de los hombres (41-51 %, `src/norms.js`).
- Remisiones (numeración de la app): eject → botón capítulo 09; segments → botón capítulo 11; stress → «capítulo 12, aún en el original»; amyloid → «capítulo 23, aún en el original». El cap. 11 ya enlaza al 13 con su botón.
- `atlas.js` (entrada `strain` sin figura), README de la eco, `docs/historial/eco.md` (ya son 15 de 30) y versión 20261030-26.

## Qué no se pudo hacer o leer
- Figura, pruebas, preguntas y profesor esperan a `mv-eco-2a5`. El strain de la pared libre del VD y el de reservorio de la AI no los nombra el texto: no entran.

## Para el usuario
- Mirar el capítulo en el móvil (Eco cardíaca → Atlas → 13 · Strain). Fase A: no hace falta decidir nada.

## Visto de paso (no tocado)
- El cap. 16 (`ar`, PR #49) sigue sin estar en `main`.

## Vueltas
| Vuelta | Quién | Motivo | Resultado |
|---|---|---|---|
| 1 | director | traducción | jueces ✅ |
| 2 | director | auditoría: 0 graves, 2 menores («wall motion» → movimiento de la pared; biomarcadores en el carril de 30 s) | aplicado, jueces ✅ |

## Gasto / Cuentas
Presupuesto 0,3-0,6 M. Auditor sonnet 0,087 M (4 herram.); director ≈0,2 M. Total ≈0,3 M, dentro del presupuesto (sin desvío: no hace falta `/ahorro`).

## Siguiente
Sesión nueva para `stress` (cap. 12 Eco de estrés, fila 9 del Objetivo 1).
