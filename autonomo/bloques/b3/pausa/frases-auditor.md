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

Frases nuevas del ritmo (constructor, 27/10)
1. Sello «Tope de adenosina»: «Tres bolos (6, 12 y 12 mg) ya son el tope: si el ritmo sigue, no es una reentrada por el nodo. Más dosis solo alargan las pausas.» (Tabla 19.4, p. 30)
2. Aviso «Adenosina actuando»: «…la ficha deja 2 min entre ellos.» (Tabla 19.4, p. 30)
3. Aviso «Última dosis»: «Tras 6 y 12 mg queda un último bolo de 12 mg; por vía central, la mitad.» (Tabla 19.4, p. 30)
4. «Un solo bolo»: «Bolo de 0,25 mg/kg y luego perfusión de 5-15 mg/h. Otro bolo no está en la ficha, y el diltiazem baja la presión (hipotensión en el 20-30 %).» (Tabla 19.1, p. 22-23)
5. «No insistas»: tres intentos de maniobra vagal (p. 29; el 3, ilustrativo)
6. «Cargando»: un choque por carga (ilustrativo)
7. Sello «Ya en sinusal»: «Un choque ahora puede inducir una FV.» (fisiología general)
8. Sello «Tope de energía»: «Tres choques (100, 100 bifásico y 200 J): nunca 360 J, que daña el miocardio.» (p. 32)
9. «Último choque»: «El siguiente es de 200 J, el último: no se usan 360 J.» (p. 32)
10. «No sigas frenando»: «…más no frenan el atajo y pueden precipitar una FV.» (p. 28)
11. «Pauta completa»: «2 g en 15 min y 6 g en 6 h son la pauta. Repetirla sería hipermagnesemia.» (p. 28; hipermagnesemia fisiología general)
12. «Tope de metoprolol»: «Tres dosis de 2,5-5 mg IV» (Tabla 19.1, p. 23)
13. Sello «Tope de verapamilo»: «Más de 20 mg: bradicardia e hipotensión (es inotrópico negativo).» (p. 28) · 14. aviso a 15 mg (ilustrativo)
15. «Bolos completos»: «Dos bolos de 150 mg: sigue 1 mg/min, sin pasar de 2,2 g en 24 h.» (p. 24-25)
16. «Ya hay pulso»: adrenalina con pulso → taquiarritmia (p. 59 y 62; fisiología general)
17. «Adrenalina cada 3-5 min» (p. 59-60) · 18. «Amiodarona completa. 300 mg y 150 mg» (p. 59)
19. Sello «FV refractaria»: «N choques sin éxito: buen resultado solo en el 5 %; ECMO si se dispone.» (p. 59-60)
20. Sello «Sin RCE a los 30 min» (p. 60; 30 min ilustrativo) · 21. aviso «Veinte minutos» (ilustrativo)
- Frase del cerrojo: «Si pasa más de 1 s sin QRS, la unión AV escapa a unos 50/min.» (fisiología general; el motor usa 1,2 s: unificar)
