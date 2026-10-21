# Bloque 3 · Marino caps. 14-22 (Shock, corazón y embolia de pulmón) · paquete

Objetivo M5 del tablero. Empieza el 21/10/2026, con los bloques 1 y 2 en main. Antes de nada, lee
`autonomo/bloques/b1/lecciones.md` y la «Parada 1» de `autonomo/bloques/b2/encargo.md` (las reglas del usuario del 20/10).

## 1. Fichas (26)

| Cap. | Fichas (`id`) | Dónde viven · clave `--ficha` |
|---|---|---|
| 14 Shock | `mc-definiciones`, `mc-vasopresores` | Merino Cardiología (`js/modules/cardiologia/merino-cardiologia.html`) · `cardiologia:merinoCardiologia:panel-merino-cardio-tabs:<id>` |
| 15 Hemorrágico | `mc-hemorragico-clasificacion`, `mc-hemorragico-fluidos`, `mc-damage-control` | ídem |
| 16 Cardiogénico | `mc-cardiogenico-fisio`, `mc-cardiogenico-farmaco`, `mc-soporte-mecanico` | ídem |
| 17 Inflamatorio | `mc-inflamacion-ros`, `mc-shock-septico`, `mc-shock-toxico`, `mc-anafilaxia` | ídem |
| 18 IC aguda | `mc-ic-tipos`, `mc-ic-manejo` | ídem |
| 19 Taquiarritmias | `mc-taqui-reconocimiento`, `mc-fa-frecuencia`, `mc-fa-cardioversion`, `mc-otras-taqui` | ídem |
| 20 SCA | `mc-sca-diagnostico`, `mc-sca-tratamiento`, `mc-diseccion-aortica` | ídem |
| 21 Parada | `mc-paro-soporte`, `mc-paro-monitorizacion`, `mc-posresucitacion` | ídem |
| 22 TEP | `neumo-ep-diagnostico`, `neumo-ep-manejo` | Merino Neumología (`js/modules/neumologia/merino-neumologia.html`) · `neumologia:merinoNeumologia:panel-merino-neumo-tabs:<id>` |

## 2. Fuentes (`docs/`)

- `marino-2024-shock-caps14-17.pdf`, `marino-2024-cardiac-disorders-caps18-21.pdf`,
  `marino-2024-respiratory-management-caps22-26.pdf` (cap. 22). Cada ficha cita su página con `#page=N`: compruébala.
- Otras fuentes de la app sobre lo mismo (Guía ESC 2026 de IC, Hernández 2026 shock séptico, El Libro Azul): solo
  enlace cruzado, nunca se mezclan (CLAUDE §2).

## 3. Modelos y piezas que ya existen

- **Circulación viva y eco** (`js/modules/eco/`, `data-eco-escenario/panel`): corazón, motor del latido, presiones,
  asa P-V, barorreflejo, Doppler; escenarios de enfermedad. Lee `js/modules/eco/CLAUDE.md`.
- **Receptores animados** (`js/modules/cardiologia/receptores-animados.js`): vasopresores e inotrópicos.
- **Capilar vivo** (sepsis, DO₂/VO₂, lactato), **río y mar** (fluidos), **vaso que sangra** (hemorragia, coagulopatía,
  plasma y crio), **telar** (cascada).
- **Piezas comunes** (`js/core/`): `mayeutica-motor.js`, `mayeutica.js` (Estudiar), `citas.js` («Ver en la ficha»),
  `explicacion-guiada.js`, `bolsa.js`, `tubo.js`, `particulas.js` + `js/data/formas-iones.js`.
- Mapa visual de Marino: `autonomo/ideas/marino.md` (B4 shock, B5 retorno venoso y monitorización, B6 el corazón enfermo).

## 4. Decisiones del usuario que aplican

- 19-20/10: modelo vivo por ficha, Mayéutica socrática + examen MIR, «Para profundizar», Texto | Estudiar.
- 20/10: cada cita lleva al párrafo de la app (REGLAS §7.9); Explorar con explicación guiada (§7.10); modelos por
  concepto y reutilizables (§7.11); solo 4-5 paradas por bloque (§2.3).

### 21/10/2026: peticiones del usuario para el bloque 3

- **Monitor de cabecera en el shock**: «deberías poner un monitor de PA, sat, ECG, respiración e incluso meter la PVC y
  poder identificar el shock con un monitor». → La cabecera del shock es un monitor de UCI con sus curvas (ECG, PA
  invasiva, pletismografía y SpO₂, respiración, PVC) y un modo «¿Qué shock es?». Pasado a la maqueta `b3-shock.html`.
- **Modelo vivo de los fármacos del shock**: «un modelo vivo con los fármacos y sus receptores que expliquen tanto su
  mecanismo de acción fácil y completamente como ver a qué receptor van y la función de cada fármaco, además de sus
  dosis y sus efectos secundarios. Esta idea dásela al profesor». → Profesor en modo diseñar (sale en
  `autonomo/bloques/b3/farmacos.md`); parte de los receptores animados que ya existen.

### Parada 1 del bloque 3 (21/10/2026): lo que dijo el usuario de las maquetas

- **Cabecera del shock**: «creo que es mejorable. Está bien como base pero hay que mejorar muchos aspectos, por ejemplo
  al darle al Impella no aparece nada; habría incluso que explicar cómo funciona un Impella con el siguiente
  repositorio de GitHub https://github.com/wheresryan22/anatomy». → El repositorio es «Anatomy» (MIT): un método y un
  kit para figuras isométricas que explican un mecanismo construyendo el objeto real, pieza a pieza («el objeto es la
  explicación»). Clon de consulta en `/tmp/ajeno/anatomy` (si no está: `git clone --depth 1` en esa carpeta); leer
  `SKILL.md`, `references/craft.md`, `kit.md`, `motion.md`, `verify.md` y los ejemplos (`examples/test-rig`,
  `raptor-engine`). Los dispositivos de soporte (Impella, balón, ECMO) se explican así, como objetos reales.
- **Corazón eléctrico y receptor vivo**: «hay que pensarlos también, como te dije ayer, como si fueran unos mega
  proyectos, que después de completar el Marino y tener la base hecha, habrá que completarlos con el resto de contenido
  de la app (Manual UMI, Libro Azul, PIF, etc.); como base está genial pero hay que subir el nivel». → REGLAS §7.12.
- Estilos sin elegir: el director toma A en los dos (receptor: grabado crema y oro; corazón eléctrico: grabado
  anatómico), coherentes con el resto de la app, y lo dirá en la parada siguiente.

## 5. Pasos

| Paso | Quién | Sale en | Estado |
|---|---|---|---|
| 1 · Cobertura | profesor (modo cobertura) | `autonomo/bloques/b3/cobertura.md` | en curso |
| 2 · Maquetas (parada 1) | constructor potente | `autonomo/maquetas/b3-*.html` | pendiente |
| 3 · Modelos en la app (parada 2: el primero nuevo) | constructor potente | rama `auto/b3` | pendiente |
| 4 · Estudio en las 26 fichas | constructor, por grupos | rama `auto/b3` | pendiente |
| 5 · Jueces, auditor y profesor (parada 3) | — | `autonomo/bloques/b3/*.md`, una sola PR | pendiente |

## 6. Pacientes del bloque

Los fija la cobertura. No repetir: Andrés (62), la Sra. R. (64), Fermín (71), Rocío (67), Gonzalo (66), Inés (41),
Salvador (47).
