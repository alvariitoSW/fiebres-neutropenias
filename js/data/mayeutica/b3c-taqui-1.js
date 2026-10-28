// Mayéutica del bloque 3, sub-bloque 3C · Taquiarritmias, parte 1 (Marino cap. 19, págs. 18-25): fichas 15 y 16 y el caso C2 (Teodoro).
// Datos puros; el formato está en la cabecera de b1-fluidos.js. La ficha es js/modules/cardiologia/merino-cardiologia.html.
// El modelo vivo es ritmoVivo: claves de estado sinusal, nodal, fa, fa:dilt, fa:amio, fa:digo, tam, tv, aberrancia (js/data/ritmo-vivo-data.js).
const PDF = 'docs/marino-2024-cardiac-disorders-caps18-21.pdf';
const pag = (n, txt) => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">${txt || `PDF pág. ${n}`}</a>`;
const p = n => pag(n, `pág. ${n}`);
// «Ver en la ficha» dentro de una nota (REGLAS §7.9): el enlace cruzado de siempre al párrafo exacto.
const enFicha = (tab, id) => ` <button type="button" class="may-ir" data-especialidad="cardiologia" data-view="merinoCardiologia" data-panel="panel-merino-cardio-tabs" data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const rv = (clave, texto) => ({ ritmoVivo: clave, texto });

export const MAYEUTICA_TAQUI_1 = {
  /* =================================================================================================
     Ficha 15 · Taquiarritmias: reconocimiento (cap. 19, págs. 18-21)
     ================================================================================================= */
  'mc-taqui-reconocimiento': {
    entrada: 'Tres hallazgos del ECG (ancho del QRS, regularidad y actividad auricular) bastan para poner nombre a casi todas las taquicardias, y dónde se equivocan los atajos.',
    guia: [
      { id: 'tqr-g1', corto: 'los 3 hallazgos', tipo: 'test', fuente: 'mc-taqui-hallazgos · mc-fig-19-1', modeloVivo: rv('sinusal', '⚡ El ritmo sinusal a 75 en el monitor'),
        enunciado: 'Llega un paciente a 150 lpm. Antes de buscar un nombre: ¿en qué tres hallazgos del ECG se apoya Marino, y en qué orden los miras?',
        opciones: [
          { t: 'Frecuencia, eje y PR: lo primero que se anota al leer cualquier ECG', porque: `Son datos del ECG, pero no los que encadena el flujograma (Fig. 19.1, ${p(19)}): con la frecuencia, el eje y el PR no separas estrecho de ancho ni regular de irregular, y no llegas a un nombre.` },
          { t: 'Duración del QRS, uniformidad del R-R y actividad auricular', ok: true },
          { t: 'Eje, segmento ST y QT: lo que se mira en un ECG de isquemia', porque: `Son hallazgos de otro ECG. El flujograma (Fig. 19.1, ${p(19)}) parte del ancho del QRS; si empiezas por el ST, no llegas a separar una TV de una SVT.` }],
        explicacion: `Los tres hallazgos (${p(18)}): <span class="hl">duración del QRS</span> (estrecho ≤0,12 s, ancho >0,12), <span class="hl">uniformidad de los intervalos R-R</span> y <span class="hl">actividad auricular</span> (P uniformes, ausentes, en «diente de sierra» o de fibrilación). El flujograma de la Figura 19.1 (${p(19)}) los encadena en ese orden.` },
      { id: 'tqr-g2', corto: 'regular y sin P', tipo: 'test', fuente: 'mc-qrs-estrecho-regular · mc-fig-19-2', modelo: rv('nodal', '⚡ Compruébalo: la taquicardia nodal a 167'),
        enunciado: 'Predice, y luego lo compruebas: un QRS estrecho (0,07 s) y regular a 167 lpm. ¿Dónde está la onda P?',
        opciones: [
          { t: 'Delante de cada QRS, igual que en el sinusal', porque: `Con P uniformes y PR uniforme sería una taquicardia sinusal (${p(19)}): habría que buscar la causa (fiebre, dolor, hipovolemia). Aquí no hay P que lo diga.` },
          { t: 'No se ve: es una reentrada en el nodo AV', ok: true },
          { t: 'En «dientes de sierra» entre los QRS', porque: `Esas ondas son el flúter auricular (${p(19)}). Si lo confundes, esperas una frecuencia auricular altísima y una conducción fija que aquí no figuran.` }],
        explicacion: `QRS estrecho y regular sin P visibles: <span class="hl">taquicardia por reentrada del nodo AV</span> (AVNRT), también llamada «SVT paroxística» por su inicio abrupto (Fig. 19.2, ${p(20)}). Con P uniformes sería sinusal; con «dientes de sierra», flúter.` },
      { id: 'tqr-g3', corto: 'FA o TAM', tipo: 'test', fuente: 'mc-qrs-estrecho-irregular · mc-fig-19-3', modelo: [rv('fa', '⚡ La FA a 142'), rv('tam', '⚡ La TAM a 120')],
        enunciado: 'Dos pacientes con QRS estrecho e irregular: uno a 142 (FA) y otro a 120 (taquicardia auricular multifocal). Predice: ¿qué los separa en el ECG?',
        opciones: [
          { t: 'La FA tiene el QRS ancho y la TAM lo tiene estrecho', porque: `Los dos son de QRS estrecho (${p(20)}). Si buscas el ancho para separarlos, acabarás tratando como ventricular un ritmo que no lo es.` },
          { t: 'Que la TAM es regular y la FA irregular', porque: `Los dos son irregulares; esa es la premisa. Si esperas regularidad en la TAM, la descartas y tratas la FA sin ver el pulmón que la provoca.` },
          { t: 'La actividad auricular: P de varias formas (TAM) o ninguna (FA)', ok: true }],
        explicacion: `Mismo QRS y mismo R-R irregular: los separa la <span class="hl">actividad auricular</span>. TAM: <span class="hl-azul">múltiples morfologías de P y PR variable</span>. FA: <span class="hl-rojo">sin ondas P</span>, con ondas de fibrilación desorganizadas (Fig. 19.3, ${p(20)}).` },
      { id: 'tqr-g4', corto: 'aberrancia o TV', tipo: 'test', fuente: 'mc-qrs-ancho · mc-tv-vs-svt', modelo: [rv('aberrancia', '⚡ La SVT con aberrancia (QRS 0,14)'), rv('tv', '⚡ La TV (QRS 0,15)')],
        enunciado: 'Dos taquicardias de QRS ancho, regulares y casi iguales: 167 lpm con QRS 0,14 s (aberrancia) y 170 lpm con QRS 0,15 s (TV). Predice: si no hay forma de distinguirlas en el ECG, ¿qué decide?',
        opciones: [
          { t: 'La cardiopatía: con ella, tratar como TV (95 %)', ok: true },
          { t: 'Que el paciente esté estable: si tolera, es supraventricular', porque: `La ficha no usa la tolerancia como criterio: usa la disociación AV, los latidos de fusión y la cardiopatía (${p(31)}-32). Con ese atajo tratarías como benigna una TV.` },
          { t: 'Que sea irregular: lo irregular es siempre ventricular', porque: `Es al revés: un ritmo irregular es evidencia de SVT con conducción aberrante, porque la TV nunca es irregular (${p(21)} y ${p(36)}). Te llevaría a dar amiodarona a una FA.` }],
        explicacion: `Dos claves del ECG identifican la TV: <span class="hl-rojo">disociación AV</span> (en el modelo, las P corren por su cuenta) y <span class="hl-rojo">latidos de fusión</span>. Sin ellas, <span class="hl">la TV causa el 95 % de las taquicardias de QRS ancho con cardiopatía conocida</span>: se trata como TV probable (${p(31)}-32). Irregular ancho = SVT aberrante (${p(21)}).` },
      { id: 'tqr-g5', corto: 'la madeja', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mc-madeja',
        enunciado: 'Marino cierra con «cómo desenredar la madeja». Dos reglas de regularidad tienen trampa: la FA rápida puede parecer regular. ¿En qué dos situaciones te engaña?',
        puntos: [
          `Con <span class="hl">QRS estrecho</span> y ritmo muy irregular es casi siempre FA, pero la <span class="hl-rojo">FA rápida puede parecer regular</span>.`,
          `Con <span class="hl">QRS ancho</span> y ritmo regular es probablemente TV, pero la FA rápida con conducción prolongada también puede parecerlo.`],
        explicacion: `La FA es, con diferencia, la arritmia más frecuente en la UCI: enfoca tu atención ahí (${p(36)}). La regularidad orienta, no cierra el diagnóstico.` },
    ],
    examen: [
      { id: 'tqr-e1', corto: 'el límite del QRS', tipo: 'test', fuente: 'mc-taqui-hallazgos · mc-fig-19-1',
        enunciado: 'Una taquicardia regular con QRS de 0,12 s. ¿Estrecho o ancho?',
        opciones: [
          { t: 'Ancho: 0,12 ya entra en el rango de la TV', porque: `El límite es ≤0,12 s para estrecho y >0,12 s para ancho (${p(18)}). Etiquetarla de ancha te llevaría a pensar en TV y a descartar sin motivo la reentrada del nodo AV.` },
          { t: 'Estrecho: ≤0,12 s es el límite superior', ok: true },
          { t: 'Depende de si hay ondas P: sin P es ancho', porque: `El ancho se mide en el QRS, no en la P (${p(19)}). La P entra en el tercer hallazgo, la actividad auricular.` }],
        explicacion: `Estrecho es <span class="hl">≤0,12 s</span> (origen supraventricular); ancho, <span class="hl-rojo">>0,12 s</span> (ventricular o SVT con conducción prolongada).` },
      { id: 'tqr-e2', corto: 'sin P = FA', tipo: 'test', fuente: 'mc-qrs-estrecho-regular · mc-qrs-estrecho-irregular',
        enunciado: 'Un residente anota: «taquicardia de QRS estrecho sin ondas P visibles: FA». El trazado es perfectamente regular a 167 lpm. ¿Qué es?',
        opciones: [
          { t: 'FA: la ausencia de ondas P visibles es lo característico', porque: `La FA tiene sin P pero es irregular (${p(20)}). Si la regularidad no te frena, tratarías con control de frecuencia una reentrada nodal que responde a otras medidas.` },
          { t: 'Reentrada del nodo AV: sin P y regular', ok: true },
          { t: 'Flúter: las P se esconden en el QRS', porque: `El flúter se reconoce por sus ondas en «diente de sierra» (${p(19)}), no por esconderlas.` }],
        explicacion: `Sin P y <span class="hl">regular</span> = AVNRT (${p(19)}); sin P e <span class="hl-rojo">irregular</span> = FA (${p(20)}). La regularidad separa las dos.` },
      { id: 'tqr-e3', corto: 'ancho e irregular', tipo: 'test', fuente: 'mc-qrs-ancho · mc-madeja', modelo: rv('aberrancia', '⚡ La SVT con aberrancia'),
        enunciado: 'Una taquicardia de QRS ancho e irregular, con cardiopatía conocida. Un compañero dice: «la TV nunca es irregular, así que esto no puede ser una FA». ¿Qué respondes?',
        opciones: [
          { t: 'Tiene razón: si es ancha y hay cardiopatía, es TV', porque: `Confunde la frase: la TV nunca es irregular, de modo que lo irregular no es TV (${p(21)} y ${p(36)}). Con ese razonamiento administrarías antiarrítmicos ventriculares a una FA.` },
          { t: 'Irregular: FA o TAM con conducción aberrante', ok: true },
          { t: 'Que una torsade es irregular y por eso es lo más probable', porque: `La torsade se sospecha con amplitud creciente y decreciente (${p(36)}), no por ser irregular en general. Y su manejo es otro.` }],
        explicacion: `QRS ancho e <span class="hl">irregular</span>: probablemente FA o TAM con conducción AV prolongada (la TV nunca es irregular); regular: probablemente TV (${p(36)}).` },
      { id: 'tqr-e4', corto: 'la sinusal', tipo: 'test', fuente: 'mc-taqui-hallazgos · mc-qrs-estrecho-regular',
        enunciado: 'Una taquicardia de 120 lpm con P uniformes, PR uniforme y QRS estrecho en un paciente con fiebre. ¿Qué haces primero?',
        opciones: [
          { t: 'Diltiazem 0,25 mg/kg para frenarla', porque: `Es una taquicardia sinusal: la ficha avisa de que la taquicardia en sí puede no ser el problema (${p(18)}). Frenarla sin tratar la fiebre o la hipovolemia quita la compensación del paciente.` },
          { t: 'Cardioversión sincronizada de 100 J', porque: `La cardioversión se reserva a la FA inestable (${p(25)}); un ritmo sinusal no tiene nada que revertir.` },
          { t: 'Buscar y tratar la causa de la fiebre', ok: true }],
        explicacion: `P uniformes con PR uniforme: <span class="hl">taquicardia sinusal</span> (${p(18)}). La taquicardia en sí puede no ser el problema; se trata la causa.` },
      { id: 'tqr-e5', corto: 'los apuntes', tipo: 'error', fuente: 'mc-taqui-hallazgos · mc-qrs-estrecho-regular · mc-qrs-estrecho-irregular · mc-qrs-ancho',
        enunciado: 'Apuntes de un compañero sobre cómo reconocer una taquicardia. Encuentra los errores.',
        frases: [
          { t: 'QRS estrecho: ≤0,12 s.' },
          { t: 'Regular, QRS estrecho y sin P visibles: probable reentrada del nodo AV.' },
          { t: 'Irregular, QRS estrecho y sin P: FA, y la TV nunca es irregular.' },
          { t: 'Ancho e irregular: TV, porque la TV es irregular por naturaleza.', mal: true, c: `La <span class="hl-rojo">TV nunca es irregular</span>: un ancho irregular es SVT con conducción aberrante (FA o TAM) (${p(21)} y ${p(36)}).` },
          { t: 'Sin P y regular: FA, que a veces es regular.', mal: true, c: `Sin P y regular es reentrada del nodo AV; la FA es <span class="hl">irregular</span> (${p(20)}). Solo la FA muy rápida puede parecer regular (${p(35)}).` }],
        explicacion: 'Dos errores: invertir la regla de la TV y llamar FA a lo regular sin P.' },
    ],
    casos: [
      { id: 'c2r', titulo: 'Celia, 79 años: la taquicardia de la fiebre', corto: 'Caso · Celia (fiebre)', sub: 'sinusal que se explica y un salto a 167',
        paciente: { Edad: '79 años, mujer', Peso: '62 kg', Antecedentes: 'HTA e insuficiencia cardíaca con FEVI conservada; creatinina 1,9', Motivo: 'Infección urinaria con fiebre' },
        pasos: [
          { momento: 'Día 1 · 15:00', datos: { ECG: 'FC 124, QRS 0,08 s, regular, P uniformes con PR uniforme', Constantes: 'T 38,9 °C · PA 118/68' }, nuevo: ['ECG', 'Constantes'],
            pregunta: { id: 'c2r-1', tipo: 'test', fuente: 'mc-taqui-hallazgos · mc-qrs-estrecho-regular', modelo: rv('sinusal', '⚡ El ritmo sinusal en el monitor'),
              enunciado: 'Celia tiene 38,9 °C y el monitor marca 124. ¿Qué ritmo es y qué haces?',
              opciones: [
                { t: 'Taquicardia sinusal: trato la causa, no la frecuencia', ok: true },
                { t: 'Reentrada nodal: maniobras vagales y adenosina', porque: `La reentrada nodal no tiene P visibles y empieza de golpe (${pag(19, 'pág. 19')}); aquí hay P uniformes con PR uniforme, que son de la taquicardia sinusal (${p(18)}). Darle adenosina a una sinusal no corta nada y expone a Celia a un bloqueo AV transitorio.` },
                { t: 'FA rápida: diltiazem 0,25 mg/kg para frenarla', porque: `La FA es irregular y sin P (${p(20)}); este ritmo es regular y con P. Un depresor del nodo en una hipertensa con insuficiencia cardíaca y fiebre le quita la compensación (${p(18)}) y baja la presión (${p(22)}).` }],
              explicacion: `P uniformes y PR uniforme: <span class="hl">taquicardia sinusal</span>. La taquicardia en sí puede no ser el problema: se busca y se trata la causa, aquí la infección (${p(18)}).` } },
          { momento: 'Día 1 · 21:00', datos: { Constantes: 'T 37,2 °C tras antitérmico y suero · PA 124/70', ECG: 'FC 102, sinusal' }, nuevo: ['Constantes', 'ECG'],
            pregunta: { id: 'c2r-2', tipo: 'test', fuente: 'mc-taqui-hallazgos', origen: 'ilustrativo (evolución de la fiebre); la regla es de la ficha',
              enunciado: 'Con la fiebre controlada, la frecuencia ha bajado de 124 a 102. ¿Qué te dice?',
              opciones: [
                { t: 'Que la sinusal seguía a su causa: al tratarla, baja poco a poco', ok: true },
                { t: 'Que es un buen momento para añadir un betabloqueante y llegar a 80', porque: `La ficha ordena tratar la causa, no el número (${p(18)}). Frenar una sinusal que ya cede solo suma un depresor del nodo en una hipertensa con insuficiencia cardíaca.` },
                { t: 'Que era otra arritmia que ha cedido sola', porque: `Una taquicardia sinusal acompaña a su causa y baja con ella; una reentrada no baja despacio, se corta de golpe (${p(19)}). Pensar en una arritmia que «cedió» te haría buscar donde no hay nada.` }],
              explicacion: `La sinusal <span class="hl">sigue a su causa</span>: baja cuando baja la fiebre. No hay nada que frenar con un fármaco (${p(18)}).` } },
          { momento: 'Día 2 · 03:10', datos: { ECG: 'salto brusco a FC 167, QRS 0,07 s, regular, sin ondas P visibles', Constantes: 'T 37,1 °C · PA 108/62' }, nuevo: ['ECG', 'Constantes'],
            pregunta: { id: 'c2r-3', tipo: 'test', fuente: 'mc-qrs-estrecho-regular · mc-psvt · mc-fig-19-2', modelo: rv('nodal', '⚡ Compruébalo: la taquicardia nodal a 167'),
              enunciado: 'A las 03:10 la frecuencia pasa de golpe de 100 a 167, regular, sin P y con QRS estrecho. No hay fiebre. ¿Qué es?',
              opciones: [
                { t: 'Otra vez la sinusal: la fiebre ha vuelto a subir', porque: `Una sinusal sube y baja poco a poco con su causa, con P delante de cada QRS (${p(18)}); un inicio abrupto sin P y sin fiebre no lo es. Seguir con antitérmicos retrasa el tratamiento de una reentrada.` },
                { t: 'FA: es rápida y no se ven las P', porque: `La FA es irregular (${p(20)}); el trazado es regular. Frenarla como FA con diltiazem le añadiría hipotensión a Celia sin cortar nada.` },
                { t: 'Reentrada del nodo AV: regular, sin P', ok: true }],
              explicacion: `QRS estrecho, regular, sin P y de <span class="hl">inicio abrupto</span>: reentrada del nodo AV (AVNRT), la más frecuente de las PSVT y más habitual en mujeres (${pag(28, 'pág. 28-29')}). Con P uniformes habría sido sinusal (${p(19)}).` } },
          { momento: 'Día 2 · 03:15', datos: { Plan: 'está estable; lo primero, sin fármacos' }, nuevo: ['Plan'],
            pregunta: { id: 'c2r-4', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mc-psvt',
              enunciado: 'Antes de la adenosina, el adjunto pide una maniobra vagal. Tu respuesta tiene dos partes: ¿cuál das y cuál evitas con Celia?',
              puntos: [
                `La <span class="hl-verde">Valsalva modificada</span> (con las piernas elevadas tras la maniobra): corta un <span class="hl">44 %</span>, frente al 24 % de la convencional.`,
                `El <span class="hl-rojo">masaje del seno carotídeo</span> es el peor (9 %) y exige descartar soplos carotídeos antes: no es la primera opción.`],
              explicacion: `Éxito limitado de todas (${pag(28, 'pág. 28-29')}). Si fallan, la adenosina, fármaco de elección (${pag(29, 'pág. 29-30')}).` } },
          { momento: 'Día 2 · 03:30', datos: { Maniobra: 'la Valsalva modificada no cambia nada', Acceso: 'la vía periférica se ha perdido; solo hay un catéter central yugular', Constantes: 'PA 104/60, FC 167' }, nuevo: ['Maniobra', 'Acceso', 'Constantes'],
            pregunta: { id: 'c2r-5', tipo: 'test', fuente: 'mc-adenosina · mc-tabla-19-4', modelo: rv('nodal', '⚡ La adenosina en la reentrada nodal'),
              enunciado: 'Es el giro: la adenosina solo puede ir por el catéter central. ¿Qué dosis de entrada y cómo?',
              opciones: [
                { t: '6 mg en bolo rápido con lavado, igual que por vena periférica', porque: `Se ha descrito asistolia ventricular con la dosis estándar por vía central (${p(30)}). Dar la dosis de siempre ahí arriesga una pausa larga en una mujer de 79 años.` },
                { t: 'La mitad: 3 mg en bolo rápido con lavado', ok: true },
                { t: 'Mejor esperar a canalizar una vena periférica antes de dar nada', porque: `La ficha no pide esperar: ordena reducir un 50 % cuando el acceso es central (${p(30)}). Mientras tanto, Celia sigue a 167 con 104/60.` }],
              explicacion: `Adenosina: 6 mg en bolo rápido y lavado; si a los 2 min no responde, 12 mg. <span class="hl-rojo">Reducir un 50 % por vena cava superior</span> (${p(30)}): 3 mg de entrada, y el efecto dura solo 1-2 min.` ,
              nota: `<b>La fuente no lo dice así.</b> Marino manda reducir un 50 % sin dar una tabla para el catéter central; que la primera dosis sean 3 mg y que se suba si no responde es la aplicación de ese 50 % a los 6 mg de la pauta (${p(30)}).` } },
          { momento: 'Día 2 · 03:40', datos: { Resultado: 'revierte a sinusal 88 en el bolo; rubor facial y opresión transitoria', 'Nota del R1': 'resumen de la noche' }, nuevo: ['Resultado', 'Nota del R1'],
            pregunta: { id: 'c2r-6', tipo: 'error', fuente: 'mc-adenosina · mc-tabla-19-4 · mc-qrs-estrecho-regular',
              enunciado: 'La nota del R1 sobre lo ocurrido. Encuentra los errores.',
              frases: [
                { t: 'Por la tarde era una sinusal por la fiebre: traté la causa, no la frecuencia.' },
                { t: 'A las 03:10 diltiazem 0,25 mg/kg, porque cualquier taquicardia de QRS estrecho se frena con él.', mal: true, c: `En la reentrada nodal el tratamiento es la <span class="hl">maniobra vagal y, si falla, la adenosina</span>; el diltiazem es una alternativa solo si la adenosina falla (${pag(29, 'pág. 29-30')}).` },
                { t: 'Adenosina en bolo rápido con lavado; su efecto dura 1-2 min.' },
                { t: 'El rubor y la opresión son efectos adversos frecuentes de la adenosina (rubor 20 %, opresión 7 %).' },
                { t: 'Por el catéter central di la dosis estándar, porque la vía no cambia nada.', mal: true, c: `Por vena cava superior se <span class="hl-rojo">reduce un 50 %</span>: con la dosis estándar por vía central se ha descrito asistolia ventricular (${p(30)}).` }],
              explicacion: 'Dos errores: frenar con diltiazem una reentrada nodal y no reducir la adenosina por vía central.' } },
        ],
        lleva: [
          'Una taquicardia sinusal sigue a su causa: se trata la fiebre, no la frecuencia; si salta de golpe y no hay P, ya no es sinusal.',
          'En la reentrada nodal, primero la Valsalva modificada (44 %) y después la adenosina, 6 mg y 12 mg en bolo rápido con lavado.',
          'Por vena cava superior la adenosina se reduce un 50 %: se ha descrito asistolia con la dosis estándar.'],
        volver: { nombre: 'QRS estrecho y regular', ancla: 'mc-qrs-estrecho-regular', modelo: rv('nodal', '⚡ La reentrada nodal con adenosina') } },
    ],
    profundizar: [
      { id: 'mc-fig-19-1', titulo: 'Figura 19.1 — El flujograma completo de evaluación' },
    ],
  },

  /* =================================================================================================
     Ficha 16 · Fibrilación auricular: control de frecuencia (cap. 19, págs. 21-25)
     ================================================================================================= */
  'mc-fa-frecuencia': {
    entrada: 'Qué le hace la FA al llenado del corazón, cómo se ve en el pulso, cuál de tres fármacos baja antes la frecuencia, de dónde sale la hipotensión de uno y cuándo parar.',
    guia: [
      { id: 'faf-g1', corto: 'el llenado', tipo: 'test', fuente: 'mc-fa-consecuencias', modelo: rv('fa', '⚡ La FA a 142 (pulsa «Llenado malo»)'),
        enunciado: 'En la FA la aurícula deja de contraerse. Antes de leerlo: ¿qué parte del llenado del ventrículo pone la contracción auricular, y a quién le hace falta de verdad?',
        opciones: [
          { t: 'Hasta la mitad del llenado: a todos los pacientes con FA les cae el gasto', porque: `La contribución es menor (~25 %) y, en general, perderla tiene poco efecto notable (${p(21)}-22). Esperar un colapso en todos te hace dar vasoactivos a quien solo necesita control de frecuencia.` },
          { t: 'Un 25 %: pesa si el llenado ya está comprometido', ok: true },
          { t: 'Casi nada: nunca importa, solo la frecuencia', porque: `La ficha dice que importa cuando el llenado diastólico ya está comprometido (estenosis mitral, ventrículo poco distensible), y que una FC rápida reduce aún más el volumen sistólico (${p(21)}-22).` }],
        explicacion: `La contracción auricular aporta <span class="hl">~25 % del volumen telediastólico</span>. Perderla tiene poco efecto, salvo con el <span class="hl-rojo">llenado ya comprometido</span> (estenosis mitral, menor distensibilidad ventricular): ahí, una FC rápida baja el volumen sistólico por menor tiempo de llenado (${p(21)}-22).` },
      { id: 'faf-g2', corto: 'el latido corto', tipo: 'test', fuente: 'mc-fa-consecuencias · mc-fig-19-4', modelo: rv('fa', '⚡ Compruébalo: la FA a 142 con pulso a 104'),
        enunciado: 'Predice, y luego lo compruebas en la presión arterial del monitor: tras un latido que llega muy pegado al anterior, ¿qué le pasa a la presión sistólica?',
        opciones: [
          { t: 'Cae: hubo poco tiempo de llenado y salió menos sangre', ok: true },
          { t: 'Sube: el corazón late antes y eyecta más rápido', porque: `Al revés: el espaciado estrecho acorta el llenado y baja la sistólica (Fig. 19.4, ${p(22)}). Esperar una subida te haría ignorar el pulso que no llega.` },
          { t: 'Igual: la presión depende solo de las resistencias', porque: `Si el volumen sistólico baja, la presión baja (${p(22)}); de ahí nace el déficit de pulso. Con ese atajo no usarías el monitor para saber si el control es suficiente.` }],
        explicacion: `Un espaciado estrecho entre dos latidos acorta el llenado y <span class="hl-rojo">baja la presión sistólica</span> (volumen sistólico) (Fig. 19.4, ${p(22)}). Puede producir un <span class="hl">déficit de pulso</span>: el pulso periférico por debajo del apical. En el modelo, a FC 142 el pulso es 104 (déficit 38): <b>cifras ilustrativas del modelo</b>, no de la Figura 19.4, que no da cifras.` },
      { id: 'faf-g3', corto: 'quién baja antes', tipo: 'test', fuente: 'mc-fig-19-5 · mc-tabla-19-1', origen: 'ficha (Fig. 19.5, lectura del gráfico)',
        modelo: [rv('fa:dilt', '⚡ Diltiazem: 122 a la hora 1'), rv('fa:amio', '⚡ Amiodarona: 125 a la hora 1'), rv('fa:digo', '⚡ Digoxina: 136 a la hora 1')],
        enunciado: 'Una FA a 140 lpm. Predice: de diltiazem, amiodarona y digoxina, ¿cuál baja la frecuencia por debajo de 100 antes?',
        opciones: [
          { t: 'Digoxina: es el fármaco clásico de la FA', porque: `Su efecto se desarrolla despacio: poco efecto en la primera hora y a las 6 h sigue sin bajar de 100 (${p(24)}-25). Por eso no se usa sola en el control agudo.` },
          { t: 'Amiodarona: baja la frecuencia y además cardiovierte', porque: `Puede convertir a sinusal, pero en la figura no cruza 100 en las primeras horas (${p(24)}). Es una alternativa si hay resistencia o intolerancia a diltiazem o betabloqueantes (${p(24)}).` },
          { t: 'Diltiazem: cruza 100 lpm hacia las 2 horas', ok: true }],
        explicacion: `Diltiazem baja más rápido que amiodarona o digoxina en las primeras horas (Fig. 19.5, ${p(24)}): 139 → <span class="hl-verde">122</span> (h 1) → <span class="hl-verde">103</span> (h 2) → 87 (h 6). Amiodarona: 136 → 125 → 101. Digoxina: 138 → 136 → 108.`,
        nota: `<b>Lectura del gráfico.</b> El texto (${p(25)}) solo confirma que la digoxina no alcanza el objetivo a las 6 h; que la amiodarona tampoco cruce 100 de forma sostenida es una lectura de la Figura 19.5. Las cifras del modelo son esa lectura.` + enFicha('mc-fa-frecuencia', 'mc-fig-19-5') },
      { id: 'faf-g4', corto: 'la hipotensión', tipo: 'test', fuente: 'mc-amiodarona-iv · mc-tabla-19-1',
        enunciado: 'La amiodarona IV da bastante menos hipotensión que el diltiazem. ¿De dónde viene la que produce?',
        opciones: [
          { t: 'De su efecto inotrópico negativo, igual que el diltiazem', porque: `Ese es el mecanismo del diltiazem (Tabla 19.1, ${p(22)}). Para la amiodarona la ficha lo atribuye a otra cosa, y creer que es el mismo te hace sumar dos fármacos que se potencian.` },
          { t: 'Del disolvente de la formulación, el polisorbato 80', ok: true },
          { t: 'De la fibrosis pulmonar y la disfunción tiroidea', porque: `Son efectos del tratamiento largo, y la vía IV no los tiene (${p(24)}). Nada que ver con la tensión.` }],
        explicacion: `La hipotensión es posible pero <span class="hl">mucho menor que con diltiazem</span> y se atribuye al disolvente, el <span class="hl-azul">polisorbato 80</span>; la formulación acuosa no la produce (${p(24)}).` },
      { id: 'faf-g5', corto: 'el punto final', tipo: 'test', fuente: 'mc-fa-punto-final · mc-fig-19-4',
        enunciado: 'Frenas una FA y llegas a 105 lpm. ¿Cuál es el punto final del control de frecuencia que propone Marino?',
        opciones: [
          { t: 'Una FC fija de 80 lpm, como pide el consenso', porque: `No hay consenso: los estudios usaron objetivos de 80 a 110 lpm (${p(25)}). Perseguir 80 puede acabar en un bolo extra de fármaco hipotensor sin necesidad.` },
          { t: 'Que desaparezca el déficit de pulso entre latidos', ok: true },
          { t: 'Cualquier FC <110, porque es lo que usaron los estudios', porque: `Es una cifra de estudios, no el objetivo fisiológico que propone la ficha (${p(25)}). Un paciente a 105 puede seguir con déficit de pulso.` }],
        explicacion: `Hay una <span class="hl-rojo">falta de acuerdo</span> en la FC objetivo (80-110 en los estudios). La eliminación del <span class="hl">déficit de pulso</span> o de la presión sistólica variable (Fig. 19.4) es un objetivo más fisiológico, aunque se pasa por alto (${p(25)}).` },
      { id: 'faf-g6', corto: 'las interacciones', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mc-amiodarona-iv',
        enunciado: 'La amiodarona se metaboliza por el citocromo P450 del hígado. En la UCI, ¿con qué dos fármacos importa su interacción, y qué hace?',
        puntos: [
          `Inhibe el metabolismo de la <span class="hl-rojo">digoxina</span>: su nivel puede subir.`,
          `Inhibe el metabolismo de la <span class="hl-rojo">warfarina</span>: su efecto anticoagulante puede aumentar.`],
        explicacion: `La ficha cita esas dos (${p(25)}). Es la razón de revisar el INR y los niveles de digoxina si se asocia amiodarona.`,
        nota: `<b>La fuente no lo dice.</b> El libro solo afirma que la amiodarona inhibe el metabolismo de digoxina y warfarina; revisar el INR y los niveles es una deducción de esa interacción.` },
    ],
    examen: [
      { id: 'faf-e1', corto: 'dosis de diltiazem', tipo: 'test', fuente: 'mc-tabla-19-1', origen: 'ilustrativo: 0,25 × 78 kg = 19,5 mg',
        enunciado: 'Teodoro pesa 78 kg y tiene FA a 148. Según la Tabla 19.1, ¿cuál es la dosis inicial de diltiazem IV?',
        opciones: [
          { t: 'Unos 20 mg en 2 minutos (0,25 mg/kg), y después 5-15 mg/h', ok: true },
          { t: '78 mg en 2 minutos: 1 mg/kg', porque: `La dosis es 0,25 mg/kg (${p(22)}). Cuatro veces esa cifra es una sobredosis de un fármaco limitado ya por hipotensión del 20-30 %.` },
          { t: '5-15 mg de bolo y después 0,25 mg/kg/h', porque: `Mezcla los dos tiempos: el bolo es 0,25 mg/kg en 2 min y los 5-15 mg/h van en la infusión (${p(22)}).` }],
        explicacion: `Tabla 19.1: <span class="hl">0,25 mg/kg IV en 2 min</span>, luego 5-15 mg/h. Para 78 kg: 0,25 × 78 = 19,5 ≈ <span class="hl-verde">20 mg</span>. Eficaz en 1 h en el 55 %; limitado por hipotensión (20-30 %) y efecto inotrópico negativo (${p(22)}-23).` },
      { id: 'faf-e2', corto: 'pauta de amiodarona', tipo: 'test', fuente: 'mc-tabla-19-1',
        enunciado: '¿Qué pauta de amiodarona IV da la Tabla 19.1?',
        opciones: [
          { t: '150 mg en 10 min (repetible), 1 mg/min ×6 h y 0,5 mg/min ×18 h; máximo 2,2 g/24 h', ok: true },
          { t: '150 mg en 10 min, 0,5 mg/min ×6 h y 1 mg/min ×18 h', porque: `Invierte las velocidades: la rápida va primero (${p(23)}). El total quedaría muy por encima de lo previsto.` },
          { t: '300 mg en bolo único y 1 mg/min durante 24 h', porque: `La carga es de 150 mg en 10 min (repetible), no 300; y la infusión baja a 0,5 mg/min tras 6 h (${p(23)}).` }],
        explicacion: `Tabla 19.1: 150 mg IV en 10 min (repetible), luego <span class="hl">1 mg/min ×6 h</span> y <span class="hl">0,5 mg/min ×18 h</span>; máximo <span class="hl-rojo">2,2 g/24 h</span> (${p(23)}).` },
      { id: 'faf-e3', corto: 'esmolol', tipo: 'test', fuente: 'mc-tabla-19-1 · mc-fig-19-5',
        enunciado: 'Entre esmolol y metoprolol IV, Marino prefiere el esmolol para el control agudo de la FA. ¿Por qué?',
        opciones: [
          { t: 'Porque su semivida es de 9 min y se titula con rapidez', ok: true },
          { t: 'Porque controla a más pacientes que ningún otro: el 90 %', porque: `El 90 % es el diltiazem mantenido con la infusión; los betabloqueantes logran control en el 70 % (${p(23)}-24). Elegirlo por una cifra ajena te hace subestimar su hipotensión.` },
          { t: 'Porque no da hipotensión ni efecto inotrópico negativo', porque: `La Tabla 19.1 da al metoprolol un riesgo similar al del diltiazem, y los betabloqueantes comparten ese efecto (${p(23)}). El esmolol gana por su duración, no por ser inocuo.` }],
        explicacion: `Esmolol: 500 µg/kg en bolo, luego 50 µg/kg/min, +25 µg/kg/min cada 5 min hasta 200. Es un betabloqueante ultracorto, <span class="hl">semivida 9 min</span>, que permite titulación rápida y reversible (${p(23)}-24).` },
      { id: 'faf-e4', corto: 'la digoxina', tipo: 'test', fuente: 'mc-tabla-19-1 · mc-fig-19-5',
        enunciado: 'Un residente propone digoxina IV como único fármaco para bajar una FA a 140 en urgencias. ¿Qué dice Marino?',
        opciones: [
          { t: 'Que sí: es el fármaco clásico y empieza a actuar enseguida', porque: `Es de acción lenta: poco efecto en la primera hora y sin llegar a 100 a las 6 h (${p(24)}-25). Con ella sola, el paciente seguiría rápido durante horas.` },
          { t: 'Que no se use sola en el control agudo: es lenta', ok: true },
          { t: 'Que 1,5 mg en un solo bolo la hace actuar antes', porque: `La pauta es 0,25 mg IV cada 2 h hasta un total de 1,5 mg (${p(23)}). Un bolo único no está en la ficha.` }],
        explicacion: `Digoxina: 0,25 mg IV cada 2 h hasta 1,5 mg, luego 0,125-0,375 mg/día. <span class="hl-rojo">No debe usarse sola</span> para el control agudo; se usa a largo plazo en HFrEF (${p(22)}-25).` },
      { id: 'faf-e5', corto: 'riesgo de ictus', tipo: 'test', fuente: 'mc-fa-consecuencias',
        enunciado: '¿Cuánto aumenta la FA el riesgo de ictus, y en qué caso no se aplica?',
        opciones: [
          { t: 'Cinco veces, salvo el primer episodio de <48 h', ok: true },
          { t: 'Dos veces, y solo en la FA permanente', porque: `El riesgo se multiplica por 5 y se aplica a todos los tipos de FA (${p(22)}). Limitarlo a la permanente te hace olvidar anticoagular a las paroxísticas.` },
          { t: 'Cinco veces, y siempre, incluso en el primer episodio de <48 h', porque: `La excepción son los primeros episodios de menos de 48 h (${p(22)}). Sin ella, anticoagularías a cualquiera desde el primer minuto.` }],
        explicacion: `La FA multiplica por <span class="hl-rojo">5</span> el riesgo de ictus, en todos los tipos <span class="hl">excepto los primeros episodios de <48 h</span> (${p(22)}). El trombo se forma sobre todo en la orejuela izquierda.` },
      { id: 'faf-e6', corto: 'con vía accesoria', tipo: 'test', fuente: 'mc-tabla-19-1 · mc-wpw',
        enunciado: 'Una FA en un paciente con síndrome de WPW (vía accesoria). ¿Cuál de estos fármacos de la Tabla 19.1 usarías?',
        opciones: [
          { t: 'Esmolol: es ultracorto y se puede suspender enseguida', porque: `Los fármacos que bloquean el nodo AV pueden precipitar fibrilación ventricular, aunque dure poco (${p(28)}). Su semivida corta no cambia el riesgo del primer bolo.` },
          { t: 'Diltiazem a la dosis habitual: es el más eficaz', porque: `Ni los antagonistas del calcio ni los betabloqueantes ni la digoxina deben usarse con vía accesoria: no frenan la vía y pueden desencadenar FV (${p(28)}).` },
          { t: 'Ninguno: el bloqueo del nodo AV puede precipitar FV', ok: true }],
        explicacion: `<span class="hl-rojo">Ninguno de estos fármacos</span> si la FA nace de una vía accesoria: el bloqueo selectivo del nodo AV puede precipitar fibrilación ventricular (${p(28)}). En el WPW se prefiere cardioversión o amiodarona/procainamida (${p(27)}).` },
      { id: 'faf-e7', corto: 'la nota del R1', tipo: 'error', fuente: 'mc-tabla-19-1 · mc-amiodarona-iv · mc-fa-punto-final',
        enunciado: 'La nota de un R1 sobre el control agudo de una FA. Encuentra los errores.',
        frases: [
          { t: 'Diltiazem 0,25 mg/kg en 2 min y después 5-15 mg/h.' },
          { t: 'La amiodarona IV da más hipotensión que el diltiazem, por su efecto inotrópico.', mal: true, c: `La amiodarona IV da <span class="hl">mucho menos hipotensión</span>, y la que da se atribuye al polisorbato 80 (${p(24)}).` },
          { t: 'Digoxina 0,25 mg cada 2 h, sola, para ganar tiempo.', mal: true, c: `La digoxina es lenta y <span class="hl-rojo">no debe usarse sola</span> en el control agudo (${p(22)}-25).` },
          { t: 'Punto final: que desaparezca el déficit de pulso.' }],
        explicacion: 'Dos errores: invertir quién da más hipotensión y usar la digoxina sola.' },
    ],
    profundizar: [
      { id: 'mc-amiodarona-iv', titulo: 'Amiodarona IV: efectos adversos y paso a oral' },
      { id: 'mc-fa-epidemiologia', titulo: 'La FA: frecuencia y tipos' },
    ],
    casos: [
      { id: 'c2', titulo: 'Teodoro, 74 años: la lobectomía que se fue a 148', corto: 'Caso · Teodoro', sub: 'FA postoperatoria; 78 kg; HTA y diabetes',
        paciente: { Edad: '74 años, varón', Peso: '78 kg', Antecedentes: 'HTA y diabetes; una caída hace un año', Motivo: 'Día 2 de una lobectomía' },
        pasos: [
          { momento: 'Día 2 · 06:40', datos: { ECG: 'FC 148, QRS 0,08 s, irregular, sin ondas P', Constantes: 'PA 108/66' }, nuevo: ['ECG', 'Constantes'],
            pregunta: { id: 'c2-1', tipo: 'test', fuente: 'mc-qrs-estrecho-irregular · mc-fig-19-3', modelo: rv('fa', '⚡ La FA en el monitor'),
              enunciado: 'Teodoro está monitorizado. ¿Qué ritmo es?',
              opciones: [
                { t: 'Taquicardia auricular multifocal: P de varias formas', porque: `La TAM tiene P de varias morfologías y PR variable (${p(20)}); aquí no hay P. Tratarla como TAM (corregir pulmón y Mg) dejaría sin frenar una FA a 148.` },
                { t: 'Flúter: las ondas en sierra son regulares', porque: `El flúter es regular y con «dientes de sierra» (${p(19)}); este ritmo es irregular.` },
                { t: 'Fibrilación auricular, irregular y sin ondas P', ok: true }],
              explicacion: `QRS estrecho (0,08 s), irregular y sin ondas P: <span class="hl">fibrilación auricular</span> (${p(20)}). La FA postoperatoria aparece en los primeros 5 días, hasta en el 45 % de la cirugía torácica mayor (${p(21)}).` } },
          { momento: 'Día 2 · 06:50', datos: { Plan: 'control de frecuencia' }, nuevo: ['Plan'],
            pregunta: { id: 'c2-2', tipo: 'test', fuente: 'mc-tabla-19-1', origen: 'ilustrativo: 0,25 × 78 kg = 19,5 mg',
              enunciado: 'Está estable (PA 108/66). ¿Qué pones y cuánto?',
              opciones: [
                { t: 'Digoxina 0,25 mg como único fármaco', porque: `Es lenta y no se usa sola en el control agudo (${p(25)}): seguiría a 148 durante horas.` },
                { t: 'Diltiazem ~20 mg en 2 min y 5-15 mg/h', ok: true },
                { t: 'Cardioversión de 100 J «porque va a 148»', porque: `La cardioversión se reserva a los inestables (${p(25)}); Teodoro mantiene 108/66.` },
                { t: 'Amiodarona 150 mg de entrada', porque: `Es la alternativa si hay resistencia o intolerancia a diltiazem o betabloqueantes (${p(24)}); no se ha probado ninguno.` }],
              explicacion: `Diltiazem (Tabla 19.1, ${p(22)}): <span class="hl">0,25 mg/kg en 2 min</span> → 0,25 × 78 = 19,5 ≈ <span class="hl-verde">20 mg</span>, y 5-15 mg/h.` } },
          { momento: 'Día 2 · 07:20', datos: { Constantes: 'PA 84/50, FC 118', Pulso: '96 (déficit 22)' }, nuevo: ['Constantes', 'Pulso'],
            pregunta: { id: 'c2-3', tipo: 'test', fuente: 'mc-tabla-19-1 · mc-amiodarona-iv', modelo: rv('fa:amio', '⚡ La amiodarona: 125 a la hora 1'),
              enunciado: 'Media hora después del bolo, la PA de Teodoro es 84/50. ¿Y ahora?',
              opciones: [
                { t: 'Otro bolo de diltiazem para bajar más la frecuencia cardíaca', porque: `El diltiazem está limitado por hipotensión (20-30 %) y efecto inotrópico negativo (${p(22)}); un segundo bolo empeora la presión.` },
                { t: 'Esmolol: es ultracorto y se titula', porque: `Es un betabloqueante, con riesgo de hipotensión similar al del diltiazem (Tabla 19.1, ${p(23)}); con 84/50 sumaría otro depresor.` },
                { t: 'Parar el diltiazem y dar amiodarona 150 mg en 10 min', ok: true }],
              explicacion: `Hipotensión del diltiazem (<span class="hl-rojo">20-30 %</span>). La amiodarona es la alternativa con intolerancia al diltiazem (${p(24)}) y da <span class="hl">mucho menos hipotensión</span> (${p(24)}): 150 mg en 10 min, luego 1 mg/min ×6 h.` } },
          { momento: 'Día 2 · 07:40', datos: { Pregunta: 'el adjunto: ¿hasta cuándo frenas?' }, nuevo: ['Pregunta'],
            pregunta: { id: 'c2-4', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'mc-fa-punto-final · mc-fig-19-4',
              enunciado: 'El adjunto pregunta: «¿cuál es tu punto final: una FC concreta?». Tu respuesta tiene dos partes.',
              puntos: [
                `Los estudios usan FC de <span class="hl">80 a 110</span> sin acuerdo: no hay una cifra fija.`,
                `El objetivo más fisiológico es que <span class="hl-verde">desaparezca el déficit de pulso</span> o la PAS variable: que cada latido llegue a la periferia.`],
              explicacion: `Si hay un déficit de pulso de 22 (FC 118, pulso 96), aún no hay punto final aunque la FC esté "baja" (${p(25)}, Fig. 19.4 ${p(22)}).` } },
          { momento: 'Día 3 · 09:00', datos: { Evolución: 'sigue en FA a 96; PA 118/72', Factores: 'HTA, diabetes, 74 años' }, nuevo: ['Evolución', 'Factores'], calculadora: { ir: 'mc-cha2ds2-resultado', nombre: 'CHA₂DS₂-VASc' },
            pregunta: { id: 'c2-5', tipo: 'test', fuente: 'mc-tabla-19-2 · mc-tabla-19-2-indicacion',
              enunciado: 'Abre la calculadora si quieres. ¿Cuántos puntos tiene Teodoro y qué indica?',
              opciones: [
                { t: '2 puntos: solo hay que considerar anticoagular, no es definida', porque: `Se deja una cifra: HTA 1 + diabetes 1 + edad 65-74 años 1 suman 3 (${p(26)}). Con 3 en un varón la indicación es definida (≥2).` },
                { t: '4 puntos: su edad suma 2 por estar cerca de 75', porque: `Los 2 puntos son para >75 años; con 74 años le corresponde 1 de la franja 65-74 (${p(26)}).` },
                { t: '3 puntos: la indicación definida de anticoagular', ok: true }],
              explicacion: `Tabla 19.2 (${p(26)}): HTA 1 + diabetes 1 + edad 65-74 años 1 = <span class="hl-verde">3</span>. En un varón, definida con ≥2 (considerar con 1). Las caídas <span class="hl">no</span> contraindican.` } },
          { momento: 'Día 3 · el giro', datos: { Ecocardio: 'estenosis mitral significativa, aurícula izquierda dilatada' }, nuevo: ['Ecocardio'], calculadora: { ir: 'mc-cha2ds2-resultado', nombre: 'CHA₂DS₂-VASc' },
            pregunta: { id: 'c2-6', tipo: 'test', fuente: 'mc-cardioversion · mc-doac · mc-fa-consecuencias', modelo: rv('fa', '⚡ La FA rápida con el llenado ya malo'),
              enunciado: 'El ecocardiograma muestra una estenosis mitral significativa. ¿Qué cambia?',
              opciones: [
                { t: 'Nada: la puntuación de 3 sigue mandando en la decisión', porque: `La tabla no aplica a la FA valvular (estenosis mitral o prótesis), que siempre se anticoagula (${p(26)}). Seguir la tabla aquí sería seguir una regla fuera de su alcance.` },
                { t: 'La tabla no aplica: anticoagular, mejor warfarina', ok: true },
                { t: 'Mejor un ACOD, que no necesita controles ni ajustes', porque: `En la FA valvular la warfarina sigue siendo superior a los ACOD (${p(27)}); elegir por comodidad deja a Teodoro con peor protección.` }],
              explicacion: `Estenosis mitral significativa = <span class="hl-rojo">FA valvular</span>: la tabla no aplica, siempre se anticoagula y la warfarina es superior a los ACOD (${p(26)}-27). Además explica su mala tolerancia: con el <span class="hl">llenado ya comprometido</span>, una FC rápida baja el volumen sistólico (${p(21)}).`,
              nota: `<b>La fuente no lo dice.</b> El libro no atribuye el 84/50 de Teodoro al diltiazem o a la estenosis; es una lectura de ambos efectos juntos. La hipotensión del diltiazem se da en el 20-30 % (${p(22)}) y la estenosis hace pesar más el llenado (${p(22)}).` } },
          { momento: 'Día 3 · la nota del R1', datos: { 'Nota del R1': 'plan de anticoagulación' }, nuevo: ['Nota del R1'],
            pregunta: { id: 'c2-7', tipo: 'error', fuente: 'mc-cardioversion · mc-doac · mc-amiodarona-iv · mc-warfarina',
              enunciado: 'La nota del R1 sobre la anticoagulación de Teodoro. Encuentra los errores.',
              frases: [
                { t: 'No anticoagulo porque se cayó el año pasado.', mal: true, c: `Una historia de caídas <span class="hl-rojo">no es contraindicación</span>; las contraindicaciones son hemorragia activa, HIC previa, tumor intracraneal, sangrado recurrente de una lesión presente y plaquetas <50.000 (${p(26)}).` },
                { t: 'Warfarina, ajustada a un INR de 2-3.' },
                { t: 'Ojo: la amiodarona inhibe el metabolismo de la warfarina, así que vigilo el INR.' },
                { t: 'Mejor un ACOD, sin controles, aunque tenga estenosis mitral.', mal: true, c: `En la FA valvular la <span class="hl">warfarina sigue siendo superior</span> a los ACOD (${p(27)}).` }],
              explicacion: 'Dos errores: temer la caída y elegir un ACOD con estenosis mitral.',
              nota: `<b>La fuente no lo dice.</b> La frase «vigilo el INR» es una deducción: el libro solo afirma que la amiodarona inhibe el metabolismo de la warfarina (${p(25)}). Al pasar de amiodarona IV a oral: 400 mg oral 4-5 h antes de parar la infusión, 400 mg cada 12 h hasta una carga total de 10 g y luego 100-200 mg/día (${p(25)}).` } },
        ],
        lleva: [
          'Los 20 mg de diltiazem salen de 0,25 mg/kg × 78 kg; si la PA cae, la amiodarona da mucha menos hipotensión.',
          'El punto final no es una FC fija: es que desaparezca el déficit de pulso.',
          'La estenosis mitral saca a Teodoro de la tabla CHA₂DS₂-VASc: siempre se anticoagula, y mejor con warfarina.' + enFicha('mc-fa-cardioversion', 'mc-tabla-19-2-indicacion')],
        volver: { nombre: 'El punto final del control de frecuencia', ancla: 'mc-fa-punto-final', modelo: rv('fa:amio', '⚡ La FA con amiodarona: 142 → 125 (hora 1) → 101 (hora 6); Teodoro, a 96 el día 3') } },
    ],
  },
};
