# anatomyatelier.org · ¿sirve para el motor del corazón de B-045? (30/10/2026)

Pedido por el usuario el 30/10: «he encontrado una web que puede ser útil para hacer el motor del corazón de manera
realista». Enfocado en B-045 (`mv-eco`: motor del corazón + motor de la imagen, unidos por `contrato.mjs`; realismo
≥9,5 con la rúbrica del «Encargo B-045» del tablero). Fase 1: informe; no se toca la app. Clave: B-049.

## 1. Tesis

Anatomy Atelier enseña **un corazón 3D fijo y muy vistoso** para girarlo y tocar 6 puntos con su nombre. Es una
**escultura de una sola pieza hecha con IA**, sin cavidades separadas, sin válvulas que se muevan y sin latido. No
tiene nada que sirva para cortar una eco ni para un motor de fisiología. **No cambia el contrato.** Lo nuestro
(corazón 3D movido por el motor del latido y eco cortada de ese mismo corazón) va muy por delante en lo que pide B-045.

## 2. Qué es (visto)

- Explorador de anatomía en 3D para curiosos y artistas («Learn anatomy like an artist»), 12 idiomas (español incluido).
  9 órganos: corazón, cerebro, pulmones, hígado, riñones, ojo, intestino, páncreas, piel.
- Del corazón: modelo 3D con 6 puntos (aorta, AI, AD, VI, VD, mitral) con una frase cada uno, «datos clave» de
  divulgación (peso 250-350 g, «del tamaño de tu puño»), lista de enfermedades sin desarrollo, un quiz, una imagen de
  tejido y otra de comparación. Mandos: girar, zoom, aislar, corte transversal, capas, comparar.
- La propia web dice en su FAQ que **no es un simulador médico** ni sustituye a referencias clínicas.

## 3. Cómo está hecho

| Pieza | Qué es | Etiqueta |
|---|---|---|
| Tecnología | Next.js 16 + React 19 + **three.js 0.185** (WebGL, con recetas preparadas para WebGPU) | visto: `package.json` del repo |
| Malla del corazón | `models/heart.glb`, 3,3 MB: **1 malla, 1 nodo, 1 material** llamado `tripo_mat_…`, ≈386 600 triángulos, 3 texturas WebP; **sin animaciones, sin «morph targets», sin esqueleto** | visto: cabecera del GLB, leída en memoria |
| Origen de la malla | generada con **Tripo AI** (texto/imagen → 3D); el autor dice que usó también GPT Image para las imágenes | visto: nombre del material + FAQ de la web |
| Compresión | meshopt + cuantización + texturas WebP; decodificadores Draco y Basis servidos aparte | visto: extensiones del GLB y lista de archivos |
| Corte transversal | un **plano de recorte** de three.js (`clippingPlanes`) que quita media figura | visto en `viewer.ts` y **funcionando** (2.ª pasada); la cara cortada mirada de frente: **no visto** |
| Capas | no son capas de tejido: pasa la malla a **alambre** (`wireframe`) | visto en `viewer.ts` y funcionando (2.ª pasada) |
| Aislar | baja la base y la sombra al 15 % y 8 % de opacidad | visto: `viewer.ts` |
| Calidad en el móvil | `setPixelRatio` con un valor base | visto: `viewer.ts` |
| Latido | ninguno: el «Animate» de la ficha es otra cosa; la malla no trae animación | visto: GLB sin `animations`; el cargador solo reproduce animaciones si la malla las trae |
| Analítica y anuncios | Google Analytics, Cloudflare Insights y **dos redes de anuncios** (`highrevenueformat.com`, `profitableratecpmnetwork.com`) | visto: mapa de la red |

Una cáscara de una pieza no tiene interior: al cortarla se ve una superficie hueca, no VI, VD, tabique ni válvulas.
Para la eco hace falta justo eso (deducido de lo anterior).

## 4. Licencia (artículo 2 de la reforma)

- Repositorio `thebuggeddev/anatomy` (último cambio 09/08/2026): **sin archivo LICENSE** y sin campo `license` en
  `package.json` (visto). Su FAQ dice «open-source», pero sin licencia escrita **todo queda reservado al autor**.
- Malla e imágenes: hechas con Tripo AI y GPT Image; sus condiciones de uso no se han verificado en origen.
- Conclusión: **solo ideas reescritas**. Ni código, ni malla, ni imágenes, ni textos. Nada guardado: el árbol del
  repositorio se listó sin bajar el contenido y se borró; la cabecera del GLB se leyó en memoria.

## 5. Frente a nosotros (eco, `js/modules/eco/README.md`)

| | Anatomy Atelier | Nosotros |
|---|---|---|
| Corazón 3D | escultura IA, 1 pieza, muy bonita | malla propia por piezas (`corazon-geo.mjs`), cavidades, válvulas, pericardio |
| Movimiento | ninguno | cada instante lo mueve el motor del latido (volúmenes, TAPSE, torsión, derrame) |
| Responde a la enfermedad | no | sí: escenarios, HP, TEP, taponamiento… (con la «nave espacial» por arreglar en B-045) |
| Corte | plano que recorta la cáscara | plano por vista desde puntos anatómicos y modo B con moteado |
| Render | three.js | WebGL propio sin librerías (`render-webgl.mjs`) |
| Calidad automática | ritmo de píxeles fijo | ya la tenemos (`calidadAutomaticaEco`, `simulador.mjs:172`) |
| Fuentes | divulgación sin citas | Lang 2015, ESC/ERS 2022, etc., con página |
| Para estudiar | 6 rótulos, quiz suelto | Mayéutica, casos, atlas |

Ellos ganan en **acabado de la superficie** (texturas pintadas: grasa, coronarias, brillo) y en lo **sencillo** de su
interfaz. Nosotros ganamos en todo lo que mide la rúbrica de B-045.

## 6. Propuesta (de lo barato a lo grande)

1. **Nada para el contrato ni para el motor del corazón.** No hay que avisar al director de `mv-eco-1`.
2. **Lección para B-045 (gratis):** una malla hecha por IA es bonita pero su anatomía no está comprobada contra
   ninguna guía. Nunca sirve de referencia para los criterios 1 (proporciones) y 2 (forma); las referencias siguen
   siendo las figuras con página de `docs/`. Propongo apuntarlo en el encargo de `mv-eco-2a5`.
3. **Idea «aislar el corte» (pequeña, para después de B-045):** en la vista 3D, un botón que deja a media luz todo lo
   que el plano de la eco no corta. Ayuda a entender qué se está mirando. Va en `render-webgl.mjs` (transparencia que
   ya existe). Necesita: nada. Situación de guardia: «¿qué estoy cortando en este 4 cámaras?».
4. **Idea «puntos que siguen a la pieza» (pequeña):** rótulos tocables pegados a cada estructura en la vista 3D que se
   mueven con el latido, con «Ver en el texto». Necesita: nada.
5. **Acabado de la superficie 3D (medio, opcional):** su realismo de superficie viene de texturas pintadas por IA. Si
   algún día se quiere un 3D más bonito, se haría con materiales propios (ya hay fibras y grasa lobulada en el
   sombreador), nunca con su malla. **No suma nota en B-045**, que se juzga en la imagen de eco en grises.

## 7. Lo que no traería

Su malla, código, imágenes y textos (sin licencia); three.js (sigue sin elegir y no hace falta para esto); su modo de
hacer mallas con IA para el corazón de la eco; sus cifras de divulgación; analítica y anuncios (rompen CLAUDE.md §2).

## 8. Lo que necesito de ti

- ¿Apunto las ideas 3 y 4 en la bitácora como mejora de la vista 3D, para después de B-045? (Yo diría que sí, sin prisa.)
- ¿Añado la lección 2 al encargo de `mv-eco-2a5`? (Recomendado; no cuesta nada.)

## Pares de prueba (observados)

- Abrir la ficha del corazón → 6 puntos con nombre (aorta, AI, AD, VI, VD, mitral) sobre el modelo (pantalla).
- `heart.glb` → 1 malla, 0 animaciones, 0 morph targets (cabecera del GLB).
- Corte transversal → desaparece media figura (la derecha de la pantalla), de frente sin interior a la vista (captura).
- Capas → toda la figura cubierta de puntitos: la malla en alambre (captura).

## Piezas (para la próxima visita)

`/models/heart.glb` 3 321 148 B · `/anatomy/heart/{organ,compare,microscopic,location,thumb}.webp` · chunks de Next en
`/_next/static/chunks/` · repo `thebuggeddev/anatomy` @ `8c0e6f3` (09/08/2026) · three 0.185.1 · next 16.2.6.

## Cómo se hizo y lo que no se pudo ver

1 llamada para comprobar que abre (200, sin `<iframe>`); árbol del repo sin contenido; cabecera del GLB en memoria;
1 pasada de Playwright a 390×844 (mapa de la red, texto, 2 capturas). **2.ª pasada (30/10, a petición del usuario)**: el entorno no tiene GPU en ningún modo
(SwiftShader con ANGLE, EGL o Vulkan: 2,7-3,7 fotogramas/s), pero esperando 25 s tras cada pulsación se ven el corte y
las capas. Truco para la próxima: quitar el giro automático, pulsar, esperar 25 s y capturar. No se vio: la cara
cortada de frente (al girar con el ratón el corte no quedó a la vista), la animación de función ni el quiz. Bloqueados por la red del entorno:
analítica y anuncios (no hacen falta).
