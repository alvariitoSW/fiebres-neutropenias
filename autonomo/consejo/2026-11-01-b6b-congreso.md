# Congreso · 01/11/2026 · «Juega» vacío en las fichas sin modelo vivo (b6b, PR #81)

Convocado por el director del cierre del `b6b` (Transportes, preside). **El usuario pidió que lo decidiera el Congreso,
debatiendo con modelos potentes (fable, esfuerzo alto), y que la decisión la tomase el Congreso.** Dos rondas: dictamen
y réplica. Asunto y ronda 1: `/tmp/plan-socialista/b6b-cierre/congreso-asunto.md` y `congreso-ronda1.md` (borrador).

**Asunto**: con el corte nuevo (9,5), el punto 7.8 «modelo grande» queda en 9,0-9,3 en 8 fichas del `b6b` cuyo paso
«Juega» dice «Esta ficha no enlaza ningún modelo vivo». La receta del profesor exigía tocar `js/core/mayeutica.js`
(pieza común de ~80 fichas). Hay 14-18 fichas así en la app (7 del `b3`, ya en `main`).

## Dictámenes (ronda 2, votos finales)
- **Educación**: listar calculadoras en Juega no es jugar (repite Mira y el Caso). Capa de datos ampliada donde un
  modelo sí enseña la ficha; excepción acotada en las demás; tarea técnica mínima (texto honesto + botón a Mira).
- **Justicia**: R10 permite «aceptar el punto con su nota y la mejora anotada»; la excepción, en el acta y fichas
  nombradas. «7.8 no aplicable» cambia la rúbrica: solo puede **proponerse** al usuario. Cada enlace de modelo, con página.
- **Interior**: retira los botones a calculadoras; excepción **fechada**; la tarea técnica entra hoy en el tablero.
- **Hacienda**: retira su enfoque de la ronda 1; tarea mínima, sonnet, tope 1-1,5 M; excepción hasta la tarea o el 22/11.
- **Transportes** (preside): con Justicia en el punto de la rúbrica (reservado al usuario, §4.12).

## Acuerdos (unanimidad)
1. **PR #81**: antes del Consejo, capa de datos ampliada (receta 6 del profesor + Educación): muralla 'enteral'
   (p. 45) en `mu-pauta-enteral`, `mu-npt-soluciones`, `mu-npt-pauta`; ácido-base 'lactica' (p. 14, 43-44) en
   `mu-sustratos` y en las preguntas de la receta. Solo donde la fuente lo sostiene.
2. **Excepción del 7.8**, acotada a `mu-gasto-energetico`, `mu-formulas`, `mu-complicaciones-enteral`, `mt-opioides`,
   `mt-co` (y las que sigan sin modelo tras los datos, nombradas en el acta del Consejo de la PR). **Caduca** cuando
   entre `juega-sin-modelo` en `main` (o el 22/11); entonces el profesor rejuzga solo el 7.8 de esas fichas (R8, ≈0,15 M).
   Los demás requisitos de §4.15 siguen enteros (jueces, auditor sin graves, resto de puntos ≥ 9,5).
3. **Tarea técnica `juega-sin-modelo`** (al tablero, aprobada por este Congreso por delegación del usuario): en
   `mayeutica.js`, si la ficha no tiene modelo, Juega dice «Esta ficha no tiene modelo vivo; lo que se juega aquí es
   <el simulador/la calculadora X>, en el paso 1 · Mira» con un botón a Mira y `data-resaltar` (cubre `enVisual`).
   Ninguna lista de calculadoras. Desde `main`, directo a `main`: maqueta de una pantalla, `--ficha` ×3,
   `mayeutica-fichas` entero, versión. Sonnet, **tope 1,5 M**; si se pasa o da 2 vueltas sin juez verde, se queda la excepción.
4. **El profesor** juzga el 7.8 como está escrito («un modelo dice lo que enseña la ficha»), nunca por «hay botón».

## Lo que espera al usuario (bitácora)
- Propuesta de cláusula en REGLAS §7.8: en una ficha de consulta o cálculo sin modelo que la enseñe, el 7.8 «no
  aplicable», con la frase de Juega y el modelo que falta apuntado.
- Idea para el departamento de ideas: un «metabolismo vivo» (gasto energético, sustratos, la bolsa de NPT), 2-3 maquetas.

**Gasto de la reunión**: ≈0,9 M (4 ministros fable, esfuerzo alto, 2 rondas).

---

# 2.º Congreso · 01/11/2026 · cinco piezas de la sesión 2 por debajo de 9,5 (R10)

**Asunto**: tras sus vueltas, el rejuicio final de la sesión 2 (`autonomo/bloques/b6b/rejuicio-final.md`) da eje vivo
**9,4** · Mayéutica del eje **8,6** · hepatocito **8,3** · 6H **8,75** · 6I **8,75**; auditor 0 graves. Ese rejuicio
se hizo con el corte viejo: hay recetas para la Mayéutica del eje y el hepatocito (nadie las aplicó), no para 9,5 en
6H, 6I ni el eje vivo. Vueltas reales (Justicia): eje vivo 1, Mayéutica del eje 2, hepatocito 3, 6H 3, 6I 3.

## Dictámenes (misma composición, fable con esfuerzo alto)
- **Hacienda**: el bloque va por ≈44 M de 45; recetas baratas (tope 1 M) y lo demás aceptado con fecha. Eje A,
  Mayéutica C, hepatocito C, 6H A, 6I A.
- **Interior**: lo mismo, y tarea aparte `b6b-95` para subir lo que quede. Eje A, Mayéutica C, hepatocito C, 6H A, 6I A.
- **Justicia**: R10 permite aceptar un punto con su nota, no fusionar con piezas < 9,0 (sería volver al 8,75 sin el
  usuario, §4.12/§5.7). Ninguna vuelta sin receta de 9,5 del profesor. Eje A, Mayéutica B, hepatocito B, 6H y 6I B
  condicionada (receta → vuelta sonnet → si 9,0-9,5, A; si < 9,0, D).
- **Educación**: Eje A (enseña bien; lo que falta es pulido). Mayéutica B (guía que se acierta por la forma no enseña).
  Hepatocito B (dos recetas son de coherencia del modelo). 6H y 6I B corta: primero rúbrica y receta del profesor.

## Acuerdos (Transportes preside y desempata 6H/6I con Justicia y Educación)
1. **Eje vivo**: se acepta con 9,4 y la mejora anotada (excepción fechada, como el 7.8). (4-0)
2. **Mayéutica del eje y hepatocito**: se aplican ya sus 8 recetas (dos constructores sonnet, encargos separados) y
   rejuicio R8 solo de esas piezas. Si quedan entre 9,0 y 9,5, excepción fechada; si < 9,0, al usuario. (4-0)
3. **6H y 6I**: el profesor escribe la rúbrica y la receta de 9,5; una vuelta sonnet ≤15 pasos por grupo; rejuicio R8.
   Entre 9,0 y 9,5, excepción fechada; < 9,0, al usuario. (desempate 3-2 con Transportes)
4. **Gasto**: ≈1,8 M sobre el techo del bloque (45 M), dentro del +25 % que puede subir el Consejo (§4.17.B); anotado
   en `SESIONES.md`. Tarea aparte `b6b-95` (Interior) solo si algo queda con excepción.
5. Corregir en el parte de la sesión 2 «3 vueltas por pieza» con las cifras reales.
