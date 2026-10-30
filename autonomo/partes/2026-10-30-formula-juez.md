# 2026-10-30 · formula-juez (B-042)

**Resultado:** hecha (técnica, directo a `main` con los jueces en verde)
**Vueltas:** 1 · **Jueces:** pruebas ✓ · móvil ✓ · auditoría — (técnica, no toca contenido)

## Qué se hizo
- Juez nuevo `autonomo/jueces-formula.mjs` (`node autonomo/jueces.mjs --formula`; también con `--forma` y con
  `--modelo capilar-vivo|agua-viva`): en los 5 modelos con el renglón «fórmula → tus números → resultado» (capilar,
  río y mar, glomérulo en ERC, filtro en TRR y Doppler del TSVI del eco) mueve cada mando, lee el renglón pintado,
  rehace la cuenta con los números que se ven y falla si no da el resultado con sus mismos decimales (CLAUDE §7.10).
- Prueba trampa `autonomo/pruebas/formula-juez-trampa.mjs`: con el resultado alterado a mano da ❌; sin alterar, ✅.
- Lo que cazó a la primera, arreglado en la app: la DO₂ del capilar (8 renglones, hasta 7 mL/min de diferencia: el
  gasto se escribía ya redondeado) y el gasto cardíaco del Doppler (3 de 29 lecturas, 0,1 L/min). Ahora cada renglón
  lleva los decimales justos para que la cuenta a mano cuadre. Versión `20261030-2`.
- Revisión del encargo: la hizo el director sin agente (arreglo pequeño); sin huecos. Encargo y presupuesto: los del
  tablero (≈0,5-0,8 M), sin Hacienda (<2 M).

## Qué no se pudo hacer o leer
Nada.

## Para el usuario
Nada que decidir. En el capilar y en el Doppler, el renglón de la cuenta puede salir con un decimal más (p. ej.
«5,03 × 1,34 × …»): es a propósito, para que la cuenta a mano dé lo que enseña el modelo.

## Visto de paso (no tocado)
- `.claude/settings.json` sale modificado por graft al abrir la sesión; no se sube (REGLAS §5.1).

## Propuestas sobre las reglas
- Un modelo nuevo que pinte `pintarFormula` entra en `MODELOS_FORMULA` de `autonomo/jueces-formula.mjs` (como el
  sello propio entra en `jueces-topes.mjs`), para que el juez lo cubra.

## Vueltas
| Pieza | Vuelta | Nota mínima del profesor | Modelo | Pasos | Tokens eq. | Qué falló |
|---|---|---|---|---|---|---|
| Juez + trampa + 2 arreglos | 1 | — (técnica) | director | — | ver Gasto | capilar y Doppler no cuadraban (arreglado) |

## Gasto
Total **≈0,95 M** (0,88 M medidos antes de cerrar), todo del director, sin agentes. Dónde se fue: averiguar cómo se abre
cada uno de los 5 modelos (dos van dentro de fichas de nefrología y el Doppler en el laboratorio de eco) y las dos
pasadas de navegador tras arreglar el capilar (el primer arreglo usaba el gasto ya redondeado). Próxima vez: el
encargo con la ruta de apertura de cada modelo.

## Cuentas
Presupuesto 0,5-0,8 M · sin recortes de Hacienda (<2 M) · gastado ≈0,95 M · desvío **≈+19 %** sobre el tope (0,8 M), por los dos arreglos de la app que el juez
destapó y que el encargo no preveía; sin comparecer (<25 %) · tarea técnica suelta, sin
presupuesto de bloque.
