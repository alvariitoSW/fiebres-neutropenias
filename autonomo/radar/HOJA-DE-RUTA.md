# Radar · hoja de ruta única y viva

**Cómo se actualiza**: en cada tanda del Radar (`/radar tanda`, semanal) se revisan los estados contra
`autonomo/TABLERO.md` (aquí solo se copian, nunca se cambian allí), se encajan las entradas nuevas de `ENTRADAS.md` en
una fase (sin duplicar) y se anota la fecha. Última revisión: **29/10/2026** (Ley de Ciencia). Norte: `NORTE.md`.

Fuentes: informe «Del simulador a la cama» (23/10, https://claude.ai/artifact/3hnNvcEsvsotfViShnXLee), megaproyecto
«La UCI en el bolsillo» (25/10, https://claude.ai/artifact/6XfQibZ3H4NwgjUFMJhTdU), plan de integración
(`docs/historial/radar.md` §6) y decisiones del 25/10 («estoy de acuerdo con todo», TABLERO).

**Orden aprobado el 25/10**: etapa A (preparar el plan, incluido el Radar) → fase 0 y v3 del bloque 3 → G1 tras la
fase 0 → resto. Paradas del usuario: las 5 del plan, más una cuando esté G1.


**Ley de Ciencia (29/10/2026, validada por el usuario)**: manda sobre las fases de abajo, que se dejan como historia.
Acta `autonomo/consejo/2026-10-29-ley-de-ciencia.md`; tareas en el Objetivo L del tablero. Cómo encajan:
- Fase 0 → `f0-cifras` y `f0-origen` (con el estado de revisión visible), tras Marino y El Libro Azul.
- Fase 1 (ritmo y PIF de Cardiología) → `pif-cardio-minimo` (noviembre) y el bloque `pif-cardio` (3 paradas, al
  final), con profundidad en el grafo del corazón eléctrico. `b3-bradi` sigue en Marino.
- Fase 2 (coronarias, ETE, angio) → `arteria-culpable` (fase 1 tras Marino); `f2-coronarias`, `f2-ete` y `eco-sueltas`
  tras la decisión de motor de `eco-reforma`.
- Fase 3 (calculadoras de eco) y G1 → `guardia-shock` (dos paradas).
- Fase 4 (imagen real) → `radio-informe` (31/10) y `radio-baratas`; visor, casos con licencia y NV-Reason, aparcados.
- Respiración → lámina de entrada de `b3-pulmon-app` (método Techartist). IA y voz: fuera de la app.

## Fase 0 · acabado de producto en lo que ya existe
- **Qué es**: cifra que no contradice su grado + fórmula con tus números en las calculadoras; origen y licencia a la
  vista; eco más pulida (colores de estructura, rótulos que marcan el 3D, sonda que viaja entre vistas, ayuda en vivo);
  bibliografía de Radiology Assistant en el PIF de Radiología; calidad automática en el móvil.
- **Claves del plan de integración**: `f0-cifras`, `f0-origen`, `f0-eco-color`, `f0-eco-rotulos`, `f0-eco-viaje`,
  `f0-eco-guia` (las cuatro de eco, un solo constructor en serie), `f0-movil`, `f0-ra-biblio`.
- **Estado**: **sin aprobar como tarea** (no hay filas `f0-*` en el tablero). Aprobada en bloque el 25/10 como
  rumbo («estoy de acuerdo con todo»); falta convertirla en tareas.
- **Falta**: ninguna fuente nueva («sin fuentes nuevas»).
- **La alimentan**: EchoSuite, anesthbeta, AngioView (calidad en móvil), Radiology Assistant (bibliografía).

## Fase 1 · el ritmo entra en el paciente (noviembre, PIF de Cardiología)
- **Qué es**: cuaderno «ECG y arritmias» del PIF (la rotación empieza el 01/11); corazón eléctrico con bradicardias,
  bloqueos y marcapasos; 12 derivaciones; el ritmo mueve el motor; territorios arteria ↔ derivaciones ↔ segmentos.
- **Claves**: `b3-ritmo-v3`, `b3-3c`, `b3-ritmo-motor`, `pif-ecg`, `b3-bradi`.
- **Estado**: bloque 3 (`b3`) **en curso, parado en la parada 1** (maquetas v2 esperando; fichas en `auto/b3`). La v3 de
  los 3 modelos (shock, corazón eléctrico, receptor, con monitor común) está **aprobada el 25/10**; las claves de
  arriba **aún no son filas del tablero**.
- **Falta**: PDF de ECG básico de la rotación, AHA 2025, ESC 2021 de estimulación (marcapasos; la red no deja
  descargarla), ASE/EACVI 2015. Ya en `docs/` (26/10): ESC 2023 de SCA, Wagner 2009 (territorios en el ECG),
  Thygesen 2018, de Winter 2008, CONFIRM 2015 y Tamura 2014 (aVR).
- **La alimentan**: RitmoLab (`ritmolab.md`, `ritmolab-2.md`) y Culprit (`culprit.md`: fichas A y B elegidas el 26/10,
  después de Marino).

## Fase 2 · verlo desde todos los ángulos
- **Qué es**: coronarias por segmentos con dominancia y coronariografía que late (arco en C, vista óptima); ETE
  medioesofágico y transgástrico con reto de sonda y banco de la mitral A1-P3; ficha «cómo leer un informe de
  coronariografía».
- **Claves**: `f2-coronarias`, `f2-angio`, `f2-ete`. Megaproyecto de la eco: `eco-mega` (B-015).
- **Estado**: `f2-*` **sin aprobar como tarea**; `eco-mega` **pendiente (aprobada 25/10)**, empieza por una maqueta
  «antes / después». Decidido: tocar la anatomía congelada (esófago, valvas por segmentos, coronarias); mallas abiertas
  con cita, se decide viendo la maqueta.
- **Falta**: Di Mario y Sutaria 2005; ASE/SCA 2013 de ETE.
- **La alimentan**: AngioView, anesthbeta, EchoSuite (Probe Lab), Easy LA Segmentator (28/10: qué enseñar en una
  vista 3D de la aurícula izquierda con venas, ostia y orejuela, para el motor de la imagen de B-039 y `f2-ete`).

## Fase 3 · calculadoras de eco para la UCI
- **Qué es**: biblioteca con catálogo único (VCI y PAD, VS y GC, E/e′, PSVD, TAPSE/PAPS, FEVI, derrame, VExUS);
  «¿cómo se mide?» con botón al simulador; veredictos que integran varias medidas; el simulador toma tus medidas
  (gemelo hemodinámico).
- **Claves**: `f3-calc-eco`.
- **Estado**: **sin aprobar como tarea**.
- **Falta**: guías ASE 2025 de corazón derecho y diastólica; ASE/EACVI 2015.
- **La alimentan**: EchoSuite (`echosuite.md`, `echosuite-2.md`).

## Fase 4 · imagen real de la UCI
- **Qué es**: visor de cortes ligero; «¿dónde está la punta?» puntuado; recorridos fijos (Rx de UCI, TC de cráneo en
  el coma, TEP); casos que evolucionan con imagen; IA de TC como lista de hallazgos y compañera de estudio.
- **Claves**: `f4-visor`, `f4-punta`, `f4-recorridos`.
- **Estado**: **sin aprobar como tarea**. Decidido el 25/10: visor de cortes en la fase 4; casos de imagen «no
  comerciales», sí; figuras de Radiology Assistant, no (se enlaza); IA de TC solo en el teléfono.
- **Falta**: casos con licencia comprobada (zenodo.org, `*.cancerimagingarchive.net`, `*.radiopaedia.org` y
  `registry.opendata.aws` siguen cerrados en la red); temarios de Radiología de tórax y Neurorradiología;
  huggingface.co y arxiv.org para NV-Reason-CT.
- **La alimentan**: NavRad, Radiology Assistant, NV-Reason-CT.

## Fase G · la guardia (puerta «Guardia» nueva en la raíz, aprobada el 25/10)
G1 empieza tras la fase 0 (sus fuentes ya están en la app); el resto, según llegue cada PDF.

| G | Situación | Estado | Falta |
|---|---|---|---|
| G1 | Shock e hipotensión | sin aprobar como tarea; «puede empezar ya» | nada: Manual UMI (FATE) y VExUS en `docs/`; ASE para el resto |
| G2 | Arritmia inestable y paro | sin aprobar como tarea | AHA 2025 (heart.org cerrado) |
| G3 | Dolor torácico y SCA (y marcapasos) | sin aprobar como tarea | ESC de SCA, ESC 2021 de estimulación, Di Mario 2005 |
| G4 | Tras colocar un dispositivo | sin aprobar como tarea | comprobar qué cubren Marino, Merino Neumología y Técnicas R1; casos con licencia |
| G5 | Neurocrítico | sin aprobar como tarea | comprobar Manual UMI neurocrítico; temario de neurorradiología |
| G6 | Quirófano cardíaco y ETE | sin aprobar como tarea | ASE/SCA 2013 de ETE |

- **La alimentan**: EchoSuite (G1), RitmoLab (G2), AngioView (G3), Radiology Assistant y NavRad (G4, G5), anesthbeta
  (G6), NV-Reason-CT (lista de hallazgos, G4 y G5).

## Carriles transversales (copiados del tablero, sin tocarlos)
- Etapa A (preparar el plan: reglas, agentes, jueces, Radar): **en curso**. `radar` (B-012): en curso (25/10).
  `bandeja` (B-017): necesita humano (la tarea diaria se crea desde la app).
- Pendientes aprobadas el 25/10: `vuelta-modelos` (B-016), `eco-mega` (B-015), `inventario` (B-014).
  Aparcada: `pulmon-respirador` (B-013), después del bloque 3.
- Dos carriles (plan de integración): **corazón** (bloque 3 con la fase 1 dentro) y **producto** (fase 0); en espera
  `f2-*`, `f3-calc-eco`, `f4-*`.

## Ideas sueltas
Ninguna por ahora. Las ideas del Radar sin fase se listan aquí con su fecha.
