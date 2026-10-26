# Anatomía del corazón: EchoSuite y simulador de ETE de anesthbeta (25/10/2026)
Solo lo nuevo (el resto está en `echosuite.md`, `echosuite-2.md`, `anesthbeta.md`). Playwright 390×844, su JS leído en memoria,
nada guardado salvo 2 capturas (`es-lab.jpg`, `ab-atlas.jpg`). Etiquetas: **visto** / **deducido** / **no visto**.

## 1. EchoSuite (echosuite.app, Probe Lab)
**De dónde sale el corazón**
- Malla fija de **un solo corazón**: `anatomy.json` (40 KB, lista de piezas) + `anatomy.bin.mesh.gz` (1,6 MB). Visto: 57+ piezas
  de «Heart», más vasos, hígado, costillas, esternón, vértebras T1-T12 y piel. Cada pieza lleva nombre, capa, color y `slice:true/false`.
- Corazón: VI (9 006 vértices), VD (13 350), **septo interventricular como pieza propia** (7 506), AI y AD (13 400 cada una),
  **5 músculos papilares** (anterolateral, posteromedial, anterior, medial, posterior), 3 sigmoideas aórticas, 2 valvas mitrales
  (anterior y posterior, **sin festones**), tricúspide y pulmonar de una pieza, raíz aórtica, coronarias y seno coronario. Visto.
- Las valvas aórticas, mitrales y la raíz se llaman `ILLUS_…`: **son ilustrativas, dibujadas por el autor** (visto en el nombre;
  no hay cuerdas tendinosas ni trabéculas entre las piezas: visto, lista completa).
- Origen: `Packages/EchoAnatomyAssets/*.usdc` (app iOS). La procedencia declarada es HuBMAP / Visible Human; la licencia exacta del
  corazón **no la leí en origen** (no visto; ver §3 de anesthbeta, mismo origen probable: CC BY 4.0, deducido).
- No es procedural: una malla por cámara (9-23 mil vértices), no por segmentos miocárdicos.

**Cómo late (la parte buena)**
- La eco **no deforma triángulos**: el sombreador (`bmode.frag`, 25 KB) lee un **volumen 3D etiquetado** (`HeartVolume.png`, 256³
  vóxeles en 16×16 cortes) y, para cada píxel del plano, **desplaza el punto de muestreo** con `beatInverse(p, ápex, eje, latido)`. Visto.
- `beatInverse`, en llano: toma el eje largo ápex→base; en la zona del VI (entre ~5 % y ~95 % de su longitud) estira el eje y
  el radio con un factor `amp`, con **afinado hacia fuera** (`taper`, 0,45). Fuera del miocardio el efecto se apaga (`outside`).
  Constantes vistas en el código: acortamiento axial 0,13, radial 0,28, taper 0,45; ápex, eje y longitud (10,0 cm) salen de `sim.json`.
  No hay giro (**sin torsión**, no vi `rotate`/`twist`: visto). Signo exacto (encoge frente a crece): deducido (encoge).
- **Una sola curva de 512 puntos con 3 canales** (`sim.json: cycle`), interpolada por fracción de ciclo: canal 0 = contracción
  (0 → 1,0 en la muestra 192 → 0,14 en la 448), canal 1 = apertura de AV (mitral/tricúspide: 0,95 en la 320), canal 2 = apertura
  semilunares (1,0 entre 64 y 128, 0 en 192). Es fisiología **de tabla fija**: no depende de FC, precarga ni FE. Visto/deducido.
  El corazón **no cambia de tamaño con el paciente**: un latido, una curva.
- **Valvas**: dos mecanismos. (1) `valveInverse`: gira el volumen alrededor de una **bisagra circular** (centro, normal, radio del anillo
  de `HeartVolume.json`: MV r = 16 mm, TV 24 mm, AV 7,4 mm, PV 12,7 mm), ángulo máximo por válvula `axis.w`. Visto.
  (2) para la aórtica, **un volumen precalculado de 5 fases** (`AorticTrial.rgba`, 41×38×35 vóxeles; 5 fotogramas mezclados con
  `patchOpening` 0-1; carpeta «view-realism» = lo hizo para ganar realismo). Visto.

**Cómo pasa de malla a imagen de eco**
- El volumen etiquetado (cada vóxel = un tejido, id 1-21) + un campo de **distancia al vóxel más cercano** (canal B, 0,1 mm/ud) se
  recorre píxel a píxel. Cada tejido tiene 2 vectores: `tissueStyle` (eco medio/bordes, mezcla de moteado `style.w`) y `tissueLook`
  (brillo, contraste, si es «sangre-like»). Valores vistos: miocardio ~1,00/1,00, moteado 0,75; valvas 0,80 con moteado 0,65;
  sangre y vasos ~0,6-0,9 sin moteado; cuerpo 0,36 de fondo. Sangre = id 20, cuerpo = 21, corazón por tabla.
- Moteado: ruido 3D en celosía (`hashLattice`) mezclado con una envolvente (`speckle = mix(1, envolvente, style.w)`), con un suelo de
  0,008 en tejidos. Compresión logarítmica final `log(1+c·x)/log(1+c)`. Axial/lateral: nombrados pero no leí cómo se aplican.
  Como el ruido se evalúa en el punto **ya deformado**, el moteado viaja con la pared: **ganan** frente a un moteado en pantalla.
- Captura: PLAX con costillas, corazón transparente, sonda y eco en blanco y negro con un cine real aparte.

**Pares de prueba (pantalla/código)**
| Entrada | Salida observada |
|---|---|
| Fracción de ciclo 0,0 | `cycle[0] = [0,0,0]`: ninguna contracción, ninguna válvula abierta |
| 0,25 (muestra 128) | canal 0 = 0,85; semilunares = 1,0; AV = 0 |
| 0,375 (muestra 192) | canal 0 = 1,0 (máximo); semilunares = 0 (cerradas); AV = 0 |
| 0,625 (muestra 320) | canal 0 = 0,46; AV ≈ 0,26; semilunares = 0 |
| Vista PLAX en el selector | corazón en 3D + sector de eco y cine real a la vez (captura) |
Raro: la contracción máxima (0,375) cae **después** de abrirse las semilunares (0,125-0,25), no en medio de la eyección. Deducido: la
curva está desplazada. No lo he comprobado en pantalla.

## 2. Simulador de ETE de anesthbeta (tee-simulator.anesthbeta.com/atlas)
**De dónde sale el corazón**
- `anatomy.bin` (5,3 MB) + `anatomy.json`: **57 mallas** (visto). Fuentes declaradas dentro del JSON: «Heart, Female v1.2» (Browne y
  Schlehlein, DOI 10.48539/HBM384.VWVH.465, **CC BY 4.0**) y «HuBMAP CCF Blood Vasculature, Female v1.2» (CC BY 4.0).
  Los .glb vienen de Visible Human Female (visto). Licencia confirmada en el JSON de ellos; **no la verifiqué en origen** (no visto).
- Piezas: septo, AI, VI, AD, VD, **5 papilares** (dos de 1 500 y 780 vértices, tres diminutos), 4 válvulas **de una pieza cada una**,
  4 venas pulmonares, seno coronario, arterias y venas coronarias, VCS, VCI, aorta. Visto. **Sin cuerdas ni trabéculas** (no en lista).
- Grosor de paredes: viene de la malla de VI y septo (no se calcula). Todas las cámaras son sólidos cerrados, **que permiten cortarlas**.

**Cómo late**
- `updateGeometry(fase)` mueve **cada vértice** con `deformPoint`. Visto en el código: en la zona del eje largo
  (ventana suave desde −0,45 hasta 2,8 unidades de la base, apagada de 4 a 6,5) aplica, con `s = systole(fase)` de 0 a 1:
  radio × (1 − 0,115·s·w), **eje × (1 − 0,06·s·w)** (acorta 6 %), y **giro de 0,07 rad (4°) alrededor del eje**. **Tiene torsión.**
- `systole(p)`: 0 hasta 0,055; sube suave hasta 1 en 0,345; se mantiene hasta 0,445; baja a 0,2 hacia 0,70; 0,2 hasta 0,82; vuelve a 0
  hacia 1. Visto. FC 40-140 solo cambia la velocidad del reloj (deducido): **fisiología de tabla fija**, igual que EchoSuite.
- `cardiacState(fase)`: `AV`, `PV`, `MV`, `TV` con aperturas suaves (visto): aórtica 0,055→0,10 abre, 0,315→0,365 cierra; pulmonar
  0,060→0,105 y 0,325→0,375; mitral y tricúspide abren 0,445→0,535 (precoz), rebajan a 0,45 en la media y suben 0,82→0,90 (contracción
  auricular), cierran 0,94→1. Texto de la etapa (isovolumétrica, eyección, relajación, tres de diástole). Visto.

**Valvas**
- `createLeaflets`: la **mitral se parte en seis** (A1-A3, P1-P3; `s0,s1` = tercios del arco de −1 a 1) y las demás en tantas valvas
  como comisuras (aórtica LCC/RCC/NCC por ángulo desde el origen de la coronaria izquierda; tricúspide A/P/S; pulmonar A/R/L).
  Cada valva es una **rejilla de 24×14** con dos copias, `closed` y `opened` (más grosor 0,018 de modelo = 0,36 mm), y **se mezclan
  linealmente con `cardiacState`** (visto). Las posiciones salen de funciones propias (`mitralPoint`, `cuspPoint`), no de la malla.
  Ellos mismos dicen que son «reconstrucciones educativas, no 4D medido». La mezcla es lineal, no un arco: **perdería longitud a mitad
  de camino** (deducido; nosotros ya lo evitamos con la parábola).
- Anillos: centros y normales fijos (MV ~16×18 mm, TV ~21×22, AV ~12, PV ~11, de unidades de 20 mm). Visto. Sin cuerdas ni movimiento del anillo.

**Imagen de eco por vista**
- Corte en 2D con `ctx` (canvas): el plano corta la malla y **rellena el contorno** con color por estructura (rosa VI, azul VD,
  naranja AI, violeta AD...) o gris. Ruido de 192 px (generador lineal con semilla fija) multiplicado al 58 % sobre el fondo **igual
  en todas las estructuras** (sin ecogenicidad por tejido ni sombra). Moteado fijo en pantalla: no sigue la pared. Visto.
- Sector de ±0,74 rad (±42°); rótulos de estructura sobre el corte (captura: LA, RA, LV, RV, A1, A2, TV-A, en ME 4 cámaras a 10°).

**Pares de prueba**
| Entrada | Salida |
|---|---|
| fase 0,10 | AV = 1 (abierta), PV = 1; sístole = 0,12; etapa «eyección» |
| fase 0,345 | sístole = 1 → radio −11,5 %, eje −6 %, giro 4° (en la zona de pared) |
| fase 0,535 | MV y TV = 1 (llenado precoz), AV = 0 |
| fase 0,70 | sístole = 0,2, MV = 0,45 aprox. (media) |
| ME 4 cámaras | ángulo 10°, 16,8 cm, estructuras LA, RA, LV, RV, MV, TV, septo |

## 3. Nuestro corazón (`corazon-geo.mjs`, 724 líneas, + `ecografia.mjs`)
- **Procedural** desde el estado del motor: VI «bala» con perfil de base casi fija, VD en media luna, aurículas como cúpulas sobre una
  «huella», raíz aórtica e infundíbulo. El volumen de miocardio de referencia es 130 mL (pared telediastólica 9,6 mm) y la pared **engruesa
  en sístole** por conservación de masa (visto en README/pruebas).
- Valvas: **tres formas por arco** (cerrada, medio abierta, abierta; parábola de Lagrange) con coaptación, carga, abombamiento y apertura del
  motor. Papilares del VI (2) y del VD (anterior, posterior y septal), con cuerdas al borde libre; trabéculas (crestas) VI finas en el
  tercio apical y VD gruesas en dos tercios; anillos que se contraen ~20 %; TAPSE y descenso de la base. Visto.
- **Sin torsión** (no encuentro «twist» ni «torsión» en `corazon-geo.mjs`), mitral sin A1-P3 (no encontré festones: no visto) y sin
  ecogenicidad por tejido salvo los dB «ilustrativos» (README, «Ilustrativo»).

## 4. Quién gana en qué
| Aspecto | Ellos | Nosotros |
|---|---|---|
| Forma anatómica | Malla real (Visible Human), con forma verosímil | Procedural, con proporciones genéricas |
| Fisiología | Curva fija (3 canales) o `systole()` fija: no depende de volumen/presión | Todo sale del motor (volúmenes, E/A, TAPSE, FE) |
| Valvas | A1-P3 por 6 rejillas; EchoSuite: volumen de 5 fases (aórtica) | 3 formas por arco, longitud conservada, abren con el flujo |
| Cuerdas / trabéculas | Ninguna | Ambas (ilustrativas) |
| Torsión | anesthbeta: 4° (visto); EchoSuite: ninguna | Ninguna |
| Imagen de eco | EchoSuite: ecogenicidad+moteado 3D que viaja con la pared; anesthbeta: relleno plano con ruido fijo | Moteado afín a la pared, cierre de paredes, ganancia; sin volumen por vóxel |
| Valor clínico | Una anatomía bonita que no responde a nada | El paciente cambia y la imagen cambia |

## Propuestas para un corazón más real
1. **Torsión del VI**: giro de ~4° (valor de anesthbeta, **sin fuente clínica**: pedir strain/torsión de ASE 2025 o Merino) con ventana
   suave a lo largo del eje y proporcional a la contractilidad del motor. Aporta: se ve la torsión y se explica el twist.
   Esfuerzo pequeño. `corazon-geo.mjs` (donde se mueve la cavidad) y prueba en `geometria.test.mjs` (el corazón sigue dentro del saco).
2. **Festones mitrales A1-A3 / P1-P3** con colores propios en la vista Visual/3D y en el eje corto mitral: aporta anatomía de la valva y
   la correlación con «qué corta el plano». Esfuerzo medio. `corazon-geo.mjs` (`coapM`/valva mitral) + `ecografia.mjs`; pedir el PDF
   ASE/SCA (Hahn 2013) para la nomenclatura y las vistas.
3. **Papilares que se acortan en sístole** (visible en eje corto; ellos tienen 5 piezas fijas, nosotros 2+3 y podemos moverlas). Pequeño.
4. **Ecogenicidad por tejido + moteado que viaja** (lo mejor de EchoSuite): ya tenemos el moteado afín; falta una tabla única de
   ecogenicidad (miocardio ~1, valva 0,8, sangre ~0,1, pericardio brillante) en `js/data/` usada por `ecografia.mjs` y la imagen
   (regla del kit visual). Esfuerzo medio. Sin fuente: ilustrativo.
5. **Referencia «real / nuestra» con vídeos libres**: EchoSuite usa cines de Wikimedia (CardioNetworks, CC BY-SA 3.0) con ficha de
   procedencia; podemos hacer lo mismo con clips de Wikimedia comprobados uno a uno. Esfuerzo medio. `eco.html`, `img/`.
6. **Malla Visible Human (CC BY 4.0)** como referencia de forma, no como sustituto: proponerlo solo si el usuario quiere un corazón
   «de atlas» (decisión de arquitectura: rompe «procedural»). Esfuerzo grande; probar antes la licencia en origen.

## No visto / riesgo
- Licencia del corazón de EchoSuite en origen y la de anesthbeta (solo el texto de su JSON: sin verificar en HuBMAP).
- No vi la UI de A/T/P de anesthbeta ni el 3D por segmentos de la mitral en pantalla (solo la rejilla en código).
- El signo del latido de EchoSuite (encoge/crece) y el desfase entre contracción y válvulas son deducidos, sin probar en la pantalla.
- Cómo aplica EchoSuite el desenfoque axial/lateral y la atenuación: no leí esas funciones (solo nombres).
- Grosor de pared: nadie lo declara; sus cifras de fase y ángulo **no son fuente clínica**.
- Riesgo: ambos corazones son de una sola mujer; su movimiento no responde a ningún estado fisiológico.
