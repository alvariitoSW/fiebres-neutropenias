# Plan corto · b3-paso4 · grupo 6 (3B · TEP) — profesor, 30/10/2026

Fuente comprobada con `pdftotext`: `docs/marino-2024-respiratory-management-caps22-26.pdf`, cap. 22 = **PDF 1-12** (2 Tabla 22.1 ·
3 dímero D · 4 eco venosa, brazo · 5 angio-TC y Fig. 22.1 · 6 subsegmentario · 7 eco y riesgo · 8 Tabla 22.3 · 9 HNF, Ec. 22.1,
contraindicaciones · 10 lisis sistémica/catéter, 48 h, trombectomía y **Fig. 22.2 (foto real)** · 11 fluidos, NA, dobutamina,
**«no disolver el émbolo sino evitar el siguiente»** · 12 filtros). Páginas del PDF. Fichas: `neumo-ep-diagnostico`, `neumo-ep-manejo`.
Regla del encargo: lo nuevo en archivo propio; `vaso-vivo-escena.js` y `telar-vivo-data.js` solo reciben un gancho de 1-3 líneas.

### 6a `tep-lisis` · vaso vivo, archivo nuevo `js/modules/libros/vaso-vivo-tep.js` (+ `js/data/vaso-vivo-data-tep.js`), copiando `vaso-vivo-placa.js`
- Estado: `'tep-lisis': { n: 'El émbolo y la lisis', s: 'evitar el siguiente', p: { lesion: 'embolo', t: 4, tto: 'heparina', horas: 6, peso: 80 }, grupo: 'arteria', pestana: 'tratar', ficha: 'neumo-ep-manejo' }`.
  `lisisActiva` exige `lesion === 'placa'` y el reloj de 12 h del SCA: el TEP necesita su propia función (`lisisTep(e)`).
- Sin anatomía nueva: el mismo corte de la arteria, **sin placa** (el émbolo es un trombo venoso, rojo, que llega
  migrado). Rótulos fijos: «arteria pulmonar» y «émbolo: viene de la femoral (TVP)», con chip que abre el telar `tvp`.
  Se reutiliza el dibujo de malla de fibrina, hematíes y plasmina de `figuraLisis`, más los puntos IIa de la lupa `cascada`.
- Mando 1, **tratamiento** (3 posiciones): `heparina` → el émbolo **no cambia de tamaño**; los hilos nuevos dejan de
  crecer; rótulo «el émbolo sigue; el siguiente no se forma» (p. 11) · `lisis` sola → plasmina corta la fibrina, salen
  puntos de **trombina** y vuelve a tejerse la red: sello rojo **«trombina liberada: reoclusión»** (p. 9) · `lisis + heparina`
  → se reabre y la trombina queda frenada; rótulo «heparina durante y después de la lisis» (p. 9).
- Mando 2, **reloj desde los síntomas 0-96 h** (96 = ilustrativo): carril «mayor beneficio <48 h» (p. 10). Pasadas 48 h,
  rótulo ámbar «menos beneficio», **no** «sin beneficio» (la ficha no da corte).
- Mando 3, **peso 40-150 kg**: alteplasa estándar **100 mg en 2 h**; si hay «colapso inminente», **0,6 mg/kg en 15 min, máx.
  50 mg** (p. 8, 10). Tope: desde 84 kg la dosis acelerada se queda en 50 y el rótulo dice «máx. 50 mg (p. 8)».
- Chips del paciente (contraindicaciones absolutas, p. 9): sangrado activo · ictus hemorrágico previo · ictus isquémico
  <6 meses · neoplasia del SNC · cirugía, trauma mayor o TCE <3 semanas. Con uno encendido, `lisis` se apaga y sale el
  sello **«Contraindicada: trombectomía mecánica de rescate (p. 10)»**. Al lisar sin chips: sello **«sangrado mayor
  10-12 %; HIC 1-2 %»** (p. 10).
- R4: captura al lado de la **Fig. 22.2** (foto real, PDF p. 10, ya en `js/modules/neumologia/img/neumo-fig22-2-trombectomia-cateter.jpg`):
  cuánto coágulo saca la trombectomía y por qué la lisis ayuda poco (p. 10).
- NO: placa amarilla ni rotura de placa · el reloj de 12 h ni la tenecteplasa del SCA · lisis que deja la arteria limpia
  sin trombina · heparina que encoge el émbolo · lisis por catéter como salida de la contraindicación (la ficha da la
  trombectomía) · dosis de HNF aquí (va en la calculadora de la ficha).
- Juez: `jueces --modelo vaso-vivo` (ampliar `autonomo/pruebas/vaso-vivo.mjs`: 3 tratamientos × reloj 0/47/48/96 h × peso
  40/83/84/150 → 24/49,8/50/50 mg; cada chip → sello), `jueces-topes.mjs` (reloj, peso), auditor (p. 8-11), profesor.

### 6b `tvp` + lupa `eco` · telar vivo, archivo nuevo `js/modules/libros/telar-vivo-tvp.js` (estado, frases, guía y dibujo de la lupa)
- Estado: `tvp: { nombre: 'TVP: eco de compresión', clave: 'eco', e: { vista: 'telar', tvp: true, lupa: 'eco', sonda: 0 } }`,
  añadido a `ESTADOS` desde el archivo nuevo (como el `fuentes.push` de la l. 298). La femoral del telar, con un trombo que
  la ocupa; la lupa cambia el bolsillo de la válvula por un **corte transversal en eco**: vena femoral y arteria al lado.
- Mando **presión de la sonda 0-100 %** (ilustrativo; el libro no da fuerza): sin trombo, la vena se aplasta del todo y la
  arteria no (Fig. 1.7, p. 15 del PDF de acceso vascular); con `tvp`, la vena **no se aplasta ni al 100 %** → sello
  **«no compresible = TVP»** (p. 4). Interruptor **Doppler color**: arteria con flujo pulsátil; vena con flujo lento o
  nulo (p. 4). Compresión + Doppler = dúplex: **S ≥95 %, E ≥97 %, VPP 97 %, VPN 98 %** (p. 4).
- Rótulos: «TVP proximal en el 30-50 % de las EP» · «con TVP: no hacen falta más pruebas, salvo inestabilidad; se
  anticoagula igual que la EP» · «eco negativa: hace falta otra prueba» (p. 4).
- Chip **brazo con catéter** (subclavia o axilar): EP sintomática **<10 %**; eco S 97 %, E 96 %; sello **«anticoagular y
  retirar el catéter»** (p. 4, Tabla 22.2).
- Topes: sonda al 100 % con `tvp` → sello y vena intacta; la arteria nunca colapsa (Fig. 1.7); sin `tvp` la vena colapsa
  antes del 100 %. El reloj, fármacos y riñón del telar siguen como están.
- R4: en el cap. 22 **no hay** figura de eco venosa; la imagen real es la **Fig. 1.7** (yugular y carótida, no la femoral;
  pie que lo diga), ya en la app (`mar-fig1-7-compresion-yugular.jpg`, `cateter-vivo-data.js` l. 169). Idea de la lupa
  `eco-compresion` del catéter vivo; código, solo si se comparte sin tocarlo.
- NO: abrir el ecógrafo ni su anatomía · % de compresión «diagnóstico» inventado · la vena que «casi» se aplasta.
- Juez: `jueces --modelo telar-vivo` (prueba: `tvp` con sonda 0/50/100, Doppler, chip brazo → sellos; sin `tvp`, colapso).

### 3. Estudiar (`js/data/mayeutica/b3b-tep.js`) · criterios clínicos R3, todos del cap. 22
- **Diagnóstico** · Mira: guía del telar `tvp`, y circulación viva `tep` (`eco/escenarios.mjs` l. 143) · Juega: sonda al 100 %
  con y sin trombo; chip brazo · Piensa (orden de la ficha): autopsia 30 % frente a 10 % confirmado (p. 1) → PaO₂ normal en
  el **30 %** (p. 2) → dímero D: **VPP 27 %, VPN 92 %**, elevado en el **80 %** de la UCI (p. 3) → *predice*: vena con trombo al
  apretar (p. 4) → TVP proximal: sin más pruebas si está estable (p. 4) → subsegmentario sin anticoagular: **las 4
  condiciones a la vez** (único, sin trombo en piernas, sin disfunción VD, sin comorbilidad, p. 6) → *destapa* «son dos»:
  signos específicos de la eco (trombos móviles 2-18 %, McConnell 20 %, p. 4, 7) · Examínate MIR: ningún hallazgo de la
  Tabla 22.1 con VPP >50 % (p. 2); angio-TC **VPN 95 %**, evitar con **ClCr <30**, **15 mSv** (p. 5); V/Q (p. 5-6).
- **Manejo** · Mira: vaso `tep-lisis` y cabecera del shock vivo (Consuelo: `tep-intermedio`, `tep-alto`, `tep-bolo`) ·
  Juega: los 3 tratamientos, el chip cirugía, el peso · Piensa: riesgo = **VD + troponina + inestabilidad** (p. 7) →
  clasificador de la ficha → *predice* `tep-bolo` (p. 10-11) → *predice* dobutamina con hipotensión: vasodilata, nunca sola
  (p. 11) → NA (no sube la resistencia pulmonar, p. 11) → heparina tras la lisis: trombina (p. 9) → *destapa* «son dos»:
  lisis contraindicada → trombectomía; si no hay anticoagulación posible → filtro (p. 10, 12) · Examínate: rivaroxabán
  **15/12 h ×3 sem → 20**; apixabán **10/12 h ×7 d → 5/12 h**, sin más sangrado (p. 9); DOAC no con **ClCr ≤30** (p. 9).
- Umbrales exactos: intermedio = disfunción VD (± troponina) **sin** inestabilidad; alto = inestabilidad (p. 7; si la ficha
  no da cifra de PA, **hueco**: el monitor decide `tep-alto` por PAM <65, regla del motor, l. 248) · intermedio: enoxaparina
  **1 mg/kg/12 h**, observar **24-48 h** (p. 9) · alto: HNF por **peso real 80 U/kg + 18 U/kg/h**, PTT **46-70 s** a las **6 h**
  (p. 8-9); **>130 kg o IMC ≥40** → peso ajustado = **IBW + 0,4 × (real − IBW)** (Ec. 22.1, p. 9) · fluidos **≤500 mL** con
  PVC normal, guiados por eco (p. 10-11) · filtro: dos indicaciones (p. 12).
- **C6a · Consuelo, el diagnóstico** (63 a, 142 kg, 1,60 m, día 5 de prótesis de cadera) — 6 pasos: 1 · 10:00, disnea súbita,
  FC 112, PaO₂ 88. *Test*: ¿la PaO₂ normal descarta? (30 %, p. 2) · 2 · Dímero D 2.400. *Test*: ¿qué aporta? (VPP 27 %, 80 % en
  UCI, p. 3) · 3 · *Destapa*: ¿por dónde empiezas sin moverla de la cama? (eco venosa, p. 4) · 4 · Telar `tvp`: femoral no
  compresible, sin flujo. *Test*: ¿angio-TC? (no, si está estable; anticoagular, p. 4) · 5 · **Giro**: brazo derecho hinchado,
  vía subclavia del día 1: TVP subclavia. *Test*: ¿y el catéter? (retirarlo y anticoagular; EP por brazo <10 %, el émbolo
  viene de la pierna, p. 4) · 6 · *Error* (2): «Dímero D 2.400: EP confirmada ✗ · femoral no compresible y estable: sin
  angio-TC ✓ · dejar la subclavia, ya anticoagulamos ✗ · eco negativa no habría descartado ✓». Lo que te llevas: la eco
  junto a la cama decide; el dímero D en la UCI, no.
- **C6b · Consuelo, el manejo** (mismo día) — 7 pasos: 1 · 14:00, VD dilatado, troponina alta; cabecera `tep-intermedio`
  (PA, FC, PAM, PVC: **las mide el constructor** con `g4-app-cifras.mjs` o copia suya para Consuelo; se espera PAM ≥65).
  *Test*: anticoagulante (enoxaparina 1 mg/kg/12 h, 24-48 h; la dosis en obesidad no la da la ficha: **hueco**) · 2 ·
  *Predice*: dobutamina con PA normal y si cae (p. 11) · 3 · **Giro**, 20:00: cabecera `tep-alto` (se espera PAM <65; cifras del
  monitor). *Test*: ¿lisis? (no: cirugía <3 semanas, contraindicación absoluta → trombectomía, p. 9-10); vaso `tep-lisis` con
  el chip cirugía → sello · 4 · Calcula con la Ec. 22.1 de la ficha: IBW 52 (del caso) → **88 kg** → bolo **7.040 U**,
  **1.584 U/h**, PTT 46-70 a las 6 h (p. 8-9) · 5 · *Predice* `tep-bolo`: 500 mL, ¿sube el gasto? (no; cifras del monitor
  frente a `tep-alto`, p. 10-11) · 6 · *Destapa*: «6 h de heparina y el émbolo sigue en la eco: ¿falla?» (no disuelve, evita el
  siguiente, p. 11) · 7 · *Error* (2): «tPA 100 mg en 2 h ✗ · PTT 46-70 s ✓ · filtro de cava ya, por si acaso ✗ · NA para la
  hipotensión ✓» (p. 9-12). Lo que te llevas: la cirugía reciente prohíbe la lisis; la heparina no deshace, protege.

### 4. Lo que ningún juez mide
- Que se lea a la primera que el émbolo **viene** de la pierna (sin placa): si parece un SCA, el modelo enseña lo contrario.
- Que con `heparina` el residente note que el émbolo **no encoge** y lo entienda como éxito, no como fallo.
- Que las cifras de PA de los casos sean las del monitor de Consuelo y no las de la cobertura (118/70, 78/50) si difieren.
- Que la lupa de eco se parezca a la Fig. 1.7 real (vena oval que desaparece, arteria redonda que late).
