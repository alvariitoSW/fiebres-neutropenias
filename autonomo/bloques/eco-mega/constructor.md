# eco-mega · parada 1 · constructor, vueltas 2 y 3
Rama `auto/eco-mega`: 871f650, d5539ea, f5bdfa4 (vuelta 2) y **b38501a** (vuelta 3), sin push. Nada tocado bajo `js/`.
Archivos: `autonomo/maquetas/eco-imagen.html`, `eco-imagen/ecografia-v2.mjs` y `eco-imagen/maqueta.js`.
**Clave:** con todo apagado, «después» = «antes» píxel a píxel (diferencia media 0,0 en Node, 4 vistas; comprobado tras la vuelta 3).

## Vuelta 2
- `gauss()` sustituida por `pulsoAxial()`, código propio: los pesos salen uno del anterior (w·q^(2i+1)). Da los mismos valores.
- Mejora nueva **«0. Paredes reales»**: músculo −7 dB (gris medio) y un borde que ya no es una línea brillante (interfase de 0,6 mm, solo de frente). El pericardio sigue siendo lo más brillante.
- Grano alargado de lado: con el moteado, el haz mide al menos ~1 mm de ancho.
- La imagen y su frase quedan fijas arriba (sticky, 260 px).
- «Señálalo» en los 5 artefactos: zona marcada con trazo discontinuo, rótulo y frase debajo.
- Textos del auditor corregidos; fuera «haces × muestras» (ahora «imagen la más fina … la más rápida»).
- Más niebla en el ápex del apical.
- **Hemorragia de 1 L:** la sístole se ve. Volumen del VI de 100 a 40 mL (fotograma 12), FE 61 %. En el eje corto, la sangre del VI pasa de 1549 a 734 mm²: se estrecha, pero no se cierra. Es lo que da el motor para 1 L, no un fallo de la maqueta. El fotograma 2 de las capturas es diástole.

## Vuelta 3 (profesor, puntos 1-5)
1. «Señálalo» especular: en el A4C marca solo la pared lateral del VI (muestras de la etiqueta VI a la derecha de su centro) y el rótulo dice «pared lateral del VI». En las otras vistas el rótulo dice «músculo paralelo al haz», con su propia frase. El apagado vuelve a ser algo mayor (−17 dB).
2. Con paredes reales, las aurículas, las orejuelas y el anillo de la base van −8 dB y un 40 % más finos. El aro brillante que queda abajo es el pericardio.
3. Con el grano real, la sangre sube de −42 a −38 dB: negra a ganancia 0 y con un poco de grano a +10 (`sangre-ganancia10-a4c.png`).
4. Bandas de rebote más fuertes y anchas. «Señálalo» marca las de 2× y 3×; la de 3× cae sobre la cavidad del ápex, donde se ve.
5. Frase del grano: «sale alargado de lado y corto hacia abajo: el haz es más ancho de lo que mide de largo cada pulso de sonido».
6. Frases vivas más claras: cada una dice qué es y qué no es (ver abajo).

## Tiempos por imagen (Chromium sin GPU, calidad alta, todo encendido)
Después 25-37 ms frente a 17-21 ms antes. Animando, la calidad automática queda en «fina» o «más rápida».

## Capturas (`/tmp/plan-socialista/eco-mega/capturas/`, rehechas con un navegador nuevo)
- `{plax,psaxPm,a4c,sc4c}-{antes,despues,cortinilla}`, `{sombra,refuerzo,reverb,especular,ventana}-senalalo`.
- `pagina-390-sticky`, `sangre-ganancia10-a4c`, `hemorragia-psaxPm-{sistole,diastole}`.
- `sombra-derrame-plax`, `ventana-pobre-a4c`, `tgc-a4c`, `especular-a4c`, `dilatada-a4c`, `pagina-390-*`.

## Lista de comprobación
- ✅ 390 y 360 px sin desborde ni errores de consola, con los botones pulsados (incluido Señálalo). Letra mínima 12 px. Sin nombres internos ni jerga a la vista.
- ✅ Solo tokens; origen visible. ❌ No he vuelto a pasar los jueces de la app (no he tocado ninguna pieza de la app; en la vuelta 1, en verde).

## Frases nuevas, vueltas 2 y 3 («fisiología general», sin página)
- El borde de la pared se ve por el contraste entre la sangre negra y el músculo gris. Las líneas brillantes son el pericardio (suele ser lo más brillante) y el plano de las válvulas.
- El grano sale alargado de lado y corto hacia abajo: el haz es más ancho de lo que mide de largo cada pulso. El de la sangre es tenue y no sigue a la pared.
- Lo muy duro (una costilla, el calcio) apenas deja pasar el sonido. Con pulmón en la ventana, hay que cambiar de ventana o recolocar al paciente.
- Señálalo:
  - «Detrás de la costilla no llega sonido. Ahí no falta tejido.»
  - «El líquido apenas frena el sonido y lo de detrás brilla más. No es tejido más denso.»
  - «Rebote del sonido en la pared del tórax. No se mueve con el corazón: no es un trombo.»
  - «Pared lateral gris: el haz le pasa paralelo. No es que no se contraiga.»
  - «El haz pasa paralelo a este músculo: se ve más gris, no está enfermo.»
  - «Aire del pulmón: tapa el sonido. La ganancia no lo arregla; cambia de ventana.»

**Visto de paso:** el campo lejano del PLAX no tiene aorta descendente ni pulmón (anatomía, parada 2).

**No comprobado / riesgo:** no se ha probado en un móvil real; las intensidades por defecto están a ojo; en la dilatada, la elipse de la pared lateral no se ha mirado en todos los fotogramas.
