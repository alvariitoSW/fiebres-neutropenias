# 154 · Tabique del TEP en telesístole (mv-eco-2a5, paso 6, sesión 2) — PARADA: no cabe sin romper el contrato; motor REVERTIDO

1. Medida (`paso6/herramientas/tep-154-medir.mjs`, antes del cambio). pVD/pVI (mmHg) en TD · mitad de eyección · cierre aórtico · Vmín VI · 1.º de E:
   TEP 0,7: 13/4 · 41,6/84,3=0,49 · 24,9/71,2=0,35 · 31,4/79,6=0,39 · 0,35 (eVd 0,46 frente a eVi 0,96 en el Vmín). HP 0,55: 0,86 · 1,13 · 1,07 · 1,13.
   El motor SÍ tenía duración propia del VD (`durVd`, `fSubidaVd`), pero solo la ponía el escenario: el TEP la deja en ≈0,98 (pico precoz para el domo de la IT).
2. Cita verificada (PubMed 18279740): Marcus JT et al., J Am Coll Cardiol 2008;51:750-7. HAP (PAPm 55±13), 21 pacientes, RM con marcaje: comienzo
   del acortamiento igual (retraso I-D −1±16 ms); pico del VD 387±50 frente a VI 293±58 ms (retraso 94±41 ms), por alargarse el acortamiento del VD;
   ligado a la tensión de pared del VD; abombamiento septal máximo a 395±45 ms (ya cerrada la aórtica). Solo resumen leído; población crónica.
3. Arreglo probado EN EL MOTOR (commit f5a12f13, REVERTIDO después; se recupera de ahí): `retrasoVdPorK 0,025 s × (k−1)`, tope `retrasoVdTope 0,10 s` (dentro de 94±41), k = múltiplo de la resistencia
   pulmonar (inverso de `escalarRPul`). Lo que ya alarga `durVd` cuenta; el resto es una meseta de la activación del VD en su máximo (`activacionVd`), ×√T.
   k ≤ 1 → meseta 0 y misma función de siempre (normal, TEP g=0 y HP g=0 idénticos a 0,1 mmHg; igualdad exacta por código). Constantes ILUSTRATIVAS;
   en el TEP agudo es extrapolación (la fuente es HAP). `muestrasClave` (`atlas/vd.mjs`): telesístole de Lang 2015 p. 6 = volumen mínimo del VI.
4. Resultado: pVD/pVI en telesístole TEP 0,7: 0,39 → 0,48 (cierre aórtico 0,35 → 0,50); TEP 0,85: 0,54; TEP 1: 0,59; HP 0,55: 1,06. IE TEP 0,7 = 1,02.
   ❌ `enfermedad.test` «índice de excentricidad» (TEP eiS 1,02) y «HP crónica frente a TEP agudo» (solo su última línea, la del TEP; la HP pasa).
5. POR QUÉ NO CABE (no es el retraso): mientras el VI eyecta, pVD ≈ PAP y pVI ≈ presión aórtica, así que pVD/pVI ≈ PAPs/PAS ≈ 45/85 ≈ 0,5 haga lo
   que haga la activación del VD (con meseta de 0 a 125 ms el cociente en el Vmín queda en 0,48-0,49). Y la prueba pide más que 0,5: `septoSignoDe`
   (contrato, constantes ILUSTRATIVAS ESCALA 2/NORMA 6) da IE 1,1 con cociente 0,50, 1,48 con 0,57 y 1,59 con 0,60; además exige eiS ≥ eiD − 0,01 y la
   eiD del TEP es 1,60 (Ryan 1985 da ~1,26 en diástole en la sobrecarga de presión: la TD del TEP está saturada, pVD 12 / pVI 4).
   Caminos (decide el director): a) PAPs del TEP 0,7 a ~52-55 (≤60) y PAS algo menor → cociente ≥0,6 (toca la calibración del TEP, no el retraso);
   b) curva de `septoSignoDe` (contrato congelado: IE 1,44 a cociente ~0,5-0,55) y saturación diastólica; c) telesístole = «fotograma tras el cierre»
   a cadencia de eco (~15-20 ms: cociente 0,55-0,6) — es una lectura de Lang, no la he aplicado.
6. Paciente posible (`tep-154-barrido.mjs`), TEP 0→1: FC 71-112, PAM 87-65, GC 5,1-2,7, PAPs 22-46 (≤60 ✅), TAPSE 20,7-6,8; antes 97/74/3,25/46/9,5
   en el defecto, ahora 93/77/3,44/45/10,6. HP 0→1: PAPs hasta 108 (igual que antes), PAM ≥76. rPul ×12-15 sin escenario: PAM 40/32 (antes 44/33).
7. Con la meseta, la suite eco rompía el CONTRATO y la calibración del TEP: «contrato = motor de hoy» TEP 50 %/defecto/100 % y validarContrato tep:1,
   TEP al 100 % PAM 65 (pide 45-60; antes 59) y «el TEP a fondo es el de alto riesgo (PAM <65)», atlas «14 VD», M1 vIT ±5 %, «el dibujo de hoy no
   cambia». El VD que eyecta más tiempo da más GC y más PAM. Por la regla («si no cabe sin romper el contrato, PARA») revertí `motor.mjs`.
   ESTADO DE LA RAMA: motor = el de origin/wt/mv6-on; `muestrasClave` = Lang (pedido). Con eso (atlas, contrato, domo-septo, escenarios,
   enfermedad) solo quedan en rojo «índice de excentricidad» (154) y «HP crónica frente a TEP» (su última línea, la del TEP), más «tiempo <60 s»
   (máquina cargada, carga 18-35). jueces --modelo shock-vivo (con la meseta): 3 en contra, móvil 390/360 («figura al 0 %» al tocar ❚❚/Cuña,
   «mando no tocable» en Amparo/Mateo) y la prueba del modelo; parecen de carga, no del motor; sin repetir tras revertir.
✅ cita verificada · ✅ medida y barrido guardados · ✅ normal intacto (con meseta) · ✅ Lang aplicada · ✅ PAPs ≤60 · ❌ 154 y HP/TEP en rojo
❌ la meseta rompe contrato y TEP de alto riesgo (revertida) · ❌ cociente ≥0,5 en telesístole del TEP del defecto (0,48 con meseta)
No comprobado / riesgo: texto completo de Marcus (solo resumen); efecto en las formas del dibujo (sin capturas); la meseta pasa de 6 a 78 ms entre TEP 0,5 y
0,7 (el retraso total es continuo, pero la `durVd` del escenario cae ahí).
