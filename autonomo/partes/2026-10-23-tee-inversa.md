# 2026-10-23 · tee-inversa (fase 1)

**Resultado:** parada del usuario (fase 1 hecha: informe-propuesta, https://claude.ai/artifact/6N5ChQF3E82Ca7DoNqEfaU)
**Vueltas:** 0 (no se construye nada) · **Jueces:** no aplican (sin cambios en la app)

## Qué se hizo
- La web `tee-simulator.anesthbeta.com` ya responde desde el entorno (el 403 del apunte de la bitácora ya no está).
  Se leyeron su portada, `en.html`, `references.html`, `assets/STUDY_SOURCES.md` y, en línea (sin guardarlos), sus
  módulos `app.js`, `probe-path.js`, `views.js`, `anatomy.js`, `valves.js` y `section-labels.js`, solo para entender
  el método. Una captura a 390 px (la portada en ME 4 cámaras).
- Cómo está hecho: Three.js (MIT); corazón del Human Reference Atlas y Visible Human Female (CC BY 4.0); esófago como
  curva por 7 puntos a mano con posición 0-1 por tramos (EA/ME/EI/TG/TG profundo); sonda con 5 mandos (avance, giro,
  ante/retroflexión −75…+80°, flexión lateral, multiplano como giro electrónico) y flexión automática en el estómago;
  35 vistas como posturas (28 ASE/SCA 2013 + 7 vasculares) con viaje de ~6 s entre ellas; imagen = corte de la malla
  rellenado (colores o gris con ruido fijo, sector de 84°, sin acústica); latido ilustrativo por vértice; válvulas en
  A1-A3/P1-P3 y cúspides, con «qué valvas corta el plano»; rótulos con prioridad y sin solape; tocar la imagen marca el
  3D. Avisan de que no hay revisión de especialista.
- Comparado con nuestra Eco cardíaca (README del módulo): nosotros ganamos en ecografía, fisiología, Doppler, modo M y
  enfermedad; ellos, en ETE, paso animado entre vistas, segmentos valvulares, rótulos y colores de estructura.
- Informe-propuesta para el móvil con 7 mejoras (esfuerzo y orden) y 3 paquetes.

## Qué no se pudo hacer o leer
- El clasificador de permisos del entorno **no dejó** guardar sus scripts en el disco ni volver a abrir su web en el
  navegador (solo la primera carga). El análisis sale de la lectura en línea de los módulos, sin capturas de cada
  vista ni de los mandos.
- `ATTRIBUTION.md` da 404; su contenido se conoce por `STUDY_SOURCES.md`.
- El «informe de ATRIA-EchoTrace (tarea #94)» que cita el encargo **no está en el repositorio** (ni en
  `docs/historial/eco.md`): la comparación es solo con nuestro simulador.
- No se usaron agentes: la lectura de una web no la pueden hacer (sin acceso de red en sus herramientas) y el informe
  no tiene contenido clínico que auditar. La skill `reverse-engineer-anything` y su servidor no estaban en la sesión.

## Para el usuario
- Elegir paquete A (colores de estructura, rótulos con enlace al 3D, viaje entre vistas; en la ETT, sin fuentes nuevas),
  B (ETE medioesofágico y transgástrico con reto) y/o C (segmentos de la mitral y cúspides aórticas), o números sueltos.
- Para B y la mejora 7: el PDF de la guía ASE/SCA 2013 de ETE completa (Hahn y cols., J Am Soc Echocardiogr 2013).
- Para B: si se añade el recorrido del esófago a la anatomía (excepción a «anatomía congelada»). Para C: si se parten
  las valvas (también anatomía congelada).
- Si existe el informe de ATRIA-EchoTrace, mandarlo.

## Visto de paso (no tocado)
- El apunte «🔴 Acceso de red para el simulador TEE» de la bitácora ya se puede cerrar: el dominio responde.

## Propuestas sobre las reglas
- Ninguna.
