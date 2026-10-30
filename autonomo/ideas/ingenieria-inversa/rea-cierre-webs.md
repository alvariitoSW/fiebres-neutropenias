# rea-cierre (B-046) · L2: CardioTeca, Easy LA Segmentator, PhET (leído el 30/10/2026)

## 1. CardioTeca · tablas de dosis de anticoagulantes y antiarrítmicos
- **Qué es**: página (actualizada 15/10/2026) con tablas: ACOD (apixabán, rivaroxabán, edoxabán, dabigatrán) por aclaramiento
  (>50, 30-50, 15-29, <15 o diálisis), por edad y peso, otras indicaciones (TEV, TEP, prótesis); antagonistas de vitamina K;
  antiarrítmicos (cardioversión, mantenimiento de ritmo, control de frecuencia), adenosina, atropina, ivabradina; ajustes renal/hepático.
- **Fuente primaria declarada**: fichas técnicas CIMA/AEMPS (consultadas 15/10/2026); ESC 2024 FA (tablas 11-13, sin clase ni nivel);
  ESC 2022 arritmias ventriculares (tabla 8); ESC 2019 TSV (adenosina, ivabradina); EHRA 2021 guía práctica (pesos extremos); ERC 2025 y AHA 2025 (atropina).
- **Licencia / aviso**: sin licencia ni términos de reutilización visibles; texto para profesionales, algunas secciones con login; sin autores
  (Comité Editorial); declara usar IA como ayuda editorial. No se copia nada.
- **Ideas**: (1) citar las fuentes primarias, no CardioTeca: ficha técnica CIMA de cada ACOD + ESC 2024 FA + EHRA 2021 (pesos extremos);
  (2) calculadora de ACOD (FG por Cockcroft-Gault, edad, peso) SÍ encaja como scores/umbrales escalonados (CLAUDE.md §7.10), pero cada umbral
  con su ficha técnica y página; (3) CardioTeca solo como bibliografía `.biblio-link`, si el usuario la quiere.
- **Destino**: bibliografía → `arritmias-maqueta` (tabla de fármacos del laboratorio de arritmias). Calculadora de ACOD: **no existe tarea en el
  tablero** → aparcado hasta que el usuario pida una fase de calculadoras de fármacos (proponer en bitácora, con las fichas técnicas en `docs/`).

## 2. Easy LA Segmentator (Mikael Laredo)
- **Qué es**: programa de escritorio (instaladores de ~1,4 GB, sin firmar) que segmenta con TotalSegmentator la aurícula izquierda, venas
  pulmonares y orejuela en un TAC; nombra venas, mide ostia, marca variantes; exporta STL/VTK para CARTO/EnSite/OPAL. Aviso del README:
  «Research use only. Not a medical device». Repositorio: README + capturas, 5 commits, **sin código a la vista**.
- **Licencia**: uso libre solo investigación no comercial; el modelo heartchambers_highres exige clave personal gratuita no comercial;
  no se ve archivo LICENSE. No se reutiliza nada (§7.9).
- **Ideas**: (1) lista de qué enseñar de la anatomía de la AI: 4 venas con su ostium, orejuela aparte, variantes (tronco común, vena accesoria/media);
  (2) vistas fijas de electrofisiología (AP, PA, OAI, OAD) como botones de giro en una aurícula dibujada por nosotros;
  (3) «verifica siempre sobre la imagen»: nota de fidelidad de lo segmentado, útil para la pregunta «encuentra el error».
- **Destino**: ideas → `f2-ete` (anatomía de aurícula/orejuela para ETE), tras `eco-reforma`. Código/datos: **descartado porque** no hay código,
  la licencia es no comercial y es anatomía quieta (no sirve al motor hemodinámico).

## 3. PhET (University of Colorado Boulder) · para Educación
- **Licencia**: sims «históricas» (publicadas antes del 29/03/2026): CC BY 4.0, atribución «PhET Interactive Simulations, University of Colorado Boulder»
  + URL, logo PhET visible e intacto; las publicadas desde esa fecha, PhET-iO y Java/Flash quedan fuera de ese acuerdo. Pie de web: © 2026, todos los derechos reservados.
- **Diseño (papers, no la web)**: «implicit scaffolding» = ayudas dentro de la propia sim (affordances, restricciones, pistas, retroalimentación inmediata) que
  guían sin que el alumno se sienta guiado; refinado en ~125 sims con entrevistas de pensar en voz alta (Podolefsky, Moore y Perkins, arXiv 1306.6544).
- **Sims relevantes** (según resultados de búsqueda; no abrí su interior): Gas Properties (presión, temperatura, difusión), Fluid Pressure and Flow
  (cambiar el calibre de un tubo y ver la velocidad). Otras por localizar: Diffusion/Osmosis, Circuit Construction Kit, ondas/sonido (no verificadas).
- **Ideas**: (1) pocos mandos y el efecto visible al instante (el principio de nuestros modelos vivos): comprobar contra capilar y catéter;
  (2) el tubo que se estrecha y la velocidad que sube = Poiseuille/continuidad del catéter vivo, sin texto; (3) pista dentro de la escena
  (restricción visible del mando, no un cuadro de texto) como alternativa a la «frase viva».
- **Destino**: principio de diseño → `estudio-04-11` (candidatas de Educación). Sims en sí: **descartado como código** (CC BY exigiría su logo
  y atribución dentro de la app, y las nuevas no son CC BY); solo se toma la idea, citando el paper.

## No comprobado / riesgo
- CardioTeca: lectura vía resumidor de WebFetch; no vi las cifras de las tablas (no las necesito) ni el aviso legal completo ni sus términos de reutilización.
- Easy LA: no abrí Releases ni la carpeta `licenses`; «sin código» sale del listado resumido.
- PhET: la web es dinámica; las páginas de simulaciones devolvieron solo menú y pie. Nombres y funciones de las sims salen de la búsqueda, no de abrirlas.
  Fecha de corte de la licencia (29/03/2026) tomada de la página de licencias; confirmar sim a sim en «PhET > About» antes de cualquier uso directo.
- Destinos tomados de nombres del tablero; `estudio-04-11` y `arritmias-maqueta` están aparcados/pendientes, no activos hoy.
