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
- 2026-10-29 · Bandeja #27 · 4 tuits sin leer (x.com cerrado: 402): espera enlace del paper o captura del usuario
- 2026-10-29 · Bandeja #27 · web CardioTeca, tablas de dosis de anticoagulantes y antiarrítmicos: ¿bibliografía de fase 3?

## Fichas de triaje (las 24 entradas, la más reciente arriba)

Campos: fecha · tipo · enlace · lo que dijo · qué es · sirve a · fuente que lo respalda · licencia · coste · veredicto.

### Atlas de anatomía de procedimientos (Pridgen) · sin leer
- **Fecha / tipo**: 2026-10-29 (chat) · web
- **Enlace**: https://t.co/SUDGmhtskz → https://anatomy-atlas.pridgenmd.chatgpt.site/procedures/proximal-phalanx-fracture/
- **Dijo**: «mira ahora y también di si esta nos sirve de algo»
- **Qué es**: no consta. Por la dirección: un atlas de anatomía para procedimientos, de un autor «Pridgen MD», hecho como
  sitio en `chatgpt.site`; la página enlazada es una fractura de falange proximal (mano)
- **Sirve a**: no consta; solo serviría si trae procedimientos de UCI (vías, arterial, drenaje torácico, punciones)
- **Fuente**: no es fuente clínica (web ajena; REGLAS §4.13)
- **Licencia**: no consta
- **Coste**: 0 €
- **Veredicto**: NO SE PUDO LEER (el host está cerrado en la red del entorno: proxy 403 y el lector web no lo resuelve).
  Pendiente de que el usuario lo abra en la red o pegue la lista de procedimientos

### Cuatro tuits sin leer (Bandeja del 29/10)
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
