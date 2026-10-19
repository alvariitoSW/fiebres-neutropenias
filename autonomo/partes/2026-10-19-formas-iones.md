# 2026-10-19 · formas-iones, vuelta 1 (inventario y lámina)

**Resultado:** en curso, esperando que el usuario mire la lámina. La app no se ha tocado.
Lámina: https://claude.ai/artifact/U5DbmWSEDTBVAbZiqFjuLP (`autonomo/maquetas/formas-iones.html` y sus capturas).

## Qué se hizo
- Inventario de forma y color de cada partícula en los 7 modelos vivos: nefrona viva (túbulo y célula), glomérulo,
  filtro de la TRR, nefronas que quedan, potasio, y las maquetas v2 de agua y ácido-base. Archivo y línea en la
  lámina.
- Tabla única propuesta, solo con tokens, comprobada modelo a modelo: ninguna pareja que sale junta comparte forma,
  y ninguna se distingue solo por color.
- Cambio estimado: ~105 líneas en los modelos de la app y ~30 en las maquetas. Tabla nueva en
  `js/data/formas-iones.js` y dibujo común en `js/core/`. Ninguna cifra, ritmo ni mando cambia.

## Para el usuario (decidir)
Propuestas del director, que se aplican salvo que diga otra cosa:
1. Glucosa = copo de 6 radios (el «cristal» cuadrado se confunde con el K⁺).
2. Ringer y Plasma-Lyte = triángulo, porque su lactato se convierte en HCO₃⁻ (`mar-ringer`).
3. Salino al 3 % y al 7,5 % = rombo con 1 y 2 halos.
4. Solo colores de la paleta, con borde oscuro.
5. Potasio: forma de cuadrado; el color sigue diciendo dónde está.
6. HCO₃⁻ en verde salvia.

## Visto de paso
- **Error en `nefrona-viva.js` (≈1018, 1034-1044)**: un botón `[data-nefrona-viva]` pulsado con la vista de célula
  abierta llama a `svgCelula(null)` («Cannot read properties of undefined (reading 'epitelio')»). Se arregla en esta
  tarea, porque se toca el mismo archivo.
- En la propia nefrona, el túbulo y la célula no coinciden (H⁺, Ca²⁺, fosfato). Entra en esta tarea.
- El glomérulo, las nefronas que quedan y el potasio no tienen leyenda de partículas. Entra en esta tarea.
- `js/modules/libros/visual-marino-piezas-45-53.js:174`: el salicilato ionizado y el no ionizado se distinguen solo
  por el color (CLAUDE §5). Fuera de esta tarea: va a la bitácora.
