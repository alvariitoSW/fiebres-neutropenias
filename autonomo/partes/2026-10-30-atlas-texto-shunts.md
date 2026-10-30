# 2026-10-30 · atlas-texto · cap. B4 Cortocircuitos: CIA, CIV y FOP (fase A, solo texto)

**Resultado:** fusionado a `main` por el cierre automático del tablero (PR de `auto/atlas-texto-shunts`) · **Vueltas:** 2 · **Jueces:** `jueces --atlas shunts` ✓ · auditoría ciega ✓ (0 graves, 3 menores: 1 aplicado, 2 aceptados)

## Qué se hizo
- `js/modules/eco/atlas/cap-shunts.html`: traducción completa del capítulo (echodemo `index.html` l. 2381-2434). La CIA (ostium secundum, el 80 %; vista subcostal, sin color, escala de 25-40 cm/s), la CIV (perimembranosa, el 80 %; PSVD = PAS − 4V²; restrictiva; DTDVI 58 mm, índice de volumen de la AI 34 mL/m²; IA por prolapso), el Qp/Qs (error de hasta el 20 %) y el cierre según la AHA/ACC 2018 (1,5:1; <50 %; >2/3; >40 mmHg → cateterismo), el FOP y el suero agitado (3-6 latidos, Valsalva, falsos negativos, cierre de la SCAI entre los 18 y los 60 años) y la presión de la AI por una comunicación restrictiva (PAD + 4V²; −6,2 a +3,1 mmHg; 41 ± 11 cm/s; >13 y >10 mmHg).
- «La figura del original» con su tabla de grados (`GRADES` y `measure` de `src/ch/shunts.js`), con nota plegable de origen.
- Remisiones con botón: VD → cap. 14 (en el original, el 13), Qp/Qs y VCI → cap. 08 (la VCI es el «chapter 07» archivado del original; nota plegable), algoritmo → cap. 10. Las 14 citas ya estaban en `referencias.js`.
- `atlas.js` (entrada `shunts` sin figura), README de la eco, `docs/historial/eco.md` (ya son 22 de 30), tablero y versión 20261030-47.
- Revisión del encargo: la hice yo (misma receta que `windows`, sin agente).

## Qué no se pudo hacer o leer
- La figura, las pruebas, las preguntas y el profesor esperan a `mv-eco-2a5`.

## Para el usuario
- Mirar el capítulo en el móvil (Eco cardíaca → Atlas → B4 · Cortocircuitos). Es la fase A: no hace falta decidir nada.

## Visto de paso (no tocado)
- Nada.

## Vueltas
| Vuelta | Quién | Motivo | Resultado |
|---|---|---|---|
| 1 | director | traducción | jueces ✅ |
| 2 | director | auditoría: 0 graves; aplicado el menor 1 (cita `mukherjee2025` en la tabla para el 4,1 cm); aceptados la cita `stout2018` añadida en «En 30 segundos» (coherente con el texto) y el Valsalva resumido en el punto 3 | jueces ✅ |

## Gasto / Cuentas
Presupuesto 0,3-0,6 M. Auditor sonnet ≈0,04 M (5 herramientas); director ≈0,25 M. Total ≈0,3 M, dentro del presupuesto (sin `/ahorro`).

## Siguiente: encargo de `masses` (para la sesión nueva)
`/plan-socialista atlas-texto` — Capítulo siguiente: `masses` (B5 en la app, Masas y trombos), en el orden del Objetivo 1. Fase A: solo el texto, como `windows` y `shunts`.
- Rama `auto/atlas-texto-masses` desde `origin/main`, PR en borrador. Formato de `cap-shunts.html`; entrada en `CAPITULOS` de `atlas.js` sin `figura`. Número: el de `ATLAS_PARTES` en `js/modules/eco/atlas-ouyang.js`.
- Fuente: `git clone --depth 1 https://github.com/douyang/echodemo /tmp/echodemo`; prosa en `index.html` (`<article id="ch-masses">`, l. ~1098); tablas y comentarios de `src/ch/masses.js` (por trozos). Cada `data-ref` en `referencias.js`; si falta, se añade con el DOI del original. Los capítulos archivados se resuelven con `SHOWN_IN` de `src/order.js`.
- Método: el director traduce, `node autonomo/jueces.mjs --atlas masses`, auditor ciego sonnet (~12 pasos). Presupuesto 0,3-0,6 M. Sin figuras, preguntas ni profesor; no tocar `motor.mjs`. Versión superior a la de `main`. Fusionar `main` a la vista antes de cerrar.
- Cierre automático: jueces en verde y auditoría sin graves → fusionar a `main`, «ya son 23 de 30» en el historial, tablero, fila en `SESIONES.md`, y abrir la sesión del siguiente (`mi`).
