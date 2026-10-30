# 2026-10-30 · atlas-texto · cap. 22 Miocardiopatía hipertrófica (fase A, solo texto)

**Resultado:** fusionado a `main` por el cierre automático del tablero (PR de `auto/atlas-texto-hcm`) · **Vueltas:** 2 · **Jueces:** `jueces --atlas hcm` ✓ (y `--atlas ar` ✓ tras fusionar `main`) · auditoría ✓ (0 graves, 3 menores aplicados)

## Qué se hizo
- `js/modules/eco/atlas/cap-hcm.html`: traducción completa del capítulo (echodemo `index.html` l. 2127-2200): definición y medida (≥15 mm; 13-14 mm en familiares o genética positiva; cociente septo/pared posterior >1,3), SAM y su gravedad en modo M, regresión de Pollick, gradiente del TSVI (4V², ≥30 mmHg obstrucción, provocación si <50 mmHg, umbral de 50 mmHg para tratamiento avanzado), chorro del TSVI en daga frente al de la IM, función del VI, presión de la AI (Nagueh 2025), factores de riesgo de muerte súbita y diagnóstico diferencial (atleta, HTA, amiloidosis).
- Dos tablas (gravedad del SAM, obstrucción del TSVI, de `obsRows`/`samRows` de `src/ch/hcm.js`), dos ecuaciones y «Los casos de la figura» (regla del original: mando de 9 a 25 mm, Valsalva, rótulos por grosor y obstrucción, corazones fenocopia).
- Remisiones (numeración de la app): fill 10, stress 12, strain 13, as 15 con botón; mr 18 y amyloid 23 «aún en el original». No había ninguna mención «capítulo 22, aún en el original».
- `atlas.js` (entrada `hcm` sin figura), README de la eco, `docs/historial/eco.md` (ya son 18 de 30, tras el 16 `ar` que entró a la vez) y versión 20261030-42.

## Qué no se pudo hacer o leer
- Figura, pruebas, preguntas y profesor esperan a `mv-eco-2a5`.

## Para el usuario
- Mirar el capítulo en el móvil (Eco cardíaca → Atlas → 22 · Miocardiopatía hipertrófica). Fase A: no hace falta decidir nada.

## Visto de paso (no tocado)
- Con `ar` ya en `main`, puede quedar alguna mención «capítulo 16, aún en el original» en otros capítulos: la próxima sesión del atlas la pasa a botón.
- El auditor sugiere que «capítulo N, aún en el original» confunde; es la convención del atlas para capítulos sin entrada en `CAPITULOS`, se mantiene.

## Vueltas
| Vuelta | Quién | Motivo | Resultado |
|---|---|---|---|
| 1 | director | traducción | jueces ✅ |
| 2 | director | auditoría: 0 graves; menores aplicados («con mayor frecuencia», septo en la base y el medio, cita arbelo2023 en «En 30 segundos»); fusión de `main` (cap. 16) con conflictos en historial e `index.html` resueltos | jueces ✅ |

## Gasto / Cuentas
Presupuesto 0,3-0,6 M. Auditor sonnet ≈0,04 M (5 herram.); director ≈0,25 M. Total ≈0,3 M, dentro del presupuesto (sin `/ahorro`).

## Siguiente: encargo de `amyloid` (para la sesión nueva)
`/plan-socialista atlas-texto` — Capítulo siguiente: `amyloid` (23, Amiloidosis cardíaca), en el orden del Objetivo 1. Fase A: solo el texto, como los caps. 22 (`hcm`), 12 (`stress`) y 13 (`strain`).
- Rama `auto/atlas-texto-amyloid` desde `origin/main`, PR en borrador. Formato de `cap-hcm.html`; entrada en `CAPITULOS` de `atlas.js` sin `figura`.
- Fuente: `git clone --depth 1 https://github.com/douyang/echodemo /tmp/echodemo`; prosa en `index.html` l. 2067-2126 (`<article id="ch-amyloid">`); comentarios de `src/ch/amyloid.js` (858 líneas; solo comentarios y tablas). Referencias (todas ya en `referencias.js`): boldrini2020, bravo2019, cotella2024, esc2021, lang2015, moody2023, nagueh2025, pagourelias2017, phelan2012, rudski2010, thomas2025.
- Remisiones por `data-go`, numeración de la app: `eject` → botón (09); `fill` → botón (10); `image` → botón (02); `segments` → botón (11). Pasar a botón `data-at-cap="amyloid"` las 4 menciones «capítulo 23, aún en el original» (`cap-diastolica.html`, `cap-hcm.html`, `cap-peri.html`, `cap-strain.html`).
- Método: el director traduce, `node autonomo/jueces.mjs --atlas amyloid`, auditor ciego sonnet (~12 pasos; avisarle de la numeración de la app). Presupuesto 0,3-0,6 M. Sin figuras, preguntas ni profesor; no tocar `motor.mjs`. Versión superior a la de `main`. Fusionar `main` a la vista antes de cerrar (otras ramas del atlas suben a la vez).
- Cierre automático: jueces en verde y auditoría sin graves → fusionar a `main`, «ya son 19 de 30» en el historial, fila en `SESIONES.md`, y abrir la sesión del siguiente (`aorta`).
