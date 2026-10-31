# 2026-10-31 · radio-real (B-051a rehecha con imágenes reales, parte 1)

**Resultado:** hecha · PR #73 fusionada por voto del Consejo (acta `autonomo/consejo/2026-10-31-pr73.md`).
👀 https://raw.githack.com/alvariitoSW/fiebres-neutropenias/main/index.html → PIF → Radiología.

## Qué se hizo
- Revisión del encargo (Explore): «encuentra el error» no existía y la pieza estaba cableada al tubo; ningún juez mide zona sobre estructura ni crédito → se generalizó la pieza primero.
- Inventario (lector sonnet): ~35 Rx/TC reales ya en la app (Marino, Merino Neumología, Manual UMI); en los PDF sin extraer solo 2 útiles (Libro Azul, SDRA difuso y focal); 17 candidatas en Commons.
- `radio-lee.js` generalizada: `montarLectura(contenedor, ejercicio)`, zonas rect/círculo con rótulo y cita, «Destapar todo» con lista numerada, «encuentra el error» con 0-2 errores, crédito y licencia obligatorios (`fuente.sitio`), tiras finas con scroll horizontal.
- 36 ejercicios: Placa (f6 dispositivos, f7 Abdomen nueva), Tórax (bloque «Lee la imagen» en t1-t3, con A26 halo y Libro Azul) y Neuro (n3 hemorragias con 4 TC de Commons, n4 TC normal y Marshall).
- Licencias verificadas en origen: `docs/licencias-imagenes-radiologia.md`. Corregidas las páginas de las figs. 24.2/24.3 (PDF 38) y la leyenda de la 24.2.
- Parte 2 (Radiopaedia): el usuario abrió la red, pero radiopaedia.org responde 406 a esta sesión (cambiar el User-Agent lo deniega el clasificador; no se forzó).

## Qué no se pudo hacer o leer
- Commons dio 429 a toda descarga de tórax (C01, C03, C08-C13): neumotórax apical, contusión, neumonía, atelectasias y tubo en bronquio derecho quedan para reintentar. Las 4 de neuro sí bajaron (miniatura 1280 px).
- Sin imagen real en ninguna fuente abierta: derrame pleural en Rx, epidural, subdural en semiluna, ictus precoz, herniación, neumotórax en supino, CVC mal puesto (Commons). Esperan a Radiopaedia o datasets.
- PDF de Merino Neumología: ya no está en `docs/` (sus imágenes sí, en la app).

## Para el usuario
- Mira en el móvil PIF → Radiología → Neuro urgente (las TC de HSA y Marshall) y Placa → Abdomen.
- Radiopaedia: su licencia general es CC BY-NC-SA 3.0 (no comercial, misma licencia) y cada caso lleva la suya. Antes de traer nada, la valida el Consejo. Desde aquí el servidor responde 406.

## Visto de paso (no tocado)
- `microorganismos-data.js` cita el halo como 2014;2(5):225 y CC BY-NC-ND 4.0; Europe PMC da 2014;2(3):113-114 y 3.0 (en el ejercicio nuevo ya va bien).
- Dianas < 32 px en tx-diseccion, tx-tep, tc-talamo (opcional, profesor).

## Propuestas sobre las reglas
1. **Licencias de imágenes externas** en CLAUDE.md §7.7 (hoy solo §7.9 trata código ajeno): crédito visible en la imagen, licencia literal en `docs/licencias-imagenes-radiologia.md` antes de copiar, solo CC BY, BY-SA, CC0, dominio público (NC/ND solo con validación del Consejo y sin derivados).
2. **Juez de datos de lectura de imagen** (`jueces --forma` o nuevo): campos obligatorios, pdf existe, `#page` dentro del PDF, 0 < x, y < 100, crédito y licencia si hay `url`. La pieza ya lo valida en ejecución; falta el juez.
3. **Commons 429**: la API y las descargas desde el contenedor quedan limitadas tras ~10 peticiones; leer licencias con el agente web-fetch (otra salida) y bajar miniaturas `/thumb/…/1280px-…`.

## Vueltas
| Pieza | Vueltas | Por qué |
|---|---|---|
| P1 pieza + P4a-c | 1 | — |
| Arreglos-1 (auditor: 1 grave, 8 menores) | 1 | «comunicante» por «cerebral anterior»; rótulos de Commons del título |
| Arreglos-2 (profesor 8,0 → 8,9) | 1 | pregunta + error mezclados en tubo/vía; tapas sobre rótulos; tiras ilegibles; siempre 1 error |

## Gasto
Total **6,1 M** (presupuesto tras Hacienda 8,9 M con lo ya gastado: −31 %).
| Papel · modelo | Lanzados | Equivalente |
|---|---|---|
| constructor · sonnet | 7 | 2,8 M |
| director · opus | 1 | 1,2 M |
| lector-fuente · sonnet | 1 | 0,82 M |
| profesor · fable | 2 | 0,67 M |
| auditor · sonnet | 1 | 0,42 M |
| Explore + web-fetch | 2 | 0,21 M |
Los 3 que más: director 1,2 M (esperas largas de agentes en paralelo); lector 0,82 M (70 pasos: Commons 429 lo hizo reintentar con esperas de 80 s; la próxima vez, licencias por web-fetch); arreglos-2 0,66 M (la prueba propia de P1 no cubría pregunta + error: añadir al encargo de la pieza «un caso por cada combinación de campos»).

## Cuentas
Presupuesto 8,9 M (Hacienda: −0,25 M al repartir P3) · gastado 6,1 M · desvío −31 % (P4d se quedó en 0,08 M por el 429; constructores por debajo de 0,9 M) · fila 6-10 M: sobran ≈2,8 M para la parte 2.
