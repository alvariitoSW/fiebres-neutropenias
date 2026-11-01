# Informe · eje vivo, Mayéutica vuelta 2 y juez de las fichas (01/11/2026, versión 20261101-118)
Rama `wt/b6b-ejeB`. Puntos 2-6 de `profesor-eje.md`.

## Hecho
- **Juez** (`autonomo/pruebas/mayeutica-fichas.mjs`, commit aparte, ningún umbral tocado): carga todo `MAYEUTICA_*` de `js/data/mayeutica/b6b-*.js`, salta los módulos sin `guia`; `navDe`: `mu-` a marinoNutricion, `mt-` a marinoToxicos. Ya no cae con «d.guia is not iterable».
- **Mayéutica del eje** (`js/data/eje-vivo-mayeutica.js`): guía 2 → 7 (G3 Sinforoso FC con propranolol, G4 Policarpo cortisol con etomidato, G5 Policarpo prueba de ACTH, G6 Fulgencio «no se trata», G7 Lucrecia a 7 días, G8 Lucrecia con asma); examen 2 → 4 (E3 Policarpo, E4 Fulgencio, 2 errores cada una). Todas con página del PDF y «Ver en la ficha»; cifras de `leer()`/`acthVals()`/`lab()`.
- **Toribio día 3**: el enunciado sale de `leer()`: «PA 99/51 con noradrenalina 0,4 y lactato 1,6», igual que el 6H.
- **«Juega»** (`js/core/mayeutica.js`): «Caso de Toribio, paso 1» si el título del caso empieza por «Nombre, N años»; si no, el rótulo de hoy.
- **Eje** (`pagina.js`, `modelo.js`, un par de líneas en `css/components.css`): los avisos que no son el sello van plegados en una línea (título; al tocar, texto y cita). La T3 sigue a la T4 con levotiroxina (T3 .2 → .5 según la T4; cuánto, ilustrativo).

## Frases nuevas (mecanismo/conducta escrita por mí) y su página
- G3: «el propranolol frena el pulso, no la síntesis de T4; por eso van juntos» → p. 54 (Tabla 51.3) y p. 55 (Tabla 51.4). Los 128 → 93 lpm: modelo, ilustrativo.
- G4: «etomidato inhibe la síntesis; cortisol <10 µg/dL es la mejor señal de supresión» → p. 50 (`mu-sr-causas`, `mu-sr-acth`). El 8 µg/dL: ilustrativo.
- G5: «con el basal <10 la prueba suele sobrar» (la ficha: «popular pero a menudo innecesaria») y «aumento ≥9 no excluye la secundaria» → p. 50-51.
- G6: «eutiroideo enfermo: no se trata; tratarlo sería tratar una cifra» → p. 56-57. La parte «tratar una cifra» es redacción, no mecanismo.
- G7: «a 7 días T y FC bajan; en horas no» → sentido p. 53-55; los días y los grados, ilustrativos (sin página para los días).
- G8: «en la crisis todos los betabloqueantes contraindicados; metoprolol solo sin crisis» → p. 54.
- E3/E4: errores y frases buenas copiadas de p. 50, 51, 53, 54, 56, 57.
- **Sin cita**: la T3 que sube con la levotiroxina y el «no se trata» de Policarpo (hipertiroxinemia, p. 54 no da pauta: no he escrito ninguna pregunta que lo afirme).

## Fallos reales de datos del b6b que ahora ve el juez (no arreglados)
- `mt-cuerpo` (b6b-apendices.js): sin casos; la buena sale en posiciones poco variadas.
- `mu-tiamina` (b6b-cuanto.js): la buena es la más larga en 5 de 10 tests (≤ ⅓).
- `mu-vitaminas-oligo` (b6b-cuanto.js): la buena es la más larga en 3 de 7 tests (≤ ⅓).
