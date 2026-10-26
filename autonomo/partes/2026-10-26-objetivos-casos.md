# 2026-10-26 · objetivos-casos (B-020)

**Resultado:** hecha, en `main` (Objetivo V: mejora de lo existente, directo con los jueces en verde; sin PR)
**Vueltas:** 2 (+ retoque del director) · **Jueces:** `--modelo` de los 8 usuarios del motor (inmersión, telar, vaso, muralla, capilar, río y mar, catéter, mayeutica-fichas) ✓ · `--forma` ✓ · auditoría ✓ (0 graves en las 2 vueltas) · profesor ✓ (v1 8,0-8,6 → v2 inmersión 9,0 · telar 8,75 · vaso 8,8 · muralla 9,0)

## Encargo
La ficha del tablero estaba completa; el director decidió antes de construir los criterios (lección del potasio):
cuándo un objetivo está cumplido, cómo se ve la consecuencia y qué no se toca. Copia: `/tmp/plan-socialista/objetivos-casos/encargo.md`.

## Qué se hizo
- Motor común de casos: al cerrar un caso, «Revisión por objetivos» (✓ cumplido / ✗ falta, con lo que elegiste o lo
  que faltó y su porqué, «Ver en el texto»), sin nota. Una opción mala puede tener consecuencia: el modelo cambia de
  estado y sale «⚠ Lo que acaba de pasar»; el paso siguiente dice «El adjunto lo cambia a…».
- Inmersión (midazolam en perfusión), telar (seguir con heparina en la TIH), vaso (plaquetas en la PTT) y muralla
  (mantener el IBP hasta la extubación): un caso cada uno con objetivos y consecuencia; inmersión, también E8.
- Vuelta 2 (profesor y auditor): la caja ⚠ se queda a la vista; objetivos medidos por frase en los «encuentra el
  error» con dos errores; textos ajustados a la ficha («si el frotis confirma», «se cree que»); el telar ya no
  contradice las plaquetas de Rosa. Retoque del director: «plaquetas bajan» solo con sospecha de TIH (no en modo libre).

## Qué no se pudo hacer o leer
- El auditor cotejó con el texto de las fichas del repo, sin abrir los PDF de Marino ni Merino.
- No hay caso de CID en el vaso (no hay objetivo «tratar la causa») ni paso de enoxaparina con ClCr <15 en el telar.
- «Te faltó» (destapar) no se vio en pantalla; las pruebas comprueban «Elegiste» y «Fallaste en».

## Para el usuario
- Nada que decidir. Para verlo: Libros → La inmersión → Mayéutica → Casos → E4; en el paso 5 elige el midazolam.

## Visto de paso (no tocado)
- Opcional del profesor: telar, que los agregados aparezcan por primera vez en la consecuencia (paso 3 sin ellos);
  vaso, ver la microangiopatía antes de transfundir para comparar el «más».
- El resto de casos (sin objetivos) puede recibirlos cuando se toquen.

## Propuestas sobre las reglas
- Las pruebas que fotografían una caja tras llevarla al centro no ven lo que ve el residente: medir la posición justo
  al contestar (el profesor lo hizo así en la vuelta 2).
- Dos constructores en la misma carpeta y el director haciendo copias de seguridad: avisar al constructor de que hay
  commits suyos ya hechos (en la vuelta 2 creyó que no tenía nada que commitear).

## Gasto
Total 6,7 M equivalentes. Constructor sonnet 3,2 M (48 %, 3 agentes), constructor opus 1,1 M (17 %), profesor opus
994 k (15 %), director 944 k (14 %), auditor sonnet 424 k (6 %). Los que más: constructor vuelta 2 (1,4 M, 75
herramientas), constructor telar+vaso (1,2 M), constructor motor+inmersión (1,1 M). El gasto se fue en la vuelta 2:
mezcló motor (3 cambios) y datos de 4 modelos. Ahorro: si el juicio pide cambios de motor y de datos, partirlo en dos
encargos (motor potente corto, datos barato).
