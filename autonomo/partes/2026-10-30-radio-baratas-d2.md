# 2026-10-30 · radio-baratas (día 2 de 3)

**Resultado:** día 2 en revisión (PR en borrador, enlace en el tablero) · día 3 («Lee esta placa») pendiente, en sesión nueva
**Vueltas:** 1 · **Jueces:** `jueces.mjs` ✓ (`--ficha` radio-f5 y 3 pestañas de Merino) · `pif-radio.mjs` ✓ · `merino-rotulos.mjs` ✓ (6 figuras × 390/360) · auditoría ✓ (1 grave corregido) · profesor ✓ (A 9,0 · B 8,44)

## Qué se hizo
- **Rótulos sobre 6 Rx y TC de Merino Neumología** (22-1, 24-2, 24-3, 28-1, 28-5, 29-3): botón «Ver rótulos» (apagado al
  abrir: primero la foto limpia), punto y texto corto en su sitio, cada uno sacado del pie o del texto con su página
  (`#page=` nuevo en 5 pies). Pieza común nueva `js/core/figura-rotulos.js` (datos `js/data/merino-neumo-rotulos.js`;
  líneas en SVG sin capturar el toque, texto en HTML en %; el lightbox sigue abriendo, sin rótulos). Prueba
  `autonomo/pruebas/merino-rotulos.mjs`. **Fuera 28-2 y 28-7** (crédito de Radiopaedia: solo enlace, Consejo 30/10, 3.ª).
- **Ficha 5 «TC de cráneo en 5 preguntas»** en el cuaderno del PIF de Radiología: TC real de Marino (fig. 47.3) con
  rótulos del pie, árbol Sí/No (sangre → línea media/masa → cisternas → subaracnoidea → hipodensidad) con 6 finales,
  cada uno con página y «Ver en el texto» (Marino caps. 47, Libro Azul neuro págs. 51-52, Manual UMI: Marshall);
  «¿Qué no puede ver esta IA?» (NV-Reason-CT, lo deducido dicho como deducido). 12 preguntas (8 + caso de 4 con giro y
  «Lo que te llevas»).
- **Omitido por no estar en las fuentes de la app** (dicho en pantalla): epidural lenticular frente a subdural en
  semiluna, «una TC normal precoz no descarta un ictus» y el esquema del cráneo. Se buscó en Marino 45-47, Libro Azul
  neuro y Manual UMI.
- Revisión del encargo (Explore): 3 graves antes de construir (28-7 también es de Radiopaedia; árbol sin definir;
  el SVG bloqueaba el lightbox).
- De paso, para que el juez de nombres internos pase en la pestaña tocada: «diseño elongado» → «forma alargada».

## Qué no se pudo hacer o leer
- Día 3 («Lee esta placa»): va en otra sesión (Ahorro medido, punto 1).

## Para el usuario
- Mirar en el móvil la PR: Neumología → Merino → Vías aéreas artificiales (fig. 28.1, «Ver rótulos») y PIF → Radiología →
  Placa portátil de UCI → ficha 5 (recorrer el árbol y el caso de 4 preguntas en el quiz).
- Decidir si se añade fuente para epidural/subdural y para la TC normal precoz en el ictus (no hay en la app).

## Visto de paso (no tocado)
- 22-1 y 28-1 llevan rótulos en inglés impresos en la imagen; los nuestros quedan al lado.
- En la vista Visual de Merino, `visual-kit` copia la imagen sin los rótulos.
- El juez de nombres internos da falsos positivos con «diseño» en texto clínico.
- Una herramienta crea una carpeta `http:/` en la raíz del repo (borrada).
- Main y esta rama usaron a la vez la versión 20261030-13: conflicto en `index.html` al fusionar (resuelto con -15).

## Propuestas sobre las reglas
- Rótulos sobre figuras: el encargo debe pedir que el revisor del encargo mire el **crédito** de cada figura (la 28-7
  era de Radiopaedia y el encargo no lo vio; lo cazó la revisión).
- En un caso clínico con lateralidad (pupila, hemisferio), el profesor comprueba el lado: la vuelta 0 tenía la pupila
  contraria al hematoma.

## Vueltas
| Pieza | Vuelta | Nota mínima | Constructor | Pasos | Tokens | Qué falló |
|---|---|---|---|---|---|---|
| A · rótulos | 0 | 7,5 (3 rótulos fuera de sitio) | sonnet | 35 | 0,35 M | 22-1, 24-2, 29-3 |
| B · TC de cráneo | 0 | 6,5 (§7.4 sin imagen) | sonnet | 37 | ≈0,6 M | negrita entera, sin TC, 4 distractores, caso |
| A + B | 1 | 8,25 (A 9,0; B 8,44) | sonnet (el de B, <60 pasos) | 17 | ≈0,3 M | — (director: pupila sin lado, 3 muletillas) |

## Gasto
Total **2,3 M** (`gasto.mjs --clave radio-baratas`, esta sesión). Por papel: constructor sonnet 1,2 M (54 %, 2) ·
director 0,54 M (24 %) · profesor fable 0,19 M (2) · auditor 0,17 M · Explore 0,14 M. Los 3 que más: constructor B
(0,89 M: leyó 3 PDF para buscar fuentes de 5 pasos y luego la vuelta), director, constructor A. Próxima vez: dar al
constructor la lista de páginas ya buscada por la revisión del encargo.

## Cuentas
Presupuesto 3,3 M tras recortes (Hacienda aplicada por el director: A y B en paralelo, auditor acotado, rejuicio corto) ·
gastado 2,3 M · desvío **−30 %** (sin segunda vuelta). Tarea entera (≈7,5-10 M): días 1-2 = 4,2 M; quedan ≈3,3-5,8 M
para el día 3 (≈2-3 M).
