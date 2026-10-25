# AngioView · 2.ª pasada · 25/10/2026

Método: Playwright 390×844 (GPU de software), un script por pregunta, lectura en memoria. No se ha guardado nada suyo
(solo 2 capturas del propio simulador, JPEG 440 px, en esta carpeta). Lo previo: `autonomo/ideas/ingenieria-inversa/angioview.md`
(23/10). Aquí solo lo que faltaba: **pares de prueba** y cómo se usaría en la guardia. Etiquetas: visto / deducido / no visto.

## 1. Vigía (¿qué cambió desde el 23/10?)
Sin cambios visibles. Visto en la red: `index-DN5WvsiQ.js` 1,07 MB y `index-Chn8ROhg.css` 54 kB; datos `coronary-left/right/co.json`
(≈51 kB cada uno), `grafts-right.json` 56 kB, `heart.glb` 3,3 MB (+ `heart-lite` 0,63 MB), `thorax.glb` 3,0 MB (+ `thorax-lite`
0,78 MB); GLTFLoader y BufferGeometryUtils por separado; fuentes IBM Plex; analítica de Vercel. Mismos archivos, mismo peso que el
informe previo («~1 MB», 3,3 y 3 MB). Limitación: el 23/10 no se apuntaron los hashes, así que un cambio de versión sin cambio de
peso no se detectaría. **Hoy quedan anotados** para la próxima visita (arriba).
Interfaz nueva respecto a lo anotado: ninguna visible. Ya estaban: panel «Segmentos», «Vista actual», botones Left/Right/Both,
dominancia R/L/Co, ramo intermedio, injertos LIMA, SVG–OM, SVG–PDA.

## 2. Qué muestra la pantalla (visto)
- Tres paneles que se mueven juntos: angiograma, corazón 3D y sala. Mando: RAO 90…LAO 90 y CAU 45…CRA 45; el ángulo se
  lee en voz alta («LAO 45°, caudal 35°») para accesibilidad.
- **Panel «Vista actual»**: nombre de la proyección estándar, qué abre («primera vista para descartar enfermedad de TCI»),
  «qué deberías ver», rango habitual con fuente («Di Mario 2005 Tabla 2; Kočka 2020»). Entre dos estándares dice «entre vistas
  estándar: más cerca de X (22°) e Y (24°)».
- **Panel «Segmentos»**: por segmento, % de acortamiento y % de solapamiento con el vaso que lo tapa; además «mejor vistos»,
  «acortados», «solapados». Al pulsar una fila, una **marca en la almohadilla** señala la vista de menor acortamiento.
- Las proyecciones **tardan ~4 s en asentarse** (animación): leer antes da cifras de tránsito.

## 3. Pares de prueba (corazón con dominancia derecha por defecto; acortamiento % [solapamiento % con vaso])
Las cifras son de SU modelo (media de TC): sirven para probar la nuestra, no son fuente clínica.
| Proyección (nombre estándar) | Segmentos observados |
|---|---|
| LAO 45 CAU 35 («spider») | TCI 15 · DA prox 56 [19 con D2b] · DA media 57 · Cx prox 4 [5 con D2] · OM1 62 · D1 52 |
| RAO 30 CAU 30 («RAO caudal») | TCI 13 · DA prox 4 · DA media 35 [35 con D2] · Cx prox 14 · OM1 11 · D1 4 [8 con S2] |
| LAO 40 CRA 35 («LAO craneal») | TCI 12 · DA prox 31 · DA media 5 [9 con S2] · Cx prox 7 · OM1 1 [32 con Cx] · D1 3 |
| RAO 10 CRA 40 («AP craneal») | TCI 2 · DA prox 5 [10 con Cx] · DA media 2 · **Cx prox 48** · OM1 6 [15 con D1] · D1 9 [22 con OM1] |
| CD, LAO 50 | CD prox 5 · media 7 · distal 1 · **DP 54** · rama del VD 51 · cónica 62 |
| CD, RAO 30 | CD prox 35 · media 6 · **distal 56** · posterolateral 65 · DP 6 [25 con PL1] · marginal aguda 69 |
| CD, AP craneal (CRA 30) | CD prox 6 · media 32 · distal 28 [25 con RVb] · DP 6 |
Lectura clínica que sale sola: la DA proximal se ve peor en spider (56 %) y mejor en RAO caudal (4 %) o AP craneal (5 %); la Cx
prox. se ve bien en spider y RAO caudal pero se acorta 48 % en AP craneal; la CD media/proximal se abre en LAO.

**Vista óptima que propone** (marca de la almohadilla; convertida por mí desde coordenadas del dibujo, **deducido**, calibrado con
un solo punto: ±5° de error posible):
| Segmento | Vista más limpia |
|---|---|
| TCI | ≈ AP (LAO 0, CAU ≈3) |
| DA proximal | ≈ RAO 26, CRA 11 |
| Cx proximal | ≈ AP caudal (LAO 2, CAU 37) |
| CD proximal / media | ≈ LAO 22, CAU 1 / LAO 0, CAU 11 |
(Los segmentos estrechos —DA media, DA apical, OM— no dieron marca en mi lectura: **no visto**.)
Fórmula (ya anotada): ventana de ±3 puntos del eje, 1 − longitud proyectada ÷ longitud real, perspectiva desde el foco.

## 4. Qué usaría un intensivista (en 30 s) frente a qué para estudiar
Guardia (leer un informe de coronariografía de un posinfarto): 1) **dominancia** (¿derecha, izquierda, codominante?); 2) **qué vaso
está ocluido y en qué segmento** (TCI / DA proximal-media / Cx / CD), porque define territorio, VI en riesgo y complicación
esperable; 3) **grado de estenosis y flujo TIMI**; 4) **otras lesiones** (multivaso → SYNTAX, revascularización pendiente);
5) **acceso y dispositivos** (radial/femoral, stent, balón de contrapulsación). Debajo de eso, saber «qué proyección vio qué» ayuda
a creer o dudar de «lesión del 70 %» (un vaso acortado esconde estenosis).
Estudio: spider para TCI/bifurcación; RAO caudal para Cx y DA distal; AP/LAO craneal para DA; LAO para CD; acortamiento y solapamiento.

## 5. Frente a nosotros
| | AngioView | Nosotros |
|---|---|---|
| Proyección de rayos X, vistas, segmentos | Sí (SYNTAX, Dodge, Di Mario) | No (solo 6 tubos coronarios en `corazon-geo.mjs`, sin segmentos) |
| Corazón que late / fisiología | No | Sí (`motor.mjs`: presiones, Doppler, shock; isquemia solo del VD) |
| ECG / eco del infarto | No | ECG en la maqueta `b3-ritmo.html`; SCA solo en fichas `mc-sca-diagnostico/tratamiento`; **ninguna enlaza arteria ↔ ECG ↔ eco** |
| Dominancia / injertos | Sí | No |
Ganan ellos: toda la parte de hemodinámica. Ganamos: el corazón vivo y la clínica. **Hueco real nuestro**: nada explica un informe de cateterismo.

## 6. Ideas para el megaproyecto (de barata a grande)
1. **Ficha «Leer un informe de coronariografía en 30 s»** (cuaderno, sin 3D). Guardia: el hemodinamista dice «DA proximal 90 %, TIMI 1,
   dominancia derecha». Aporta: orden de lectura de 5 puntos, qué territorio, qué complicación mirar. Esfuerzo: bajo. Necesita: **PDF
   Di Mario 2005** + capítulo/guía ESC SCA (qué se espera ver).
2. **Tabla «vaso → ECG → pared del VI → complicación»** (II, III, aVF → CD o Cx → inferior → bradi/BAV y VD; V1-V4 → DA → anterior → shock,
   CIV). Guardia: ST elevado, cuál es la arteria sin esperar el cateterismo. Esfuerzo: bajo. Necesita: **PDF ESC SCA**.
3. **Almohadilla de ángulos con las vistas estándar** (mando 2D RAO/LAO × CRA/CAU) y «qué deberías ver» por vista. Estudio. Bajo-medio.
   Necesita: Di Mario 2005.
4. **«Encuentra la vista óptima»** (piensa-antes, REGLAS §8): se muestra una lesión de DA proximal y el alumno elige proyección; se colorea el
   acortamiento. Sin 3D: basta una tabla precalculada de nuestras coronarias. Medio. Necesita: la 3 + la geometría de `corazon-geo.mjs`.
5. **Árbol coronario con segmentos SYNTAX y dominancia** sobre nuestro corazón (base de 6, 7 y 8). Medio. Necesita: clasificación SYNTAX
   (publicada) y decisión: ¿geometría procedural o BodyParts3D? (licencia sin verificar en origen).
6. **IAM en el simulador que late**: ocluir un segmento y que el VI pierda contractilidad regional (VS, GC, shock, CIV). Grande. Necesita:
   tocar el motor (decisión de arquitectura) y fuentes de cifras (ESC SCA, Marino shock cardiogénico).
7. **Coronariografía animada desde nuestro latido** (arco en C, relleno de contraste). Grande, solo estudio. Mejor después de 5.
8. **Caso «shock cardiogénico en un IAM»**: secuencia ECG → eco → cateterismo → soporte (Merino SCA + Impella/ECMO del motor). Medio. Necesita: las anteriores.

## 7. Lo que no traería
Su código, mallas derivadas (`heart.glb`, `coronary-*.json`: sin licencia propia), textos, three.js/React, la sala 3D, el realismo
de rayos X completo.

## 8. No visto
Cine de relleno, la sala al arrastrar, injertos, ramo intermedio y las otras dominancias; DA media/apical y OM en la marca de vista
óptima; GPU real de móvil. Licencias en origen (no verificadas).

Capturas: `angioview-1-spider.jpg` (spider, panel de vista actual), `angioview-2-acortamiento.jpg` (CD en AP craneal con acortamiento en color).
