# 2026-10-19 · marino-mapa, maquetas v2 (Plan Marino, fase 2)

**Resultado:** en revisión. Maquetas v2 publicadas en el mismo enlace:
https://claude.ai/artifact/XkbXSjmeJF7BeHhQ2wSC4L
**Jueces:** no aplica a la app (no se tocó). Las dos maquetas se probaron a 390 y 360 px: 0 errores de consola, sin
desbordar, toques ≥44 px, `__pruebas()` en verde.

## Qué pidió el usuario (17 y 19/10)
- Unir lo mejor de las maquetas A, B y C de ácido-base en una más potente; el río y el mar, «sublime»; el agua en
  crema y oro; y antes de seguir, completar las maquetas con la parte de estudio (preguntas, casos, conceptos).
- La parte de estudio se llama **Mayéutica** (Explorar | Conceptos | Mayéutica). Color del HCO₃⁻ indiferente si se
  distingue. Cada herramienta vive en su apartado, con un acceso rápido común (B-007, en la bitácora).

## Qué se hizo
- **Profesor, modo diseñar** (modelo potente): `plan-v2.md` (borrador fuera del repositorio) con la fusión A+B+C, el
  agua completa, 8 conceptos por maqueta, recorridos de 14 preguntas, 4 casos de ácido-base (CAD, vómitos y sonda,
  EPOC con respirador, metanol) y 3 de agua (hemorragia, sepsis con salino, hiponatremia posoperatoria).
- **Dos constructores** (modelo potente), uno por maqueta: `autonomo/maquetas/marino-acidobase-v2.html` y
  `autonomo/maquetas/marino-agua-v2.html`.
- **Auditor ciego** en cada una:
  - agua: 2 graves (desmopresina con la salvedad de la Tabla 35.4; intervalo de los bolos al 3 %), 7 huecos,
    19 menores;
  - ácido-base: 3 graves (0,4 unidades de pH en la Fig. 31.1; las dos cifras de la albúmina sin nota; la bajada del
    HCO₃⁻ en la EPOC dada por cierta), 18 menores, 6 huecos.
  - Todos corregidos. Los conflictos de fuentes van con nota, sin elegir.
- **Profesor, modo juzgar**: Móvil 3, Dificultad 3 y Datos 3 (ácido-base). Corregido en la vuelta 2:
  - primero se predice y luego se comprueba en el modelo (las cifras que chivaban salen «?»);
  - la correcta ya no es la más larga (4/25 en ácido-base; 2/20 en agua);
  - célula del colector legible; neurona a plumilla;
  - velocidad del agua: de 45-52 ms a ~17 ms por fotograma con la CPU ×4.
- Formas, solo en las maquetas: hexágono = urea, rombo = Cl⁻ y sal, cristal = glucosa, estrella hueca = aniones
  no medidos. La unificación en toda la app es la tarea `formas-iones` (aprobada el 19/10).

## Quedan (no rellenados, van aquí)
- Ácido-base: Tabla 31.3 completa; gasometría venosa y los 4 mixtos de Nefrología al día; HCl (Ec. 33.4); CAD
  euglucémica, nitroprusiato y cetoacidosis alcohólica; pK y Tabla 32.2. Objetivo de PaCO₂ en la EPOC ventilada
  (Marino no lo da).
- Agua: salino hipertónico en el TCE; glucosado e hiperglucemia (Fig. 10.4); Tabla 10.3 completa y la duración de
  la albúmina; reparto en mL del 3 % y de Ringer en el mar (sin cifra en la ficha).
- Ácido-base: al cambiar de paciente queda 1 fotograma de 67-100 ms con la CPU ×4 (al abrir la vista del riñón).
- En la app habrá que quitar los `data-correcta`/`data-mal` que las maquetas llevan para las pruebas.

## Para el usuario (decidir)
1. Qué cambiar de la versión 2.
2. Cuándo pasan a la app (cada una en su apartado; el ácido-base en Nefrología, junto a la nefrona viva).

## Propuestas de regla
- Las preguntas «tocando» se responden primero y se comprueban después en el modelo; el modelo no enseña la cifra
  que da la respuesta antes de contestar (salió en las dos maquetas).
