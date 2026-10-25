# Parada 1 · paso 2 · pieza 1 (el ecógrafo) — informe del constructor

## Qué cambió
- `js/modules/eco/ecografia.mjs`: `crearEcografo()` es ahora el de la v2 de la maqueta. Mejoras 0-6 encendidas por defecto
  (`MEJORAS_DEFECTO`: paredes .9, moteado .7, sombra .7, reverb .6, especular .7, tgc 1, foco .7) y la 7 (ventana pobre) a 0.
  `formar()` acepta `o.m`, `o.tgc`, `o.focoMm`, `o.ventanaVista` (además de `ref`, `t`, `ganancia`). Exporta `MEJORAS_CERO`.
  `formar()` devuelve además `geometriaNueva`, `pulmon`, `pared`, `apagado()` (para «Señálalo», pieza 2); sigue dando
  `columna`, `colorear`, `x/y`, `campos`, `elementos`, `abiertos`.
- Un arreglo mío sobre la v2: con «especular», el pericardio (solo una línea) perdía su etiqueta de movimiento y la
  prueba de contraste no lo encontraba; ahora la lleva (`trazar(..., etiquetar)`).
- Mejora 8 (calidad automática) en `simulador.mjs`: 4 niveles de haces × muestras (192×448 … 96×256), baja si el EMA
  pasa de 40 ms, sube si el nivel de arriba cabría en 32 ms, cada 6 imágenes; no cuenta el fotograma que construye la
  rejilla (`geometriaNueva`, el equivalente de «fotograma nuevo» de la maqueta). El simulador pasa `ventanaVista`.
  Atlas (`atlas/vd.mjs`): dibuja fotogramas en caché, sin bucle de dibujo → sin calidad automática; solo pasa `ventanaVista`.
- Una sola copia: la maqueta (`autonomo/maquetas/eco-imagen/maqueta.js`) importa el `crearEcografo` real
  («antes» = `m: MEJORAS_CERO`); `ecografia-v2.mjs` borrado (git rm); comentario de `eco-imagen.html` al día.
- Pruebas: nueva «con las mejoras a 0, la imagen es la de antes» (4 vistas, diferencia media < 0,05 niveles de gris; con
  las de por defecto, > 3). Referencia congelada: `pruebas/ecografia-antes.mjs` (copia del ecógrafo anterior, no se edita).
- Versión 20261027-23.

## Pruebas
- ✅ `node --test 'js/modules/eco/pruebas/*.test.mjs'`: 249 tests, 248 pasan, 0 fallan (1 «pendiente» ya existente: RVS).
- ✅ `node autonomo/jueces.mjs --eco`: todos a favor (caché, versión, ids, consola 390/360, eco).
- Dos pruebas de estadísticas ajustadas (no tocan referencias): «contraste» y «determinista». Miden algo que las mejoras
  cambian a propósito: con paredes reales (músculo −6 dB) y grano en la sangre (+3 dB, neblina), miocardio−sangre baja de
  ~28 a ~14 dB; y el tejido cambia 1,6 dB entre t (antes 0,4) porque la sombra lo acerca al ruido de fondo. Ahora cada una
  prueba dos casos: mejoras a 0 con el umbral original (25 dB, <1 dB) y por defecto con umbral nuevo (>10 dB, <2 dB y la
  sangre cambia más del doble).

## Tiempos por imagen (Node, 360×300, mediana de 23 imágenes) antes → después → después en nivel más bajo
plax 14 → 25 → 11 ms · psaxPm 13 → 22 → 10 · a4c 15 → 29 → 13 · sc4c 10 → 19 → 9.

## Lista de comprobación
✅ sin cifras nuevas de fuente (todo ilustrativo / física general, comentado en el código) · ✅ sin textos nuevos a la vista
· ✅ sin ids nuevos, sin colores · ✅ `?v=` subido · ✅ jueces · n/a Mayéutica, enlaces cruzados, frases nuevas.

## No comprobado / riesgo
No miré capturas a 390 px de la imagen en el navegador (solo Node y los jueces): conviene ver el simulador a ojo. En
móvil real la calidad automática no se ha probado (en Node sí hay 2× de coste en el nivel más fino; 25-30 ms en este PC).
`tablaLenta` es global del módulo: dos ecógrafos con distinto moteado alternando la recalcularían (hoy no ocurre).
