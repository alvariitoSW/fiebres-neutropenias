# 2026-10-25 · potasio-prioritario (B-019)

**Resultado:** hecha, en `main` (Objetivo V: mejora de lo existente, directo con los jueces en verde; sin PR)
**Vueltas:** 3 (+ retoque del director) · **Jueces:** `--ficha` hiper e hipopotasemia ✓ · `--modelo potasio-prioritario` ✓ (63 comprobaciones, 390 y 360 px) · auditoría ✓ (0 graves tras la vuelta 2) · profesor ✓ (8,5-9; meta 8,75 salvo primera vista, retocada por el director)

## Encargo
La ficha del tablero estaba completa; el director añadió el «hecho» y la ruta de la ficha. Copia:
`/tmp/plan-socialista/potasio-prioritario/encargo.md`.

## Qué se hizo
- Vista Visual de Hiperpotasemia: bajo cada medida, su papel («protege la membrana; el K⁺ no baja» / «mete el K⁺ en la
  célula, por un tiempo» / «saca el K⁺ del cuerpo») y, si no trata lo prioritario, «no cambia nada», con «Texto ↓».
- Al acabar el reloj, revisión por objetivos sin nota: ECG protegido, K⁺ por debajo de 5, salida iniciada (✓/✗ + porqué).
- Vuelta 1→2: el calcio de un solo instante contaba como protección para 12 h (grave de auditor y profesor). Vuelta 3:
  ✓ si el calcio se da a tiempo (≤10 min, «criterio ilustrativo del simulador»), con aviso ámbar si el ECG siguió
  alterado tras sus 30-60 min. Frases fieles a la ficha (diálisis «IR grave o si fallan las previas», diurético con IR
  grave «apenas actúa», bicarbonato solo con acidosis), aviso de límite de hipopotasemia si el K⁺ acaba en 3,5.
- Prueba nueva `autonomo/pruebas/potasio-prioritario.mjs` (recorrido bien hecho, solo calcio, mensajes).

## Qué no se pudo hacer o leer
- El auditor auditó por lectura del diff y la ficha, sin abrir el PDF original ni ejecutar el simulador.
- No se miraron los captores dentro de un recorrido ni la Visual de hipopotasemia con capturas (sí con los jueces).

## Para el usuario
- Nada que decidir. Para verlo: Nefrología → Fisiología → Hiperpotasemia → Visual; prueba «solo calcio» y corre el reloj.

## Visto de paso (no tocado)
- El K⁺ del modelo tiene suelo en 3,5 (la diálisis lo deja justo ahí); ahora se avisa, pero el suelo sigue.
- La ficha no dice si repetir el calcio; el simulador no lo sugiere (hueco de fuente).

## Propuestas sobre las reglas
- En simuladores con «revisión por objetivos», la prueba del modelo debe incluir un recorrido incompleto (p. ej. solo
  la primera medida) y un recorrido correcto: el fallo grave (un instante contaba como objetivo cumplido) solo se veía así.

## Gasto
Total 1,7 M equivalentes. Constructor (sonnet) 800 k (46 %, 39 herramientas en 3 vueltas); profesor (opus) 406 k
(23 %); director 364 k (21 %); auditor (sonnet) 180 k (10 %). El gasto se fue en 3 vueltas del constructor por un
criterio mal pensado (cuándo cuenta el ECG como protegido). Ahorro: decidir en el encargo el criterio de cada objetivo
(qué estado, durante cuánto tiempo y con qué fuente) antes de construir.
