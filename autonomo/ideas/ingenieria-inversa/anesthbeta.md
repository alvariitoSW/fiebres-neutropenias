# anesthbeta TEE Atlas (tee-simulator.anesthbeta.com/atlas): 2.ª pasada, informe completo
Investigado el 25/10/2026 con Playwright (390×844, ES/EN/JA), un script por pregunta; su JS leído en memoria, nada
guardado. Previo: `autonomo/partes/2026-10-23-tee-inversa.md` (sin informe .md hasta hoy). Etiquetas: visto / deducido / no visto.
Captura: `anesthbeta-mitral.jpg` (banco de válvulas, ME comisural 50-70°, 3D + corte con A1-A3/P1-P3 rotulados).

## 0. Vigía (frente al 23/10)
- **Versión**: `?v=20261006flex` en todos los módulos (visto). Del 23/10 no anotamos su `?v=`: lo fijamos hoy.
- **Piezas actuales** (visto, peso del texto): app.js 42,8 KB · anatomy.js 33,1 · locales/en.js 25,2 · probe-path.js 16,3 ·
  views.js 11,7 · valves.js 8,4 · i18n.js 6,9 · view-catalog.js 3,3 · learning-state.js 2,3 · section-labels.js 0,6 ·
  app-access.js 0,4 · vendor three.module + OrbitControls (38,7) · `assets/anatomy.json` 28,5 KB + **`anatomy.bin` 5,3 MB**
  (malla en binario aparte) · fuentes Google (DM Sans, Noto Sans JP) · Cloudflare (insights bloqueado aquí).
- **Novedades respecto a lo anotado (deducido por nombres, el 23/10 solo se citaron 6 módulos)**: `view-catalog.js`
  (catálogo único de 35 vistas con nombre ES/EN/JA, rango de ángulo, estructuras y fuente), `learning-state.js`
  (guarda/valida una postura de aprendizaje: vista, modo superficie/transparente/corte, pose con cuaterniones, giro,
  flexión, lateral; formato `version:1`), `app-access.js` y `locales/en.js`.
- **Cambio de producto (visto)**: banner «Ya disponible para iPhone y iPad · descarga gratis · compras en la app». La
  web es ahora el escaparate de una app nativa. `app-access.js` (visto, 5 líneas): en nativo sin compra, **límite de 28
  vistas** (las 7 vasculares son premium); en web, 35. Modelo de negocio: freemium. Deducido: el atlas web seguirá
  gratuito, pero la parte «extra» (vasculares, IVC/hepáticas) se reserva para la app.
- **Sin cambio**: Three.js, esófago por curva, 5 mandos, 35 vistas, aviso «sin revisión de especialista».
  Anatomía: Human Reference Atlas / Visible Human Female (CC BY 4.0, enlazado en pie), sin verificar en origen.

## 1. Qué enseña y cómo se maneja (visto)
- **Selector** (desplegable en móvil + lista) con filtro «Estándar 28 / Vasculares 7»; botones ‹ › entre vistas.
- **Mandos de la sonda**: ángulo multiplano 0-180° (paso 1) · inserción 0-100 (%) · giro −90…+90° · ante/retroflexión
  −75…+80° · flexión lateral −60…+60° · profundidad de imagen 4-30 cm. Modo «conectado/independiente» (la inserción
  ajusta sola la flexión). Esquema esófago→estómago (dice que no son cm de incisivos).
- **Ciclo cardíaco**: control de fase 0-1000, FC 40-140, velocidad; «arrastra para pausar y mira dentro del latido»;
  etiqueta de fase (isovolumétrica, eyección, diastolia precoz/media/tardía) y estado de cada válvula (MV/TV/AV/PV
  abierta/cerrada) en vivo. Latido ilustrativo, **no es 4D real** (lo dice).
- **Imagen**: corte «sincronizado» de la malla, colores de estructura o gris, rótulos (LV, RV, LA, RA, IVS, Ao,
  válvulas, LCA/RCA/CS), tocar marca el 3D. Todas las vistas llevan «Aprox.» y enlace a la referencia y a la guía.
- **Viaje entre vistas**: selectores origen→destino y barra de progreso 0-1000 (el viaje se puede arrastrar a mano).

## 2. Vistas de ETE que importan en UCI/quirófano y pares de prueba
Vista → ángulo del mando una vez asentado (espera 14 s; el viaje dura ~6-10 s) → estructuras que rotula la pantalla.
El ángulo del mando **no coincide siempre con el rango ASE** que muestra («no calibrado», lo avisa): visto.
| Vista (n.º ASE/SCA 2013) | Rango ASE rotulado | Mando observado (ang/ins/flex/prof cm) | Estructuras en pantalla |
|---|---|---|---|
| 02 ME 4 cámaras | 0-20° | 10° / 37 / +22 / 16,8 | LA, RA, LV, RV, MV, TV, septo |
| 01 ME 5 cámaras | 0-10° | 8° / 35,7 / +28 / 16,8 | 4 cámaras, MV, TV, TSVI, AV |
| 03 ME comisural mitral | 50-70° | 40° (en viaje) / 37,7 / +19 / 15,6 | MV, LV, papilares |
| 05 ME eje largo | 120-140° | **102°** / 38,5 / +19 / 16,4 | LV, MV, TSVI, AV |
| 10 ME válvula aórtica eje corto | 25-45° | 35° / 33 / +6 / 10,4 | LCC, NCC, RCC, LA, RVOT |
| 16 TG eje corto basal | 0-20° | 10° / 73 / −8 / 11,8 | MV, base del LV |
| 17 TG eje corto papilares | 0-20° | 10° / 78,2 / −8 / 12,2 | LV, RV, papilares, septo |
| 21 TG profundo 5 cámaras | 0-20° | 10° / 94,9 / −26 / 14,4 | MV, LV, TSVI, AV |
| 22 TG 2 cámaras | 90-110° | 81° / 82,5 / −12 / 14,4 | LV, MV, papilares |
| 26 Aorta descendente eje largo | 90-100° | 91° / 56 / −13 / 12,4 | aorta torácica descendente |
| V1 IVC eje largo (extra) | «ángulo de guía» | 90° / 57,4 / −19 / 12,2 | VCI, entrada en la AD |
| V2 suprahepáticas + VCI (extra) | — | 56° / 60 / +8 / 12 | RHV, MHV, LHV (no siempre las 3) |
Lectura útil: en UCI/quirófano pesan 02, 05 (VI + TSVI), 17 (TG papilares: precarga/contractilidad), 21 (gradientes),
10/06 (válvula aórtica), 12 (tricúspide), 11, 26 (aorta, disección) y la 15 (orejuela). Observación: las TG tienen
**flexión negativa** y más inserción (~73-95) que las ME (~33-38); eso es lo que enseña la «postura» de cada una.

## 3. Banco de válvulas (visto: pantalla; deducido: valves.js)
- Tarjeta «Anatomía de la válvula y su movimiento · Anatomía de valvas»: botones **M mitral · T tricúspide · A aórtica ·
  P pulmonar** (cada una con su color) y «Todo el corazón». Fase del ciclo común: abren/cierran según `cardiacState(fase)`
  (visto en código): aórtica y pulmonar abren al ~5,5-10 % del ciclo y cierran al ~32-36 %; AV abren en diástole
  precoz con rebote auricular (A). Etapas rotuladas: isovolumétrica, eyección, relajación, 3 de diástole.
- **Mitral**: seis botones **A1 A2 A3 P1 P2 P3** («1 anterolateral, 2 central, 3 posteromedial») + «Valva eje largo /
  eje corto» + vista desde la AI o el lado opuesto, con el 3D coloreando cada festón (paleta propia por segmento).
  La vista «comisural» los rotula sobre el corte (captura: P1 A1 A2 A3 P2…).
- **Aórtica**: LCC, RCC, NCC; **tricúspide**: anterior/posterior/septal; **pulmonar**: anterior/derecha/izquierda
  (paleta en valves.js: visto). La UI de A/T/P no se llegó a capturar (no visto).
- El 23/10 se anotó que la pantalla dice «qué valvas corta el plano»: hoy no logré hacerlo salir (no visto de nuevo).
- Las valvas son «modelo educativo dinámico» sobre la malla del anillo (dice que no es 4D medido).

## 4. Cómo está hecho (resumen, ya conocido)
Three.js + malla en `anatomy.bin` (5,3 MB) + curva esofágica a mano; corte del plano de la sonda rellenado en 2D (sin
acústica); `view-catalog.js` como fuente única de las vistas. Mismo patrón «catálogo de datos + render» que querríamos.
Licencias: Three.js MIT; anatomía CC BY 4.0 (sin verificar); su código y su UI no son reutilizables.

## 5. Frente a nosotros (README eco: Sonda libre, Doppler, Vistas)
- **Ganan ellos**: ETE completa (35 vistas) con **mandos reales** (multiplano, flexión, giro, inserción), viaje animado
  entre vistas, segmentos A1-P3 y cúspides, estructuras con nombre, estado guardable de una postura (`learning-state`).
- **Ganamos nosotros**: nuestra imagen es **fisiología viva**: eco 2D por motor del latido, modo M, Doppler pulsado y color
  con velocidades por `v=Q/área`, medidas automáticas (E/A, TDE, ITV del TSVI → GC, S/D/A, VExUS), sonda libre con
  `vistaMasParecida()` (grados y mm) y reto, subcostales y supraesternal, escenarios de enfermedad. No tienen nada de eso.
- Nuestras calculadoras eco del Manual UMI (`calcHemodinamica`, `calcFsFevi`, `calcVciColapso`) no están ligadas a
  ninguna vista; ellos tampoco tienen calculadoras (son otra web).

## 6. Ideas para el megaproyecto (anesthbeta)
1. **«¿Qué ETE pido y qué veo?» (guardia, shock inestable intubado/quirófano)**: ficha corta de las 6-8 vistas ETE de
   UCI (ME4C, ME LAX, TG papilares, ME bicava, aorta) con qué contestan (VI, TSVI, derrame, disección). Cama: 30 s;
   estudio: cada vista con su objetivo. Esfuerzo pequeño-medio. Necesita: PDF ASE/SCA 2013 de ETE (Hahn).
2. **Sonda ETE sobre nuestra anatomía** (5 mandos + tabla de posturas). Estudio. Grande. Necesita: PDF ASE/SCA 2013 y
   decidir si el esófago entra como excepción a «anatomía congelada».
3. **Viaje animado entre vistas** en nuestra Eco (ya hay vistas estándar). Estudio. Pequeño-medio. Nada externo.
4. **Banco de válvulas mitral A1-P3 + dónde cae cada una en cada vista** (valoración de IM/prolapso). Estudio y
   quirófano. Medio. Necesita el PDF (Hahn 2013) y decisión de partir valvas (anatomía congelada).
5. **Cartilla «estado de la válvula en la fase»** (qué válvula está abierta en cada fase y por qué, ya lo hace
   nuestro motor): mecanismo para estudiar. Pequeño; usa lo nuestro.
6. **Postura guardada**: URL/estado que reabre una vista con sus mandos (compartir un caso, retomar). Sin servidor
   (hash en la URL, no `localStorage`). Pequeño. Nada.
7. **Coaching de sonda en ETE** («flexiona más, el TSVI se alarga»): sobre `vistaMasParecida()`. Medio. Necesita 2.
8. **Ficha de procedencia por imagen y estado de revisión** (como ellos declaran «sin revisión»). Pequeño. Decisión.
## 7. Lo que no traería
Su código, `anatomy.bin`, textos, sus rótulos y paleta; Three.js; la compra en la app; Cloudflare/analítica.
## 8. No visto
UI de A/T/P; «qué valvas corta el plano» hoy; app de iOS; calidad de su corte tras variar mandos a mano (solo
presets y viaje); ATTRIBUTION.md (404 el 23/10).
