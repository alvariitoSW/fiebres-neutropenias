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

---

# Parada 2 · anatomía, fisiología y patología (desde el 26/10/2026)

Decidida por el usuario: «Parada 2 de `eco-mega`» en `autonomo/TABLERO.md` (con la ampliación de B-025). Los encargos
están escritos, con sus fuentes, pares de prueba, archivo dueño y modelo, en:
- `autonomo/ideas/ingenieria-inversa/corazon-mas-real-plan.md` §2 (A1-A3, B1-B5, C1, D1) y §3 (equipos y dueños);
- `autonomo/ideas/ingenieria-inversa/eco-fisiopatologia.md` §5 (F1, F5, N2, N3, P1, P2, P4).

**Orden**: 0 lector → A1 → B1 + F1 → A2 → B2 + N2 → A3 → N3 → B3 → B4 → F5 → B5 → P2 → C1 → P1 → D1 → P4.
**Equipos** (no se pisan): Imagen = `ecografia.mjs`, `js/data/eco-tejidos.js`, `ecografia.test.mjs`,
`enfermedad.test.mjs`; Forma = `corazon-geo.mjs`, `referencias.mjs`, `geometria.test.mjs`, `paciente-posible.test.mjs`.
`escenarios.mjs`, `motor.mjs`, `eco.html`, README: solo con permiso del director. `?v=` y fusión: el director.

**Reglas del usuario para esta parada**: barato salvo B2, C1, P1 (potente). P1 incluye **revisar el pericardio, sobre
todo alrededor de las aurículas, y hacerlo más real**. P7: hipertrofia y dilatada por defecto como «forma grave» con
nota visible. Malla de Visible Human solo como referencia. Cifra sin PDF → «hueco» (nunca inventada). Nunca cambiar
una referencia para que pase una prueba.

**Jueces por encargo**: `node --test` del archivo tocado; al cerrar, la suite de eco entera y `jueces.mjs --eco`.
Profesor solo en la parada (capturas antes / después).

---

# Parada 3 (sesión del 27/10/2026) · retoques de coste medio + N1, F3, F4, P5, P6

Aprobado por el usuario el 27/10 («Seguimos con este orden, adelante») sobre la propuesta del director: ~9-10 M, todo
constructor en sonnet, un encargo por pieza. Rama nueva `auto/eco-mega` desde `main` (la PR #30 ya está fusionada).

**Fuentes en `docs/`**: Klein 2013 (pericardio), Zoghbi 2017 (insuficiencias), Mukherjee 2025 (corazón derecho e HP),
Lang 2015, Mitchell 2019, Hahn 2013, Mor-Avi 2011. **Siguen hueco**: ESC/ERS 2022, amiloidosis, MAPSE, Leung y Levine
1994 (no se rellenan con conocimiento general).

**Orden y encargos** (cada uno con su informe ≤40 líneas en esta carpeta, `p3-<pieza>.md`):
0. Lector (sonnet) → `fuente-p3.md`: Klein (grosor y forma del pericardio, cronología del colapso, «>1/3 del ciclo»),
   Zoghbi (IM funcional: tenting, anillo, EROA, AI), Mukherjee (pared del VD, índice de excentricidad, AI/AD).
1. R1 · saco del derrame grande que sigue al corazón, sin esquinas (SC4C) ni V (A4C) (`corazon-geo.mjs`, saco).
2. R2 · el colapso de AD y VD dobla la pared hacia dentro antes de borrar la cámara (`plieguePared`).
3. R3 · la tricúspide abre en F; el VI del TEP sin facetas (más vértices en la sección).
4. N1 resto · fosa oval fina, seno coronario y válvula de Eustaquio (Mitchell pp. 25-26, 31).
5. F3 · bomba auricular (Lang p. 20) · 6. F4 · tabique en telesístole del TEP (Ryan 1985 del atlas 14, Mukherjee).
7. P5 · AI dilatada medible (Lang pp. 25, 28) e IM funcional (Zoghbi) · 8. P6 · VD grueso de la HP crónica (Lang
   Tabla 8 p. 20, Mukherjee); amiloidosis, hueco.
9. Jueces `--eco` + auditor (sonnet) + profesor (juicio rápido) sobre lo nuevo; meta 8 (8,75 en lo que sea modelo).

**«Hecho» de cada pieza**: su prueba par en `js/modules/eco/pruebas/` en verde, la suite entera en verde, captura de la
vista frente a la eco real (D1) cuando toque forma, paciente posible en los extremos, 390 y 360 px sin desborde.
