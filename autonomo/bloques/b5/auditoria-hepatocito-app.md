# Auditoría hepatocito vivo (app) · fuente: Marino 2024 caps. 39-44, PDF p. 2-24 · solo lo nuevo
Resultado: 0 graves · 3 medianos · 4 menores. Cifras de fuente verificadas en el PDF: >150/<60 (p.7), 400 mg x3 ≥10 d (p.7), lactulosa 2-3 deposiciones y diarrea (p.7), CVVH oliguria/>150/edema (p.8), mortalidad 80→33 % (p.8), albúmina 5 g/dL, 70 %, <3 g/dL, Ringer (p.5 y 9), PAM 65 y ceftriaxona 1 g (Tabla 39.3, p.9), 2 g texto (p.9), TIPS (p.10), AKI 70 % (p.5).

## Graves
Ninguno. Los avisos con cifra de la fuente citan su página correcta (modelo.js:19-27 → p.7, 8, 9, 10, 5).

## Medianos
1. Botón que no enseña lo que promete. marino-abdomen.html:336 «Albúmina 5 % y no Ringer lactato: el astrocito lo enseña →» abre `data-hepatocito-vivo="casimira"` (hígado con 165 µmol/L, sin fluido elegido). El estado no pone ni albúmina ni Ringer (pagina.js:125-127 solo admite `preset[:tips]`). El usuario llega sin ver el contraste. Propuesta: aceptar `casimira:rl` / `hilario:alb`, o cambiar el rótulo a «Ver el modelo».
2. «Sin oliguria» sin variable. modelo.js:23 (aviso CVVH): «sin oliguria ni edema: no cumple ninguno de los tres criterios», origen «ficha · p. 8». La ficha (p.8) da tres criterios: oliguria persistente, NH3 >150, edema. El modelo no mide diuresis; afirmar «sin oliguria» es un dato inventado del paciente. Debe decir «el modelo no mide diuresis: si no hay oliguria…» o rotularlo «ilustrativo».
3. Umbral 120 dentro de un aviso que cita la ficha. modelo.js:23: con prod alta y func <30 el texto dice «no pasa de 120… ninguno de los tres criterios», pero el criterio de p.8 es >150. Está rotulado «opinión del autor» (modelo.js:20, guia.js:16, NOTAS), pero el aviso CVVH conserva origen «ficha · p. 8» y mezcla 120 con la ficha. Con 120-150 el aviso no sale, es decir, la app indica CVVH con un amonio que la ficha no considera criterio. Mantener 120 solo como alerta «de riesgo» y que el aviso CVVH use siempre 150.

## Menores
4. hepatocito-vivo-data.js:19 PRESETS.edema («pasa de 150»): el cálculo da 518 y se recorta a 300 (FIG.cap). Barrido NH3 9-≥300 verosímil (en fallo agudo hay cifras >300), pero el monitor no avisa de que 300 es tope de escala; NOTAS lo dice (data.js:35 «ilustrativa»). El mínimo 9 queda bajo el aviso «no fisiológica» (<10, modelo.js:26) solo como sano+rifaximina+CVVH: ok.
5. Casos de vitales: PA 85/50-128/77, FC 70-118 posibles. Hilario FC 118 con PA 85/50 es coherente; tras albúmina 95/55, FC 112 (dpa/dfc de FLUIDOS: ilustrativos, así rotulados en modelo.js:24, chip OK). Hipovolemia (modelo.js:21) cita «p. 7» pero es fisiología general: el chip lo dice, la página sobra.
6. Botones marino-abdomen.html:390 (lactulosa/rifaximina) abre Casimira sin lactulosa puesta: coherente con el párrafo, pero no activa el mando. 380 (`edema`, «se hincha el astrocito»), 399 (`edema`, CVVH) y 449 (`alta:tips`, «TIPS salta el hígado») cuadran con su párrafo. 364 (casimira, >150): 165 µmol/L cuadra.
7. Enlaces de vías apagadas y del caso (pagina.js:88, data.js:44): `trr-modalidad` existe, pero esa ficha no menciona CVVH ni amonio (0 coincidencias en trr.html). El botón «Ver la modalidad de TRR» manda a una ficha sin el contenido que el caso acaba de enseñar (la CVVH baja el amonio, p.8). Mejor `trr-indicaciones` si habla de hepático, o aclarar «modalidad en general». Ringer: modelo.js:25 y la ficha dicen «encefalopatía hepática» como p.5, ok.

## Chips de origen
Correctos en: ficha (rifaximina, TIPS, albúmina, Ringer, CVVH), ilustrativo (cambios de PA/FC, 120, tope 300, producción bajo/normal/alto), fisiología general (cadena urea, hipovolemia). No hay «fisiología general» no trivial sin buscar fuente salvo: diarrea con 4 deposiciones («opinión del autor», bien) y cifras de hipovolemia (6 deposiciones, 85/50, FC 115: invento del modelo, rotulado «ilustrativo»; aceptable).

## No comprobado / riesgo
No miré la figura 39.2 (TC, «surcos borrados») ni la Tabla 39.2 West Haven frente a `westHaven()` (cortes 60/40/15/5 % de hepatocitos, invención del modelo, no de la ficha: debería rotularse «ilustrativo» en pantalla); no ejecuté la app.
