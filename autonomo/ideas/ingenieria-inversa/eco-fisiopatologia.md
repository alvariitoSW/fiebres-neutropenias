# eco-anatomia · Fisiología y patología del corazón del simulador, con las guías de la ASE (26/10/2026)

Encargo B-025. **No repite** el plan de anatomía ya decidido (`corazon-mas-real-plan.md`, bloques A-D, 13 encargos,
§5 bis) ni los informes de las webs (`echodemo-anatomia.md`, `echosuite-anesthbeta-anatomia.md`). Lo que añade: (1) cómo
late cada parte **desde el motor** y qué dice de ello cada PDF de `docs/` (Lang 2015, Mor-Avi 2011, Hahn 2013, Mitchell
2019; página = página del PDF); (2) cómo cambia la anatomía con cada escenario y forma de enfermedad, medido hoy en el
motor; (3) la anatomía que el plan deja fuera; (4) los encargos nuevos con su gasto y el total con el plan. Método:
`/ingenieria-reversa` (su código en memoria, nada guardado); capturas solo en `/tmp/plan-socialista/eco-anatomia/`.
Etiquetas: **visto** · **deducido** · **hueco** (sin fuente en la app).

## 0. Tesis
El latido de nuestro corazón ya es el que más se parece a la fisiología de las guías: medido hoy (`motor.mjs` +
`geomVi`, normal estable), FE 61 % (Lang 2015: 53-73 %, p. 7), DTDVI 54 mm (42-58, Tabla 4, p. 7), DTSVI 36 (25-40),
pared 9,7 → 14,4 mm (**+49 %**; Mor-Avi 2011: el 15 % de acortamiento del miocito se amplifica a >40 % de engrosamiento
radial, p. 11), TAPSE 20,7 mm (Lang: 24 ± 3,5, anormal <17, Tabla 9, p. 23), VD basal 30 mm y largo 72 (Lang: 33 ± 4 y
71 ± 6, Tabla 8, p. 20), pared del VD 4,0 mm (3 ± 1, 1-5), torsión neta 9,6° (Mor-Avi: 7,7 ± 3,5°, p. 14), FE del VD
53 % (Lang 3D: 58 ± 6,5, anormal <45, p. 23), aurícula izquierda 17-50 mL (≈26 mL/m², límite 34, p. 28), CIV/eyección/
RIV 35/296/91 ms (Alhakak, ya en `referencias.mjs`). **Ninguna de esas cifras está hoy en una prueba**: por eso lo
primero es un «paciente posible» del latido (F1) que las fije con su página. Lo que es falso o falta es **cómo** se
mueve cada pieza (la torsión va con el volumen y no con la activación; el VD baja por un peso angular; las aurículas no
se contraen; el tabique solo se aplana en diástole) y **cómo** enferma (sin colapso en el taponamiento, sin «beso» en la
hipovolemia, sin regiones, sin SAM). echodemo lo resuelve con formas clave a mano (`phenomesh.js` DISEASE: `under`,
`raFold`, `rvFold`, `swing`, `bob`, `hcmSam`…, visto); nosotros podemos sacarlo de presiones y activaciones que el
motor ya calcula. Esa es la diferencia que vale la pena construir.

## 1. Fisiología: cómo late cada parte hoy y qué dice la fuente
| Pieza | Hoy (visto en `corazon-geo.mjs` / `motor.mjs`) | La fuente (página) | Veredicto |
|---|---|---|---|
| Engrosamiento de la pared | volumen de miocardio constante: 9,7 → 14,4 mm (+49 %) en el normal; +20 % en el fallo, +15 % en la dilatada, +30 % en la hipertrofia | Mor-Avi p. 11: >40 % radial en el corazón normal; Lang Tabla 6 p. 17: septo y pared posterior 0,6-1,0 cm (varón), RWT 0,24-0,42 | **bien**; falta la prueba |
| Descenso de la base (MAPSE) | 13,3 mm (normal), 6,5 (fallo), 5,6 (dilatada), 4,5 (TEP); sale del cambio de longitud `Le` | **hueco**: MAPSE no está en estos cuatro PDF (Mor-Avi p. 25 solo habla del TAPSE) | marcar hueco en B1 |
| TAPSE | 0,285 mm por mL vaciado del VD: 20,7 (normal), 13,0 (hemorragia), 7,2 (TEP), 15,5 (fallo) | Lang Tabla 9 p. 23: 24 ± 3,5, anormal <17; p. 19: mide la función longitudinal del VD | **cifra bien, mecanismo falso**: el VD no baja porque su pared libre se acorte sino por un peso angular (`pesoVd`); el TAPSE debería salir del acortamiento longitudinal de la pared libre |
| Torsión | `tau = 0,12 × (120 − VTS)/75`: 9,6° normal, **11° en el TEP y en la hemorragia** (VI pequeño), 1,7° en el fallo, 0° en la dilatada | Mor-Avi p. 11: ápex antihorario y base horaria vistos desde el ápex; p. 14: 7,7 ± 3,5° (6,7 ± 2,9 <40 años; 10,8 ± 4,9 >60); p. 12: el 50-70 % del *untwist* ocurre en la relajación isovolumétrica, antes de abrir la mitral; p. 15: en la IC con FE baja la torsión cae | **medio falso**: el valor normal y la caída en el fallo cuadran por casualidad; subir con un VI vacío (TEP) no tiene fuente; el *untwist* no existe (la torsión deshace con el volumen, no antes de la mitral). **B3 lo cubre**: estas son sus cifras |
| Válvulas | abren con el flujo del motor y se abomban con el gradiente (visto); en el latido normal: mitral cierra al 10 % del ciclo, aórtica abre al 23 % y cierra al 56 %, pulmonar abre al 21 % y cierra al 62 %, tricúspide abre al 65 %, mitral al 69 % (medido en `motor.onda`) | Lang p. 6: tiempos de apertura y cierre como referencia del ciclo; Alhakak (atlas) para CIV/eyección/RIV | **bien** (la pulmonar abre antes y cierra después que la aórtica, como debe); falta la prueba |
| Aurículas | cúpulas cuyo tamaño sigue al volumen (`kAu`, exponente 0,45) y se estiran con el pistón; **no cambian de forma en la contracción auricular** | Lang p. 20: el pistón del plano AV llena la AI en sístole (tres papeles de la AI, reservorio-conducto-bomba, p. 20-25); p. 28: volumen de la AI ≤34 mL/m², AD 25 ± 7 / 21 ± 6 mL/m² | **falta la bomba**: la fase A debería verse como la aurícula encogiendo hacia el anillo |
| Tabique | aplanamiento solo por gradiente VI−VD del instante: en el TEP se aplana en diástole y vuelve a curvarse en sístole; en el normal, nunca | Atlas 14 (Ryan 1985, ya citado): sobrecarga de presión → aplanado en telesístole; de volumen → en diástole. `motor.mjs:148` dice que «el tabique se aplana al final de la sístole» | **comprobar** (F4): medir el índice de excentricidad del modelo en telesístole del TEP a fondo (PAPs 43 mmHg) y ver si llega |
| VD | pared que engruesa poco (4,0 → ~4,5 mm; B4 lo cubre), infundíbulo que no se contrae, media luna que no cambia su forma al latir (solo `A`) | Lang Tabla 8 p. 20: RVOT proximal 28 ± 3,5 mm, distal 22 ± 2,5 (el nuestro, 15 × 21 mm de orificio: **pequeño**); Tabla 9 p. 23: FAC 49 ± 7 %, anormal <35; S′ 14,1 ± 2,3 cm/s | **falta el acortamiento de la pared libre** y una FAC medible (F5) |
| Papilares y cuerdas | tubos fijos entre dos puntos del endocardio (se mueven con la pared) | Hahn p. 23: cuerdas de 1.º orden al borde libre, de 2.º al cuerpo, de 3.º a la base de la valva posterior; el papilar anterolateral sirve a la comisura lateral y el posteromedial a la medial | **B4 y A1 lo cubren**; la jerarquía de cuerdas es anatomía nueva (hueco en el plan: va en C1) |

## 2. Patología: qué cambia hoy en el modelo (medido) y qué se ganaría
Medido hoy con `aplicarEscenario` (gravedad de siempre) y 5 s más; «VI a/b» = VTD/VTS en mL.
| Escenario | Lo que el motor y la geometría dan hoy | Lo que falta y de dónde sale |
|---|---|---|
| Hemorragia 1 L | VI 85/35, FE 57, DTS 32 mm, PAM 77, FC 86, TAPSE 13 | **«beso de papilares»**: ni a fondo (42 % de la volemia) el VTS baja de ~35 mL porque la hemorragia entra a su ritmo y `LIMITES.vi` corta en 35 mL. Hace falta: motor con VTS ≤ 15-20 mL en la hipovolemia grave (Ees ↑ del barorreflejo ya existe) y geometría hasta ~10 mL con la cavidad cerrándose en el eje corto (P2). Fuente clínica del signo: Manual UMI (FATE) y Marino caps. 14-17; cifra del VTS: **hueco** |
| Fallo del VI | VI 156/106, FE 31, pared +20 %, MAPSE 6,5, torsión 1,7°, PCP 17 | nada grave: cuadra con Mor-Avi p. 15 (torsión que cae con la FE). Falta la **acinesia por territorio** (C2a/b, espera a las coronarias; Lang p. 10-11: 17 segmentos, el 17.º no se puntúa) |
| Derrame 260 mL / 388 a fondo | VI 88/37, PVC 6,7; a fondo: PAM 45, VI 38/20, `pperi` máx. 9,9 mmHg | **colapso de la AD y del VD**: en el motor la presión de cada cámara ya lleva `pperi` dentro, así que `pperi − pad` nunca es >0 (medido: 0,0); el criterio geométrico es la **presión transmural ≈ 0** (`pad − pperi` o `pvd − pperi` por debajo de ~1 mmHg en su fase: AD en telediástole-sístole, VD en diástole precoz). Derrame declive (más líquido detrás) y corazón que oscila. Fuentes en la app: Marino Fundamentos y Merino (colapso de cavidades derechas), Fisiopatología UCI · Cardiología (P1) |
| TEP | VI 53/26, VD 202/176 (**FE del VD 13 %**), VD basal 45 mm, TAPSE 7,2, PAPs 43, FC 110, torsión 11° | criterios de Lang para la prueba: VD basal >41 mm (p. 17), FAC <35 % (p. 23), FE VD <45 % (p. 23); **McConnell** (Atlas 14) espera a C2a; VCI dilatada ya la da el abdomen; la torsión alta es un artefacto de la fórmula (B3) (P4) |
| Hipertrofia | VI 85/38, pared 16 → 21 mm (+30 %), RWT alto; **PCP 24 mmHg, PAPs 37, FE del VD 31 %, AI 43-59 mL** | el escenario es un paciente con hipertensión pulmonar poscapilar e IC derecha, no una hipertrofia compensada: revisar la gravedad por defecto contra Lang/paciente posible (P7). Falta la **septal asimétrica con SAM** (P3; necesita masa por regiones: después de C2a) |
| Dilatada | VI 215/160, FE 25, DTD 68 mm (>58, Lang p. 7), torsión 0°, PCP 23, AI 38-59 | **AI dilatada medible** (>34 mL/m², Lang p. 28: el modelo no indexa el volumen auricular) e **IM funcional** por anillo dilatado y «tenting» (motor: `eroaMitral` ya existe; anatomía de la IM: Zoghbi 2017, **sin PDF**) (P5) |
| Nuevas con fuente parcial | — | **hipertrofia del VD / HTP crónica**: pared del VD >5 mm (Lang Tabla 8 p. 20: 1-5 mm), `mioVd` ya existe; **amiloidosis**: pared del VI, VD y septo IA gruesos (guía ESC de IC, en la app; cifras **hueco**) (P6) |

## 3. Anatomía: solo lo que el plan deja fuera (y qué encargo cubre el resto)
Ya cubierto: ápex y VI (B2), aurículas más anatómicas (B2), papilares y pared del VD (B4), cortina aorto-mitral (B5),
festones y cúspides (C1), cuerdas y trabéculas en la imagen (A1), brillo por tejido (A2), sombra de calcio y columna en
la supraesternal (A3), regiones (C2, espera), eco real al lado (D1), esófago (ETE, parada 3). **Queda fuera**:
- **Septo interauricular** (N1): hoy la AI y la AD son dos cúpulas separadas, sin pared común ni fosa oval; en A4C y
  subcostal se ve el hueco (captura). Mitchell 2019 pide verlo en el subcostal (p. 31) y describe la válvula de
  Eustaquio y el seno coronario entrando en la AD (p. 25-26). Visto en echodemo: `ias: 5 mm` (ilustrativo, no fuente).
- **VD en U con ápex trabeculado y banda moderadora visible** (N2): la media luna acaba al 82 % del VI y en A4C sale
  tubular y estrecho (captura frente a echodemo, que lleva banda y trabéculas procedurales, `rvdetail.js`). Mitchell
  p. 26: en A4C el VD es triangular y bastante menor que el VI, con la banda moderadora en su parte apical; Lang Tabla 8
  p. 20 da las tres medidas (basal 33 ± 4, media 27 ± 4, largo 71 ± 6) y el RVOT (28 ± 3,5 / 22 ± 2,5) para la prueba.
- **Aorta descendente, pleura-pulmón y columna como anatomía** (N3): en PLAX y A4C no hay círculo de la aorta
  descendente detrás de la AI (captura; en echodemo sí); la rama eco-mega pinta la sombra de costilla y la «ventana
  pobre» como artefactos sin pieza. Mitchell p. 61: la aorta descendente se busca detrás de la AI en PLAX y SSN.
- **Anillos**: el mitral no es una silla de montar y ninguna medida de anillo tiene fuente; Lang p. 28 solo da la raíz
  aórtica (anillo, senos, unión sinotubular). Va dentro de B1 como «hueco» salvo la raíz.
- Lo visto en echodemo que **no** traemos: `heart.json` (escultura sin licencia vista), formas clave a mano.

## 4. Encargos nuevos (mismo formato que el plan; coste = constructor + director + verificador)
Barato ≈ 1,1 M por 100 pasos; potente ≈ 5 M por 100 pasos; profesor 0,25 M por juicio. **Optimizado** = encargo con
líneas exactas y pares de prueba escritos (menos pasos), un solo juicio salvo nota <8, sin auditor cuando no hay fuente
nueva, potente solo en la primera vuelta y los arreglos en barato.
| # | Mejora | Qué ve y para qué | Fuente (página) | Archivos | Prueba (entrada → salida) | Pasos | Modelo | Normal | Optim. |
|---|---|---|---|---|---|---|---|---|---|
| F1 | **Paciente posible del latido**: tiempos valvulares y fases, engrosamiento, torsión, TAPSE, FAC, VD basal/medio/largo, pared del VD, FE del VD, AI/AD indexadas; marcas «hueco» (MAPSE) | la leyenda del simulador con «normal» y su página; red para todo lo demás | Lang Tablas 4, 6, 8, 9 (p. 7, 17, 20, 23), p. 28; Mor-Avi p. 11, 12, 14 | `pruebas/paciente-posible.test.mjs` (el de B1), `referencias.mjs` | normal: cada cifra de §0 dentro de su banda; fallo: torsión < normal; TEP: VD basal >41 y FAC <35; si no llega, `pendiente`, nunca se toca la referencia | 40-60 | barato | 0,7 M | 0,5 M |
| F3 | **Bomba auricular y pistón**: la aurícula encoge hacia el anillo en la fase A (de `s.eAi/eAd` del motor) y el plano AV que baja estira la aurícula → onda S de las venas pulmonares (pendiente del README) | ve la contracción auricular en A4C y entiende la onda A y el S/D venoso | Lang p. 20 (papeles de la AI); fisiología general para la forma | `corazon-geo.mjs` (cúpula con `encoger` por activación), `doppler.mjs` (venas pulmonares) | fase A: volumen de la AI baja y su altura `H` baja con él; sístole: S > D en venas pulmonares del normal; prueba del saco sigue en verde | 60-80 | barato | 1,0 M | 0,7 M |
| F4 | **Tabique en telesístole**: índice de excentricidad del modelo en TD y TS para el TEP a fondo; si no se aplana en TS con sobrecarga de presión, afinar `aplanamientoSeptal` con el retraso de relajación del VD que el motor ya tiene | en el eje corto ve la «D» cuando toca: diástole (volumen) o sístole (presión) | Atlas 14 (Ryan 1985): TS 1,44 ± 0,16 en la sobrecarga de presión; Merino Fig. 18.2 | `formas.mjs`, `pruebas/enfermedad.test.mjs` | TEP a fondo: IE TS > 1,1 (echodemo cita Humbert 2022 Tabla 10 para 1,1: **sin PDF, hueco**; usar Ryan) y normal IE ≈ 1 en TD y TS | 30-50 | barato | 0,5 M | 0,4 M |
| F5 | **VD que late como VD**: la pared libre se acorta (TAPSE = acortamiento de la pared libre, no un peso angular), el infundíbulo se contrae, FAC medible en el A4C del modelo | el VD deja de «latir de cartón»; TAPSE y FAC con sentido | Lang p. 19 (TAPSE mide la función longitudinal), Tabla 9 p. 23 (FAC 49 ± 7), Tabla 8 p. 20 (RVOT) | `corazon-geo.mjs` (`pesoVd`, `infundibulo`), `ecografia.mjs` (`medidasCorazon`: FAC) | normal: TAPSE 17-31 mm medido en el anillo lateral; FAC 35-63 %; TEP: FAC <35 y TAPSE <17; formas precalculadas siguen mezclando | 70-90 | barato | 1,1 M | 0,8 M |
| N1 | **Septo interauricular** con fosa oval (más fino), seno coronario y válvula de Eustaquio en la AD | en A4C y subcostal ve la pared común y el septo IA (base del shunt y de la punción) | Mitchell p. 25-26, 31 (qué se ve; grosor **hueco**) | `corazon-geo.mjs` (pieza `Septo IA` entre las dos huellas), `ecografia.mjs` (`TIPOS`) | A4C y SC4C: una sola pared entre AI y AD en todo el latido, sin sangre entre ellas; `geometria.test.mjs` en verde | 60-80 | barato | 0,9 M | 0,6 M |
| N2 | **VD en U**: tracto de entrada, ápex trabeculado que llega cerca del ápex del VI, banda moderadora visible, RVOT al tamaño de Lang | el A4C con un VD triangular y la banda, como pide la guía | Mitchell p. 26; Lang Tabla 8 p. 20 | `corazon-geo.mjs` (`ventana`, `Wb`, `perfilZ`, `lVdRel`, `anilloRVOT`), `ecografia.mjs` (dB de banda y trabéculas) | A4C del normal: VD basal 25-41, medio 19-35, largo 59-83 mm; RVOT proximal 21-35; área VD/VI <0,6 (Ficha 11); banda moderadora en el corte del A4C | 80-100 | barato (si cae 2 veces, potente) | 1,2 M | 0,8 M |
| N3 | **Aorta descendente, pleura-pulmón y columna** como piezas: el círculo detrás de la AI en PLAX/A4C; la sombra de pulmón y de columna salen de la pieza, no de un artefacto | aprende a buscar la aorta descendente (derrame pleural frente a pericárdico) | Mitchell p. 61 (PLAX y SSN); física general para la sombra | `corazon-geo.mjs` (prolongar `aorta`), `abdomen-puntos.mjs` o pieza nueva, `ecografia.mjs` (`TIPOS`) | PLAX: círculo de ~20 mm detrás de la AI; SC4C: columna con sombra; sin pulmón en apical | 60-80 | barato | 0,9 M | 0,6 M |
| P1 | **Taponamiento con colapso**: pliegue de la AD cuando `pad − pperi` < ~1 mmHg (telediástole-sístole) y de la pared libre del VD en diástole precoz; derrame declive; oscilación; criterios de ficha | ve el colapso de la AD y del VD y el corazón que baila: el signo que decide una pericardiocentesis | Marino Fundamentos y Merino (colapso de cavidades derechas), Fisiopatología UCI · Cardiología; echodemo `raFold`/`rvFold`/`swing` como idea | `corazon-geo.mjs` (pesos locales de hundimiento), `escenarios.mjs` (`CRITERIOS_FORMA.derrame`), `enfermedad.test.mjs` | normal: cero pliegue; derrame a fondo: pared de la AD invertida ≥1/3 del ciclo y VD plegado en diástole precoz; volumen dibujado = volumen del motor ±2 mL | 90-100 | **potente** (modelo nuevo) | 5,0 M | 3,5 M |
| P2 | **Hipovolemia con «beso»**: VTS ≤ 15-20 mL en la hemorragia a fondo (motor) y geometría hasta ~10 mL con la cavidad del eje corto cerrándose; VD pequeño | en PSAX ve los papilares tocarse: el signo de «dale volumen» | Manual UMI (FATE), Marino caps. 14-17; cifra del VTS **hueco** | `motor.mjs` (hemorragia a fondo), `corazon-geo.mjs` (`LIMITES.vi`, `geomVi` con `Rm` → 0), `escenarios.mjs` criterios | hemorragia a fondo asentada: área de sangre en PSAX papilares ≤10 % de la telediastólica; PAM 45-60 (paciente posible) | 60-80 | barato | 1,0 M | 0,7 M |
| P4 | **TEP con los criterios de Lang**: VD basal >41, FAC <35, FE VD <45, VCI dilatada; «60/60» del Atlas 14 si el Doppler lo da | la lista de signos del TEP completa con su página | Lang p. 17, 20, 23; Atlas 14 | `escenarios.mjs` (`CRITERIOS_FORMA.tep`), `enfermedad.test.mjs` | TEP por defecto cumple los 4 nuevos; normal no cumple ninguno | 40-60 | barato | 0,7 M | 0,5 M |
| P5 | **AI dilatada medible** (volumen auricular indexado) e IM funcional por anillo dilatado y «tenting» cuando esté Zoghbi 2017 | en la dilatada ve la AI grande (>34 mL/m²) y, después, el chorro de IM | Lang p. 25, 28 (34 mL/m²; método de discos); IM: **sin PDF** | `ecografia.mjs` (`medidasCorazon`), `escenarios.mjs`, `corazon-geo.mjs` (coaptación bajo el anillo) | dilatada: AI >34 mL/m²; normal <34 | 60-80 | barato | 1,0 M | 0,7 M |
| P6 | **Hipertrofia del VD / HTP crónica** (pared del VD >5 mm, `mioVd`, tabique aplanado en sístole) y amiloidosis si llega su fuente | distingue la sobrecarga aguda (TEP: pared fina) de la crónica (pared gruesa) | Lang Tabla 8 p. 20 (pared 1-5 mm); Atlas 14 (Ryan); amiloidosis: guía ESC de IC, cifras **hueco** | `escenarios.mjs` (forma nueva), `enfermedad.test.mjs` | pared del VD >5 mm en TD; PAPs > normal; TAPSE conservado al principio | 60-80 | barato | 1,0 M | 0,7 M |
| P7 | **Revisión «paciente posible» de los escenarios**: la hipertrofia por defecto deja PCP 24, PAPs 37 y FE del VD 31 %; la dilatada PCP 23; afinar gravedades por defecto | cada escenario es un enfermo que existe | Lang Tablas 4, 8, 9; Ficha 5 (presiones) | `escenarios.mjs` (gravedad por defecto), pruebas existentes | cada escenario por defecto dentro de las bandas de F1 salvo lo que su enfermedad rompe (y eso, citado) | 40-60 | barato | 0,7 M | 0,5 M |
| P3 | **MCH: septo asimétrico + SAM + gradiente dinámico** (después de C2a: masa por regiones) | ve el SAM y el gradiente que sube con el Valsalva | Merino Cardiología y guía ESC (hipertrófica); SAM: **hueco** | `corazon-geo.mjs`, `motor.mjs` (resistencia del TSVI por hueco valva-septo), `escenarios.mjs` | septo basal >15 mm con pared posterior normal; gradiente del TSVI que sube al bajar la precarga | 90-100 | **potente** | 5,5 M | 4,0 M |
| — | Juicios del profesor (2 paradas nuevas) y director de sesión corta | | | | | | | 1,5 M | 1,0 M |

Lo que **no** hace falta como encargo nuevo: torsión (B3, con las cifras de §1), papilares y pared del VD (B4), cuerdas
por órdenes (C1), MAPSE (B1 lo marca «hueco»).

## 5. Gasto total y orden
| Bloque | Normal | Optimizado | Nota |
|---|---|---|---|
| Plan aprobado (A1-A3, B1-B5, C1, D1, encargo 0, paradas; B2 en potente) | 21 M | 17,5 M | el plan ya era barato; el ahorro sale de 1 juicio por parada, C1 y B2 con solo la primera vuelta en potente y arreglos en barato |
| C2a + C2b (esperan a las coronarias) | 7 M | 5,5 M | fuera del total hasta que el usuario las active |
| Nuevo: fisiología (F1, F3, F4, F5) | 3,3 M | 2,4 M | |
| Nuevo: anatomía que faltaba (N1, N2, N3) | 3,0 M | 2,0 M | |
| Nuevo: patología (P1, P2, P4, P5, P6, P7) | 9,4 M | 6,6 M | P1 es el único en potente |
| P3 (MCH, espera a C2a) | 5,5 M | 4,0 M | fuera del total con C2 |
| Juicios y director de lo nuevo | 1,5 M | 1,0 M | |
| **Total sin C2 ni P3** | **38,2 M** | **29,5 M** | |
| **Total con todo** | **50,7 M** | **39,0 M** | |
| Núcleo nuevo recomendado (F1, F5, N2, N3, P1, P2, P4) | 10,6 M | 7,4 M | lo que más enseña por token |

**Orden recomendado** (encajado en las paradas del plan): 0 → A1 → **B1 + F1** (mismo archivo de pruebas, el mismo
constructor) → A2 → **B2 + N2** (el VD en U se hace con la misma red de pruebas y detrás del VI) → A3 → **N3** → B3
(con las cifras de §1) → *parada 1* → B4 → **F5** → B5 → **P2** → C1 → **P1** → *parada 2* → D1 → **P4 → P7 → N1 → F3 →
F4 → P5 → P6** → *parada 3* → (C2a → C2b → P3 cuando entren las coronarias). Cada encargo copia sus pares de prueba
de arriba y nombra sus líneas (`corazon-geo.mjs` 572-590 `pesoVd` y `mover`, 459-480 papilares, 619-700 `baseGeometrica`;
`formas.mjs` 44-48 `aplanamientoSeptal`; `escenarios.mjs` 119-152 `CRITERIOS_FORMA`; `motor.mjs` 307-309 tabique y
`pperi`, 504-520 `ultimo`).

## 6. Decisiones del usuario
1. ¿Entran los encargos nuevos en la parada 2 de `eco-mega` (núcleo: F1, F5, N2, N3, P1, P2, P4) o solo los de
   fisiología/patología y la anatomía que faltaba espera? Propuesta: el núcleo entero, en el orden de arriba.
2. **Por qué capa empezar**: lo que más enseña en la guardia es P1 (taponamiento con colapso) y P2 (beso de papilares);
   lo que más se nota en la imagen es N2 (VD en U). Propuesta: F1 primero (red), después P2 y P1.
3. P7 cambia las gravedades por defecto de hipertrofia y dilatada (hoy, pacientes con PCP de 23-24 mmHg): ¿se afinan
   o se dejan como «forma grave» con su nota?
4. PDF que faltan para lo marcado «hueco»: Zoghbi 2017 (IM, para P5), guía ESC/ERS 2022 de HP (índice de excentricidad
   1,1, para F4/P6), guía ESC de amiloidosis (P6), una fuente del MAPSE y del VTS en la hipovolemia (B1, P2).
5. Si prefiere que P1 vaya en barato con riesgo de segunda vuelta (−1,5 M), se puede: el motor ya da las presiones.

## 7. Cómo se hizo y lo que no se pudo ver
- Visto: `corazon-geo.mjs`, `formas.mjs`, `escenarios.mjs`, `motor.mjs` (activación, tabique, `ultimo`), `ecografia.mjs`
  de `auto/eco-mega` (`TIPOS`); medidas con Node sobre el motor y la geometría (§0-§2); echodemo en local (clon servido
  en 8012: `pheno.js`, `ch/rv.js`, `ch/peri.js`, `ch/shock.js`, `ch/segments.js`, `ch/hcm.js`, `gl/phenomesh.js`,
  `gl/rvdetail.js`, `gl/skirts.js`); anesthbeta y EchoSuite en vivo (una pantalla cada una). PDF: solo las páginas
  citadas (texto extraído por página y leído por lotes).
- Capturas (fuera del repositorio, en la página del informe): nuestras 12 (3D, 4 vistas normales, 7 con enfermedad),
  echodemo 4 (mismas vistas), anesthbeta 2, EchoSuite 1.
- No visto: licencias de HuBMAP en origen (sigue bloqueado); el banco de válvulas de anesthbeta en esta pasada; un
  móvil real; el VTS de la hemorragia **asentada** a fondo (se midió 5 s después de aplicarla: la sangre sale a su
  ritmo). `commons.wikimedia.org` responde hoy (200): D1 puede lanzarse.
- Ninguna cifra de las webs es fuente; las de las guías entran con su página (CLAUDE.md §7.1-7.2).
