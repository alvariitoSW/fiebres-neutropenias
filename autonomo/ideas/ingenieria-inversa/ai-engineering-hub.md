# AI Engineering Hub (patchy631) · ingeniería inversa · 01/11/2026

Pedido por el usuario el 01/11 («¿y este repo para qué sirve?» y, tras la propuesta, «y después…» = sí al estudio).
Repositorio: https://github.com/patchy631/ai-engineering-hub (clon superficial con git en el scratchpad; nada suyo
entra aquí). Acta: `autonomo/consejo/2026-11-01-3.md`.

## Tesis

Es un **catálogo de ≈110 tutoriales de Python** para aprender a montar aplicaciones con IA (lo mantiene la newsletter
Daily Dose of Data Science; licencia MIT, «Copyright (c) 2024 patchy631»; último commit 30/10/2026). No es una
herramienta: cada carpeta es un ejemplo pequeño que junta servicios de pago y librerías. **Para la app, nada directo**
(todo necesita servidor o claves, CLAUDE.md §2). Aporta 3 ideas de método para el gobierno.

## Piezas (visto: lista de carpetas y README de 7 proyectos)

- 119 entradas en la raíz. ≈25 son «pregunta a tus documentos» (RAG), además de OCR, agentes, voz, vídeo,
  ajuste fino de modelos, comparativas de modelos y una ruta de aprendizaje.
- Leídos por encima: `rag-with-dockling` (tablas de Excel/PPT con Docling de IBM), `trustworthy-rag` (LlamaParse +
  Cleanlab TLM: nota de confianza y motivo por respuesta), `notebook-lm-clone` (respuestas con cita `[n]`, archivo y
  página), `gemma3-ocr` (OCR con un modelo de visión local vía Ollama), `groundX-doc-pipeline` (evalúa la extracción
  de facturas con un juez-IA con rúbrica, GEval de Opik), `eval-and-observability` (Opik para medir un RAG),
  `build-code-harness` (rehacer por dentro un agente tipo Claude Code con CrewAI + E2B).
- Casi todos piden claves: OpenAI, LlamaCloud, Cleanlab, Opik/Comet, OpenRouter, E2B. **No se ejecutó nada.**

## Frente a nosotros

| | Ellos | Nosotros |
|---|---|---|
| Sacar texto y tablas del PDF | Servicios (LlamaParse, Docling, OCR con IA) | `pdftotext`/`pdfimages` y la lectura del agente |
| Citas | `[n]` + archivo + página, automático | Enlace `#page=N` comprobado a mano (§7.2) |
| Comprobar fidelidad | Nota de confianza del modelo; juez-IA con rúbrica | Auditor ciego frase a frase, jueces, profesor |
| Dónde corre | Servidor + nube | Navegador, sin servidor |

## Ideas (de lo barato a lo grande)

- **H1 · Rúbrica escrita para el auditor ciego** (como su GEval): criterios fijos y una nota por criterio
  (cifra, dosis, unidad, página, omisión) además de la lista de hallazgos. Pequeño (texto del agente).
- **H2 · Probar Docling para tablas difíciles de los PDF**, solo en la sesión de trabajo (nunca en la app), en 1-2
  tablas que hoy cuesten (p. ej. una tabla partida en dos páginas de Marino), comparando con lo que sale ahora. Medio;
  necesita instalar una librería de Python en el contenedor de trabajo y decidir si compensa.
- **H3 · Comprobador automático de citas**: un juez que mira que cada `#page=N` existe en su PDF y que la cifra citada
  aparece en esa página (búsqueda de texto). Medio; encaja con `jueces.mjs`.
- **Para el usuario, fuera de la app**: NotebookLM de Google ya hace «pregunta a tus PDF con citas» sin programar.

## Lo que no traería

- Cualquier RAG, chatbot o IA dentro de la app (servidor y claves, §2; y la IA no es fuente, §7.1).
- Los servicios de pago (LlamaParse, Cleanlab, Opik) para el gobierno: suben los PDF a terceros y cuestan.
- Su código: solo ideas reescritas (§7.9).

## Lo que no se vio

Solo se leyeron los README y trozos de código de 7 de ≈110 proyectos. Ninguno se ejecutó.
