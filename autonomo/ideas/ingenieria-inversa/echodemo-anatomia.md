# The Heart by Ultrasound (Ouyang): la anatomía del corazón que se ve
Etiquetas: [V] visto en su código o datos · [D] deducido · [N] no visto. No repite ciclo, B-mode ni vistas (ya en `js/modules/eco/README.md`).
Capturas: `theirs-planes.jpg` (su capítulo 04, del propio repo: `docs/screenshots/planes.webp`) y `ours.jpg` (nuestro A4C en el laboratorio local). Nada suyo va al repositorio.

## 1. Cómo definen la forma del corazón
- [V] **No hay fórmula: hay una escultura.** Es UN corazón modelado a mano en Blender (`anatomy.json`: `generator: blender/build_heart.py`; el script no está en el repo). Se exporta como glTF dentro de `assets/heart.json` (985 KB) y `valves.json` (1,6 MB).
- [V] El miocardio es **una malla cerrada de 23.988 vértices** (epi y endo en un solo sólido). Septo, pared y aurículas salen del volumen esculpido, no de un número. Otras mallas: papilares/trabéculas del VD (4.596 v), coronarias y cuatro valvas (1.728 v). `valves.json` («borrador 2») trae valvas y cuerdas más finas (1.880 a 5.280 v por pieza).
- [V] **Morph targets** (formas clave que se mezclan con un peso 0-1): `systole`, `amyloid`, `amyloid_systole`. La diástole es la malla base y la sístole es un único peso `s`. Las valvas llevan 8 formas más (`leaflets_mid`, `leaflets` y sus versiones con amiloide y sístole).
- [V] `s = 1 − (vol − ESV)/(EDV − ESV)`: el peso sale **solo del volumen del VI** (curva de keyframes con spline monótono, `cyclemodel.js`). VD, aurículas y aorta se mueven con ese mismo `s`; no tienen volumen propio. [D]
- [V] Regiones por vértice (VI, VD, AI, AD, aorta, AP, venas): permiten escalar la sístole por zona (una pared acinética es un vector de ceros en sus vértices).
- [V] Las enfermedades (HCM, amiloide, Barlow, bicúspide, IM, LVAD…) son **más formas clave**, ajustadas para que la imagen dé la cifra que el texto imprime (`*cal.js`).

## 2. Grosor y movimiento (su `anatomy.json`, mm)
| | Diástole | Sístole | Cambio |
|---|---|---|---|
| Septo | 8,6 | 13,3 | +55 % |
| Pared posterior | 8,9 | 13,7 | +54 % |
| Diámetro VI | 47,4 | 31,7 | −33 % |
| Volumen VI (mL) | 111,9 | 38,8 | FE 65 % |
| Pared libre VD | 3,4 | 4,4 | +29 % |
| Anillo mitral (z) | 0 | −14 | baja 14 |
| Anillo tricuspídeo (z) | −8 | −28 | baja 20 |
| Mitral–ápex endo (cm), calculado por mí | 8,85 | 7,26 | −18 % |
| Volumen AI (mL) | 34 | 50 | se llena |
- [V] Amiloide: septo 16,3 → 19,3 mm.
- [V] **Torsión: no vista.** No hay giro del ápex en sus datos; solo puntos y formas clave. [D] El corazón va de una forma a otra a la vez: sin retraso base-ápex ni asincronía del VD.

## 3. Valvas, cuerdas, papilares, pericardio
- [V] **Valvas con 3 formas** (cerrada, intermedia, abierta) y un «drive» 0-1 escrito a mano por válvula (`mv`, `tv`, `av`, `pv`, suavizados con smoothstep). La valva recorre un arco: peso medio `2x` hasta 0,5 y `2(1−x)` después.
- [V] **Faldas** (`skirts.js`, `hinges.json`): membranas que unen cada bisagra a la pared donde el modelo deja hueco (p. ej. la cortina aorto-mitral que falta). Se cortan en el plano y solo se pintan si de verdad unen valva y pared en ese corte.
- [V] **Cuerdas**: malla por válvula, mueven con su drive. En la imagen se cortan como **losa con grosor** (`slab`): las que cruzan el centro del plano brillan más (`chordsCore`, losa fina). Cuerda 4 dB, valva 15 dB.
- [V] **Papilares y trabéculas del VD** son una malla (región 2). Truco útil: un corte suelto en la cavidad **se desvanece con la distancia a la pared** (de 0,1 a 0,35 cm) para no enseñar manchas flotantes en sístole. Trabéculas del VI: no vistas. [N]
- [V] **Pericardio**: malla propia que sigue al miocardio; con derrame el saco se queda quieto. Brillo 16 dB, hueco 1,2 mm. Grosor de valva 1,2 mm.
- [V] El corte de una valva se rellena con regla no cero: un embudo cortado transversalmente deja un agujero.

## 4. Cómo se ve cada pieza (`bmode.js`, dB frente al miocardio)
sangre −60 · miocardio 0 · grasa 3 · cuerda 4 · fibroso 6 · valva 15 · pericardio 16 · calcio 22 · hígado −4. [V]
- Moteado: dispersores gaussianos pegados a la estructura, más variación lenta de ~1,5 dB; haz armónico con 0,6 mm axial. [V]
- Borde especular donde el haz incide de frente (6-8 dB en paredes, 7 en valvas). [V]
- **Sombra acústica solo tras calcio y columna.** Costillas y pulmón: no vistos. [V/N]
- Pared torácica y clutter de reverberación en los primeros cm; en subcostal, hígado. Sin hígado en las paraesternales. [V]

## 5. Fisiología frente a escrito a mano
- [V] Con fuente: intervalos de contracción, eyección y relajación (Alhakak 2025: 40/292/96 ms), 80 % del llenado en la fase temprana (Mitchell 2014), cifras normales de eco (Lang 2015).
- [V] **A mano y fijo en el tiempo**: curva de volumen, presiones, 6 eventos valvulares (mvc 25, avo 65, avc 357, mvo 453, eEnd 700, aOn 780 ms) y los drives. FC fija en 70 (RR 857 ms). Nada reacciona a precarga, poscarga ni frecuencia: el ciclo es función pura del tiempo.
- [V] El grosor sistólico y el descenso del anillo están **cocidos en la forma clave**; no se calculan.

## 6. Comparado con el nuestro (entrada → salida)
Medido hoy con `geomVi()` de `corazon-geo.mjs` (VI de 120 mL → 50 mL):
| Entrada | Su malla | La nuestra |
|---|---|---|
| Pared del VI, diástole → sístole | 8,6 → 13,3 mm (+55 %) | 9,7 → 13,9 mm (+44 %) |
| Diámetro de la cavidad | 47,4 → 31,7 mm | 54,1 → 37,6 mm (radio máximo; algo mayor) |
| Acortamiento largo | −18 % | −21 % de la cavidad |
| Descenso de la base | 14 mm | 12,2 mm |
| TAPSE (descenso tricúspide) | 20 mm | ~21 mm (`TAPSE_POR_ML`) |
| Torsión | no tiene | ~7° (`mover`, `tau`) |
| FE | 65 % (112 → 39 mL) | 58 % (120 → 50 mL) |
- **Ganan ellos**: contornos orgánicos (septo curvado, aurículas, orejuelas, raíz aórtica); cortina aorto-mitral y faldas; valvas con comisuras; losa de cuerdas; difuminado de papilares sueltos; pericardio pegado; enfermedades como formas clave; regiones por vértice para la pared acinética.
- **Ganamos nosotros**: la forma **sale de la fisiología** (volumen del motor → geometría, de 35 a 320 mL, no un corazón único); pared de **volumen constante** (el engrosamiento es consecuencia, no dato cocido); torsión; TAPSE calibrado por mL vaciado; derrame que crece; ciclo que reacciona a precarga, FC y escenarios; pared torácica en capas; sin mallas de 2,9 MB.
- [D] Su imagen es más «de libro»; la nuestra, más esquemática (ápex alargado en el A4C de `ours.jpg`: VI mucho más largo que ancho).

## Propuestas para un corazón más real
1. **Cuerdas como losa con brillo según cuánto cruzan el plano.** Aporta cuerdas que brillan al cruzar el centro y se apagan al borde, como en un eco real. Esfuerzo **pequeño**. Encaja en `ecografia.mjs` (`elementosDelCorte`; las cuerdas ya existen en `corazon-geo.mjs`).
2. **Desvanecer papilares y trabéculas sueltos con la distancia a la pared.** Evita manchas flotantes en sístole. **Pequeño**. `ecografia.mjs`, tipo `tubo` de `(Papilar|Banda moderadora)`.
3. **Prueba de «paciente posible» de la pared** (grosor, descenso, acortamiento, TAPSE en telediástole y telesístole) con rangos de una fuente (Lang 2015), no con sus cifras. Deja un sitio donde corregir el +44 % frente al +55 %. **Pequeño**. `pruebas/geometria.test.mjs`.
4. **Engrosamiento sistólico del VD y estiramiento de las aurículas** más fieles. **Pequeño**, pero falta fuente para el engrosamiento del VD. `corazon-geo.mjs` (`tVd`).
5. **Sombra acústica en valvas calcificadas** (estenosis aórtica: valva a 22 dB y sombra detrás). Enseña lo que se ve en clínica. **Medio**. `ecografia.mjs` (`TIPOS`, `DB`) y `escenarios.mjs`.
6. **Retraso base-ápex** (torsión y acortamiento algo desfasados, no todo a la vez). Más real y nuestro motor ya lo permite. **Medio**. `mover` en `corazon-geo.mjs`.
7. **Ápex menos de bala y aurículas más anatómicas**, con una referencia con fuente. **Medio**. `corazon-geo.mjs` (`REF.lVi`, `N_BALA`).
8. **Cortina aorto-mitral** (cerrar el hueco entre raíz aórtica y valva mitral anterior), visible en A3C y PLAX. **Medio**. `ecografia.mjs` o `corazon-geo.mjs`.
9. **Pared acinética por región** (escala por zona sobre la sístole). Sirve a infarto y Takotsubo. **Grande**. `corazon-geo.mjs` y `escenarios.mjs`.

## No visto / riesgo
- [N] `build_heart.py` no está en el repo: no sé de dónde sale su anatomía base ni la licencia de `heart.json`. No traer sus mallas.
- [N] Qué malla es cuál (siete sin nombre en el glTF): deducido por tamaño y por el diccionario `FLAG` de `heart.js`.
- [N] No abrí intro2echo.com en vivo; la captura es la del propio repo.
- [N] Trabéculas del VI, torsión y fibras: sin datos.
- Riesgo: sus cifras son de **una malla ilustrativa ajustada al texto**, no una fuente clínica; citarlas sería citar un modelo, no a Lang.
- Riesgo: el permiso del autor cubre ideas y texto, no código ni mallas.
