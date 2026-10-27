# Bloque 3 · Marino caps. 14-22 (Shock, corazón y embolia de pulmón) · paquete

Objetivo M5 del tablero. Empieza el 21/10/2026, con los bloques 1 y 2 en main. Antes de nada, lee
`autonomo/bloques/b1/lecciones.md` y la «Parada 1» de `autonomo/bloques/b2/encargo.md` (las reglas del usuario del 20/10).

## 1. Fichas (26)

| Cap. | Fichas (`id`) | Dónde viven · clave `--ficha` |
|---|---|---|
| 14 Shock | `mc-definiciones`, `mc-vasopresores` | Merino Cardiología (`js/modules/cardiologia/merino-cardiologia.html`) · `cardiologia:merinoCardiologia:panel-merino-cardio-tabs:<id>` |
| 15 Hemorrágico | `mc-hemorragico-clasificacion`, `mc-hemorragico-fluidos`, `mc-damage-control` | ídem |
| 16 Cardiogénico | `mc-cardiogenico-fisio`, `mc-cardiogenico-farmaco`, `mc-soporte-mecanico` | ídem |
| 17 Inflamatorio | `mc-inflamacion-ros`, `mc-shock-septico`, `mc-shock-toxico`, `mc-anafilaxia` | ídem |
| 18 IC aguda | `mc-ic-tipos`, `mc-ic-manejo` | ídem |
| 19 Taquiarritmias | `mc-taqui-reconocimiento`, `mc-fa-frecuencia`, `mc-fa-cardioversion`, `mc-otras-taqui` | ídem |
| 20 SCA | `mc-sca-diagnostico`, `mc-sca-tratamiento`, `mc-diseccion-aortica` | ídem |
| 21 Parada | `mc-paro-soporte`, `mc-paro-monitorizacion`, `mc-posresucitacion` | ídem |
| 22 TEP | `neumo-ep-diagnostico`, `neumo-ep-manejo` | Merino Neumología (`js/modules/neumologia/merino-neumologia.html`) · `neumologia:merinoNeumologia:panel-merino-neumo-tabs:<id>` |

## 2. Fuentes (`docs/`)

- `marino-2024-shock-caps14-17.pdf`, `marino-2024-cardiac-disorders-caps18-21.pdf`,
  `marino-2024-respiratory-management-caps22-26.pdf` (cap. 22). Cada ficha cita su página con `#page=N`: compruébala.
- Otras fuentes de la app sobre lo mismo (Guía ESC 2026 de IC, Hernández 2026 shock séptico, El Libro Azul): solo
  enlace cruzado, nunca se mezclan (CLAUDE §2).

## 3. Modelos y piezas que ya existen

- **Circulación viva y eco** (`js/modules/eco/`, `data-eco-escenario/panel`): corazón, motor del latido, presiones,
  asa P-V, barorreflejo, Doppler; escenarios de enfermedad. Lee `js/modules/eco/CLAUDE.md`.
- **Receptores animados** (`js/modules/cardiologia/receptores-animados.js`): vasopresores e inotrópicos.
- **Capilar vivo** (sepsis, DO₂/VO₂, lactato), **río y mar** (fluidos), **vaso que sangra** (hemorragia, coagulopatía,
  plasma y crio), **telar** (cascada).
- **Piezas comunes** (`js/core/`): `mayeutica-motor.js`, `mayeutica.js` (Estudiar), `citas.js` («Ver en la ficha»),
  `explicacion-guiada.js`, `bolsa.js`, `tubo.js`, `particulas.js` + `js/data/formas-iones.js`.
- Mapa visual de Marino: `autonomo/ideas/marino.md` (B4 shock, B5 retorno venoso y monitorización, B6 el corazón enfermo).

## 4. Decisiones del usuario que aplican

- 19-20/10: modelo vivo por ficha, Mayéutica socrática + examen MIR, «Para profundizar», Texto | Estudiar.
- 20/10: cada cita lleva al párrafo de la app (REGLAS §7.9); Explorar con explicación guiada (§7.10); modelos por
  concepto y reutilizables (§7.11); solo 4-5 paradas por bloque (§2.3).

### 21/10/2026: peticiones del usuario para el bloque 3

- **Monitor de cabecera en el shock**: «deberías poner un monitor de PA, sat, ECG, respiración e incluso meter la PVC y
  poder identificar el shock con un monitor». → La cabecera del shock es un monitor de UCI con sus curvas (ECG, PA
  invasiva, pletismografía y SpO₂, respiración, PVC) y un modo «¿Qué shock es?». Pasado a la maqueta `b3-shock.html`.
- **Modelo vivo de los fármacos del shock**: «un modelo vivo con los fármacos y sus receptores que expliquen tanto su
  mecanismo de acción fácil y completamente como ver a qué receptor van y la función de cada fármaco, además de sus
  dosis y sus efectos secundarios. Esta idea dásela al profesor». → Profesor en modo diseñar (sale en
  `autonomo/bloques/b3/farmacos.md`); parte de los receptores animados que ya existen.

### Parada 1 del bloque 3 (21/10/2026): lo que dijo el usuario de las maquetas

- **Cabecera del shock**: «creo que es mejorable. Está bien como base pero hay que mejorar muchos aspectos, por ejemplo
  al darle al Impella no aparece nada; habría incluso que explicar cómo funciona un Impella con el siguiente
  repositorio de GitHub https://github.com/wheresryan22/anatomy». → El repositorio es «Anatomy» (MIT): un método y un
  kit para figuras isométricas que explican un mecanismo construyendo el objeto real, pieza a pieza («el objeto es la
  explicación»). Clon de consulta en `/tmp/ajeno/anatomy` (si no está: `git clone --depth 1` en esa carpeta); leer
  `SKILL.md`, `references/craft.md`, `kit.md`, `motion.md`, `verify.md` y los ejemplos (`examples/test-rig`,
  `raptor-engine`). Los dispositivos de soporte (Impella, balón, ECMO) se explican así, como objetos reales.
- **Corazón eléctrico y receptor vivo**: «hay que pensarlos también, como te dije ayer, como si fueran unos mega
  proyectos, que después de completar el Marino y tener la base hecha, habrá que completarlos con el resto de contenido
  de la app (Manual UMI, Libro Azul, PIF, etc.); como base está genial pero hay que subir el nivel». → REGLAS §7.12.
- Estilos sin elegir: el director toma A en los dos (receptor: grabado crema y oro; corazón eléctrico: grabado
  anatómico), coherentes con el resto de la app, y lo dirá en la parada siguiente.

### Decisiones del usuario (21/10/2026, tras los megaproyectos)

- **Kit de Anatomy: no.** «Pieza propia»: se sigue su método con código propio; la app sigue con una sola librería
  externa (Motion). La pieza de dibujo isométrico de los aparatos se escribe en `js/core/` (primero, en la maqueta).
- **Bradicardias y bloqueos AV**: «buscar guía en la web» → una guía oficial verificada (REGLAS §1.9, CLAUDE §7.2),
  con su enlace literal de los resultados de búsqueda; su PDF a `docs/` si se puede descargar.
  Localizada (21/10): **2021 ESC Guidelines on cardiac pacing and cardiac resynchronization therapy** (Eur Heart J
  2021;42:3427-3520, doi 10.1093/eurheartj/ehab364), versión en español en Rev Esp Cardiol 2022;75:370-410
  (enlace de los resultados: https://www.revespcardiol.org/en-2021-esc-guidelines-on-cardiac-articulo-S188558572200086X;
  texto completo: https://academic.oup.com/eurheartj/article/42/35/3427/6358547). La red del entorno no deja
  descargarla (403 en pmc.ncbi.nlm.nih.gov; revespcardiol.org no resuelve): pendiente de que el usuario la mande en PDF
  o abra el acceso. Sin texto leído, no se escribe nada de bloqueos AV.
- El director decide el resto: el soporte vive dentro de la circulación viva (`data-eco-soporte`); la maqueta v2 trae
  los tres aparatos; los objetivos de otras fuentes salen ya en el monitor, cada uno con su chip y su nota si
  discrepan; el corazón eléctrico es el corazón en corte con su anillo aislante y el nodo AV como torniquete.

### Decisiones del usuario (26/10/2026, sobre el informe https://claude.ai/artifact/Rw8ZKfAZdYgjBogGxuCP9w)

- **Maquetas v2**: «están muy muy bien, pero se tienen que mejorar más, hay fallitos y partes que se pueden mejorar
  muchísimo». → **Maquetas v3** antes de llevar nada a la app: el profesor (Fable) las juzga a fondo con capturas
  (fallos y mejoras, sin cerrar la lista a la de `juicio-maquetas-v2.md`); un constructor por maqueta las arregla.
- **Pulmón con respirador: fusionado con el bloque 3** (el director avisó de que salen 47 fichas en una sola PR y menos
  paradas; el usuario decidió). El bloque 3 pasa a ser **Marino caps. 14-30**: las 26 fichas de §1 + las 21 de Merino
  Neumología de los caps. 23-30 (`neumo-asma-epoc-basicos`, `neumo-asma-agudo`, `neumo-epoc-vpp`,
  `neumo-sdra-diagnostico`, `neumo-sdra-no-ventilatorio`, `neumo-sdra-ventilacion`, `neumo-o2-indicaciones`,
  `neumo-o2-sistemas`, `neumo-o2-toxicidad`, `neumo-vni-metodos`, `neumo-vni-uso`, `neumo-vm-modos`, `neumo-vm-ajuste`,
  `neumo-vias-artificiales`, `neumo-cuidado-barotrauma`, `neumo-peep-oculta`, `neumo-nav-prevencion`,
  `neumo-nav-diagnostico`, `neumo-derrame-antimicrobiano`, `neumo-sbt`, `neumo-weaning-extubacion`), sub-bloque **3D ·
  El pulmón con respirador**. Fuentes: `docs/marino-2024-respiratory-management-caps22-26.pdf` y el PDF de los caps.
  27-30 que haya en `docs/` (comprobarlo). La maqueta M3 (`autonomo/ideas/marino.md` §4.1 y §7) entra en la tanda de
  maquetas v3, sobre `autonomo/maquetas/comun/monitor.js`. La presión intratorácica (M8) se hace una vez para CPAP y
  respirador. Falta la cobertura del 3D (profesor, Fable).
- **Paradas del bloque fusionado**: 1) maquetas v3 (shock, corazón eléctrico, receptor y pulmón); 2) el primer modelo
  en la app; 3) el bloque entero; 4-5) los cambios que pida.
- **Modelos**: Fable (`model: "fable"`) **solo para pensar** (profesor, cobertura) y **para medir**: el primer
  constructor pesado va en Fable y se compara con `gasto.mjs` (pasos, vueltas, gasto) frente a los de Opus; con ese
  dato se decide el resto. Todo lo que copia algo hecho, barato.
- **Guía ESC 2021 de estimulación cardiaca**: el usuario pide que la busque el director. Copia CC BY localizada en HAL
  (hal-amu.archives-ouvertes.fr/hal-03654607) y en Leiden; la red del entorno rechaza academic.oup.com, escardio.org,
  europepmc.org, pmc.ncbi.nlm.nih.gov, revespcardiol.org, hal-amu.archives-ouvertes.fr y
  scholarlypublications.universiteitleiden.nl (26/10). Descargada el 26/10 desde Leiden (`scholarlypublications.universiteitleiden.nl/handle/1887/3279749`, versión del editor):
  `docs/esc-2021-estimulacion-cardiaca.pdf` (95 páginas, 4,6 MB, título en la p. 1 del PDF; Eur Heart J 2021;42(35):3427-3520,
  doi 10.1093/eurheartj/ehab364). Licencia que da el repositorio: **CC BY 4.0**. Desplazamiento: la p. 1 del PDF es una portada de
  Leiden; el resto va con la numeración 1-94 de la prueba del editor (cabecera «European Heart Journal (2021) 00, 1-94»), no con
  3427…: **página del PDF = página impresa + 1** (equivale a 3426 + n en la revista). Índice de páginas impresas (PDF = +1):
  5.1 enfermedad del nodo sinusal p. 21 (PDF 22), con modo de estimulación p. 22; 5.2 bloqueo AV p. 24 (PDF 25), con
  recomendaciones de estimulación en BAV p. 25; 5.3 trastornos de conducción sin BAV (bloqueos de rama) p. 26-27 (PDF 27-28);
  5.4 síncope reflejo p. 28 (PDF 29). Índice del libro en las PDF 4-5. Comprobado solo con los números de página de las cabeceras;
  las páginas exactas de cada tabla de recomendaciones se confirman al leerlas.

## 5. Pasos

| Paso | Quién | Sale en | Estado |
|---|---|---|---|
| 1 · Cobertura | profesor (modo cobertura) | `autonomo/bloques/b3/cobertura.md` | hecha (≈92 %) |
| 2 · Maquetas (parada 1) | constructor potente | `autonomo/maquetas/b3-*.html` | v1 hecha; el usuario pide subir el nivel: v2 en curso (`megaproyecto-*.md`) |
| 3 · Modelos en la app (parada 2: el primero nuevo) | constructor potente | rama `auto/b3` | pendiente |
| 4 · Estudio en las 26 fichas | constructor, por grupos | rama `auto/b3` | pendiente |
| 5 · Jueces, auditor y profesor (parada 3) | — | `autonomo/bloques/b3/*.md`, una sola PR | pendiente |

## 6. Pacientes del bloque

Los fija la cobertura. No repetir: Andrés (62), la Sra. R. (64), Fermín (71), Rocío (67), Gonzalo (66), Inés (41),
Salvador (47).

**Decisión del usuario (25/10/2026)**: el caso de Aurelio es el de la maqueta (fallo respiratorio → ECMO). La rotura
del papilar (Marino cap. 16, p. 38: con la del septo y la de pared libre, en las primeras 24 h) **se enseña entera**,
como pide la fuente: estado `rotura-papilar` del modelo M7 (IM aguda con `eroaMitral` y el chorro en color, sub-bloque
3B), paso «predice» de la ficha `mc-cardiogenico-fisio` y un caso corto propio (paciente distinto de Aurelio).

### Decisiones del usuario (26/10/2026, sobre las maquetas v3, https://claude.ai/artifact/BLVPCGzFXLYnXKqoLjBGK6)

- **Límites de lo interactivo** (vio el shock): «he llegado a infundir hasta 23 litros de suero. Creo que debería poner
  unos límites […] no puedo poner ciertas cosas ilimitadamente, o si pongo ciertas cosas, pasa esto. Hay que definir muy
  bien los límites de las partes interactivas para que no pierdan la seriedad ni la garantía de fidelidad de los
  textos. No he visto el resto, pero supongo que también habrá cosas parecidas, hay que revisarlo». → **Vuelta de
  límites en las cuatro maquetas** antes de la parada 2: cada mando (volumen, fármacos y dosis, aparatos, reloj,
  respirador, gravedad…) con su tope y su consecuencia visible al acercarse o pasarse (p. ej. sueros: la PVC y la PCP
  suben, edema, la SpO₂ cae, sello «sobrecarga»; dosis por encima de la ficha: aviso con la dosis de la ficha), cada tope
  con su origen (`ficha` con página, `fisiología general` o `ilustrativo`). Primero el profesor (Fable) hace la tabla
  de límites de todos los mandos de las cuatro (`autonomo/bloques/b3/limites.md`) y la pieza común si hace falta
  (`comun/`); después un constructor barato por maqueta; la prueba de cada maqueta lleva todos los mandos a su tope.
  Que sirva para el resto de modelos (propuesta de regla en el parte).
- **Neumotórax a tensión**: sí, como escena aparte del pulmón con respirador.
- **Pulmón, esquema o dibujo real**: lo revisa el usuario (pendiente).
- **Shock, corazón eléctrico y receptor a la app**: todavía no; antes, la vuelta de límites.

### Decisiones del usuario (26/10/2026, tras ver el pulmón): pantallas como las reales

El usuario mandó dos fotos de la UCI (un respirador y la consola de un balón de contrapulsación) y pide: «adaptar el
modelo vivo del respirador a cómo se ve un monitor en la vida real, para estar familiarizado con el modelo y con el
uso. Lo del pulmón me parece cojonudo, pero lo podemos mejorar muchísimo más y profesionalizarlo». Lo mismo vale para
la consola del balón en el shock. **Las fotos no se suben al repositorio** (salen personal y el brazo de un paciente):
esta descripción las sustituye. **Nada de marcas ni logotipos**: se recrea la disposición y las convenciones de
uso de una pantalla real, con aspecto propio (CLAUDE §7.9).

**1. Pantalla de respirador** (maqueta `b3-pulmon`; foto: un respirador de UCI de gama alta en modo VC-MMV).
- **Fondo claro** de pantalla médica (gris muy claro o blanco), curvas con **área rellena** azul oscuro, unidades en
  **mbar** (con nota: 1 mbar ≈ 1 cmH₂O; el Marino usa cmH₂O).
- **Barra de arriba**: icono de adulto, **modo** grande («VC-AC», «PC-AC», «VC-SIMV», «SPN-CPAP/PS»…), interfaz
  («Tubo» o «VNI»), hora, red/batería y volumen de alarma.
- **Izquierda, curvas apiladas**: Paw (escala −10 a 60 mbar, con la **línea roja del límite Pmáx** y una punteada),
  Flujo (−100 a 100 L/min, relleno por encima y por debajo de cero) y una tercera elegible (volumen, o tendencia de
  2 h). Bajo la Paw, un **marcador triangular con un pulmón** en cada respiración que dispara el paciente. Rótulos
  informativos como banda («La compensación de fugas está activa»).
- **Derecha, casillas de valores medidos** en dos columnas, nombre y unidad arriba a la izquierda, cifra grande abajo
  a la derecha, límites de alarma pequeños al lado: FiO₂ (Vol%), Pmedia, EIP (presión al final de la inspiración =
  meseta: vacía si no hay pausa), PEEP, FRmand, FRtrig, FR, FRespon, VTe mand, VTe espon, VMe, VMe espon.
- **Abajo, mandos redondos** (círculo azul con la cifra y el nombre debajo; se tocan para cambiarlos): FiO₂, VT, Ti,
  FR, PEEP, ΔPsop (presión de soporte), Rampa, Flujo, Pmáx. **Pestañas de modo** en la franja inferior (VC-AC, VC-SIMV,
  SPN-CPAP/PS, PC-AC, Otros modos) y botón «Detener ventilación».
- **Columna derecha de teclas**: Alarmas, Vistas, Tendencias, Sensores, Procedimientos; y las maniobras **«Insp.
  mantenida»** (= pausa inspiratoria → EIP/meseta) y **«Espiración mantenida»** (= oclusión espiratoria → PEEP
  intrínseca), Congelar curvas, O₂/succión, Nebulización. Así el residente aprende dónde están en el aparato.
- El pulmón (racimo, tórax) se queda como **lupa** al lado o debajo de la pantalla; la pantalla es lo primero.
- **Alarmas reales**: al pasar un límite (Pmáx, VMe alto o bajo, FR alta), la casilla se pone en rojo y suena (sin
  sonido de verdad: icono) en la barra de arriba con su texto. Encaja con la vuelta de límites.

**2. Consola del balón de contrapulsación** (maqueta `b3-shock`, aparato «balón»; foto: una consola de balón con
pantalla arriba y panel táctil abajo).
- **Pantalla oscura**, tres trazados: **ECG** verde (derivación, «Disparo: ECG», con **marcas de inflado** bajo cada
  latido), **presión arterial** roja (sistólica/diastólica y media entre paréntesis, p. ej. 121/52 (102)) con el
  **pico de aumento diastólico** tras la muesca, y **presión del balón** azul (meseta de inflado, caída al desinflar).
- Cifras: FC, presión, **«Aumento»** (presión diastólica aumentada, mayor que la sistólica del paciente: en la foto
  131 frente a 121) con barra, **frecuencia del balón 1:1** (y 1:2, 1:3), «Alarma aumento», baterías y **bombona de helio**.
- **Panel táctil**: Automático / Semiautomático, **Disparo** (ECG, Presión, Marcapasos, Interno), Frecuencia del balón,
  **Aumento** (máx. con flechas), **Temporización** inflado y desinflado (flechas), Espera / Inicio, Llenado.
- Lo que enseña: el aumento diastólico, la bajada de la presión al final de la diástole (menos poscarga), y la
  **frecuencia 1:2** para ver latido asistido frente a no asistido. Los errores de temporización (inflar pronto o
  tarde) **solo con fuente**: el Marino (cap. 16) no los trae; si no hay otra fuente en `docs/`, es hueco (no se inventa).

**Cómo**: después de la vuelta de límites (que toca los mismos archivos). Profesor (Fable) en modo diseñar → plan
corto de las dos pantallas (qué cifras salen del modelo, qué es interfaz `ilustrativo`); constructor potente para la
pantalla del respirador (pieza nueva, reutilizable para la VNI y el weaning: `comun/respirador.js`) y constructor barato
para la consola del balón copiando el patrón. Presupuestos según REGLAS §4.7.

### Decisiones del usuario (27/10/2026, sobre las pantallas como las reales)

- **Pantallas del respirador y del balón: aprobadas** («se parece bastante, en principio no cambiaría nada»). Entran en
  `main` como maquetas; lo que haya que pulir, en otra sesión.
- **Errores de temporización del balón**: buscar bibliografía (inflado y desinflado precoz o tardío), comprobar las
  citas y subir la fuente a `docs/`; con fuente, se construyen en la consola.
- **Sí a todo lo pendiente de la parada 1**: shock, corazón eléctrico y receptor **pasan a la app** (parada 2); en el
  receptor, el deslizador sigue encendido con el sello (para poder bajar la dosis); el esquema del pulmón vale.
