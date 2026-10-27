# Juicio de la app · `ritmo-vivo` (el corazón eléctrico), b3 parada 2 — profesor, 27/10/2026

Base: `node autonomo/pruebas/ritmo-vivo.mjs` (352 ✅, 0 ❌, 390 y 360 px) + 9 capturas a 390 px (primera pantalla, FA con diltiazem y la bomba, WPW+FA con los frenos, lupa en grande, Explícame nodal, Mayéutica inicio, G1, respuesta fallada G2, final del caso de Teodoro). Comparado con la maqueta aprobada (8,5) y la lista R2 `lista-ritmo.md`.

## ¿Se perdió algo al pasar de la maqueta? No
✅ R1-R33 en la app tal cual (tachado + prueba): 25 estados sin FC 0 ni NaN, 22 guías con «Ver en la ficha» a ids que existen, todos los topes con su sello entero a 360 px, Lentos en «—». Mejor que la maqueta: el «FC 0» tras choque y el sello cortado están arreglados; `← VOLVER` a la ficha; clase `peligro` de los frenos WPW ya se aplica.
✅ Bomba de perfusión (FA + diltiazem): «DILTIAZEM / 0,25 mg/kg» dentro de la pantalla, legible, sin cortarse (`js/core/bomba.js`, medido: texto 50-105 px dentro de la pantalla 48-112 px).
✅ Rótulo de la mini-lupa: oculto en Mayéutica (`display:none`), vuelve en Explorar («El torniquete del nodo AV — Mira cómo la onda…»): no queda muda.

## Puntuación (meta 8,75 · mínimo 8)
| Criterio | Nota | Por qué |
|---|---|---|
| §7.1 Primera vista | 9 | Monitor con ECG generado, Fig. 1, frase viva y dock en la primera pantalla; cero texto antes de la figura. |
| §7.2 Párrafos | 8,75 | Guías en pasos de 1-2 frases; la explicación de la opción fallada son 2 párrafos cortos. |
| §7.3 Resaltado | 8,75 | Sello rojo, aviso amarillo, banda de peligro, pregunta en negrita; ni mucho ni nada. |
| §7.4 Se ve lo que enseña | 9,25 | Torniquete del nodo, atajo, célula con potencial, déficit de pulso en la muñeca: al nivel del capilar vivo. |
| §7.5 Interactivo que enseña | 8,5 | Cada mando deja frase viva con cita; ❌ los 3 frenos del WPW se distinguen solo por el borde naranja (CLAUDE §5: nunca solo color). |
| §7.6 Vista Visual | n/a | Modelo vivo (no es ficha). |
| §7.7 Móvil | **7,5** | ❌ El plano «Las dos lupas, en grande» (`position:fixed`) no se cierra con Escape, ni al pasar a Mayéutica, ni al cambiar de estado, ni con «← VOLVER»: queda pintado encima del menú de Libros (capturas 05/06 y `plano2.mjs`). |
| §7.8 Modelo grande | 9,5 | Un modelo, 4 fichas de Merino + hiperK de Nefrología, 21 estados. |
| §7.9 Citas → ficha | 9 | Todas con «Ver en la ficha» + PDF (prueba); ❌ los enlaces externos de las guías (`guia-org a`) salen en azul del navegador sobre fondo oscuro. |
| §7.10 Explicación guiada | 8,5 | 22 guías, 87 pasos, señal con marco punteado en la lupa (captura 06); baja por los enlaces azules. |
| §8 Recorrido completo y en orden | 9 | 10 preguntas G1-G3 + E1-E7 en orden; repaso devuelve solo lo fallado. |
| §8 Formatos permitidos | 9 | Test «piensa antes», destapa (E7, P4) y «encuentra el error» con 2 errores (P6). |
| §8 Dificultad | 8,5 | Distractores de la propia ficha (PR largo «por el rodeo», ACOD en FA valvular); la correcta es la más larga solo en G1 (1/9), posición repartida. |
| §8 Caso que evoluciona, giro, «Lo que te llevas» | 8,75 | Teodoro 6 pasos con día, giro de la PA a 84/50, llevas 3 frases, vuelta al corazón en FA + llenado malo; ❌ en «Lo que te llevas» el monitor sigue con «?» (nada que predecir ya). |

**Veredicto: no pasa (7,5 en Móvil).** Lo demás ≥8,5; con los 4 arreglos de abajo, todo ≥8,75.

## Arreglos (constructor sonnet, en orden)
1. **Cerrar el plano de las lupas** — `js/modules/libros/ritmo-vivo/pagina.js`: en `setModo()` (línea ~579) y en `ponerEstado()` llamar `planoLupas.cerrar()`; `js/core/plano-grande.js` `crearPlanoGrande()`: cerrar con `keydown` Escape y, al abrir, registrar un `cerrar` que `core/volver-ficha.js` / `index.js` del modelo dispare en «← VOLVER» (o cerrarlo en `index.js` línea 14 antes de `marcarVolver`). Verificar con `/tmp/claude-0/-home-user-fiebres-neutropenias/9ad60221-8fa3-555d-bf6d-c9cfdb8242b1/scratchpad/plano2.mjs` (todo debe dar «cerrado» salvo «tras abrir»).
2. **Enlaces de las guías** — `css/components.css` junto a `.guia-org` (línea 3372): `.guia-org a { color: var(--accent-yellow); }` (hoy azul por defecto, captura 06).
3. **Frenos WPW no solo por color** — `pagina.js` `tog()` (línea 199): cuando `extra` lleva `rtv-peligro`, anteponer «⚠ » al `small` («⚠ frena el nodo»).
4. **Cifras al acabar el caso** — `js/modules/libros/ritmo-vivo/mayeutica.js` `destapar()`: en el último paso (`q.ultimo`) o en el `fin` del motor llamar `d.taparTodo(false)` para que Teodoro (FC 104, déficit) se vea con «Lo que te llevas».

## No comprobado / riesgo
- Sello «nunca 360 J» de la TV solo se alcanza forzando el contador (la TV cede al 1.er choque): tope sin consecuencia visible en juego normal, ya así en la maqueta (R30 ⚠).
- Fig. 19.5 / 21.1 / 21.3-21.4 y las 6 láminas: solo por la prueba (se pintan, `naturalWidth>0`), no a ojo. 360 px: solo por la prueba y las capturas `-red` del tachado.
- Fidelidad de las cifras de las preguntas: del auditor, no de este juicio.
