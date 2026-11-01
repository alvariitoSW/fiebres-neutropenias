# b6b · auditoría ciega del eje hormonal (Marino cap. 51, PDF p. 47-58; LA p. 4-6)
Ruta: autonomo/maquetas/b6b-eje-a/ y b6b-eje-b/. Cotejado con pdftotext por página.
Verificado OK: Tabla 51.2 completa (A datos.js:18), Tablas 51.3 y 51.4, 15-25/350 mg, <10/≥35/Δ9, 250 µg, 75 %, 25 %, 60 %, 30-50 %, hidrocortisona 100/8 h y 300+100/8 h, levotiroxina 200-400 µg, liotironina 5-20 y 2,5-10 µg, «TSH >10» (p. 56, correcto; «a menudo», no «siempre»), noradrenalina >0,2 → 10-15 kcal/kg (p. 4 y 19, correcto).

## Graves
- A (1) topes.js:22 y pruebas.js:23: «El yodo solo, sin antitiroideo, no frena la glándula / solo no frena la síntesis de T4 (p. 55)». Marino p. 55 dice que el yodo «bloquea la síntesis y la secreción de T4» y «se añade»/«en combinación»; nunca que solo no frene. Se atribuye a la p. 55 algo que no está y que contradice la lectura literal. Corrección: «la fuente lo usa siempre añadido al antitiroideo» y quitar «no frena» (o citar ATA 2016, ref. 11 de Marino, sobre dar el yodo tras la tionamida).
- B: ninguno.

## Medianos
- B modelo.js:59 y datos.js (Lucrecia, paso 3): «el yodo… nunca solo». Marino p. 55: «puede añadirse», «usado en combinación». «Nunca» es más fuerte que la fuente; es la misma frase que la grave de A, con la cita a p. 55.
- A guia.js:10, pagina.js:59, topes.js:15, modelo.js:21: «con ≥14 días el eje se apaga». Younes (pediátrico) dice solo «<10-14 días se recupera pronto»; «≥14 días apaga el eje» es un umbral inventado a partir de ese rango y deja sin definir 10-13 días. Está rotulado «pediátrica», pero la cifra se presenta como regla. Reformular: «con menos de 10-14 días se recupera pronto; con más, no hay garantía» y marcar el corte como ilustrativo.
- A pruebas.js:37: «La atrofia exige semanas». Younes: sin recuperación detectable antes de ~4 semanas de tratamiento prolongado; no dice que la atrofia exija semanas. Es inferencia sin rótulo.
- A pruebas.js:36: «la hidrocortisona produce fiebre medicamentosa… se seguiría retirando de golpe». Distractor sin fuente; la explicación («dejaría sin explicar la hipotensión») es razonamiento propio sin rótulo «inferencia». Revisar si otra opción es también verosímil.
- B pruebas.js:28: «en el coma, la absorción oral no sirve y la hormona llega tarde». Marino p. 56 solo da 1,5-1,8 µg/kg/día para hipotiroidismo leve-moderado; el motivo es inferencia sin rótulo (hay que marcarlo o buscar fuente, REGLAS §1.15).
- B pruebas.js:35: «Levotiroxina 50-100 µg/día (IV, el 75 % de la oral)». Marino p. 57: 50-100 µg es oral; la IV es el 75 % de esa. Como está escrito parece que 50-100 es la dosis IV. pagina.js:59 lo dice bien.
- B datos.js guía Bibiana, paso 4: «La hidrocortisona de la ficha es 100 mg cada 8 h» aplicada a una paciente con prednisona crónica y operación. La dosis de Marino p. 51 es para CIRCI/shock séptico, no para supresión por corticoide exógeno ni perioperatoria. Cifra cierta en otro caso (§1.12). Lo mismo para el cortisol aleatorio 22 y la prueba de ACTH (umbrales de Marino para el crítico, p. 50-51).
- B Toribio paso 3 «no hace falta medir el cortisol» (datos.js): omite la condición de Marino p. 50-51 (hipotensión refractaria a volumen Y a vasopresor a dosis moderada). A sí la incluye (guia.js:6).

## Menores
- A guia.js:5: «El bloqueo alto es el más frecuente»; Marino p. 50 solo da «hasta el 75 %» en sepsis grave, y de los casos de supresión suprarrenal. «El más frecuente» es deducción.
- A frase 5 (frases-eje-a.md): «6-12 meses al retirar tras un año». Younes da «6-12 meses» en general, sin ligarlo a un año de tratamiento.
- B pruebas.js:25: «la TSH sube al máximo». Marino: «a menudo >10 mU/dL»; «al máximo» no está.
- B Toribio paso 2 «Por eso falta cortisol…»: Marino p. 50 habla de supresión/insuficiencia, no de cifra baja; en CIRCI el cortisol total puede ser normal o alto. Matiz.
- Hueco: la dosis habitual de levotiroxina 75-150 µg/día (p. 56) no sale en ninguna maqueta; tampoco 75 µg/día suelto (no encontrado). Hueco: carbimazol/lítio 300 mg/8 h si hay alergia al yodo (p. 55), y el aviso de PTU (necrosis hepática) y metimazol (colestasis), p. 55. Hueco: fludrocortisona opcional (p. 51).
- «Much ado about not much» (B NOTAS y A) bien rotulado como opinión del autor (p. 57). Notas de TSH mU/mL frente a mU/dL: correctas (p. 53, 56).
- Rótulos `ilustrativo`: presentes en A datos/modelo/pagina y B datos/pagina/modelo; no vi cifra clínica sin rótulo en la pantalla (no revisé cada etiqueta de cada píxel).

## No comprobado / riesgo
- No abrí Younes, Huang-Bianco ni Langouche: se tomó lo que dice `otra-fuente-eje.md`. No revisé A pagina.js líneas 59-130 ni dibujo.js al detalle, ni las explicaciones de todos los distractores de A pruebas.js:1-22; puede haber más inferencias sin rótulo.
- Las páginas se asignaron por pdftotext (PDF p. 47-58), no en el visor.
