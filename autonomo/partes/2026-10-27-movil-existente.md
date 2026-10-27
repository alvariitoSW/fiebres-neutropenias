# 2026-10-27 · movil-existente

**Resultado:** hecha, directo a `main` (tipo `arreglo`; sin PR)
**Vueltas:** 1 · **Jueces:** pruebas ✓ (`jueces.mjs` en verde) · móvil ✓ (8 modelos y 2 fichas de Fundamentos, 390 y
360 px) · auditoría — (no aplica: no cambia contenido)

## Qué se hizo
Arreglado en lo ya construido todo lo que cazaba el juez del móvil, con 5 constructores sonnet en carpetas aparte:
- **Frases vivas sin «…»**: fuera el recorte a 2-3 líneas en catéter, muralla, telar, inmersión, vaso, capilar y río y
  mar; la frase crece.
- **Nada bajo la barra de abajo**: «Siguiente →» con margen del dock (capilar, vaso); río y mar sube lo justo para ver
  la frase tras tocar un mando (`verFrase()`); en ácido-base la frase va pegada arriba en Explorar y la figura vuelve a
  la vista; en capilar, tocar un estado sube a la lámina.
- **Letra ≥ 8 px**: suelo de 9,3-10 en las funciones de rótulos de cada escena (el SVG se pinta al ~88 % a 360 px);
  rótulos movidos donde se pisaban (biopelícula en catéter, factores de vaso en 2×2, «sangre venosa» en capilar).
- **Marino · Fundamentos**: pie de figura del kit visual (`.vk-figura-pie`) sin recorte; ejes de lactato y retorno
  venoso a 10 px.
- Versión 20261027-41.

## Qué no se pudo hacer o leer
Nada bloqueado. Ningún constructor miró capturas de todo: lo validó el juez. Fundamentos: las 23 fichas pasaron tras
quitar el recorte; tras subir los ejes se repasaron 3 (y yo 2), no las 23.

## Para el usuario
Mirar en el móvil (2 minutos): **vaso** (lupa de la herida y la balanza, con factores más grandes), **capilar**
(gráficas 12.3 y 12.4 ahora a una columna) y **ácido-base** (la frase pegada arriba en Explorar). Si algo molesta, se
cambia en la vuelta siguiente.

## Visto de paso (no tocado)
- `acidobase-vivo`: el juez de topes da pH 6,36 con la PaCO₂ a 90 (ya estaba en `main`; propuesta `topes-acidobase`
  del parte `jueces-topes`).
- Cardiología `mc-vasopresores`: rótulos de 7,4-7,6 px en «Membrana celular con los receptores».
- `js/core/bolsa.js` pinta el volumen a 8,3 (capilar lo hereda) y `js/core/particulas.js` rotula a 1,05·r: en lupas
  escaladas quedan justos. Un suelo en la pieza común lo arreglaría para todos.
- Al fusionar `main` en la rama, el tablero quedó con marcas de conflicto en un commit intermedio; arreglado antes de
  subir a `main`.

## Propuestas sobre las reglas
- Pieza común `verFrase()` en `js/core/` (llevar la frase viva a la vista tras tocar un mando) para todos los modelos
  vivos, en vez de una solución por modelo (hoy hay tres: margen, pegada, scroll).
- En la lista del constructor: «suelo de letra SVG = 8 / escala a 360 px (≈ 9,3)», no 8 a secas.
- El director no fusiona `main` dentro de un comando en segundo plano: un conflicto pasa sin verse.

## Vueltas
| Pieza | Vuelta | Nota profesor | Modelo | Pasos | Tokens eq. | Qué falló |
|---|---|---|---|---|---|---|
| capilar | 1 | — (técnica) | sonnet | 30 | 296 k | nada |
| río y mar + ácido-base | 1 | — | sonnet | 67 | 1,0 M | nada; se pasó de 60 pasos (2 modelos con soluciones distintas) |
| catéter + muralla | 1 | — | sonnet | 36 | 241 k | nada |
| telar + inmersión + vaso | 1 | — | sonnet | 41 | 661 k | nada |
| Fundamentos | 1 | — | sonnet | 15 | 87 k | nada |

## Gasto
Total 2,5 M equivalentes (5 encargos con presupuesto de 60 pasos / 1,1 M; Fundamentos 40 / 0,7 M).

| Papel · modelo | Lanzados | Equivalente | % |
|---|---|---|---|
| constructor · sonnet | 5 | 2,3 M | 93 % |
| director · opus | 1 | 177 k | 7 % |

Los que más: río y mar + ácido-base (1,0 M, 67 pasos: cada jueces `--modelo` tarda minutos y fueron dos modelos con
arreglos de scroll distintos; partirlo en uno por modelo), telar+inmersión+vaso (661 k, tres modelos copiando una
receta: eficiente por modelo), capilar (296 k). Lo barato fue dar la receta del primero (catéter) a los siguientes.
Presupuesto nuevo «constructor arreglo de móvil por modelo» · sonnet: 25 pasos / 0,3 M.
