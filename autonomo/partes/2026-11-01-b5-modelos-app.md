# 2026-11-01 · b5 · paso 3: hepatocito vivo y termostato vivo en la app (modelo + prueba)

**Resultado:** los dos modelos elegidos están en la app (rama `auto/b5`, PR #78 en borrador, versión 20261101-94):
Libros → Marino → «Hígado, abdomen y temperatura», y 6 botones en las fichas de Marino Abdomen cada uno. Profesor
**hepatocito 9,3 → 9,4 → (retoque del rejuicio hecho)** · **termostato 9,2 → 9,5**; auditor 0 graves tras arreglos;
pruebas propias con barrido de extremos (70 y 64 combinaciones) y solapes de `<text>` a 0, en verde a 390 y 360.

## Qué se hizo
- Huecos de registro por modelo en los archivos compartidos; revisión del encargo (Explore: 4 graves de preparación
  —huecos mal puestos en `jueces-forma`, especies en `formas-iones.js`, mapa de versiones, nombres— corregidos antes de gastar).
- Listas R2 (profesor, 39 y 35 casillas) tachadas enteras. Dos constructores sonnet en paralelo (worktrees `wt/b5-*`).
- Auditor: termostato 1 grave (ibuprofeno «no indicado», no está en la p. 72) + 5 medianos; hepatocito 0 graves + 3 medianos.
  Todo corregido en una vuelta por modelo, junto con los arreglos del profesor (dock del termostato de 318 a 248 px,
  fallos que mueven el modelo, apuesta del hepatocito sin pista, FC coherente y «FV» sin número).
- Retoques del rejuicio hechos por el director (caso del hepatocito: veredicto en la frase viva y scroll al paso;
  rótulo TRR; aviso del ibuprofeno) y avisos de la sesión del plan de Estudiar: `hepatocitoVivo` y `termostatoVivo`
  en `MODELOS` de `js/core/mayeutica.js`; cita `ma-calor-snc` → `ma-calor-golpe`.

## Para el usuario
Nada que decidir (no es parada). Para mirarlo: Libros → Marino → tarjetas «Hepatocito vivo» y «El cuerpo que arde y tirita».

## Mayéutica de los modelos (misma sesión, por encargo de la bitácora)
Hepatocito: 13 preguntas y 2 casos (Casimira, Hilario); termostato: 13 preguntas y 2 casos (Jacinta, Honorato). Auditor:
hepatocito 1 grave (CVVH «depende de mantenerla»; la p. 8 dice empezar cuanto antes) + 5 medianos; termostato 0 graves + 5
medianos. Todo corregido; las tres pruebas en verde sobre la rama juntada (versión 20261101-95). `jueces --modelo
hepatocito-vivo --modelo termostato-vivo --forma`: ✅ todos a favor en la versión -94 (antes de la Mayéutica); **falta
pasarlos otra vez con la Mayéutica** y el juicio del profesor de la Mayéutica: los hace quien junte 5A-5D.

## Siguiente
Juntar el Estudiar 5A-5D (ramas `auto/b5-5a…5d`) en `auto/b5`, jueces enteros, profesor de la Mayéutica, PR #78 y Consejo.

## Propuestas sobre las reglas
- **Huecos contiguos chocan siempre al fusionar** (los 6 archivos de registro dieron conflicto): un hueco por modelo
  separado por una línea de código real, o que un solo constructor registre los dos.
- **`jueces --modelo` admite varias claves en una pasada** (`--modelo a --modelo b`): pasarlas juntas ahorra una
  vuelta entera de `jueces-movil` (≈25-40 min).

## Vueltas
| Pieza | Vuelta | Nota tras la vuelta | Constructor | Pasos | M | Qué falló |
|---|---|---|---|---|---|---|
| Hepatocito | 1 | 9,3 | sonnet | 73 | 2,8 | sello del monitor; apuesta con pista; botones TIPS/fluidos |
| Termostato | 1 | 9,2 | sonnet | 95 | 1,8 | ibuprofeno (grave); dock 37,7 %; FC con FV |
| Hepatocito | 2 | 9,4 | sonnet | 33 | 0,45 | caso: veredicto fuera de pantalla |
| Termostato | 2 | 9,5 | sonnet | 34 | 0,54 | — |
| Hepatocito | 3 (director) | — | — | — | — | — |

## Gasto
`gasto.mjs --clave b5` (esta sesión): **8,3 M**. Por papel: constructor sonnet ×4 5,6 M (68 %) · profesor ×3 1,1 M ·
director 1,1 M · auditor ×2 0,26 · Explore 0,24. Los que más: constructor hepatocito 2,8 M (1,2 M de caché escrita:
pasó dos veces la suite de `jueces-movil` de 40 min dentro de su conversación; que el constructor pase solo su prueba
y los jueces los pase el director, como en la vuelta 2), constructor termostato 1,8 M, director 1,1 M.

## Cuentas
**Con la Mayéutica**: `gasto.mjs --clave b5` = **12,1 M** frente a 12,0 M del presupuesto entero del paso 3 (+1 %; sin juicio
del profesor de la Mayéutica todavía, ≈0,4 M). Director 2,1 M (una sola sesión, ≈200 pasos: pasó del tope de 150 de §4.16
por encadenar la Mayéutica). Lo de abajo es el corte antes de la Mayéutica.

Presupuesto del paso 3 sin Mayéutica: 12,0 − 3,2 (Mayéutica y su juicio) − 1,1 (2.ª sesión del director) = 7,7 M.
Gastado ≈8,4 M con el cierre. Desvío **+9 %** (el constructor del hepatocito, por los jueces dentro). Bloque b5:
≈11 + 8,4 = ≈19,4 M de 45-63; quedan ≈26-44 M para la Mayéutica (≈3,2 M) y el Estudiar.
