# Historial · Cardiología: guía ESC 2026 de IC y Merino Cardiología

> Texto movido tal cual desde el antiguo `CLAUDE.md` (octubre 2026). Es la historia de cómo se construyó
> esta parte: decisiones, fuentes, auditorías y verificaciones. Las reglas vigentes están en `CLAUDE.md`.

### Cardiología

Quinta especialidad del menú raíz (`#btn-cardiologia`, junto a Hematología,
Nefrología, UCI/Papers Tuiter y Fisiopatología UCI) — deliberadamente
**distinta** del bloque "Cardiología" ya existente dentro de Fisiopatología
UCI: aquel es fisiopatología pura (capítulos de El Libro Azul, sin
recomendaciones de tratamiento), mientras que esta especialidad nueva es
**guías de práctica clínica de manejo** (recomendaciones graduadas Clase
I-III / Nivel A-C, dosis de fármacos, algoritmos terapéuticos) — la misma
distinción que ya existe entre Nefrología (KDIGO, HTA, FRA: manejo clínico)
y el bloque "Vías Urinarias" de Fisiopatología UCI (mismo Libro Azul,
fisiología pura): nunca se fusionaron esos dos, y forzar esta guía dentro
del bloque de fisiopatología habría repetido el mismo error ya descartado
explícitamente para Nefrología. Antes de tocar el repositorio se publicó
una propuesta como Artifact (arquitectura, plan de fichas, tratamiento del
contenido) y se confirmó con `AskUserQuestion` tanto la arquitectura de
especialidad nueva como el ritmo de construcción (empezar ya con la Parte 1
en vez de esperar a la Parte 2 completa).

Mismo patrón de dos niveles que UCI/Papers Tuiter y Fisiopatología UCI: un
**submenú de guías** (`#cardiologia-menu-view`/
`js/modules/cardiologia/cardiologia-menu.html`, con
`.btn-volver-especialidades`) del que cuelga un botón por guía, y la
**vista propia de cada guía** con su propio cuaderno de campo. El switcher
`cardioLevel` vive en `js/modules/cardiologia/index.js`
(`createViewSwitcher({ menu, insuficienciaCardiaca })`) — mismo motivo que
el resto de especialidades con submenú interno: la vista raíz
`#cardiologia-view` (registrada en el `topLevel` de `home/index.js`) es
solo el contenedor exterior. Al volver a "Cardiología" desde
Especialidades, `cardiologia.init()` devuelve `{ volverAlMenu, irAFicha }`,
inyectado perezosamente en `home/index.js` (`onCardiologiaListo`, mismo
patrón que `onNefrologiaListo`/`onUciPapersListo`/`onFisioUciListo`) para
dejar siempre el submenú de guías como pantalla de entrada. Añadir una guía
nueva en el futuro: 1) botón nuevo en `cardiologia-menu.html`, 2) su propio
`<guia>.html` con `.btn-volver-cardio-menu`, 3) registrarlo en `index.html`
dentro de `#cardiologia-view` y en el switcher `cardioLevel` de
`cardiologia/index.js`.

- **Primera guía: "Insuficiencia Cardíaca (ESC 2026)"**
  (`js/modules/cardiologia/insuficiencia-cardiaca.html`). Fuente: 2026 ESC
  Guidelines for the management of heart failure. Developed by the Task
  Force for the management of heart failure of the European Society of
  Cardiology (ESC). Eur Heart J. 2026;00:1-112 — la actualización oficial
  que sustituye a la guía de 2021, enviada por el usuario en 2 partes
  (Parte 1: 56 págs., secciones 1-8, hasta soporte circulatorio mecánico
  durable; Parte 2 pendiente de envío, cubrirá previsiblemente las
  secciones 9-19: comorbilidades, manejo multidisciplinar y condiciones
  específicas). Con la Parte 1 ya se construyó un **cuaderno de campo de 7
  fichas** (`#cardio-ic-corkboard`/`#panel-cardio-ic-tabs`, mismo
  `core/corkboard.js` de siempre, sin calculadoras propias en este primer
  pase — `insuficiencia-cardiaca.js` solo llama a `initCorkboard(...)`),
  correspondencia 1:1 con las secciones numeradas de la propia guía (mismo
  patrón ya usado en ERC/FRA/HTA/Vías Urinarias): Definición, epidemiología
  y clasificaciones (nueva nomenclatura FMT/AMT/GDIT, eliminación del
  HFmrEF, reclasificación HFrEF/HFpEF en el corte del 50%, estadios A-D),
  Prevención de la IC (estadio A/B, factores de riesgo cardiometabólicos,
  puntuaciones de riesgo, poblaciones específicas), Diagnóstico de la IC
  crónica (péptidos natriuréticos con cortes ajustados por edad, algoritmo
  diagnóstico, fenotipos por FEVI, evaluación multiparamétrica de la
  etiología), Terapia farmacológica de la IC crónica (los 4 pilares del
  FMT, terapia adicional, Tabla 11 de dosis completa), Terapia
  intervencionista dirigida por guía (DAI, TRC con el algoritmo de
  indicaciones por QRS/morfología, estimulación del sistema de conducción),
  IC descompensada (las 4 categorías clínicas, clasificación SCAI del shock
  cardiogénico, las 3 fases del manejo hospitalario, algoritmo de
  descongestión guiado por Na⁺ urinario, soporte circulatorio temporal), e
  IC avanzada (criterios de definición, triaje "Rule of three"/"I NEED
  HELP", clasificación INTERMACS, soporte circulatorio temporal/durable —
  cierra con trasplante cardíaco y cuidados de fin de vida pendientes de la
  Parte 2).
  - **Grados de recomendación en toda la ficha**: nueva variante
    `.grade-badge.yellow` en `components.css` (reutilizando
    `--accent-yellow`, mismo criterio ya aplicado en ERC de colapsar un
    mapa de 4 niveles en las 3 clases de color ya disponibles en vez de
    inventar un token nuevo) — Clase I en verde (clase base ya existente),
    Clase IIa/IIb en amarillo (distinguidas por el propio texto del
    badge), Clase III en rojo (`.grade-badge.red`, ya existente). Cada
    recomendación clave de la guía real se reprodujo con su Clase y Nivel
    de evidencia exactos citados entre corchetes tras el texto.
  - **Tablas y figuras**: ninguna figura de la Parte 1 es una fotografía
    clínica genuina — todas son flujogramas/tablas reconstruibles
    fielmente, así que se recrearon íntegras como `.data-table` y
    secuencias `kv-row`/`micro-prof-item` (algoritmo diagnóstico Fig. 4,
    fases de manejo de IC descompensada Fig. 12-13, algoritmo de
    diuréticos guiado por Na⁺ urinario Fig. 15, clasificación INTERMACS
    Fig. 17, algoritmo de decisión de soporte circulatorio Fig. 18), mismo
    criterio ya aplicado en KDIGO/HTA/FRA — nunca se incrusta como imagen
    lo que se puede tabular.
  - **56 preguntas de quiz** (`js/data/insuficiencia-cardiaca-preguntas.js`,
    `ic-q001`-`q056`, 8 por ficha × 7 fichas — 6 de opción múltiple + 2 de
    tipo `redactar` por ficha, mismo formato ya establecido en
    Fisiopatología UCI/UCI Papers Tuiter). `triggerId:
    'btn-cardio-ic-repasar'`, exportado junto a `quizBanco`/`quizTemas`
    desde `cardiologia/index.js` y fusionado en la única llamada a
    `initQuiz()` de `main.js`, igual que el resto de especialidades — el
    menú del quiz gana una 5ª asignatura ("Cardiología") en su nivel 0. El
    banco combinado de toda la app queda en <strong>1173
    preguntas</strong> (1117 previas + 56).
  - **Sin calculadoras en este primer pase** — a diferencia de otros
    bloques de manejo clínico (ERC/FRA/HTA), esta primera construcción se
    limitó a transcribir fielmente el contenido de la Parte 1 sin diseñar
    interactividad nueva; candidatas ya identificadas para rondas futuras:
    umbral de NT-proBNP ajustado por edad, el algoritmo de descongestión
    guiado por Na⁺ urinario como flujograma interactivo (en la línea del ya
    construido para el citrato en TRR continua), y selectores explicativos
    (no numéricos) para SCAI/INTERMACS.
  - **Cross-links pendientes, identificados pero no resueltos todavía**:
    shock cardiogénico ↔ Ficha 10 de Cardiología/Fisiopatología UCI
    (fisiopatología de los estados de choque — complementarios, sin
    solape); SGLT2i en IC ↔ Ficha 6 de ERC/Nefrología (mismo fármaco,
    indicación distinta); TRR en IC avanzada ↔ módulo TRR de Nefrología.
  - Verificado con Playwright: las 7 fichas abren/voltean sin error de
    consola ni 404 real; los `.grade-badge` (verde/amarillo/rojo) se
    detectan correctamente en cada ficha con contenido de recomendaciones;
    el menú del quiz en 3 niveles muestra "Cardiología (56)" → "Insuficiencia
    Cardíaca (ESC 2026) (56)" → las 7 fichas con 8 preguntas cada una, y un
    recorrido completo de las 56 preguntas (incluidas las 14 de redactar)
    no generó ninguna excepción JS; sin overflow horizontal a 390px. Bump
    de cache-busting (`?v=20260828`) por el cambio en `components.css`
    (`.grade-badge.yellow`).
  - **Parte 2 recibida e incorporada** ("continúa con la 2° parte"): antes
    de escribir nada se releyeron las 56 páginas completas de la Parte 2 —
    un primer intento de lectura en un único lote de 20 páginas perdió
    silenciosamente el contenido de 16 de ellas (mostradas como "media
    removed: request limit" sin imagen real, un límite del propio tool de
    lectura de PDF con muchas páginas de una vez, no un error del PDF) —
    detectado al notar que esas páginas nunca llegaron a renderizarse como
    imagen, y corregido releyendo esas 16 páginas en lotes más pequeños
    (6-8 páginas) antes de dar la lectura por completa. **Lección para el
    futuro**: con PDFs largos, si un lote grande devuelve menos imágenes
    "output_image" que páginas pedidas, no asumir que el resto era texto
    sin figuras — releer el resto en lotes más pequeños hasta confirmar
    que se ha visto contenido real de cada página.
    - **Ficha VII (IC avanzada) ampliada**, no duplicada en una ficha
      nueva — la Parte 1 ya había construido la mayor parte de la sección
      8 (criterios, triaje, MCS temporal/durable) dejando explícitamente
      pendientes las subsecciones 8.2.3 (trasplante cardíaco) y 8.2.4
      (control de síntomas y fin de vida), que llegan al principio mismo
      de la Parte 2 — se añadieron ahí, no como ficha aparte, siguiendo el
      mismo criterio de correspondencia 1:1 sección↔ficha ya usado en el
      resto del cuaderno. Contenido nuevo: Tabla 16 (indicaciones/
      contraindicaciones de LVAD, con la lista completa de contraindicaciones
      absolutas/relativas), Tabla 17 (indicaciones/contraindicaciones de
      trasplante cardíaco), supervivencia post-trasplante (80-90% al año,
      mediana ~12,5 años), el desafío central del equilibrio
      inmunosupresión-efectos secundarios, los programas de donación tras
      muerte circulatoria (DCD) como vía real de aumento de donantes,
      consideraciones de edad/complejidad quirúrgica, planificación de
      cuidados avanzados (qué es, qué debe documentar), cuidados
      paliativos integrados a lo largo de toda la trayectoria (no solo al
      final), y la retirada de MCS por decisión del paciente. 6 preguntas
      de quiz nuevas (`ic-q057`-`q062`), llevando el tema de IC avanzada a
      14 preguntas — único tema del cuaderno que rompe el baseline de 8,
      justificado por el volumen real de contenido añadido.
    - **4 fichas nuevas** (Ficha VIII-XI), correspondencia 1:1 con las
      secciones 9-12 de la guía, mismo patrón que las 7 de la Parte 1:
      - **Ficha VIII — Comorbilidades cardiovasculares** (sec. 9): FA
        (prevalencia, identificación de desencadenantes, CHA₂DS₂-VA
        actualizado sin el criterio de sexo femenino —Tabla 18—,
        anticoagulación obligatoria en HCM/amiloidosis independientemente
        de la puntuación, DOAC sobre AVK, control de frecuencia/ritmo,
        ablación de nodo AV+TRC vs. ablación con catéter de la propia FA),
        arritmias ventriculares y bradiarritmias, cardiopatía coronaria
        crónica (revascularización, el algoritmo de manejo de la Figura 19
        recreado como secuencia de decisión en vez de imagen, y la
        discrepancia de grado reconocida por el propio Task Force frente a
        las guías 2024 de SCC), y valvulopatía (estenosis/insuficiencia
        aórtica, insuficiencia mitral primaria/secundaria con la nueva
        clasificación atrial vs. ventricular, insuficiencia tricuspídea),
        hipertensión, e ictus.
      - **Ficha IX — Comorbilidades no cardiovasculares** (sec. 10):
        obesidad (semaglutida/tirzepatida, cirugía bariátrica), diabetes
        (iSGLT2 universal, metformina, insulina, iDPP-4/glitazonas
        contraindicadas), ERC (caída transitoria de FGe esperable y no
        motivo de retirada precoz del fármaco), ferropenia/anemia (la
        propia guía reconoce que la definición clásica por ferritina no
        identifica bien a los pacientes, con una definición alternativa
        por TSAT&lt;20% propuesta), cáncer, enfermedad pulmonar y
        trastornos del sueño (ASV contraindicada en CSA predominante por
        SERVE-HF), ansiedad/depresión/deterioro cognitivo, fragilidad, y
        otras comorbilidades (infecciones, vacunación, tiroides,
        hiperuricemia, disfunción eréctil).
      - **Ficha X — Manejo multidisciplinar y seguimiento** (sec. 11):
        el equipo HF-MDT (Figura 21 recreada como texto — núcleo +
        miembros ampliados), educación/autocuidado, implementación y
        adherencia (papel de enfermería y farmacia especializadas),
        entrenamiento físico/rehabilitación cardíaca (modelo FITT,
        seguridad/contraindicaciones), telemonitorización (no invasiva vs.
        basada en dispositivo vs. hemodinámica invasiva por presión de
        arteria pulmonar), seguimiento a largo plazo (Figura 22, intervalos
        por estadio A-D), y planificación de cuidados avanzados/paliativos
        — con un cross-link interno real (`.tx-link`) hacia la Ficha VII,
        que es donde vive el desarrollo completo de fin de vida, en vez de
        duplicar el contenido.
      - **Ficha XI — Condiciones específicas** (sec. 12): embarazo
        (fármacos contraindicados, cambio a betabloqueante beta1-selectivo),
        miocardiopatías (remite a las guías 2023 de miocardiopatías),
        amiloidosis cardíaca (Tabla 20 de banderas rojas TTR/AL, el
        algoritmo diagnóstico de la Figura 23 recreado como secuencia de
        texto en vez de imagen, AL-CA vs. ATTR-CA con los 4 fármacos reales
        —tafamidis/acoramidis/vutrisiran— y sus ensayos pivotales
        ATTR-ACT/ATTRibute-CM/HELIOS-B, manejo de comorbilidades CV en CA),
        miocarditis (criterios de alto riesgo, remite a las guías 2025 de
        miocarditis/pericarditis), y cardiopatía congénita del adulto —
        cierra con una lista de las 9 guías ESC complementarias citadas a
        lo largo de la sección, para que quede claro qué remite a dónde.
      - **2 figuras (19 y 23) recreadas como secuencias de texto
        (`micro-prof-item`) en vez de imágenes**: ambas son flujogramas
        nativos de la propia guía (no fotografías ni diagramas complejos
        no verificables), así que se recrearon fielmente como texto
        siguiendo el mismo criterio ya establecido en el resto del
        proyecto (KDIGO, HTA, FRA) de nunca incrustar como imagen lo que
        se puede reconstruir con exactitud — un primer borrador sí dejó
        `&lt;img&gt;` apuntando a archivos inexistentes (`fig19-...png`/
        `fig23-...png`) con un `onerror` para ocultarlos silenciosamente
        si fallaban; detectado y corregido antes de la verificación con
        Playwright, sustituyendo ambos bloques por la secuencia de texto
        completa.
    - **38 preguntas de quiz nuevas** en total (`ic-q057`-`q094`: 6 de la
      ampliación de Ficha VII + 8×4 de las fichas nuevas), llevando el
      banco de "Insuficiencia Cardíaca" a 94 preguntas. El banco combinado
      de toda la app queda en <strong>1211 preguntas</strong> (1173 previas
      + 38).
    - La cabecera de la ficha y la tarjeta de bibliografía general se
      actualizaron para reflejar que la guía ya está completa
      (secciones 1-14), sin la coletilla de "Parte 2 pendiente".
    - Verificado con Playwright: las 11 fichas del corkboard abren/voltean
      sin error de consola ni 404 real; los `.grade-badge` se detectan en
      las 4 fichas nuevas y en la Ficha VII ampliada; el cross-link interno
      Ficha X→Ficha VII funciona; el menú del quiz en 3 niveles muestra
      "Cardiología (94)" → "Insuficiencia Cardíaca (ESC 2026) (94)" → las
      11 fichas con sus recuentos reales (8×10 + 14 en IC avanzada), y un
      recorrido completo de las 94 preguntas no generó ninguna excepción
      JS; sin overflow horizontal a 390px en ninguna de las 4 fichas
      nuevas ni en la Ficha VII ampliada.
  - **Auditoría de contenido de la Parte 1 y correcciones aplicadas**, a
    petición explícita del usuario ("haz un informe sobre el contenido de
    la parte 1 de la guía de cardiología sobre los errores, faltas de
    contenido y mejoras"). Releídas de nuevo las 56 páginas de la Parte 1
    y comparadas frase a frase contra las 7 fichas que se construyeron a
    partir de ella (I-VII), mismo método de auditoría ya establecido en el
    resto del proyecto (Nefrología/HTA/ERC/FRA). Publicado un informe como
    Artifact (errores confirmados/huecos de contenido/mejoras menores por
    ficha), corregido en su totalidad tras la instrucción explícita del
    usuario de "primero implementa todas las cosas del informe de
    auditoría y después ya vemos que pasa con las imágenes":
    - **Error real confirmado en la Ficha VI** (`ic-descompensada`): el
      texto tenía invertido el sentido del umbral de descarte de
      NT-proBNP del algoritmo diagnóstico (Figura 11) — decía
      "NT-proBNP ≥300 pg/ml (umbral... para descarte...)", cuando en
      realidad es &lt;300 pg/ml el que descarta la IC descompensada;
      ≥300 pg/ml es lo que obliga a continuar el estudio, no lo que
      descarta el diagnóstico. Corregido explicitando ambas direcciones.
      Ampliada también con las citas de ensayos que el texto mencionaba
      sin nombrar (DOSE-AHF, PUSH-AHF, ENACT-HF), detalle de metolazona,
      una nueva sección "🏁 Fase 3 — prealta y titulación rápida" (STRONG-HF,
      con sus limitaciones), el contrapunto de &gt;100.000 pacientes por
      emparejamiento de propensión y el RR exacto de ECLS-SHOCK (0,98; IC95%
      0,80-1,19) junto a DanGer Shock, y una nueva sección "🩸 Profilaxis
      tromboembólica" — más 2 recomendaciones nuevas en la tabla de
      Clase/Nivel (evaluación pre-alta I·C, estrategia intensiva de
      titulación I·B2).
    - **Error real confirmado en la Ficha I** (`ic-definicion`): la cifra
      de incidencia cruda europea (2-13/1000 personas-año) se presentaba
      como "Incidencia cruda en ancianos", cuando en realidad es el rango
      completo por edad de toda la población, no una cifra exclusiva de
      ancianos — y el extremo inferior estaba mal atribuido a "&lt;45
      años" cuando la fuente dice "45-54 años". Corregido explicitando que
      es el rango general europeo, con el tramo de edad exacto.
    - **Huecos de contenido añadidos, verificados contra el texto exacto
      de la Parte 1 antes de incorporarlos**: Ficha IV (`ic-farmacologia`)
      — matiz de incertidumbre de los betabloqueantes en FA, sección nueva
      "ARA-II — matices" (CHARM-Alternative/HEAAL/Val-HeFT), contexto del
      Veterans Administration Cooperative Study para hidralazina/ISDN,
      distinción DIG (digoxina) vs. DIGIT-HF (digitoxina) en glucósidos
      cardíacos, efectos adversos/señal REALIZE-K de los captores de
      potasio, nueva sección "⚠️ Discontinuación temporal del FMT", y
      nueva sección "🔄 Tratamiento en la FEVI mejorada (HFimpEF)"
      (TRED-HF/CATHEDRAL-HF/STOP-CRT); Ficha V (`ic-dispositivos`) — cifras
      exactas de COMPANION/MADIT-CRT/REVERSE en el párrafo de TRC (los
      nombres de los ensayos ya estaban, solo faltaban las cifras — el
      propio informe de auditoría lo señalaba como hueco total, corregido
      a "parcial" al releer la ficha ya existente antes de duplicar
      contenido), cifra de "&gt;15%" de shock tras recambio de DAI, nueva
      sección "⚙️ Programación y seguimiento del CIED (6.2.4)", y la
      recomendación Clase III·C de "DAI en NYHA IV refractaria" que
      faltaba; Ficha VII (`ic-avanzada`) — cita del ensayo REMATCH y el
      dato de "&gt;85% INTERMACS 1-3 al implante" en soporte circulatorio
      durable, y el hallazgo de inequidad (mujeres/minorías con menor
      acceso a MCS/trasplante) más el modelo "Hub and Spoke" en el
      párrafo de triaje; Ficha III (`ic-diagnostico`) — mención de
      "diastolic stress testing", categorías que faltaban en las listas de
      causas de las Figuras 5 y 6 (otras miocardiopatías, "mitad de HFrEF
      es isquémica", subtipos metabólico/obesidad vs. edad/vascular de
      HFpEF), nuevo `micro-prof-item` "🗺️ Diagnóstico de la IC de origen
      isquémico (Fig. 8)", y la tabla de "Recomendaciones clave" ampliada
      de 3 a 13 entradas para cubrir toda la Tabla 4 de recomendaciones de
      la fuente; Ficha II (`ic-prevencion`) — nuevo párrafo tras la
      recomendación de Estadio B citando SOLVD-Prevention, TRACE, SAVE,
      CAPRICORN (HR 0,77; IC95% 0,60-0,98), REVERT, y el metaanálisis
      BETAMI-DANBLOCK/REBOOT-CNIC.
    - **Inconsistencia de color de badge encontrada durante la propia
      implementación, no señalada en el informe original**: al añadir las
      10 recomendaciones nuevas de la Ficha III, 2 entradas Clase IIb se
      escribieron con `grade-badge red` en vez de `grade-badge yellow` —
      contradiciendo la convención ya documentada en este mismo `CLAUDE.md`
      de que IIa y IIb comparten el amarillo, dejando el rojo solo para
      Clase III. Detectado con `grep` sobre `"IIb ·"` en todo el archivo
      (encontrando 3 usos ya correctos en amarillo frente a 2 nuevos + 1
      preexistente en rojo, este último en la línea de
      "Telemonitorización no invasiva" de la Ficha X) y corregidos los 3
      a amarillo.
    - Verificado con Playwright: las 11 fichas abren/voltean sin error de
      consola ni 404 real; 141 `.grade-badge` en total (101 verdes/26
      amarillos/14 rojos), con los 6 badges "IIb" del corkboard todos en
      amarillo; el texto corregido de la Ficha I ("Incidencia cruda actual
      en Europa"/"45-54 años") está presente y el texto erróneo anterior
      ("Incidencia cruda en ancianos") ya no aparece; el texto corregido
      de NT-proBNP de la Ficha VI está presente; sin overflow horizontal a
      390px; un recorrido de 15 preguntas del quiz de Cardiología no
      generó ninguna excepción JS. La pregunta de si extraer alguna de las
      23 figuras vectoriales de la guía como imagen real quedó
      explícitamente aplazada a petición del usuario ("y después ya vemos
      que pasa con las imágenes") — resuelta en la siguiente ronda, ver
      justo abajo.
  - **Extracción de imágenes reales de la guía**, a petición explícita del
    usuario ("revisa todas las imágenes del documento, hay una gran
    mayoría que se pueden incluir en la app, sobre todo las imágenes que
    sale un corazón o imágenes como tal"). Los 2 PDF fuente se archivaron
    en `docs/esc-2026-hf-guideline-parte1.pdf` y `...-parte2.pdf`, mismo
    criterio que el resto de fuentes del proyecto. Auditoría sistemática
    con `pdfimages -list` sobre ambos PDF completos (no solo relectura de
    prosa): la Parte 1 tiene contenido de imagen real en 6 páginas
    (2 — solo perfil de color ICC, ignorada —, 10, 26, 27, 28, 45, 47), la
    Parte 2 en 2 páginas (14, 17) — el resto de las decenas de figuras del
    documento son gráficos **vectoriales** nativos (confirmado por la
    ausencia de entradas de imagen grande), no imágenes incrustadas.
    Cada página candidata está compuesta de docenas de fragmentos de
    imagen pequeños superpuestos (mismo patrón InDesign ya documentado
    para el paper de Hernandez de UCI/Papers Tuiter) — se rasterizó la
    página completa a 300dpi con `pdftoppm` y se recortó con Pillow
    (detección automática del borde rojo característico de las
    ilustraciones ESC vía umbral de color RGB, en vez de recortar a ojo),
    no `pdfimages -png` de fragmentos individuales.
    - **5 imágenes incorporadas**, las que combinan valor clínico genuino
      con contenido fotográfico real (corazones ilustrados o pruebas
      diagnósticas reales, no solo iconos/flujogramas de texto — criterio
      explícito del usuario): **Figura 1** ("Central illustration",
      manejo de la IC por continuo de FEVI con las 4 categorías de
      tratamiento coloreadas por clase — insertada al inicio de la Ficha
      IV, como resumen visual de las Fichas IV y V), **Figura 5** (causas
      de HFrEF, con una ilustración anatómica real del corazón en el
      centro — Ficha III), **Figura 6** (factores de riesgo de HFpEF,
      misma ilustración de corazón — Ficha III), **Figura 7** (abordaje
      multiparamétrico de la etiología, con miniaturas de pruebas
      diagnósticas reales: angio-TC coronaria, angiografía invasiva, PET,
      biopsia endomiocárdica con histología real, CMR, gammagrafía —
      Ficha III), y **Figura 14** (herramientas de evaluación de la
      descongestión pre-alta, con radiografía de tórax y ecografía de
      vena cava real — Ficha VI). 3 páginas candidatas se descartaron
      explícitamente por no aportar contenido fotográfico genuino más
      allá de lo ya recreado como texto: Figura 12 (fases/objetivos del
      manejo hospitalario, cajas de texto puras, ya en la Ficha VI),
      Figura 21 (equipo HF-MDT, solo iconos de personas, ya recreado en
      la Ficha X) y Figura 22 (seguimiento por estadio, tabla con iconos,
      ya recreada en la Ficha X).
    - Imágenes guardadas en `js/modules/cardiologia/img/` (JPEG,
      1600px de ancho máximo, calidad 88 — 224-402 KB cada una) e
      insertadas con el patrón `.article-figure` estándar del proyecto
      (`<img loading="lazy">` + `.article-figure-caption`), heredando
      gratis el lightbox de `core/lightbox.js` sin tocar JS.
    - **Lección de verificación con Playwright, documentada para futuras
      rondas**: un primer intento de comprobar `naturalWidth` tras un
      único `click()` sobre cada `.field-card` daba `naturalWidth: 0` en
      las 5 imágenes nuevas pese a `curl` confirmar 200 OK en el recurso
      — no era un fallo de carga, sino que un solo click en el cuaderno
      de campo solo <strong>voltea</strong> la ficha (revela la pregunta
      de repaso), sin abrir el panel; hace falta un segundo click sobre
      `.back-cta` (`openCorkboardTopic()`) para que el `.tab-content`
      pase a `.active` y el navegador dispare la carga `loading="lazy"`.
      Verificado corrigiendo el script de prueba: las 5 imágenes cargan
      (`naturalWidth: 1600`, `complete: true`) una vez el panel real está
      activo, sin 404 ni overflow horizontal a 390px en ninguna de las 3
      fichas afectadas (III, IV, VI).
  - **Informe de errores/huecos/mejoras visuales/interactividad de toda la
    guía, y sus 19 implementaciones**, a petición explícita del usuario
    ("ahora quiero un informe sobre errores, faltas de contenido y
    mejoras... también qué mejoras a nivel visual se pueden añadir, como
    poner ciertos conceptos en x color o poner el tratamiento de manera
    más esquematizada... el incorporar alguna cosa de manera interactiva").
    A diferencia de la auditoría anterior (solo Parte 1), esta releyó
    entera la **Parte 2** (secciones 9-14, Fichas VIII-XI) — nunca
    auditada contra la fuente hasta ahora — y añadió dos ejes nuevos:
    diseño visual e interactividad, evaluados sobre las 11 fichas
    completas. Publicado como Artifact con el mismo formato ya establecido
    (severidad por color: error/hueco/visual/interactividad). El usuario
    pidió implementar **todo**, subiendo a `main` tras cada mejora
    individual en vez de en un único commit final — 19 commits
    independientes, cada uno verificado con Playwright antes de
    mergear:
    1. **Tabla 19 + Figura 20 en Ficha VIII**: corrige una referencia
       rota ("ver Figura 20 y Tabla 19, Ficha IV de este mismo bloque",
       que no llevaba a ningún contenido real) reproduciendo ambas en su
       propia ficha — los 12 criterios de selección para TEER mitral y
       el algoritmo de decisión completo.
    2. **Semaglutida/tirzepatida en HFpEF**: añadidos los 2 umbrales
       numéricos reales de la Recommendation Table 18 (FEVI ≥45%, IMC
       ≥30 kg/m²), ausentes del texto anterior.
    3. **ASV en apnea obstructiva predominante**: la Recommendation
       Table 20 real tiene 2 filas — contraindicada en CSA predominante
       (ya presente) y "puede considerarse" (IIb, C) en SDB de
       predominio obstructivo (ausente); añadida la segunda mitad.
    4. **Ensayo APOLLO-B (patisiran)** en amiloidosis ATTR: 4º ensayo
       citado por la fuente para silenciadores/estabilizadores de TTR,
       explicando por qué patisiran no llegó a tener recomendación de
       guía pese al ensayo (solo datos funcionales, sin morbimortalidad).
    5. **Tabla 20 de banderas rojas de amiloidosis completada**: de 10 a
       las ~19 filas reales, agrupadas por categoría (extracardíaca,
       clínica cardíaca, ECG, laboratorio, ecocardiografía, CMR) — la
       tabla ya se titulaba explícitamente "(selección)".
    6. **Resaltado de color** (`.hl-verde/rojo/azul/purpura`, ya
       establecido en la app pero ausente por completo en esta guía):
       aplicado a cifras/umbrales clave en al menos un pasaje de cada
       una de las 11 fichas.
    7. **Tabla 11 de dosis agrupada por pilar**: filas de cabecera
       tintadas (verde = los 4 pilares del FMT, ámbar = AMT opcional)
       para que se distinga de un vistazo cuáles son "siempre" y cuáles
       son terapia adicional según fenotipo.
    8. **Componente `.algo-flow` nuevo** (pasos numerados + línea
       conectora + bifurcaciones Sí/No como chips de color) que
       sustituye la prosa "1. ... 2. ... 3." de 5 algoritmos (Fig. 4,
       11, 18, 19, 20) por un esquema legible de un vistazo — sin
       necesitar un SVG dibujado a mano por cada uno.
    9. **Calculadora CHA₂DS₂-VA** (Ficha VIII): checkboxes puntuables en
       vivo + semáforo por corte (≥2 anticoagulación indicada, =1
       considerar), primera pieza interactiva de esta guía.
    10. **Interpretador de NT-proBNP por edad** (Ficha III): edad +
        valor → descarta/zona intermedia/probable, usando los cortes ya
        tabulados.
    11. **Selector de elegibilidad de TRC** (Ficha V): slider de QRS +
        morfología LBBB/no-LBBB → clase de recomendación en vivo.
    12. **Localizador de FEVI** (Ficha IV): slider de FEVI (20-65%)
        debajo de la Figura 1 que resume qué fármacos/dispositivos
        aplican en ese punto — anclado a umbrales ya citados en el
        texto, no a los bordes exactos del gráfico original (no
        verificables pixel a pixel).
    13. **Selector "¿qué estadio SCAI tengo delante?"** (Ficha VI).
    14. **Asistente paso a paso del algoritmo de diuréticos** (Ficha
        VI): flujo clicable Sí/No por las 3 decisiones reales del
        algoritmo guiado por Na⁺ urinario, con botón de reinicio.
    15. **Checklist de descongestión pre-alta** (Ficha VI): 5 checkboxes
        (uno por dominio de la Fig. 14) con veredicto global en vivo.
    16. **Checklist "Rule of three"/"I NEED HELP"** (Ficha VII): 12
        criterios puntuables con conteo en vivo — 1 solo criterio ya
        activa la recomendación de derivación.
    17. **`.kv-row-tool`**: marca con borde + etiqueta las 5
        recomendaciones clave que ya tienen su propia calculadora en la
        misma ficha, distinguiendo "puedo usar esto ahora" del resto de
        recomendaciones de solo lectura — cierra el último punto del
        informe.
    - **Verificado con Playwright tras cada commit** (no solo al final):
      las 11 fichas abren/voltean sin error de consola ni 404 real en
      ningún punto de la ronda; cada calculadora nueva se probó con
      valores concretos verificando el veredicto/color esperado (p. ej.
      CHA₂DS₂-VA con C+S+edad≥75 → 5 puntos/rojo; asistente de
      diuréticos con No×3 → ultrafiltración/rojo; checklist de
      descongestión con 5/5 → verde, 4/5 → ámbar); sin overflow
      horizontal a 390px en ninguna ficha; un recorrido completo del
      quiz de Cardiología sin excepciones JS. Bump de cache-busting dos
      veces el mismo día (`?v=20260829` tras añadir `.algo-flow` a
      `components.css`, `?v=20260829-2` tras añadir `.kv-row-tool`).
  - **Sexta imagen real: Figura 21 (equipo HF Team)**, a petición de
    "revisa todas las imágenes del documento... que se pueden incluir en
    la app". Auditoría exhaustiva con `pdfimages -list` (umbral ≥80×80px,
    más permisivo que el ≥200×200px usado antes) sobre los 2 PDF
    completos: solo 8 páginas tienen contenido de imagen real en las 112
    páginas del documento — 6 en la Parte 1 (páginas 10/26/27/28/45/47,
    de las cuales 5 ya estaban extraídas como Fig. 1/5/6/7/14, y la 45 es
    la Fig. 12, un diagrama de cajas de texto sin foto real, ya recreado
    como tabla) y 2 en la Parte 2 (páginas 14 y 17). La página 14 es la
    Fig. 21 (rueda de iconos "HF Team" + 5 filas de texto por principio
    del programa), extraída con `pdftoppm -r 300` + recorte por umbral de
    color del borde rojo característico ESC (mismo método que las 5
    anteriores) e insertada en la Ficha X. La página 17 es la Fig. 22
    (tabla what/when/who por estadio), mismo tipo de diagrama de cajas de
    texto que la Fig. 12 — descartada, ya recreada como tabla nativa.
    **Nota de coherencia detectada en la propia auditoría posterior**: la
    Fig. 21, a diferencia de las Fig. 1/5/6/7/14 (todas con fotografía o
    ilustración anatómica real), es en realidad un diagrama de iconos sin
    ninguna foto — el mismo tipo de contenido que excluyó a la Fig. 12 y
    la Fig. 22. Se dejó explícitamente como punto a decidir por el
    usuario (mantenerla por su valor como resumen visual, o retirarla por
    coherencia estricta), no corregida por cuenta propia.
  - **2 informes de auditoría adicionales (huecos de contenido, no
    errores) y su implementación completa**, a petición de "ahora quiero
    un informe sobre las fallas de contenido..." y después "quiero que
    vuelvas a hacer otro informe... termina la relectura de la parte uno
    y haz una relectura entera de la parte 2". El primer informe releyó
    las páginas 30-56 de la Parte 1 cruzando cada Recommendation Table
    contra "📋 Recomendaciones clave" de las Fichas III-VII; el segundo
    terminó las páginas 1-29 de la Parte 1 (cruzadas contra la Tabla 5
    "New recommendations"/Tabla 6 "Revised recommendations" de la propia
    guía, confirmando sin huecos la Ficha II) y releyó la Parte 2
    **íntegra**, confirmando explícitamente (abriendo las páginas 40 y 56
    del archivo) que sus páginas 29-56 son solo bibliografía (referencias
    500+, afiliaciones, sociedades nacionales), sin contenido clínico
    adicional — con esto, las 112 páginas reales de la guía quedaron
    cubiertas al 100% por esta auditoría. Ningún error de transcripción
    nuevo en ninguna de las 2 rondas — el patrón encontrado es de
    **omisión**: recomendaciones graduadas de la fuente que el texto ya
    menciona en prosa o dentro de un algoritmo interactivo ya construido,
    pero que nunca se convirtieron en su propio `kv-row` con `.grade-badge`
    dentro de "Recomendaciones clave" — más un hueco de contenido real
    (no solo de badge) en la Tabla 9 de causas de alteración de péptidos
    natriuréticos. A petición de "aplica todas las mejoras del ultimo
    informe", se implementaron todos los hallazgos verificados:
    - **Ficha III**: añadidas 3 causas ausentes de la Tabla 9 (disfunción
      endocrina grave y enfermedad hepática grave en la columna de
      aumento; pericarditis constrictiva en la de disminución) — el
      único hallazgo de contenido real, no de badge, de las 2 rondas.
    - **Ficha VI**: 9 recomendaciones de la Tabla 9 sin badge (oxígeno,
      intubación, VNI, acetazolamida/HCT, diuresis guiada por Na⁺,
      ultrafiltración, vasodilatadores, inotrópicos, vasopresores,
      opiáceos) + MCS en complicación mecánica del IAM (Tabla 10) +
      matiz de NT-proBNP&gt;5000 pg/ml (Fig. 11, "ingreso generalmente
      recomendado" en mayores) añadido al texto del algoritmo.
    - **Ficha VII**: CPET y cateterismo derecho (Tabla 11), y TRS/
      ultrafiltración con sus 2 grados reales distintos (Tabla 12,
      IIa·C/IIb·C, antes fusionados en una sola frase sin badge).
    - **Ficha V**: los 4 tramos restantes de la matriz TRC por QRS/
      morfología (que el propio selector interactivo ya calculaba bien)
      + el desfibrilador portátil (wearable).
    - **Ficha VIII**: digoxina/digitoxina, ablación del nodo AV+TRC y
      amiodarona/digoxina IV en FA inestable (Tabla 15) + TEER mitral
      "de rescate" fuera de los criterios completos de la Tabla 17 (que
      el algoritmo de la Fig. 20 ya resolvía bien, sin badge propio).
    - **Ficha IX**: 2ª recomendación de hierro IV (reducir riesgo de
      HFH, IIa·B1), distinta de la ya badgeada (aliviar síntomas, I·B1).
    - **Pulido**: la Ficha XI ganó su propia sección de cierre
      "Recomendaciones clave" (era la única de las 11 sin ella, pese a
      tener 3 recomendaciones graduadas repartidas en el texto) y se
      añadió un cross-link `.tx-link` en ambas direcciones entre la
      "Revisión de la proporción de estimulación del VD" (Ficha III) y
      "IC inducida por estimulación del VD" (Ficha V) — mismo tema,
      antes sin enlazar entre sí.
    - **Fig. 21**: estuvo pendiente de decisión del usuario («a revisar
      contigo»); en octubre de 2026 decidió que se queda (ver «Arreglos de
      código (octubre 2026)»).
    - Verificado con Playwright: las 11 fichas siguen abriendo/volteando
      sin error de consola ni 404 real; recuento de `.grade-badge` por
      ficha confirmado exacto contra lo esperado tras cada bloque de
      cambios (Ficha III 13, V 12, VI 19, VII 12, VIII 13, IX 10, XI 6);
      los 2 `.tx-link` nuevos navegan a la ficha correcta en ambas
      direcciones; sin overflow horizontal a 390px en ninguna ficha.

- **Segunda guía: "Merino Cardiología" (shock clínico)**
  (`js/modules/cardiologia/merino-cardiologia.html`+`.js`), a petición
  explícita del usuario ("debajo de la nueva guía que subimos hace poco
  quiero que haya un nuevo apartado llamado merino cardiología... falta
  otro [archivo] que luego te añadiré pero primero completalo con este").
  Botón nuevo debajo de "Insuficiencia Cardíaca (ESC 2026)" en
  `cardiologia-menu.html` (`#btn-merino-cardio`), con `cardioLevel` (en
  `cardiologia/index.js`) ganando una segunda entrada
  (`merinoCardiologia`) — mismo patrón exacto, sin cambios de
  arquitectura. Fuente: Marino PL, *The ICU Book* (5.ª ed.), Sección VI "Shock Syndromes", Cap. 14-17 (70 páginas) — **el
  mismo libro que Merino HEMATO** (Cap. 12-13, Hematología), confirmado
  por el formato/marca de agua idénticos ("A L G r a w a n y") y el
  estilo de cita — pero un archivo distinto, subido para esta sección de
  Cardiología. PDF archivado en `docs/marino-2024-shock-caps14-17.pdf`
  (páginas del PDF = página impresa del capítulo, sin offset: Cap.
  14→pág. 1, Cap. 15→pág. 21, Cap. 16→pág. 37, Cap. 17→pág. 52 —
  confirmado con `pdftotext` página a página, no a ojo). El usuario avisó
  explícitamente que **hay un segundo archivo pendiente** que ampliará
  este mismo apartado en el futuro (probablemente los capítulos
  siguientes de la Sección VII "Cardiac Disorders", que el propio PDF
  muestra como página de corte final) — la instrucción fue completar ya
  esta primera tanda con el archivo recibido, no esperar al segundo.
  - **Cuaderno de campo de 12 fichas** (`#merino-cardio-corkboard`/
    `#panel-merino-cardio-tabs`, mismo `core/corkboard.js` de siempre),
    correspondencia 1:1 con los 4 capítulos pero partiendo cada uno en
    2-4 fichas por volumen real de contenido (mismo criterio ya usado en
    Merino HEMATO): **Cap. 14 "Approaches to Clinical Shock"** → Ficha I
    (definiciones, monitorización de PA/perfusión tisular/transporte de
    O₂, con la excepción del shock séptico —hipoxia citopática— y el
    argumento final de "la hipotensión como consecuencia, no causa, del
    shock") y Ficha II (los 6 vasopresores — norepinefrina, vasopresina,
    angiotensina II con su riesgo real de trombosis 13% vs. 5%,
    midodrina sin ventaja real para el shock —el resto, epinefrina/
    dopamina/fenilefrina, se desarrollan en las fichas de cada shock
    específico—); **Cap. 15 "Hemorrhagic Shock"** → Ficha III
    (fisiología del volumen sanguíneo, Tabla 15.1 de clasificación I-IV
    con calculadora interactiva, y la trampa de interpretación de
    Hb/Hct — reflejan el esfuerzo de reanimación, no la pérdida real),
    Ficha IV (ecuación de Hagen-Poiseuille, catéteres de infusión
    rápida, Tabla 15.2 de fluidos, productos sanguíneos uno a uno, Tabla
    15.3/15.4) y Ficha V (damage control resuscitation: hipotensión
    permisiva, coagulopatía inducida por trauma —40% de bajas de
    combate, 6× mortalidad, mecanismo de la proteína C activada—,
    reposición 1:1:1, tromboelastografía con **intérprete TEG
    interactivo**, y lesión postresucitación); **Cap. 16 "Cardiogenic
    Shock"** → Ficha VI (etiologías con Fig. 16.1 —79% infarto del VI,
    3 complicaciones mecánicas en &lt;24h—, Tabla 16.1 de otras causas,
    cambios hemodinámicos, microcirculación e inflamación sistémica),
    Ficha VII (monitorización, Tabla 16.2 de objetivos, norepinefrina
    como vasopresor de elección salvo obstrucción dinámica del TSVI,
    Tabla 16.3 de inotrópicos —dobutamina/milrinona/levosimendán— y la
    "paradoja" de la carga de trabajo cardíaco) y Ficha VIII (IABP con
    el mecanismo de inflado/desinflado, catéteres Impella, VA-ECMO con
    el problema de la poscarga del VI/venteo, y un **selector
    interactivo de elección de dispositivo**); **Cap. 17 "Inflammatory
    Shock Syndromes"** → Ficha IX (activación de neutrófilos/estallido
    respiratorio, Fig. 17.1 de la cascada de ROS recreada como
    `algo-flow`, disfunción endotelial, Tabla 17.1 de lesión de órganos,
    y el cierre "inflamación no hipoxia" que enlaza con Merino HEMATO),
    Ficha X (definiciones Sepsis-3, "sepsis como respuesta desregulada a
    la inflamación —70% sin infección documentada—", hipoxia citopática,
    Tabla 17.2 de manejo inicial, con un **enlace interno real** desde
    la Ficha I), Ficha XI (síndrome de shock tóxico, Tabla 17.3
    comparativa estafilocócico vs. estreptocócico) y Ficha XII
    (anafilaxia, síndrome de Kounis, Tabla 17.4/17.5, y la cita textual
    de que los corticoides "no tienen ningún papel" en el manejo agudo).
  - **Sin imágenes extraídas**: auditado con `pdftotext`/lectura íntegra
    de las 70 páginas — a diferencia de Merino HEMATO (con 2 fotografías
    reales, radiografía y frotis), todas las figuras de este PDF son
    ilustraciones de corazón dibujadas por el propio libro (IABP,
    Impella, mecanismos de IAM) o gráficos/diagramas/curvas (TEG, ROS,
    hemodinámica) — mismo criterio ya establecido en el proyecto de
    nunca extraer como imagen lo que se puede recrear fielmente como
    `.data-table`/`kv-row`/`algo-flow`/`micro-prof-item` nativo.
  - **3 calculadoras interactivas** (`merino-cardiologia.js`, primeras
    de todo el bloque de Merino Cardiología, a diferencia de Merino
    HEMATO que solo tuvo 1 —4Ts—): `calcClaseHemorragia()` (Ficha III,
    input numérico de % de volumen perdido → Clase I-IV con
    interpretación, clampado 0-100); intérprete TEG (Ficha V, 5
    `<select>` normal/anormal —nunca radio buttons, mismo criterio ya
    establecido tras el bug de tachado de Merino HEMATO— que listan las
    intervenciones de la Tabla 15.5 para cada parámetro anormal
    marcado); y el selector "elección de dispositivo" (Ficha VIII,
    puramente informativo, sin puntuación — no hay un único ganador
    entre IABP/Impella/ECMO según la fuente).
  - **Enlace cruzado interno Ficha I → Ficha X**, implementado con
    cuidado para NO reutilizar la clase `.tx-link` (que en
    `nefrologia/index.js` tiene un listener global
    `document.querySelectorAll('.tx-link')` sin acotar a su propio DOM —
    reutilizarla aquí sin `data-view` habría corrompido silenciosamente
    el estado de `nefroLevel` en cada click, el mismo bug ya documentado
    y corregido para Vías Urinarias↔Nefrología). En su lugar, un botón
    con `id="mc-link-a-septico"` y un listener propio en
    `merino-cardiologia.js` que llama a
    `openCorkboardTopic('panel-merino-cardio-tabs', 'mc-shock-septico')`
    directamente — mismo patrón ya usado por `fisio-uci/hematologia.js`
    para su propio cross-link interno a la Ficha 4 de TEG/ROTEM.
  - **96 preguntas de quiz** (`js/data/merino-cardiologia-preguntas.js`,
    `mc-q001`-`q096`, 8 por ficha × 12 fichas — 6 de opción múltiple + 2
    de tipo `redactar`, mismo formato ya establecido).
    `triggerId: 'btn-merino-cardio-repasar'`, añadido al array que ya
    exporta `cardiologia/index.js` junto a `btn-cardio-ic-repasar`. El
    bloque "Merino Cardiología" del quiz de Cardiología queda con 96
    preguntas (94 de Insuficiencia Cardíaca + 96 = 190 en la asignatura
    Cardiología). El banco combinado de toda la app queda en
    <strong>1355 preguntas</strong> (1259 previas + 96).
  - Verificado con Playwright: las 12 fichas abren/voltean sin error de
    consola ni 404 real; las 3 calculadoras responden correctamente
    (35% → Clase III/rojo; TEG con R y MA marcados "anormal" → 2
    intervenciones listadas; selector ECMO → texto informativo
    correcto); el cross-link interno Ficha I→Ficha X funciona; el menú
    del quiz en 3 niveles muestra "Cardiología (190)" →
    "Merino Cardiología (96)" → las 12 fichas con 8 preguntas cada una,
    y un recorrido de 6 preguntas (mezcla de opción múltiple y
    `redactar`) no generó ninguna excepción JS; sin overflow horizontal
    a 390px en las fichas con tablas anchas (Tabla 15.1, Tabla 15.3).
    El segundo archivo anunciado por el usuario llegó después — ver
    "Parte 2" más abajo, con las 12 fichas nuevas que lo incorporan.
  - **Auditoría de contenido de la Ficha I/II tras el build inicial, y
    correcciones aplicadas** — a petición explícita del usuario ("quiero
    una auditoría sobre el contenido... busques los fallos, las faltas de
    contenido, los errores, las imágenes que no salen y las mejoras").
    Releídas las 70 páginas del PDF **página a página** (no por lotes de
    15, como en la construcción inicial) para descartar el mismo problema
    ya documentado una vez en Cardiología/Fisiopatología UCI: el `Read`
    tool puede devolver menos imágenes `output_image` que páginas
    pedidas en un lote grande, sin avisar — y esta vez sí ocurrió: el
    primer lote de la construcción inicial (páginas 1-15) solo devolvió
    6 imágenes, y el segundo (16-30) solo 7, así que gran parte del
    Capítulo 14 nunca se llegó a ver. Publicado un informe como Artifact
    (severidad por color: error/hueco de contenido/imagen candidata/
    mejora) antes de tocar el repositorio, y aplicado íntegro a
    continuación por orden de importancia:
    - **1 error real**: la Ficha II afirmaba que epinefrina/dopamina/
      fenilefrina "se desarrollan con detalle en las Fichas VII y X" —
      no era cierto, nunca se habían escrito. Corregido añadiendo las 3
      como `micro-prof-item` propios con dosis/efectos adversos reales
      (Tabla 14.4 completa, antes con solo 4 de 6 vasopresores), y
      reconciliado el rango de norepinefrina (5-40 μg/min según la
      Tabla 14.4, antes citaba solo "5-30" de la prosa sin la tabla).
    - **9 huecos de contenido, todos en el Capítulo 14 salvo 1**: (1) el
      marco de clasificación fisiológica completo — Q=(Pin−Pout)/R →
      GC=(PAM−PAD)/RVS → PAM=(GC×RVS)+PAD, y la Tabla 14.1 de los 4 tipos
      de shock por patrón PVC/GC/RVS con su prevalencia real (vasodilatador
      66%, el más frecuente con diferencia — dato ausente hasta ahora),
      con la epidemiología propia de cada tipo (hipovolémico &gt;30% de
      pérdida; cardiogénico ~50% por SCA — con nota de fidelidad frente
      al "~2/3 por IAM" ya citado en la Ficha VI, misma disciplina que el
      TAPSE de Cardiología o el IFR de FRA; obstructivo 2%; vasodilatador
      con el shock séptico como causa dominante); (2) fisiología de la
      onda de presión arterial y amplificación sistólica (hasta 20 mmHg
      de aumento sistólico de aorta a radial/femoral, con la analogía de
      las "olas monstruo" por convergencia de ondas reflejadas — la PAM
      no cambia, de ahí su preferencia sobre la sistólica); (3) medición
      indirecta de la PA (método oscilométrico/auscultatorio, regla del
      manguito L=0,8×C/W=0,4×C con la Tabla 14.2 de 4 tamaños, y el dato
      de seguridad real — la PA automática puede diferir de la directa
      hasta 55 mmHg en el crítico); (4) la Tabla 14.3 de medidas globales
      de perfusión/oxigenación (rango crítico + interpretación) con las 5
      ecuaciones del transporte de O₂ (DO₂=IC×CaO₂, VO₂=GC×(CaO₂−CvO₂),
      Extracción=VO₂/DO₂≈SaO₂−ScvO₂) y el matiz de que una ScvO₂ ≥80% es
      rasgo característico del shock séptico (fallo de extracción, no
      exceso de aporte); (5) manejo de la extravasación de vasopresores
      (fentolamina 5-10 mg en 10 mL de salino, inyección directa, ventana
      de 12h) y la seguridad real de la vía periférica (16 estudios,
      hasta 48h) — añadido a la Ficha II; (6) cifras concretas de volumen
      de reanimación inicial (no exceder 2L de cristaloide en 1-2h, con
      la razón fisiológica del 15% del volumen plasmático); (7) los datos
      reales de la Figura 15.3 (ΔIC por tipo de fluido a 30/60 min:
      coloide &gt; plasma &gt; sangre completa &gt; cristaloide &gt;
      hematíes empaquetados) añadidos a la Ficha IV, antes solo una
      afirmación cualitativa.
    - **3 imágenes extraídas** (`js/modules/cardiologia/img/mc-fig1-
      onda-arterial.jpg`, `mc-fig2-korotkoff.jpg`, `mc-fig3-manguito.jpg`,
      `pdfimages -png` de las páginas 5-7, sin `smask` que componer) — las
      únicas 3 de las 17 figuras del bloque que son ilustraciones/curvas
      reales de un objeto físico (un torso con las 4 ondas de presión
      arterial reales superpuestas, la curva real de sonidos de
      Korotkoff, el esquema del manguito) en vez de gráficos estadísticos
      reconstruibles como tabla — mismo criterio que ya justificó
      extraer la radiografía de TRALI o el frotis con esquistocitos en
      Merino HEMATO. Las otras 15 imágenes incrustadas del PDF
      (corazones ilustrados, circuito de ECMO, cascada de ROS, gráficos
      de barras/líneas) se confirmaron como diagramas/estadísticas ya
      bien recreadas como `.data-table`/`algo-flow` nativos — no se
      extrajo ninguna más.
    - **4 mejoras**: (1) selector "¿qué tipo de shock tengo delante?" en
      la Ficha I (`calcTipoShock()`, 3 `<select>` PVC/GC/RVS → tipo de
      shock según la Tabla 14.1 — declara honestamente que cardiogénico y
      obstructivo comparten el mismo patrón hemodinámico y no son
      distinguibles solo con estas 3 variables, en vez de forzar un único
      resultado); (2) cross-link real en ambas direcciones entre el shock
      cardiogénico de Merino Cardiología (Fichas VI y VIII) y la
      clasificación SCAI/recomendaciones de soporte mecánico de la guía
      ESC de IC (`ic-descompensada`) — **nunca con `.tx-link`** (ese
      listener global vive en `nefrologia/index.js` y solo conoce las
      claves de `nefroLevel`; reutilizarlo aquí habría repetido el bug ya
      documentado y corregido para Vías Urinarias↔Nefrología), sino con
      una clase local `.cardio-cross-link` + 2 IDs sueltos
      (`mc-link-a-scai`, `mc-link-a-mcs-esc`), todos enganchados dentro
      del propio `cardiologia/index.js` (que ya controla `cardioLevel`,
      el switcher de ambas guías); (3) y (4) ya cubiertas por los huecos
      de contenido de arriba (nota de fidelidad SCA/IAM, tabla de
      extravasación).
    - Verificado con Playwright: las 12 fichas de Merino Cardiología y
      las de la guía ESC de IC abren/voltean sin error de consola ni 404
      real; las 3 imágenes nuevas cargan (`naturalWidth`&gt;0); el
      selector de tipo de shock da el resultado correcto en los 3
      patrones reales de la Tabla 14.1 (incluida la ambigüedad
      cardiogénico/obstructivo declarada); los 3 cross-links nuevos
      (guía ESC→Ficha VI, Ficha VI→guía ESC, Ficha VIII→guía ESC)
      navegan a la ficha exacta de destino en ambas direcciones; las
      calculadoras ya existentes (clasificador de hemorragia, TEG,
      selector de dispositivo) siguen funcionando sin regresiones; sin
      overflow horizontal a 390px pese a las 2 tablas nuevas anchas
      (Tabla 14.1, Tabla 14.3).
  - **Parte 2: IC aguda, taquiarritmias, SCA/disección aórtica y paro
    cardíaco (Cap. 18-21)** — el segundo archivo que el usuario había
    anunciado explícitamente ("guarda esa información para hacerlo en
    un futuro no lejano") llegó con el pedido "vamos a completar
    cardiología merino con la 2° parte que faltaba". Cubre la **Sección
    VII "Cardiac Disorders"** del mismo libro (Marino PL, *The ICU Book* (5.ª ed.)) — distinta de la Sección VI "Shock
    Syndromes" (Cap. 14-17) ya incorporada: PDF archivado en
    `docs/marino-2024-cardiac-disorders-caps18-21.pdf` (72 páginas, sin
    offset — página del PDF = página impresa del capítulo: Cap. 18→pág.
    1, Cap. 19→pág. 18, Cap. 20→pág. 38, Cap. 21→pág. 55, verificado con
    `pdftotext -f N -l N` en las páginas de inicio de cada capítulo).
    **Detalle de nomenclatura corregido durante el propio proceso**: el
    archivo se archivó en un primer momento como
    `marino-2024-shock-caps18-21.pdf` (arrastrando el nombre del bloque
    anterior) — al leer el contenido real se confirmó que los Cap. 18-21
    NO son de shock, sino de trastornos cardíacos (IC, arritmias, SCA,
    paro), así que se renombró a
    `marino-2024-cardiac-disorders-caps18-21.pdf` antes de que el nombre
    incorrecto se propagara a ningún enlace de bibliografía.
    - Ampliado el cuaderno de campo de 12 a **24 fichas**
      (`#merino-cardio-corkboard`/`#panel-merino-cardio-tabs`, mismo
      `core/corkboard.js` de siempre), correspondencia capítulo→bloque de
      fichas según su volumen real (mismo criterio ya establecido en el
      resto del proyecto): **Cap. 18 "Acute Heart Failure(s)"** → Ficha
      XIII (tipos de IC por FEVI —ecuaciones de distensibilidad y FE—,
      fallo derecho con interdependencia ventricular y **Figura 18.2 real**
      —ecografía de dilatación del VD—, 3 etapas progresivas, respuestas
      neurohumorales —péptidos natriuréticos/SNS/SRAA—, congestión venosa
      con **Figura 18.4 real** —Rx de edema pulmonar cardiogénico— y
      síndrome cardiorrenal, biomarcadores con Tabla 18.2) y Ficha XIV
      (vasodilatadores —Tabla 18.3, nitroglicerina/nitroprusiato con sus
      riesgos propios de adsorción a PVC/cianuro/robo coronario—,
      diuréticos con sus 3 preocupaciones reales —incluido el "edema
      pulmonar flash"—, Tabla 18.4, ventilación con presión positiva, y el
      cierre "cuidado con los diuréticos"); **Cap. 19 "Tachyarrhythmias"**
      → Ficha XV (algoritmo de reconocimiento en 3 pasos QRS/R-R/actividad
      auricular, con **Figuras 19.2/19.3 reales** —trazados ECG de
      AVNRT/TAM/FA—), Ficha XVI (FA — epidemiología hospitalaria, Tabla
      19.1 de control de frecuencia con sus 5 fármacos, **Figura 19.4
      real** —déficit de pulso—), Ficha XVII (FA — cardioversión eléctrica,
      **calculadora interactiva CHA₂DS₂-VASc** con 8 checkboxes puntuables
      y semáforo por corte de riesgo, Tabla 19.3 de DOAC/warfarina, WPW),
      y Ficha XVIII (TAM con el régimen de magnesio del 88% de éxito,
      AVNRT/adenosina con Tabla 19.4, TV vs. SVT aberrante con **Figuras
      19.6/19.7 reales**, algoritmo de manejo de QRS ancho, torsade de
      pointes con **Figura 19.9 real** y **calculadora interactiva de QTc**
      —fórmula de Bazett QTc=QT/√(R-R), semáforo por los cortes 0,44/0,5s—);
      **Cap. 20 "Acute Coronary Syndromes"** → Ficha XIX (patogénesis de la
      rotura de placa y mieloperoxidasa, los 3 síndromes STEMI/NSTEMI/AI,
      los 3 componentes de la evaluación diagnóstica, Tabla 20.1) y Ficha
      XX (estrategias de reperfusión por tiempo puerta-balón/puerta-aguja,
      Tabla 20.2 de trombolíticos, Tabla 20.3 de medidas cardioprotectoras,
      Tabla 20.4 antitrombóticas, anticoagulación, terapias a largo plazo,
      cierre "el dogma de oferta-demanda de O₂"), más Ficha XXI (disección
      aórtica aguda — fisiopatología tipo A/B, presentación clínica con el
      dato real de que 1 de cada 3 casos se pasa por alto, imagen
      diagnóstica con **Figura 20.4 real** —TC con el colgajo íntimal—,
      Tabla 20.5 de antihipertensivos con la advertencia clave de nunca
      usar vasodilatador sin betabloqueante); **Cap. 21 "Cardiac Arrest"**
      → Ficha XXII (SVB con Tabla 21.2 de 7 elementos esenciales, SVCA con
      el algoritmo de la AHA — Fig. 21.2 original **recreado de forma
      nativa como `algo-flow` en vez de reproducir la imagen**, por llevar
      aviso explícito de copyright "© 2020 American Heart Association" en
      la fuente —, desfibrilación, epinefrina, causas reversibles "las T"),
      Ficha XXIII (ETCO₂ para monitorizar calidad de RCP y predecir RCE,
      ecografía a pie de cama con **Figura 21.5 real** —derrame
      pericárdico—), y Ficha XXIV (síndrome posparo cardíaco, manejo
      dirigido de temperatura con Tabla 21.3 y su evolución histórica de
      32-34°C obligatorio a "solo prevenir la fiebre", Tabla 21.4 de otras
      preocupaciones, predictores de mal pronóstico neurológico con Tabla
      21.5, cierre "percepción vs. realidad" con la cifra real de éxito de
      la RCP, 1-7%, frente al 75% que muestra la televisión).
    - **10 imágenes reales extraídas** con `pdfimages -png`
      (todas como imagen única embebida por página, sin fragmentar —mismo
      caso que los papers de Springer de UCI/Papers Tuiter, confirmado con
      `pdfimages -list` antes de extraer): `mc-fig18-2-tte-vd.jpg`,
      `mc-fig18-4-edema-pulmonar.jpg`, `mc-fig19-2-ecg-avnrt.jpg`,
      `mc-fig19-3-ecg-mat-fa.jpg`, `mc-fig19-4-onda-pulso-fa.jpg`,
      `mc-fig19-6-ecg-tv-vs-svt.jpg`, `mc-fig19-7-ecg-latido-fusion.jpg`,
      `mc-fig19-9-ecg-torsade.jpg`, `mc-fig20-4-tc-diseccion-aortica.jpg`,
      `mc-fig21-5-eco-derrame-pericardico.jpg` — todas con contenido
      fotográfico/de registro real (ecografías, Rx, trazados ECG
      genuinos, TC), mismo criterio de extracción ya establecido en el
      resto del proyecto (nunca imágenes de gráficos estadísticos
      reconstruibles como tabla). La única figura del bloque con licencia
      restrictiva explícita (el algoritmo ACLS de la AHA, Fig. 21.2) se
      recreó nativamente en vez de extraerse, por la nota de copyright ya
      mencionada.
    - **2 calculadoras interactivas nuevas** en `merino-cardiologia.js`
      (`calcCha2ds2Vasc()`/`initCha2ds2Vasc()` y `calcQtc()`/`initQtc()`,
      mismo patrón `.tfg-estado-ok/warn/danger` ya usado en el resto de la
      app, con el guard `.value === ''` ya establecido como lección
      aprendida en las auditorías de FRA/ERC para no tratar un campo
      vacío como 0) — llevando el total de calculadoras del módulo a 5
      (más el clasificador de hemorragia, el intérprete TEG y el selector
      de tipo de shock/dispositivo ya existentes de la Parte 1). Los
      contenedores de ambas calculadoras usan `.card` con
      `padding:14px 16px` (el mismo patrón ya usado para calculadoras
      embebidas en Cardiología/Nefrología), no una clase `.calc-box`
      nueva sin definir en `components.css`.
    - **96 preguntas de quiz nuevas** (`js/data/merino-cardiologia-preguntas.js`,
      `mc-q097`-`q192`, 8 por ficha × 12 fichas — mismo formato 6 opción
      múltiple + 2 `redactar` ya establecido), llevando el banco de
      Merino Cardiología a **192 preguntas** y el de Cardiología (sumado a
      las 94 de la guía ESC de IC) a 286. El banco combinado de toda la
      app queda en <strong>1451 preguntas</strong> (1355 previas + 96).
    - Bibliografía ampliada con las 4 entradas de los Cap. 18-21 (mismo
      patrón `.biblio-link` con `#page=N`), y la nota de cierre corregida
      para reflejar que ambas secciones (VI y VII) del libro ya están
      incorporadas, sin ninguna coletilla de "pendiente".
    - Verificado con Playwright: las 24 fichas del corkboard abren/voltean
      sin error de consola ni 404 real; las 10 imágenes nuevas cargan
      (`naturalWidth`&gt;0 una vez se abre su acordeón/ficha); la
      calculadora CHA₂DS₂-VASc puntúa correctamente (edad&gt;75+ictus = 4
      puntos, riesgo definido) y la de QTc calcula bien (QT=480ms/FC=90 →
      588ms, riesgo de torsade) y se abstiene con el campo vacío sin
      tratarlo como 0; las calculadoras ya existentes de la Parte 1
      (clasificador de hemorragia, TEG, selector de dispositivo/tipo de
      shock) siguen funcionando sin regresiones; el menú del quiz en 3
      niveles muestra "Cardiología (286)" → "Merino Cardiología (192)" →
      las 24 fichas con 8 preguntas cada una, y un recorrido de 6
      preguntas (mezcla de opción múltiple y `redactar`) no generó
      ninguna excepción JS; sin overflow horizontal a 390px.
  - **Auditoría de huecos/imágenes/mejoras de las 24 fichas, y sus
    correcciones aplicadas** — a petición explícita del usuario
    ("ahora haz un informe/auditoría de las partes que faltan en cardio
    merino, de los huecos de información, de las imágenes que no están,
    de las cosas que se podrían mejorar, y de las posibles interacciones
    interactivas se podrían añadir"). Se releyeron íntegros ambos PDF
    fuente (142 páginas) y se hizo un inventario completo de imágenes con
    `pdfimages -list` sobre los 2 archivos, comparándolo contra las 13
    imágenes ya extraídas hasta ese momento — publicado como Artifact
    (severidad por color: huecos/imágenes/mejoras/interactividad, con 5
    miniaturas reales incrustadas de las propias candidatas). Aplicados a
    continuación los 3 primeros bloques del informe (huecos, imágenes,
    mejoras menores) — el 4º bloque, 10 propuestas de piezas
    interactivas nuevas, quedó documentado en el informe pero no
    implementado en esta ronda:
    - **4 huecos de contenido reales, verificados con `grep` antes de
      reportarlos** (ninguno era una reformulación de algo ya presente):
      el objetivo de <strong>Hb 7-9 g/dl</strong> propio del shock
      hemorrágico (Fig. 15.6, distinto del umbral transfusional general
      ya citado en la Ficha I) — añadido como nueva Tabla 15.6
      "Objetivos completos de la reanimación en shock hemorrágico" al
      final de la Ficha III, consolidando también los objetivos de
      perfusión/hemostasia/TEG ya dispersos en Fichas I y V; el ejemplo
      numérico real de un paciente postoperatorio (Fig. 18.3: presión de
      enclavamiento 10→20-30 mmHg, FC 80→100 lpm, VS 60→20 mL, IC
      3,5→2,0 L/min/m² en 4h) que faltaba junto a las "3 etapas
      progresivas" ya descritas de forma abstracta en la Ficha XIII —
      añadido junto a la figura misma; la <strong>Tabla 21.1</strong>
      (datos reales de paro cardíaco en EE. UU. 2021 — extrahospitalario
      143.018 casos/17% FV-TV/75% AESP-asistolia/9% supervivencia al
      alta/7% con buen estado funcional; intrahospitalario
      8.619/13%/78%/19%/1%), citada por nombre en el cierre "percepción
      vs. realidad" de la Ficha XXIV sin haberse reproducido nunca —
      añadida como `.data-table` nativa en la Ficha XXII (no como
      imagen, aunque en el PDF fuente está incrustada como tal), con un
      botón `#mc-link-a-tabla211` que salta de la cita en la Ficha XXIV
      a la tabla real; y el paso "amiodarona IV" del algoritmo de manejo
      de TV en la Ficha XVIII, que no repetía su dosis (sí presente en
      la Tabla 19.1 de la Ficha XVI) — corregido a "(misma pauta que la
      Tabla 19.1, Ficha XVI)" en vez de duplicar los números.
    - **8 imágenes reales extraídas** con `pdfimages -png` (todas como
      imagen única embebida por página, mismo método ya establecido):
      `mc-fig15-1-volumen-hto.jpg` (cilindros de volumen sanguíneo/Hto
      antes y después de hemorragia/reanimación, Ficha III — visualiza
      la "trampa del hematocrito" ya explicada en prosa),
      `mc-fig15-5-teg-trazado.jpg` (trazado TEG de referencia con
      R/k/α/MA/LY30 etiquetados, Ficha V), `mc-fig16-3-iabp.jpg`
      (inflado/desinflado del balón de contrapulsación con curvas de
      presión), `mc-fig16-4-impella.jpg` (catéter Impella con motor
      housing/propeller blades/pigtail) y `mc-fig16-5-ecmo-circuito.jpg`
      (circuito VA-ECMO completo) — las 3 en Ficha VIII, cada una dentro
      del `micro-prof-item` de su dispositivo; `mc-fig18-1-curvas-funcion.jpg`
      (curvas de función ventricular y distensibilidad sistólica vs.
      diastólica) y `mc-fig18-3-etapas-postop.jpg` (el ejemplo numérico
      real de arriba) en Ficha XIII; y `mc-fig20-1-rotura-placa.jpg`
      (ilustración de vaso con rotura de placa/trombo oclusivo con
      hebras de fibrina) en Ficha XIX. Todas genuinamente anatómicas o
      de registro real — ninguna era un gráfico estadístico
      reconstruible como tabla (esos, cuando aparecían en el inventario,
      se dejaron fuera de la extracción, mismo criterio de siempre).
    - **7 mejoras menores** (el mensaje cualitativo ya estaba en la app;
      solo faltaban las cifras exactas del gráfico original): flujo por
      gravedad exacto de la Fig. 15.2 (16G periférico 10,8 L/h/18G 5,4
      L/h vs. 16G central 2,3 L/h/18G 0,9 L/h) en Ficha IV; tabla
      completa EE. UU./Europa de mortalidad por nº de órganos fallados
      (Fig. 17.2: 1→23/24%, 2→44/38%, 3→65/68%, ≥4→75/85%) en Ficha IX,
      sustituyendo el rango aproximado que había antes; la curva
      diltiazem/amiodarona/digoxina de la Fig. 19.5 (diltiazem cruza el
      objetivo de 100 lpm a las ~2,3h, digoxina apenas lo alcanza a las
      6h) en Ficha XVI; las cifras exactas de vidas salvadas por 100
      tratados de la Fig. 20.2 (puerta-balón, 4,4→8,8 según demora) y la
      Fig. 20.3 (trombólisis, 3,5→0,4 con la pérdida de beneficio en
      13-18h) en Ficha XX; los puntos intermedios y el tamaño muestral
      de la Fig. 21.1 (N=1.667; 29% a los 10 min, 19% a los 15 min,
      entre los extremos 40%/5min y 9%/20min ya citados) en Ficha XXII;
      y los valores exactos con N por grupo de la Fig. 21.4 (ETCO₂ con
      RCE 27→32 mmHg N=402 vs. sin RCE 19→7 mmHg N=335) en Ficha XXIII.
    - **Pendiente, documentado en el propio informe pero no
      implementado en esta ronda**: las 10 propuestas de interactividad
      nueva (simulador paso a paso del algoritmo ACLS en Ficha XXII,
      checklist puntuable de los 7 predictores de mal pronóstico de la
      Tabla 21.5 en Ficha XXIV, selector de perfil hemodinámico en
      shock cardiogénico para las Fichas VI/VII —hoy sin ninguna pieza
      interactiva—, cronómetro de tiempo puerta-balón en Ficha XX,
      selector de vasopresor/inotrópico por escenario en Ficha II,
      calculadora de delta de troponina en Ficha XIX, selector de
      antihipertensivo en disección aórtica para Ficha XXI, selector de
      fármaco de control de frecuencia en FA para Ficha XVI, intérprete
      de ETCO₂ a los 20 min para Ficha XXIII, y gauge visual del
      objetivo de PAM para Ficha I) — a la espera de que el usuario
      confirme si quiere que se implementen.
    - Verificado con Playwright: las 9 fichas tocadas
      (III/IV/V/VIII/IX/XIII/XIX/XXII/XXIII) abren/voltean sin error de
      consola ni 404 real; las 8 imágenes nuevas cargan
      (`naturalWidth`&gt;0 una vez visibles — confirmado también con
      `scrollIntoView` para la que queda fuera del viewport inicial de
      390×844 tras abrir la ficha); el cross-link
      `#mc-link-a-tabla211` (Ficha XXIV → Ficha XXII) navega
      correctamente y la tabla de destino contiene las cifras reales
      (143.018/8.619); las calculadoras ya existentes (clasificador de
      hemorragia, TEG, selector de dispositivo/tipo de shock,
      CHA₂DS₂-VASc, QTc) siguen funcionando sin regresiones; sin
      overflow horizontal a 390px pese a las tablas nuevas.
  - **Segunda auditoría, cuarta relectura del módulo** — a petición
    explícita del usuario de un nuevo informe de huecos/imágenes/mejoras/
    interactividad. A diferencia de las 3 rondas anteriores (centradas en
    figuras y tablas con nombre propio), esta releyó el **texto corrido**
    completo de los Cap. 14, 15, 17 y 18 (y las secciones de etiología/
    hemodinámica/farmacología del 16) con `pdftotext`, comparando frase a
    frase contra el HTML ya existente — buscando cifras/protocolos/matices
    sin tabla asociada que los delatara. Resultado: **0 huecos de
    contenido nuevos** y **0 imágenes reales sin extraer** (inventario de
    `pdfimages -list` reconfirmado) — las 3 rondas anteriores ya habían
    alcanzado un nivel de fidelidad que esta relectura solo pudo
    confirmar, no ampliar. Solo 2 mejoras cosméticas encontradas (sin
    contenido clínico, pura consistencia estructural del HTML): 5 de las
    imágenes más antiguas (Fig. 14.1-14.3, 18.2, 18.4) usaban
    `<div class="article-figure-caption">` en vez de `<p>` (visualmente
    idéntico, el CSS aplica por clase — inconsistente solo dentro del
    propio archivo, corregido con un script de sustitución verificando
    después que los 21 `<article-figure-caption>` del archivo ya son
    `<p>` y que el recuento de `<div>` abiertos/cerrados seguía
    balanceado); y `.hl-purpura` (reservado para definiciones formales en
    la convención ya establecida de la app) no se usaba ni una vez pese a
    tener 4 candidatas claras — añadido a las definiciones de sepsis/
    shock séptico, TSS y anafilaxia. Publicado el informe como Artifact
    con 13 propuestas de interactividad (las 10 ya pendientes de la
    auditoría anterior, sin cambios, + 3 nuevas descubiertas en esta
    relectura del texto corrido del Cap. 18: asistente de titulación de
    furosemida IV, conversor de equivalencia de diuréticos de asa, y
    diferenciador TSS estafilocócico vs. estreptocócico).
  - **Implementación de las 13 piezas interactivas propuestas**, a
    petición explícita del usuario ("ahora aplica las mejoras
    propuestas"). Todas verificadas contra el contenido ya escrito en
    cada ficha (nunca fabricando una cifra nueva) y con Playwright antes
    de darlas por completadas:
    - **Ficha I**: gauge visual del objetivo de PAM (`#mc-pam-actual` +
      `.kinetic-row`/`.kinetic-fill` con marcador en 65 mmHg sobre una
      escala 0-120, mismo patrón ya usado en el DO₂I de Cardiología/
      Fisiopatología UCI) añadido justo debajo del selector de tipo de
      shock ya existente.
    - **Ficha II**: selector "¿qué agente para este escenario?" (6
      escenarios — inicial en séptico, 2º/3er agente en séptico
      resistente, anafiláctico, bradicardia, hipotensión de anestesia —
      basado en la Tabla 14.4 y en los perfiles de fármaco ya
      desarrollados en la propia ficha).
    - **Ficha VI**: selector de perfil hemodinámico en shock cardiogénico
      (VI/VD/obstrucción dinámica del TSVI/inflamación sistémica
      sobreañadida) — primera pieza interactiva de las Fichas VI/VII, que
      hasta ahora no tenían ninguna.
    - **Ficha XI**: diferenciador TSS estafilocócico vs. estreptocócico —
      checklist de 4 datos disponibles (hemocultivo positivo, fuente
      menstrual/quirúrgica, fuente fascitis/posparto, dolor
      desproporcionado) con un sistema de puntos simple basado en la
      Tabla 17.3, declarando explícitamente cuándo los datos son mixtos o
      insuficientes en vez de forzar un veredicto.
    - **Ficha XIV** (2 piezas): asistente de titulación de furosemida IV
      — wizard/estado-máquina (mismo patrón ya usado por el algoritmo de
      diuréticos de la guía ESC de IC en `insuficiencia-cardiaca.js`,
      replicado aquí sin importarlo, cada módulo con su propia copia)
      que recorre naïve-función renal normal (40 mg) / naïve-insuficiencia
      renal (60-80 mg) / dosis crónica oral equivalente, evalúa la
      diuresis a las 2h, y si es inadecuada pregunta si ya se alcanzó el
      máximo de 200 mg antes de declarar resistencia a furosemida; y
      conversor de equivalencia de diuréticos de asa (1 campo numérico,
      furosemida → bumetanida/torsemida por la razón 40:1:20 de la Tabla
      18.4).
    - **Ficha XVI**: selector de fármaco de control de frecuencia en FA
      por comorbilidad (general/HFrEF/hiperadrenérgico/titulación
      rápida/control crónico/WPW), basado en la Tabla 19.1 y en los
      matices de eficacia ya citados en la ficha (diltiazem más rápido,
      amiodarona preferida en HFrEF, betabloqueantes en estados
      hiperadrenérgicos, digoxina solo para control crónico, y el aviso
      explícito de que ninguno de estos fármacos debe usarse en WPW).
    - **Ficha XIX**: calculadora de delta de troponina (hs-cTn inicial +
      a la 1h → % de cambio, veredicto de isquemia aguda si &gt;10% según
      el protocolo de 3 pasos ya descrito en la propia ficha).
    - **Ficha XX**: cronómetro de tiempo puerta-balón en tiempo real
      (botón "Iniciar" que arranca un `setInterval` de 1s, semáforo
      `tfg-estado-ok/warn/danger` en los cortes de 90/120 min ya citados
      en el micro-perfil "STEMI — tiempo puerta-balón").
    - **Ficha XXI**: selector de antihipertensivo en disección aórtica
      (5 escenarios — titulación rápida, monoterapia, mantenimiento oral,
      vasodilatador ya con betabloqueante, coexistencia con IC aguda —
      basado en la Tabla 20.5, remarcando la regla de la propia ficha de
      que un vasodilatador SIEMPRE debe combinarse con betabloqueante).
    - **Ficha XXII**: simulador paso a paso del algoritmo ACLS — segundo
      wizard/estado-máquina del módulo, recorriendo la rama FV/TV
      (desfibrilar → 2 min RCP → epinefrina + 2º choque → amiodarona/
      lidocaína tras el 3er choque sin respuesta) y la rama AESP/asistolia
      (RCP + epinefrina cada 3-5 min, buscando "las T", con posibilidad de
      pasar a la rama de FV/TV si el ritmo cambia) hasta RCE o
      consideración de terminar la reanimación — fiel a la lógica de
      decisión del `algo-flow` ya existente (recreado por la restricción
      de copyright de la Fig. 21.2 original de la AHA), nunca a la imagen
      protegida.
    - **Ficha XXIII**: intérprete de ETCO₂ a los 20 minutos (1 campo
      numérico contra el umbral 10-15 mmHg, con una zona límite explícita
      entre ambos cortes citados por la fuente en vez de fingir un único
      corte consensuado).
    - **Ficha XXIV**: checklist puntuable de los 7 predictores de mal
      pronóstico de la Tabla 21.5 (conteo en vivo, mismo patrón que el
      checklist DRESS de Fisiopatología UCI, con el aviso de que cada
      criterio predice mal resultado aislado — no hace falta que se
      acumulen varios — y de respetar el día de evaluación de cada uno).
    - Verificado con Playwright (viewport 390×844, navegación real
      ficha→abrir→voltear→panel activo, no solo lectura del DOM oculto):
      las 13 piezas responden correctamente a valores concretos (PAM 55 →
      gauge rojo; angiotensina II como 3er vasopresor; TSS con fascitis
      marcada → estreptocócico; TSVI → aviso de betabloqueante no
      vasodilatador; wizard de furosemida navega renal-normal→40mg;
      conversor 80mg→2mg bumetanida/40mg torsemida; troponina 10→25 →
      Δ150%/isquemia; cronómetro puerta-balón cuenta en tiempo real;
      nicardipino → aviso de "siempre con betabloqueante"; ACLS wizard
      desfibrilable→2º paso; ETCO₂ 8 → "improbable"; checklist de
      pronóstico cuenta 1/7; WPW → aviso de no usar ningún fármaco de la
      tabla; CHA₂DS₂-VASc y el resto de calculadoras ya existentes sin
      regresiones); sin errores de consola ni 404 reales; sin overflow
      horizontal a 390px en ninguna de las 24 fichas. Con esta ronda, las
      13 propuestas de interactividad de la Segunda Auditoría quedan
      todas implementadas — ninguna pendiente.
  - **Tercera auditoría, esta vez cubriendo también Merino Cardiología (a
    petición explícita: "revisa el contenido de neumología y de
    cardiología del merino respecto a la bibliografía... buscar los huecos
    de contenido, las mejoras, las posibles partes interactivas... y
    corregir las partes interactivas")**, con 4 agentes en paralelo
    repartiéndose las 24 fichas por tramos de páginas de los 2 PDF fuente
    (Fichas I-V/shock pág. 1-35, VI-XII/shock pág. 36-70,
    XIII-XVIII/cardiac-disorders pág. 1-37, XIX-XXIV/cardiac-disorders pág.
    38-72). Tras las 4 rondas de auditoría previas ya documentadas, este
    módulo tenía fidelidad muy alta — 5 errores reales (uno clínicamente
    significativo) y ~20 huecos de contenido puntuales, ningún hueco
    estructural grande:
    - **Ficha XVI** (`mc-fa-frecuencia`): "excepto en el hiperparatiroidismo"
      — error de transcripción real, la fuente dice "hyperthyroidism"
      (hipertiroidismo), una entidad endocrina distinta. Corregido.
    - **`calcCha2ds2Vasc()` (Ficha XVII) — bug real de umbral, el más
      significativo de esta ronda**: la Tabla 19.2 define "Definido" como
      ≥2 puntos en varones / ≥3 en mujeres, pero el código nunca evaluaba
      el umbral de 2 puntos para varones — un varón con exactamente 2
      puntos (p. ej. solo "Edad &gt;75") caía en la rama "Riesgo
      intermedio. Considerar" en vez de "Riesgo definido", infrarrecomendando
      anticoagulación en un escenario real y frecuente. Corregido
      calculando `umbralDefinido`/`umbralConsiderar` explícitamente por
      sexo (2/1 en varones, 3/2 en mujeres) en vez de un único corte fijo
      "≤2" compartido para ambos sexos; el caso límite de una mujer con
      solo el punto de "sexo femenino" (1 punto, insuficiente para
      "Considerar" según la Tabla 19.2) ahora también se distingue
      correctamente.
    - **Ficha XXII (`mc-paro-soporte`) — las "5 T" de las causas
      reversibles de paro cardíaco estaban incompletas**, tanto en el
      `kv-row` de causas de AESP como en el `algo-step` de FV/TV y en el
      mensaje final del wizard ACLS (JS): faltaba "Tóxicos" en las 3
      ubicaciones (solo se listaban 4 de las 5 T reales de la Fig. 21.2:
      neumoTórax, Taponamiento, Tromboembolismo pulmonar, oclusión
      Trombótica coronaria). Añadido en las 3.
    - **Ficha XXI (`mc-diseccion-aortica`)**: la frase "opioides IV
      precoces (activan el sistema simpático, agravando la disección)"
      invertía la causalidad — es el **dolor no tratado** el que activa el
      sistema simpático; los opioides son la intervención que lo previene.
      Reformulada explícitamente.
    - **Ficha II (`mc-vasopresores`)**: la cifra "titulando cada 5 min"
      para norepinefrina no tenía respaldo textual directo en el Cap. 14
      (a diferencia de otros fármacos de la misma tabla, donde "cada 5
      min" sí viene citado explícitamente) — suavizada a "titulando al
      alza según respuesta" en las 3 ubicaciones (Ficha II, Ficha VII, y
      el selector JS de vasopresor por escenario), sin tocar el resto de
      intervalos de 5 min de otros fármacos (nitroglicerina, nitroprusiato,
      esmolol, nicardipino), todos ellos sí confirmados contra sus tablas
      de origen.
    - **~20 huecos de contenido**, verificados uno a uno contra el texto
      exacto de la fuente antes de incorporarlos: en Ficha I, el estudio
      real de UCI (2/3 de mediciones con manguito inapropiado, 62%
      difiriendo &gt;10 mmHg de la PA directa) y la nota de que un manguito
      demasiado *grande* no requiere cambio (solo uno demasiado pequeño);
      en Ficha II, la excepción real del Cap. 14 para fenilefrina (shock
      séptico con FA rápida, antes ausente — se mantuvo también la
      excepción de TSVI ya citada, con enlace a Ficha VII); en Ficha VII,
      que las infusiones de levosimendán se limitan habitualmente a 24h;
      en Ficha XII, que los antihistamínicos alivian prurito/rinorrea pero
      con eficacia no probada; 2 cross-links internos nuevos (Ficha
      VI→Ficha XIII para el desarrollo completo del fallo del VD, Ficha
      VII→Ficha XX para las estrategias de reperfusión), implementados con
      IDs de botón propios y sus propios listeners en JS —nunca
      reutilizando `.tx-link`, que es global de `nefrologia/index.js` y
      colisionaría—; en Ficha XVIII, el párrafo de definición de la TV
      (FC 140-200 lpm, monomórfica/polimórfica, umbral de sostenida
      &gt;30s) que faltaba por completo pese a usarse después sin
      definir, la mención de que existen 5 tipos de PSVT, y la **Tabla
      19.5 completa de fármacos que inducen torsade** (14 fármacos por
      categoría — antes solo resumida en prosa, rompiendo la convención
      del proyecto de recrear siempre las tablas de la fuente íntegras);
      en Ficha XVII, la cifra de "riesgo de ictus ≥5× mayor" para
      indicación definida y la posibilidad de medir actividad anti-Xa en
      insuficiencia renal; en Ficha XVI, el matiz de que algunos estudios
      no encuentran diferencia de eficacia entre amiodarona y diltiazem
      para cardioversión; en Ficha XX (la de mayor volumen de huecos):
      las dosis intermedias reales de tenecteplasa (35/40/45 mg, antes
      solo los 2 extremos), la taquifilaxia de nitroglicerina &gt;24h, las
      dosis completas de eptifibatida/tirofibán (antes solo nombradas sin
      dosis), el tope de infusión de heparina (1.000 U/h) y su duración
      típica (24-48h), las dosis completas de bivalirudina/fondaparinux
      (antes solo nombradas como "alternativa en TIH" sin cifra), y la
      contraindicación/precaución de la inhibición del SRAA (angioedema
      previo/insuficiencia renal); en Ficha XXI, el bolo de repetición de
      esmolol antes de cada incremento, la dosis eficaz típica de
      nitroprusiato (2-5 μg/kg/min) y el antídoto de tiosulfato, y el
      mecanismo de los pulsos desiguales (obstrucción de la subclavia
      izquierda); en Ficha XXII, el consejo práctico de volumen de
      insuflación con bolsas de 1L; en Ficha XXIV, la recomendación de
      evitar dextrosa IV, el 3er criterio de EEG altamente predictivo
      (isoeléctrico &lt;2 μV, antes solo 2 de los 3 reales) y el matiz de
      ACV masivo/HIC con herniación + el momento "día 2 o después" en el
      criterio de edema cerebral difuso de la Tabla 21.5 — estos 2 últimos
      actualizados también en el checklist puntuable `calcPronostico()`
      para mantener el texto sincronizado entre el `algo-flow` de
      referencia y la calculadora.
    - **5 piezas de interactividad nuevas**, todas con fórmula/criterios
      explícitos en la fuente: calculadora de volumen de reanimación
      asanguínea (Tabla 15.4: VP=40/36 mL/kg por sexo → DVP=VP×%pérdida →
      VR=DVP×1 coloide/×3 cristaloide, Ficha IV); semáforo "¿estoy en
      objetivo?" contra los 8 parámetros de la Tabla 16.2 —hemodinámica/
      perfusión/oxigenación tisular— con cada campo opcional evaluado
      independientemente (Ficha VII); asistente paso a paso (Sí/No, mismo
      patrón `renderXxxWizard()`/`initXxxWizard()` que el wizard ACLS ya
      existente) del manejo escalonado de la TAM — corrección electrolítica
      + magnesio empírico → si persiste, metoprolol (sin EPOC) o
      verapamilo (con EPOC) (Ficha XVIII); el cronómetro de tiempo
      puerta-balón ya existente ganó un segundo modo puerta-aguja
      (objetivo &lt;30 min) mediante un `&lt;select&gt;` que cambia el
      umbral evaluado sin duplicar la lógica del temporizador (Ficha XX);
      e indicador de estado de la temperatura frente al objetivo del TTM
      (Tabla 21.3: ≤37,5°C objetivo, &gt;37,7°C dispara enfriamiento
      activo, &lt;32°C aviso de hipotermia excesiva) (Ficha XXIV).
    - Verificado con Playwright: el bug de CHA₂DS₂-VASc corregido en ambos
      casos límite (varón con 2 puntos → "Riesgo definido"; mujer con solo
      el punto de sexo → "Riesgo mínimo", ya no "Considerar"); las 5 T de
      ACLS presentes con "Tóxicos"; la frase de disección aórtica
      corregida; el hipertiroidismo corregido; la calculadora de volumen
      de reanimación da 1680 mL para 70kg/varón/20%/cristaloide (VP=2800,
      DVP=560, ×3); el semáforo de objetivos evalúa correctamente los
      campos rellenos; el wizard de MAT completa su recorrido de 2
      preguntas hasta metoprolol/verapamilo; el cronómetro puerta-aguja
      cuenta con el umbral de 30 min; el indicador TTM da "iniciar
      enfriamiento activo" a 38,0°C; las dosis de tenecteplasa/eptifibatida/
      bivalirudina y la Tabla 19.5 completa están presentes; sin overflow
      horizontal ni errores de consola reales (el único 404 es el
      `favicon.ico`, ya documentado como inocuo) en ninguna de las 13
      fichas tocadas.
  - **Diagrama de receptores adrenérgicos (Ficha II, vasopresores)**, a
    petición explícita del usuario, con una infografía de referencia
    propia sobre receptores α/β adjunta como inspiración visual — no
    copiada literalmente (esa imagen desarrolla 7 partes de farmacología
    general de receptores adrenérgicos con mucho más detalle del que
    necesita esta ficha; se adaptó solo lo relevante para explicar los
    fármacos ya presentes en la app). Nuevo bloque `.card` justo antes del
    selector "¿Qué agente para este escenario?", con 3 piezas:
    1. **Diagrama SVG estático** de mecanismo (α₁→Gq→IP₃/DAG/Ca²⁺→
       vasoconstricción; β₁→Gs→AMPc/PKA→↑FC/↑contractilidad; β₂→Gs→AMPc→
       vasodilatación), con una nota explícita de que es
       <strong>farmacología general</strong> complementaria a Marino Cap.
       14, no un diagrama del propio capítulo — mismo criterio de
       transparencia fuente-vs-genérico ya aplicado en el resto del
       proyecto (p. ej. la ley de Hagen-Poiseuille/ecuación de Fick en
       Cardiología). Colores reutilizados de la paleta ya existente
       (`--accent-red`=α₁, `--accent-purple`=β₁, `--accent-green`=β₂) —
       deliberadamente **no** se usó `--accent-blue` para evitar el gotcha
       ya documentado de que es casi idéntico a `--accent-yellow`.
    2. **Selector de fármaco** (`#mc-receptor-farmaco`, los 8 agentes ya
       desarrollados en la ficha + dobutamina de la Ficha VII) que
       actualiza 3 `.kinetic-row` (α₁/β₁/β₂, reutilizando el mismo
       componente de gauge ya usado en el resto de la app, sin CSS nuevo)
       con el nivel de activación de cada receptor — 4 niveles (Nulo/
       Leve/Moderado/Intenso, `RECEPTOR_NIVEL_TEXTO` en
       `merino-cardiologia.js`) que son una <strong>traducción visual</strong>
       de los calificativos cualitativos ya usados en el texto de cada
       fármaco ("predominante", "leve", "puro", "progresiva"), no una
       cifra de afinidad nueva o inventada.
    3. **Selector de dosis condicional** (`#mc-receptor-dosis`, solo
       visible para norepinefrina y dopamina): ambos fármacos son los
       únicos de la ficha cuyo texto ya da un desglose explícito por dosis
       con receptor predominante distinto en cada tramo — norepinefrina
       (&lt;10 μg/min: β₁ leve-moderado + α₁ discreto · &gt;10 μg/min: α₁
       predominante, techo ~30 μg/min) y dopamina (≤3 μg/kg/min:
       receptores <strong>dopaminérgicos D1</strong>, no adrenérgicos,
       vasodilatación renal/esplácnica · 3-10: β₁ · &gt;10: α₁
       progresivo) — exactamente los mismos 2 fármacos con tramos de
       dosis ya citados en la propia ficha, sin fabricar cortes numéricos
       nuevos para el resto (epinefrina, por ejemplo, se dejó como una
       única entrada con nota de fidelidad explícita: la fuente no da un
       punto de corte numérico entre predominio β y α, así que no se
       inventó uno).
    **Vasopresina y angiotensina II tratadas como caso especial**: ambas
    producen vasoconstricción pero por receptores **no adrenérgicos** (V1
    y AT1 respectivamente) — el selector las reconoce (`noAdrenergico:
    true`) y oculta las 3 barras α/β en vez de forzarlas a "0/0/0" sin
    explicación, mostrando solo el texto del mecanismo real; evita el
    error de conceptualmente mezclarlas con el sistema adrenérgico que sí
    protagoniza el resto de la ficha. `RECEPTORES_FARMACO` en
    `merino-cardiologia.js` es la única fuente de verdad de estos datos —
    añadir un fármaco nuevo con perfil de receptor conocido a otra ficha
    futura es solo añadir una entrada ahí, sin tocar el SVG.
    Verificado con Playwright: las 8 opciones del selector de fármaco
    devuelven el texto/barras correctos (fenilefrina → α₁ Intenso/resto
    Nulo; norepinefrina bajo→alto cambia de β₁ Moderado/α₁ Leve a α₁
    Intenso/β₁ Leve; dopamina recorre sus 3 tramos, incluido el tramo D1
    con las 3 barras en Nulo y la nota de receptor no adrenérgico;
    dobutamina → β₁ Intenso/β₂ Leve; vasopresina/angiotensina II ocultan
    las barras y muestran el texto de mecanismo no adrenérgico; epinefrina
    muestra los 3 receptores activos más la nota de fidelidad); el
    selector de dosis solo aparece para norepinefrina/dopamina y se
    reconstruye correctamente al cambiar de fármaco; deseleccionar el
    fármaco oculta dosis/barras/resultado; sin overflow horizontal a
    390px ni errores de consola. Sin cambios de CSS (reutiliza `.card`,
    `.kinetic-row`/`.kinetic-fill`/`.kinetic-track`/`.kinetic-label`,
    `.result-box`, `.hl-rojo`, `.form-group` ya existentes), así que no
    hizo falta bump de cache-busting.
  - **Auditoría del propio diagrama de receptores y sus 12 correcciones
    aplicadas**, a petición explícita del usuario ("Haz un informe de
    mejoras de esa parte que acabas de poner..." seguido de "Aplica los
    hallazgos de la auditoria"). Publicado primero como Artifact
    (severidad por categoría: precisión farmacológica/huecos de
    contenido/diseño visual/interactividad), verificado contra el texto
    exacto del PDF (`docs/marino-2024-shock-caps14-17.pdf`) antes de
    reportar nada — mismo estándar del resto de auditorías del
    proyecto —, y aplicado íntegro a continuación:
    - **F1 (precisión)**: el nivel α₁ de epinefrina estaba en "Intenso"
      (3/3) sin justificación clara frente a fenilefrina/norepinefrina en
      rango alto (agonistas α predominantes o puros) — bajado a
      "Moderado" (2/3), con la `nota` ampliada explicando por qué (el
      componente β sigue siendo protagonista clínico en la mayor parte
      del rango de dosis de epinefrina).
    - **F2 (precisión)**: el tramo bajo de dopamina especificaba
      "receptores dopaminérgicos <strong>D1</strong>" — el Cap. 14 solo
      habla de "receptores dopaminérgicos" sin distinguir subtipo.
      Quitado "D1" del campo `receptor` (texto principal) y movido a un
      campo `nota` nuevo aclarando que la distinción D1/D2 es
      farmacología general no citada por este capítulo — mismo patrón ya
      usado en la `nota` de epinefrina.
    - **H1 (hueco de contenido)**: el texto de vasopresina solo
      describía el receptor V1 (el relevante para su uso como
      vasopresor) — ampliado para mencionar también V2 (túbulo
      colector, reabsorción de agua) y V3 (hipófisis anterior,
      liberación de ACTH), aclarando que solo V1 es el que importa para
      esta ficha de shock.
    - **H2 (hueco de contenido)**: añadida una nota bajo el selector de
      dosis aclarando que Nulo/Leve/Moderado/Intenso es una lectura
      cualitativa <strong>dentro de cada fármaco</strong>, no una escala
      estandarizada para comparar intensidad absoluta entre fármacos
      distintos (evita leer, p. ej., el "Moderado" de un fármaco como
      equivalente en magnitud real al "Moderado" de otro).
    - **V1 (visual, la de mayor impacto)**: el SVG estático no reaccionaba
      en absoluto a la selección — quedaba igual de coloreado eligiera lo
      que eligiera el usuario, desconectado de las barras `.kinetic-row`
      de debajo. Añadidos IDs a los 3 `<g>` de columna
      (`mc-recep-g-a1`/`-b1`/`-b2`) y una función nueva
      `resaltarDiagramaReceptores(activacion)` (`merino-cardiologia.js`)
      que fija la opacidad de cada columna según su nivel 0-3
      (`RECEPTOR_OPACIDAD_NIVEL = [0.15, 0.45, 0.7, 1]`, con transición
      CSS de 0,25s) — llamada desde `mostrarResultadoReceptor()` con los
      mismos datos que ya pintan las barras, y reseteada a opacidad
      plena (`null` → 1 en las 3) al deseleccionar, para que el estado
      "sin fármaco elegido" siga siendo el diagrama neutro/decorativo
      original.
    - **V2 (visual)**: los textos de mecanismo (↑IP₃/DAG, ↑AMPc, etc.)
      subidos de `font-size="7.5"` a `"8.5"` — apenas legibles a la
      resolución del móvil en el tamaño original.
    - **V3 (visual)**: "Vaso-" / "constricción" y "Vaso-" / "dilatación"
      partidos en 2 líneas con un guion que no corresponde a una
      hifenación real del español (ambas son palabras compuestas sin
      guion) — unificados en una sola línea centrada
      ("Vasoconstricción"/"Vasodilatación").
    - **V4 (visual)**: las etiquetas "extracelular"/"intracelular" solo
      aparecían pegadas al borde izquierdo del diagrama, lejos de la
      columna β₂ — duplicadas también en el borde derecho
      (`text-anchor="end"`) para que se lean sin tener que recorrer todo
      el ancho del SVG con la vista.
    - **V5 (visual, sin cambio de código)**: documentado en un comentario
      HTML + en el propio pie de figura que el rojo de α₁ coincide por
      pura casualidad de paleta con el rojo de "alarma/riesgo" del resto
      de la app (solo 5 acentos disponibles para muchos más conceptos) —
      no es una señal de que la vasoconstricción α₁ sea en sí misma
      peligrosa.
    - **I1 (interactividad, la de mayor impacto tras V1)**: elegir
      norepinefrina/dopamina auto-seleccionaba `farmaco.dosis[0]` (el
      tramo bajo) sin que el usuario hubiera elegido ningún rango de
      dosis — podía leerse como si ese fuera el único/el más
      representativo. Corregido: el `<select>` de dosis ahora arranca
      con `<option value="">— elige un rango —</option>`, y
      `actualizarReceptorFarmaco()` mantiene barras/resultado ocultos
      (`display:none`) hasta que se elige un tramo real — mismo criterio
      de "abstenerse en vez de asumir" ya aplicado a los guards
      `.value === ''` de las calculadoras numéricas del resto del
      proyecto, aquí aplicado a un `<select>` en vez de a un campo
      numérico.
    - **I2 (interactividad)**: añadida una frase conectora antes del
      selector de fármaco ("Elige uno de los agentes de la Tabla 14.4 de
      más arriba...") — antes el selector aparecía sin ningún puente
      textual con la tabla de dosis ya presente más arriba en la misma
      ficha.
    - **I3**: confirmado correcto en la propia auditoría, sin cambios.
    - Verificado con Playwright (viewport 390×844): I1 confirmado (sin
      tramo elegido, barras/resultado ocultos; opacidad del SVG en 1 en
      las 3 columnas); F1 confirmado (epinefrina α₁ → "Moderado"); F2
      confirmado (el texto principal de dopamina bajo ya no dice "D1",
      solo la `nota` aparte lo menciona para explicar la omisión); H1
      confirmado (V2/V3/ACTH presentes en el texto de vasopresina); V1
      confirmado con una captura de pantalla real del SVG (norepinefrina
      dosis alta: α₁ a opacidad 1, β₁ a 0,45, β₂ a 0,15 — coincide
      exactamente con los niveles Intenso/Leve/Nulo de las barras); I2/H2
      confirmados presentes en el DOM; deseleccionar el fármaco resetea
      la opacidad de las 3 columnas a 1; recorrido completo de las 24
      fichas del corkboard sin errores de consola ni overflow horizontal
      a 390px. Sin cambios de CSS, así que no hizo falta bump de
      cache-busting.


### Receptores adrenérgicos animados con Motion (octubre 2026)

A petición explícita del usuario. Primero evaluó una lista de librerías (three.js, Motion, fabric.js,
ffmpeg.wasm, deck.gl, canvas-confetti, drei, cobe, twgl.js, rive) y, tras ver una maqueta en un Artifact
(«Esto es una pasada… ayuda muchísimo a entender la fisiología»), pidió llevarla a la app.

- **Motion 11.18.2** (MIT) es la primera y única librería externa de la app: copiada en `js/vendor/motion.js`
  (build UMD, `window.Motion`), con su licencia y un `README.md` de librerías copiadas. `js/core/motion.js`
  (`cargarMotion()`, `sinMovimiento()`) la carga solo la primera vez que se elige un fármaco.
- **Ficha II (Vasopresores) de Merino Cardiología**: el diagrama SVG estático de los receptores α₁/β₁/β₂ se
  sustituye por `js/modules/cardiologia/receptores-animados.js` (`crearEscenaReceptores(raiz)` →
  `{ mostrar(datos|null) }`). Cuenta el mecanismo en 5 pasos (llega el fármaco, se une, proteína G, segundos
  mensajeros, efecto) con botones Reproducir / ◀ / ▶. Cuántas moléculas se unen a cada receptor es el nivel
  0-3 de `RECEPTORES_FARMACO` (la misma fuente que las barras); el contenido de cada columna es el del diagrama
  anterior (farmacología general, complementaria a Marino Cap. 14). Vasopresina, angiotensina II y la dopamina a
  dosis bajas: las moléculas rebotan y un recuadro dice cuál es su receptor (`receptorNoAdr`). Sin fármaco, el
  diagrama completo quieto. Con «reducir movimiento» o sin Motion, el estado final directamente.
- **Bugs encontrados al verificar**: Motion escribe la opacidad de los elementos SVG como atributo, así que fijarla
  con `style.opacity` la tapaba (la cascada nunca se encendía); y no aplica escalas ni desplazamientos a un `<g>`
  (se animan como número de 0 a 1 que escribe el atributo `transform`). Pulsar ◀ dos veces seguidas dejaba
  terminar la animación anterior sobre el paso nuevo: ahora se paran las animaciones en curso (`parar()`).
- Verificado con Playwright (390 y 360 px): las 8 opciones y los tramos de dosis, el paso a paso hacia atrás y
  adelante con y sin «reducir movimiento», sin ids duplicados, sin desbordamiento ni errores. Cache-busting
  `?v=20261027`.

### RitmoLab (Farmacotips): estudio para un simulador de arritmias (octubre 2026)

A petición del usuario («ver si con ingeniería reversa pudiéramos replicar el siguiente simulador de arritmias… y
además incluirlo, porque en el PIF de cardiología hay que estudiar arritmias y electrocardiogramas»). La web
(`farmacotips-ritmolab.farmacotips.chatgpt.site`) está bloqueada desde el entorno; el usuario mandó la página
guardada, que solo trae el HTML del servidor (los programas van aparte y no se guardaron). Se ve:

- 17 escenarios: TSV por reentrada nodal, FA respuesta rápida, flutter 2:1, FA preexcitada (WPW), TV monomórfica
  estable e inestable, torsades, FV, TV sin pulso, bradicardia sinusal, BAV completo, Mobitz II, Mobitz I,
  asistolia, AESP, taquicardia sinusal y extrasístoles ventriculares.
- Modos Estudio y Simulación. Por caso: paciente (nombre, edad, frase, conciencia/pulso/perfusión, un 3D), monitor
  multiparámetro (ECG II, FC, SpO₂, PA, pletismografía, FR, EtCO₂, temperatura), ECG de 12 derivaciones con «lectura
  guiada» y ajustes de velocidad y ganancia, acciones (acceso IV, O₂, parches, RCP, ECG, laboratorio, imagen,
  fármacos, terapia eléctrica), «ruta de manejo» en pasos con su referencia, registro de eventos y revisión final.
- Fuentes que cita: algoritmo ACLS de taquicardia de la AHA 2025 y guía ACC/AHA/HRS 2015 de TSV. Avisa de que los
  pacientes y ECG son sintéticos y sin validación clínica.

Decisiones del usuario: puerta propia en la raíz y algoritmos AHA 2025 como fuente de lo que no cubre Marino
(pendiente de que mande los PDF). Plan en `autonomo/TABLERO.md`.

## Merino Cardiología: revisión R4 del plan Marino, caps. 14-17 (octubre 2026)

`marino-r4` (revisión sin construir), 2 vueltas, 12 fichas de shock. Corregido:
- vasopresina en U/min con la nota de la errata «U/h» del libro;
- 3.er vasopresor del shock séptico = epinefrina (no angiotensina II);
- fuera justificaciones que no son de Marino (escenario de bradicardia quitado del selector);
- tabla de la Fig. 15.3 releída;
- Fig. 15.6 con Hb ≥7-9 y la errata TEG anotada;
- notas de fuentes: epinefrina 2.ª/3.ª línea, NA ≥0,2, PCP 18-20/19-20, catéter de AP, rangos TEG;
- límites y aviso en las calculadoras de volumen y de objetivos del shock cardiogénico;
- remisiones «Ficha N» en texto plano → botones con el nombre de la ficha.

Parte: `autonomo/partes/2026-10-14-marino-r4.md`.

## Merino Cardiología: revisión R5 del plan Marino, caps. 18-21 (octubre 2026)

`marino-r5` (revisión sin construir), 2 vueltas, 12 fichas. Corregido:
- erratas de dosis con nota: dabigatrán 150 mg y HNF 60 U/kg;
- TV hasta 200 J;
- selectores de WPW y disección según la fuente;
- 737 casos; Fig. 19.5 releída;
- `.puntuable` en CHA₂DS₂-VASc y pronóstico posparo;
- límites en QTc, TTM, ETCO₂ y furosemida;
- notas de fuentes (T de la AESP 4/5, verapamilo, metoprolol, Fig. 20.2);
- huecos de amiodarona IV y warfarina;
- tablas que se salían a 360 px;
- remisiones «Ficha N» → botones.

Va encima de R4. Parte: `autonomo/partes/2026-10-14-marino-r5.md`.

Tras aprobar R4, el usuario pidió reponer el escenario «Hipotensión con bradicardia» del selector de vasopresores con
el texto del libro. Marino no da un vasopresor para ese escenario. El texto nuevo lo dice y recoge lo que sí da la
fuente: la dopamina a 3-10 μg/kg/min estimula los receptores β y su riesgo es la taquicardia (pág. 14); la
fenilefrina puede acompañarse de bradicardia (pág. 15).

## Bradicardias, bloqueos AV y marcapasos en el corazón eléctrico (`b3-bradi`, 31/10/2026)

Versión corta del Consejo del 28/10: los 5 estados `pend-*` de la familia «Lentos» del corazón eléctrico pasan a ser estados vivos
(`bradi`, `bav1`, `bav2` con Mobitz I/II/2:1, `bav3` con escape nodal/ventricular, `marcapasos`). Dos fuentes, sin fusionar: la ESC 2021
de estimulación (`docs/esc-2021-estimulacion-cardiaca.pdf`, PDF = impresa + 1) para lesión, síntomas e indicaciones, y la ficha ECG de PIF
Cardiología (López Ramírez 2012, parte 2 = impresa − 59, parte 3 = impresa − 125) para los criterios ECG, que la ESC no trae. `cf()` admite
un 5.º campo `pdf`. Motor: `hisCada`, `escapeCada`, espigas y sin eco auricular con `navF` > 2,5. Barrido a 12,5 mm/s en «Lentos».
Pendiente: Wenckebach progresivo (fatiga gradual del nodo). Parte `autonomo/partes/2026-10-31-b3-bradi.md`.
