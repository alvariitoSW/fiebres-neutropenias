# Registro de /ahorro

Lo lleva la skill `/ahorro` (`.claude/skills/ahorro/SKILL.md`). No se edita a mano.

**Último parte revisado:** `2026-10-31-shock-scai.md` (pasada del 31/10: ≈8,7 M frente a 3,9 M, +123 %; sin propuesta nueva: lo que se repite ya está aprobado o propuesto, abajo)

## Patrones sueltos (vistos una vez; esperan una segunda)
- (shock-scai, 31/10) Los menores de una auditoría en una vuelta aparte del constructor (1,7 M por 7 menores de texto, por
  repetir la prueba larga). Si se repite: los menores de la auditoría, dentro del encargo de la vuelta del profesor.
- (shock-scai, 31/10) Esperas del director con `pgrep -f`/`pkill -f`, que se encuentran a sí mismas (una espera que no acabó,
  una suite que se mató sola). Si se repite: esperar por PID guardado (`$!` o `kill -0 <pid>`).
- (shock-scai, 31/10) Confirma dos reglas que ya existen, sin propuesta nueva. Los constructores relanzaron la prueba larga
  varias veces por vuelta, aunque la regla aprobada «Suite corta para iterar, la entera al entregar» lo prohíbe: es que no se
  cumplió, no que falte regla. Y el director gastó 2,2 M sobre 0,9 M, esperando suites tras fusionar `main` dos veces: refuerza
  «director en dos sesiones por parada con jueces largos» (b3d) y «Director del paso 4 a 1,3 M».
- Continuar al mismo constructor para la pieza 2 y las vueltas: ahorró en `educacion-app` parte 1 (<60 pasos) y encareció en la parte 2 (72 pasos, 2,3 M frente a 1,45 M; cada paso releía ≈200 k). Si se repite: continuar solo por debajo de 60 pasos (ya lo dice R5); vueltas, a un sonnet nuevo.
- Director por encima de 1 M en cada grupo del paso 4 (g3a 1,1 · g3b 1,3 · g4 1,9, con un reinicio del contenedor): si sigue, subir el presupuesto del director a 1,3 M o partir el grupo en dos sesiones (piezas / Estudiar).
- Un mando nuevo de un modelo con muchos pacientes da cifras imposibles en los que la ficha no usa (g4: CPAP en Mateo, PAM 15). Si se repite: el mando solo en los pacientes de la ficha.
- (Pasó a propuesta el 27/10, segunda vez en b3 plan del paso 4) El estimado no cuenta las piezas que faltan.
- Revisor del encargo por encima de su presupuesto (b3 plan del paso 4: 10 pasos / 173 k frente a 0,15 M) por releer
  archivos de datos. Si se repite: darle las claves ya sacadas.
- Un lector de fuente o investigador gasta sin poder abrir lo que necesita (rea-eco: dominio bloqueado; eco-vci:
  escaneo girado). Si se repite: comprobar el acceso o la página exacta antes de lanzar.
- (Pasó a propuesta el 28/10, segunda vez en eco-calibra-a s2) Un constructor tapa una cifra mala del motor con un parámetro de dibujo (F3: venas a 2,5 cm²) y otra pieza lo
  destapa luego (F3b, 1,5 M).

- Un constructor que lleva una maqueta a la app pasa de su presupuesto (b3 parada 2: shock 116 pasos frente a 90;
  ritmo y receptor con vuelta de arreglos dentro de la vuelta 1). Si se repite: partir antes por fenómeno del motor.
- Lo que sí se repite y ya está en las reglas: un `arreglo` de una línea o solo de reglas lo hace el director sin
  agente (≈0,3-0,4 M en 4 partes); `REGLAS.md` §4.9 lo recoge para la revisión del encargo. Sin propuesta nueva.

- Fichas que los constructores dan por «verdes» con `--ficha` y que la prueba de forma `mayeutica-fichas` tumba
  (b3-paso4 g1: dos fichas sin caso → una vuelta entera, ≈1,8 M). Si se repite: `--ficha` corre la forma de esa ficha.
- (Pasó a propuesta el 28/10, segunda vez en eco-calibra-a s2) Constructor que pasa de presupuesto por relanzar jueces largos (b3-paso4 g1 vuelta 3: dos copias, 25 min por ficha,
  0,71 M frente a 0,4 M). Si se repite: el constructor pasa solo `--ficha` de lo que tocó y el director la suite.
- Confirmado (sin propuesta nueva, ya está «Contar las piezas en el código»): en b3-paso4 g1 el plan daba 3 piezas y
  solo faltaba una pequeña; la revisión del encargo (0,14 M) lo vio y ahorró ≈1,5 M.

- Revisor del encargo otra vez por encima (b3-paso4 g2: 13 pasos / 0,24 M frente a 0,15 M), pero cazó 4 graves: compensa.
  Si se repite una tercera: subir su presupuesto a 0,25 M en vez de recortarlo.
- El director no comparece al pasar del 25 % cuando el desvío sale al medir al final (b3-paso4 g2). Si se repite: medir
  `gasto.mjs` a mitad de tarea (tras las piezas).

- (29/10, b3-paso4 g3a) Encargos que juntan varias piezas: «estados» con 3 estados (73 pasos, 2,9 M frente a 1,0) y
  «arreglos» con 6 arreglos (76 pasos, 1,5 M frente a 0,6). Si se repite en otro parte: un encargo por estado y tandas
  de ≤3 arreglos. Confirmado: medir `gasto.mjs` a mitad de tarea funcionó (se compareció a 8,2 M, antes del Estudiar).

- (31/10, educacion-app parte 3) Suelto: el director perdió una hora de jueces por un filtro de texto que no recogía la línea
  «✅ Todos los jueces a favor» (hubo que repetir general + 3 modelos). Si se repite: guardar la salida entera de cada pasada y
  mirar el código de salida, no el texto. Último parte revisado: `2026-10-30-educacion-app-3.md`.

## Propuestas hechas
| Fecha | Propuesta | Estado |
|---|---|---|
| 2026-10-27 | La suite entera, una vez por fusión | aprobada (28/10, REGLAS §4.6-4.11) |
| 2026-10-27 | Cada constructor en su propia carpeta | aprobada (28/10, REGLAS §4.6-4.11) |
| 2026-10-27 | Partir por estructura antes de lanzar | aprobada (28/10, REGLAS §4.6-4.11) |
| 2026-10-27 | Contar las piezas en el código, no en la cobertura | aprobada (28/10, REGLAS §4.6-4.11) |
| 2026-10-27 | Comprobar el acceso antes de lanzar al que busca | aprobada (28/10, REGLAS §4.6-4.11) |
| 2026-10-27 | Petición nueva a mitad de tarea, a otra sesión | aprobada (28/10, REGLAS §4.6-4.11) |
| 2026-10-28 | Calibrar el motor con una rejilla, no a mano | aprobada (28/10, REGLAS §4.6-4.11) |
| 2026-10-28 | Suite corta para iterar, la entera al entregar | aprobada (28/10, REGLAS §4.6-4.11) |
| 2026-10-28 | Una cifra mala no se tapa con otro parámetro | aprobada (28/10, REGLAS §4.6-4.11) |
| 2026-10-28 | Una pieza se presupuesta por lo que falta en el código | propuesta |
| 2026-10-30 | Medir el gasto tras las piezas, antes del Estudiar | propuesta |
| 2026-10-30 | Hacienda no junta piezas con prueba propia en un encargo | propuesta |
| 2026-10-30 | Director del paso 4 a 1,3 M | propuesta |
| 2026-10-31 | Continuar al mismo constructor solo si el primero acabó en ≤30 pasos | propuesta |
