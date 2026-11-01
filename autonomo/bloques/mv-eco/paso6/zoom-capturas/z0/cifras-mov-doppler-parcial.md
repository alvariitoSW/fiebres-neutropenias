# Cifras de la app en cada captura de movimiento y Doppler (dibujo 2, 390 px)
Origen: «monitor» = texto que enseña la app (#cv-l-vi, #cv-d-resultado, #cv-m-resultado, #cv-l-lat); «derivado» = cuenta sobre cifras del monitor; «anatomia.mjs» = tapseDeLatido(motor.ultimo) porque la app solo lo enseña al poner calibres.

## mov-normal-a4cvd (normal, a4cVd; recortes izquierda→derecha, arriba→abajo: A, C, D, F)
- A · telediástole: VI 119 mL · 10 mmHg · VD 138 mL · 6 mmHg · Ao 72 mmHg · AP 13 · rótulo «A · Contracción auricular»  _[monitor]_
- C · sístole media: VI 88 mL · 97 mmHg · VD 119 mL · 18 mmHg · Ao 95 mmHg · AP 15 · rótulo «C · Eyección rápida»  _[monitor]_
- D · fin de sístole: VI 47 mL · 103 mmHg · VD 76 mL · 20 mmHg · Ao 104 mmHg · AP 21 · rótulo «D · Eyección lenta»  _[monitor]_
- F · llenado rápido: VI 71 mL · 4 mmHg · VD 87 mL · 2 mmHg · Ao 86 mmHg · AP 18 · rótulo «F · Llenado rápido»  _[monitor]_
- VTD (VI, máximo del latido): 120 mL  _[motor.onda (volumen del VI)]_
- VTS (VI, mínimo del latido): 45 mL  _[motor.onda (volumen del VI)]_
- FEVI: 62 %  _[derivado (VTD−VTS)/VTD]_
- Último latido: PA 105/67 (PAM 86) · FC 69 · GC 5.0 L/min · PVC 4  _[monitor]_
- TAPSE: 23 mm  _[anatomia.mjs]_

## mov-tep-a4cvd (tep, g=1, a4cVd; recortes izquierda→derecha, arriba→abajo: A, C, D, F)
- A · telediástole: VI 29 mL · 2 mmHg · VD 218 mL · 17 mmHg · Ao 58 mmHg · AP 23 · rótulo «A · Contracción auricular»  _[monitor]_
- C · sístole media: VI 39 mL · 64 mmHg · VD 207 mL · 29 mmHg · Ao 63 mmHg · AP 30 · rótulo «C · Eyección rápida»  _[monitor]_
- D · fin de sístole: VI 25 mL · 64 mmHg · VD 198 mL · 37 mmHg · Ao 65 mmHg · AP 39 · rótulo «D · Eyección lenta»  _[monitor]_
- F · llenado rápido: VI 43 mL · 3 mmHg · VD 218 mL · 17 mmHg · Ao 56 mmHg · AP 21 · rótulo «F · Llenado rápido»  _[monitor]_
- VTD (VI, máximo del latido): 46 mL  _[motor.onda (volumen del VI)]_
- VTS (VI, mínimo del latido): 24 mL  _[motor.onda (volumen del VI)]_
- FEVI: 47 %  _[derivado (VTD−VTS)/VTD]_
- Último latido: PA 66/53 (PAM 59) · FC 118 · GC 2.4 L/min · PVC 9  _[monitor]_
- TAPSE: 6.7 mm  _[anatomia.mjs]_

## Errores de consola
ninguno
