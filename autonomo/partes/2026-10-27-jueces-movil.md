# 2026-10-27 · jueces-movil

**Resultado:** hecha, directo a `main` (tipo `arreglo`, técnico; sin PR)
**Vueltas:** 1 · **Jueces:** pruebas ✓ (`jueces.mjs` en verde; trampa 4/4) · móvil ✓ (el juez nuevo) · auditoría — (no aplica)

## Qué se hizo
Juez nuevo `autonomo/jueces-movil.mjs` (REGLAS §4.8 R1), que corre con `--modelo`, `--ficha` y `--forma`, a 390 y
360 px: (1) frase viva, enunciado o «Siguiente» tapados por la barra de abajo, o algo ilegible al final de la página;
(2) la figura o la frase salen de la pantalla al tocar hasta 6 mandos; (3) frases cortadas con «…» (ellipsis,
line-clamp, `<text>` acabado en «…»); (4) rótulos SVG o texto HTML de menos de 9 px. Prueba trampa
`autonomo/pruebas/jueces-movil-trampa.mjs` (estropea a propósito la muralla y comprueba que caza las 4).
`jueces.mjs` a secas no cambia (sigue rápido y en verde).

## Qué no se pudo hacer o leer
Nada bloqueado. Umbrales (figura ≥ 50 % a la vista, frase ≥ 70 %) puestos por el director, sin calibrar con el profesor.

## Para el usuario
Desde ahora `--modelo` y `--ficha` salen en ❌ en todo lo ya construido: el juez es más duro que lo que había.
Hallazgos reales (no arreglados, fuera de la tarea) → propuesta de tarea `movil-existente` para la bitácora:
- **Capilar**: «Siguiente →» tapado un 99 % por el dock tras contestar en Mayéutica.
- **Río y mar y ácido-base**: tras tocar mandos (Salino 0,9 %, 5ClK, 22 h, 0normal) la frase viva queda bajo el dock o
  fuera de pantalla; la figura sale de pantalla al tocar «0normal» (ácido-base) y «Normal» (capilar).
- **Frase viva cortada con «…»** (clamp a 2-3 líneas): catéter, muralla, telar, inmersión, vaso; en capilar dos
  rótulos cortados por la derecha; en río y mar «Marisma intersticio» a 360 px.
- **Fichas de Marino · Fundamentos**: los pies «Figura N.M · …» salen cortados a 3 líneas en Estudiar (16 de 23
  fichas a 390 px, 20 a 360 px).
- **Rótulos < 9 px**: decenas por modelo (capilar 104, vaso 120, muralla 109; p. ej. «0 cm» a 7,2 px). El 7,5 px
  de antes los dejaba pasar; con el 9 px de R1 no.
Decidir: arreglarlos (tarea nueva, sonnet, por modelo) o rebajar el umbral de rótulos a algo intermedio.

## Visto de paso (no tocado)
Lo de arriba. Dudoso: el aviso «frase al 0 % tras tocar un mando» depende de que el navegador baja hasta el mando;
un usuario que ya esté más arriba puede verla. Se deja como aviso real hasta que el profesor lo mire.

## Propuestas sobre las reglas
- Que `jueces-topes` y cualquier tarea que pase `--modelo` sobre un modelo viejo cuente con estos ❌ previos y no los
  tome como suyos hasta que se haga `movil-existente`.
- `--forma` completo tarda ~25 min: pasarlo solo al cerrar un bloque; en las vueltas, `--modelo <clave>` o `--ficha`.

## Vueltas
| Pieza | Vuelta | Nota profesor | Modelo | Pasos | Tokens eq. | Qué falló |
|---|---|---|---|---|---|---|
| jueces-movil.mjs | 1 | — (técnica) | sonnet | 45 | 613 k | nada; corrigió 4 falsas alarmas propias |

## Gasto
Total 657 k equivalentes (presupuesto del constructor 60 pasos / 1,1 M: gastó 45 / 613 k, un 56 %).

| Papel · modelo | Lanzados | Equivalente | % |
|---|---|---|---|
| constructor · sonnet | 1 | 613 k | 93 % |
| director · opus | 1 | 43 k | 7 % |

El gasto se fue en pasar `--forma` entero (~25 min) para cazar falsas alarmas. Se ahorraría pasando 2 modelos
mientras se calibra y `--forma` una sola vez al final. Presupuesto nuevo para «constructor de un juez» · sonnet:
45 pasos / 0,55 M.

## Decisión del usuario (27/10, al cerrar)
«Apruebo la 1 y la 2»: (1) tarea `movil-existente` en el tablero (fila 21) para arreglar lo ya construido; (2) el
mínimo de letra baja de 9 a 8 px (`LETRA_MIN` en `jueces-movil.mjs`, REGLAS §4.8 R1 y lista del constructor).
