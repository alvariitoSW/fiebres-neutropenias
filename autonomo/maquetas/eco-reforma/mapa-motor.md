# Mapa del motor de eco (eco-reforma) — solo lectura, 29/10/2026

Rutas relativas a `js/modules/eco/`. Cifras del motor: script `/tmp/plan-socialista/eco-reforma/herr/extremos.mjs` (5 s).

## 1. Quién usa el motor
`motor.mjs` es puro (no importa nada, sin DOM): es hemodinámica. Entrega `crearMotor`, `BASE`, `FASES`, `escalarRPul`.
| Consumidor | Qué le pide |
|---|---|
| `simulador.mjs` (la app y `laboratorio.html`) | `crearMotor`, `.s` (estado), `.onda` (latido), `.ultimo` (métricas: fe, gc, pam, paps, pvc, pcp, rvp, tapse…) |
| `escenarios.mjs` | `BASE`, `escalarRPul`, y escribe `m.p.*` (rPul, vd.ees, mioVd, tabique, vSangre…) = cada paciente |
| `formas.mjs` | `motor.ultimo`/`.s` -> `estadoGeo`, `extraDeMotor`, `aplanamientoSeptal` (pvi−pvd) |
| `doppler.mjs`, `modo-m.mjs`, `flujo-sangre.mjs` | caudales (`qMit`, `qAo`, `qPul`…) y `onda`; areas de la geometría |
| `lecturas.mjs` + `diagramas.mjs` | `guyton(motor)`, cateter, termodilución, Wiggers y asas (leen `onda`) |
| `atlas/` ciclo, diastolica, vd, asa, hemodinamica, sistolica | `crearMotor` (+ `ESCENARIOS`); doppler, imagen, pulso NO lo usan |
| `herramientas/curvas-guyton.mjs`, `latido.html` | motor + escenarios |
| `libros/shock-vivo/soporte.mjs` | `crearMotor`, `BASE`, `ESCENARIOS`; `corazon.js` usa formas + ecografía + geometría |
| `autonomo/maquetas/{b3-shock,eco-imagen}`, `autonomo/bloques/eco-mega/herramientas/*` | motor, formas, ecografía (herramientas: se romperían en la obra) |

**Hemodinámica**: motor, escenarios (parte de parámetros), lecturas, diagramas (curvas). **Dibujo**: corazon-geo, ecografia, render-webgl, formas (tabla de formas), modo-m, flujo-sangre, doppler pintado.
**Mezclas**:
- `tapseDeLatido` vive en `corazon-geo.mjs` (geometría): una medida clínica sale del dibujo (FEVD × eje largo del VI), no del motor.
- `escenarios.mjs` retoca la fisiología para que el dibujo quepa (`suelo()` sube v0 de VD/AI/AD según `LIMITES` del dibujo): la fisiología sabe de píxeles.
- `doppler.mjs`: velocidad = caudal del motor / área del anillo dibujado (`areasAnillo` de la geometría).
- `ePrima` (e′ desde la relajación) está en `atlas/diastolica.mjs`; la prueba J1 lo importa de un capítulo del atlas.
- `CRITERIOS_FORMA` (escenarios) mide con `medidasCorazon` (ecografía): la validación de la fisiología pasa por la imagen.

## 2. Pruebas que protegen
- `pruebas/*.test.mjs`: 16 archivos, **235 `test(...)`** literales (motor 29, ecografía 25, geometría 26, maniobras 24, paciente-posible 24, navegador 18, doppler 16, atlas 15, taponamiento 13, escenarios 12, enfermedad 11, resto <8). Más los que se generan en bucle (J1/J2).
- (a) Corrida real de `node --test 'js/modules/eco/pruebas/*.test.mjs'`: **505 pruebas: 494 pasan, 0 fallan, 11 «todo» (marcadas pendientes), 0 saltadas** (sí, siguen siendo 505). Los 11 «todo» incluyen huecos ya declarados: MAPSE, rotación basal/apical, S′ tricuspídea (el modelo no calcula velocidades del anillo), grosor sistólico del VD, volumen mínimo de AI/AD; y 2 de RVS 1287 (ref. 900-1200) y pared del VI/derrame. Los 235 `test(` literales se multiplican con bucles (J1/J2 por forma, etc.).
- **J1 «Doppler de paciente posible»** y **J2 «sin recorte»** (`pruebas/paciente-doppler.test.mjs`, bandas en `bandas-paciente.mjs`, medidor `medir-forma.mjs`): cada forma a 0, defecto y 100 % dentro de bandas con libro y página (Nagueh, Lang, Mukherjee, ESC/ERS 2022) y sin muestra fuera de `LIMITES` del dibujo. Lo inferido va como `diagnostico` (se imprime, no falla). `PENDIENTES` hoy vacío.
- Prueba del shock: `autonomo/pruebas/shock-vivo.mjs` (Playwright, a 390/360 px: 5 pacientes a 0/50/100, todos los mandos a su tope, desborde). Se lanza con `node autonomo/jueces.mjs --modelo shock-vivo`; el juez de topes (`jueces-topes.mjs`, REGLAS §1.14) también la pasa.

## 3. Qué sale a fondo (motor de hoy, tras asentar)
| Caso | FEVD | TAPSE mm | PSAP/PAPd | PVC | PAM | GC | VD/VI (vol / área A4C) | pared VD mm | septo | E/e′ | TRV* m/s |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Normal | 53 % | 23 | 22/12 | 4 | 87 | 5,0 | 1,15 / 0,42 | 4,0 | 0 | 8,3 | 2,1 |
| TEP 50 % | 33 % | 14,6 | 33/22 | 6 | 83 | 4,3 | 1,74 / 0,66 | 3,8 | 1,0 | 7,7 | 2,6 |
| TEP defecto | 13 % | 8,4 | 43/34 | 9 | 67 | 2,8 | 3,78 / 1,10 | 3,5 | 1,0 | **1,8** | 2,9 |
| TEP 100 % | 9 % | 6,6 | 40/33 | 9 | 58 | 2,3 | 4,83 / 1,29 | 3,5 | 1,0 | 8,3 | 2,8 |
| HP crónica defecto | 32 % | 14,1 | **97**/30 | 7 | 81 | 4,0 | 1,76 / 0,66 | **8,2** | 1,0 | 7,8 | 4,7 |
| HP crónica 100 % | 15 % | 9,3 | 95/37 | 15 | 77 | 3,1 | 3,69 / 1,09 | 8,2 | 1,0 | 7,4 | 4,5 |
| Taponamiento 100 % | 33 % | 13,4 | 14/12 | 9 | 64 | 2,8 | 0,66 / 0,24 | 6,0 | 0 | 4,0 | - |
| Fallo VI 100 % | 33 % | 16,1 | 32/24 | 5 | 64 | 2,9 | 0,85 / 0,34 | 4,1 | 0 | 23,7 | - |
*TRV lo calculé yo, √((PSAP−PVC)/4); no comprobé que el motor lo entregue como medida. FEVI en TEP 100 %: 44 %; en fallo: 18 %.

**Signos de las guías** (página del PDF / impresa):
- TEP grave. Marino cap. 22 (PDF 7 = p. 7 del capítulo; sin numeración impresa): mobile thrombi en 2–18 %; **McConnell** = acinesia de pared libre del VD con ápex normal, 20 % de casos; dilatación VD + troponina = pronóstico, no diagnóstico (PDF 7); el volumen agresivo empuja el septo hacia el VI (PDF 10). Marino no da cifras de TAPSE ni VD/VI. Cifras: Lang 2015 TAPSE <17 mm y FAC <35 % (PDF 23/p. 23); VD basal normal 25–41 mm, pared 1–5 mm (PDF 20/p. 20). ESC/ERS 2022 Tabla 10 (PDF 28/p. 3645): VD/VI basal >1,0; aplanamiento septal (LVEI >1,1); TAPSE/PSAP <0,55 mm/mmHg; tiempo de aceleración pulmonar <105 ms o muesca mesosistólica; AD >18 cm²; VCI >21 mm. Mukherjee 2025 (PDF 12/p. 152): TAPSE >1,7 cm y TDI S′ >9,5 cm/s normales; (PDF 5/p. 145) TAPSE/FAC por grados.
- HP crónica. ESC/ERS 2022 Fig. 5 (PDF 28/p. 3645): TRV ≤2,8 baja; 2,9–3,4 intermedia (alta con ≥2 categorías de signos); >3,4 alta. TC: hipertrofia del VD = «signo de cronicidad» (misma página). Mukherjee: pared libre VD **>5 mm** = hipertrofia (PDF 4/p. 144; resumen PDF 33/p. 173: VD/VI >1, AD ≥19 cm², HVD); TAPSE/PSAP <0,55 y <0,3–0,4 = desacoplamiento (PDF 33/p. 173; PDF 12/p. 152).
- Sin fuente en `docs/` (**hueco**): MAPSE, torsión, techo de presión del VD agudo (la nota del código «el TEP agudo no pasa de ~40/33» no tiene cita que yo haya podido abrir), LVEI en número, E/e′ del TEP.

**¿Distingue hoy lo agudo de lo crónico? Sí en el resultado, no por una ley del modelo.**
- Agudo: pared 3,5 mm, VD dilatado (área VD/VI 1,10–1,29), TAPSE 6–8 mm, PSAP 40–43 (el VD flojo, Ees×0,65, no sube más), septo aplanado. Crónico: pared 8,2 mm, PSAP ~95, TRV 4,5–4,7, VD que claudica solo hacia el 100 %.
- Pero la hipertrofia (`mioVd`), el acoplamiento del tabique (`p.tabique`), `durVd` y la distensibilidad pulmonar son parámetros puestos a mano en `hpcronica`; no hay hipertrofia que crezca con la carga ni tiempo de adaptación. El tabique es un coeficiente fijo, el aplanamiento sale binario (1,0 desde TEP 50 %). La pared del VD se queda en 8,2 mm de 2,1× a 2,4× (tope del dibujo). El techo de presión del VD agudo no existe como regla: sale del Ees elegido.
- Imposibles/sospechosos a fondo: **E/e′ 1,8 en TEP defecto** (por debajo de la banda normal 4,0–11,5 de Nagueh p. 551, pasa J1 porque esa celda es `diagnostico`) y que vuelva a 8,3 en TEP 100 % (salto no monotónico); VI telediastólico 45–53 mL (normal 119); HP 100 %: PSAP no sube (95) y VD 228 mL (tope del dibujo). Lang/ESC no dan volumen del VD: no lo juzgo.
- Falta para el modelo: regional (McConnell), tiempo de aceleración pulmonar en el Doppler, LVEI medible, TRV/gradiente como salida del motor.

## 4. Fichas que quedarían sin explicar durante una obra
- `libros/shock-vivo/` (pagina.js, soporte.mjs, corazón, 6 `ESTADOS` en `js/data/shock-vivo-data.js`, Mayéutica `mayeutica-shock.js`): Marino caps. 14-17.
- Atlas eco: `atlas/cap-{ciclo,diastolica,vd,asa,hemodinamica,sistolica}.html`.
- Simulador de Eco (`eco.html`) y `laboratorio.html`; curvas de Guyton, Wiggers y asa.
- Enlaces `data-eco-*` (69 atributos): `fisio-uci/cardiologia.html` 24, `cardiologia/merino-cardiologia.html` 20, `libros/marino-fundamentos.html` 10, `sobrevivir-umi/manual-umi.html` 6, `eco/atlas/cap-vd.html` 3, neumología 2, y 1 en tecnicas-r1, vexus, pif-cardio-menu, marino-neuro. Escenarios que piden: tep 5, hemorragia 4, derrame/fallo/normal/vasoplejia 3, dilatada/hipertrofia 2 (hpcronica ninguno desde HTML).
- (b) «Compruébalo en el modelo»: es de otros vivos (capilar, agua, telar, receptor…, vía `core/mayeutica-motor.js`). En el shock el botón sale del campo `comprobar` de las preguntas (`mayeutica-shock.js` l. 58: solo 1 línea con `comprobar:` en `shock-vivo-mayeutica.js`: **no comprobado** si hay más en otro formato). Frases vivas del shock: `E.frase(R, ctx)` por estado (6) en `pagina.js` l. 316; la eco tiene `#cv-senal-frase` (`simulador.mjs` l. 222-269).

## 5. No comprobado / riesgo
- Recuento de `test(...)`: 235 literales; el total real puede diferir (tests en bucle). La corrida real da 505.
- Marino: sin páginas impresas en el PDF; cito página de capítulo = PDF.
- No corrí `autonomo/jueces.mjs` ni `shock-vivo.mjs` (necesitan navegador).
- TRV, VD/VI y septo de mi script son cálculos propios; no verifiqué la lectura Doppler tricuspídea del simulador.
- Riesgo de la obra: `autonomo/maquetas/*` y `herramientas/*` importan el motor; `PENDIENTES` de J1 está vacío, cualquier cambio de constantes los pone en rojo.
