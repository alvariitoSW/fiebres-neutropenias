# 2026-10-26 · inventario (B-014)

**Resultado:** parada del usuario: decide qué mejorar primero (informe https://claude.ai/artifact/894zY7AfqYQC3QWP1Yjxir)
**Vueltas:** 0 · **Jueces:** no aplican (sin cambios en la app)

## Encargo
No había ficha: la rellenó el director (tipo `auditoria`, solo lectura). Inventario ficha a ficha: especialidad,
cuaderno, fuente, palabras, vista Visual, modelo vivo, Estudiar, preguntas y «de redactar». Un solo agente
(`general-purpose`, sonnet) con un script de Node que lee el código.

## Qué se hizo
- `autonomo/ideas/inventario.csv` (una fila por ficha y por vista), `inventario.md` (resumen) e
  `inventario-datos.json`; página para el móvil `autonomo/ideas/inventario.html`.
- **362 fichas** en 32 cuadernos (no ~724; el recuento cuadra con un grep independiente), más 20 vistas sin cuaderno.
- Visual 197 (Hematología, Nefrología y Libros: todas; el resto: ninguna) · modelo vivo 64 · Estudiar 29 (bloques 1 y
  2) · con preguntas 360 · 347 preguntas «de redactar» en fichas.
- **150 fichas sin Visual, Estudiar ni modelo vivo**: 40 ya en el bloque 3 (Merino Cardiología y Neumología); 110 sin
  plan: guía ESC de IC (11), Manual UMI (30), Fisio UCI (27), papers (42).
- Pasada a 390 y 360 px: sin desbordamiento ni errores.

## Qué no se pudo hacer o leer
- Solo lectura del código: una vista Visual rota no se detecta; los enlaces a modelos vivos inyectados por JS no se
  ven (64 puede quedarse corto).
- Fuente no detectada en papers, Fisio UCI (salvo Cardiología), FRA, TRR, trasplante y VExUS: el script no lee la
  cabecera del cuaderno; por eso esas fichas no salen en la «lista de prioridad» del `.md` (sí en la página).

## Para el usuario
- Nada que decidir ahora: Marino es la prioridad única (Objetivo M5) y lo demás espera. El inventario queda como
  referencia para cuando se termine Marino (grupos sin plan: guía ESC de IC, Manual UMI, Fisio UCI, papers).
- Lo que sí está pendiente del usuario: elegir las maquetas v2 del bloque 3 (parada 1).
- ¿Reconvertir algún día las 347 preguntas «de redactar»? (REGLAS §8: las viejas se quedan hasta que lo pidas).

## Visto de paso (no tocado)
- `tab-clinica` y `tab-micro` (tratamiento dirigido de Neutropenia febril) son pestañas sin tarjeta.
- `cardio-bibliografia` es la única ficha sin preguntas ni nada de estudio (es bibliografía: probablemente correcto).

## Gasto
Total 716 k equivalentes. Agente del inventario (sonnet) 677 k (95 %, 33 herramientas); director 39 k (5 %).
Se fue en releer el contexto (3,2 M de caché leída): el script cabía en menos pasos si el encargo hubiera dado ya la
lista de archivos de visual y de mayéutica. Bien acotado igualmente.

## Propuestas sobre las reglas
- Ninguna nueva. El script (`/tmp/plan-socialista/inventario/inventario.mjs`) no se guarda en el repositorio; si el
  usuario quiere repetir el inventario cada cierto tiempo, se podría llevar a `autonomo/` (decisión suya).
