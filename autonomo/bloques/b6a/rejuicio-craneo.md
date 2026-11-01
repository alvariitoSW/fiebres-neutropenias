# Rejuicio · cráneo B «El corte con la cara» tras las vueltas 2a, 2b y 3 · profesor, 01/11/2026

Base: `node autonomo/bloques/b6a/herramientas/craneo-b.mjs` TODO EN VERDE a 390 y 360 (12.600 combinaciones sin PIC > PAM ni PIC > 80; PAS 214 → PAM 150; HSA sin `uncal`; pupila del SVG = `textoPupila`; sello sin pisar el monitor; escena entera sobre la frase viva: borde del SVG 450/424 px < frase 686 px; citas 8/0 mal; penumbra 3→0 anillos con la PPC; Doppler 60 → 90 cm/s y 4 partículas que se paran sin flujo) + 4 capturas (01-inicio, 07-descer, 09-injertos, 05-caso a 390). La auditoría (G1, G2, H1, M1-M11) está aplicada en `pruebas.js`, `datos.js` (NOTAS, PROFUNDIZAR) y `pagina.js`.

| Criterio (solo los que estaban < 9,5) | Antes | Ahora | Por qué |
|---|---|---|---|
| ¿Se ve el mecanismo? (§7.4, 7.12) | 9,25 | **9,5** | La cara obedece al estado: D dilatada y fija con el sello uncal (01), dos fijas y mano flácida en la compresión del tronco (07), medias fijas y «Sin flujo» en las arterias de la base (05). Injertos: curva presión-volumen con el punto del paciente y la barra de Monro-Kellie (09, rotulados «otra fuente»), autorregulación con «Tú: PPC 65», penumbra por anillos y Doppler. Es el paciente de Marino hecho dibujo. |
| ¿Se entiende a 390 px? (§7.1, 7.7) | 7,5 | **9,25** | Corte entero (uncus, tienda, tronco, III par) + cara + mano + GCS caben sobre el monitor en la primera pantalla; monitor en 2 filas (69 px) con el sello **debajo**; frase viva + dock 158 px (19 %). Falta: a 360 el rótulo más pequeño del corte queda en 8,37 px (diminuto). |
| ¿Apuesta, error y caso? (§8) | 8,25 | **9,25** | Caso de Abundio 5 pasos (hipertónico → TC 55 mL → PIC 16 en objetivo → PIC = PAM → test de apnea) con «Lo que te llevas» ×4 y cita doble en cada cierre; segundo caso (Segismundo) y segundo error; errores de 6 frases con «0, 1 o 2»; apuesta con opciones de longitud igualada. Falta: el giro del paso 4 (PIC = PAM el día 2 tras un paso 3 en objetivo) no dice por qué. |
| Paciente posible y topes (§1.12, 1.14) | 8,25 | **9,25** | PIC tope 80 y PAM tope 150 rotulados `fisiología general`; «sin flujo» con PPC <10 `ilustrativo`; Na⁺ >155 con sello; craniectomía de un solo toque. Falta: Petronila nace a la hora 0 con sello «Resangrado» (PAS 166 > 140 con `t = 0`) y PIC 32; lo pedido era nacer con PIC ≤25 y GCS 9 por la HSA. |
| **Global** | 8,3 | **9,3** | Pasa (≥ 8,75). Para la meta 9,5, los 4 retoques de abajo. |

**Retoques baratos (≤6)**:
1. `modelo.js` l. 34: el sello «Compresión del tronco» dice «Descerebración» también en el estadio 5 (mano flácida, M1; captura 07). Texto por estadio: 4 «descerebración (mesencéfalo-protuberancia alta)», 5 «flácido: tronco bajo» (p. 10).
2. `modelo.js` l. 13 `resangra` y `datos.js` l. 9 preset de Petronila: que la sello «Resangrado» solo salte con `t ≥ 1` (a la hora 0 solo aviso «PAS >140 con aneurisma abierto: riesgo de resangrado», p. 47) y que nazca con PAS ≤140 y PIC ≤25 (hidrocefalia leve), GCS 9 por la HSA.
3. `pruebas.js` paso 4 de Abundio: una causa del giro en el enunciado («resangrado del lecho quirúrgico con edema; TC de control», magnitud `ilustrativo`), para que el salto de PIC 16 a PIC = PAM sea un paciente posible.
4. `corte.js` + `herramientas/craneo-b.mjs` l. 31: subir el rótulo mínimo del corte a ≥ 9 px a 360 (acortar «Arterias de la base» / «Sensor de PIC» o ampliar `font-size`), y que el programa imprima cuál es el rótulo más pequeño.

No visto con los ojos: la guía de Leovigildo (locked-in), la penumbra de Clotilde y el Doppler de Petronila (solo por el programa); captura 10 y 03 quedan para el constructor.

## Rejuicio final (tras los 4 retoques) — **global 9,5** (meta de modelo vivo nuevo cumplida)
Móvil 9,25→9,5 · apuesta/error/caso 9,25→9,5 · paciente posible y topes 9,25→9,5. El aviso «PAS >140 con aneurisma
abierto» se quedaba pegado al cambiar de paciente: faltaba `resang0` en la lista de avisos que limpia `pagina.js`
(arreglado por el director; programa en verde). No visto a ojo: guía de Leovigildo, penumbra de Clotilde, Doppler.
