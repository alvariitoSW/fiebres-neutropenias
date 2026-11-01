# M1 + M2 · informe (constructor sonnet, worktree wt/mv6-motor)
**M2 HECHO (verde). M1 NO entregado (cifra mala del motor al intentarlo; parche aparte).**
## M2 · tabique en sístole media (contrato.mjs + formas.mjs)
`septoSignoDe(grad, pvi?)`: 2.º argumento opcional; sin él, igual que antes (firma de 1 argumento y rango 0…+1 intactos). Con `pvi`, en sístole
el aplanamiento sigue a la presión RELATIVA del VD (pVD > 0,5·pVI): King 1983, Circulation 68:68-75, https://pubmed.ncbi.nlm.nih.gov/6851056/
(RVSP >50 % de la sistémica → pérdida de curvatura septal en telediástole, mesosístole y telesístole; r 0,86 en telesístole; leído su resumen);
Ryan 1985, JACC 5:918-27, https://pubmed.ncbi.nlm.nih.gov/3973294/ (EI ≈1,0 normal; 1,44 en telesístole con presión alta; leído su resumen).
El 0,5 es de King; la puerta suave de pVI 20-40 mmHg (apaga el término en diástole) es ILUSTRATIVA.
| EI VI (psaxPm) | antes td / sm / fs | después td / sm / fs |
|---|---|---|
| normal | 1,00 / 1,00 / 1,00 | igual (también FC 50 y 120: ≤1,05) |
| HP g=1 | 1,16 / 1,00 / 1,16 | 1,16 / **1,16** / 1,16 |
| HP g=0,6 | 1,13 / 1,00 / 1,16 | ≥1,1 / **1,16** / 1,16 |
| TEP g=1 | 1,16 / 1,00 / 1,00 | sin peor (sm 1,00, septoSigno 0,05) |
Pruebas nuevas `pruebas/domo-septo.test.mjs` (EI en HP g 0,6/0,8/1, normal con FC 50/120, TEP). Suite de la eco con solo M2: todo verde salvo
«tiempo: la prueba entera <60 s» (falló también con 3 workers en paralelo; no es de este cambio) y las 5 pruebas de domo, marcadas `todo` (rojas hasta M1).
TAPSE/FEVD con solo M2: sin cambio (motor intacto): normal 22,9 mm / 52,8 %; HP g=1 9,1 / 14,1; HP g=0,6 14,0 / 32,1; TEP 6,5 / 9,0.
## M1 · domo: qué se intentó y por qué se para
Causa (medida): con la activación del VI, eVd sube hasta el 100 % de la sístole; en HP el VD es casi isovolumétrico y pAP sube con la eyección,
así que pVD−pAD es rampa; en el normal es meseta con pico precoz. Fuente de la forma: Zoghbi 2017 Fig. 29 (PDF p. 49: IT leve «faint», excéntrica
grave «parabólico, pico precoz», central grave «triangular»: la propia figura no da un único domo mesosistólico).
Intento (`m1-intento.patch`, NO aplicado): parámetros `fSubidaVd`/`qSubidaVd` (activación del VD propia, q alto = arranque lento y subida rápida);
HP y TEP los mezclan según g en escenarios.mjs. Resultado con ese parche (ventana = válvula pulmonar abierta):
| caso | antes: pico / r25 / r75 / vIT | con parche |
|---|---|---|
| normal | 13 % / 0,85 / 0,77 / 2,07 | 37 % / 0,61 / 0,57 / 2,07 |
| HP g=1 | 78 % / 0,53 / 1,00 / 4,42 | 52 % / 0,56 / 0,89 / 4,49 |
| HP g=0,6 | 74 % / 0,46 / 1,00 / 4,80 | 58 % / 0,50 / 0,92 / 4,86 |
| TEP g=1 | 84 % / 0,58 / 0,93 / 2,71 | 52 % / 0,39 / 0,66 / 2,59 (-4 %) |
Todo cumple el umbral y la vIT (±5 %), PERO: el domo quita área a la activación y el VD normal expulsa menos: **FEVD normal 52,8 → 43,3 %, TAPSE 22,9 → 18,5 mm**.
Compensar con Ees ×1,2 (0,50→0,60, y las enfermedades con su Ees absoluto) da FEVD 45,1 %, TAPSE 19,4; compensar del todo (Ees ×1,5, durVd 1,3)
mueve el pico fuera del 35-65 %. Con el parche fallan 23 pruebas (FEVD tabla 45,3 vs 53 ±5 %; TA pulmonar TEP 110 ms >105; e′, modo M, validarContrato…).
No tapo la FEVD ni subo tolerancias: paro. HP g=1: FEVD 14,1→12,1 %, TAPSE 9,1→8,2 mm con el parche.
Sobre HP g=0,6 > g=1 en vIT (4,80 vs 4,42): no lo toqué; viene de `hpcRecorrido` (k, ees, mioVd, durVd no monótonos); no hay comentario que lo declare intencionado.
## Siguiente encargo (propuesta)
M1 como pieza de motor con reparto de trabajo: (a) la forma del domo con la FEVD normal fija (probar inercia pulmonar lPul mayor SOLO con kEyecVd/Ees reajustados, o
elastancia del VD con subida tardía + durVd normal ~1,15 —el cierre de P2 es posterior al de A2—, y recalibrar a la vez la FEVD y la TA pulmonar); (b) decidir si la ventana
del umbral del 35-65 % es la eyección (válvula abierta) o el chorro de IT (pVD>pAD); (c) revisar la TA pulmonar del TEP (<105 ms) que el parche empeora.
## Entrega
Cambios: contrato.mjs, formas.mjs, pruebas/domo-septo.test.mjs, herramientas/m0-paso6.mjs (TAPSE/FEVD, septoSigno con pvi), este informe, m1-intento.patch.
No comprobado / riesgo: `jueces --modelo shock-vivo` NO ejecutado (se acabó el presupuesto de pasos); septoSigno nuevo no probado en shock vivo ni en atlas/fotogramas
fuera de la psax; `--geometria` no corrido. Instantánea del dibujo (`instantanea-dibujo.json`) pasó en la suite.
