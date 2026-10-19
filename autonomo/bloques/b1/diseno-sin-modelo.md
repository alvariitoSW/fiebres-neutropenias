# Bloque 1 · Diseño de los modelos para las 6 fichas sin modelo y decisión sobre el motor del corazón

Profesor, modo diseñar, 19/10/2026 (noche). Responde a `encargo.md` §8, puntos 4 y 5. **No se construye nada aún.** Este
documento es la especificación de las maquetas para elegir. Sustituye a `cobertura.md` §4.

**Fuentes.** Las fichas de `js/modules/libros/marino-fundamentos.html`, citadas por su id.
- **A** es `docs/marino-2024-acceso-vascular-practicas-caps1-4.pdf`.
- **M** es `docs/marino-2024-practicas-monitorizacion-caps5-9.pdf`.
- Las páginas son las del PDF (`#page=N`). Las busqué con `pdftotext`: son la página donde la cifra o la figura
  aparece por primera vez, y el auditor las coteja.

**Regla de oro.** El paciente se inventa; la medicina, no.
- Toda cifra que se ve lleva su chip: `ficha · #id` (con su página), `fisiología general` o `ilustrativo`.
- Las velocidades de las animaciones son siempre `ilustrativo`.
- Lo que la ficha no da no se dibuja como dato: va a §5, «Huecos».

---

## 0. La idea en una pantalla

Las 6 fichas son los capítulos 4, 5 y 6 de Marino. Son las prácticas de **cada mañana en cada cama**: proteger el
estómago y el intestino, prevenir el trombo y quitar el dolor y la angustia.

Propongo **un solo modelo grande con tres escenas**: **«La cama 7»**.
- **La entrada**: un paciente intubado en su cama, en grabado, con tres ventanas encendidas sobre su cuerpo:
  - el vientre lleva a **La muralla de papel**;
  - la pierna lleva a **El telar de la trombina**;
  - la cabeza lleva a **La inmersión**.
- **La hoja de órdenes**: abajo, como dock, la hoja que el residente rellena cada mañana (ventilación, enteral,
  antibiótico, aclaramiento, IMC, fármacos y día). Cada orden que escribes cambia lo que ves dentro del cuerpo.
- **Fichas**: las 6 de este bloque (IX-XIII y la VIII entera) y la vía 4 del catéter. Después, unas 14 más (§4).

**Por qué un modelo y no tres**: REGLAS §7.8 («un modelo grande, muchas fichas»). Además, los casos de estas fichas son
el mismo paciente: el ventilado sin enteral que tiene a la vez riesgo de úlcera, de trombo y de sedación profunda.

**Cómo se construye**: tres maquetas en paralelo, una por escena, con la misma cabecera (la cama) y la misma hoja de
órdenes. Cada escena funciona sola y se puede aprobar o rechazar por separado.

| Escena | Metáfora | Fichas de este bloque | Fichas después |
|---|---|---|---|
| **A · La muralla de papel** | Una muralla de papel de 0,1 mm frente a un ejército de 100-400 billones de microbios. La imagen es del propio Marino (`#mar-piel-interna`) | VIII `mar-microbioma`, IX `mar-ulcera-estres` y la vía 4 del catéter | `ma-cdifficile`, `mu-enteral-indicaciones`, `neumo-nav-prevencion`, `ma-pancreatitis` (translocación, si su ficha la cita) |
| **B · El telar de la trombina** | En el bolsillo de una válvula de la vena femoral, la trombina teje la red de fibrina. Cada anticoagulante corta un hilo distinto, y la heparina es una cadena: su largo decide qué puede atar | X `mar-tromboprofilaxis-farmacos`, XI `mar-tromboprofilaxis-escenarios` | Bloque 2: `merino-trombocitopenia` (TIH), `merino-microangiopatias`, `merino-plaquetas-plasma`. Después: `neumo-ep-manejo`, `mn-ictus-complicaciones` (reversión) |
| **C · La inmersión** | La sedación es bajar bajo el agua: la RASS es el profundímetro. El dolor es la tormenta de la superficie. Cuanto más hondo y más tiempo, más tarda en subir (Tabla 6.7) | XII `mar-analgesia`, XIII `mar-sedacion` | `mn-delirio`, `mn-abstinencia`, `mt-opioides`, `mt-bzd-betabloq`, `neumo-sbt` (despertar para el destete) |

**Estética común**, la del río y mar y el ácido-base:
- Crema y oro, Georgia, grabado con rayado fino al 25-35 %, líneas de tinta y lupas circulares.
- Las lecturas, como el tablero de la circulación viva: cifra grande con su unidad.
- La lámina real del libro, al lado, «lámina del libro», que se amplía al tocarla.
- Solo tokens de `css/variables.css`.
- Motion desde `js/vendor/motion.js`; con «reducir movimiento», el estado final.

**Formas**: reutilizar las de la tabla única (`js/data/formas-iones.js`) siempre que se pueda. Así el residente
reconoce el mismo ion en todos los modelos:
- **H⁺** (cruz) es el ácido gástrico;
- **HCO₃⁻** (triángulo) es el moco que protege, igual que en el ácido-base vivo;
- las **citoquinas** (trébol) son la inflamación;
- el **hematíe** (`rbc`) es la sangre.

Las formas que faltan van en §6 como propuesta, con borde discontinuo.

**El aviso de §6.1 del juicio, ya aplicado en el diseño**: la frase viva va **justo encima del dock** y el dock no pasa
de 150 px. Con una lupa abierta, sus mandos suben al dock.

**Datos una sola vez**: las dosis y los umbrales no se copian. Las escenas **leen** las calculadoras que ya existen:
- `#ulcera-calc` (la regla de la Tabla 4.2);
- `#profilaxis-calc` (Tablas 5.2 y 5.3);
- `#bps-calc`, `#rass-calc`, `#analgesico-calc`, `#propofol-calc` y `#mar-halo-wizard`.

Si una escena y una calculadora comparten datos, esos datos se mueven a `js/data/` (CLAUDE §5, vista Visual).

---

## 1. Escena A · La muralla de papel (intestino, estómago y boca)

### 1.1 Qué se ve (lámina de unos 360 × 340, a 390 px)

- **A la izquierda, una tira estrecha: el tubo desenrollado** de la boca al colon, como el agujero de un dónut: «la luz
  está fuera del cuerpo» (`#mar-piel-interna`, A p. 58). Dentro de la tira, una **multitud** de microbios cuya densidad
  sigue la Fig. 4.1 en escala logarítmica: boca 10⁶, estómago <10³, intestino 10⁹ y colon 10¹² UFC/mL
  (`#mar-microbioma-cifras`, A p. 58). En el estómago la tira queda casi vacía: se ve sin leer.
- **La tira es el selector**: tocar Boca, Estómago o Colon cambia la lámina grande. Un anillo de oro marca la estación.
- **A la derecha, la lámina grande: la muralla en corte.**
  - Arriba, la luz con su «ejército».
  - En medio, **una sola fila de células** cilíndricas, deliberadamente fina, con el rótulo «0,1 mm» como regla de
    grabado.
  - Debajo, el interior: un capilar (hematíes `rbc` que fluyen) y un **ganglio del GALT** con dos «guardias»
    (linfocitos, forma propuesta) que atrapan a los que cruzan.
  - Más abajo, «la sangre», con una flecha que sale de la lámina hacia dos destinos rotulados: «→ el pulmón» y
    «→ la punta del catéter (vía 4, opinión del autor)», con enlace al catéter vivo.
- **La rueda del motor del FMO** (`#mar-motor-fmo`, A p. 60): en la esquina inferior, un anillo de 4 flechas
  (barrera rota → microbios y mediadores a la sangre → inflamación → simpático que cierra los vasos esplácnicos →
  barrera rota). Está quieto en el sano y gira cada vez más deprisa cuando se alimenta. Es la imagen que más tiene
  que sorprender: un círculo vicioso que se ve acelerar.

**Cada estación cambia la muralla:**

| Estación | La muralla | Lo que pasa |
|---|---|---|
| **Boca** (`#mar-saliva`, `#mar-colonizacion-orofaringe`, A p. 62-63) | Epitelio plano con **cerraduras** (las proteínas de adhesión). La saliva cae en gotas | En el sano, las cerraduras no encajan con los bacilos gramnegativos. En el crítico **cambian de forma** y los bacilos se enganchan: «lo que decide la colonización no es que el germen esté, sino que pueda pegarse». Una gota (el 0,13 % de 750 mL al día, con un millón de microbios por mL) baja por la tráquea: un millón de microbios en la vía aérea |
| **Estómago** (`#mar-ulcera-patogenia`, `#mar-acido-antiseptico`, A p. 61 y 67) | Una fosita gástrica. Sobre el epitelio, una **capa de moco con triángulos de HCO₃⁻** (pH 7). En la luz, **cruces H⁺** (pH 1-2) y bacilos de *Salmonella*. Debajo, el **capilar de la mucosa**, grueso: lleva el 70-90 % del riego del estómago | El ácido mata a la *Salmonella*: a pH 2 desaparece en 1 hora. Si cae el riego, el moco adelgaza, se abre una **erosión** y, más honda, hasta la submucosa, una **úlcera** que sangra |
| **Colon** (`#mar-microbioma-proteccion`, `#mar-disbiosis`, A p. 59-60) | Una vellosidad recreada en el mismo encuadre que la Fig. 4.2, con su plexo vascular y su conducto linfático | La flora residente **ocupa todos los huecos** de la superficie y suelta pequeñas cadenas (ácidos grasos de cadena corta) que alimentan a las células. Con la disbiosis aparecen los **tres números de la Fig. 4.2**: 1 sobrecrecimiento, 2 rotura de la mucosa, 3 aclaramiento linfático alterado |

### 1.2 Mandos (hoja de órdenes) y frases vivas

| Pestaña | Mando | Opciones | Frase viva (cifras de la ficha) |
|---|---|---|---|
| Paciente | ¿Quién es? | sano · planta · UCI | «En la UCI, el 70 % lleva gramnegativos en la boca; en el sano, el 2 %» (Fig. 4.4, lectura aproximada, `#mar-fig-4-4`, A p. 63) |
| Paciente | Ventilación mecánica | no · >24 h | Con la nutrición enteral decide el escalón de la Tabla 4.2 (lo pinta `#ulcera-calc`) |
| Paciente | Riego de la mucosa | normal · shock · «PA normal con VM» | «Sin hipotensión también puede faltar riego: la hipoperfusión gástrica oculta, sobre todo con VM» (`#mar-ulcera-patogenia`, A p. 67) |
| Estómago | Nutrición enteral | no · completa | «Trófica y sube el pH: con enteral completa, los supresores dejan de reducir el sangrado» (`#mar-enteral-protege`, A p. 71-72) |
| Estómago | Protección | nada · famotidina · pantoprazol · sucralfato | Ver §1.3: cada uno se ve distinto |
| Estómago | Riesgos añadidos | coagulopatía · cirrosis · corticoides · anticoagulación | Los corticoides y la anticoagulación **no mueven nada**: «el mito de los corticoides» (`#mar-mito-corticoides`, A p. 67) |
| Intestino | Antibiótico de amplio espectro | no · sí | Disbiosis: los tres números de la Fig. 4.2 se encienden y la rueda del FMO arranca |
| Intestino | Probiótico | no · día 1-2 del antibiótico · día ≥3 | «Solo si se empieza en los 2 primeros días de antibiótico» (`#mar-probioticos`, A p. 66) |
| Boca | Descontaminación | nada · clorhexidina 0,12 % · SOD | La clorhexidina mata sobre todo a los **cocos**; los bacilos siguen pegados (`#mar-tabla-4-1`, A p. 63) |
| Intestino | SDD | no · sí (con el «día» de la hoja: 0 · 2 · 4 · 7) | «Descontaminar el intestino tarda 5-7 días; la cefuroxima cubre los 4 primeros» (`#mar-sdd`, A p. 64-65) |
| Unidad | Gramnegativos multirresistentes | no · sí | «Con multirresistentes, la SDD pierde su efecto» (`#mar-sdd`) |

### 1.3 Lo que tiene que verse (el centro de la lección)

1. **La úlcera viene del flujo, no del ácido.**
   - Con el riego normal, ni subiendo el ácido aparece erosión.
   - Con el riego en «shock», aparece aunque haya pantoprazol: más pequeña, pero aparece.
   - La frase: «Para el autor, la causa es la hipoperfusión de la mucosa, no el ácido» (`#mar-acidofobia`, A p. 72).
   - Al lado, un chip plegable con la tabla de pH (zumo de limón 2,0, Coca-Cola 2,24…), sin animar.
2. **Quitar el ácido abre la puerta al ejército.** Con pantoprazol, el pH de la luz sube (cruces H⁺ que desaparecen)
   y la *Salmonella* deja de morir. Al lado de la muralla, un pequeño indicador vertical recrea la Fig. 4.3
   (`#mar-fig-4-3`, A p. 61):
   - pH 4: crece;
   - pH 3: cae de forma progresiva;
   - pH 2: erradicada en 1 h.

   Debajo, dos chips de consecuencia: «*C. difficile* ×3 con IBP» (A p. 70) y «más neumonía: colonización del jugo
   gástrico y aspiración» (acordeón «Riesgos de suprimir el ácido»). Con esa opción, una flecha sube del estómago a la
   boca.
3. **La balanza de la Fig. 4.6** (`#mar-img-4-6`, A p. 69).
   - Al elegir pantoprazol aparece una balanza grabada. En un platillo, el sangrado: 4,2 % → 2,5 % (solo un 1,7 % de
     efecto). En el otro, la suma de sangrado + neumonía + *C. difficile* + isquemia: 21,9 % frente a 22,6 %.
   - La balanza **no se inclina**: «Sin beneficio neto».
   - La lámina real, al lado.
4. **El sucralfato** se ve como una capa que tapa la erosión, con la acidez intacta.
   - Si la enteral está en «completa», el botón se bloquea: «Necesita el estómago vacío; con la nutrición, bezoares»
     (acordeón «Sucralfato»).
   - Su aluminio, en una nota plegable con la lista de fármacos que fija.
5. **La enteral engrosa la muralla** (trófica) y sube el pH. Cambia el escalón de la Tabla 4.2:
   - VM >24 h sin enteral = riesgo máximo, 8-10 %;
   - VM >24 h con enteral = riesgo moderado, 2-4 %, sin profilaxis.

   El escalón y el «¿profilaxis?» los escribe `#ulcera-calc`, no la escena (`#mar-tabla-4-2`, A p. 67).
6. **La SDD vacía la tira del tubo** día a día. Al lado, las barras de la Fig. 4.5 (`#mar-fig-4-5`, A p. 64), una por
   estrategia (control, SOD, SDD), con las bacteriemias por gramnegativos por 1.000 días: 4,5 → 3 → 1,4 (−33 % y −67 %).

### 1.4 Estados con nombre (`data-cama-viva="muralla/<estado>"`)

| Estado | Mandos | Se ve | Cifras y origen |
|---|---|---|---|
| `sano` | sano, colon | Flora en todos los huecos, rueda quieta | Fig. 4.1, `#mar-microbioma-proteccion` |
| `disbiosis` | UCI, antibiótico | Los 3 números de la Fig. 4.2, translocación al capilar, rueda girando | `#mar-disbiosis`, `#mar-motor-fmo` (A p. 60) |
| `motor-fmo` | disbiosis + riego «shock» | La rueda a toda velocidad; vasos esplácnicos cerrados | `#mar-motor-fmo` |
| `boca-uci` | UCI, boca | Cerraduras cambiadas, bacilos pegados, la gota que baja | Fig. 4.4, `#mar-saliva` |
| `clorhexidina` | boca-uci + clorhexidina | Mueren los cocos; los bacilos quedan | acordeón «Clorhexidina oral» (A p. 63) |
| `sod` | boca-uci + SOD | Mueren los bacilos, los estafilococos y *Candida*; quedan los anaerobios | acordeón «SOD» |
| `estomago-sano` | estómago, riego normal | Moco con HCO₃⁻, H⁺ en la luz, *Salmonella* que muere | `#mar-ulcera-patogenia`, `#mar-fig-4-3` |
| `isquemia` | VM >24 h sin enteral, riego «PA normal con VM» | Moco fino, erosión que rezuma | `#mar-ulcera-patogenia`, `#mar-ulcera-frecuencia` (erosiones en el 75-100 % en 24 h) |
| `ulcera` | isquemia + riego «shock» | Úlcera hasta la submucosa que sangra | idem; la lista de `#mar-sangrado-significativo` aparece como «qué haría falta para llamarlo significativo» |
| `ibp` | isquemia + pantoprazol | pH ≥4, *Salmonella* que crece, balanza de la Fig. 4.6, flechas a *C. difficile* y al pulmón | `#mar-profilaxis-uso`, Fig. 4.6 |
| `enteral` | VM >24 h con enteral | Muralla gruesa, pH más alto, escalón «moderado» | `#mar-enteral-protege`, Tabla 4.2 |
| `sucralfato` | isquemia + sucralfato (sin enteral) | Capa sobre la erosión, la acidez sigue | acordeón «Sucralfato» |
| `sdd` | UCI, SDD, día 7 | La tira se vacía; barras de la Fig. 4.5 | `#mar-sdd`, Fig. 4.5 |
| `multirresistentes` | sdd + multirresistentes | Bacilos con halo que no caen | `#mar-sdd` |

### 1.5 Casos (REGLAS §8: de 5 a 8 pasos, la ficha del paciente que se rellena, un giro y «Lo que te llevas»)

- **E1 · ¿Protección gástrica a este?** (IX). Varón de 70 años, neumonía, intubado. Calculadora: `#ulcera-calc`.
  1. Día 1: VM >24 h prevista, sin enteral, y metilprednisolona. ¿Profilaxis? Sí, por la VM sin enteral, no por los
     corticoides (Tabla 4.2, `#mar-mito-corticoides`). Muralla en `isquemia`.
  2. ¿Cuál? «Piensa y destapa»: IBP > anti-H2 > sucralfato, ninguno mejora la supervivencia
     (`#mar-profilaxis-uso`).
  3. Día 3: enteral completa. **Giro**: queda en un solo moderado → desprescribir (`#mar-desprescribir`, seis
     ensayos). Muralla en `enteral`.
  4. Día 5: ClCr 40 con famotidina: −50 % (Tabla 4.3, A p. 68).
  5. **Encuentra el error**, plan del R1, con 2 errores (REGLAS §8 permite como mucho 2): «Corticoides en dosis
     altas: IBP obligado» y «famotidina sin ajuste con ClCr 40». Las demás frases del plan son verdaderas y salen de la
     ficha (por ejemplo, «con enteral completa se puede retirar el pantoprazol»).
  6. **Lo que te llevas**: el flujo y no el ácido; la enteral es la mejor protección; desprescribir.
- **E5 · ¿SDD a este?** (VIII). Ingreso previsto de más de 72 h.
  1. ¿A quién? A todo el que vaya a estar en la UCI más de 72 h (`#mar-sdd`).
  2. Las tres partes de la pauta (boca, tubo, cefuroxima 4 días), en «piensa y destapa».
  3. Fig. 4.5: calcular la caída relativa (4,5 → 1,4).
  4. **Giro**: se aísla un gramnegativo multirresistente en la unidad → la SDD pierde el efecto. Escena en
     `multirresistentes`.
  5. **Encuentra el error**: «clorhexidina al 2 % cada 6 h; probiótico desde el día 5».
- **E6 · La neumonía del que tomaba IBP** (VIII y IX, caso nuevo). Ventilado del día 6 con pantoprazol sin indicación
  (enteral completa desde el día 2).
  1. ¿Qué riesgo añade el IBP? Neumonía y *C. difficile* ×3.
  2. Mirar la balanza de la Fig. 4.6.
  3. La escena en `ibp` → `boca-uci`: la flecha estómago → boca → tráquea (0,13 % de la saliva, un millón de
     microbios).
  4. **Giro**: no hacía falta (el 70 % de los que reciben profilaxis no la necesitan, `#mar-profilaxis-uso`).
  5. La conducta: retirar. **Lo que te llevas** enlaza con `neumo-nav-prevencion`.
  - **Hueco**: el tratamiento de la neumonía no está en estas fichas. No se pregunta; se enlaza.

### 1.6 Láminas reales al lado

Figs. 4.1 a 4.6 (`mar-fig4-1` … `mar-fig4-6`). La Fig. 4.2 se recrea en el mismo encuadre, para reconocerla. Las Figs.
4.3, 4.5 y 4.6 se recrean vivas: son gráficos (CLAUDE §7.7).

### 1.7 Fuera del modelo (van a «Para profundizar»)

- Lister y el fenol (`#mar-acido-antiseptico`);
- la tabla de pH de las bebidas, como chip;
- el clopidogrel (`mar-ibp-clopidogrel`);
- la lista de fármacos que fija el aluminio del sucralfato.

---

## 2. Escena B · El telar de la trombina (vena de la pierna)

### 2.1 Qué se ve

- **Arriba, la pierna en grabado**, de lado, con la **vena femoral e ilíaca** transparentes: ahí se forman los trombos,
  «silentes hasta que embolizan» (`#mar-tev-intro`, M p. 1).
  - Los hematíes fluyen hacia arriba, a una velocidad proporcional al gasto, el mismo que lee el motor del latido
    (`ilustrativo`).
  - Sobre la pantorrilla y el muslo, las **mangas de compresión** (medias o CNI), dibujadas como bandas que se inflan.
- **La lupa principal: el bolsillo de una válvula venosa**, donde vive **el telar**. Es la Fig. 5.2 (M p. 6) hecha
  máquina:
  - El **factor Xa** convierte la **protrombina (II)** en **trombina (IIa)**.
  - La trombina es **la tejedora**: lanza hilos de **fibrina** que forman una red sobre la válvula. La red atrapa
    hematíes: eso es el trombo.
  - La **antitrombina (AT)** es la **guardiana dormida**, que sola apenas frena nada. Una heparina la «despierta»: se
    une a ella y la AT atrapa el Xa (efecto anti-Xa).
  - **La heparina es una cadena de cuentas, y su largo decide** (`#mar-hnf`, `#mar-hbpm`, M p. 4-6):

| Fármaco | Cómo se dibuja | Qué hace en el telar |
|---|---|---|
| **HNF** | Cadenas largas y de largos distintos (3.000-30.000 Da) | Llegan **a la vez** a la AT y a la trombina, y las atan: frenan el Xa y la IIa. El efecto anti-IIa, 10 veces el anti-Xa. Como cada cadena mide distinto, cada una frena distinto: **efecto variable** |
| **HBPM** | Cadenas cortas y uniformes (4.500 Da) | Despiertan la AT contra el Xa, pero apenas alcanzan la trombina. Respuesta **predecible**: no se monitoriza de rutina |
| **Fondaparinux** | **Cinco cuentas** exactas: el pentasacárido (`#mar-fondaparinux`, M p. 8) | Solo la AT contra el Xa |
| **Apixabán y rivaroxabán** | Una llave sin AT | Bloquean el Xa directamente (X roja, como en la Fig. 5.2) |
| **Dabigatrán** | Una llave sin AT | Bloquea la trombina directamente |
| **Warfarina** | No se dibuja como llave | Un chip: «tarda 5-7 días», el telar se vacía de factores poco a poco (`#mar-acod-puntos`). **Hueco**: la ficha no da su mecanismo; no se dibujan factores concretos |

- **La TIH**, una mini-lupa de un toque (`#mar-hnf`, «Uniones», M p. 5). Sobre una plaqueta (disco), el **FP4**. Las
  cadenas largas de HNF lo envuelven y forman un complejo que atrae **anticuerpos IgG** (forma de Y). La plaqueta se
  activa (le salen espinas) y se consume.
  - Rótulos: «trombosis + trombocitopenia», «**no depende de la dosis**: pasa con dosis profilácticas»,
    «TIH 2,6 % con HNF, 0,2 % con HBPM».
  - El fondaparinux (5 cuentas) **no envuelve el FP4**: por eso sirve con TIH sospechada o previa.
- **La puerta del riñón** (abajo a la derecha): un **riñón grabado** con el ClCr de la hoja de órdenes. Cada fármaco que
  el riñón no elimina bien se **acumula** en un vaso a su lado, que se llena. Las dosis, sus umbrales y las dos notas
  (fondaparinux entre 30 y 35; dalteparina con ClCr <15) las escribe `#profilaxis-calc`: se leen, no se copian.

### 2.2 La adivinanza de Marino, convertida en mando (lo que más tiene que sorprender)

`#mar-inmovilidad`, M p. 13: «inmovilidad no es estasis».
- Hay un mando **«Inmóvil en la cama: 3 semanas»**. Al tocarlo, **los hematíes de la vena siguen al mismo ritmo**: el
  sistema es cerrado y, con el gasto normal, el retorno venoso también lo es. El telar no teje.
- En cambio, con **«Inflamación»** (trébol de citoquinas sobre el endotelio), la tejedora se pone a trabajar y la red
  crece con el flujo intacto.
- La frase: «Según el autor, lo que dispara la TVP en el alto riesgo es probablemente la inflamación. Creer que la
  inmovilidad lo hace lleva a usar anticoagulantes de más».
- Con **«Gasto bajo»** (del motor, un enlace) sí se enlentece: es la única estasis que el modelo dibuja, y va rotulada
  `fisiología general`.
- **Por qué sorprende**: el residente espera ver la sangre «parada» en el encamado y no la ve. Es la mayéutica pura:
  el modelo contradice la intuición y la fuente explica por qué.

### 2.3 Mandos y frases vivas

| Pestaña | Mando | Opciones | Frase viva |
|---|---|---|---|
| Paciente | Riesgo | cirugía mayor · trauma grave · enfermedad médica (UCI) · lesión medular · déficit de AT III | «Trauma grave sin profilaxis: TVP en el 58 %» · «médico: ×8» · «AT III: ×14» · «cirugía: un tercio de las muertes por ETV» (acordeones de la Tabla 5.1, M p. 2-3). Al lado, la Fig. 5.1 real («lectura aproximada») |
| Paciente | Inflamación · Inmóvil · Gasto bajo | sí/no | §2.2 |
| Fármaco | HNF · enoxaparina · dalteparina · fondaparinux · apixabán · rivaroxabán · dabigatrán · warfarina | uno a la vez | Lo de la tabla de §2.1, con su cifra: «HBPM: biodisponibilidad del 90 % frente al 15-30 %» (`#mar-hbpm`) |
| Fármaco | Anti-Xa | medir | Solo con HBPM: «objetivo profiláctico, pico de 0,2-0,5 UI/mL; útil si la dosis fija es dudosa (obesidad)» (`#mar-hbpm`) |
| Riñón | ClCr | 90 · 50 · 32 · 25 · 18 · 12 (paradas, no deslizador) | Lo que diga `#profilaxis-calc` para el fármaco elegido. Con 32, el aviso de discrepancia del fondaparinux (`#mar-fondaparinux-errata`). Con 12, la nota de la dalteparina (`#mar-nota-dalteparina-farmacos`) |
| Riñón | IMC | 25 · 42 · 52 | Lo que diga `#profilaxis-calc` (Tabla 5.2; dabigatrán: no usar si IMC ≥40) |
| Pierna | Mecánica | nada · medias · CNI | Medias: «18 mmHg en el tobillo, 8 en el muslo: un gradiente de 10; nunca solas». CNI: «de distal a proximal, 35-40 y 20 mmHg, cada 10 s; además, fibrinólisis». En la red se ven puntos que la deshacen (`#mar-mecanica`, M p. 10) |
| Pierna | Diastólica del paciente | 70 · 30 | Con 30, la CNI de 35-40 aprieta la arteria: aviso rojo «nunca por encima de la diastólica» (`#mar-cni-pegas`) |
| Pierna | Filtro de VCI | sí/no | El filtro atrapa émbolos que suben, pero **la red de abajo sigue creciendo**: «No previenen la TVP; no son profilaxis» (`#mar-filtro-vci`, M p. 11) |
| Reloj | Punción neuroaxial | horas desde la última dosis: 6 · 12 · 24 · 48 | Semáforo: «HNF ≥12 h · enoxaparina 1 vez al día ≥24 h · dabigatrán y rivaroxabán ≥48 h · apixabán ≥24 h» (`#mar-neuroeje`, M p. 9) |

### 2.4 Estados (`data-cama-viva="telar/<estado>"`)

`sano`, `inflamacion`, `inmovil`, `hnf`, `hbpm`, `fondaparinux`, `xa-directo`, `dabigatran`, `tih`, `tih-fondaparinux`,
`renal-25` (enoxaparina con ClCr 25), `renal-12` (con la nota), `obesidad-42`, `medias`, `cni`, `cni-diastolica`,
`filtro`, `neuroeje`.

La prueba guiada comprueba en cada estado:
- la cifra exacta de la ficha que le toca;
- que en `inmovil` la velocidad de los hematíes es igual que en `sano`;
- que en `tih-fondaparinux` el FP4 no se envuelve.

### 2.5 Casos

- **E2 · La enoxaparina que no era** (X y XI). Mujer de 66 años en la UCI médica, IMC 42, ClCr 25. Calculadora:
  `#profilaxis-calc`.
  1. ¿Qué y cuánto? El ClCr y la obesidad chocan: la calculadora lo enseña. La escena, en `renal-25`.
  2. **Encuentra el error**: «Medias como único método; HBPM + CNI porque es UCI». Son 2 errores: las medias nunca
     solas, y en la UCI médica, HBPM sola (acordeón «Enfermedad médica aguda», M p. 12).
  3. Día 6: las plaquetas caen. «Piensa y destapa»: qué mecanismo (FP4 + IgG) y por qué no depende de la dosis. La
     escena, en `tih`.
  4. **Giro**: el fondaparinux con ClCr 25. La tabla dice «no usar si <30»; el texto, «1,5 mg si 20-50». La nota se
     enseña y **no se elige ganadora** (CLAUDE §7.5); el caso pregunta qué dice cada parte del libro. La escena, en
     `tih-fondaparinux`.
  5. **Lo que te llevas**, con vuelta a la escena en el estado de la paciente.
- **E3 · Trauma con TCE** (XI). Varón de 35 años, TCE y fractura de fémur.
  1. Ingreso: CNI hasta que la TC no muestre sangrado durante 24 h. La escena, en `cni`.
  2. 24 h estable: enoxaparina 30 mg cada 12 h; anti-Xa recomendado en el trauma grave (acordeón «Trauma grave»).
  3. **Giro**: le van a poner un drenaje lumbar. ¿Cuántas horas tras la enoxaparina? ≥24 h si es 1 vez al día. Ojo,
     este paciente la lleva **cada 12 h**: la ficha solo da la cifra de la pauta de 1 vez al día → **hueco** (§5). El
     caso lo pregunta así: «¿la ficha te da la cifra para la pauta que lleva?».
  4. **Encuentra el error**: «Enoxaparina desde el ingreso; filtro de cava como profilaxis».
- **E7 · La adivinanza** (XI, caso nuevo y corto). Varón de 40 años con lesión medular.
  1. Enoxaparina 30 mg cada 12 h + CNI juntas, en cuanto sea seguro (acordeón «Trauma grave»).
  2. Semana 6, la familia pregunta: «Si sigue sin moverse, ¿por qué le quitan la heparina?». «Piensa y destapa»: el
     riesgo es alto solo 3-4 semanas; inmovilidad no es estasis (M p. 13). La escena, en `inmovil` frente a
     `inflamacion`.
  3. **Lo que te llevas**: la inflamación, no la cama.

### 2.6 Láminas reales al lado

Fig. 5.1 (`mar-fig5-1-prevalencia-etv.jpg`) y Fig. 5.2 (`mar-fig5-2-mecanismo-anticoagulantes.jpg`): el telar es la Fig.
5.2 hecha máquina y, al lado, «así lo dibuja el libro». No hay figuras de las medias ni de la CNI: se dibujan en
grabado y se rotulan `ficha · #mar-mecanica`.

### 2.7 Fuera del modelo (van a «Para profundizar»)

- La aspirina tras la artroplastia (`#mar-aspirina`).
- Las pautas por cirugía, que quedan en la hoja de órdenes como texto plegable:
  - cirugía general: dosis ≥6 h (HNF) o ≥12 h (HBPM) antes de operar, y reanudar a las 6 o 12 h;
  - oncológica: 4 semanas;
  - bariátrica;
  - ortopédica: 35 días.
- Neurocirugía y cirugía cardíaca (`mar-esc-neuro-cardio`).

---

## 3. Escena C · La inmersión (dolor y sedación)

### 3.1 Qué se ve

- **Un corte vertical de agua, en grabado**, como una lámina antigua de buceo.
  - **La superficie es la vigilia.** Sobre ella, **la tormenta del dolor**: olas cuyo tamaño sigue la BPS de la
    escena (3 = mar en calma, 12 = temporal).
  - **El paciente**, la cabeza con su tubo, es el buzo. Su **profundidad es la RASS**: a la izquierda, un
    **profundímetro** grabado de +4 (sobre las olas, «combativo») a −5 («no despertable»), con los 10 términos de la
    Tabla 6.4 (`#mar-tabla-6-4`, M p. 24).
  - **La franja «objetivo»** (−1 a −2) va sombreada en oro, y el 0 lleva su chip: «el óptimo es 0; en perfusión se
    titula a −1/−2» (`#mar-escalas-sedacion`).
- **La cara del buzo es la BPS** (`#bps-calc`, Tabla 6.1, M p. 18): la expresión facial (relajada → muecas), los brazos
  (de sueltos a retraídos) y su relación con el ventilador (lo tolera → lucha). Se puede reutilizar el dibujo de
  `caraGlasgow` (`visual-marino-piezas-45-53.js`) con las 4 caras de la BPS.
- **Junto al buzo, un monitor pequeño con la FC y la PA**, que **casi no se mueve aunque la cara gesticule**: «la
  correlación entre el dolor y la FC o la PA es mala: abandonar esa práctica» (`#mar-constantes-dolor`, M p. 17).
- **Los fármacos son lastres y flotadores** (el buzo baja con lastre y sube cuando se suelta):

| Fármaco | Cómo se dibuja | Qué hace |
|---|---|---|
| **Opioides** | No son lastre: son **calma de la tormenta** | Bajan las olas (la BPS) y apenas al buzo («sedación leve sin amnesia», `#mar-opioide-definiciones`). El chip de cada uno da su inicio (Tabla 6.2: fentanilo 1-2 min, morfina 5-10, hidromorfona 5-15) |
| **Propofol** | Lastre de **plomo liso** | Hunde rápido; al soltarlo, se sube según la Tabla 6.7 (§3.3) |
| **Midazolam** | Lastre **de esponja**, que en perfusión absorbe agua y pesa cada vez más | «Muy liposoluble: se acumula en el SNC; limitar a ≤48 h» (`#mar-midazolam`, M p. 26) |
| **Lorazepam** | Lastre con **un barril de propilenglicol** colgado | Con >0,1 mg/kg/h o >10 mg/h durante más de 48 h, el barril gotea: acidosis láctica (trípodes de lactato, la forma propuesta en el capilar), hiato osmolar >10 (`#mar-lorazepam`, M p. 25-26) |
| **Dexmedetomidina** | **Una boya** | El buzo queda a poca profundidad. Al «llamarle», sube a la superficie, mira y vuelve solo a su sitio: **sedación cooperativa** (`#mar-dexmedetomidina`, M p. 27-29). Despertar en 6-10 min |

- **El diazepam, la trampa de la Fig. 6.1** (M p. 17): hunde al buzo, pero **la tormenta sigue igual** (la cara con
  muecas, ahora bajo el agua). Rótulo: «el 80 % de los residentes contestó mal». Es el primer estado de la Mayéutica.

### 3.2 Mandos y frases vivas

| Pestaña | Mando | Opciones | Frase viva |
|---|---|---|---|
| Dolor | Lo que le haces | nada · moverle en la cama · aspiración traqueal | «Moverle en la cama es una causa frecuente; un 50 % tiene dolor en reposo» (`#mar-hipernocicepcion`, M p. 17). **Hueco**: la aspiración no sale en la ficha; usar solo «moverle» y «reposo» |
| Dolor | Inflamación sistémica | no · sí | La **hipernocicepción**: el mismo gesto levanta olas más altas. «Algo menor se vuelve doloroso» |
| Dolor | Opioide | fentanilo · morfina · hidromorfona · remifentanilo (+ bolo) | Morfina con IR: «sus metabolitos se acumulan (mioclonías, convulsiones): −50 %». Remifentanilo: «desaparece a los 10 min: combínalo con uno largo» (Tabla 6.2, M p. 19-20) |
| Dolor | Ahorradores | paracetamol · ketorolaco · ketamina | «El ketorolaco reduce el opioide un 25-50 %» (Tabla 6.3). Ketamina 60-120 µg/kg/h, con su nota (`#mar-ketamina-errata`) |
| Paciente | Riñón | normal · IR | Cambia el chip de la morfina (−50 %), la hidromorfona (ninguno) y el fentanilo (¿evitar?) |
| Paciente | Volemia | normal · hipovolemia | Opioide + BZD: «la PA puede caer de forma marcada» (`#mar-opioide-cardio`): una flecha en el monitor |
| Sedación | Sedante | propofol · midazolam · lorazepam · dexmedetomidina · diazepam (la trampa) | Ver la tabla de §3.1 |
| Sedación | Profundidad | ligera (−1/−2) · profunda (−4) | |
| Sedación | Duración | 24 h · 72 h · 7 días · 14 días | Combinada con el propofol, la frase de la Tabla 6.7 |
| Sedación | «Despertar» | botón | Suelta el lastre y el buzo sube (§3.3) |
| Sedación | Dosis de propofol | normal · >5 mg/kg/h durante >48 h | El **SIP** (`#mar-pris`, M p. 28). La cara se queda y el monitor se enciende: corazón que falla, lactato que no cede, CK. Rótulo «3 %, mortalidad 30-35 %» y enlace al capilar vivo (la mitocondria, caso B3) |
| Delirio | Agitación por delirio | no · sí | Dexmedetomidina de elección. Si hay bradicardia o hipotensión, el asistente del haloperidol (`#mar-halo-wizard`), con QTc <500 |

### 3.3 La pieza que más tiene que sorprender: la subida (Tabla 6.7, `#mar-tabla-6-7`, M p. 29)

- **Dos buzos lado a lado**, los dos con propofol y la misma duración: uno en sedación ligera y otro en profunda. Al
  pulsar «Despertar», los dos sueltan el lastre y suben.
- Arriba, un reloj grabado en cada columna marca **el tiempo de la tabla**:

| Duración | Ligera | Profunda |
|---|---|---|
| 24 h | 13 min | 25 h |
| 72 h | 34 min | 59 h |
| 7 días | 3,3 h | 71 h |
| 14 días | 3,4 h | 74 h |

- La animación es **proporcional en escala logarítmica**, con el rótulo `ilustrativo` (las cifras del reloj, `ficha`).
  El ligero llega arriba enseguida; el profundo se queda abajo «días».
- La frase: «Lo que más alarga el despertar es la profundidad, no el tiempo: a las 24 h, 13 minutos frente a 25 horas».
- Con **midazolam**, el lastre-esponja no se suelta del todo. Rótulo: «en un estudio, 30 h para salir de la sedación
  con midazolam frente a 4-5 h con lorazepam» (`#mar-bzd-proscontras`). Justo al lado: «las guías más recientes:
  evitar las BZD en el ventilado» (`#mar-bzd-prevencion`). Las dos cosas se enseñan **juntas**: es la trampa del
  Examen que pide la cobertura (§2.E).
- **Sin farmacocinética inventada**: el modelo **salta entre los estados de las tablas**. Para el midazolam, el
  lorazepam y la dexmedetomidina no hay tabla de despertar por duración: solo se ven las cifras que da la ficha (30 h
  frente a 4-5 h; 6-10 min) y el resto se anota como hueco.

### 3.4 Estados (`data-cama-viva="inmersion/<estado>"`)

| Estado | Escena |
|---|---|
| `dolor-oculto` | BPS 9, RASS −3, FC normal |
| `diazepam` | Hunde, la tormenta sigue |
| `fentanilo` | Calma |
| `morfina-ir` | Morfina con IR |
| `hipernocicepcion` | Inflamación |
| `rass-objetivo` | Ligera |
| `profunda-72h` | Profunda, 72 h |
| `despertar` | Dos buzos, 72 h |
| `midazolam-48h` | |
| `lorazepam-pg` | El barril que gotea |
| `dexmedetomidina` | La boya |
| `pris` | SIP |
| `delirio` | |
| `haloperidol` | |

### 3.5 Casos

- **E4 · El intubado que lucha** (XII y XIII). Varón de 62 años, intubado por neumonía, con IR (ClCr 25).
  Calculadoras: `#bps-calc`, `#rass-calc`, `#propofol-calc` y `#mar-halo-wizard`.
  1. BPS 9, RASS +2, FC 82: ¿dolor? Sí: BPS ≥6 es inaceptable y la FC no sirve.
  2. ¿Diazepam? No (Fig. 6.1). Analgesia primero.
  3. ¿Fentanilo o morfina con su IR? La morfina, −50 % por los metabolitos; el fentanilo «¿evitar?» en la IR terminal.
     La ficha deja la duda: se enseña tal cual.
  4. Propofol titulado a RASS −1/−2.
  5. Día 4: delirio → dexmedetomidina. **Giro**: bradicardia → haloperidol 5 mg, con QTc <500.
  6. **Encuentra el error**: «FC normal: no le duele; diazepam para el dolor y la agitación; haloperidol aunque el QTc
     sea 520».
  7. **Lo que te llevas**, con vuelta a la escena en `rass-objetivo`.
- **E8 · El despertar que no llega** (XIII). Mujer de 55 años, 72 h de propofol en sedación profunda.
  1. «Predice», con los dos buzos: ¿cuánto tarda? 59 h frente a 34 min.
  2. «Piensa y destapa»: qué pesa más (la profundidad).
  3. La otra cama: midazolam desde hace 4 días (>48 h).
  4. **Giro**: la tercera cama, con lorazepam a 12 mg/h desde hace 60 h, tiene acidosis láctica. El hiato osmolar es
     de 14 (es un dato del caso, no se calcula): >10 se correlaciona con la acumulación de propilenglicol.
  5. **Encuentra el error**: «el lactato normal descarta la toxicidad por propilenglicol». Es falso: «el lactato no
     predice bien la toxicidad» (`#mar-lorazepam`).
- **B3 (ya existe en el capilar)**: su giro del día 3 (SIP) abre esta escena en `pris`. Es el enlace entre los dos
  modelos.

### 3.6 Láminas reales al lado

- Solo la Fig. 6.1 (`mar-fig6-1-diazepam-dolor.jpg`).
- Las Tablas 6.1, 6.4 y 6.7 son tablas, no figuras: se recrean vivas (la cara de la BPS, el profundímetro y los
  relojes).

### 3.7 Fuera del modelo (van a «Para profundizar»)

- La PCA (`mar-pca`);
- la metilnaltrexona;
- la meperidina (vida media de 15-40 h);
- el dolor neuropático (`#mar-neuropatico`);
- la reflexión sobre la opiofobia (`#mar-opiofobia`);
- los bolos de BZD (`#mar-tabla-6-5`).

---

## 4. Lo que da cada escena a otros bloques (sin construirlo ahora)

| Escena | Ficha después | Estado nuevo que haría falta (solo con cifras de su ficha) |
|---|---|---|
| Muralla | `ma-cdifficile` | El colon tras antibiótico + IBP; las cifras, de su ficha |
| Muralla | `mu-enteral-indicaciones` | `enteral` (trófica) |
| Muralla | `neumo-nav-prevencion` | `boca-uci` y la gota a la tráquea |
| Telar | `merino-trombocitopenia` | `tih` más el recuento de plaquetas |
| Telar | `merino-microangiopatias` | La PTT: el FvW sin cortar y las plaquetas en los microvasos. Hace falta su propia lupa de microvaso |
| Telar | `merino-plaquetas-plasma` | El PFC como balanza (R3) |
| Telar | `neumo-ep-manejo` | El trombo que se suelta (y, con el filtro, que se atrapa) |
| Telar | `mn-ictus-complicaciones` | La reversión |
| Inmersión | `mn-delirio` y `mn-abstinencia` | Las BZD de elección en la abstinencia, ya en la ficha XIII |
| Inmersión | `mt-opioides` | La naloxona: soltar el lastre del opioide de golpe |
| Inmersión | `mt-bzd-betabloq` | El flumazenilo |
| Inmersión | `neumo-sbt` | Despertar para la prueba de respiración espontánea |
| La cama | — | La cama misma: el CVC lleva al catéter vivo, el monitor al capilar y a la circulación viva, y la bolsa de suero al río y mar. La entrada a todos los modelos del bloque, con el mismo paciente |

---

## 5. Huecos (no se rellenan, se anotan)

1. La aspiración traqueal como estímulo doloroso no está en la ficha XII: solo «moverle en la cama» y el dolor en
   reposo.
2. Los tiempos de despertar por duración solo existen para el propofol (Tabla 6.7). Para el midazolam y el lorazepam
   está el dato de un estudio (30 h frente a 4-5 h); para la dexmedetomidina, «6-10 min» (Tabla 6.6).
3. La ventana neuroaxial de la enoxaparina **cada 12 h** no está en la ficha: solo la de «una vez al día ≥24 h».
4. El mecanismo de la warfarina (qué factores) no está en la ficha X.
5. El ritmo de la erosión, la translocación y la descontaminación (fuera de «5-7 días») y la velocidad del telar:
   todo `ilustrativo`.
6. Las cifras de la Fig. 4.4 y la Fig. 5.1 son lecturas aproximadas (ya anotado en la ficha).
7. La pauta exacta de la clorhexidina al 0,12 % cada 6 h está; su efecto sobre los bacilos, no en cifras: solo «actúa
   sobre todo frente a grampositivos».

---

## 6. Formas nuevas para la tabla única (propuestas; el usuario decide en la maqueta)

| Especie | Forma propuesta | Dónde |
|---|---|---|
| Coco (bacteria grampositiva) | La propuesta del catéter vivo | Muralla, catéter |
| Bacilo (gramnegativo, *Salmonella*) | Bastón con extremos redondos | Muralla |
| Linfocito del GALT | Círculo con núcleo grande | Muralla |
| Antitrombina | Escudo | Telar |
| Heparina | Collar de cuentas: largo (HNF), corto (HBPM), **5 cuentas** (fondaparinux) | Telar |
| FP4 | 4 bolitas en cuadrado | Telar |
| IgG | Y | Telar |
| Plaqueta | Disco pequeño (con espinas al activarse) | Telar y bloque 2 |
| Fibrina | Hilo | Telar |

Se reutilizan:
- de la tabla única: **H⁺, HCO₃⁻, citoquinas y hematíe**;
- de la maqueta del capilar: **el lactato**, que sigue como propuesta.

---

## 7. Las maquetas (para el constructor)

- **Tres HTML sueltos** en `autonomo/maquetas/`: `b1-muralla-papel.html`, `b1-telar-trombina.html` y
  `b1-inmersion.html`.
- **La misma cabecera**: la cama 7 en grabado, con la ventana de la escena encendida y las otras dos apagadas.
- **Interruptor** Explorar | Conceptos | Mayéutica. La Mayéutica de muestra lleva:
  - una cadena de Guía socrática de 5 preguntas, 2 de «predice» con el modelo;
  - 2 de Examen;
  - un caso completo hasta «Lo que te llevas»: E1, E2 y E4, respectivamente. Las cadenas, las de `cobertura.md` §2.E.
- **Al final**, la pregunta al usuario: «Construir así», «Construir con cambios», «Una cama con tres escenas o tres
  modelos sueltos» y «sí / no» para cada forma nueva.
- **`window.__pruebas()`**: las cifras de cada estado de §1.4, §2.4 y §3.4, la forma de las preguntas, y las tres
  comprobaciones especiales:
  - en `inmovil`, la velocidad igual que en `sano`;
  - en `tih-fondaparinux`, el FP4 no se envuelve;
  - en `despertar`, los relojes con las cifras exactas de la Tabla 6.7.
- **Lo aprendido en el juicio de las maquetas del capilar y el catéter** (`juicio-maquetas.md`):
  - la frase viva, encima del dock;
  - el dock, de 150 px como mucho;
  - la lectura no tapa la lupa;
  - nada se pisa a 360 px;
  - el mando de la pregunta, sincronizado con el modelo;
  - el tiempo de los casos coincide con el reloj de la escena.

---

## 8. Parte B · ¿Ampliar el motor del corazón? **Sí, como capa de lectura mínima y ampliable**

### 8.1 Por qué sí

1. **Hoy, las 4 fichas de hemodinámica del bloque no tienen nada que ver en su modelo.** Son `mar-retorno-venoso`,
   `mar-respuesta-fluidos`, `mar-cateter-ap` y `mar-termodilucion`, y su lección (la Pms, la EPP, las ondas del
   catéter, la curva de termodilución) no existe en la circulación viva. Enlazarlas «tal como está» abre un ecógrafo
   que no enseña su tema: un 2-3 en REGLAS §7.4.
2. **El motor ya calcula casi todo.**
   - Ya tiene las presiones de AD, VD, AP y AI en cada paso (`s.pad`, `s.pvd`, `s.pap`, `s.pai`), la PVC y el
     enclavamiento medios (`pvc`, `pcp`), la presión media de llenado (`pmls`, `motor.mjs` línea 334), el retorno venoso
     (`qRet`, línea 208) y la insuficiencia tricuspídea (`qRegT`).
   - Falta **leerlo y dibujarlo**, más dos maniobras de volumen que ya existen en otra forma: los escenarios restan
     volumen venoso con `m.s.vven`.
   - No se toca la fisiología del latido.
3. **Es la base del bloque de shock.** La Tabla 14.1 (`mc-definiciones`) es literalmente una lectura de catéter: PVC,
   enclavamiento, gasto y RVS por tipo de shock. El mapa (`autonomo/ideas/marino.md` §1.1, puntos 2 y 7) ya lo pide
   como «lo que le falta al motor».
4. **Respeta las reglas de eco**:
   - «una sola fisiología»;
   - «un estado por fotograma»;
   - «**anatomía congelada**»: el catéter **no** se dibuja dentro del corazón 3D. Va en un esquema 2D, como la Fig.
     8.2: una cinta AD → VD → AP → rama con su trazado. Meterlo en el 3D sería una decisión del usuario, más adelante.

### 8.2 Lo mínimo que se añade (archivos de `js/modules/eco/`)

| Pieza | Qué hace | Origen de la cifra |
|---|---|---|
| `maniobras.mjs` · `epp(motor, on)` | Mientras está activa, pasa 300 mL del volumen venoso sin tensión al que tiene tensión (`p.vuVen −= 300`); al quitarla, los devuelve | `#mar-epp`: «moviliza unos 300 mL» (ficha). El reparto entre volumen con y sin tensión: `fisiología general` |
| `maniobras.mjs` · `bolo(motor, mL)` | `s.vven += 250 \| 500` | `#mar-pms-fluidos` (250-500 mL), `#mar-sobrecarga-prueba` (500 mL en 10-15 min) |
| `lecturas.mjs` · `guyton(motor)` | Devuelve la recta de retorno, RV = (Pms − PAD)/Rv, con Rv = (pmls − pvc)/gc del estado actual, más el punto del paciente | Ec. 11.1-11.2 (`#mar-rv-ecuacion`) |
| Curva de función | La lee de una tabla precalculada por escenario (`guyton-tablas.mjs`) | Generada por `herramientas/curvas-guyton.mjs`, que hace correr el motor con volúmenes de −600 a +900 mL. Nunca se calcula en el móvil al vuelo |
| `lecturas.mjs` · `presionEnPunta(estado, lugar)` | `'ad' \| 'vd' \| 'ap' \| 'enclavado'` → `s.pad \| s.pvd \| s.pap \| s.pai`, en cada fotograma | Fig. 8.2 y `#mar-cap-pasos` |
| `lecturas.mjs` · `curvaTermo(gc, qRegT)` | La forma de la curva, con un área ∝ 1/GC; con insuficiencia tricuspídea, más larga y más baja | El principio, `#mar-termo-metodo` (ficha). La forma, `ilustrativo` (Fig. 8.7) |
| `diagramas.mjs` | Tres paneles plegables nuevos: «Guyton», «Catéter que avanza» (con Motion; el globo se infla y la onda se aplana) y «Termodilución» | — |

**El plano de los paneles** para la vista Visual de cada ficha: `data-eco-escenario` más un `data-eco-panel` nuevo
(`guyton`, `epp`, `cateter`, `termo`).

### 8.3 Pruebas (`pruebas/maniobras.test.mjs`)

**Regla**: si el motor no llega, la cifra se marca `pendiente` y se arregla el modelo. **Nunca** se cambia la
referencia (CLAUDE de eco).

1. Normal: PVC 0-5 y enclavamiento 6-12 (Tabla 8.1, `#mar-tabla-8-1`). Si no da, `pendiente` en `referencias.mjs`.
2. Catéter, en la dirección de la ficha (`#mar-cap-pasos`):
   - la diastólica del VD ≈ la PAD media (±2);
   - la diastólica de la AP es mayor que la del VD;
   - la sistólica de la AP ≈ la del VD (±3);
   - el enclavamiento ≈ la diastólica de la AP (±4) en el normal;
   - en `tep`, el enclavamiento queda **por debajo** de la diastólica de la AP (`#mar-enclavamiento-ondas`).
3. EPP:
   - en `hemorragia`, el VS sube ≥10 %;
   - en `fallo` o en `dilatada`, sube <10 %;
   - al quitarla, el VS vuelve a ±3 % del de antes (`#mar-epp-pasos`, paso 3).
4. Bolo de 500 mL:
   - la Pms sube **siempre**;
   - en `fallo`, el gradiente Pms − PVC cambia ≤1 mmHg (no responde, `#mar-pms-fluidos`).
5. Guyton: la recta corta el eje en PAD = Pms (±0,5); el punto del paciente queda sobre la curva de función (±5 %).
6. Termodilución: el área de la curva es inversamente proporcional al GC (±2 %). Tres medidas seguidas difieren ≤10 %
   (`#mar-termo-cuantas`).
7. **Paciente posible** en cada maniobra: PA, PVC, enclavamiento y GC de un humano en cada extremo.

### 8.4 Quién lo usa

- **Este bloque**: `mar-retorno-venoso` (Guyton + bolo), `mar-respuesta-fluidos` (EPP con el VTI subaórtico en el
  ecógrafo que ya existe, el corte de VS ≥10 %, sensibilidad 85 % y especificidad 92 %), `mar-cateter-ap` y
  `mar-termodilucion`. Además, el capilar vivo lee el GC del motor.
- **Bloque de shock (B4 del mapa)**: `mc-definiciones` (Tabla 14.1, leída con el catéter), `mc-hemorragico-clasificacion`,
  `mc-cardiogenico-fisio`, `mc-shock-septico`.
- **B5 y B6**: `mc-soporte-mecanico` y `mc-ic-*`.
- **Después, con el pulmón**: la presión intratorácica (la PEEP que sube falsamente el enclavamiento,
  `#mar-enclavamiento-peep`; la VVS). **Hoy no se hace**: queda anotado como la ampliación siguiente.

### 8.5 Lo que no se hace ahora

- La gravedad de los escenarios hasta llegar a shock (mapa §1.1, punto 1).
- El chorro regurgitante.
- La pared akinética.
- La FA.
- La calibración de la RVS (README, «Pendiente»).

Son el trabajo del bloque de shock. Esta capa no los bloquea.

---

## 9. Decisiones para el usuario (con maqueta)

1. Un modelo «La cama 7» con tres escenas, o tres modelos sueltos.
2. Para cada escena: «construir así» o «con cambios».
3. Las formas nuevas de §6.
4. Motor: **el profesor recomienda que sí** (§8), como capa de lectura. El usuario puede pedir además el catéter en
   el corazón 3D (rompería «anatomía congelada»: decisión suya).
