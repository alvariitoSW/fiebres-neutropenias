# Paquete · `b3-pulmon-estudio` · Estudiar en las 21 fichas del pulmón con respirador (Marino caps. 23-30)

Director: sesión del 01/11/2026. Rama `auto/b3d-estudio` desde `main` (`auto/b3d` ya está entera en `main`:
`git merge-base` = su punta, 6ed80ea). Carpeta de trabajo (borrador): `/tmp/plan-socialista/b3-pulmon-estudio/`.
Tipo `estudio` (fase A ligera + fase B). Herramientas de prueba: `autonomo/bloques/b3/herramientas/` (nunca otra carpeta).

## Qué hay ya (no se rehace)
- Las 21 fichas, fieles, en `js/modules/neumologia/merino-neumologia.html` (clave `--ficha
  neumologia:merinoNeumologia:panel-merino-neumo-tabs:<id>`). 74 anclas `nep-` (las del cap. 22 y parte de 27-28).
- El Estudiar ya montado en Neumología para la embolia (`neumo-ep-*`): `js/data/mayeutica/b3b-tep.js`, registrado en
  `js/data/mayeutica/b3.js` y montado por `js/modules/neumologia/merino-neumologia.js` (`montarMayeutica`). **Es el
  modelo a copiar** (formato arriba de `js/data/mayeutica/b1-fluidos.js`).
- El pulmón vivo (`js/modules/libros/pulmon-vivo/`, datos `js/data/pulmon-vivo-data.js`, `pulmonVivo` en `MODELOS` de
  `core/mayeutica.js`) con estos estados (los de `ORDEN_ESTADOS`, más los añadidos con `push`): normal-vcv, pcv, pausa-inspiratoria, sdra-rigido, sdra-protector, volutrauma,
  broncoespasmo-auto-peep, auto-peep-corregida, eulalia-conectada, eulalia-ajustada, psv-disparo, atelectrauma-zeep,
  mejor-peep, cpap-eap, vpp-corazon-normal, p-sili, asincronia-ineficaz, doble-disparo, sbt-ok, sbt-fracaso,
  neumotorax-tension. Capilar vivo, ácido-base vivo, shock vivo (M8) y receptores ya existen.
- `js/data/ventilacion-data.js` (PBW, cortes). Vista Visual de Neumología: `js/modules/neumologia/visual.js`, 2 recetas.

## Fuente
`docs/marino-2024-respiratory-management-caps22-26.pdf` (cap. 23 p. 15, 24 p. 32, 25 p. 56, 26 p. 76) y
`docs/marino-2024-respiratory-management-caps27-30.pdf` (27 p. 1, 28 p. 17, 29 p. 35, 30 p. 50). **Páginas del PDF.**
Ruta, ids que faltan con su página y pacientes: `autonomo/bloques/b3/cobertura-3d.md` §1, §4, §5 y §6 (léelo por
trozos: `sed -n`).

## Grupos (orden de la ruta) y dueño de archivo
| Grupo | Fichas | Datos | Receta Visual |
|---|---|---|---|
| G1 respirador | 12 `neumo-vm-modos`, 13 `neumo-vm-ajuste`, 16 `neumo-peep-oculta` | `js/data/mayeutica/b3d-respirador.js` | `js/modules/neumologia/visual-3d-g1.js` |
| G2 obstructivo y VNI | 3 `neumo-epoc-vpp`, 1 `neumo-asma-epoc-basicos`, 2 `neumo-asma-agudo`, 10 `neumo-vni-metodos`, 11 `neumo-vni-uso` | `b3d-obstructivo.js`, `b3d-vni.js` | `visual-3d-g2.js` |
| G3 SDRA | 4 `neumo-sdra-diagnostico`, 6 `neumo-sdra-ventilacion`, 5 `neumo-sdra-no-ventilatorio` | `b3d-sdra.js` | `visual-3d-g3.js` |
| G4 oxígeno | 7 `neumo-o2-indicaciones`, 8 `neumo-o2-sistemas`, 9 `neumo-o2-toxicidad` | `b3d-oxigeno.js` | `visual-3d-g4.js` |
| G5 tubo, destete y NAV | 14, 15, 20, 21 · 17, 18, 19 | `b3d-tubo.js`, `b3d-destete.js`, `b3d-nav.js` | `visual-3d-g5.js` |
Archivos compartidos (`b3.js`, `neumologia/visual.js`, `merino-neumologia.html`, `pulmon-vivo-data.js`): una línea
por grupo; cada encargo dice cuál toca y solo uno a la vez. La versión (`autonomo/version.mjs`) la sube el director.

## Qué se hace por ficha (el «hecho»)
1. Interruptor **Texto | Estudiar** (recorrido Mira → Juega → Piensa → Examínate → Caso, y «Para profundizar») con
   el modelo de `b3b-tep.js`; las anclas `nep-` que falten (cobertura §4), sobre el texto que ya hay, sin reescribirlo.
2. Una pregunta por idea importante, en el orden del texto; «piensa antes», «piensa y destapa», «encuentra el
   error» (REGLAS §8); **nada de redactar, huecos ni emparejar**; cada pregunta, explicación y distractor con su
   `fuente` (REGLAS §1.11). Casos con los pacientes de cobertura §5 (5-8 pasos, un giro, ≥1 «error» y ≥1 «destapa»),
   cifras de los casos **del monitor de la app** (REGLAS §4.14), nunca del programa del motor.
3. «Compruébalo en el modelo» al estado del pulmón vivo (o capilar, ácido-base, shock) que lo muestra.
4. Receta de la vista Visual de la ficha, nodos por id (`fuente: '#id'`), «Ver en el texto».
5. Lo que el texto ya dice se cita; las discrepancias de cobertura §6 se usan como lo que dice la fuente, nunca como
   error del residente. Marino no da: resistencia, constantes de tiempo, objetivo de ΔP (no poner «<15»), tabla
   FiO₂/PEEP (enlace a `umi-respirador`).
6. Móvil 390 y 360 px sin desborde; ids únicos; nada de `&lt;` en los bancos.

## Decisiones tras la revisión del encargo (01/11)
- **No existen** (grep): en el pulmón hfno, prono, bipap, fuga-cuff, estridor, sbt-ansiedad, t-piece, imv,
  presion-media, hipercapnia-permisiva, disparo-inverso; en el capilar hipoxemia-tolerada, fio2-vo2,
  vasoconstriccion-o2, o2-toxico (hay normal, anemia, hipoxemia, umbral, dependiente, neutrofilo…); en el ácido-base
  asma-paco2-normal, epoc-cronica. Las lupas `tubo`, `boca`, `mito` del capilar son del cap. 12 (hematocrito,
  extracción, lactato): **no se usan** para la cánula, el neumotórax ni la cadena del O₂.
- **Lista cerrada de estados nuevos (≤5, uno por encargo, sonnet 30 pasos / 0,7 M, barrido de extremos)**: `hfno`,
  `prono` (G3-G4), `fuga-cuff` (con estridor como paso, G5), `sbt-ansiedad` (G5) y `disparo-inverso` (P2). Lo demás
  se enseña con los estados que ya hay variando el mando (imv, presión media, hipercapnia permisiva: Vt y FR sobre
  `sdra-protector`; bipap: `psv-disparo` + `cpap-eap`) o con la vista Visual («Mira»). Una ficha sin estado propio
  lleva «Juega» en el estado más cercano que existe o lo omite; nunca un «Compruébalo» que no enseña lo preguntado.
- Las cifras de un caso que pasa por un estado se leen del monitor de la app con `g4-app-cifras.mjs` (o la herramienta
  del pulmón en `autonomo/bloques/b3/herramientas/`); si un paso no tiene monitor, sus cifras salen de la ficha.
- Orden por grupo: estados nuevos del grupo → Estudiar (2 fichas por encargo) → receta Visual → jueces. Dueño de
  los archivos compartidos: el encargo en curso; el director lanza los encargos que tocan `b3.js`/`visual.js` de uno
  en uno (los de estado tocan solo `pulmon-vivo-data.js` y su prueba).
- `visual.js` importa `RECETAS_3D_GN` de cada `visual-3d-gN.js` y las funde en `RECETAS` (una línea por grupo).
- Las páginas son siempre del PDF: cap. 23 empieza en la p. 15 del primero; cap. 27 en la p. 1 del segundo.
- Kit Visual = `core/visual-kit.js` (barras, flujo, comparar, escalera…). Fichas 17-19: sin «Juega»; «Mira» en la Visual.
- `neumotorax-tension` ya existe (aprobado en la parada 2): la ficha 15 lo usa.
- Lo que ningún juez mide lo mira el profesor en su juicio (lista: «Compruébalo» abre el estado correcto, preguntas que
  no se aciertan sin estudiar, pacientes no repetidos, rótulos `ilustrativo`); el móvil lo mide `--ficha`.

## Piezas del modelo que pide Educación (Consejo 31/10, PR #74), en encargos aparte del Estudiar
- **P1** dibujo del corazón y del neumotórax en el pulmón vivo en vez de tarjetas de números (§7.4), sobre las
  cifras que ya da el motor; **P2** recuperación gradual tras descomprimir (unos ciclos, no instantánea) y estado
  propio `disparo-inverso`. Con barrido de extremos (REGLAS §4.16) y `--modelo pulmon-vivo` y `--modelo shock-vivo`.
- P1 y P2 son piezas de escena/motor: 1,2 M cada una (REGLAS §4.16), profesor rápido al acabar cada una.

## Lo que NO quiero
Reescribir el texto fiel; tarjetas de números donde cabe la imagen o el modelo; preguntas que se aciertan sin
estudiar; cifras del motor sin rótulo (`ilustrativo`/`fisiología general`); repetir pacientes de otros bloques.

## Jueces de cada grupo (los pasa el director, uno a uno)
`node autonomo/jueces.mjs --forma --ficha neumologia:merinoNeumologia:panel-merino-neumo-tabs:<id>` por ficha del
grupo; si toca el pulmón vivo, `--modelo pulmon-vivo` (y `--modelo shock-vivo` si toca M8). Auditor (sonnet) de las
preguntas, casos y figuras nuevas contra el PDF; profesor (fable) juzga: ≥8,75 en §7 y §8.

## Fase A ligera (01/11): 0 graves (`auditoria-a.md`)
- **Ojo**: los 5 criterios del SDRA son la **Tabla 24.2** (la 24.1 son las condiciones predisponentes); la cobertura §4
  las cruza. Ancla y pregunta, con la tabla que es.
- Fig. 23.3 paso 3: la app no copia el PEFR de las cajas «incompleta/pobre» (menor; no se pregunta por él).
- El 22 → 3 % del edema laríngeo sale de una figura no cotejada: el constructor de G5 lo mira en el PDF antes de preguntarlo.
