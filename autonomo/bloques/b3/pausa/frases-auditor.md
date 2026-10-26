Frases nuevas del pulmón (constructor, vuelta de límites 26/10)
1. Aviso «Volumen alto»: «N mL/kg de peso ideal: la ficha parte de 8 y baja a 6; en EPOC y asma, 6-8 como mucho.» (Tabla 27.1, cap. 27 p. 14; cap. 23 p. 29)
2. Aviso «Volumen bajo»: «N mL/kg: por debajo del mínimo del protocolo (4 mL/kg).» (Tabla 27.1, cap. 27 p. 14)
3. Aviso «Meseta alta»: «Meseta N cmH₂O: por encima de 30 hay riesgo de rotura alveolar.» (cap. 27 p. 4; cap. 24 p. 48)
4. Aviso «Alarma muy alta» (pmax ≥45): «…deja pasar presiones que la ficha no acepta: quiere la meseta ≤30.» (ilustrativo; 30: cap. 27 p. 4)
5. Sello «Sin ventilación eficaz»: «Vt N mL y volumen minuto N L/min: el paciente no se ventila y el CO₂ sube. Baja la resistencia o sube la alarma de presión.» (fisiología general)
6. Sello «Combinación no fisiológica» (VM >20): «…por encima de 20 casi nadie lo mantiene.» (fisiología general)
7. Sello «Volumen no fisiológico» (Vt >12 mL/kg): «…un pulmón sano no tolera tanto y se rompe.» (Tabla 27.1; 12 fisiología general)
8. Sello «Hiperinflación»: «PEEP total N (N de PEEP oculta): el pulmón no se vacía; baja el gasto cardíaco y sube el riesgo de barotrauma.» (cap. 23 p. 28; cap. 28 p. 31; 20 fisiología general). Exige además PEEP oculta ≥2 (desvío de la tabla).
9. Mando revertido: «… El mando se queda donde estaba.»
10. Celda I:E: «no cabe la esp. · FR real N».
Motor: pmax limita en PCV; pulmonAjustar reescala V; aviso sin ventilación (VM<2). pruebas.mjs 49/49.
Pendiente: pulmon-prueba.mjs — el botón Guía no abre la explicación (fallaba también antes).
Frases nuevas del shock (constructor, vuelta de límites 26/10)
- Sello «Sobrecarga de volumen»: «PCP X y PVC Y: la ficha para en 18-20 y más volumen ya no sube el gasto. Edema: N mL.» (ficha p. 42 y p. 11; PVC 12 fisiología general)
- Aviso «Cerca del techo» (PCP ≥15 o PVC ≥11): «PCP X: la ficha para en 18-20.» (p. 42) / «PVC Y: por encima de 12 las venas no admiten más.» (fisiología general)
- Aviso «Volumen en el TEP» (≥250 mL): «Llevas X de los 500 mL que pone la ficha como tope.»
- Sello «Tope de 500 mL» (TEP): «Con el VD que no puede, la ficha limita el volumen a 500 mL con la PVC normal (4-6); aquí la PVC es X.» (cap. 22, p. 10-11)
- Aviso «Reposición»: «Repuesto X mL de ≈ Y mL perdidos: el tope es 1,5 veces lo perdido.» (p. 21-23; ×1,5 ilustrativo)
- Sello «Más de lo perdido»: «Has dado X mL y perdió ≈ Y mL: más de 1,5 veces lo perdido solo sobrecarga.»
- Aviso «Presión alta con vasopresor» (PAM >100): «PAM X: el objetivo del shock es 65 o más; por encima de 110, baja la dosis.» (110 fisiología general; fármaco p. 12-13)
- Sello «Hipertensión por vasopresor» (PAM >110): «PAM X con noradrenalina a N µg/min: baja la dosis.»
- Aviso «Casi dos días» (≥42 h) / Sello «Reloj agotado» (48 h): ilustrativo.
- Estados nuevos (datos.js): sobrecarga, hemo-tope, hipertension-vaso, tep-bolo («Tope de 500 mL»): «…el VD que no puede se dilata, empuja el tabique y el VI se llena menos…»
- Motor: soporte.mjs redistribuir() corregido (descuenta edema, no baja venas del basal, 6 tramos).
