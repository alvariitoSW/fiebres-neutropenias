# Auditoría ciega · parada 3 (eco-mega) · contra los PDF originales
Método: pdftotext de las páginas citadas. Desfase de páginas comprobado: Zoghbi PDF = impresa − 302; Mukherjee PDF = impresa − 140; Lang, Mitchell, Nagueh y Klein, según se indica.

## Frases y criterios
- ✅ Zoghbi Tabla 8 (p. 332 = PDF 30): EROA <0,20 / 0,20-0,29 y 0,30-0,39 / ≥0,40 cm²; RVol <30, 30-44, 45-59, ≥60 mL → `escenarios.mjs:171-172` bien («moderada 0,20-0,39», «30-59»).
- ✅ Zoghbi p. 334 (PDF 32): «EROA ≥0,3 por PISA 2D puede ser ya grave» y «≥0,2 empeora el pronóstico» pero la tabla no redefine la IM grave secundaria. Fiel.
- ✅ Zoghbi pp. 320-321 (PDF 18-19): sin cifras de tenting (solo área y altura de coaptación). «Ilustrativo: 8 mm» correcto.
- ✅ Panel del chorro: VC <0,3 leve, ≥0,7 grave (p. 328 = PDF 26 ✓); orificio elíptico en la secundaria y VC 2D subestima (misma página ✓); «área del chorro no sirve sola» (p. 308 = PDF 6 ✓, «sole reliance… misleading»); velocidad del eje «inversa a la distancia» (p. 308 ✓).
- ✅ Lang p. 25 y 28 (PDF 25 y 28): límite superior AI indexada 34 mL/m² (antes 28), 2D, telesístole (p. 25); biplano por discos. Bien.
- ✅ Lang Tabla 8 (p. 20): grosor pared VD 3±1, normal 1-5 mm. Bien.
- ✅ Lang p. 24 (PDF 24, no la 20 del encargo): AI bomba 15-30 % del llenado, reservorio, conducto. Bien.
- ✅ Nagueh PDF 13: S = suma de S1+S2; S/D <1 y fracción sistólica <40 % indican PAI alta con FEVI reducida; Ar >35 cm/s = PTDVI alta. La app no muestra umbrales, solo S, D, S/D, Ar (rotulado «ilustrativo»).
- ✅ Mukherjee p. 145 (PDF 5): RVWT <0,5; leve 0,5-0,7; moderada >0,7-0,9; grave >0,9 cm. PAPs (RVSP) ≤34. TAPSE >1,7; ≤1,7 a >1,3; ≤1,3 a >1,0; ≤1,0. Todo coincide con `escenarios.mjs:199-209`.
- ✅ Mukherjee p. 144 (PDF 4): RVWT en subcostal, telediástole, a mitad entre anillo y papilares; «normal <5 mm». Bien («sin trabéculas» es lectura razonable, no literal).
- ✅ Mukherjee p. 146 (PDF 6): IE >1 en telesístole = sobrecarga de presión; >1 en ambas fases = presión ± volumen. p. 173 (PDF 33): Grupo 1 IE >1,1; Grupo 2 normal <1,2. Bien. p. 172 (PDF 32): remodelado adaptativo → maladaptativo con dilatación. Bien.
- ✅ Mitchell pp. 25, 26, 31 (PDF = impresa): válvula de Eustaquio, seno coronario, septo interauricular, haz perpendicular a cada tabique en SC4C. Citas literales correctas.
- ✅ Klein p. 987 (PDF 23): colapso de AD «excede un tercio del ciclo». Bien.
- ✅ Cifras ilustrativas (cono 20°, tenting 8 mm, área de vena 2,5 cm², TAPSE pasivo, PAPs 92, fosa 7×3 mm) están rotuladas «ilustrativo» y no se presentan con fuente.

## Graves
Ninguno (ninguna cifra ni página falsa; todos los `#page=` caen en la página citada).

## Menores
- M1. Mukherjee, el cuadro de grosor y TAPSE es la **Tabla 1** (p. 145), no la «Tabla 5»: `escenarios.mjs:109`, `:196` y la nota visible `:201`. La página es correcta.
- M2. Panel del chorro (`simulador.mjs:614`): «Vena contracta 0,56 cm (ancho del chorro en su cuello)» se calcula como diámetro de un orificio circular de área EROA (2√(EROA/π)), no se mide; el informe P5c lo admite, pero la pantalla no. Además aplica los cortes de Zoghbi (<0,3/≥0,7) a un número derivado. Falta decir «calculada del EROA».
- M3. `escenarios.mjs:201` «En el TEP agudo la pared sigue fina (≤5 mm)»: sin cita (Mukherjee p. 144 solo dice que el RVWT depende del tiempo de evolución) y sin rótulo «fisiología general».
- M4. Nota TAPSE de `hpcronica` («puede conservarlo o tenerlo algo bajo») sin cita; Mukherjee (PDF 31) dice que la función basal suele estar conservada y el TAPSE cae en fases tempranas del remodelado: conviene citarlo.
- M5. «Intermedia» para VC 0,3-0,7: Zoghbi dice «valores intermedios solapan entre grados»; la etiqueta es fiel pero sin el matiz de usar más métodos (p. 328).

## Huecos
- H1. Zoghbi p. 332: la tabla de IM da también FR (<30/30-39/40-49/≥50 %), VCW intermedio y flujo en venas pulmonares (aplanamiento sistólico/inversión en IM grave). La app muestra S/D en las venas pero no enlaza con ese criterio de Zoghbi (sistólico reducido = IM más grave; Nagueh S/D <1 = PAI alta). Dilatada S/D 0,9 sería coherente con ambos.
- H2. Fuera de alcance, ya anotados como huecos: amiloidosis, MAPSE, ESC/ERS 2022.

## No comprobado / riesgo
No leí las páginas 149-150 de Mukherjee (IE) ni Lang p. 17/23 (anteriores a esta parada). Comprobado solo texto y enlaces; no vi la app en el navegador ni verifiqué que las cifras del motor (PAPs 92, PCP 26,7, S/D del modelo) correspondan a las tablas de los informes.
