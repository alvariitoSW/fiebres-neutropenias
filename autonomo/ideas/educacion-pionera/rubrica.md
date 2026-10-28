# Rúbrica de Educación pionera (propuesta, fase 2 · 28/10/2026)

Se puntúa del 0 al 10 cada criterio; pasa con 8 en todos, meta 8,75 (REGLAS §7). Fuerza de la evidencia (de `evidencia.md`):
**alta** = ECA o metaanálisis en residentes/estudiantes de medicina con pasaje verificado; **moderada** = laboratorio o metaanálisis fuera de
medicina; **contradictoria en medicina** = estudios médicos con resultados opuestos. Nada de lo que sigue se ha probado en residentes de UCI.

## 1. Lo de siempre (REGLAS §7 y §8), sin cambios
§7.1 primera vista · §7.2 sin párrafos largos · §7.3 resaltado · §7.4 el mecanismo se ve en un modelo · §7.5 mandos con frase viva · §7.7 móvil
390 px · §7.8 modelo grande · §7.9 cada cita con «Ver en la ficha» · §7.10 explicación guiada de cada estado · §1.14 topes con consecuencia.
§8: recorrido en orden, solo los tres formatos, dificultad (no se acierta sin estudiar), caso que evoluciona con datos que interpretar, giro,
«Lo que te llevas», paciente posible (§1.12), fidelidad (cada cifra con página). Base: recuperación con feedback, **alta** (Larsen 2009, d=0,91
en residentes; Roediger y Karpicke 2006).

## 2. Criterios nuevos
| Criterio | 10 | 8 | 5 | Cómo se mide en la maqueta | Evidencia |
|---|---|---|---|---|---|
| **N1 · Predecir antes de ver** | Toda cifra o estado que el modelo va a enseñar se apuesta antes (opciones cerradas), el velo no deja ver nada, y la observación compara apuesta y resultado en una tabla antes → después | Casi todas las preguntas con modelo se apuestan antes; alguna cifra se ve antes de tiempo o la comparación no es explícita | La predicción existe pero el monitor ya enseña la respuesta, o se predice con texto libre | Programa de prueba: en cada pregunta con modelo, el DOM del monitor está tapado hasta cerrar la apuesta; ninguna opción se adivina por forma (jueces: longitud y posición); capturas de la apuesta y de la observación | Pretest: Kornell 2009, Richland 2009 (**moderada**, universitarios); Willis 2020 (ECA, estudiantes de medicina, sutura: **alta pero fuera del razonamiento clínico**); POE White y Gunstone 1992 (**baja**, sin página; sin estudios en médicos) |
| **N2 · Explicar el porqué, con opciones** | Tras cada observación hay una pregunta de mecanismo con 3 opciones cuyos distractores son errores reales (sentido al revés, causa por consecuencia) y cada uno dice qué le pasaría al paciente; al menos un «piensa y destapa» marcado punto a punto | Hay explicación con opciones tras la mayoría de observaciones; algún distractor es flojo o no cuenta la consecuencia | La explicación la da la app sin preguntar, o se pide con texto libre | Contar: observaciones con pregunta de porqué / observaciones totales (≥ 0,8 para el 8; 1,0 para el 10); leer los distractores con la prueba de Oppia («leyendo el error se predice la respuesta equivocada», `webs.md`) | Chi 1994 (**moderada**, 24 alumnos, circulación); Bisra 2018 g=0,55 (**moderada**, leído en terceros); en medicina **contradictoria**: Chamberland 2019 a favor en casos cercanos, Peixoto 2017 y Klein 2019 sin beneficio (los prompts añadidos subieron la carga) |
| **N3 · Error con consecuencia y después enseñanza** | El fallo se ve en el paciente (constantes, sello, frase viva) antes de cualquier explicación; la instrucción llega justo después y enlaza a la ficha; sin ayudas durante el intento | La consecuencia se ve, pero la explicación llega a la vez o incompleta; o hay pistas durante el intento | El fallo solo devuelve «incorrecto» y la respuesta buena; o la consecuencia no se ve | Programa de prueba: fallar a propósito cada apuesta y comprobar el orden en el DOM (consecuencia → explicación → «Ver en la ficha»); que no haya pistas visibles antes de elegir; captura del fallo | Sinha y Kapur 2021 g=0,36-0,58 (**moderada**, 53 estudios fuera de medicina; exige instrucción después); Willis 2020 (**alta**, 42 estudiantes); Klein 2019 (**contradictoria**: ayudas de más estorban) |

Umbral práctico: N1-N3 se aplican a toda maqueta y a todo modelo vivo nuevo; en fichas sin modelo, N1 se puntúa sobre lo que el texto o la
Vista Visual enseñan («predice antes de destapar»).

## 3. Cómo puntúa el repaso espaciado (maqueta C y, después, toda la Mayéutica)
- Qué cuenta: al abrir una ficha, 2-5 preguntas de fichas ya vistas, mezcladas (nunca el orden del texto ni dos de la misma ficha seguidas) y
  ordenadas por la **fecha del último intento** y el resultado (primero lo fallado hace ≥1 día; lo acertado, cuando han pasado ≥N días y N crece
  con los aciertos). 10: todo lo anterior y la app dice «vuelve en X días y por qué»; 8: repaso mezclado por fecha sin explicar la regla; 5: repaso
  sin fecha (siempre lo mismo) o solo de la ficha abierta. Se mide con el programa de prueba simulando fechas en el registro que ya existe.
- Evidencia: repaso espaciado **alta** en residentes (Kerfoot 2010, +15,2 % frente a +3,4 %, 724 residentes; Kerfoot 2007; Cepeda 2006), pero
  Kerfoot espaciaba por calendario fijo y nadie probó «solo la fecha del último intento»: la regla es nuestra. Entrelazado: **contradictoria en
  medicina** (Hatala 2003 a favor, Monteiro 2017 en contra; Brunmair 2019 g=0,42 fuera): solo entre conceptos parecidos, y se mide con el usuario.

## 4. La prueba de 3 días con el usuario (decide él, no la rúbrica)
Dos fichas gemelas del mismo bloque (mismo tamaño, misma dificultad; una con la maqueta elegida, otra con la Mayéutica actual), estudiadas el
mismo día. A los 3 días, **6 preguntas de transferencia por ficha** (otro paciente, otras cifras, mismo mecanismo; gemelas de `webs.md` idea 4),
hechas sin abrir la ficha. Se anota aciertos de 6 y el tiempo de estudio. Lectura: 2 o más aciertos de diferencia a favor de la maqueta = sigue;
igual = no hay base para prometer ganancia (evidencia: Peixoto, Klein, Monteiro) y se elige por gusto del usuario; en contra = se para. No se
guarda nada en la app: se apunta en el parte. Lo más sólido de todo el encargo es la **recuperación con feedback** y el **repaso espaciado**
(Larsen 2009; Kerfoot 2010): si una maqueta las rompe para añadir POE o error productivo, baja de 8 en §8.
