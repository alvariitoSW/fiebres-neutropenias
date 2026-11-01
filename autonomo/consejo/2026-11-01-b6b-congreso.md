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
