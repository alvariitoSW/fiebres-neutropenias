# Auditoría ciega · Mayéutica sin modelo (Marino caps. 4-6) · `js/data/mayeutica/b1-sin-modelo.js`

Fuente: `docs/marino-2024-acceso-vascular-practicas-caps1-4.pdf` (págs. PDF 67-72) y
`docs/marino-2024-practicas-monitorizacion-caps5-9.pdf` (págs. PDF 1-31). Leídas completas; figuras 4.6, 5.1, 5.2 y 6.1
vistas en imagen. Todas las dosis y umbrales de las preguntas se cotejaron con las tablas 4.3, 5.2, 5.3, 6.2, 6.3, 6.5-6.8.
Resultado: **2 graves, 2 huecos, 11 menores**. Las dosis (heparinas, fondaparinux, ajustes renales, opioides, sedantes) coinciden
con el libro; no hay ninguna dosis mal.

## GRAVE

1. **e1-5 (y e1-3) · caso Tomás · fuente Tabla 4.2, pág. 68; app :155-162.** La app pone ClCr 75 mL/min el día 1 y
   **40 mL/min el día 5** (caída del 47 %) y dice «Sigue sin indicación (un moderado)». Esa caída es un fracaso renal agudo, y la
   Tabla 4.2 lo cuenta como factor moderado: VM >24 h con enteral (moderado) + FRA (moderado) = **dos moderados = riesgo alto =
   profilaxis sí**. La respuesta correcta («Retirarla: no está indicada») contradice la regla que el propio caso enseña. Además
   el día 3 solo dice «sin shock; sin FRA»: con neumonía ventilada no descarta sepsis (otro moderado). Arreglo: dejar el ClCr en
   75 (o un valor que no sea FRA), o cambiar el giro; y escribir «sin sepsis» en el día 3.
2. **se-e1 · Examen sedación · fuente págs. 26-27; app :755-761.** Dos respuestas defendibles. El libro dice, con la
   misma cita (ref. 4), que «el lorazepam es la benzodiacepina de elección para sedación prolongada en perfusión» (pág. 27, arriba)
   **y** que lo más reciente es evitar las BZD si se puede. La opción 1 («Lorazepam: es la BZD de elección en perfusiones largas»)
   está literalmente en el libro, y el «porque» la atribuye solo a «ese estudio». Arreglo: reformular («¿qué recomienda hoy
   la guía: usar BZD o evitarlas?») o quitar «de elección» de la opción 1 y decir en el «porque» que Marino lo escribe y luego
   lo matiza con las guías.

## HUECO

1. **e2 (Lucía, UCI) · pág. 8.** Marino dice que el fondaparinux «no se ha estudiado en pacientes críticos (UCI)». El caso lo pone
   en una enferma de UCI (e2-3/e2-4) y no lo menciona. Debería salir en la explicación de e2-4 o en «Para profundizar».
2. **Tabla 5.3 / pág. 9 (puntos 1-5), «Para profundizar» de tromboprofilaxis.** Solo se usan los ACOD en e2-1, tf-e4 y te-g5. La
   dosis de dalteparina en obesidad (200 U/kg/día, peso real, pág. 7) no sale en ninguna pregunta ni en «Para profundizar».

## MENOR

1. **ue-g6 explicación (:65) y e1-6 (:169) · Fig. 4.6, pág. 70.** «4,2 % con placebo frente a 2,5 %... 21,9 % frente a 22,6 %»:
   el orden se lee como placebo-pantoprazol, y en la figura es al revés (pantoprazol 21,9; placebo 22,6). Etiquetar cada cifra.
2. **e2-3 → e2-4 · pág. 8.** Hay una TVP establecida con sospecha de TIH, y el caso pasa a la dosis **profiláctica** de fondaparinux.
   El libro da el argatrobán como tratamiento aprobado (e2-3 lo dice) y solo «se ha usado» el fondaparinux en TIH confirmada.
   El caso debería aclarar que se discute la dosis que dice el libro, no que sea el tratamiento de la TVP.
3. **tf-e3 explicación (:262) · págs. 4 y 8.** «Ninguna cubre el tramo 30-35 de la tabla»: el texto sí lo cubre (1,5 mg con 20-50), y es
   justo la respuesta correcta. Decir «la tabla no cubre 30-35; el texto sí».
4. **e2-1 (:298) · págs. 4 y 7.** «Enoxaparina con anti-Xa» no dice qué dosis (con ClCr 25 el libro da 30 mg al día; con IMC ≥40, 40 mg/12 h).
   La explicación lo resuelve a medias. Poner la dosis o quitar la enoxaparina de la opción correcta.
5. **te-g2 (:372-377) · pág. 10.** PA 80/35 frente a CNI de 35-40: con 35 no «supera» la diastólica. Usar una diastólica claramente
   menor (p. ej. 25-30) para que el ejemplo sea inequívoco.
6. **e3-1 porque (:463).** «Con TCE manda el TCE» sobre la fractura de fémur es inferencia del constructor: el libro da las pautas
   del TCE y de extremidades por separado (pág. 12) y no dice cuál manda si coinciden. Rotularlo o suavizarlo.
7. **e3-5 frase 3 (:498).** «Mantengo la CNI... en el alto riesgo se suma a la HBPM» se apoya en la sección de órganos sólidos/extremidades;
   en el TCE el libro solo dice «CNI hasta TC estable, luego HBPM» (pág. 12). Defendible, pero sin cita del TCE.
8. **an-e1 explicación (:587) · pág. 20.** «1,5 mg/kg a asmáticos» se copia tal cual. Son ≈100 mg en 70 kg: cifra dudosa que probablemente
   es errata de la fuente (no verificable aquí). Debería llevar nota de fidelidad (REGLAS §1.3/1.8) o decir «según el libro».
9. **an-e5 «porque» (:612) · pág. 22/23.** Llama «errata» y «dosis irrisoria» a la Tabla 6.3; es juicio del constructor (la ficha ya lo
   rotula como suyo en `mar-ketamina-errata`). En la pregunta bastaría «la tabla imprime µg/h; el texto, µg/kg/h».
10. **se-e2 (:763) · págs. 25-26.** Lorazepam a 12 mg/h está fuera del rango de la Tabla 6.5 (0,01-0,1 mg/kg/h = máx. ~7 mg/h con 70 kg):
    sale por >10 mg/h, pero el paciente no es plausible. Usar p. ej. 0,12 mg/kg/h en 100 kg o decir que es una perfusión mal calculada.
11. **e4b-4 (:835).** «Paro el propofol» se da como verdadero; el libro solo dice «soporte, y ECMO» (pág. 29). Es lo razonable, pero no
    está escrito en la fuente. Añadir «según la fuente: soporte» o quitar la frase.
12. **Formato (REGLAS §8).** Los «encuentra el error» dicen «Encuentra los errores» sin indicar cuántos puede haber (0, 1 o 2). Menor y de
    formato. También: e4a-3 opción 1 dice «una depresión respiratoria y cardiovascular buscada» («buscada» sobra); e1-6 dice «tres
    cosas» pero la explicación habla de «los cuatro argumentos de la Tabla 4.4».

## Comprobado sin hallazgo (muestra)
Tabla 4.2/4.3 (riesgos, famotidina −50 % con ClCr <50, pantoprazol 40, omeprazol solo PO/SNG, sucralfato); HNF 5.000 U/8-12 h y
7.500 U/8 h (IMC ≥40); enoxaparina 40 mg/día o 30 mg/12 h, 30 mg/día con ClCr <30, 40 mg/12 h en obesidad mórbida; anti-Xa 0,2-0,5;
fondaparinux 2,5 mg y la discrepancia 35-50 / 20-50; ACOD solo cadera/rodilla; espera neuroaxial 12/24/48/24 h; CNI 35-40/20 mmHg;
pautas de cirugía, ortopedia, TCE (30 mg/12 h) y lesión medular; BPS ≥6, numérica >3; Tabla 6.2 (fentanilo 0,35-0,5 µg/kg = 28-40 µg
en 80 kg), remifentanilo, meperidina 15-40 h, ketorolaco 15 mg, paracetamol 1 g/6 h máx. 4 g; RASS; Tabla 6.7; propofol 71 µg/kg/min
(cuenta) y 67 µg/kg/min (4 mg/kg/h); 480 kcal; PRIS >80 µg/kg/min o >5 mg/kg/h, 36 µg/kg/min, 3 %, 30-35 %; hiato osmolar >10;
dexmedetomidina 30 %; haloperidol 5/10 mg, QTc >500, >35 mg/día, notas de fidelidad de la Tabla 6.8.

## No comprobado / riesgo
No miré el HTML de las fichas ni los `profundizar` (solo los títulos de este archivo), ni que los ids `fuente` existan. La cifra de 1,5 mg/kg
de morfina en asmáticos no se pudo contrastar con la referencia 18 del libro (no está en `docs/`).
