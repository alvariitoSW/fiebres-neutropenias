# 2026-10-28 · educacion-pionera (fase 1, investigación)

**Resultado:** fase 1 hecha (informes en `autonomo/ideas/educacion-pionera/`; sin PR: la PR y el Artifact llegan con la fase 3)
**Vueltas:** 1 (+1 ampliación corta del agente de webs) · **Jueces:** no aplica (no toca la app)

## Qué se hizo
Adelantada del 30/10 al 28/10 por orden del usuario. Dos agentes sonnet:
- **Evidencia** → `evidencia.md` (117 líneas) + `evidencia.xlsx` (19 estudios con pasaje literal, claim-check). DOI en
  Crossref y PMID en PubMed. Sólido en médicos: recuperación con feedback (Larsen 2009, residentes) y repaso espaciado
  (Kerfoot 2010, 724 residentes). Moderado: fracaso productivo (Sinha y Kapur 2021, g=0,36; exige instrucción después;
  en medicina solo Willis 2020). Contradictorio en medicina: entrelazado en ECG (Hatala 2003 a favor, Monteiro 2017 en
  contra) y autoexplicación (Peixoto 2017, Klein 2019 sin efecto; Chamberland 2019 solo casos cercanos). Sin estudios
  de POE en médicos. Corrección: Kerfoot en estudiantes es Med Educ 2007, no 2006. 5 criterios de rúbrica con su cita.
- **Webs** → `webs.md` (10 ideas para A, B y C con su origen) + informes `ingenieria-inversa/anki-fsrs.md`,
  `oppia.md`, `ncase-trust.md`.
Revisión del encargo: la hice yo (no toca la app); riesgos anotados: referencias inventadas y webs que no abren.

## Qué no se pudo hacer o leer
- La red de la sesión solo deja abrir github.com, raw.githubusercontent.com y PubMed/eutils: PhET, Brilliant, Khan,
  Isaac Physics, Anki docs, ncase.me, Brainscape… dan 403. **Ninguna web se vio funcionando**: se estudiaron desde su
  documentación o código en GitHub. PhET ya no publica su código.
- Texto completo de Springer, Taylor & Francis y APA cerrado: Kapur 2008 (pasajes de fuentes secundarias), Bisra 2018
  (g=0,55 de un resumen de terceros), Loibl 2017, Rohrer 2007 y Kerfoot J Urol 2010 quedan ⚠️.
- «Cuándo da la guía» un tutor con pistas: sin comprobar en ninguna web.

## Para el usuario
- Si quieres que la fase 2 vea webs de verdad: permite en la red del entorno phet.colorado.edu, brilliant.org y los
  editores (link.springer.com, tandfonline.com, psycnet.apa.org).
- Nada que decidir hoy; la parada contigo sigue el 04/11.

## Visto de paso (no tocado)
- graft reescribió `.claude/settings.json` al arrancar y quitó la orden `git update-index --skip-worktree .ignore
  .gitignore` del arranque. No se subió (se perdería esa orden) y el permiso no dejó revertirlo: queda sin confirmar en
  el contenedor.

## Propuestas sobre las reglas
- Ingeniería inversa en sesiones de la nube: comprobar antes la lista de webs que deja abrir la red
  (`$HTTPS_PROXY/__agentproxy/status`) y elegir de ahí, o pedir al usuario que las permita antes de la sesión.

## Vueltas
| Pieza | Vuelta | Nota profesor | Modelo | Pasos | Tokens eq. | Qué falló |
|---|---|---|---|---|---|---|
| Evidencia | 1 | — | sonnet | 40 | 0,67 M | editores cerrados |
| Webs | 1+ampliación | — | sonnet | 29 | 0,48 M | 403 en casi todas las webs |

## Gasto
Total **1,3 M** (presupuesto 1,4 M; tope 1,5 M): desvío −7 %. Por papel: general-purpose sonnet ×2 1,1 M (89 %) ·
director ≈0,14 M (11 %). El que más gastó: evidencia (0,67 M frente a 0,6 M, +11 %: 19 estudios con pasaje literal).
Ahorro próxima vez: saber la red antes evita los pasos perdidos en webs que no abren.

## Cuentas
Presupuesto 1,4 M · sin Hacienda (<2 M) · gastado 1,3 M · desvío −7 % · queda de la tarea ≈4,7 M de ≈6 M (tope 8 M).
