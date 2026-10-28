# s2-dilfallo (eco-calibra-a, sesión 2) · dilatada y fallo del VI · 28/10/2026
Suite eco: 503 pruebas, 478 ok, **0 fallan**, 25 todo (antes 502/476/0/26; +1 prueba nueva). Tabla: `tabla-s2-dilfallo.txt` (solo cambian dilatada y fallo).

## Antes → después
| Punto | E/A | DT | e′ sep/lat | E/e′ | S/D | PCP · PAM · FC · GC | ASE |
|---|---|---|---|---|---|---|---|
| dilatada | 1,38 → **2,35** | 220 → **132** | 5,2/6,5 → 4,9/6,2 | 13,5 → **18,6** | 0,77 → 0,49 | 28 · 81 · 84 · 3,8 → 29 · 80 · 85 · 3,75 | grado 2 → **grado 3** |
| fallo def | 0,98 | 264 | 5,2/6,5 → 3,9/4,8 | 10,0 → 13,4 | 1,42 | sin cambio | 2 |
| fallo 100 % | 0,43 (fusión) | – | 5,2/6,5 → 3,1/3,9 | 5,1 → 8,5 | 0,09 | sin cambio (FC 120, GC 2,4) | 2 |
| fallo 0 y el resto | sin cambio (FE >40 %) | | | | | | |

## Mecanismo (sin trampas)
1. **e′ con las fuerzas de restitución** (`atlas/diastolica.mjs`, `restitucion`, `ePrima(relajacion, fe)`): Nagueh 2025 p. 553: e′ depende de la
   relajación, de las fuerzas de restitución (el muelle que comprime la sístole) y de la carga. Con FE <40 % (Merino, FE reducida) e′ × FE÷0,40,
   suelo 0,6 (ilustrativo; e′ septal ~3-4 cm/s en el grado 3 avanzado, p. 561). Pasan la FE: `medirLlenado`, `curvasLlenado`, `medir-forma`.
2. **Dilatada** (`escenarios.mjs`, `RELAJACION_FER = 1,3`, `RIGIDEZ_DIL = 1,05`): ya no lleva la relajación de la hipertrofia (2,8). Con 2,8
   la cola de la activación, multiplicada por el volumen grande del VI dilatado, dejaba la PVI ~20 mmHg en todo el llenado rápido: la E no
   subía con PCP 28 y el TDE era de 220. Ahora e′ baja sobre todo por restitución; TDE corto = rigidez + relajación (Nagueh p. 547, T4).
   La bomba AI cae a 10 % (A pequeña; Nagueh p. 561: strain de bomba de la AI bajo en el grado 3 avanzado).
3. Prueba nueva (`atlas.test.mjs`): la dilatada sale grado 3 con `algoritmoAse` (E/A ≥2, TDE <140, e′ ≤6,5, PAI >15, FE ≤40 %).
   El atlas 10 sigue con sus 4 corazones propios (FE normal: no cambia). Ligarlo a la dilatada en la página: no hecho.

## Paso 1 del encargo · fuentes de los topes
Rigidez ×1,5 (sesión 1) no rompía «PCP 35/PAM 74»: rompía 5 pruebas porque el VI **encogía** (VTD 216 → 176): chorro de IM 3,6 m/s
(prueba 4-6 m/s; Zoghbi p. 329 «la gran mayoría» y Fig. 14: 4,1 m/s con PA baja/PAI alta — no es tope duro), pared 10,8 mm (>10, FATE),
volumen regurgitante 27 mL (<30, Zoghbi T8), curva de Guyton y pvp 40,8 con bolos. Con 1,3/1,05 el VI queda en 211 mL y pasan todas:
**no recalibré ninguna prueba** ni toqué `referencias.mjs` ni `LIMITES`. Guyton regenerada (`curvas-guyton.mjs`).

## PENDIENTES
Quitada: `J1:dilatada`. Quedan `J1:fallo:def` y `J1:fallo:1` (comentario de causa actualizado).
- **fallo def**: E/e′ 13,4 (≥14) y S/D 1,42 (<1). Lo arregla rigidez ×1,3 creciendo con la gravedad + relajación 1,8 (E/e′ 14,2, S/D 0,84,
  E/A 1,65, TDE 128, PCP 28, PAM 78) pero rompe 9 pruebas: IC 1,0-1,12 a fondo (<1,2), PAM 46 al 100 %, pulmonar 36/32, Impella, balón,
  y en paciente-posible del fallo VTSi VD 45,6, TAPSE 15,7, eyección 241 ms. Sin rigidez, S/D <1 pide relajación baja y E/e′ ≥14 la pide alta.
- **fallo 100 %**: la E se funde con la A (a FC 120 la sístole del modelo, PR 0,16 + 0,34 s, ocupa casi todo el ciclo). PR 0,12 no basta (E 35-40).
  Cifra mala del motor, no tapada: necesita un cambio global de tiempos (PR o sístole con la FC) que toca a las piezas 4-5.
Archivos: `atlas/diastolica.mjs`, `escenarios.mjs`, `guyton-tablas.mjs`, `README.md`, `pruebas/{medir-forma,paciente-doppler.test,atlas.test}.mjs`;
herramientas `herramientas/calibra-a/{dilfallo,onda}.mjs`.

**No comprobado / riesgo**: la relajación de la dilatada (1,3) es casi normal; la clínica describe τ alargada en la miocardiopatía dilatada
(la τ del modelo no es la clínica; e′ baja por restitución). Proporción y suelo de la restitución, ilustrativos. Sin navegador ni `jueces.mjs --eco`.
