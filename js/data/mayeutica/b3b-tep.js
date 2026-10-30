// Mayéutica del bloque 3, sub-bloque 3B · Embolia pulmonar aguda (Marino cap. 22, págs. 1-12): fichas neumo-ep-diagnostico y
// neumo-ep-manejo y los casos C6a/C6b de Consuelo. Datos puros; el formato está en la cabecera de b1-fluidos.js.
// Modelos vivos: telarVivo `tvp`, vasoVivo `tep-lisis`, shockVivo `tep` (Consuelo; los estados «tep-intermedio», «tep-alto» y
// «tep-bolo» los da el monitor según la gravedad y los mL) y ecoEscenario `tep`. Las cifras de Consuelo en el monitor se leyeron
// en la app a 390 px (autonomo/bloques/b3/herramientas/g6-app-cifras.mjs), no en el motor; los datos del caso son del paciente.
const PDF = 'docs/marino-2024-respiratory-management-caps22-26.pdf';
const p = n => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">pág. ${n}</a>`;
const DED = '<i>Deducción; la fuente no lo dice.</i>';
const NEU = 'data-especialidad="neumologia" data-view="merinoNeumologia" data-panel="panel-merino-neumo-tabs"';
const enFicha = (tab, id) => ` <button type="button" class="may-ir" ${NEU} data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const DX = 'neumo-ep-diagnostico', MJ = 'neumo-ep-manejo';
const tv = (clave, texto) => ({ telarVivo: clave, texto });
const vv = (clave, texto) => ({ vasoVivo: clave, texto });
const sv = (clave, texto) => ({ shockVivo: clave, texto });
const ce = (clave, texto) => ({ ecoEscenario: clave, texto });

export const MAYEUTICA_TEP = {
  /* =================================================================================================
     Ficha · Embolia pulmonar: evaluación clínica y diagnóstico (cap. 22, págs. 1-7) y el caso C6a
     ================================================================================================= */
  'neumo-ep-diagnostico': {
    entrada: 'Por qué la embolia pulmonar se pasa por alto y a la vez se sobrestudia, qué aporta (y qué no) el dímero D, y cómo la eco de compresión de la pierna decide sin mover al paciente.',
    guia: [
      { id: 'tep-g1', corto: '30 % y 10 %', tipo: 'test', fuente: 'nep-epidemiologia',
        enunciado: 'Marino dice que la EP sufre a la vez de infradiagnóstico y de exceso de pruebas. Antes de leer: ¿qué dos cifras lo reflejan?',
        opciones: [
          { t: 'Hasta el 30 % de las autopsias hospitalarias la muestran, casi siempre sin sospecha; y solo el 10 % de las sospechas se confirman', ok: true },
          { t: 'Solo el 10 % de las autopsias la muestran, y el 30 % de las sospechas se confirman con la prueba, por lo que conviene pedirla ante cualquier duda', porque: `Están cambiadas: son 30 % en la autopsia y 10 % de confirmaciones (${p(1)}). Con ese orden creerías que sospechar es rentable y pedirías pocas pruebas a quien tiene el diagnóstico sin hacer.` },
          { t: 'Se confirma en la mitad de las sospechas, por eso se pide la prueba en cuanto hay disnea', porque: `Se confirma en tan solo el 10 % (${p(1)}); pedir la prueba con cada disnea es el exceso de pruebas que el autor señala.` }],
        explicacion: `En autopsias de pacientes hospitalizados hay émbolos en <span class="hl-rojo">hasta el 30 %</span>, y la mayoría no se sospechó; pero la sospecha clínica solo se confirma en <span class="hl-rojo">el 10 %</span> (${p(1)}).` + enFicha(DX, 'nep-epidemiologia') },
      { id: 'tep-g2', corto: 'PaO₂ normal', tipo: 'test', fuente: 'nep-presentacion · nep-tabla-22-1',
        enunciado: 'Una paciente con sospecha de EP tiene PaO₂ normal. ¿Cuántas EP agudas la tienen y qué te dice eso?',
        opciones: [
          { t: 'El 30 % de las EP tienen PaO₂ normal: no la descarta', ok: true },
          { t: 'Casi ninguna: con PaO₂ normal la EP es muy improbable', porque: `El VPN de la hipoxemia es del 70 %, o sea, el 30 % de los pacientes con EP tiene PaO₂ normal (${p(2)}). Con esa regla descartarías una de cada tres.` },
          { t: 'El 30 % tiene el gradiente A-a normal, pero la PaO₂ siempre está baja', porque: `Marino dice que la PaO₂ puede ser normal en el 30 % y que el gradiente A-a también puede serlo (${p(2)}).` }],
        explicacion: `Para la hipoxemia el valor predictivo negativo es del 70 %: <span class="hl-rojo">el 30 % de los pacientes con EP aguda tiene la PaO₂ normal</span>. Ningún hallazgo de la Tabla 22.1 pasa del 50 % de valor predictivo positivo (${p(2)}).` + enFicha(DX, 'nep-tabla-22-1') },
      { id: 'tep-g3', corto: 'dímero D en UCI', tipo: 'test', fuente: 'nep-dimero-d',
        enunciado: 'El dímero D de un paciente de UCI sale elevado. ¿Qué aporta?',
        opciones: [
          { t: 'Poco: VPP 27 %, y se eleva en hasta el 80 % de los pacientes de UCI', ok: true },
          { t: 'Confirma la EP: el dímero D elevado indica trombosis activa', porque: `El VPP es solo del 27 %: la sepsis, la inflamación, la IC, la insuficiencia renal, el embarazo y la edad avanzada también lo elevan (${p(3)}). Con esa idea anticoagularías a muchos sin trombo.` },
          { t: 'Es la prueba de elección en UCI porque su VPN de 92 % descarta con seguridad', porque: `El VPN de 92 % no sirve donde casi todos lo tienen elevado: Marino no lo considera una prueba útil en la UCI (${p(3)}).` }],
        explicacion: `VPP <span class="hl-rojo">27 %</span> y VPN 92 %: normal, apoya que no hay EP; elevado, no dice nada. En la UCI hasta el <span class="hl-rojo">80 %</span> lo tiene elevado y por eso no se considera una prueba útil (${p(3)}).` + enFicha(DX, 'nep-dimero-d') },
      { id: 'tep-g4', corto: 'apretar la vena', tipo: 'test', fuente: 'nep-tabla-22-2 · nep-eco-venosa', modeloVivo: tv('tvp', '🧵 Aprieta la sonda en la femoral: con y sin trombo'),
        enunciado: 'Predice y luego lo compruebas en el telar: aprietas con la sonda sobre la vena femoral de una pierna con un trombo dentro. ¿Qué ves?',
        opciones: [
          { t: 'La vena no se aplasta: una vena llena de trombo no se comprime, y eso es el signo', ok: true },
          { t: 'La vena se aplasta igual y el trombo se ve como una mancha dentro de la luz, brillante y fija', porque: `Una vena normal es la que se comprime y borra su luz; la que contiene trombos no (${p(4)}). Si esperas que se aplaste, darás por normal una TVP.` },
          { t: 'La vena se comprime menos y con el Doppler color basta para decidir', porque: `El Doppler color es solo un complemento: la TVP es flujo lento o ausente en una vena incompresible (${p(4)}).` }],
        explicacion: `En la ecografía de compresión, una vena normal se comprime y obliteras su luz (Fig. 1.7); <span class="hl-rojo">una vena con trombos no se comprime</span>. Con color, la TVP es flujo lento o ausente en una vena incompresible; las dos juntas son el dúplex (${p(4)}).` + enFicha(DX, 'nep-eco-venosa') },
      { id: 'tep-g5', corto: 'TVP proximal', tipo: 'test', fuente: 'nep-eco-venosa',
        enunciado: 'La eco de compresión de un paciente estable muestra una TVP proximal de la pierna. ¿Qué sigue?',
        opciones: [
          { t: 'Anticoagular como en la EP y no seguir buscando el émbolo', ok: true },
          { t: 'Una angio-TC igualmente, para confirmar que hay embolia antes de anticoagular', porque: `Con TVP detectada no hace falta más estudio de émbolos, salvo que el paciente esté inestable (${p(4)}); la angio-TC añade 15 mSv y contraste sin cambiar la pauta (${p(6)}).` },
          { t: 'Esperar a repetir la eco en unos días: una TVP aislada no necesita tratamiento', porque: `Se inicia ya la anticoagulación con las mismas pautas que en la EP; solo difiere la duración (${p(4)}).` }],
        explicacion: `Entre el 30 y el 50 % de las EP tienen una TVP proximal en las piernas; si se ve, <span class="hl-verde">no hace falta más estudio</span> (salvo inestabilidad) y se anticoagula con los mismos esquemas que la EP (${p(3)}, ${p(4)}).` + enFicha(DX, 'nep-eco-venosa') },
      { id: 'tep-g6', corto: 'sin anticoagular', tipo: 'test', fuente: 'nep-subsegmentarios',
        enunciado: 'La angio-TC halla un émbolo subsegmentario (<2,5 mm). ¿Cuándo es razonable no anticoagular?',
        opciones: [
          { t: 'Si cumple las cuatro a la vez: único, sin trombo en las piernas, sin disfunción del VD y sin comorbilidad importante', ok: true },
          { t: 'Siempre que sea subsegmentario, porque por su tamaño no daña, aunque haya varios émbolos o trombo residual en las piernas', porque: `Si hay varios émbolos subsegmentarios, la recurrencia sin anticoagulante fue mucho mayor (${p(5)}).` },
          { t: 'Si es único y no hay hipoxemia; las piernas y el VD no importan', porque: `Hacen falta las cuatro: único, sin residuo en piernas por eco, sin disfunción del VD y sin comorbilidades (${p(6)}).` }],
        explicacion: `<span class="hl-azul">Las cuatro a la vez</span>: émbolo único, sin trombo en las piernas, sin disfunción del VD y sin comorbilidad significativa (p. ej. hipoxemia) (${p(5)}-${p(6)}).`,
        nota: `<b>La fuente no lo dice</b> con grado de evidencia: Marino lo presenta como «parece razonable» a partir de los estudios citados.` + enFicha(DX, 'nep-subsegmentarios') },
      { id: 'tep-g7', corto: 'eco: signos propios', tipo: 'destapa', cuantas: 'son dos', fuente: 'nep-ecocardio', modelo: ce('tep', '🫀 La circulación viva con un émbolo'),
        enunciado: 'La eco transtorácica se hace sobre todo para valorar el VD. Pero ¿qué dos hallazgos son específicos de EP?',
        puntos: [
          `<span class="hl-rojo">Trombos móviles en el corazón derecho</span>: del 2 al 18 %, más en la EP masiva (${p(7)}).`,
          `<span class="hl-rojo">Signo de McConnell</span>: acinesia de la pared libre del VD con el ápex normal; en el 20 % (${p(7)}).`],
        explicacion: `Son infrecuentes, pero cuando las demás pruebas no diagnostican suman. La dilatación del VD con troponina alta (sobrecarga derecha) da pronóstico, no diagnóstico (${p(7)}).` + enFicha(DX, 'nep-ecocardio') },
    ],
    examen: [
      { id: 'tep-e1', corto: 'ningún hallazgo >50 %', tipo: 'test', fuente: 'nep-tabla-22-1',
        enunciado: 'Según la Tabla 22.1, ¿qué hallazgo clínico confirma una EP?',
        opciones: [
          { t: 'Ninguno: el mayor VPP es el de la taquipnea, 48 %', ok: true },
          { t: 'La taquicardia, con un VPP de 47 % y un VPN de 86 %: es la más fiable', porque: `Su VPN de 86 % es el más alto, pero el VPP (47 %) no confirma nada: ninguno pasa del 50 % (${p(2)}).` },
          { t: 'La taquipnea, porque con VPP de 48 % y VPN de 75 % su ausencia descarta', porque: `Marino pide un VPN ≥98 % para excluir una enfermedad; el mejor es del 86 % (${p(2)}).` }],
        explicacion: `<span class="hl-rojo">Ninguno pasa del 50 % de VPP</span> (taquipnea 48 %, taquicardia 47 %), y para descartar haría falta un VPN ≥98 %; el mejor es el de la taquicardia, 86 % (${p(2)}).` + enFicha(DX, 'nep-tabla-22-1') },
      { id: 'tep-e2', corto: 'angio-TC', tipo: 'test', fuente: 'nep-ctpa · nep-fig-22-1',
        enunciado: '¿Qué dice Marino de la angio-TC multidetector en la EP?',
        opciones: [
          { t: 'Es la prueba de elección y su VPN es 95 %; se evita con aclaramiento <30 mL/min y dan unos 15 mSv', ok: true },
          { t: 'Es la prueba de elección, pero la dosis de radiación (unos 2 mSv) la hace segura en la embarazada y en la lactancia', porque: `Los 2 mSv son los de la gammagrafía V/Q; la angio-TC supone unos 15 mSv y en el embarazo y la lactancia hay que valorar alternativas (${p(6)}).` },
          { t: 'Es la prueba de elección, y con un aclaramiento de 25 mL/min basta una hidratación', porque: `Con ClCr <30 se evita el contraste si es posible, y si se usa se protege con volumen y N-acetilcisteína, no solo con hidratación (${p(6)}); si lo olvidas, el riñón sufre una nefropatía por contraste.` }],
        explicacion: `Un VPN de <span class="hl-azul">95 %</span> hace que una angio-TC normal elimine la EP; el riesgo es la nefropatía por contraste (evitar con ClCr <30 mL/min/1,73 m²) y la radiación, <span class="hl-rojo">15 mSv</span> de media (${p(5)}-${p(6)}).` + enFicha(DX, 'nep-ctpa') },
      { id: 'tep-e3', corto: 'gammagrafía V/Q', tipo: 'test', fuente: 'nep-vq',
        enunciado: 'Una V/Q «indeterminada» en un paciente estable con eco venosa negativa. ¿Qué haces con ella?',
        opciones: [
          { t: 'Las dos juntas permiten excluir la EP, solo si está estable', ok: true },
          { t: 'Nada: una V/Q indeterminada nunca sirve para nada', porque: `Aunque aporta poco aislada (alrededor de tres cuartas partes son indeterminadas), con una eco venosa negativa permite excluir en estables (${p(6)}).` },
          { t: 'Confirmas la EP: hay defectos de perfusión', porque: `La que confirma es la de alta probabilidad (defectos de perfusión sin ventilación); la indeterminada tiene defectos que coinciden y no confirma ni excluye por sí sola (${p(6)}).` }],
        explicacion: `Aproximadamente tres cuartas partes son indeterminadas; <span class="hl-azul">indeterminada + eco venosa negativa</span> excluye la EP, pero solo con estabilidad hemodinámica (${p(6)}).` + enFicha(DX, 'nep-vq') },
    ],
    profundizar: [
      { id: 'nep-tabla-22-2', titulo: 'Tabla 22.2: las cuatro pruebas de imagen, lo positivo y lo negativo' },
      { id: 'nep-fig-22-1', titulo: 'Figura 22.1: el émbolo en la angio-TC' },
      { id: 'nep-vq', titulo: 'La gammagrafía V/Q y sus tres resultados' },
    ],
    casos: [
      { id: 'c-tep-dx', titulo: 'Consuelo, 63 años: la pierna decide', corto: 'Caso · Consuelo (diagnóstico)', sub: '142 kg, día 5 de prótesis de cadera; disnea súbita',
        paciente: { Edad: '63 años, mujer', Peso: '142 kg, 1,60 m', Antecedentes: 'día 5 de una prótesis de cadera; vía subclavia derecha desde el día 1', Motivo: 'disnea súbita a las 10:00' },
        pasos: [
          { momento: '10:00', datos: { Disnea: 'súbita', FC: '112', 'PaO₂': '88 mmHg', 'Rx de tórax': 'sin infiltrados' }, nuevo: ['Disnea', 'FC', 'PaO₂'],
            pregunta: { id: 'tep-c1', tipo: 'test', fuente: 'nep-tabla-22-1', origen: 'ficha: el 30 %; el paciente es inventado',
              enunciado: 'Disnea súbita, FC 112 y PaO₂ 88 mmHg en una paciente con una prótesis de cadera reciente. ¿La PaO₂ normal te descarta la EP?',
              opciones: [
                { t: 'No: el 30 % de las EP tienen la PaO₂ normal', ok: true },
                { t: 'Sí: sin hipoxemia la EP es muy improbable', porque: `El VPN de la hipoxemia es solo del 70 % (${p(2)}); descartarla la dejaría sin estudio, con una cirugía de cadera reciente por delante como factor de riesgo (${p(2)}).` },
                { t: 'Sí, si además la taquicardia es de 112, que apunta a otra causa', porque: `La taquicardia tiene VPP del 47 % y VPN del 86 %: no descarta ni confirma (${p(2)}).` }],
              explicacion: `<span class="hl-rojo">El 30 % de los pacientes con EP tiene la PaO₂ normal</span>; los factores de riesgo, como el postoperatorio, deciden la probabilidad (${p(2)}).` + enFicha(DX, 'nep-tabla-22-1') } },
          { momento: '10:30', datos: { 'Dímero D': '2.400 ng/mL' }, nuevo: ['Dímero D'],
            pregunta: { id: 'tep-c2', tipo: 'test', fuente: 'nep-dimero-d', origen: 'ficha: VPP, VPN y el 80 %; la cifra de 2.400, del caso',
              enunciado: 'El dímero D sale en 2.400. ¿Qué te aporta en una paciente que está en el hospital y operada hace 5 días?',
              opciones: [
                { t: 'Poco: su VPP es 27 % y en la UCI la mayoría lo tiene elevado', ok: true },
                { t: 'Confirma la EP, al ser tan alto', porque: `Su VPP es del 27 % y la cirugía, la sepsis o la inflamación también lo elevan (${p(3)}). Anticoagular sin imagen sería un acto basado en un dato sin valor aquí.` },
                { t: 'La descarta si baja a la mitad en 24 h', porque: `Marino no propone repetirlo: lo considera poco útil en la UCI porque hasta el 80 % lo tienen elevado (${p(3)}).` }],
              explicacion: `VPP <span class="hl-rojo">27 %</span>; hasta el 80 % de los pacientes de UCI lo tienen elevado y no se considera útil en ese contexto (${p(3)}).` + enFicha(DX, 'nep-dimero-d') } },
          { momento: '10:45', datos: { Situación: 'estable, en cama', 'Dónde': 'sin salir de la UCI' }, nuevo: ['Situación'],
            pregunta: { id: 'tep-c3', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'nep-eco-venosa', modelo: tv('tvp', '🧵 La eco de compresión en el telar'), origen: 'ficha',
              enunciado: 'No quieres trasladarla. ¿Qué dos métodos de la eco venosa de las piernas usas junto a la cama para empezar?',
              puntos: [
                `<span class="hl-azul">La compresión</span>: la vena que comprime la sonda se borra; la que tiene trombo no (${p(4)}).`,
                `<span class="hl-azul">El Doppler color</span> como complemento: flujo lento o ausente en una vena incompresible; juntos son el dúplex (${p(4)}).`],
              explicacion: `La mayoría de los émbolos nacen en las venas del muslo y la ingle; el dúplex tiene sensibilidad ≥95 % y especificidad ≥97 % en la TVP proximal, y evita el traslado (${p(4)}).` + enFicha(DX, 'nep-eco-venosa') } },
          { momento: '11:00 · la eco', datos: { 'Vena femoral': 'no se comprime', 'Doppler color': 'sin flujo' }, nuevo: ['Vena femoral', 'Doppler color'],
            pregunta: { id: 'tep-c4', tipo: 'test', fuente: 'nep-eco-venosa', modeloVivo: tv('tvp', '🧵 TVP: la femoral que no se aplasta'), origen: 'ficha; el hallazgo, del caso',
              enunciado: 'La femoral no se comprime y no tiene flujo. La paciente sigue estable. ¿Pides una angio-TC?',
              opciones: [
                { t: 'No: anticoagulas como en la EP; con una TVP proximal y estabilidad, no hace falta más estudio', ok: true },
                { t: 'Sí: sin la angio-TC no puedes afirmar que hay una EP ni justificar el tratamiento anticoagulante completo', porque: `Con TVP proximal y paciente estable no se sigue buscando el émbolo (${p(4)}); la TC añade 15 mSv y contraste (${p(6)}).` },
                { t: 'Sí, y esperas el resultado antes de anticoagular', porque: `Se inicia ya la anticoagulación con las pautas de la EP (${p(4)}); esperar deja el trombo sin tratar.` }],
              explicacion: `<span class="hl-verde">Vena incompresible = TVP</span>: sin más estudio si está estable, y anticoagulación con los esquemas de la EP; solo la inestabilidad cambia esto (${p(4)}).` + enFicha(DX, 'nep-eco-venosa') } },
          { momento: '13:00 · el giro', datos: { 'Brazo derecho': 'hinchado', 'Vía subclavia': 'del día 1', 'Eco del brazo': 'subclavia incompresible' }, nuevo: ['Brazo derecho', 'Eco del brazo'],
            pregunta: { id: 'tep-c5', tipo: 'test', fuente: 'nep-tvp-brazo', origen: 'ficha: <10 % y la conducta; la paciente es inventada',
              enunciado: 'Además de la pierna, el brazo con la vía subclavia está hinchado y la eco muestra una trombosis. ¿Qué haces con el catéter?',
              opciones: [
                { t: 'Retirarlo ya y anticoagular; el brazo rara vez da la EP, el émbolo viene de la pierna', ok: true },
                { t: 'Dejarlo: ya está anticoagulada y lo necesita para seguir pasando medicación, así que se retira solo si falla', porque: `Una eco positiva en el brazo lleva a anticoagular y retirar de inmediato el catéter responsable (${p(4)}).` },
                { t: 'Retirarlo, porque es la causa de la EP', porque: `La TVP del brazo da una EP sintomática en menos del 10 % de los casos (${p(4)}); la mayoría de los émbolos vienen de las venas del muslo y la ingle (${p(4)}).` }],
              explicacion: `La TVP del brazo con catéter se anticoagula y <span class="hl-rojo">se retira el catéter de inmediato</span>; da EP sintomática en <10 % (${p(4)}).`,
              nota: `<b>Deducción; la fuente no lo dice:</b> que en Consuelo el émbolo venga de la pierna y no del brazo; es la inferencia de los porcentajes de Marino.` + enFicha(DX, 'nep-tvp-brazo') } },
          { momento: '13:20 · repaso', datos: { Diagnóstico: 'TVP femoral y TVP subclavia derecha', 'Notas del R1': 'cuatro frases' }, nuevo: ['Diagnóstico'],
            pregunta: { id: 'tep-c6', tipo: 'error', fuente: 'nep-dimero-d · nep-eco-venosa · nep-tvp-brazo', origen: 'ficha',
              enunciado: 'Notas del residente sobre Consuelo. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'Dímero D 2.400: EP confirmada.', mal: true, c: `El dímero D tiene un VPP del 27 % y en la UCI casi todos lo tienen elevado (${p(3)}).` },
                { t: 'Femoral no compresible y estable: sin angio-TC.' },
                { t: 'Dejar la subclavia, que ya está anticoagulada.', mal: true, c: `Se anticoagula y se retira el catéter de inmediato (${p(4)}).` },
                { t: 'Una eco venosa negativa no habría descartado la EP.' }],
              explicacion: 'Dos errores: tomar el dímero D por una prueba y dejar el catéter en una vena trombosada.',
              nota: `Una eco venosa negativa no elimina la EP y obliga a otra prueba de imagen (${p(3)}, ${p(4)}).` + enFicha(DX, 'nep-eco-venosa') } },
        ],
        lleva: [
          'La eco junto a la cama decide; el dímero D en la UCI, no.' + enFicha(DX, 'nep-eco-venosa'),
          'Una vena que no se comprime es una TVP: con la paciente estable se anticoagula sin angio-TC.' + enFicha(DX, 'nep-tabla-22-2'),
          'Un catéter en una vena trombosada se retira; el émbolo suele venir de la pierna.' + enFicha(DX, 'nep-tvp-brazo')],
        volver: { nombre: 'La eco venosa de las piernas', ancla: 'nep-eco-venosa', modelo: tv('tvp', '🧵 La eco de compresión en el telar') } },
    ],
  },

  /* =================================================================================================
     Ficha · Embolia pulmonar: manejo (cap. 22, págs. 7-12) y el caso C6b
     ================================================================================================= */
  'neumo-ep-manejo': {
    entrada: 'Qué decide el riesgo de una EP, por qué la heparina no disuelve el émbolo, cuándo la lisis está prohibida y por qué un litro de suero puede empeorar al ventrículo derecho.',
    guia: [
      { id: 'tep-m1', corto: 'qué es alto riesgo', tipo: 'test', fuente: 'nep-riesgo',
        enunciado: 'Una EP con VD dilatado y troponina elevada, y con la PA normal. ¿En qué nivel de riesgo está?',
        opciones: [
          { t: 'Riesgo intermedio: hay disfunción del VD, pero no inestabilidad hemodinámica', ok: true },
          { t: 'Alto riesgo, porque el VD y la troponina ya indican daño', porque: `Alto riesgo exige además inestabilidad hemodinámica (${p(7)}). Con ese criterio pondrías lisis a un paciente que solo necesita vigilancia.` },
          { t: 'Bajo riesgo, porque la tensión es normal', porque: `El bajo riesgo es sin disfunción del VD ni inestabilidad ni comorbilidad (${p(7)}); darías el alta a quien necesita 24-48 h de observación (${p(8)}).` }],
        explicacion: `<span class="hl-azul">Riesgo = VD + troponina + inestabilidad.</span> Intermedio: disfunción del VD (con o sin troponina) sin inestabilidad; alto: la sobrecarga del VD con troponina elevada <b>y</b> inestabilidad (${p(7)}).`,
        nota: `<b>La fuente no lo dice:</b> con qué cifra de PA se declara la inestabilidad. El modelo usa la PAM <65 mmHg, regla del modelo.` + enFicha(MJ, 'nep-riesgo') },
      { id: 'tep-m2', corto: 'enoxaparina 24-48 h', tipo: 'test', fuente: 'nep-intermedio · nep-tabla-22-3',
        enunciado: 'Un paciente con EP de riesgo intermedio. ¿Qué anticoagulante y durante cuánto?',
        opciones: [
          { t: 'Enoxaparina 1 mg/kg/12 h, vigilando 24-48 h; si no empeora, pasa a un anticoagulante oral', ok: true },
          { t: 'Un anticoagulante oral directo desde el primer momento y alta precoz a domicilio, al ser la tensión normal', porque: `Eso es el bajo riesgo; el intermedio se vigila en el hospital 24-48 h por la posibilidad de deterioro (${p(8)}).` },
          { t: 'Heparina no fraccionada con bolo de 80 U/kg, como en el alto riesgo', porque: `Esa pauta es la del alto riesgo (${p(7)}-${p(8)}); en el intermedio se usa enoxaparina (${p(8)}).` }],
        explicacion: `Intermedio: <span class="hl-azul">enoxaparina 1 mg/kg cada 12 h</span> y observación de 24 a 48 h; si no hay deterioro, se pasa a la pauta oral del bajo riesgo (${p(8)}).`,
        nota: `<b>La fuente no lo dice:</b> la dosis de enoxaparina en la obesidad extrema; la ficha da 1 mg/kg sin ajuste para pesos como los de Consuelo.` + enFicha(MJ, 'nep-intermedio') },
      { id: 'tep-m3', corto: 'el bolo de suero', tipo: 'test', fuente: 'nep-hemodinamica', modeloVivo: sv('tep', '🫀 Consuelo: da 500 mL y mira el gasto, la PVC y el tabique'),
        origen: 'ficha; las cifras del monitor, ilustrativas',
        enunciado: 'Predice, y luego lo compruebas en el modelo: a una paciente con EP, VD dilatado e hipotensión le das 500 mL de cristaloide para subir la PA. ¿Qué pasa con el gasto?',
        opciones: [
          { t: 'Apenas cambia: el VD se dilata más, empuja el tabique hacia el VI y este se llena menos', ok: true },
          { t: 'Sube bien: más precarga, más volumen sistólico, más gasto y una PA que se normaliza en minutos', porque: `En la EP el problema es la obstrucción, no la falta de volumen; el volumen agresivo sobrecarga el VD (${p(10)}).` },
          { t: 'Sube y deja de hacer falta noradrenalina, mientras la PVC sea normal', porque: `Con PVC normal sí se acepta volumen, pero limitado a 500 mL y guiado por eco (${p(10)}); la noradrenalina sigue siendo la indicada para la hipotensión (${p(11)}).` }],
        explicacion: `El volumen agresivo sobrecarga el VD, <span class="hl-rojo">empuja el tabique hacia el VI</span> y dificulta su llenado; por eso el tope de 500 mL y la eco como guía (${p(10)}).`,
        nota: `<b>En el modelo (ilustrativo; Consuelo, PAM <65 mmHg):</b> antes de los 500 mL, 67/54, FC 117, PVC 9 e IC 1,3; después, 72/58, FC 112, PVC 12 e IC 1,4. La PVC sube y el gasto casi no. <b>La fuente no lo dice:</b> cuánto sube cada cifra.` + enFicha(MJ, 'nep-hemodinamica') },
      { id: 'tep-m4', corto: 'dobutamina e hipotensión', tipo: 'test', fuente: 'nep-hemodinamica', modeloVivo: sv('tep', '🫀 Consuelo en el monitor: la PA con VD sobrecargado'),
        enunciado: 'Se contempla la dobutamina en la EP. ¿Cuándo, y qué cuidado hay con la hipotensión?',
        opciones: [
          { t: 'Con sobrecarga del VD y PA normal; si hay hipotensión no se usa sola, porque vasodilata', ok: true },
          { t: 'Es la primera elección en la hipotensión de la EP: sube el gasto del VD y mejora la perfusión', porque: `La dobutamina es vasodilatadora y no debe usarse sola si la EP produce hipotensión (${p(11)}); para eso se indica noradrenalina.` },
          { t: 'Nunca en la EP, porque aumenta la resistencia pulmonar', porque: `Marino la considera con sobrecarga del VD y PA normal (${p(11)}); la que no sube la resistencia pulmonar es la noradrenalina, y es otra cosa.` }],
        explicacion: `Las guías la consideran con <span class="hl-azul">sobrecarga del VD y presión normal</span> (riesgo intermedio); <span class="hl-rojo">no sola</span> si hay hipotensión, porque es vasodilatadora (${p(11)}).` + enFicha(MJ, 'nep-hemodinamica') },
      { id: 'tep-m5', corto: 'noradrenalina', tipo: 'test', fuente: 'nep-hemodinamica',
        enunciado: '¿Por qué la noradrenalina es el vasopresor indicado en la hipotensión por EP?',
        opciones: [
          { t: 'No aumenta la resistencia vascular pulmonar', ok: true },
          { t: 'Porque dilata el lecho pulmonar y baja la presión que soporta el VD', porque: `No se describe así: Marino dice solo que no sube la resistencia pulmonar (${p(11)}). Dar un fármaco por una vasodilatación pulmonar que no tiene sería un error de razonamiento (${DED}).` },
          { t: 'Porque es inotrópica pura y no toca las resistencias', porque: `Su ventaja es no subir la resistencia pulmonar (${p(11)}); la dobutamina es la vasodilatadora, y no sola.` }],
        explicacion: `Está recomendada en la hipotensión de la EP <span class="hl-azul">porque no aumenta la resistencia vascular pulmonar</span> (${p(11)}).` + enFicha(MJ, 'nep-hemodinamica') },
      { id: 'tep-m6', corto: 'heparina tras lisis', tipo: 'test', fuente: 'nep-alto-riesgo · nep-trombolisis', modeloVivo: vv('tep-lisis', '🩹 Lisis y heparina: mira el émbolo'),
        enunciado: 'Tras una lisis con éxito, ¿por qué la heparina es especialmente útil?',
        opciones: [
          { t: 'Porque al disolverse el coágulo se libera trombina, que puede reocluir el vaso', ok: true },
          { t: 'Porque la lisis ya anticoagula y la heparina solo corrige el exceso', porque: `Es al contrario: se suele detener y reiniciar tras el fibrinolítico, pero la disolución libera trombina que favorece la reoclusión (${p(9)}).` },
          { t: 'Porque la heparina termina de disolver lo que la lisis dejó', porque: `Marino aclara que anticoagular no es disolver el émbolo, sino prevenir el siguiente (${p(11)}).` }],
        explicacion: `<span class="hl-azul">La disolución del coágulo libera trombina</span>, que puede producir la reoclusión del vaso: la heparina es especialmente útil tras la lisis (${p(9)}).` + enFicha(MJ, 'nep-trombolisis') },
      { id: 'tep-m7', corto: 'sin lisis ni anticoagular', tipo: 'destapa', cuantas: 'son dos', fuente: 'nep-trombectomia · nep-filtro-indicaciones', modeloVivo: vv('tep-lisis', '🩹 Marca una contraindicación en el vaso'),
        enunciado: 'Un paciente con EP de alto riesgo no puede recibir lisis; otro no puede recibir ningún anticoagulante. ¿Qué haces en cada caso?',
        puntos: [
          `Lisis contraindicada o fallida: <span class="hl-azul">trombectomía mecánica</span> por catéter como rescate (${p(10)}).`,
          `Sin posibilidad de anticoagular (p. ej. sangrado activo) y con TVP o EP: <span class="hl-azul">filtro de vena cava</span> (${p(12)}).`],
        explicacion: `El filtro previene EP recurrentes desde las venas de las piernas; también se indica si la EP ocurre con la anticoagulación terapéutica y el origen son las venas de piernas o pelvis (${p(11)}, ${p(12)}).` + enFicha(MJ, 'nep-filtro-indicaciones') },
    ],
    examen: [
      { id: 'tep-e4', corto: 'pautas orales', tipo: 'test', fuente: 'nep-bajo-riesgo · nep-tabla-22-3',
        enunciado: '¿Qué pautas orales da Marino para el riesgo bajo, y qué se sabe del sangrado con ellas?',
        opciones: [
          { t: 'Rivaroxabán 15 mg/12 h 3 semanas y luego 20 mg/día; o apixabán 10 mg/12 h 7 días y luego 5 mg/12 h; sin más sangrado', ok: true },
          { t: 'Rivaroxabán 20 mg/día desde el inicio y apixabán 5 mg/12 h, con más sangrado que la dosis habitual, por lo que se reserva a pacientes sin riesgo hemorrágico', porque: `La dosis inicial es mayor de lo habitual, pero no aumenta el riesgo de sangrado (${p(8)}).` },
          { t: 'Apixabán 15 mg/12 h 3 semanas y rivaroxabán 10 mg/12 h 7 días', porque: `Las cifras están cruzadas entre fármacos: el rivaroxabán es el de 15 mg ×3 semanas y el apixabán el de 10 mg ×7 días (${p(8)}).` }],
        explicacion: `<span class="hl-azul">Rivaroxabán 15 mg/12 h ×3 sem → 20 mg/24 h; apixabán 10 mg/12 h ×7 d → 5 mg/12 h.</span> La dosis inicial es mayor que la habitual, sin aumentar el sangrado (${p(8)}).` + enFicha(MJ, 'nep-bajo-riesgo') },
      { id: 'tep-e5', corto: 'ClCr ≤30', tipo: 'test', fuente: 'nep-bajo-riesgo',
        enunciado: 'Una EP de bajo riesgo con aclaramiento de creatinina de 25 mL/min/1,73 m². ¿Qué anticoagulas?',
        opciones: [
          { t: 'Warfarina, con enoxaparina 1 mg/kg una vez al día hasta que el INR sea terapéutico', ok: true },
          { t: 'Un anticoagulante oral directo a la mitad de la dosis', porque: `Con ClCr ≤30 no se recomiendan los anticoagulantes orales directos (${p(8)}).` },
          { t: 'Enoxaparina 1 mg/kg cada 12 h sin warfarina, porque el aclaramiento no influye en la dosis ni en el riesgo de acumulación', porque: `Con ClCr ≤30 se usa la dosis reducida de 1 mg/kg una vez al día, que se puede usar hasta un aclaramiento de 15 (${p(8)}).` }],
        explicacion: `Con <span class="hl-rojo">ClCr ≤30</span> no se recomiendan los DOAC: warfarina, y enoxaparina a dosis reducida hasta que el INR sea terapéutico; la warfarina tarda 2-3 días en hacer efecto (${p(8)}).` + enFicha(MJ, 'nep-bajo-riesgo') },
      { id: 'tep-e6', corto: 'filtro profiláctico', tipo: 'test', fuente: 'nep-filtro-indicaciones',
        enunciado: 'Se plantea poner filtros de vena cava como prevención en politrauma o cirugía bariátrica. ¿Qué dicen los estudios?',
        opciones: [
          { t: 'Reducen la EP en un 60 % pero aumentan la TVP un 70 %; el beneficio global se cuestiona', ok: true },
          { t: 'Reducen la EP en un 60 % sin efectos adversos relevantes: es una indicación aceptada en politrauma y cirugía bariátrica', porque: `Aumentan la TVP un 70 % y el beneficio global se cuestiona (${p(12)}).` },
          { t: 'No reducen la EP, pero evitan la TVP', porque: `Es al revés: la EP baja alrededor de un 60 % y la TVP sube un 70 % (${p(12)}).` }],
        explicacion: `Prevención con filtro: la EP baja <span class="hl-azul">≈60 %</span>, pero la TVP sube <span class="hl-rojo">70 %</span>; la práctica se cuestiona (${p(12)}).` + enFicha(MJ, 'nep-filtro-indicaciones') },
    ],
    profundizar: [
      { id: 'nep-tabla-22-3', titulo: 'Tabla 22.3: las estrategias antitrombóticas de los tres niveles de riesgo' },
      { id: 'nep-fig-22-2', titulo: 'Figura 22.2: el coágulo extraído por catéter' },
      { id: 'nep-filtro-experiencia', titulo: 'Los filtros en la práctica: qué complicaciones dan' },
    ],
    casos: [
      { id: 'c-tep-mj', titulo: 'Consuelo, 63 años: del riesgo intermedio al alto', corto: 'Caso · Consuelo (manejo)', sub: '142 kg; el VD, la lisis prohibida y la heparina',
        paciente: { Edad: '63 años, mujer', Peso: '142 kg, 1,60 m (IMC 55)', Antecedentes: 'día 5 de prótesis de cadera', Motivo: 'EP con TVP femoral ya anticoagulada' },
        pasos: [
          { momento: '14:00', datos: { 'Eco': 'VD dilatado', Troponina: 'elevada', PA: '86/66 (PAM 76)', FC: '94', PVC: '8 mmHg' }, nuevo: ['Eco', 'Troponina', 'PA', 'FC', 'PVC'],
            pregunta: { id: 'tep-k1', tipo: 'test', fuente: 'nep-riesgo · nep-intermedio', modeloVivo: sv('tep', '🫀 Consuelo: baja la gravedad a 80 y mira el riesgo intermedio'),
              origen: 'ficha; las cifras de Consuelo, del monitor de la app (gravedad 80), ilustrativas; el paciente, inventado',
              enunciado: 'VD dilatado, troponina elevada y una PAM de 76. ¿Qué anticoagulante y qué vigilancia?',
              opciones: [
                { t: 'Enoxaparina 1 mg/kg cada 12 h y vigilancia de 24-48 h en el hospital', ok: true },
                { t: 'Un anticoagulante oral y alta, porque la tensión es normal y no hay inestabilidad', porque: `Con disfunción del VD es un riesgo intermedio: se vigila 24-48 h por el riesgo de deterioro (${p(8)}).` },
                { t: 'Lisis ya: el VD está dilatado y la troponina alta', porque: `La lisis no está recomendada oficialmente en el riesgo intermedio; reduce la descompensación pero aumenta el sangrado grave (${p(8)}).` }],
              explicacion: `<span class="hl-azul">Intermedio:</span> disfunción del VD con troponina y sin inestabilidad (${p(7)}); enoxaparina 1 mg/kg/12 h y 24-48 h de vigilancia (${p(8)}).`,
              nota: `<b>La fuente no lo dice:</b> la dosis de enoxaparina para 142 kg; la ficha da 1 mg/kg sin ajuste en obesidad. Las cifras de Consuelo son del monitor de la app (ilustrativo).` + enFicha(MJ, 'nep-intermedio') } },
          { momento: '15:00', datos: { PA: '86/66', Idea: 'añadir un inotrópico para el VD' }, nuevo: ['Idea'],
            pregunta: { id: 'tep-k2', tipo: 'test', fuente: 'nep-hemodinamica', origen: 'ficha',
              enunciado: 'El equipo propone dobutamina por el VD. Predice: ¿se puede con la PA normal? ¿y si la presión cae?',
              opciones: [
                { t: 'Se considera con la PA normal; si cae, nunca sola: es vasodilatadora', ok: true },
                { t: 'No se considera nunca en la EP', porque: `Las guías la consideran con sobrecarga del VD y PA normal (${p(11)}).` },
                { t: 'Es la que se sube si la presión cae, porque aumenta el gasto', porque: `Si la EP produce hipotensión no se usa sola, por su efecto vasodilatador (${p(11)}); se usa noradrenalina.` }],
              explicacion: `Con sobrecarga del VD y PA normal, sí; con hipotensión, <span class="hl-rojo">no sola</span> (${p(11)}).` + enFicha(MJ, 'nep-hemodinamica') } },
          { momento: '20:00 · el giro', datos: { PA: '67/54 (PAM 61)', FC: '117', PVC: '9 mmHg', IC: '1,3 L/min/m²', Eco: 'VD más dilatado' }, nuevo: ['PA', 'FC', 'PVC', 'IC'],
            pregunta: { id: 'tep-k3', tipo: 'test', fuente: 'nep-alto-riesgo · nep-trombolisis · nep-trombectomia', modeloVivo: vv('tep-lisis', '🩹 Marca «Cirugía <3 sem»: la lisis se apaga'),
              origen: 'ficha; las cifras, del monitor de la app (gravedad 95), ilustrativas',
              enunciado: 'Ahora está inestable: alto riesgo. La lisis se recomienda en el alto riesgo, pero Consuelo se operó hace 5 días. ¿Qué haces?',
              opciones: [
                { t: 'No lisis, contraindicación absoluta (cirugía <3 semanas): trombectomía mecánica y noradrenalina', ok: true },
                { t: 'Alteplasa 100 mg en 2 h, porque está inestable y es lo que recomienda la guía para el alto riesgo con shock', porque: `Una cirugía en las 3 semanas previas es una contraindicación absoluta (${p(9)}); con ella puede producirse sangrado grave (10-12 % de sangrado mayor con lisis sistémica, ${p(9)}).` },
                { t: 'Alteplasa a dosis acelerada (0,6 mg/kg en 15 min), que es más segura', porque: `La dosis acelerada es para el colapso inminente y también tiene las mismas contraindicaciones (${p(9)}).` }],
              explicacion: `Alto riesgo con inestabilidad: la lisis se indica salvo contraindicaciones absolutas, entre ellas <span class="hl-rojo">cirugía mayor en las últimas 3 semanas</span>. El rescate es la <span class="hl-azul">trombectomía por catéter</span> (${p(9)}-${p(10)}); la hipotensión, con noradrenalina (${p(11)}).`,
              nota: `<b>La fuente no lo dice:</b> con qué cifra de PA se declara inestable; el modelo usa PAM <65 (regla del modelo). La sed de las cifras es del monitor, ilustrativa.` + enFicha(MJ, 'nep-trombolisis') } },
          { momento: '20:15 · heparina', datos: { Peso: '142 kg', Altura: '1,60 m', 'IMC': '55 kg/m²', 'Peso ideal': '52 kg' }, nuevo: ['Peso', 'IMC', 'Peso ideal'],
            pregunta: { id: 'tep-k4', tipo: 'test', fuente: 'nep-hnf · nep-obesidad', origen: 'ficha: Ec. 22.1 y la pauta; el peso ideal de 52 kg, dato del caso (la ficha remite a su tabla del apéndice 2); los productos, aritmética',
              enunciado: 'Heparina no fraccionada en el alto riesgo (80 U/kg en bolo y 18 U/kg/h). Con 142 kg e IMC de 55, ¿qué peso usas y qué dosis resultan?',
              opciones: [
                { t: 'Peso ajustado, 88 kg: bolo de 7.040 U y 1.584 U/h; PTT a las 6 h', ok: true },
                { t: 'Peso real, 142 kg: bolo de 11.360 U y 2.556 U/h', porque: `La pauta se derivó en pacientes de <130 kg y por encima sobreestima la dosis y favorece la anticoagulación excesiva (${p(9)}).` },
                { t: 'Peso ideal, 52 kg: bolo de 4.160 U y 936 U/h', porque: `La ficha recomienda el peso ajustado, casi a medio camino entre el ideal y el real, no el ideal (${p(9)}). Con ese cálculo quedaría infradosificada (${DED}).` }],
              explicacion: `IMC ≥40: <span class="hl-azul">peso ajustado = 52 + 0,4 × (142 − 52) = 88 kg</span> (Ec. 22.1). Bolo 80 × 88 = <span class="hl-azul">7.040 U</span>; infusión 18 × 88 = <span class="hl-azul">1.584 U/h</span>; PTT a las 6 h, objetivo 46-70 s (${p(7)}-${p(9)}).`,
              nota: `<b>La fuente no lo dice:</b> el peso ideal de Consuelo (52 kg): es un dato del caso; la ficha remite a su tabla de pesos ideales. Los dos productos son aritmética sobre la pauta.` + enFicha(MJ, 'nep-obesidad') } },
          { momento: '20:40 · el volumen', datos: { PA: '67/54', PVC: '9 mmHg', Idea: '500 mL para subir la PA' }, nuevo: ['Idea'],
            pregunta: { id: 'tep-k5', tipo: 'test', fuente: 'nep-hemodinamica', modeloVivo: sv('tep', '🫀 Consuelo: da +500 mL y mira el gasto y la PVC'),
              origen: 'ficha; las cifras del monitor de la app, ilustrativas',
              enunciado: 'Predice: tiene la PA baja y le pasas 500 mL de cristaloide. ¿Sube el gasto?',
              opciones: [
                { t: 'Casi no: el VD ya está dilatado y el volumen empuja el tabique contra el VI', ok: true },
                { t: 'Sí: más precarga, más volumen sistólico, más gasto y la PA sube en pocos minutos', porque: `El problema es la obstrucción: el volumen agresivo sobrecarga el VD y dificulta el llenado del VI (${p(10)}).` },
                { t: 'Cae a cero, por eso no se debe dar nunca volumen', porque: `Con PVC normal (4-6) se acepta, limitado a 500 mL y guiado por eco (${p(10)}); aquí la PVC ya es 9, por lo que no hay hipovolemia que corregir (${DED}).` }],
              explicacion: `Con el VD sobrecargado, <span class="hl-rojo">el volumen empuja el tabique hacia el VI</span> (${p(10)}).`,
              nota: `<b>En el monitor (ilustrativo):</b> de 67/54, FC 117, PVC 9 e IC 1,3 a 72/58, FC 112, PVC 12 e IC 1,4. La PVC sube tres puntos y el gasto casi nada. <b>Deducción; la fuente no lo dice:</b> que una PVC de 9 signifique que no hay hipovolemia que corregir; Marino solo liga el volumen a la PVC normal.` + enFicha(MJ, 'nep-hemodinamica') } },
          { momento: '02:00 · seis horas después', datos: { PTT: '58 s', Eco: 'el émbolo sigue en la arteria' }, nuevo: ['PTT', 'Eco'],
            pregunta: { id: 'tep-k6', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'nep-hemodinamica · nep-hnf', modeloVivo: vv('tep-lisis', '🩹 La heparina: el émbolo no encoge'), origen: 'ficha',
              enunciado: 'A las 6 h de heparina el PTT es 58 s, pero el émbolo sigue en la eco. El residente dice que ha fallado. ¿Qué le corriges?',
              puntos: [
                `<span class="hl-azul">La heparina no está para disolver el émbolo</span>, sino para prevenir el siguiente (${p(11)}).`,
                `El PTT de 58 s está en el <span class="hl-verde">objetivo de 46-70 s</span>: es la señal de que funciona (${p(8)}-${p(9)}).`],
              explicacion: `Que el émbolo siga ahí no es fallo: la meta de la anticoagulación es que no venga otro; si no mejora, la trombectomía (${p(8)}, ${p(11)}).` + enFicha(MJ, 'nep-alto-riesgo') } },
          { momento: '02:20 · las órdenes', datos: { Órdenes: 'cuatro, escritas por un residente' }, nuevo: ['Órdenes'],
            pregunta: { id: 'tep-k7', tipo: 'error', fuente: 'nep-trombolisis · nep-hnf · nep-filtro-indicaciones · nep-hemodinamica', origen: 'ficha',
              enunciado: 'Órdenes del residente para Consuelo. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'Alteplasa 100 mg en 2 h, que es lo indicado en el alto riesgo.', mal: true, c: `La cirugía de hace menos de 3 semanas es una contraindicación absoluta (${p(9)}).` },
                { t: 'PTT objetivo 46-70 s.' },
                { t: 'Filtro de cava ya, por si acaso.', mal: true, c: `Solo si hay contraindicación absoluta para anticoagular o la EP ocurre con anticoagulación terapéutica (${p(12)}); Consuelo está anticoagulada.` },
                { t: 'Noradrenalina para la hipotensión.' }],
              explicacion: 'Dos errores: lisis en una paciente operada hace 5 días y un filtro sin indicación.',
              nota: `La noradrenalina no sube la resistencia pulmonar (${p(11)}).` + enFicha(MJ, 'nep-filtro-indicaciones') } },
        ],
        lleva: [
          'La cirugía reciente (<3 semanas) prohíbe la lisis; el rescate es la trombectomía.' + enFicha(MJ, 'nep-trombolisis'),
          'La heparina no deshace el émbolo: protege del siguiente, y con IMC ≥40 se dosifica por peso ajustado.' + enFicha(MJ, 'nep-obesidad'),
          'Con el VD sobrecargado el volumen no sube el gasto; la hipotensión se trata con noradrenalina.' + enFicha(MJ, 'nep-hemodinamica')],
        volver: { nombre: 'El manejo hemodinámico', ancla: 'nep-hemodinamica', modelo: sv('tep', '🫀 Consuelo en el monitor') } },
    ],
  },
};
