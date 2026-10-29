# PIF Cardiología · informe final de desarrollo (29/10/2026)

Pedido por el usuario el 29/10: «el informe final de desarrollo del PIF de cardiología para dejarlo ya pensado […]
mezclado ventrículous y el laboratorio de arritmias, obviamente lo de un electro y que se vean las 12 derivaciones como
debería verse». Lo debatirá después el gabinete (Consejo de Ministros). Sin construir. Informe para el móvil:
https://claude.ai/artifact/ADJBdNHTMRBQyLfE4x3zvd

Fuentes de este informe: `ventriculus.md` (hoy), `ritmolab.md`/`-2`/`-3`, el plan B-033 (`autonomo/planes/ecg-plan.html`),
el cuaderno `js/modules/pif-cardio/`, el corazón eléctrico `js/modules/libros/ritmo-vivo/`, `js/data/pif-rotaciones.js`
y `docs/`. Webs nuevas probadas en la red (abajo).

## 1. Tesis
Ventriculus enseña con un corazón que late arriba de cada idea y unas 12 derivaciones que se ven como en papel;
RitmoLab enseña el orden a pie de cama (¿pulso? ¿estable? ¿ancho o estrecho?). Nosotros tenemos lo que les falta a los
dos: libro con página, ECG reales, preguntas que hacen pensar y un motor con «una sola verdad». El PIF final junta las tres
cosas sobre nuestro motor.

## 2. Lo que ya tenemos (visto en el repositorio)
- **Objetivos del PIF** (`pif-rotaciones.js`, PFI-UMI-R1-01, nov-dic 2026): historia clínica · IC aguda · EKG y
  arritmias · SCA · endocarditis, pericarditis, miocarditis · eco y cateterismo básicos.
- **Cuaderno «ECG y arritmias»** (PR #36, en `main`): 11 fichas fieles a López Ramírez 2012 con página; lector FREHIII
  sobre ECG reales; 83 preguntas en 4 bancos; ~87 ejercicios; 14 enlaces al corazón eléctrico.
- **Corazón eléctrico** (`ritmo-vivo`): grafo de conducción + motor de sucesos; el ECG sale de sumar teselas de un
  **corte 2D**. Hoy dibuja **3 derivaciones** (`DERIV`: II, V2, V3), con amplitudes ilustrativas. 14 estados.
- **Fuentes en `docs/`**: López Ramírez 2012 (3 partes); ESC 2019 TSV; ESC 2021 estimulación; ESC 2023 SCA (2);
  ESC 2023 miocardiopatías (2); ESC 2026 IC (2); AHA 2025 (RCP y SVA); ASE (Lang 2015, Hahn 2013, Klein 2013
  pericardio); Marino 2024 caps. 14-17 (shock) y 18-21 (corazón); El Libro Azul sección I (cardiovascular).
- **En otras partes de la app**: Merino Cardiología y ESC 2026 de IC (Fisiopatología UCI → Cardiología), atlas de eco
  (10 capítulos), receptores animados, Marino.
- **Tareas ya aprobadas y aparcadas** (B-033, tablero filas 28-33): `ecg-guardia` ≈2,9 M · `arritmias-maqueta` ≈3,4 M
  · `arritmias-app` ≈2,9 M · `arritmias-casos` ≈2,75 M · `ecg-vector-maqueta` ≈2,0 M · `ecg-vector-app` ≈4,75 M
  (≈18,7 M en total, más paradas y director). Y `b3-bradi` (versión corta) en el tablero.

## 3. Las 12 derivaciones «como debería verse» (la pieza central)
- **Lo que enseña Ventriculus** (**visto**, captura del Lab a 390 px): formato estándar 3 × 4 (I-aVR-V1-V4 · II-aVL-V2-V5 ·
  III-aVF-V3-V6) + 3 tiras largas (V1, II, V5), pulso de calibración, papel 25 mm/s · 10 mm/mV, lupa y pausa; al lado,
  el vector en el plano frontal. Por defecto, una sola derivación grande y el botón «12 leads».
- **Por qué nuestro motor no puede todavía** (**visto**, `motor.js:355-362`): es un corte 2D (izquierda-derecha,
  arriba-abajo). Las 6 de miembros son proyecciones en ese plano: salen bien. Las **precordiales necesitan la
  profundidad** (delante-detrás); hoy V2 y V3 se apañan con reglas por banda.
- **Propuesta**: una sola verdad. Cada trozo de músculo del grafo recibe también su profundidad (VD delante, pared
  posterior del VI detrás, tabique en medio) y cada derivación es un vector en 3D (miembros en el plano frontal,
  V1-V6 en el horizontal). Así salen las 12 del mismo latido, con la imagen especular y el eje «gratis». Es lo que
  `ritmolab-3.md` llamó «profundidad en el grafo, nunca tabla fija». No un segundo motor de dipolo como el suyo.
- **Medidas desde el trazado** (como su lista de 7 pasos): FC, ritmo, eje, PR, QRS, QTc, P, transición, ST-T, medidos
  del latido; los **umbrales**, de López Ramírez con página (y nota de fuentes donde ESC difiera). Origen visible:
  «ilustrativo» en las amplitudes.
- **En el móvil**: la tira grande de una derivación arriba de la ficha; las 12 a pantalla completa con giro horizontal,
  lupa y pellizco; y el formato 3 × 4 + tiras como en papel.
- **Referencia de «así se ve de verdad»**: los ECG reales del libro (ya en el cuaderno). Candidatos libres (sin verificar
  en origen): ECG reales en Wikimedia Commons, licencia archivo por archivo; lo de CardioNetworks (ECGpedia) sale como
  CC BY-SA 3.0 en Commons, pero ECGpedia dice CC BY-NC-SA en su web: hay que mirar cada archivo.

## 4. El laboratorio de arritmias (RitmoLab + Ventriculus, sobre nuestro motor)
- **Dos puertas, una pieza**: «Construye un ECG» (Ventriculus Lab: ritmo, FC, PR, rama, vía accesoria, hipertrofia,
  arteria ocluida, K, QTc) y «Paciente con arritmia» (RitmoLab: monitor, ¿pulso?, ¿estable?, SYNC, marcapasos
  transcutáneo, evolución). Las dos escriben en el mismo grafo.
- **Modos**: Estudio (ruta visible) y Guardia (ruta oculta, revisión al final sin nota /100), como B-033.
- **Topes** con origen (REGLAS §1.14). Pares de prueba de Ventriculus en `ventriculus.md` §6.
- **Conducta** solo de AHA 2025 y ESC 2019/2021 con página; sin cifras de RitmoLab ni de Ventriculus.

## 5. Cómo se estudia (de Ventriculus, con nuestras reglas)
- **Camino por objetivos**: cada objetivo del PIF es un capítulo; arriba, sus objetivos; pestañas cortas; las dos últimas,
  «Preguntas» y «Examen final» (aprobado 80 %; se guarda con el quiz, que ya tiene permiso de `localStorage`).
- **Cada ficha**: arriba el ECG vivo con un mando (FC, origen de la P, tiempo de evolución del IAM…), 2-3 frases, una
  negrita, «Ver en el texto».
- **Preguntas que pintan su propio ECG** (Ventriculus pinta cada pregunta con el modelo; **visto** en su código) junto a
  las de los ECG reales del libro. Formatos de REGLAS §8: piensa antes, piensa y destapa, encuentra el error y caso.
- **«Léelo en orden y destapa»** con paciente (cap. 8 de Ventriculus) sobre el lector FREHIII.

## 6. Los otros 5 objetivos del PIF (qué hay y qué falta)
| Objetivo | Ya en la app / `docs/` | Idea de fuera | Falta |
|---|---|---|---|
| Historia clínica cardiológica | — | Ventriculus Exam: 12 lesiones, focos, maniobras, guía y test | PDF de semiología cardíaca |
| IC aguda | ESC 2026 IC, Merino, Marino 14-17 (shock), modelos vivos | Radiology Assistant «Chest X-ray: heart failure» (Rx real rotulada) | nada para empezar; Rx real con licencia, aparte |
| SCA | ESC 2023 SCA, Merino, López Ramírez (SCA, ¿qué arteria?) | Ventriculus cap. 6 (lesión = vector, 5 tiempos) | depende de las 12 derivaciones |
| Endocarditis, pericarditis, miocarditis | Klein 2013 pericardio (ASE), ESC 2023 miocardiopatías | — | PDF ESC 2023 endocarditis y ESC 2025 miocarditis-pericarditis |
| Eco y cateterismo básicos | atlas de eco (10 caps.), Lang/Hahn | Ventriculus Echo (chuleta por vistas), AngioView (aparcado) | fuente de proyecciones (AngioView) |

Regla §2: nada se fusiona; el PIF **enlaza** a Merino, Marino, ESC y el atlas, y solo escribe lo que no esté.

## 7. Webs probadas en la red el 29/10
- **Abren**: `*.ventriculus.org`, `radiologyassistant.nl` (sección cardiovascular: anatomía cardíaca y coronaria,
  CAD-RADS, miocardiopatías, dispositivos, aorta; en tórax: «heart failure» en Rx), `anatomy.navigatingradiology.com`,
  `pmc.ncbi.nlm.nih.gov` (artículos de acceso libre), `commons.wikimedia.org`/`upload.wikimedia.org` (la API
  respondió «demasiadas peticiones»: no se pudo contar).
- **Cerradas** (`connect_rejected`): `litfl.com`, `en.ecgpedia.org`, `physionet.org`, `ecgsim.org`, `ecgwaves.com`,
  `ecg.bidmc.harvard.edu` (Wave-Maven), `cvphysiology.com`, `blaufuss.org`, `easyauscultation.com`,
  `hqmeded-ecg.blogspot.com`, `ecgweekly.com`, `geekymedics.com`, `wikem.org`, `escardio.org`, `farmacotips.com`.
  Las que más aportarían: **ECGSIM** (simulador de 12 derivaciones desde un modelo del corazón), **LITFL** (biblioteca
  de ECG), **Wave-Maven** (casos de ECG con pregunta) y **PhysioNet** (ECG reales con licencia abierta).

## 8. Fases propuestas (orden de lo barato a lo grande)
1. **Esqueleto del PIF** (pequeño, nada): capítulos = objetivos, objetivos arriba, enlaces a lo que ya existe, examen
   final por capítulo con el quiz.
2. **«Léelo en orden y destapa»** + guardia de 30 s (`ecg-guardia`, ≈2,9 M).
3. **12 derivaciones en el motor** (`ecg-vector-maqueta` → `ecg-vector-app`, ≈6,75 M): profundidad, 12 vectores,
   medidas del trazado, formato 3 × 4 + tiras. Maqueta y parada antes.
4. **ECG vivo arriba de cada ficha y preguntas que pintan su ECG** (medio, nada; tras la 3).
5. **Laboratorio** (`arritmias-maqueta` → `-app` → `-casos`, ≈9,05 M), con la puerta «Construye un ECG».
6. **Objetivos restantes**: exploración (PDF), endocarditis/peri/miocarditis (PDF), Rx de IC, cateterismo (AngioView).

## 9. Lo que no se trae
Código, textos, preguntas, imágenes y cifras de Ventriculus y RitmoLab (todos los derechos reservados; las suyas en
«Draft» o sin página); un segundo motor; un ECG de 12 sintético presentado como real; precordiales de tabla fija;
cuentas, servidor y analítica.

## 10. Para el gabinete
1. ¿Se aprueba el orden de fases y que el PIF siga **al final** (tras Marino y El Libro Azul)?
2. ¿Profundidad en el grafo (una sola verdad) o un segundo motor de dipolo? Recomendado: profundidad.
3. ¿Se fusionan las tareas B-033 (28-33) con las ideas de Ventriculus en un solo bloque `pif-cardio` con 3 paradas?
4. ¿Se piden los PDF que faltan (semiología, ESC 2023 endocarditis, ESC 2025 miocarditis-pericarditis)?
5. ¿Se abren en la red `ecgsim.org`, `litfl.com`, `ecg.bidmc.harvard.edu` y `physionet.org` para una 2.ª pasada?

## No visto
Las webs cerradas; la API de Commons (límite de peticiones); el interior de los artículos de Radiology Assistant de
cardio (solo la lista); el cateterismo, la EP y los marcapasos de Ventriculus.
