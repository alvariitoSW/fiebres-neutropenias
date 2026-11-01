# v4m · paso 6, vuelta 4, carril MOTOR (constructor, wt/mv6-v4m) · PARCIAL: reloj aplicado, suite en ROJO (≈37 pruebas)
Herramientas nuevas: `v4m-reloj.mjs` (cierre de las AV respecto a pr, gradiente VD−AD, PVC, atlas 10 E/A/TDE/grado, dilatada, IM 07; `LLENADO=` prueba corazones), `v4m-ad.mjs` (barrido de la AD: gradiente, catéter VD td−PVC, AD mín., PAS, VD−VI diastólica).
## Qué cambió (commit f50d979 + este)
- `motor.mjs`: `picoAurAntes` 0 (las dos aurículas, un reloj); `fSubidaAur` (0,5 = igual que antes); **fase A hasta que cierra la mitral** (antes acababa en pr: el VI cambiaba de volumen en la «isovolumétrica»); AD Ees 0,70→**0,22**, V0 8→**2** (AD mín. 34→24 mL; ref. 10-30). Fuentes: Mukherjee 2025 PDF p. 16 y 18; Marino cap. 8 PDF p. 52-53.
- `escenarios.mjs`: TEP `tepVd.ees` u>0,85 0,03→0,07 (de v3m); dilatada `RIGIDEZ_DIL` 1,05→1,08 (TDE 140→136; Nagueh p. 547 <140).
- Atlas 10 (`diastolica.mjs`, ilustrativos): corazón 1 volumen 0→−250 (E/A 0,83→0,76), corazón 3 volumen 1000→1100 (E/A 2,00→2,05). Atlas 07 (`asa.mjs` + `cap-asa.html`): EROA de la IM 0,4→0,6 cm² (caída en la isovolumétrica 0,25→1,10 mL; sigue «grave»).
- Rangos y topes: ninguno tocado. Tabla congelada del contrato: **NO rehecha** (la suite no estaba verde; rehacerla tapaba fallos).
## Antes → después (m1-chorro; normal sin baro)
| caso | grad. telediast. | pico % | r25 | r75 | vIT | PSAP | PVC | FEVD | TAPSE |
|---|---|---|---|---|---|---|---|---|---|
| normal | 5,7→−0,2 | 33→**16** | 0,64→0,88 | 0,77→0,68 | 2,07→2,14 | 22→22 | 4,3→4,6 | 52,8→52,6 | 22,9→22,7 |
| HP 0,3 | 8,3→1,0 | 69→61 | 0,47→0,51 | 0,96→0,87 | 3,79→3,71 | 67→65 | 6,3→6,6 | 36,7→37,2 | 15,5→15,6 |
| HP 0,6 | 9,9→1,3 | 64→55 | 0,41→0,53 | 0,89→0,78 | 4,80→4,72 | 102→99 | 7,5→7,7 | 30,5→31,0 | 13,6 |
| HP 1 | 17,1→1,9 | 62→52 | 0,32→0,59 | 0,84→0,69 | 4,53→4,45 | 99→97 | 15,5→15,7 | 14,1→14,0 | 9,1→9,0 |
| TEP 0,5 | 10,0→−0,2 | 62→52 | 0,56→0,64 | 0,81→0,68 | 2,77→2,70 | 43→42 | 7,6→7,9 | 24,8→25,0 | 12,5→12,4 |
| TEP 1 | 16,4→−0,1 | 61→57 | 0,37→0,69 | 0,64→0,64 | 2,74→2,62 | 44→42 | 9,4→9,7 | 9,2→10,2 | 6,7→7,1 |
HP 0,8 13,7→2,6. IT diastólica (dPas) ≤ −0,1 en todos; ventana desde la sístole del VD (ini −4 a 0 ms). TA TEP 1 81 ms. vIT y PSAP dentro de ±5 %.
**Pico fuera de 30-65**: normal 16, HP 0,1 13, TEP 0,1/0,2/0,3 14/12/11 % (el sobrepico de `lPul`, v3m; sin resolver).
Atlas 10 (corazón 0/1/2/3): E 90/66/79/108 (antes 90/68/81/110), A 76/86/63/52 (79/90/65/53), E/A 1,19/0,76/1,25/2,05 (1,13/0,76/1,24/2,10), grados 0/1/2/3 ✓. e′ sin cambio (fórmula: lat 12, sep 9,6; E/e′ normal 8,3). Dilatada E/A 2,33 TDE 136 e′ 3,4 grado 3 ✓.
## Suite (`node --test`): base solo «tiempo»; ahora ≈37 fallos. Arreglados en esta vuelta: atlas 07 y 10, isovolumétrica, AD mínima, barorreflejo
Siguen: **14 VD** (presión 0,75 sale «presión» y no «ambos»; volumen sale «ninguno»: ya no hay aplanamiento diastólico, que venía del gradiente falso); **contrato** (tabla) y validarContrato hemorragia/derrame/tep/hpcronica:1; **domo normal** (16 %); venas pulmonares S<D (43/46); e′ fallo VI (septal 1,92) y E/e′ TEP 1 (E 0, fusión); formas dilatada (pared 10,0), TEP y HP (tabique diastólico, VD/VI 0,58); TEP tabique/Lang (VD basal 40 mm); derrame paciente posible (IC 1,07-1,12); geometría C1 (mitral abre/cierra) y bomba auricular del dibujo; instantánea del dibujo (no regenerada); **catéter normal** VD td 6,9 vs AD media 4,6 (±2: la td cae en el pico de la A); curvas de función derrame/HP; PAS 104,9 (≥105); IRVS 30,1; AP normal 22/12 → pulso de la pulmonar; Impella; página del latido; Doppler con fusión E-A.
Causa común de muchas: con la A en su pico al cerrar, la «telediástole» (máx. del VI) cae ya en la isovolumétrica (TEP 0,7: pVI 24 > pVD 21 por la inercia de la mitral), y la AD débil baja ~3 % el GC (PAS, IRVS, derrame, Impella). Probé AD 0,30/V0 0: arregla PAS/IRVS pero rompe PAP diastólica (12,2), PTDVI (12,1), derrame establecido y catéter (2,7): vuelto a 0,22/2.
## No comprobado / riesgo
`jueces --modelo shock-vivo` no corrido. La rama está en rojo: no fusionar. Falta decidir la «telediástole» del dibujo y del catéter con el reloj nuevo (antes de la A o al cerrar) y recalibrar el GC del normal; quizá con `fSubidaAur`/`picoAurAntes` pequeño + `lMit`.
