# Auditoría ciega 6L (b6b-apendices.js) · fuente TX págs. 32-46 (+ NE p. 4 y 44)

Comprobado: cálculos (Ca 4 mEq/L, 8 kPa=60 mmHg, 39,2 °C=102,6 °F, 38,5=101,3, 70 mmHg=9,31 kPa, PEF 423/402/492, 180÷402=45 %, volemia 5.520 mL, IMC 35,9/15,6, 83 kcal/h, 96 W, 3,1 M hematíes/s, 36 M células/día, 12 pieles/año), cifras copiadas (0,02/7/15 mSv, rangos, 50 mSv, 66/60-26/24-40/36, 100.000 y 2.500 km, 2×10²⁶ ATP, 80 kg), páginas de PEF (varón p. 41, mujer p. 42), pesos (p. 40), French (p. 34-35), gauge (p. 35), °F (p. 36), NE p. 4 (125 %) y NE p. 44 (IMC ≤18,5). Todo cuadra salvo lo siguiente.

## Graves
Ninguno.

## Medianos
1. `b6b-apendices.js:70` (ap-vis-1-1, distractor «16 mEq/L: has multiplicado por la valencia dos veces o no has dividido por el peso molecular»). Fuente p. 33: (8×10/40)×2 = 4. Multiplicar la valencia dos veces da 8, y no dividir por el peso molecular da 160; el 16 no sale de ninguno de los dos errores. El porqué es falso. Cambia la cifra a 8 o explica otro error.
2. `:148` (ap-r-g3) y `:180` (ap-vis-2-1): «el apéndice da el IMC como gráfico sin cifras; … OMS; solo da el gráfico, pág. 37». Fuente: el gráfico del IMC está en **p. 38** (no 37; la p. 37 solo trae el rótulo «Body Mass Index»). Lleva cifras (IMC por peso y talla) y bandas rotuladas: Underweight, Healthy, Overweight, Obese, Extremely Obese. 92 kg y 160 cm da ≈36, en la banda «Obese». Es un caso del §1.15: se dijo «sin cifras / OMS» sin usar la fuente. Cita p. 38 y su rótulo de bandas. El «≥30 OMS» sigue siendo externo y debe llevar su cita o su rótulo.
3. `:213` (ap-vis-2-5): «El límite anual de la EPA es 50 mSv: lleva menos de la mitad». La fuente (p. 37) solo dice «Annual Radiation Limit 50 mSv (EPA)», sin decir a quién se aplica ni que sirva de tope para un paciente. Aplicarlo al paciente como umbral es interpretación sin fuente. Puede cambiar la conducta («lleva menos de la mitad» tranquiliza). Pide fuente (EPA/ICRP: límite ocupacional, no para pacientes) o suavízalo: «para comparar, la tabla da 50 mSv».
4. `:255` (ap-c-g2, distractor «Unos 80 g»): «una célula sin oxígeno aguanta mucho más de lo que aguanta». Rotulado «fisiología general», pero no es trivial (recambio del ATP y tolerancia a la anoxia). El §1.15 exige buscar fuente (Alberts, Molecular Biology of the Cell, cap. de metabolismo; o Marino cap. de DO₂/VO₂) o quitar la frase. Idem `:272-273` («anemia se corrige en horas», «lo que tarda en recuperarse tras una pérdida»): consecuencias clínicas sin cita.

## Menores
5. `:187` (ap-vis-2-2): «el ideal infraestima su gasto»; NE p. 4 solo dice que con >125 % se recomienda el ajustado, no por qué falla el ideal. Reformula «no es lo que recomienda el libro».
6. `:185` «unas calorías de más que la sobrealimentan» y `:146` «dosis plena … es lo que provoca la realimentación»: NE p. 44 da los criterios de riesgo, no el mecanismo ni «dosis plena». Cita otra pág. del cap. 50 o atenúa.
7. `:188` «Ec. 48.3, NE p. 4»: el número de ecuación no sale en el texto extraído (la ecuación es imagen). Compruébalo a ojo antes de dejarlo.
8. `:269-274` (ap-c-e0): la fuente da 5,4×10¹²/L **en varones** adultos, con 5 L; el enunciado dice «el cuerpo» sin acotar. Añade «varón adulto».
9. `:252-258` (ap-c-g2): «una décima parte del peso» para 8 kg está bien, pero «recicla una masa como su propio peso» solo vale para 80 kg (el libro: 177,5 lb media de Norteamérica). Es fiel; solo falta decir «de 80 kg».
10. `:161-167`: la tabla de PEF de mujeres no se pudo cotejar con la ecuación (las tablas son imagen en p. 41-42); la nota «no cuadran del todo» se afirma sin que yo la haya verificado.
11. Marcado de cifras inventadas: peso 92 kg, talla 160 cm, PEF 180, Ca 8, glucosa 180, PaO₂ 8,0 son del paciente inventado y quedan implícitos. Solo «peso ideal 55 kg» lleva «ilustrativo». Pon «caso inventado» en el paciente.

## Huecos
- p. 33-34: la fórmula de osmolalidad (n partículas) y el contraste Na/glucosa (p. 34) no se preguntan (solo se usa de pasada en ap-u-e1). La frase de ap-u-e1 «Na⁺ de 140 mEq/L: 140 mOsm/kg» no se pudo cotejar con la imagen de la fórmula.
- p. 32-33: equivalencias de farmacia/caseras (`mt-caseras`) están solo en «Para profundizar».

## No comprobado / riesgo
Las fórmulas, el gráfico del IMC y los números de las tablas son imágenes: leí el IMC, la tabla de pesos y la tabla de presiones, pero no las dos tablas de PEF de mujeres (p. 42) ni la fórmula de osmolalidad (p. 34). Tampoco se abrió `mt-*` en los .html.
