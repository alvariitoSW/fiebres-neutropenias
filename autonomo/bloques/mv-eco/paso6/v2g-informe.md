# v2g · carril dibujo, vuelta 2 (arreglos 6, 7, 8)
**6 McConnell** (`corazon-geo.mjs`, `APEX_CIERRE` 0,5 → 0,85, ilustrativo; McConnell 1996 PMID 8752195 da 5,7 mm de excursión normal, no la luz apical). Medida `m3-mcconnell.mjs`, TEP g=1, mm hacia dentro:
| | pared media | ápex |
|---|---|---|
| antes | 0,28 | 5,68 |
| después | 0,28 | 9,59 |
g=0,5: media −1,53, ápex 8,0 → 11,3. Diferencia ápex−media 9,3 mm (≈2 px/mm a 390, medido en la vuelta anterior: 5,4 mm ≈ 11 px) → ≈19 px, un pelo bajo el objetivo de 20. NO hice el foco VD del TEP (queda como paso aparte; el VI se conserva). El volumen del motor se conserva (cuadrática exacta).
**7 AI y aorta descendente**: `PARED_AURICULAR_NUEVO.db` −4 → −7 (AI ≈ 3 dB más tenue; ilustrativo). Nueva `AORTA_DESC_NUEVO` (eco-tejidos.js: −8 dB, 1,3 mm de pared, ilustrativo; Lang 2015 y Mitchell 2019 no dan su calibre) aplicada en `ecografia.mjs` solo al «Aorta descendente» del dibujo nuevo; `torax.mjs` `TORAX_NUEVO.rAo` 11 → 10 (≈20 mm; calibre ~2-2,5 cm sin cita de página). En las capturas A4C del TEP el anillo doble tras la AI desaparece / queda tenue.
**8 SC4C**: `sombraIrregular` (ecografia.mjs, solo dibujo nuevo) pasa de hash por haz y bloque de 8 muestras a ruido de valor suave (celdas 7 haces × 28 muestras, −36…−24 dB, ilustrativo): caída continua en vez de rayas.
**Pruebas**: ecografia, instantanea-dibujo, geometria, regional, torax: 75 pasan, 0 fallan. `jueces --geometria --dibujo nuevo`: 0 fallos de 147.
**Capturas** (después): `autonomo/bloques/mv-eco/capturas-realismo/{dilatada-a4c,derrame-sc4c,tep-a4c,hp-a4c,normal-a4c}.png` y `mov/mov-tep-a4c.png`; antes = las del commit anterior (git).
**No comprobado / riesgo**: (1) la AI de la dilatada se ve casi igual de brillante en la captura: su borde en caja viene en parte de otras estructuras (mitral, tabique, base); no medí el brillo de la AI en píxeles ni cambié su forma (esquinas sin tratar). (2) McConnell ≈19 px, no ≥20; sin foco VD y sin leer los 4 fotogramas píxel a píxel. (3) SC4C: la mejora de las rayas la vi en una captura, a ojo. (4) mov-doppler: el resto de capturas se regeneraron con la tanda, no las miré todas. Versión no tocada.
