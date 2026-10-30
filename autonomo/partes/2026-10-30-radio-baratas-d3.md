# 2026-10-30 · radio-baratas (día 3 de 3)

**Resultado:** en revisión (misma PR #42, en borrador) · **Vueltas:** 1 (+ 2 arreglos de una línea del director) ·
**Jueces:** `jueces.mjs --ficha pifRadio:placa:panel-pif-radio-tabs:radio-f6` ✓ (390/360) · `pif-radio.mjs` ✓ ·
auditoría ✓ (0 graves) · profesor ✓ (A 7,5 → 8,5 + sus 2 arreglos aplicados; B 7,0 → 8,75)

## Qué se hizo
- **Ficha 6 «Lee esta placa»** en PIF → Radiología → Placa portátil de UCI: tubo (fig. 28.1) y vía central (fig. 2.6).
  Tocas la punta → eliges la lectura → «Comprobar con el libro» (apagado hasta tocar y elegir). Los rótulos impresos en la
  imagen van tapados hasta comprobar; el pie y el `alt` no dicen el veredicto antes. Tras comprobar: punta y carina
  rotuladas, «cerca/lejos» (tolerancia 7 % del ancho pintado), aviso «Has tocado la carina, no la punta» con la regla,
  frase de la fuente con página y «Ver en el texto». Carril de 30 s arriba. La punta del tubo reutiliza los datos de
  `fig-28-1`; la de la vía la sitúa la app según el pie, dicho en pantalla.
- 5 preguntas (`pifradio-lee`, q040-q044), una «encuentra el error»; distractores = confusiones reales (regla de la vía
  frente a la del tubo, 2 cm bajo la carina = aurícula).
- Revisión del encargo (Explore): 3 graves antes de construir (crédito de terceros en 49.2/49.3, páginas exactas, punto
  de la vía no dado por la fuente).
- La prueba `pif-radio.mjs` esperaba 300 ms fijos al botón de PIF y fallaba a veces: ahora espera a que se vea.

## Qué no se pudo hacer o leer
- Sonda nasogástrica (figs. 49.2 y 49.3): fuera por el crédito de terceros de sus pies. Con solo 2 figuras, las dos bien
  colocadas, tras la primera se intuye la respuesta: hueco señalado por el profesor.

## Para el usuario
- Ver en el móvil (PR #42): PIF → Radiología → Placa portátil de UCI → tarjeta 6. Toca la carina en vez de la punta y
  mira el aviso; repasa las 5 preguntas en «Repasar».
- **Decidir**: ¿se usan las figs. 49.2 (Pennsylvania Patient Safety Advisory) y 49.3 (introductiontoradiology.net,
  retocada) aunque el pie dé el crédito a terceros? Con ellas habría un caso mal colocado (sonda en el bronquio derecho).

## Visto de paso (no tocado)
- Los pies de 49.2, 49.3 y 2.6 en las fichas de Marino no recogen el crédito ni «mejorada digitalmente» del pie original.

## Propuestas sobre las reglas
- Ejercicio de «elegir antes de ver» sobre una figura: el encargo pide que **pie, `alt` y rótulos impresos** no den la
  respuesta antes de comprobar (el constructor dejó el pie «bien colocado» a la vista y ningún juez lo vio).
- Explicaciones de los distractores: el constructor sigue escribiendo razonamiento propio sin cita («el balón no empuja
  el tubo»); el director lo cambió por lo que dice la fuente. Que la lista del constructor lo marque.

## Vueltas
| Pieza | Vuelta | Nota mínima | Constructor | Pasos | Tokens | Qué falló |
|---|---|---|---|---|---|---|
| Ficha 6 | 0 | 7,0 (B) | sonnet | 31 | 0,33 M | pie regalaba la respuesta, distractores obvios, rótulos impresos (director) |
| Ficha 6 | 1 | 8,5 (A) → 8,75 | sonnet nuevo | 18 | 0,15 M | tolerancia del tubo y estado tras comprobar (director, 2 líneas) |

## Gasto
Total **1,4 M** (`gasto.mjs --clave radio-baratas`, esta sesión). Por papel: director 0,49 M (36 %) · constructor sonnet
0,48 M (2) · profesor fable 0,20 M (2) · Explore 0,17 M · auditor 0,05 M. Los 3 que más: director, constructor de la
ficha (0,33 M), Explore (0,17 M: leyó 4 páginas de PDF para los créditos). Próxima vez: el encargo inicial ya con la
regla de «nada que regale la respuesta» se habría ahorrado la vuelta 1.

## Cuentas
Presupuesto 2,45 M (Hacienda aplicada por el director: sin verificador ni revisor, auditor acotado, rejuicio corto) ·
gastado 1,4 M · desvío **−43 %**. Tarea entera: días 1-3 = 5,6 M, por debajo de la horquilla ≈7,5-10 M.
