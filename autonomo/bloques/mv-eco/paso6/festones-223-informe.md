# 223 · festones mitrales en el dibujo nuevo (opus, 01/11/2026, rama wt/mv6-on-223)
Causa (dos, no una): (1) con `mitralSepto` toda la valva anterior abierta se trasladaba 15 mm hacia la aorta, también A1/A3 y hasta la comisura
(franja de 18 mm en uu=0, con la posterior de largo 0 al lado: la comisura «se rasgaba»); el A4C pasa 6 mm por detrás de la bisagra de A2 y
solo cortaba A3. (2) La posterior heredaba `mitralTh` 0,4 (pensado desde la vertical para la anterior) en la rama que lo mide desde el anillo:
abría 23° y quedaba casi plana; por eso el eje corto mitral nunca veía las dos valvas abiertas («boca de pez», Hahn 2013 p. 939).
Arreglo (`corazon-geo.mjs`, solo `puntoValva` y la mitral de `construirCorazonHoy`; el dibujo de hoy no cambia):
- cada franja gira sobre su propia bisagra: solo el centro (A2, ventana ±0,05 plena → 0 en ±0,2, ilustrativa) se vuelca hacia el TSVI;
  hacia las comisuras cuelga hacia la línea de cierre con el largo de la cerrada (comisura continua, Hahn p. 942-943);
- la posterior abre 1,2 rad (69°) desde el anillo, la cifra del dibujo de hoy (ilustrativa).
- Plano PSAX mitral: SIN cambiar (−7 mm). Probé −0,17·L (bordes libres, bajo el descenso del anillo): normal 5 instantes con los seis, pero
  dilatada y fallo 0 (su anillo baja 3-4 mm, no 13,6). Un nivel que siga al anillo necesita el descenso sistólico (MAPSE) en `planoVista`,
  que hoy solo recibe la telediástole: queda para el director (ver riesgo). Con −7 la prueba pasa (normal: 3 instantes, dos con la valva abierta).
Cortes del latido normal (antes → después, `herramientas/festones-223.mjs`): A4C abierta A3,P2 → A3,A2(4-6 mm),P2/P1; A2C abierta A1,P3 →
A2,A1,P3; PLAX/A3C A2,P2 sin cambio; eje corto con los seis: 1 → 3 instantes. A2-P2 abiertas (#18): normal 29,9→31,5, dilatada 32,5→36,6 mm.
Pruebas: geometria.test entera en verde (30 + 1 todo; #15, #18 y #19 en verde). Suite de la eco: 611, 589 bien, 6 mal, 16 todo:
154 (otro agente); 64 «contrato < 60 s» (carga de la máquina, 4 núcleos y carga 13-18: la base también da 68,9 s); 379 Doppler (sola, en verde);
565 TAPSE, 568 papilares hemorragia, 573 TEP esquinas (fallan igual en la base origin/wt/mv6-on: vienen de la fusión con main).
Jueces --modelo shock-vivo: todo en verde salvo «Móvil 390 · shock-vivo: al tocar ❚❚ / Cuña la figura shv-esc-svg se ve al 0 %» (2 de 8);
es el desplazamiento de la ficha del shock vivo, no la eco; no comprobado en la base.
R4 (capturas en `festones-223-capturas/`, fase F llenado rápido y C eyección, 390 px): A4C-F junto a `js/modules/eco/img/real/a4c-dominio-publico.jpg`
(dominio público): valva anterior abierta en el lado del tabique, posterior hacia la pared lateral: 6/10. PLAX-F junto a `plax-yale.png`
(Lynch y Jaffe, CC BY 2.5): la anterior hacia el tabique no se distingue bien en la imagen: 5/10. PSAX mitral-F: no hay imagen real de
uso libre en el repositorio (D1 la descartó); frente a la descripción de Mitchell 2019 p. 21 (VD, TIV, AMVL, PMVL, VI) la captura corta la
AI en llenado rápido (el anillo aún está 13 mm abajo y el plano a −7): 3/10. A2C sin imagen de referencia.
No comprobado / riesgo: el eje corto mitral corta la AI en sístole y al inicio de la diástole (plano fijo a −7 por encima del anillo bajado);
arreglarlo pide pasar el descenso sistólico a `planoVista`. Sin bajar la versión ni tocar motor.mjs ni pruebas.
