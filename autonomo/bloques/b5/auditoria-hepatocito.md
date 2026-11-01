# Auditoría ciega · hepatocito B (Marino 2024 cap. 39; páginas PDF B)
Resumen: 1 grave · 5 medianos · 6 menores · 2 huecos.

## Graves
- ❌ pagina.js:61 y guia.js (GUIA_SANO paso 2, «cuatro pasos, los cuatro encendidos»), dibujo.js:5,27: «el NH₃ se une al CO₂ en la mitocondria», «cuatro pasos». p. 6 solo dice «convirtiéndolo en urea por el ciclo de la urea»: ni cuatro pasos, ni CO₂, ni mitocondria. Se rotula `ficha · p. 6` y contradice la propia nota de datos.js («se dibuja como una caja»). Rotular `fisiología general` con cita (bioquímica estándar) o quitarlo.

## Medianos
- ❌ topes (modelo.js) y guia.js GUIA_EDEMA paso 3: «Lactulosa y rifaximina no bastan en el fallo agudo». p. 8: CVVH «superior»; p. 7 dice que la rifaximina es eficaz sola. «No bastan» pasa de comparativo a insuficiente.
- ❌ modelo.js sello «Edema cerebral» con amonio >150 (Casimira 165 sin edema): p. 7 dice «riesgo aumentado», no edema. Titular «riesgo alto de edema».
- ❌ datos.js CASO paso 4, opción 2: «el sello de hipovolemia salta a las 6 deposiciones (p. 7)». p. 7 no dice eso (es `fisiología general` ilustrativa); la cita de página lo hace pasar por Marino.
- ❌ datos.js CASO paso 3: «noradrenalina»; p. 5 solo dice «vasopresores si hacen falta». Cierto de manual, pero sin rótulo ni otra fuente (§1.15: citar p. ej. cap. 17/Surviving Sepsis).
- ❌ datos.js PROFUNDIZAR: «200 g de lactulosa en 700 mL». p. 7: 200 g (300 mL) mezclados con 700 mL de agua; la frase da 700 mL como volumen de lactulosa.

## Menores
- datos.js ERROR2 frase 6 y nota: «las fuentes discrepan» es discrepancia dentro de la misma fuente (Tabla 39.3 1 g vs texto p. 9 2 g «en la mayoría de guías»). Es real, no un «no lo dice»; mejor «tabla y texto de Marino discrepan». No está en NOTAS, solo en la explicación.
- datos.js APUESTA op. 3: «pasar de 100 µmol/L» sin rótulo ilustrativo (modelo da ~113 con func 30: correcto, rotulado).
- datos.js ERROR2 frase 5: «Transfundir por el INR solo añade volumen»: deducción, no de la fuente.
- guia.js GUIA paso 3: «cruza la barrera hematoencefálica» se cita p. 7; es p. 6.
- datos.js CRECERA TIPS cita p. 9; el TIPS está en p. 10.
- modelo.js aviso diarrea «más de 3 deposiciones»: la fuente da objetivo 2-3 y reducir ante diarrea; el umbral 4 es deducción (rotulado p. 7).

## Huecos
- ❌ Tabla 39.3 (p. 9): meta PA media 65 mmHg (Hilario 85/50 = PAM ~62) y ceftriaxona 5-7 días no aparecen.
- ❌ p. 5: AKI en 70 % del FHA y «TRR más agresiva por quitar amonio» (apoya CVVH) no se usa.

## Comprobado ✅
- ✅ NAC (p. 3), albúmina 5 % 70 % (p. 5/9), RL hiponatremia (p. 5), amonio >150/<60 y arterial>venoso (p. 7), lactulosa 2-3 y diarrea (p. 7), rifaximina 400 mg ×3 ≥10 d (p. 7), CVVH 3 criterios y «cuanto antes» (p. 8), trasplante 80→33 % (p. 8), octreótido, endoscopia 12 h, Hb 7, 1:1:1, TEG (p. 9), TIPS (p. 10), West Haven (p. 6-7).
- ✅ «Encuentra el error»: Error 1 (alcalinización) y Error 2 (RL, INR) son errores reales; ninguna frase «cierta» es falsa; no hay otra opción correcta en los pasos de Casimira.
- ✅ Rotulados `ilustrativo`/«opinión del autor» en pantalla: escala amonio 60-300, umbral 120, frenos, TIPS ×0,5, ΔPA/FC de fluidos, RL +0,2, West Haven por hepatocitos, PA/FC del paso 4, hipovolemia 85/50.
- ✅ Pacientes posibles: Casimira (amonio 165/70/81 por el modelo, WH coherente) y Hilario (85/50, FC 118) plausibles; PA 104/60 «con noradrenalina» coherente.

## No comprobado / riesgo
- No abrí fichas `ma-*` ni la UI renderizada: textos de pantalla leídos solo en los .js; pagina.js leído por grep (líneas 96-125 no revisadas en su totalidad). Cifras de Casimira (ALT 5.800, INR 3,4, 0,3 mL/kg/h) sin fuente por ser caso inventado.
