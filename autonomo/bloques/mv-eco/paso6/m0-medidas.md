# M0 paso 6 · medidas del motor (programa: `herramientas/m0-paso6.mjs`; motor asentado 40 s + 5 latidos; sístole = tS1→tS2 del motor)
## 1. pVD−pAD en sístole (cada ~10 ms)
| caso | máx mmHg | momento máx (% sístole) | r25 / r75 (÷máx) | vIT m/s | forma |
|---|---|---|---|---|---|
| normal | 17,2 | 19 % | 0,96 / 0,76 | 2,07 | pico precoz y meseta baja (12-13 mmHg del 45 al 90 %); no domo |
| HP crónica g=1 | 78,3 | 98 % | 0,41 / 0,93 | 4,42 | rampa que sube hasta el final del latido; ni domo ni meseta |
| HP crónica g=0,6 | 92,1 | 92 % | 0,39 / 0,97 | 4,80 | igual (rampa) |
| TEP g=1 | 29,2 | 78 % | 0,53 / 0,99 | 2,70 | irregular, máx tardío (ver nota) |
Objetivo domo: r25 y r75 ≈0,7-0,85 con máx 40-60 %. Ninguno lo cumple. Nota TEP: su tS1 sale 0,000 (el evento no se marca bien), así que su «sístole» es 0→tS2 y los % son menos fiables.
Nota: en HP g=0,6 la PSAP da vIT 4,80 > g=1 (4,42); la gravedad no es monótona en vIT (a revisar al tocar M1).
## 2. Excentricidad del VI (dibujo nuevo, psaxPm; EI = eje x/y)
| caso | telediástole | sístole media | fin sístole |
|---|---|---|---|
| normal | 1,00 | 1,00 | 1,00 |
| HP g=1 | 1,16 | **1,00** (pVD−pVI −12) | 1,16 |
| HP g=0,6 | 1,13 | **1,00** (−20) | 1,16 |
| TEP g=1 | 1,16 | 1,00 (−24) | 1,00 (−41) |
Falla M2: en la HP el VI es redondo en sístole media porque pVD−pVI es negativo (VD 60-70 vs VI 100+); el septoSigno (`septoSignoDe(pvd−pvi)`) cae a 0 y el D solo aparece cuando pVD>pVI (final de sístole y diástole).
## 3. Regional en TEP g=1 (`regionalDe`, contrato.mjs:117-123)
`regional` es UN vector por latido (20 valores, 0-1), no una curva: VD pared libre basal 0,08 · media 0,08 · ápex 0,58 · VI todos 0,71. Normal: todo 1,00. Pared basal = media (mismo valor `pared`, MCCONNELL_PARED=0,5 × FEVD/normal); solo el ápex difiere. Así sale acinesia casi total en basal y media, y ápex conservado a medias (no «ápex que se mueve» claro). No hay desplazamiento por segmento dentro del latido: el dibujo debe aplicar el factor al acortamiento.
## 4. Parámetros que gobiernan la activación del VD (motor.mjs)
| parámetro | línea | efecto |
|---|---|---|
| fSubida 0,62 · qSubida 0,55 · tsVen 0,45 | 55 | forma de la activación (compartida VI/VD) |
| eVd = activacion(tv0, fSubida·tsVen·kV·durVd, (1−fSubida)·…·durVd, qSubida) | 401 (VI: 399-400) | VD usa la misma forma, estirada por durVd |
| durVd 1 (escenarios: HP 1+0,25x en escenarios.mjs:81; TEP ×(1−TEP_DUR_VD·u) :189; HP :200) | 192 | duración sístole VD |
| kEyecVd 0,002 · lPul 0,002 | 188 | caída de pVD con qPul (redondea; domo posible con más kEyecVd) |
| pvdLibre = presionCamara(vd, vvd, eVd, 0, eesVd)·(1−kEyecVd·qPul) | 408 | presión VD |
| activacion() / activacionVi() | 277 / 287 | funciones de forma |
