# 2026-10-30 · radio-fichas

**Resultado:** fusionada por el Consejo (PR: https://github.com/alvariitoSW/fiebres-neutropenias/pull/62; acta `autonomo/consejo/2026-10-30-radio-fichas.md`)
**Vueltas:** 2 (construcción + arreglos) y un arreglo de una línea del director · **Jueces:** pruebas ✓ · móvil ✓ (390/360) · auditoría ✓ (graves arreglados)

## Qué se hizo
- Dos cuadernos nuevos en Radiología · PIF: **Tórax de UCI** (T1 Neumotórax y derrame, T2 Patrones y edema, T3
  Introducción a la TC) y **Neuro urgente** (N1 Ictus, ¿isquémico o hemorrágico?, N2 HTIC y hernias con esquema propio).
- Cada ficha abre con carril de 30 s (idea, cifras con página, figura real de Marino o del Manual UMI); 3 tarjetas Sí/No;
  41 preguntas (23 + 18) con un caso de 7 pasos por cuaderno (giro, «encuentra el error», «piensa antes», «Lo que te llevas»).
- Fuentes: Marino (caps. 1-4, 18, 22-30, 47, apéndice 2), Libro Azul VIII, Manual UMI; los huecos (surco profundo,
  consolidación, Hounsfield y ventanas, signos precoces y ASPECTS, tipos de hernia), StatPearls por sección. Ninguna
  cifra de Radiology Assistant ni de NavRad.
- Revisión del encargo (Explore): 7 avisos, resueltos antes de construir (cableado, prefijos de ids, caso según §8,
  repaso por cuaderno, fuentes de los huecos, T2+T3 juntas, prueba propia).
- `index.js` de Radiología tolera un cuaderno sin registrar (el usuario vio la rama rota por eso; arreglado).
- De paso, a petición del usuario: B-051 apuntada en la bitácora y **B-051a aprobada** (`motor-radio`, sesión aparte).

## Qué no se pudo hacer o leer
- El Manual UMI es escaneado: sus páginas se leyeron como imagen (lector) y no se releyeron en los arreglos.
- No se re-auditó a ciegas tras los arreglos (Consejo: aceptado).

## Para el usuario
- Mirar en el móvil: PIF → Radiología → Tórax de UCI y Neuro urgente; un caso entero desde «Repasar».

## Visto de paso (no tocado)
- Los «encuentra el error» del caso de tórax (`pifradio-t1-caso2`, `t2/t3-caso6`) anuncian «hay solo uno»; §8 pide 0-2.
- StatPearls «Brain Herniation» por `/books/NBK542246/` da captcha; por `/sites/books/` abre. La app cita la primera.
- El Libro Azul no tiene fichas en la app: sus citas van al PDF sin «Ver en el texto».
- Pendiente del temario: semiología de la Rx de tórax y técnicas UMI (drenaje) siguen «pendiente» en el menú.

## Propuestas sobre las reglas
- Cuando una tarea depende de una PR sin fusionar y añade vistas a un módulo, el andamiaje debe arrancar aunque la vista
  no esté registrada (comprobar el arranque con la vista ausente antes de subir la rama): la rama se vio rota en el móvil.

## Vueltas
| Pieza | Vuelta | Nota mínima | Constructor | Pasos | Tokens | Qué falló |
|---|---|---|---|---|---|---|
| T1 | 0 | 9,0 | sonnet | 25 | 419 k | — |
| T2+T3 | 0 | 8,75 | sonnet | 32 | 511 k | paso 5 de T2 en muro; respuesta invertida en t3-q002 |
| N1 | 0 | 8,5 | sonnet | 31 | 492 k | paso 7 vacío, preguntas de definición |
| N2 | 0 | 8,75 | sonnet | 28 | 537 k | conductas sin fuente en la tarjeta |
| Arreglos tórax | 1 | 8,5 → 8,75 | sonnet | 15 | 173 k | caso 3 sin base en la ficha (arreglo del director) |
| Arreglos neuro | 1 | 9,0 | sonnet | 27 | 344 k | — |

## Gasto
Total **7,3 M** (`gasto.mjs --clave radio-fichas`). Por papel: constructor sonnet 2,5 M (34 %, 6) · director 2,4 M
(33 %) · lector-fuente 975 k (13 %) · auditor 661 k (2) · profesor fable 567 k (2) · Explore 246 k (2).
Los 3 que más: director, lector de fuente (66 pasos), constructor N2. Dónde: el director se alargó con la espera a la
PR #42, el arreglo de la rama rota y la B-051 (apuntar, aprobar, sesión nueva); el lector leyó 5 temas de 6 libros.
Próxima vez: B-051 en su propia sesión de bitácora; lector partido por cuaderno si pasa de 50 pasos.

## Cuentas
Presupuesto 9,0 M → Hacienda 7,5 M (sin verificador ni revisor; juicio rápido único; T2+T3 juntas) · gastado 7,3 M ·
desvío **−3 %** · tope de la tarea 9 M: sobra 1,7 M.
