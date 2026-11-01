# Vídeos del Consejo (y cualquier vídeo que pida el usuario)

**Regla del usuario (01/11/2026):** cuando pide un vídeo (del Consejo, del Congreso, del estado de un plan o de lo que
sea), es **siempre un MP4 vertical con voces**, hecho con esta fábrica. Nunca una página animada ni un vídeo mudo, y
**nunca con acento latinoamericano**: todo el que hable, con voz de España.

## Cómo se hace uno (≈5 min)

1. `bash autonomo/consejo/video/instalar.sh` (una vez por contenedor: motores y voces, ≈570 MB).
2. Copia la plantilla que encaje en una carpeta nueva:
   - `rueda/`: **rueda de prensa** (el formato que gusta). El portavoz llega por el pasillo, sube al atril y responde
     a dos periodistas (`p1`, `p2`), con subtítulos de 3 en 3 palabras, rótulo de entrada, sonido de sala, pasos y
     cámaras de fotos.
   - `marino/`: estado de un plan, narrado.
   - raíz (`gen.py` + `consejo.html`): cada ministro se presenta y habla.
3. En el `gen.py` de la copia, escribe el guion en `G`: `(quién, plano, lo que se dice, subtítulo, pausa)`. Lo que se
   dice, con los números en palabras; el subtítulo, con cifras. Cambia el rótulo `#titular` del `.html`.
4. `cd <carpeta> && python3 gen.py` (voces → `audio/mezcla.wav` y `timeline.js`).
5. `node ../render.js . <escena>.html <salida>.mp4` (pinta 25 fotogramas por segundo y monta).
6. Antes de mandarlo, saca una hoja de fotogramas y mírala:
   `ffmpeg -i salida.mp4 -vf "select='not(mod(n\,400))',scale=240:-1,tile=6x1" -frames:v 1 hoja.jpg`.
7. Mándalo con `SendUserFile`. Los `.mp4` no se suben al repositorio (pesan): si el usuario quiere guardarlo, se
   decide aparte.

## Voces (`reparto.py`)

- Portavoz y todos los ministros que hablan español de España: Piper `es_ES-davefx-medium` y
  `es_ES-sharvard-medium` (hablante 0, hombre; hablante 1, mujer), con `tono` y `velocidad` para distinguirlos.
- **Kokoro no tiene voces de España**: `ef_dora`, `em_alex` y `em_santa` suenan latinoamericanas aunque la
  pronunciación sea de España. El 01/11 se pusieron al portavoz y al usuario no le gustó el acento: no se usan para
  hablar en español de España.
- `es_MX-ald-medium`, solo para un personaje mexicano a propósito (Exteriores).
- `voz.py` pasa siglas y cifras a palabras («PR #51» → «pe erre cincuenta y uno», «8,75» → «ocho coma setenta y
  cinco») y pule el sonido; `sala=True` añade el eco de una sala de prensa.

Historia: los primeros vídeos se hicieron el 30/10-01/11 en la sesión «Vídeo consejo de ministros» (rama
`ccr-9b1626a6-8w7auz`, con los MP4 de entonces). Se trajo a `main` el 01/11 porque otra sesión no la encontró y
entregó una página animada en vez del vídeo.
