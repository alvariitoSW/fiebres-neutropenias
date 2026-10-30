# 2026-10-30 · reglas-reforma

**Resultado:** hecha, directo a `main` (técnica)
**Vueltas:** 1 · **Jueces:** `jueces.mjs` ✓ (no cambió ninguna pieza de la app; versión sin tocar)

## Qué se hizo
Los 7 artículos de la reforma aprobados el 30/10 y los 4 ahorros de Hacienda, escritos donde se aplican:
- **Art. 2 · recursos estudiados** (ideas, no fuente; licencia antes): CLAUDE §7.9, REGLAS §1.6, skill `radar`, constructor.
- **Art. 3a · ningún dato de pacientes reales**: CLAUDE §2, REGLAS §2.1b.
- **Art. 5 · puerta única de recursos** (`autonomo/radar/ENTRADAS.md`, Bandeja con diferencia cero): REGLAS §4.15 y
  skill `radar` (paso 0 de la tanda, estado de cada entrada, etiqueta al salir de la mesa).
- **Art. 6 · jueces que solo crecen**: REGLAS §5.7 (umbrales que no bajan sin tu sí; cambio de juez en commit aparte;
  los dos jueces nuevos pedidos quedan escritos como pedidos, sin construir).
- **Art. 8 · dos velocidades** (carril de 30 s arriba): REGLAS §7.13, CLAUDE §12, constructor.
- **Art. 10 · motores compartidos**, adaptado a los dos motores de B-045 (corazón `motor.mjs` + `contrato.mjs`; los que
  leen migran de uno en uno; dibujo nuevo con interruptor): CLAUDE §5, REGLAS §2.6b, constructor.
- **Art. 12 · G7 paciente ventilado** y «estudio puro puede entrar sin G»: `autonomo/radar/NORTE.md`, skill `radar`.
- **Ahorros de Hacienda**: presupuesto de las tareas técnicas (0,2 M + 0,1 M por regla, con ruta) · medir el gasto tras
  las piezas, antes del Estudiar · Hacienda no junta piezas con prueba propia (skill `ahorro`) · director de un grupo
  1,3 M: REGLAS §4.15, skill `plan-socialista`, «Presupuestos vigentes» del tablero.
Revisión del encargo: la hizo el director sin agente (arreglo pequeño que no toca la app).

## Qué no se pudo hacer o leer
Nada.

## Para el usuario
- Nada que decidir. Los dos jueces nuevos del art. 6 (enlaces cruzados que existen y `PANEL_NAV` completo) quedan
  pedidos en las reglas; construirlos es una tarea aparte si la quieres.

## Visto de paso (no tocado)
- `contrato.mjs` aún no existe (lo hace `mv-eco-1`); la regla lo nombra «cuando exista».

## Propuestas sobre las reglas
- Ninguna.

## Vueltas
| Pieza | Vuelta | Nota mínima del profesor | Modelo | Pasos | Tokens eq. | Qué falló |
|---|---|---|---|---|---|---|
| reglas | 1 | — | director | ≈55 | ≈0,6 M | — |

## Gasto
Solo el director (sin agentes): ≈0,6 M equivalentes (`gasto.mjs`, 521 k al pasar los jueces).

## Cuentas
Presupuesto 1,3 M (0,9 artículos + 0,4 ahorros) · Hacienda no pasó (menos de 2 M) · gastado ≈0,6 M · desvío −55 %:
todo el trabajo fue escribir texto, sin agentes ni pruebas nuevas.
