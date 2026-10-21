# Bloque 3 · Marino caps. 14-22 · Mapa de cobertura

*(Profesor, modo cobertura, 21/10/2026. Hecho con el texto completo de las 26 fichas (`js/modules/cardiologia/merino-cardiologia.html`,
líneas 433-2571, y `js/modules/neumologia/merino-neumologia.html`, líneas 421-645); los tres PDF pasados a texto página a
página (232 páginas) para situar cada sección y cada figura; las figuras que la app aún no usa vistas a mano (16.2, 19.5,
21.3, 21.4, 15.1 y la Tabla 21.1); el motor del latido medido en node con cada escenario y con su gravedad barrida; y el
ecógrafo (vasoplejía y fallo del VI, con Wiggers, asa P-V y Guyton), el capilar vivo (sepsis), el río y mar (hemorragia)
y el vaso que sangra (hemorragia masiva) abiertos a 390 px.)*

**Páginas**: todas son del PDF (lo que va tras `#page=`). Tres PDF: `marino-2024-shock-caps14-17.pdf` (cap. 14 = p. 1-20,
cap. 15 = 21-36, cap. 16 = 37-51, cap. 17 = 52-69), `marino-2024-cardiac-disorders-caps18-21.pdf` (cap. 18 = 1-17,
cap. 19 = 18-37, cap. 20 = 38-54, cap. 21 = 55-71) y `marino-2024-respiratory-management-caps22-26.pdf` (cap. 22 = 1-14).
En las tablas, «p. 22» sin más es del PDF del capítulo de esa ficha.
**Ids**: las 26 fichas casi no tienen ids por sección (solo 5 en IC aguda, las notas y las calculadoras). El §2 propone uno
por sección: prefijo **`mc-`** en Cardiología y **`nep-`** en Neumología. Comprobado con grep: ninguno existe hoy en `js/`
ni en `index.html`. En las tablas, `#x` = `#mc-x` (o `#nep-x` en las fichas 25-26).

---

## 0. El bloque en una pantalla

| # | Ficha | Modelo vivo y estados | Ideas | Cubiertas | % | Se ven en un modelo |
|---|---|---|---|---|---|---|
| 1 | `mc-definiciones` | **Circulación viva + cabecera del shock**: los 4 tipos a fondo; capilar `sepsis`; río y mar `cristaloide-2l` | 25 | 23 | 92 % | 12 |
| 2 | `mc-vasopresores` | Cabecera del shock (fármacos) + receptores animados | 22 | 20 | 91 % | 10 |
| 3 | `mc-hemorragico-clasificacion` | Cabecera `hipovolemico-ii/iii/iv`; río y mar `clase-*`, `relleno`, `fig-15-1` | 17 | 16 | 94 % | 10 |
| 4 | `mc-hemorragico-fluidos` | Catéter vivo `fig-15-2`, `tabla-15-3`; río y mar `coloide-cristaloide`, `reanimacion` | 20 | 18 | 90 % | 10 |
| 5 | `mc-damage-control` | Vaso `tic`, `uno-uno-uno`, lupa **TEG**; muralla `motor-fmo` (lesión posresucitación) | 22 | 20 | 91 % | 9 |
| 6 | `mc-cardiogenico-fisio` | Cabecera `cardiogenico`, `rotura-papilar`, `rotura-septo`, `rotura-pared`, `iam-vd`; Guyton (Fig. 16.2) | 22 | 20 | 91 % | 12 |
| 7 | `mc-cardiogenico-farmaco` | Cabecera (volumen hasta PCP 18-20, NA, dobutamina, milrinona, levosimendán) + receptores | 20 | 19 | 95 % | 10 |
| 8 | `mc-soporte-mecanico` | Cabecera · soporte: `balon`, `impella`, `ecmo`, `ecmo-venteo` (Wiggers vivo) | 22 | 20 | 91 % | 12 |
| 9 | `mc-inflamacion-ros` | Capilar: lupa **neutrófilo** (Fig. 17.1 viva), `fuga`, `peroxinitrito` | 16 | 15 | 94 % | 9 |
| 10 | `mc-shock-septico` | Cabecera `septico`, `septico-tardio`; capilar `sepsis` + PO₂ del músculo; río y mar `fuga`, `acumulacion`; catéter vivo `hemocultivos` | 26 | 24 | 92 % | 12 |
| 11 | `mc-shock-toxico` | Cabecera `septico` + río y mar `fuga` (poco: es consulta) | 17 | 16 | 94 % | 3 |
| 12 | `mc-anafilaxia` | Cabecera `anafilactico`; río y mar `fuga-35`; receptores: el **mastocito** | 20 | 19 | 95 % | 8 |
| 13 | `mc-ic-tipos` | Circulación viva: `hipertrofia`, `dilatada`, `tep` (ya existen) + `ic-etapa-1/2/3` (Fig. 18.3); asa P-V; glomérulo `congestion` | 28 | 26 | 93 % | 14 |
| 14 | `mc-ic-manejo` | Cabecera (NTG, nitroprusiato, furosemida, CPAP); nefrona viva `furosemida` (ya existe) | 26 | 24 | 92 % | 10 |
| 15 | `mc-taqui-reconocimiento` | **Corazón eléctrico** (nuevo): `sinusal`, `nodal`, `flutter`, `tam`, `fa`, `tv`, `aberrancia` | 8 | 8 | 100 % | 8 |
| 16 | `mc-fa-frecuencia` | Corazón eléctrico `fa` + Fig. 19.5 viva; circulación viva `fa` (sin patada auricular, déficit de pulso) | 20 | 19 | 95 % | 12 |
| 17 | `mc-fa-cardioversion` | Corazón eléctrico `cardioversion`, `wpw`; vaso lupa cascada `warfarina` (ya existe) | 16 | 15 | 94 % | 6 |
| 18 | `mc-otras-taqui` | Corazón eléctrico `tam`, `nodal`, `vagal`, `adenosina`, `tv`, `aberrancia`, `torsade` | 26 | 24 | 92 % | 16 |
| 19 | `mc-sca-diagnostico` | Vaso **`placa`** (Fig. 20.1 viva, MPO); corazón eléctrico `stemi` | 16 | 15 | 94 % | 6 |
| 20 | `mc-sca-tratamiento` | Vaso `placa-antiagregantes`, `trombolisis` (plasmina sobre la fibrina) | 26 | 23 | 88 % | 8 |
| 21 | `mc-diseccion-aortica` | Cabecera `diseccion`: vasodilatador solo (barorreflejo → taquicardia) frente a betabloqueo primero | 16 | 15 | 94 % | 4 |
| 22 | `mc-paro-soporte` | Corazón eléctrico `fv`, `aesp`, `asistolia`, `rcp`, `choque` (Fig. 21.1 y 21.3 vivas) | 24 | 22 | 92 % | 12 |
| 23 | `mc-paro-monitorizacion` | Corazón eléctrico `rcp` con ETCO₂ (Fig. 21.4 viva); capilar `capno-rcp` (ya existe); eco `taponamiento` | 13 | 13 | 100 % | 9 |
| 24 | `mc-posresucitacion` | Corazón eléctrico `rce`; cabecera `posparo` (aturdimiento); capilar lupa neutrófilo `reperfusion` | 22 | 21 | 95 % | 4 |
| 25 | `neumo-ep-diagnostico` | Circulación viva `tep`; telar `tvp` + lupa **eco de compresión** | 26 | 24 | 92 % | 6 |
| 26 | `neumo-ep-manejo` | Cabecera `tep-intermedio`, `tep-alto`, bolo de 500 mL (el tabique empuja); vaso `tep-lisis` | 28 | 25 | 89 % | 11 |
| **Bloque** | | **Sin modelo nuevo para el shock** (se amplía la circulación viva) · **1 modelo nuevo** para el ritmo | **545** | **504** | **≈92 %** | **243 (45 %)** |

**Cómo se cuenta** (igual que en los bloques 1 y 2): una idea importante es lo que un R1 tiene que saber o hacer
(mecanismo, cifra que cambia una decisión, corte, conducta). Está cubierta si la enseña un modelo en un estado, una
pregunta de la Guía, una del Examen o un paso de un caso. Las anécdotas (JAMA de 1960, la historia de 1980, el lema de
1931) no cuentan.

**Tres hallazgos que cambian el plan** (detalle en §4 y §9):
1. **Ningún escenario del ecógrafo llega hoy a shock** (medido en node, 40 s con barorreflejo): hemorragia de 1 L → PA
   107/79, PAM 93; fallo del VI → PAM 92; derrame → PAM 95, PVC 7; «TEP masivo» → PAM 88. Solo la vasoplejía baja de 65.
   Y al subir la gravedad **el motor se rompe**: hemorragia de 1,5 L → PAM 81, pero de 2 L → PAM 11, y de 2,5 L → PAM 0
   con RVS negativa; derrame de 350 mL → PAM 85, de 450 → PAM 14, de 550 → **NaN**; fallo del VI con Ees 0,45 → PAM 81
   pero PCP 41 mmHg. No hay estado intermedio de shock (Clase III) ni paciente posible a fondo (REGLAS §1.7).
2. **«TEP masivo» contradice a Marino**: el libro llama masiva a la EP **de alto riesgo, con inestabilidad hemodinámica**
   (cap. 22, p. 7), y el escenario da PAM 88. Igual con «Derrame pericárdico», que la ficha 1 enlaza como taponamiento.
3. **Merino Cardiología y Merino Neumología no tienen vista Visual**, y Estudiar (Texto | Estudiar) solo se monta sobre
   una ficha que ya la tiene (`montarMayeutica` exige `data-visual`). Es un prerrequisito de las 26 fichas (pieza 1, §7).

---

## 1. El tamaño del bloque: tres sub-bloques

26 fichas son 4 veces el bloque 2. Propongo partirlo en **tres sub-bloques**, cada uno con su modelo principal, para
entregar antes y que el usuario pruebe el primero en el móvil mientras se construye el siguiente.

| Sub-bloque | Fichas | Modelo principal | Trabajo grande | Casos |
|---|---|---|---|---|
| **3A · El shock** (9) | 1, 2, 3, 4, 5, 9, 10, 11, 12 | Circulación viva con la **cabecera del shock** (gravedad, monitor y fármacos) + río y mar, capilar, vaso, catéter vivo | Gravedad del motor (pieza 5) y monitor de perfusión (pieza 3) | S1, S2, S4, S5 |
| **3B · La bomba que falla** (10) | 6, 7, 8, 13, 14, 19, 20, 21, 25, 26 | Circulación viva con **soporte mecánico** (balón, Impella, ECMO), etapas de la IC, TEP con gravedad; vaso con **la placa** | Soporte mecánico y presión intratorácica (CPAP) en el motor | S3, C1, C4, C6 |
| **3C · El ritmo y la parada** (7) | 15, 16, 17, 18, 22, 23, 24 | **Corazón eléctrico** (modelo nuevo, lo decide el usuario) + FA en el motor | Modelo nuevo entero | C2, C3, C5 |

**Orden**: 3A primero (casi todo es ampliar modelos que ya existen; la gravedad del motor es la pieza que más fichas
desbloquea), luego 3B (sigue en el mismo motor) y por último 3C (espera a que el usuario elija el corazón eléctrico en su
maqueta). La cabecera del shock (3A) es lo que el usuario ve en la parada 2.

**Paradas** (REGLAS §2.3; decide el usuario): con tres sub-bloques salen más de 4-5. Propuesta para que sean **6** y no 9:
1 · este plan y sus maquetas (cabecera del shock y corazón eléctrico) → 2 · la cabecera construida → 3 · el 3A en la app
→ 4 · los cambios del 3A **junto con** el 3B en la app → 5 · los cambios del 3B **junto con** el 3C en la app → 6 · los
cambios del 3C (entra en `main`). Una sola rama `auto/b3` y una PR en borrador, como manda §2.3; cada sub-bloque entra en
`main` con su visto bueno. Alternativa: un solo bloque con 5 paradas, entregado entero al final.

---

## 2. La ruta del bloque (orden de estudio)

No cambia el orden del cuaderno (sigue los capítulos): es una ruta aparte, en 9 etapas.

| Etapa | Fichas | Modelo | Por qué aquí |
|---|---|---|---|
| 1 · Qué es un shock | 1 `mc-definiciones` | Cabecera: los 4 tipos a fondo (Tabla 14.1 viva) | PAM = GC × RVS + PAD: todo lo demás cuelga de aquí |
| 2 · Perder sangre | 3 → 4 → 5 | Río y mar → catéter vivo → vaso (TEG) | Del vaso que se vacía a cómo se llena (el más intuitivo) |
| 3 · Los fármacos que suben la presión | 2 `mc-vasopresores` | Receptores + cabecera (fármacos) | Ya se sabe qué falla en cada shock: ahora, qué se toca |
| 4 · La inflamación | 9 → 10 → 11 → 12 | Capilar (neutrófilo) → cabecera `septico` → `anafilactico` | El shock más frecuente (66 %); el mecanismo antes que el protocolo |
| 5 · La bomba | 6 → 7 → 8 | Cabecera `cardiogenico` → fármacos → soporte | Cierra el cap. 16 con el balón y el ECMO en el Wiggers |
| 6 · La IC sin shock | 13 → 14 | Asa P-V, formas de enfermedad, etapas | Lo mismo que el cardiogénico pero sin hipoperfusión (p. 40) |
| 7 · El coágulo | 19 → 20 → 21, luego 25 → 26 | Vaso `placa` → `trombolisis`; cabecera `diseccion`; TEP | Infarto y TEP: un coágulo que tapa; la disección, el diferencial |
| 8 · El ritmo | 15 → 16 → 17 → 18 | Corazón eléctrico | Primero leer el ECG (flujograma 19.1), luego la FA (la más frecuente) |
| 9 · La parada | 22 → 23 → 24 | Corazón eléctrico `fv` → `rcp` → `rce` | Une ritmo, bomba y oxígeno: cierre del bloque |
| Cierre | Casos S1-S5 y C1-C6 (§6) | Los de cada etapa | Un caso por etapa (dos en la 4 y en la 8) |

---

## 3. Ids que hay que poner en las fichas (prerrequisito; con su página del PDF)

Cada sección, acordeón, tabla y figura recibe su id (para «Ver en la ficha», REGLAS §7.9, y para que las recetas de la
vista Visual apunten por id, CLAUDE §5). Cada sección lleva además su chip de página `#page=N`. Los ids que ya existen se
quedan (`mc-tabla-18-1`, `mc-hfpef`, `mc-ic-derecha`, `mc-fig-18-2`, `mc-vd-septo`, las notas y las calculadoras).

| Ficha | Ids (`#mc-…` salvo 25-26, `#nep-…`; página del PDF) |
|---|---|
| 1 | `shock-definicion` (1) · `shock-clinica` (2) · `shock-ecuacion` (2-3) · `tabla-14-1` (3) · `shock-hipovolemico` (3) · `shock-cardiogenico` (3) · `shock-obstructivo` (3) · `shock-vasodilatador` (4) · `amplificacion` (4-5) · `fig-14-1` (5) · `pam-objetivo` (4) · `pa-indirecta` (5-6) · `manguito` (6-7) · `tabla-14-2` (7) · `pa-precision` (7) · `pac-desuso` (8) · `o2-ecuaciones` (8-9) · `scvo2` (9) · `tabla-14-3` (10) · `gap-pco2` (10) · `diuresis` (11) · `volumen-inicial` (11) · `tabla-14-5` (17) · `o2-objetivos` (17-18) · `septico-excepcion` (18) · `hipotension-consecuencia` (18) |
| 2 | `norepinefrina` (12-13) · `epinefrina` (13-14) · `dopamina` (14-15) · `fenilefrina` (15) · `vasopresina` (15-16) · `angiotensina` (16) · `midodrina` (16) · `tabla-14-4` (13) · `receptores` (envuelve el receptor animado; farmacología general) · `seguridad-na` (cap. 17, p. 61) · `via-infusion` (11-12) · `extravasacion` (12) · `vaso-pam` (12) |
| 3 | `volemia` (21) · `compensacion` (21) · `tabla-15-1` (22) · `clase-i`, `clase-ii`, `clase-iii`, `clase-iv` (22-23) · `hb-trampa` (23) · `fig-15-1` (24) · `fig-15-6` (34) |
| 4 | `poiseuille` (24) · `fig-15-2` (25) · `cateter-rapido` (24) · `introductor` (25) · `tabla-15-2` (26) · `fig-15-3` (27) · `cristaloide-historia` (26-27) · `hematies` (27) · `plasma` (27) · `crio` (27) · `sangre-completa` (28) · `sangre-o` (28) · `infusion-rapida` (28) · `tabla-15-3` (28) · `estrategias` (29) · `tabla-15-4` (29) · `hemorragia-sin-shock` (29) |
| 5 | `dcr` (29-30) · `hipotension-permisiva` (30) · `coagulopatia` (30) · `tic` (30) · `fig-15-4` (31) · `hemostasia-objetivos` (30-31) · `teg` (31-32) · `fig-15-5` (32) · `tabla-15-5` (33; envuelve el intérprete) · `postresucitacion` (33-34) · `dcr-resumen` (34-35) |
| 6 | `cs-definicion` (37) · `fig-16-1` (38) · `papilar` (38) · `septo-rotura` (38) · `pared-libre` (38) · `tabla-16-1` (39) · `tsvi-dinamico` (39) · `postcardiotomia` (39) · `periparto` (39) · `cs-obstructivo` (39) · `cs-hemodinamica` (40) · `fig-16-2` (40, nueva: recreada) · `cs-vd` (40) · `cs-excepciones` (40) · `cs-microcirculacion` (41) · `cs-inflamacion` (41) |
| 7 | `cs-monitorizacion` (41) · `tabla-16-2` (42) · `llenado-optimo` (42) · `cs-vasopresor` (42-43) · `cs-inotropicos` (43) · `tabla-16-3` (43) · `dobutamina` (43) · `milrinona` (44) · `levosimendan` (44) · `carga-trabajo` (44) |
| 8 | `mcs` (45) · `iabp` (45-46) · `fig-16-3` (46) · `impella` (47-48) · `fig-16-4` (47) · `ecmo` (48) · `fig-16-5` (49) · `mcs-resultados` (49) · `mcs-seleccion` (49) |
| 9 | `inflamacion-maligna` (52) · `estallido` (53) · `fig-17-1` (54) · `ros` (54-55) · `lesion-oxidante` (55) · `endotelio` (55) · `tabla-17-1` (56) · `fig-17-2` (56) · `inflamacion-final` (67) |
| 10 | `sepsis-epidemiologia` (57) · `sepsis-definiciones` (57) · `sepsis-hemodinamica` (57-58) · `mitocondria` (58) · `fig-17-3` (59, nueva: recreada) · `sepsis-monitorizacion` (59) · `tabla-17-2` (60) · `sepsis-volumen` (60) · `sepsis-vasopresores` (60-61) · `corticoides` (61) · `antimicrobianos` (61-62) |
| 11 | `tss-patogenia` (62) · `tabla-17-3` (63) · `tss-clinica` (63) · `tss-diagnostico` (63) · `tss-manejo` (63-64) |
| 12 | `anafilaxia-def` (64) · `tabla-17-4` (65) · `kounis` (65) · `adrenalina-im` (65) · `tabla-17-5` (65) · `glucagon` (66) · `segunda-linea` (66) · `anafilaxia-corticoides` (66) · `shock-anafilactico` (66-67) |
| 13 | `sistolica-diastolica` (1-2) · `fig-18-1` (2) · `fe` (3) · `vd-medidas` (4) · `ic-etapas` (5) · `fig-18-3` (6) · `neurohumoral` (5-6) · `congestion` (6) · `fig-18-4` (8) · `cardiorrenal` (7) · `bnp` (7-8) · `tabla-18-2` (8) |
| 14 | `ic-pa-alta` (9) · `tabla-18-3` (9) · `nitroglicerina` (9-10) · `nitroprusiato` (10) · `ic-pa-normal` (10) · `diureticos-preocupaciones` (10-11) · `tabla-18-4` (11) · `furosemida` (11-12) · `resistencia-furosemida` (12) · `infusion-continua` (12) · `tabla-18-5` (13) · `largo-plazo` (13-14) · `vpp` (14) · `ic-final` (15) |
| 15 | `taqui-hallazgos` (18) · `fig-19-1` (19) · `qrs-estrecho-regular` (18-19) · `fig-19-2` (20) · `qrs-estrecho-irregular` (20) · `fig-19-3` (20) · `qrs-ancho` (20) |
| 16 | `fa-epidemiologia` (21) · `fa-hospital` (21) · `fa-consecuencias` (21-22) · `fig-19-4` (22) · `tabla-19-1` (22) · `fig-19-5` (24, nueva: recreada) · `amiodarona-iv` (24-25) · `fa-punto-final` (25) |
| 17 | `cardioversion` (25) · `tabla-19-2` (26; envuelve la calculadora) · `tabla-19-3` (27) · `warfarina` (26) · `doac` (27) · `wpw` (27) |
| 18 | `tam` (28) · `psvt` (29) · `adenosina` (29-30) · `tabla-19-4` (30) · `tv` (31) · `tv-vs-svt` (31-32) · `fig-19-6` (31) · `fig-19-7` (32) · `fig-19-8` (33) · `torsade` (34) · `fig-19-9` (34) · `tabla-19-5` (34) · `qtc` (34) · `tv-polimorfica` (35) · `madeja` (35) |
| 19 | `placa` (38-39) · `fig-20-1` (39) · `sca-sindromes` (40) · `sca-clinica` (40) · `sca-ecg` (40-41) · `troponina` (40-41) · `tabla-20-1` (41) |
| 20 | `reperfusion` (41-42) · `puerta-balon` (42) · `fig-20-2` (43) · `scasest` (43) · `trombolisis` (43-45) · `fig-20-3` (44) · `tabla-20-2` (44) · `tabla-20-3` (45-46) · `tabla-20-4` (47) · `sca-anticoagulacion` (49) · `sca-largo-plazo` (49) · `oferta-demanda` (52) |
| 21 | `diseccion-claves` (50) · `diseccion-fisio` (50) · `diseccion-clinica` (50-51) · `diseccion-imagen` (51) · `fig-20-4` (51) · `diseccion-manejo` (51) · `tabla-20-5` (51-52) · `diseccion-objetivos` (52) |
| 22 | `tabla-21-1` (55-56) · `svb-tiempo` (56) · `tabla-21-2` (56) · `insuflaciones` (57-58) · `acceso-paro` (58) · `desfibrilacion` (58-59) · `fig-21-1` (59) · `aesp` (60) · `epinefrina-paro` (60-62) · `fig-21-3` (62, nueva: recreada) · `algoritmo-aha` (59-61) |
| 23 | `etco2` (62-63) · `fig-21-4` (63) · `eco-paro` (63-64) · `fig-21-5` (64) |
| 24 | `posparo` (64) · `tabla-21-3` (65-66) · `tabla-21-4` (66-67) · `tabla-21-5` (67) · `pronostico-texto` (68) · `despertar` (68) · `rcp-percepcion` (68) |
| 25 | `epidemiologia` (1) · `presentacion` (1-2) · `tabla-22-1` (2) · `dimero-d` (3) · `tabla-22-2` (3) · `eco-venosa` (4) · `tvp-brazo` (4) · `ctpa` (5) · `fig-22-1` (5) · `subsegmentarios` (5) · `vq` (6) · `ecocardio` (6-7) · `final` (12) |
| 26 | `riesgo` (7) · `tabla-22-3` (7) · `bajo-riesgo` (8) · `intermedio` (8) · `alto-riesgo` (8-9) · `hnf` (9) · `obesidad` (9) · `trombolisis` (9-10) · `trombectomia` (10) · `fig-22-2` (10) · `hemodinamica` (10) · `filtros` (11) · `fig-22-3` (11, foto del filtro: si se añade) · `filtro-indicaciones` (12) · `filtro-experiencia` (12) |

---

## 4. Los modelos que ya existen: qué estados nuevos necesitan y qué le falta al motor

### 4.1 Circulación viva (motor + ecógrafo): la **cabecera del shock** (sub-bloques 3A y 3B)

**Decisión: no hace falta un modelo nuevo para el shock.** El motor ya tiene lo que enseñan los caps. 14-18 y 22: PAM,
GC, PVC, PCP, RVS, el barorreflejo (que es la vasoconstricción compensadora de la Tabla 14.1), el asa P-V, Guyton (la
Fig. 16.2 es exactamente su curva de función que se aplana), el Doppler, la VCI y el transporte de O₂ por latido (`do2`,
`vo2`, `er`, `svo2` ya salen en `motor.ultimo`). Le falta poder **llegar a shock** y **tratarlo**. Se añade un plegable
nuevo en `eco.html`, **«🩺 Shock: gravedad, monitor y tratamiento»** (ids `cvs-`, libres), que abre
`data-eco-panel="shock"` con `data-eco-escenario` y, nuevos, `data-eco-gravedad` (0-100) y `data-eco-farmaco`.

**Qué se ve (390 × ~520 en el panel; el corazón 3D y la eco siguen arriba, leyendo el mismo fotograma):**
1. **El monitor**: dos trazos vivos del motor (presión de la raíz aórtica con la línea de PAM y la marca de 65; PVC) y
   cifras grandes PAM · FC · IC · PVC · PCP · IRVS · SvO₂ · lactato · gap de PCO₂ · diuresis. Cada fila se pinta en rojo
   o verde **con icono** (✓/✗) frente a la tabla de objetivos del tipo de shock: Tabla 14.5 (p. 17) en general, Fig. 15.6
   (p. 34) en el hemorrágico, Tabla 16.2 (p. 42) en el cardiogénico.
2. **Mandos**: tipo de shock (chips) · **gravedad** (deslizador) · volumen (bolo 250/500 mL, «2 L de cristaloide», que ya
   hace `maniobras.mjs`) · **fármacos** (chips con su dosis en tramos) · **soporte** (3B: balón, Impella, ECMO).
3. **Frase viva** y botón **«Explícamelo»** (`core/explicacion-guiada.js`): 3-5 pasos por estado que resaltan la fila del
   monitor, la eco o el Wiggers que cuentan, cada uno con su «Ver en la ficha» (REGLAS §7.9-7.10).

**Lo que hay que construir en el motor (con pruebas en `pruebas/motor.test.mjs` y `escenarios.mjs`):**

| # | Falta | Cómo (lo decide el constructor; esto es lo que tiene que salir) | Fichas |
|---|---|---|---|
| M1 | **Gravedad sin saltos** en los 4 tipos | Un deslizador por escenario. A fondo, un paciente en shock **posible**: PAM 45-60, sin ceros, sin NaN, sin RVS negativa. La hemorragia necesita que el volumen sin tensión se reclute al vaciarse las venas (hoy el barorreflejo solo lo baja un 25 % y a 2 L el retorno se para de golpe) y el **relleno transcapilar** (hasta 1 L, cap. 15 p. 21). El derrame, quitar el NaN de 550 mL. El fallo del VI, que el barorreflejo se sature: hoy con Ees 0,45 da PAM 81 con PCP 41. **Se busca el error en su origen, no se recorta** (§1.7). Pruebas nuevas: magnitud en 0, 50 y 100 % de cada mando | 1, 3, 6, 13, 26 |
| M2 | **Monitor de perfusión** | Lactato, gap de PCO₂, ScvO₂ y diuresis leídos de una sola función común (pieza 3) que también usa el capilar. Diuresis: cae cuando la PAM baja de 70 (la autorregulación renal la sostiene hasta ahí: cap. 18 p. 7; la pendiente, ilustrativa) | 1, 3, 7, 10, 14 |
| M3 | **Utilización del O₂** (sepsis) | El motor tiene el VO₂ fijo en 250: con «la mitocondria no usa el O₂» la extracción cae (techo ilustrativo, el mismo del capilar) y la ScvO₂ sube a ≥80 % (cap. 14 p. 9; cap. 17 p. 59) | 1, 10 |
| M4 | **Fuga capilar** | Pasa volumen del plasma al intersticio: hasta el 35 % del volumen intravascular en la anafilaxia (cap. 17 p. 67); en la sepsis, «extravasación e hipovolemia» sin cifra (p. 57: ilustrativo) | 10, 11, 12 |
| M5 | **Fármacos** | Cada fármaco mueve parámetros del motor (RVS, volumen sin tensión, Ees, FC) en la **dirección** de la ficha; la magnitud, ilustrativa y rotulada. Datos una sola vez (pieza 4) | 2, 7, 10, 12, 14, 21, 26 |
| M6 | **Soporte mecánico** (3B) | Balón: 35-40 mL que se inflan al cerrar la aórtica y se vacían en la contracción isovolumétrica (p. 45-46): sube la diastólica pico y la PAM, baja la presión al abrir la aórtica, sube el VS; se ve en el Wiggers como la Fig. 16.3 (la real al lado). Impella: flujo continuo VI → aorta de 2,5-5,5 L/min (p. 47). ECMO VA: 5-6 L/min de vena a arteria (p. 48), que **sube la poscarga del VI** (la PCP sube; ilustrativo) y se corrige con balón, Impella o venteo | 8 |
| M7 | **Complicaciones del IAM** (3B) | Rotura del papilar = IM aguda (`eroaMitral` ya existe: falta el chorro en color, README «Pendiente»); rotura del septo = **cortocircuito VI → VD** (nuevo); rotura de pared libre = taponamiento rápido (el derrame con M1). Las tres en las primeras 24 h (p. 38) | 6 |
| M8 | **Presión intratorácica** (3B) | CPAP/VNI como entrada del motor: baja la presión transmural del VI → baja la poscarga y sube el VS (cap. 18 p. 14). La misma entrada servirá al pulmón con respirador (mapa §1.1, punto 3) | 14 |
| M9 | **FA en el motor** (3C) | Sin contracción auricular (aporta el ~25 % del llenado, cap. 19 p. 21) y RR irregular latido a latido: la PAS cae tras los latidos cortos y aparece el déficit de pulso (Fig. 19.4, real al lado). Con la hipertrofia (llenado comprometido) se nota más (p. 21). El RR lo dicta el corazón eléctrico | 16 |
| M10 | **Onda radial** (opcional) | Misma PAM, sistólica hasta +20 mmHg más alta y más estrecha que en la raíz (cap. 14 p. 4-5); forma ilustrativa. Enseña por qué se monitoriza la PAM | 1 |

**Lo que el motor no hará en este bloque** (huecos 5-7, §9): obstrucción dinámica del TSVI (el ecógrafo tendría que
dibujar el contacto mitral-septal: anatomía congelada), insuficiencia aórtica (contraindica el balón; la disección tipo A
la produce) y la acinesia regional (signo de McConnell del TEP). Se enseñan con texto, preguntas y casos.

**Estados con nombre** (frase viva con su origen; las magnitudes del motor, ilustrativas; las direcciones y cortes, de la ficha):

| Estado | Mandos | Lo que tiene que salir (página) | Frase viva |
|---|---|---|---|
| `hipovolemico-ii` | hemorragia 20 % | FC ↑, PA ↔/↓, diuresis ↔/↓, lactato ↔ (Tabla 15.1, p. 22) | «Clase II: los vasos se aprietan y la PA aguanta. El primer aviso es la FC, y luego la orina.» |
| `hipovolemico-iii` | hemorragia 35 % | PA ↓ en supino, oliguria <0,5 mL/kg/h, lactato ↑ (p. 22-23) | «Clase III: apretar ya no basta. Es el shock hemorrágico.» |
| `hipovolemico-iv` | hemorragia >40 % | PA ↓↓, lactato ↑↑ (p. 23); a fondo, PAM ~45, no 0 | «Clase IV: shock profundo, quizá irreversible. Aquí está la pérdida masiva.» |
| `septico` | vasodilatación + fuga + utilización baja | PVC ↓, GC normal o ↑, RVS ↓ (Tabla 14.1, p. 3); ScvO₂ ≥80 % (p. 9); lactato >2 (p. 59) | «Vasos abiertos y una mitocondria que no usa el O₂: la ScvO₂ alta no tranquiliza; el gap de PCO₂ sí sirve.» |
| `septico-tardio` | + Ees ↓ | el GC empieza a caer: mal pronóstico (p. 57) | «Cuando el gasto del séptico cae, el pronóstico empeora.» |
| `anafilactico` | vasodilatación + fuga 35 % | hipotensión más marcada que en el séptico (p. 66-67) | «Además de abrirse, los capilares pierden hasta un tercio del volumen: adrenalina y volumen.» |
| `cardiogenico` | Ees ↓ (gravedad) | IC <2,2 (p. 40), PCP ↑ o PVC ↑, RVS ↑ (Fig. 16.2); lactato ↑ y diuresis ↓ (p. 40) | «El corazón no bombea: suben las presiones de llenado y se aprietan los vasos. Lo que lo separa de la IC es la hipoperfusión.» |
| `cardiogenico-pcp-baja` | Ees ↓ + volemia baja | PCP no elevada (hasta el 30 %, p. 40) → bolo hasta PCP 18-20 (p. 42) | «Sin presión de llenado alta, el volumen todavía puede subir el gasto: hasta una PCP de 18-20.» |
| `iam-vd` | Ees del VD ↓ | PVC/PCP ↑, VD dilatado, FEVI normal; menor mortalidad (p. 40) | «Falla el derecho: la PVC sube más que la PCP y el VD empuja el tabique.» |
| `taponamiento` | derrame (gravedad) | patrón del cardiogénico (Tabla 14.1); PVC ≈ PCP, que la eco separa (cap. 18 p. 4); VCI que no colapsa | «El líquido aprieta las cuatro cámaras: las presiones se igualan. Lo separa la eco.» |
| `tep-intermedio` / `tep-alto` | resistencia pulmonar (gravedad) | VD dilatado sin hipotensión / con inestabilidad (cap. 22 p. 7) | «Intermedio: el VD sufre y la PA aguanta. Alto riesgo: el VD ya no puede.» |
| `tep-bolo` | `tep-alto` + bolo 500 mL | el VD se dilata más, el tabique empuja al VI y el GC no sube (cap. 22 p. 10) | «Más volumen al VD que no puede: empuja al VI. Guía los fluidos con la eco, como mucho 500 mL.» |
| `rotura-papilar` / `rotura-septo` / `rotura-pared` | M7 | IM aguda / cortocircuito / hemopericardio (p. 38) | «En las primeras 24 h, no tardías: el IAM puede romper el corazón.» |
| `diseccion` | nicardipino solo ↔ esmolol primero | con el vasodilatador solo, el barorreflejo sube FC y contractilidad (fisiología general del motor) y la ficha pide no subir FC ni GC (p. 51) | «Bajar la PA sin frenar el corazón aumenta la fuerza que despega la pared: primero el betabloqueante.» |
| `posparo` | Ees ↓ transitorio | aturdimiento que suele resolverse en 72 h (cap. 21 p. 64) | «Tras la parada, el corazón está aturdido: puede caer en shock en horas y recuperarse en días.» |
| fármacos | ver la tabla de la pieza 4 | NA <10 µg/min: β, sube el GC; >10: α, sube la RVS; a 30, techo (p. 12-13). Adrenalina: sube el lactato aeróbico (p. 14). Fenilefrina: bradicardia refleja, VS ↓ (p. 15). Vasopresina 0,03-0,04 U/min, no titulable (p. 16). Dobutamina: FC +5-15 lpm (p. 43). Milrinona: hipotensión (p. 44). NTG: precarga y poscarga ↓ (cap. 18 p. 9). Furosemida IV: vasoconstricción aguda y retorno ↓ → GC ↓ (p. 10) | p. ej. NA a 25 µg/min: «Por encima de 10 manda el α: la RVS sube y la PAM llega a 65. A 30 hay que pensar en el segundo vasopresor.» |
| soporte | M6 | balón, Impella, ECMO, venteo (p. 45-49) | Balón: «Se infla en la diástole y empuja la sangre a las coronarias; al vaciarse, el VI eyecta contra menos presión.» ECMO: «El flujo que vuelve por la aorta frena al VI: hay que ventearlo.» |
| `ic-etapa-1/2/3` (ficha 13) | gravedad del fallo en 3 tiempos | Fig. 18.3 (p. 6, un paciente real; lectura del gráfico): PCP 10 → 20; FC 80 → 100 y VS 60 → 40; IC 3,5 → 2,0 con PCP 30 | 1 «Lo primero que sube es la PCP: aparece la disnea.» 2 «Baja el VS y la FC compensa.» 3 «Cae el gasto: IC descompensada.» |

**Paciente posible en todo el recorrido** (prueba nueva): PAM 40-130, FC 40-170, IC 1,2-5, PVC 0-25, PCP 2-35, VS 15-110,
SvO₂ 30-85 %. Hoy fallan tres extremos (hallazgo 1).

### 4.2 Receptores animados (`receptores-animados.js`)

Se quedan los 8 fármacos. Se añaden (perfil en la pieza 4, mismo diagrama paso a paso):
- **Milrinona**: inhibe la fosfodiesterasa → no se degrada el AMPc → más Ca²⁺ en el miocito; además vasodilata (cap. 16 p. 44).
- **Levosimendán**: sensibiliza los miofilamentos al Ca²⁺ y abre canales de K⁺ del músculo liso (vasodilata) (p. 44).
- **El mastocito** (ficha 12): la adrenalina frena la degranulación por receptores β; el betabloqueante lo impide y el
  glucagón «puede restaurar la respuesta» (cap. 17 p. 66). Cómo lo hace el glucagón **no lo dice la fuente**: si se
  dibuja, va rotulado «fisiología general» (hueco 10).
Cada fármaco del receptor lleva «Ver en el motor» (la cabecera con ese fármaco puesto).

### 4.3 Capilar vivo (`data-capilar-vivo`)

| Estado | Qué se ve | Cifras (página) | Frase viva |
|---|---|---|---|
| `shock-bajo-flujo` | el gasto **leído del motor** (hipovolémico o cardiogénico): la extracción sube hacia el 50 % | extracción 20-30 %, hasta ~50 %; ScvO₂ 65-75 % normal, <50 % aporte inadecuado (cap. 14 p. 9-10) | «Llega menos sangre: el tejido saca más O₂ de cada gota, hasta la mitad. Más allá, lactato.» |
| `sepsis` (ya existe) + **PO₂ del músculo** | un medidor de PO₂ tisular junto a la célula | ~13 mmHg sano frente a ~33 mmHg en la sepsis grave (Fig. 17.3, p. 58-59; la gráfica, recreada) | «En la sepsis al tejido le sobra O₂: no lo usa. Dar más O₂ no ayuda.» |
| `epinefrina-lactato` | la adrenalina enciende la glucólisis con O₂ de sobra | lactato ↑ por producción aeróbica (cap. 14 p. 14) | «Este lactato no es falta de O₂: lo fabrica la adrenalina.» |
| **lupa neutrófilo** (nueva; la forma `neutrofilo` ya existe del bloque 2) | la Fig. 17.1 viva: la NADPH oxidasa añade electrones de uno en uno: O₂ → superóxido → H₂O₂ → radical hidroxilo (con Fe²⁺) o hipoclorito (con Cl⁻ y mieloperoxidasa) | consumo de O₂ ×20 durante 15-20 min, sin ATP (cap. 17 p. 53-54) | «El estallido respiratorio no respira: quema O₂ para fabricar lejía contra los microbios.» |
| `peroxinitrito` (lupa neutrófilo) | el superóxido se come el NO del endotelio | O₂·⁻ + NO· → ONOO⁻ (p. 55) | «Se pierde el NO que abre el vaso y nace un tóxico más potente.» |
| `fuga` (lupa neutrófilo) | el glucocálix y el endotelio dañados dejan salir agua | permeabilidad ↑ y edema (p. 55); en la sepsis, hipovolemia (p. 57) | «Las especies reactivas abren rendijas en el capilar: se escapa el agua.» |
| `reperfusion` (lupa neutrófilo) | el H₂O₂ viaja por la sangre y en otro órgano encuentra Fe²⁺ | posible mecanismo del FMO tras la sepsis o la reperfusión de una parada (p. 55) | «El H₂O₂ cruza membranas: el daño viaja a órganos lejanos.» |

### 4.4 Río y mar (`data-agua-viva`)

| Estado | Qué se ve | Cifras (página) | Frase viva |
|---|---|---|---|
| `clase-i` … `clase-iv` | el deslizador de hemorragia que ya existe, con su rótulo de Clase | Tabla 15.1 (cap. 15 p. 22): <15 %, 15-30 %, 31-40 %, >40 %; volemia 66 mL/kg en el varón, 60 en la mujer (p. 21) | «Clase II: el río baja pero la marisma lo rellena.» |
| `relleno` | la marisma devuelve agua al río en horas | hasta 1 L, a costa del intersticio (p. 21) | «El cuerpo se transfunde a sí mismo: hasta un litro desde la marisma.» |
| `fig-15-1` | hemorragia de 2 L (de 5 a 3 L): Hto 45 % a la hora; reponer con salino → Hto 27 %; con sangre completa → 45 % | Fig. 15.1 (p. 24, la lámina real al lado) | «A la hora el Hto no ha cambiado; después lo cambia lo que tú infundes.» |
| `cristaloide-2l` | 2 L de cristaloide en 1-2 h | ~500 mL (25 %) quedan en el plasma y ~1,5 L van al edema; 2 L ≈ 15 % del volumen plasmático de 70 kg (cap. 14 p. 11) | «Pones dos litros y el río solo gana medio: el resto inunda la marisma.» |
| `coloide-cristaloide` | 500 mL de coloide frente a 1 L de Ringer | Tabla 15.4 (×1 frente a ×3, p. 29) y Fig. 15.3 (p. 27) | «El coloide se queda en el río; el cristaloide se reparte.» |
| `fuga-35` | la marisma se traga hasta un tercio del río (anafilaxia) | 35 % del volumen intravascular; 1-2 L de cristaloide o 500 mL de albúmina 5 % en 5-10 min (cap. 17 p. 67) | «Con la fuga, casi todo el cristaloide acaba en la marisma: añade coloide.» |
| `acumulacion` | balance positivo de días en el séptico | la acumulación empeora la supervivencia; igualar las pérdidas diarias (cap. 17 p. 60) | «Tras la reanimación, cada litro de más se queda en la marisma.» |

### 4.5 Vaso que sangra (`data-vaso-vivo`)

| Estado | Qué se ve | Cifras (página) | Frase viva |
|---|---|---|---|
| `tic` | la proteína C activada por el endotelio dañado apaga los factores V y VIII y enciende la fibrinólisis: el fibrinógeno cae | TIC en el 40 % al ingreso, ×6 la mortalidad (cap. 15 p. 30) | «La herida misma estropea la coagulación: no hace falta haber diluido nada.» |
| `acidosis-frio` | pH <7,2 apaga los factores; el frío despega las plaquetas | p. 30 | «Ácido y frío: la tríada que impide cerrar.» |
| `uno-uno-uno` | bolsas CH:PFC 1:1 y 1 de plaquetas cada 5; calentador a 37 °C; calcio, crio y ácido tranexámico | Fig. 15.4 (p. 31): 1 g de gluconato cálcico por cada 2 CH (calcio iónico 1,2-1,3), crio 2 U si fibrinógeno <100, ácido tranexámico 1 g + 1 g en 8 h | «Reponer lo que se pierde como se pierde: sangre entera por piezas.» |
| **lupa TEG** (nueva) | la copa que gira, el pin y el trazo que dibuja R, k, α, MA y LY30; cada valor anómalo enciende su intervención | normales del texto (p. 32) y anómalos de la Tabla 15.5 (p. 33), con su nota de fuentes; la Fig. 15.5 real al lado | «Cada tramo del trazo es una pieza: tiempo (factores), ángulo (fibrina), altura (plaquetas), caída (lisis).» |
| **`placa`** (nuevo, sub-bloque 3B) | una arteria coronaria con su placa: la mieloperoxidasa (hipoclorito) la oxida, se rompe en una bifurcación, salen lípidos, se pegan plaquetas y la fibrina cierra la luz | Fig. 20.1 (cap. 20 p. 38-39; la real al lado) | «El infarto es un coágulo sobre una placa rota, no una falta de O₂.» |
| `placa-antiagregantes` | aspirina, inhibidores P2Y12 y GPIIb/IIIa (ya dibujada en el vaso) cortan su paso | Tabla 20.4 (p. 47-48) | «Dos antiagregantes antes de la angioplastia; la «superaspirina» para el intervencionista.» |
| `trombolisis` | el activador convierte el plasminógeno unido a la fibrina en plasmina, que corta los hilos; si cae el fibrinógeno, sangra | mecanismo (p. 44); permeabilidad 73-85 %; sangrado 10 %, grave 1 %, con fibrinógeno <100 → crio (p. 45) | «La plasmina corta la fibrina del coágulo; con el fibrinógeno bajo, también la de las heridas.» |
| `tep-lisis` | el trombo pulmonar: la heparina no lo disuelve, impide el siguiente; tras la lisis se libera trombina | cap. 22 p. 9-11 | «Anticoagular no deshace el émbolo: evita el siguiente. Tras la lisis, sigue la heparina.» |

La cascada con la warfarina vaciando II, VII, IX y X (lupa del telar, ya en el vaso) sirve a la ficha 17.

### 4.6 Otros modelos con un estado o una lupa

- **Catéter vivo** (`data-cateter-vivo`): estados `fig-15-2` (16 G y 18 G, periférico de 1,2" frente a central de 8":
  10,8 · 5,4 · 2,3 · 0,9 L/h, cap. 15 p. 25) y `tabla-15-3` (hematíes: 5/7 mL/min sin diluir, 39/49 con 100 mL de salino,
  183/448/1.000 presurizados, p. 28). Y en su lupa de los frascos, `hemocultivos-sepsis`: 2 sets detectan ~90 % y 3 sets
  ~98 %, ≥20 mL por set, uno puede ser de un catéter (cap. 17 p. 61-62).
- **Muralla viva** (`data-muralla-viva`): su estado `motor-fmo` (el intestino como motor del FMO, cap. 4) explica la
  lesión posresucitación del cap. 15 (reperfusión esplácnica, p. 33-34) y la translocación de la Clase II y del séptico.
  Solo enlace y una frase nueva con su página del cap. 15.
- **Telar vivo** (`data-telar-vivo`; la femoral de Andrés): estado `tvp` y **lupa eco de compresión** (la vena con trombo
  no se aplasta; con Doppler, flujo lento o nulo; dúplex con S ≥95 % y E ≥97 %, cap. 22 p. 4). Dibujo del telar; no
  abre la anatomía del ecógrafo.
- **Glomérulo vivo** (`data-glomerulo`): estado `congestion` (la presión venosa renal baja el gradiente; la
  autorregulación sostiene el flujo hasta PAM <70; cap. 18 p. 7). Es la orden «PVC alta» que ya pedía el mapa (§1.2).
- **Nefrona viva** (`data-nefrona-viva`): su estado `furosemida` (ya existe) para la ficha 14, con la resistencia por
  hipoalbuminemia como frase nueva con página (cap. 18 p. 12).

---

## 5. Modelo nuevo: **el corazón eléctrico** (sub-bloque 3C) · maqueta `autonomo/maquetas/b3-ritmo.html`

### 5.1 ¿Hace falta? Sí, y explica más que este bloque
El cap. 19 explica las arritmias por **mecanismos que se pueden ver**: reentrada por dos vías del nodo AV con periodos
refractarios distintos (p. 29), vía accesoria que se salta el nodo (p. 27), bloqueo AV transitorio de la adenosina
(p. 29), actividad auricular desorganizada (p. 20). Ningún modelo de la app dibuja la conducción: el ecógrafo es
mecánica y el ECG de la escena del potasio es un trazo sin corazón. Un R1 que **ve** el circuito entiende por qué la
adenosina corta una taquicardia nodal y no una TV, o por qué el diltiazem puede matar a un WPW.

**Fichas que explicaría**: las 7 del 3C (15-18, 22-24; 113 ideas) y la ficha 19 (ST); fuera de Marino: El Libro Azul
`cardio-fisiologia-aplicada` (sistema de conducción y sus velocidades: **solo enlace**, otra fuente), Manual UMI
`umi-marcapasos`, Marino `mt-bzd-betabloq` (bradicardias y bloqueos), `ma-hipotermia` (onda de Osborn real, Fig. 43.1),
`mr-hiperk-*`, `mr-hipopotasemia` y `mr-magnesio-*` (el trazo de ECG común, pieza 6): **≈15 fichas**. Por concepto
(REGLAS §7.11): «el corazón eléctrico», no «el cap. 19»; cada estado guarda sus fuentes en lista.

### 5.2 Qué se ve (390 × ~560, grabado crema y oro como el vaso y el río y mar)
1. **Arriba, el corazón en corte de 4 cámaras** (contorno de grabado) con el sistema de conducción como **hilo de oro**:
   nodo sinusal, aurículas, nodo AV (con sus **dos vías**, lenta y rápida, que se ven en la lupa), His, ramas y Purkinje.
   El impulso es una **chispa** que recorre el hilo; las cámaras se encienden (despolarización) y se contraen al paso.
2. **Debajo, la tira de ECG** en papel milimetrado (pieza 6), sincronizada con la chispa, y **la presión arterial** (en
   la FA, leída del motor con M9). En la parada, una tercera tira: la **ETCO₂**.
3. **Lupas**: «El nodo AV» (las dos vías y el circuito de la reentrada), «La vía accesoria» (WPW), «La cicatriz» (TV),
   «El QT» (torsade: fármacos de la Tabla 19.5 y K⁺, Ca²⁺ y Mg²⁺ bajos que alargan el QT).
4. **Junto al trazo vivo, el ECG real del libro** del mismo ritmo (Figs. 19.2, 19.3, 19.6, 19.7, 19.9, ya en la app):
   «así se ve de verdad».
5. **Dock**: Ritmo (chips) · Fármaco (diltiazem, amiodarona, digoxina, esmolol, metoprolol, adenosina 6/12 mg, magnesio)
   · Maniobra (vagal, modificada) · Choque (sincronizado / no sincronizado, julios) · Parada (compresiones, profundidad,
   insuflaciones/min, adrenalina, minuto del choque).
6. Frase viva, «Explícamelo» (3-5 pasos que siguen la chispa) y «Ver en la ficha» en cada cifra.

### 5.3 Estados con nombre (cifra y página del PDF del cap. 18-21)

| Estado | Lo que se ve | Cifras (página) | Frase viva |
|---|---|---|---|
| `sinusal` | chispa ordenada; P antes de cada QRS | QRS ≤0,12 s (p. 18) | «Un solo director: el nodo sinusal. Cada P trae su QRS.» |
| `taqui-sinusal` | el mismo camino, más rápido | >100 lpm; «la taquicardia puede no ser el problema» (p. 18) | «Busca la causa: aquí el ritmo es la respuesta, no la enfermedad.» |
| `fa` | las aurículas tiemblan (ondas finas), el nodo AV deja pasar chispas al azar | sin P, RR irregular (p. 20); 2-4 % de los adultos (p. 21) | «Sin director: la aurícula tiembla y no empuja; el nodo deja pasar lo que puede.» |
| `fa-farmaco` | la FC baja con diltiazem, amiodarona o digoxina: la Fig. 19.5 viva hasta 6 h | diltiazem cruza 100 lpm hacia las 2-2,5 h; amiodarona y digoxina no la alcanzan en 6 h (lectura de la Fig. 19.5, p. 24); diltiazem 55 % en 1 h, hipotensión 20-30 % (p. 22-23) | «El diltiazem frena el nodo antes; la digoxina tarda horas.» |
| `flutter` | un circuito grande en la aurícula derecha | dientes de sierra; QRS estrecho regular (p. 19) | «Un solo circuito que gira: la aurícula dibuja sierras.» |
| `tam` | tres o más focos auriculares | P de varias formas, PR variable, irregular; EPOC; Mg 2 g + 6 g en 6 h, 88 % (p. 28) | «Muchos directores pequeños: busca el pulmón enfermo y el magnesio.» |
| `nodal` (AVNRT) | lupa del nodo AV: un latido prematuro baja por la vía lenta y sube por la rápida | sin P visibles; 140-250 lpm; 50-60 % de las PSVT (p. 29) | «La chispa da vueltas dentro del nodo AV: cada vuelta, un latido.» |
| `vagal` | el freno vagal enlentece el nodo | Valsalva 24 %, masaje carotídeo 9 %, Valsalva modificada 44 % (p. 29) | «A veces basta con frenar el nodo un instante.» |
| `adenosina` | bloqueo AV transitorio: el circuito se rompe; 1-2 min de efecto | 6 mg en bolo + lavado, 12 mg a los 2 min; >90 %; la mitad por vía central (p. 29-30) | «La adenosina corta el nodo unos segundos: si el circuito pasa por él, se rompe.» |
| `wpw` | la vía accesoria salta el nodo; en FA, bloquear el nodo empuja todo por la vía | PR corto y onda delta; los bloqueantes del nodo pueden precipitar una FV (p. 27) | «Con una vía accesoria, frenar el nodo abre la autopista: cardioversión o amiodarona/procainamida.» |
| `tv` | un circuito alrededor de una cicatriz del VI (el mecanismo, fisiología general: hueco 15) | QRS ancho regular, 140-200 lpm; disociación AV y latidos de fusión (p. 31-32); con cardiopatía, 95 % de los QRS anchos (p. 32) | «Con cardiopatía, un QRS ancho es una TV hasta que se demuestre lo contrario.» |
| `aberrancia` | una taquicardia supraventricular que baja por una rama bloqueada | Fig. 19.6 real: al convertir, el QRS no cambia (p. 31) | «QRS ancho no siempre es ventricular: si es irregular, piensa en FA con aberrancia.» |
| `torsade` | la lupa del QT: QRS que giran alrededor de la línea | QTc >0,5 s de riesgo; Tabla 19.5; hipoK, hipoCa, hipoMg (p. 34); Mg 1-2 g en 15 min (p. 35) | «Un QT largo deja la puerta abierta: los QRS giran.» |
| `cardioversion` | todas las células se despolarizan a la vez y el nodo sinusal vuelve a mandar | 100 J bifásicos (frente a 200 J monofásicos) en la FA (p. 25); 100 → 200 J en la TV, no 360 (p. 32) | «Un choque sincronizado resetea a todos a la vez.» |
| `stemi` (ficha 19) | la tira con ST elevado y su regla de mm | Tabla 20.1 (cap. 20 p. 41): ≥2 mm en varones y ≥1,5 en mujeres en V2-V3, ≥1 mm en el resto, en ≥2 derivaciones contiguas | «Mide el ST en el punto J, en dos derivaciones vecinas.» |
| `fv` | chispas sin orden en los ventrículos; la presión se aplana | la supervivencia cae con el minuto del primer choque: 40 % a los 5, 29 % a los 10, 19 % a los 15, 9 % a los 20 (Fig. 21.1, cap. 21 p. 59) | «Cada minuto sin choque se pierde una de cada diez vidas.» |
| `aesp` / `asistolia` | hay chispa pero el motor no late / no hay chispa | no se desfibrila; las 4 T del texto y las 5 T + H de la figura, con su nota de fuentes (p. 60-61) | «Hay ritmo pero no pulso: busca la causa.» |
| `rcp` | compresiones (100-120/min, 5-6 cm) producen un flujo pequeño; la ETCO₂ lo sigue | Fig. 21.4 (p. 63): con RCE sube de ~27 a ~32 mmHg en 20 min; sin RCE baja de ~19 a ~7; umbral 10-15 a los 20 min | «La ETCO₂ es el gasto que consiguen tus manos.» |
| `rcp-adrenalina` | la presión de perfusión coronaria sube con la adrenalina y dura ~3 min | +30 % (texto, p. 61-62; la Fig. 21.3 se lee mayor: nota, hallazgo e) | «La adrenalina cierra la periferia y empuja sangre a las coronarias, unos 3 minutos.» |
| `rcp-insuflaciones` | 30 insuflaciones/min no dejan vaciar el pulmón: PEEP intrínseca, menos retorno | hasta 30/min, el triple de lo recomendado (p. 58) | «Ventilar deprisa en la RCP aprieta el corazón desde fuera.» |
| `rce` | el motor vuelve a latir; la ETCO₂ sube | ~70 % de los RCE no sobreviven a la hospitalización (p. 64) | «Recuperar el pulso es el principio: ahora empieza el síndrome posparo.» |

**Paciente posible**: FC 30-250 (la de cada ritmo en la ficha), QRS 0,06-0,20 s, QTc 0,35-0,65 s, ETCO₂ 0-45 mmHg.
**No se dibuja**: el mecanismo iónico (canales), los 5 tipos de PSVT ni la anatomía exacta de la vía accesoria (la fuente
no los da). La cicatriz de la TV y las ondas de la FA van rotuladas «fisiología general».
**Láminas reales**: los ECG de las Figs. 19.2, 19.3, 19.6, 19.7 y 19.9 y la presión arterial de la Fig. 19.4 (ya en
`js/modules/cardiologia/img/`). Las gráficas 19.5, 21.1, 21.3 y 21.4 se recrean vivas y la real va al lado como lámina.
**Dos direcciones para la maqueta**: **A · Grabado anatómico** (lo de arriba: el corazón en corte con el hilo de oro) y
**B · El plano del metro** (la conducción como un plano de líneas y estaciones: SA, aurículas, nodo AV con su doble
andén, His, ramas; los impulsos son trenes y la reentrada, un tren que vuelve por la otra vía). Recomiendo **A con la lupa
del nodo AV en estilo B**: el corazón entero se reconoce y el circuito se entiende.
**Alternativa barata** (si el usuario no quiere un modelo nuevo): el trazo de ECG común (pieza 6) con chips de ritmo y la
FA en el motor (M9), sin conducción dibujada. Cubriría el reconocimiento (fichas 15 y 22) pero no los mecanismos (17-18):
la cobertura de 3C bajaría de ≈94 % a ≈80 %.

---

## 6. Las tablas por ficha

Columnas como en los bloques 1 y 2. «→» separa las preguntas de una cadena; *predice* = se contesta antes de que el
modelo enseñe la cifra (tapada). Examen: lo que se pregunta y **la trampa** que lo hace difícil (sale de la propia fuente).

### 6.A · Sub-bloque 3A · El shock

| Ficha | Modelo y estado | Guía socrática | Examen MIR (trampa) | Casos | Para profundizar | Cob. |
|---|---|---|---|---|---|---|
| 1 `mc-definiciones` (cap. 14, p. 1-18) | Cabecera: chips de los 4 tipos a fondo; capilar `shock-bajo-flujo` y `sepsis`; río y mar `cristaloide-2l` | Si el shock fuera «PA baja», ¿por qué hay shock con PA normal y PA baja sin shock? (`#shock-definicion`, 5 % de sanos) → *predice*: de PAM = GC × RVS + PAD, ¿cuál cae en cada tipo? (cabecera, 4 chips) → ¿por qué 3 de 4 tienen la RVS alta? (vasoconstricción compensadora; el barorreflejo del motor) → cardiogénico y taponamiento dan el mismo patrón: ¿qué los separa? (la eco) → ¿por qué monitorizar la PAM y no la sistólica? (M10: misma media, sistólica +20) → *predice* (`cristaloide-2l`): 2 L en 1-2 h, ¿cuánto queda en el plasma? (500 mL) → *predice* (capilar `sepsis`): ¿qué hace la ScvO₂? (≥80 %) → *destapa* «son dos cosas»: si la hipotensión fuera consecuencia, ¿qué dejaría de tener sentido? | Tabla 14.1 de un paciente (PVC alta, GC bajo, RVS alta: cardiogénico **u** obstructivo) — trampa: elegir uno · Frecuencias: vasodilatador 66 %, hipovolémico y cardiogénico 16 %, obstructivo 2 % · Manguito pequeño **sobreestima**; uno grande no da error relevante (p. 6) — trampa: al revés · Indirecta frente a directa: hasta 55 mmHg (−15 a +40) · Tabla 14.3: extracción ≥50 % = aporte inadecuado, <20 % = extracción inadecuada; ScvO₂ <50 / >80 — trampa: cruzarlas · Shock séptico: objetivo de extracción <80 % (p. 18) frente a <20 % «inadecuada» de la Tabla 14.3 (pregunta con la nota de fidelidad) · Deshidratación: rara vez shock (sube la presión oncótica) · Nota de fuentes del catéter de AP (cap. 14 frente a cap. 16) | S2 (paso 1: el selector de la Tabla 14.1 de la ficha) | `#tabla-14-2` (tallas de manguito) · `#pa-indirecta` (método oscilométrico y Korotkoff) | 23/25 |
| 2 `mc-vasopresores` (p. 11-16; cap. 17 p. 61) | Receptores (8 + mastocito, milrinona, levosimendán) → cabecera `septico` con NA, adrenalina, dopamina, fenilefrina, vasopresina | ¿Por qué la NA «preserva el gasto» a dosis bajas? (β <10, α >10) → *predice* (cabecera, NA de 5 a 30 µg/min): ¿qué sube primero, el GC o la RVS? → al llegar a 30, ¿qué haces? (segundo vasopresor) → *predice* (adrenalina): ¿qué le pasa al lactato y por qué engaña? → ¿por qué la vasopresina no se titula? → la fenilefrina «no recomendada»: ¿en qué dos sitios sí? (séptico con FA rápida, opinión del autor; TSVI dinámico) → *destapa* «son tres pasos»: extravasación, ¿qué haces y en qué orden? (parar y aspirar sin lavar; fentolamina 5-10 mg en 10 mL; antes de 12 h) | Dopamina por tramos: ≤3 dopaminérgico, 3-10 β, >10 α — trampa: «a dosis renal protege el riñón» (la ficha solo dice que aumenta el flujo regional) · Vasopresina 0,03-0,04 U/min y la errata U/h (con la nota) · Resistencia a NA: ≥0,2 µg/kg/min (cap. 14) frente a 0,25-0,5 (cap. 17): nota de fuentes, no se elige · Adrenalina 2.ª (cap. 14) o 3.ª (cap. 17) · Angiotensina II: PA en el 67 %, trombosis 13 % frente a 5 % (PAI-1) · Midodrina 20 mg/8 h no acelera la retirada · Vía periférica hasta 48 h; línea media 7 días; intraósea como puente · PAM ≥65 sostiene la autorregulación cerebral; la HTA crónica como motivo de más, no validada | S2, S4 | `#midodrina` (la diálisis) · `#dopamina` (presión intraocular a 1-4 µg/kg/min) | 20/22 |
| 3 `mc-hemorragico-clasificacion` (cap. 15, p. 21-24, 34) | Río y mar `clase-i`…`clase-iv`, `relleno`, `fig-15-1`; cabecera `hipovolemico-ii/iii/iv` | ¿Por qué el cuerpo tolera perder el 75 % del hígado y no el 30 % de la sangre? (bomba sensible al volumen) → ¿cuánta sangre tiene un varón de 75 kg y una mujer de 60? (66/60 mL/kg) → *predice* (`relleno`): ¿cuánto devuelve la marisma? (hasta 1 L) → *predice* (cabecera, 20 → 35 %): ¿qué cae antes, la PA o la orina? → en Clase II, ¿por qué el intestino es el primero en sufrir? (vasoconstricción esplácnica, translocación) → *predice* (`fig-15-1`): a la hora de perder 2 L, ¿qué Hto? (45 %) → y tras el salino (27 %) → *destapa* «son dos razones»: ¿por qué la Hb de urgencias no mide la pérdida? | Tabla 15.1 de un paciente de 80 kg: pierde 25 mL/kg (2 L): Clase III (21-30 mL/kg) — trampa: usar el % sin calcular la volemia · Clase I: el relleno la repone, sin reanimar; Clase II: cristaloides; III: sangre; IV: transfusión masiva · El Hto baja en 8-12 h y tarda días en completarse · Objetivos de la Fig. 15.6 con sus dos notas (Hb 7-9 frente a 7-8; R y k) · Lactato ↔ en Clase II y ↑ en III | S1 | — (el dato del trauma 25-49 años no cuenta) | 16/17 |
| 4 `mc-hemorragico-fluidos` (p. 24-29) | Catéter vivo `fig-15-2`, `tabla-15-3`; río y mar `coloide-cristaloide`, `reanimacion` (ya existe); la bolsa | *predice* (catéter vivo): mismo calibre, periférico corto o central largo: ¿cuánto más pasa? (×5) → y de 18 a 16 G (×2) → *predice* (`tabla-15-3`): 1 CH por gravedad en un 18 G (5 mL/min): ¿qué lo acelera más, diluir o presurizar? → ¿por qué los CH no suben el gasto? (viscosidad) → *predice* (río y mar): 500 mL de coloide frente a 1 L de Ringer, ¿cuál sube más el IC a la hora? (Fig. 15.3) → si el coloide gana, ¿por qué se prefirió el cristaloide y por qué hoy se limita? → calcula con la calculadora de la ficha (Tabla 15.4) el volumen para una Clase II | Puerto lateral del introductor: 25 % del flujo — trampa: usarlo para infundir rápido · Infusión rápida: hasta 1 L/min, 300 mmHg, calentado · Fig. 15.3 a los 30 min la sangre completa supera al plasma; a los 60, al revés (cruce hacia el minuto 40) · PFC −18 °C, 230 mL; plasma líquido hasta 26 días; crio 10-15 mL con fibrinógeno y VIII; concentrado 20 g/L sin descongelar · Hemorragia sin shock: Hb 7-8, PFC si INR >1,5, plaquetas <50.000 — trampa que cruza fichas: el objetivo de plaquetas del damage control es ≥100.000 · Tabla 15.4: ×3 el cristaloide porque queda el 20-25 % | S1 | `#sangre-o` (bajo título) · `#sangre-completa` (militar frente a civil) | 18/20 |
| 5 `mc-damage-control` (p. 29-35) | Vaso `tic`, `acidosis-frio`, `uno-uno-uno`, lupa **TEG**; muralla `motor-fmo` | ¿Qué cuatro cosas hace distinta la reanimación de control de daños? → *predice* (cabecera `hipovolemico-iii`, PAS 80-90): ¿qué vigilas para que bajar la PA no hipoperfunda? (lactato, diuresis) → ¿cómo puede sangrar quien no ha recibido ni un litro de suero? (`tic`: proteína C) → *predice* (`uno-uno-uno`): ¿qué tres cosas añades a las bolsas? (Ca, crio, ácido tranexámico) → *predice* (lupa TEG): R 11, α 58, MA 50, LY30 8 %: ¿qué intervención por cada uno? → ¿por qué el INR no ve lo que ve la TEG? → *destapa* «son tres factores»: a las 72 h falla el pulmón, ¿qué lo favoreció? | TIC: 40 % al ingreso, ×6 la mortalidad · Hipotensión permisiva: menos transfusión y coagulopatía; efecto en mortalidad **inconsistente** — trampa: «mejora la supervivencia» · TEG con warfarina: la R no se alarga; el INR es la única medida fiable · Tabla 15.5 frente a los normales del texto (nota de fuentes) · Lesión posresucitación: 48-72 h, pulmón primero, mortalidad 50-60 % según órganos, >6 CH en 12 h; >3 días: buscar sepsis de origen intestinal · Ácido tranexámico: 1 g + 1 g en 8 h (aquí sí; en la trombólisis del SCA, desaconsejado: cruza con la ficha 20) | S1 | `#teg` (el ROTEM: copa fija y pin que gira) · el protocolo de cirugía cardíaca (enlace a Sobrevivir a la UMI) | 20/22 |
| 9 `mc-inflamacion-ros` (cap. 17, p. 52-56, 67) | Capilar: lupa **neutrófilo**, `peroxinitrito`, `fuga`, `reperfusion` | ¿Por qué se llama «estallido respiratorio» si no fabrica ATP? → *predice* (lupa): el O₂ recibe un electrón: ¿qué sale? (superóxido) → y luego (H₂O₂ → hidroxilo con Fe²⁺ o hipoclorito con MPO) → ¿qué demuestra la enfermedad granulomatosa crónica? → *predice* (`peroxinitrito`): ¿qué pierde el vaso cuando el superóxido encuentra NO? → *predice* (`reperfusion`): ¿cómo llega el daño a un órgano lejano? (H₂O₂) → ¿por qué la mortalidad depende del número de órganos? (Fig. 17.2) → *destapa* «son dos»: ¿por qué dar O₂ o transfundir podría ser contraproducente? | Fig. 17.2: 1 órgano ~23-24 %, 2 ~38-44 %, 3 ~65-68 %, ≥4 ~75-85 % (lectura del gráfico) · Tabla 17.1: médula → anemia del crítico; nervio → polineuropatía; músculo → miopatía y rabdomiólisis — trampa: emparejar mal · Radical = un electrón desapareado (el H₂O₂ **no** es radical) · Superóxido y dolor inflamatorio · Estrés oxidante = ROS > antioxidantes | S5 | `#estallido` (incidencia de la enfermedad granulomatosa, 1:200.000) | 15/16 |
| 10 `mc-shock-septico` (p. 57-62) | Cabecera `septico`, `septico-tardio`; capilar `sepsis` + PO₂ del músculo; río y mar `fuga`, `acumulacion`; catéter vivo `hemocultivos-sepsis` | Si la mortalidad no depende del germen, ¿qué es lo que mata? → ¿por qué se abandonó el SRIS? (<50 % infectados) → y si el 70 % no tiene infección documentada, ¿a qué responde el huésped? → *predice* (cabecera `septico`): ¿qué hacen el GC y la RVS? → *predice* (`septico-tardio`): ¿qué significa que el gasto caiga? → *predice* (PO₂ del músculo): ¿más alta o más baja que en un sano? → entonces, ¿qué dice el lactato aquí? (combustible, no hipoxia; pronóstico) → *predice* (`acumulacion`): tras 3 días con +6 L, ¿qué haces con los sueros? → *destapa* «son tres»: Tabla 17.2 en la primera hora | Tabla 17.2: vasopresina con NA 0,25-0,5 µg/kg/min (18-35 µg/min en 70 kg); hidrocortisona 50 mg/6 h con NA o adrenalina **≥0,25** — trampa: dar los corticoides «porque bajan la mortalidad» (resolución 1,5 días antes, misma supervivencia) · 30 mL/kg de **peso ideal** · NA por vena periférica **proximal a la fosa antecubital** · Hemocultivos: 2 sets ~90 %, 3 ~98 %, ≥20 mL · SARM: retirar si cultivos y frotis nasal negativos · Sospecha de multirresistente: 2 antibióticos con cobertura gramnegativa · ScvO₂ alta engañosa; gap de PCO₂ útil · NA inmunosupresora (opinión del autor y estudios: señal de alarma) | S2 | `#sepsis-epidemiologia` (1 de cada 5 muertes en el mundo) · `#sepsis-definiciones` (la definición de 1992) | 24/26 |
| 11 `mc-shock-toxico` (p. 62-64) | Cabecera `septico` con fuga intensa; río y mar `fuga` (la ficha es sobre todo consulta) | ¿Qué hace una toxina para dar fallo multiorgánico en 48 h? (linfocitos T, tormenta de citocinas) → ¿por qué el hemocultivo casi nunca ayuda en el estafilocócico? → abre la calculadora de la ficha (selector estafilo o estrepto) con un caso → ¿por qué clindamicina en **todos**? (inhibe la toxina) → *destapa* «son dos»: ¿qué te hace pensar en una fascitis aunque la piel parezca normal? (dolor desproporcionado; RM o eco a pie de cama) | Tabla 17.3: hemocultivos <5 % estafilo frente a 60 % estrepto; mortalidad <2 % menstrual, 6 % no menstrual, 35 % estrepto — trampa: cruzarlas · Sin fuente: 35 % estafilo, ~45 % estrepto · 40 % de los estafilocócicos, con la menstruación · Exantema que descama a las 2-3 semanas; edema sin fóvea · Fuente: retirar tampón y DIU, erradicar la colonización nasal, drenar; desbridar en el estreptocócico | S5 | `#tss-clinica` (cianosis distal y órgano por órgano) | 16/17 |
| 12 `mc-anafilaxia` (p. 64-67) | Cabecera `anafilactico`; río y mar `fuga-35`; receptores: el mastocito | ¿Qué fármaco **para** la reacción y cuáles solo alivian? → *predice* (mastocito): ¿qué le pasa a la adrenalina con un betabloqueante? → ¿y qué la devuelve? (glucagón) → *predice* (`fuga-35`): ¿cuánto volumen puede perder y qué fluido añades? → ¿cuál es la manifestación más pasada por alto? (SCA: Kounis) → ¿y por qué en un joven sin coronariopatía? (vasoespasmo 73 %) → *destapa* «son tres»: ¿por qué no basta con corticoide y antihistamínico? | Tabla 17.5: 1:1.000 IM en el muslo (0,3-0,5 mL); 1:10.000 IV en la parada; 1:100.000 en infusión 5-15 µg/min; 1:100 nebulizada — trampa: 1 mg IV en la anafilaxia · Subcutánea: absorción más lenta · Glucagón 1-5 mg en 5 min + 5-15 µg/min; vómitos → decúbito lateral · Vasopresina **no evaluada** en la anafilaxia; 2.º vasopresor NA o fenilefrina · Bifásica hasta 72 h · Mortalidad 0,25-0,33 % · Kounis: 73 % espasmo, 22 % rotura de placa, 5 % trombosis del stent | S4 | `#tabla-17-4` (frecuencias de cada manifestación) | 19/20 |

### 6.B · Sub-bloque 3B · La bomba que falla

| Ficha | Modelo y estado | Guía socrática | Examen MIR (trampa) | Casos | Para profundizar | Cob. |
|---|---|---|---|---|---|---|
| 6 `mc-cardiogenico-fisio` (cap. 16, p. 37-41) | Cabecera `cardiogenico`, `cardiogenico-pcp-baja`, `iam-vd`, `rotura-*`, `taponamiento`; Guyton (Fig. 16.2: la curva de función se aplana) | ¿Cuánto VI hay que perder para entrar en shock? (≥40 %) → *predice* (Guyton): ¿adónde se mueve el punto del paciente cuando falla la bomba? (Fig. 16.2) → y entonces, ¿qué separa el shock de la IC? (hipoperfusión: PA, diuresis, lactato) → *predice* (`cardiogenico-pcp-baja`): ¿siempre está alta la PCP? (no en el 30 %) → *predice* (`iam-vd`): ¿qué sube más, la PVC o la PCP? → *predice* (`rotura-papilar`): a las 18 h, soplo y PCP 32: ¿tardía? (no: primeras 24 h) → *destapa* «son tres excepciones» | Fig. 16.1: VI 79 %, papilar 7 %, septo 4 %, VD 3 %, pared libre 1 % · IAM 2/3 de los cardiogénicos (cap. 16) frente a SCA ~50 % (cap. 14): categorías distintas, no discrepan · IAM → shock en el 5-10 % · IC <2,2 (normal 2,4-4,0); sin hipotensión ~5 % · Inflamación sistémica en el 20-40 %, con RVS más baja (NO) y más mortalidad — trampa: «el cardiogénico siempre tiene la RVS alta» · TSVI dinámico: Doppler continuo en apical 4 cámaras; betabloqueante no vasodilatador · Agudización de IC crónica hasta el 30 % · Postcardiotomía 2-5 % | S3 | `#periparto` (1:3.000-4.000; factores; 7-20 %) · `#postcardiotomia` (aturdimiento) | 20/22 |
| 7 `mc-cardiogenico-farmaco` (p. 41-44) | Cabecera: bolo hasta PCP 18-20; NA; dobutamina, milrinona, levosimendán (receptores y motor) | ¿Por qué la PCP óptima es 18-20 y no 25? (presión oncótica 28 normal, 20-25 en el crítico) → *predice* (cabecera, bolo con PCP 12): ¿sube el IC? → *predice* (NA 5 µg/min): ¿y la FC? → ¿por qué la dopamina y la adrenalina perdieron frente a la NA? (arritmias, más muertes) → *predice* (dobutamina): ¿cuánto sube la FC? (5-15) → *predice* (milrinona en hipotenso): ¿qué pasa con la PAM? → *destapa* «son dos»: ¿por qué los fármacos son un puente corto? (aumentan el trabajo; no retrasar el soporte) | Tabla 16.2: PCP 19-20 (tabla) frente a 18-20 (texto), nota de fuentes · IRVS 25-30 Wood; IC ≥2,5; SvO₂ >50 · NA 5 µg/min (0,05 µg/kg/min), 5-30 · Fenilefrina «más apropiada» en el TSVI dinámico; inotrópicos **contraindicados** ahí — trampa: dobutamina en la obstrucción dinámica · Milrinona: 50 µg/kg en 10 min y 0,375-0,75; semivida 2,5 h que se alarga en la IR · Levosimendán: infusión limitada a 24 h pese a semivida de 80 h; no aprobado en EE. UU. · Usa la calculadora «¿Estoy en objetivo?» de la ficha | S3 | `#tabla-16-3` (ajuste renal de la milrinona por ClCr) | 19/20 |
| 8 `mc-soporte-mecanico` (p. 45-49) | Cabecera · soporte: `balon`, `impella`, `ecmo`, `ecmo-venteo` (Wiggers y asa vivos; Figs. 16.3-16.5 reales al lado) | *predice* (balón): ¿cuándo se infla y por qué en la diástole? → ¿qué hace al vaciarse? (succión: poscarga ↓, VS ↑) → ¿por qué no en una insuficiencia aórtica? (la fuente lo contraindica) → *predice* (Impella): ¿pulsátil o continuo y cuánto? (2,5-5,5 L/min) → *predice* (`ecmo`): ¿qué le pasa a la PCP y por qué? (poscarga ↑) → ¿cómo lo arreglas? (balón, Impella o venteo) → *destapa* «son dos»: cuál eliges con edema y fallo respiratorio y por qué | Balón: 35-40 mL de **helio**; ninguna supervivencia mejor; contraindicado en IAo y disección · Pérdida de pulso distal **sin** déficit sensitivomotor no obliga a retirar — trampa: retirarlo · Fiebre 50 %, bacteriemia 15 % · Impella: hemólisis 5-10 %; contraindicado con prótesis aórtica o trombo en el VI · ECMO: sangrado 41 %, sepsis 30 %, isquemia 17 %, compartimental 10 %, ictus 6 %, amputación 5 % · Supervivencia al alta 42 % · «Puente a ningún sitio» si se empieza con FMO | S3 | `#iabp` (lista completa de complicaciones) · `#ecmo` (canulación y calentador) | 20/22 |
| 13 `mc-ic-tipos` (cap. 18, p. 1-8) | Circulación viva: `hipertrofia`, `dilatada`, `tep` (ya existen) + `ic-etapa-1/2/3`; asa P-V (EDPVR); glomérulo `congestion` | ¿Qué separa la disfunción sistólica de la diastólica: la presión o el volumen? (el VTD, >97 mL/m²) → *predice* (asa P-V, `hipertrofia`): ¿cómo es la FE y por qué cae el VS? → *predice* (`tep`): el VD se dilata: ¿qué le hace al VI? (interdependencia) → ¿por qué la PVC tarda en subir en la IC derecha? (restricción pericárdica) → *predice* (`ic-etapa-1/2/3`): ¿qué sube primero? → *predice* (`congestion`): PVC 20 con PAM 80: ¿el riñón filtra? → *destapa* «son dos»: ¿por qué el BNP sirve más para excluir? | Tabla 18.1: ≥50 / 41-49 / ≤40; normal ≥55, ≥50 en la IC (la poscarga baja la FE 5-10 %) — trampa: FE 52 % «es reducida» · HFpEF ≥50 % de las IC izquierdas · VD normal ≈ 2/3 del VI; FEVD normal >45 % · PVC ≥ PCP: IC derecha **o** taponamiento (la eco los separa) · Cardiorrenal: sin correlación con el GC; autorregulación hasta PAM <70 · BNP <100 y NT-proBNP <300; NT-proBNP 3-5 veces más alto; más bajo en obesos · Tabla 18.2: anemia, edad, sepsis, TEP también lo suben | C1 | `#ic-epidemiologia` (6,7 millones) · `#vd-medidas` (2D frente a 3D y RM) | 26/28 |
| 14 `mc-ic-manejo` (p. 9-15) | Cabecera: NTG, nitroprusiato, furosemida, CPAP (M8); nefrona viva `furosemida`; calculadoras de la ficha | ¿Qué decide el tratamiento inicial? (la PA) → *predice* (cabecera, PA 190/100, NTG): ¿qué bajan, precarga o poscarga? (las dos) → *predice* (furosemida IV con PA alta): ¿qué hace la RVS en los primeros minutos? (sube: renina) → *predice* (`hipertrofia` + furosemida): ¿y el gasto en la HFpEF? → *predice* (CPAP): ¿por qué sube el VS del VI? (presión transmural) → recorre el asistente de furosemida de la ficha con un paciente → *destapa* «son tres razones» para no abusar del diurético | NTG: 5 µg/min, +5 cada 5 min, 5-100; >200 no; taquifilaxia a las 24 h; **80 %** se pierde en PVC (vidrio y polietileno) · Nitroprusiato: 20 % resistentes a NTG; 0,2 → 2-5, máx. 10; >3 sostenido → cianuro; tiosulfato 500 mg; no en IR, IH ni cardiopatía isquémica (robo) · Furosemida: 40 mg (60-80 en IR); a las 2 h, <1 L → doblar; 200 sin respuesta = resistencia; oral 50 % · Equivalencias 40 = 1 = 20 · Infusión continua: 80 mg; FGe ≥30 → 5 mg/h; <30 → 20 mg/h; objetivo ≥100 mL/h · iSGLT2 en HFrEF y HFpEF; cetoacidosis euglucémica · ARM: no con FG <30 | C1 | `#tabla-18-5` (dosis de inicio y objetivo) · `#nitroglicerina` (propilenglicol y metahemoglobina) | 24/26 |
| 19 `mc-sca-diagnostico` (cap. 20, p. 38-41) | Vaso **`placa`** (Fig. 20.1 viva); corazón eléctrico `stemi` (3C) | ¿Qué rompe la placa y dónde suele romperse? (inflamación; bifurcaciones) → *predice* (`placa`): ¿qué sale de la placa y qué atrae? → ¿qué une la mieloperoxidasa con la lejía? (hipoclorito; lupa del neutrófilo) → oclusión completa, parcial o intermitente: ¿qué síndrome da cada una? → ¿por qué el alivio con NTG no prueba nada? (espasmo esofágico) → calcula con la calculadora de la ficha un delta de troponina | Tabla 20.1: ST ≥2 mm varones y ≥1,5 mujeres en V2-V3; ≥1 en el resto; posterior: descenso V1-V3 con T positiva — trampa: aplicar 1 mm en V2 · hs-cTn: ingreso y 1 h; >p99 con ≥3 h; cambio >10 % — trampa: sepsis o IC «dan el mismo cambio agudo» (no) · Bloqueo de rama o marcapasos con sospecha → como STEMI · ECG en <10 min · Dolor improbable si punzante, localizado, pleurítico o reproducible | C4 | `#sca-historia` (1980) | 15/16 |
| 20 `mc-sca-tratamiento` (p. 41-52) | Vaso `placa-antiagregantes`, `trombolisis`; cronómetro de la ficha | *predice* (Fig. 20.2 viva): ¿a partir de qué retraso sube la mortalidad? (>120 min) → si no hay ICP y el traslado tardará más, ¿qué haces y en cuánto? (lisis en <30 min) → *predice* (`trombolisis`, Fig. 20.3): ¿cuándo deja de ayudar? (12 h) → ¿qué hace la plasmina y por qué sangra con el fibrinógeno bajo? → *predice* (`placa-antiagregantes`): ¿qué bloquea cada antiagregante? → *destapa* «una idea»: si el infarto fuera falta de O₂, ¿por qué no lo da el shock? | Trombólisis sin beneficio en el NSTEMI — trampa: usarla si no hay ICP en un NSTEMI · NSTEMI inestable: ICP urgente; si no, 24-72 h · Tenecteplasa por peso (30-50 mg) · Sangrado 10 %, grave 1 %; fibrinógeno <100 → crio; ácido tranexámico **desaconsejado** (cruza con la ficha 5) · O₂ solo si SaO₂ <90 % · Betabloqueante: evitar con PAS <120; contraindicado con cocaína · HNF 60 U/kg + 12 U/kg/h (nota de la errata «60 U») frente a la del TEP (80 + 18): contextos distintos, no discrepan · Ticagrelor: no con HIC previa; prasugrel: no con ictus/AIT reciente · Aspirina: 1 vida por cada 42 | C4 | `#tabla-20-4` (dosis de los IIb/IIIa) · `#sca-anticoagulacion` (bivalirudina y fondaparinux en la TIH) · `#sca-largo-plazo` | 23/26 |
| 21 `mc-diseccion-aortica` (p. 50-52) | Cabecera `diseccion`: nicardipino solo frente a esmolol primero; Fig. 20.4 (TC real) | ¿Por qué un SCA puede ser una disección? (propagación retrógrada a una coronaria) → *predice* (cabecera, nicardipino solo): ¿qué hace la FC? (el barorreflejo la sube) → ¿por qué eso empeora la disección? (cizalla) → ¿por qué el dolor que se calma es una trampa? → *destapa* «son dos»: ¿por qué opioides pronto? | Hallazgos: HTA 50 %, IAo 50 %, pulsos desiguales 15 %, mediastino ancho 60 % (normal hasta 20 %), ECG isquémico 15 % (normal 30 %) — trampa: «Rx normal descarta» · Imagen: RM 98/98, ETE 98/77, TC 94/87, aortografía 88/94 · PAS objetivo 120 (90 se tolera) · Mortalidad +1-2 %/h; ~60 % muere sin cirugía; la reparación la baja hasta ~10 % · Vasodilatador **siempre** con betabloqueante; labetalol en monoterapia | C4 | `#diseccion-fisio` (Marfan; tipo A anterógrada y retrógrada) | 15/16 |
| 25 `neumo-ep-diagnostico` (cap. 22, p. 1-7) | Circulación viva `tep`; telar `tvp` + lupa **eco de compresión** | Si en la autopsia hay émbolos en el 30 % y solo se confirma el 10 % de las sospechas, ¿qué dice eso de nuestra clínica? → PaO₂ normal: ¿descarta? (30 % la tiene normal) → ¿por qué el dímero D no sirve en la UCI? (80 % elevado) → *predice* (lupa compresión): ¿qué le pasa a una vena con trombo al apretar? → si hay TVP proximal, ¿hacen falta más pruebas? → ¿qué tiene que pasar para no anticoagular un subsegmentario? (las 4 condiciones: checklist de la ficha) → *destapa* «son dos»: qué signos de la eco son específicos | Tabla 22.1: ningún VPP >50 %; taquicardia VPN 86 % · Dímero D: VPP 27 %, VPN 92 % — trampa: «alto = probable» · Eco venosa: TVP en 30-50 % de las EP; S ≥95, E ≥97 · CTPA: VPN 95 %; evitar contraste con ClCr <30; 15 mSv frente a 0,02 de una Rx y 50 de límite anual · V/Q: normal excluye; alta probabilidad confirma; ¾ indeterminadas; indeterminada + eco venosa negativa excluye solo en estables · Trombos móviles 2-18 %; McConnell 20 % · TVP de brazo: EP <10 %; retirar el catéter | C6 | `#tvp-brazo` · `#vq` (los 2 mSv y el valor diagnóstico del 20-30 %) | 24/26 |
| 26 `neumo-ep-manejo` (p. 7-12) | Cabecera `tep-intermedio`, `tep-alto`, `tep-bolo`, NA frente a dobutamina; vaso `tep-lisis` | ¿Qué tres cosas deciden el riesgo? (VD, troponina, inestabilidad) → usa el clasificador de la ficha → *predice* (`tep-bolo`): 500 mL a un VD que falla: ¿sube el gasto? → *predice* (dobutamina con hipotensión): ¿qué hace la PAM? (vasodilata) → ¿por qué la NA? (no sube la resistencia pulmonar) → ¿por qué seguir la heparina tras la lisis? (trombina liberada) → *destapa* «son dos»: si la lisis está contraindicada, ¿qué queda? | Tabla 22.3: rivaroxabán 15/12 h ×3 semanas → 20; apixabán 10/12 h ×7 días → 5/12 h — trampa: «la dosis alta aumenta el sangrado» (no) · ClCr ≤30: warfarina + enoxaparina 1 mg/kg/día hasta INR; enoxaparina hasta ClCr 15 · Intermedio: enoxaparina 1 mg/kg/12 h 24-48 h · Alto: HNF por **peso real** 80 U/kg + 18 U/kg/h; PTT 46-70 s; >130 kg o IMC ≥40 → peso ajustado (Ec. 22.1: calculadora de la ficha) · tPA 100 mg en 2 h; 0,6 mg/kg en 15 min (máx. 50) si colapso · Contraindicaciones absolutas: cirugía, trauma o TCE en 3 semanas · Lisis sistémica: sangrado 10-12 %, HIC 1-2 %; mayor beneficio <48 h · Filtro: dos indicaciones; profiláctico −60 % de EP y +70 % de TVP | C6 | `#filtros` (diseño Greenfield, 75 % sin obstruir, recuperables 2003, biodegradable 60 días) · `#filtro-experiencia` (nunca se infectan) | 25/28 |

### 6.C · Sub-bloque 3C · El ritmo y la parada

| Ficha | Modelo y estado | Guía socrática | Examen MIR (trampa) | Casos | Para profundizar | Cob. |
|---|---|---|---|---|---|---|
| 15 `mc-taqui-reconocimiento` (cap. 19, p. 18-20) | Corazón eléctrico: `sinusal`, `taqui-sinusal`, `nodal`, `flutter`, `tam`, `fa`, `tv`, `aberrancia` (con los ECG reales) | ¿Qué tres cosas miras en el ECG y en qué orden? → *predice* (corazón eléctrico, QRS estrecho): ¿dónde nace el impulso? → *predice* (`nodal`): ¿por qué no ves la P? → *predice* (`fa` y `tam`): las dos son irregulares: ¿qué las separa? (P de varias formas frente a ninguna) → *predice* (`aberrancia`): QRS ancho e irregular: ¿TV? | Corte del QRS 0,12 s · «La TV nunca es irregular» · Disociación AV = TV · Taquicardia sinusal: busca la causa · Ondas en sierra = flutter; QRS estrecho regular sin P = nodal — trampa: «sin P visibles = FA» (la FA es irregular) | C2, C3 | — | 8/8 |
| 16 `mc-fa-frecuencia` (p. 21-25) | Corazón eléctrico `fa`, `fa-farmaco` (Fig. 19.5 viva); circulación viva `fa` (M9) con `hipertrofia` | ¿Cuánto llenado aporta la aurícula y cuándo importa? (~25 %; llenado comprometido) → *predice* (`fa` + `hipertrofia`): ¿qué le pasa a la PAS tras un latido corto? (Fig. 19.4) → *predice* (Fig. 19.5 viva): ¿quién cruza 100 lpm antes? → ¿por qué la amiodarona da menos hipotensión que el diltiazem y de dónde viene la que da? (polisorbato 80) → ¿qué punto final es más fisiológico que una cifra de FC? (el déficit de pulso) → *destapa* «son dos interacciones» de la amiodarona | Tabla 19.1: diltiazem 0,25 mg/kg en 2 min + 5-15 mg/h; 55 % en 1 h, 90 % mantenido; hipotensión 20-30 % · Amiodarona 150 mg en 10 min, 1 mg/min ×6 h, 0,5 ×18 h, máx. 2,2 g · Esmolol (semivida 9 min) preferible a metoprolol · Digoxina sola **no** para el control agudo · Betabloqueantes 70 % · FA de UCI 2-44 %, resuelve sola el 25 %; FA postoperatoria hasta el 45 % en cirugía cardíaca o torácica, en los 5 primeros días · Ictus ×5 salvo primer episodio <48 h · Con WPW, ninguno de estos | C2 | `#amiodarona-iv` (paso a oral: 400 mg, 10 g de carga) · `#fa-epidemiologia` (clasificación temporal) | 19/20 |
| 17 `mc-fa-cardioversion` (p. 25-27) | Corazón eléctrico `cardioversion`, `wpw`; vaso: lupa cascada con warfarina | ¿A quién cardioviertes y con cuánto? → ¿qué miras antes? (trombo: ETE) → puntúa con la calculadora de la ficha → ¿en qué FA no sirve la escala? (valvular) → *predice* (`wpw`): FA rápida con onda delta: ¿qué le pasa si frenas el nodo? → *predice* (cascada): ¿qué factores vacía la warfarina y por qué necesita el INR? | Tabla 19.2: definido ♂ ≥2, ♀ ≥3 · Caídas **no** contraindican · Plaquetas <50.000 sí · Dabigatrán 150 mg/12 h (errata «50 mg» con su nota) · Apixabán reducido con 2 de 3 (≥80 años, ≤60 kg, Cr ≥1,5) frente a «todos los ACOD se reducen con ClCr <30» (p. 27): **la fuente no lo concilia** (hallazgo b) · Warfarina superior en la FA valvular · ACOD evitados con ClCr <15 · No anticoagular para cardiovertir si <48 h | C2 | `#doac` (anti-Xa en la IR) | 15/16 |
| 18 `mc-otras-taqui` (p. 28-35) | Corazón eléctrico `tam`, `nodal`, `vagal`, `adenosina`, `tv`, `aberrancia`, `torsade`, `cardioversion` | *predice* (`tam`): ¿qué corriges primero? (Mg, aunque el Mg sérico sea normal) → *predice* (`nodal`): ¿por qué empieza de golpe? (un ectópico entra en el circuito) → *predice* (`vagal`): ¿cuál funciona mejor? → *predice* (`adenosina`): ¿por qué la mitad por vía central? → QRS ancho con cardiopatía: ¿qué tratas? → si dudas, ¿qué prueba diferencia? (adenosina) → *predice* (`torsade`): ¿qué alarga el QT en esta hoja de tratamiento? → *destapa* «son tres»: torsade sin pulso | TAM: Mg 2 g en 15 min + 6 g en 6 h (88 %); metoprolol 80 %; verapamilo <50 % y no en HFrEF (nota del rango) · Adenosina: 6 → 12 mg; −50 % por vía central, con antagonistas del calcio, betabloqueante o dipiridamol; teofilina la bloquea; en el asma da disnea pero no broncoespasmo · TV: 100 J → 200; no 360 · Torsade: desfibrilación (no sincronizada) + Mg 1-2 g · QTc ≤0,44; >0,5 riesgo, pero valor predictivo limitado · TV polimórfica con QT normal → isquemia: amiodarona o betabloqueante — trampa: Mg «como en la torsade» (no es lo que dice) | C3 | `#tabla-19-4` (efectos de la adenosina en %) · `#psvt` (los 5 tipos) | 24/26 |
| 22 `mc-paro-soporte` (cap. 21, p. 55-61) | Corazón eléctrico `fv`, `aesp`, `asistolia`, `rcp`, `rcp-adrenalina`, `rcp-insuflaciones` (Figs. 21.1 y 21.3 vivas) | ¿Por qué 4 minutos? (1 L de O₂ a 250 mL/min) → *predice* (`fv`, deslizador del minuto del choque): ¿qué supervivencia a los 10 min? → *predice* (`rcp-insuflaciones`): 30/min: ¿qué le pasa al retorno? → ¿qué das tras el 2.º choque y tras el 3.º? → *predice* (`rcp-adrenalina`): ¿qué sube y cuánto dura? → ¿por qué la adrenalina no garantiza sobrevivir? (β: disfunción posresucitación) → *destapa* «son 4 T» del texto (y las 5 T + H de la figura) | Tabla 21.2: <10 s, 5-6 cm, 100-120/min, 30:2, tras IOT cada 6 s, rotar cada 2 min · Interrupciones hasta el 50 % del tiempo · 500-600 mL por insuflación · Intraósea preferida · 120-200 J bifásico; 2 min de compresiones antes de mirar el ritmo — trampa: comprobar el pulso tras cada choque · Amiodarona 300 + 150; lidocaína 1-1,5 mg/kg · 3 choques fallidos: ~5 %; ECMO si disponible · Tabla 21.1: buen estado funcional 7 % fuera y 1 % dentro del hospital (la cifra del libro) | C5 | `#tabla-21-1` (nº de casos) · `#svb-tiempo` (el ahogamiento en agua fría) | 22/24 |
| 23 `mc-paro-monitorizacion` (p. 62-64) | Corazón eléctrico `rcp` con ETCO₂ (Fig. 21.4 viva); capilar `capno-rcp` (ya existe); circulación viva `taponamiento` | Con ventilación constante, ¿qué mide la ETCO₂? (el gasto) → *predice* (`rcp`): comprimes más hondo: ¿qué hace la ETCO₂? → *predice* (Fig. 21.4): a los 20 min, 8 mmHg: ¿qué te dice? → si sigue por encima de 15, ¿hasta cuándo sigues? (1,5 h) → *predice* (`taponamiento` del motor en paro): ¿se colapsa el VD? (no es fiable con presiones bajas) → *destapa* «son dos»: por qué la «parada en la eco» no basta para parar | ETCO₂ basal ≈ PaCO₂ (40), menor con espacio muerto (EPOC) · 15 mmHg a los 20 min (otros: 10) — trampa: un único valor de 12 al minuto 5 · Eco: neumotórax S 91 %, E 99 % en supino · Cualquier derrame en la parada → pericardiocentesis · Parada en la eco del trauma: 100 % sin supervivencia, pero las guías no la usan sola | C5 | — | 13/13 |
| 24 `mc-posresucitacion` (p. 64-68) | Corazón eléctrico `rce`; cabecera `posparo`; capilar lupa neutrófilo `reperfusion` | Si el 70 % de los RCE muere en el hospital, ¿qué los mata? (cerebro, corazón aturdido, inflamación) → *predice* (`posparo`): ¿cuánto dura el aturdimiento? (72 h) → ¿por qué el O₂ de más daña aquí? (ROS de reperfusión) → ¿por qué el TTM pasó de 33 a 37,5 °C? → usa la calculadora de TTM de la ficha con 37,9 °C → *destapa* «son tres»: mioclonías el día 2, ¿qué haces? | Tabla 21.3: ≤37,5 °C 72 h; no recalentar 32-36 °C espontáneos; enfriar activamente si >37,7 °C · Tabla 21.4: O₂ si SaO₂ <90 %; PAM ≥75; NA mejor que adrenalina; glucemia 145-180 · Tabla 21.5: 7 predictores con su día — trampa: «pupilas abolidas el día 2» (es el día 4) · EEG isoeléctrico (<2 µV) también predice (texto, no tabla) · Descerebración: poco predictiva · 80-95 % despierta en 72 h; puede tardar 5 días · RCP exitosa 1-7 %; el 95 % del público espera más | C5 | `#rcp-percepcion` (la televisión y el 75 %) | 21/22 |

**Mira** (la vista Visual de cada ficha; pieza 1): recetas del kit con nodos por id. Las que aportan más: Tabla 14.1 en
`matriz` con `flechas` (ficha 1); Tabla 15.1 en `grados` (3); Fig. 15.2 y Tabla 15.3 en `barras` (4); Fig. 15.4 en `flujo` y
el intérprete TEG en `calculadora` (5); Fig. 16.1 en `barras` (6); IABP, Impella y ECMO en `comparar` (8); Fig. 17.1 en
`flujo` y Fig. 17.2 en `barras` (9); Tabla 17.3 en `comparar` (11); Tabla 17.5 en `escalera` (12); Tabla 18.1 en `grados` y
las etapas en `flujo` (13); Figs. 19.1 y 19.8 en `flujo` (15, 18); Fig. 19.5 en `linea` (16); CHA₂DS₂-VASc en `puntos`
(17); Figs. 20.2 y 20.3 en `linea` (20); S/E de la imagen en `barras` (21); Fig. 21.1 y Tabla 21.1 en `barras` (22);
Fig. 21.4 en `linea` (23); Tabla 21.5 en `requisitos` (24); Tabla 22.1 en `barras` (25); riesgo y Ec. 22.1 en `escalera` y
`calculadora` (26). Y en cada ficha, `figuras` con sus imágenes reales.

---

## 7. Los casos (REGLAS §8; el paciente se inventa, la medicina sale de la ficha)

Cada uno: 6-7 pasos con su momento; la ficha del paciente se rellena y lo nuevo sale en rojo; al menos un «encuentra el
error» (0-2 errores, con el enunciado diciendo cuántos) y un «piensa y destapa»; un giro; «Lo que te llevas» y la vuelta a
la ficha y al modelo en el estado del paciente. Cifras del paciente: del caso, coherentes entre sí (§1.12).

| Caso | Fichas | Pasos (momento · dato · pregunta) | Calculadora | Giro | Encuentra el error (errores) | Vuelta |
|---|---|---|---|---|---|---|
| **S1 · La navaja** (Mateo) | 3, 4, 5 | 1 · Urgencias, min 0: herida abdominal por arma blanca; FC 124, PA 86/60, lactato 4,1, Hb 13,8. *Test*: calcula la volemia (66 × 78 ≈ 5,1 L) y la Clase (III, 31-40 %); ¿por qué la Hb no te ayuda? · 2 · Min 5: *Test*: ¿qué vía? (dos periféricos cortos de 16 G; el central de 8" pasa la quinta parte; el puerto lateral del introductor, el 25 %) · 3 · Min 25: tras 2 L de salino, PA 98/64, Hto 41 → 35 %. *Error*: nota del R1 · 4 · *Destapa* «son cuatro»: los pilares del control de daños · 5 · Hora 1: 4 CH en 1 h; INR 1,7, fibrinógeno 90, plaquetas 98.000, Ca²⁺ iónico 0,95, T 35,1 °C, pH 7,18. *Test*: ¿qué añades? (1 g de gluconato cálcico por cada 2 CH, 2 U de crio, ácido tranexámico, calentar) · 6 · **Giro**, hora 1,5: con PAS 82 «permisiva», el lactato sube a 6,2 y la diuresis a 0,2 mL/kg/h. *Test*: ¿sigues igual? (no: la presión baja ya hipoperfunde; quirófano ya) · 7 · Día 3: PaO₂/FiO₂ cae y después la diuresis. *Destapa*: ¿qué es y qué la favoreció? (lesión posresucitación; tiempo en shock, cristaloides, >6 CH en 12 h) | TEG de la ficha (paso 5 bis: R 11, α 58, MA 50, LY30 8 % → plasma, crio, plaquetas, ácido tranexámico) | El lactato que sube convierte la hipotensión permisiva en hipoperfusión | «Ha vuelto a sangrar: el Hto bajó 6 puntos ✗. Subo la PAS a 120 para perfundir ✗. Pido CH y PFC 1:1 ✓. Caliento todo a 37 °C ✓.» (2) | río y mar `fig-15-1`; vaso `uno-uno-uno` |
| **S2 · La ScvO₂ que engaña** (Amparo) | 1, 2, 10 | 1 · Urgencias: pielonefritis obstructiva; T 39,2, FC 118, PA 78/40, lactato 4,6. *Test*: ¿qué tipo de shock? (selector de la Tabla 14.1 de la ficha: PVC baja, GC alto, RVS baja) · 2 · *Test*: peso real 76, ideal 58 kg: ¿cuánto volumen y en cuánto? (30 × 58 ≈ 1,75 L en 3 h) y ¿antibiótico cuándo? (1.ª hora, tras 2 sets de 20 mL) · 3 · Tras el volumen, PAM 58. *Error*: plan del R1 · 4 · Hora 3: NA 23 µg/min (0,3 µg/kg/min), PAM 62. *Test*: ¿qué añades? (vasopresina 0,03 U/min + hidrocortisona 50 mg/6 h; con la nota de fuentes del umbral) · 5 · Hora 6: ScvO₂ 84 %, lactato 3,9, gap de PCO₂ 4. *Destapa* «son dos»: ¿por qué la ScvO₂ alta no tranquiliza y qué te dice el gap? · 6 · **Giro**, día 2: hemocultivos con *E. coli* sensible; frotis nasal de SARM negativo. *Test*: ¿qué cambias? (retirar la vancomicina) · 7 · Día 3: balance +6 L. *Test*: ¿y los sueros? (igualar las pérdidas diarias) | Selector Tabla 14.1 (ficha 1) | Los cultivos retiran la cobertura del SARM | «Bolos hasta PVC 12 ✗. NA por una vía periférica proximal a la fosa antecubital mientras ponemos el central ✓. Empiezo a 5-10 µg/min ✓. Objetivo PAM 75 por su HTA ✗.» (2) | cabecera `septico`; capilar `sepsis` |
| **S4 · El betabloqueante** (Begoña) | 12, 2 | 1 · Planta, min 4 de amoxicilina-clavulánico IV: habones, sibilancias, PA 70/40. *Test*: ¿qué y por dónde? (adrenalina 0,5 mg IM en el muslo, 1:1.000) · 2 · Min 10: PA 72/40. *Test*: ¿qué solución y a qué ritmo? (1:100.000, 5-15 µg/min, ± bolo de 10 µg) · 3 · *Destapa*: ¿cuánto volumen y cuál? (puede perder el 35 %: 1-2 L de cristaloide o 500 mL de albúmina 5 % en 5-10 min) · 4 · *Error*: plan del R1 · 5 · **Giro**, min 30: refractaria; en su hoja, bisoprolol. *Test*: ¿qué das? (glucagón 1-5 mg en 5 min + 5-15 µg/min; de lado si vomita) · 6 · Hora 1: dolor torácico fugaz. *Test*: ¿qué es? (Kounis: espasmo en una paciente sin coronariopatía) · 7 · Día 2: *Test*: ¿cuándo puede irse? (bifásica hasta 72 h) | — | El betabloqueante explica la falta de respuesta | «Hidrocortisona IV para cortar la reacción ✗. Difenhidramina y ranitidina después de la adrenalina ✓. Adrenalina nebulizada por el estridor ✓. Si sigue hipotensa, vasopresina ✗.» (2) | cabecera `anafilactico`; receptores: el mastocito |
| **S5 · El dolor que no cuadra** (Nerea) | 11, 9 | 1 · 4.º día de posparto: 39,6 °C, exantema difuso, PA 82/44, dolor del muslo desproporcionado. *Test*: ¿qué sospechas? (TSS; posparto) · 2 · Selector TSS de la ficha → estreptocócico · 3 · *Error*: plan del R1 · 4 · *Test*: ¿qué prueba y qué conducta? (RM o eco a pie de cama; desbridamiento) · 5 · **Giro**: hemocultivos con *S. pyogenes* (60 % positivos en el estreptocócico). *Test*: ¿qué pronóstico? (35 %) · 6 · Día 2: riñón, pulmón y hígado fallan. *Destapa*: ¿por qué un órgano tras otro? (inflamación maligna; Fig. 17.2) | Selector TSS (ficha 11) | Los hemocultivos confirman lo que el exantema sugería | «Si es estreptococo, basta la penicilina ✗. La clindamicina, para cubrir anaerobios ✗. RM o eco para buscar la fascitis ✓. Desbridar cuanto antes ✓.» (2) | capilar lupa neutrófilo |
| **S3 · El infarto que se rompe** (Aurelio) | 6, 7, 8 | 1 · Hemodinámica, hora 0: IAM anterior; PA 84/58, FC 108, lactato 3,2, diuresis 0,3 mL/kg/h, crepitantes. *Test*: ¿IC o shock? (hipoperfusión) · 2 · Catéter de AP: PCP 14, IC 1,9, PVC 9, SvO₂ 48 %. *Test* con la calculadora de la ficha: ¿qué falla primero? (PCP no elevada: volumen hasta 18-20) · 3 · Tras 250 mL: PCP 19, IC 2,1, PAM 64. *Test*: ¿vasopresor? (NA 5 µg/min) · 4 · *Error*: plan del inotrópico · 5 · **Giro**, hora 18: soplo holosistólico nuevo, PCP 32, SpO₂ 86 %. *Test*: ¿qué es? (rotura del papilar, en las 24 h) · 6 · *Destapa* «son dos»: ¿qué soporte y qué vigilas? (ECMO VA con fallo respiratorio; la poscarga del VI: venteo) | «¿Estoy en objetivo?» (Tabla 16.2) | La rotura del papilar cambia de fármacos a soporte mecánico | «Milrinona, que da menos taquicardia: es la mejor con hipotensión ✗. Dobutamina a 3-5 µg/kg/min ✓. Su FC subirá 5-15 lpm ✓. Levosimendán 72 h por su semivida de 80 h ✗.» (2) | cabecera `rotura-papilar`, `ecmo-venteo` |
| **C1 · El edema de madrugada** (Rosario) | 13, 14 | 1 · 04:00: PA 196/104, FC 112, SpO₂ 84 %, crepitantes. *Test*: ¿qué primero? (NTG 5 µg/min, +5 cada 5 min; vidrio y polietileno) · 2 · *Destapa*: ¿por qué la CPAP ayuda al corazón? (poscarga del VI) · 3 · BNP 1.450 pg/mL; edad 79, Cr 1,9. *Test*: ¿qué te dice? (excluye mejor que confirma; la edad y el riñón también lo suben) · 4 · Eco: FEVI 60 %, VI hipertrófico. *Test*: ¿qué IC? (HFpEF) · 5 · **Giro**, 06:00: el R1 puso 80 mg de furosemida; PA 92/50, lactato 2,6, poca orina. *Test*: ¿qué pasó y qué haces? (el diurético bajó el gasto en una HFpEF; vasodilatador o un bolo) · 6 · *Error*: nota del R1 · 7 · Día 4: *Test*: ¿qué tratamiento a largo plazo tiene prueba en su IC? (iSGLT2) | Asistente de furosemida (ficha 14) | La FE conservada vuelve peligroso el diurético | «Nitroglicerina 72 h seguidas ✗. Si no responde, nitroprusiato, pero no con IR ✓. El edema siempre es sobrecarga ✗. La Cr subirá si sigue congestiva ✓.» (2) | circulación viva `hipertrofia` + furosemida |
| **C4 · El ST y la espalda** (Joaquín) | 19, 20, 21 | 1 · 08:00: dolor opresivo 40 min; ST +2,5 mm en V2-V4. *Test*: ¿STEMI? (≥2 mm en varones) · 2 · Centro sin ICP, traslado de 150 min. *Test*: ¿qué y en cuánto? (lisis en <30 min) · 3 · 84 kg: *Test*: ¿dosis de tenecteplasa? (45 mg) · 4 · *Error*: plan del R1 · 5 · **Giro**, 08:25: el dolor se va a la espalda, «desgarrador»; PA 168/90 en el brazo derecho y 132/80 en el izquierdo; soplo diastólico. *Test*: ¿qué descartas ya y cómo? (disección tipo A que ocluye una coronaria; TC con contraste o ETE) · 6 · *Destapa* «son dos»: ¿cómo bajas la PA? (esmolol primero; PAS 120; opioides) | Cronómetro puerta-aguja (ficha 20) | Los pulsos desiguales cambian el diagnóstico | «O₂ al 100 % aunque tenga SaO₂ 96 % ✗. Aspirina 162-325 mg masticada ✓. Metoprolol IV con PAS 110 ✗. Clopidogrel antes del traslado ✓.» (2) | vaso `placa`; cabecera `diseccion` |
| **C6 · La cadera** (Consuelo) | 25, 26 | 1 · Día 5 de prótesis de cadera: disnea súbita, FC 112, PaO₂ 88. *Test*: ¿la PaO₂ normal descarta? (30 % la tiene normal) · 2 · Dímero D 2.400. *Test*: ¿sirve? (no en la UCI) · 3 · Eco de compresión: femoral que no se aplasta. *Test*: ¿más pruebas? (no, salvo inestabilidad) · 4 · VD dilatado, troponina alta, PA 118/70. Clasificador de la ficha → intermedio. *Test*: ¿anticoagulante? (enoxaparina 1 mg/kg/12 h, 24-48 h) · 5 · **Giro**, hora 20: PA 78/50, FC 128 → alto riesgo; cirugía hace 5 días. *Test*: ¿lisis? (contraindicación absoluta: trombectomía mecánica) · 6 · 142 kg (IMC 55), peso ideal 52 (del caso): calcula la HNF con la calculadora (peso ajustado 88 kg; 80 U/kg y 18 U/kg/h) · 7 · *Error*: plan del R1 · *Destapa*: ¿cuántos fluidos? (≤500 mL guiados por la eco; NA) | Clasificador de riesgo y peso ajustado (ficha 26) | La cirugía reciente prohíbe la lisis | «tPA 100 mg en 2 h ✗. PTT objetivo 46-70 s ✓. Filtro de cava ya, por si acaso ✗. Para la hipotensión, noradrenalina: no sube la resistencia pulmonar ✓.» (2) | cabecera `tep-alto`, `tep-bolo`; telar `tvp` |
| **C2 · La lobectomía** (Teodoro) | 15, 16, 17 | 1 · Día 2 de lobectomía: 148 lpm, QRS estrecho irregular sin P. *Test*: ¿qué ritmo? · 2 · PA 108/66, 78 kg. *Test*: ¿qué y cuánto? (diltiazem ~20 mg en 2 min + 5-15 mg/h) · 3 · 40 min: PA 84/50, FC 118. *Test*: ¿y ahora? (amiodarona 150 mg en 10 min) · 4 · *Destapa*: ¿cuál es tu punto final? (el déficit de pulso; Fig. 19.4) · 5 · Día 3, sigue en FA: HTA, diabetes, 74 años. CHA₂DS₂-VASc de la ficha = 3 → anticoagular · 6 · **Giro**: la eco muestra una estenosis mitral significativa. *Test*: ¿qué cambia? (FA valvular: la escala no aplica, siempre anticoagular, warfarina; y explica por qué se hundió: llenado comprometido) · 7 · *Error*: plan del R1 | CHA₂DS₂-VASc (ficha 17) | La estenosis mitral convierte la FA en valvular | «No anticoagulo porque se cae ✗. Warfarina con INR 2-3 ✓. Ojo: la amiodarona potencia la warfarina ✓. Mejor un ACOD, que no necesita controles ✗.» (2) | corazón eléctrico `fa`; motor `fa` + `hipertrofia` |
| **C3 · El QRS ancho** (Hugo) | 15, 18 | 1 · Neumonía, cardiopatía isquémica: QRS ancho regular a 170, PA 118/72, consciente. *Test*: ¿qué es? (TV probable: 95 % con cardiopatía) · 2 · *Test*: ¿qué das? (amiodarona 150 mg en 10 min…) · 3 · *Destapa*: si dudas, ¿qué prueba y qué esperas? (adenosina: corta la PSVT, no la TV) · 4 · *Error*: plan del R1 · 5 · Día 3: haloperidol y claritromicina; K⁺ 3,1, Mg 1,4; QT 520 ms a 75 lpm. QTc de la ficha = 0,58 s · 6 · **Giro**: torsade sin pulso. *Test*: ¿qué haces? (desfibrilar, Mg 1-2 g, corregir K⁺ y Mg, retirar los dos fármacos) | QTc (ficha 18) | El QT largo cambia una TV monomórfica por una torsade | «Si se deteriora, cardioversión sincronizada a 100 J ✓. Si falla, 360 J ✗. Adenosina 6 mg por la vía central ✗. QRS ancho e irregular: pienso en FA con aberrancia ✓.» (2) | corazón eléctrico `tv`, `torsade` |
| **C5 · La planta 4** (Leandro) | 22, 23, 24 | 1 · Min 0: FV presenciada en planta. *Test*: ¿qué y cómo? (compresiones <10 s, 5-6 cm, 100-120; choque cuanto antes: 40 % a los 5 min) · 2 · Min 4: tras el 2.º choque sigue en FV. *Test*: ¿qué das? (adrenalina 1 mg cada 3-5 min) · 3 · *Error*: plan del R1 · 4 · Min 12: ETCO₂ 16 → 22 → 34. *Destapa*: ¿por qué sube antes de notar pulso? · 5 · RCE, comatoso. *Test*: Tabla 21.4 (O₂ solo si SaO₂ <90 %, PAM ≥75, NA, glucemia 145-180) · 6 · Hora 30: 38,0 °C. Calculadora de TTM → enfriar a 37,5 · 7 · **Giro**, día 2: mioclonías aisladas; la familia pregunta. *Test*: ¿qué dices? (no descartan recuperación; el estatus mioclónico sí; la exploración, el día 4) | ETCO₂ a los 20 min y TTM (fichas 23-24) | Las mioclonías aisladas no son el estatus mioclónico | «Insuflaciones a 30/min para oxigenar mejor ✗. Intraósea sin parar las compresiones ✓. Tras el 3.er choque, amiodarona 300 mg ✓. Pulso tras cada choque antes de seguir ✗.» (2) | corazón eléctrico `rcp` → `rce` |

**Lo que te llevas** (3 puntos cada uno): S1 la Hb no mide la pérdida · permisiva solo con lactato vigilado · 1:1:1 con
calcio, crio y ácido tranexámico guiados por la TEG. S2 30 mL/kg de peso ideal y antibiótico en la hora · NA → vasopresina
+ hidrocortisona · ScvO₂ alta engaña, el gap no. S4 adrenalina IM primero · betabloqueante → glucagón · hasta 72 h.
S5 exantema + FMO rápido = TSS · clindamicina siempre · desbridar. S3 hipoperfusión = shock · PCP 18-20 antes que fármacos ·
roturas en 24 h y ECMO con fallo respiratorio. C1 PA alta → vasodilatador · CPAP · en la HFpEF el diurético baja el
gasto. C4 ST con sus mm · lisis en 30 min si no hay ICP · pulsos desiguales = disección. C6 la PaO₂ y el dímero D no
descartan · cirugía en 3 semanas prohíbe la lisis · peso ajustado si >130 kg. C2 diltiazem y su hipotensión · déficit de
pulso · FA valvular = warfarina. C3 QRS ancho + cardiopatía = TV · adenosina diferencia · QT largo → torsade → Mg.
C5 cada minuto sin choque cuenta · la ETCO₂ es el gasto de tus manos · ≤37,5 °C y paciencia hasta el día 4.

**Cifras en su contexto** (§1.12; lo dicen en pantalla): el 0,25 µg/kg/min de la vasopresina es del **cap. 17** (el cap. 14
dice ≥0,2: nota); la HNF de 80 + 18 U/kg es del **TEP de alto riesgo** y la de 60 + 12 del **SCA**; las plaquetas
≥100.000 son del **damage control** (en la hemorragia sin shock, <50.000 para transfundir); el ácido tranexámico se da en
la **hemorragia** y se desaconseja tras la **trombólisis del SCA**; el 30 mL/kg es de **peso ideal**; la HNF del TEP usa
**peso real** salvo >130 kg o IMC ≥40.

---

## 8. Piezas comunes (se hacen primero; los demás las copian)

| # | Pieza | Qué es | Quién la usa |
|---|---|---|---|
| 1 | **Vista Visual de Merino Cardiología y Merino Neumología** | `js/modules/cardiologia/visual.js` y `js/modules/neumologia/visual.js` (copiar la estructura de `merino-hemato/visual.js`), con las recetas de §6 y los nodos por id (§3); llamada desde `merino-cardiologia.js` y `merino-neumologia.js`. Sin ella no hay Estudiar | Las 26 fichas (paso «Mira») |
| 2 | **Estudiar en Cardiología y Neumología** | `montarMayeutica` tras la Visual (como `merino-hemato/index.js`); datos `js/data/mayeutica/b3.js` + `b3-shock.js` (3A), `b3-bomba.js` (3B), `b3-ritmo.js` (3C); `ritmoVivo` en `MODELOS` de `mayeutica.js` si se aprueba | Las 26 fichas |
| 3 | **Perfusión y transporte de O₂, una sola vez** | `js/data/perfusion-data.js`: los cortes de las Tablas 14.3, 14.5, 16.2 y la Fig. 15.6, y las funciones de lactato, gap de PCO₂, ScvO₂/extracción y diuresis (hoy en `capilar-vivo-data.js`, se mueven aquí; el capilar las importa) | Cabecera del shock, capilar vivo, casos |
| 4 | **Fármacos vasoactivos, una sola vez** | `js/data/vasoactivos-data.js`: dosis de las Tablas 14.4, 16.3, 17.5, 18.3, 19.1 y 20.5; el perfil de receptores (hoy `RECEPTORES_FARMACO` en `merino-cardiologia.js`: se mueve aquí) y el efecto en el motor (dirección de la ficha y magnitud ilustrativa) | Receptores animados, cabecera, corazón eléctrico, selectores de las fichas |
| 5 | **Gravedad del motor** | M1 de §4.1 (y M2-M4), con las pruebas de magnitud y de paciente posible; regenerar `guyton-tablas.mjs` | Cabecera, Guyton, eco, los 4 accesos de la ficha 1 |
| 6 | **Trazado de ECG común** | `js/core/ecg-trazo.js`: el trazo de `potasio-escena.js` (sinusal, FA irregular, FV) sacado a pieza, con ritmos nuevos y su papel milimetrado; la escena del potasio pasa a usarla | Corazón eléctrico, FA del motor, escena del potasio |
| 7 | **Explicación guiada en el ecógrafo** | Que el simulador acepte `core/explicacion-guiada.js` con resaltes sobre sus filas del monitor, la eco, el Wiggers y el asa | Cabecera del shock (todos sus estados) |
| 8 | **Láminas del libro** | Extraer con `pdfimages` (o rasterizar y recortar) a `js/modules/cardiologia/img/`: Figs. 15.3 (p. 27), 15.4 (p. 31), 16.2 (p. 40), 17.1 (p. 54), 17.2 (p. 56), 17.3 (p. 59) del PDF de shock; 19.1 (p. 19), 19.5 (p. 24), 19.8 (p. 33), 20.2 (p. 43), 20.3 (p. 44), 21.1 (p. 59), 21.3 (p. 62), 21.4 (p. 63) del cardíaco; y 22.3 (p. 11, foto del filtro) del respiratorio. Son gráficas: se recrean vivas y la real va al lado | Mira, modelos |
| 9 | **La bolsa y el tubo** (ya existen, bloque 2) | Las bolsas de 1:1:1, PFC, crio y fibrinógeno de `core/bolsa.js` con sus cifras en `hemoderivados-data.js` (añadir plasma líquido y sangre completa con las de la ficha 4) | Vaso, río y mar, casos S1 |

Orden: 1 y 2 (sin ellas no hay Estudiar) y 5 (la que más fichas desbloquea; sus pruebas tardan ~3 min) → 3, 4, 7, 8 →
cabecera del shock (3A) → capilar, río y mar, vaso, catéter, receptores (3A) → soporte, M7-M8, vaso `placa` (3B) → 6 y el
corazón eléctrico (3C). Prefijos de ids libres: `cvs-` (cabecera), `rtm-` (corazón eléctrico), `mc-`/`nep-` (fichas).

---

## 9. Pacientes del bloque

| Nombre | Edad | Ingreso | Caso |
|---|---|---|---|
| Mateo | 34, varón, 78 kg | Herida abdominal por arma blanca: shock hemorrágico Clase III | S1 |
| Amparo | 58, mujer, 76 kg (ideal 58) | Pielonefritis obstructiva: shock séptico | S2 |
| Aurelio | 67, varón, 82 kg | IAM anterior: shock cardiogénico; rotura del papilar a las 18 h | S3 |
| Begoña | 52, mujer, 65 kg; toma bisoprolol | Neumonía; anafilaxia por amoxicilina-clavulánico | S4 |
| Nerea | 31, mujer, 60 kg | 4.º día de posparto: TSS estreptocócico | S5 |
| Rosario | 79, mujer, 62 kg; HTA, Cr 1,9 | Edema agudo de pulmón hipertensivo, HFpEF | C1 |
| Teodoro | 74, varón, 78 kg; HTA, diabetes, estenosis mitral (se sabe el día 3) | Día 2 de lobectomía: FA rápida | C2 |
| Hugo | 61, varón; cardiopatía isquémica | Neumonía: TV y, el día 3, torsade | C3 |
| Joaquín | 56, varón, 84 kg | Dolor torácico: STEMI que resulta disección tipo A | C4 |
| Leandro | 49, varón | Pancreatitis en planta: parada por FV | C5 |
| Consuelo | 63, mujer, 142 kg, 1,60 m (ideal 52, del caso) | Día 5 de prótesis de cadera: TEP intermedio que pasa a alto riesgo | C6 |

Ninguno de estos nombres sale hoy en `js/`, `autonomo/bloques/` ni `autonomo/maquetas/` (comprobado con grep). No repiten
a Andrés (62), la Sra. R. (64), Fermín (71), Rocío (67), Gonzalo (66), Inés (41) ni Salvador (47); S1 no repite la pelvis
de Salvador (aquí es una herida penetrante, que es donde la ficha 1 dice que la presión baja ayuda).

---

## 10. Huecos y hallazgos

**Huecos (la fuente no lo dice o el motor no lo hace; no se rellena):**
1. El lactato no tiene fórmula en la fuente: el del monitor es el ilustrativo del capilar.
2. La magnitud del efecto de cada fármaco en el motor: la ficha da la dirección y la dosis, no cuánto mueve la RVS o la Ees.
3. La pendiente de la diuresis con la PAM: solo el codo de 70 (autorregulación, cap. 18 p. 7).
4. Cifras del taponamiento (PVC, PCP): caps. 14-22 solo dan el patrón y la igualación PVC ≥ PCP (cap. 18 p. 4).
5. Obstrucción dinámica del TSVI en el motor y el ecógrafo (anatomía congelada).
6. Acinesia regional (McConnell; el SCA del cap. 20 no habla de eco).
7. Insuficiencia aórtica en el motor (contraindica el balón; la da la disección tipo A).
8. La ganancia del balón, la PCP con el ECMO y el «venteo»: la fuente los da sin cifras.
9. Qué hacer con la trombólisis o la antiagregación si se sospecha una disección: la fuente no lo dice.
10. Cómo restaura el glucagón la respuesta en el betabloqueado.
11. Dosis de enoxaparina en la obesidad mórbida (solo da el peso ajustado para la HNF).
12. Tratamiento del Kounis.
13. El objetivo de INR de una prótesis mecánica (la Tabla 19.3 da 2-3 para la FA): por eso C2 usa una estenosis mitral.
14. El mecanismo de la TV (reentrada alrededor de una cicatriz) y el de las ondas de la FA: «fisiología general».
15. Las velocidades de conducción: están en El Libro Azul (otra fuente): solo enlace.
16. Las Figs. 15.3, 17.2, 18.3, 19.5, 20.2, 20.3 y 21.4 dan curvas sin tabla: lecturas aproximadas, rotuladas.

**Hallazgos de fidelidad para el auditor** (se arreglan al poner los ids):
a. `mc-sca-tratamiento` no explica **cómo actúa el trombolítico** (plasminógeno unido a la fibrina → plasmina, que limita
   la fibrinólisis sistémica; cap. 20 p. 44). El vaso `trombolisis` lo necesita.
b. `mc-fa-cardioversion`: la p. 27 dice que **todos** los ACOD se reducen con ClCr <30, pero la Tabla 19.3 reduce el
   apixabán por otros criterios. Falta una nota «la fuente no lo concilia».
c. `mc-fa-cardioversion`: la Tabla 19.2 (con «definido ♂ ≥2, ♀ ≥3» y «considerar ♂ 1, ♀ 2») solo vive en el resultado de
   la calculadora: debería estar en el texto como tabla.
d. `mc-fa-frecuencia`, Tabla 19.1: «hipotención» (errata de la ficha).
e. `mc-paro-soporte`: el texto da +30 % de presión de perfusión coronaria con la adrenalina (p. 61-62); la Fig. 21.3 se
   lee de ~22 a ~33 mmHg. Si se recrea, nota «lectura del gráfico».
f. **El ecógrafo**: «TEP masivo» no tiene inestabilidad (PAM 88) y Marino define masiva = alto riesgo con inestabilidad
   (cap. 22 p. 7); «Derrame pericárdico» (PAM 95) se enlaza desde la ficha 1 como taponamiento. Con M1 se arregla; si no,
   renombrar («TEP con sobrecarga del VD», «Derrame»).
g. El acceso «Hemorragia de 1 L» de la ficha 3 es una Clase II (20 % de 4,85 L): el botón debería decirlo.
h. `mc-definiciones`: el bloque «Monitorización de la PA» no cita la p. 7 para el 62 % de error >10 mmHg; y `mc-pac-desuso`
   necesita el chip de su página (8).

---

## 11. Decisiones para el usuario (parada 1)

1. **Partir el bloque** en 3A (shock), 3B (la bomba) y 3C (el ritmo), con 6 paradas, o uno solo con 5 (§1).
2. **La cabecera del shock** dentro de la circulación viva (recomendado) en vez de un modelo de shock aparte. Maqueta
   `autonomo/maquetas/b3-shock.html`: el monitor y los mandos a 390 px en 4 estados (`hipovolemico-iii`, `septico` con NA a
   25 µg/min, `cardiogenico` con el balón y `taponamiento`).
3. **El corazón eléctrico**: modelo nuevo (recomendado, ≈15 fichas) o la alternativa barata (trazo de ECG con chips).
   Maqueta `autonomo/maquetas/b3-ritmo.html` con las direcciones A (grabado anatómico) y B (plano del metro) en 4 estados
   (`nodal` → `adenosina`, `fa` con la Fig. 19.5 viva, `wpw` y `fv` → `rcp`).
4. **Arreglar el motor** para que los escenarios lleguen a shock sin saltos (M1): toca el corazón de la app y sus pruebas;
   lo hace el director sin parar, salvo que el usuario quiera verlo antes.
5. ¿Las Mayéuticas de los modelos (cabecera, corazón eléctrico) usan las preguntas de las fichas (una sola fuente, como se
   decidió con el vaso) y añaden solo las de «predice y compruébalo»? Recomendado: sí.
