# 2026-10-30 · atlas-texto · cap. 17 Estenosis mitral (fase A, solo texto)

**Resultado:** fusionado a `main` por el cierre automático del tablero (PR: ver abajo) · **Vueltas:** 2 · **Jueces:** `jueces --atlas ms` ✓ · auditoría ✓ (0 graves, 0 medianos)

## Qué se hizo
- `js/modules/eco/atlas/cap-ms.html`: traducción completa del cap. 17 (fuente: echodemo `index.html` #ch-ms, l. 1496-1545; tabla y nota de `src/norms.js` 150-162; regla integrada `msIntegrated` de `norms.js` 337-369; comentarios de `src/ch/ms.js` 1-12, 38-60, 80-81, 182). Carril «En 30 segundos», estadios ACC/AHA, bandas leve/moderada de la ASE, tabla de grados (Pandian 2023 Tabla 1), graduación por planimetría, ecuación 220 ÷ tiempo de hemipresión, gradiente con la frecuencia, ejercicio (Sagar 1987) y puntos clave. Lo del código, rotulado «regla del original» (área ≥4,0 cm² normal, gradiente solo a 60-80 lpm, gasto mantenido, PAP por 4v² + PAD, pendiente E-F).
- Nota de fidelidad: la prosa dice PAP sistólica «>50 mmHg» y la tabla «≥50»; se reproducen las dos.
- Remisiones: «chapter 08» → botón cap. 08; «chapter 12» → botón cap. 15; «chapter 07» (VCI, sin capítulo en la app) → texto «el capítulo 08 la estima por la VCI».
- `atlas.js`: entrada `ms` en `CAPITULOS`, sin figura. README de la eco, `docs/historial/eco.md` (ya son 13 de 30) y versión 20261030-24.
- Sin lector-fuente, revisión de encargo, revisor ni constructor: el director tradujo (método del encargo, copia de `cap-ar`).

## Qué no se pudo hacer o leer
- Figura, pruebas, preguntas y profesor esperan a `mv-eco-2a5`.

## Para el usuario
- Mirar el capítulo en el móvil (Eco cardíaca → Atlas → 17 · Estenosis mitral). Fase A: no hace falta decidir nada.

## Visto de paso (no tocado)
- El cap. 16 (`ar`, PR #49) seguía sin fusionar al empezar; si entra después, choca en una línea de `atlas.js`, README, historial y versión: se suman.

## Propuestas sobre las reglas
- Ninguna.

## Vueltas
| Vuelta | Quién | Motivo | Resultado |
|---|---|---|---|
| 1 | director | traducción | jueces ✅ |
| 2 | director | auditoría: 0 graves, 0 medianos; 2 menores (rótulo «regla del original» que faltaba; aclarar «5 veces» frente a «casi se duplica») + nota de fidelidad >50/≥50 | aplicado, jueces ✅ |

## Gasto / Cuentas
Presupuesto 0,3-0,6 M. Auditor sonnet 0,09 M (8 herram.); director ≈0,2 M. Total ≈0,3 M, dentro del presupuesto (sin desvío: no hace falta `/ahorro`).
