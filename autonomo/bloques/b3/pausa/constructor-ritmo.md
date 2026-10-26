# Constructor ritmo v3 (corazon electrico) - autonomo/maquetas/b3-ritmo.html, rama auto/b3-ritmo (pusheada)
Pruebas: /tmp/plan-socialista/b3/ritmo/ (med.js, todo.js, may.js, rot.js, capturas p-*.png, s-*.png).
## Puntos del juicio
1 QRS TV parpadea: OK. leer() mide la mediana de 3 latidos completos (TV 0,155 constante).
2 QRS imposibles: OK. Velocidad base de musculo VM=0,42; TV 0,155; rama 0,14-0,17; aberrancia 0,14; WPW sinusal 0,15, WPW+FA 0,12-0,19 (algun latido 0,19, justo sobre el rango); QT sin arrastrar el QRS (gradiente de APD). Hugo QTc 0,58 = QT 520 ms a 75 lpm (coherente con el texto del caso).
3 Ventana de 7 s: OK. Se reinicia en cada exito (choque/cardioversion/farmaco) y al terminar la adenosina; «—» y «midiendo…» hasta 2 latidos. Comprobado: WPW+CV, FV+choque, nodal+adenosina.
4 Tira vs frase: OK. Dientes de sierra del flute (0,4 mV, 300/min), ondas f en FA y WPW-FA; K+ 8,2 funde QRS y T en onda sinuosa (QRS 0,215; 0,26 a 8,6).
5 FA+diltiazem: OK. Medido 40 s: dilt 3 h 94 (Fig. 96), dilt 6 h 88 (87), amio 3 h 106 (110), digo 3 h 117 (116).
6 Mayeutica: OK. Recorrido de 4 a 10 preguntas + destapa: flute (G3), TAM/magnesio (E3), QT/torsade (E4), STEMI por sexo (E5), ETCO2 (E6), «tres hallazgos» (E7 destapa). Caso de Teodoro intacto. Buena mas larga en 4/13, ninguna posicion >50 %.
7 Lupas: OK (variante «junto al monitor»): tarjeta con la lupa en vivo (<use>) en nodal, aberrancia, flute, FA, TAM, WPW (nodo AV) y torsade, K+ (celula), con «Ver en grande». Celda STEMI: «umbral 2,0 · p. 41».
## Comprobacion
390 y 360 px: 17 estados x todos los botones de Tratar/Medir x guia completa + lupas grandes + Mayeutica entera (fallos al azar, repaso, caso): 0 px de desborde, 0 errores de consola. Rotulos SVG >=7,5 px a 360. Ids sin duplicar. Nada interno visible (solo comentarios HTML).
## Frases nuevas para el auditor
- Mayeutica E3: magnesio empirico 2 g/15 min + 6 g/6 h, 88 %, independiente del Mg serico; metoprolol 80 % si la EPOC no es la causa; verapamilo <50 % e inotropico negativo (p. 28).
- E4: QTc normal <=0,44, >0,5 riesgo; QT largo comun en UCI y torsade rara; magnesio 1-2 g/15 min para terminarla; corregir K y Mg y retirar farmaco previene recaidas (p. 35). «Los 0,5 s en mujeres» es solo un distractor falso.
- E5: STEMI >=1,5 mm mujeres / >=2 mm varones en V2-V3, >=1 mm resto, >=2 derivaciones contiguas (Tabla 20.1, p. 41); troponina a la llegada y a la hora (p. 41).
- E6: ETCO2 sube con la profundidad de compresiones; <10-15 mmHg a los 20 min = exito improbable; por encima, seguir hasta 1,5 h con buen resultado; ~40 normal (p. 62-63).
- G3/E7: 3 hallazgos (QRS, R-R, actividad auricular), dientes de sierra, bloqueo fijo 2:1/3:1 regular (p. 18-19).
- Fisiologia general (sin pagina, rotuladas como ilustrativas): amplitud/forma de dientes de sierra y ondas f; la zona activada tarde repolariza antes; el potasio alto enlentece tambien el His-Purkinje; alisado del trazo con K>7,4; velocidad del musculo.
## De comun/
Nada (no toque comun/). Sugerencia: dock.js comun plegable (sigue siendo comun a las tres).
## No comprobado / riesgo
No corri jueces.mjs (son de la app, no de maquetas). Los «Ver en la ficha» siguen siendo avisos. WPW+FA llega a QRS 0,19 en algun latido. Lupa junto al monitor anade ~110 px a la primera pantalla en esos 8 ritmos; la frase+dock fijo (item comun) no se toco.
