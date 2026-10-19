# Paquetes de bloque (Objetivo M5)

Cada bloque de Marino tiene una carpeta `autonomo/bloques/<bN>/` con **un solo archivo de entrada, `encargo.md`**:
todo lo que un agente necesita para trabajar en ese bloque. Así un agente no relee el proyecto entero: lee
`CLAUDE.md` (se carga solo), su papel en `.claude/agents/` y el paquete.

Lo que lleva un `encargo.md` (corto: lo que cabe en una pantalla larga, no más de ~120 líneas):
1. **Fichas del bloque**: id, título y grupo, con dónde viven (`js/modules/...html`) y su clave de `--ficha`.
2. **Fuentes**: los PDF de `docs/` con su desplazamiento de páginas.
3. **Modelos vivos**: los que ya existen y se usan (con su archivo y sus estados) y los nuevos aprobados.
4. **Decisiones del usuario** que afectan al bloque, con su fecha y sus palabras.
5. **Reglas que más fallan** (enlace a la lista de comprobación del constructor, en `.claude/agents/constructor.md`).
6. **Pasos y su estado**: cobertura, maquetas, modelos y estudio, con el archivo de salida de cada uno.

Los informes de los agentes van a la misma carpeta (`cobertura.md`, `auditoria.md`, `juicio.md`…), cortos: como mucho
40 líneas, con una tabla de ✅/❌ y al final «No comprobado / riesgo» en 1-2 líneas. El detalle largo, si hace falta,
en un anexo aparte que solo se lee cuando hace falta.
