# Auditoría ciega · Mayéutica b1-fluidos.js y b1-hemodinamica.js (Marino caps. 8, 10 y 11)
Fuentes: F = docs/marino-2024-fluidoterapia-caps10-11.pdf (págs. PDF); M = docs/marino-2024-practicas-monitorizacion-caps5-9.pdf.
Cotejado: todas las preguntas (enunciado, opciones, correcta, «porque», explicación), los 6 casos, notas y «Para profundizar». Cifras de Fig. 10.1, Tabla 10.2, Fig. 11.3, 11.4 y 11.5 comprobadas en la imagen. Resultado: 1 grave · 1 hueco · 10 menores. La correcta marcada coincide con el libro en todas.

## GRAVE
- G1 · c2a-2 y c2a-3 (b1-hemodinamica.js:479-494). Ernesto: PA 32/18 (media ≈23) y a las 02:15 enclavamiento de 24 mmHg. M p.52 (punto 4) y p.53: el enclavamiento está «al mismo nivel que la diastólica pulmonar» y, en HTP, *por debajo*. Aquí el enclavamiento supera a la diastólica (24 > 18) y a la media pulmonar: no es un paciente posible según el propio libro, y contradice lo que enseñan cap-g3/cap-g4/cap-e4. Las ondas v enormes podrían explicar algo, pero el caso no lo dice. Arreglo: subir la diastólica (p. ej. 40/26) o bajar el enclavamiento ≤ la diastólica.

## HUECO
- H1 · mar-respuesta-fluidos. F p.29: «ScvO₂ <70 % propuesta como indicación de transfundir hematíes»; F p.30: efecto Haldane (punto 5 del gap). Están en la ficha (marino-fundamentos.html:2659 y 2667) pero ninguna pregunta ni «Para profundizar» los recoge (profundizar solo lista `mar-doppler-esofagico`, b1-hemodinamica.js:366-368). Añadir a profundizar (§8 «nunca se deja fuera sin decirlo»).

## MENOR
- M1 · cri-g2 (b1-fluidos.js:44-50) y rv-g5/c1a-3 (hemodinamica:136-148). El libro da dos repartos distintos del cristaloide: Fig. 10.1 (F p.6) 275 mL al plasma por litro (27,5 %) y F p.26 «el 20 % al plasma». cri-g2 dice «el plasma es solo el 20 %… 275 mL» en la misma frase y rv-g5/c1a-3 usan 20 % (2,25 L). Sin nota de fuentes (REGLAS §1.4). Añadir nota plegable.
- M2 · d2-1 (fluidos:321-328). Enunciado «¿qué fluido lo hace más deprisa?»; correcta «Un coloide, como la albúmina al 5 %» pero la opción 3 (albúmina al 25 %) también es un coloide y F Tabla 10.3 (p.13) la da como la que más expande: dos respuestas defendibles. Solo se resuelven por F p.14 («no usar como reanimación de pérdidas»). Reformular: «¿cuál propone el autor para hipovolemia con riesgo vital?» y poner «Albúmina al 5 %» como opción.
- M3 · d2-7 (fluidos:371-378). Correcta «Sí: en el TCE la albúmina dio más mortalidad». F p.14: «posible excepción… un gran estudio»; el libro no manda cambiar de fluido. Matizar («es una posible excepción»).
- M4 · c1b (hemodinamica:297-364). Andrés está «intubado» y se le hace EPP; F p.35 dice que la EPP se hace «en pacientes con respiración espontánea (con o sin ventilador)» y c1b-6 da por verdadera «vale en respiración espontánea, esté ventilado o no». El caso nunca dice que respira espontáneamente: añadirlo al paciente.
- M5 · c1b-6 error 1 (hemodinamica:343-344). «El bolo no le subirá el VS» es categórico; F p.33: EPP con sensibilidad 85 % y especificidad 92 %. Escribir «probablemente».
- M6 · c1b-2 opción 3 (hemodinamica:314). «Los cortes (S 85 %, E 92 %) que se midieron con la prueba tal cual»: F p.33 no dice en qué condiciones se midieron. Afirmación sin fuente.
- M7 · d1-7 correcta (fluidos:197). «…y la glucosa da lactato»: F p.11: solo el 5 % en el sano, hasta 85 % con compromiso hemodinámico. Ramón (día 2) no está descrito como inestable; decir «si se inestabiliza».
- M8 · d1-6 opción 3 (fluidos:189). F p.8: «hay estudios que lo ven seguro… aun así parece mejor evitarlo si es posible». La opción «Adelante: hay estudios…» es defendible a medias; la correcta «Mejor no» debería decir «si se puede evitar».
- M9 · rv-e5 opción 3 (hemodinamica:108) y col-g5 punto 2 (fluidos:251): «con menos volumen la PVC tiende a bajar» y «le quitarías todavía más agua al intersticio» son inferencias/fisiología general que F no dice (F p.14 solo: «no usar como reanimación de pérdidas»; F p.23: la Pms cambia en el mismo sentido que el volumen). Rotularlas «conocimiento general».
- M10 · c2a-6 (hemodinamica:514-520). La respuesta de Marino al adjunto es «es un monitor, no un tratamiento» (M p.65); la correcta «Que sí: es el shock donde ha mejorado algo» (M p.64) responde a otra cosa y queda ambigua («¿que sí qué?»). Poner el argumento central en la correcta.

## No comprobado / riesgo
- No comprobé la Fig. 8.7 ni la 8.2 (curvas) en imagen, ni la renderización (botones «Ver en el texto», `modelo`); d2-1 apunta a `mc-hemorragico-fluidos`, que no es un id de la ficha sino un `data-tab` de Merino Cardiología (el cap. 15 de Marino sí dice «limitar cristaloides», sh. págs. cap.15; verificado en texto).
- Las cifras del paciente (PA, FC, balances) no se auditan salvo coherencia con el libro; el escenario «IAM anterior con IM aguda» (c2a) es raro clínicamente y no lo valoré.
