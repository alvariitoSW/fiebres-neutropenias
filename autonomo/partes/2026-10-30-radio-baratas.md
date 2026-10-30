# 2026-10-30 · radio-baratas (día 1 de 3)

**Resultado:** día 1 en revisión (PR: https://github.com/alvariitoSW/fiebres-neutropenias/pull/39) · días 2-3 pendientes (tope diario)
**Vueltas:** 1 · **Jueces:** pruebas ✓ (`jueces.mjs` entero + `--ficha` de las 4 pestañas + `pif-radio.mjs`) · móvil ✓ (390/360) · auditoría ✓ (0 graves)

## Qué se hizo
- Apartado nuevo **Radiología · PIF** (`js/modules/pif-radio/`): la rotación «Radiología — sección de tórax» pasa a
  construida y se abre desde el PIF. Menú con la bibliografía de The Radiology Assistant (`f0-ra-biblio`: solo las 6
  URLs del borrador, sin texto ni figuras de RA) y los demás objetivos como pendientes, con enlace a lo que ya hay.
- Cuaderno **Placa portátil de UCI**: «Lee la placa de dentro afuera» (guion propio de la app, dicho así; fig. 2.6 de
  Marino) y 3 tarjetas Sí/No: punta del tubo (págs. 18-19 de caps. 27-30), punta de la vía (págs. 36-37 de caps. 1-4;
  la eco solo sin placa) y sonda en el estómago (págs. 27-29 de caps. 48-51). Cada final, con su página y «Ver en el texto».
- 15 preguntas (11 + caso de 4 con giro y «Lo que te llevas»), formato de test actual con el estilo de REGLAS §8.
- Revisión del encargo (Explore): 4 graves corregidos antes de construir (cableado, fig. 28.2 de Radiopaedia fuera,
  sin «simetría» en el tubo, un criterio por paso en la vía).

## Qué no se pudo hacer o leer
- Días 2 y 3, por el tope diario (hoy ya trabajan el `b3`, la Reforma y otras sesiones): **día 2** rótulos SVG sobre las
  Rx/TC de Merino Neumología + «TC de cráneo en 5 preguntas» con «¿qué no puede ver esta IA?» (≈2,5-3 M); **día 3**
  «Lee esta placa» sobre `ecg-lector.js` (≈2-3 M).
- No se abrieron hoy las URLs de RA (sin web en los agentes): son las del informe del 23/10.

## Para el usuario
- Mirar en el móvil la PR #39 y decir si sigue el día 2.

## Visto de paso (no tocado)
- Las fichas de origen enlazan al inicio del capítulo, no a la página del criterio: tubo `#page=17` (es la 18) en
  `merino-neumologia.html`; vía `#page=23` (es la 36) en `marino-fundamentos.html`. Arreglo de 2 enlaces, directo a `main`.
- El Sí/No común (`core/wizard.js`) pinta todo el resultado en negrita.
- `.hl-azul` y `.hl-rojo` se ven casi iguales (dorado) en las cajas «La idea» (CSS global).
- La fig. 28.2 de Merino Neumología es de Radiopaedia (crédito en su pie): el borrador la contaba como propia.

## Propuestas sobre las reglas
- Al presupuestar una «especialidad nueva con submenú», contar el cableado (6 archivos): la revisión del encargo lo cazó.

## Vueltas
| Pieza | Vuelta | Nota mínima | Constructor | Pasos | Tokens | Qué falló |
|---|---|---|---|---|---|---|
| Cuaderno placa | 0 | 7,5 (vía: la eco rescataba una placa negativa) | sonnet | 41 | ≈0,8 M | orden del tubo, vía, distractores obvios, caso sin giro |
| Cuaderno placa | 1 | 8,75 (todo ≥8,75; sonda 9,0) | sonnet (el mismo, <60 pasos) | 6 | ≈0,15 M | — |

## Gasto
Total **1,9 M** (`gasto.mjs --clave radio-baratas`). Por papel: constructor sonnet 945 k (51 %) · director 331 k (18 %) ·
profesor fable 296 k (16 %, 2) · Explore 161 k · auditor 135 k. Los 3 que más: constructor, director, profesor juicio.
Dónde: el constructor cargó el cableado del módulo y leyó 3 PDF para comprobar páginas; bien gastado. Próxima vez: igual.

## Cuentas
Presupuesto día 1: 3,2 M (Hacienda: sin lector-fuente, verificador ni revisor; juicio rápido; días 2-3 fuera) ·
gastado 1,9 M · desvío **−41 %** (una sola vuelta corta; el constructor reanudado en vez de uno nuevo). Tarea suelta
del carril 2 (≈7,5-10 M en total): quedan ≈5,6-8 M para los días 2-3.
