# Lista R2 · lo que hace la maqueta del corazón eléctrico (`autonomo/maquetas/b3-ritmo.html` → `ritmo-vivo`)

Profesor, 27/10/2026 (parada 2, REGLAS §4.8 R2). El constructor tacha cada punto con una captura. Fuente de los topes:
`b3-ritmo/topes.js` y `autonomo/bloques/b3/limites-ritmo.md`; juicio previo `juicio-limites-ritmo.md` (8,5: FC 0 ~1 s tras choque y sello cortado a 360 px, pendientes).
Páginas = Marino caps. 19-21 (`docs/marino-2024-cardiac-disorders-caps18-21.pdf`) salvo que se diga otra cosa.

## A · Lo que queda fijo en pantalla (orden de arriba abajo, 390 px)
- R1 Monitor de cabecera: ECG II generado por el grafo (no dibujado), ART invasiva y, solo en parada, capnografía; botón **Pausa**; reloj mm:ss visible solo en parada (`mon-reloj`).
- R2 Cuatro cifras: **FC** (lpm; «FV»/«TV» si caos), **ART** (PAS/PAD; «sin pulso» si PAS−PAD<6 o parada sin compresiones), **Pulso** en la muñeca (en FA, «déficit N» si FC−pulso>3, Fig. 19.4 p. 22) y una 4.ª que cambia con el estado: QRS (corte 0,12 s, p. 18) · QTc (>0,5 s riesgo, p. 35; >0,44 «ojo») · ST derivación (umbral p. 41) · K⁺ (≥6,5 alarma, >5,5 «ojo»; Nefrología al día p. 21) · ETCO₂ en parada (sube de golpe con el RCE, Fig. 21.2). Cada cifra con su origen (`ficha`/`ilustrativo`).
- R3 Mini-lupa junto al monitor (nodo AV o célula según el ritmo) con «Ver en grande»; Fig. 1 corazón en corte (4 cámaras, anillo fibroso, SA, AV, His, ramas, Purkinje, vía accesoria, cicatriz, circuito del flúter, zona sin riego) con **Explícame este estado** (guía paso a paso `GUIAS`, 21 guías, una por estado + adenosina, faF, wpwFa, rcp, refractaria) y «⤢ Las dos lupas, en grande»; tocar una pieza da su nombre y texto con cita (`PIEZAS`, 15 piezas).
- R4 Banda de peligro (solo WPW+FA tras frenar el nodo), ficha del paciente del estado (Teodoro/Hugo/Leandro/Joaquín), Fig. 2 aparatos (bomba de jeringa, desfibrilador con parches, generador de marcapasos) que se encienden al usarlos.
- R5 Gráficas del libro recreadas que aparecen con su estado: Fig. 19.5 (FC por horas con diltiazem/amiodarona/digoxina, p. 25), Fig. 21.1 (supervivencia según minuto del 1.er choque: 40 % a 5 min → 9 % a 20 min), Fig. 21.3 y 21.4 (ETCO₂ con y sin RCE).
- R6 Zona de abajo: «Las fuentes de este estado» (lista con cita y página), 6 láminas reales del libro (Fig. 19.2, 19.3, 19.4, 19.6, 19.7, 19.9; `js/modules/cardiologia/img/`) filtradas por estado y con visor, «Notas» (lo que la fuente no dice o discrepa), «Para profundizar» (7 entradas con enlace a su ficha e id: Tablas 19.2-19.3 anticoagulación, amiodarona oral, 5 tipos de PSVT, adenosina en %, Tabla 20.1, insuflaciones e IO, posparo), «Lo que vendrá» (`CRECE`).
- R7 Frase viva fija sobre el dock (frase del estado + origen; el sello manda cuando lo hay) y dock de 3 pestañas **Ritmo | Tratar | Medir**; en Mayéutica, dock de estudio con los pasos.
- R8 Con «reducir movimiento» o Pausa todo se queda quieto; Medir pausa la tira sola y la reanuda al dejar de medir.

## B · Estados (pestaña Ritmo, 6 familias) y sus mandos propios
- R9 Sinusal (deslizador FC SA 50-150, paso 5) · R10 Taquicardia sinusal (FC 100-150; «busca la causa») · R11 Bloqueo de rama (derecha/izquierda; QRS ancho, p. 20-21).
- R12 Reentrada nodal: Valsalva 24 %, Valsalva modificada 44 %, masaje carotídeo 9 % (p. 29; cada intento es una tirada), adenosina 6 → 12 → 12 mg, diltiazem «si falla», «Otra reentrada».
- R13 Flúter 2:1 / 3:1 (dientes de sierra, p. 18-19) · R14 FA: FC inicial del paciente, fármaco (diltiazem / amiodarona / digoxina según Fig. 19.5, o esmolol), deslizador «horas desde el fármaco» 0-6, «Llenado malo» (estenosis mitral/hipertrofia: el VL cae más, p. 21-22), cardioversión 100 J sincronizada (p. 25).
- R15 TAM: magnesio 2 g en 15 min + 6 g en 6 h, metoprolol 2,5-5 mg «si no hay EPOC», verapamilo «con EPOC» (p. 28, Tabla 19.1 p. 23).
- R16 WPW: PR corto y onda delta (p. 27); «Llega una FA»; con FA: diltiazem/betabloqueante/digoxina marcados como peligro, «Ver lo que puede pasar» (→ FV, p. 28), Desfibrilar no sincronizado, Amiodarona «o procainamida», Cardioversión eléctrica.
- R17 TV (Hugo): amiodarona 150 mg en 10 min, adenosina «si dudas», cardioversión 100 → 100 bifásico → 200 J (p. 31-33, Fig. 19.8) · R18 Aberrancia: adenosina 6 mg descubre la supraventricular (Fig. 19.6, p. 31).
- R19 QT largo y torsade (Hugo): casillas de lo que alarga el QT (haloperidol, claritromicina, amiodarona, K⁺, Mg²⁺, Ca²⁺ bajos; Tabla 19.5 p. 34; cuánto alarga cada uno es **ilustrativo**, calibrado para que la hoja de Hugo dé QTc 0,52 s a 75 lpm), «Ver lo que puede pasar con este QTc», desfibrilar, magnesio 1-2 g en 15 min (p. 35), «Corregir K⁺ y Mg²⁺ y retirar el fármaco».
- R20 FV (Leandro): escenario «responde» / «refractaria», compresiones 5-6 cm a 100-120/min, choque 120-200 J, adrenalina 1 mg IV/IO, amiodarona 300 → 150 mg (p. 56-60), deslizador «minuto del primer choque» 5-20 (Fig. 21.1); reloj de la parada ×10 que arranca con la primera acción.
- R21 AESP (ritmo a 64 sin pulso; «no se desfibrila: busca la causa», p. 60; botón Choque marcado «no desfibrilable») y Asistolia (sin actividad; compresiones y adrenalina) · R22 «Vuelve el pulso» (RCE: FC 96, ETCO₂ sube de golpe, p. 61-64).
- R23 ST elevado (Joaquín): deslizador ST 0,5-3,5 mm, derivación (II / V2-V3) y sexo: umbral 1 mm en II, 1,5 mm mujer y 2 mm hombre en V2-V3 (p. 41, Tabla 20.1).
- R24 Potasio alto: deslizador K⁺ 4-8,6 mEq/l (paso 0,2): T picudas → PR largo → sin P → QRS ancho (Nefrología al día p. 21; célula del Libro Azul).
- R25 Familia «Lentos» (bradicardia, BAV 1.º-3.º, marcapasos): **pendiente de fuente**, sin trazo ni cifra; monitor en «—» y texto `PENDIENTE` con enlace a la ESC 2021 (URL verificada). No se inventa nada.

## C · Medir (pestaña Medir, pausa la tira y pone el calibre sobre el ECG)
- R26 PR (P → QRS; en WPW «corto»), QRS (≤0,12 s), QT y QTc (QT/√RR), RR (regular o no) y ST (punto J, en mm). Texto de la medida con origen «medido en la tira · ilustrativo».

## D · Topes y consecuencias (`topes.js`; aviso = amarillo, sello = rojo y manda la frase; los botones apagados se reencienden al repintar)
- R27 Adenosina: 3 bolos (6, 12, 12 mg; por vía central la mitad); entre bolos espera al fin del cerrojo (aviso «Adenosina actuando»); 2.º bolo rotulado «12 mg · 2.ª dosis», 3.º «última dosis»; al 3.º **sello** y los 4 botones de adenosina apagados (Tabla 19.4 p. 30).
- R28 Diltiazem nodal: 1 bolo de 0,25 mg/kg y perfusión 5-15 mg/h; 2.º apagado con aviso «hipotensión 20-30 %» (Tabla 19.1 p. 22-23; el 2.º bolo: la fuente no lo dice).
- R29 Maniobras vagales: 3 intentos por maniobra con contador «intento n/3»; al 3.º se apaga y aviso «No insistas: adenosina» (p. 29; el 3 es ilustrativo).
- R30 Choques: 1 por carga (~2 s, aviso «Cargando», ilustrativo); ninguno con el paciente ya en sinusal (aviso «Un choque ahora puede inducir una FV», fisiología general). TV: 100 → 100 bifásico → 200 J, al 3.º **sello** «nunca 360 J» (p. 32).
- R31 WPW+FA: un freno del nodo apaga los otros dos y enciende la banda de peligro (p. 28). Magnesio TAM y torsade: 1 pauta, se apaga (hipermagnesemia: fisiología general). Metoprolol: 3 dosis con contador. Verapamilo: 5 mg por toque, aviso a 15 mg, **sello** a 20 mg (p. 28). Amiodarona TV: 2 bolos de 150 (tope de la pantalla, ilustrativo; sigue 1 mg/min 6 h y 0,5 mg/min 18 h, ≤2,2 g/día, Fig. 19.8 p. 33).
- R32 Parada: adrenalina cada 3-5 min del reloj (botón «siguiente en m:ss», p. 59-60); amiodarona 300 + 150 y basta (p. 59); con pulso (RCE) se apagan adrenalina y amiodarona («con pulso dispara la FC», fisiología general); FV refractaria tras 3 choques → **sello** «5 % de buen resultado; ECMO» (p. 59-60); a los 20 min aviso, a los **30 min sello** «Sin RCE» y todo apagado salvo «Empezar otra vez» (30 min: ilustrativo).
- R33 Mientras actúa un fármaco, la ART y la FC cambian como en un paciente (dilt baja PA; adenosina da pausa de P sin QRS 1-2 min, p. 29-30); cada acción deja frase viva con «esta vez corta / no corta» en las vagales (tirada con la probabilidad de la ficha).

## E · Mayéutica que trae (`RECORRIDO`, 10 preguntas; `CASO`, 6 pasos; cada opción falsa con su «porque» y página)
- R34 Guía socrática con «predice antes de tocar»: G1 adenosina en reentrada nodal (p. 29-30, Tabla 19.4), G2 WPW (p. 27-28), G3 flúter (p. 18-19). Examen nivel MIR: E1 WPW+FA, E2 FV, E3 TAM, E4 torsade, E5 STEMI, E6 FV/ETCO₂, E7 «piensa y destapa» en sinusal. Cada pregunta abre su estado en el modelo.
- R35 Caso «La lobectomía (Teodoro, 74 a, 78 kg, HTA y DM)»: P1 día 2 tarde, FA a 148 (reconocer; FA tras cirugía torácica 45 %, primeros 5 días, p. 20-21) · P2 PA 108/66: diltiazem 0,25 mg/kg ≈ 20 mg en 2 min y 5-15 mg/h (Tabla 19.1) · P3 **giro** 40 min después, PA 84/50 con FA a 118: parar diltiazem y amiodarona 150 mg en 10 min (p. 23-25) · P4 destapa: punto final 80-110 lpm o que desaparezca el déficit de pulso (p. 22, 25) · P5 día 3 eco con estenosis mitral: FA valvular, siempre warfarina (p. 26-27) · P6 «encuentra el error» con **2 errores** en el plan del R1 (caídas no contraindican, p. 26; ACOD no en FA valvular, p. 27) · «Lo que te llevas» (3 frases). El modelo pone la FC del paso (148 → 118 → 104 → 96) y el «llenado malo» en P5-P6.

## F · Estados para enlazar desde las fichas (`data-ritmo-vivo="<estado>"`, botón `.especialidad-link`)
| Estado | Qué abre | Ficha de Merino Cardiología (`data-tab`) |
|---|---|---|
| `sinusal` `taquiSinusal` `rama` `flutter` | ritmo base, FC o rama; flúter 2:1 | `mc-taqui-reconocimiento` (sinusal/célula también `cardio-fisiologia-aplicada`, Libro Azul) |
| `fa` (+ `fcFA`, `farmaco`) | FA con Fig. 19.5 y déficit de pulso | `mc-taqui-reconocimiento`, `mc-fa-frecuencia` (fármacos), `mc-fa-cardioversion` (cardioversión 100 J) |
| `nodal` `tam` `wpw` `tv` `aberrancia` `torsade` | reentrada y adenosina; TAM; WPW ± FA; TV con Hugo; aberrancia; QT largo | `mc-otras-taqui` (la aberrancia también `mc-taqui-reconocimiento`) |
| `fv` `aesp` `asistolia` | la parada con su reloj | `mc-paro-soporte` (ETCO₂ y Fig. 21.3-21.4: `mc-paro-monitorizacion`) |
| `rce` | vuelve el pulso, ETCO₂ sube | `mc-paro-monitorizacion`, `mc-posresucitacion` |
| `stemi` | ST con umbral por derivación y sexo | `mc-sca-diagnostico` |
| `hiperk` | K⁺ y el ECG | `fisio-hiperpotasemia` (Nefrología) |
| `pend-bradi` `pend-bav1/2/3` `pend-mp` | pantalla «pendiente de fuente» | ninguna ficha aún (no enlazar hasta que llegue la ESC 2021) |

## G · Qué cambia al pasar a la app (`js/modules/libros/ritmo-vivo/`, patrón `vaso-vivo*`, archivos ≤700 líneas)
1. Fuera el comentario de cabecera, el aviso «Para revisar» y el interruptor Explorar|Mayéutica propio: cabecera de la vista con «← VOLVER» a la ficha de origen (`core/volver-ficha.js`) y pestañas como el capilar vivo.
2. `comun/muestra-mayeutica.js` no va: `RECORRIDO` + `CASO` pasan a `js/data/ritmo-vivo-data.js` con el formato de `capilar-vivo-data.js` y se montan con `crearMayeuticaModelo` (`js/core/mayeutica-motor.js`), con sus enganches `ponerEstado(paso.estado, {fcFA, llenadoMalo})`.
3. Las piezas de `autonomo/maquetas/comun/` que usan las tres maquetas (tope, monitor) van una sola vez a `js/core/`; `base.css` se reescribe con los tokens de `css/variables.css`; `IMG` pasa a `js/modules/cardiologia/img/`.
4. **Ids**: todos con prefijo `rtm-` (`pausa`, `frase`, `dock`, `peligro`, `preg`, `visor`, `toast`, `graficas` chocan con otras vistas: el DOM es compartido).
5. Vigilar: FC 0 durante ~1 s tras cada choque y tras la adenosina (fallo 3 del juicio: mostrar «—» o la FC previa), sello cortado a 360 px (cita de «Ver en la ficha» que parta línea), reloj ×10 solo en parada, `node autonomo/version.mjs`.
6. Prueba `autonomo/pruebas/ritmo-vivo.mjs` a partir de `herramientas/ritmo-prueba.mjs` + `limites-prueba.mjs ritmo`, para `jueces --modelo ritmo-vivo` (todos los topes de D, desborde tras cada respuesta y paso del caso).
