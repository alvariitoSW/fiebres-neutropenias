# Bloque 3 · Dos megaproyectos: «el corazón eléctrico» y «el receptor vivo»

*(Profesor, modo mapa + juzgar, 21/10/2026. Lo pidió el usuario en la parada 1: «hay que pensarlos… como si fueran unos
mega proyectos, que después de completar el Marino y tener la base hecha, habrá que completarlos con el resto de
contenido de la app (Manual UMI, Libro Azul, PIF, etc.); como base está genial pero hay que subir el nivel» (REGLAS
§7.12). Hecho con: las dos maquetas abiertas a 390 × 844 (táctil, servidor propio) y recorridas mando a mando
(5 ritmos con adenosina, vagal, diltiazem a 6 h, WPW + FA + diltiazem → FV, RCP con 10 y 30 insuflaciones y choque;
4 momentos del receptor con la NA de 0 a 40, vasopresina, dobutamina de 5 a 20, milrinona, betabloqueo, adrenalina
y glucagón; estilos A y B; «Explícame» y Mayéutica), 30 capturas miradas una a una; `cobertura.md` §5 y `farmacos.md`
enteros; un barrido por palabras de las ~330 fichas de la app (`js/modules/**`) para el mapa de crecimiento, con los
fragmentos clave leídos; y el método Anatomy (`/tmp/ajeno/anatomy`: `SKILL.md`, `references/craft.md`,
`walkthrough.md` del test-rig y el `dial-indicator` abierto a 390 y a 1200 px).)*

---

## 0. En una pantalla

- **Las dos maquetas son una base honrada, no un megaproyecto todavía.** Funcionan, no desbordan (scrollWidth 390),
  sin errores de consola, con fuentes, «Ver en la ficha», explicación guiada y Mayéutica. Pero el dibujo es un
  **esquema** (óvalos y un escudo; cajas con rótulos unidas por rayas), y lo más importante de cada tema **no se ve**:
  en el corazón eléctrico, que el nodo AV es **la única puerta** a través de un anillo aislante y que los fármacos y
  los iones actúan sobre él; en el receptor vivo, que la célula que se aprieta **es** la pared que estrecha la luz.
- **Veredicto (rúbrica REGLAS §7, pasa si todo ≥4): no pasan como modelo final; sí como base.** Puntos por debajo
  de 4 en los dos: «lo que enseña se ve» (2), «modelo grande» (3), «por concepto y con fuentes en lista» (3) y el
  nivel visual de §7.12 (2).
- **El cambio de fondo para crecer sin rehacerse**: que **una sola verdad** mueva todo, como pide Anatomy («cada cifra
  sale del mismo modelo que mueve las piezas»). En el corazón eléctrico, un **grafo de conducción** del que salen la
  onda que recorre el corazón, el ECG (P, PR, QRS, QT nacen del camino, no de un trazo dibujado por ritmo) y los
  latidos que mueven la presión del motor. En el receptor vivo, una **tabla de receptores, células y fármacos** de la
  que salen la ocupación de las cerraduras, la cascada y el efecto en el monitor.
- **Los dos comparten la capa de abajo, la célula** (membrana, cerraduras, canales, bomba Na⁺/K⁺): la célula del nodo
  del corazón eléctrico es la misma que el receptor vivo usa para el β₁, el diltiazem o la adenosina, y la misma
  membrana que ya dibuja la escena del potasio. Es la pieza común más valiosa del bloque.
- **Objeto real de cada uno** (método Anatomy): el corazón eléctrico, un **corazón en corte con su cableado** y una
  lupa donde el nodo AV es **un torniquete con muelle** (deja pasar uno y tarda en rearmarse: el periodo refractario);
  el receptor vivo, **cerraduras de pines** en la membrana que, al girar, mueven una **maquinaria** dentro de la
  célula, y una **arteriola de verdad** con su anillo de células lisas que se cierra.
- **Lo que decide el usuario** (§7): copiar o no el kit de Anatomy (licencia MIT; hoy la única librería permitida es
  Motion), el objeto de cada uno (hay alternativas) y el orden de crecimiento después de Marino.

---

## 1. Juicio de la maqueta del corazón eléctrico (`autonomo/maquetas/b3-ritmo.html`)

### 1.1 Puntuación (REGLAS §7 y §8; comparado con la nefrona viva y el atlas 14)

| Punto | Nota | Por qué |
|---|---|---|
| 1 Primera vista | 3 | Título, frase, tres tarjetas de dirección, interruptor y chips antes del dibujo: el corazón empieza a ~480 px y el ECG queda bajo el pliegue |
| 2 Párrafos | 4 | Frases cortas, chips de origen, nada de muros |
| 3 Resaltado | 4 | «camino de la chispa» y «diltiazem puede matar a un WPW» bien elegidos |
| 4 Lo que enseña se ve | **2** | Se ve el camino, pero no el anillo aislante, ni el nodo que frena, ni el fármaco actuando, ni la onda delta (ver 1.2) |
| 5 Interactivo que enseña | 3 | Adenosina, Fig. 19.5 viva, WPW → FV y RCP con ETCO₂ son muy buenos; el corazón no cambia con el fármaco |
| 7 Móvil | 4 | Sin desbordes; la chispa es un punto de ~4 px, difícil de seguir; rótulos que pisan contornos |
| 8 Modelo grande | **3** | 5 de los 20 estados de `cobertura.md` §5.3; un monitor propio distinto del de la cabecera del shock |
| 9 Ver en la ficha | 4 | En cada paso guiado y en cada lámina |
| 10 Explicación guiada | 4 | 3-5 pasos por estado, con anillo sobre el dibujo |
| 11 Por concepto, fuentes en lista | **3** | Las fuentes sí van en lista por estado; los ritmos están cableados a mano (`ecg(t)` por ritmo, `DIBUJO` fijo) |
| 12 Megaproyecto · nivel visual | **2** | Esquema de óvalos, escudo rayado y un hilo: no es un objeto que se entienda al mirarlo |
| §8 Mayéutica (muestra) | 3 | Predice y comprueba bien hecho (la adenosina tapa la tira); muestra corta, como toca a una maqueta |

### 1.2 Lo que falla, por gravedad

**Graves (lo que impide aprender mirando)**
1. **El corazón no es un corazón.** Aurículas como dos óvalos flotantes, ventrículos como un escudo con trama, el
   tabique como un hueco. Falta **la idea que sostiene todo el capítulo**: entre aurículas y ventrículos hay un
   **anillo fibroso que aísla** y el nodo AV-His es **el único paso**. Sin ese anillo, la vía accesoria del WPW es una
   raya roja más y no «un atajo que salta la única puerta» (la frase del propio modelo).
2. **Los fármacos no se ven en el corazón.** Con diltiazem en la FA solo cambian el número y la tira; el nodo AV
   sigue igual. La lupa del nodo **se apaga** justo en la FA y en la FV, donde más enseñaría (el nodo como filtro).
   No hay capa celular: no se puede explicar dónde actúan diltiazem, betabloqueante, amiodarona o adenosina, ni por
   qué el K⁺, el Mg²⁺ o el haloperidol tocan el QT.
3. **El ECG está dibujado por ritmo, no nace del camino.** Consecuencia visible: en el WPW la onda delta **no se lee a
   390 px** (captura ampliada: un leve escalón) y la lectura dice «QRS >0,12 s» mientras la tira parece estrecha; el
   PR no sale del freno del nodo. Para crecer (bloqueos, ramas, marcapasos, TRC, hiperpotasemia) hace falta un
   generador de ECG a partir de la activación.
4. **La onda no se ve.** Una chispa-punto que recorre un hilo no enseña despolarización, refractariedad ni reentrada.
   Las cámaras no se encienden ni se contraen de forma perceptible (lo prometía `cobertura.md` §5.2).
5. **No se mide nada.** Ni calibrador, ni regla de PR, QRS, QT y RR, ni papel con sus cuadros numerados. Un R1 tiene
   que aprender a medir; el estado `stemi` (regla del ST en el punto J) ni siquiera está.

**Medios**
6. Faltan 15 estados de `cobertura.md` §5.3 (flutter, TAM, taquicardia sinusal, vagal como estado, TV, aberrancia,
   torsade, cardioversión sincronizada, `stemi`, AESP, asistolia, RCP con adrenalina, RCE como estado).
7. **La parada es demasiado fácil**: un choque siempre devuelve el pulso a 100 lpm y ETCO₂ 38. No hay choque que
   falle, ni ciclo de 2 min, ni adrenalina o amiodarona en el dock, aunque el paso 4 de la guía las nombra. La curva de
   ETCO₂ durante la RCP es una línea plana (sin capnograma con cada insuflación).
8. **Dos monitores**: las tiras de esta maqueta no son el monitor de cabecera de `b3-shock.html` (`farmacos.md` §8
   propuso una sola pieza).
9. Tras la adenosina, la frase dice «Vuelve el sinusal» mientras la lectura marca FC 0 y la tira aún muestra P sin
   QRS: la lectura va detrás del dibujo.
10. Las direcciones B (metro) y C (solo ECG) cuestan mantenerlas. B es muy clara para el **nodo AV**: su idea pasa a la
    lupa (§4.2), no como dibujo aparte.

**Leves**
11. Rótulos: «rama dcha.» pisa el contorno del ventrículo; «His» cae dentro del VI; «vía accesoria» cruza la pared;
    «nodo sinusal» lejos del nodo.
12. El hueco de barrido de las tiras corta el trazo en mitad de la pantalla sin marcar el «ahora».

**Lo que se queda (muy bueno)**: la Fig. 19.5 viva con su punto que avanza; el déficit de pulso (Fig. 19.4); la
banda de peligro del WPW con «Ver lo que puede pasar»; la Fig. 21.1 y la 21.4 vivas; las 10 frente a 30
insuflaciones; la adenosina que tapa la tira en la Mayéutica (predice y comprueba); las láminas reales al lado.

---

## 2. Juicio de la maqueta del receptor vivo (`autonomo/maquetas/b3-receptor.html`)

### 2.1 Puntuación

| Punto | Nota | Por qué |
|---|---|---|
| 1 Primera vista | 3 | Estilos y momentos antes del monitor; la célula, dos pantallas más abajo |
| 2 Párrafos | 4 | Bien |
| 3 Resaltado | 4 | «llave» y «cerraduras» |
| 4 Lo que enseña se ve | **2** | La célula es un diagrama de cajas con rótulos y rayas; el efecto (la luz) es un círculo aparte |
| 5 Interactivo que enseña | 4 | La bomba con tramos del libro, el conversor por kilo, el **candado** de la vasopresina y el glucagón que entra por otra puerta son mandos que enseñan |
| 7 Móvil | 4 | Sin desbordes; las llaves pisan el rótulo «sangre» (A y B) |
| 8 Modelo grande | **3** | 4 momentos, 3 células a fondo; vena, nodo, riñón e hipófisis son solo iconos |
| 9 Ver en la ficha | 4 | Sí, en cascada, guía y fichas de fármaco |
| 10 Explicación guiada | 4 | 5 pasos que cambian de lupa (arteriola → miocito): muy bien |
| 11 Por concepto, fuentes en lista | **3** | Fuentes por estado sí; `calcular()` cableado por tipo de paciente con coeficientes sueltos |
| 12 Megaproyecto · nivel visual | **2** | Cerraduras como rectángulos con muesca; «la orden», «adenilato ciclasa» en globos: el anti-patrón «cajas y rótulos» de Anatomy |

### 2.2 Lo que falla, por gravedad

**Graves**
1. **La célula no es una célula ni una máquina**: una fila de rectángulos sobre una línea de membrana y, debajo,
   globos de texto unidos por rayas. Se aprende leyendo los globos, no mirando. (Anatomy: «no dibujes cajas, flechas y
   rótulos; inventa el objeto cuyo funcionamiento es el concepto».)
2. **El efecto está separado de su causa.** La «célula se aprieta» es una elipse con rayas rojas y «la luz» es un
   círculo a la derecha que pasa de ~65 a ~52 px de radio. La arteriola debería ser **un solo objeto**: el anillo de
   células lisas alrededor de la luz, que se cierra cuando giran sus cerraduras.
3. **La idea 2 de `farmacos.md` («la misma cerradura en células distintas hace cosas distintas») y la 3 («la dosis
   cambia el reparto») no se ven a la vez.** A NA 5 la frase dice «el β del corazón sube el gasto», pero la lupa
   enseña la arteriola; la fila de dianas con 0-3 marcas en el anillo es demasiado pequeña para leer el reparto.
4. **Antagonista mal dibujado**: el bisoprolol es un cuadrado colgado de la llave, encima del receptor; no se lee
   «tapón dentro de la cerradura», y el «rebote» de la adrenalina no se ve en quieto.
5. **Faltan 17 de los 21 estados** de `farmacos.md` §5.2 (dopamina por tramos, adrenalina y lactato, fenilefrina y la
   FC refleja, TSVI, extravasación y fentolamina, IC hipertensiva, disección, FA rápida, cocaína, TEP…).

**Medios**
6. Monitor: la glucemia dice «sube: α y glucagón» con la adrenalina a 0 (`b3-receptor.html` línea 727: no mira si hay
   adrenalina); el lactato «fijo en este momento» no responde a la adrenalina del momento 4; en el séptico, la FC no se
   mueve de 112 entre NA 0 y 40.
7. Cifras pintadas dentro del dibujo («IRVS 13,5 · PAM 62») que repiten el monitor (Anatomy: la lectura va en la
   esquina de la tarjeta, no en el objeto).
8. La cascada «Completa» es una fila de chips y un texto: no recorre la célula.
9. Estilo B (fluorescencia): más vistoso, misma estructura; recomiendo A, como decidió el director.

**Lo que se queda (muy bueno)**: la bomba con los **tramos del libro pintados** (5 · 10 · 30 · 40) y el «pesa el β /
manda el α / techo»; el conversor µg/min ↔ µg/kg/min con el peso del paciente; el **candado** de la vasopresina; el
monitor de cabecera compartido con el shock; la Fig. 52.4 real junto al miocito; la guía que cambia de lupa; las
notas de los tres tipos (§1.13).

---

## 3. Lo que enseña el método Anatomy y cómo traerlo a la app

Leído y visto (`dial-indicator` a 390 y 1200 px; walkthrough del `test-rig`). Lo esencial:

1. **El objeto es la explicación.** Se elige una máquina real cuyo mecanismo se corresponde uno a uno con el concepto
   y se dice en una frase «qué se mueve y qué significa ese movimiento».
2. **Verdad primero**: un módulo puro con las cifras reales (`rig.ts`) mueve las piezas, la lectura, el texto de
   accesibilidad y el pie. Nada se mueve «porque queda bien».
3. **Muchas piezas pequeñas y precisas** (40-80 en una figura; 80-150 en una grande), cada una apoyada en otra y con
   su función: tornillos, ranuras, reglas con marcas cada 5, etiquetas. **Dos miradas**: a 1× se lee una máquina; a 4×
   cada zona tiene algo cierto que descubrir.
4. **Volumen y calma**: sólidos rellenos (no alambre), 4 tonos por cara, líneas finas, **un solo acento iluminado**
   (lo que hay que mirar ahora), movimiento suavizado y lento, un recorrido solo cuando nadie toca, quieto con
   «reducir movimiento».
5. **Ni globos ni flechas**: los rótulos van a las esquinas de la tarjeta (título, pista, lectura viva) y al pie;
   en el dibujo, como mucho una etiqueta grabada.
6. **Verificar como un crítico**: capturas a 390, a 4× en cada unión, y ninguna línea que acabe en el aire.

**Cómo encaja con nuestras reglas (decisiones para el usuario)**
- **El kit es código MIT, pero la app solo admite Motion** (CLAUDE §2). Dos caminos: (a) **recomendado**: tomar el
  método y escribir una pieza propia pequeña, `js/core/grabado.js` (proyección isométrica, prismas y cilindros con 4
  tonos, orden de pintado, halo; unas 250 líneas); (b) copiar `kit/iso-kit.mjs` a `js/vendor/` como se hizo con Motion.
  (b) es más rápido pero añade una librería: lo elige el usuario.
- **Rótulos**: un R1 necesita nombres (nodo sinusal, His, α₁). Regla adaptada: **2-3 rótulos grabados** por escena
  (≥7,5 px, REGLAS §2.8); el resto, **al tocar la pieza** (su nombre y una línea en la esquina de lectura, con «Ver en
  la ficha»). Así el dibujo queda limpio y nada se pierde.
- **Isométrico solo donde ayuda**: en los aparatos (bomba de jeringa, generador de marcapasos, desfibrilador, Impella,
  la cerradura, el torniquete del nodo). Lo biológico (el corazón en corte, la arteriola) sigue el **grabado** de la
  app, pero con las reglas de Anatomy: muchas piezas reales, volumen, un acento, sin globos, cifras del modelo.
- **Móvil**: el `dial-indicator` a 390 px ocupa la mitad del ancho y su detalle se pierde. Nosotros: el sujeto llena el
  ancho (110-118 % dentro de la tarjeta, como `stretch.css` del test-rig) y **la lupa es la mirada a 4×**.
- **Color**: tokens de `css/variables.css`; el acento iluminado es `--text-main` (crema) sobre el grabado oro; color
  solo cuando el color es el tema (vía lenta y rápida, con forma además de color, CLAUDE §5).

---

## 4. El corazón eléctrico: el megaproyecto

### 4.1 El concepto en una frase
**Un impulso nace en un reloj, recorre un tejido que tarda en rearmarse y solo puede pasar a los ventrículos por una
puerta; cada arritmia es un camino distinto de esa onda, y el ECG es su sombra.**

### 4.2 El objeto (propuesta; el usuario elige)

**Opción recomendada · «El corazón y su cableado», en cuatro capas que se abren con lupa:**

| Capa | Qué se ve (piezas reales) | Qué se mueve y qué significa |
|---|---|---|
| **1 · La cama** | El **monitor de cabecera común** (ECG, PA, SpO₂, ETCO₂) y, conectados a él con su cable y su clip, tres **electrodos** reales sobre el corazón | La tira la escribe el modelo; tocar un electrodo cambia la derivación (II por defecto; V2-V3 para el ST) |
| **2 · El corazón** | Corte de 4 cámaras grabado: cavas con su desembocadura, orejuelas, tabique interauricular con fosa oval, orificio del seno coronario, **anillo fibroso** con tricúspide y mitral (valvas y cuerdas), tabique IV con banda moderadora, papilares, VI más grueso que el VD; el sistema de conducción como cable dorado **con su vaina**: nodo sinusal, haces, nodo AV, His **atravesando el anillo** (único paso), ramas y red de Purkinje subendocárdica | **La onda**: el miocardio es una trama fina que **se entinta** al despolarizarse y se aclara al repolarizarse (la zona aún oscura es refractaria: ahí no entra la siguiente). Las paredes se engruesan un poco tras activarse. El acento iluminado sigue el frente de onda |
| **3 · Las lupas (4×)** | **El nodo AV como torniquete**: dos carriles (vía lenta, vía rápida) cada uno con su torniquete y su muelle de rearme (periodo refractario distinto; idea de la dirección B); **el atajo**: un puente sin torniquete que cruza el anillo (WPW); **la cicatriz**: una isla alrededor de la que gira la onda (TV, rotulada «fisiología general», hueco 14 de la cobertura); **el QT**: la célula ventricular con su voltímetro | En la FA llegan impulsos a destiempo y el torniquete solo deja pasar a los que lo encuentran rearmado (el RR irregular se ve). Diltiazem y betabloqueante **endurecen el muelle** (rearme más lento, menos pasan); la adenosina **echa el cerrojo** unos segundos; en el WPW el puente no tiene muelle: frenar el torniquete manda todo por el puente |
| **4 · La célula** | La célula del nodo y la del ventrículo, con la **misma membrana del receptor vivo**: canal rápido de Na⁺, canal de Ca²⁺, canal de K⁺, bomba Na⁺/K⁺; un **voltímetro de aguja** que dibuja el potencial de acción con sus 5 fases (El Libro Azul) | K⁺ fuera alto → la aguja de reposo sube; la fase 0 se hace lenta (QRS ancho, ondas picudas en la tira); amiodarona o haloperidol alargan la fase de K⁺ (QT); el Mg²⁺ bajo deja la puerta abierta a la torsade. Cada cambio con su fuente (§4.4) |

**Aparatos que se enchufan** (isométricos, método Anatomy completo): la **bomba de jeringa común** (adenosina en bolo
con el lavado: se ve el bolo recorrer la vía hasta el corazón), el **desfibrilador** con sus parches (choque: todo el
tejido se entinta a la vez → silencio → el reloj sinusal vuelve), el **generador de marcapasos** con su cable al VD (el
código NBG del Manual UMI en su carátula; la constructora del código ya existe en `umi-marcapasos`).

**Alternativa · «El banco del corazón aislado»** (corazón de Langendorff: el corazón colgado de su cánula en un banco
con depósito, polígrafo de papel y estimulador). Es el objeto de laboratorio más fiel a Anatomy, pero aleja del
paciente; lo dejo como opción para la maqueta v2, no como recomendación.

### 4.3 La arquitectura: una sola verdad, el grafo de conducción

```js
// js/data/conduccion.js · el corazón como grafo (nodos con su reloj y su rearme; aristas con su velocidad)
export const NODOS = {
  sinusal:  { reloj: [70, 80], vel: 0.05, fuentes: [{ libro: 'Libro Azul', ficha: 'cardio-fisiologia-aplicada', id: '…' }] },
  nodoAV:   { reloj: [40, 60], vel: 0.05, retraso: 0.12, carriles: ['lenta', 'rapida'], fuentes: [/* ídem */] },
  his:      { reloj: [40, 40], vel: 2,   fuentes: [/* ídem */] },
  purkinje: { reloj: [15, 20], vel: 4,   fuentes: [/* ídem */] },
  // + auriculas, ramaD, ramaI, ventriculos, accesoria (opcional), cicatriz (opcional): «fisiología general»
};
export const ARISTAS = [['sinusal', 'auriculas'], ['auriculas', 'nodoAV'], ['nodoAV', 'his'] /* … */];

// js/data/ritmos.js · un ritmo es una CONFIGURACIÓN del grafo, no un trazo
export const RITMOS = {
  avnrt: { nombre: 'Reentrada nodal', grafo: { nodoAV: { lenta: { refractario: 'corto' }, rapida: { refractario: 'largo' } } },
           disparo: 'extrasistole-auricular', esperado: { qrs: 'estrecho', p: 'oculta', fc: [140, 250] },
           fuentes: [{ libro: 'Marino', pdf: 'C', pag: 29, ficha: 'mc-otras-taqui', id: '…' }] },
  // wpw: { grafo: { accesoria: { activa: true } } } · fa: { auriculas: 'desorganizada' } · bav3 (hueco de fuente, §4.6)
};

// js/data/modificadores-ritmo.js · fármacos, iones y temperatura cambian PARÁMETROS, cada uno con su fuente
export const MODIFICADORES = {
  diltiazem:  { nodoAV: { rearme: '+', conduccion: '-' }, celula: { canalCa: 'cerrado' }, fuentes: [{ pdf: 'C', pag: 23 }, { pdf: 'T', pag: 11 }] },
  adenosina:  { nodoAV: { bloqueo: { dura_s: [60, 120] } }, fuentes: [{ pdf: 'C', pag: 29 }] },
  kAlto:      { celula: { reposo: '+', fase0: 'lenta' }, fuentes: [{ ficha: 'fisio-hiperpotasemia' }, { ficha: 'mr-hiperk-tratamiento' }] },
  hipotermia: { todos: { vel: '-' }, sinusal: { reloj: '-' }, ecg: { osborn: true }, fuentes: [{ ficha: 'ma-hipotermia' }] },
};
```

- **Un motor** (`js/core/conduccion.js`) avanza el tiempo: activa nodos, respeta el rearme, emite **eventos de
  latido** `{ t, origen, auricula: bool, qrsAncho: bool, via }`.
- **El ECG se genera** (`js/core/ecg.js`, evolución de la pieza 6 de la cobertura): P = activación auricular, PR =
  retraso del nodo, QRS = duración de la activación ventricular (ancho si baja por el puente, por una rama bloqueada o
  nace en el ventrículo), ST/T/QT/U de la célula y sus modificadores. Papel milimetrado, **calibrador** y regla del ST.
  La escena del potasio (`potasio-escena.js`, función `onda()`) pasa a usarlo: un solo ECG en la app.
- **El motor del latido** (`js/modules/eco/motor.js`) escucha los eventos: con `auricula:false` no hay patada
  auricular (M9 de la cobertura), un RR corto llena menos y la PAS cae (déficit de pulso, Fig. 19.4). La FC del motor
  deja de ser un número: la dicta el reloj sinusal (y el β₁ del receptor vivo la modula).
- **Escenas por capas**: cada capa es `pintar(estado, t)` sobre el mismo estado; la lupa no es otra simulación, es
  otra mirada al mismo grafo.
- **Estados con nombre** = `{ ritmo, modificadores, aparatos, paciente, guia: [...], fuentes: [...] }`; otra fuente
  añade un estado o una nota sin tocar el motor (§7.11).

### 4.4 Mapa de crecimiento (fichas de la app que lo usarán, qué aporta cada una y en qué orden)

Encontradas por barrido (palabras de ritmo, ECG, iones, marcapasos y antiarrítmicos en cada ficha) y leídas en sus
fragmentos clave. La columna «aporta» es lo que la ficha da al modelo; todo lo demás, solo enlace.

| Orden | Fuente · fichas | Aporta (capa · estados · mandos) |
|---|---|---|
| **R0 · base** | Marino caps. 19-21 (bloque 3): `mc-taqui-reconocimiento`, `mc-fa-frecuencia`, `mc-fa-cardioversion`, `mc-otras-taqui`, `mc-paro-soporte`, `mc-paro-monitorizacion`, `mc-posresucitacion`, `mc-sca-diagnostico` (ST) | Los 20 estados de `cobertura.md` §5.3: grafo, torniquete, puente, cicatriz, desfibrilador, bomba (adenosina, diltiazem, amiodarona, digoxina, esmolol, Mg), regla del ST |
| **R1 · la célula y los iones** | El Libro Azul `cardio-fisiologia-aplicada` (**frecuencias de disparo y velocidades de conducción** por estructura: sinusal 70-80/0,05 m/s, nodo AV 40-60/0,05 con retraso de 0,12 s, His 40/2, Purkinje 15-20/4; **potencial de acción en 5 fases**; ECG en su Wiggers) · Marino `mr-hiperk-causas`, `mr-hiperk-tratamiento`, `mr-hipopotasemia` (U, T plana, QT largo en el 50 %), `mr-magnesio-deficit`, `mr-magnesio-reposicion` (torsade; el bloqueo AV de la hipermagnesemia en su tabla: comprobar la página), `mr-hipercalcemia` (QT corto), `mr-calcio-hipoca` · PIF Nefrología `fisio-hiperpotasemia` (gravedad = K⁺ × ECG, Fig. 7), `fisio-hipopotasemia` (onda U, FA), `fisio-magnesio`, `fisio-hipocalcemia` · Hematología `sind-slt` (lisis tumoral: K⁺, Ca²⁺) | **Capa 4 entera** con su fuente (las cifras del grafo dejan de ser «fisiología general» y pasan a ser del Libro Azul, con su nota de que es otra fuente). Mandos: K⁺, Mg²⁺, Ca²⁺. Estados: `k-6`, `k-7-5`, `sinusoidal`, `hipok-u`, `torsade-mg`. La escena del potasio enlaza aquí en vez de dibujar su propio ECG |
| **R2 · fármacos que tocan el ritmo** | Marino `mar-sedacion` y `mn-delirio` (**haloperidol: QTc >500 ms, torsade en el 3-4 %**; dexmedetomidina, bradicardia), `mt-bzd-betabloq` (bradicardia por betabloqueantes; **el glucagón no revierte el bloqueo AV**), `mn-relajantes` y `umi-rsi` (succinilcolina: bradicardia y K⁺ ↑) · UCI papers `extubacion-puma` (bradicardia por hipoxemia frente a la de la succinilcolina: atropina solo en esta) | Estados `qt-haloperidol`, `bradicardia-betabloqueo` (con el glucagón que sube la FC pero no abre el nodo bloqueado), `succinilcolina-k`. Enlace con el receptor vivo (§5): el fármaco se ve en su cerradura y su efecto en el grafo |
| **R3 · bradicardias, frío y aparatos** | Marino `ma-hipotermia` (Osborn, Fig. 43.1 real; bradicardia resistente a la atropina <32 °C; FV y asistolia <28 °C) · Manual UMI `umi-marcapasos` (código NBG de 5 letras) · Guía ESC `ic-dispositivos` (DAI, **TRC**: QRS ancho y BRI), `ic-diagnostico` (ECG en la IC) | Mando **temperatura**; el **generador de marcapasos** como aparato (carátula NBG; AAI, VVI, DDD); estado `trc` (dos cables activan el VI a la vez: el QRS se estrecha, sale del grafo sin dibujarlo aparte); `osborn`. **Hueco grande**: ninguna fuente de la app enseña los **bloqueos AV de 1.º, 2.º y 3.er grado** ni las bradicardias sinusales; el modelo puede dibujarlos, pero hace falta una fuente (pedírsela al usuario) |
| **R4 · la FA crónica y la IC** | Guía ESC `ic-comorb-cv` (FA en la IC: frecuencia o ritmo), `ic-farmacologia` (**ivabradina**: frena el reloj sinusal; **digoxina**), Manual UMI `umi-fa-anticoagulacion`, `umi-posparada` | Estados `fa-ic`, `ivabradina` (solo cambia `sinusal.reloj`), `digoxina`; enlaces a la anticoagulación (telar y vaso) |
| **R5 · el ciclo entero** | Eco `cap-ciclo` (Wiggers con ECG), motor del latido M9, `cardio-monitorizacion-hemodinamica` | El ECG del atlas y del ecógrafo pasa a ser el generado: un solo ECG en toda la app |

Así el corazón eléctrico pasa de **8 fichas (Marino)** a unas **35** sin cambiar de motor: cada fuente añade
estados, modificadores con su cita o un aparato.

### 4.5 Conexiones con los otros modelos
- **Monitor de cabecera común** (`js/core/monitor-cabecera.js`, `farmacos.md` §8.3): una sola pieza para la cabecera del
  shock, el receptor vivo y el corazón eléctrico; su fila ECG la escribe `core/ecg.js`.
- **Motor del latido**: eventos de latido → presión, déficit de pulso, patada auricular (M9).
- **Receptor vivo**: la célula del nodo (β₁, canal de Ca²⁺, receptor de la adenosina) es **la misma** pieza; un
  fármaco puesto en un modelo aparece puesto en el otro (estado compartido por URL: `data-ritmo-vivo` y
  `data-receptor-vivo` aceptan `farmacos=`).
- **Escena del potasio** y la nefrona: el K⁺ que mueven la insulina, el salbutamol o la diálisis es el que lee la capa 4.
- **Capilar vivo**: la ETCO₂ de la RCP (estado `capno-rcp`, que ya existe) se enlaza al estado `rcp`.

### 4.6 Huecos (no se rellenan)
1. Bloqueos AV y bradicardias: sin fuente en la app (ver R3).
2. Mecanismo iónico detallado (qué canal hace cada fase) solo está en El Libro Azul; Marino caps. 19-21 no lo da:
   cada fase lleva el chip de su fuente.
3. El subtipo del receptor de la adenosina: Marino solo dice «sus receptores» (teofilina); el nombre A₁ sería
   «fisiología general».
4. La anatomía fina del corte (banda moderadora, triángulo de Koch): «fisiología general», salvo lo que dice El Libro
   Azul (nodo sinusal junto a la cava superior; nodo AV en la parte proximal del tabique, junto al seno coronario).

---

## 5. El receptor vivo: el megaproyecto

### 5.1 El concepto en una frase
**Un fármaco (o una hormona del propio cuerpo) es una llave; la cerradura está en unas células concretas; al girar
mueve una maquinaria dentro de la célula; y lo que hace esa célula, en su órgano, es lo que ves en el monitor.**

### 5.2 El objeto (propuesta)

| Capa | Qué se ve (piezas reales) | Qué se mueve y qué significa |
|---|---|---|
| **1 · La cama** | El monitor común + la **bomba de jeringa común** (émbolo, husillo, pantalla con la cifra, tramos del libro pintados en su regla, candado de la vasopresina, botón de bolo) | La bomba empuja llaves por la vía; su número es el del modelo |
| **2 · El órgano** | **La arteriola** como un tubo cortado: endotelio en teselas, **anillo de células lisas enrolladas** (cada una un sólido con su núcleo), adventicia con una **fibra simpática y sus varicosidades** (la NA del propio cuerpo); un **calibre** que mide la luz. **La vena** (pared fina, mucha luz: el depósito). **El corazón** como un haz de miocitos con sus sarcómeros en un banco con un **medidor de fuerza** de aguja (el test-rig de Anatomy: la aguja es la contractilidad) y la célula del nodo con su reloj. **El mastocito** con sus gránulos atracados en la membrana. Después: **el bronquio** (el mismo músculo liso, otro órgano) y **la unión neuromuscular** | La luz se cierra porque se acortan **las mismas células** que se ven en la lupa; la resistencia sale del radio (r⁴, «fisiología general») y va al IRVS del monitor. En una vista se ven **a la vez** el corazón y la arteriola con su reparto de llaves: a NA 5 casi todas al β₁ del miocito; a NA 25, al α₁ del anillo (idea 3) |
| **3 · La cerradura (4×)** | Cada receptor es una **cerradura de pines** asentada en la doble capa de la membrana: carcasa, cilindro, pines de alturas distintas y **un perfil de entrada con la forma del receptor** (la tabla de formas de `farmacos.md` §2.3) | El **agonista** levanta los pines a la línea de corte: el cilindro gira y empuja una palanca hacia dentro. El **antagonista** es una llave ciega: entra, no alinea los pines, no gira y **se queda** (la siguiente llave no cabe: el rebote de la adrenalina en el betabloqueado se ve). El fármaco **sin cerradura** (milrinona, levosimendán, nitratos) no toca la membrana: actúa dentro, en la maquinaria |
| **4 · La maquinaria** | Debajo de la membrana, una **cadena de máquinas**: la proteína G como un carro en un raíl; la **adenilato ciclasa** como una prensa que estampa fichas de AMPc a partir de ATP; la **PDE** como una trituradora de fichas (la milrinona la atasca); la proteína cinasa como una mano que **abre la compuerta del canal de Ca²⁺**; el **retículo** como un depósito con su válvula (la abre el IP₃; el dantroleno la cierra, `ma-hipertermia-farmacos`); el Ca²⁺ como cuentas que hacen que las **cabezas de miosina tiren de la cuerda de actina** (trinquete) | Fácil = se ven solo la llave, la palanca y el efecto; Completa = se encienden una a una las máquinas con su nombre al tocarlas. Las fuentes de cada máquina como en `farmacos.md` §3 (Fig. 52.4, T p. 10-12; Gq/IP₃ «fisiología general»; NO → GMPc del Manual UMI) |

### 5.3 La arquitectura: tres tablas y una función

```js
// js/data/receptores.js · la cerradura (una vez para toda la app)
export const RECEPTORES = {
  alfa1: { nombre: 'α₁', forma: 'muesca-triangular', via: 'Gq', fuentes: [{ libro: 'Marino', pdf: 'S', pag: 12, ficha: 'mc-vasopresores', id: 'mc-norepinefrina' }, { libro: 'Manual UMI', ficha: 'umi-vasoactivos' }] },
  beta2: { nombre: 'β₂', forma: 'muesca-cuadrada', via: 'Gs', fuentes: [/* … */] },
  // V1, V2, glucagón, H1, H2, D, GABA-A, μ, α2, nicotínico, muscarínico, mineralocorticoide, AT1 (fisiología general)…
};
// js/data/celulas.js · dónde está cada cerradura y qué hace allí (la idea 2: misma cerradura, célula distinta)
export const CELULAS = {
  'liso-arteriola': { organo: 'arteriola', receptores: ['alfa1', 'v1', 'beta2', 'at1'], maquinaria: ['Gq', 'IP3', 'reticulo', 'miosina'],
                      salida: { magnitud: 'radio', monitor: 'IRVS' }, fuentes: [/* … */] },
  'liso-bronquio':  { organo: 'bronquio', receptores: ['beta2', 'm3'], salida: { magnitud: 'radio', monitor: 'resistencia de la vía aérea' },
                      fuentes: [{ ficha: 'neumo-asma-agudo' }] },
  'musculo-esqueletico': { receptores: ['beta2'], efecto: 'mete K⁺', fuentes: [{ libro: 'Marino', ficha: 'mr-hipopotasemia', id: 'mr-hipok-redistribucion' }] },
  // miocito, nodo (compartida con el corazón eléctrico), mastocito, vena, neurona, placa motora, túbulo colector (enlace a la nefrona)…
};
// js/data/farmacos.js · la llave (crece desde vasoactivos-data.js, pieza 4 de la cobertura)
export const FARMACOS = {
  noradrenalina: {
    llaves: [{ receptor: 'beta1', tipo: 'agonista', peso: [{ hasta: 10, v: 2 }, { desde: 10, v: 1 }] },
             { receptor: 'alfa1', tipo: 'agonista', peso: [{ hasta: 10, v: 1 }, { desde: 10, v: 3 }] }],
    dosis: { unidad: 'µg/min', inicio: [5, 10], tramos: [5, 10, 30, 40], techo: 30, fuentes: [{ pdf: 'S', pag: 13, id: 'mc-norepinefrina' }] },
    adversos: [{ texto: 'extravasación: piel blanca', receptor: 'alfa1', celula: 'liso-arteriola', antidoto: 'fentolamina', fuentes: [{ pdf: 'S', pag: 12 }] }],
    notas: [{ tipo: 'discrepan', texto: 'rango de dosis Marino frente a Manual UMI', fuentes: [/* las dos */] }],
    endogeno: true,   // también la produce el cuerpo (Libro Azul, neurohormonal)
  },
  // tipo: 'agonista' | 'antagonista' | 'sin-cerradura' (diana: 'pde' | 'miofilamentos' | 'canal-ca' | 'sGC' | 'transportador→nefrona')
};
// Una sola función, que leen el receptor vivo, la cabecera del shock y el corazón eléctrico:
// efecto(farmacos, paciente) → { ocupacion: {celula: {receptor: 0..1}}, maquinaria: {...}, monitor: {pam, fc, ic, irvs, pvc, lactato, glucemia} }
// dirección de la fuente y magnitud «ilustrativa» rotulada (hueco 2 de la cobertura); prueba de paciente posible (farmacos.md §5.3)
```

- **Un estado con nombre** = `{ paciente, farmacos: [{ id, dosis }], lupa: celula, guia, fuentes }`. Otro libro añade
  un fármaco, una célula, un estado o una nota en su tabla, **sin tocar el motor ni la escena**.
- `RECEPTORES_FARMACO` de `merino-cardiologia.js` y los hex de `receptores-animados.js` desaparecen (ya lo pedía
  `farmacos.md` §9e).

### 5.4 Mapa de crecimiento

| Orden | Fuente · fichas | Aporta |
|---|---|---|
| **V0 · base** | Marino bloque 3: las 13 fichas de `farmacos.md` §6 (vasopresores, inotrópicos, vasodilatadores, frenos, antídotos) | Arteriola, vena, miocito, nodo, mastocito; 26 fármacos; 21 estados |
| **V1 · la segunda fuente de lo mismo** | Manual UMI `umi-vasoactivos` (tabla de receptores α₁, α₂, β₁, β₂, β₃, D y V; isoproterenol; nifedipino), `umi-shock-septico`, `umi-hemodinamica` · El Libro Azul `cardio-fisiopatologia-fundamental` (NA, angiotensina II y vasopresina **del propio cuerpo** en la IC), `cardio-estados-choque` | Barato: mismas células. Chips «Manual UMI» y «Libro Azul» en cada cerradura; las llaves endógenas (`endogeno: true`) llegan por la fibra simpática y la sangre, no por la bomba |
| **V2 · el bronquio y el K⁺** | Merino Neumología `neumo-asma-agudo` (**β₂ del músculo liso bronquial**; **ipratropio** bloquea los muscarínicos), `neumo-asma-epoc-basicos`, `neumo-epoc-vpp` · Marino `mr-hipopotasemia` (**los β₂ del músculo meten K⁺**: salbutamol), `mr-hiperk-tratamiento` (salbutamol 10-20 mg nebulizado; insulina) · PIF `fisio-hiperpotasemia` | **El mismo músculo liso en otro órgano** (idea 2 hecha visible) y la célula muscular esquelética que mete K⁺: enlace directo con la escena del potasio y con la capa 4 del corazón eléctrico |
| **V3 · sedación, dolor y antídotos** | Marino `mar-sedacion` (propofol GABAérgico; **dexmedetomidina agonista α₂**), `mar-analgesia` (receptores opioides; la morfina libera histamina), `mt-opioides` (**naloxona**, antagonista puro, sobre todo μ), `mt-bzd-betabloq` (**flumazenil** antagonista del GABA-A; glucagón), `mn-abstinencia` (**el alcohol crónico sube la densidad de receptores GABA**: tolerancia y abstinencia), `mn-delirio` (dexmedetomidina, haloperidol), `mn-estado-epileptico` · Manual UMI `umi-sedacion`, `umi-rsi` | **Célula nueva: la neurona y su sinapsis**, con GABA-A (canal de Cl⁻), μ, α₂, D₂. Mando nuevo: **número de cerraduras** (regulación al alza de la abstinencia). La naloxona y el flumazenil son el mejor ejemplo de «llave ciega que desplaza» |
| **V4 · la unión neuromuscular** (ya en el mapa de Marino §4.8) | Marino `mn-relajantes` (succinilcolina despolarizante frente a rocuronio y cisatracurio que compiten; contraindicaciones de la succinilcolina), `mn-miastenia` (anticuerpos contra el receptor de acetilcolina; fármacos que la empeoran: magnesio, aminoglucósidos, betabloqueantes…), `mn-gbs-pnc`, `ma-hipertermia-farmacos` (dantroleno cierra la salida de Ca²⁺ del retículo) · Manual UMI `umi-rsi` | **Célula nueva: la placa motora** (receptor nicotínico); sugammadex y neostigmina como máquinas que retiran el relajante o la enzima; succinilcolina → K⁺ ↑ (enlace a R2 del corazón eléctrico). Es **una célula más**, no otro modelo (`farmacos.md` §6) |
| **V5 · riñón y agua** | Marino `mr-hiponatremia-tto` (desmopresina; **vaptanes**), `mr-hipernatremia` (desmopresina: V₂ sin V₁) · PIF `fisio-hiponatremia`, `hta-tratamiento-farmaco` (IECA, ARA II, calcioantagonistas, betabloqueantes, diuréticos), `erc-nefroproteccion`, `erc-farmacos` · Guía ESC `ic-farmacologia` (**MRA**: receptor mineralocorticoide; ARNI; iSGLT2) | Célula del túbulo colector con V₂ y el receptor mineralocorticoide **como enlace a la nefrona viva** (no se duplica: los transportadores viven allí). iSGLT2 y diuréticos: tipo `transportador→nefrona` |
| **V6 · el lecho esplácnico** | Marino `ma-pbe-shr` (**terlipresina**, análogo de la vasopresina; midodrina; octreótido), `ma-varices` (octreótido, vasoconstrictor esplácnico), `ma-pancreatitis-tto` (fenilefrina y flujo esplácnico) | Chip de lecho «intestino» en la arteriola; terlipresina = llave V₁. El receptor de la somatostatina: «fisiología general» (la fuente no lo nombra) |
| **V7 · la circulación pulmonar** | El Libro Azul `cardio-hipertension-pulmonar` (óxido nítrico inhalado: vasodilatación pulmonar selectiva; **sildenafilo inhibe la PDE5 → GMPc**), UCI papers `oxido-nitrico-inhalado` (GMPc) · Merino `neumo-ep-manejo` | Arteriola pulmonar (la misma célula lisa) con la **trituradora de GMPc** (PDE5) que el sildenafilo atasca: la misma máquina que la PDE3 de la milrinona |
| **V8 · la IC crónica** | Guía ESC `ic-farmacologia`, `ic-descompensada`, `ic-avanzada` (betabloqueantes, ARNI, MRA, iSGLT2, ivabradina, digoxina, inotrópicos) · El Libro Azul `inmuno-corazon-mitocondria-calcio` (levosimendán en la sepsis) | Miocito y nodo ya existen; ivabradina y digoxina enlazan al corazón eléctrico |
| **V9 · la plaqueta** (con el vaso que sangra) | Marino `mc-sca-tratamiento` (P2Y12, GPIIb/IIIa) | Los receptores van en `receptores.js`; el dibujo sigue en el vaso (no se duplica) |

De **~13 fichas (Marino)** a unas **50**: cada fuente añade llaves, cerraduras o una célula. Las fuentes nunca se
funden: si Marino y el Manual UMI discrepan (rango de la NA, el β₂ de la dobutamina), la cerradura enseña las dos con su
nota (REGLAS §1.4).

### 5.5 Conexiones
- **Cabecera del shock**: la arteriola y el VI de su escena llevan «Ver en la célula» (ya previsto); comparten la
  función `efecto()` y la bomba.
- **Corazón eléctrico**: la célula del nodo es común; el β₁ y el canal de Ca²⁺ cambian el reloj y el torniquete.
- **Nefrona viva y glomérulo**: diuréticos, V₂, MRA, iSGLT2 y la renina de la furosemida (C p. 10) enlazan a sus
  estados (`furosemida` ya existe).
- **Escena del potasio**: β₂ e insulina mueven K⁺ a la célula; succinilcolina lo saca.
- **Capilar vivo**: estado `epinefrina-lactato` (lactato aeróbico de la adrenalina).
- **Río y mar**: la fuga del mastocito (`fuga-35`).
- **Vaso que sangra**: plaqueta y angiotensina II (PAI-1).

---

## 6. Piezas comunes (lección 8: se construyen primero y los demás las copian)

| # | Pieza | Qué es | La usan |
|---|---|---|---|
| 1 | `js/core/monitor-cabecera.js` | El monitor de `b3-shock.html` como pieza: curvas, cifras, objetivos, «tapar hasta contestar» | Cabecera del shock, receptor vivo, corazón eléctrico |
| 2 | `js/core/ecg.js` | ECG **generado** desde la activación (P, PR, QRS, ST, T, QT, U), papel milimetrado, calibrador, regla del ST, derivación | Corazón eléctrico, escena del potasio, motor del latido, atlas (`cap-ciclo`) |
| 3 | `js/core/bomba-jeringa.js` | La bomba dibujada (Anatomy): tramos de la fuente pintados, conversor por kilo, candado, bolo | Receptor vivo, corazón eléctrico (adenosina, diltiazem, amiodarona, Mg), cabecera del shock |
| 4 | `js/core/membrana.js` | Doble capa, **cerradura de pines** por forma, canal con compuerta, bomba Na⁺/K⁺, vesícula; formas en `js/data/formas-iones.js` | Receptor vivo, capa 4 del corazón eléctrico, escena del potasio, placa motora |
| 5 | `js/core/grabado.js` (o el kit vendido, lo decide el usuario) | Proyección isométrica, sólidos con 4 tonos, orden de pintado, halo, «tocar una pieza → su nombre» | Aparatos de los dos modelos y los del shock (Impella, balón, ECMO) |
| 6 | Datos | `conduccion.js`, `ritmos.js`, `modificadores-ritmo.js`, `receptores.js`, `celulas.js`, `farmacos.js` (desde `vasoactivos-data.js`) | Todos |
| 7 | Estado compartido | Un mismo paciente para monitor, motor, ritmo y receptor (eventos de latido; `efecto()`); `data-ritmo-vivo` y `data-receptor-vivo` aceptan `farmacos=` | Enlaces cruzados entre modelos |

Ya existen y se usan tal cual: `explicacion-guiada.js`, `citas.js`, `mayeutica-motor.js`, `mayeutica.js`, `motion.js`,
`particulas.js`.

Orden: 6 (datos) → 1 y 2 (monitor y ECG: desbloquean el shock, el ritmo y el potasio) → 4 y 3 → 5 → escenas.

---

## 7. Las maquetas v2 (cambios concretos)

### 7.1 `b3-ritmo-v2.html`
1. **Arriba, el monitor común** (pieza 1) con el ECG generado (pieza 2): ninguna tira propia. Primera vista: frase de una
   línea + monitor + el corazón, todo en los primeros 844 px; las direcciones A/B/C desaparecen (A, con la lupa en el
   idioma de B).
2. **El corazón en corte rehecho con piezas** (§4.2, capa 2): anillo fibroso con las dos válvulas, His que lo atraviesa,
   cavas, seno coronario, tabiques, banda moderadora, papilares, pared del VI más gruesa. 2-3 rótulos grabados; el
   resto al tocar.
3. **La onda como tinta** que avanza por la trama y se aclara al repolarizar; la zona refractaria se distingue; las
   paredes se engruesan al activarse. Acento iluminado en el frente de onda.
4. **La lupa del nodo AV como torniquete** (dos carriles con muelle) **siempre visible** en FA, WPW y la reentrada; el
   fármaco se ve **en** el torniquete (muelle duro con diltiazem; cerrojo con adenosina); el puente del WPW sin
   torniquete.
5. **El ECG con su regla**: calibrador de PR, QRS y QT; en el WPW, la delta se lee porque nace de la activación por el
   puente. Estado `stemi` con la regla del ST en V2-V3 (Tabla 20.1).
6. **Los 20 estados** de la cobertura en chips por familias (sinusal · supraventriculares · FA y flutter ·
   ventriculares · QT · parada).
7. **La parada de verdad**: ciclos de 2 min, el choque que a veces no funciona (rotulado «ilustrativo»), adrenalina y
   amiodarona en el dock según la guía, capnograma con cada insuflación.
8. **Capa 4 en una lupa** con el K⁺ como mando de muestra (El Libro Azul + nefrología), para que el usuario vea el
   camino de crecimiento.
9. **Aparatos isométricos**: la bomba de jeringa (adenosina con lavado), el desfibrilador con sus parches, el
   generador de marcapasos (cerrado, para R3).
10. Arreglar los rótulos que pisan y que la lectura de FC vaya a la par de la frase tras la adenosina.

### 7.2 `b3-receptor-v2.html`
1. **Primera vista**: frase + monitor + **una escena con dos órganos a la vez** (el haz de miocitos con su medidor de
   fuerza y la arteriola con su anillo y su calibre), unidos a la bomba por la misma vía. Al subir la NA de 5 a 25 se
   ve el reparto pasar del miocito al anillo (idea 3) sin cambiar de lupa.
2. **La arteriola como objeto**: tubo cortado, endotelio, anillo de células lisas con núcleo, fibra simpática con
   varicosidades; la luz se cierra porque se acortan esas células; calibre y lectura en la esquina, no dentro.
3. **Cerraduras de pines** (pieza 4) en vez de rectángulos: agonista que gira, antagonista ciego que se queda, rebote
   visible. Fármaco sin cerradura actuando dentro.
4. **La maquinaria** (prensa de AMPc, trituradora PDE, compuerta del Ca²⁺, depósito del retículo, trinquete de
   miosina) en vez de globos de texto; Fácil | Completa enciende máquinas, no chips.
5. **Más estados**: los 21 de `farmacos.md` §5.2 en chips por familia; como muestra de crecimiento, **el bronquio**
   (β₂ y M₃ con salbutamol e ipratropio) para enseñar «misma célula, otro órgano».
6. **La bomba de jeringa dibujada** (pieza 3) con el mismo comportamiento que hoy (tramos, conversor, candado).
7. Arreglos: glucemia con adrenalina 0 (línea 727); lactato que responda a la adrenalina; FC que se mueva con el β₁; las
   llaves que no pisen el rótulo de la sangre; quitar las cifras pintadas dentro del dibujo.
8. Estilo A (grabado crema y oro); B, fuera.

Las dos v2 se juzgan con esta misma rúbrica y, además, la de Anatomy a 4×: ninguna zona vacía, ninguna línea que
acabe en el aire, un solo acento, y cada cifra del monitor saliendo del mismo modelo que mueve las piezas.

---

## 8. Decisiones para el usuario (en la parada siguiente)

1. **El kit de Anatomy**: escribir una pieza propia con su método (recomendado) o copiar su kit (MIT) como se hizo con
   Motion.
2. **El objeto del corazón eléctrico**: el corazón en corte con su cableado y el nodo como torniquete (recomendado) o el
   banco del corazón aislado.
3. **Construir primero las piezas comunes** (monitor, ECG generado, bomba, membrana) aunque retrasen las escenas una
   tanda: sin ellas, cada fuente nueva obligaría a rehacer.
4. **El orden de crecimiento** después de Marino: R1 (iones y la célula, con El Libro Azul y nefrología) y V2 (el
   bronquio y el K⁺) primero, porque usan fichas ya hechas y unen los dos modelos con la escena del potasio.
5. **Traer una fuente de bradicardias y bloqueos AV**: la app no la tiene; sin ella, el corazón eléctrico no puede
   enseñar los bloqueos ni el marcapasos más allá del código NBG.

---

## 9. Para el usuario, en llano

- Las dos maquetas funcionan y tienen cosas muy buenas (la bomba con los tramos del libro, el candado de la
  vasopresina, la adenosina que corta la taquicardia, la FA del WPW que acaba en FV), pero los dibujos son esquemas:
  óvalos y cajas con rótulos. Se aprende leyendo, no mirando.
- Propongo que cada uno sea **un objeto de verdad hecho de muchas piezas**, como enseña Anatomy: el corazón en corte
  con su cableado, un **anillo que aísla** y el nodo AV como **un torniquete** que deja pasar un impulso y tarda en
  rearmarse; y el receptor como **una cerradura de pines** que, al girar, mueve una maquinaria dentro de la célula, en
  una **arteriola de verdad** que se cierra.
- Para que crezcan sin rehacerse, todo saldrá de **una sola verdad**: el ECG nacerá del camino del impulso (no se
  dibujará a mano para cada ritmo) y el monitor, del fármaco puesto en su cerradura. Los dos modelos compartirán la
  célula, el monitor y la bomba.
- Después de Marino, el corazón eléctrico puede llegar a unas 35 fichas (potasio, magnesio, hipotermia, marcapasos,
  haloperidol, Guía de IC, El Libro Azul) y el receptor vivo a unas 50 (asma, sedación, opioides, relajantes, riñón,
  hígado, pulmón).
- Te pido decidir: si copiamos el kit de Anatomy o hacemos uno nuestro, qué objeto quieres para el corazón y si me
  traes una fuente de bradicardias y bloqueos AV, que hoy no hay en la app.
