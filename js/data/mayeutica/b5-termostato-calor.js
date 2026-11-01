// Mayéutica del bloque 5, grupo 5D · El termostato (Marino cap. 43), primera mitad: ma-calor y ma-hipertermia-farmacos, con el caso de Jacinta.
// Formato: cabecera de b1-fluidos.js. Datos puros. La pinta js/core/mayeutica.js; el modelo es el termostato vivo.
// Medicina: js/modules/libros/marino-abdomen.html y docs/marino-2024-abdomen-temperatura-caps39-44.pdf (cap. 43 = págs. 45-58;
// desplazamiento 0). Cada pregunta dice dónde con `fuente`. Los pacientes (Ovidio, Marcial, Jacinta) son inventados:
// sus cifras son «del caso» o `ilustrativo`.
const PDF = 'docs/marino-2024-abdomen-temperatura-caps39-44.pdf';
const pag = (n, txt) => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">${txt || `PDF pág. ${n}`}</a>`;
const TV = e => ({ termostatoVivo: e });
// La vista Visual de la ficha, como botón «modelo» (sale tras contestar).
const visual = (tab, texto) => ({ especialidad: 'libros', view: 'marinoAbdomen', panel: 'panel-marino-abd-tabs', tab, enVisual: '', texto });

export const MAYEUTICA_TERMOSTATO_CALOR = {
  /* =================================================================================================
     Ficha 15 · Agotamiento por calor y golpe de calor (cap. 43, págs. 45-47)
     ================================================================================================= */
  'ma-calor': {
    entrada: 'Por qué el golpe de calor no es fiebre y el paracetamol no sirve, qué enfría de verdad (la evaporación) y hasta dónde se enfría.',
    guia: [
      { id: 'cal-g1', corto: 'el termostato', tipo: 'test', fuente: 'ma-calor-intro · ma-calor-hipertermia',
        enunciado: 'El cuerpo en reposo produce calor para subir 1 °C cada hora, y sin embargo no lo hace. ¿Qué lo evita?',
        opciones: [
          { t: 'La piel disipa el calor como un radiador y un termostato limita la variación diaria a ±0,6 °C', ok: true },
          { t: 'Que el sudor se activa siempre a partir de 37 °C', porque: 'La ficha no liga el control a un umbral de sudor: lo atribuye a la piel, que disipa el calor, y a un termostato que limita la variación (p. 45).' },
          { t: 'El metabolismo se frena solo en cuanto sube la temperatura', porque: 'La ficha dice que el calor se sigue produciendo y que lo saca la piel (p. 45). Esperar a que el metabolismo frene deja al cuerpo acumulando calor.' }],
        explicacion: `El cuerpo produce calor suficiente para subir <span class="hl-rojo">1 °C por hora</span> en reposo; la piel lo disipa como un <span class="hl">radiador</span> y un <span class="hl-azul">termostato</span> limita la variación a ±0,6 °C (${pag(45, 'p. 45')}).` },
      { id: 'cal-g2', corto: 'paracetamol en el golpe', tipo: 'test', fuente: 'ma-calor-hipertermia', modeloVivo: TV('golpe:4'),
        enunciado: 'Predice, y luego lo compruebas en el modelo: Ovidio, 34 años, corre en verano y llega a 41,6 °C con delirio. ¿Qué le hace 1 g de paracetamol?',
        opciones: [
          { t: 'Nada: el punto de ajuste no se ha movido, no es fiebre', ok: true },
          { t: 'Le baja el punto de ajuste y deja de acumular calor, como en una fiebre', porque: 'En la fiebre el ajuste está alto y el antipirético lo baja; en Ovidio el ajuste sigue en 37. Perderías minutos preciosos con un fármaco que no actúa mientras el cerebro sigue a 41,6 °C.' },
          { t: 'Le baja la temperatura la mitad de lo que haría en una fiebre', porque: 'La ficha no habla de un efecto parcial: dice que los antipiréticos no sirven en la hipertermia. Esperar «media respuesta» retrasa el enfriamiento activo.' }],
        explicacion: `La <span class="hl-purpura">hipertermia</span> es un fallo de la regulación; la fiebre, una regulación normal con el punto de ajuste más alto. Por eso el paracetamol <span class="hl-rojo">no sirve en la hipertermia</span> (${pag(45, 'p. 45')}).` },
      { id: 'cal-g3', corto: 'secar el sudor', tipo: 'test', fuente: 'ma-calor-evaporacion',
        enunciado: 'Un compañero seca con una toalla el sudor que corre por la espalda de un corredor sobrecalentado, «para que no se ahogue la piel». ¿Enfría eso?',
        opciones: [
          { t: 'Sí: la piel seca y bien aireada disipa mejor el calor que la piel mojada', porque: 'Lo que enfría no es el sudor en la piel, sino que se evapore: 580 kcal por litro. Quitarlo con una toalla elimina el agua antes de que se lleve calor.' },
          { t: 'No: enfría la evaporación (580 kcal por litro); secarlo no enfría', ok: true },
          { t: 'Solo si es sudor frío, que ya ha cedido su calor', porque: 'La ficha no distingue «sudor frío»: pide que el sudor se evapore, y eso necesita aire que lo renueve (ventilador). Con esta idea se dejaría sin abanicar al paciente.' }],
        explicacion: `Evaporar 1 L de sudor se lleva <span class="hl">580 kcal</span>, un cuarto del calor que produce en un día un adulto en reposo; el sudor térmico llega a 1-2 L/h (más de 1.000 kcal en una hora). El sudor tiene que evaporarse: <span class="hl-rojo">secarlo no enfría</span> (${pag(46, 'p. 46')}).` },
      { id: 'cal-g4', corto: 'agotamiento o golpe', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'ma-tabla-43-1 · ma-calor-agotamiento · ma-calor-golpe', modeloVivo: TV('golpe:2'),
        modelo: visual('ma-calor', '🖼️ La Tabla 43.1 en la vista Visual'),
        enunciado: 'Dos corredores llegan acalorados. ¿Qué separa el agotamiento por calor del golpe de calor? Tres rasgos.',
        puntos: [
          'La <span class="hl-rojo">temperatura</span>: 38-39 °C en el agotamiento, ≥41 °C en el golpe.',
          'El <span class="hl-rojo">sistema nervioso</span>: indemne en el agotamiento; delirio, coma o convulsiones en el golpe.',
          'La <span class="hl">inestabilidad</span>: el agotamiento no tiene hipotensión ni fallo de órganos; el golpe sí (rabdomiólisis, fracaso renal, CID, hepatitis isquémica).'],
        explicacion: `Tabla 43.1 (${pag(46, 'p. 46')}) y texto del golpe (${pag(47, 'p. 47')}). La tabla añade el sudor (sí/no), pero el texto aclara que la anhidrosis es típica del golpe, no constante.`,
        nota: '<b>Nota de fidelidad.</b> El texto escribe «&lt;38-39 °C» para el agotamiento; la Tabla 43.1 da «38-39 °C». Se usa la tabla.' },
      { id: 'cal-g5', corto: 'hasta dónde enfriar', tipo: 'test', fuente: 'ma-calor-externo', modeloVivo: TV('golpe:4'),
        enunciado: 'Predice y compruébalo con «Dar: enfriar»: Ovidio está a 41,6 °C y lo enfrías. ¿Hasta dónde bajas la temperatura y por qué paras ahí?',
        opciones: [
          { t: 'Hasta 38 °C: más frío provoca escalofrío y la temperatura vuelve a subir', ok: true },
          { t: 'Hasta 35 °C, para tener margen antes de que vuelva a subir', porque: 'Enfriar de más desencadena el escalofrío, que produce calor y devuelve la temperatura hacia arriba; el paciente acabaría peor y no más seguro.' },
          { t: 'Hasta 37 °C, el punto de ajuste normal', porque: 'La ficha pone el objetivo en 38 °C, no en 37. Pasarse de frío con mantas y hielo es lo que activa el escalofrío.' }],
        explicacion: `Volumen y enfriamiento activo <span class="hl">hasta 38 °C</span>. El inconveniente del enfriamiento externo es el <span class="hl-rojo">escalofrío</span>, que vuelve a subir la temperatura (${pag(47, 'p. 47')}).` },
      { id: 'cal-g6', corto: 'cuánto tarda', tipo: 'test', fuente: 'ma-calor-externo', origen: 'ilustrativo: 3,4 / 0,3', modeloVivo: TV('golpe:4'),
        enunciado: 'El enfriamiento evaporativo baja unos 0,3 °C por minuto. Ovidio pasa de 41,6 a 38,2 °C. ¿Cuánto tarda, si baja a ese ritmo?',
        opciones: [
          { t: 'Unos 3 minutos', porque: 'Sale de confundir 0,3 °C/min con 1 °C/min: 3,4 °C a 0,3 °C/min son unos 11 min, no 3.' },
          { t: 'Unos 11 minutos', ok: true },
          { t: 'Cerca de una hora, como en el enfriamiento pasivo', porque: 'La ficha da 0,3 °C/min para el evaporativo (p. 47); a ese ritmo, 3,4 °C son unos 11 min, no una hora.' }],
        explicacion: `3,4 °C ÷ 0,3 °C/min ≈ 11 min (cuenta del modelo, <span class="hl">ilustrativa</span>; el 0,3 °C/min es de la ficha, ${pag(47, 'p. 47')}).` },
    ],
    examen: [
      { id: 'cal-e1', corto: 'la anhidrosis', tipo: 'test', fuente: 'ma-calor-golpe',
        enunciado: 'Ante un corredor con 41,8 °C, delirio e hipotensión, un residente descarta golpe de calor porque «aún suda». ¿Qué dice la ficha?',
        opciones: [
          { t: 'Tiene razón: sin anhidrosis no hay golpe de calor', porque: 'La ficha dice que la anhidrosis es típica, no constante. Con ese criterio dejarías sin enfriar a quien sigue sudando y ya tiene el cerebro afectado.' },
          { t: 'Solo se ve en el golpe clásico, por el ambiente, y no en el de esfuerzo', porque: 'La ficha no limita la anhidrosis a una forma; el de esfuerzo es de hecho el más grave. Si lo descartas por sudar, retrasas el tratamiento del cuadro más grave.' },
          { t: 'La anhidrosis es típica pero no constante: no descarta el golpe', ok: true }],
        explicacion: `Golpe de calor: ≥41 °C, disfunción neurológica, hipotensión y fallo multiorgánico; <span class="hl-rojo">la anhidrosis es típica, no constante</span> (${pag(47, 'p. 47')}).` },
      { id: 'cal-e2', corto: 'el agotamiento', tipo: 'test', fuente: 'ma-calor-agotamiento',
        enunciado: 'Una operaria llega con 38,6 °C, calambres y náuseas, deshidratada y mentalmente normal, y ha bebido solo agua. ¿Qué haces?',
        opciones: [
          { t: 'Volumen y medidas generales; sin enfriar de forma activa; ojo a la hiponatremia', ok: true },
          { t: 'Salino frío a 4 °C y hielo en ingles, axilas y cuello hasta 38 °C, por precaución', porque: 'Es el enfriamiento activo del golpe. En el agotamiento la ficha dice que no hace falta; enfriarla de más provoca escalofrío sin beneficio.' },
          { t: 'Paracetamol, porque la temperatura es de 38,6 °C', porque: 'Es una hipertermia, no una fiebre: el antipirético no actúa, y no trata la deshidratación que es lo característico del cuadro.' }],
        explicacion: `Agotamiento: deshidratación sin compromiso hemodinámico, con hiper- o hiponatremia si se repone con agua; <span class="hl">no hace falta enfriar de forma activa</span> (${pag(47, 'p. 47')}).` },
      { id: 'cal-e3', corto: 'la CK', tipo: 'test', fuente: 'ma-calor-rabdo',
        enunciado: 'En un golpe de calor, ¿cómo se define la rabdomiólisis con la CK?',
        opciones: [
          { t: 'CK >1.000 U/L, como en el síndrome neuroléptico maligno', porque: 'Ese es el corte que la ficha usa para distinguir el SNM de la distonía, no para la rabdomiólisis del calor. Con ese corte se sobrediagnostica o se infravalora según el caso.' },
          { t: 'No hay corte estándar; se ha propuesto ≥5 veces lo normal', ok: true },
          { t: 'Solo se diagnostica por la orina oscura, nunca por la CK', porque: 'La ficha mide la rabdomiólisis con la CK, no con el color de la orina.' }],
        explicacion: `Se mide con la CK, <span class="hl-rojo">sin un corte estándar</span> (se ha propuesto ≥5 veces lo normal); consecuencias: debilidad y fracaso renal por la mioglobina (${pag(47, 'p. 47')} y ${pag(48, '48')}).` },
      { id: 'cal-e4', corto: 'enfriar por dentro', tipo: 'test', fuente: 'ma-calor-interno',
        enunciado: 'Una UCI dispone de un catéter intravascular de enfriamiento automático. ¿Qué dice la ficha?',
        opciones: [
          { t: 'Enfrían más rápido (descrito), pero exigen vía central; su efecto en el pronóstico se desconoce', ok: true },
          { t: 'Son de elección porque mejoran la supervivencia en el golpe de calor y se ponen antes que el hielo', porque: 'La ficha dice lo contrario: su efecto en el pronóstico no está estudiado (p. 47). Presentarlos como de elección es afirmar un beneficio que nadie ha medido.' },
          { t: 'No enfrían más que el hielo y tienen más complicaciones', porque: 'La ficha dice que se ha descrito un enfriamiento más rápido, y no habla de más complicaciones que las del hielo (p. 47).' }],
        explicacion: `Interno: suero salino frío (4 °C); de los dispositivos intravasculares se ha descrito un enfriamiento más rápido, pero necesitan <span class="hl">vía central</span> y su efecto en el pronóstico no está estudiado (${pag(47, 'p. 47')}).` },
      { id: 'cal-e5', corto: 'esfuerzo o clásico', tipo: 'test', fuente: 'ma-calor-golpe',
        enunciado: 'Dos golpes de calor llegan a la vez: una anciana en una ola de calor en su casa y un soldado tras una marcha. ¿Cuál suele ser más grave?',
        opciones: [
          { t: 'La anciana: el golpe clásico, por el ambiente, es el más grave', porque: 'La ficha lo dice al revés. Infravalorar al soldado por «joven y sano» retrasa el enfriamiento y la vigilancia de la rabdomiólisis.' },
          { t: 'El soldado: el golpe de esfuerzo suele ser más grave', ok: true },
          { t: 'Son iguales: lo único que importa es la temperatura', porque: 'La ficha distingue las dos formas y marca la de esfuerzo como más grave. Tratarlos igual olvida la rabdomiólisis y el fracaso renal que acompañan al esfuerzo.' }],
        explicacion: `Golpe de calor clásico (por el ambiente) o <span class="hl-rojo">de esfuerzo, que suele ser más grave</span> (${pag(47, 'p. 47')}).` },
    ],
    casos: [
      { id: 'cal-c1', titulo: 'Ovidio, 34 años: el corredor que dejó de sudar', corto: 'Caso · Ovidio', sub: 'golpe de calor de esfuerzo en verano',
        paciente: { Edad: '34 años', Motivo: 'Colapso al terminar una carrera en verano' },
        lleva: [
          'Golpe de calor: ≥41 °C, sistema nervioso afectado y fallo de órganos; el paracetamol no actúa porque no es fiebre.',
          'Se enfría activamente hasta 38 °C y se para: más frío provoca escalofrío que vuelve a subir la temperatura.',
          'La rabdomiólisis, el fracaso renal, la CID y la hepatitis isquémica son la factura de las horas a 41 °C.'],
        volver: { nombre: 'Enfriamiento del golpe de calor', ancla: 'ma-calor-externo', modeloVivo: TV('golpe:4') },
        pasos: [
          { momento: 'Llegada', datos: { Constantes: 'T 41,6 °C, PA 86/48, FC 152', Exploración: 'delirio, piel seca y caliente' }, nuevo: ['Constantes', 'Exploración'], calculadora: { ir: 'ma-calor-resultado', nombre: '¿Agotamiento o golpe de calor? (Tabla 43.1)' },
            pregunta: { id: 'cal-c1-1', tipo: 'test', fuente: 'ma-calor-golpe · ma-calor-externo', modeloVivo: TV('golpe:4'),
              enunciado: '¿Qué haces primero?',
              opciones: [
                { t: 'Paracetamol 1 g IV y observar durante una hora si baja la temperatura central', porque: 'No es fiebre: el punto de ajuste no se ha movido y el antipirético no actúa. Con delirio a 41,6 °C, cada minuto sin enfriar suma daño cerebral.' },
                { t: 'Enfriar ya (evaporación y hielo en ingles, axilas y cuello) y dar volumen', ok: true },
                { t: 'Hidratar por vía oral y trasladar a observación', porque: 'Con delirio e hipotensión es un golpe de calor, no un agotamiento; sin enfriamiento activo el calor sigue dañando el cerebro y los órganos.' }],
              explicacion: `Golpe de calor: <span class="hl-rojo">volumen y enfriamiento activo hasta 38 °C</span>; en urgencias, hielo en ingles y axilas, cuello y tórax alto (${pag(47, 'p. 47')}).` } },
          { momento: 'A los 11 minutos', datos: { Constantes: 'T 38,2 °C (cuenta del modelo: 3,4 °C a 0,3 °C/min); el delirio cede' }, nuevo: ['Constantes'],
            pregunta: { id: 'cal-c1-2', tipo: 'test', fuente: 'ma-calor-externo', origen: 'ilustrativo: 3,4 / 0,3',
              enunciado: '¿Qué haces ahora con el enfriamiento?',
              opciones: [
                { t: 'Seguir hasta 35 °C para asegurar que no vuelva a subir', porque: 'Pasarse de frío provoca escalofrío, que produce calor y devuelve la temperatura hacia arriba.' },
                { t: 'Pararlo: el objetivo es unos 38 °C', ok: true },
                { t: 'Cambiar a paracetamol, que ya mantiene el resultado', porque: 'En una hipertermia el antipirético no actúa. El resultado se mantiene vigilando, no con un fármaco que no tiene diana.' }],
              explicacion: `Enfriamiento activo <span class="hl">hasta 38 °C</span>; el escalofrío es el inconveniente del enfriamiento externo (${pag(47, 'p. 47')}).` } },
          { momento: 'Hora 6 · UCI', datos: { Constantes: 'T 38,2 °C', Analítica: 'CK 18.000 U/L, creatinina 2,1 mg/dL, plaquetas 60.000, INR 2,3, fibrinógeno 80 mg/dL, ALT 2.900 U/L (cifras del caso)' }, nuevo: ['Constantes', 'Analítica'],
            pregunta: { id: 'cal-c1-3', tipo: 'destapa', cuantas: 'son cuatro cosas', fuente: 'ma-calor-golpe · ma-calor-rabdo',
              enunciado: 'La temperatura ya es normal. ¿Qué te dice este análisis? Cuatro órganos.',
              puntos: [
                'Los <span class="hl-rojo">músculos</span>: rabdomiólisis (CK alta, sin corte estándar; ≥5 veces lo normal se ha propuesto).',
                'El <span class="hl-rojo">riñón</span>: fracaso renal, por la mioglobina y la hipovolemia.',
                'La <span class="hl-rojo">coagulación</span>: CID (plaquetas bajas, INR alto y fibrinógeno bajo).',
                'El <span class="hl-rojo">hígado</span>: transaminasas muy altas por hepatitis isquémica.'],
              explicacion: `Afectación multiorgánica del golpe: rabdomiólisis, fracaso renal, CID y transaminasas muy altas (${pag(47, 'p. 47')}). La normalidad de la temperatura no cierra el cuadro.` } },
          { momento: 'Hora 6 · plan', datos: { Plan: 'borrador del R1 de campo' }, nuevo: ['Plan'],
            pregunta: { id: 'cal-c1-4', tipo: 'error', fuente: 'ma-calor-hipertermia · ma-calor-externo',
              enunciado: 'Revisas lo que hizo el R1 en el campo con Ovidio. Puede haber 0, 1 o 2 errores.',
              frases: [
                { t: 'Inmersión en agua fría, que es lo primero en el lugar.' },
                { t: 'Paracetamol IV para bajar la temperatura.', mal: true, c: 'No es fiebre: <span class="hl-rojo">el paracetamol no sirve en la hipertermia</span> (p. 45).' },
                { t: 'Hielo en ingles, axilas, cuello y tórax alto en urgencias.' },
                { t: 'Seguir enfriando hasta 35 °C para tener margen.', mal: true, c: 'El objetivo es <span class="hl">38 °C</span>: más frío provoca escalofrío y la temperatura vuelve a subir (p. 47).' },
                { t: 'Volumen mientras se enfría.' }],
              explicacion: `Inmersión en agua fría en el lugar; en urgencias, hielo y mantas de enfriamiento; objetivo 38 °C (${pag(47, 'p. 47')}).` } },
          { momento: 'Hora 7 · giro', datos: { Constantes: 'T 38,6 °C, piel fría y cerrada', Exploración: 'escalofríos', Contexto: 'sigue con las mantas de enfriamiento puestas desde la hora 6 por error del turno' }, nuevo: ['Constantes', 'Exploración', 'Contexto'],
            pregunta: { id: 'cal-c1-5', tipo: 'test', fuente: 'ma-calor-externo · ma-calor-hipertermia',
              enunciado: 'Ovidio sigue con las mantas de enfriamiento aunque ya estaba en 38 °C, y vuelve a subir la temperatura mientras tirita. ¿Qué haces?',
              opciones: [
                { t: 'Dejar de enfriar de forma activa: el escalofrío produce calor y sube la temperatura', ok: true },
                { t: 'Más hielo y otra manta, para vencer la subida', porque: 'El frío adicional aumenta el escalofrío, que produce calor y devuelve la temperatura hacia arriba.' },
                { t: 'Paracetamol, porque ya es una fiebre', porque: 'La ficha no lo plantea: es una hipertermia (fallo de regulación), no una fiebre, y el antipirético no actúa.' }],
              explicacion: `El inconveniente del enfriamiento externo es el escalofrío, que vuelve a subir la temperatura (${pag(47, 'p. 47')}); los antipiréticos no sirven en la hipertermia (${pag(45, 'p. 45')}).`,
              nota: '<b>La fuente no lo dice con estas palabras.</b> Marino (p. 47) da el escalofrío como el inconveniente del enfriamiento externo, que vuelve a subir la temperatura; dejar de enfriar de forma activa es lo que se deduce de eso.' } },
        ] },
    ],
    profundizar: [
      { id: 'ma-calor-conveccion', titulo: 'Convección: el aire junto a la piel' },
      { id: 'ma-tabla-43-1', titulo: 'Tabla 43.1 — los cuadros menores (edema, calambres, erupción)' },
      { id: 'ma-calor-interno', titulo: 'Enfriamiento interno' },
    ],
  },

  /* =================================================================================================
     Ficha 16 · Hipertermia maligna, SNM y síndrome serotoninérgico (cap. 43, págs. 48-53)
     ================================================================================================= */
  'ma-hipertermia-farmacos': {
    entrada: 'Tres músculos que arden por tres fármacos con el termostato quieto: cuál es cuál, qué se ve primero y qué se da (y qué no).',
    guia: [
      { id: 'fm-g1i', corto: 'el CO₂ primero', tipo: 'test', fuente: 'ma-hm-clinica', modeloVivo: TV('hm:3'),
        enunciado: 'Marcial, 28 años, 10 minutos con sevoflurano y succinilcolina. Antes de mirar el modelo: ¿qué sube primero, la temperatura o el CO₂ espirado, y por qué?',
        opciones: [
          { t: 'La temperatura: el músculo caliente es lo primero que se nota y el CO₂ solo cambia después', porque: 'La temperatura tarda: a menudo pasa de 40 °C ya tarde. Esperar la fiebre es llegar con rigidez, potasio alto y rabdomiólisis.' },
          { t: 'El CO₂ espirado, por el hipermetabolismo del músculo; la temperatura llega más tarde', ok: true },
          { t: 'Ninguno: el primer signo es siempre la rigidez del masetero', porque: 'La rigidez llega minutos u horas después del CO₂. Si solo vigilas el masetero te pierdes la ventana en la que el dantroleno salva más.' }],
        explicacion: `Primer signo, a menudo: una <span class="hl-rojo">subida brusca e inesperada del CO₂ espirado</span> (hipermetabolismo por desacoplamiento de la fosforilación oxidativa). Después, rigidez; la temperatura sube más tarde (${pag(49, 'p. 49')}).` },
      { id: 'fm-g2', corto: 'dantroleno 75 kg', tipo: 'test', fuente: 'ma-tabla-43-2 · ma-hm-tto', origen: 'ilustrativo: 75 kg × 1-2 mg/kg', modeloVivo: TV('hm:5'),
        enunciado: 'Marcial pesa 75 kg y tiene rigidez y CO₂ de 68 mmHg. Puedes usar la calculadora de dosis de la ficha. ¿Qué dantroleno pones, y hasta cuándo?',
        opciones: [
          { t: '75-150 mg IV rápidos, repetidos hasta que ceda o hasta 750 mg (10 mg/kg); luego 1-2 mg/kg cada 6 h', ok: true },
          { t: '1 mg/kg IV cada 8 h hasta 10 mg/kg', porque: 'Es la pauta del SNM grave, no de la hipertermia maligna. En Marcial, bolos cada 8 h dejarían el canal de calcio abierto durante horas.' },
          { t: '75 mg en una sola dosis y esperar una hora a ver si cede la rigidez y baja el CO₂ antes de repetir la dosis', porque: 'La pauta pide repetir cada pocos minutos hasta que ceda. Una sola dosis deja el canal abierto, con más calor y rabdomiólisis.' }],
        explicacion: `Tabla 43.2: dantroleno 1-2 mg/kg en bolo rápido, repetido cada pocos minutos hasta que ceda o se lleguen a <span class="hl-rojo">10 mg/kg acumulados</span>; después 1-2 mg/kg cada 6 h al menos 24 h (${pag(48, 'p. 48')}). Para 75 kg: 75-150 mg y tope de 750 mg (cuenta <span class="hl">ilustrativa</span>).` },
      { id: 'fm-g3', corto: 'si llega tarde', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'ma-hm-tto', modeloVivo: TV('hm:4'),
        enunciado: 'El adjunto pregunta: «¿qué pasa si el dantroleno llega tarde?». Dos cosas.',
        puntos: [
          'La <span class="hl-rojo">mortalidad</span> pasa de ≤10 % (dantroleno pronto) a ≥70 % (sin él).',
          'Aparece <span class="hl">rabdomiólisis</span>: hiperpotasemia y fracaso renal, que hay que vigilar y tratar con fluidos.'],
        explicacion: `El dantroleno baja la mortalidad de ≥70 % a ≤10 % si se da pronto; vigilar hiperpotasemia y fracaso renal (${pag(49, 'p. 49')}).` },
      { id: 'fm-g4', corto: 'rígida sin fiebre', tipo: 'test', fuente: 'ma-snm-clinica', modeloVivo: TV('snm:3'),
        enunciado: 'Jacinta, 47 años, lleva días con haloperidol: está rígida y confusa, pero con 37,6 °C. ¿Descarta eso el síndrome neuroléptico maligno?',
        opciones: [
          { t: 'Sí: sin fiebre no hay SNM', porque: 'La fiebre puede retrasarse 8-10 h tras la rigidez. Mientras tanto la rigidez sigue produciendo calor y el haloperidol seguiría puesto.' },
          { t: 'Sí, si la CK es normal; y si no lo es, es una distonía o una agitación', porque: 'La CK separa distonía y SNM (solo algo alta frente a >1.000), pero no se usa para descartar el SNM por la fiebre. Un SNM puede avanzar con la CK alta y sin fiebre.' },
          { t: 'No: la fiebre puede llegar 8-10 h después de la rigidez', ok: true }],
        explicacion: `<span class="hl-rojo">La fiebre puede retrasarse 8-10 h tras la rigidez</span>; hiperactividad autonómica y, en los graves, rigidez «en tubo de plomo» (${pag(50, 'p. 50')}).` },
      { id: 'fm-g5', corto: 'distonía o SNM', tipo: 'test', fuente: 'ma-snm-clinica',
        enunciado: 'Dos pacientes con haloperidol tienen rigidez. ¿Qué dato de laboratorio separa la distonía del SNM?',
        opciones: [
          { t: 'La CK: solo algo alta en la distonía; suele superar 1.000 U/L en el SNM', ok: true },
          { t: 'La temperatura: la distonía siempre tiene fiebre', porque: 'La distonía no tiene por qué tener fiebre, y en el SNM la fiebre puede retrasarse. Con ese criterio dejarías pasar un SNM inicial.' },
          { t: 'El tiempo: la distonía aparece a las 24-72 h y el SNM a las 2 semanas', porque: 'Es al revés de lo que ofrece la ficha: el SNM empieza a las 24-72 h y casi siempre en las 2 primeras semanas. No sirve para distinguirlos.' }],
        explicacion: `Para distinguirlo de una distonía: la CK es solo algo alta en la distonía y <span class="hl-rojo">suele superar 1.000 U/L</span> en el SNM (${pag(50, 'p. 50')}).` },
      { id: 'fm-g6', corto: 'plan del SNM', tipo: 'destapa', cuantas: 'son cuatro cosas', fuente: 'ma-snm-tto',
        enunciado: 'Confirmado el SNM, ¿cuál es el plan? Cuatro bloques.',
        puntos: [
          '<span class="hl-rojo">Retirar el fármaco</span> (o reiniciarlo ya, si fue una retirada de dopaminérgico).',
          '<span class="hl">Fluidos</span> si hay rabdomiólisis o hipotensión, y benzodiacepinas si hay agitación.',
          '<span class="hl-rojo">Profilaxis tromboembólica obligatoria</span>.',
          'Para la rigidez: <span class="hl-azul">bromocriptina</span> 10 mg VO 3 veces al día o, en los graves, <span class="hl-azul">dantroleno</span> 1 mg/kg IV cada 8 h hasta 10 mg/kg.'],
        explicacion: `Lo más importante es retirar el fármaco; fluidos y benzodiacepinas (${pag(50, 'p. 50')}). La bromocriptina mejora en horas y la respuesta completa tarda días (hipotensión y alucinaciones); el dantroleno tiene resultados inconsistentes (${pag(51, 'p. 51')}). El tratamiento sigue unos 10 días tras resolverse el cuadro (2-3 semanas si el fármaco era un depósito), y tras el dantroleno IV se pasa a dantroleno oral, 50-200 mg al día en 3-4 dosis (${pag(51, 'p. 51')}).` },
      { id: 'fm-g7', corto: 'SS o SNM', tipo: 'test', fuente: 'ma-ss-claves · ma-ss-snm', modeloVivo: TV('ss:3'),
        enunciado: 'Predice y compruébalo: Jacinta, ahora con linezolid y fentanilo, tiene rigidez, confusión y 38,0 °C. ¿Qué signo apunta al síndrome serotoninérgico y no al SNM?',
        opciones: [
          { t: 'La fiebre, porque en el SNM no existe y en el SS siempre está presente', porque: 'Los dos tienen fiebre; en el SS solo en el 60 %. Ese criterio no los separa y podrías tratar un SS como SNM.' },
          { t: 'La hiperreflexia y el clonus; el clonus ocular es el más fiable', ok: true },
          { t: 'La CK, que en el SS siempre pasa de 1.000 U/L', porque: 'La rabdomiólisis aparece en el 15 % del SS, y la fuente no da la CK como criterio entre SS y SNM: separa la hiperreflexia y el clonus (p. 52).' }],
        explicacion: `Lo que distingue al SS del SNM es la <span class="hl-rojo">hiperreflexia y el clonus</span>; el clonus ocular (movimientos horizontales espontáneos), aunque raro, es el hallazgo más fiable. En el SS grave la rigidez puede taparlos (${pag(52, 'p. 52')}).` },
      { id: 'fm-g8', corto: 'nota del R1: SS', tipo: 'error', fuente: 'ma-ss-claves · ma-ss-tto',
        enunciado: 'Nota del R1 de guardia sobre Jacinta (clonus ocular, FC 118, T 37,6 °C). Puede haber 0, 1 o 2 errores.',
        frases: [
          { t: 'Fentanilo y linezolid, dos serotoninérgicos, lo explican.' },
          { t: 'Con 37,6 °C descarto el síndrome serotoninérgico.', mal: true, c: 'La temperatura sube <span class="hl">solo en el 60 %</span>: una temperatura normal no lo descarta (p. 52).' },
          { t: 'Ciproheptadina 12 mg IV ahora, y 2 mg cada 2 h si persisten los síntomas.', mal: true, c: 'La ciproheptadina existe <span class="hl-rojo">solo por vía oral</span> (se puede triturar por sonda) (p. 53).' },
          { t: 'Si la rigidez grave y la rabdomiólisis no ceden, parálisis con rocuronio.' }],
        explicacion: `Retirar los serotoninérgicos; ciproheptadina oral 12 mg, 2 mg/2 h y mantenimiento 8 mg/6 h; rocuronio si la rigidez grave y la rabdomiólisis son refractarias (${pag(53, 'p. 53')}).` },
    ],
    examen: [
      { id: 'fm-e1a', corto: 'la herencia', tipo: 'test', fuente: 'ma-hm-que · ma-hm-tto',
        enunciado: 'Marcial se recupera de una hipertermia maligna. ¿Qué haces antes del alta?',
        opciones: [
          { t: 'Pulsera médica y avisar a la familia directa: herencia autosómica dominante', ok: true },
          { t: 'Nada especial: es una reacción idiosincrásica del paciente y no vuelve a ocurrir con otro anestésico', porque: 'La idiosincrasia es del SNM. La hipertermia maligna es hereditaria: el siguiente anestésico halogenado en Marcial o en un familiar puede repetirla.' },
          { t: 'Solo avisar al anestesista, la familia no tiene riesgo', porque: 'Con herencia dominante, un hijo o hermano puede tener la misma susceptibilidad. Sin aviso, el siguiente quirófano repite el cuadro.' }],
        explicacion: `Trastorno hereditario, autosómico dominante, 1 de cada 50.000 adultos; al alta, pulsera médica y avisar a la familia directa (${pag(48, 'p. 48')} y ${pag(49, '49')}).` },
      { id: 'fm-e2d', corto: 'efectos del dantroleno', tipo: 'test', fuente: 'ma-hm-tto',
        enunciado: 'Tras dantroleno, Marcial no puede apretar con la mano. ¿Qué es?',
        opciones: [
          { t: 'Una debilidad (sobre todo de la prensión) que cede en 2-4 días', ok: true },
          { t: 'Una lesión medular por la rigidez: pide resonancia urgente', porque: 'La debilidad de la prensión es el efecto adverso más frecuente del dantroleno. Pedir pruebas urgentes por ello retrasa un tratamiento que hay que mantener 24 h.' },
          { t: 'Hepatotoxicidad aguda: se suspende el dantroleno', porque: 'El daño hepático es un riesgo del dantroleno oral durante meses, no de los bolos. Suspenderlo por la debilidad dejaría reaparecer la hipertermia.' }],
        explicacion: `Efecto adverso más frecuente: debilidad, que cede en 2-4 días; el daño hepático es un riesgo del oral durante meses (${pag(49, 'p. 49')}).` },
      { id: 'fm-e3', corto: 'el SNM', tipo: 'test', fuente: 'ma-snm-que · ma-tabla-43-3',
        enunciado: 'Un paciente en tratamiento estable con levodopa se queda sin ella al ingresar y desarrolla rigidez y fiebre. ¿Qué haces?',
        opciones: [
          { t: 'Reiniciar ya el dopaminérgico y bajarlo despacio más adelante', ok: true },
          { t: 'Mantenerlo retirado, para no empeorar la rigidez', porque: 'En el SNM por retirada es la falta de dopamina la causa. Mantener la retirada alarga el cuadro y la rabdomiólisis.' },
          { t: 'Dar un antipsicótico para tratar la confusión', porque: 'Los antipsicóticos son justo la causa más frecuente del SNM (Tabla 43.3). Empeoraría el bloqueo dopaminérgico.' }],
        explicacion: `Lo más importante: retirar el fármaco (o, si fue una retirada, <span class="hl-rojo">reiniciarlo ya</span> y bajarlo despacio después) (${pag(50, 'p. 50')}). Aparece en <1 % de los tratados, sin relación con la dosis.` },
      { id: 'fm-e4', corto: 'ciproheptadina', tipo: 'test', fuente: 'ma-ss-tto',
        enunciado: 'Un paciente con SS no puede tragar. ¿Cómo das la ciproheptadina?',
        opciones: [
          { t: 'Por vía intravenosa lenta, igual que otros antagonistas de uso habitual en la planta', porque: 'No existe forma IV de la ciproheptadina. Esperar un preparado que no hay deja al paciente sin tratamiento mientras sigue agitado.' },
          { t: 'Triturada por sonda: 12 mg, luego 2 mg/2 h y mantenimiento 8 mg/6 h; seda', ok: true },
          { t: 'No se da: el sedante empeora la agitación', porque: 'La ficha dice lo contrario: la sedación ayuda con la agitación. Renunciar al fármaco alarga el cuadro.' }],
        explicacion: `Ciproheptadina (solo oral; se puede triturar por sonda): 12 mg, luego 2 mg cada 2 h y mantenimiento de 8 mg cada 6 h; <span class="hl">seda</span> (${pag(53, 'p. 53')}).` },
      { id: 'fm-e5', corto: 'tabla 43.5', tipo: 'test', fuente: 'ma-tabla-43-5 · ma-ss-claves',
        enunciado: 'Un SS grave con rigidez intensa: ¿por qué puede fallarte la hiperreflexia como pista?',
        opciones: [
          { t: 'Porque la rigidez (45 %) puede taparla', ok: true },
          { t: 'Porque solo aparece en el 7 % de los casos', porque: 'El 7 % es el clonus ocular, no la hiperreflexia (57 %). Atribuirle una frecuencia baja te haría ignorarla.' },
          { t: 'Porque en el SS grave no hay alteración mental', porque: 'La confusión es del 64 % y la agitación del 56 %. Buscar una mente intacta te llevaría a descartar el SS.' }],
        explicacion: `Tabla 43.5: hiperreflexia 57 %, clonus ocular 7 %, rigidez 45 %, temperatura alta 60 %, rabdomiólisis 15 %. La rigidez aparece en los graves y puede tapar la hiperreflexia (${pag(52, 'p. 52')}).` },
      { id: 'fm-e6', corto: 'bromocriptina', tipo: 'test', fuente: 'ma-snm-tto',
        enunciado: 'Pautas la bromocriptina en un SNM. ¿Qué esperas y qué vigilas?',
        opciones: [
          { t: 'Mejora en horas y respuesta completa en días; vigilar hipotensión y alucinaciones', ok: true },
          { t: 'Respuesta inmediata en minutos como el dantroleno IV; sin efectos adversos relevantes en la UCI', porque: 'La bromocriptina no actúa en minutos y tiene efectos adversos (hipotensión y alucinaciones). Prometer una respuesta inmediata lleva a escalar sin motivo.' },
          { t: 'Solo funciona en el SS, no en el SNM', porque: 'Es un agonista dopaminérgico, útil en el SNM; en un SS no actúa sobre la serotonina y la rigidez seguiría sin tratar.' }],
        explicacion: `Bromocriptina 10 mg VO 3 veces al día: mejora en horas, respuesta completa en días; hipotensión y alucinaciones (${pag(51, 'p. 51')}).` },
    ],
    casos: [
      { id: 'fm-c1', titulo: 'Jacinta, 47 años: la rigidez antes que la fiebre', corto: 'Caso · Jacinta', sub: 'neumonía; haloperidol; 68 kg (peso del caso)',
        paciente: { Edad: '47 años', Peso: '68 kg (del caso)', Motivo: 'Neumonía con agitación', Fármaco: 'Haloperidol IV desde el día 3 (dosis del caso)' },
        lleva: [
          'Rigidez + confusión + CK >1.000 antes de la fiebre = SNM: retira el fármaco.',
          'Dos serotoninérgicos + clonus = SS, y una temperatura normal no lo descarta.',
          'La ciproheptadina solo existe oral; el dantroleno se dosifica distinto en la HM (hasta 10 mg/kg en bolos) y en el SNM (1 mg/kg cada 8 h).'],
        volver: { nombre: 'SS frente a SNM', ancla: 'ma-ss-snm', modeloVivo: TV('ss:3') },
        pasos: [
          { momento: 'Día 5 · 14:00', datos: { Constantes: 'T 37,6 °C, FC 104, sudorosa', Exploración: 'rigidez generalizada, confusa', Analítica: 'CK 1.900 U/L' }, nuevo: ['Constantes', 'Exploración', 'Analítica'],
            pregunta: { id: 'fm-c1-1', tipo: 'test', fuente: 'ma-snm-clinica · ma-snm-que', modeloVivo: TV('snm:2'),
              enunciado: '¿Qué sospechas?',
              opciones: [
                { t: 'Un SNM que empieza: la fiebre puede retrasarse 8-10 h tras la rigidez', ok: true },
                { t: 'No puede ser SNM sin fiebre: seguimos con el haloperidol', porque: 'La fiebre llega 8-10 h después de la rigidez y el haloperidol sigue bloqueando la dopamina. A las 23:00 estaría a casi 39 °C.' },
                { t: 'Una distonía aguda: solo hay que esperar', porque: 'La distonía eleva la CK solo algo; con 1.900 U/L y confusión encaja con el SNM (CK suele >1.000). Esperar deja el fármaco puesto.' }],
              explicacion: `Rigidez, confusión e hiperactividad autonómica a los días del haloperidol; CK >1.000 (${pag(50, 'p. 50')}). La temperatura aún no aparece.` } },
          { momento: 'Día 5 · 23:00', datos: { Constantes: 'T 38,9 °C, FC 124', Analítica: 'CK 3.400 U/L' }, nuevo: ['Constantes', 'Analítica'],
            pregunta: { id: 'fm-c1-2', tipo: 'test', fuente: 'ma-snm-tto', modeloVivo: TV('snm:4'),
              enunciado: 'Ya con fiebre y CK 3.400. ¿Cuál es la primera medida?',
              opciones: [
                { t: 'Retirar el haloperidol', ok: true },
                { t: 'Bajar el haloperidol a la mitad', porque: 'Con la mitad sigue el bloqueo dopaminérgico y el SNM no es dependiente de la dosis (idiosincrásico).' },
                { t: 'Dantroleno 2 mg/kg como en la hipertermia maligna', porque: 'Es la pauta de otro síndrome; en el SNM va 1 mg/kg cada 8 h y solo en los graves, y antes viene retirar el fármaco.' }],
              explicacion: `Lo más importante: <span class="hl-rojo">retirar el fármaco</span>. Aparece sin relación con la dosis (${pag(50, 'p. 50')}).` } },
          { momento: 'Día 5 · noche',
            pregunta: { id: 'fm-c1-3', tipo: 'destapa', cuantas: 'son cuatro cosas', fuente: 'ma-snm-tto',
              enunciado: 'Retirado el haloperidol, ¿qué más incluye el plan? Cuatro bloques.',
              puntos: [
                '<span class="hl">Fluidos</span>: la CK de 3.400 es rabdomiólisis, y la mioglobina produce lesión tubular en el riñón.',
                '<span class="hl-rojo">Profilaxis tromboembólica</span>, obligatoria.',
                '<span class="hl-azul">Bromocriptina</span> 10 mg VO 3 veces al día, o dantroleno 1 mg/kg IV cada 8 h si es grave (68 mg, <span class="hl">cuenta ilustrativa</span>).',
                'Benzodiacepinas si hay agitación; enfriamiento externo solo si hace falta.'],
              explicacion: `Plan del SNM: fluidos y retirada (${pag(50, 'p. 50')}); bromocriptina y dantroleno (${pag(51, 'p. 51')}). El control de la rigidez suele bastar para bajar la temperatura.` } },
          { momento: 'Día 6 · 08:00', datos: { Plan: 'borrador del R1 de noche' }, nuevo: ['Plan'],
            pregunta: { id: 'fm-c1-4', tipo: 'error', fuente: 'ma-snm-tto',
              enunciado: 'Plan del R1 de noche. Puede haber 0, 1 o 2 errores.',
              frases: [
                { t: 'Retiro el haloperidol y no lo reinicio.' },
                { t: 'Bromocriptina 10 mg VO tres veces al día.' },
                { t: 'Dantroleno 2 mg/kg en bolo repetido hasta 10 mg/kg, como en la HM.', mal: true, c: 'En el SNM grave: <span class="hl">1 mg/kg IV cada 8 h</span> hasta 10 mg/kg acumulados (p. 51); los bolos repetidos son de la HM.' },
                { t: 'Profilaxis tromboembólica.' },
                { t: 'Restrinjo líquidos para proteger el riñón.', mal: true, c: 'Se dan <span class="hl-rojo">fluidos</span> si hay rabdomiólisis: la mioglobina produce lesión tubular (p. 50).' },
                { t: 'Benzodiacepina si se agita.' }],
              explicacion: `Fluidos y profilaxis tromboembólica (${pag(50, 'p. 50')}); bromocriptina 10 mg VO 3 veces al día o dantroleno 1 mg/kg cada 8 h (${pag(51, 'p. 51')}).` } },
          { momento: 'Día 7', datos: { Constantes: 'T 37,8 °C; rigidez cede', Analítica: 'CK 1.800 U/L', Infección: 'neumonía por SARM → linezolid', Dolor: 'fentanilo en perfusión' }, nuevo: ['Constantes', 'Analítica', 'Infección', 'Dolor'],
            pregunta: { id: 'fm-c1-5', tipo: 'test', fuente: 'ma-ss-claves · ma-tabla-43-4',
              enunciado: 'El SNM mejora; añades linezolid y fentanilo. ¿Qué vigilas ahora?',
              opciones: [
                { t: 'Nada: el SNM está resuelto y los dos fármacos no tienen relación', porque: 'El linezolid es un IMAO y el fentanilo frena la recaptación de serotonina (Tabla 43.4): los dos juntos pueden causar SS.' },
                { t: 'Un síndrome serotoninérgico: dos serotoninérgicos a la vez', ok: true },
                { t: 'Una recaída del SNM, y reinicio bromocriptina', porque: 'La bromocriptina actúa sobre la dopamina, no sobre la serotonina. No frena un SS y su hipotensión añadiría riesgo.' }],
              explicacion: `El SS suele aparecer al combinar dos serotoninérgicos; el fentanilo y el linezolid, dos fármacos de la UCI, pueden causarlo (${pag(52, 'p. 52')}). Tabla 43.4: IMAO (incluido el linezolid) y fentanilo.`,
              nota: '<b>Nota de fidelidad.</b> El texto del libro (p. 52) escribe «NMS» donde habla del fentanilo y el linezolid como causa; por la Tabla 43.4 y el contexto se trata del síndrome serotoninérgico, y así se usa aquí.' } },
          { momento: 'Día 9 · giro', datos: { Constantes: 'T 38,0 °C, FC 118', Exploración: 'temblor, hiperreflexia, mioclonías, clonus ocular', Digestivo: 'diarrea' }, nuevo: ['Constantes', 'Exploración', 'Digestivo'],
            pregunta: { id: 'fm-c1-6', tipo: 'test', fuente: 'ma-ss-claves · ma-ss-snm', modeloVivo: TV('ss:3'),
              enunciado: '¿SNM que recae o SS?',
              opciones: [
                { t: 'SNM por el linezolid, que bloquea dopamina', porque: 'El linezolid es un IMAO (Tabla 43.4): sube la serotonina y no bloquea la dopamina. Tratarlo como SNM perpetúa el cuadro.' },
                { t: 'Hipertermia maligna: el clonus ocular es su primer signo y el dantroleno lo resuelve', porque: 'No hubo halogenado ni succinilcolina, y el primer signo de la HM es el CO₂, no el clonus ocular. Dar dantroleno aquí no resuelve nada.' },
                { t: 'SS: hiperreflexia, mioclonías y clonus ocular; la T normal no lo descartaría', ok: true }],
              explicacion: `Lo específico del SS es la hiperreflexia, las mioclonías y el clonus; el ocular es el más fiable (${pag(52, 'p. 52')}). La temperatura sube solo en el 60 %.` } },
          { momento: 'Día 9 · tratamiento',
            pregunta: { id: 'fm-c1-7', tipo: 'test', fuente: 'ma-ss-tto · ma-snm-tto',
              enunciado: '¿Qué tratamiento pautas?',
              opciones: [
                { t: 'Retirar fentanilo y cambiar el linezolid; ciproheptadina 12 mg por sonda y 2 mg/2 h', ok: true },
                { t: 'Ciproheptadina 12 mg IV y dantroleno 1 mg/kg IV cada 8 h, como en el SNM de la semana anterior', porque: 'La ciproheptadina no existe IV, y el dantroleno cada 8 h es la pauta del SNM, no del SS.' },
                { t: 'Bromocriptina 10 mg tres veces al día por sonda, como se hizo con el SNM', porque: 'Es un agonista dopaminérgico y el SS es un exceso de serotonina; con la hipotensión que produce, empeoraría la situación.' }],
              explicacion: `Retirar los fármacos y, en los graves, ciproheptadina solo oral (12 mg, luego 2 mg/2 h, mantenimiento 8 mg/6 h). Si la rigidez grave y la rabdomiólisis no ceden: rocuronio (${pag(53, 'p. 53')}).` } },
        ] },
    ],
    profundizar: [
      { id: 'ma-tabla-43-3', titulo: 'Tabla 43.3 — fármacos del SNM' },
      { id: 'ma-tabla-43-4', titulo: 'Tabla 43.4 — mecanismos de los serotoninérgicos' },
      { id: 'ma-tabla-rasgos-hipertermias', titulo: 'Los tres síndromes, rasgo a rasgo' },
    ],
  },
};
