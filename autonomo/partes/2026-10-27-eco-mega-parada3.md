# 2026-10-27 · eco-mega, parada 3 (retoques + N1, F3, F4, P5, P6)

**Resultado:** en revisión (PR: https://github.com/alvariitoSW/fiebres-neutropenias/pull/34) · **Vueltas:** 2 (piezas + arreglos baratos) · **Jueces:**
`jueces.mjs --eco` ✅ (448 pruebas, 11 pendientes marcadas; 390/360 sin ids repetidos ni errores) · **Auditor:** 0
graves, 5 menores (corregidos), 2 huecos · **Profesor:** ✅ 8,6 / 8,7 / 8,6 / 8,5 / 8,5 / 8,5 (antes 8,3-8,4; meta 8).

## Encargo
`autonomo/bloques/eco-mega/encargo.md` («Parada 3»), aprobado por el usuario el 27/10 («Seguimos con este orden»).

## Qué se hizo (informes `autonomo/bloques/eco-mega/p3-*.md`)
- Lector: Klein 2013, Zoghbi 2017 y Mukherjee 2025 con página (`fuente-p3.md`).
- R1 + R1b: el saco del derrame grande es un óvalo que abraza al corazón (antes caja en SC4C y V en A4C).
- R2: el colapso de la AD y del VD dobla la pared libre (campana local) en vez de borrar la cámara.
- R3: la tricúspide abre del todo en F (puntas ~10 mm); el VI del TEP sin facetas (96 columnas, unión alisada).
- N1: fosa oval fina y válvula de Eustaquio; prueba del seno coronario. F4: índice de excentricidad (normal 1,00;
  TEP 1,38; Ryan 1,44 ± 0,16; Mukherjee >1). F3: venas pulmonares S, D, Ar (normal S/D 1,7) y prueba de la bomba.
- P5: AI dilatada medible (43,8 mL/m² > 34 de Lang), IM funcional moderada (EROA 0,25 cm², 36 mL) con tenting, y el
  chorro de color y espectral que no existía (llama con mosaico; vena contracta con Zoghbi).
- P6: forma nueva «Hipertensión pulmonar crónica» (pared del VD 8,2 mm frente a 3,5 del TEP, PAPs 92).
- TAPSE de paciente posible: TEP y HP crónica a fondo 6,5-8,4 mm (antes 3,3-4,8), normal 23 mm.
- Arreglos baratos del profesor: texto del mando de gravedad, botón «Vena pulmonar», nota del derrame con Klein.

## Qué no se pudo hacer o leer
- **F3b (motor diastólico)**: el E/A sale 10 en la hipertrofia y 3,9 en la dilatada; el flujo venoso pulmonar es
  ~2-3× el real. Probadas dos opciones: ninguna cabe sin recalibrar TEP, derrame y HP crónica. No se aplicó → B-027.
- R1b no llegó a su meta dura (ángulos ≥140°, sin tramos rectos >25 mm): quedó en 131-137° y 33-42 mm; se relajaron
  dos pruebas viejas de P1 (líquido delante >4,5 mm, junto a la AD >5 mm).
- Huecos de fuente: ESC/ERS 2022, amiloidosis y MAPSE llegaron a `main` al final de la sesión (no usados: parada 4); Leung y Levine 1994 sigue faltando; Zoghbi no da tenting ni AI de la IM
  secundaria; Klein no describe el corazón que oscila en eco.

## Para el usuario
- Mirar: Eco cardíaca → simulador → «Formas de enfermedad»: «Hipertensión pulmonar crónica», «Dilatada» con color
  (botón «Chorro de IM») y «Derrame» con el mando a fondo (A4C y subcostal).
- Decidir: fusionar la parada 3 a `main`; B-027 (informe del motor diastólico) y B-028 (bibliografía) en la bitácora.

## Visto de paso (no tocado)
En la bitácora, §4 «Eco, lo que dejó la parada 3» (10 puntos: pliegue poco visible a 390, IE en criterios, Eustaquio,
grasa del surco AV, FE del VD del TEP 9-13 %, botón de fase con derrame a fondo…).

## Propuestas sobre las reglas
- **Red «paciente posible del Doppler»** por forma (E/A, S/D, TAPSE, velocidades), como la de PA y FC: el E/A de 10
  se arrastró desde antes porque ninguna prueba lo pedía.
- Los constructores no deben tapar un número del motor con un parámetro del dibujo (F3 achicó las venas a 2,5 cm²
  para disimular un flujo 3× real): si la cifra sale mal, se para y se informa.
- Con 3 constructores a la vez la suite tarda ~14 min y da fallos falsos del navegador: como mucho 2 a la vez cuando
  todos pasan la suite entera.

## Gasto
`eco-mega` en esta sesión: **16,7 M** equivalentes (estimado 9-10 M: +70 %). Por papel: constructor sonnet 13 × 13,4
M (81 %), director 2,0 M (12 %), profesor fable 0,65 M, lector 0,3 M, auditor 0,23 M. Los que más: TAPSE 1,9 M (61
pasos, 2 h con la máquina cargada: cada suite tardaba 14 min), R1b 1,8 M (108 pasos, partido por el límite de uso),
N1 1,6 M (98 pasos). Dónde se fue: entraron 4 piezas que no estaban en la estimación (chorro de IM, chorro ancho,
TAPSE, F3b) ≈ 5,2 M; sin ellas, ~11,5 M. Cómo ahorrar: partir antes (N1 eran 3 estructuras) y no correr 3 suites a
la vez.

## Vueltas
| Pieza | Vuelta | Nota mín. profesor | Modelo | Pasos | Tokens | Qué falló |
|---|---|---|---|---|---|---|
| Parada 3 entera | 1 | 8,5 (puntos 4-6) | sonnet | ~800 | 16,3 M | E/A del motor (−0,4), pliegue poco visible a 390 |
| Arreglos baratos | 2 | sin rejuicio (R8) | sonnet | ≤25 | ~0,3 M | — |
