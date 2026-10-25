# Encargo `eco-mega` · parada 1: maqueta «antes / después» de la imagen de eco

Rellenado por el director (25/10/2026) a partir de B-015 del tablero; el usuario lo revisa en la PR.

**Encargo `eco-mega`** · tipo: visual (megaproyecto, REGLAS §7.12). Esta sesión: **solo el trozo 1, la imagen**.
- Qué quiero: una maqueta que enseñe, sobre el mismo fotograma del mismo motor, la imagen ecográfica de hoy («antes»)
  y una imagen más realista («después»), con cada mejora encendible por separado, para que el usuario elija cuáles
  entran en la app y con qué intensidad.
- Para qué: estudiar (que la eco del simulador se parezca a la que el residente verá en la guardia) y consultar.
- Modelo «así sí»: el propio simulador (`js/modules/eco/`, `laboratorio.html` lo monta solo) y la imagen de
  *The Heart by Ultrasound* (`/tmp/echodemo/src/bmode.js`: solo ideas, nunca código).
- Lo visual que espero (cada una con su interruptor y, si cabe, un deslizador de intensidad):
  1. Moteado (*speckle*) realista que se mueve con la pared (no ruido que cambia en cada fotograma).
  2. Sombra acústica detrás de lo muy ecogénico (pericardio, calcio, costilla) y refuerzo posterior detrás del líquido
     (derrame, cavidades).
  3. Reverberación / artefactos de campo cercano (la banda borrosa de la pared torácica arriba).
  4. Superficies especulares: brillan cuando el haz las corta perpendicular y se apagan en paralelo (la pared lateral
     del apical ya se ve más débil; hacerlo con ese criterio).
  5. Ganancia, ganancia por profundidad (TGC, 3-4 mandos) y profundidad que cambian la imagen como en un ecógrafo.
  6. Desenfoque del haz que empeora lateralmente y con la profundidad; foco.
  7. «Ventana pobre» (paciente obeso / ventilado): menos señal y más ruido, como reto.
  8. Calidad automática en el móvil (menos haces/muestras si el fotograma va lento), medida.
- Modelo grande que usar: el ecógrafo y el motor del latido de siempre, en 3-4 vistas (paraesternal largo y corto,
  apical 4C, subcostal) y 2-3 estados (normal, derrame, VI dilatado o hipovolemia).
- Lo que NO quiero: tocar la app todavía (ni `js/modules/eco/ecografia.mjs` ni nada de `js/`); copiar código de
  echodemo; imágenes de pacientes; colores nuevos; un esquema en vez de la imagen real del motor.
- Fuente: física de los ultrasonidos → origen `fisiología general` o `ilustrativo`, a la vista en la maqueta; ideas
  de `bmode.js` de echodemo citadas como «idea de *The Heart by Ultrasound* (D. Ouyang), reconstruida».

## Entregable de la parada
- `autonomo/maquetas/eco-imagen.html` + `autonomo/maquetas/eco-imagen/` (copia de trabajo del renderizador,
  p. ej. `ecografia-v2.mjs`, que importa el motor real de `js/modules/eco/`).
- Antes / después lado a lado o con cortinilla, mismo fotograma; interruptores por mejora; tiempo por imagen medido.
- Capturas a 390 px de cada vista antes / después (PNG) en `/tmp/plan-socialista/eco-mega/capturas/`.
- Una página Artifact para que el usuario elija (la publica el director).
- Siguiente parada (no ahora): anatomía (esófago, valvas por segmentos, coronarias) y la duda de las mallas abiertas.
