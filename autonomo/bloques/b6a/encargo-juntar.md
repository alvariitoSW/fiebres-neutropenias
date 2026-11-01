# Encargo de la sesión 2 del director del b6a · juntar el Estudiar (01/11/2026)

La sesión 1 (https://claude.ai/code/session_01QiKC38b4x54X4QR7pSj9bN) dejó en `auto/b6a` (PR #79) el **cráneo vivo** y la
**placa viva** con prueba y Mayéutica (profesor 9,5 los dos; parte `autonomo/partes/2026-11-01-b6a-modelos.md`; versión
20261101-54). Las 4 ramas del Estudiar están **terminadas** (hechas antes de existir los modelos, con «dos velocidades»):
`auto/b6a-6a` ed6dec8a · `auto/b6a-6b` 679b047c · `auto/b6a-6c` fba80e9a · `auto/b6a-6d` 56692ce3, cada una con su parte
`autonomo/partes/2026-11-01-b6a-6X.md`.

## Qué hacer (director, sin construir tú; constructores sonnet de una pieza)
1. Juntar las 4 ramas en `auto/b6a` **una a una**, a la vista (`git merge origin/auto/b6a-6X` solo; `git diff --name-only
   --diff-filter=U`; `git grep -n '^<<<<<<<'` antes de commit). Conflictos esperables: `index.html` (mapa de versiones:
   rehacer con `node autonomo/version.mjs`), `jueces-forma.mjs`, `css/components.css`, `marino-neuro.html` (botones de
   los modelos de la sesión 1 dentro de las fichas). Commit y push tras cada rama.
2. **Enganchar los `modelo:`** del Estudiar a los estados reales y quitar el «Compruébalo abre la calculadora/figura» donde
   ya haya estado: `data-craneo-vivo="<paciente>[:paso]"` (abundio, segismundo, clotilde, petronila, leovigildo) y
   `data-placa-viva="<paciente>[:paso]"` (flor, sera, mel, pnc, mcc). Un constructor sonnet (≤40 pasos / 0,8 M) con la
   lista exacta de `modelo:` (sácala con grep en `js/data/mayeutica/b6a-*.js` o donde las dejaron sus partes).
3. Jueces: `--modelo craneo-vivo`, `--modelo placa-viva`, `--forma` y `--ficha libros:marinoNeuro:panel-marino-neuro-tabs:<id>`
   de las fichas tocadas (de una en una, sin agentes trabajando); después la suite entera una vez.
4. Auditor (sonnet, solo frases nuevas del enganche) y profesor (fable, juicio rápido sobre el Estudiar juntado con el
   modelo real; meta 9,5 en modelo vivo, 8,75 obliga). Arreglos con constructor sonnet nuevo (R5).
5. PR #79: texto al día (enlace «Ver en el móvil» primero), voto del Consejo (REGLAS §4.15; Explore sonnet con los
   dictámenes), acta ≤15 líneas en `autonomo/consejo/`, fusión. Tablero (fila 15) a `hecha` con el enlace al parte,
   fila en `autonomo/SESIONES.md`, `archive_session`.
Presupuesto: director 1,3 M; enganche 0,8; profesor 1,0; auditor 0,3; arreglos 0,8 → ≈4,2 M. Bloque gastado ≈24,6 M
(+ el Estudiar de las 4 sesiones, ver sus partes) de 30-45 M; si el total va a pasar de 45 M +25 %, comparece.
Nota: el límite semanal se acababa hacia las 19:00-20:00 del 01/11; commit y push tras cada pieza.
