# Radar: ingeniería inversa, norte y rumbo de la app (desde el 23/10/2026)

Memoria del día en que el usuario abrió la línea de «ingeniería inversa» y el proyecto Radar (B-012 de la bitácora).
Lo que viene aquí sirve para retomarlo desde cualquier sesión. **Las propuestas de cambio de reglas (al final) no están
aprobadas**: hasta que el usuario las apruebe, mandan `CLAUDE.md` y `autonomo/REGLAS.md` tal como están.

## 1. Qué se hizo el 23/10/2026, en orden

| # | Qué | Resultado | Dónde |
|---|---|---|---|
| 1 | `tee-inversa` (anesthbeta, simulador de ETE) | Informe-propuesta con 7 mejoras y paquetes A/B/C | https://claude.ai/artifact/6N5ChQF3E82Ca7DoNqEfaU · parte `2026-10-23-tee-inversa.md` |
| 2 | EchoSuite, AngioView, NavRad (1.ª pasada) | Informe «Un paciente, todas las pruebas» (fases 0-4) | https://claude.ai/artifact/T4WcxXWzjPGm911ShU3aiS · `autonomo/ideas/ingenieria-inversa/` |
| 3 | Skill `/ingenieria-reversa` | Método de leanrea y REA adaptado a webs médicas | `.claude/skills/ingenieria-reversa/` · `trabajo-autonomo.md` |
| 4 | Radiology Assistant y RitmoLab | Informe «Ritmo vivo y placa guiada» | https://claude.ai/artifact/1GTkuwubZ22Hb9qu4PW4P5 |
| 5 | Skills de terceros | `claim-check`, `sr-screening` y 6 de research-agent-skills | `.claude/skills/SKILLS-EXTERNAS.md` |
| 6 | NavRad (2.ª pasada, con imagen) | Informe propio | https://claude.ai/artifact/2v4kHFM66eac8d5bYWZgtm · `navrad-2.md` |
| 7 | Informe final de las 6 webs | «Del simulador a la cama»: 8 principios, arquitectura del paciente vivo, 6 situaciones de guardia, fases 0-4 | https://claude.ai/artifact/3hnNvcEsvsotfViShnXLee · parte `2026-10-23-rea-final.md` |
| 8 | B-012 · Radar | Apuntado y afinado; **sin aprobar** | `autonomo/BITACORA.md` |

Lecciones técnicas del día:
- **Red del entorno**: WebFetch no resuelve muchos dominios; Playwright del entorno sí, una vez que el usuario los abre
  en «Allowed domains». Las imágenes de una web pueden venir de **otro subdominio** (NavRad: `dicom.`): hubo que abrir
  `*.navigatingradiology.com`. Siguen cerrados: `zenodo.org`, `*.cancerimagingarchive.net`, `*.radiopaedia.org`,
  `registry.opendata.aws`, `medicaldecathlon.com`, `heart.org`.
- **Permisos**: el sistema bloquea guardar en disco código ajeno (scripts, mallas) y volver a ejecutar una web ajena
  en ciertos contextos; se lee en memoria. REA solo aportó en EchoSuite (mapa de módulos por CDP).
- **Investigadores en paralelo**: uno por web, con la skill como encargo; informes de ≤120 líneas; el director escribe
  la síntesis. Funcionó bien con 3 a la vez.

## 2. El norte (lo que el usuario quiere conseguir)

Borrador aceptado por el usuario el 23/10 («todo lo que has puesto estoy de acuerdo»), con su añadido: **mejorarlo y
abrir la puerta a seguir mejorándolo conforme avanzan la IA y la tecnología**.

> Que un R1 de UCI entienda y maneje al paciente crítico: en la cama, la respuesta en 30 segundos desde el móvil;
> para estudiar, el mecanismo que se ve y preguntas que obligan a pensar; todo fiel a su fuente con página, en español.

Tres niveles, cada uno con su puerta (B-012):
1. **Estudiar**: modelos vivos, fichas y Mayéutica. Lo estudiado en las webs (eco, arritmias, ETE, coronarias, TC) se
   rehace sobre nuestros motores, ahorrando diseño.
2. **Ayudar en la guardia**: el usuario mete las medidas de la eco mientras explora (teclea o dicta) y la app calcula
   todo lo posible, con grado, fórmula y coherencia entre medidas; el motor se ajusta a esas medidas y muestra «su
   paciente» latiendo (gemelo hemodinámico). Todo en el teléfono.
3. **Asistente con IA**: el usuario: «la IA de Nvidia para leer TC body que te pase, y enlazarla mediante ingeniería
   reversa con las páginas que te he pasado sobre rayos, y con todas esas 3 bestias, unirlas para crear literalmente lo
   más parecido a un agente de IA que ayude al médico radiólogo para el proceso de diagnóstico y estudio». Lo mismo
   para la eco: «pasar la información de ecocardio en tiempo real y realizar el máximo de cálculos posibles… y hacer
   literalmente magia con esa información». Candidatos a comprobar: modelos abiertos de NVIDIA para TC (familia
   MONAI / VISTA-3D: modelo exacto y licencia **sin verificar**).

Más un **vigía tecnológico** dentro del radar: cada avance de IA o de técnica entra como una entrada más y se tría
contra el norte.

## 3. Datos de pacientes: lo que dijo el usuario y lo que implica

El usuario (23/10): «no habría que guardar datos personales de pacientes pero que sí pudiera usarlo para hacer
cálculos o lo use en radiología para ayudarme a diagnosticarlo, pero luego no se guarden y menos de datos personales,
pero sí usar los datos de las imágenes y demás para alimentar a Claude de información y mejorarse».

Lo que se le explicó (para tenerlo en cuenta al diseñar):
- **Cálculos con medidas, sin identificar al paciente, en el teléfono y sin guardar**: compatible con la app tal como
  es (nivel 2). Es lo más fácil y lo más útil a corto plazo.
- **Imágenes reales de pacientes para ayudar a diagnosticar**: aunque no se guarden, procesarlas ya es tratar datos
  de salud. Camino seguro: anonimizar antes (cabeceras DICOM y texto incrustado), procesar en el propio dispositivo
  o en un ordenador del hospital, nunca en un servicio externo sin acuerdo del hospital; y presentarlo como apoyo, con
  el médico como responsable. Una herramienta que ayuda a diagnosticar es producto sanitario si se usa en clínica.
- **«Alimentar a Claude para que se mejore»**: Claude no aprende de las conversaciones de forma que la app mejore sola,
  y enviar imágenes de pacientes a un servicio de IA externo es una cesión de datos de salud. Lo que sí se puede: que
  **la app** crezca con una biblioteca de **casos anonimizados o abiertos** (hallazgo, diagnóstico final, lección),
  escritos por el usuario sin datos personales, y con casos de licencia abierta. Eso es «mejorarse» sin riesgo.
- **Decidido por el usuario (23/10)**: «lo de alimentar a Claude lo olvidamos». Queda descartado.

## 4. Propuestas de cambio de reglas (pendientes de aprobación del usuario)

1. **Norte** en `CLAUDE.md` §1: los tres niveles y el vigía tecnológico, como vara de medir de toda tarea nueva.
2. **Radar** en `autonomo/REGLAS.md`: entrada única (webs, repositorios, tuits, ideas), ficha de triaje, «un tuit o una
   web no son fuente», decisiones por tandas.
3. **Nivel 2 (guardia)**: modo de trabajo sin guardar nada (memoria de la página, se borra al cerrar), sin datos
   identificativos, con aviso visible de «apoyo, no sustituye el juicio clínico».
4. **Nivel 3 (IA)**: excepción a «sin backend» y «una sola librería» para un componente aparte (como `backend/` y
   `admin/`), con IA en el dispositivo o en un ordenador del hospital; datos solo anonimizados; nada a servicios
   externos con datos de pacientes.
5. **Biblioteca de casos**: casos anonimizados o abiertos, sin datos personales, con su licencia, como fuente de
   preguntas y ejemplos.

## 5. Preguntas abiertas (a 23/10)

- ¿Servidor o GPU para el nivel 3, o solo lo que corra en el teléfono?
- ¿Uso solo docente o también con pacientes reales (visto bueno del hospital)?
- ¿Cómo pasa el usuario lo de Twitter (enlace, captura, texto)? ¿Cada cuánto, la tanda de decisiones? ¿Nombre «Radar»?
- Del informe final: arrancar la fase 0; «ok» a la maqueta v2 del corazón eléctrico (bloque 3); PDF (ECG básico de la
  rotación de Cardiología, que empieza el 01/11; AHA 2025; ESC 2021 de estimulación; ESC de SCA; ASE/EACVI 2015; ASE
  2025 de corazón derecho y diastólica; ASE/SCA 2013 de ETE; Di Mario y Sutaria 2005; temarios de radiología).

## 6. Plan de integración (propuesta del 23/10, sin aplicar)

El usuario pidió «construir el plan socialista para unir con la ingeniería inversa las páginas… para ver cómo sería
el plan que ejecutar y si fuera necesario hacer cambios antes de actuar». Página: https://claude.ai/artifact/5em9RdpkzZGjV91CBMCBLh.
- **Cadena**: radar → ingeniería inversa → filtro del norte → tablero → plan socialista → «Ver en el móvil».
- **Regla de oro**: el constructor trabaja solo con nuestro informe de ingeniería inversa y nuestras fuentes; nunca
  abre la web ajena.
- **Dos carriles**: corazón (bloque 3, con la fase 1 dentro: `b3-ritmo-v3`, `b3-3c`, `b3-ritmo-motor`, `pif-ecg`,
  `b3-bradi`) y producto (fase 0: `f0-cifras`, `f0-origen`, `f0-eco-color`, `f0-eco-rotulos`, `f0-eco-viaje`,
  `f0-eco-guia` —las cuatro de eco, un solo constructor en serie—, `f0-movil`, `f0-ra-biblio`). En espera: `f2-coronarias`,
  `f2-angio`, `f2-ete`, `f3-calc-eco`, `f4-visor`, `f4-punta`, `f4-recorridos`.
- **Seis cambios previos** (propuestos): 1) objetivo «Integración» y tipo `integracion` en el tablero; 2) modo
  `integrar <clave>` en la skill del plan socialista; 3) constructor: no abrir webs ajenas, cifra/grado y fórmula,
  chip de origen; 4) profesor: modo «en la guardia» y 3 puntos más de rúbrica; 5) jueces `--calc`, `--origen` y
  presupuesto de peso y fps de la eco; 6) norte y Radar en las reglas (§4 de este archivo).


## 7. La bandeja del Radar (25/10/2026)

El usuario pidió mandar desde el móvil los tuits y papers que ve, para que entren en la app con el proceso de UCI
Papers. Se descartó usar el panel de subida (`backend/`), porque gasta de una clave de pago de la API («No voy a pagar
más, quiero usar un medio que no me haga gastar ni un euro»). Elegida la **opción A**: un issue fijo de GitHub, el
**#27 «📥 Bandeja del Radar»**, donde comenta los enlaces desde la app de GitHub; y una **tarea programada diaria** de
Claude Code (6:42, hora de Canarias; sesión nueva cada vez; como mucho 5 entradas por día) que la procesa con su plan,
sin coste extra. Procedimiento en `autonomo/radar/LEEME.md`, registro en `autonomo/radar/ENTRADAS.md`. Los papers
entran por PR en borrador; un tuit no es fuente: se busca el paper original. Telegram (opción B, también gratis con
Cloudflare) queda para más adelante si la usa mucho.

## 8. Montaje del Radar (25/10/2026)

Tarea `radar` (B-012), aprobada el 25/10 («estoy de acuerdo con todo»). Solo organización, sin tocar la app:
- `autonomo/radar/NORTE.md` (el norte fijo, tres niveles, G1-G6, datos de pacientes, lo que no queremos).
- `autonomo/radar/HOJA-DE-RUTA.md` (fases 0-4, fase G y carriles, con su estado copiado del tablero).
- `autonomo/radar/ENTRADAS.md` con la ficha de triaje de las 12 entradas y una «Tanda pendiente» vacía.
- Skill `/radar` (`apunta`, `tanda`, `rumbo`) en `.claude/skills/radar/SKILL.md`; en la PR para su visto bueno.

## 9. Coronary Culprit (26/10/2026, B-026)

- `/ingenieria-reversa` de https://www.cliffreid.com/culprit/: primero bloqueada (`www.cliffreid.com` daba 403; el
  usuario lo permitió en la red). Informe «Arteria culpable»: https://claude.ai/artifact/Y6ewAZfAk5cPewnsnNcsAw;
  detalle y 9 pares de prueba en `autonomo/ideas/ingenieria-inversa/culprit.md`.
- Decisión del usuario: opción 1. Fichas A («Del vaso a la derivación») y B (preguntas «predice el ECG» y «coloca el
  trombo») en la Fase 1, después de Marino; C (modelo vivo 2D) cuando la eco tenga coronarias; D (caso con reloj) tras C.
- Fuentes reunidas en `docs/`: ESC 2023 de SCA (2 partes), Wagner 2009, Thygesen 2018, de Winter 2008, CONFIRM 2015,
  Tamura 2014. Su modelo pone ↓ST en aVR en el tronco; Tamura (Yamaji) da ↑ST en el 88 %: no copiar ese detalle.
- Sin respuesta aún: three.js (3D), repaso espaciado (4.ª excepción de `localStorage`) y el mensaje a Cliff Reid
  pidiendo permiso para usar su material.
