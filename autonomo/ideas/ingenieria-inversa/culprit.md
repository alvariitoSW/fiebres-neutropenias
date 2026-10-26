# Coronary Culprit (Cliff Reid) · ingeniería inversa · 26/10/2026

Encargo B-026. Recorrido a 390×844 (Playwright, táctil, GPU de software) por sus 5 pestañas, 8 escenarios de Explorar
y lectura en memoria de su programa (sin source maps; trozos de ~120 caracteres alrededor de palabras clave). Nada suyo
guardado; solo 2 capturas del simulador para el informe (JPEG 390 px, fuera del repositorio). Etiquetas: **visto**
(dónde), **deducido**, **no visto**.

## 1. Qué es
- «Coronary Culprit»: **ocluyes cualquier punto de una coronaria en un corazón 3D y el ECG de 12 derivaciones y la eco
  responden**. Enseña el IAM por oclusión (OMI), sus signos sutiles y sus imitadores. En inglés; para urgencias, UCI y
  cardiología. Gratis, «aún en refinamiento», donativo opcional (Stripe). Visto: portada y meta.
- Hecho por el Dr. Cliff Reid (urgencias y emergencias prehospitalarias, curso «Resuscitation Wizardry») **con Claude
  Code**, igual que nosotros. Visto: cabecera.
- **5 pestañas** (visto):
  - **Curso** «de los vectores a la sala de hemodinámica»: 6 módulos + final (39 pasos): derivaciones como cámaras;
    territorios y puntos de bifurcación; variantes (dominancia, DA que rodea la punta, ramo intermedio); OMI sutil;
    evolución temporal y reperfusión; imitadores y la eco como desempate; «haz la guardia» (5 pacientes a tiempo real).
    Repaso espaciado a 1, 3, 7, 16 y 35 días.
  - **Explorar**: corazón 3D con 7 vistas (AP, OAI, OAD, craneal, «araña», inferior, posterior), vector ST, ejes de
    derivaciones, rayos X, rótulos. Se elige el punto de oclusión (proximal/distal, ← →); línea de tiempo hiperagudo →
    agudo → evolución → completado; ocluida / reperfundida pronto / tarde. ECG de 12 con «predice primero», «recorrido
    desde el electrodo» (tocas una derivación y ves el corazón desde ella), valores de ST, V4R y V7-V9. Eco TTE
    (PLAX, PSAX, A4C, A2C) con los segmentos alterados resaltados, FEVI estimada e índice de motilidad (WMSI), cámara
    lenta. Ficha lateral: % de cada pared isquémica, mapa de 17 segmentos, derivaciones con ↑ST / menor / ↓ST, y una
    explicación con los signos (p. ej. «distorsión terminal del QRS»).
  - **36 escenarios** (visto): territorios clásicos (DA proximal, media, que rodea la punta; CD proximal con VD, distal;
    Cx; Cx dominante; tronco); OMI sutil (T hiperagudas, inferior precoz «mira aVL», bandera sudafricana, ramo
    intermedio, Aslanger, de Winter, obtusa marginal «silente», BRIHH + OMI con Sgarbossa modificado de Smith, BRD nuevo
    + DA); reperfusión (Wellens A y B, posterior), IAM anterior completado, isquemia subendocárdica «↑ST en aVR: no es
    OMI»; imitadores (pericarditis, repolarización precoz, HVI, hiperpotasemia, aneurisma, Takotsubo).
  - **Casos** (14 pacientes, reloj real): cada acción (repetir ECG, derivaciones derechas/posteriores, eco, troponina)
    gasta tiempo y el corazón sigue evolucionando (ocluye, reperfunde, reocluye o es un imitador). Puntúa lo pronto que
    activas tras la primera oportunidad; un OMI perdido o una activación falsa lo pierden todo.
  - **Entrenamiento** (ECG → arteria, 9 respuestas; mazos de territorio, signos, eco e imitadores) con ECG generados al
    vuelo, maestría por categoría (90 % de las 10 últimas y mediana < 6 s) y matriz de confusiones. **Reto**: 10 casos;
    tipos «nombra la culpable», «elige el ECG», «predice el 12», «coloca el trombo», «nombra el signo».

## 2. Cómo está hecho
- **Una sola página** (414 kB): todo el programa en un script en línea de 342 kB, sin source maps; **three.js r128**
  de cdnjs para el 3D; fuentes Barlow e IBM Plex Mono de Google. ECG y eco dibujados en canvas. Sin desbordamiento a
  390 px. Visto: mapa de red y HTML.
- **Modelo** (visto en su «About the model» y en el código): VI en los **17 segmentos AHA + 2 regiones de VD**. Cada
  tramo de arteria aporta una fracción del riego de cada región, que cambia con la dominancia (derecha / codominante /
  izquierda), la DA que rodea la punta y el ramo intermedio. Ocluir un punto deja isquémico todo lo de aguas abajo en
  proporción al riego perdido. Las ramas tienen tramos con nombre («Cx proximal, antes de OM1»…).
- **ECG**: cada región isquémica aporta una corriente de lesión. En miembros es un vector frontal: **solo calcula I y
  II y deriva las otras cuatro** (III = II − I…), así la imagen especular es exacta. Precordiales: proyección +
  proximidad (por eso la pared posterior sale como ↓ST en V1-V3). ST medido en J + 40 ms. BRIHH con ST secundario
  discordante proporcional al QRS dominante; HVI e hiperpotasemia como imitadores encima. FC y PR según el territorio
  (bradicardia y BAV 1.º si la arteria dominante lleva la del nodo AV).
- **Eco**: motilidad de cada segmento según su riego perdido (hipo → acinesia → discinesia con pared fina en el ápex
  completado); segmentos lejanos hipercinéticos; músculo reperfundido aturdido. FEVI y WMSI «estimaciones groseras»
  desde esos grados (WMSI = suma / 17).
- **Guarda** en `localStorage`: progreso, repaso espaciado, marcadores y un código anónimo. **Analítica propia**:
  envía nombres de evento con ese código a un *worker* de Cloudflare (el mismo que recibe «¿has visto un error?») y
  Cloudflare Insights (ambos bloqueados aquí). Visto en el código.
- Modo «Presentar» (para dar clase). No visto en uso.

## 3. De dónde salen sus cifras
- **No cita fuentes**: ni guías, ni artículos, ni DOI en todo el código (buscado: doi, pubmed, Circulation, JACC, ESC,
  AHA, guideline). Solo nombra a autores de signos (Smith, Aslanger, Wellens, de Winter, Sgarbossa).
- Avisa de sus límites (visto): geometría y amplitudes idealizadas; el ECG real cambia con el hábito corporal, la
  colocación de electrodos, colaterales, IAM previo, HVI y el momento; «para intuición de vectores y territorios, no
  para calibrar umbrales en milímetros».
- **Para nosotros**: sus cifras (2 % de las DA proximales con de Winter, 1 de cada 10 izquierda dominante, 0,36 de
  Smith…) solo dicen qué buscar en la ESC de SCA y en el libro de ECG de la rotación (PDF que aún no tenemos).

### Dónde buscar sus cifras (búsqueda del 26/10; aún no son fuente: falta el PDF en `docs/`)
- **de Winter, «2 %»**: carta de de Winter et al., N Engl J Med 2008;359:2071-3 (PubMed 18987380): 30 de 1532 IAM
  anteriores (2,0 %), todos con oclusión de la DA proximal y sin oclusión del tronco; casi todos con ↑ST 1-2 mm en
  aVR. Visto en el resumen de PubMed y fuentes secundarias, no en el texto completo.
- **Dominancia izquierda, «1 de cada 10»**: las series varían mucho (izquierda 7-25 %, codominancia 4-15 %); la mayor,
  6382 TC, da 91 % derecha y 9 % izquierda (PMC4505791). Solo fuentes secundarias abiertas: buscar la cifra en la
  ESC de SCA o en un texto de anatomía antes de usarla.
- **Tronco y aVR**: Yamaji et al. (16 oclusiones agudas del tronco): ↑ST en aVR en el 88 % (43 % en la DA, 8 % en la
  CD); ↑ST aVR ≥ V1 separa tronco de DA con S 81 % y E 80 %. Contradice su modelo (aVR baja en su oclusión del
  tronco). Visto en una revisión (World J Cardiol, PMC4110611) y en LITFL, no en el artículo original.

## 4. Licencia y coste
- Sin licencia publicada ni aviso de copyright en la página (buscado: licen, ©, copyright). **Deducido: todos los
  derechos reservados**: se pueden traer ideas, no su código, textos ni imágenes. Gratis, sin cuenta.
- three.js es MIT (para nosotros da igual: no lo usaríamos, §2).

## 5. Frente a nosotros
- **Ganan ellos**: el bucle **arteria ↔ derivaciones ↔ segmentos de eco** en una sola pantalla, con variantes
  anatómicas y evolución temporal; la imagen especular «por aritmética»; casos con reloj que castigan al OMI perdido;
  entrenamiento con ECG nuevos cada vez y matriz de confusiones.
- **Ganamos nosotros**: español; cada cifra con su PDF y página; fichas para estudiar; Mayéutica y casos que
  evolucionan con razonamiento; nuestro motor de eco con hemodinámica (Circulación viva); sin analítica ni red.
- **Encaja con**: Fase 1 de la hoja de ruta (`territorios arteria ↔ derivaciones ↔ segmentos`, `b3-3c`), Fase 2
  (`f2-coronarias`, dominancia) y el atlas de eco (motilidad segmentaria en `atlas-ouyang.js`). Situación **G3**.

## 6. Pares de prueba (observados en su pantalla, fase aguda, ocluida; NO son fuente clínica)
| Escenario (su punto de oclusión) | ECG | ↑ST | ↓ST | Eco |
|---|---|---|---|---|
| DA proximal (antes de S1) | 104 lpm, PR 160 | aVL, V1-V6 (menor I, V4R) | III, aVF, V7-V9 | FEVI ≈ 25 %, WMSI 2,24; anterior 100 %, apical 87 % |
| CD proximal (antes de la marginal del VD) | 54 lpm, PR 270 | II, III, aVF, V4R, V7, V8 | I, aVR, aVL, V2-V3 | FEVI ≈ 50 %, 1,59 |
| CD distal (antes de la cruz) | 54 lpm, PR 270 | II, III, aVF, V7, V8 | aVR, aVL, V2-V3 (V1 se une) | FEVI ≈ 50 %, 1,59 |
| Cx proximal (antes de OM1) | 76 lpm, PR 160 | I, II, aVL, V7-V9 | aVR, V1-V3 | FEVI ≈ 60 %, 1,35 |
| Cx dominante | 54 lpm, PR 270 | I, II, III, aVF, V6-V9 | aVR, aVL, V1-V4 | FEVI ≈ 40 %, 1,88 |
| DA distal que rodea la punta | 76 lpm | II, III, aVF, V3-V6 | aVR (aVL no baja) | FEVI ≈ 50 %, 1,59 |
| Tronco | 104 lpm | I, aVL, V2-V6 | III, aVR, aVF | FEVI ≈ 15 %, 2,59 |
| de Winter (DA proximal) | 76 lpm | — | I, II, V2-V9 | FEVI ≈ 25 % |
| Bandera sudafricana (D1) | 76 lpm | aVL (menor I, V2) | III, aVF | FEVI ≈ 65 %, 1,18 |

Nota para cuando se construya: en su tronco sale **↓ST en aVR**; lo que enseñan muchos textos es ↑ST en aVR con
descenso difuso (eso lo ponen en «isquemia subendocárdica»). No se decide aquí: se comprueba con la fuente.

## 7. Piezas (para la próxima visita)
`/culprit/` HTML 414 666 B (script en línea 342 301 B, estilos 50 515 B) · three.js r128 (cdnjs) · Google Fonts
(Barlow Condensed, Barlow, IBM Plex Mono) · Cloudflare Insights · worker de opiniones y eventos · Stripe (donativo).

## 8. Lo que no se pudo ver
- cdnjs está bloqueado en el entorno: three.js r128 (MIT, idéntico) se sirvió desde el registro de npm para que la
  página arrancara. Su código no se tocó.
- No se jugó un caso entero, ni el entrenamiento, ni el modo Presentar; tampoco la vista «recorrido desde el
  electrodo» ni la derivación de las precordiales con detalle (solo lo que dicen y los trozos citados).
