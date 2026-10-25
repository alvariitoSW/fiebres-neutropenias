# Parada 1 · paso 2 · pieza 2 (mandos y estudio) — informe del constructor

## Qué cambió
- `js/modules/eco/eco.html`: bloque plegado «Mandos de imagen» bajo la imagen del simulador (ids `cv-img-*`, `cv-senalalo`,
  `cv-senal-frase`): ganancia, profundidad, foco, 4 TGC (cerca/medio/lejos/fondo), «Mandos a cero», Señálalo (sombra,
  refuerzo, rebotes, pared apagada, foco; «Pulmón» solo con el reto encendido) y el reto «Ventana pobre» (apagado).
- `js/modules/eco/simulador.mjs`: estado `img`, mandos → `formar({ganancia,tgc,focoMm,m:{ventana}})`; profundidad
  sobreescribe `planoEco.prof` (se reinicia al cambiar de vista); triángulo del foco en el borde izquierdo del abanico;
  `senalar()` dibuja el contorno y coloca el rótulo donde menos corazón tapa (rejilla de sitios, evita vértice y esquinas de abajo).
- `js/modules/eco/ecografia.mjs`: «paredes reales»: pared libre del VD (relleno −3 dB más, borde más fino y −4 dB más) y
  AD (−4 dB más, 15 % más fina). Arreglo de pieza 1: había un `return` duplicado sin `geometriaNueva/mitad/pared/apagado`
  (el primero se ejecutaba; la calidad automática contaba el fotograma de la rejilla y Señálalo no podía leer el ecógrafo).
- `css/components.css`: `.cv-mandos-img`, `.cv-mini-grande` (44 px), `.cv-senal-frase`. Versión 20261027-24.
- Dónde verlo: Eco cardíaca → simulador → debajo de la imagen, «🎚 Mandos de imagen» (y en `laboratorio.html`).

## Capturas (`/tmp/plan-socialista/eco-mega/capturas/p2-*.png`, 390 px)
`<vista>-normal` (plax, psaxPm, a4c, sc4c) · `<vista>-foco` (4 vistas) · `plax|a4c-sombra|refuerzo|reverb|especular` ·
`ventana-pobre` · `ventana-senal` · `ganancia-tgc` (−8 dB, TGC +9/+12, 22 cm, foco 12 cm). `a4c-*` se regrabaron a 360 px.

## Frases nuevas (origen: fisiología general, sin página; copiadas de la maqueta aprobada salvo las marcadas *)
Sombra / refuerzo / rebotes / pared lateral gris / músculo paralelo / pulmón (6 frases de la maqueta) · *Foco: «el haz es más
estrecho a esta profundidad y la imagen es más nítida. Por delante y por detrás se ensancha y emborrona. Mira el tabique al
mover el foco de 4 a 12 cm.» · *Ventana pobre: «Paciente obeso o ventilado: la grasa y el pulmón se interponen…» (del texto de
la maqueta, reordenado) · *avisos: «Sin sangre en el centro de la imagen: no hay refuerzo que señalar.» y los de la maqueta.

## Pruebas
✅ `node --test 'js/modules/eco/pruebas/*.test.mjs'`: 249, 248 pasan, 0 fallan (1 pendiente previo).
✅ Playwright 390 y 360: scrollWidth = ancho, 0 errores de consola, cada Señálalo y la ventana pobre en las 4 vistas.
✅ `node autonomo/jueces.mjs --eco`: todos a favor (caché, versión, ids, consola 390/360, eco 248).
✅ ids únicos (`cv-img-*` no existían), solo tokens (canvas lee `--accent-yellow`/`--bg-main`), `hidden`, botones ≥44 px.

## No comprobado / riesgo
Rendimiento en móvil real. El rótulo se coloca por rejilla de sitios (puede quedar lejos del artefacto si el centro está lleno).
Las paredes VD/AD más finas: ajuste a ojo (−3/−4 dB), el profesor debe revalidar. Frase de Señálalo bajo la imagen, fuera de ella.
