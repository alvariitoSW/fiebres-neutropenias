# Auditoría ciega · eco-mega · parada 1 · paso 2 (pieza 2)
Grave 0 · Hueco 0 · Menor 4. Origen de todas las frases: fisiología general (rótulo presente en eco.html: «Origen de las frases: fisiología general… Ilustrativo»).

Frases (simulador.mjs ~l.267-276 del diff):
- ✅ Sombra: «detrás de la costilla no llega sonido; ahí no falta tejido». Correcto (hueso refleja/absorbe).
- ✅ Refuerzo: líquido frena menos el sonido, lo de detrás brilla más, no es tejido más denso. Correcto.
- ✅ Rebotes: reverberación en la pared torácica, a 2× y 3× la distancia, no se mueve con el corazón. Correcto.
- ✅ Foco: haz más estrecho a esa profundidad, mejor resolución lateral; se ensancha por delante y detrás. Correcto.
- ✅ Pulmón: el aire tapa el sonido, la ganancia no lo arregla, cambiar de ventana. Correcto.
- ✅ Ventana pobre (obeso/ventilado): menos señal, más ruido/neblina, ganancia y profundidad ayudan algo, recolocar/cambiar de ventana. Clínicamente razonable.
- ✅ Avisos (subcostal sin costillas, sin sangre central, pulmón no interpuesto, ninguna pared paralela): coherentes.
- ✅ Cifras: ganancia −10..+15 dB, TGC ±12, profundidad 10-24 cm, foco 3-16 cm, «foco de 4 a 12 cm»: son rangos de mando, ilustrativos, rotulados; ninguna se presenta como dato clínico. Los −3/−4 dB y 15 % de «paredes reales» son parámetros de dibujo, no texto visible.
- ✅ echodemo: bmode.js está en inglés; ninguna frase ni función coincide (solo comparten la idea genérica de sombra/reverberación/TGC, no código).

Menores:
- ❌ Menor 1 · especular/especularOtra: «no es que no se contraiga» y «no está enfermo». Matiz: la pared gris por incidencia paralela es un artefacto (dropout lateral), pero «no está enfermo» es más rotundo de lo que la física permite afirmar en un paciente real. Mejor «puede ser artefacto: confirma con otra vista».
- ❌ Menor 2 · reverb: «no es un trombo» omite que también se confunde con masas/catéteres; suficiente para docencia, pero el patrón («no se mueve con el corazón») no descarta trombo por sí solo. Matizar con «no lo explica un trombo, que sí se mueve con la pared».
- ❌ Menor 3 · foco: «Mira el tabique» presupone que se ve el tabique; en PLAX/subcostal quizá otra estructura. Y el efecto fuerte depende de que la imagen simulada lo refleje (no verificado visualmente).
- ❌ Menor 4 · especular, nomenclatura: el botón dice «Pared apagada» y la frase «pared lateral gris»; el término de la fuente de física es «dropout / reflexión especular». Conviene que la frase nombre «reflexión especular» al menos una vez.

No comprobado / riesgo: no abrí la app ni vi las capturas (juzgo texto y código); no verifiqué que el efecto visual de cada artefacto coincida con su frase en las 4 vistas. «Ventilado» (hiperinsuflación/PEEP) y obesidad se justifican por fisiología general, sin fuente citada.
