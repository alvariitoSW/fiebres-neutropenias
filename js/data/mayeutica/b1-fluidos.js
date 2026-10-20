// Mayéutica de las fichas del bloque 1, grupo D · Fluidos (Marino caps. 10-11): XX mar-cristaloides y
// XXI mar-coloides. La pinta js/core/mayeutica.js (botón «Mayéutica» del interruptor de cada ficha). Datos puros.
//
// Toda la medicina sale de la ficha (js/modules/libros/marino-fundamentos.html) y de su PDF
// (docs/marino-2024-fluidoterapia-caps10-11.pdf, págs. 2-20); cada pregunta dice dónde con `fuente`. El paciente de
// los casos se inventa. Cobertura y casos: autonomo/bloques/b1/cobertura.md §2.D y §3 (D1, D2).
//
// ── Formato (el mismo para todos los grupos) ──────────────────────────────────────────────────────────────────
// 'id-de-la-ficha': {
//   entrada: 'una frase: qué enseña la Mayéutica de esta ficha',
//   guia:   [pregunta…],   Guía socrática: preguntas encadenadas, EN EL ORDEN DE LA FICHA
//   examen: [pregunta…],   Examen: nivel MIR u oposición; distractores finos que salen de la propia ficha
//   casos:  [caso…],
//   profundizar: [{ id, titulo?, nota? }…],   trozos de la ficha que no se cubren (se copian del DOM por id)
// }
// pregunta = { id (único en toda la app), corto (2-3 palabras, para el repaso), tipo, enunciado, explicacion,
//   fuente: 'id · id' (ids de la ficha u otras fichas; salen como «Ver en el texto»),
//   origen?: 'ficha' por defecto ('ilustrativo: …' si es una cuenta proporcional),
//   nota?: nota de fuentes o de fidelidad (HTML),
//   modelo?: { aguaViva: 'salino' } o una lista: el botón «Compruébalo en el modelo», que sale tras contestar,
//   y según el tipo:
//   test:    opciones: [{ t, ok: true } | { t, porque: 'qué le habría pasado al paciente' }]  (se barajan solas)
//   destapa: puntos: ['…', '…'] (2-4), cuantas?: 'son tres cosas'
//   error:   frases: [{ t } | { t, mal: true, c: 'la frase buena' }]  (0, 1 o 2 con mal)
// caso = { id, titulo, corto, sub, paciente: { campo: valor }, lleva: [3 frases],
//   volver: { nombre, ancla: 'id del texto', modelo?: { aguaViva: '…' } },
//   pasos: [{ momento: 'Día 2', datos?: { campo: valor }, nuevo?: ['campo'], calculadora?: { ir: 'id', nombre },
//            pregunta }] }   (5-8 pasos; al menos un «error» y un «destapa»; un giro)

export const MAYEUTICA_FLUIDOS = {
  /* =================================================================================================
     XX · Cristaloides y sueros glucosados (F págs. 2-11)
     ================================================================================================= */
  'mar-cristaloides': {
    entrada: 'Adónde va lo que infundes, por qué el salino no es «normal», cómo tampona el Ringer, qué hace el hipertónico y por qué el glucosado ya no.',
    guia: [
      { id: 'cri-g1', corto: 'el plasma', tipo: 'test', fuente: 'mar-tabla-10-1', modelo: { aguaViva: 'inicio' },
        enunciado: 'Un varón de 75 kg tiene 45 L de agua. Antes de mirar la tabla: ¿cuánta de esa agua es plasma, lo que la fluidoterapia quiere sostener?',
        opciones: [
          { t: '16 L: todo el líquido de fuera de las células', porque: 'Eso es todo el extracelular (0,35 × agua total): plasma más intersticio. Si esperas que lo infundido se quede en un «vaso» de 16 L, no entenderás por qué el paciente se llena de edemas.' },
          { t: '3 L: el plasma, solo el 6-7 % del agua total', ok: true },
          { t: '29 L: dos tercios del agua del cuerpo', porque: 'Es el intracelular (0,65 × agua total). Confundirlo con el plasma lleva a elegir sueros que acaban dentro de las células y no sostienen la tensión.' }],
        explicacion: 'Tabla 10.1: agua total 0,6 × peso magro en el varón (45 L); extracelular 0,35 × agua total (16 L); <span class="hl">plasma 0,2 × extracelular = 3 L</span>, solo el <span class="hl-rojo">6-7 %</span> del agua del cuerpo. En la mujer de 60 kg: 30 L de agua y 2 L de plasma.' },
      { id: 'cri-g2', corto: '1 L de salino', tipo: 'test', fuente: 'mar-osmosis · mar-salino · mar-fig-10-1', modelo: { aguaViva: 'salino' },
        enunciado: 'Predice, y luego lo compruebas en el modelo: vas a infundir 1 L de salino al 0,9 %. ¿Cuánto se quedará en el plasma, y por qué?',
        opciones: [
          { t: '1.000 mL: es isotónico y el sodio no sale de los vasos', porque: 'El sodio cruza el endotelio y se reparte por todo el extracelular. Si esperas 1 L en el vaso, repetirás bolos y lo que ganará el paciente será edema: 825 mL de cada litro van al intersticio.' },
          { t: '700 mL: el resto se va al intersticio', porque: 'Eso hace la albúmina al 5 %, cuyas moléculas grandes no cruzan la pared capilar. Con salino esperarías casi el triple de lo que da y te quedarías corto de volumen.' },
          { t: '275 mL: el sodio se reparte por todo el extracelular', ok: true }],
        explicacion: 'El sodio es el soluto extracelular principal y decide el volumen extracelular; se reparte por <span class="hl">todo el extracelular</span>, y el plasma es solo una parte pequeña de él. De 1 L: <span class="hl-rojo">275 mL al plasma y 825 al intersticio</span> (Figura 10.1).',
        nota: '<b>Nota de fuentes.</b> El libro da dos repartos distintos. La Figura 10.1 (cap. 10, <a class="biblio-link" href="docs/marino-2024-fluidoterapia-caps10-11.pdf#page=6" target="_blank" rel="noopener">PDF pág. 6</a>) muestra 275 mL al plasma por litro de salino (27,5 %); el cap. 11 (<a class="biblio-link" href="docs/marino-2024-fluidoterapia-caps10-11.pdf#page=26" target="_blank" rel="noopener">PDF pág. 26</a>) dice que el plasma es el 20 % del extracelular y que el 20 % del cristaloide va al plasma. Aquí se usa la figura; en Retorno venoso, el 20 %. No se elige ganadora.' },
      { id: 'cri-g3', corto: 'los 100 mL de más', tipo: 'destapa', fuente: 'mar-salino · mar-tabla-10-2', modelo: { aguaViva: 'salino' },
        enunciado: 'Sigue la cadena: 275 + 825 suman 1.100 mL, más de lo que infundiste. ¿De dónde sale lo que sobra?',
        puntos: [
          'El salino es <span class="hl">algo hipertónico</span>: 308 mOsm/L frente a 290 del plasma.',
          'Por eso <span class="hl-azul">saca agua de las células</span>: unos 100 mL pasan al extracelular.'],
        explicacion: 'La ficha: «el total (1.100 mL) supera lo infundido porque es algo hipertónico y saca agua de las células». En el río y mar, el mar de las células baja un poco.' },
      { id: 'cri-g4', corto: 'el cloro', tipo: 'test', fuente: 'mar-salino · mar-img-10-2 · mar-tabla-10-2', modelo: [{ aguaViva: 'salino' }, { acidobaseVivo: 'paso-3' }],
        enunciado: 'Frente al plasma, el salino lleva algo más de sodio (154 frente a 140) y mucho más cloro (154 frente a 103). Si lo das deprisa, a 30 mL/kg/h, ¿qué le pasa al pH, y qué cambia con Ringer lactato al mismo ritmo?',
        opciones: [
          { t: 'Baja de 7,41 a 7,28; con Ringer no cambia', ok: true },
          { t: 'Se mantiene: el salino es «fisiológico»', porque: 'No es normal ni química ni fisiológicamente: su pH es 5,7 y su cloro, 154. Si lo crees neutro, darás litros a un paciente que irá acumulando una acidosis metabólica hiperclorémica sin que la busques.' },
          { t: 'Baja igual con los dos: es un efecto del volumen', porque: 'En la Figura 10.2 el pH no cambió con Ringer al mismo ritmo. El culpable es el cloro (154 frente a 109), no el volumen: cambiar de cristaloide sí protege al paciente.' }],
        explicacion: 'Figura 10.2: con salino, el pH bajó de <span class="hl-rojo">7,41 a 7,28</span>; con Ringer lactato (Cl⁻ 109) no cambió. Es una <span class="hl-rojo">acidosis metabólica hiperclorémica</span>: «lo que más importa es el cloro». Por eso el salino ha perdido popularidad, por ejemplo en la cetoacidosis diabética.' },
      { id: 'cri-g5', corto: 'el lactato tampona', tipo: 'destapa', fuente: 'mar-ringer',
        enunciado: 'El Ringer lactato lleva 28 mmol/L de lactato, y el lactato no se une a los H⁺ de la sangre. ¿Cómo puede entonces hacer de tampón?',
        puntos: [
          'El <span class="hl">hígado</span> convierte el lactato en glucosa, y esa reacción <span class="hl-azul">consume H⁺</span> (2 lactato + 2 H⁺ → glucosa).',
          'Los H⁺ los da el agua: quedan <span class="hl-azul">OH⁻, que con el CO₂ forman bicarbonato</span>.',
          'Balance: <span class="hl">cada mmol de lactato genera un mmol de bicarbonato</span>.'],
        explicacion: 'Y su cloro (109) se parece al del plasma (103): por eso el Ringer <span class="hl-verde">no produce acidosis hiperclorémica</span>.' },
      { id: 'cri-g6', corto: 'salino al 7,5 %', tipo: 'test', fuente: 'mar-hipertonico · mar-fig-10-1', modelo: { aguaViva: 'hipertonico' },
        enunciado: 'Predice: 250 mL de salino al 7,5 % (2.567 mOsm/L, 9 veces el plasma). ¿Cuánto crecerá el extracelular, y de dónde sale ese agua?',
        opciones: [
          { t: 'Lo mismo que lo infundido: 250 mL, ni uno más', porque: 'Un líquido hipertónico arrastra agua de dentro de las células. Si esperas solo 250 mL, subestimas su efecto y puedes repetir dosis sin necesidad.' },
          { t: 'Unos 1.235 mL (5 veces lo infundido), de las células', ok: true },
          { t: 'Unos 1.235 mL, pero el agua sale del intersticio, como con la albúmina al 25 %', porque: 'El intersticio no pierde: gana (+700 mL en la Figura 10.1). El agua viene de las células; si crees que la saca del intersticio, no ves que lo que encoge son las células.' }],
        explicacion: 'Figura 10.1: <span class="hl">+535 mL al plasma y +700 al intersticio</span>; el agua viene de las células. En animales con hemorragia mantuvo el gasto con 1/5 del volumen del salino isotónico (Figura 10.3).' },
      { id: 'cri-g7', corto: 'glucosado al 5 %', tipo: 'test', fuente: 'mar-glucosado-volumen · mar-fig-10-1', modelo: { aguaViva: 'glucosado' },
        enunciado: 'Última de la cadena: el glucosado al 5 % tiene 278 mOsm/L, casi como el plasma. Predice: ¿dónde acaba 1 L?',
        opciones: [
          { t: 'Como el salino: 275 mL en el plasma y 825 en el intersticio', porque: 'La glucosa no se queda fuera como el sodio: entra en las células y se metaboliza, y el agua la sigue. Si lo usas para expandir, el paciente apenas gana plasma (100 mL) y sus células se hinchan.' },
          { t: 'Casi todo en el plasma: es isosmótico', porque: 'Es isosmótico en la bolsa, pero en cuanto la glucosa se metaboliza solo queda agua, que va sobre todo a las células: edema celular, no volemia.' },
          { t: 'Dos tercios dentro de las células; unos 100 mL en el plasma', ok: true }],
        explicacion: 'De 1 L, solo unos <span class="hl">350 mL quedan fuera de las células</span> (100 en el plasma, Figura 10.1); <span class="hl-rojo">dos tercios acaban dentro</span>: edema celular.' },
    ],
    examen: [
      { id: 'cri-e1', corto: '¿«normal»?', tipo: 'test', fuente: 'mar-salino · mar-tabla-10-2',
        enunciado: 'El adjunto dice: «el salino al 0,9 % es suero fisiológico; por eso se llama normal». ¿Qué le respondes con la ficha en la mano?',
        opciones: [
          { t: 'Que tiene razón: es isotónico con el plasma', porque: 'No es normal ni químicamente (una solución 1 N tendría 58 g/L; esta lleva 9) ni fisiológicamente: 308 mOsm, pH 5,7 y Cl⁻ 154. Tratarlo como «normal» es darle cloro de más sin vigilar la acidosis.' },
          { t: 'Que no lo es, y que lo que más pesa es su sodio (154 frente a 140)', porque: 'Lleva más sodio, pero la ficha dice que lo que más importa es el cloro: de él vienen la acidosis hiperclorémica y la vasoconstricción renal. Si vigilas el sodio y no el cloro, se te escapa el daño.' },
          { t: 'Que no lo es: lo que más pesa es su cloro (154 frente a 103)', ok: true },
          { t: 'Que no lo es, y que lo que más pesa es su pH de 5,7', porque: 'Es ácido, pero según Marino lo que más importa es el cloro: es lo que baja el pH del paciente (Figura 10.2). Fijarte en el pH de la bolsa no te dice cuándo parar.' }],
        explicacion: 'Frente al plasma: <span class="hl">Na⁺ 154 frente a 140, Cl⁻ 154 frente a 103</span>, 308 frente a 290 mOsm y pH 5,7 frente a 7,4. «Lo que más importa es el <span class="hl-rojo">cloro</span>». El nombre viene de Hartog Hamburger, que creyó por error que el plasma era salino al 0,9 % (es al 0,6 %).' },
      { id: 'cri-e2', corto: 'salino y riñón', tipo: 'test', fuente: 'mar-salino',
        enunciado: 'Un paciente lleva tres días con salino al 0,9 % y su creatinina ha subido. Si es por el salino, ¿qué esperas según Marino?',
        opciones: [
          { t: 'Necrosis tubular por la sobrecarga de sodio: suele acabar en diálisis', porque: 'El mecanismo que da la ficha es la vasoconstricción renal por el cloro, y ese fracaso suele ser leve y sin diálisis. Pensar en diálisis lleva a alarmarse y a tratar de más.' },
          { t: 'Vasoconstricción renal por el cloro; suele ser leve, sin diálisis', ok: true },
          { t: 'Nada: el salino no se ha relacionado con el riñón', porque: 'Sí: con estrategias restrictivas en cloro (Ringer, Plasma-Lyte) hay menos fracaso renal agudo. Seguir con salino sin pensarlo mantiene la causa.' }],
        explicacion: 'Lesión renal por <span class="hl-azul">vasoconstricción renal mediada por cloro</span>. Con estrategias restrictivas en cloro hay menos fracaso renal agudo, aunque el del salino <span class="hl">suele ser leve y no requiere diálisis</span>.' },
      { id: 'cri-e3', corto: 'hipertónico en el TCE', tipo: 'test', fuente: 'mar-hipertonico',
        enunciado: 'TCE con una PIC de 26 mmHg. Eliges salino al 10 % en lugar de manitol. ¿Qué dosis equivale a 2 mL/kg de manitol al 20 %, y hasta cuándo puedes repetir bolos?',
        opciones: [
          { t: '2 mL/kg, como el manitol; bolos hasta que la PIC baje de 20', porque: 'Con salino al 10 %, 2 mL/kg es más de 3 veces la dosis equivalente: le darías una carga de sodio muy superior a la buscada. Y el límite para seguir no es la PIC sino la osmolalidad.' },
          { t: '0,6 mL/kg; bolos cada 6-8 h mientras la osmolalidad sea <320', ok: true },
          { t: '0,6 mL/kg; bolos cada 6-8 h mientras el sodio sea menor de 160', porque: 'La dosis es buena, pero la ficha no da un tope de sodio: el límite es la osmolalidad <320. Con un tope que no está en la fuente podrías parar antes de tiempo o pasarte.' }],
        explicacion: 'El 10 % es popular: <span class="hl">0,6 mL/kg equivalen a 2 mL/kg de manitol al 20 %</span>. Bolos cada 6-8 h para mantener la PIC <20 mmHg mientras la osmolalidad sea <span class="hl-rojo"><320</span>. Baja la PIC como el manitol, mantiene mejor la presión de perfusión cerebral y evita el daño renal del manitol; ninguno de los dos ha mejorado la supervivencia del TCE.' },
      { id: 'cri-e4', corto: 'hipertónico en el trauma', tipo: 'test', fuente: 'mar-hipertonico · mar-img-10-3',
        enunciado: 'En animales con hemorragia, el salino hipertónico mantuvo el gasto con 1/5 del volumen del isotónico. Un compañero propone usarlo en la reanimación prehospitalaria del politrauma «porque salva más vidas». ¿Qué dice la ficha?',
        opciones: [
          { t: 'Que sí: con menos volumen, menos edema y más supervivencia', porque: 'Es lo que hacían esperar los animales, pero en el trauma no se ha demostrado. Elegirlo por ese motivo no le da al paciente ninguna ventaja probada.' },
          { t: 'Que en el trauma no ha mostrado mejor supervivencia', ok: true },
          { t: 'Que está contraindicado en el trauma por el sodio', porque: 'La ficha no lo contraindica: dice que no mejora la supervivencia. Su uso principal es otro, bajar la PIC en el TCE: si lo crees prohibido, se lo negarías a quien sí le sirve.' }],
        explicacion: 'Expande mucho con poco volumen (Figura 10.3), y por eso parecía ideal para reanimar con poco volumen; pero en el trauma <span class="hl-rojo">no ha mostrado mejor supervivencia</span> que los cristaloides isotónicos.' },
      { id: 'cri-e5', corto: 'glucosalino', tipo: 'test', fuente: 'mar-glucosado-volumen',
        enunciado: 'Un posoperado con la glucosa mal controlada recibe glucosalino (glucosado al 5 % en salino al 0,9 %). ¿Qué les puede pasar a sus células?',
        opciones: [
          { t: 'Se hinchan, porque la glucosa acaba dentro, como con el glucosado al 5 %', porque: 'El glucosalino tiene 560 mOsm/L, casi el doble que el plasma: si la glucosa no se usa bien, saca agua de las células en vez de meterla. Esperarías edema y te encontrarías deshidratación celular.' },
          { t: 'Se deshidratan, si no usa bien la glucosa: son 560 mOsm/L', ok: true },
          { t: 'Nada: el salino y la glucosa se reparten y se compensan', porque: 'Sumados dan 560 mOsm/L. Si la glucosa no entra en las células, ese exceso osmótico se queda fuera y las deshidrata: no hay nada que lo compense.' }],
        explicacion: 'El glucosalino tiene <span class="hl">560 mOsm/L</span>, casi el doble que el plasma: si no se usa bien la glucosa (algo frecuente en el crítico, <a class="biblio-link" href="docs/marino-2024-fluidoterapia-caps10-11.pdf#page=11" target="_blank" rel="noopener">PDF pág. 11</a>), <span class="hl-rojo">deshidrata las células</span>. Es lo contrario del glucosado al 5 %, que las hincha.' },
      { id: 'cri-e6', corto: 'los apuntes', tipo: 'error', fuente: 'mar-osmosis · mar-oncotica · mar-tabla-10-1 · mar-glucosado-volumen',
        enunciado: 'Apuntes que un compañero ha pasado al grupo de residentes. Encuentra los errores.',
        frases: [
          { t: 'El sodio es el principal soluto extracelular y el principal determinante del volumen extracelular.' },
          { t: 'La fuerza osmótica depende del tamaño de las partículas: por eso la albúmina mueve más agua que el sodio.', mal: true,
            c: 'Cuenta el <span class="hl">número</span> de partículas, no su tamaño ni su carga. La albúmina retiene agua en el vaso por otra razón: es una molécula grande que no cruza el endotelio (presión oncótica).' },
          { t: 'El plasma es un 93 % agua: por eso osmolaridad y osmolalidad se usan casi como sinónimos.' },
          { t: 'El plasma es el 20 % del extracelular y solo el 6-7 % del agua del cuerpo.' },
          { t: 'De 1 L de glucosado al 5 %, unos 350 mL se quedan en el plasma.', mal: true,
            c: 'Unos 350 mL quedan <span class="hl">fuera de las células</span> (plasma más intersticio); en el plasma, solo 100 mL. Dos tercios acaban dentro de las células.' }],
        explicacion: 'La presión oncótica la hacen las moléculas grandes que no cruzan el endotelio, sobre todo la albúmina: es lo que retiene agua en los vasos.' },
    ],
    casos: [
      { id: 'd1', titulo: 'Ramón, 50 años: el lactato que no era', corto: 'Caso · Ramón', sub: 'pancreatitis aguda, 80 kg',
        paciente: { Edad: '50 años', Peso: '80 kg', Motivo: 'Pancreatitis aguda; vómitos desde hace 2 días' },
        pasos: [
          { momento: 'Urgencias · hora 0', datos: { PA: '90/55 mmHg', Exploración: 'mucosas secas: deshidratado' }, nuevo: ['PA', 'Exploración'],
            pregunta: { id: 'd1-1', tipo: 'test', fuente: 'mar-fluido-a-medida · mar-salino · mar-ringer', modelo: { aguaViva: 'ringer' },
              enunciado: 'Ramón está deshidratado: ha perdido líquido de todo el extracelular. ¿Con qué cristaloide empiezas, y por qué?',
              opciones: [
                { t: 'Salino al 0,9 %, porque es el que llaman suero fisiológico', porque: 'Su cloro (154) le daría una acidosis hiperclorémica a medida que sumara litros, y más riesgo de lesión renal que un cristaloide restrictivo en cloro.' },
                { t: 'Ringer lactato: su cloro se parece al del plasma', ok: true },
                { t: 'Glucosado al 5 %: así no le doy más sodio ni más cloro', porque: 'Dos tercios acabarían dentro de las células: apenas repondría su extracelular. Y con compromiso hemodinámico, hasta el 85 % de la glucosa acaba en lactato.' }],
              explicacion: 'Para la hipovolemia por deshidratación (pérdida uniforme del extracelular), el autor propone <span class="hl">un cristaloide, p. ej. Ringer lactato</span>. Su cloro, 109 frente a 103 del plasma: <span class="hl-verde">sin acidosis hiperclorémica</span>.' } },
          { momento: 'Hora 1', datos: { Fluidos: 'bolo de Ringer lactato, 30 mL/kg' }, nuevo: ['Fluidos'],
            pregunta: { id: 'd1-2', tipo: 'test', fuente: 'mar-ringer · mar-tabla-10-2', origen: 'ficha · la cuenta, del caso',
              enunciado: 'Calcula: ¿cuántos mL son, cuánto lactato lleva el bolo (Ringer: 28 mmol/L), y cuánto aclara su hígado en una hora?',
              opciones: [
                { t: '2.400 mL con 672 mmol: más de 6 horas de aclaramiento', porque: 'Es un error de coma: 2,4 L × 28 mmol/L = 67 mmol. Con esa cuenta pararías el Ringer y le dejarías sin volumen por miedo a un lactato que no va a subir.' },
                { t: '800 mL con 22 mmol; el hígado aclara unos 10 mmol/h', porque: '30 mL/kg en 80 kg son 2.400 mL, no 800: le darías un tercio del volumen. Y el hígado aclara unos 100 mmol/h, el equivalente a 3,5 L de Ringer por hora.' },
                { t: '2.400 mL y 67 mmol; el hígado aclara ≈100 mmol/h', ok: true }],
              explicacion: '80 kg × 30 mL/kg = <span class="hl">2.400 mL</span>; 2,4 L × 28 mmol/L = <span class="hl">67 mmol</span> de lactato. El hígado aclara unos <span class="hl-verde">100 mmol/h</span> (3,5 L de Ringer por hora). En voluntarios sanos, 30 mL/kg en bolo subieron el lactato solo 0,9 mmol/L, igual que el salino. En el crítico con shock o insuficiencia hepática no se ha estudiado.' } },
          { momento: 'Hora 4', datos: { Vía: 'CVC; Ringer a 250 mL/h por la luz distal', Lactato: '4,1 mmol/L (sacado por la luz distal)' }, nuevo: ['Vía', 'Lactato'],
            pregunta: { id: 'd1-3', tipo: 'test', fuente: 'mar-ringer',
              enunciado: 'El control de lactato da 4,1 mmol/L. La muestra se sacó por la misma luz por la que pasa el Ringer. ¿Qué haces?',
              opciones: [
                { t: 'Cambiar el Ringer por salino: le está subiendo el lactato', porque: 'La sangre sacada por el catéter de la infusión de Ringer da lactatos falsamente altos. Cambiarías a salino por una cifra falsa y le darías el cloro que querías evitar.' },
                { t: 'Repetirlo de otro sitio, no de la vía del Ringer', ok: true },
                { t: 'Tratarlo como hipoperfusión y subir el ritmo de fluidos', porque: 'Antes de creer el 4,1 hay que saber de dónde salió: por la vía del Ringer el lactato sale falsamente alto. Le darías volumen por un dato falso.' }],
              explicacion: '<span class="hl-rojo">Ojo</span>: la sangre extraída por el catéter por el que pasa el Ringer da <span class="hl-rojo">lactatos falsamente altos</span>; hay que sacarla de otro sitio.' } },
          { momento: 'Hora 4 · el plan del R1', datos: { 'K⁺': '5,4 mEq/L' }, nuevo: ['K⁺'],
            pregunta: { id: 'd1-4', tipo: 'error', fuente: 'mar-ringer · mar-salino',
              enunciado: 'Antes de repetir el lactato, el R1 de guardia escribe este plan. Encuentra los errores.',
              frases: [
                { t: 'El Ringer le ha subido el lactato a 4,1: lo cambio por salino al 0,9 %.', mal: true,
                  c: 'El 4,1 salió por la vía del Ringer: es <span class="hl-rojo">falsamente alto</span>. Hay que repetirlo de otro sitio; y el salino le traería el cloro que se quería evitar.' },
                { t: 'Cada mmol de lactato del Ringer acaba dando un mmol de bicarbonato.' },
                { t: 'Con un K⁺ de 5,4, retiro el Ringer por el potasio que lleva.', mal: true,
                  c: 'Su potasio (4 mEq/L) <span class="hl">no preocupa</span>: no hay casos documentados de que el Ringer empeore una hiperpotasemia, que es más probable con salino, por la acidosis.' },
                { t: 'El hígado aclara unos 100 mmol/h de lactato, lo que llevan 3,5 L de Ringer.' },
                { t: 'Cuánto sube el lactato con el Ringer en el crítico en shock no se ha estudiado.' }],
              explicacion: 'Dos confusiones reales: culpar al Ringer de un lactato mal sacado, y retirar un suero por un potasio que no preocupa.' } },
          { momento: 'Hora 5 · el giro', datos: { Lactato: '1,6 mmol/L (repetido por una vía periférica del otro brazo)' }, nuevo: ['Lactato'],
            pregunta: { id: 'd1-5', tipo: 'destapa', fuente: 'mar-ringer · mar-tabla-10-2', modelo: { acidobaseVivo: 'paso-3', texto: 'Mira la acidosis del cloro en el ácido-base vivo' },
              enunciado: 'El lactato repetido da 1,6. La enfermera pregunta por qué no te fiabas del primero y por qué sigues con Ringer. Son tres cosas.',
              puntos: [
                'La sangre sacada por <span class="hl-rojo">la vía del Ringer</span> da lactatos falsamente altos.',
                'Su lactato es un tampón: <span class="hl-azul">cada mmol da un mmol de bicarbonato</span> en el hígado.',
                'Su cloro (<span class="hl">109</span>, frente a 103 del plasma) no da acidosis hiperclorémica; el del salino (154), sí.'],
              explicacion: 'El Ringer lleva 28 mmol/L de lactato, pero el hígado aclara unos 100 mmol/h: un bolo de 30 mL/kg lo sube poco (0,9 mmol/L en sanos).' } },
          { momento: 'Día 2', datos: { Hb: '7,0 g/dL', Plan: 'el equipo decide transfundir 1 concentrado de hematíes' }, nuevo: ['Hb', 'Plan'],
            pregunta: { id: 'd1-6', tipo: 'test', fuente: 'mar-ringer · mar-tabla-10-2',
              enunciado: 'La enfermera va a pasar el concentrado de hematíes por la misma línea del Ringer, «para que corra mejor». Según Marino, ¿qué le dices?',
              opciones: [
                { t: 'Adelante: el Ringer no lleva calcio', porque: 'Sí lleva calcio (3 mEq/L de calcio iónico, Tabla 10.2), y ese calcio puede unirse al citrato de los hematíes y favorecer coágulos en la línea.' },
                { t: 'Mejor evitarlo si se puede: su calcio puede unirse al citrato', ok: true },
                { t: 'Adelante: hay estudios que dicen que mezclarlos es seguro', porque: 'Los hay, y la recomendación no tiene apoyo experimental, pero Marino concluye que aun así es mejor evitarlo si se puede: arriesgas un coágulo en la línea sin necesidad.' }],
              explicacion: 'El calcio del Ringer puede unirse al citrato anticoagulante de los concentrados y favorecer coágulos: <span class="hl">no se aconseja como diluyente de la transfusión</span>. La recomendación no tiene apoyo experimental (hay estudios que lo ven seguro), pero aun así mejor evitarlo.' } },
          { momento: 'Día 2 · dieta absoluta', datos: { Dieta: 'absoluta' }, nuevo: ['Dieta'],
            pregunta: { id: 'd1-7', tipo: 'test', fuente: 'mar-glucosado-calorias · mar-glucosado-lactato · mar-img-10-4', modelo: { aguaViva: 'glucosado' },
              enunciado: 'El R1 propone añadir 3 L de glucosado al 5 % al día «para darle calorías» mientras no come. ¿Qué opinas?',
              opciones: [
                { t: 'Bien: 510 kcal al día ahorran proteínas', porque: 'Es la cuenta del ahorro de proteínas, pero ya no hace falta: quien no come recibe nutrición completa. Y si se inestabiliza, hasta el 85 % de esa glucosa acabaría en lactato.' },
                { t: 'Bien, pero solo 1 L: con 170 kcal basta para ahorrar proteínas', porque: '170 kcal es lo que da 1 L; para ahorrar proteínas hacían falta 3 L (510 kcal). Y de todos modos ya no se hace: el glucosado le daría lactato y edema celular, no nutrición.' },
                { t: 'No: si no come, nutrición completa; y si se inestabiliza, la glucosa da lactato', ok: true }],
              explicacion: '1 L de glucosado al 5 % da <span class="hl">170 kcal</span>; 3 L, 510, suficientes para ahorrar proteínas, pero <span class="hl">ya no hace falta</span>: quien no come recibe nutrición completa. En el paciente con compromiso hemodinámico, <span class="hl-rojo">hasta el 85 %</span> de la glucosa acaba en lactato (el 5 % en el sano; Figura 10.4).' } },
        ],
        lleva: [
          'Un lactato sacado por la vía del Ringer puede ser falso: repítelo de otro sitio antes de cambiar nada.',
          'El Ringer no da acidosis hiperclorémica (Cl⁻ 109), su lactato tampona (1 mmol da 1 mmol de bicarbonato) y su potasio no preocupa.',
          'El glucosado al 5 % ya no sirve para alimentar: acaba en las células y, con compromiso hemodinámico, en lactato.'],
        volver: { nombre: 'Ringer lactato', ancla: 'mar-ringer', modelo: { aguaViva: 'ringer' } } },
    ],
    profundizar: [
      { id: 'mar-ringer-acetato', titulo: 'Ringer acetato y soluciones «equilibradas» (Normosol®, Plasma-Lyte®)' },
      { id: 'mar-glucosado-hiperglucemia', titulo: 'Glucosados e hiperglucemia' },
      { id: 'mar-fluidos-historia', titulo: 'Historia: de la pluma de ganso de Wren a los sueros' },
    ],
  },

  /* =================================================================================================
     XXI · Coloides y el debate coloide-cristaloide (F págs. 12-20)
     ================================================================================================= */
  'mar-coloides': {
    entrada: 'Qué retiene el agua en el vaso, por qué la albúmina al 25 % mueve y no repone, qué pasa con los almidones y por qué no hay un fluido para todo.',
    guia: [
      { id: 'col-g1', corto: 'qué retiene el agua', tipo: 'test', fuente: 'mar-oncotica · mar-coloide-definicion · mar-albumina',
        enunciado: 'El sodio cruza la pared capilar y se reparte por todo el extracelular. Entonces, ¿qué retiene el agua dentro del vaso, y quién hace la mayor parte?',
        opciones: [
          { t: 'El sodio: hay más en el plasma que en el intersticio', porque: 'El sodio se reparte por todo el extracelular: si contaras con él para retener agua en el vaso, esperarías del salino mucho más volumen del que da (275 mL por litro).' },
          { t: 'La presión oncótica; la albúmina hace el 80 %', ok: true },
          { t: 'La glucosa, que tarda en salir del vaso', porque: 'La glucosa entra en las células y se metaboliza: de 1 L de glucosado solo 100 mL se quedan en el plasma. Confiar en ella para sostener el volumen deja al paciente sin volemia y con edema celular.' }],
        explicacion: 'La presión coloidosmótica (<span class="hl-purpura">oncótica</span>) la ejercen las moléculas grandes que no cruzan el endotelio, sobre todo las proteínas; la <span class="hl">albúmina hace el 80 %</span>. Clínicamente, un coloide es un fluido con esas moléculas grandes.' },
      { id: 'col-g2', corto: 'albúmina frente a salino', tipo: 'test', fuente: 'mar-coloide-definicion · mar-fig-10-1', modelo: { aguaViva: 'albumina5' },
        enunciado: 'Predice, y luego compruébalo en el modelo: 1 L de albúmina al 5 % frente a 1 L de salino al 0,9 %. ¿Cuánto añade cada uno al plasma?',
        opciones: [
          { t: 'Los dos 1.000 mL al principio: ambos son isotónicos con el plasma', porque: 'El salino deja 275 mL en el plasma; solo la albúmina se queda en buena parte (700 mL). Si esperas lo mismo de los dos, con salino reanimarás corto y con más edema.' },
          { t: 'Albúmina 700 mL; salino 275: unas 3 veces más', ok: true },
          { t: 'Albúmina 1.000 mL y salino 500: el doble', porque: 'La albúmina al 5 % pone 300 de sus 1.000 mL en el intersticio, y el salino solo 275 en el plasma. Con esas cifras calcularías mal el volumen que necesita.' }],
        explicacion: 'Albúmina al 5 %: <span class="hl-verde">700 mL al plasma</span> y 300 al intersticio; salino: 275 y 825 (Figura 10.1). Con un coloide se consigue el mismo aumento de plasma con <span class="hl">un 30 %</span> del volumen de cristaloide.' },
      { id: 'col-g3', corto: 'más oncótica que el plasma', tipo: 'test', fuente: 'mar-tabla-10-3',
        enunciado: 'La oncótica del plasma es de unos 28 mmHg; la de la albúmina al 25 %, de 70. ¿Qué le pasa al plasma cuando infundes un fluido con más oncótica que él?',
        opciones: [
          { t: 'Crece más que lo infundido: 3-4 veces con la albúmina al 25 %', ok: true },
          { t: 'Crece lo mismo que lo infundido: un coloide no saca agua de ningún sitio', porque: 'Si su oncótica supera la del plasma, tira de agua de fuera del vaso. Si no lo esperas, la subida de volemia (y de presión) te sorprenderá, y le quitarás agua al intersticio sin contarla.' },
          { t: 'Crece menos que lo infundido, porque parte se va al intersticio', porque: 'Eso pasa con los fluidos de oncótica parecida o menor que el plasma, como la albúmina al 5 % (20 mmHg). Con la de 25 % el plasma gana 3-4 veces lo infundido: repetirías dosis de más.' }],
        explicacion: 'A más presión oncótica, más expansión; y si supera la del plasma (≈28 mmHg), <span class="hl">el plasma crece más que lo infundido</span>. La albúmina al 25 %, con 70 mmHg (2,5 veces el plasma), lo expande <span class="hl">3-4 veces</span> su volumen (Tabla 10.3).' },
      { id: 'col-g4', corto: 'de dónde sale', tipo: 'test', fuente: 'mar-albumina', modelo: { aguaViva: 'albumina25' },
        enunciado: 'Sigue la cadena: 100 mL de albúmina al 25 % suben el plasma 300-400 mL. ¿De dónde sale el agua que sobra?',
        opciones: [
          { t: 'De las células, como con el salino hipertónico', porque: 'La albúmina tira con presión oncótica a través de la pared capilar: el agua sale del intersticio. Si crees que viene de las células, no verás que deja más seco un intersticio que quizá ya ha perdido líquido.' },
          { t: 'Del propio vial, que aporta más agua de la que parece', porque: 'El vial lleva 100 mL; los otros 200-300 los saca del intersticio. Creer que aporta volumen lleva a usarla para reponer pérdidas, y no sirve para eso.' },
          { t: 'Del intersticio: la mueve de sitio, no la repone', ok: true }],
        explicacion: 'Expande el plasma <span class="hl">sacando agua del intersticio</span>: el intersticio baja mientras el plasma sube. <span class="hl-rojo">No repone pérdidas, solo mueve líquido</span>.' },
      { id: 'col-g5', corto: '¿al que sangra?', tipo: 'destapa', fuente: 'mar-albumina · mar-cristaloide-historia',
        enunciado: 'Entonces, ¿le pondrías albúmina al 25 % a un paciente que sangra? Piensa por qué.',
        puntos: [
          'No: <span class="hl-rojo">no repone lo perdido</span>, solo mueve agua del intersticio al plasma; no es un fluido de reanimación de pérdidas.',
          'Y en la hemorragia el intersticio ya ha cedido líquido a la sangre (hay un <span class="hl">déficit intersticial</span>): le quitarías todavía más <em>(inferencia, conocimiento general: el libro solo dice que no repone pérdidas)</em>.'],
        explicacion: 'Se usa para subir rápido el plasma (y la presión) en pacientes con edemas, sobre todo por hipoalbuminemia. Toda albúmina expande más si hay hipoalbuminemia.' },
      { id: 'col-g6', corto: 'por qué cristaloides', tipo: 'test', fuente: 'mar-cristaloide-historia',
        enunciado: 'Durante décadas, la hemorragia se repuso con cristaloides. ¿De qué observación salió esa costumbre?',
        opciones: [
          { t: 'En animales: solo sangre, casi todos morían; con Ringer, menos', ok: true },
          { t: 'En ensayos con pacientes, los coloides daban más mortalidad', porque: 'La ficha no dice que los coloides maten más: dice que no han demostrado beneficio de supervivencia. Creer que son peligrosos lleva a descartarlos donde suben mejor el gasto.' },
          { t: 'Porque el cristaloide subía el gasto cardíaco más que el coloide', porque: 'Es al revés: 500 mL de dextrano-40 subieron el gasto el triple que 1 L de Ringer. Con esa idea darías más litros y más edema para menos gasto.' }],
        explicacion: 'En la hemorragia hay un <span class="hl">déficit intersticial</span>: el líquido pasa del intersticio a la sangre. En animales, reponer solo la sangre perdida era casi siempre mortal, y añadir Ringer lactato reducía la mortalidad: se concluyó que <span class="hl">reponer el intersticio era clave</span>.' },
      { id: 'col-g7', corto: 'el gasto', tipo: 'test', fuente: 'mar-coloide-gasto',
        enunciado: 'Hoy lo que se busca al dar volumen es el gasto cardíaco. Predice: 500 mL de dextrano-40 al 10 % frente a 1 L de Ringer lactato, ¿cuál sube más el gasto?',
        opciones: [
          { t: 'El Ringer: el doble de volumen, el doble de gasto', porque: 'De cada litro de Ringer solo una parte pequeña se queda en el plasma. Si eliges por volumen infundido, le das más litros, más edema y menos gasto.' },
          { t: 'Los dos igual: el gasto depende del corazón, no del fluido', porque: 'Depende de cuánto plasma se expande, y el coloide lo expande más. Con esa idea elegirías sin saber que el coloide sube el gasto el triple.' },
          { t: 'El dextrano: el triple, con la mitad de volumen', ok: true }],
        explicacion: 'En un estudio, 500 mL de dextrano-40 al 10 % subieron el gasto <span class="hl">el triple</span> que 1 L de Ringer: reflejo de la mayor expansión del plasma.' },
    ],
    examen: [
      { id: 'col-e1', corto: 'el que más expande', tipo: 'test', fuente: 'mar-tabla-10-3',
        enunciado: 'Tabla 10.3. Por cada mL infundido, ¿qué coloide expande más el plasma?',
        opciones: [
          { t: 'Hetastarch al 6 %: es de los que más duran (24 h)', porque: 'Dura, pero expande 1,0-1,3 veces su volumen: duración no es potencia. Si lo eliges por potente, necesitarás más volumen del que crees.' },
          { t: 'Dextrano-40 al 10 %: 40 mmHg de oncótica', porque: '40 mmHg supera al plasma, pero expande 1,0-1,5 veces. Esperarías de él más de lo que da: la que más expande es la albúmina al 25 %.' },
          { t: 'Albúmina al 25 %, con 70 mmHg de oncótica', ok: true },
          { t: 'Albúmina al 5 %, la más parecida al plasma', porque: 'Precisamente por parecerse al plasma (20 mmHg) expande 0,7-1,3 veces lo infundido: no la que más. Contarías con más volumen del que vas a tener.' }],
        explicacion: 'Δ plasma / volumen infundido: <span class="hl">albúmina 25 % 3,0-4,0</span>; dextrano-40 1,0-1,5; hetastarch 1,0-1,3; albúmina 5 % 0,7-1,3. Manda la oncótica: 70, 40, 30 y 20 mmHg (plasma 28).' },
      { id: 'col-e2', corto: 'cuánto dura', tipo: 'test', fuente: 'mar-nota-albumina-duracion · mar-tabla-10-3 · mar-albumina',
        enunciado: '¿Cuánto dura el efecto de 250 mL de albúmina al 5 % sobre el volumen plasmático, según Marino?',
        opciones: [
          { t: '24 h, como dice la Tabla 10.3, sin discrepancias', porque: 'La tabla da 24 h, pero el texto del mismo capítulo dice que se empieza a perder a las 6 h y suele haberse perdido a las 12. Si cuentas con 24 h, el paciente puede volver a estar hipovolémico antes de lo que esperabas.' },
          { t: '6-12 h según el texto; la Tabla 10.3 dice 24 h', ok: true },
          { t: '2-3 h: como un cristaloide, se va enseguida', porque: 'Ni la tabla ni el texto dan algo así: el efecto dura al menos 6 h. Pensar que dura tan poco lleva a repetir dosis de más.' }],
        explicacion: 'Texto: el efecto <span class="hl">empieza a disiparse a las 6 h y suele perderse a las 12 h</span>. Tabla 10.3: 24 h. El capítulo no las concilia.',
        nota: '<b>Nota de fuentes.</b> La Tabla 10.3 da 24 h a la albúmina al 5 %; el texto (<a class="biblio-link" href="docs/marino-2024-fluidoterapia-caps10-11.pdf#page=13" target="_blank" rel="noopener">PDF pág. 13</a>), 6-12 h. Se muestran las dos: no se elige ganadora.' },
      { id: 'col-e3', corto: 'hetastarch y tetrastarch', tipo: 'test', fuente: 'mar-hes · mar-tabla-10-5',
        enunciado: 'Hetastarch (450 kD, sustitución 0,7) frente a tetrastarch (130 kD, sustitución 0,4). ¿Qué es cierto?',
        opciones: [
          { t: 'El tetrastarch dura más, porque al tener menos sustitución el riñón lo elimina más despacio', porque: 'Es al revés: más sustitución (y más peso) = más duración. El tetrastarch dura 6 h o menos: si cuentas con que dure más, el paciente se te queda corto de volumen.' },
          { t: 'Hetastarch: dura más y sangra más; tetrastarch: coagulopatía solo >50 mL/kg', ok: true },
          { t: 'Ninguno altera la hemostasia: su único problema es el riñón', porque: 'Inhiben el factor VII, el de von Willebrand y la adhesión plaquetaria, sobre todo los de alta sustitución: con hetastarch hay más sangrado y más transfusión perioperatorios.' }],
        explicacion: 'Más sustitución molar = <span class="hl">más duración, pero más efectos adversos</span>. Hetastarch: hasta 24 h, más sangrado y transfusión perioperatorios (inhibe el factor VII, el de von Willebrand y la adhesión plaquetaria). Tetrastarch: 6 h o menos y <span class="hl">sin coagulopatía relevante hasta >50 mL/kg</span>.' },
      { id: 'col-e4', corto: 'HES y riñón', tipo: 'test', fuente: 'mar-hes',
        enunciado: '¿Qué concluye Marino sobre los hidroxietilalmidones y el fracaso renal agudo?',
        opciones: [
          { t: 'Que no está resuelto: los estudios no son comparables', ok: true },
          { t: 'Que cualquier HES es nefrotóxico, sea cual sea el paciente', porque: 'La asociación con fracaso renal y muerte salió sobre todo de estudios con hetastarch en pacientes en shock; con tetrastarch en cirugía abdominal no la hay. Generalizarla no se apoya en la ficha.' },
          { t: 'Que el tetrastarch es seguro también en el shock', porque: 'La ausencia de asociación es en cirugía abdominal, con pacientes menos graves. Extrapolarla al shock expone al paciente a un riesgo que nadie ha descartado.' }],
        explicacion: 'Muchos estudios con asociación a <span class="hl-rojo">fracaso renal y muerte</span> usaban hetastarch en pacientes en shock; con tetrastarch en cirugía abdominal no la hay. Hoy es <span class="hl">una cuestión no resuelta</span>.' },
      { id: 'col-e5', corto: 'el debate', tipo: 'test', fuente: 'mar-coloide-gasto',
        enunciado: 'Si los coloides suben mejor el gasto, ¿por qué los cristaloides siguen siendo los más usados en el shock?',
        opciones: [
          { t: 'Porque se ha visto que los coloides aumentan la mortalidad en el shock', porque: 'No es eso: lo que no tienen es beneficio de supervivencia demostrado. Pensar que matan lleva a negarle al paciente un fluido que sube mejor el gasto.' },
          { t: 'Porque, litro a litro, los cristaloides expanden más el plasma', porque: 'Al revés: hace falta al menos 3 veces más cristaloide para el mismo plasma, con más acumulación de líquido y edema, que empeoran la morbimortalidad.' },
          { t: 'Los coloides no han demostrado más supervivencia, y cuestan más', ok: true }],
        explicacion: 'A favor de los cristaloides: <span class="hl">ningún beneficio de supervivencia demostrado</span> con coloides, y su precio. En contra: hace falta <span class="hl-rojo">al menos 3 veces más volumen</span>, con acumulación de líquido y edema, que empeoran la morbimortalidad.' },
      { id: 'col-e6', corto: 'el resumen', tipo: 'error', fuente: 'mar-albumina · mar-hes',
        enunciado: 'Resumen de un compañero para la sesión de mañana. Encuentra los errores.',
        frases: [
          { t: 'La albúmina al 5 % expande el plasma al menos un 70 % de lo infundido.' },
          { t: 'Con hetastarch el efecto puede durar hasta 24 h; con tetrastarch, 6 h o menos.' },
          { t: 'La amilasa va cortando el HES y, cuando los trozos llegan a 50 kD, el riñón los elimina.' },
          { t: 'Además de expandir, la albúmina es la principal proteína transportadora y es antioxidante.' },
          { t: 'La albúmina al 25 % se da en alícuotas de 50-100 mL.' }],
        explicacion: 'Todo era cierto: aquí no había errores. Marcar una frase verdadera también cuenta como fallo.' },
    ],
    casos: [
      { id: 'd2', titulo: 'Tres camas, tres hipovolemias, tres fluidos', corto: 'Caso · tres camas', sub: 'un mismo turno de mañana',
        paciente: { Turno: 'mañana; tres ingresos con hipovolemia' },
        pasos: [
          { momento: '07:00 · Cama 1', datos: { 'Cama 1': 'varón de 58 años, 70 kg. Hemorragia digestiva. PA 70/40, FC 130. La sangre está pedida' }, nuevo: ['Cama 1'],
            pregunta: { id: 'd2-1', tipo: 'test', fuente: 'mar-fluido-a-medida · mar-coloide-definicion · mc-hemorragico-fluidos',
              enunciado: 'Hay que reponer su plasma ya, mientras llega la sangre. Según la propuesta de Marino (un fluido para cada situación), ¿qué fluido propone para la hipovolemia con riesgo vital?',
              opciones: [
                { t: 'Salino al 0,9 %, a chorro', porque: 'Solo 275 mL de cada litro se quedan en el plasma: harían falta al menos 3 veces más volumen, y el resto acaba en edema.' },
                { t: 'Albúmina al 5 %, un coloide que se queda en el plasma', ok: true },
                { t: 'Albúmina al 25 %, que expande 3-4 veces su volumen', porque: 'No repone: saca agua del intersticio, que en la hemorragia ya ha cedido líquido a la sangre. No es un fluido de reanimación de pérdidas.' }],
              explicacion: 'Hipovolemia con riesgo vital, cuando hay que reponer el plasma ya: <span class="hl">coloide (p. ej., albúmina al 5 %)</span>, 700 mL al plasma por litro.',
              nota: '<b>Ojo:</b> el cap. 10 trata del fluido. La sangre, los hemoderivados y por qué se limitan los cristaloides en la hemorragia grave están en el cap. 15 de Marino, que la app recoge en la ficha «Reanimación del shock hemorrágico» de Merino Cardiología (botón «Ver en el texto», abajo).' } },
          { momento: '07:10 · Cama 1', datos: { 'Cama 1 · fluido': '500 mL de albúmina al 5 %' }, nuevo: ['Cama 1 · fluido'],
            pregunta: { id: 'd2-2', tipo: 'test', fuente: 'mar-fig-10-1', origen: 'ilustrativo: proporcional a la Figura 10.1', modelo: { aguaViva: 'albumina5' },
              enunciado: 'Calcula, proporcional a la Figura 10.1: ¿cuánto plasma ganan 500 mL de albúmina al 5 %, y cuánto ganarían 500 mL de salino?',
              opciones: [
                { t: '500 frente a 500: los dos son isotónicos', porque: 'El salino se reparte por todo el extracelular: de 500 mL, solo ≈140 se quedan en el plasma. Esperar 500 te hace creer que lo has repuesto cuando no.' },
                { t: 'Unos 150 frente a unos 400', porque: 'Es al revés: la albúmina se queda (700 por litro) y el salino se va (275 por litro). Elegirías el fluido equivocado para un paciente que no puede esperar.' },
                { t: 'Unos 350 frente a unos 140', ok: true }],
              explicacion: 'Por litro: albúmina al 5 %, <span class="hl">700 mL</span>; salino, <span class="hl">275 mL</span> (Figura 10.1). Para 500 mL, la mitad: ≈350 frente a ≈140 (cuenta proporcional, ilustrativa). Unas 3 veces más.' } },
          { momento: '07:30 · Cama 2', datos: { 'Cama 2': 'mujer de 34 años, 60 kg. Diarrea de 3 días: deshidratada. PA 95/60' }, nuevo: ['Cama 2'],
            pregunta: { id: 'd2-3', tipo: 'test', fuente: 'mar-fluido-a-medida',
              enunciado: 'Ha perdido líquido de todo el extracelular, plasma e intersticio a la vez. ¿Qué fluido propone el autor?',
              opciones: [
                { t: 'Albúmina al 5 %, como en la cama 1', porque: 'La albúmina repone sobre todo el plasma; a ella le falta también el intersticio. Para una pérdida uniforme del extracelular, el autor propone un cristaloide.' },
                { t: 'Albúmina al 25 %, que suba la presión rápido', porque: 'Le quitaría agua a un intersticio que ya está seco, y no repone nada: solo mueve líquido.' },
                { t: 'Un cristaloide, como el Ringer lactato', ok: true }],
              explicacion: 'Hipovolemia por deshidratación (<span class="hl">pérdida uniforme del extracelular</span>): un <span class="hl">cristaloide</span>, p. ej. Ringer lactato, que se reparte por todo el extracelular.' } },
          { momento: '08:00 · Cama 3', datos: { 'Cama 3': 'varón de 61 años, cirrótico. Albúmina 1,8 g/dL, edemas. PA 85/50' }, nuevo: ['Cama 3'],
            pregunta: { id: 'd2-4', tipo: 'test', fuente: 'mar-fluido-a-medida · mar-albumina · mar-tabla-10-3', modelo: { aguaViva: 'albumina25' },
              enunciado: 'Hipovolemia con hipoalbuminemia: el plasma se le escapa al intersticio. El autor propone albúmina al 25 %. Calcula: ¿cuánto sube su plasma con 100 mL?',
              opciones: [
                { t: '700 mL, lo mismo que daría 1 L de albúmina al 5 %', porque: 'Eso es 1 L de albúmina al 5 %. 100 mL al 25 % dan 3-4 veces su volumen: contarías con el doble del volumen que vas a tener.' },
                { t: '300-400 mL: 200-300 salen de su intersticio', ok: true },
                { t: '100 mL: lo que lleva el vial', porque: 'Con 70 mmHg de oncótica tira del intersticio: el plasma sube 3-4 veces lo infundido. Si esperas solo 100 mL, repetirás dosis de más.' }],
              explicacion: 'Albúmina al 25 %: <span class="hl">3-4 veces su volumen</span> (Tabla 10.3), sacando agua del intersticio. Y <span class="hl-verde">toda albúmina expande más si hay hipoalbuminemia</span>.' } },
          { momento: '09:00 · Cama 3', datos: { 'Cama 3 · respuesta': 'PA 105/60 tras 100 mL de albúmina al 25 %' }, nuevo: ['Cama 3 · respuesta'],
            pregunta: { id: 'd2-5', tipo: 'destapa', fuente: 'mar-tabla-10-3 · mar-albumina',
              enunciado: 'El estudiante de la rotación no se lo cree: «¿cómo pueden 100 mL subirle la tensión?». Explícaselo. Son tres cosas.',
              puntos: [
                'Su oncótica es de <span class="hl">70 mmHg, 2,5 veces la del plasma</span>.',
                'Por eso <span class="hl-azul">saca agua del intersticio</span>: el plasma crece 3-4 veces lo infundido (mueve, no repone).',
                'Y con <span class="hl">hipoalbuminemia</span>, toda albúmina expande más.'],
              explicacion: 'Se usa justo para esto: subir rápido el plasma, y la presión, en pacientes con edemas, sobre todo por hipoalbuminemia.' } },
          { momento: '09:30 · el plan de otro residente', datos: { Plan: 'el R2 propone simplificar' }, nuevo: ['Plan'],
            pregunta: { id: 'd2-6', tipo: 'error', fuente: 'mar-fluido-a-medida · mar-albumina',
              enunciado: 'El R2 que lleva las tres camas escribe su plan. Encuentra los errores.',
              frases: [
                { t: 'Para no liarnos, albúmina al 25 % a las tres camas: expande 3-4 veces su volumen.', mal: true,
                  c: 'La albúmina al 25 % <span class="hl-rojo">no repone pérdidas, solo mueve líquido</span>: sirve en la cama 3 (hipoalbuminemia), no en la hemorragia ni en la deshidratación. «Un fluido para cada situación».' },
                { t: 'En la cama 2, el Ringer lactato repone una pérdida de todo el extracelular.' },
                { t: 'La albúmina hiperoncótica se ha asociado a daño renal en el shock, como todos los fluidos hiperoncóticos.' },
                { t: 'Elegir el fluido según la situación, en vez de uno para todas, es «hacer la pregunta correcta».' }],
              explicacion: 'El debate coloide-cristaloide busca un fluido para todo; el autor propone elegir uno para cada situación.' } },
          { momento: '10:30 · Cama 1 · el giro', datos: { 'Cama 1 · TC': 'hematoma subdural: se golpeó la cabeza en el síncope' }, nuevo: ['Cama 1 · TC'],
            pregunta: { id: 'd2-7', tipo: 'test', fuente: 'mar-albumina',
              enunciado: 'La TC de la cama 1 muestra un TCE. Lleva albúmina al 5 % y la sangre ya está pasando. ¿Qué dice Marino de la albúmina en el TCE?',
              opciones: [
                { t: 'Que es segura en todos los pacientes, sin excepciones', porque: 'Los estudios recientes la ven segura, pero hay una posible excepción: en el TCE, un gran estudio vio más mortalidad con albúmina que con salino.' },
                { t: 'Que es una posible excepción: un gran estudio vio más mortalidad que con salino', ok: true },
                { t: 'Que conviene pasar a albúmina al 25 % para bajar el edema cerebral', porque: 'La ficha no la da para el edema cerebral, y en el TCE la albúmina se asoció a más mortalidad. Lo que sí baja la PIC es el salino hipertónico (ficha de cristaloides).' }],
              explicacion: 'Revisiones antiguas sugerían más mortalidad con albúmina; estudios recientes la ven segura. <span class="hl-rojo">Posible excepción: el TCE</span>, con más mortalidad que el salino en un gran estudio. El libro no manda cambiar de fluido: es un motivo para dudar de la albúmina en el TCE, no una prohibición.' } },
          { momento: 'Día 2 · Cama 1', datos: { 'Cama 1 · fluidos': 'recibió un hidroxietilalmidón en quirófano', 'Cama 1 · analítica': 'amilasa ×3; lipasa normal' }, nuevo: ['Cama 1 · fluidos', 'Cama 1 · analítica'],
            pregunta: { id: 'd2-8', tipo: 'test', fuente: 'mar-hes',
              enunciado: 'Hoy la amilasa está 3 veces por encima de lo normal y la lipasa es normal. ¿Pancreatitis?',
              opciones: [
                { t: 'Sí: amilasa ×3 obliga a tratarla como pancreatitis', porque: 'La lipasa normal y el HES lo explican: la amilasa se une al HES y se elimina menos. Le harías pruebas y le tratarías por una pancreatitis que no tiene.' },
                { t: 'No se sabe hasta repetir la amilasa dentro de un mes', porque: 'No hace falta esperar tanto: suele normalizarse en una semana tras parar el HES, y la lipasa, que no cambia, ya orienta.' },
                { t: 'No: el HES retiene la amilasa; la lipasa no cambia', ok: true }],
              explicacion: 'La amilasa se une al HES y el riñón la elimina menos: <span class="hl">sube 2-3 veces</span> y se normaliza en una semana. <span class="hl-verde">La lipasa no cambia.</span>' } },
        ],
        lleva: [
          'Un fluido para cada situación: riesgo vital → coloide (albúmina al 5 %); deshidratación → cristaloide (Ringer); hipoalbuminemia → albúmina al 25 %.',
          'La albúmina al 25 % mueve agua del intersticio al plasma: no repone pérdidas.',
          'En el TCE, un gran estudio vio más mortalidad con albúmina que con salino (posible excepción); y tras un HES, la amilasa sube sin pancreatitis.'],
        volver: { nombre: 'Un enfoque a medida', ancla: 'mar-fluido-a-medida', modelo: { aguaViva: 'albumina25' } } },
    ],
    profundizar: [
      { id: 'mar-dextranos', titulo: 'Dextranos' },
      { id: 'mar-tabla-10-4', titulo: 'Tabla 10.4 — Lo que transporta la albúmina' },
      { id: 'mar-tabla-10-5', titulo: 'Tabla 10.5 — Hidroxietilalmidones (peso y sustitución)' },
    ],
  },
};
