# v3m · paso 6, vuelta 3, carril MOTOR (constructor, wt/mv6-v3m) · PARCIAL: causa resuelta en el banco, NO aplicada (rompe contrato y atlas)
Herramientas: `m1-chorro.mjs` (+`ini` = inicio de la ventana − inicio de la sístole del VD; `dPas` = pVD−pAD máx. en la diástole pasiva; PVC; ajuste `adEes`), `v3m-serie.mjs` (latido cada 10 ms), `v3m-forma.mjs` (chorro en 12 tramos), `v3m-tep.mjs` (barrido TEP).
## Causa (medida, son dos)
1. **Reloj auricular**: la activación auricular empieza con el latido y acaba 60 ms antes del QRS mecánico (pr 0,16): la AD se relaja con la tricúspide ya cerrada (normal 0,4 mmHg con el VD a 6; TEP 1 1,3 con el VD a 17,5). En la realidad la onda A acaba cuando cierra la tricúspide y empieza la IT (Mukherjee 2025, ASE, PDF p. 16 y 18: TCO = del final de la A al comienzo de la E = duración del chorro de IT) y la onda c sale al cerrarse la válvula en la contracción isovolumétrica (Marino cap. 8, PDF p. 53).
2. **AD demasiado fuerte** (Ees 0,70, el doble de la AI): vacía la AD de 51 a 17 mL (~40 % del llenado del VD) y en el TEP 1 empuja al VD a 18 mmHg; tras su sístole el VD queda a 13,8 con la PVC en 10,4: **la tricúspide no abre en toda la diástole** (IT diastólica 3,4 mmHg en el CW, el VD solo se llena con la A). Marino cap. 8, Fig. 8.2, PDF p. 52: la presión diastólica del VD equivale a la media de la AD.
Bajar la rigidez del VD (a, b) **empeora** (el VD crece y la IT diastólica sube a 5-6 mmHg); `tricRev` ya se descartó en v2m.
## Palanca (en el motor, inerte: `picoAurAntes: null`, `anilloAd: 0`; motor idéntico al de hoy, contrato + domo-septo 52/52)
`picoAurAntes` (pico auricular N s antes de pr) + `ad.ees` 0,70 → 0,22 + TEP `tepVd.ees` en u>0,85: 0,03 → 0,07. `anilloAd` (descenso x′) solo se probó.
| caso | gradiente telediast. hoy→banco | pico % | r25 | r75 | vIT | PSAP | PVC | FEVD | TAPSE |
|---|---|---|---|---|---|---|---|---|---|
| normal | 5,7→0,0 | 33→**16** | 0,64→0,89 | 0,77→0,68 | 2,07→2,13 | 22→22 | 4,2→**4,6** | 52,8→52,6 | 22,9→22,7 |
| HP 0,6 | 9,9→1,5 | 64→55 | 0,41→0,53 | 0,89→0,77 | 4,80→4,72 | 102→99 | 7,7 | 30,5→31,0 | 13,6 |
| HP 1 | 17,1→1,4 | 62→53 | 0,32→0,61 | 0,84→0,68 | 4,53→4,45 | 99→97 | 15,7 | 14,1→13,8 | 9,0 |
| TEP 0,5 | 10,0→−0,2 | 62→52 | 0,56→0,64 | 0,81→0,68 | 2,77→2,70 | 43→42 | 7,9 | 24,8→25,0 | 12,4 |
| TEP 1 | 16,4→−0,1 | 61→57 | 0,37→0,70 | 0,64→0,65 | 2,74→2,61 | 44→42 | 9,7 | 9,2→10,2 | 7,1 |
HP 0,8: 13,7→2,6. IT diastólica (dPas) TEP 1: 3,4→−0,1 (ninguno >0). TA TEP 80-86 ms. Ventana: empieza con la sístole del VD (`ini` −4 a 0 ms).
**Por qué no se aplicó**: la suite con estos valores falla en `contrato = motor de hoy` (PVC normal 4,53 vs 4 ±5 %; TEP y HP), atlas 07 Asa, 10 Diastólica (grados ASE 2025: el reloj mueve también la A mitral) y 14 VD. Arreglarlo exige: reloj solo para la AD (`eAurD`, y que corazon-geo lo lea: carril de otro) o recalibrar la diástole izquierda, y rehacer la tabla del contrato (decisión del director).
## Lo que queda sin resolver: el pico del normal y de g 0,1-0,3 (16 %, 11-14 %)
Con la AD arreglada, el VD normal tiene **dos jorobas propias** (sobrepico al abrir la pulmonar por la inercia `lPul` y meseta al pico de activación) y el chorro sale con pico precoz. Domo logrado solo con `lPul` 0,002→0,001 + `fSubidaVd` 0,5 + `anilloAd` 0,3 (57 %, r25 0,86, r75 0,90, vIT 2,14) pero la TA pulmonar normal cae 145→112 ms y la FEVD a 48,9 (borde): no aplicado. Con `lPul` 0,0012-0,0015 el sobrepico salta (pico 11 %): régimen frágil.
## IM en «fallo» (solo informe)
El escenario «fallo» no tiene IM en el motor (eroaMitral 0; PAS 95/68, AI máx 24). La única IM es la dilatada: ΔP máx 61,6 mmHg (92−30) → 3,9 m/s, plausible. Con PAS 95 y AI 24, 24 mmHg (2,2 m/s) no lo sería (esperable ~70 mmHg, ~4,2 m/s): si sale en el dibujo, viene de fuera del motor (doppler/simulador).
## Pruebas
Motor inerte: `contrato` + `domo-septo` 52/52. Suite completa y `jueces --modelo shock-vivo` NO repetidos tras volver a inerte (sin presupuesto); con la palanca aplicada la suite falló (arriba).
## No comprobado / riesgo
Suite entera y shock-vivo con el motor inerte (debería ser igual que v2m: el código con null/0 da cifras idénticas, comprobado con m1-chorro). El reloj propio de la AD dejaría el dibujo de la AD con otro reloj (regla «un estado por fotograma»).
