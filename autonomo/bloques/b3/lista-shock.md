# Lista R2 · lo que hace la maqueta del shock (`autonomo/maquetas/b3-shock.html` + `b3-shock/`) → `shock-vivo`

Profesor, 27/10/2026. El constructor tacha cada punto con una captura. Origen de cada cifra: `datos.js` (`C`, `TOPES`,
`PACIENTES`, `ESTADOS`, `QS`, `CASO`), `topes.js` (`calcularTopes`), `limites-shock.md`. «p.» = página del PDF
`docs/marino-2024-shock-caps14-17.pdf` salvo que se diga otra cosa.

## A. Lo que queda fijo en pantalla (`b3-shock.html` l. 215-280, `pagina.js`)
- S1 Tres pestañas arriba: **Explorar | ¿Qué shock es? | Mayéutica** (`#modo-*`). En la app, la tercera es el Texto | Visual | Preguntas del motor común.
- S2 Fila de **pacientes** (chips) + línea del paciente (`#ficha-pac`: edad, peso, ingreso, hora).
- S3 **Monitor de cabecera** (`#monitor`): trazas ECG, arterial, AP, PVC, pletismo, capnografía (`canales.js`) + cifras; cabecera con chips **Marino | UMI** (objetivos, `OBJETIVOS`: Tabla 14.5, Fig. 15.6, Tabla 16.2, UMI 6 h), **Cuña** (`#enclavar`: infla el catéter y lee la PCP) y **Pausa**.
- S4 Fila de **cálculo** (`CALC`, `pagina.js` l. 130-185): IC ≥2,5 L/min/m² (T. 14.5 y 16.2), IRVS = (PAM − PVC)/IC, objetivo 25-30 solo T. 16.2; ScvO₂ >50 % Marino / ≥70 % UMI; gap PCO₂ <6 (p. 10); cada celda con «Ver en la ficha» (`C.*` → `mc-*`).
- S5 Caja **«Las fuentes discrepan»** (`#discrepa`, `DISCREPAN`: ScvO₂ y PAM) visible al elegir UMI.
- S6 **Escena** (`#escena`): pestañas corazón / eco (A4C con el ecógrafo real) / aparato; sello (`#sello`); leyenda; «La pierna con el balón» (`#pierna`, isquemia, p. 46).
- S7 **Laboratorio y tendencias** con hora (`#lab`, `#tend`: lactato, diuresis mL/kg/h, Hb; PAM·lactato·diuresis por hora).
- S8 Plegables: **Fuentes de este estado**, **Notas** (`NOTAS`: 13 notas, tipos discrepan/calla/errata/autor), **Así lo dibuja el libro** (`#tira`, figuras del PDF con visor), **Para profundizar** (`PROFUNDIZAR`, 6 ítems: resultados ECMO 42 %, selección, RVAD, complicaciones, milrinona/levosimendán, ESC 2026).
- S9 **Dock** fijo abajo (`#dock`, min 160 px, se pliega): frase viva (`ESTADOS[*].frase`) + botón **Guía** (explicación guiada por estado, REGLAS §7.9) + pestañas **Gravedad | Volumen | Fármacos | Soporte | Reloj**.
- S10 Velos «Primero predices» en monitor y escena (`#velo-mon`, `#velo-esc`) en las preguntas con `predice: true`.

## B. Pacientes (`PACIENTES` l. 108-121) y estados (`ESTADOS` l. 191-335)
- S11 **Mateo**, 34 a, 78 kg, varón, herida abdominal por arma blanca, urgencias → `hemo` (hemorrágico; Hb 13,8 que engaña, p. 23).
- S12 **Amparo**, 58 a, 76 kg (ideal 58), mujer, pielonefritis obstructiva, T 39,2 → `septico` (IRVS baja, IC alto; ScvO₂ engaña).
- S13 **Aurelio**, 67 a, 82 kg, IAM anterior, hemodinámica hora 0 → `cardio` (PCP ≈14, tras 250 mL ≈18: caso S3 de cobertura).
- S14 **Joaquín**, 56 a, 84 kg, disección tipo A que sangra al pericardio → `tapon` (PVC ≈ PCP; balón e Impella contraindicados).
- S15 **Consuelo**, 63 a, 142 kg, mujer, día 5 de prótesis de cadera, hora 20 → `tep` (VD sobrecargado; tope de volumen 500 mL).
- S16 Estados de aparato: `balon`, `impella`, `ecmo` (frase viva con L/min reales del motor `soporte.mjs`); `nombreEstado()` pone el nombre según las cifras (p. ej. «Shock cardiogénico con la PCP alta»). Cada estado: título, frase, Guía y fuentes.

## C. Mandos, topes y consecuencias (`topes.js`, `limites-shock.md`; REGLAS §1.14)
- S17 **Gravedad** 0-100 % por paciente (`GRAVEDAD`): hemo = % volemia perdida hasta 42 % (clase IV >40 %, T. 15.1 p. 22-23; clase `clase()` I <15, II ≤30, III ≤40, IV); séptico = resistencias; cardio = Ees del VI; tapon = derrame; tep = carga del émbolo. No se puede pasar.
- S18 **Volumen**: +250 / +500 / +2 L cristaloide (`data-vol`), **+1 L sangre** solo en hemo (`data-sangre`). Aviso «Cerca del techo» desde PCP ≥15 o PVC ≥11 (subida ≥2); **sello «Sobrecarga de volumen»** y botones apagados con PCP ≥20 (ficha p. 42, 11) o PVC >12 habiendo subido ≥4 con edema y SpO₂ <95 (fisiología general). `bolosQueNoCaben`: el bolo que pasaría el tope sale apagado.
- S19 **Edema de pulmón**: edema ≥600 mL → sello «así no se sostiene; intubación» y SpO₂ cae (con ECMO, nota «el oxigenador tapa la caída»). Origen: fisiología general; mL y SpO₂ ilustrativos.
- S20 **TEP**: aviso a 250 mL, **sello «Tope de 500 mL»** con PVC normal 4-6 (cap. 22, p. 10-11) y botones de volumen apagados.
- S21 **Hemorragia**: perdido = % × 66 mL/kg varón / 60 mujer × peso (p. 21); aviso a <250 mL del tope; **sello «Más de lo perdido»** al llegar a 1,5 × perdido (el ×1,5: ilustrativo).
- S22 **Noradrenalina** 0 / 5 / 10 / 25 / 30 µg/min (`data-na`, techo de ficha p. 12-13; a 30 la frase pide segundo vasopresor). **Vasopresina** 0,03 U/min (interruptor; errata U/h del libro p. 13 y 16 anotada). **Dobutamina** 5 µg/kg/min (interruptor, p. 43).
- S23 **Vasopresor sin necesidad**: aviso con PAM >100 y NA o vasopresina; **sello «Hipertensión por vasopresor»** con PAM >110 («baja la dosis»; el 110: fisiología general).
- S24 **Soporte** (`aparatos.js`, `pintarMandos`): **Balón** 35 / 40 mL (p. 45) y razón 1:1 / 1:2 / 1:3; **Impella** 2,5-5,5 L/min (p. 47); **ECMO VA** 1-6 L/min (p. 48); **venteo** del VI con ECMO (no / balón / Impella). Avisos del motor: «la bomba no llega» (`bombaNoLlega`, pide − da >0,3 L/min), «la aórtica no abre».
- S25 **Indicación** (`indicacion()`): solo `cardio` → ok; Joaquín + balón → sello **Contraindicado** (disección, p. 45); Joaquín + Impella → **Contraindicado** (valvulopatía aórtica p. 48; cap. 20 p. 50); resto → **No indicado** (refractario, p. 45). El aparato no se pone.
- S26 **Reloj** +1 / +5 / +18 h (`data-h`): redistribuye el volumen y avanza lactato/diuresis; aviso a 42 h, **sello «Reloj agotado»** a 48 h y botones apagados (ilustrativo).
- S27 Cada sello lleva título, texto con la cifra, «Ver en la ficha» (`cita`) y origen (ficha·p. / fisiología general / ilustrativo); el aviso va bajo la rejilla del mando (`bajo`).

## D. Aparatos: despiece y consola (`despiece.js`, `consola-balon.js`)
- S28 **Despiece Impella** (8 piezas, p. 47): pigtail, entrada, cánula, hélice, jaula, motor, catéter, consola; al tocar una pieza, foco en la escena (`data-foco`).
- S29 **Despiece balón** (5, p. 45): balón de poliuretano 35-40 mL, catéter (punta bajo la subclavia izq.), línea de gas, bomba, bombona de helio.
- S30 **Despiece ECMO** (5, p. 48-49): cánula venosa, bomba centrífuga, oxigenador (Fig. 16.5), calentador, cánula arterial (sangre al revés por la aorta).
- S31 **Consola del balón** (`#iabp`, aprobada 27/10): tres trazados (ECG con marcas, arterial con aumento, presión del balón); mandos Modo y Disparo (fijos, ilustrativos), **Frecuencia 1:1/1:2/1:3**, Aumento máx. (fijo), Temporización (apagada: sin fuente), **Bomba Espera**, Llenado (decorativo); aparte «latido asistido: aumento X, telediastólica Y»; pie con origen. Errores de temporización: no entran (sin fuente).

## E. Preguntas y caso (`datos.js` l. 391-560, `pagina.js` l. 546-)
- S32 **Guía socrática** G1-G6 (predice → monitor destapado): balón sin/con soporte y 1:2 (Aurelio), G6 destapa con Joaquín+balón, G2 Impella 2,5 tras 250 mL, G3 ECMO 3 L/min.
- S33 **Examen nivel MIR** E1-E5: Amparo h 6 con NA 10 (lectura correcta de PAM/ScvO₂/lactato/gap); en quién NO poner balón; pie sin pulso con balón; complicación propia del Impella; ventaja del ECMO VA. Repaso «Otra vez lo que fallaste».
- S34 **Caso «El infarto que se rompe (Aurelio)»**, 7 pasos: hora 0 hemodinámica → catéter AP → tras 250 mL la presión → hora 1 la cuenta (IRVS con las cifras del monitor) → **encuentra el error** del plan del R1 (0-2 errores) → hora 18 **giro** (rotura papilar: EROA 0,8, PaO₂ 56; p. 38) → el soporte (ECMO VA + venteo). «Lo que te llevas»: 3 líneas (p. 40, 42; 2-3, 42-43; 38, 48-49).
- S35 **¿Qué shock es?** (`QS`, 11 escenarios, se barajan 10; `HUELLA` con pistas señaladas en el monitor y la eco): los 5 pacientes a distintas gravedades + Begoña (anafilaxia), Nerea (shock tóxico), Aurelio con PCP alta, Consuelo hora 0 sin shock. Opciones `OPC_QS`: hipovolémico, distributivo, cardiogénico, obstructivo taponamiento, obstructivo TEP, no está en shock.

## F. Estados para enlazar desde las fichas (`data-shock-vivo="<estado>"`)
| Estado | Qué abre | Ficha Merino Cardiología (`mc-*`) |
|---|---|---|
| `hemo` | Mateo, gravedad 0,83, dock Volumen | `mc-hemorragico-clasificacion` (`#mc-volemia`, `#mc-hb-trampa`, `#mc-compensacion`) |
| `septico` | Amparo, objetivos Marino y chip UMI | `mc-definiciones` (`#mc-shock-ecuacion`, `#mc-gap-pco2`), `mc-vasopresores` (`#mc-norepinefrina`, `#mc-vasopresina`) |
| `cardio` | Aurelio hora 0, Cuña | `mc-cardiogenico-fisio`, `mc-cardiogenico-farmaco` (`#mc-llenado-optimo`, `#mc-dobutamina`) |
| `tapon` | Joaquín, escena eco | `mc-cardiogenico-fisio` (`#mc-cs-obstructivo`), `mc-diseccion-aortica` (`#mc-diseccion-fisio`) |
| `tep` | Consuelo, tope 500 mL | `mc-cardiogenico-fisio` (`#mc-cs-obstructivo`); cap. 22 cuando exista |
| `balon` / `impella` / `ecmo` | Aurelio con el aparato, despiece y consola (balón) | `mc-soporte-mecanico` (`#mc-iabp`, `#mc-impella`, `#mc-ecmo`, `#mc-mcs`) |
| `qs` | pestaña ¿Qué shock es? | `mc-definiciones` (clasificación del shock) |

## G. Qué cambia al pasar a la app
1. Fuera el rótulo «Para elegir: aún no está en la app» (l. 215) y los `small` «decorativo» que no tengan origen; la cabecera es la del patrón `vaso-vivo` con «← VOLVER» a la ficha (`core/volver-ficha.js`).
2. `comun/muestra-mayeutica.js` no va: G1-G6, E1-E5, repaso y CASO se montan con `crearMayeuticaModelo` (`js/core/mayeutica-motor.js`), como `capilar-vivo.js`; `prepara` de cada pregunta pasa a los enganches del modelo.
3. Piezas de `autonomo/maquetas/comun/` que use el shock → `js/core/` (una copia); las maquetas importan desde allí.
4. Carpeta `js/modules/libros/shock-vivo/`, archivos ≤700 líneas: `pagina.js` está en 697 → partir (dock/mandos y Mayéutica aparte); `aparatos.js` 570 y `datos.js` 559 → datos a `js/data/shock-vivo-data.js`.
5. `PDF_S` relativo (`../../docs/...`) → ruta desde la app; `libros/index.js` ya lista `shockVivo` en `MODELOS` (l. 70): falta su vista, `abrir(estado, origen)` y la clave en `modelosVivos`.
6. Prueba `autonomo/pruebas/shock-vivo.mjs` para `jueces --modelo shock-vivo`: reutilizar `herramientas/shock-prueba.mjs`, `balon-prueba.mjs` y `limites-prueba.mjs` (todos los mandos al tope, S18-S26).
7. Vigilar: ids duplicados con la Circulación viva (`#monitor`, `#dock`, `#sello`, `#visor`, `#toast` → prefijo `sv-`); `#esc-eco` usa el ecógrafo real: cargarlo solo al abrir; versión `node autonomo/version.mjs`.
8. No cambia la medicina: ninguna cifra nueva sin origen; los huecos (temporización del balón, cortes FC/PA por clase, cuánto mueve cada mando) siguen en Notas.
