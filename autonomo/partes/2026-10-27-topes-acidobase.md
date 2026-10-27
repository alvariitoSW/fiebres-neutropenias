# 2026-10-27 · topes-acidobase

**Resultado:** hecha, directo a `main` (tipo `arreglo`)
**Vueltas:** 1 · **Jueces:** `jueces.mjs --modelo acidobase-vivo` ✓ (topes: 29 mandos al tope sin cifras imposibles; 89 comprobaciones a 390 y 360 px) · auditoría: no aplica (sin contenido clínico nuevo)

## Qué se hizo
Se buscó la combinación: no eran la albúmina ni la osmolalidad. El juez pulsa antes «Bicarbonato IV» (láctica grave:
HCO₃⁻ 5, PaCO₂ 18) y luego lleva la PaCO₂ a 90. Con HCO₃⁻ 5, eso daría pH 6,36. El modelo **ya lo rechazaba** (el
mando se detiene fuera de pH 6,80-7,80) y el paciente nunca pasaba por ese pH, pero el aviso del rechazo escribía la
cifra imposible («pH 6,36: fuera de 6,80-7,80…»), que es lo que leía el juez. Arreglo en su origen: el aviso dice ahora
«No cabe: con PaCO₂ 90 y HCO₃⁻ 5, el pH bajaría de 6,80. No es un paciente posible: el mando se detiene.»
(`js/modules/nefrologia/acidobase-vivo.js`, función `mandar`). Versión 20261027-46.

## Qué no se pudo hacer o leer
`node autonomo/jueces-topes.mjs` suelto no hace nada (es una pieza que llama `jueces.mjs --modelo`); se pasó a través
de `jueces.mjs --modelo acidobase-vivo`. Los otros 7 modelos no se repasaron (no se tocaron).

## Para el usuario
Nada que decidir. El mando sigue deteniéndose igual; solo cambia la frase del aviso.

## Visto de paso (no tocado)
Al rechazar, el mando vuelve a su valor anterior en vez de quedarse en el último valor posible (p. ej. PaCO₂ 33 con
HCO₃⁻ 5). Funciona, pero sería más claro que se quedara en el tope.

## Propuestas sobre las reglas
- El juez de topes podría distinguir el texto de un aviso de rechazo («no cabe», «no es un paciente posible») de una
  cifra del paciente; mientras tanto, regla para los modelos: un aviso de tope no escribe la cifra imposible, sino el
  límite que se habría cruzado.

## Vueltas
| Pieza | Vuelta | Nota profesor | Constructor | Pasos | Tokens | Qué falló |
|---|---|---|---|---|---|---|
| aviso de pH en `mandar` | 1 | — (sin profesor) | ninguno: lo hizo el director | ~15 | — | nada |

## Gasto
Sin agentes: el arreglo era una línea y lanzar el constructor sonnet previsto (~25 pasos / 0,5 M) costaba más que
hacerlo. Todo el gasto es del director (lectura acotada de `acidobase-vivo-calculo.js` y del `mandar`, y dos pasadas
de jueces). Ahorro: en un `arreglo` de una línea con el origen localizado, sin constructor.
