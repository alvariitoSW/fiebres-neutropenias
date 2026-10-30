# Pulmonary POCUS: «Phone CP SIM» (pulmonarypocus.com)
Estudiado el 30/10/2026: HTML descargado y leído como datos, sin ejecutar nada fuera del navegador; abierto en Chromium
390×844 (capturas en `/tmp/plan-socialista/eco-reforma/ppocus-capturas/`: `1-inicio`, `2-pw`, `3-color`, `4-cw`; no van al repo).
Ojo con el nombre: **no es de pulmón ni de corazón completo**. Es un laboratorio de **Doppler color y espectral** del
corazón apical (4 y 5 cámaras) que imita los mandos de una máquina Sonosite PX. «CP» es cardiopulmonar de la web, no del simulador.

## 1. Qué es
- La URL `https://www.pulmonarypocus.com/phone-cp-sim` es una página Squarespace (218 802 bytes) con un solo
  `<iframe class="phonecp" title="Phone CP SIM" loading="lazy">` hacia
  `https://edwin1906-81.github.io/color-spectral-doppler-lab/phone.html` (GitHub Pages de un autor externo a la web).
- Hermanas (URL literales, del menú de `page.html`): `https://www.pulmonarypocus.com/hemodynamic-lab` (iframe a
  `https://edwin1906-81.github.io/Doppler-Lab/hemodynamics/`, otro repositorio) y `https://www.pulmonarypocus.com/mmode-lab`.
- Hay más en el menú (`/vexus-simulator`, `/transducer-movements`, `/color-spectral-doppler`): no abiertas.

## 2. Cómo está hecho (evidencia)
- **Un solo archivo**: `phone.html`, 415 886 bytes en disco (204 117 por la red, comprimido), 1 517 líneas, 1 `<script>`.
  Sin librerías: nada de three.js ni WebGL; solo `getContext('2d')` (9 usos), `createImageData/putImageData` (el espectro) y
  `AudioContext` (sonido Doppler sintético). Fuentes Inter y JetBrains Mono de Google Fonts. Sin vídeo, sin `fetch`, sin `localStorage`.
- **Sin clips ni imágenes del corazón.** Las únicas imágenes son 5 JPEG incrustados en base64 (~33-43 KB cada uno, ~180 KB en
  total contando duplicados): el logo y las figuras de 2 preguntas y de una lección (jet de TR en color, cursores CW/PW).
- **La imagen se dibuja en vivo con contornos**: `ANAT` guarda el contorno de VI, VD, AI, AD, válvulas y pared en cm
  (vista 4C y 5C). `draw2d(ph)` dibuja la escena nítida, la **difumina** (ancho del haz) y la **multiplica por ruido de
  moteado** (`vn`, ruido de valor con `Math.sin`), dentro de un sector de 76° (`HALF` = 38°) y 17 cm de profundidad
  (`DEPTH`, 10-22). Se ve como eco real de lejos; de cerca es un dibujo (captura `3-color`).
- **Contracción**: `contraction(ph)` acorta los ventrículos hacia su centroide y `valvesOpen(ph)` abre y cierra válvulas.
- **Rendimiento**: 58-60 fps en Chromium de escritorio con viewport móvil (medido 2 s con `requestAnimationFrame`); en un móvil
  real no medido. El espectro se escribe como una columna de 1 píxel por tic en un lienzo de 1200×300 que se desplaza.

## 3. ¿Separa la hemodinámica de la imagen? Sí, y de forma limpia
Tres capas, todas en funciones puras de **fase del ciclo** `ph` (0-1) y del estado `S`:
1. **Hemodinámica = `flows(ph)`**: ondas de velocidad con gaussianas y senos (E y A mitral, sístole tricuspídea, eyección del
   TSVI, jets de IT/IM/IAo, estenosis aórtica y mitral). Se modifica con `S.sv` (volumen sistólico bajo/normal/alto: 58/106/140
   cm/s de pico TSVI), `S.mvp` (llenado normal / alterado / restrictivo, con E, A y tiempo de deceleración), `S.tr`, `S.mr`,
   `S.as`, `S.ms`, FC y presión de AD (3/8/15). La IT usa 4v²+PAD para la PSVD.
2. **Geometría de chorros = `jets(ph)` + `velAt(J,x,y)`**: cada chorro es un eje con origen, fin, anchura y turbulencia;
   `velAt` da el vector de velocidad en **cualquier punto (x,y) en cm**.
3. **La imagen solo consulta** ese campo: el color (`colorFor`/`velToColor`) y el espectro (`sampleSpectrum`, `gateVel`) leen
   `velAt` con el ángulo de la sonda; `inBlood` decide si el punto está dentro de una cámara. De ahí salen solos el **ángulo
   (cos θ)**, el **aliasing** (en PW la velocidad se «envuelve» alrededor de la escala) y el filtro de pared.
Resultado: la anatomía no calcula nada clínico; el flujo no sabe dibujar. Una cifra (p. ej. IT 4 m/s) vive en un sitio.
Lo que **no** hay: acoplamiento entre presiones y flujo (el volumen sistólico es un mando, no sale de un modelo de corazón).

## 4. Mandos y cifras que muestra
- Vista: A4C / A5C. Modos: 2D, Color, PW, CW (+ superposición color en Doppler). Presets: PW mitral, PW tricuspídeo, CW
  tricuspídeo, CW mitral, fuera de eje (26°), TSVI, CW aórtico. Layout lado a lado o arriba/abajo.
- Mandos de Doppler reales: escala (PRF, con tope por profundidad: `pwNyqMax`), línea base, filtro de pared, volumen de
  muestra, ganancia 2D/color/Doppler, tamaño y posición de la caja de color, invertir, varianza, velocidad de barrido, congelar.
- Un teclado **Sonosite PX** de pantalla (pestañas Keys/Touch/Patient/Learn/Measure) con touchpad: se arrastra la línea D y
  la puerta. **Sin sensores del móvil** (no hay `deviceorientation`), sin giro ni inclinación de la sonda: el «movimiento» es el
  arrastre de la línea D y la caja.
- Medidas: Vmax, gradiente 4v², VTI, ángulo real frente a ángulo de la línea, E/A, tiempo de deceleración, gradiente medio y
  área valvular (EA y EM), dP/dt de IM, PSVD. Una marca «cuadro por segundo» (`pxFR`) baja al ensanchar la caja de color.

## 5. Qué enseña
- 9 preguntas de test (`Q`) con 2 tareas «hazlo en el simulador» (poner la puerta PW en la punta de la mitral; medir el VTI del
  TSVI). Ejemplos: dirección del jet en color, PW frente a CW para 4 m/s, PSVD con 3,0 m/s y PAD 8 → 44 mmHg, ángulo de 60°.
- Retos (`DR`) con comprobación automática y pista que resalta la tecla a tocar; lecciones guiadas (`instr`) con pasos que se
  marcan solos cuando el usuario hace la acción. Errores forzados: ganancia color alta (moteado), filtro de pared bajo.

## 6. Qué hace bien / qué no hace
- Bien: física del Doppler visible (aliasing, ángulo, PRF y profundidad, cuadros por segundo) con consecuencia en pantalla;
  tareas que se corrigen solas; 1 archivo, arranca al instante, sin red de datos.
- No hace: pulmón (A, B, derrame, deslizamiento), VCI, VExUS, vistas paraesternales o subcostales, cambio de patología real
  (solo mandos de lesión), clips reales, rotación/inclinación, modelo hemodinámico cerrado.
- Hermana «Hemodynamic Waveform Lab» (51 848 bytes, un `<canvas>` 2D, 8 escenarios: normal, hipovolemia, shock cardiogénico,
  distributivo, taponamiento, TEP masivo, IT grave, IM aguda; mandos FC, GC, PAS/PAD, PAP, PVC, PAOP; «mystery patient»):
  son **ondas de presión** (catéter de Swan, línea arterial, ECG, ventilación). No dibuja el corazón. Confirma el patrón:
  presiones en un laboratorio, imagen en otro, sin conectarlos.

## Para la reforma de la eco (idea, no código)
1. **Dos motores con un contrato fino** (idea, no código): un «motor del corazón» que da, por fase del ciclo, volúmenes,
   presiones y un campo de velocidad `v(x,y,fase)`; y un «motor de la imagen» que solo lee eso. Es lo que hace el simulador,
   más claro que mezclar. Para nosotros: el corazón vivo ya existe; el contrato sería lo que la imagen puede pedirle.
2. **Contornos paramétricos de cámaras en cm** (idea, no código): la anatomía como polígonos con unidades físicas permite medir
   (diámetros, VTI, áreas) y cambiar de vista sin clips; sirve para nuestras vistas sin vídeo real.
3. **Ángulo y aliasing como lecciones** (idea, no código): enseñar la subestimación por ángulo y el aliasing con el mando de
   escala; nuestra eco aún no tiene Doppler espectral dibujado así.
4. **Tareas con comprobación automática** (idea, no código): «pon la puerta en el TSVI» con pista y verificación, como retos
   de Estudiar; encaja con las reglas de preguntas (REGLAS §8) porque el alumno actúa, no solo contesta.
5. **Imagen difuminada + moteado como un solo paso final** (idea, no código): dibujar nítido, difuminar y multiplicar por
   ruido da un aspecto de eco barato (sin imágenes con licencia) y a 60 fps; útil si necesitamos relleno visual sin clips.
6. **No copiar su límite**: su volumen sistólico es un mando suelto. En la nuestra, que el flujo salga del corazón (precarga,
   poscarga, contractilidad) mantiene la fisiología coherente con REGLAS §1.14 (topes con consecuencia).

## No comprobado / riesgo
- Rendimiento en un móvil real (solo Chromium de escritorio con viewport móvil). Licencia del código: no vi ninguna; por eso solo ideas.
- No abrí `/mmode-lab` ni `/vexus-simulator`; las cifras de lección fuera del código leído no están verificadas clínicamente.
- Solo el archivo desplegado; el repositorio puede tener otras versiones. «Sensores del móvil: ninguno» se basa en no hallar el
  texto `deviceorientation` en el HTML.
