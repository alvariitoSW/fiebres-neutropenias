# Circulación viva (laboratorio)

Corazón 3D movido en cada instante por un motor del latido. **Está en laboratorio:** la app no carga
nada de esta carpeta (no hay ningún `data-include` ni `import` hacia aquí). Su destino es la vista Visual
de Fisiopatología UCI · Cardiología, empezando por la ficha del ciclo cardíaco.

## Abrir

```
cd lab/circulacion && python3 -m http.server 8000
```

- `corazon-3d.html` — el corazón: sangre en movimiento, barra del ciclo A-G, cortes y pruebas de shock.
- `latido.html` — curvas de Wiggers, asas presión-volumen y la tabla de cifras frente a su referencia.

## Pruebas (un solo comando, desde la raíz del repo)

```
node --test 'lab/circulacion/pruebas/*.test.mjs'
```

Tarda ~35 s. Si Playwright no está instalado, las pruebas de navegador se omiten y el resto se ejecuta.

- `motor.test.mjs` — cada cifra del latido normal frente a su referencia (`referencias.mjs`), el volumen
  de sangre se conserva, las 7 fases salen en orden, nunca hay dos válvulas del mismo lado abiertas, las
  fases isovolumétricas no cambian el volumen, la incisura, el barorreflejo (quieto en reposo, compensa
  una hemorragia) y que **cada escenario reproduce el patrón de su tipo de shock en la fuente**.
- `geometria.test.mjs` — los orificios valvulares caben en la base en todo el rango de volúmenes, ninguna
  pieza tiene coordenadas no finitas ni con volúmenes absurdos, y la sangre de cada cavidad sigue a su
  volumen.
- `navegador.test.mjs` — el corazón se dibuja, la barra del ciclo lleva a cada fase, el dedo desplaza la
  página en vertical y gira en horizontal, un escenario cambia la circulación, sin WebGL se ve la imagen
  fija, y la página del latido no deja ninguna cifra fuera de rango sin marcar.

Las cifras marcadas `pendiente` en `referencias.mjs` salen como *todo*: no fallan, pero si un día pasan a
cumplirse, una prueba avisa para quitar la marca.

## Archivos

| Archivo | Qué es |
|---|---|
| `motor.mjs` | Motor del latido en el tiempo (sin DOM): 4 cámaras, válvulas por gradiente, aórtica con inercia, pericardio, tabique, lechos sistémico y pulmonar, barorreflejo |
| `escenarios.mjs` | Escenarios de shock (los usa la página y los comprueban las pruebas) y el patrón de cada tipo según la fuente |
| `referencias.mjs` | Cifras del latido normal con su referencia y su origen (ficha de la app o fisiología general) |
| `corazon-geo.mjs` | Geometría procedural del corazón a partir de los volúmenes del motor, y el interior para la sangre |
| `flujo-sangre.mjs` | Partículas de sangre: cuántas cruzan cada válvula sale del flujo del motor |
| `render-webgl.mjs`, `mat.mjs`, `earcut.mjs` | Renderizador WebGL propio, matrices y cámara, triangulación |
| `img/corazon-estatico.jpg` | Imagen fija para navegadores sin WebGL |

## Reglas

- **Toda cifra visible tiene origen**: `ficha` (se cita la ficha de la app y su PDF en `docs/`), `fisiología
  general` o ilustrativa. Una referencia nueva se añade en `referencias.mjs`, nunca escrita a mano en una página.
- **Un escenario nuevo** va en `escenarios.mjs` con su `tipo`; las pruebas comprueban solas su patrón.
- **Solo WebGL.** Sin WebGL, imagen fija con aviso. (Canvas 2D se quitó: duplicaba cada novedad.)
- **Anatomía congelada.** No se añaden piezas anatómicas salvo que sirvan a una ficha concreta.
- Tras cualquier cambio: `node --test 'lab/circulacion/pruebas/*.test.mjs'` en verde antes de subir.

## Rendimiento medido

En un móvil Android real (octubre 2026, pantalla de 90 Hz, calidad alta, sangre activada): **57-90 fps**.
90 es el tope de esa pantalla; las bajadas coinciden con el desplazamiento de la página y, probablemente,
con el recolector de memoria (la geometría crea arrays nuevos en cada fotograma). Es fluido. Para la
integración: limitar a 60 fps (ahorra batería sin que se note), animar solo cuando se ve en pantalla y,
si hiciera falta, reutilizar los arrays de la geometría.

## Pendiente

- **Calibrar** la RVS (el motor da ~1.450; la Ficha 5 dice 900-1200) y la contracción isovolumétrica
  (~99 ms; fisiología general 50-90).
- **Erratas de la fuente sin nota en la app:** las dos tablas de patrones de shock de El Libro Azul
  (cap. 5, pág. 70 del PDF de la parte 1; cap. 10, Figura 2, pág. 33 de la parte 2) dan RVS «↑» o «N/↑»
  en el shock distributivo, y la del cap. 10 da ScvO₂ «↑» en el hipovolémico. Las fichas 5 y 10 las
  reproducen tal cual. Las pruebas usan la Tabla 14.1 de Merino (cap. 14), que no tiene ese problema.
- Integración en la app (una sola ficha, animando solo cuando se ve), escenarios enlazados a las fichas,
  y Wiggers y asa P-V sincronizados con el corazón.
