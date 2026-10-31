# 2026-10-31 · atlas-texto · cap. 05 Ecocardiografía transesofágica (fase A, solo texto)

**Resultado:** fusionado a `main` por el cierre automático del tablero (PR de `auto/atlas-texto-tee`) · **Vueltas:** 1 · **Jueces:** `jueces --atlas tee` ✓ · auditoría ciega ✓ (0 graves, 3 menores: 2 arreglados, 1 sin cambio)

## Qué se hizo
- El Objetivo 1 marcaba `tee` como «probablemente necesita humano» porque no hay sonda esofágica en el motor. Eso afecta a la figura, no al texto: el texto sí se podía hacer, así que se hizo solo el texto.
- `js/modules/eco/atlas/cap-tee.html`: traducción completa del capítulo (echodemo `index.html`, `<article id="ch-tee">`): la sonda y sus movimientos (avanzar, girar, ante- y retroflexión, rotación electrónica 0-180°; niveles EA, ME y TG), la orientación de la imagen (0°, 90°, 180°), las vistas estándar por nivel y giro (28 de Hahn 2013, 11 básicas de Reeves 2013), lo que la ETE añade a la ETT (aorta, orejuela con sensibilidad 100 % y especificidad 99 % y trombos <2 mm, ACUTE con 3 semanas de warfarina, suero agitado con >3 burbujas en 3 latidos).
- «La figura del original»: descripción de la figura y tabla nativa con sus 17 vistas (`STD` de `src/teeviews.js` e `INFO` de `src/ch/tee.js`: n.º de la guía, nivel y giro, rango, qué se ve, cómo se llega y si es básica), con nota plegable de origen y nota de la numeración (33 → 05; aorta 21 → 20). Botones a los capítulos 04, 20, B2, B3 y B4. Las 3 citas ya estaban en `referencias.js`.
- `atlas.js`, README de la eco, `docs/historial/eco.md` (28 de 30), tablero y versión 20261031-6.
- Revisión del encargo: la hizo el director sin agente (receta repetida; encargo al final del parte de `lvad`).

## Qué no se pudo hacer o leer
- La figura, las pruebas, las preguntas y el profesor esperan al ecógrafo nuevo (`mv-eco-2a5`); para la figura de este capítulo, además, la sonda esofágica (paquete B de `tee-inversa`, dentro de `mv-eco`).

## Para el usuario
- Mirar el capítulo en el móvil (Eco cardíaca → Atlas → 05 · Ecocardiografía transesofágica), sobre todo que la tabla de 17 vistas se deslice bien de lado. Fase A: no hace falta decidir nada.

## Visto de paso (no tocado)
- Nada.

## Vueltas
| Vuelta | Quién | Motivo | Resultado |
|---|---|---|---|
| 1 | director | traducción | jueces ✅ |
| 1b | director | 2 menores de la auditoría («electrónicamente»; nota de la aorta descendente sin inferencia) | jueces ✅ |

Menor sin cambio: la frase que presenta la tabla cita Hahn 2013 y Reeves 2013 aunque no está en la prosa original; es correcta, porque la tabla sale de las dos (el código del original lo dice).

## Gasto / Cuentas
Presupuesto 0,45 M (tope 0,6 M). Auditor sonnet ≈0,05 M (6 pasos); director ≈0,2 M. Total ≈0,25 M, dentro del presupuesto. Sin recortes de Hacienda (<2 M).

## Propuestas sobre las reglas
- Ninguna.

## Siguiente: encargo de `ai` (para la sesión nueva)
`/plan-socialista atlas-texto` — Capítulo siguiente y último: `ai` (24, interpretación y medidas con IA; marcado «probablemente necesita humano»: si el texto es posible, solo el texto; si no, se para y se apunta). Rama `auto/atlas-texto-ai` desde `origin/main`; prosa en `index.html` de echodemo (`<article id="ch-ai">`, línea ~1235), datos en `src/ch/ai.js`. Cierre automático igual («ya son 29 de 30»; con él, el atlas completo en texto: 30 de 30 si cuenta `mr`, revisar la cuenta). Al cerrar, la tarea `atlas-texto` pasa a `hecha`.
