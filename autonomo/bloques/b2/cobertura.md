# Bloque 2 · Marino caps. 12-13 · Mapa de cobertura

*(Profesor, modo cobertura, 20/10/2026. Hecho con el texto completo de las 6 fichas de
`js/modules/merino-hemato/merino-hemato.html`, el PDF `docs/marino-2024-anemia-transfusion-hemostasia-uci.pdf` leído
entero página a página (38 págs.; cap. 12 = págs. 1-19, cap. 13 = págs. 20-38) y sus 9 figuras extraídas con
`pdfimages`, el capilar vivo y el telar vivo abiertos en el navegador a 390 px (estados `anemia`, `tih`, `hnf`,
`inflamacion`) y sus datos (`js/data/capilar-vivo-data.js`, `js/data/telar-vivo-data.js`).)*

**Páginas**: todas son del PDF (lo que va tras `#page=`). En este PDF la página del PDF es la que ya citan las notas
de la ficha (p. ej. «pág. 8» de la nota de la cirugía cardíaca, «pág. 24» de la 4Ts): no hay desplazamiento.
**Ids**: las fichas casi no tienen ids por sección (solo las 4 notas plegables y los `ts4-*`). «Para profundizar» y
«Ver en el texto» los necesitan: la tabla del §2 propone uno por sección, con el prefijo **`mh-`** (Merino HEMATO; está
libre en toda la app; `merino-` lo usan también los cuadernos de Cardiología y Neumología). En las tablas, `#x` = `#mh-x`.

---

## 0. El bloque en una pantalla

| Ficha | Modelo vivo y estados | Ideas | Cubiertas | % | Se ven en el modelo |
|---|---|---|---|---|---|
| 1 `merino-anemia` | **Capilar vivo ampliado**: `dilucion`, `anemia-compensada`, `techo-anemia` | 16 | 15 | 94 % | 6 |
| 2 `merino-transfusion` | **Capilar vivo ampliado**: `umbral-7`, `transfusion`, `anemia-hipovolemia` | 19 | 18 | 95 % | 6 |
| 3 `merino-riesgos` | **Capilar vivo ampliado**, lupa del alvéolo: `trali`, `taco` | 21 | 19 | 90 % | 7 |
| 4 `merino-trombocitopenia` | **Vaso que sangra** (nuevo): `sano`, `herida`, `plaquetas-100k`, `plaquetas-5k`, `pseudotrombocitopenia`, `sepsis`, `hit`, `hit-argatroban` | 25 | 23 | 92 % | 11 |
| 5 `merino-microangiopatias` | **Vaso que sangra**: `cid`, `cid-lena`, `ptt`, `ptt-recambio`, `shu` | 17 | 16 | 94 % | 12 |
| 6 `merino-plaquetas-plasma` | **Vaso que sangra**: `transfusion-plaquetas`, `refractariedad`, `pfc-inr`, `warfarina`, `hemorragia-masiva` | 22 | 20 | 91 % | 10 |
| **Bloque** | 2 modelos (uno ampliado, uno nuevo) | **120** | **111** | **≈92 %** | **52 (43 %)** |

**Cómo se cuenta** (igual que en el bloque 1): una idea importante es lo que un R1 tiene que saber o hacer (mecanismo,
cifra que cambia una decisión, corte, conducta). Está cubierta si la enseña el modelo en un estado, una pregunta de la
Guía, una del Examen o un paso de un caso. Las anécdotas (Burke, Hipócrates, el lema de la Cruz Roja como chiste) no
cuentan. El modelo enseña el 43 % (más que el 30 % del bloque 1): las 6 fichas tienen modelo vivo en su estado.

**Hallazgo que cambia el capilar** (ver §4): hoy el estado `anemia` del capilar tiene el gasto fijo en 5 L/min y con
Hb 7,5 la extracción llega al **51 %** («la extracción llega al 50 %», captura a 390 px). Eso es la cuenta del cap. 9
(Fig. 9.2, el contenido cae a la mitad), pero **contradice el cap. 12**: la anemia sube el gasto (viscosidad, p. 4-6,
Fig. 12.2) y la extracción no llega al 50 % hasta un **Hto del 10 % (Hb 3 g/dL)** (p. 6, Fig. 12.3). Si un R1 abre el
capilar desde la ficha de anemia tal como está, aprende que con Hb 7,5 el tejido está al límite: justo lo que el
capítulo desmonta. Hace falta la orden «el corazón compensa» (§4.1).

---

## 1. La ruta del bloque (orden de estudio)

| Etapa | Fichas | Modelo | Por qué aquí |
|---|---|---|---|
| 1 · La sangre que lleva el O₂ | 1 `merino-anemia` → 2 `merino-transfusion` | Capilar vivo (ya existe; se amplía) | Lo que más gana con un modelo hecho; sigue al grupo oxígeno del bloque 1 (`mar-transporte-o2`) |
| 2 · Lo que trae la bolsa | 3 `merino-riesgos` | Capilar: lupa del alvéolo; el reloj de 6 h en «Mira» | Cierra el cap. 12: transfundir tiene un precio |
| 3 · La herida | 4 `merino-trombocitopenia` | Vaso que sangra: `herida` → `plaquetas-*` → `hit` | Primero cómo se tapa un vaso; luego por qué bajan las plaquetas. Enlaza con el telar (TIH, bloque 1) |
| 4 · La red que se tapa | 5 `merino-microangiopatias` | Vaso: la red de microvasos | La trombosis, no el sangrado, es lo que mata (mensaje final del cap. 13, p. 36) |
| 5 · Reponer | 6 `merino-plaquetas-plasma` | Vaso: la bolsa y la balanza | Ya se sabe qué falta: plaquetas, plasma, crio, y por qué el INR engaña |
| Cierre | Casos H1-H5 (§6) | Los dos | Un caso por etapa |

---

## 2. Ids que hay que poner en las fichas (prerrequisito; con su página)

Cada sección o acordeón recibe su id. Los nodos de `visual.js` pasan a apuntar por id (`fuente: '#mh-…'`, CLAUDE §5) y
cada sección lleva su chip de página `#page=N` (hoy solo lo tienen la 4Ts y las notas).

| Ficha | Ids (página del PDF) |
|---|---|
| 1 | `mh-anemia-definicion` (1-2) · `mh-tabla-12-1` (2) · `mh-anemia-corte` (2) · `mh-anemia-frecuencia` (1) · `mh-anemia-transfusion-uci` (1) · `mh-trampa-volumen` (2-3, Fig. 12.1) · `mh-anemia-inflamacion` (3-4) · `mh-anemia-flebotomia` (4) · `mh-anemia-compensacion` (4) · `mh-tabla-12-2` (4-5) · `mh-no-newtoniano` (5-6, Fig. 12.2) · `mh-limite-compensacion` (6-7, Fig. 12.3) · `mh-tolerancia` (6-7) |
| 2 | `mh-umbral-historia` (7-8) · `mh-umbrales-guias` (8) · `mh-guias-cumplimiento` (8) · `mh-hb-mal-disparador` (8) · `mh-extraccion-disparador` (8-9) · `mh-componentes` (9) · `mh-tabla-12-3` (9) · `mh-tabla-12-4` (10) · `mh-filtros` (10) · `mh-efecto-transfusion` (10-11, Fig. 12.4) · `mh-peor` (16) · `mh-volumen-vs-celulas` (16-17, Fig. 12.6) |
| 3 | `mh-tabla-12-5` (11-12) · `mh-hemolitica` (12) · `mh-fiebre-nh` (13) · `mh-hipersensibilidad` (13-14) · `mh-trali` (14-15, Fig. 12.5) · `mh-taco` (15-16) · `mh-nosocomiales` (16) |
| 4 | `mh-glucocalix` (20) · `mh-hemostasia-primaria` (20) · `mh-hemostasia-secundaria` (21) · `mh-trombo-umbral` (21) · `mh-pseudotrombo` (21) · `mh-tabla-13-1` (22) · `mh-trombo-sepsis` (21) · `mh-trombo-farmacos` (21-22) · `mh-hit` (22) · `mh-hit-mecanismo` (22) · `mh-hit-riesgo` (23) · `mh-hit-clinica` (23) · `mh-hit-diagnostico` (23) · `mh-4ts` (24, envuelve la calculadora) · `mh-hit-manejo` (23-24) · `mh-hit-elisa-positivo` (24) · `mh-hit-toda` (24) · `mh-hit-warfarina` (24) · `mh-argatroban` (25) · `mh-hit-alternativas` (25) · `mh-hit-seguimiento` (25) |
| 5 | `mh-mat` (25) · `mh-mat-hemolisis` (27-28) · `mh-fig-13-1` (26) · `mh-tabla-13-3` (26) · `mh-mat-dimero` (27-28) · `mh-cid` (26-27) · `mh-ptt` (27-28) · `mh-shu` (28-29) |
| 6 | `mh-plaq-indicaciones` (29) · `mh-plaq-validez` (29) · `mh-plaq-preparaciones` (29-30) · `mh-plaq-aferesis` (30) · `mh-plaq-leucorreduccion` (30) · `mh-tabla-13-4` (32) · `mh-plaq-reacciones` (31-32) · `mh-plaq-respuesta` (30, Fig. 13.2) · `mh-pfc` (32) · `mh-pfc-masiva` (32-33) · `mh-pfc-warfarina` (33) · `mh-pfc-profilactico` (33) · `mh-trampa-inr` (33-34, Fig. 13.3) · `mh-pfc-riesgos` (33-35) · `mh-crio` (35) · `mh-mensajes` (35-36) |

---

## 3. Las tablas por ficha

Columnas como en el bloque 1. «→» separa las preguntas de una cadena; *predice* = se contesta antes de que el modelo
enseñe la cifra (tapada). Examen: lo que se pregunta y **la trampa** que lo hace difícil (sale de la propia fuente).

### 3.A · La sangre y el O₂ → capilar vivo ampliado (`data-capilar-vivo="<estado>"`)

| Ficha | Modelo y estado | Guía socrática | Examen MIR (trampa) | Casos | Para profundizar | Cob. |
|---|---|---|---|---|---|---|
| 1 `merino-anemia` (p. 1-7) | `dilucion` (lupa del tubo) → `anemia-compensada` → `techo-anemia` | La anemia es «menos capacidad de llevar O₂»: ¿por qué medirla con una concentración puede engañar? (`#trampa-volumen`) → *predice*: tumbas a un sano: ¿qué hace su Hto? (−4,1 %, +420 mL de plasma, `dilucion`) → y un bolo de 20 mL/kg (−4,2 %): ¿a cuánta sangre perdida «equivale»? (1 unidad, 500 mL, sin perder un hematíe) → ferritina 610 y VCM 79: ¿ferropenia? (inflamación, hepcidina, >100 µg/L, `#anemia-inflamacion`) → ¿cuánta sangre le sacamos en una semana y cómo la reduces? (40-70 mL/día; reinfundir los ~5 mL descartados, −50 %) → *predice* (`anemia-compensada`): baja la Hb a la mitad: ¿qué hace el gasto y por qué? (viscosidad, R ∝ µ, Poiseuille; sube más de lo que cae el Hto: no newtoniano) → *predice* (`techo-anemia`): ¿hasta qué Hto aguanta el tejido? (10 %, Hb 3; extracción 50 %; sube el lactato) → ¿qué lo permite? (la volemia mantenida: puente a la ficha 2) | Corte clínico frente a rango de referencia: varón Hb 13,2 (no es anemia por la definición <13, aunque está bajo el rango 13,5-18) — trampa: usar la tabla 12.1 como definición · Viscosidad: sangre normal ×3 el plasma y ×4 el agua (Tabla 12.2) — trampa: «×4 el plasma» · Fig. 12.2: el gasto sube más de lo que cae el Hto (Hto −38 %; gasto de 5,8 a 13 L/min, ×2,25: ver hallazgo l) — trampa: «proporcional» · Tolerancia: Testigos de Jehová (300): 50 % sobrevive con Hb 2-3 y 75 % con 3-4; voluntarios Hb 5 sin daño — trampa: cifras cruzadas · Frecuencia: 2/3 al ingreso, 97 % a la semana; el 90 % de las transfusiones, sin sangrado · Un «encuentra el error» **sin errores** (nota de evolución de anemia de UCI correcta) | H1 | `#tabla-12-1` (VCM, recuento, reticulocitos, masa eritrocitaria 26/24 mL/kg) · la teleología del flujo y la herida (dentro de `#no-newtoniano`) | 15/16 |
| 2 `merino-transfusion` (p. 7-11, 16-17) | `umbral-7` → `transfusion` → `anemia-hipovolemia`; pestaña «Mido» con la toma `scvo2` | En 1942 se fijó Hb ≤10: ¿qué cambió y qué mostraron los ensayos? (7 sin peor resultado; 48 estudios: 7-8 igual que 9-10, −41 % de hematíes) → *destapa* «son dos problemas»: ¿por qué la Hb sola es mal disparador? (no informa de la oxigenación; una caída aguda puede ser dilución) → *predice* (`umbral-7`): con Hb 7 y volemia normal, ¿dónde está la extracción? (lejos del 50 %, cifra del modelo: ilustrativa) → ¿cómo medirías la extracción a pie de cama? (SaO₂ − ScvO₂: pulsioxímetro + catéter de oximetría; ScvO₂ sola <70 % si la SaO₂ ≈100 %) → *predice* (`transfusion`): transfundes 1-2 U con Hb 6,4: ¿qué hace el VO₂? (igual; DO₂ ↑, extracción ↓, Fig. 12.4) → entonces, ¿qué sostiene la oxigenación: el volumen o los hematíes? (`anemia-hipovolemia`, Fig. 12.6) | Umbrales: shock séptico sin coronariopatía <7; cardiopatía isquémica <8; cirugía ortopédica <8 — trampa: la cirugía cardíaca, en los dos (se pregunta enseñando la nota de fidelidad, no se elige) · Tabla 12.4: 117 min por 20 G y 70 por 18 G sin diluir; 19 y 12 diluida (6×); 2 h por unidad en el estable — trampa: «diluir siempre» · Preparaciones: IgA → lavados; FNH previa → leucorreducidos; el lavado **no** quita leucocitos (p. 10); los filtros de 170-260 µm tampoco · 1 U = +1 g/dL y +3 % · «¿Qué es peor?»: 42/45 estudios, 17/18 con más mortalidad; almacenamiento prolongado empeora la oxigenación · 21 guías y el 60 % de ~5.000 transfusiones fuera de ellas | H1, H2 | `#componentes` (fraccionar la sangre completa) | 18/19 |
| 3 `merino-riesgos` (p. 11-16) | Lupa **alvéolo**: `trali` ↔ `taco` (con la Rx real, Fig. 12.5) | Tabla 12.5: ¿qué es más probable, un VIH o una bolsa equivocada? (1:1,5 millones frente a 1:15.000; los errores ganan) → a los 5 min: fiebre, dolor lumbar, hipotensión: ¿qué haces primero y por qué tan rápido? (parar: la gravedad depende del volumen; verificar; Hb libre y Coombs directo) → fiebre a las 3 h sin hipotensión: ¿qué es y cómo lo confirmas? (FNH; excluir hemólisis; Gram; >75 % no recurre) → habones sin fiebre: ¿paras? (no obliga; la práctica: parar un rato y difenhidramina 25-50 mg) → *predice* (`trali`): ¿de quién son los anticuerpos y dónde se quedan los neutrófilos? (del donante; capilares pulmonares) → (`taco`) ¿y qué llena aquí el alvéolo y qué paciente lo hace? (agua por presión; IC e IR previas; no depende del nº de unidades) → *destapa* «son tres cosas»: ¿qué te inclina a uno u otro? | TRALI: 1:12.000, 1.ª causa de muerte, ~50 %; TACO: ~1 %, 20 %, VM en 3/4 — trampa: invertirlas · TACO 1:100 **por receptor** (nota † de la Tabla 12.5) · FNH: >1 °C hasta 6 h, no en la 1.ª hora (la hemolítica, en minutos) · Hemolítica: anticuerpos **del receptor** contra el ABO del donante — trampa que cruza fichas: en el PFC son **del donante** contra el receptor (p. 34) · TRALI: 20 % sin anticuerpos · Nosocomiales: 22 estudios; sube con el volumen y el tiempo de almacenamiento | H2 | `#tabla-12-5`: virus y bacterias (1:500.000; VHB 1:1,2 M; VHC y VIH 1:1,5 M) · `#nosocomiales`: el origen en los aloinjertos renales | 19/21 |

### 3.B · La hemostasia → vaso que sangra (nuevo, `data-vaso-vivo="<estado>"`)

| Ficha | Modelo y estado | Guía socrática | Examen MIR (trampa) | Casos | Para profundizar | Cob. |
|---|---|---|---|---|---|---|
| 4 `merino-trombocitopenia` (p. 20-25) | `sano` → `herida` (4 tiempos) → `plaquetas-100k` → `plaquetas-5k` → `sepsis` → `hit` → `hit-argatroban`; lupa del tubo `pseudotrombocitopenia` | ¿Por qué no se pegan las plaquetas al endotelio sano? (glucocálix: fluidez, NO; además la presión oncótica) → *predice* (`herida`, tiempos 1-2): se rompe la pared: ¿a qué se pegan y qué ancla el tapón? (colágeno; Ca²⁺ → GPIIb/IIIa → FvW, irreversible) → (tiempo 3) ¿qué lo convierte en trombo estable y por qué vías? (fibrina; factor tisular la principal; contacto; → II → I → fibrina) → (tiempo 4) ¿por qué se contrae? (puentes de fibrina; vuelve el flujo) → *predice* (deslizador): ¿por debajo de cuánto deja de formarse el tapón? (100.000) → con 5.000, ¿sangra? (sin lesión estructural, no; <10.000, HIC espontánea poco frecuente) → (`sepsis`) la causa más frecuente y su mecanismo → (`hit`) ¿qué hace la IgG y por qué el peligro es la trombosis? → *destapa* «son tres cosas» (`hit-argatroban`): sospecha intermedia: ¿qué haces ya? | Pseudotrombocitopenia: anti-EDTA, agregados leídos como leucocitos, 2 %, repetir en citrato o heparina — trampa: transfundir · 4Ts de un paciente: caída 40 %, día 6, sin trombosis, sepsis definida = 1+2+0+0 = 3 → nada más (ni ELISA ni retirar) — trampa: «ELISA por si acaso» · ELISA sensible y poco específico (negativo excluye); SRA, la de referencia · Incidencia: <1 % en el crítico con cualquier heparina; 1-3 % en UCI cardiotorácica con HNF; HNF 2-10× la HBPM — nota de contexto con el 2,6 %/0,2 % del cap. 5 (poblaciones distintas, no discrepan) · Argatrobán: 1-2 µg/kg/min, aPTT 1,5-3×, 0,5 si hepatopatía, **sin** ajuste renal, hasta >150.000 · Tiempo: 5-10 días, <24 h si exposición en 3 meses, tardía hasta 3 semanas; rara vez <20.000 — trampa: 8.000 plaquetas «es una HIT» · Largo plazo: ACOD (rivaroxabán) 1-3 meses, identificador 3 meses, nunca más heparina · Fármacos inmunes: heparina, anti-IIb/IIIa, linezolid, β-lactámicos, vancomicina; antineoplásicos por supresión | H3 | `#tabla-13-1` (el resto de causas) · bivalirudina en el intervencionismo coronario (dentro de `#hit-alternativas`) | 23/25 |
| 5 `merino-microangiopatias` (p. 25-29) | `cid` (lupa frotis, Fig. 13.1 real) → `cid-lena` → `ptt` → `ptt-recambio` → `shu` | ¿Cómo se rompe un hematíe sin anticuerpos? (se fragmenta en la microcirculación llena de coágulos: esquistocitos) → LDH alta y haptoglobina baja: ¿qué piensas y qué lo confirma? → *predice* (`cid`): trombos por todas partes: ¿qué les pasa al INR, al aPTT y al fibrinógeno? (consumo) → ¿y por qué sube el dímero-D? (fibrinólisis aumentada) → (`cid-lena`) sangra mucho: ¿por qué plaquetas y factores pueden empeorarla? → *predice* (`ptt`): coagulación normal y microtrombos: ¿qué tijera falta? (ADAMTS-13 y el FvW) → *destapa* «son dos datos»: ¿qué separa la PTT del SHU? → (`ptt-recambio`) ¿qué hace el recambio, cuánto y hasta cuándo? | Tabla 13.3 de un paciente: esquistocitos, plaquetas bajas, INR 1,1, fibrinógeno normal, dímero-D normal, Cr 3,8 → SHU — trampa: «el dímero-D sube en las tres» · CID: trauma, shock séptico, embolia de líquido amniótico, abruptio, eclampsia, feto retenido; en la sepsis predomina la trombosis y en las obstétricas el sangrado — trampa: al revés · Púrpura fulminante: meningococemia · PTT: edad media, 3× mujeres, péntada a menudo incompleta, mortal en 24-48 h · SHU: *E. coli* Shiga, neumococo, gripe; quinina, ciclosporina, tacrolimus; atípico (complemento) → eculizumab (anti-C5) y, si no hay, recambio; extrarrenal 20 % · CID con FMO: mortalidad ≥80 % | H4 | `#shu`: trasplante renal en el atípico y el resto de causas (embarazo, LES, SAF, neoplasia) | 16/17 |
| 6 `merino-plaquetas-plasma` (p. 29-36) | `transfusion-plaquetas` → `refractariedad` (Fig. 13.2 viva) → `pfc-inr` (la balanza, Fig. 13.3 viva) → `warfarina` → `hemorragia-masiva` | ¿Por qué estas indicaciones no valen en las MAT? (agravan la microtrombosis; vuelve a `cid-lena`) → *predice* (deslizador): sangra: ¿qué recuento buscas? ¿y si sangra dentro del cráneo? (>50.000; >100.000) → sin sangrado, ¿cuándo y por qué duda el autor? (≤10.000; CVC <20.000; PL y cirugía no neuroaxial <50.000; ninguno validado) → *predice* (`transfusion-plaquetas`): 1 unidad: ¿cuánto sube a la hora y cuánto queda a las 24 h? (+35.000-50.000; ~40 % menos) → (`refractariedad`) tras 5 transfusiones sube menos: ¿por qué y qué haces? (anticuerpos anti-ABO; ABO-compatibles) → *predice* (`pfc-inr`): PFC 12 mL/kg con INR 1,8: ¿cuánto baja y qué más sube? (1,4; antitrombina 38 → 50 %) → *destapa*: ¿coagula mejor? → (`warfarina`) ¿qué das primero y por qué el CCP4F gana al PFC? → (`hemorragia-masiva`) ¿qué factor se agota primero y cuándo pides crio? | Tabla 13.4: aféresis 478 frente a 70 por 100.000; alérgicas 325 frente a 27 (más plasma) — trampa: «el donante único es más seguro» · Bacterias: más con plaquetas por la temperatura ambiente (5 días); NAT casi elimina VIH y hepatitis · PFC: −18 °C en 8 h, 230 mL, 1 año, 5 días descongelado; plasma líquido 26 días · Riesgos del PFC: hemolítica por anticuerpos **del donante**; hipersensibilidad 1:600-1:2.000 (más que con hematíes o plaquetas); TRALI 1:250.000; TACO si >1 mL/kg/h en predispuestos · Crio: fibrinógeno, FvW, VIII; 10-20 g/L; 10-15 mL; 4 h tras descongelar; concentrado de fibrinógeno 20 g/L sin descongelar · Hemorragia masiva = la volemia en 24 h; 1 PFC por cada 1-2 CH · PFC profiláctico: sin pruebas de beneficio | H5 (+ H4, paso 4) | `#plaq-preparaciones` (38×10¹⁰ en 260 mL, con su nota de fidelidad) · `#pfc-riesgos`: infecciones (VHB 1:280.000, VHC 1:1,2 M, VIH 1:1,6 M; CMV no) | 20/22 |

**Mira** (vista Visual de cada ficha): se quedan las recetas de `js/modules/merino-hemato/visual.js`, con los nodos por
id. Se añaden dos: en la ficha 1, unas `barras` con la Fig. 12.1 (41,8 → 37,7 % de pie y tumbado; 42,9 → 38,7 % con el
bolo); en la ficha 3, una `linea` de 0 a 6 h: **el reloj de la transfusión** (hemolítica en minutos; urticaria durante
la bolsa; FNH, no en la 1.ª hora y hasta 6 h; TRALI a menudo en la 1.ª hora y hasta 6 h; TACO en las 6 h), p. 12-16.

---

## 4. Ampliación del capilar vivo (fichas 1-3)

### 4.1 El motor: «el corazón compensa» y «volemia»
- **Orden nueva `compensa`** (sí/no). Apagada en los estados del bloque 1 (cap. 9: gasto fijo). Encendida en los del
  bloque 2: el gasto sube cuando baja la Hb para que la extracción siga la Fig. 12.3 (p. 7). Puntos de la figura
  (lectura aproximada, primates): extracción ~23-25 % normal, ~29 % con Hto 30, ~35 % con Hto 20, **~50 % con Hto 10**.
  Con VO₂ 250 y SaO₂ 98 %, el gasto que sale es: Hb 15 → 5; Hb 10 → ~6,6; Hb 7,5 → ~7,7; Hb 7 → ~8; Hb 3 → **~12,5 L/min**.
  Rótulo del gasto: «ilustrativo (forma de la Fig. 12.3, animales)». Paciente posible: 12,5 L/min es extremo pero
  humano; la pantalla dice «anemia extrema: Hb 3». El mando de Hb baja a **2** (hoy 5-17) solo con `compensa`.
- **Orden nueva `volemia`** (mantenida/baja). Baja = el gasto no puede subir (se queda en 5 o baja con el mando del
  corazón). Es el mensaje final del capítulo (p. 16-17): «la hipovolemia es causa de shock; la anemia sola, no».
- **Botón «Transfundir 1 CH»** (con la bolsa, pieza común): Hb +1 g/dL y Hto +3 % (p. 10), en 2 h. Si `compensa`, el
  gasto baja un poco: el aporte sube, el **VO₂ no cambia** y la extracción cae (Fig. 12.4, p. 10-11).
- **Corregir la frase del estado `anemia`** del bloque 1: «con el gasto fijo (si el corazón no compensara)…», y un
  enlace «¿Y si el corazón compensa? → `anemia-compensada`».
- **Lupa nueva «El tubo»** (pieza común con el vaso): un tubo de hematocrito centrifugado. La columna roja (la masa) no
  cambia; el plasma crece. Rótulo: «misma masa eritrocitaria, más plasma».
- **Lupa nueva «El alvéolo»** en la pestaña Pulmón: el capilar pulmonar y su alvéolo.

### 4.2 Estados nuevos (frase viva con su origen)

| Estado | Orden | Cifras (origen) | Frase viva |
|---|---|---|---|
| `dilucion` | lupa tubo; chips «Tumbarse» y «Bolo 20 mL/kg» | Hto 41,8 → 37,7 % (+420 mL de plasma); 42,9 → 38,7 % a los 90 min (Fig. 12.1, p. 2-3) | «Ni un hematíe perdido y el Hto cae como si hubiera perdido una unidad (500 mL): mide una concentración.» |
| `anemia-compensada` | Hb 7,5; compensa | gasto ~7,7, extracción ~33 % (ilustrativo); el porqué: Tabla 12.2 y Poiseuille (p. 4-5) | «Menos hematíes, sangre menos viscosa: el corazón bombea más y la extracción sube sin llegar al techo.» |
| `techo-anemia` | Hb 3; compensa | Hto 10 % = Hb 3; extracción 50 %; el VO₂ empieza a caer y sube el lactato (p. 6, Fig. 12.3) | «Hasta un Hto del 10 % la extracción compensa; aquí llega al 50 % y empieza el lactato.» |
| `umbral-7` | Hb 7; compensa; chip «Hb 8» | <7 estable sin coronariopatía; <8 coronariopatía, cirugía cardíaca u ortopédica (p. 8) | «Hb 7: el umbral de las guías. Mira la extracción: el número no dice si el tejido sufre.» |
| `transfusion` | Hb 6,4 → 8 (1-2 CH); compensa | +25 % de Hb; DO₂ ↑, VO₂ igual (Fig. 12.4, p. 10-11; lámina real al lado) | «Sube el aporte, el consumo no cambia: cae la extracción. No es un método absoluto para oxigenar.» |
| `anemia-hipovolemia` | Hb 7,5; volemia baja | magnitud ilustrativa; Fig. 12.6 como lámina (p. 16-17) | «Sin volumen el corazón no puede compensar: la volemia pesa más que la Hb.» |
| `trali` | lupa alvéolo; PaO₂ 55 (ilustrativo) | 80 % anticuerpos del donante contra neutrófilos del receptor; secuestro en el capilar pulmonar; 1.ª hora-6 h; ~50 % de mortalidad (p. 14; Rx real, Fig. 12.5) | «Los anticuerpos vienen en la bolsa: los neutrófilos se quedan en el pulmón y lo inflaman.» |
| `taco` | lupa alvéolo; PaO₂ 55 (ilustrativo) | edema hidrostático en 6 h; IC e IR previas; sin relación con el nº de unidades; 20 % (p. 15-16) | «Aquí el agua entra por presión: el corazón no da abasto. Diurético de asa.» |

Dibujo del alvéolo: el TRALI con neutrófilos (forma nueva) que se pegan y salen al alvéolo, y la Y de la IgG del
donante con una marca de bolsa; el TACO con gotas de agua (forma `agua`) que cruzan por presión y un corazón grande
al lado. No se dibujan PCR, BNP ni ecografía: la fuente no los da con cifras (huecos 9).

---

## 5. Modelo nuevo: **el vaso que sangra** (fichas 4-6) · maqueta `autonomo/maquetas/b2-vaso.html`

### 5.1 Decisión: modelo nuevo, con las piezas del telar dentro
**Sí hace falta, y no basta con ampliar el telar.** El telar es la femoral de la cama 7: una vena lenta con la red de
trombina en el bolsillo de una válvula y la lupa de la TIH. El cap. 13 enseña otra cosa: **la herida** (glucocálix,
colágeno, adhesión, GPIIb/IIIa, FvW, puentes de fibrinógeno, contracción; p. 20-21) y **la microcirculación** (CID,
PTT, SHU, esquistocitos; p. 25-29), más lo que se **repone** (plaquetas, PFC, crio, CCP4F; p. 29-35). Meterlo en el
telar le daría 6-7 estados y 3 pestañas nuevas a una escena que ya tiene 5 y cambiaría su sitio (la pierna de
Andrés). En cambio, **la cascada y la plaqueta con FP4 del telar entran en el vaso como lupas (pieza común, §7)**: el
R1 reconoce el mismo dibujo.
**Fichas que explicaría**: las 3 del cap. 13 de este bloque (64 ideas) y, en otros bloques de Marino,
`mar-tromboprofilaxis-farmacos` y `-escenarios` (la TIH sigue en el cap. 13), `mc-hemorragico-fluidos` (PFC, plasma
líquido, crio, plaquetas), `mc-damage-control` (plaquetas y crio en el control de daños), `mc-sca-tratamiento`
(GPIIb/IIIa, crio), `neumo-ep-manejo`, `mn-hic` (CCP4F) y `mn-ictus-complicaciones`: **≈11 fichas**. Desde PIF
(`sind-cid`, `sind-ptt`, `fuci-trombocitopenia`) solo un enlace «Ver el modelo (Marino)», sin mezclar contenido.

### 5.2 Qué se ve (390 × ~340, grabado crema y oro, como el río y mar)
1. **Arriba, una arteriola en corte longitudinal**, de izquierda a derecha. La pared en capas de grabado: endotelio de
   adoquines, el **glucocálix** como una hierba dorada fina que ondea con el flujo, y debajo el subendotelio con las
   fibras de **colágeno** (cordones ondulados terracota). Dentro corre la sangre: hematíes (`rbc`), plaquetas
   (`plaqueta`), antitrombina (`at`) y las fichas de los factores.
2. **La herida**, en la pared de arriba: el glucocálix se rasga, asoma el colágeno y salta el **factor tisular**
   (chispa). Cuatro tiempos (Motion; con «reducir movimiento», el tiempo 4 quieto):
   1 · las plaquetas se pegan al colágeno; 2 · sueltan Ca²⁺ (`ca`), sacan espinas (`plaquetaActiva`), sus GPIIb/IIIa
   agarran los hilos de **FvW** (anclan el tapón a la pared) y los bastones de **fibrinógeno** las unen entre sí;
   3 · por debajo llegan dos ríos que se juntan, «factor tisular» (grueso: la principal) y «contacto» (fino), hasta la
   **II**, y la tejedora del telar convierte el fibrinógeno en hilos de **fibrina** (`fibrina`); 4 · el tapón se
   contrae y el flujo vuelve.
3. **Abajo, la arteriola se abre en un delta de capilares** que desemboca en cuatro medallones: **pulmón, riñón,
   cerebro y piel**. Se encienden cuando sus capilares se tapan (CID: pulmón, riñón, SNC; PTT: cerebro y riñón leve;
   SHU: riñón; púrpura fulminante: piel).
4. **Tablero** (como el del capilar): Plaquetas (/µL, con marcas 150.000 · 100.000 · 50.000 · 20.000 · 10.000 ·
   5.000) · Tapón (se forma / no) · INR · aPTT · Fibrinógeno · Dímero-D · Esquistocitos · Lo que amenaza (sangrado /
   trombosis). En los estados de MAT, **flechas, no números** (la Tabla 13.3 solo dice alto, bajo o normal). Números
   solo donde la fuente los da (plaquetas, INR 1,8 → 1,4, antitrombina 38 → 50 %, fibrinógeno 150-200 y +50).
5. **La balanza** (bajo el delta, en los estados de plasma): una balanza de botica. Plato izquierdo: II, VII, IX y X
   con el rótulo «lo que mide el INR»; plato derecho: antitrombina, proteína C y proteína S. El PFC carga los dos
   platos: el dial del INR baja, el fiel casi no se mueve (p. 33-34).
6. **Lupas**: «La plaqueta» (GPIIb/IIIa + FvW + fibrinógeno; en la HIT, la plaqueta-FP4 del telar), «El frotis» (la
   foto real de la Fig. 13.1 junto a un hematíe que un hilo de fibrina parte en un **esquistocito**), «El tubo» (anti-
   EDTA: grumos de plaquetas que el contador cuenta como leucocitos; en citrato, sueltas) y «La cascada» (la del telar,
   con el argatrobán cortando la IIa y la warfarina vaciando II, VII, IX y X).
7. **Dock** (5 pestañas, como el capilar): **Herida** (lesión: ninguna / herida / lesión estructural; tiempo 1-4) ·
   **Plaquetas** (deslizador 5.000-400.000; «Transfundir 1 unidad»; transfusiones previas 1 · 3 · 5; ABO-compatibles) ·
   **Causa** (sepsis, heparina, CID séptica u obstétrica, PTT, SHU, tubo con EDTA) · **Plasma** (PFC 12 mL/kg; PFC
   10-15 mL/kg con vitamina K; CCP4F; crio N unidades o concentrado de fibrinógeno; relación PFC:CH; recambio
   plasmático) · **Fármaco** (retirar heparina; argatrobán; enlace al telar para el resto).

### 5.3 Estados con nombre

| Estado | Lo que se ve | Cifras (página) | Frase viva |
|---|---|---|---|
| `sano` | glucocálix entero; nada se pega | plaquetas 150.000-400.000 (p. 30) | «El glucocálix mantiene la sangre fluida y avisa al endotelio para que suelte óxido nítrico.» (p. 20) |
| `herida` | los 4 tiempos | — (p. 20-21) | 1 «Se pegan al colágeno.» 2 «El Ca²⁺ enciende la GPIIb/IIIa: se agarra al FvW y al fibrinógeno.» 3 «La fibrina teje: el tapón se vuelve trombo.» 4 «Se contrae y el flujo vuelve.» |
| `plaquetas-100k` | deslizador en 100.000; el tapón aún cierra | <100.000 = trombocitopenia relevante (p. 21) | «Por encima de 100.000 el tapón se forma: por eso este corte es más útil que 150.000.» |
| `plaquetas-5k` | 5.000; sin lesión no sangra; con lesión estructural, sí; el medallón del cerebro avisa | 5.000 tolerado sin lesión; <10.000, HIC espontánea poco frecuente (p. 21) | «Para sangrar no basta con pocas plaquetas: hace falta una lesión que sangre.» |
| `pseudotrombocitopenia` | lupa del tubo | 2 % de los recuentos (p. 21) | «En el tubo con EDTA se agrupan y el contador las toma por leucocitos. Repite en citrato.» |
| `sepsis` | macrófagos (forma nueva) que se comen plaquetas | causa más frecuente en UCI (p. 21-22) | «La sepsis: los macrófagos destruyen más plaquetas.» |
| `hit` | lupa plaqueta-FP4 (del telar); trombos en una vena y en una arteria; plaquetas recubiertas que se lleva el SRE | caída ~50 %, rara vez <20.000; TEV 17-55 %, arterial 1-3 % sin tratar; la trombosis precede en el 25 % (p. 22-23) | «La heparina se une al FP4, la IgG enciende las plaquetas: el peligro es la trombosis, no el sangrado.» |
| `hit-argatroban` | sin heparina (también la de los lavados); la lupa de la cascada con la IIa cortada | 1-2 µg/kg/min, aPTT 1,5-3×, 0,5 en hepatopatía, sin ajuste renal, hasta >150.000 (p. 25); retraso = 10× trombosis (p. 24) | «Quitar la heparina no basta: anticoagulante sin heparina a dosis plenas.» |
| `cid` | factor tisular en toda la sangre; fibrina en todo el delta; plaquetas y factores desaparecen; la herida sangra; esquistocitos; dímeros sueltos | INR ↑, aPTT ↑, fibrinógeno ↓, dímero-D ↑ (Tabla 13.3, p. 26-27) | «La coagulación arranca en toda la sangre: los microtrombos gastan plaquetas y factores, y lo que falta hace sangrar.» Chip séptica / obstétrica: «En la sepsis manda la trombosis; en las obstétricas, el sangrado.» (p. 27) |
| `cid-lena` | entran plaquetas y factores de la bolsa y alimentan los microtrombos | ≥80 % de mortalidad con FMO (p. 27, 29) | «Reponer no suele parar el sangrado y puede echar leña a la microtrombosis.» |
| `ptt` | hilos de FvW larguísimos en los capilares, con plaquetas pegadas; las tijeras ADAMTS-13 atadas por anticuerpos; la cascada quieta; cerebro y riñón (leve) | INR, aPTT, fibrinógeno y dímero-D normales; Cr <2 (p. 27-28) | «Falta la tijera que corta el FvW: las plaquetas se pegan sin control. La coagulación, normal.» |
| `ptt-recambio` | el plasma del paciente sale y entra plasma de donante (no se dibuja qué molécula entra o sale: la fuente no lo dice) | 1,5 volúmenes al día hasta plaquetas normales 2 días seguidos; <48 h: hasta 90 % sobrevive; sin tratar, mortal en 24-48 h (p. 27-28) | «El recambio, cuanto antes: en las primeras 48 h sobrevive hasta el 90 %.» |
| `shu` | el riñón se apaga; coagulación normal; en el atípico, el complemento sin freno y el eculizumab que bloquea C5 | fallo renal más grave que en la PTT; extrarrenal ~20 % del atípico (p. 28-29) | «Como la PTT, pero el riñón cae más. En el atípico, el complemento: eculizumab.» |
| `transfusion-plaquetas` | la bolsa de plaquetas gotea; el contador sube y luego baja | +35.000-50.000 a la hora; ~40 % menos a las 24 h (p. 30) | «Sube a la hora y se gasta: a las 24 h queda un 40 % menos.» |
| `refractariedad` | Fig. 13.2 viva (1, 3, 5 transfusiones) | ~25 % menos tras 5; anticuerpos anti-ABO; ABO-compatibles (p. 30-31) | «Cuantas más transfusiones, menos sube: anticuerpos contra el ABO del donante.» |
| `pfc-inr` | la balanza; Fig. 13.3 viva y la lámina real | 12 mL/kg: INR 1,8 → 1,4; antitrombina 38 → 50 % (p. 33-34) | «El INR solo mira un plato de la balanza: el PFC también trae anticoagulantes.» |
| `warfarina` | la cascada sin II, VII, IX, X; bolsa grande de PFC que tarda frente a un frasco de 100 mL | vitamina K primero; PFC 10-15 mL/kg; CCP4F <30 min (p. 33) | «El CCP4F trae los cuatro factores en 100 mL y en menos de 30 min; el PFC tarda y añade volumen.» |
| `hemorragia-masiva` | herida grande; el indicador de fibrinógeno cae el primero y se diluye con los sueros; bolsas CH:PFC; crio | volemia en 24 h; 1 PFC por cada 1-2 CH; crio con 150-200 mg/dL en el trauma; 1 U/10 kg = +50 mg/dL sin sangrado (p. 32, 35) | «El fibrinógeno se agota el primero y los sueros lo diluyen: crio o concentrado.» |

**Paciente posible** en los mandos: plaquetas 5.000-400.000; INR 1,0-2,5; fibrinógeno 50-400 mg/dL (el normal, «fisiología
general»: la fuente no lo da). **No se dibuja**: el mecanismo protrombótico de la warfarina (la fuente no lo explica),
la plasmina, los multímeros del FvW ni qué molécula repone el recambio (la fuente no los nombra).
**Láminas reales**: Fig. 13.1 (ya en la app: `js/modules/merino-hemato/img/fig2-esquistocitos-cid.jpg`); las gráficas
13.2 y 13.3 se recrean vivas y van al lado como lámina del libro (§7, pieza 6).
**Dos direcciones para la maqueta**: **A · Corte de grabado** (lo de arriba: arteriola, delta y medallones, todo en
una lámina) y **B · La lupa de la herida** (un gran círculo con las capas de la pared y la herida en primer plano; la
red de capilares en un recuadro aparte). Recomiendo A: el delta enseña la MAT de un vistazo.

---

## 6. Los casos (REGLAS §8; el paciente se inventa, la medicina sale de la ficha)

Cada uno: 6-7 pasos con su momento; la ficha del paciente se rellena y lo nuevo sale en rojo; al menos un «encuentra
el error» (0-2 errores) y un «piensa y destapa»; un giro; «Lo que te llevas» y vuelta a la ficha y al modelo.

| Caso | Fichas | Pasos (momento · dato · pregunta) | Calculadora | Giro | Encuentra el error (errores) | Vuelta |
|---|---|---|---|---|---|---|
| **H1 · La Hb que bajó sin sangrar** (Fermín) | 1, 2 | 1 · Urgencias: Hto 39 %, Hb 12,9 → 90 min tras 1,5 L (20 mL/kg): Hto 35 %, Hb 11,6. *Test*: ¿ha sangrado? (calcula: −4 puntos ≈ 1 unidad sin perder hematíes, Fig. 12.1) · 2 · Día 3: Hb 9,8, VCM 79, ferritina 610 µg/L. *Test*: ¿ferropenia? (inflamación, >100) · 3 · Día 5: ~60 mL/día de analíticas. *Destapa* (dos cosas): ¿qué más le baja la Hb y qué harías? (≈420 mL en 7 días; reinfundir los ~5 mL descartados: −50 %) · 4 · Día 6: Hb 7,6, SpO₂ 97 %, ScvO₂ 72 %, lactato 1,4, noradrenalina a la baja. *Test*: ¿transfundes? (no: ≥7 en el shock séptico; extracción ≈25 %) · 5 · **Giro**: el informe de la familia: IAM con stent hace 3 años → cardiopatía isquémica: umbral <8 → 1 CH en 2 h · 6 · *Error*: plan del R1 · 7 · Hb 8,5, ScvO₂ 76 %. *Destapa*: ¿ha mejorado la oxigenación de los tejidos? (DO₂ ↑, VO₂ igual, Fig. 12.4) | `mar-dual-calc` (SpO₂ − ScvO₂) | El antecedente coronario cambia el umbral de 7 a 8 | «Transfundo 1 CH (Hb <8 por su cardiopatía) ✓. El objetivo es llegar a 10, el umbral clásico ✗. Cada unidad sube 1 g/dL ✓. En 2 h por la 18 G ✓. Así mejorará la oxigenación de sus tejidos ✗.» (2) | capilar `transfusion` |
| **H2 · Ahogo a la hora de la bolsa** (Rocío) | 2, 3 | 1 · Día 4, 09:00: Hb 7,7, sin sangrado; balance +2,8 L. *Test*: ¿umbral y qué riesgo tiene? (<8 por coronariopatía; TACO más frecuente con IC e IR) · 2 · 11:20: habones sin fiebre. *Test*: ¿paras? (no obliga; parar un rato y difenhidramina 25-50 mg) · 3 · 12:40: disnea, SpO₂ 86 %, 38,1 °C, crepitantes, PA 168/92. *Error*: nota del R1 a las 12:45 · 4 · *Destapa* (tres cosas): ¿qué te inclina a TACO o a TRALI? (IC, sobrecarga e IR previas → TACO; PCR alta → TRALI; la fiebre no separa) · 5 · Rx: edema bilateral. *Test*: además de parar y avisar al banco, ¿qué añades? (diurético de asa IV) · 6 · **Giro**, día 6: Hb 7,5, otra transfusión. *Test*: ¿qué cambias? (hematíes **lavados** por la urticaria del paso 2; estudiar déficit de IgA; corregir el balance antes) | — | La urticaria del paso 2, que parecía menor, cambia el producto de la siguiente transfusión | «Es un TRALI: tiene fiebre ✗. Como queda poco, termino la bolsa ✗. Aviso al banco de sangre ✓. Con esta Rx no puedo separar TRALI de TACO ✓.» (2) | capilar `taco` |
| **H3 · Las plaquetas del día 7** (Gonzalo) | 4 | 1 · Día 1 tras revascularización con circulación extracorpórea, HNF SC desde el día 1: plaquetas 230.000 → 140.000. *Test*: ¿HIT? (no: <4 días; la cirugía es otra causa, Tabla 13.1) · 2 · Día 7: 85.000 (−63 %), sin trombosis; vancomicina desde el día 5. *4Ts* = 2 + 2 + 0 + 1 = **5**, intermedio · 3 · *Destapa* (tres cosas): ¿qué haces ya? (retirar toda heparina, no heparínico, ELISA) · 4 · *Test*: ClCr 28, hígado normal: ¿argatrobán? (1-2 µg/kg/min, 82-164 µg/min, aPTT 1,5-3×; sin ajuste renal) · 5 · *Error*: nota del R1 · 6 · **Giro**, día 8: ELISA negativo. *Test*: ¿qué haces? (excluye la HIT: suspender el argatrobán y se puede volver a la heparina) · 7 · Día 9: siguen 70.000. *Test*: ¿qué fármaco de su hoja la explica por anticuerpos? (vancomicina; furosemida y amiodarona también están en la Tabla 13.1, pero el texto destaca linezolid, β-lactámicos y vancomicina) | 4Ts de la ficha (`#ts4-*`) | El ELISA negativo da la vuelta: no era HIT | «Retiro la HNF ✓; dejo la heparina de los lavados de la arterial, que es una dosis mínima ✗; empiezo argatrobán ✓ y warfarina para preparar el alta ✗; pido el ELISA ✓.» (2) | vaso `hit-argatroban` (y telar `tih`) |
| **H4 · Esquistocitos a medianoche** (Inés) | 5, 6 | 1 · 22:00: 38,6 °C, confusión, cefalea, petequias; Hb 8,2, plaquetas 16.000, LDH 1.450 U/L, haptoglobina indetectable, Cr 1,6. *Test*: ¿qué sugieren y qué lo confirma? (hemólisis; esquistocitos) · 2 · 22:40: frotis con esquistocitos (Fig. 13.1 real); PA 96/58; el R2 dice «sepsis con CID». *Destapa* (cuatro pruebas): ¿qué separa la CID? (INR, aPTT, fibrinógeno, dímero-D) · 3 · **Giro**, 23:30: INR 1,1, aPTT normal, fibrinógeno normal, dímero-D normal, Cr 1,6. *Test*: ¿qué es? (PTT: coagulación normal y Cr <2) → de «soporte y causa» a recambio urgente · 4 · *Error*: plan del R1 para el catéter · 5 · *Test*: 60 kg: ¿cuánto plasma por sesión? (1,5 × 2 L de plasma, Tabla 10.1 de `mar-cristaloides` → ≈3 L) · 6 · Días 1-4: plaquetas 38.000, 96.000, 158.000, 171.000. *Test*: ¿cuál es la última sesión? (día 4: normales 2 días seguidos; normal 150.000-400.000, p. 30) | Tabla 10.1 (cuenta en el paso) | La coagulación normal saca a la CID del cuadro | «Le pongo 1 pool de plaquetas antes del catéter, que con <20.000 toca ✗. Empezamos el recambio en las primeras 48 h ✓. ADAMTS-13 es patognomónico pero tardará: no esperamos ✓. Recambio diario hasta que las plaquetas estén normales un día ✗.» (2) | vaso `ptt-recambio` |
| **H5 · El andamio** (Salvador) | 6 | 1 · Hora 0: fractura de pelvis, PA 78/40, sangra. *Test*: ¿hemorragia masiva y qué relación? (la volemia en 24 h; 1 PFC por cada 1-2 CH) · 2 · Hora 2: 8 CH y 5 PFC; fibrinógeno 120 mg/dL. *Destapa*: crio para 80 kg (8 U → +50 mg/dL **sin** sangrado: hará falta más; el fibrinógeno se agota el primero y se diluye; alternativa: concentrado) · 3 · Hora 2: plaquetas 46.000. *Test*: ¿objetivo? (>50.000: 1 unidad; espera 81.000-96.000 a la hora) · 4 · **Giro**, hora 4: TC con contusión hemorrágica; plaquetas 88.000. *Test*: ¿y ahora? (>100.000 en la HIC: otra unidad) · 5 · *Error*: plan del R1 a la hora 5 · 6 · Día 2: no sangra, INR 1,7, traqueotomía mañana; el R1 pide PFC 12 mL/kg. *Destapa*: ¿coagulará mejor? (Fig. 13.3: INR 1,8 → 1,4 pero antitrombina 38 → 50 %; PFC profiláctico sin beneficio probado; TACO si >1 mL/kg/h en predispuestos) | — | La HIC sube el objetivo de plaquetas de 50.000 a 100.000 | «Plaquetas por encima de 100.000 por la HIC ✓. El PFC, en cuanto sale del congelador, sin esperar ✗. El crio, en las 4 h tras descongelarlo ✓. Si el INR baja a 1,3, ya coagula bien y paro el plasma ✗.» (2) | vaso `pfc-inr` |

«Lo que te llevas» (3 puntos cada uno): H1 Hto/Hb son concentraciones · umbral 7/8 y la extracción · transfundir sube el
aporte, no el consumo. H2 errores > infecciones · TRALI o TACO: quién y cuándo · tras una alérgica, lavados. H3 4Ts
antes que el ELISA · ELISA negativo excluye · la HIT no depende de la dosis y nunca warfarina en la fase aguda. H4
esquistocitos = MAT · la coagulación separa la CID · plaquetas no en las MAT, recambio en 48 h. H5 fibrinógeno el
primero · 50.000 o 100.000 · el INR no ve la antitrombina.

**Paciente posible**: cada cifra encaja (Hb ≈ Hto/3; caídas del Hto de la Fig. 12.1; 4Ts sumada con la Tabla 13.2;
plaquetas que suben lo de la p. 30). Tres cifras viven en su contexto y lo dicen en pantalla: el 150-200 mg/dL del
crio es **del trauma** (H5, no del posparto); el «corregir el balance antes» es para las transfusiones **después** de un
TACO (H2, paso 6, no el paso 1); el PFC 12 mL/kg de la Fig. 13.3 es de **críticos sin sangrado antes de un
procedimiento** (H5, paso 6: el mismo contexto).

---

## 7. Piezas comunes (se hacen primero; los demás las copian)

| # | Pieza | Qué es | Quién la usa |
|---|---|---|---|
| 1 | **Estudiar en Hematología** | Montar `core/mayeutica.js` en `merino-hemato/index.js` (el mismo motor; nada copiado); datos en `js/data/mayeutica/b2.js` (+ `b2-sangre.js` fichas 1-3 y `b2-hemostasia.js` fichas 4-6); los ids del §2; `vasoVivo` en `MODELOS` de `mayeutica.js` y en `modelosVivos` de `libros/index.js` (`data-vaso-vivo`) | Las 6 fichas |
| 2 | **La bolsa** | Un dibujo de bolsa con 6 variantes (CH, plaquetas agrupadas o de aféresis, PFC, crio, CCP4F en frasco, concentrado de fibrinógeno) que gotea en el modelo; sus cifras **una sola vez** en `js/data/hemoderivados-data.js` (Tabla 12.3, p. 9; plaquetas p. 29-30; PFC p. 32; CCP4F p. 33; crio y concentrado p. 35) | Capilar (`transfusion`), vaso (plaquetas, plasma), casos |
| 3 | **El tubo** | Lupa de un tubo de laboratorio: hematocrito centrifugado (masa igual, más plasma) y tubo con EDTA (grumos) | Capilar `dilucion`, vaso `pseudotrombocitopenia` |
| 4 | **Formas nuevas** en `js/data/formas-iones.js` | Esquistocito (disco con un mordisco, forma de casco), FvW (cordón largo con cuentas), ADAMTS-13 (tijera), fibrinógeno (bastón de tres nudos), dímero-D (dos cuentas unidas), factor tisular (chispa), neutrófilo (núcleo en tres lóbulos), macrófago (célula grande con brazos), factores II, VII, IX, X (ficha con su número romano). Se usan las que ya hay: `rbc`, `plaqueta`, `plaquetaActiva`, `fibrina`, `at`, `fp4`, `igg`, `ca`, `agua` | Vaso y capilar (alvéolo) |
| 5 | **Lupas del telar exportadas** | La cascada y la plaqueta-FP4 de `telar-vivo-escena.js` pasan a ser funciones que también llama el vaso (no se copian) | Telar y vaso |
| 6 | **Láminas del libro** | Extraer con `pdfimages` las Figs. 12.1 (p. 3), 12.2 (p. 6), 12.3 (p. 7), 12.4 (p. 11), 12.6 (p. 17), 13.2 (p. 31) y 13.3 (p. 34) a `js/modules/merino-hemato/img/`. Son gráficas: se recrean vivas y la real va al lado como lámina | Capilar, vaso, Mira |

Orden: 1 (sin él no hay Estudiar) y 4 (lo aprueba el usuario en la maqueta) → 2, 3, 5, 6 → capilar ampliado → vaso.
El vaso copia la estructura del capilar (`capilar-vivo.js`, `-escena.js`, `-data.js`, prueba `autonomo/pruebas/vaso-vivo.mjs`),
con prefijo de ids **`vso-`** (libre).

---

## 8. Pacientes del bloque

| Nombre | Edad | Ingreso | Caso |
|---|---|---|---|
| Fermín | 71, varón, 75 kg | Shock séptico por neumonía; IAM con stent hace 3 años (se sabe el día 6) | H1 |
| Rocío | 67, mujer, 68 kg | Neumonía; cardiopatía isquémica con IC (FEVI 35 %) y ERC | H2 |
| Gonzalo | 66, varón, 82 kg | Posoperatorio de revascularización coronaria, UCI cardiotorácica | H3 |
| Inés | 41, mujer, 60 kg | Fiebre, confusión y petequias (PTT) | H4 |
| Salvador | 47, varón, 80 kg | Caída de un andamio: fractura de pelvis, hemorragia masiva, contusión cerebral | H5 |

Ninguno de estos nombres sale hoy en `js/` (comprobado con grep). No repiten a Andrés (62) ni a la Sra. R. (64).

---

## 9. Huecos y hallazgos

**Huecos (la fuente no lo dice; no se rellena):**
1. La Tabla 13.3 no da cifras: el tablero del vaso usa flechas en la MAT.
2. Cuánto sube el gasto con cada Hb en el ser humano: la Fig. 12.2 es un paciente con policitemia y la 12.3, primates.
   La curva del capilar es ilustrativa.
3. Que en la hemorragia aguda la Hb inicial apenas cambie: el cap. 12 no lo dice (sería «fisiología general»). No se usa.
4. El mecanismo protrombótico de la warfarina en la HIT, la plasmina, los multímeros del FvW, qué repone el recambio.
5. Dosis de eculizumab, CCP4F, vitamina K, bivalirudina, fondaparinux y rivaroxabán en la HIT (el CCP4F, en el cap. 47).
6. El umbral de fibrinógeno del posparto (solo da el del trauma).
7. Por qué la cirugía cardíaca sale en <7 y en <8 (ya tiene nota).
8. Qué es el «nadir» y la cifra basal de la 4Ts; cómo se define la refractariedad (sin índice).
9. TRALI frente a TACO: sin cifras de PCR, BNP ni ecografía (R3 proponía el ecógrafo: no hay fuente).
10. El fibrinógeno normal (para el mando del vaso): «fisiología general».

**Hallazgos de fidelidad para el auditor** (la ficha queda por debajo de la fuente o añade algo; se arreglan al poner los ids):
a. Falta la nota del embarazo de la Tabla 12.1 (−1 g/dL tras el primer trimestre, p. 2) y los +420 mL de plasma (p. 2).
b. Inflamación: faltan «hierro, capacidad de fijación y transferrina bajos» (p. 3-4).
c. Tolerancia: faltan los animales (Hto 5-10 %, Hb 1,5-3) y la conclusión «Hb hasta 5 es segura; algunos toleran 2-3» (p. 7).
d. Preparaciones: faltan 1-6 °C, «la leucorreducción universal aún no en EE. UU.» y «el lavado no quita leucocitos» (p. 9-10).
e. Hemolítica: falta «si la sangre es la correcta, la reacción es improbable» (p. 12).
f. CID: falta la eclampsia en las obstétricas (p. 26).
g. PTT: «más frecuente en mujeres» es «tres veces más» (p. 27); falta «el desencadenante de los anticuerpos se desconoce».
h. Recambio: «(con sus autoanticuerpos)» **no está en la p. 28** (frase nueva sin página: quitarla o rotularla).
i. SHU atípico: la fuente dice «hereditario» (p. 28); la ficha, «una forma».
j. Plaquetas: «leucorreducción rutinaria hoy»; la fuente dice «se está haciendo rutinaria» (p. 30).
k. Crio: faltan «con sangrado activo hará falta más» y «puede guiarse por tromboelastografía» (p. 35). H5 lo necesita.
l. Fig. 12.2 (p. 6): el rótulo dice «225 % de cambio en el gasto», pero los puntos van de 5,8 a 13 L/min (×2,25, es
   decir, +125 %). Si se recrea, nota de fidelidad («el gasto llega al 225 % del inicial») y ninguna pregunta dice «sube un 225 %».

---

## 10. Decisiones para el usuario (parada 1)

1. **El vaso que sangra**: construirlo como modelo nuevo (recomendado) o meterlo en el telar. Dirección A (corte de
   grabado con el delta) o B (la lupa de la herida).
2. **El capilar que compensa**: la orden «el corazón compensa» y la frase corregida del estado `anemia` del bloque 1.
3. **Formas nuevas** (lámina en la maqueta): esquistocito, FvW, ADAMTS-13, fibrinógeno, dímero-D, factor tisular,
   neutrófilo, macrófago, fichas de factores.
4. **¿El vaso lleva Mayéutica propia?** Recomendado: no duplicar. Su pestaña de preguntas usa los mismos datos que
   Estudiar de las fichas 4-6 (`b2-hemostasia.js`).
