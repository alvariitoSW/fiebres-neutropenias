# M3 · McConnell visible (TEP) — informe
**Fuente** (PubMed 8752195, https://pubmed.ncbi.nlm.nih.gov/8752195/, resumen leído): McConnell 1996, Am J Cardiol 78:469-73. TEP agudo: pared libre media
−0,2 ± 0,8 mm (acinesia), ápex 5,7 ± 0,8 mm (normal, p = NS); en la HP primaria, anormal en todas las regiones.

**Valores (`regionalDe`, TEP g=1)**: antes basal 0,08 · media 0,08 · ápex 0,58. Ahora basal 0,08 (0,5 × FEVD, ilustrativo) · media 0,03 (0,15 × FEVD) · ápex 0,92
(déficit ×0,1). HP crónica sin cambio. Constantes con la cita en contrato.mjs. Nuevo `mcconnellDe(motor)` (intensidad 0-1 para el dibujo).

**Dibujo 2** (ajuste `mcconnell`, corazon-geo.mjs): zona de la pared libre media (0,45 del largo) con el endocardio fijado en el radio de la telediástole
(el tabique de aquel instante llega por `septoTd`, formas.mjs); el ápex cierra el 50 % de su luz en sístole. El volumen del motor se conserva (cuadrática exacta en A).

**Desplazamiento telediástole→telesístole, mm hacia dentro** (`herramientas/m3-mcconnell.mjs`, ángulo 2,4 rad, TEP g=1; antes = sin M3):
| | base | pared media | ápex |
|---|---|---|---|
| antes | 2,27 | 0,02 | 0,20 |
| después | 2,16 | 0,35 | 5,67 |
Media/ápex = 0,06 (≤0,3). Otros ángulos g=1: 2,8 rad → 0,12 / 4,67; 3,2 rad → −0,14 / 2,13. g=0,5: media −1,5, ápex 8,1 (antes −6,6 / 3,9).
**Cifra del motor**: en g=1 el VD solo se vacía ~19 mL (FEVD 8 %); el ápex se mueve 5,7 mm por el dibujo (cierre del 50 % de la luz apical), no por el motor. Es ilustrativo y está dicho.

**Pruebas**: `regional.test.mjs` +2 (ápex ≥0,7 y media ≤0,3×ápex; dibujo 2: media ≤0,3×ápex, ápex ≥5 mm, media ≤2 mm) en verde. Geometría `--dibujo nuevo` 0/147.
**Capturas**: `autonomo/bloques/mv-eco/capturas-realismo/mov/mov-tep-a4c.png` (A, C, D, F) y `geometria-capturas/tep-g1-a4c.png`.

**No comprobado / riesgo**: en la captura a 390 px la pared libre del VD apenas se ve (imagen oscura): la lectura visual de los 5,7 mm la ha de confirmar el profesor,
no he medido px sobre el PNG. Solo el A4C; foco VD y otros cortes no medidos. En g=0,5 la media queda en −1,5 mm (residuo del tabique). Juez de caché pide versión (la sube el director).
