# b6a · paso 3 · placa viva en la app (rama wt/b6a-plv, versión de prueba 20261101-51)
Archivos nuevos: `js/data/placa-viva-data.js`; `js/modules/libros/placa-viva/` (index, placa-viva.html, pagina, modelo, bloqueo-base [motor A], bloqueo-motor, topes, dibujo, hend-dibujo [hendidura de A], hendidura, anim [Motion], guia, pruebas); `autonomo/pruebas/placa-viva.mjs`.
Tocados (solo mi hueco): `libros/index.js`, `index.html` (vista + versión), `css/components.css` (bloque plv-), `marino-portada.html` (botón), `marino-neuro.html` (3 fichas: mn-miastenia→Serapio, mn-gbs-pnc→Florentina/pnc/mcc, mn-relajantes→Melquíades), `jueces-forma/movil/topes.mjs`.
## Comprobación (✅/❌)
✅ Maqueta entera, botón de portada y de cada ficha; «← VOLVER» a la ficha (prueba abre y vuelve en las 5 combinaciones).
✅ `jueces.mjs --modelo placa-viva` y `--forma`: «Todos los jueces a favor» (móvil 390/360, topes 26 mandos, rótulos, nombres internos). Prueba propia: «todas las comprobaciones en verde».
✅ Barrido de extremos (§4.16): 120 combinaciones (3 pacientes × 14 mandos × mín/medio/máx) con cifras y sellos, sin NaN, sin cifra imposible (fuerza 3-100 %, FC 30-160), sin desborde. Ej. Florentina día 3: CV 714 mL (11,9 mL/kg), FC 48, sello «parada»; Melquíades roc+10 min: TOF 0, sello «rocaire»; neostigmina 35→70→(105 no pasa de 70); sugammadex 2 → TOF 2/4, 16 → 4/4.
✅ Cambio de paciente limpia sellos (mel→flor, sera→mel, flor→sera: 0 visibles). ✅ Rótulos ≥9,1 px a 360 (fuente del SVG 11,2); 0 solapes de `<text>`. ✅ Frase/dock (251 px de 800) no tapan Pulgar ni Pulmón con sello grande. ✅ Botones del dock estables (prueba: el nodo sigue el mismo). ✅ Imagen naturalWidth>0, consola 0 errores, ids `plv-` sin duplicar. ✅ `grep autonomo/ js/…placa-viva` vacío.
✅ Tope nuevo: el hielo no tenía tope (jueces: «Hielo: 30 min»): aviso a >2 min y sello + mando apagado a 6 min (tope del modelo, `ilustrativo`; la fuente da 2 min).
## Añadido del encargo, punto a punto
✅ ILUS/UMBRAL/PRESETS(base)/fmt/NC/XC/XV/XA/ZONAS/posicionesAch/anim.js con `cargarMotion()`; pacientes Florentina/Serapio/Melquíades. ✅ sin sello `intub` con `parada`. ✅ sellos en columna. ✅ rótulo «CV». ✅ «1092 mL · 18,2 mL/kg» (monitor = caso). ✅ succinilcolina: sello solo al pulsar. ✅ perfusión 5-12 µg/kg/min. ✅ estímulo repetido en la miastenia (barras 11→5). ✅ inicio 0/2/5 min (roc 4/4→1/4→0/4). ✅ neostigmina 105 = 70. ✅ guías pnc y mcc (4 pasos, foco, cita doble; botones en la ficha). ✅ lupa con Motion (ACh a 150 ms 73,6 → 121 al final; con «reducir movimiento» 27 ms) y captura `cap/12-lupa-390.png`. ✅ «Empeora la miastenia» en Profundizar: **hueco anotado** (mecanismo no hallado, otra-fuente-unm §6). ✅ enlaces cruzados: `ritmoVivo:hiperk` (K 6,1+succinilcolina) y `pulmonVivo`.
❌/ajuste: el pulmón vivo **no tiene** estado «debilidad neuromuscular»; enlazo `sbt-fracaso` (destete que fracasa, PIM/CV). Pedir ese estado al dueño del pulmón.
## Lista R2 (maqueta → app) tachada
~~Explorar/Apuesta/Error/Caso~~ ~~apuesta2/error2/caso2~~ ~~monitor 12 celdas~~ ~~sellos bajo monitor~~ ~~cadena 5 eslabones + lesión~~ ~~único/repetido/TOF~~ ~~lupa 5 pasos + ciclo~~ ~~Tabla 46.6 que se enciende~~ ~~5 guías~~ ~~leyenda de partículas~~ ~~Fig. 46.1~~ ~~fuentes/crecerá/notas/profundizar~~ ~~toast sustituido por «Ver en la ficha» real~~ ~~dock Mandos/Paciente~~.
## Frases nuevas mías (sin cita en ficha; el auditor las coteja)
1. «Marino describe solo el test de 2 minutos (p. 24-25); más tiempo no se simula» (tope hielo; p. 24-25, ilustrativo).
2. Profundizar: «Marino los lista en la Tabla 46.5 (p. 24) pero no explica el mecanismo… hueco anotado» (p. 24); «se ha propuesto que enfriar inhibe la acetilcolinesterasa, sin certeza (PubMed 3614664)» (otra fuente, no es Marino).
3. Textos de enlaces: «el potasio sube otros 0,5 mEq/L» (p. 30); «Intubado con estas cifras…» (sin cifra). Sin cita: ninguna de mecanismo.
## Visto de paso
`.article-figure` pone la leyenda sobre caja blanca; el foco punteado de la guía cruza la rotulación «Placa». CV normal 70 mL/kg, decremento y velocidades del GBS siguen `ilustrativo` (otra fuente por buscar, otra-fuente-unm §1, 4, 7, 11).
## No comprobado / riesgo
Mayéutica del motor común no hecha (encargo siguiente). No miré capturas a 360 ni la primera pantalla tras responder una pregunta; no corrí la suite entera ni la eco (no tocadas). Cifras de FC del GBS (48/132) siguen sin fuente.
