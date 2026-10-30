# Plan corto · b3-paso4 · grupo 5 (3B · SCA y disección) — profesor, 30/10/2026

Fuente comprobada: `docs/marino-2024-cardiac-disorders-caps18-21.pdf`, cap. 20 = **PDF 38-52** (38 patogenia · 39 MPO y
Fig. 20.1 · 40 síndromes, clínica, ECG · 41 hs-cTn y Tabla 20.1 · 42 estrategias y puerta-balón · 43 Fig. 20.2, SCASEST,
lisis 12 h · 44 plasmina, Fig. 20.3, Tabla 20.2 · 45 tenecteplasa, sangrado, O₂ · 45-46 Tabla 20.3 · 46-47 betabloqueo ·
47-48 Tabla 20.4 y P2Y12 · 49 heparina · 50 disección · 51 Fig. 20.4 TC real y Tabla 20.5 · 52 nicardipino, PAS 120/90,
dolor, +1-2 %/h). Las páginas son del PDF.

## 0. Dónde va cada pieza

**5a + 5b + 5c van sobre el vaso vivo** (`js/modules/libros/vaso-vivo-escena.js`, `js/data/vaso-vivo-data.js`), no son un
modelo nuevo: ya tiene el corte del vaso, las lupas `herida` (4 tiempos con `play`), `plaqueta` (IIb/IIIa, colágeno, FvW),
`cascada` (fibrina, trombina) y un «trombo arterial» (escena l. 274). La Fig. 20.1 es la `herida` en una arteria. Se añade
el grupo de chips `arteria` («La arteria que se tapa: SCA»), una lesión nueva `placa` y tres estados; el ECG se delega al
`ritmo-vivo` `stemi` por enlace. Un solo mando nuevo compartido: el **reloj «horas desde el dolor» (0-24 h)**, para la
troponina (5a) y la lisis (5c). Anatomía coronaria, angiografía y territorios ↔ derivaciones **no** se dibujan (son de
`mv-arteria-culpable`). **5d** va al shock vivo (`js/data/shock-vivo-data.js`, `ESTADOS` + `PACIENTES`), copiando el patrón
de `ajuste.na`/`ajuste.vaso` y el estado `tapon`; si el motor no tiene un mando de betabloqueo, para e informa (§1.11):
no se simula bajando la volemia.

### 5a `placa` · vaso vivo, `ESTADOS.placa` (`p: { lesion: 'placa', t: 1 }`, `play` como `herida`), lupa `placa`, grupo `arteria`, `ficha: 'mc-sca-diagnostico'`
- Enseña: los 4 tiempos de la Fig. 20.1: placa en una **bifurcación** (p. 38) → rotura por inflamación: neutrófilo con
  **MPO → hipoclorito, «la lejía»**, oxida las lipoproteínas (p. 39) → salen **lípidos trombogénicos** que activan
  plaquetas y factores (p. 39) → trombo **oclusivo** (p. 40). Selector de oclusión con 3 posiciones, no %: `intermitente`
  (AI, on-off) · `parcial` (NSTEMI) · `completa` (STEMI, transmural) (p. 40); chip ECG que abre `ritmo-vivo` `stemi` en la
  completa. Reloj: la hs-cTn **se detecta desde 3 h**; a 1 h de la 1.ª, **cambio >10 %** = isquemia aguda (p. 41).
- Topes: reloj 0-24 h (ficha: 3 h, 12 h; el resto `ilustrativo`): a ≥3 h en `parcial`/`completa` aparece «>p99»; a 12 h
  el sello «lisis sin beneficio» (p. 43). Oclusión sin % (la ficha no lo da: **hueco**); `completa` cambia el rótulo a
  «ST elevado» y apaga la NTG como prueba («aliviar con NTG no prueba nada», p. 40).
- NO: un % de estenosis inventado · coronarias, derivaciones o angiografía · la MPO como tratamiento · sepsis/IC «dando el
  cambio >10 %» (la ficha dice que no, p. 41).
- Juez: `jueces --modelo vaso-vivo` (ampliar `autonomo/pruebas/vaso-vivo.mjs`: 3 posiciones × reloj 0/3/12/24 h, sello y
  rótulo), `jueces-topes.mjs` (reloj), auditor (p. 38-41), profesor con la captura junto a la Fig. 20.1 (R4).

### 5b `placa-antiagregantes` · lupa `plaqueta` ampliada (`p: { lesion: 'placa', t: 3, antiag: [...] }`), `ficha: 'mc-sca-tratamiento'`
- Enseña: tres interruptores sobre la plaqueta: **aspirina** → tromboxano (irreversible; **1 vida por 42**, 162-325 mg
  masticada, no tragar; rectal si no puede, p. 47) · **P2Y12** → receptor del ADP (clopidogrel 300-600/75; ticagrelor
  180/90 × 2; prasugrel 60/10, p. 47) · **IIb/IIIa** → puentes de fibrinógeno (eptifibatida 180 µg/kg máx 22,6 mg +
  2 µg/kg/min máx 15 mg/h, 2.º bolo a 10 min; tirofibán 25 µg/kg + 0,15, p. 47-48). Con los tres, el trombo del tiempo 3
  **deja de crecer**; nunca «desaparece» (p. 47).
- Topes: chips del paciente con sello «Contraindicado»: **HIC previa → ticagrelor** · **ictus/AIT reciente → prasugrel**
  (p. 48) · alergia a aspirina → clopidogrel (p. 47) · ClCr <50 → eptifibatida −50 %; ClCr <30 → tirofibán −50 %
  (p. 47-48) · morfina → chip «resta efecto a los P2Y12, significado incierto» (p. 46). Un solo P2Y12 a la vez; IIb/IIIa
  solo con ICP urgente (p. 48).
- NO: dos P2Y12 · trombo que se disuelve con antiagregantes · cangrelor (p. 48).
- Juez: prueba del modelo (3 interruptores × 4 chips = sellos), auditor (Tabla 20.4), profesor.

### 5c `trombolisis` · lupa `cascada` ampliada: plasminógeno unido a la fibrina → plasmina, que corta la fibrina (p. 44), `p: { lesion: 'placa', t: 4, lisis: 'tnk' }`
- Enseña: **reloj** (compartido) y **peso 40-120 kg** → tenecteplasa por tramos **30/35/40/45/50 mg** (<60, 60-69,
  70-79, 80-89, ≥90; p. 45); permeabilidad a 90 min **85 %** (73-84 alteplasa, 84 reteplasa, p. 44); la curva de la
  **Fig. 20.3** viva (cifras leídas del gráfico de la p. 44; las coteja el auditor). Fibrinógeno que baja al lisar
  (cifra `ilustrativo`).
- Topes: reloj **>12 h → lisis apagada, sello «sin beneficio»** (p. 43). `parcial` (NSTEMI) → lisis apagada, sello «sin
  beneficio en el NSTEMI; ICP urgente si inestable, si no 24-72 h» (p. 43). Dosis: solo los 5 tramos. Al lisar: sello
  **«sangrado: 10 %; grave 1 %»**; fibrinógeno **<100 mg/dL → crio o concentrado**, **ácido tranexámico desaconsejado**
  (p. 45). HNF al lado: **60 U/kg bolo, máx 4.000 + 12 U/kg/h, máx 1.000**, aPTT 1,5-2 (p. 49), con la nota de la errata
  «60 Units» que ya tiene la ficha.
- NO: TXA como opción · lisis igual a la ICP (es «menos eficaz», p. 43) · contraindicaciones de la lisis inventadas
  (cap. 47; si `docs/` no lo tiene, **hueco** con enlace a la ficha del TEP) · la HNF del TEP (80 + 18).
- Juez: prueba del modelo (peso 40/59/60/89/90/120 → 30/30/35/45/50/50 mg; reloj 11/12/13 h; `parcial`), `jueces-topes`,
  auditor (Fig. 20.3 y Tabla 20.2), profesor.

### 5d cabecera `diseccion` · shock vivo: `PACIENTES` «Joaquín a las 08:25» (`k: 'joaquin-0'`, `tipo: 'diseccion'`, 56 a, 84 kg; el mismo Joaquín de C4 y de `tapon`, una hora antes) · `ESTADOS.diseccion`, fármacos **esmolol · labetalol · metoprolol · nicardipino · nitroprusiato · opioide** (Tabla 20.5, p. 51-52)
- Enseña: base PA **168/90**, FC 96, IC 3,2, sin shock (fisiología general; la ficha solo da «HTA en el 50 %», p. 50).
  **Nicardipino 10 mg/h solo**: PAS ~142, **FC sube** (barorreflejo), IC sube → sello rojo **«cizalla ↑: la bajada de PA
  no puede ir con taquicardia ni más gasto»** (p. 52). **Esmolol 45 mg bolo + 100 µg/kg/min**: PAS ~150, **FC ~64**,
  IC ~2,6. **Esmolol + nicardipino 7,5 mg/h**: PAS **118-122**, FC ~62 → sello verde «objetivo» (p. 52). Opioide: FC y
  PA bajan algo (p. 52; cuánto: fisiología general, rotulado). Las cifras exactas, las del motor (rotuladas «modelo»).
- Topes: esmolol **500 µg/kg bolo, 50 → +25 µg/kg/min con bolo antes de cada subida, máx 200** (p. 51): al máximo, mando
  apagado; FC <50 o PAS <90 → sello «bradicardia/hipotensión» (p. 46-47). Nicardipino **5 → +2,5 cada 5 min, máx 15 mg/h**
  (p. 52); **solo** → sello cizalla (p. 52). Labetalol 20 mg + 20-40/10 min o 1-2 mg/min, **máx 300 mg** (p. 52):
  monoterapia válida. Nitroprusiato 0,2 → 2-5 µg/kg/min, **aviso >3** (cianuro), tope 5, **apagado si isquemia coronaria**
  o fallo hepático/renal (p. 52). **PAS <90 → sello «por debajo de lo tolerado»** (p. 52). Reloj: mortalidad **+1-2 %/h**
  sin cirugía, ~60 % sin cirugía, hasta 10 % con reparación (p. 50, 52).
- NO: aorta disecada dibujada (es cabecera, no anatomía) · objetivo PAS 140 o FC 60 (ESC, no Marino: **hueco**) ·
  nitroprusiato por defecto · esmolol en IC aguda sin sello (p. 51) · tipo B.
- Juez: `autonomo/pruebas/shock-vivo.mjs` + `autonomo/bloques/b3/herramientas/g5-cifras.mjs` (imprime las 4 recetas),
  `jueces-topes`, auditor (Tabla 20.5), profesor (que la FC suba con el nicardipino solo y que el sello salga).

## 1. Ruta del Estudiar (`js/data/mayeutica/b3b-sca.js`; si pasa de 700 líneas, `-sca` y `-diseccion`)
Claves citables: `vasoVivo: 'placa' | 'placa-antiagregantes' | 'trombolisis'`, `ritmoVivo: 'stemi'`,
`shockVivo: 'diseccion' | 'tapon'`. Ids de la ficha: cobertura §3 (filas 19-21).

**Ficha 19 `mc-sca-diagnostico`** · Mira: Fig. 20.1 real (`#fig-20-1`) + chips «1980 · 80 % dolor · >15 min · ECG <10 min».
Juega: `placa` (play 4 tiempos; selector; reloj 0 → 3 h). Piensa: g1 qué rompe la placa y dónde (inflamación;
bifurcaciones, p. 38) → g2 predice (`placa`, play): qué sale y qué activa (p. 39) → g3 MPO y la lejía (p. 39) → g4 predice
(selector): tres oclusiones, tres síndromes (p. 40) → g5 por qué la NTG no prueba (espasmo esofágico, p. 40) → g6 predice
(reloj): a qué hora se fía de la troponina y qué cambio (3 h; >10 %, p. 41) → g7 destapa «son dos»: bloqueo de rama o
marcapasos con sospecha → como STEMI (p. 40). Examínate: e1 Tabla 20.1 mujer 1,7 mm en V2-V3 (sí: ≥1,5; trampa 2 mm) ·
e2 posterior: descenso V1-V3 con T positiva (p. 41) · e3 sepsis con hs-cTn alta estable 1 h (no isquemia, p. 41) · e4 dolor
punzante, localizado, inspiratorio (improbable, p. 40) · e5 `ritmo-vivo` `stemi`. Caso: **A**.

**Ficha 20 `mc-sca-tratamiento`** · Mira: Fig. 20.2 (`#fig-20-2`) recreada con «>120 min, mortalidad ↑»; Tablas 20.2 y
20.4 en `.data-table`. Juega: `trombolisis` (peso y reloj), `placa-antiagregantes`. Piensa: g1 predice (Fig. 20.2): desde
qué retraso (120; AHA 90, p. 42) → g2 sin ICP y traslado >120 → lisis <30 min (p. 42) → g3 predice (`trombolisis`,
reloj): cuándo deja de ayudar (12 h, p. 43) → g4 qué hace la plasmina y por qué sangra con el fibrinógeno bajo (p. 44-45)
→ g5 predice (`placa-antiagregantes`): qué bloquea cada uno (p. 47-48) → g6 betabloqueo: PAS <120, IC aguda, cocaína
(p. 46-47) → g7 destapa «una idea»: si fuera falta de O₂, ¿por qué no lo da el shock? (`#oferta-demanda`, p. 52).
Examínate: e1 lisis en NSTEMI sin ICP (no, p. 43) · e2 tenecteplasa 92 kg (50 mg, p. 45) · e3 O₂ con SaO₂ 93 % (no,
p. 45) · e4 sangrado tras lisis: crio sí, TXA no (p. 45) · e5 HNF 70 kg: 4.000 (tope) + 840 U/h (p. 49) · e6 enoxaparina
78 años: sin bolo (p. 49) · e7 ticagrelor con HIC previa (p. 48). Caso: **A**.

**Ficha 21 `mc-diseccion-aortica`** · Mira: Fig. 20.4 TC real (`#fig-20-4`) + chips «1 de 3 se pierde · 60 % sin cirugía
· +1-2 %/h · 5 % sin dolor». Juega: `diseccion` (nicardipino solo → esmolol primero → los dos), `tapon` (Joaquín una
hora después). Piensa: g1 por qué un SCA puede ser una disección (retrógrada: IAo, coronaria, taponamiento, p. 50) → g2
predice (nicardipino solo): qué hace la FC (p. 52) → g3 por qué la cizalla empeora (p. 52) → g4 el dolor que cede es una
trampa (p. 50) → g5 predice (esmolol): PAS objetivo y hasta dónde se tolera (120; 90, p. 52) → g6 destapa «son dos»:
opioides pronto (p. 52) y Rx y ECG normales no descartan (20 %, 30 %, p. 50). Examínate: e1 pulsos desiguales solo 15 %
(p. 50) · e2 imagen: RM 98/98, TC 94/87, ETE 98/77 (p. 50-51) · e3 labetalol solo sí, nicardipino solo no (p. 52) · e4
nitroprusiato >3 µg/kg/min (p. 52) · e5 esmolol 80 kg: bolo 40 mg, 4 mg/min (p. 51). Caso: **B**.

## 2. Criterios clínicos (R3; página del PDF)
ECG en **<10 min** (p. 40) · STEMI: J ≥1,5 mm (mujer) / ≥2,0 (varón) en V2-V3 o ≥1 mm en otras, **≥2 contiguas**;
posterior: descenso V1-V3 con T positiva; SCASEST: J ≥0,5 mm V2-V3 o ≥1 mm otras; T invertida >1 mm en ≥5 (p. 41) ·
hs-cTn **al llegar y a 1 h**; necrosis si >p99 y ≥3 h; isquemia aguda si cambio **>10 %** (p. 41) · ICP puerta-balón
**90-120 min**; traslado si total ≤120; si no → lisis **puerta-aguja <30 min** (p. 42) · NSTEMI inestable → ICP urgente;
si no, **24-72 h**; lisis sin beneficio (p. 43) · lisis **no si >12 h** (p. 43) · sangrado 10 %, grave 1 %; fibrinógeno
**<100 mg/dL → crio**; TXA desaconsejado (p. 45) · O₂ **solo SaO₂ <90 %** (p. 45) · NTG 0,4 mg sl × 3 cada 5 min;
perfusión 5 µg/min; no en IAM de VD, EAo grave, IPDE5 24-48 h (p. 45-46; el texto dice «Tabla 20.2» para la perfusión y
está en la 20.3: errata de fidelidad) · betabloqueo: no en IC aguda, **PAS <120 → más shock**, cocaína, bradicardia,
hipotensión, BAV (p. 46-47) · HNF 60 U/kg (máx 4.000) + 12 U/kg/h (máx 1.000), aPTT 1,5-2, 24-48 h; enoxaparina 30 mg IV
+ 1 mg/kg/12 h, sin bolo >75 a, −50 % si ClCr <30; TIH: bivalirudina 0,75 + 1,75 (1 si ClCr <30) para ICP, fondaparinux
2,5 para lisis, no si ClCr <30 (p. 49) · Disección: **PAS 120, 90 tolerado**; bajada **sin taquicardia ni más GC**;
vasodilatador **solo con betabloqueo**; esmolol de elección; opioides pronto (p. 52); Tabla 20.5 (p. 51-52) · +1-2 %/h,
60 % sin cirugía, 10 % con ella (p. 50, 52).

## 3. Casos (pacientes nuevos; comprobado con grep)
**Caso A · «El milímetro y medio» — Sagrario, 72 a, mujer, 64 kg, diabética; hospital sin ICP** (fichas 19-20) · 1 ·
06:10, dolor opresivo 70 min; ECG a los 6 min: ST +1,7 mm V2-V3. ¿STEMI? (sí: ≥1,5 en mujer; trampa 2 mm, p. 41) · 2 ·
traslado 150 min: ¿qué y en cuánto? (lisis, <30 min, p. 42) · 3 · con `trombolisis`: 64 kg → **35 mg** (p. 45); HNF
3.840 U + 768 U/h (p. 49); aspirina 162-325 masticada + clopidogrel 300-600 (p. 47) · 4 · **Encuentra el error** (2):
«Tenecteplasa 50 mg ✗ · esperar a la ICP sin lisis ✗ · aspirina masticada ✓ · O₂ solo si SaO₂ <90 % ✓» · 5 · 08:30, PA
104/62, FC 88: ¿metoprolol IV ya? (no: PAS <120, p. 47) · 6 · **Giro**, 09:40: gingivorragia, hematoma; Hb 10,1,
**fibrinógeno 84 mg/dL**: crio o concentrado; **no TXA** (p. 45) · 7 · *Destapa* «son dos»: por qué sangra «lejos»
(fibrinógeno consumido, p. 44-45) y en qué SCA no la habrías puesto (NSTEMI, p. 43). Te llevas: «En la mujer, 1,5 mm en
V2-V3 ya es STEMI; sin ICP en 120 min, aguja en 30; la dosis va por peso; si sangra, fibrinógeno, no tranexámico.»

**Caso B · «El dolor que se calla» — Anselmo, 61 a, varón, 90 kg, hipertenso mal controlado** (ficha 21) · 1 · 22:05:
dolor desgarrador 50 min; PA 186/104 (dcho) y 180/100 (izdo), FC 98; ECG: descenso ST 1 mm II-III-aVF. ¿Heparina y P2Y12
ya? (no: antes descartar disección; ECG isquémico en el 15 %, p. 50) · 2 · Rx normal: ¿descarta? (no: normal hasta el
20 %; pulsos iguales en el 85 %, p. 50) · 3 · TC: flap en la ascendente (tipo A; 94/87; RM 98/98, p. 50-51) · 4 ·
**Encuentra el error** (2) en la cabecera `diseccion`: «Nicardipino 5 mg/h solo ✗ · objetivo PAS 140 ✗ · morfina IV ya ✓
· avisar a cirugía cardíaca ✓» (p. 51-52) · 5 · calcula: esmolol bolo 500 µg/kg = **45 mg**, 50 µg/kg/min = **4,5
mg/min**, subidas de 25 con bolo previo, máx 200 (p. 51); añade nicardipino → PAS 120 (p. 52; cifras del monitor) · 6 ·
**Giro**, 01:00: el dolor cede; el R1 escribe «mejoría»: puede ceder horas-días; su vuelta anuncia rotura; 1 de 3 se
pierde (p. 50) · 7 · 03:10: dolor de nuevo, PA 92/58, FC 118, soplo diastólico, PVC 16. *Destapa* «son tres»: IAo,
coronaria, taponamiento → `tapon` (p. 50); +1-2 %/h; 60 % sin cirugía; 10 % con ella (p. 50, 52). Te llevas: «Nunca un
vasodilatador solo; primero el freno (esmolol), PAS 120; el dolor que se calla no cura, avisa.»

## 4. Huecos (se anotan, no se rellenan)
% de oclusión de cada síndrome · troponina en la angina inestable · contraindicaciones de la lisis (cap. 47; ¿en `docs/`?)
· cifras de la Fig. 20.3 (del gráfico, auditor) · magnitud de la taquicardia refleja con nicardipino y objetivo de FC en
la disección (ESC 2014: 60, no citable aquí) · dosis del opioide en la disección (la morfina de la Tabla 20.3 es del SCA:
nota) · PA basal de Joaquín/Anselmo (fisiología general, rotulado).

## 5. Riesgos que no mide ningún juez
Esmolol simulado «bajando la volemia» o con FC fija: `g5-cifras.mjs` imprime las 4 recetas y la FC sube sola con
nicardipino solo y baja con esmolol **antes** de aceptar. Un solo reloj para 5a/5c (el constructor lo pega en su
entrega). Que `placa` no dibuje coronarias ni derivaciones (pisa `mv-arteria-culpable`): lo mira el director en la
captura R4. Si al 25 % el motor no tiene mando de betabloqueo, parar y comparecer.
