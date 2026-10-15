# 2026-10-15 · marino-mapa (Plan Marino, fase 2: mapa visual)

**Resultado:** en revisión, esperando que el usuario elija. Maquetas publicadas:
https://claude.ai/artifact/XkbXSjmeJF7BeHhQ2wSC4L
**Jueces:** no aplica a la app (no se tocó). Las 4 maquetas se probaron a 390 y 360 px, sin errores de consola, sin
desbordar y con toques de 44 px.

## Qué se hizo
- **Mapa visual** del profesor (modo mapa, modelo potente), en `autonomo/ideas/marino.md` → «Mapa visual».
  - Propone 6 modelos grandes para unas 110 de las ~154 fichas. Tres ya existen y se amplían: circulación viva,
    riñón vivo y escena del potasio. Tres son nuevos: ácido-base vivo, río y mar, pulmón con respirador.
  - Detrás, en una segunda ola: capilar y O₂, vaso que sangra, hepatocito vivo, cráneo vivo y termostato.
  - Incluye el orden de los bloques de estudio y lo que no merece modelo.
- **Maquetas** en `autonomo/maquetas/`, hechas por cuatro constructores (modelo potente) a la vez:
  - **M1 · ácido-base vivo**, tres direcciones con el mismo caso (CAD → compensación → salino frente a Ringer →
    vómitos → salino + ClK):
    - A · Lámina de anatomía dorada;
    - B · Campo oscuro;
    - C · Móvil cinético.
  - **M2 · el agua del cuerpo** («río y mar», idea del usuario), dos direcciones en una página: estuario de noche y
    corte del terreno. Tiene interruptor del color del agua.
- **El pH de las maquetas** sale de la Ec. 31.2 del libro, [H⁺] = 24 × PaCO₂ / HCO₃⁻. Con Henderson-Hasselbalch
  (6,1 + log) daría 7,29 y 7,52 en vez de los 7,28 y 7,51 de la tabla del caso.

## Para el usuario (decidir)
1. **Ácido-base:** A, B, C o una mezcla (el profesor sugiere el móvil de C como cabecera con los órganos de B
   debajo). Y si el riñón entra con la foto real del corte o dibujado en el estilo.
2. **Agua:** dirección 1 o 2. El color del agua: solo tokens, o el azul `#8fb8d8` del filtro vivo, que no está en la
   paleta y se lee mejor. Y si el fregadero de la Fig. 11.1 entra en este mundo.
3. **Siguientes maquetas:** M3 (pulmón con respirador) y M4-M7 (segunda ola), cuando quiera.

## Hallazgos (van a una tarea de arreglo, no se tocaron)
- **`mr-acidobase-analisis` (Regla 4):** copia sin nota el segundo ejemplo del cap. 31 (PaCO₂ 26 / pH 7,50 / HCO₃⁻
  14). No cumple la Ec. 31.2: da pH 7,35. El primero (7,28 / 23 / 14) ya tiene su nota desde R8.
- **`mr-acidobase-gaps`:** la albúmina vale 15 mEq/L en la Tabla 31.2 y 2,5 mEq por gramo en la Ec. 31.15
  (≈11 con 4,5 g/dL), sin nota de fuentes.
- **Ecógrafo, escenario «Derrame pericárdico»:** no llega a shock (PA 106/78, GC 3,9; ya lo dijo R4).

## Propuestas de regla
- **Carpetas de trabajo de agentes en paralelo:** cada agente usa su propia subcarpeta del scratchpad y nunca
  `rm` ni `pkill` sobre nombres genéricos. Dos constructores se borraron capturas y se cortaron pruebas entre sí.
