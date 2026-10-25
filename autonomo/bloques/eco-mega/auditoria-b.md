# Auditoría B · eco-mega parada 1 · texto de eco-imagen.html (+ maqueta.js)
Fuente: física general de ultrasonidos (no hay PDF). Resultado: 0 graves, 6 menores, 1 hueco.

## Graves
- Ninguno. Ninguna cifra clínica nueva; las físicas (40 ms, 2/3/4 veces, foco 3-16 cm) son de la maqueta y no de un paciente.

## Menores
1. eco-imagen.html mejora 1 (l.~83): «la sangre casi no da eco y su grano se mueve despacio». Lo primero es correcto. Lo segundo es impreciso: el moteado de la sangre cambia rápido (se descorrelaciona con el flujo; es lo que usa el Doppler). Lo lento es una decisión de diseño, no física. Propuesta: «su grano es tenue y no sigue a la pared».
2. Mejora 2 (l.~88): «algo menos el pericardio». El pericardio es un reflector fuerte, pero no deja una sombra clínica como la costilla o el calcio. Suavizar o quitar.
3. Mejora 4 (l.~102): «válvulas, que el haz corta de frente». Solo es cierto para las valvas cerradas o el plano del anillo; las valvas abiertas quedan casi paralelas al haz. Decir «el plano valvular».
4. Mejora 6: «hacia los bordes del abanico se ensancha». Cierto en esencia (menos elementos y haz oblicuo); aceptable, sin matiz perdido grave.
5. Mejora 7: «Prueba a recuperar la imagen con la ganancia y la profundidad» sugiere que ese mando arregla una ventana pobre. Con pulmón interpuesto no se arregla; se cambia de ventana o se coloca al paciente. Añadir una frase.
6. Visible (#ei-tiempos, maqueta.js l.82): «calidad N (192 haces × 448 muestras)» y la mejora 8 («menos haces y menos muestras») es jerga del programa, no del médico (§2.7). Es un rótulo de prueba; fuera antes de entrar en la app. También «Antes/Después» y «Preparando el paciente…» valen solo en la maqueta.

## Código (punto 3)
- Menor-alto: `gauss()` (ecografia-v2.mjs l.43-44) es casi línea por línea `gaussK()` de echodemo bmode.js l.36-43 (mismo tope `ceil(sigma*2.5)`, mismo bucle de normalización). Es un núcleo gaussiano genérico, pero REGLAS §1.6 dice «el código nunca se copia»: reescribirlo (p. ej. kernel por tabla de pesos) o sacarlo de un módulo propio ya existente.
- Sombra (l.208-224): misma idea que `shadows()` (atenuación acumulada por haz hacia abajo) pero con código propio (factores por tejido, no un mínimo corrido). Idea permitida. Hash de retícula, TGC, foco y ventana: no se parecen a bmode.js en lo revisado.

## Frases revisadas y correctas
Sombra acústica y refuerzo posterior (sangre y líquido atenúan menos que el músculo); reverberación entre sonda y pared (bandas a 2×, 3×, 4× y quietas en pantalla); reflexión especular (brilla de frente, se apaga paralelo; dropout de pared lateral y tabique en A4C: clásico); TGC; foco (estrecho en el foco, ancho delante y detrás); ventana pobre (grasa, pulmón, entra y sale con la respiración).

## Cifras de atenuación (0,25 dB/mm y ~0,09)
- No salen en la página (solo en código: `fB`, `fH`, `kb` de ecografia-v2.mjs l.212). 0,25 dB/mm = 2,5 dB/cm de ida y vuelta ≈ 0,5 dB/cm/MHz a 2,5 MHz: dentro de lo esperable. 0,09 dB/mm en sangre ≈ 0,18 dB/cm/MHz de ida: razonable. Al no mostrarse, no hay incumplimiento de §1.2; si se muestran, rotular «ilustrativo».

## Origen visible (punto 2)
Presente arriba: «ilustrativo · fisiología general» y «idea de The Heart by Ultrasound (D. Ouyang), reconstruida»; al pie, créditos de Z-Anatomy (CC BY-SA 4.0) y BodyParts3D. OK.

## Huecos
- La página no dice qué es ilustrativo en concreto (la atenuación por tejido, los dB del TGC ±12 y las intensidades por defecto sí lo son según el pie, pero el rótulo está lejos de cada mando). Menor.

## No comprobado / riesgo
No leí maqueta.js entero (solo textos visibles y nombres de vista/paciente) ni comparé ecografia-v2.mjs con bmode.js más allá de una muestra: puede haber otros fragmentos parecidos. Las capturas y el comportamiento no se vieron.
