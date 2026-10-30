# Radar · entradas

Formato en `LEEME.md`. Norte en `NORTE.md`; fases en `HOJA-DE-RUTA.md`. La más reciente, arriba.
«no consta» = no está en las fuentes del proyecto; no se rellena.

## 2026-10-23/25 · primeras entradas (ya estudiadas)

| Fecha | Tipo | Qué | Veredicto |
|---|---|---|---|
| 2026-10-25 | repositorio | NV-Reason-CT (NVIDIA): IA que lee TC de tórax y abdomen | Fase 4 (lista de hallazgos, compañera de estudio) y nivel 3 · `autonomo/ideas/ingenieria-inversa/nv-reason-ct.md` |
| 2026-10-25 | repositorio | leanrea | Integrado en la skill `/ingenieria-reversa` v2 |
| 2026-10-25 | plugin | claude-code-setup (Anthropic) | Recomendaciones en la etapa A (graft, hooks, `/cerrar-tanda`, pruebas en GitHub) |
| 2026-10-23 | repositorio | clinical-ai-skills y research-agent-skills | Instaladas 8 skills (`.claude/skills/SKILLS-EXTERNAS.md`) |
| 2026-10-23 | web | anesthbeta (ETE) | Fases 0 y 2 · informe `anesthbeta.md` |
| 2026-10-23 | web | EchoSuite | Fases 0, 3 y G1 · `echosuite.md`, `echosuite-2.md` |
| 2026-10-23 | web | AngioView | Fase 2 · `angioview.md`, `angioview-2.md` |
| 2026-10-23 | web | NavRad Anatomy | Fase 4 · `navrad.md`, `navrad-2.md`, `navrad-3.md` |
| 2026-10-23 | web | Radiology Assistant | Fase 0 (bibliografía), G4, G5 · `radiologyassistant.md`, `-2.md` |
| 2026-10-23 | web | RitmoLab | Bloque 3 y G2 · `ritmolab.md`, `ritmolab-2.md` |
| 2026-10-23 | repositorio | REA (morluto/rea) | Herramienta de apoyo de `/ingenieria-reversa` |
| 2026-10-25 | tuit | Hilo sobre el gasto de uso de Claude Code (Boris Cherny) | Comprobado; lecciones de ahorro en la skill y la etapa A |

## Tanda pendiente

(Aquí se juntan las entradas nuevas con decisión pendiente; `/radar tanda` las lleva al usuario de una vez.)

- 2026-10-28 · Bandeja #27 · paper HSA (Carden 2026, Neurocrit Care; de pago): espera el PDF del usuario
- 2026-10-28 · Bandeja #27 · paper de asincronías de disparo (Mireles-Cabodevila 2022): espera el PDF del usuario
- 2026-10-28 · Bandeja #27 · idea TV del tracto de salida del VD con el ejercicio: ¿al bloque 3 (fase 1)?
- 2026-10-28 · Bandeja #27 · idea lazo presión-volumen (precarga y distensibilidad) y la web CardioRender: ¿a fase 2?
- 2026-10-29 · Bandeja #27 · 3 tuits sin leer (@shinriha_pt, @WithAScalpel, @sindenzu1): x.com ya se lee desde la
  sesión (30/10); se leen en la próxima Bandeja, no hace falta captura
- 2026-10-29 · Bandeja #27 · web CardioTeca, tablas de dosis de anticoagulantes y antiarrítmicos: ¿bibliografía de fase 3?
- 2026-10-30 · Bandeja #27 · paper neuropronóstico tras parada (Benghanem 2026, Ann Intensive Care; acceso abierto,
  pero la revista está cerrada en la red): espera el PDF del usuario o que se abra el dominio
- 2026-10-30 · Bandeja #27 · paper de los seis principios del ECG en el IAM oclusivo (Helseth 2026, EHJ ACC; de
  pago): espera el PDF del usuario
- 2026-10-30 · Bandeja #27 · idea bloqueo de rama dependiente de la frecuencia (fase 3 y fase 4): ¿al bloque 3?
- 2026-10-30 · Bandeja #27 · idea interdependencia ventricular: ¿mejora de Circulación viva (fase 2)?
- 2026-10-30 · Bandeja #27 · caso de eco (HVI + estructura en la mitral): ¿banco de casos de eco (G1)?

## Fichas de triaje (las 30 entradas, la más reciente arriba)

Campos: fecha · tipo · enlace · lo que dijo · qué es · sirve a · fuente que lo respalda · licencia · coste · veredicto.

### DeepTutor (HKUDS): tutor con IA, ¿sirve para la Mayéutica?
- **Fecha / tipo**: 2026-10-30 · repositorio
- **Enlace**: https://github.com/HKUDS/DeepTutor (preprint arXiv 2604.26962; v1.7.0 del 28/10/2026, 51k estrellas)
- **Dijo**: «Comprueba que nos sirva para mejorar mayéutica»
- **Qué es**: un «espacio de estudio» con IA del laboratorio de datos de la Universidad de Hong Kong. Servidor en
  Python (FastAPI) + web en Next.js/React; necesita una clave de un modelo de IA (OpenAI, Anthropic o uno local) y,
  para sus libros, un buscador sobre tus PDF (RAG: la IA busca el trozo del PDF antes de responder). Hace chat tutor,
  «Quiz», «Guided Learning» con una «puerta de dominio» por tipo de pregunta (no avanzas hasta dominarlo), «Mastery
  Path», práctica con fallos y repetición programada, fichas de memoria, «libros vivos» generados de tus fuentes y
  explicaciones de un párrafo («Dito»). El README no explica cómo genera ni corrige las preguntas, ni el criterio de
  la puerta de dominio; tutor socrático solo como complemento de la comunidad
- **Comparado con lo nuestro**: nuestra Mayéutica ya tiene, escritas a mano y fieles a la ficha con «Ver en el
  texto»: guía en el orden del texto, examen, casos que evolucionan, repaso de lo fallado, revisión por objetivos y
  (aprobado el 28/10) repaso espaciado; B-040 (`educacion-pionera`) ya cubre POE, error productivo, autoexplicación y
  entrelazado. DeepTutor genera las preguntas con IA en el momento: sin página de la fuente garantizada (su medida de
  calidad mira solo si encuentra el trozo, no si la respuesta es correcta)
- **Sirve a**: nivel 1 (Estudiar), de lejos. Ninguna G directa
- **Fuente**: no es fuente; solo método
- **Licencia**: Apache 2.0 (Copyright 2025 Data Intelligence Lab, HKU). Permitiría ideas y hasta código, pero el
  norte dice ideas sí, código y servidores no
- **Coste**: instalarlo rompe «sin backend» y pide una IA en un servidor (no aprobado, `NORTE.md` nivel 3) y una clave
  de pago. Llevarse la idea: 0 €
- **Veredicto**: **no instalar ni copiar**. Lo decidió el Consejo (30/10, `autonomo/consejo/2026-10-30-2.md`): la
  puerta (bloqueo por tipo de pregunta) se descarta; entra en `educacion-app` un indicador de «ideas firmes» (2
  aciertos en días distintos; el criterio es nuestro, no de DeepTutor, que no lo publica). Espera el sí del usuario a
  guardar los días con acierto

### Neuropronóstico tras parada cardíaca: el curso temporal de los marcadores (Critical Care Reviews)
- **Fecha / tipo**: 2026-10-30 (comentario del 29/10) · tuit → paper
- **Enlace**: https://x.com/CritCareReviews/status/2115913940635201673 (Journal Watch de Critical Care Reviews)
- **Dijo**: solo el enlace
- **Qué es**: Benghanem S, Pruvost-Robieux E, Hmeydia G, Sellami H, Mercier J, Gavaret M, Sharshar T, Cariou A,
  Calligaris C, Legouy C. *Neuroprognostication in unconscious patients after cardiac arrest: considering the time
  course of prognostic markers*. Ann Intensive Care, octubre 2026, artículo 100195. doi:10.1016/j.aicoj.2026.100195
  (Crossref, 30/10). Aún sin PubMed ni Europe PMC. Por el título: cuándo mira cada marcador (exploración,
  pupilometría, EEG, potenciales evocados, NSE, imagen) tras la parada
- **Sirve a**: la guardia (paciente en coma tras la parada, decidir cuándo pronosticar); UCI / Papers Tuiter
- **Fuente**: el propio paper (sin abrir: solo título y autores)
- **Licencia**: acceso abierto, CC BY-NC-ND 4.0 desde el 28/10/2026 (Crossref). Se puede descargar a `docs/`
- **Coste**: 0 €. Desde la sesión no se abre: `www.sciencedirect.com`, `api.elsevier.com` y
  `annalsofintensivecare.springeropen.com` están cerrados en la red
- **Veredicto**: integrar en UCI / Papers Tuiter en cuanto haya PDF (adjunto en el issue o dominio abierto)

### IAM oclusivo: seis principios del ECG más allá de los criterios de SCACEST (@MarlonVFZR)
- **Fecha / tipo**: 2026-10-30 (comentario del 28/10) · tuit (artículo de X) → paper
- **Enlace**: https://x.com/MarlonVFZR/status/2115269246699852211 (enlaza un artículo de X y un canal de Telegram)
- **Dijo**: solo el enlace
- **Qué es**: el artículo de X resume, con casi el mismo título, Helseth HC, Mansur P, El-Baba M, McLaren JTT, de
  Alencar JN, Smith SW. *Electrocardiographic Principles for the Diagnosis of Occlusion Myocardial Infarction*. Eur
  Heart J Acute Cardiovasc Care, 3/9/2026, zuag114. doi:10.1093/ehjacc/zuag114 · PMID 42690215. Resumen (PubMed): el
  paradigma IAMCEST/IAMSEST tiene poca sensibilidad y especificidad para la oclusión coronaria; propone el paradigma
  OMI/NOMI y seis principios para leer el ECG isquémico: dinamismo, agudeza, reciprocidad, proporcionalidad,
  totalidad y sustitución («surrogacy»). La relación tuit-paper se deduce por el título; el tuit no lo cita
- **Sirve a**: la guardia (dolor torácico y ECG dudoso en UCI y tras la parada); enlazaría con el bloque de
  arritmias/ECG (fase 1) y con la Guía ESC de Cardiología; UCI / Papers Tuiter
- **Fuente**: el paper (solo el resumen leído)
- **Licencia**: de pago (OUP, todos los derechos reservados); el artículo de X y sus ECG no se reproducen
- **Coste**: 0 € si el usuario lo baja de la biblioteca del hospital
- **Veredicto**: integrar en UCI / Papers Tuiter cuando llegue el PDF; los ECG, recreados o con fuente libre

### Bloqueo de rama que aparece al cambiar la frecuencia: fase 3 y fase 4 (@RitikaTuliMD)
- **Fecha / tipo**: 2026-10-30 (comentario del 28/10; era uno de los cuatro sin leer del 29/10) · tuit → idea
- **Enlace**: https://x.com/RitikaTuliMD/status/2115370235091943810
- **Dijo**: solo el enlace
- **Qué es**: «CardioNugget» con imagen: el bloqueo de rama dependiente de la taquicardia es un bloqueo en fase 3 (el
  siguiente impulso llega cuando la rama aún está en periodo refractario: rápido → QRS ancho); el texto completo
  sigue con el dependiente de la bradicardia (fase 4). Solo se leyó el principio (título de la página)
- **Sirve a**: fase 1 (bloque 3 de arritmias, aparcado); buen mecanismo animado paso a paso (potencial de acción y
  periodo refractario frente al siguiente latido), como la ficha de la TV del tracto de salida de la misma autora
- **Fuente**: ninguna; el tuit no cita paper. Haría falta un libro o guía de `docs/`
- **Licencia**: imagen ajena, no se reproduce
- **Coste**: 0 €
- **Veredicto**: idea suelta para el bloque 3 (fase 1)

### Caso: HVI y una estructura rara en la válvula mitral (@AguilarMolina_)
- **Fecha / tipo**: 2026-10-30 (comentario del 28/10) · tuit (caso con vídeo de eco) → idea
- **Enlace**: https://x.com/AguilarMolina_/status/2114860764812980605
- **Dijo**: solo el enlace
- **Qué es**: caso-adivinanza: varón de 40 años con dolor torácico, palpitaciones y disnea de esfuerzo; la eco muestra
  hipertrofia del VI y una estructura inusual unida a la mitral, y pregunta qué puede ser. No se vio la respuesta
  ni el vídeo
- **Sirve a**: G1 (eco) y el formato «caso que evoluciona» de las preguntas (REGLAS §8); la miocardiopatía
  hipertrófica y la mitral, en el atlas de eco
- **Fuente**: ninguna; un caso de X no es fuente. El vídeo es de un paciente: no se usa
- **Licencia**: vídeo ajeno de un paciente, no se reproduce
- **Coste**: 0 €
- **Veredicto**: idea suelta: plantilla de caso de eco para el atlas (G1), con imágenes de fuente libre

### Interdependencia ventricular (@yoshiaki_666_)
- **Fecha / tipo**: 2026-10-30 (comentario del 28/10) · tuit (en japonés; cita un vídeo de @NephroP) → idea
- **Enlace**: https://x.com/yoshiaki_666_/status/2115200513235112315 · vídeo citado:
  https://twitter.com/NephroP/status/2115151681939747003/video/1
- **Dijo**: solo el enlace
- **Qué es**: «心室間相互作用» (interdependencia ventricular): comparte un vídeo docente de otra cuenta. No se vio
  el vídeo
- **Sirve a**: fase 2; mejora de Circulación viva (eco) y de los lazos P-V (VD dilatado que aplasta el VI, septo
  plano, pulso paradójico, taponamiento, TEP)
- **Fuente**: ninguna; haría falta Marino o el Libro Azul (`docs/`)
- **Licencia**: vídeo ajeno, no se reproduce
- **Coste**: 0 €
- **Veredicto**: idea suelta para fase 2, junto al lazo P-V de @WithAScalpel

### Anatomy Atlas (Brian Pridgen, MD)
- **Fecha / tipo**: 2026-10-29 (chat) · web/simulador 3D
- **Enlace**: https://t.co/SUDGmhtskz → https://anatomy-atlas.pridgenmd.chatgpt.site/ (página enlazada:
  `/procedures/proximal-phalanx-fracture/`)
- **Dijo**: «mira ahora y también di si esta nos sirve de algo» (abrió el dominio en la red el 29/10)
- **Qué es** (visto el 29/10, solo la portada y una página): visor 3D de anatomía de cuerpo entero (Three.js) con
  disección por capas, cortes axial, sagital y coronal, «toca e identifica» cada estructura y vistas sólido/rayos X.
  Modelos de Open 3D Model / **Z-Anatomy** con BodyParts3D (CC BY-SA 4.0; Z-Anatomy ya se usa en la eco). Una
  demostración de procedimiento (tornillos en una falange: pasos, reproducir, velocidad, dos técnicas a elegir y un
  «Acerca de y fuentes» que dice qué es ilustrativo). Trae yugular, subclavia, femoral, radial y cricotiroides.
  No hay lista de procedimientos de UCI (`/procedures/` da 404)
- **Sirve a**: nivel 1 (estudiar): anatomía de las vías centrales y la arterial (catéter vivo, Técnicas R1); cortes
  como puente a la eco y la TC (G4, G6); el formato «procedimiento paso a paso con técnicas a elegir y fuentes» para
  Técnicas R1; pesa en la decisión del 3D de `eco-reforma` (01/11)
- **Fuente**: no es fuente clínica; las mallas se toman de su origen (Z-Anatomy), no de esta web
- **Licencia**: mallas CC BY-SA 4.0 (atribución y compartir igual); el código del visor no declara licencia: solo ideas
- **Coste**: 0 €; informe de ingeniería inversa ≈0,5 M (sonnet)
- **Veredicto**: SÍ sirve, como ideas y como prueba para la decisión del 3D. Propuesto: informe corto antes del 01/11

### Cuatro tuits sin leer (Bandeja del 29/10; el de @RitikaTuliMD, leído el 30/10)
- **Fecha / tipo**: 2026-10-29 (comentarios del 28/10) · tuit (4 entradas)
- **Enlace**: https://x.com/RitikaTuliMD/status/2115370235091943810 ·
  https://x.com/shinriha_pt/status/2115396011443323199 · https://x.com/WithAScalpel/status/2115405654915514531 ·
  https://x.com/sindenzu1/status/2115270279207481772
- **Dijo**: solo los enlaces
- **Qué es**: no consta. Desde la sesión, x.com responde 402 y la búsqueda web no los indexa. El de @WithAScalpel
  quizá sea la continuación de su serie de lazos presión-volumen (ficha de abajo); sin leerlo, no se da por hecho
- **Sirve a**: no consta
- **Fuente**: no consta; se pidió en el issue #27 el enlace del paper, el texto o una captura
- **Licencia**: tuits ajenos, no se reproducen
- **Coste**: 0 €
- **Veredicto**: pendiente de que el usuario pegue el paper o una captura

### CardioTeca · Espacio Arritmias: dosis de anticoagulantes y antiarrítmicos (tablas)
- **Fecha / tipo**: 2026-10-29 (comentario del 28/10) · web
- **Enlace**: https://www.cardioteca.com/espacio-arritmias/9091-dosis-de-los-anticoagulantes-y-los-antiarritmicos-tablas-por.html
- **Dijo**: solo el enlace
- **Qué es**: sección de una web española de cardiología con tablas de dosis de anticoagulantes orales directos
  (rivaroxabán, apixabán, edoxabán, dabigatrán) y antiarrítmicos por indicación y ajuste por función renal, edad y
  peso; la misma web tiene fichas por fármaco (p. ej. amiodarona), una página de manejo práctico, otra de mecanismo
  de acción y calculadoras de arritmias (una de dosis de ACOD con Cockcroft-Gault). Visto solo por la búsqueda web:
  `www.cardioteca.com` no está en la red de la sesión y no se pudo abrir la página
- **Sirve a**: fase 3 (calculadoras) y la guardia (dosis de ACOD con insuficiencia renal, amiodarona IV); enlazaría
  con el bloque de arritmias (fase 1) y con nefrotoxicidad/ajuste renal de Nefrología
- **Fuente**: no consta de qué guía salen sus tablas (sin abrir la página). Una web divulgativa no es fuente de
  dosis: las cifras saldrían de la ficha técnica o de la guía ESC/EHRA, con su página
- **Licencia**: no consta
- **Coste**: web gratis (no consta si hay parte de pago)
- **Veredicto**: idea suelta para fase 3 (calculadora de dosis de ACOD por función renal, con la guía como fuente);
  CardioTeca, como bibliografía. Para ver la página hace falta abrir `www.cardioteca.com` en la red de la sesión

### Easy LA Segmentator (Mikael Laredo, Pitié-Salpêtrière)
- **Fecha / tipo**: 2026-10-28 · repositorio
- **Enlace**: https://github.com/mikaellaredo/easy-la-segmentator
- **Dijo**: «Mira a ver si este repositorio de GitHub nos puede ayudar a montar el motor real del corazón»; tras la
  valoración, «sí, apúntalo»
- **Qué es**: programa de escritorio para electrofisiólogos (Windows y Mac, instalador de 1,4 GB). Con un TAC cardíaco
  dibuja en 3D la aurícula izquierda, las venas pulmonares y la orejuela con TotalSegmentator; nombra cada vena, mide
  cada ostium (diámetros y área), marca variantes (tronco común, vena accesoria o media) y exporta a CARTO, EnSite y
  OPAL. El repositorio solo tiene el README y 9 capturas: **no publica código**
- **Sirve a**: nivel 1 (estudiar), G6 (quirófano cardíaco y ETE). **No sirve al motor hemodinámico** (`motor.mjs`:
  presiones, volúmenes, elastancia): es anatomía quieta, sin latido ni flujo. Sí como referencia de qué enseñar en una
  futura vista 3D de la aurícula izquierda para el motor de la imagen de B-039 (`eco-reforma`) o `f2-ete`: las cuatro
  venas con su ostium, la orejuela aparte, las variantes y las vistas de electrofisiología (AP, PA, OAI, OAD,
  izquierda, derecha). Dibujado por nosotros, sin copiar sus imágenes
- **Fuente**: ninguna; es una herramienta, no una fuente. La anatomía saldría de un libro o guía en `docs/`. Su
  validación (README): 27 TAC públicos de HOCMvalvesSeg, Dice mediano 0,93
- **Licencia**: README: «free for non-commercial research use»; el modelo *heartchambers_highres* de TotalSegmentator,
  solo no comercial y con clave por usuario; capturas hechas con HOCMvalvesSeg (CC BY-NC 4.0) y la muestra de 3D
  Slicer. No se usa nada suyo (REGLAS del proyecto §7.9)
- **Coste**: 0 €; no aporta código, solo ideas
- **Veredicto**: fase 2, como referencia del motor de la imagen (B-039 y `f2-ete`); descartado para el motor del
  corazón

### Lazo presión-volumen #1: precarga y distensibilidad (@WithAScalpel) + CardioRender
- **Fecha / tipo**: 2026-10-28 (comentario del 27/10) · tuit → idea (sin paper detrás); en una respuesta, una web
- **Enlace**: https://x.com/WithAScalpel/status/2115036104977940880 · la web citada en las respuestas: https://cardiorender.com
- **Dijo**: solo el enlace
- **Qué es**: primer tuit de una serie docente con vídeo: el lazo presión-volumen del ventrículo (llenado, contracción
  isovolumétrica, eyección, relajación) y cómo más precarga desplaza el volumen telediastólico a la derecha y sube el
  volumen latido. Un tercero recomienda en las respuestas CardioRender, un simulador de hemodinámica (no abierto:
  no se le ha hecho ingeniería inversa)
- **Sirve a**: fase 2 (verlo desde todos los ángulos); ya hay lazos P-V en Fisiopatología UCI (Cardiología), en
  Circulación viva (eco) y en Merino Neumología: sería una mejora de lo que existe, no algo nuevo
- **Fuente**: ninguna; el tuit no cita paper. Si se usa, la fisiología sale de Marino o del Libro Azul (`docs/`)
- **Licencia**: tuit y vídeo ajenos, no se reproducen. CardioRender: no consta
- **Coste**: 0 €
- **Veredicto**: idea suelta para fase 2; ingeniería inversa de CardioRender solo si el usuario la pide

### ¿Por qué el ejercicio dispara la TV del tracto de salida del VD? (@RitikaTuliMD)
- **Fecha / tipo**: 2026-10-28 (comentario del 27/10) · tuit → idea (sin paper detrás)
- **Enlace**: https://x.com/RitikaTuliMD/status/2115035277752463816
- **Dijo**: solo el enlace
- **Qué es**: «CardioNugget» con imagen: catecolaminas → más estímulo β → más AMPc → más calcio dentro de la célula →
  postpotenciales tardíos (DAD), con salida espontánea de calcio del retículo tras repolarizar. Mecanismo de
  actividad desencadenada, buen candidato a mecanismo animado paso a paso (como los receptores animados)
- **Sirve a**: fase 1 (el ritmo entra en el paciente, bloque 3 de arritmias, ahora aparcado en el tablero)
- **Fuente**: ninguna; el tuit no cita paper. Para usarlo hace falta una fuente que se pueda abrir (guía o libro)
- **Licencia**: imagen ajena, no se reproduce
- **Coste**: 0 €
- **Veredicto**: idea suelta para el bloque 3 (fase 1), cuando se retome

### Asincronías en la fase de disparo (@DrSateeshPCCM) → Mireles-Cabodevila 2022
- **Fecha / tipo**: 2026-10-28 (comentario del 26/10) · tuit → paper
- **Enlace**: https://x.com/DrSateeshPCCM/status/2114702193098105204
- **Dijo**: solo el enlace
- **Qué es**: hilo con 5 curvas de ventilación por presión: disparo normal, precoz (reverse triggering), retrasado
  (> 100 ms), autodisparo y esfuerzo ineficaz, con la presión muscular (Pmus) dibujada. El paper que cita:
  Mireles-Cabodevila E, Siuba MT, Chatburn RL. *A Taxonomy for Patient-Ventilator Interactions and a Method to Read
  Ventilator Waveforms*. Respir Care. 2022;67(1):129-148. doi:10.4187/respcare.09316. PMID 34470804
- **Sirve a**: UCI / Papers Tuiter (un paper = una vista) y, con enlaces cruzados, Neumología; también el carril de
  modelos vivos (curvas de ventilador que se leen). En la app no hay nada aún de autodisparo ni esfuerzo ineficaz
- **Fuente**: el paper; no es de acceso abierto (de pago en la revista y en SAGE)
- **Licencia**: artículo con copyright; figuras se recrean, no se copian
- **Coste**: 0 € si el usuario tiene el PDF
- **Veredicto**: integrar en UCI / Papers Tuiter cuando llegue el PDF (pedido en el issue #27 el 28/10)

### Más allá de la PPC: presión crítica de cierre y fallo microcirculatorio en la HSA (Critical Care Reviews)
- **Fecha / tipo**: 2026-10-28 (comentario del 26/10) · tuit → paper
- **Enlace**: https://x.com/CritCareReviews/status/2114035385928192242
- **Dijo**: solo el enlace
- **Qué es**: «Paper of the Day» de Critical Care Reviews: *Beyond Cerebral Perfusion Pressure: Critical Closing
  Pressure and Microcirculatory Failure in Aneurysmal Subarachnoid Haemorrhage*. Encontrado el 28/10 en Europe PMC
  (tras abrir la red): Carden R, Watson X, Santi M, Zoumprouli A. Neurocrit Care, 23/10/2026.
  doi:10.1007/s12028-026-02704-y · PMID 42920038
- **Sirve a**: UCI / Papers Tuiter; enlaza con la presión crítica de cierre que ya sale en el paper de shock séptico
  y con la HSA de Sobrevivir a la UMI
- **Fuente**: el paper; no es de acceso abierto (de pago, Springer)
- **Licencia**: artículo con copyright; figuras se recrean
- **Coste**: 0 €
- **Veredicto**: integrar en UCI / Papers Tuiter cuando llegue el PDF (pedido en el issue #27 el 28/10)

### Impeccable (pbakaus)
- **Fecha / tipo**: 2026-10-26 · repositorio (herramienta para el agente, no para la app)
- **Enlace**: https://github.com/pbakaus/impeccable
- **Dijo**: «¿Se puede instalar este repo?» (26/10)
- **Qué es**: guía de diseño para agentes de IA: una skill `/impeccable` con 24 órdenes (audit, critique, polish,
  adapt…) y un detector de 62 reglas sin IA (desbordes, contraste, imágenes rotas, «aspecto de IA»). Al instalarlo
  añade hooks que revisan cada edición de `.html/.css/.js`, descarga un programa propio en `~/.impeccable/bin/` y
  escribe `PRODUCT.md` y `DESIGN.md` en la raíz. Telemetría activada por defecto (se apaga con
  `IMPECCABLE_NO_TELEMETRY=1`).
- **Sirve a**: nivel 1 (acabado visual de fichas y modelos en el móvil); fase 0 (acabado de producto)
- **Fuente**: README del repositorio (leído el 26/10)
- **Licencia**: Apache 2.0
- **Coste**: gratis; tokens extra por los avisos del hook en cada edición
- **Veredicto**: descartar la instalación (26/10). El usuario eligió probar el detector una vez sin instalar. Con la
  app servida no pudo escanear (la página tiene más de 30.000 elementos: todas las vistas se cargan a la vez). Sobre
  los archivos sueltos dio 218 avisos, casi todos falsos por leerlos sin el CSS de la app (contraste con texto negro
  que en la app no existe, imágenes «rotas» que reciben su `src` por JS) o de gusto (bordes de color a la izquierda,
  brillos dorados: son el estilo de la app). Real y comprobado en el navegador a 390 px: texto de 8,5-10,4 px en el
  menú principal (rótulos y etiquetas de las puertas, botones Escalas/Estudio/Buscar). Arreglo pequeño, si el usuario
  lo aprueba.

### Culprit (Cliff Reid)
- **Fecha / tipo**: 2026-10-26 · web/app
- **Enlace**: https://www.cliffreid.com/culprit/#explore
- **Dijo**: «Habría que hacer después de todas las mejoras que están activas ingeniería reversa a este
  repositorio/página web» (26/10)
- **Qué es**: «Coronary Culprit», simulador docente gratis (en inglés) del IAM por oclusión: ocluyes un punto de una
  coronaria en un corazón 3D y responden el ECG de 12 derivaciones (con V4R y V7-V9) y la eco (17 segmentos, FEVI y
  WMSI estimadas). Curso de 6 módulos, 36 escenarios (territorios, OMI sutil, reperfusión, imitadores), 14 casos con
  reloj y entrenamiento ECG → arteria. Hecho por Cliff Reid con Claude Code. Visto el 26/10/2026
  (`autonomo/ideas/ingenieria-inversa/culprit.md`).
- **Sirve a**: G3 (vaso → derivaciones → pared → complicación); niveles 1 (estudiar) y, como esquema, 2
- **Fuente**: no cita ninguna (ni guías ni artículos); solo nombres de signos (Smith, Aslanger, Wellens, de Winter).
  Sus cifras sirven para saber qué buscar en la ESC de SCA y en el libro de ECG de la rotación
- **Licencia**: sin licencia ni copyright publicados; se entiende «todos los derechos reservados» (ideas sí; código,
  textos e imágenes no). Usa three.js (MIT)
- **Coste**: gratis, sin cuenta; donativo opcional. Guarda progreso en el navegador y manda analítica anónima propia
- **Veredicto**: idea fuerte para la Fase 1 (territorios arteria ↔ derivaciones ↔ segmentos) y la Fase 2
  (coronarias con dominancia). **Decidido el 26/10**: A + B en la Fase 1 tras Marino (Objetivo M5); C y D después. Informe:
  https://claude.ai/artifact/Y6ewAZfAk5cPewnsnNcsAw

### NV-Reason-CT (NVIDIA)
- **Fecha / tipo**: 2026-10-25 · repositorio
- **Enlace**: https://github.com/NVIDIA-Medtech/NV-Reason-CT
- **Dijo**: «la IA de Nvidia para leer TC body que te pase, y enlazarla mediante ingeniería reversa con las páginas…
  un agente de IA que ayude al médico radiólogo» (23/10)
- **Qué es**: IA que lee un TC 3D de tórax o abdomen y responde: informe, 64 hallazgos, preguntas. Solo investigación.
  No lee cráneo, Rx ni posición de dispositivos.
- **Sirve a**: G4 y G5 (como lista de hallazgos); nivel 3
- **Fuente**: ficha del modelo (huggingface.co) y artículo (arXiv): no vistos, dominios cerrados
- **Licencia**: OpenMDW-1.1, muy abierta, también para sus respuestas
- **Coste**: necesita tarjeta gráfica; precio: no consta
- **Veredicto**: fase 4 (lista de hallazgos y compañera de estudio); nivel 3 solo en el teléfono por ahora

### Hilo sobre el gasto de uso de Claude Code (Boris Cherny)
- **Fecha / tipo**: 2026-10-25 · tuit
- **Enlace**: no consta
- **Dijo**: no consta
- **Qué es**: hilo sobre cómo gastar menos del límite de uso
- **Sirve a**: ninguna situación de guardia; mejora del propio plan de trabajo
- **Fuente**: un tuit no es fuente; lo comprobado: no consta dónde
- **Licencia**: no aplica
- **Coste**: 0 €
- **Veredicto**: comprobado; lecciones de ahorro en la skill `/ingenieria-reversa` y en la etapa A

### leanrea
- **Fecha / tipo**: 2026-10-25 en la tabla (la skill v1 se escribió el 23/10 y se releyó el 25/10) · repositorio
- **Enlace**: `aicodeking/leanrea` (URL completa: no consta)
- **Dijo**: «mira si con este repositorio nos puede ayudar para tener la skill de /ingeniería-reversa» (23/10)
- **Qué es**: guía de ~8 KB con el comando más rápido por tipo de objetivo, sin servidor
- **Sirve a**: ninguna G; método de trabajo
- **Fuente**: su propia guía; su medida (~38 % más rápida, ~35 % más barata que REA) es de su autor
- **Licencia**: MIT
- **Coste**: 0 €
- **Veredicto**: integrado en la skill `/ingenieria-reversa` v2

### claude-code-setup (Anthropic)
- **Fecha / tipo**: 2026-10-25 · plugin
- **Enlace**: no consta
- **Dijo**: no consta
- **Qué es**: plugin que recomienda configuración de Claude Code
- **Sirve a**: ninguna G; preparación del plan
- **Fuente**: no consta
- **Licencia**: no consta
- **Coste**: no consta
- **Veredicto**: recomendaciones en la etapa A (graft, hooks, `/cerrar-tanda`, pruebas en GitHub)

### clinical-ai-skills y research-agent-skills
- **Fecha / tipo**: 2026-10-23 · repositorio
- **Enlace**: `stefanogarzon/clinical-ai-skills` y `KalarisLabs/research-agent-skills` en GitHub
- **Dijo**: «instala estos repositorios»
- **Qué es**: skills de investigación; se instalaron 8 (`claim-check`, `sr-screening`, `citation-verification`,
  `paper-lookup`, `literature-review`, `scientific-critical-thinking`, `systematic-review-prisma`, `pydicom`)
- **Sirve a**: fidelidad a la fuente (todas las fases); `pydicom` a la fase 4
- **Fuente**: `.claude/skills/SKILLS-EXTERNAS.md`
- **Licencia**: código MIT; texto de clinical-ai-skills CC BY 4.0
- **Coste**: 0 € (`literature-review` solo usa OpenRouter si se le da una clave)
- **Veredicto**: instaladas

### anesthbeta (ETE)
- **Fecha / tipo**: 2026-10-23 · web (2.ª pasada el 25/10)
- **Enlace**: https://tee-simulator.anesthbeta.com/atlas
- **Dijo**: «poder entender cómo se ha hecho y poder añadir todas las mejoras que poder aplicar a nuestro simulador»
- **Qué es**: atlas 3D de ETE, 35 vistas en la web, sonda con 5 mandos; ahora escaparate de una app de iPhone
- **Sirve a**: G6; fase 2 (ETE, banco de la mitral A1-P3); fase 0 (viaje entre vistas)
- **Fuente**: `anesthbeta.md`, parte `2026-10-23-tee-inversa.md`; su anatomía dice Human Reference Atlas (sin verificar)
- **Licencia**: Three.js MIT; anatomía CC BY 4.0 sin verificar; su código y su interfaz no son reutilizables
- **Coste**: web gratis; app freemium (compras dentro)
- **Veredicto**: fases 0 y 2

### EchoSuite
- **Fecha / tipo**: 2026-10-23 · web (2.ª pasada el 25/10)
- **Enlace**: https://echosuite.app
- **Dijo**: no consta (entró con las demás webs de B-012)
- **Qué es**: maniquí 3D de eco y 70 calculadoras (cada una con guía, fórmula con tus números y grado)
- **Sirve a**: G1; fase 0 (cifra con su grado); fase 3 (calculadoras)
- **Fuente**: `echosuite.md`, `echosuite-2.md`
- **Licencia**: software y figuras © del autor; three.js MIT; cines de terceros con su licencia (algunos CC BY-SA)
- **Coste**: gratis, sin cuenta
- **Veredicto**: fases 0 y 3, y G1

### AngioView
- **Fecha / tipo**: 2026-10-23 · web (2.ª pasada el 25/10)
- **Enlace**: https://angioview.com
- **Dijo**: no consta
- **Qué es**: simulador de proyecciones de coronariografía: arco en C, segmentos con % de acortamiento
- **Sirve a**: G3; fase 2 (coronarias, coronariografía que late); calidad en móvil (fase 0)
- **Fuente**: `angioview.md`, `angioview-2.md`; cita su fuente de rangos: Di Mario 2005 (tabla 2)
- **Licencia**: BodyParts3D CC BY 4.0 (con cabeceras que aún dicen CC BY-SA 2.1 JP), sin verificar en origen; sus
  archivos derivados no declaran licencia; three.js y React MIT
- **Coste**: web gratis; app de pago para iPhone/iPad
- **Veredicto**: fase 2

### NavRad Anatomy
- **Fecha / tipo**: 2026-10-23 · web (2.ª pasada el 23/10 y 3.ª el 25/10)
- **Enlace**: https://anatomy.navigatingradiology.com
- **Dijo**: no consta
- **Qué es**: atlas de TC reales corte a corte, con rótulos, notas docentes y quiz «¿dónde está?»
- **Sirve a**: G4 y G5; fase 4 (visor de cortes, «¿dónde está la punta?»)
- **Fuente**: `navrad.md`, `navrad-2.md`, `navrad-3.md`
- **Licencia**: ninguna declarada; sus imágenes no se pueden usar
- **Coste**: vista previa gratis; cuenta gratuita; parte de pago: no consta
- **Veredicto**: fase 4

### Radiology Assistant
- **Fecha / tipo**: 2026-10-23 · web (3.ª pasada el 25/10)
- **Enlace**: https://radiologyassistant.nl
- **Dijo**: no consta
- **Qué es**: unos 150 artículos docentes de radiología (figura + 2-6 frases). No cubre punta de tubo, vía central ni SNG
- **Sirve a**: G4 y G5; fase 0 (bibliografía en el PIF de Radiología)
- **Fuente**: `radiologyassistant.md`, `radiologyassistant-2.md`
- **Licencia**: sin licencia formal; imágenes reproducibles con fines docentes citando al autor (disclaimer); de los
  textos no dice nada. Decidido el 25/10: no usar sus figuras, solo enlazar
- **Coste**: web gratis; app con suscripción por categoría
- **Veredicto**: fase 0 (bibliografía), G4, G5

### RitmoLab (Farmacotips)
- **Fecha / tipo**: 2026-10-23 · web (2.ª pasada el 25/10)
- **Enlace**: no consta
- **Dijo**: no consta
- **Qué es**: simulador de arritmias con 17 escenarios, errores con consecuencia y revisión final
- **Sirve a**: G2; fase 1 (corazón eléctrico, bloque 3); modelos vivos (errores que empeoran al paciente)
- **Fuente**: `ritmolab.md`, `ritmolab-2.md`; sus cifras son de su simulación, no de una guía
- **Licencia**: no declarada
- **Coste**: no consta
- **Veredicto**: bloque 3 (fase 1) y G2

### REA (morluto/rea)
- **Fecha / tipo**: 2026-10-23 · repositorio
- **Enlace**: `morluto/rea` en GitHub
- **Dijo**: «reverse-engineer-anything» (nombre de la skill que citó el 23/10)
- **Qué es**: herramienta de ingeniería inversa; solo aportó en EchoSuite (mapa de módulos)
- **Sirve a**: ninguna G; método de trabajo
- **Fuente**: `docs/historial/radar.md` §1
- **Licencia**: MIT
- **Coste**: 0 €
- **Veredicto**: herramienta de apoyo de `/ingenieria-reversa`
