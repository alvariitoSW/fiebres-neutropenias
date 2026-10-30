# 2026-10-30 · atlas-of-physics (B-042)

**Resultado:** informe-propuesta para Educación, fase 1 parada a la espera del usuario. No toca la app.
Informe: https://claude.ai/artifact/GxMeNNH8AV8ReEvUVkTAtH · notas: `autonomo/ideas/ingenieria-inversa/atlas-of-physics.md`

## Qué se hizo
- Una sola web, sin agentes. Antes, los dominios: ningún `<iframe>` en portada, Fluidos ni hoja de ecuaciones;
  Google Fonts abre y `cdn.jsdelivr.net` (Three.js) está bloqueado, así que las figuras 3D salen en blanco.
- Su código (MIT, sin minificar) leído en memoria: motor del libro, modelo, páginas, desgloses, «Compare», preguntas
  y sus comprobaciones. Comparado con `formula-comun` (`js/core/formula.js`) y los modelos vivos.
- Seis propuestas, de lo pequeño a lo grande: «Compara» entre fichas, juez del renglón, desglose al tocar, curva con
  punto vivo, hoja de fórmulas de guardia y preguntas con cifras del modelo.

## Qué no se pudo ver
- Las figuras 3D, el desglose en el móvil y las preguntas en pantalla (jsDelivr bloqueado). No se saltó el bloqueo.

## Para el usuario
- Elegir propuestas y dónde vive la hoja de fórmulas (ver bitácora, B-042).

## Gasto
Director solo, ≈11 llamadas; 1 captura leída. Sin agentes.
