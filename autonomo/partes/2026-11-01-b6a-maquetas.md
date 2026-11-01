# 2026-11-01 · b6a (pasos 1 y 2: cobertura y maquetas del cráneo vivo y de la placa motora)

**Resultado:** cobertura ≈85 % (14 fichas, grupos 6A-6D, 14 pacientes); 5 maquetas; Educación y el Consejo eligen
**cráneo B** (3-1) y **placa B** (3-1); las dos llegan a **9,5**. Rama `auto/b6a`, PR en borrador
[#79](https://github.com/alvariitoSW/fiebres-neutropenias/pull/79). Página: https://claude.ai/artifact/Mab34wwRpXHdXyZSESmsnR.
Nada de la app cambió (`jueces.mjs` no aplica; cada maqueta tiene su programa en `herramientas/`, en verde).

## Qué se hizo
- Paquete revisado (Explore): Monro-Kellie, curva P-V, autorregulación e hiperventilación no están en Marino → otra
  fuente aparte (Libro Azul, StatPearls, Manual UMI); también hemicraniectomía (RCEM, DESTINY II) e idarucizumab 5 g (EMA).
- Auditor: cráneo 2 graves (indicación quirúrgica de Abundio; hemicraniectomía atribuida a Marino), placa 3 graves
  («48 h», «neostigmina >70 no revierte más», pasos de la hendidura citados sin apoyo). Todos corregidos.
- El director arregló un aviso que se quedaba pegado al cambiar de paciente (`resang0` fuera de la lista de limpieza).

## Para el usuario
«Vale» o «cámbialo» a las dos maquetas (página arriba). Si no dice nada, se construyen así en la parada 3.

## Pendiente para la app
`dibujarCara` como pieza común (hoy atada a la ficha); `cargarMotion()` falla fuera de la raíz (las maquetas cargan
Motion a mano); el sello de `tope.js` ocupa mucho alto; la prueba de la placa debe vigilar las guías `pnc`/`mcc`;
aire bajo la escena con sello grande; cifras de la placa aún `ilustrativo` (CV normal, decremento, velocidades del GBS).

## Propuestas sobre las reglas
- **Presupuesto de maqueta con Motion**: la placa A y B gastaron 0,88-0,96 M frente a 0,55 (+65 %); igual que el
  cráneo (0,82-1,0 frente a 0,75). Proponer 0,9 M por maqueta en la tabla.
- **El programa de prueba debe probar el cambio de paciente** (avisos del anterior que no se limpian): ningún programa
  lo cazó; lo vio el profesor en una captura.

## Vueltas
| Pieza | Vuelta | Nota global tras la vuelta | Constructor | Pasos | M | Qué falló |
|---|---|---|---|---|---|---|
| Cráneo A / B / C | 1 | 8,6 · 8,3 · 8,2 | sonnet ×3 | 32-40 | 2,69 | B: sello tapa monitor, pupila contra sello, corte bajo el dock |
| Placa A / B | 1 | 8,7 · 8,7 | sonnet ×2 | 32 | 1,84 | B: neostigmina >70, rocuronio sin inicio, GBS sin consecuencia |
| Cráneo B | 2a+2b+3 | 9,3 | sonnet ×3 (+1 arreglo corto) | 20-32 | 1,52 | 2 graves de auditoría |
| Cráneo B | retoques | 9,5 | sonnet | 22 | 0,20 | Petronila, posturas por estadio |
| Placa B | 2a+2b+3 | 9,3 | sonnet ×3 | 17-29 | 1,26 | 3 graves de auditoría |
| Placa B | retoques | 9,5 | sonnet | 19 | 0,18 | dos sellos apilados, guías pnc/mcc |

## Gasto
`gasto.mjs --clave b6a`: **≈12,8 M**. Por papel: constructor sonnet ×13 7,7 M (60 %) · director 2,1 M (16 %) · profesor
fable ×6 1,9 M (15 %) · búsquedas de fuente 0,49 · auditor 0,33 · Explore 0,26. Los que más: maqueta cráneo C 1,0 M
(40 pasos), maqueta placa A 0,96 M, cobertura 0,96 M. Ahorro: presupuestar las maquetas a 0,9 M y no a 0,55-0,75.

## Cuentas
Presupuesto 10,8 M; Hacienda recortó a 10,5. Gastado ≈12,8 M: **+22 %**. Las cinco maquetas costaron 4,5 M frente a 3,35;
la ronda de retoques más los rejuicios finales añadieron 0,6 M. Queda dentro del +25 % (§4.17 B): el Consejo lo sube sin
parar al usuario. Bloque b6a: techo 30-45 M; gastado ≈12,8 M; quedan ≈17-32 M para modelos y Estudiar (la cobertura estima ≈41 M en total: puede
pedir más techo en la parada 3).
