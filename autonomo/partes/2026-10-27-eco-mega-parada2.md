# 2026-10-26/27 · eco-mega, parada 2 (anatomía, fisiología y patología) + B-025

**Resultado:** hecha y fusionada en `main` con permiso del usuario (26/10: «cuando la acabes y subas al main y
termines todo, podrás cerrar la sesión»). **Vueltas:** 3 · **Jueces:** `jueces.mjs --eco` en verde (419 pruebas,
13 pendientes marcadas) · **Profesor:** v1 ❌ (7,4/8,4/7,6/8,7/8,3/7,2) → v2 ✅ **8,3/8,4/8,3/8,4/8,4/8,1** (+ vuelta 3
de retoques baratos, sin rejuzgar) · **Auditor:** 0 graves, 1 hueco y 9 menores, todos corregidos.

## Encargo
`autonomo/bloques/eco-mega/encargo.md` («Parada 2»), sobre `corazon-mas-real-plan.md` y la ampliación B-025
(`eco-fisiopatologia.md`, informe de Fable 5.1: https://claude.ai/artifact/TooB2RJcrwkf9CoFiPyqBi). Decisiones del
usuario del 26/10: núcleo dentro, P1 potente con el pericardio de las aurículas, P7 como «forma grave» con nota.

## Qué se hizo (un informe por encargo en `autonomo/bloques/eco-mega/`)
- 0 lector: 45 cifras de Lang/Mor-Avi con página (`REFERENCIAS_FORMA`), 3 erratas anotadas.
- Imagen: A1 cuerdas y papilares · A2 tabla de brillo (`js/data/eco-tejidos.js`) y leyenda · A3 sombra del calcio
  (sin escenario: no hay ficha de estenosis aórtica) · D1 eco real de uso libre en A4C y PLAX.
- Forma: B1+F1 red «paciente posible» · B2 VI en bala y aurículas con su volumen · N2 VD en U, banda moderadora y
  TSVD de Lang (y la medida del VD basal, que se leía en el ápex) · N3 aorta descendente, pleura y columna
  (`torax.mjs`) · B3 torsión desde la contracción (Mor-Avi) · B4 papilares anclados · F5 TAPSE desde el vaciado del VD
  y FAC · B5 cortina aorto-mitral (Hahn pp. 942-943).
- Patología: P2 beso de papilares (VTS 23 mL a fondo, papilares a 1,1 mm) · C1 festones A1-A3/P1-P3 y cúspides con
  nombre («Señálalo → Festones y cúspides») · P1 taponamiento desde la presión transmural (AD desde ~140 mL, VD desde
  ~330) y saco que abraza las aurículas, con el líquido primero detrás · P4 TEP con los criterios de Lang en la lectura
  · P7 nota «forma grave».
- Vuelta 2: tabique interauricular único, SC4C con el VD bajo el hígado, mando de gravedad, pulmón sin «peine»,
  aurículas menos brillantes, lecturas del TEP («aplanado en diástole»). Vuelta 3: rótulos, botón y mando a la vista.
- Arreglo de paso: la barra del ciclo se rehacía en cada latido (toques perdidos).

## Qué no se pudo hacer o leer
- Por debajo de la meta 8,75 (coste medio, para otra parada): el saco del derrame grande con esquinas; el VI del TEP
  facetado; el colapso borra la cámara en vez de doblar la pared; la tricúspide no abre en F (fisiología del motor);
  el TAPSE de 4,8 mm del TEP con PAM 67 sin fuente; VTS del beso 23 mL (no 15-20); la FAC sin lectura propia.
- Huecos de fuente: MAPSE, rotación basal/apical, S′, grosor sistólico del VD, índice de excentricidad, VTS del beso,
  cifras del pericardio. Esperan los PDF que el usuario busca (Zoghbi 2017, ESC/ERS 2022, amiloidosis, Klein 2013,
  MAPSE, Leung y Levine 1994).
- D1: falta la VCI subcostal (Commons dio 429). Sin móvil real. 360 px del profesor solo en capturas.

## Para el usuario
- Mirar: Eco cardíaca → simulador: A4C (aurículas y tabique), subcostal, «Derrame» con el mando de gravedad a fondo,
  «Hemorragia» a fondo en el eje corto, TEP, y «Señálalo → Festones y cúspides».
- Decidir: la parada 3 (F3, F4, N1, P5, P6 y los retoques de coste medio de arriba) cuando lleguen los PDF.

## Visto de paso / ajustes que conviene saber
- La copia congelada del ecógrafo de antes (`pruebas/ecografia-antes.mjs`) se ajustó a la tabla de brillo nueva
  (−5 dB en la aurícula): es una foto de regresión, no una referencia clínica.
- El umbral de profundidad del VD en el SC4C de una prueba bajó de 20 a 18 mm (ilustrativo, de la prueba).
- B3, B4 y P1 tocaron `formas.mjs` (fuera de su lista) para que la activación y el pliegue lleguen a la geometría.

## Gasto
`eco-mega` en esta sesión: **≈ 28,9 M** equivalentes (incluye el paso 2 de la parada 1, 2,3 M); `eco-anatomia` 1,7 M.

| Papel · modelo | Lanzados | Equivalente | % |
|---|---|---|---|
| constructor · sonnet | 17 | 11,8 M | 41 % |
| constructor · opus | 4 | 9,7 M | 34 % |
| director (aprox.) · opus | 1 | 4,9 M | 17 % |
| profesor · opus | 2 | 1,5 M | 5 % |
| auditor · sonnet | 2 | 0,6 M | 2 % |
| lector · sonnet | 1 | 0,5 M | 2 % |

Los que más: vuelta 2 de Forma (opus, 3,5 M), P1 (opus, 2,7 M), B2 (opus, 2,3 M). Previsto en el informe para lo
hecho: ~24 M optimizado; real ~26,6 M. Dónde se fue: la vuelta 2 de Forma arregló anatomía que el primer pase dejó
(tabique, subcostal); con la red de pruebas del tabique escrita en B2 se habría evitado. Director largo: 17 %.

## Propuestas sobre las reglas
- Cada encargo de forma lleva **una captura de cada vista frente a la eco real (D1)** antes de entregar: los fallos
  de la v1 (tabique doble, VD en rendija) se veían a simple vista y ninguna prueba los pedía.
- Los constructores que trabajan a la vez no deben dar por mala la suite cuando el otro está a medias (pasó con A2/B2):
  pasar la suite solo con el árbol limpio o en su propia copia.
- El enlace «Ver en el móvil» a `main` en raw.githack puede servir piezas viejas mezcladas (el usuario vio «No se pudo cargar el simulador» el 27/10; con el enlace fijado al commit cargó bien). Propuesta: en las PR y los partes, el enlace lleva el commit completo, no el nombre de la rama.
