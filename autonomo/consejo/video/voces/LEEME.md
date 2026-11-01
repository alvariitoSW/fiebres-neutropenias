# Voces de los vídeos del Consejo

- `../voz.py`: texto → voz. Pasa siglas y cifras a palabras («PR #51» → «pe erre cincuenta y uno», «8,75» → «ocho coma
  setenta y cinco», «13/11» → «trece de noviembre»), sintetiza con Kokoro o Piper y pule el sonido (graves, siseos,
  presencia, compresión y volumen igualado; `sala=True` añade el eco corto de una sala de prensa).
- `../reparto.py`: qué voz tiene cada personaje.
- `evalua.py` y `resultados.json`: 9 voces puntuadas con un transcriptor automático (Whisper small): errores por
  palabra (`wer`, %), tono medio (`f0`, Hz) y palabras por minuto. Las de Kokoro fueron las únicas que dijeron bien
  «gobernador».
- `muestrario-de-voces.mp3` (lo hace `hacer.py`): el portavoz antes y después, y cada personaje con una frase suya.
- Los modelos de voz no se suben (pesan ~800 MB): se descargan de Hugging Face (`rhasspy/piper-voices` y
  `onnx-community/Kokoro-82M-v1.0-ONNX`, voces `ef_dora`, `em_alex`, `em_santa`). Licencias: Kokoro, Apache 2.0;
  Piper, MIT, y cada voz con la suya en su `MODEL_CARD`.
- Los vídeos aún llevan las voces del 01/11 por la tarde: para pasarles las nuevas, `python3 gen.py` en cada carpeta y
  volver a montar.
