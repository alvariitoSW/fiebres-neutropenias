# Bloque 3 · Juicio de las maquetas v2 (profesor, modo juzgar, 21/10/2026)

*Hecho con: las tres maquetas servidas desde la raíz del repo (puerto propio) y sus v1 (`git show 214184a:…`) en otro
puerto; Playwright a 390 × 844 táctil (escala 2 y 4) y a 360; cada paciente, mando y aparato del shock (Impella 2,5-5,5 y
«gasto total», balón 35/40, ECMO 0-6 con los tres venteos, gravedad 0-50-100, volumen, fármacos, reloj, cuña, UMI),
«¿Qué shock es?» y la Mayéutica entera fallando a propósito; en el corazón eléctrico FA ± diltiazem/3 h, WPW → FA →
diltiazem → FV, reentrada + adenosina, K⁺ 8,2, Medir y la guía; en el receptor la NA 0-5-25-40, betabloqueo + adrenalina,
milrinona, vasopresina, bronquio + albuterol/ipratropio, lupas y guía; capturas a 4× de las uniones de los aparatos;
tamaño mínimo de rótulos (≥7,5 px en las tres) y desborde (0 a 390 y 360); ninguna consola con errores. Método
Anatomy: `/tmp/ajeno/anatomy/SKILL.md` y `references/verify.md` (estándar: `examples/test-rig`).*

## 1. Puntuación (entre paréntesis, la nota de la v1 en los megaproyectos)

| Punto | Shock | Ritmo | Receptor |
|---|---|---|---|
| §7.1 Primera vista | 4 (3) monitor + escena + frase en 844 px; el dock tapa media escena con «Soporte» abierto | 4 (3) monitor y corte arriba; las lupas, bajo el dock | 4 (3) monitor y los dos órganos; 160 px de cabecera antes |
| §7.2 Párrafos | 4 | 4 | 4 |
| §7.3 Resaltado | 4 | 4 | 4 |
| §7.4 Lo que enseña se ve | **3** (2) los aparatos ya son objetos (balón que se hincha, hélice, carro del ECMO); el corazón del paciente sigue siendo el esquema con rótulos | 4 (2) anillo, His que lo cruza, tinta, torniquete con cerrojo y X del fármaco, célula con aguja | 4 (2) anillo de células lisas que cierra la luz, llaves repartidas, cerradura con llave ciega, mastocito |
| §7.5 Interactivo que enseña | **3** (3) ver §2.2: el Impella no sube el gasto, la IRVS casi fija, PAP del TEP imposible | **3** (3) cifras que no casan con la tira; Medir deja todo en pausa | **3** (4) el «β sube el gasto» no se ve (IC 4,0 → 4,4); frase que no sigue a NA 0 |
| §7.6 Vista Visual | 4 (3) | 4 | 4 |
| §7.7 Móvil | 4 (3) PCP pisada por su marca | **3** (4) frase cortada a 2 líneas con «…» | **3** (4) frase cortada; llaves de ~6 px |
| §7.8 Modelo grande | 4 (2) importa `js/modules/eco/motor.mjs` | 4 (3) grafo de conducción, 26 estados (5 pendientes de fuente, bien dicho) | 4 (3) tres tablas y `efecto()`, 14 estados |
| §7.9 Ver en la ficha | 5 | 4 | 4 |
| §7.10 Explicación guiada | 4 | 4 | 4 |
| §7.11 Por concepto, fuentes en lista | 4 (3) chips Marino/UMI y nota del Impella | 4 (3) | 4 (3) |
| §7.12 Megaproyecto, nivel Anatomy | **3** (1) | **3** (2) | **3** (2) |
| §8 Recorrido y formatos | 4 (3) 15 ítems, tres formatos | **3** (3) muestra de 5 tests | **3** muestra de 5 tests |
| §8 Dificultad | 4 | 4 | 4 |
| §8 Caso que evoluciona | **3** (2) 7 pasos, ficha que se rellena, giro; sin cálculo | **2** un paso | **2** un paso |

**Veredicto: no pasa ninguna** (shock 5 puntos <4; ritmo 5; receptor 5). **Las tres han subido el nivel de verdad**:
- el shock arregla la queja del usuario (todo aparato responde en todo paciente, con sello y motivo), tiene un monitor de
  UCI (PAP con cuña, capnografía, marcas del balón sobre la onda R, consola bomba/corazón/total), un reloj y una Mayéutica
  completa;
- el corazón eléctrico pasa de óvalos a un corte con piezas y un ECG que nace de la activación;
- el receptor pasa de cajas con globos a una lámina tipo banco de pruebas.

No están listas para enseñarse como «v2 terminada»: se pueden enseñar como avance si antes se arreglan los puntos
1-4 de §2, que son baratos.

## 2. Lo que falta, por orden de importancia

1. **Las piezas comunes no se comparten: son copias.** Las tres dicen usar «la misma pieza», pero no importan nada común.
   - Hay tres monitores: `b3-shock/monitor.js`, `b3-ritmo.html` l. 67-110 y 1522-1660, `b3-receptor.html` l. 80 y siguientes.
   - Hay tres dibujos isométricos: `comun/dibujo-iso.js` (solo lo usa el shock), `caja()` en `b3-ritmo.html` l. 1415 y
     `caja()`/`cilindro()` en `b3-receptor.html` l. 958-980.
   - Hay dos bombas de jeringa: `b3-ritmo.html` l. 1411 y siguientes, y `b3-receptor.html` l. 1930.

   Lección 8: antes de llevar nada a la app, un solo `monitor.js`, un solo `dibujo-iso.js` y una sola bomba, en
   `autonomo/maquetas/comun/`. Las tres maquetas los importan.
2. **Cifras de un paciente imposible o que contradicen la fuente** (§1.12, CLAUDE §12).
   - **Shock, Impella (el aparato que pidió el usuario):**
     - Aurelio arranca seco (`datos.js` l. 112, `volemia: -1500`): PVC 1 en un shock cardiogénico a cualquier gravedad.
       Con el Impella a 2,5 el gasto total pasa de 3,0 a 3,1 L/min.
     - A 5,5 L/min la bomba solo da 3,1. El modo «gasto total pedido 5,0» se queda en 3,9 (`soporte.mjs` l. 119 y 150).
     - Ni la consola ni la frase dicen por qué (el VI vacío limita la bomba). La propia G2 explica «sube el gasto (p. 48)»
       mientras el modelo enseña que no.
     - Arreglo: que la consola avise «la bomba no llega: el VI está vacío» o que el Explorar del soporte parta de Aurelio
       tras el volumen.
   - **Shock, motor común** (`js/modules/eco/motor.mjs`; se arregla en origen):
     - IRVS casi fija, 34-39, en todos los pacientes y gravedades: el sano da 34 y la hemorragia de clase IV, 39.
     - TEP con resistencia ×16: PAP 53/50, una presión de pulso de 3 mmHg y una media de 51 en un VD agudo.
   - **Ritmo:**
     - En la FA con WPW, «QRS rápidos» da FC 56 → 35 y PA 56/12 mientras la tira va a unos 180 lpm. Lo causa el filtro de
       `leer()`, `b3-ritmo.html` l. 1607 (`fin - t0 < 0.3`).
     - Tras la adenosina, PA 91/19.
     - En la FA con diltiazem a 3 h, la frase dice «~96» y el monitor 113.
   - **Receptor:**
     - Con NA de 0 a 10, el IC solo pasa de 4,0 a 4,4: el reparto hacia el β no se lee.
     - El broncoespasmo empieza con «luz 100 %» (`b3-receptor.html` l. 833): debería partir estrecho.
3. **Mandos que parecen no hacer nada.**
   - Ritmo: Medir pausa la tira, y al pasar a Tratar sigue en pausa (`b3-ritmo.html` l. 2266: limpia `S.medir`, no
     llama a `ponerPausa(false)`). Los fármacos «no actúan» y salen FC 10 y PA 22/9.
   - Ritmo: la frase de la FA con WPW y diltiazem vuelve a la del WPW en sinusal.
   - Receptor: con NA 0, la frase sigue hablando de «por debajo de 10 µg/min».
4. **Frase cortada a 2 líneas con «…»** en el ritmo (`b3-ritmo.html` l. 107) y el receptor (`b3-receptor.html` l. 152).
   Es el mismo fallo G1 de la v1 del shock: se esconde justo el dato (la Fig. 19.5, la dosis por kilo). Hay que quitar
   el `line-clamp`, como ya se hizo en el shock.
5. **Esquema en vez de objeto (Anatomy a 4×).**
   - **Corazón del paciente** (`b3-shock/corazon.js`): las mismas cámaras planas con rótulos dentro. Sirve también de
     «eco» en «¿Qué shock es?», que no es una eco. Debería ser el corte del ritmo (estilo A) o la eco de la Circulación viva.
   - **ECMO, plano «Dentro»:**
     - la cánula venosa acaba en el aire, fuera de la AD (`aparatos.js` l. 498);
     - la aorta no sale del VI;
     - no hay VCI.
   - **Impella, plano «Dentro»:**
     - una cuña negra entre la AI y la raíz aórtica;
     - un quiebro en la pared aórtica;
     - un anillo suelto junto a la jaula;
     - la consola flota sin cable (el catéter acaba en `aparatos.js` l. 286 y la consola está en l. 268);
     - los chips de la escena tapan el cayado.
   - **Recorrido** (`corazon.js` l. 108): un torso de líneas. En el Impella, el punto dorado se queda en la aorta
     ascendente, sin llegar al VI.
   - **Lo que sí alcanza el método:** el despiece del Impella y el del balón (banco, soportes, placa) y el carro del ECMO.
   - **Ritmo y receptor:** las lupas, que son lo mejor, quedan tapadas por el dock y son pequeñas. Hay que darles altura
     propia o un plano a pantalla completa.
6. **§8.**
   - Ninguna de las tres tiene la parte 2, «otra vez lo que fallaste».
   - El caso del shock no pide calcular nada: por ejemplo, el gasto total (bomba + corazón) o el porcentaje de caída del
     lactato con el reloj.
   - Su paso 7 repite E3 casi palabra por palabra (`datos.js` l. 446 y la E3): se contesta de memoria.
   - En «¿Qué shock es?» la edad delata al paciente («Varón de 67» siempre es Aurelio; `datos.js` l. 292-303).
   - Ritmo y receptor: solo hay test. Falta un «piensa y destapa» y un «encuentra el error», y el caso tiene un paso.
     Basta como muestra, pero queda por debajo de 4.
7. **Cobertura.** El caso de Aurelio de `cobertura.md` §9 (rotura del papilar a las 18 h) no es el de la maqueta (fallo
   respiratorio → ECMO). Hay que decidir uno y anotarlo.

## 3. Lo que ya está al nivel (no tocar)

- Todo aparato responde en todo paciente, con sello y razón (`datos.js` l. 129).
- La consola separa bomba, corazón y total.
- Las marcas de inflado y vaciado del balón van sobre la onda R, con la curva sin balón punteada.
- La pierna del balón con su regla (p. 46).
- Objetivos por fuente, con su nota de discrepancia.
- «Predice» tapa el monitor y el dibujo.
- La Mayéutica del shock tiene 15 ítems con los tres formatos y «Lo que te llevas».
- El ritmo tiene el ECG generado con calibrador, el torniquete con su cerrojo y su X, y los estados pendientes de fuente
  dichos con honradez.
- El receptor tiene el banco de dos órganos, la llave ciega que se queda y el «?» donde la fuente calla.
- En las tres: «Ver en la ficha», 0 px de desborde a 390 y 360, rótulos ≥7,5 px y ningún error de consola.
