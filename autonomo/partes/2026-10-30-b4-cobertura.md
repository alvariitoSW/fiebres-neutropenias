# 2026-10-30 · b4-cobertura

**Resultado:** en revisión (PR: https://github.com/alvariitoSW/fiebres-neutropenias/pull/41)
**Vueltas:** 1 · **Jueces:** no aplica (informe sin código) · móvil no aplica · auditoría: llega con las piezas

## Qué se hizo
Mapa de cobertura del bloque 4 de Marino (caps. 31-38, 23 fichas `mr-*`) por el profesor (fable), en
`autonomo/bloques/b4/cobertura.md` (resumen) y `cobertura-anexo.md` (detalle por ficha, estados nuevos con página,
pacientes, casos, presupuesto). Cobertura ≈88 % (380 de 430 ideas; ninguna ficha <81 %). Revisión del encargo, hecha
por el director (tarea sin código <2 M). El director comprobó por grep que el estado «DI» de la nefrona sí existe.

## Qué no se pudo hacer o leer
No se abrieron los modelos en el navegador (estados leídos del código). Páginas de párrafo ±1 (figuras y tablas
comprobadas). La cuenta de ideas es del profesor: el auditor la coteja cuando se construya.

## Para el usuario
Decisiones para la parada 1 del `b4` (cuando toque, tras aprobar el `b3`):
1. **Iones vivos**: un modelo nuevo (la escena del potasio ampliada con Mg, Ca y P) **con maqueta** (≈58 M el bloque)
   o **ampliarla directamente sin maqueta** (≈50 M). Recomendación del profesor: maqueta.
2. **ECG común**: el pintor del ritmo vivo pasa a la escena del potasio (comparte solo eso con `b3-corazon-pr`).
3. Ruta: 4A gasometría → 4C agua y sodio → 4B riñón que falla → 4D iones (espera a la maqueta y al ECG).

## Visto de paso (no tocado)
El glomérulo vivo sigue sin `congestion` ni `pia` (lo pidió R8); el ritmo vivo no tiene escalera de hiperK ni hipoK.

## Propuestas sobre las reglas
Ninguna.

## Vueltas
| Pieza | Vuelta | Nota | Modelo | Pasos | Tokens eq. | Qué falló |
|---|---|---|---|---|---|---|
| Cobertura | 1 | — (informe) | profesor fable | 27 | 801 k | nada |

## Gasto
Total 816 k equivalentes (profesor 801 k, 98 %; director ~15 k según `gasto.mjs`, que lo infravalora).
Se ahorró por un encargo de una pieza con lecturas acotadas (27 pasos frente a 40 de presupuesto).

## Cuentas
Presupuesto 1,10 M (profesor 0,85 + director 0,25); sin recortes de Hacienda (tarea <2 M). Gastado ≈0,82 M
(−25 %). Del bloque `b4` (45-72 M, por aprobar) se lleva 0,8 M. Presupuesto vigente «profesor cobertura» confirmado:
fable 27 pasos / 0,8 M.
