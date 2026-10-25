# 2026-10-25 · formula-comun (B-018)

**Resultado:** hecha, en `main` (Objetivo V: mejoras de lo existente, directo con los jueces en verde; sin PR)
**Vueltas:** 2 (+ retoque del director) · **Jueces:** general ✓ · `--eco` y pruebas del eco (247) ✓ · `--modelo capilar-vivo` y `agua-viva` ✓ · auditoría ✓ (0 graves) · profesor ✓ tras la vuelta 2

## Encargo
La ficha del tablero estaba completa; el director añadió la API (solo dibuja, sin recalcular), los archivos de cada uso
y el «hecho». Copia: `/tmp/plan-socialista/formula-comun/encargo.md` (resumida en `docs/historial/libros.md`).

## Qué se hizo
- Pieza común `js/core/formula.js`: renglón «fórmula → tus números → resultado» con su origen enlazado a la ficha.
- Usos: capilar (CaO₂, DO₂), río y mar (Posm y Posm efectiva), glomérulo (presión neta de filtración), filtro de la TRR
  (dosis de efluente) y Doppler del eco (GC por ITV, con la cifra real del simulador al lado).
- Vuelta 2 (profesor 3 en dos puntos y 6 menores del auditor): en el eco, «÷ 1000» en la fórmula, área con su
  diámetro y «GC real del simulador · el Doppler lo estima»; millar en el filtro; mismos decimales que los medidores;
  orígenes honestos (la forma de la fórmula es fisiología general cuando la ficha solo da las cifras).
- Prueba del capilar: el juez de rendimiento fallaba a ratos también en `main` (1 de 3) porque la escena quedaba
  fuera de la vista y su bucle se pausa («n=0»); ahora la prueba la pone a la vista antes de medir (3 de 3 en verde).

## Qué no se pudo hacer o leer
- El auditor cotejó contra las fichas HTML, no contra los PDF (las páginas ya estaban auditadas en su día).
- El renglón del capilar con CO o dilución y el glomérulo con presión negativa no se vieron en el navegador.

## Para el usuario
- Nada que decidir. Mirar en el móvil: Libros → Capilar y oxígeno (bajar la Hb y ver el renglón del CaO₂) y Eco →
  Doppler del TSVI (las dos cifras de GC).

## Visto de paso (no tocado)
- En capilar y río y mar el renglón queda bajo el tablero: con la hoja de mandos abierta hay que desplazarse un poco.

## Propuestas sobre las reglas
- Un modelo vivo que pausa su bucle fuera de la vista necesita que su prueba de rendimiento lo ponga a la vista antes
  de medir (si no, el juez da «n=0» cuando se añade algo encima o debajo).

## Gasto
Total 2,4 M equivalentes. Constructor · sonnet 2,0 M (80 %, 2 agentes); director 283 k (12 %); profesor · opus 111 k;
auditor · sonnet 88 k. Más caros: Constructor 2 (1,1 M, 52 herramientas, con la vuelta 2), Constructor 1 (841 k).
El constructor 2 llevó tres modelos y la vuelta; repartir eco aparte habría acortado su conversación.

## Rejuicio con la escala nueva (sobre 10, aprobada hoy)
Profesor tras la vuelta 2: todo ≥8 (pasa); 8,5 en «móvil a 360» y «eco 4,8 frente a 5,2». El director hizo los dos
arreglos baratos para la meta de 8,75: el chip de origen parte a todo el ancho (`.fml-ref` en línea) y, en el eco, la
cifra del simulador va en el mismo renglón («estimado por Doppler; el simulador: 5,2»), sin la línea suelta de arriba.
Sin rejuicio de esos dos (gasto); jueces en verde tras ellos.
- Opcional, fuera del encargo (profesor): en el filtro, el medidor de dosis dice «ilustrativo» y el renglón «dosis:
  ficha»; conviene igualarlos con la ficha `trr-dosis`.
