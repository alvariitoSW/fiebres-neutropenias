# Receptor vivo v3 — informe (rama auto/b3-receptor, maqueta autonomo/maquetas/b3-receptor.html)
✅1 Mayéutica: interruptor y pregunta arriba; monitor y figuras escondidos mientras se predice (no velados). ✅2 NA: IRVS 11,8→17,2, PAM 51→72 (cruza 65 hacia 17 µg/min), IC +0,6 a 10 µg/min; IRVS 18-20 con PAM 65-70 no cuadra con IC 4,0 (PAM=PVC+IC·IRVS): se dejó lo coherente.
✅3 pastillas .org sin partir (390/360); «Para decidir» fuera (v1). ✅4 adrenalina titulable (5 µg/min PAM 67; 10 → 75), lactato con constante de tiempo (~3 s, ilustrativo). ✅5 dopamina 10→20: IC 4,9→4,3; dobutamina baja IRVS 26→22,9.
✅6 recorrido de 10 preguntas: G1 NA, G2 dopamina, G3 fenilefrina, G4 vasopresina (piensa y destapa), G5 dobutamina, G6 milrinona, G7 extravasación, E1 adrenalina, E2 fenilefrina/TSVI, E3 encuentra el error (1 error); correcta larga 3/11, posiciones máx. 4/11; todas las falsas con «qué le pasa».
✅7 fichas de fármaco plegadas (página 3190→2716 px); epitelio con cilios en el bronquio (el cartílago ya estaba). Quitado el .tapa. ↷ «Cómo crecerá» ya era plegable.
Pruebas (Playwright, 390 y 360): 14 estados × sliders 0/medio/máx, guías completas, lupas, paso a paso, recorrido + repaso + caso entero: 0 desborde, 0 errores de consola, 0 «paciente imposible». Barrido de PAM/FC/IC en rangos: todo posible. Amparo h10 (NA26+vaso): IRVS 20, PAM 79, IC 3,7 (algo alto, ilustrativo).
## Frases nuevas (mecanismo/conducta) para el auditor
- Dopamina 10→20: «el α sube la poscarga y deshace parte de lo ganado» (ficha p. 14: «la poscarga puede deshacer la subida del volumen latido»).
- Falsa G2: receptores de dopamina solo hasta 3 µg/kg/min (p. 14).
- Vasopresina: dosis fija 0,03-0,04 (libro «U/h», nota); V₁, ahorra catecolamina, sin beneficio de supervivencia; no sube PA en sanos, sí en vasodilatado (p. 15-16).
- Dobutamina: volumen latido compensa la vasodilatación (p. 43); FC +5-15 (p. 43). Milrinona: vasodilata, hipotensión, menos taquicardia, mejor en IC sin hipotensión (p. 44).
- Extravasación: parar, aspirar sin lavar, retirar, fentolamina 5-10 mg en 10 mL en la zona, <12 h (p. 12). Falsa «fentolamina IV: bloqueo α sistémico en séptica hipotensa»: fisiología general.
- E3: NA techo 30 µg/min, segundo vasopresor (p. 13). Aviso «El monitor y el dibujo salen cuando contestes» (interfaz).
## De comun/ (no tocado)
Dock fijo 150-220 px en estudio; la regla .org nowrap está local en la maqueta, debería ir a dibujo-iso.js.
## No comprobado / riesgo
No pasé jueces.mjs (no cubre maquetas). Las cifras de la milrinona (FC sube 4 lpm en el modelo) contradicen «menos taquicardia» que la dobutamina (sube 7); revisar. Vistos 3 capturas, no el final del caso. Cambiar kR/post de Amparo afecta a la vasopresina en na-vasopresina (PAM 74-80 a 20-40).
