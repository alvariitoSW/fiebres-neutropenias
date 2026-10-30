# 2026-10-30 · atlas-texto · cap. 20 Enfermedades de la aorta (fase A, solo texto)

**Resultado:** fusionado a `main` por el cierre automático del tablero (PR de `auto/atlas-texto-aorta`) · **Vueltas:** 2 · **Jueces:** `jueces --atlas aorta` ✓ (dos veces, antes y después de fusionar `main`) · auditoría ciega ✓ (0 graves, 0 huecos, 2 menores: 1 aplicado, 1 aceptado)

## Qué se hizo
- `js/modules/eco/atlas/cap-aorta.html`: traducción completa del capítulo (echodemo `index.html` l. 1943-1991): medida de la raíz (I-I del anillo en mesosístole, L-L del resto en telediástole, +2 mm frente a la TC), medias de Lang 2015 en varones, puntuación Z de Goldstein 2015; dilatación y aneurisma con los umbrales de la ACC/AHA 2022 (tricúspide y bicúspide, crecimiento, cirugía valvular); disección (colgajo, luz verdadera y falsa, la reverberación que lo imita, IA en ~50 % del tipo A con sus tres mecanismos, derrame, ETT 85 %, ETE 98/95 %); coartación (cola diastólica, Doppler abdominal, criterios de la ACC/AHA y de la ESC, stent IIa).
- Seis tablas sacadas del original (`src/ch/aorta.js`), con nota plegable de su origen: Lang ± 2 DE, umbrales por diámetro y válvula, luz verdadera/falsa (Goldstein Tabla 7), vena contracta de la IA, ACC/AHA Tabla 37 y ESC 2020. Dos ecuaciones (Z y gradiente medio) y «Los casos de la figura».
- Remisiones con botón (numeración de la app): image 02 y ar 16. Ningún otro capítulo mencionaba el 20 como «aún en el original».
- `atlas.js` (entrada `aorta` sin figura), README de la eco, `docs/historial/eco.md` (ya son 20 de 30), tablero y versión 20261030-45.
- Nota: el encargo llamaba al capítulo «24»; en la app es el **20** (`ATLAS_PARTES`). Se usó el 20.
- Revisión del encargo: la hice yo (capítulo de la misma receta que `hcm` y `amyloid`, sin agente).

## Qué no se pudo hacer o leer
- Figura, pruebas, preguntas y profesor esperan a `mv-eco-2a5`.

## Para el usuario
- Mirar el capítulo en el móvil (Eco cardíaca → Atlas → 20 · Enfermedades de la aorta). Fase A: no hace falta decidir nada.

## Visto de paso (no tocado)
- La tarea `raiz-aortica` (PR #46) dice que se enlazará con este capítulo al entrar: cuando se fusione, conviene un botón cruzado entre la ficha de la raíz y este capítulo.

## Vueltas
| Vuelta | Quién | Motivo | Resultado |
|---|---|---|---|
| 1 | director | traducción | jueces ✅ |
| 2 | director | auditoría: 0 graves; menor aplicado («la figura del original da la Z»); fusión de `main` sin conflictos | jueces ✅ |

## Gasto / Cuentas
Presupuesto 0,3-0,6 M. Auditor sonnet ≈0,045 M (5 herram.); director ≈0,25 M. Total ≈0,3 M, dentro del presupuesto (sin `/ahorro`).

## Siguiente: encargo de `windows` (para la sesión nueva)
`/plan-socialista atlas-texto` — Capítulo siguiente: `windows`, en el orden del Objetivo 1. Fase A: solo el texto, como `hcm`, `amyloid` y `aorta`.
- Rama `auto/atlas-texto-windows` desde `origin/main`, PR en borrador. Formato de `cap-aorta.html`; entrada en `CAPITULOS` de `atlas.js` sin `figura`. Número del capítulo: el de `ATLAS_PARTES` en `js/modules/eco/atlas-ouyang.js`, no el del original.
- Fuente: `git clone --depth 1 https://github.com/douyang/echodemo /tmp/echodemo`; prosa en `index.html` (`<article id="ch-windows">`, buscar con grep); comentarios y tablas de `src/ch/windows.js` (por trozos). Comprobar que cada `data-ref` existe en `referencias.js`; si falta alguna, añadirla con su DOI del original.
- Remisiones por `data-go` → botón `data-at-cap` con la numeración de la app; buscar «aún en el original» que mencione su número en otros capítulos.
- Método: el director traduce, `node autonomo/jueces.mjs --atlas windows`, auditor ciego sonnet (~12 pasos). Presupuesto 0,3-0,6 M. Sin figuras, preguntas ni profesor; no tocar `motor.mjs`. Versión superior a la de `main`. Fusionar `main` a la vista antes de cerrar.
- Cierre automático: jueces en verde y auditoría sin graves → fusionar a `main`, «ya son 21 de 30» en el historial, tablero, fila en `SESIONES.md`, y abrir la sesión del siguiente (`shunts`).
