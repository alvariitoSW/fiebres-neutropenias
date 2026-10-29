# La mesa · inventario de todos los recursos (29/10/2026)

Pedido del usuario el 29/10: «todas las páginas que he ido copiando, de ecocardio, de todo [...] volverlas a poner todas
en la mesa, por saber si a lo mejor hay alguna que tú te hayas dejado por el camino». Base del Consejo extraordinario de
la reforma (`autonomo/consejo/2026-10-29-reforma.md`).

**Límite de esta recopilación**: salió de los repositorios, la Bandeja del Radar (issue #27) y el otro repositorio
(`app-organizador-MIR`). Los mensajes de las ~95 sesiones anteriores **no se pudieron leer enteros** (solo 3; cada
transcripción cuesta decenas de llamadas). Si el usuario recuerda un enlace que no está aquí, basta con pegarlo.
x.com da 402 desde la red del entorno: 7 tuits siguen sin leer.

Fuentes leídas: `autonomo/radar/{ENTRADAS,HOJA-DE-RUTA,NORTE}.md`, `autonomo/ideas/**` (29 informes de ingeniería inversa + educacion-pionera), `BITACORA.md`, `TABLERO.md`, `autonomo/consejo/*.md`, `docs/historial/*`, `js/modules/eco/README.md`, grep de URLs, el repo `app-organizador-mir` (`docs/webs-medicas.md`, `informe-*.md`) y la Bandeja (issue #27, 12 comentarios, leídos con MCP de GitHub: sí se pudo).
Rutas abreviadas: IR = `autonomo/ideas/ingenieria-inversa/`, ENT = `autonomo/radar/ENTRADAS.md` (línea de la ficha), LC = `autonomo/consejo/2026-10-29-ley-de-ciencia.md`, TAB = `autonomo/TABLERO.md`, BIT = `autonomo/BITACORA.md`, OM = repo `app-organizador-mir`.
Estados: INT = integrado en la app · TAB(clave) = en el tablero · APA = aparcado · DES = descartado · SE = SIN ESTUDIAR.

## Eco

| Nº | Nombre | URL | Tipo | Qué se hizo | Estado | Dónde se menciona |
|---|---|---|---|---|---|---|
| 1 | anesthbeta TEE Atlas | https://tee-simulator.anesthbeta.com/atlas | simulador | Informe `IR/anesthbeta.md` (+ parte `2026-10-23-tee-inversa.md`, y `IR/echosuite-anesthbeta-anatomia.md`) | TAB(`f2-ete`, `f0-eco-color/rotulos/viaje/guia`, `eco-sueltas`) todas APA hasta `eco-reforma` (01/11); informe cerrado | ENT:250; TAB:364,775-780,1066; LC art.1 |
| 2 | EchoSuite | https://echosuite.app | simulador/calculadoras | `IR/echosuite.md`, `echosuite-2.md` (vivo: umbrales con página) | TAB(`guardia-shock`, `f0-cifras`) APA tras Marino y Libro Azul | ENT:261; LC art.1 bis; TAB:1068 |
| 3 | The Heart by Ultrasound (echodemo, D. Ouyang) | https://intro2echo.com · https://github.com/douyang/echodemo | web/repo | `IR/echodemo-anatomia.md`; texto traducido con permiso del autor | INT (atlas de eco en español, 30 caps, enlaces, Wiggers y asa P-V) | REGLAS:18; TAB:145,496; `docs/historial/eco.md:39,171,244`; `js/modules/eco/README.md:811-820` |
| 4 | Z-Anatomy | https://www.z-anatomy.com | repo/atlas 3D | Mallas de hígado, diafragma y xifoides (CC BY-SA 4.0) | INT | `js/modules/eco/README.md:836`; `docs/historial/eco.md:140` |
| 5 | Wikimedia Commons / Yale echo atlas (eco real libre) | http://www.yale.edu/imaging/echo_atlas/views/index.html | imágenes | `IR/ecos-reales-libres.md` (tabla por vista) | INT parcial (tarjeta «Eco real»); huecos sin candidata libre | `js/modules/eco/README.md:809`; LC art.1 (Exteriores) |
| 6 | Pulmonary POCUS «phone-cp-sim» | https://www.pulmonarypocus.com/phone-cp-sim | simulador | Solo pedido en el encargo de `eco-reforma` (ingeniería inversa «probando antes que se abre») | SE (TAB `eco-reforma`, pendiente 01/11) | TAB:1006; `consejo/2026-10-28.md:38` |
| 7 | Easy LA Segmentator (Laredo) | https://github.com/mikaellaredo/easy-la-segmentator | repo/app escritorio | Ficha del Radar (no hay código público) | APA: referencia para `f2-ete`/B-039; DES para el motor del corazón | ENT:70; HOJA-DE-RUTA fase 2 |
| 8 | Visor de raíz aórtica v2.0 (artefacto Claude, autor desconocido) | https://claude.ai/artifact/QmG8KjAUYR1vuAF1qRv2y9 | web/calculadora | `IR/raiz-aortica.md` (copiado de OM) | Cerrado; B-041 en bitácora SIN aprobar (tras `eco-reforma`) | BIT:230-243,333; `consejo/2026-10-29-2.md:26,108`; OM `informe-raiz-aortica-2026-10.md` |
| 9b | Anatomy Atlas (Brian Pridgen, MD) | https://anatomy-atlas.pridgenmd.chatgpt.site/ | simulador 3D | `IR/anatomy-atlas-pridgen.md` (29/10; dominio abierto por el usuario) | Estudiado: ideas para Técnicas R1, catéter vivo y `mv-eco`; pesa en la decisión del 3D (`eco-reforma`); código propietario, mallas desde Z-Anatomy | Chat del 29/10; ENT |
| 9 | CardioRender (simulador hemodinámica) | https://cardiorender.com | simulador | Solo mencionado (recomendado en respuestas de un tuit) | SE («ingeniería inversa solo si me lo pides») | ENT:93-106 |
| 10 | Tuit @WithAScalpel: lazo P-V y precarga | https://x.com/WithAScalpel/status/2115036104977940880 | tuit | Ficha del Radar (sin paper) | Idea suelta fase 2 (mejorar lazos P-V); en «Tanda pendiente», no en tablero | ENT:30,93 |

## Respirador / respiración

| Nº | Nombre | URL | Tipo | Qué se hizo | Estado | Dónde se menciona |
|---|---|---|---|---|---|---|
| 11 | VentLoop (Node Field) | https://ventilation.nodefield.jp/ | simulador | `IR/ventloop.md` (copiado de OM `informe-ventilador-2026-10.md`) | TAB(`b3-pulmon-app`) como ideas por encargo; informe cerrado | `consejo/2026-10-29-2.md:30-52`; BIT:333; OM `webs-medicas.md` |
| 12 | Techartist «Breathing and Respiration» | https://iamtechartist.com/Apps/breathing-and-respiration/ | web/app 3D | `IR/iamtechartist-respiracion.md` | TAB(`b3-pulmon-app`) lámina de entrada, como método; three.js DES | LC art.6; TAB:1075 |
| 13 | Tuit @DrSateeshPCCM: asincronías de disparo → Mireles-Cabodevila 2022 (Respir Care, doi:10.4187/respcare.09316, de pago) | https://x.com/DrSateeshPCCM/status/2114702193098105204 | tuit/paper | Ficha del Radar; paper identificado | SE por falta de PDF (espera adjunto del usuario en #27); no está en el tablero | ENT:121; Bandeja #27 (28/10, 29/10) |
| 14b | Antaa Slide «Respirador fácil, nivel básico: 3 curvas, modos y ajustes iniciales» (Tsunemi) | https://slide.antaa.jp/article/view/7139b7d01bef4ea5 | curso/diapositivas | `IR/respirador-antaa.md` (29/10) | Estudiado; casi todo ya en `b3-pulmon-app`; 5 ideas de enseñanza y un posible estado `fuga-pcv` (sin fuente aún) | Chat del 29/10 |
| 14 | PhET (simulaciones) | https://phet.colorado.edu | simulador | Intento fallido (403) | SE: web cerrada | `ideas/educacion-pionera/webs.md`; `consejo/2026-10-28-3.md:10,36-39`; BIT:347 |

## Shock / hemodinámica / IA crítica

| Nº | Nombre | URL | Tipo | Qué se hizo | Estado | Dónde se menciona |
|---|---|---|---|---|---|---|
| 15 | Antaa Slide «CCU fácil: shock cardiogénico e Impella» (Tsunemi) | https://slide.antaa.jp/article/view/36d48129555d4a33 | curso/diapositivas | `IR/impella-antaa.md` | TAB(`shock-scai`, Objetivo L fila 9); informe vivo hasta tener DanGer Shock | `consejo/2026-10-29-2.md:76-96,108`; TAB:1073; OM `webs-medicas.md` |
| 16 | Paper HSA: Carden 2026, presión crítica de cierre (tuit @CritCareReviews; doi:10.1007/s12028-026-02704-y, de pago) | https://x.com/CritCareReviews/status/2114035385928192242 | tuit/paper | Ficha del Radar | SE por falta de PDF; para UCI/Papers Tuiter; no en tablero | ENT:136; Bandeja #27 |
| 17 | CardioTeca: dosis de anticoagulantes y antiarrítmicos | https://www.cardioteca.com/espacio-arritmias/9091-dosis-de-los-anticoagulantes-y-los-antiarritmicos-tablas-por.html | web | Ficha del Radar (no se pudo abrir) | Idea fase 3 (calculadora de ACOD por función renal; fuente ESC/ficha técnica); sin decidir | ENT:52 |
| 18 | Repos propios `simulador-UCI-` y `simulador-uci-3d` | https://github.com/alvariitoSW/simulador-UCI- · …/simulador-uci-3d | repo | Mirados por encima el 29/10: el 2D es un juego en Python/Pygame (monitor en tiempo real, casos con fluidos, fármacos, VM y RCP; progreso guardado); el 3D, un prototipo en Godot (minijuego de antibióticos según el protocolo de esta app) | SE (sin informe) | OM `docs/webs-medicas.md` |
| 19 | Papers de UCI / Papers Tuiter ya hechos (citrato TRR, extubación PUMA, NO inhalado, shock séptico, VD-LRA posoperatoria, VExUS…) | (sin URL; PDF en `docs/`) | paper | Fichas en la app | INT | `docs/historial/uci-papers.md`; `js/modules/uci-papers/` |

## ECG / arritmias

| Nº | Nombre | URL | Tipo | Qué se hizo | Estado | Dónde se menciona |
|---|---|---|---|---|---|---|
| 20 | RitmoLab (Farmacotips) | (URL no consta; farmacotips.com cerrada) | simulador | `IR/ritmolab.md`, `-2`, `-3` | `pif-ecg` INT (PR #36); resto TAB(`pif-cardio`, `arritmias-*`) APA | ENT:307; TAB:785-790; LC art.3 |
| 21 | Ventriculus (9 herramientas de cardiología) | https://ventriculus.org | web | `IR/ventriculus.md`; `IR/pif-cardio-final.md` (informe final PIF) | TAB(`pif-cardio` parada 2; `pif-cardio-minimo`) | LC art.3; TAB:1065,1069 |
| 22 | Anatomy (wheresryan22) | https://github.com/wheresryan22/anatomy | repo (método) | Estudiado; método sí, kit no | INT como skill `.claude/skills/anatomy/` | `autonomo/bloques/b3/encargo.md:58-71`; TAB:~800 |
| 23 | LITFL «ST elevation in aVR» | https://litfl.com/st-elevation-in-avr/ | web | Solo enlace cruzado; web cerrada | SE (solo enlace) | `IR/culprit.md:81` |
| 24 | Tuit @RitikaTuliMD (2115035277…): por qué el ejercicio dispara la TV del TSVD | https://x.com/RitikaTuliMD/status/2115035277752463816 | tuit | Ficha del Radar (sin paper) | Idea suelta para bloque 3 / arritmias (animación DAD); sin fuente; no en tablero | ENT:108 |
| 25 | Tuit @RitikaTuliMD (2115370235…) | https://x.com/RitikaTuliMD/status/2115370235091943810 | tuit | No se pudo leer (x.com 402) | SE | ENT:38 |
| 26 | Tuit @shinriha_pt | https://x.com/shinriha_pt/status/2115396011443323199 | tuit | No se pudo leer | SE | ENT:38 |
| 27 | Tuit @WithAScalpel (2115405654…) | https://x.com/WithAScalpel/status/2115405654915514531 | tuit | No se pudo leer | SE | ENT:38 |
| 28 | Tuit @sindenzu1 | https://x.com/sindenzu1/status/2115270279207481772 | tuit | No se pudo leer | SE | ENT:38 |
| 29 | Tuit @MarlonVFZR | https://x.com/MarlonVFZR/status/2115269246699852211 | tuit | NO procesado (en la Bandeja, ni siquiera en ENTRADAS) | SE | Solo Bandeja #27 (comentario 28/10 y aviso 29/10) |
| 30 | Tuit @AguilarMolina_ | https://x.com/AguilarMolina_/status/2114860764812980605 | tuit | NO procesado | SE | Solo Bandeja #27 |
| 31 | Tuit @yoshiaki_666_ | https://x.com/yoshiaki_666_/status/2115200513235112315 | tuit | NO procesado | SE | Solo Bandeja #27 |
| 32 | PhysioNet, ECGSIM, Wave-Maven (BIDMC), ECGpedia, ecgwaves (propuestas del agente, no del usuario) | physionet.org · ecgsim.org · ecg.bidmc.harvard.edu · en.ecgpedia.org | web | Solo probadas: cerradas | SE; recomendación: abrir solo physionet.org (opcional) | `IR/pif-cardio-final.md:83-91`; LC art.3 |

## Coronarias

| Nº | Nombre | URL | Tipo | Qué se hizo | Estado | Dónde se menciona |
|---|---|---|---|---|---|---|
| 33 | Coronary Culprit (Cliff Reid) | https://www.cliffreid.com/culprit/#explore | simulador/curso | `IR/culprit.md`; informe https://claude.ai/artifact/Y6ewAZfAk5cPewnsnNcsAw | TAB(`arteria-culpable` = culprit A+B; C/D con `f2-coronarias`) APA tras Marino | ENT:172; TAB:1067; BIT:363 |
| 34 | AngioView | https://angioview.com | simulador | `IR/angioview.md`, `angioview-2.md` (vivo: Di Mario o motor) | TAB(`arteria-culpable` solo la tabla; `f2-coronarias`, `f2-angio` APA, espera Di Mario 2005 de pago) | ENT:272; TAB:777-778; LC art.2 |

## Radiología / imagen

| Nº | Nombre | URL | Tipo | Qué se hizo | Estado | Dónde se menciona |
|---|---|---|---|---|---|---|
| 35 | NavRad Anatomy | https://anatomy.navigatingradiology.com | web/atlas TC | `IR/navrad.md`, `-2` (vivo: casos), `-3` | TAB(`radio-informe` 31/10 → `radio-baratas`); `f4-*` APA (sin casos con licencia) | ENT:284; LC art.4 |
| 36 | The Radiology Assistant | https://radiologyassistant.nl | web | `IR/radiologyassistant.md`, `-2` | TAB(`f0-ra-biblio` pendiente, `radio-informe`, `radio-baratas`); solo enlazar | ENT:295; BIT:213-235 |
| 37 | NV-Reason-CT (NVIDIA) | https://github.com/NVIDIA-Medtech/NV-Reason-CT | repo IA | `IR/nv-reason-ct.md` (ficha HF y arXiv no vistas) | APA nivel 1; DES nivel 3 (servidor) | ENT:192; LC art.4 y 7 |
| 38 | Datasets de TC (TCIA, Zenodo/TotalSegmentator, Radiopaedia, RSNA-ICH en AWS, SIIM, Medical Decathlon) | zenodo.org/records/10047292 · registry.opendata.aws/rsna-intracranial-hemorrhage-detection · medicaldecathlon.com | datos | Citados en `IR/navrad-2.md`; cerrados | SE (casos con licencia; no mandados por el usuario) | HOJA-DE-RUTA fase 4; TAB `f4-visor` |

## Estudio / aprendizaje

| Nº | Nombre | URL | Tipo | Qué se hizo | Estado | Dónde se menciona |
|---|---|---|---|---|---|---|
| 39 | Anki + FSRS | https://docs.ankiweb.net (cerrada; leído `ankitects/anki-manual`) | app | `IR/anki-fsrs.md` (solo manual en GitHub, app no vista) | INT parcial (repaso espaciado con fecha, CLAUDE.md §2) + TAB(`estudio-04-11`) | LC art.5; `ideas/educacion-pionera/webs.md` |
| 40 | Oppia | https://github.com/oppia/oppia (oppia.org cerrada) | app/repo | `IR/oppia.md` (solo guía de autores) | TAB(`estudio-04-11`: tabla error → remediación, recap) | LC art.5 |
| 41 | La evolución de la confianza (ncase/trust) | https://github.com/ncase/trust (ncase.me cerrada) | juego | `IR/ncase-trust.md` (juego no visto) | TAB(`estudio-04-11`: apuesta repetida) | LC art.5 |
| 42 | Khanmigo, Brilliant, Isaac Physics, Khan Academy, Quizlet, Desmos, OpenStax (elegidas por el agente) | varias | web | Solo intento: todas 403 | SE | `ideas/educacion-pionera/webs.md` |
| 43 | Mi temario (app del usuario) | https://alvariitosw.github.io/mi-temario/ | app propia | Contrato de JSON en OM | SE para esta app (es de MIR) | OM `webs-medicas.md`, `CONTRATO-TEMARIO.md` |
| 44 | CoBaTrICE y BOE (programa de la especialidad) | cobatrice.esicm.org · boe.es | web/PDF | `competencias-r`; no abren | APA (TAB `competencias-r2r5`); sin PDF | TAB:837,886; partes `2026-10-27-competencias-r.md` |

## IA, voz y herramientas de trabajo

| Nº | Nombre | URL | Tipo | Qué se hizo | Estado | Dónde se menciona |
|---|---|---|---|---|---|---|
| 45 | LFM3-Audio-2B (Liquid AI) | https://huggingface.co/LiquidAI/LFM3-Audio-2B | modelo IA | `IR/lfm3-audio-2b.md` (no ejecutado) | DES: no se trae a la app | LC art.7; TAB:1075 |
| 46 | leanrea | `aicodeking/leanrea` | repo | Integrado en skill | INT (`/ingenieria-reversa` v2) | ENT:216 |
| 47 | REA (morluto/rea) | `morluto/rea` | repo | Herramienta de apoyo | INT (apoyo) | ENT:318 |
| 48 | clinical-ai-skills y research-agent-skills | `stefanogarzon/clinical-ai-skills`, `KalarisLabs/research-agent-skills` | repo | 8 skills instaladas | INT | ENT:238; `.claude/skills/SKILLS-EXTERNAS.md` |
| 49 | claude-code-setup (Anthropic) | (no consta) | plugin | Recomendaciones | INT (etapa A) | ENT:227 |
| 50 | Tuit de Boris Cherny sobre gasto de Claude Code | (URL no consta) | tuit | Comprobado | INT (lecciones en skill) | ENT:205 |
| 51 | Impeccable (pbakaus) | https://github.com/pbakaus/impeccable | repo | Probado una vez sin instalar | DES (instalación); texto de 8,5-10,4 px sin arreglar | ENT:151 |
| 52 | Spec Kit (GitHub) | https://github.com/github/spec-kit | repo | 2 ideas reescritas | INT (REGLAS §4.9, `encargo-revisado`) | TAB:394; REGLAS:236 |
| 53 | Ponytail (DietrichGebert) | https://github.com/DietrichGebert/ponytail | repo | 2 ideas | INT (reglas) | `docs/historial/trabajo-autonomo.md:210` |
| 54 | Telegram (opción B de Bandeja) | — | app | Descartada por GitHub | DES | `docs/historial/radar.md:120` |

(El otro repo, `app-organizador-mir`, tiene además recursos de comida, nutrición, guardias y sueño: Open Food Facts, USDA, OpenNutriTracker, FitBook, `generador-guardias`, `guardias-umi`, etc. Se ignoran por no ser de la app de UCI.)

## Listas finales

### (a) SIN ESTUDIAR o solo mencionados
- Tuits sin leer: @RitikaTuliMD 2115370235…, @shinriha_pt, @WithAScalpel 2115405654…, @sindenzu1 (leídos por la tarea, pero x.com dio 402 el 29/10).
- Tuits NO procesados todavía y ausentes de ENTRADAS: @MarlonVFZR, @AguilarMolina_, @yoshiaki_666_ (Bandeja #27).
- Papers que esperan PDF de pago: Carden 2026 (HSA) y Mireles-Cabodevila 2022 (asincronías).
- Webs: PulmonaryPOCUS `phone-cp-sim` (encargo de `eco-reforma`), CardioRender, CardioTeca (no abierta), LITFL.
- Repos propios `simulador-UCI-` y `simulador-uci-3d`.
- Mención sin estudiar o mandadas por el agente: PhysioNet/ECGSIM/Wave-Maven/ECGpedia, Khanmigo/Brilliant/Isaac/Khan/Quizlet, datasets de TC.

### (b) Con informe pero sin tarea del tablero que lo recoja
- `impella-antaa` solo entra en `shock-scai` (nota/pregunta de ECMO+Impella y SCAI); DanGer Shock (guion de módulo de shock en 3 casos, bucle P-V con y sin asistencia) no tiene tarea.
- `raiz-aortica`: B-041 solo en la bitácora, sin aprobar.
- `nv-reason-ct`, `navrad-2` (casos): sin tarea (`f4-*` aparcadas; solo `radio-baratas` coge lo barato).
- `angioview-2` ideas 1 y 3 (`f2-angio`, espera Di Mario) y la coronariografía animada (DES).
- `echosuite-2` idea 4 («mi paciente en la eco», nivel 2): fuera hasta la reforma; sin fila propia.
- Ideas sueltas del Radar: lazo P-V (WithAScalpel), TV del TSVD con el ejercicio, calculadora ACOD (CardioTeca), Easy LA Segmentator: solo en «Tanda pendiente», no en el tablero.
- `lfm3-audio-2b`, `impeccable`: cerrados/descartados (ninguna tarea, correcto).

### (c) Webs cerradas en la red del entorno
- phet.colorado.edu, brilliant.org, khanmigo.ai, isaacphysics.org, khanacademy.org, docs.ankiweb.net/ankiweb.net, oppia.org, ncase.me, desmos.com, openstax.org, ocw.mit.edu.
- x.com (402, 29/10; antes abierto el 27-28/10), twitter.com, twimg.com, threadreaderapp.com.
- www.cardioteca.com, cardiorender.com (no abierto).
- litfl.com, physionet.org, ecgsim.org, ecgwaves.com, ecg.bidmc.harvard.edu, en.ecgpedia.org, cvphysiology.com, escardio.org, farmacotips.com.
- huggingface.co y arxiv.org (NV-Reason-CT), heart.org (AHA 2025), zenodo.org, TCIA, radiopaedia.org, registry.opendata.aws, medicaldecathlon.com.
- boe.es, sanidad.gob.es, cobatrice.esicm.org, doi.org, t.co, Europe PMC en parte, criticalcarereviews.com, link.springer.com, nefrologiaaldia.org (WebFetch).
- Abiertas por el usuario cuando se pidió: `*.navigatingradiology.com`, `*.ventriculus.org`, `iamtechartist.com`, radiologyassistant.nl, cliffreid.com.
