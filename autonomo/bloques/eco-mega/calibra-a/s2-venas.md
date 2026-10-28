# s2-venas · área real de la vena pulmonar (eco-calibra-a, sesión 2, pieza 6)

**Cambio**: `AREA_VENA_PULMONAR` pasa de 2,5 cm² («ilustrativo», ajustada a ojo) a 1,65 cm², calculada de la fuente.
- Diámetro: vena pulmonar superior derecha en el ostio, 14,5 mm (IC 95 % 13,64-15,36). Cronin 2007, Acad Radiol 14:178-88,
  PMID 17236990 (TC, 200 adultos, edad media 52,8 a). Su primera bifurcación está a 17,6 mm: a 1-2 cm sigue siendo un tronco.
  Área = π(1,45/2)² = 1,65 cm². Origen: `ficha` (fuente abierta; ningún PDF de `docs/` da el calibre de la vena).
- Reparto: 1/4 del retorno por vena (82 % de los adultos tiene 4 venas, Cronin). La fuente no dice qué fracción lleva cada una:
  es el reparto del motor (fisiología general).
- ERRATA DE LA FUENTE (resumen de Cronin): imprime «right superior 17.6 (13.64-15.36)» para el diámetro y «14.5 (17.02-18.23)»
  para la distancia; los intervalos solo cuadran con las cifras cruzadas. Tomé 14,5 / 17,6 (nota en `referencias.mjs`).
- Velocidad normal de comprobación: S 64±14 (mujeres) y 57±11 (varones) cm/s, sanos de ~52 a. Wierzbowska-Drabik 2010,
  Menopause 17:560-5, PMID 20042894. **D normal en cm/s: no encontrada** en fuente abierta (Nagueh 2025 solo da S/D, Gentile 1997
  PMID 9049527 da la curva por edad sin cifras en el resumen). Hueco declarado.

**Antes → después** (VP, cm/s; el flujo del motor no cambia):
| punto | antes S/D/Ar (S/D) | después S/D/Ar (S/D) |
|---|---|---|
| normal | 33/31/7 (1,08) | 51/47/10 (1,08) |
| vasoplejia def | 34/12/3 (2,84) | 52/18/4 (2,84) |
| dilatada def | 35/46/3 (0,77) | 54/70/4 (0,77) |
| tep def | 19/2/8 (10,37) | 29/3/12 (10,37) |
| fallo 100 % | 1/9/0 (0,09) | 1/13/0 (0,09) |
Normal: S 51 frente a 57-64 de la fuente (-10 a -20 %): el resto es del flujo de la AI del motor (S 334 mL/s total), no del
área; no lo tapé. La nota vieja («con el área anatómica daría ~200 cm/s») era falsa: con el motor actual daba ~39.
S/D es cociente: J1 no cambia. Ar normal 10 cm/s ≤ 35 (banda f). `AMORTIGUA_AR` (0,35, ilustrativo) intacto.

**Archivos**: `js/modules/eco/referencias.mjs` (nuevo `VENA_PULMONAR_REF`, `AREA_VENA_PULMONAR_CM2`, al final; ninguna referencia
tocada), `js/modules/eco/doppler.mjs` (importa el área; comentarios). No existe rótulo visible de «ilustrativo» para el área en el
panel: era solo comentario de código, ya corregido. Pruebas recalibradas: ninguna. Claves quitadas de PENDIENTES: ninguna.

**No comprobado / riesgo**: D normal sin fuente numérica; la hipótesis de cifras cruzadas de Cronin se basa en los intervalos de
confianza (lo ideal es abrir el artículo completo); el reparto 1/4 por vena es del motor, sin cita.
