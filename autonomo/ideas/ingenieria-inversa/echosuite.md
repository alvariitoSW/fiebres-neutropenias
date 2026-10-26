# EchoSuite (echosuite.app): qué es, cómo está hecho y qué traer a la app

Investigado el 23/10/2026 con Playwright (móvil 390×844) y REA 6.7.0 (`analyze-web-bundle` sobre Chromium por CDP:
dio el mapa de módulos; el resto, leyendo su JS en memoria). No se guardó su código. Capturas en esta carpeta.

## 1. Qué es y qué ofrece
Plataforma de enseñanza de ecocardiografía transtorácica de un solo autor (Mohammed Kamareddine, MD). Gratis, sin
cuenta, en el navegador. Cuatro piezas:
- **Probe Lab** (la portada): maniquí 3D con costillas, corazón, hígado y vasos; mueves la sonda con el dedo y ves a la
  vez una **eco simulada** y un **cine clínico real** de esa vista. 15 vistas (PLAX, PSAX ×4, RV in/out, A4C/A5C/A2C/A3C,
  subcostal 4C, VCI, aorta abdominal, supraesternal). Modo Practice: tutorial de 6 pasos (deslizar, girar la marca,
  inclinar con la cola…), indicaciones en vivo («desliza hacia la cabeza y a la izquierda del paciente»), sonda
  fantasma con la posición objetivo, profundidad con su objetivo («Aim 23–25 cm»), reto «Hunt next view».
- **70 calculadoras** (en inglés), cada una con: campos con unidad y rango plausible, «?» por campo con cómo se
  adquiere (vista, fase, Doppler) y figura; resultado con grado y texto; fórmula con los números puestos; tabla de
  referencia de la guía; «How it works» con figuras animadas; «Try a worked example»; favoritos.
- **Guías** (una página de texto por calculadora y por vista, generadas del mismo catálogo) y **rutas de aprendizaje**
  (4: vistas; estenosis aórtica→continuidad; volúmenes y FEVI; corazón derecho), página **Teach** para docentes.
- **/agents/**: `llms.txt`, `llms-full.txt`, `site-index.json` y `sitemap.xml` para que buscadores e IA lo lean.

Las 70 calculadoras, por grupo:
- **Estenosis (6)**: EAo (continuidad y eco de estrés), AVM por PHT, AVM por continuidad, EM por PISA, estenosis
  tricuspídea, estenosis pulmonar.
- **Insuficiencias (6)**: IAo PISA y continuidad, IM PISA y continuidad, IT (PISA/vena contracta), IP continuidad.
- **Presiones de llenado (16)**: PAI por E/e′, PAI por velocidad de IM, volumen de AI indexado, presiones del VI, y
  12 rutas diastólicas ASE 2025: ritmo sinusal, FA, calcificación del anillo mitral, EM, IM significativa, MCH,
  restrictiva, taquicardia sinusal, eco de ejercicio, HTP, trasplante, LVAD.
- **Función ventricular (9)**: fracción de acortamiento, dimensiones lineales, grosor y masa, volúmenes, FEVI, GLS
  y su cambio seriado, VS y GC por TSVI, tamaño aórtico, índice de motilidad segmentaria (WMSI).
- **Corazón derecho y AP (10)**: PAD (VCI y venas hepáticas, con aviso de ventilación mecánica), tamaño AD, tamaño VD,
  función VD (TAPSE, S′, FAC, strain, FEVD 3D, TAPSE/PAPS), PSVD/PAPS, presiones de AP, PAP media por tiempo de
  aceleración, RVP, índice de Tei del VD, y superficie corporal.
- **Pericardio (6)**: tamaño del derrame, variación respiratoria mitral, tricuspídea y del TSVI, reversión espiratoria
  hepática, annulus reversus.
- **Shunts y congénitas (6)**: Qp/Qs, CIA, CIV, DAP, coartación, Fontan.
- **Prótesis (5)**: aórtica (EOA, DVI, mismatch), cribado de obstrucción aórtica, comparación seriada, mitral, obstrucción mitral.
- **Física (6)**: relaciones de onda, PRF y Nyquist, longitud de pulso y campo cercano, ecuación Doppler, impedancia
  acústica, Poiseuille.

## 2. Cómo está hecho
- **Tecnología**: Vite (módulos con hash en el nombre, carga diferida de figuras), JS sin framework visible, three.js
  (MIT) para el 3D, WebGL 2. Es un **port de una app nativa de iOS** (rutas `Packages/EchoAnatomyAssets/*.usdc`,
  `EchoGeometry/ProbePoses.json`; los cines dicen «transcoded for native iOS playback»).
- **Catálogo como única fuente de verdad**: un JSON con las 70 calculadoras (`id, name, category, formula, fields,
  eitherOr, reference, referenceTable`). Cada campo (362 en total: 290 numéricos, 72 de opción) lleva unidad, mínimo,
  máximo, paso, ayuda de adquisición y **reglas de visibilidad** (se muestra solo si el método elegido lo pide).
  `eitherOr` = «o la velocidad de IT o la PAPS». De ese catálogo salen la calculadora, la guía de texto, el
  `llms-full.txt` y el `site-index.json`.
- **Motor (`engine`, `diastology`)**: un `switch` por calculadora (código específico, como el nuestro). Devuelve
  `{results:[{label, value, unit, context, working}], severity:{grade, title, detail}, interpretation, table}`.
  `working` es la fórmula con los números del usuario («≈ 3,14 × 18 ÷ 80»). Detalles finos:
  - **Redondeo que nunca contradice el grado**: si 34,96 se mostraría «35» y cruzaría el umbral de 35, añade
    decimales hasta que el número mostrado caiga del mismo lado; si no puede, escribe «<35». (Es justo nuestra regla
    §7.10 y la idea pendiente de *The Heart by Ultrasound*.)
  - Validación por campo con mensajes útiles («por encima del rango plausible: revisa unidades y la coma»).
  - **Coherencia fisiológica**: si el VS del TSVD sale menor que el del TSVI, grado «indeterminado» y explica qué
    revisar; si la PAPd supera la PAPs, no calcula.
  - **Integración, no un número**: en la EAo cuenta cuántos de 5 parámetros son graves («estudio concordante» o
    «discordante»), mira el VS indexado (<35 = bajo flujo) y la FEVI, y en bajo flujo/bajo gradiente no pone «grave»:
    remite a dobutamina.
  - **Retiene resultados** si falta calidad («índices hepáticos retenidos: requiere picos S y D fiables»).
  - Plantillas de salida precalculadas por método («native example», «method = …»): parecen generadas por la app
    nativa y sirven de prueba dorada de que web e iOS dan lo mismo.
- **Gradación y fuentes**: cada calculadora cita guía, año, organización, URL al PDF, **localizador exacto** («Table 3
  · PDF p. 5; Figure 3 · PDF p. 18») y una lista de evidencias (qué afirma cada página). Guías: ASE/EACVI 2015
  cuantificación de cámaras, ASE 2017 insuficiencias nativas, EACVI/ASE 2017 EAo, ASE 2025 diastólica y HFpEF,
  ASE 2025 corazón derecho, ASE 2024 prótesis, ASE 2013 pericardio y ESC 2025 pericarditis, ASE 2019 examen TTE,
  ASE 2023 reumática, ASE 2025 strain, ACC/AHA 2025 congénitas, más estudios primarios (Nagueh 1997, Gorcsan 1991,
  Nishimura 1988) y OpenStax para la física. **Estado declarado en cada una**: 58 «localizador exacto mapeado ·
  revisión clínica pendiente», 12 «fuente mapeada · revisión pendiente». Lo dicen sin esconderlo.
- **Figuras**: SVG propios animados (`figure-playback`): barra de tiempo («Teaching timeline 1,8 s»), play/pausa,
  respeta «reducir movimiento», solo anima si se ve. Marcadas «ilustrativa · independiente de tus medidas» o
  «**Entered study**: LVOT diameter 2,00 cm» cuando **dibujan los valores que tecleaste** (el Doppler CW pinta tu
  Vmax de 4,3 m/s). Cada campo tiene un **color** (`measurement-colors`) que se repite en la figura (diámetro morado,
  ITV verde, ITV aórtica naranja). Algunas figuras incrustan un fotograma clínico real junto al esquema.
- **Simulador**: la eco simulada no es una foto: un **sombreador de fragmentos** (GLSL `bmode.frag`, ~25 KB) recorre
  un **volumen 3D etiquetado** del corazón y los vasos (256³ vóxeles empaquetados en un PNG de 16×16 cortes); cada
  tejido tiene su ecogenicidad y su textura de moteado (ruido), la sangre es negra. Anatomía del **HuBMAP / Visible
  Human** registrada; las posiciones de la sonda salen de un **solucionador de restricciones** con los «relojes» de la
  marca publicados por ASE 2019 (y dicen cuándo es convención y no guía). Los cines reales son de Wikimedia
  (CardioNetworks, CC BY-SA 3.0) y Echocardiographer.org, con ficha de procedencia por clip (licencia, hash, recorte,
  qué se modificó, revisión de privacidad de la fecha del estudio).
- **Analítica**: PostHog sin cookies, en memoria, sin perfiles, sin grabación; solo rutas y unos pocos eventos fijos
  (ejemplo resuelto, reproducir figura, «engaged»). **Nunca envía entradas, resultados ni búsquedas.** Favoritos y
  borradores, en el dispositivo.
- **Sin conexión parcial**: un *service worker* guarda hasta 64 archivos con hash (JS, CSS, figuras).
- **Licencias**: software y figuras © del autor (no reutilizables); three.js MIT; fuente Michroma OFL; anatomía y
  cines de terceros con su licencia, listadas en «About». No es dispositivo médico (lo dice en cada página).

## 3. Ellos frente a nosotros
| Aspecto | EchoSuite | HUD Clínico UCI (nosotros) |
|---|---|---|
| Para quién | Estudiantes, técnicos, cardiología | Residente de UCI, a pie de cama, en español |
| Calculadoras de eco | 70 en una biblioteca, mismo formato, grado por guía | Repartidas por fichas: FATE extendido, FS/FEVI, colapso VCI (Manual UMI), hemodinámica, VExUS (paper); sin biblioteca común |
| Fuente de cada cifra | Guía + página exacta + estado de revisión, visibles | Fuente y `#page=N` por norma (§7.2), notas de fidelidad; sin «estado de revisión» |
| Simulador | Manejo de la sonda sobre anatomía real 3D; eco por volumen etiquetado; cines reales | Fisiología: motor del latido (presiones, flujos, válvulas) que mueve la eco, modo M, Doppler, sonda libre, shock y enfermedades |
| Qué enseña el simulador | Dónde poner la sonda | Por qué la imagen y las cifras cambian (la fisiología) |
| Figuras | SVG animados con línea de tiempo, a veces con tus valores | Vista Visual, receptores animados (Motion), atlas con figuras reconstruidas |
| Preguntas | No tiene quiz ni casos | Quiz, Mayéutica (preguntas guiadas) y casos clínicos |
| Rutas de estudio | 4 rutas vista→medida→calculadora | Cuadernos de campo por fuente; enlaces cruzados |
| UCI (ventilación, shock) | Poco (aviso de VCI en VM) | Es el centro |
| Idioma / sin conexión | Inglés / caché parcial | Español / sin caché offline |

## 4. Las mejores ideas para nuestra app
1. **Redondeo que no cruza el umbral** (mostrar más decimales o «<35» antes que contradecir el grado), como función
   común en `core/ui.js` para todas las calculadoras. A pie de cama: nunca «35 mmHg · normal». Esfuerzo pequeño.
   Necesita: nada (ya es regla §7.10; falta la pieza común).
2. **Fórmula con tus números debajo de cada resultado** («VS = π × (2/2)² × 18 = 56,5 mL»). Para estudiar se ve el
   mecanismo; a pie de cama se detecta un error de unidades. Pequeño. Nada.
3. **Ayuda «¿cómo se mide?» en cada campo** (vista, fase del ciclo, dónde va el cursor, errores típicos) con un botón
   a la vista del simulador que la enseña (ya tenemos `data-eco-vista`). Medio. Necesita la fuente que lo diga
   (FATE/Manual UMI, Merino, *The Heart by Ultrasound*; la guía ASE 2019 de examen TTE si el usuario la manda).
4. **Color por medida, el mismo en el campo y en la figura** (diámetro, ITV, Vmax): conecta lo que tecleas con lo que
   ves. Pequeño-medio. Ojo §5: identidad nunca solo por color (añadir etiqueta). Decisión visual del usuario.
5. **Figuras que dibujan tus valores** («tu estudio»): el Doppler del TSVI con tu ITV, la VCI con tu diámetro y
   colapso. En nuestro caso, mejor aún: **la calculadora pone el simulador en ese estado** (motor real). Grande.
   Necesita decidir qué calculadoras y respetar «la imagen no calcula» (§5).
6. **Biblioteca de calculadoras de eco para la UCI** con un formato común (catálogo de datos en `js/data/` + cálculo
   específico por calculadora, como ya hacemos): VCI/PAD (con aviso de ventilación mecánica), VS/GC por TSVI,
   E/e′ y PAI, PSVD/PAPS, TAPSE y TAPSE/PAPS, FEVI/FS, derrame, VExUS. Estudio y pie de cama. Grande. Necesita
   fuentes PDF (guía ASE 2025 de corazón derecho, ASE 2025 diastólica, ASE/EACVI 2015 cámaras) y decisión de si es
   una puerta nueva o un cajón dentro de Eco cardíaca.
7. **Estado de revisión visible por calculadora** («cifras comprobadas con la fuente / pendiente de revisión
   clínica») y una «ficha de procedencia» por imagen (licencia, origen, qué se cambió). Encaja con nuestra
   trazabilidad; da confianza de producto serio. Pequeño. Decisión del usuario sobre el texto.
8. **Integración, no número suelto**: contar parámetros concordantes/discordantes, marcar «indeterminado» cuando lo
   medido es fisiológicamente incoherente y «retenido» si falta calidad. Lo nuestro ya tiene el aviso de
   «combinación no fisiológica»; ampliarlo a veredictos integrados. Medio. Necesita la guía que define la integración.
9. **Rutas de aprendizaje cortas** (vista → medida → calculadora → preguntas): p. ej. «Shock en eco: FATE →
   VS por TSVI → VCI → caso». Nosotros podemos cerrarlas con Mayéutica y un caso, que ellos no tienen. Medio.
   Solo usa contenido que ya está; decisión del usuario sobre dónde viven.
10. **Coaching de sonda en el simulador**: frase en vivo de qué mover («gira la marca hacia…») y una sonda fantasma
    con el objetivo, sobre nuestra sonda libre (`vistaMasParecida()` ya mide grados y mm). Medio. Nada externo.

## 5. Qué NO traer
- Su código, sus textos, sus figuras SVG y sus cines (© del autor; los cines CC BY-SA obligarían a compartir igual).
- Vite, three.js u otra librería: rompería §2 (sin build, solo Motion).
- La analítica (PostHog) y favoritos/borradores en `localStorage` sin que el usuario lo pida (§2).
- El maniquí 3D de cuerpo entero y el volumen de vóxeles: mucho peso para el móvil y otra anatomía distinta de la
  de nuestro motor; nuestra ventaja es la fisiología, no la anatomía.
- Las 70 en bloque: congénitas, prótesis, LVAD, física… no son de UCI y no tenemos sus fuentes.
- El inglés y sus valores de guía sin el PDF en `docs/` (§7.1-7.2).

## 6. Lo que no pude ver
- La eco simulada se veía en «Practice» (captura), pero no logré que «Show simulated echo» ni «Hunt next view» se
  pulsaran (botones fuera de pantalla en móvil); el reto solo lo conozco por su texto.
- La portada sin parche falla en Chromium de Playwright (no trae el códec H.264 de los cines): `cap-home.png` muestra
  ese error. Las demás capturas del laboratorio se hicieron convirtiendo los vídeos al vuelo a WebM, solo en memoria.
- No hay app nativa pública que pudiera revisar; la deduje de rutas internas.
- No revisé una a una las 70 calculadoras ni las 12 rutas diastólicas; solo EAo, PAD, función VD y ritmo sinusal.
- No sé el modelo de negocio ni el número de usuarios.

## Capturas (390×844, ×2)
cap-probe-lab-plax.png (maniquí + cine real) · cap-probe-lab-practice.png (tutorial y eco simulada) ·
cap-probe-lab-simulated.png · cap-probe-lab-hunt.png · cap-home.png (error de códec) · cap-calc-biblioteca.png ·
cap-calc-estenosis-aortica-valores.png · cap-calc-estenosis-aortica-resultado.png · cap-calc-ayuda-campo.png ·
cap-calc-how-it-works.png · cap-calc-diastolic-sinus-ejemplo.png · cap-calc-rap-ejemplo.png ·
cap-calc-rv-function-calc-ejemplo.png · cap-echo-simulator.png · cap-learn.png · cap-learn_aortic-stenosis-continuity.png ·
cap-teach.png · cap-guides.png · cap-guides_rap.png · cap-guides_views_apical-four-chamber.png · cap-agents.png ·
cap-about.png · rea-bundle.txt (salida de REA: mapa de módulos).
