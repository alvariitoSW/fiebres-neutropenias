# 2026-11-01 · anclas-profesor y bajo-95

**Resultado:** hechas, directo a `main` (técnicas) · **Vueltas:** 2 de capturas · **Jueces:** no aplican (no se tocó la app; solo `autonomo/`)

## Qué se hizo
- **Anclas**: `autonomo/modelos/anclas/` con 16 capturas JPEG a 390 px (≈0,6 MB), `capturas.mjs` para regenerarlas y `LEEME.md`
  (punto → ancla → cómo llegar → calibración). Calibración única del profesor en 2 vueltas: dan **10** 7.3 (4Ts), 7.4/7.8
  (nefrona), 7.4/7.5 (atlas VD), 7.9/7.10 (capilar). Quedan como **ejemplo de 9,5** 7.2, 7.5 (nefrona), 7.6, 7.7 y §8, y de
  **9,0** 7.1, 7.13 (atlas IM sin ecógrafo) y el mecanismo animado: fallos del modelo de la app, no de la captura → B-052.
- **bajo-95**: `autonomo/bajo-95.md` con las 55 fichas con Estudiar de `main` en 11 filas por grupo. Solo el b3 tiene nota de
  10 (media 8,57; mínimo ≥8 taquiarritmias); b1 (23) sin nota en su parte; b2 (6) en escala 1-5. Disección aórtica: 8,5 en el acta
  11.ª y 8,75 en el parte (anotadas las dos).
- Revisión del encargo: la hizo el director (arreglo pequeño, sin agente).

## Qué no se pudo hacer o leer
No hay en la app un ancla de 10 para 7.1 y 7.13 (carril de 30 s **con** figura): los capítulos del atlas con figura no tienen
carril y los que lo tienen no tienen figura.

## Para el usuario
Nada que decidir ahora. B-052 (arreglos para llevar las anclas a 10, ≈0,6 M) espera tu visto bueno en la bitácora.

## Visto de paso (no tocado)
- La app dice «Texto | Mayéutica | Estudiar»; REGLAS §8 dice «Texto | Estudiar».
- Maqueta `preguntas-para-estudiar.html` l. 236: «Heparina … desde hoy» se arrastra hasta el alta (contradice el Momento 2 de la 4Ts).

## Propuestas sobre las reglas
- §7 «Cómo se juzga»: en un punto sin ancla de 10, el 10 es «su ejemplo de 9,5 sin el fallo nombrado» (así lo dice el LEEME).
- Presupuesto de capturas en la app: 0,3 M por tanda (el tablero daba 0,3 M para todo; una tanda sola costó 0,35 M).

## Vueltas
| Pieza | Vuelta | Puntos bajo 10 (antes → después) | Modelo | Pasos | Equiv. | Qué falló |
|---|---|---|---|---|---|---|
| Capturas | 1 normal | 7 de 14 bajo 10 | sonnet | 40 | 346 k | capturas en el estado equivocado (4Ts con 0 puntos, cascada apagada) |
| Capturas | 2 corta | 7.5 9,0→10 · 7.10 9,0→10 · 7.6/7.2/7.7 9,0→9,5 · 7.1 8,5→9,0 · 7.13 8,0→9,0 · mecanismo 9,0→9,0 | sonnet | 28 | 233 k | lo que queda es del modelo de la app |

## Receta
En `LEEME.md` («Calibración única») y en B-052: cada punto con su fallo nombrado y el arreglo que lo lleva a 10.

## Gasto
`anclas-profesor` **1,1 M**: constructor ×2 (sonnet) 579 k, director 328 k, profesor ×2 241 k. `bajo-95` **0,45 M** (sonnet, 24 pasos).
Dónde se fue: la primera tanda de capturas no fijó el estado de cada modelo (escala, paso de la animación, nodo abierto), y
hubo que repetirla. Próxima vez: el encargo dice el estado exacto de cada captura.

## Cuentas
Previsto: tablero 0,3 M + 0,1 M; el mío 0,55 M + 0,1 M. Gastado: 1,1 M + 0,45 M = 1,55 M (+138 % sobre lo mío). La segunda
tanda de capturas la aprobó el usuario (≈0,35 M más). bajo-95 se pasó por 125 k de caché escrita al leer muchos partes.
