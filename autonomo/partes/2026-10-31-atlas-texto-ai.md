# 2026-10-31 · atlas-texto · cap. 24 Interpretación y medidas con IA (fase A, solo texto) — cierre de la tarea

**Resultado:** fusionado a `main` por el cierre automático del tablero (PR de `auto/atlas-texto-ai`) · **Vueltas:** 1 · **Jueces:** `jueces --atlas ai` ✓ · auditoría ciega ✓ (0 graves, 6 menores: 3 arreglados, 3 sin cambio)

## Qué se hizo
- El Objetivo 1 marcaba `ai` «probablemente necesita humano»: la figura (los dos modelos sobre un estudio simulado) depende del ecógrafo nuevo, pero el texto sí se podía traducir. Se hizo solo el texto.
- `js/modules/eco/atlas/cap-ai.html`: traducción completa del capítulo (echodemo `index.html`, `<article id="ch-ai">`): modelos que leen ecocardiogramas (EchoCLIP, 77 frente a 512 tokens), las cuatro partes de EchoPrime (58 vistas en 11 grupos, mViT de 16 fotogramas 224 × 224 a 512 números, PubMedBERT, 165 pesos de atención anatómica), recuperación con los 50 estudios más cercanos y las ~150 cabezas de tarea, EchoNet-Measurements (18 medidas, mapas de calor, calibración DICOM), los siete pasos de la figura con su nota de simulación (± 10 %), rendimiento (AUC 0,92; EAM de la FEVI 4,79; cobertura 0,796 y 0,839), límites y ensayos (He 2023: 16,8 % frente a 27,2 %; AI ECHO INSIGHT).
- Tabla nativa de las 18 medidas de la figura (`B` y `D` de `src/ch/measure.js`), con nota plegable de origen (E y E/A salen de un mismo modelo) y nota de la numeración (32 → 24). Botones a los capítulos 04 y 09. Las 10 citas ya estaban en `referencias.js`.
- `atlas.js`, README de la eco, `docs/historial/eco.md` (29 de 30), tablero (`atlas-texto` → hecha) y versión 20261031-7.
- Revisión del encargo: la hizo el director sin agente (receta repetida; encargo al final del parte de `tee`).

## La cuenta «N de 30»
- En `main`: **29 de 30** capítulos con texto. El que falta, 18 Insuficiencia mitral (`mr`), tiene su texto hecho y auditado en la PR #2 (`auto/mr`), que espera la fase B (tarea `mr`, aparcada en la bitácora B-002). La tarea `atlas-texto` («los 20 que faltan», sin `mr`) queda **hecha**.

## Qué no se pudo hacer o leer
- La figura, las pruebas, las preguntas y el profesor de los capítulos solo texto esperan al ecógrafo nuevo (`mv-eco-2a5`).

## Para el usuario
- Mirar el capítulo en el móvil (Eco cardíaca → Atlas → 24 · Interpretación y medidas con IA), sobre todo que la tabla de 18 medidas se deslice bien de lado. Decidir, cuando quieras, si `mr` sale de la PR #2 solo con su texto (para tener 30 de 30 en `main`) o espera a su fase B.

## Visto de paso (no tocado)
- Nada.

## Vueltas
| Vuelta | Quién | Motivo | Resultado |
|---|---|---|---|
| 1 | director | traducción | jueces ✅ |
| 1b | director | 3 menores de la auditoría (tipo Doppler o modo M sin inferir; cita añadida en «En 30 segundos»; origen de los rótulos de los pasos en la nota) | jueces ✅ |

Menores sin cambio: los enlaces a los capítulos 04 y 09 (añadidos de la app, correctos), el subtítulo (lo pinta el índice) y los mandos de la figura (esperan a la figura).

## Gasto / Cuentas
Presupuesto 0,45 M (tope 0,6 M). Auditor sonnet ≈0,06 M; director ≈0,25 M. Total ≈0,3 M, dentro del presupuesto. Sin recortes de Hacienda (<2 M).

## Propuestas sobre las reglas
- Ninguna.

## Siguiente
- Ninguno dentro de `atlas-texto`: la tarea está hecha. No se abre sesión nueva.
