# 2026-10-30 · compara-formulas

**Resultado:** en revisión (PR: https://github.com/alvariitoSW/fiebres-neutropenias/pull/38)
**Vueltas:** 1 · **Jueces:** pruebas ✓ (modelos catéter y capilar, quiz, caché, ids) · móvil ✓ en lo nuevo · ficha del Libro Azul ✗ por 4 fallos que ya estaban en `main`

## Qué se hizo
Cuatro notas «⚖️ Compara» con su botón, en las dos direcciones:
- Catéter vivo (R = 8µL/πr⁴, `mar-poiseuille`) ↔ calculadora de resistencias del Libro Azul (RVS = (PAM − PAD)/GC, cap. 1).
- Capilar vivo (DO₂ = GC × CaO₂, `mar-do2`) ↔ calculadora de Fick del Libro Azul (VO₂ = GC × (CaO₂ − CvO₂), Tabla 3), con el aviso
  de que el disuelto se multiplica por 0,003 en Marino y por 0,0031 en el Libro Azul (cada libro con su cifra).
Ids nuevos `cardio-fick-titulo` y `cardio-rv-titulo` para `data-resaltar`. Versión 20261030-2. No hay cifras nuevas.
Revisión del encargo: la hice yo con la lista (§0.8), sin agente: las dos fórmulas tienen fuente en las dos fichas.

## Qué no se pudo hacer o leer
Nada. Glomérulo: no se tocó (🟡) y no hacía falta un enlace con fórmula equivalente; Laplace fuera (encargo).

## Para el usuario
Mirar en el móvil los 4 botones (PR, «Dónde tocar»). Nada que decidir.

## Visto de paso (no tocado)
- `--ficha fisioUci:cardiologia:panel-cardio-tabs:cardio-fisiologia-aplicada` falla igual en `main`: rótulos de 5-6 px en la animación
  de Wiggers (`cardio-wiggers-anim`) y un desborde de 30 px a 360 px. Propuesta: tarea `arreglo` barata.

## Propuestas sobre las reglas
- Los modelos vivos convierten sus `.ctv-org`/`.cpv-org` en botones `data-especialidad`: en una prueba, `#bloque button` pulsa el de la
  cita y no el tuyo. Usar `> button.especialidad-link`. (Me costó una vuelta de depuración.)

## Gasto
Director (opus) 0,68 M; sin agentes. Presupuesto 0,8 M → −15 %. Se ahorró al no lanzar constructor ni auditor (sin cifras nuevas).

## Cuentas
Presupuesto 0,8 M · recortes: sin constructor ni jueces-agente · gastado 0,68 M · desvío −15 % (a favor) · bloque: B-042, ≈0,8-1,2 M previsto para esta tarea.

## Vueltas
| Vuelta | Qué | Resultado |
|---|---|---|
| 1 | 4 notas + jueces + prueba a mano | ✓ (los 4 ❌ son previos) |
