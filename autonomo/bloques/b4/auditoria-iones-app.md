# Auditoría ciega · iones vivos en la app (PDF E = Marino 2024 caps. 35-38; página = página del PDF)
Resultado: 0 graves · 4 medianos · 6 menores. Cifras y dosis: todas casan con el PDF.

## 1. PAG_FICHA (`js/data/iones-vivos-data.js:61-68`), 23 entradas leídas
✅ 18, 19, 20, 21, 22, 23, 26, 27, 32, 37, 38, 39, 42, 43, 44, 45, 46, 49, 51: el párrafo dice lo que cita la página.
❌ Mediano · p. 24 → `mr-hiperk-transfusion`: la p. 24 es hiperK ficticia, acidosis (láctica sin hiperK), lisis tumoral y fármacos; la transfusión empieza en la p. 25 (que sí está bien). Apuntar la 24 a la ficha de causas de hiperK.
❌ Menor · p. 33 → `mr-mg-farmacos`: la p. 33 dice «hasta el 65 %» de hipoMg en UCI y la orina de Mg; diuréticos y fármacos son la p. 34. Falta `36` (el motor cita «p. 36-38», pagina.js:61): cae por `fichaDe` a la 34.
❌ Menor · FUENTES (data:50): «alcalosis variable (p. 21); acidosis láctica no se asocia a hiperK» cita solo la 21; lo de la acidosis láctica está en la p. 24 (NOTAS lo cita bien).

## 2. Dosis
✅ Hiperk Adela: 10 mL gluconato 10 % = 90 mg, en 3 min, repetible a los 5; efecto 30-60 min (p. 27, Tabla 36.3). No se mezcla con los 200 mg (p. 45). `caMg` 90 gluconato/270 cloruro por ampolla (9 y 27 mg/mL × 10 mL, p. 27/45) ✅.
✅ Hipocalcemia: bolo 200 mg (22 mL gluconato), luego 1-2 mg/kg/h; sube el TOTAL 0,5 mg/dL y cae a los 30 min (p. 45-46); dibujo ilustrativo y rotulado.
✅ ClK: 20 mEq/h, 40 grave, >20 por cava sup. = asistolia (p. 23); fosfato potásico 4,5 mEq/mL (p. 23) y 4,3 «mEq/L» (p. 51) con nota. MgSO₄ 8 mEq/g, 2 g = 16 mEq (p. 37); 6 g = 48 mEq (p. 37). Tabla 37.1 (hueso 1.060 53 %… plasma 6 / 0,3 %): visto en la imagen de la p. 32.
❌ Mediano · `pagina.js:110` botones MgSO₄ 2/4/6 g, un clic = bolo instantáneo. En el libro 2 g en 2-5 min solo en riesgo vital (p. 37); 6 g van en 3 h; 4 g no está en ninguna pauta. Origen puesto: «ficha · p. 36-38». Falta rótulo «dosis y ritmo ilustrativos» y no hay tope para 6 g de golpe.
❌ Menor · `pagina.js:109` ritmo ClK de 10 mEq/h: no está en el libro (estándar 20, máximo 20, 40 grave).
❌ Mediano · `motor.js:34` aviso a 40 mEq/h: «solo si es grave y por vía central, con monitor». El libro: 40 «puede hacer falta en la grave»; central «preferida, si es posible» (no obligatoria); «con monitor» no figura en p. 23.
❌ Mediano · caso Valentín paso 2 (`pruebas.js`): se da calcio a un iónico 0,82 mmol/L con PA 98/60. El libro (p. 45-46) lo recomienda solo con reacción adversa grave o sintomático y avisa que el calcio IV se asocia a fallo multiorgánico; el enunciado no dice que haya complicación. Añadir la indicación al enunciado o a la explicación.

## 3. Topes, sellos y `vitales()`
✅ Umbrales: Mg >13 parada, >10 bloqueo AV completo (p. 39); Ca iónico <0,65 mmol/L hipotensión/ectopia (p. 45); fosfato <1 mg/dL (p. 49, 51); K⁺ ≥7 / ≥6 con nota (p. 26-27); K⁺ <1,5 y bolo >200: «ilustrativo» rotulado.
❌ Mediano · `vitales()` (`motor.js:49-50`) y texto del sello (`motor.js:23, 27`): «FR 28, SatO₂ 89 %» no sale del libro y el rótulo `VITALES_ORIGEN` dice solo «PA y FC ilustrativas». PA 84/50 y FC 112 del sello de calcio tampoco llevan «ilustrativo» en el texto del sello (sí en `vitales`). Ampliar el rótulo.
❌ Menor · aviso Ca «<0,9 mmol/L: grave» (`motor.js:25`): en el libro es grave en la transfusión masiva (p. 44), aquí se enuncia general.
❌ Menor · comentario `motor.js:14` «mitad cada 15 min, p. 37-38»: el libro dice que el Mg sube tras el bolo y «empieza a caer a los 15 min»; no da semivida. (Rotulado ilustrativo.)

## 4. Frase «El 98 % del K⁺ está dentro de la célula» (p. 18)
✅ «About 98 %… inside cells, only 2 % extracelular»; ~0,4 % plasma (15 mEq) y 3.500 mEq con 50 mEq/kg. El «50 mg/kg» impreso en p. 18 está anotado.

## 5. Los 8 botones `data-iones-vivos` (marino-renal.html:1541, 1619, 1684, 1748, 1874, 1998, 2116, 2191)
✅ hipopotasemia→rufino · hiperk-causas→adela · hiperk-tratamiento→adela:4 (calcio 90 mg) · mg-déficit→rufino:3 (Mg suero 0,3 %) · mg-reposición→rufino:4 (dar MgSO₄) · calcio-hipoca→valentin:1 · fósforo→damian:4 (fosfato). Los pasos son 1-basados y casan.
❌ Mediano · hipercalcemia (l. 2116) → `normal:ca`: el modelo no tiene hipercalcemia (solo hipoCa); lleva al calcio normal sin nada de lo que dice esa ficha (p. 46). Quitarlo o rotular «el modelo solo cubre la hipocalcemia».

## Frases de la maqueta (`frases-b.md`)
✅ Sin cambios desde la auditoría (el archivo no se tocó tras su último commit; leí cada frase contra el modelo, sin `diff` formal). Menor: «p. 31-32» del encargo para la Tabla 37.1 sigue corregido a p. 32.
Huecos: ninguno nuevo.

## No comprobado / riesgo
No ejecuté la app ni abrí `fichaDe` con páginas no listadas (36, 40-41); no miré `ecg.js` ni el mapa de la Mayéutica. Los textos de cada ficha los leí solo en su primera línea.
