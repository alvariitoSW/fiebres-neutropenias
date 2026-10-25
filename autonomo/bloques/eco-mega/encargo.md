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

---

# Parada 1 · paso 2: las mejoras de la imagen, en la app (sesión del 25/10/2026)

Rellenado por el director. El usuario aprobó **todas** las mejoras de la maqueta (0-8), con la ventana pobre como
reto apagado por defecto (tablero, 25/10). Tipo: visual (mejora de lo existente; copia la maqueta → constructor barato).

- Qué quiero: que la imagen del simulador y del atlas sea la «después» de `autonomo/maquetas/eco-imagen.html`.
- **Pieza 1 · el ecógrafo** (`js/modules/eco/ecografia.mjs`): las mejoras 0-6 de `eco-imagen/ecografia-v2.mjs`
  pasan al `crearEcografo()` real, encendidas con las intensidades por defecto de la maqueta; la 7 (ventana pobre)
  existe pero a 0; la 8 (calidad automática: menos haces o muestras si el fotograma va lento) en el bucle de dibujo
  del simulador y del atlas. Sin dos copias: la maqueta pasa a importar del módulo real (o se queda como estaba,
  congelada, si cambiarla rompe su «antes»). Pruebas del módulo en verde y una nueva: con todas las intensidades a 0,
  la imagen es la de antes (diferencia media de gris ≈ 0).
- **Pieza 2 · los mandos y el estudio** (`js/modules/eco/simulador.mjs` y su HTML): ganancia, TGC (4 mandos),
  profundidad y foco (con su marca en el borde de la imagen, como en los ecógrafos), el reto «ventana pobre», y
  «Señálalo» de los artefactos (sombra, refuerzo, reverberación, especular, foco) con su frase y origen
  `fisiología general`. Más las notas baratas del profesor de la vuelta 3: rótulos de Señálalo que no chocan, pared
  libre del VD y AD más finas con «Paredes reales».
- Modelo «así sí»: la propia maqueta (vuelta 3, aprobada por el profesor 8,3-8,8).
- Lo que NO quiero: tocar la anatomía (parada 2), colores nuevos, código de echodemo, cambiar una referencia para que
  pase una prueba, que el móvil vaya a tirones.
- Hecho: `node --test 'js/modules/eco/pruebas/*.test.mjs'` y `jueces.mjs --eco` en verde; profesor ≥8 (meta 8,75).
