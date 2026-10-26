# Radar · entradas

Formato en `LEEME.md`. Norte en `NORTE.md`; fases en `HOJA-DE-RUTA.md`. La más reciente, arriba.
«no consta» = no está en las fuentes del proyecto; no se rellena.

## 2026-10-23/25 · primeras entradas (ya estudiadas)

| Fecha | Tipo | Qué | Veredicto |
|---|---|---|---|
| 2026-10-25 | repositorio | NV-Reason-CT (NVIDIA): IA que lee TC de tórax y abdomen | Fase 4 (lista de hallazgos, compañera de estudio) y nivel 3 · `autonomo/ideas/ingenieria-inversa/nv-reason-ct.md` |
| 2026-10-25 | repositorio | leanrea | Integrado en la skill `/ingenieria-reversa` v2 |
| 2026-10-25 | plugin | claude-code-setup (Anthropic) | Recomendaciones en la etapa A (graft, hooks, `/cerrar-tanda`, pruebas en GitHub) |
| 2026-10-23 | repositorio | clinical-ai-skills y research-agent-skills | Instaladas 8 skills (`.claude/skills/SKILLS-EXTERNAS.md`) |
| 2026-10-23 | web | anesthbeta (ETE) | Fases 0 y 2 · informe `anesthbeta.md` |
| 2026-10-23 | web | EchoSuite | Fases 0, 3 y G1 · `echosuite.md`, `echosuite-2.md` |
| 2026-10-23 | web | AngioView | Fase 2 · `angioview.md`, `angioview-2.md` |
| 2026-10-23 | web | NavRad Anatomy | Fase 4 · `navrad.md`, `navrad-2.md`, `navrad-3.md` |
| 2026-10-23 | web | Radiology Assistant | Fase 0 (bibliografía), G4, G5 · `radiologyassistant.md`, `-2.md` |
| 2026-10-23 | web | RitmoLab | Bloque 3 y G2 · `ritmolab.md`, `ritmolab-2.md` |
| 2026-10-23 | repositorio | REA (morluto/rea) | Herramienta de apoyo de `/ingenieria-reversa` |
| 2026-10-25 | tuit | Hilo sobre el gasto de uso de Claude Code (Boris Cherny) | Comprobado; lecciones de ahorro en la skill y la etapa A |

## Tanda pendiente

(vacía) Aquí se juntan las entradas nuevas con decisión pendiente; `/radar tanda` las lleva al usuario de una vez.

## Fichas de triaje (las 12 entradas, la más reciente arriba)

Campos: fecha · tipo · enlace · lo que dijo · qué es · sirve a · fuente que lo respalda · licencia · coste · veredicto.

### NV-Reason-CT (NVIDIA)
- **Fecha / tipo**: 2026-10-25 · repositorio
- **Enlace**: https://github.com/NVIDIA-Medtech/NV-Reason-CT
- **Dijo**: «la IA de Nvidia para leer TC body que te pase, y enlazarla mediante ingeniería reversa con las páginas…
  un agente de IA que ayude al médico radiólogo» (23/10)
- **Qué es**: IA que lee un TC 3D de tórax o abdomen y responde: informe, 64 hallazgos, preguntas. Solo investigación.
  No lee cráneo, Rx ni posición de dispositivos.
- **Sirve a**: G4 y G5 (como lista de hallazgos); nivel 3
- **Fuente**: ficha del modelo (huggingface.co) y artículo (arXiv): no vistos, dominios cerrados
- **Licencia**: OpenMDW-1.1, muy abierta, también para sus respuestas
- **Coste**: necesita tarjeta gráfica; precio: no consta
- **Veredicto**: fase 4 (lista de hallazgos y compañera de estudio); nivel 3 solo en el teléfono por ahora

### Hilo sobre el gasto de uso de Claude Code (Boris Cherny)
- **Fecha / tipo**: 2026-10-25 · tuit
- **Enlace**: no consta
- **Dijo**: no consta
- **Qué es**: hilo sobre cómo gastar menos del límite de uso
- **Sirve a**: ninguna situación de guardia; mejora del propio plan de trabajo
- **Fuente**: un tuit no es fuente; lo comprobado: no consta dónde
- **Licencia**: no aplica
- **Coste**: 0 €
- **Veredicto**: comprobado; lecciones de ahorro en la skill `/ingenieria-reversa` y en la etapa A

### leanrea
- **Fecha / tipo**: 2026-10-25 en la tabla (la skill v1 se escribió el 23/10 y se releyó el 25/10) · repositorio
- **Enlace**: `aicodeking/leanrea` (URL completa: no consta)
- **Dijo**: «mira si con este repositorio nos puede ayudar para tener la skill de /ingeniería-reversa» (23/10)
- **Qué es**: guía de ~8 KB con el comando más rápido por tipo de objetivo, sin servidor
- **Sirve a**: ninguna G; método de trabajo
- **Fuente**: su propia guía; su medida (~38 % más rápida, ~35 % más barata que REA) es de su autor
- **Licencia**: MIT
- **Coste**: 0 €
- **Veredicto**: integrado en la skill `/ingenieria-reversa` v2

### claude-code-setup (Anthropic)
- **Fecha / tipo**: 2026-10-25 · plugin
- **Enlace**: no consta
- **Dijo**: no consta
- **Qué es**: plugin que recomienda configuración de Claude Code
- **Sirve a**: ninguna G; preparación del plan
- **Fuente**: no consta
- **Licencia**: no consta
- **Coste**: no consta
- **Veredicto**: recomendaciones en la etapa A (graft, hooks, `/cerrar-tanda`, pruebas en GitHub)

### clinical-ai-skills y research-agent-skills
- **Fecha / tipo**: 2026-10-23 · repositorio
- **Enlace**: `stefanogarzon/clinical-ai-skills` y `KalarisLabs/research-agent-skills` en GitHub
- **Dijo**: «instala estos repositorios»
- **Qué es**: skills de investigación; se instalaron 8 (`claim-check`, `sr-screening`, `citation-verification`,
  `paper-lookup`, `literature-review`, `scientific-critical-thinking`, `systematic-review-prisma`, `pydicom`)
- **Sirve a**: fidelidad a la fuente (todas las fases); `pydicom` a la fase 4
- **Fuente**: `.claude/skills/SKILLS-EXTERNAS.md`
- **Licencia**: código MIT; texto de clinical-ai-skills CC BY 4.0
- **Coste**: 0 € (`literature-review` solo usa OpenRouter si se le da una clave)
- **Veredicto**: instaladas

### anesthbeta (ETE)
- **Fecha / tipo**: 2026-10-23 · web (2.ª pasada el 25/10)
- **Enlace**: https://tee-simulator.anesthbeta.com/atlas
- **Dijo**: «poder entender cómo se ha hecho y poder añadir todas las mejoras que poder aplicar a nuestro simulador»
- **Qué es**: atlas 3D de ETE, 35 vistas en la web, sonda con 5 mandos; ahora escaparate de una app de iPhone
- **Sirve a**: G6; fase 2 (ETE, banco de la mitral A1-P3); fase 0 (viaje entre vistas)
- **Fuente**: `anesthbeta.md`, parte `2026-10-23-tee-inversa.md`; su anatomía dice Human Reference Atlas (sin verificar)
- **Licencia**: Three.js MIT; anatomía CC BY 4.0 sin verificar; su código y su interfaz no son reutilizables
- **Coste**: web gratis; app freemium (compras dentro)
- **Veredicto**: fases 0 y 2

### EchoSuite
- **Fecha / tipo**: 2026-10-23 · web (2.ª pasada el 25/10)
- **Enlace**: https://echosuite.app
- **Dijo**: no consta (entró con las demás webs de B-012)
- **Qué es**: maniquí 3D de eco y 70 calculadoras (cada una con guía, fórmula con tus números y grado)
- **Sirve a**: G1; fase 0 (cifra con su grado); fase 3 (calculadoras)
- **Fuente**: `echosuite.md`, `echosuite-2.md`
- **Licencia**: software y figuras © del autor; three.js MIT; cines de terceros con su licencia (algunos CC BY-SA)
- **Coste**: gratis, sin cuenta
- **Veredicto**: fases 0 y 3, y G1

### AngioView
- **Fecha / tipo**: 2026-10-23 · web (2.ª pasada el 25/10)
- **Enlace**: https://angioview.com
- **Dijo**: no consta
- **Qué es**: simulador de proyecciones de coronariografía: arco en C, segmentos con % de acortamiento
- **Sirve a**: G3; fase 2 (coronarias, coronariografía que late); calidad en móvil (fase 0)
- **Fuente**: `angioview.md`, `angioview-2.md`; cita su fuente de rangos: Di Mario 2005 (tabla 2)
- **Licencia**: BodyParts3D CC BY 4.0 (con cabeceras que aún dicen CC BY-SA 2.1 JP), sin verificar en origen; sus
  archivos derivados no declaran licencia; three.js y React MIT
- **Coste**: web gratis; app de pago para iPhone/iPad
- **Veredicto**: fase 2

### NavRad Anatomy
- **Fecha / tipo**: 2026-10-23 · web (2.ª pasada el 23/10 y 3.ª el 25/10)
- **Enlace**: https://anatomy.navigatingradiology.com
- **Dijo**: no consta
- **Qué es**: atlas de TC reales corte a corte, con rótulos, notas docentes y quiz «¿dónde está?»
- **Sirve a**: G4 y G5; fase 4 (visor de cortes, «¿dónde está la punta?»)
- **Fuente**: `navrad.md`, `navrad-2.md`, `navrad-3.md`
- **Licencia**: ninguna declarada; sus imágenes no se pueden usar
- **Coste**: vista previa gratis; cuenta gratuita; parte de pago: no consta
- **Veredicto**: fase 4

### Radiology Assistant
- **Fecha / tipo**: 2026-10-23 · web (3.ª pasada el 25/10)
- **Enlace**: https://radiologyassistant.nl
- **Dijo**: no consta
- **Qué es**: unos 150 artículos docentes de radiología (figura + 2-6 frases). No cubre punta de tubo, vía central ni SNG
- **Sirve a**: G4 y G5; fase 0 (bibliografía en el PIF de Radiología)
- **Fuente**: `radiologyassistant.md`, `radiologyassistant-2.md`
- **Licencia**: sin licencia formal; imágenes reproducibles con fines docentes citando al autor (disclaimer); de los
  textos no dice nada. Decidido el 25/10: no usar sus figuras, solo enlazar
- **Coste**: web gratis; app con suscripción por categoría
- **Veredicto**: fase 0 (bibliografía), G4, G5

### RitmoLab (Farmacotips)
- **Fecha / tipo**: 2026-10-23 · web (2.ª pasada el 25/10)
- **Enlace**: no consta
- **Dijo**: no consta
- **Qué es**: simulador de arritmias con 17 escenarios, errores con consecuencia y revisión final
- **Sirve a**: G2; fase 1 (corazón eléctrico, bloque 3); modelos vivos (errores que empeoran al paciente)
- **Fuente**: `ritmolab.md`, `ritmolab-2.md`; sus cifras son de su simulación, no de una guía
- **Licencia**: no declarada
- **Coste**: no consta
- **Veredicto**: bloque 3 (fase 1) y G2

### REA (morluto/rea)
- **Fecha / tipo**: 2026-10-23 · repositorio
- **Enlace**: `morluto/rea` en GitHub
- **Dijo**: «reverse-engineer-anything» (nombre de la skill que citó el 23/10)
- **Qué es**: herramienta de ingeniería inversa; solo aportó en EchoSuite (mapa de módulos)
- **Sirve a**: ninguna G; método de trabajo
- **Fuente**: `docs/historial/radar.md` §1
- **Licencia**: MIT
- **Coste**: 0 €
- **Veredicto**: herramienta de apoyo de `/ingenieria-reversa`
