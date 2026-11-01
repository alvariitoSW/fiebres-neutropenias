// Mayéutica del bloque 3, sub-bloque 3B · Shock cardiogénico, parte 2 (Marino cap. 16, págs. 41-45): ficha 7 y el caso C7 (Benito).
// Datos puros; el formato está en la cabecera de b1-fluidos.js. La ficha es js/modules/cardiologia/merino-cardiologia.html.
// Modelos vivos: shockVivo `cardio` y `rotura-papilar`; receptorVivo `na-baja`, `dobutamina` y `milrinona`.
// Las cifras de Benito a la hora 14 son las del estado `rotura-papilar` con su gravedad de receta (autonomo/bloques/b3/herramientas/g3-estados-cifras.mjs).
const PDF = 'docs/marino-2024-shock-caps14-17.pdf';
const pag = (n, txt) => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">${txt || `PDF pág. ${n}`}</a>`;
const p = n => pag(n, `pág. ${n}`);
// «Ver en la ficha» dentro de una nota (REGLAS §7.9): el enlace cruzado de siempre al párrafo exacto.
const enFicha = (tab, id) => ` <button type="button" class="may-ir" data-especialidad="cardiologia" data-view="merinoCardiologia" data-panel="panel-merino-cardio-tabs" data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const DED = '<i>Deducción; la fuente no lo dice.</i>';
const sv = (clave, texto) => ({ shockVivo: clave, texto });
const rc = (clave, texto) => ({ receptorVivo: clave, texto });
const FICHA = 'mc-cardiogenico-farmaco';

export const MAYEUTICA_CARDIOGENICO_2 = {
  /* =================================================================================================
     Ficha 7 · Shock cardiogénico: soporte farmacológico (cap. 16, págs. 41-44)
     ================================================================================================= */
  'mc-cardiogenico-farmaco': {
    entrada: 'Hasta qué presión de llenado llenar, qué vasopresor y qué inotrópico elegir, qué cifras te dicen que vas bien, y por qué los fármacos son solo un puente.',
    guia: [
      { id: 'cgm-g1', corto: 'por qué 18-20', tipo: 'test', fuente: 'mc-llenado-optimo',
        enunciado: 'El objetivo de presión de cuña en el shock cardiogénico es 18-20 mmHg, mucho más que la normal (<i>deducción; la fuente no lo dice</i>). Antes de leer la ficha: ¿qué marca el techo de esa cifra?',
        opciones: [
          { t: 'La presión coloidosmótica del plasma: por encima se arriesga el edema de pulmón', ok: true },
          { t: 'El límite técnico del catéter: por encima de 20 mmHg la medida deja de ser fiable', porque: `No es un límite de la medida: el techo es el edema pulmonar, que depende de la presión coloidosmótica (${p(42)}). Pensar en el catéter te haría ignorar por qué 20 y no 25.` },
          { t: 'Que más precarga siempre baja el gasto del VI, así que se llena lo mínimo', porque: `El objetivo es «la presión de cuña más alta que aumente el gasto cardíaco sin producir edema pulmonar» (${p(42)}). Llenar lo mínimo dejaría sin subir un gasto que sí responde al volumen.` }],
        explicacion: `La meta es la cuña <span class="hl-azul">más alta que aumente el gasto sin producir edema</span>, y depende de la presión coloidosmótica (COP): ~28 mmHg normal, <span class="hl">20-25 en el crítico</span> por la albúmina baja. De ahí <span class="hl-verde">18-20 mmHg</span> (${p(42)}).` },
      { id: 'cgm-g2', corto: 'el bolo', tipo: 'test', fuente: 'mc-llenado-optimo', modeloVivo: sv('cardio', '🫀 El bolo en la pestaña Volumen del modelo'),
        enunciado: 'Predice, y luego lo compruebas: un infartado en shock con la PCP por debajo de 18, en el modelo. ¿Qué hace un bolo de volumen sobre el índice cardíaco?',
        opciones: [
          { t: 'Lo sube: el gasto aún responde al llenado', ok: true },
          { t: 'Lo baja: en un corazón que falla, más volumen siempre es peor', porque: `La presión de llenado no siempre está aumentada en el shock, y entonces «la infusión de volumen puede ser instrumental para aumentar el gasto» (${p(42)}). Negarte al volumen dejaría un gasto que se podría subir.` },
          { t: 'No lo cambia: el volumen solo afecta a la PA', porque: `El volumen se da para aumentar el gasto cardíaco hasta la cuña óptima (${p(42)}), no solo la presión.` }],
        explicacion: `Si la presión de llenado no está elevada, el volumen puede <span class="hl-verde">aumentar el gasto</span>; se detiene al llegar a la cuña óptima, para no producir edema (${p(42)}).`,
        nota: `<b>La fuente no lo dice.</b> El libro no da el tamaño del bolo ni el ritmo de infusión; el volumen del modelo es ilustrativo.` },
      { id: 'cgm-g3', corto: 'norepinefrina y FC', tipo: 'test', fuente: 'mc-cs-vasopresor', modeloVivo: rc('na-baja', '💊 La norepinefrina a dosis baja en el receptor vivo'),
        enunciado: 'Predice: con norepinefrina a dosis baja en el shock cardiogénico, ¿qué le pasa a la frecuencia cardíaca y al gasto?',
        opciones: [
          { t: 'La frecuencia baja por reflejo, como con la fenilefrina, y el gasto cae por la bradicardia', porque: `La bradicardia refleja es de la fenilefrina, el vasoconstrictor puro (${p(42)}). La norepinefrina añade estimulación cardíaca leve.` },
          { t: 'La frecuencia se dispara y el gasto cae por la taquicardia', porque: `La preferencia por la norepinefrina viene de su menor riesgo de taquicardia y arritmias frente a epinefrina y dopamina (${p(43)}). Esperar una taquicardia fuerte te frenaría de usar la droga de elección.` },
          { t: 'Casi no cambia: la estimulación cardíaca es leve y el gasto tiende a conservarse', ok: true }],
        explicacion: `Vasoconstricción sistémica más <span class="hl-azul">estimulación cardíaca leve</span>, que «tiende a preservar el gasto frente a la vasoconstricción, al menos en el rango de dosis bajo» (${p(43)}). <i>Deducción; la fuente no lo dice:</i> que la frecuencia casi no cambie. Marino solo habla de estimulación cardíaca leve.` },
      { id: 'cgm-g4', corto: 'por qué no dopamina', tipo: 'test', fuente: 'mc-cs-norepi-preferencia',
        enunciado: 'Marino prefiere la norepinefrina a la epinefrina y a la dopamina en el shock cardiogénico. ¿En qué se apoya?',
        opciones: [
          { t: 'Que vasoconstriñe más fuerte que ninguna de las dos y por eso corrige antes la presión arterial', porque: `El argumento del libro es el menor riesgo de taquicardia y arritmias y las menos muertes en los estudios (${p(43)}), no la potencia de la vasoconstricción.` },
          { t: 'Que no necesita titulación: se da a dosis fija desde el inicio', porque: `Se da en infusión continua, sin dosis de carga, empezando a 5 μg/min y titulando al alza (${p(43)}). Fijarla sin titular ignoraría la respuesta de cada paciente.` },
          { t: 'Menos riesgo de taquicardia y arritmias, y menos muertes en los estudios comparativos', ok: true }],
        explicacion: `En los estudios, la norepinefrina tuvo <span class="hl">menor riesgo de taquicardia y de arritmias</span> graves que la epinefrina y la dopamina, y se asoció a menos muertes (${p(43)}).` + enFicha(FICHA, 'mc-cs-norepi-preferencia') },
      { id: 'cgm-g5', corto: 'la dobutamina', tipo: 'test', fuente: 'mc-dobutamina', modeloVivo: rc('dobutamina', '💊 La dobutamina en el receptor vivo'),
        enunciado: 'Predice, y luego lo compruebas: con dobutamina, ¿qué le pasa a la presión arterial y cuánto sube la frecuencia cardíaca habitualmente?',
        opciones: [
          { t: 'La presión se mantiene, y la frecuencia suele subir 5-15 lpm, aunque puede pasar de 30', ok: true },
          { t: 'La presión cae por su efecto vasodilatador, y la frecuencia sube muy poco o incluso baja', porque: `Tiene efecto vasodilatador leve, pero no baja la PA porque se compensa con el aumento del volumen sistólico; y la subida de frecuencia es su principal desventaja (${p(43)}).` },
          { t: 'La presión sube mucho como con un vasopresor, y la frecuencia no cambia', porque: `Es inotrópico, no vasopresor: «preserva (y a veces aumenta) la PA» pero su problema es la frecuencia, que sube 5-15 lpm (${p(43)}). Confundirla con un vasopresor te dejaría sin tratar la hipotensión.` }],
        explicacion: `Estimula receptores β₁: sube el volumen sistólico y la frecuencia (<span class="hl-rojo">5-15 lpm, a veces >30</span>) y el consumo de O₂ del miocardio. Su ventaja es <span class="hl-verde">preservar la PA</span> (${p(43)}).` + enFicha(FICHA, 'mc-dobutamina') },
      { id: 'cgm-g6', corto: 'milrinona e hipotensión', tipo: 'test', fuente: 'mc-milrinona', modeloVivo: rc('milrinona', '💊 La milrinona en el receptor vivo'),
        enunciado: 'Predice: en un paciente ya hipotenso, ¿qué hace la milrinona con la presión arterial media?',
        opciones: [
          { t: 'La baja: vasodilata, y esa hipotensión limita su uso en el shock', ok: true },
          { t: 'La sube: el inotropismo del AMPc compensa a la vasodilatación, así que es la elección en el shock', porque: `La vasodilatación puede producir «hipotensión problemática» (${p(44)}); compensar con inotropismo es la propiedad de la dobutamina (${p(43)}). Esperar lo contrario te llevaría a dar milrinona a un paciente que ya no tolera la caída.` },
          { t: 'No la cambia: solo afecta a la frecuencia', porque: `Su riesgo principal es la hipotensión, y su atractivo es la menor taquicardia (${p(44)}). Ignorarlo te haría usarla con PAM baja.` }],
        explicacion: `Inhibe la fosfodiesterasa (↑AMPc, ↑Ca²⁺ en el miocito) y <span class="hl-rojo">vasodilata</span>. Efecto inotrópico parecido al de la dobutamina con menos taquicardia, pero el riesgo de hipotensión limita su popularidad en el shock; es más apropiada en la IC descompensada sin hipotensión (${p(44)}).` + enFicha(FICHA, 'mc-milrinona') },
      { id: 'cgm-g7', corto: 'un puente', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mc-carga-trabajo',
        enunciado: 'Los vasopresores y los inotrópicos son la base del tratamiento, pero Marino los llama solo un tramo del camino. ¿Por qué? Tu respuesta tiene dos partes.',
        puntos: [
          `Aumentan el <span class="hl-rojo">trabajo del corazón</span>: el vasopresor sube la poscarga y el inotrópico la contractilidad y la frecuencia, algo contraproducente en un miocardio que ya falla.`,
          `El soporte mecánico está diseñado para <span class="hl-verde">reducir ese trabajo</span>: no hay que retrasarlo si no hay mejoría rápida con los fármacos.`],
        explicacion: `«Es importante evitar retrasos en pasar a soporte mecánico si no hay evidencia de mejoría rápida durante el soporte farmacológico» (${p(44)}).` + enFicha(FICHA, 'mc-carga-trabajo') },
    ],
    examen: [
      { id: 'cgm-e1', corto: 'dobutamina y TSVI', tipo: 'test', fuente: 'mc-cs-inotropicos · mc-cs-vasopresor',
        enunciado: 'Una miocardiopatía hipertrófica con obstrucción dinámica del tracto de salida del VI entra en shock. Un residente propone norepinefrina y dobutamina. ¿Qué dice Marino?',
        opciones: [
          { t: 'Que es lo habitual, y se titula la dobutamina como en cualquier shock cardiogénico, con norepinefrina', porque: `Los inotrópicos están contraindicados en esta forma de shock (${p(43)}). Contraer más el corazón aumentaría la obstrucción.` },
          { t: 'Inotrópico contraindicado; el vasoconstrictor puro, como la fenilefrina, es más apropiado', ok: true },
          { t: 'Que se use milrinona, porque da menos taquicardia que la dobutamina', porque: `Cualquier inotrópico está contraindicado aquí (${p(43)}); la menor taquicardia de la milrinona (${p(44)}) no cambia eso.` }],
        explicacion: `<span class="hl-rojo">Inotrópicos contraindicados</span> en la obstrucción dinámica del TSVI (${p(43)}); el vasoconstrictor puro como la fenilefrina, que puede dar bradicardia refleja, es más apropiado que la norepinefrina (${p(42)}).` },
      { id: 'cgm-e2', corto: 'milrinona renal', tipo: 'test', fuente: 'mc-tabla-16-3', origen: 'ficha: Tabla 16.3',
        enunciado: 'Un paciente en shock cardiogénico con aclaramiento de creatinina de 30 mL/min/1,73 m². ¿Qué velocidad de infusión de milrinona da la Tabla 16.3?',
        opciones: [
          { t: '0,43 μg/kg/min', porque: `Es la cifra de un aclaramiento de 50 (${p(43)}). Con 30, la infusión quedaría alta para su eliminación y aumentaría el riesgo de hipotensión.` },
          { t: '0,28 μg/kg/min', porque: `Es la cifra de un aclaramiento de 20 (${p(43)}). Con 30 quedaría baja.` },
          { t: '0,33 μg/kg/min', ok: true }],
        explicacion: `Tabla 16.3: ClCr 50 → 0,43; 40 → 0,38; <span class="hl">30 → 0,33</span>; 20 → 0,28 μg/kg/min. La semivida de 2,5 h se alarga en la insuficiencia renal (${p(44)}). Son recomendaciones del fabricante.` + enFicha(FICHA, 'mc-tabla-16-3') },
      { id: 'cgm-e3', corto: 'levosimendán', tipo: 'test', fuente: 'mc-levosimendan',
        enunciado: 'El levosimendán tiene una vida media de 80 horas. ¿Cuánto duran, por costumbre, sus infusiones en el shock cardiogénico?',
        opciones: [
          { t: 'Unas 72 horas, para cubrir la vida media', porque: `Las infusiones «suelen limitarse a 24 horas» pese a la vida media larga (${p(44)}). Mantenerla 72 h expondría más tiempo a su riesgo de hipotensión.` },
          { t: 'Hasta 24 horas, pese a su semivida de 80 h', ok: true },
          { t: 'Una semana, porque no gasta oxígeno miocárdico', porque: `Que no estimule el consumo miocárdico de O₂ (${p(44)}) es su ventaja, pero no cambia el límite habitual de 24 horas. Alargarlo sumaría hipotensión.` }],
        explicacion: `Sensibiliza los miofilamentos al calcio y vasodilata; no estimula el consumo de O₂. <span class="hl-purpura">Infusiones habitualmente limitadas a 24 horas</span> pese a una vida media de 80 h; no está aprobado en EE. UU. (${p(44)}).` },
      { id: 'cgm-e4', corto: 'dosis de norepinefrina', tipo: 'test', fuente: 'mc-cs-norepi-dosis',
        enunciado: 'Va a empezar norepinefrina en un shock cardiogénico. ¿Cómo se pauta?',
        opciones: [
          { t: 'Infusión continua desde 5 μg/min (0,05 μg/kg/min), subiendo cada 5 minutos', ok: true },
          { t: 'Bolo de carga de 50 μg y luego 5 μg/min', porque: `Se da «en infusión continua, sin dosis de carga» (${p(43)}). Un bolo de carga produciría un pico de presión innecesario.` },
          { t: 'Infusión de 30 μg/min desde el inicio para llegar antes a una PAM ≥65 y estabilizar al paciente', porque: `Empieza en 5 μg/min; 5-30 μg/min es el rango habitual de los estudios, no la dosis de inicio (${p(43)}).` }],
        explicacion: `Sin dosis de carga; <span class="hl">5 μg/min</span> (0,05 μg/kg/min), titulando cada 5 minutos. Rango habitual en estudios de shock cardiogénico: 5-30 μg/min. Objetivo: PAS ≥90 o PAM ≥65 (${p(42)}-43).` + enFicha(FICHA, 'mc-cs-norepi-dosis') },
      { id: 'cgm-e5', corto: 'SvO₂ 45 %', tipo: 'test', fuente: 'mc-tabla-16-2', origen: 'ilustrativo: paciente inventado; el objetivo es de la ficha',
        enunciado: 'Un paciente en shock cardiogénico tiene PAM 68, diuresis de 0,7 mL/kg/h, lactato de 1,8 y SvO₂ del 45 %. ¿Cumple los objetivos de oxigenación tisular de la Tabla 16.2?',
        opciones: [
          { t: 'Sí: el lactato es <2 y con eso basta para cumplirlos', porque: `La Tabla 16.2 pide las dos cosas: lactato <2 mmol/L y SvO₂ >50 % (${p(42)}). Con 45 % la entrega de O₂ sigue corta aunque el lactato aún no haya subido.` },
          { t: 'No: la SvO₂ debe ser >50 % y aquí es del 45 %', ok: true },
          { t: 'Sí: la SvO₂ solo importa en el shock séptico', porque: `La Tabla 16.2 la incluye en el shock cardiogénico, y la SvO₂ informa del balance entre el transporte y el consumo de O₂ (${p(42)}).` }],
        explicacion: `Oxigenación tisular: <span class="hl-verde">SvO₂ >50 %</span> y lactato <2 mmol/L. La SvO₂ informa del balance entre el aporte y el consumo de O₂; el lactato, de forma indirecta, de si la oxigenación es adecuada (${p(42)}).` + enFicha(FICHA, 'mc-tabla-16-2') },
      { id: 'cgm-e6', corto: 'PCP 19 con IC 2,3', tipo: 'test', fuente: 'mc-nota-pcp-fuentes · mc-tabla-16-2', origen: 'ilustrativo: paciente inventado; el objetivo es de la ficha',
        enunciado: 'Un paciente en shock cardiogénico tiene una PCP de 19 mmHg y un IC de 2,3. Según Marino (página 42), ¿está en el objetivo de llenado?',
        opciones: [
          { t: 'Solo según el texto (18-20); la tabla (19-20) lo dejaría fuera', porque: `El 19 entra en las dos: 18-20 en el texto y 19-20 en la Tabla 16.2 (${p(42)}). Con una PCP de 18 sí ocurriría eso: el texto la admite y la tabla no.` },
          { t: 'Sí: 19 cabe en el 18-20 del texto y también en el 19-20 de la tabla', ok: true },
          { t: 'No: la PCP debería estar por debajo de 12 para evitar el edema pulmonar', porque: `El libro quiere la cuña más alta que suba el gasto sin edema, 18-20 (${p(42)}). Con menos de 12 dejarías gasto sin recuperar.` }],
        explicacion: `Texto: «la presión de llenado óptima del VI se considera 18-20 mmHg». Tabla 16.2: «PAWP = 19-20 mmHg». Con 19 cumple las dos; con 18 solo el texto (${p(42)}).`,
        nota: `<b>Las fuentes discrepan.</b> En la misma página: 18-20 mmHg en el texto y 19-20 mmHg en la Tabla 16.2. La calculadora da por buena una cuña de 18-20.` + enFicha(FICHA, 'mc-nota-pcp-fuentes') },
    ],
    profundizar: [
      { id: 'mc-cs-monitorizacion-txt', titulo: 'Monitorización: el catéter de arteria pulmonar' },
      { id: 'mc-nota-pac-fuentes', titulo: 'Nota de fuentes: catéter de arteria pulmonar (cap. 14 frente a cap. 16)' },
      { id: 'mc-levosimendan', titulo: 'Levosimendán' },
    ],
    casos: [
      { id: 'c7', titulo: 'Benito, 66 años: del volumen al soplo nuevo', corto: 'Caso · Benito', sub: 'IAM; 78 kg; el que sube y vuelve a caer',
        paciente: { Edad: '66 años, varón', Peso: '78 kg', Antecedentes: 'IAM, ingresado en UCI' },
        pasos: [
          { momento: 'Hora 1', datos: { Constantes: 'PA 82/52 (PAM 62), FC 104', Catéter: 'PCP 12, IC 1,8', Lactato: '3,0 mmol/L' }, nuevo: ['Constantes', 'Catéter', 'Lactato'], calculadora: { ir: 'mc-objetivos-resultado', nombre: '¿Estoy en objetivo?' },
            pregunta: { id: 'c7-1', tipo: 'test', fuente: 'mc-llenado-optimo · mc-tabla-16-2', origen: 'ilustrativo: cifras del paciente',
              enunciado: 'Abre la calculadora si quieres: con PCP 12, IC 1,8, PAM 62 y lactato 3,0, ¿qué haces primero?',
              opciones: [
                { t: 'Dobutamina de inicio, para subir el gasto cuanto antes sin esperar a la cuña', porque: `La cuña está lejos de 18-20: el volumen puede subir el gasto (${p(42)}) y la dobutamina aumenta la frecuencia y el consumo de O₂ en un infarto agudo (${p(43)}).` },
                { t: 'Volumen, vigilando la cuña hasta 18-20 mmHg', ok: true },
                { t: 'Furosemida, para evitar el edema', porque: `Con PCP 12 no hay presión de llenado alta que bajar; el objetivo es subirla a 18-20 (${p(42)}). Un diurético empeoraría el gasto.` }],
              explicacion: `La cuña (12) está <span class="hl">por debajo del objetivo de 18-20</span>: el volumen puede ser instrumental para subir el gasto, hasta la cuña más alta que no produzca edema (${p(42)}).` } },
          { momento: 'Hora 2 · tras 500 mL', datos: { Catéter: 'PCP 18, IC 2,2', Constantes: 'PA 86/52 (PAM 63)' }, nuevo: ['Catéter', 'Constantes'],
            pregunta: { id: 'c7-2', tipo: 'test', fuente: 'mc-cs-vasopresor · mc-cs-norepi-dosis', origen: 'ilustrativo: cifras del paciente',
              enunciado: 'La cuña ya está en 18 y el índice en 2,2, pero la PAM sigue en 63. ¿Qué añades?',
              opciones: [
                { t: 'Dopamina, que sube la presión y la frecuencia a la vez', porque: `La norepinefrina tuvo menos taquicardia y menos muertes que la dopamina y la epinefrina (${p(43)}). Con la dopamina cargarías a un corazón que ya falla.` },
                { t: 'Fenilefrina, el vasoconstrictor puro', porque: `Es la excepción para la obstrucción dinámica del TSVI (${p(42)}); aquí no hay datos de eso, y sin estimulación cardíaca leve perderías el apoyo al gasto.` },
                { t: 'Norepinefrina en infusión, a 5 μg/min', ok: true }],
              explicacion: `PAM <65: vasopresor para PAS ≥90 o PAM ≥65. <span class="hl-verde">Norepinefrina</span>, sin dosis de carga, desde 5 μg/min titulando cada 5 minutos (${p(42)}-43).` } },
          { momento: 'Hora 6 · nota del R1', datos: { Constantes: 'PA 98/56 (PAM 70) con norepinefrina 5 μg/min', Catéter: 'PCP 19, IC 2,1', Nota: 'qué inotrópico' }, nuevo: ['Constantes', 'Catéter', 'Nota'],
            pregunta: { id: 'c7-3', tipo: 'error', fuente: 'mc-cs-inotropicos · mc-tabla-16-3 · mc-dobutamina · mc-milrinona · mc-levosimendan', origen: 'ilustrativo: cifras del paciente',
              enunciado: 'La PAM ya es 70 pero el índice sigue en 2,1. La nota del R1 sobre el inotrópico. Encuentra el error.',
              frases: [
                { t: 'Milrinona de inicio: da menos taquicardia que la dobutamina y su hipotensión no importa.', mal: true, c: `La milrinona tiene un <span class="hl-rojo">riesgo significativo de hipotensión</span> que limita su uso en el shock cardiogénico (${p(44)}).` },
                { t: 'Dobutamina desde 3-5 μg/kg/min, subiendo de 3-5 en 3-5 si hace falta.' },
                { t: 'Esperable que la frecuencia suba 5-15 lpm.' },
                { t: 'El levosimendán no estimula el consumo de O₂ del miocardio, pero puede dar hipotensión.' }],
              explicacion: 'Un error: la milrinona tiene menos taquicardia, pero su hipotensión es justo su límite en el shock.' } },
          { momento: 'Hora 14 · el giro', datos: { Constantes: 'PA 78/61 (PAM 69), FC 106, SpO₂ 83 %', Catéter: 'PCP 30, PAP 40/30, PVC 4, IC 1,7', Lactato: '5,2 mmol/L', Exploración: 'soplo holosistólico nuevo' }, nuevo: ['Constantes', 'Catéter', 'Lactato', 'Exploración'],
            pregunta: { id: 'c7-4', tipo: 'test', fuente: 'mc-papilar · mc-roturas-24h', modeloVivo: sv('rotura-papilar', '🫀 Benito: la rotura del papilar en el modelo'),
              enunciado: 'Catorce horas después del infarto aparece un soplo nuevo, la PCP salta de 19 a 30 y el índice cae. ¿Qué es y qué toca?',
              opciones: [
                { t: 'Sobrecarga por los 500 mL de volumen: diurético, y esperar a que baje la cuña antes de pensar en otra cosa', porque: `Un soplo holosistólico nuevo y un salto de la PCP en pocas horas apuntan a una insuficiencia mitral aguda (${p(38)}), no a 500 mL. Un diurético retrasaría el soporte.` },
                { t: 'Un nuevo infarto del VD: la PVC debería estar alta', porque: `En el fallo del VD sube la PVC por encima de la PCP (${p(40)}); aquí la PVC es 4 y la PCP 30.` },
                { t: 'Rotura del papilar: insuficiencia mitral aguda dentro de las 24 h; no retrasar el soporte', ok: true }],
              explicacion: `La rotura del papilar (7 %) produce una <span class="hl-rojo">insuficiencia mitral aguda y potencialmente mortal</span> y aparece típicamente dentro de las primeras 24 h (${p(38)}). Sin mejoría rápida con fármacos, hay que evitar retrasos en pasar a soporte mecánico (${p(44)}-45).`,
              nota: `<b>La fuente no lo dice.</b> El soplo holosistólico no figura en el cap. 16 (es fisiología general); el libro tampoco da el tratamiento definitivo de la rotura del papilar ni la PCP esperable; las cifras de esta hora son las del estado del modelo para este paciente. Esta pregunta no cubre la cirugía. <b>Fuente externa: Marino no habla de ondas v.</b> En la rotura del papilar la onda v gigante del enclavamiento sube la PCP media hasta igualar o superar la presión diastólica de la arteria pulmonar («large, prominent v-waves»; <a class="biblio-link" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8304571" target="_blank" rel="noopener">revisión de complicaciones mecánicas del IAM</a>); el modelo da la media: PCP ≈ PAP diastólica (aquí 30 con PAP 40/30).` + enFicha(FICHA, 'mc-carga-trabajo') } },
          { momento: 'Hora 15 · decisión', datos: { Respiración: 'SpO₂ 83 % con edema pulmonar', Pregunta: 'qué soporte y qué vigilas' }, nuevo: ['Respiración', 'Pregunta'],
            pregunta: { id: 'c7-5', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mc-ecmo', modeloVivo: sv('rotura-papilar', '🫀 El soporte sobre el estado de Benito'),
              enunciado: 'Benito tiene fallo respiratorio además del cardiogénico. ¿Qué soporte prefiere Marino y qué vigilas? Tu respuesta tiene dos partes.',
              puntos: [
                `El <span class="hl-verde">ECMO veno-arterial</span>: es el soporte preferido en el shock cardiogénico con fallo respiratorio, porque apoya la circulación y la oxigenación.`,
                `Vigilas la <span class="hl-rojo">poscarga del VI</span>: el flujo retrógrado en la aorta puede reducir el gasto del VI y causar edema agudo de pulmón.`],
              explicacion: `Se resuelve con balón o Impella combinados, o drenando el VI («venteo») (${p(48)}-49). Requiere anticoagulación completa.`,
              nota: `<b>La fuente no lo dice.</b> El libro no dice si el soporte mecánico es el definitivo de la rotura del papilar; solo indica cuándo se usa y qué problema trae.` + enFicha('mc-soporte-mecanico', 'mc-ecmo') } },
        ],
        lleva: [
          'Con PCP 12, primero volumen hasta 18-20; con PAM <65, norepinefrina desde 5 μg/min sin bolo.',
          'La dobutamina sube la frecuencia 5-15 lpm; la milrinona da hipotensión.',
          'Los fármacos son un puente: un soplo nuevo con PCP 30 pide soporte sin retrasos.' + enFicha(FICHA, 'mc-carga-trabajo')],
        volver: { nombre: 'Carga de trabajo cardíaco: por qué un puente', ancla: 'mc-carga-trabajo', modelo: sv('rotura-papilar', '🫀 Benito: PCP 30, IC 1,7 y el chorro mitral') } },
    ],
  },
};
