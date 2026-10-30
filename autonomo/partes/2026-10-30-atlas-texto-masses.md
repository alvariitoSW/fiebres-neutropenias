# 2026-10-30 · atlas-texto · cap. B5 Masas y trombos (fase A, solo texto)

**Resultado:** fusionado a `main` por el cierre automático del tablero (PR de `auto/atlas-texto-masses`) · **Vueltas:** 2 · **Jueces:** `jueces --atlas masses` ✓ · auditoría ciega ✓ (0 graves, 5 menores: 2 aplicados, 3 aceptados)

## Qué se hizo
- `js/modules/eco/atlas/cap-masses.html`: traducción completa del capítulo (echodemo `index.html` l. 1098-1162). Cómo describir una masa (pediculada frente a sésil), las estructuras normales que la simulan (válvula de Eustaquio, red de Chiari, hipertrofia lipomatosa, excrecencias de Lambl ≤2 mm), el mixoma de la AI (>75 % en la AI, >90 % en la fosa oval, un tercio con embolia), el trombo del VI (11,5 % frente a 2,3 %, 17,8 % con FE <40 %, 90 % en 14 días; mural, protruyente y móvil; el 40 % de las embolias con trombos de ninguno de los dos tipos de riesgo; falsos positivos), el fibroelastoma papilar (80 % valvular, lado de salida, <20 mm, ETT 62 % y ETE 77 %, la movilidad como predictor) y el contraste, la ETE y la RM (33 % y 61 % frente a la RM).
- «La figura del original» con su tabla de grados (`LEVEL`, `PROTRUDE` y `measure` de `src/ch/masses.js`) y nota plegable de origen. Remisiones con botón: estenosis mitral → cap. 17 (en el original, el 16) y segmentos → cap. 11; nota plegable con la numeración. Las 8 citas ya estaban en `referencias.js`.
- `atlas.js` (entrada `masses` sin figura), README de la eco, `docs/historial/eco.md` (ya son 23 de 30), tablero y versión 20261030-48.
- Revisión del encargo: la hice yo (misma receta que `shunts`, sin agente).

## Qué no se pudo hacer o leer
- La figura, las pruebas, las preguntas y el profesor esperan a `mv-eco-2a5`.

## Para el usuario
- Mirar el capítulo en el móvil (Eco cardíaca → Atlas → B5 · Masas y trombos). Es la fase A: no hace falta decidir nada.

## Visto de paso (no tocado)
- Nada.

## Vueltas
| Vuelta | Quién | Motivo | Resultado |
|---|---|---|---|
| 1 | director | traducción | jueces ✅ |
| 2 | director | auditoría: 0 graves; aplicados el menor 2 (velo fusionado en la válvula bicúspide) y el 3 (los corazones y el tercer panel de la figura); aceptados el «B5» (es el número de `ATLAS_PARTES`), la frase «valores didácticos» de la nota (misma fórmula que `shunts`) y el carril de 30 segundos (lo pide REGLAS §7.13) | jueces ✅ |

## Gasto / Cuentas
Presupuesto 0,3-0,6 M. Auditor sonnet ≈0,045 M (7 herramientas); director ≈0,25 M. Total ≈0,3 M, dentro del presupuesto (sin `/ahorro`).

## Siguiente: encargo de `mi` (para la sesión nueva)
`/plan-socialista atlas-texto` — Capítulo siguiente: `mi` (B6 en la app, Complicaciones del infarto), en el orden del Objetivo 1. Fase A: solo el texto, como `shunts` y `masses`.
- Rama `auto/atlas-texto-mi` desde `origin/main`, PR en borrador. Formato de `cap-masses.html`; entrada en `CAPITULOS` de `atlas.js` sin `figura`. Número: el de `ATLAS_PARTES` en `js/modules/eco/atlas-ouyang.js`.
- Fuente: `git clone --depth 1 https://github.com/douyang/echodemo /tmp/echodemo`; prosa en `index.html` (`<article id="ch-mi">`); tablas y comentarios de `src/ch/mi.js` (por trozos). Cada `data-ref` en `referencias.js`; si falta, se añade con el DOI del original. Los capítulos archivados se resuelven con `SHOWN_IN` de `src/order.js`.
- Método: el director traduce, `node autonomo/jueces.mjs --atlas mi`, auditor ciego sonnet (~12 pasos). Presupuesto 0,3-0,6 M. Sin figuras, preguntas ni profesor; no tocar `motor.mjs`. Versión superior a la de `main`. Fusionar `main` a la vista antes de cerrar.
- Cierre automático: jueces en verde y auditoría sin graves → fusionar a `main`, «ya son 24 de 30» en el historial, tablero, fila en `SESIONES.md`, y abrir la sesión del siguiente (`endocarditis`).
