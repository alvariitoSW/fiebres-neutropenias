# Informe base del juez de geometría (B-045 J-geo) · dibujo de hoy
Programa: `js/modules/eco/pruebas/geometria-juez.mjs` (Node, ~40 s; `node autonomo/jueces.mjs --geometria [--dibujo hoy]`).
Cubre las 9 formas × g {0; 0,5; 1} (normal, vasoplejía y dilatada: un punto) = 147 filas; telediástole y telesístole; A4C,
eje corto (papilares) y PLAX. Resultado de hoy: **10 fallos de 147**, todos en las filas «medidas del A4C». Capturas del
A4C de cada extremo: `autonomo/bloques/mv-eco/geometria-capturas/*.png` (contornos de VI/VD/AI/AD, telediástole).

## Qué falla hoy
- **Contornos**: 0 cruces y el endocardio del VI nunca sale del epicardio, en las 108 filas de contorno. La «nave espacial» no
  es un contorno que se cruce: es de proporciones.
- **HP crónica g=1 (la nave)**, 4 criterios con fuente en rojo: pared libre del VD 1,8 mm (hipertrofia esperada >5 mm);
  LVEI 0,92 (tabique sin aplanar; esperado >1,1); área de la AD en telesístole 11,5 cm² (esperado >18); pared del VI 12,6 mm
  (>10). VD/VI basal 1,08 y VD basal 45,6 mm sí cumplen (>1,0; >41): el motor da la dilatación, el dibujo no la acompaña.
- **TEP g=1**: VD basal 42,8 y VD/VI 1,10 bien; LVEI 0,92 (esperado >1,1) y pared del VI 14,1 mm.
- Pared del VI >10 mm (Lang p.17) en hemorragia/derrame g≥0,5 (11-14,7 mm), vasoplejía (11,5), TEP y HP g≥0,5: la masa del VI es
  constante y la cavidad pequeña engorda la pared. Hallazgo, sin fuente que lo permita: decide el director.
- **Hipertrofia g=0 y 0,5**: pared 15 mm ya en el mínimo del mando (el g=0 no es normal).

## Rangos usados (páginas impresas = páginas del PDF, comprobadas con pdftotext)
| Medida | Rango | Fuente |
|---|---|---|
| VD basal | 25-41 mm (dilatado >41) | Lang 2015 p.20 (Tabla 8); Mukherjee 2025 p.145 (>49 grave) |
| Pared libre VD | 1-5 mm; HP grave >5 | Lang p.20; Mukherjee p.144-145 (<5 mm; 5-7 leve) |
| VD/VI basal | ≤1,0; HP/TEP grave >1,0 | ESC/ERS 2022 p.3645 (Tabla 10) |
| LVEI (eje corto) | ≤1,1; HP/TEP grave >1,1 | ESC/ERS 2022 p.3645 (Tabla 10); Mukherjee p.148 (definición) |
| Pared VI (septo y posterior) | 6-10 mm; hipertrofia >10 | Lang 2015 p.17 (Tabla 6, varón; >10 derivado) |
| Área AD telesistólica | <19 cm²; HP grave >18 | Mukherjee p.145; ESC/ERS p.3645 |
Techos de «paciente posible» (VD basal 70 mm, pared VD 15, VD/VI 2,5, LVEI 2,5, pared VI 25, AD 40 cm²): **sin fuente**;
solo avisan. El límite inferior de VD basal (25) solo se exige a «normal».

## Cómo mide
Contornos = corte de las piezas del dibujo con `planoVista`/`cortarPieza` (ecografia.mjs) sobre `construirCorazon(estadoGeo(..))`.
VD basal = del endocardio libre al epicardio del VI (lado del tabique), tercio basal; pared = distancia endo-epi (mediana).

## No comprobado / riesgo
Las capturas son los contornos, no la imagen del ecógrafo (esa, con navegador, queda para otro encargo). La pared del VI se mide en 2D
(oblicua en el corte): puede sobrestimar 1-2 mm. Hace falta subir el `?v=` (la caché da ❌ por la pieza nueva en js/).
