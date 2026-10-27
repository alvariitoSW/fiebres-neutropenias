# 2026-10-27 · eco-vci-retenido (B-021)

**Resultado:** hecha, en `main` (Objetivo V: mejora de lo existente, directo con los jueces en verde; sin PR)
**Vueltas:** 2 + retoque del director · **Jueces:** `--eco` (247 pruebas) y `--ficha sobrevivirUmi:manualUmi:panel-manual-umi-tabs:umi-fate` ✓ · auditoría ✓ (0 graves en las 2 vueltas) · profesor ✓ (v1 7,5-9,0 → v2 todo ≥8,75)

## Encargo
La ficha del tablero estaba completa; el director añadió el criterio de «retenido» (estado neutro, icono y texto),
el origen visible y que el trazado no simula la VM. Copia: `/tmp/plan-socialista/eco-vci-retenido/encargo.md`.

## Qué se hizo
- Ecógrafo, Medir → VCI: selector «Respiración» (Espontánea · VM sin esfuerzo · VM fórmula general) encima del
  resultado. Con VM: «⚠ Retenido: con ventilación mecánica no uses el colapso solo», el índice de VM del Manual UMI
  (>18 % / >12 %, pág. 70) con la cuenta y tus números, «Ver en la ficha», el PDF y la nota de fuentes plegada.
- «Llevar a la calculadora» lleva el modo correcto y los diámetros sin redondear de más: el % coincide en las dos.
- Manual UMI (ficha FATE): línea «el manual no da bandas de PAD para VM» y frase en la calculadora con VM.
- Preguntas: `umi-q068b` (encuentra el error) y `umi-q068c`; `umi-q068` pierde una frase de fisiología sin fuente.
- Arreglo previo que bloqueaba el flujo: en el modo M, el segundo toque movía el primer calibre (la VCI ocupa
  10-20 px a 390) y no se podía medir con dos toques.
- Retoque del director: fuera el aviso de «índice >100 %» (rechazaba medidas posibles sin fuente); el aviso de
  «Dmín < 2 mm» solo en VM sin esfuerzo (esa fórmula divide entre el Dmín; en espontánea un colapso casi total existe).

## Qué no se pudo hacer o leer
- La fuente no explica por qué el colapso no vale con VM: el Manual UMI solo separa fórmulas; Marino (cap. 11, pág. 27)
  lo da por poco fiable en general. No se escribió la fisiología (la presión positiva distiende la VCI) por no tener
  fuente en `docs/`. Barbier 2004 y Feissel 2004 se citan por la web; no se abrieron los artículos.
- La pregunta del atlas `eat-q032` sigue citando la ASE 2025 (no está en `docs/`): no se tocó.

## Para el usuario
- Nada que decidir. Para verlo: Sobrevivir a la UMI → Manual UMI → FATE → «Medir el Dmáx y el Dmín de la VCI…»;
  pausa, dos toques en las paredes, guarda Dmáx y Dmín y cambia a «VM sin esfuerzo».
- Si tienes la guía ASE 2025 en PDF, se podría dar la PAD con VM (8 mmHg por defecto, según `eat-q032`).

## Visto de paso (no tocado)
- El manual tiene dos filas de VM que pueden dar veredictos opuestos con los mismos diámetros (2,0/1,7 cm: 17,6 %
  frente a 16,2 %) y no dice cuál manda; la explicación de `umi-q068b` lo cuenta.

## Propuestas sobre las reglas
- Un aviso de «medida imposible» también necesita fuente o fisiología clara: el profesor pidió uno (>100 %) que
  rechazaba medidas reales. Propuesta: los avisos de calibre se rotulan «control de la app» y solo cubren lo que
  rompe la fórmula (dividir entre casi 0).

## Gasto
Total 2,1 M equivalentes. Constructor sonnet 658 k (32 %, 2 agentes) · director 519 k (25 %) · profesor opus 507 k
(25 %, 2) · lector de fuente 199 k (10 %) · auditor 175 k (8 %, 2). Los 3 que más: constructor v2 428 k (40 pasos:
10 arreglos en una tanda; razonable), profesor v1 356 k (recorrido real con Playwright, encontró el fallo del modo M),
director 519 k. Ahorro: el lector de fuente gastó 199 k leyendo un escaneo girado; para el Manual UMI, pasar la página
exacta (aquí la 70) desde el principio.
