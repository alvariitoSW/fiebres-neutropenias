# Ventriculus (ventriculus.org): informe de ingeniería inversa (29/10/2026)

Informe: https://claude.ai/artifact/MKY1M2QsghdRuxS5GYMjVi. Pedido por el usuario: «es justamente lo que me gustaría hacer en cardiología pif, que esté así puesto para poder
estudiar bien». Playwright a 390×844, 4 scripts; su HTML y su JS se leyeron en memoria (solo se guardaron capturas en
`/tmp`). Etiquetas: **visto**, **deducido**, **no visto**.

## 1. Qué es
- 9 herramientas gratuitas de cardiología, en inglés, de un solo autor (Berke Cenktug Korucu, MD). Sin anuncios.
  Para estudiantes, residentes, enfermería de UCI y docentes. Solo el simulador de shock pide cuenta. **Visto** (portada).
- Cada una vive en su subdominio: `ecg.` (atlas de ECG), `exam.` (exploración y auscultación), `echo.` (chuleta de
  ETT), `pharmacy.` (fármacos), `preop.` (valoración preoperatoria), `sim.` (shock cardiogénico), `cath.`,
  `eplab.` y `ep.` (hemodinámica, electrofisiología, marcapasos; piden pantalla grande, según la propia web).
- Lema: «fisiología, no dibujos». El trazado sale de un modelo que funciona, y la explicación viene después, con la
  guía de origen. Cada pieza lleva la etiqueta «Draft» hasta que el autor la revisa. **Visto**.

## 2. El atlas de ECG (lo que interesa al PIF)
- **El camino** (**visto**): 0 Primeros pasos · 1 Lo básico · 2 Hipertrofias y crecimientos · 3 Arritmias · 4 Bloqueos
  · 5 Preexcitación · 6 Isquemia e infarto · 7 Remates (iones, fármacos, hipotermia, SNC, QT largo) · 8 Todo junto ·
  C Cardiopatías congénitas del adulto · + Avanzado (casos) · Lab. Hay un buscador de condiciones arriba.
- **Cada capítulo** (**visto**): objetivos plegables arriba, una fila de pestañas numeradas (9 en el cap. 1, 19 en el
  cap. 3) y las dos últimas siempre son «Questions» (5) y «Post-test» (10; aprobado con el 80 %). Botón «Next: …» al pie.
- **Cada pestaña** (**visto**): arriba el **trazado vivo** (DII, DII+V1 o 12 derivaciones; 25 mm/s · 10 mm/mV; pausa,
  lupa, botón «12 leads»), el **vector** en el plano frontal y el **corazón** (de frente o desde arriba). Debajo: un
  título-pregunta, la etiqueta Draft, **2-3 frases** con una sola negrita y **un mando** que lo cambia todo:
  - cap. 1 «Frecuencia»: deslizador de FC; el trazado marca «4,0 cuadros grandes» entre dos R;
  - cap. 3 «¿Dónde nació esta P?»: tocas un punto de la aurícula en el dibujo (o un botón: AD alta, AD baja/seno
    coronario, AI, unión AV) y cambian la P, el vector y las 12 derivaciones;
  - cap. 6 «La lesión es un vector»: DA proximal con 5 tiempos (minutos: T hiperaguda → semanas: Q que queda).
- **Fuentes** al pie de cada capítulo: AHA/ACCF/HRS (Kligfield 2007, Rautaharju 2009…), 4.ª definición de IAM, guía
  SVT 2015, de Winter 2008, de Zwaan 1982. Sin página. **Visto**.
- **Preguntas** (**visto**): 3 opciones; al responder, una frase de por qué («Tres cuadros grandes entre R: 300 ÷ 3 =
  100»). En su código (**visto**, trozo) cada pregunta trae su **propio trazado generado** por el modelo
  (`spec: buildModel({ ...DEF, hr: 100 })`): no son imágenes, el ECG de la pregunta se pinta al vuelo.
- **Cap. 8 «Léelo en orden y comprométete»** (**visto**): 7 pasos (FC, ritmo, eje, intervalos, P, QRS, ST-T) **medidos
  del propio trazado**; pacientes de ejemplo («dolor torácico, 50 años», «insuficiencia renal, débil», «síncope, 79
  años»); «dilo en voz alta y destapa» (Answer: Hidden/Show).
- **Avanzado**: 17 casos de decisión («79 años, dos síncopes esta semana. ¿Siguiente paso?»). **Visto**.
- **Lab** (**visto**): combina ritmo (sinusal, unión, FA, flutter 2:1, BAV completo), FC 35-180, PR 100-360 ms,
  aurículas, conducción (BRD, BRI, HBA, HBP, BRD+HBA), vía accesoria (3 sitios), hipertrofia (HVI, HVI+sobrecarga,
  HVD), lesión (DA proximal, DA media-distal, CD, Cx, posterior, TCI/difusa), K 2-9 mmol/L, QTc 330-600 ms y el eje
  (de las fuerzas o a mano). Lista de 7 pasos medida del trazado construido.
- **Técnica** (**visto**): un solo HTML de 276 kB, JS sin librerías, 3 `canvas` + 1 SVG. «Dipole engine v0.1»: el
  corazón es **un solo vector H(t)**, suma de componentes (una dirección con amplitud en gaussiana asimétrica); cada
  derivación es la proyección `L · H(t)`; base del triángulo de Einthoven idealizado o de Dower. Sin mapas de código.
  A 390 px no desborda. Guarda el post-test en `localStorage` (`vx_post`). Analítica de Google solo si aceptas.
- **Revisión**: «Draft content awaits clinical review» en todo lo visto. **Visto**.

## 3. Las otras herramientas (vistazo)
- **Exam** (**visto**): 12 lesiones (EA, IA, EM, IM, prolapso, MCH obstructiva, CIV, CIA, pericarditis, taponamiento,
  constrictiva); 8 focos, campana/diafragma, decúbito/lateral/sentado, respiración, maniobras (Valsalva, de pie,
  cuclillas, prensión, nitrito de amilo); guía de 7 pasos («busca S1 en el ápex y cronométralo con el carotídeo»),
  «Explorar libre» y «Ponte a prueba»; PVY, pulso y TA cambian con la lesión. Sonidos sintetizados (no oídos).
- **Echo**: chuleta de ETT por vistas y por valvulopatía, colores de gravedad, calculadoras. **Visto**.
- **Pharmacy**: 113 fármacos, «0 de 113 revisados», escenarios, calculadoras, ensayos. **Visto**.
- **Pre-op**: consulta paso a paso AHA/ACC 2024 (RCRI, Gupta MICA, DASI), casos y test. **Visto**.
- **Shock (sim.)**: 20 casos de shock cardiogénico de 15 min; cada ingreso sortea constantes y 2 complicaciones
  ocultas; enfermera que repite las órdenes (y a veces entiende mal); 3D en ordenador, 2D en el móvil. **Visto** (lista).
- **Cath, EP, Device**: **no vistos** (piden ordenador).

## 4. Licencias
- «© 2026 Berke Cenktug Korucu, MD. All rights reserved.» en todas. Solo la anatomía del cateterismo es BodyParts3D
  (© DBCLS, CC BY 4.0). Copiado tal cual, sin verificar más. → **Ideas sí; código, textos, preguntas e imágenes no.**

## 5. Frente a nosotros (cuaderno «ECG y arritmias», PIF → Cardiología, PR #36, ya en `main`)
- Nosotros: 11 fichas (método, frecuencia, eje, hipertrofias, isquemia, intervalos, arritmias, SCA, marcapasos…)
  fieles a López Ramírez 2012 con página; 83 preguntas en 4 bancos y ~87 ejercicios; **ECG reales del libro** con el
  lector FREHIII (chips que encienden derivaciones); 14 enlaces al **corazón eléctrico** (`data-ritmo-vivo`: sinusal,
  FA, flutter, TV, FV, torsade, WPW, STEMI, hiperK…).
- Ganan ellos: el **trazado vivo arriba de cada idea** con un mando; el **vector y las 12 derivaciones** a la vez; las
  preguntas con su propio trazado; el lab que lo combina todo; el camino con el post-test.
- Ganamos nosotros: fuente con página y fiel; español; ECG reales; preguntas razonadas al estilo de REGLAS §8 (piensa y
  destapa, encuentra el error, caso que evoluciona); el lector paso a paso sobre ECG de verdad; todo enlazado con
  Marino, El Libro Azul y los modelos vivos. Ellos, todo en «Draft» y sin página.
- Encaja con las tareas aparcadas de B-033: `ecg-vector-maqueta`/`-app` (vector y derivaciones, filas 32-33) y
  `arritmias-*` (laboratorio, filas 29-31). Ventriculus es la prueba de que esa idea funciona en el móvil.

## 6. Pares de prueba (observados en su pantalla; no son fuente clínica)
- Lab, estado inicial: FC 72 · eje +38° · PR 166 · QRS 80 · QTc 410 · P 1,2 mm en DII · transición V3 · q septal en V6.
- Lab, BRI: eje +17° · QRS 147 ms · QTc 460 ms · transición V1 · q septal en V6 ausente.
- Cap. 1, pregunta 1: 3 cuadros grandes entre R → 100/min.
- Post-test cap. 1: DI positivo, aVF negativo, DII negativo → desviación izquierda del eje.
- Cap. 3: origen en AD baja o unión → P negativa en II, III y aVF.
- Topes de los mandos del lab: FC 35-180/min · PR 100-360 ms · K 2-9 mmol/L · QTc 330-600 ms.

## 7. Piezas (para la próxima visita)
- `ventriculus.org`: `assets/index-BvHdchl_.js` 281 kB, `index-D6j2FrP7.css` 16 kB, fuente Geist.
- `ecg.`: un solo HTML de 276 kB (motor dentro, «dipole engine v0.1»). `exam.`: `js/model.js` 26 kB, `synth.js`,
  `guide.js`, `lab.js`, `anatomy.js`. `echo.`: HTML de 175 kB. `pharmacy.`: `index-cIR1MwGO.js` 1,48 MB + service
  worker. `preop.`: `index-U2TUUx-R.js` 219 kB. `sim.`: HTML de 2,06 MB («Version 15»).
- Red: hace falta `*.ventriculus.org` (abierto el 29/10). `static.cloudflareinsights.com` sigue cerrado (no hace falta).

## 8. No visto
- Cath, EP y Device; un caso del simulador de shock por dentro; el capítulo de congénitas; el buscador en uso; el efecto
  del K en el trazado (la lista de 7 pasos no cambió al subir el K al máximo: puede que solo cambie la imagen);
  los sonidos del Exam.
