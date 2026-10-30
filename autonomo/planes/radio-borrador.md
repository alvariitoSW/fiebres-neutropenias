# Borrador PIF Radiología (tórax y neuro) — lector-fuente, 30/10/2026
Rutas = archivo · id del panel/pestaña. «RA» = Radiology Assistant. «NR» = NavRad. Cifras de RA/NR: solo «para buscar fuente».
URLs: solo las que salen literales en los informes (RA: abiertas con 200 el 23/10). Si no hay: «fuente por buscar».
Base: RA basic-interpretation https://radiologyassistant.nl/chest/chest-x-ray/basic-interpretation · lung-disease https://radiologyassistant.nl/chest/chest-x-ray/lung-disease

## 1. Temario (2 cuadernos). Formato: idea · tarjeta de guardia · ya en la app · del informe · fuente
### A. Tórax de UCI (objetivos radio-torax). 8 fichas
1. **Lee la placa portátil de UCI** · de dentro afuera, siempre con la previa · «Lee la placa en 30 s» (7 pasos: previa, vía central y tubos, mediastino, pleura, diafragma, zonas escondidas, patrón) · fig. Merino en `neumologia/merino-neumologia.html` · RA-2 §3 y megaproyecto 1 (el orden; contenido nuestro; RA no trae dispositivos de UCI, RA-2 §2) · RA basic-interpretation.
2. **Tubo endotraqueal: ¿dónde está la punta?** · punta en vía, no en bronquio · «¿Punta del tubo?» 4 pasos (carina, altura, simetría, selectivo) · `neumologia/merino-neumologia.html` · `neumo-vias-artificiales` (figs. 28-1 y 28-2; calculadora `#neumo-et-altura`/`#neumo-et-resultado`); capnografía `mar-capnografia` (marinoFundamentos, `panel-marino-fund-tabs`); `umi-rsi` · del informe: rótulos SVG sobre esas figuras (RA §4.7) · fuente: Merino/Marino (ya en app); RA no cubre ET.
3. **Vía central y Swan: ¿bien puesta?** · punta a la altura de la carina, encima de la unión cava-aurícula (pie de la fig. 2.6) · «¿Punta del catéter?» 3-5 pasos + «¿neumotórax tras pinchar?» · `libros/marino-fundamentos.html` · `mar-cvc-complicaciones` (figs. 2.5 y 2.6), `mar-cvc-sitios`, `mar-cateter-ap`; chips de `sobrevivir-umi/tecnicas-r1.html` · del informe: NR-3 §3 (nivel carina/ácigos, VCS) y RA-2 par 4 (Swan en rama periférica: retirar) · fuente: RA cardiovascular-devices https://radiologyassistant.nl/cardiovascular/devices/cardiovascular-devices (solo Swan; no CVC).
4. **Sonda nasogástrica y drenaje torácico** · sonda recta por mediastino, no al pulmón; sistema de drenaje y sus fallos · «¿Sonda en el estómago?» 3 pasos · `libros/marino-nutricion.html` · `mu-pauta-enteral` (figs. 49.2 y 49.3; `panel-marino-nutri-tabs`); `neumologia` · `neumo-cuidado-barotrauma` (tubo torácico, sistema de drenaje) · informe: RA no cubre SNG ni drenaje (RA-2 §2) · fuente por buscar fuera de nuestros libros (¿hace falta? ya está Marino).
5. **Neumotórax, derrame y tensión** · surco profundo, diafragma deprimido, decúbito que esconde · «¿Neumotórax tras pinchar?» (pares con/sin rótulos) · `neumo-cuidado-barotrauma` (figs. 28-5, 28-6, 28-7), `mar-cvc-complicaciones` (`#mar-neumo-eco`) · RA-2 §3 y pares 1-2 (derrame masivo con broncograma = atelectasia por compresión; cifras 200-300 mL y 30 % en decúbito: buscar fuente) · RA basic-interpretation.
6. **Patrones y edema** · 4 patrones (consolidación, intersticial, atelectasia, nódulos) y edema: cardiogénico, sobrecarga o SDRA por pedículo vascular · tarjeta «¿cardiogénico, sobrecarga o SDRA?» · `neumo-sdra-diagnostico` (fig. 24-2), `neumo-nav-diagnostico` (fig. 29-3); IC: guía ESC 2026 (ruta no localizada) · RA §3 y RA-2 par 3 («encuentra el error»: consolidación con pérdida de volumen = atelectasia); diferenciales en `.data-table` no en imagen · RA lung-disease, RA heart-failure https://radiologyassistant.nl/chest/chest-x-ray/heart-failure
7. **Ecografía torácica** · desliz pleural, líneas B, BLUE · tarjeta: ya existe BLUE · `sobrevivir-umi/manual-umi.html` · `umi-blue` (`panel-manual-umi-tabs`); fig. 28-6 en `neumo-cuidado-barotrauma`; `#mar-neumo-eco` · el módulo `js/modules/eco/` es cardíaco: no tiene eco pulmonar (solo `torax.mjs`, aorta/pleura de apoyo) · informes: nada (RA no es eco) · fuente por buscar.
8. **Introducción a TC/TCAR** · mismo corte en 3 ventanas; TEP en angio-TC; patrones TCAR (nódulos perilinfáticos/centrolobulillares/aleatorios) · «Rx o TC?» y ventanas (NR §4.8/navrad-2 §6.6) · `neumo-ep-diagnostico` (fig. 22-1), `neumo-sdra-diagnostico` (fig. 24-3) · RA §4.5 (algoritmo en vista Visual recreada) · RA hrct https://radiologyassistant.nl/chest/hrct/basic-interpretation y https://radiologyassistant.nl/chest/hrct/common-diseases; ventanas W/L: **fuente por buscar** (NR no es fuente).

### B. Neuro urgente (objetivos neuro-radio). 6 fichas
1. **TC de cráneo en 5 preguntas** · ¿sangre? ¿dónde? ¿suturas? ¿línea media/cisternas? ¿hipodensidad? · tarjeta `initSiNoWizard` de 5 pasos (es la pieza de RA-2 megaproyecto 4) · `sobrevivir-umi/manual-umi.html` · `umi-tce-dx`, `umi-marshall` (tabla + calculadora `umi-mar-*`) · RA-2 §3 (localizar primero) · RA traumatic https://radiologyassistant.nl/neuroradiology/hemorrhage/traumatic-intracranial-haemorrhage y non-traumatic https://radiologyassistant.nl/neuroradiology/hemorrhage/non-traumatic-intracranial-hemorrhage
2. **ACV isquémico vs hemorrágico** · TC descarta sangre; signos precoces (cinta insular, núcleo lenticular, ACM hiperdensa) · «¿isquémico o hemorrágico?» 4 pasos · `libros/marino-neuro.html` · `mn-ictus-soporte`, `mn-ictus-complicaciones`, `mn-hic` (OJO: es la hemorragia intracerebral, no la HTIC), `panel-marino-neuro-tabs` · RA-2 §3 y par 7 (cifras −2,5 UH/1 % agua y sens. 64 %: buscar fuente) · RA acute stroke https://radiologyassistant.nl/neuroradiology/brain-ischemia/imaging-in-acute-stroke y territorios https://radiologyassistant.nl/neuroradiology/brain-ischemia/vascular-territories
3. **HTIC y hernias** · hoz y tentorio, borramiento de cisternas, bradicardia+hipertensión+midriasis · «¿Hernia?» 4 pasos · `umi-tce-manejo` (indicación de sensor, escalones), `umi-pic-onda`, `umi-onsd` · RA-2 §3 y par 5; NR-3 §3 (hoz cortes 4-28, tentorio 26-32: solo pares de prueba del quiz) · fuente por buscar (RA no tiene ficha propia de HTIC).
4. **Epidural y subdural** · lenticular que no cruza suturas frente a media luna que sí · esquema recreado y animado (Motion) de las capas (RA §4.6) · `umi-marshall` · RA traumatic (arriba).
5. **HSA por imagen** · TC primero; angio-TC; complicaciones · `mn-hsa`, `umi-hsa` (Doppler transcraneal) · RA-2 §3 (HSA aneurismática, perimesencefálica); NR-2 §2 (senos venosos: trombosis) · RA non-traumatic y trombosis venosa https://radiologyassistant.nl/neuroradiology/sinus-thrombosis/cerebral-venous-thrombosis
6. **Hipoxia cerebral y catéteres intracraneales** · sensor de PIC, DVE, qué se ve en la imagen · `umi-tce-manejo`, `umi-pic-onda`, `umi-fibrinolisis-iv`, `umi-meningitis` (DVE) · **los informes no lo cubren** y la app no tiene PtiO2 ni «hipoxia cerebral» (solo el objetivo en `js/data/pif-rotaciones.js`) → **fuente por buscar**; ficha corta o aparcar.

## 2. Pieza visual común: «Lee esta placa» (como «lee este trazado»)
- Modelo: `js/modules/pif-cardio/ecg-lector.js` + `ecg-ejercicios.js` (datos `js/data/pif-ecg-ejercicios.js`; panel `panel-pif-ecg-tabs`, `pifCardio`/`ecgArritmias`): elegir primero, comprobar con el libro. Aquí: **esquema SVG recreado** de la placa (tráquea, carina, tubo, vía, sonda, cúpulas) con chips por paso; «Ver en el texto» por id; el SVG lleva fondo `var(--bg-main)`. Pregunta puntuada: tocar la punta (zona/polígono; `q.tocar` ampliado: NR-3 §6.7).
- **Sí se puede**: esquemas propios; **nuestras 14 figuras de Merino** (`neumologia/img/`) y las de Marino (`libros/img/mar-fig2-*`, `mar-fig49-*`) con capa SVG de rótulos (RA §4.7, sin tocar la imagen); figuras propias anonimizadas (CLAUDE §7.8).
- **No**: imágenes/contornos/notas de NavRad (sin licencia, NR §2); texto de RA; figuras de RA solo por decisión del usuario con crédito (Disclaimer: «reproduced for educational purposes with due credit to the original author and the Radiology Assistant»; no aclara modificarlas ni uso comercial).
- **Con licencia aún sin verificar en origen** (dominios bloqueados, NR-2 §5): Radiopaedia (CC BY-NC-SA 3.0 modificada, caso a caso; https://images.radiopaedia.org/licence), RSNA ICH y CQ500 (no comercial / BY-NC-SA), TCIA COVID-19 (CC BY 4.0 según listado), RANZCR CLiP (licencia no encontrada; https://pmc.ncbi.nlm.nih.gov/articles/PMC8553862/). Ninguna se usa sin comprobar.
- **Aparcado**: visor de cortes (`core/visor-cortes.js`; pieza nueva, decide el usuario, necesita casos con licencia).

## 3. «¿Qué no puede ver esta IA?» (NV-Reason-CT)
- Formato: «piensa y destapa» de 4 cosas, al final de la ficha de TC (T8) y de la TC de cráneo (N1). Respuesta del informe (nv §2): no lee **cráneo**, no lee **Rx simple**, no ve la **posición** de dispositivos («material médico» solo dice que hay algo), su lista es de TC de tórax y abdomen; es de investigación, «not a medical device». Fuera la lista de 64 hallazgos.
- Es texto: no hay modelo ni imagen en la app (necesitaría GPU; rompe «sin backend», nv §6.3/§7). El Consejo (art. 4) ya la deja como pregunta de estudio.

## 4. Fases y coste (sonnet)
| Fase | Qué | M tokens |
|---|---|---|
| F0 | `f0-ra-biblio`: `.biblio-link` + `.biblio-nota` por rotación (URLs de arriba) | 0,5-1 |
| F1 | Rótulos SVG sobre las 14 figuras de Merino (+ Marino 2.6/49.x) | 2-3 |
| F2 | Pieza «Lee esta placa» (receta + tocar la punta) | 2-3 |
| F3 | Tórax: 8 fichas (≈1 c/u) + 6-7 tarjetas SiNo (≈0,5 c/u) | ≈11-12 |
| F4 | Neuro: 6 fichas + 5 tarjetas (incluye TC de cráneo en 5 preguntas, ya valorada en 1,5-2) | ≈8-9 |
| F5 | Pregunta «¿qué no puede ver esta IA?» + «encuentra el error» de patrones | ≈1 |
Total ≈ 25-30 M. Orden sugerido: F0, F1, TC de cráneo en 5 preguntas, F3 (T2 y T3 primero), F2, F4. Aparcado: visor de cortes, casos con imagen sin licencia, NV-Reason nivel 1 y 3, quiz «toca la estructura» sobre TC, buscador que salta al corte, lecciones con IA.

## 5. Dudas para el usuario (máx 4)
1. ¿Tórax primero y neuro después (como supone B-034), o a la vez?
2. ¿Permites reproducir figuras de RA con crédito, o solo esquemas recreados y nuestras figuras de Merino/Marino?
3. ¿Quieres fichas de 8+6 o un temario más corto (p. ej. 6+4, uniendo SNG/drenaje, patrones/edema y epidural/subdural)?
4. ¿La ficha de hipoxia cerebral/catéteres intracraneales entra aunque haya que buscar fuente nueva?

## 6. No comprobado / riesgo
- Cifras de RA (pedículo, 200-300 mL, 30 %, −2,5 UH, sens. 64 %, ICT) y las ventanas W/L de NavRad: no son fuente; todas por buscar.
- No abrí cada URL de RA hoy; son las que el informe dio con 200 el 23/10. Ninguna licencia de datasets está verificada en origen.
- Rutas leídas con grep: no abrí las fichas para ver si cada figura está en la pestaña exacta (las figuras 28-x/24-x/22-1 las ubiqué por línea); la ruta de la guía ESC 2026 de IC no la busqué; el id exacto de la pestaña «lee este trazado» no existe en HTML (es una clave de datos `ecg-lee-trazado`).
- La app no tiene eco pulmonar propia (solo BLUE en texto). RA no cubre ET, CVC, SNG, drenajes, TEP ni catéteres intracraneales (RA-2 §2, §7).
- Cortes de NavRad (carina, hoz, tentorio) son de anatomía normal de un caso: pares de prueba, no fuente clínica.
