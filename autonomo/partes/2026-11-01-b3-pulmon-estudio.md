# 2026-11-01 · b3-pulmon-estudio (sesiones 1 y 2 del director)

**Resultado:** en revisión (PR: https://github.com/alvariitoSW/fiebres-neutropenias/pull/80)
**Vueltas:** G1 2 · G2 3 · G3 2 · G4 2 · G5 1 (+ rejuicio final) · **Jueces:** pruebas ✓ · móvil ✓ · auditoría ✓ (graves corregidos)

## Qué se hizo
Estudiar y receta Visual en las 21 fichas del pulmón con respirador (Marino caps. 23-30), en 5 grupos, con casos de
pacientes que siguen de ficha en ficha. Pulmón vivo: 5 estados nuevos (`hfno`, `prono`, `fuga-cuff`, `sbt-ansiedad`,
`disparo-inverso`) y dos arreglos que pidió el profesor (`cpap-eap` respiraba con Vt 0; en `atelectrauma-zeep` la PEEP
no apagaba el colapso cíclico). Suite de jueces entera en verde (base, `--modelo pulmon-vivo`, `--modelo shock-vivo`,
`--forma` y `--ficha` de las 21) con la versión 20261101-31. Revisión del encargo: sesión 1.

## Qué no se pudo hacer o leer
- P1 (dibujo del corazón y del neumotórax en el pulmón vivo): pasa a `b3-cierre`, como proponía el relevo.
- Menores sin hacer (al `b3-cierre`): frase viva dinámica de «boca cerrada» en `hfno`; estado `subglotica` (profesor G5,
  punto 7); fuente de lista del capilar `bajo-gasto` desde la ficha 21; M3, M5-M9 de `auditoria-g5b.md` (frases que
  piden buscar otra fuente: aminoglucósido, clorhexidina); sbt-c5 «FR 35, Vt 170» y la frase viva del neumotórax.
- La meta 8,75 en todo: ver `rejuicio-final.md`.

## Para el usuario
Mirar en el móvil un caso entero (Isidro en *SDRA · ventilación*) y el estado nuevo de ansiedad en la prueba de
respiración espontánea. Nada que decidir en esta parada; la PR entra por el Consejo.

## Visto de paso (no tocado)
- Motor del corazón no monótono por encima de 13,5 cmH₂O de aire pleural (PAM 19,7 a 20; 34 a 40).
- `mejor-peep`: la presión de conducción mínima sale con PEEP 10, no 12 (Fig. 27.5).
- Hay otro Benito (66 a, IAM) en `b3b-cardiogenico-2.js`: dos pacientes con el mismo nombre en el bloque 3.
- El juez de nombres internos marca palabras clínicas de la fuente («diseño», «cobertura» antibiótica): se reescribió
  el texto de las fichas 9 y 19 sin cambiar el sentido (auditor G5b lo comprobó). El juez de forma de `jueces.mjs` no
  recorre los bancos `b3d-*` (lo dijo un constructor; las cuentas de forma salieron de herramientas propias).

## Propuestas sobre las reglas
1. **Excepción del juez de nombres internos para vocabulario clínico de la fuente** («cobertura antibiótica»,
   «diseño» de un dispositivo): hoy obliga a reescribir texto fiel. Que el juez admita una lista de frases clínicas.
2. **Juez de forma sobre los bancos `b3d-*`** (buena la más larga y la más corta ≤⅓): G3, G4 y G5 cayeron en el juicio
   por esto y ningún juez lo medía; se contó con 5 herramientas distintas (`cuenta-larga-g3`, `g4a-forma`…).
3. Error del director: tras un `git merge` con conflicto, `git add -A` metió las marcas en un commit (`index.html`);
   `version.mjs` lo cazó. Propuesta: el director nunca usa `git add -A` con una fusión a medias.

## Vueltas
| Pieza | Vuelta | Nota mínima del profesor | Constructor | Pasos | Tokens | Qué falló |
|---|---|---|---|---|---|---|
| G3 (4, 6, 5) | 1 → A1 | 7,5 (dificultad, Compruébalo, pacientes) → ≥8 | sonnet | 35+37 → 34 | 1,5 M → 0,6 M | buena la más larga; dos Elviras; PEEP sin efecto en el modelo |
| G4 (7, 8, 9) | 1 → A1 | 7,5 (8: dificultad, pacientes) → ≥8 | sonnet | 35+21 → 30 | 1,5 M → 0,5 M | Elvira distinta de la de la 5; selenio fundido |
| G5 (14-21) | 1 → A1 | 7,5 (21: dificultad) → ver rejuicio final | sonnet | 43+32+38+27 → 24+13 | 4,6 M → 0,7 M | forma; promesa del caso que el modelo no da; RASS/noradrenalina |
| G2-G4 | rejuicio → A3 | 8,25 → ver rejuicio final | sonnet | 43 | 0,6 M | barajado de la 2; buena la más corta |
| Estados y modelo | 1 | — | sonnet | 34-36 c/u | 0,3-0,5 M c/u | — |

## Gasto
Sesión 2: **17,1 M** (`gasto.mjs --clave b3-pulmon-estudio`); sesión 1 ≈19,9 M → **≈37 M** de 38,4 presupuestados (−4 %).
Por papel (sesión 2): constructor sonnet 16 agentes, 10,7 M (62 %) · profesor fable 4, 3,0 M (17 %) · director 2,1 M
(12 %) · auditor sonnet 4, 1,4 M (8 %). Los que más: director 2,1 M; constructores G5c y G5a 1,2 M c/u (2 fichas,
38-43 pasos). Dónde: el Estudiar por ficha sale a ≈0,6 M (presupuesto 0,7); las vueltas de forma se ahorrarían con el
juez de forma sobre los bancos (propuesta 2).

## Cuentas
Presupuesto 38,4 M (Hacienda: −1,0 M) · gastado ≈37 M · desvío −4 % · techo del `b3d` 70 M: gastados ≈63,3 M
(26,3 de `b3-pulmon-app` + 37) → quedan ≈6,7 M para `b3-cierre` (pedía 8-14: aviso al Consejo al abrirla).
