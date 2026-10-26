# AngioView (angioview.com) — ingeniería inversa e ideas para el HUD Clínico UCI

Fecha: 23/10/2026. Método: Playwright (Chromium, móvil 390×844). Se probó REA (`rea-agents` 6.7.0): su
`analyze-web-bundle` pide un navegador ya abierto con depuración remota; se siguió con Playwright. El JS se leyó
en memoria; no se guardó ningún script suyo. Solo hay capturas y este informe.

## 1. Qué es y qué ofrece
Simulador educativo («no para uso clínico») de **proyecciones de coronariografía**. Autor: Annas Rahman; web
gratis y app de pago para iPhone/iPad. En una sola pantalla (en el móvil, una columna), tres vistas que se mueven juntas:
- **Angiograma simulado** que parece de verdad: gris, ruido, costillas y columna de fondo, relleno de contraste,
  rótulos de segmento, colores por familia de vasos, invertir.
- **Corazón 3D** con el haz y la placa del detector. Puedes arrastrar la placa para mover el arco. Opciones: verlo desde el detector, el acortamiento en color,
  esqueleto, transparencia, rótulos y planos (surco AV y tabique).
- **Sala de hemodinámica** con el arco en C, el tubo, el detector y el paciente; se arrastra para mover el arco.
- Mandos: barra RAO 90 ↔ LAO 90, barra CRA 45 ↔ CAU 45 y una «almohadilla de ángulos», un plano 2D con las vistas
  estándar dibujadas como zonas. **Vistas predefinidas**: 8 de la izquierda (spider, RAO caudal, AP caudal/craneal,
  LAO craneal, RAO craneal, lateral, AP) y 5 de la derecha. Cada una con «qué deberías ver», rango habitual y fuente.
- **Dominancia** derecha, izquierda o codominante; **ramo intermedio**; **injertos** LIMA→DA, safena→OM1 y safena→DP,
  con muñón de la DA ocluida, alambres esternales y clips.
- Panel **«Segmentos»**: para cada segmento, en el ángulo actual, el **% de acortamiento** y el **% de solapamiento**
  (con qué vaso), «mejor vistos», «más acortados», «solapados». Al pulsar un segmento, se marca en la almohadilla su
  vista más limpia.

## 2. Cómo está hecho
- **Tecnología**: React + estado en zustand + three.js r186 (WebGL2), Vite, fuentes IBM Plex, analítica de Vercel.
  Un solo paquete JS de ~1 MB.
- **Datos** (cargados al arrancar): `coronary-right/left/co.json` (uno por dominancia, ~42 vasos cada uno),
  `grafts-right.json`, `heart.glb` (3,3 MB; 10 piezas: VI, VD, AI, AD, aorta, tronco y ramas pulmonares, cavas,
  venas pulmonares) y `thorax.glb` (3 MB; 56 piezas: costillas, cartílagos, esternón, vértebras C7-L1, diafragma),
  más versiones «lite» de ¼-⅓ de triángulos.
- **Árbol coronario**: lista de vasos con `parent` + `parentArc` (en qué punto del padre nace, de 0 a 1), puntos 3D
  en mm (X = izquierda del paciente, Y = arriba, Z = delante, origen en el isocentro) y un radio por punto. Cada vaso
  trae sus **segmentos con número SYNTAX** (1-16c: pCD 1, mCD 2, dCD 3, DP 4, TCI 5, DA 6-7-8, D1 9, D2 10, Cx 11/13,
  OM 12a/12b, RI 12, PL 16a-c). Es la **clasificación SYNTAX, que procede de la de la AHA**. Cada vaso declara su
  origen: medias de la población de TC, cursos «crecidos» con ángulos de salida publicados y ramitas sintéticas.
- **Proyección**: geometría real de un arco en C. El foco está a una distancia fuente-isocentro (SOD) de 765 mm. La distancia fuente-detector (SID) es de 1050 mm por defecto, como máximo 1200. Ángulos
  α (RAO/LAO) y β (CRA/CAU), con convención DICOM PS3.3 C.8.7.5. Proyección **en perspectiva desde el foco**:
  aumento = SID ÷ profundidad de cada punto.
- **Acortamiento**: en una ventana de ±3 puntos del eje del vaso, 1 − (longitud proyectada ÷ aumento) ÷ longitud
  real. Se pinta con una escala de azul (0) a rojo (1). Hay además un barrido de toda la rejilla
  (α −90…90, β −45…45, cada 2°) que busca el ángulo de mínimo acortamiento: es el «mapa de la vista óptima».
- **Imagen de rayos X** (lo más fino): cada vaso es un tubo; el sombreador calcula **cuánto recorre el rayo dentro
  de la luz** (cilindros con uniones en inglete; en las bifurcaciones cuenta la unión, no la suma). Después aplica
  la **ley de Beer-Lambert** con coeficientes de iodo, partes blandas, hueso y metal. El tórax se recorre por pasos sobre un volumen 3D.
  Por encima, el procesado de un equipo real: exposición automática, armonización, velo de radiación dispersa,
  máscara de enfoque, desenfoque del foco, ruido cuántico de Poisson a 10 imágenes/s y colimación. Un vaso de menos de 1 píxel se dibuja
  más fino y más tenue para conservar el iodo. El **cine** tiene un frente de relleno y otro de lavado, en mm de arco desde el
  ostium, y el rubor del seno.
- **Lo que no tiene**: **el corazón no late**, no hay fisiología, no hay estenosis ni lesiones, y no conecta con el ECG ni con la eco.
- **Móvil**: detecta la GPU de software → nivel «bajo»: sin antialias, densidad de píxeles 1, mallas lite y
  ajuste del ritmo de imágenes. El angiograma usa siempre las mallas completas. Hay un modo `?debug=perf`.
- **Fuentes que cita**: Di Mario y Sutaria (Heart 2005), Kern (Cath Lab Digest 2011 ×2; Cardiac Cath Handbook),
  Naber (EuroIntervention 2010), Green y cols. (Br J Cardiol 2016), Kočka (JACC CI 2020), Tu (Int J Cardiovasc Imaging
  2012), Dodge 1988 y 1992 (Circulation: posición y calibre), Otten (IntechOpen 2022), AATS, DICOM PS3.3.
- **Licencias** (según su `anatomy/ATTRIBUTION.md` y sus créditos):
  - **BodyParts3D 4.0** (DBCLS): **CC BY 4.0**, que según ellos se relicenció el 25/02/2025. Ojo: las cabeceras OBJ
    de la 4.0 aún dicen «CC BY-SA 2.1 Japan». El juego del **corazón 5.0 es CC BY-SA 2.1 JP**, y ellos no lo usan.
    Cita exigida: «BodyParts3D, © The Database Center for Life Science, CC BY 4.0».
  - **ImageCAS-X** (Bransby y Paulsen, Zenodo 2026, doi:10.5281/zenodo.21887809): **CC BY 4.0**. Solo usan estadísticas.
  - **CARDIAG** (Lau y cols., Zenodo 2026, doi:10.5281/zenodo.19958730): **CC BY 4.0**. Midieron angiogramas reales
    para ajustar las vistas, sin incluir imágenes.
  - **Vascular Model Repository**: solo medias de 16 modelos tras cirugía de bypass, con el agradecimiento NIH que se exige.
  - **Sus archivos derivados** (`heart.glb`, `coronary-*.json`) **no declaran licencia propia**. Si quisiéramos
    mallas, lo seguro es **partir del BodyParts3D original**, no de sus derivados. three.js y React: MIT. IBM Plex: OFL.
  - No pude abrir DBCLS ni los DOI de Zenodo (el proxy del entorno los bloquea): las licencias están **sin verificar
    en origen**.

## 3. Ellos frente a nosotros
| | AngioView | HUD Clínico UCI (eco) |
|---|---|---|
| Corazón | Mallas BodyParts3D, quietas | Procedural, **late** con un motor fisiológico |
| Coronarias | ~42 vasos, radios de Dodge, 3 dominancias, SYNTAX | 6 tubos (TCI, DA, Cx, OM, CD, marginal aguda) en `corazon-geo.mjs` l. 490-512; sin segmentos ni dominancia |
| Proyección | Arco en C en perspectiva, SID/SOD, DICOM | Plano de eco; ninguna proyección de rayos X |
| Contenido de coronariografía | Vistas, segmentos, injertos, fuentes | Casi nada: solo la dosis de radiación (Marino tóxicos) |
| Isquemia | No | Isquemia **del VD** por presión (`motor.mjs` `isqDesde`); sin isquemia regional del VI |
| SCA | No | Fichas `mc-sca-diagnostico/tratamiento` (Merino); sin territorios ECG ↔ arteria |
| Móvil | Niveles de calidad automáticos | Renderizador propio; rendimiento medido en README |
| Fisiología | No | Presiones, volúmenes, Doppler y shock |

## 4. Mejores ideas para traer (método, no código)
1. **Territorios coronarios ↔ ECG ↔ eco de 17 segmentos** (lo que más aporta). Se toca una arteria y se ven las
   derivaciones del ECG y los segmentos del VI que se mueven mal, y al revés. A pie de cama: «ST en II, III y aVF →
   CD o Cx → mira la cara inferior en el eje corto». Esfuerzo medio. Necesita una fuente PDF (guía ESC de SCA o un capítulo
   de eco de la ASE/EACVI con el mapa de 17 segmentos) y decidir dónde vive (eco o cardiología).
2. **IAM en el simulador que late**: contractilidad regional (hipocinesia o acinesia del territorio) en el motor, con
   caída del VS y del GC y, en la CD proximal, el VD (ya tenemos su isquemia). Ningún producto parecido lo hace.
   Esfuerzo alto. Necesita fuente para cifras y mecánica y la decisión de tocar el motor (es arquitectura).
3. **Árbol coronario con segmentos SYNTAX/AHA** en nuestro corazón: el mismo formato que ellos (padre, punto de
   salida, radio por punto, segmentos numerados) y la dominancia como mando. Es la base de las ideas 1, 2 y 4.
   Esfuerzo medio. Fuente: la clasificación SYNTAX publicada y Dodge 1992 para los calibres. Decidir: ¿geometría procedural o BodyParts3D?
4. **Coronariografía desde nuestro corazón que late**: proyección en perspectiva tipo arco en C de nuestras
   coronarias, con mandos RAO/LAO y CRA/CAU, almohadilla de vistas y cine de relleno. Con latido ganaría a AngioView.
   Para un residente de UCI sirve para entender el informe del hemodinamista. Esfuerzo alto. Fuente: Di Mario 2005 (Heart, en
   PMC) para las vistas. Decisión: ¿nuevo modelo vivo o capítulo del atlas?
5. **«Acortamiento» como herramienta para pensar**: mostrar en color qué parte de un vaso se ve corta en una proyección, con un
   «encuentra la vista óptima». La fórmula es geometría pública, muy barata una vez hecha la 4. Encaja con
   «piensa antes» de REGLAS §8.
6. **Ficha «cómo leer un informe de coronariografía»** (estudio, sin 3D): dominancia, numeración de segmentos, qué
   vista enseña qué, SYNTAX, injertos (LIMA-DA, safena). Esfuerzo bajo-medio. Necesita PDF (Di Mario 2005 y un
   capítulo de libro). Enlaza con SCA, shock cardiogénico y soporte mecánico de Merino.
7. **Patrón de interfaz**: almohadilla 2D de ángulos con las vistas estándar como zonas, y cada vista con
   «qué deberías ver», rango y fuente. Se podría aplicar a nuestras vistas de eco (sonda libre). Esfuerzo bajo.
8. **Niveles de calidad automáticos en el móvil**: detectar la GPU de software o lenta, bajar la resolución y las mallas, y medir
   el ritmo de imágenes; con un `?debug=perf`. Esfuerzo bajo, mejora técnica directa.
9. **Créditos y licencias por archivo de datos** (su ATTRIBUTION con «derivado de…» y «cómo»): encaja con nuestra
   regla de trazabilidad. Esfuerzo bajo.

## 5. Qué NO traer
- Su código, textos, capturas y sus **archivos derivados** (`heart.glb`, `coronary-*.json`): no tienen licencia
  declarada. Si se usan mallas, desde BodyParts3D 4.0 con su cita, y nunca el juego del corazón 5.0 (CC BY-SA).
- three.js o React: rompe la regla de «sin dependencias» (§2), y nuestro renderizador WebGL ya hace falta.
- El realismo de rayos X completo (dispersión, armonización, Poisson) en una primera versión: es caro y aporta poco
  a un residente de UCI. Mejor un contraste limpio con latido.
- La sala de hemodinámica 3D: es vistosa, pero da poco para estudiar en UCI.
- Injertos y alambres esternales antes de tener lo nativo bien hecho.

## 6. Lo que no pude ver
- La app de iPhone ni la versión de escritorio ancha (solo el móvil a 390 px).
- Las licencias en origen (DBCLS, Zenodo): el proxy las bloquea.
- La vista de la sala arrastrando el arco ni el cine animado a lo largo del tiempo (solo fotogramas fijos). El rendimiento
  real en una GPU de móvil: aquí era la GPU de software (nivel «bajo»).
- Sus documentos internos (`docs/ANATOMY-NOTES.md`, `docs/PERFORMANCE.md`): no están publicados.

## Capturas (/tmp/plan-socialista/rea3/angioview/)
00-inicio.png · 01-inicio-390.png · 01b-inicio-390-completa.png (página entera con la sala) · 02-rao-caudal.png ·
03-lao-craneal.png · 04-spider.png · 05-spider-acortamiento-completa.png · 06-cd-lao.png ·
07-cd-lao-segmentos.png · 08-paneles-completa.png (paneles de vista y segmentos) · 09-injerto-lima.png ·
10-mosaico-proyecciones.png (las 6 proyecciones juntas)
