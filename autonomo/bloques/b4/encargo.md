# Paquete del bloque 4 · Marino caps. 31-38 (ácido-base, riñón, agua, iones)

Escrito por el director el 30/10/2026 (sesión `b4 · piezas iones vivos`). Lee esto y, de la cobertura, solo lo que te
nombre tu encargo: `cobertura.md` (una pantalla) y `cobertura-anexo.md` (§ que te digan).

## 1. Fichas del bloque
23 fichas `mr-*` en `js/modules/libros/marino-renal.html` (líneas 349-2294; ya tienen ids). `--ficha
libros:marinoRenal:panel-marino-renal-tabs:<id>`. Tabla, grupos y estados: `cobertura.md` §0. Grupos de Estudiar: 4A
gasometría (1-6) · 4B riñón que falla (7-11) · 4C agua y sodio (12-15) · 4D iones de la célula (16-23).

## 2. Fuentes (página = página del PDF; el anexo las cita así)
- **A** = `docs/marino-2024-acido-base-renal-caps31-34.pdf` (cap. 31 p. 2-15, 32 p. 16-31, 33 p. 32-43, 34 p. 44-60).
- **E** = `docs/marino-2024-electrolitos-caps35-38.pdf` (cap. 35 p. 1-17, 36 p. 18-30, 37 p. 31-41, 38 p. 42-54).
- Lo que el libro no dice se busca en otra fuente y se cita (REGLAS §1.15); si no, hueco anotado.

## 3. Modelos vivos
Existen y se amplían (estados en `cobertura.md` §0): ácido-base vivo, río y mar (`agua-viva`), nefrona, glomérulo,
filtro vivo, ritmo vivo (`js/modules/libros/ritmo-vivo/`, datos `js/data/ritmo-vivo-data.js`), escena del potasio
(`js/modules/nefrologia/potasio-escena.js` + `hiperpotasemia-sim.js`).
**Nuevo: «iones vivos»** (anexo §2): la escena del potasio que crece con Mg²⁺, Ca²⁺ y fosfato. Un modelo, no uno por ion.

## 4. Decisiones del usuario y del Consejo
- 30/10 (actas `consejo/2026-10-30-13.md` y `-14.md`): plan de 2 semanas; **las maquetas las elige Educación**
  (Consejo), 2-3 por modelo, con tres preguntas: ¿se ve el mecanismo?, ¿se entiende a 390 px?, ¿admite apuesta, error y
  caso? Empate → la que reutiliza motores. Todo al parte y una página al usuario después («vale» o «cámbialo»).
- PR por voto del Consejo (REGLAS §4.15). Meta del profesor: 9,5 en maquetas (8,75 obliga).
- Decisiones del anexo §11 tomadas por el director con el criterio de la cobertura (recomendado): (1) se hacen
  **maquetas** (3 opciones), no el atajo, porque lo pide el Consejo; (2) **un solo ECG**: el del ritmo vivo; (3) orden
  de Estudiar 4A → 4C → 4B → 4D; (4) glomérulo: `congestion` y `pia` como estados, sin maqueta.
- `auto/b3d` (pulmón) trabaja a la vez: **no se toca nada del pulmón ni de `js/modules/libros/ritmo-vivo/`**; el
  ritmo vivo se **importa**, no se edita.

## 5. Reglas que más fallan
Lista de comprobación de `.claude/agents/constructor.md`. Y: rótulos ≥8 px en pantalla (≈9,3 en el SVG a 360 px);
frase viva a la vista (`js/core/frase-vista.js`); topes con origen y consecuencia visible (§1.14); cada cifra con su
página; ningún nombre interno a la vista; archivos ≤700 líneas.

## 6. Pasos
| Paso | Estado | Salida |
|---|---|---|
| Cobertura | ✅ 30/10 (PR #41) | `cobertura.md`, `cobertura-anexo.md` |
| Maquetas iones vivos (A, B, C) | en curso | `autonomo/maquetas/b4-iones-{a,b,c}.html` + carpeta |
| Juicio y elección (Educación) | ✅ B (30/10) | `juicio-iones-{a,b,c}.md`, `consejo/2026-10-30-b4-iones.md` |
| Vuelta 2 de la B | ✅ hecha; auditor y rejuicio en curso | `b4-iones-b/`, `auditoria-iones-b.md`, `rejuicio-iones-b.md` |
| Tres miradas (el usuario: «que intervenga educación») | dictamen ✅ | `educacion-tres-maquetas.md`: un modelo, un motor, miradas B (Mira), A (capa célula, Juega), C (a pie de cama, Caso); +≈3,8 M |
| Iones vivos a la app: modelo + prueba | ✅ 30/10 (9,5; parte `2026-10-30-b4-iones-app.md`) | `js/modules/libros/iones-vivos/`, `autonomo/pruebas/iones-vivos.mjs` |
| Iones vivos: Mayéutica, mirada C «A pie de cama», capa A «La célula por dentro» | — | sesiones aparte |
| Ampliaciones (5 modelos) y Estudiar 4A-4D | — | sesiones aparte |

## 7. Piezas comunes
Anexo §6: **ECG único** (el del ritmo vivo), **célula + plasma + riñón de iones** (la escena del potasio ampliada),
**monitor y `js/core/tope.js`**, **PaCO₂ del pulmón** (solo lectura, cuando `b3d` esté en `main`), **un solo motor de
Mayéutica**.

## 8. Pacientes del bloque (anexo §7; nadie inventa otro con el mismo nombre)
Sofía 29 (CAD) · Benito 63 (metformina) · Damián 52 (alcohólico: CAA, realimentación) · Rufino 74 (SNG + furosemida:
alcalosis, hipoK, Mg) · Matilde 69 (cardiorrenal + PIA) · Gregorio 57 (rabdomiólisis) · Casilda 81 (tiazida → salino
3 % → sobrecorrección) · Nicolás 36 (HSA → DI) · Adela 72 (hiperK con IECA + espironolactona; antes, ficticia) ·
Valentín 45 (transfusión masiva: citrato, K⁺ de la bolsa) · Encarna 59 (mieloma: hipercalcemia).

## 9. Encargo de las maquetas «iones vivos» (parada 1)

**Común a las tres** (lo que el anexo §2 pide; la cifra, con su página de **E**):
- Los cuatro iones (K⁺, Mg²⁺, Ca²⁺, fosfato) con la forma y el color de la leyenda común de la app:
  `js/data/formas-iones.js` + `js/core/particulas.js` (claves `k/mg/ca/p`; aprobada, PR #17). Identidad nunca solo por
  color: forma + rótulo.
- **ECG del ritmo vivo**, no el `onda()` de `potasio-escena.js`: importa **solo** `MOTOR` de
  `js/modules/libros/ritmo-vivo/motor.js` (`crear`, `voltaje`, `DERIV`) y `aplicarK` de `js/data/ritmo-vivo-data.js:197`,
  y traza `MOTOR.voltaje(mo, t, deriv, {})` en tu SVG (como `ecgEn` de `ritmo-vivo/pagina.js:80`, sin importarlo:
  `pagina.js` y `ayudas.js` arrastran el DOM de la página). `aplicarK` solo da el K⁺ alto (5,5-8,6). Si el ritmo vivo no da la hipoK (U, T plana, QT) ni la escalera de
  la Fig. 36.4, **no se inventa el trazo**: se pinta el que hay y un rótulo «pendiente» (el estado lo añade otra pieza).
- Mandos mínimos: Realimentar (insulina + glucosa: K⁺, fosfato y Mg²⁺ entran; E p. 20-21, 34, 49, Fig. 38.2) ·
  furosemida (K⁺ y Mg²⁺ por la orina, E p. 33) · reponer ClK (10/20/40 mEq/h, Tabla 36.1, E p. 23) · reponer MgSO₄
  (8 mEq/g; el 50 % a la orina; E p. 36-38) · calcio IV (gluconato 9 mg/mL frente a cloruro 27, E p. 27 y 45; en la
  hiperK arregla el ECG, el K⁺ no cambia) · albúmina y pH/alcalosis (Fig. 38.1 viva: Ca total frente a iónico, E p. 43-44)
  · citrato de la transfusión (quela Ca; K⁺ 2-3 mEq por unidad, E p. 24-25 y 44).
- **Fig. 36.2 viva** (E p. 19-20: el texto en la 19, la figura en la 20): K⁺ sérico frente a K⁺ total; déficit de 200-400 mEq por cada 1 mEq/L que baja.
- **Topes con origen y consecuencia visible** (sello, constantes, frase viva): ClK >20 mEq/h por cava superior →
  «asistolia» (E p. 23); Mg >13 mEq/L parada (E p. 39); Ca iónico <0,65 mmol/L hipotensión y ectopia (E p. 45);
  fosfato <1 mg/dL grave (E p. 50); calcio IV ≤200 mg en bolo, 1-2 mg/kg/h (E p. 45). Combinación imposible →
  «combinación no fisiológica».
- **Admite apuesta, error y caso**: cada maqueta trae (1) una **apuesta** antes de tocar un mando («¿qué pasa con el K⁺
  sérico si realimentas a Damián?») que el modelo resuelve; (2) un **«encuentra el error»** sobre la escena (p. ej.
  «Ca total 7,2 con albúmina 2 = hipocalcemia grave», E p. 43); (3) un **caso** corto de 3-4 pasos con uno de los
  pacientes de §8 (Damián, Rufino o Valentín), cifras de paciente posible.
- 390 × ≤600 px de escena; texto en español llano; «Ver en el texto» con su página; origen visible (`ficha`,
  `fisiología general`, `ilustrativo`). Discrepancias de la fuente (anexo §10.2: fosfato potásico 4,5 frente a 4,3
  mEq/mL; hipoMg 65 % frente a >50 %) con nota, sin elegir.
- Archivos: `autonomo/maquetas/b4-iones-<x>.html` + carpeta `autonomo/maquetas/b4-iones-<x>/` en módulos ≤700 líneas
  (molde: `autonomo/maquetas/b3-ritmo/`). Programa de prueba en `autonomo/bloques/b4/herramientas/` (cifras en texto y
  capturas a 390 y 360). **Lista de frases nuevas con página** al final de la entrega (`frases-<x>.md`).
- **Ningún juez automático mide las maquetas**: tu programa de prueba `autonomo/bloques/b4/herramientas/iones-<x>.mjs`
  (Playwright, 390 y 360) **es obligatorio** y devuelve en texto: desborde, rótulos <8 px, cifras de cada mando en su
  mínimo/medio/máximo, que cada tope dispara su sello, que la apuesta, el error y el caso se completan, y errores de
  consola. Su salida va a la entrega.

**Las tres opciones** (distintas a propósito; cada una lleva lo común):
- **A · «La célula que crece»**: el molde de `potasio-escena.js` ampliado (vaso/plasma arriba, célula abajo, salidas
  orina/heces/diálisis, cajones **hueso** y **tubo de muestra** a la derecha, ECG abajo). Mecanismo: los iones entran
  y salen de la célula y se ve.
- **B · «Lo que ves y lo que hay»**: el suero como ventanita sobre un depósito grande (célula + hueso). Un selector de
  ion; para cada uno, su «iceberg» (K⁺ 98 % dentro; Mg 1 % en plasma, 53 % hueso, Tabla 37.1; Ca 99 % hueso, Fig. 38.1
  en tres fracciones) y la **Fig. 36.2 viva** al lado. Mecanismo: el número del suero engaña.
- **C · «A pie de cama»**: el monitor (ECG del ritmo vivo, PA, FC) arriba, la gasometría con iones y las **bombas**
  (ClK, MgSO₄, calcio, insulina) con reloj; una lupa abre la célula. Mecanismo: lo que haces y cuándo se pasa de la
  raya; los topes mandan.
