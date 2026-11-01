// Mayéutica del bloque 3D (Marino cap. 23, págs. 25-29 del PDF): ficha neumo-epoc-vpp y el caso de Jacinto.
// Datos puros; el formato está en la cabecera de b1-fluidos.js. Modelo vivo: pulmón vivo (estados «broncoespasmo-auto-peep»,
// «auto-peep-corregida», «vpp-corazon-normal»). Las cifras del respirador de Jacinto se leyeron en el monitor de la app a 390 px
// (autonomo/bloques/b3/herramientas/m-pulmon-cifras.mjs), no en el motor; los datos «(del paciente)» son del caso inventado.
const PDF = 'docs/marino-2024-respiratory-management-caps22-26.pdf';
const p = n => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">cap. 23, pág. ${n}</a>`;
const p26 = n => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">cap. 26, pág. ${n}</a>`;
const NEU = 'data-especialidad="neumologia" data-view="merinoNeumologia" data-panel="panel-merino-neumo-tabs"';
const enFicha = (tab, id) => ` <button type="button" class="may-ir" ${NEU} data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const EV = 'neumo-epoc-vpp';
const pv = (clave, texto) => ({ pulmonVivo: clave, texto });

export const MAYEUTICA_EPOC = {
  'neumo-epoc-vpp': {
    entrada: 'La EPOC aguda se trata como el asma, pero con otras dosis, O₂ a 88-92 % y ventilación no invasiva primero; y si hay que ventilarla, la única regla es dar tiempo para exhalar.',
    guia: [
      { id: 'ev-g1', corto: 'causas', tipo: 'test', fuente: 'nep-epoc-causas',
        enunciado: 'Un paciente con EPOC ingresa por una exacerbación. Antes de ajustar el tratamiento, ¿qué tres causas hay que buscar según Marino?',
        opciones: [
          { t: 'Infección respiratoria, embolia pulmonar encubierta e insuficiencia cardíaca izquierda', ok: true },
          { t: 'Neumotórax a tensión, derrame pleural masivo y ansiedad; la infección rara vez las desencadena', porque: `La causa más frecuente es la infección respiratoria (${p(25)}); si la descartas por rutina, dejarías sin tratar la que más se repite.` },
          { t: 'Solo la infección: el resto de los desencadenantes no suele identificarse', porque: `Marino nombra también la embolia encubierta y la IC izquierda (${p(25)}); sin buscarlas, un émbolo o un corazón que falla seguirían sin tratar.` }],
        explicacion: `Las exacerbaciones son, con más frecuencia, <span class="hl-azul">infección respiratoria, embolia pulmonar encubierta o insuficiencia cardíaca izquierda</span>; en algunos casos no se identifica ninguna (${p(25)}).` + enFicha(EV, 'nep-epoc-causas') },
      { id: 'ev-g2', corto: 'Tabla 23.4', tipo: 'test', fuente: 'nep-tabla-23-4',
        enunciado: 'Según la Tabla 23.4, ¿cómo se dan los broncodilatadores en la exacerbación de EPOC?',
        opciones: [
          { t: 'Ipratropio de entrada junto al albuterol, siempre combinados, y a las mismas dosis que en el asma casi fatal', porque: `El ipratropio es terapia combinada solo si la respuesta a los β₂-agonistas es insatisfactoria, y al menos 3 estudios no lo apoyan (${p(25)}); se añadiría una dosis sin beneficio demostrado.` },
          { t: 'Albuterol cada 4-6 h, mejor con inhalador y espaciador; el ipratropio solo si la respuesta no basta', ok: true },
          { t: 'Albuterol en perfusión continua, como en el asma casi fatal, porque el EPOC es igual de reversible', porque: `La Tabla 23.4 da dosis intermitentes cada 4-6 h, distintas de las del asma (${p(25)}); además, el EPOC se caracteriza por una falta de respuesta broncodilatadora en las pruebas de función.` }],
        explicacion: `Los mismos fármacos que en el asma, con <span class="hl-azul">otra dosificación</span>: albuterol 2,5-5 mg por nebulizador o 2-8 puffs con espaciador cada 4-6 h, y se favorece el inhalador por respuesta equivalente con una dosis mucho menor; <span class="hl-rojo">ipratropio solo si la respuesta es insatisfactoria</span> (${p(25)}).` + enFicha(EV, 'nep-tabla-23-4') },
      { id: 'ev-g3', corto: 'corticoides', tipo: 'test', fuente: 'nep-corticoides-epoc',
        enunciado: '¿Qué pauta de corticoides recomienda Marino en la exacerbación de EPOC?',
        opciones: [
          { t: 'Metilprednisolona IV a dosis altas durante dos semanas, porque la vía IV es más potente', porque: `La vía IV no ofrece ventaja sobre la oral y la pauta recomendada es de 5 días (${p(25)}-${p(26)}); alargarla solo suma efectos adversos (hiperglucemia, por ejemplo).` },
          { t: 'Prednisona 40 mg diarios durante 5 días; por vía oral equivale a la IV en eficacia', ok: true },
          { t: 'Ninguno: el EPOC no responde a broncodilatadores y los esteroides no ayudan', porque: `Los corticoides se asocian a una recuperación más rápida y a menos fracasos de tratamiento (${p(25)}); sin ellos, el paciente tendría más riesgo de fracaso.` }],
        explicacion: `<span class="hl-azul">40 mg de prednisona (o equivalente) diarios durante 5 días</span>; la vía IV no ofrece ventaja sobre la oral (${p(25)}-${p(26)}).` + enFicha(EV, 'nep-corticoides-epoc') },
      { id: 'ev-g4', corto: 'antibióticos', tipo: 'test', fuente: 'nep-antibioticos-epoc',
        enunciado: 'Un paciente con EPOC ingresa en UCI y necesita VNI. No tiene neumonía. ¿Qué haces con el antibiótico y cuánto dura?',
        opciones: [
          { t: 'Lo pospones hasta tener el cultivo de esputo, que dirige la elección', porque: `Los cultivos son problemáticos porque se aíslan los mismos organismos en fase estable y en exacerbación (${p(26)}); esperarlo retrasaría un tratamiento ya indicado.` },
          { t: 'Es candidato: la VNI o VM ya es indicación; tratamiento empírico de 5-7 días', ok: true },
          { t: 'Solo si el esputo es purulento; si no, se supone una causa vírica', porque: `La necesidad de ventilación, invasiva o no, es indicación por sí sola (${p(26)}); dejarlo sin antibiótico por un esputo claro olvida a la mayoría de los ingresos en UCI.` }],
        explicacion: `Las guías recomiendan antibiótico ante más esputo, esputo francamente purulento <span class="hl-rojo">o necesidad de ventilación no invasiva o invasiva</span>; así que <span class="hl-azul">todo ingreso en UCI por exacerbación es candidato</span>, con tratamiento empírico de grampositivos y gramnegativos (p. ej. cefepima) durante 5-7 días (${p(26)}).` + enFicha(EV, 'nep-antibioticos-epoc') },
      { id: 'ev-g5', corto: 'O₂ y PaCO₂', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-o2-epoc',
        enunciado: 'En un EPOC con retención crónica de CO₂, el O₂ alto sube la PaCO₂. ¿Por qué, si el impulso ventilatorio no baja, y qué objetivo de saturación se pone?',
        puntos: [
          `<span class="hl-rojo">No es solo el impulso hipóxico</span>: se atribuyó a perderlo, pero el ascenso de la PCO₂ inducido por O₂ no se acompaña de un descenso del impulso ventilatorio (${p(26)}).`,
          `<span class="hl-azul">Efecto Haldane</span>: el O₂ desplaza el CO₂ de la hemoglobina, y eso puede contribuir (${p(26)}).`,
          `<span class="hl-rojo">Objetivo SaO₂ 88-92 % y no más alta</span>: sea cual sea el mecanismo, hay que evitar concentraciones altas de O₂ inhalado (${p(26)}).`],
        explicacion: `Marino da el mecanismo como incierto («puede jugar un papel»), pero la conducta es clara: <span class="hl-rojo">88-92 %, y no más</span> (${p(26)}).` + enFicha(EV, 'nep-o2-epoc') },
      { id: 'ev-g6', corto: 'VNI: 1 hora', tipo: 'test', fuente: 'nep-vni-epoc',
        enunciado: 'Un EPOC hipercápnico lleva una hora con BiPAP. Según el cap. 23, ¿qué resultado obliga a intubar?',
        opciones: [
          { t: 'Que el paciente siga confuso a la hora, aunque la PaCO₂ haya bajado', porque: `La conciencia tarda más en recuperarse y no es un indicador temprano de fracaso (${p26(81)}); intubarías a quien está respondiendo.` },
          { t: 'Que la PaCO₂ no haya bajado 10 mmHg tras una hora de BiPAP', ok: true },
          { t: 'Que a la hora la PaCO₂ siga alta, sin importar cuánto haya bajado', porque: `El criterio de Marino es la caída respecto a la basal, no un valor absoluto (${p(26)}); quien baja mucho desde una cifra muy alta está respondiendo y lo intubarías sin necesidad.` }],
        explicacion: `Si la BiPAP <span class="hl-rojo">no reduce la PaCO₂ en 10 mmHg tras una hora</span>, es indicación de intubación y ventilación mecánica (${p(26)}). El cap. 26 lo formula como caída de al menos un 10 % (${p26(81)}): son dos formulaciones; se enseñan las dos tal cual.` + enFicha(EV, 'nep-vni-epoc'),
        nota: `<b>Las fuentes discrepan</b>: cap. 23, 10 mmHg; cap. 26, al menos un 10 % de la PaCO₂ basal. La ficha las muestra las dos, sin elegir.` },
      { id: 'ev-g7', corto: 'por qué cuesta', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-hiperinflacion',
        modeloVivo: pv('broncoespasmo-auto-peep', '🫁 Jacinto: el flujo no llega a cero'),
        enunciado: 'El EPOC grave respira hiperinsuflado. ¿Por qué cuesta más respirar así y qué queda al final de la espiración?',
        puntos: [
          `<span class="hl-azul">Aire atrapado</span>: la exhalación se prolonga y no termina antes de la siguiente inhalación; el gas retenido crea una PEEP intrínseca (${p(27)}).`,
          `<span class="hl-azul">Parte plana de la curva presión-volumen</span>: se respira donde cada mL de volumen exige más presión (${p(27)}).`,
          `<span class="hl-rojo">Más presión transpulmonar y más trabajo</span>: hay que generar más presión para meter el mismo volumen, como respirar desde una inspiración profunda (${p(27)}).`],
        explicacion: `La hiperinflación dinámica obliga a respirar en un tramo más plano de la curva P-V: <span class="hl-rojo">más presión transpulmonar para el mismo volumen</span>, es decir, más trabajo respiratorio (${p(27)}).` + enFicha(EV, 'nep-hiperinflacion') },
      { id: 'ev-g8', corto: 'pico y media', tipo: 'test', fuente: 'nep-vpp-consecuencias',
        modeloVivo: pv('vpp-corazon-normal', '🫁 Sube la PEEP: el retorno venoso y el gasto'),
        enunciado: 'La ventilación con presión positiva sube las presiones intratorácicas, más en la hiperinflación. ¿Qué daña cada una: la presión pico y la presión media?',
        opciones: [
          { t: 'La pico sube el retorno venoso; la media produce barotrauma', porque: `Están cambiadas: la pico promueve barotrauma y la media puede impedir el retorno venoso (${p(28)}). Vigilarías la media por el pulmón y la pico por el corazón, al revés.` },
          { t: 'Las dos solo provocan barotrauma, y el retorno venoso depende únicamente del volumen tidal y no de la presión media', porque: `La presión media también puede impedir el retorno venoso al corazón (${p(28)}); un EPOC con media alta podría hipotensarse sin que lo esperes.` },
          { t: 'La pico promueve el barotrauma (p. ej., neumotórax); la media puede impedir el retorno venoso', ok: true }],
        explicacion: `<span class="hl-rojo">Pico alta → barotrauma</span>; <span class="hl-rojo">media alta → menos retorno venoso</span> (${p(28)}). Con el modelo, sube la PEEP y mira el volumen sistólico y el gasto.` + enFicha(EV, 'nep-vpp-consecuencias') },
      { id: 'ev-g9', corto: 'curva de flujo', tipo: 'test', fuente: 'nep-monitor-flujo',
        modeloVivo: pv('broncoespasmo-auto-peep', '🫁 Jacinto: flujo espiratorio al final'),
        enunciado: 'En la curva de flujo del respirador de un EPOC, ¿qué señal prueba que hay hiperinflación dinámica? (Fig. 23.5)',
        opciones: [
          { t: 'El flujo inspiratorio llega pronto a su máximo y cae', porque: `Es la forma de una onda decelerante normal; la señal está en la espiración (${p(28)}). Mirando la inspiración nunca detectarías el atrapamiento.` },
          { t: 'El flujo espiratorio sigue cuando llega la siguiente insuflación', ok: true },
          { t: 'El flujo espiratorio cesa mucho antes de la siguiente insuflación', porque: `Eso es la curva normal, del panel superior de la Fig. 23.5 (${p(28)}); darías por descartado el atrapamiento en quien lo tiene.` }],
        explicacion: `<span class="hl-rojo">Flujo espiratorio al final de la espiración</span> = hiperinflación dinámica (Fig. 23.5, ${p(28)}). Su gravedad se mide con la PEEP intrínseca.` + enFicha(EV, 'nep-monitor-flujo') },
      { id: 'ev-g10', corto: 'ajustes: 2 errores', tipo: 'error', fuente: 'nep-estrategias-ventilador',
        modeloVivo: pv('auto-peep-corregida', '🫁 La espiración alargada'),
        enunciado: 'Nota del residente sobre un EPOC intubado. Hay dos errores. Encuéntralos.',
        frases: [
          { t: 'Vt de 10 mL/kg para lavar bien el CO₂.', mal: true, c: 'Hay que evitar volúmenes de insuflación mayores de 6-8 mL/kg.' },
          { t: 'Sedo lo justo para enlentecer la frecuencia respiratoria rápida.' },
          { t: 'Subo el flujo inspiratorio para dar más tiempo a la espiración.' },
          { t: 'Reparto el ciclo con la inspiración en la mitad del tiempo.', mal: true, c: 'El flujo se sube para que la insuflación represente solo 1/3 del ciclo respiratorio.' },
          { t: 'El flujo espiratorio al final me dice si sigue el atrapamiento.' }],
        explicacion: `Los ajustes limitan la hiperinflación dinámica: <span class="hl-azul">Vt de 6-8 mL/kg como máximo</span> y <span class="hl-azul">frecuencia lenta y flujo alto</span> para que la insuflación sea 1/3 del ciclo (${p(29)}).` + enFicha(EV, 'nep-estrategias-ventilador'),
        origen: 'ficha; el 10 mL/kg, ilustrativo' }
    ],
    examen: [
      { id: 'ev-e1', corto: 'NNT y 1 de 6', tipo: 'test', fuente: 'nep-corticoides-epoc',
        enunciado: 'En la exacerbación de EPOC, ¿cuántos pacientes hay que tratar con corticoides para evitar un fracaso y con qué frecuencia hay un evento adverso?',
        opciones: [
          { t: 'Tratar a 9 para evitar 1 fracaso; un efecto adverso de 1 de cada 6 tratados con esteroides', ok: true },
          { t: 'Tratar a 6 para evitar 1 fracaso; un efecto adverso de 1 de cada 9 tratados', porque: `Están cambiadas las cifras (${p(25)}); sobrestimarías el beneficio y subestimarías el riesgo de hiperglucemia.` },
          { t: 'Casi todos se benefician, y los efectos adversos son excepcionales, sin necesidad de vigilar la glucemia', porque: `Hay que tratar a 9 para evitar 1 fracaso, y 1 de cada 6 sufre un efecto adverso (${p(25)}); darías esteroides sin mirar la glucemia.` }],
        explicacion: `<span class="hl-verde">NNT 9</span> para evitar un fracaso; <span class="hl-rojo">1 evento adverso por cada 6 tratados</span>. Aun así el balance favorece al esteroide: un efecto adverso suele ser menos problemático que un fracaso (${p(25)}).` + enFicha(EV, 'nep-corticoides-epoc') },
      { id: 'ev-e2', corto: '50 % bacteriana', tipo: 'test', fuente: 'nep-antibioticos-epoc',
        enunciado: '¿Qué parte de las exacerbaciones de EPOC se debe a infecciones bacterianas tratables?',
        opciones: [
          { t: 'Alrededor del 80 %, por eso el antibiótico es sistemático en todos los ingresos', porque: `Solo alrededor del 50 % (${p(26)}); sobrestimarla justifica tratar a todos, cuando el beneficio del antibiótico es limitado.` },
          { t: 'Alrededor del 50 %, lo que limita el beneficio del antibiótico', ok: true },
          { t: 'Casi ninguna: son víricas o de causa cardíaca', porque: `Marino dice que alrededor de la mitad es bacteriana tratable (${p(26)}); subestimarla dejaría sin tratar a quien la necesita.` }],
        explicacion: `Solo <span class="hl-rojo">alrededor del 50 %</span> son infecciones bacterianas tratables, y eso limita el beneficio de la terapia antimicrobiana (${p(26)}).` + enFicha(EV, 'nep-antibioticos-epoc') },
      { id: 'ev-e3', corto: '10 mmHg y 10 %', tipo: 'test', fuente: 'nep-vni-epoc',
        enunciado: 'Dos capítulos de Marino dan el criterio de fracaso de la VNI hipercápnica a la hora. ¿Qué dice cada uno?',
        opciones: [
          { t: 'Los dos dicen 10 mmHg; la diferencia es de redacción', porque: `El cap. 26 habla de un 10 % de la PaCO₂ basal (${p26(81)}); aplicarías el mismo número a cualquier basal sin ver que no es lo mismo.` },
          { t: 'Cap. 23: la conciencia no mejora en una hora; cap. 26: la PaCO₂ no baja un 10 % de la basal, y se vigila a la hora', porque: `El cap. 26 dice que la conciencia tarda más y no sirve como indicador temprano (${p26(81)}); esperarías a que despierte con la PaCO₂ sin bajar.` },
          { t: 'Cap. 23: la PaCO₂ no baja 10 mmHg; cap. 26: no baja al menos un 10 % de la basal', ok: true }],
        explicacion: `Cap. 23: <span class="hl-rojo">−10 mmHg</span> (${p(26)}). Cap. 26: <span class="hl-rojo">al menos −10 %</span> (${p26(81)}). Se enseñan las dos tal cual.` + enFicha(EV, 'nep-vni-epoc'),
        nota: `<b>Las fuentes discrepan</b>: mmHg frente a % de la basal; la ficha las muestra sin elegir una.` },
      { id: 'ev-e4', corto: 'ipratropio', tipo: 'test', fuente: 'nep-tabla-23-4',
        enunciado: '¿Qué respaldo tiene dar ipratropio junto al β₂-agonista en la exacerbación de EPOC?',
        opciones: [
          { t: 'Es práctica estándar: se debe dar siempre combinado desde el inicio, a todos los pacientes', porque: `Solo se usa cuando la respuesta a los β₂-agonistas es insatisfactoria (${p(25)}); darías una dosis extra a todos sin evidencia.` },
          { t: 'Está contraindicado en el EPOC y solo se da en el asma', porque: `Marino lo admite como terapia combinada si falta respuesta (${p(25)}); lo retirarías sin motivo a quien podría usarlo.` },
          { t: 'Se usa si la respuesta no basta, pero al menos 3 estudios no lo apoyan', ok: true }],
        explicacion: `Terapia combinada <span class="hl-azul">solo cuando la respuesta a los β₂-agonistas es insatisfactoria</span>, aunque <span class="hl-rojo">al menos 3 estudios no la respaldan</span> (${p(25)}).` + enFicha(EV, 'nep-tabla-23-4') },
      { id: 'ev-e5', corto: 'antibiótico 5-7 d', tipo: 'test', fuente: 'nep-antibioticos-epoc',
        enunciado: 'Un EPOC con VMI recibe antibiótico empírico. ¿Qué espectro y qué duración sugiere Marino?',
        opciones: [
          { t: 'Grampositivos y gramnegativos (p. ej. cefepima), 5-7 días', ok: true },
          { t: 'Solo grampositivos, dos semanas, para cubrir el neumococo del esputo', porque: `Sugiere un espectro que cubra grampositivos y gramnegativos (p. ej. cefepima) durante 5-7 días (${p(26)}); con un espectro solo grampositivo dejarías sin tratar a Pseudomonas en un ventilado.` },
          { t: 'Guiada por el cultivo de esputo, sin tratamiento empírico', porque: `Los cultivos son problemáticos en el EPOC por aislarse los mismos organismos en fase estable y aguda (${p(26)}); sin tratamiento empírico el paciente esperaría sin tratamiento.` }],
        explicacion: `Tratamiento empírico de <span class="hl-azul">grampositivos y gramnegativos</span> (p. ej. cefepima) durante <span class="hl-azul">5-7 días</span> (${p(26)}).` + enFicha(EV, 'nep-antibioticos-epoc') }
    ],
    profundizar: [
      { id: 'neumo-nota-vni-fracaso-23', titulo: 'Nota de fuentes: 10 mmHg o 10 %' }
    ],
    casos: [
      { id: 'c-epoc-jacinto', titulo: 'Jacinto, 58 años: EPOC hipercápnico', corto: 'Caso · Jacinto (EPOC)', sub: 'Exacerbación grave: oxígeno, VNI, intubación y auto-PEEP',
        paciente: { Edad: '58 años, varón', Peso: '70 kg', Antecedentes: 'EPOC grave, fumador', Motivo: 'disnea y somnolencia creciente (del caso)' },
        pasos: [
          { momento: 'Urgencias', datos: { 'PaCO₂': '80 mmHg (del paciente)', pH: '7,24 (del paciente)', 'SpO₂': '84 % (del paciente)' }, nuevo: ['PaCO₂', 'pH', 'SpO₂'],
            pregunta: { id: 'ev-c1', tipo: 'test', fuente: 'nep-o2-epoc', origen: 'ficha; las cifras, del paciente',
              enunciado: 'Jacinto llega con SpO₂ 84 %, PaCO₂ 80 y pH 7,24. Hay que darle oxígeno. ¿A qué saturación apuntas?',
              opciones: [
                { t: '94-98 %, como en cualquier paciente con hipoxemia', porque: `Con retención crónica de CO₂ el O₂ alto puede subir más la PaCO₂ (${p(26)}); con pH 7,24 de partida, empujarías al coma hipercápnico.` },
                { t: 'Se retiene el oxígeno hasta bajar la PaCO₂', porque: `El objetivo es 88-92 % (${p(26)}), no cero: con 84 % mantienes una hipoxemia peligrosa.` },
                { t: '88-92 %, y no más alta, aunque parezca poco', ok: true }],
              explicacion: `<span class="hl-rojo">88-92 % y no más alta</span>: el O₂ alto puede subir la PaCO₂ aunque el impulso ventilatorio no baje (${p(26)}).` + enFicha(EV, 'nep-o2-epoc') } },
          { momento: 'Primeras órdenes', datos: { Rx: 'sin neumonía (del paciente)', Esputo: 'purulento (del paciente)' }, nuevo: ['Rx', 'Esputo'],
            pregunta: { id: 'ev-c2', tipo: 'test', fuente: 'nep-tabla-23-4 · nep-corticoides-epoc · nep-antibioticos-epoc', origen: 'ficha; los datos, del paciente',
              enunciado: 'Jacinto va a necesitar VNI. ¿Qué pautas pones además?',
              opciones: [
                { t: 'Hidrocortisona IV dos semanas, ipratropio desde el principio y sin antibiótico', porque: `La vía IV no ofrece ventaja sobre la oral y la pauta es de 5 días (${p(25)}); y la VNI ya es indicación de antibiótico (${p(26)}). Tendría efectos adversos sin tratar la infección.` },
                { t: 'Solo albuterol y oxígeno: el esteroide y el antibiótico se reservan si no mejora en dos días', porque: `Los esteroides acortan la recuperación y reducen fracasos (${p(25)}), y todo ingreso en UCI con VNI es candidato a antibiótico (${p(26)}); esperar deja a Jacinto sin ambos.` },
                { t: 'Albuterol, prednisona 40 mg × 5 días (oral = IV) y antibiótico empírico 5-7 días', ok: true }],
              explicacion: `Broncodilatadores a las dosis de la Tabla 23.4, <span class="hl-azul">prednisona 40 mg diarios × 5 días</span> y <span class="hl-azul">antibiótico</span>, porque la necesidad de VNI ya es indicación (${p(25)}-${p(26)}).` + enFicha(EV, 'nep-tabla-23-4') } },
          { momento: 'VNI a la hora', datos: { VNI: '14/6 (ilustrativo)', 'PaCO₂ a la hora': '73 mmHg (del paciente)', Caída: '7 mmHg = 8,75 % (cálculo)' }, nuevo: ['VNI', 'PaCO₂ a la hora', 'Caída'],
            pregunta: { id: 'ev-c3', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-vni-epoc', origen: 'ficha; el cálculo, ilustrativo (80 → 73)',
              enunciado: 'Tras una hora de BiPAP, la PaCO₂ pasó de 80 a 73. ¿Responde? ¿Qué dice cada capítulo y qué no sirve de indicador?',
              puntos: [
                `<span class="hl-rojo">Cap. 23</span>: bajó 7 mmHg, menos de los 10 mmHg que pide; es fracaso (${p(26)}).`,
                `<span class="hl-rojo">Cap. 26</span>: bajó el 8,75 % de la basal (7/80), menos del 10 % mínimo; también es fracaso (${p26(81)}).`,
                `<span class="hl-azul">La conciencia no decide</span>: tarda más en resolverse y no es indicador temprano de fracaso (${p26(81)}).`],
              explicacion: `Por los dos criterios <span class="hl-rojo">no responde</span>: indicación de intubar (${p(26)}; ${p26(81)}).` + enFicha(EV, 'nep-vni-epoc'),
              nota: `<b>Las fuentes discrepan</b> (mmHg frente a %), pero aquí coinciden en el resultado. Las cifras del cálculo son ilustrativas.` } },
          { momento: 'El giro · una hora más', datos: { Plan: 'el residente espera otra hora por miedo a intubar', 'A las 2 h': 'GCS 11 (del paciente)' }, nuevo: ['Plan', 'A las 2 h'],
            pregunta: { id: 'ev-c4', tipo: 'test', fuente: 'nep-vni-epoc', origen: 'ficha; el plan y el GCS, del caso',
              enunciado: 'A las 2 h el residente sigue con la BiPAP y Jacinto tiene GCS 11. ¿Qué haces?',
              opciones: [
                { t: 'Seguir con la BiPAP hasta que se despierte, porque la conciencia es la guía', porque: `La conciencia tarda más y no es indicador temprano (${p26(81)}); el criterio de la hora ya se cumplió, y con GCS 11 puede aspirar o agotarse.` },
                { t: 'Subir el O₂ hasta SpO₂ 98 % para mejorarle la conciencia', porque: `El O₂ alto puede subir más la PaCO₂ (${p(26)}); empeoraría la somnolencia.` },
                { t: 'Intubar y ventilar: ya fracasó el criterio de la hora y no se espera más', ok: true }],
              explicacion: `Fallar en bajar la PaCO₂ tras una hora <span class="hl-rojo">es indicación de intubación</span> (${p(26)}); esperar otra hora solo trae un paciente con peor nivel de consciencia.` + enFicha(EV, 'nep-vni-epoc') } },
          { momento: 'Ya intubado', datos: { Ajustes: 'Vt 500 (7,6 mL/kg), FR 24 (monitor)', 'Flujo final': '−10 L/min: no llega a cero', 'PEEP oculta': '6,4 cmH₂O', Pico: '34,7 cmH₂O', 'Volumen minuto': '12 L/min' }, nuevo: ['Ajustes', 'Flujo final', 'PEEP oculta', 'Pico', 'Volumen minuto'],
            pregunta: { id: 'ev-c5', tipo: 'test', fuente: 'nep-monitor-flujo', origen: 'ficha; el monitor, de la app',
              modeloVivo: pv('broncoespasmo-auto-peep', '🫁 Jacinto con FR 24'),
              enunciado: 'Jacinto ya está ventilado con FR 24 y Vt 500. ¿Qué te dice la curva de flujo?',
              opciones: [
                { t: 'El flujo espiratorio cesa antes de la siguiente insuflación: ventilación normal y sin atrapamiento de aire', porque: `Eso es la curva normal (${p(28)}); aquí el flujo final es −10 L/min y no llega a cero. Pasarías por alto el atrapamiento.` },
                { t: 'Que la presión pico de 34,7 prueba por sí sola la PEEP intrínseca', porque: `La señal es el flujo al final de la espiración; la pico depende también de la resistencia (${p(28)}).` },
                { t: 'El flujo espiratorio continúa al llegar la siguiente insuflación: hiperinflación dinámica', ok: true }],
              explicacion: `<span class="hl-rojo">Flujo espiratorio al final de la espiración</span> (−10 L/min en el monitor) = hiperinflación dinámica, con PEEP intrínseca de unos 6,4 cmH₂O (Fig. 23.5, ${p(28)}).` + enFicha(EV, 'nep-monitor-flujo') } },
          { momento: 'El plan del residente', datos: { Plan: 'cuatro frases del residente' }, nuevo: ['Plan'],
            pregunta: { id: 'ev-c6', tipo: 'error', fuente: 'nep-o2-epoc · nep-estrategias-ventilador', origen: 'ficha; los 15 L/min y los 10 mL/kg, ilustrativos',
              modeloVivo: pv('broncoespasmo-auto-peep', '🫁 Jacinto con Vt 500'),
              enunciado: 'Plan del residente para Jacinto. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'Mantengo la SaO₂ en 88-92 %, no más alta.' },
                { t: 'Cuando lo extube, reservorio a 15 L/min hasta que la SpO₂ llegue a 98 %.', mal: true, c: 'En el EPOC con retención crónica, el objetivo es 88-92 % y no más; el O₂ alto puede subir la PaCO₂.' },
                { t: 'Subo el Vt a 10 mL/kg para bajar el CO₂.', mal: true, c: 'Hay que evitar volúmenes de insuflación mayores de 6-8 mL/kg: más volumen agrava la hiperinflación.' },
                { t: 'Vigilo el flujo espiratorio al final para ver si sigue el atrapamiento.' }],
              explicacion: `Dos errores clásicos: <span class="hl-rojo">saturar a 98 %</span> y <span class="hl-rojo">ventilar con volúmenes altos</span> (${p(26)}; ${p(29)}).` + enFicha(EV, 'nep-estrategias-ventilador') } },
          { momento: 'El ajuste', datos: { Ajustes: 'Vt 400 (6,1 mL/kg), FR 12, flujo 80 (monitor)', 'PEEP oculta': '1,1 cmH₂O', 'Flujo final': 'llega a cero', 'Volumen minuto': '4,8 L/min' }, nuevo: ['Ajustes', 'PEEP oculta', 'Flujo final', 'Volumen minuto'],
            pregunta: { id: 'ev-c7', tipo: 'test', fuente: 'nep-estrategias-ventilador', origen: 'ficha: el precio; el monitor, de la app',
              modeloVivo: pv('auto-peep-corregida', '🫁 Jacinto ajustado: FR 12, flujo 80'),
              enunciado: 'Con FR 12, flujo 80 y Vt 400, el atrapamiento casi desaparece. Pero el volumen minuto bajó de 12 a 4,8 L/min. ¿Qué has pagado?',
              opciones: [
                { t: 'Nada: al vaciarse el pulmón, la ventilación mejora siempre', porque: `Dar más tiempo para exhalar baja el volumen minuto (Vt × FR = 4,8 L/min en el monitor); el CO₂ de Jacinto, ya alto, seguiría subiendo.` },
                { t: 'Oxigenación: con menos frecuencia, el oxígeno no entra', porque: `Lo que se paga es el volumen minuto (Vt × FR), es decir, la eliminación de CO₂; el texto no da base para pensar en la oxigenación.` },
                { t: 'Volumen minuto: ventilas menos y la PaCO₂ puede subir más', ok: true }],
              explicacion: `Vt × FR = 400 × 12 ≈ <span class="hl-rojo">4,8 L/min</span> frente a 12 antes (monitor). La regla del libro es dar tiempo para exhalar (<span class="hl-azul">1/3 del ciclo para insuflar</span>, ${p(29)}).`,
              nota: `<b>La fuente no lo dice</b>: cuánta hipercapnia se tolera en el EPOC; es fisiología general.` + enFicha(EV, 'nep-estrategias-ventilador') } }
        ],
        lleva: [
          'En el EPOC, la saturación se apunta a 88-92 % y no más: el O₂ alto puede subir la PaCO₂.',
          'La VNI se juzga a la hora: la PaCO₂ que no baja (10 mmHg en el cap. 23, 10 % en el cap. 26) es indicación de intubar.',
          'Ya ventilado, la regla es dar tiempo para exhalar (Vt ≤ 6-8 mL/kg, flujo alto, inspiración 1/3 del ciclo), pagando volumen minuto.'],
        volver: { nombre: 'Las estrategias del ventilador', ancla: 'nep-estrategias-ventilador', modelo: pv('auto-peep-corregida', '🫁 Jacinto en el pulmón vivo') } }
    ]
  }
};
