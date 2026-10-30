# 2026-10-30 · atlas-texto · cap. 16 Insuficiencia aórtica (fase A, solo texto)

**Resultado:** en revisión (PR: https://github.com/alvariitoSW/fiebres-neutropenias/pull/49) · **Vueltas:** 2 · **Jueces:** `jueces --atlas ar` ✓ · auditoría ✓ (0 graves, 0 medianos)

## Qué se hizo
- `js/modules/eco/atlas/cap-ar.html`: traducción completa del cap. 16 (fuente: echodemo `index.html` #ch-ar, l. 1450-1494; tabla de grados de `src/norms.js` 178-192; grados I-IV, criterios de la Fig. 25 y regla integrada de `norms.js` 418-503; comentarios de `src/ch/ar.js` 1-60, 357-361, 750-770). Carril «En 30 segundos», tres tablas (grados por medida, grados cuantitativos I-IV, criterios específicos con su cifra), método volumétrico, trampas y puntos clave. Lo del código, rotulado «regla del original» (convergencia por observador, CW tenue <30 mL, DTDVI 58 mm, aorta descendente 10/20 cm/s, indeterminado con 4+4, «grave con disfunción del VI», ORE = Vreg ÷ ITV, CW 3-6 m/s).
- `atlas.js`: entrada `ar` en `CAPITULOS`, sin figura. README de la eco, `docs/historial/eco.md` y versión 20261030-23.
- Sin lector-fuente, revisión de encargo, revisor ni constructor: el director tradujo (tarea de texto que copia `cap-tr`/`cap-peri`; método del encargo).

## Qué no se pudo hacer o leer
- Figura, pruebas, preguntas y profesor esperan a `mv-eco-2a5`.

## Para el usuario
- Mirar el capítulo en el móvil (Eco cardíaca → Atlas → 16 · Insuficiencia aórtica). Fase A: no hace falta decidir nada.

## Visto de paso (no tocado)
- `main` aún no tiene los caps. 15, 19 y 21 (PR #43, #45, #48): `atlas.js`, README, historial y versión chocarán en una línea cada uno; se resuelven sumando.
- La remisión a la mitral («chapter 14» del original) va como «capítulo 17, aún en el original» hasta que entre `ms`.

## Propuestas sobre las reglas
- Ninguna.

## Vueltas
| Vuelta | Quién | Motivo | Resultado |
|---|---|---|---|
| 1 | director | traducción | jueces ✅ |
| 2 | director | auditoría: 0 graves, 0 medianos, 1 menor útil (la fila ≥20 cm/s es la inversión «prominente» de la EACVI) | aplicado, jueces ✅ |

## Gasto / Cuentas
Presupuesto 0,3-0,6 M. Auditor sonnet 0,09 M (5 herram.); director ≈0,15 M. Total ≈0,24 M, por debajo del presupuesto (desvío negativo: no hace falta `/ahorro`).
