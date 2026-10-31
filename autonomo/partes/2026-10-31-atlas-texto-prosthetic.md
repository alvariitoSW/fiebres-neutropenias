# 2026-10-31 · atlas-texto · cap. B2 Prótesis valvulares (fase A, solo texto)

**Resultado:** fusionado a `main` por el cierre automático del tablero (PR de `auto/atlas-texto-prosthetic`) · **Vueltas:** 1 · **Jueces:** `jueces --atlas prosthetic` ✓ · auditoría ciega ✓ (0 graves, 6 menores, todos aceptados)

## Qué se hizo
- `js/modules/eco/atlas/cap-prosthetic.html`: traducción completa del capítulo (echodemo `index.html`, `<article id="ch-prosthetic">`): la imagen de la prótesis aórtica y cuándo ETE, la ETT basal y el seguimiento a los 5 y 10 años, el gradiente 4V² y 4(V2² − V1²), la AOE por continuidad frente a su referencia, el diámetro del TSVI medido, el DVI (≤0,35), la recuperación de presión de la bivalva, el contorno y el tiempo de aceleración (80/100 ms; TA/TE 0,32/0,37), la regla de la estenosis significativa, la obstrucción (>50 % o >10 mmHg), la desproporción (0,85; 0,66-0,85 y ≤0,65; con IMC ≥30, 0,70 y 0,55), el algoritmo de la ASE con velocidad >3 m/s, ETE, fluoroscopia y TC (73-90°), trombo frente a pannus (200 UH) y la fuga paravalvular (10 % y 30 %).
- «La figura del original» con las tablas 5 y 7 de la ASE 2024 tal como las pinta (`stenRows`, `ppmRows`, `colsOf`, `measure` de `src/ch/prosthetic.js`; AOE de 23 mm: Perimount 1,6 ± 0,3 y St. Jude Standard 1,6 ± 0,4) y nota plegable de origen. Remisiones con botón a los capítulos 15 y 08; nota con la numeración del original. Las 3 citas ya estaban en `referencias.js`.
- `atlas.js` (entrada `prosthetic` sin figura), README de la eco, `docs/historial/eco.md` (ya son 26 de 30), tablero y versión 20261031-4.
- **Arreglo de juez (commit aparte, sin bajar umbrales):** `jueces.mjs` se caía al arrancar el servidor con un fallo de Node 22 (`assert(!this.paused)` en undici) porque la primera petición no leía su respuesta; ahora la lee. Reproducido fuera de los jueces con `fetch` a `http.server`.
- Revisión del encargo: la hizo el director sin agente (receta repetida; encargo en el parte de `endocarditis`).

## Qué no se pudo hacer o leer
- La figura, las pruebas, las preguntas y el profesor esperan a `mv-eco-2a5`.

## Para el usuario
- Mirar el capítulo en el móvil (Eco cardíaca → Atlas → B2 · Prótesis valvulares). Es la fase A: no hace falta decidir nada.

## Visto de paso (no tocado)
- Nada.

## Vueltas
| Vuelta | Quién | Motivo | Resultado |
|---|---|---|---|
| 1 | director | traducción | jueces ✅ (tras el arreglo del arranque del servidor) |

Auditoría: 0 graves; los 6 menores son de forma (lista en lugar de párrafo para el algoritmo, paráfrasis de la figura, nota de la regla de la figura) y se aceptan.

## Gasto / Cuentas
Presupuesto 0,45 M (tope 0,6 M). Auditor sonnet ≈0,05 M; director ≈0,25 M (el fallo de los jueces costó ~4 pasos). Total ≈0,3 M, dentro del presupuesto. Sin recortes de Hacienda (<2 M).

## Propuestas sobre las reglas
- Ninguna. (El fallo de Node se arregló en el juez; si vuelve en otros programas de prueba con `fetch` sin leer el cuerpo, misma receta.)

## Siguiente: encargo de `lvad` (para la sesión nueva)
`/plan-socialista atlas-texto` — Capítulo siguiente: `lvad` (marcado «probablemente necesita humano» en el Objetivo 1: si el texto es posible, se hace solo el texto; si no, se para y se apunta). Rama `auto/atlas-texto-lvad` desde `origin/main`; prosa en `index.html` (`<article id="ch-lvad">`, línea ~1340), grados en `src/ch/lvad.js`. Cierre automático igual («ya son 27 de 30»); después, `tee` y `ai`.
