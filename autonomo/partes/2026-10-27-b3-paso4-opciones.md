# 2026-10-27 · b3-paso4-opciones

**Resultado:** hecha (informe; el usuario elige) · página: https://claude.ai/artifact/HnYNUdSSrtvzdq8QhSj4Qw
**Vueltas:** 0 · **Jueces:** no aplica (no toca la app)

## Qué se hizo
Conté con `node` las claves de estado de los 13 modelos vivos y la eco, y las crucé con las 17 piezas de
`autonomo/bloques/b3/plan-paso4.md`: 1 ya existe (`vaso-vivo · warfarina`), 3 tienen un estado parecido
(`cateter-vivo · eco-compresion`, `eroaMitral` del motor de la eco, `telar-vivo · inmovil`) y 13 no existen.
Página para el móvil (`autonomo/bloques/b3/opciones-paso4.html`) con tres opciones: A todas (≈36 M, 10-12 sesiones,
3 días), C intermedia con 6 piezas (≈28 M, 8 sesiones, 2 días; recomendada) y B aligerado (≈23 M, 6-7 sesiones,
2 días), y ficha a ficha qué estado se usa y qué se pierde. Sin agentes: el director solo, para que fuera barato.

## Qué no se pudo hacer o leer
El glomérulo vivo no tiene archivo `*-data.js`: lo de `congestion` se comprobó con `grep` (no existe).

## Para el usuario
Elegir A, B o C (o C cambiando alguna pieza). La construcción será otra tarea del tablero.

## Visto de paso (no tocado)
Nada.

## Propuestas sobre las reglas
Ninguna.

## Vueltas
Sin vueltas.

## Gasto
Solo director, sin agentes. Estimación propia ≈ 0,3 M (no se pasó `gasto.mjs` para no gastar más en una tarea
de una pieza).
