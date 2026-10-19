# 2026-10-19 · formas-iones, vuelta 1 (inventario y lámina)

**Resultado:** vuelta 1 (lámina) aprobada por el usuario («la tabla de formas me vale, aplícala»); vuelta 2 aplicada, en revisión en la PR.
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

## Vuelta 2 · aplicar (19/10)
- Tabla `js/data/formas-iones.js` + dibujo común `js/core/particulas.js`. Aplicada en nefrona viva (túbulo, célula,
  barrera), glomérulo, filtro TRR, nefronas que quedan y potasio (3 archivos). Leyenda nueva en glomérulo, nefronas
  que quedan y potasio. Maquetas v2 ajustadas en `auto/marino-mapa`.
- Error de la nefrona arreglado (también en `reset()`): reproducido antes y comprobado después a 390 y 360 px.
- **Jueces** ✅ con 7 fichas (`fisio-regulacion`, `fisio-tubular`, `fisio-hiperpotasemia`, `fisio-hipopotasemia`,
  `erc-pa-raas`, `erc-acidosis-k`, `trr-anticoagulacion`): sin desbordar, sin ids repetidos, sin errores, quiz y
  caché bien. Modelos abiertos en Visual a 390 y 360 px: 0 errores.
- Decisión del constructor: el citrato que se infunde en el filtro (antes óvalo lila) es el anillo ámbar vacío.

## Visto de paso (vuelta 2), sin tocar
- 2 px de desborde a 360 px en «Nefronas que quedan» (vista Visual de `erc-acidosis-k`): la etiqueta «fisiología
  general» de un medidor (`.nv-medidor-nombre` no parte línea). Ya pasaba antes. Los jueces no lo ven porque abren la
  ficha en Texto. **Propuesta de regla**: que los jueces abran también la vista Visual.
- Maqueta del agua: los osmolitos de la neurona son círculos ámbar, como la albúmina; solo los distingue el color.
- Colores sueltos que no son partículas (rótulos, renina, dializado `#8fb8d8`, gotas del gotero): se quedan.
