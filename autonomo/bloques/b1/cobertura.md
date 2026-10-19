# Bloque 1 · Marino caps. 1-11 · Mapa de cobertura

*(Profesor, modo cobertura, 19/10/2026. Tarea `b1-cobertura`. Hecho a partir del texto completo de las 23 fichas de
`js/modules/libros/marino-fundamentos.html`, sus figuras reales (`js/modules/libros/img/mar-fig*.jpg`), los tres PDF
de `docs/` (páginas comprobadas con `pdftotext`), el río y mar (`agua-viva*.js`, `agua-viva-data.js`), el motor del
latido (`js/modules/eco/motor.mjs`, `escenarios.mjs`, `referencias.mjs`) y el mapa visual de `autonomo/ideas/marino.md`.
No se ha abierto la app: no hacía falta para ver ninguna figura ni ningún modelo.)*

**Convención de ids**: en las tablas, `#x` quiere decir `#mar-x` (todos los ids del bloque llevan el prefijo `mar-`).
Las páginas son del PDF (lo que va tras `#page=`), no las impresas: **A** = `marino-2024-acceso-vascular-practicas-caps1-4.pdf`,
**M** = `marino-2024-practicas-monitorizacion-caps5-9.pdf`, **F** = `marino-2024-fluidoterapia-caps10-11.pdf`.

---

## 0. El bloque en una pantalla

| Grupo | Fichas | Modelo vivo | Ideas | Cubiertas | % | Se ven en el modelo |
|---|---|---|---|---|---|---|
| A · Accesos vasculares (caps. 1-4) | 8 | **Catéter vivo** (nuevo, maqueta) | 104 | 93 | 89 % | 29 (28 %) |
| B · Oxígeno (caps. 7, 9) | 4 | **Capilar y oxígeno** (nuevo, maqueta) | 54 | 49 | 91 % | 31 (57 %) |
| C · Hemodinámica (caps. 8, 11) | 4 | **Circulación viva** (existe; hay que ampliar el motor) | 52 | 47 | 90 % | 25 (48 %) |
| D · Fluidos (cap. 10) | 2 | **Río y mar** (existe) | 29 | 26 | 90 % | 12 (41 %) |
| E · Sin modelo claro (caps. 4-6) | 5 | Ninguno hoy (propuestas en §4) | 82 | 73 | 89 % | 0 |
| **Bloque** | **23** | | **321** | **288** | **≈90 %** | **97 (30 %)** |

**Cómo se cuenta.** Una «idea importante» es lo que un R1 tiene que saber o hacer: un mecanismo, una cifra que
cambia una decisión, un corte, una conducta. No cuentan las anécdotas e historias (Forssmann, Wren, Hamburger, los
bombardeos de Londres, la opiofobia): van a «Para profundizar» sin restar. Una idea está **cubierta** si la enseña el
modelo en un estado, una pregunta de la Guía socrática, una del Examen o un paso de un caso. Lo demás va a «Para
profundizar» con su id.

**Lectura honesta del número.** La Mayéutica llega al ≈90 % en todos los grupos, pero el **modelo vivo solo enseña el
30 %** del bloque, y **nada** en las 5 fichas del grupo E (y casi nada en la VIII, microbioma). La pregunta del usuario
(«si entro desde la primera ficha, ¿qué modelo vivo me explica la teoría?») hoy tendría respuesta en 17 de 23 fichas.
Con las tres propuestas de §4 (mucosa viva, vaso que sangra, paciente en la cama) llegaría a 23 de 23.

---

## 1. La ruta del bloque (orden de estudio)

No cambia el orden de las fichas en el cuaderno (sigue los capítulos): es una ruta aparte, con 7 etapas. Empieza por lo
que ya existe y más enseña (el río y mar), va de la fisiología a las herramientas y deja la consulta para el final.
Cada etapa abre el modelo en el estado en que lo dejó la anterior.

| Etapa | Fichas, en orden | Modelo | Por qué aquí |
|---|---|---|---|
| 1 · El agua | XX `mar-cristaloides` → XXI `mar-coloides` | Río y mar | Ya existe y engancha; adónde va lo que infundes |
| 2 · La vuelta al corazón | XXII `mar-retorno-venoso` | Circulación viva (Guyton) + río y mar | Por qué el agua vuelve al corazón y por qué la PVC frena |
| 3 · El oxígeno | XVIII `mar-transporte-o2` → XIX `mar-extraccion-lactato` → XIV `mar-oximetria` → XV `mar-capnografia` | Capilar y oxígeno | Para qué sirve todo lo anterior: llevar O₂ |
| 4 · Medir y decidir | XVI `mar-cateter-ap` → XVII `mar-termodilucion` → XXIII `mar-respuesta-fluidos` | Circulación viva + capilar | La XXIII cierra las etapas 1-4: «¿le doy fluidos?» |
| 5 · El catéter | I `mar-cateteres-flujo` → II `mar-tipos-cateter` → III `mar-eco-intraosea` → IV `mar-cvc-sitios` → V `mar-cvc-complicaciones` → VI `mar-cateter-cuidados` → VII `mar-bacteriemia-cateter` | Catéter vivo | Por dónde entra lo de las etapas 1-4 y qué se complica |
| 6 · Prevenir | VIII `mar-microbioma` → IX `mar-ulcera-estres` → X `mar-tromboprofilaxis-farmacos` → XI `mar-tromboprofilaxis-escenarios` | Mucosa viva y vaso que sangra (si se aprueban, §4) | La VIII sale de la VII (la hipótesis del intestino, `#bac-intestino`) |
| 7 · Que no sufra | XII `mar-analgesia` → XIII `mar-sedacion` | Paciente en la cama (si se aprueba, §4) | Primero el dolor, luego la sedación (como la propia ficha) |
| Cierre (opcional) | Caso transversal «La semana de la Sra. R.» (§5) | Todos | Un paciente que recorre las 23 fichas |

---

## 2. Las tablas por grupo

Columnas: **Modelo y estado** (qué se ve al pulsar Visual), **Guía socrática** (la cadena de preguntas, en orden),
**Examen MIR** (lo que se pregunta y la trampa que lo hace difícil), **Casos** (§3), **Para profundizar** (con su id)
y **Cobertura** (ideas cubiertas / ideas importantes). «→» separa las preguntas de una cadena. En la Guía, las que
dicen *predice* se contestan antes de que el modelo enseñe la cifra (REGLAS §8, «Predice y comprueba»).

### 2.A · Accesos vasculares → catéter vivo (`data-cateter-vivo="<estado>"`, nuevo)

| Ficha | Modelo y estado | Guía socrática | Examen MIR (trampa) | Casos | Para profundizar | Cob. |
|---|---|---|---|---|---|---|
| I `mar-cateteres-flujo` (A p. 2-5) | `calibre` → `longitud` → `altura` → `infusor` | *Predice*: 16 G y 20 G se diferencian <1 mm; ¿cuánto más pasa el 16 G? (220 frente a 60, `#fig-1-1-calibre`) → ¿y si lo alargas de 2 a 6 pulgadas? (−40 %, `#fig-1-1-longitud`) → canalizas una vena enorme con el mismo catéter: ¿cambia el flujo? (no, `#flujo-cateter`) → sin cambiar de catéter, ¿cómo sacas más? (ΔP: subir la bolsa, `#altura-bolsa`) → ¿qué pides para una hemorragia masiva? (`#corto-grueso`, `#bombas`) | Gauge inverso y no estandarizado frente a French ×0,33 (`#gauge`, `#french`); 9 Fr: 2,97 mm por la ecuación y 3,2 en la tabla (`#french-nota`) — trampa: «a más gauge, más grueso»; 68 cm → 50 mmHg, 100 cm → 75 mmHg; volumétrica 0,1-1.000 mL/h, jeringa ≤100 mL; infusor rápido 1,5 L/min con 7-8 Fr de 2-2,5 pulgadas (`#bombas`) | A1 | Materiales: poliuretano y silicona (sin id: poner `mar-materiales`); Forssmann (no cuenta; sin id: `mar-forssmann`) | 9/10 |
| II `mar-tipos-cateter` (A p. 5-12) | `catalogo` (Tablas 1.2-1.3) → `cvc-luces` | ¿Qué hace central a un catéter: dónde se pincha o dónde acaba? → midline y PICC entran por la misma vena: ¿por qué el PICC pasa solo el 20 % del midline? (longitud, `#tabla-1-2`, `#tabla-1-3`) → ese flujo pobre, ¿qué complicación explicaría? (oclusión) → CVC triple luz: *predice* qué luz da más (distal 16 G, 2,28 L/h, frente a 0,91 y 0,99) → Seldinger: ¿por qué la guía tiene la punta flexible y por qué se confirma antes que el catéter? (`#seldinger`) | Periférico corto: falla 1/3 al primer intento y el 40-60 % en 3 días; midline: basílica (sin arteria ni nervio), 14 días de media, vasopresores 7-8 días sin extravasación; frente al PICC, menos oclusión y bacteriemia y TVP algo mayor pero <5 % (diferencia <2 %) — trampa: «el midline tiene más bacteriemia»; Tabla 1.4 y `#resumen-cateteres` (CVC de último recurso, preferido en la inestabilidad grave) | A1 | Periférico largo de 8 cm, 7-9 días (acordeón sin id: `mar-periferico-largo`) | 9/10 |
| III `mar-eco-intraosea` (A p. 13-19) | `intraosea`; lupa opcional `eco-eje-corto` / `eco-eje-largo` / `eco-compresion` / `eco-doppler` (§6.2, lupa D) | Pinchas en eje corto y ves un punto brillante en la luz: ¿ya pasas el catéter? → ¿por qué las venas invitan a atravesar la pared posterior? (se colapsan) → ¿qué confirmas primero, guía o catéter, y en qué eje? (`#eco-cual`, `#eco-pared-posterior`: 40 % frente a 18 %) → en shock la vena se colapsa: ¿y la médula? (`#io-indicaciones`) → *predice*: ¿cuánto pasa una IO? (25 %, `#io-flujo`) → ¿por qué tan poco y qué haces? (viscosidad + 30 mmHg; presurizar) | Doppler color = dirección, no arteria o vena — trampa clásica: «rojo es arteria»; vena trombosada no se comprime; contraindicaciones IO (`#io-contraindicaciones`); tibia 3 cm bajo la rótula y 2 cm medial, húmero con más flujo (`#io-sitio`) y la errata «fémur» (`#io-errata`); ≤24 h (`#io-duracion`); lidocaína 40 mg en 2 min, repetir 20 mg (`#io-lidocaina`); AHA: IO si falla el primer intento IV | A1 | `#eco-metodo` (5-15 MHz, 9 cm); `#io-complicaciones` (<1 %); historia de la IO (no cuenta; sin id) | 12/14 |
| IV `mar-cvc-sitios` (A p. 23-32) | `colonizacion` con el **paquete de inserción** (Tabla 2.1): cada medida cierra una vía en la piel; lupa D opcional (yugular) | ¿Evitar la femoral para prevenir infecciones tiene base hoy? → entonces, ¿de qué depende el riesgo de infección? (del cuidado del punto, `#sitio-femoral`) → ¿por qué se sigue evitando? (trombosis) → lee la Tabla 2.2 y el texto: ¿dicen lo mismo? (no: `#tabla-2-2-errata`, enseña a leer una errata) | 6 indicaciones y 4 con alternativa; central preferible en shock y obligado en HD aguda (`#cvc-alternativas`); sin contraindicación absoluta, plaquetas <20.000/INR >3 «sin pruebas» (`#cvc-contraindicaciones`); clorhexidina 2 % en alcohol 70 %, 30 s (2 min en piel húmeda), ≥6 h (`#clorhexidina`); yugular: derecha, Trendelenburg 15° = +20-25 % (más no añade), giro >40°, carótida 9,2 % frente a 1,8 %, catéter en la carótida: no retirar (`#yugular`); subclavia: 5 mm de la pleura, sin rodillo, estenosis 15-50 % (`#subclavia`); femoral: anti-Trendelenburg +50 %, vena medial (`#femoral`) | A2, A3 (error) | Abordajes por referencias anatómicas (dentro de `#yugular`, `#subclavia`, `#femoral`) | 11/12 |
| V `mar-cvc-complicaciones` (A p. 33-38) | `aire` → `trendelenburg` → `punta` | Respira con el conector abierto: ¿qué gradiente mete aire? (presión intratorácica negativa) → *predice*: ¿cuánto aire pasa por un 14 G con 5 mmHg? (100 mL/s, `#aire-fisio`) → ¿cuánto mata? (200-300 mL, 3-5 mL/kg, en segundos) → ¿por qué Trendelenburg en la yugular y no en la femoral? (`#aire-prevencion`) → si entra, ¿por qué el decúbito lateral izquierdo? (`#aire-manejo`) | Rx portátil pierde hasta el 50 % (aire anterior, `#neumo-rx`); ausencia de deslizamiento no patognomónica (`#neumo-eco`); neumotórax 1 % con eco y 4 % sin ella; punta 1-2 cm sobre la AD, a la altura de la carina, malposición 15-18 % (`#punta-objetivo`, `#punta-rx`); burbujas en <2 s = cava superior (`#punta-eco`); punta en la aurícula: 2.348 sin perforación, no recolocar (`#punta-auricula`) | A3 | — (todo cubierto) | 11/11 |
| VI `mar-cateter-cuidados` (A p. 40-45) | `aposito-humedo` → `oclusion-trombo` → `oclusion-precipitado` → `punta-izquierda` (Fig. 3.1) | El catéter no refluye: ¿le pasas una guía? (no, `#permeabilidad`) → ¿qué lo ocluye más a menudo? (trombo, 60 %) → si la alteplasa no funciona, ¿qué miras? (lo que pasaba por esa luz) → ¿por qué un precipitado alcalino se disuelve con un álcali? (regla de `#tabla-3-3`) → el apósito oclusivo con sangre debajo, ¿protege o daña? (`#aposito-paradoja`) | Tabla 3.1 (transparente 7 días, gasa 48 h, salino mejor que heparinizado, sin recambio programado); recambio del periférico por flebitis (irritación, no infección) frente al central por infección; eritema solo no obliga; arteriales: citrato 1,4 % (`#sellado`); alteplasa 2 mg, 30 y 120 min, 80-90 % (`#alteplasa`); TVP del brazo: 90 % por catéter, Urschel, <10 % con EP (`#tvp-superior`); eco 97/96 %, dímero no (`#tvp-diagnostico`); retirar no obligatorio (`#tvp-manejo`); perforación de la VCS por catéteres izquierdos (`#perforacion-*`); taponamiento 40-100 % (`#taponamiento`) | A4 | Tipos de apósito (acordeones sin id: `mar-apositos`); `#tvp-femoral` (1,6 %) | 14/16 |
| VII `mar-bacteriemia-cateter` (A p. 46-57) | `colonizacion` → `biopelicula` → `hemocultivos` → `recambio-guia` | ¿Por dónde entra el germen en un CVC no tunelizado? (piel, `#bac-vias`) → lleva un día puesto: ¿ya hay biopelícula? (sí, `#biofilm`) → ¿por qué el antibiótico no la limpia? (100-1.000 veces más) → entonces, ¿qué pasa si lo recambias sobre guía? (`#bac-guia`) → la fiebre no prueba nada y antes de 48 h no hay clínica: ¿cómo sabes que es el catéter? (Tabla 3.4) → ¿lo quitas ya? (11 %, `#bac-no-retirar`) | 4,6 por 1.000 días-catéter y mortalidad 12-25 % (`#bac-epidemio`); cultivar cada luz: una sola pierde el 38 % (`#bac-luces`); cuantitativo ≥3 veces (94 %) frente a tiempo diferencial ≥2 h (91 %); vancomicina como columna, BGN si neutropenia o gravedad, equinocandina con catéter femoral, NPT, hematológica… (`#tabla-3-6`); los 4 criterios de retirada (`#bac-retirar`); duraciones (`#bac-duracion`); ETE en toda bacteriemia por *S. aureus* y tromboflebitis 4-6 semanas (acordeones sin id) — trampa: «SCN con buena respuesta: 14 días» | A2 | `#bac-sellado` (2-5 mg/mL, 24 h); `#tabla-3-5` (los % de cada germen, salvo «SCN primero» y «estafilococos + enterococos = 45 %») | 14/16 |
| VIII `mar-microbioma` (A p. 58-66) | Hoy solo la vía 4 del catéter vivo (`colonizacion`, del intestino a la sangre, rotulada «opinión del autor»). Con la **mucosa viva** (§4.1): `disbiosis`, `ph-gastrico`, `sdd` | Si la luz del intestino está «fuera» del cuerpo, ¿qué separa 10¹² microbios de tu sangre? (`#piel-interna`) → ¿cómo te defiende tu propia flora? (3 mecanismos, `#microbioma-proteccion`) → ¿qué pasa con antibiótico de amplio espectro? (disbiosis → translocación) → ¿por qué la hipoperfusión esplácnica cierra un círculo? (`#motor-fmo`) → ¿para qué sirve de verdad el ácido gástrico? (`#acido-antiseptico`) → entonces, ¿qué esperas al suprimirlo? | Densidad: estómago <10³, colon 10¹² (Fig. 4.1); pH 4/3/2 y *Salmonella* (`#fig-4-3`); saliva 750 mL, 10⁶/mL, aspirar el 0,13 % (`#saliva`); BGN en la orofaringe ~70 % en UCI por adhesión, no por exposición (`#colonizacion-orofaringe`); clorhexidina 0,12 % (no 2 %), 11 ensayos con más mortalidad, retirada (`#tabla-4-1`); SOD −33 %, SDD −67 %, Fig. 4.5 (4,5/3/1,4 por 1.000 días); SDD: >72 h, cefuroxima 4 días, no con multirresistentes (`#sdd`); probióticos solo en los 2 primeros días (`#probioticos`) | E5 | `#microbioma-cifras` (genomas, 2 kg); «¿Por qué se ignora?» (dentro de `#sdd`) | 13/15 |

### 2.B · Oxígeno → capilar y oxígeno (`data-capilar-vivo="<estado>"`, nuevo)

| Ficha | Modelo y estado | Guía socrática | Examen MIR (trampa) | Casos | Para profundizar | Cob. |
|---|---|---|---|---|---|---|
| XVIII `mar-transporte-o2` (M p. 67-74) | `normal` → `anemia` → `hipoxemia` (la Fig. 9.2 se construye al visitarlos) y la curva (Fig. 9.1) con A y V | ¿Por qué hace falta la Hb, si el O₂ se disuelve en el plasma? (0,003 × PO₂, `#o2-disuelto`) → *predice*: PaO₂ de 90 a 60, ¿cuánto cae la saturación? (poco: parte plana, `#curva-forma`) → *predice*: Hb a la mitad o PaO₂ a la mitad, ¿qué baja más el CaO₂? (50 % frente a 20 %, `#anemia-hipoxemia`) → ¿qué tres cosas multiplicas para el aporte? (`#do2`) → ¿y qué necesitas además para el consumo? (SvO₂ mixta, `#vo2`) | Tabla 9.1 (venoso 40 mmHg, 73 %, 15 mL/dL; 250 mL de O₂ arterial frente a 555 venoso: 70 % en las venas, `#o2-reparto`); P50 27 (15 en sangre de 3 semanas) y la nota de 22,5 de El Libro Azul; desplazamientos (`#curva-desplazamientos`); disuelto = 1,5 %; ×10 de mL/dL a mL/L; Tabla 9.2 y su nota; O₂ER ≈ 1 − SvO₂ (`#o2er`); VO₂ calculado ±18 % frente a medido ±5 % (`#tabla-9-3`) — trampa: «la hipoxemia baja más el contenido que la anemia» | B2 | `#vo2-medido` (la calorimetría) | 13/14 |
| XIX `mar-extraccion-lactato` (M p. 75-85) | `bajo-gasto` → `umbral` → `dependiente` → `sepsis` → `tiamina`; lupa «la mitocondria» (Fig. 9.5); la Fig. 9.3 viva | Si el aporte cae a la mitad, ¿por qué el consumo no cambia? (`#extraccion-curva`) → ¿hasta dónde puede subir la extracción? (50 %) → *predice*: ¿qué SvO₂ verías ahí? → un séptico con SvO₂ 85 % y lactato 5: ¿le sobra O₂? (`#sao2-svo2-guia`: defecto de utilización) → si hay O₂, ¿de dónde sale el lactato? (PDH bloqueada, catecolaminas) → ¿y si fuera un alcohólico? (tiamina) → ¿un lactato alto prueba hipoxia? (`#lactato-circular`, `#lactato-conclusion`) | Cortes de la Tabla 9.4 (SaO₂−SvO₂ ≥50 % / <20 %; SvO₂ ≤50 / >80), válidos solo con SaO₂ >90 %; SvO₂ normal 65-75 (con la nota de 70-75); ScvO₂ +7 % de media y hasta +18 % en shock, objetivo 70 % (`#scvo2-9`); Fig. 9.4 (15/25/38 %; 4/13/43 %); Tabla 9.5 (propofol, propilenglicol, metformina, β-agonistas…); 20 mmol/kg/día de lactato aerobio; combustible: 60 % del miocardio, 25-30 % del cerebro (`#lactato-combustible`); PO₂ intracelular ~5 mmHg (`#lactato-contra`) — trampa: «SvO₂ 85 %: buena perfusión» | B3 | `#sto2`; `#hipoxia-final` | 14/16 |
| XIV `mar-oximetria` (M p. 36-43) | Lupa «el dedo»: `normal` (660/940 nm, pletismograma) → `dedo-frio` (pasa a la frente) → `co` → `dual` | ¿Cómo sabe una pinza cuánta Hb lleva O₂ sin sacar sangre? (dos colores, `#oxi-absorcion`) → ¿cómo ignora la sangre de las venas? (solo lo que late, A/B, `#pulsioximetria`) → dedo frío y vasocontraído: ¿dónde lo pones? (`#oxi-frente`) → *predice*: en el CO, ¿la SpO₂ sube, baja o se queda? (sobrestima, `#cooximetria`) → entonces, ¿qué pides? (cooximetría) | Fórmula de la SpO₂ y su nota (`#spo2-formula`); ±3-4 % aislada, ±2-3 % seriada; 1-3 % más con piel oscura; hipoxemia oculta 6,9/6,0/4,9 % (`#hipoxemia-oculta`); objetivos 90-94 % y 88-92 % en el hipercápnico, cambio de 3-4 % (`#spo2-objetivo`); SvO₂ mixta: cambio >5 % durante >10 min; ScvO₂ menor que SvO₂ en el sano y mayor en el shock (`#scvo2`); SpO₂−SvO₂ ≥50 % como indicador para transfundir (`#dual`) — trampa: «en el CO la SpO₂ infraestima» | B1, B2 | `#oxi-venosa` (fibra óptica, cada 5 s); historia (`#oxi-historia`, no cuenta) | 13/14 |
| XV `mar-capnografia` (M p. 44-49) | Lupa «la boca»: `capno-normal` → `capno-epoc` → `capno-sedacion` → `capno-esofago` → `capno-rcp`; el gasto mueve la PETCO₂ | ¿De dónde sale el gas de la fase I? (espacio muerto anatómico, `#capno-f1`) → ¿por qué en la EPOC sube despacio la fase II? (`#capno-f2`) → tubo en el esófago: ¿qué ves? ¿Y con el tubo bien puesto en una parada? (sin retorno venoso no llega CO₂, `#capno-intubacion`) → con un bolo, si el gasto sube, ¿qué hace la PETCO₂? (`#capno-gasto`) → ¿por qué la diferencia PaCO₂ − PETCO₂ crece en casi toda insuficiencia respiratoria? (`#gradiente-co2`) | 1 de cada 18 intubaciones urgentes es esofágica no reconocida y auscultar no basta; en la sedación la PETCO₂ sube antes de que caiga la SpO₂ (`#capno-sedacion`); r = 0,87 en ventilados, no en sanos en espontánea; ≤10 mmHg tras 20 min de RCP (`#capno-rcp`); Tabla 7.1: PETCO₂ > PaCO₂ con hipermetabolismo, acidosis metabólica e hiperoxia — trampa: «la embolia pulmonar sube la PETCO₂» | B4 | `#capno-nasal` | 9/10 |

### 2.C · Hemodinámica → circulación viva (existe; ampliar el motor)

Estados propuestos (el nombre del atributo lo fija el constructor en `b1-modelos`; puede ser `data-eco-escenario` con
claves nuevas o un `data-circulacion-viva` nuevo en `modelosVivos`). Lo que hoy existe: escenarios `normal`, `hemorragia`,
`fallo`, `derrame`, `vasoplejia` y las formas `hipertrofia`, `dilatada`, `tep`; el motor ya calcula `pad`, `pvd`, `pap`,
`pai`, `pmls`, `rRetorno`, GC, RVS y RVP. **Lo que falta construir** está en §7 (huecos 1-5).

| Ficha | Modelo y estado | Guía socrática | Examen MIR (trampa) | Casos | Para profundizar | Cob. |
|---|---|---|---|---|---|---|
| XXII `mar-retorno-venoso` (F p. 21-27) | `guyton` (curva de retorno venoso cruzada con la de función cardíaca, Pms y PVC) → `bolo-no-responde` → `hemorragia`; río y mar `hemorragia` → `reanimacion` → `ringer`; la Fig. 11.1 (fregadero) como lámina | Si el agua del fregadero sale por su propia altura, ¿qué empuja la sangre de vuelta? (Pms − PVC, `#rv-fregadero`, `#rv-ecuacion`) → *predice*: sube la PVC 1 mmHg sin cambiar el volumen; ¿el retorno sube o baja, y cuánto? (−14 %, `#rv-pvc`) → le das 500 mL y la Pms sube: ¿basta para saber si responde? (`#pms-fluidos`) → déficit del 15 %: ¿cuántos mL le faltan a un varón de 75 kg, cuánto Ringer necesitas y dónde acaba? (450 → 2,25 L, 1,8 L al intersticio) → ¿por qué la PVC no sirve de objetivo? (`#pvc-volemia`) | Pms 7-8 mmHg en animales y 14-20 en humanos (`#pms`); taquicardia en decúbito ausente incluso con 25 %, hipotensión >30 %, ortostatismo ≥30 lpm con 15 % (`#constantes-volemia`); PVC y volemia r = 0,17 (`#pvc-volemia`); VCI poco fiable y su nota con FATE (`#vci-volemia`, `#vci-discrepancia`); BVA: +29/−8/+37 % (`#bva`); 40/36 mL/kg; hipoalbuminemia y permeabilidad (`#agravantes`) — trampa: «subir la PVC mejora el retorno» | C1 (y los casos w1-w2 del río y mar) | `#pms-stopflow`; `#pms-pausa` | 13/15 |
| XXIII `mar-respuesta-fluidos` (F p. 28-37) | `bolo-responde` / `bolo-no-responde` (VS >10 %), `epp` (300 mL, VTI subaórtico en el ecógrafo), `vvs` (necesita presión intratorácica, hueco 3); del capilar, `scvo2` y `gap-co2` | Solo la mitad responde: ¿responder significa estar seco? (`#respuesta-50`) → ¿cómo lo predices sin infundir nada? (EPP) → ¿por qué empezar semiincorporado y no en supino? (la sangre esplácnica, `#epp-pasos`) → si la respuesta llega con taquicardia, ¿qué sospechas? (dolor, `#epp-dolor`) → ¿por qué la PA sola no basta? (gasto continuo) → ventilado sin esfuerzos ni arritmia, ¿qué más miras? (VVS ≥15 %) | 500 mL en 10-15 min, importa la velocidad, el pico se va en 10 min (la termodilución llega tarde) (`#sobrecarga-prueba`); EPP S 85 % / E 92 %, falsos negativos con PIA alta (`#epp`); FloTrac infraestima con resistencias bajas (`#contorno-pulso`); VVS ≥15 % → 80 % (`#vvs`); los no invasivos no bastan (`#gc-continuo-pegas`); ScvO₂ <65 (descarta antes la anemia), ≤50, >80 (`#scvo2-pautas`); gap 2-5 / >6 mmHg, preferible en el séptico o con anemia, mejor combinados (`#gap-vs-scvo2`); eliminar 2 L tarda >2 días (`#fm-final`) — trampa: «VS +8 % tras un bolo: responde» | C1, B3 | `#doppler-esofagico` | 14/15 |
| XVI `mar-cateter-ap` (M p. 50-56) | `cap-avance` (el catéter avanza AD → VD → AP → enclavamiento leyendo `pad`, `pvd`, `pap`, `pai` del motor; las Figs. 8.2-8.4 como lámina) → `enclavamiento` → `onda-v` (con `eroaMitral`) → `fallo` / `hemorragia` | *Predice*: avanzas desde la cava, ¿qué cambia al cruzar la tricúspide? → ¿y al cruzar la pulmonar: sube la sistólica o la diastólica? (`#cap-pasos`) → con el globo inflado no hay flujo: ¿qué presión mide la punta? (Q = 0 → PAI, `#enclavamiento-principio`) → ¿por qué no lo dejas inflado? → con hipoxemia y vasopresores, ¿un enclavamiento de 10 descarta el edema hidrostático? (no: Pc − Pw = Q × Rv, `#enclavamiento-hidrostatica`) | 110 cm, luz proximal a 30 cm, globo de 1,5 mL (`#cap-anatomia`); la diastólica pulmonar sustituye al enclavamiento solo sin HTP; ondas a, c, v y la v gigante de la IM; en la HTP, enclavamiento < diastólica (`#enclavamiento-ondas`); final de espiración: el punto más bajo en VM y el más alto en espontánea (`#enclavamiento-respiracion`); la PEEP lo eleva (`#enclavamiento-peep`); cambio >4 mmHg (`#enclavamiento-variabilidad`) — trampa: «en VM se mide en el punto más alto» | C2 | Introductor de 8-9 Fr (párrafo «Colocación», sin id: `mar-cap-colocacion`); historia (`#cap-historia`, no cuenta) | 10/11 |
| XVII `mar-termodilucion` (M p. 57-66) | `termodilucion` (curva cuya área sale del GC del motor) en `normal`, `fallo` (área grande) y `vasoplejia` (área pequeña); la IT, solo como lámina (hueco 2); tablero de la Tabla 8.1 leído del motor | Inyectas 10 mL fríos: si el corazón bombea mucho, ¿la sangre se enfría mucho o poco, y cuánto rato? → ¿área grande = gasto alto o bajo? (`#termo-metodo`) → si inyectas 7 mL o tibio, ¿qué número te dará? (sobrestima, `#termo-errores`) → ¿y con insuficiencia tricuspídea? → ¿por qué la IRVS no es una resistencia «de verdad»? | 3 medidas que difieran ≤10 %, cambio significativo >10 % (`#termo-cuantas`); cortocircuitos: falsamente alto en los dos sentidos; Tabla 8.1 (PVC 0-5, PAWP 6-12, IC 2,4-4, IS 20-40, IRVS 25-30 UW, IRVP 1-2, SvO₂ 70-75, DO₂ 520-570, VO₂ 110-160, O₂ER 0,2-0,3); SC = [talla + peso − 60] / 100 y su nota (`#sc`); fórmulas de IRVS e IRVP; 6 usos (`#cap-usos`); «es un monitor, no un tratamiento» (`#cap-final`) — trampa: «cortocircuito izquierda-derecha: gasto falsamente bajo» | C2 | `#termo-continuo` | 10/11 |

### 2.D · Fluidos → río y mar (existe: `data-agua-viva`)

El río y mar ya tiene 14 preguntas y 3 casos (`js/data/agua-viva-data.js`). Para estas dos fichas se reparten así:
`ag-01`, `ag-02`, `ag-cloro`, `ag-03`, `ag-06` → XX; `ag-05` → XXI; `ag-07`, `ag-09`, `ag-10` → XXII; caso `w1`
(hemorragia) → XXII; caso `w2` → XXI y XXII. Falta escribir la Guía socrática por ficha y el Examen MIR.

| Ficha | Modelo y estado | Guía socrática | Examen MIR (trampa) | Casos | Para profundizar | Cob. |
|---|---|---|---|---|---|---|
| XX `mar-cristaloides` (F p. 2-11) | `inicio` → `salino` → `glucosado` → `ringer` → `hipertonico`; el cloro, al ácido-base vivo (`fisio-acidobase-acidosis`) | De 45 L de agua, ¿cuánto es río? (`#tabla-10-1`) → *predice*: de 1 L de salino, ¿cuánto se queda en el río y por qué? (el Na⁺ se reparte por todo el extracelular, `#osmosis`) → ¿por qué el total pasa de 1 L? → el glucosado es casi isotónico: ¿por qué acaba en las células? (`#glucosado-volumen`) → 250 mL al 7,5 %: ¿de dónde salen 1.235 mL? (`#hipertonico`) | Salino: 154/154, 308 mOsm, pH 5,7 y «lo que más importa es el cloro»; pH 7,41 → 7,28 a 30 mL/kg/h (Fig. 10.2); FRA por cloro, leve; Ringer: Cl 109, cada mmol de lactato da un mmol de HCO₃⁻; 28 mmol/L, el hígado aclara 100 mmol/h, +0,9 mmol/L con 30 mL/kg; sangre extraída por la vía del Ringer = lactato falso; calcio y citrato; su K⁺ no preocupa (`#ringer`); TCE: 10 % 0,6 mL/kg = 2 mL/kg de manitol 20 %, PIC <20 y osmolalidad <320; glucosado: 170 kcal/L, lactato 5 % frente a 85 % (`#glucosado-lactato`); glucosalino 560 mOsm — trampa: «el Ringer sube el lactato del paciente» | D1, w1 | Ringer acetato y Plasma-Lyte (acordeón sin id: `mar-ringer-acetato`); `#glucosado-hiperglucemia`; historia (`#fluidos-historia`, no cuenta) | 16/18 |
| XXI `mar-coloides` (F p. 12-20) | `albumina5` → `albumina25` → `hemorragia` (el intersticio cede agua) | ¿Qué retiene el agua en el río? (oncótica; la albúmina hace el 80 %) → *predice*: 1 L de albúmina 5 % frente a 1 L de salino, ¿cuántas veces más en el río? (700 frente a 275) → 100 mL de albúmina 25 %: ¿por qué el río gana más de 100 mL y de dónde sale? → ¿se la pondrías a un sangrado? (no repone, `#albumina`) → ¿por qué se pensó que en la hemorragia había que reponer el intersticio? (`#cristaloide-historia`) | Tabla 10.3 (oncótica 70/40/30/20, plasma 28; expansión 3-4 con la de 25 %); duración 24 h frente a 6-12 h (`#nota-albumina-duracion`); TCE con más mortalidad; HES: más sustitución, más duración y más efectos; tetrastarch sin coagulopatía hasta >50 mL/kg; amilasa ×2-3 con lipasa normal (`#hes`); 500 mL de dextrano-40 = triple de gasto que 1 L de Ringer (`#coloide-gasto`); enfoque a medida (`#fluido-a-medida`) — trampa: «albúmina 25 % en el shock hemorrágico» | D2, w2 | `#dextranos`; Tablas 10.4 y 10.5 (detalle) | 10/11 |

### 2.E · Sin modelo claro (hoy: Mayéutica + calculadoras; propuestas de modelo en §4)

| Ficha | Modelo y estado | Guía socrática | Examen MIR (trampa) | Casos | Para profundizar | Cob. |
|---|---|---|---|---|---|---|
| IX `mar-ulcera-estres` (A p. 67-75) | Hoy ninguno (la vista Visual de niveles de la Tabla 4.2 sigue). Con la **mucosa viva**: `isquemia`, `enteral`, `ibp` | Si el jugo gástrico tiene el pH del zumo de limón, ¿por qué no se come el estómago sano? (moco con HCO₃⁻ a pH 7 + flujo, `#ulcera-patogenia`) → ¿qué rompe esa defensa en la UCI? (isquemia) → ¿por qué protege la nutrición enteral? (trófica y sube el pH, `#enteral-protege`) → si la causa es la isquemia, ¿qué esperas de quitar el ácido? (efecto pequeño) → ¿y qué cuesta quitarlo? (*C. difficile* ×3, neumonía) | Sangrado significativo: caída ≥20 mmHg, vasopresor ≥20 %, Hb ≥2 g/dL, ≥2 CH (`#sangrado-significativo`); niveles y regla de la Tabla 4.2; corticoides y anticoagulación no son motivo (`#mito-corticoides`); famotidina 20 mg/12 h, −50 % con ClCr <50; IBP > anti-H2 > sucralfato; sucralfato sin enteral y con el aluminio que fija fármacos; Fig. 4.6: 4,2 → 2,5 % y 21,9 frente a 22,6 %; desprescribir (`#desprescribir`); >80 % la reciben y el 70 % no la necesita (`#profilaxis-uso`) — trampa: «corticoides en dosis altas obligan al IBP» | E1 | `#acidofobia`; clopidogrel (dentro del acordeón IBP, sin id: `mar-ibp-clopidogrel`) | 13/15 |
| X `mar-tromboprofilaxis-farmacos` (M p. 1-9) | Hoy ninguno (la Fig. 5.2 es lámina). Con el **vaso que sangra** (§4.2): `hnf`, `hbpm`, `fondaparinux`, `acod-xa`, `dabigatran`, `tih` | ¿Por qué basta tan poca HNF para prevenir? (la antitrombina se activa con muy poco, `#hnf`) → ¿por qué la HNF tiene efecto variable y la HBPM no? (el anti-IIa depende de la longitud) → ¿qué une la heparina a las plaquetas y qué provoca? (FP4 → TIH, no depende de la dosis) → con TIH previa, ¿qué fármaco evita el problema y por qué? (fondaparinux, el pentasacárido) → ¿dónde actúa cada ACOD? (Fig. 5.2) | Dosis y ajustes de las Tablas 5.2 y 5.3 (calculadora `#profilaxis-calc`); HBPM frente a HNF: 90 frente a 15-30 %, TIH 0,2 frente a 2,6 %; enoxaparina con ClCr <30 y HNF con ClCr <20; dalteparina sin ajuste y su nota con ClCr <15; fondaparinux 35-50 frente a 20-50 (`#fondaparinux-errata`); anti-Xa 0,2-0,5; ACOD solo en cadera y rodilla, warfarina único oral en la IR grave, rivaroxabán con más sangrado en el médico (`#acod-puntos`); neuroeje: HNF ≥12 h, enoxaparina ≥24 h, dabigatrán y rivaroxabán ≥48 h, apixabán ≥24 h; 58 % en trauma, ×8 médico, ×14 déficit de AT III, 1/3 de las muertes en cirugía; la menstruación no contraindica — trampa: «la TIH depende de la dosis» | E2 | `#fig-5-1` (lectura aproximada); `#aspirina` | 18/20 |
| XI `mar-tromboprofilaxis-escenarios` (M p. 10-15) | Hoy ninguno. Con el **vaso que sangra**: `cni` (la pierna que se comprime de distal a proximal) | Si la inmovilidad causara TVP, ¿qué verías en los ancianos encamados? (`#inmovilidad`) → con un gasto normal en un sistema cerrado, ¿hay estasis? → ¿qué otra cosa explicaría la TVP del alto riesgo? (la inflamación) → ¿qué hace la CNI además de mover sangre? (fibrinólisis) | Medias 18/8 mmHg, nunca solas; CNI 35-40/20 mmHg, ciclo de 10 s, sin superar la diastólica (`#mecanica`, `#cni-pegas`); filtro de VCI no es profilaxis (`#filtro-vci`); cirugía general ≥6 h (HNF) / ≥12 h (HBPM) antes y reanudar a las 6/12 h, 4 semanas en la oncológica; prótesis: ACOD; fractura de cadera: HBPM; 35 días; trauma: TCE con CNI hasta 24 h de TC sin sangrado y luego enoxaparina 30 mg/12 h, anti-Xa; UCI médica: HBPM sola, sin mecánica y sin prolongar; ClCr <15: HNF o warfarina (con la nota de la dalteparina) — trampa: «al paciente de UCI, HBPM + CNI» | E2, E3 | Bariátrica y neurocirugía/cirugía cardíaca (acordeones sin id: `mar-esc-bariatrica`, `mar-esc-neuro-cardio`) | 12/14 |
| XII `mar-analgesia` (M p. 16-23) | Hoy ninguno (calculadoras BPS y no opioides). Con el **paciente en la cama** (§4.3): `bps` | ¿El diazepam alivia el dolor? (no; el 80 % de los residentes falla, Fig. 6.1) → un intubado no puede hablar: ¿le miras la FC para saber si le duele? (no, `#constantes-dolor`) → entonces, ¿qué miras? (BPS) → ¿por qué le duele más que a un sano lo mismo? (hipernocicepción, `#hipernocicepcion`) → ¿qué dosis de opioide es la buena? (la que responde, `#opioide-dosis-individual`) | Numérica >3 y BPS ≥6 (`#bps-calc`); Tabla 6.2 (fentanilo 1-2 min, 600×; histamina solo la morfina; ajuste renal: morfina −50 %, hidromorfona nada, fentanilo ¿evitar?); la morfina no da broncoespasmo; remifentanilo: esterasas, 10 min; meperidina: normeperidina 15-40 h; opioide + BZD hipotensión (`#opioide-cardio`); metilnaltrexona sin beneficio en UCI; paracetamol ≤4 g; ketorolaco 15 mg con IR, ≥65 años o <50 kg, −25-50 % de opioide; ketamina 60-120 µg/kg/h y su nota (`#ketamina-errata`), no en la isquemia — trampa: «la morfina está contraindicada en el asmático» | E4 | PCA (acordeón sin id: `mar-pca`); `#neuropatico`; `#dolor-intro` y `#opiofobia` (no cuentan) | 16/18 |
| XIII `mar-sedacion` (M p. 24-35) | Hoy ninguno (calculadoras RASS, propofol y el asistente del haloperidol). Con el **paciente en la cama**: `rass`, `despertar` (Tabla 6.7), `dexmedetomidina` | *Predice*: tras 72 h de propofol, ¿quién despierta antes, el de sedación ligera o el de profunda? (34 min frente a 59 h, `#tabla-6-7`) → ¿qué pesa más, cuánto tiempo o cuán profundo? → ¿a qué RASS titulas? (`#escalas-sedacion`) → ¿por qué el midazolam en perfusión tarda tanto? (`#midazolam`) → ¿qué sedante deja que despierte sin bajarlo? (`#dexmedetomidina`) | RASS y sus 3 pasos; lorazepam: propilenglicol con >0,1 mg/kg/h o >10 mg/h más de 48 h, hiato osmolar >10 (`#lorazepam`); BZD de elección en la abstinencia; vacaciones y sedación ligera (`#bzd-prevencion`); propofol: sin analgesia, 1 kcal/mL, peso ideal, sin carga en el inestable (`#propofol`); PRIS >80 µg/kg/min o >5 mg/kg/h >48 h (descrito con 36), 3 %, 30-35 % (`#pris`); dexmedetomidina: bradicardia, retirada en el 30 %, de elección en el delirio; haloperidol 5 → 10 mg, QTc >500, torsade 3-4 %, >35 mg/día, SNM, y su nota (`#tabla-6-8`) — trampa: «el lorazepam es preferible en perfusión prolongada» (la ficha lo dice como dato de un estudio y luego las guías dicen evitar BZD: el distractor exige leer las dos) | E4, B3 (giro) | `#tabla-6-5` (bolos y perfusiones de BZD); `#nota-propofol-240` (no cuenta) | 14/15 |

---

## 3. Los casos (uno o varios por grupo; el paciente se inventa, la medicina sale de la ficha)

Todos siguen REGLAS §8: 5-8 pasos con su momento, la ficha del paciente que se rellena y lo nuevo en rojo, al menos un
«encuentra el error» y un «piensa y destapa», un giro y «Lo que te llevas» con vuelta a la ficha y al modelo en el
estado del paciente.

| Caso | Fichas | Paciente y pasos | Calculadora de la app | Giro | Encuentra el error | Vuelta al modelo |
|---|---|---|---|---|---|---|
| **A1 · Politrauma: ¿por dónde paso el volumen?** | I, II, III | Motorista de 30 años, hipotenso, con una 20 G en el dorso de la mano y un CVC triple luz de 20 cm. Paso 1: qué catéter (16 G corto, `#fig-1-1-calibre`). Paso 2: qué luz del CVC (distal, `#tabla-1-3`). Paso 3: la bolsa a 100 cm (75 mmHg). Paso 4: se pierden las venas → IO tibial (sitio, confirmación, 25 % y presurizar). Paso 5: despierta y le duele → lidocaína 40 mg en 2 min | `#french-calc` (7 Fr → mm) | El infusor rápido pide un catéter de 7-8 Fr y 2-2,5 pulgadas (`#bombas`) | Plan del residente: «volumen por la luz proximal porque la cava es grande; la IO, 48 h; el Doppler rojo es la arteria» (3 errores) | Catéter vivo `infusor` |
| **A2 · Fiebre el día 9 del CVC** | IV, VI, VII | Mujer de 64 años, sepsis abdominal, CVC yugular derecho. Día 9: fiebre sin foco y eritema en el punto. Paso 1: ¿retirarlo ya? (11 %). Paso 2: hemocultivos de cada luz y periférico (38 %). Paso 3: el catéter crece 2,5 h antes. Paso 4: germen | `#hemocultivos-calc` | *S. aureus* → retirar, sitio nuevo, ETE y 14 días si no hay endocarditis, prótesis ni inmunodepresión | «Recambio sobre guía; el eritema confirma la infección; 7 días» (3 errores; el de los 7 días es de SCN) | `biopelicula` → `recambio-guia` |
| **A3 · Disnea al retirar la vía yugular** | IV, V | Varón de 70 años, sentado a 45° mientras se retira su CVC yugular. Disnea brusca y tos. Paso 1: qué ha pasado (gradiente negativo). Paso 2: manejo (aspirar si sigue el catéter, O₂ 100 %, DLI). Paso 3: nuevo CVC subclavio: Rx sin neumotórax y la punta en la yugular | — | El soplo «en rueda de molino» y luego un déficit focal: el aire cruzó un FOP (`#aire-fisio`) | «Como la Rx no ve neumotórax, descartado; la punta en la aurícula, recolocar» (2 errores) | `aire`, `punta` |
| **A4 · El catéter que no refluye** | VI | Varón de 58 años con NPT por la luz medial de un PICC. Día 12: la bomba alarma por presión. Paso 1: guía no. Paso 2: alteplasa 2 mg, 30 y 120 min, sin éxito. Paso 3: NPT rica en Ca²⁺ y PO₄ → NaOH 0,1 N, luego L-cisteína | — | Día 14: brazo edematoso e ingurgitación del hombro (Urschel): TVP del miembro superior; eco de compresión; retirar no es obligatorio | «Pido dímero-D para descartar TVP y retiro el PICC por norma» | `oclusion-precipitado` |
| **B1 · La SpO₂ que mentía** | XIV | Mujer de 45 años rescatada de un incendio en casa, cefalea y confusión, SpO₂ 99 % en aire. Paso 1: ¿hipoxemia descartada? Paso 2: gasometría con cooximetría | `#cao2-calc` con la SaO₂ real | La SaO₂ de la cooximetría es mucho menor que la SpO₂ (cifra del caso) | «SpO₂ 99 %: sin hipoxemia; si dudo, sensor en la frente» | `co` |
| **B2 · Dos camas, una pregunta** | XVIII, XIV, XIX | Cama 1: Hb 7,5, SpO₂ 98 %. Cama 2: Hb 15, PaO₂ 45 (SaO₂ 78 %). Paso 1: ¿quién lleva menos O₂? Paso 2: CaO₂ 10 frente a 16. Paso 3: DO₂ con GC 5. Paso 4: ScvO₂ de la cama 1 → SpO₂ − ScvO₂ ≥50 % | `#cao2-calc`, `#dual-calc` | La cama 2 hace una sepsis: ScvO₂ 84 % y lactato 4: no mejora, no usa el O₂ | «La cama 2 está peor: la PaO₂ a la mitad baja el contenido a la mitad» | `anemia` / `hipoxemia` |
| **B3 · Shock séptico: la ScvO₂ alta que no tranquiliza** | XIX, XXIII, XIII | Varón de 58 años, neumonía, noradrenalina, sedado con propofol. Lactato 4,6, ScvO₂ 84 %. Paso 1: interpretar (Tabla 9.4). Paso 2: gap de PCO₂ 8 → hipoperfusión. Paso 3: causas de lactato con O₂ (Tabla 9.5) | `#extraccion-calc`, `#perfusion-calc`, `#lactato-calc`, `#propofol-calc` | Lleva 60 h de propofol a >5 mg/kg/h: umbral del síndrome de infusión (`#pris`) | «ScvO₂ >70 %: objetivo cumplido, perfusión correcta» | `sepsis` |
| **B4 · Sedación para una endoscopia** | XV | Mujer obesa con apnea del sueño, sedación para una endoscopia. Paso 1: PETCO₂ que sube con la SpO₂ aún en 96 %. Paso 2: se intuba y el capnograma sale plano | — | El tubo está bien, pero entra en parada: sin retorno no llega CO₂; ≤10 mmHg tras 20 min | «Ausculto y está bien: el CO₂ plano es fallo del sensor» | `capno-sedacion` → `capno-esofago` → `capno-rcp` |
| **C1 · El bolo que no hizo nada** | XXII, XXIII | Mujer de 68 años, shock séptico, día 1 con 3 L ya infundidos, PVC 14 y «la PA baja: otro bolo». Paso 1: la PVC como objetivo. Paso 2: EPP desde semiincorporada con gasto continuo: VS 50 → 53 mL (+6 %). Paso 3: ScvO₂ y gap. Día 3: balance +6 L, edemas | `#respuesta-calc`, `#perfusion-calc`, `#deficit-calc` | En la EPP aparece taquicardia: le dolió la cadera (falso positivo) | Plan: «PVC objetivo 12; si la PA cae, 500 mL más; la EPP desde supino» | `guyton` → `bolo-no-responde` |
| **C2 · El Swan-Ganz del cardiogénico** | XVI, XVII | Varón de 66 años, IAM y shock. Paso 1: las ondas del avance. Paso 2: enclavamiento con ondas v gigantes. Paso 3: 3 termodiluciones que difieren ≤10 %. Paso 4: SC (talla 175, peso 80 → 1,95 m²) e índices | `#hemo-calc` | Con PEEP: dónde y cómo medir el enclavamiento | «Dejo el globo inflado para monitorizar el enclavamiento toda la noche» | `cap-avance` → `onda-v` |
| **D1 · El lactato del Ringer** | XX | Varón de 50 años, pancreatitis, Ringer a ritmo alto por el CVC. Lactato de control 4,1 sacado por esa misma luz | — | Repetido de otra vía: normal | «El Ringer le ha subido el lactato: lo cambio por salino» | `ringer` (+ ácido-base vivo) |
| **D2 · Tres hipovolemias, tres fluidos** | XXI | Tres pacientes del mismo turno: hemorragia con riesgo vital, deshidratación por diarrea, cirrótico con albúmina baja y edemas (`#fluido-a-medida`) | — | El cirrótico recibe albúmina 25 % y no mejora el déficit total: mueve, no repone | «Albúmina 25 % para los tres» | `albumina5`, `albumina25` |
| **E1 · ¿Protección gástrica a este?** | IX | Varón de 70 años, VM >24 h sin enteral (riesgo máximo) y corticoides. Día 3: enteral completa. Día 5: ClCr 40 con famotidina | `#ulcera-calc` | Con enteral completa queda en un solo moderado: desprescribir | «Corticoides en dosis altas: IBP obligado; famotidina sin ajuste» | Mucosa viva (si se aprueba) |
| **E2 · La enoxaparina que no era** | X, XI | Mujer de UCI médica, IMC 42, ClCr 25. Paso 1: qué fármaco y dosis (ClCr y obesidad chocan). Paso 2: plaquetas que caen → sospecha de TIH | `#profilaxis-calc` | Fondaparinux con ClCr 25: la tabla y el texto discrepan (la nota se enseña, no se elige) | «Medias como único método porque sangra; HBPM + CNI porque es UCI» | Vaso que sangra (si se aprueba) |
| **E3 · Trauma con TCE** | XI | Varón de 35 años, TCE y fractura de fémur | — | TC estable 24 h → enoxaparina 30 mg/12 h; anti-Xa | «Enoxaparina desde el ingreso» | Vaso que sangra |
| **E4 · El intubado que lucha** | XII, XIII | Varón de 62 años intubado: BPS 9, RASS +2. Paso 1: analgesia primero (no diazepam). Paso 2: fentanilo o morfina con IR. Paso 3: titular a RASS −1/−2. Día 4: delirio | `#bps-calc`, `#rass-calc`, `#propofol-calc`, asistente del haloperidol | Bradicardia con dexmedetomidina → haloperidol, con QTc <500 | «La FC está normal: no le duele; diazepam para el dolor y la agitación» | Paciente en la cama (si se aprueba) |
| **E5 · ¿SDD a este?** | VIII | Ingreso previsto >72 h en una UCI sin resistencias problemáticas | — | Se aísla un BGN multirresistente en la unidad: la SDD pierde su efecto | «Clorhexidina oral al 2 % cada 6 h; probiótico a partir del día 5» | Mucosa viva |

---

## 4. Modelos para las 6 fichas sin modelo (decide el usuario; sin maqueta todavía)

Con estos tres, cada una de las 23 fichas tendría su modelo vivo en su estado. Son más pequeños que los dos de §6.

### 4.1 Mucosa viva (VIII, IX y la vía 4 del catéter; después `ma-cdifficile`, `mu-enteral-indicaciones`, `neumo-nav-prevencion`)
- **Qué se ve**: un corte de pared digestiva en grabado. Arriba, la luz con microbios y el jugo gástrico; luego la capa
  de moco con HCO₃⁻ (pH 7, `#ulcera-patogenia`); una sola capa de epitelio de 0,1 mm (`#piel-interna`); debajo, el
  capilar de la mucosa (70-90 % del riego del estómago) y el tejido linfoide (GALT).
- **Mandos**: perfusión de la mucosa (normal / shock / VM: hipoperfusión oculta); pH gástrico (sin nada / anti-H2 /
  IBP: ≥4); nutrición enteral (sí / no); antibiótico de amplio espectro (disbiosis); SOD, SDD, probiótico (día ≤2).
- **Lo que enseña**: la erosión aparece cuando cae el flujo, no cuando sube el ácido; la *Salmonella* vive con pH 4 y
  muere en 1 h con pH 2 (Fig. 4.3, `#fig-4-3`); la disbiosis abre la barrera y la translocación lleva microbios a la
  sangre (el «motor» del FMO, `#motor-fmo`), y de ahí al catéter (vía 4, opinión del autor).
- **Cifras**: solo las de la ficha; el ritmo de la erosión y la translocación, ilustrativo.

### 4.2 Vaso que sangra, adelantado (X, XI; es el modelo del bloque 2, caps. 12-13: `merino-*`)
- El mapa (§4.3 de `autonomo/ideas/marino.md`) ya lo propone para hemostasia. El bloque 2 lo necesita de todos modos.
- **Para el bloque 1 basta su primer trozo**: la cascada de la Fig. 5.2 recreada (AT, Xa, IIa, fibrina) con un chip
  por fármaco que apaga su paso; el FP4 y la IgG de la TIH; y una pierna con la CNI que se comprime de distal a
  proximal (35-40/20 mmHg, ciclo de 10 s, `#mecanica`). Debajo, la dosis de `#profilaxis-calc` (no se copia).
- **Recomendación**: hacer su maqueta al empezar el bloque 2 y enlazar entonces X y XI. Mientras, Mayéutica.

### 4.3 Paciente en la cama (XII, XIII; después `mn-delirio`, `mn-abstinencia`, `mt-opioides`, `mt-bzd-betabloq`)
- **Qué se ve**: un paciente intubado en su cama, en grabado: la cara y los brazos de la BPS, su adaptación al
  ventilador y la escalera RASS al lado (de +4 a −5, `#tabla-6-4`).
- **Mandos**: perfusiones (fentanilo, propofol, midazolam, lorazepam, dexmedetomidina), profundidad (ligera /
  profunda) y duración (24 h, 72 h, 7 días, 14 días). **Sin farmacocinética inventada**: el modelo salta entre los
  estados de las tablas (Tabla 6.6, Tabla 6.7 de los despertares, umbrales del PRIS y del propilenglicol). La
  dexmedetomidina se ve como «despierta al hablarle y vuelve a dormirse» (sedación cooperativa).
- **Alternativa barata**: solo una pieza «Despertar tras el propofol» (la Tabla 6.7 viva, dos ejes) y lo demás con las
  calculadoras que ya hay.

---

## 5. Caso transversal del bloque (opcional, al final de la ruta)

**«La semana de la Sra. R.»**: mujer de 64 años con sepsis abdominal, del día 0 al día 10. Recorre las 23 fichas con
las calculadoras de la app y abre cada modelo en su estado: CVC (sitio y paquete, IV) → Ringer y no salino (XX, río y
mar) → EPP (XXIII, circulación viva) → ScvO₂, gap y lactato (XIX, XXIII, capilar) → VM sin enteral: profilaxis gástrica
(IX) → enoxaparina con su ClCr (X) → BPS y RASS (XII, XIII) → día 4 enteral completa: desprescribir (IX) → día 9 fiebre
del CVC (VII, catéter vivo) → balance +6 L y desescalar (XXIII). Toda conducta, de las fichas; solo el paciente es
inventado. Cierra el bloque con «Lo que te llevas» de las 7 etapas.

---

## 6. Especificación de las dos maquetas nuevas

**Reglas comunes** (las de `autonomo/ideas/marino.md` §7 y lo aprendido con el río y mar):
- HTML suelto en `autonomo/maquetas/`, con los tokens de `css/variables.css` copiados en `:root` como en
  `marino-agua-v2.html` (crema y oro; sin colores nuevos). Georgia. Motion solo desde `js/vendor/motion.js`; con
  «reducir movimiento», el estado final.
- 390 px de diseño y probado a 360 px; toques de 44 px como mínimo.
- Aviso arriba: «Maqueta para elegir: no es la app». Cada cifra con su chip de origen: `ficha · #id (Fig. o Tabla)`,
  `fisiología general` o `ilustrativo` (borde discontinuo, como `.org.ilu` del río y mar).
- Interruptor **Explorar | Conceptos | Mayéutica** (decisión del usuario, 19/10/2026), con una muestra real de
  Mayéutica: una cadena de Guía socrática, dos preguntas de Examen y un caso completo hasta «Lo que te llevas».
- **Estética**: la del río y mar (crema y oro, grabado: sombreado con patrones SVG de rayado fino en oro al 25-35 %,
  líneas de tinta, lupas circulares) y, en las lecturas, la del tablero de la circulación viva (cifras grandes con su
  unidad, como un monitor). Las figuras reales del libro, al lado, como «lámina del libro» que se amplía al tocarla.
- **Formas**: las partículas salen de `js/data/formas-iones.js` (hematíes `rbc`, CO₂ `co2`, glucosa `glu`). Las que no
  existen (O₂, lactato, bacteria, burbuja de aire) se proponen en la maqueta con una leyenda y se añaden a la tabla
  única solo si el usuario las aprueba (ver decisiones). La forma dice qué es; el color no decide solo.
- Al final, la pregunta al usuario con botones: «Construir así», «Construir con cambios» y, para cada lupa opcional,
  «sí / no».

### 6.1 Capilar y oxígeno · `autonomo/maquetas/b1-capilar-oxigeno.html`

**La idea en una frase** (va arriba): «El oxígeno viaja pegado a la hemoglobina; el tejido coge lo que necesita hasta
la mitad de lo que le llega; más allá, o si la mitocondria no puede usarlo, sale lactato.»

**Qué se ve, de arriba abajo (390 × 844)**
1. Cabecera: aviso, título «Del pulmón a la mitocondria» y la **frase viva** con su origen.
2. **Lámina principal** (SVG, ~360 × 300): un circuito en U, en grabado.
   - Arriba a la izquierda, un **alvéolo** con su capilar: los hematíes entran ciruela y salen terracota. Cada hematíe
     lleva **4 perlas** (los 4 sitios del hemo) que se llenan o vacían: la saturación se ve por la forma, no solo por el
     color. Con SaO₂ 98 % casi todas llenas; con 73 %, tres de cada cuatro.
   - La **arteria**, con dos puntos de medida: el dedo (pulsioxímetro, SpO₂) y la jeringa de gasometría (SaO₂ por
     cooximetría).
   - A la derecha, el **capilar del tejido**: los hematíes desfilan a una velocidad proporcional al gasto; las perlas
     sueltan O₂ que cruza el endotelio hacia una célula con sus mitocondrias. En el plasma, unos pocos puntos de O₂
     disuelto (el 1,5 %, `#cao2-9`).
   - Abajo, la **vena**, con dos tomas: cava superior (ScvO₂) y arteria pulmonar (SvO₂). Vuelve al alvéolo.
   - En la «boca», un **capnograma** pequeño que late.
3. **Tablero** (como el de la circulación viva): SpO₂ · SaO₂ · CaO₂ · DO₂ · VO₂ · O₂ER · SvO₂ (o ScvO₂) · lactato ·
   gap de PCO₂ · PETCO₂. Cada cifra con su chip de origen. En las preguntas de «predice», la cifra sale tapada.
4. **Tres gráficas vivas** plegables, recreadas (son gráficos: CLAUDE §7.7), con la figura real al lado:
   - Fig. 9.3 (DO₂ frente a VO₂, indexados con SC 1,7 m², `#sc`): el punto del paciente se mueve por la meseta y
     cae por la rampa al pasar el 50 % de extracción. Real: `mar-fig9-3-aporte-consumo.jpg` (M p. 76).
   - Fig. 9.1 (curva de disociación) con el punto arterial y el venoso. Real: `mar-fig9-1-curva-disociacion.jpg` (M p. 69).
   - Fig. 9.2 (CaO₂ normal / hipoxemia / anemia): las barras aparecen cuando se visitan los estados. Real:
     `mar-fig9-2-anemia-hipoxemia.jpg` (M p. 71).
5. **Tres lupas** (botones circulares como las del río y mar):
   - **El dedo** (Figs. 7.1-7.4, M p. 37-40): dos diodos de 660 y 940 nm, el fotodetector y el pletismograma con A y B
     (`#pulsioximetria`). Con el dedo frío la onda se aplana y aparece «Pon el sensor en la frente» (`#oxi-frente`).
     Real al lado: `mar-fig7-1-espectro-hemoglobina.jpg` y `mar-fig7-3-pulsioximetro-dedo.jpg`.
   - **La mitocondria** (Fig. 9.5 recreada, M p. 82): glucosa → piruvato (2 ATP) → PDH con TPP → Krebs → cadena (28 ATP),
     O₂ → H₂O; y la vía LDH → lactato. Una X sobre la PDH con «sepsis» o «déficit de tiamina»; una flecha de
     catecolaminas que acelera la glucólisis. Real: `mar-fig9-5-vias-glucosa.jpg`.
   - **La boca** (Fig. 7.6, M p. 44): el capnograma grande con sus 4 fases (`#capno-f1`…`#capno-f4`). Real:
     `mar-fig7-6-capnografia.jpg` y `mar-fig7-8-etco2-gasto.jpg` (M p. 46).
6. **Dock** fijo abajo con 5 pestañas (como el río y mar):

| Pestaña | Mando | Rango y pasos | Frase viva de ejemplo (cifras de la ficha) |
|---|---|---|---|
| Sangre | Hb | 5-17 g/dL, de 0,5 en 0,5 | «Con la Hb a la mitad, el contenido cae a la mitad: de 20 a 10 mL/dL» (`#anemia-hipoxemia`) |
| Sangre | Humo (CO) / metHb | no / sí | «La SpO₂ sigue en 98 %: el pulsioxímetro no ve la COHb; la SaO₂ real ha caído» (`#cooximetria`) |
| Pulmón | PaO₂ | 40-100 mmHg | «PaO₂ 60: casi no cambia la saturación; estás en la parte plana» (`#curva-forma`) |
| Pulmón | Espacio muerto | no / EPOC / embolia | «Alvéolos sin sangre: la PETCO₂ se queda por debajo de la PaCO₂» (`#gradiente-co2`, Tabla 7.1) |
| Pulmón | Hipoventilación (sedación) | no / sí | «La PETCO₂ sube; la SpO₂ todavía no ha bajado» (`#capno-sedacion`) |
| Pulmón | Tubo | tráquea / esófago | «Sin CO₂ espirado: el tubo está en el esófago» (`#capno-intubacion`) |
| Corazón | Gasto | 1,5-8 L/min (en la app, del motor del latido) | «El aporte cayó a 490 mL/min: la extracción llega al 50 % y la SvO₂ al 49 %» (`#extraccion-curva`) |
| Corazón | Parada con RCP | no / sí | «PETCO₂ ≤10 mmHg tras 20 min: improbable recuperar el pulso» (`#capno-rcp`) |
| Tejido | Consumo | reposo / fiebre o sepsis | «Más consumo con el mismo aporte: sube la extracción» (el cuánto, ilustrativo) |
| Tejido | Utilización | normal / sepsis / déficit de tiamina | «Llega O₂ pero la PDH está bloqueada: SvO₂ >80 % y lactato alto» (Tabla 9.4, acordeón «Sepsis») |
| Tejido | Estrés (catecolaminas) | no / sí | «La glucólisis sube un 40-50 %, y con ella el lactato» (acordeón «Estrés fisiológico») |
| Mido en | Toma venosa | arteria pulmonar (SvO₂) / cava superior (ScvO₂) | «En el shock la ScvO₂ sale más alta que la SvO₂: de media un 7 %, hasta un 18 %» (`#scvo2-9`) |

**Cálculo (cada línea con su origen)**
- SaO₂ desde la PaO₂: curva de Severinghaus (`fisiología general`) **corregida para pasar exactamente** por los 4 puntos
  de la ficha: 27 → 50 % (P50, `#curva-desplazamientos`), 40 → 73 % y 90 → 98 % (Tabla 9.1), 45 → 78 %
  (`#anemia-hipoxemia`). La corrección se interpola entre esos puntos (Severinghaus sola se desvía hasta 3 puntos). Así,
  60 mmHg da ≈89 %: «poco cambio», como dice la ficha.
- CO o metHb: SpO₂ = la de la curva; SaO₂ real = curva × (1 − fracción anómala). La fracción es del caso (`ilustrativo`).
- CaO₂ = 1,34 × Hb × SaO₂ + 0,003 × PaO₂ (`#cao2-9`). DO₂ = GC × CaO₂ × 10 (`#do2`).
- Consumo pedido: 250 mL/min en reposo (`#cvo2`); con fiebre o sepsis, más (`ilustrativo`).
- O₂ER = consumo pedido / DO₂, **con techo de 0,5** (`#extraccion-curva`, Fig. 9.3). Si el techo se alcanza, VO₂ =
  0,5 × DO₂ (dependiente del aporte). Con utilización bloqueada (sepsis), techo de 0,15 (`ilustrativo`, elegido para
  caer en la columna «<20 %» de la Tabla 9.4).
- SvO₂ = SaO₂ × (1 − O₂ER) (de `#o2er`). ScvO₂ = SvO₂ en el sano (la ficha dice «algo menor», sin cifra) y SvO₂ + 7
  en el crítico (`#scvo2-9`).
- Indexado: ÷ 1,7 m² (adulto medio, `#sc`).
- Gap de PCO₂ = 20 / GC (proporcional a 1/GC por la Ec. de Fick de `#gap-co2`; la constante es `ilustrativa`, elegida
  para dar 4 mmHg con 5 L/min, dentro de 2-5).
- PETCO₂: ≈ PaCO₂ de 40 mmHg (`fisiología general`) menos el espacio muerto, y baja con el gasto (`ilustrativo`;
  correlación de la Fig. 7.8, r = 0,87). Esófago: 0. RCP: ≤10.
- Lactato: 1 mmol/L de base (`ilustrativo`); sube cuando VO₂ < consumo pedido, con la PDH bloqueada o con
  catecolaminas (`ilustrativo`). Las bandas que se rotulan sí son de la ficha: ≤2, 2,1-3,9 y ≥4 mmol/L con su
  mortalidad de la Fig. 9.4 (`#fig-9-4`).

**Estados con nombre (y lo que una prueba guiada debe comprobar, ±1 en la última cifra)**

| Estado | Mandos | Cifras que salen | Origen |
|---|---|---|---|
| `normal` | Hb 15, PaO₂ 90, GC 5, reposo | SaO₂ 98 %, CaO₂ 20 (19,7 + 0,27), DO₂ ≈985 (≈580/m²), VO₂ 250 (≈147/m²), O₂ER 0,25, SvO₂ 73 % | Tablas 9.1-9.2, `#cao2-9`, `#cvo2` |
| `anemia` | Hb 7,5 | CaO₂ 10; DO₂ ≈490; O₂ER llega a 0,5; SvO₂ ≈49 % | Fig. 9.2; Fig. 9.3 |
| `hipoxemia` | PaO₂ 45 | SaO₂ 78 %, CaO₂ 16 (−20 %); SvO₂ ≈53 % | Fig. 9.2 |
| `bajo-gasto` | GC 2,5 | DO₂ ≈490, O₂ER 0,5, SvO₂ ≈49 %, gap 8 mmHg (>6) | Fig. 9.3; Tabla 11.2 |
| `umbral` | el punto de la Fig. 9.3 | SaO₂ 98, SvO₂ 50, diferencia 50 % | Fig. 9.3 (cajas de la figura) |
| `dependiente` | GC 2 | DO₂ ≈394, VO₂ ≈197 (<250), lactato sube | Fig. 9.3 |
| `sepsis` | GC 6, utilización «sepsis» | SvO₂ ≈83 %, SaO₂ − SvO₂ ≈15 % (<20), lactato alto | Tabla 9.4, `#svo2-guia` |
| `tiamina` | utilización «tiamina» | X en la PDH y lactato alto; **la SvO₂ no se toca** (la ficha no la da para la tiamina) | acordeón «Déficit de tiamina» |
| `co` | humo sí | SpO₂ 98 %, SaO₂ baja, CaO₂ baja | `#cooximetria` |
| `dedo-frio` | GC 2,5 + vasoconstricción | pletismograma plano → frente | `#oxi-frente` |
| `dual` | SpO₂ 98, SvO₂ 48 | diferencia 50 %: «amenaza; indicador para transfundir en la anemia» | `#dual`, `#dual-tabla` |
| `capno-normal` / `-epoc` / `-sedacion` / `-esofago` / `-rcp` | los de la pestaña Pulmón y Corazón | fase II lenta; PETCO₂ que sube; 0; ≤10 | `#capno-f2`, `#capno-sedacion`, `#capno-intubacion`, `#capno-rcp` |

**Paciente posible**: en los extremos (Hb 5-17, PaO₂ 40-100, GC 1,5-8) la SvO₂ queda entre ~25 y ~85 %, el DO₂ entre
~200 y ~1.900 mL/min y el VO₂ nunca supera el consumo pedido. Nada de saturaciones del 100 % con PaO₂ 40.

**Fichas que explica**: `mar-transporte-o2`, `mar-extraccion-lactato`, `mar-oximetria`, `mar-capnografia` y parte de
`mar-respuesta-fluidos` (ScvO₂, gap) y `mar-termodilucion` (DO₂, VO₂, O₂ER). Después: `merino-anemia`,
`merino-transfusion` (bloque 2: allí se añade «Transfundir», Fig. 12.4), `mr-lactato-bicarbonato`, `mu-tiamina`,
`mt-co`, `mt-cianuro`, `mc-shock-septico`, `neumo-o2-indicaciones` (≈13 fichas).

**Casos en la maqueta**: B2 completo (es el que más enseña con el modelo: dos estados lado a lado y el giro a `sepsis`);
B1 y B3, solo su ficha de entrada para que el usuario vea que caben.

**Mayéutica de muestra**: la cadena de la XVIII (5 preguntas, 2 de «predice») y 2 de Examen: los cortes de la Tabla
9.4 con SvO₂ 85 % (trampa «buena perfusión») y la ScvO₂ en el shock (+7 / +18 %).

### 6.2 Catéter vivo · `autonomo/maquetas/b1-cateter-vivo.html`

**La idea en una frase**: «La velocidad la marca el catéter, no la vena: radio a la cuarta y longitud. Y lo que se
queda dentro se coloniza: la biopelícula no la limpia el antibiótico.»

**Qué se ve (390 × 844)**
1. Cabecera, aviso y frase viva.
2. **Lámina principal** (SVG, ~360 × 320), como una lámina antigua de anatomía en grabado:
   - un **pie de gotero** con la bolsa a una altura que se mueve, y una **regla** con dos marcas impresas: 68 cm
     (50 mmHg) y 100 cm (75 mmHg) (`#altura-bolsa`);
   - el tubo y la cámara de goteo;
   - el **catéter** en oro, dibujado con su grosor y su longitud reales a escala relativa, entrando en un **brazo en
     corte**: piel (crema), grasa (punteado), la vena (ciruela) con su luz;
   - al final, un **caudalímetro**: una probeta grabada que se llena, con la cifra en mL/min o L/h y su origen;
   - un mando «vena: pequeña / grande» que **no cambia nada** del flujo: es la lección de `#flujo-cateter`.
3. **Las figuras reales**, en una tira bajo la lámina: Fig. 1.1 (`mar-fig1-1-flujo-calibre-longitud.jpg`, A p. 4) junto
   al caudalímetro, rotulada «el libro midió esto»; Figs. 1.2-1.5 en el catálogo; Figs. 3.2-3.4 en la lupa B; Figs. 2.5,
   2.6 y 3.1 en la lupa C; Figs. 1.6-1.9, 2.2 y 2.3 en la lupa D.
4. **Lupas**:
   - **A · El flujo** (la lámina principal; fichas I, II, III, VI).
   - **B · La piel y la biopelícula** (fichas IV, VI, VII; Figs. 3.2-3.3, A p. 47-48). La Fig. 3.2 **recreada** en el
     mismo encuadre que la del libro (bolsa, conector, piel con el trayecto subcutáneo, vena) y con sus mismos números
     1-4, para que se reconozca: 1 infusión contaminada (rara), 2 conector y luz interna (quizá en los tunelizados),
     3 piel por el trayecto (la principal en los percutáneos no tunelizados), 4 sangre (`#bac-vias`). La vía 4 puede
     venir del intestino: rotulada «opinión del autor» (`#bac-intestino`). Al hacer zoom sobre la punta, los cocos
     (forma propuesta) se pegan y la biopelícula los envuelve; el último zoom funde a la **foto real** de la Fig. 3.3
     (`mar-fig3-3-biofilm.jpg`, «así es de verdad», con su barra de 1 µm).
   - **C · La punta y el aire** (ficha V, VI): un tórax esquemático con la cava superior, la aurícula y la carina; la
     Rx real de la Fig. 2.6 al lado (`mar-fig2-6-punta-carina.jpg`, A p. 36). La punta se arrastra: buena a 1-2 cm por
     encima de la AD, a la altura de la carina (`#punta-objetivo`, `#punta-rx`); un catéter izquierdo que apoya en la
     pared de la VCS (Fig. 3.1, A p. 46, `#perforacion-vcs`). El ciclo respiratorio y un «conector abierto».
   - **D · Pinchar con eco** (opcional; fichas III, IV): un esquema 2D en grabado, **no el ecógrafo** (no toca la
     «anatomía congelada»): eje corto con dos círculos, vena que se aplasta al comprimir y arteria que no (Fig. 1.7); la
     aguja como punto (eje corto) o como línea (eje largo) (Fig. 1.6); el Doppler color con un botón «girar la sonda»
     que **intercambia los colores**: el color es dirección, no tipo de vaso (Fig. 1.8, `#eco-*`). Las ecografías reales
     al lado (Figs. 1.6-1.9, A p. 14-15; 2.2, A p. 27; 2.3, A p. 30).
5. **Dock** con 4 pestañas: Catéter | Empujar | Tiempo | Problema.

| Pestaña | Mando | Opciones | Frase viva de ejemplo |
|---|---|---|---|
| Catéter | Banco | «Fig. 1.1 (mL/min)» / «Tablas 1.2-1.3 (L/h)» | «Dos experimentos distintos: no se mezclan sus cifras» |
| Catéter | Calibre (banco Fig. 1.1, longitud fija 1,2 pulgadas) | 16 / 18 / 20 G | «16 G: 220 mL/min; 20 G: 60. Casi 4 veces más con menos de 1 mm de diferencia» (`#fig-1-1-calibre`) |
| Catéter | Longitud (banco Fig. 1.1, 16 G fijo) | 2 / 6 / 12 pulgadas | «De 2 a 6 pulgadas, −40 %; de 6 a 12, otro −40 %» (`#fig-1-1-longitud`) |
| Catéter | Catálogo (banco Tablas) | periférico corto 18 G 3 cm · periférico largo 8 cm · midline 15 cm (por luz) · PICC 50 cm distal/proximal · CVC 20 cm distal/medial/proximal | «PICC: 0,26 L/h; el midline, 1,3: la longitud le cuesta el 80 %» (`#tabla-1-2`, `#tabla-1-3`) |
| Catéter | Vena | pequeña / grande | «Has cambiado la vena y el flujo no se ha movido» (`#flujo-cateter`) |
| Catéter | French ↔ gauge | chip que enseña Fr, G y mm del catéter elegido | «7 Fr = 2,31 mm por la ecuación; la tabla dice 2,4» (`#french-nota`) |
| Empujar | Altura de la bolsa (solo banco Tablas) | 0 / 68 / 100 cm (tres paradas, sin interpolar) | «A 68 cm la presión es 50 mmHg: el flujo cae a dos tercios del de la tabla» |
| Empujar | Bomba | gravedad / volumétrica / jeringa / infusor rápido | «La volumétrica no pasa de 1.000 mL/h: el periférico corto por gravedad da 6 L/h» (`#bombas`, `#tabla-1-2`) |
| Empujar | Vía intraósea | chip | «La médula da un 25 % de una periférica y empuja con 30 mmHg: presuriza» (`#io-flujo`) |
| Tiempo | Horas y días con el catéter | 0 h · 24 h · 48 h · día 7 · día 14 | «A las 24 h ya hay biopelícula al microscopio; la clínica no aparece antes de 48 h» (`#biofilm`, `#bac-clinica`) |
| Tiempo | Paquete de inserción | manos · barreras · clorhexidina (30 s, seca) · femoral sí/no | cada medida cierra una puerta de la piel (cualitativo: la Tabla 2.1 no da cifras) |
| Tiempo | Apósito | transparente / gasa / esponja de clorhexidina / «humedad debajo» | «Con sangre debajo, el oclusivo favorece la colonización: cámbialo» (`#aposito-paradoja`) |
| Problema | Antibiótico | dosis habitual | «Mata a las libres; para las de la biopelícula haría falta de 100 a 1.000 veces más» (`#biofilm`) |
| Problema | ¿Qué haces con el catéter? | dejarlo / retirar y sitio nuevo / recambio sobre guía | «Sobre guía, la biopelícula se queda: recurrencia» (`#bac-guia`) |
| Problema | Hemocultivos pareados | dos frascos (catéter y periférico) que se vuelven turbios a su hora | «El del catéter crece 2,5 h antes: el catéter es la fuente (≥2 h)» (Tabla 3.4; el resultado lo da `#hemocultivos-calc`) |
| Problema | Oclusión | trombo / precipitado alcalino / ácido / mineral / lípidos | la bomba alarma y el caudalímetro se para (`#oclusion-causas`) |
| Problema | ¿Qué instilas? | guía / alteplasa 2 mg / bicarbonato o NaOH / HCl o L-cisteína / etanol 70 % | acierto: el flujo vuelve; «guía»: aviso de embolia del trombo (`#permeabilidad`, `#alteplasa`, `#tabla-3-3`) |
| Problema | Conector abierto (lupa C) | respiración espontánea / Trendelenburg / femoral | «Con 5 mmHg, por un 14 G entran 100 mL de aire por segundo; 200-300 mL en segundos matan» (`#aire-fisio`) |

**Cálculo (cada línea con su origen)**
- Banco Fig. 1.1: las 6 cifras tal cual (220/105/60; 151/91/54 mL/min), **sin escalar**: la ficha no dice a qué altura
  se midió la figura (hueco 7).
- Banco Tablas 1.2-1.3: las cifras tal cual, medidas por gravedad desde 40 pulgadas (≈100 cm). Con la bolsa a 68 cm,
  flujo × 50/75 (proporcional a ΔP, Ec. 1.2, `#poiseuille`); a 0 cm, sin gradiente, sin flujo. Solo esas tres
  paradas: no se interpola la regla.
- IO: barra relativa al 25 % de «una vía periférica», sin L/h (la ficha no dice cuál).
- Infusor rápido: «hasta 1,5 L/min» con catéter de 7-8 Fr y 2-2,5 pulgadas; con otro catéter, aviso.
- Aire (lupa C): 100 mL/s con el conector abierto, 14 G y 5 mmHg; contador en segundos; letal a 200-300 mL o 3-5 mL/kg
  (con el peso del caso). Trendelenburg o femoral: el contador no arranca (`#aire-prevencion`).
- Biopelícula: las dos marcas de tiempo (24 h y 48 h) son de la ficha; el ritmo de crecimiento entre ellas,
  `ilustrativo`.

**Estados con nombre**: `calibre`, `longitud`, `altura`, `catalogo`, `cvc-luces`, `infusor`, `intraosea`,
`oclusion-trombo`, `oclusion-precipitado`, `colonizacion`, `biopelicula`, `aposito-humedo`, `hemocultivos`,
`recambio-guia`, `punta`, `punta-izquierda`, `aire`, `trendelenburg` y, si se aprueba la lupa D, `eco-eje-corto`,
`eco-eje-largo`, `eco-compresion`, `eco-doppler`. La prueba guiada comprueba, en cada uno, la cifra exacta de la tabla o
la figura que le toca.

**Fichas que explica**: las 7 primeras del bloque (I-VII) y la vía 4 de la VIII. Después: `mc-hemorragico-fluidos`
(infusión rápida), la calculadora de catéter del neutropénico y `comp-cateter` del trasplante (enlaces cruzados que ya
salen de la ficha VII), y `neumo-nav-prevencion` (biopelícula del tubo endotraqueal, que la ficha VII nombra).

**Casos en la maqueta**: A2 completo (fiebre el día 9: recorre B, el giro de *S. aureus* y el «recambio sobre guía»);
A1 y A3, solo su ficha de entrada.

**Mayéutica de muestra**: la cadena de la I (5 preguntas, 2 de «predice») y 2 de Examen: el Doppler color (trampa «rojo
es arteria») y el French (9 Fr: 2,97 frente a 3,2 mm).

---

## 7. Huecos (lo que la fuente no dice o el motor no hace; no se rellena, se anota)

**Circulación viva (lo que hay que construir en el motor, con sus pruebas, en `b1-modelos`)**
1. **Curva de Guyton** cruzada con la de función cardíaca: el motor ya tiene `pmls`, `pad` y `rRetorno`; falta
   dibujarla y los mandos «bolo de 500 mL» y «elevar las piernas» (300 mL), con el VS antes y después y el VTI del
   ecógrafo.
2. **Insuficiencia tricuspídea**: el motor no la tiene, así que la curva de termodilución de la IT (Fig. 8.7) no puede
   salir del motor. Se enseña con la figura real.
3. **Presión intratorácica**: sin ella no hay VVS, ni variación respiratoria del enclavamiento, ni efecto de la PEEP.
   La dará el pulmón con respirador (bloque 23-30). Hasta entonces, esas ideas solo en la Mayéutica.
4. **El catéter de AP que avanza**: hay que dibujar la onda en vivo leyendo `pad`, `pvd`, `pap` y `pai`, el globo y el
   enclavamiento. La onda v de la IM necesita `eroaMitral` en el simulador (hoy solo en el atlas).
5. **PVC normal**: la Tabla 8.1 de Marino da 0-5 mmHg y la referencia del motor (`referencias.mjs`, El Libro Azul) 0-8.
   Si el motor da 6-8, nota de fuentes al lado de la cifra. No comprobado qué PVC da hoy en `normal`.

**Capilar y oxígeno**
6. Sin cifra en la ficha (todo `ilustrativo`): cuánto sube el consumo con la fiebre o la sepsis; el lactato de base y
   lo deprisa que sube; la PaCO₂ normal (40 es `fisiología general`); cuánto baja la PETCO₂ con el gasto; la constante
   del gap; la ScvO₂ del sano («algo menor»); la SvO₂ en el déficit de tiamina (no se toca).

**Catéter vivo**
7. La Fig. 1.1 no dice la altura de la bolsa: su banco no se escala.
8. Las Tablas 1.2-1.3 se midieron «desde 40 pulgadas» (101,6 cm) y la ficha da 75 mmHg para 100 cm (39 pulgadas). Se
   toman como la misma marca, con esa nota.
9. La IO da «un 25 % de una vía periférica», sin decir cuál: barra relativa.
10. La biopelícula: solo dos tiempos (visible tras un día; sin clínica antes de 48 h). El paquete de inserción no tiene
    cifras de reducción: cualitativo.

**Fichas**
11. **Ids que faltan** para enlazar «Para profundizar» o el recorrido (hay que ponerlos en `marino-fundamentos.html`):
    `mar-materiales`, `mar-forssmann`, `mar-periferico-largo`, `mar-apositos`, `mar-cap-colocacion`, `mar-ibp-clopidogrel`,
    `mar-esc-bariatrica`, `mar-esc-neuro-cardio`, `mar-pca`, `mar-ringer-acetato`, y los acordeones de tromboflebitis y
    endocarditis de la ficha VII (`mar-tromboflebitis`, `mar-endocarditis`), de compresibilidad y Doppler de la III
    (`mar-compresibilidad`, `mar-doppler-color`) y de los cuatro opioides de la XII (`mar-morfina`, `mar-fentanilo`,
    `mar-hidromorfona`, `mar-remifentanilo`), que el Examen cita.
12. Las cifras de las Figs. 4.4, 5.1 y 6.1 son lecturas a ojo (la ficha lo dice): no se preguntan como cifra exacta.
13. «Transfundir 1 U» y la caída del Hto con salino (Figs. 12.1 y 12.4) son del bloque 2: no entran en la maqueta de b1.
14. Lo que pide REGLAS §8 y la ficha no da: no hay pauta de tiamina ni tratamiento del CO en el bloque 1 (están en
    `mu-tiamina` y `mt-co`); los casos B1 y B3 llegan a reconocer, y enlazan allí.

---

## 8. Decisiones para el usuario

1. **Las dos maquetas** (capilar y oxígeno; catéter vivo): ¿se hacen así? Dentro del catéter, ¿la lupa D «Pinchar con
   eco» (esquema 2D, no el ecógrafo)?
2. **La capnografía**: ¿en el capilar ahora (la vuelta del CO₂) o esperar al pulmón con respirador (bloque 23-30)?
   Recomiendo ahora: el pulmón la reutilizará.
3. **Las 6 fichas sin modelo** (§4): mucosa viva (VIII, IX), vaso que sangra adelantado (X, XI) y paciente en la cama
   (XII, XIII), o su versión barata (la Tabla 6.7 viva). Sin ellas, esas fichas se quedan en Mayéutica + calculadoras.
4. **Circulación viva**: ¿las ampliaciones del motor (huecos 1, 2 y 4) se construyen sin maqueta? Usan el aspecto que ya
   existe; tocan el motor (sus pruebas tardan ~3 min).
5. **Formas nuevas** para `formas-iones.js`: O₂, lactato, bacteria y burbuja de aire (se proponen en las maquetas).
6. **El caso transversal** «La semana de la Sra. R.» al final de la ruta: ¿sí o no?
