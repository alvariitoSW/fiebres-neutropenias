# Juicio rápido · maqueta B «Lo que ves y lo que hay» (iones vivos, b4, vuelta 1) · profesor, 30/10/2026

Base: `node autonomo/bloques/b4/herramientas/iones-b.mjs` (TODO EN VERDE a 390 y 360: sin desborde, rótulos ≥9,1 px, sin errores de consola) + 5 capturas (01, 02, 05, 06, 07 a 390) + código de `autonomo/maquetas/b4-iones-b/` + `pdftotext` de E p. 19, 23, 32, 39, 44, 45, 49.

| Rúbrica §7 | Nota | Por qué (en una línea) |
|---|---|---|
| 1 Primera vista | 9,0 | ✅ Monitor + depósito + «lo que ve el lab» caben arriba; la Fig. 36.2 viva exige un scroll. |
| 2 Párrafos | 9,5 | ✅ Nada de muros: fuentes, notas y «para profundizar» plegados; frase viva de una línea. |
| 3 Resaltado | 8,75 | ✅ Cifra del lab en oro y sellos en rojo; ❌ en el SVG todo el texto pesa igual («98 %», «0,3 %» no destacan). |
| 4 Lo que enseña se ve | 9,0 | ✅ Iceberg con partículas huecas (déficit), ventana del lab, Fig. 36.2 y 38.1 vivas; ❌ el fosfato son tres líneas de texto y una barra; hipoK del ECG «pendiente» (permitido por el encargo). |
| 5 Interactivo que enseña | 8,5 | ✅ Cada mando cambia la escena con frase viva y origen; ❌ los concentrados dicen «2-3 mEq de K⁺» y el K⁺ no se mueve (ver arreglo 1). |
| 7 Móvil | 8,75 | ✅ Sin desborde ni rótulos <8 px; ⚠ letra del SVG ~10 px, leyenda de partículas apretada («■K⁺○Mg²⁺●Ca²⁺▼Fosfato»), la fila del monitor se parte en el caso. |
| 8 Modelo grande | 9,25 | ✅ Un modelo para 4 fichas (K, Mg, Ca, P); reutiliza motores (abajo). |
| 9 Cita lleva a la app | 8,0 | ❌ Cada cita abre solo el PDF («Ver en el texto · p.»); «Ver en la ficha» solo en la lista plegada, uno por ion. |
| 10 Explicación guiada por estado | 7,5 | ❌ Los presets (Damián, Rufino, Valentín, Adela) tienen una frase, no 3-5 pasos que señalen el dibujo. |
| 11 Por concepto, fuentes en lista | 9,0 | ✅ `FUENTES` y `NOTAS` en lista con página; discrepancias (65 %/50 %, 4,5/4,3) sin elegir. |
| 12 Megaproyecto | 8,5 | ⚠ Sin mapa de crecimiento escrito (qué añadirán Libro Azul, Nefrología, Manual UMI). |
| 6 y 13 | — | No aplican a una maqueta de modelo (no es ficha de cuaderno). |

**Educación**: (1) ¿se ve el mecanismo? **8,75** (el «número que engaña» sí; la entrada de K⁺ a la célula con insulina solo se ve en la cifra, el depósito de K⁺ no mueve partículas; el fosfato sí las pierde) · (2) ¿se entiende a 390? **9,0** · (3) ¿admite apuesta, error y caso? **9,25** (los tres completos, cada opción falsa dice qué le pasa al paciente, el caso tiene giro en el paso 3; falta «Lo que te llevas»: termina en «Hecho.»).

**Motores de la app**: ✅ `MOTOR.crear/voltaje` + `aplicarK` del ritmo vivo (sin `pagina.js`), ✅ `svgParticula`/`leyendaParticulas` (`js/core/particulas.js`), ✅ `crearTope` (`js/core/tope.js`) con sello, deshabilitado y cita, ✅ `seguirFrase`. Nada copiado.

**Pacientes y cifras** (comprobado en E): ClK 20 mEq/h y cava (p. 23) ✅ · Mg >10 bloqueo, >13 parada (p. 39) ✅ · Ca <0,9 y <0,65 mmol/L, gluconato 9 / cloruro 27 mg/mL, bolo 200 mg = 22 mL (p. 44-45) ✅ · fosfato <1 mg/dL (p. 49) ✅ · 50 mEq/kg (p. 19) y 2.000 mEq de Mg (p. 32) ✅. Apuesta (Damián 3,5→3,0; fosfato 0,9 con sello FR 28) y error (albúmina 2,0 → total 7,4, iónico 4,6) cuadran con el modelo ✅.
- ❌ **Mecanismo que miente** (REGLAS §1.12): paso 3 del caso dice «el K⁺ del suero sube» y el K⁺ queda en 5,55 (salida del programa). `P.kPorUnidad` está definido en `datos.js` pero `leer()` no lo usa; en `pagina.js` `sl()` tiene `if (k === 'units') s.dK = s.dK` (no hace nada).
- ❌ **Paciente incoherente**: el enunciado de Valentín dice PA 98/60 y el monitor marca PA 118/72 · FC 75 (`vitales()` solo reacciona a sellos). K⁺ 8,0 tras 8 h de ClK con constantes normales (solo sello «no fisiológica»).
- ⚠ `leer()`: fosfato puede bajar de 0 por API (3,5 − 0,9×4); K⁺ 0,8 posible con Rufino + pH 7,6 + 3 insulinas sin sello. Ninguna cifra sin origen: lo ilustrativo está declarado en `NOTAS` y en cada frase. Sin graves de fuente.

**Veredicto**: media ≈ 8,9; **no llega a la meta (9,5) y dos puntos quedan por debajo de 8,75** (§7.9 citas y §7.10 explicación guiada). Como opción para que el Consejo elija, la idea pedagógica es la más clara de las tres («el número del suero engaña») y la base técnica es sólida.

**Arreglos para la vuelta 2** (por lo que más sube la nota):
1. `modelo.js` `leer()`: K⁺ con los concentrados (`curvaK(s.dK + P.kPorUnidad * s.units)`); quitar el no-op de `sl()` en `pagina.js`. Sube §7.5 y Educación 1, y el caso deja de mentir.
2. Nuevo `b4-iones-b/guia.js` (≤100 líneas): por preset, 3-5 pasos que resalten en `#ion-svg` (clase `.foco` en banda o ventana) con «Ver en la ficha». Sube §7.10 de 7,5 a ≥9.
3. `pagina.js` `cita()`: doble botón «Ver en la ficha» (`data-resaltar="#${FICHA[ion]}"`) + «PDF p. N». Sube §7.9.
4. `pagina.js` `vitales()` y `datos.js` `PRESETS`: PA/FC por paciente (Valentín 98/60 · 110) y aviso de K⁺ ≥7 sin sello.
5. `dibujo.js` `deposito('k')`: con `s.ins`, partículas que pasan de la banda «fuera» a «dentro»; `figP()`: misma mecánica en vez de tres líneas de texto. Sube §7.4 y Educación 1.
6. `pruebas.js` `fin()`: «Lo que te llevas» (una frase con página) al cerrar apuesta, error y caso.
7. `estilo.css`: `.rot` a 10,5 px, `gap` en la leyenda de partículas; `#monitor .mon-fila` con `flex-wrap`. `modelo.js`: `Math.max(0, po4)` y sello «no fisiológica» con K⁺ <1,5.

**No comprobado / riesgo**: las filas de la Tabla 37.1 (53/27/19/0,7/0,3 %) y el rango 4,6-5,0 mg/dL de la Tabla 38.1 (tablas en imagen; el texto de p. 32 confirma «algo más de la mitad en hueso, <1 % en plasma» y 2.000 mEq); el resalte `data-resaltar` no tiene manejador en la maqueta (lo da la app); no vi la escena de Mg²⁺ ni los topes de ClK/Mg con los ojos (solo por el programa de prueba).
