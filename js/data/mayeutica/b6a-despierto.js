// Mayéutica del bloque 6, grupo 6A · «El despierto que se apaga» (Marino cap. 45): mn-consciencia, mn-delirio y
// mn-abstinencia, en js/modules/libros/marino-neuro.html. La pinta js/core/mayeutica.js (botón «Estudiar» de cada ficha).
// Datos puros. Formato: cabecera de b1-fluidos.js. Toda la medicina sale de la ficha y de su PDF
// (docs/marino-2024-neurologia-caps45-47.pdf, págs. 2-10; p. del PDF = #page=N). Los pacientes se inventan.
const PDF = 'docs/marino-2024-neurologia-caps45-47.pdf';
const pag = (n, txt) => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">${txt || `PDF pág. ${n}`}</a>`;
// La vista Visual de una ficha de Marino Neurología, como botón «modelo» (sale tras contestar).
const visual = (tab, texto) => ({ especialidad: 'libros', view: 'marinoNeuro', panel: 'panel-marino-neuro-tabs', tab, enVisual: '', texto });
// «Ver en la ficha» dentro de una nota (REGLAS §7.9): el enlace cruzado de siempre al párrafo exacto.
const enFicha = (tab, id, vista = 'marinoNeuro', panel = 'panel-marino-neuro-tabs') => ` <button type="button" class="may-ir" data-especialidad="libros" data-view="${vista}" data-panel="${panel}" data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;

export const MAYEUTICA_6A = {
  /* =================================================================================================
     Ficha 1 · Consciencia (cap. 45, págs. 2-4 y 10)
     ================================================================================================= */
  'mn-consciencia': {
    entrada: 'Los dos ejes de la consciencia, despertar y conciencia del entorno: cada estado es lo que se pierde, y quién conserva qué.',
    guia: [
      { id: 'mnc-g1', corto: 'qué eje queda', tipo: 'test', fuente: 'mn-cons-despertar · mn-cons-conciencia · mn-tabla-45-1',
        enunciado: 'Un paciente abre los ojos cuando entras, pero no te sigue con la mirada. Antes de mirar la Tabla 45.1: ¿qué eje de la consciencia conserva?',
        opciones: [
          { t: 'El despertar, pero no la conciencia del entorno', ok: true },
          { t: 'Los dos: es una letargia', porque: 'La letargia es atención cambiada con conciencia intacta (p. 3). Aquí no sigue con la mirada: de creerlo consciente, le hablarías como a quien entiende.' },
          { t: 'Ninguno: abrir los ojos sin seguir con la mirada es un coma', porque: 'Abrir los ojos es despertar (p. 10). Llamarlo coma lo deja sin estimulación ni búsqueda de la causa del estado vegetativo o del estupor.' }],
        explicacion: `Tabla 45.1 (${pag(2)}): el <span class="hl">despertar</span> (ojos abiertos) y la <span class="hl">conciencia del entorno</span> son ejes distintos; este paciente tiene el primero y no el segundo. El coma no abre los ojos (${pag(10, 'p. 10')}) y la letargia conserva la conciencia (${pag(3, 'p. 3')}).` + enFicha('mn-consciencia', 'mn-tabla-45-1'),
        modelo: visual('mn-consciencia', '👁️ Los dos componentes (vista Visual)') },
      // ESPERA AL CRÁNEO: modelo { craneoVivo: 'locked-in' }
      { id: 'mnc-g2', corto: 'locked-in', tipo: 'test', fuente: 'mn-cons-lockedin',
        enunciado: '¿Qué le queda a quien tiene rota la vía motora de los dos lados de la protuberancia ventral?',
        opciones: [
          { t: 'Nada: sin movimiento es un coma', porque: 'Tiene el despertar y la conciencia intactos (p. 3). Tratarlo como un coma es hablar delante de alguien que lo oye todo.' },
          { t: 'La mirada lateral y el parpadeo, pero no los movimientos verticales ni la conciencia', porque: 'La mirada lateral también depende del tronco: solo quedan los movimientos oculares verticales (p. 3). Pedirle «mira a la derecha» y no obtener respuesta lo haría pasar por inconsciente.' },
          { t: 'Movimientos oculares verticales y parpadeo, con despertar y conciencia intactos', ok: true }],
        explicacion: `Es el <span class="hl-purpura">enclaustramiento</span> (locked-in): lesión bilateral de las vías motoras en la protuberancia ventral. Respeta los <span class="hl">movimientos oculares verticales y el parpadeo</span>, y el despertar y la conciencia están intactos (${pag(3)}).` + enFicha('mn-consciencia', 'mn-cons-lockedin'),
        modelo: visual('mn-consciencia', '👁️ Los dos componentes (vista Visual)') },
      { id: 'mnc-g3', corto: 'coma o vegetativo', tipo: 'test', fuente: 'mn-cons-vegetativo · mn-cons-coma',
        enunciado: 'El estado vegetativo y el coma pueden retirar el brazo ante el dolor profundo. ¿Qué los separa?',
        opciones: [
          { t: 'El despertar: el vegetativo abre los ojos y el coma no', ok: true },
          { t: 'El vegetativo hace movimientos con propósito y el coma no', porque: 'En los dos los movimientos son sin propósito (p. 3). Si lo crees, tomarás un reflejo por una respuesta voluntaria y darás un pronóstico falso a la familia.' },
          { t: 'La conciencia: el coma la conserva y el vegetativo la pierde', porque: 'Ninguno de los dos tiene conciencia del entorno (p. 3); lo que cambia es el despertar. Con esa idea tratarías un coma como un enclaustramiento.' }],
        explicacion: `Los dos tienen movimientos <span class="hl-rojo">sin propósito</span> y ninguno tiene conciencia; el vegetativo se diferencia por el <span class="hl">despertar</span> (ojos que se abren) (${pag(3)}).` + enFicha('mn-consciencia', 'mn-cons-vegetativo') },
      { id: 'mnc-g4', corto: 'muerte y coma', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mn-cons-muerte',
        enunciado: 'La muerte encefálica y el coma parecen lo mismo en la cama. ¿En qué se diferencian?',
        puntos: [
          'Pierde <span class="hl-rojo">toda la función del tronco</span>: pares craneales y respiración.',
          'Es <span class="hl">siempre irreversible</span>.'],
        explicacion: `Tabla 45.1 y texto de la ficha (${pag(3)}): en el coma el tronco puede conservar funciones y el cuadro puede revertir.` + enFicha('mn-consciencia', 'mn-cons-muerte') },
      { id: 'mnc-g5', corto: 'nota de guardia', tipo: 'error', fuente: 'mn-cons-causas · mn-cons-crisis',
        enunciado: 'Nota de guardia sobre las causas más frecuentes de alteración de la consciencia en esta UCI. Encuentra el error.',
        frases: [
          { t: 'La sedación en pacientes con ventilación mecánica.' },
          { t: 'El shock.' },
          { t: 'Las encefalopatías isquémica, séptica y metabólica.' },
          { t: 'La sobredosis de fármacos o la abstinencia.' },
          { t: 'Las crisis no convulsivas son rarísimas: no hace falta pensar en ellas.', mal: true, c: 'Las crisis no convulsivas <span class="hl-rojo">se pasan por alto a menudo</span>: hay que pensar en ellas.' }],
        explicacion: `Las cuatro primeras son las causas más frecuentes de la ficha (${pag(4)}); las crisis no convulsivas se infradiagnostican.` + enFicha('mn-consciencia', 'mn-cons-crisis') }
    ],
    examen: [
      { id: 'mnc-e1', corto: 'estupor', tipo: 'test', fuente: 'mn-tabla-45-1 · mn-cons-estupor',
        enunciado: '¿En qué cuadrante de la Tabla 45.1 está el estupor?',
        opciones: [
          { t: 'Ni despierto ni consciente del entorno, como en el coma', porque: 'Ese es el coma (y la muerte encefálica). Un estupor tratado como coma pierde la oportunidad de estimularlo hasta despertarlo.' },
          { t: 'Despierto y consciente del entorno', porque: 'Ahí están la ansiedad, la letargia y el enclaustramiento. Esperar respuesta consciente en un estupor llevaría a malinterpretar su silencio.' },
          { t: 'Despierto, pero sin conciencia del entorno', ok: true }],
        explicacion: `Tabla 45.1 (${pag(2)}): el estupor despierta pero no es consciente del entorno; despertarlo cuesta (${pag(3, 'p. 3')}).` + enFicha('mn-consciencia', 'mn-tabla-45-1') },
      { id: 'mnc-e2', corto: 'vegetativo persistente', tipo: 'test', fuente: 'mn-cons-vegetativo',
        enunciado: '¿Cuándo pasa a llamarse persistente el estado vegetativo?',
        opciones: [
          { t: 'A los 3 meses', porque: 'El libro solo da «un mes» (p. 3). Esperar tres meses retrasaría una conversación con la familia que ya procede.' },
          { t: 'A los 6 meses', porque: 'El libro solo da «un mes» (p. 3). Con esa espera, un paciente ya persistente seguiría etiquetado de agudo.' },
          { t: 'Al mes', ok: true }],
        explicacion: `El estado vegetativo es <span class="hl-rojo">persistente al mes</span> (${pag(3)}). La ficha no da otro plazo.` + enFicha('mn-consciencia', 'mn-cons-vegetativo') },
      { id: 'mnc-e3', corto: 'delirio y demencia', tipo: 'test', fuente: 'mn-cons-delirio · mn-tabla-45-1',
        enunciado: 'Delirio y demencia comparten despertar intacto y conciencia alterada. ¿Qué los separa en la Tabla 45.1?',
        opciones: [
          { t: 'El delirio fluctúa; la demencia es permanente', ok: true },
          { t: 'El delirio pierde el despertar y la demencia no', porque: 'En ambos el despertar está intacto (p. 2). Buscar un coma donde hay delirio llevaría a pruebas y sedaciones innecesarias.' },
          { t: 'El delirio es permanente y la demencia fluctúa', porque: 'Es al revés (p. 3). Con esa idea, un cuadro fluctuante agudo se tomaría por demencia y no se buscaría su causa.' }],
        explicacion: `Los dos son «despierto con conciencia alterada»; el delirio es <span class="hl">fluctuante</span> y la demencia, <span class="hl">permanente</span> (${pag(3)}).` + enFicha('mn-consciencia', 'mn-cons-delirio') },
      { id: 'mnc-e4', corto: 'psicosis', tipo: 'test', fuente: 'mn-cons-psicosis · mn-tabla-45-1',
        enunciado: '¿Dónde coloca la Tabla 45.1 la psicosis?',
        opciones: [
          { t: 'Ni despierta ni consciente', porque: 'Ahí están el coma y la muerte encefálica (p. 2). Un psicótico agitado no está en coma: confundirlos llevaría a una exploración neurológica equivocada.' },
          { t: 'Despierta y consciente del entorno, como la ansiedad', porque: 'Ese cuadrante es de la ansiedad y el enclaustramiento. Si la psicosis fuera «consciente», no se vería su desconexión del entorno.' },
          { t: 'Despierta, sin conciencia del entorno', ok: true }],
        explicacion: `Tabla 45.1 (${pag(2)}): la psicosis es «despierta, sin conciencia del entorno». El capítulo no la describe aparte.` + enFicha('mn-consciencia', 'mn-cons-psicosis'),
        nota: '<b>La fuente no lo dice.</b> La ficha solo coloca la psicosis en la tabla; sus rasgos no se describen en este capítulo.' }
    ],
    casos: [
      { id: 'mnc-leovigildo', titulo: 'Leovigildo, 38 años: ojos abiertos y sin moverse', corto: 'Caso · Leovigildo', sub: 'ictus de tronco; hipertenso mal controlado',
        paciente: { Edad: '38 años', Antecedentes: 'HTA mal controlada', Motivo: 'Cefalea brusca y caída' },
        lleva: ['Ojos abiertos no es coma: es despertar.', 'Locked-in: protuberancia ventral bilateral; mira arriba y parpadea.', '«Persistente» es del estado vegetativo, al mes.'],
        volver: { nombre: 'Consciencia: locked-in', ancla: 'mn-cons-lockedin' }, // ESPERA AL CRÁNEO: modelo { craneoVivo: 'locked-in' }
        pasos: [
          { momento: 'Día 0 · 23:10', datos: { Constantes: 'PA 170/95, FC 88, SpO₂ 96 %', Exploración: 'ojos abiertos, no habla, no mueve brazos ni piernas', 'Nota del R1': '«Coma»' }, nuevo: ['Constantes', 'Exploración', 'Nota del R1'],
            pregunta: { id: 'mnc-l1', corto: '¿coma?', tipo: 'test', fuente: 'mn-cons-coma · mn-cons-despertar',
              enunciado: 'El R1 escribe «coma». Tiene los ojos abiertos de forma espontánea. ¿Es un coma?',
              opciones: [
                { t: 'Sí: no responde ni habla, así que no hay despertar ni conciencia', porque: 'No responder no basta. Con los ojos abiertos hay despertar y eso no es compatible con coma (p. 10): lo tratarías como inconsciente y hablarías delante de él.' },
                { t: 'No: abrir los ojos espontáneamente indica despertar', ok: true },
                { t: 'Sí, si el GCS es ≤8', porque: 'El GCS no cambia la definición: un paciente con ojos abiertos tiene despertar (p. 10). El número bajo vendría de que no habla ni mueve, no de que esté en coma.' }],
              explicacion: `La apertura ocular espontánea indica <span class="hl">despertar</span> y no es compatible con el coma (${pag(10)}).` } },
          { momento: 'Día 0 · 23:40', datos: { Orden: 'le pides «mira arriba» y «parpadea dos veces»: lo hace' }, nuevo: ['Orden'],
            pregunta: { id: 'mnc-l2', corto: '¿vegetativo o locked-in?', tipo: 'test', fuente: 'mn-cons-lockedin · mn-cons-vegetativo',
              enunciado: '¿Vegetativo o enclaustrado?',
              opciones: [
                { t: 'Locked-in: despertar y conciencia intactos, solo mirada vertical y parpadeo', ok: true },
                { t: 'Coma superficial: responde a la voz moviendo los ojos y el parpadeo, sin hablar', porque: 'En el coma no hay despertar (p. 10) y menos aún respuestas voluntarias.' },
                { t: 'Vegetativo: abre los ojos, pero sin conciencia', porque: 'Obedece órdenes con los ojos: hay conciencia (p. 3). Tratarlo como vegetativo le niega información y comunicación.' }],
              explicacion: `Obedece: <span class="hl">hay conciencia</span>. Es el locked-in, con solo mirada vertical y parpadeo (${pag(3)}).` } },
          { momento: 'Día 1', datos: { Imagen: 'infarto de la protuberancia ventral, bilateral' }, nuevo: ['Imagen'],
            pregunta: { id: 'mnc-l3', corto: 'por qué cuadra', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mn-cons-lockedin',
              enunciado: 'Giro: la imagen confirma el infarto. ¿Por qué cuadra con lo que ves?',
              puntos: [
                'La lesión <span class="hl-rojo">bilateral</span> de las vías motoras en la protuberancia ventral lo deja sin movimiento.',
                'Respeta la <span class="hl">mirada vertical y el parpadeo</span>, con los que se comunica.'],
              explicacion: `Es la localización del enclaustramiento en la ficha (${pag(3)}).` + enFicha('mn-consciencia', 'mn-cons-lockedin') } },
          { momento: 'Día 2 · la nota del R1', datos: { Nota: 'nota de evolución' }, nuevo: ['Nota'],
            pregunta: { id: 'mnc-l4', corto: 'nota del R1', tipo: 'error', fuente: 'mn-cons-lockedin · mn-me-familia',
              enunciado: 'Nota del R1 sobre Leovigildo. Encuentra el error.',
              frases: [
                { t: 'Leovigildo, 38 años, con un estado vegetativo tras un ictus de tronco.', mal: true, c: 'Obedece con los ojos: es un <span class="hl-purpura">locked-in</span>, está consciente (p. 3).' },
                { t: 'Abre los ojos de forma espontánea.' },
                { t: 'Se comunica con sí/no mediante parpadeos.' },
                { t: 'Explicar a la familia lo que ocurre y lo que probablemente ocurrirá.' }],
              explicacion: `Vegetativo y locked-in se distinguen por la conciencia (${pag(3)}); la comunicación con la familia sigue el cap. 45 (${pag(16, 'p. 16')}).` + enFicha('mn-consciencia', 'mn-cons-lockedin') } },
          { momento: 'Día 30', datos: { Familia: 'pregunta si «ya es persistente»' }, nuevo: ['Familia'],
            pregunta: { id: 'mnc-l5', corto: '«persistente»', tipo: 'test', fuente: 'mn-cons-vegetativo',
              enunciado: 'La familia pregunta si el estado de Leovigildo «ya es persistente». ¿Qué respondes?',
              opciones: [
                { t: 'Aún no: hay que esperar a los 3 meses', porque: 'El libro solo da «un mes», y solo para el vegetativo (p. 3). Esperar un plazo inventado no corresponde a este caso.' },
                { t: 'Sí: al mes todo trastorno de la consciencia pasa a llamarse persistente', porque: 'El término es del estado vegetativo (p. 3). Decírselo suena a pronóstico de inconsciencia permanente en alguien que está consciente.' },
                { t: '«Persistente» es del vegetativo al mes; Leovigildo no está vegetativo', ok: true }],
              explicacion: `«Persistente» es del <span class="hl">estado vegetativo</span> al mes (${pag(3)}); Leovigildo está enclaustrado y consciente.` } }
        ] }
    ],
    profundizar: [
      { id: 'mn-cons-ansiedad' }, { id: 'mn-cons-psicosis' }, { id: 'mn-cons-estupor' },
      { id: 'mn-convulsiones', titulo: 'Crisis y estado epiléptico', nota: 'Las crisis no convulsivas se pasan por alto a menudo (p. 4); su ficha está en este mismo cuaderno.' }
    ]
  },

  /* =================================================================================================
     Ficha 2 · Delirio (cap. 45, págs. 4-7 y Apéndice 2)
     ================================================================================================= */
  'mn-delirio': {
    entrada: 'El delirio del crítico: el hipoactivo que no se ve, el CAM-ICU, los fármacos que de verdad hay y los que no sirven.',
    guia: [
      { id: 'mnd-g1', corto: 'el tipo frecuente', tipo: 'test', fuente: 'mn-del-tipos',
        enunciado: '¿Qué tipo de delirio es el más frecuente en la UCI, y por qué se escapa?',
        opciones: [
          { t: 'El hiperactivo: es el que más llama la atención y el que más se diagnostica', porque: 'Por llamar la atención se detecta; no es el más frecuente (p. 5). Esperar siempre agitación deja sin ver a la mayoría.' },
          { t: 'El mixto: alterna agitación y letargia', porque: 'No es el más frecuente según la ficha (p. 5). Buscar solo las alternancias hace perder el hipoactivo.' },
          { t: 'El hipoactivo: se piensa que el delirio es siempre agitación', ok: true }],
        explicacion: `El más frecuente es el <span class="hl-rojo">hipoactivo</span>, y se pasa por alto por la idea de que el delirio es siempre agitación (${pag(5)}).` + enFicha('mn-delirio', 'mn-del-tipos') },
      { id: 'mnd-g2', corto: 'qué sedante evitar', tipo: 'test', fuente: 'mn-del-sedacion · mn-tabla-45-2',
        enunciado: 'Para prevenir el delirio en tu paciente ventilado, ¿qué sedante evitas primero?',
        opciones: [
          { t: 'Propofol', porque: 'No es el principal promotor que cita la ficha (p. 5). Retirarlo y dejar la benzodiacepina mantendría el delirio.' },
          { t: 'Benzodiacepinas, principales promotoras del delirio', ok: true },
          { t: 'Dexmedetomidina', porque: 'Es el fármaco preferido en la Tabla 45.2 (p. 6-7). Quitarlo le haría perder la alternativa más recomendada.' }],
        explicacion: `Las <span class="hl-rojo">benzodiacepinas</span> son las principales promotoras (${pag(5)}); la dexmedetomidina es la preferida de la Tabla 45.2 (${pag(6, 'p. 6-7')}).` + enFicha('mn-delirio', 'mn-del-sedacion') },
      { id: 'mnd-g3', corto: 'CAM-ICU', tipo: 'test', fuente: 'mn-cam-calc',
        enunciado: 'Cambio agudo fluctuante sí, inatención sí, pensamiento desorganizado no, nivel de consciencia alterado (letárgico) sí. ¿CAM-ICU?',
        calculadora: { ir: 'mn-cam-calc', nombre: 'CAM-ICU' },
        opciones: [
          { t: 'Negativo: falla el criterio III', porque: 'Basta el III o el IV (Apéndice 2). Dar el CAM por negativo dejaría sin diagnóstico a un delirio hipoactivo.' },
          { t: 'Positivo: I + II + IV', ok: true },
          { t: 'No valorable: faltan los cuatro criterios', porque: 'La calculadora solo necesita I, II y uno de III o IV. Esperar al cuarto retrasa el diagnóstico.' }],
        explicacion: `<span class="hl">CAM-ICU = I + II + (III o IV)</span> (Apéndice 2). Aquí I, II y IV son positivos: delirio.` + enFicha('mn-delirio', 'mn-cam-calc'),
        modelo: visual('mn-delirio', '👁️ CAM-ICU paso a paso (vista Visual)') },
      { id: 'mnd-g4', corto: 'frente a demencia', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mn-del-demencia',
        enunciado: 'Delirio y demencia comparten inatención y pensamiento desorganizado. ¿Qué tiene el delirio que no tiene la demencia?',
        puntos: ['<span class="hl-rojo">Comienzo agudo</span>.', '<span class="hl">Curso fluctuante</span>.'],
        explicacion: `Son lo que los separa en la ficha (${pag(5)}).` + enFicha('mn-delirio', 'mn-del-demencia') },
      { id: 'mnd-g5', corto: 'para qué el fármaco', tipo: 'test', fuente: 'mn-del-tratamiento',
        enunciado: '¿Para qué das haloperidol o dexmedetomidina a un paciente con delirio?',
        opciones: [
          { t: 'Para acortar la duración del delirio y reducir los días de ventilación', porque: 'Ningún fármaco corrige el delirio (p. 5). Esperar que acorte la evolución lleva a seguir subiendo la dosis.' },
          { t: 'Solo para calmar al muy agitado; ninguno lo corrige', ok: true },
          { t: 'Para prevenirlo en el anciano ingresado en la UCI desde el primer día', porque: 'Ningún fármaco previene el delirio (p. 5). Dar haloperidol «por si acaso» solo añade QT largo y sedación.' }],
        explicacion: `Ningún fármaco previene ni corrige el delirio; se usan solo para <span class="hl">calmar al muy agitado</span> (${pag(5)}).` + enFicha('mn-delirio', 'mn-del-tratamiento') }
    ],
    examen: [
      { id: 'mnd-e1', corto: 'psicosis en el delirio', tipo: 'test', fuente: 'mn-del-psicosis',
        enunciado: '¿Qué porcentaje de hospitalizados con delirio tiene síntomas psicóticos?',
        opciones: [
          { t: '>40 %', ok: true },
          { t: '25-50 %', porque: 'Es la incidencia del delirio en la UCI (p. 4), no los síntomas psicóticos. Con esa cifra mezclarías dos datos.' },
          { t: 'Alrededor del 10 %', porque: 'Subestima la frecuencia de la ficha (p. 5): el delirio con psicosis sería una rareza y se confundiría con una psicosis primaria.' }],
        explicacion: `Más del 40 % de los hospitalizados con delirio tienen síntomas psicóticos (${pag(5)}). El 25-50 % es la incidencia en la UCI (${pag(4, 'p. 4')}).` + enFicha('mn-delirio', 'mn-del-psicosis') },
      { id: 'mnd-e2', corto: 'haloperidol sin efecto', tipo: 'test', fuente: 'mn-tabla-45-2 · mn-comparativa-delirio',
        enunciado: 'Haloperidol 5 mg IV sin efecto a los 15 min. ¿Qué dice la Tabla 45.2?',
        opciones: [
          { t: 'Repetir 5 mg cada 15 min hasta un máximo de 20 mg y mantener con 5 mg', porque: 'No es lo que escribe la tabla (p. 6-7). Esa pauta acumula dosis y alarga el QT.' },
          { t: 'Doblar a 10 mg o cambiar de fármaco; mantener con el 25 % cada 6 h', ok: true },
          { t: 'Mantener con el 50 % de la dosis eficaz cada 4 h', porque: 'La tabla da el 25 % cada 6 h (p. 6-7). Duplicar el mantenimiento sobresedaría y alargaría el QT.' }],
        explicacion: `Tabla 45.2 (${pag(6, 'p. 6-7')}): <span class="hl">doblar la dosis o cambiar de fármaco</span>; mantenimiento con el 25 % de la dosis eficaz cada 6 h.`,
        nota: '<b>Las fuentes discrepan.</b> El cap. 6 de Marino da «a los 20 min y cada 4-6 h». No se elige ganadora.' + enFicha('mn-delirio', 'mn-comparativa-delirio') },
      { id: 'mnd-e3', corto: 'sin vía venosa', tipo: 'test', fuente: 'mn-tabla-45-2',
        enunciado: 'Paciente muy agitado sin vía venosa. Según la Tabla 45.2, ¿qué fármaco ofrece una vía que le sirve?',
        opciones: [
          { t: 'Dexmedetomidina IM, a la misma dosis que por vía intravenosa', porque: 'La tabla no la da por vía IM (p. 6-7). Sin vía venosa, esperar su efecto sería dejarlo agitado.' },
          { t: 'Ziprasidona IM: 10 mg/2 h o 20 mg/4 h, máx. 40 mg/día', ok: true },
          { t: 'Haloperidol 5 mg IV, buscando la vía', porque: 'Sin vía venosa no se puede dar IV (p. 6-7); perder minutos con un paciente que se arranca los accesos es peligroso.' }],
        explicacion: `Tabla 45.2 (${pag(6, 'p. 6-7')}): ziprasidona IM, <span class="hl">10 mg/2 h o 20 mg/4 h, máx. 40 mg/día</span>.`,
        nota: '<b>Nota de interpretación.</b> La ziprasidona también existe por vía oral; aquí se pregunta, como lo dice Marino, por su vía IM útil sin acceso venoso.' + enFicha('mn-delirio', 'mn-tabla-45-2') },
      { id: 'mnd-e4', corto: 'efecto de la dexmedetomidina', tipo: 'test', fuente: 'mn-tabla-45-2',
        enunciado: 'Además de bradicardia e hipotensión, ¿qué efecto adverso de la dexmedetomidina describe la Tabla 45.2?',
        opciones: [
          { t: 'Prolongación del QT', porque: 'Es del haloperidol (p. 6-7). Atribuirla a la dexmedetomidina haría vigilar el ECG donde no toca.' },
          { t: 'Abstinencia con hiperexcitabilidad', ok: true },
          { t: 'Depresión respiratoria marcada', porque: 'No es el efecto que cita la tabla (p. 7). Esperarlo desvía la vigilancia de la hiperexcitabilidad real al retirarla.' }],
        explicacion: `Tabla 45.2 (${pag(7)}): bradicardia, hipotensión y <span class="hl-rojo">abstinencia con hiperexcitabilidad</span>.` + enFicha('mn-delirio', 'mn-tabla-45-2') },
      { id: 'mnd-e5', corto: 'prevención', tipo: 'test', fuente: 'mn-del-prevencion',
        enunciado: 'Dolor, sueño, familia, movilización y evitar benzodiacepinas: ¿qué ha pasado con estas medidas de prevención en el crítico?',
        opciones: [
          { t: 'Reducen el delirio a la mitad', porque: 'La ficha no da esa cifra (p. 7). Prometerla llevaría a retirar la vigilancia por creer el delirio prevenido.' },
          { t: 'No han funcionado', ok: true },
          { t: 'Funcionan solo en el anciano', porque: 'La ficha no lo dice (p. 7). Aplicarlas solo en ancianos dejaría sin ellas al resto.' }],
        explicacion: `En el crítico las medidas de prevención <span class="hl-rojo">no han funcionado</span> (${pag(7)}).` + enFicha('mn-delirio', 'mn-del-prevencion') }
    ],
    casos: [
      { id: 'mnd-genoveva', titulo: 'Genoveva, 79 años: la que ayer estaba despierta', corto: 'Caso · Genoveva', sub: 'neumonía, ventilación mecánica; 60 kg',
        paciente: { Edad: '79 años', Peso: '60 kg', Motivo: 'Neumonía en ventilación mecánica', Sedación: 'midazolam' },
        lleva: ['El hipoactivo es el frecuente y se escapa.', 'CAM-ICU = I + II + (III o IV).', 'Ningún fármaco corrige el delirio; con QTc >500, sin haloperidol.'],
        volver: { nombre: 'Delirio: Tabla 45.2', ancla: 'mn-tabla-45-2' },
        pasos: [
          { momento: 'Día 2 de ventilación · 10:00', datos: { Estado: 'abre los ojos a la voz, no sigue órdenes, se vuelve a dormir; ayer estaba despierta' }, nuevo: ['Estado'], calculadora: { ir: 'mn-cam-calc', nombre: 'CAM-ICU' },
            pregunta: { id: 'mnd-g-1', corto: 'qué es esto', tipo: 'test', fuente: 'mn-del-tipos · mn-cam-calc',
              enunciado: 'Usa el CAM-ICU: fluctuante sí, inatención sí, nivel alterado (letárgica) sí. ¿Qué es?',
              opciones: [
                { t: 'Sedación adecuada: no es delirio', porque: 'Estaba despierta ayer y hoy fluctúa: es un cambio agudo. Llamarlo sedación adecuada deja sin tratar el hipoactivo.' },
                { t: 'Delirio hipoactivo', ok: true },
                { t: 'Un delirio hiperactivo que aún no se ha agitado', porque: 'Se está apagando, no agitando. Esperar la agitación retrasaría el diagnóstico (p. 5).' }],
              explicacion: `I + II + IV positivos: <span class="hl-rojo">delirio hipoactivo</span> (${pag(5)}).` } },
          { momento: 'Día 2 · plan', datos: { Plan: 'qué cambiar primero' }, nuevo: ['Plan'],
            pregunta: { id: 'mnd-g-2', corto: 'qué cambias', tipo: 'test', fuente: 'mn-del-sedacion · mn-del-tratamiento',
              enunciado: '¿Qué cambias primero?',
              opciones: [
                { t: 'Retirar la benzodiacepina, principal promotora', ok: true },
                { t: 'Haloperidol 5 mg: no está agitada, pero ayuda a corregirlo', porque: 'No está agitada y el haloperidol no trata el delirio (p. 5). Solo añadiría QT largo.' },
                { t: 'Aumentar el midazolam para que descanse', porque: 'Las benzodiacepinas promueven el delirio (p. 5); subirlo lo hundiría más.' }],
              explicacion: `Las <span class="hl-rojo">benzodiacepinas</span> son las principales promotoras (${pag(5)}). Ningún fármaco corrige el delirio.` } },
          { momento: 'Día 3 · 03:00', datos: { Estado: 'se arranca la sonda', Constantes: 'FC 112, PA 158/84', ECG: 'QTc 520 ms' }, nuevo: ['Estado', 'Constantes', 'ECG'],
            pregunta: { id: 'mnd-g-3', corto: '¿haloperidol?', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mn-tabla-45-2',
              enunciado: 'Se agita y el ECG da un QTc de 520 ms. ¿Das haloperidol? Razona qué pasa con él y qué eliges.',
              puntos: [
                'Haloperidol <span class="hl-rojo">no si el QTc es >500 ms</span>: en Genoveva, 520 ms.',
                'La <span class="hl-verde">dexmedetomidina</span> es la preferida de la Tabla 45.2.'],
              explicacion: `Tabla 45.2 (${pag(6, 'p. 6-7')}): sin haloperidol con QTc >500 ms; dexmedetomidina como alternativa preferida.` + enFicha('mn-delirio', 'mn-tabla-45-2') } },
          { momento: 'Día 3 · 03:20', datos: { Peso: '60 kg' }, calculadora: { ir: 'mn-dex-calc', nombre: 'Dexmedetomidina' },
            pregunta: { id: 'mnd-g-4', corto: 'dosis de dex', tipo: 'test', fuente: 'mn-dex-calc · mn-tabla-45-2',
              enunciado: 'Con la calculadora de dexmedetomidina para 60 kg: ¿qué dosis?',
              opciones: [
                { t: 'Carga de 600 µg y mantenimiento de 12-90 µg/h', porque: 'Es el error de µg/kg: la carga sale de 1 µg/kg, no de 10. Esa dosis daría bradicardia e hipotensión graves.' },
                { t: 'Carga opcional de 60 µg en 10 min; después 12-90 µg/h', ok: true },
                { t: 'Sin carga ni mantenimiento: solo bolos de 60 µg', porque: 'La tabla da una carga opcional y un mantenimiento (p. 6-7); los bolos repetidos darían picos de bradicardia.' }],
              explicacion: `Para 60 kg: <span class="hl">carga 60 µg en 10 min</span> y <span class="hl">12-90 µg/h</span> (${pag(6, 'p. 6-7')}).` + enFicha('mn-delirio', 'mn-dex-calc') } },
          { momento: 'Día 4', datos: { Constantes: 'FC 46, PA 86/50 con 80 µg/h' }, nuevo: ['Constantes'],
            pregunta: { id: 'mnd-g-5', corto: 'bradicardia', tipo: 'test', fuente: 'mn-tabla-45-2',
              enunciado: 'Giro: con 80 µg/h, FC 46 y PA 86/50. ¿Qué haces?',
              opciones: [
                { t: 'Añadir haloperidol: con un QTc de 520 ms es la alternativa', porque: 'Con QTc >500 ms está contraindicado (p. 6-7).' },
                { t: 'Seguir igual: es lo esperable', porque: 'Bradicardia e hipotensión son efectos adversos de la Tabla 45.2 (p. 7); seguir igual puede llevarla a la inestabilidad.' },
                { t: 'Reconocer el efecto de la dexmedetomidina y bajar el ritmo', ok: true }],
              explicacion: `Bradicardia e hipotensión son <span class="hl-rojo">efectos de la dexmedetomidina</span> (Tabla 45.2, ${pag(7, 'p. 7')}): se baja el ritmo.` } },
          { momento: 'Día 5 · el plan del R1', datos: { Plan: 'plan de evolución' }, nuevo: ['Plan'],
            pregunta: { id: 'mnd-g-6', corto: 'plan del R1', tipo: 'error', fuente: 'mn-del-sedacion · mn-tabla-45-2',
              enunciado: 'Plan del R1 para Genoveva. Encuentra los 2 errores.',
              frases: [
                { t: 'Delirio hiperactivo de madrugada.' },
                { t: 'Lorazepam 2 mg cada 4 h si se agita.', mal: true, c: 'Las benzodiacepinas son las <span class="hl-rojo">principales promotoras</span> del delirio (p. 5).' },
                { t: 'Haloperidol 5 mg; si a los 15 min no hay efecto, 10 mg.', mal: true, c: 'En Genoveva no: <span class="hl-rojo">QTc 520 ms, >500</span> (p. 6-7).' },
                { t: 'Dexmedetomidina en lugar de haloperidol.' },
                { t: 'CAM-ICU cada turno.' }],
              explicacion: `Benzodiacepinas (${pag(5, 'p. 5')}) y haloperidol con QTc >500 (${pag(6, 'p. 6-7')}) son los dos errores; el haloperidol es un error <b>de Genoveva</b>, no de la pauta. La dexmedetomidina es la preferida y el CAM-ICU está validado.` + enFicha('mn-delirio', 'mn-tabla-45-2') } }
        ] }
    ],
    profundizar: [
      { id: 'mn-comparativa-delirio' }, { id: 'mn-nota-cam' }, { id: 'mn-del-causas' }
    ]
  },

  /* =================================================================================================
     Ficha 3 · Abstinencia alcohólica (cap. 45, págs. 7-9)
     ================================================================================================= */
  'mn-abstinencia': {
    entrada: 'La abstinencia alcohólica como un reloj desde la última copa: qué toca a cada hora, qué das, cuándo es resistente y qué se olvida.',
    guia: [
      { id: 'mna-g1', corto: 'por qué excita', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mn-abstinencia',
        enunciado: 'El alcohol sedante da una abstinencia que excita. ¿Por qué?',
        puntos: [
          'El alcohol <span class="hl-azul">estimula la liberación de GABA</span>, un inhibidor.',
          'El consumo crónico <span class="hl">aumenta la densidad de receptores GABA</span>.'],
        explicacion: `Mecanismo de la ficha (${pag(7)}): las benzodiacepinas actúan también sobre el GABA.` + enFicha('mn-abstinencia', 'mn-abstinencia') },
      { id: 'mna-g2', corto: 'a las 10 h', tipo: 'test', fuente: 'mn-tabla-45-3 · mn-oh-orden', calculadora: { ir: 'mn-oh-calc', nombre: '¿Qué esperar ahora?' },
        enunciado: 'Predice, y luego mueves las horas en la calculadora: a las 10 h de la última copa, ¿qué puede haber y qué aún no?',
        opciones: [
          { t: 'Delirium tremens: es lo más grave y lo que primero aparece tras la última copa', porque: 'El delirium tremens no entra hasta las 48-96 h (p. 8). Pensarlo a las 10 h llevaría a una sedación excesiva.' },
          { t: 'Precoz (6-8 h) y convulsiones posibles (6-48 h); aún no el DT (48-96 h)', ok: true },
          { t: 'Nada todavía: los síntomas empiezan a las 24 h', porque: 'La abstinencia precoz empieza a las 6-8 h (p. 8). Esperar a las 24 h desprotege el tramo en que ya pueden darse convulsiones.' }],
        explicacion: `Tabla 45.3 (${pag(8)}): precoz 6-8 h, convulsiones 6-48 h, delirium tremens 48-96 h.` + enFicha('mn-abstinencia', 'mn-tabla-45-3'),
        origen: 'ficha; la calculadora, ilustrativo',
        modelo: visual('mn-abstinencia', '👁️ Desde la última copa (vista Visual)') },
      { id: 'mna-g3', corto: 'convulsión', tipo: 'test', fuente: 'mn-oh-convulsiones',
        enunciado: 'Convulsión generalizada a las 20 h de la última copa. ¿Qué das?',
        opciones: [
          { t: 'Fenitoína 20 mg/kg: es lo estándar', porque: 'No está indicada en la abstinencia (p. 7-8); sumaría efectos adversos sin prevenir recurrencias.' },
          { t: 'Levetiracetam en dosis de carga, como en el estado epiléptico', porque: 'La ficha no lo indica aquí (p. 7-8). Una convulsión de abstinencia se previene con benzodiacepinas.' },
          { t: 'Lorazepam 2 mg IV, que previene recurrencias', ok: true }],
        explicacion: `<span class="hl">Lorazepam 2 mg IV</span> previene las recurrencias; la fenitoína no está indicada (${pag(7, 'p. 7-8')}).` + enFicha('mn-abstinencia', 'mn-oh-convulsiones') },
      { id: 'mna-g4', corto: 'parar a las 48 h', tipo: 'test', fuente: 'mn-oh-uci', calculadora: { ir: 'mn-lzp-calc', nombre: 'Lorazepam y propilenglicol' },
        enunciado: '¿Por qué parar a las 48 h una infusión de lorazepam de ≥0,1 mg/kg/h?',
        opciones: [
          { t: 'Por la tolerancia que se crea a la benzodiacepina', porque: 'No es el motivo de la ficha (p. 8). Cambiar por tolerancia no evitaría el daño real del disolvente.' },
          { t: 'Por depresión respiratoria', porque: 'En ventilación mecánica no es el problema a las 48 h (p. 8). Vigilarla no previene la toxicidad real.' },
          { t: 'Por la toxicidad del propilenglicol', ok: true }],
        explicacion: `La infusión de lorazepam lleva <span class="hl-rojo">propilenglicol</span> y es tóxica pasadas 48 h a ≥0,1 mg/kg/h (también el diazepam) (${pag(8)}).` + enFicha('mn-abstinencia', 'mn-oh-uci') },
      { id: 'mna-g5', corto: 'por qué empeora', tipo: 'test', fuente: 'mn-oh-wernicke',
        enunciado: '¿Por qué empeora la mente a los pocos días del ingreso con sueros glucosados?',
        opciones: [
          { t: 'Hipoglucemia de rebote', porque: 'La ficha no lo da como mecanismo (p. 9). Vigilar la glucemia no evitaría el Wernicke.' },
          { t: 'La glucosa gasta la poca tiamina que quedaba', ok: true },
          { t: 'El delirium tremens tardío, que aparece a los 5 días', porque: 'El delirio de más de 5 días obliga a buscar otra causa (p. 8). Etiquetar de DT retrasa tratar el Wernicke.' }],
        explicacion: `Mecanismo del <span class="hl-rojo">Wernicke</span>: la glucosa consume la tiamina residual (${pag(9)}).` + enFicha('mn-abstinencia', 'mn-oh-wernicke') }
    ],
    examen: [
      { id: 'mna-e1', corto: 'qué delirio no hay', tipo: 'test', fuente: 'mn-oh-dt',
        enunciado: '¿Qué forma del delirio no existe en la abstinencia alcohólica?',
        opciones: [
          { t: 'La hiperactiva', porque: 'Es la forma típica del delirium tremens (p. 8). Negarla dejaría sin reconocer lo más característico.' },
          { t: 'La hipoactiva', ok: true },
          { t: 'La mixta', porque: 'La ficha solo excluye una forma (p. 8). Descartar la mixta sería diagnosticar de menos.' }],
        explicacion: `En la abstinencia alcohólica <span class="hl">no hay delirio hipoactivo</span> (${pag(8)}).` + enFicha('mn-abstinencia', 'mn-oh-dt') },
      { id: 'mna-e2', corto: 'DT > 5 días', tipo: 'test', fuente: 'mn-oh-dt',
        enunciado: 'Un delirium tremens que dura más de 5 días: ¿qué haces?',
        opciones: [
          { t: 'Buscar otra causa', ok: true },
          { t: 'Añadir fenobarbital', porque: 'Es un tratamiento de la resistencia (p. 9), no de un delirio que ya sobrepasa lo esperable.' },
          { t: 'Duplicar la dosis de lorazepam', porque: 'Un delirio más largo de lo habitual no se debe a poca benzodiacepina (p. 8), y la dosis excesiva alarga la sedación.' }],
        explicacion: `Más de 5 días: <span class="hl-rojo">buscar otra causa</span> (${pag(8)}).` + enFicha('mn-abstinencia', 'mn-oh-dt') },
      { id: 'mna-e3', corto: 'resistencia', tipo: 'test', fuente: 'mn-oh-resistencia',
        enunciado: '¿Qué define la resistencia a las benzodiacepinas?',
        opciones: [
          { t: 'No controlar al paciente con 10 mg de lorazepam en 1 h', porque: 'Es una dosis muy inferior a la definición (p. 8-9); declararlo resistente lleva a intubarlo antes de tiempo.' },
          { t: 'No controlarlo con 30-40 mg de lorazepam o 150-200 mg de diazepam IV, pero en 24 h', porque: 'El tiempo de la ficha es de 3-4 h (p. 8-9); con 24 h se tardaría en actuar.' },
          { t: 'No controlarlo con 30-40 mg de lorazepam o 150-200 mg de diazepam IV en 3-4 h', ok: true }],
        explicacion: `<span class="hl-rojo">30-40 mg de lorazepam o 150-200 mg de diazepam IV en 3-4 h</span> sin control (${pag(8, 'p. 8-9')}).` + enFicha('mn-abstinencia', 'mn-oh-resistencia') },
      { id: 'mna-e4', corto: 'complemento intubado', tipo: 'test', fuente: 'mn-oh-propofol · mn-oh-fenobarbital · mn-oh-dex',
        enunciado: 'En un paciente intubado y resistente, ¿qué complemento es el preferido?',
        opciones: [
          { t: 'Dexmedetomidina: experiencia poco alentadora', porque: 'La ficha la califica de poco alentadora (p. 9); apostar por ella dejaría la abstinencia sin control.' },
          { t: 'Fenobarbital 130-260 mg cada 15-20 min', porque: 'Es eficaz, pero con cautela por la hipotensión y la depresión respiratoria (p. 9); no es el preferido.' },
          { t: 'Propofol', ok: true }],
        explicacion: `El <span class="hl">propofol</span> es el preferido en el intubado (${pag(9)}); el fenobarbital es eficaz con cautela y la dexmedetomidina, poco alentadora.` + enFicha('mn-abstinencia', 'mn-oh-propofol') },
      { id: 'mna-e5', corto: 'qué escala', tipo: 'test', fuente: 'mn-oh-escalas',
        enunciado: '¿Qué escala usas en el delirio de la abstinencia?',
        opciones: [
          { t: 'CIWA-Ar, la de la abstinencia', porque: 'No se recomienda en el delirio (p. 7); usarla ahí daría una medida poco fiable.' },
          { t: 'CAM-ICU; la CIWA-Ar no se recomienda en el delirio', ok: true },
          { t: 'Ninguna: el delirium tremens se diagnostica a ojo', porque: 'La ficha recomienda el CAM-ICU (p. 7); sin escala se pierde seguimiento.' }],
        explicacion: `En el delirio, <span class="hl">CAM-ICU</span>; la CIWA-Ar no se recomienda (${pag(7)}).` + enFicha('mn-abstinencia', 'mn-oh-escalas') },
      { id: 'mna-e6', corto: 'gabapentina', tipo: 'test', fuente: 'mn-oh-gabapentina',
        enunciado: 'Delirio hiperactivo 3 días después de suspender gabapentina 3.600 mg/día; las benzodiacepinas no hacen nada. ¿Qué es?',
        opciones: [
          { t: 'Un delirium tremens resistente', porque: 'No hay consumo de alcohol en el enunciado (p. 9). Intubar y pautar propofol trataría la causa equivocada.' },
          { t: 'Abstinencia de gabapentina', ok: true },
          { t: 'Una crisis no convulsiva', porque: 'La clínica es de un delirio hiperactivo por retirada (p. 9); buscar crisis desviaría el estudio.' }],
        explicacion: `Abstinencia de gabapentina (≥3.000 mg/día; 12 h-7 días): <span class="hl-rojo">las benzodiacepinas no sirven</span> (${pag(9)}).` + enFicha('mn-abstinencia', 'mn-oh-gabapentina') }
    ],
    casos: [
      { id: 'mna-baldomero', titulo: 'Baldomero, 44 años: el reloj desde la última copa', corto: 'Caso · Baldomero', sub: 'pancreatitis; bebe a diario; 70 kg',
        paciente: { Edad: '44 años', Peso: '70 kg', Motivo: 'Pancreatitis', Hábito: 'bebe a diario' },
        lleva: ['La Tabla 45.3 es un reloj desde la última copa.', '30-40 mg de lorazepam en 3-4 h = resistencia: intubado, propofol.', 'La glucosa gasta la tiamina: el Wernicke se olvida.'],
        volver: { nombre: 'Abstinencia: Tabla 45.3', ancla: 'mn-tabla-45-3' },
        pasos: [
          { momento: 'Hora 10 desde la última copa', datos: { Clínica: 'temblor, ansiedad, náuseas', Constantes: 'FC 104, PA 150/90' }, nuevo: ['Clínica', 'Constantes'], calculadora: { ir: 'mn-oh-calc', nombre: '¿Qué esperar ahora?' },
            pregunta: { id: 'mna-b-1', corto: 'hora 10', tipo: 'test', fuente: 'mn-tabla-45-3 · mn-oh-calc',
              enunciado: 'Con la calculadora a 10 h: ¿en qué fase está?',
              opciones: [
                { t: 'Delirium tremens inminente, con fiebre y alucinaciones a punto de aparecer', porque: 'El DT empieza a las 48-96 h (p. 8). Sedarlo ahora como un DT le daría dosis de más.' },
                { t: 'Abstinencia precoz, con la ventana de convulsiones abierta', ok: true },
                { t: 'Aún no hay abstinencia: faltan 24 h', porque: 'La precoz arranca a las 6-8 h (p. 8). Esperar a las 24 h dejaría sin protección al paciente en la ventana de convulsiones.' }],
              explicacion: `Tabla 45.3 (${pag(8)}): precoz a las 6-8 h; convulsiones entre las 6 y las 48 h.` + enFicha('mn-abstinencia', 'mn-tabla-45-3'),
              origen: 'ficha; la calculadora, ilustrativo' } },
          { momento: 'Hora 20', datos: { Evento: 'convulsión generalizada de 1 min; recupera' }, nuevo: ['Evento'],
            pregunta: { id: 'mna-b-2', corto: 'plan tras la convulsión', tipo: 'error', fuente: 'mn-oh-convulsiones · mn-oh-escalas',
              enunciado: 'Plan del R1 tras la convulsión. Encuentra los 2 errores.',
              frases: [
                { t: 'Lorazepam 2 mg IV.' },
                { t: 'Añado fenitoína para evitar recurrencias.', mal: true, c: 'La fenitoína <span class="hl-rojo">no está indicada</span> en la abstinencia (p. 8).' },
                { t: 'Escala CIWA-Ar si aparece delirio.', mal: true, c: 'En el delirio se usa el <span class="hl">CAM-ICU</span> (p. 7).' },
                { t: 'En la UCI, siempre por vía IV.' }],
              explicacion: `Fenitoína (${pag(8, 'p. 8')}) y CIWA-Ar en el delirio (${pag(7, 'p. 7')}) son los errores; el lorazepam IV y la vía IV en la UCI son correctos.` + enFicha('mn-abstinencia', 'mn-oh-convulsiones') } },
          { momento: 'Día 2 · hora 60', datos: { Clínica: 'T 38,6 °C, FC 128, PA 165/100, alucinaciones, agitado' }, nuevo: ['Clínica'],
            pregunta: { id: 'mna-b-3', corto: 'hora 60', tipo: 'test', fuente: 'mn-oh-dt · mn-tabla-45-3',
              enunciado: '¿Qué estás viendo?',
              opciones: [
                { t: 'Una sepsis abdominal, sin relación con la abstinencia', porque: 'Hay que buscarla, pero el reloj y la clínica encajan con DT (p. 8); descartar la abstinencia dejaría sin tratar su causa.' },
                { t: 'Delirium tremens: entra en la ventana de 48-96 h', ok: true },
                { t: 'Abstinencia precoz que ha empeorado', porque: 'La precoz es de las 6-8 h (p. 8); con fiebre, alucinaciones y disautonomía a las 60 h es un DT.' }],
              explicacion: `Tabla 45.3 (${pag(8)}): <span class="hl-rojo">delirium tremens, 48-96 h</span>.` + enFicha('mn-abstinencia', 'mn-oh-dt') } },
          { momento: 'Día 2 · tras 3 h de tratamiento', datos: { Lorazepam: '4 mg cada 5-10 min durante 3 h: 36 mg en total', Estado: 'sigue agitado' }, nuevo: ['Lorazepam', 'Estado'],
            pregunta: { id: 'mna-b-4', corto: 'resistente', tipo: 'test', fuente: 'mn-oh-resistencia · mn-oh-propofol',
              enunciado: '36 mg de lorazepam en 3 h y sigue agitado. ¿Qué haces?',
              opciones: [
                { t: 'Otros 40 mg de lorazepam en la hora siguiente, hasta controlarlo', porque: 'Ya cumple la resistencia (p. 8-9); más lorazepam suma depresión respiratoria sin control.' },
                { t: 'Dexmedetomidina sola', porque: 'La experiencia es poco alentadora (p. 9); lo dejaría sin control.' },
                { t: 'Es resistente: intubar y añadir propofol', ok: true }],
              explicacion: `Resistencia = <span class="hl-rojo">30-40 mg de lorazepam en 3-4 h</span> sin control (${pag(8, 'p. 8-9')}); intubado, el complemento preferido es el propofol (${pag(9, 'p. 9')}).` } },
          { momento: 'Día 3 a 5', datos: { Peso: '70 kg', Infusión: 'lorazepam 8 mg/h durante 50 h' }, nuevo: ['Infusión'], calculadora: { ir: 'mn-lzp-calc', nombre: 'Lorazepam y propilenglicol' },
            pregunta: { id: 'mna-b-5', corto: 'propilenglicol', tipo: 'test', fuente: 'mn-oh-uci',
              enunciado: 'Con la calculadora (70 kg, 8 mg/h, 50 h): ¿qué haces?',
              opciones: [
                { t: 'Seguir con 8 mg/h: la dosis es baja para su peso', porque: 'Son 0,114 mg/kg/h (≥0,1) y más de 48 h (p. 8): seguir acumula propilenglicol y su toxicidad.' },
                { t: '0,114 mg/kg/h durante >48 h: retirar o cambiar el fármaco', ok: true },
                { t: 'Subir a 12 mg/h y mantener la infusión hasta que ceda la agitación del todo', porque: 'Sube aún más la dosis tóxica (p. 8) y acelera la acumulación de propilenglicol.' }],
              explicacion: `8 mg/h ÷ 70 kg = <span class="hl">0,114 mg/kg/h</span>, más de 48 h: toxicidad del propilenglicol (${pag(8)}).` + enFicha('mn-abstinencia', 'mn-oh-uci'),
              origen: 'ficha; la cuenta, con el peso del caso' } },
          { momento: 'Día 7', datos: { Situación: 'extubado; glucosado al 5 % desde el ingreso con tiamina 100 mg/día', Clínica: 'confuso de nuevo, nistagmo, no abduce el ojo derecho' }, nuevo: ['Situación', 'Clínica'],
            pregunta: { id: 'mna-b-6', corto: 'confuso de nuevo', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'mn-oh-wernicke · mn-oh-dt',
              enunciado: 'Giro: extubado, confuso de nuevo, con nistagmo y sin abducir el ojo derecho. ¿Qué cuadra?',
              puntos: [
                'Un delirio de <span class="hl-rojo">más de 5 días</span>: hay que buscar otra causa.',
                '<span class="hl-rojo">Wernicke</span>: la glucosa gasta la tiamina que quedaba.',
                'Los 100 mg/día de tiamina <span class="hl">no bastan para tratarlo</span>.'],
              explicacion: `Delirio >5 días (${pag(8, 'p. 8')}); glucosa y tiamina, y dosis insuficiente (${pag(9, 'p. 9')}). La dosis de tratamiento no está en el cap. 45: está en el cap. 48.` + enFicha('mu-tiamina', 'mu-tiamina', 'marinoNutricion', 'panel-marino-nutri-tabs') } },
          { momento: 'Día 7 · después', datos: { Pregunta: 'qué pedir al cap. 48' }, nuevo: ['Pregunta'],
            pregunta: { id: 'mna-b-7', corto: 'la dosis de tiamina', tipo: 'test', fuente: 'mu-tiamina · mn-oh-wernicke',
              enunciado: '¿Qué le pides al cap. 48 sobre la tiamina?',
              opciones: [
                { t: '100 mg IV una vez', porque: 'Esa cifra no es la dosis de tratamiento: ya recibía 100 mg/día y desarrolló el Wernicke (p. 9).' },
                { t: 'La dosis de tratamiento: el cap. 45 no la da', ok: true },
                { t: 'Nada: la glucosa de los sueros corrige la falta de tiamina', porque: 'Es al revés: la glucosa gasta la tiamina que queda (p. 9), y empeoraría el Wernicke.' }],
              explicacion: `El cap. 45 no da la dosis; se enlaza con el cap. 48 y no se inventa (${pag(9, 'p. 9')}).` + enFicha('mu-tiamina', 'mu-tiamina', 'marinoNutricion', 'panel-marino-nutri-tabs'),
              nota: '<b>La fuente no lo dice.</b> La dosis de tiamina para tratar el Wernicke no está en el cap. 45; se consulta en el cap. 48.' } }
        ] }
    ],
    profundizar: [
      { id: 'mn-oh-dex' }, { id: 'mn-oh-propofol', titulo: 'Propofol', nota: 'Su dosis y su síndrome de infusión están en el cap. 6 de Marino.' }, { id: 'mn-oh-gabapentina' }
    ]
  }
};
