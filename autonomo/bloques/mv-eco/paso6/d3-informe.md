# D3 · textura (paso 6) — informe
**1. Escalera del SC4C: corregida.** Causa medida (captura + zoom del borde izquierdo): no eran las vértebras (probé juntarlas y
las rayas seguían), eran las **láminas del pulmón** (`construirTorax`, torax.mjs) cortadas por el plano subcostal: cuatro rayas
paralelas de pleura fuera del saco. El A4C ya las omitía (ecografia.mjs:472, mismo motivo). Arreglo en origen: ecografia.mjs:472
omite «Pulmón» también en `sc4c` con el dibujo nuevo. Subcostal real (Mitchell 2019, pág. PDF 31, «SC Four-Chamber View»): se
ve hígado, corazón y pericardio; el texto no describe pleura/pulmón en esa vista (ilustrativo: anatomía general). El dibujo de hoy no cambia.
Capturas: antes `autonomo/bloques/mv-eco/paso6/d3-antes/derrame-sc4c.png`, después `.../d3-despues/derrame-sc4c.png` (borde continuo).
Prueba nueva: `ecografia.test.mjs` («subcostal 4C con el dibujo nuevo: sin láminas de pleura»).
**2. Paredes auriculares del TEP «como alambre»: NO tocado (sin cambio, cabe en otro encargo).** Capturas del antes:
`d3-antes/tep-a4c.png`, `tep-psax.png`. Dos orígenes posibles, sin verificar con medida:
- ecografia.mjs:294 (`[/^(AI|AD|Orejuela)/ → T.auricula`, eco-tejidos.js:10: 2,6 mm, −5 dB, ilustrativo) y :806, que con
  `m.paredes` adelgaza la AD al 30 % (≈0,8 mm) y la baja 15 dB, la AI al 60 % y 8 dB: son líneas de un solo trazo, sin speckle. Si se
  quiere pared de ~2-3 mm con moteado, hay que trazarla como pared («grupos», como el VD) y no como línea: cambio mío posible.
- Si el brillo viene del `especular` de la base/AD (corazon-geo.mjs, `Aurículas` ~l. 327), es de otro constructor.
**Pruebas:** torax + ecografia + instantanea-dibujo: 37 pasan, 0 fallan. `jueces --eco`: sin errores de consola a 390/360; solo el ❌ de `?v=` (esperado).
**No comprobado / riesgo:** la causa «pulmón» la confirmé por captura (rayas desaparecen), no por conteo de píxeles; el SC4C con
ventana pobre/otros escenarios no recapturado; instantánea congelada (si existe para sc4c) puede necesitar regenerarse; TEP sin tocar.
