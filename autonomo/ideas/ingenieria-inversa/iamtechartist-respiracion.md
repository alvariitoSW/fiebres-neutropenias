# Techartist · «Breathing and Respiration» (iamtechartist.com): informe de ingeniería inversa (29/10/2026)

Pedido por el usuario el 29/10: «esta página también habría que tenerla en cuenta para el tema de modelos vivos».
Playwright a 390×844 con WebGL por software (SwiftShader), 4 scripts; su JS leído en memoria a trozos (sin mapa de
código: `.map` da 404). Solo se guardaron capturas en `/tmp`. Etiquetas: **visto**, **deducido**, **no visto**.
Informe para el móvil: https://claude.ai/artifact/XQuCdHBBJWUe8qTLXGfZ99

## 1. Qué es
- Lección interactiva de biología en 3D, en inglés, para alumnos de 11-16 años (KS3, GCSE). Sigue **una bocanada de
  oxígeno** por un cuerpo de cristal: del aire de la habitación al músculo y de vuelta. Autor: «Techartist» (web
  WordPress con más lecciones). **Visto** (portada).
- **10 salas** (**visto**, `Ou` en el JS): I Breathe In (diafragma y costillas) · II The Tree (el árbol bronquial se
  divide 23 veces) · III Unfold (480 millones de alvéolos que se despliegan hasta una pista de bádminton) · IV The Swap
  (difusión por una pared 100 veces más fina que un pelo) · V The Ride (hematíe y hemoglobina, 4 O₂ por molécula) ·
  VI The Pump (corazón y válvulas, el «lub-dub») · VII Two Loops (doble circulación) · VIII Burn (respiración aerobia en
  la mitocondria) · IX Run! (ejercicio y deuda de oxígeno) · X Out (CO₂ y agua de cal).

## 2. Cómo está puesta para estudiar (su truco)
- **Cada sala, la misma receta** (**visto**, objeto de cada sala en el JS y en pantalla):
  1. **Tour**: 5 frases cortas, una por pantalla, cada una con su **plano de cámara** (`{line, shot}`): «Every breath
     starts with a pull» → «The diaphragm tightens and drops» → … Barra de progreso de 5 rayas, pausa y sonido.
  2. **Your turn**: **un solo gesto** que cambia el modelo: mantener pulsado para inspirar (sala I y X), arrastrar
     para desplegar los alvéolos (III), un deslizador del grosor de la pared (IV), empujar un hematíe (V), tocar el
     ritmo del corazón (VI), arrastrar el esfuerzo (IX).
  3. **Lectura viva** (`readout` + `chip` con barra): «Oxygen crossing: 6 a second · wall 0.5 µm»; «Unfolded: about
     70 m²… badminton court (82 m²)»; «Oxygen supply X of Y L a minute · breaths · beats · lactic acid building».
     La sala se da por hecha cuando llegas al estado (`done`).
  4. **Check yourself**: 2 tarjetas pregunta-respuesta que se destapan, y una broma final.
- **El anillo de escala** (**visto**, capturas): una rueda a la derecha que va de ×1 (cuerpo entero, «20 cm») a
  ×100.000 (una célula), con regla en la pantalla («5 cm», «50 µm») y el nombre del nivel («WHOLE BODY», «AIR-BLOOD
  WALL»). Se arrastra o se gira con la rueda, y entre salas la cámara **se zambulle** sin cortes.
- **Navegación**: número romano + título arriba, flechas de sala anterior y siguiente, `#room-N` en la dirección.

## 3. Cómo está hecha
- **Tecnología** (**visto**): página de WordPress que abre la app en un `iframe`
  (`/Apps/breathing-and-respiration/`). App con Vite (un JS de 804 kB) y **three.js** (`data-engine="three.js r…"`),
  modelos `.glb` comprimidos con meshopt (`body.glb` 502 kB, `skeleton.glb` 506 kB), sombreadores propios (los
  músculos cambian de color con el ácido láctico: `uLactic`, `uWork`), sonido con WebAudio a partir de un solo archivo
  (`sfx.mp3`, 395 kB, cortado según `sounds.json`). En total, unos 2 MB.
- **Fisiología en el código** (**visto**, trozo de la sala IX): demanda de O₂ = 0,25 + 2,95 × esfuerzo (L/min);
  oferta que sube hacia un tope de 2,6 L/min con constante de 2,5 s; la diferencia se acumula como «deuda». Es un
  modelo de juguete con cifras redondas, sin fuente.
- **En el móvil**: sin desbordamiento a 390 px; avisa si el navegador no tiene aceleración gráfica («Open anyway»).
  Analítica de WordPress/Jetpack (`stats.wp.com`, bloqueada por nuestra red). **Visto**.
- Lo que **no** se vio: la pulsación mantenida no movió el contador en la prueba (0,00 L; el ratón emulado no le llega,
  deducido); las salas V-X por dentro; el sonido.

## 4. Licencias (copiadas de sus «Credits», sin verificar en origen)
- «Figure and skeleton: Blender Studio Human Base Meshes (**CC0**). Everything else built by Techartist.»
- Sonidos: grabaciones reales **CC0** de Freesound (10 autores citados).
- El resto: «© 2026 Techartist». → **Ideas sí; código, textos e imágenes no.** La malla CC0 de Blender Studio sí se
  podría usar (dominio público), pero pide 3D en la app (ver §6).

## 5. Frente a nosotros
- **Nuestros modelos vivos** (capilar, nefrona, agua, catéter, muralla, telar, inmersión, corazón eléctrico, receptor,
  shock, vaso) son escenas planas de grabado con Mayéutica, casos y frase viva, fieles a una fuente con página.
  **No tenemos aún ninguno de respiración**: B-013 «Pulmón con respirador» (Marino caps. 23-30), fusionado en `b3`.
- Ganan ellos: **el viaje de escala** (de cuerpo a célula sin cortes), **un gesto por idea** con lectura que responde y
  **la receta fija de cada sala** (tour corto → tu turno → 2 tarjetas). Se aprende con el dedo.
- Ganamos nosotros: nivel (UCI, no colegio), fuente con página, casos clínicos que evolucionan, Mayéutica, topes con
  consecuencia de paciente real (REGLAS §1.14), conexión con los libros. Sus cifras son de divulgación sin fuente.

## 6. Qué traería (de lo barato a lo grande)
1. **La receta de sala** en nuestros modelos vivos: 5 frases de tour con su plano → «tu turno» con un solo gesto →
   2 tarjetas de «compruébate». Encaja con el Explorar | Conceptos | Mayéutica que ya tenemos. Pequeño; nada.
2. **El anillo de escala** como mando de nuestros modelos: del tórax al alvéolo y al capilar, con regla y nombre del
   nivel (en 2D: cada nivel, una lámina; el anillo hace de puente). Medio; nada. Para B-013 y el capilar vivo.
3. **El pulmón con respirador (B-013) como viaje**: caja torácica → vía aérea → alvéolo → membrana → capilar, con las
   curvas del respirador y fuente Marino caps. 22-30 + El Libro Azul sección IV. Grande; ya aprobado como bloque.
   De guardia: «PEEP 5 → 12: ¿qué le pasa al alvéolo que se colapsaba?».
4. **3D de verdad** (three.js + malla CC0 de Blender Studio): grande; necesita **una decisión de arquitectura del
   usuario** (CLAUDE.md §2: una sola librería, Motion). Recomendación: no por ahora; la idea de la escala funciona en 2D.

## 7. Pares de prueba (observados; no son fuente clínica)
- Sala IV: pared 0,5 µm → «6 O₂ por segundo»; el deslizador va de 0,5 a 6 µm y la difusión se frena al engrosar.
- Sala III: desplegado entero → «about 70 m²» frente a la pista de bádminton (82 m²); su tarjeta: «estimates run 50-140».
- Sala X: aire espirado ≈ 4 % de CO₂ frente a 0,04 % del aire ambiente («about 100 times more»).
- Sala IX: con esfuerzo máximo la demanda (3,2 L/min) supera el tope de oferta (2,6) → «lactic acid building»; al
  parar, «panting to repay the oxygen debt».
- Anillo: ×1 «WHOLE BODY, 20 cm» · ×3 «5 cm» · ×4.500 «AIR-BLOOD WALL, 50 µm».

## 8. Piezas (para la próxima visita)
`/Apps/breathing-and-respiration/`: `index.html` 12 kB · `assets/index-BV2mJSah.js` 804 kB · `index-ClmBqUBG.css` 20 kB ·
`audio/sounds.json` 2 kB · `audio/sfx.mp3` 395 kB · `models/body.glb` 502 kB · `models/skeleton.glb` 506 kB.
Red: hacen falta `iamtechartist.com` (sin www) y `www.iamtechartist.com`; `i0.wp.com` y `stats.wp.com` siguen cerrados
(no hacen falta).
