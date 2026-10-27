# Auditoría ciega b3: pantalla del respirador y consola del balón
Graves 0 · Menores 4 · Bien: el resto.
Fuentes: Marino cap. 27 (PDF caps27-30, PDF p. = página del libro) y cap. 16 (PDF shock p. 45-47).

## Respirador
- BIEN «Ppico = resistencia + elasticidad» (p. 2-3, Ec. 27.1); «EIP = meseta, sin pausa vacía» (p. 3, Ec. 27.2); «meseta ≤30» (p. 4); «I:E ≥1:2», «flujo 60, ≥80 si distrés», «FR sin pasar de 35» (p. 14); PC-AC: se fija la presión y el flujo decelera (p. 2 y 4).
- BIEN origen rotulado: límites en topes.js con su origen; FiO₂/hora/batería/teclas = ilustrativo; Ti = VT ÷ flujo, Pmáx corta y «FR real se alarga» = modelo. «FR sin límite: la ficha no da uno» es cierto (solo da el máximo de ajuste 35, ya usado como tope del mando).
- BIEN nota mbar: «1 mbar ≈ 1 cmH₂O; Marino usa cmH₂O». Correcta (1 mbar = 1,02 cmH₂O).
- BIEN «Detener: el CO₂ sube y la saturación cae en minutos» rotulado fisiología general: aceptable y no contradice la fuente (es apnea sin ventilación). Matiz en menor 3.
- BIEN «VMe = VTe × FR», «ΔPsop para la respiración espontánea»: fisiología general, sin cifra.
- MENOR 1. Mando PEEP, nota «Ficha: 5-8 de inicio» (pantalla.js:55). Es cierto, pero está en la p. 15 (ajustes, «initial PEEP 5–8»); la Tabla 27.1 (p. 14) dice 5. Falta la página en la nota. Corrección: «Ficha (cap. 27 p. 15): PEEP inicial 5-8; Tabla 27.1 p. 14: 5».
- MENOR 2. Casilla VTe cita C.t271 (p. 14) para «normal 6-7 (ficha)» (pantalla.js:30 y :114). Esa cifra es de cap. 24 p. 46 («normal 6-7 mL/kg», tradicional 12-15). La p. 14 solo da 8 → 6 mL/kg. Corrección: en `que` y en la nota del mando, «normal 6-7: ficha, cap. 24 p. 46» y/o añadir esa cita (topes.js:12 ya la lleva bien).
- MENOR 3. Con «Detener» se habla de saturación, pero este modelo no tiene gases (FiO₂ ilustrativa). Está rotulado fisiología general; sugerencia: añadir «(no se calcula en el modelo)».
- MENOR 4. Lema «Lo que ves en la pantalla... aprende a leerlo»: es lema del plan, sin afirmación clínica; no requiere fuente.

## Balón
- BIEN (1) «El aumento diastólico sube el flujo coronario y la PAM; el vaciado antes de la sístole baja la poscarga» = p. 45: inflar en diástole sube pico diastólico, flujo coronario y PAM; desinflar al inicio de la sístole, antes de abrir la válvula aórtica (contracción isovolumétrica), baja poscarga. Cita p. 45 correcta.
- BIEN «35-40 mL», helio, punta bajo la subclavia izquierda, contraindicado en disección aórtica: p. 45. Joaquín: «contraindicado (p. 45)» correcto (también insuficiencia aórtica, no usada).
- BIEN (2) «cifras de aumento: del modelo, el libro no las da»: cierto, el texto no da ningún valor de aumento ni de telediastólica.
- BIEN (3) «temporización (inflar pronto o tarde) sin fuente»: cierto; el libro solo describe el momento correcto, no los errores de tiempo.
- BIEN (4) razón 1:2 / 1:3, latido asistido/no asistido: no están en p. 45-47; rotulado «modelo/ilustrativo». Correcto no atribuirlo a la ficha.
- BIEN (5) «100 % = el volumen»: ilustrativo, rotulado.
- BIEN pie con tres rótulos de origen (modelo / ilustrativo / ficha p. 45).
- Comprobación de cifra en contexto: «aumento 84 > sistólica propia 68» es del modelo y está rotulado como tal; fisiológicamente posible (el objetivo de la contrapulsación es que el pico diastólico supere la sistólica del latido no asistido). No se presenta como de la ficha.
- Nota para citas: C.iabpCompl dice p. 46-47; en el PDF las complicaciones empiezan en p. 46 y terminan en p. 47 (septicemia, fiebre 50 %, bacteriemia 15 %). Correcto.

## No comprobado / riesgo
- No abrí la app en el navegador ni medí maquetación; solo el texto de código frente a la fuente. No verifiqué cada nota de topes.js (límites VMe 2-20 y PEEP total ≤20, rotulados fisiología general: sin fuente en Marino, aceptables por el rótulo, pero no los cotejé con ninguna guía).
- La numeración PDF = libro la deduje por el contenido (Ec. 27.1 en PDF p. 3); la cita p. 45 del balón coincide con el PDF.
