# EchoSuite (echosuite.app): 2.ª pasada, solo lo que faltaba
Investigado el 25/10/2026 con Playwright 390×844 (un script por pregunta; su JS no se guardó). Previo:
`autonomo/ideas/ingenieria-inversa/echosuite.md` (qué es, motor, licencias, 10 ideas). Aquí: vigía, calculadoras de UCI,
pares de prueba, flujo en móvil, comparación e ideas. Captura: `echosuite-rap.jpg` (PAD por VCI con «presión positiva»).
`echosuite.app` no resuelve desde Node/WebFetch (ENOTFOUND): solo desde el navegador del entorno.

## 0. Vigía (frente al 23/10)
El informe previo no anotó nombres de archivo; hoy quedan fijados para la próxima visita. Pesos (bytes, visto):
- **Calculadoras** (`/calculators/`): main-D5MF70bI.js 91 204 · engine-BRaL8kY0.js 80 886 · **catalogue-bW-Wf1PA.js
  301 648** (el catálogo de las 70) · **diastology-ChWIx2hr.js 227 630** · presentation-uLiy704T.js 39 792 ·
  calculators-OK6gSIbp.js 13 196 · usage-analytics-54920cb5.js 11 988 · measurement-colors-DMyUPKRG.js 6 361 ·
  figure-playback-D35R-9nD.js 4 344 · site-info 4 408 · register-cache 1 619 · browser-theme 209 · CSS 51 210 + 6 429.
- **Probe Lab** (`/`): lab-Dv7HxBlq.js, cine-Mt--GqrJ.js, cine-resources, three-CdB6aHrF.js, anatomy-wire-BOKI2SsJ.js,
  main-DSPuDhWP.js; datos `sim/labels.json`, `poses.json?__v=51303e5db373ca50cb9a`, `anatomy.json?__v=8c13b580365cbe36c343`,
  `media/labels.json`, `media/catalog.json?__v=c5c6af69801d11366b3f` (versión por hash de contenido).
- **Qué cambió**: no se puede decir con rigor (sin lista previa de hashes). Sigue siendo 70 calculadoras y 15 vistas, con
  PostHog (bloqueado aquí: `us-assets.i.posthog.com` falló) y service worker (`register-cache`). La navegación de
  calculadoras es **por hash** (`/calculators/#rap`), sin recarga. **Ojo**: `/calculators` da 307 → `/calculators/`.
- **Lo que sí vimos nuevo (comparado con el texto del 23/10)**: las calculadoras se agrupan en 11 pestañas
  (Atria, RV, LV, Aórtica, Mitral, Tricúspide, Pulmonar, Diastología, Pericardio, Física, Shunts); cada una con selector de
  método (p. ej. PAD: «Estimación por VCI / Colapso medido / Suprahepática S/D»; función VD: TAPSE, S′, FAC, strain,
  FEVD 3D, TAPSE/PASP). **No hay VExUS, ni vena porta, ni ventilación mecánica más allá de un conmutador en la PAD,
  ni IVC colapsabilidad en %**: no es una web de UCI.

## 1. Qué usaría un intensivista (de las 70) y su flujo en el móvil
Medidas en cm/s, mm, mmHg, m/s, cm (visto). Entrada: campos de texto con teclado numérico; resultado **en vivo** (sin
botón «calcular»): aparece al completar los campos y dice «Add X to calculate» si falta algo. Cada campo lleva «?» (cómo se
mide). 3-5 campos por calculadora ≈ **20-40 s** si ya tienes las medidas. Orden de pantalla: método → medidas → (fórmula
y fuente) → RESULTADO → interpretación → «How it works». El resultado queda **debajo**: en 390 px hay que bajar (defecto).
| Situación UCI | Calculadora EchoSuite (hash) | Campos y unidades |
|---|---|---|
| Shock / volumen: PAD | `#rap` | VCI (cm), colapso (≥50 / <50 %), ventilación (espontánea / presión positiva) |
| GC / bajo gasto | `#lvot-flow` | diámetro TSVI (cm), ITV TSVI (cm), FC y SC (opcionales) |
| Edema / presiones de llenado | `#lap-ee` | E (cm/s), e′ septal, e′ lateral (cm/s), TR Vmax (m/s), PASP |
| HTP / TEP / VD | `#rvsp` · `#rv-function-calc` | TR Vmax (m/s), PAD (mmHg), gradiente RVOT · TAPSE (mm) y PASP |
| Derrame | `#effusion-size` | separación máxima telediastólica (mm) |
| Función global | `#lv-ef`, `#fractional-shortening` | VTD/VTS (mL), sexo · LVIDd/LVIDs (**mm**) |
| Constricción | `#hepatic-expiratory-reversal` | pico D inverso y D anterógrado (cm/s) |
Gaps para UCI (no vistos en las 70): VExUS, índice de colapsabilidad %, distensibilidad VCI en VM, VTI con variación
(existe «LVOT VTI variation»: respuesta a volumen, **visto en lista, no probado**), FEVI por Simpson monoplano, GC con PAM.

## 2. Pares de prueba (entrada → salida en su pantalla, 25/10/2026)
**PAD por VCI** (`#rap`; lo rotula «ASE 2025»): VCI 1,5 cm + colapso ≥50 % + espontánea → **3 mmHg (0-5)**, «normal» ·
VCI 1,5 + <50 % → **8 (5-10)**, discordante · VCI 2,5 + ≥50 % → **8 (5-10)** · VCI 2,5 + <50 % → **15 (10-20)** ·
VCI 2,5 + <50 % + **presión positiva** → «**—**: no asignar por colapso solo» (usa evidencia secundaria). Regla impresa:
≤2,1 cm y ≥50 % → 3; >2,1 y <50 % → 15; discordante → 8; 20 solo si >2,5 + venoso marcado.
**VS/GC por TSVI** (`#lvot-flow`; πr²·ITV): d 2,0 + ITV 18 + FC 70 + SC 1,8 → VS **56,55 mL**, IVS 31,42, GC **3,96 L/min**,
IC 2,2 · d 2,2 + ITV 12 + FC 100 + SC 1,7 → VS 45,62, IVS 26,83, GC 4,56, IC 2,68 · d 2,0 + ITV 25 + FC 60 + SC 1,9 → VS
78,54, IVS 41,34, GC 4,71, IC 2,48 · d 1,8 + ITV 10 + FC 110 + SC 1,6 → VS 25,45, IVS 15,9, GC 2,8, IC 1,75. **No da grado**
(solo números y fórmula con tus datos).
**E/e′** (`#lap-ee`, ruta ASE 2025): E 60, e′ s 8, e′ l 10, TR 2,2, PASP 25 → E/e′ medio **6,7** (sept 7,5, lat 6,0), «**PAI
normal · función diastólica normal**» · E 90, 5, 7, 3,0, 40 → **15,0** (18,0 / 12,9), «**PAI elevada · grado sin asignar**»
(pide E/A) · E 100, 4, 6, 3,4, 55 → **20,0** (25,0 / 16,7), igual «PAI elevada» · E 70, 7, 9, 2,8, sin PASP → **8,8**, «siguiente
paso: deformación AI». Umbral que imprime: e′ reducido si septal ≤6, lateral ≤7 o media ≤6,5.
**PASP/RVSP** (`#rvsp`; 4v²+PAD, RVOT=0): TR 2,5 + PAD 3 → PSVD **28 mmHg** («dentro del rango») · 3,5 + 10 → **59** («en o por
encima del rango anormal»; gradiente 49) · 4,0 + 15 → **79** (gradiente 64) · 3,0 + 8 → **44** (36). Sin gradiente RVOT
declarado dice «evaluación incompleta». **TAPSE** (`#rv-function-calc`): 10 mm → «reducción grave» · 15 y 17 → «leve» ·
20 y 25 → «normal». **TAPSE/PASP**: 16/48 → **0,33 mm/mmHg** · 22/30 → 0,73 · 12/60 → 0,2 (**sin grado**, «sustituto del
acoplamiento»); con adquisición «poco fiable» → «**Retenido**».
**Derrame** (`#effusion-size`, ESC 2025): 3 y 8 mm → pequeño (<10) · 15 → moderado (10-20) · 25 → grande (>20); avisa de que
no es gravedad hemodinámica. **FS** (mm): 50/32 → **36 %** · 65/55 → 15,4 % · 45/25 → 44,4 % (dice que no es FEVI).
**FEVI** (`#lv-ef`, hombre): 120/60 → **50 %** («por debajo de 52-72 %») · 150/100 → 33,3 % · 100/30 → 70 % («dentro»);
sin elegir sexo: «interpretación pendiente». **Reverso hepático** (`#hepatic-expiratory-reversal`): 20/50 → 0,400 · 10/60 →
0,167 · 30/40 → 0,750: todos «**no alcanza ≥0,80**».

## 3. Frente a nosotros (Manual UMI, `manual-umi.js`)
- **`calcVciColapso`** (visto en código): índice de colapso (Dmax−Dmin)/Dmax (40 %) en espontánea, o distensibilidad en VM
  con Dmin (18 %) / media (12 %); **responde a volumen sí/no**. EchoSuite hace otra cosa: estima la **PAD** y rehúsa en VM.
  Se complementan: nosotros no damos PAD; ellos no dan respuesta a volumen.
- **`calcFsFevi`**: FEVI ≈ 2×FS con avisos «no fisiológica»; ellos separan FS (no es FEVI) y FEVI por volúmenes con rango
  por sexo (ASE 2015). Nuestra «FEVI ≈ 2×FS» es una regla rápida; conviene decirlo como aproximación y enlazar a la fuente.
- **`calcHemodinamica`**: PAS/PAD/PVC/GC/SC/Hb/Sat (Marino); EchoSuite no la tiene (es ecocardio, no catéter).
- Ganamos: español, UCI, quiz, Mayéutica, Doppler que calcula **ITV del TSVI y GC desde el motor** (README eco, 21,9 cm,
  GC 4,8 vs 5,2), VCI y suprahepáticas (VExUS) en el simulador. Ganan: formato común y **fórmula con tus números**, ayuda
  «?» por campo, interpretación con límites («no es diagnóstico»), **rechazo cuando falta calidad** (retenido), redondeo
  coherente con el grado, fuente con página y estado de revisión.
- Lo que no hacen: ningún enlace de la calculadora al simulador de **tu** paciente; nosotros podemos.

## 4. Ideas para el megaproyecto (EchoSuite + nuestro motor)
1. **«Cama»: calculadora de eco de UCI en una pantalla** (PAD→PSVD→TAPSE/PASP; VS→GC→IC; E/e′→PAI), arrastrando el
   resultado de una al campo de la siguiente (PAD alimenta la PSVD). Guardia: shock indiferenciado / disnea a las 3 h.
   Cama: 30-40 s con las medidas del eco; estudio: ves la cadena. Esfuerzo medio. Necesita: PDF ASE 2025 corazón derecho,
   ASE 2025 diastólica, ASE 2015 cámaras (los pide `echosuite.md` §4.6) y decidir cajón dentro de Eco o puerta nueva.
2. **Fórmula con tus números y redondeo seguro** como pieza de `core/ui.js` para todas las calculadoras. Cama: detecta
   unidades mal puestas (mm frente a cm: en su FS, 5,0 en un campo en mm no dio resultado). Pequeño. Nada.
3. **PAD y respuesta a volumen juntas** en un solo asistente («VCI → ¿PAD? → ¿respondedor?») con «en VM no uses colapso
   solo» (ellos rehúsan; nosotros damos el % de distensibilidad). Guardia: hipotensión en VM. Pequeño-medio. Necesita la
   fuente de los umbrales 12/18/40 % con página (Manual UMI) y la ASE 2025 de PAD.
4. **«Mi paciente en la eco»**: las medidas tecleadas ajustan el motor y el simulador late con ellas (VS, FC, PAD, PSVD).
   Estudio y razonamiento («¿por qué la VCI?»). Grande. Decisión: sigue «la imagen no calcula» (§5) si el motor lee la
   calculadora, no al revés. Es el norte nivel 2 del Radar.
5. **Veredicto integrado de shock**: VS + VCI + FEVI + E/e′ + PSVD → «hipovolémico / obstructivo / cardiogénico / distributivo
   probable» con «combinación incoherente» y «retenido por calidad». Guardia: shock. Medio-grande. Necesita guías de
   shock con página; no sale de EchoSuite (ellos no integran shock).
6. **Ayuda «¿cómo se mide?» por campo con salto a la vista del simulador** (`data-eco-vista` ya existe). Estudio y cama.
   Medio. Necesita: FATE, Manual UMI, *The Heart by Ultrasound*.
7. **VExUS como calculadora** (porta, suprahepática, renal: grado 0-3): lo que EchoSuite no tiene y nuestro Doppler ya
   simula. Guardia: sobrecarga de volumen / FRA cardiorrenal. Medio. Necesita el paper de VExUS con página.
8. **Estado de revisión visible por calculadora** («cifras comprobadas con su PDF / pendiente»). Pequeño. Decisión.

## 5. Lo que no traería
Su código, textos, figuras y cines; sus 70 en bloque (congénitas, prótesis, física); Vite/three.js; PostHog; el inglés sin PDF.
## 6. No visto
Dictado por voz; «LVOT VTI variation» y las 12 rutas diastólicas a fondo; qué significa el aviso de VM en `#rap` más allá
de la rama «presión positiva»; Probe Lab en esta pasada (solo piezas, no interacción).
