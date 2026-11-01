# Auditoría G1 (fichas 12, 13, 16 + Visual g1) · 0 graves de cifra; 4 graves de conducta/rótulo, 6 menores
Fuente: caps27-30.pdf p. 1-16 y 30-33 (texto con pdftotext; Fig. 27.5 vista en imagen: transición en PEEP 12, Vt 4 mL/kg PBW, correcto). Las cifras de Tablas 27.1, ecs. 27.1-27.6, 3 mL/cmH2O, 35 %, 2-3 cmH2O, 1-10 L/min, 60/≥80, 35 rpm, 5-8, ≤3, "justo por debajo" cuadran con el PDF. No sale la Tabla 24.1/24.2.

## Graves
1. b3d-peep.js · po-c2 (3.er punto): "el pico de 42,4 lo refleja" como prueba del riesgo de volutrauma/barotrauma. Marino p. 4 (cap. 27) dice lo contrario: el riesgo es función de la presión alveolar (meseta), no del pico; es la «idea errónea». Arreglo: quitar "el pico de 42,4 lo refleja" o poner "la presión alveolar al final de la inspiración sube con la PEEP oculta (p. 31)".
2. b3d-respirador.js · rsp-c6, opción 2 ("Bajar el Vt a 300 mL y esperar a ver si la meseta baja de 30"): la Tabla 27.1, 2.ª etapa (p. 14) manda exactamente eso con meseta >30 (bajar Vt hasta 4 mL/kg = 300 mL con PBW 75). Es defendible según la fuente y se le da como falsa ("sin buscarla Rafael empeora" no está en la fuente). Arreglo: cambiar el distractor por algo falso (p. ej. "Subir el Vt para corregir la SpO2: 600 mL") o reformular el enunciado ("antes de tocar el respirador, ¿qué haces?") y retirar la frase sin cita.
3. b3d-peep.js · po-c4, nota: "cuánta hipercapnia se tolera en el asma; es fisiología general". No es trivial (§1.15) y no se buscó fuente. Además el estado (Vt 333 × FR 10 = 3,3 L/min, 60 kg) es una ventilación minuto muy baja. Buscar: Marino cap. 24 (hipercapnia permisiva) y la ficha neumo-asma-agudo/VM en asma (cap. 25-26 del PDF caps22-26) o GINA 2024 "ventilación en el asma grave" / Leatherman, y citar; si no, rotular "ilustrativo" y no presentar el CO₂ como "subirá" sin cifra.
4. b3d-respirador.js · raj-c6, frase "Flujo inspiratorio de 60 L/min" marcada como error. La p. 14 da 60 L/min "si respira tranquilo o NO tiene respiraciones espontáneas" y ≥80 con distrés o VM ≥10. Isidro tiene FR 30 del ventilador y no se dice que dispare ni que esté en distrés: según el criterio 1 de la fuente, 60 es correcto. Arreglo: añadir al paso "dispara cada respiración con distrés" (dato del caso) o cambiar el error por otro; si no, el "error" es discutible.
(Rótulo falso, §1.15, leve) b3d-peep.js · po-g5, 2.º punto "Subir el flujo inspiratorio… Deducción; la fuente no lo dice": SÍ lo dice, cap. 27 p. 9 («I:E se sube aumentando el flujo inspiratorio») y p. 14; y cap. 28 p. 32 lo lista. Arreglo: citar p(9)/p(32) y quitar `${DED}`.

## Menores
- rsp-c2 (punto 2): "13 − 5 = 8 … muy lejos del límite de 30": el límite de 30 es de la meseta (13), no de la meseta − PEEP (p. 4). Decir "meseta 13, muy lejos de 30".
- rsp-c2 / rsp-c4: "resistencia baja / Pres 4 normal": Marino no da valores normales de resistencia (cobertura §6). Arreglo: "Pres 5 → 4: no cambia; lo que sube es la meseta (p. 3)", sin "normal".
- po-c6, opción 1 ("Ninguna"): su razón ("toda PEEP externa suma…") es falsa, pero Marino p. 33 dice que "probablemente no merece la pena", y po-e3 lo da por correcto; contradice el enunciado ("Quieres añadir"). Aclarar el enunciado o la razón.
- po-g8 / po-c7: omiten la condición de p. 29 (cap. 28, Tracheostomy Timing): "considerar a la semana si hay poca probabilidad de extubar la siguiente". Añadir "y sin perspectiva de extubar" al enunciado, o nota de matiz.
- po-g5: enunciado dice "tres grupos" y el punto 3 junta Ti y FR; Marino lista cuatro maniobras (p. 32). Decir "cuatro maniobras".
- visual-3d-g1.js: nodo «Pico − meseta = Pres» apunta a `#nep-ec-27-1` (solo Ec. 27.1); la frase está en `#nep-fig-27-2`. «Pausa sin flujo: meseta» apunta a `#nep-meseta` (solo un rótulo): mejor `#nep-fig-27-2`.
- Resto de la Visual (comparar VCV/PCV/PRVC, bandas 5-10/10-20/20-30, Tabla 27.1, racimos de PEEP oculta, flujo ver-medir-tratar): fiel.

## No comprobado / riesgo
- Cifras de monitor (Jacinto, Eulalia, Rafael sdra-rigido, pcv 595 mL, VM 13→3,3, oclusión 14,1/1,6) no cotejadas con la app; solo aritmética (PBW, 8×70,5, 500−3×48, 333×10) y rotulado.
- No leí `pendientes-g1.md` ni abrí las páginas del PDF para comprobar el desplazamiento de `#page=` en el navegador (usé las páginas del PDF por texto); p. 29 (cap. 28) de la traqueostomía no verificada con número de página exacto.
