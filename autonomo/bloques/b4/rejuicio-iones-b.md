# Rejuicio · maqueta B «Lo que ves y lo que hay» (iones vivos, b4, vuelta 2) · profesor, 30/10/2026

Base (REGLAS §4.8 R8): `salida-b2.txt` del programa `iones-b.mjs` (TODO EN VERDE a 390 y 360, sin errores de consola), 5 capturas a 390 (01, 07, 08, 10, 11) y las funciones que cambiaron (`leer`, `cita`, `vitales`, `deposito`, `figP`, `fin`, `guia.js`). Solo se re-puntúa lo que quedó por debajo de 9,5.

**Los 7 arreglos pedidos**
1. K⁺ con los concentrados ✅ `leer()` usa `P.kPorUnidad` (0/8/16 → 4,0 · 4,18 · 4,36); el caso ya no miente (paso 3: 5,83 → 5,94); el no-op de `sl()` desapareció.
2. Guía por paciente ✅ `guia.js`: 4 pasos por preset, cada uno enciende 1-3 zonas del SVG (`.foco`, marco dorado discontinuo, visto en 08), con cita doble, origen y botón «Hazlo» que ejecuta el mando. ⚠ La caja `#guia` está debajo de los mandos: al leer el paso, el dibujo con su foco queda fuera de pantalla (hay que subir para verlo).
3. Cita doble ✅ `cita()`: «PDF p. N · p. N · Ver en la ficha» (`data-resaltar="#${fichaDe(c)}"`); programa: 3 citas a la vista, 0 sin doble botón; también en la guía y en «Lo que te llevas».
4. Constantes por paciente ✅ `PRESETS[].vit` y `vitales()`: Valentín 98/60 · 110 en el monitor; K⁺ ≥6 aviso (Adela 6,6), ≥7 sello con PA 90/54 · FC 46 y ClK apagado.
5. Partículas que entran ✅ `entran()`: 6 K⁺ cruzan de la banda «fuera» a «dentro» con insulina (10); `figP()` ya es Suero → Célula con partículas (11). ⚠ Las partículas de K⁺ arrancan encima del rótulo «Fuera de la célula · 2 % (el suero)» y lo tapan («F■era d■la cé■la»). ❌ En `deposito('p')` la célula **pierde** partículas con insulina (`40 − ins·6` llenas, `ins·6` huecas) cuando el mecanismo es el contrario (E p. 49: la insulina lo mete en la célula); la banda «Plasma» está vacía.
6. «Lo que te llevas» ✅ `fin()` + `LLEVAS`: 2-3 frases con página y cita doble al cerrar apuesta, error y caso (07).
7. CSS y topes ✅ `.rot` 10,5 px, leyenda con `gap`, `.mon-fila` con `flex-wrap` (el monitor del caso ya no se parte feo), `Math.max(0, po4)`, sello «no fisiológica» con K⁺ <1,5 (Rufino extremo 0,32 → sello y mandos apagados). ⚠ El monitor sigue mostrando «0,32»: el sello lo declara imposible, pero la cifra se ve.

| Rúbrica §7 (solo lo que estaba <9,5) | Antes | Ahora | Por qué |
|---|---|---|---|
| 1 Primera vista | 9,0 | 9,0 | Sin cambio pedido; la nota «Pendiente: onda U…» del monitor empuja el dibujo (01). |
| 3 Resaltado | 8,75 | 9,0 | Los focos de la guía destacan la zona que toca; en reposo «98 %» y «2 %» siguen pesando igual que el resto. |
| 4 Lo que enseña se ve | 9,0 | 9,25 | Fosfato Suero → Célula visible; el depósito de fosfato dibuja el mecanismo al revés (arreglo 5). |
| 5 Interactivo que enseña | 8,5 | 9,25 | Concentrados mueven el K⁺, «Hazlo» en la guía, partículas animadas; resta lo del fosfato. |
| 7 Móvil | 8,75 | 9,25 | Letra y leyenda bien; partículas sobre el rótulo y guía lejos del dibujo. |
| 9 Cita lleva a la app | 8,0 | 9,5 | Doble botón en todas las citas. |
| 10 Explicación guiada | 7,5 | 9,0 | 4 pasos con foco y acción por paciente; falta que paso y dibujo compartan pantalla. |
| 11 Fuentes en lista | 9,0 | 9,25 | «Lo que te llevas» con página por frase. |
| 12 Megaproyecto | 8,5 | 8,5 | Sigue sin mapa de crecimiento (no estaba en los 7 arreglos; **por debajo de 8,75, obliga**). |

**Educación**: (1) mecanismo visible **9,25** (K⁺ entra en la célula, fosfato cae; el depósito de fosfato contradice) · (2) se entiende a 390 **9,25** · (3) apuesta, error y caso **9,5** (completos, con giro y «Lo que te llevas»).

**Media nueva**: §7 ≈ **9,2** (antes 8,9); Educación 9,33. No llega a 9,5; todo ≥8,75 salvo §7.12.

**Vuelta corta (≤15 pasos, cabe entera)**
- `dibujo.js` `deposito()` rama fosfato: con insulina la célula gana partículas (`40 + ins·3`, 0 huecas) y la banda «Plasma» las pierde (huecas); sube §7.4, §7.5 y Educación 1.
- `pagina.js` (y el HTML de la maqueta): colocar `#guia` justo debajo de `#ion-svg` (o pintar el paso en el dock, bajo la frase viva) para que foco y texto se vean a la vez; sube §7.10 a 9,5 y §7.7.
- `dibujo.js` `entran('k')` / `deposito('k')`: arrancar las partículas a la derecha del rótulo (x ≥ x+150) o acortar el rótulo a «Fuera · 2 % (suero)»; sube §7.7.
- `datos.js` `CRECIMIENTO` + plegable «Lo que crecerá» en `pagina.js` (Nefrología: potasio vivo e hiperpotasemia; Libro Azul: vías urinarias; Manual UMI: iones; ECG de hipoK pendiente); sube §7.12 a ≥9.
- `dibujo.js` `deposito('k')`: «98 %» y «2 %» en `.gran` pequeño u oro (`fill: var(--oro)`); sube §7.3.

**Bitácora**: ritmo vivo con onda U, T plana y QT largo (declarado pendiente); monitor que no enseñe cifras bajo 1,5 (pintar «<1,5» con el sello); mover la nota «Pendiente…» del monitor a un plegable para que el dibujo entre en la primera pantalla.
