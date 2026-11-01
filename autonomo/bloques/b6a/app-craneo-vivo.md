# Cráneo vivo en la app (b6a, paso 3) · clave `craneo-vivo`, vista `craneoVivo`, prefijo `crv-`
Rama wt/b6a-crv (worktree /tmp/wt-crv), con commit; sin push.

## Hecho (✅/❌)
- ✅ Maqueta entera en la app, desde la portada (`crv-menu-libros`) y 5 botones de ficha (`mn-hic` Abundio, `mn-hsa` Petronila, `mn-ictus-complicaciones` Clotilde, `mn-coma` Leovigildo, `mn-muerte-encefalica` Abundio paso 4). La prueba los abre uno a uno: llegan al paciente y paso, y «← VOLVER A LA FICHA» regresa.
- ✅ Cada cita lleva «PDF p. N» y «Ver en la ficha» (enlace cruzado real a su pestaña, `TAB` en los datos). Explicación guiada de 3-5 pasos en los 5 pacientes; fuentes como lista.
- ✅ Retoques del rejuicio: (1) sello del tronco por estadio (4 «descerebración», 5 «flácido: tronco bajo», p. 10): masa 76 y 78; (2) Petronila nace con PAS 130, PIC 11, GCS 9 y «Resangrado» solo con t ≥ 1; (3) causa del giro en el paso 4 de Abundio; (4) cambio de paciente limpia resang/vaso/sin flujo.
- ✅ Motor: PIC ≤80, PAM ≤150, sello «sin flujo» con PIC ≥ PAM, HSA sin uncal, Na⁺ >155 con sello; 12.600 combinaciones sin PIC≥PAM sin sello ni PPC≤0.
- ✅ Rótulo mínimo del corte a 360 px: 9,19 → 9,87 px en pantalla (fuente 11 px en el SVG; rótulos de los plegables a 11).
- ✅ Botones del dock creados una vez y repintados. Sin Mayéutica del motor común (siguiente encargo).
- ✅ Sello bajo el monitor (CSS `crv-`, sin tocar `js/core/`).
- Pieza común: `js/modules/libros/craneo-vivo/cara.js` (`dibujarCara`, `pupilaDe`, `textoPupila`, `dibujarMano`, `PUP`, `MANO`); `U` y `TIPOS` exportados desde `js/data/craneo-vivo-data.js`. `caraGlasgow` de la ficha no se tocó y no es el mismo dibujo (la de la maqueta salió de la Visual con marca TODO y añade pupilas y mano).

## Lista R2 (maqueta → app)
~~corte coronal con uncus/tienda/tronco~~ ~~cara y mano~~ ~~monitor PA/PAM/PIC/PPC/GCS/Na/tiempo~~ ~~5 pacientes~~ ~~Apuesta, Error (2), Caso (Abundio y Segismundo)~~ ~~guía por paciente~~ ~~plegables caja cerrada, autorregulación/CO₂, penumbra, Doppler~~ ~~imagen real por tipo~~ ~~fuentes, notas, «para profundizar», «lo que crecerá»~~ ~~topes con sello y mandos apagados~~ ~~oculto en la apuesta~~. Todo comprobado por la prueba.

## Cambios que NO estaban en la maqueta (el juez de topes los pidió)
Botones sin consecuencia al ×15: añadidos 4 sellos del motor (`modelo.js`): `tronco` (la masa no aplica en el cautiverio, p. 3), `dren3` (3 tramos de LCR), `mani3` (3 dosis de manitol), `tmax` (hematoma 12 h; resto 14 días, vasoespasmo p. 48). Los límites 3/3/12 h/14 d son del modelo (ilustrativos; la ficha no da dosis máxima): **R3: pido criterio del profesor** si quiere otro tope.

## Prueba y jueces
- `node autonomo/pruebas/craneo-vivo.mjs [390|360]` (sale de herramientas/craneo-b.mjs): barrido de extremos (5 tipos × masa 0/50/100; PAS 70/146/214), cifras en texto; ejemplos: hematoma masa 100 PIC 80 PAM 95 PPC 15 sello desc; PAS 70 + masa 100 sello «sin flujo»; hipertónico ×4 Na 158 sello; solapes, rótulos ≥9 (corte) / ≥8 (plegables), imágenes, 5 botones de ficha, cambio de paciente, apuesta/error/caso. Resultado: TODO EN VERDE a 390 y 360, consola limpia.
- `jueces.mjs --modelo craneo-vivo`: todo en verde (imágenes, quiz, caché, ids, nombres internos, rótulos, móvil 390/360, topes). `--forma`: verde (el cráneo no aparece en sus listas de tests: no tiene Mayéutica aún).
- Capturas: /tmp/plan-socialista/b6a/crv/ y /tmp/plan-socialista/b6a/capturas/crv/.

## Archivos
Nuevos: `js/modules/libros/craneo-vivo/{index,pagina,modelo,cara,corte,guia,injertos,pruebas,pruebas-seg}.js`, `craneo-vivo.html`, `js/data/craneo-vivo-data.js`, `autonomo/pruebas/craneo-vivo.mjs`. Tocados (solo mi hueco): `js/modules/libros/index.js`, `index.html`, `css/components.css`, `marino-portada.html`, `marino-neuro.html` (5 botones), `jueces-forma/-movil/-topes.mjs`. Versión 20261101-50.

## Visto de paso
- El «test de apnea» no existe en la maqueta (está en «lo que crecerá»): `mn-muerte-encefalica` abre Abundio en el paso del tronco comprimido, no en la apnea.
- La prueba ya sale con código ≠0 si falla.

## No comprobado / riesgo
Capturas visuales solo vistas a 390 (la primera pantalla); lista de frases nuevas = `frases-craneo-b.md` (sin frases nuevas aparte de los 4 sellos de arriba, que necesitan cita/criterio). No he corrido la suite entera ni la eco.
