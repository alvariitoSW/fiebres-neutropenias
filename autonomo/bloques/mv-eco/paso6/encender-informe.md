# Encender el dibujo nuevo (mv-eco-2a5 paso 6) — informe PARCIAL (parado por presupuesto)
Hecho (commits en wt/mv6-on): (1) corazon-geo.mjs: por defecto dibujo 2; ?dibujo=1 / ECO_DIBUJO=1 / usarDibujo(1) dan el de antes.
(2) interruptor-dibujo.test.mjs actualizado al nuevo defecto (defecto = 2; todas las comprobaciones siguen). (3) jueces.mjs: la
geometría corre con --eco (y --geometria), dibujo nuevo por defecto, commit aparte, umbrales intactos. (4) version.mjs 20261101-22.
Resultados: `jueces --geometria` = 0 fallos de 147 filas (dibujo nuevo). Interruptor: verde.
## NO está en verde: pruebas de la eco con el nuevo defecto
Ficheros con fallos (node --test por fichero, hasta donde llegó la ronda; faltaban unos 8 ficheros por correr):
contrato 1 (pasó al repetir: carga), ecografia 3, enfermedad 2, formas 1, geometria 6, instantanea-dibujo 1; y en la suite entera
también fallan pruebas de tiempo/WebGL/Wiggers (probable carga, repetir a solas). Casos concretos vistos:
- formas #3 «mezcla del latido siguiente»: percentil 99 = 0,90 mm.
- enfermedad #10 «tabique aplanado: cavidad = volumen del motor»: 61 mL frente a 65 mL; #13 excentricidad del TEP: telesístole 1,48
  no menor que telediástole 1,61 (posible cifra mala del dibujo/motor: REGLAS §1.14, NO tapada; decide el director).
- geometria: «un VD vacío (20 mL) se dibuja con luz» da 2,9 mm; «SC4C: VD toca el hígado» 10 mm de hondo y 82 de ancho; aorta
  descendente (N3), festones mitrales y cúspides (C1); «el dibujo de hoy no cambia» (instantánea) normal td n 22350→27838.
- Estas pruebas se escribieron con el defecto 1. Las de «dibujo de hoy no cambia» deben fijar usarDibujo(1) (la instantánea no se
  regeneró: no hice --congelar porque el fallo es de defecto, no de cambio de dibujo antiguo; hay que fijarla a 1, no regenerarla).
## Sin hacer
Fijar a usarDibujo(1) las pruebas que miden el dibujo de antes; decidir las que son de física del nuevo (TEP excentricidad, VD vacío,
cavidad septo); `jueces --eco`, `--modelo shock-vivo`, capturas atlas cap-vd y eco a 390 px.
## No comprobado / riesgo
Ni shock-vivo ni el navegador. No fusionar: el defecto nuevo deja la suite de la eco en rojo.

## Parte 2 (PARADA por presupuesto; el defecto nuevo sigue sin estar listo para fusionar)
Hecho: instantánea fija usarDibujo(1) (verde). ecografia: las 3 pruebas de «mejoras a 0» miden el dibujo de antes (helper `viejo()`); 26/26.
Arreglado EN EL DIBUJO NUEVO (corazon-geo.mjs, anatomia.mjs, formas.mjs), sin tocar pruebas ni umbrales: (a) TEP: GANANCIA_SEPTO 4→8, el
tabique con pVD>pVI ya está plano; el motor da MENOS gradiente en telesístole (4 frente a 9 mmHg en telediástole), así que el dibujo con 4 seguía
al motor y daba IE 1,48<1,61; con 8 da 1,61/1,61 (Ryan 1,44±0,16). Esto es un aviso §1.14: la presión del motor no refleja que la sobrecarga
sistólica sea máxima; queda saturado en el dibujo, decide el director si se quiere revisar el motor. (b) cavidad con tabique aplanado: viConSeptal
itera 6 veces con el corte hondo (61→65 mL). (c) mezcla: el largo del VD (Lvd) usa el volumen de telediástole y sigue al VI, y la tolerancia de
apertura baja a 0,12 (39 formas por latido): p99 0,90→<0,5. (d) VD vacío de 20 mL: el largo no baja del normal (LVD_PISO_REL=1), luz 4,8 mm.
Verde por fichero: instantánea, interruptor, ecografia, enfermedad, formas. Versión 20261101-23.
Falta (geometria.test.mjs, 5 fallos): #28 SC4C VD 10×83 mm (el corte con el plano de dibujo 1 es 20×40: lo rompe el giro del haz de ecografia.mjs
l.174 «dibujo nuevo, 4 cámaras», que además el plano no sale igual); #10/#11 aorta descendente N3 (diámetro del corte 31,2 mm; eje a 4,2 mm de
otra pieza); #15 festones mitrales (A4C: A3A2/P2P1 da A3,P2); #17 cúspides (PLAX: dos cúspides, ninguna «derecha»). Sin hacer: contrato, resto de
ficheros, suite entera, jueces --eco, --modelo shock-vivo y capturas 390 px (eco y cap-vd).
