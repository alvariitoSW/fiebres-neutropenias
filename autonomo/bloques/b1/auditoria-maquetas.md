# Auditoría ciega de las maquetas del bloque 1

Fuentes cotejadas (PDF en inglés; «p.» = página del PDF, igual que en los `#page=N`):
- `docs/marino-2024-practicas-monitorizacion-caps5-9.pdf`, caps. 7 y 9 (pp. 36-48 y 67-83); cap. 6 (p. 28, propofol).
- `docs/marino-2024-fluidoterapia-caps10-11.pdf` (cap. 11, p. 29-30: ScvO₂ y gap de PCO₂).
- `docs/marino-2024-acceso-vascular-practicas-caps1-4.pdf`, caps. 1-3 (pp. 2-54).
Maquetas: `autonomo/maquetas/b1-capilar-oxigeno.html` (CAP) y `autonomo/maquetas/b1-cateter-vivo.html` (CAT).
Las figuras se abrieron una a una (jpg y página del PDF). Las cifras del modelo capilar se recalcularon con su propio código en Node.

Resumen: **graves 4 · menores 26 · huecos 12** (CAP 2/16/6; CAT 2/10/6).

---------------------------------------------------------------------------
## A. CAPILAR Y OXÍGENO

### Graves
- **CAP-G1. Fig. 9.2 viva: porcentajes que contradicen el libro.** Maqueta, l. 1282: la etiqueta se calcula como `Math.round(1 − v/19,97)` y sale «10 (−49 %)» para la anemia y «16 (−21 %)» para la hipoxemia, justo encima de la leyenda «anemia −50 % · hipoxemia −20 %» (l. 1286). Fuente p. 70 (texto) y p. 71 (Fig. 9.2): 20 → 10 (−50 %) y 20 → 16 (−20 %). Verificado: el CaO₂ del modelo es 10,12 y 15,81. Corrección: etiquetar con el CaO₂ redondeado (20 / 10 / 16) y los porcentajes de la fuente, o decir «≈».
- **CAP-G2. «ficha» en celdas cuyo valor es ilustrativo.** `CELDAS` (l. 1004-1008) deja fija la etiqueta «ficha» en VO₂, O₂ER y SvO₂. En Sepsis salen SvO₂ 83, O₂ER 0,15 y VO₂ 181. Esas cifras nacen del tope de extracción «15 %», que la propia tabla «De dónde sale cada cifra» (l. 416) declara ilustrativo; lo mismo pasa con Fiebre (300 mL/min, l. 414), Estrés y Sin tiamina. La frase de Sepsis (l. 1311) cita además «ficha · Tabla 9.4» junto a «SvO₂ 83 %». La fuente solo da «<20 %» y «>80 %» (Tabla 9.4, p. 77). REGLAS §1.2 exige que la pantalla diga «ilustrativo». Corrección: cuando `util !== 'normal'`, `consumo === 'fiebre'` o `estres`, cambiar la etiqueta de esas celdas a «ilustr.», como ya se hace con SaO₂ y el CO (l. 1036).

### Menores
- **CAP-M1. ScvO₂, la media de 7 %.** l. 1315 y concepto 5 (l. 1773) dicen «en el shock… de media un 7 %, hasta un 18 %». p. 77: la ScvO₂ supera a la SvO₂ «en una media del 7 % en el **crítico**» y hasta 18 % **en el shock**. La ficha `mar-scvo2-9` y las preguntas co-g5 y co-e2 sí lo dicen bien. El modelo suma +7 en «shock» (GC <4, sepsis, parada): ya está rotulado ilustrativo (l. 417).
- **CAP-M2. Curva en S: la ventaja de la parte empinada.** Concepto 2 (l. 1755) y explicación de co-g2 (l. 1815): «donde un poco de PO₂ suelta mucho O₂». p. 68 y la ficha `mar-curva-forma`: la ventaja de la parte empinada (PvO₂ ≈40) es que «facilita la captación de O₂ en los capilares pulmonares». El libro no lo atribuye a la liberación tisular.
- **CAP-M3. B3-1 y B2-5 aplican la «Tabla 9.4» a una ScvO₂ de 90 %.** l. 1936 («Con la Tabla 9.4 en la mano…»), l. 1915 y l. 1960. La Tabla 9.4 es de la SvO₂ mixta (p. 77). La fuente que sostiene «ScvO₂ >80 % en el shock séptico = defecto de utilización» es el cap. 11, **p. 29 del PDF de fluidoterapia** (apartado «Using the ScvO₂», punto 4). La conclusión clínica es correcta; hay que citar bien la fuente. B3-1 ya avisa de que los cortes son de la SvO₂ (l. 1941).
- **CAP-M4. Umbral con SvO₂ 48 (duda 2).** Aritméticamente coherente: 98 − 50 = 48, y cae en «≤50 %» de la Tabla 9.4. Defendible. Pero la Fig. 9.3 (p. 76) imprime «SaO₂ 98 %, SvO₂ 50 %, SaO₂−SvO₂ 50 %», y el cap. 11 (fluidoterapia p. 29) dice «el SvO₂ cae al 50 %». La nota de la maqueta (l. 434) lo justifica con «la especificación decía 50», que es un asunto interno, y no dice que el libro imprime 50. REGLAS §1.3 pide nota de fidelidad: «El libro imprime 50 % (Fig. 9.3, p. 76; cap. 11, p. 29); con SaO₂ 98 % la resta da 48».
- **CAP-M5. VO₂ 201 en «dependiente» (duda 2).** Defendible, pero la explicación está mal dada (l. 794 y l. 434). La Ec. 9.17 y la Fig. 9.3 (p. 75-76) dan VO₂ = DO₂ × (SaO₂−SvO₂) = 394 × 0,50 = **197**. La Ec. 9.12-9.13 (p. 74) da VO₂ = DO₂ × O₂ER, con O₂ER = (SaO₂−SvO₂)/SaO₂ = 0,51, es decir **201**. Las dos fórmulas son del libro. Corrección: la nota debe decir «197 con la Ec. 9.17 (SaO₂≈1) y 201 con la 9.13; se usa la exacta». El tablero muestra O₂ER 0,51 con diferencia 50 %.
- **CAP-M6. Gap 3 en B3 (duda 2).** Médicamente correcto: gap normal 2-5 en un shock séptico de gasto alto, con lactato 5, y «un gap normal no descarta oxigenación alterada» (cap. 11, p. 30). El paciente se inventa. Pero la nota que ve el usuario (l. 1950: «El caso B3 de la especificación daba 8 mmHg…») habla de un documento interno. Debe quedar solo «el gap del modelo es ilustrativo (∝ 1/GC)». La misma frase aparece en el recuadro de cambios (l. 434), que es de maqueta.
- **CAP-M7. Gap de 6 mmHg dice «normal 2-5».** l. 1038: el rótulo solo cambia a «hipoperfusión» con gap >6. La Tabla 11.2 (cap. 11, p. 29) deja 5-6 sin definir, y el estado de co-e2 (GC 3,6) da exactamente 6. Corrección: rotular 6 como «entre 5 y 6: sin cifra en la fuente» o no dar rótulo.
- **CAP-M8. Dos cortes distintos entre capítulos, sin nota.** Oximetría dual, cap. 7 (p. 43): extracción >25 %, 25-50 % y ≥50 %. Cap. 9 (p. 76-77): normal 20-30 %, >30 % y ≥50 %. Además, p. 77 punto 5 dice «80 % o más» y la Tabla 9.4 «>80 %». La maqueta usa ambos (B2-4 el del cap. 7; `tabla94`, l. 734-740, el del cap. 9) y solo anota la SvO₂ normal (l. 431). Añadir nota de fuentes.
- **CAP-M9. Tabla 9.4 sin su salvedad.** p. 76: sus cortes valen solo «si el metabolismo es normal» y con SaO₂ >90 %. `tabla94` (l. 734) pone etiqueta también en Fiebre, Estrés y Sepsis. La pregunta co-e1 sí lo dice (l. 1844). Corrección: rótulo «no válida: metabolismo alterado» en esos estados.
- **CAP-M10. Dedo frío: «onda plana», «sin onda» y SpO₂ «—».** l. 754, 1127, 1310 y concepto 7 (l. 1788), con origen «ficha · mar-oxi-frente». La ficha y la p. 39 solo dicen que la frente da SpO₂ válidas cuando el dedo falla por hipotensión o vasoconstricción. Que la señal desaparezca es ilustrativo y debe rotularse así.
- **CAP-M11. «+40-50 %» atribuido solo a las catecolaminas.** l. 1141, 1313 y 1781. p. 81: el aumento de 40-50 % de la glucólisis aerobia sale del estrés fisiológico (captación de glucosa **más** catecolaminas). La Fig. 9.5 (p. 82) dibuja las catecolaminas actuando sobre la glucólisis, sin cifra.
- **CAP-M12. Lupa mitocondria.** l. 1153: «Krebs → cadena · 28 ATP». La Fig. 9.5 (p. 82): ciclo de Krebs 2 ATP y cadena de transporte 28 ATP.
- **CAP-M13. Capnografía.** (a) l. 1306: «Pasa en 1 de cada 18 intubaciones urgentes». p. 46: la intubación esofágica **no reconocida** se da en 1 de cada 18. (b) La frase «sin CO₂ = el tubo está en el esófago» (l. 1306) olvida que sin retorno venoso también hay CO₂ negligible con el tubo bien puesto (p. 46); el concepto 8 sí lo dice. (c) l. 1173: «pulso improbable». p. 47: «es improbable la recuperación de la circulación espontánea».
- **CAP-M14. Nota DO₂/VO₂ confusa (l. 432).** Mezcla índice y absoluto. p. 73: DO₂ 900-1.100 (500-600/m²) y VO₂ 200-300 (110-160/m²). Tabla 9.2 (p. 72): DO₂ 520-600/m² y VO₂ 200-270 (110-160/m²). Tabla 8.1 (p. 61): DO₂ 520-570/m². Reescribir con las columnas absoluta e indexada.
- **CAP-M15. Caso B2 «el giro».** La ficha del paciente (l. 1909) dice «fiebre», pero `B2_GIRO` (l. 1868) no activa `consumo:'fiebre'`. No cambia ninguna cifra (el tope de la sepsis manda), pero ficha y modelo no coinciden.
- **CAP-M16. Pies y enlaces.** Los pies de figura usan «M p. N» (l. 382, 388, 394, 1068-1072): se entiende «PDF p.». «Para profundizar» enlaza p. 83 para «oximetría de los años cuarenta» (l. 488), pero esa historia está en p. 37. «Calorimetría» está en pp. 73-74 (enlace p. 73) y «lactato combustible» en pp. 82-83 (enlace p. 82).

### Huecos (en la fuente, no en la maqueta)
- Piel oscura: la SpO₂ sobrestima 1-3 % más y la hipoxemia oculta (SaO₂ <88 % con SpO₂ ≥92 %) es 6,9 % / 6,0 % / 4,9 % (p. 41).
- Objetivo de SpO₂ 90-94 % (88-92 % en hipercapnia) y cambio significativo 3-4 % (p. 41).
- Metahemoglobina (p. 40): solo se modela el CO.
- Lactato >2 mmol/L como marcador y requisito del diagnóstico de shock (p. 78). Evidencia contraria: sin hipoxia celular en el shock séptico animal y PO₂ muscular aumentada en humanos (p. 79).
- Tabla 9.3 con los componentes de la variabilidad (p. 74): se da solo ±18 % y ±5 %.
- Tabla 7.1, columna derecha (PETCO₂ > PaCO₂: hipermetabolismo, acidosis metabólica, hiperoxia); la PETCO₂ predice respuesta a volumen en ventilados; la diferencia PaCO₂−PETCO₂ sirve para elegir el volumen corriente; el broncoespasmo grave como causa de CO₂ nulo, sin verificar (pp. 46-47).

### Comprobado y correcto (CAP)
Tabla 9.1, 9.2 y 9.3; las ecuaciones 9.1-9.17; DO₂ 985 y 492; CaO₂ 20 / 10 / 16; SvO₂ 73; Fig. 9.4 (15/25/38 % y 4/13/43 %); Tabla 9.5 (propofol y catecolaminas incluidos); lactato aerobio (20 mmol/kg/día); cita «hypoxia-driven lactate accumulation…»; SpO₂ ±3-4 % y ±2-3 %; 660/940 nm; 1,5 %; 70 % venoso (555/805); P50 27; 1 de 18; ≤10 mmHg a 20 min; síndrome de infusión de propofol (>80 µg/kg/min o >5 mg/kg/h, >48 h, 36 µg/kg/min, 3 %, 30-35 %; cap. 6, p. 28); cuatro tests de la Guía y tres del Examen sin otra opción también correcta; «encuentra el error» con 2 errores. El errata de la Ec. 7.1 está bien anotado. `mar-*` citados: todos existen. Las diez figuras reales (7.1, 7.3, 7.4, 7.6, 7.8, 9.1-9.5) tienen su pie correcto y su página.

---------------------------------------------------------------------------
## B. CATÉTER VIVO

### Duda 1: recambio sobre guía y recurrencia
La maqueta sigue el PDF. p. 52: «los catéteres no deben recambiarse sobre guía, sino retirarse y reinsertarse en un sitio nuevo; sobre guía solo si hay muy poco acceso venoso; incluso los recambios sobre guía tienen complicaciones. Cuando el catéter se **deja**, los antibióticos sistémicos apenas lo descontaminan (biopelícula) y se esperan infecciones recurrentes». l. 1486-1488, a2-1 (l. 2313) y a2-4 (l. 2338) lo reflejan bien, y la frase de «guía» dice «el libro no da el porqué». La recurrencia pertenece a «dejarlo». La cobertura (§6.2) debe corregirse. Queda un fallo en el tablero (CAT-G1).

### Graves
- **CAT-G1. Tablero: «Biopelícula: visible» en el recambio sobre guía.** l. 1379 (`e.manejo === 'retirar' ? 'se fue' : b.visible ? 'visible' : 'aún no'`). Con `manejo:'guia'` y tiempo ≥24 h (el estado `recambio-guia`, l. 1707, a 168 h) la lectura dice «visible», mientras la lámina dibuja el catéter nuevo sin biopelícula (l. 1055 y 1073, `niv = 0`). Se contradicen, y la lectura reintroduce el error de la cobertura: el PDF no dice que la biopelícula persista tras el recambio sobre guía (p. 52). Corrección: para `guia` mostrar «catéter nuevo: no la da el libro» (o «—»), igual que la frase.
- **CAT-G2. Trendelenburg: «el contador no arranca» / «no entra aire».** l. 750, 1508, 2155-2156 y concepto 12 (l. 2153). p. 26, 29 y 33: la posición de Trendelenburg «aumenta la presión venosa para **reducir el riesgo** de embolia aérea»; el libro no dice que anule la entrada con el conector abierto y respiración espontánea. Para el catéter femoral sí es literal: «no entra en el tórax y no está expuesto a presiones negativas» (p. 33). Corrección: en Trendelenburg bajar el ritmo de entrada o mostrar «menos riesgo» sin cifra, y rotularlo como ilustrativo. Es el único punto donde un usuario podría concluir que con Trendelenburg se puede dejar el conector abierto.

### Menores
- **CAT-M1. Intraósea «siempre presurizada».** l. 2123 y 2277. p. 20: se presurizan «rutinariamente»; y el límite de 24 h es «recomendado, sin pruebas firmes» (el concepto de l. 2123 lo omite; a1-6 sí lo dice).
- **CAT-M2. «Nunca una guía» (l. 2147, 1444).** p. 42: «no se aconseja», porque puede soltar la masa y embolizar.
- **CAT-M3. Flujos a 68 cm rotulados «ficha».** Los 4,0 / 2,67 L/h… (l. 668, 1458, 2108, 2196) no están en las tablas: son 6,0 × 50/75, calculados con Poiseuille y tomando 40 pulgadas ≡ 100 cm ≡ 75 mmHg. La nota (l. 354) lo avisa, pero la lectura dice «ficha»; debe decir «calculado (Q ∝ ΔP)». La nota de cv-g4 (l. 2203) habla de «la maqueta»: en la app debe ser «la app».
- **CAT-M4. «Evitar la femoral» como puerta de la piel (l. 692, 1046).** El modelo resta cocos de la vía 3 por cada puerta cerrada, incluida la femoral. p. 25 y 32-33 (y la Tabla 2.2): el riesgo de bacteriemia no depende del sitio; el motivo que queda es la trombosis (la propia frase de l. 1475 lo dice). La Tabla 2.1 sí incluye evitar la femoral en el paquete. Sacar la femoral del recuento de puertas de la piel o dejarla como «trombosis».
- **CAT-M5. «El libro midió esto» (Fig. 1.1, l. 1631).** La Fig. 1.1 (p. 5) dice «Data from References 4 and 5» (dos fuentes distintas, una por panel).
- **CAT-M6. Aguja IO de 15 G dibujada a 1,8 mm (l. 645).** La fuente solo da 1,8 mm de diámetro interno para el 14 G (p. 33). Rotular ilustrativo.
- **CAT-M7. Enlaces de «Para profundizar» (l. 2375-2376).** La tromboflebitis supurada y la endocarditis están en p. 53 (no 52). La «visión novedosa» es p. 53-54 y el microbioma del cap. 4 empieza en p. 58; p. 56 es la lista de referencias.
- **CAT-M8. «CVC, de último recurso» (l. 2367).** p. 11: «final (go-to) catheters», preferidos en la inestabilidad hemodinámica grave. «Último recurso» cambia el matiz.
- **CAT-M9. Caso A1.** El paciente lleva desde el inicio un CVC triple luz de 20 cm (l. 2242), pero a los 25 min «no hay venas» y se pasa a IO, y luego la pregunta a1-6 vuelve a la luz del CVC. Aclarar que el CVC se ha arrancado en el traslado.
- **CAT-M10. Barreras (l. 1475).** «Gorro, mascarilla, guantes, bata y paño estériles»: la Tabla 2.1 (p. 24) pide gorro, mascarilla, guantes estériles, bata estéril y paño estéril de cuerpo entero.

### Huecos
- Embolia aérea: clínica y manejo (aspirar por el catéter, O₂ al 100 %, decúbito lateral izquierdo, soporte extracorpóreo; p. 33-34). El modelo enseña cómo entra el aire pero no qué hacer.
- Punción carotídea: 9,2 % por referencias y 1,8 % con eco; compresión ≥5 min; si se canula la carótida, no retirar el catéter (p. 28).
- Subclavia: complicaciones (arteria 1-6 %, neumotórax 1-4 %, plexo 0-3 %, frénico 0-2 %, malposición 8-9 %) y estenosis 15-50 % (pp. 30-31). Tabla 2.2 con sus cifras (p. 28).
- Caso A2: falta el antibiótico empírico «iniciado inmediatamente tras los cultivos» (p. 51); solo aparece como puntero en «Para profundizar».
- Higiene de la clorhexidina (30 s de fregado, secado 30 s-2 min; p. 25) y complicaciones de la guía (Seldinger; p. 11) sin modelo.
- Alteplasa: 11 casos de angioedema, sin sangrados (p. 42).

### Comprobado y correcto (CAT)
Fig. 1.1: 220/105/60 y 151/91/54, con −40 % y otro −40 %. Tabla 1.1 (French/gauge) y errata de la ecuación (7 Fr 2,31 vs 2,4; 9 Fr 2,97 vs 3,2). Tabla 1.2 y 1.3 (6,0 / 3,7 / 1,3; 2,28 / 0,91 / 0,99; 0,26 / 0,27), con el 20 % del midline y del PICC. 68 cm = 50 mmHg y 100 cm = 75 mmHg. Bombas (1.000 mL/h, 100 mL/h, 1,5 L/min, 7-8 Fr y 2-2,5″). IO: 25 %, ~30 mmHg, 3 cm + 2 cm, lidocaína 40 mg + 20 mg, 24 h, errata «fémur» bien anotada (pie de la Fig. 1.10 y «A Final Word» p. 21). Aire (14 G, 5 mmHg, 100 mL/s, 200-300 mL, 3-5 mL/kg). Biopelícula (1 día, 48 h, ×100-1.000). Hemocultivos (≥2 h, 91 %; ≥3 veces, 94 %; 38 % si una luz). 1.527/169 (11 %). Criterios de retirada, 14 días, ETE, tromboflebitis y endocarditis. Tabla 3.2 y 3.3 (alteplasa 30 y 120 min; NaHCO₃, NaOH, HCl, cisteína, etanol; la errata del NaOH está anotada). Punta (1-2 cm, carina, 2.348 pacientes, 15-18 %). Tres «encuentra el error» (cv-e3 con 1 error; a1-6 y a2-6 con 2), dentro del máximo de 2. Ningún test tiene otra opción también correcta. Las 18 figuras reales de `FIGS` tienen página PDF correcta; abrí 15 de las imágenes (no abrí las Figs. 1.2, 1.3 y 1.5) y todas coinciden con su pie.

---------------------------------------------------------------------------
## C. Respuestas a lo pedido
- **¿«Ilustrativo» lo es de verdad?** Sí en todo lo declarado (gap, PETCO₂, lactato, COHb 25 %, fiebre 300, tope 15 % de la sepsis, ScvO₂ +7, ritmo de la biopelícula, puertas, peso de 70 kg). El fallo es la inversa: lo ilustrativo aparece como «ficha» en el tablero (CAP-G2) y los flujos × 50/75 (CAT-M3).
- **¿«Ficha» está en la ficha?** Salvo CAP-G2, CAT-M3 y los puntos indicados, sí. Todos los ids `mar-*` citados existen en `marino-fundamentos.html`.
- **Duda 2:** SvO₂ 48 y VO₂ 201 son defendibles y vienen de ecuaciones del libro; falta la nota de fidelidad correcta (CAP-M4, M5). El gap 3 de B3 es válido; limpiar la nota (CAP-M6).
