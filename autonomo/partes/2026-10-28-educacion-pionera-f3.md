# 2026-10-28 · educacion-pionera (fase 3, maquetas y página)

**Resultado:** en revisión (PR: https://github.com/alvariitoSW/fiebres-neutropenias/pull/37, en borrador) · página para el móvil: https://claude.ai/artifact/GoHaq43vYu8echLwfqN6oe
**Vueltas:** 3 · **Jueces:** pruebas propias 390/360 ✓ · móvil ✓ · auditoría ✓ (0 graves en v2) · profesor: A 7,75 ✗, B 8,25 ✓, C 8,25 ✓

## Qué se hizo
Fase 3 adelantada del 02/11 al 28/10 a petición del usuario. Tres constructores sonnet a la vez construyeron las maquetas en
`autonomo/maquetas/educacion/` siguiendo `diseno-a/b/c.md`: **A** apuesta-mira-explica en el shock vivo (Amparo, Mateo),
**B** error productivo en el capilar vivo (Carmen, sello de TACO solo en la maqueta), **C** repaso de 5 preguntas de días atrás
+ caso de Teresa en el río y mar. Ninguna guarda nada, sin texto libre ni librerías; pie A·B·C común. Programas de prueba en
`herramientas/` (prueba-a/b/c y prueba-fallos del profesor). Auditor y profesor en paralelo; dos vueltas de arreglos con
constructores sonnet nuevos (R5); rejuicio solo de lo bajo (R8). Página Artifact con diagnóstico, evidencia, capturas, notas,
rúbrica y prueba de 3 días. Revisión del encargo: la hice yo (no toca la app); `revision-encargo.md` en la carpeta de trabajo.
Informes copiados a `autonomo/ideas/educacion-pionera/` (`profesor-f3*.md`, `auditoria-f3*.md`).

## Qué no se pudo hacer o leer
- A sigue en 7,75 en §7: no importa el motor en vivo (pinta desde `a/cifras.json`, leído del modelo con `lee-shock.mjs`) y el
  motor da cifras que no casan. Arreglarlo ≈1 M y toca el motor del shock (otra sesión trabaja la circulación): se deja para
  cuando el usuario elija.
- La vuelta 3 (4 arreglos baratos) no se volvió a puntuar.

## Para el usuario (el 04/11)
- Elegir A, B, C o la mezcla del profesor: **C con el error de B como un paso del caso** (conserva lo de evidencia alta en residentes).
- Si A: motor en vivo y PAM del motor. Si B: tope y sello del mando «Transfundir» en el capilar vivo de la app.
- Elegir las fichas gemelas para la prueba de 3 días.

## Visto de paso (no tocado)
- Shock vivo: PAM 87 con 106/67 y 54 con 73/34 (no casa con PAS/PAD); ScvO₂ basal 90 % sin shock; Mateo (clase III) con diuresis 0,9.
- Capilar vivo: gasto 7,6 L/min con FEVI 35 % que no baja con el TACO (ya anotado en f2).

## Propuestas sobre las reglas
- **Ningún juez cazó que el relato da la respuesta**: en B, el texto del día 4 decía «no se vuelve a transfundir» justo antes de
  preguntar «¿Transfundes?» (y la hora 1 nombraba el diurético antes de preguntar qué hacer). Lo vi yo en una captura y lo
  arreglé. Propuesta: el profesor o `--forma` comprueba que el párrafo anterior a una pregunta no contiene su respuesta correcta.
- Los constructores de maquetas dejaron capturas en una carpeta llamada `http:/localhost:8765` dentro del repo (ruta mal
  formada); la borré. Propuesta: los arneses validan que la carpeta de capturas es una ruta absoluta.

## Vueltas
| Pieza | Vuelta | Nota mínima profesor | Modelo | Pasos | Tokens eq. | Qué falló |
|---|---|---|---|---|---|---|
| Maqueta A | 1 | 7,0 (§7, N3) | sonnet | 19 | 0,48 M | NA a la hora 0 (grave), pregunta a un scroll, fallo sin consecuencia |
| Maqueta B | 1 | 5,0 (N1) | sonnet | 33 | 0,55 M | nada se apostaba antes; ejemplo sin preguntar el porqué |
| Maqueta C | 1 | 6,5 (N3) | sonnet | 46 | 0,78 M | lactato del Ringer (grave); fallo sin consecuencia en el río |
| A | 2 | 7,75 (§7) | sonnet | 15 | 0,23 M | modelo quieto (fuera de presupuesto) |
| B | 2 | 8,25 (N1) | sonnet | 26 | 0,43 M | apuesta correcta se delataba |
| C | 2 | 8,25 (N3) | sonnet | 21 | 0,33 M | consecuencia solo en texto |
| A5, B, C | 3 | sin rejuicio | sonnet | 13 | 0,13 M | — |

## Gasto
Total **5,1 M** (presupuesto 4,7 M): desvío **+9 %**. Por papel: constructor sonnet ×7 2,9 M (57 %) · director 1,1 M (21 %) ·
auditor sonnet ×2 0,5 M (10 %) · profesor 0,6 M (12 %: juicio en opus 0,41 M, rejuicio en fable 0,2 M). Los que más gastaron:
director 1,1 M (las notificaciones del gancho de git y las capturas que miré; esperar sin mirar capturas grandes) · constructor C
0,78 M (46 pasos, presupuesto 0,9) · constructor B 0,55 M. Ahorro: el primer profesor se lanzó sin `model` y salió en opus en vez
de fable; poner siempre `model: "fable"` al profesor. La vuelta 2 costó 1,0 M: el diseño ya pedía N1-N3 y los constructores
de la vuelta 1 no los tacharon; dar al constructor la rúbrica N1-N3 como lista que tachar (R2) desde la vuelta 1.

## Cuentas
Presupuesto 4,7 M (lo que quedaba hasta el tope de 8 M) · Hacienda (aplicada por mí): un solo profesor para las 3 (−0,6 M),
constructores al 90 % · gastado 5,1 M · desvío +9 % (por debajo del 25 %: sin comparecer). **La tarea entera suma ≈8,4 M
(f1 ≈1,3 + f2 2,0 + f3 5,1) frente a ≈6 M previstos y un tope de 8 M: se pasó del tope un 5 %**, por la vuelta 2 (A, B y C
bajo 8). Sin `/ahorro` de después (desvío <10 % y no cierra bloque).
