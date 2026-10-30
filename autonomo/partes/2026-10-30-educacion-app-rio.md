# Parte · 30/10/2026 · `educacion-app` parte 2: río y mar (C con el error de B dentro del caso)

**Tarea**: `educacion-app` (Objetivo, fila 18), parte 2 · **Estado**: hecha, en `main` (versión 20261030-11).
La tarea sigue `en curso`: capilar, fichas (`mayeutica.js`) y A en el shock esperan a la fusión del `b3`.

## Qué se hizo
- Comprobado antes: ninguna otra sesión trabajaba en `agua-viva*`. Revisión del encargo: la hizo el director sin agente
  (copia de una maqueta auditada dos veces; recorte de Hacienda).
- **Caso 4 · Teresa** (`js/data/agua-viva-caso-teresa.js`, Libros → Marino → Fundamentos → Río y mar → Mayéutica → casos):
  hemorragia digestiva clase II, 6 pasos, 3 objetivos y «Lo que te llevas». **P3, el error de B**: «Decide tú, sin pistas»
  entre 1,3 L de salino a chorro, 1,3 L de Ringer y 2 concentrados; el salino lleva el estuario a ese estado y sale «⚠ Lo que
  acaba de pasar» (río ≈+360, intersticio ≈+1.070, cloro → acidosis hiperclorémica) antes de la enseñanza; P4-P6 siguen sobre
  lo que eligió (`tras`). Cifras del caso del monitor de la app (Hto 40 % con salino, 41 % con Ringer); se quitaron las de la
  maqueta que el monitor no da (Cl 116, pH 7,31).
- **Repaso de días atrás** al abrir la Mayéutica del río y mar (`js/modules/libros/agua-viva.js`, con `pintarDiasAtras` del
  motor): hasta 5 preguntas de 6 fichas parecidas (cristaloides, coloides, retorno venoso, respuesta a fluidos, clasificación y
  fluidos del hemorrágico), leídas del guardado de las fichas; una vez por sesión; sin nada que toque, entra directo.
- **Pareja gemela** de la prueba de 3 días: `mar-cristaloides` (con C) frente a `mar-coloides` (Estudiar actual), mismo cap. 10,
  13 preguntas + 1 caso cada una; cristaloides tiene un 34 % más de texto (dicho en el archivo). Protocolo y 12 preguntas de
  transferencia en `autonomo/ideas/educacion-pionera/prueba-3-dias.md`; respuestas aparte en `prueba-3-dias-respuestas.md`.
- Prueba ampliada `autonomo/pruebas/agua-viva.mjs`: Teresa bien y con salino (consecuencia antes que explicación), días atrás
  con fechas sembradas (orden, chips, «1 de N», `ultimo` = hoy, `resultado` sin pisar) y registro vacío.

## Jueces
✅ general (390 y 360) · ✅ `--modelo agua-viva` · ✅ `mayeutica-memoria` · auditor sonnet: caso 0 graves (2 medianos y 5
menores, arreglados: la clase III la marca el shock, no la PA sola, S p. 29; la buena de P3 ya no se adivina por la cifra);
12 preguntas 0 graves (forma de la buena igualada en 8; menores arreglados). Sin profesor (recorte; la maqueta C sacó 8,25).
`--forma` no terminó en el tiempo del constructor (todos los renglones vistos pasaban).

## Huecos
- El motor no deja quitar «Piénsalo antes de ver las opciones» en un test: P3 («sin pistas») lo lleva. No da pistas, pero es una
  compuerta (rúbrica N3). **Falta del motor**: un campo `sinPensar` por pregunta. No se tocó el motor.
- En P3, la caja «Qué le habría pasado» (el porqué) sale encima de «⚠ Lo que acaba de pasar»: orden del motor.
- Falta el «predice y compruébalo» de cuánto queda en el río (P3 de la maqueta): no cabía sin alargar.
- Las preguntas de días atrás no llevan «Compruébalo en el modelo» (el río y mar no pinta el `modelo` de las fichas).
- Los 2 concentrados no mueven el estuario; `tras` cubre solo la rama del salino.
- Visto de paso: un `resultado` «mal» viejo de una ficha se queda aunque se acierte en días atrás (lo pide el diseño).

## Vueltas
| Pieza | Vueltas | Por qué |
|---|---|---|
| E1 caso + días atrás | 2 | auditoría: clase III y cifra que delataba la buena |
| E2 pareja gemela | 2 | auditoría: la buena se adivinaba por la forma |

## Gasto
Total **2,8 M** (`gasto.mjs`). Por papel: constructor sonnet 2,3 M (83 %, 72 pasos) · director 0,3 M · auditor sonnet 0,16 M.
Dónde se fue: el mismo constructor se continuó para E2 y dos vueltas de arreglos; pasados los 56 pasos cada paso releía
≈200 k de conversación. Ahorro: continuar solo por debajo de 60 pasos (R5); las vueltas, a un constructor sonnet nuevo.

## Cuentas
Presupuesto 2,0 M (ya recortado −0,9 M por Hacienda: sin revisión del encargo con agente, sin profesor, E2 continuando) ·
gastado 2,8 M · desvío **+40 %**. No comparecí a tiempo: no medí el gasto entre vueltas. Del margen de Educación.

## Para el usuario
- Probar el caso de Teresa (Libros → Marino → Fundamentos → Río y mar → Mayéutica → Ir a los casos → Caso 4).
- Prueba de 3 días, cuando quieras: `autonomo/ideas/educacion-pionera/prueba-3-dias.md`.

## Propuestas sobre las reglas
- La propuesta del parte 1 («continuar al mismo constructor ahorra») vale solo por debajo de 60 pasos: aquí lo encareció.
  Propuesta: el director mide `gasto.mjs` antes de cada vuelta de arreglos si la tarea va por encima del 70 % del presupuesto.
- Motor: campo `sinPensar` en una pregunta de test para el «decide sin guía» del error productivo (para la parte 3).
