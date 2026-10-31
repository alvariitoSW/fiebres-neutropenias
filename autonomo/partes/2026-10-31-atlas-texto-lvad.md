# 2026-10-31 · atlas-texto · cap. B1 Asistencias ventriculares (fase A, solo texto)

**Resultado:** fusionado a `main` por el cierre automático del tablero (PR de `auto/atlas-texto-lvad`) · **Vueltas:** 1 · **Jueces:** `jueces --atlas lvad` ✓ · auditoría ciega ✓ (0 graves, 3 menores: 2 arreglados, 1 sin cambio)

## Qué se hizo
- El Objetivo 1 marcaba `lvad` como «probablemente necesita humano» porque el motor no tiene bomba. Eso afecta a la figura, no al texto: el texto sí se podía hacer, así que se hizo solo el texto.
- `js/modules/eco/atlas/cap-lvad.html`: traducción completa del capítulo (echodemo `index.html`, `<article id="ch-lvad">`): la HeartMate 3 (4.800-5.600 rpm) y su pulso artificial (−2.000 rpm 0,15 s, +4.000 rpm 0,20 s, cada 2 s; entrada <1,0 m/s, hasta 1,2 m/s; injerto <2 m/s), el estudio de seguimiento (2 semanas o alta, 1-3-6-12 meses; DTDVI −15 % a los 3 meses; válvula aórtica en modo M; septo; cánula; gasto por el TSVD), la rampa de 4.600 a 6.200 rpm (−0,15 cm por 100 rpm; velocidad óptima 100 rpm por debajo de la de descarga máxima), la succión (<3 cm; >1,5 m/s), el fallo del VD (<0,5 m/s; VD basal 4,1 y 4,9 cm), la IAo nueva (25-33 % al año; VC ≥0,3 cm, chorro >46 % del TSVI) y la obstrucción (≥2 m/s en el injerto).
- «La figura del original»: sus cuatro casos con las cifras de `TRACKS` de `src/ch/lvad.js`, marcadas como ilustrativas, y nota plegable de origen; nota con la numeración del original (14 → B1; 08, 13 → 14, 16). Botones a los capítulos 08, 14 y 16. Las 6 citas ya estaban en `referencias.js`.
- `atlas.js`, README de la eco, `docs/historial/eco.md` (27 de 30), tablero y versión 20261031-5.
- Revisión del encargo: la hizo el director sin agente (receta repetida; encargo al final del parte de `prosthetic`).

## Qué no se pudo hacer o leer
- La figura, las pruebas, las preguntas y el profesor esperan al ecógrafo nuevo (`mv-eco-2a5`); para la figura de este capítulo, además, el motor necesitaría una bomba.

## Para el usuario
- Mirar el capítulo en el móvil (Eco cardíaca → Atlas → B1 · Asistencias ventriculares). Fase A: no hace falta decidir nada.

## Visto de paso (no tocado)
- Nada.

## Vueltas
| Vuelta | Quién | Motivo | Resultado |
|---|---|---|---|
| 1 | director | traducción | jueces ✅ |
| 1b | director | 2 menores de la auditoría (nota de Uriel 2017 y frase de la numeración) | jueces ✅ |

Menor sin cambio: el auditor no pudo comprobar la lista de lecturas de la figura; el director la cotejó con `text()` de `lvad.js` y coincide.

## Gasto / Cuentas
Presupuesto 0,45 M (tope 0,6 M). Auditor sonnet ≈0,04 M (4 pasos); director ≈0,2 M. Total ≈0,25 M, dentro del presupuesto. Sin recortes de Hacienda (<2 M).

## Propuestas sobre las reglas
- Ninguna.

## Siguiente: encargo de `tee` (para la sesión nueva)
`/plan-socialista atlas-texto` — Capítulo siguiente: `tee` (05, ecocardiografía transesofágica; marcado «probablemente necesita humano»: si el texto es posible, solo el texto; si no, se para y se apunta). Rama `auto/atlas-texto-tee` desde `origin/main`; prosa en `index.html` (`<article id="ch-tee">`, línea ~2527), datos en `src/ch/tee.js`. Cierre automático igual («ya son 28 de 30»); después, `ai`.
