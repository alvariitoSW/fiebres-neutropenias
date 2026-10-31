# Juicio rápido · maqueta C «A pie de cama» (iones vivos, b4, vuelta 1) · profesor, 30/10/2026

Base: `node autonomo/bloques/b4/herramientas/iones-c.mjs` (TODO EN VERDE a 390 y 360: sin desborde, sin errores de consola; 10 topes disparan su sello; apuesta, error y caso se completan) + 7 capturas (01, 02, 03, 05, 06, 07, 08 a 390) + código de `autonomo/maquetas/b4-iones-c/` (por funciones) + `pdftotext` de E p. 19, 23, 25, 28, 37, 39, 45.

| Rúbrica §7 | Nota | Por qué (en una línea) |
|---|---|---|
| 1 Primera vista | 8,75 | ✅ Monitor con ECG real, chips de iones y gasometría caben en la primera pantalla; ❌ arriba no hay idea central (el aviso «para revisar» no cuenta) y los 4 pacientes en 2×2 empujan el monitor. |
| 2 Párrafos | 9,25 | ✅ Notas de 3-4 líneas bajo cada bomba; discrepancias, fuentes y «para profundizar» plegados; frase viva de una línea con página. |
| 3 Resaltado | 8,5 | ✅ Color por significado en chips y gasometría (verde/rojo/ámbar); ❌ Damián arranca con tres rojos a la vez (Ca²⁺ 1,14, Ca total, PO₄) y en las notas de las bombas nada resalta (20 mEq/h, 200 mg van en gris). |
| 4 Lo que enseña se ve | 8,0 | ✅ ECG del ritmo vivo, sello sobre el monitor, bombas dibujadas, Fig. 36.2 y 38.1 vivas; ❌ la célula está escondida tras la lupa y **dibuja el mecanismo al revés** (ver grave 2); el ECG de la hipoK es «pendiente» (permitido). |
| 5 Interactivo que enseña | 9,0 | ✅ Cada mando cambia cifras, ECG y frase viva con página; el calcio en la hiperK arregla el trazo (6,9 → «lee 4,9») sin tocar el K⁺; ❌ la FC nunca cambia y la PA solo con el Ca²⁺. |
| 7 Móvil | 8,5 | ✅ Sin desborde ni rótulos <8 px; ❌ cada botón de las bombas ocupa su línea (captura 05: columna vacía a la izquierda, 4 pantallas de scroll); el sello tapa el rótulo «pendiente» y el texto «Asistolia (trazo plano)». |
| 8 Modelo grande | 9,25 | ✅ Un modelo para K, Mg, Ca y P con 4 pacientes y monitor+bombas comunes (reutilizables por el shock vivo, el ritmo vivo). |
| 9 Cita lleva a la app | 7,5 | ❌ Todas las citas abren solo el PDF (`datos.js cita()`, `pagina.js frase()`); ningún «Ver en la ficha». |
| 10 Explicación guiada por estado | 7,0 | ❌ Cada paciente tiene una línea de resumen; ningún estado (Damián, Rufino, Valentín, Adela, cada tope) lleva 3-5 pasos que señalen el dibujo. |
| 11 Por concepto, fuentes en lista | 9,0 | ✅ `NOTAS`/`FUENTES` con página; 200-400 frente a Tabla 36.1, 4,5/4,3, 65 %/50 % sin elegir; lo ilustrativo declarado. |
| 12 Megaproyecto | 8,25 | ⚠ Estructura por estado y bombas comunes sirven; sin mapa de crecimiento escrito (Libro Azul, Manual UMI, Nefrología). |
| 6 y 13 | — | No aplican a una maqueta de modelo. |

**Educación**: (1) ¿se ve el mecanismo? **7,75** (lo que ves es la consecuencia —monitor, sello, bomba parada—, que es la idea de C; el *por qué* vive en la lupa, cerrada por defecto, y la lupa mueve las partículas al revés) · (2) ¿se entiende a 390? **8,75** (monitor y gasometría se leen de un vistazo; las bombas, demasiado largas) · (3) ¿admite apuesta, error y caso? **8,5** (✅ la apuesta oculta el K⁺ hasta que actúas: muy bien; ✅ error de 0-2 con «Pruébalo en la escena»; ✅ caso de 4 pasos con acción obligada y «Lo que te llevas»; ❌ el caso acaba con un paciente incoherente, ver grave 3).

**Motores de la app**: ✅ `MOTOR.crear/voltaje` + `aplicarK` del ritmo vivo (sin `pagina.js`) · ✅ `svgParticula`/`leyendaParticulas` (`js/core/particulas.js`) · ✅ `crearTope` (`js/core/tope.js`) con sello, aviso y deshabilitado · ✅ `bombaMini` (`js/core/bomba.js`) y `seguirFrase` (`js/core/frase-vista.js`). Nada copiado.

**Pacientes y cifras** (comprobado en E): ClK 20 mEq/h y cava (p. 23) ✅ · insulina ≥0,6 con pico 30-60 min (p. 28) ✅ · 6 g/3 h, 5 g/6 h, 5 g/12 h (p. 37) ✅ · Mg >10 bloqueo, >13 parada (p. 39) ✅ · Ca <0,65, bolo 200 mg, 1-2 mg/kg/h (p. 45) ✅ · 18 días y 2-3 mEq por concentrado (p. 25) ✅ · 200-400 / 100-200 (p. 19) ✅. HCO₃⁻ de Rufino (41) y Valentín (16) cuadran con su pH. Las cifras de ajuste (vidas medias, 0,6 de la nutrición, 150 mEq/mEq de Mg, 14 L) están rotuladas ilustrativas: ninguna cifra sin origen.
- ❌ **Grave 1 · paciente imposible**: con el sello «Asistolia» o «Parada» (Mg 14,9) el ECG es plano y el monitor sigue en FC 88 · PA 126/74 (`pagina.js cifras()`: `fc = p.fc`; `motor.js pa()` solo baja con el Ca²⁺). Igual Adela con K⁺ 8,8 tras 8 h de ClK 40: constantes intactas y sin sello hasta 9,0.
- ❌ **Grave 2 · mecanismo al revés**: `lupa.js pintarCelula()`: `dentroK = 22 - round(nutri*6 + ins*2)`: con insulina **bajan** las partículas de K⁺ dentro de la célula a la vez que bajan las del plasma. El texto dice «entran»; el dibujo las quita.
- ❌ **Grave 3 · caso incoherente** (REGLAS §1.12): en el paso 4 «el Mg²⁺ marca 1,3 y mejora» con el fosfato en 0,96, el sello rojo «Fosfato <1», FR 26 y la nutrición aún puesta (captura 08); el distractor «el Mg sérico ya es normal» choca con el 1,3 en rojo (normal 1,4-2,0). El Mg apenas cae (1,29 → 1,26): el «mira cómo vuelve a caer» no se ve.
- ⚠ Caso paso 3: la opción correcta «6 g en 3 h y seguir con 5 g cada 12 h» se salta el «5 g en 6 h» de la ficha (p. 37); el propio constructor lo marcó. La insulina baja el K⁺ de golpe (sin el pico a 30-60 min que anuncia la frase).

**Veredicto**: media §7 ≈ 8,55; **no llega a la meta (9,5) y tres puntos quedan por debajo de 8,75** (§7.4, §7.9, §7.10), con tres graves de paciente/mecanismo. La idea de C («los topes mandan, lo ves en el monitor») es la más cercana a la guardia y la apuesta con el K⁺ oculto es la mejor pieza didáctica de las tres maquetas; pero el mecanismo queda detrás de una lupa que hoy miente.

**Arreglos para la vuelta 2** (por lo que más sube la nota):
1. `lupa.js pintarCelula()`: `dentroK = 22 + round(nutri*6 + ins*2)` y abrir la lupa por defecto (o un panel «célula» fijo bajo el monitor). Sube §7.4 y Educación 1; quita el grave 2.
2. `pagina.js cifras()` + `motor.js`: función `vitales(s)` con FC y PA por estado (asistolia/parada → FC 0, PA «—»; K⁺ ≥7 → FC baja y sello «K⁺ ≥7: riesgo de parada», p. 25-26; Ca <0,9 ya está). Quita el grave 1.
3. `estudio.js PASOS[3]`: el paso 4 exige antes «Parar nutrición» y un segundo fosfato (`ok: () => !s.nutriOn && po4 ≥ 1 && min ≥ inicio+720`) y redacta «Mg²⁺ 1,3 (aún bajo) y mejora»; `PASOS[2]`: opción correcta «6 g en 3 h, luego 5 g en 6 h y 5 g cada 12 h». Quita el grave 3.
4. Nuevo `b4-iones-c/guia.js` (≤100 líneas): por paciente y por tope, 3-5 pasos que resalten (`.foco`) chip, bomba o sello, con «Ver en la ficha». Sube §7.10 de 7,0 a ≥9.
5. `datos.js cita()` y `pagina.js frase()`: doble enlace «Ver en la ficha» (`data-resaltar="#id"`) + «PDF p. N». Sube §7.9.
6. `base.css .bomba .fila`: botones en línea (`flex-wrap`, `gap`) y la figura de la bomba encima en <420 px; `#ecg-svg` ocultar `#ec-pend` mientras hay sello. Sube §7.7.
7. `pagina.js`: una frase de idea central bajo el título («El tubo mide el 2 %; el monitor te dice cuándo te pasas», p. 19) y pacientes en una fila de chips. Sube §7.1. `datos.js`: mapa de crecimiento en una lista. Sube §7.12.

**No comprobado / riesgo**: el estado de Mg²⁺ con riñón que falla y la perfusión de calcio (solo por el programa de prueba); la Tabla 38.5 (40 mmol para 61-80 kg) y la Tabla 36.1 (175 mEq a 3,0) están en imagen y no las releí; el «Correr» a 4 min/s no lo vi en movimiento; «el cloruro irrita la vena» (error 3) no lo busqué en E p. 26/45.
