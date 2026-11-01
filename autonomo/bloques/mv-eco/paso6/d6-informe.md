# D6 · pared libre del VD visible en el A4C — informe
**Herramienta**: `herramientas/d6-pared-vd.mjs` (dibujo nuevo, telediástole; ángulo del plano frente a la apertura; brillo en el punto medio endo→epi).
**Causa** (medida): ni profundidad ni plano; fue la **apertura** (margen de 0,07 rad entre la pared más lejana y el borde, dentro de la franja con caída lateral) y el **brillo** (PARED_VD_NUEVO 4 dB).
| A4C td | apertura antes → después | margen pared VD–borde antes → después | brillo pared libre VD (0-255) antes → después | pared lateral VI |
|---|---|---|---|---|
| normal | 80° → 89° | 0,13 → 0,21 rad | 54 → 72 | 35 |
| HP g=1 | 81° → 96° | −0,08 (11 % fuera) → 0,05 (0 % fuera) | 36 → 67 | 41 |
| TEP g=1 | 82° → 97° | 0,03 → 0,16 rad | 46 → 81 | 51 |
**Cambios** (solo dibujo nuevo): `ecografia.mjs` `ENCUADRE_A4C.margenRad` 0,07 → 0,2 (ilustrativo; Mitchell 2019, docs/mitchell-2019-ett-completa-ase.pdf#page=26: en el A4C se ven las paredes de cada cámara; no da ángulos) y `eco-tejidos.js` `PARED_VD_NUEVO.db` 4 → 8 (ilustrativo, el VD sigue más fino que el VI).
**Capturas** (4 fases, 390 px): antes `scratchpad/antes/mov-{tep,normal}-a4c.png` (= las del commit anterior); después `autonomo/bloques/mv-eco/capturas-realismo/mov/mov-tep-a4c.png` y `mov-normal-a4c.png`. Vistas: en el TEP la pared libre entera queda dentro del sector, como arco de miocardio; en el normal se ve completa.
**Pruebas**: ecografia + instantanea-dibujo + geometria + regional: 65/65. `jueces --geometria --dibujo nuevo`: 0 fallos de 147 (solo ❌ del `?v=`).
**Lectura McConnell**: la pared media y el ápex del VD quedan dentro del sector y visibles; no he medido el contraste del movimiento sobre píxeles.
**No comprobado / riesgo**: el sector normal pasa de 80° a 89° (el margen se aplica a todo A4C/SC4C nuevo; el SC4C no se ha mirado). El corazón se ve algo más pequeño en la imagen. HP g=1: el punto más lejano de la pared (−0,79 rad) queda a 0,05 del borde por una pequeña diferencia entre mi medida y la del encuadre. Brillo 72-81 medido sobre el modelo, no calibrado contra una eco real. Versión no tocada.
