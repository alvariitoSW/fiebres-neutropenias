// Mayéutica del bloque 3D, G3: fichas 4 neumo-sdra-diagnostico y 6 neumo-sdra-ventilacion (Marino cap. 24, págs. 32-52 del
// PDF), con el caso de Isidro (día 1 y días 1-6). Formato: cabecera de b1-fluidos.js. Plan: autonomo/bloques/b3/estudio-3d/.
// Las cifras de Isidro que pasan por un estado del pulmón vivo se leyeron en la app a 390 px
// (autonomo/bloques/b3/herramientas/m-pulmon-cifras.mjs), no en el motor; los datos del paciente son del caso (inventado).
const PDF = 'docs/marino-2024-respiratory-management-caps22-26.pdf';
const p = n => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">pág. ${n}</a>`;
const NEU = 'data-especialidad="neumologia" data-view="merinoNeumologia" data-panel="panel-merino-neumo-tabs"';
const enFicha = (tab, id) => ` <button type="button" class="may-ir" ${NEU} data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const SD = 'neumo-sdra-diagnostico', SV = 'neumo-sdra-ventilacion';
const pv = (estado, texto) => ({ pulmonVivo: estado, texto });
const ok = t => ({ t, ok: true });
const no = (t, porque) => ({ t, porque });
const ILU = 'ilustrativo: el paciente es inventado; los umbrales, de la ficha';

export const MAYEUTICA_SDRA = {
  /* =================================================================================================
     Ficha 4 · SDRA: patogénesis y diagnóstico (cap. 24, págs. 32-38) y el caso de Isidro, día 1
     ================================================================================================= */
  [SD]: {
    entrada: 'El SDRA es una inflamación por neutrófilos que se diagnostica con los cinco criterios de la Tabla 24.2 y se gradúa por el cociente PaO₂/FiO₂; la radiografía y la presión de enclavamiento se equivocan con mucha frecuencia.',
    guia: [
      { id: 'sd-g1', corto: 'quién empieza', tipo: 'test', fuente: 'nep-patogenesis · nep-fig-24-1', modelo: { capilarVivo: 'neutrofilo', texto: '🧬 Mira el estallido del neutrófilo (sus armas de O₂)' },
        enunciado: 'Antes de leer: ¿qué célula arranca la consolidación del SDRA y qué hace con la pared del capilar?',
        opciones: [
          no('El macrófago alveolar rompe el epitelio y el edema es solo la presión hidrostática de un capilar que gotea', `El primer evento es la activación del neutrófilo circulante (${p(32)}). Si buscas la causa en la presión capilar, tratarás con diuréticos un edema que sale de una pared dañada, y la hipoxemia seguirá.`),
          ok('El neutrófilo circulante se activa, migra y se desgranula; la pared dañada exuda proteínas y células'),
          no('El linfocito T daña sobre todo la vía aérea grande, y por eso la lesión se queda en los bronquios', `La consolidación llena los espacios aéreos distales (${p(32)}), no los bronquios. Esperar una lesión bronquial haría subestimar la hipoxemia, que viene del alvéolo ocupado.`)],
        explicacion: `<span class="hl-azul">Neutrófilo activado → secuestro en la microcirculación → adhesión y migración → desgranulación</span> (enzimas y metabolitos tóxicos de oxígeno) → pared capilar dañada y exudado rico en proteínas (${p(32)}). El exudado contiene <span class="hl-rojo">fibrina</span>, que si la inflamación no se resuelve en unas semanas deja fibrosis irreversible.` + enFicha(SD, 'nep-patogenesis') },
      { id: 'sd-g2', corto: 'el responsable', tipo: 'test', fuente: 'nep-tabla-24-1 · nep-predisponentes',
        enunciado: 'Un paciente llega con SDRA. ¿Qué condición predisponente buscas primero por frecuencia, y qué fracción de casos no tiene ninguna identificable?',
        opciones: [
          no('La aspiración gástrica, que es la más frecuente; casi la mitad no tiene fuente', `La aspiración es el 14 % (${p(33)}-${p(34)}). Si empiezas por ella, retrasas el estudio de la neumonía, que es la causa de seis de cada diez casos.`),
          no('La sepsis extrapulmonar, con unos dos tercios de los casos; todos tienen alguna fuente', `La sepsis extrapulmonar es el 16 %, y alrededor del 10 % no tiene fuente (${p(33)}). Dar por hecho que siempre hay causa lleva a seguir buscando una que no existe.`),
          ok('La neumonía (60 %); alrededor del 10 % de los casos no tiene fuente identificable')],
        explicacion: `<span class="hl-rojo">Neumonía 60 %</span>, sepsis extrapulmonar 16 %, aspiración 14 %. Alrededor del 10 % de los SDRA no tiene una fuente identificable (${p(33)}). Todas comparten la activación del neutrófilo.`,
        nota: '<b>Fidelidad.</b> Los porcentajes suman más de 100 % porque algunos casos tuvieron más de una condición (nota de la propia tabla).' + enFicha(SD, 'nep-tabla-24-1') },
      { id: 'sd-g3', corto: 'el COVID', tipo: 'test', fuente: 'nep-covid',
        enunciado: 'Una neumonía por SARS-CoV-2 con hipoxemia grave se clasifica como SDRA. ¿Qué la distingue y por qué importa a la hora de leer estudios?',
        opciones: [
          no('Tiene la compliance más baja de todos los SDRA, así que los estudios de volumen valen igual para cualquier paciente', `Es lo contrario: con frecuencia la compliance cambia poco (${p(33)}). Aplicar sin matiz una estrategia pensada para un pulmón muy rígido puede ser un exceso de restricción.`),
          ok('Hipoxemia grave con poco cambio de la compliance, algo atípico; sus estudios pueden no valer para otros SDRA'),
          no('Es el SDRA más frecuente de la serie, y los estudios de COVID valen para el SDRA bacteriano porque el P/F es el mismo', `Marino advierte lo contrario: es un tipo único y muchos estudios recientes son de COVID (${p(33)}). Extrapolar sin cautela puede aplicar a un SDRA bacteriano un efecto que no se probó en él.`)],
        explicacion: `En el COVID-19 la hipoxemia grave <span class="hl-rojo">no suele acompañarse de pérdida de compliance</span>, y por eso se considera un SDRA «único»; los resultados de los estudios recientes pueden no aplicar a otros casos (${p(33)}).` + enFicha(SD, 'nep-covid') },
      { id: 'sd-g4', corto: 'los cinco criterios', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'nep-tabla-24-2 · nep-criterios-clinicos',
        enunciado: 'Ante un paciente con disnea progresiva, la Tabla 24.2 pide cinco criterios. ¿Qué exige sobre el inicio y la imagen, y qué pasa con la placa en las primeras horas?',
        puntos: [
          `Los cinco: <span class="hl-azul">inicio agudo (≤7 días), infiltrados bilaterales, hipoxemia por cociente, ausencia de fallo izquierdo o sobrecarga, y una condición predisponente</span> (${p(35)}).`,
          `La placa puede ser <span class="hl-rojo">poco reveladora en las primeras horas</span>: los infiltrados bilaterales empiezan a aparecer en las primeras 24 h (${p(35)}).`],
        explicacion: `Todos los criterios deben cumplirse, pero la imagen llega tarde: un paciente puede cumplir hipoxemia y causa antes de que la placa muestre nada (${p(35)}).` + enFicha(SD, 'nep-tabla-24-2') },
      { id: 'sd-g5', corto: 'a la intubación', tipo: 'test', fuente: 'nep-criterios-clinicos',
        enunciado: 'Un SDRA ingresa en UCI. Sin mirar las tablas: ¿qué parte de estos pacientes acaba intubada y en cuánto tiempo, típicamente?',
        opciones: [
          no('Alrededor de la mitad, y casi siempre pasada la primera semana', `Es mucho más frecuente y más rápido: el 80 % y en las primeras 48 h (${p(35)}). Si esperas una semana, no prepararás a tiempo la ventilación protectora.`),
          ok('El 80 %, típicamente en las primeras 48 h tras la presentación'),
          no('Menos de un 20 %, porque casi todos responden a oxígeno de alto flujo', `Marino da el 80 % (${p(35)}); la ventilación mecánica es la regla. Confiar en que no se intuba retrasaría el ingreso en una unidad con respirador.`)],
        explicacion: `<span class="hl-rojo">El 80 % requiere intubación y ventilación mecánica, típicamente en las primeras 48 h</span> (${p(35)}). Por eso la forma de ventilar (ficha siguiente) pesa tanto.` + enFicha(SD, 'nep-criterios-clinicos') },
      { id: 'sd-g6', corto: 'PEEP y definición', tipo: 'test', fuente: 'nep-peep-criterio',
        enunciado: 'El criterio de oxigenación exige una PEEP mínima. ¿Por qué se ha cuestionado esa exigencia?',
        opciones: [
          ok('Porque pedir PEEP exige intubar y deja fuera los SDRA sin ventilación mecánica'),
          no('Porque una PEEP alta sube el cociente y oculta un SDRA grave, falseando la gravedad del paciente', `Marino no argumenta eso (${p(35)}). El problema es de definición, no de efecto: dejar fuera casos reales hace infradiagnosticar el SDRA de un paciente con alto flujo.`),
          no('Porque la PEEP no se puede medir con fiabilidad en la cabecera de un paciente ventilado', `Se mide en el respirador sin dificultad; la crítica es que exige un tubo (${p(35)}). Un paciente no intubado quedaría sin diagnóstico aunque cumpliera el resto.`)],
        explicacion: `La definición estándar incluye PEEP, y su aplicación <span class="hl-azul">requiere intubación y ventilación mecánica</span>: excluye al SDRA que aún respira sin respirador (${p(35)}).` + enFicha(SD, 'nep-peep-criterio') },
      { id: 'sd-g7', corto: 'las dos placas', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'nep-rx · nep-errores-dx',
        enunciado: 'Mira la Figura 24.2. ¿Cómo es la radiografía clásica y qué otro aspecto puede confundirse con un edema cardiogénico?',
        puntos: [
          `La clásica: <span class="hl-azul">infiltrado finamente granular o en vidrio esmerilado, uniforme en todos los campos y sin derrame</span> (${p(36)}).`,
          `La variante: <span class="hl-rojo">infiltrados bilaterales en los campos inferiores</span>, con borramiento del hemidiafragma que sugiere derrame; se confunde con edema cardiogénico (${p(38)}).`],
        explicacion: `La placa del SDRA no es una sola: la fuente muestra una clásica y otra que se parece a la del corazón izquierdo (${p(36)}, ${p(38)}). Por eso la imagen sola no decide.` + enFicha(SD, 'nep-rx') },
      { id: 'sd-g8', corto: 'por qué se falla', tipo: 'test', fuente: 'nep-especificidad · nep-errores-dx',
        enunciado: 'Un estudio de autopsias comparó el diagnóstico clínico con los hallazgos patológicos. ¿Qué mostró y por qué ocurre?',
        opciones: [
          no('Que casi todos los muertos con diagnóstico clínico tenían SDRA; los criterios son muy específicos', `Lo que se vio es lo contrario (${p(36)}). Confiar en la especificidad de los criterios lleva a etiquetar de SDRA una neumonía y a no tratarla como tal.`),
          ok('Que solo la mitad tenía SDRA en la patología; los criterios se solapan con la neumonía y otras causas'),
          no('Que el SDRA se infradiagnostica, sobre todo porque la placa de tórax es poco sensible y pasa por limpia', `Marino habla de errores en los dos sentidos, por exceso y por defecto (${p(35)}-${p(36)}). Pensar que solo falta diagnóstico oculta el riesgo de etiquetar mal.`)],
        explicacion: `<span class="hl-rojo">Solo el 50 % de los fallecidos con diagnóstico clínico de SDRA tenía evidencia patológica</span>: los criterios no son específicos y se solapan con la neumonía (${p(36)}).` + enFicha(SD, 'nep-especificidad') },
      { id: 'sd-g9', corto: 'la wedge', tipo: 'error', fuente: 'nep-wedge',
        enunciado: 'Una nota dice cuatro frases sobre la presión de enclavamiento (wedge) en un paciente con imagen dudosa. Hay dos errores. Encuéntralos.',
        frases: [
          { t: 'Se ha usado para distinguir SDRA de edema cardiogénico cuando la imagen se superpone.' },
          { t: 'Una wedge normal descarta el edema cardiogénico.', mal: true, c: `Una wedge normal NO excluye el edema hidrostático (${p(36)}): la presión auricular es más baja que la capilar.` },
          { t: 'La wedge es una medida de la presión hidrostática capilar.', mal: true, c: `La wedge NO mide la presión hidrostática capilar, que es más alta que la de la aurícula (${p(36)}).` },
          { t: 'Su mala interpretación ha llevado al sobrediagnóstico del SDRA.' }],
        explicacion: 'Los dos errores son del mismo razonamiento: confundir la wedge con la presión capilar y concluir que, si es normal, el corazón queda fuera.',
        nota: 'La fuente remite al cap. 8 (no incluido en este bloque) para la explicación de la wedge.' + enFicha(SD, 'nep-wedge') },
      { id: 'sd-g10', corto: 'la TC tardía', tipo: 'test', fuente: 'nep-tc · nep-fig-24-1',
        enunciado: 'En la Figura 24.3, el panel inferior es de una fase avanzada del SDRA. ¿Qué muestra?',
        opciones: [
          no('Consolidación densa en las zonas posteriores, igual que en la fase temprana del síndrome', `Eso es la fase temprana (${p(36)}). Confundirlas llevaría a esperar una respuesta al prono en un pulmón que ya cicatriza.`),
          ok('Infiltrados reticulados difusos en todos los campos, que pueden representar fibrosis'),
          no('Una TC normal, porque la inflamación suele resolverse por completo antes de las dos semanas', `En la fase avanzada hay fibrosis y puede haber neumomediastino (${p(38)}). Esperar normalidad infravalora un daño ya establecido.`)],
        explicacion: `<span class="hl-purpura">Fase temprana: consolidación posterior; fase avanzada: infiltrados reticulados difusos</span> (posible fibrosis), con un neumomediastino en la figura (${p(36)}, ${p(38)}).` + enFicha(SD, 'nep-tc') },
    ],
    examen: [
      { id: 'sd-e1', corto: 'PEEP del criterio', tipo: 'test', fuente: 'nep-tabla-24-2', origen: 'ficha: Tabla 24.2',
        enunciado: '¿Con qué PEEP se exige un PaO₂/FiO₂ ≤300 en los criterios de la Tabla 24.2?',
        opciones: [
          no('Con PEEP ≥10, el nivel habitual de un SDRA moderado', `El criterio pide 5 (${p(35)}); exigir 10 dejaría fuera pacientes con SDRA ventilados con PEEP 5.`),
          ok('Con PEEP ≥5 (cmH₂O en el texto, mmHg en la tabla)'),
          no('Sin PEEP: basta el cociente, con cualquier modo de ventilación', `La definición incluye un requisito de PEEP (${p(35)}); medir el cociente sin ella cambiaría los casos que cumplen.`)],
        explicacion: `<span class="hl-azul">PaO₂/FiO₂ ≤300 con PEEP de 5</span> (${p(35)}).`,
        nota: '<b>Nota de fidelidad.</b> La fuente usa cmH₂O en el texto y mmHg en la Tabla 24.2: probable errata del libro; se reproduce tal cual, no es un error del residente.' + enFicha(SD, 'neumo-nota-peep-unidades') },
      { id: 'sd-e2', corto: 'el informe de 1967', tipo: 'test', fuente: 'nep-patogenesis',
        enunciado: 'El primer reporte clínico de SDRA (1967) incluyó a pacientes con hipoxemia refractaria e infiltrados bilaterales. ¿Cuántos murieron y qué mostró la autopsia?',
        opciones: [
          no('3 de 12; infección bacteriana masiva en los pulmones', `Murieron 7 de 12 y no se encontró infección (${p(32)}). Pensar en infección haría tratar con antibióticos una lesión inflamatoria.`),
          no('7 de 12; membranas hialinas por aspiración de contenido gástrico', `Hubo un exudado inflamatorio sin infección (${p(32)}); no se atribuyó a aspiración, que es solo una de las causas predisponentes.`),
          ok('7 de 12; exudado inflamatorio denso, sin infección bacteriana')],
        explicacion: `12 pacientes, 7 murieron; la autopsia mostró <span class="hl-rojo">infiltración densa con exudado inflamatorio, sin infección</span>: lesión pulmonar inflamatoria aguda (${p(32)}).` + enFicha(SD, 'nep-patogenesis') },
      { id: 'sd-e3', corto: 'placa clásica', tipo: 'test', fuente: 'nep-rx',
        enunciado: '¿En qué proporción de los SDRA aparece la radiografía clásica (granular, uniforme, sin derrame)?',
        opciones: [
          no('En la mayoría, por eso se descarta el SDRA si no se ve', `Solo en una minoría (${p(36)}); descartar por una placa distinta de la clásica dejaría sin diagnóstico a la mayoría.`),
          ok('En solo el 15-25 %; lo común es un infiltrado localizado'),
          no('En el 47 %, la misma cifra que el valor predictivo negativo', `El 47 % es el valor predictivo negativo frente a la TC, no la frecuencia de la placa clásica (${p(36)}).`)],
        explicacion: `<span class="hl-rojo">Solo el 15-25 %</span> muestra el patrón clásico (${p(36)}).` + enFicha(SD, 'nep-rx') },
      { id: 'sd-e4', corto: 'corte de la wedge', tipo: 'test', fuente: 'nep-wedge',
        enunciado: 'Con imagen superpuesta de SDRA y edema cardiogénico, ¿qué valor de wedge se ha usado como «evidencia de SDRA»?',
        opciones: [
          no('≤12 mmHg', `El valor usado era ≤18 mmHg (${p(36)}).`),
          ok('≤18 mmHg'),
          no('≤24 mmHg', `El corte es ≤18 (${p(36)}); aceptar 24 etiquetaría de SDRA a pacientes con presión auricular claramente alta.`)],
        explicacion: `Una wedge ≤18 mmHg se consideraba evidencia de SDRA (${p(36)}), un criterio problemático por lo que mide.` + enFicha(SD, 'nep-wedge') },
      { id: 'sd-e5', corto: 'mortalidad', tipo: 'test', fuente: 'nep-gravedad',
        enunciado: '¿Cuál es la mortalidad intrahospitalaria aproximada del SDRA leve, moderado y grave?',
        opciones: [
          no('20, 30 y 45 %', `Marino da 35, 40 y 45 % (${p(35)}); subestimar el leve rebaja la vigilancia de los grados bajos.`),
          no('35, 40 y 60 %', `El grave es 45 % (${p(35)}); exagerarlo sobrevalora la diferencia con el moderado.`),
          ok('35, 40 y 45 %')],
        explicacion: `<span class="hl-rojo">35 % leve, 40 % moderado, 45 % grave</span> (${p(35)}): la gravedad por el cociente separa poco.` + enFicha(SD, 'nep-gravedad') },
    ],
    casos: [
      { id: 'c-sd-isidro', titulo: 'Isidro, 64 años: la neumonía que no se ve', corto: 'Caso · Isidro (diagnóstico)', sub: 'Día 1: del cociente al SDRA',
        paciente: { Edad: '64 años, varón', 'Peso y talla': '96 kg, 1,75 m (PBW 70,5 kg)', Motivo: 'neumonía bilateral', Llegada: 'disnea progresiva de 3 días' },
        pasos: [
          { momento: 'Día 1 · urgencias', datos: { 'PaO₂': '66 mmHg', 'FiO₂': '0,6' }, nuevo: ['PaO₂', 'FiO₂'], calculadora: { ir: 'neumo-sdra-pao2fio2', nombre: 'Clasificador de gravedad' },
            pregunta: { id: 'sd-c1', tipo: 'test', fuente: 'nep-gravedad', origen: ILU,
              enunciado: 'Isidro respira con mascarilla de FiO₂ 0,6 y tiene una PaO₂ de 66 mmHg. ¿Qué cociente tiene y de qué grado sería, si luego se confirma el síndrome?',
              opciones: [
                no('PaO₂/FiO₂ 110: grave, porque necesita FiO₂ alta', `Es 66 / 0,6 = 110, que cae en 100-200; el grave es <100 (${p(35)}). Sobreestimar el grado llevaría a indicar ECMO antes de tiempo.`),
                ok('PaO₂/FiO₂ 110: moderado, en el rango de 100 a 200'),
                no('PaO₂/FiO₂ 66: moderado, porque la PaO₂ está por encima de 60', `El cociente divide por la FiO₂: es 110, no 66 (${p(35)}). Ignorar la FiO₂ subestimaría una hipoxemia que necesita 0,6.`)],
              explicacion: `66 / 0,6 = <span class="hl-azul">110</span>: moderado (100-200 mmHg); leve es 201-300 y grave <100 (${p(35)}).` + enFicha(SD, 'nep-gravedad') } },
          { momento: 'Día 1 · a las 6 horas', datos: { 'Radiografía': 'casi limpia' }, nuevo: ['Radiografía'],
            pregunta: { id: 'sd-c2', tipo: 'test', fuente: 'nep-rx · nep-criterios-clinicos', origen: 'ficha: el valor predictivo negativo y las 24 h; el paciente, inventado',
              enunciado: 'La placa de tórax a las 6 h de los primeros síntomas es casi normal. ¿Qué haces con el diagnóstico de SDRA?',
              opciones: [
                no('Lo descartas: sin infiltrados bilaterales no hay SDRA y la hipoxemia es de otra causa', `La placa limpia no excluye el SDRA: su valor predictivo negativo es del 47 % (${p(36)}), como lanzar una moneda. Descartarlo retrasaría la ventilación protectora.`),
                ok('No lo descartas: los infiltrados pueden tardar 24 h y la TC es la prueba más fiable'),
                no('Lo confirmas igualmente, porque la hipoxemia sola ya cumple todos los criterios', `Faltaría la imagen: los cinco criterios deben cumplirse (${p(35)}). Confirmarlo sin ella aumenta el sobrediagnóstico.`)],
              explicacion: `Una placa negativa tiene un <span class="hl-rojo">valor predictivo negativo de solo el 47 %</span> frente a la TC, y los infiltrados bilaterales empiezan en las primeras 24 h (${p(35)}-${p(36)}).` + enFicha(SD, 'nep-rx') } },
          { momento: 'Día 1 · intubado', datos: { Respirador: 'PEEP 10 cmH₂O', 'Vt': '420 mL (6 mL/kg PBW)', 'Meseta (monitor)': '32 cmH₂O' }, nuevo: ['Respirador', 'Vt', 'Meseta (monitor)'],
            pregunta: { id: 'sd-c3', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-tabla-24-2 · nep-gravedad', origen: 'ficha: los criterios; las cifras del respirador, del monitor de la app (ilustrativas)', modelo: pv('sdra-rigido', '🫁 Isidro intubado, en el modelo'),
              enunciado: 'A las 24 h la placa muestra infiltrados bilaterales y Isidro, con PEEP 10, mantiene su cociente de 110. No tiene signos de fallo izquierdo. ¿Qué criterios de la Tabla 24.2 cumple?',
              puntos: [
                `<span class="hl-azul">Inicio agudo</span> (3 días, menos de 7) e <span class="hl-azul">infiltrados bilaterales</span> en la placa (${p(35)}).`,
                `<span class="hl-azul">Oxigenación</span>: 110 es menor de 300, con PEEP ≥5 (${p(35)}).`,
                `<span class="hl-azul">Causa predisponente</span> (neumonía) y <span class="hl-azul">sin evidencia de fallo izquierdo ni de sobrecarga</span>: los cinco criterios (${p(35)}).`],
              explicacion: `Cumple los cinco; la rigidez que ves en el monitor (meseta 32 con Vt de 6 mL/kg) es la huella del exudado que llena los espacios aéreos (${p(32)}).` + enFicha(SD, 'nep-tabla-24-2') } },
          { momento: 'Día 1 · la imagen dudosa', datos: { 'Radiografía de control': 'infiltrados en campos inferiores y hemidiafragma izquierdo borrado' }, nuevo: ['Radiografía de control'],
            pregunta: { id: 'sd-c4', tipo: 'test', fuente: 'nep-rx · nep-tabla-24-2', origen: 'ficha: la Figura 24.2; el paciente, inventado',
              enunciado: 'Con esa nueva placa, el cardiólogo piensa en edema cardiogénico por el aspecto. ¿Qué respondes?',
              opciones: [
                ok('La imagen sola no lo decide: la Fig. 24.2 inferior es SDRA y parece cardiogénico; busca fallo izquierdo'),
                no('Es cardiogénico: el borramiento del hemidiafragma indica derrame y descarta el SDRA', `Ese aspecto aparece en un SDRA por septicemia (${p(38)}). Descartar por la placa dejaría sin protección pulmonar a un paciente que sí lo cumple.`),
                no('Es SDRA: la distribución en campos inferiores es la clásica y basta con una ecografía pleural para confirmar el derrame', `La clásica es uniforme y sin derrame (${p(36)}); sin descartar el fallo izquierdo, el cuarto criterio queda sin cumplir y se arriesga el sobrediagnóstico.`)],
              explicacion: `El criterio 4 exige <span class="hl-azul">ausencia de evidencia de fallo izquierdo o sobrecarga</span>; la placa variante «podría confundirse con edema cardiogénico» (${p(38)}).` + enFicha(SD, 'nep-rx') } },
          { momento: 'Día 1 · el plan del residente', datos: { 'Nota': 'cinco frases' }, nuevo: ['Nota'],
            pregunta: { id: 'sd-c5', tipo: 'error', fuente: 'nep-criterios-clinicos · nep-rx · nep-gravedad', origen: ILU,
              enunciado: 'El residente deja su nota sobre Isidro. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'Moderado por su cociente de 110.' },
                { t: 'Solo uno de cada cinco SDRA acaba necesitando ventilación mecánica, así que no preparo cama con respirador.', mal: true, c: `El 80 % requiere intubación, típicamente en las primeras 48 h (${p(35)}).` },
                { t: 'La neumonía es la condición predisponente más frecuente y la primera que busco.' },
                { t: 'Si dudo, la radiografía es la prueba de imagen más fiable para el SDRA.', mal: true, c: `La TC de tórax es la modalidad más fiable; la placa tiene un valor predictivo negativo del 47 % (${p(36)}).` },
                { t: 'El infiltrado bilateral puede tardar hasta 24 h en verse.' }],
              explicacion: 'Dos errores: subestimar cuántos acaban intubados y atribuir a la placa una fiabilidad que es de la TC.' + enFicha(SD, 'nep-criterios-clinicos') } },
          { momento: 'Día 1 · la TC', datos: { 'TC': 'consolidación densa en las zonas posteriores' }, nuevo: ['TC'],
            pregunta: { id: 'sd-c6', tipo: 'test', fuente: 'nep-tc', origen: 'ficha: la Figura 24.3; el paciente, inventado',
              enunciado: 'La TC muestra consolidación densa posterior, como el panel superior de la Figura 24.3. ¿Qué implicación tiene para el manejo?',
              opciones: [
                no('Que ya hay fibrosis y toca esperar a que se resuelva el infiltrado sin cambiar nada del manejo', `La fibrosis es la fase tardía, reticular y difusa (${p(38)}). Esperar con una consolidación posterior densa desperdicia una indicación posible de la posición prono.`),
                no('Que el paciente tiene un neumomediastino y requiere drenaje urgente del aire extrapulmonar', `El neumomediastino es del panel inferior, avanzado (${p(38)}). Drenar sin indicación expone a un riesgo sin beneficio.`),
                ok('Fase temprana: la consolidación dependiente es un argumento para valorar el prono')],
              explicacion: `Consolidación densa en las regiones dependientes de la posición supina: <span class="hl-purpura">fase temprana</span>, y la fuente propone que, con consolidación posterior densa, el prono tiene más probabilidad de éxito: una propuesta que merece atención, no una regla (${p(44)}).` + enFicha(SD, 'nep-tc') } },
        ],
        lleva: [
          'Los cinco criterios de la Tabla 24.2 se cumplen juntos; el cociente se calcula con la FiO₂.' + enFicha(SD, 'nep-tabla-24-2'),
          'Una placa limpia no descarta el SDRA: el valor predictivo negativo es del 47 %.' + enFicha(SD, 'nep-rx'),
          'La TC temprana con consolidación posterior es un argumento para valorar la posición prono.' + enFicha(SD, 'nep-tc')],
        volver: { nombre: 'Los cinco criterios', ancla: 'nep-tabla-24-2', modelo: pv('sdra-rigido', '🫁 Isidro, SDRA rígido') } },
    ],
    profundizar: [
      { id: 'nep-tabla-24-1', titulo: 'Tabla 24.1: todas las condiciones predisponentes y su frecuencia' },
      { id: 'nep-fig-24-1', titulo: 'Figura 24.1: el pulmón normal y el del SDRA al microscopio' },
    ],
  },

  /* =================================================================================================
     Ficha 6 · SDRA: ventilación mecánica (cap. 24, págs. 45-52) y el caso de Isidro, días 1-6
     ================================================================================================= */
  [SV]: {
    entrada: 'El respirador lesiona por volumen, no por presión: 6 mL/kg de peso predicho y meseta ≤30 son la única estrategia ventilatoria con beneficio de supervivencia, y quien muere de SDRA suele morir de otros órganos.',
    guia: [
      { id: 'sv-g1', corto: 'qué es el VILI', tipo: 'test', fuente: 'nep-vili',
        enunciado: 'Antes de leer: ¿qué muestran las micrografías de la Figura 24.6 y cómo se llama esa lesión?',
        opciones: [
          ok('Fracturas por estrés de la interfaz alveolo-capilar: lesión inducida por el ventilador'),
          no('Una infección del tubo endotraqueal que pasa a los alvéolos y se llama neumonía asociada al ventilador', `La figura muestra un desgarro mecánico de la interfaz (${p(45)}), no un germen. Buscar infección retrasaría cambiar la forma de ventilar.`),
          no('La toxicidad del oxígeno sobre el epitelio alveolar, llamada lesión por hiperoxia pulmonar', `El mecanismo descrito es la sobredistensión alveolar (${p(47)}), no el O₂. Corregir la FiO₂ no frenaría ese daño.`)],
        explicacion: `La ventilación mecánica produce <span class="hl-rojo">fracturas por estrés en la interfaz alveolo-capilar</span>, que promueven inflamación y acumulación de fluido: la VILI (${p(45)}). El primer reporte de 1967 la describió como «pulmón del respirador».` + enFicha(SV, 'nep-vili') },
      { id: 'sv-g2', corto: 'por qué volutrauma', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'nep-volutrauma · nep-vt-tradicional', modelo: pv('volutrauma', '🫁 Isidro con Vt 600'),
        enunciado: 'Se creyó que la VILI era barotrauma, por la presión alta. ¿Qué mostró el estudio de referencia y qué dos factores lo explican?',
        puntos: [
          `Lo que rompe es el <span class="hl-rojo">volumen de insuflación alto</span>, no la presión de la vía aérea: volutrauma, no barotrauma (${p(46)}).`,
          `Dos factores: los <span class="hl-azul">volúmenes altos de la ventilación tradicional</span> y la <span class="hl-azul">capacidad reducida</span> del pulmón con SDRA, que opera a la mitad (${p(46)}).`],
        explicacion: `Se fuerza un volumen que sería normal para un pulmón entero en uno que solo funciona al 50 %: ese desajuste es la fuente principal de rotura alveolar (${p(46)}).` + enFicha(SV, 'nep-volutrauma') },
      { id: 'sv-g3', corto: 'atelectrauma', tipo: 'test', fuente: 'nep-atelectrauma', modelo: pv('atelectrauma-zeep', '🫁 Sin PEEP: mira el racimo; la guía te dice qué PEEP lo para'),
        enunciado: 'En el pulmón rígido, las vías pequeñas colapsan al final de la espiración y se reabren con el volumen. ¿Qué daño produce y qué lo evita?',
        opciones: [
          no('Una hemorragia por la presión alta; se evita con una FiO₂ menor', `El daño es por cizalla, no por O₂ (${p(48)}). Bajar la FiO₂ no frena el abrir y cerrar.`),
          no('Una dilatación de los bronquios grandes; se evita con más frecuencia respiratoria', `Lo que se daña es el epitelio de las vías pequeñas (${p(48)}); más frecuencia, sin PEEP, sumaría más ciclos de apertura y cierre.`),
          ok('Cizalla sobre el epitelio de la vía aérea; se evita con PEEP que la mantiene abierta')],
        explicacion: `El abrir y cerrar cíclico crea <span class="hl-azul">fuerzas de cizalla</span>: es el atelectrauma, que se minimiza con PEEP al final de la espiración (${p(48)}).` + enFicha(SV, 'nep-atelectrauma') },
      { id: 'sv-g4', corto: 'biotrauma', tipo: 'test', fuente: 'nep-biotrauma',
        enunciado: 'Un paciente ventilado con volúmenes altos no tiene rotura estructural, pero aparece una inflamación sistémica. ¿Cómo se explica?',
        opciones: [
          ok('Biotrauma: citocinas liberadas por el estiramiento pasan a la sangre y causan fallo de órganos'),
          no('Atelectrauma: la cizalla de las vías pequeñas rompe el epitelio y deja pasar bacterias y citocinas a la sangre', `El atelectrauma daña el epitelio; el biotrauma ocurre en ausencia de daño estructural (${p(48)}).`),
          no('Barotrauma: el neumotórax libera citocinas a la sangre desde la pleura', `Aquí no se habla de neumotórax sino de citocinas liberadas sin daño estructural (${p(48)}). Buscar una fuga de aire retrasaría reducir el volumen.`)],
        explicacion: `Las fuerzas del alto volumen liberan <span class="hl-rojo">citocinas proinflamatorias</span> que alcanzan la circulación; no hace falta daño estructural, y la ventilación puede ser fuente de fallo multiorgánico (${p(48)}).` + enFicha(SV, 'nep-biotrauma') },
      { id: 'sv-g5', corto: 'nota de la protectora', tipo: 'error', fuente: 'nep-protectora · nep-tabla-24-5',
        enunciado: 'Una residente escribe cuatro frases sobre la ventilación protectora en un hombre de 1,75 m y 96 kg. Hay dos errores. Encuéntralos.',
        frases: [
          { t: 'El volumen tidal objetivo es 6 mL/kg del peso corporal predicho.' },
          { t: 'Programo 576 mL, que son 6 mL/kg de su peso real de 96 kg.', mal: true, c: `El volumen se calcula con el peso corporal predicho, el asociado a volúmenes pulmonares normales (${p(48)}); aquí 6 × 70,5 son unos 423 mL.` },
          { t: 'Acepto una meseta de hasta 35 cmH₂O si la saturación es buena.', mal: true, c: `La meseta objetivo es ≤30 cmH₂O; por encima hay riesgo de rotura alveolar (${p(48)}).` },
          { t: 'La PEEP se usa para prevenir el atelectrauma.' }],
        explicacion: 'Dos errores: calcular el volumen con el peso real y relajar el techo de la meseta.',
        nota: 'Las cuentas con el peso predicho de Isidro (70,5 kg) salen de la fórmula de la ficha.' + enFicha(SV, 'nep-protectora') },
      { id: 'sv-g6', corto: 'el suelo del Vt', tipo: 'test', fuente: 'nep-tabla-24-5',
        enunciado: 'Con Vt 5 mL/kg la meseta sigue en 31. Según la 2.ª etapa de la Tabla 24.5, ¿hasta dónde puedes seguir bajando el Vt?',
        opciones: [
          no('Hasta 2 mL/kg, porque la tabla no marca un límite inferior', `El límite está escrito: Vt de 4 mL/kg (${p(48)}); pasar de ahí ventilaría con un volumen que la tabla no contempla.`),
          ok('De 1 en 1 mL/kg hasta meseta <30 o Vt de 4 mL/kg'),
          no('Hasta 3 mL/kg, y después subes la PEEP para compensar', `El suelo es 4 mL/kg (${p(48)}); subir la PEEP no es el paso que la tabla indica para bajar la meseta.`)],
        explicacion: `Si la meseta supera 30, <span class="hl-azul">bajar el Vt 1 mL/kg</span> cada vez hasta que sea <30 o el Vt sea 4 mL/kg (${p(48)}).` + enFicha(SV, 'nep-tabla-24-5') },
      { id: 'sv-g7', corto: 'si el pH baja de 7,15', tipo: 'test', fuente: 'nep-tabla-24-5',
        enunciado: 'Con Vt bajo el pH cae a 7,10. ¿Qué dice la 3.ª etapa de la tabla que hagas, por orden?',
        opciones: [
          no('Subir directamente el Vt de 1 en 1 mL/kg hasta pH >7,15', `Primero se sube la FR a 35 (${p(48)}); subir el Vt de entrada reabre el riesgo de volutrauma.`),
          no('Bajar la FR a 20 para dar más tiempo a exhalar el CO₂', `La tabla indica aumentar la FR, no bajarla (${p(48)}); con la FR baja el CO₂ y la acidosis empeorarían.`),
          ok('Subir la FR a 35 rpm; si el pH sigue <7,15, subir el Vt de 1 en 1 mL/kg hasta pH >7,15')],
        explicacion: `Con pH <7,15: <span class="hl-azul">FR a 35 rpm</span> y, si no basta, subir el Vt 1 mL/kg hasta pH >7,15 (${p(48)}).` + enFicha(SV, 'nep-tabla-24-5') },
      { id: 'sv-g8', corto: 'PEEP de 5', tipo: 'test', fuente: 'nep-peep-protectora',
        enunciado: '¿Para qué se usa la PEEP de 5 cmH₂O de la ventilación protectora?',
        opciones: [
          no('Para reclutar el pulmón consolidado y subir el PaO₂/FiO₂ lo máximo posible', `Aquí se pide 5 para evitar el colapso (${p(49)}). Subirla sin criterio puede sobredistender.`),
          ok('Para evitar el colapso de las vías pequeñas al final de la espiración'),
          no('Para limitar la meseta por debajo de 30 cmH₂O', `La PEEP no limita la meseta; el techo se controla con el volumen (${p(48)}-${p(49)}).`)],
        explicacion: `<span class="hl-azul">PEEP de 5 cmH₂O: evita el colapso de las vías pequeñas</span> y con él el atelectrauma (${p(49)}).` + enFicha(SV, 'nep-peep-protectora') },
      { id: 'sv-g9', corto: 'cuánto CO₂', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'nep-hipercapnia',
        enunciado: 'El bajo volumen deja pasar CO₂. ¿Hasta dónde se tolera la hipercapnia y qué señal impide seguir tolerándola?',
        puntos: [
          `PaCO₂ de <span class="hl-azul">60-70 mmHg</span> y pH de <span class="hl-azul">7,2-7,25</span> son seguros para la mayoría (${p(49)}).`,
          `Se permite <span class="hl-rojo">mientras no haya evidencia de daño</span>, por ejemplo narcosis por CO₂ (${p(49)}).`],
        explicacion: `Los límites no están claros, pero los ensayos de hipercapnia permisiva los sitúan ahí; el pH objetivo del protocolo sigue siendo 7,30-7,45 (${p(49)}).` + enFicha(SV, 'nep-hipercapnia') },
      { id: 'sv-g10', corto: 'quién salva vidas', tipo: 'test', fuente: 'nep-supervivencia',
        enunciado: '¿Qué dice Marino de la ventilación protectora sobre la supervivencia y sobre su uso real?',
        opciones: [
          no('Que, como el ECMO, tiene un beneficio de supervivencia consistente, y que la aplica casi todo el mundo', `El ECMO ha dado resultados negativos o inconsistentes (${p(51)}) y menos de dos tercios recibe ≤8 mL/kg (${p(49)}). Dar por hecho su uso encubre un tratamiento mal aplicado.`),
          no('Que solo reduce los días de respirador, como la APRV, sin beneficio sobre la mortalidad', `Eso se dice de la APRV (${p(50)}); la protectora es la única estrategia ventilatoria con beneficio de supervivencia.`),
          ok('Única estrategia ventilatoria con beneficio de supervivencia, pero se aplica poco')],
        explicacion: `<span class="hl-purpura">Única estrategia ventilatoria con beneficio de supervivencia</span>; en una encuesta, menos de dos tercios recibió volúmenes ≤8 mL/kg de peso predicho (${p(49)}).` + enFicha(SV, 'nep-supervivencia') },
      { id: 'sv-g11', corto: 'APRV', tipo: 'test', fuente: 'nep-aprv',
        enunciado: 'En la APRV se alternan periodos largos de presión alta con liberaciones breves. ¿Qué presión alta y baja se fijan y qué logró en el estudio comparativo?',
        opciones: [
          ok('Alta = última meseta (≤30), baja = 5; menos días de respirador, sin beneficio de supervivencia'),
          no('Alta = 40 para abrir bien los alvéolos, baja = 10; mejor supervivencia que la protectora, con menos días de respirador', `La alta no debe exceder 30 y la baja es 5 (${p(49)}); en el estudio no hubo beneficio de supervivencia (${p(50)}).`),
          no('Alta = 20, baja = 0; menos mortalidad y más días de respirador, según el estudio comparativo', `Se fija la baja en 5 (${p(49)}) y el efecto fue acortar la ventilación, no la mortalidad (${p(50)}).`)],
        explicacion: `<span class="hl-azul">Presión alta = última meseta (≤30); baja = 5 cmH₂O</span> (${p(49)}). Redujo el tiempo con ventilación mecánica, sin beneficio de supervivencia (${p(50)}).` + enFicha(SV, 'nep-aprv') },
      { id: 'sv-g12', corto: 'de qué se muere', tipo: 'test', fuente: 'nep-fmo',
        enunciado: 'Al tratar el SDRA nos centramos en el pulmón. ¿Cuál es la causa principal de muerte, según Marino?',
        opciones: [
          no('El fallo respiratorio refractario, salvo en el COVID-19', `Marino dice lo contrario: el fallo multiorgánico, con la posible excepción del COVID-19 (${p(50)}). Centrar todo en el pulmón es, dice, una prescripción para el fracaso.`),
          ok('El fallo multiorgánico, hasta el 70 % de las muertes'),
          no('La infección pulmonar sobreañadida, en más de la mitad', `No es lo que cuantifica la fuente (${p(50)}). Tratar solo el pulmón o los antibióticos dejaría sin vigilar a los demás órganos.`)],
        explicacion: `<span class="hl-rojo">Hasta el 70 % de las muertes por SDRA son por fallo multiorgánico</span>, y la mortalidad crece con el número de órganos que fallan (${p(50)}).` + enFicha(SV, 'nep-fmo') },
      { id: 'sv-g13', corto: 'ECMO', tipo: 'test', fuente: 'nep-ecmo',
        enunciado: '¿En qué pacientes con SDRA se considera el ECMO, según la ficha?',
        opciones: [
          no('En todos los SDRA graves desde el primer día, antes de probar el prono', `Es una consideración para el 10-15 % con hipoxemia refractaria a la ventilación y al prono (${p(51)}). Indicarlo antes expone a una técnica con resultados inconsistentes.`),
          no('En los que tienen fallo multiorgánico avanzado, para recuperar los órganos', `La indicación es respiratoria: hipoxemia refractaria (${p(51)}); el fallo multiorgánico no la justifica.`),
          ok('En el 10-15 % con hipoxemia refractaria a la ventilación mecánica y a la posición prono')],
        explicacion: `<span class="hl-azul">10-15 % de los pacientes con SDRA</span>, con hipoxemia refractaria a la ventilación y al prono (${p(51)}). Su éxito depende de la reversibilidad del SDRA, difícil de predecir en las primeras semanas.` + enFicha(SV, 'nep-ecmo') },
    ],
    examen: [
      { id: 'sv-e1', corto: 'Vt normal y tradicional', tipo: 'test', fuente: 'nep-vt-tradicional',
        enunciado: '¿Cuáles son el volumen tidal tradicional y el normal, en mL/kg de peso corporal ideal?',
        opciones: [
          no('Tradicional 10, normal 6-7', `El tradicional era 12-15 (${p(46)}); con 10 no se explicaría que fuese «el doble» del normal.`),
          ok('Tradicional 12-15, normal 6-7'),
          no('Tradicional 12-15, normal 10-12', `Lo normal es 6-7 (${p(46)}); con 10-12 la ventilación tradicional no sería «el doble» del normal.`)],
        explicacion: `<span class="hl-rojo">12-15 mL/kg</span> tradicional, aproximadamente el doble del normal de <span class="hl-verde">6-7 mL/kg</span> (${p(46)}).` + enFicha(SV, 'nep-vt-tradicional') },
      { id: 'sv-e2', corto: 'cada cuánto bajar', tipo: 'test', fuente: 'nep-tabla-24-5',
        enunciado: 'En la 1.ª etapa de la Tabla 24.5, ¿con qué ritmo se reduce el Vt desde 8 hasta 6 mL/kg?',
        opciones: [
          no('1 mL/kg cada 6 horas', `El intervalo es 2 h (${p(48)}); cada 6 h tardaría más de lo debido en proteger.`),
          ok('1 mL/kg cada 2 horas'),
          no('2 mL/kg a la vez, en una sola vez', `La tabla reduce de 1 en 1 mL/kg cada 2 h (${p(48)}); el salto brusco no es el ritmo descrito.`)],
        explicacion: `<span class="hl-azul">Reducir el Vt en 1 mL/kg cada 2 h hasta 6 mL/kg</span> (${p(48)}).` + enFicha(SV, 'nep-tabla-24-5') },
      { id: 'sv-e3', corto: 'el techo de la meseta', tipo: 'test', fuente: 'nep-protectora · nep-tabla-24-5',
        enunciado: '¿Qué presión meseta marca el objetivo de la ventilación protectora?',
        opciones: [
          no('≤35 cmH₂O, porque el riesgo solo aparece por encima de 40', `El texto fija ≤30 (${p(48)}); tolerar 35 expone a rotura alveolar.`),
          ok('Alrededor de 30 cmH₂O o menos (≤30 en el texto; <30 en el paso 2)'),
          no('≤20 cmH₂O en todos los pacientes', `Con la rigidez del SDRA sería inalcanzable sin dejar el Vt por debajo del suelo de 4 mL/kg (${p(48)}-${p(49)}).`)],
        explicacion: `Meseta <span class="hl-azul">≤30 cmH₂O</span> (${p(48)}-${p(49)}).`,
        nota: '<b>Nota de fuentes.</b> El libro escribe «≤30» en el texto y en los objetivos de la tabla, y «<30» en el paso 2 de la 2.ª etapa. Se reproducen las dos; no es un error del residente.' + enFicha(SV, 'neumo-nota-meseta-30') },
      { id: 'sv-e4', corto: 'SpO₂ y pH objetivo', tipo: 'test', fuente: 'nep-tabla-24-5',
        enunciado: '¿Cuáles son los objetivos óptimos de oxigenación y de pH de la Tabla 24.5?',
        opciones: [
          no('SpO₂ ≥95 % con la FiO₂ que haga falta, y pH 7,20-7,25', `La SpO₂ objetivo es 88-95 % con la FiO₂ más baja; 7,20-7,25 es lo que se tolera en la hipercapnia permisiva (${p(49)}).`),
          no('SpO₂ 88-95 % con la FiO₂ más baja posible, y pH 7,15-7,30', `El pH objetivo es 7,30-7,45; 7,15-7,30 es el rango en que se sube la FR (${p(48)}-${p(49)}).`),
          ok('SpO₂ 88-95 % y pH 7,30-7,45')],
        explicacion: `<span class="hl-azul">SpO₂ 88-95 % y pH 7,30-7,45</span> (${p(48)}-${p(49)}).` + enFicha(SV, 'nep-tabla-24-5') },
      { id: 'sv-e5', corto: 'dos órganos fallados', tipo: 'test', fuente: 'nep-fig-24-8',
        enunciado: 'Según la Figura 24.8, ¿cuál es la mortalidad con dos órganos extrapulmonares fallados?',
        opciones: [
          no('20 %', `Esa es la de un órgano (${p(51)}); con dos se duplica.`),
          ok('42 %'),
          no('58 %', `Eso es con tres órganos (${p(51)}).`)],
        explicacion: `0 órganos 7 %, 1 órgano 20 %, <span class="hl-rojo">2 órganos 42 %</span>, 3 órganos 58 %, ≥4 órganos 96 % (${p(50)}-${p(51)}).` + enFicha(SV, 'nep-fig-24-8') },
      { id: 'sv-e6', corto: 'segundo criterio ECMO', tipo: 'test', fuente: 'nep-ecmo',
        enunciado: 'Además de PaO₂/FiO₂ <80 mmHg durante ≥6 h, ¿qué otra indicación reciente de ECMO da la ficha?',
        opciones: [
          no('PaO₂/FiO₂ <100 mmHg durante ≥12 h', `La segunda es <50 mmHg durante ≥3 h (${p(51)}); un umbral laxo indicaría el ECMO a pacientes que aún pueden mejorar.`),
          ok('PaO₂/FiO₂ <50 mmHg durante ≥3 h'),
          no('PaO₂/FiO₂ <60 mmHg durante ≥1 h', `El tiempo es ≥3 h (${p(51)}); con 1 h se indicaría ECMO por una desaturación transitoria.`)],
        explicacion: `<span class="hl-azul">PaO₂/FiO₂ <80 durante ≥6 h, o <50 durante ≥3 h</span> (${p(51)}).` + enFicha(SV, 'nep-ecmo') },
    ],
    casos: [
      { id: 'c-sv-isidro', titulo: 'Isidro, 64 años: seis días de respirador', corto: 'Caso · Isidro (ventilación)', sub: 'SDRA moderado: del Vt al fallo de órganos',
        paciente: { Edad: '64 años, varón', 'Peso y talla': '96 kg, 1,75 m (PBW 70,5 kg)', Motivo: 'neumonía bilateral con SDRA', 'PaO₂/FiO₂': '110 con PEEP 10' },
        pasos: [
          { momento: 'Día 1 · la intubación', datos: { PBW: '70,5 kg' }, nuevo: ['PBW'], calculadora: { ir: 'neumo-pbw-altura', nombre: 'Peso predicho' },
            pregunta: { id: 'sv-c1', tipo: 'test', fuente: 'nep-tabla-24-5', origen: 'ficha: la primera etapa; la cuenta, ilustrativa',
              enunciado: 'Isidro mide 1,75 m y pesa 96 kg. ¿Con qué volumen tidal empiezas la ventilación protectora?',
              opciones: [
                no('6 mL/kg de PBW desde el minuto uno: 423 mL', `6 × 70,5 son 423 mL, pero la primera etapa arranca en 8 mL/kg y baja de 1 en 1 cada 2 h (${p(48)}); saltarla no es el ritmo de la tabla.`),
                ok('8 mL/kg de peso predicho: unos 564 mL, y bajar después'),
                no('12 mL/kg de peso predicho para evitar la atelectasia: unos 846 mL', `Es el volumen tradicional, el que se asocia a volutrauma (${p(46)}).`)],
              explicacion: `Primera etapa: PBW, <span class="hl-azul">Vt inicial de 8 mL/kg PBW</span> (8 × 70,5 ≈ 564 mL) y PEEP de 5 (${p(48)}).` + enFicha(SV, 'nep-tabla-24-5') } },
          { momento: 'Día 1 · a las 2 horas', datos: { Vt: '420 mL (6 mL/kg PBW)', PEEP: '10 cmH₂O', 'Meseta (monitor)': '32 cmH₂O' }, nuevo: ['Vt', 'PEEP', 'Meseta (monitor)'],
            pregunta: { id: 'sv-c2', tipo: 'test', fuente: 'nep-tabla-24-5 · nep-protectora', origen: 'ficha: la segunda etapa; la meseta, del monitor de la app (ilustrativa)', modelo: pv('sdra-rigido', '🫁 Isidro con Vt 420'),
              enunciado: 'Ya con Vt de 6 mL/kg, la meseta de Isidro es 32. ¿Qué toca ahora?',
              opciones: [
                no('Dejarlo así: 6 mL/kg es el objetivo y la meseta es secundaria', `El techo de meseta es parte del objetivo (${p(48)}); con 32 queda riesgo de rotura alveolar.`),
                ok('Bajar el Vt a 5 mL/kg (unos 352 mL) y volver a medir la meseta'),
                no('Subir la PEEP a 20 para repartir mejor el volumen', `La tabla no usa la PEEP para bajar la meseta (${p(48)}); a esa presión se sumaría sobredistensión.`)],
              explicacion: `Meseta >30: <span class="hl-azul">bajar el Vt 1 mL/kg</span> hasta meseta <30 o Vt de 4 mL/kg; en el monitor, con 5 mL/kg la meseta baja a unos 29 (${p(48)}).` + enFicha(SV, 'nep-tabla-24-5') } },
          { momento: 'Día 2 · la gasometría', datos: { Vt: '355 mL (5 mL/kg PBW)', FR: '30 rpm', pH: '7,22', 'PaCO₂': '64 mmHg' }, nuevo: ['Vt', 'FR', 'pH', 'PaCO₂'],
            pregunta: { id: 'sv-c3', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'nep-tabla-24-5', origen: 'ficha: la tercera etapa; las cifras gasométricas, ilustrativas', modelo: pv('sdra-protector', '🫁 Isidro con Vt 5 mL/kg y FR 30'),
              enunciado: 'Con Vt 5 mL/kg y FR 30, la gasometría de Isidro da pH 7,22. ¿Qué mandan la tercera etapa y el Vt?',
              puntos: [
                `Con pH 7,15-7,30: <span class="hl-azul">subir la FR</span> hasta pH >7,30 o FR 35, el tope de la tabla; a Isidro, que ya está en 30, le quedan 5 rpm de margen (${p(48)}).`,
                `El <span class="hl-rojo">Vt no se toca</span>: solo se sube si el pH sigue <7,15 con FR 35 (${p(48)}).`],
              explicacion: `Primero la frecuencia; el volumen es lo último que se mueve, porque protege el pulmón (${p(48)}).` + enFicha(SV, 'nep-tabla-24-5') } },
          { momento: 'Día 4 · el relevo', datos: { Vt: '600 mL (8,5 mL/kg PBW)', 'Meseta (monitor)': '42 cmH₂O', 'Presión de conducción (monitor)': '32 cmH₂O' }, nuevo: ['Vt', 'Meseta (monitor)', 'Presión de conducción (monitor)'],
            pregunta: { id: 'sv-c4', tipo: 'test', fuente: 'nep-volutrauma · nep-vt-tradicional', origen: 'ficha: el mecanismo; las cifras, del monitor de la app (ilustrativas)', modelo: pv('volutrauma', '🫁 Isidro con Vt 600'),
              enunciado: 'El relevo subió el Vt a 600 mL para ganar saturación y la meseta es 42. ¿Qué riesgo corre Isidro?',
              opciones: [
                no('Barotrauma: el daño depende de la presión pico, así que basta con cambiar a presión control sin tocar el volumen', `El daño depende del volumen, no de la presión (${p(46)}); cambiar de modo sin bajar el Vt mantiene la sobredistensión.`),
                ok('Volutrauma: 8,5 mL/kg frente al objetivo de 6, con meseta 42 por encima de 30'),
                no('Atelectrauma: el volumen alto cierra las vías pequeñas, y se arregla subiendo la FR', `El volumen alto sobredistiende; el abrir y cerrar es de la falta de PEEP (${p(48)}). Subir la FR añadiría más ciclos.`)],
              explicacion: `Un volumen alto en un pulmón de capacidad reducida: <span class="hl-rojo">volutrauma</span> (${p(46)}). La salida es la de la tabla: bajar el Vt en pasos de 1 mL/kg.` + enFicha(SV, 'nep-volutrauma') } },
          { momento: 'Día 4 · el plan del residente', datos: { Nota: 'cuatro frases' }, nuevo: ['Nota'],
            pregunta: { id: 'sv-c5', tipo: 'error', fuente: 'nep-volutrauma · nep-atelectrauma · nep-protectora', origen: ILU,
              enunciado: 'Tras el susto, el residente plantea cambios para Isidro. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'Vuelvo a Vt de 6 mL/kg de peso predicho y mido la meseta.' },
                { t: 'El VILI es por presión: pasaré a presión control para bajar el pico y mantendré el volumen alto.', mal: true, c: `La lesión es por volumen, no por presión; el culpable es el volutrauma (${p(46)}).` },
                { t: 'Quito la PEEP, porque la ventilación protectora no la necesita.', mal: true, c: `La ventilación protectora usa PEEP para prevenir el atelectrauma (${p(48)}-${p(49)}).` },
                { t: 'Vigilo el pH: el objetivo es 7,30-7,45 y actúo si baja de 7,15.' }],
              explicacion: 'Dos errores: atribuir la lesión a la presión y renunciar a la PEEP que mantiene abiertas las vías pequeñas.' + enFicha(SV, 'nep-protectora') } },
          { momento: 'Día 5 · otros órganos', datos: { ScvO2: '48 %', Creatinina: '3 mg/dL', Noradrenalina: 'sube la dosis' }, nuevo: ['ScvO2', 'Creatinina', 'Noradrenalina'],
            pregunta: { id: 'sv-c6', tipo: 'test', fuente: 'nep-fmo', origen: 'ficha: la idea; las cifras del paciente, inventadas',
              enunciado: 'Isidro necesita más noradrenalina y su creatinina es 3. La oxigenación es aceptable. ¿Dónde pones el foco?',
              opciones: [
                ok('En el conjunto: el pronóstico probablemente lo marcan los órganos extrapulmonares'),
                no('En subir la PEEP hasta mejorar aún más el cociente, que es lo que decide el pronóstico', `Marino afirma que el foco pulmonar descuida la causa principal de muerte (${p(50)}).`),
                no('En acortar el protocolo de ventilación: ya no importa cómo se ventile', `La protectora sigue siendo la estrategia con beneficio (${p(49)}); abandonarla añadiría daño pulmonar a un paciente grave.`)],
              explicacion: `<span class="hl-rojo">Hasta el 70 % de las muertes</span> por SDRA son por fallo multiorgánico, y la mortalidad crece con cada órgano que falla (${p(50)}); sin dejar la ventilación protectora.` + enFicha(SV, 'nep-fmo') } },
          { momento: 'Día 6 · el límite', datos: { 'PaO₂/FiO₂': '70 durante 8 h', Posición: 'prono' }, nuevo: ['PaO₂/FiO₂', 'Posición'],
            pregunta: { id: 'sv-c7', tipo: 'test', fuente: 'nep-ecmo', origen: 'ficha: el criterio; el paciente, inventado',
              enunciado: 'Tras mejorar con el primer prono, Isidro vuelve a empeorar: su cociente lleva 8 horas en 70. ¿Cumple una indicación de ECMO?',
              opciones: [
                no('No: la indicación pide que el cociente sea <80 durante al menos 12 horas', `El tiempo de esa indicación es ≥6 h (${p(51)}); esperar 12 h dilataría la decisión.`),
                ok('Sí, cumple <80 durante ≥6 h: se considera, con ventilación protectora, como ayuda temporal'),
                no('No: el ECMO se reserva a quienes no han usado todavía el prono', `La indicación es la hipoxemia refractaria a ventilación y prono (${p(51)}); él ya lo ha hecho.`)],
              explicacion: `70 es <80 durante 8 h (≥6): se considera el ECMO como medida temporal; su éxito depende de la reversibilidad, difícil de predecir (${p(51)}).` + enFicha(SV, 'nep-ecmo') } },
        ],
        lleva: [
          'El volumen se calcula con el peso predicho, y la meseta debe quedar en ≤30.' + enFicha(SV, 'nep-tabla-24-5'),
          'La lesión del respirador es por volumen: el Vt manda, no la presión pico.' + enFicha(SV, 'nep-volutrauma'),
          'Quien muere de SDRA suele morir de fallo de otros órganos.' + enFicha(SV, 'nep-fmo')],
        volver: { nombre: 'Protocolo de ventilación protectora', ancla: 'nep-tabla-24-5', modelo: pv('sdra-protector', '🫁 Isidro con 5 mL/kg') } },
    ],
    profundizar: [
      { id: 'nep-fig-24-8', titulo: 'Figura 24.8: la mortalidad según los órganos fallados' },
    ],
  },
};
