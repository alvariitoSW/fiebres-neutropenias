# Megaproyecto «monitor del shock y soporte mecánico» · juicio de la maqueta, método Anatomy, mapa de crecimiento y versión 2

*(Profesor, modo mapa + juzgar, 21/10/2026. Hecho con: la maqueta `autonomo/maquetas/b3-shock.html` abierta a 390 × 844
(táctil, escala 2) en un servidor propio, con cada mando, cada paciente, el soporte, «¿Qué shock es?» y la Mayéutica
recorridos, fallando a propósito, y las cifras leídas del estado de la página en cada paso; el texto de Marino pp. 45-49
del PDF `docs/marino-2024-shock-caps14-17.pdf` pasado a texto página a página (límites de página comprobados) y sus
Figs. 16.3, 16.4 y 16.5 vistas; la ficha `mc-soporte-mecanico` de la app; el motor del latido (`js/modules/eco/motor.mjs`)
corrido en node con hemorragia, fallo del VI y derrame; el método Anatomy (`/tmp/ajeno/anatomy`: `SKILL.md`,
`references/craft.md`, `kit.md`, `motion.md`, `verify.md`, `walkthrough.md`, `examples/test-rig/rig.ts` y el Raptor ya
construido abierto a 390 y 1100 px); el vaso que sangra abierto en la app como comparación; y un barrido con grep de
toda la app (Manual UMI, El Libro Azul, Guía ESC de IC, Hernández 2026, Marino Fundamentos, Merino Neumología, PIF,
eco).)*

**Páginas**: del PDF (lo que va tras `#page=`). Marino caps. 14-17 = `docs/marino-2024-shock-caps14-17.pdf`.
Lo comprobado de pp. 45-49: p. 45 = soporte mecánico e IABP (método); p. 46 = Fig. 16.3 y complicaciones del IABP;
p. 47 = resto de complicaciones del IABP, Impella y Fig. 16.4; p. 48 = efectos y complicaciones del Impella, ECMO VA,
sus complicaciones y la poscarga del VI; p. 49 = venteo, Fig. 16.5, resultados y selección del dispositivo.

---

## 1. Juicio de la maqueta (crítico exigente)

### 1.1 Puntuación (REGLAS §7 y §8; modelo de comparación: el vaso que sangra y la Circulación viva)

| Punto | Nota | Por qué |
|---|---|---|
| §7.1 Primera vista | 3 | La idea (PAM = GC × RVS + PAD) y el monitor salen arriba. Pero el corazón dibujado empieza a ~1.100 px: lo que cambia al tocar un mando del dock no se ve sin bajar. |
| §7.2 Párrafos | 4 | Sin muros de texto; frase, celdas y guía cortas. |
| §7.3 Resaltado | 4 | Marcas ✓/✗ con icono y color; 1-3 resaltes por bloque. |
| §7.4 Lo que el tema enseña se ve | **2** | El soporte no se ve funcionar: el Impella es un trazo de 2 px quieto, el balón una elipse amarilla, el ECMO una caja con texto. El corazón es un esquema de elipses (el anti-patrón «abstracto» de Anatomy). |
| §7.5 Interactivo que enseña | **3** | Gravedad, volumen y fármacos mueven cifras con sentido. Pero el soporte no hace nada en 4 de 5 pacientes, el nombre del estado no sigue a los mandos y el venteo no cambia la frase (§1.2). |
| §7.6 Vista Visual | 3 | La tira «Así lo dibuja el libro» con las láminas reales está bien; no hay paso «Mira» propio. |
| §7.7 Móvil | 3 | Sin desborde (390 px). Pero la frase se corta a 2 líneas y esconde justo los avisos (por qué no se pone el soporte, el bolo >500 mL del TEP). |
| §7.8 Modelo grande | **2** | No vive en la Circulación viva: tiene su propia fisiología de anclas a mano, separada del motor del latido que ya llega a shock. |
| §7.9 «Ver en la ficha» | 5 | Cada paso, nota y pista lleva su enlace al párrafo y el PDF de segunda opción. Es lo mejor de la maqueta. |
| §7.10 Explicación guiada | 4 | 3-5 pasos por estado, con anillo en el dibujo o el monitor. Falla cuando el estado está mal nombrado (§1.2, G4). |
| §7.11 Por concepto, fuentes en lista | 3 | Citas por paso, sí. Pero los objetivos son solo de Marino y no hay estructura de estado con fuentes en lista. |
| §7.12 Megaproyecto y nivel Anatomy | **1** | Ni objeto real ni piezas: hoy no aguanta crecer. |
| §8 Recorrido y formatos (muestra) | 3 | Solo test con «piensa antes»; faltan «piensa y destapa» y «encuentra el error». |
| §8 Dificultad | 3 | E1 (Amparo: ScvO₂ alta, gap 4, lactato 3,9) es de nivel MIR. «¿Qué shock es?» se aprende de memoria a la segunda vuelta. |
| §8 Caso que evoluciona | 2 | Un paso; el monitor ya enseña la PCP 14 y el IC 1,9 que el paso siguiente pretende revelar. |

**Veredicto: no pasa** (5 puntos por debajo de 4). Como base de datos y de citas es buena; como modelo, hay que rehacer
el núcleo (la fisiología y el dibujo), no retocarlo.

### 1.2 Lo que falla, por gravedad (con archivo y línea de `autonomo/maquetas/b3-shock.html`)

**Graves (bloquean):**

- **G1 · «Al darle al Impella no aparece nada» (la queja del usuario, reproducida).** Mateo arranca seleccionado. En
  Soporte → Impella, el monitor no cambia (124 lpm, 86/60) porque `calcular()` anula todo soporte si el tipo no es
  cardiogénico (l. 589-600). El motivo existe, pero va en la frase, que se corta a 2 líneas (`.frase-txt`,
  `-webkit-line-clamp: 2`, l. 118): en pantalla se lee «…Se repone con sangre. La…». El dibujo del dispositivo está
  ~1.100 px más abajo. Lo mismo con Joaquín (balón e Impella contraindicados: el aviso, cortado) y con Consuelo y Amparo.
  En Aurelio sí cambia, pero el Impella (l. 321-326) es una línea amarilla quieta con un rectángulo y un círculo: sin
  rotor, sin entrada ni salida, sin sangre que pase, sin consola.
- **G2 · Dos fisiologías.** Las cifras salen de anclas escritas a mano (`TIPOS`, l. 504-541) más sumas ilustrativas, y
  después se recortan (`clamp`, l. 601-603). No salen del motor del latido, que hoy **ya llega a shock** (medido en node:
  hemorragia de 2 L → PAM 58, FC 125, PVC 0,5; Ees del VI 0,3 → PAM 54, IC ~1,3, PCP 29). Rompe la regla del eco
  («una sola fisiología», `js/modules/eco/CLAUDE.md`), la de Anatomy («cada número sale del mismo modelo que mueve las
  piezas») y REGLAS §1.7 (recortar en vez de buscar el error). El corazón 3D y la eco de la Circulación viva no podrían
  mostrar este estado.
- **G3 · El monitor marca en rojo lo que el dispositivo consigue.** Aurelio con Impella: PCP 9 sale con ✗ frente al
  «19-20» de la Tabla 16.2, e IRVS 24 con ✗ frente a «25-30». La Tabla 16.2 es la presión de llenado óptima para dar
  volumen; el Impella descarga el VI a propósito (p. 48). Enseña al revés. Con soporte, el objetivo de PCP se suspende
  con una nota «la fuente no lo dice» y la frase dice «la PCP baja: es la descarga».
- **G4 · El nombre del estado no sigue a los mandos** (`claveEstado`, l. 835-841).
  - Aurelio sale siempre como «La PCP no está alta», también a gravedad 0 (sano, PAM 87) y a 100 (PCP 23).
  - ECMO con «Ventear el VI»: la PCP baja de 29 a 19, pero la frase sigue «la PCP sube. Hay que descargarlo» (l. 854).
  - Mateo en Clase III: la frase dice «Hipotensión», con la PAM 69 marcada ✓ en verde.
- **G5 · Causa y efecto no caben juntos en la pantalla.** El monitor ocupa la primera pantalla, el corazón la tercera y el
  dock fijo tapa el pie. Al tocar un mando, o se ve la curva o se ve el dibujo, nunca los dos.

**Importantes:**

- **I1 · El monitor es pobre frente a uno de UCI.**
  - No hay curva de arteria pulmonar, aunque el enunciado dice «catéter de arteria pulmonar» y la PCP se enseña.
  - No hay capnografía (EtCO₂), que la app ya explica: Marino cap. 7 y la RCP, cap. 21.
  - La PVC se pinta en 36 px con una escala de 0-30: sus ondas no se leen.
  - Faltan escala en mmHg en la curva arterial, derivación, velocidad de barrido, límites de alarma y PNI frente a
    presión invasiva.
  - Lactato, gap, ScvO₂ y diuresis se ven como si fueran canales del monitor. Son de laboratorio o de la bolsa de orina,
    con su hora.
  - No hay **consola del dispositivo**: flujo de la bomba, gasto nativo frente a gasto total, volumen y ritmo del balón,
    flujo del ECMO.
  - Con ECMO, el «IC 2,7» mezcla el gasto del corazón con el de la bomba.
- **I2 · El dibujo enseña cosas falsas o vacías.**
  - «Vena (el volumen)» iguala la PVC al volumen: en el taponamiento la vena sale llena (PVC 17) sin más sangre.
  - El tabique es una línea recta que no se abomba: en el TEP con bolo >500 mL, la idea es justo que el VD empuja el
    tabique (cap. 22, p. 10).
  - El latido es un `scale` del grupo entero (`latir`, l. 761), no una contracción.
- **I3 · El balón no enseña su sincronía.**
  - No se ve la onda R que lo dispara (p. 45) ni marca de inflado (al cerrarse la aórtica) y desinflado (contracción
    isovolumétrica) sobre el ECG y la curva.
  - La curva de referencia sin balón (punteada) se pierde entre la escala.
- **I4 · «¿Qué shock es?» se memoriza.**
  - Son 5 pacientes fijos, siempre en el mismo orden y la misma gravedad (`ADIVINA`, l. 1131).
  - Siempre con catéter de arteria pulmonar (PCP e IRVS a la vista) y siempre con los objetivos de la Tabla 14.5 (l. 1177).
  - Un R1 en urgencias tiene PA, FC, SpO₂, diuresis, lactato y la eco, no un Swan-Ganz. Falta el modo «solo cabecera»
    y el desvelado por etapas (cabecera → eco → catéter).
- **I5 · Mayéutica de muestra con fugas.**
  - El paso 1 del caso de Aurelio enseña en el monitor PCP 14 e IC 1,9 (l. 1226 y 1254), que son lo que revela el paso 2.
  - La PA del caso (84/58) no es la del monitor (83/59).
  - En «predice y compruébalo» se tapan las cifras pero no el dibujo: la vena y la arteriola delatan la respuesta.
- **I6 · Pacientes sin tiempo.**
  - Cambiar de paciente lo reinicia todo, y no hay reloj (hora 0 → 1 → 6) ni tendencias.
  - El lactato y la temperatura se congelan al tratar (l. 562). Es defendible (el lactato tarda), pero sin reloj parece
    que el tratamiento no sirve.
  - La gravedad es un «0-100 %» abstracto (salvo en la hemorragia), cuando `escenarios.mjs` ya la da con nombre:
    mL de derrame, Ees, resistencia pulmonar ×N.
- **I7 · Una sola fuente de objetivos.** La app tiene otros objetivos para lo mismo y discrepan:
  - el Manual UMI (pestaña `umi-shock-septico`) pide ScvO₂ ≥70 %, PVC 8-12 y TAM 65-70;
  - Marino (Tabla 14.5) pide ScvO₂ >50 %;
  - la Guía ESC (`ic-descompensada`) estadifica con SCAI A-E.
  
  La maqueta no tiene dónde poner una segunda tabla (REGLAS §7.11).
- **I8 · Las fuentes discrepan sobre el Impella y no se dice.** Marino dice «bomba centrífuga miniatura», 2,5-5,5 L/min
  (p. 47; así lo traduce la ficha). La Guía ESC de la app dice «bombas de flujo microaxial (hasta 4-5,5 l/min)»
  (`insuficiencia-cardiaca.html`, l. 903). Nota «las fuentes discrepan»; sin elegir ganadora.

**Menores:**

- Los 5 chips de pacientes ocupan 2 filas.
- «Ventear el VI» no dice cómo: con balón, con Impella o drenando el VI (p. 48-49).
- El rótulo de la sección «Para decidir» se mezcla con el contenido.
- El trombo del TEP es una elipse de 9 px (l. 295).
- La SpO₂ recortada a ≥80.
- Las celdas de perfusión usan .56 rem (~9 px): legible, pero en el límite.

**Lo que se queda (bien hecho):**

- las citas con «Ver en la ficha» y su lista de fuentes por estado;
- las notas con los tres tipos;
- «Para profundizar»;
- la tira de láminas;
- el formato de E1;
- la idea de marcar con ✓/✗ frente a una tabla con nombre;
- el modo «¿Qué shock es?» como concepto;
- la lista de pacientes del bloque.

---

## 2. El método Anatomy, traducido a la app

**Qué es** (MIT, © 2026 Ryan): un método para que una figura explique un mecanismo **construyendo el objeto real**,
pieza a pieza. Lo que tomamos, con las reglas de su `SKILL.md` y `references/`:

| Regla de Anatomy | Cómo se aplica aquí |
|---|---|
| **El objeto es la explicación**: «di en una frase qué se mueve y qué significa» | Cada dispositivo tiene su frase (§3). Nada de cajas con rótulos ni flechas sueltas. |
| **La verdad primero**: un módulo puro con las cifras y el comportamiento, del que leen las piezas, la lectura y el pie (`rig.ts`) | El motor del latido + `soporte.mjs` (§3.4). La lectura en vivo, las curvas y el giro del rotor salen del mismo instante del mismo motor. |
| **Lista de piezas antes de la geometría**: 40-80 en una Figura, 80-150 en un Hero; cada pieza descansa sobre otra y tiene una función | Listas de §3.1-3.3, separadas en «de la fuente», «anatomía o fisiología general» y «pide fuente». |
| **Tonos**: base `lo`, estructura `mid`, sujeto `hi`, **una sola pieza `lit`** (la que hay que mirar); color solo cuando el color es el tema | Tonos con los tokens de `css/variables.css` (papel `--bg-main`, `lo` `--text-muted`, `mid` `--text-dim`, `hi` `--text-main`, `lit` `--accent-yellow`). El color es el tema en la sangre: venosa (`--accent-purple`) y arterial (`--accent-red`), siempre con forma o texto además del color (CLAUDE §5). |
| **Sólidos, no alambres**; las líneas terminan en algo; nada de flechas ni globos dentro del dibujo; como mucho un rótulo grabado | Los rótulos van a la leyenda numerada (como el Raptor: «01 Gimbal…», botones que resaltan su pieza), no dentro del dibujo. |
| **Dos miradas**: a 1× se lee un objeto; a 4× cada zona tiene algo cierto que encontrar | Revisión con capturas a 4× de cada unión (§5, verificación). |
| **Movimiento tranquilo**: basado en el tiempo, seguimiento exponencial (τ 0,1-0,3 s) o muelles reales; recorrido guiado en reposo (a los ~1,4 s, se pausa al tocar, vuelve a los ~3,6 s); parado fuera de pantalla; quieto con «reducir movimiento» | El latido y el dispositivo los mueve el reloj del motor. El recorrido en reposo enseña el ciclo (inflar-desinflar, el rotor que acelera). Reducir movimiento = estado final, como Motion en la app. |
| **Tarjeta**: «Fig. n» arriba a la izquierda, título arriba a la derecha, pista abajo a la izquierda, **lectura en vivo** abajo a la derecha, leyenda y pie debajo | La lupa del dispositivo usa esta tarjeta. La lectura: «balón 40 mL · infla 1:1 · pico diastólico 112 mmHg (modelo)». |
| **Despiece** (vista desmontada) cuando las piezas son la explicación | El Impella y el ECMO se desmontan en sus conjuntos reales (§3). |
| **Verificar como un crítico**: capturas a 390, momentos del movimiento, 4×, «líneas que acaban en nada: 0» | Prueba `autonomo/pruebas/soporte-vivo.mjs` + capturas a 4× leídas por el profesor (§5). |

**Lo que no tomamos sin preguntar** (CLAUDE §2: «ninguna otra librería sin que el usuario la elija»; sin build tool):
- El **kit** (`kit/iso-kit.mjs` 35 KB, `lathe.mjs` 48 KB y `tube.mjs` 14 KB; ESM puro, sin dependencias, funcionaría en el
  navegador). Dos opciones para el usuario:
  - **A (recomendada)**: el método, no el código. Una pieza propia `js/core/iso.js` (~300 líneas): proyección isométrica,
    prisma y cilindro con 4 tonos, cuerpo de revolución con sombreado suave, tubo en trozos ordenados por profundidad,
    orden del pintor. Es lo que la app hace con echodemo: la idea sí, el motor propio.
  - **B**: copiar los tres archivos del kit a `js/vendor/anatomy/` con su licencia MIT (como Motion), cargados solo en la
    lupa.
- La **auditoría** (`kit/audit.mjs`) y `scripts/lines.mjs` pueden usarse como herramienta de desarrollo en `autonomo/`
  (no son de la app). Con A, se escribe una versión corta de la comprobación de «líneas que acaban en nada».
- La geometría estática puede generarse una vez con un script de `autonomo/herramientas/` y guardarse en `js/data/`.
  Hay precedente: `js/modules/eco/guyton-tablas.mjs` se regenera así.
- **Estilo**: Anatomy es isométrico técnico y monocromo; la app es grabado crema y oro. Propuesta: **el dispositivo, en
  isométrico técnico con los tokens de la app** (es una máquina: se entiende como máquina) y **el paciente, en grabado
  anatómico** (el estilo A del corazón eléctrico). Así la máquina y el cuerpo se distinguen a la vista.

**Tamaño según Anatomy**: cada dispositivo es un **Hero** (80-150 piezas, una escena viva). Los tres, más la física del
motor y sus pruebas, son el trabajo grande del sub-bloque 3B. Primero, una página que abra con el objeto básico; después,
añadir detalle.

---

## 3. Los tres dispositivos como objetos reales

Cada uno tiene **tres planos** en su lupa (se pasa de uno a otro con un deslizador o un toque, sin salir del monitor):
1. **El recorrido**: el torso en grabado con el camino desde la femoral (la arteria o la vena) hasta su sitio. Enseña
   por dónde entra y dónde queda la punta.
2. **Dentro**: el corte del corazón y la aorta con el dispositivo funcionando, sincronizado con el latido del motor.
   Es el plano principal.
3. **El despiece**: el dispositivo solo, en isométrico, desmontado en sus conjuntos, con la leyenda numerada.

Arriba, siempre visible, **una tira del monitor de 3 curvas** (ECG, presión arterial y la presión del VI o la PCP) y la
**consola del dispositivo**. Así se ve a la vez la causa (lo que hace el aparato) y el efecto (lo que dibuja el monitor).

### 3.1 El balón de contrapulsación (IABP)

**La frase**: *«Al cerrarse la válvula aórtica, el balón se hincha y empuja la sangre hacia las coronarias y el resto del
cuerpo; justo antes de que se abra, se vacía de golpe y deja un hueco: el VI eyecta contra menos presión.»*

**La verdad (Marino)**:

| Dato | Cifra o hecho | Página |
|---|---|---|
| Cuándo | Shock cardiogénico refractario en el que se espera que mejore la función (tras un IAM o cirugía cardíaca) o hay otra intervención planeada | p. 45 |
| Historia y valor | El más antiguo (años 60); no mejora la supervivencia, ni ninguno de los otros métodos en las comparaciones | p. 45 |
| Contraindicaciones | Insuficiencia aórtica, disección aórtica | p. 45 |
| Qué es y dónde va | Balón de poliuretano alargado; percutáneo por la arteria femoral; la punta, **justo por debajo del origen de la subclavia izquierda** | p. 45 |
| Gas y volumen | **Helio** (gas de baja densidad) de una bomba que lo infla y lo vacía; **35-40 mL** | p. 45 |
| Inflado | Al **empezar la diástole, justo tras cerrarse la aórtica**; la **onda R del ECG** es un disparo habitual | p. 45 |
| Desinflado | Al empezar la sístole, **antes de abrirse la aórtica (contracción isovolumétrica)** | p. 45 |
| Efecto 1 | Sube la presión diastólica pico → más flujo coronario (que es sobre todo diastólico); sube la PAM → más flujo sistémico | p. 45 |
| Efecto 2 | El desinflado succiona: baja la presión aórtica al abrirse la válvula → menos poscarga, más volumen sistólico | p. 45 |
| Resumen | Reduce el trabajo cardíaco al descargar el VI, y sube el flujo coronario y sistémico | p. 46 |
| Fig. 16.3 | Inflado al principio de la diástole y desinflado al final, con la curva aórtica punteada encima | p. 46 |
| Complicación principal | **Isquemia de la pierna** (trombosis en el sitio de entrada o lesión aortoilíaca). **Perder los pulsos distales sin más no obliga a retirarlo** si la función sensitiva y motora está intacta; **si se pierde, se retira de inmediato** y puede hacer falta cirugía | p. 46 |
| Otras | Septicemia, rotura del balón, neuropatía periférica, pseudoaneurisma; **fiebre en el 50 %, bacteriemia en el 15 %** | p. 47 |

**Qué se mueve y qué significa**:

| Lo que se mueve | Lo que significa | De dónde sale |
|---|---|---|
| El balón se hincha (40 mL) en la fase E del motor (cierre aórtico) | La sangre de la aorta descendente sube al cayado y las coronarias y baja a las piernas; la curva arterial hace la segunda joroba | Motor + `soporte.mjs` |
| Se vacía al empezar la fase B (contracción isovolumétrica) | La presión de la raíz cae justo antes de la eyección; la curva arterial hace la muesca y la punteada sin balón queda por encima | Ídem |
| Una chispa en la onda R del ECG de la tira y en la consola | Disparo (p. 45) | ECG del motor |
| El helio va y viene por la línea, de la consola al catéter (partículas) | El gas, no sangre, mueve el balón | Ilustrativo |
| Lectura | «40 mL · disparo onda R · pico diastólico 108 · telediastólica 52 (modelo)» | Motor |

**Piezas (Hero, ~90)**:
- **De la fuente**: balón alargado; catéter; entrada femoral; punta bajo la subclavia izquierda; aorta descendente con
  el cayado y sus tres troncos (Fig. 16.3); coronarias y flujo hacia ellas; consola-bomba con su gas; ECG con onda R;
  curva aórtica.
- **Anatomía o fisiología general (con su rótulo)**:
  - la pared aórtica en tres capas (íntima, media, adventicia) en el corte;
  - la válvula aórtica con sus tres velos, que abren y cierran con el motor;
  - los ostia coronarios;
  - la subclavia izquierda con su origen;
  - las arterias renales (para que se vea que la punta queda por encima);
  - la ilíaca y la femoral, con el pulso pedio.
- **Estructura de máquina (ilustrativa)**:
  - la consola sobre su carro: ruedas con freno, asa, pantalla en el plano de la cara frontal con la curva y el ECG, dos
    mandos moleteados, tornillos en las esquinas y placa con tres líneas;
  - la bombona de helio con su manómetro de aguja (Anatomy: «dial gauge»);
  - la línea de gas con sus abrazaderas;
  - el conector luer en la piel con el apósito.
- **Pide fuente** (no se dibuja hasta tenerla): marcador radioopaco de la punta, segunda luz con transductor de presión,
  ratio 1:2 o 1:3, ajuste del tiempo de inflado.

**Estados con nombre** (cada uno con 3-5 pasos de explicación guiada que señalan la pieza o la curva):
- `balon-inflado`: Fig. 16.3, izquierda.
- `balon-desinflado`: Fig. 16.3, derecha.
- `balon-ciclo`: el recorrido en reposo; los dos tiempos, ralentizados ×0,25, con «ralentizado» rotulado.
- `balon-contraindicado`: Joaquín, disección tipo A. El balón se dibuja en gris con el sello «contraindicado (p. 45)».
  Explica por qué no se pone, en vez de no hacer nada (G1).
- `balon-pierna`: complicación. La pierna con su pulso pedio y dos mandos («pulso», «sensibilidad y movimiento»).
  Enseña la regla de la p. 46: sin pulso pero con función sensitiva y motora, se queda; si se pierde la función, se retira.
  Es una pregunta de examen perfecta.

### 3.2 El Impella

**La frase**: *«Dentro de un catéter que cruza la válvula aórtica gira una hélice: aspira sangre del VI por la entrada y
la suelta en la aorta. Cuanto más rápido gira, más se vacía el VI (la presión de llenado baja) y más plano es el pulso.»*

**La verdad (Marino)**:

| Dato | Cifra o hecho | Página |
|---|---|---|
| Qué hace | Asistencia de flujo al gasto ventricular; sobre todo como asistencia del VI (LVAD); existe uno para el VD (RVAD) | p. 47 |
| La bomba | «Bomba **centrífuga miniatura**» (aspas rotatorias tipo hélice, flujo no pulsátil) | p. 47 |
| Por dónde | Percutáneo por una arteria femoral, avanzado hasta el VI; el **pigtail** de la punta permite avanzarlo con seguridad | p. 47 |
| Flujo | Del VI a la aorta proximal, **2,5-5,5 L/min** (según el catéter) | p. 47 |
| Modo automático | El de la Fig. 16.4 **mide el gasto nativo y ajusta solo el flujo de la bomba para un gasto total preseleccionado** | p. 47 |
| Fig. 16.4 | Punta en el VI; las hélices quedan a través de la válvula aórtica; la carcasa del motor y las flechas de flujo del VI a la aorta | p. 47 |
| Efectos | Como el IABP: descarga el VI, sube el gasto y el flujo coronario | p. 48 |
| Supervivencia | Sin ventaja sobre el IABP en el shock del infarto; más ventaja en el fallo terminal del VI (implantación larga) | p. 48 |
| Contraindicaciones | Valvulopatía aórtica o **prótesis aórtica**; **trombo en el VI** | p. 48 |
| Complicaciones | Como el IABP en tipo, pero **más sangrado mayor e isquemia de la pierna**; **hemólisis significativa 5-10 %**, más que con otros soportes | p. 48 |
| **Las fuentes discrepan** | Guía ESC de IC (en la app, `insuficiencia-cardiaca.html` l. 903): «bombas de **flujo microaxial** (hasta 4-5,5 l/min)», DanGer Shock (HR 0,74 a 180 días, más sangrado e isquemia), uso limitado a IAMCEST seleccionados | ESC |

**Qué se mueve y qué significa**:

| Lo que se mueve | Lo que significa | De dónde sale |
|---|---|---|
| La hélice gira en la carcasa; giro dibujado ralentizado (rotulado: «el real gira miles de veces más rápido»; la cifra de rpm, hueco) | Es una bomba de flujo continuo | Fuente (p. 47); la velocidad, ilustrativa |
| Partículas de sangre entran por las ventanas de la cánula en el VI y salen por las de la aorta, a un ritmo proporcional al flujo de la bomba | El VI se vacía hacia la aorta sin esperar a la sístole | Motor: `qImp` |
| El VI late más pequeño; el asa P-V se desplaza a la izquierda y la PCP baja en la tira | Descarga (p. 48) | Motor |
| La curva arterial pierde altura de pulso; con flujo alto y un VI muy débil, la aórtica deja de abrirse | Flujo continuo que sustituye al eyectado | Motor (fisiología general) |
| Consola | «Bomba 3,5 L/min · corazón 1,6 · total 5,1» | Motor |
| Mando «gasto total deseado» | La bomba sube o baja sola (p. 47) | Fuente + motor |

**Piezas (Hero, ~100)**:
- **De la fuente**: pigtail; entrada en el VI; cánula que cruza la válvula aórtica; hélice o aspas; carcasa del motor
  (Fig. 16.4); catéter hasta la femoral; flujo VI → aorta proximal.
- **Anatomía (grabado, plano «Dentro»)**:
  - el VI en corte con trabéculas y los dos músculos papilares;
  - la mitral con sus cuerdas;
  - la aórtica con sus tres velos, que **se cierran sobre la cánula** (el velo apoyado en el tubo es la imagen que hace
    entender «a través de la válvula»);
  - los senos de Valsalva y los ostia coronarios;
  - la aorta ascendente y el cayado.
- **Estructura del despiece (isométrico)**:
  - la cánula como tubo con sus ventanas de entrada (ranuras cerradas, regla de Anatomy);
  - la jaula de salida con barras;
  - la hélice con sus álabes (cuerpo de revolución con `spokes`);
  - la carcasa del motor con costuras y bandas;
  - el catéter con su trenzado (anillos que siguen la sección, nunca un trazo discontinuo);
  - el conector y el cable a la consola;
  - la consola con pantalla en su cara, mandos moleteados y placa.
- **Pide fuente** (no se dibuja ni se nombra hasta tenerla; búsqueda web verificada, REGLAS §1.9): sensor de presión,
  línea de purga con su líquido, niveles «P», señal de posición, alarma de succión, curva flujo-presión de la bomba.

**Estados con nombre**:
- `impella-bajo` (2,5 L/min) e `impella-alto` (5,5 L/min).
- `impella-total`: modo de gasto total preseleccionado.
- `impella-contraindicado`: prótesis aórtica o trombo en el VI. El sello y la razón, con el dibujo del trombo en la punta.
- `impella-hemolisis`: complicación, 5-10 %. Hematíes que se rompen al pasar por la hélice (fisiología general, rotulado)
  y el dato con su página.

### 3.3 El ECMO venoarterial

**La frase**: *«La bomba saca sangre oscura de la cava, el oxigenador la vuelve roja y la devuelve por la femoral, contra
corriente: la aorta se llena desde abajo. El cerebro y el cuerpo reciben flujo, pero el VI tiene que abrir su válvula
contra esa presión, y si no puede, se encharca el pulmón.»*

**La verdad (Marino)**:

| Dato | Cifra o hecho | Página |
|---|---|---|
| Qué hace | Soporta el flujo circulatorio **y** el intercambio de gases; el VA, en el shock cardiogénico | p. 48 |
| Ventajas | Soporte **biventricular completo** (solo igualado combinando un Impella derecho y otro izquierdo); oxigenación y eliminación de CO₂; **de elección si hay fallo respiratorio** | p. 48 |
| Cánulas | Percutáneas, arteria y vena femorales; la venosa sube por la **VCI hasta cerca de la AD** | p. 48 |
| Circuito (Fig. 16.5) | Vena femoral → **bomba centrífuga** (genera presiones y flujos) → **oxigenador de membrana** (sale CO₂, entra O₂) → **calentador a 37 °C** → arteria femoral | p. 48-49 |
| Flujo | Retrógrado por la aorta, **para llegar al cayado** y aumentar el flujo cerebral; según el gasto nativo, **hasta 5-6 L/min** = soporte completo | p. 48 |
| Anticoagulación | Completa, como en las otras formas | p. 48 |
| Complicaciones | Sangrado mayor **41 %**, sepsis **30 %**, isquemia de la pierna **17 %**, síndrome compartimental de la pierna **10 %**, ictus **6 %**, amputación **5 %** | p. 48 |
| **Poscarga del VI** | El flujo retrógrado sube la poscarga del VI; puede bajar su gasto y dar **edema agudo de pulmón** | p. 48 |
| Solución | Combinarlo con IABP o Impella, o drenar el VI para bajar su presión telediastólica («**venteo**») | p. 48-49 |
| Resultados | Supervivencia al alta del **42 %** (el mayor registro); comparaciones con IABP o LVAD inconsistentes | p. 49 |
| Elección | Según disponibilidad; de elección con fallo respiratorio; tendencia a usarlo para todo; si no hay, IABP o LVAD y traslado | p. 49 |

**Qué se mueve y qué significa**:

| Lo que se mueve | Lo que significa | De dónde sale |
|---|---|---|
| Sangre púrpura entra por la cánula de la VCI y recorre los tubos hasta la bomba, cuyo rodete gira | La bomba crea el flujo | Motor: `qEcmo` desde las venas |
| En el oxigenador, la sangre pasa del lado púrpura al rojo a través de la membrana; un hilo de CO₂ sale y uno de O₂ entra (Fig. 16.5) | Intercambio de gases | Fuente; la saturación de salida, hueco |
| El calentador con su indicador a 37 °C | p. 49 (Fig. 16.5) | Fuente |
| Sangre roja sube por la aorta **al revés**, desde la femoral hacia el cayado | Flujo retrógrado (p. 48) | Motor |
| La aórtica se abre cada vez menos; el VI se dilata; la PCP sube en la tira; aparecen gotas en el pulmón (el edema que el motor ya calcula por encima de 28 mmHg) | Poscarga del VI → edema (p. 48) | Motor (`kEdema`, `pEdema` ya existen) |
| Mando de venteo (Impella, balón o drenaje del VI) | El VI se vacía, la PCP baja y la aórtica vuelve a abrir | Motor |
| Consola | «ECMO 4,5 L/min · el VI abre 1 de cada 3 latidos · PCP 27» | Motor |

**Piezas (Hero, ~140)**:
- **De la fuente**: cánula venosa femoral hasta cerca de la AD; bomba centrífuga; oxigenador de membrana (dos lados y
  membrana); entrada de O₂ y salida de CO₂; calentador; cánula arterial femoral; flujo retrógrado al cayado.
- **Anatomía (grabado)**: VCI y AD; aorta entera del cayado a la bifurcación; ilíacas y femorales; la pierna con su pulso
  (17 % de isquemia, 10 % de compartimental); el pulmón con sus alvéolos que se llenan en el edema.
- **Estructura de máquina (isométrico)**:
  - el carro con ruedas, frenos y mástil;
  - el soporte del oxigenador con abrazaderas;
  - el rodete de la bomba (espiral, «volute» de Anatomy);
  - las conexiones con bridas;
  - los tubos con abrazaderas y una sección transparente para ver el color;
  - la consola con su lectura de flujo;
  - el mando moleteado;
  - la placa;
  - la bombona de gas con su manómetro (gas de barrido: rotulado como pieza, sin cifra).
- **Pide fuente**: gas de barrido y FiO₂ del oxigenador, rpm, presiones antes y después del oxigenador, saturación de
  salida, cánula de reperfusión de la pierna, zona de mezcla (hipoxemia diferencial). Nada de esto está en Marino.
- **Crecimiento**: el **ECMO venovenoso** del SDRA (Merino Neumología, `merino-neumologia.html` l. 1210: 10-15 % de los
  SDRA con hipoxemia refractaria) usa las mismas piezas con la cánula de retorno en una vena. Es un estado nuevo, no un
  modelo nuevo.

**Estados con nombre**:
- `ecmo-parcial` y `ecmo-completo` (5-6 L/min).
- `ecmo-aortica-cerrada`: el VI ya no abre y aparece el edema.
- `ecmo-venteo-impella`, `ecmo-venteo-balon` y `ecmo-venteo-drenaje`.
- `ecmo-complicaciones`: la pierna, el sangrado, con las cifras de la p. 48.

### 3.4 La física: los dispositivos entran en el mismo motor

Para que «cada cifra salga del modelo que mueve las piezas», los tres se añaden como elementos del circuito de
`motor.mjs`. No son sumas aparte. Va en un archivo `js/modules/eco/soporte.mjs` que el motor llama en `flujos()` y
`presiones()`, con pruebas en `pruebas/soporte.test.mjs`. Las magnitudes son ilustrativas; las direcciones y las cifras
de fuente, las de §3.1-3.3.

| Dispositivo | Cómo entra en el motor | Lo que sale solo (sin tocar cifras a mano) |
|---|---|---|
| Balón | Volumen desplazado en la aorta: `paoDist = (vao + vBalon − vuAo) / cAo`. `vBalon` sube a 35-40 mL al cerrarse la aórtica (`_aoCerro`) y baja a 0 al empezar la fase B, con rampas cortas | Pico diastólico aumentado (40 mL / cAo 1,5 ≈ +25 mmHg, que calcula el modelo), muesca presistólica, más VS si el VI eyecta contra menos. Las dos curvas de la Fig. 16.3 |
| Impella | Fuente de flujo continuo `qImp` de `vvi` a `vao`: flujo pedido (2,5-5,5 L/min) que cae si el VI se vacía (codo de colapso: ya existe `VCOLAPSO`). Modo «gasto total»: un lazo que ajusta `qImp` para que `qAo + qImp` llegue al objetivo | VI más pequeño, PTDVI y PCP más bajas, pulso más estrecho, PAM más alta. Con flujo alto y Ees baja, la aórtica deja de abrir |
| ECMO VA | Fuente `qEcmo` de `vven` a `vao` (+ saturación de salida para el DO₂: hueco, rotulado). Venteo: `qVent` de `vvi` a `vven` | PAM y DO₂ arriba, PVC abajo; la presión aórtica alta frena al VI débil: se dilata, sube la PCP y el edema del motor empieza solo. Con venteo, baja |

**Pruebas nuevas** (paciente posible en los extremos y el punto medio de cada mando, REGLAS §1.7):
- balón activado con Ees 0,3, 0,9 y 3,1;
- Impella a 2,5, 4 y 5,5 L/min con Ees 0,3 y 0,9;
- ECMO de 0 a 6 L/min con Ees 0,3, con y sin venteo.

En todos: PAM 40-130, PCP 2-35 (que no pase de la diastólica pulmonar), sin NaN, sin volúmenes negativos y la suma de
volúmenes conservada.

Nota del juez: en node, `crearMotor({ liquidoPeri: 550 })` corrido 60 s da NaN. El escenario de la app limita el derrame
a 390 mL (`DERRAME_ML_MAX`), así que no se ve. Pero el derrame de la pared libre del IAM (estado `rotura-pared`) puede
pedir más: comprobarlo en su origen.

---

## 4. El mapa de crecimiento (REGLAS §7.12)

### 4.1 Lo que cada fuente de la app aportará más adelante

| Fuente (dónde) | Qué trae | Estados, mandos o capas que añade | Notas de fuentes que ya se ven |
|---|---|---|---|
| **Marino caps. 14-17** (Merino Cardiología, `mc-*`) | El núcleo: Tabla 14.1, objetivos 14.5 / 15.6 / 16.2, vasopresores, los tres dispositivos | Todo §3 y la cobertura §4.1 | PCP 19-20 (tabla) frente a 18-20 (texto); hidrocortisona >0,25 frente a ≥0,25; vasopresina «U/h» |
| **Marino caps. 18-22** (`mc-ic-*`, `mc-diseccion-*`, `mc-paro-*`, `nep-*`) | IC aguda, disección, parada, TEP | Estados `ic-etapa-1/2/3`, `diseccion` (betabloqueo primero), `posparo`, `tep-alto` + bolo; capa ECG del corazón eléctrico; EtCO₂ en la RCP | — |
| **Marino Fundamentos** (Libros, `mar-cateter-ap`, `mar-termodilucion`, `mar-capnografia`, `mar-retorno-venoso`, `mar-respuesta-fluidos`) | El catéter de arteria pulmonar, la termodilución, la capnografía, Guyton, piernas arriba | Canal **PAP** con la maniobra de **enclavamiento** (inflar el balón del Swan y ver caer la curva a la PCP); canal **EtCO₂**; mando «piernas arriba»; curva de termodilución en la consola | Ya enlazados con el catéter vivo (`data-cateter-vivo`) y el capilar vivo |
| **Manual UMI** (Sobrevivir a la UMI: `umi-shock-septico`, `umi-vasoactivos`, `umi-hemodinamica`, `umi-posparada`) | Protocolo de sepsis de 6 h, prueba de volumen de 500 mL en 30 min con TAM y PVC a los 0, 10 y 20 min, fórmulas del Swan-Ganz | Tabla de objetivos «UMI» seleccionable; mando «prueba de volumen» con reloj de 10 y 20 min; calculadora hemodinámica que lee el monitor | **Discrepan** con Marino: ScvO₂ ≥70 % (UMI) frente a >50 % (Tabla 14.5); PVC 8-12; TAM 65-70; coeficiente 1,34 frente a 1,38-1,39 (ya anotado en la app) |
| **El Libro Azul** (Fisiopatología UCI · Cardiología: `cardio-estados-choque`, `cardio-monitorizacion-hemodinamica`, `cardio-interaccion-corazon-pulmon`, `cardio-microcirculacion`, `cardio-ventriculo-derecho`) | Disoxia (oferta, distribución, consumo), monitorización volumétrica (termodilución transpulmonar), VPP y VVS, coherencia hemodinámica, VD | Canales **VPP y VVS** en la curva arterial con ventilación; capa **microcirculación** (el capilar vivo) con «coherencia» sí o no; estados de disoxia; interacción con la PEEP (enlace al futuro pulmón con respirador) | Su nota de fidelidad sobre la RVS del distributivo y la ScvO₂ del hipovolémico |
| **Guía ESC 2026 de IC** (`ic-descompensada`, `ic-avanzada`, `ic-dispositivos`) | SCAI A-E, Shock Team, recomendaciones graduadas de soporte mecánico, INTERMACS | **Etiqueta SCAI** del estado (A en riesgo … E extremis) junto al monitor; recomendación graduada en la consola del dispositivo (I, IIa, III con su `.grade-badge`) | **Discrepan** con Marino: «microaxial» frente a «centrífuga»; «hasta 4-5,5» frente a «2,5-5,5»; el IABP no recomendado de forma no seleccionada (IABP-SHOCK II) frente a «el más disponible» |
| **Hernández 2026, shock séptico** (UCI / Papers: EGDT, LACTATE, SEPSISPAM, ANDROMEDA-SHOCK 1 y 2, CLASSIC) | Relleno capilar, objetivos de PAM, restricción de fluidos, fenotipos | Capa **piel**: el **relleno capilar** con su cronómetro; mando del objetivo de PAM 65 frente a 80-85; estado «ANDROMEDA» | Ensayo frente a texto de libro: notas de fuentes, nunca una ganadora |
| **Eco cardíaca** (atlas: `cap-hemodinamica`, `cap-vd`; VExUS; `que-mirar`) | La eco ya viva del motor | La capa corazón **es** la Circulación viva: VCI, Doppler, VExUS en el congestivo; en el ECMO, la aórtica que no abre en modo M | — |
| **Merino Neumología** (cap. 22 TEP; cap. 23 asma; SDRA) | TEP, pulso paradójico (>12 mmHg), ECMO VV | Estado `ecmo-vv`; pulso paradójico medido en la curva arterial | El pulso paradójico ya tiene una nota de fuentes en la app (`neumo-nota-pulso-paradojico-23`) |
| **PIF · Nefrología** (FRA prerrenal, ERC: escala de Mehran con «balón de contrapulsación 5 pts», TRR) | El riñón del shock y el contraste | Capa **riñón** (la nefrona viva en el estado prerrenal) que da la diuresis; enlace desde el balón a la escala de Mehran | — |
| **PIF · Hematología** (Merino HEMATO: transfusión con Hb <7 en el shock séptico; reconocimiento: 26 % de shock séptico al ingreso) | Umbrales de transfusión, epidemiología | Mando «transfundir» con su umbral por fuente; la bolsa (`core/bolsa.js`) | — |
| **Marino Abdomen** | Hepatitis isquémica tras un shock; pancreatitis como shock inflamatorio | Capa **hígado** (transaminasas >3.000 tras la hipoperfusión) en la evolución | — |
| **Inmersión viva** (ya tiene un monitor pequeño de FC y PA, `inmersion-viva-escena.js` l. 301) | — | Pasa a usar el monitor común (§4.2) | — |

### 4.2 La estructura que necesita ya desde Marino (para crecer sin rehacerse)

1. **El monitor como pieza común**: `js/core/monitor-uci.js`.
   - `crearMonitor(el, { canales, leer, objetivos, alarmas })`. Cada canal es un complemento (`ecg`, `art`, `pap`,
     `pvc`, `pleth`, `etco2`, `resp`, `consola`) que lee del motor la onda de cada 2 ms (`motor.onda`) y las cifras
     por latido (`motor.ultimo`: `pas`, `pad`, `pam`, `pvc`, `pcp`, `paps`, `papd`, `ic`, `rvs`…).
   - El ECG, de la pieza 6 de la cobertura (`js/core/ecg-trazo.js`).
   - Lo usarán la cabecera del shock, el corazón eléctrico, la inmersión viva y el futuro pulmón con respirador.
   - Lo de laboratorio (lactato, ScvO₂, gap, Hb, diuresis horaria) va en una **tira aparte con su hora**, no como canal.
2. **Los objetivos, por fuente y nunca fundidos**: `js/data/objetivos-reanimacion.js`.
   - Una tabla por fuente: `marino-14-5`, `marino-15-6`, `marino-16-2`, `umi-sepsis-6h`, `esc-scai`, `hernandez-andromeda`…
   - Cada fila con su cifra, su comparación (redondeada, REGLAS §1.10), su id de párrafo y su página.
   - Un chip en el monitor elige la tabla; si dos tablas discrepan en la fila, la celda lo dice.
   - Con soporte mecánico, la fila de PCP se suspende con «la fuente no lo dice» (G3).
3. **Los estados, como datos con sus fuentes en lista**: `js/data/shock-estados.js` (REGLAS §7.11).

   ```js
   'cardiogenico-impella': {
     motor: { escenario: 'falloVi', g: 0.8, soporte: { tipo: 'impella', flujo: 3.5 } },  // el estado ES una entrada del motor
     monitor: { canales: ['ecg', 'art', 'pap', 'pvc', 'consola'], objetivos: 'marino-16-2' },
     capas: ['monitor', 'corazon', 'lupa:impella'],
     nombre: (u) => …,                 // el nombre se decide con las cifras del motor (u.pcp, u.pam), no con un flag (G4)
     frase, guia: [ { t, senala: ['#imp-helice', 'canal:pap'], cita } ],
     fuentes: [
       { libro: 'Marino 2024', pdf: 'marino-2024-shock-caps14-17.pdf', p: 47, ficha: 'mc-soporte-mecanico', id: 'mc-impella' },
       { libro: 'Guía ESC 2026 IC', ficha: 'ic-avanzada', id: '…', nota: 'discrepan: flujo microaxial' },
     ],
   }
   ```

4. **Los pacientes, una sola lista**: `js/data/pacientes-b3.js`.
   - La de la cobertura §9 (Mateo, Amparo, Aurelio, Begoña, Nerea, Rosario, Teodoro, Hugo, Joaquín, Leandro, Consuelo),
     cada uno con su escenario del motor, su peso y su línea de tiempo (hora 0, 1, 6, día 2…).
   - La usan el monitor, los casos y «¿Qué shock es?».
5. **Escenas por capas**, cada una un módulo con `montar(el, motor) → { parar() }` (como los capítulos del atlas):

   | Capa | Pieza | Lee |
   |---|---|---|
   | 0 · Monitor | `core/monitor-uci.js` | Motor |
   | 1 · Corazón y eco | Circulación viva (3D + ecógrafo) | Motor |
   | 2 · Lupa del dispositivo | `js/modules/eco/soporte/{balon,impella,ecmo}.js` sobre `core/iso.js` | Motor + `soporte.mjs` |
   | 3 · Microcirculación | Capilar vivo | Perfusión común (cobertura, pieza 3) |
   | 4 · Órganos diana | Nefrona (diuresis), piel (relleno capilar), pierna (pulsos), pulmón (edema), hígado | Motor |
   | 5 · Tiempo | Tendencias de horas (PAM, lactato, diuresis, dosis) | La línea de tiempo del paciente |

6. **Entrada única**: `data-eco-panel="shock"` + `data-eco-escenario`, `data-eco-gravedad`, `data-eco-farmaco` y, nuevo,
   **`data-eco-soporte="balon|impella|ecmo"`**. Así las fichas `mc-soporte-mecanico` e `ic-dispositivos` (ESC) y el SDRA
   (ECMO VV) abren la lupa en su estado, con su «← VOLVER» a la ficha.

---

## 5. La versión 2 de la maqueta: qué cambiar en concreto

Orden: primero lo que arregla la queja del usuario (G1) y la verdad (G2); luego el nivel visual.

1. **El motor de verdad**. La maqueta importa `../../js/modules/eco/motor.mjs` y `escenarios.mjs` (mismo origen, ESM) y
   un borrador de `soporte.mjs` en `autonomo/maquetas/b3-shock/`.
   - Se quitan `TIPOS` (anclas) y los `clamp`.
   - Cada paciente es un escenario más su gravedad con nombre: «1.800 mL perdidos (37 %)», «Ees del VI 0,45»,
     «260 mL de derrame», «resistencia pulmonar ×6».
   - Si una cifra sale de lo humano, se busca el error en el motor (§1.7).
2. **Una pantalla para causa y efecto** (390 × 844):
   - arriba, la tira del monitor (~210 px: ECG, ART, PAP o PVC y las cifras);
   - en medio, la escena activa (~300 px): el corazón (o su sustituto en grabado mientras la maqueta no monte el 3D) o
     la lupa del dispositivo;
   - abajo, la tarjeta de la frase (sin cortar) y el dock.
   - La tira de laboratorio y las tendencias, plegables bajo la escena.
3. **El soporte siempre responde**. Al tocar un dispositivo se abre su lupa, en cualquier paciente:
   - **Aurelio**: el dispositivo funciona y la consola da sus cifras.
   - **Joaquín**: el dispositivo en gris con el sello «contraindicado: disección (p. 45)» o «valvulopatía aórtica (p. 48)».
   - **Mateo, Amparo, Consuelo**: el sello «la fuente lo reserva para el cardiogénico refractario (p. 45)».
   - Los avisos van en una tarjeta propia, nunca en la frase de 2 líneas.
4. **Las tres lupas Anatomy** de §3, con los tres planos (recorrido, dentro, despiece), la tarjeta (Fig., título, pista,
   lectura en vivo), la leyenda numerada que resalta cada pieza y una sola pieza iluminada por estado.
   - Recorrido en reposo: el ciclo del balón, el rotor que acelera de 2,5 a 5,5, el ECMO que sube de 0 a 5 L/min y la
     aórtica que deja de abrir.
5. **El monitor de UCI**:
   - escala en mmHg y línea de PAM en la arterial, con la punteada sin balón;
   - **PAP con enclavamiento** al tocar «enclavar»;
   - PVC con altura suficiente para sus ondas;
   - **capnografía**;
   - marca de disparo del balón en la onda R;
   - cifras con su caja de alarma (límites = la tabla de objetivos elegida);
   - **consola del dispositivo** con gasto nativo, flujo de la bomba y total, por separado.
6. **El estado sale de las cifras** (G4): `nombre(u)` lee el motor. «PCP baja» solo si la PCP <18; «descargado» con
   soporte; «venteado» cuando el venteo baja la PCP. Con un dispositivo, la PCP deja de marcarse en rojo (G3).
7. **El reloj del paciente**: hora 0 → 1 → 6 → día 2.
   - El lactato y la diuresis cambian con el tiempo y el tratamiento: el lactato tarda.
   - Pequeñas tendencias de PAM, lactato, diuresis y dosis.
   - El caso de Aurelio se juega en ese reloj.
8. **Objetivos por fuente**: chip «Marino · Manual UMI», con la celda que discrepa marcada (ScvO₂ >50 % frente a ≥70 %).
9. **«¿Qué shock es?» 2.0**:
   - 10 pacientes barajados (tipo × gravedad), de los 11 del bloque más gravedades distintas.
   - Tres tiempos: **cabecera** (PA, FC, SpO₂, diuresis, lactato, relleno capilar) → elige → **eco** (VCI, VI, VD,
     derrame en la Circulación viva) → confirma o cambia → **catéter** (PVC, PCP, IC, IRVS) → explica.
   - Puntúa acertar sin catéter.
10. **Mayéutica con los tres formatos y el caso entero**:
    - El caso de Aurelio:
      - hora 0: shock con PCP 14;
      - bolo hasta PCP 18-20 (p. 42);
      - noradrenalina y dobutamina;
      - Impella;
      - giro: fallo respiratorio → ECMO VA (de elección, p. 48-49);
      - segundo giro: edema por poscarga → venteo;
      - complicación: pierna sin pulso pero con sensibilidad y movimiento → no se retira (p. 46).
    - Un «encuentra el error» con el plan del residente (0-2 errores; p. ej. «ponemos el balón: tiene insuficiencia
      aórtica moderada», «el Impella da 8 L/min», «el ECMO VA baja la poscarga del VI»).
    - Un «piensa y destapa» («¿por qué el ECMO puede encharcar el pulmón? Son tres cosas»).
    - En «predice», se tapan también el dibujo y la consola.
11. **El corazón esquemático se va**: en la app, capa 1 = el corazón 3D y la eco; en la maqueta, el grabado anatómico del
    corazón eléctrico (estilo A).
    - Se quita la «vena = volumen».
    - El tabique se abomba con la presión del VD (el motor ya tiene `tabique`).
12. **Verificación al estilo Anatomy + REGLAS**:
    - Prueba `autonomo/pruebas/soporte-vivo.mjs`: cada dispositivo en cada paciente; extremos y punto medio de cada mando;
      paciente posible; frase sin cortar; desborde 0 a 390 y 360.
    - Capturas en 4 momentos de cada ciclo y a 4× de cada unión (válvula sobre la cánula, balón en la aorta, conexiones
      del ECMO), leídas por el profesor.
    - Comprobación de «líneas que acaban en nada: 0».
    - Rótulos ≥7,5 px.

---

## 6. Huecos (la fuente no lo dice; no se rellena)

1. Cuánto sube cada cifra con cada dispositivo: Marino da direcciones, no cifras. Las da el motor, rotuladas
   «ilustrativo».
2. Balón: ratio 1:2 / 1:3, errores de tiempo (inflado precoz o tardío), presión del helio, cifra del aumento diastólico.
3. Impella: rpm, niveles P, curva flujo-presión, purga, sensor y señal de posición, succión. Además, «centrífuga» frente
   a «microaxial» (las fuentes discrepan, §3.2).
4. ECMO: gas de barrido, FiO₂ del oxigenador, saturación de salida, rpm, presiones del circuito, hipoxemia diferencial,
   cánula de reperfusión distal.
5. Flujo coronario: el motor no tiene circulación coronaria. Se enseña con el pico diastólico, no con un caudal
   inventado.
6. La PCP objetivo con soporte mecánico: Marino no la da.
7. La piel (relleno capilar) en el monitor: solo Hernández 2026 (enlace, no se funde con Marino).
8. Las piezas «pide fuente» de §3: búsqueda web con URL verificada (REGLAS §1.9) o se dejan fuera.

---

## 7. Decisiones para el usuario (parada siguiente)

1. **Dónde vive el soporte**: dentro de la Circulación viva como `data-eco-soporte` (recomendado: comparte el motor y la
   eco), o un modelo propio «soporte vivo» que importe el motor.
2. **Anatomy**: solo el método con una pieza propia `core/iso.js` (recomendado) o copiar el kit MIT a `js/vendor/`
   (sería la segunda librería externa de la app).
3. **Estilo**: máquina en isométrico técnico y paciente en grabado anatómico (recomendado), o todo en grabado.
4. **Alcance de la primera entrega**: los tres dispositivos a la vez, o primero el balón (el más visual con la
   Fig. 16.3 y el que menos física nueva pide) y luego el Impella y el ECMO.
5. **Objetivos de otras fuentes** (Manual UMI, ESC) en el monitor desde ya, o cuando termine Marino.

---

## 8. Para el usuario, en llano

- **Por qué el Impella «no hacía nada».** La maqueta solo aplica el soporte en Aurelio, el del infarto. En los demás
  pacientes el aviso que lo explica quedaba cortado en la frase de abajo. Y el dibujo era un trazo quieto, tres pantallas
  más abajo.
- **El fallo de fondo.** Las cifras del monitor estaban escritas a mano. No salían del motor del corazón que ya tiene la
  app, que hoy sí llega a shock.
- **La propuesta.** El monitor y los aparatos leen el mismo motor. El balón, el Impella y el ECMO se convierten en
  objetos de verdad, como los del método Anatomy:
  - el balón se hincha justo al cerrarse la válvula aórtica;
  - la hélice del Impella aspira del ventrículo;
  - el ECMO devuelve la sangre roja contra corriente y frena al ventrículo.
- **Cifras.** Todas con su página de Marino (pp. 45-49). Lo que el libro no dice queda como hueco.
- **Para crecer.** El modelo nace preparado para el Manual UMI, El Libro Azul, la Guía ESC y Hernández. Por ejemplo,
  la ScvO₂ objetivo es >50 % en Marino y ≥70 % en el Manual UMI: el monitor enseñará las dos, sin mezclarlas.
- **Lo que decides tú** (§7): dónde vive, si copiamos el kit de Anatomy o solo su método, el estilo y por qué
  dispositivo empezamos.
