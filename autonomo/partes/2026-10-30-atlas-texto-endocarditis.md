# 2026-10-30 · atlas-texto · cap. B3 Endocarditis infecciosa (fase A, solo texto)

**Resultado:** fusionado a `main` por el cierre automático del tablero ([PR #64](https://github.com/alvariitoSW/fiebres-neutropenias/pull/64), de `auto/atlas-texto-endocarditis`) · **Vueltas:** 2 · **Jueces:** `jueces --atlas endocarditis` ✓ · auditoría ciega ✓ (0 graves, 6 menores: 2 aplicados, 4 aceptados)

## Qué se hizo
- `js/modules/eco/atlas/cap-endocarditis.html`: traducción completa del capítulo (echodemo `index.html`, `<article id="ch-endocarditis">`). Los criterios mayores de imagen (Duke-ISCVID 2023: vegetación, perforación, aneurisma, absceso, pseudoaneurisma, fístula, insuficiencia nueva y dehiscencia parcial; ESC 2023: un solo criterio de imagen), las seis definiciones de la ESC (Habib 2015), ETT primero y cuándo ETE, repetir en 5-7 días, la perforación (ETT 45 %, ETE 95 %, especificidad 98 %), la vegetación (cara auricular de las AV y ventricular de la aórtica, aleteo, longitud máxima), la embolia (20-50 %, silente hasta el 50 %, baja en 2 semanas; ≥10 mm en el velo mitral anterior, >30 mm y riesgo neurológico), la cirugía con 10 mm (clase I, I y IIb; urgente = 3-5 días; AHA IIa), la perforación con IM aguda (cirugía urgente o emergente en 24 h, chorro lento y excéntrico, inversión del flujo sistólico pulmonar, vena contracta 0,3/0,7 cm) y el diagnóstico diferencial (Lambl, fibroelastoma, Libman-Sacks, cicatriz y cambio mixomatoso).
- «La figura del original» con su tabla de seis grados (`modelAt`, `mrOf`, `liveOf`, `CUT`, `LEV`, `LEAD` de `src/ch/endocarditis.js`) y nota plegable de origen. Remisiones con botón: B5 y B6; la IM (18) sin botón porque aún no está en la app; nota plegable con la numeración. Las 6 citas ya estaban en `referencias.js`.
- `atlas.js` (entrada `endocarditis` sin figura), README de la eco, `docs/historial/eco.md` (ya son 25 de 30), tablero y versión 20261030-51.
- Revisión del encargo: la hizo el director sin agente (receta repetida; encargo al final del parte de `mi`).

## Qué no se pudo hacer o leer
- La figura, las pruebas, las preguntas y el profesor esperan a `mv-eco-2a5`.

## Para el usuario
- Mirar el capítulo en el móvil (Eco cardíaca → Atlas → B3 · Endocarditis infecciosa). Es la fase A: no hace falta decidir nada.

## Visto de paso (no tocado)
- Nada.

## Vueltas
| Vuelta | Quién | Motivo | Resultado |
|---|---|---|---|
| 1 | director | traducción | jueces ✅ |
| 2 | director | auditoría: 0 graves; aplicados el menor 1 («dentro de 3-5 días») y el 5 (la nota nombra `modelAt` y `mrOf`); aceptados el 2 (los «Puntos clave» de los demás capítulos tampoco llevan citas), el 3 y el 4 (igual que en el original) y el 6 (numeración explicada en su nota) | jueces ✅ |

## Gasto / Cuentas
Presupuesto 0,45 M (tope 0,6 M). Auditor sonnet ≈0,05 M (4 herramientas); director ≈0,2 M. Total ≈0,25 M, dentro del presupuesto. Sin recortes de Hacienda (<2 M).

## Siguiente: encargo de `prosthetic` (para la sesión nueva)
`/plan-socialista atlas-texto` — Capítulo siguiente: `prosthetic`, misma receta que `masses`, `mi` y `endocarditis`. Rama `auto/atlas-texto-prosthetic` desde `origin/main` (con `endocarditis` ya fusionado); prosa en `index.html` (`<article id="ch-prosthetic">`), grados en `src/ch/prosthetic.js`. Cierre automático igual («ya son 26 de 30»); después, `lvad`.
