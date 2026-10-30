# rea-cierre (B-046) · Tres webs «abiertas en la red» (30/10/2026)

**Resultado: las tres NO se pudieron leer desde esta sesión.** WebFetch devolvió `getaddrinfo ENOTFOUND` para
cardiorender.com, litfl.com e intro2echo.com: los tres dominios están fuera de los permitidos de la sesión en la nube
(no es un control anti-robot; no se intentó saltar nada). Para leerlos hay que permitir esos dominios en la red de la sesión
(o que el usuario los abra en su móvil/PC). No se ha inventado nada de su contenido.

## 1. cardiorender.com — no se pudo leer (30/10)
- Lo único que consta es lo de `autonomo/radar/ENTRADAS.md` (ficha «Lazo presión-volumen #1»): lo recomienda un tercero
  en las respuestas de un tuit; «simulador de hemodinámica»; licencia «no consta». Mandos, modelo y autor: sin verificar.
- Ya hay en la app: lazos P-V en Fisiopatología UCI (Cardiología), Circulación viva (eco, `js/modules/eco/`: motor,
  `latido.html`, `guyton-tablas.mjs`) y Merino Neumología; en el tablero `wiggers-movil` toca los rótulos del Wiggers.
- Destino propuesto: **aparcado hasta que se permita el dominio** (o el usuario pase capturas). Si se lee y aporta, la
  idea (precarga/poscarga/contractilidad moviendo el lazo) iría a la tarea **`mv-eco`** (mejora de lo existente, no módulo nuevo).

## 2. litfl.com / st-elevation-in-avr — no se pudo leer (30/10)
- Licencia: **sin comprobar en la propia web** (se cree CC BY-NC-SA, pero no se ha verificado; anotarlo como «no consta»).
- Uso previsto ya fijado en `autonomo/ideas/ingenieria-inversa/culprit.md`: solo enlace cruzado / «qué buscar»; no es
  fuente de cifras (el aVR de tronco sale de Tamura 2014 en `docs/`, y Wagner 2009, ESC 2023).
- Destino propuesto: **tarea `arteria-culpable`** (bibliografía de ECG de `culprit-a`, como enlace `.biblio-link`
  con `.biblio-nota`), condicionado a que el enlace se verifique abierto. Si no se verifica la licencia, solo enlace, sin copiar texto ni imágenes.

## 3. intro2echo.com — no se pudo leer (30/10)
- Es la web de echodemo (D. Ouyang), ya traducida con permiso (atlas de eco: `js/modules/eco/atlas-ouyang.js`, `atlas/`).
  No se pudo comparar secciones/vídeos/interactivos de la web con el repo github.com/douyang/echodemo.
- Destino propuesto: **tarea `eco-sueltas`** (solo para comprobar que la atribución al autor está bien citada y si la
  web trae algo que el repo no tiene); sin trabajo de construcción hasta leerla.

## No comprobado / riesgo
- Todo lo de las tres webs: contenido, mandos, licencias, autoría, scripts. Nada leído.
- No se consultó el repo douyang/echodemo (no era el encargo del dominio cerrado y el presupuesto era corto).
- Riesgo: marcar como «estudiadas» estas tres en «Todo lo estudiado» sería falso; deben constar «no se pudo leer (30/10): dominio no permitido en la sesión».
- Los destinos son propuestas condicionadas a poder leerlas; las claves (`mv-eco`, `arteria-culpable`, `eco-sueltas`) existen en el tablero.
