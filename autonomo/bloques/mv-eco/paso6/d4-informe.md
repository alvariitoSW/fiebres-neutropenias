# D4 · dilatada esférica (dibujo 2)
Cambio: ajuste `esfericidad: 0.14` en `AJUSTES` de `corazon-geo-2.mjs` (con comentario). Por encima de 120 mL el largo del VI crece
con v^0,14 en vez de v^0,27 (`geomVi`/`viConSeptal` en `anatomia.mjs` con parámetro opcional `expLargoDil`, null = como siempre;
`baseGeometricaHoy` y los 3 usos de `geomVi(vviTd)` en `corazon-geo.mjs` lo leen de `ajustes`). El radio se recalcula: el volumen
sigue siendo el del motor. Dibujo 1 sin cambios (instantánea verde).
Índice (largo / ancho máximo endocárdico, telediástole, motor: normal 115 mL, dilatada 210 mL, mioVi 1,4):
- dibujo 1: normal 1,48 · dilatada 1,38 · dibujo 2: normal 1,48 · dilatada 1,23 (160 mL: 1,34; 300 mL: 1,09).
Fuente: ni Mitchell 2019 (Fig. 8 p. 8, solo un trazado de VI dilatado) ni Lang 2015 dan índice de esfericidad (pdftotext sin
«sphericity»). El rango 1,2-1,4 / 1,6-2 y el exponente son ILUSTRATIVOS. Nota: el normal sale 1,48, no 1,6-2 (no tocado: fuera de D4).
Prueba: `geometria.test.mjs` «D4 esfericidad» (dilatada < normal, 1,2-1,4, dibujo 1 más alargado) en verde.
Capturas: `autonomo/bloques/mv-eco/capturas-realismo/dilatada-a4c.png` (nueva, globular; solo regeneré esta). PLAX no capturada.
Comprobado: geometria + instantánea + interruptor + contrato: 71 ok, 1 fallo = «tiempo: la prueba entera < 60 s» (máquina cargada por
otra suite en paralelo). `jueces --geometria --dibujo nuevo`: 0 fallos de 147 (el único ❌ es Caché: no se cambia la versión por encargo).
## No comprobado / riesgo
Suite completa de la eco no terminada en el tiempo (timeouts); falta reintentar sola. PLAX y shock-vivo no vistos. Mioc. mayor
a 250 mL se ve casi esférico (≤1,1), sin fuente. Cambia el largo → MAPSE/«descenso» de la dilatada en dibujo 2 (coherente con LeTd).
