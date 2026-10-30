# 2026-10-30 · rea-anatomyatelier (B-049)

**Resultado:** fase 1 hecha (informe). No toca la app.
**Informe:** https://claude.ai/artifact/PQDjwgQj5v7eMrQcqScTSk · `autonomo/ideas/ingenieria-inversa/anatomyatelier.md`

## Qué se hizo
- Comprobado que la web abre (200, sin `<iframe>`).
- Repositorio `thebuggeddev/anatomy`: lista de archivos sin bajar el contenido (y borrada); sin LICENSE.
- Cabecera de `heart.glb` leída en memoria: 1 malla de Tripo AI, ≈386 600 triángulos, sin animación ni formas.
- Una pasada de Playwright a 390×844: mapa de la red, texto y 2 capturas (solo en el informe).
- Veredicto: no sirve para el motor del corazón ni para la eco de B-045; **no cambia el contrato** (no se avisa a
  `mv-eco-1`).

## Qué no se pudo hacer o leer
El corte transversal, las capas, la animación y el quiz funcionando: el navegador del entorno no tiene GPU (3,5 fps).
Analítica y anuncios bloqueados por la red del entorno (no hacían falta).

## Para el usuario
Decidir si la lección «malla de IA ≠ referencia» va al encargo de `mv-eco-2a5` y si «aislar el corte» y los rótulos
3D quedan para después de B-045 (bitácora, «Esperando algo tuyo», punto 6).

## Después (30/10)
- El usuario aprobó la lección «malla de IA ≠ referencia» → añadida al «Encargo B-045» del tablero.
- 2.ª pasada: sin GPU en ningún modo, pero esperando 25 s tras cada pulsación se vieron el corte (quita media figura)
  y las capas (malla en alambre).
- «Que lo decida el ministerio del interior y el de educación»: dictámenes de un agente barato → `eco-3d-lectura`
  (tablero, carril 2, tarea 15), aparcada hasta `mv-eco-2a5`.
- Tarea programada «Vigía de eco-3d-lectura (tras mv-eco-2a5)», diaria a las 11:17: la abre cuando `mv-eco-2a5` esté
  en `main` y se apaga sola.

## Gasto
Director ≈35 llamadas y 1 agente barato (dictámenes, 6 llamadas).
