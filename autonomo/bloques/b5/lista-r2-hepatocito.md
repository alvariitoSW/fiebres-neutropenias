# Lista R2 · Hepatocito vivo (maqueta B «La fábrica por dentro», 9,45) → app · profesor, 01/11/2026

Fuente de verdad: `autonomo/maquetas/b5-hepatocito-b.html` + `b5-hepatocito-b/` (datos.js, modelo.js, guia.js, cara.js,
pruebas.js, dibujo.js). Destino: `js/modules/libros/hepatocito-vivo/` + `js/data/hepatocito-vivo-data.js`; clave de API
`hepatocitoVivo`, atributo `data-hepatocito-vivo="<preset>[:tips]"`. PDF: `docs/marino-2024-abdomen-temperatura-caps39-44.pdf`
(páginas del PDF B, ya verificadas en la maqueta). Cada casilla se tacha con una captura a 390 (y a 360 si dice «360»).

## A. Lo que queda fijo en pantalla
- [ ] Arriba: `IDEA` (una frase) con cita doble «PDF p. 6 · p. 6 · Ver en la ficha» y chip `ficha`; debajo los 4 modos (Explorar · Apuesta · Error · Error de Hilario · Caso).
- [ ] Monitor en 2 filas: **solo** la cifra de NH₃ arterial grande y en oro (`≥300` con «≥» al tope) y el grado West Haven en negrita con su cara de 24 px y chip `ilustrativo`; carril %, lactulosa, PA/FC y «Astrocito: normal/hinchado» en peso normal (`estilo.css` 77-79).
- [ ] Escena SVG (viewBox 0 22 360 324): colon → porta → hepatocito con carril de 4 estaciones («NH₃ entra», «1.º paso del ciclo (mitocondria)», «Resto del ciclo», «Urea a la sangre») → sangre arterial → astrocito; CVVH a la izquierda. El astrocito entero visible sin scroll al abrir (bottom < 562 a 390).
- [ ] Dock con 2 pestañas (Mandos | Pacientes) + frase viva encima, que sigue a la vista con `js/core/frase-vista.js` (no una solución propia). Dock+frase ≤ 30 % de 844.
- [ ] Botón «▶ Ver el carril de la urea paso a paso»: con `cargarMotion()` de la app (sin el `<script>` de la maqueta) cada estación pasa de opacidad 0,15 a la suya en 0,5 s, con 0,6 s de retraso entre ellas; con «reducir movimiento», estado final y la frase (origen `fisiología general` para las 4 estaciones y el CO₂).
- [ ] Estación apagada: opacidad mínima 0,35 + aspa roja + rótulo «apagado» (`opNodo`).

## B. Mandos (cada uno con su frase viva y origen, `hacer()` de pagina.js)
- [ ] Hepatocitos vivos 0-100 % (paso 5): el carril se apaga estación a estación y el NH₃ sube; frase «dirección: ficha · p. 6; cifra ilustrativa».
- [ ] Producción intestinal Baja/Normal/Alta (rótulo «ilustrativa»): cambian las partículas que salen del colon (`nProd`).
- [ ] Lactulosa Sin/2/3/4/6 deposiciones: la luz del colon se acidifica y salen menos partículas (efecto ilustrativo, p. 7).
- [ ] Rifaximina 0-14 días (400 mg ×3, «ficha: ≥10»), slider.
- [ ] TIPS on/off: el puente salta el hígado y el NH₃ llega entero a la arterial; rótulo «TIPS: apagado» fuera de la curva (`text-anchor="end"`).
- [ ] Fluido en bolo: Albúmina 5 % / Salino / Ringer lactato (mismo botón lo quita): PA y FC cambian según `FLUIDOS` (ilustrativo); con RL el astrocito se hincha (+0,2 de `sw`).
- [ ] CVVH on/off: las partículas de NH₃ aparecen dentro de la caja del filtro («roba partículas») y el amonio baja.
- [ ] Vías apagadas (paracetamol→glutatión, cetonas, lactato→glucosa, alcoholes): al tocarlas, frase + «Ver en la ficha» a `ma-fha-paracetamol`, `mr-cetoacidosis`, `mar-lactato-aerobio`, `mt-alcoholes` (los 4 ids existen en la app: enlace cruzado real con `data-especialidad`, no toast).

## C. Topes y criterios clínicos (R3: regla exacta, fuente; `topes()` de modelo.js)
- [ ] **Riesgo de edema**: sello si NH₃ arterial **>150 µmol/L** (normal <60), p. 7-8; con producción Alta y hepatocitos <30 % el umbral baja a **120**, rotulado en el sello «opinión del autor, no de la ficha» (nota en `NOTAS`). Desactiva lactulosa y rifaximina; abre la Fig. 39.2.
- [ ] **Edema que manda** (`estado.edema`): sello «Edema cerebral · la TC manda, no la cifra» aunque el amonio sea ≤ umbral; el astrocito al menos 0,8 hinchado (p. 6-7).
- [ ] **Diarrea osmótica**: aviso con 4 deposiciones (objetivo 2-3 y reducir/parar ante diarrea, p. 7; el 4 como umbral: opinión del autor, rotulado).
- [ ] **Hipovolemia**: sello con ≥6 deposiciones: PA 85/50, FC 115, desactiva el botón «6» (`fisiología general; cifras ilustrativas`).
- [ ] **Rifaximina <10 días**: aviso «Mínimo 10 días» con 1-9 días (p. 7); a 0 no hay aviso; 10-14 sin aviso.
- [ ] **CVVH no indicada todavía**: aviso si CVVH encendida y el amonio **sin CVVH** ≤ umbral **y no hay edema** (`!s.edema`; hoy el código no lo comprueba: añadirlo). Criterios de la ficha p. 8: oliguria persistente, amonio >150 o edema, sea cual sea la creatinina.
- [ ] **TIPS**: aviso «Cambia un problema por otro», p. 10; cuánto sube, ilustrativo.
- [ ] **Albúmina 5 %**: sello verde «el 70 % se queda en el vaso», sobre todo con albúmina <3 g/dL (p. 5). **Ringer lactato**: aviso «no recomendado: hipotónico, hiponatremia, edema» (p. 5 y 9).
- [ ] **Combinación no fisiológica**: aviso si el amonio <10 µmol/L (fisiología general). Tope de cálculo 300 µmol/L (`FIG.cap`, ilustrativo) con «≥».
- [ ] Barrido de extremos (`autonomo/pruebas/hepatocito-vivo.mjs`): cada mando en mín/medio/máx y cada preset × mando en extremo → PA, FC y amonio de paciente posible, sello en cada tope, sin solape de `<text>` a 390 y 360.

## D. Presets, guías y figura
- [ ] 5 presets (Hígado sano, Casimira 44 a., Edema cerebral, Hilario 58 a., Sangrado digestivo) con su texto y origen; Hilario PA 85/50 (PAM ≈ 62 frente a 65 de la Tabla 39.3, p. 9).
- [ ] Guía por preset con `.foco` en el dibujo: sano 3 pasos, Casimira 4 (el 4.º con «Hazlo: Encender la CVVH»), edema 3, Hilario 2, Sangrado 2; cada paso con página y origen.
- [ ] Fig. 39.2 real (`js/modules/libros/img/mar-fig39-2-tc-edema-cerebral.jpg`, `naturalWidth > 0`) en un plegable que se abre solo cuando salta el edema; hueco rotulado para la Fig. 52.2 (paracetamol), sin `<img>` vacío.
- [ ] Plegables abajo: «Cómo crece» (`CRECERA`, 4 carriles con ficha y página), Fuentes (7, cada una con su página), Notas (4 «la fuente no lo dice», 1 «las fuentes discrepan» ceftriaxona 1 g/2 g, 1 «opinión del autor» del 120), Para profundizar (6).

## E. Pon a prueba (pruebas.js)
- [ ] Apuesta (preset sano, cifra oculta «?»): 3 opciones; al responder pone hepatocitos 30 % y revela ~113 µmol/L; cada opción falsa dice qué le pasa al paciente.
- [ ] Error (Casimira): 5 frases, 1 error (lactulosa «alcaliniza»); al acertar «Es un error», primero «Piensa la frase buena» y botón «Ver la frase buena»; al acabar, lactulosa a 3.
- [ ] Error de Hilario: 6 frases, 2 errores (RL; INR <1,5 → tromboelastografía); la ceftriaxona 1 g/2 g **no** se marca error; al acabar, albúmina en el dock.
- [ ] Caso Casimira, 4 pasos: h 36 NAC (p. 3) → día 2 enciende tú la CVVH (165 µmol/L, creatinina 1,1; p. 8) → día 3 albúmina 5 % (al acertar `fl: 'alb'`: PA 82/45 → 92/50, sello) → día 4 TC con edema que manda + noradrenalina (PA 104/60) → trasplante (p. 8).
- [ ] «Lo que te llevas» al final de cada prueba (apuesta 2, error 2, Hilario 3, caso 3), cada punto con su cita doble.
- [ ] Cada cita (≥18) con «PDF p. N» (`#page=N`) y «Ver en la ficha» que abre `marino-abdomen` en el párrafo de `fichaDe()` / `FICHA_MANDO` con `data-resaltar` (en la maqueta es un toast).

## F. Arreglos pendientes (`pendiente-app.md` y rejuicio final)
- [ ] `dibujo.js`: a 360, «Astrocito · normal» no pisa «Otras vías…», «glutamina + agua» no toca el círculo, la línea del TIPS no cruza «sinusoide» ni «porta»; «Mitocondria» y «sinusoide» separados ≥6 px (comprobar con la prueba de solape de cajas).
- [ ] NH₃, urea y glutamina dados de alta en `js/core/particulas.js` (solo añadir especies; sin cambiar las existentes) y usados en el dibujo y la leyenda con `svgParticula`/`leyendaParticulas`.
- [ ] Opcional (9,45 → 9,5): en Apuesta, tras acertar, un «¿por qué?» de una línea que encienda `.foco` en el carril.

## G. Registro y botones en las fichas (`marino-abdomen.html`, ≤6)
- [ ] Huecos `[HUECO hepatocito: …]` sustituidos (libros/index.js ×4, index.html, marino-portada.html, jueces-forma/movil/topes) y «← VOLVER» a la ficha de origen.
- [ ] Botones `.especialidad-link` `data-hepatocito-vivo`: `#ma-eh-nh3` → `edema` («el astrocito se hincha») · `#ma-eh-amonio` → `casimira` (>150 µmol/L) · `#ma-eh-lactulosa` → `casimira` (lactulosa y rifaximina) · `#ma-eh-cvvh` → `edema` (CVVH) · `#ma-var-tips` → `alta:tips` (el TIPS salta el hígado) · `#ma-fha-hemodinamica` → `casimira` (albúmina 5 % y no RL: el astrocito lo enseña). Cada uno dentro de su párrafo.
