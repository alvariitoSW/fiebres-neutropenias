# Cifras de la app en cada captura de movimiento y Doppler (dibujo 2, 390 px)
Origen: «monitor» = texto que enseña la app (#cv-l-vi, #cv-d-resultado, #cv-m-resultado, #cv-l-lat); «derivado» = cuenta sobre cifras del monitor; «anatomia.mjs» = tapseDeLatido(motor.ultimo) porque la app solo lo enseña al poner calibres.

## d-regmitral-fallo (fallo, g=1, preajuste regmitral)
- Resultado del Doppler: Insuficiencia mitral · chorro · ángulo haz-flujo 26° (se mide v·cos θ) Chorro sistólico hacia la AI (se aleja de la sonda): en la muestra, pico 222 cm/s · ITV 58,9 cm En el orificio el chorro llega a 247 cm/s (ΔP VI−AI ≈ 4v² = 24 mmHg). Vena contracta 0,50 cm (calculada del EROA como un orificio redondo, no medida en la imagen; Zoghbi: <0,3 cm leve, ≥0,7 cm grave; intermedia: los valores intermedios se solapan entre grados, confírmalo con otros métodos). Tras ella el chorro se abre en cono y arrastra sangre: ocupa más AI cuanto más EROA, pero el área del chorro no sirve sola para graduar. En la IM secundaria el orificio es elíptico y la vena contracta en 2D la subestima. Zoghbi p. 328 · p. 308 (área del chorro) Q = EROA · 50 · √ΔP del motor; v = √ΔP / 2 m/s (Bernoulli). En el CW el haz atraviesa el chorro y se lee su máximo × cos θ (la línea de base sube para aprovechar la pantalla; escala e inclinación ilustrativas).  _[monitor]_
- Medidas internas (E, A, E/A, TDE/DT, pico, ITV): {"tipo":"regurgitacion","pico":221.77,"itv":58.87}  _[monitor interno de la app (__eco.doppler.medidas); e′ no la da hoy]_
- Último latido: PA 61/50 (PAM 55) · FC 121 · GC 2.3 L/min · PVC 7  _[monitor]_
- TAPSE: 8.9 mm  _[anatomia.mjs]_

## d-it-cw-hpcronica (hpcronica, g=1, preajuste regtricus)
- Resultado del Doppler: Insuficiencia tricuspídea · chorro · ángulo haz-flujo 22° (se mide v·cos θ) Chorro sistólico hacia la AD (se aleja de la sonda): en la muestra, vIT 3,95 m/s · ITV 143,0 cm PSAP estimada = 4·vIT² + PVC = 89 mmHg (vIT corregida por el ángulo: 4,27 m/s; sin corregir sería 78) (normal: vIT ≤ 2,8 m/s; > 3,4 m/s sugiere hipertensión pulmonar, ESC/ERS 2022). v = √(ΔP VD−AD / 4) con la presión del motor; el espectro muestra v·cos θ (el haz no está alineado del todo con el chorro) y la PSAP se corrige dividiendo por cos θ, como al alinear el haz. La vIT es el pico del latido (la máxima presión VD − AD de ese instante, con la AD de ese instante); la PSAP suma la PVC media, por eso difiere unos mmHg de la presión máxima del VD del motor. Ilustrativo.  _[monitor]_
- Medidas internas (E, A, E/A, TDE/DT, pico, ITV): {"tipo":"regurgitacion","pico":395.04,"itv":142.96,"vIT":3.95,"psap":78.21}  _[monitor interno de la app (__eco.doppler.medidas); e′ no la da hoy]_
- Último latido: PA 84/65 (PAM 74) · FC 92 · GC 2.9 L/min · PVC 16  _[monitor]_
- TAPSE: 9.1 mm  _[anatomia.mjs]_

## d-it-cw-tep (tep, g=1, preajuste regtricus)
- Resultado del Doppler: Insuficiencia tricuspídea · chorro · ángulo haz-flujo 22° (se mide v·cos θ) Chorro sistólico hacia la AD (se aleja de la sonda): en la muestra, vIT 2,42 m/s · ITV 71,1 cm PSAP estimada = 4·vIT² + PVC = 37 mmHg (vIT corregida por el ángulo: 2,62 m/s; sin corregir sería 33) (normal: vIT ≤ 2,8 m/s; > 3,4 m/s sugiere hipertensión pulmonar, ESC/ERS 2022). v = √(ΔP VD−AD / 4) con la presión del motor; el espectro muestra v·cos θ (el haz no está alineado del todo con el chorro) y la PSAP se corrige dividiendo por cos θ, como al alinear el haz. La vIT es el pico del latido (la máxima presión VD − AD de ese instante, con la AD de ese instante); la PSAP suma la PVC media, por eso difiere unos mmHg de la presión máxima del VD del motor. Ilustrativo.  _[monitor]_
- Medidas internas (E, A, E/A, TDE/DT, pico, ITV): {"tipo":"regurgitacion","pico":242.42,"itv":71.14,"vIT":2.42,"psap":33.1}  _[monitor interno de la app (__eco.doppler.medidas); e′ no la da hoy]_
- Último latido: PA 66/53 (PAM 59) · FC 118 · GC 2.3 L/min · PVC 10  _[monitor]_
- TAPSE: 6.9 mm  _[anatomia.mjs]_

## Errores de consola
ninguno
