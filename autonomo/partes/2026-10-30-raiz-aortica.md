# 2026-10-30 · raiz-aortica (B-041)

**Resultado:** en revisión (PR: https://github.com/alvariitoSW/fiebres-neutropenias/pull/46)
**Vueltas:** 1 · **Jueces:** pruebas ✓ · móvil ✓ · auditoría ✓ (0 graves) · Caché/Versión ✗ (carril 2: la sube quien fusiona)

## Qué se hizo
Sección «📏 Medidas» en Eco cardíaca con la ficha «Raíz aórtica». Lleva el paraesternal eje largo recreado y tocable
con los 4 niveles, cómo y cuándo medir (Lang 2015 pp. 28-32) y la Tabla 14. La calculadora de z tiene dos modos: la
Tabla 14 por nivel y sexo, y Devereux 2012 para los senos. Hay una nota de interpretación de z = 2, los umbrales de
ACC/AHA 2022 y la TC ante sospecha de síndrome aórtico agudo. Van 12 preguntas en el banco nuevo «Medidas».
`irAFicha` de la eco abre ahora fichas de la sección, así que el buscador y `jueces --ficha` funcionan.
Revisión del encargo (Explore): halló que `seccion()`, `irAFicha` y `PANEL_NAV` no admitían una ficha en la eco. Se encargó
el arreglo en la misma pieza.

Encargo rellenado por el director: `/tmp/plan-socialista/raiz-aortica/encargo.md`. Puntos clave:
- sección «Medidas»;
- ACC/AHA 2022 y Devereux 2012 entran porque están en abierto;
- la ESC 2024 no entra;
- la pregunta de guardia se reformula a «TC urgente», que es lo que dice ACC/AHA §7.2.

## Qué no se pudo hacer o leer
- ESC 2024 de enfermedad aórtica: no está en abierto (Europe PMC «Subscription required», OUP 403, escardio bloqueado por el proxy).
- ACC/AHA 2022: solo el HTML del manuscrito de autor, porque el PDF pide reCAPTCHA. Se cita por apartado, sin página.
- Roman 1989 y Hiratzka 2010 (orígenes de la Tabla 14): sin abrir.
- Lang no trae eco real de la raíz, así que R4 se cubre con el enlace al simulador en paraesternal eje largo.

## Para el usuario
- Mirar la ficha en el móvil (enlace de la PR).
- Decidir si «📏 Medidas» es el sitio para futuras fichas de medidas de Lang (VI, AI, VD).
- La versión (`version.mjs`) se sube al fusionar.

## Visto de paso (no tocado)
- La zona táctil de las líneas del SVG es fina; en el móvil se tocan mejor los botones de debajo.

## Propuestas sobre las reglas
- Una ficha nueva en una especialidad sin cuaderno (aquí la eco) necesita `irAFicha(view, panel, tab)`. Si no lo
  tiene, el buscador y `jueces --ficha` no la abren. Propuesta: que los jueces fallen si un `PANEL_NAV` apunta a una
  especialidad cuyo `irAFicha` ignora sus argumentos.

## Vueltas
| Pieza | Vuelta | Nota mínima del profesor | Constructor | Pasos | Equiv. | Qué falló |
|---|---|---|---|---|---|---|
| Ficha raíz | 0 | 6,5 (§7.4 figura: «un tubo») | sonnet | 27 | 449 k | SVG sin senos, valvas ni cavidades; tabla cortada a 390 |
| Ficha raíz | 1 | 8,5 (§7.1-7.3) · figura 9 | sonnet (nuevo, R5) | 28 | 335 k | — (pasa; meta 8,75 en lo repuntuado) |

## Gasto
Total **2,5 M** equivalentes (presupuesto 2,3 M; +9 %).
Por papel:
- constructor sonnet ×3: 901 k (36 %)
- director: 585 k (24 %)
- lector-fuente: 345 k (14 %)
- auditor: 281 k (11 %)
- profesor fable ×2: 232 k (9 %)
- Explore: 129 k (5 %)

Los que más gastaron: el constructor de la ficha (449 k), el lector de la fuente (345 k) y el constructor de la vuelta 1 (335 k).
Dónde se fue: el lector hizo muchos intentos de descarga de guías bloqueadas (ESC, PDF de ACC). La próxima vez: probar
primero Europe PMC con `isOpenAccess` y la página HTML de PMC, y no reintentar el PDF tras un reCAPTCHA. El SVG pidió una
vuelta entera: en el primer encargo de un corte de eco, dar la lista de estructuras (la que dio el profesor) desde el principio.

## Cuentas
- Presupuesto: 2,3 M. Recortes propios: sin verificador ni revisor, y un solo profesor de juicio rápido.
- Gastado: 2,5 M. Desvío: +9 % (la vuelta del SVG).
- Carril 2: lo fija Hacienda por delegación, en vía libre de gasto hasta el 02/11.
