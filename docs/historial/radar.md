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
