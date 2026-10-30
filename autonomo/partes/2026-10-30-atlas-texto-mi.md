# 2026-10-30 · atlas-texto · cap. B6 Complicaciones del infarto (fase A, solo texto)

**Resultado:** hecho en un commit local de la rama `auto/atlas-texto-mi`; **sin subir**: esta sesión no tuvo permiso de escritura en el repositorio, así que no hubo PR ni fusión automática · **Vueltas:** 2 · **Jueces:** `jueces --atlas mi` ✓ · auditoría ciega ✓ (0 graves, 6 menores: 3 aplicados, 3 aceptados)

## Qué se hizo
- `js/modules/eco/atlas/cap-mi.html`: traducción completa del capítulo (echodemo `index.html`, `<article id="ch-mi">`). Las complicaciones mecánicas (3-5 días, urgencias quirúrgicas), la rotura septal (<0,3 %, 80 % de mortalidad a 30 días sin reparación, DA frente a inferior, Doppler color 12 de 12 frente a 7, PSVD = PAS − 4V², Qp/Qs ≥1,5 y hasta 8:1, 13,9 ± 4,4 mm), la rotura papilar (0,05-0,26 %, posteromedial con irrigación única, dos cabezas, velo flotante, ETT 53,8 %, IM aguda grave con chorro lento y excéntrico, contorno triangular, PAI = PAS − gradiente), la rotura de la pared libre y el pseudoaneurisma (cuello ≤0,5 del saco frente a 0,9-1,0; 18,6 % no vistos por eco), el aneurisma verdadero (trombo en hasta el 50 %) y el infarto del VD (McConnell, límites de la S′).
- «La figura del original» con su tabla de grados (`LEVEL`, `LABEL` y `measure` de `src/ch/mi.js`) y nota plegable de origen. Remisiones con botón: 11, 14, 21, B4 y B5; la IM (18) sin botón porque aún no está en la app; nota plegable con la numeración. Las 23 citas ya estaban en `referencias.js`.
- `atlas.js` (entrada `mi` sin figura), README de la eco, `docs/historial/eco.md` (ya son 24 de 30), tablero y versión 20261030-49.

## Qué no se pudo hacer o leer
- **Subir y fusionar**: se denegó adjuntar el repositorio con escritura y hacer `git push`. El trabajo está en un commit local y en el parche `autonomo-mi.patch` en la carpeta de la sesión.
- Por lo mismo, no se abrió la sesión del capítulo siguiente (`endocarditis`): abrirla antes de que `mi` esté en `main` haría que su rama no lo tuviera.
- La figura, las pruebas, las preguntas y el profesor esperan a `mv-eco-2a5`.

## Para el usuario
- Dar permiso de escritura para el repositorio (o subir la rama tú) y relanzar el cierre. Después, mirar el capítulo en el móvil (Eco cardíaca → Atlas → B6 · Complicaciones del infarto).

## Visto de paso (no tocado)
- Nada.

## Vueltas
| Vuelta | Quién | Motivo | Resultado |
|---|---|---|---|
| 1 | director | traducción | jueces ✅ |
| 2 | director | auditoría: 0 graves; aplicados el menor 2 (PAS e IM definidas al primer uso), el 3 (grados intermedios en la tabla) y el 4 (el cortocircuito crece); aceptados el 1 (afshar2026 cubre el grupo de frases, como en el original), el 5 (vistas y Doppler comprobados en `mi.js`: `a3c`, `plax`, `pvPW`, `liveOf`) y el 6 («mando», como en `masses`) | jueces ✅ |

## Gasto / Cuentas
Presupuesto 0,3-0,6 M. Auditor sonnet ≈0,09 M (5 herramientas); director ≈0,2 M. Total ≈0,3 M, dentro del presupuesto.

## Siguiente: encargo de `endocarditis` (para la sesión nueva)
`/plan-socialista atlas-texto` — Capítulo siguiente: `endocarditis` (B3 en la app), misma receta que `masses` y `mi`. Rama `auto/atlas-texto-endocarditis` desde `origin/main` (con `mi` ya fusionado); prosa en `index.html` (`<article id="ch-endocarditis">`), grados en `src/ch/endocarditis.js`. Cierre automático igual («ya son 25 de 30»); después, `prosthetic`.
