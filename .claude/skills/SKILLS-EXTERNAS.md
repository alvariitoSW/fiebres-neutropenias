# Skills de terceros instaladas (23/10/2026)

A petición del usuario («instala estos repositorios»). Se revisaron sus scripts antes de copiarlos: solo se conectan a
bases públicas (PubMed/E-utilities, Crossref, OpenAlex, arXiv y similares). `literature-review` puede generar esquemas
con OpenRouter **solo** si se le da una clave (`OPENROUTER_API_KEY`); sin ella no envía nada.

| Skill | Origen | Licencia | Para qué en este proyecto |
|---|---|---|---|
| `claim-check` | stefanogarzon/clinical-ai-skills | código MIT, texto CC BY 4.0 | buscar en PubMed la prueba de una frase de una ficha, con el párrafo literal |
| `sr-screening` | stefanogarzon/clinical-ai-skills | código MIT, texto CC BY 4.0 | revisión sistemática guiada (PICO → PRISMA) |
| `citation-verification` | KalarisLabs/research-agent-skills | MIT | comprobar que cada referencia de la bibliografía existe y coincide |
| `paper-lookup` | KalarisLabs/research-agent-skills | MIT | buscar artículos y texto completo abierto con procedencia |
| `literature-review` | KalarisLabs/research-agent-skills | MIT | revisión de la literatura de un tema |
| `scientific-critical-thinking` | KalarisLabs/research-agent-skills | MIT | leer críticamente un estudio (sesgos, GRADE) |
| `systematic-review-prisma` | KalarisLabs/research-agent-skills | MIT | protocolo y cadenas de búsqueda PRISMA 2020 |
| `pydicom` | KalarisLabs/research-agent-skills | MIT | preparar y anonimizar DICOM para un futuro visor de cortes |

De `research-agent-skills` (281 skills, 36 MB, casi todas de biología, química y aprendizaje automático) solo se
copiaron estas 6: cada skill instalada añade su descripción a todas las sesiones. Para añadir otra:
`git clone --depth 1 https://github.com/KalarisLabs/research-agent-skills /tmp/ras` y copiar `skills/<nombre>`.

Son herramientas de investigación: lo que encuentren entra en la app solo con su fuente abierta y su página (CLAUDE §7).
