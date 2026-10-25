# RitmoLab · 2.ª pasada · 25/10/2026

Método: Playwright 390×844, una página nueva por escenario, velocidad 20×, lectura de las constantes y del «último evento» tras
cada acción. Nada suyo guardado (2 capturas del simulador en esta carpeta). Lo previo: `autonomo/ideas/ingenieria-inversa/ritmolab.md`
(23/10). Tiempos = reloj del simulador. Cifras de SU simulación: sirven para probar la nuestra, no son fuente clínica.

## 1. Vigía (¿qué cambió desde el 23/10?)
Sin cambios visibles. Piezas hoy: `page-D03NaODa.js` **875 596 B** (el «trozo de 875 kB» del informe previo), `index-CBbMuYJJ.js`
192 kB (marco), `framework-D_rUT4EX.js` 190 kB, `rolldown-runtime`, `layout-segment-context`, CSS `index.BNuE18Qc.css`, Inter, logo;
Cloudflare «challenge» (302) y GTM/Insights (bloqueadas por el proxy). Misma fecha de revisión de fuentes («06 sep 2026»), 17 escenarios,
mismo reparto de pestañas. El 23/10 no se anotaron hashes: **hoy quedan anotados** para la próxima visita. `registerTool` (WebMCP) sigue.

## 2. Pares de prueba (acción → resultado). Entre paréntesis, constantes de partida
| Escenario | Acción | Resultado observado |
|---|---|---|
| 02 FA rápida (FC 148, 118/76) | vía IV + diltiazem 0,25 mg/kg | FC 106 a 2:39, 92 a 4:40; PA 118/74; sigue FA («frecuencia controlada; la arritmia persiste») |
| 03 Flúter 2:1 (150, 118/76) | cardioversión sincronizada 100 J (paciente estable) | sin cambio de ritmo ni FC; solo aviso: FA/flúter >48 h, anticoagulación (5:56) |
| 05 TV estable (168, 112/72) | amiodarona 150 mg/10 min | FC 150 a 1:54, 126 a ~4 min; PA 115/73; todavía TV |
| 06 TV inestable (196, 74/46, SpO₂ 91) | descarga 100 J **sin SYNC** | → FV, sin pulso (EtCO₂ 8): «descarga no sincronizada sobre ritmo organizado» |
| 06 (reiniciada) | SYNC + 100 J | → sinusal 78, 118/74, SpO₂ 97 (5:36) |
| 07 Torsades (230, 65/38, SpO₂ 89) | amiodarona | «prolonga QT y agrava»: PA 59/35 |
| 07 (siguiente) | magnesio 2 g (sin haber desfibrilado) | «no trata el mecanismo prioritario»; PA 41/26; a 7:45 → FV («pérdida de pulso, inicia secuencia de paro») |
| 08 FV (sin pulso, EtCO₂ 8) | IV, parches, RCP, 200 J ×3 sin SYNC | cada choque: «reanuda RCP, nuevo análisis en 2 min»; RCP sube EtCO₂ a 23 |
| 08 | adrenalina **antes** del 2.º choque | rechazada: «adrenalina después del segundo choque en esta secuencia» |
| 08 | amiodarona 300 mg **antes** del 3.er choque | rechazada: «se reserva para FV/TV sin pulso persistente tras descargas» |
| 08 **retorno de circulación completo** | RCP + 200 J (3:51) → 200 J (7:15) → adrenalina 1 mg (9:15) → 200 J (12:21) → amiodarona 300 mg | **RCE a 14:22**: sinusal 78, 118/74, SpO₂ 97, EtCO₂ 36, pulso; «inicia cuidados posparo». (1.er intento fallido por adelantar fármacos; ver filas anteriores) |
| 10 Bradicardia sinusal (38, 82/50, SpO₂ 95) | atropina 1 mg | → sinusal 72, 118/74, SpO₂ 97 (3:25) |
| 12 Mobitz II (60, 84/50) | atropina | «sin resolución»: PA 78/47 |
| 12 | parches + marcapasos 70 lpm, **80 mA** | «ritmo estimulado» 70, 118/74, SpO₂ 97; captura eléctrica ≥70 mA, «comprueba pulso y presión» |
| 13 Mobitz I (56, 118/76) | atropina; luego marcapasos | «no trata el mecanismo prioritario»; «estimulación no indicada para este ritmo»; nada cambia |
| 14 Asistolia (EtCO₂ 7) | descarga | «ritmo NO desfibrilable, continúa RCP» |
| 14 | RCP + adrenalina 1 mg (~220 s) | EtCO₂ 7→23; sigue asistolia (**sin RCE**: falta lo que pide la lista de causas) |
| 15 AESP (FC 72 eléctrica, sin pulso) | RCP + adrenalina (~220 s) | EtCO₂ 8→23; sigue AESP, sin RCE |
| 16 Taquicardia sinusal (126, 100/65, FR 24) | cardioversión; adenosina 6 mg | «no indicada»; «no trata el mecanismo prioritario»; sin cambios |
| 17 Extrasístoles (75, 118/76) | amiodarona | «no trata el mecanismo prioritario»; sin cambios |
Patrón de reglas (**visto**): cada escenario tiene **un mecanismo prioritario**; lo que no lo trata no hace daño pero no cambia nada
(salvo antiarrítmico en torsades o descarga sin SYNC, que empeoran); el **orden** de fármacos y choques en el paro es fijo (adr tras el
2.º choque, antiarrítmico tras el 3.º). Constantes en línea recta hacia 118/74 (visto: 90→72 FC, 41→… sin curva). El tiempo del
sistema solo avanza a lo que dura cada acción; el RCE llega en el siguiente ciclo tras el último fármaco.
**No visto**: flúter con 200 J ni diltiazem (a 5× no se vio cambio en 1 min, ruta dice «conducción 3:1»); AESP/asistolia con causas
reversibles (la «lista de objetivos» que da el RCE); TV estable con cardioversión; Mobitz I con otras acciones.

## 3. Qué usaría un intensivista (30 s) y qué para estudiar
Guardia, **secuencia que el simulador entrena** (deducida de su ruta de Estudio, que cita AHA 2025): 1) ¿pulso? 2) ¿estable? (PA, conciencia,
perfusión, SpO₂); 3) ritmo: ¿ancho/estrecho, regular/irregular, lento/rápido? 4) inestable → **SYNC** + energía (taquicardia con pulso)
o desfibrilación (sin pulso, SYNC apagado); bradicardia inestable → atropina → marcapasos transcutáneo con captura **mecánica**
comprobada por pulso; 5) estable → fármaco según mecanismo (diltiazem en FA/flúter sin IC; magnesio en torsades; adenosina en TSV
tras maniobra vagal); 6) causas reversibles. Se mira primero: pulso y PA; después el trazo.
Estudio: el contraste «misma arritmia, distinto paciente»: TSV/FA estable vs TV inestable; «qué NO hacer» (amiodarona en torsades,
bloqueador nodal en WPW → FV, descarga sin SYNC). Es lo mejor de RitmoLab y lo que a la guardia más sirve.

## 4. Frente a nosotros
| | RitmoLab | Nosotros |
|---|---|---|
| Ritmos | 17 con acciones, 12 derivaciones | Maqueta `b3-ritmo.html` (2315 líneas): 17 estados con fuente y mecanismo visible, 3 derivaciones; **bradis, BAV y marcapasos «pendiente de fuente»** (7 avisos) |
| Latido → circulación | Constantes en línea recta | `motor.mjs` (README eco): presiones, volúmenes, Doppler; aún reloj 60/FC fijo |
| Acciones y consecuencias | Fármacos, SYNC, energía, RCP, marcapasos, RCE | Adenosina, vagal, diltiazem, WPW→FV, RCP/EtCO₂, choque |
| Fuentes | Enlaces a guías sin página | PDF con página (Marino 19-21, Libro Azul); **sin AHA 2025 en `docs/`** |
| Fichas | — | `mc-taqui-reconocimiento` (una); SCA en `mc-sca-diagnostico/tratamiento` (Merino); **nada** de bradiarritmia/estimulación |
Ganan ellos: amplitud de acciones y flujo de caso con revisión. Ganamos: el ECG nace de la fisiología, cada cifra tendrá su página.
**Hueco real**: marcapasos transcutáneo y bradiarritmias no tienen ni ficha ni fuente en la app.

## 5. Ideas para el megaproyecto (barata → grande)
1. **Tarjeta de bolsillo «Inestable: ¿qué hago?»** (árbol Sí/No con `initSiNoWizard`): pulso → estable → ancho/estrecho → SYNC/energía/fármaco;
   cada salida enlaza a su ficha. Guardia: 3 a.m., FC 190 y PA 74/46. Aporta: decisión en 30 s. Esfuerzo: bajo-medio. Necesita:
   **PDF AHA 2025** (taquicardia con pulso, cardioversión, paro).
2. **Ficha «Marcapasos transcutáneo» + calculadora de captura** (qué ajustar: frecuencia, mA, captura eléctrica vs mecánica; trampas:
   captura eléctrica sin pulso). Guardia: Mobitz II/BAV con 84/50. Bajo-medio. Necesita: **ESC 2021 estimulación (Rev Esp Cardiol 2022)** + AHA 2025 bradicardia.
3. **«Qué NO hacer»** (Mayéutica «encuentra el error», REGLAS §8): amiodarona en torsades, bloqueador nodal en WPW, SYNC en FV, adr/amio en
   el orden equivocado. Estudio y seguridad. Bajo. Necesita: AHA 2025.
4. **Secuencia de paro con reloj** (FV/TV sin pulso y no desfibrilable): ciclo de 2 min, choques, adr/amio, causas H/T, criterios de RCE.
   Se prueba contra el par «RCE a 14:22». Medio. Necesita: AHA 2025 (paro).
5. **Bradicardias, BAV y marcapasos en el grafo** (rellenar los «pendiente de fuente» de la maqueta): Mobitz I/II, BAV completo, captura. Medio.
   Necesita: ESC 2021 estimulación (el mismo PDF de 2).
6. **Monitor común con latido real** (pletismografía/PA latido a latido, SYNC marcado en la R). Pequeño-medio. Necesita: nada.
7. **Caso evolutivo de guardia** (6 casos): paciente + monitor + decisiones con consecuencias y revisión por objetivos (sin nota). Grande.
   Necesita: 1-5.
8. **Ritmo que mueve el motor del latido** (FA sin onda A, BAV con ondas «cañón»). Grande; decisión de arquitectura.

## 6. Lo que no traería
Su código, textos («lectura guiada»), historias, nombres de paciente, el maniquí 3D (three.js, rompe §2), constantes en línea recta,
la nota numérica, analítica y WebMCP. Sus cifras (70 mA, 200 J, orden de fármacos) solo indican qué buscar en el PDF.

## 7. Lo que necesito de ti
**PDF**: AHA 2025 (SVA/paro/taquicardia/bradicardia), ESC 2021 de estimulación, ESC SCA (para el otro informe). **Decisión**: ¿tarjeta
de guardia (1) antes del motor (8)? Capturas: `ritmolab-1-mobitz1.jpg` y `ritmolab-2-terapia-electrica.jpg`.
