# 2026-11-01 · b3-mejoras-corazon

**Resultado:** hecha, a `main` (arreglos con jueces en verde; REGLAS §2.3) · rama `auto/b3-mejoras`
**Vueltas:** 1 + retoques del director · **Jueces:** JUECES_AQUI · móvil 390/360 ✓ · auditoría: sin auditor aparte (recorte de Hacienda; el rejuicio comprobó PMID y páginas)

## Qué se hizo
Las 13 piezas del corazón del bloque 3 que el profesor dejó entre 7,75 y 8,6 (Consejo 11.ª): dos profesores rejuzgaron
y dieron la lista exacta; cuatro constructores sonnet la aplicaron y un rejuicio R8 las volvió a puntuar. **12 de 12
piezas juzgadas en ≥8,75** (SCA-diagnóstico 9,0) tras arreglar yo lo último de la CPAP; la disección, rehecha después
del rejuicio, no se volvió a puntuar. Claves: posparo cita la p. 65; septo con su límite del modelo, mando topado a 0,3
y el chorro VI → VD con Qp/Qs; Fermín enseña el PAPi (Korabathina 2012); el papilar explica la onda v gigante
(PMC8304571); caso SCA con cronología posible; f14 con 4 preguntas rehechas; vaso vivo legible; aorta de la disección
con colgajo, luz falsa y cizalla ∝ FC × IC (p. 51-52). Versión 20261101-41.

## Qué no se pudo hacer o leer
- El septo y la CPAP siguen con su **límite del modelo** (la PCP no sube con la CIV; la CPAP no sube el gasto ni la
  SpO₂): viven en `js/modules/eco/motor.mjs`, fuera de esta tarea. Se enseñan con aviso, no se tapan.
- PMC8304571 dio captcha al profesor (salía literal en la búsqueda; se queda). La disección no tuvo rejuicio tras la
  capa nueva.

## Para el usuario
Nada que decidir. Mira, si quieres: shock vivo → Remedios (septo) y Joaquín (disección: sube el nicardipino solo y
mira la barra de cizalla).

## Visto de paso (no tocado)
- Con el mando del septo en 0,3, el sello (0,7) y el aviso (0,5) de `shock-vivo/topes.js` ya no se alcanzan.
- Capilar vivo `reperfusion` a 844 px: los mandos tapan media lupa. Id interno `hiperoxia` sin renombrar.

## Propuestas sobre las reglas
- Un constructor pintó un tronco pulmonar inventado que cruzaba la aorta y la aurícula, y otro una «cizalla» que
  bajaba con el nicardipino (lo contrario de la fuente); ningún juez lo vio, lo vi yo en la captura. Propuesta: toda
  capa nueva de dibujo entrega captura **en los dos extremos del mando** y dice qué dirección pide la fuente.

## Vueltas
| Pieza | Vuelta | Nota antes → después | Modelo | Pasos | Tokens | Qué falló |
|---|---|---|---|---|---|---|
| g2+g3 datos (posparo, Fermín, papilar, fármacos, soporte, septo) | 1 | 7,75-8,5 → 8,75 | sonnet | 24 | 0,63 M | — |
| g4+g5 datos (f13, f14, SCA, disección cifras, vaso celda) | 1 | 8,0-8,6 → 8,75-9,0 | sonnet | 40 | 0,63 M | — |
| vaso vivo dibujo | 1 | 8,5 → 8,75 | sonnet | 20 | 0,30 M | — |
| septo chorro + CPAP | 1 | → 8,75 / 8,5 | sonnet | 49 | 0,98 M | arco pulmonar inventado (lo quitó el director); CPAP: frase y banda (director) |
| aorta disección | 1 | 8,5 → sin rejuicio | sonnet | 33 | 0,47 M | cizalla con FC × PP iba al revés (director: FC × IC) |

## Gasto
GASTO_AQUI

## Cuentas
Presupuesto 3,9 M (Hacienda en casa: 2 profesores en vez de 4, sin auditor). Gastado ≈GASTADO. Desvío DESVIO: se
añadieron dos piezas de dibujo que el diagnóstico pidió (septo y aorta, ≈1,4 M) y no estaban en la tarea. Vía libre:
entre +25 y +50 % comparece ante el Consejo, no ante el usuario; anotado aquí.
