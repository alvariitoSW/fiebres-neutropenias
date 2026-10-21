# Bloque 3 · El receptor vivo: los fármacos del shock y sus receptores · plan de estudio

*(Profesor, modo diseñar, 21/10/2026. Lo pidió el usuario el mismo día: «un modelo vivo con los fármacos y sus
receptores que expliquen tanto su mecanismo de acción fácil y completamente como ver a qué receptor van y la función de
cada fármaco, además de sus dosis y sus efectos secundarios». Hecho con: el texto de las fichas 2, 7, 10, 12, 14, 16, 18,
20, 21, 22 y 24 de `merino-cardiologia.html` y la 26 de Neumología; los PDF pasados a texto y cotejados página a página
(shock: p. 11-16, 41-44, 60-61, 65-67; cardíaco: p. 9-11, 22-25, 29-30, 46-47, 51-52, 60-62, 66; respiratorio: p. 10-11;
toxicología: p. 10-12); `receptores-animados.js` y `RECEPTORES_FARMACO` abiertos en el navegador a 390 px con NA alta,
vasopresina y dobutamina; la maqueta `autonomo/maquetas/b3-shock.html` (monitor, escena y pestaña Fármacos); y lo que
dicen de los mismos fármacos el Manual UMI (`umi-vasoactivos`), Marino cap. 52 (`mt-bzd-betabloq`, `mt-cianuro`),
Marino abdomen y renal, El Libro Azul y la Guía ESC de IC.)*

**Páginas**: del PDF (lo que va tras `#page=`). **S** = `marino-2024-shock-caps14-17.pdf`, **C** =
`marino-2024-cardiac-disorders-caps18-21.pdf`, **R** = `marino-2024-respiratory-management-caps22-26.pdf`, **T** =
`marino-2024-toxicologia-caps52-53-apendices.pdf`. **Ids**: los de la cobertura §3 (`#mc-…`, `#nep-…`, aún por poner
en las fichas) y los que ya existen en otras (`#mt-glucagon-mecanismo`, `#mar-img-52-4`, `#umi-vasoactivos`…).

---

## 0. En una pantalla

- **Qué es**: un modelo vivo **nuevo, por concepto** (REGLAS §7.11): *un fármaco es una llave; abre (o tapa) unas
  cerraduras concretas en unas células concretas; lo que hace la célula es lo que ves en el monitor*. Se llama
  **«El receptor vivo»** (`data-receptor-vivo="estado"`, ids `rcv-`, libres: comprobado con grep).
- **Contiene y sustituye a los receptores animados**: su «paso a paso» con Motion pasa a ser la cascada de cada célula;
  `RECEPTORES_FARMACO` se muda a `js/data/vasoactivos-data.js` (pieza común 4 de la cobertura). Arregla de paso su gran
  fallo de concepto: hoy α₁, β₁ y β₂ están **en la misma membrana**, cuando viven en células distintas (el α₁ que
  aprieta está en la arteriola; el β₁ que empuja, en el miocito).
- **Cuatro escalas en una pantalla**: el **monitor** (paciente) → el **órgano** (arteriola, vena, corazón, mastocito)
  → la **célula** con sus receptores → la **cascada** (fácil o completa). Un hilo de oro une cada eslabón.
- **26 fármacos** (§4) en **5 células** (§3) y **21 estados con nombre** (§5), cada uno con su explicación guiada.
- **Explicaría ≈13 fichas del bloque 3 y ≈9 de otros libros** (§6). Mayéutica de modelo + caso nuevo (Paulino, §7).
- **Hallazgo grande**: la **Fig. 52.4 de Marino** (T p. 11, ya en la app como `#mar-img-52-4`) es *exactamente* el
  miocito de este modelo (receptor β y de glucagón → adenilato ciclasa → AMPc → canal de Ca²⁺ → proteínas contráctiles;
  betabloqueantes, calcioantagonistas y milrinona). El miocito vivo se construye sobre ella y la real va al lado. Y la
  ficha de tóxicos explica lo que el cap. 17 deja en el aire: **por qué el glucagón rescata al betabloqueado**.

---

## 1. Lo que hay que entender (5 ideas de fondo)

1. **Llave y cerradura**: cada fármaco encaja en unos receptores; el **agonista** abre y el **antagonista** tapa sin
   abrir (fentolamina, esmolol). Lo que importa no es el nombre del fármaco, sino **qué cerraduras abre y dónde**.
2. **La misma cerradura en células distintas hace cosas distintas**: β₁ en el miocito = fuerza; en el nodo = frecuencia;
   β en el mastocito = frena la liberación (S p. 66). α₁ en la arteriola = RVS; en la vena = retorno.
3. **La dosis cambia el reparto**: NA <10 µg/min el β mueve el gasto, >10 manda el α, a 30 techo (S p. 13); dopamina
   ≤3 / 3-10 / >10 µg/kg/min: dopaminérgico, β, α (S p. 14). Hay fármacos que **no se titulan** (vasopresina, S p. 16).
4. **Dos puertas al mismo efecto**: α₁ y V₁ aprietan por vías distintas (por eso la vasopresina «ahorra» NA, S p. 15);
   β y glucagón llegan a la misma adenilato ciclasa (T p. 10-11); la milrinona salta el receptor y frena la PDE.
5. **Cada efecto adverso es el mismo receptor en el sitio equivocado**: el β de la adrenalina da FA y lactato (S p. 14);
   el α de la fenilefrina, bradicardia refleja e intestino sin riego (S p. 15); el α sin β enfrente en la cocaína
   (C p. 47); el α que se escapa de la vena, la piel blanca (S p. 12).

---

## 2. Qué se ve (390 × ~760 de escena + dock fijo abajo, como la cabecera del shock)

### 2.1 De arriba abajo

1. **Idea en una frase** (§7.1): «Cada fármaco es una llave: abre unas cerraduras en unas células. Lo que hace la célula
   es lo que ves en el monitor.» Chip `ficha · S p. 12` (los vasopresores estimulan α₁) + `fisiología general`.
2. **El monitor** (alto ~120 px; **pieza común** con la cabecera del shock, §8): curvas de ECG y de ART con la línea de
   la PAM y la marca de 65; cifras grandes **FC · PA (PAM) · IC · IRVS**; debajo, pequeñas, **PVC · lactato · glucemia ·
   diuresis**, que solo se encienden cuando el fármaco las toca (adrenalina: lactato y glucemia). Encima, el chip del
   **paciente de fondo** (§5.3): el mismo fármaco hace cosas distintas en un sano y en un séptico (la vasopresina no sube
   la PA en voluntarios sanos y sí en el shock vasodilatador, S p. 15).
3. **El cuerpo** (alto ~110 px): una fila de cinco dianas dibujadas, no iconos genéricos: **corazón** (miocito + nodo),
   **arteriola**, **vena**, **mastocito** y, más pequeños, **riñón** e **hipófisis**. Cada diana late con la fuerza con
   que actúa el fármaco: **0-3 marcas en su anillo** (forma, no solo color, CLAUDE §5). Un hilo de oro une cada diana con
   la cifra que mueve (arteriola → IRVS; corazón → IC y FC; vena → PVC). Al tocar una diana se abre su célula.
4. **La célula** (lupa de ~360 × 380, el corazón del modelo): la célula diana en corte, con su membrana de doble capa
   (las «cuentas» de la Fig. 52.4), sus receptores como **cerraduras con forma** y el fármaco como **llaves de oro** que
   llegan desde el capilar, encajan con un muelle (Motion) y encienden la cerradura. Los antagonistas son **tapones
   oscuros** con una barra: entran, se quedan y las llaves rebotan. Dentro, la cascada baja hasta el **efecto que se
   ve**: la célula lisa se acorta y la luz de la arteriola se estrecha (el diámetro se anima); el miocito acorta sus
   sarcómeros y el monitor sube el IC; el mastocito cierra o suelta sus gránulos.
5. **Interruptor de la cascada: Fácil | Completa** (lo pidió el usuario: «fácil y completamente»):
   - **Fácil** (3 pasos): «La llave encaja» → «La célula recibe la orden» → «El efecto». Sin siglas.
   - **Completa**: la cadena con nombres (Gs → adenilato ciclasa → AMPc → proteína cinasa → canal de Ca²⁺ →
     proteínas contráctiles; Gq → IP₃/DAG → Ca²⁺; GMPc; canal de K⁺…). Cada nodo se toca y dice una línea con su chip de
     origen (`ficha · T p. 11`, `fisiología general`, `Manual UMI`).
   - **Paso a paso** (lo que hoy son los receptores animados): ▶ Reproducir, ◀ ▶, con Motion; «reducir movimiento»
     enseña el estado final.
6. **Frase viva** (2 líneas) + botón **«Explícame este estado»** (`core/explicacion-guiada.js`, §7.10).
7. **La ficha del fármaco** (plegable, cerrada por defecto): Dosis por tramos · Para qué · Efectos adversos · Notas
   (discrepan / la fuente no lo dice / opinión del autor, REGLAS §1.13) · **«Ver en la ficha»** en cada cifra (§7.9) ·
   una línea aparte **«Otra fuente: Manual UMI»** con su chip y su enlace (nunca fundida, §7.11 y CLAUDE §2).
8. **Así lo dibuja el libro**: la Fig. 52.4 real (`js/modules/libros/img/mar-fig52-4-glucagon.jpg`) junto al miocito
   vivo; la Tabla 14.4, la 16.3 y la 17.5 como enlaces.

### 2.2 Dirección artística (para que el usuario elija en la maqueta)

- **A · Grabado crema y oro** (la familia del vaso que sangra y el río y mar): células en tinta crema con trama fina,
  llaves de oro, cerraduras en los acentos de la paleta. Coherente con todo Marino.
- **B · Microscopio de fluorescencia**: fondo `--bg-main` muy oscuro, la membrana como un halo tenue y cada receptor
  «marcado» como en una inmunofluorescencia (se ilumina cuando una llave entra). Más espectacular; mismos tokens.
- En las dos: **solo tokens de `css/variables.css`** (hoy `receptores-animados.js` usa hex propios: se corrige) y
  rótulos ≥7,5 px a 390 (REGLAS §2.8). Recordatorio de color: `--accent-blue` es dorado; la identidad va por forma.

### 2.3 Formas (una sola tabla para toda la app)

Se añaden a la tabla única de formas (`js/data/formas-iones.js`, «iones y moléculas», dibujada por `core/particulas.js`)
como especies nuevas, para que una llave tenga la misma forma en este modelo, en la cabecera del shock y en el corazón
eléctrico. La cerradura es el negativo de su llave:

| Receptor (cerradura) | Forma | Llaves que encajan (peso en §4) |
|---|---|---|
| α₁ | muesca triangular | NA, adrenalina, dopamina >10, fenilefrina, midodrina; tapón: fentolamina, labetalol |
| β₁ | muesca semicircular | NA (débil), adrenalina, dopamina 3-10, dobutamina; tapón: esmolol, metoprolol, labetalol |
| β₂ | muesca cuadrada | adrenalina, dobutamina (débil, Manual UMI), albuterol |
| V₁ (y V₂, V₃) | hexágono | vasopresina |
| Angiotensina | pentágono | angiotensina II (receptor: `fisiología general`) |
| Dopaminérgico | estrella | dopamina ≤3 |
| Glucagón | óvalo | glucagón |
| H₁ / H₂ | cruz | histamina; tapón: difenhidramina (H₁), ranitidina (H₂) |
| Sin cerradura | — | milrinona (frena la PDE, dentro), levosimendán (pinza en el miofilamento y canal de K⁺), nitratos (GMPc), calcioantagonistas (cierran el canal de Ca²⁺) |

---

## 3. Las células y lo que pasa dentro

| Célula (lupa) | Receptores y dianas | Cascada fácil | Cascada completa (origen) | Efecto que sale → monitor |
|---|---|---|---|---|
| **Arteriola** (músculo liso), con tres **lechos** en chips: piel y músculo · riñón e intestino · coronaria | α₁, V₁, angiotensina, β₂, dopaminérgico (solo riñón e intestino), canal de K⁺, canal de Ca²⁺, GMPc | encaja → la célula se aprieta (o se suelta) → la luz se estrecha (o se abre) | Gq → IP₃/DAG → Ca²⁺ → contracción (`fisiología general`, como el diagrama actual); Gs → AMPc → relajación (`fisiología general`); NO → GMPc → relajación (**Manual UMI**, `#umi-vasoactivos`; Marino calla); canal de K⁺ del levosimendán (S p. 44, ver hueco 9) | IRVS y PAM. Por lecho: vasopresina aprieta más piel, músculo y esplácnico (S p. 15); fenilefrina, riñón e intestino sin riego (S p. 15); adrenalina, hipoperfusión esplácnica (S p. 14); levosimendán dilata coronarias (S p. 44); nitroprusiato «roba» flujo coronario (C p. 10) |
| **Vena** | α₁ (venoconstricción), dianas de los nitratos | se aprieta → más sangre vuelve / se afloja → menos | el mismo músculo liso; vaso de capacidad (`fisiología general`) | PVC/PCP y precarga: NTG y nitroprusiato dilatan venas y arterias: precarga y poscarga ↓ (C p. 9). Ojo, IAM del VD: el efecto venodilatador de la NTG es contraproducente (C p. 46) |
| **Corazón · miocito** (la Fig. 52.4 viva) | β₁, receptor de glucagón, PDE, canal de Ca²⁺, miofilamentos | encaja → se fabrica la señal → entra calcio → empuja más | β y glucagón → adenilato ciclasa → ATP → AMPc → proteína cinasa → abre el canal de Ca²⁺ → proteínas contráctiles; la PDE degrada el AMPc; betabloqueantes, calcioantagonistas y milrinona, donde dibuja el libro (**T p. 10-12**, `#mar-img-52-4`, `#mt-glucagon-mecanismo`, `#mt-ipde`); milrinona: «más entrada de Ca²⁺ mediada por AMPc» (S p. 44); levosimendán sensibiliza los miofilamentos al Ca²⁺ (S p. 44) | VS e IC. Consumo de O₂ ↑ con la dobutamina (S p. 43); no con el levosimendán (S p. 44) |
| **Corazón · nodo** | β₁, canal de Ca²⁺ | encaja → late más deprisa (o más despacio) | `fisiología general`; la conducción AV y la adenosina, en el **corazón eléctrico** (enlace) | FC. Dobutamina +5-15 lpm (S p. 43); diltiazem y betabloqueantes la frenan (C p. 22-24) |
| **Mastocito** (y basófilo) | receptor β, receptores H₁/H₂ de la histamina en su diana | la adrenalina encaja → los gránulos se quedan dentro | «la adrenalina bloquea la liberación de mediadores» por receptores β; el betabloqueante la atenúa o la anula (S p. 65-66). **Cómo restaura el glucagón la respuesta aquí: la fuente no lo dice** (remite al cap. 52, que lo explica en el corazón) | Lo que el monitor ve: la PA cae menos, la fuga capilar (hasta el 35 %, S p. 67) se ve en el río y mar `fuga-35` (enlace) |
| **Leucocito** (lupa pequeña, opcional) | receptores adrenérgicos | la NA se une → el leucocito se activa menos | supresión de la activación por productos bacterianos (S p. 13); citocinas suprimidas (S p. 61) | ninguna cifra: una frase y la nota «significado clínico incierto» |
| **Riñón** e **hipófisis** (iconos, sin lupa propia) | V₂ (túbulo distal), dopaminérgico; V₃ (ACTH) | — | V₂: reabsorción de agua; V₃: ACTH (S p. 15); la angiotensina II libera vasopresina (S p. 16); la furosemida IV libera renina → angiotensina II (C p. 10) | Enlaces: nefrona viva `furosemida`; desmopresina (V₂ sin efecto vasoconstrictor, `#mr-desmopresina-di`) |

---

## 4. Ficha por fármaco (lo que lleva `vasoactivos-data.js`; cada cifra con su página y su «Ver en la ficha»)

Peso del receptor: 0-3 (nulo, leve, moderado, intenso), **lectura cualitativa del texto** («principal», «débil»,
«puro»), rotulada así en pantalla, como hoy. Si una fila no tiene cifra en la fuente, dice **«la fuente no lo dice»**.

### 4.1 Vasopresores (ficha 2 `mc-vasopresores`, Tabla 14.4, S p. 13)

| Fármaco | Receptores y peso por dosis | Dosis por tramos (página · «Ver en la ficha») | Función clínica | Efectos adversos | Otra fuente / notas |
|---|---|---|---|---|---|
| **Noradrenalina** | α₁ principal + «β débil» (S p. 12). <10 µg/min: β₁ 2, α₁ 1 · 10-30: α₁ 3, β₁ 1 · >30: igual (techo) | Sin carga; inicio 5-10 µg/min (S p. 13); rango 5-40 (Tabla 14.4) · <10: el β puede subir el gasto · >10: predomina α · **30: techo → 2.º vasopresor** (S p. 13) `#mc-norepinefrina` · Cardiogénico: 5 µg/min (0,05 µg/kg/min), +cada 5 min; 5-30 (0,05-0,5) (S p. 43) `#mc-cs-vasopresor` · Séptico: inicial de elección; vasopresina si 0,25-0,5 µg/kg/min = 18-35 µg/min en 70 kg (S p. 60) `#mc-tabla-17-2` | El más usado; preferido en el séptico (S p. 12) y en el cardiogénico (menos arritmias y menos muertes que adrenalina y dopamina, S p. 43); el de la hipotensión del TEP: no sube la resistencia pulmonar (R p. 11) `#nep-hemodinamica`; posparo, preferida a la adrenalina (C p. 66) `#mc-tabla-21-4` | Isquemia (miocardio, cerebro, miembro) y arritmias (taqui y bradi) en ~10 %, quizá por el shock (S p. 13) · Inmunosupresión: receptores de los leucocitos (S p. 13; S p. 61) `#mc-seguridad-na` · Extravasación → fentolamina (S p. 12) `#mc-extravasacion` | Marino: «β débil» y «podría explicar por qué no daña el riñón» (S p. 12, **falta en la ficha**: hallazgo a). **Manual UMI**: β₁ y α, **sin β₂**; 0,2-1,3 µg/kg/min; 10 mg en 100 mL (`#umi-vasoactivos`): **las fuentes discrepan** en el rango (nota). Umbral de vasopresina: ≥0,2 (cap. 14, S p. 15) frente a 0,25-0,5 (cap. 17, S p. 60): nota de fuentes que ya existe `#mc-nota-epinefrina-linea` |
| **Adrenalina** | β potente + α (S p. 13-14): β₁ 3, β₂ 2, α₁ 2, «creciente con la dosis» | Séptico: sin carga, 0,1 → máx. 0,5 µg/kg/min (S p. 14) `#mc-epinefrina` · Anafilaxia: 0,3-0,5 mg IM (1:1.000) en el muslo cada 5-15 min · shock anafiláctico 5-15 µg/min (1:100.000) ± bolo de 10 µg IV · laringe 2,5 mg nebulizada (1:100) · parada 1 mg IV (1:10.000) cada 3-5 min (Tabla 17.5, S p. 65-67) `#mc-tabla-17-5` | Elección en la anafilaxia: **el único que para la reacción** (S p. 65); 2.ª línea en el séptico (cap. 14) o **3.ª** (cap. 17): nota existente; RCP: el α sube la presión de perfusión coronaria un 30 % (C p. 61-62) `#mc-epinefrina-paro` | Taquicardia y arritmias; hipoperfusión esplácnica (α); metabolismo ↑; **hiperglucemia** (α inhibe la insulina); **lactato ↑ por producción aeróbica**, engañoso (S p. 14). En la RCP, el β puede borrar el beneficio y se asocia a fallo cardíaco posresucitación (C p. 62) | Marino **no da el corte de dosis β/α** («la fuente no lo dice»). **Manual UMI**: efecto β 1-4 µg/min, α >20 µg/min; β₂ vasodilata músculo y coronaria (`#umi-vasoactivos`). Se muestra con su chip, no como cifra de Marino. Falta en la ficha «aumento del metabolismo» (hallazgo d) |
| **Dopamina** | ≤3 µg/kg/min: dopaminérgico 3 (riñón y esplácnico) · 3-10: β 3 · >10: α 3, β 1 (S p. 14) | Inicio 5; 5-10 sube el gasto; >10 para la PA; beneficio 5-20; hasta 50 o más (S p. 14) `#mc-dopamina` | Hoy en desuso en el séptico y el cardiogénico (S p. 14) | **Taquiarritmias (p. ej. FA)**, más que con otros vasopresores (S p. 14) · el α >10 sube la poscarga y **puede revertir** la subida del VS · **presión intraocular ↑ a 1-4 µg/kg/min** (S p. 15) | El subtipo D₁: `fisiología general` (Marino: «receptores específicos de dopamina»; Manual UMI: D₁-D₅). **Trampa a no rellenar**: «la dosis renal protege el riñón»: la fuente solo dice que sube el flujo regional |
| **Fenilefrina** | α₁ 3 puro (S p. 15) | Anestesia: bolo 50-100 µg (repetible 1 vez) → 10-35 µg/min, máx. 200 µg/min · Séptico: sin bolo, 0,5 µg/kg/min; >6 no añade (S p. 15) `#mc-fenilefrina` | Hipotensión de la anestesia. **No recomendada** en ningún shock (S p. 15); **más apropiada** que la NA en el cardiogénico por **obstrucción dinámica del TSVI** (S p. 42) `#mc-cs-vasopresor`; útil en el séptico con **FA rápida** (**opinión del autor**, S p. 15); 2.º vasopresor en la anafilaxia refractaria (S p. 67) | **Bradicardia** (refleja, S p. 42), **VS ↓** (con disfunción cardíaca), **hipoperfusión de riñón e intestino** (S p. 15: **falta en la ficha**, hallazgo a) | Manual UMI: «agonista selectivo de α₁». Pancreatitis: todos reducen el flujo esplácnico, **sobre todo la fenilefrina** (Marino abdomen, enlace `ma-pancreatitis-tto`) |
| **Vasopresina** | V₁ 3 (músculo liso) · V₂ (túbulo distal: agua) · V₃ (hipófisis: ACTH) (S p. 15) | Séptico resistente a NA: **0,03-0,04 U/min, no se titula** (S p. 16); Tabla 14.4: 0,01-0,04 · Parada: 40 U única en lugar de la 1.ª o 2.ª adrenalina (S p. 15) `#mc-vasopresina` | 2.º agente en el séptico; sube la PA y **ahorra catecolamina**; sin beneficio probado de supervivencia (S p. 15); **no evaluada en la anafilaxia** (S p. 67) | Como la NA, en tipo y frecuencia (S p. 16) | **Errata de unidad**: el libro imprime «U/h» → nota existente `#mc-nota-vasopresina-unidades`. Aprieta más piel, músculo y esplácnico; **no sube la PA en sanos**, sí en el shock vasodilatador (S p. 15: **falta en la ficha**, hallazgo b). Terlipresina (análogo) en el SHR: enlace `#ma-shr-tto` |
| **Angiotensina II** | receptor de angiotensina del músculo liso 3 (el nombre AT₁: `fisiología general`) + libera vasopresina (S p. 16) | 20 ng/kg/min (0,02 µg/kg/min), +cada 10-15 min hasta 80 (0,08) en 3 h; mantenimiento ≤40 (0,04); sin ajuste (S p. 16) `#mc-angiotensina` | Shock vasodilatador resistente a NA (aprobada en 2018); sube la PA en hasta el 67 %; mortalidad inconsistente (S p. 16) | **Trombosis venosa**: PAI-1 del músculo liso (bloquea la fibrinólisis) + adhesión plaquetaria; 13 % frente a 5 % (S p. 16) | Se dibuja: la llave libera una segunda llave (vasopresina) desde la hipófisis y una «tijera rota» de la fibrinólisis (enlace al telar/vaso) |
| **Midodrina** | α₁ 2, oral (S p. 16) | Diálisis: 5-20 mg 20-30 min antes; adyuvante 20 mg/8 h (S p. 16) `#mc-midodrina` | Hipotensión de la diálisis; **no acelera** la retirada de vasopresores; ninguna ventaja en el shock (S p. 16) | La fuente no los da | — |

### 4.2 Inotrópicos (ficha 7 `mc-cardiogenico-farmaco`, Tabla 16.3, S p. 43-44)

| Fármaco | Receptores y peso | Dosis (página · id) | Función | Efectos adversos | Notas |
|---|---|---|---|---|---|
| **Dobutamina** | β₁ 3 (S p. 43); vasodilatación leve (receptor: Manual UMI, β₂ débil) | 3-5 µg/kg/min, +3-5; habitual 3-20 (S p. 43) `#mc-dobutamina` | El inotrópico más usado en el cardiogénico; **preserva la PA** porque el VS compensa la vasodilatación (S p. 43). TEP intermedio con PA normal; **sola con hipotensión, no** (R p. 11) | **FC +5-15 lpm, puede >30**; consumo de O₂ ↑; más trabajo cardíaco (S p. 43). **Contraindicada** (todo inotrópico) en la obstrucción dinámica del TSVI (S p. 43) | Manual UMI: 3-15 µg/kg/min; contraindicada en la miocardiopatía hipertrófica (otra fuente, chip) |
| **Milrinona** | sin cerradura: frena la **PDE** → AMPc ↑ → Ca²⁺ (S p. 44; T p. 11-12); vasodilata | 50 µg/kg en 10 min → 0,375-0,75 µg/kg/min; ≤1,13 mg/kg/día; ClCr 50/40/30/20 → 0,43/0,38/0,33/0,28 (S p. 43-44) `#mc-milrinona` · `#mc-tabla-16-3` | Inotropismo como la dobutamina con **menos taquicardia**; mejor en la IC descompensada **sin hipotensión** (S p. 44). **Funciona con el β bloqueado** (T p. 12, `#mt-ipde`) | **Hipotensión** (S p. 44); semivida 2,5 h que se alarga en la IR (S p. 44) | Conversor de ajuste renal en el mando |
| **Levosimendán** | sin cerradura: **sensibiliza los miofilamentos al Ca²⁺** + canal de K⁺ del músculo liso (S p. 44) | 12 µg/kg en 10 min → 0,1 µg/kg/min; a la hora, 0,2 (S p. 44) `#mc-levosimendan` | Atractivo en el cardiogénico del infarto: **dilata coronarias y no sube el consumo de O₂**; beneficio de mortalidad frente a dobutamina (S p. 44) | **Hipotensión**; semivida 80 h, infusión **limitada a 24 h**; no aprobado en EE. UU. (S p. 44) | **Hueco 9**: «facilitating potassium influx» (S p. 44) |

### 4.3 Vasodilatadores (fichas 14 `mc-ic-manejo`, 20 `mc-sca-tratamiento`, 21 `mc-diseccion-aortica`)

| Fármaco | Diana | Dosis (página · id) | Función | Efectos adversos | Notas |
|---|---|---|---|---|---|
| **Nitroglicerina** | arteria y vena (C p. 9); el mecanismo NO → GMPc: **Manual UMI** | IC: 5 µg/min, +5 cada 5 min; 5-100; **>200 no** (C p. 9) `#mc-tabla-18-3` · SCA: 0,4 mg SL cada 5 min ×3; infusión 5 µg/min (C p. 46) `#mc-tabla-20-3` | Elección en la IC aguda **hipertensiva**: precarga y poscarga ↓, PA ↓, gasto ↑ (C p. 9); dolor del SCA (mecanismo «poco claro», C p. 46) | Taquifilaxia a las 24 h; propilenglicol (acidosis láctica, delirio, hipotensión, FMO); metahemoglobina a dosis muy altas (C p. 9-10) · **80 % se pierde en el PVC**: vidrio y polietileno (C p. 9) · No en IAM del VD, estenosis aórtica grave ni 24-48 h tras un inhibidor de la PDE (C p. 46) | Manual UMI: <40 µg/min venoso, 40-200 mixto, >200 arterial (otra fuente, chip; Marino no da tramos) |
| **Nitroprusiato** | arteria y vena; donador de NO (**Manual UMI**) | 0,2 µg/kg/min, cada 5 min; 2-5; máx. 10; evitar >3 prolongado; tiosulfato 500 mg (C p. 9-10; C p. 52) `#mc-nitroprusiato` | El 20 % resistente a la NTG (C p. 10); disección, **siempre con betabloqueante** (C p. 52) | **Cianuro** (5 átomos; hígado y riñón: no en IR ni IH); **robo coronario**: no en cardiopatía isquémica (C p. 10) | Enlace a la intoxicación por cianuro `mt-cianuro` |
| **Nicardipino** | canal de Ca²⁺ del músculo liso (calcioantagonista: `fisiología general`; Marino: «vasodilatador») | 5 mg/h, +2,5 cada 5 min, máx. 15 (C p. 52) `#mc-tabla-20-5` | Disección: **solo junto a un betabloqueante** (C p. 52) | Sin betabloqueo: taquicardia refleja (barorreflejo del motor: `fisiología general`); la ficha pide no subir FC ni gasto (C p. 52) | Estado `diseccion` (§5) |
| **Furosemida IV** (diana indirecta) | célula yuxtaglomerular → renina → angiotensina II → su receptor del músculo liso (C p. 10) | 40 mg (60-80 en IR)… (C p. 11) `#mc-furosemida` | Congestión, **después** del vasodilatador si la PA era alta (C p. 10) | En la IC aguda: **vasoconstricción** y **gasto ↓** (retorno ↓ + poscarga ↑) (C p. 10-11); cuidado en la HFpEF | La nefrona viva `furosemida` hace el resto (enlace) |

### 4.4 Frenos del corazón (fichas 16 `mc-fa-frecuencia`, 20, 21)

| Fármaco | Diana | Dosis (página · id) | Función | Efectos adversos | Notas |
|---|---|---|---|---|---|
| **Esmolol** | tapón β₁ (cardioselectivo, C p. 24) | 500 µg/kg en bolo → 50 µg/kg/min, +25 cada 5 min, máx. 200 (C p. 23; C p. 51: **bolo antes de cada subida**) `#mc-tabla-19-1` `#mc-tabla-20-5` | FA rápida (70 % de éxito con betabloqueo; mejor en estados hiperadrenérgicos, C p. 24); **betabloqueante preferido en la disección** por titulable; semivida **9 min** (C p. 24, 52) | Hipotensión, inotropismo negativo (C p. 23); **no en la IC aguda** (C p. 51) | — |
| **Metoprolol** | tapón β₁ (C p. 24) | FA: 2,5-5 mg en 2 min, hasta 3 dosis (C p. 23) · Disección: 5 mg ×3, luego 5-10 cada 4-6 h (C p. 52) · SCA: Tabla 20.3 (C p. 46: **la misma pauta que la morfina**, nota existente) | FA, disección (betabloqueo inicial), SCA | PAS <120: riesgo de shock cardiogénico; **contraindicado en la isquemia por cocaína: vasoconstricción α sin oposición** (C p. 47) | Estado `cocaina` (§5) |
| **Labetalol** | tapón α₁ y β (C p. 52) | 20 mg en 2 min → 20-40 cada 10 min o 1-2 mg/min; máx. 300 mg (C p. 52) | Disección en monoterapia | No en la IC aguda (C p. 52) | — |
| **Diltiazem** | canal de Ca²⁺ (calcioantagonista, C p. 23) del nodo y del miocito | 0,25 mg/kg en 2 min → 5-15 mg/h (C p. 22) | El más usado en la FA: control en 1 h en el 55 %, mantenido hasta en el 90 % (C p. 23) | **Hipotensión 20-30 %**; inotropismo negativo: limita en la HFrEF (C p. 23) | En la Fig. 52.4, los calcioantagonistas cierran el canal (T p. 11) |
| **Amiodarona** | sin cerradura en este modelo (antiarrítmico clase III, C p. 24) | 150 mg en 10 min → 1 mg/min 6 h → 0,5 mg/min 18 h; ≤2,2 g/24 h (C p. 23) | FA con resistencia o intolerancia; HFrEF (C p. 24) | Hipotensión por el **disolvente** (polisorbato 80), no por el fármaco (C p. 24); QT; interacciones con digoxina y warfarina (C p. 25) | Vive en el corazón eléctrico; aquí, una tarjeta «sin receptor» que enlaza |

### 4.5 Antídotos y ayudantes

| Fármaco | Diana | Dosis (página · id) | Función | Efectos adversos / notas |
|---|---|---|---|---|
| **Fentolamina** | tapón α₁ «de acción larga» (S p. 12) | 5-10 mg en 10 mL de salino **en la zona**; **antes de 12 h** (S p. 12) `#mc-extravasacion` | Extravasación de un vasoconstrictor: el blanqueo desaparece casi enseguida (S p. 12) | Antes: parar, aspirar sin lavar, retirar (S p. 12) |
| **Glucagón** | su propio receptor → la misma adenilato ciclasa (T p. 10-11) | Anafilaxia en betabloqueado: **1-5 mg IV en 5 min + 5-15 µg/min** (S p. 66) `#mc-glucagon` · Intoxicación por betabloqueantes: **otra pauta** (bolo 3-5 mg, perfusión 5 mg/h, T p. 11-12) `#mt-glucagon-mecanismo` | Rescata la respuesta cuando el β está tapado | **Vómitos**: de lado si está obnubilado (S p. 66). **Cifras en su contexto** (§1.12): la pauta de la anafilaxia no es la de la intoxicación |
| **Hidrocortisona** | sin cerradura dibujada | 50 mg/6 h si NA (o adrenalina) **≥0,25 µg/kg/min** (texto, S p. 61) o **>0,25** (Tabla 17.2, S p. 60): nota de fuentes; ~7 días (S p. 61) `#mc-corticoides` | **Facilita la respuesta vasoconstrictora a las catecolaminas** y es antiinflamatoria (S p. 61); acorta 1,5 días el shock sin mejorar la supervivencia (S p. 61) | Cómo facilita la respuesta: **la fuente no lo dice** (se dibuja solo el efecto: la misma dosis de NA da más PAM, `ilustrativo`). En la anafilaxia: **ningún papel** agudo (S p. 66) |
| **Difenhidramina / ranitidina** | tapón H₁ / H₂ | 25-50 mg VO, IM o IV / 50 mg IV o 150 mg VO (S p. 66) `#mc-segunda-linea` | Prurito y rinorrea; la combinación, mejor; **no cambian el curso** (S p. 66) | Eficacia no probada (S p. 66) |
| **Albuterol** | β₂ del bronquio | 2,5 mL de solución al 0,5 % nebulizada o inhalador (S p. 66) | Broncoespasmo de la anafilaxia | — |

**Fuera del modelo, con enlace**: adenosina, verapamilo, digoxina, magnesio (corazón eléctrico); morfina (C p. 46);
antitrombóticos (vaso que sangra). La adenosina sí «relaja el músculo liso vascular» y la teofilina «bloquea sus
receptores» (C p. 29-30): si el corazón eléctrico la dibuja, usa esta misma tabla de formas.

---

## 5. Mandos, estados con nombre y explicación guiada

### 5.1 Mandos (dock fijo abajo, como la cabecera; toques ≥44 px)

- **Fármaco** (chips por familia: Vasopresores · Inotrópicos · Vasodilatadores · Frenos · Antídotos y ayudantes).
- **Dosis**: una **bomba de perfusión** dibujada (pantalla de la bomba con la cifra y su unidad) y un deslizador con los
  **tramos pintados** de la fuente (NA: 5 · 10 · 30 · 40; dopamina: 3 · 10 · 20 · 50; NTG: 5 · 100 · 200 «no»). Debajo,
  el **conversor** µg/min ↔ µg/kg/min con el peso del paciente (60-120 kg). Botón **Bolo** donde la fuente lo da
  (fenilefrina 50-100 µg, adrenalina 10 µg, glucagón, esmolol 500 µg/kg, milrinona 50 µg/kg, levosimendán 12 µg/kg).
  **Vasopresina: el deslizador sale bloqueado** con el candado «dosis fija: no se titula» (S p. 16): el mando enseña.
- **+ Segundo fármaco**: una segunda bomba; las dos llaves tienen forma distinta y el monitor suma sus efectos.
- **Paciente de fondo**: Sano · Shock séptico · Shock cardiogénico · Obstrucción dinámica del TSVI · Anafilaxia ·
  Anafilaxia con betabloqueante · IC hipertensiva · Disección · FA rápida · TEP de alto riesgo. Las cifras de base son
  las anclas de la cabecera del shock (pieza común 5): **un solo motor**.
- **Fácil | Completa** y **▶ Paso a paso** (cascada) · **Explícame este estado**.

### 5.2 Estados con nombre (cada uno: frase viva + 3-5 pasos guiados que señalan el dibujo, cada paso con «Ver en la ficha»)

| Estado | Mandos | Pasos guiados (lo que señala · cita) | Frase viva |
|---|---|---|---|
| `na-baja` | Séptico · NA 8 µg/min | 1 las llaves llegan a dos células (anillo en arteriola y corazón) · 2 en el miocito encajan en β₁: sube el IC (fila IC; `#mc-norepinefrina`, S p. 13) · 3 en la arteriola, pocas en α₁: la luz apenas cambia · 4 la PAM sube poco | «Por debajo de 10, la NA empuja más que aprieta: el gasto sube.» |
| `na-alta` | Séptico · NA 25 | 1 las cerraduras α₁ de la arteriola se llenan · 2 la célula lisa se acorta y la luz se estrecha · 3 IRVS y PAM suben a 65 (fila PA; S p. 13; `#mc-vaso-pam`, S p. 12) · 4 el β₁ sigue, pero ya no manda | «Por encima de 10 manda el α: sube la RVS y la PAM llega a 65.» |
| `na-techo` | Séptico · NA 30 → 40 | 1 todas las cerraduras α₁ ocupadas (`ilustrativo`: la imagen; la cifra, S p. 13) · 2 subir la bomba no cambia la luz · 3 «a 30, segundo vasopresor» (S p. 13) · 4 aviso: sin beneficio de supervivencia demostrado (S p. 12) | «A 30 ya no hay más respuesta: otra puerta, no más llave.» |
| `na-vasopresina` | NA 25 + vasopresina | 1 entra otra llave, hexagonal, en V₁ · 2 la misma célula se aprieta por otra vía (`#mc-vasopresina`, S p. 15) · 3 la bomba de la vasopresina, con su candado (S p. 16) · 4 la NA puede bajar: ahorro de catecolamina (S p. 15) · 5 nota de la unidad (U/h) | «Dos puertas, una sola contracción. La vasopresina no se titula.» |
| `vasopresina-sano` | Sano ↔ Séptico, vasopresina | 1 en el sano la PA no se mueve · 2 en el vasodilatado sí (S p. 15) · 3 aprieta más en piel, músculo y esplácnico (chip del lecho) | «La vasopresina sube la PA del que está abierto, no la del sano.» |
| `dopamina-tramos` | Dopamina 2 → 7 → 15 | 1 ≤3: estrella en la arteriola del riñón e intestino (lecho) · 2 3-10: β₁ del miocito, sube el VS · 3 >10: α₁, sube la RVS y el VS puede volver a caer (S p. 14) · 4 la FA del monitor: taquiarritmias (S p. 14) | «Tres fármacos en uno según la dosis, y con más arritmias que los demás.» |
| `adrenalina` | Séptico · adrenalina 0,1 → 0,5 µg/kg/min | 1 llaves en α₁, β₁ y β₂ a la vez (S p. 13) · 2 FC, VS y PA suben · 3 se encienden **lactato** y **glucemia** (S p. 14) · 4 el lecho esplácnico se aprieta (S p. 14) · 5 nota: el corte β/α no lo da Marino; el Manual UMI, sí (chip) | «Sube todo, también el lactato: no lo leas como hipoperfusión.» |
| `fenilefrina` | Sano · fenilefrina bolo 100 µg | 1 solo α₁ (S p. 15) · 2 la PA sube · 3 la FC baja: reflejo (S p. 42) · 4 lecho riñón e intestino sin riego (S p. 15) | «Aprieta y nada más: por eso la FC baja.» |
| `fenilefrina-tsvi` | Obstrucción dinámica del TSVI · fenilefrina ↔ dobutamina | 1 con dobutamina, la FC sube y la PA cae (inotrópicos **contraindicados**, S p. 43) · 2 con fenilefrina, sube la poscarga y baja la FC (S p. 42) · 3 la eco del TSVI no está en el motor (hueco 5 de la cobertura): se dice | «En la obstrucción del TSVI, apretar ayuda y empujar estorba.» |
| `angiotensina` | Séptico · NA 30 + angiotensina II | 1 pentágono en su receptor · 2 desde la hipófisis sale vasopresina (S p. 16) · 3 PAI-1: la fibrinólisis se frena (13 % frente a 5 %, S p. 16) | «Sube la PA en dos de cada tres, a cambio de trombos.» |
| `dobutamina-cardiogenico` | Cardiogénico · NA 5 + dobutamina 5 µg/kg/min | 1 β₁ del miocito: AMPc, Ca²⁺, más fuerza (Fig. 52.4) · 2 IC sube; la PA se mantiene (S p. 43) · 3 la FC +5-15 · 4 el consumo de O₂ sube: puente corto, no retrasar el soporte (S p. 44) | «Empuja más fuerte y más deprisa, y gasta más oxígeno.» |
| `milrinona` | Cardiogénico · milrinona | 1 no hay llave: la PDE se queda sin tijera (S p. 44; T p. 11) · 2 el AMPc se acumula y entra Ca²⁺ · 3 la arteriola se abre: la PAM baja (S p. 44) · 4 el ajuste por ClCr (Tabla 16.3) | «Fuerza sin taquicardia, pero baja la PA.» |
| `levosimendan` | Cardiogénico · levosimendán | 1 pinza en los miofilamentos: más fuerza con el mismo Ca²⁺ (S p. 44) · 2 canal de K⁺ del músculo liso: vasodilata (con la nota del hueco 9) · 3 lecho coronario: se abre · 4 consumo de O₂ sin cambios; 24 h pese a 80 h de semivida | «Más fuerza sin gastar más oxígeno; ojo con la PA.» |
| `anafilaxia` | Anafilaxia · adrenalina IM 0,5 mg | 1 el mastocito suelta gránulos · 2 la adrenalina encaja en su β y los gránulos se quedan (S p. 65) · 3 el antihistamínico tapa H₁/H₂ en la diana: alivia, no para (S p. 66) · 4 la fuga capilar (enlace río y mar `fuga-35`) | «Solo la adrenalina para la reacción; lo demás alivia.» |
| `anafilaxia-betabloqueo` | Anafilaxia con betabloqueante · adrenalina → glucagón | 1 los β del mastocito y del miocito, tapados: la adrenalina rebota (S p. 66) · 2 entra el glucagón por su propia puerta del miocito (T p. 10-11, `#mt-glucagon-mecanismo`) · 3 en el mastocito: «cómo lo hace aquí, la fuente no lo dice» · 4 vómitos: de lado (S p. 66) | «Con el β tapado, el glucagón entra por otra puerta.» |
| `extravasacion` | Vía periférica · NA → fentolamina | 1 la NA sale de la vena: la piel se blanquea (α₁ de la arteriola de la piel) · 2 parar, aspirar sin lavar, retirar · 3 la fentolamina tapa los α₁: el blanco desaparece (S p. 12) · 4 antes de 12 h | «Un tapón para el α que se escapó: fentolamina en la zona.» |
| `ic-hipertensiva` | IC hipertensiva · NTG 5 → 60 µg/min · (+ furosemida) | 1 la vena se afloja: PCP baja · 2 la arteriola se afloja: poscarga baja, IC sube (C p. 9) · 3 la bolsa de PVC se «come» el 80 % (C p. 9) · 4 con furosemida antes de tiempo: renina → angiotensina → la arteriola se aprieta y el IC baja (C p. 10-11) | «Primero el vasodilatador; el diurético, cuando la PA ya está controlada.» |
| `diseccion` | Disección · nicardipino solo ↔ esmolol primero | 1 nicardipino solo: la PA baja y la FC sube (barorreflejo, `fisiología general`) · 2 la ficha: ni taquicardia ni más gasto (C p. 52) · 3 esmolol tapa β₁: la FC baja · 4 con el β tapado, el nicardipino ya no acelera; objetivo PAS 120 (C p. 52) | «Primero frena el corazón; luego abre los vasos.» |
| `fa-rapida` | FA rápida · diltiazem ↔ esmolol | 1 diltiazem cierra el canal de Ca²⁺ del nodo y del miocito (C p. 23; T p. 11) · 2 la FC baja y la PA puede caer (20-30 %) · 3 esmolol: tapón β₁, titulable en minutos (C p. 24) | «Dos frenos distintos, el mismo riesgo: la hipotensión.» |
| `cocaina` | Isquemia por cocaína · metoprolol | 1 los β₁ y los β₂ tapados · 2 el α₁ queda solo: la arteriola, incluida la coronaria, se aprieta (C p. 47) · 3 por eso está contraindicado (`#mc-tabla-20-3`) | «Tapar el β deja al α sin nadie enfrente.» |
| `tep-hipotenso` | TEP de alto riesgo · NA ↔ dobutamina | 1 NA: sube la PA sin subir la resistencia pulmonar (R p. 11) · 2 dobutamina sola: vasodilata, la PA cae (R p. 11) · 3 con PA normal, la dobutamina se considera (R p. 11) | «En el TEP hipotenso, NA; la dobutamina, nunca sola.» |

Cada estado guarda sus fuentes como **lista** (`[{ libro: 'Marino', pdf: 'S', pag: 13, ficha: 'mc-vasopresores', id:
'mc-norepinefrina' }, { libro: 'Manual UMI', ficha: 'umi-vasoactivos' }]`), para que otro libro añada su matiz sin
rehacer el estado (§7.11).

### 5.3 El monitor: dirección de la fuente, magnitud ilustrativa

Cada fármaco mueve las cifras del motor de la cabecera **en la dirección de la ficha** (§4, con su página) y con una
**magnitud ilustrativa rotulada** (hueco 2 de la cobertura). Lo escribe una sola función, `efectoMonitor(farmacos,
paciente)` en `vasoactivos-data.js`, que usan la cabecera y este modelo. **Paciente posible** (prueba nueva,
`autonomo/pruebas/receptor-vivo.mjs`): en 0, el punto medio y el máximo de cada bomba, y en las combinaciones NA 40 +
vasopresina + adrenalina 0,5, fenilefrina 6 µg/kg/min en el sano, esmolol 200 en la disección, nitroprusiato 10 en la IC
hipertensiva y diltiazem 15 mg/h en la FA: **PAM 40-130, FC 40-170, IC 1,2-5, PVC 0-25, PCP 2-35, lactato ≤12, glucemia
≤400**. Si una cifra sale de ahí, se busca el error en su origen (REGLAS §1.7), no se recorta.

---

## 6. ¿Amplía los receptores animados o es nuevo?

**Es un modelo nuevo por concepto que los contiene y los sustituye** (decisión del usuario, parada 1). Razones: el
diagrama actual es una membrana sola con tres receptores y una caja de texto; no tiene células, ni dosis continua, ni
combinaciones, ni monitor, ni efectos adversos, y su conclusión visual es falsa (α₁ y β₁ en la misma célula). Lo que se
queda: el paso a paso con Motion (es la cascada «Completa ▶») y los niveles 0-3 (se mudan a la pieza 4).

**Archivos** (copia la estructura del capilar vivo, CLAUDE §6): `js/modules/cardiologia/receptor-vivo.js` (enganches,
sobre `crearMayeuticaModelo`) + `receptor-vivo-escena.js` (SVG y Motion) + `receptor-vivo.html` (vista con su «←
VOLVER» a la ficha de origen) + `js/data/receptor-vivo-data.js` (estados, guías, Mayéutica, casos) + los datos de
fármacos en `js/data/vasoactivos-data.js` (pieza 4) + prueba `autonomo/pruebas/receptor-vivo.mjs`. Cardiología lo
declara en `modelosVivos: { receptorVivo }`; arranca con `arrancar()` (REGLAS §2.9); tarjeta en «Modelos vivos» de la
portada de Marino. En la ficha 2, la tarjeta «Receptores adrenérgicos» pasa a ser la **puerta**: la célula en miniatura
con la NA puesta y «Abrir el receptor vivo». En la cabecera del shock, la arteriola y el VI de su escena llevan una
**lupa** «Ver en la célula» que abre este modelo con los fármacos que estén puestos.

**Fichas que explicaría** (13 del bloque 3, ~9 fuera):

| Bloque 3 | Qué le da | Fuera del bloque (enlace o estado) | Qué le da |
|---|---|---|---|
| 1 `mc-definiciones` | qué pieza de PAM = GC × RVS + PAD toca cada fármaco | `mt-bzd-betabloq` (Marino 52) | el miocito **es** su Fig. 52.4: glucagón, milrinona, betabloqueo |
| 2 `mc-vasopresores` | **todo** (receptores, tramos, adversos, extravasación) | `mt-cianuro` | el nitroprusiato y su cianuro |
| 7 `mc-cardiogenico-farmaco` | NA, dobutamina, milrinona, levosimendán, TSVI | `ma-pbe-shr` | terlipresina (V₁) y midodrina (α₁) |
| 10 `mc-shock-septico` | NA → vasopresina → adrenalina, hidrocortisona | `ma-pancreatitis-tto` | el lecho esplácnico y la fenilefrina |
| 12 `mc-anafilaxia` | mastocito, adrenalina por vías, glucagón, antihistamínicos | `mr-hipernatremia` | V₂ sin V₁ (desmopresina) |
| 14 `mc-ic-manejo` | NTG, nitroprusiato, furosemida → renina | `umi-vasoactivos` (Manual UMI) | toda la segunda fuente, con su chip |
| 16 `mc-fa-frecuencia` | diltiazem, esmolol, metoprolol | El Libro Azul `cardio-fisiopatologia-fundamental` | NA, vasopresina y renina endógenas en la IC |
| 18 `mc-otras-taqui` | metoprolol y verapamilo (parcial; la adenosina, corazón eléctrico) | Guía ESC IC (`insuficiencia-cardiaca`) | inotrópicos y vasopresores en el shock cardiogénico |
| 20 `mc-sca-tratamiento` | NTG, metoprolol, cocaína | Futuro: unión neuromuscular (mapa de Marino §4.8) | **una célula más** de este modelo, no otro modelo |
| 21 `mc-diseccion-aortica` | esmolol, labetalol, nicardipino, nitroprusiato | | |
| 22 `mc-paro-soporte` | adrenalina α frente a β en la RCP; vasopresina 40 U | | |
| 24 `mc-posresucitacion` | NA preferida a la adrenalina | | |
| 26 `neumo-ep-manejo` | NA y dobutamina en el TEP | | |

---

## 7. Mayéutica del modelo y un caso de muestra

Como decidió el usuario para el vaso (cobertura §11.5): el modelo **usa las preguntas de las fichas** y añade las de
**«predice y compruébalo»** (el monitor tapa la cifra hasta contestar). Cada pregunta lleva `fuente` (ids) para que
el constructor la ponga también en la Mayéutica de su ficha (entre corchetes).

### 7.1 Guía socrática (encadenada, en el orden del modelo)

| # | Formato | Pregunta | Respuesta (página · ficha) |
|---|---|---|---|
| G1 | test, *predice* | NA de 5 a 25 µg/min en un séptico: ¿qué se mueve primero, el IC o la IRVS? (cifras tapadas) | Primero el IC (β <10), luego la IRVS (α >10) · S p. 13 [2] |
| G2 | test | Llegas a 30 y la PAM no se mueve al subir. ¿Por qué no sirve subir más? | No hay más respuesta vasoconstrictora: segundo vasopresor (S p. 13); la imagen de las cerraduras llenas, `ilustrativo` [2] |
| G3 | test, *predice* | Añades vasopresina: ¿por qué funciona si el α ya está al máximo? | Otra cerradura (V₁), misma célula (S p. 15) [2, 10] |
| G4 | test, *predice* | La misma vasopresina a un voluntario sano: ¿qué hace la PA? | Nada; sí en el shock vasodilatador (S p. 15) [2] |
| G5 | test | ¿Por qué la bomba de la vasopresina sale con candado? | No se titula: 0,03-0,04 U/min fijos (S p. 16), con la nota de la unidad [2] |
| G6 | destapa «son tres» | Sube la dopamina de 2 a 15 µg/kg/min: ¿qué cerradura se enciende en cada tramo y qué pasa con el VS al final? | ≤3 dopaminérgico; 3-10 β, sube el VS; >10 α, sube la poscarga y el VS puede caer (S p. 14) [2] |
| G7 | test, *predice* | Adrenalina 0,3 µg/kg/min: ¿qué dos cifras de laboratorio se encienden y por qué no significan hipoperfusión? | Lactato (producción aeróbica) y glucemia (α inhibe la insulina) (S p. 14) [2, 10] |
| G8 | test, *predice* | Fenilefrina en bolo a un sano: ¿qué hace la FC? | Baja (refleja): α puro, sin β (S p. 15, 42) [2] |
| G9 | test, *predice* | Dobutamina en el cardiogénico: vasodilata, ¿por qué no cae la PA? | El VS sube y compensa (S p. 43); FC +5-15 [7] |
| G10 | test, *predice* | Milrinona: no tiene cerradura. ¿Dónde actúa y qué le pasa a la PAM? | Frena la PDE (más AMPc); vasodilata: hipotensión (S p. 44; T p. 11) [7] |
| G11 | test | Anafilaxia con bisoprolol: la adrenalina rebota. ¿Por qué puerta entra el glucagón? | Su receptor propio → la misma adenilato ciclasa (T p. 10-11); en el mastocito, la fuente no lo dice [12] |
| G12 | destapa «son tres pasos» | La piel alrededor de la vía de NA está blanca y fría: ¿qué haces y en qué orden? | Parar, aspirar sin lavar y retirar; fentolamina 5-10 mg en 10 mL en la zona; antes de 12 h (S p. 12) [2] |
| G13 | test, *predice* | Disección: nicardipino solo. ¿Qué hace la FC y por qué es un problema? | Sube (refleja); más cizalla: betabloqueante primero (C p. 52) [21] |

### 7.2 Examen (nivel MIR; distractores de la propia fuente; la correcta repartida en posición y largo, lección 4)

| # | Pregunta | Correcta | Distractores (de dónde salen) |
|---|---|---|---|
| E1 | ¿Cuál de estos efectos de la adrenalina está mediado por el α? | La hiperglucemia (inhibe la insulina) (S p. 14) | Lactato ↑ (producción aeróbica) · taquicardia (β) · metabolismo ↑ (sin receptor en la fuente) |
| E2 | Dopamina a 2 µg/kg/min: ¿qué efecto adverso describe Marino a dosis bajas? | Presión intraocular ↑ (1-4 µg/kg/min) (S p. 15) | FA (tramo alto) · protección renal (la fuente no la dice) · bradicardia |
| E3 | ¿En qué shock considera la fuente la fenilefrina **más apropiada** que la NA? | Cardiogénico por obstrucción dinámica del TSVI (S p. 42) | Séptico con FA rápida («útil», opinión del autor, S p. 15) · anafiláctico (2.º vasopresor posible, S p. 67) · hipovolémico |
| E4 | Milrinona con ClCr 30 mL/min/1,73 m²: ¿qué infusión? | 0,33 µg/kg/min (Tabla 16.3, S p. 43-44) | 0,375 (sin ajuste) · 0,28 (ClCr 20) · 0,43 (ClCr 50) |
| E5 | ¿Por qué atrae el levosimendán en el cardiogénico del infarto? | Dilata coronarias y no sube el consumo de O₂ (S p. 44) | Semivida corta · sin hipotensión · aprobado en EE. UU. |
| E6 | Mecanismo del riesgo trombótico de la angiotensina II | PAI-1 del músculo liso + adhesión plaquetaria (S p. 16) | Activación del factor X · plaquetopenia · liberación de vasopresina |
| E7 | NA 0,22 µg/kg/min y PAM 60 en un séptico: ¿qué dice Marino de la vasopresina? | Cap. 14: ya (≥0,2); cap. 17: con 0,25-0,5: **las fuentes discrepan** (S p. 15, 60) | Solo con >0,5 · nunca antes de la adrenalina · con cualquier dosis |
| E8 | ¿Por qué el metoprolol está contraindicado en la isquemia por cocaína? | Deja la vasoconstricción α sin oposición (C p. 47) | Bradicardia extrema · broncoespasmo · interacción hepática |
| E9 | Disección con esmolol a 100 µg/kg/min: quieres subir. ¿Qué haces antes? | Un bolo de repetición antes de cada subida (C p. 51) | Pasar a labetalol · añadir nicardipino solo · nada |
| E10 | NTG a 40 µg/min sin efecto en 30 min, por un sistema de PVC. ¿Qué es lo primero que sospechas? | Hasta el 80 % se adsorbe al PVC: vidrio y polietileno (C p. 9) | Taquifilaxia (es a las 24 h) · resistencia del 20 % (el nitroprusiato) · metahemoglobina |
| E11 | ¿Qué beneficio da la adrenalina en la RCP y qué lo puede borrar? | Vasoconstricción: presión de perfusión coronaria +30 %; el β lo puede borrar (C p. 61-62) | Inotropismo · broncodilatación · más supervivencia probada |
| E12 | TEP de alto riesgo hipotenso: ¿por qué NA y no dobutamina sola? | NA no sube la resistencia pulmonar; la dobutamina vasodilata (R p. 11) | Dobutamina arritmógena · NA inotrópica pura · ninguna diferencia |

### 7.3 Caso de muestra: **«La FA que trajo la adrenalina» (Paulino)**

**Paciente nuevo** (no está en `js/` ni en `autonomo/`; no repite la lista del encargo ni la de la cobertura §9):
**Paulino, 72 años, varón, 80 kg, 1,74 m (peso ideal 70, del caso)**; HTA; **colangitis aguda litiásica → shock
séptico**. Añadir a la lista de pacientes del bloque.

| Paso · momento | Dato nuevo (en rojo) | Pregunta (formato) | Respuesta y por qué fallan las otras (página) |
|---|---|---|---|
| 1 · Urgencias, hora 0 | Tras 2,1 L (30 mL/kg de peso ideal) en 3 h: PA 74/40 (PAM 51), FC 112 sinusal, lactato 4,4; sin vía central | ¿Qué das y por dónde? (test, «piensa antes») | **NA 5-10 µg/min por una vena del brazo proximal a la fosa antecubital** (S p. 12, 60). ✗ Esperar al central: periférica segura hasta 48 h. ✗ Dopamina 5 µg/kg/min: más taquiarritmias (S p. 14). ✗ Fenilefrina: no recomendada en el shock (S p. 15). → *modelo* `na-baja`: predice qué sube primero |
| 2 · Hora 2 | NA **24 µg/min**, PAM 62 | Calcula la dosis por kilo con el conversor del modelo y di qué haces (destapa, «son tres cosas») | 24/80 = **0,30 µg/kg/min**: 1 · manda el α y se acerca al techo de 30 (S p. 13); 2 · **vasopresina** (0,25-0,5 del cap. 17; ≥0,2 del cap. 14: las dos se cumplen, S p. 15, 60); 3 · **hidrocortisona 50 mg/6 h** (>0,25, Tabla 17.2; ≥0,25, texto: se cumplen las dos) |
| 3 · Hora 2, plan del R1 | — | Encuentra el error (**hay 2**) | «Añado vasopresina 0,03 U/min y, si en 1 h no llega a 65, la subo a 0,06» ✗ (no se titula, S p. 16) · «Hidrocortisona 50 mg cada 6 h» ✓ · «La vasopresina estimula los α₁ que la NA ya no alcanza» ✗ (**V₁**, otro receptor, S p. 15) · «Sigo por la periférica mientras se pone el central» ✓ (S p. 12, 60) |
| 4 · Hora 10 | NA 26 + vasopresina; a la hora 8 se añadió **adrenalina 0,1 µg/kg/min (8 µg/min)** (3.ª línea, S p. 60; nota: 2.ª en el cap. 14). Lactato 3,1 → **5,0**; **glucemia 262**; diuresis 0,7 mL/kg/h; gap de PCO₂ **4 mmHg** | El R2 quiere subir la adrenalina «porque el lactato dice que sigue hipoperfundido». ¿Qué le contestas? (test) | **La adrenalina sube el lactato por producción aeróbica (y la glucemia por el α): mira la diuresis y el gap, que están en objetivo** (S p. 14; gap <6 y diuresis >0,5, Tabla 14.5, S p. 17; con acidosis, solo el gap normal cuenta, S p. 10). ✗ Más volumen. ✗ Subir la adrenalina: más β. ✗ Lactato = isquemia mesentérica segura (la fuente da la hipoperfusión esplácnica como riesgo, no como explicación de este dato) |
| 5 · **Giro**, hora 11 | **FA a 156 lpm**, PA 84/50 (PAM 61) | ¿Qué haces con los vasoactivos? (test) | **Retirar la adrenalina (estimulación β: taquicardia y arritmias, S p. 14) y, si falta α, fenilefrina desde 0,5 µg/kg/min**: «útil en el séptico con FA rápida», **opinión del autor** (S p. 15), α puro sin β. ✗ Diltiazem 0,25 mg/kg: hipotensión en el 20-30 % (C p. 23) con PAM 61. ✗ Cambiar a dopamina, «más inotrópica»: más FA (S p. 14). ✗ Subir la adrenalina a 0,3 para sostener la PA: más β. → *modelo* `adrenalina` → `fenilefrina` en el paciente «FA rápida» |
| 6 · Hora 14 | La piel alrededor de la vía del brazo está **blanca y fría** | ¿Qué haces y en qué orden? (destapa, «son tres pasos») | Parar, desconectar, aspirar sin lavar y retirar · **fentolamina 5-10 mg en 10 mL en la zona** · **antes de 12 h**; el blanqueo debería irse casi enseguida (S p. 12) → *modelo* `extravasacion` |
| 7 · Día 3 | PAM 70 con NA 6 µg/min; vasopresina retirada | El adjunto propone midodrina 20 mg/8 h «para quitar antes la NA». ¿Qué dice la fuente? (test) | **No acelera la retirada de los vasopresores** (S p. 16). ✗ La acelera un día. ✗ Solo con diálisis (allí sí sirve, pero para la hipotensión de la sesión). ✗ Está contraindicada en el séptico (la fuente no lo dice) |

**Lo que te llevas**: 1 · La dosis cambia el receptor: NA <10 β, >10 α, 30 techo. 2 · Otra puerta, otra regla: la
vasopresina (V₁) no se titula; la fenilefrina (α puro) no toca el β. 3 · Los efectos de la adrenalina engañan (lactato,
glucosa) o dañan (FA): se leen con el receptor en la cabeza.
**Vuelta**: a la ficha `mc-vasopresores` (`#mc-norepinefrina`) y al modelo en `fenilefrina` con el paciente «FA rápida».
**Calculadoras**: el conversor del modelo (paso 2) y el selector de la ficha «¿Qué agente para este escenario?»
(`#mc-vasopresor-escenario`, paso 5). **Cifras posibles** (§1.12): PAM = (PAS + 2 PAD)/3 en cada paso; 0,1 µg/kg/min × 80
= 8 µg/min; lactato que sube con gap y diuresis en objetivo es coherente con un efecto metabólico.

---

## 8. Piezas comunes (lección 8: antes que el modelo)

1. **`js/data/vasoactivos-data.js`** (pieza 4 de la cobertura), ampliada: por fármaco, `receptores` con peso por tramo,
   `dosis` (unidad, inicio, tramos, bolo, máximo, ajuste renal), `funcion`, `adversos`, `fuentes` (lista §7.11),
   `forma` (§2.3) y `efectoMonitor` (dirección + página; magnitud `ilustrativa`). La leen el receptor vivo, la cabecera,
   el corazón eléctrico y los selectores de las fichas. `RECEPTORES_FARMACO` se borra de `merino-cardiologia.js`.
2. **Formas de llaves y cerraduras** en la tabla única `js/data/formas-iones.js` + `core/particulas.js`.
3. **El monitor de cabecera** como pieza (`js/core/monitor-cabecera.js`): curvas, cifras y objetivos de la maqueta
   `b3-shock.html`; lo usan la cabecera, este modelo y el corazón eléctrico (ECG). No está en la lista de piezas de la
   cobertura: **propongo añadirlo** (si no, habrá dos monitores).
4. Las que ya existen: `core/explicacion-guiada.js`, `core/citas.js`, `core/mayeutica-motor.js`, `core/motion.js`.

---

## 9. Huecos (no se rellenan) y hallazgos para el auditor

**Huecos**
1. NA: Marino dice «β débil», no el subtipo; el β₁ (y «sin β₂») es del **Manual UMI**: chip propio.
2. Adrenalina: Marino no da el corte de dosis β/α; el Manual UMI sí (β 1-4, α >20 µg/min): chip propio.
3. Dobutamina: Marino dice «vasodilatación leve» sin receptor; el β₂ es del Manual UMI.
4. Dopamina: el subtipo D₁ no está en Marino («receptores específicos de dopamina»).
5. Angiotensina II: el nombre AT₁ no está en ninguna de las dos: `fisiología general`.
6. Nitratos: NO → GMPc no está en Marino; sí en el Manual UMI (chip). Las cascadas Gq/IP₃/Ca²⁺ del músculo liso y la
   del V₁: `fisiología general`, como ya rotula el diagrama actual.
7. NA a 30: que «todas las cerraduras estén llenas» es una imagen; Marino solo dice que no hay más respuesta.
8. Cuánto mueve cada fármaco el monitor: dirección de la fuente, magnitud `ilustrativa` (hueco 2 de la cobertura).
9. **Levosimendán**: Marino escribe «facilitating potassium influx into vascular smooth muscle» (S p. 44) y la ficha lo
   traduce igual. Abrir canales de K⁺ suele describirse como **salida** de K⁺ que hiperpolariza (conocimiento general,
   **no verificado aquí**). Posible errata de la fuente: el auditor lo busca en la web y lo cita (REGLAS §1.8-1.9); hasta
   entonces el dibujo pinta el canal abierto **sin flecha de dirección** y la frase literal con su nota.
10. Cómo restaura el glucagón la respuesta **en el mastocito** (el cap. 52 lo explica en el corazón).
11. Cómo «facilita» la hidrocortisona la respuesta a las catecolaminas (S p. 61).
12. El orden de retirada de los vasopresores: la fuente no lo dice (por eso el caso no lo pregunta).
13. Conversiones del cap. 16 (S p. 43): «5 µg/min (0,05 µg/kg/min)» supone 100 kg y «30 µg/min (0,5)», 60 kg: el
    libro redondea. El conversor calcula con el peso y enseña la cifra del libro con una nota «la fuente redondea».

**Hallazgos de fidelidad** (la ficha 2 resume por debajo de la fuente, CLAUDE §7.6):
a. Fenilefrina: falta «hipoperfusión de riñones e intestino» (S p. 15).
b. Vasopresina: falta «más marcada en piel, músculo y esplácnico» y «no sube la PA en sanos, sí en el shock
   vasodilatador» (S p. 15).
c. NA: falta «el β débil podría explicar por qué no daña la función renal» (S p. 12) y la inmunosupresión por los
   receptores de los leucocitos del cap. 14 (S p. 13; la ficha solo trae la versión del cap. 17).
d. Adrenalina: falta «aumento del metabolismo» (S p. 14).
e. `RECEPTORES_FARMACO`: «AT1», «túbulo colector» (Marino: «túbulos distales») y «D1» sin chip de origen; y
   `receptores-animados.js` usa colores hex en vez de tokens (CLAUDE §5).

---

## 10. Para la maqueta de la parada 1 (en llano)

Una maqueta nueva, `autonomo/maquetas/b3-receptor.html`, a 390 px, con el monitor arriba, la fila de dianas y la célula
grande, y el dock de mandos abajo. Enseña cuatro momentos: **la noradrenalina subiendo de 5 a 25 µg/min** en un séptico
(las llaves pasan de empujar el corazón a apretar la arteriola, la luz se estrecha y la RVS sube en el monitor); **la
vasopresina añadida** (otra cerradura, el mando con candado); **el miocito con dobutamina y milrinona** (la Fig. 52.4 del
libro viva, con la real al lado, en Fácil y en Completa); y **el mastocito del betabloqueado** (la adrenalina rebota y
entra el glucagón). Con la ficha del fármaco plegada (dosis por tramos, efectos adversos y «Ver en la ficha») y un
«Explícame» recorrido entero. Dos estilos para elegir: **grabado crema y oro** o **microscopio de fluorescencia**.

**Lo que decide el usuario**: 1 · modelo nuevo que sustituye a los receptores animados (recomendado) o ampliar el
diagrama actual; 2 · fármacos del shock en el 3A y los vasodilatadores y frenos en el 3B y el 3C (recomendado), o todos
a la vez; 3 · enseñar el Manual UMI dentro del modelo como segunda fuente con su chip (recomendado); 4 · quitar de la
ficha 2 las barras y el selector actuales cuando el modelo los sustituya (es quitar contenido: lo decide él); 5 · el
estilo A o B.
