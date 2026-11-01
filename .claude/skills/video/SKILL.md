---
name: video
description: Vídeos para el usuario (Consejo de Ministros, Congreso, rueda de prensa, estado de un plan, explicación de lo que sea). Siempre un MP4 vertical CON VOCES de España, con la fábrica de autonomo/consejo/video (escenas dibujadas, subtítulos y sonido de sala). Nunca una página animada, un artifact ni un vídeo mudo, y nunca voces con acento latinoamericano. Úsalo siempre que el usuario pida un «vídeo», «vídeo del Consejo», «rueda de prensa», «explícamelo en vídeo» o algo parecido.
---

# Vídeos del usuario

Regla del usuario (01/11/2026, muy enfadado tras recibir una página animada y luego un portavoz con acento latino):
**todo vídeo que pida lleva voces, va en el formato de la fábrica y suena en español de España.**

1. Lee `autonomo/consejo/video/LEEME.md` y síguelo paso a paso (instalar, copiar plantilla, guion, `gen.py`,
   `render.js`, hoja de fotogramas, `SendUserFile`).
2. Formato por defecto: `rueda/` (rueda de prensa con portavoz en el atril y periodistas). Si pide «Consejo» con
   ministros hablando, la plantilla de la raíz; si pide el estado de un plan narrado, `marino/`.
3. Voces: solo las de `reparto.py` (Piper de España). No metas Kokoro para nadie que hable español de España.
4. Guion: frases cortas, cifras sacadas de los archivos (tablero, sesiones, actas), números en palabras en lo hablado
   y en cifras en el subtítulo. 1-2 minutos.
5. Antes de mandarlo, mira la hoja de fotogramas. Escucha al menos el principio: transcribe 10 s con
   `faster-whisper` si está, o di que no lo has escuchado.
6. Nada de publicar una página con `Artifact` en lugar del vídeo.
