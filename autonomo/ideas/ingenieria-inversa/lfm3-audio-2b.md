# LFM3-Audio-2B (Liquid AI) — informe de ingeniería inversa

Pedido el 28-29/10/2026 («instala este repositorio con /ingenieria-reversa»). Estudiado el 29/10/2026 leyendo la
ficha del modelo, su licencia y la lista de archivos por la API de Hugging Face (`huggingface.co/api/models/...`).
**No se ejecutó** (4 GB, sin GPU en el entorno): nada de lo que sigue es «visto funcionar».
Informe para el móvil: ver el enlace en `autonomo/BITACORA.md`.

## Qué es (visto: ficha `README.md` del repositorio)

- Modelo de IA de audio de **2.000 millones de parámetros** («2B total»). Entra texto o voz (16 kHz); sale texto, voz
  (24 kHz) o las dos cosas a la vez. Contexto de 32K tokens.
- Sabe hacer: **voz a texto** (también en directo, mientras hablas), **texto a voz** (voz «female» o «male» por idioma),
  **conversación por voz**, traducción hablada, entender grabaciones y convertir órdenes habladas en acciones
  («tool calling»).
- **18 idiomas, español incluido** (solo «Spanish», sin distinguir España/Latinoamérica).
- Publicado el **27/10/2026** (último cambio del repositorio); la versión ONNX, el 28/10 (42 descargas). Muy nuevo.
- La propia ficha avisa: «usa búsqueda o recuperación para tareas con mucho conocimiento» y no lo recomienda para
  razonamiento complejo por su tamaño. → **No sirve como fuente de respuestas clínicas** (CLAUDE.md §7.1).

## Cifras que declara (visto: tabla «Benchmarks»; no son nuestras, son suyas)

- Voz a texto en inglés: 6,23 % de palabras erróneas (WER). Multilingüe (FLEURS, media de 9 idiomas con español):
  6,03 %. **No da la cifra del español por separado** (no visto) ni nada de vocabulario médico (no visto).
  FLEURS es voz leída de temas generales: en español médico (fármacos, siglas) el error será mayor (deducido).
- Calidad de voz en inglés (UTMOSv2): 3,83 sobre 5. Primera respuesta «desde 50 ms»; el generador de voz, 87× más
  rápido que el tiempo real en un Mac M4 Max (un hilo).

## Licencia (visto: archivo `LICENSE`, «LFM Open License v1.0»)

- Calcada de Apache 2.0: uso, copia, modificación y redistribución gratis, perpetuo, mundial.
- **Límite comercial**: el uso comercial queda fuera de la licencia si la empresa factura **≥ 10 millones $ al año**
  (las organizaciones sin ánimo de lucro están exentas para uso no comercial). Para el usuario: sin problema.
- Al redistribuirlo: copia de la licencia y avisos de cambios. No da derecho a usar la marca. Sin garantía.
- No vi cláusula de usos prohibidos ni nada sobre uso sanitario (no visto ≠ no existe fuera del `LICENSE`).

## Cómo se ejecuta (visto: fichas de cada variante y su lista de archivos)

| Variante | Con qué | Descarga |
|---|---|---|
| BF16 (original) | Python: `transformers>=5.20.2` + `torch` (+ vLLM, SGLang) | 4,0 GB + 147 MB del codec |
| GGUF Q4_K_M | llama.cpp ≥ b11960 (`llama-mtmd-cli`, `llama-tts`, `llama-server` con voz en directo `/v1/realtime`) | 1,10 GB + 338 MB (mmproj Q8) |
| MLX 4-bit | Mac con chip Apple | 1,59 GB + 147 MB |
| ONNX q4f16 (GPU) | ONNX Runtime | 2,09 GB |
| ONNX en el navegador | `onnxruntime-web/webgpu` (librería nueva); decoder q4f16 + encoder y codec fp32 | ≈ 2,4 GB (deducido: 1,41 + 0,51 + 0,18 + 0,34) |

- **Memoria que necesita: no la declara** (no visto). Deducido: al menos lo que pesa el archivo (1,5-2,5 GB de RAM) más
  el contexto.
- **Demo web lista para usar: no vista.** El único Space es `hugging-apps/lfm3-audio-2b` en Gradio (funciona en un
  servidor). Para el navegador habría que escribir todo el bucle (mel, codificador, decoder paso a paso, depth decoder
  con 3 pasadas MaskGIT, iSTFT): la ficha ONNX lo describe pero no da código JS (no visto).
- Móvil: ninguna variante para Android/iOS en la ficha (no visto); llama.cpp corre en móviles en general (deducido).

## Frente a nosotros

- La app hoy **no usa voz** (ni `speechSynthesis` ni `SpeechRecognition`: grep en `js/` sin resultados).
- El navegador ya trae dos piezas gratis, sin librería ni descarga: **leer en voz alta** (`speechSynthesis`, con las
  voces del sistema; funciona sin conexión si el móvil tiene la voz instalada) y **dictado** (`SpeechRecognition`; en
  Chrome manda el audio a servidores de Google — dato general, sin comprobar aquí). Y el **micrófono del teclado del
  móvil** ya permite dictar en cualquier casilla, Dudas de guardia incluida, sin tocar nada.
- Donde LFM3 ganaría: todo **en el dispositivo** (nada sale del móvil), voz más natural, conversación de ida y vuelta.
- Donde pierde: 1-2,5 GB por dispositivo, librería nueva, modelo de 2 días sin probar en español médico, batería y
  calor en el móvil, y un modelo pequeño que **puede inventar** si se le deja contestar.

## Opciones para el usuario (de lo barato a lo grande)

1. **No traerlo** (coste 0). Para dictar dudas: el micrófono del teclado del móvil, ya hoy.
2. **Leer fichas en voz alta con la voz del móvil** (`speechSynthesis`, del propio navegador): pequeño; no es una
   librería ni guarda nada, pero es una pieza nueva de la app → decisión del usuario. Riesgo: lee mal siglas y
   unidades («mEq/L», «FEVI»); habría que preparar el texto. Situación de guardia: repasar una ficha conduciendo o con
   las manos ocupadas.
3. **LFM3 solo en el ordenador del usuario** (llama.cpp o LM Studio, fuera de la app): medio para él, 0 para la app.
   Útil para probar si entiende su español médico antes de decidir nada más. Conectar la app a ese programa sería un
   «servidor local»: choca con §2 y solo funcionaría en casa.
4. **LFM3 en el navegador** (WebGPU): grande. ≈ 2,4 GB de descarga por móvil, `onnxruntime-web` (librería nueva, §2),
   código propio para todo el bucle, móvil reciente con WebGPU y RAM de sobra. Solo como «oído y voz» (dictar,
   leer, Mayéutica hablada que transcribe la respuesta y la corrige el motor de siempre), **nunca como fuente**.
   Esperaría meses a que madure (demo web oficial, pruebas en español).

## Lo que no traería

- El modelo contestando dudas clínicas por sí mismo (§7.1: no es fuente; la ficha lo desaconseja).
- Cualquier servidor (el Space de Gradio, la API de Liquid `console.liquid.ai`, el «playground»): rompe §2 y saca la
  voz del móvil.
- Dictado que mande audio de dudas con datos de pacientes a servidores ajenos sin que el usuario lo sepa.

## Lo que no se pudo ver

- No se ejecutó ni se oyó: ni calidad del español, ni velocidad, ni memoria real. Ni WER del español por separado.
- No hay pares de prueba observados (no hubo pantalla). Si se prueba en el ordenador (opción 3), apuntar 5 frases:
  «noradrenalina a 0,3 microgramos por kilo por minuto», «FEVI del 35 %», «PaO2/FiO2 de 180», «piperacilina-
  tazobactam 4/0,5 g cada 6 h», «hiperpotasemia de 6,8 mEq/L con QRS ancho» → texto transcrito, y contar errores.

## Piezas (para la próxima visita)

Repositorio `LiquidAI/LFM3-Audio-2B`, sha `9d49701c`, 27/10/2026: `model.safetensors` 4.004.729.320 B,
`audio_tokenizer/model.safetensors` 147.143.540 B, `modeling_lfm3_audio.py` 91.241 B, `README.md` 38.883 B,
`LICENSE` 10.574 B. Variantes: `-GGUF` (Q4_0 1050 MB, Q4_K_M 1100, Q8_0 1846, BF16 3467; mmproj Q8 338, BF16 571),
`-ONNX` (q4 2,71 GB, q8 3,36, q4f16 2,09, q8f16 2,74, fp16 4,30, fp32 8,27), `-MLX-4bit` (1585 MB), `-Preview`.
