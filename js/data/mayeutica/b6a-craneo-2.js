// Mayéutica del bloque 6a, grupo 6D «El cráneo que sangra y se hincha» · fichas mn-ictus-soporte y mn-ictus-complicaciones
// (Marino, cap. 47, págs. 34-41 del PDF). Datos puros; formato de b1-fluidos.js. Ids de pregunta: mni- (soporte), mnk- (complicaciones).
// «Compruébalo» abre el cráneo vivo en el paciente y el paso de `modelo: { craneoVivo: 'paciente:paso' }` (penumbra y tPA no tienen estado propio: calculadora o figura). Otras fuentes (REGLAS §1.15): Libro Azul (autorregulación) y DESTINY II (resumen en PubMed).
const PDF = 'docs/marino-2024-neurologia-caps45-47.pdf';
const pag = (n, txt) => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">${txt || `PDF pág. ${n}`}</a>`;
const enFicha = (tab, id) => ` <button type="button" class="may-ir" data-especialidad="libros" data-view="marinoNeuro" data-panel="panel-marino-neuro-tabs" data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const LIBRO_AZUL = '<a class="biblio-link" href="docs/libro-azul-seccion-viii-neurologia-parte1.pdf#page=11" target="_blank" rel="noopener">Libro Azul, PDF pág. 11</a>';
const DESTINY = '<a class="biblio-link" href="https://pubmed.ncbi.nlm.nih.gov/24645942/" target="_blank" rel="noopener">DESTINY II (PubMed 24645942)</a>';

export const MAYEUTICA_CRANEO_2 = {
  /* =================================================================================================
     Ficha 11 · Ictus isquémico: medidas generales (cap. 47, págs. 34-37)
     ================================================================================================= */
  'mn-ictus-soporte': {
    entrada: 'Por qué en el ictus isquémico no se baja la presión de más ni se da oxígeno de más, qué fármacos sí y cuáles no, cómo se trata la hipotensión, y qué hacer con la glucosa y la fiebre.',
    guia: [
      { id: 'mni-g1', corto: 'bajar la PAM', tipo: 'test', fuente: 'mn-isq-hta', calculadora: { ir: 'mn-pa-calc', nombre: '¿Bajo la presión en este ictus isquémico?' },
        enunciado: 'Antes de mirar la ficha, predice: a un hombre con un infarto de cerebral media le bajas la PAM un 25 % el primer día. ¿Qué le pasa a la zona de penumbra, la que rodea al infarto?',
        opciones: [
          { t: 'Nada: la autorregulación cerebral mantiene el flujo', porque: 'Eso vale para el cerebro sano. En el ictus la autorregulación está alterada (' + pag(36, 'pág. 36') + ') y si esperas que proteja el flujo, bajarás la presión a ciegas.' },
          { t: 'Pierde flujo: con la autorregulación alterada, el flujo sigue a la presión', ok: true },
          { t: 'Mejora: con menos presión hay menos edema en la penumbra y se protege la zona que rodea al infarto', porque: 'La ficha no lo recoge: bajar la PA en los primeros días no ha mejorado el pronóstico (' + pag(36, 'pág. 36') + '). Con ese razonamiento dejarías sin riego una zona que aún se podía salvar.' }],
        explicacion: 'Más del <span class="hl">60 %</span> de los ictus tiene la PA alta: es una respuesta que <span class="hl-azul">mantiene el flujo de la penumbra</span>. Como la autorregulación está alterada, el flujo depende de la presión y su bajada precoz no ha mejorado los resultados (' + pag(36, 'pág. 36') + ').',
        nota: '<b>Otra fuente.</b> En el cerebro sano el flujo se mantiene casi constante con una presión de perfusión de 50 a 150 mmHg (autorregulación); el ictus pierde esa meseta (' + LIBRO_AZUL + '). Marino lo dice solo en palabras.' },
      { id: 'mni-g2', corto: 'el oxígeno de más', tipo: 'test', fuente: 'mn-isq-oxigeno · mn-isq-o2-recomendacion', calculadora: { ir: 'mn-o2-calc', nombre: '¿Y la SaO₂ de este paciente con ictus?' },
        enunciado: 'Un paciente con ictus tiene una SaO₂ de 98 % con gafas nasales. ¿Por qué es mala idea mantener el oxígeno de más?',
        opciones: [
          { t: 'Vasoconstricción cerebral y radicales libres', ok: true },
          { t: 'Porque provoca hipercapnia por narcosis de CO₂', porque: 'Es un mecanismo del EPOC que Marino no cita aquí. Si lo crees, vigilarás la PaCO₂ y dejarás pasar el efecto real: el O₂ frena el flujo cerebral (' + pag(35, 'pág. 35') + ').' },
          { t: 'Porque dilata las arteriolas y sube la presión intracraneal', porque: 'Es al revés: el O₂ es vasoconstrictor en todos los lechos salvo el pulmón (' + pag(35, 'pág. 35') + '). Pensar en vasodilatación te haría temer un efecto que no ocurre.' }],
        explicacion: 'El O₂ es <span class="hl-azul">vasoconstrictor</span> fuera del pulmón: al 100 % baja el flujo cerebral un <span class="hl-rojo">15-30 %</span>, y además produce especies reactivas de oxígeno. Una SaO₂ >94 % se asoció a peor evolución neurológica. La guía pide O₂ solo con SaO₂ <90 % y, a la vez, mantener >94 %; el autor propone <span class="hl-verde">90-92 %</span> (' + pag(35, 'pág. 35') + ').' },
      { id: 'mni-g3', corto: 'presión positiva', tipo: 'test', fuente: 'mn-isq-vm',
        enunciado: 'Intubas a una paciente con ictus extenso y la consciencia no le protege la vía aérea. ¿Qué riesgo cerebral tiene la presión positiva?',
        opciones: [
          { t: 'Baja la PaCO₂ y, con ella, la presión intracraneal', porque: 'La ficha dice lo contrario. Si cuentas con ese alivio, no vigilarás que el ventilador pueda empeorar la perfusión del cerebro (' + pag(35, 'pág. 35') + ').' },
          { t: 'Sube la presión intracraneal y baja la de perfusión cerebral', ok: true },
          { t: 'Ninguno: solo importa en la hemorragia cerebral', porque: 'Marino lo advierte en el ictus isquémico (' + pag(35, 'pág. 35') + '). Si lo descartas, ventilarás sin tener en cuenta que baja el flujo a una penumbra que depende de la presión.' }],
        explicacion: 'Está indicada si la consciencia no protege la vía aérea o hay fracaso respiratorio que no se maneja de otro modo; pero <span class="hl-rojo">la presión positiva puede subir la PIC y bajar la PPC</span>, por lo que se usa con juicio (' + pag(35, 'pág. 35') + ').' },
      { id: 'mni-g4', corto: 'el nitroprusiato', tipo: 'test', fuente: 'mn-isq-evitar · mn-tabla-47-2',
        enunciado: 'Quieres bajar la PA en un ictus que lo necesita. ¿Por qué no el nitroprusiato?',
        opciones: [
          { t: 'Porque es un betabloqueante puro', porque: 'Los betabloqueantes puros se evitan por bajar el gasto (' + pag(36, 'pág. 36') + '), pero Marino excluye el nitroprusiato por otra razón: la presión intracraneal.' },
          { t: 'Porque baja el gasto cardíaco como el metoprolol', porque: 'Eso lo dice Marino de los betabloqueantes puros (' + pag(36, 'pág. 36') + '), no del nitroprusiato. Confundirlos te llevaría a evitar el fármaco por un motivo equivocado.' },
          { t: 'Porque sube la presión intracraneal', ok: true }],
        explicacion: '<span class="hl-rojo">Nitroprusiato, no</span>: aumenta la presión intracraneal. Los betabloqueantes puros tampoco, porque bajan el gasto. Se usan labetalol, nicardipina o clevidipina (Tabla 47.2) (' + pag(36, 'pág. 36') + ').' },
      { id: 'mni-g5', corto: 'la hipotensión', tipo: 'test', fuente: 'mn-isq-hipotension',
        enunciado: 'Un paciente con ictus tiene 85/50 y una fibrilación auricular a 140. Ya ha recibido líquido. ¿Qué vasopresor eliges y hasta dónde?',
        opciones: [
          { t: 'Noradrenalina, porque es el vasopresor de primera línea en cualquier shock', porque: 'Con una FA rápida Marino prefiere la fenilefrina (' + pag(37, 'pág. 37') + '). La noradrenalina vale cuando no hay FA rápida; elegirla aquí empuja la frecuencia en un corazón ya descontrolado.' },
          { t: 'Fenilefrina, con PAM por encima de 65 mmHg', ok: true },
          { t: 'Ninguno: la hipotensión se tolera en el ictus para no aumentar el edema', porque: 'Es lo contrario: con la autorregulación alterada, corregir la hipotensión es obligatorio (' + pag(37, 'pág. 37') + '). Tolerarla es dejar sin flujo la penumbra.' }],
        explicacion: 'Con la autorregulación alterada, <span class="hl-rojo">corregir ya la hipotensión</span>: líquidos si hay hipovolemia y, si hace falta, <span class="hl">fenilefrina</span> con FA rápida o noradrenalina en los demás casos. No hay objetivo fijado; parece razonable una presión mayor de lo habitual, <span class="hl-verde">PAM >65</span> (' + pag(37, 'pág. 37') + ').' },
      { id: 'mni-g6', corto: 'glucosa y fiebre', tipo: 'test', fuente: 'mn-isq-glucemia · mn-isq-fiebre',
        enunciado: 'A las 30 h del ictus, glucosa de 215 mg/dL y 38,4 °C. ¿Qué haces?',
        opciones: [
          { t: 'Insulina para dejar 140-180, sin sueros glucosados; busco infección y bajo la fiebre', ok: true },
          { t: 'Insulina hasta glucosa normal (<110) y dejo la fiebre, que es de origen cerebral', porque: 'Un control tan estricto arriesga hipoglucemia (' + pag(37, 'pág. 37') + '). Y la fiebre se trata y se busca su foco: muchos ictus febriles tienen infección.' },
          { t: 'Solo bajo la fiebre con hipotermia terapéutica, porque mejora el pronóstico del ictus isquémico', porque: 'El manejo dirigido de temperatura no mejora los resultados del ictus isquémico (' + pag(37, 'pág. 37') + '). Y tampoco resuelve la glucosa por encima de 180.' }],
        explicacion: 'Glucosa >180: tratar con objetivo <span class="hl-verde">140-180</span> y sin glucosados (un control más estricto arriesga hipoglucemia). Fiebre en las primeras 24-48 h: <span class="hl">buscar siempre infección</span> y bajarla sin demora; el manejo dirigido de temperatura no mejora el pronóstico (' + pag(37, 'pág. 37') + ').' },
    ],
    examen: [
      { id: 'mni-e1', corto: 'el 15 %', tipo: 'test', fuente: 'mn-isq-hta-recomendaciones · mn-tabla-47-1',
        enunciado: 'Ictus isquémico sin trombólisis ni trombectomía. A las 10 h la PA es 240/130. ¿Cuál es el objetivo a las 24 h?',
        opciones: [
          { t: 'Menos de 180/105', porque: 'Es el objetivo tras trombólisis o trombectomía (' + pag(36, 'pág. 36') + '). Sin ellas llevarlo a 180/105 es un descenso mayor del 15 % que la guía desaconseja.' },
          { t: 'Una PAS de unos 204: probablemente no bajar más del 15 % en 24 h', ok: true },
          { t: 'Menos de 140/90, para proteger al paciente de una hemorragia cerebral y de la reperfusión', porque: 'Esa cifra es de algunos protocolos tras reperfusión (' + pag(36, 'pág. 36') + '). Aplicarla aquí baja la PA un 40 % y le quita flujo a la penumbra.' }],
        explicacion: 'Sin trombólisis se baja solo si >220/120 las primeras 72 h, y <span class="hl-rojo">probablemente no más del 15 %</span> en 24 h: 15 % de 240 son 36, o sea una PAS de unos 204 (cuenta nuestra sobre la cifra del libro) (' + pag(36, 'pág. 36') + ').' },
      { id: 'mni-e2', corto: '210/115 sin lisis', tipo: 'test', fuente: 'mn-isq-hta-recomendaciones · mn-tabla-47-1',
        enunciado: 'Ictus sin trombólisis, a las 20 h tiene 210/115 y no hay insuficiencia cardíaca ni otra causa para bajarla. ¿La bajas?',
        opciones: [
          { t: 'Sí, hasta menos de 180/105, que es el objetivo que se aplica a cualquier ictus con la presión alta', porque: 'Es la cifra de después de la trombólisis (' + pag(35, 'pág. 35') + '). Sin ella, bajar una presión que no pasa de 220/120 le quita flujo a la penumbra sin beneficio demostrado.' },
          { t: 'Sí, un 20 % en 24 h para que no sangre', porque: 'Pasarse del 15 % en 24 h es lo que la guía pide evitar (' + pag(36, 'pág. 36') + '); además la cifra no llega al umbral de 220/120.' },
          { t: 'No: sin lisis, el umbral para tratar es >220/120', ok: true }],
        explicacion: 'Sin trombólisis, la PA solo se baja si <span class="hl-rojo">supera 220/120</span> en las primeras 72 h (salvo insuficiencia cardíaca izquierda y similares). 210/115 queda por debajo (' + pag(36, 'pág. 36') + ').' },
      { id: 'mni-e3', corto: 'Tabla 47.2', tipo: 'test', fuente: 'mn-tabla-47-2',
        enunciado: 'Vas a poner nicardipina a un ictus que lo necesita. ¿Qué pauta da la Tabla 47.2?',
        opciones: [
          { t: '1-2 mg/h, duplicando la velocidad cada 2-5 min si hace falta hasta llegar a 21 mg/h', porque: 'Es la clevidipina (' + pag(36, 'pág. 36') + '). Con esa pauta, doble cada pocos minutos, se pasaría de dosis una nicardipina.' },
          { t: '10 mg en bolo y luego 2-8 mg/min', porque: 'Es el labetalol (' + pag(36, 'pág. 36') + '). En mg/min la nicardipina daría una sobredosis enorme.' },
          { t: '5 mg/h, subiendo 2,5 mg/h si hace falta hasta 15 mg/h', ok: true }],
        explicacion: 'Nicardipina: <span class="hl">5 mg/h, +2,5 mg/h</span> hasta un máximo de 15 mg/h; equivalente al labetalol en eficacia y seguridad (' + pag(36, 'pág. 36') + ').' },
      { id: 'mni-e4', corto: 'metoprolol', tipo: 'test', fuente: 'mn-isq-evitar',
        enunciado: 'Trombectomía con reperfusión lograda. Los betabloqueantes puros se evitan en el ictus. ¿Puedes dar metoprolol?',
        opciones: [
          { t: 'No: baja el gasto cardíaco y le quita flujo a la penumbra', porque: 'Es la regla general, pero tiene una excepción justo en este caso (' + pag(36, 'pág. 36') + '). Rechazarlo sin ella te deja sin una opción válida.' },
          { t: 'Sí, 5-10 mg IV cada 6 h, por la reperfusión lograda', ok: true },
          { t: 'Sí, pero solo si hay hipertensión intracraneal', porque: 'Marino no pone esa condición: la excepción es la trombectomía con reperfusión (' + pag(36, 'pág. 36') + '). Esperar a una PIC alta retrasaría el control de la PA.' }],
        explicacion: 'Los betabloqueantes puros bajan el gasto y se evitan en el ictus, pero <span class="hl-verde">el metoprolol 5-10 mg IV cada 6 h</span> puede usarse tras una trombectomía con reperfusión (' + pag(36, 'pág. 36') + ').' },
      { id: 'mni-e5', corto: 'albúmina o salino', tipo: 'test', fuente: 'mn-isq-hipotension',
        enunciado: 'Para reponer volumen en el ictus, ¿qué fluido recomienda la guía y cuál prefiere el autor?',
        opciones: [
          { t: 'Guía: salino isotónico; autor: algo de albúmina al 5 %', ok: true },
          { t: 'Guía: albúmina al 5 %; autor: cristaloide balanceado', porque: 'Están cambiados (' + pag(37, 'pág. 37') + '). Quien lo lea así dará albúmina de entrada «por la guía», cuando la guía dice salino isotónico.' },
          { t: 'Guía y autor: solo coloides sintéticos, para no dar sodio', porque: 'Ninguno lo dice (' + pag(37, 'pág. 37') + '). Los coloides no mostraron diferencia con los cristaloides en el ictus agudo.' }],
        explicacion: 'La guía recomienda <span class="hl">salino isotónico</span> (sin diferencias coloide-cristaloide). El autor prefiere <span class="hl-azul">algo de albúmina al 5 %</span> porque los cristaloides favorecen el edema, sobre todo con hipoalbuminemia (' + pag(37, 'pág. 37') + ').',
        nota: '<b>Opinión del autor.</b> La albúmina es una preferencia de Marino frente a la guía (salino isotónico). Las dos están en la ficha.' + enFicha('mn-ictus-soporte', 'mn-isq-hipotension') },
      { id: 'mni-e6', corto: 'plan del ictus', tipo: 'error', fuente: 'mn-tabla-47-1',
        enunciado: 'Resumen de medidas generales de un ictus tratado con tPA. Encuentra el error.',
        frases: [
          { t: 'Oxígeno solo si la SaO₂ baja de 90 %.' },
          { t: 'Aspirina 325 mg a las 24 h en los que han recibido tPA.' },
          { t: 'Compresión neumática durante 72 h tras el tPA.', mal: true, c: 'Tras la trombólisis la compresión neumática se usa <span class="hl-rojo">las primeras 24 h</span>, no 72.' },
          { t: 'Heparina de bajo peso molecular para prevenir la trombosis venosa.' }],
        explicacion: 'Tabla 47.1: tras trombólisis, aspirina a las 24 h, y compresión neumática solo las primeras 24 h (' + pag(35, 'pág. 35') + ').' },
    ],
    casos: [
      { id: 'mni-caso', titulo: 'Hermenegildo, la presión después del tPA', corto: 'Hermenegildo', sub: 'Un infarto de cerebral media izquierda tratado con trombólisis',
        paciente: { Edad: '58 años', Diagnóstico: 'Infarto de cerebral media izquierda', Tratamiento: 'tPA en urgencias' },
        pasos: [
          { momento: 'UCI · 1 h tras el tPA', datos: { Constantes: 'PA 188/110, SaO₂ 93 % sin oxígeno', Analítica: 'glucosa 215 mg/dL, 37,1 °C' }, nuevo: ['Constantes', 'Analítica'], calculadora: { ir: 'mn-pa-calc', nombre: '¿Bajo la presión en este ictus isquémico?' },
            pregunta: { id: 'mni-p1', tipo: 'test', fuente: 'mn-isq-hta-recomendaciones · mn-tabla-47-2', origen: 'ficha',
              enunciado: 'La PA está en 188/110, una hora después del tPA. ¿Qué haces?',
              opciones: [
                { t: 'Nada: solo se baja por encima de 220/120', porque: 'Ese umbral es para quien no ha recibido trombólisis (' + pag(36, 'pág. 36') + '). Tras el tPA el objetivo es <180/105, y dejarlo así sube el riesgo de hemorragia (' + pag(39, 'pág. 39') + ').' },
                { t: 'Nitroprusiato en perfusión, que baja la PA en minutos', porque: 'Marino lo excluye porque sube la presión intracraneal (' + pag(36, 'pág. 36') + '), justo en un cerebro con riesgo de sangrar tras el tPA.' },
                { t: 'Labetalol 10 mg en bolo y 2-8 mg/min hasta <180/105', ok: true }],
              explicacion: 'Tras la trombólisis, mantener <span class="hl-verde">PA <180/105 durante 24 h</span>: labetalol 10 mg IV y 2-8 mg/min (o nicardipina) (' + pag(36, 'pág. 36') + ').' } },
          { momento: 'UCI · 1 h tras el tPA', datos: { Oxígeno: 'aire ambiente, SaO₂ 93 %' }, nuevo: ['Oxígeno'], calculadora: { ir: 'mn-o2-calc', nombre: '¿Y la SaO₂ de este paciente con ictus?' },
            pregunta: { id: 'mni-p2', tipo: 'test', fuente: 'mn-isq-oxigeno · mn-isq-o2-recomendacion', origen: 'ficha',
              enunciado: 'La SaO₂ es 93 % respirando aire. ¿Le pones oxígeno?',
              opciones: [
                { t: 'Sí, gafas nasales hasta pasar del 94 %, como dice la guía', porque: 'Esa cifra es justo la que se asoció a peor evolución neurológica (' + pag(35, 'pág. 35') + '). Subirla expone a la vasoconstricción cerebral del O₂.' },
                { t: 'No: la SaO₂ no está por debajo de 90 %', ok: true },
                { t: 'Sí, mascarilla con reservorio por si acaso', porque: 'El O₂ al 100 % baja el flujo cerebral un 15-30 % (' + pag(35, 'pág. 35') + '). «Por si acaso» daña a la penumbra que quieres proteger.' }],
              explicacion: 'O₂ <span class="hl-rojo">solo con SaO₂ <90 %</span>. El autor aconseja mantenerla en 90-92 % y no más, porque la guía se contradice al pedir también >94 % (' + pag(35, 'pág. 35') + ').' } },
          { momento: 'UCI · la nota del R1', datos: { 'Nota del R1': 'plan de las primeras horas' }, nuevo: ['Nota del R1'],
            pregunta: { id: 'mni-p3', tipo: 'error', fuente: 'mn-tabla-47-1 · mn-isq-glucemia · mn-isq-fiebre',
              enunciado: 'El R1 escribe el plan de las primeras horas. Encuentra los errores.',
              frases: [
                { t: 'Insulina para dejar la glucosa en 140-180.' },
                { t: 'Suero glucosado al 5 % de mantenimiento.', mal: true, c: 'Hay que <span class="hl-rojo">evitar los sueros con glucosa</span>: empeoran la hiperglucemia (' + pag(37, 'pág. 37') + ').' },
                { t: 'Aspirina 325 mg desde ya.', mal: true, c: 'Tras la trombólisis se espera <span class="hl-rojo">24 h</span> antes de la aspirina (' + pag(35, 'pág. 35') + ' y ' + pag(38, 'pág. 38') + ').' },
                { t: 'Compresión neumática intermitente las primeras 24 h.' },
                { t: 'Si hay fiebre, paracetamol y buscar el foco.' }],
              explicacion: 'Dos errores: el suero glucosado y la aspirina precoz tras el tPA (' + pag(35, 'pág. 35') + ' y ' + pag(37, 'pág. 37') + ').' } },
          { momento: 'Hora 5 · el giro', datos: { Evolución: 'GCS de 15 a 9; PA 192/108', Analítica: 'fibrinógeno 160 mg/dL' }, nuevo: ['Evolución', 'Analítica'],
            pregunta: { id: 'mni-p4', tipo: 'test', fuente: 'mn-isq-hemorragia · mn-isq-hemorragia-tto · mar-img-47-2', origen: 'ficha',
              enunciado: 'El TC es como el de la Figura 47.2: gran hemorragia con desviación de la línea media. ¿Qué haces ya?',
              opciones: [
                { t: 'Vitamina K y concentrado de protrombina, como en la hemorragia por warfarina', porque: 'Esa reversión es de la hemorragia por anticoagulante (' + pag(44, 'pág. 44') + '). Aquí el problema tras el tPA es el fibrinógeno, y no se corrige.' },
                { t: 'Solo ácido tranexámico 1 g, y esperar a ver', porque: 'El tranexámico es la alternativa si no hay crioprecipitado a mano (' + pag(40, 'pág. 40') + '). Con fibrinógeno de 160 pierdes la reposición que hacía falta.' },
                { t: 'Crioprecipitado 10 U (mejor concentrado de fibrinógeno) y neurocirugía', ok: true }],
              explicacion: 'Sangra el 6,4-8,8 % tras el tPA y la PA >180/105 era un factor. Tratamiento: <span class="hl">crioprecipitado 10 U</span>, repetible si el fibrinógeno <200 (mejor <span class="hl-azul">concentrado de fibrinógeno</span>, sin descongelar); tranexámico 1 g en 10 min si no hay; y neurocirugía (' + pag(39, 'pág. 39') + ' y ' + pag(40, 'pág. 40') + ').' } },
          { momento: 'Hora 36', datos: { Constantes: '38,4 °C' }, nuevo: ['Constantes'],
            pregunta: { id: 'mni-p5', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'mn-isq-fiebre',
              enunciado: 'Aparece fiebre de 38,4 °C a las 36 h del ictus. ¿Qué haces?',
              puntos: [
                'Buscar infección en toda fiebre del ictus: muchos tienen foco aunque la fiebre pueda venir del propio infarto.',
                'Bajar la temperatura <span class="hl-rojo">sin demora</span> en las primeras 24-48 h, con paracetamol (Cap. 44).',
                'El manejo dirigido de temperatura <span class="hl">no mejora</span> el pronóstico del ictus isquémico.'],
              explicacion: 'La fiebre en las primeras 24-48 h empeora la recuperación y la mortalidad (' + pag(37, 'pág. 37') + ').' } },
          { momento: 'Día 7', datos: { Evolución: 'crisis tónico-clónica generalizada' }, nuevo: ['Evolución'],
            pregunta: { id: 'mni-p6', tipo: 'test', fuente: 'mn-isq-convulsiones', origen: 'ficha',
              enunciado: 'Primera crisis generalizada, al día 7 del ictus. ¿Qué pauta?',
              opciones: [
                { t: 'Levetiracetam y mantenerlo al alta', ok: true },
                { t: 'Fenitoína un día y retirarla si no repite', porque: 'Tras una crisis sintomática Marino recomienda tratar y seguir tras el alta (' + pag(41, 'pág. 41') + '): una cuarta parte recurre en 4 años.' },
                { t: 'Nada: la profilaxis no se recomienda', porque: 'La que no se recomienda es la profilaxis precoz, sin crisis (' + pag(41, 'pág. 41') + '). Aquí ya hay una crisis y dejarla sin tratar arriesga otra.' }],
              explicacion: 'Un <span class="hl">20 %</span> tiene una crisis la primera semana y una cuarta parte de ellas recurre en 4 años: tratar (p. ej. levetiracetam) y mantenerlo al alta (' + pag(41, 'pág. 41') + ').',
              nota: '<b>Las fuentes discrepan.</b> Aquí Marino da el 20 % de crisis la primera semana; en la Tabla 46.1 de su capítulo de crisis (' + pag(20, 'pág. 20') + ') el ictus isquémico agudo figura con un 2-5 %. Se muestran las dos.' + enFicha('mn-ictus-complicaciones', 'mn-isq-convulsiones') } },
        ],
        lleva: [
          'Tras el tPA, PA <180/105 durante 24 h; sin trombólisis, solo si >220/120 y sin pasar del 15 %.',
          'Oxígeno solo con SaO₂ <90 %; el autor pide 90-92 % y no más.',
          'La hemorragia llega en horas: fibrinógeno (crioprecipitado o concentrado) y neurocirugía.'],
        volver: { nombre: 'Por qué no bajarla', ancla: 'mn-isq-hta' } },
    ],
    profundizar: [
      { id: 'mn-isq-origen', titulo: 'Origen del ictus isquémico' },
      { id: 'mn-isq-hipotension', titulo: 'Hipotensión: albúmina del autor' },
      { id: 'mn-isq-glucemia', titulo: 'Hiperglucemia: mecanismos' },
    ],
  },

  /* =================================================================================================
     Ficha 12 · Ictus isquémico: antitrombóticos, ecocardiograma y complicaciones (cap. 47, págs. 38-41)
     ================================================================================================= */
  'mn-ictus-complicaciones': {
    entrada: 'Qué se previene y qué se busca (embolia pulmonar, recurrencia, émbolos del corazón), y las dos complicaciones que más pesan: la hemorragia tras la trombólisis y el edema.',
    guia: [
      { id: 'mnk-g1', corto: 'profilaxis y TEP', tipo: 'test', fuente: 'mn-isq-tvp',
        enunciado: 'En 3 millones de ictus en Alemania la embolia pulmonar fue solo del 0,4 %. ¿Cambia eso la profilaxis de la trombosis venosa?',
        opciones: [
          { t: 'No: sigue indicada, con HBPM y, tras el tPA, compresión neumática 24 h', ok: true },
          { t: 'Sí: con una incidencia tan baja de embolia pulmonar ya no hace falta ninguna profilaxis', porque: 'Marino lo dice expresamente: aun así la profilaxis está justificada (' + pag(38, 'pág. 38') + '). Retirarla deja a un paciente inmóvil expuesto a una trombosis.' },
          { t: 'Sí: solo se hace con compresión, nunca con heparina', porque: 'La heparina de bajo peso molecular es la elección (' + pag(38, 'pág. 38') + '); la compresión es lo que se usa en las primeras 24 h tras la trombólisis.' }],
        explicacion: 'La embolia pulmonar se cita como complicación frecuente, pero fue del <span class="hl">0,4 %</span>. Aun así, <span class="hl-verde">HBPM</span> y, tras trombólisis, compresión neumática las primeras 24 h (' + pag(38, 'pág. 38') + ').' },
      { id: 'mnk-g2', corto: 'FA y anticoagular', tipo: 'test', fuente: 'mn-isq-aspirina',
        enunciado: 'Mujer con ictus agudo y fibrilación auricular conocida sin anticoagular. ¿Qué antitrombótico pones al ingreso?',
        opciones: [
          { t: 'Aspirina 325 mg, pero solo a partir del día 7', porque: 'Marino la pide al ingreso, o el día 2 si hubo trombólisis (' + pag(38, 'pág. 38') + '). Esperar una semana pierde el beneficio precoz.' },
          { t: 'Aspirina 325 mg al día, por vía oral o rectal', ok: true },
          { t: 'Ninguno hasta tener una resonancia', porque: 'Marino pide empezarla al ingreso (o el día 2 tras trombólisis): evita un ictus por cada 100 tratados (' + pag(38, 'pág. 38') + '). Esperar pierde ese beneficio.' }],
        explicacion: '<span class="hl-verde">Aspirina 325 mg/día</span> desde el ingreso (día 2 si hubo trombólisis); evita un ictus recurrente precoz por cada 100 tratados. <span class="hl-rojo">No se recomienda anticoagular</span> en el ictus agudo (' + pag(38, 'pág. 38') + ').' },
      { id: 'mnk-g3', corto: 'cuándo hacer eco', tipo: 'test', fuente: 'mn-isq-eco',
        enunciado: 'La ficha enumera seis indicaciones de ecocardiograma en el ictus. ¿Cuál de estas NO está entre ellas?',
        opciones: [
          { t: 'Ictus lacunar con causa clara', ok: true },
          { t: 'Fibrilación auricular, actual o previa', porque: 'Sí es indicación (' + pag(38, 'pág. 38') + '): busca trombos en la aurícula. Descartarla te haría perder un origen embólico.' },
          { t: 'Hemocultivos positivos', porque: 'Sí es indicación (' + pag(38, 'pág. 38') + '): sospecha de endocarditis. Sin eco no verías las vegetaciones.' }],
        explicacion: 'Indicaciones: ictus embólico, FA, infarto transmural previo, hemocultivos positivos, tromboembolismo venoso previo e ictus criptogénico. La <span class="hl">transtorácica</span> va primero; la transesofágica, si no aclara (' + pag(38, 'pág. 38') + ').',
        nota: '<b>La fuente no lo dice.</b> El ictus lacunar con causa clara no figura en la lista; que sea «no indicación» se deduce de que no aparece.' },
      { id: 'mnk-g4', corto: 'prueba de burbujas', tipo: 'test', fuente: 'mn-isq-burbujas · mar-img-47-1',
        enunciado: 'Haces una prueba de burbujas con la vista apical de 4 cámaras. ¿Cómo se prepara y qué significa ver burbujas a la izquierda?',
        opciones: [
          { t: 'Unos 10 mL de salino agitado entre dos jeringas; en pocos ciclos a la izquierda, hay cortocircuito', ok: true },
          { t: 'Aire puro de una jeringa; burbujas a la izquierda desde el primer latido son lo normal', porque: 'Se usa salino agitado, no aire (' + pag(38, 'pág. 38') + '). Y que pasen a la izquierda no es normal: indica un cortocircuito derecha-izquierda.' },
          { t: 'Salino agitado, inyectado despacio por una vena de la pierna, para que las burbujas lleguen una a una', porque: 'Debe inyectarse rápido por vía central o del brazo (' + pag(38, 'pág. 38') + '); despacio no sigue la técnica descrita.' }],
        explicacion: 'Unos 10 mL de salino agitado con una llave de tres pasos, inyectados rápido por vía central o periférica del brazo. Las burbujas llenan el corazón derecho y, si hay <span class="hl-rojo">cortocircuito derecha-izquierda</span>, pasan al izquierdo en pocos ciclos (' + pag(38, 'pág. 38') + ' y ' + pag(39, 'pág. 39') + ').' },
      { id: 'mnk-g5', corto: 'riesgo de sangrar', tipo: 'test', fuente: 'mn-isq-hemorragia',
        enunciado: 'Antes del tPA, predice: ¿qué tres factores aumentan el riesgo de hemorragia sintomática?',
        opciones: [
          { t: 'Edad avanzada, glucosa >180 y fibrilación auricular', porque: 'La edad avanzada sí cuenta, pero la glucosa y la fibrilación auricular no figuran entre los factores (' + pag(39, 'pág. 39') + '); falta la PA >180/105. Te distraerías de lo que sí se corrige.' },
          { t: 'Edad avanzada, PA >180/105 e infarto de más de un tercio del hemisferio', ok: true },
          { t: 'Edad joven, PA baja e infarto lacunar pequeño', porque: 'Son al revés de lo que dice la ficha (' + pag(39, 'pág. 39') + '). Con esta idea confiarías de más en el paciente que más riesgo tiene.' }],
        explicacion: 'Hemorragia sintomática en el <span class="hl-rojo">6,4-8,8 %</span> tras trombólisis. Factores: <span class="hl">edad avanzada, PA >180/105 y ictus de más de un tercio de un hemisferio</span>. Por eso 24 h en UCI o unidad de ictus (' + pag(39, 'pág. 39') + ').' },
      { id: 'mnk-g6', modelo: { craneoVivo: 'clotilde:1' }, corto: 'dos edemas', tipo: 'test', fuente: 'mn-isq-edema',
        enunciado: 'Una paciente con un infarto muy extenso empeora al segundo día. ¿Qué dos tipos de edema tiene y cuál crece con el tamaño del infarto?',
        opciones: [
          { t: 'Citotóxico (necrosis) y vasogénico (barrera rota); más área, más edema', ok: true },
          { t: 'Solo vasogénico, por la rotura de la barrera; a mayor área, igual edema', porque: 'Marino distingue los dos tipos y dice que cuanto mayor el área, más edema (' + pag(40, 'pág. 40') + '). Ignorar el citotóxico es olvidar la necrosis.' },
          { t: 'Citotóxico (necrosis) y vasogénico (barrera rota); el tamaño no influye', porque: 'Marino dice que cuanto mayor el área isquémica, más edema (' + pag(40, 'pág. 40') + '). Creer que el tamaño no importa subestima el riesgo del infarto extenso.' }],
        explicacion: 'Hemorragia y edema son los que más determinan el mal pronóstico. <span class="hl-azul">Citotóxico</span> (necrosis celular) y <span class="hl-azul">vasogénico</span> (pérdida del control vascular y rotura de la barrera). Cuanto mayor el área isquémica, más edema (' + pag(40, 'pág. 40') + ').' },
      { id: 'mnk-g7', corto: 'sin catéter de PIC', tipo: 'test', fuente: 'mn-isq-edema-manejo · mn-tabla-47-3', calculadora: { ir: 'mn-hiper-calc', nombre: 'Bolo de salino hipertónico (Tabla 47.3)' },
        enunciado: 'El edema de un infarto empeora la clínica. ¿Colocas un catéter de PIC y qué administras?',
        opciones: [
          { t: 'Sí, el catéter, y manitol en perfusión continua', porque: 'La monitorización de la PIC no se recomienda en el isquémico (' + pag(40, 'pág. 40') + ') y el manitol es menos eficaz que el hipertónico (' + pag(41, 'pág. 41') + ').' },
          { t: 'No: basta la clínica; salino hipertónico en bolos, Na⁺ 145-155', ok: true },
          { t: 'No; hipertónico en perfusión continua para tener un nivel estable', porque: 'Marino prefiere los bolos porque su efecto es más rápido (' + pag(41, 'pág. 41') + '). La perfusión continua tarda más en bajar la presión de un cerebro que se está hinchando.' }],
        explicacion: 'No se monitoriza la PIC: basta vigilar la clínica. Si el edema empeora al paciente, <span class="hl-verde">salino hipertónico</span> (más eficaz que el manitol), <span class="hl">en bolos</span>, con <span class="hl-verde">Na⁺ 145-155 mEq/L</span>; no se ha demostrado que cambie el pronóstico (' + pag(40, 'pág. 40') + ' y ' + pag(41, 'pág. 41') + ').' },
    ],
    examen: [
      { id: 'mnk-e1', corto: 'Tabla 47.3', tipo: 'test', fuente: 'mn-tabla-47-3',
        enunciado: 'Un adulto necesita un bolo de NaCl al 23,4 % por el edema cerebral. ¿Qué da la Tabla 47.3?',
        opciones: [
          { t: '100 mL, o entre 2 y 4 mL/kg', porque: 'Es el bolo del NaCl 7,5 % (' + pag(41, 'pág. 41') + '). Con el 23,4 %, mucho más concentrado, esa dosis sería una sobrecarga de sodio.' },
          { t: '24-48 mL', porque: 'Es el bolo del NaCl 14,6 % (' + pag(41, 'pág. 41') + '). Con el 23,4 % es otra concentración y otra dosis.' },
          { t: '30 mL, o 0,68-2 mL/kg', ok: true }],
        explicacion: 'NaCl 23,4 %: <span class="hl">30 mL o 0,68-2 mL/kg</span>. Las más concentradas sirven con menos volumen; hay otros bolos para 3 % (250 mL o 5 mL/kg), 5 % (100 mL), 7,5 % (100 mL o 2-4 mL/kg) y 14,6 % (24-48 mL) (' + pag(41, 'pág. 41') + ').',
        nota: '<b>Las fuentes discrepan.</b> La Tabla 47.3 da dos cifras para cada bolo y no coinciden en un adulto de 70 kg (p. ej., NaCl 3 %: 250 mL o 5 mL/kg = 350 mL). Se muestran las dos.' + enFicha('mn-ictus-complicaciones', 'mn-tabla-47-3') },
      { id: 'mnk-e2', corto: 'fibrinógeno concentrado', tipo: 'test', fuente: 'mn-isq-hemorragia-tto',
        enunciado: 'Hemorragia tras el tPA. ¿Por qué Marino prefiere el concentrado de fibrinógeno al crioprecipitado?',
        opciones: [
          { t: 'No hay que descongelarlo y su concentración es constante', ok: true },
          { t: 'Porque contiene además plaquetas y factores de coagulación', porque: 'No es lo que dice Marino (' + pag(40, 'pág. 40') + '). Contar con otros factores te haría esperar efectos que el concentrado de fibrinógeno no tiene.' },
          { t: 'Porque tiene menos riesgo de transmitir infecciones', porque: 'Marino da solo dos ventajas, sin hablar de infecciones (' + pag(40, 'pág. 40') + '): no hay retraso de descongelación y la concentración es constante.' }],
        explicacion: 'El crioprecipitado debe descongelarse (retraso de al menos 20 min). El concentrado de fibrinógeno <span class="hl-verde">se empieza al momento</span> y su concentración es más consistente (20 g/L) (' + pag(40, 'pág. 40') + ').' },
      { id: 'mnk-e3', corto: 'cuándo tranexámico', tipo: 'test', fuente: 'mn-isq-hemorragia-tto',
        enunciado: 'Hemorragia sintomática tras el tPA. ¿Cuándo das ácido tranexámico 1.000 mg en 10 min?',
        opciones: [
          { t: 'Siempre, junto al crioprecipitado, para sumar los dos efectos sobre la coagulación', porque: 'Marino lo pone como alternativa, no como suma (' + pag(40, 'pág. 40') + '). Dar ambos no está respaldado por el texto.' },
          { t: 'Si el crioprecipitado no está inmediatamente disponible', ok: true },
          { t: 'Solo con fibrinógeno normal', porque: 'No lo condiciona al fibrinógeno (' + pag(40, 'pág. 40') + '): lo condiciona a no tener crioprecipitado a mano.' }],
        explicacion: 'Si no hay crioprecipitado a mano, <span class="hl">ácido tranexámico 1.000 mg IV en 10 min</span> (' + pag(40, 'pág. 40') + ').' },
      { id: 'mnk-e4', corto: 'cuándo pensar en FOP', tipo: 'test', fuente: 'mn-isq-fop',
        enunciado: 'Varón de 48 años con un ictus sin causa aparente. ¿Qué piensas del foramen oval permeable?',
        opciones: [
          { t: 'Que es la causa y hay que cerrarlo ya con un catéter', porque: 'Un FOP no prueba que sea la causa (' + pag(39, 'pág. 39') + '). Cerrarlo de urgencia sin esa certeza expone al paciente a un procedimiento innecesario.' },
          { t: 'Que es una causa posible: buscarlo y, si hay buena recuperación, cerrarlo más adelante', ok: true },
          { t: 'Que solo se busca en mayores de 55 años, porque en ellos el ictus sin causa es más frecuente', porque: 'Es al revés: se busca sin causa aparente, p. ej. en menores de 55 (' + pag(38, 'pág. 38') + '). Si lo limitas a mayores, no lo buscarás en quien más te interesa.' }],
        explicacion: 'Se piensa en el FOP cuando no hay causa aparente (p. ej., <span class="hl">menores de 55 años</span>) o hay tromboembolismo venoso previo. Su presencia <span class="hl-rojo">no demuestra</span> la causa, pero justifica cerrarlo más adelante si la recuperación es buena (' + pag(38, 'pág. 38') + ' y ' + pag(39, 'pág. 39') + ').' },
      { id: 'mnk-e5', corto: 'las crisis', tipo: 'test', fuente: 'mn-isq-convulsiones',
        enunciado: 'Tras un ictus isquémico, ¿qué proporción de las crisis de la primera semana recurre en los 4 años siguientes?',
        opciones: [
          { t: 'Alrededor de la mitad', porque: 'La ficha dice una cuarta parte (' + pag(41, 'pág. 41') + '). Con la mitad se sobrestima el riesgo y se mantendría el antiepiléptico sin criterio.' },
          { t: 'Un 20 %', porque: 'El 20 % es la proporción con crisis la primera semana, no la que recurre (' + pag(41, 'pág. 41') + '). Confundirlos sobrestima el riesgo de recurrencia.' },
          { t: 'Una cuarta parte', ok: true }],
        explicacion: 'Un 20 % tiene una crisis sintomática la primera semana y <span class="hl">una cuarta parte</span> recurre en 4 años (' + pag(41, 'pág. 41') + ').',
        nota: '<b>Las fuentes discrepan.</b> 20 % la primera semana (cap. 47, ' + pag(41, 'pág. 41') + ') frente a 2-5 % en la Tabla 46.1 de su capítulo de crisis (' + pag(20, 'pág. 20') + '). Se muestran las dos.' },
      { id: 'mnk-e6', corto: 'aspirina', tipo: 'error', fuente: 'mn-isq-aspirina',
        enunciado: 'Resumen de la antiagregación en un ictus agudo. Encuentra el error, si lo hay.',
        frases: [
          { t: 'Aspirina por vía rectal si no puede tragar.' },
          { t: 'Empezar al ingreso.' },
          { t: 'Dosis de 325 mg al día.' },
          { t: 'No anticoagular en el ictus agudo.' }],
        explicacion: 'Todo es correcto: aspirina 325 mg/día oral o rectal desde el ingreso, sin anticoagular (' + pag(38, 'pág. 38') + '). Si no encontraste error, lo hiciste bien.' },
    ],
    casos: [
      { id: 'mnk-caso', titulo: 'Clotilde, el infarto que se hincha', corto: 'Clotilde', sub: 'Un infarto de más de un tercio del hemisferio derecho',
        paciente: { Edad: '66 años, 65 kg', Antecedentes: 'fibrilación auricular sin anticoagular', Diagnóstico: 'Infarto de más de un tercio del hemisferio derecho' },
        pasos: [
          { momento: 'Día 1', datos: { Evolución: 'estable, FA conocida' }, nuevo: ['Evolución'],
            pregunta: { id: 'mnk-p1', tipo: 'test', fuente: 'mn-isq-eco · mn-isq-burbujas', origen: 'ficha',
              enunciado: 'Quieres buscar el origen del ictus. ¿Qué eco pides?',
              opciones: [
                { t: 'Eco transtorácica por la FA; transesofágica si no aclara', ok: true },
                { t: 'Prueba de burbujas primero, para descartar un foramen oval permeable como causa del ictus', porque: 'Ya hay una causa probable (FA) y tiene 66 años; el FOP se busca sin causa aparente o en menores de 55 (' + pag(38, 'pág. 38') + '). Perderías tiempo.' },
                { t: 'Transesofágica directa: es la más sensible', porque: 'Es la más sensible pero Marino la reserva para cuando la transtorácica, mucho más fácil, no aclara (' + pag(38, 'pág. 38') + ').' }],
              explicacion: 'FA = indicación de eco. La <span class="hl">transtorácica</span> primero y la transesofágica si no es concluyente; las burbujas, solo sin causa aparente o con tromboembolismo previo (' + pag(38, 'pág. 38') + ').' } },
          { momento: 'Día 2', datos: { Evolución: 'GCS de 15 a 12', Analítica: 'Na⁺ 138 mEq/L' }, nuevo: ['Evolución', 'Analítica'], calculadora: { ir: 'mn-hiper-calc', nombre: 'Bolo de salino hipertónico (Tabla 47.3)' },
            pregunta: { id: 'mnk-p2', modelo: { craneoVivo: 'clotilde:3' }, tipo: 'test', fuente: 'mn-isq-edema-manejo · mn-tabla-47-3', origen: 'ficha; la cuenta en mL/kg, con el peso del caso',
              enunciado: 'El edema la empeora. ¿Qué haces?',
              opciones: [
                { t: 'Catéter de PIC y manitol en perfusión', porque: 'La monitorización de la PIC no se recomienda en el isquémico (' + pag(40, 'pág. 40') + ') y el manitol es menos eficaz que el hipertónico (' + pag(41, 'pág. 41') + ').' },
                { t: 'NaCl 3 % en bolo (250 mL o 5 mL/kg), Na⁺ 145-155', ok: true },
                { t: 'NaCl 3 % en perfusión continua para sostener el sodio', porque: 'El bolo es preferible porque su efecto es más rápido (' + pag(41, 'pág. 41') + '); con perfusión continua tardas más en actuar sobre el edema.' }],
              explicacion: 'Sin catéter de PIC, <span class="hl-verde">hipertónico en bolos</span> y Na⁺ objetivo <span class="hl-verde">145-155</span> (' + pag(40, 'pág. 40') + ' y ' + pag(41, 'pág. 41') + ').',
              nota: '<b>Las fuentes discrepan.</b> La Tabla 47.3 da dos cifras para el bolo de NaCl 3 %: 250 mL o 5 mL/kg, que en Clotilde (65 kg) son 325 mL. Se muestran las dos.' + enFicha('mn-ictus-complicaciones', 'mn-tabla-47-3') } },
          { momento: 'Día 3', datos: { Analítica: 'Na⁺ 149 mEq/L', Evolución: 'más despierta' }, nuevo: ['Analítica', 'Evolución'],
            pregunta: { id: 'mnk-p3', tipo: 'error', fuente: 'mn-isq-aspirina · mn-isq-convulsiones · mn-isq-tvp',
              enunciado: 'Plan del R1 para el día 3. Encuentra los errores.',
              frases: [
                { t: 'Na⁺ de 149, dentro del objetivo.' },
                { t: 'Aspirina 325 mg al día.' },
                { t: 'Heparina a dosis plena por la fibrilación auricular.', mal: true, c: 'La anticoagulación <span class="hl-rojo">no está indicada</span> en el ictus agudo (' + pag(38, 'pág. 38') + ').' },
                { t: 'Levetiracetam profiláctico por el gran infarto.', mal: true, c: 'La profilaxis precoz <span class="hl-rojo">no se recomienda</span> (' + pag(41, 'pág. 41') + ').' },
                { t: 'HBPM profiláctica.' }],
              explicacion: 'Dos errores: la anticoagulación y la profilaxis antiepiléptica precoz (' + pag(38, 'pág. 38') + ' y ' + pag(41, 'pág. 41') + ').' } },
          { momento: 'Día 4', datos: { Analítica: 'Na⁺ 157 mEq/L tras otro bolo' }, nuevo: ['Analítica'],
            pregunta: { id: 'mnk-p4', tipo: 'test', fuente: 'mn-isq-edema-manejo', origen: 'ficha',
              enunciado: 'El sodio es 157 mEq/L. ¿Pones otro bolo?',
              opciones: [
                { t: 'Sí: más sodio significa más descompresión y mejor pronóstico', porque: 'El objetivo es 145-155 (' + pag(41, 'pág. 41') + '); pasarse es seguir llevando un sodio que ya excede ese rango, sin beneficio demostrado.' },
                { t: 'Sí, pero de manitol para compensar', porque: 'Marino no lo propone (' + pag(41, 'pág. 41') + '): el manitol es menos eficaz y no corrige un sodio fuera de rango.' },
                { t: 'No: está por encima del objetivo de 145-155', ok: true }],
              explicacion: 'El Na⁺ objetivo es <span class="hl-verde">145-155 mEq/L</span>; con 157 no se dan más bolos (' + pag(41, 'pág. 41') + ').' } },
          { momento: 'Día 5 · el giro', datos: { Evolución: 'GCS 8, midriasis derecha', Analítica: 'Na⁺ 152 mEq/L' }, nuevo: ['Evolución', 'Analítica'],
            pregunta: { id: 'mnk-p5', modelo: { craneoVivo: 'clotilde:4' }, tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'mn-isq-hemorragia-tto · mn-isq-edema-manejo · mn-isq-vm',
              enunciado: 'Clotilde sigue empeorando con el sodio en objetivo. ¿Qué toca hacer?',
              puntos: [
                'El hipertónico <span class="hl-rojo">no ha cambiado el pronóstico</span> (' + pag(41, 'pág. 41') + ') y ya no basta: avisar a neurocirugía (extrapolación nuestra: Marino nombra la neurocirugía solo en la hemorragia tras el tPA, ' + pag(40, 'pág. 40') + ').',
                'La hemicraniectomía: Marino solo la nombra en la hemorragia tras el tPA (' + pag(40, 'pág. 40') + '). En el infarto maligno es <span class="hl">otra fuente</span>, DESTINY II (en mayores de 60 años mejoró la supervivencia sin discapacidad grave, 38 % frente a 18 %, pero la mayoría de los supervivientes necesitó ayuda).',
                'Con GCS 8 la consciencia no protege la vía aérea: <span class="hl">intubación y ventilación</span>, con juicio por la presión intracraneal (' + pag(35, 'pág. 35') + ').'],
              explicacion: 'Marino da el primer y el tercer punto (' + pag(41, 'pág. 41') + ' y ' + pag(35, 'pág. 35') + '); el segundo es de otra fuente.',
              nota: '<b>Otra fuente.</b> El dato de la hemicraniectomía es de ' + DESTINY + ' (solo el resumen). DESTINY II aleatorizó «within 48 hours» del inicio: así planteó el ensayo, no es una indicación de plazo. El grado de recomendación y la ventana horaria quedan como <b>fuente pendiente</b>.' } },
        ],
        lleva: [
          'Dos edemas, citotóxico y vasogénico: cuanto mayor el infarto, más edema.',
          'Sin catéter de PIC: hipertónico en bolos, Na⁺ 145-155; si falla, neurocirugía.',
          'No anticoagular ni dar profilaxis antiepiléptica en el ictus agudo.'],
        volver: { nombre: 'Manejo del edema', ancla: 'mn-isq-edema-manejo' } },
    ],
    profundizar: [
      { id: 'mn-isq-tvp', titulo: 'Tromboprofilaxis: el 0,4 % de Alemania' },
      { id: 'mn-isq-eco', titulo: 'Indicaciones del ecocardiograma' },
      { id: 'mn-isq-fop', titulo: 'Foramen oval permeable y su cierre' },
    ],
  },
};
