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

## Diseño y animación web (31/10/2026)

A petición del usuario («sí, instalas»), de `emilkowalski/skills` (commit a81dbca, licencia MIT copiada en
`LICENSE-emilkowalski-skills`). Solo texto, sin scripts. Del repositorio (16 skills) se copiaron 5; las de Swift, Expo,
Sonner (React) y elegir librerías no encajan (CLAUDE §2: sin librerías nuevas sin el usuario). Están en inglés; lo que
salga para la app va en español y respetando `CLAUDE.md` (Motion es la única librería; «reducir movimiento» manda).

| Skill | Para qué en este proyecto |
|---|---|
| `mobile-native` | que la web se sienta app en el móvil (hover pegado, zoom en casillas, zonas seguras, toques lentos) |
| `review-animations` | revisar con lupa una animación (curva, duración, interrupción) |
| `animation-performance` | animaciones que dan tirones en el móvil |
| `improve-animations` | informe de todas las animaciones con planes priorizados (informe primero, el usuario elige) |
| `break-ui` | probar una pantalla con datos extremos (textos largos, números enormes, listas vacías) |

Primer uso (31/10): `mobile-native` encontró el hover pegado tras el toque (25 reglas, ahora tras
`@media (hover: hover) and (pointer: fine)`) y el zoom del iPhone en 704 de 712 casillas (letra <16 px; ahora 16 px en
pantallas táctiles).
